use serde::{Deserialize, Serialize};

/// Billing history collection response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct BillingHistoryCollectionResponse {
    /// Items field on billing history collection response.
    pub items: Vec<serde_json::Value>,
}
