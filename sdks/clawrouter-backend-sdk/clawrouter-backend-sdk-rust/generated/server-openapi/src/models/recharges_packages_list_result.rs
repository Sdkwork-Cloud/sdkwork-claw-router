use serde::{Deserialize, Serialize};

use crate::models::{AdminRechargePackageListResponse};

/// Recharges packages list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RechargesPackagesListResult {
    /// Business response code.
    pub code: String,

    /// Data field on recharges packages list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminRechargePackageListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
