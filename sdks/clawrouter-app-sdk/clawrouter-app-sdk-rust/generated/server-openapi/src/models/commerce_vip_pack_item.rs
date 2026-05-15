use serde::{Deserialize, Serialize};

/// Commerce vip pack item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceVipPackItem {
    /// Code field on commerce vip pack item.
    pub code: String,

    /// Currency code field on commerce vip pack item.
    #[serde(rename = "currencyCode")]
    pub currency_code: String,

    /// Id field on commerce vip pack item.
    pub id: String,

    /// Name field on commerce vip pack item.
    pub name: String,

    /// Price amount field on commerce vip pack item.
    #[serde(rename = "priceAmount")]
    pub price_amount: String,

    /// Status field on commerce vip pack item.
    pub status: String,
}
