use serde::{Deserialize, Serialize};

/// Commerce refund item record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceRefundItemRecord {
    /// Created at field on commerce refund item record.
    pub created_at: String,

    /// Id field on commerce refund item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Order item id field on commerce refund item record.
    pub order_item_id: String,

    /// Organization id field on commerce refund item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Quantity field on commerce refund item record.
    pub quantity: String,

    /// Refund amount field on commerce refund item record.
    pub refund_amount: String,

    /// Refund id field on commerce refund item record.
    pub refund_id: String,

    /// Shipping refund amount field on commerce refund item record.
    pub shipping_refund_amount: String,

    /// Tax refund amount field on commerce refund item record.
    pub tax_refund_amount: String,

    /// Tenant id field on commerce refund item record.
    pub tenant_id: String,
}
