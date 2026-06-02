use serde::{Deserialize, Serialize};

/// Promotion offer record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionOfferRecord {
    /// Audience scope field on promotion offer record.
    pub audience_scope: String,

    /// Combinability field on promotion offer record.
    pub combinability: String,

    /// Created at field on promotion offer record.
    pub created_at: String,

    /// Created by field on promotion offer record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_by: Option<String>,

    /// Current offer version id field on promotion offer record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub current_offer_version_id: Option<String>,

    /// Description field on promotion offer record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Ends at field on promotion offer record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ends_at: Option<String>,

    /// Id field on promotion offer record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Name field on promotion offer record.
    pub name: String,

    /// Offer code field on promotion offer record.
    pub offer_code: String,

    /// Offer no field on promotion offer record.
    pub offer_no: String,

    /// Offer type field on promotion offer record.
    pub offer_type: String,

    /// Organization id field on promotion offer record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Priority field on promotion offer record.
    pub priority: i64,

    /// Starts at field on promotion offer record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub starts_at: Option<String>,

    /// Status field on promotion offer record.
    pub status: String,

    /// Tenant id field on promotion offer record.
    pub tenant_id: String,

    /// Updated at field on promotion offer record.
    pub updated_at: String,

    /// Updated by field on promotion offer record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_by: Option<String>,
}
