use serde::{Deserialize, Serialize};

/// Routing usage snapshot schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RoutingUsageSnapshot {
    /// Chart data field on routing usage snapshot.
    #[serde(rename = "chartData")]
    pub chart_data: Vec<serde_json::Value>,

    /// Model stats field on routing usage snapshot.
    #[serde(rename = "modelStats")]
    pub model_stats: Vec<serde_json::Value>,
}
