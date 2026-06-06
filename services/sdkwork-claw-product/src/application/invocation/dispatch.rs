#[derive(Debug, Clone, PartialEq, Eq)]
pub enum DispatchMode {
    DirectOpenAiRelay,
    DirectHttpPassthrough,
    InternalProviderAdapter,
    SyntheticLocalResponse,
    NoopFree,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum InvocationShape {
    Json,
    SseStream,
    ByteStream,
    Empty,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct InvocationDispatch {
    pub mode: DispatchMode,
    pub invocation_shape: InvocationShape,
}

impl InvocationDispatch {
    pub fn pending() -> Self {
        Self {
            mode: DispatchMode::DirectHttpPassthrough,
            invocation_shape: InvocationShape::Json,
        }
    }
}
