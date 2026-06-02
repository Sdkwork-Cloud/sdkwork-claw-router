use serde::{Deserialize, Serialize};

/// Commerce fulfillment order record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceFulfillmentOrderRecord {
    /// Address snapshot id field on commerce fulfillment order record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub address_snapshot_id: Option<String>,

    /// Completed at field on commerce fulfillment order record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completed_at: Option<String>,

    /// Created at field on commerce fulfillment order record.
    pub created_at: String,

    /// Fulfillment no field on commerce fulfillment order record.
    pub fulfillment_no: String,

    /// Fulfillment type field on commerce fulfillment order record.
    pub fulfillment_type: String,

    /// Id field on commerce fulfillment order record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Order id field on commerce fulfillment order record.
    pub order_id: String,

    /// Organization id field on commerce fulfillment order record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider code field on commerce fulfillment order record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Status field on commerce fulfillment order record.
    pub status: String,

    /// Tenant id field on commerce fulfillment order record.
    pub tenant_id: String,

    /// Updated at field on commerce fulfillment order record.
    pub updated_at: String,

    /// Warehouse id field on commerce fulfillment order record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub warehouse_id: Option<String>,
}
