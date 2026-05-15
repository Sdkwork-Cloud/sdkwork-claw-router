use serde::{Deserialize, Serialize};

/// Routing strategy snapshot schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RoutingStrategySnapshot {
    /// Mapping rules field on routing strategy snapshot.
    #[serde(rename = "mappingRules")]
    pub mapping_rules: Vec<serde_json::Value>,

    /// Strategy field on routing strategy snapshot.
    pub strategy: String,
}
