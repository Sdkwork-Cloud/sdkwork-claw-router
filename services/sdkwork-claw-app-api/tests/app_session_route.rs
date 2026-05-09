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
    AppSessionEventStore, AppSessionEventStoreFuture, RecordAppSessionIssuedEventCommand,
};
use tower::ServiceExt;

const APP_SESSION_PATH: &str = "/app/v3/api/auth/session";
const TRUSTED_SUBJECT_SECRET: &str = "trusted-subject-secret-0123456789";
const APP_SESSION_SECRET: &str = "app-session-secret-0123456789abcd";

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

#[tokio::test]
async fn app_session_exchange_issues_session_from_signed_subject_and_audits_event() {
    let event_store = Arc::new(TestAppSessionEventStore::default());
    let router = sdkwork_claw_app_api::router_with_app_session_event_store_and_config(
        event_store.clone(),
        trusted_subject_config(),
        app_session_config(),
    );

    let response = router
        .oneshot(
            signed_subject_headers(
                Request::builder().method("POST").uri(APP_SESSION_PATH),
                10,
                20,
                30,
            )
            .header("X-Request-Id", "session-request-1")
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
    assert_eq!("Bearer", payload["data"]["tokenType"]);
    let token = payload["data"]["token"].as_str().unwrap();
    let subject =
        verify_app_session_token(&app_session_config(), token, current_unix_seconds()).unwrap();
    assert_eq!(10, subject.tenant_id);
    assert_eq!(20, subject.organization_id);
    assert_eq!(30, subject.user_id);

    let events = event_store.events();
    assert_eq!(1, events.len());
    assert_eq!(10, events[0].tenant_id);
    assert_eq!(20, events[0].organization_id);
    assert_eq!(30, events[0].user_id);
    assert_eq!(Some("session-request-1".to_owned()), events[0].request_id);
    assert_eq!(64, events[0].session_id_hash.len());
    assert!(!events[0].session_id_hash.contains(token));
    assert!(!body_text.contains("x-sdkwork-subject-signature"));
}

#[tokio::test]
async fn app_session_exchange_rejects_direct_trusted_subject_headers() {
    let response = sdkwork_claw_app_api::router_with_app_session_event_store_and_config(
        Arc::new(TestAppSessionEventStore::default()),
        trusted_subject_config(),
        app_session_config(),
    )
    .oneshot(
        Request::builder()
            .method("POST")
            .uri(APP_SESSION_PATH)
            .header("x-sdkwork-tenant-id", "999")
            .header("x-sdkwork-organization-id", "999")
            .header("x-sdkwork-user-id", "999")
            .body(Body::empty())
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
    assert!(body_text.contains("x-sdkwork-tenant-id header is required"));
    assert!(!body_text.contains("999"));
}

fn current_unix_seconds() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0)
}
