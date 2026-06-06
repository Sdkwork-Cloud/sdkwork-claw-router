#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct InvocationTelemetry {
    pub trace_id: Option<String>,
}
