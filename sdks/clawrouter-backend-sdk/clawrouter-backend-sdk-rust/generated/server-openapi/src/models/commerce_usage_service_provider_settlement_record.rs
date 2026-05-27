use serde::{Deserialize, Serialize};

/// Commerce usage service provider settlement record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceUsageServiceProviderSettlementRecord {
    /// Amount field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub amount: Option<String>,

    /// Buyer account id field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub buyer_account_id: Option<String>,

    /// Buyer ledger entry id field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub buyer_ledger_entry_id: Option<String>,

    /// Buyer provider id field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub buyer_provider_id: Option<String>,

    /// Created at field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Direction field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub direction: Option<String>,

    /// Failure code field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_code: Option<String>,

    /// Failure message field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_message: Option<String>,

    /// Id field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Legal hold field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Request id field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Seller account id field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub seller_account_id: Option<String>,

    /// Seller ledger entry id field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub seller_ledger_entry_id: Option<String>,

    /// Seller provider id field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub seller_provider_id: Option<String>,

    /// Settled at field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub settled_at: Option<String>,

    /// Settlement mode field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub settlement_mode: Option<String>,

    /// Settlement no field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub settlement_no: Option<String>,

    /// Settlement status field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub settlement_status: Option<String>,

    /// Status field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Usage edge id field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_edge_id: Option<String>,

    /// User id field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on commerce usage service provider settlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
