use serde::{Deserialize, Serialize};

/// Commerce price list item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePriceListItem {
    /// Created at field on commerce price list item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Currency code field on commerce price list item.
    #[serde(rename = "currencyCode")]
    pub currency_code: String,

    /// Customer segment field on commerce price list item.
    #[serde(rename = "customerSegment")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub customer_segment: Option<String>,

    /// Ends at field on commerce price list item.
    #[serde(rename = "endsAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ends_at: Option<String>,

    /// Id field on commerce price list item.
    pub id: String,

    /// Market code field on commerce price list item.
    #[serde(rename = "marketCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub market_code: Option<String>,

    /// Price list no field on commerce price list item.
    #[serde(rename = "priceListNo")]
    pub price_list_no: String,

    /// Starts at field on commerce price list item.
    #[serde(rename = "startsAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub starts_at: Option<String>,

    /// Status field on commerce price list item.
    pub status: String,

    /// Updated at field on commerce price list item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}
