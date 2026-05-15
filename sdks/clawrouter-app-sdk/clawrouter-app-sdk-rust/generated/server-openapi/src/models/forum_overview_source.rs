use serde::{Deserialize, Serialize};

/// Forum overview source schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ForumOverviewSource {
    /// Observed at field on forum overview source.
    #[serde(rename = "observedAt")]
    pub observed_at: String,

    /// Source description field on forum overview source.
    #[serde(rename = "sourceDescription")]
    pub source_description: String,

    /// Source label field on forum overview source.
    #[serde(rename = "sourceLabel")]
    pub source_label: String,

    /// Source tables field on forum overview source.
    #[serde(rename = "sourceTables")]
    pub source_tables: Vec<String>,
}
