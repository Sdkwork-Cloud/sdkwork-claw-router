use axum::body::Body;
use axum::extract::State;
use axum::http::{HeaderMap, Request, StatusCode};
use axum::routing::post;
use axum::{Json, Router};
use sdkwork_claw_config::{
    ApiKeySecurityConfig, DatabaseConfig, DeploymentMode, ProviderSecretMapConfig,
};
use sdkwork_claw_product::application::{ApiKeySecretCodec, Pbkdf2Sha256PasswordHasher};
use sdkwork_claw_product::infrastructure::crypto::RingAeadApiKeySecretCodec;
use sdkwork_claw_test_support::{
    api_key_security_config as test_api_key_security_config,
    app_session_config as test_app_session_config, app_session_dual_token_headers,
    payment_webhook_config as test_payment_webhook_config, trusted_request_subject,
    trusted_subject_config as test_trusted_subject_config,
};
use serde_json::json;
use serde_json::Value;
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};
use sqlx::{Row, SqlitePool};
use std::str::FromStr;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};
use tower::ServiceExt;

const API_KEYS_PATH: &str = "/app/v3/api/iam/api_keys";

static SQLITE_DB_SEQUENCE: AtomicU64 = AtomicU64::new(0);

#[derive(Debug, Default)]
struct CapturedProviderHealthProbe {
    authorization: Option<String>,
    body: Value,
}

#[tokio::test]
async fn database_config_app_api_keys_require_app_session_and_scope_to_subject() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;

    let unauthenticated_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri(API_KEYS_PATH)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, unauthenticated_response.status());

    let response = router
        .oneshot(
            session_authorization_header(
                Request::builder().method("GET").uri(API_KEYS_PATH),
                10,
                20,
                30,
            )
            .body(Body::empty())
            .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body_text = String::from_utf8(body.to_vec()).unwrap();
    let payload: serde_json::Value = serde_json::from_str(&body_text).unwrap();

    assert_eq!("2000", payload["code"]);
    let items = payload["data"]["items"].as_array().unwrap();
    assert_eq!(1, items.len());
    assert_eq!("Owner Key", items[0]["name"]);
    assert_eq!("sk-owner********ABCD", items[0]["maskedKey"]);
    assert_eq!("sk-owner-secret", items[0]["copyableKey"]);
    assert!(items[0].get("keyVal").is_none());
    assert!(items[0].get("fullKey").is_none());
    assert!(!body_text.contains("Other User Key"));
    assert!(!body_text.contains("sk-other-secret"));
    assert!(!body_text.contains("hash:owner"));
    assert!(!body_text.contains("hash:other"));
}

#[tokio::test]
async fn database_config_user_profile_requires_session_and_returns_safe_subject_profile() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_user_data(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;

    let unauthenticated_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/iam/users/current")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, unauthenticated_response.status());

    let (status, payload, body_text) = request_json(
        router,
        session_request(
            "GET",
            "/app/v3/api/iam/users/current",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;

    assert_eq!(StatusCode::OK, status);
    assert_eq!("2000", payload["code"]);
    assert_eq!("Owner User", payload["data"]["displayName"]);
    assert_eq!("owner@example.com", payload["data"]["email"]);
    assert_eq!("+15550000030", payload["data"]["phone"]);
    assert_eq!("zh-CN", payload["data"]["language"]);
    assert_eq!("O", payload["data"]["avatarUrl"]);
    assert_eq!(true, payload["data"]["isVerified"]);
    assert_eq!("active", payload["data"]["status"]);
    assert_eq!("2026-04-01 08:00:00", payload["data"]["registeredAt"]);
    assert_eq!("2026-04-29 10:00:00", payload["data"]["lastLogin"]);
    assert_eq!("203.0.113.***", payload["data"]["lastLoginIp"]);
    assert_eq!(
        "2026-04-20 12:00:00",
        payload["data"]["passwordLastChanged"]
    );
    assert_eq!(true, payload["data"]["twoFactorEnabled"]);
    assert_eq!("2", payload["data"]["thirdPartyBound"]);
    assert!(!body_text.contains("correct-password"));
    assert!(!body_text.contains("pbkdf2-sha256"));
    assert!(!body_text.contains("github-owner-open-id"));
    assert!(!body_text.contains("Other User"));
}

#[tokio::test]
async fn database_config_password_login_issues_app_session_and_records_password_provider_event() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_user_data(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;
    let (login_status, login_payload, login_body_text) = request_json(
        router.clone(),
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/sessions")
            .header("content-type", "application/json")
            .header("X-Request-Id", "password-login-request-1")
            .body(Body::from(
                json!({
                    "grantType": "password",
                    "username": "owner@example.com",
                    "password": "correct-password"
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::OK, login_status);
    assert_eq!("2000", login_payload["code"]);
    let auth_token = login_payload["data"]["authToken"].as_str().unwrap();
    let access_token = login_payload["data"]["accessToken"].as_str().unwrap();
    let refresh_token = login_payload["data"]["refreshToken"].as_str().unwrap();
    assert!(!auth_token.is_empty());
    assert!(!access_token.is_empty());
    assert!(!refresh_token.is_empty());
    assert_ne!(auth_token, access_token);
    assert_eq!("30", login_payload["data"]["user"]["id"]);
    assert_eq!("owner", login_payload["data"]["user"]["username"]);
    assert_eq!("owner@example.com", login_payload["data"]["user"]["email"]);
    assert_eq!("Owner User", login_payload["data"]["user"]["displayName"]);
    assert_eq!("O", login_payload["data"]["user"]["avatarUrl"]);
    assert_eq!(
        "sdkwork-claw-router",
        login_payload["data"]["context"]["appId"]
    );
    assert_eq!("password", login_payload["data"]["context"]["authLevel"]);
    assert_eq!("local", login_payload["data"]["context"]["deploymentMode"]);
    assert_eq!("dev", login_payload["data"]["context"]["environment"]);
    assert_eq!("10", login_payload["data"]["context"]["tenantId"]);
    assert_eq!("20", login_payload["data"]["context"]["organizationId"]);
    assert_eq!("30", login_payload["data"]["context"]["userId"]);
    assert_eq!(
        login_payload["data"]["sessionId"],
        login_payload["data"]["context"]["sessionId"]
    );
    assert_eq!(
        "tenant:10",
        login_payload["data"]["context"]["dataScope"][0]
    );
    assert!(!login_body_text.contains("correct-password"));
    assert!(!login_body_text.contains("pbkdf2-sha256"));

    let (profile_status, profile_payload, profile_body_text) = request_json(
        router,
        Request::builder()
            .method("GET")
            .uri("/app/v3/api/iam/users/current")
            .header("authorization", format!("Bearer {auth_token}"))
            .header("Sdkwork-Access-Token", access_token)
            .body(Body::empty())
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::OK, profile_status);
    assert_eq!("2000", profile_payload["code"]);
    assert_eq!("Owner User", profile_payload["data"]["displayName"]);
    assert_eq!("owner@example.com", profile_payload["data"]["email"]);
    assert!(!profile_body_text.contains("correct-password"));
    assert!(!profile_body_text.contains("pbkdf2-sha256"));

    let verification_pool = create_sqlite_pool(&database_url).await;
    let security_event_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM iam_security_event WHERE tenant_id = '10' AND user_id = '30' AND event_type = 'sessions.create'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let audit_request_id: String = sqlx::query_scalar(
        "SELECT request_id FROM iam_audit_event WHERE actor_user_id = '30' AND action = 'sessions.create'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    verification_pool.close().await;
    assert_eq!(1, security_event_count);
    assert_eq!("password-login-request-1", audit_request_id);
}

#[tokio::test]
async fn database_config_app_session_current_refresh_update_and_logout_use_persisted_session() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_user_data(&pool).await;
    seed_second_app_organization_membership(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;
    let (login_status, login_payload, _) = request_json(
        router.clone(),
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/sessions")
            .header("content-type", "application/json")
            .body(Body::from(
                json!({
                    "grantType": "password",
                    "username": "owner@example.com",
                    "password": "correct-password"
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;
    assert_eq!(StatusCode::OK, login_status);
    let auth_token = login_payload["data"]["authToken"].as_str().unwrap();
    let access_token = login_payload["data"]["accessToken"].as_str().unwrap();
    let refresh_token = login_payload["data"]["refreshToken"].as_str().unwrap();
    let session_id = login_payload["data"]["sessionId"].as_str().unwrap();
    assert_eq!("20", login_payload["data"]["context"]["organizationId"]);

    let (current_status, current_payload, current_body_text) = request_json(
        router.clone(),
        Request::builder()
            .method("GET")
            .uri("/app/v3/api/auth/sessions/current")
            .header("authorization", format!("Bearer {auth_token}"))
            .header("Sdkwork-Access-Token", access_token)
            .body(Body::empty())
            .unwrap(),
    )
    .await;
    assert_eq!(StatusCode::OK, current_status);
    assert_eq!("2000", current_payload["code"]);
    assert_eq!(session_id, current_payload["data"]["sessionId"]);
    assert_eq!("30", current_payload["data"]["user"]["id"]);
    assert_eq!(
        "owner@example.com",
        current_payload["data"]["user"]["email"]
    );
    assert_eq!("20", current_payload["data"]["context"]["organizationId"]);
    assert!(current_payload["data"].get("refreshToken").is_none());
    assert!(!current_body_text.contains("correct-password"));
    assert!(!current_body_text.contains("pbkdf2-sha256"));

    let (refresh_status, refresh_payload, refresh_body_text) = request_json(
        router.clone(),
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/sessions/refresh")
            .header("content-type", "application/json")
            .header("authorization", format!("Bearer {auth_token}"))
            .header("Sdkwork-Access-Token", access_token)
            .body(Body::from(
                json!({
                    "refreshToken": refresh_token
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;
    assert_eq!(StatusCode::OK, refresh_status);
    assert_eq!("2000", refresh_payload["code"]);
    assert_eq!(session_id, refresh_payload["data"]["sessionId"]);
    assert_ne!(auth_token, refresh_payload["data"]["authToken"]);
    assert_ne!(access_token, refresh_payload["data"]["accessToken"]);
    assert_ne!(refresh_token, refresh_payload["data"]["refreshToken"]);
    assert!(!refresh_body_text.contains("correct-password"));

    let new_auth_token = refresh_payload["data"]["authToken"].as_str().unwrap();
    let new_access_token = refresh_payload["data"]["accessToken"].as_str().unwrap();
    let old_current_status = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/auth/sessions/current")
                .header("authorization", format!("Bearer {auth_token}"))
                .header("Sdkwork-Access-Token", access_token)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap()
        .status();
    assert_eq!(StatusCode::UNAUTHORIZED, old_current_status);

    let (update_status, update_payload, _) = request_json(
        router.clone(),
        Request::builder()
            .method("PATCH")
            .uri("/app/v3/api/auth/sessions/current")
            .header("content-type", "application/json")
            .header("authorization", format!("Bearer {new_auth_token}"))
            .header("Sdkwork-Access-Token", new_access_token)
            .body(Body::from(
                json!({
                    "organizationCode": "workspace"
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;
    assert_eq!(StatusCode::OK, update_status);
    assert_eq!("21", update_payload["data"]["context"]["organizationId"]);
    assert_eq!(session_id, update_payload["data"]["sessionId"]);
    let updated_auth_token = update_payload["data"]["authToken"].as_str().unwrap();
    let updated_access_token = update_payload["data"]["accessToken"].as_str().unwrap();

    let (logout_status, logout_payload, _) = request_json(
        router.clone(),
        Request::builder()
            .method("DELETE")
            .uri("/app/v3/api/auth/sessions/current")
            .header("authorization", format!("Bearer {updated_auth_token}"))
            .header("Sdkwork-Access-Token", updated_access_token)
            .body(Body::empty())
            .unwrap(),
    )
    .await;
    assert_eq!(StatusCode::OK, logout_status);
    assert_eq!("2000", logout_payload["code"]);

    let revoked_current_status = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/auth/sessions/current")
                .header("authorization", format!("Bearer {updated_auth_token}"))
                .header("Sdkwork-Access-Token", updated_access_token)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap()
        .status();
    assert_eq!(StatusCode::UNAUTHORIZED, revoked_current_status);

    let verification_pool = create_sqlite_pool(&database_url).await;
    let active_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM iam_session WHERE id = ? AND revoked_at IS NULL")
            .bind(session_id)
            .fetch_one(&verification_pool)
            .await
            .unwrap();
    let refresh_event_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM iam_security_event WHERE session_id = ? AND event_type = 'sessions.refresh'",
    )
    .bind(session_id)
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let update_event_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM iam_security_event WHERE session_id = ? AND event_type = 'sessions.update'",
    )
    .bind(session_id)
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let revoke_event_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM iam_security_event WHERE session_id = ? AND event_type = 'sessions.revoke'",
    )
    .bind(session_id)
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    verification_pool.close().await;
    assert_eq!(0, active_count);
    assert_eq!(1, refresh_event_count);
    assert_eq!(1, update_event_count);
    assert_eq!(1, revoke_event_count);
}

#[tokio::test]
async fn database_config_auth_identity_routes_register_verify_and_reset_password() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_user_data(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;

    let (code_status, code_payload, code_body_text) = request_json(
        router.clone(),
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/verification_codes")
            .header("content-type", "application/json")
            .body(Body::from(
                json!({
                    "target": "new-user@example.com",
                    "scene": "REGISTER",
                    "verifyType": "EMAIL"
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::OK, code_status);
    assert_eq!("2000", code_payload["code"]);
    let code_id = code_payload["data"]["codeId"].as_str().unwrap();
    let verification_code = code_payload["data"]["debugCode"].as_str().unwrap();
    assert!(!code_id.is_empty());
    assert!(!verification_code.is_empty());
    assert!(!code_body_text.contains("pbkdf2-sha256"));

    let (verify_status, verify_payload, _) = request_json(
        router.clone(),
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/verification_codes/verify")
            .header("content-type", "application/json")
            .body(Body::from(
                json!({
                    "codeId": code_id,
                    "target": "new-user@example.com",
                    "scene": "REGISTER",
                    "verifyType": "EMAIL",
                    "code": verification_code
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::OK, verify_status);
    assert_eq!("2000", verify_payload["code"]);
    assert_eq!(true, verify_payload["data"]["verified"]);
    assert_eq!(true, verify_payload["data"]["valid"]);

    let (register_status, register_payload, register_body_text) = request_json(
        router.clone(),
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/registrations")
            .header("content-type", "application/json")
            .header("X-Request-Id", "register-request-1")
            .body(Body::from(
                json!({
                    "channel": "EMAIL",
                    "email": "new-user@example.com",
                    "username": "new-user",
                    "password": "new-user-password",
                    "confirmPassword": "new-user-password",
                    "verificationCode": verification_code
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::OK, register_status);
    assert_eq!("2000", register_payload["code"]);
    assert_eq!("new-user", register_payload["data"]["user"]["username"]);
    assert_eq!(
        "new-user@example.com",
        register_payload["data"]["user"]["email"]
    );
    assert_eq!("password", register_payload["data"]["context"]["authLevel"]);
    assert_eq!("10", register_payload["data"]["context"]["tenantId"]);
    assert_eq!("20", register_payload["data"]["context"]["organizationId"]);
    assert!(!register_body_text.contains("new-user-password"));
    assert!(!register_body_text.contains("pbkdf2-sha256"));

    let (reset_request_status, reset_request_payload, reset_request_body_text) = request_json(
        router.clone(),
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/password_reset_requests")
            .header("content-type", "application/json")
            .body(Body::from(
                json!({
                    "account": "new-user@example.com",
                    "channel": "EMAIL"
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::OK, reset_request_status);
    assert_eq!("2000", reset_request_payload["code"]);
    let reset_code = reset_request_payload["data"]["debugCode"].as_str().unwrap();
    assert!(!reset_code.is_empty());
    assert!(!reset_request_body_text.contains("pbkdf2-sha256"));

    let (reset_status, reset_payload, reset_body_text) = request_json(
        router.clone(),
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/password_resets")
            .header("content-type", "application/json")
            .body(Body::from(
                json!({
                    "account": "new-user@example.com",
                    "code": reset_code,
                    "newPassword": "new-user-password-2",
                    "confirmPassword": "new-user-password-2"
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::OK, reset_status);
    assert_eq!("2000", reset_payload["code"]);
    assert!(reset_payload["data"].as_object().unwrap().is_empty());
    assert!(!reset_body_text.contains("new-user-password-2"));
    assert!(!reset_body_text.contains("pbkdf2-sha256"));

    let (login_status, login_payload, _) = request_json(
        router.clone(),
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/sessions")
            .header("content-type", "application/json")
            .body(Body::from(
                json!({
                    "grantType": "password",
                    "username": "new-user@example.com",
                    "password": "new-user-password-2"
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::OK, login_status);
    assert_eq!("new-user", login_payload["data"]["user"]["username"]);

    let verification_pool = create_sqlite_pool(&database_url).await;
    let user_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM iam_user WHERE tenant_id = '10' AND username = 'new-user'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let credential_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM iam_credential WHERE tenant_id = '10' AND user_id = (SELECT id FROM iam_user WHERE username = 'new-user') AND credential_type = 'password' AND status = 'active'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let identity_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM iam_user_identity WHERE tenant_id = '10' AND provider = 'email' AND subject = 'new-user@example.com'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    verification_pool.close().await;

    assert_eq!(1, user_count);
    assert_eq!(1, credential_count);
    assert_eq!(1, identity_count);
}

#[tokio::test]
async fn database_config_auth_registration_allows_email_without_verification_code_by_default() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_user_data(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;

    let (register_status, register_payload, register_body_text) = request_json(
        router,
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/registrations")
            .header("content-type", "application/json")
            .header("X-Request-Id", "register-without-code-request-1")
            .body(Body::from(
                json!({
                    "channel": "EMAIL",
                    "email": "no-code-user@example.com",
                    "username": "no-code-user",
                    "password": "no-code-user-password",
                    "confirmPassword": "no-code-user-password"
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::OK, register_status);
    assert_eq!("2000", register_payload["code"]);
    assert_eq!("no-code-user", register_payload["data"]["user"]["username"]);
    assert_eq!(
        "no-code-user@example.com",
        register_payload["data"]["user"]["email"]
    );
    assert_eq!("password", register_payload["data"]["context"]["authLevel"]);
    assert!(!register_body_text.contains("no-code-user-password"));
    assert!(!register_body_text.contains("pbkdf2-sha256"));

    let verification_pool = create_sqlite_pool(&database_url).await;
    let user_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM iam_user WHERE tenant_id = '10' AND username = 'no-code-user'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let identity_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM iam_user_identity WHERE tenant_id = '10' AND provider = 'email' AND subject = 'no-code-user@example.com'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    verification_pool.close().await;

    assert_eq!(1, user_count);
    assert_eq!(1, identity_count);
}

#[tokio::test]
async fn database_config_auth_registration_requires_email_code_when_policy_enables_it() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_user_data(&pool).await;
    seed_auth_settings_snapshot(
        &pool,
        json!({
            "action": "update_auth_settings",
            "settings": {
                "leftRailMode": "qr-only",
                "loginMethods": ["password", "emailCode", "phoneCode", "sessionBridge"],
                "oauthLoginEnabled": true,
                "oauthProviders": ["wechat", "alipay", "douyin"],
                "oauthRegion": "mainland",
                "qrLoginEnabled": true,
                "recoveryMethods": ["email", "phone"],
                "registerMethods": ["email", "phone"],
                "verificationPolicy": {
                    "emailCodeLoginEnabled": false,
                    "emailRegistrationVerificationRequired": true,
                    "phoneCodeLoginEnabled": false,
                    "phoneRegistrationVerificationRequired": false
                }
            }
        }),
    )
    .await;
    pool.close().await;

    let router = configured_router(&database_url).await;

    let (register_status, register_payload, register_body_text) = request_json(
        router,
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/registrations")
            .header("content-type", "application/json")
            .header("X-Request-Id", "register-email-code-policy-request-1")
            .body(Body::from(
                json!({
                    "channel": "EMAIL",
                    "email": "policy-user@example.com",
                    "username": "policy-user",
                    "password": "policy-user-password",
                    "confirmPassword": "policy-user-password"
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::BAD_REQUEST, register_status);
    assert_eq!("4001", register_payload["code"]);
    assert!(register_payload["msg"]
        .as_str()
        .unwrap()
        .contains("verificationCode must not be empty"));
    assert!(!register_body_text.contains("policy-user-password"));
}

#[tokio::test]
async fn database_config_auth_runtime_settings_are_public_and_match_persisted_policy() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_user_data(&pool).await;
    seed_auth_settings_snapshot(
        &pool,
        json!({
            "action": "update_auth_settings",
            "settings": {
                "leftRailMode": "highlights-only",
                "loginMethods": ["password", "emailCode"],
                "oauthLoginEnabled": false,
                "oauthProviders": ["github"],
                "oauthRegion": "overseas",
                "qrLoginEnabled": false,
                "recoveryMethods": ["email"],
                "registerMethods": ["email"],
                "verificationPolicy": {
                    "emailCodeLoginEnabled": true,
                    "emailRegistrationVerificationRequired": true,
                    "phoneCodeLoginEnabled": false,
                    "phoneRegistrationVerificationRequired": false
                }
            }
        }),
    )
    .await;
    pool.close().await;

    let (status, payload, _body_text) = request_json(
        configured_router(&database_url).await,
        Request::builder()
            .method("GET")
            .uri("/app/v3/api/auth/runtime_settings")
            .body(Body::empty())
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::OK, status);
    assert_eq!("2000", payload["code"]);
    assert_eq!("highlights-only", payload["data"]["leftRailMode"]);
    assert_eq!(
        json!(["password", "emailCode"]),
        payload["data"]["loginMethods"]
    );
    assert_eq!(false, payload["data"]["oauthLoginEnabled"]);
    assert_eq!(json!(["github"]), payload["data"]["oauthProviders"]);
    assert_eq!("overseas", payload["data"]["oauthRegion"]);
    assert_eq!(false, payload["data"]["qrLoginEnabled"]);
    assert_eq!(
        true,
        payload["data"]["verificationPolicy"]["emailRegistrationVerificationRequired"]
    );
}

#[tokio::test]
async fn database_config_auth_identity_routes_support_email_and_phone_code_login() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_user_data(&pool).await;
    seed_auth_settings_snapshot(
        &pool,
        json!({
            "action": "update_auth_settings",
            "settings": {
                "leftRailMode": "highlights-only",
                "loginMethods": ["password", "emailCode", "phoneCode"],
                "oauthLoginEnabled": false,
                "oauthProviders": [],
                "oauthRegion": "mainland",
                "qrLoginEnabled": false,
                "recoveryMethods": ["email", "phone"],
                "registerMethods": ["email", "phone"],
                "verificationPolicy": {
                    "emailCodeLoginEnabled": true,
                    "emailRegistrationVerificationRequired": false,
                    "phoneCodeLoginEnabled": true,
                    "phoneRegistrationVerificationRequired": false
                }
            }
        }),
    )
    .await;
    pool.close().await;

    let router = configured_router(&database_url).await;

    let (email_code_status, email_code_payload, _) = request_json(
        router.clone(),
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/verification_codes")
            .header("content-type", "application/json")
            .body(Body::from(
                json!({
                    "target": "owner@example.com",
                    "scene": "LOGIN",
                    "verifyType": "EMAIL"
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;
    assert_eq!(StatusCode::OK, email_code_status);
    let email_code = email_code_payload["data"]["debugCode"].as_str().unwrap();

    let (email_login_status, email_login_payload, email_login_body_text) = request_json(
        router.clone(),
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/sessions")
            .header("content-type", "application/json")
            .body(Body::from(
                json!({
                    "grantType": "email_code",
                    "email": "owner@example.com",
                    "code": email_code
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::OK, email_login_status);
    assert_eq!("2000", email_login_payload["code"]);
    assert_eq!("owner", email_login_payload["data"]["user"]["username"]);
    assert_eq!(
        "email_code",
        email_login_payload["data"]["context"]["authLevel"]
    );
    assert!(!email_login_body_text.contains(email_code));
    assert!(!email_login_body_text.contains("pbkdf2-sha256"));

    let (phone_code_status, phone_code_payload, _) = request_json(
        router.clone(),
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/verification_codes")
            .header("content-type", "application/json")
            .body(Body::from(
                json!({
                    "target": "+15550000030",
                    "scene": "LOGIN",
                    "verifyType": "PHONE"
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;
    assert_eq!(StatusCode::OK, phone_code_status);
    let phone_code = phone_code_payload["data"]["debugCode"].as_str().unwrap();

    let (phone_login_status, phone_login_payload, phone_login_body_text) = request_json(
        router,
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/sessions")
            .header("content-type", "application/json")
            .body(Body::from(
                json!({
                    "grantType": "phone_code",
                    "phone": "+15550000030",
                    "code": phone_code
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::OK, phone_login_status);
    assert_eq!("2000", phone_login_payload["code"]);
    assert_eq!("owner", phone_login_payload["data"]["user"]["username"]);
    assert_eq!(
        "phone_code",
        phone_login_payload["data"]["context"]["authLevel"]
    );
    assert!(!phone_login_body_text.contains(phone_code));
    assert!(!phone_login_body_text.contains("pbkdf2-sha256"));
}

#[tokio::test]
async fn database_config_auth_settings_disable_login_methods_server_side() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_user_data(&pool).await;
    seed_auth_settings_snapshot(
        &pool,
        json!({
            "action": "update_auth_settings",
            "settings": {
                "leftRailMode": "highlights-only",
                "loginMethods": ["emailCode"],
                "oauthLoginEnabled": false,
                "oauthProviders": [],
                "oauthRegion": "mainland",
                "qrLoginEnabled": false,
                "recoveryMethods": ["email"],
                "registerMethods": ["email"],
                "verificationPolicy": {
                    "emailCodeLoginEnabled": true,
                    "emailRegistrationVerificationRequired": false,
                    "phoneCodeLoginEnabled": false,
                    "phoneRegistrationVerificationRequired": false
                }
            }
        }),
    )
    .await;
    pool.close().await;

    let router = configured_router(&database_url).await;

    let (password_status, password_payload, password_body_text) = request_json(
        router.clone(),
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/sessions")
            .header("content-type", "application/json")
            .body(Body::from(
                json!({
                    "grantType": "password",
                    "username": "owner",
                    "password": "correct-password"
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;
    assert_eq!(StatusCode::BAD_REQUEST, password_status);
    assert_eq!("4001", password_payload["code"]);
    assert!(password_payload["msg"]
        .as_str()
        .unwrap()
        .contains("password login is not enabled"));
    assert!(!password_body_text.contains("correct-password"));

    let (phone_code_status, phone_code_payload, _) = request_json(
        router,
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/verification_codes")
            .header("content-type", "application/json")
            .body(Body::from(
                json!({
                    "target": "+15550000030",
                    "scene": "LOGIN",
                    "verifyType": "PHONE"
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;
    assert_eq!(StatusCode::BAD_REQUEST, phone_code_status);
    assert_eq!("4001", phone_code_payload["code"]);
    assert!(phone_code_payload["msg"]
        .as_str()
        .unwrap()
        .contains("phone code login is not enabled"));
}

#[tokio::test]
async fn database_config_auth_settings_disable_registration_methods_server_side() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_user_data(&pool).await;
    seed_auth_settings_snapshot(
        &pool,
        json!({
            "action": "update_auth_settings",
            "settings": {
                "leftRailMode": "highlights-only",
                "loginMethods": ["password"],
                "oauthLoginEnabled": false,
                "oauthProviders": [],
                "oauthRegion": "mainland",
                "qrLoginEnabled": false,
                "recoveryMethods": ["email"],
                "registerMethods": ["email"],
                "verificationPolicy": {
                    "emailCodeLoginEnabled": false,
                    "emailRegistrationVerificationRequired": false,
                    "phoneCodeLoginEnabled": false,
                    "phoneRegistrationVerificationRequired": false
                }
            }
        }),
    )
    .await;
    pool.close().await;

    let (status, payload, body_text) = request_json(
        configured_router(&database_url).await,
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/registrations")
            .header("content-type", "application/json")
            .header("X-Request-Id", "disabled-phone-register-request-1")
            .body(Body::from(
                json!({
                    "channel": "PHONE",
                    "phone": "+15550000999",
                    "username": "disabled-phone-user",
                    "password": "disabled-phone-password",
                    "confirmPassword": "disabled-phone-password"
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::BAD_REQUEST, status);
    assert_eq!("4001", payload["code"]);
    assert!(payload["msg"]
        .as_str()
        .unwrap()
        .contains("phone registration is not enabled"));
    assert!(!body_text.contains("disabled-phone-password"));
}

#[tokio::test]
async fn database_config_auth_settings_disable_recovery_and_qr_server_side() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_user_data(&pool).await;
    seed_auth_settings_snapshot(
        &pool,
        json!({
            "action": "update_auth_settings",
            "settings": {
                "leftRailMode": "highlights-only",
                "loginMethods": ["password"],
                "oauthLoginEnabled": false,
                "oauthProviders": [],
                "oauthRegion": "mainland",
                "qrLoginEnabled": false,
                "recoveryMethods": ["phone"],
                "registerMethods": ["email", "phone"],
                "verificationPolicy": {
                    "emailCodeLoginEnabled": false,
                    "emailRegistrationVerificationRequired": false,
                    "phoneCodeLoginEnabled": false,
                    "phoneRegistrationVerificationRequired": false
                }
            }
        }),
    )
    .await;
    pool.close().await;

    let router = configured_router(&database_url).await;
    let (reset_status, reset_payload, _) = request_json(
        router.clone(),
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/password_reset_requests")
            .header("content-type", "application/json")
            .body(Body::from(
                json!({
                    "account": "owner@example.com",
                    "channel": "EMAIL"
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;
    assert_eq!(StatusCode::BAD_REQUEST, reset_status);
    assert_eq!("4001", reset_payload["code"]);
    assert!(reset_payload["msg"]
        .as_str()
        .unwrap()
        .contains("email password recovery is not enabled"));

    let (qr_status, qr_payload, _) = request_json(
        router,
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/qr_login_codes")
            .body(Body::empty())
            .unwrap(),
    )
    .await;
    assert_eq!(StatusCode::BAD_REQUEST, qr_status);
    assert_eq!("4001", qr_payload["code"]);
    assert!(qr_payload["msg"]
        .as_str()
        .unwrap()
        .contains("QR login is not enabled"));
}

#[tokio::test]
async fn database_config_auth_verification_codes_fail_closed_without_debug_code_in_server_mode() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_user_data(&pool).await;
    pool.close().await;

    let router =
        configured_router_with_deployment_mode(&database_url, DeploymentMode::Server).await;
    let (status, payload, body_text) = request_json(
        router,
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/verification_codes")
            .header("content-type", "application/json")
            .body(Body::from(
                json!({
                    "target": "new-user@example.com",
                    "scene": "REGISTER",
                    "verifyType": "EMAIL"
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::INTERNAL_SERVER_ERROR, status);
    assert_eq!("5000", payload["code"]);
    assert!(body_text.contains("verification code delivery provider is not configured"));
    assert!(!body_text.contains("debugCode"));
    assert!(!body_text.contains("666666"));
}

#[tokio::test]
async fn database_config_oauth_routes_are_explicit_when_provider_is_not_configured() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_user_data(&pool).await;
    pool.close().await;

    let (url_status, url_payload, _) = request_json(
        configured_router(&database_url).await,
        Request::builder()
            .method("GET")
            .uri("/app/v3/api/auth/oauth_authorization_urls?provider=github&redirectUri=https%3A%2F%2Fapp.example%2Fcallback&state=state-1")
            .body(Body::empty())
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::BAD_REQUEST, url_status);
    assert_eq!("4001", url_payload["code"]);
    assert!(url_payload["msg"]
        .as_str()
        .unwrap()
        .contains("OAuth login is not enabled"));

    let pool = create_sqlite_pool(&database_url).await;
    seed_auth_settings_snapshot(
        &pool,
        json!({
            "action": "update_auth_settings",
            "settings": {
                "leftRailMode": "highlights-only",
                "loginMethods": ["password"],
                "oauthLoginEnabled": true,
                "oauthProviders": ["github"],
                "oauthRegion": "overseas",
                "qrLoginEnabled": false,
                "recoveryMethods": ["email", "phone"],
                "registerMethods": ["email", "phone"],
                "verificationPolicy": {
                    "emailCodeLoginEnabled": false,
                    "emailRegistrationVerificationRequired": false,
                    "phoneCodeLoginEnabled": false,
                    "phoneRegistrationVerificationRequired": false
                }
            }
        }),
    )
    .await;
    pool.close().await;
    let router = configured_router(&database_url).await;

    let (url_status, url_payload, _) = request_json(
        router.clone(),
        Request::builder()
            .method("GET")
            .uri("/app/v3/api/auth/oauth_authorization_urls?provider=github&redirectUri=https%3A%2F%2Fapp.example%2Fcallback&state=state-1")
            .body(Body::empty())
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::SERVICE_UNAVAILABLE, url_status);
    assert_eq!("5030", url_payload["code"]);
    assert!(url_payload["msg"]
        .as_str()
        .unwrap()
        .contains("OAuth provider is not configured"));

    let (session_status, session_payload, session_body_text) = request_json(
        router,
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/oauth_sessions")
            .header("content-type", "application/json")
            .body(Body::from(
                json!({
                    "provider": "github",
                    "code": "oauth-code"
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::SERVICE_UNAVAILABLE, session_status);
    assert_eq!("5030", session_payload["code"]);
    assert!(!session_body_text.contains("oauth-code"));
}

#[tokio::test]
async fn database_config_dashboard_scopes_metrics_to_app_session_subject() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_user_data(&pool).await;
    seed_dashboard_data(&pool).await;
    pool.close().await;

    let (status, payload, body_text) = request_json(
        configured_router(&database_url).await,
        session_request(
            "GET",
            "/app/v3/api/ai/dashboard/overview?time_range=daily&start_time=2026-04-29T00:00:00Z&end_time=2026-04-29T23:59:59Z",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;

    assert_eq!(StatusCode::OK, status);
    assert_eq!("2000", payload["code"]);
    assert_eq!(7, payload["data"]["summary"]["requestCount"]);
    assert_eq!(1.25, payload["data"]["summary"]["usedCredits"]);
    assert_eq!(10, payload["data"]["summary"]["totalRequestCount"]);
    assert_eq!(3.0, payload["data"]["summary"]["totalUsedCredits"]);
    assert_eq!(1, payload["data"]["summary"]["errorCount"]);
    assert_eq!(2, payload["data"]["summary"]["imageRequests"]);
    assert_eq!("2026-04-29", payload["data"]["chartData"][0]["time"]);
    assert_eq!(5.0, payload["data"]["chartData"][0]["llm (Text)"]);
    assert_eq!(
        2.0,
        payload["data"]["chartData"][0]["image (Midjourney/DALL-E)"]
    );
    assert_eq!("gpt-4o-mini", payload["data"]["topModels"][0]["name"]);
    assert_eq!(
        "Planned model upgrade",
        payload["data"]["announcements"][0]["text"]
    );
    assert!(!body_text.contains("99.000000"));
    assert!(!body_text.contains("other-user-request"));
}

#[tokio::test]
async fn database_config_billing_redeem_persists_points_and_history_for_subject() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_user_data(&pool).await;
    seed_billing_data(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;

    let (redeem_status, redeem_payload, redeem_body_text) = request_json(
        router.clone(),
        session_request_builder("POST", "/app/v3/api/coupons/redemptions", 10, 20, 30)
            .header("content-type", "application/json")
            .header("Idempotency-Key", "redeem-idem-standard-1")
            .header("X-Request-Id", "redeem-request-standard-1")
            .body(Body::from(r#"{"code":"WELCOME"}"#))
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::OK, redeem_status);
    assert_eq!("2000", redeem_payload["code"]);
    assert_eq!("Redeem code applied", redeem_payload["data"]["message"]);
    assert_eq!("5.00", redeem_payload["data"]["amount"]);
    assert_eq!(50, redeem_payload["data"]["creditedPoints"]);
    assert_eq!(150, redeem_payload["data"]["balance"]);
    assert!(!redeem_body_text.contains("WELCOME-other-user"));

    let (history_status, history_payload, history_body_text) = request_json(
        router.clone(),
        session_request("GET", "/app/v3/api/coupons", Body::empty(), 10, 20, 30),
    )
    .await;

    assert_eq!(StatusCode::OK, history_status);
    assert_eq!("2000", history_payload["code"]);
    assert_eq!(1, history_payload["data"].as_array().unwrap().len());
    assert_eq!("5.00", history_payload["data"][0]["amount"]);
    assert_eq!("success", history_payload["data"][0]["status"]);
    assert!(!history_body_text.contains("WELCOME-other-user"));

    let (points_status, points_payload, _points_body_text) = request_json(
        router.clone(),
        session_request(
            "GET",
            "/app/v3/api/wallet/points",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;
    assert_eq!(StatusCode::OK, points_status);
    assert_eq!("2000", points_payload["code"]);
    assert_eq!(150, points_payload["data"]["availablePoints"]);
    assert_eq!(0, points_payload["data"]["frozenPoints"]);

    let (points_history_status, points_history_payload, points_history_body_text) = request_json(
        router.clone(),
        session_request(
            "GET",
            "/app/v3/api/wallet/points/history",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;
    assert_eq!(StatusCode::OK, points_history_status);
    assert_eq!("2000", points_history_payload["code"]);
    assert_eq!(1, points_history_payload["data"].as_array().unwrap().len());
    assert_eq!(50, points_history_payload["data"][0]["amount"]);
    assert_eq!("in", points_history_payload["data"][0]["direction"]);
    assert_eq!(150, points_history_payload["data"][0]["balanceAfter"]);
    assert!(!points_history_body_text.contains("other-points-account"));

    let verification_pool = create_sqlite_pool(&database_url).await;
    let available_points: i64 = sqlx::query_scalar(
        "SELECT CAST(available_amount AS INTEGER) FROM commerce_account WHERE tenant_id = '10' AND organization_id = '20' AND owner_user_id = '30' AND asset_type = 'points'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let other_available_points: i64 = sqlx::query_scalar(
        "SELECT CAST(available_amount AS INTEGER) FROM commerce_account WHERE tenant_id = '10' AND organization_id = '20' AND owner_user_id = '31' AND asset_type = 'points'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let claimed_count: i64 = sqlx::query_scalar(
        "SELECT claimed_quantity FROM commerce_coupon_template WHERE template_no = 'WELCOME'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    verification_pool.close().await;

    assert_eq!(150, available_points);
    assert_eq!(900, other_available_points);
    assert_eq!(1, claimed_count);
}

#[tokio::test]
async fn database_config_billing_redeem_replays_same_idempotency_key_via_appbase_store() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_user_data(&pool).await;
    seed_billing_data(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;
    for _ in 0..2 {
        let (status, payload, body_text) = request_json(
            router.clone(),
            session_request_builder("POST", "/app/v3/api/coupons/redemptions", 10, 20, 30)
                .header("content-type", "application/json")
                .header("Idempotency-Key", "redeem-idem-1")
                .header("Sdkwork-Request-No", "redeem-request-1")
                .body(Body::from(r#"{"code":"WELCOME"}"#))
                .unwrap(),
        )
        .await;

        assert_eq!(StatusCode::OK, status, "{body_text}");
        assert_eq!("2000", payload["code"], "{body_text}");
        assert_eq!(50, payload["data"]["creditedPoints"], "{body_text}");
        assert_eq!(150, payload["data"]["balance"], "{body_text}");
    }

    let verification_pool = create_sqlite_pool(&database_url).await;
    let ledger_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM commerce_account_ledger_entry WHERE tenant_id = '10' AND organization_id = '20' AND owner_user_id = '30' AND asset_type = 'points'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let coupon_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM commerce_coupon WHERE tenant_id = '10' AND organization_id = '20' AND owner_user_id = '30'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let available_points: i64 = sqlx::query_scalar(
        "SELECT CAST(available_amount AS INTEGER) FROM commerce_account WHERE tenant_id = '10' AND organization_id = '20' AND owner_user_id = '30' AND asset_type = 'points'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    verification_pool.close().await;

    assert_eq!(1, ledger_count);
    assert_eq!(1, coupon_count);
    assert_eq!(150, available_points);
}

#[tokio::test]
async fn database_config_wallet_accounts_uses_appbase_commerce_store() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_user_data(&pool).await;
    seed_billing_data(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;
    let (status, payload, body_text) = request_json(
        router.clone(),
        session_request(
            "GET",
            "/app/v3/api/wallet/accounts",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;

    assert_eq!(StatusCode::OK, status);
    assert_eq!("2000", payload["code"]);
    let accounts = payload["data"].as_array().unwrap();
    assert_eq!(2, accounts.len());
    let points_account = accounts
        .iter()
        .find(|account| account["id"] == "owner-points-account")
        .expect("owner points account");
    assert_eq!("points", points_account["assetType"]);
    assert_eq!("100", points_account["availableAmount"]);
    assert_eq!("0", points_account["frozenAmount"]);
    let token_account = accounts
        .iter()
        .find(|account| account["id"] == "owner-token-account")
        .expect("owner token account");
    assert_eq!("token", token_account["assetType"]);
    assert_eq!("120", token_account["availableAmount"]);
    assert_eq!("8", token_account["frozenAmount"]);
    assert!(!body_text.contains("other-points-account"));
    assert!(!body_text.contains("other-token-account"));

    let (token_status, token_payload, token_body_text) = request_json(
        router,
        session_request(
            "GET",
            "/app/v3/api/wallet/tokens",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;

    assert_eq!(StatusCode::OK, token_status, "{token_body_text}");
    assert_eq!("2000", token_payload["code"], "{token_body_text}");
    assert_eq!(120, token_payload["data"]["availableTokens"]);
    assert_eq!(8, token_payload["data"]["frozenTokens"]);
    assert!(!token_body_text.contains("other-token-account"));
}

#[tokio::test]
async fn database_config_billing_reads_return_empty_defaults_when_optional_read_models_are_absent()
{
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_user_data(&pool).await;
    for table in [
        "commerce_coupon_redemption",
        "commerce_coupon",
        "commerce_coupon_template",
        "commerce_account_ledger_entry",
        "commerce_account",
        "commerce_order_amount_breakdown",
        "commerce_order_item",
        "commerce_payment_attempt",
        "commerce_payment_intent",
        "commerce_order",
        "commerce_recharge_package",
        "commerce_payment_method",
        "commerce_product",
        "commerce_sku",
        "iam_user_security_setting",
        "iam_user_login_event",
        "ai_usage_fact",
    ] {
        sqlx::query(&format!("DROP TABLE {table}"))
            .execute(&pool)
            .await
            .unwrap();
    }
    pool.close().await;

    let router = configured_router(&database_url).await;

    for uri in [
        "/app/v3/api/coupons",
        "/app/v3/api/payments/attempts",
        "/app/v3/api/wallet/points/history",
        "/app/v3/api/recharges/packages",
    ] {
        let (status, payload, body_text) = request_json(
            router.clone(),
            session_request("GET", uri, Body::empty(), 10, 20, 30),
        )
        .await;
        assert_eq!(StatusCode::OK, status, "{uri}: {body_text}");
        assert_eq!("2000", payload["code"], "{uri}: {body_text}");
        assert_eq!(
            0,
            payload["data"].as_array().unwrap().len(),
            "{uri}: {body_text}"
        );
    }

    let (points_status, points_payload, points_body_text) = request_json(
        router.clone(),
        session_request(
            "GET",
            "/app/v3/api/wallet/points",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;
    assert_eq!(StatusCode::OK, points_status, "{points_body_text}");
    assert_eq!("2000", points_payload["code"], "{points_body_text}");
    assert_eq!(0, points_payload["data"]["availablePoints"]);
    assert_eq!(0, points_payload["data"]["frozenPoints"]);

    let (summary_status, summary_payload, summary_body_text) = request_json(
        router,
        session_request(
            "GET",
            "/app/v3/api/accounts/current/summary",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;
    assert_eq!(StatusCode::OK, summary_status, "{summary_body_text}");
    assert_eq!("2000", summary_payload["code"], "{summary_body_text}");
    assert_eq!("30", summary_payload["data"]["id"]);
    assert_eq!(0.0, summary_payload["data"]["availableCredits"]);
    assert_eq!(0.0, summary_payload["data"]["monthlyConsumption"]);
    assert_eq!(
        0,
        summary_payload["data"]["consumptionByService"]
            .as_array()
            .unwrap()
            .len()
    );
    assert_eq!(
        0,
        summary_payload["data"]["loginLogs"]
            .as_array()
            .unwrap()
            .len()
    );
    assert_eq!(false, summary_payload["data"]["security"]["mfaEnabled"]);
}

#[tokio::test]
async fn database_config_api_key_create_persists_and_scopes_created_key_to_subject() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;
    let (create_status, create_payload, create_body_text) = request_json(
        router.clone(),
        session_request_builder("POST", API_KEYS_PATH, 10, 20, 30)
            .header("content-type", "application/json")
            .header("Idempotency-Key", "sqlite-create-runtime-key-1")
            .header("X-Request-Id", "sqlite-create-runtime-key-request-1")
            .body(Body::from(
                serde_json::json!({
                    "name": "CLI Runtime Key",
                    "group": "standard-group",
                    "quota": "125.000000",
                    "isUnlimitedQuota": false,
                    "modalities": ["text"],
                    "ipLimit": "203.0.113.10",
                    "expires": "2027-03-01T00:00"
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::OK, create_status);
    assert_eq!("2000", create_payload["code"]);
    let raw_key = create_payload["data"]["rawKey"].as_str().unwrap();
    assert!(raw_key.starts_with("sk-claw-"));
    assert_eq!("CLI Runtime Key", create_payload["data"]["item"]["name"]);
    assert_eq!(raw_key, create_payload["data"]["item"]["copyableKey"]);
    assert_eq!("125.000000", create_payload["data"]["item"]["quota"]);
    assert_eq!("0.000000", create_payload["data"]["item"]["usedQuota"]);
    assert_eq!("203.0.113.10", create_payload["data"]["item"]["ipLimit"]);
    assert!(!create_body_text.contains("key_hash"));
    assert!(!create_body_text.contains("keyHash"));

    let (list_status, list_payload, list_body_text) = request_json(
        router,
        session_request("GET", API_KEYS_PATH, Body::empty(), 10, 20, 30),
    )
    .await;

    assert_eq!(StatusCode::OK, list_status);
    assert_eq!("2000", list_payload["code"]);
    let items = list_payload["data"]["items"].as_array().unwrap();
    assert_eq!(2, items.len());
    assert!(items.iter().any(|item| item["name"] == "Owner Key"));
    assert!(items.iter().any(|item| item["name"] == "CLI Runtime Key"));
    assert!(items
        .iter()
        .any(|item| item["name"] == "CLI Runtime Key" && item["copyableKey"] == raw_key));
    assert!(!list_body_text.contains("Other User Key"));
    assert!(!list_body_text.contains("sk-other-secret"));
    assert!(!list_body_text.contains("hash:"));
}

#[tokio::test]
async fn database_config_app_routing_routes_require_session_scope_and_redact_sensitive_data() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_routing_runtime_data(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;
    let unauthenticated_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/ai/routing/api_keys")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, unauthenticated_response.status());

    let (channels_status, channels_payload, channels_body_text) = request_json(
        router.clone(),
        session_request(
            "GET",
            "/app/v3/api/ai/routing/channels",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;
    assert_eq!(StatusCode::OK, channels_status);
    assert_eq!("2000", channels_payload["code"]);
    assert_eq!(
        "OpenAI Primary",
        channels_payload["data"]["items"][0]["name"]
    );
    assert_eq!(
        "vault-label-openai-main",
        channels_payload["data"]["items"][0]["apiKey"]
    );
    assert_eq!(
        "openai/global/gpt-4o-mini",
        channels_payload["data"]["items"][0]["models"][0]
    );
    assert!(!channels_body_text.contains("vault://providers/openai/main"));
    assert!(!channels_body_text.contains("Other Tenant Channel"));

    let (keys_status, keys_payload, keys_body_text) = request_json(
        router.clone(),
        session_request(
            "GET",
            "/app/v3/api/ai/routing/api_keys",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;
    assert_eq!(StatusCode::OK, keys_status);
    assert_eq!("Owner Key", keys_payload["data"]["items"][0]["name"]);
    assert_eq!(
        "sk-owner********ABCD",
        keys_payload["data"]["items"][0]["displayKey"]
    );
    assert_eq!(
        "sk-owner-secret",
        keys_payload["data"]["items"][0]["copyableKey"]
    );
    assert_eq!("5", keys_payload["data"]["items"][0]["totalUsage"]);
    assert!(!keys_body_text.contains("Other User Key"));
    assert!(!keys_body_text.contains("hash:owner"));

    let (traces_status, traces_payload, traces_body_text) = request_json(
        router.clone(),
        session_request(
            "GET",
            "/app/v3/api/ai/routing/request_traces",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;
    assert_eq!(StatusCode::OK, traces_status);
    assert_eq!("4005", traces_payload["data"]["items"][0]["id"]);
    assert_eq!("gpt-4o-mini", traces_payload["data"]["items"][0]["model"]);
    assert_eq!(
        "OpenAI Primary",
        traces_payload["data"]["items"][0]["channel"]
    );
    assert_eq!(200, traces_payload["data"]["items"][0]["status"]);
    assert!(!traces_body_text.contains("other-user-runtime-request"));

    let (usage_status, usage_payload, usage_body_text) = request_json(
        router.clone(),
        session_request(
            "GET",
            "/app/v3/api/ai/routing/usage",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;
    assert_eq!(StatusCode::OK, usage_status);
    assert_eq!(1, usage_payload["data"]["chartData"][0]["requests"]);
    assert_eq!("gpt-4o-mini", usage_payload["data"]["modelStats"][0]["m"]);
    assert_eq!("1", usage_payload["data"]["modelStats"][0]["req"]);
    assert_eq!("100.0%", usage_payload["data"]["modelStats"][0]["sr"]);
    assert!(!usage_body_text.contains("other-user-runtime-request"));

    let (strategy_status, strategy_payload, strategy_body_text) = request_json(
        router.clone(),
        session_request(
            "GET",
            "/app/v3/api/ai/routing/strategy",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;
    assert_eq!(StatusCode::OK, strategy_status);
    assert_eq!("2000", strategy_payload["code"]);
    assert_eq!("weighted", strategy_payload["data"]["strategy"]);
    assert_eq!(
        "gpt-4",
        strategy_payload["data"]["mappingRules"][0]["sourceModel"]
    );
    assert_eq!(
        "azure-gpt4-32k",
        strategy_payload["data"]["mappingRules"][0]["targetModel"]
    );
    assert!(!strategy_body_text.contains("other-tenant-model"));

    let (update_status, update_payload, update_body_text) = request_json(
        router.clone(),
        session_request_builder("PUT", "/app/v3/api/ai/routing/strategy", 10, 20, 30)
            .header("content-type", "application/json")
            .body(Body::from(
                serde_json::json!({
                    "strategy": "cost",
                    "mappingRules": [
                        {
                            "id": "rule-custom",
                            "sourceModel": "gpt-4o",
                            "targetModel": "openai-gpt-4o-low-cost"
                        }
                    ]
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;
    assert_eq!(StatusCode::OK, update_status);
    assert_eq!("2000", update_payload["code"]);
    assert_eq!(true, update_payload["data"]["success"]);
    assert!(!update_body_text.contains("other-tenant-model"));

    let (updated_strategy_status, updated_strategy_payload, updated_strategy_body_text) =
        request_json(
            router.clone(),
            session_request(
                "GET",
                "/app/v3/api/ai/routing/strategy",
                Body::empty(),
                10,
                20,
                30,
            ),
        )
        .await;
    assert_eq!(StatusCode::OK, updated_strategy_status);
    assert_eq!("cost", updated_strategy_payload["data"]["strategy"]);
    assert_eq!(
        "gpt-4o",
        updated_strategy_payload["data"]["mappingRules"][0]["sourceModel"]
    );
    assert_eq!(
        "openai-gpt-4o-low-cost",
        updated_strategy_payload["data"]["mappingRules"][0]["targetModel"]
    );
    assert_eq!(
        1,
        updated_strategy_payload["data"]["mappingRules"]
            .as_array()
            .unwrap()
            .len()
    );
    assert!(!updated_strategy_body_text.contains("azure-gpt4-32k"));
    assert!(!updated_strategy_body_text.contains("other-tenant-model"));

    let (repeat_update_status, repeat_update_payload, repeat_update_body_text) = request_json(
        router.clone(),
        session_request_builder("PUT", "/app/v3/api/ai/routing/strategy", 10, 20, 30)
            .header("content-type", "application/json")
            .body(Body::from(
                serde_json::json!({
                    "strategy": "cost",
                    "mappingRules": [
                        {
                            "id": "rule-custom",
                            "sourceModel": "gpt-4o",
                            "targetModel": "openai-gpt-4o-low-cost"
                        }
                    ]
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;
    assert_eq!(StatusCode::OK, repeat_update_status);
    assert_eq!("2000", repeat_update_payload["code"]);
    assert_eq!(true, repeat_update_payload["data"]["success"]);
    assert!(!repeat_update_body_text.contains("UNIQUE constraint failed"));
    assert!(!repeat_update_body_text.contains("ai_routing_rule"));

    let (collision_update_status, collision_update_payload, collision_update_body_text) =
        request_json(
            router.clone(),
            session_request_builder("PUT", "/app/v3/api/ai/routing/strategy", 10, 20, 30)
                .header("content-type", "application/json")
                .body(Body::from(
                    serde_json::json!({
                        "strategy": "weighted",
                        "mappingRules": [
                            {
                                "id": "rule-slash",
                                "sourceModel": "openai/gpt-4",
                                "targetModel": "openai-gpt-4-primary"
                            },
                            {
                                "id": "rule-colon",
                                "sourceModel": "openai:gpt-4",
                                "targetModel": "openai-gpt-4-secondary"
                            }
                        ]
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await;
    assert_eq!(StatusCode::OK, collision_update_status);
    assert_eq!("2000", collision_update_payload["code"]);
    assert_eq!(true, collision_update_payload["data"]["success"]);
    assert!(!collision_update_body_text.contains("UNIQUE constraint failed"));
    assert!(!collision_update_body_text.contains("ai_routing_rule"));

    let verification_pool = create_sqlite_pool(&database_url).await;
    let active_profile_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM ai_routing_profile WHERE tenant_id = 10 AND organization_id = 20 AND policy_id = 4020 AND deleted_at IS NULL",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let active_rule_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM ai_routing_rule WHERE tenant_id = 10 AND organization_id = 20 AND status = 1 AND deleted_at IS NULL",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let current_default_profile_id: i64 = sqlx::query_scalar(
        "SELECT default_profile_id FROM ai_routing_policy WHERE tenant_id = 10 AND organization_id = 20 AND policy_code = 'console-routing-default'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    verification_pool.close().await;
    assert_eq!(4, active_profile_count);
    assert_eq!(5, active_rule_count);
    assert!(current_default_profile_id > 4021);
}

#[tokio::test]
async fn database_config_app_routing_channel_commands_persist_and_scope_without_secret_leakage() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_routing_runtime_data(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;
    let unauthenticated_create = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/ai/routing/channels")
                .header("content-type", "application/json")
                .body(Body::from(
                    serde_json::json!({
                        "name": "Unauthenticated Channel",
                        "vendor": "OpenAI",
                        "protocol": "OpenAI",
                        "accessType": "Standard API Key",
                        "baseUrl": "https://unauthenticated.example/v1",
                        "secretRef": "vault://providers/openai/unauthenticated",
                        "models": ["openai/global/gpt-4o-mini"],
                        "capabilities": ["llm"],
                        "weight": 25,
                        "status": "active"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, unauthenticated_create.status());

    let invalid_base_url_body = serde_json::json!({
        "name": "Invalid Base URL Channel",
        "vendor": "OpenAI",
        "protocol": "OpenAI",
        "accessType": "Standard API Key",
        "baseUrl": "file:///etc/passwd",
        "secretRef": "vault://providers/openai/invalid-base-url",
        "models": ["openai/global/gpt-4o-mini"],
        "capabilities": ["llm"],
        "weight": 25,
        "status": "active"
    });
    let (invalid_base_url_status, invalid_base_url_payload, invalid_base_url_body_text) =
        request_json(
            router.clone(),
            session_request_builder("POST", "/app/v3/api/ai/routing/channels", 10, 20, 30)
                .header("content-type", "application/json")
                .body(Body::from(invalid_base_url_body.to_string()))
                .unwrap(),
        )
        .await;
    assert_eq!(StatusCode::BAD_REQUEST, invalid_base_url_status);
    assert_eq!("4001", invalid_base_url_payload["code"]);
    assert!(invalid_base_url_body_text
        .contains("channel baseUrl must be an absolute http or https URL"));

    let create_body = serde_json::json!({
        "name": "Console Created OpenAI",
        "vendor": "OpenAI",
        "protocol": "OpenAI",
        "accessType": "Standard API Key",
        "baseUrl": "https://console-created.example/v1",
        "secretRef": "vault://providers/openai/console-created",
        "models": ["openai/global/gpt-4o-mini"],
        "capabilities": ["llm", "image"],
        "weight": 75,
        "status": "active"
    });
    let (create_status, create_payload, create_body_text) = request_json(
        router.clone(),
        session_request_builder("POST", "/app/v3/api/ai/routing/channels", 10, 20, 30)
            .header("content-type", "application/json")
            .header("X-Request-Id", "app-routing-channel-create-1")
            .body(Body::from(create_body.to_string()))
            .unwrap(),
    )
    .await;
    assert_eq!(StatusCode::OK, create_status);
    assert_eq!("2000", create_payload["code"]);
    assert_eq!(
        "Console Created OpenAI",
        create_payload["data"]["item"]["name"]
    );
    assert_eq!("OpenAI", create_payload["data"]["item"]["vendor"]);
    assert_eq!(
        "openai/global/gpt-4o-mini",
        create_payload["data"]["item"]["models"][0]
    );
    assert_eq!(
        "ref:***console-created",
        create_payload["data"]["item"]["apiKey"]
    );
    assert!(!create_body_text.contains("vault://providers/openai/console-created"));
    assert!(!create_body_text.contains("secretRef"));
    let created_channel_id = create_payload["data"]["item"]["id"]
        .as_str()
        .unwrap()
        .to_owned();

    let (list_after_create_status, list_after_create_payload, list_after_create_body_text) =
        request_json(
            router.clone(),
            session_request(
                "GET",
                "/app/v3/api/ai/routing/channels",
                Body::empty(),
                10,
                20,
                30,
            ),
        )
        .await;
    assert_eq!(StatusCode::OK, list_after_create_status);
    let created_item = list_after_create_payload["data"]["items"]
        .as_array()
        .unwrap()
        .iter()
        .find(|item| item["id"] == created_channel_id)
        .unwrap();
    assert_eq!("Console Created OpenAI", created_item["name"]);
    assert!(!list_after_create_body_text.contains("vault://providers/openai/console-created"));
    assert!(!list_after_create_body_text.contains("Other Tenant Channel"));

    let update_body = serde_json::json!({
        "name": "Console Updated OpenAI",
        "vendor": "OpenAI",
        "protocol": "OpenAI",
        "accessType": "Standard API Key",
        "baseUrl": "https://console-updated.example/v1",
        "secretRef": "vault://providers/openai/console-updated",
        "models": ["openai/global/gpt-4o-mini"],
        "capabilities": ["llm"],
        "weight": 88
    });
    let (update_status, update_payload, update_body_text) = request_json(
        router.clone(),
        session_request_builder(
            "PUT",
            &format!("/app/v3/api/ai/routing/channels/{created_channel_id}"),
            10,
            20,
            30,
        )
        .header("content-type", "application/json")
        .header("X-Request-Id", "app-routing-channel-update-1")
        .body(Body::from(update_body.to_string()))
        .unwrap(),
    )
    .await;
    assert_eq!(StatusCode::OK, update_status);
    assert_eq!(
        "Console Updated OpenAI",
        update_payload["data"]["item"]["name"]
    );
    assert_eq!(88, update_payload["data"]["item"]["weight"]);
    assert_eq!(
        1,
        update_payload["data"]["item"]["models"]
            .as_array()
            .unwrap()
            .len()
    );
    assert_eq!(
        "ref:***console-updated",
        update_payload["data"]["item"]["apiKey"]
    );
    assert!(!update_body_text.contains("vault://providers/openai/console-updated"));

    let provider_update_body = serde_json::json!({
        "vendor": "Cohere",
        "protocol": "OpenAI",
        "accessType": "Standard API Key",
        "baseUrl": "https://console-cohere.example/v1",
        "weight": 89
    });
    let (provider_update_status, provider_update_payload, provider_update_body_text) =
        request_json(
            router.clone(),
            session_request_builder(
                "PUT",
                &format!("/app/v3/api/ai/routing/channels/{created_channel_id}"),
                10,
                20,
                30,
            )
            .header("content-type", "application/json")
            .header("X-Request-Id", "app-routing-channel-update-new-provider-1")
            .body(Body::from(provider_update_body.to_string()))
            .unwrap(),
        )
        .await;
    assert_eq!(StatusCode::OK, provider_update_status);
    assert_eq!(
        "cohere",
        provider_update_payload["data"]["item"]["providerCode"]
    );
    assert_eq!(89, provider_update_payload["data"]["item"]["weight"]);
    assert!(!provider_update_body_text.contains("vault://providers/openai/console-updated"));

    let (disable_status, disable_payload, _) = request_json(
        router.clone(),
        session_request_builder(
            "PUT",
            &format!("/app/v3/api/ai/routing/channels/{created_channel_id}/status"),
            10,
            20,
            30,
        )
        .header("content-type", "application/json")
        .body(Body::from(r#"{"status":"disabled"}"#))
        .unwrap(),
    )
    .await;
    assert_eq!(StatusCode::OK, disable_status);
    assert_eq!("disabled", disable_payload["data"]["item"]["status"]);

    let (enable_status, enable_payload, _) = request_json(
        router.clone(),
        session_request_builder(
            "PUT",
            &format!("/app/v3/api/ai/routing/channels/{created_channel_id}/status"),
            10,
            20,
            30,
        )
        .header("content-type", "application/json")
        .body(Body::from(r#"{"status":"active"}"#))
        .unwrap(),
    )
    .await;
    assert_eq!(StatusCode::OK, enable_status);
    assert_eq!("active", enable_payload["data"]["item"]["status"]);

    let (test_status, test_payload, test_body_text) = request_json(
        router.clone(),
        session_request(
            "POST",
            &format!("/app/v3/api/ai/routing/channels/{created_channel_id}/verify"),
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;
    assert_eq!(StatusCode::OK, test_status);
    assert_eq!(false, test_payload["data"]["success"]);
    assert_eq!(created_channel_id, test_payload["data"]["channelId"]);
    assert_eq!("error", test_payload["data"]["status"]);
    assert_eq!("N/A", test_payload["data"]["latency"]);
    assert!(!test_body_text.contains("vault://providers/openai/console-updated"));
    assert!(!test_body_text.contains("provider secret_ref"));

    let (delete_status, delete_payload, delete_body_text) = request_json(
        router.clone(),
        session_request(
            "DELETE",
            &format!("/app/v3/api/ai/routing/channels/{created_channel_id}"),
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;
    assert_eq!(StatusCode::OK, delete_status);
    assert_eq!(true, delete_payload["data"]["deleted"]);
    assert!(!delete_body_text.contains("vault://providers/openai/console-updated"));

    let (list_after_delete_status, list_after_delete_payload, list_after_delete_body_text) =
        request_json(
            router,
            session_request(
                "GET",
                "/app/v3/api/ai/routing/channels",
                Body::empty(),
                10,
                20,
                30,
            ),
        )
        .await;
    assert_eq!(StatusCode::OK, list_after_delete_status);
    assert!(!list_after_delete_payload["data"]["items"]
        .as_array()
        .unwrap()
        .iter()
        .any(|item| item["id"] == created_channel_id));
    assert!(!list_after_delete_body_text.contains("Console Updated OpenAI"));
    assert!(!list_after_delete_body_text.contains("Other Tenant Channel"));

    let verification_pool = create_sqlite_pool(&database_url).await;
    let parsed_channel_id = created_channel_id.parse::<i64>().unwrap();
    let deleted_status: i64 = sqlx::query_scalar(
        "SELECT status FROM integration_channel WHERE id = ?1 AND tenant_id = 10 AND organization_id = 20",
    )
    .bind(parsed_channel_id)
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let active_model_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM integration_channel_model WHERE channel_id = ?1 AND status = 1 AND deleted_at IS NULL",
    )
    .bind(parsed_channel_id)
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let other_tenant_channel_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM integration_channel WHERE tenant_id = 10 AND organization_id = 21 AND deleted_at IS NULL",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let stored_secret_ref: String = sqlx::query_scalar(
        "SELECT a.secret_ref FROM integration_provider_account a JOIN integration_channel c ON c.account_id = a.id WHERE c.id = ?1",
    )
    .bind(parsed_channel_id)
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let synthetic_latency_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM integration_channel WHERE id = ?1 AND last_latency_ms = 45",
    )
    .bind(parsed_channel_id)
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let provider_snapshot_uuid_reuse_count: i64 = sqlx::query_scalar(
        r#"SELECT COUNT(1)
           FROM integration_provider p
           JOIN integration_channel c ON c.provider_id = p.id
           JOIN ops_config_snapshot s ON s.request_id = 'app-routing-channel-update-new-provider-1'
           WHERE c.id = ?1 AND p.uuid = s.uuid"#,
    )
    .bind(parsed_channel_id)
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    verification_pool.close().await;

    assert_eq!(-1, deleted_status);
    assert_eq!(0, active_model_count);
    assert_eq!(1, other_tenant_channel_count);
    assert_eq!(
        "vault://providers/openai/console-updated",
        stored_secret_ref
    );
    assert_eq!(0, synthetic_latency_count);
    assert_eq!(0, provider_snapshot_uuid_reuse_count);
}

#[tokio::test]
async fn database_config_app_routing_channel_test_runs_real_provider_probe_and_records_health() {
    let captured = Arc::new(Mutex::new(Vec::<CapturedProviderHealthProbe>::new()));
    let provider = Router::new()
        .route("/v1/chat/completions", post(capture_provider_health_probe))
        .with_state(Arc::clone(&captured));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move {
        axum::serve(listener, provider).await.unwrap();
    });

    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_routing_runtime_data(&pool).await;
    sqlx::query("UPDATE integration_channel SET base_url = ?1, last_latency_ms = NULL, consecutive_error_count = 3 WHERE id = 4003")
        .bind(format!("http://{addr}"))
        .execute(&pool)
        .await
        .unwrap();
    sqlx::query(
        "UPDATE integration_provider_account SET consecutive_error_count = 2 WHERE id = 4002",
    )
    .execute(&pool)
    .await
    .unwrap();
    pool.close().await;

    let secret_ref = "vault://providers/openai/main";
    let router = configured_router_with_provider_secret_map(
        &database_url,
        ProviderSecretMapConfig::from_json(
            json!({secret_ref: "sk-provider-health-probe-secret"}).to_string(),
        )
        .unwrap(),
    )
    .await;

    let (status, payload, body_text) = request_json(
        router,
        session_request_builder(
            "POST",
            "/app/v3/api/ai/routing/channels/4003/verify",
            10,
            20,
            30,
        )
        .header("X-Request-Id", "app-routing-channel-probe-success-1")
        .body(Body::empty())
        .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::OK, status);
    assert_eq!("2000", payload["code"]);
    assert_eq!(true, payload["data"]["success"]);
    assert_eq!("4003", payload["data"]["channelId"]);
    assert_eq!("active", payload["data"]["status"]);
    let latency = payload["data"]["latency"].as_str().unwrap();
    assert!(
        latency.ends_with("ms"),
        "latency must be an actual measured duration"
    );
    assert_ne!(
        "45ms", latency,
        "testChannel must not use synthetic latency"
    );
    assert!(!body_text.contains(secret_ref));
    assert!(!body_text.contains("sk-provider-health-probe-secret"));

    let captured = captured.lock().unwrap();
    assert_eq!(1, captured.len());
    assert_eq!(
        Some("Bearer sk-provider-health-probe-secret".to_owned()),
        captured[0].authorization
    );
    assert_eq!("openai/global/gpt-4o-mini", captured[0].body["model"]);
    assert_eq!("ping", captured[0].body["messages"][0]["content"]);
    drop(captured);

    let verification_pool = create_sqlite_pool(&database_url).await;
    let row = sqlx::query(
        r#"
        SELECT health_status, latency_ms, http_status, error_code, error_message_masked
        FROM integration_provider_health_snapshot
        WHERE tenant_id = 10
          AND organization_id = 20
          AND provider_id = 4001
          AND channel_id = 4003
          AND provider_account_id = 4002
          AND request_id = 'app-routing-channel-probe-success-1'
        "#,
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let snapshot_health: i64 = row.get("health_status");
    let snapshot_latency: i64 = row.get("latency_ms");
    let snapshot_http_status: i64 = row.get("http_status");
    let snapshot_error_code: Option<String> = row.get("error_code");
    let snapshot_error_message: Option<String> = row.get("error_message_masked");
    assert_eq!(1, snapshot_health);
    assert!(snapshot_latency > 0);
    assert_eq!(200, snapshot_http_status);
    assert_eq!(None, snapshot_error_code);
    assert_eq!(None, snapshot_error_message);

    let channel_state = sqlx::query(
        "SELECT health_status, last_latency_ms, consecutive_error_count FROM integration_channel WHERE id = 4003",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    assert_eq!(1_i64, channel_state.get::<i64, _>("health_status"));
    assert!(channel_state.get::<i64, _>("last_latency_ms") > 0);
    assert_eq!(
        0_i64,
        channel_state.get::<i64, _>("consecutive_error_count")
    );
    let account_errors: i64 = sqlx::query_scalar(
        "SELECT consecutive_error_count FROM integration_provider_account WHERE id = 4002",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    verification_pool.close().await;
    assert_eq!(0, account_errors);
}

#[tokio::test]
async fn database_config_app_routing_channel_test_records_masked_provider_failure() {
    let captured = Arc::new(Mutex::new(Vec::<CapturedProviderHealthProbe>::new()));
    let provider = Router::new()
        .route(
            "/v1/chat/completions",
            post(
                |State(captured): State<Arc<Mutex<Vec<CapturedProviderHealthProbe>>>>,
                 headers: HeaderMap,
                 Json(body): Json<Value>| async move {
                    captured.lock().unwrap().push(CapturedProviderHealthProbe {
                        authorization: headers
                            .get("authorization")
                            .and_then(|value| value.to_str().ok())
                            .map(str::to_owned),
                        body,
                    });
                    (
                        StatusCode::UNAUTHORIZED,
                        Json(json!({
                            "error": {
                                "code": "invalid_api_key",
                                "message": "bad upstream key sk-provider-health-probe-secret"
                            }
                        })),
                    )
                },
            ),
        )
        .with_state(Arc::clone(&captured));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move {
        axum::serve(listener, provider).await.unwrap();
    });

    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_routing_runtime_data(&pool).await;
    sqlx::query(
        "UPDATE integration_channel SET base_url = ?1, consecutive_error_count = 4 WHERE id = 4003",
    )
    .bind(format!("http://{addr}"))
    .execute(&pool)
    .await
    .unwrap();
    sqlx::query(
        "UPDATE integration_provider_account SET consecutive_error_count = 5 WHERE id = 4002",
    )
    .execute(&pool)
    .await
    .unwrap();
    pool.close().await;

    let secret_ref = "vault://providers/openai/main";
    let router = configured_router_with_provider_secret_map(
        &database_url,
        ProviderSecretMapConfig::from_json(
            json!({secret_ref: "sk-provider-health-probe-secret"}).to_string(),
        )
        .unwrap(),
    )
    .await;

    let (status, payload, body_text) = request_json(
        router,
        session_request_builder(
            "POST",
            "/app/v3/api/ai/routing/channels/4003/verify",
            10,
            20,
            30,
        )
        .header("X-Request-Id", "app-routing-channel-probe-failure-1")
        .body(Body::empty())
        .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::OK, status);
    assert_eq!("2000", payload["code"]);
    assert_eq!(false, payload["data"]["success"]);
    assert_eq!("4003", payload["data"]["channelId"]);
    assert_eq!("error", payload["data"]["status"]);
    assert!(payload["data"]["latency"].as_str().unwrap().ends_with("ms"));
    assert!(!body_text.contains(secret_ref));
    assert!(!body_text.contains("sk-provider-health-probe-secret"));

    let captured = captured.lock().unwrap();
    assert_eq!(1, captured.len());
    assert_eq!(
        Some("Bearer sk-provider-health-probe-secret".to_owned()),
        captured[0].authorization
    );
    drop(captured);

    let verification_pool = create_sqlite_pool(&database_url).await;
    let row = sqlx::query(
        r#"
        SELECT health_status, latency_ms, http_status, error_code, error_message_masked
        FROM integration_provider_health_snapshot
        WHERE tenant_id = 10
          AND organization_id = 20
          AND request_id = 'app-routing-channel-probe-failure-1'
        "#,
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    assert_eq!(2_i64, row.get::<i64, _>("health_status"));
    assert!(row.get::<i64, _>("latency_ms") > 0);
    assert_eq!(401_i64, row.get::<i64, _>("http_status"));
    assert_eq!(
        Some("upstream_http_401".to_owned()),
        row.get::<Option<String>, _>("error_code")
    );
    let error_message = row
        .get::<Option<String>, _>("error_message_masked")
        .unwrap();
    assert!(error_message.contains("upstream health probe returned HTTP 401"));
    assert!(!error_message.contains("sk-provider-health-probe-secret"));

    let channel_errors: i64 = sqlx::query_scalar(
        "SELECT consecutive_error_count FROM integration_channel WHERE id = 4003",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let account_errors: i64 = sqlx::query_scalar(
        "SELECT consecutive_error_count FROM integration_provider_account WHERE id = 4002",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    verification_pool.close().await;
    assert_eq!(5, channel_errors);
    assert_eq!(6, account_errors);
}

#[tokio::test]
async fn database_config_app_providers_require_session_scope_and_hide_secret_refs() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_providers_runtime_data(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;
    let unauthenticated_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/ai/providers")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, unauthenticated_response.status());

    let (status, payload, body_text) = request_json(
        router,
        session_request("GET", "/app/v3/api/ai/providers", Body::empty(), 10, 20, 30),
    )
    .await;

    assert_eq!(StatusCode::OK, status);
    assert_eq!("2000", payload["code"]);
    let items = payload["data"]["items"].as_array().unwrap();
    assert!(items
        .iter()
        .any(|item| item["name"] == "Tenant OpenAI Provider"
            && item["status"] == "active"
            && item["providerFamily"] == "codex"
            && item["integrationType"] == "model_vendor_direct"));
    assert!(!body_text.contains("vault://providers/openai/main"));
    assert!(!body_text.contains("sk-provider-secret"));
    assert!(!body_text.contains("Other Tenant Provider"));
}

#[tokio::test]
async fn database_config_app_communication_notifications_route_is_removed() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;
    let unauthenticated_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/communication/notifications")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::NOT_FOUND, unauthenticated_response.status());

    let authenticated_response = router
        .oneshot(session_request(
            "GET",
            "/app/v3/api/communication/notifications",
            Body::empty(),
            10,
            20,
            30,
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::NOT_FOUND, authenticated_response.status());
}

#[tokio::test]
async fn database_config_notification_delivery_schema_supports_app_acknowledgement_upsert() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;

    let index_columns = sqlx::query(
        r#"
        SELECT ii.name
        FROM pragma_index_list('ops_notification_delivery') il
        JOIN pragma_index_info(il.name) ii
        WHERE il.name = 'uk_ops_notification_delivery_user_message_app'
        ORDER BY ii.seqno
        "#,
    )
    .fetch_all(&pool)
    .await
    .unwrap()
    .into_iter()
    .map(|row| row.get::<String, _>("name"))
    .collect::<Vec<_>>();

    assert_eq!(
        vec![
            "tenant_id",
            "organization_id",
            "message_id",
            "user_id",
            "app_id",
            "delivery_channel"
        ],
        index_columns
    );

    sqlx::query(
        r#"
        INSERT INTO ops_notification_delivery
            (uuid, tenant_id, organization_id, user_id, status, app_id, message_id, delivery_channel, delivery_status, read_at, popup_seen_at, delivered_at, created_at, updated_at)
        VALUES
            ('ack-1', 10, 20, 30, 1, 'default', 2007, 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT(tenant_id, organization_id, message_id, user_id, app_id, delivery_channel) DO UPDATE SET
            read_at = COALESCE(ops_notification_delivery.read_at, CURRENT_TIMESTAMP),
            popup_seen_at = COALESCE(ops_notification_delivery.popup_seen_at, CURRENT_TIMESTAMP),
            updated_at = CURRENT_TIMESTAMP
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO ops_notification_delivery
            (uuid, tenant_id, organization_id, user_id, status, app_id, message_id, delivery_channel, delivery_status, read_at, popup_seen_at, delivered_at, created_at, updated_at)
        VALUES
            ('ack-2', 10, 20, 30, 1, 'default', 2007, 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT(tenant_id, organization_id, message_id, user_id, app_id, delivery_channel) DO UPDATE SET
            read_at = COALESCE(ops_notification_delivery.read_at, CURRENT_TIMESTAMP),
            popup_seen_at = COALESCE(ops_notification_delivery.popup_seen_at, CURRENT_TIMESTAMP),
            updated_at = CURRENT_TIMESTAMP
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*)
        FROM ops_notification_delivery
        WHERE tenant_id = 10
          AND organization_id = 20
          AND message_id = 2007
          AND user_id = 30
          AND app_id = 'default'
          AND delivery_channel = 1
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1, count);
}

#[tokio::test]
async fn database_config_app_gateway_traces_require_session_scope_and_mask_client_identity() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_gateway_traces_runtime_data(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;
    let unauthenticated_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/ai/gateway/traces")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, unauthenticated_response.status());

    let (status, payload, body_text) = request_json(
        router,
        session_request(
            "GET",
            "/app/v3/api/ai/gateway/traces",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;

    assert_eq!(StatusCode::OK, status);
    assert_eq!("2000", payload["code"]);
    assert_eq!("trace-owner-1", payload["data"]["items"][0]["id"]);
    assert_eq!("203.0.113.***", payload["data"]["items"][0]["ip"]);
    assert_eq!(
        "/v1/chat/completions",
        payload["data"]["items"][0]["endpoint"]
    );
    assert_eq!("POST", payload["data"]["items"][0]["method"]);
    assert_eq!(200, payload["data"]["items"][0]["status"]);
    assert_eq!("OpenAI Primary", payload["data"]["items"][0]["channel"]);
    assert!(!body_text.contains("203.0.113.42"));
    assert!(!body_text.contains("trace-other-user"));
}

#[tokio::test]
async fn database_config_checkout_requires_session_and_scopes_order_status_to_subject() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_checkout_runtime_data(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;
    let unauthenticated_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/recharges/orders/ORDER-OWNER-1")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, unauthenticated_response.status());

    let (owner_status, owner_payload, owner_body_text) = request_json(
        router.clone(),
        session_request(
            "GET",
            "/app/v3/api/recharges/orders/ORDER-OWNER-1",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;
    assert_eq!(StatusCode::OK, owner_status);
    assert_eq!("2000", owner_payload["code"]);
    assert_eq!("ORDER-OWNER-1", owner_payload["data"]["orderNo"]);
    assert_eq!("TRADE-OWNER-1", owner_payload["data"]["outTradeNo"]);
    assert_eq!("10.00", owner_payload["data"]["amount"]);
    assert_eq!(125, owner_payload["data"]["points"]);
    assert_eq!("wechat", owner_payload["data"]["paymentMethod"]);
    assert_eq!("success", owner_payload["data"]["orderStatus"]);
    assert_eq!("success", owner_payload["data"]["paymentStatus"]);
    assert_eq!("success", owner_payload["data"]["rechargeStatus"]);
    assert_eq!("success", owner_payload["data"]["status"]);
    assert_eq!("completed", owner_payload["data"]["nextAction"]);
    assert!(!owner_body_text.contains("ORDER-OTHER-1"));
    assert!(!owner_body_text.contains("other-payment-secret"));

    let (other_order_status, other_order_payload, other_order_body_text) = request_json(
        router,
        session_request(
            "GET",
            "/app/v3/api/recharges/orders/ORDER-OTHER-1",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;
    assert_eq!(StatusCode::CONFLICT, other_order_status);
    assert_eq!("4090", other_order_payload["code"]);
    assert!(!other_order_body_text.contains("TRADE-OTHER-1"));
}

#[tokio::test]
async fn database_config_recharge_lists_packages_and_persists_pending_payment_order_for_subject() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_recharge_runtime_data(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;
    let unauthenticated_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/recharges/packages")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, unauthenticated_response.status());

    let (packs_status, packs_payload, packs_body_text) = request_json(
        router.clone(),
        session_request(
            "GET",
            "/app/v3/api/recharges/packages",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;
    assert_eq!(StatusCode::OK, packs_status);
    assert_eq!("2000", packs_payload["code"]);
    let packs = packs_payload["data"].as_array().unwrap();
    assert_eq!(2, packs.len());
    assert!(packs.iter().any(|pack| pack["id"] == "6101"
        && pack["rmb"] == "10.00"
        && pack["bonus"] == 25
        && pack["points"] == 125));
    assert!(packs.iter().any(|pack| pack["id"] == "6102"
        && pack["rmb"] == "20.00"
        && pack["bonus"] == 50
        && pack["points"] == 250));
    assert!(!packs_body_text.contains("6103"));
    assert!(!packs_body_text.contains("Other Org Recharge Pack"));

    let (recharge_status, recharge_payload, recharge_body_text) = request_json(
        router,
        session_request_builder("POST", "/app/v3/api/recharges/orders", 10, 20, 30)
            .header("content-type", "application/json")
            .header("Idempotency-Key", "recharge-owner-idem-1")
            .header("Sdkwork-Request-No", "recharge-owner-request-1")
            .body(Body::from(r#"{"amount":"10.00","method":"wechat"}"#))
            .unwrap(),
    )
    .await;
    assert_eq!(StatusCode::OK, recharge_status);
    assert_eq!("2000", recharge_payload["code"]);
    assert_eq!(true, recharge_payload["data"]["success"]);
    assert_eq!("10.00", recharge_payload["data"]["amount"]);
    assert_eq!(125, recharge_payload["data"]["points"]);
    assert_eq!("wechat", recharge_payload["data"]["paymentMethod"]);
    assert_eq!("pending", recharge_payload["data"]["status"]);
    assert!(recharge_payload["data"]["orderNo"]
        .as_str()
        .unwrap()
        .starts_with("RC"));
    assert!(!recharge_body_text.contains("Other Org Recharge Pack"));

    let verification_pool = create_sqlite_pool(&database_url).await;
    let owner_order_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM commerce_order WHERE tenant_id = '10' AND organization_id = '20' AND owner_user_id = '30' AND subject = 'points_recharge' AND status = 'pending_payment'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let owner_order_item_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM commerce_order_item oi JOIN commerce_order o ON o.id = oi.order_id WHERE o.tenant_id = '10' AND o.organization_id = '20' AND o.owner_user_id = '30' AND oi.title = 'Starter Recharge Pack'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let owner_payment_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM commerce_payment_intent p JOIN commerce_order o ON o.id = p.order_id WHERE o.owner_user_id = '30' AND p.amount = '10.00' AND p.status = 'pending' AND p.provider = 'wechat'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let owner_payment_attempt_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM commerce_payment_attempt p JOIN commerce_order o ON o.id = p.order_id WHERE o.owner_user_id = '30' AND p.amount = '10.00' AND p.status = 'pending' AND p.callback_payload = '{\"points\":125}'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let other_user_order_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM commerce_order WHERE tenant_id = '10' AND organization_id = '20' AND owner_user_id = '31'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    verification_pool.close().await;

    assert_eq!(1, owner_order_count);
    assert_eq!(1, owner_order_item_count);
    assert_eq!(1, owner_payment_count);
    assert_eq!(1, owner_payment_attempt_count);
    assert_eq!(0, other_user_order_count);
}

#[tokio::test]
async fn database_config_commerce_foundation_reads_exchange_rules_for_session_scope() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_exchange_rule_runtime_data(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;
    let unauthenticated_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/wallet/exchange_rate")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, unauthenticated_response.status());

    let (rate_status, rate_payload, rate_body_text) = request_json(
        router.clone(),
        session_request(
            "GET",
            "/app/v3/api/wallet/exchange_rate",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;
    assert_eq!(StatusCode::OK, rate_status);
    assert_eq!("2000", rate_payload["code"]);
    assert_eq!("POINTS", rate_payload["data"]["sourceAssetType"]);
    assert_eq!("CASH", rate_payload["data"]["targetAssetType"]);
    assert_eq!("120", rate_payload["data"]["rate"]);
    assert!(!rate_body_text.contains("Other Org Exchange Rule"));

    let (rules_status, rules_payload, rules_body_text) = request_json(
        router,
        session_request(
            "GET",
            "/app/v3/api/wallet/exchange_rules?source_asset_type=points&target_asset_type=cash",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;
    assert_eq!(StatusCode::OK, rules_status);
    assert_eq!("2000", rules_payload["code"]);
    let rules = rules_payload["data"].as_array().unwrap();
    assert_eq!(1, rules.len());
    assert_eq!("exchange-1", rules[0]["id"]);
    assert_eq!("POINTS", rules[0]["sourceAssetType"]);
    assert_eq!("CASH", rules[0]["targetAssetType"]);
    assert_eq!("120", rules[0]["rate"]);
    assert_eq!("active", rules[0]["status"]);
    assert!(!rules_body_text.contains("Other Org Exchange Rule"));
}

#[tokio::test]
async fn database_config_settings_requires_session_and_upserts_subject_preferences_and_webhook() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_settings_runtime_data(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;
    let unauthenticated_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/iam/users/settings")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, unauthenticated_response.status());

    let (initial_status, initial_payload, initial_body_text) = request_json(
        router.clone(),
        session_request(
            "GET",
            "/app/v3/api/iam/users/settings",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;
    assert_eq!(StatusCode::OK, initial_status);
    assert_eq!("2000", initial_payload["code"]);
    assert_eq!("zh-CN", initial_payload["data"]["language"]);
    assert_eq!("Asia/Shanghai", initial_payload["data"]["timezone"]);
    assert_eq!(
        "https://owner.example.com/hook",
        initial_payload["data"]["webhookUrl"]
    );
    assert_eq!(
        true,
        initial_payload["data"]["notifications"]["billReminder"]
    );
    assert_eq!(
        false,
        initial_payload["data"]["notifications"]["quotaWarning"]
    );
    assert_eq!(true, initial_payload["data"]["notifications"]["apiMonitor"]);
    assert!(!initial_body_text.contains("https://other.example.com/hook"));

    let (update_status, update_payload, _update_body_text) = request_json(
        router.clone(),
        session_request_builder("PUT", "/app/v3/api/iam/users/settings", 10, 20, 30)
            .header("content-type", "application/json")
            .body(Body::from(
                serde_json::json!({
                    "language": "en-US",
                    "timezone": "UTC",
                    "webhookUrl": "https://owner.example.com/new-hook",
                    "notifications": {
                        "billReminder": false,
                        "quotaWarning": true,
                        "apiMonitor": false
                    }
                })
                .to_string(),
            ))
            .unwrap(),
    )
    .await;
    assert_eq!(StatusCode::OK, update_status);
    assert_eq!("2000", update_payload["code"]);
    assert_eq!(true, update_payload["data"]["success"]);

    let (updated_status, updated_payload, updated_body_text) = request_json(
        router,
        session_request(
            "GET",
            "/app/v3/api/iam/users/settings",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;
    assert_eq!(StatusCode::OK, updated_status);
    assert_eq!("en-US", updated_payload["data"]["language"]);
    assert_eq!("UTC", updated_payload["data"]["timezone"]);
    assert_eq!(
        "https://owner.example.com/new-hook",
        updated_payload["data"]["webhookUrl"]
    );
    assert_eq!(
        false,
        updated_payload["data"]["notifications"]["billReminder"]
    );
    assert_eq!(
        true,
        updated_payload["data"]["notifications"]["quotaWarning"]
    );
    assert_eq!(
        false,
        updated_payload["data"]["notifications"]["apiMonitor"]
    );
    assert!(!updated_body_text.contains("https://other.example.com/hook"));

    let verification_pool = create_sqlite_pool(&database_url).await;
    let other_language: String = sqlx::query_scalar(
        "SELECT language FROM iam_user_preference WHERE tenant_id = 10 AND organization_id = 20 AND user_id = 31",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let other_webhook_url: String = sqlx::query_scalar(
        "SELECT target_url FROM integration_webhook_endpoint WHERE tenant_id = 10 AND organization_id = 20 AND endpoint_code = 'console-settings-user-31'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    verification_pool.close().await;

    assert_eq!("ja-JP", other_language);
    assert_eq!("https://other.example.com/hook", other_webhook_url);
}

#[tokio::test]
async fn database_config_usage_logs_require_session_filter_and_scope_logs_to_subject() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_usage_logs_runtime_data(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;
    let unauthenticated_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/ai/usage/logs")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, unauthenticated_response.status());

    let (success_status, success_payload, success_body_text) = request_json(
        router.clone(),
        session_request(
            "GET",
            "/app/v3/api/ai/usage/logs?status=success&q=gpt-4o-mini&start_time=2026-04-29T00:00:00Z&end_time=2026-04-29T23:59:59Z",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;
    assert_eq!(StatusCode::OK, success_status);
    assert_eq!("2000", success_payload["code"]);
    assert_eq!(1, success_payload["data"]["total"]);
    let success_logs = success_payload["data"]["logs"].as_array().unwrap();
    assert_eq!(1, success_logs.len());
    assert_eq!("usage-owner-success", success_logs[0]["requestId"]);
    assert_eq!("Owner Usage Key", success_logs[0]["tokenName"]);
    assert_eq!("standard-group", success_logs[0]["group"]);
    assert_eq!("text", success_logs[0]["type"]);
    assert_eq!("gpt-4o-mini", success_logs[0]["model"]);
    assert_eq!("345ms", success_logs[0]["totalTime"]);
    assert_eq!("120ms", success_logs[0]["ttft"]);
    assert_eq!(true, success_logs[0]["isStream"]);
    assert_eq!(100, success_logs[0]["inputTokens"]);
    assert_eq!(10, success_logs[0]["cacheReadTokens"]);
    assert_eq!(50, success_logs[0]["outputTokens"]);
    assert_eq!("0.012345", success_logs[0]["cost"]);
    assert_eq!("1.250000", success_logs[0]["multiplier"]);
    assert_eq!("0.150000", success_logs[0]["baseInputPrice"]);
    assert_eq!("0.600000", success_logs[0]["baseOutputPrice"]);
    assert_eq!("0.050000", success_logs[0]["cacheReadPrice"]);
    assert_eq!("/v1/chat/completions", success_logs[0]["path"]);
    assert_eq!("medium", success_logs[0]["reasoningEffort"]);
    assert_eq!("203.0.113.***", success_logs[0]["ip"]);
    assert!(!success_body_text.contains("other-user-usage-request"));
    assert!(!success_body_text.contains("203.0.113.42"));

    let (error_status, error_payload, error_body_text) = request_json(
        router,
        session_request(
            "GET",
            "/app/v3/api/ai/usage/logs?status=error&start_time=2026-04-29T00:00:00Z&end_time=2026-04-29T23:59:59Z",
            Body::empty(),
            10,
            20,
            30,
        ),
    )
    .await;
    assert_eq!(StatusCode::OK, error_status);
    assert_eq!("2000", error_payload["code"]);
    assert_eq!(1, error_payload["data"]["total"]);
    let error_logs = error_payload["data"]["logs"].as_array().unwrap();
    assert_eq!(1, error_logs.len());
    assert_eq!("usage-owner-error", error_logs[0]["requestId"]);
    assert_eq!("provider_error", error_logs[0]["reasoningEffort"]);
    assert!(!error_body_text.contains("usage-owner-success"));
    assert!(!error_body_text.contains("other-user-usage-request"));
    assert!(!error_body_text.contains("203.0.113.42"));
}

async fn capture_provider_health_probe(
    State(captured): State<Arc<Mutex<Vec<CapturedProviderHealthProbe>>>>,
    headers: HeaderMap,
    Json(body): Json<Value>,
) -> Json<Value> {
    captured.lock().unwrap().push(CapturedProviderHealthProbe {
        authorization: headers
            .get("authorization")
            .and_then(|value| value.to_str().ok())
            .map(str::to_owned),
        body,
    });
    Json(json!({
        "id": "chatcmpl-health",
        "object": "chat.completion",
        "model": "gpt-4o-mini",
        "choices": [
            {
                "index": 0,
                "message": {"role": "assistant", "content": "pong"},
                "finish_reason": "stop"
            }
        ]
    }))
}

async fn configured_router(database_url: &str) -> axum::Router {
    configured_router_with_deployment_mode(database_url, DeploymentMode::Desktop).await
}

async fn configured_router_with_deployment_mode(
    database_url: &str,
    deployment_mode: DeploymentMode,
) -> axum::Router {
    sdkwork_claw_app_api::router_with_database_config_api_key_trusted_subject_app_session_deployment_mode_config(
        DatabaseConfig::from_url_with_max_connections(database_url, 1).unwrap(),
        api_key_security_config(),
        trusted_subject_config(),
        app_session_config(),
        payment_webhook_config(),
        deployment_mode,
    )
    .await
    .unwrap()
}

async fn configured_router_with_provider_secret_map(
    database_url: &str,
    provider_secret_map_config: ProviderSecretMapConfig,
) -> axum::Router {
    sdkwork_claw_app_api::router_with_database_config_api_key_trusted_subject_app_session_provider_secret_map_and_deployment_mode_config(
        DatabaseConfig::from_url_with_max_connections(database_url, 1).unwrap(),
        api_key_security_config(),
        trusted_subject_config(),
        app_session_config(),
        payment_webhook_config(),
        provider_secret_map_config,
        DeploymentMode::Desktop,
    )
    .await
    .unwrap()
}

async fn request_json(router: axum::Router, request: Request<Body>) -> (StatusCode, Value, String) {
    let response = router.oneshot(request).await.unwrap();
    let status = response.status();
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body_text = String::from_utf8(body.to_vec()).unwrap();
    let payload: Value = serde_json::from_str(&body_text).unwrap();
    (status, payload, body_text)
}

fn session_request(
    method: &str,
    uri: &str,
    body: Body,
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
) -> Request<Body> {
    session_request_builder(method, uri, tenant_id, organization_id, user_id)
        .body(body)
        .unwrap()
}

fn session_request_builder(
    method: &str,
    uri: &str,
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
) -> axum::http::request::Builder {
    session_authorization_header(
        Request::builder().method(method).uri(uri),
        tenant_id,
        organization_id,
        user_id,
    )
}

fn api_key_security_config() -> ApiKeySecurityConfig {
    test_api_key_security_config().unwrap()
}

fn trusted_subject_config() -> sdkwork_claw_config::TrustedSubjectConfig {
    test_trusted_subject_config().unwrap()
}

fn app_session_config() -> sdkwork_claw_config::AppSessionConfig {
    test_app_session_config().unwrap()
}

fn payment_webhook_config() -> sdkwork_claw_config::PaymentWebhookConfig {
    test_payment_webhook_config().unwrap()
}

fn session_authorization_header(
    builder: axum::http::request::Builder,
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
) -> axum::http::request::Builder {
    let issued_at = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0);
    let expires_at = issued_at + 300;
    let (authorization, access_token) = app_session_dual_token_headers(
        trusted_request_subject(tenant_id, organization_id, user_id),
        issued_at,
        expires_at,
    )
    .unwrap();
    builder
        .header("authorization", authorization)
        .header("Sdkwork-Access-Token", access_token)
}

fn unique_sqlite_url() -> String {
    let nonce = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos();
    let sequence = SQLITE_DB_SEQUENCE.fetch_add(1, Ordering::Relaxed);
    let process_id = std::process::id();
    let path = format!("target/verify-dbs/app-config-{process_id}-{nonce}-{sequence}.db");
    std::fs::create_dir_all("target/verify-dbs").unwrap();
    format!("sqlite://{path}")
}

async fn create_sqlite_pool(database_url: &str) -> SqlitePool {
    let options = SqliteConnectOptions::from_str(database_url)
        .unwrap()
        .create_if_missing(true);
    SqlitePoolOptions::new()
        .max_connections(1)
        .connect_with(options)
        .await
        .unwrap()
}

async fn create_schema(pool: &SqlitePool) {
    for statement in [
        r#"CREATE TABLE ai_model_vendor (
            id INTEGER PRIMARY KEY,
            vendor_code TEXT NOT NULL,
            display_name TEXT NOT NULL,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            sort_order INTEGER NOT NULL
        )"#,
        r#"CREATE TABLE ai_model (
            id INTEGER PRIMARY KEY,
            catalog_key TEXT,
            model TEXT NOT NULL,
            display_name TEXT NOT NULL,
            vendor_code TEXT NOT NULL,
            capabilities TEXT NOT NULL,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            rank_score TEXT
        )"#,
        r#"CREATE TABLE integration_provider (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
            provider_code TEXT NOT NULL,
            default_vendor_code TEXT,
            integration_type INTEGER,
            display_name TEXT,
            description TEXT,
            base_url TEXT,
            created_at TEXT,
            updated_at TEXT,
            version INTEGER DEFAULT 0,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            sort_order INTEGER
        )"#,
        r#"CREATE TABLE integration_provider_account (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
            provider_id INTEGER,
            provider_code TEXT NOT NULL,
            account_code TEXT,
            account_name TEXT,
            auth_type INTEGER,
            credential_profile INTEGER,
            auth_config TEXT,
            secret_ref TEXT,
            secret_hash TEXT,
            masked_label TEXT,
            upstream_balance_amount TEXT,
            upstream_balance_currency TEXT,
            consecutive_error_count INTEGER,
            risk_level INTEGER,
            created_at TEXT,
            updated_at TEXT,
            version INTEGER DEFAULT 0,
            status INTEGER NOT NULL,
            deleted_at TEXT
        )"#,
        r#"CREATE TABLE integration_channel (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
            provider_id INTEGER,
            provider_code TEXT NOT NULL,
            channel_code TEXT,
            name TEXT,
            protocol INTEGER,
            access_type INTEGER,
            base_url TEXT,
            timeout_ms INTEGER,
            retry_policy TEXT,
            circuit_breaker_policy TEXT,
            model_mode INTEGER,
            environment INTEGER,
            account_id INTEGER,
            proxy_id INTEGER,
            capabilities TEXT,
            created_at TEXT,
            updated_at TEXT,
            version INTEGER DEFAULT 0,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            deleted_by INTEGER,
            priority INTEGER NOT NULL,
            weight INTEGER NOT NULL,
            health_status INTEGER,
            last_latency_ms INTEGER,
            rpm_limit INTEGER,
            consecutive_error_count INTEGER
        )"#,
        r#"CREATE TABLE integration_channel_model (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
            catalog_key TEXT,
            model TEXT NOT NULL,
            channel_id INTEGER NOT NULL,
            vendor_code TEXT,
            provider_model TEXT NOT NULL,
            capability INTEGER,
            supports_streaming INTEGER,
            supports_tools INTEGER,
            created_at TEXT,
            updated_at TEXT,
            version INTEGER DEFAULT 0,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            deleted_by INTEGER,
            effective_from TEXT,
            effective_to TEXT
        )"#,
        r#"CREATE TABLE integration_provider_health_snapshot (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER,
            organization_id INTEGER,
            user_id INTEGER,
            request_id TEXT,
            trace_id TEXT,
            payload_hash TEXT,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            retention_until TEXT,
            legal_hold INTEGER DEFAULT 0,
            metadata TEXT,
            provider_id INTEGER,
            channel_id INTEGER,
            provider_account_id INTEGER,
            check_type INTEGER,
            health_status INTEGER,
            latency_ms INTEGER,
            http_status INTEGER,
            error_code TEXT,
            error_message_masked TEXT,
            quota_snapshot TEXT,
            checked_at TEXT
        )"#,
        r#"CREATE TABLE integration_proxy (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER,
            organization_id INTEGER,
            endpoint TEXT,
            status INTEGER NOT NULL,
            health_status INTEGER,
            deleted_at TEXT
        )"#,
        r#"CREATE TABLE ai_pricing_plan (
            id INTEGER PRIMARY KEY,
            plan_code TEXT NOT NULL,
            base_price_side INTEGER NOT NULL,
            default_multiplier TEXT NOT NULL,
            default_markup_amount TEXT NOT NULL,
            currency TEXT NOT NULL,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            priority INTEGER NOT NULL,
            effective_from TEXT,
            effective_to TEXT
        )"#,
        r#"CREATE TABLE iam_gateway_api_key_group (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            code TEXT NOT NULL,
            pricing_plan_code TEXT NOT NULL,
            rate_multiplier TEXT NOT NULL,
            official_price_multiplier TEXT NOT NULL,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            updated_at TEXT
        )"#,
        r#"CREATE TABLE iam_gateway_api_key (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            group_id INTEGER NOT NULL,
            uuid TEXT,
            name TEXT,
            key_prefix TEXT NOT NULL,
            key_display_masked TEXT,
            key_hash TEXT NOT NULL,
            hash_alg TEXT,
            secret_version INTEGER,
            idempotency_key TEXT NOT NULL,
            policy_id INTEGER,
            quota_policy_id INTEGER,
            status INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT,
            deleted_at TEXT,
            revoked_at TEXT,
            expire_at TEXT,
            last_revealed_at TEXT,
            metadata TEXT NOT NULL DEFAULT '{}'
        )"#,
        r#"CREATE TABLE iam_gateway_access_policy (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            name TEXT,
            allowed_capabilities TEXT,
            ip_allowlist TEXT,
            network_policy_mode INTEGER,
            ip_rule_count INTEGER,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            effective_from TEXT,
            effective_to TEXT,
            updated_at TEXT
        )"#,
        r#"CREATE TABLE ai_quota_policy (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            name TEXT,
            quota_period INTEGER,
            quota_unit INTEGER,
            quota_limit TEXT,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            effective_from TEXT,
            effective_to TEXT,
            updated_at TEXT
        )"#,
        r#"CREATE TABLE iam_gateway_api_key_group_metric_snapshot (
            id INTEGER PRIMARY KEY,
            group_id INTEGER NOT NULL,
            capacity_used TEXT,
            capacity_limit TEXT,
            usage_amount_total TEXT,
            snapshot_at TEXT,
            status INTEGER NOT NULL
        )"#,
        r#"CREATE TABLE ai_model_pricing (
            id INTEGER PRIMARY KEY,
            catalog_key TEXT,
            model TEXT NOT NULL,
            price_side INTEGER NOT NULL,
            billing_meter_code TEXT NOT NULL,
            unit_price TEXT NOT NULL,
            currency TEXT NOT NULL,
            provider_code TEXT,
            channel_id INTEGER,
            pricing_plan_code TEXT,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            effective_from TEXT,
            effective_to TEXT,
            priority INTEGER NOT NULL
        )"#,
        r#"CREATE TABLE ops_audit_log (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER,
            organization_id INTEGER,
            request_id TEXT,
            trace_id TEXT,
            operator_id INTEGER,
            action TEXT,
            target_type INTEGER,
            target_id INTEGER,
            created_at TEXT,
            retention_until TEXT,
            legal_hold INTEGER DEFAULT 0,
            metadata TEXT,
            operator_type INTEGER,
            operator_name_snapshot TEXT,
            target_uuid TEXT,
            client_ip_hash TEXT,
            user_agent_hash TEXT,
            before_hash TEXT,
            after_hash TEXT,
            change_summary TEXT
        )"#,
        r#"CREATE TABLE iam_tenant (
            id TEXT PRIMARY KEY,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )"#,
        r#"CREATE TABLE iam_organization (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            parent_id TEXT,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            path TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )"#,
        r#"CREATE TABLE iam_user (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            username TEXT NOT NULL,
            display_name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            avatar_url TEXT,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )"#,
        r#"CREATE TABLE iam_organization_member (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            role_code TEXT,
            status TEXT NOT NULL,
            joined_at TEXT NOT NULL
        )"#,
        r#"CREATE TABLE iam_credential (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            credential_type TEXT NOT NULL,
            credential_hash TEXT NOT NULL,
            status TEXT NOT NULL,
            expires_at TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )"#,
        r#"CREATE TABLE iam_user_identity (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            provider TEXT NOT NULL,
            subject TEXT NOT NULL,
            email TEXT,
            created_at TEXT NOT NULL
        )"#,
        r#"CREATE TABLE iam_session (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            user_id TEXT NOT NULL,
            app_id TEXT NOT NULL,
            environment TEXT NOT NULL,
            deployment_mode TEXT NOT NULL,
            auth_level TEXT NOT NULL,
            auth_token_hash TEXT NOT NULL,
            access_token_hash TEXT NOT NULL,
            refresh_token_hash TEXT,
            sharding_key TEXT NOT NULL,
            sharding_strategy TEXT NOT NULL,
            data_scope_json TEXT NOT NULL,
            permission_scope_json TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            revoked_at TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )"#,
        r#"CREATE TABLE iam_security_event (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            user_id TEXT,
            session_id TEXT,
            event_type TEXT NOT NULL,
            severity TEXT NOT NULL,
            detail_json TEXT NOT NULL,
            created_at TEXT NOT NULL
        )"#,
        r#"CREATE TABLE iam_audit_event (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            actor_user_id TEXT,
            action TEXT NOT NULL,
            resource_type TEXT NOT NULL,
            resource_id TEXT,
            request_id TEXT,
            app_id TEXT,
            environment TEXT,
            sharding_key TEXT,
            detail_json TEXT NOT NULL,
            created_at TEXT NOT NULL
        )"#,
        r#"CREATE TABLE iam_user_preference (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            owner_type INTEGER,
            owner_id INTEGER,
            data_scope INTEGER,
            status INTEGER,
            created_at TEXT,
            updated_at TEXT,
            version INTEGER DEFAULT 0,
            metadata TEXT,
            language TEXT,
            timezone TEXT,
            notification_preferences TEXT,
            deleted_by INTEGER,
            deleted_at TEXT
        )"#,
        r#"CREATE UNIQUE INDEX idx_iam_user_preference_subject
            ON iam_user_preference (tenant_id, organization_id, user_id)"#,
        r#"CREATE TABLE iam_user_security_setting (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            last_login_at TEXT,
            password_last_changed_at TEXT,
            mfa_enabled INTEGER NOT NULL,
            security_level INTEGER NOT NULL,
            deleted_at TEXT
        )"#,
        r#"CREATE TABLE iam_user_login_event (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            request_id TEXT,
            auth_method INTEGER,
            auth_provider TEXT,
            login_result INTEGER,
            risk_level INTEGER,
            mfa_verified INTEGER,
            session_id_hash TEXT,
            occurred_at TEXT,
            created_at TEXT,
            client_ip_masked TEXT
        )"#,
        r#"CREATE TABLE ai_usage_fact (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            api_key_id INTEGER,
            request_id TEXT,
            model TEXT,
            status INTEGER NOT NULL,
            request_count INTEGER,
            total_tokens INTEGER,
            prompt_tokens INTEGER,
            cached_tokens INTEGER,
            completion_tokens INTEGER,
            customer_charge_amount TEXT,
            cost_amount TEXT,
            modality INTEGER,
            rate_multiplier TEXT,
            base_input_unit_price TEXT,
            base_output_unit_price TEXT,
            cache_read_unit_price TEXT,
            occurred_at TEXT
        )"#,
        r#"CREATE TABLE ai_request_trace (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            request_id TEXT,
            trace_id TEXT,
            status INTEGER NOT NULL,
            created_at TEXT,
            api_key_name_snapshot TEXT,
            api_key_group_snapshot TEXT,
            channel_name_snapshot TEXT,
            requested_model TEXT,
            provider_model TEXT,
            started_at TEXT,
            http_status INTEGER,
            provider_error_code TEXT,
            error_type TEXT,
            latency_ms INTEGER,
            ttft_ms INTEGER,
            streaming INTEGER,
            prompt_tokens INTEGER,
            cached_tokens INTEGER,
            completion_tokens INTEGER,
            reasoning_effort TEXT,
            total_tokens INTEGER,
            client_ip_masked TEXT,
            request_path TEXT,
            endpoint TEXT,
            http_method TEXT
        )"#,
        r#"CREATE TABLE ai_routing_decision_log (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER,
            request_id TEXT,
            status INTEGER NOT NULL,
            created_at TEXT,
            requested_model TEXT,
            resolved_model TEXT,
            selected_channel_id INTEGER
        )"#,
        r#"CREATE TABLE ai_routing_policy (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
            status INTEGER NOT NULL,
            created_at TEXT,
            updated_at TEXT,
            version INTEGER,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT,
            policy_code TEXT,
            name TEXT,
            policy_scope INTEGER,
            subject_id INTEGER,
            capability INTEGER,
            default_profile_id INTEGER,
            fallback_mode INTEGER,
            slo_latency_ms INTEGER,
            slo_success_rate TEXT,
            cost_ceiling TEXT,
            currency TEXT,
            UNIQUE(tenant_id, organization_id, policy_code)
        )"#,
        r#"CREATE TABLE ai_routing_profile (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
            status INTEGER NOT NULL,
            created_at TEXT,
            updated_at TEXT,
            version INTEGER,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT,
            policy_id INTEGER,
            profile_version INTEGER,
            profile_name TEXT,
            release_status INTEGER,
            traffic_percent TEXT,
            config_hash TEXT,
            published_at TEXT,
            published_by INTEGER,
            rollback_from_profile_id INTEGER,
            UNIQUE(policy_id, profile_version)
        )"#,
        r#"CREATE TABLE ai_routing_rule (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
            status INTEGER NOT NULL,
            created_at TEXT,
            updated_at TEXT,
            version INTEGER,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT,
            profile_id INTEGER,
            rule_code TEXT,
            priority INTEGER,
            match_expression TEXT,
            target_model TEXT,
            candidate_channels TEXT,
            fallback_chain TEXT,
            constraints TEXT,
            rate_limit_policy_id INTEGER,
            effective_from TEXT,
            effective_to TEXT,
            UNIQUE(profile_id, rule_code)
        )"#,
        r#"CREATE TABLE ai_model_rank_snapshot (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER,
            organization_id INTEGER,
            status INTEGER NOT NULL,
            rank_no INTEGER,
            previous_rank_no INTEGER,
            model TEXT,
            vendor_name_snapshot TEXT,
            vendor_code TEXT,
            modality INTEGER,
            request_count INTEGER,
            cost_amount TEXT,
            snapshot_date TEXT,
            snapshot_period TEXT
        )"#,
        r#"CREATE TABLE content_announcement (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER,
            organization_id INTEGER,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            title TEXT,
            content TEXT,
            published_at TEXT,
            created_at TEXT,
            announcement_type INTEGER,
            effective_from TEXT,
            effective_to TEXT,
            pinned INTEGER
        )"#,
        r#"CREATE TABLE ops_metric_snapshot (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER,
            organization_id INTEGER,
            status INTEGER NOT NULL,
            metric_name TEXT,
            metric_value TEXT,
            period_start TEXT
        )"#,
        r#"CREATE TABLE ops_config_snapshot (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER,
            request_id TEXT,
            trace_id TEXT,
            payload_hash TEXT,
            status INTEGER NOT NULL,
            snapshot_no TEXT,
            config_scope INTEGER,
            config_type INTEGER,
            source_table TEXT NOT NULL,
            source_ids TEXT,
            config_payload TEXT,
            config_hash TEXT,
            published_at TEXT,
            published_by INTEGER,
            rollback_from_snapshot_id INTEGER,
            created_at TEXT NOT NULL,
            retention_until TEXT,
            legal_hold INTEGER DEFAULT 0,
            metadata TEXT
        )"#,
        r#"CREATE TABLE ops_notification_message (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL DEFAULT 0,
            target_user_id INTEGER,
            target_scope INTEGER,
            status INTEGER NOT NULL,
            version INTEGER DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT,
            app_id TEXT,
            scope_type INTEGER DEFAULT 1,
            message_code TEXT,
            title TEXT,
            summary TEXT,
            content TEXT,
            published_at TEXT,
            updated_at TEXT,
            created_at TEXT,
            expire_at TEXT,
            message_type INTEGER,
            severity INTEGER,
            priority INTEGER DEFAULT 0,
            show_as_popup INTEGER DEFAULT 0,
            action_url TEXT
        )"#,
        r#"CREATE TABLE ops_notification_recipient (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL DEFAULT 0,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT,
            updated_at TEXT,
            version INTEGER DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT,
            message_id INTEGER NOT NULL,
            app_id TEXT,
            recipient_type INTEGER NOT NULL,
            recipient_value TEXT,
            recipient_user_id INTEGER,
            recipient_role_code TEXT
        )"#,
        r#"CREATE TABLE ops_notification_delivery (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            owner_type INTEGER,
            owner_id INTEGER,
            data_scope INTEGER NOT NULL DEFAULT 0,
            message_id INTEGER NOT NULL,
            app_id TEXT NOT NULL DEFAULT 'default',
            delivery_channel INTEGER,
            status INTEGER NOT NULL,
            created_at TEXT,
            updated_at TEXT,
            version INTEGER DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT,
            delivery_status INTEGER,
            delivered_at TEXT,
            read_at TEXT,
            popup_seen_at TEXT,
            archived_at TEXT,
            failure_code TEXT,
            retry_count INTEGER
        )"#,
        r#"CREATE UNIQUE INDEX uk_ops_notification_delivery_user_message_app
            ON ops_notification_delivery (tenant_id, organization_id, message_id, user_id, app_id, delivery_channel)"#,
        r#"CREATE TABLE ops_gateway_instance (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER,
            organization_id INTEGER,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            deployment_mode INTEGER,
            region TEXT,
            node_name TEXT,
            health_status INTEGER,
            last_heartbeat_at TEXT
        )"#,
        r#"CREATE TABLE commerce_account (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            owner_user_id TEXT NOT NULL,
            asset_type TEXT NOT NULL,
            currency_code TEXT,
            available_amount TEXT NOT NULL DEFAULT '0',
            frozen_amount TEXT NOT NULL DEFAULT '0',
            version INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE (tenant_id, organization_id, owner_user_id, asset_type, currency_code)
        )"#,
        r#"CREATE TABLE commerce_account_ledger_entry (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            account_id TEXT NOT NULL,
            owner_user_id TEXT NOT NULL,
            asset_type TEXT NOT NULL,
            direction TEXT NOT NULL,
            amount TEXT NOT NULL,
            balance_after TEXT NOT NULL,
            business_type TEXT NOT NULL,
            transaction_no TEXT NOT NULL,
            request_no TEXT NOT NULL,
            idempotency_key TEXT NOT NULL,
            source_type TEXT,
            source_id TEXT,
            remark TEXT,
            created_at TEXT NOT NULL,
            UNIQUE (tenant_id, transaction_no)
        )"#,
        r#"CREATE TABLE commerce_coupon_template (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            template_no TEXT NOT NULL,
            title TEXT NOT NULL,
            discount_type TEXT NOT NULL,
            discount_value TEXT NOT NULL,
            minimum_amount TEXT NOT NULL DEFAULT '0',
            total_quantity INTEGER,
            claimed_quantity INTEGER NOT NULL DEFAULT 0,
            redeemed_quantity INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL,
            starts_at TEXT,
            expires_at TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE (tenant_id, template_no)
        )"#,
        r#"CREATE TABLE commerce_coupon (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            template_id TEXT NOT NULL,
            owner_user_id TEXT NOT NULL,
            coupon_code TEXT NOT NULL,
            status TEXT NOT NULL,
            claimed_at TEXT NOT NULL,
            expires_at TEXT,
            redeemed_at TEXT,
            disabled_at TEXT,
            request_no TEXT NOT NULL,
            idempotency_key TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE (tenant_id, coupon_code)
        )"#,
        r#"CREATE TABLE commerce_coupon_redemption (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            coupon_id TEXT NOT NULL,
            order_id TEXT NOT NULL,
            owner_user_id TEXT NOT NULL,
            discount_amount TEXT NOT NULL,
            status TEXT NOT NULL,
            request_no TEXT NOT NULL,
            idempotency_key TEXT NOT NULL,
            redeemed_at TEXT NOT NULL,
            rolled_back_at TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE (tenant_id, coupon_id, order_id)
        )"#,
        r#"CREATE TABLE commerce_product (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            product_no TEXT NOT NULL,
            title TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE (tenant_id, product_no)
        )"#,
        r#"CREATE TABLE commerce_sku (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            product_id TEXT NOT NULL,
            sku_no TEXT NOT NULL,
            name TEXT NOT NULL,
            title TEXT NOT NULL,
            price_amount TEXT NOT NULL,
            currency_code TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE (tenant_id, sku_no)
        )"#,
        r#"CREATE TABLE commerce_recharge_package (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            package_no TEXT NOT NULL,
            sku_id TEXT NOT NULL,
            name TEXT NOT NULL,
            price_amount TEXT NOT NULL,
            currency_code TEXT NOT NULL,
            bonus_points INTEGER NOT NULL,
            status TEXT NOT NULL,
            valid_from TEXT,
            valid_to TEXT,
            sort_weight INTEGER,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE (tenant_id, package_no)
        )"#,
        r#"CREATE TABLE commerce_order (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            owner_user_id TEXT NOT NULL,
            order_no TEXT NOT NULL,
            status TEXT NOT NULL,
            subject TEXT NOT NULL,
            currency_code TEXT NOT NULL,
            request_no TEXT NOT NULL,
            idempotency_key TEXT NOT NULL,
            created_at TEXT NOT NULL,
            paid_at TEXT,
            cancelled_at TEXT,
            expired_at TEXT,
            updated_at TEXT NOT NULL,
            UNIQUE (tenant_id, order_no)
        )"#,
        r#"CREATE TABLE commerce_order_item (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            order_id TEXT NOT NULL,
            sku_id TEXT NOT NULL,
            title TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            unit_price_amount TEXT NOT NULL,
            total_amount TEXT NOT NULL,
            created_at TEXT NOT NULL
        )"#,
        r#"CREATE TABLE commerce_order_amount_breakdown (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            order_id TEXT NOT NULL,
            original_amount TEXT NOT NULL,
            discount_amount TEXT NOT NULL,
            payable_amount TEXT NOT NULL,
            currency_code TEXT NOT NULL,
            created_at TEXT NOT NULL,
            UNIQUE (tenant_id, order_id)
        )"#,
        r#"CREATE TABLE commerce_payment_intent (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            owner_user_id TEXT NOT NULL,
            order_id TEXT NOT NULL,
            provider TEXT NOT NULL,
            amount TEXT NOT NULL,
            currency_code TEXT NOT NULL,
            status TEXT NOT NULL,
            request_no TEXT NOT NULL,
            idempotency_key TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )"#,
        r#"CREATE TABLE commerce_payment_attempt (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            owner_user_id TEXT NOT NULL,
            payment_intent_id TEXT NOT NULL,
            order_id TEXT NOT NULL,
            provider TEXT NOT NULL,
            out_trade_no TEXT NOT NULL,
            amount TEXT NOT NULL,
            currency_code TEXT NOT NULL,
            status TEXT NOT NULL,
            callback_payload TEXT,
            created_at TEXT NOT NULL,
            paid_at TEXT,
            updated_at TEXT NOT NULL,
            UNIQUE (tenant_id, provider, out_trade_no)
        )"#,
        r#"CREATE TABLE commerce_payment_method (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            method_key TEXT NOT NULL,
            display_name TEXT NOT NULL,
            provider TEXT NOT NULL,
            status TEXT NOT NULL,
            sort_weight INTEGER,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE (tenant_id, organization_id, method_key)
        )"#,
        r#"CREATE TABLE commerce_exchange_rule (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            rule_no TEXT NOT NULL,
            source_asset_type TEXT NOT NULL,
            target_asset_type TEXT NOT NULL,
            rate TEXT NOT NULL,
            status TEXT NOT NULL,
            remark TEXT,
            request_no TEXT NOT NULL,
            idempotency_key TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE (tenant_id, organization_id, source_asset_type, target_asset_type)
        )"#,
        r#"CREATE TABLE integration_webhook_endpoint (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER,
            owner_type INTEGER,
            owner_id INTEGER,
            data_scope INTEGER,
            status INTEGER NOT NULL,
            created_at TEXT,
            updated_at TEXT,
            version INTEGER DEFAULT 0,
            metadata TEXT,
            endpoint_code TEXT NOT NULL,
            name TEXT,
            target_url TEXT,
            event_types TEXT,
            signing_alg TEXT,
            retry_policy TEXT,
            failure_count INTEGER,
            deleted_at TEXT,
            deleted_by INTEGER
        )"#,
        r#"CREATE UNIQUE INDEX idx_integration_webhook_endpoint_subject_code
            ON integration_webhook_endpoint (tenant_id, organization_id, endpoint_code)"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_catalog_with_two_user_api_keys(pool: &SqlitePool) {
    let owner_key_metadata = api_key_metadata_json("sk-owner-secret");
    let other_key_metadata = api_key_metadata_json("sk-other-secret");
    for statement in [
        "INSERT INTO ai_model_vendor (id, vendor_code, display_name, status, sort_order) VALUES (1, 'openai', 'OpenAI', 1, 1)",
        r#"INSERT INTO ai_model
            (id, catalog_key, model, display_name, vendor_code, capabilities, status, rank_score)
            VALUES (1, 'openai/gpt-4o-mini', 'gpt-4o-mini', 'GPT-4o mini', 'openai', '["chat"]', 1, '100.0')"#,
        "INSERT INTO integration_provider (id, provider_code, base_url, status) VALUES (2, 'openrouter', 'http://provider-proxy.internal/openrouter-template', 1)",
        "INSERT INTO integration_provider_account (id, provider_code, secret_ref, status) VALUES (9002, 'openrouter', 'vault://providers/openrouter/account/main', 1)",
        "INSERT INTO integration_channel (id, provider_code, base_url, account_id, status, priority, weight) VALUES (3001, 'openrouter', 'http://provider-proxy.internal/openrouter', 9002, 1, 10, 100)",
        "INSERT INTO integration_channel_model (id, catalog_key, model, channel_id, vendor_code, provider_model, status) VALUES (1, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 3001, 'openai', 'openai/global/gpt-4o-mini', 1)",
        "INSERT INTO ai_pricing_plan (id, plan_code, base_price_side, default_multiplier, default_markup_amount, currency, status, priority) VALUES (1, 'standard', 1, '1.200000', '0.000000', 'USD', 1, 1)",
        "INSERT INTO iam_gateway_api_key_group (id, code, pricing_plan_code, rate_multiplier, official_price_multiplier, status, updated_at) VALUES (10, 'standard-group', 'standard', '1.000000', '1.100000', 1, '2026-04-29 09:00:00')",
        "INSERT INTO ai_model_pricing (id, catalog_key, model, price_side, billing_meter_code, unit_price, currency, status, priority) VALUES (1, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 1, 'llm_input_token', '0.150000', 'USD', 1, 1)",
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
    sqlx::query(
        r#"
        INSERT INTO iam_gateway_api_key
            (id, tenant_id, organization_id, user_id, group_id, name, key_prefix, key_display_masked, key_hash, idempotency_key, status, created_at, updated_at, metadata)
            VALUES (100, 10, 20, 30, 10, 'Owner Key', 'sk-owner', 'sk-owner********ABCD', 'hash:owner', 'seed-owner-key', 1, '2026-04-10 20:55:41', '2026-04-29 09:00:00', ?)
        "#,
    )
    .bind(&owner_key_metadata)
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        INSERT INTO iam_gateway_api_key
            (id, tenant_id, organization_id, user_id, group_id, name, key_prefix, key_display_masked, key_hash, idempotency_key, status, created_at, updated_at, metadata)
            VALUES (101, 10, 20, 31, 10, 'Other User Key', 'sk-other', 'sk-other********WXYZ', 'hash:other', 'seed-other-key', 1, '2026-04-10 20:55:42', '2026-04-29 09:01:00', ?)
        "#,
    )
    .bind(&other_key_metadata)
    .execute(pool)
    .await
    .unwrap();
}

fn api_key_metadata_json(secret: &str) -> String {
    let codec = RingAeadApiKeySecretCodec::new(api_key_security_config().pepper_secret()).unwrap();
    serde_json::json!({
        "copyableKeyCiphertext": codec.encode_secret(secret).unwrap(),
        "copyableKeyStorage": "encrypted-managed-console-read-model"
    })
    .to_string()
}

async fn seed_app_user_data(pool: &SqlitePool) {
    let owner_password_hash = Pbkdf2Sha256PasswordHasher::hash_password_with_salt(
        "correct-password",
        b"database-config-owner-password-salt",
        1_000,
    )
    .unwrap();
    for statement in [
        r#"INSERT INTO iam_tenant
            (id, code, name, status, created_at, updated_at)
            VALUES ('10', 'default', 'Default Tenant', 'active', '2026-04-01 00:00:00', '2026-04-29 08:00:00')"#,
        r#"INSERT INTO iam_organization
            (id, tenant_id, parent_id, code, name, path, status, created_at, updated_at)
            VALUES ('20', '10', NULL, 'root', 'Root Organization', '/20', 'active', '2026-04-01 00:00:00', '2026-04-29 08:00:00')"#,
        r#"INSERT INTO iam_user
            (id, tenant_id, username, display_name, email, phone, avatar_url, status, created_at, updated_at)
            VALUES ('30', '10', 'owner', 'Owner User', 'owner@example.com', '+15550000030', 'O', 'active', '2026-04-01 08:00:00', '2026-04-29 08:00:00')"#,
        r#"INSERT INTO iam_user
            (id, tenant_id, username, display_name, email, phone, avatar_url, status, created_at, updated_at)
            VALUES ('31', '10', 'other', 'Other User', 'other@example.com', '+15550000031', 'O', 'active', '2026-04-02 08:00:00', '2026-04-29 08:00:00')"#,
        r#"INSERT INTO iam_organization_member
            (id, tenant_id, organization_id, user_id, role_code, status, joined_at)
            VALUES ('member-30', '10', '20', '30', 'owner', 'active', '2026-04-01 08:00:00')"#,
        r#"INSERT INTO iam_organization_member
            (id, tenant_id, organization_id, user_id, role_code, status, joined_at)
            VALUES ('member-31', '10', '20', '31', 'member', 'active', '2026-04-02 08:00:00')"#,
        "INSERT INTO iam_user_preference (id, tenant_id, organization_id, user_id, language) VALUES (1001, 10, 20, 30, 'zh-CN')",
        r#"INSERT INTO iam_user_security_setting
            (id, tenant_id, organization_id, user_id, last_login_at, password_last_changed_at, mfa_enabled, security_level)
            VALUES (1002, 10, 20, 30, '2026-04-20 12:00:00', '2026-04-20 12:00:00', 1, 1)"#,
        r#"INSERT INTO iam_user_login_event
            (id, tenant_id, organization_id, user_id, request_id, occurred_at, created_at, client_ip_masked)
            VALUES (1003, 10, 20, 30, 'owner-login-request', '2026-04-29 10:00:00', '2026-04-29 10:00:00', '203.0.113.***')"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
    sqlx::query(
        r#"INSERT INTO iam_credential
            (id, tenant_id, user_id, credential_type, credential_hash, status, created_at, updated_at)
            VALUES ('credential-30-password', '10', '30', 'password', ?, 'active', '2026-04-01 08:00:00', '2026-04-29 08:00:00')"#,
    )
    .bind(owner_password_hash)
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"INSERT INTO iam_credential
            (id, tenant_id, user_id, credential_type, credential_hash, status, created_at, updated_at)
            VALUES ('credential-31-password', '10', '31', 'password', 'other-password-hash', 'active', '2026-04-02 08:00:00', '2026-04-29 08:00:00')"#,
    )
    .execute(pool)
    .await
    .unwrap();
    for statement in [
        r#"INSERT INTO iam_user_identity
            (id, tenant_id, user_id, provider, subject, email, created_at)
            VALUES ('identity-30-github', '10', '30', 'github', 'github-owner-open-id', 'owner@example.com', '2026-04-01 08:00:00')"#,
        r#"INSERT INTO iam_user_identity
            (id, tenant_id, user_id, provider, subject, email, created_at)
            VALUES ('identity-30-google', '10', '30', 'google', 'google-owner-open-id', 'owner@example.com', '2026-04-01 08:00:00')"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_second_app_organization_membership(pool: &SqlitePool) {
    for statement in [
        r#"INSERT INTO iam_organization
            (id, tenant_id, parent_id, code, name, path, status, created_at, updated_at)
            VALUES ('21', '10', NULL, 'workspace', 'Workspace Organization', '/21', 'active', '2026-04-02 00:00:00', '2026-04-29 08:00:00')"#,
        r#"INSERT INTO iam_organization_member
            (id, tenant_id, organization_id, user_id, role_code, status, joined_at)
            VALUES ('member-30-workspace', '10', '21', '30', 'member', 'active', '2026-03-31 08:00:00')"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_auth_settings_snapshot(pool: &SqlitePool, payload: Value) {
    sqlx::query(
        r#"
        INSERT INTO ops_config_snapshot
            (uuid, tenant_id, organization_id, user_id, request_id, status, created_at, snapshot_no, config_scope, config_type, source_table, source_ids, config_payload, config_hash, published_at, published_by)
        VALUES
            ('auth-settings-policy-snapshot', 10, 20, 30, 'auth-settings-policy-seed', 1, '2026-04-29 09:00:00', 'auth-settings-policy-seed', 30, 65, 'iam_auth_runtime_settings', '["auth-settings"]', ?, 'hash:auth-settings-policy-seed', '2026-04-29 09:00:00', 30)
        "#,
    )
    .bind(payload.to_string())
    .execute(pool)
    .await
    .unwrap();
}

async fn seed_dashboard_data(pool: &SqlitePool) {
    for statement in [
        r#"INSERT INTO ai_usage_fact
            (id, tenant_id, organization_id, user_id, request_id, status, request_count, total_tokens, customer_charge_amount, cost_amount, modality, occurred_at)
            VALUES (2001, 10, 20, 30, 'owner-text-request', 1, 5, 1000, '1.000000', '0.700000', 1, '2026-04-29 09:00:00')"#,
        r#"INSERT INTO ai_usage_fact
            (id, tenant_id, organization_id, user_id, request_id, status, request_count, total_tokens, customer_charge_amount, cost_amount, modality, occurred_at)
            VALUES (2002, 10, 20, 30, 'owner-image-request', 1, 2, 0, '0.250000', '0.120000', 2, '2026-04-29 11:00:00')"#,
        r#"INSERT INTO ai_usage_fact
            (id, tenant_id, organization_id, user_id, request_id, status, request_count, total_tokens, customer_charge_amount, cost_amount, modality, occurred_at)
            VALUES (2010, 10, 20, 30, 'owner-history-request', 1, 3, 300, '1.750000', '1.200000', 1, '2026-03-01 08:00:00')"#,
        r#"INSERT INTO ai_usage_fact
            (id, tenant_id, organization_id, user_id, request_id, status, request_count, total_tokens, customer_charge_amount, cost_amount, modality, occurred_at)
            VALUES (2003, 10, 20, 31, 'other-user-request', 1, 99, 9900, '99.000000', '50.000000', 1, '2026-04-29 10:00:00')"#,
        r#"INSERT INTO ai_request_trace
            (id, tenant_id, organization_id, user_id, request_id, status, started_at, http_status, provider_error_code, error_type)
            VALUES (2004, 10, 20, 30, 'owner-error-request', 1, '2026-04-29 12:00:00', 500, 'provider_500', 'provider_error')"#,
        r#"INSERT INTO ai_request_trace
            (id, tenant_id, organization_id, user_id, request_id, status, started_at, http_status, provider_error_code, error_type)
            VALUES (2005, 10, 20, 31, 'other-user-request', 1, '2026-04-29 12:05:00', 500, 'other_provider_500', 'provider_error')"#,
        r#"INSERT INTO ai_model_rank_snapshot
            (id, tenant_id, organization_id, status, rank_no, previous_rank_no, model, vendor_name_snapshot, vendor_code, modality, request_count, cost_amount, snapshot_date, snapshot_period)
            VALUES (2006, 10, 20, 1, 1, 2, 'gpt-4o-mini', 'OpenAI', 'openai', 1, 7, '1.250000', '2026-04-29', 'daily')"#,
        r#"INSERT INTO ops_notification_message
            (id, uuid, tenant_id, organization_id, status, app_id, scope_type, message_code, message_type, title, summary, content, severity, priority, show_as_popup, published_at, expire_at, created_at, updated_at)
            VALUES (2007, 'dashboard-announcement-2007', 10, 20, 1, NULL, 2, 'announcement:2007', 1, 'Planned model upgrade', 'Planned model upgrade', 'Planned model upgrade content', 3, 100, 1, '2026-04-29 08:00:00', '2099-01-01 00:00:00', '2026-04-29 08:00:00', '2026-04-29 08:00:00')"#,
        r#"INSERT INTO ops_notification_recipient
            (id, uuid, tenant_id, organization_id, status, message_id, app_id, recipient_type, recipient_value)
            VALUES (2007, 'dashboard-announcement-recipient-2007', 10, 20, 1, 2007, NULL, 1, 'all')"#,
        "INSERT INTO ops_metric_snapshot (id, tenant_id, organization_id, status, metric_name, metric_value, period_start) VALUES (2008, 10, 20, 1, 'latency_p50_ms', '123.45', '2026-04-29 12:00:00')",
        "INSERT INTO ops_metric_snapshot (id, tenant_id, organization_id, status, metric_name, metric_value, period_start) VALUES (2009, 10, 20, 1, 'latency_p95_ms', '456.78', '2026-04-29 12:00:00')",
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_billing_data(pool: &SqlitePool) {
    for statement in [
        r#"INSERT INTO commerce_coupon_template
            (id, tenant_id, organization_id, template_no, title, discount_type, discount_value, minimum_amount, total_quantity, claimed_quantity, redeemed_quantity, status, starts_at, expires_at, created_at, updated_at)
            VALUES
            ('template-welcome', '10', '20', 'WELCOME', 'Welcome points', 'fixed_amount', '5.00', '0', 100, 0, 0, 'active', '2026-01-01 00:00:00', '2099-01-01 00:00:00', '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
            ('template-welcome-other-user', '10', '20', 'WELCOME-other-user', 'Other user welcome points', 'fixed_amount', '9.00', '0', 100, 1, 0, 'active', '2026-01-01 00:00:00', '2099-01-01 00:00:00', '2026-04-29 08:00:00', '2026-04-29 08:00:00')"#,
        r#"INSERT INTO commerce_account
            (id, tenant_id, organization_id, owner_user_id, asset_type, currency_code, available_amount, frozen_amount, version, status, created_at, updated_at)
            VALUES
            ('owner-points-account', '10', '20', '30', 'points', 'POINT', '100', '0', 0, 'active', '2026-04-01 08:00:00', '2026-04-29 08:00:00'),
            ('owner-token-account', '10', '20', '30', 'token', NULL, '120', '8', 0, 'active', '2026-04-01 08:00:00', '2026-04-29 08:00:00'),
            ('other-points-account', '10', '20', '31', 'points', 'POINT', '900', '0', 0, 'active', '2026-04-01 08:00:00', '2026-04-29 08:00:00'),
            ('other-token-account', '10', '21', '30', 'token', NULL, '999', '0', 0, 'active', '2026-04-01 08:00:00', '2026-04-29 08:00:00')"#,
        r#"INSERT INTO commerce_coupon
            (id, tenant_id, organization_id, template_id, owner_user_id, coupon_code, status, claimed_at, expires_at, redeemed_at, disabled_at, request_no, idempotency_key, created_at, updated_at)
            VALUES ('other-user-coupon', '10', '20', 'template-welcome-other-user', '31', 'WELCOME-other-user', 'active', '2026-04-28 08:00:00', '2099-01-01 00:00:00', NULL, NULL, 'other-user-coupon-claim', 'other-user-coupon-claim', '2026-04-28 08:00:00', '2026-04-28 08:00:00')"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_app_routing_runtime_data(pool: &SqlitePool) {
    for statement in [
        r#"INSERT INTO integration_provider
            (id, tenant_id, organization_id, provider_code, default_vendor_code, display_name, description, base_url, status, sort_order)
            VALUES (4001, 10, 20, 'openai', 'openai', 'Routing OpenAI Provider', 'Owner routing provider', 'https://api.openai.example/v1', 1, 1)"#,
        r#"INSERT INTO integration_provider_account
            (id, tenant_id, organization_id, provider_code, secret_ref, masked_label, upstream_balance_amount, upstream_balance_currency, consecutive_error_count, status)
            VALUES (4002, 10, 20, 'openai', 'vault://providers/openai/main', 'vault-label-openai-main', '42.50', 'USD', 0, 1)"#,
        r#"INSERT INTO integration_channel
            (id, tenant_id, organization_id, provider_id, provider_code, channel_code, name, protocol, access_type, base_url, account_id, capabilities, status, priority, weight, health_status, last_latency_ms, rpm_limit, consecutive_error_count)
            VALUES (4003, 10, 20, 4001, 'openai', 'openai-primary', 'OpenAI Primary', 1, 1, 'https://api.openai.example/v1', 4002, '["llm","vision"]', 1, 1, 100, 1, 321, 600, 0)"#,
        r#"INSERT INTO integration_channel_model
            (id, tenant_id, organization_id, catalog_key, model, channel_id, vendor_code, provider_model, status)
            VALUES (4004, 10, 20, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 4003, 'openai', 'openai/global/gpt-4o-mini', 1)"#,
        r#"INSERT INTO integration_channel
            (id, tenant_id, organization_id, provider_id, provider_code, channel_code, name, protocol, access_type, base_url, account_id, capabilities, status, priority, weight, health_status, last_latency_ms, rpm_limit, consecutive_error_count)
            VALUES (4013, 10, 21, 4001, 'openai', 'other-tenant-channel', 'Other Tenant Channel', 1, 1, 'https://other-tenant.example/v1', 4002, '["llm"]', 1, 1, 100, 1, 111, 100, 0)"#,
        r#"INSERT INTO ai_usage_fact
            (id, tenant_id, organization_id, user_id, api_key_id, request_id, model, status, request_count, total_tokens, customer_charge_amount, cost_amount, modality, occurred_at)
            VALUES (4014, 10, 20, 30, 100, 'owner-runtime-request', 'gpt-4o-mini', 1, 5, 1000, '1.000000', '0.700000', 1, '2026-04-29 13:00:00')"#,
        r#"INSERT INTO ai_usage_fact
            (id, tenant_id, organization_id, user_id, api_key_id, request_id, model, status, request_count, total_tokens, customer_charge_amount, cost_amount, modality, occurred_at)
            VALUES (4015, 10, 20, 31, 101, 'other-user-runtime-request', 'gpt-4o-mini', 1, 77, 7700, '77.000000', '7.000000', 1, '2026-04-29 13:05:00')"#,
        r#"INSERT INTO ai_request_trace
            (id, tenant_id, organization_id, user_id, request_id, trace_id, status, created_at, channel_name_snapshot, requested_model, provider_model, started_at, http_status, provider_error_code, error_type, latency_ms, total_tokens, client_ip_masked, request_path, endpoint, http_method)
            VALUES (4005, 10, 20, 30, 'owner-runtime-request', 'trace-owner-routing', 1, '2026-04-29 13:00:00', 'OpenAI Primary', 'gpt-4o-mini', 'gpt-4o-mini', '2026-04-29 13:00:00', 200, NULL, NULL, 321, 1000, '203.0.113.***', '/v1/chat/completions', '/v1/chat/completions', 'POST')"#,
        r#"INSERT INTO ai_request_trace
            (id, tenant_id, organization_id, user_id, request_id, trace_id, status, created_at, channel_name_snapshot, requested_model, provider_model, started_at, http_status, provider_error_code, error_type, latency_ms, total_tokens, client_ip_masked, request_path, endpoint, http_method)
            VALUES (4006, 10, 20, 31, 'other-user-runtime-request', 'trace-other-routing', 1, '2026-04-29 13:05:00', 'Other User Channel', 'gpt-4o-mini', 'gpt-4o-mini', '2026-04-29 13:05:00', 500, 'other_error', 'provider_error', 999, 7700, '198.51.100.***', '/v1/chat/completions', '/v1/chat/completions', 'POST')"#,
        r#"INSERT INTO ai_routing_decision_log
            (id, tenant_id, organization_id, user_id, request_id, status, created_at, requested_model, resolved_model, selected_channel_id)
            VALUES (4007, 10, 20, 30, 'owner-runtime-request', 1, '2026-04-29 13:00:00', 'gpt-4o-mini', 'gpt-4o-mini', 4003)"#,
        r#"INSERT INTO ai_routing_policy
            (id, uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata, policy_code, name, policy_scope, subject_id, capability, default_profile_id, fallback_mode, currency)
            VALUES (4020, 'owner-routing-policy', 10, 20, 1, 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00', 0, '{}', 'console-routing-default', 'Owner Routing Strategy', 1, 30, 1, 4021, 2, 'USD')"#,
        r#"INSERT INTO ai_routing_profile
            (id, uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata, policy_id, profile_version, profile_name, release_status, traffic_percent, config_hash, published_at, published_by)
            VALUES (4021, 'owner-routing-profile', 10, 20, 1, 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00', 0, '{}', 4020, 1, 'Owner Strategy', 2, '100', 'owner-hash', '2026-04-29 08:00:00', 30)"#,
        r#"INSERT INTO ai_routing_rule
            (id, uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata, profile_id, rule_code, priority, match_expression, target_model)
            VALUES (4022, 'owner-routing-rule', 10, 20, 1, 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00', 0, '{}', 4021, 'model-map-gpt-4', 1, '{"sourceModel":"gpt-4"}', 'azure-gpt4-32k')"#,
        r#"INSERT INTO ai_routing_policy
            (id, uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata, policy_code, name, policy_scope, subject_id, capability, default_profile_id, fallback_mode, currency)
            VALUES (4023, 'other-routing-policy', 10, 21, 1, 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00', 0, '{}', 'console-routing-default', 'Other Tenant Strategy', 1, 30, 1, 4024, 3, 'USD')"#,
        r#"INSERT INTO ai_routing_profile
            (id, uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata, policy_id, profile_version, profile_name, release_status, traffic_percent, config_hash, published_at, published_by)
            VALUES (4024, 'other-routing-profile', 10, 21, 1, 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00', 0, '{}', 4023, 1, 'Other Strategy', 2, '100', 'other-hash', '2026-04-29 08:00:00', 30)"#,
        r#"INSERT INTO ai_routing_rule
            (id, uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata, profile_id, rule_code, priority, match_expression, target_model)
            VALUES (4025, 'other-routing-rule', 10, 21, 1, 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00', 0, '{}', 4024, 'model-map-other', 1, '{"sourceModel":"other-tenant-model"}', 'other-tenant-target')"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_app_providers_runtime_data(pool: &SqlitePool) {
    for statement in [
        r#"INSERT INTO integration_provider
            (id, tenant_id, organization_id, provider_code, default_vendor_code, integration_type, display_name, description, base_url, status, sort_order)
            VALUES (4101, 10, 20, 'openai', 'openai', 1, 'Tenant OpenAI Provider', 'Tenant-owned OpenAI compatible provider', 'https://api.openai.example/v1', 1, 1)"#,
        r#"INSERT INTO integration_provider_account
            (id, tenant_id, organization_id, provider_code, secret_ref, masked_label, upstream_balance_amount, upstream_balance_currency, consecutive_error_count, status)
            VALUES (4102, 10, 20, 'openai', 'vault://providers/openai/main', 'sk-provider-secret', '10.00', 'USD', 0, 1)"#,
        r#"INSERT INTO integration_channel
            (id, tenant_id, organization_id, provider_id, provider_code, channel_code, name, protocol, access_type, base_url, account_id, capabilities, status, priority, weight, health_status, last_latency_ms, rpm_limit, consecutive_error_count)
            VALUES (4103, 10, 20, 4101, 'openai', 'tenant-openai-primary', 'Tenant OpenAI Primary', 1, 1, 'https://tenant-openai.example/v1', 4102, '["llm"]', 1, 1, 100, 1, 111, 600, 0)"#,
        r#"INSERT INTO integration_channel_model
            (id, tenant_id, organization_id, catalog_key, model, channel_id, vendor_code, provider_model, status)
            VALUES (4104, 10, 20, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 4103, 'openai', 'openai/global/gpt-4o-mini', 1)"#,
        r#"INSERT INTO integration_provider
            (id, tenant_id, organization_id, provider_code, default_vendor_code, integration_type, display_name, description, base_url, status, sort_order)
            VALUES (4105, 10, 21, 'anthropic', 'anthropic', 1, 'Other Tenant Provider', 'Other tenant provider', 'https://other-provider.example/v1', 1, 1)"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_app_gateway_traces_runtime_data(pool: &SqlitePool) {
    for statement in [
        r#"INSERT INTO ops_gateway_instance
            (id, tenant_id, organization_id, status, deployment_mode, region, node_name, health_status, last_heartbeat_at)
            VALUES (4301, 10, 20, 1, 3, 'us-east-1', 'gateway-docker-1', 1, '2026-04-29 13:30:00')"#,
        r#"INSERT INTO ai_request_trace
            (id, tenant_id, organization_id, user_id, request_id, trace_id, status, created_at, channel_name_snapshot, requested_model, provider_model, started_at, http_status, provider_error_code, error_type, latency_ms, total_tokens, client_ip_masked, request_path, endpoint, http_method)
            VALUES (4302, 10, 20, 30, 'gateway-owner-request', 'trace-owner-1', 1, '2026-04-29 13:35:00', 'OpenAI Primary', 'gpt-4o-mini', 'gpt-4o-mini', '2026-04-29 13:35:00', 200, NULL, NULL, 210, 777, '203.0.113.***', '/v1/chat/completions', '/v1/chat/completions', 'POST')"#,
        r#"INSERT INTO ai_request_trace
            (id, tenant_id, organization_id, user_id, request_id, trace_id, status, created_at, channel_name_snapshot, requested_model, provider_model, started_at, http_status, provider_error_code, error_type, latency_ms, total_tokens, client_ip_masked, request_path, endpoint, http_method)
            VALUES (4303, 10, 20, 31, 'gateway-other-request', 'trace-other-user', 1, '2026-04-29 13:36:00', 'Other User Channel', 'gpt-4o-mini', 'gpt-4o-mini', '2026-04-29 13:36:00', 500, 'other_error', 'provider_error', 888, 8888, '198.51.100.***', '/v1/chat/completions', '/v1/chat/completions', 'POST')"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_checkout_runtime_data(pool: &SqlitePool) {
    for statement in [
        r#"INSERT INTO commerce_order
            (id, tenant_id, organization_id, owner_user_id, order_no, status, subject, currency_code, request_no, idempotency_key, created_at, paid_at, cancelled_at, expired_at, updated_at)
            VALUES
            ('checkout-owner-order', '10', '20', '30', 'ORDER-OWNER-1', 'paid', 'points_recharge', 'CNY', 'ORDER-OWNER-1', 'TRADE-OWNER-1', '2026-04-29 09:00:00', '2026-04-29 09:05:00', NULL, '2026-04-29 09:30:00', '2026-04-29 09:05:00'),
            ('checkout-other-order', '10', '20', '31', 'ORDER-OTHER-1', 'paid', 'points_recharge', 'CNY', 'ORDER-OTHER-1', 'TRADE-OTHER-1', '2026-04-29 10:00:00', '2026-04-29 10:05:00', NULL, '2026-04-29 10:30:00', '2026-04-29 10:05:00')"#,
        r#"INSERT INTO commerce_payment_intent
            (id, tenant_id, organization_id, owner_user_id, order_id, provider, amount, currency_code, status, request_no, idempotency_key, created_at, updated_at)
            VALUES
            ('checkout-owner-payment-intent', '10', '20', '30', 'checkout-owner-order', 'wechat', '10.00', 'CNY', 'succeeded', 'ORDER-OWNER-1', 'TRADE-OWNER-1', '2026-04-29 09:00:00', '2026-04-29 09:05:00'),
            ('checkout-other-payment-intent', '10', '20', '31', 'checkout-other-order', 'wechat', '99.00', 'CNY', 'succeeded', 'ORDER-OTHER-1', 'TRADE-OTHER-1', '2026-04-29 10:00:00', '2026-04-29 10:05:00')"#,
        r#"INSERT INTO commerce_payment_attempt
            (id, tenant_id, organization_id, owner_user_id, payment_intent_id, order_id, provider, out_trade_no, amount, currency_code, status, callback_payload, created_at, paid_at, updated_at)
            VALUES
            ('checkout-owner-payment-attempt', '10', '20', '30', 'checkout-owner-payment-intent', 'checkout-owner-order', 'wechat', 'TRADE-OWNER-1', '10.00', 'CNY', 'succeeded', '{"points":125}', '2026-04-29 09:00:00', '2026-04-29 09:05:00', '2026-04-29 09:05:00'),
            ('checkout-other-payment-attempt', '10', '20', '31', 'checkout-other-payment-intent', 'checkout-other-order', 'wechat', 'TRADE-OTHER-1', '99.00', 'CNY', 'succeeded', '{"points":999}', '2026-04-29 10:00:00', '2026-04-29 10:05:00', '2026-04-29 10:05:00')"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_recharge_runtime_data(pool: &SqlitePool) {
    for statement in [
        r#"INSERT INTO commerce_product
            (id, tenant_id, organization_id, product_no, title, status, created_at, updated_at)
            VALUES
            ('6301', '10', '20', 'points-recharge-owner', 'Points recharge product', 'active', '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
            ('6302', '10', NULL, 'points-recharge-global', 'Global points recharge product', 'active', '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
            ('6303', '10', '21', 'points-recharge-other-org', 'Other Org Recharge Pack', 'active', '2026-04-29 08:00:00', '2026-04-29 08:00:00')"#,
        r#"INSERT INTO commerce_sku
            (id, tenant_id, organization_id, product_id, sku_no, name, title, price_amount, currency_code, status, created_at, updated_at)
            VALUES
            ('6401', '10', '20', '6301', 'starter-recharge-pack', 'Starter Recharge Pack', 'Starter Recharge Pack', '10.00', 'CNY', 'active', '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
            ('6402', '10', NULL, '6302', 'global-recharge-pack', 'Global Recharge Pack', 'Global Recharge Pack', '20.00', 'CNY', 'active', '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
            ('6403', '10', '21', '6303', 'other-org-recharge-pack', 'Other Org Recharge Pack', 'Other Org Recharge Pack', '30.00', 'CNY', 'active', '2026-04-29 08:00:00', '2026-04-29 08:00:00')"#,
        r#"INSERT INTO commerce_recharge_package
            (id, tenant_id, organization_id, package_no, sku_id, name, price_amount, currency_code, bonus_points, status, valid_from, valid_to, sort_weight, created_at, updated_at)
            VALUES
            ('6101', '10', '20', 'starter-recharge-pack', '6401', 'Starter Recharge Pack', '10.00', 'CNY', 25, 'active', '2026-01-01 00:00:00', '2099-01-01 00:00:00', 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
            ('6102', '10', NULL, 'global-recharge-pack', '6402', 'Global Recharge Pack', '20.00', 'CNY', 50, 'active', '2026-01-01 00:00:00', '2099-01-01 00:00:00', 2, '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
            ('6103', '10', '21', 'other-org-recharge-pack', '6403', 'Other Org Recharge Pack', '30.00', 'CNY', 75, 'active', '2026-01-01 00:00:00', '2099-01-01 00:00:00', 3, '2026-04-29 08:00:00', '2026-04-29 08:00:00')"#,
        r#"INSERT INTO commerce_payment_method
            (id, tenant_id, organization_id, method_key, display_name, provider, status, sort_weight, created_at, updated_at)
            VALUES ('6201', '10', '20', 'wechat', 'Wechat Pay', 'wechat', 'active', 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00')"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_exchange_rule_runtime_data(pool: &SqlitePool) {
    for statement in [r#"INSERT INTO commerce_exchange_rule
            (id, tenant_id, organization_id, rule_no, source_asset_type, target_asset_type, rate, status, remark, request_no, idempotency_key, created_at, updated_at)
            VALUES
            ('exchange-1', '10', '20', 'POINTS_TO_CASH', 'points', 'cash', '120.000000', 'active', 'Owner Exchange Rule', 'exchange-1', 'exchange-1', '2026-04-29 10:00:00', '2026-04-29 10:00:00'),
            ('exchange-other-org', '10', '21', 'POINTS_TO_CASH', 'points', 'cash', '999.000000', 'active', 'Other Org Exchange Rule', 'exchange-other-org', 'exchange-other-org', '2026-04-29 10:00:00', '2026-04-29 10:00:00')"#]
    {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_settings_runtime_data(pool: &SqlitePool) {
    for statement in [
        r#"INSERT INTO iam_user_preference
            (id, uuid, tenant_id, organization_id, user_id, owner_type, owner_id, data_scope, status, created_at, updated_at, version, metadata, language, timezone, notification_preferences)
            VALUES (6201, 'owner-settings-pref', 10, 20, 30, 1, 30, 1, 1, '2026-04-01 08:00:00', '2026-04-29 08:00:00', 0, '{}', 'zh-CN', 'Asia/Shanghai', '{"billReminder":true,"quotaWarning":false,"apiMonitor":true}')"#,
        r#"INSERT INTO iam_user_preference
            (id, uuid, tenant_id, organization_id, user_id, owner_type, owner_id, data_scope, status, created_at, updated_at, version, metadata, language, timezone, notification_preferences)
            VALUES (6202, 'other-settings-pref', 10, 20, 31, 1, 31, 1, 1, '2026-04-01 08:00:00', '2026-04-29 08:00:00', 0, '{}', 'ja-JP', 'Asia/Tokyo', '{"billReminder":false,"quotaWarning":false,"apiMonitor":false}')"#,
        r#"INSERT INTO integration_webhook_endpoint
            (id, uuid, tenant_id, organization_id, user_id, owner_type, owner_id, data_scope, status, created_at, updated_at, version, metadata, endpoint_code, name, target_url, event_types, signing_alg, retry_policy, failure_count)
            VALUES (6203, 'owner-settings-webhook', 10, 20, 30, 1, 30, 1, 1, '2026-04-01 08:00:00', '2026-04-29 08:00:00', 0, '{}', 'console-settings-user-30', 'Owner Settings Webhook', 'https://owner.example.com/hook', '["billing.reminder","api.monitor"]', 'hmac-sha256', '{"maxAttempts":3}', 0)"#,
        r#"INSERT INTO integration_webhook_endpoint
            (id, uuid, tenant_id, organization_id, user_id, owner_type, owner_id, data_scope, status, created_at, updated_at, version, metadata, endpoint_code, name, target_url, event_types, signing_alg, retry_policy, failure_count)
            VALUES (6204, 'other-settings-webhook', 10, 20, 31, 1, 31, 1, 1, '2026-04-01 08:00:00', '2026-04-29 08:00:00', 0, '{}', 'console-settings-user-31', 'Other Settings Webhook', 'https://other.example.com/hook', '[]', 'hmac-sha256', '{"maxAttempts":3}', 0)"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_usage_logs_runtime_data(pool: &SqlitePool) {
    for statement in [
        r#"INSERT INTO ai_usage_fact
            (id, tenant_id, organization_id, user_id, api_key_id, request_id, model, status, request_count, total_tokens, prompt_tokens, cached_tokens, completion_tokens, customer_charge_amount, cost_amount, modality, rate_multiplier, base_input_unit_price, base_output_unit_price, cache_read_unit_price, occurred_at)
            VALUES (6401, 10, 20, 30, 100, 'usage-owner-success', 'gpt-4o-mini', 1, 1, 160, 100, 10, 50, '0.012345', '0.010000', 1, '1.250000', '0.150000', '0.600000', '0.050000', '2026-04-29 10:15:00')"#,
        r#"INSERT INTO ai_request_trace
            (id, tenant_id, organization_id, user_id, request_id, trace_id, status, created_at, api_key_name_snapshot, api_key_group_snapshot, channel_name_snapshot, requested_model, provider_model, started_at, http_status, provider_error_code, error_type, latency_ms, ttft_ms, streaming, prompt_tokens, cached_tokens, completion_tokens, reasoning_effort, total_tokens, client_ip_masked, request_path, endpoint, http_method)
            VALUES (6402, 10, 20, 30, 'usage-owner-success', 'trace-usage-owner-success', 1, '2026-04-29 10:15:00', 'Owner Usage Key', 'standard-group', 'OpenAI Primary', 'gpt-4o-mini', 'gpt-4o-mini', '2026-04-29 10:15:00', 200, NULL, NULL, 345, 120, 1, 90, 5, 45, 'medium', 160, '203.0.113.***', '/v1/chat/completions', '/v1/chat/completions', 'POST')"#,
        r#"INSERT INTO ai_usage_fact
            (id, tenant_id, organization_id, user_id, api_key_id, request_id, model, status, request_count, total_tokens, prompt_tokens, cached_tokens, completion_tokens, customer_charge_amount, cost_amount, modality, rate_multiplier, base_input_unit_price, base_output_unit_price, cache_read_unit_price, occurred_at)
            VALUES (6403, 10, 20, 30, 100, 'usage-owner-error', 'gpt-4o-mini', 1, 1, 25, 20, 0, 5, '0.004000', '0.003000', 1, '1.000000', '0.150000', '0.600000', '0.050000', '2026-04-29 11:15:00')"#,
        r#"INSERT INTO ai_request_trace
            (id, tenant_id, organization_id, user_id, request_id, trace_id, status, created_at, api_key_name_snapshot, api_key_group_snapshot, channel_name_snapshot, requested_model, provider_model, started_at, http_status, provider_error_code, error_type, latency_ms, ttft_ms, streaming, prompt_tokens, cached_tokens, completion_tokens, reasoning_effort, total_tokens, client_ip_masked, request_path, endpoint, http_method)
            VALUES (6404, 10, 20, 30, 'usage-owner-error', 'trace-usage-owner-error', 1, '2026-04-29 11:15:00', 'Owner Usage Key', 'standard-group', 'OpenAI Primary', 'gpt-4o-mini', 'gpt-4o-mini', '2026-04-29 11:15:00', 502, 'upstream_502', 'provider_error', 987, 0, 0, 20, 0, 5, 'provider_error', 25, '203.0.113.***', '/v1/chat/completions', '/v1/chat/completions', 'POST')"#,
        r#"INSERT INTO ai_usage_fact
            (id, tenant_id, organization_id, user_id, api_key_id, request_id, model, status, request_count, total_tokens, prompt_tokens, cached_tokens, completion_tokens, customer_charge_amount, cost_amount, modality, rate_multiplier, base_input_unit_price, base_output_unit_price, cache_read_unit_price, occurred_at)
            VALUES (6405, 10, 20, 31, 101, 'other-user-usage-request', 'gpt-4o-mini', 1, 1, 999, 900, 0, 99, '9.999999', '8.000000', 1, '2.000000', '0.150000', '0.600000', '0.050000', '2026-04-29 10:30:00')"#,
        r#"INSERT INTO ai_request_trace
            (id, tenant_id, organization_id, user_id, request_id, trace_id, status, created_at, api_key_name_snapshot, api_key_group_snapshot, channel_name_snapshot, requested_model, provider_model, started_at, http_status, provider_error_code, error_type, latency_ms, ttft_ms, streaming, prompt_tokens, cached_tokens, completion_tokens, reasoning_effort, total_tokens, client_ip_masked, request_path, endpoint, http_method)
            VALUES (6406, 10, 20, 31, 'other-user-usage-request', 'trace-other-user-usage', 1, '2026-04-29 10:30:00', 'Other Usage Key', 'standard-group', 'Other User Channel', 'gpt-4o-mini', 'gpt-4o-mini', '2026-04-29 10:30:00', 200, NULL, NULL, 111, 22, 1, 900, 0, 99, 'high', 999, '203.0.113.42', '/v1/chat/completions', '/v1/chat/completions', 'POST')"#,
        r#"INSERT INTO ai_routing_decision_log
            (id, tenant_id, organization_id, user_id, request_id, status, created_at, requested_model, resolved_model, selected_channel_id)
            VALUES (6407, 10, 20, 30, 'usage-owner-success', 1, '2026-04-29 10:15:00', 'gpt-4o-mini', 'gpt-4o-mini', 4003)"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}
