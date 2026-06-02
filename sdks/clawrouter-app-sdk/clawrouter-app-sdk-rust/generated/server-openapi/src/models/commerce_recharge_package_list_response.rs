use serde::{Deserialize, Serialize};

use crate::models::{CommerceRechargePackageItem};

/// Commerce recharge package list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceRechargePackageListResponse {
    /// Items field on commerce recharge package list response.
    pub items: Vec<CommerceRechargePackageItem>,
}
