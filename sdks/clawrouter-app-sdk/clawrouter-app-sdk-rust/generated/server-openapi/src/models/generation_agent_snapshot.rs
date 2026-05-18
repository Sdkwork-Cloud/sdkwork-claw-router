use serde::{Deserialize, Serialize};

/// Generation agent snapshot schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct GenerationAgentSnapshot {
    /// Id field on generation agent snapshot.
    pub id: String,

    /// Model field on generation agent snapshot.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Name field on generation agent snapshot.
    pub name: String,

    /// Version id field on generation agent snapshot.
    #[serde(rename = "versionId")]
    pub version_id: String,
}
