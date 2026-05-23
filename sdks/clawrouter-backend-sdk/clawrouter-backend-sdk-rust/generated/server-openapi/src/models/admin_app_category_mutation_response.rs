use serde::{Deserialize, Serialize};

use crate::models::{AdminAppCategoryItem};

/// Admin app category mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAppCategoryMutationResponse {
    /// Item field on admin app category mutation response.
    pub item: AdminAppCategoryItem,
}
