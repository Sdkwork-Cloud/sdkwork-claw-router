use serde::{Deserialize, Serialize};

/// Ai prompt binding record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiPromptBindingRecord {
    /// Binding role field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub binding_role: Option<String>,

    /// Created at field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Enabled field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub enabled: Option<bool>,

    /// Id field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Policy json field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub policy_json: Option<std::collections::HashMap<String, String>>,

    /// Priority field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub priority: Option<i64>,

    /// Prompt id field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub prompt_id: Option<String>,

    /// Prompt version id field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub prompt_version_id: Option<String>,

    /// Snapshot json field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub snapshot_json: Option<std::collections::HashMap<String, String>>,

    /// Status field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ai prompt binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
