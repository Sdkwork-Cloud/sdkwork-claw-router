use serde::{Deserialize, Serialize};

/// Commerce membership member status request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceMembershipMemberStatusRequest {
    /// Status field on commerce membership member status request.
    pub status: String,
}
