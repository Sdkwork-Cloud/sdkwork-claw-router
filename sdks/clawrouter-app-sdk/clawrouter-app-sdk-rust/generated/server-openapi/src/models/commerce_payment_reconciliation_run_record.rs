use serde::{Deserialize, Serialize};

/// Commerce payment reconciliation run record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentReconciliationRunRecord {
    /// Completed at field on commerce payment reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completed_at: Option<String>,

    /// Created at field on commerce payment reconciliation run record.
    pub created_at: String,

    /// Difference amount field on commerce payment reconciliation run record.
    pub difference_amount: String,

    /// Idempotency key field on commerce payment reconciliation run record.
    pub idempotency_key: String,

    /// Matched count field on commerce payment reconciliation run record.
    pub matched_count: String,

    /// Mismatched count field on commerce payment reconciliation run record.
    pub mismatched_count: String,

    /// Missing internal count field on commerce payment reconciliation run record.
    pub missing_internal_count: String,

    /// Missing provider count field on commerce payment reconciliation run record.
    pub missing_provider_count: String,

    /// Organization id field on commerce payment reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Period end field on commerce payment reconciliation run record.
    pub period_end: String,

    /// Period start field on commerce payment reconciliation run record.
    pub period_start: String,

    /// Provider account id field on commerce payment reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_account_id: Option<String>,

    /// Provider code field on commerce payment reconciliation run record.
    pub provider_code: String,

    /// Report file ref field on commerce payment reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub report_file_ref: Option<String>,

    /// Request no field on commerce payment reconciliation run record.
    pub request_no: String,

    /// Run no field on commerce payment reconciliation run record.
    pub run_no: String,

    /// Settlement currency field on commerce payment reconciliation run record.
    pub settlement_currency: String,

    /// Started at field on commerce payment reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub started_at: Option<String>,

    /// Status field on commerce payment reconciliation run record.
    pub status: String,

    /// Tenant id field on commerce payment reconciliation run record.
    pub tenant_id: String,

    /// Total internal amount field on commerce payment reconciliation run record.
    pub total_internal_amount: String,

    /// Total provider amount field on commerce payment reconciliation run record.
    pub total_provider_amount: String,

    /// Updated at field on commerce payment reconciliation run record.
    pub updated_at: String,
}
