use sdkwork_claw_product::application::{
    ListModelCatalogQuery, ModelCatalogQueryService, PriceAvailability,
};
use sdkwork_claw_product::domain::{BillingMeter, PriceSide};
use sdkwork_claw_product::infrastructure::sql::sqlite::SqlitePricingCatalogLoader;
use sdkwork_claw_product::ports::PricingCatalog;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::SqlitePool;

#[tokio::test]
async fn sqlite_loader_builds_pricing_catalog_snapshot_from_schema_tables() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_schema(&pool).await;
    seed_catalog(&pool).await;

    let snapshot = SqlitePricingCatalogLoader::new(pool)
        .load_snapshot()
        .await
        .unwrap();
    let service = ModelCatalogQueryService::new(&snapshot);

    let page = service
        .list_models(ListModelCatalogQuery {
            api_key_id: Some(100),
            billing_meter: BillingMeter::LlmInputToken,
            vendor_code: Some("openai".to_owned()),
            vendor_codes: Vec::new(),
            modalities: Vec::new(),
            capabilities: Vec::new(),
            categories: Vec::new(),
            groups: Vec::new(),
            search_query: None,
            limit: None,
        })
        .unwrap();

    assert_eq!(1, page.items.len());
    let item = &page.items[0];
    assert_eq!("gpt-4o-mini", item.model);
    assert_eq!("openai/global/gpt-4o-mini", item.catalog_key);
    assert_eq!(vec!["azure_openai", "openrouter"], item.provider_codes);
    assert_eq!(
        "0.110000",
        item.lowest_upstream_cost_unit_price.as_deref().unwrap()
    );

    match &item.price_availability {
        PriceAvailability::Available(price) => {
            assert_eq!("standard-group", price.group_code);
            assert_eq!("standard", price.pricing_plan_code);
            assert_eq!("0.198000", price.customer_unit_price);
            assert_eq!("0.088000", price.gross_margin_per_unit.as_deref().unwrap());
        }
        PriceAvailability::Unavailable { reason } => {
            panic!("sqlite loader must preserve complete pricing catalog: {reason}");
        }
    }

    let routes = snapshot.list_provider_routes("openai/global/gpt-4o-mini");
    let openrouter = routes
        .iter()
        .find(|route| route.provider_code == "openrouter")
        .unwrap();
    assert_eq!(
        Some("http://provider-proxy.internal/openrouter"),
        openrouter.base_url.as_deref()
    );
    assert_eq!(
        Some("vault://providers/openrouter/account/main"),
        openrouter.secret_ref.as_deref()
    );
    assert_eq!(Some(30_000), openrouter.timeout_ms);
    assert_eq!(
        Some(3),
        openrouter
            .retry_policy
            .as_ref()
            .map(|policy| policy.max_attempts)
    );

    let api_key = snapshot.find_api_key(100).unwrap();
    assert_eq!("Production Key", api_key.name);
    assert_eq!("sk-test********ABCD", api_key.key_display_masked);
    let policy = snapshot
        .find_access_policy(api_key.policy_id.unwrap())
        .unwrap();
    assert_eq!(vec!["text", "image"], policy.allowed_capabilities);
    assert_eq!(vec!["192.168.1.1", "10.0.0.0/24"], policy.ip_allowlist);
    let quota = snapshot
        .find_quota_policy(api_key.quota_policy_id.unwrap())
        .unwrap();
    assert_eq!("1000.000000", quota.quota_limit.unwrap().to_fixed_string(6));
    let metric = snapshot
        .find_latest_api_key_group_metric_snapshot(api_key.group_id)
        .unwrap();
    assert_eq!(
        "37.500000",
        metric.usage_amount_total.unwrap().to_fixed_string(6)
    );
}

#[tokio::test]
async fn sqlite_loader_treats_rfc3339_effective_from_as_active_timestamp() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_schema(&pool).await;
    seed_catalog(&pool).await;

    sqlx::query(
        r#"
        UPDATE ai_model_pricing
        SET effective_from = strftime('%Y-%m-%dT00:00:00Z', 'now')
        WHERE id = 1
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let snapshot = SqlitePricingCatalogLoader::new(pool)
        .load_snapshot()
        .await
        .unwrap();

    let price = snapshot
        .find_model_price(
            "openai/global/gpt-4o-mini",
            PriceSide::OfficialReference,
            BillingMeter::LlmInputToken,
            None,
            None,
        )
        .expect("RFC3339 effective_from at today's midnight must be active in SQLite");

    assert_eq!("0.150000", price.unit_price.to_fixed_string(6));
}

#[tokio::test]
async fn sqlite_loader_redacts_copyable_key_material_when_secret_codec_is_absent() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_schema(&pool).await;
    seed_catalog(&pool).await;

    sqlx::query(
        r#"
        UPDATE iam_gateway_api_key
        SET metadata = json_set(COALESCE(metadata, '{}'), '$.copyableKeyCiphertext', 'encrypted-copyable-key')
        WHERE id = 100
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let snapshot = SqlitePricingCatalogLoader::new(pool)
        .load_snapshot()
        .await
        .unwrap();
    let api_key = snapshot.find_api_key(100).unwrap();

    assert_eq!("sk-test********ABCD", api_key.key_display_masked);
    assert_eq!(None, api_key.copyable_key);
}

#[tokio::test]
async fn sqlite_loader_excludes_unhealthy_provider_channels_from_routing_snapshot() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_schema(&pool).await;
    seed_catalog(&pool).await;

    sqlx::query("UPDATE integration_channel SET health_status = 2, updated_at = CURRENT_TIMESTAMP WHERE id = 3001")
        .execute(&pool)
        .await
        .unwrap();

    let snapshot = SqlitePricingCatalogLoader::new(pool)
        .load_snapshot()
        .await
        .unwrap();

    assert!(
        snapshot
            .list_provider_routes("openai/global/gpt-4o-mini")
            .iter()
            .all(|route| route.provider_code != "openrouter"),
        "unhealthy provider model routes must be excluded from the runtime catalog snapshot"
    );
    assert!(
        snapshot
            .list_provider_account_pool_routes()
            .iter()
            .all(|route| route.provider_code != "openrouter"),
        "unhealthy account-pool routes must be excluded from the runtime catalog snapshot"
    );
}

#[tokio::test]
async fn sqlite_loader_reincludes_unhealthy_provider_channels_after_recovery_probe_window() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_schema(&pool).await;
    seed_catalog(&pool).await;

    sqlx::query(
        r#"
        UPDATE integration_channel
        SET health_status = 2,
            updated_at = datetime(CURRENT_TIMESTAMP, '-61 seconds')
        WHERE id = 3001
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let snapshot = SqlitePricingCatalogLoader::new(pool)
        .load_snapshot()
        .await
        .unwrap();

    assert!(
        snapshot
            .list_provider_routes("openai/global/gpt-4o-mini")
            .iter()
            .any(|route| route.provider_code == "openrouter"),
        "unhealthy provider model routes must be re-included after the recovery probe window"
    );
    assert!(
        snapshot
            .list_provider_account_pool_routes()
            .iter()
            .any(|route| route.provider_code == "openrouter"),
        "unhealthy account-pool routes must be re-included after the recovery probe window"
    );
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
            catalog_key TEXT NOT NULL,
            model TEXT NOT NULL,
            display_name TEXT NOT NULL,
            vendor_code TEXT NOT NULL,
            region_code TEXT NOT NULL,
            capability INTEGER,
            capabilities TEXT NOT NULL,
            modalities TEXT,
            input_modalities TEXT,
            output_modalities TEXT,
            description TEXT,
            capability_intro TEXT,
            limitations TEXT,
            supported_languages TEXT,
            use_cases TEXT,
            training_data_cutoff TEXT,
            context_tokens INTEGER,
            max_output_tokens INTEGER,
            supports_streaming INTEGER,
            supports_tools INTEGER,
            supports_json_schema INTEGER,
            api_format TEXT,
            release_stage INTEGER,
            shelf_state INTEGER,
            routing_state INTEGER,
            replacement_model TEXT,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            rank_score TEXT
        )"#,
        r#"CREATE TABLE ai_model_capability (
            id INTEGER PRIMARY KEY,
            model_id INTEGER NOT NULL,
            catalog_key TEXT NOT NULL,
            capability_code TEXT,
            status INTEGER NOT NULL,
            deleted_at TEXT
        )"#,
        r#"CREATE TABLE integration_provider (
            id INTEGER PRIMARY KEY,
            provider_code TEXT NOT NULL,
            integration_type INTEGER,
            base_url_template TEXT,
            status INTEGER NOT NULL,
            deleted_at TEXT
        )"#,
        r#"CREATE TABLE integration_provider_account (
            id INTEGER PRIMARY KEY,
            provider_code TEXT NOT NULL,
            auth_type TEXT,
            auth_config TEXT,
            secret_ref TEXT,
            status INTEGER NOT NULL,
            deleted_at TEXT
        )"#,
        r#"CREATE TABLE integration_channel (
            id INTEGER PRIMARY KEY,
            provider_code TEXT NOT NULL,
            base_url_override TEXT,
            timeout_ms INTEGER,
            retry_policy TEXT,
            health_status INTEGER,
            updated_at TEXT,
            account_id INTEGER,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            priority INTEGER NOT NULL,
            weight INTEGER NOT NULL
        )"#,
        r#"CREATE TABLE integration_channel_model (
            id INTEGER PRIMARY KEY,
            catalog_key TEXT NOT NULL,
            model TEXT NOT NULL,
            channel_id INTEGER NOT NULL,
            provider_model TEXT NOT NULL,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            effective_from TEXT,
            effective_to TEXT
        )"#,
        r#"CREATE TABLE ai_routing_policy (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            policy_code TEXT NOT NULL,
            policy_scope INTEGER NOT NULL,
            subject_id INTEGER,
            capability INTEGER,
            default_profile_id INTEGER,
            fallback_mode INTEGER,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            updated_at TEXT
        )"#,
        r#"CREATE TABLE ai_routing_profile (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            policy_id INTEGER NOT NULL,
            profile_code TEXT,
            profile_version INTEGER,
            status INTEGER NOT NULL,
            deleted_at TEXT
        )"#,
        r#"CREATE TABLE ai_routing_rule (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            profile_id INTEGER NOT NULL,
            rule_code TEXT NOT NULL,
            priority INTEGER NOT NULL,
            match_expression TEXT,
            target_model TEXT,
            candidate_channels TEXT NOT NULL,
            fallback_chain TEXT,
            constraints TEXT,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            effective_from TEXT,
            effective_to TEXT
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
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            name TEXT,
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
            name TEXT,
            key_prefix TEXT NOT NULL,
            key_display_masked TEXT,
            key_hash TEXT NOT NULL,
            idempotency_key TEXT NOT NULL,
            policy_id INTEGER,
            quota_policy_id INTEGER,
            status INTEGER NOT NULL,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            deleted_at TEXT,
            revoked_at TEXT,
            expire_at TEXT,
            updated_at TEXT,
            metadata TEXT NOT NULL DEFAULT '{}'
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
            catalog_key TEXT NOT NULL,
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
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_catalog(pool: &SqlitePool) {
    for statement in [
        "INSERT INTO ai_model_vendor (id, vendor_code, display_name, status, sort_order) VALUES (1, 'openai', 'OpenAI', 1, 1)",
        r#"INSERT INTO ai_model
            (id, catalog_key, model, display_name, vendor_code, region_code, capability, capabilities, modalities, input_modalities, output_modalities, description, capability_intro, limitations, supported_languages, use_cases, training_data_cutoff, context_tokens, max_output_tokens, supports_streaming, supports_tools, supports_json_schema, api_format, release_stage, shelf_state, routing_state, status, rank_score)
            VALUES (1, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 'GPT-4o mini', 'openai', 'global', 1, '["chat","tools","json_schema"]', '["text","image"]', '["text","image"]', '["text"]', 'Fast public model.', 'Low latency chat model.', '["Validate facts"]', '["English","Chinese"]', '["Support","Extraction"]', '2025', 128000, 16384, 1, 1, 1, 'openai_compatible', 1, 1, 1, 1, '100.0')"#,
        "INSERT INTO ai_model_capability (id, model_id, catalog_key, capability_code, status) VALUES (1, 1, 'openai/global/gpt-4o-mini', 'chat', 1)",
        "INSERT INTO integration_provider (id, provider_code, integration_type, base_url_template, status) VALUES (1, 'azure_openai', 2, 'http://provider-proxy.internal/azure-template', 1)",
        "INSERT INTO integration_provider (id, provider_code, integration_type, base_url_template, status) VALUES (2, 'openrouter', 3, 'http://provider-proxy.internal/openrouter-template', 1)",
        "INSERT INTO integration_provider_account (id, provider_code, secret_ref, status) VALUES (9001, 'azure_openai', 'vault://providers/azure/account/main', 1)",
        "INSERT INTO integration_provider_account (id, provider_code, secret_ref, status) VALUES (9002, 'openrouter', 'vault://providers/openrouter/account/main', 1)",
        "INSERT INTO integration_channel (id, provider_code, base_url_override, account_id, status, priority, weight) VALUES (2001, 'azure_openai', 'http://provider-proxy.internal/azure', 9001, 1, 10, 100)",
        "INSERT INTO integration_channel (id, provider_code, base_url_override, timeout_ms, retry_policy, account_id, status, priority, weight) VALUES (3001, 'openrouter', 'http://provider-proxy.internal/openrouter', 30000, '{\"max_attempts\":3,\"retryable_status_codes\":[429,503],\"backoff_ms\":0}', 9002, 1, 20, 100)",
        "INSERT INTO integration_channel_model (id, catalog_key, model, channel_id, provider_model, status) VALUES (1, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 2001, 'gpt-4o-mini', 1)",
        "INSERT INTO integration_channel_model (id, catalog_key, model, channel_id, provider_model, status) VALUES (2, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 3001, 'openai/global/gpt-4o-mini', 1)",
        "INSERT INTO ai_routing_profile (id, tenant_id, organization_id, policy_id, profile_code, profile_version, status) VALUES (9101, 10, 20, 9001, 'standard-profile', 1, 1)",
        "INSERT INTO ai_routing_policy (id, tenant_id, organization_id, policy_code, policy_scope, subject_id, default_profile_id, fallback_mode, status) VALUES (9001, 10, 20, 'standard-group-policy', 5, 10, 9101, 1, 1)",
        "INSERT INTO ai_routing_rule (id, tenant_id, organization_id, profile_id, rule_code, priority, match_expression, target_model, candidate_channels, fallback_chain, constraints, status) VALUES (9102, 10, 20, 9101, 'standard-group-gpt-4o-mini', 1, '{\"catalogKey\":\"openai/global/gpt-4o-mini\"}', 'openai/global/gpt-4o-mini', '[{\"channel_id\":3001,\"weight\":100}]', '[]', '{}', 1)",
        "INSERT INTO ai_pricing_plan (id, plan_code, base_price_side, default_multiplier, default_markup_amount, currency, status, priority) VALUES (1, 'standard', 1, '1.200000', '0.000000', 'USD', 1, 1)",
        "INSERT INTO iam_gateway_api_key_group (id, name, code, pricing_plan_code, rate_multiplier, official_price_multiplier, status) VALUES (10, 'Standard Group', 'standard-group', 'standard', '1.000000', '1.100000', 1)",
        "INSERT INTO iam_gateway_access_policy (id, allowed_capabilities, ip_allowlist, status) VALUES (700, '[\"text\",\"image\"]', '[\"192.168.1.1\",\"10.0.0.0/24\"]', 1)",
        "INSERT INTO ai_quota_policy (id, quota_limit, status) VALUES (900, '1000.000000', 1)",
        "INSERT INTO iam_gateway_api_key_group_metric_snapshot (id, group_id, capacity_used, capacity_limit, usage_amount_total, snapshot_at, status) VALUES (800, 10, '37.500000', '1000.000000', '37.500000', '2026-04-29 00:00:00', 1)",
        "INSERT INTO iam_gateway_api_key (id, tenant_id, organization_id, user_id, group_id, name, key_prefix, key_display_masked, key_hash, idempotency_key, policy_id, quota_policy_id, status) VALUES (100, 10, 20, 30, 10, 'Production Key', 'sk-test', 'sk-test********ABCD', 'hash:sk-test', 'seed-api-key-100', 700, 900, 1)",
        "INSERT INTO ai_model_pricing (id, catalog_key, model, price_side, billing_meter_code, unit_price, currency, status, priority) VALUES (1, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 1, 'llm_input_token', '0.150000', 'USD', 1, 1)",
        "INSERT INTO ai_model_pricing (id, catalog_key, model, price_side, billing_meter_code, unit_price, currency, provider_code, channel_id, status, priority) VALUES (2, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 2, 'llm_input_token', '0.110000', 'USD', 'openrouter', 3001, 1, 1)",
        "INSERT INTO ai_model_pricing (id, catalog_key, model, price_side, billing_meter_code, unit_price, currency, provider_code, channel_id, status, priority) VALUES (3, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 2, 'llm_input_token', '0.120000', 'USD', 'azure_openai', 2001, 1, 1)",
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}
