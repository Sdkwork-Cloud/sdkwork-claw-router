use serde::{Deserialize, Serialize};

/// Integration provider invoice import record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IntegrationProviderInvoiceImportRecord {
    /// Created at field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Id field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Import no field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub import_no: Option<String>,

    /// Import status field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub import_status: Option<String>,

    /// Legal hold field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Period end field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub period_end: Option<String>,

    /// Period start field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub period_start: Option<String>,

    /// Provider account id field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_account_id: Option<String>,

    /// Provider code field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Request id field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Source file ref field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_file_ref: Option<String>,

    /// Source hash field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_hash: Option<String>,

    /// Status field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Total amount field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub total_amount: Option<String>,

    /// Trace id field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on integration provider invoice import record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
