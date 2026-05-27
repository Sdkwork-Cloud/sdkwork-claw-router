use serde::{Deserialize, Serialize};

/// Admin prompt binding item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminPromptBindingItem {
    /// Binding role field on admin prompt binding item.
    #[serde(rename = "bindingRole")]
    pub binding_role: String,

    /// Created at field on admin prompt binding item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Enabled field on admin prompt binding item.
    pub enabled: bool,

    /// Id field on admin prompt binding item.
    pub id: i64,

    /// Organization id field on admin prompt binding item.
    #[serde(rename = "organizationId")]
    pub organization_id: i64,

    /// Owner id field on admin prompt binding item.
    #[serde(rename = "ownerId")]
    pub owner_id: i64,

    /// Owner type field on admin prompt binding item.
    #[serde(rename = "ownerType")]
    pub owner_type: String,

    /// Policy json field on admin prompt binding item.
    #[serde(rename = "policyJson")]
    pub policy_json: std::collections::HashMap<String, String>,

    /// Priority field on admin prompt binding item.
    pub priority: i64,

    /// Prompt id field on admin prompt binding item.
    #[serde(rename = "promptId")]
    pub prompt_id: i64,

    /// Prompt version id field on admin prompt binding item.
    #[serde(rename = "promptVersionId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub prompt_version_id: Option<i64>,

    /// Snapshot json field on admin prompt binding item.
    #[serde(rename = "snapshotJson")]
    pub snapshot_json: std::collections::HashMap<String, String>,

    /// Tenant id field on admin prompt binding item.
    #[serde(rename = "tenantId")]
    pub tenant_id: i64,

    /// Updated at field on admin prompt binding item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,

    /// Uuid field on admin prompt binding item.
    pub uuid: String,
}
