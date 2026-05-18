use std::str::FromStr;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

use sdkwork_claw_config::{
    ApiKeySecurityConfig, AppSessionConfig, DatabaseConfig, PaymentWebhookConfig,
    TrustedSubjectConfig,
};
use sdkwork_claw_http::{
    sign_app_session_token, sign_trusted_request_subject, TrustedRequestSubject,
};
use sdkwork_claw_product::application::ApiKeySecretHasher;
use sdkwork_claw_product::infrastructure::crypto::HmacSha256ApiKeySecretHasher;
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};
use sqlx::SqlitePool;

static SQLITE_DB_COUNTER: AtomicU64 = AtomicU64::new(0);

pub const API_KEY_PEPPER: &str = "0123456789abcdef0123456789abcdef";
pub const GATEWAY_API_KEY: &str = "sk-live-unified-sqlite";
pub const TRUSTED_SUBJECT_SECRET: &str = "trusted-subject-secret-0123456789abcdef";
pub const APP_SESSION_SECRET: &str = "app-session-secret-0123456789abcdef012";
pub const PAYMENT_WEBHOOK_SECRET: &str = "payment-webhook-secret-0123456789abcdef";
pub const DEFAULT_TENANT_ID: i64 = 10;
pub const DEFAULT_ORGANIZATION_ID: i64 = 20;
pub const DEFAULT_USER_ID: i64 = 30;
pub const DEFAULT_OPERATOR_TYPE: i32 = 1;

const BILLING_METER_CODES: &[(&str, &str)] = &[
    ("llm_input_token", "LLM input token"),
    ("llm_output_token", "LLM output token"),
    ("llm_reasoning_token", "LLM reasoning token"),
    ("llm_cache_write_token", "LLM cache write token"),
    ("llm_cache_read_token", "LLM cache read token"),
    (
        "llm_cache_storage_token_hour",
        "LLM cache storage token hour",
    ),
    ("embedding_input_token", "Embedding input token"),
    ("embedding_image", "Embedding image"),
    ("image_input_token", "Image input token"),
    ("image_output_token", "Image output token"),
    ("image_result", "Image result"),
    ("image_pixel", "Image pixel"),
    ("image_megapixel", "Image megapixel"),
    ("audio_input_second", "Audio input second"),
    ("audio_output_second", "Audio output second"),
    ("audio_input_minute", "Audio input minute"),
    ("audio_output_minute", "Audio output minute"),
    ("tts_input_character", "TTS input character"),
    ("speech_character", "Speech character"),
    ("stt_audio_minute", "STT audio minute"),
    ("video_input_second", "Video input second"),
    ("video_output_second", "Video output second"),
    ("video_result", "Video result"),
    ("music_output_second", "Music output second"),
    ("sfx_result", "SFX result"),
    ("rerank_search", "Rerank search"),
    ("rerank_document", "Rerank document"),
    ("api_request", "API request"),
    ("api_result", "API result"),
    ("api_item", "API item"),
    ("tool_call", "Tool call"),
    ("web_search_call", "Web search call"),
    ("file_search_call", "File search call"),
    ("code_interpreter_session", "Code interpreter session"),
    ("container_session", "Container session"),
    ("storage_gb_day", "Storage GB day"),
    ("bandwidth_gb", "Bandwidth GB"),
    ("unknown", "Unknown"),
];

#[derive(Debug, Clone)]
pub struct SeededSqliteCatalog {
    database_url: String,
}

impl SeededSqliteCatalog {
    pub fn database_url(&self) -> &str {
        &self.database_url
    }

    pub fn database_config(&self) -> anyhow::Result<DatabaseConfig> {
        DatabaseConfig::from_url_with_max_connections(self.database_url.as_str(), 1)
            .map_err(anyhow::Error::msg)
    }

    pub fn api_key_security_config(&self) -> anyhow::Result<ApiKeySecurityConfig> {
        api_key_security_config()
    }

    pub fn trusted_subject_config(&self) -> anyhow::Result<TrustedSubjectConfig> {
        trusted_subject_config()
    }

    pub fn app_session_config(&self) -> anyhow::Result<AppSessionConfig> {
        app_session_config()
    }

    pub fn payment_webhook_config(&self) -> anyhow::Result<PaymentWebhookConfig> {
        payment_webhook_config()
    }

    pub fn gateway_api_key(&self) -> &'static str {
        GATEWAY_API_KEY
    }

    pub fn gateway_authorization_header(&self) -> String {
        format!("Bearer {}", self.gateway_api_key())
    }

    pub async fn open_pool(&self) -> anyhow::Result<SqlitePool> {
        create_sqlite_pool(&self.database_url).await
    }

    pub async fn seed_usage_settlement_points_account(
        &self,
        pool: &SqlitePool,
        account_id: i64,
        available_points: i64,
    ) -> anyhow::Result<()> {
        sqlx::query(
            r#"
            INSERT INTO plus_account
                (id, uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v,
                 user_id, account_type, owner, owner_id, available_balance, frozen_balance,
                 available_points, frozen_points, token_balance, frozen_token, status)
            VALUES
                (?, ?, 10, 20, 1, '2026-04-30 11:59:00', '2026-04-30 11:59:00', 0,
                 30, 2, 0, 30, '0', '0', ?, 0, 0, 0, 1)
            "#,
        )
        .bind(account_id)
        .bind(format!("account-{account_id}"))
        .bind(available_points)
        .execute(pool)
        .await?;
        Ok(())
    }
}

pub async fn seeded_sqlite_catalog() -> anyhow::Result<SeededSqliteCatalog> {
    let database_url = unique_sqlite_url();
    let pool = create_sqlite_pool(&database_url).await?;
    create_schema(&pool).await?;
    seed_billing_meters(&pool).await?;
    seed_catalog(&pool).await?;
    seed_hashed_gateway_api_key(&pool).await?;
    pool.close().await;

    Ok(SeededSqliteCatalog { database_url })
}

pub fn api_key_security_config() -> anyhow::Result<ApiKeySecurityConfig> {
    ApiKeySecurityConfig::from_pepper_secret(API_KEY_PEPPER).map_err(anyhow::Error::msg)
}

pub fn trusted_subject_config() -> anyhow::Result<TrustedSubjectConfig> {
    TrustedSubjectConfig::from_signing_secret(TRUSTED_SUBJECT_SECRET).map_err(anyhow::Error::msg)
}

pub fn app_session_config() -> anyhow::Result<AppSessionConfig> {
    AppSessionConfig::from_signing_secret(APP_SESSION_SECRET).map_err(anyhow::Error::msg)
}

pub fn payment_webhook_config() -> anyhow::Result<PaymentWebhookConfig> {
    PaymentWebhookConfig::from_signing_secret(PAYMENT_WEBHOOK_SECRET).map_err(anyhow::Error::msg)
}

pub fn trusted_request_subject(
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
) -> TrustedRequestSubject {
    TrustedRequestSubject {
        tenant_id,
        organization_id,
        user_id,
        operator_id: user_id,
        operator_type: DEFAULT_OPERATOR_TYPE,
    }
}

pub fn default_trusted_request_subject() -> TrustedRequestSubject {
    trusted_request_subject(DEFAULT_TENANT_ID, DEFAULT_ORGANIZATION_ID, DEFAULT_USER_ID)
}

pub fn app_session_bearer_token(
    subject: TrustedRequestSubject,
    issued_at: i64,
    expires_at: i64,
) -> anyhow::Result<String> {
    let token = sign_app_session_token(&app_session_config()?, subject, issued_at, expires_at);
    Ok(format!("Bearer {token}"))
}

pub fn app_session_access_token(
    subject: TrustedRequestSubject,
    issued_at: i64,
    expires_at: i64,
) -> anyhow::Result<String> {
    Ok(sign_app_session_token(
        &app_session_config()?,
        subject,
        issued_at + 1,
        expires_at + 1,
    ))
}

pub fn app_session_dual_token_headers(
    subject: TrustedRequestSubject,
    issued_at: i64,
    expires_at: i64,
) -> anyhow::Result<(String, String)> {
    Ok((
        app_session_bearer_token(subject, issued_at, expires_at)?,
        app_session_access_token(subject, issued_at, expires_at)?,
    ))
}

pub fn trusted_subject_signature(
    subject: TrustedRequestSubject,
    timestamp: i64,
    method: &str,
    path: &str,
) -> anyhow::Result<String> {
    Ok(sign_trusted_request_subject(
        &trusted_subject_config()?,
        subject,
        timestamp,
        method,
        path,
    ))
}

fn unique_sqlite_url() -> String {
    let nonce = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos();
    let counter = SQLITE_DB_COUNTER.fetch_add(1, Ordering::Relaxed);
    let process_id = std::process::id();
    let path = format!("target/test-dbs/claw-test-support-{process_id}-{nonce}-{counter}.db");
    std::fs::create_dir_all("target/test-dbs").unwrap();
    format!("sqlite://{path}")
}

async fn create_sqlite_pool(database_url: &str) -> anyhow::Result<SqlitePool> {
    let options = SqliteConnectOptions::from_str(database_url)?.create_if_missing(true);
    Ok(SqlitePoolOptions::new()
        .max_connections(1)
        .connect_with(options)
        .await?)
}

async fn seed_hashed_gateway_api_key(pool: &SqlitePool) -> anyhow::Result<()> {
    let hasher = HmacSha256ApiKeySecretHasher::new(API_KEY_PEPPER).map_err(anyhow::Error::msg)?;
    let key_hash = hasher
        .hash_secret(GATEWAY_API_KEY)
        .map_err(anyhow::Error::msg)?;
    sqlx::query("UPDATE iam_gateway_api_key SET key_hash = ? WHERE id = 100")
        .bind(key_hash)
        .execute(pool)
        .await?;
    Ok(())
}

async fn create_schema(pool: &SqlitePool) -> anyhow::Result<()> {
    for statement in [
        r#"CREATE TABLE ai_model_vendor (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'model-vendor-uuid',
            tenant_id INTEGER NOT NULL DEFAULT 10,
            organization_id INTEGER NOT NULL DEFAULT 20,
            data_scope INTEGER NOT NULL DEFAULT 1,
            vendor_code TEXT NOT NULL,
            display_name TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            updated_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            status INTEGER NOT NULL,
            deleted_at TEXT,
            deleted_by INTEGER,
            legal_name TEXT,
            description TEXT,
            website_url TEXT,
            docs_url TEXT,
            logo_url TEXT,
            icon_url TEXT,
            color_token TEXT,
            country_region TEXT,
            vendor_type INTEGER,
            model_families TEXT,
            capabilities TEXT,
            open_source INTEGER,
            sort_order INTEGER NOT NULL
        )"#,
        r#"CREATE TABLE ai_model_vendor_region (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'model-vendor-region-uuid',
            tenant_id INTEGER NOT NULL DEFAULT 10,
            organization_id INTEGER NOT NULL DEFAULT 20,
            data_scope INTEGER NOT NULL DEFAULT 1,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            updated_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            deleted_at TEXT,
            deleted_by INTEGER,
            vendor_id INTEGER,
            vendor_code TEXT NOT NULL,
            region_code TEXT NOT NULL,
            display_name TEXT NOT NULL,
            legal_name TEXT,
            description TEXT,
            website_url TEXT,
            docs_url TEXT,
            country_region TEXT,
            market_scope TEXT NOT NULL,
            billing_currency TEXT NOT NULL,
            billing_jurisdiction TEXT NOT NULL,
            operating_regions TEXT NOT NULL,
            capabilities TEXT,
            open_source INTEGER,
            sort_order INTEGER
        )"#,
        r#"CREATE TABLE ai_model_family (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'model-family-uuid',
            tenant_id INTEGER NOT NULL DEFAULT 10,
            organization_id INTEGER NOT NULL DEFAULT 20,
            data_scope INTEGER NOT NULL DEFAULT 1,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            updated_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            deleted_at TEXT,
            deleted_by INTEGER,
            vendor_id INTEGER,
            vendor_code TEXT,
            region_code TEXT,
            family_code TEXT,
            display_name TEXT,
            description TEXT,
            docs_url TEXT,
            icon_url TEXT,
            color_token TEXT,
            family_type INTEGER,
            primary_modality INTEGER,
            model_count INTEGER,
            default_model_id INTEGER,
            default_model TEXT,
            sort_order INTEGER
        )"#,
        r#"CREATE TABLE ai_model (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'model-uuid',
            tenant_id INTEGER NOT NULL DEFAULT 10,
            organization_id INTEGER NOT NULL DEFAULT 20,
            data_scope INTEGER NOT NULL DEFAULT 1,
            model TEXT NOT NULL,
            display_name TEXT NOT NULL,
            vendor_id INTEGER,
            vendor_code TEXT NOT NULL,
            region_code TEXT NOT NULL,
            vendor_name_snapshot TEXT,
            family_id INTEGER,
            family_code TEXT,
            provider_hint TEXT,
            model_family TEXT,
            model_version TEXT,
            model_aliases TEXT,
            capability INTEGER,
            capabilities TEXT NOT NULL DEFAULT '[]',
            modalities TEXT,
            input_modalities TEXT,
            output_modalities TEXT,
            icon_url TEXT,
            color_token TEXT,
            docs_url TEXT,
            license_type INTEGER,
            api_format TEXT,
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
            performance_profile TEXT,
            default_pricing_id INTEGER,
            rank_score TEXT,
            release_stage INTEGER NOT NULL DEFAULT 1,
            shelf_state INTEGER NOT NULL DEFAULT 1,
            routing_state INTEGER NOT NULL DEFAULT 1,
            deprecated_at TEXT,
            retired_at TEXT,
            replacement_model TEXT,
            description TEXT,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            updated_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            catalog_key TEXT NOT NULL,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            deleted_by INTEGER,
            UNIQUE (tenant_id, organization_id, catalog_key)
        )"#,
        r#"CREATE TABLE ai_model_capability (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'model-capability-uuid',
            tenant_id INTEGER NOT NULL DEFAULT 10,
            organization_id INTEGER NOT NULL DEFAULT 20,
            data_scope INTEGER NOT NULL DEFAULT 1,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            updated_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            deleted_at TEXT,
            deleted_by INTEGER,
            model_id INTEGER,
            catalog_key TEXT NOT NULL,
            model TEXT,
            vendor_code TEXT,
            region_code TEXT NOT NULL,
            capability INTEGER,
            capability_code TEXT,
            modality INTEGER,
            input_modalities TEXT,
            output_modalities TEXT,
            endpoint_formats TEXT,
            parameter_name TEXT,
            parameter_schema TEXT,
            supported INTEGER,
            limit_unit TEXT,
            limit_value TEXT,
            schema_version TEXT,
            sort_order INTEGER,
            description TEXT
        )"#,
        r#"CREATE TABLE ai_model_catalog_source (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL DEFAULT 'model-catalog-source-uuid',
            tenant_id INTEGER NOT NULL DEFAULT 10,
            organization_id INTEGER NOT NULL DEFAULT 20,
            data_scope INTEGER NOT NULL DEFAULT 1,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            updated_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            deleted_at TEXT,
            deleted_by INTEGER,
            source_code TEXT NOT NULL,
            vendor_code TEXT,
            provider_code TEXT,
            source_name TEXT NOT NULL,
            source_url TEXT,
            source_kind INTEGER NOT NULL,
            trust_level INTEGER NOT NULL,
            parser_kind TEXT NOT NULL,
            refresh_interval_seconds INTEGER,
            last_observed_at TEXT,
            last_success_at TEXT,
            catalog_version TEXT,
            source_hash TEXT,
            raw_payload_ref TEXT,
            normalized_payload_hash TEXT,
            schema_version TEXT,
            error_message_masked TEXT,
            UNIQUE (tenant_id, organization_id, source_code)
        )"#,
        r#"CREATE TABLE ai_model_catalog_sync_run (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL DEFAULT 'model-catalog-sync-run-uuid',
            tenant_id INTEGER NOT NULL DEFAULT 10,
            organization_id INTEGER NOT NULL DEFAULT 20,
            user_id INTEGER,
            request_id TEXT,
            trace_id TEXT,
            payload_hash TEXT,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            retention_until TEXT,
            legal_hold INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            source_type TEXT,
            source_id INTEGER,
            source_version INTEGER,
            source_code TEXT NOT NULL,
            vendor_code TEXT,
            provider_code TEXT,
            run_status INTEGER NOT NULL,
            started_at TEXT NOT NULL,
            finished_at TEXT,
            observed_at TEXT,
            catalog_version TEXT,
            source_hash TEXT,
            observed_vendor_count INTEGER,
            observed_model_count INTEGER,
            observed_meter_count INTEGER,
            observed_price_count INTEGER,
            accepted_count INTEGER,
            rejected_count INTEGER,
            skipped_count INTEGER,
            change_summary TEXT,
            error_message_masked TEXT
        )"#,
        r#"CREATE TABLE ai_billing_meter (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'billing-meter-uuid',
            tenant_id INTEGER NOT NULL DEFAULT 10,
            organization_id INTEGER NOT NULL DEFAULT 20,
            data_scope INTEGER NOT NULL DEFAULT 1,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            updated_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            deleted_at TEXT,
            meter_code TEXT NOT NULL,
            display_name TEXT NOT NULL,
            description TEXT,
            modality INTEGER,
            usage_type INTEGER,
            billing_mode INTEGER,
            default_unit INTEGER,
            default_unit_size TEXT,
            quantity_precision INTEGER,
            quantity_source INTEGER,
            aggregation_mode INTEGER,
            supports_tier INTEGER,
            supports_expression INTEGER,
            allow_negative_quantity INTEGER,
            canonical_price_item_type INTEGER,
            sort_order INTEGER
        )"#,
        r#"CREATE TABLE integration_provider (
            id INTEGER PRIMARY KEY,
            provider_code TEXT NOT NULL,
            integration_type INTEGER,
            upstream_vendor_code TEXT,
            upstream_provider_code TEXT,
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
            circuit_breaker_policy TEXT,
            account_id INTEGER,
            status INTEGER NOT NULL,
            health_status INTEGER,
            updated_at TEXT,
            deleted_at TEXT,
            priority INTEGER NOT NULL,
            weight INTEGER NOT NULL
        )"#,
        r#"CREATE TABLE integration_channel_model (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'channel-model-uuid',
            tenant_id INTEGER NOT NULL DEFAULT 10,
            organization_id INTEGER NOT NULL DEFAULT 20,
            data_scope INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            updated_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            catalog_key TEXT,
            model TEXT NOT NULL,
            channel_id INTEGER NOT NULL,
            vendor_code TEXT,
            provider_model TEXT NOT NULL,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            effective_from TEXT,
            effective_to TEXT
        )"#,
        r#"CREATE TABLE ai_routing_policy (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'routing-policy-uuid',
            tenant_id INTEGER NOT NULL DEFAULT 10,
            organization_id INTEGER NOT NULL DEFAULT 20,
            data_scope INTEGER NOT NULL DEFAULT 1,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            updated_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            version INTEGER NOT NULL DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT NOT NULL DEFAULT '{}',
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
            currency TEXT
        )"#,
        r#"CREATE TABLE ai_routing_profile (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'routing-profile-uuid',
            tenant_id INTEGER NOT NULL DEFAULT 10,
            organization_id INTEGER NOT NULL DEFAULT 20,
            data_scope INTEGER NOT NULL DEFAULT 1,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            updated_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            version INTEGER NOT NULL DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT NOT NULL DEFAULT '{}',
            policy_id INTEGER,
            profile_version INTEGER,
            profile_name TEXT,
            release_status INTEGER,
            traffic_percent TEXT,
            config_hash TEXT,
            published_at TEXT,
            published_by INTEGER,
            rollback_from_profile_id INTEGER
        )"#,
        r#"CREATE TABLE ai_routing_rule (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'routing-rule-uuid',
            tenant_id INTEGER NOT NULL DEFAULT 10,
            organization_id INTEGER NOT NULL DEFAULT 20,
            data_scope INTEGER NOT NULL DEFAULT 1,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            updated_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            version INTEGER NOT NULL DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT NOT NULL DEFAULT '{}',
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
            effective_to TEXT
        )"#,
        r#"CREATE TABLE ai_pricing_plan (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'pricing-plan-uuid',
            tenant_id INTEGER NOT NULL DEFAULT 10,
            organization_id INTEGER NOT NULL DEFAULT 20,
            data_scope INTEGER NOT NULL DEFAULT 1,
            plan_code TEXT NOT NULL,
            plan_name TEXT,
            plan_scope INTEGER,
            base_price_side INTEGER NOT NULL,
            default_multiplier TEXT NOT NULL,
            default_markup_amount TEXT NOT NULL,
            currency TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            updated_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            status INTEGER NOT NULL,
            deleted_at TEXT,
            priority INTEGER NOT NULL,
            effective_from TEXT,
            effective_to TEXT
        )"#,
        r#"CREATE TABLE ai_pricing_plan_binding (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'pricing-plan-binding-uuid',
            tenant_id INTEGER NOT NULL DEFAULT 10,
            organization_id INTEGER NOT NULL DEFAULT 20,
            data_scope INTEGER NOT NULL DEFAULT 1,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            updated_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            deleted_at TEXT,
            pricing_plan_id INTEGER,
            pricing_plan_code TEXT,
            subject_type INTEGER,
            subject_id INTEGER,
            subject_code TEXT,
            binding_source INTEGER,
            multiplier_override TEXT,
            priority INTEGER,
            effective_from TEXT,
            effective_to TEXT
        )"#,
        r#"CREATE TABLE ai_pricing_rule (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'pricing-rule-uuid',
            tenant_id INTEGER NOT NULL DEFAULT 10,
            organization_id INTEGER NOT NULL DEFAULT 20,
            data_scope INTEGER NOT NULL DEFAULT 1,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            updated_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            deleted_at TEXT,
            pricing_plan_id INTEGER,
            pricing_plan_code TEXT,
            rule_code TEXT,
            model TEXT,
            provider_code TEXT,
            channel_id INTEGER,
            billing_meter_code TEXT,
            price_side INTEGER,
            multiplier TEXT,
            markup_amount TEXT,
            unit_price_override TEXT,
            priority INTEGER,
            effective_from TEXT,
            effective_to TEXT
        )"#,
        r#"CREATE TABLE ai_pricing_tier (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'pricing-tier-uuid',
            tenant_id INTEGER NOT NULL DEFAULT 10,
            organization_id INTEGER NOT NULL DEFAULT 20,
            data_scope INTEGER NOT NULL DEFAULT 1,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            updated_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            deleted_at TEXT,
            pricing_rule_id INTEGER,
            model_pricing_id INTEGER,
            tier_code TEXT,
            billing_meter_code TEXT,
            min_quantity TEXT,
            max_quantity TEXT,
            input_unit_price TEXT,
            output_unit_price TEXT,
            multiplier TEXT,
            currency TEXT,
            sort_order INTEGER,
            effective_from TEXT,
            effective_to TEXT
        )"#,
        r#"CREATE TABLE iam_gateway_api_key_group (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
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
            deleted_by INTEGER,
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
        r#"CREATE TABLE ai_request_trace (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            request_id TEXT NOT NULL,
            trace_id TEXT,
            status INTEGER NOT NULL,
            attempt_no INTEGER,
            api_key_id INTEGER,
            api_key_name_snapshot TEXT,
            api_key_group_id INTEGER,
            api_key_group_snapshot TEXT,
            owner_type INTEGER,
            owner_id INTEGER,
            channel_id INTEGER,
            channel_name_snapshot TEXT,
            requested_model TEXT,
            provider_model TEXT,
            endpoint TEXT,
            request_path TEXT,
            http_method TEXT,
            http_status INTEGER,
            started_at TEXT,
            ended_at TEXT,
            streaming INTEGER,
            prompt_tokens INTEGER,
            cached_tokens INTEGER,
            completion_tokens INTEGER,
            total_tokens INTEGER,
            UNIQUE (tenant_id, organization_id, request_id, attempt_no)
        )"#,
        r#"CREATE TABLE ai_usage_fact (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            request_id TEXT NOT NULL,
            trace_id TEXT,
            status INTEGER NOT NULL,
            api_key_id INTEGER,
            api_key_name_snapshot TEXT,
            api_key_group_id INTEGER,
            api_key_group_snapshot TEXT,
            owner_type INTEGER,
            owner_id INTEGER,
            model TEXT,
            channel_id INTEGER,
            modality INTEGER,
            usage_type INTEGER,
            billing_meter_code TEXT,
            billable_quantity TEXT,
            prompt_tokens INTEGER,
            cached_tokens INTEGER,
            completion_tokens INTEGER,
            total_tokens INTEGER,
            request_count INTEGER,
            unit_price_snapshot TEXT,
            base_input_unit_price TEXT,
            base_output_unit_price TEXT,
            upstream_cost_amount TEXT,
            customer_charge_amount TEXT,
            cost_amount TEXT,
            currency TEXT,
            pricing_plan_code TEXT,
            pricing_snapshot TEXT,
            occurred_at TEXT,
            settlement_status INTEGER,
            settlement_id INTEGER,
            UNIQUE (tenant_id, organization_id, request_id, usage_type)
        )"#,
        r#"CREATE TABLE commerce_usage_settlement (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER,
            request_id TEXT,
            trace_id TEXT,
            status INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            metadata TEXT NOT NULL,
            settlement_no TEXT,
            usage_fact_id INTEGER NOT NULL,
            account_id INTEGER,
            account_history_id INTEGER,
            asset_type INTEGER,
            direction INTEGER,
            amount TEXT,
            points INTEGER,
            tokens INTEGER,
            currency TEXT,
            price_snapshot TEXT,
            settlement_status INTEGER,
            settled_at TEXT,
            failure_code TEXT,
            failure_message TEXT,
            UNIQUE (tenant_id, organization_id, usage_fact_id)
        )"#,
        r#"CREATE TABLE plus_account (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL,
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
            status INTEGER NOT NULL,
            UNIQUE (tenant_id, organization_id, user_id, account_type)
        )"#,
        r#"CREATE TABLE plus_account_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL,
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
        r#"CREATE TABLE ai_model_pricing (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'model-pricing-uuid',
            tenant_id INTEGER NOT NULL DEFAULT 10,
            organization_id INTEGER NOT NULL DEFAULT 20,
            data_scope INTEGER NOT NULL DEFAULT 1,
            model_id INTEGER,
            catalog_key TEXT NOT NULL,
            model TEXT NOT NULL,
            vendor_code TEXT,
            region_code TEXT NOT NULL,
            price_side INTEGER NOT NULL,
            pricing_scope INTEGER DEFAULT 1,
            billing_type INTEGER,
            billing_mode INTEGER,
            billing_meter_id INTEGER,
            billing_meter_code TEXT NOT NULL,
            price_item_type INTEGER,
            unit INTEGER,
            unit_price TEXT NOT NULL,
            currency TEXT NOT NULL,
            provider_code TEXT,
            channel_id INTEGER,
            pricing_plan_id INTEGER,
            pricing_plan_code TEXT,
            unit_size TEXT,
            metering_mode INTEGER,
            quantity_source INTEGER,
            minimum_quantity TEXT,
            quantity_step TEXT,
            included_quantity TEXT,
            rounding_mode INTEGER,
            min_charge_amount TEXT,
            pricing_formula_mode INTEGER,
            price_origin INTEGER,
            reference_multiplier TEXT,
            markup_amount TEXT,
            price_version TEXT,
            source_url TEXT,
            observed_at TEXT,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            updated_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            status INTEGER NOT NULL,
            deleted_at TEXT,
            deleted_by INTEGER,
            effective_from TEXT,
            effective_to TEXT,
            priority INTEGER NOT NULL
        )"#,
        r#"CREATE TABLE ai_pricing_import_snapshot (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL DEFAULT 10,
            organization_id INTEGER NOT NULL DEFAULT 20,
            user_id INTEGER,
            request_id TEXT,
            trace_id TEXT,
            payload_hash TEXT,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            retention_until TEXT,
            legal_hold INTEGER NOT NULL DEFAULT 0,
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
        r#"CREATE TABLE ai_model_rank_snapshot (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL DEFAULT 'model-rank-snapshot-uuid',
            tenant_id INTEGER NOT NULL DEFAULT 10,
            organization_id INTEGER NOT NULL DEFAULT 20,
            source_type TEXT,
            source_id INTEGER,
            source_version INTEGER,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            updated_at TEXT NOT NULL DEFAULT '2026-04-10 20:55:41',
            rebuild_version INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            snapshot_date TEXT,
            snapshot_period INTEGER,
            rank_scope TEXT,
            model_id INTEGER,
            catalog_key TEXT NOT NULL,
            model TEXT,
            vendor_code TEXT,
            region_code TEXT NOT NULL,
            vendor_name_snapshot TEXT,
            provider_code TEXT,
            modality INTEGER,
            rank_no INTEGER,
            previous_rank_no INTEGER,
            request_count INTEGER,
            token_count INTEGER,
            cost_amount TEXT,
            currency TEXT
        )"#,
    ] {
        sqlx::query(statement).execute(pool).await?;
    }
    Ok(())
}

async fn seed_catalog(pool: &SqlitePool) -> anyhow::Result<()> {
    for statement in [
        "INSERT INTO ai_model_vendor (id, uuid, tenant_id, organization_id, vendor_code, display_name, status, sort_order) VALUES (1, 'vendor-openai', 10, 20, 'openai', 'OpenAI', 1, 1)",
        r#"INSERT INTO ai_model_vendor_region
            (id, uuid, tenant_id, organization_id, vendor_id, vendor_code, region_code, display_name, market_scope, billing_currency, billing_jurisdiction, operating_regions, capabilities, status, sort_order)
            VALUES (1, 'vendor-region-openai-global', 10, 20, 1, 'openai', 'global', 'OpenAI Global', 'global', 'USD', 'US', '["GLOBAL"]', '["chat","responses","embedding"]', 1, 1)"#,
        "INSERT INTO ai_model_family (id, uuid, tenant_id, organization_id, vendor_id, vendor_code, region_code, family_code, display_name, status, sort_order) VALUES (1, 'family-openai-global-gpt-4o', 10, 20, 1, 'openai', 'global', 'gpt-4o', 'GPT-4o', 1, 1)",
        r#"INSERT INTO ai_model
            (id, uuid, tenant_id, organization_id, catalog_key, model, display_name, vendor_id, vendor_code, region_code, vendor_name_snapshot, family_id, family_code, capability, capabilities, modalities, supports_streaming, supports_tools, supports_json_schema, api_format, shelf_state, routing_state, status, rank_score)
            VALUES (1, 'model-openai-global-gpt-4o-mini', 10, 20, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 'GPT-4o mini', 1, 'openai', 'global', 'OpenAI', 1, 'gpt-4o', 1, '["chat","responses"]', '["chat"]', 1, 1, 1, 'openai_responses', 1, 1, 1, '100.0')"#,
        r#"INSERT INTO ai_model
            (id, uuid, tenant_id, organization_id, catalog_key, model, display_name, vendor_id, vendor_code, region_code, vendor_name_snapshot, family_id, family_code, capability, capabilities, modalities, input_modalities, output_modalities, supports_streaming, supports_tools, supports_json_schema, api_format, shelf_state, routing_state, status, rank_score)
            VALUES (2, 'model-openai-global-text-embedding-3-small', 10, 20, 'openai/global/text-embedding-3-small', 'text-embedding-3-small', 'Text Embedding 3 Small', 1, 'openai', 'global', 'OpenAI', 1, 'gpt-4o', 1, '["embedding"]', '["embedding"]', '["embedding"]', '["embedding"]', 0, 0, 0, 'openai-compatible', 1, 1, 1, '50.0')"#,
        "INSERT INTO ai_model_capability (id, uuid, tenant_id, organization_id, model_id, catalog_key, model, vendor_code, region_code, capability, capability_code, modality, input_modalities, output_modalities, supported, status, sort_order) VALUES (1, 'cap-openai-global-gpt-4o-mini-chat', 10, 20, 1, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 'openai', 'global', 1, 'chat', 1, '[\"text\"]', '[\"text\"]', 1, 1, 1)",
        "INSERT INTO ai_model_capability (id, uuid, tenant_id, organization_id, model_id, catalog_key, model, vendor_code, region_code, capability, capability_code, modality, input_modalities, output_modalities, supported, status, sort_order) VALUES (2, 'cap-openai-global-text-embedding-3-small', 10, 20, 2, 'openai/global/text-embedding-3-small', 'text-embedding-3-small', 'openai', 'global', 1, 'embedding', 1, '[\"embedding\"]', '[\"embedding\"]', 1, 1, 2)",
        "INSERT INTO integration_provider (id, provider_code, integration_type, upstream_vendor_code, upstream_provider_code, base_url_template, status) VALUES (2, 'openrouter', 3, 'openai', 'openrouter', 'http://provider-proxy.internal/openrouter-template', 1)",
        "INSERT INTO integration_provider_account (id, provider_code, secret_ref, status) VALUES (9002, 'openrouter', 'vault://providers/openrouter/account/main', 1)",
        "INSERT INTO integration_channel (id, provider_code, base_url_override, account_id, status, priority, weight) VALUES (3001, 'openrouter', 'http://provider-proxy.internal/openrouter', 9002, 1, 10, 100)",
        "INSERT INTO integration_channel_model (id, uuid, tenant_id, organization_id, catalog_key, model, vendor_code, channel_id, provider_model, status) VALUES (1, 'channel-model-openai-global-gpt-4o-mini', 10, 20, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 'openai', 3001, 'openai/global/gpt-4o-mini', 1)",
        "INSERT INTO integration_channel_model (id, uuid, tenant_id, organization_id, catalog_key, model, vendor_code, channel_id, provider_model, status) VALUES (2, 'channel-model-openai-global-text-embedding-3-small', 10, 20, 'openai/global/text-embedding-3-small', 'text-embedding-3-small', 'openai', 3001, 'openai/global/text-embedding-3-small', 1)",
        r#"INSERT INTO ai_routing_profile
            (id, uuid, tenant_id, organization_id, policy_id, profile_version, profile_name, release_status, traffic_percent, config_hash, status)
            VALUES (9101, 'routing-profile-standard-group', 10, 20, 9001, 1, 'Standard Group Profile', 2, '100.000000', 'standard-group-profile-hash', 1)"#,
        r#"INSERT INTO ai_routing_policy
            (id, uuid, tenant_id, organization_id, policy_code, name, policy_scope, subject_id, capability, default_profile_id, fallback_mode, status)
            VALUES (9001, 'routing-policy-standard-group', 10, 20, 'standard-group-policy', 'Standard Group Policy', 5, 10, NULL, 9101, 1, 1)"#,
        r#"INSERT INTO ai_routing_rule
            (id, uuid, tenant_id, organization_id, profile_id, rule_code, priority, match_expression, target_model, candidate_channels, fallback_chain, constraints, status)
            VALUES (9102, 'routing-rule-standard-group-default', 10, 20, 9101, 'standard-group-default', 1, '{"catalogKey":"*"}', NULL, '[{"channel_id":3001,"weight":100}]', '[]', '{}', 1)"#,
        "INSERT INTO ai_pricing_plan (id, uuid, tenant_id, organization_id, plan_code, plan_name, plan_scope, base_price_side, default_multiplier, default_markup_amount, currency, status, priority) VALUES (1, 'pricing-plan-standard', 10, 20, 'standard', 'Standard', 1, 1, '1.200000', '0.000000', 'USD', 1, 1)",
        "INSERT INTO ai_pricing_plan_binding (id, uuid, tenant_id, organization_id, pricing_plan_id, pricing_plan_code, subject_type, subject_id, subject_code, multiplier_override, status, priority) VALUES (1, 'pricing-plan-binding-standard-group', 10, 20, 1, 'standard', 1, 10, 'standard-group', '1.000000', 1, 1)",
        "INSERT INTO iam_gateway_api_key_group (id, code, pricing_plan_code, rate_multiplier, official_price_multiplier, status) VALUES (10, 'standard-group', 'standard', '1.000000', '1.100000', 1)",
        "INSERT INTO iam_gateway_api_key (id, tenant_id, organization_id, user_id, group_id, key_prefix, key_hash, idempotency_key, status) VALUES (100, 10, 20, 30, 10, 'sk-live', 'hash:placeholder', 'seed-api-key-100', 1)",
        "INSERT INTO ai_model_pricing (id, uuid, tenant_id, organization_id, model_id, catalog_key, model, vendor_code, region_code, price_side, billing_meter_code, unit_price, currency, status, priority) VALUES (1, 'price-openai-global-gpt-4o-mini-input-reference', 10, 20, 1, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 'openai', 'global', 1, 'llm_input_token', '0.150000', 'USD', 1, 1)",
        "INSERT INTO ai_model_pricing (id, uuid, tenant_id, organization_id, model_id, catalog_key, model, vendor_code, region_code, price_side, billing_meter_code, unit_price, currency, provider_code, channel_id, status, priority) VALUES (2, 'price-openai-global-gpt-4o-mini-input-upstream', 10, 20, 1, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 'openai', 'global', 2, 'llm_input_token', '0.110000', 'USD', 'openrouter', 3001, 1, 1)",
        "INSERT INTO ai_model_pricing (id, uuid, tenant_id, organization_id, model_id, catalog_key, model, vendor_code, region_code, price_side, billing_meter_code, unit_price, currency, status, priority) VALUES (3, 'price-openai-global-gpt-4o-mini-output-reference', 10, 20, 1, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 'openai', 'global', 1, 'llm_output_token', '0.600000', 'USD', 1, 1)",
        "INSERT INTO ai_model_pricing (id, uuid, tenant_id, organization_id, model_id, catalog_key, model, vendor_code, region_code, price_side, billing_meter_code, unit_price, currency, provider_code, channel_id, status, priority) VALUES (4, 'price-openai-global-gpt-4o-mini-output-upstream', 10, 20, 1, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 'openai', 'global', 2, 'llm_output_token', '0.440000', 'USD', 'openrouter', 3001, 1, 1)",
        "INSERT INTO ai_model_pricing (id, uuid, tenant_id, organization_id, model_id, catalog_key, model, vendor_code, region_code, price_side, billing_meter_code, unit_price, currency, status, priority) VALUES (5, 'price-openai-global-text-embedding-3-small-input-reference', 10, 20, 2, 'openai/global/text-embedding-3-small', 'text-embedding-3-small', 'openai', 'global', 1, 'embedding_input_token', '0.020000', 'USD', 1, 1)",
        "INSERT INTO ai_model_pricing (id, uuid, tenant_id, organization_id, model_id, catalog_key, model, vendor_code, region_code, price_side, billing_meter_code, unit_price, currency, provider_code, channel_id, status, priority) VALUES (6, 'price-openai-global-text-embedding-3-small-input-upstream', 10, 20, 2, 'openai/global/text-embedding-3-small', 'text-embedding-3-small', 'openai', 'global', 2, 'embedding_input_token', '0.010000', 'USD', 'openrouter', 3001, 1, 1)",
        "INSERT INTO ai_pricing_import_snapshot (id, uuid, tenant_id, organization_id, request_id, status, import_source, source_name, source_hash, data_format, row_count, accepted_count, rejected_count, currency, observed_at) VALUES (1, 'pricing-import-seed', 10, 20, 'seed-pricing-import', 1, 1, 'seed', 'seed-hash', 'database', 6, 6, 0, 'USD', '2026-04-10 20:55:41')",
        "INSERT INTO ai_model_rank_snapshot (id, uuid, tenant_id, organization_id, source_type, source_id, source_version, status, snapshot_date, snapshot_period, rank_scope, model_id, catalog_key, model, vendor_code, region_code, vendor_name_snapshot, modality, rank_no, request_count, cost_amount, currency) VALUES (1, 'rank-openai-global-gpt-4o-mini', 10, 20, 'seed', 1, 1, 1, '2026-04-10', 1, 'global', 1, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 'openai', 'global', 'OpenAI', 1, 1, 100, '0.000000', 'USD')",
    ] {
        sqlx::query(statement).execute(pool).await?;
    }
    Ok(())
}

async fn seed_billing_meters(pool: &SqlitePool) -> anyhow::Result<()> {
    for (index, (meter_code, display_name)) in BILLING_METER_CODES.iter().enumerate() {
        sqlx::query(
            r#"
            INSERT INTO ai_billing_meter
                (id, uuid, tenant_id, organization_id, meter_code, display_name, status, sort_order)
            VALUES
                (?, ?, 10, 20, ?, ?, 1, ?)
            "#,
        )
        .bind((index + 1) as i64)
        .bind(format!("meter-{meter_code}"))
        .bind(meter_code)
        .bind(display_name)
        .bind((index + 1) as i64)
        .execute(pool)
        .await?;
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use sdkwork_claw_http::{
        inject_verified_trusted_request_subject, verify_app_session_authorization_header,
    };
    use sqlx::Row;

    use axum::http::{HeaderMap, HeaderValue};

    use super::seeded_sqlite_catalog;

    #[tokio::test]
    async fn seeded_sqlite_catalog_reopens_pool_for_real_route_tests() {
        let catalog = seeded_sqlite_catalog().await.unwrap();
        let pool = catalog.open_pool().await.unwrap();

        let row =
            sqlx::query("SELECT catalog_key, model, display_name FROM ai_model WHERE catalog_key = 'openai/global/gpt-4o-mini'")
                .fetch_one(&pool)
                .await
                .unwrap();

        assert_eq!(
            "openai/global/gpt-4o-mini",
            row.get::<String, _>("catalog_key")
        );
        assert_eq!("gpt-4o-mini", row.get::<String, _>("model"));
        assert_eq!("GPT-4o mini", row.get::<String, _>("display_name"));
    }

    #[tokio::test]
    async fn seeded_sqlite_catalog_contains_embedding_model_and_route() {
        let catalog = seeded_sqlite_catalog().await.unwrap();
        let pool = catalog.open_pool().await.unwrap();

        let row = sqlx::query(
            r#"
            SELECT m.model, cm.provider_model
            FROM ai_model m
            JOIN integration_channel_model cm ON cm.catalog_key = m.catalog_key
            WHERE m.catalog_key = 'openai/global/text-embedding-3-small'
            "#,
        )
        .fetch_one(&pool)
        .await
        .unwrap();

        assert_eq!("text-embedding-3-small", row.get::<String, _>("model"));
        assert_eq!(
            "openai/global/text-embedding-3-small",
            row.get::<String, _>("provider_model")
        );
    }

    #[tokio::test]
    async fn seeded_sqlite_catalog_can_seed_usage_settlement_points_account() {
        let catalog = seeded_sqlite_catalog().await.unwrap();
        let pool = catalog.open_pool().await.unwrap();

        catalog
            .seed_usage_settlement_points_account(&pool, 701, 1000)
            .await
            .unwrap();

        let points: i64 =
            sqlx::query_scalar("SELECT available_points FROM plus_account WHERE id = 701")
                .fetch_one(&pool)
                .await
                .unwrap();
        assert_eq!(1000, points);
    }

    #[tokio::test]
    async fn seeded_sqlite_catalog_exposes_standard_gateway_auth_fixture() {
        let catalog = seeded_sqlite_catalog().await.unwrap();

        assert_eq!("sk-live-unified-sqlite", catalog.gateway_api_key());
        assert_eq!(
            "Bearer sk-live-unified-sqlite",
            catalog.gateway_authorization_header()
        );
        assert!(catalog.api_key_security_config().is_ok());
    }

    #[tokio::test]
    async fn seeded_sqlite_catalog_exposes_standard_runtime_security_configs() {
        let catalog = seeded_sqlite_catalog().await.unwrap();

        assert!(catalog.trusted_subject_config().is_ok());
        assert!(catalog.app_session_config().is_ok());
        assert!(catalog.payment_webhook_config().is_ok());
    }

    #[tokio::test]
    async fn standard_runtime_subject_helpers_create_verifiable_tokens_and_signatures() {
        let subject = super::default_trusted_request_subject();
        let issued_at = 1_800_000_000;
        let expires_at = issued_at + 300;
        let authorization =
            super::app_session_bearer_token(subject, issued_at, expires_at).unwrap();

        let verified_subject = verify_app_session_authorization_header(
            &super::app_session_config().unwrap(),
            authorization.as_str(),
            issued_at + 1,
        )
        .unwrap();

        assert_eq!(10, verified_subject.tenant_id);
        assert_eq!(20, verified_subject.organization_id);
        assert_eq!(30, verified_subject.user_id);

        let signature = super::trusted_subject_signature(
            subject,
            issued_at,
            "GET",
            "/backend/v3/api/ai/models",
        )
        .unwrap();
        let mut headers = HeaderMap::new();
        headers.insert("x-sdkwork-subject-tenant-id", subject.tenant_id.into());
        headers.insert(
            "x-sdkwork-subject-organization-id",
            subject.organization_id.into(),
        );
        headers.insert("x-sdkwork-subject-user-id", subject.user_id.into());
        headers.insert("x-sdkwork-subject-timestamp", issued_at.into());
        headers.insert(
            "x-sdkwork-subject-signature",
            HeaderValue::from_str(signature.as_str()).unwrap(),
        );

        inject_verified_trusted_request_subject(
            &mut headers,
            "GET",
            "/backend/v3/api/ai/models",
            &super::trusted_subject_config().unwrap(),
            issued_at + 1,
        )
        .unwrap();

        assert_eq!("10", headers["x-sdkwork-tenant-id"]);
        assert_eq!("20", headers["x-sdkwork-organization-id"]);
        assert_eq!("30", headers["x-sdkwork-user-id"]);
    }
}
