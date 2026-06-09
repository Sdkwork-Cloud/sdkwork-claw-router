use serde::{Deserialize, Serialize};

use crate::models::{IamRoleBindingListResponse};

/// Role bindings list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RoleBindingsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on role bindings list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<IamRoleBindingListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
