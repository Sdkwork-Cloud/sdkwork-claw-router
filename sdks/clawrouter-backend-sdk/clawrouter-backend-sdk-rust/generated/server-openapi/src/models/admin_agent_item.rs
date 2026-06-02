use serde::{Deserialize, Serialize};

use crate::models::{AdminAgentCapabilities, AdminAgentVersionItem, MediaResource};

/// Admin agent item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAgentItem {
    /// Avatar field on admin agent item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub avatar: Option<MediaResource>,

    /// Capabilities field on admin agent item.
    pub capabilities: AdminAgentCapabilities,

    /// Code field on admin agent item.
    pub code: String,

    /// Created at field on admin agent item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Default version field on admin agent item.
    #[serde(rename = "defaultVersion")]
    pub default_version: AdminAgentVersionItem,

    /// Description field on admin agent item.
    pub description: String,

    /// Id field on admin agent item.
    pub id: String,

    /// Name field on admin agent item.
    pub name: String,

    /// Owner user id field on admin agent item.
    #[serde(rename = "ownerUserId")]
    pub owner_user_id: i64,

    /// Status field on admin agent item.
    pub status: String,

    /// Template source field on admin agent item.
    #[serde(rename = "templateSource")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub template_source: Option<String>,

    /// Updated at field on admin agent item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,

    /// Visibility field on admin agent item.
    pub visibility: String,
}
