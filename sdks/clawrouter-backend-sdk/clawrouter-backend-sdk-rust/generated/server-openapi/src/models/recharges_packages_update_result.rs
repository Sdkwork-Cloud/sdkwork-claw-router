use serde::{Deserialize, Serialize};

use crate::models::{AdminRechargePackageMutationResponse};

/// Recharges packages update result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RechargesPackagesUpdateResult {
    /// Business response code.
    pub code: String,

    /// Data field on recharges packages update result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminRechargePackageMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
