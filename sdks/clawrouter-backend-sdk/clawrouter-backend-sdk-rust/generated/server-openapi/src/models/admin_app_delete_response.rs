use serde::{Deserialize, Serialize};

/// Admin app delete response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAppDeleteResponse {
    /// Whether the PlusApp row and attached catalog records were deleted.
    pub deleted: bool,
}
