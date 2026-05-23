use serde::{Deserialize, Serialize};

/// Memory space item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MemorySpaceItem {
    /// Auto extract enabled field on memory space item.
    #[serde(rename = "autoExtractEnabled")]
    pub auto_extract_enabled: bool,

    /// Auto recall enabled field on memory space item.
    #[serde(rename = "autoRecallEnabled")]
    pub auto_recall_enabled: bool,

    /// Created at field on memory space item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Entry count field on memory space item.
    #[serde(rename = "entryCount")]
    pub entry_count: i64,

    /// Id field on memory space item.
    pub id: String,

    /// Max injected tokens field on memory space item.
    #[serde(rename = "maxInjectedTokens")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_injected_tokens: Option<i64>,

    /// Memory enabled field on memory space item.
    #[serde(rename = "memoryEnabled")]
    pub memory_enabled: bool,

    /// Owner id field on memory space item.
    #[serde(rename = "ownerId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on memory space item.
    #[serde(rename = "ownerType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Review required field on memory space item.
    #[serde(rename = "reviewRequired")]
    pub review_required: bool,

    /// Space type field on memory space item.
    #[serde(rename = "spaceType")]
    pub space_type: String,

    /// Status field on memory space item.
    pub status: String,

    /// Title field on memory space item.
    pub title: String,

    /// Updated at field on memory space item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}
