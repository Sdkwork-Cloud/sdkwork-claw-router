use serde::{Deserialize, Serialize};

use crate::models::{IamOrganizationTreeResponse};

/// Organizations tree retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OrganizationsTreeRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on organizations tree retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<IamOrganizationTreeResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
