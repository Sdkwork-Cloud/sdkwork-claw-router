use serde::{Deserialize, Serialize};

/// Storage usage ledger record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct StorageUsageLedgerRecord {
    /// App id field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_id: Option<String>,

    /// Business domain field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub business_domain: Option<String>,

    /// Created at field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Delta file count field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub delta_file_count: Option<String>,

    /// Delta logical bytes field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub delta_logical_bytes: Option<String>,

    /// Delta physical bytes field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub delta_physical_bytes: Option<String>,

    /// Delta reserved bytes field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub delta_reserved_bytes: Option<String>,

    /// Id field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub idempotency_key: Option<String>,

    /// Legal hold field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Occurred at field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub occurred_at: Option<String>,

    /// Organization id field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Reason field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reason: Option<String>,

    /// Request id field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Scope id field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scope_id: Option<String>,

    /// Scope type field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scope_type: Option<String>,

    /// Space id field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub space_id: Option<String>,

    /// Status field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Usage event type field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_event_type: Option<String>,

    /// User id field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on storage usage ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
