use serde::{Deserialize, Serialize};

/// Memory entry item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MemoryEntryItem {
    /// Confidence score field on memory entry item.
    #[serde(rename = "confidenceScore")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub confidence_score: Option<String>,

    /// Content field on memory entry item.
    pub content: String,

    /// Created at field on memory entry item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Id field on memory entry item.
    pub id: String,

    /// Importance score field on memory entry item.
    #[serde(rename = "importanceScore")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub importance_score: Option<String>,

    /// Memory type field on memory entry item.
    #[serde(rename = "memoryType")]
    pub memory_type: String,

    /// Recall count field on memory entry item.
    #[serde(rename = "recallCount")]
    pub recall_count: i64,

    /// Sensitivity level field on memory entry item.
    #[serde(rename = "sensitivityLevel")]
    pub sensitivity_level: String,

    /// Source conversation id field on memory entry item.
    #[serde(rename = "sourceConversationId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_conversation_id: Option<String>,

    /// Source invocation id field on memory entry item.
    #[serde(rename = "sourceInvocationId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_invocation_id: Option<String>,

    /// Source item id field on memory entry item.
    #[serde(rename = "sourceItemId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_item_id: Option<String>,

    /// Source kind field on memory entry item.
    #[serde(rename = "sourceKind")]
    pub source_kind: String,

    /// Source turn id field on memory entry item.
    #[serde(rename = "sourceTurnId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_turn_id: Option<String>,

    /// Space id field on memory entry item.
    #[serde(rename = "spaceId")]
    pub space_id: String,

    /// Status field on memory entry item.
    pub status: String,

    /// Subject key field on memory entry item.
    #[serde(rename = "subjectKey")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_key: Option<String>,

    /// Subject type field on memory entry item.
    #[serde(rename = "subjectType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_type: Option<String>,

    /// Trust level field on memory entry item.
    #[serde(rename = "trustLevel")]
    pub trust_level: String,

    /// Updated at field on memory entry item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}
