use serde::{Deserialize, Serialize};

use crate::models::{IamDepartmentTreeItem};

/// Iam department tree response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamDepartmentTreeResponse {
    /// Items field on iam department tree response.
    pub items: Vec<IamDepartmentTreeItem>,
}
