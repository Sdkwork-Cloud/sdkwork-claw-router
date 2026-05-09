use axum::body::Body;
use axum::extract::State;
use axum::http::{HeaderMap, Request, StatusCode};
use axum::routing::post;
use axum::{Json, Router};
use sdkwork_claw_config::{ApiKeySecurityConfig, DatabaseConfig, ProviderSecretMapConfig};
use sdkwork_claw_product::application::Pbkdf2Sha256PasswordHasher;
use sdkwork_claw_test_support::{
    api_key_security_config as test_api_key_security_config, app_session_bearer_token,
    app_session_config as test_app_session_config,
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

const API_KEYS_PATH: &str = "/app/v3/api/router/api-keys";

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

    let router =
        sdkwork_claw_app_api::router_with_database_config_api_key_trusted_subject_and_app_session_config(
            DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap(),
            api_key_security_config(),
            trusted_subject_config(),
            app_session_config(),
            payment_webhook_config(),
        )
        .await
        .unwrap();

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
    assert!(items[0].get("keyVal").is_none());
    assert!(items[0].get("fullKey").is_none());
    assert!(!body_text.contains("Other User Key"));
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
                .uri("/app/v3/api/user/profile")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, unauthenticated_response.status());

    let (status, payload, body_text) = request_json(
        router,
        session_request("GET", "/app/v3/api/user/profile", Body::empty(), 10, 20, 30),
    )
    .await;

    assert_eq!(StatusCode::OK, status);
    assert_eq!("2000", payload["code"]);
    assert_eq!("Owner User", payload["data"]["name"]);
    assert_eq!("owner@example.com", payload["data"]["email"]);
    assert_eq!("+15550000030", payload["data"]["phone"]);
    assert_eq!("zh-CN", payload["data"]["language"]);
    assert_eq!("O", payload["data"]["avatar"]);
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
            .uri("/app/v3/api/auth/login")
            .header("content-type", "application/json")
            .header("X-Request-Id", "password-login-request-1")
            .body(Body::from(
                json!({
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
    assert_eq!("Bearer", login_payload["data"]["tokenType"]);
    let token = login_payload["data"]["token"].as_str().unwrap();
    assert!(!token.is_empty());
    assert_eq!(30, login_payload["data"]["user"]["id"]);
    assert_eq!("owner", login_payload["data"]["user"]["username"]);
    assert_eq!("owner@example.com", login_payload["data"]["user"]["email"]);
    assert_eq!("Owner User", login_payload["data"]["user"]["name"]);
    assert_eq!("O", login_payload["data"]["user"]["avatar"]);
    assert!(!login_body_text.contains("correct-password"));
    assert!(!login_body_text.contains("pbkdf2-sha256"));

    let (profile_status, profile_payload, profile_body_text) = request_json(
        router,
        Request::builder()
            .method("GET")
            .uri("/app/v3/api/user/profile")
            .header("authorization", format!("Bearer {token}"))
            .body(Body::empty())
            .unwrap(),
    )
    .await;

    assert_eq!(StatusCode::OK, profile_status);
    assert_eq!("2000", profile_payload["code"]);
    assert_eq!("Owner User", profile_payload["data"]["name"]);
    assert_eq!("owner@example.com", profile_payload["data"]["email"]);
    assert!(!profile_body_text.contains("correct-password"));
    assert!(!profile_body_text.contains("pbkdf2-sha256"));

    let verification_pool = create_sqlite_pool(&database_url).await;
    let auth_provider: String = sqlx::query_scalar(
        "SELECT auth_provider FROM iam_user_login_event WHERE request_id = 'password-login-request-1'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    verification_pool.close().await;
    assert_eq!("password", auth_provider);
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
            "/app/v3/api/router/dashboard/overview?keyword=daily&startTime=2026-04-29T00:00:00Z&endTime=2026-04-29T23:59:59Z",
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
        session_request_builder("POST", "/app/v3/api/coupons/redeem", 10, 20, 30)
            .header("content-type", "application/json")
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
        router,
        session_request("GET", "/app/v3/api/coupons/my", Body::empty(), 10, 20, 30),
    )
    .await;

    assert_eq!(StatusCode::OK, history_status);
    assert_eq!("2000", history_payload["code"]);
    assert_eq!(1, history_payload["data"].as_array().unwrap().len());
    assert_eq!("5.00", history_payload["data"][0]["amount"]);
    assert_eq!("success", history_payload["data"][0]["status"]);
    assert!(!history_body_text.contains("WELCOME-other-user"));

    let verification_pool = create_sqlite_pool(&database_url).await;
    let available_points: i64 = sqlx::query_scalar(
        "SELECT available_points FROM plus_account WHERE tenant_id = 10 AND organization_id = 20 AND user_id = 30 AND account_type = 2",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let other_available_points: i64 = sqlx::query_scalar(
        "SELECT available_points FROM plus_account WHERE tenant_id = 10 AND organization_id = 20 AND user_id = 31 AND account_type = 2",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let received_count: i64 =
        sqlx::query_scalar("SELECT received_count FROM plus_coupon WHERE redeem_code = 'WELCOME'")
            .fetch_one(&verification_pool)
            .await
            .unwrap();
    verification_pool.close().await;

    assert_eq!(150, available_points);
    assert_eq!(900, other_available_points);
    assert_eq!(1, received_count);
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
    assert!(!list_body_text.contains(raw_key));
    assert!(!list_body_text.contains("Other User Key"));
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
                .uri("/app/v3/api/router/routing/api-keys")
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
            "/app/v3/api/router/routing/channels",
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
            "/app/v3/api/router/routing/api-keys",
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
        keys_payload["data"]["items"][0]["key"]
    );
    assert_eq!("5", keys_payload["data"]["items"][0]["totalUsage"]);
    assert!(!keys_body_text.contains("Other User Key"));
    assert!(!keys_body_text.contains("hash:owner"));

    let (traces_status, traces_payload, traces_body_text) = request_json(
        router.clone(),
        session_request(
            "GET",
            "/app/v3/api/router/routing/request-traces",
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
            "/app/v3/api/router/routing/usage",
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
            "/app/v3/api/router/routing/strategy",
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
        session_request_builder("PUT", "/app/v3/api/router/routing/strategy", 10, 20, 30)
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
                "/app/v3/api/router/routing/strategy",
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
        session_request_builder("PUT", "/app/v3/api/router/routing/strategy", 10, 20, 30)
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
            session_request_builder("PUT", "/app/v3/api/router/routing/strategy", 10, 20, 30)
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
                .uri("/app/v3/api/router/routing/channels")
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
            session_request_builder("POST", "/app/v3/api/router/routing/channels", 10, 20, 30)
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
        session_request_builder("POST", "/app/v3/api/router/routing/channels", 10, 20, 30)
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
                "/app/v3/api/router/routing/channels",
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
            &format!("/app/v3/api/router/routing/channels/{created_channel_id}"),
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
                &format!("/app/v3/api/router/routing/channels/{created_channel_id}"),
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
            &format!("/app/v3/api/router/routing/channels/{created_channel_id}/status"),
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
            &format!("/app/v3/api/router/routing/channels/{created_channel_id}/status"),
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
            &format!("/app/v3/api/router/routing/channels/{created_channel_id}/test"),
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
            &format!("/app/v3/api/router/routing/channels/{created_channel_id}"),
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
                "/app/v3/api/router/routing/channels",
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
    sqlx::query("UPDATE integration_channel SET base_url_override = ?1, last_latency_ms = NULL, consecutive_error_count = 3 WHERE id = 4003")
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
            "/app/v3/api/router/routing/channels/4003/test",
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
    sqlx::query("UPDATE integration_channel SET base_url_override = ?1, consecutive_error_count = 4 WHERE id = 4003")
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
            "/app/v3/api/router/routing/channels/4003/test",
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
                .uri("/app/v3/api/router/providers")
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
            "/app/v3/api/router/providers",
            Body::empty(),
            10,
            20,
            30,
        ),
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
async fn database_config_app_messages_require_session_and_scope_notifications_to_subject() {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await;
    create_schema(&pool).await;
    seed_catalog_with_two_user_api_keys(&pool).await;
    seed_app_messages_runtime_data(&pool).await;
    pool.close().await;

    let router = configured_router(&database_url).await;
    let unauthenticated_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/notification")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, unauthenticated_response.status());

    let (status, payload, body_text) = request_json(
        router,
        session_request("GET", "/app/v3/api/notification", Body::empty(), 10, 20, 30),
    )
    .await;

    assert_eq!(StatusCode::OK, status);
    assert_eq!("2000", payload["code"]);
    let items = payload["data"]["items"].as_array().unwrap();
    assert_eq!(2, items.len());
    assert!(items
        .iter()
        .any(|item| item["title"] == "Owner Billing Notice"
            && item["type"] == "billing"
            && item["read"] == true));
    assert!(items
        .iter()
        .any(|item| item["title"] == "Tenant Wide Maintenance"
            && item["type"] == "warning"
            && item["read"] == false));
    assert!(!body_text.contains("Other User Secret"));
    assert!(!body_text.contains("other-user-delivery"));
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
                .uri("/app/v3/api/router/gateway/traces")
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
            "/app/v3/api/router/gateway/traces",
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
                .uri("/app/v3/api/payments/checkout/ORDER-OWNER-1")
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
            "/app/v3/api/payments/checkout/ORDER-OWNER-1",
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
            "/app/v3/api/payments/checkout/ORDER-OTHER-1",
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
                .uri("/app/v3/api/vip/pack-groups/packs")
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
            "/app/v3/api/vip/pack-groups/packs",
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
    assert!(packs
        .iter()
        .any(|pack| pack["id"] == "6101" && pack["rmb"] == "10.00" && pack["bonus"] == 25));
    assert!(packs
        .iter()
        .any(|pack| pack["id"] == "6102" && pack["rmb"] == "20.00" && pack["bonus"] == 50));
    assert!(!packs_body_text.contains("6103"));
    assert!(!packs_body_text.contains("Other Org Recharge Pack"));

    let (recharge_status, recharge_payload, recharge_body_text) = request_json(
        router,
        session_request_builder("POST", "/app/v3/api/account/points/recharge", 10, 20, 30)
            .header("content-type", "application/json")
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
        "SELECT COUNT(1) FROM plus_order WHERE tenant_id = 10 AND organization_id = 20 AND user_id = 30 AND order_type = 4 AND total_amount = '10.00' AND status = 1",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let owner_order_item_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM plus_order_item oi JOIN plus_order o ON o.id = oi.order_id WHERE o.tenant_id = 10 AND o.organization_id = 20 AND o.user_id = 30 AND oi.product_name = 'Starter Recharge Pack'",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let owner_payment_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM plus_payment p JOIN plus_order o ON o.id = p.order_id WHERE o.user_id = 30 AND p.amount = '10.00' AND p.status = 1 AND p.channel = 11",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let owner_recharge_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM plus_vip_recharge WHERE tenant_id = 10 AND organization_id = 20 AND user_id = 30 AND amount = '10.00' AND point_amount = 125 AND status = 3",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    let other_user_order_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM plus_order WHERE tenant_id = 10 AND organization_id = 20 AND user_id = 31",
    )
    .fetch_one(&verification_pool)
    .await
    .unwrap();
    verification_pool.close().await;

    assert_eq!(1, owner_order_count);
    assert_eq!(1, owner_order_item_count);
    assert_eq!(1, owner_payment_count);
    assert_eq!(1, owner_recharge_count);
    assert_eq!(0, other_user_order_count);
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
                .uri("/app/v3/api/user/settings")
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
            "/app/v3/api/user/settings",
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
        session_request_builder("PUT", "/app/v3/api/user/settings", 10, 20, 30)
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
            "/app/v3/api/user/settings",
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
                .uri("/app/v3/api/router/usage/logs")
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
            "/app/v3/api/router/usage/logs?status=success&keyword=gpt-4o-mini&startTime=2026-04-29T00:00:00Z&endTime=2026-04-29T23:59:59Z",
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
            "/app/v3/api/router/usage/logs?status=error&startTime=2026-04-29T00:00:00Z&endTime=2026-04-29T23:59:59Z",
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
    sdkwork_claw_app_api::router_with_database_config_api_key_trusted_subject_and_app_session_config(
        DatabaseConfig::from_url_with_max_connections(database_url, 1).unwrap(),
        api_key_security_config(),
        trusted_subject_config(),
        app_session_config(),
        payment_webhook_config(),
    )
    .await
    .unwrap()
}

async fn configured_router_with_provider_secret_map(
    database_url: &str,
    provider_secret_map_config: ProviderSecretMapConfig,
) -> axum::Router {
    sdkwork_claw_app_api::router_with_database_config_api_key_trusted_subject_app_session_and_provider_secret_map_config(
        DatabaseConfig::from_url_with_max_connections(database_url, 1).unwrap(),
        api_key_security_config(),
        trusted_subject_config(),
        app_session_config(),
        payment_webhook_config(),
        provider_secret_map_config,
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
    let authorization = app_session_bearer_token(
        trusted_request_subject(tenant_id, organization_id, user_id),
        issued_at,
        expires_at,
    )
    .unwrap();
    builder.header("authorization", authorization)
}

fn unique_sqlite_url() -> String {
    let nonce = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos();
    let sequence = SQLITE_DB_SEQUENCE.fetch_add(1, Ordering::Relaxed);
    let process_id = std::process::id();
    let path = format!("target/test-dbs/app-config-{process_id}-{nonce}-{sequence}.db");
    std::fs::create_dir_all("target/test-dbs").unwrap();
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
            region_code TEXT,
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
            base_url_template TEXT,
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
            base_url_override TEXT,
            timeout_ms INTEGER,
            retry_policy TEXT,
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
            last_revealed_at TEXT
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
        r#"CREATE TABLE plus_user (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            nickname TEXT,
            username TEXT,
            email TEXT,
            phone TEXT,
            avatar TEXT,
            password TEXT,
            salt TEXT,
            status INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
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
        r#"CREATE TABLE plus_oauth_account (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            oauth_provider TEXT NOT NULL,
            oauth_open_id TEXT
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
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            target_user_id INTEGER,
            target_scope INTEGER,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            title TEXT,
            summary TEXT,
            content TEXT,
            published_at TEXT,
            created_at TEXT,
            expire_at TEXT,
            message_type INTEGER,
            severity INTEGER
        )"#,
        r#"CREATE TABLE ops_notification_delivery (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            message_id INTEGER NOT NULL,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            delivery_status INTEGER,
            delivered_at TEXT,
            read_at TEXT
        )"#,
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
        r#"CREATE TABLE plus_coupon (
            id INTEGER PRIMARY KEY,
            redeem_code TEXT NOT NULL,
            amount INTEGER,
            start_time TEXT,
            end_time TEXT,
            total INTEGER,
            received_count INTEGER,
            get_limit INTEGER,
            stackable INTEGER,
            status INTEGER NOT NULL,
            updated_at TEXT
        )"#,
        r#"CREATE TABLE plus_user_coupon (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER,
            created_at TEXT,
            updated_at TEXT,
            v INTEGER,
            user_id INTEGER,
            coupon_id INTEGER NOT NULL,
            coupon_code TEXT,
            acquire_at TEXT,
            acquire_type INTEGER,
            point_cost INTEGER,
            points_refunded INTEGER,
            expire_at TEXT,
            status INTEGER NOT NULL,
            can_shared INTEGER
        )"#,
        r#"CREATE TABLE plus_vip_point_change (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER,
            created_at TEXT,
            updated_at TEXT,
            v INTEGER,
            user_id INTEGER NOT NULL,
            change_type INTEGER,
            change_amount INTEGER,
            before_balance INTEGER,
            after_balance INTEGER,
            source_id INTEGER,
            source_type TEXT,
            remark TEXT
        )"#,
        r#"CREATE TABLE plus_account (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER,
            created_at TEXT,
            updated_at TEXT,
            v INTEGER,
            user_id INTEGER NOT NULL,
            account_type INTEGER NOT NULL,
            owner INTEGER,
            owner_id INTEGER,
            available_balance TEXT,
            frozen_balance TEXT,
            available_points INTEGER,
            frozen_points INTEGER,
            token_balance INTEGER,
            frozen_token INTEGER,
            status INTEGER NOT NULL
        )"#,
        r#"CREATE TABLE plus_account_history (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER,
            created_at TEXT,
            updated_at TEXT,
            v INTEGER,
            account_type INTEGER,
            asset_type INTEGER,
            account_id INTEGER,
            transaction_id TEXT,
            transaction_type INTEGER,
            points_change INTEGER,
            points_before INTEGER,
            points_after INTEGER,
            source_type INTEGER,
            source_id TEXT,
            status INTEGER,
            usage_result TEXT,
            remarks TEXT
        )"#,
        r#"CREATE TABLE plus_order (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER,
            created_at TEXT,
            updated_at TEXT,
            v INTEGER,
            subject TEXT,
            order_type INTEGER,
            owner INTEGER,
            owner_id INTEGER,
            user_id INTEGER NOT NULL,
            order_sn TEXT,
            out_trade_no TEXT,
            total_amount TEXT,
            paid_amount TEXT,
            paid_points_amount INTEGER,
            status INTEGER,
            category_id INTEGER,
            content_id INTEGER,
            product_amount TEXT,
            shipping_amount TEXT,
            discount_amount TEXT,
            tax_amount TEXT,
            refunded_amount TEXT,
            currency TEXT,
            payment_method TEXT,
            source_channel TEXT,
            merchant_remark TEXT,
            payment_expire_time TEXT,
            refund_status INTEGER,
            payment_provider INTEGER,
            payment_product_type TEXT,
            pay_success_time TEXT
        )"#,
        r#"CREATE TABLE plus_order_item (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER,
            created_at TEXT,
            updated_at TEXT,
            v INTEGER,
            order_id INTEGER NOT NULL,
            category_id INTEGER,
            product_type TEXT,
            product_id INTEGER,
            sku_id INTEGER,
            quantity INTEGER,
            unit_price TEXT,
            total_amount TEXT,
            content_id INTEGER,
            product_name TEXT,
            sku_spec TEXT,
            discount_amount TEXT,
            paid_amount TEXT,
            refunded_amount TEXT,
            currency TEXT,
            refund_status INTEGER,
            review_status INTEGER,
            payment_provider INTEGER,
            payment_product_type TEXT
        )"#,
        r#"CREATE TABLE plus_payment (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER,
            created_at TEXT,
            updated_at TEXT,
            v INTEGER,
            subject TEXT,
            purpose TEXT,
            order_id INTEGER,
            out_trade_no TEXT,
            channel INTEGER,
            provider INTEGER,
            product_type TEXT,
            status INTEGER,
            amount TEXT,
            expire_time TEXT,
            remark TEXT,
            content_id INTEGER,
            pay_objects TEXT,
            metadata TEXT,
            client_info TEXT,
            success_time TEXT
        )"#,
        r#"CREATE TABLE plus_vip_recharge (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER,
            created_at TEXT,
            updated_at TEXT,
            v INTEGER,
            user_id INTEGER NOT NULL,
            amount TEXT,
            point_amount INTEGER,
            recharge_type INTEGER,
            recharge_time TEXT,
            transaction_no TEXT,
            status INTEGER,
            remark TEXT,
            recharge_method_id INTEGER,
            recharge_pack_id INTEGER
        )"#,
        r#"CREATE TABLE plus_vip_recharge_pack (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            name TEXT,
            price TEXT,
            point_amount INTEGER,
            recharge_type INTEGER,
            sort_weight INTEGER,
            status INTEGER NOT NULL,
            valid_from TEXT,
            valid_to TEXT
        )"#,
        r#"CREATE TABLE plus_vip_recharge_method (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            method_key TEXT NOT NULL,
            sort_weight INTEGER,
            status INTEGER NOT NULL
        )"#,
        r#"CREATE TABLE plus_product (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            category_id INTEGER,
            title TEXT,
            status INTEGER NOT NULL
        )"#,
        r#"CREATE TABLE plus_sku (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            name TEXT,
            title TEXT,
            specs TEXT,
            price TEXT,
            status INTEGER NOT NULL
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
        "INSERT INTO iam_gateway_api_key_group (id, code, pricing_plan_code, rate_multiplier, official_price_multiplier, status, updated_at) VALUES (10, 'standard-group', 'standard', '1.000000', '1.100000', 1, '2026-04-29 09:00:00')",
        r#"INSERT INTO iam_gateway_api_key
            (id, tenant_id, organization_id, user_id, group_id, name, key_prefix, key_display_masked, key_hash, idempotency_key, status, created_at, updated_at)
            VALUES (100, 10, 20, 30, 10, 'Owner Key', 'sk-owner', 'sk-owner********ABCD', 'hash:owner', 'seed-owner-key', 1, '2026-04-10 20:55:41', '2026-04-29 09:00:00')"#,
        r#"INSERT INTO iam_gateway_api_key
            (id, tenant_id, organization_id, user_id, group_id, name, key_prefix, key_display_masked, key_hash, idempotency_key, status, created_at, updated_at)
            VALUES (101, 10, 20, 31, 10, 'Other User Key', 'sk-other', 'sk-other********WXYZ', 'hash:other', 'seed-other-key', 1, '2026-04-10 20:55:42', '2026-04-29 09:01:00')"#,
        "INSERT INTO ai_model_pricing (id, catalog_key, model, price_side, billing_meter_code, unit_price, currency, status, priority) VALUES (1, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 1, 'llm_input_token', '0.150000', 'USD', 1, 1)",
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_app_user_data(pool: &SqlitePool) {
    let owner_password_hash = Pbkdf2Sha256PasswordHasher::hash_password_with_salt(
        "correct-password",
        b"database-config-owner-password-salt",
        1_000,
    )
    .unwrap();
    sqlx::query(
        r#"INSERT INTO plus_user
            (id, uuid, tenant_id, organization_id, nickname, username, email, phone, avatar, password, salt, status, created_at, updated_at)
            VALUES
            (30, 'user-owner-uuid', 10, 20, 'Owner User', 'owner', 'owner@example.com', '+15550000030', 'O', ?, 'owner-salt', 1, '2026-04-01 08:00:00', '2026-04-29 08:00:00')"#,
    )
    .bind(owner_password_hash)
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"INSERT INTO plus_user
            (id, uuid, tenant_id, organization_id, nickname, username, email, phone, avatar, password, salt, status, created_at, updated_at)
            VALUES
            (31, 'user-other-uuid', 10, 20, 'Other User', 'other', 'other@example.com', '+15550000031', 'O', 'other-password-hash', 'other-salt', 1, '2026-04-02 08:00:00', '2026-04-29 08:00:00')"#,
    )
    .execute(pool)
    .await
    .unwrap();

    for statement in [
        "INSERT INTO iam_user_preference (id, tenant_id, organization_id, user_id, language) VALUES (1001, 10, 20, 30, 'zh-CN')",
        r#"INSERT INTO iam_user_security_setting
            (id, tenant_id, organization_id, user_id, last_login_at, password_last_changed_at, mfa_enabled, security_level)
            VALUES (1002, 10, 20, 30, '2026-04-20 12:00:00', '2026-04-20 12:00:00', 1, 1)"#,
        r#"INSERT INTO iam_user_login_event
            (id, tenant_id, organization_id, user_id, request_id, occurred_at, created_at, client_ip_masked)
            VALUES (1003, 10, 20, 30, 'owner-login-request', '2026-04-29 10:00:00', '2026-04-29 10:00:00', '203.0.113.***')"#,
        r#"INSERT INTO plus_oauth_account
            (id, tenant_id, organization_id, user_id, oauth_provider, oauth_open_id)
            VALUES (1004, 10, 20, 30, 'github', 'github-owner-open-id')"#,
        r#"INSERT INTO plus_oauth_account
            (id, tenant_id, organization_id, user_id, oauth_provider, oauth_open_id)
            VALUES (1005, 10, 20, 30, 'google', 'google-owner-open-id')"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
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
        r#"INSERT INTO content_announcement
            (id, tenant_id, organization_id, status, title, content, published_at, created_at, announcement_type, effective_from, effective_to, pinned)
            VALUES (2007, 10, 20, 1, 'Planned model upgrade', 'Planned model upgrade content', '2026-04-29 08:00:00', '2026-04-29 08:00:00', 3, '2026-04-01 00:00:00', '2099-01-01 00:00:00', 1)"#,
        "INSERT INTO ops_metric_snapshot (id, tenant_id, organization_id, status, metric_name, metric_value, period_start) VALUES (2008, 10, 20, 1, 'latency_p50_ms', '123.45', '2026-04-29 12:00:00')",
        "INSERT INTO ops_metric_snapshot (id, tenant_id, organization_id, status, metric_name, metric_value, period_start) VALUES (2009, 10, 20, 1, 'latency_p95_ms', '456.78', '2026-04-29 12:00:00')",
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_billing_data(pool: &SqlitePool) {
    for statement in [
        r#"INSERT INTO plus_coupon
            (id, redeem_code, amount, start_time, end_time, total, received_count, get_limit, stackable, status, updated_at)
            VALUES (501, 'WELCOME', 500, '2026-01-01 00:00:00', '2099-01-01 00:00:00', 100, 0, 1, 0, 1, '2026-04-29 08:00:00')"#,
        r#"INSERT INTO plus_coupon
            (id, redeem_code, amount, start_time, end_time, total, received_count, get_limit, stackable, status, updated_at)
            VALUES (502, 'WELCOME-other-user', 900, '2026-01-01 00:00:00', '2099-01-01 00:00:00', 100, 0, 1, 0, 1, '2026-04-29 08:00:00')"#,
        r#"INSERT INTO plus_account
            (id, uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, user_id, account_type, owner, owner_id, available_balance, frozen_balance, available_points, frozen_points, token_balance, frozen_token, status)
            VALUES (3001, 'owner-points-account', 10, 20, 1, '2026-04-01 08:00:00', '2026-04-29 08:00:00', 0, 30, 2, 0, 30, '0', '0', 100, 0, 0, 0, 1)"#,
        r#"INSERT INTO plus_account
            (id, uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, user_id, account_type, owner, owner_id, available_balance, frozen_balance, available_points, frozen_points, token_balance, frozen_token, status)
            VALUES (3002, 'other-points-account', 10, 20, 1, '2026-04-01 08:00:00', '2026-04-29 08:00:00', 0, 31, 2, 0, 31, '0', '0', 900, 0, 0, 0, 1)"#,
        r#"INSERT INTO plus_user_coupon
            (id, uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, user_id, coupon_id, coupon_code, acquire_at, acquire_type, point_cost, points_refunded, expire_at, status, can_shared)
            VALUES (3003, 'other-user-coupon', 10, 20, 1, '2026-04-28 08:00:00', '2026-04-28 08:00:00', 0, 31, 502, 'WELCOME-other-user', '2026-04-28 08:00:00', 2, 0, 0, '2099-01-01 00:00:00', 1, 0)"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_app_routing_runtime_data(pool: &SqlitePool) {
    for statement in [
        r#"INSERT INTO integration_provider
            (id, tenant_id, organization_id, provider_code, default_vendor_code, display_name, description, base_url_template, status, sort_order)
            VALUES (4001, 10, 20, 'openai', 'openai', 'Routing OpenAI Provider', 'Owner routing provider', 'https://api.openai.example/v1', 1, 1)"#,
        r#"INSERT INTO integration_provider_account
            (id, tenant_id, organization_id, provider_code, secret_ref, masked_label, upstream_balance_amount, upstream_balance_currency, consecutive_error_count, status)
            VALUES (4002, 10, 20, 'openai', 'vault://providers/openai/main', 'vault-label-openai-main', '42.50', 'USD', 0, 1)"#,
        r#"INSERT INTO integration_channel
            (id, tenant_id, organization_id, provider_id, provider_code, channel_code, name, protocol, access_type, base_url_override, account_id, capabilities, status, priority, weight, health_status, last_latency_ms, rpm_limit, consecutive_error_count)
            VALUES (4003, 10, 20, 4001, 'openai', 'openai-primary', 'OpenAI Primary', 1, 1, 'https://api.openai.example/v1', 4002, '["llm","vision"]', 1, 1, 100, 1, 321, 600, 0)"#,
        r#"INSERT INTO integration_channel_model
            (id, tenant_id, organization_id, catalog_key, model, channel_id, vendor_code, provider_model, status)
            VALUES (4004, 10, 20, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 4003, 'openai', 'openai/global/gpt-4o-mini', 1)"#,
        r#"INSERT INTO integration_channel
            (id, tenant_id, organization_id, provider_id, provider_code, channel_code, name, protocol, access_type, base_url_override, account_id, capabilities, status, priority, weight, health_status, last_latency_ms, rpm_limit, consecutive_error_count)
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
            (id, tenant_id, organization_id, provider_code, default_vendor_code, integration_type, display_name, description, base_url_template, status, sort_order)
            VALUES (4101, 10, 20, 'openai', 'openai', 1, 'Tenant OpenAI Provider', 'Tenant-owned OpenAI compatible provider', 'https://api.openai.example/v1', 1, 1)"#,
        r#"INSERT INTO integration_provider_account
            (id, tenant_id, organization_id, provider_code, secret_ref, masked_label, upstream_balance_amount, upstream_balance_currency, consecutive_error_count, status)
            VALUES (4102, 10, 20, 'openai', 'vault://providers/openai/main', 'sk-provider-secret', '10.00', 'USD', 0, 1)"#,
        r#"INSERT INTO integration_channel
            (id, tenant_id, organization_id, provider_id, provider_code, channel_code, name, protocol, access_type, base_url_override, account_id, capabilities, status, priority, weight, health_status, last_latency_ms, rpm_limit, consecutive_error_count)
            VALUES (4103, 10, 20, 4101, 'openai', 'tenant-openai-primary', 'Tenant OpenAI Primary', 1, 1, 'https://tenant-openai.example/v1', 4102, '["llm"]', 1, 1, 100, 1, 111, 600, 0)"#,
        r#"INSERT INTO integration_channel_model
            (id, tenant_id, organization_id, catalog_key, model, channel_id, vendor_code, provider_model, status)
            VALUES (4104, 10, 20, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 4103, 'openai', 'openai/global/gpt-4o-mini', 1)"#,
        r#"INSERT INTO integration_provider
            (id, tenant_id, organization_id, provider_code, default_vendor_code, integration_type, display_name, description, base_url_template, status, sort_order)
            VALUES (4105, 10, 21, 'anthropic', 'anthropic', 1, 'Other Tenant Provider', 'Other tenant provider', 'https://other-provider.example/v1', 1, 1)"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_app_messages_runtime_data(pool: &SqlitePool) {
    for statement in [
        r#"INSERT INTO ops_notification_message
            (id, tenant_id, organization_id, target_user_id, target_scope, status, title, summary, content, published_at, created_at, expire_at, message_type, severity)
            VALUES (4201, 10, 20, 30, 2, 1, 'Owner Billing Notice', 'Owner billing summary', 'Owner billing content', '2026-04-29 09:00:00', '2026-04-29 09:00:00', '2099-01-01 00:00:00', 2, 1)"#,
        r#"INSERT INTO ops_notification_delivery
            (id, tenant_id, organization_id, user_id, message_id, status, delivery_status, delivered_at, read_at)
            VALUES (4202, 10, 20, 30, 4201, 1, 2, '2026-04-29 09:01:00', '2026-04-29 09:02:00')"#,
        r#"INSERT INTO ops_notification_message
            (id, tenant_id, organization_id, target_user_id, target_scope, status, title, summary, content, published_at, created_at, expire_at, message_type, severity)
            VALUES (4203, 10, 20, NULL, 1, 1, 'Tenant Wide Maintenance', 'Maintenance summary', 'Maintenance content', '2026-04-29 10:00:00', '2026-04-29 10:00:00', '2099-01-01 00:00:00', 1, 3)"#,
        r#"INSERT INTO ops_notification_message
            (id, tenant_id, organization_id, target_user_id, target_scope, status, title, summary, content, published_at, created_at, expire_at, message_type, severity)
            VALUES (4204, 10, 20, 31, 2, 1, 'Other User Secret', 'other-user-delivery', 'Other user content', '2026-04-29 11:00:00', '2026-04-29 11:00:00', '2099-01-01 00:00:00', 4, 4)"#,
        r#"INSERT INTO ops_notification_delivery
            (id, tenant_id, organization_id, user_id, message_id, status, delivery_status, delivered_at, read_at)
            VALUES (4205, 10, 20, 31, 4204, 1, 2, '2026-04-29 11:01:00', NULL)"#,
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
        r#"INSERT INTO plus_order
            (id, uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, subject, order_type, owner, owner_id, user_id, order_sn, out_trade_no, total_amount, paid_amount, paid_points_amount, status, category_id, content_id, product_amount, shipping_amount, discount_amount, tax_amount, refunded_amount, currency, payment_method, source_channel, merchant_remark, payment_expire_time, refund_status, payment_provider, payment_product_type, pay_success_time)
            VALUES (6001, 'checkout-owner-order', 10, 20, 1, '2026-04-29 09:00:00', '2026-04-29 09:01:00', 0, 'Owner Recharge', 4, 1, 30, 30, 'ORDER-OWNER-1', 'TRADE-OWNER-1', '10.00', '10.00', 125, 2, 7001, 8001, '10.00', '0', '0', '0', '0', 'CNY', 'wechat', 'CONSOLE', 'owner-payment-secret', '2026-04-29 09:30:00', 0, 1, 'native', '2026-04-29 09:05:00')"#,
        r#"INSERT INTO plus_payment
            (id, uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, subject, purpose, order_id, out_trade_no, channel, provider, product_type, status, amount, expire_time, remark, content_id, pay_objects, metadata, client_info, success_time)
            VALUES (6002, 'checkout-owner-payment', 10, 20, 1, '2026-04-29 09:00:00', '2026-04-29 09:05:00', 0, 'Owner payment', 'POINTS', 6001, 'TRADE-OWNER-1', 11, 1, 'native', 2, '10.00', '2026-04-29 09:30:00', 'owner-payment-secret', 8001, '{}', '{}', '{}', '2026-04-29 09:05:00')"#,
        r#"INSERT INTO plus_vip_recharge
            (id, uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, user_id, amount, point_amount, recharge_type, recharge_time, transaction_no, status, remark, recharge_method_id, recharge_pack_id)
            VALUES (6003, 'checkout-owner-recharge', 10, 20, 1, '2026-04-29 09:00:00', '2026-04-29 09:05:00', 0, 30, '10.00', 125, 2, '2026-04-29 09:05:00', 'TRADE-OWNER-1', 1, 'owner-payment-secret', 6101, 6101)"#,
        r#"INSERT INTO plus_order
            (id, uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, subject, order_type, owner, owner_id, user_id, order_sn, out_trade_no, total_amount, paid_amount, paid_points_amount, status, category_id, content_id, product_amount, shipping_amount, discount_amount, tax_amount, refunded_amount, currency, payment_method, source_channel, merchant_remark, payment_expire_time, refund_status, payment_provider, payment_product_type, pay_success_time)
            VALUES (6004, 'checkout-other-order', 10, 20, 1, '2026-04-29 10:00:00', '2026-04-29 10:01:00', 0, 'Other User Order', 4, 1, 31, 31, 'ORDER-OTHER-1', 'TRADE-OTHER-1', '99.00', '99.00', 999, 2, 7001, 8001, '99.00', '0', '0', '0', '0', 'CNY', 'wechat', 'CONSOLE', 'other-payment-secret', '2026-04-29 10:30:00', 0, 1, 'native', '2026-04-29 10:05:00')"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_recharge_runtime_data(pool: &SqlitePool) {
    for statement in [
        r#"INSERT INTO plus_vip_recharge_pack
            (id, tenant_id, organization_id, name, price, point_amount, recharge_type, sort_weight, status, valid_from, valid_to)
            VALUES (6101, 10, 20, 'Starter Recharge Pack', '10.00', 25, 2, 1, 1, '2026-01-01 00:00:00', '2099-01-01 00:00:00')"#,
        r#"INSERT INTO plus_vip_recharge_pack
            (id, tenant_id, organization_id, name, price, point_amount, recharge_type, sort_weight, status, valid_from, valid_to)
            VALUES (6102, 0, 0, 'Global Recharge Pack', '20.00', 50, 2, 2, 1, '2026-01-01 00:00:00', '2099-01-01 00:00:00')"#,
        r#"INSERT INTO plus_vip_recharge_pack
            (id, tenant_id, organization_id, name, price, point_amount, recharge_type, sort_weight, status, valid_from, valid_to)
            VALUES (6103, 10, 21, 'Other Org Recharge Pack', '30.00', 75, 2, 3, 1, '2026-01-01 00:00:00', '2099-01-01 00:00:00')"#,
        "INSERT INTO plus_vip_recharge_method (id, tenant_id, organization_id, method_key, sort_weight, status) VALUES (6201, 10, 20, 'wechat', 1, 1)",
        "INSERT INTO plus_product (id, tenant_id, organization_id, category_id, title, status) VALUES (6301, 10, 20, 6401, 'Points recharge product', 1)",
        r#"INSERT INTO plus_sku
            (id, tenant_id, organization_id, product_id, name, title, specs, price, status)
            VALUES (6302, 10, 20, 6301, 'Starter Recharge Pack', 'Starter Recharge Pack', '{"amount":"10.00"}', '10.00', 1)"#,
    ] {
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
