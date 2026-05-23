use serde::{Deserialize, Serialize};

/// Commerce order item record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceOrderItemRecord {
    /// Created at field on commerce order item record.
    pub created_at: String,

    /// Order id field on commerce order item record.
    pub order_id: String,

    /// Quantity field on commerce order item record.
    pub quantity: String,

    /// Sku id field on commerce order item record.
    pub sku_id: String,

    /// Tenant id field on commerce order item record.
    pub tenant_id: String,

    /// Title field on commerce order item record.
    pub title: String,

    /// Total amount field on commerce order item record.
    pub total_amount: String,

    /// Unit price amount field on commerce order item record.
    pub unit_price_amount: String,
}
