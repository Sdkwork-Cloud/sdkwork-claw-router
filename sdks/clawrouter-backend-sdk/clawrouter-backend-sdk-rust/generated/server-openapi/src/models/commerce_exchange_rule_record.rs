use serde::{Deserialize, Serialize};

/// Commerce exchange rule record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceExchangeRuleRecord {
    /// Created at field on commerce exchange rule record.
    pub created_at: String,

    /// Id field on commerce exchange rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on commerce exchange rule record.
    pub idempotency_key: String,

    /// Organization id field on commerce exchange rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Rate field on commerce exchange rule record.
    pub rate: String,

    /// Remark field on commerce exchange rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub remark: Option<String>,

    /// Request no field on commerce exchange rule record.
    pub request_no: String,

    /// Rule no field on commerce exchange rule record.
    pub rule_no: String,

    /// Source asset type field on commerce exchange rule record.
    pub source_asset_type: String,

    /// Status field on commerce exchange rule record.
    pub status: String,

    /// Target asset type field on commerce exchange rule record.
    pub target_asset_type: String,

    /// Tenant id field on commerce exchange rule record.
    pub tenant_id: String,

    /// Updated at field on commerce exchange rule record.
    pub updated_at: String,
}
