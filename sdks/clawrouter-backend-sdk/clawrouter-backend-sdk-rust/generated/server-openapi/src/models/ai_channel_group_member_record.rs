use serde::{Deserialize, Serialize};

/// Ai channel group member record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiChannelGroupMemberRecord {
    /// Channel group id field on ai channel group member record.
    pub channel_group_id: String,

    /// Channel id field on ai channel group member record.
    pub channel_id: String,

    /// Created at field on ai channel group member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai channel group member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai channel group member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai channel group member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Effective from field on ai channel group member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on ai channel group member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Id field on ai channel group member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai channel group member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai channel group member record.
    pub organization_id: String,

    /// Status field on ai channel group member record.
    pub status: String,

    /// Tenant id field on ai channel group member record.
    pub tenant_id: String,

    /// Updated at field on ai channel group member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai channel group member record.
    pub uuid: String,

    /// Version field on ai channel group member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
