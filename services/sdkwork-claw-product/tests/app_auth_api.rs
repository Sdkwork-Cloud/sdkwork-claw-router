use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_config::AppSessionConfig;
use sdkwork_claw_http::verify_app_session_token;
use sdkwork_claw_product::application::Pbkdf2Sha256PasswordHasher;
use sdkwork_claw_product::infrastructure::sql::sqlite::{
    SqliteAppAuthStore, SqliteAppSessionEventStore,
};
use serde_json::json;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::{Row, SqlitePool};
use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};
use tower::ServiceExt;

const APP_AUTH_LOGIN_PATH: &str = "/app/v3/api/auth/login";
const APP_SESSION_SECRET: &str = "app-auth-session-secret-0123456789";

#[tokio::test]
async fn app_auth_login_issues_session_for_active_plus_user_and_records_event() {
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
    assert_eq!("Bearer", payload["data"]["tokenType"]);
    assert_eq!(30, payload["data"]["user"]["id"]);
    assert_eq!("alice", payload["data"]["user"]["username"]);
    assert_eq!("alice@example.com", payload["data"]["user"]["email"]);
    assert_eq!("Alice Router", payload["data"]["user"]["name"]);
    assert!(payload["data"]["token"].as_str().unwrap().len() > 32);
    assert!(payload["data"]["expiresInSeconds"].as_i64().unwrap() > 0);
    assert!(payload["data"]["user"].get("password").is_none());

    let token = payload["data"]["token"].as_str().unwrap();
    let subject = verify_app_session_token(&app_session_config(), token, current_unix_seconds())
        .expect("login response must issue a valid app session token");
    assert_eq!(10, subject.tenant_id);
    assert_eq!(20, subject.organization_id);
    assert_eq!(30, subject.user_id);

    let event = sqlx::query(
        r#"
        SELECT tenant_id, organization_id, user_id, request_id, auth_provider, login_result, session_id_hash
        FROM iam_user_login_event
        WHERE user_id = 30
        LIMIT 1
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(10_i64, event.get::<i64, _>("tenant_id"));
    assert_eq!(20_i64, event.get::<i64, _>("organization_id"));
    assert_eq!(30_i64, event.get::<i64, _>("user_id"));
    assert_eq!(
        Some("login-request-1".to_owned()),
        event.get::<Option<String>, _>("request_id")
    );
    assert_eq!(
        Some("password".to_owned()),
        event.get::<Option<String>, _>("auth_provider")
    );
    assert_eq!(Some(1_i64), event.get::<Option<i64>, _>("login_result"));
    let session_id_hash = event.get::<Option<String>, _>("session_id_hash").unwrap();
    assert_eq!(64, session_id_hash.len());
    assert!(!session_id_hash.contains(token));
}

#[tokio::test]
async fn app_auth_login_rejects_bad_password_without_disclosing_account_state() {
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
        sqlx::query_scalar("SELECT COUNT(1) FROM iam_user_login_event WHERE user_id = 30")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(0, event_count);
}

#[tokio::test]
async fn app_auth_login_rejects_disabled_plus_user() {
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

fn app_auth_router(pool: SqlitePool) -> axum::Router {
    sdkwork_claw_product::api::app_auth_router_with_store(
        Arc::new(SqliteAppAuthStore::new(pool.clone())),
        Arc::new(SqliteAppSessionEventStore::new(pool)),
        Arc::new(sdkwork_claw_product::infrastructure::OsApiKeySecretGenerator),
        app_session_config(),
        Arc::new(Pbkdf2Sha256PasswordHasher),
    )
}

fn login_request(username: &str, password: &str) -> Request<Body> {
    Request::builder()
        .method("POST")
        .uri(APP_AUTH_LOGIN_PATH)
        .header("content-type", "application/json")
        .header("X-Request-Id", "login-request-1")
        .body(Body::from(
            json!({
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
        CREATE TABLE plus_user (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            username TEXT,
            email TEXT,
            nickname TEXT,
            avatar TEXT,
            password TEXT,
            status INTEGER NOT NULL,
            created_at TEXT,
            updated_at TEXT
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE iam_user_login_event (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            user_id INTEGER,
            request_id TEXT,
            auth_method INTEGER,
            auth_provider TEXT,
            login_result INTEGER,
            risk_level INTEGER,
            mfa_verified INTEGER,
            session_id_hash TEXT,
            occurred_at TEXT
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
    let password_hash = Pbkdf2Sha256PasswordHasher::hash_password_with_salt(
        "correct-password",
        b"app-auth-test-salt-000000000001",
        2_000,
    )
    .expect("test password must hash");
    sqlx::query(
        r#"
        INSERT INTO plus_user
            (id, uuid, tenant_id, organization_id, username, email, nickname, avatar, password, status, created_at, updated_at)
        VALUES
            (?, ?, 10, 20, ?, ?, ?, 'https://cdn.example.com/avatar.png', ?, ?, '2026-05-01 00:00:00', '2026-05-01 00:00:00')
        "#,
    )
    .bind(user_id)
    .bind(format!("user-{user_id}"))
    .bind(username)
    .bind(email)
    .bind(nickname)
    .bind(password_hash)
    .bind(status)
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
