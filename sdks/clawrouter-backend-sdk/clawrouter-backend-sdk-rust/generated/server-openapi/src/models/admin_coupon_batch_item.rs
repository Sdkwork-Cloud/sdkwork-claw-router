use serde::{Deserialize, Serialize};

/// Persisted coupon batch snapshot returned by the backend.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCouponBatchItem {
    /// Count field on admin coupon batch item.
    pub count: i64,

    /// Coupon id field on admin coupon batch item.
    #[serde(rename = "couponId")]
    pub coupon_id: String,

    /// Created at field on admin coupon batch item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Id field on admin coupon batch item.
    pub id: String,

    /// Name field on admin coupon batch item.
    pub name: String,

    /// Prefix field on admin coupon batch item.
    pub prefix: String,
}
