use serde::{Deserialize, Serialize};

use crate::models::{CommerceCategorySeedInitializeSummary};

/// Commerce category seed initialize response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceCategorySeedInitializeResponse {
    /// Items field on commerce category seed initialize response.
    pub items: Vec<CommerceCategorySeedInitializeSummary>,
}
