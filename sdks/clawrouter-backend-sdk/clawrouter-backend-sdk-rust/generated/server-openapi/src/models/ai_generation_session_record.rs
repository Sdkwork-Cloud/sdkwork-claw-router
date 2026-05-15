use serde::{Deserialize, Serialize};

/// Ai generation session record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiGenerationSessionRecord {
    /// Active modality field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub active_modality: Option<String>,

    /// Created at field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Filter config field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub filter_config: Option<std::collections::HashMap<String, String>>,

    /// Id field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last opened at field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_opened_at: Option<String>,

    /// Last prompt field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_prompt: Option<String>,

    /// Metadata field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Selected models field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub selected_models: Option<std::collections::HashMap<String, String>>,

    /// Session code field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub session_code: Option<String>,

    /// Status field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Title field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Updated at field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ai generation session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
