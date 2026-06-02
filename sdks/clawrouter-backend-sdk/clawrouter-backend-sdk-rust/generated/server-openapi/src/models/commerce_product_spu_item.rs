use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductMediaItem};

/// Commerce product spu item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductSpuItem {
    /// Brand field on commerce product spu item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub brand: Option<String>,

    /// Category ids field on commerce product spu item.
    #[serde(rename = "categoryIds")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_ids: Option<Vec<String>>,

    /// Created at field on commerce product spu item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Currency code field on commerce product spu item.
    #[serde(rename = "currencyCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency_code: Option<String>,

    /// Default sku id field on commerce product spu item.
    #[serde(rename = "defaultSkuId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_sku_id: Option<String>,

    /// Description field on commerce product spu item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Id field on commerce product spu item.
    pub id: String,

    /// Media field on commerce product spu item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub media: Option<Vec<CommerceProductMediaItem>>,

    /// Min price amount field on commerce product spu item.
    #[serde(rename = "minPriceAmount")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub min_price_amount: Option<String>,

    /// Product type field on commerce product spu item.
    #[serde(rename = "productType")]
    pub product_type: String,

    /// Published at field on commerce product spu item.
    #[serde(rename = "publishedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Spu no field on commerce product spu item.
    #[serde(rename = "spuNo")]
    pub spu_no: String,

    /// Status field on commerce product spu item.
    pub status: String,

    /// Subtitle field on commerce product spu item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subtitle: Option<String>,

    /// Title field on commerce product spu item.
    pub title: String,

    /// Updated at field on commerce product spu item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}
