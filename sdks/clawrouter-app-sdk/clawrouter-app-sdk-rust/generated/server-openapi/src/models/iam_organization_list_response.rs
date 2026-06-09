use serde::{Deserialize, Serialize};

use crate::models::{IamOrganizationItem};

/// Iam organization list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamOrganizationListResponse {
    /// Items field on iam organization list response.
    pub items: Vec<IamOrganizationItem>,
}
