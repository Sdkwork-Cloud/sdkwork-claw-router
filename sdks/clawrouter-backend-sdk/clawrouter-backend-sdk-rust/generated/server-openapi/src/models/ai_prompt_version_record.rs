use serde::{Deserialize, Serialize};

/// Ai prompt version record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiPromptVersionRecord {
    /// Checksum hash field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub checksum_hash: Option<String>,

    /// Content field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content: Option<String>,

    /// Created at field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Created by field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_by: Option<String>,

    /// Data scope field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Deprecated at field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deprecated_at: Option<String>,

    /// Examples json field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub examples_json: Option<std::collections::HashMap<String, String>>,

    /// Id field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Lifecycle status field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub lifecycle_status: Option<String>,

    /// Metadata field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model constraints field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_constraints: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Output schema field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub output_schema: Option<std::collections::HashMap<String, String>>,

    /// Prompt id field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub prompt_id: Option<String>,

    /// Published at field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Review comment field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub review_comment: Option<String>,

    /// Review status field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub review_status: Option<String>,

    /// Safety policy field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub safety_policy: Option<std::collections::HashMap<String, String>>,

    /// Status field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Title field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Updated at field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Variable schema field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub variable_schema: Option<std::collections::HashMap<String, String>>,

    /// Version field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Version no field on ai prompt version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version_no: Option<String>,
}
