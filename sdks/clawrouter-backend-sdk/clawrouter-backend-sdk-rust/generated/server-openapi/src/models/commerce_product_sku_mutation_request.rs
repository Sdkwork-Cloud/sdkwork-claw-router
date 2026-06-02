use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductSkuAttributeItem, MediaResource};

/// Commerce product sku mutation request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductSkuMutationRequest {
    /// Attributes field on commerce product sku mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub attributes: Option<Vec<CommerceProductSkuAttributeItem>>,

    /// Barcode field on commerce product sku mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub barcode: Option<String>,

    /// Default currency code field on commerce product sku mutation request.
    #[serde(rename = "defaultCurrencyCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_currency_code: Option<String>,

    /// Default price amount field on commerce product sku mutation request.
    #[serde(rename = "defaultPriceAmount")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_price_amount: Option<String>,

    /// Fulfillment type field on commerce product sku mutation request.
    #[serde(rename = "fulfillmentType")]
    pub fulfillment_type: String,

    /// Image field on commerce product sku mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub image: Option<MediaResource>,

    /// Product id field on commerce product sku mutation request.
    #[serde(rename = "productId")]
    pub product_id: String,

    /// Sales unit field on commerce product sku mutation request.
    #[serde(rename = "salesUnit")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sales_unit: Option<String>,

    /// Sku no field on commerce product sku mutation request.
    #[serde(rename = "skuNo")]
    pub sku_no: String,

    /// Status field on commerce product sku mutation request.
    pub status: String,

    /// Tax category field on commerce product sku mutation request.
    #[serde(rename = "taxCategory")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tax_category: Option<String>,

    /// Title field on commerce product sku mutation request.
    pub title: String,
}
