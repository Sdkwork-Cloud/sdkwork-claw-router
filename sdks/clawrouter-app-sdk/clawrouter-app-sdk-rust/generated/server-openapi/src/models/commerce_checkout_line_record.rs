use serde::{Deserialize, Serialize};

/// Commerce checkout line record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceCheckoutLineRecord {
    /// Checkout session id field on commerce checkout line record.
    pub checkout_session_id: String,

    /// Created at field on commerce checkout line record.
    pub created_at: String,

    /// Fulfillment type field on commerce checkout line record.
    pub fulfillment_type: String,

    /// Id field on commerce checkout line record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Inventory reservation id field on commerce checkout line record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub inventory_reservation_id: Option<String>,

    /// Organization id field on commerce checkout line record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Price snapshot json field on commerce checkout line record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price_snapshot_json: Option<std::collections::HashMap<String, String>>,

    /// Promotion snapshot json field on commerce checkout line record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub promotion_snapshot_json: Option<std::collections::HashMap<String, String>>,

    /// Purchase type field on commerce checkout line record.
    pub purchase_type: String,

    /// Quantity field on commerce checkout line record.
    pub quantity: String,

    /// Sku id field on commerce checkout line record.
    pub sku_id: String,

    /// Tenant id field on commerce checkout line record.
    pub tenant_id: String,
}
