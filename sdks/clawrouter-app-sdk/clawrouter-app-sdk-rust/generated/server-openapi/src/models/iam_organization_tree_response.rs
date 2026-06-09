use serde::{Deserialize, Serialize};

use crate::models::{IamOrganizationTreeItem};

/// Iam organization tree response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamOrganizationTreeResponse {
    /// Items field on iam organization tree response.
    pub items: Vec<IamOrganizationTreeItem>,
}
