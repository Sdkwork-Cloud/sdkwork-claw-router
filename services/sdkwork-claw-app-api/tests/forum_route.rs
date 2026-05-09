use std::str::FromStr;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_config::DatabaseConfig;
use sdkwork_claw_test_support::{
    api_key_security_config, app_session_bearer_token, app_session_config, payment_webhook_config,
    trusted_request_subject, trusted_subject_config,
};
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};
use tower::ServiceExt;

static DB_SEQUENCE: AtomicU64 = AtomicU64::new(0);

#[tokio::test]
async fn database_config_forum_route_persists_plus_feeds_and_comments_contract() {
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

    let unauthenticated_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/feeds/list")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, unauthenticated_response.status());

    let feed_payload = request_json(
        router.clone(),
        app_session_request(
            "POST",
            "/app/v3/api/feeds",
            json_body(
                r#"{
                    "title": "Provider fallback patterns",
                    "content": "How should Claw Router handle model provider failover?",
                    "categoryId": 1001,
                    "images": ["https://cdn.sdkwork.com/forum/failover.png"],
                    "tags": ["routing", "fallback"],
                    "source": "community",
                    "sourceUrl": "https://sdkwork.com/forum/provider-fallback"
                }"#,
            ),
            forum_tenant_id(),
            user_organization_id(),
            forum_user_id(),
        ),
    )
    .await;
    assert_eq!("2000", feed_payload["code"]);
    let feed_id = feed_payload["data"]["id"]
        .as_str()
        .expect("feed id must be returned")
        .to_owned();
    assert_eq!("Provider fallback patterns", feed_payload["data"]["title"]);
    assert_eq!("feeds", feed_payload["data"]["contentType"]);
    assert_eq!(0, feed_payload["data"]["viewCount"]);

    let list_payload = request_json(
        router.clone(),
        app_session_request(
            "GET",
            "/app/v3/api/feeds/list?keyword=failover&page=1&size=10",
            Body::empty(),
            forum_tenant_id(),
            user_organization_id(),
            forum_user_id(),
        ),
    )
    .await;
    assert_eq!("2000", list_payload["code"]);
    assert!(list_payload["data"]["items"]
        .as_array()
        .unwrap()
        .iter()
        .any(|item| item["id"] == feed_id));

    let detail_payload = request_json(
        router.clone(),
        app_session_request(
            "GET",
            &format!("/app/v3/api/feeds/detail/{feed_id}"),
            Body::empty(),
            forum_tenant_id(),
            user_organization_id(),
            forum_user_id(),
        ),
    )
    .await;
    assert_eq!("2000", detail_payload["code"]);
    assert_eq!(1, detail_payload["data"]["viewCount"]);

    let content_id = feed_id.parse::<i64>().unwrap();
    let comment_payload = request_json(
        router.clone(),
        app_session_request(
            "POST",
            "/app/v3/api/comments",
            json_body(&format!(
                r#"{{
                    "contentType": "feeds",
                    "contentId": {content_id},
                    "content": "Use weighted fallback with explicit health windows.",
                    "deviceInfo": "route-test",
                    "ipAddress": "127.0.0.1"
                }}"#
            )),
            forum_tenant_id(),
            user_organization_id(),
            forum_user_id(),
        ),
    )
    .await;
    assert_eq!("2000", comment_payload["code"]);
    let comment_id = comment_payload["data"]["commentId"]
        .as_str()
        .unwrap()
        .to_owned();
    assert_eq!("FEEDS", comment_payload["data"]["contentType"]);
    assert_eq!("PUBLISHED", comment_payload["data"]["status"]);

    let reply_payload = request_json(
        router.clone(),
        app_session_request(
            "POST",
            &format!("/app/v3/api/comments/{comment_id}/reply"),
            json_body(&format!(
                r#"{{
                    "contentType": "feeds",
                    "contentId": {content_id},
                    "content": "Expose the retry reason in trace logs.",
                    "deviceInfo": "route-test",
                    "ipAddress": "127.0.0.1"
                }}"#
            )),
            forum_tenant_id(),
            user_organization_id(),
            forum_user_id(),
        ),
    )
    .await;
    assert_eq!("2000", reply_payload["code"]);
    assert_eq!(
        comment_id.parse::<i64>().unwrap(),
        reply_payload["data"]["parentId"]
    );

    let comments_payload = request_json(
        router.clone(),
        app_session_request(
            "GET",
            &format!("/app/v3/api/comments/list?contentType=feeds&contentId={content_id}"),
            Body::empty(),
            forum_tenant_id(),
            user_organization_id(),
            forum_user_id(),
        ),
    )
    .await;
    assert_eq!("2000", comments_payload["code"]);
    assert_eq!(1, comments_payload["data"]["totalElements"]);
    assert_eq!(1, comments_payload["data"]["items"][0]["replyCount"]);

    let replies_payload = request_json(
        router,
        app_session_request(
            "GET",
            &format!("/app/v3/api/comments/{comment_id}/replies"),
            Body::empty(),
            forum_tenant_id(),
            user_organization_id(),
            forum_user_id(),
        ),
    )
    .await;
    assert_eq!("2000", replies_payload["code"]);
    assert_eq!(1, replies_payload["data"]["totalElements"]);

    let pool = connect_sqlite_for_test(&database_url).await;
    let feed_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM plus_feeds WHERE id = ? AND content_type = 5 AND status = 2",
    )
    .bind(content_id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1, feed_count);
    let comment_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM plus_comments WHERE content_id = ? AND content_type = 5 AND status = 1",
    )
    .bind(content_id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(2, comment_count);
    pool.close().await;
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

fn json_body(value: &str) -> Body {
    Body::from(value.to_owned())
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
    let authorization = app_session_bearer_token(
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
        .body(body)
        .unwrap()
}

fn forum_tenant_id() -> i64 {
    20_001
}

fn user_organization_id() -> i64 {
    20
}

fn forum_user_id() -> i64 {
    30
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
    let path = format!("target/test-dbs/forum-route-{process_id}-{nonce}-{sequence}.db");
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
