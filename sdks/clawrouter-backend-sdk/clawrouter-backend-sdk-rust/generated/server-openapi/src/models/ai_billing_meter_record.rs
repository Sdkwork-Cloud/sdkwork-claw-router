use serde::{Deserialize, Serialize};

/// Ai billing meter record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiBillingMeterRecord {
    /// Aggregation mode field on ai billing meter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub aggregation_mode: Option<String>,

    /// Allow negative quantity field on ai billing meter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub allow_negative_quantity: Option<bool>,

    /// Billing mode field on ai billing meter record.
    pub billing_mode: String,

    /// Canonical price item type field on ai billing meter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub canonical_price_item_type: Option<String>,

    /// Created at field on ai billing meter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai billing meter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default unit field on ai billing meter record.
    pub default_unit: String,

    /// Default unit size field on ai billing meter record.
    pub default_unit_size: String,

    /// Deleted at field on ai billing meter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai billing meter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on ai billing meter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Display name field on ai billing meter record.
    pub display_name: String,

    /// Id field on ai billing meter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai billing meter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Meter code field on ai billing meter record.
    pub meter_code: String,

    /// Modality field on ai billing meter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub modality: Option<String>,

    /// Organization id field on ai billing meter record.
    pub organization_id: String,

    /// Quantity precision field on ai billing meter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quantity_precision: Option<i64>,

    /// Quantity source field on ai billing meter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quantity_source: Option<String>,

    /// Result selector field on ai billing meter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub result_selector: Option<String>,

    /// Sort order field on ai billing meter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on ai billing meter record.
    pub status: String,

    /// Supports expression field on ai billing meter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_expression: Option<bool>,

    /// Supports tier field on ai billing meter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_tier: Option<bool>,

    /// Tenant id field on ai billing meter record.
    pub tenant_id: String,

    /// Updated at field on ai billing meter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Usage type field on ai billing meter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_type: Option<String>,

    /// Uuid field on ai billing meter record.
    pub uuid: String,

    /// Version field on ai billing meter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
