use serde::{Deserialize, Serialize};

/// Commerce category seed initialize request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceCategorySeedInitializeRequest {
    /// Datasets field on commerce category seed initialize request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub datasets: Option<Vec<String>>,

    /// Mode field on commerce category seed initialize request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mode: Option<String>,
}
