use serde::{Deserialize, Serialize};

/// Studio catalog action record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct StudioCatalogActionRecord {
    /// Action type field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub action_type: Option<String>,

    /// Client ip hash field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_ip_hash: Option<String>,

    /// Created at field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Id field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Legal hold field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Rating score field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rating_score: Option<String>,

    /// Release id field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub release_id: Option<String>,

    /// Request id field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Review body field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub review_body: Option<String>,

    /// Review title field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub review_title: Option<String>,

    /// Status field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Target id field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_id: Option<String>,

    /// Target type field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_type: Option<String>,

    /// Tenant id field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User agent hash field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_agent_hash: Option<String>,

    /// User id field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on studio catalog action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
