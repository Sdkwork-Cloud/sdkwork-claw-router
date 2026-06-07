use serde::{Deserialize, Serialize};

use crate::models::{CommerceStandardCollectionResponse};

/// Refunds list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RefundsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on refunds list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceStandardCollectionResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
