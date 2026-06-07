use serde::{Deserialize, Serialize};

/// Commerce payment channel item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentChannelItem {
    /// Channel no field on commerce payment channel item.
    #[serde(rename = "channelNo")]
    pub channel_no: String,

    /// Country code field on commerce payment channel item.
    #[serde(rename = "countryCode")]
    pub country_code: String,

    /// Created at field on commerce payment channel item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Currency code field on commerce payment channel item.
    #[serde(rename = "currencyCode")]
    pub currency_code: String,

    /// Id field on commerce payment channel item.
    pub id: String,

    /// Method code field on commerce payment channel item.
    #[serde(rename = "methodCode")]
    pub method_code: String,

    /// Priority field on commerce payment channel item.
    pub priority: String,

    /// Provider account id field on commerce payment channel item.
    #[serde(rename = "providerAccountId")]
    pub provider_account_id: String,

    /// Provider code field on commerce payment channel item.
    #[serde(rename = "providerCode")]
    pub provider_code: String,

    /// Scene code field on commerce payment channel item.
    #[serde(rename = "sceneCode")]
    pub scene_code: String,

    /// Status field on commerce payment channel item.
    pub status: String,

    /// Updated at field on commerce payment channel item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}
