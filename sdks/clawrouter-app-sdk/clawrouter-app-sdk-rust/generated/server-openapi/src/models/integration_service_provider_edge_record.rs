use serde::{Deserialize, Serialize};

/// Integration service provider edge record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IntegrationServiceProviderEdgeRecord {
    /// Buyer provider id field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub buyer_provider_id: Option<String>,

    /// Contract no field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub contract_no: Option<String>,

    /// Contract snapshot field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub contract_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Created at field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Edge no field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub edge_no: Option<String>,

    /// Edge type field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub edge_type: Option<String>,

    /// Effective from field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Id field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Seller provider id field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub seller_provider_id: Option<String>,

    /// Settlement mode field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub settlement_mode: Option<String>,

    /// Status field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on integration service provider edge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
