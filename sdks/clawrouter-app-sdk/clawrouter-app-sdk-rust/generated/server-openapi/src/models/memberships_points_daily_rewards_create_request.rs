use serde::{Deserialize, Serialize};

/// Closed empty request body for claiming the current member daily reward.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MembershipsPointsDailyRewardsCreateRequest {
    #[serde(flatten)]
    pub additional_properties: std::collections::HashMap<String, serde_json::Value>,
}
