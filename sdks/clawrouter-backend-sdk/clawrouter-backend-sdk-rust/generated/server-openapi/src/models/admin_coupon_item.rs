use serde::{Deserialize, Serialize};

/// Persisted coupon snapshot returned by the backend.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCouponItem {
    /// Id field on admin coupon item.
    pub id: String,

    /// Name field on admin coupon item.
    pub name: String,

    /// Status field on admin coupon item.
    pub status: String,

    /// Type field on admin coupon item.
    pub r#type: String,

    /// Value field on admin coupon item.
    pub value: String,
}
