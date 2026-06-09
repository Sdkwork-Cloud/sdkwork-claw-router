use serde::{Deserialize, Serialize};

use crate::models::{IamPositionAssignmentItem};

/// Iam position assignment list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamPositionAssignmentListResponse {
    /// Items field on iam position assignment list response.
    pub items: Vec<IamPositionAssignmentItem>,
}
