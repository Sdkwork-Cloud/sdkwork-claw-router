use serde::{Deserialize, Serialize};

/// Promotion budget ledger entry record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionBudgetLedgerEntryRecord {
    /// Application id field on promotion budget ledger entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub application_id: Option<String>,

    /// Budget account id field on promotion budget ledger entry record.
    pub budget_account_id: String,

    /// Business type field on promotion budget ledger entry record.
    pub business_type: String,

    /// Created at field on promotion budget ledger entry record.
    pub created_at: String,

    /// Currency code field on promotion budget ledger entry record.
    pub currency_code: String,

    /// Direction field on promotion budget ledger entry record.
    pub direction: String,

    /// Idempotency key field on promotion budget ledger entry record.
    pub idempotency_key: String,

    /// Ledger no field on promotion budget ledger entry record.
    pub ledger_no: String,

    /// Occurred at field on promotion budget ledger entry record.
    pub occurred_at: String,

    /// Organization id field on promotion budget ledger entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Request no field on promotion budget ledger entry record.
    pub request_no: String,

    /// Source id field on promotion budget ledger entry record.
    pub source_id: String,

    /// Source type field on promotion budget ledger entry record.
    pub source_type: String,

    /// Tenant id field on promotion budget ledger entry record.
    pub tenant_id: String,
}
