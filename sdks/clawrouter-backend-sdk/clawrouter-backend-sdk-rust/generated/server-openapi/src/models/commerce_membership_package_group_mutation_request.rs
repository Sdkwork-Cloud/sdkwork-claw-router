use serde::{Deserialize, Serialize};

/// Commerce membership package group mutation request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceMembershipPackageGroupMutationRequest {
    /// Billing cycle field on commerce membership package group mutation request.
    #[serde(rename = "billingCycle")]
    pub billing_cycle: String,

    /// Code field on commerce membership package group mutation request.
    pub code: String,

    /// Description field on commerce membership package group mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Duration days field on commerce membership package group mutation request.
    #[serde(rename = "durationDays")]
    pub duration_days: i64,

    /// Name field on commerce membership package group mutation request.
    pub name: String,

    /// Sort weight field on commerce membership package group mutation request.
    #[serde(rename = "sortWeight")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_weight: Option<i64>,

    /// Status field on commerce membership package group mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,
}
