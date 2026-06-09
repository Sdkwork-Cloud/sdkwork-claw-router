use serde::{Deserialize, Serialize};

use crate::models::{IamOrganizationMembershipListResponse};

/// Organization memberships list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OrganizationMembershipsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on organization memberships list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<IamOrganizationMembershipListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
