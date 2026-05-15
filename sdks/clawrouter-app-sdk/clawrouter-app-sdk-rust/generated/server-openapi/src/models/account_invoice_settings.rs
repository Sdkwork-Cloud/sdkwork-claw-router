use serde::{Deserialize, Serialize};

/// Account invoice settings schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AccountInvoiceSettings {
    /// Invoice type field on account invoice settings.
    #[serde(rename = "invoiceType")]
    pub invoice_type: String,

    /// Org full field on account invoice settings.
    #[serde(rename = "orgFull")]
    pub org_full: String,

    /// Safe invoice payment method display label without raw bank account number.
    #[serde(rename = "paymentMethod")]
    pub payment_method: String,

    /// Tax id field on account invoice settings.
    #[serde(rename = "taxId")]
    pub tax_id: String,
}
