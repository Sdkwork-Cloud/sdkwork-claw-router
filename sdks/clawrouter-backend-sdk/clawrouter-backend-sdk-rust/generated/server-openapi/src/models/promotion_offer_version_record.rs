use serde::{Deserialize, Serialize};

/// Promotion offer version record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionOfferVersionRecord {
    /// Benefit definition id field on promotion offer version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub benefit_definition_id: Option<String>,

    /// Benefit kind field on promotion offer version record.
    pub benefit_kind: String,

    /// Benefit quantity field on promotion offer version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub benefit_quantity: Option<String>,

    /// Breakage policy field on promotion offer version record.
    pub breakage_policy: String,

    /// Created at field on promotion offer version record.
    pub created_at: String,

    /// Created by field on promotion offer version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_by: Option<String>,

    /// Currency code field on promotion offer version record.
    pub currency_code: String,

    /// Customer visible field on promotion offer version record.
    pub customer_visible: bool,

    /// Discount amount minor field on promotion offer version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub discount_amount_minor: Option<String>,

    /// Discount percent bps field on promotion offer version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub discount_percent_bps: Option<i64>,

    /// Discount type field on promotion offer version record.
    pub discount_type: String,

    /// Face value minor field on promotion offer version record.
    pub face_value_minor: String,

    /// Fixed price minor field on promotion offer version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub fixed_price_minor: Option<String>,

    /// Id field on promotion offer version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Liability policy field on promotion offer version record.
    pub liability_policy: String,

    /// Lifecycle status field on promotion offer version record.
    pub lifecycle_status: String,

    /// Maximum discount amount minor field on promotion offer version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub maximum_discount_amount_minor: Option<String>,

    /// Minimum order amount minor field on promotion offer version record.
    pub minimum_order_amount_minor: String,

    /// Offer id field on promotion offer version record.
    pub offer_id: String,

    /// Organization id field on promotion offer version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Published at field on promotion offer version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Return policy field on promotion offer version record.
    pub return_policy: String,

    /// Rule snapshot json field on promotion offer version record.
    pub rule_snapshot_json: std::collections::HashMap<String, String>,

    /// Settlement policy field on promotion offer version record.
    pub settlement_policy: String,

    /// Stack strategy field on promotion offer version record.
    pub stack_strategy: String,

    /// Tax treatment field on promotion offer version record.
    pub tax_treatment: String,

    /// Tenant id field on promotion offer version record.
    pub tenant_id: String,

    /// Updated at field on promotion offer version record.
    pub updated_at: String,

    /// Updated by field on promotion offer version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_by: Option<String>,

    /// Validity duration seconds field on promotion offer version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub validity_duration_seconds: Option<String>,

    /// Validity type field on promotion offer version record.
    pub validity_type: String,

    /// Version no field on promotion offer version record.
    pub version_no: String,
}
