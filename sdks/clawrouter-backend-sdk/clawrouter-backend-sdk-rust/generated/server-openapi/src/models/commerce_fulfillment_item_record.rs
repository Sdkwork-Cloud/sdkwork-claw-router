use serde::{Deserialize, Serialize};

/// Commerce fulfillment item record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceFulfillmentItemRecord {
    /// Created at field on commerce fulfillment item record.
    pub created_at: String,

    /// Fulfillment id field on commerce fulfillment item record.
    pub fulfillment_id: String,

    /// Id field on commerce fulfillment item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Order item id field on commerce fulfillment item record.
    pub order_item_id: String,

    /// Organization id field on commerce fulfillment item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Quantity field on commerce fulfillment item record.
    pub quantity: String,

    /// Sku id field on commerce fulfillment item record.
    pub sku_id: String,

    /// Status field on commerce fulfillment item record.
    pub status: String,

    /// Tenant id field on commerce fulfillment item record.
    pub tenant_id: String,

    /// Updated at field on commerce fulfillment item record.
    pub updated_at: String,
}
