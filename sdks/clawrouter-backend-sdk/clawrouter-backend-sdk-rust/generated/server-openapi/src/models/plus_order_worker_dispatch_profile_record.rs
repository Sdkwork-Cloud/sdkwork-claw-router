use serde::{Deserialize, Serialize};

/// Plus order worker dispatch profile record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusOrderWorkerDispatchProfileRecord {
    #[serde(flatten)]
    pub additional_properties: std::collections::HashMap<String, serde_json::Value>,
}
