use serde::{Deserialize, Serialize};

/// Promotion discount application record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionDiscountApplicationRecord {
    /// Application no field on promotion discount application record.
    pub application_no: String,

    /// Applied at field on promotion discount application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub applied_at: Option<String>,

    /// Budget account id field on promotion discount application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub budget_account_id: Option<String>,

    /// Created at field on promotion discount application record.
    pub created_at: String,

    /// Currency code field on promotion discount application record.
    pub currency_code: String,

    /// Discount amount minor field on promotion discount application record.
    pub discount_amount_minor: String,

    /// Failure code field on promotion discount application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_code: Option<String>,

    /// Failure message field on promotion discount application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_message: Option<String>,

    /// Id field on promotion discount application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on promotion discount application record.
    pub idempotency_key: String,

    /// Offer id field on promotion discount application record.
    pub offer_id: String,

    /// Offer version id field on promotion discount application record.
    pub offer_version_id: String,

    /// Order id field on promotion discount application record.
    pub order_id: String,

    /// Order no field on promotion discount application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub order_no: Option<String>,

    /// Organization id field on promotion discount application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payment id field on promotion discount application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payment_id: Option<String>,

    /// Released at field on promotion discount application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub released_at: Option<String>,

    /// Request no field on promotion discount application record.
    pub request_no: String,

    /// Reservation expires at field on promotion discount application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reservation_expires_at: Option<String>,

    /// Reserved at field on promotion discount application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reserved_at: Option<String>,

    /// Rolled back at field on promotion discount application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rolled_back_at: Option<String>,

    /// Rule snapshot json field on promotion discount application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rule_snapshot_json: Option<std::collections::HashMap<String, String>>,

    /// Settled at field on promotion discount application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub settled_at: Option<String>,

    /// Status field on promotion discount application record.
    pub status: String,

    /// Stock id field on promotion discount application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub stock_id: Option<String>,

    /// Subject id field on promotion discount application record.
    pub subject_id: String,

    /// Subject type field on promotion discount application record.
    pub subject_type: String,

    /// Tenant id field on promotion discount application record.
    pub tenant_id: String,

    /// Updated at field on promotion discount application record.
    pub updated_at: String,

    /// User coupon id field on promotion discount application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_coupon_id: Option<String>,
}
