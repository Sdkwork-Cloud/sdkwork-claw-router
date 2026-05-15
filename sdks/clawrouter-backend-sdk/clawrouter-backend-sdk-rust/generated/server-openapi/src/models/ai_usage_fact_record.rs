use serde::{Deserialize, Serialize};

/// Ai usage fact record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiUsageFactRecord {
    /// Api key group id field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_key_group_id: Option<String>,

    /// Api key group snapshot field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_key_group_snapshot: Option<String>,

    /// Api key id field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_key_id: Option<String>,

    /// Api key name snapshot field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_key_name_snapshot: Option<String>,

    /// Audio seconds field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub audio_seconds: Option<String>,

    /// Bandwidth bytes field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub bandwidth_bytes: Option<String>,

    /// Base input unit price field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub base_input_unit_price: Option<String>,

    /// Base output unit price field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub base_output_unit_price: Option<String>,

    /// Billable quantity field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billable_quantity: Option<String>,

    /// Billable unit field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billable_unit: Option<String>,

    /// Billing meter code field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_meter_code: Option<String>,

    /// Billing meter id field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_meter_id: Option<String>,

    /// Billing mode field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_mode: Option<String>,

    /// Billing tier field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_tier: Option<String>,

    /// Billing type field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_type: Option<String>,

    /// Cache read unit price field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cache_read_unit_price: Option<String>,

    /// Cached tokens field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cached_tokens: Option<String>,

    /// Catalog key field on ai usage fact record.
    pub catalog_key: String,

    /// Channel id field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_id: Option<String>,

    /// Character count field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub character_count: Option<String>,

    /// Completion tokens field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completion_tokens: Option<String>,

    /// Cost amount field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cost_amount: Option<String>,

    /// Created at field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Customer charge amount field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub customer_charge_amount: Option<String>,

    /// Decision log id field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub decision_log_id: Option<String>,

    /// Id field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Image count field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub image_count: Option<String>,

    /// Item count field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub item_count: Option<String>,

    /// Legacy api key id field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legacy_api_key_id: Option<String>,

    /// Legal hold field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Modality field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub modality: Option<String>,

    /// Model field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Occurred at field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub occurred_at: Option<String>,

    /// Official reference amount field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub official_reference_amount: Option<String>,

    /// Organization id field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner name snapshot field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_name_snapshot: Option<String>,

    /// Owner type field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Payload hash field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Pricing id field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_id: Option<String>,

    /// Pricing plan code field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_plan_code: Option<String>,

    /// Pricing plan id field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_plan_id: Option<String>,

    /// Pricing rule id field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_rule_id: Option<String>,

    /// Pricing snapshot field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Pricing tier id field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_tier_id: Option<String>,

    /// Prompt tokens field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub prompt_tokens: Option<String>,

    /// Provider account id field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_account_id: Option<String>,

    /// Provider id field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_id: Option<String>,

    /// Rate multiplier field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rate_multiplier: Option<String>,

    /// Reasoning effort field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reasoning_effort: Option<String>,

    /// Reference multiplier field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reference_multiplier: Option<String>,

    /// Request count field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_count: Option<String>,

    /// Request id field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Result count field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub result_count: Option<String>,

    /// Retention until field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Settlement id field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub settlement_id: Option<String>,

    /// Settlement status field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub settlement_status: Option<String>,

    /// Status field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Storage byte hours field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub storage_byte_hours: Option<String>,

    /// Tenant id field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Total tokens field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub total_tokens: Option<String>,

    /// Trace id field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Unit price snapshot field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub unit_price_snapshot: Option<String>,

    /// Upstream cost amount field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub upstream_cost_amount: Option<String>,

    /// Usage type field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_type: Option<String>,

    /// User id field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai usage fact record.
    pub uuid: String,

    /// Video seconds field on ai usage fact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub video_seconds: Option<String>,
}
