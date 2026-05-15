use serde::{Deserialize, Serialize};

/// Course overview source schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseOverviewSource {
    /// Observed at field on course overview source.
    #[serde(rename = "observedAt")]
    pub observed_at: String,

    /// Source description field on course overview source.
    #[serde(rename = "sourceDescription")]
    pub source_description: String,

    /// Source label field on course overview source.
    #[serde(rename = "sourceLabel")]
    pub source_label: String,

    /// Source tables field on course overview source.
    #[serde(rename = "sourceTables")]
    pub source_tables: Vec<String>,
}
