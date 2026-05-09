use crate::domain::{
    AiModel, AiModelPublicMetadata, ApiKeyGroup, ApiKeyGroupMetricSnapshot, BillingMeter,
    DecimalValue, DomainError, DomainResult, GatewayAccessPolicy, GatewayApiKey, ModelPrice,
    ModelProviderRoute, ModelVendor, ModelVendorDefinition, Money, PriceSide, PricingPlan,
    ProviderRetryPolicy, QuotaPolicy,
};

pub struct ModelVendorRow {
    pub vendor_code: String,
    pub display_name: String,
}

impl ModelVendorRow {
    pub fn try_into_domain(self) -> DomainResult<ModelVendorDefinition> {
        Ok(ModelVendorDefinition {
            vendor: ModelVendor::from_code(&self.vendor_code),
            vendor_code: self.vendor_code,
            display_name: self.display_name,
        })
    }
}

pub struct AiModelRow {
    pub catalog_key: String,
    pub model: String,
    pub display_name: String,
    pub vendor_code: String,
    pub region_code: String,
    pub capabilities_json: String,
    pub description: Option<String>,
    pub modalities_json: String,
    pub input_modalities_json: String,
    pub output_modalities_json: String,
    pub api_format: Option<String>,
    pub capability_intro: Option<String>,
    pub limitations_json: String,
    pub supported_languages_json: String,
    pub use_cases_json: String,
    pub training_data_cutoff: Option<String>,
    pub context_tokens: Option<i64>,
    pub max_output_tokens: Option<i64>,
    pub supports_streaming: bool,
    pub supports_tools: bool,
    pub supports_json_schema: bool,
    pub release_stage: Option<i32>,
    pub shelf_state: Option<i32>,
    pub routing_state: Option<i32>,
    pub replacement_model: Option<String>,
}

impl AiModelRow {
    pub fn try_into_domain(self) -> DomainResult<AiModel> {
        let model = AiModel {
            catalog_key: self.catalog_key,
            model: self.model,
            display_name: self.display_name,
            vendor_code: self.vendor_code,
            region_code: self.region_code,
            capabilities: parse_string_array(&self.capabilities_json, "capabilities")?,
            description: None,
            modalities: Vec::new(),
            input_modalities: Vec::new(),
            output_modalities: Vec::new(),
            api_format: None,
            capability_intro: None,
            limitations: Vec::new(),
            supported_languages: Vec::new(),
            use_cases: Vec::new(),
            training_data_cutoff: None,
            context_tokens: None,
            max_output_tokens: None,
            supports_streaming: false,
            supports_tools: false,
            supports_json_schema: false,
            release_stage: None,
            shelf_state: None,
            routing_state: None,
            replacement_model: None,
        };
        Ok(model.with_public_metadata(AiModelPublicMetadata {
            description: self.description,
            modalities: parse_string_array(&self.modalities_json, "modalities")?,
            input_modalities: parse_string_array(&self.input_modalities_json, "input_modalities")?,
            output_modalities: parse_string_array(
                &self.output_modalities_json,
                "output_modalities",
            )?,
            api_format: self.api_format,
            capability_intro: self.capability_intro,
            limitations: parse_string_array(&self.limitations_json, "limitations")?,
            supported_languages: parse_string_array(
                &self.supported_languages_json,
                "supported_languages",
            )?,
            use_cases: parse_string_array(&self.use_cases_json, "use_cases")?,
            training_data_cutoff: self.training_data_cutoff,
            context_tokens: self.context_tokens,
            max_output_tokens: self.max_output_tokens,
            supports_streaming: self.supports_streaming,
            supports_tools: self.supports_tools,
            supports_json_schema: self.supports_json_schema,
            release_stage: self.release_stage,
            shelf_state: self.shelf_state,
            routing_state: self.routing_state,
            replacement_model: self.replacement_model,
        }))
    }
}

pub struct ModelProviderRouteRow {
    pub catalog_key: String,
    pub model: String,
    pub provider_code: String,
    pub channel_id: i64,
    pub provider_model: String,
    pub base_url: Option<String>,
    pub secret_ref: Option<String>,
    pub timeout_ms: Option<i64>,
    pub retry_policy_json: Option<String>,
}

impl ModelProviderRouteRow {
    pub fn try_into_domain(self) -> DomainResult<ModelProviderRoute> {
        let timeout_ms = match self.timeout_ms {
            Some(timeout_ms) if timeout_ms <= 0 => {
                return Err(DomainError::new(format!(
                    "integration_channel.timeout_ms must be positive when configured: {timeout_ms}"
                )));
            }
            Some(timeout_ms) => Some(u64::try_from(timeout_ms).map_err(|error| {
                DomainError::new(format!("invalid integration_channel.timeout_ms: {error}"))
            })?),
            None => None,
        };
        let retry_policy = self
            .retry_policy_json
            .filter(|value| !value.trim().is_empty())
            .map(|value| ProviderRetryPolicy::from_json_str(&value))
            .transpose()?;

        Ok(ModelProviderRoute {
            catalog_key: self.catalog_key,
            model: self.model,
            provider_code: self.provider_code,
            channel_id: self.channel_id,
            provider_model: self.provider_model,
            base_url: self.base_url,
            secret_ref: self.secret_ref,
            timeout_ms,
            retry_policy,
        })
    }
}

pub struct GatewayApiKeyRow {
    pub id: i64,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
    pub group_id: i64,
    pub name: String,
    pub key_prefix: String,
    pub key_display_masked: String,
    pub key_hash: String,
    pub policy_id: Option<i64>,
    pub quota_policy_id: Option<i64>,
    pub created_at: String,
    pub expire_at: Option<String>,
    pub status_code: i32,
}

impl GatewayApiKeyRow {
    pub fn into_domain(self) -> GatewayApiKey {
        GatewayApiKey {
            id: self.id,
            tenant_id: self.tenant_id,
            organization_id: self.organization_id,
            user_id: self.user_id,
            group_id: self.group_id,
            name: self.name,
            key_prefix: self.key_prefix,
            key_display_masked: self.key_display_masked,
            key_hash: self.key_hash,
            policy_id: self.policy_id,
            quota_policy_id: self.quota_policy_id,
            created_at: self.created_at,
            expire_at: self.expire_at,
            status_code: self.status_code,
        }
    }
}

pub struct ApiKeyGroupRow {
    pub id: i64,
    pub code: String,
    pub pricing_plan_code: String,
    pub rate_multiplier: String,
    pub official_price_multiplier: String,
}

pub struct GatewayAccessPolicyRow {
    pub id: i64,
    pub allowed_capabilities_json: String,
    pub ip_allowlist_json: String,
}

impl GatewayAccessPolicyRow {
    pub fn try_into_domain(self) -> DomainResult<GatewayAccessPolicy> {
        Ok(GatewayAccessPolicy {
            id: self.id,
            allowed_capabilities: parse_string_array(
                &self.allowed_capabilities_json,
                "allowed_capabilities",
            )?,
            ip_allowlist: parse_string_array(&self.ip_allowlist_json, "ip_allowlist")?,
        })
    }
}

pub struct QuotaPolicyRow {
    pub id: i64,
    pub quota_limit: Option<String>,
}

impl QuotaPolicyRow {
    pub fn try_into_domain(self) -> DomainResult<QuotaPolicy> {
        Ok(QuotaPolicy {
            id: self.id,
            quota_limit: parse_optional_decimal(self.quota_limit)?,
        })
    }
}

pub struct ApiKeyGroupMetricSnapshotRow {
    pub group_id: i64,
    pub capacity_used: Option<String>,
    pub capacity_limit: Option<String>,
    pub usage_amount_total: Option<String>,
    pub snapshot_at: Option<String>,
}

impl ApiKeyGroupMetricSnapshotRow {
    pub fn try_into_domain(self) -> DomainResult<ApiKeyGroupMetricSnapshot> {
        Ok(ApiKeyGroupMetricSnapshot {
            group_id: self.group_id,
            capacity_used: parse_optional_decimal(self.capacity_used)?,
            capacity_limit: parse_optional_decimal(self.capacity_limit)?,
            usage_amount_total: parse_optional_decimal(self.usage_amount_total)?,
            snapshot_at: self.snapshot_at,
        })
    }
}

impl ApiKeyGroupRow {
    pub fn try_into_domain(self) -> DomainResult<ApiKeyGroup> {
        Ok(ApiKeyGroup {
            id: self.id,
            code: self.code,
            pricing_plan_code: self.pricing_plan_code,
            rate_multiplier: DecimalValue::parse(&self.rate_multiplier)?,
            official_price_multiplier: DecimalValue::parse(&self.official_price_multiplier)?,
        })
    }
}

pub struct PricingPlanRow {
    pub plan_code: String,
    pub base_price_side_code: String,
    pub default_multiplier: String,
    pub default_markup_amount: String,
    pub currency: String,
}

impl PricingPlanRow {
    pub fn try_into_domain(self) -> DomainResult<PricingPlan> {
        Ok(PricingPlan {
            plan_code: self.plan_code,
            base_price_side: parse_price_side(&self.base_price_side_code)?,
            default_multiplier: DecimalValue::parse(&self.default_multiplier)?,
            default_markup_amount: money_from_decimal(self.currency, self.default_markup_amount)?,
        })
    }
}

pub struct ModelPriceRow {
    pub catalog_key: String,
    pub model: String,
    pub price_side_code: String,
    pub billing_meter_code: String,
    pub unit_price: String,
    pub currency: String,
    pub provider_code: Option<String>,
    pub channel_id: Option<i64>,
    pub pricing_plan_code: Option<String>,
}

impl ModelPriceRow {
    pub fn try_into_domain(self) -> DomainResult<ModelPrice> {
        Ok(ModelPrice {
            catalog_key: self.catalog_key,
            model: self.model,
            price_side: parse_price_side(&self.price_side_code)?,
            billing_meter: BillingMeter::from_code(&self.billing_meter_code),
            unit_price: money_from_decimal(self.currency, self.unit_price)?,
            provider_code: self.provider_code,
            channel_id: self.channel_id,
            pricing_plan_code: self.pricing_plan_code,
        })
    }
}

fn parse_string_array(value: &str, field_name: &str) -> DomainResult<Vec<String>> {
    serde_json::from_str(value).map_err(|error| {
        DomainError::new(format!(
            "invalid {field_name} json array from database row: {error}"
        ))
    })
}

fn parse_price_side(value: &str) -> DomainResult<PriceSide> {
    match value {
        "official_reference" => Ok(PriceSide::OfficialReference),
        "upstream_cost" => Ok(PriceSide::UpstreamCost),
        "customer_charge" => Ok(PriceSide::CustomerCharge),
        "internal_transfer" => Ok(PriceSide::InternalTransfer),
        _ => Err(DomainError::new(format!(
            "unknown price side code: {value}"
        ))),
    }
}

fn money_from_decimal(currency: String, value: String) -> DomainResult<Money> {
    Ok(Money {
        currency,
        unit_price: DecimalValue::parse(&value)?,
    })
}

fn parse_optional_decimal(value: Option<String>) -> DomainResult<Option<DecimalValue>> {
    value
        .filter(|value| !value.trim().is_empty())
        .map(|value| DecimalValue::parse(&value))
        .transpose()
}
