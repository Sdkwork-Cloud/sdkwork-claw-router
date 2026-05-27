use serde::{Deserialize, Serialize};

/// Commerce usage service provider adjustment record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceUsageServiceProviderAdjustmentRecord {
    /// Adjustment no field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub adjustment_no: Option<String>,

    /// Adjustment type field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub adjustment_type: Option<String>,

    /// Amount field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub amount: Option<String>,

    /// Approval status field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub approval_status: Option<String>,

    /// Approved by field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub approved_by: Option<String>,

    /// Buyer provider id field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub buyer_provider_id: Option<String>,

    /// Created at field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Id field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Legal hold field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Reason code field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reason_code: Option<String>,

    /// Reason message field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reason_message: Option<String>,

    /// Request id field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Seller provider id field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub seller_provider_id: Option<String>,

    /// Settled ledger entry id field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub settled_ledger_entry_id: Option<String>,

    /// Statement id field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub statement_id: Option<String>,

    /// Status field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Usage edge id field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_edge_id: Option<String>,

    /// User id field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on commerce usage service provider adjustment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
