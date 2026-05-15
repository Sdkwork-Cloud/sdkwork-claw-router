use axum::body::Body;
use axum::extract::State;
use axum::http::{HeaderMap, Request, StatusCode};
use axum::routing::post;
use axum::{Json, Router};
use sdkwork_claw_config::{
    ApiKeySecurityConfig, AppSessionConfig, DatabaseConfig, ProviderSecretMapConfig,
    TrustedSubjectConfig,
};
use sdkwork_claw_http::TrustedRequestSubject;
use sdkwork_claw_test_support::{
    api_key_security_config as test_api_key_security_config,
    app_session_config as test_app_session_config, app_session_dual_token_headers,
    default_trusted_request_subject, seeded_sqlite_catalog, trusted_request_subject,
    trusted_subject_config as test_trusted_subject_config, trusted_subject_signature,
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

static SQLITE_DB_SEQUENCE: AtomicU64 = AtomicU64::new(0);

#[derive(Debug, Default)]
struct CapturedProviderHealthProbe {
    authorization: Option<String>,
    body: Value,
}

#[tokio::test]
async fn database_config_router_uses_sqlite_catalog_for_backend_model_list() {
    let catalog = seeded_sqlite_catalog().await.unwrap();

    let router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        catalog.database_config().unwrap(),
        Some(catalog.api_key_security_config().unwrap()),
        Some(trusted_subject_config()),
        Some(app_session_config()),
    )
    .await
    .unwrap();

    let health = router
        .clone()
        .oneshot(
            Request::builder()
                .uri("/healthz")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, health.status());
    let health_body = axum::body::to_bytes(health.into_body(), usize::MAX)
        .await
        .unwrap();
    let health_body = String::from_utf8(health_body.to_vec()).unwrap();
    let health_payload: serde_json::Value = serde_json::from_str(&health_body).unwrap();

    assert_eq!(true, health_payload["database"]["configured"]);
    assert_eq!("sqlite", health_payload["database"]["engine"]);
    assert_eq!(1, health_payload["database"]["maxConnections"]);
    assert!(!health_body.contains(catalog.database_url()));

    let response = router
        .oneshot(signed_request(
            "GET",
            "/backend/v3/api/ai/models",
            Body::empty(),
        ))
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!("2000", payload["code"]);
    let item = &payload["data"]["items"][0];
    assert!(item["id"].as_str().is_some_and(|value| !value.is_empty()));
    assert!(item["vendorId"]
        .as_str()
        .is_some_and(|value| !value.is_empty()));
    assert_eq!("openai", item["vendorCode"]);
    assert_eq!("gpt-5.5-pro", item["name"]);
    assert_eq!("Chat", item["type"]);
    assert_eq!("15.000000", item["priceIn"]);
    assert_eq!("120.000000", item["priceOut"]);
    assert_eq!("active", item["status"]);
    assert_eq!("0", item["calls"]);
    assert_eq!(1_050_000, item["contextTokens"]);
    assert!(item.get("priceAvailability").is_none());
    let items = payload["data"]["items"].as_array().unwrap();
    assert!(items.iter().any(|item| item["name"] == "claude-opus-4-7"));
}

#[tokio::test]
async fn database_config_router_requires_admin_subject_for_backend_model_management() {
    let catalog = seeded_sqlite_catalog().await.unwrap();

    let router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        catalog.database_config().unwrap(),
        Some(catalog.api_key_security_config().unwrap()),
        Some(trusted_subject_config()),
        Some(app_session_config()),
    )
    .await
    .unwrap();

    let response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/backend/v3/api/ai/models")
                .header("authorization", catalog.gateway_authorization_header())
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!("4010", payload["code"]);

    let response = router
        .oneshot(app_session_request(
            "GET",
            "/backend/v3/api/ai/models",
            Body::empty(),
        ))
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!("2000", payload["code"]);
    assert_eq!("gpt-5.5-pro", payload["data"]["items"][0]["name"]);
    assert_eq!("Chat", payload["data"]["items"][0]["type"]);
    assert!(payload["data"]["items"][0]
        .get("priceAvailability")
        .is_none());
}

#[tokio::test]
async fn database_config_router_serves_signed_subject_model_catalog_commands() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog(&pool).await;
    pool.close().await;

    let router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap(),
        Some(api_key_security_config()),
        Some(trusted_subject_config()),
        Some(app_session_config()),
    )
    .await
    .unwrap();

    let create_vendor_payload = request_json(
        router.clone(),
        app_session_request(
            "POST",
            "/backend/v3/api/ai/model_vendors",
            Body::from(
                r#"{"vendorCode":"acme-ai","name":"Acme AI","status":"active","color":"bg-cyan-700","description":"Acme hosted models"}"#,
            ),
        ),
    )
    .await;
    assert_eq!("2000", create_vendor_payload["code"]);
    assert_eq!(
        "acme_ai",
        create_vendor_payload["data"]["item"]["vendorCode"]
    );
    assert_eq!("Acme AI", create_vendor_payload["data"]["item"]["name"]);
    assert_eq!("active", create_vendor_payload["data"]["item"]["status"]);
    assert_eq!(
        "bg-cyan-700",
        create_vendor_payload["data"]["item"]["color"]
    );
    let vendor_id = create_vendor_payload["data"]["item"]["id"]
        .as_str()
        .unwrap()
        .to_owned();

    let create_model_payload = request_json(
        router.clone(),
        signed_request(
            "POST",
            "/backend/v3/api/ai/models",
            Body::from(format!(
                r#"{{"vendorId":"{vendor_id}","name":"acme-chat-large","type":"Chat","priceIn":"0.120000","priceOut":"0.450000","contextTokens":"128k"}}"#
            )),
        ),
    )
    .await;
    assert_eq!("2000", create_model_payload["code"]);
    assert_eq!(
        "acme-chat-large",
        create_model_payload["data"]["item"]["name"]
    );
    assert_eq!("Chat", create_model_payload["data"]["item"]["type"]);
    assert_eq!("0.120000", create_model_payload["data"]["item"]["priceIn"]);
    assert_eq!("0.450000", create_model_payload["data"]["item"]["priceOut"]);
    assert_eq!(
        128000,
        create_model_payload["data"]["item"]["contextTokens"]
    );

    let vendors_payload = request_json(
        router.clone(),
        signed_request("GET", "/backend/v3/api/ai/model_vendors", Body::empty()),
    )
    .await;
    let vendors = vendors_payload["data"]["items"].as_array().unwrap();
    assert!(vendors.iter().any(|item| item["vendorCode"] == "acme_ai"));

    let sync_payload = request_json(
        router,
        signed_request(
            "POST",
            "/backend/v3/api/ai/models/refresh",
            Body::from(r#"{"source":"local_catalog"}"#),
        ),
    )
    .await;
    assert_eq!("2000", sync_payload["code"]);
    assert_eq!(true, sync_payload["data"]["synced"]);
    assert_eq!("local_catalog", sync_payload["data"]["source"]);
    assert!(sync_payload["data"]["snapshotId"].as_str().is_some());
    assert!(sync_payload["data"]["vendors"]
        .as_array()
        .unwrap()
        .iter()
        .any(|item| item["vendorCode"] == "openai"));
    assert!(sync_payload["data"]["models"]
        .as_array()
        .unwrap()
        .iter()
        .any(|item| item["name"] == "gpt-5.5"));
}

#[tokio::test]
async fn database_config_router_rejects_missing_api_key_pepper_for_runtime_catalog() {
    let catalog = seeded_sqlite_catalog().await.unwrap();

    let error = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        catalog.database_config().unwrap(),
        None,
        Some(trusted_subject_config()),
        Some(app_session_config()),
    )
    .await
    .unwrap_err();

    assert!(error
        .to_string()
        .contains("SDKWORK_CLAW_API_KEY_PEPPER is required"));
}

#[tokio::test]
async fn database_config_router_rejects_missing_trusted_subject_secret_for_runtime_catalog() {
    let catalog = seeded_sqlite_catalog().await.unwrap();

    let error = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        catalog.database_config().unwrap(),
        Some(catalog.api_key_security_config().unwrap()),
        None,
        Some(app_session_config()),
    )
    .await
    .unwrap_err();

    assert!(error
        .to_string()
        .contains("SDKWORK_CLAW_TRUSTED_SUBJECT_SECRET is required"));
}

#[tokio::test]
async fn database_config_router_serves_backend_auth_settings() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog(&pool).await;
    pool.close().await;

    let router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap(),
        Some(api_key_security_config()),
        Some(trusted_subject_config()),
        Some(app_session_config()),
    )
    .await
    .unwrap();

    let default_payload = request_json(
        router.clone(),
        app_session_request("GET", "/backend/v3/api/system/auth/settings", Body::empty()),
    )
    .await;
    assert_eq!("2000", default_payload["code"]);
    assert_eq!("highlights-only", default_payload["data"]["leftRailMode"]);
    assert_eq!(json!(["password"]), default_payload["data"]["loginMethods"]);
    assert_eq!(false, default_payload["data"]["oauthLoginEnabled"]);
    assert_eq!(json!([]), default_payload["data"]["oauthProviders"]);
    assert_eq!(false, default_payload["data"]["qrLoginEnabled"]);
    assert_eq!(
        false,
        default_payload["data"]["verificationPolicy"]["emailRegistrationVerificationRequired"]
    );
    assert_eq!(
        false,
        default_payload["data"]["verificationPolicy"]["phoneRegistrationVerificationRequired"]
    );

    let update_payload = request_json(
        router.clone(),
        app_session_request_builder("PATCH", "/backend/v3/api/system/auth/settings")
            .header("X-Request-Id", "auth-settings-test-1")
            .body(Body::from(
                r#"{"leftRailMode":"auto","loginMethods":["password","emailCode"],"oauthLoginEnabled":false,"oauthProviders":["github"],"oauthRegion":"overseas","qrLoginEnabled":false,"recoveryMethods":["email"],"registerMethods":["email"],"verificationPolicy":{"emailCodeLoginEnabled":true,"emailRegistrationVerificationRequired":true,"phoneCodeLoginEnabled":false,"phoneRegistrationVerificationRequired":false}}"#,
            ))
            .unwrap(),
    )
    .await;
    assert_eq!("2000", update_payload["code"]);
    assert_eq!("auto", update_payload["data"]["leftRailMode"]);
    assert_eq!(false, update_payload["data"]["oauthLoginEnabled"]);
    assert_eq!(false, update_payload["data"]["qrLoginEnabled"]);
    assert_eq!("overseas", update_payload["data"]["oauthRegion"]);
    assert_eq!(
        true,
        update_payload["data"]["verificationPolicy"]["emailRegistrationVerificationRequired"]
    );
    assert_eq!(
        false,
        update_payload["data"]["verificationPolicy"]["phoneRegistrationVerificationRequired"]
    );

    let persisted_payload = request_json(
        router,
        app_session_request("GET", "/backend/v3/api/system/auth/settings", Body::empty()),
    )
    .await;
    assert_eq!("2000", persisted_payload["code"]);
    assert_eq!("auto", persisted_payload["data"]["leftRailMode"]);
    assert_eq!(
        true,
        persisted_payload["data"]["verificationPolicy"]["emailRegistrationVerificationRequired"]
    );

    let pool = create_sqlite_pool(&database_url).await;
    let snapshot_payload: String = sqlx::query_scalar(
        "SELECT config_payload FROM ops_config_snapshot WHERE request_id = 'auth-settings-test-1'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    let snapshot_payload: Value = serde_json::from_str(&snapshot_payload).unwrap();
    assert_eq!("update_auth_settings", snapshot_payload["action"]);
    assert_eq!("github", snapshot_payload["settings"]["oauthProviders"][0]);
    assert_eq!(
        true,
        snapshot_payload["settings"]["verificationPolicy"]["emailRegistrationVerificationRequired"]
    );
    let audit_action: String = sqlx::query_scalar(
        "SELECT action FROM ops_audit_log WHERE request_id = 'auth-settings-test-1'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("update_auth_settings", audit_action);
}

#[tokio::test]
async fn database_config_router_rejects_empty_backend_auth_setting_method_lists() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog(&pool).await;
    pool.close().await;

    let router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap(),
        Some(api_key_security_config()),
        Some(trusted_subject_config()),
        Some(app_session_config()),
    )
    .await
    .unwrap();

    let response = router
        .oneshot(
            app_session_request_builder("PATCH", "/backend/v3/api/system/auth/settings")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"loginMethods":[]}"#))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload: Value = serde_json::from_slice(
        &axum::body::to_bytes(response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("4001", payload["code"]);
    assert!(payload["message"]
        .as_str()
        .unwrap()
        .contains("loginMethods must include at least one item"));
}

#[tokio::test]
async fn database_config_router_normalizes_backend_auth_setting_cross_field_policy() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog(&pool).await;
    pool.close().await;

    let router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap(),
        Some(api_key_security_config()),
        Some(trusted_subject_config()),
        Some(app_session_config()),
    )
    .await
    .unwrap();

    let update_payload = request_json(
        router.clone(),
        app_session_request_builder("PATCH", "/backend/v3/api/system/auth/settings")
            .header("X-Request-Id", "auth-settings-normalize-1")
            .body(Body::from(
                r#"{"leftRailMode":"qr-only","qrLoginEnabled":false,"loginMethods":["password","emailCode"],"verificationPolicy":{"emailCodeLoginEnabled":false,"phoneCodeLoginEnabled":true}}"#,
            ))
            .unwrap(),
    )
    .await;
    assert_eq!("2000", update_payload["code"]);
    assert_eq!("highlights-only", update_payload["data"]["leftRailMode"]);
    assert_eq!(
        json!(["password", "phoneCode"]),
        update_payload["data"]["loginMethods"]
    );
    assert_eq!(
        false,
        update_payload["data"]["verificationPolicy"]["emailCodeLoginEnabled"]
    );
    assert_eq!(
        true,
        update_payload["data"]["verificationPolicy"]["phoneCodeLoginEnabled"]
    );

    let persisted_payload = request_json(
        router,
        app_session_request("GET", "/backend/v3/api/system/auth/settings", Body::empty()),
    )
    .await;
    assert_eq!("2000", persisted_payload["code"]);
    assert_eq!("highlights-only", persisted_payload["data"]["leftRailMode"]);
    assert_eq!(
        json!(["password", "phoneCode"]),
        persisted_payload["data"]["loginMethods"]
    );

    let pool = create_sqlite_pool(&database_url).await;
    let snapshot_payload: String = sqlx::query_scalar(
        "SELECT config_payload FROM ops_config_snapshot WHERE request_id = 'auth-settings-normalize-1'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    let snapshot_payload: Value = serde_json::from_str(&snapshot_payload).unwrap();
    assert_eq!("update_auth_settings", snapshot_payload["action"]);
    assert_eq!(
        "highlights-only",
        snapshot_payload["settings"]["leftRailMode"]
    );
    assert_eq!(
        json!(["password", "phoneCode"]),
        snapshot_payload["settings"]["loginMethods"]
    );
}

#[tokio::test]
async fn database_config_router_serves_signed_subject_announcement_crud() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog(&pool).await;
    pool.close().await;

    let router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap(),
        Some(api_key_security_config()),
        Some(trusted_subject_config()),
        Some(app_session_config()),
    )
    .await
    .unwrap();

    let create_response = router
        .clone()
        .oneshot(app_session_request(
            "POST",
            "/backend/v3/api/content/announcements",
            Body::from(
                r#"{"title":"Gateway maintenance","target":"all","status":"draft","content":"Maintenance window"}"#,
            ),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_response.status());
    let create_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(create_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("2000", create_payload["code"]);
    assert_eq!("draft", create_payload["data"]["item"]["status"]);

    let update_response = router
        .clone()
        .oneshot(signed_request(
            "PATCH",
            "/backend/v3/api/content/announcements/1",
            Body::from(r#"{"status":"published","target":"vip"}"#),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, update_response.status());
    let update_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(update_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("published", update_payload["data"]["item"]["status"]);
    assert_eq!("vip", update_payload["data"]["item"]["target"]);

    let list_response = router
        .clone()
        .oneshot(signed_request(
            "GET",
            "/backend/v3/api/content/announcements",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(list_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!(1, list_payload["data"]["items"].as_array().unwrap().len());

    let delete_response = router
        .clone()
        .oneshot(signed_request(
            "DELETE",
            "/backend/v3/api/content/announcements/1",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, delete_response.status());
    let delete_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(delete_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!(true, delete_payload["data"]["deleted"]);
}

#[tokio::test]
async fn database_config_router_serves_signed_subject_channel_crud() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog(&pool).await;
    pool.close().await;

    let router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap(),
        Some(api_key_security_config()),
        Some(trusted_subject_config()),
        Some(app_session_config()),
    )
    .await
    .unwrap();

    let create_response = router
        .clone()
        .oneshot(app_session_request(
            "POST",
            "/backend/v3/api/channel",
            Body::from(
                r#"{"name":"OpenAI primary","vendor":"OpenAI","protocol":"OpenAI","accessType":"api-key","baseUrl":"https://api.openai.com/v1","secretRef":"vault://providers/openai/account/main","models":["openai/global/gpt-4o-mini"],"capabilities":["llm"],"timeoutMs":60000,"retryPolicy":{"maxAttempts":3,"retryableStatusCodes":[429,503],"backoffMs":25},"weight":80,"status":"active"}"#,
            ),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_response.status());
    let create_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(create_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("2000", create_payload["code"]);
    assert_eq!("OpenAI primary", create_payload["data"]["item"]["name"]);
    assert_eq!("OpenAI", create_payload["data"]["item"]["vendor"]);
    assert_eq!("active", create_payload["data"]["item"]["status"]);
    assert_eq!(60_000, create_payload["data"]["item"]["timeoutMs"]);
    assert_eq!(
        3,
        create_payload["data"]["item"]["retryPolicy"]["maxAttempts"]
    );
    assert_eq!(
        503,
        create_payload["data"]["item"]["retryPolicy"]["retryableStatusCodes"][1]
    );
    assert!(create_payload["data"]["item"].get("authKey").is_none());
    let channel_id = create_payload["data"]["item"]["id"].as_str().unwrap();

    let update_response = router
        .clone()
        .oneshot(signed_request(
            "PUT",
            "/backend/v3/api/channel",
            Body::from(format!(
                r#"{{"id":"{channel_id}","status":"disabled","weight":25,"models":["openai/global/gpt-4o-mini"],"capabilities":["llm","image"],"timeoutMs":120000,"retryPolicy":null}}"#
            )),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, update_response.status());
    let update_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(update_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("disabled", update_payload["data"]["item"]["status"]);
    assert_eq!(25, update_payload["data"]["item"]["weight"]);
    assert_eq!(120_000, update_payload["data"]["item"]["timeoutMs"]);
    assert_eq!("image", update_payload["data"]["item"]["capabilities"][1]);
    assert!(update_payload["data"]["item"].get("retryPolicy").is_none());

    let list_response = router
        .clone()
        .oneshot(signed_request(
            "POST",
            "/backend/v3/api/channel/list",
            Body::from("{}"),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(list_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!(1, list_payload["data"]["items"].as_array().unwrap().len());
    assert_eq!("disabled", list_payload["data"]["items"][0]["status"]);
    assert_eq!(120_000, list_payload["data"]["items"][0]["timeoutMs"]);
    assert!(list_payload["data"]["items"][0]
        .get("retryPolicy")
        .is_none());

    let delete_response = router
        .clone()
        .oneshot(signed_request(
            "DELETE",
            &format!("/backend/v3/api/channel/{channel_id}"),
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, delete_response.status());
    let delete_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(delete_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!(true, delete_payload["data"]["deleted"]);
}

#[tokio::test]
async fn database_config_router_admin_channel_test_runs_real_provider_probe_and_records_health() {
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
    seed_catalog(&pool).await;
    pool.close().await;

    let secret_ref = "vault://providers/openai/account/main";
    let router = configured_router_with_provider_secret_map(
        &database_url,
        ProviderSecretMapConfig::from_json(
            json!({secret_ref: "sk-admin-provider-health-probe-secret"}).to_string(),
        )
        .unwrap(),
    )
    .await;

    let create_payload = request_json(
        router.clone(),
        app_session_request(
            "POST",
            "/backend/v3/api/channel",
            Body::from(format!(
                r#"{{"name":"OpenAI primary","vendor":"OpenAI","protocol":"OpenAI","accessType":"api-key","baseUrl":"http://{addr}","secretRef":"{secret_ref}","models":["openai/global/gpt-4o-mini"],"capabilities":["llm"],"timeoutMs":60000,"weight":80,"status":"active"}}"#
            )),
        ),
    )
    .await;
    assert_eq!("2000", create_payload["code"]);
    let channel_id = create_payload["data"]["item"]["id"].as_str().unwrap();

    let (status, test_payload, body_text) = request_json_with_status(
        router,
        app_session_request_builder(
            "POST",
            &format!("/backend/v3/api/channel/{channel_id}/test"),
        )
        .header("X-Request-Id", "admin-channel-probe-success-1")
        .body(Body::empty())
        .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::OK, status);
    assert_eq!("2000", test_payload["code"]);
    assert_eq!(true, test_payload["data"]["success"]);
    assert_eq!(channel_id, test_payload["data"]["channelId"]);
    assert_eq!("active", test_payload["data"]["status"]);
    let latency = test_payload["data"]["latency"].as_str().unwrap();
    assert!(
        latency.ends_with("ms"),
        "latency must be a measured provider probe duration"
    );
    assert!(!body_text.contains(secret_ref));
    assert!(!body_text.contains("sk-admin-provider-health-probe-secret"));

    let captured = captured.lock().unwrap();
    assert_eq!(1, captured.len());
    assert_eq!(
        Some("Bearer sk-admin-provider-health-probe-secret".to_owned()),
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
          AND request_id = 'admin-channel-probe-success-1'
        "#,
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    assert_eq!(1_i64, row.get::<i64, _>("health_status"));
    assert!(row.get::<i64, _>("latency_ms") > 0);
    assert_eq!(200_i64, row.get::<i64, _>("http_status"));
    assert_eq!(None, row.get::<Option<String>, _>("error_code"));
    assert_eq!(None, row.get::<Option<String>, _>("error_message_masked"));

    let channel_state = sqlx::query(
        "SELECT health_status, last_latency_ms, consecutive_error_count FROM integration_channel WHERE id = ?",
    )
    .bind(channel_id)
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
        r#"
        SELECT a.consecutive_error_count
        FROM integration_provider_account a
        JOIN integration_channel c ON c.account_id = a.id
        WHERE c.id = ?
        "#,
    )
    .bind(channel_id)
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    verification_pool.close().await;
    assert_eq!(0, account_errors);
}

#[tokio::test]
async fn database_config_router_admin_channel_test_records_masked_provider_failure() {
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
                                "message": "bad upstream key sk-admin-provider-health-probe-secret"
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
    seed_catalog(&pool).await;
    pool.close().await;

    let secret_ref = "vault://providers/openai/account/main";
    let router = configured_router_with_provider_secret_map(
        &database_url,
        ProviderSecretMapConfig::from_json(
            json!({secret_ref: "sk-admin-provider-health-probe-secret"}).to_string(),
        )
        .unwrap(),
    )
    .await;

    let create_payload = request_json(
        router.clone(),
        app_session_request(
            "POST",
            "/backend/v3/api/channel",
            Body::from(format!(
                r#"{{"name":"OpenAI primary","vendor":"OpenAI","protocol":"OpenAI","accessType":"api-key","baseUrl":"http://{addr}","secretRef":"{secret_ref}","models":["openai/global/gpt-4o-mini"],"capabilities":["llm"],"timeoutMs":60000,"weight":80,"status":"active"}}"#
            )),
        ),
    )
    .await;
    assert_eq!("2000", create_payload["code"]);
    let channel_id = create_payload["data"]["item"]["id"].as_str().unwrap();

    let verification_pool = create_sqlite_pool(&database_url).await;
    sqlx::query("UPDATE integration_channel SET consecutive_error_count = 4 WHERE id = ?")
        .bind(channel_id)
        .execute(&verification_pool)
        .await
        .unwrap();
    sqlx::query(
        r#"
        UPDATE integration_provider_account
        SET consecutive_error_count = 5
        WHERE id = (SELECT account_id FROM integration_channel WHERE id = ?)
        "#,
    )
    .bind(channel_id)
    .execute(&verification_pool)
    .await
    .unwrap();
    verification_pool.close().await;

    let (status, test_payload, body_text) = request_json_with_status(
        router,
        app_session_request_builder(
            "POST",
            &format!("/backend/v3/api/channel/{channel_id}/test"),
        )
        .header("X-Request-Id", "admin-channel-probe-failure-1")
        .body(Body::empty())
        .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::OK, status);
    assert_eq!("2000", test_payload["code"]);
    assert_eq!(false, test_payload["data"]["success"]);
    assert_eq!(channel_id, test_payload["data"]["channelId"]);
    assert_eq!("error", test_payload["data"]["status"]);
    assert!(test_payload["data"]["latency"]
        .as_str()
        .unwrap()
        .ends_with("ms"));
    assert!(!body_text.contains(secret_ref));
    assert!(!body_text.contains("sk-admin-provider-health-probe-secret"));

    let captured = captured.lock().unwrap();
    assert_eq!(1, captured.len());
    assert_eq!(
        Some("Bearer sk-admin-provider-health-probe-secret".to_owned()),
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
          AND request_id = 'admin-channel-probe-failure-1'
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
    assert!(!error_message.contains("sk-admin-provider-health-probe-secret"));

    let channel_errors: i64 =
        sqlx::query_scalar("SELECT consecutive_error_count FROM integration_channel WHERE id = ?")
            .bind(channel_id)
            .fetch_one(&verification_pool)
            .await
            .unwrap();
    let account_errors: i64 = sqlx::query_scalar(
        r#"
        SELECT a.consecutive_error_count
        FROM integration_provider_account a
        JOIN integration_channel c ON c.account_id = a.id
        WHERE c.id = ?
        "#,
    )
    .bind(channel_id)
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    verification_pool.close().await;
    assert_eq!(5, channel_errors);
    assert_eq!(6, account_errors);
}

#[tokio::test]
async fn database_config_router_serves_signed_subject_provider_secret_crud_without_plaintext() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog(&pool).await;
    pool.close().await;

    let router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap(),
        Some(api_key_security_config()),
        Some(trusted_subject_config()),
        Some(app_session_config()),
    )
    .await
    .unwrap();

    let create_response = router
        .clone()
        .oneshot(app_session_request(
            "POST",
            "/backend/v3/api/provider_secrets",
            Body::from(
                r#"{"providerCode":"OpenAI","name":"OpenAI production","secretRef":"vault://providers/openai/account/main","authType":"api-key"}"#,
            ),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_response.status());
    let create_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(create_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("2000", create_payload["code"]);
    assert_eq!("openai", create_payload["data"]["item"]["providerCode"]);
    assert_eq!("ref:***main", create_payload["data"]["item"]["maskedLabel"]);
    assert!(create_payload["data"]["item"].get("secretHash").is_none());
    assert!(create_payload["data"]["item"].get("secretValue").is_none());
    assert!(create_payload["data"]["item"].get("apiKey").is_none());
    let provider_secret_id = create_payload["data"]["item"]["id"].as_str().unwrap();

    let update_response = router
        .clone()
        .oneshot(signed_request(
            "PUT",
            "/backend/v3/api/provider_secrets",
            Body::from(format!(
                r#"{{"id":"{provider_secret_id}","name":"OpenAI rotated","secretRef":"vault://providers/openai/account/rotated","status":"disabled"}}"#
            )),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, update_response.status());
    let update_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(update_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("OpenAI rotated", update_payload["data"]["item"]["name"]);
    assert_eq!(
        "ref:***rotated",
        update_payload["data"]["item"]["maskedLabel"]
    );
    assert_eq!("disabled", update_payload["data"]["item"]["status"]);

    let list_response = router
        .clone()
        .oneshot(signed_request(
            "POST",
            "/backend/v3/api/provider_secrets/list",
            Body::from(r#"{"providerCode":"openai"}"#),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(list_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!(1, list_payload["data"]["items"].as_array().unwrap().len());
    assert_eq!("disabled", list_payload["data"]["items"][0]["status"]);

    let delete_response = router
        .clone()
        .oneshot(signed_request(
            "DELETE",
            &format!("/backend/v3/api/provider_secrets/{provider_secret_id}"),
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, delete_response.status());
    let delete_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(delete_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!(true, delete_payload["data"]["deleted"]);
}

#[tokio::test]
async fn database_config_router_serves_signed_subject_access_group_crud() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog(&pool).await;
    pool.close().await;
    let expected_create_name = format!("{} enterprise", "\u{4e2d}\u{6587}");

    let router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap(),
        Some(api_key_security_config()),
        Some(trusted_subject_config()),
        Some(app_session_config()),
    )
    .await
    .unwrap();

    let create_response = router
        .clone()
        .oneshot(app_session_request(
            "POST",
            "/backend/v3/api/router/access_groups",
            Body::from(
                r#"{"name":"\u4e2d\u6587 enterprise","platform":"OpenAI","billingType":"standard","rateMultiplier":1.25,"type":"dedicated","capacity":{"total":500},"status":"active"}"#,
            ),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_response.status());
    let create_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(create_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("2000", create_payload["code"]);
    assert_eq!(
        expected_create_name,
        create_payload["data"]["item"]["name"].as_str().unwrap()
    );
    assert_eq!("openai", create_payload["data"]["item"]["platform"]);
    assert_eq!("standard", create_payload["data"]["item"]["billingType"]);
    assert_eq!(1.25, create_payload["data"]["item"]["rateMultiplier"]);
    assert_eq!("dedicated", create_payload["data"]["item"]["type"]);
    assert_eq!(500.0, create_payload["data"]["item"]["capacity"]["total"]);
    assert_eq!("active", create_payload["data"]["item"]["status"]);
    let group_id = create_payload["data"]["item"]["id"].as_str().unwrap();

    let update_response = router
        .clone()
        .oneshot(signed_request(
            "PATCH",
            &format!("/backend/v3/api/router/access_groups/{group_id}"),
            Body::from(
                r#"{"name":"OpenAI dedicated","rateMultiplier":1.5,"capacity":{"total":750},"status":"disabled"}"#,
            ),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, update_response.status());
    let update_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(update_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("OpenAI dedicated", update_payload["data"]["item"]["name"]);
    assert_eq!(1.5, update_payload["data"]["item"]["rateMultiplier"]);
    assert_eq!(750.0, update_payload["data"]["item"]["capacity"]["total"]);
    assert_eq!("disabled", update_payload["data"]["item"]["status"]);

    let list_response = router
        .clone()
        .oneshot(signed_request(
            "GET",
            "/backend/v3/api/router/access_groups",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(list_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!(1, list_payload["data"]["items"].as_array().unwrap().len());
    assert_eq!(
        group_id,
        list_payload["data"]["items"][0]["id"].as_str().unwrap()
    );
    assert_eq!("openai", list_payload["data"]["items"][0]["platform"]);
    assert_eq!("disabled", list_payload["data"]["items"][0]["status"]);

    let delete_response = router
        .clone()
        .oneshot(signed_request(
            "DELETE",
            &format!("/backend/v3/api/router/access_groups/{group_id}"),
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, delete_response.status());
    let delete_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(delete_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!(true, delete_payload["data"]["deleted"]);

    let final_list_response = router
        .oneshot(signed_request(
            "GET",
            "/backend/v3/api/router/access_groups",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, final_list_response.status());
    let final_list_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(final_list_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!(
        0,
        final_list_payload["data"]["items"]
            .as_array()
            .unwrap()
            .len()
    );
}

#[tokio::test]
async fn database_config_router_serves_signed_subject_ip_rate_limit_create_and_list() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog(&pool).await;
    pool.close().await;
    let expected_name = format!("{} crawler guard", "\u{4e2d}\u{6587}");

    let router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap(),
        Some(api_key_security_config()),
        Some(trusted_subject_config()),
        Some(app_session_config()),
    )
    .await
    .unwrap();

    let create_response = router
        .clone()
        .oneshot(app_session_request(
            "POST",
            "/backend/v3/api/router/rate_limits/ip",
            Body::from(
                r#"{"ruleName":"\u4e2d\u6587 crawler guard","targetIp":"10.10.10.9/24","rps":12,"rpm":360,"blockDuration":"15m"}"#,
            ),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_response.status());
    let create_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(create_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("2000", create_payload["code"]);
    assert_eq!(
        expected_name,
        create_payload["data"]["item"]["ruleName"].as_str().unwrap()
    );
    assert_eq!("10.10.10.0/24", create_payload["data"]["item"]["targetIp"]);
    assert_eq!(12, create_payload["data"]["item"]["rps"]);
    assert_eq!(360, create_payload["data"]["item"]["rpm"]);
    assert_eq!("15m", create_payload["data"]["item"]["blockDuration"]);
    assert_eq!("active", create_payload["data"]["item"]["status"]);

    let list_response = router
        .clone()
        .oneshot(signed_request(
            "GET",
            "/backend/v3/api/router/rate_limits/ip",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(list_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!(1, list_payload["data"]["items"].as_array().unwrap().len());
    assert_eq!(
        "10.10.10.0/24",
        list_payload["data"]["items"][0]["targetIp"]
    );

    let update_response = router
        .clone()
        .oneshot(signed_request(
            "POST",
            "/backend/v3/api/router/rate_limits/ip",
            Body::from(
                r#"{"ruleName":"Crawler guard updated","targetIp":"10.10.10.88/24","rps":25,"rpm":600,"blockDuration":"1h","status":"inactive"}"#,
            ),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, update_response.status());
    let update_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(update_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("2000", update_payload["code"]);
    assert_eq!(
        create_payload["data"]["item"]["id"],
        update_payload["data"]["item"]["id"]
    );
    assert_eq!(
        "Crawler guard updated",
        update_payload["data"]["item"]["ruleName"]
    );
    assert_eq!("10.10.10.0/24", update_payload["data"]["item"]["targetIp"]);
    assert_eq!(25, update_payload["data"]["item"]["rps"]);
    assert_eq!(600, update_payload["data"]["item"]["rpm"]);
    assert_eq!("1h", update_payload["data"]["item"]["blockDuration"]);
    assert_eq!("inactive", update_payload["data"]["item"]["status"]);

    let final_list_payload = request_json(
        router,
        signed_request(
            "GET",
            "/backend/v3/api/router/rate_limits/ip",
            Body::empty(),
        ),
    )
    .await;
    assert_eq!(
        1,
        final_list_payload["data"]["items"]
            .as_array()
            .unwrap()
            .len()
    );
    assert_eq!(
        "Crawler guard updated",
        final_list_payload["data"]["items"][0]["ruleName"]
    );
    assert_eq!(25, final_list_payload["data"]["items"][0]["rps"]);
    assert_eq!("inactive", final_list_payload["data"]["items"][0]["status"]);
}

#[tokio::test]
async fn database_config_router_serves_signed_subject_api_key_rate_limit_create_and_list() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog(&pool).await;
    pool.close().await;

    let router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap(),
        Some(api_key_security_config()),
        Some(trusted_subject_config()),
        Some(app_session_config()),
    )
    .await
    .unwrap();

    let create_response = router
        .clone()
        .oneshot(app_session_request(
            "POST",
            "/backend/v3/api/router/rate_limits/api_keys",
            Body::from(r#"{"keyPrefix":"sk-test","user":"30","rps":7,"rpd":1200,"burst":14}"#),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_response.status());
    let create_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(create_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("2000", create_payload["code"]);
    assert_eq!("sk-test", create_payload["data"]["item"]["keyPrefix"]);
    assert_eq!("30", create_payload["data"]["item"]["user"]);
    assert_eq!(7, create_payload["data"]["item"]["rps"]);
    assert_eq!(1200, create_payload["data"]["item"]["rpd"]);
    assert_eq!(14, create_payload["data"]["item"]["burst"]);
    assert_eq!("active", create_payload["data"]["item"]["status"]);

    let list_response = router
        .oneshot(signed_request(
            "GET",
            "/backend/v3/api/router/rate_limits/api_keys",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(list_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!(1, list_payload["data"]["items"].as_array().unwrap().len());
    assert_eq!("sk-test", list_payload["data"]["items"][0]["keyPrefix"]);
    assert_eq!(1200, list_payload["data"]["items"][0]["rpd"]);
}

#[tokio::test]
async fn database_config_router_serves_signed_subject_model_rate_limit_create_and_list() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog(&pool).await;
    pool.close().await;

    let router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap(),
        Some(api_key_security_config()),
        Some(trusted_subject_config()),
        Some(app_session_config()),
    )
    .await
    .unwrap();

    let create_response = router
        .clone()
        .oneshot(app_session_request(
            "POST",
            "/backend/v3/api/router/rate_limits/models",
            Body::from(
                r#"{"model":"gpt-4o-mini","group":"standard-group","rpm":600,"tpm":120000}"#,
            ),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_response.status());
    let create_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(create_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("2000", create_payload["code"]);
    assert_eq!("gpt-4o-mini", create_payload["data"]["item"]["model"]);
    assert_eq!("standard-group", create_payload["data"]["item"]["group"]);
    assert_eq!(600, create_payload["data"]["item"]["rpm"]);
    assert_eq!(120000, create_payload["data"]["item"]["tpm"]);
    assert_eq!("active", create_payload["data"]["item"]["status"]);

    let list_response = router
        .oneshot(signed_request(
            "GET",
            "/backend/v3/api/router/rate_limits/models",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(list_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!(1, list_payload["data"]["items"].as_array().unwrap().len());
    assert_eq!("gpt-4o-mini", list_payload["data"]["items"][0]["model"]);
    assert_eq!("standard-group", list_payload["data"]["items"][0]["group"]);
    assert_eq!(600, list_payload["data"]["items"][0]["rpm"]);
    assert_eq!(120000, list_payload["data"]["items"][0]["tpm"]);
}

#[tokio::test]
async fn database_config_router_serves_signed_subject_firewall_rule_crud() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog(&pool).await;
    pool.close().await;
    let expected_reason = format!("{} crawler source", "\u{4e2d}\u{6587}");

    let router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap(),
        Some(api_key_security_config()),
        Some(trusted_subject_config()),
        Some(app_session_config()),
    )
    .await
    .unwrap();

    let create_response = router
        .clone()
        .oneshot(app_session_request(
            "POST",
            "/backend/v3/api/router/firewall/rules",
            Body::from(
                r#"{"type":"IP blacklist","value":"10.10.10.9/24","reason":"\u4e2d\u6587 crawler source"}"#,
            ),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_response.status());
    let create_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(create_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("2000", create_payload["code"]);
    assert_eq!("IP blacklist", create_payload["data"]["item"]["type"]);
    assert_eq!("10.10.10.0/24", create_payload["data"]["item"]["value"]);
    assert_eq!(
        expected_reason,
        create_payload["data"]["item"]["reason"].as_str().unwrap()
    );
    assert!(create_payload["data"]["item"]["time"]
        .as_str()
        .unwrap()
        .contains('-'));
    let rule_id = create_payload["data"]["item"]["id"].as_str().unwrap();

    let list_response = router
        .clone()
        .oneshot(signed_request(
            "GET",
            "/backend/v3/api/router/firewall/rules",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(list_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!(1, list_payload["data"]["items"].as_array().unwrap().len());
    assert_eq!("10.10.10.0/24", list_payload["data"]["items"][0]["value"]);

    let update_response = router
        .clone()
        .oneshot(signed_request(
            "POST",
            "/backend/v3/api/router/firewall/rules",
            Body::from(
                r#"{"type":"IP blacklist","value":"10.10.10.88/24","reason":"Crawler source updated"}"#,
            ),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, update_response.status());
    let update_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(update_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("2000", update_payload["code"]);
    assert_eq!(
        create_payload["data"]["item"]["id"],
        update_payload["data"]["item"]["id"]
    );
    assert_eq!("IP blacklist", update_payload["data"]["item"]["type"]);
    assert_eq!("10.10.10.0/24", update_payload["data"]["item"]["value"]);
    assert_eq!(
        "Crawler source updated",
        update_payload["data"]["item"]["reason"]
    );

    let updated_list_response = router
        .clone()
        .oneshot(signed_request(
            "GET",
            "/backend/v3/api/router/firewall/rules",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, updated_list_response.status());
    let updated_list_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(updated_list_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!(
        1,
        updated_list_payload["data"]["items"]
            .as_array()
            .unwrap()
            .len()
    );
    assert_eq!(
        "Crawler source updated",
        updated_list_payload["data"]["items"][0]["reason"]
    );

    let delete_path = format!("/backend/v3/api/router/firewall/rules/{rule_id}");
    let delete_response = router
        .clone()
        .oneshot(signed_request("DELETE", &delete_path, Body::empty()))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, delete_response.status());
    let delete_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(delete_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!(true, delete_payload["data"]["deleted"]);

    let final_list_response = router
        .oneshot(signed_request(
            "GET",
            "/backend/v3/api/router/firewall/rules",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, final_list_response.status());
    let final_list_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(final_list_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!(
        0,
        final_list_payload["data"]["items"]
            .as_array()
            .unwrap()
            .len()
    );
}

#[tokio::test]
async fn database_config_router_serves_signed_subject_monitor_reads() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog(&pool).await;
    seed_monitoring(&pool).await;
    pool.close().await;

    let router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap(),
        Some(api_key_security_config()),
        Some(trusted_subject_config()),
        Some(app_session_config()),
    )
    .await
    .unwrap();

    let nodes_response = router
        .clone()
        .oneshot(signed_request(
            "GET",
            "/backend/v3/api/router/monitor/nodes",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, nodes_response.status());
    let nodes_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(nodes_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("2000", nodes_payload["code"]);
    assert_eq!("gw-shanghai-01", nodes_payload["data"]["items"][0]["name"]);
    assert_eq!("cn-shanghai", nodes_payload["data"]["items"][0]["region"]);
    assert_eq!("warning", nodes_payload["data"]["items"][0]["status"]);
    assert_eq!(72.5, nodes_payload["data"]["items"][0]["cpu"]);
    assert_eq!(63.0, nodes_payload["data"]["items"][0]["memory"]);

    let alerts_response = router
        .clone()
        .oneshot(signed_request(
            "GET",
            "/backend/v3/api/router/monitor/alerts",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, alerts_response.status());
    let alerts_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(alerts_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("critical", alerts_payload["data"]["items"][0]["severity"]);
    assert_eq!("active", alerts_payload["data"]["items"][0]["status"]);
    assert_eq!("gateway", alerts_payload["data"]["items"][0]["source"]);

    let performance_response = router
        .oneshot(signed_request(
            "GET",
            "/backend/v3/api/router/monitor/performance",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, performance_response.status());
    let performance_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(performance_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!(
        2,
        performance_payload["data"]["items"]
            .as_array()
            .unwrap()
            .len()
    );
    assert_eq!("09:00", performance_payload["data"]["items"][0]["time"]);
    assert_eq!(41.0, performance_payload["data"]["items"][0]["cpu"]);
    assert_eq!(58.0, performance_payload["data"]["items"][0]["memory"]);
    assert_eq!(122.0, performance_payload["data"]["items"][0]["network"]);
}

#[tokio::test]
async fn database_config_router_serves_signed_subject_admin_user_management() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog(&pool).await;
    seed_admin_users(&pool).await;
    pool.close().await;

    let router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap(),
        Some(api_key_security_config()),
        Some(trusted_subject_config()),
        Some(app_session_config()),
    )
    .await
    .unwrap();

    let users_response = router
        .clone()
        .oneshot(signed_request(
            "POST",
            "/backend/v3/api/user/list",
            Body::from("{}"),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, users_response.status());
    let users_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(users_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("2000", users_payload["code"]);
    assert_eq!(
        "owner@example.com",
        users_payload["data"]["items"][0]["email"]
    );
    assert_eq!("$25.50", users_payload["data"]["items"][0]["balance"]);
    assert_eq!(
        "2026-04-29 09:00:00",
        users_payload["data"]["items"][0]["lastActive"]
    );
    assert_eq!(
        "2026-04-29 09:05:00",
        users_payload["data"]["items"][0]["lastUsed"]
    );

    let keys_response = router
        .clone()
        .oneshot(signed_request(
            "POST",
            "/backend/v3/api/apikey/list",
            Body::from("{}"),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, keys_response.status());
    let keys_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(keys_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("Production", keys_payload["data"]["30"][0]["name"]);

    let balance_response = router
        .clone()
        .oneshot(signed_request(
            "POST",
            "/backend/v3/api/billing/users/30/balance_adjustments",
            Body::from(r#"{"amount":5,"type":"recharge"}"#),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, balance_response.status());
    let balance_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(balance_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("$30.50", balance_payload["data"]["item"]["balance"]);

    let create_key_response = router
        .oneshot(signed_request(
            "POST",
            "/backend/v3/api/apikey",
            Body::from(r#"{"userId":30,"name":"Console Key"}"#),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_key_response.status());
    let create_key_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(create_key_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("Console Key", create_key_payload["data"]["key"]["name"]);
    assert!(create_key_payload["data"]["rawKey"]
        .as_str()
        .unwrap()
        .starts_with("sk-claw-"));
}

#[tokio::test]
async fn database_config_router_serves_signed_subject_admin_marketing() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog(&pool).await;
    seed_admin_users(&pool).await;
    seed_admin_marketing(&pool).await;
    pool.close().await;

    let router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap(),
        Some(api_key_security_config()),
        Some(trusted_subject_config()),
        Some(app_session_config()),
    )
    .await
    .unwrap();

    let coupons_payload = request_json(
        router.clone(),
        signed_request("GET", "/backend/v3/api/billing/coupons", Body::empty()),
    )
    .await;
    assert_eq!("2000", coupons_payload["code"]);
    assert_eq!(
        "Welcome credit",
        coupons_payload["data"]["items"][0]["name"]
    );
    assert_eq!("$5.00", coupons_payload["data"]["items"][0]["value"]);

    let batches_payload = request_json(
        router.clone(),
        signed_request(
            "GET",
            "/backend/v3/api/billing/coupon_batches",
            Body::empty(),
        ),
    )
    .await;
    assert_eq!("Welcome batch", batches_payload["data"]["items"][0]["name"]);
    assert_eq!(2, batches_payload["data"]["items"][0]["count"]);

    let promo_payload = request_json(
        router.clone(),
        signed_request("GET", "/backend/v3/api/billing/coupon_codes", Body::empty()),
    )
    .await;
    assert_eq!("WELCOME-0002", promo_payload["data"]["items"][0]["code"]);
    assert_eq!("used", promo_payload["data"]["items"][0]["status"]);
    assert_eq!(
        "owner@example.com",
        promo_payload["data"]["items"][0]["usedBy"]
    );

    let invalid_reopen_response = router
        .clone()
        .oneshot(signed_request(
            "PATCH",
            "/backend/v3/api/billing/coupon_codes/502/status",
            Body::from(r#"{"status":"available"}"#),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::CONFLICT, invalid_reopen_response.status());
    let invalid_reopen_payload: serde_json::Value = serde_json::from_slice(
        &axum::body::to_bytes(invalid_reopen_response.into_body(), usize::MAX)
            .await
            .unwrap(),
    )
    .unwrap();
    assert_eq!("4090", invalid_reopen_payload["code"]);
    assert!(invalid_reopen_payload["msg"]
        .as_str()
        .unwrap()
        .contains("used promo code cannot be reopened"));

    let promo_after_invalid_update = request_json(
        router.clone(),
        signed_request("GET", "/backend/v3/api/billing/coupon_codes", Body::empty()),
    )
    .await;
    assert_eq!(
        "used",
        promo_after_invalid_update["data"]["items"][0]["status"]
    );
    assert_eq!(
        "owner@example.com",
        promo_after_invalid_update["data"]["items"][0]["usedBy"]
    );

    let redemptions_payload = request_json(
        router.clone(),
        signed_request(
            "GET",
            "/backend/v3/api/billing/users/coupons",
            Body::empty(),
        ),
    )
    .await;
    assert_eq!(
        "WELCOME-0002",
        redemptions_payload["data"]["items"][0]["code"]
    );
    assert_eq!("$5.00", redemptions_payload["data"]["items"][0]["amount"]);

    let recharges_payload = request_json(
        router.clone(),
        signed_request(
            "GET",
            "/backend/v3/api/billing/recharges/records",
            Body::empty(),
        ),
    )
    .await;
    assert_eq!(
        "recharge-100",
        recharges_payload["data"]["items"][0]["tradeNo"]
    );
    assert_eq!(
        "1000",
        recharges_payload["data"]["items"][0]["usd_credited"]
    );

    let recharge_packages_payload = request_json(
        router.clone(),
        signed_request(
            "GET",
            "/backend/v3/api/billing/recharges/packages",
            Body::empty(),
        ),
    )
    .await;
    assert_eq!(
        "10.00",
        recharge_packages_payload["data"]["items"][0]["rmb"]
    );
    assert_eq!(25, recharge_packages_payload["data"]["items"][0]["bonus"]);
    assert_eq!(125, recharge_packages_payload["data"]["items"][0]["points"]);

    let referrals_payload = request_json(
        router.clone(),
        signed_request(
            "GET",
            "/backend/v3/api/router/referrals/stats",
            Body::empty(),
        ),
    )
    .await;
    assert_eq!("Owner", referrals_payload["data"]["items"][0]["inviter"]);
    assert_eq!(3, referrals_payload["data"]["items"][0]["total_invited"]);

    let create_coupon_payload = request_json(
        router.clone(),
        signed_request(
            "POST",
            "/backend/v3/api/billing/coupons",
            Body::from(r#"{"name":"Launch credit","type":"amount","value":"$8.50"}"#),
        ),
    )
    .await;
    assert_eq!(
        "Launch credit",
        create_coupon_payload["data"]["item"]["name"]
    );
    assert_eq!("$8.50", create_coupon_payload["data"]["item"]["value"]);

    let new_coupon_id = create_coupon_payload["data"]["item"]["id"]
        .as_str()
        .unwrap()
        .to_owned();
    let generate_payload = request_json(
        router.clone(),
        signed_request(
            "POST",
            "/backend/v3/api/billing/coupon_batches",
            Body::from(format!(
                r#"{{"couponId":"{new_coupon_id}","name":"Launch batch","count":2,"prefix":"LAUNCH"}}"#
            )),
        ),
    )
    .await;
    assert_eq!("Launch batch", generate_payload["data"]["batch"]["name"]);
    assert_eq!(
        2,
        generate_payload["data"]["codes"].as_array().unwrap().len()
    );
    assert_eq!("LAUNCH-0001", generate_payload["data"]["codes"][0]["code"]);
    assert_eq!("LAUNCH-0002", generate_payload["data"]["codes"][1]["code"]);

    let create_recharge_package_payload = request_json(
        router.clone(),
        signed_request(
            "POST",
            "/backend/v3/api/billing/recharges/packages",
            Body::from(r#"{"rmb":"12.00","bonus":30,"status":"active"}"#),
        ),
    )
    .await;
    assert_eq!(
        "12.00",
        create_recharge_package_payload["data"]["item"]["rmb"]
    );
    assert_eq!(30, create_recharge_package_payload["data"]["item"]["bonus"]);
    assert_eq!(
        150,
        create_recharge_package_payload["data"]["item"]["points"]
    );
    let new_recharge_package_id = create_recharge_package_payload["data"]["item"]["id"]
        .as_str()
        .unwrap()
        .to_owned();

    let update_recharge_package_payload = request_json(
        router.clone(),
        signed_request(
            "PUT",
            format!("/backend/v3/api/billing/recharges/packages/{new_recharge_package_id}")
                .as_str(),
            Body::from(r#"{"rmb":"20.00","bonus":50,"status":"inactive"}"#),
        ),
    )
    .await;
    assert_eq!(
        "20.00",
        update_recharge_package_payload["data"]["item"]["rmb"]
    );
    assert_eq!(50, update_recharge_package_payload["data"]["item"]["bonus"]);
    assert_eq!(
        250,
        update_recharge_package_payload["data"]["item"]["points"]
    );

    let delete_recharge_package_payload = request_json(
        router.clone(),
        signed_request(
            "DELETE",
            format!("/backend/v3/api/billing/recharges/packages/{new_recharge_package_id}")
                .as_str(),
            Body::empty(),
        ),
    )
    .await;
    assert_eq!(true, delete_recharge_package_payload["data"]["deleted"]);

    let second_generate_payload = request_json(
        router.clone(),
        signed_request(
            "POST",
            "/backend/v3/api/billing/coupon_batches",
            Body::from(format!(
                r#"{{"couponId":"{new_coupon_id}","name":"Launch batch two","count":2,"prefix":"LAUNCH"}}"#
            )),
        ),
    )
    .await;
    assert_eq!(
        "Launch batch two",
        second_generate_payload["data"]["batch"]["name"]
    );
    assert_eq!(
        "LAUNCH-0003",
        second_generate_payload["data"]["codes"][0]["code"]
    );
    assert_eq!(
        "LAUNCH-0004",
        second_generate_payload["data"]["codes"][1]["code"]
    );

    let promo_after_generation_payload = request_json(
        router.clone(),
        signed_request("GET", "/backend/v3/api/billing/coupon_codes", Body::empty()),
    )
    .await;
    let first_batch_id = generate_payload["data"]["batch"]["id"].as_str().unwrap();
    let second_batch_id = second_generate_payload["data"]["batch"]["id"]
        .as_str()
        .unwrap();
    let promo_after_generation_items = promo_after_generation_payload["data"]["items"]
        .as_array()
        .unwrap();
    let generated_launch_codes: Vec<&str> = promo_after_generation_payload["data"]["items"]
        .as_array()
        .unwrap()
        .iter()
        .filter_map(|item| item["code"].as_str())
        .filter(|code| code.starts_with("LAUNCH-"))
        .collect();
    let unique_launch_codes: std::collections::BTreeSet<&str> =
        generated_launch_codes.iter().copied().collect();
    assert_eq!(generated_launch_codes.len(), unique_launch_codes.len());
    assert_eq!(
        vec!["LAUNCH-0004", "LAUNCH-0003", "LAUNCH-0002", "LAUNCH-0001"],
        generated_launch_codes
    );
    for (code, expected_batch_id) in [
        ("LAUNCH-0001", first_batch_id),
        ("LAUNCH-0002", first_batch_id),
        ("LAUNCH-0003", second_batch_id),
        ("LAUNCH-0004", second_batch_id),
    ] {
        let item = promo_after_generation_items
            .iter()
            .find(|item| item["code"] == code)
            .unwrap();
        assert_eq!(expected_batch_id, item["batchId"]);
    }

    let other_subject = trusted_request_subject(11, 21, 31);
    let other_coupon_payload = request_json(
        router.clone(),
        signed_request_for_subject(
            "POST",
            "/backend/v3/api/billing/coupons",
            Body::from(r#"{"name":"Regional launch credit","type":"amount","value":"$9.00"}"#),
            other_subject,
        ),
    )
    .await;
    let other_coupon_id = other_coupon_payload["data"]["item"]["id"]
        .as_str()
        .unwrap()
        .to_owned();
    let other_generate_payload = request_json(
        router.clone(),
        signed_request_for_subject(
            "POST",
            "/backend/v3/api/billing/coupon_batches",
            Body::from(format!(
                r#"{{"couponId":"{other_coupon_id}","name":"Regional launch batch","count":2,"prefix":"LAUNCH"}}"#
            )),
            other_subject,
        ),
    )
    .await;
    assert_eq!(
        "LAUNCH-0005",
        other_generate_payload["data"]["codes"][0]["code"]
    );
    assert_eq!(
        "LAUNCH-0006",
        other_generate_payload["data"]["codes"][1]["code"]
    );

    let new_promo_id = generate_payload["data"]["codes"][0]["id"]
        .as_str()
        .unwrap()
        .to_owned();
    let update_payload = request_json(
        router.clone(),
        signed_request(
            "PATCH",
            format!("/backend/v3/api/billing/coupon_codes/{new_promo_id}/status").as_str(),
            Body::from(r#"{"status":"voided"}"#),
        ),
    )
    .await;
    assert_eq!(true, update_payload["data"]["updated"]);

    let delete_payload = request_json(
        router,
        signed_request(
            "DELETE",
            format!("/backend/v3/api/billing/coupons/{new_coupon_id}").as_str(),
            Body::empty(),
        ),
    )
    .await;
    assert_eq!(true, delete_payload["data"]["deleted"]);
}

#[tokio::test]
async fn database_config_router_serves_signed_subject_admin_finance() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog(&pool).await;
    seed_admin_users(&pool).await;
    seed_admin_finance(&pool).await;
    pool.close().await;

    let router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap(),
        Some(api_key_security_config()),
        Some(trusted_subject_config()),
        Some(app_session_config()),
    )
    .await
    .unwrap();

    let transactions_payload = request_json(
        router.clone(),
        signed_request(
            "GET",
            "/backend/v3/api/billing/finance/ledger",
            Body::empty(),
        ),
    )
    .await;
    assert_eq!("2000", transactions_payload["code"]);
    assert_eq!(
        "ledger-1000",
        transactions_payload["data"]["items"][0]["id"]
    );
    assert_eq!("30", transactions_payload["data"]["items"][0]["userId"]);
    assert_eq!("recharge", transactions_payload["data"]["items"][0]["type"]);
    assert_eq!("25.50", transactions_payload["data"]["items"][0]["amount"]);
    assert_eq!(
        "125.50",
        transactions_payload["data"]["items"][0]["balance"]
    );
    assert_eq!(
        "Payment success",
        transactions_payload["data"]["items"][0]["description"]
    );
    assert_eq!(
        "success",
        transactions_payload["data"]["items"][0]["status"]
    );

    let billing_payload = request_json(
        router,
        signed_request(
            "GET",
            "/backend/v3/api/billing/finance/usage_statements",
            Body::empty(),
        ),
    )
    .await;
    assert_eq!("2000", billing_payload["code"]);
    assert_eq!("stmt-202604", billing_payload["data"]["items"][0]["id"]);
    assert_eq!("30", billing_payload["data"]["items"][0]["userId"]);
    assert_eq!("2026-04", billing_payload["data"]["items"][0]["period"]);
    assert_eq!(12000, billing_payload["data"]["items"][0]["totalTokens"]);
    assert_eq!("88.25", billing_payload["data"]["items"][0]["totalCost"]);
    assert_eq!("unpaid", billing_payload["data"]["items"][0]["status"]);
    assert_eq!(
        "2026-05-10 00:00:00",
        billing_payload["data"]["items"][0]["dueDate"]
    );
}

#[tokio::test]
async fn database_config_router_serves_signed_subject_admin_record() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog(&pool).await;
    seed_admin_users(&pool).await;
    seed_admin_record(&pool).await;
    pool.close().await;

    let router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap(),
        Some(api_key_security_config()),
        Some(trusted_subject_config()),
        Some(app_session_config()),
    )
    .await
    .unwrap();

    let payload = request_json(
        router,
        signed_request(
            "GET",
            "/backend/v3/api/system/records?user=owner%40example.com&token=Production&model=gpt-4o-mini",
            Body::empty(),
        ),
    )
    .await;

    assert_eq!("2000", payload["code"]);
    assert_eq!(1, payload["data"]["total"]);
    assert_eq!("trace-100", payload["data"]["logs"][0]["id"]);
    assert_eq!("owner@example.com", payload["data"]["logs"][0]["user"]);
    assert_eq!(
        "req-admin-record-1",
        payload["data"]["logs"][0]["requestId"]
    );
    assert_eq!("2026-04-29 09:30:00", payload["data"]["logs"][0]["time"]);
    assert_eq!("Production", payload["data"]["logs"][0]["tokenName"]);
    assert_eq!("standard-group", payload["data"]["logs"][0]["group"]);
    assert_eq!("text", payload["data"]["logs"][0]["type"]);
    assert_eq!("gpt-4o-mini", payload["data"]["logs"][0]["model"]);
    assert_eq!("842ms", payload["data"]["logs"][0]["totalTime"]);
    assert_eq!("120ms", payload["data"]["logs"][0]["ttft"]);
    assert_eq!(true, payload["data"]["logs"][0]["isStream"]);
    assert_eq!(1200, payload["data"]["logs"][0]["inputTokens"]);
    assert_eq!(128, payload["data"]["logs"][0]["cacheReadTokens"]);
    assert_eq!(300, payload["data"]["logs"][0]["outputTokens"]);
    assert_eq!("0.012300", payload["data"]["logs"][0]["cost"]);
    assert_eq!("1.200000", payload["data"]["logs"][0]["multiplier"]);
    assert_eq!("0.150000", payload["data"]["logs"][0]["baseInputPrice"]);
    assert_eq!("0.600000", payload["data"]["logs"][0]["baseOutputPrice"]);
    assert_eq!("0.030000", payload["data"]["logs"][0]["cacheReadPrice"]);
    assert_eq!("/v1/chat/completions", payload["data"]["logs"][0]["path"]);
    assert_eq!("medium", payload["data"]["logs"][0]["reasoningEffort"]);
    assert_eq!("203.0.113.***", payload["data"]["logs"][0]["ip"]);
}

#[tokio::test]
async fn optional_database_config_keeps_manifest_fallback_when_catalog_is_not_configured() {
    let router = sdkwork_claw_admin_api::router_with_optional_database_config(None)
        .await
        .unwrap();

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/backend/v3/api/ai/models")
                .header("content-type", "application/json")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::NOT_IMPLEMENTED, response.status());
}

fn unique_sqlite_url() -> String {
    let nonce = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos();
    let sequence = SQLITE_DB_SEQUENCE.fetch_add(1, Ordering::Relaxed);
    let process_id = std::process::id();
    let path = format!("target/test-dbs/admin-config-{process_id}-{nonce}-{sequence}.db");
    std::fs::create_dir_all("target/test-dbs").unwrap();
    format!("sqlite://{path}")
}

fn trusted_subject_config() -> TrustedSubjectConfig {
    test_trusted_subject_config().unwrap()
}

fn app_session_config() -> AppSessionConfig {
    test_app_session_config().unwrap()
}

fn api_key_security_config() -> ApiKeySecurityConfig {
    test_api_key_security_config().unwrap()
}

fn signed_request(method: &str, path: &str, body: Body) -> Request<Body> {
    signed_request_for_subject(method, path, body, default_trusted_request_subject())
}

fn signed_request_for_subject(
    method: &str,
    path: &str,
    body: Body,
    subject: TrustedRequestSubject,
) -> Request<Body> {
    let timestamp = current_unix_seconds();
    let timestamp_value = timestamp.to_string();
    let signature = trusted_subject_signature(subject, timestamp, method, path).unwrap();
    Request::builder()
        .method(method)
        .uri(path)
        .header("content-type", "application/json")
        .header("x-sdkwork-subject-tenant-id", subject.tenant_id.to_string())
        .header(
            "x-sdkwork-subject-organization-id",
            subject.organization_id.to_string(),
        )
        .header("x-sdkwork-subject-user-id", subject.user_id.to_string())
        .header("x-sdkwork-subject-timestamp", timestamp_value)
        .header("x-sdkwork-subject-signature", signature)
        .body(body)
        .unwrap()
}

fn app_session_request(method: &str, path: &str, body: Body) -> Request<Body> {
    let issued_at = current_unix_seconds();
    let expires_at = issued_at + 3600;
    let (authorization, access_token) =
        app_session_dual_token_headers(default_trusted_request_subject(), issued_at, expires_at)
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
        "id": "chatcmpl-admin-health",
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

async fn configured_router_with_provider_secret_map(
    database_url: &str,
    provider_secret_map_config: ProviderSecretMapConfig,
) -> axum::Router {
    sdkwork_claw_admin_api::router_with_database_api_key_trusted_subject_app_session_and_provider_secret_map_config(
        DatabaseConfig::from_url_with_max_connections(database_url, 1).unwrap(),
        api_key_security_config(),
        trusted_subject_config(),
        app_session_config(),
        provider_secret_map_config,
    )
    .await
    .unwrap()
}

fn app_session_request_builder(method: &str, path: &str) -> axum::http::request::Builder {
    let issued_at = current_unix_seconds();
    let expires_at = issued_at + 3600;
    let (authorization, access_token) =
        app_session_dual_token_headers(default_trusted_request_subject(), issued_at, expires_at)
            .unwrap();
    Request::builder()
        .method(method)
        .uri(path)
        .header("content-type", "application/json")
        .header("authorization", authorization)
        .header("Sdkwork-Access-Token", access_token)
}

async fn request_json(router: axum::Router, request: Request<Body>) -> serde_json::Value {
    let response = router.oneshot(request).await.unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

async fn request_json_with_status(
    router: axum::Router,
    request: Request<Body>,
) -> (StatusCode, Value, String) {
    let response = router.oneshot(request).await.unwrap();
    let status = response.status();
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body_text = String::from_utf8(body.to_vec()).unwrap();
    let payload: Value = serde_json::from_str(&body_text).unwrap();
    (status, payload, body_text)
}

fn current_unix_seconds() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0)
}

async fn create_sqlite_pool(database_url: &str) -> SqlitePool {
    let options = SqliteConnectOptions::from_str(database_url)
        .unwrap()
        .create_if_missing(true)
        .foreign_keys(true);
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
            uuid TEXT,
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            vendor_code TEXT NOT NULL,
            display_name TEXT NOT NULL,
            description TEXT,
            color_token TEXT,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            sort_order INTEGER NOT NULL
        )"#,
        r#"CREATE TABLE ai_model (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            catalog_key TEXT,
            model TEXT NOT NULL,
            display_name TEXT NOT NULL,
            vendor_id INTEGER,
            vendor_code TEXT NOT NULL,
            region_code TEXT,
            vendor_name_snapshot TEXT,
            family_id INTEGER,
            family_code TEXT,
            provider_hint TEXT,
            model_family TEXT,
            model_version TEXT,
            model_aliases TEXT,
            capability INTEGER,
            modalities TEXT,
            input_modalities TEXT,
            output_modalities TEXT,
            icon_url TEXT,
            color_token TEXT,
            docs_url TEXT,
            license_type INTEGER,
            description TEXT,
            capability_intro TEXT,
            limitations TEXT,
            supported_languages TEXT,
            use_cases TEXT,
            training_data_cutoff TEXT,
            context_tokens INTEGER,
            max_input_tokens INTEGER,
            max_output_tokens INTEGER,
            max_duration_seconds INTEGER,
            supports_streaming INTEGER,
            supports_tools INTEGER,
            supports_json_schema INTEGER,
            api_format TEXT,
            performance_profile TEXT,
            default_pricing_id INTEGER,
            release_stage INTEGER NOT NULL DEFAULT 1,
            shelf_state INTEGER NOT NULL DEFAULT 1,
            routing_state INTEGER NOT NULL DEFAULT 1,
            deprecated_at TEXT,
            retired_at TEXT,
            replacement_model TEXT,
            capabilities TEXT NOT NULL DEFAULT '[]',
            status INTEGER NOT NULL,
            deleted_at TEXT,
            deleted_by INTEGER,
            rank_score TEXT
        )"#,
        r#"CREATE TABLE integration_provider (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'seed-provider',
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
            provider_code TEXT NOT NULL,
            display_name TEXT,
            protocol INTEGER,
            base_url_template TEXT,
            status INTEGER NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            deleted_at TEXT
        )"#,
        r#"CREATE TABLE integration_provider_account (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'seed-provider-account',
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
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
            status INTEGER NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            deleted_at TEXT
        )"#,
        r#"CREATE TABLE integration_channel (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'seed-channel',
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
            provider_code TEXT NOT NULL,
            channel_code TEXT,
            name TEXT,
            protocol INTEGER,
            access_type INTEGER,
            base_url_override TEXT,
            timeout_ms INTEGER,
            retry_policy TEXT,
            model_mode INTEGER,
            environment INTEGER,
            capabilities TEXT,
            account_id INTEGER,
            status INTEGER NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            priority INTEGER NOT NULL,
            weight INTEGER NOT NULL,
            health_status INTEGER,
            last_latency_ms INTEGER,
            consecutive_error_count INTEGER
        )"#,
        r#"CREATE TABLE integration_channel_model (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'seed-channel-model',
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
            status INTEGER NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            effective_from TEXT,
            effective_to TEXT
        )"#,
        r#"CREATE TABLE integration_provider_health_snapshot (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'seed-health',
            tenant_id INTEGER,
            organization_id INTEGER,
            user_id INTEGER,
            request_id TEXT,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
        r#"CREATE TABLE ai_pricing_plan (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER,
            organization_id INTEGER,
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
        r#"CREATE TABLE ai_routing_decision_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER,
            organization_id INTEGER,
            user_id INTEGER,
            request_id TEXT,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            requested_model TEXT,
            resolved_model TEXT
        )"#,
        r#"CREATE TABLE ai_request_trace (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER,
            organization_id INTEGER,
            user_id INTEGER,
            request_id TEXT,
            trace_id TEXT,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            api_key_name_snapshot TEXT,
            api_key_group_snapshot TEXT,
            owner_name_snapshot TEXT,
            requested_model TEXT,
            provider_model TEXT,
            endpoint TEXT,
            request_path TEXT,
            http_status INTEGER,
            provider_error_code TEXT,
            error_type INTEGER,
            started_at TEXT,
            latency_ms INTEGER,
            ttft_ms INTEGER,
            streaming INTEGER,
            prompt_tokens INTEGER,
            completion_tokens INTEGER,
            cached_tokens INTEGER,
            reasoning_effort TEXT,
            client_ip_masked TEXT
        )"#,
        r#"CREATE TABLE ai_usage_fact (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER,
            organization_id INTEGER,
            user_id INTEGER,
            request_id TEXT,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            owner_name_snapshot TEXT,
            api_key_name_snapshot TEXT,
            api_key_group_snapshot TEXT,
            model TEXT,
            modality INTEGER,
            prompt_tokens INTEGER,
            completion_tokens INTEGER,
            cached_tokens INTEGER,
            total_tokens INTEGER,
            customer_charge_amount TEXT,
            cost_amount TEXT,
            rate_multiplier TEXT,
            base_input_unit_price TEXT,
            base_output_unit_price TEXT,
            cache_read_unit_price TEXT,
            occurred_at TEXT
        )"#,
        r#"CREATE TABLE plus_user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER,
            created_at TEXT NOT NULL,
            updated_at TEXT,
            v INTEGER NOT NULL DEFAULT 0,
            username TEXT,
            nickname TEXT,
            password TEXT,
            platform INTEGER,
            type INTEGER,
            email TEXT,
            status INTEGER NOT NULL DEFAULT 1,
            deleted_at TEXT
        )"#,
        r#"CREATE TABLE plus_account (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            account_type INTEGER NOT NULL,
            owner INTEGER NOT NULL,
            owner_id INTEGER NOT NULL,
            available_balance TEXT NOT NULL,
            frozen_balance TEXT NOT NULL,
            available_points INTEGER NOT NULL,
            frozen_points INTEGER NOT NULL,
            token_balance INTEGER NOT NULL,
            frozen_token INTEGER NOT NULL,
            status INTEGER NOT NULL
        )"#,
        "CREATE UNIQUE INDEX uk_plus_account_user_type ON plus_account (tenant_id, organization_id, user_id, account_type)",
        "CREATE INDEX idx_plus_account_user_id ON plus_account (user_id)",
        "CREATE INDEX idx_plus_account_owner_id ON plus_account (owner, owner_id)",
        r#"CREATE TABLE plus_account_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL,
            account_type INTEGER NOT NULL,
            asset_type INTEGER NOT NULL,
            account_id INTEGER NOT NULL,
            transaction_id TEXT NOT NULL,
            transaction_type INTEGER NOT NULL,
            amount TEXT NOT NULL DEFAULT '0',
            balance_before TEXT NOT NULL DEFAULT '0',
            balance_after TEXT NOT NULL DEFAULT '0',
            points_change INTEGER NOT NULL DEFAULT 0,
            points_before INTEGER NOT NULL DEFAULT 0,
            points_after INTEGER NOT NULL DEFAULT 0,
            source_type INTEGER NOT NULL DEFAULT 0,
            source_id TEXT NOT NULL DEFAULT '',
            status INTEGER NOT NULL,
            usage_result TEXT,
            remarks TEXT
        )"#,
        "CREATE INDEX idx_account_history_account_id ON plus_account_history (account_id)",
        "CREATE INDEX idx_account_history_transaction_id ON plus_account_history (transaction_id)",
        "CREATE INDEX idx_account_history_source_id ON plus_account_history (source_id)",
        r#"CREATE TABLE plus_vip_level (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            name TEXT NOT NULL,
            level_value INTEGER NOT NULL,
            required_points INTEGER NOT NULL DEFAULT 0,
            description TEXT,
            status INTEGER NOT NULL DEFAULT 1
        )"#,
        "CREATE UNIQUE INDEX uk_plus_vip_level_name ON plus_vip_level (name)",
        "CREATE UNIQUE INDEX uk_plus_vip_level_value ON plus_vip_level (level_value)",
        "CREATE INDEX idx_plus_vip_level_status ON plus_vip_level (status)",
        r#"CREATE TABLE plus_vip_benefit (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            name TEXT NOT NULL,
            description TEXT,
            benefit_key TEXT,
            type INTEGER NOT NULL,
            status INTEGER NOT NULL DEFAULT 1
        )"#,
        "CREATE UNIQUE INDEX uk_plus_vip_benefit_name ON plus_vip_benefit (name)",
        "CREATE UNIQUE INDEX uk_plus_vip_benefit_key ON plus_vip_benefit (benefit_key)",
        "CREATE INDEX idx_plus_vip_benefit_type ON plus_vip_benefit (type)",
        "CREATE INDEX idx_plus_vip_benefit_status ON plus_vip_benefit (status)",
        r#"CREATE TABLE plus_vip_level_benefit (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            vip_level_id INTEGER NOT NULL,
            benefit_id INTEGER NOT NULL,
            daily_limit INTEGER,
            monthly_limit INTEGER,
            total_limit INTEGER,
            status INTEGER NOT NULL,
            metadata TEXT,
            remark TEXT,
            CONSTRAINT fk_plus_vip_level_benefit_level FOREIGN KEY (vip_level_id) REFERENCES plus_vip_level (id),
            CONSTRAINT fk_plus_vip_level_benefit_benefit FOREIGN KEY (benefit_id) REFERENCES plus_vip_benefit (id)
        )"#,
        "CREATE UNIQUE INDEX uk_plus_vip_level_benefit_pair ON plus_vip_level_benefit (vip_level_id, benefit_id)",
        "CREATE INDEX idx_plus_vip_level_benefit_level ON plus_vip_level_benefit (vip_level_id)",
        "CREATE INDEX idx_plus_vip_level_benefit_benefit ON plus_vip_level_benefit (benefit_id)",
        "CREATE INDEX idx_plus_vip_level_benefit_status ON plus_vip_level_benefit (status)",
        r#"CREATE TABLE plus_vip_pack_group (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            app_id INTEGER NOT NULL DEFAULT 0,
            scope_type INTEGER,
            scope_id INTEGER,
            group_key TEXT,
            name TEXT NOT NULL,
            description TEXT,
            sort_weight INTEGER,
            status INTEGER NOT NULL DEFAULT 1,
            remark TEXT,
            packs TEXT
        )"#,
        "CREATE UNIQUE INDEX uk_plus_vip_pack_group_scope_key ON plus_vip_pack_group (scope_type, scope_id, group_key)",
        "CREATE INDEX idx_plus_vip_pack_group_status ON plus_vip_pack_group (status)",
        "CREATE INDEX idx_plus_vip_pack_group_app ON plus_vip_pack_group (app_id)",
        "CREATE INDEX idx_plus_vip_pack_group_scope ON plus_vip_pack_group (scope_type, scope_id)",
        "CREATE INDEX idx_plus_vip_pack_group_sort ON plus_vip_pack_group (sort_weight)",
        r#"CREATE TABLE plus_vip_recharge_pack (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            app_id INTEGER NOT NULL DEFAULT 1,
            name TEXT NOT NULL,
            description TEXT,
            price TEXT NOT NULL,
            point_amount INTEGER NOT NULL,
            vip_duration_days INTEGER,
            status INTEGER NOT NULL,
            sort_weight INTEGER,
            valid_from TEXT,
            valid_to TEXT,
            remark TEXT,
            recharge_type INTEGER
        )"#,
        "CREATE INDEX idx_plus_vip_recharge_pack_status ON plus_vip_recharge_pack (status)",
        "CREATE INDEX idx_plus_vip_recharge_pack_app ON plus_vip_recharge_pack (app_id)",
        "CREATE INDEX idx_plus_vip_recharge_pack_sort ON plus_vip_recharge_pack (sort_weight)",
        r#"CREATE TABLE plus_vip_pack (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            app_id INTEGER NOT NULL DEFAULT 0,
            name TEXT NOT NULL,
            description TEXT,
            group_id INTEGER NOT NULL,
            vip_level_id INTEGER NOT NULL,
            price TEXT NOT NULL,
            point_amount INTEGER NOT NULL,
            vip_duration_days INTEGER,
            billing_cycle INTEGER,
            status INTEGER NOT NULL,
            sort_weight INTEGER,
            valid_from TEXT,
            valid_to TEXT,
            remark TEXT,
            recharge_pack_id INTEGER,
            point_reward_config TEXT,
            CONSTRAINT fk_plus_vip_pack_group_id FOREIGN KEY (group_id) REFERENCES plus_vip_pack_group (id),
            CONSTRAINT fk_plus_vip_pack_level_id FOREIGN KEY (vip_level_id) REFERENCES plus_vip_level (id),
            CONSTRAINT fk_plus_vip_pack_recharge_pack FOREIGN KEY (recharge_pack_id) REFERENCES plus_vip_recharge_pack (id)
        )"#,
        "CREATE UNIQUE INDEX uk_plus_vip_pack_group_level_cycle ON plus_vip_pack (group_id, vip_level_id, billing_cycle)",
        "CREATE INDEX idx_plus_vip_pack_status ON plus_vip_pack (status)",
        "CREATE INDEX idx_plus_vip_pack_app ON plus_vip_pack (app_id)",
        "CREATE INDEX idx_plus_vip_pack_group ON plus_vip_pack (group_id)",
        "CREATE INDEX idx_plus_vip_pack_level ON plus_vip_pack (vip_level_id)",
        "CREATE INDEX idx_plus_vip_pack_sort ON plus_vip_pack (sort_weight)",
        "CREATE INDEX idx_plus_vip_pack_recharge_pack ON plus_vip_pack (recharge_pack_id)",
        r#"CREATE TABLE plus_vip_user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            user_id INTEGER NOT NULL,
            vip_level_id INTEGER,
            status INTEGER NOT NULL,
            point_balance INTEGER NOT NULL,
            total_recharged_points INTEGER NOT NULL,
            valid_from TEXT,
            valid_to TEXT,
            last_active_time TEXT,
            remark TEXT,
            CONSTRAINT fk_plus_vip_user_user FOREIGN KEY (user_id) REFERENCES plus_user (id),
            CONSTRAINT fk_plus_vip_user_level FOREIGN KEY (vip_level_id) REFERENCES plus_vip_level (id)
        )"#,
        "CREATE UNIQUE INDEX uk_plus_vip_user_user_id ON plus_vip_user (user_id)",
        "CREATE INDEX idx_plus_vip_user_level ON plus_vip_user (vip_level_id)",
        "CREATE INDEX idx_plus_vip_user_status ON plus_vip_user (status)",
        r#"CREATE TABLE plus_vip_point_change (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            change_type INTEGER NOT NULL,
            change_amount INTEGER NOT NULL,
            before_balance INTEGER NOT NULL,
            after_balance INTEGER NOT NULL,
            source_id INTEGER,
            source_type TEXT,
            remark TEXT,
            CONSTRAINT fk_plus_vip_point_change_user FOREIGN KEY (user_id) REFERENCES plus_user (id)
        )"#,
        "CREATE INDEX idx_plus_vip_point_change_user ON plus_vip_point_change (user_id)",
        "CREATE INDEX idx_plus_vip_point_change_type ON plus_vip_point_change (change_type)",
        "CREATE INDEX idx_plus_vip_point_change_source ON plus_vip_point_change (source_type)",
        r#"CREATE TABLE plus_vip_benefit_usage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            user_id INTEGER NOT NULL,
            benefit_type INTEGER NOT NULL,
            usage_time TEXT NOT NULL,
            usage_count INTEGER NOT NULL,
            status INTEGER NOT NULL,
            source_id INTEGER,
            source_type TEXT,
            remark TEXT,
            CONSTRAINT fk_plus_vip_benefit_usage_user FOREIGN KEY (user_id) REFERENCES plus_user (id)
        )"#,
        "CREATE INDEX idx_plus_vip_benefit_usage_user ON plus_vip_benefit_usage (user_id)",
        "CREATE INDEX idx_plus_vip_benefit_usage_type ON plus_vip_benefit_usage (benefit_type)",
        "CREATE INDEX idx_plus_vip_benefit_usage_time ON plus_vip_benefit_usage (usage_time)",
        "CREATE INDEX idx_plus_vip_benefit_usage_status ON plus_vip_benefit_usage (status)",
        r#"CREATE TABLE plus_shop (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            user_id INTEGER,
            name TEXT NOT NULL,
            description TEXT,
            logo TEXT,
            cover TEXT,
            contact_phone TEXT,
            contact_email TEXT,
            location TEXT,
            address TEXT,
            license_number TEXT,
            tags TEXT,
            status INTEGER NOT NULL,
            business_hours TEXT,
            CONSTRAINT fk_plus_shop_user FOREIGN KEY (user_id) REFERENCES plus_user (id)
        )"#,
        "CREATE INDEX idx_plus_shop_user_id ON plus_shop (user_id)",
        "CREATE INDEX idx_plus_shop_status ON plus_shop (status)",
        "CREATE INDEX idx_plus_shop_tenant_org_status ON plus_shop (tenant_id, organization_id, status)",
        r#"CREATE TABLE plus_product (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            user_id INTEGER,
            title TEXT NOT NULL,
            code TEXT,
            subtitle TEXT,
            resources TEXT,
            price TEXT NOT NULL,
            original_price TEXT,
            stock INTEGER NOT NULL DEFAULT 0,
            sales_count INTEGER NOT NULL DEFAULT 0,
            status INTEGER NOT NULL,
            on_sale_at TEXT,
            description TEXT,
            tags TEXT,
            category_id INTEGER NOT NULL,
            base_attributes TEXT NOT NULL DEFAULT '{}',
            spec_attributes TEXT NOT NULL DEFAULT '{}',
            CONSTRAINT fk_plus_product_user FOREIGN KEY (user_id) REFERENCES plus_user (id)
        )"#,
        "CREATE UNIQUE INDEX uk_plus_product_code ON plus_product (code)",
        "CREATE INDEX idx_plus_product_user_id ON plus_product (user_id)",
        "CREATE INDEX idx_plus_product_category_id ON plus_product (category_id)",
        "CREATE INDEX idx_plus_product_status ON plus_product (status)",
        "CREATE INDEX idx_plus_product_tenant_org_status ON plus_product (tenant_id, organization_id, status)",
        "CREATE INDEX idx_plus_product_category_status ON plus_product (category_id, status, created_at)",
        r#"CREATE TABLE plus_sku (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            product_id INTEGER NOT NULL,
            sku_code TEXT NOT NULL,
            name TEXT NOT NULL,
            title TEXT,
            price TEXT NOT NULL,
            original_price TEXT,
            stock INTEGER NOT NULL DEFAULT 0,
            sales INTEGER,
            status INTEGER NOT NULL,
            image TEXT,
            specs TEXT,
            CONSTRAINT fk_plus_sku_product FOREIGN KEY (product_id) REFERENCES plus_product (id)
        )"#,
        "CREATE UNIQUE INDEX uk_plus_sku_sku_code ON plus_sku (sku_code)",
        "CREATE INDEX idx_plus_sku_product ON plus_sku (product_id)",
        "CREATE INDEX idx_plus_sku_product_status ON plus_sku (product_id, status)",
        r#"CREATE TABLE plus_shopping_cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            user_id INTEGER,
            owner INTEGER NOT NULL,
            owner_id INTEGER NOT NULL,
            name TEXT,
            description TEXT,
            group_list TEXT,
            status INTEGER,
            CONSTRAINT fk_plus_shopping_cart_user FOREIGN KEY (user_id) REFERENCES plus_user (id)
        )"#,
        "CREATE INDEX idx_plus_shopping_cart_user_id ON plus_shopping_cart (user_id)",
        "CREATE INDEX idx_plus_shopping_cart_owner ON plus_shopping_cart (owner, owner_id)",
        "CREATE INDEX idx_plus_shopping_cart_status ON plus_shopping_cart (status)",
        r#"CREATE TABLE plus_shopping_cart_item (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            cart_id INTEGER NOT NULL,
            cart_group_uuid TEXT NOT NULL,
            product_id INTEGER NOT NULL,
            sku_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price TEXT NOT NULL,
            is_selected INTEGER,
            CONSTRAINT fk_plus_shopping_cart_item_cart FOREIGN KEY (cart_id) REFERENCES plus_shopping_cart (id),
            CONSTRAINT fk_plus_shopping_cart_item_product FOREIGN KEY (product_id) REFERENCES plus_product (id),
            CONSTRAINT fk_plus_shopping_cart_item_sku FOREIGN KEY (sku_id) REFERENCES plus_sku (id)
        )"#,
        "CREATE UNIQUE INDEX uk_plus_shopping_cart_item_cart_sku ON plus_shopping_cart_item (cart_id, sku_id)",
        "CREATE INDEX idx_plus_shopping_cart_item_cart_id ON plus_shopping_cart_item (cart_id)",
        "CREATE INDEX idx_plus_shopping_cart_item_product_id ON plus_shopping_cart_item (product_id)",
        "CREATE INDEX idx_plus_shopping_cart_item_sku_id ON plus_shopping_cart_item (sku_id)",
        r#"CREATE TABLE plus_order (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            subject TEXT NOT NULL,
            order_type INTEGER NOT NULL,
            owner INTEGER,
            owner_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            order_sn TEXT NOT NULL,
            transaction_id TEXT,
            out_trade_no TEXT NOT NULL,
            total_amount TEXT NOT NULL,
            paid_amount TEXT NOT NULL,
            status INTEGER NOT NULL,
            category_id INTEGER NOT NULL,
            payment_expire_time TEXT,
            task_code TEXT,
            worker_user_id INTEGER,
            dispatcher_user_id INTEGER,
            pay_success_time TEXT,
            cancel_time TEXT,
            remark TEXT,
            refunded_amount TEXT,
            currency TEXT,
            payment_method TEXT,
            CONSTRAINT fk_plus_order_user FOREIGN KEY (user_id) REFERENCES plus_user (id),
            CONSTRAINT fk_plus_order_worker_user FOREIGN KEY (worker_user_id) REFERENCES plus_user (id),
            CONSTRAINT fk_plus_order_dispatcher_user FOREIGN KEY (dispatcher_user_id) REFERENCES plus_user (id)
        )"#,
        "CREATE UNIQUE INDEX uk_plus_order_order_sn ON plus_order (order_sn)",
        "CREATE UNIQUE INDEX uk_plus_order_out_trade_no ON plus_order (out_trade_no)",
        "CREATE INDEX idx_plus_order_user_id ON plus_order (user_id)",
        "CREATE INDEX idx_plus_order_status ON plus_order (status)",
        "CREATE INDEX idx_plus_order_status_payment_expire ON plus_order (status, payment_expire_time)",
        "CREATE INDEX idx_plus_order_task_code ON plus_order (task_code)",
        "CREATE INDEX idx_plus_order_worker_user_id ON plus_order (worker_user_id)",
        "CREATE INDEX idx_plus_order_tenant_org_status ON plus_order (tenant_id, organization_id, status)",
        r#"CREATE TABLE plus_order_item (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            order_id INTEGER NOT NULL,
            category_id INTEGER NOT NULL,
            product_type TEXT NOT NULL,
            product_id INTEGER NOT NULL,
            sku_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            unit_price TEXT NOT NULL,
            total_amount TEXT NOT NULL,
            expire_time TEXT,
            content_type INTEGER,
            content_id INTEGER,
            product_name TEXT,
            sku_spec TEXT,
            buyer_info TEXT,
            seller_info TEXT,
            discount_amount TEXT,
            paid_amount TEXT,
            refunded_amount TEXT,
            currency TEXT,
            product_image TEXT,
            refund_status INTEGER,
            review_status INTEGER,
            payment_provider INTEGER,
            payment_product_type TEXT,
            CONSTRAINT fk_plus_order_item_order FOREIGN KEY (order_id) REFERENCES plus_order (id),
            CONSTRAINT fk_plus_order_item_product FOREIGN KEY (product_id) REFERENCES plus_product (id),
            CONSTRAINT fk_plus_order_item_sku FOREIGN KEY (sku_id) REFERENCES plus_sku (id)
        )"#,
        "CREATE INDEX idx_plus_order_item_order_id ON plus_order_item (order_id)",
        "CREATE INDEX idx_plus_order_item_product_id ON plus_order_item (product_id)",
        "CREATE INDEX idx_plus_order_item_sku_id ON plus_order_item (sku_id)",
        r#"CREATE TABLE plus_payment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            subject TEXT,
            purpose TEXT NOT NULL,
            order_id INTEGER NOT NULL,
            transaction_id TEXT,
            out_trade_no TEXT NOT NULL,
            channel INTEGER NOT NULL,
            provider INTEGER NOT NULL,
            status INTEGER NOT NULL,
            amount TEXT NOT NULL,
            expire_time TEXT,
            success_time TEXT,
            remark TEXT,
            CONSTRAINT fk_plus_payment_order FOREIGN KEY (order_id) REFERENCES plus_order (id)
        )"#,
        "CREATE UNIQUE INDEX uk_plus_payment_out_trade_no ON plus_payment (out_trade_no)",
        "CREATE INDEX idx_plus_payment_status_expire ON plus_payment (status, expire_time)",
        "CREATE INDEX idx_plus_payment_order_status ON plus_payment (order_id, status)",
        "CREATE INDEX idx_plus_payment_provider_status ON plus_payment (provider, status)",
        r#"CREATE TABLE plus_refund (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            order_id INTEGER NOT NULL,
            payment_id INTEGER NOT NULL,
            out_refund_no TEXT NOT NULL,
            out_trade_no TEXT,
            refund_id TEXT,
            amount TEXT NOT NULL,
            channel INTEGER,
            provider INTEGER,
            type TEXT NOT NULL,
            status INTEGER NOT NULL,
            apply_time TEXT NOT NULL,
            complete_time TEXT,
            remark TEXT,
            operator_id INTEGER,
            CONSTRAINT fk_plus_refund_order FOREIGN KEY (order_id) REFERENCES plus_order (id),
            CONSTRAINT fk_plus_refund_payment FOREIGN KEY (payment_id) REFERENCES plus_payment (id)
        )"#,
        "CREATE UNIQUE INDEX uk_plus_refund_out_refund_no ON plus_refund (out_refund_no)",
        "CREATE INDEX idx_plus_refund_order_id ON plus_refund (order_id)",
        "CREATE INDEX idx_plus_refund_payment_id ON plus_refund (payment_id)",
        "CREATE INDEX idx_plus_refund_status ON plus_refund (status)",
        r#"CREATE TABLE plus_invoice (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            user_id INTEGER NOT NULL,
            order_count INTEGER NOT NULL DEFAULT 0,
            type INTEGER NOT NULL,
            status INTEGER NOT NULL,
            invoice_code TEXT,
            invoice_no TEXT,
            title TEXT,
            amount_excluding_tax TEXT NOT NULL,
            tax_amount TEXT NOT NULL,
            total_amount TEXT NOT NULL,
            currency TEXT,
            invoice_time TEXT,
            cancel_time TEXT,
            fail_reason TEXT,
            CONSTRAINT fk_plus_invoice_user FOREIGN KEY (user_id) REFERENCES plus_user (id)
        )"#,
        "CREATE INDEX idx_invoice_user ON plus_invoice (user_id)",
        "CREATE INDEX idx_invoice_status ON plus_invoice (status)",
        "CREATE INDEX idx_invoice_type ON plus_invoice (type)",
        "CREATE INDEX idx_invoice_code ON plus_invoice (invoice_code)",
        "CREATE INDEX idx_invoice_created ON plus_invoice (created_at)",
        r#"CREATE TABLE plus_invoice_item (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            invoice_id INTEGER NOT NULL,
            invoice_uuid TEXT NOT NULL,
            order_item_id INTEGER,
            product_id INTEGER,
            product_code TEXT,
            product_name TEXT NOT NULL,
            specification TEXT,
            unit TEXT,
            quantity TEXT NOT NULL DEFAULT '0',
            unit_price_excluding_tax TEXT NOT NULL DEFAULT '0',
            unit_price_including_tax TEXT NOT NULL DEFAULT '0',
            amount_excluding_tax TEXT NOT NULL DEFAULT '0',
            tax_amount TEXT NOT NULL DEFAULT '0',
            total_amount TEXT NOT NULL DEFAULT '0',
            tax_rate TEXT NOT NULL DEFAULT '0',
            tax_rate_code TEXT,
            tax_classification_code TEXT,
            product_type TEXT,
            product_category TEXT,
            brand_name TEXT,
            remark TEXT,
            sort_order INTEGER NOT NULL DEFAULT 0,
            CONSTRAINT fk_plus_invoice_item_invoice FOREIGN KEY (invoice_id) REFERENCES plus_invoice (id),
            CONSTRAINT fk_plus_invoice_item_order_item FOREIGN KEY (order_item_id) REFERENCES plus_order_item (id)
        )"#,
        "CREATE INDEX idx_invoice_item_invoice ON plus_invoice_item (invoice_id)",
        "CREATE INDEX idx_invoice_item_order_item ON plus_invoice_item (order_item_id)",
        "CREATE INDEX idx_invoice_item_created ON plus_invoice_item (created_at)",
        r#"CREATE TABLE plus_invoice_record (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            invoice_id INTEGER NOT NULL,
            invoice_uuid TEXT NOT NULL,
            operation_type INTEGER NOT NULL,
            before_status TEXT,
            after_status TEXT,
            invoice_code TEXT,
            invoice_no TEXT,
            amount_excluding_tax TEXT,
            tax_amount TEXT,
            total_amount TEXT,
            currency TEXT,
            third_party_invoice_id TEXT,
            operator_id INTEGER NOT NULL,
            operator_name TEXT,
            operator_type TEXT,
            operator_ip TEXT,
            result TEXT,
            result_message TEXT,
            error_code TEXT,
            error_message TEXT,
            request_data TEXT,
            response_data TEXT,
            remark TEXT,
            extra_data TEXT,
            CONSTRAINT fk_plus_invoice_record_invoice FOREIGN KEY (invoice_id) REFERENCES plus_invoice (id)
        )"#,
        "CREATE INDEX idx_invoice_record_invoice ON plus_invoice_record (invoice_id)",
        "CREATE INDEX idx_invoice_record_operation ON plus_invoice_record (operation_type)",
        "CREATE INDEX idx_invoice_record_created ON plus_invoice_record (created_at)",
        r#"CREATE TABLE commerce_usage_settlement (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL DEFAULT 1,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            version INTEGER NOT NULL DEFAULT 0,
            settlement_no TEXT,
            usage_fact_id INTEGER,
            account_id INTEGER,
            account_history_id INTEGER,
            order_id INTEGER,
            payment_id INTEGER,
            asset_type INTEGER,
            direction INTEGER,
            amount TEXT,
            points INTEGER,
            tokens INTEGER,
            currency TEXT,
            settlement_status INTEGER,
            settled_at TEXT,
            failure_code TEXT,
            failure_message TEXT
        )"#,
        r#"CREATE TABLE commerce_usage_statement (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL DEFAULT 1,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            version INTEGER NOT NULL DEFAULT 0,
            statement_no TEXT,
            period TEXT,
            period_start TEXT,
            period_end TEXT,
            owner_type INTEGER,
            owner_id INTEGER,
            total_tokens INTEGER,
            total_requests INTEGER,
            total_cost TEXT,
            currency TEXT,
            statement_status INTEGER,
            generated_at TEXT,
            due_at TEXT,
            paid_at TEXT,
            payment_status INTEGER,
            invoice_id INTEGER,
            export_id INTEGER
        )"#,
        r#"CREATE TABLE plus_role (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT,
            v INTEGER NOT NULL DEFAULT 0,
            code TEXT NOT NULL,
            name TEXT,
            status INTEGER NOT NULL DEFAULT 1
        )"#,
        r#"CREATE TABLE plus_user_role (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            role_id INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT,
            operator_id INTEGER
        )"#,
        r#"CREATE TABLE plus_order_worker_dispatch_profile (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            user_id INTEGER NOT NULL,
            rating_level TEXT,
            enabled INTEGER NOT NULL DEFAULT 1,
            global_max_in_progress INTEGER NOT NULL DEFAULT 1,
            metadata TEXT NOT NULL DEFAULT '{}',
            CONSTRAINT fk_order_worker_dispatch_profile_user FOREIGN KEY (user_id) REFERENCES plus_user (id)
        )"#,
        "CREATE UNIQUE INDEX uk_order_worker_dispatch_profile_user_id ON plus_order_worker_dispatch_profile (user_id)",
        "CREATE INDEX idx_order_worker_dispatch_profile_enabled ON plus_order_worker_dispatch_profile (enabled)",
        "CREATE INDEX idx_order_worker_dispatch_profile_rating_level ON plus_order_worker_dispatch_profile (rating_level)",
        r#"CREATE TABLE iam_user_login_event (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            request_id TEXT,
            auth_method INTEGER,
            auth_provider TEXT,
            login_result INTEGER,
            risk_level INTEGER,
            failure_reason_code TEXT,
            client_ip_hash TEXT,
            client_ip_masked TEXT,
            client_ip_region TEXT,
            device_fingerprint_hash TEXT,
            device_label TEXT,
            user_agent_hash TEXT,
            mfa_verified INTEGER,
            session_id_hash TEXT,
            occurred_at TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )"#,
        r#"CREATE TABLE plus_coupon_template (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            name TEXT NOT NULL,
            template_code TEXT,
            type INTEGER NOT NULL,
            description TEXT,
            amount INTEGER,
            discount TEXT,
            min_consume INTEGER,
            start_time TEXT,
            end_time TEXT,
            total INTEGER,
            get_limit INTEGER,
            received_count INTEGER,
            used_count INTEGER,
            status INTEGER,
            validity_type INTEGER,
            validity_days INTEGER,
            can_share INTEGER,
            stackable INTEGER,
            scope_type INTEGER,
            scope_value TEXT
        )"#,
        "CREATE UNIQUE INDEX uk_plus_coupon_template_code ON plus_coupon_template (template_code)",
        "CREATE INDEX idx_plus_coupon_template_status ON plus_coupon_template (status)",
        "CREATE INDEX idx_plus_coupon_template_type ON plus_coupon_template (type)",
        "CREATE INDEX idx_plus_coupon_template_time_window ON plus_coupon_template (start_time, end_time)",
        "CREATE INDEX idx_plus_coupon_template_tenant_org_status ON plus_coupon_template (tenant_id, organization_id, status)",
        r#"CREATE TABLE plus_coupon (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            name TEXT NOT NULL,
            redeem_code TEXT,
            point_cost INTEGER,
            type INTEGER NOT NULL,
            description TEXT,
            amount INTEGER,
            discount TEXT,
            min_consume INTEGER,
            start_time TEXT,
            end_time TEXT,
            total INTEGER,
            get_limit INTEGER,
            received_count INTEGER,
            used_count INTEGER,
            status INTEGER NOT NULL,
            stackable INTEGER NOT NULL DEFAULT 0,
            scope_type INTEGER NOT NULL,
            scope_value TEXT
        )"#,
        "CREATE UNIQUE INDEX uk_plus_coupon_redeem_code ON plus_coupon (redeem_code)",
        "CREATE INDEX idx_plus_coupon_status ON plus_coupon (status)",
        "CREATE INDEX idx_plus_coupon_type ON plus_coupon (type)",
        "CREATE INDEX idx_plus_coupon_tenant_org_status ON plus_coupon (tenant_id, organization_id, status)",
        r#"CREATE TABLE plus_user_coupon (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            user_id INTEGER,
            coupon_id INTEGER NOT NULL,
            coupon_code TEXT NOT NULL,
            acquire_at TEXT NOT NULL,
            acquire_request_no TEXT,
            acquire_type INTEGER NOT NULL,
            point_cost INTEGER,
            points_refunded INTEGER NOT NULL DEFAULT 0,
            points_refund_at TEXT,
            use_at TEXT,
            expire_at TEXT,
            status INTEGER NOT NULL,
            order_id INTEGER,
            can_shared INTEGER NOT NULL DEFAULT 0,
            CONSTRAINT fk_plus_user_coupon_coupon FOREIGN KEY (coupon_id) REFERENCES plus_coupon (id),
            CONSTRAINT fk_plus_user_coupon_user FOREIGN KEY (user_id) REFERENCES plus_user (id),
            CONSTRAINT fk_plus_user_coupon_order FOREIGN KEY (order_id) REFERENCES plus_order (id)
        )"#,
        "CREATE UNIQUE INDEX uk_plus_user_coupon_code ON plus_user_coupon (coupon_code)",
        "CREATE UNIQUE INDEX uk_plus_user_coupon_acquire_request_no ON plus_user_coupon (user_id, acquire_request_no)",
        "CREATE INDEX idx_plus_user_coupon_coupon_id ON plus_user_coupon (coupon_id)",
        "CREATE INDEX idx_plus_user_coupon_user_status ON plus_user_coupon (user_id, status)",
        "CREATE INDEX idx_plus_user_coupon_expire_at ON plus_user_coupon (expire_at)",
        r#"CREATE TABLE plus_vip_recharge_method (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            name TEXT NOT NULL,
            description TEXT,
            method_key TEXT NOT NULL,
            status INTEGER NOT NULL,
            sort_weight INTEGER,
            remark TEXT
        )"#,
        "CREATE UNIQUE INDEX uk_plus_vip_recharge_method_key ON plus_vip_recharge_method (method_key)",
        "CREATE INDEX idx_plus_vip_recharge_method_status ON plus_vip_recharge_method (status)",
        "CREATE INDEX idx_plus_vip_recharge_method_sort ON plus_vip_recharge_method (sort_weight)",
        r#"CREATE TABLE plus_vip_recharge (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL DEFAULT 0,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            user_id INTEGER NOT NULL,
            vip_level_id INTEGER,
            amount TEXT NOT NULL,
            point_amount INTEGER NOT NULL,
            recharge_type INTEGER NOT NULL,
            recharge_time TEXT NOT NULL,
            transaction_no TEXT,
            status INTEGER NOT NULL,
            remark TEXT,
            recharge_method_id INTEGER,
            recharge_pack_id INTEGER,
            CONSTRAINT fk_plus_vip_recharge_user FOREIGN KEY (user_id) REFERENCES plus_user (id),
            CONSTRAINT fk_plus_vip_recharge_level FOREIGN KEY (vip_level_id) REFERENCES plus_vip_level (id),
            CONSTRAINT fk_plus_vip_recharge_method FOREIGN KEY (recharge_method_id) REFERENCES plus_vip_recharge_method (id),
            CONSTRAINT fk_plus_vip_recharge_pack FOREIGN KEY (recharge_pack_id) REFERENCES plus_vip_recharge_pack (id)
        )"#,
        "CREATE INDEX idx_plus_vip_recharge_user ON plus_vip_recharge (user_id)",
        "CREATE INDEX idx_plus_vip_recharge_level ON plus_vip_recharge (vip_level_id)",
        "CREATE INDEX idx_plus_vip_recharge_status ON plus_vip_recharge (status)",
        "CREATE INDEX idx_plus_vip_recharge_time ON plus_vip_recharge (recharge_time)",
        "CREATE INDEX idx_plus_vip_recharge_transaction ON plus_vip_recharge (transaction_no)",
        r#"CREATE TABLE iam_gateway_api_key_group (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'seed-api-key-group',
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            code TEXT NOT NULL,
            name TEXT,
            description TEXT,
            provider_code TEXT,
            group_type INTEGER,
            environment INTEGER,
            pricing_plan_id INTEGER,
            pricing_plan_code TEXT NOT NULL,
            price_reference_mode INTEGER,
            billing_type INTEGER,
            capacity_limit TEXT,
            allowed_origin TEXT,
            metadata TEXT,
            rate_multiplier TEXT NOT NULL,
            official_price_multiplier TEXT NOT NULL,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            deleted_by INTEGER,
            updated_at TEXT
        )"#,
        r#"CREATE TABLE iam_gateway_api_key (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'seed-api-key',
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            group_id INTEGER NOT NULL,
            name TEXT,
            key_prefix TEXT NOT NULL,
            key_display_masked TEXT,
            key_hash TEXT NOT NULL,
            hash_alg TEXT NOT NULL DEFAULT 'HMAC_SHA256',
            secret_version INTEGER NOT NULL DEFAULT 1,
            idempotency_key TEXT NOT NULL,
            policy_id INTEGER,
            quota_policy_id INTEGER,
            rate_limit_policy_id INTEGER,
            status INTEGER NOT NULL,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            deleted_at TEXT,
            revoked_at TEXT,
            revoked_by INTEGER,
            expire_at TEXT,
            last_used_at TEXT,
            last_revealed_at TEXT,
            updated_at TEXT
        )"#,
        r#"CREATE TABLE iam_gateway_access_policy (
            id INTEGER PRIMARY KEY,
            allowed_capabilities TEXT,
            ip_allowlist TEXT,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            effective_from TEXT,
            effective_to TEXT,
            updated_at TEXT
        )"#,
        r#"CREATE TABLE ai_quota_policy (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'seed-quota-policy',
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            policy_code TEXT,
            name TEXT,
            subject_type INTEGER,
            subject_id INTEGER,
            subject_ref_hash TEXT,
            subject_ref_masked TEXT,
            scope_type INTEGER,
            scope_id INTEGER,
            group_id INTEGER,
            model TEXT,
            quota_period INTEGER,
            quota_unit INTEGER,
            quota_limit TEXT,
            requests_per_second INTEGER,
            requests_per_minute INTEGER,
            requests_per_day INTEGER,
            tokens_per_minute INTEGER,
            burst_limit TEXT,
            block_duration_seconds INTEGER,
            reset_mode INTEGER,
            exhausted_at TEXT,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            deleted_by INTEGER,
            effective_from TEXT,
            effective_to TEXT,
            updated_at TEXT
        )"#,
        r#"CREATE TABLE iam_gateway_api_key_group_metric_snapshot (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'seed-group-metric',
            tenant_id INTEGER,
            organization_id INTEGER,
            provider_code TEXT,
            group_id INTEGER NOT NULL,
            account_available_count INTEGER,
            account_total_count INTEGER,
            capacity_used TEXT,
            capacity_limit TEXT,
            usage_amount_today TEXT,
            usage_amount_total TEXT,
            snapshot_at TEXT,
            health_status INTEGER,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            status INTEGER NOT NULL
        )"#,
        r#"CREATE TABLE iam_gateway_risk_rule (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT NOT NULL DEFAULT '{}',
            rule_name TEXT,
            rule_category INTEGER,
            rule_type INTEGER,
            scope_type INTEGER,
            scope_id INTEGER,
            target_type INTEGER,
            target_value TEXT,
            target_value_hash TEXT,
            target_value_masked TEXT,
            target_value_cipher_ref TEXT,
            match_mode INTEGER,
            reason TEXT,
            action INTEGER,
            priority INTEGER,
            requests_per_second INTEGER,
            requests_per_minute INTEGER,
            requests_per_day INTEGER,
            tokens_per_minute INTEGER,
            burst_limit TEXT,
            block_duration_seconds INTEGER,
            effective_from TEXT,
            effective_to TEXT,
            hit_count INTEGER,
            last_hit_at TEXT
        )"#,
        r#"CREATE TABLE ai_pricing_plan_binding (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
            status INTEGER NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            pricing_plan_id INTEGER NOT NULL,
            pricing_plan_code TEXT,
            subject_type INTEGER NOT NULL,
            subject_id INTEGER NOT NULL,
            subject_code TEXT,
            binding_source INTEGER,
            multiplier_override TEXT,
            priority INTEGER,
            effective_from TEXT,
            effective_to TEXT
        )"#,
        r#"CREATE TABLE ai_model_pricing (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            model_id INTEGER,
            catalog_key TEXT,
            model TEXT NOT NULL,
            vendor_code TEXT,
            region_code TEXT,
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
        r#"CREATE TABLE ai_model_capability (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT,
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            deleted_at TEXT,
            model_id INTEGER,
            model TEXT,
            vendor_code TEXT,
            capability INTEGER,
            capability_code TEXT,
            modality INTEGER,
            input_modalities TEXT,
            output_modalities TEXT,
            supported INTEGER,
            schema_version TEXT,
            sort_order INTEGER
        )"#,
        r#"CREATE TABLE ai_pricing_import_snapshot (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER,
            organization_id INTEGER,
            user_id INTEGER,
            request_id TEXT,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            metadata TEXT NOT NULL DEFAULT '{}',
            import_source INTEGER,
            source_name TEXT,
            source_hash TEXT,
            data_format TEXT,
            row_count INTEGER,
            accepted_count INTEGER,
            rejected_count INTEGER,
            currency TEXT,
            observed_at TEXT
        )"#,
        r#"CREATE TABLE content_announcement (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT NOT NULL DEFAULT '{}',
            title TEXT,
            content TEXT,
            target_scope INTEGER,
            audience_filter TEXT,
            announcement_type INTEGER,
            pinned INTEGER,
            published_at TEXT,
            effective_from TEXT,
            effective_to TEXT
        )"#,
        r#"CREATE TABLE ops_gateway_instance (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT NOT NULL DEFAULT '{}',
            instance_code TEXT,
            deployment_mode INTEGER,
            region TEXT,
            cell TEXT,
            version_name TEXT,
            host_name TEXT,
            ip_address_hash TEXT,
            ip_address_masked TEXT,
            node_name TEXT,
            pod_name TEXT,
            container_id_hash TEXT,
            desktop_device_hash TEXT,
            runtime_type INTEGER,
            orchestrator INTEGER,
            started_at TEXT,
            last_heartbeat_at TEXT,
            health_status INTEGER,
            config_hash TEXT
        )"#,
        r#"CREATE TABLE ops_gateway_heartbeat (
            id INTEGER PRIMARY KEY,
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
            legal_hold INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            instance_id INTEGER,
            heartbeat_at TEXT,
            cpu_percent TEXT,
            memory_percent TEXT,
            disk_percent TEXT,
            network_in_bytes INTEGER,
            network_out_bytes INTEGER,
            active_connections INTEGER,
            uptime_seconds INTEGER,
            open_file_count INTEGER,
            thread_count INTEGER,
            payload TEXT
        )"#,
        r#"CREATE TABLE ops_alert_event (
            id INTEGER PRIMARY KEY,
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
            legal_hold INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            alert_no TEXT,
            severity INTEGER,
            source TEXT,
            title TEXT,
            message TEXT,
            alert_status INTEGER,
            first_seen_at TEXT,
            last_seen_at TEXT,
            resolved_at TEXT,
            resolved_by INTEGER
        )"#,
        r#"CREATE TABLE ops_metric_snapshot (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER,
            organization_id INTEGER,
            source_type TEXT,
            source_id INTEGER,
            source_version INTEGER,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            rebuild_version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            metric_scope INTEGER,
            metric_name TEXT,
            metric_period INTEGER,
            period_start TEXT,
            period_end TEXT,
            dimension_key TEXT,
            dimension_value TEXT,
            metric_value TEXT,
            metric_unit TEXT,
            payload TEXT
        )"#,
        r#"CREATE TABLE ops_coupon_issue_batch (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER,
            organization_id INTEGER,
            data_scope INTEGER,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT NOT NULL DEFAULT '{}',
            coupon_id INTEGER,
            coupon_template_id INTEGER,
            batch_no TEXT,
            campaign_code TEXT,
            name TEXT,
            code_prefix TEXT,
            code_pattern TEXT,
            requested_count INTEGER,
            generated_count INTEGER,
            available_count INTEGER,
            claimed_count INTEGER,
            used_count INTEGER,
            voided_count INTEGER,
            generation_status INTEGER,
            audience_filter TEXT,
            expire_at TEXT,
            generated_at TEXT,
            created_by INTEGER
        )"#,
        r#"CREATE TABLE ops_referral_stat_snapshot (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER,
            organization_id INTEGER,
            source_type TEXT,
            source_id INTEGER,
            source_version INTEGER,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            rebuild_version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            inviter_user_id INTEGER,
            inviter_name_snapshot TEXT,
            inviter_email_snapshot TEXT,
            invitation_code_id INTEGER,
            invitation_code TEXT,
            invite_link TEXT,
            snapshot_period TEXT,
            period_start TEXT,
            period_end TEXT,
            total_invited_count INTEGER,
            direct_invited_count INTEGER,
            secondary_invited_count INTEGER,
            paid_invitee_count INTEGER,
            total_revenue_amount TEXT,
            reward_awarded_amount TEXT,
            reward_pending_amount TEXT,
            currency TEXT,
            snapshot_at TEXT
        )"#,
        r#"CREATE TABLE ops_audit_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER,
            organization_id INTEGER,
            request_id TEXT,
            trace_id TEXT,
            operator_id INTEGER,
            action TEXT,
            target_type INTEGER,
            target_id INTEGER,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            retention_until TEXT,
            legal_hold INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            operator_type INTEGER,
            operator_name_snapshot TEXT,
            target_uuid TEXT,
            client_ip_hash TEXT,
            user_agent_hash TEXT,
            before_hash TEXT,
            after_hash TEXT,
            change_summary TEXT,
            risk_level INTEGER,
            approval_id INTEGER
        )"#,
        r#"CREATE TABLE ops_config_snapshot (
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
            legal_hold INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            snapshot_no TEXT,
            config_scope INTEGER,
            config_type INTEGER,
            source_table TEXT,
            source_ids TEXT,
            config_payload TEXT,
            config_hash TEXT,
            published_at TEXT,
            published_by INTEGER,
            rollback_from_snapshot_id INTEGER
        )"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_catalog(pool: &SqlitePool) {
    for statement in [
        "INSERT INTO ai_model_vendor (id, vendor_code, display_name, status, sort_order) VALUES (1, 'openai', 'OpenAI', 1, 1)",
        r#"INSERT INTO ai_model
            (id, catalog_key, model, display_name, vendor_code, region_code, capabilities, status, rank_score)
            VALUES (1, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 'GPT-4o mini', 'openai', 'global', '["chat"]', 1, '100.0')"#,
        "INSERT INTO integration_provider (id, provider_code, base_url_template, status) VALUES (2, 'openrouter', 'http://provider-proxy.internal/openrouter-template', 1)",
        "INSERT INTO integration_provider_account (id, provider_code, secret_ref, status) VALUES (9002, 'openrouter', 'vault://providers/openrouter/account/main', 1)",
        "INSERT INTO integration_channel (id, provider_code, base_url_override, account_id, status, priority, weight) VALUES (3001, 'openrouter', 'http://provider-proxy.internal/openrouter', 9002, 1, 10, 100)",
        "INSERT INTO integration_channel_model (id, catalog_key, model, channel_id, vendor_code, provider_model, status) VALUES (1, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 3001, 'openai', 'openai/global/gpt-4o-mini', 1)",
        "INSERT INTO ai_pricing_plan (id, plan_code, base_price_side, default_multiplier, default_markup_amount, currency, status, priority) VALUES (1, 'standard', 1, '1.200000', '0.000000', 'USD', 1, 1)",
        "INSERT INTO iam_gateway_api_key_group (id, code, pricing_plan_code, rate_multiplier, official_price_multiplier, status) VALUES (10, 'standard-group', 'standard', '1.000000', '1.100000', 1)",
        "INSERT INTO iam_gateway_api_key (id, tenant_id, organization_id, user_id, group_id, key_prefix, key_hash, idempotency_key, status) VALUES (100, 10, 20, 30, 10, 'sk-test', 'hash:sk-test', 'seed-api-key-100', 1)",
        "INSERT INTO ai_model_pricing (id, catalog_key, model, vendor_code, region_code, price_side, billing_meter_code, unit_price, currency, status, priority) VALUES (1, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 'openai', 'global', 1, 'llm_input_token', '0.150000', 'USD', 1, 1)",
        "INSERT INTO ai_model_pricing (id, catalog_key, model, vendor_code, region_code, price_side, billing_meter_code, unit_price, currency, provider_code, channel_id, status, priority) VALUES (2, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 'openai', 'global', 2, 'llm_input_token', '0.110000', 'USD', 'openrouter', 3001, 1, 1)",
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_admin_users(pool: &SqlitePool) {
    for statement in [
        r#"INSERT INTO plus_user
            (id, uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, username, nickname, password, platform, type, email, status)
            VALUES (30, 'user-30', 10, 20, 1, '2026-04-01 08:00:00', '2026-04-29 08:30:00', 0, 'owner', 'Owner', '', 0, 1, 'owner@example.com', 1)"#,
        r#"INSERT INTO plus_account
            (id, uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, user_id, account_type, owner, owner_id, available_balance, frozen_balance, available_points, frozen_points, token_balance, frozen_token, status)
            VALUES (400, 'account-400', 10, 20, 1, '2026-04-01 08:00:00', '2026-04-29 08:30:00', 0, 30, 1, 1, 30, '25.5000', '0', 0, 0, 0, 0, 1)"#,
        r#"INSERT INTO plus_role
            (id, uuid, created_at, updated_at, v, code, name, status)
            VALUES (1, 'role-admin', '2026-04-01 08:00:00', '2026-04-01 08:00:00', 0, 'admin', 'Admin', 1)"#,
        r#"INSERT INTO plus_user_role
            (id, user_id, role_id, created_at, updated_at, operator_id)
            VALUES (1, 30, 1, '2026-04-01 08:00:00', '2026-04-01 08:00:00', 30)"#,
        r#"INSERT INTO iam_user_login_event
            (id, uuid, tenant_id, organization_id, user_id, request_id, auth_method, auth_provider, login_result, risk_level, mfa_verified, session_id_hash, occurred_at, created_at)
            VALUES (1, 'login-30', 10, 20, 30, 'request-login-30', 2, 'trusted-subject-exchange', 1, 0, 1, 'session-hash-30', '2026-04-29 09:00:00', '2026-04-29 08:59:00')"#,
        r#"UPDATE iam_gateway_api_key
            SET name = 'Production',
                key_display_masked = 'sk-test********ABCD',
                last_used_at = '2026-04-29 09:05:00',
                updated_at = '2026-04-29 09:05:00'
            WHERE id = 100"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_admin_marketing(pool: &SqlitePool) {
    for statement in [
        r#"INSERT INTO plus_coupon_template
            (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, name, template_code, type, description, amount, discount, min_consume, total, get_limit, received_count, used_count, status, validity_type, validity_days, can_share, stackable, scope_type, scope_value)
            VALUES (1, 'coupon-template-1', '2026-04-01 08:00:00', '2026-04-29 08:00:00', 0, 10, 20, 1, 'Welcome template', 'welcome-template', 1, '', 500, 0, 0, 100, 1, 2, 1, 1, 1, 0, 0, 0, 1, '')"#,
        r#"INSERT INTO plus_coupon
            (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, name, redeem_code, point_cost, type, description, amount, discount, min_consume, total, get_limit, received_count, used_count, status, stackable, scope_type, scope_value)
            VALUES (1, 'coupon-1', '2026-04-01 08:00:00', '2026-04-29 08:00:00', 0, 10, 20, 1, 'Welcome credit', 'WELCOME', 0, 1, '', 500, 0, 0, 100, 1, 2, 1, 1, 0, 1, '')"#,
        r#"INSERT INTO ops_coupon_issue_batch
            (id, uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, coupon_id, coupon_template_id, batch_no, campaign_code, name, code_prefix, code_pattern, requested_count, generated_count, available_count, claimed_count, used_count, voided_count, generation_status, audience_filter, generated_at, created_by)
            VALUES (11, 'batch-11', 10, 20, 1, 1, '2026-04-29 09:00:00', '2026-04-29 09:00:00', 0, 1, 1, 'WELCOME-batch', 'WELCOME-batch', 'Welcome batch', 'WELCOME', 'WELCOME-{sequence:04}', 2, 2, 1, 0, 1, 0, 2, '{}', '2026-04-29 09:00:00', 30)"#,
        r#"INSERT INTO plus_user_coupon
            (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, user_id, coupon_id, coupon_code, acquire_at, acquire_request_no, acquire_type, point_cost, points_refunded, use_at, expire_at, status, order_id, can_shared)
            VALUES (501, 'user-coupon-501', '2026-04-29 09:00:00', '2026-04-29 09:00:00', 0, 10, 20, 1, NULL, 1, 'WELCOME-0001', '2026-04-29 09:00:00', 'WELCOME-501', 20, 0, 0, NULL, NULL, 1, NULL, 0)"#,
        r#"INSERT INTO plus_user_coupon
            (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, user_id, coupon_id, coupon_code, acquire_at, acquire_request_no, acquire_type, point_cost, points_refunded, use_at, expire_at, status, order_id, can_shared)
            VALUES (502, 'user-coupon-502', '2026-04-29 09:00:00', '2026-04-29 09:30:00', 0, 10, 20, 1, 30, 1, 'WELCOME-0002', '2026-04-29 09:00:00', 'WELCOME-502', 20, 0, 0, '2026-04-29 09:30:00', NULL, 3, NULL, 0)"#,
        r#"INSERT INTO plus_vip_recharge_method
            (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, name, description, method_key, status, sort_weight, remark)
            VALUES (1, 'recharge-method-1', '2026-04-01 08:00:00', '2026-04-01 08:00:00', 0, 10, 20, 1, 'Stripe', '', 'stripe', 1, 1, '')"#,
        r#"INSERT INTO plus_vip_recharge
            (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, user_id, vip_level_id, amount, point_amount, recharge_type, recharge_time, transaction_no, status, remark, recharge_method_id, recharge_pack_id)
            VALUES (701, 'recharge-701', '2026-04-29 10:00:00', '2026-04-29 10:00:00', 0, 10, 20, 1, 30, NULL, '10.00', 1000, 1, '2026-04-29 10:00:00', 'recharge-100', 1, '', 1, NULL)"#,
        r#"INSERT INTO plus_vip_recharge_pack
            (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, app_id, name, description, price, point_amount, vip_duration_days, status, sort_weight, valid_from, valid_to, remark, recharge_type)
            VALUES (801, 'recharge-pack-801', '2026-04-29 10:00:00', '2026-04-29 10:00:00', 0, 10, 20, 1, 1, 'Starter Recharge Pack', '', '10.00', 25, NULL, 1, 1, NULL, NULL, '', 2)"#,
        r#"INSERT INTO ops_referral_stat_snapshot
            (id, uuid, tenant_id, organization_id, source_type, source_id, source_version, status, created_at, updated_at, rebuild_version, metadata, inviter_user_id, inviter_name_snapshot, inviter_email_snapshot, invitation_code_id, invitation_code, invite_link, snapshot_period, period_start, period_end, total_invited_count, direct_invited_count, secondary_invited_count, paid_invitee_count, total_revenue_amount, reward_awarded_amount, reward_pending_amount, currency, snapshot_at)
            VALUES (801, 'referral-801', 10, 20, 'daily', 30, 1, 1, '2026-04-29 10:00:00', '2026-04-29 10:00:00', 0, '{}', 30, 'Owner', 'owner@example.com', 1, 'OWNER', 'https://claw.local/invite/OWNER', 'daily', '2026-04-29 00:00:00', '2026-04-29 23:59:59', 3, 2, 1, 1, '120.00', '12.00', '1.00', 'USD', '2026-04-29 10:00:00')"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_admin_finance(pool: &SqlitePool) {
    for statement in [
        r#"INSERT INTO plus_order
            (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, subject, order_type, owner, owner_id, user_id, order_sn, transaction_id, out_trade_no, total_amount, paid_amount, status, category_id, pay_success_time, remark, refunded_amount, currency, payment_method)
            VALUES (900, 'order-900', '2026-04-29 09:00:00', '2026-04-29 09:10:00', 0, 10, 20, 1, 'Recharge order', 1, 1, 30, 30, 'ORDER-900', 'pay-txn-900', 'order-900', '25.50', '25.50', 2, 1, '2026-04-29 09:10:00', 'Wallet recharge', '0.00', 'USD', 'stripe')"#,
        r#"INSERT INTO plus_payment
            (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, subject, purpose, order_id, transaction_id, out_trade_no, channel, provider, status, amount, success_time, remark)
            VALUES (910, 'payment-910', '2026-04-29 09:00:00', '2026-04-29 09:10:00', 0, 10, 20, 1, 'Recharge payment', 'POINTS', 900, 'pay-txn-900', 'order-900', 1, 7, 2, '25.50', '2026-04-29 09:10:00', 'Payment success')"#,
        r#"INSERT INTO plus_refund
            (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, order_id, payment_id, out_refund_no, out_trade_no, refund_id, amount, channel, provider, type, status, apply_time, complete_time, remark, operator_id)
            VALUES (920, 'refund-920', '2026-04-29 08:50:00', '2026-04-29 08:55:00', 0, 10, 20, 1, 900, 910, 'refund-920', 'order-900', 'refund-txn-920', '5.00', 1, 7, 'FULL', 2, '2026-04-29 08:50:00', '2026-04-29 08:55:00', 'Refund completed', 30)"#,
        r#"INSERT INTO plus_account_history
            (id, uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, account_type, asset_type, account_id, transaction_id, transaction_type, amount, balance_before, balance_after, points_change, points_before, points_after, source_type, source_id, status, usage_result, remarks)
            VALUES (1000, 'ledger-1000', 10, 20, 1, '2026-04-29 09:10:00', '2026-04-29 09:10:00', 0, 1, 1, 400, 'pay-txn-900', 1, '25.50', '100.00', '125.50', 0, 0, 0, 1, '900', 2, '{}', 'Payment success')"#,
        r#"INSERT INTO plus_account_history
            (id, uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, account_type, asset_type, account_id, transaction_id, transaction_type, amount, balance_before, balance_after, points_change, points_before, points_after, source_type, source_id, status, usage_result, remarks)
            VALUES (1001, 'ledger-1001', 10, 20, 1, '2026-04-29 08:55:00', '2026-04-29 08:55:00', 0, 1, 1, 400, 'refund-txn-920', 3, '-5.00', '125.50', '120.50', 0, 0, 0, 1, '920', 2, '{}', 'Refund completed')"#,
        r#"INSERT INTO plus_vip_point_change
            (id, uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, user_id, change_type, change_amount, before_balance, after_balance, source_id, source_type, remark)
            VALUES (1100, 'vip-point-1100', 10, 20, 1, '2026-04-29 08:40:00', '2026-04-29 08:40:00', 0, 30, 2, -1200, 5000, 3800, 900, 'USAGE', 'Token consumption')"#,
        r#"INSERT INTO plus_invoice
            (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, user_id, order_count, type, status, invoice_code, invoice_no, title, amount_excluding_tax, tax_amount, total_amount, currency, invoice_time)
            VALUES (1200, 'invoice-1200', '2026-04-29 10:00:00', '2026-04-29 10:00:00', 0, 10, 20, 1, 30, 1, 1, 1, 'INV', 'INV-202604', 'April usage', '80.00', '8.25', '88.25', 'USD', '2026-04-29 10:00:00')"#,
        r#"INSERT INTO commerce_usage_statement
            (id, uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, statement_no, period, period_start, period_end, owner_type, owner_id, total_tokens, total_requests, total_cost, currency, statement_status, generated_at, due_at, payment_status, invoice_id)
            VALUES (1300, 'statement-1300', 10, 20, 1, 1, '2026-04-29 10:00:00', '2026-04-29 10:00:00', 0, 'stmt-202604', '2026-04', '2026-04-01 00:00:00', '2026-04-30 23:59:59', 1, 30, 12000, 80, '88.25', 'USD', 1, '2026-04-29 10:00:00', '2026-05-10 00:00:00', 1, 1200)"#,
        r#"INSERT INTO commerce_usage_settlement
            (id, uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, settlement_no, account_id, account_history_id, order_id, payment_id, asset_type, direction, amount, points, tokens, currency, settlement_status, settled_at)
            VALUES (1400, 'settlement-1400', 10, 20, 1, 1, '2026-04-29 10:00:00', '2026-04-29 10:00:00', 0, 'settlement-1400', 400, 1000, 900, 910, 1, 2, '88.25', 0, 12000, 'USD', 1, '2026-04-29 10:00:00')"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_admin_record(pool: &SqlitePool) {
    for statement in [
        r#"INSERT INTO ai_routing_decision_log
            (id, uuid, tenant_id, organization_id, user_id, request_id, status, created_at, requested_model, resolved_model)
            VALUES (100, 'decision-100', 10, 20, 30, 'req-admin-record-1', 1, '2026-04-29 09:30:00', 'gpt-4o-mini', 'gpt-4o-mini')"#,
        r#"INSERT INTO ai_request_trace
            (id, uuid, tenant_id, organization_id, user_id, request_id, trace_id, status, created_at, api_key_name_snapshot, api_key_group_snapshot, owner_name_snapshot, requested_model, provider_model, endpoint, request_path, http_status, provider_error_code, error_type, started_at, latency_ms, ttft_ms, streaming, prompt_tokens, completion_tokens, cached_tokens, reasoning_effort, client_ip_masked)
            VALUES (100, 'trace-100', 10, 20, 30, 'req-admin-record-1', 'trace-admin-record-1', 1, '2026-04-29 09:29:59', 'Production', 'standard-group', 'owner@example.com', 'gpt-4o-mini', 'openai/global/gpt-4o-mini', '/v1/chat/completions', '/v1/chat/completions', 200, NULL, NULL, '2026-04-29 09:30:00', 842, 120, 1, 1000, 240, 100, 'medium', '203.0.113.***')"#,
        r#"INSERT INTO ai_usage_fact
            (id, uuid, tenant_id, organization_id, user_id, request_id, status, created_at, owner_name_snapshot, api_key_name_snapshot, api_key_group_snapshot, model, modality, prompt_tokens, completion_tokens, cached_tokens, total_tokens, customer_charge_amount, cost_amount, rate_multiplier, base_input_unit_price, base_output_unit_price, cache_read_unit_price, occurred_at)
            VALUES (200, 'usage-200', 10, 20, 30, 'req-admin-record-1', 1, '2026-04-29 09:30:01', 'owner@example.com', 'Production', 'standard-group', 'gpt-4o-mini', 1, 1200, 300, 128, 1628, '0.012300', '0.010000', '1.200000', '0.150000', '0.600000', '0.030000', '2026-04-29 09:30:01')"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_monitoring(pool: &SqlitePool) {
    for statement in [
        r#"INSERT INTO ops_gateway_instance
            (id, uuid, tenant_id, organization_id, status, instance_code, region, host_name, ip_address_masked, node_name, health_status, started_at, last_heartbeat_at)
            VALUES (1, 'gw-node-1', 10, 20, 1, 'gw-shanghai-01', 'cn-shanghai', 'gw-shanghai-host', '10.***.0.8', 'gw-shanghai-01', 2, '2026-04-24 05:00:00', '2026-04-29 09:00:00')"#,
        r#"INSERT INTO ops_gateway_heartbeat
            (id, uuid, tenant_id, organization_id, instance_id, heartbeat_at, cpu_percent, memory_percent, network_in_bytes, network_out_bytes, uptime_seconds)
            VALUES (1, 'heartbeat-1-old', 10, 20, 1, '2026-04-29 08:55:00', '65.0', '60.0', 2048, 4096, 444000)"#,
        r#"INSERT INTO ops_gateway_heartbeat
            (id, uuid, tenant_id, organization_id, instance_id, heartbeat_at, cpu_percent, memory_percent, network_in_bytes, network_out_bytes, uptime_seconds)
            VALUES (2, 'heartbeat-1', 10, 20, 1, '2026-04-29 09:00:00', '72.5', '63.0', 4096, 8192, 446400)"#,
        r#"INSERT INTO ops_alert_event
            (id, uuid, tenant_id, organization_id, status, alert_no, severity, source, title, message, alert_status, first_seen_at, last_seen_at)
            VALUES (1, 'alert-1', 10, 20, 1, 'ALERT-001', 3, 'gateway', 'High error rate', '5xx error rate exceeded threshold', 1, '2026-04-29 08:58:00', '2026-04-29 09:00:00')"#,
        r#"INSERT INTO ops_metric_snapshot
            (id, uuid, tenant_id, organization_id, status, metric_scope, metric_name, metric_period, period_start, metric_value)
            VALUES (1, 'metric-1', 10, 20, 1, 10, 'cpu_percent', 2, '2026-04-29 09:00:00', '41.0')"#,
        r#"INSERT INTO ops_metric_snapshot
            (id, uuid, tenant_id, organization_id, status, metric_scope, metric_name, metric_period, period_start, metric_value)
            VALUES (2, 'metric-2', 10, 20, 1, 10, 'memory_percent', 2, '2026-04-29 09:00:00', '58.0')"#,
        r#"INSERT INTO ops_metric_snapshot
            (id, uuid, tenant_id, organization_id, status, metric_scope, metric_name, metric_period, period_start, metric_value)
            VALUES (3, 'metric-3', 10, 20, 1, 10, 'network_mbps', 2, '2026-04-29 09:00:00', '122.0')"#,
        r#"INSERT INTO ops_metric_snapshot
            (id, uuid, tenant_id, organization_id, status, metric_scope, metric_name, metric_period, period_start, metric_value)
            VALUES (4, 'metric-4', 10, 20, 1, 10, 'cpu_percent', 2, '2026-04-29 09:01:00', '42.0')"#,
        r#"INSERT INTO ops_metric_snapshot
            (id, uuid, tenant_id, organization_id, status, metric_scope, metric_name, metric_period, period_start, metric_value)
            VALUES (5, 'metric-5', 10, 20, 1, 10, 'memory_percent', 2, '2026-04-29 09:01:00', '59.0')"#,
        r#"INSERT INTO ops_metric_snapshot
            (id, uuid, tenant_id, organization_id, status, metric_scope, metric_name, metric_period, period_start, metric_value)
            VALUES (6, 'metric-6', 10, 20, 1, 10, 'network_mbps', 2, '2026-04-29 09:01:00', '124.0')"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}
