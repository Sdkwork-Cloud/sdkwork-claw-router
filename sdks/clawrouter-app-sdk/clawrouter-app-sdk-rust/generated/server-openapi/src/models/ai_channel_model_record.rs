use serde::{Deserialize, Serialize};

/// Ai channel model record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiChannelModelRecord {
    /// Api code field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_code: Option<String>,

    /// Capability field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capability: Option<String>,

    /// Catalog key field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub catalog_key: Option<String>,

    /// Channel id field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_id: Option<String>,

    /// Created at field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default parameters field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_parameters: Option<std::collections::HashMap<String, String>>,

    /// Deleted at field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Effective from field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Id field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Max input tokens field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_input_tokens: Option<String>,

    /// Max output tokens field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_output_tokens: Option<String>,

    /// Metadata field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Model aliases field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_aliases: Option<std::collections::HashMap<String, String>>,

    /// Model id field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_id: Option<String>,

    /// Organization id field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider model field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_model: Option<String>,

    /// Provider native model field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_native_model: Option<String>,

    /// Status field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Supports streaming field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_streaming: Option<bool>,

    /// Supports tools field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_tools: Option<bool>,

    /// Tenant id field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Vendor code field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_code: Option<String>,

    /// Version field on ai channel model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
