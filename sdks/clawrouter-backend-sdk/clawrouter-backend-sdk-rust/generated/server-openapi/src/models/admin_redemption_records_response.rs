use serde::{Deserialize, Serialize};

use crate::models::{AdminRedemptionRecordItem};

/// Admin redemption records response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminRedemptionRecordsResponse {
    /// Items field on admin redemption records response.
    pub items: Vec<AdminRedemptionRecordItem>,
}
