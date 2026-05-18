use serde::{Deserialize, Serialize};

/// Generation agent run step snapshot schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct GenerationAgentRunStepSnapshot {
    /// Id field on generation agent run step snapshot.
    pub id: String,

    /// Index field on generation agent run step snapshot.
    pub index: i64,

    /// Status field on generation agent run step snapshot.
    pub status: String,

    /// Title field on generation agent run step snapshot.
    pub title: String,

    /// Type field on generation agent run step snapshot.
    pub r#type: String,
}
