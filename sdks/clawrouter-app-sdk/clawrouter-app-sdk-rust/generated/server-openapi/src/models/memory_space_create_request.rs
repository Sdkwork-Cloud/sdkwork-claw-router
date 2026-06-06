use serde::{Deserialize, Serialize};

/// Memory space create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MemorySpaceCreateRequest {
    /// Auto extract enabled field on memory space create request.
    #[serde(rename = "autoExtractEnabled")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auto_extract_enabled: Option<bool>,

    /// Auto recall enabled field on memory space create request.
    #[serde(rename = "autoRecallEnabled")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auto_recall_enabled: Option<bool>,

    /// Max injected tokens field on memory space create request.
    #[serde(rename = "maxInjectedTokens")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_injected_tokens: Option<String>,

    /// Memory enabled field on memory space create request.
    #[serde(rename = "memoryEnabled")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_enabled: Option<bool>,

    /// Metadata field on memory space create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Owner id field on memory space create request.
    #[serde(rename = "ownerId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on memory space create request.
    #[serde(rename = "ownerType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Retention policy field on memory space create request.
    #[serde(rename = "retentionPolicy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_policy: Option<std::collections::HashMap<String, String>>,

    /// Review required field on memory space create request.
    #[serde(rename = "reviewRequired")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub review_required: Option<bool>,

    /// Sensitivity policy field on memory space create request.
    #[serde(rename = "sensitivityPolicy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sensitivity_policy: Option<std::collections::HashMap<String, String>>,

    /// Space type field on memory space create request.
    #[serde(rename = "spaceType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub space_type: Option<String>,

    /// Title field on memory space create request.
    pub title: String,
}
