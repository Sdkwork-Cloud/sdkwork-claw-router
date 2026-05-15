use serde::{Deserialize, Serialize};

/// Ai generation asset action record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiGenerationAssetActionRecord {
    /// Action params field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub action_params: Option<std::collections::HashMap<String, String>>,

    /// Action type field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub action_type: Option<String>,

    /// Asset id field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub asset_id: Option<String>,

    /// Client ip hash field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_ip_hash: Option<String>,

    /// Client ip region field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_ip_region: Option<String>,

    /// Completed at field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completed_at: Option<String>,

    /// Created at field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Failure code field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_code: Option<String>,

    /// Id field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Job id field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub job_id: Option<String>,

    /// Legal hold field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Request id field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Result asset id field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub result_asset_id: Option<String>,

    /// Retention until field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Status field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User agent hash field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_agent_hash: Option<String>,

    /// User id field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai generation asset action record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
