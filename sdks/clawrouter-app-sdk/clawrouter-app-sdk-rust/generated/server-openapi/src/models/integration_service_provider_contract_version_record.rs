use serde::{Deserialize, Serialize};

/// Integration service provider contract version record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IntegrationServiceProviderContractVersionRecord {
    /// Approval status field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub approval_status: Option<String>,

    /// Approved at field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub approved_at: Option<String>,

    /// Approved by field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub approved_by: Option<String>,

    /// Contract id field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub contract_id: Option<String>,

    /// Contract payload field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub contract_payload: Option<std::collections::HashMap<String, String>>,

    /// Created at field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Published at field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Requested by field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub requested_by: Option<String>,

    /// Status field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Version hash field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version_hash: Option<String>,

    /// Version no field on integration service provider contract version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version_no: Option<i64>,
}
