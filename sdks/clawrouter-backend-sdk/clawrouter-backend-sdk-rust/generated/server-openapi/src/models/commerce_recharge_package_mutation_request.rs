use serde::{Deserialize, Serialize};

/// Commerce recharge package mutation request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceRechargePackageMutationRequest {
    /// Bonus points field on commerce recharge package mutation request.
    #[serde(rename = "bonusPoints")]
    pub bonus_points: i64,

    /// Currency code field on commerce recharge package mutation request.
    #[serde(rename = "currencyCode")]
    pub currency_code: String,

    /// Price amount field on commerce recharge package mutation request.
    #[serde(rename = "priceAmount")]
    pub price_amount: String,

    /// Status field on commerce recharge package mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,
}
