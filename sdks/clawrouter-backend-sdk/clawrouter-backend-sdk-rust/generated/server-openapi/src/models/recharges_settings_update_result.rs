use serde::{Deserialize, Serialize};

use crate::models::{AdminRechargeSettingsResponse};

/// Recharges settings update result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RechargesSettingsUpdateResult {
    /// Business response code.
    pub code: String,

    /// Data field on recharges settings update result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminRechargeSettingsResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
