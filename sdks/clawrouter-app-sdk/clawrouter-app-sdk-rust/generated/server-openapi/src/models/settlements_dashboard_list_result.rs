use serde::{Deserialize, Serialize};

use crate::models::{SettlementDashboardResponse};

/// Settlements dashboard list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SettlementsDashboardListResult {
    /// Business response code.
    pub code: String,

    /// Data field on settlements dashboard list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<SettlementDashboardResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
