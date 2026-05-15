use serde::{Deserialize, Serialize};

use crate::models::{AdminRechargeRecordItem};

/// Admin recharge records response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminRechargeRecordsResponse {
    /// Items field on admin recharge records response.
    pub items: Vec<AdminRechargeRecordItem>,
}
