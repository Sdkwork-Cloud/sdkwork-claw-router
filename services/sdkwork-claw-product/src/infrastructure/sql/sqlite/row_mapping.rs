use sqlx::sqlite::SqliteRow;
use sqlx::{Row, SqlitePool};

use crate::infrastructure::sql::rows::{
    AiModelRow, ApiKeyGroupMetricSnapshotRow, ApiKeyGroupRow, GatewayAccessPolicyRow,
    GatewayApiKeyRow, ModelPriceRow, ModelProviderRouteRow, ModelVendorRow, PricingPlanRow,
    ProviderChannelRouteRow, QuotaPolicyRow, RoutingPolicyRow, RoutingRuleRow,
};

pub async fn load_vendors(
    pool: &SqlitePool,
    sql: &'static str,
) -> Result<Vec<ModelVendorRow>, sqlx::Error> {
    map_query(sql, |row| {
        Ok(ModelVendorRow {
            vendor_code: row.try_get("vendor_code")?,
            display_name: row.try_get("display_name")?,
        })
    })
    .fetch(pool)
    .await
}

pub async fn load_models(
    pool: &SqlitePool,
    sql: &'static str,
) -> Result<Vec<AiModelRow>, sqlx::Error> {
    map_query(sql, |row| {
        Ok(AiModelRow {
            catalog_key: row.try_get("catalog_key")?,
            model: row.try_get("model")?,
            display_name: row.try_get("display_name")?,
            vendor_code: row.try_get("vendor_code")?,
            region_code: row.try_get("region_code")?,
            capabilities_json: row.try_get("capabilities_json")?,
            description: row.try_get("description")?,
            modalities_json: row.try_get("modalities_json")?,
            input_modalities_json: row.try_get("input_modalities_json")?,
            output_modalities_json: row.try_get("output_modalities_json")?,
            api_format: row.try_get("api_format")?,
            capability_intro: row.try_get("capability_intro")?,
            limitations_json: row.try_get("limitations_json")?,
            supported_languages_json: row.try_get("supported_languages_json")?,
            use_cases_json: row.try_get("use_cases_json")?,
            training_data_cutoff: row.try_get("training_data_cutoff")?,
            context_tokens: row.try_get("context_tokens")?,
            max_output_tokens: row.try_get("max_output_tokens")?,
            supports_streaming: row.try_get("supports_streaming")?,
            supports_tools: row.try_get("supports_tools")?,
            supports_json_schema: row.try_get("supports_json_schema")?,
            release_stage: row.try_get("release_stage")?,
            shelf_state: row.try_get("shelf_state")?,
            routing_state: row.try_get("routing_state")?,
            replacement_model: row.try_get("replacement_model")?,
        })
    })
    .fetch(pool)
    .await
}

pub async fn load_provider_routes(
    pool: &SqlitePool,
    sql: &'static str,
    circuit_breaker_recovery_window_seconds: i64,
) -> Result<Vec<ModelProviderRouteRow>, sqlx::Error> {
    let mapper = map_query(sql, |row| {
        Ok(ModelProviderRouteRow {
            catalog_key: row.try_get("catalog_key")?,
            model: row.try_get("model")?,
            region_code: row.try_get("region_code")?,
            provider_code: row.try_get("provider_code")?,
            channel_id: row.try_get("channel_id")?,
            provider_model: row.try_get("provider_model")?,
            base_url: row.try_get("base_url")?,
            secret_ref: row.try_get("secret_ref")?,
            auth_type: row.try_get("auth_type")?,
            auth_config_json: row.try_get("auth_config_json")?,
            timeout_ms: row.try_get("timeout_ms")?,
            retry_policy_json: row.try_get("retry_policy_json")?,
        })
    });
    sqlx::query(mapper.sql)
        .bind(circuit_breaker_recovery_window_seconds)
        .bind(circuit_breaker_recovery_window_seconds)
        .bind(circuit_breaker_recovery_window_seconds)
        .fetch_all(pool)
        .await?
        .into_iter()
        .map(mapper.mapper)
        .collect()
}

pub async fn load_provider_channel_routes(
    pool: &SqlitePool,
    sql: &'static str,
    circuit_breaker_recovery_window_seconds: i64,
) -> Result<Vec<ProviderChannelRouteRow>, sqlx::Error> {
    let mapper = map_query(sql, |row| {
        Ok(ProviderChannelRouteRow {
            provider_code: row.try_get("provider_code")?,
            channel_id: row.try_get("channel_id")?,
            region_code: row.try_get("region_code")?,
            base_url: row.try_get("base_url")?,
            secret_ref: row.try_get("secret_ref")?,
            auth_type: row.try_get("auth_type")?,
            auth_config_json: row.try_get("auth_config_json")?,
            timeout_ms: row.try_get("timeout_ms")?,
            retry_policy_json: row.try_get("retry_policy_json")?,
            group_bindings_json: row.try_get("group_bindings_json")?,
        })
    });
    sqlx::query(mapper.sql)
        .bind(circuit_breaker_recovery_window_seconds)
        .bind(circuit_breaker_recovery_window_seconds)
        .bind(circuit_breaker_recovery_window_seconds)
        .fetch_all(pool)
        .await?
        .into_iter()
        .map(mapper.mapper)
        .collect()
}

pub async fn load_routing_policies(
    pool: &SqlitePool,
    sql: &'static str,
) -> Result<Vec<RoutingPolicyRow>, sqlx::Error> {
    map_query(sql, |row| {
        Ok(RoutingPolicyRow {
            id: row.try_get("id")?,
            tenant_id: row.try_get("tenant_id")?,
            organization_id: row.try_get("organization_id")?,
            policy_code: row.try_get("policy_code")?,
            policy_scope: row.try_get("policy_scope")?,
            subject_id: row.try_get("subject_id")?,
            capability: row.try_get("capability")?,
            default_profile_id: row.try_get("default_profile_id")?,
            fallback_mode: row.try_get("fallback_mode")?,
        })
    })
    .fetch(pool)
    .await
}

pub async fn load_routing_rules(
    pool: &SqlitePool,
    sql: &'static str,
) -> Result<Vec<RoutingRuleRow>, sqlx::Error> {
    map_query(sql, |row| {
        Ok(RoutingRuleRow {
            id: row.try_get("id")?,
            tenant_id: row.try_get("tenant_id")?,
            organization_id: row.try_get("organization_id")?,
            profile_id: row.try_get("profile_id")?,
            rule_code: row.try_get("rule_code")?,
            priority: row.try_get("priority")?,
            match_expression_json: row.try_get("match_expression_json")?,
            target_model: row.try_get("target_model")?,
            candidate_channels_json: row.try_get("candidate_channels_json")?,
            fallback_chain_json: row.try_get("fallback_chain_json")?,
            constraints_json: row.try_get("constraints_json")?,
        })
    })
    .fetch(pool)
    .await
}

pub async fn load_pricing_plans(
    pool: &SqlitePool,
    sql: &'static str,
) -> Result<Vec<PricingPlanRow>, sqlx::Error> {
    map_query(sql, |row| {
        Ok(PricingPlanRow {
            plan_code: row.try_get("plan_code")?,
            base_price_side_code: row.try_get("base_price_side_code")?,
            default_multiplier: row.try_get("default_multiplier")?,
            default_markup_amount: row.try_get("default_markup_amount")?,
            currency: row.try_get("currency")?,
        })
    })
    .fetch(pool)
    .await
}

pub async fn load_api_key_groups(
    pool: &SqlitePool,
    sql: &'static str,
) -> Result<Vec<ApiKeyGroupRow>, sqlx::Error> {
    map_query(sql, |row| {
        Ok(ApiKeyGroupRow {
            id: row.try_get("id")?,
            tenant_id: row.try_get("tenant_id")?,
            organization_id: row.try_get("organization_id")?,
            name: row.try_get("name")?,
            code: row.try_get("code")?,
            pricing_plan_code: row.try_get("pricing_plan_code")?,
            rate_multiplier: row.try_get("rate_multiplier")?,
            official_price_multiplier: row.try_get("official_price_multiplier")?,
        })
    })
    .fetch(pool)
    .await
}

pub async fn load_api_keys(
    pool: &SqlitePool,
    sql: &'static str,
) -> Result<Vec<GatewayApiKeyRow>, sqlx::Error> {
    map_query(sql, |row| {
        Ok(GatewayApiKeyRow {
            id: row.try_get("id")?,
            tenant_id: row.try_get("tenant_id")?,
            organization_id: row.try_get("organization_id")?,
            user_id: row.try_get("user_id")?,
            group_id: row.try_get("group_id")?,
            name: row.try_get("name")?,
            key_prefix: row.try_get("key_prefix")?,
            key_display_masked: row.try_get("key_display_masked")?,
            key_hash: row.try_get("key_hash")?,
            copyable_key: row.try_get("copyable_key")?,
            policy_id: row.try_get("policy_id")?,
            quota_policy_id: row.try_get("quota_policy_id")?,
            created_at: row.try_get("created_at")?,
            expire_at: row.try_get("expire_at")?,
            status_code: row.try_get("status_code")?,
            default_for_runtime: row.try_get("default_for_runtime")?,
        })
    })
    .fetch(pool)
    .await
}

pub async fn load_access_policies(
    pool: &SqlitePool,
    sql: &'static str,
) -> Result<Vec<GatewayAccessPolicyRow>, sqlx::Error> {
    map_query(sql, |row| {
        Ok(GatewayAccessPolicyRow {
            id: row.try_get("id")?,
            allowed_capabilities_json: row.try_get("allowed_capabilities_json")?,
            ip_allowlist_json: row.try_get("ip_allowlist_json")?,
        })
    })
    .fetch(pool)
    .await
}

pub async fn load_quota_policies(
    pool: &SqlitePool,
    sql: &'static str,
) -> Result<Vec<QuotaPolicyRow>, sqlx::Error> {
    map_query(sql, |row| {
        Ok(QuotaPolicyRow {
            id: row.try_get("id")?,
            quota_limit: row.try_get("quota_limit")?,
        })
    })
    .fetch(pool)
    .await
}

pub async fn load_api_key_group_metric_snapshots(
    pool: &SqlitePool,
    sql: &'static str,
) -> Result<Vec<ApiKeyGroupMetricSnapshotRow>, sqlx::Error> {
    map_query(sql, |row| {
        Ok(ApiKeyGroupMetricSnapshotRow {
            group_id: row.try_get("group_id")?,
            capacity_used: row.try_get("capacity_used")?,
            capacity_limit: row.try_get("capacity_limit")?,
            usage_amount_total: row.try_get("usage_amount_total")?,
            snapshot_at: row.try_get("snapshot_at")?,
        })
    })
    .fetch(pool)
    .await
}

pub async fn load_prices(
    pool: &SqlitePool,
    sql: &'static str,
) -> Result<Vec<ModelPriceRow>, sqlx::Error> {
    map_query(sql, |row| {
        Ok(ModelPriceRow {
            catalog_key: row.try_get("catalog_key")?,
            model: row.try_get("model")?,
            region_code: row.try_get("region_code")?,
            price_side_code: row.try_get("price_side_code")?,
            billing_meter_code: row.try_get("billing_meter_code")?,
            unit_price: row.try_get("unit_price")?,
            currency: row.try_get("currency")?,
            provider_code: row.try_get("provider_code")?,
            channel_id: row.try_get("channel_id")?,
            pricing_plan_code: row.try_get("pricing_plan_code")?,
        })
    })
    .fetch(pool)
    .await
}

struct QueryMapper<T, F>
where
    F: Fn(SqliteRow) -> Result<T, sqlx::Error>,
{
    sql: &'static str,
    mapper: F,
}

impl<T, F> QueryMapper<T, F>
where
    F: Fn(SqliteRow) -> Result<T, sqlx::Error>,
{
    async fn fetch(self, pool: &SqlitePool) -> Result<Vec<T>, sqlx::Error> {
        sqlx::query(self.sql)
            .fetch_all(pool)
            .await?
            .into_iter()
            .map(self.mapper)
            .collect()
    }
}

fn map_query<T, F>(sql: &'static str, mapper: F) -> QueryMapper<T, F>
where
    F: Fn(SqliteRow) -> Result<T, sqlx::Error>,
{
    QueryMapper { sql, mapper }
}
