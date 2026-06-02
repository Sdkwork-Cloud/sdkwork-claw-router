use serde::{Deserialize, Serialize};

/// Commerce shipment record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceShipmentRecord {
    /// Carrier code field on commerce shipment record.
    pub carrier_code: String,

    /// Created at field on commerce shipment record.
    pub created_at: String,

    /// Delivered at field on commerce shipment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub delivered_at: Option<String>,

    /// Fulfillment id field on commerce shipment record.
    pub fulfillment_id: String,

    /// Id field on commerce shipment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Organization id field on commerce shipment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Shipment no field on commerce shipment record.
    pub shipment_no: String,

    /// Shipped at field on commerce shipment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub shipped_at: Option<String>,

    /// Status field on commerce shipment record.
    pub status: String,

    /// Tenant id field on commerce shipment record.
    pub tenant_id: String,

    /// Tracking no field on commerce shipment record.
    pub tracking_no: String,

    /// Updated at field on commerce shipment record.
    pub updated_at: String,
}
