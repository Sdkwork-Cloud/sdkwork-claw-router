use serde::{Deserialize, Serialize};

/// Commerce coupon catalog item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceCouponCatalogItem {
    /// Id field on commerce coupon catalog item.
    pub id: String,

    /// Name field on commerce coupon catalog item.
    pub name: String,

    /// Status field on commerce coupon catalog item.
    pub status: String,

    /// Type field on commerce coupon catalog item.
    pub r#type: String,

    /// Value field on commerce coupon catalog item.
    pub value: String,
}
