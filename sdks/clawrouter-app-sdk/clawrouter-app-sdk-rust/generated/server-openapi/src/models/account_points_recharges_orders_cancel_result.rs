use serde::{Deserialize, Serialize};

use crate::models::{CommerceOperationResponse};

/// Account points recharges orders cancel result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AccountPointsRechargesOrdersCancelResult {
    /// Business response code.
    pub code: String,

    /// Data field on account points recharges orders cancel result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceOperationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
