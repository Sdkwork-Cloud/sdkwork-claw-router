use serde::{Deserialize, Serialize};

use crate::models::{IamPositionItem};

/// Iam position list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamPositionListResponse {
    /// Items field on iam position list response.
    pub items: Vec<IamPositionItem>,
}
