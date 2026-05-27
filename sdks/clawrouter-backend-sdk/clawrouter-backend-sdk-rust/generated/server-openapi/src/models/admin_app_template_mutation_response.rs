use serde::{Deserialize, Serialize};

use crate::models::{AdminAppTemplateItemResponse};

/// Admin app template mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAppTemplateMutationResponse {
    /// Item field on admin app template mutation response.
    pub item: AdminAppTemplateItemResponse,
}
