use serde::{Deserialize, Serialize};

/// Commerce usage service provider reconciliation run record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceUsageServiceProviderReconciliationRunRecord {
    /// Created at field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Difference amount field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub difference_amount: Option<String>,

    /// Id field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Legal hold field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Matched count field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub matched_count: Option<String>,

    /// Metadata field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Mismatch count field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mismatch_count: Option<String>,

    /// Missing external count field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub missing_external_count: Option<String>,

    /// Missing internal count field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub missing_internal_count: Option<String>,

    /// Organization id field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Period end field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub period_end: Option<String>,

    /// Period start field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub period_start: Option<String>,

    /// Request id field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Run no field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub run_no: Option<String>,

    /// Scope id field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scope_id: Option<String>,

    /// Scope type field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scope_type: Option<String>,

    /// Status field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Total external amount field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub total_external_amount: Option<String>,

    /// Total internal amount field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub total_internal_amount: Option<String>,

    /// Trace id field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on commerce usage service provider reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
