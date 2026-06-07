use serde::{Deserialize, Serialize};

use crate::models::{AdminRechargePackageItem};

/// Admin recharge package list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminRechargePackageListResponse {
    /// Items field on admin recharge package list response.
    pub items: Vec<AdminRechargePackageItem>,
}
