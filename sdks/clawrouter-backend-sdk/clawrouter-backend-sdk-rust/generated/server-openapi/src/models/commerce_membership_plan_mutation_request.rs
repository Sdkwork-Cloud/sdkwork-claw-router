use serde::{Deserialize, Serialize};

use crate::models::{CommerceMembershipBenefitMutationRequest};

/// Commerce membership plan mutation request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceMembershipPlanMutationRequest {
    /// Benefits field on commerce membership plan mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub benefits: Option<Vec<CommerceMembershipBenefitMutationRequest>>,

    /// Code field on commerce membership plan mutation request.
    pub code: String,

    /// Name field on commerce membership plan mutation request.
    pub name: String,

    /// Rank field on commerce membership plan mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rank: Option<i64>,

    /// Status field on commerce membership plan mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,
}
