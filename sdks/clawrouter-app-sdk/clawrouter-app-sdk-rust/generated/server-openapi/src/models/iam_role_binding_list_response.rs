use serde::{Deserialize, Serialize};

use crate::models::{IamRoleBindingItem};

/// Iam role binding list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamRoleBindingListResponse {
    /// Items field on iam role binding list response.
    pub items: Vec<IamRoleBindingItem>,
}
