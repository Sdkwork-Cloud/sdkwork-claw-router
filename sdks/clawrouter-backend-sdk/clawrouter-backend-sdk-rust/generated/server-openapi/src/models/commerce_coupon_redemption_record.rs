use serde::{Deserialize, Serialize};

/// Commerce coupon redemption record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceCouponRedemptionRecord {
    /// Coupon id field on commerce coupon redemption record.
    pub coupon_id: String,

    /// Created at field on commerce coupon redemption record.
    pub created_at: String,

    /// Discount amount field on commerce coupon redemption record.
    pub discount_amount: String,

    /// Idempotency key field on commerce coupon redemption record.
    pub idempotency_key: String,

    /// Order id field on commerce coupon redemption record.
    pub order_id: String,

    /// Organization id field on commerce coupon redemption record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner user id field on commerce coupon redemption record.
    pub owner_user_id: String,

    /// Redeemed at field on commerce coupon redemption record.
    pub redeemed_at: String,

    /// Request no field on commerce coupon redemption record.
    pub request_no: String,

    /// Rolled back at field on commerce coupon redemption record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rolled_back_at: Option<String>,

    /// Status field on commerce coupon redemption record.
    pub status: String,

    /// Tenant id field on commerce coupon redemption record.
    pub tenant_id: String,

    /// Updated at field on commerce coupon redemption record.
    pub updated_at: String,
}
