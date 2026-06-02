use serde::{Deserialize, Serialize};

/// Commerce product sku record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductSkuRecord {
    /// Created at field on commerce product sku record.
    pub created_at: String,

    /// Default currency code field on commerce product sku record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_currency_code: Option<String>,

    /// Default price amount field on commerce product sku record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_price_amount: Option<String>,

    /// Fulfillment type field on commerce product sku record.
    pub fulfillment_type: String,

    /// Id field on commerce product sku record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Organization id field on commerce product sku record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Published at field on commerce product sku record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Sales unit field on commerce product sku record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sales_unit: Option<String>,

    /// Sku no field on commerce product sku record.
    pub sku_no: String,

    /// Spu id field on commerce product sku record.
    pub spu_id: String,

    /// Status field on commerce product sku record.
    pub status: String,

    /// Tax category field on commerce product sku record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tax_category: Option<String>,

    /// Tenant id field on commerce product sku record.
    pub tenant_id: String,

    /// Title field on commerce product sku record.
    pub title: String,

    /// Updated at field on commerce product sku record.
    pub updated_at: String,
}
