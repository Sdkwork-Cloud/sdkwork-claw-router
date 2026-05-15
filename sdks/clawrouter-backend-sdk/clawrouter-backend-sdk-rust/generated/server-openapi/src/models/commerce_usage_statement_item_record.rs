use serde::{Deserialize, Serialize};

/// Commerce usage statement item record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceUsageStatementItemRecord {
    /// Asset count field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub asset_count: Option<String>,

    /// Breakdown payload field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub breakdown_payload: Option<std::collections::HashMap<String, String>>,

    /// Cost amount field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cost_amount: Option<String>,

    /// Created at field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Duration seconds field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub duration_seconds: Option<String>,

    /// Id field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Item type field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub item_type: Option<String>,

    /// Metadata field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Modality field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub modality: Option<String>,

    /// Model field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Model list field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_list: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider code field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Rebuild version field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rebuild_version: Option<String>,

    /// Request count field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_count: Option<String>,

    /// Source id field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_id: Option<String>,

    /// Source type field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_type: Option<String>,

    /// Source usage fact ids field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_usage_fact_ids: Option<std::collections::HashMap<String, String>>,

    /// Source version field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_version: Option<String>,

    /// Statement id field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub statement_id: Option<String>,

    /// Status field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Token count field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub token_count: Option<String>,

    /// Updated at field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Usage text field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_text: Option<String>,

    /// Uuid field on commerce usage statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
