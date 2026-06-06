#[derive(Debug, Clone, Default, PartialEq)]
pub struct InvocationTelemetry {
    pub trace_id: Option<String>,
    pub latency_ms: Option<i64>,
    pub ttft_ms: Option<i64>,
    pub provider_error_code: Option<String>,
    pub error_type: Option<String>,
    pub error_message_masked: Option<String>,
    pub normalized_response: Option<InvocationNormalizedResponse>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct InvocationNormalizedResponse {
    pub status_code: u16,
    pub body: Option<serde_json::Value>,
    pub body_bytes: Option<Vec<u8>>,
    pub content_type: Option<String>,
}
