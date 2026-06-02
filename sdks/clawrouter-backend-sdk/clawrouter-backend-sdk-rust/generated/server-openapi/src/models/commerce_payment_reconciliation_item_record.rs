use serde::{Deserialize, Serialize};

/// Commerce payment reconciliation item record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentReconciliationItemRecord {
    /// Created at field on commerce payment reconciliation item record.
    pub created_at: String,

    /// Currency code field on commerce payment reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency_code: Option<String>,

    /// Difference amount field on commerce payment reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub difference_amount: Option<String>,

    /// Difference type field on commerce payment reconciliation item record.
    pub difference_type: String,

    /// Id field on commerce payment reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Internal amount field on commerce payment reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub internal_amount: Option<String>,

    /// Internal status field on commerce payment reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub internal_status: Option<String>,

    /// Match status field on commerce payment reconciliation item record.
    pub match_status: String,

    /// Organization id field on commerce payment reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payment attempt id field on commerce payment reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payment_attempt_id: Option<String>,

    /// Provider amount field on commerce payment reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_amount: Option<String>,

    /// Provider code field on commerce payment reconciliation item record.
    pub provider_code: String,

    /// Provider status field on commerce payment reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_status: Option<String>,

    /// Reconciliation run id field on commerce payment reconciliation item record.
    pub reconciliation_run_id: String,

    /// Refund attempt id field on commerce payment reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub refund_attempt_id: Option<String>,

    /// Refund id field on commerce payment reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub refund_id: Option<String>,

    /// Resolution note field on commerce payment reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resolution_note: Option<String>,

    /// Resolution status field on commerce payment reconciliation item record.
    pub resolution_status: String,

    /// Resolved at field on commerce payment reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resolved_at: Option<String>,

    /// Resolved by field on commerce payment reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resolved_by: Option<String>,

    /// Statement id field on commerce payment reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub statement_id: Option<String>,

    /// Statement item id field on commerce payment reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub statement_item_id: Option<String>,

    /// Tenant id field on commerce payment reconciliation item record.
    pub tenant_id: String,

    /// Updated at field on commerce payment reconciliation item record.
    pub updated_at: String,
}
