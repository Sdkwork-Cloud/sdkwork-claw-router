use serde::{Deserialize, Serialize};

/// Commerce checkout quote record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceCheckoutQuoteRecord {
    /// Checkout session id field on commerce checkout quote record.
    pub checkout_session_id: String,

    /// Created at field on commerce checkout quote record.
    pub created_at: String,

    /// Currency code field on commerce checkout quote record.
    pub currency_code: String,

    /// Discount amount field on commerce checkout quote record.
    pub discount_amount: String,

    /// Expires at field on commerce checkout quote record.
    pub expires_at: String,

    /// Id field on commerce checkout quote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Organization id field on commerce checkout quote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Original amount field on commerce checkout quote record.
    pub original_amount: String,

    /// Payable amount field on commerce checkout quote record.
    pub payable_amount: String,

    /// Quote no field on commerce checkout quote record.
    pub quote_no: String,

    /// Shipping amount field on commerce checkout quote record.
    pub shipping_amount: String,

    /// Tax amount field on commerce checkout quote record.
    pub tax_amount: String,

    /// Tenant id field on commerce checkout quote record.
    pub tenant_id: String,
}
