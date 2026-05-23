use serde::{Deserialize, Serialize};

/// Commerce sku record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceSkuRecord {
    /// Created at field on commerce sku record.
    pub created_at: String,

    /// Currency code field on commerce sku record.
    pub currency_code: String,

    /// Name field on commerce sku record.
    pub name: String,

    /// Organization id field on commerce sku record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Original price amount field on commerce sku record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub original_price_amount: Option<String>,

    /// Price amount field on commerce sku record.
    pub price_amount: String,

    /// Product id field on commerce sku record.
    pub product_id: String,

    /// Sku no field on commerce sku record.
    pub sku_no: String,

    /// Spec json field on commerce sku record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub spec_json: Option<String>,

    /// Status field on commerce sku record.
    pub status: String,

    /// Stock quantity field on commerce sku record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub stock_quantity: Option<String>,

    /// Tenant id field on commerce sku record.
    pub tenant_id: String,

    /// Title field on commerce sku record.
    pub title: String,

    /// Updated at field on commerce sku record.
    pub updated_at: String,
}
