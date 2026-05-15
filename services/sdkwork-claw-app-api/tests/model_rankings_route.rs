use std::collections::HashSet;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{Duration, SystemTime, UNIX_EPOCH};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_config::DatabaseConfig;
use sdkwork_claw_test_support::{
    api_key_security_config, app_session_config, payment_webhook_config, trusted_subject_config,
};
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};
use std::str::FromStr;
use tower::ServiceExt;

static DB_SEQUENCE: AtomicU64 = AtomicU64::new(0);

#[tokio::test]
async fn database_config_app_model_rankings_route_reads_installed_catalog_snapshot() {
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

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/ai/model_rankings?limit=5")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!("2000", payload["code"]);
    assert_eq!(
        "Published model ranking snapshot",
        payload["data"]["source"]["sourceLabel"]
    );
    assert_eq!("2026-05-08", payload["data"]["source"]["observedAt"]);
    assert_eq!("commercial-default", payload["data"]["source"]["rankScope"]);
    let items = payload["data"]["items"].as_array().unwrap();
    assert_eq!(5, items.len());
    let history_catalog_keys: HashSet<&str> = payload["data"]["history"]
        .as_array()
        .unwrap()
        .iter()
        .flat_map(|point| point["entries"].as_array().into_iter().flatten())
        .filter_map(|entry| entry["catalogKey"].as_str())
        .collect();
    assert!(
        !history_catalog_keys.is_empty(),
        "ranking history must expose stable catalog identities"
    );
    for item in items {
        assert!(item["rank"].as_u64().is_some_and(|rank| rank > 0));
        assert!(item["name"].as_str().is_some_and(|name| !name.is_empty()));
        assert!(item["vendor"]
            .as_str()
            .is_some_and(|vendor| !vendor.is_empty()));
        assert!(item["vendorCode"]
            .as_str()
            .is_some_and(|vendor_code| !vendor_code.is_empty()));
        assert_eq!("LLM", item["modality"]);
        let id = item["id"].as_str().unwrap();
        assert!(
            !id.starts_with("2026-05-08:"),
            "ranking item id must be stable catalog identity, not snapshot-date scoped"
        );
        assert!(
            history_catalog_keys.contains(id),
            "ranking item id must match ranking history catalogKey"
        );
    }
}

#[tokio::test]
async fn database_config_app_startup_worker_auto_refreshes_rankings_and_records_scheduled_audit() {
    let database_url = unique_sqlite_url();
    let pool = connect_sqlite_for_test(&database_url).await;
    sdkwork_claw_product::infrastructure::sql::installer::DatabaseInstaller::for_sqlite(
        pool.clone(),
    )
    .ensure_installed()
    .await
    .unwrap();
    sqlx::query("DELETE FROM ai_model_rank_snapshot")
        .execute(&pool)
        .await
        .unwrap();
    let row = sqlx::query(
        r#"
        SELECT catalog_key, model
        FROM ai_model
        WHERE status = 1
          AND tenant_id = 0
          AND organization_id = 0
          AND catalog_key <> ''
        ORDER BY rank_score DESC, id ASC
        LIMIT 1
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    let catalog_key: String = sqlx::Row::get(&row, "catalog_key");
    let model: String = sqlx::Row::get(&row, "model");
    sqlx::query(
        r#"
        INSERT INTO ai_usage_fact
            (uuid, tenant_id, organization_id, user_id, request_id, status, metadata,
             catalog_key, model, modality, usage_type, billing_meter_code, request_count,
             prompt_tokens, completion_tokens, total_tokens, billable_quantity, cost_amount,
             currency, pricing_snapshot, occurred_at)
        VALUES
            ('usage-app-startup-ranking', 0, 0, 30, 'app-startup-ranking-request', 1, '{}',
             ?, ?, 1, 1, 'llm_input_token', 11,
             800, 400, 1200, '1200', '2.500000',
             'USD', '{"source":"app-startup-test"}', strftime('%Y-%m-%dT%H:%M:%SZ', 'now', '-1 day'))
        "#,
    )
    .bind(&catalog_key)
    .bind(&model)
    .execute(&pool)
    .await
    .unwrap();
    pool.close().await;

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

    let snapshot_count = wait_for_startup_ranking_snapshot(&database_url, &catalog_key).await;
    assert_eq!(1, snapshot_count);

    let payload = request_json(
        router,
        "/app/v3/api/ai/model_rankings?rankScope=commercial-default&limit=5",
    )
    .await;
    assert_eq!("2000", payload["code"]);
    assert!(payload["data"]["items"]
        .as_array()
        .unwrap()
        .iter()
        .any(|item| item["id"]
            .as_str()
            .is_some_and(|id| id.ends_with(&catalog_key))));

    let pool = connect_sqlite_for_test(&database_url).await;
    let audit = sqlx::query(
        r#"
        SELECT trigger_type, execution_status, payload
        FROM ops_job_execution
        WHERE job_name = 'model_ranking_refresh'
        ORDER BY id DESC
        LIMIT 1
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1, sqlx::Row::get::<i64, _>(&audit, "trigger_type"));
    assert_eq!(2, sqlx::Row::get::<i64, _>(&audit, "execution_status"));
    let audit_payload: serde_json::Value =
        serde_json::from_str(&sqlx::Row::get::<String, _>(&audit, "payload")).unwrap();
    assert_eq!("commercial-default", audit_payload["rankScope"]);
    assert_eq!(1, audit_payload["attemptCount"]);
    assert_eq!(0, audit_payload["retryCount"]);
    assert_eq!(0, audit_payload["consecutiveFailureCount"]);
    assert_eq!(false, audit_payload["alertRecommended"]);
    pool.close().await;
}

#[tokio::test]
async fn database_config_app_models_route_reads_global_commercial_catalog() {
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

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/ai/models?billing_meter=llm_input_token")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!("2000", payload["code"]);
    let items = payload["data"]["items"].as_array().unwrap();
    let catalog = sdkwork_models::load_bundled_catalog().unwrap();
    assert!(
        items.len() >= catalog_routable_models_with_meter(&catalog, "llm_input_token").len(),
        "installed app model catalog must include the bundled sdkwork-models routing scope"
    );

    let expected_models = [
        ("openai/global/gpt-5.5-pro", "gpt-5.5-pro", "openai"),
        ("openai/global/gpt-5.5", "gpt-5.5", "openai"),
        (
            "anthropic/global/claude-opus-4-7",
            "claude-opus-4-7",
            "anthropic",
        ),
        (
            "anthropic/global/claude-sonnet-4-6",
            "claude-sonnet-4-6",
            "anthropic",
        ),
        (
            "google/global/gemini-3.1-pro-preview",
            "gemini-3.1-pro-preview",
            "google",
        ),
        (
            "google/global/gemini-3-flash-preview",
            "gemini-3-flash-preview",
            "google",
        ),
        ("xai/global/grok-4.3", "grok-4.3", "xai"),
        (
            "alibaba/cn/qwen3.6-max-preview",
            "qwen3.6-max-preview",
            "alibaba",
        ),
        ("deepseek/cn/deepseek-v4-pro", "deepseek-v4-pro", "deepseek"),
        (
            "deepseek/global/deepseek-v4-pro",
            "deepseek-v4-pro",
            "deepseek",
        ),
        ("moonshot/cn/kimi-k2.6", "kimi-k2.6", "moonshot"),
        ("moonshot/global/kimi-k2.6", "kimi-k2.6", "moonshot"),
        ("zhipu/cn/glm-5.1", "glm-5.1", "zhipu"),
        (
            "bytedance/cn/doubao-seed-2-0-pro-260215",
            "doubao-seed-2-0-pro-260215",
            "bytedance",
        ),
        ("minimax/cn/MiniMax-M2.7", "MiniMax-M2.7", "minimax"),
        ("minimax/global/MiniMax-M2.7", "MiniMax-M2.7", "minimax"),
    ];

    for (catalog_key, model, vendor_code) in expected_models {
        let item = items
            .iter()
            .find(|item| item["catalogKey"] == catalog_key)
            .unwrap_or_else(|| {
                panic!("expected installed model {catalog_key} in app catalog response")
            });
        assert_eq!(model, item["model"]);
        assert_eq!(vendor_code, item["vendorCode"]);
        if item["model"] == "gpt-5.5-pro" || item["model"] == "gpt-5.5" {
            assert_eq!("reference", item["priceAvailability"]["status"]);
            assert!(item["officialReferenceUnitPrice"]
                .as_str()
                .is_some_and(|price| !price.is_empty()));
        }
    }
}

#[tokio::test]
async fn database_config_app_models_route_reads_multimodal_reference_prices() {
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

    assert_catalog_meter_contains(
        &router,
        "image_result",
        &["stable-image-ultra", "imagen-4.0-generate-001"],
    )
    .await;
    assert_catalog_meter_contains(&router, "image_megapixel", &["flux-2-pro"]).await;
    assert_catalog_meter_contains(
        &router,
        "video_output_second",
        &["veo-3.1-generate-preview", "doubao-seedance-2-0-260128"],
    )
    .await;
    assert_catalog_meter_contains(&router, "stt_audio_minute", &["gpt-4o-transcribe"]).await;
    assert_catalog_meter_contains(&router, "music_output_second", &["suno-v5"]).await;
    assert_catalog_meter_contains(&router, "sfx_result", &["eleven_text_to_sound_v2"]).await;
}

async fn assert_catalog_meter_contains(
    router: &axum::Router,
    billing_meter: &str,
    expected_models: &[&str],
) {
    let response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri(format!(
                    "/app/v3/api/ai/models?billing_meter={billing_meter}"
                ))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();
    assert_eq!("2000", payload["code"]);
    let items = payload["data"]["items"].as_array().unwrap();

    for expected_model in expected_models {
        let item = items
            .iter()
            .find(|item| item["model"] == *expected_model)
            .unwrap_or_else(|| {
                panic!("expected installed model {expected_model} for meter {billing_meter}")
            });
        assert!(item["officialReferenceUnitPrice"]
            .as_str()
            .is_some_and(|price| !price.is_empty()));
        assert_eq!("reference", item["priceAvailability"]["status"]);
    }
}

async fn request_json(router: axum::Router, path: &str) -> serde_json::Value {
    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri(path)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

async fn wait_for_startup_ranking_snapshot(database_url: &str, catalog_key: &str) -> i64 {
    for _ in 0..50 {
        let pool = connect_sqlite_for_test(database_url).await;
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM ai_model_rank_snapshot
            WHERE tenant_id = 0
              AND organization_id = 0
              AND rank_scope = 'commercial-default'
              AND catalog_key = ?
              AND request_count = 11
              AND status = 1
            "#,
        )
        .bind(catalog_key)
        .fetch_one(&pool)
        .await
        .unwrap();
        pool.close().await;
        if count > 0 {
            return count;
        }
        tokio::time::sleep(Duration::from_millis(20)).await;
    }
    0
}

fn unique_sqlite_url() -> String {
    let nonce = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos();
    let sequence = DB_SEQUENCE.fetch_add(1, Ordering::Relaxed);
    let process_id = std::process::id();
    let path = format!("target/test-dbs/app-model-rankings-{process_id}-{nonce}-{sequence}.db");
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

fn catalog_routable_models_with_meter(
    catalog: &sdkwork_models::ModelCatalog,
    meter_code: &str,
) -> Vec<String> {
    catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            vendor.models.iter().filter_map(|model| {
                if model.routing_state != "enabled" || model.shelf_state == "archived" {
                    return None;
                }
                let has_meter = vendor.pricing.iter().any(|pricing| {
                    pricing.model_id == model.model_id
                        && pricing
                            .prices
                            .iter()
                            .any(|price| price.meter_code == meter_code)
                });
                has_meter.then(|| model.model_id.clone())
            })
        })
        .collect()
}
