use serde::{Deserialize, Serialize};

/// Ai channel group resource record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiChannelGroupResourceRecord {
    /// Channel group id field on ai channel group resource record.
    pub channel_group_id: String,

    /// Created at field on ai channel group resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai channel group resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai channel group resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai channel group resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Effective from field on ai channel group resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on ai channel group resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Grant type field on ai channel group resource record.
    pub grant_type: String,

    /// Id field on ai channel group resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai channel group resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai channel group resource record.
    pub organization_id: String,

    /// Priority field on ai channel group resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub priority: Option<i64>,

    /// Resource code field on ai channel group resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource_code: Option<String>,

    /// Resource group code field on ai channel group resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource_group_code: Option<String>,

    /// Resource group id field on ai channel group resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource_group_id: Option<String>,

    /// Resource id field on ai channel group resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource_id: Option<String>,

    /// Status field on ai channel group resource record.
    pub status: String,

    /// Tenant id field on ai channel group resource record.
    pub tenant_id: String,

    /// Updated at field on ai channel group resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai channel group resource record.
    pub uuid: String,

    /// Version field on ai channel group resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
