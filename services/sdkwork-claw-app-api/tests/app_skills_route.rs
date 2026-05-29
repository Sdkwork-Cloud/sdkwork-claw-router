use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_config::DatabaseConfig;
use sdkwork_claw_test_support::{
    api_key_security_config, app_session_config, app_session_dual_token_headers,
    payment_webhook_config, trusted_request_subject, trusted_subject_config,
};
use tower::ServiceExt;

static DB_SEQUENCE: AtomicU64 = AtomicU64::new(0);

#[tokio::test]
async fn database_config_app_skills_routes_read_installed_seed_through_session_boundary() {
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
            .uri("/app/v3/api/ecosystem/skills?q=prompt&page=1&page_size=10")
            .body(Body::empty())
            .unwrap(),
    )
    .await;
    assert_eq!("2000", public_list_payload["code"]);
    assert!(public_list_payload["data"]["items"]
        .as_array()
        .unwrap()
        .iter()
        .any(|item| item["id"] == "8101"));

    let public_categories_payload = request_json(
        router.clone(),
        Request::builder()
            .method("GET")
            .uri("/app/v3/api/ecosystem/skills/categories")
            .body(Body::empty())
            .unwrap(),
    )
    .await;
    assert_eq!("2000", public_categories_payload["code"]);
    assert!(public_categories_payload["data"]["items"]
        .as_array()
        .unwrap()
        .iter()
        .any(|category| category == "SDKWork Official"));

    let public_detail_payload = request_json(
        router.clone(),
        Request::builder()
            .method("GET")
            .uri("/app/v3/api/ecosystem/skills/8101")
            .body(Body::empty())
            .unwrap(),
    )
    .await;
    assert_eq!("2000", public_detail_payload["code"]);
    assert_eq!("8101", public_detail_payload["data"]["id"]);

    let public_my_payload = request_json(
        router.clone(),
        Request::builder()
            .method("GET")
            .uri("/app/v3/api/ecosystem/skills/mine")
            .body(Body::empty())
            .unwrap(),
    )
    .await;
    assert_eq!("2000", public_my_payload["code"]);
    assert!(public_my_payload["data"]["items"]
        .as_array()
        .unwrap()
        .is_empty());

    let unauthenticated_enable_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/ecosystem/skills/prompt-optimizer/enable")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"config":{"strictness":"precise"}}"#))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_ne!(
        StatusCode::UNAUTHORIZED,
        unauthenticated_enable_response.status()
    );
    assert_eq!(
        StatusCode::FORBIDDEN,
        unauthenticated_enable_response.status()
    );

    let list_payload = request_json(
        router.clone(),
        app_session_request(
            "GET",
            "/app/v3/api/ecosystem/skills?q=prompt&page=1&page_size=10",
            Body::empty(),
        ),
    )
    .await;
    assert_eq!("2000", list_payload["code"]);
    let items = list_payload["data"]["items"].as_array().unwrap();
    let prompt_optimizer = items
        .iter()
        .find(|item| item["id"] == "8101")
        .unwrap_or_else(|| {
            panic!(
                "installed published Prompt Optimizer skill must be visible in skills hub; payload={}",
                list_payload
            )
        });
    assert_eq!("Prompt Optimizer", prompt_optimizer["name"]);
    assert_eq!("SDKWork", prompt_optimizer["developer"]);
    assert_eq!("SDKWork Official", prompt_optimizer["category"]);
    assert_eq!("SDKWork Commercial", prompt_optimizer["license"]);
    assert!(prompt_optimizer["screenshots"]
        .as_array()
        .unwrap()
        .iter()
        .any(|value| value
            .as_str()
            .is_some_and(|url| url.ends_with("/skills/prompt-optimizer/screenshot-1.png"))));
    assert!(
        prompt_optimizer["packages"]
            .as_array()
            .unwrap()
            .iter()
            .any(|package| package["artifactRef"]
                == "builtin://sdkwork.skills.prompt_optimizer@1.0.0")
    );

    let detail_payload = request_json(
        router.clone(),
        app_session_request("GET", "/app/v3/api/ecosystem/skills/8101", Body::empty()),
    )
    .await;
    assert_eq!("2000", detail_payload["code"]);
    assert_eq!("8101", detail_payload["data"]["id"]);
    assert_eq!("Prompt Optimizer", detail_payload["data"]["name"]);

    let categories_payload = request_json(
        router.clone(),
        app_session_request(
            "GET",
            "/app/v3/api/ecosystem/skills/categories",
            Body::empty(),
        ),
    )
    .await;
    assert_eq!("2000", categories_payload["code"]);
    assert!(categories_payload["data"]["items"]
        .as_array()
        .unwrap()
        .iter()
        .any(|category| category == "SDKWork Official"));

    let enabled_payload = request_json(
        router.clone(),
        app_session_request(
            "POST",
            "/app/v3/api/ecosystem/skills/prompt-optimizer/enable",
            Body::from(r#"{"config":{"strictness":"precise"}}"#),
        ),
    )
    .await;
    assert_eq!("2000", enabled_payload["code"]);
    assert_eq!("8101", enabled_payload["data"]["item"]["skillId"]);
    assert_eq!(
        "Prompt Optimizer",
        enabled_payload["data"]["item"]["skill"]["name"]
    );
    assert_eq!(
        "precise",
        enabled_payload["data"]["item"]["config"]["strictness"]
    );

    let installed_payload = request_json(
        router,
        app_session_request("GET", "/app/v3/api/ecosystem/skills/mine", Body::empty()),
    )
    .await;
    assert_eq!("2000", installed_payload["code"]);
    assert!(installed_payload["data"]["items"]
        .as_array()
        .unwrap()
        .iter()
        .any(|item| item["skillId"] == "8101"
            && item["enabled"] == true
            && item["skill"]["name"] == "Prompt Optimizer"));
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

fn app_session_request(method: &str, path: &str, body: Body) -> Request<Body> {
    let issued_at = current_unix_seconds();
    let expires_at = issued_at + 3600;
    let (authorization, access_token) = app_session_dual_token_headers(
        trusted_request_subject(
            skills_tenant_id(),
            skills_organization_id(),
            skills_user_id(),
        ),
        issued_at,
        expires_at,
    )
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

fn skills_tenant_id() -> i64 {
    20_001
}

fn skills_organization_id() -> i64 {
    20
}

fn skills_user_id() -> i64 {
    9001
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
        "app-skills-route-{process_id}-{nonce}-{sequence}.db"
    ));
    format!("sqlite://{}", path.to_string_lossy().replace('\\', "/"))
}

fn sqlite_test_database_dir() -> std::path::PathBuf {
    std::env::var_os("CARGO_TARGET_DIR")
        .map(std::path::PathBuf::from)
        .unwrap_or_else(std::env::temp_dir)
        .join("test-dbs")
}
