use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductSkuAttributeItem, MediaResource};

/// Commerce product sku item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductSkuItem {
    /// Attributes field on commerce product sku item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub attributes: Option<Vec<CommerceProductSkuAttributeItem>>,

    /// Barcode field on commerce product sku item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub barcode: Option<String>,

    /// Created at field on commerce product sku item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Default currency code field on commerce product sku item.
    #[serde(rename = "defaultCurrencyCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_currency_code: Option<String>,

    /// Default price amount field on commerce product sku item.
    #[serde(rename = "defaultPriceAmount")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_price_amount: Option<String>,

    /// Fulfillment type field on commerce product sku item.
    #[serde(rename = "fulfillmentType")]
    pub fulfillment_type: String,

    /// Id field on commerce product sku item.
    pub id: String,

    /// Image field on commerce product sku item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub image: Option<MediaResource>,

    /// Product id field on commerce product sku item.
    #[serde(rename = "productId")]
    pub product_id: String,

    /// Published at field on commerce product sku item.
    #[serde(rename = "publishedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Sales unit field on commerce product sku item.
    #[serde(rename = "salesUnit")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sales_unit: Option<String>,

    /// Sku no field on commerce product sku item.
    #[serde(rename = "skuNo")]
    pub sku_no: String,

    /// Status field on commerce product sku item.
    pub status: String,

    /// Tax category field on commerce product sku item.
    #[serde(rename = "taxCategory")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tax_category: Option<String>,

    /// Title field on commerce product sku item.
    pub title: String,

    /// Updated at field on commerce product sku item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}
