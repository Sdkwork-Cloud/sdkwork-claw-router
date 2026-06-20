use std::str::FromStr;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_config::DatabaseConfig;
use sdkwork_claw_test_support::{
    api_key_security_config, app_session_config, app_session_dual_token_headers,
    trusted_request_subject, trusted_subject_config,
};
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};
use tower::ServiceExt;

static DB_SEQUENCE: AtomicU64 = AtomicU64::new(0);

#[tokio::test]
async fn database_config_admin_app_route_manages_market_state_without_runtime_aliases() {
    let database_url = unique_sqlite_url();
    let router = sdkwork_claw_admin::router_with_database_and_api_key_config(
        DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap(),
        Some(api_key_security_config().unwrap()),
        Some(trusted_subject_config().unwrap()),
        Some(app_session_config().unwrap()),
    )
    .await
    .unwrap();

    let unauthenticated_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/platform/apps/list")
                .header("content-type", "application/json")
                .body(Body::from("{}"))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, unauthenticated_response.status());

    let create_payload = request_json(
        router.clone(),
        app_session_request(
            "POST",
            "/backend/v3/api/platform/apps",
            Body::from(
                r#"{"name":"Admin API Integrated App","status":"INACTIVE","marketStatus":"DRAFT","version":"1.0.0","config":{"standard":{"appKey":"admin-api-integrated-app"}},"platforms":{"platforms":["web"]},"installPlatforms":{"platforms":["web"]},"releaseNotes":[{"version":"1.0.0","notes":["Initial admin API route coverage"]}]}"#,
            ),
        ),
    )
    .await;
    assert_eq!("2000", create_payload["code"]);
    assert_eq!(
        "Admin API Integrated App",
        create_payload["data"]["item"]["name"]
    );
    assert_eq!("INACTIVE", create_payload["data"]["item"]["status"]);
    assert_eq!("DRAFT", create_payload["data"]["item"]["marketStatus"]);
    assert_eq!(
        "admin-api-integrated-app",
        create_payload["data"]["item"]["appKey"]
    );
    let app_id = create_payload["data"]["item"]["id"]
        .as_str()
        .unwrap()
        .parse::<i64>()
        .unwrap();
    let app_id_text = app_id.to_string();

    let publish_payload = request_json(
        router.clone(),
        app_session_request(
            "POST",
            &format!("/backend/v3/api/platform/apps/{app_id}/publish"),
            Body::from("{}"),
        ),
    )
    .await;
    assert_eq!("2000", publish_payload["code"]);
    assert_eq!("INACTIVE", publish_payload["data"]["item"]["status"]);
    assert_eq!("PUBLISHED", publish_payload["data"]["item"]["marketStatus"]);
    assert_eq!(
        "PUBLISHED",
        publish_payload["data"]["item"]["config"]["portal"]["marketStatus"]
    );

    let list_payload = request_json(
        router.clone(),
        app_session_request(
            "POST",
            "/backend/v3/api/platform/apps/list",
            Body::from(
                r#"{"keyword":"Integrated","status":"INACTIVE","marketStatus":"PUBLISHED"}"#,
            ),
        ),
    )
    .await;
    let items = list_payload["data"]["items"].as_array().unwrap();
    assert!(items
        .iter()
        .any(|item| item["id"].as_str() == Some(app_id_text.as_str())));

    let pool = connect_sqlite_for_test(&database_url).await;
    let stored_status: i64 = sqlx::query_scalar("SELECT status FROM platform_app WHERE id = ?")
        .bind(app_id)
        .fetch_one(&pool)
        .await
        .unwrap();
    let stored_market_status: String = sqlx::query_scalar(
        "SELECT json_extract(config, '$.portal.marketStatus') FROM platform_app WHERE id = ?",
    )
    .bind(app_id)
    .fetch_one(&pool)
    .await
    .unwrap();
    let audit_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM ops_audit_log WHERE target_id = ? AND action IN ('create_app', 'publish_app')",
    )
    .bind(app_id)
    .fetch_one(&pool)
    .await
    .unwrap();
    pool.close().await;

    assert_eq!(0, stored_status);
    assert_eq!("PUBLISHED", stored_market_status);
    assert_eq!(2, audit_count);
}

async fn request_json(router: axum::Router, request: Request<Body>) -> serde_json::Value {
    let response = router.oneshot(request).await.unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

fn app_session_request(method: &str, path: &str, body: Body) -> Request<Body> {
    let issued_at = current_unix_seconds();
    let expires_at = issued_at + 3600;
    let (authorization, access_token) =
        app_session_dual_token_headers(trusted_request_subject(10, 20, 1), issued_at, expires_at)
            .unwrap();
    Request::builder()
        .method(method)
        .uri(path)
        .header("content-type", "application/json")
        .header("authorization", authorization)
        .header("Access-Token", access_token)
        .body(body)
        .unwrap()
}

fn current_unix_seconds() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0)
}

fn unique_sqlite_url() -> String {
    let nonce = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos();
    let sequence = DB_SEQUENCE.fetch_add(1, Ordering::Relaxed);
    let process_id = std::process::id();
    let mut path = sqlite_test_database_dir();
    std::fs::create_dir_all(&path).unwrap();
    path.push(format!(
        "admin-app-route-{process_id}-{nonce}-{sequence}.db"
    ));
    format!("sqlite://{}", path.to_string_lossy().replace('\\', "/"))
}

fn sqlite_test_database_dir() -> std::path::PathBuf {
    std::env::var_os("CARGO_TARGET_DIR")
        .map(std::path::PathBuf::from)
        .unwrap_or_else(std::env::temp_dir)
        .join("test-dbs")
}

async fn connect_sqlite_for_test(database_url: &str) -> sqlx::SqlitePool {
    let options = SqliteConnectOptions::from_str(database_url)
        .unwrap()
        .create_if_missing(true);
    SqlitePoolOptions::new()
        .max_connections(1)
        .connect_with(options)
        .await
        .unwrap()
}
