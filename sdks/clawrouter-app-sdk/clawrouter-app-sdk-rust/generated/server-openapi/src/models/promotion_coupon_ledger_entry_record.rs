use serde::{Deserialize, Serialize};

/// Promotion coupon ledger entry record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionCouponLedgerEntryRecord {
    /// Application id field on promotion coupon ledger entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub application_id: Option<String>,

    /// Business type field on promotion coupon ledger entry record.
    pub business_type: String,

    /// Created at field on promotion coupon ledger entry record.
    pub created_at: String,

    /// Direction field on promotion coupon ledger entry record.
    pub direction: String,

    /// Idempotency key field on promotion coupon ledger entry record.
    pub idempotency_key: String,

    /// Ledger no field on promotion coupon ledger entry record.
    pub ledger_no: String,

    /// Occurred at field on promotion coupon ledger entry record.
    pub occurred_at: String,

    /// Offer id field on promotion coupon ledger entry record.
    pub offer_id: String,

    /// Organization id field on promotion coupon ledger entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Request no field on promotion coupon ledger entry record.
    pub request_no: String,

    /// Source id field on promotion coupon ledger entry record.
    pub source_id: String,

    /// Source type field on promotion coupon ledger entry record.
    pub source_type: String,

    /// Stock id field on promotion coupon ledger entry record.
    pub stock_id: String,

    /// Subject id field on promotion coupon ledger entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_id: Option<String>,

    /// Subject type field on promotion coupon ledger entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_type: Option<String>,

    /// Tenant id field on promotion coupon ledger entry record.
    pub tenant_id: String,

    /// User coupon id field on promotion coupon ledger entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_coupon_id: Option<String>,
}
