use serde::{Deserialize, Serialize};

use crate::models::{IamDepartmentAssignmentListResponse};

/// Department assignments list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct DepartmentAssignmentsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on department assignments list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<IamDepartmentAssignmentListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
