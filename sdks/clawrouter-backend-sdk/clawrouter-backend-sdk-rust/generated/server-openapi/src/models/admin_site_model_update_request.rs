use serde::{Deserialize, Serialize};

/// Admin site model update request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSiteModelUpdateRequest {
    /// Capabilities field on admin site model update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capabilities: Option<Vec<String>>,

    /// Context tokens field on admin site model update request.
    #[serde(rename = "contextTokens")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub context_tokens: Option<i64>,

    /// Display name field on admin site model update request.
    #[serde(rename = "displayName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub display_name: Option<String>,

    /// Max input tokens field on admin site model update request.
    #[serde(rename = "maxInputTokens")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_input_tokens: Option<i64>,

    /// Max output tokens field on admin site model update request.
    #[serde(rename = "maxOutputTokens")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_output_tokens: Option<i64>,

    /// Modality field on admin site model update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub modality: Option<String>,

    /// Model code field on admin site model update request.
    #[serde(rename = "modelCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_code: Option<String>,

    /// Model name field on admin site model update request.
    #[serde(rename = "modelName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_name: Option<String>,

    /// Provider model field on admin site model update request.
    #[serde(rename = "providerModel")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_model: Option<String>,

    /// Provider native model field on admin site model update request.
    #[serde(rename = "providerNativeModel")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_native_model: Option<String>,

    /// Status field on admin site model update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Supports json schema field on admin site model update request.
    #[serde(rename = "supportsJsonSchema")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_json_schema: Option<bool>,

    /// Supports streaming field on admin site model update request.
    #[serde(rename = "supportsStreaming")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_streaming: Option<bool>,

    /// Supports tools field on admin site model update request.
    #[serde(rename = "supportsTools")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_tools: Option<bool>,

    /// Vendor code field on admin site model update request.
    #[serde(rename = "vendorCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_code: Option<String>,
}
