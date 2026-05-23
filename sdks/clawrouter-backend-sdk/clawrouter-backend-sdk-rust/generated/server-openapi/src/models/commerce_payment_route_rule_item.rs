use serde::{Deserialize, Serialize};

/// Commerce payment route rule item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentRouteRuleItem {
    /// Channel id field on commerce payment route rule item.
    #[serde(rename = "channelId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_id: Option<String>,

    /// Country code field on commerce payment route rule item.
    #[serde(rename = "countryCode")]
    pub country_code: String,

    /// Created at field on commerce payment route rule item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Currency code field on commerce payment route rule item.
    #[serde(rename = "currencyCode")]
    pub currency_code: String,

    /// Fallback channel id field on commerce payment route rule item.
    #[serde(rename = "fallbackChannelId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub fallback_channel_id: Option<String>,

    /// Fallback enabled field on commerce payment route rule item.
    #[serde(rename = "fallbackEnabled")]
    pub fallback_enabled: bool,

    /// Id field on commerce payment route rule item.
    pub id: String,

    /// Method code field on commerce payment route rule item.
    #[serde(rename = "methodCode")]
    pub method_code: String,

    /// Priority field on commerce payment route rule item.
    pub priority: i64,

    /// Rule no field on commerce payment route rule item.
    #[serde(rename = "ruleNo")]
    pub rule_no: String,

    /// Scene code field on commerce payment route rule item.
    #[serde(rename = "sceneCode")]
    pub scene_code: String,

    /// Status field on commerce payment route rule item.
    pub status: String,

    /// Updated at field on commerce payment route rule item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}
