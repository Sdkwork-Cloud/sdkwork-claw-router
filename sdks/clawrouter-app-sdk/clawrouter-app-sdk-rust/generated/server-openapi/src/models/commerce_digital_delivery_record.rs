use serde::{Deserialize, Serialize};

/// Commerce digital delivery record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceDigitalDeliveryRecord {
    /// Created at field on commerce digital delivery record.
    pub created_at: String,

    /// Delivered at field on commerce digital delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub delivered_at: Option<String>,

    /// Delivery no field on commerce digital delivery record.
    pub delivery_no: String,

    /// Delivery ref field on commerce digital delivery record.
    pub delivery_ref: String,

    /// Delivery type field on commerce digital delivery record.
    pub delivery_type: String,

    /// Fulfillment id field on commerce digital delivery record.
    pub fulfillment_id: String,

    /// Id field on commerce digital delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Order item id field on commerce digital delivery record.
    pub order_item_id: String,

    /// Organization id field on commerce digital delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Status field on commerce digital delivery record.
    pub status: String,

    /// Tenant id field on commerce digital delivery record.
    pub tenant_id: String,

    /// Updated at field on commerce digital delivery record.
    pub updated_at: String,
}
