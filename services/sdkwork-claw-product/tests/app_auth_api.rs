use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_config::AppSessionConfig;
use sdkwork_claw_http::verify_app_session_token;
use sdkwork_claw_product::application::Pbkdf2Sha256PasswordHasher;
use sdkwork_claw_product::infrastructure::sql::sqlite::{
    SqliteAppAuthStore, SqliteAppSessionEventStore,
};
use sdkwork_claw_product::ports::{
    AdminAuthSettings, AdminAuthSettingsFuture, AdminAuthSettingsStore, GetAdminAuthSettingsQuery,
    GetAdminAuthSettingsScopeQuery, RequiredConfiguredVerificationCodeSender,
    UpdateAdminAuthSettingsCommand, VerificationCodeDeliveryFuture,
    VerificationCodeDeliveryReceipt, VerificationCodeDeliveryRequest, VerificationCodeSender,
};
use serde_json::json;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::{Row, SqlitePool};
use std::sync::Arc;
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};
use tower::ServiceExt;

const APP_AUTH_SESSION_PATH: &str = "/app/v3/api/auth/sessions";
const APP_SESSION_SECRET: &str = "app-auth-session-secret-0123456789";

#[tokio::test]
async fn app_auth_sessions_create_issues_dual_token_context_for_active_iam_user_and_records_standard_events(
) {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    let router = app_auth_router(pool.clone());

    let response = router
        .clone()
        .oneshot(login_request("alice@example.com", "correct-password"))
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert!(payload["data"]["authToken"].as_str().unwrap().len() > 32);
    assert!(payload["data"]["accessToken"].as_str().unwrap().len() > 32);
    assert_ne!(payload["data"]["authToken"], payload["data"]["accessToken"]);
    assert!(payload["data"]["refreshToken"].as_str().unwrap().len() > 32);
    assert_eq!("30", payload["data"]["user"]["id"]);
    assert_eq!("alice", payload["data"]["user"]["username"]);
    assert_eq!("alice@example.com", payload["data"]["user"]["email"]);
    assert_eq!("Alice Router", payload["data"]["user"]["displayName"]);
    assert_eq!(
        "https://cdn.example.com/avatar.png",
        payload["data"]["user"]["avatarUrl"]
    );
    assert_eq!("active", payload["data"]["user"]["status"]);
    assert_eq!("sdkwork-claw-router", payload["data"]["context"]["appId"]);
    assert_eq!("password", payload["data"]["context"]["authLevel"]);
    assert_eq!("local", payload["data"]["context"]["deploymentMode"]);
    assert_eq!("dev", payload["data"]["context"]["environment"]);
    assert_eq!("10", payload["data"]["context"]["tenantId"]);
    assert_eq!("20", payload["data"]["context"]["organizationId"]);
    assert_eq!("30", payload["data"]["context"]["userId"]);
    assert_eq!(
        payload["data"]["sessionId"],
        payload["data"]["context"]["sessionId"]
    );
    assert_eq!("tenant:10", payload["data"]["context"]["dataScope"][0]);
    assert!(payload["data"]["user"].get("password").is_none());

    let auth_token = payload["data"]["authToken"].as_str().unwrap();
    let access_token = payload["data"]["accessToken"].as_str().unwrap();
    for token in [auth_token, access_token] {
        let subject =
            verify_app_session_token(&app_session_config(), token, current_unix_seconds())
                .expect("login response must issue valid IAM session tokens");
        assert_eq!(10, subject.tenant_id);
        assert_eq!(20, subject.organization_id);
        assert_eq!(30, subject.user_id);
    }

    let session = sqlx::query(
        r#"
        SELECT tenant_id, organization_id, user_id, app_id, environment, deployment_mode, auth_level, auth_token_hash, access_token_hash, refresh_token_hash, sharding_key, sharding_strategy, data_scope_json, permission_scope_json
        FROM iam_session
        WHERE user_id = 30
        LIMIT 1
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("10", session.get::<String, _>("tenant_id"));
    assert_eq!(
        Some("20".to_owned()),
        session.get::<Option<String>, _>("organization_id")
    );
    assert_eq!("30", session.get::<String, _>("user_id"));
    assert_eq!("sdkwork-claw-router", session.get::<String, _>("app_id"));
    assert_eq!("dev", session.get::<String, _>("environment"));
    assert_eq!("local", session.get::<String, _>("deployment_mode"));
    assert_eq!("password", session.get::<String, _>("auth_level"));
    assert_eq!(64, session.get::<String, _>("auth_token_hash").len());
    assert_eq!(64, session.get::<String, _>("access_token_hash").len());
    assert_eq!(
        64,
        session
            .get::<Option<String>, _>("refresh_token_hash")
            .unwrap()
            .len()
    );
    assert_eq!("10", session.get::<String, _>("sharding_key"));
    assert_eq!("tenant", session.get::<String, _>("sharding_strategy"));
    assert!(session
        .get::<String, _>("data_scope_json")
        .contains("tenant:10"));
    assert!(session
        .get::<String, _>("permission_scope_json")
        .contains("clawrouter:console"));
    assert!(!session
        .get::<String, _>("auth_token_hash")
        .contains(auth_token));
    assert!(!session
        .get::<String, _>("access_token_hash")
        .contains(access_token));

    let security_event_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM iam_security_event WHERE tenant_id = '10' AND user_id = '30' AND event_type = 'sessions.create'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1, security_event_count);

    let audit_request_id: String = sqlx::query_scalar(
        "SELECT request_id FROM iam_audit_event WHERE actor_user_id = '30' AND action = 'sessions.create'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("login-request-1", audit_request_id);
}

#[tokio::test]
async fn app_auth_sessions_create_rejects_bad_password_without_disclosing_account_state() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    let router = app_auth_router(pool.clone());

    let response = router
        .oneshot(login_request("alice", "wrong-password"))
        .await
        .unwrap();

    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
    let payload = response_json(response).await;
    assert_eq!("4010", payload["code"]);
    assert_eq!("Invalid account or password", payload["msg"]);

    let event_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM iam_session WHERE user_id = '30'")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(0, event_count);
}

#[tokio::test]
async fn app_auth_sessions_create_rejects_disabled_iam_user() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(
        &pool,
        31,
        "disabled",
        "disabled@example.com",
        "Disabled User",
        0,
    )
    .await;
    let router = app_auth_router(pool);

    let response = router
        .oneshot(login_request("disabled@example.com", "correct-password"))
        .await
        .unwrap();

    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
    let payload = response_json(response).await;
    assert_eq!("4010", payload["code"]);
    assert_eq!("Invalid account or password", payload["msg"]);
}

#[tokio::test]
async fn app_auth_login_legacy_path_is_not_exposed() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    let router = app_auth_router(pool);

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/auth/login")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"username":"alice","password":"correct-password"}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::NOT_FOUND, response.status());
}

#[tokio::test]
async fn app_auth_qr_login_codes_create_and_retrieve_use_standard_iam_resource_paths() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    let router = app_auth_router_with_settings(pool, qr_login_settings());

    let create_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/auth/qr_login_codes")
                .header("content-type", "application/json")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_response.status());
    let create_payload = response_json(create_response).await;
    assert_eq!("2000", create_payload["code"]);
    let qr_key = create_payload["data"]["qrKey"].as_str().unwrap();
    assert!(!qr_key.is_empty());
    assert_eq!("Desktop QR Login", create_payload["data"]["title"]);
    assert_eq!("app", create_payload["data"]["type"]);
    assert!(create_payload["data"]["qrContent"]
        .as_str()
        .unwrap()
        .contains(qr_key));
    assert!(create_payload["data"]["expireTime"].as_i64().unwrap() > current_unix_seconds());

    let retrieve_response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri(format!("/app/v3/api/auth/qr_login_codes/{qr_key}"))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, retrieve_response.status());
    let retrieve_payload = response_json(retrieve_response).await;
    assert_eq!("2000", retrieve_payload["code"]);
    assert_eq!("pending", retrieve_payload["data"]["status"]);
}

#[tokio::test]
async fn app_auth_verification_codes_create_allows_immediate_resend_for_same_target() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    let router = app_auth_router_with_settings(pool, email_code_login_settings());

    let first_response = router
        .clone()
        .oneshot(verification_code_request("alice@example.com"))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, first_response.status());
    let first_payload = response_json(first_response).await;
    let first_code_id = first_payload["data"]["codeId"].as_str().unwrap();
    let first_debug_code = first_payload["data"]["debugCode"].as_str().unwrap();
    let first_expires_at = first_payload["data"]["expiresAt"].as_str().unwrap();
    assert!(!first_code_id.is_empty());
    assert_eq!("666666", first_debug_code);
    assert!(first_expires_at.ends_with('Z'));
    assert!(first_expires_at.contains('T'));

    let second_response = router
        .oneshot(verification_code_request("alice@example.com"))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, second_response.status());
    let second_payload = response_json(second_response).await;
    let second_code_id = second_payload["data"]["codeId"].as_str().unwrap();
    let second_debug_code = second_payload["data"]["debugCode"].as_str().unwrap();
    assert!(!second_code_id.is_empty());
    assert_ne!(first_code_id, second_code_id);
    assert_eq!("666666", second_debug_code);
}

#[tokio::test]
async fn app_auth_verification_codes_create_dispatches_code_without_exposing_debug_code_in_production(
) {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    let sender = Arc::new(RecordingVerificationCodeSender::default());
    let router = app_auth_router_with_sender_and_settings(
        pool,
        sender.clone(),
        false,
        email_code_login_settings(),
    );

    let response = router
        .oneshot(verification_code_request("alice@example.com"))
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert!(payload["data"]["codeId"].as_str().unwrap().len() > 12);
    assert!(payload["data"]["expiresAt"]
        .as_str()
        .unwrap()
        .ends_with('Z'));
    assert!(payload["data"].get("debugCode").is_none());

    let deliveries = sender.deliveries();
    assert_eq!(1, deliveries.len());
    let delivery = &deliveries[0];
    assert_eq!("alice@example.com", delivery.target);
    assert_eq!("LOGIN", delivery.scene);
    assert_eq!("EMAIL", delivery.channel);
    assert_eq!(6, delivery.code.len());
    assert!(delivery
        .code
        .chars()
        .all(|character| character.is_ascii_digit()));
    assert_eq!(
        payload["data"]["codeId"].as_str().unwrap(),
        delivery.code_id
    );
}

#[tokio::test]
async fn app_auth_password_reset_requests_dispatch_reset_code_without_exposing_debug_code_in_production(
) {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    let sender = Arc::new(RecordingVerificationCodeSender::default());
    let router = app_auth_router_with_sender(pool, sender.clone(), false);

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/auth/password_reset_requests")
                .header("content-type", "application/json")
                .body(Body::from(
                    json!({
                        "account": "alice@example.com",
                        "channel": "EMAIL"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert!(payload["data"]["requestId"].as_str().unwrap().len() > 12);
    assert!(payload["data"]["expiresAt"]
        .as_str()
        .unwrap()
        .ends_with('Z'));
    assert!(payload["data"].get("debugCode").is_none());

    let deliveries = sender.deliveries();
    assert_eq!(1, deliveries.len());
    let delivery = &deliveries[0];
    assert_eq!("alice@example.com", delivery.target);
    assert_eq!("RESET_PASSWORD", delivery.scene);
    assert_eq!("EMAIL", delivery.channel);
    assert_eq!(6, delivery.code.len());
    assert!(delivery
        .code
        .chars()
        .all(|character| character.is_ascii_digit()));
    assert_eq!(
        payload["data"]["requestId"].as_str().unwrap(),
        delivery.code_id
    );
}

#[tokio::test]
async fn app_auth_verification_codes_create_fails_closed_when_production_sender_is_not_configured()
{
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    let router = app_auth_router_with_sender_and_settings(
        pool,
        Arc::new(RequiredConfiguredVerificationCodeSender),
        false,
        email_code_login_settings(),
    );

    let response = router
        .oneshot(verification_code_request("alice@example.com"))
        .await
        .unwrap();

    assert_eq!(StatusCode::INTERNAL_SERVER_ERROR, response.status());
    let payload = response_json(response).await;
    assert_eq!("5000", payload["code"]);
    assert!(payload["msg"]
        .as_str()
        .unwrap()
        .contains("verification code delivery provider is not configured"));
    assert!(!payload.to_string().contains("debugCode"));
}

#[tokio::test]
async fn app_auth_registrations_create_requires_verification_code() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    let router =
        app_auth_router_with_settings(pool.clone(), email_registration_verification_settings());

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/auth/registrations")
                .header("content-type", "application/json")
                .body(Body::from(
                    json!({
                        "channel": "EMAIL",
                        "email": "missing-code@example.com",
                        "username": "missing-code",
                        "password": "new-user-password",
                        "confirmPassword": "new-user-password"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = response_json(response).await;
    assert_eq!("4001", payload["code"]);
    assert_eq!("verificationCode must not be empty", payload["msg"]);

    let created_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM iam_user WHERE username = 'missing-code'")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(0, created_count);
}

fn app_auth_router(pool: SqlitePool) -> axum::Router {
    sdkwork_claw_product::api::app_auth_router_with_store(
        Arc::new(SqliteAppAuthStore::new(pool.clone())),
        Arc::new(SqliteAppSessionEventStore::new(pool)),
        Arc::new(sdkwork_claw_product::infrastructure::OsApiKeySecretGenerator),
        app_session_config(),
        Arc::new(Pbkdf2Sha256PasswordHasher),
    )
}

fn app_auth_router_with_sender(
    pool: SqlitePool,
    sender: Arc<dyn VerificationCodeSender + Send + Sync>,
    expose_debug_code: bool,
) -> axum::Router {
    sdkwork_claw_product::api::app_auth_router_with_store_and_verification_sender(
        Arc::new(SqliteAppAuthStore::new(pool.clone())),
        Arc::new(SqliteAppSessionEventStore::new(pool)),
        Arc::new(sdkwork_claw_product::infrastructure::OsApiKeySecretGenerator),
        app_session_config(),
        Arc::new(Pbkdf2Sha256PasswordHasher),
        sender,
        expose_debug_code,
    )
}

fn app_auth_router_with_settings(pool: SqlitePool, settings: AdminAuthSettings) -> axum::Router {
    app_auth_router_with_sender_and_settings(
        pool,
        Arc::new(sdkwork_claw_product::ports::DebugVerificationCodeSender),
        true,
        settings,
    )
}

fn app_auth_router_with_sender_and_settings(
    pool: SqlitePool,
    sender: Arc<dyn VerificationCodeSender + Send + Sync>,
    expose_debug_code: bool,
    settings: AdminAuthSettings,
) -> axum::Router {
    sdkwork_claw_product::api::app_auth_router_with_store_auth_settings_store_and_verification_sender(
        Arc::new(SqliteAppAuthStore::new(pool.clone())),
        Some(Arc::new(TestAdminAuthSettingsStore::new(settings))),
        Arc::new(SqliteAppSessionEventStore::new(pool)),
        Arc::new(sdkwork_claw_product::infrastructure::OsApiKeySecretGenerator),
        app_session_config(),
        Arc::new(Pbkdf2Sha256PasswordHasher),
        sender,
        expose_debug_code,
    )
}

#[derive(Debug)]
struct TestAdminAuthSettingsStore {
    settings: AdminAuthSettings,
}

impl TestAdminAuthSettingsStore {
    fn new(settings: AdminAuthSettings) -> Self {
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

fn qr_login_settings() -> AdminAuthSettings {
    let mut settings = AdminAuthSettings::default();
    settings.qr_login_enabled = true;
    settings
}

fn email_code_login_settings() -> AdminAuthSettings {
    let mut settings = AdminAuthSettings::default();
    settings.verification_policy.email_code_login_enabled = true;
    settings
}

fn email_registration_verification_settings() -> AdminAuthSettings {
    let mut settings = AdminAuthSettings::default();
    settings
        .verification_policy
        .email_registration_verification_required = true;
    settings
}

#[derive(Default)]
struct RecordingVerificationCodeSender {
    deliveries: Mutex<Vec<VerificationCodeDeliveryRequest>>,
}

impl RecordingVerificationCodeSender {
    fn deliveries(&self) -> Vec<VerificationCodeDeliveryRequest> {
        self.deliveries.lock().unwrap().clone()
    }
}

impl VerificationCodeSender for RecordingVerificationCodeSender {
    fn send_verification_code<'a>(
        &'a self,
        request: VerificationCodeDeliveryRequest,
    ) -> VerificationCodeDeliveryFuture<'a, VerificationCodeDeliveryReceipt> {
        Box::pin(async move {
            let code_id = request.code_id.clone();
            self.deliveries.lock().unwrap().push(request);
            Ok(VerificationCodeDeliveryReceipt {
                provider_code: "test-provider".to_owned(),
                channel: "test-channel".to_owned(),
                message_id: format!("message-{code_id}"),
                delivered_at: "2026-05-14T00:00:00Z".to_owned(),
            })
        })
    }
}

fn verification_code_request(target: &str) -> Request<Body> {
    Request::builder()
        .method("POST")
        .uri("/app/v3/api/auth/verification_codes")
        .header("content-type", "application/json")
        .body(Body::from(
            json!({
                "target": target,
                "scene": "LOGIN",
                "verifyType": "EMAIL"
            })
            .to_string(),
        ))
        .unwrap()
}

fn login_request(username: &str, password: &str) -> Request<Body> {
    Request::builder()
        .method("POST")
        .uri(APP_AUTH_SESSION_PATH)
        .header("content-type", "application/json")
        .header("X-Request-Id", "login-request-1")
        .body(Body::from(
            json!({
                "grantType": "password",
                "username": username,
                "password": password
            })
            .to_string(),
        ))
        .unwrap()
}

fn app_session_config() -> AppSessionConfig {
    AppSessionConfig::from_signing_secret(APP_SESSION_SECRET).unwrap()
}

async fn create_pool() -> SqlitePool {
    SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap()
}

async fn create_minimal_auth_schema(pool: &SqlitePool) {
    sqlx::query(
        r#"
        CREATE TABLE iam_tenant (
            id TEXT PRIMARY KEY,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE iam_organization (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            parent_id TEXT,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            path TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE iam_user (
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
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE iam_organization_member (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            role_code TEXT,
            status TEXT NOT NULL,
            joined_at TEXT NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE iam_credential (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            credential_type TEXT NOT NULL,
            credential_hash TEXT NOT NULL,
            status TEXT NOT NULL,
            expires_at TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE iam_user_identity (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            provider TEXT NOT NULL,
            subject TEXT NOT NULL,
            email TEXT,
            created_at TEXT NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE iam_session (
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
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE iam_security_event (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            user_id TEXT,
            session_id TEXT,
            event_type TEXT NOT NULL,
            severity TEXT NOT NULL,
            detail_json TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE iam_audit_event (
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
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
}

async fn seed_user(
    pool: &SqlitePool,
    user_id: i64,
    username: &str,
    email: &str,
    nickname: &str,
    status: i64,
) {
    sqlx::query(
        r#"
        INSERT OR IGNORE INTO iam_tenant
            (id, code, name, status, created_at, updated_at)
        VALUES
            ('10', 'default', 'Default Tenant', 'active', '2026-05-01T00:00:00Z', '2026-05-01T00:00:00Z')
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        INSERT OR IGNORE INTO iam_organization
            (id, tenant_id, parent_id, code, name, path, status, created_at, updated_at)
        VALUES
            ('20', '10', NULL, 'root', 'Root Organization', '/20', 'active', '2026-05-01T00:00:00Z', '2026-05-01T00:00:00Z')
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    let password_hash = Pbkdf2Sha256PasswordHasher::hash_password_with_salt(
        "correct-password",
        b"app-auth-test-salt-000000000001",
        2_000,
    )
    .expect("test password must hash");
    sqlx::query(
        r#"
        INSERT INTO iam_user
            (id, tenant_id, username, display_name, email, phone, avatar_url, status, created_at, updated_at)
        VALUES
            (?, '10', ?, ?, ?, '+15550000030', 'https://cdn.example.com/avatar.png', ?, '2026-05-01T00:00:00Z', '2026-05-01T00:00:00Z')
        "#,
    )
    .bind(user_id.to_string())
    .bind(username)
    .bind(nickname)
    .bind(email)
    .bind(if status == 1 { "active" } else { "disabled" })
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO iam_organization_member
            (id, tenant_id, organization_id, user_id, role_code, status, joined_at)
        VALUES
            (?, '10', '20', ?, 'owner', 'active', '2026-05-01T00:00:00Z')
        "#,
    )
    .bind(format!("member-{user_id}"))
    .bind(user_id.to_string())
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO iam_credential
            (id, tenant_id, user_id, credential_type, credential_hash, status, created_at, updated_at)
        VALUES
            (?, '10', ?, 'password', ?, ?, '2026-05-01T00:00:00Z', '2026-05-01T00:00:00Z')
        "#,
    )
    .bind(format!("credential-{user_id}"))
    .bind(user_id.to_string())
    .bind(password_hash)
    .bind(if status == 1 { "active" } else { "disabled" })
    .execute(pool)
    .await
    .unwrap();
}

async fn response_json(response: axum::response::Response) -> serde_json::Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

fn current_unix_seconds() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0)
}
