use serde::{Deserialize, Serialize};

use crate::models::{RoutingStrategySnapshot};

/// Routing strategy list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RoutingStrategyListResult {
    /// Business response code.
    pub code: String,

    /// Data field on routing strategy list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<RoutingStrategySnapshot>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
