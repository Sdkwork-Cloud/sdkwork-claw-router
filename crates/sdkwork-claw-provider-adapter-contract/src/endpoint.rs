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
pub enum AdapterStreamingMode {
    None,
    SsePassthrough,
    SseNormalized,
    ChunkedBinary,
}
