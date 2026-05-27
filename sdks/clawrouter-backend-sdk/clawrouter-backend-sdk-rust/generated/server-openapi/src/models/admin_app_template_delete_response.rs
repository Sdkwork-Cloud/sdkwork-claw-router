use serde::{Deserialize, Serialize};

/// Admin app template delete response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAppTemplateDeleteResponse {
    /// Whether the app template was soft-deleted and detached from catalog projections.
    pub deleted: bool,
}
