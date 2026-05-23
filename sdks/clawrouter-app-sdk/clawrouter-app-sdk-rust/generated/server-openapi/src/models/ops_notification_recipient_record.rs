use serde::{Deserialize, Serialize};

/// Ops notification recipient record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpsNotificationRecipientRecord {
    /// App id field on ops notification recipient record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_id: Option<String>,

    /// Created at field on ops notification recipient record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ops notification recipient record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ops notification recipient record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ops notification recipient record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on ops notification recipient record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ops notification recipient record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ops notification recipient record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Recipient role code field on ops notification recipient record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub recipient_role_code: Option<String>,

    /// Recipient user id field on ops notification recipient record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub recipient_user_id: Option<String>,

    /// Recipient value field on ops notification recipient record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub recipient_value: Option<String>,

    /// Status field on ops notification recipient record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ops notification recipient record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on ops notification recipient record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ops notification recipient record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ops notification recipient record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
