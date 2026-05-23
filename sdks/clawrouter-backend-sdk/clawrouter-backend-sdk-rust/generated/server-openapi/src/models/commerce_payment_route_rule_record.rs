use serde::{Deserialize, Serialize};

/// Commerce payment route rule record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentRouteRuleRecord {
    /// Amount max field on commerce payment route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub amount_max: Option<String>,

    /// Amount min field on commerce payment route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub amount_min: Option<String>,

    /// Channel id field on commerce payment route rule record.
    pub channel_id: String,

    /// Client platform field on commerce payment route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_platform: Option<String>,

    /// Country code field on commerce payment route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub country_code: Option<String>,

    /// Created at field on commerce payment route rule record.
    pub created_at: String,

    /// Currency code field on commerce payment route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency_code: Option<String>,

    /// Ends at field on commerce payment route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ends_at: Option<String>,

    /// Organization id field on commerce payment route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Purchase type field on commerce payment route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub purchase_type: Option<String>,

    /// Risk level field on commerce payment route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub risk_level: Option<String>,

    /// Rule no field on commerce payment route rule record.
    pub rule_no: String,

    /// Starts at field on commerce payment route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub starts_at: Option<String>,

    /// Status field on commerce payment route rule record.
    pub status: String,

    /// Tenant id field on commerce payment route rule record.
    pub tenant_id: String,

    /// Updated at field on commerce payment route rule record.
    pub updated_at: String,

    /// User segment field on commerce payment route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_segment: Option<String>,
}
