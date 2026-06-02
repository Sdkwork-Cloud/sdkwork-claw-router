use serde::{Deserialize, Serialize};

/// Ops notification preference record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpsNotificationPreferenceRecord {
    /// App id field on ops notification preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_id: Option<String>,

    /// Created at field on ops notification preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ops notification preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ops notification preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ops notification preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Delivery channel field on ops notification preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub delivery_channel: Option<String>,

    /// Enabled field on ops notification preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub enabled: Option<bool>,

    /// Id field on ops notification preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Message type field on ops notification preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message_type: Option<String>,

    /// Metadata field on ops notification preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ops notification preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on ops notification preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on ops notification preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Quiet hours field on ops notification preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quiet_hours: Option<std::collections::HashMap<String, String>>,

    /// Status field on ops notification preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ops notification preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on ops notification preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on ops notification preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ops notification preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ops notification preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
