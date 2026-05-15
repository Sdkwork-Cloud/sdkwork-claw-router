use serde::{Deserialize, Serialize};

/// Update routing strategy request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct UpdateRoutingStrategyRequest {
    /// Mapping rules field on update routing strategy request.
    #[serde(rename = "mappingRules")]
    pub mapping_rules: Vec<serde_json::Value>,

    /// Strategy field on update routing strategy request.
    pub strategy: String,
}
