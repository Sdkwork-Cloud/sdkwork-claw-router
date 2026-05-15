use std::str::FromStr;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_config::DatabaseConfig;
use sdkwork_claw_test_support::{
    api_key_security_config, app_session_config, app_session_dual_token_headers,
    payment_webhook_config, trusted_request_subject, trusted_subject_config,
};
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};
use tower::ServiceExt;

static DB_SEQUENCE: AtomicU64 = AtomicU64::new(0);

#[tokio::test]
async fn database_config_app_store_route_reads_installed_published_apps_through_session_boundary() {
    let database_url = unique_sqlite_url();
    let router =
        sdkwork_claw_app_api::router_with_database_config_api_key_trusted_subject_and_app_session_config(
            DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap(),
            api_key_security_config().unwrap(),
            trusted_subject_config().unwrap(),
            app_session_config().unwrap(),
            payment_webhook_config().unwrap(),
        )
        .await
        .unwrap();

    let public_list_payload = request_json(
        router.clone(),
        Request::builder()
            .method("GET")
            .uri("/app/v3/api/platform/apps/store?q=sdkwork-claw-router&page=1&page_size=10")
            .body(Body::empty())
            .unwrap(),
    )
    .await;
    assert_eq!("2000", public_list_payload["code"]);
    assert!(public_list_payload["data"]["items"]
        .as_array()
        .unwrap()
        .iter()
        .any(|item| item["id"] == "sdkwork-claw-router"));

    let public_categories_payload = request_json(
        router.clone(),
        Request::builder()
            .method("GET")
            .uri("/app/v3/api/platform/apps/store/categories")
            .body(Body::empty())
            .unwrap(),
    )
    .await;
    assert_eq!("2000", public_categories_payload["code"]);
    assert!(public_categories_payload["data"]["items"]
        .as_array()
        .unwrap()
        .iter()
        .any(|category| category == "HTML"));

    let public_detail_payload = request_json(
        router.clone(),
        Request::builder()
            .method("GET")
            .uri("/app/v3/api/platform/apps/store/sdkwork-claw-router")
            .body(Body::empty())
            .unwrap(),
    )
    .await;
    assert_eq!("2000", public_detail_payload["code"]);
    assert_eq!("sdkwork-claw-router", public_detail_payload["data"]["id"]);

    let list_payload = request_json(
        router.clone(),
        app_session_request(
            "GET",
            "/app/v3/api/platform/apps/store?q=sdkwork-claw-router&page=1&page_size=10",
            Body::empty(),
            app_store_tenant_id(),
            user_organization_id(),
            30,
        ),
    )
    .await;
    assert_eq!("2000", list_payload["code"]);
    let items = list_payload["data"]["items"].as_array().unwrap();
    let item = items
        .iter()
        .find(|item| item["id"] == "sdkwork-claw-router")
        .unwrap_or_else(|| {
            panic!(
                "installed published sdkwork-claw-router app must be visible in app store; payload={}",
                list_payload
            )
        });
    assert_eq!("SDKWork Claw Router", item["name"]);
    assert_eq!("sdkwork-skills-app", item["developer"]);
    assert_eq!(
        "https://cdn.sdkwork.com/apps/sdkwork-claw-router/assets/icon-1024.png",
        item["image"]
    );
    assert!(item["features"].as_array().unwrap().len() >= 3);
    assert!(item["screenshots"].as_array().unwrap().iter().any(|value| {
        value
            .as_str()
            .is_some_and(|url| url.ends_with("/media/desktop_windows-screenshot.png"))
    }));

    let detail_payload = request_json(
        router.clone(),
        app_session_request(
            "GET",
            "/app/v3/api/platform/apps/store/sdkwork-claw-router",
            Body::empty(),
            app_store_tenant_id(),
            user_organization_id(),
            30,
        ),
    )
    .await;
    assert_eq!("2000", detail_payload["code"]);
    assert_eq!("sdkwork-claw-router", detail_payload["data"]["id"]);
    assert!(detail_payload["data"]["releases"]
        .as_array()
        .unwrap()
        .iter()
        .any(|release| release["downloadUrl"]
            == "https://cdn.sdkwork.com/apps/sdkwork-claw-router/STABLE/0.1.0/web.zip"
            && release["platformType"] == "Web"
            && release["version"] == "0.1.0"));

    let categories_payload = request_json(
        router,
        app_session_request(
            "GET",
            "/app/v3/api/platform/apps/store/categories",
            Body::empty(),
            app_store_tenant_id(),
            user_organization_id(),
            30,
        ),
    )
    .await;
    assert_eq!("2000", categories_payload["code"]);
    assert!(categories_payload["data"]["items"]
        .as_array()
        .unwrap()
        .iter()
        .any(|category| category == "HTML"));

    let pool = connect_sqlite_for_test(&database_url).await;
    let invisible_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_app
        WHERE tenant_id = ?
          AND organization_id = ?
          AND (
              COALESCE(status, 1) = 0
              OR COALESCE(
                  NULLIF(json_extract(config, '$.portal.marketStatus'), ''),
                  NULLIF(json_extract(config, '$.marketStatus'), ''),
                  'DRAFT'
              ) <> 'PUBLISHED'
          )
        "#,
    )
    .bind(app_store_tenant_id())
    .bind(app_store_organization_id())
    .fetch_one(&pool)
    .await
    .unwrap();
    pool.close().await;
    assert!(
        invisible_count >= 1,
        "seed must include non-public states so app store route proves active and published filtering"
    );
}

async fn request_json(router: axum::Router, request: Request<Body>) -> serde_json::Value {
    let response = router.oneshot(request).await.unwrap();
    let status = response.status();
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    assert_eq!(
        StatusCode::OK,
        status,
        "unexpected response body: {}",
        String::from_utf8_lossy(&body)
    );
    serde_json::from_slice(&body).unwrap()
}

fn app_session_request(
    method: &str,
    path: &str,
    body: Body,
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
) -> Request<Body> {
    let issued_at = current_unix_seconds();
    let expires_at = issued_at + 3600;
    let (authorization, access_token) = app_session_dual_token_headers(
        trusted_request_subject(tenant_id, organization_id, user_id),
        issued_at,
        expires_at,
    )
    .unwrap();
    Request::builder()
        .method(method)
        .uri(path)
        .header("content-type", "application/json")
        .header("authorization", authorization)
        .header("Sdkwork-Access-Token", access_token)
        .body(body)
        .unwrap()
}

fn app_store_tenant_id() -> i64 {
    20_001
}

fn app_store_organization_id() -> i64 {
    0
}

fn user_organization_id() -> i64 {
    20
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
    let path = format!("target/test-dbs/app-store-route-{process_id}-{nonce}-{sequence}.db");
    std::fs::create_dir_all("target/test-dbs").unwrap();
    format!("sqlite://{path}")
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
