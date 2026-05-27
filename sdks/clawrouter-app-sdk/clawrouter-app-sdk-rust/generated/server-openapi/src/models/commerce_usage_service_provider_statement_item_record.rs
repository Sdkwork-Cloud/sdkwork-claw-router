use serde::{Deserialize, Serialize};

/// Commerce usage service provider statement item record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceUsageServiceProviderStatementItemRecord {
    /// Amount field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub amount: Option<String>,

    /// Billing meter code field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_meter_code: Option<String>,

    /// Created at field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Id field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Organization id field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Quantity field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quantity: Option<String>,

    /// Rebuild version field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rebuild_version: Option<String>,

    /// Request count field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_count: Option<String>,

    /// Source id field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_id: Option<String>,

    /// Source type field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_type: Option<String>,

    /// Source usage fact ids field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_usage_fact_ids: Option<std::collections::HashMap<String, String>>,

    /// Source version field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_version: Option<String>,

    /// Statement id field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub statement_id: Option<String>,

    /// Status field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Token count field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub token_count: Option<String>,

    /// Token kind field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub token_kind: Option<String>,

    /// Updated at field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Usage edge id field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_edge_id: Option<String>,

    /// Uuid field on commerce usage service provider statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
