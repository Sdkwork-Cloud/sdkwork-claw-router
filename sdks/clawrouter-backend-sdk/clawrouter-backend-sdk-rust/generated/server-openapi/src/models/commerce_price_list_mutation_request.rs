use serde::{Deserialize, Serialize};

/// Commerce price list mutation request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePriceListMutationRequest {
    /// Currency code field on commerce price list mutation request.
    #[serde(rename = "currencyCode")]
    pub currency_code: String,

    /// Customer segment field on commerce price list mutation request.
    #[serde(rename = "customerSegment")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub customer_segment: Option<String>,

    /// Ends at field on commerce price list mutation request.
    #[serde(rename = "endsAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ends_at: Option<String>,

    /// Market code field on commerce price list mutation request.
    #[serde(rename = "marketCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub market_code: Option<String>,

    /// Price list no field on commerce price list mutation request.
    #[serde(rename = "priceListNo")]
    pub price_list_no: String,

    /// Starts at field on commerce price list mutation request.
    #[serde(rename = "startsAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub starts_at: Option<String>,

    /// Status field on commerce price list mutation request.
    pub status: String,
}
