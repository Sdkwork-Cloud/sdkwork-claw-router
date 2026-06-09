use serde::{Deserialize, Serialize};

use crate::models::{IamOrganizationMembershipItem};

/// Iam organization membership list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamOrganizationMembershipListResponse {
    /// Items field on iam organization membership list response.
    pub items: Vec<IamOrganizationMembershipItem>,
}
