use serde::{Deserialize, Serialize};

/// Commerce shipment tracking event record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceShipmentTrackingEventRecord {
    /// Created at field on commerce shipment tracking event record.
    pub created_at: String,

    /// Description field on commerce shipment tracking event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Event code field on commerce shipment tracking event record.
    pub event_code: String,

    /// Event time field on commerce shipment tracking event record.
    pub event_time: String,

    /// Id field on commerce shipment tracking event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Location field on commerce shipment tracking event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub location: Option<String>,

    /// Organization id field on commerce shipment tracking event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Raw payload json field on commerce shipment tracking event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub raw_payload_json: Option<std::collections::HashMap<String, String>>,

    /// Shipment id field on commerce shipment tracking event record.
    pub shipment_id: String,

    /// Tenant id field on commerce shipment tracking event record.
    pub tenant_id: String,
}
