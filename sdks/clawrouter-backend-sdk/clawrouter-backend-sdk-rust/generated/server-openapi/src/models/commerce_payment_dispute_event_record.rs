use serde::{Deserialize, Serialize};

/// Commerce payment dispute event record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentDisputeEventRecord {
    /// Actor id field on commerce payment dispute event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub actor_id: Option<String>,

    /// Actor type field on commerce payment dispute event record.
    pub actor_type: String,

    /// Created at field on commerce payment dispute event record.
    pub created_at: String,

    /// Dispute id field on commerce payment dispute event record.
    pub dispute_id: String,

    /// Event no field on commerce payment dispute event record.
    pub event_no: String,

    /// Event type field on commerce payment dispute event record.
    pub event_type: String,

    /// From status field on commerce payment dispute event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub from_status: Option<String>,

    /// Id field on commerce payment dispute event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Organization id field on commerce payment dispute event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload json field on commerce payment dispute event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_json: Option<std::collections::HashMap<String, String>>,

    /// Tenant id field on commerce payment dispute event record.
    pub tenant_id: String,

    /// To status field on commerce payment dispute event record.
    pub to_status: String,
}
