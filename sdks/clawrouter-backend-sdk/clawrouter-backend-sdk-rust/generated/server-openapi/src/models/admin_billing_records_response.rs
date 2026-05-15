use serde::{Deserialize, Serialize};

use crate::models::{AdminBillingRecordItem};

/// Admin billing records response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminBillingRecordsResponse {
    /// Items field on admin billing records response.
    pub items: Vec<AdminBillingRecordItem>,
}
