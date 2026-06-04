use serde::{Deserialize, Serialize};

/// Routing usage data schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RoutingUsageData {
    /// Latency field on routing usage data.
    pub latency: i64,

    /// Requests field on routing usage data.
    pub requests: i64,

    /// Time field on routing usage data.
    pub time: String,
}
