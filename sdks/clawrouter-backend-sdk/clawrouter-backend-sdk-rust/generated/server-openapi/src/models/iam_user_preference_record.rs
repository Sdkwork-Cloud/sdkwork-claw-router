use serde::{Deserialize, Serialize};

/// Iam user preference record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamUserPreferenceRecord {
    /// Appearance config field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub appearance_config: Option<std::collections::HashMap<String, String>>,

    /// Created at field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default console path field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_console_path: Option<String>,

    /// Deleted at field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Language field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,

    /// Metadata field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Notification preferences field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub notification_preferences: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Status field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Theme mode field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub theme_mode: Option<String>,

    /// Timezone field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub timezone: Option<String>,

    /// Updated at field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on iam user preference record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
