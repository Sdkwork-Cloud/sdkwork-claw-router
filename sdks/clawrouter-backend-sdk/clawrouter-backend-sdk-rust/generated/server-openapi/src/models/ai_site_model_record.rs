use serde::{Deserialize, Serialize};

/// Ai site model record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiSiteModelRecord {
    /// Capabilities field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capabilities: Option<std::collections::HashMap<String, String>>,

    /// Capability field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capability: Option<String>,

    /// Catalog key field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub catalog_key: Option<String>,

    /// Consecutive error count field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub consecutive_error_count: Option<String>,

    /// Context tokens field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub context_tokens: Option<String>,

    /// Created at field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default parameters field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_parameters: Option<std::collections::HashMap<String, String>>,

    /// Deleted at field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Display name field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub display_name: Option<String>,

    /// Effective from field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Health status field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub health_status: Option<String>,

    /// Id field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last latency ms field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_latency_ms: Option<i64>,

    /// Last sync at field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_sync_at: Option<String>,

    /// Max input tokens field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_input_tokens: Option<String>,

    /// Max output tokens field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_output_tokens: Option<String>,

    /// Metadata field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Modality field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub modality: Option<String>,

    /// Model aliases field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_aliases: Option<std::collections::HashMap<String, String>>,

    /// Model code field on ai site model record.
    pub model_code: String,

    /// Model id field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_id: Option<String>,

    /// Model name field on ai site model record.
    pub model_name: String,

    /// Organization id field on ai site model record.
    pub organization_id: String,

    /// Pricing snapshot field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Provider model field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_model: Option<String>,

    /// Provider native model field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_native_model: Option<String>,

    /// Service type field on ai site model record.
    pub service_type: String,

    /// Site code field on ai site model record.
    pub site_code: String,

    /// Site id field on ai site model record.
    pub site_id: String,

    /// Site service code field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub site_service_code: Option<String>,

    /// Site service id field on ai site model record.
    pub site_service_id: String,

    /// Status field on ai site model record.
    pub status: String,

    /// Supports json schema field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_json_schema: Option<bool>,

    /// Supports streaming field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_streaming: Option<bool>,

    /// Supports tools field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_tools: Option<bool>,

    /// Tenant id field on ai site model record.
    pub tenant_id: String,

    /// Updated at field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai site model record.
    pub uuid: String,

    /// Vendor code field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_code: Option<String>,

    /// Version field on ai site model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
