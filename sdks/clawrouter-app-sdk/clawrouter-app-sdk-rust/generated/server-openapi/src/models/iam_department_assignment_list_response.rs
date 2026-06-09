use serde::{Deserialize, Serialize};

use crate::models::{IamDepartmentAssignmentItem};

/// Iam department assignment list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamDepartmentAssignmentListResponse {
    /// Items field on iam department assignment list response.
    pub items: Vec<IamDepartmentAssignmentItem>,
}
