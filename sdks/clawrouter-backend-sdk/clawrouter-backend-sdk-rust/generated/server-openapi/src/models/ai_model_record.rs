use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Ai model record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiModelRecord {
    /// Api format field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_format: Option<String>,

    /// Capabilities field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capabilities: Option<std::collections::HashMap<String, String>>,

    /// Capability field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capability: Option<String>,

    /// Capability intro field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capability_intro: Option<String>,

    /// Catalog key field on ai model record.
    pub catalog_key: String,

    /// Color token field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub color_token: Option<String>,

    /// Context tokens field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub context_tokens: Option<String>,

    /// Created at field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default pricing id field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_pricing_id: Option<String>,

    /// Deleted at field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Deprecated at field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deprecated_at: Option<String>,

    /// Description field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Display name field on ai model record.
    pub display_name: String,

    /// Docs url field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub docs_url: Option<String>,

    /// Family code field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub family_code: Option<String>,

    /// Family id field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub family_id: Option<String>,

    /// Icon field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<MediaResource>,

    /// Id field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Input modalities field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub input_modalities: Option<std::collections::HashMap<String, String>>,

    /// License type field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub license_type: Option<String>,

    /// Limitations field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub limitations: Option<std::collections::HashMap<String, String>>,

    /// Max duration seconds field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_duration_seconds: Option<i64>,

    /// Max input tokens field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_input_tokens: Option<String>,

    /// Max output tokens field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_output_tokens: Option<String>,

    /// Metadata field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Modalities field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub modalities: Option<std::collections::HashMap<String, String>>,

    /// Model field on ai model record.
    pub model: String,

    /// Model aliases field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_aliases: Option<std::collections::HashMap<String, String>>,

    /// Model family field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_family: Option<String>,

    /// Model version field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_version: Option<String>,

    /// Organization id field on ai model record.
    pub organization_id: String,

    /// Output modalities field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub output_modalities: Option<std::collections::HashMap<String, String>>,

    /// Performance profile field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub performance_profile: Option<std::collections::HashMap<String, String>>,

    /// Provider hint field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_hint: Option<String>,

    /// Rank score field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rank_score: Option<String>,

    /// Release stage field on ai model record.
    pub release_stage: String,

    /// Replacement model field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub replacement_model: Option<String>,

    /// Retired at field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retired_at: Option<String>,

    /// Routing state field on ai model record.
    pub routing_state: String,

    /// Shelf state field on ai model record.
    pub shelf_state: String,

    /// Status field on ai model record.
    pub status: String,

    /// Supported languages field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supported_languages: Option<std::collections::HashMap<String, String>>,

    /// Supports json schema field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_json_schema: Option<bool>,

    /// Supports streaming field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_streaming: Option<bool>,

    /// Supports tools field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_tools: Option<bool>,

    /// Tenant id field on ai model record.
    pub tenant_id: String,

    /// Training data cutoff field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub training_data_cutoff: Option<String>,

    /// Updated at field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Use cases field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub use_cases: Option<std::collections::HashMap<String, String>>,

    /// Uuid field on ai model record.
    pub uuid: String,

    /// Vendor code field on ai model record.
    pub vendor_code: String,

    /// Vendor id field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_id: Option<String>,

    /// Vendor name snapshot field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_name_snapshot: Option<String>,

    /// Version field on ai model record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
