use serde::{Deserialize, Serialize};

/// Commerce settlement export record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceSettlementExportRecord {
    /// Approved by field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub approved_by: Option<String>,

    /// Audit log id field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub audit_log_id: Option<String>,

    /// Created at field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Created by field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_by: Option<String>,

    /// Download count field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub download_count: Option<String>,

    /// Expire at field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expire_at: Option<String>,

    /// Export no field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub export_no: Option<String>,

    /// Export type field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub export_type: Option<String>,

    /// File hash field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub file_hash: Option<String>,

    /// File manifest field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub file_manifest: Option<std::collections::HashMap<String, String>>,

    /// Id field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Legal hold field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Period end field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub period_end: Option<String>,

    /// Period start field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub period_start: Option<String>,

    /// Request id field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Statement id field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub statement_id: Option<String>,

    /// Status field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on commerce settlement export record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
