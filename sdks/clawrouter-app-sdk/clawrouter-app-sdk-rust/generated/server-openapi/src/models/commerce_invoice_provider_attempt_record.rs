use serde::{Deserialize, Serialize};

/// Commerce invoice provider attempt record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceInvoiceProviderAttemptRecord {
    /// Attempt no field on commerce invoice provider attempt record.
    pub attempt_no: String,

    /// Created at field on commerce invoice provider attempt record.
    pub created_at: String,

    /// Failed at field on commerce invoice provider attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failed_at: Option<String>,

    /// Failure code field on commerce invoice provider attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_code: Option<String>,

    /// Failure message field on commerce invoice provider attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_message: Option<String>,

    /// Id field on commerce invoice provider attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Invoice id field on commerce invoice provider attempt record.
    pub invoice_id: String,

    /// Organization id field on commerce invoice provider attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider account id field on commerce invoice provider attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_account_id: Option<String>,

    /// Provider code field on commerce invoice provider attempt record.
    pub provider_code: String,

    /// Provider invoice id field on commerce invoice provider attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_invoice_id: Option<String>,

    /// Status field on commerce invoice provider attempt record.
    pub status: String,

    /// Submitted at field on commerce invoice provider attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub submitted_at: Option<String>,

    /// Succeeded at field on commerce invoice provider attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub succeeded_at: Option<String>,

    /// Tenant id field on commerce invoice provider attempt record.
    pub tenant_id: String,

    /// Updated at field on commerce invoice provider attempt record.
    pub updated_at: String,
}
