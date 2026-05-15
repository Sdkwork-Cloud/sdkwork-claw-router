use serde::{Deserialize, Serialize};

use crate::models::{AdminAppItemResponse};

/// Admin app mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAppMutationResponse {
    /// Item field on admin app mutation response.
    pub item: AdminAppItemResponse,
}
