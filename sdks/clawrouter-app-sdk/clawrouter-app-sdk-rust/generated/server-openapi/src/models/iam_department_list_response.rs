use serde::{Deserialize, Serialize};

use crate::models::{IamDepartmentItem};

/// Iam department list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamDepartmentListResponse {
    /// Items field on iam department list response.
    pub items: Vec<IamDepartmentItem>,
}
