use serde::{Deserialize, Serialize};

/// Memory entry create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MemoryEntryCreateRequest {
    /// Confidence score field on memory entry create request.
    #[serde(rename = "confidenceScore")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub confidence_score: Option<String>,

    /// Content field on memory entry create request.
    pub content: String,

    /// Content json field on memory entry create request.
    #[serde(rename = "contentJson")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_json: Option<std::collections::HashMap<String, String>>,

    /// Importance score field on memory entry create request.
    #[serde(rename = "importanceScore")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub importance_score: Option<String>,

    /// Memory type field on memory entry create request.
    #[serde(rename = "memoryType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_type: Option<String>,

    /// Metadata field on memory entry create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Sensitivity level field on memory entry create request.
    #[serde(rename = "sensitivityLevel")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sensitivity_level: Option<String>,

    /// Source conversation id field on memory entry create request.
    #[serde(rename = "sourceConversationId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_conversation_id: Option<String>,

    /// Source invocation id field on memory entry create request.
    #[serde(rename = "sourceInvocationId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_invocation_id: Option<String>,

    /// Source item id field on memory entry create request.
    #[serde(rename = "sourceItemId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_item_id: Option<String>,

    /// Source kind field on memory entry create request.
    #[serde(rename = "sourceKind")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_kind: Option<String>,

    /// Source turn id field on memory entry create request.
    #[serde(rename = "sourceTurnId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_turn_id: Option<String>,

    /// Status field on memory entry create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Subject key field on memory entry create request.
    #[serde(rename = "subjectKey")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_key: Option<String>,

    /// Subject type field on memory entry create request.
    #[serde(rename = "subjectType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_type: Option<String>,

    /// Trust level field on memory entry create request.
    #[serde(rename = "trustLevel")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trust_level: Option<String>,
}
