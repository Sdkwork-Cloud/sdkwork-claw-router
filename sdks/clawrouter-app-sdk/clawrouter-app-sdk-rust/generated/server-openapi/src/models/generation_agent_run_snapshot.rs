use serde::{Deserialize, Serialize};

/// Generation agent run snapshot schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct GenerationAgentRunSnapshot {
    /// Id field on generation agent run snapshot.
    pub id: String,

    /// Request id field on generation agent run snapshot.
    #[serde(rename = "requestId")]
    pub request_id: String,

    /// Source field on generation agent run snapshot.
    pub source: String,

    /// Status field on generation agent run snapshot.
    pub status: String,
}
