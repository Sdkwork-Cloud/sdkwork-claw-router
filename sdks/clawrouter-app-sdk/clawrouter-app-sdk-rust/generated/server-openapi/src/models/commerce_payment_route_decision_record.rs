use serde::{Deserialize, Serialize};

/// Commerce payment route decision record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentRouteDecisionRecord {
    /// Amount field on commerce payment route decision record.
    pub amount: String,

    /// Channel id field on commerce payment route decision record.
    pub channel_id: String,

    /// Country code field on commerce payment route decision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub country_code: Option<String>,

    /// Created at field on commerce payment route decision record.
    pub created_at: String,

    /// Currency code field on commerce payment route decision record.
    pub currency_code: String,

    /// Decision reason field on commerce payment route decision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub decision_reason: Option<String>,

    /// Fallback from channel id field on commerce payment route decision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub fallback_from_channel_id: Option<String>,

    /// Id field on commerce payment route decision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Method code field on commerce payment route decision record.
    pub method_code: String,

    /// Organization id field on commerce payment route decision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payment attempt id field on commerce payment route decision record.
    pub payment_attempt_id: String,

    /// Payment intent id field on commerce payment route decision record.
    pub payment_intent_id: String,

    /// Provider account id field on commerce payment route decision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_account_id: Option<String>,

    /// Provider code field on commerce payment route decision record.
    pub provider_code: String,

    /// Risk level field on commerce payment route decision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub risk_level: Option<String>,

    /// Route rule id field on commerce payment route decision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub route_rule_id: Option<String>,

    /// Scene code field on commerce payment route decision record.
    pub scene_code: String,

    /// Tenant id field on commerce payment route decision record.
    pub tenant_id: String,
}
