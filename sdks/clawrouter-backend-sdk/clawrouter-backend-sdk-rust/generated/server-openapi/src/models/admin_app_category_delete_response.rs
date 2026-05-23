use serde::{Deserialize, Serialize};

/// Admin app category delete response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAppCategoryDeleteResponse {
    /// Whether the app store category was deleted.
    pub deleted: bool,
}
