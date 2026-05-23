use serde::{Deserialize, Serialize};

/// Commerce usage settlement record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceUsageSettlementRecord {
    /// Account id field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub account_id: Option<String>,

    /// Account ledger entry id field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub account_ledger_entry_id: Option<String>,

    /// Amount field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub amount: Option<String>,

    /// Asset type field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub asset_type: Option<String>,

    /// Created at field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Direction field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub direction: Option<String>,

    /// Failure code field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_code: Option<String>,

    /// Failure message field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_message: Option<String>,

    /// Id field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Legal hold field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Order id field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub order_id: Option<String>,

    /// Organization id field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Payment id field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payment_id: Option<String>,

    /// Points field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub points: Option<String>,

    /// Price snapshot field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Request id field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Settled at field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub settled_at: Option<String>,

    /// Settlement no field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub settlement_no: Option<String>,

    /// Settlement status field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub settlement_status: Option<String>,

    /// Status field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Tokens field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tokens: Option<String>,

    /// Trace id field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Usage fact id field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_fact_id: Option<String>,

    /// User id field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on commerce usage settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
