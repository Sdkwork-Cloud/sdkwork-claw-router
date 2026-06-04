use serde::{Deserialize, Serialize};

/// Routing retry policy schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RoutingRetryPolicy {
    /// Backoff ms field on routing retry policy.
    #[serde(rename = "backoffMs")]
    pub backoff_ms: i64,

    /// Max attempts field on routing retry policy.
    #[serde(rename = "maxAttempts")]
    pub max_attempts: i64,

    /// Retryable status codes field on routing retry policy.
    #[serde(rename = "retryableStatusCodes")]
    pub retryable_status_codes: Vec<i64>,
}
