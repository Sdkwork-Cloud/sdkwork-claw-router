use serde::{Deserialize, Serialize};

/// Commerce invoice item record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceInvoiceItemRecord {
    /// Amount field on commerce invoice item record.
    pub amount: String,

    /// Created at field on commerce invoice item record.
    pub created_at: String,

    /// Invoice id field on commerce invoice item record.
    pub invoice_id: String,

    /// Order item id field on commerce invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub order_item_id: Option<String>,

    /// Tenant id field on commerce invoice item record.
    pub tenant_id: String,

    /// Title field on commerce invoice item record.
    pub title: String,
}
