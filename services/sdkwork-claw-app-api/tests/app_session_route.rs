use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_config::{AppSessionConfig, TrustedSubjectConfig};
use sdkwork_claw_http::{
    sign_trusted_request_subject, verify_app_session_token, TrustedRequestSubject,
};
use sdkwork_claw_product::domain::DomainError;
use sdkwork_claw_product::ports::{
    AdminAuthSettings, AdminAuthSettingsFuture, AdminAuthSettingsStore, AppSessionEventStore,
    AppSessionEventStoreFuture, GetAdminAuthSettingsQuery, GetAdminAuthSettingsScopeQuery,
    RecordAppSessionIssuedEventCommand, UpdateAdminAuthSettingsCommand,
};
use tower::ServiceExt;

const APP_SESSION_PATH: &str = "/app/v3/api/auth/sessions";
const TRUSTED_SUBJECT_SECRET: &str = "trusted-subject-secret-0123456789";
const APP_SESSION_SECRET: &str = "app-session-secret-0123456789abcd";
const INTERNAL_TENANT_HEADER: &str = concat!("x-sdkwork-", "tenant-id");
const INTERNAL_ORGANIZATION_HEADER: &str = concat!("x-sdkwork-", "organization-id");
const INTERNAL_USER_HEADER: &str = concat!("x-sdkwork-", "user-id");

fn trusted_subject_config() -> TrustedSubjectConfig {
    TrustedSubjectConfig::from_signing_secret(TRUSTED_SUBJECT_SECRET).unwrap()
}

fn app_session_config() -> AppSessionConfig {
    AppSessionConfig::from_signing_secret(APP_SESSION_SECRET).unwrap()
}

fn signed_subject_headers(
    builder: axum::http::request::Builder,
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
) -> axum::http::request::Builder {
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0);
    let subject = TrustedRequestSubject {
        tenant_id,
        organization_id,
        user_id,
        operator_id: user_id,
        operator_type: 1,
    };
    let signature = sign_trusted_request_subject(
        &trusted_subject_config(),
        subject,
        timestamp,
        "POST",
        APP_SESSION_PATH,
    );
    builder
        .header("x-sdkwork-subject-tenant-id", tenant_id.to_string())
        .header(
            "x-sdkwork-subject-organization-id",
            organization_id.to_string(),
        )
        .header("x-sdkwork-subject-user-id", user_id.to_string())
        .header("x-sdkwork-subject-timestamp", timestamp.to_string())
        .header("x-sdkwork-subject-signature", signature)
}

#[derive(Debug, Default)]
struct TestAppSessionEventStore {
    events: Mutex<Vec<RecordAppSessionIssuedEventCommand>>,
}

impl TestAppSessionEventStore {
    fn events(&self) -> Vec<RecordAppSessionIssuedEventCommand> {
        self.events.lock().unwrap().clone()
    }
}

impl AppSessionEventStore for TestAppSessionEventStore {
    fn record_app_session_issued<'a>(
        &'a self,
        command: RecordAppSessionIssuedEventCommand,
    ) -> AppSessionEventStoreFuture<'a, ()> {
        Box::pin(async move {
            self.events
                .lock()
                .map_err(|_| DomainError::new("test app session event lock poisoned"))?
                .push(command);
            Ok(())
        })
    }
}

#[derive(Debug)]
struct TestAdminAuthSettingsStore {
    settings: AdminAuthSettings,
}

impl TestAdminAuthSettingsStore {
    fn with_session_bridge_enabled() -> Self {
        let mut settings = AdminAuthSettings::default();
        settings.login_methods.push("sessionBridge".to_owned());
        Self {
            settings: settings.normalized(),
        }
    }
}

impl AdminAuthSettingsStore for TestAdminAuthSettingsStore {
    fn get_auth_settings<'a>(
        &'a self,
        _query: GetAdminAuthSettingsQuery,
    ) -> AdminAuthSettingsFuture<'a, AdminAuthSettings> {
        Box::pin(async move { Ok(self.settings.clone()) })
    }

    fn get_auth_settings_for_scope<'a>(
        &'a self,
        _query: GetAdminAuthSettingsScopeQuery,
    ) -> AdminAuthSettingsFuture<'a, AdminAuthSettings> {
        Box::pin(async move { Ok(self.settings.clone()) })
    }

    fn update_auth_settings<'a>(
        &'a self,
        command: UpdateAdminAuthSettingsCommand,
    ) -> AdminAuthSettingsFuture<'a, AdminAuthSettings> {
        Box::pin(async move { Ok(command.settings.normalized()) })
    }
}

fn session_bridge_router(event_store: Arc<TestAppSessionEventStore>) -> axum::Router {
    sdkwork_claw_app_api::router_with_app_session_event_store_auth_settings_store_and_config(
        event_store,
        Arc::new(TestAdminAuthSettingsStore::with_session_bridge_enabled()),
        trusted_subject_config(),
        app_session_config(),
    )
}

#[tokio::test]
async fn app_session_exchange_issues_session_from_signed_subject_and_audits_event() {
    let event_store = Arc::new(TestAppSessionEventStore::default());
    let router = session_bridge_router(event_store.clone());

    let response = router
        .oneshot(
            signed_subject_headers(
                Request::builder().method("POST").uri(APP_SESSION_PATH),
                10,
                20,
                30,
            )
            .header("X-Request-Id", "55555555-5555-4333-8444-555555555555")
            .header("content-type", "application/json")
            .body(Body::from(r#"{"grantType":"session_bridge"}"#))
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
    let auth_token = payload["data"]["authToken"].as_str().unwrap();
    let access_token = payload["data"]["accessToken"].as_str().unwrap();
    assert_ne!(auth_token, access_token);
    assert!(payload["data"]["refreshToken"].as_str().unwrap().len() > 32);
    assert_eq!("sdkwork-claw-router", payload["data"]["context"]["appId"]);
    assert_eq!("system", payload["data"]["context"]["authLevel"]);
    assert_eq!("local", payload["data"]["context"]["deploymentMode"]);
    assert_eq!("dev", payload["data"]["context"]["environment"]);
    assert_eq!("10", payload["data"]["context"]["tenantId"]);
    assert_eq!("20", payload["data"]["context"]["organizationId"]);
    assert_eq!("30", payload["data"]["context"]["userId"]);
    assert_eq!(
        payload["data"]["sessionId"],
        payload["data"]["context"]["sessionId"]
    );
    assert_eq!("30", payload["data"]["user"]["id"]);
    assert_eq!("user-30", payload["data"]["user"]["username"]);
    assert_eq!("SDKWork User 30", payload["data"]["user"]["displayName"]);

    for token in [auth_token, access_token] {
        let subject =
            verify_app_session_token(&app_session_config(), token, current_unix_seconds()).unwrap();
        assert_eq!(10, subject.tenant_id);
        assert_eq!(20, subject.organization_id);
        assert_eq!(30, subject.user_id);
    }

    let events = event_store.events();
    assert_eq!(1, events.len());
    assert_eq!(10, events[0].tenant_id);
    assert_eq!(20, events[0].organization_id);
    assert_eq!(30, events[0].user_id);
    let audit_request_id = events[0].request_id.as_deref();
    assert!(audit_request_id.is_some_and(|value| value.len() == 36));
    assert_ne!(
        Some("55555555-5555-4333-8444-555555555555"),
        audit_request_id,
        "app session audits must use a server-generated request id instead of trusting X-Request-Id"
    );
    assert_eq!(64, events[0].session_id_hash.len());
    assert!(!events[0].session_id_hash.contains(auth_token));
    assert!(!events[0].session_id_hash.contains(access_token));
    assert!(!body_text.contains("x-sdkwork-subject-signature"));
}

#[tokio::test]
async fn app_session_exchange_rejects_direct_trusted_subject_headers() {
    let response = session_bridge_router(Arc::new(TestAppSessionEventStore::default()))
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(APP_SESSION_PATH)
                .header(INTERNAL_TENANT_HEADER, "999")
                .header(INTERNAL_ORGANIZATION_HEADER, "999")
                .header(INTERNAL_USER_HEADER, "999")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"grantType":"session_bridge"}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body_text = String::from_utf8(body.to_vec()).unwrap();
    let payload: serde_json::Value = serde_json::from_str(&body_text).unwrap();

    assert_eq!("4010", payload["code"]);
    assert!(body_text.contains("trusted request subject is required"));
    assert!(!body_text.contains(INTERNAL_TENANT_HEADER));
    assert!(!body_text.contains("999"));
}

#[tokio::test]
async fn app_session_legacy_singular_route_is_not_exposed() {
    let response = sdkwork_claw_app_api::router_with_app_session_event_store_and_config(
        Arc::new(TestAppSessionEventStore::default()),
        trusted_subject_config(),
        app_session_config(),
    )
    .oneshot(
        Request::builder()
            .method("POST")
            .uri("/app/v3/api/auth/session")
            .header("content-type", "application/json")
            .body(Body::from(r#"{"grantType":"session_bridge"}"#))
            .unwrap(),
    )
    .await
    .unwrap();

    assert_eq!(StatusCode::NOT_FOUND, response.status());
}

fn current_unix_seconds() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0)
}
