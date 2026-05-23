use serde::{Deserialize, Serialize};

/// Commerce invoice record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceInvoiceRecord {
    /// Created at field on commerce invoice record.
    pub created_at: String,

    /// Document url field on commerce invoice record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub document_url: Option<String>,

    /// Invoice code field on commerce invoice record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub invoice_code: Option<String>,

    /// Invoice no field on commerce invoice record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub invoice_no: Option<String>,

    /// Issued at field on commerce invoice record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub issued_at: Option<String>,

    /// Order id field on commerce invoice record.
    pub order_id: String,

    /// Organization id field on commerce invoice record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner user id field on commerce invoice record.
    pub owner_user_id: String,

    /// Payment id field on commerce invoice record.
    pub payment_id: String,

    /// Status field on commerce invoice record.
    pub status: String,

    /// Tenant id field on commerce invoice record.
    pub tenant_id: String,

    /// Title id field on commerce invoice record.
    pub title_id: String,

    /// Updated at field on commerce invoice record.
    pub updated_at: String,
}
