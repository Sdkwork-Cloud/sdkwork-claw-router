use serde::{Deserialize, Serialize};

use crate::models::{BillingHistoryCollectionResponse};

/// Billing history list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct BillingHistoryListResult {
    /// Business response code.
    pub code: String,

    /// Data field on billing history list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<BillingHistoryCollectionResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
