use serde::{Deserialize, Serialize};

use crate::models::{CommerceStandardCollectionResponse};

/// Memberships benefits list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MembershipsBenefitsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on memberships benefits list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceStandardCollectionResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
