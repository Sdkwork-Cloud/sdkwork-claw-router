use serde::{Deserialize, Serialize};

/// Promotion offer presentation record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionOfferPresentationRecord {
    /// Brand name field on promotion offer presentation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub brand_name: Option<String>,

    /// Cover asset id field on promotion offer presentation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cover_asset_id: Option<String>,

    /// Created at field on promotion offer presentation record.
    pub created_at: String,

    /// Created by field on promotion offer presentation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_by: Option<String>,

    /// Customer action json field on promotion offer presentation record.
    pub customer_action_json: std::collections::HashMap<String, String>,

    /// Display name field on promotion offer presentation record.
    pub display_name: String,

    /// Field schema json field on promotion offer presentation record.
    pub field_schema_json: std::collections::HashMap<String, String>,

    /// Locale field on promotion offer presentation record.
    pub locale: String,

    /// Logo asset id field on promotion offer presentation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub logo_asset_id: Option<String>,

    /// Merchant display name field on promotion offer presentation record.
    pub merchant_display_name: String,

    /// Offer id field on promotion offer presentation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub offer_id: Option<String>,

    /// Offer version id field on promotion offer presentation record.
    pub offer_version_id: String,

    /// Organization id field on promotion offer presentation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Param schema json field on promotion offer presentation record.
    pub param_schema_json: std::collections::HashMap<String, String>,

    /// Presentation no field on promotion offer presentation record.
    pub presentation_no: String,

    /// Primary color field on promotion offer presentation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub primary_color: Option<String>,

    /// Recognition hash field on promotion offer presentation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub recognition_hash: Option<String>,

    /// Recognition type field on promotion offer presentation record.
    pub recognition_type: String,

    /// Secondary color field on promotion offer presentation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secondary_color: Option<String>,

    /// Status field on promotion offer presentation record.
    pub status: String,

    /// Style snapshot json field on promotion offer presentation record.
    pub style_snapshot_json: std::collections::HashMap<String, String>,

    /// Surface type field on promotion offer presentation record.
    pub surface_type: String,

    /// Tenant id field on promotion offer presentation record.
    pub tenant_id: String,

    /// Terms json field on promotion offer presentation record.
    pub terms_json: std::collections::HashMap<String, String>,

    /// Updated at field on promotion offer presentation record.
    pub updated_at: String,

    /// Updated by field on promotion offer presentation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_by: Option<String>,

    /// Verify method field on promotion offer presentation record.
    pub verify_method: String,
}
