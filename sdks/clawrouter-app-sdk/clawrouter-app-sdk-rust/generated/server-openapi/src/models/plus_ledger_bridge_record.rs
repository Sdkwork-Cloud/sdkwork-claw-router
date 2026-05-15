use serde::{Deserialize, Serialize};

/// Plus ledger bridge record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusLedgerBridgeRecord {
    #[serde(flatten)]
    pub additional_properties: std::collections::HashMap<String, serde_json::Value>,
}
