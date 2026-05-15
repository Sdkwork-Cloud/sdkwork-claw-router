use serde::{Deserialize, Serialize};

/// Update routing strategy response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct UpdateRoutingStrategyResponse {
    /// Success field on update routing strategy response.
    pub success: bool,
}
