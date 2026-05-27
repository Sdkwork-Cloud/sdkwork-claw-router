use serde::{Deserialize, Serialize};

/// Integration service provider price change request record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IntegrationServiceProviderPriceChangeRequestRecord {
    /// After hash field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub after_hash: Option<String>,

    /// Approval status field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub approval_status: Option<String>,

    /// Approved by field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub approved_by: Option<String>,

    /// Before hash field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub before_hash: Option<String>,

    /// Buyer provider id field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub buyer_provider_id: Option<String>,

    /// Change no field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub change_no: Option<String>,

    /// Change type field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub change_type: Option<String>,

    /// Created at field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Draft payload field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub draft_payload: Option<std::collections::HashMap<String, String>>,

    /// Effective from field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Id field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Published at field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Requested by field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub requested_by: Option<String>,

    /// Seller provider id field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub seller_provider_id: Option<String>,

    /// Status field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on integration service provider price change request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
