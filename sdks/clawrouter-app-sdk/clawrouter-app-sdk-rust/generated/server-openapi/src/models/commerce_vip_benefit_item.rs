use serde::{Deserialize, Serialize};

/// Commerce vip benefit item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceVipBenefitItem {
    /// Benefit type field on commerce vip benefit item.
    #[serde(rename = "benefitType")]
    pub benefit_type: String,

    /// Code field on commerce vip benefit item.
    pub code: String,

    /// Id field on commerce vip benefit item.
    pub id: String,

    /// Name field on commerce vip benefit item.
    pub name: String,

    /// Status field on commerce vip benefit item.
    pub status: String,
}
