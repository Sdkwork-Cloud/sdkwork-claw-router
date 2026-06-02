use serde::{Deserialize, Serialize};

/// Commerce price list item record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePriceListItemRecord {
    /// Compare at amount field on commerce price list item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub compare_at_amount: Option<String>,

    /// Created at field on commerce price list item record.
    pub created_at: String,

    /// Id field on commerce price list item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Max quantity field on commerce price list item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_quantity: Option<String>,

    /// Min quantity field on commerce price list item record.
    pub min_quantity: String,

    /// Organization id field on commerce price list item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Price amount field on commerce price list item record.
    pub price_amount: String,

    /// Price list id field on commerce price list item record.
    pub price_list_id: String,

    /// Sku id field on commerce price list item record.
    pub sku_id: String,

    /// Tenant id field on commerce price list item record.
    pub tenant_id: String,

    /// Updated at field on commerce price list item record.
    pub updated_at: String,
}
