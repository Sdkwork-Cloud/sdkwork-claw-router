use serde::{Deserialize, Serialize};

/// Commerce points balance response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePointsBalanceResponse {
    /// Available points field on commerce points balance response.
    #[serde(rename = "availablePoints")]
    pub available_points: i64,

    /// Frozen points field on commerce points balance response.
    #[serde(rename = "frozenPoints")]
    pub frozen_points: i64,
}
