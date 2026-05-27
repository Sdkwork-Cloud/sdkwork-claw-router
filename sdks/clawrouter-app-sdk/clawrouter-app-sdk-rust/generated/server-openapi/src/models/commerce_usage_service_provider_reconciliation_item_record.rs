use serde::{Deserialize, Serialize};

/// Commerce usage service provider reconciliation item record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceUsageServiceProviderReconciliationItemRecord {
    /// Created at field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Difference amount field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub difference_amount: Option<String>,

    /// External amount field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub external_amount: Option<String>,

    /// Id field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Internal amount field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub internal_amount: Option<String>,

    /// Legal hold field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Match status field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub match_status: Option<String>,

    /// Metadata field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Provider invoice item id field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_invoice_item_id: Option<String>,

    /// Reason code field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reason_code: Option<String>,

    /// Request id field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Resolution status field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resolution_status: Option<String>,

    /// Retention until field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Run id field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub run_id: Option<String>,

    /// Statement item id field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub statement_item_id: Option<String>,

    /// Status field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Usage edge id field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_edge_id: Option<String>,

    /// Usage fact id field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_fact_id: Option<String>,

    /// User id field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on commerce usage service provider reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
