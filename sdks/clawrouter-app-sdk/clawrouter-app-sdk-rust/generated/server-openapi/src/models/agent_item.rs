use serde::{Deserialize, Serialize};

use crate::models::{AgentCapabilities, AgentVersionItem};

/// Agent item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentItem {
    /// Avatar url field on agent item.
    #[serde(rename = "avatarUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub avatar_url: Option<String>,

    /// Capabilities field on agent item.
    pub capabilities: AgentCapabilities,

    /// Code field on agent item.
    pub code: String,

    /// Created at field on agent item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Default version field on agent item.
    #[serde(rename = "defaultVersion")]
    pub default_version: AgentVersionItem,

    /// Description field on agent item.
    pub description: String,

    /// Id field on agent item.
    pub id: String,

    /// Name field on agent item.
    pub name: String,

    /// Owner user id field on agent item.
    #[serde(rename = "ownerUserId")]
    pub owner_user_id: i64,

    /// Status field on agent item.
    pub status: String,

    /// Template source field on agent item.
    #[serde(rename = "templateSource")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub template_source: Option<String>,

    /// Updated at field on agent item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,

    /// Visibility field on agent item.
    pub visibility: String,
}
