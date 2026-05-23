use serde::{Deserialize, Serialize};

/// Ops notification message record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpsNotificationMessageRecord {
    /// Action url field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub action_url: Option<String>,

    /// App id field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_id: Option<String>,

    /// Content field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content: Option<String>,

    /// Created at field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Expire at field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expire_at: Option<String>,

    /// Id field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Message code field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message_code: Option<String>,

    /// Message type field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message_type: Option<String>,

    /// Metadata field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Published at field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Severity field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub severity: Option<String>,

    /// Status field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Summary field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,

    /// Tenant id field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Title field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Updated at field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ops notification message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
