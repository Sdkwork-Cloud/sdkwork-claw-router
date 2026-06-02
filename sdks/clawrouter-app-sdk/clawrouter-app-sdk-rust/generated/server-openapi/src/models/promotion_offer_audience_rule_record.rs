use serde::{Deserialize, Serialize};

/// Promotion offer audience rule record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionOfferAudienceRuleRecord {
    /// Created at field on promotion offer audience rule record.
    pub created_at: String,

    /// Id field on promotion offer audience rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Offer version id field on promotion offer audience rule record.
    pub offer_version_id: String,

    /// Organization id field on promotion offer audience rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Priority field on promotion offer audience rule record.
    pub priority: i64,

    /// Rule operator field on promotion offer audience rule record.
    pub rule_operator: String,

    /// Rule type field on promotion offer audience rule record.
    pub rule_type: String,

    /// Rule value field on promotion offer audience rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rule_value: Option<String>,

    /// Rule value json field on promotion offer audience rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rule_value_json: Option<std::collections::HashMap<String, String>>,

    /// Tenant id field on promotion offer audience rule record.
    pub tenant_id: String,

    /// Updated at field on promotion offer audience rule record.
    pub updated_at: String,
}
