use serde::{Deserialize, Serialize};

/// Ai usage service provider edge record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiUsageServiceProviderEdgeRecord {
    /// Amount role field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub amount_role: Option<String>,

    /// Billable quantity field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billable_quantity: Option<String>,

    /// Billing meter code field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_meter_code: Option<String>,

    /// Buyer provider id field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub buyer_provider_id: Option<String>,

    /// Buyer snapshot field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub buyer_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Chain id field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub chain_id: Option<String>,

    /// Charge amount field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub charge_amount: Option<String>,

    /// Converted charge amount field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub converted_charge_amount: Option<String>,

    /// Created at field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Edge depth field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub edge_depth: Option<i64>,

    /// Edge id field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub edge_id: Option<String>,

    /// Fx rate snapshot field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub fx_rate_snapshot: Option<String>,

    /// Id field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Legal hold field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Occurred at field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub occurred_at: Option<String>,

    /// Organization id field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Price snapshot field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Pricing plan id field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_plan_id: Option<String>,

    /// Pricing rule id field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_rule_id: Option<String>,

    /// Request id field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Seller provider id field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub seller_provider_id: Option<String>,

    /// Seller snapshot field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub seller_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Settlement currency field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub settlement_currency: Option<String>,

    /// Settlement status field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub settlement_status: Option<String>,

    /// Status field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Token kind field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub token_kind: Option<String>,

    /// Trace id field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Unit price field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub unit_price: Option<String>,

    /// Unit size field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub unit_size: Option<String>,

    /// Usage fact id field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_fact_id: Option<String>,

    /// User id field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai usage service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
