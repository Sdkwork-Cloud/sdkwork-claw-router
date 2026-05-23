use axum::http::{HeaderMap, HeaderValue, Uri};
use sdkwork_claw_config::{AppSessionConfig, TrustedSubjectConfig};
use sdkwork_claw_http::{
    inject_verified_app_request_subject, inject_verified_trusted_request_subject,
    sign_app_session_token, sign_trusted_request_subject, verify_app_session_token,
    ApiKeyCredentialSource, ApiKeyIdentity, AppSubjectBoundaryConfig, TrustedRequestSubject,
};

#[test]
fn api_key_identity_prefers_authorization_bearer_without_leaking_debug() {
    let mut headers = HeaderMap::new();
    headers.insert(
        "authorization",
        HeaderValue::from_static("Bearer sk-live-secret"),
    );
    headers.insert("x-api-key", HeaderValue::from_static("sk-other"));
    let uri: Uri = "/v1/chat/completions?key=sk-query".parse().unwrap();

    let identity = ApiKeyIdentity::from_headers_and_uri(&headers, &uri).unwrap();

    assert_eq!(Some("sk-live-secret"), identity.credential_secret());
    assert_eq!(
        Some(ApiKeyCredentialSource::AuthorizationBearer),
        identity.credential_source()
    );
    assert!(!format!("{identity:?}").contains("sk-live-secret"));
}

#[test]
fn api_key_identity_supports_google_header_query_key_and_internal_id_context() {
    let mut headers = HeaderMap::new();
    headers.insert("x-goog-api-key", HeaderValue::from_static("sk-google"));
    headers.insert("x-sdkwork-api-key-id", HeaderValue::from_static("100"));
    let uri: Uri = "/v1/models?key=sk-query".parse().unwrap();

    let identity = ApiKeyIdentity::from_headers_and_uri(&headers, &uri).unwrap();

    assert_eq!(Some(100), identity.api_key_id());
    assert_eq!(Some("sk-google"), identity.credential_secret());
    assert_eq!(
        Some(ApiKeyCredentialSource::GoogleApiKeyHeader),
        identity.credential_source()
    );
}

#[test]
fn api_key_identity_uses_query_key_when_headers_are_absent() {
    let headers = HeaderMap::new();
    let uri: Uri = "/v1/models?foo=bar&key=sk-query".parse().unwrap();

    let identity = ApiKeyIdentity::from_headers_and_uri(&headers, &uri).unwrap();

    assert_eq!(None, identity.api_key_id());
    assert_eq!(Some("sk-query"), identity.credential_secret());
    assert_eq!(
        Some(ApiKeyCredentialSource::QueryKey),
        identity.credential_source()
    );
}

#[test]
fn api_key_identity_rejects_invalid_context_without_echoing_input() {
    let mut headers = HeaderMap::new();
    headers.insert(
        "x-sdkwork-api-key-id",
        HeaderValue::from_static("100-secret-invalid"),
    );
    let uri: Uri = "/v1/models".parse().unwrap();

    let error = ApiKeyIdentity::from_headers_and_uri(&headers, &uri).unwrap_err();

    assert_eq!("invalid api key id context", error.to_string());
    assert!(!format!("{error:?}").contains("100-secret-invalid"));
}

#[test]
fn trusted_request_subject_requires_tenant_organization_and_user_context() {
    let mut headers = HeaderMap::new();
    headers.insert("x-sdkwork-tenant-id", HeaderValue::from_static("10"));
    headers.insert("x-sdkwork-organization-id", HeaderValue::from_static("20"));
    headers.insert("x-sdkwork-user-id", HeaderValue::from_static("30"));

    let subject = TrustedRequestSubject::from_headers(&headers).unwrap();

    assert_eq!(10, subject.tenant_id);
    assert_eq!(20, subject.organization_id);
    assert_eq!(30, subject.user_id);
    assert_eq!(30, subject.operator_id);
    assert_eq!(1, subject.operator_type);
}

#[test]
fn trusted_request_subject_rejects_missing_or_invalid_context_without_echoing_input() {
    let headers = HeaderMap::new();
    let missing = TrustedRequestSubject::from_headers(&headers).unwrap_err();
    assert_eq!(
        "x-sdkwork-tenant-id header is required",
        missing.to_string()
    );

    let mut invalid_headers = HeaderMap::new();
    invalid_headers.insert(
        "x-sdkwork-tenant-id",
        HeaderValue::from_static("tenant-secret"),
    );
    invalid_headers.insert("x-sdkwork-organization-id", HeaderValue::from_static("20"));
    invalid_headers.insert("x-sdkwork-user-id", HeaderValue::from_static("30"));

    let invalid = TrustedRequestSubject::from_headers(&invalid_headers).unwrap_err();

    assert_eq!(
        "x-sdkwork-tenant-id header must be a positive integer",
        invalid.to_string()
    );
    assert!(!format!("{invalid:?}").contains("tenant-secret"));
}

#[test]
fn trusted_request_subject_boundary_strips_direct_headers_and_injects_signed_subject() {
    let config =
        TrustedSubjectConfig::from_signing_secret("0123456789abcdef0123456789abcdef").unwrap();
    let subject = TrustedRequestSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
        operator_id: 30,
        operator_type: 1,
    };
    let timestamp = 1_800_000_000;
    let signature = sign_trusted_request_subject(
        &config,
        subject,
        timestamp,
        "POST",
        "/app/v3/api/router/api_keys",
    );
    let mut headers = HeaderMap::new();
    headers.insert("x-sdkwork-tenant-id", HeaderValue::from_static("999"));
    headers.insert(
        "x-sdkwork-subject-tenant-id",
        HeaderValue::from_static("10"),
    );
    headers.insert(
        "x-sdkwork-subject-organization-id",
        HeaderValue::from_static("20"),
    );
    headers.insert("x-sdkwork-subject-user-id", HeaderValue::from_static("30"));
    headers.insert(
        "x-sdkwork-subject-timestamp",
        HeaderValue::from_static("1800000000"),
    );
    headers.insert(
        "x-sdkwork-subject-signature",
        HeaderValue::from_str(&signature).unwrap(),
    );

    inject_verified_trusted_request_subject(
        &mut headers,
        "POST",
        "/app/v3/api/router/api_keys",
        &config,
        timestamp,
    )
    .unwrap();
    let parsed = TrustedRequestSubject::from_headers(&headers).unwrap();

    assert_eq!(subject, parsed);
    assert!(headers.get("x-sdkwork-subject-signature").is_none());
}

#[test]
fn trusted_request_subject_boundary_rejects_bad_signature_without_echoing_input() {
    let config =
        TrustedSubjectConfig::from_signing_secret("0123456789abcdef0123456789abcdef").unwrap();
    let mut headers = HeaderMap::new();
    headers.insert(
        "x-sdkwork-subject-tenant-id",
        HeaderValue::from_static("10"),
    );
    headers.insert(
        "x-sdkwork-subject-organization-id",
        HeaderValue::from_static("20"),
    );
    headers.insert("x-sdkwork-subject-user-id", HeaderValue::from_static("30"));
    headers.insert(
        "x-sdkwork-subject-timestamp",
        HeaderValue::from_static("1800000000"),
    );
    headers.insert(
        "x-sdkwork-subject-signature",
        HeaderValue::from_static("secret-signature"),
    );

    let error = inject_verified_trusted_request_subject(
        &mut headers,
        "POST",
        "/app/v3/api/router/api_keys",
        &config,
        1_800_000_000,
    )
    .unwrap_err();

    assert_eq!("trusted subject signature is invalid", error.to_string());
    assert!(!format!("{error:?}").contains("secret-signature"));
}

#[test]
fn app_session_token_verifies_subject_without_leaking_token_material() {
    let config =
        AppSessionConfig::from_signing_secret("app-session-secret-0123456789abcd").unwrap();
    let subject = TrustedRequestSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
        operator_id: 30,
        operator_type: 1,
    };
    let token = sign_app_session_token(&config, subject, 1_800_000_000, 1_800_000_300);

    let parsed = verify_app_session_token(&config, &token, 1_800_000_001).unwrap();

    assert_eq!(subject, parsed);
    assert!(!format!("{config:?}").contains("app-session-secret"));
}

#[test]
fn app_request_subject_boundary_injects_session_subject_after_stripping_direct_headers() {
    let trusted_subject_config =
        TrustedSubjectConfig::from_signing_secret("0123456789abcdef0123456789abcdef").unwrap();
    let app_session_config =
        AppSessionConfig::from_signing_secret("app-session-secret-0123456789abcd").unwrap();
    let boundary_config =
        AppSubjectBoundaryConfig::new(trusted_subject_config, app_session_config.clone());
    let subject = TrustedRequestSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
        operator_id: 30,
        operator_type: 1,
    };
    let auth_token =
        sign_app_session_token(&app_session_config, subject, 1_800_000_000, 1_800_000_300);
    let access_token =
        sign_app_session_token(&app_session_config, subject, 1_800_000_001, 1_800_000_301);
    let mut headers = HeaderMap::new();
    headers.insert("x-sdkwork-tenant-id", HeaderValue::from_static("999"));
    headers.insert(
        "authorization",
        HeaderValue::from_str(&format!("Bearer {auth_token}")).unwrap(),
    );
    headers.insert(
        "sdkwork-access-token",
        HeaderValue::from_str(&access_token).unwrap(),
    );

    inject_verified_app_request_subject(
        &mut headers,
        "POST",
        "/app/v3/api/router/api_keys",
        &boundary_config,
        1_800_000_001,
    )
    .unwrap();
    let parsed = TrustedRequestSubject::from_headers(&headers).unwrap();

    assert_eq!(subject, parsed);
    assert!(headers.get("authorization").is_none());
    assert!(headers.get("sdkwork-access-token").is_none());
}

#[test]
fn app_request_subject_boundary_skips_session_verification_when_only_authorization_present() {
    let trusted_subject_config =
        TrustedSubjectConfig::from_signing_secret("0123456789abcdef0123456789abcdef").unwrap();
    let app_session_config =
        AppSessionConfig::from_signing_secret("app-session-secret-0123456789abcd").unwrap();
    let boundary_config =
        AppSubjectBoundaryConfig::new(trusted_subject_config, app_session_config.clone());
    let subject = TrustedRequestSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
        operator_id: 30,
        operator_type: 1,
    };
    let auth_token =
        sign_app_session_token(&app_session_config, subject, 1_800_000_000, 1_800_000_300);
    let mut headers = HeaderMap::new();
    headers.insert(
        "authorization",
        HeaderValue::from_str(&format!("Bearer {auth_token}")).unwrap(),
    );

    let result = inject_verified_app_request_subject(
        &mut headers,
        "POST",
        "/app/v3/api/router/api_keys",
        &boundary_config,
        1_800_000_001,
    );

    assert!(result.is_ok());
    assert!(headers.get("authorization").is_some());
}

#[test]
fn app_request_subject_boundary_rejects_mismatched_auth_and_access_subjects() {
    let trusted_subject_config =
        TrustedSubjectConfig::from_signing_secret("0123456789abcdef0123456789abcdef").unwrap();
    let app_session_config =
        AppSessionConfig::from_signing_secret("app-session-secret-0123456789abcd").unwrap();
    let boundary_config =
        AppSubjectBoundaryConfig::new(trusted_subject_config, app_session_config.clone());
    let auth_subject = TrustedRequestSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
        operator_id: 30,
        operator_type: 1,
    };
    let access_subject = TrustedRequestSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 31,
        operator_id: 31,
        operator_type: 1,
    };
    let auth_token = sign_app_session_token(
        &app_session_config,
        auth_subject,
        1_800_000_000,
        1_800_000_300,
    );
    let access_token = sign_app_session_token(
        &app_session_config,
        access_subject,
        1_800_000_001,
        1_800_000_301,
    );
    let mut headers = HeaderMap::new();
    headers.insert(
        "authorization",
        HeaderValue::from_str(&format!("Bearer {auth_token}")).unwrap(),
    );
    headers.insert(
        "sdkwork-access-token",
        HeaderValue::from_str(&access_token).unwrap(),
    );

    let error = inject_verified_app_request_subject(
        &mut headers,
        "POST",
        "/app/v3/api/router/api_keys",
        &boundary_config,
        1_800_000_001,
    )
    .unwrap_err();

    assert_eq!(
        "app session auth token and access token subjects do not match",
        error
    );
    assert!(headers.get("authorization").is_none());
    assert!(headers.get("sdkwork-access-token").is_none());
}

#[test]
fn app_session_authorization_header_accepts_case_insensitive_bearer_scheme() {
    let config =
        AppSessionConfig::from_signing_secret("app-session-secret-0123456789abcd").unwrap();
    let subject = TrustedRequestSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
        operator_id: 30,
        operator_type: 1,
    };
    let token = sign_app_session_token(&config, subject, 1_800_000_000, 1_800_000_300);

    let parsed = sdkwork_claw_http::verify_app_session_authorization_header(
        &config,
        &format!("  bearer   {token}  "),
        1_800_000_001,
    )
    .unwrap();

    assert_eq!(subject, parsed);
}

#[test]
fn app_session_token_rejects_tampering_without_echoing_token() {
    let config =
        AppSessionConfig::from_signing_secret("app-session-secret-0123456789abcd").unwrap();
    let subject = TrustedRequestSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
        operator_id: 30,
        operator_type: 1,
    };
    let token = sign_app_session_token(&config, subject, 1_800_000_000, 1_800_000_300);
    let tampered = token.replacen(".30.", ".31.", 1);

    let error = verify_app_session_token(&config, &tampered, 1_800_000_001).unwrap_err();

    assert_eq!("app session token signature is invalid", error.to_string());
    assert!(!format!("{error:?}").contains(&tampered));
}
