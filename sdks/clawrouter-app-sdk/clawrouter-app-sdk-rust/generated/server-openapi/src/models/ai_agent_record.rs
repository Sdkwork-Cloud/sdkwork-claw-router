use serde::{Deserialize, Serialize};

/// Ai agent record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiAgentRecord {
    /// Agent code field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_code: Option<String>,

    /// Avatar url field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub avatar_url: Option<String>,

    /// Created at field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default version id field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_version_id: Option<String>,

    /// Deleted at field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Governance status field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub governance_status: Option<String>,

    /// Id field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Name field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Organization id field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner user id field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_user_id: Option<String>,

    /// Published at field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Published by field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_by: Option<String>,

    /// Status field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Template source field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub template_source: Option<String>,

    /// Tenant id field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Visibility field on ai agent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub visibility: Option<String>,
}
