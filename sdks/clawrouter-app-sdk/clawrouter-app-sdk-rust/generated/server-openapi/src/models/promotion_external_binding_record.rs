use serde::{Deserialize, Serialize};

/// Promotion external binding record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionExternalBindingRecord {
    /// Binding no field on promotion external binding record.
    pub binding_no: String,

    /// Claim code hash field on promotion external binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub claim_code_hash: Option<String>,

    /// Claim code suffix field on promotion external binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub claim_code_suffix: Option<String>,

    /// Code id field on promotion external binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code_id: Option<String>,

    /// Created at field on promotion external binding record.
    pub created_at: String,

    /// Created by field on promotion external binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_by: Option<String>,

    /// External currency code field on promotion external binding record.
    pub external_currency_code: String,

    /// External merchant id field on promotion external binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub external_merchant_id: Option<String>,

    /// External object id field on promotion external binding record.
    pub external_object_id: String,

    /// External object type field on promotion external binding record.
    pub external_object_type: String,

    /// Last error code field on promotion external binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_error_code: Option<String>,

    /// Last error message field on promotion external binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_error_message: Option<String>,

    /// Last sync at field on promotion external binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_sync_at: Option<String>,

    /// Metadata json field on promotion external binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata_json: Option<std::collections::HashMap<String, String>>,

    /// Offer id field on promotion external binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub offer_id: Option<String>,

    /// Offer version id field on promotion external binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub offer_version_id: Option<String>,

    /// Organization id field on promotion external binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Platform field on promotion external binding record.
    pub platform: String,

    /// Platform card id field on promotion external binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub platform_card_id: Option<String>,

    /// Platform coupon id field on promotion external binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub platform_coupon_id: Option<String>,

    /// Platform stock id field on promotion external binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub platform_stock_id: Option<String>,

    /// Platform template id field on promotion external binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub platform_template_id: Option<String>,

    /// Stock id field on promotion external binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub stock_id: Option<String>,

    /// Sync status field on promotion external binding record.
    pub sync_status: String,

    /// Tenant id field on promotion external binding record.
    pub tenant_id: String,

    /// Updated at field on promotion external binding record.
    pub updated_at: String,

    /// Updated by field on promotion external binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_by: Option<String>,

    /// User coupon id field on promotion external binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_coupon_id: Option<String>,
}
