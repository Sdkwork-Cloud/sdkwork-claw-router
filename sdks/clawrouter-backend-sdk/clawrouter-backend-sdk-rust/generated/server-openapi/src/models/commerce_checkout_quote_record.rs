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

    /// Expires at field on commerce checkout quote record.
    pub expires_at: String,

    /// Organization id field on commerce checkout quote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Original amount field on commerce checkout quote record.
    pub original_amount: String,

    /// Payable amount field on commerce checkout quote record.
    pub payable_amount: String,

    /// Quote no field on commerce checkout quote record.
    pub quote_no: String,

    /// Tenant id field on commerce checkout quote record.
    pub tenant_id: String,
}
