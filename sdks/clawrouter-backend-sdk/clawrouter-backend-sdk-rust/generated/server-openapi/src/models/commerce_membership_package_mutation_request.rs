use serde::{Deserialize, Serialize};

/// Commerce membership package mutation request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceMembershipPackageMutationRequest {
    /// Code field on commerce membership package mutation request.
    pub code: String,

    /// Currency code field on commerce membership package mutation request.
    #[serde(rename = "currencyCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency_code: Option<String>,

    /// Duration days field on commerce membership package mutation request.
    #[serde(rename = "durationDays")]
    pub duration_days: String,

    /// Name field on commerce membership package mutation request.
    pub name: String,

    /// Package group id field on commerce membership package mutation request.
    #[serde(rename = "packageGroupId")]
    pub package_group_id: String,

    /// Plan id field on commerce membership package mutation request.
    #[serde(rename = "planId")]
    pub plan_id: String,

    /// Price amount field on commerce membership package mutation request.
    #[serde(rename = "priceAmount")]
    pub price_amount: String,

    /// Status field on commerce membership package mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,
}
