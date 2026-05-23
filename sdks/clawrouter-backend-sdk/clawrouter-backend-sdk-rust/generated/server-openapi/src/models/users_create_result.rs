use serde::{Deserialize, Serialize};

use crate::models::{AdminUserMutationResponse};

/// Users create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct UsersCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on users create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminUserMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
