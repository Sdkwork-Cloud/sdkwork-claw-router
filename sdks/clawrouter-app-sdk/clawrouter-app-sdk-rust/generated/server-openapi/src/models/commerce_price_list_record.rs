use serde::{Deserialize, Serialize};

/// Commerce price list record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePriceListRecord {
    /// Created at field on commerce price list record.
    pub created_at: String,

    /// Currency code field on commerce price list record.
    pub currency_code: String,

    /// Customer segment field on commerce price list record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub customer_segment: Option<String>,

    /// Ends at field on commerce price list record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ends_at: Option<String>,

    /// Id field on commerce price list record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Market code field on commerce price list record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub market_code: Option<String>,

    /// Organization id field on commerce price list record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Price list no field on commerce price list record.
    pub price_list_no: String,

    /// Starts at field on commerce price list record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub starts_at: Option<String>,

    /// Status field on commerce price list record.
    pub status: String,

    /// Tenant id field on commerce price list record.
    pub tenant_id: String,

    /// Updated at field on commerce price list record.
    pub updated_at: String,
}
