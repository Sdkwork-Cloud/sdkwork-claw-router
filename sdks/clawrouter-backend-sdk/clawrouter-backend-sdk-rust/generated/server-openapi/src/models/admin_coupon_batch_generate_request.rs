use serde::{Deserialize, Serialize};

/// Admin coupon batch generate request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCouponBatchGenerateRequest {
    /// Number of promo codes to generate in the batch.
    pub count: i64,

    /// Source coupon identifier used to generate promo codes.
    #[serde(rename = "couponId")]
    pub coupon_id: i64,

    /// Human-readable coupon batch name.
    pub name: String,

    /// Promo code prefix accepted by the backend.
    pub prefix: String,
}
