use serde::{Deserialize, Serialize};

/// Integration provider invoice item record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IntegrationProviderInvoiceItemRecord {
    /// Amount field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub amount: Option<String>,

    /// Billing meter code field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_meter_code: Option<String>,

    /// Created at field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Id field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Import id field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub import_id: Option<String>,

    /// Legal hold field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Match status field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub match_status: Option<String>,

    /// Metadata field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Organization id field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Provider request id field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_request_id: Option<String>,

    /// Provider usage id field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_usage_id: Option<String>,

    /// Quantity field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quantity: Option<String>,

    /// Raw payload hash field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub raw_payload_hash: Option<String>,

    /// Request id field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Status field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on integration provider invoice item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
