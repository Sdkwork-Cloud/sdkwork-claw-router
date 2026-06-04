use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum AdapterInvocationShape {
    SyncJson,
    AsyncTaskStart,
    AsyncTaskQuery,
    AsyncTaskCancel,
    SseStream,
    ByteStream,
    FileUpload,
    WebhookCallback,
    HealthProbe,
}

impl Default for AdapterInvocationShape {
    fn default() -> Self {
        Self::SyncJson
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum AdapterEndpointRuntimeState {
    RuntimeAvailable,
    DefinitionOnly,
    Planned,
    Deprecated,
}

impl Default for AdapterEndpointRuntimeState {
    fn default() -> Self {
        Self::RuntimeAvailable
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum AdapterStreamingMode {
    None,
    SsePassthrough,
    SseNormalized,
    ChunkedBinary,
}
