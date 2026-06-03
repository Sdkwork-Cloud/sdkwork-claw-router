use serde::{Deserialize, Serialize};

/// Admin site model item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSiteModelItem {
    /// Capabilities field on admin site model item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capabilities: Option<Vec<String>>,

    /// Consecutive error count field on admin site model item.
    #[serde(rename = "consecutiveErrorCount")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub consecutive_error_count: Option<i64>,

    /// Context tokens field on admin site model item.
    #[serde(rename = "contextTokens")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub context_tokens: Option<i64>,

    /// Display name field on admin site model item.
    #[serde(rename = "displayName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub display_name: Option<String>,

    /// Health status field on admin site model item.
    #[serde(rename = "healthStatus")]
    pub health_status: String,

    /// Id field on admin site model item.
    pub id: String,

    /// Last latency ms field on admin site model item.
    #[serde(rename = "lastLatencyMs")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_latency_ms: Option<i64>,

    /// Last sync at field on admin site model item.
    #[serde(rename = "lastSyncAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_sync_at: Option<String>,

    /// Max input tokens field on admin site model item.
    #[serde(rename = "maxInputTokens")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_input_tokens: Option<i64>,

    /// Max output tokens field on admin site model item.
    #[serde(rename = "maxOutputTokens")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_output_tokens: Option<i64>,

    /// Modality field on admin site model item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub modality: Option<String>,

    /// Model code field on admin site model item.
    #[serde(rename = "modelCode")]
    pub model_code: String,

    /// Model name field on admin site model item.
    #[serde(rename = "modelName")]
    pub model_name: String,

    /// Provider model field on admin site model item.
    #[serde(rename = "providerModel")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_model: Option<String>,

    /// Provider native model field on admin site model item.
    #[serde(rename = "providerNativeModel")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_native_model: Option<String>,

    /// Service type field on admin site model item.
    #[serde(rename = "serviceType")]
    pub service_type: String,

    /// Site code field on admin site model item.
    #[serde(rename = "siteCode")]
    pub site_code: String,

    /// Site id field on admin site model item.
    #[serde(rename = "siteId")]
    pub site_id: String,

    /// Site service code field on admin site model item.
    #[serde(rename = "siteServiceCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub site_service_code: Option<String>,

    /// Site service id field on admin site model item.
    #[serde(rename = "siteServiceId")]
    pub site_service_id: String,

    /// Status field on admin site model item.
    pub status: String,

    /// Supports json schema field on admin site model item.
    #[serde(rename = "supportsJsonSchema")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_json_schema: Option<bool>,

    /// Supports streaming field on admin site model item.
    #[serde(rename = "supportsStreaming")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_streaming: Option<bool>,

    /// Supports tools field on admin site model item.
    #[serde(rename = "supportsTools")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_tools: Option<bool>,

    /// Vendor code field on admin site model item.
    #[serde(rename = "vendorCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_code: Option<String>,
}
