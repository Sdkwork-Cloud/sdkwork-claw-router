use serde::{Deserialize, Serialize};

use crate::models::{RechargePackage};

/// Account points recharges packages list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AccountPointsRechargesPackagesListResult {
    /// Business response code.
    pub code: String,

    /// Data field on account points recharges packages list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<Vec<RechargePackage>>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
