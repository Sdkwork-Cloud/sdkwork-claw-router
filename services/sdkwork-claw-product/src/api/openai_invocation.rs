use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;

use axum::http::{HeaderMap, StatusCode, Uri};
use axum::response::Response;
use serde_json::Value;

use crate::api::openai_error::openai_error;
use crate::application::AuthenticatedApiKeyContext;

pub use super::openai_runtime::ResolvedOpenAiProviderRoute as OpenAiProviderRoute;

const X_REQUEST_ID: &str = "x-request-id";
const X_TRACE_ID: &str = "x-trace-id";

pub type OpenAiInvocationPluginFuture<'a> =
    Pin<Box<dyn Future<Output = Result<(), OpenAiInvocationPluginError>> + Send + 'a>>;

pub type OpenAiInvocationPluginRef = Arc<dyn OpenAiInvocationPlugin>;

#[derive(Debug, Clone, Copy, Default)]
pub struct OpenAiBillingSubjectGuardPlugin;

impl OpenAiBillingSubjectGuardPlugin {
    pub fn new() -> Self {
        Self
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum OpenAiInvocationEndpoint {
    ChatCompletions,
    Responses,
    Embeddings,
}

#[derive(Debug, Clone, PartialEq)]
pub struct OpenAiInvocationContext {
    pub endpoint: OpenAiInvocationEndpoint,
    pub api_key_context: AuthenticatedApiKeyContext,
    pub requested_model: String,
    pub stream: bool,
    pub request_body: Value,
    pub request_path: String,
    pub http_method: String,
    pub request_id: Option<String>,
    pub trace_id: Option<String>,
}

impl OpenAiInvocationContext {
    pub fn new(
        endpoint: OpenAiInvocationEndpoint,
        api_key_context: AuthenticatedApiKeyContext,
        requested_model: impl Into<String>,
        stream: bool,
        request_body: Value,
        headers: &HeaderMap,
        uri: &Uri,
    ) -> Self {
        Self {
            endpoint,
            api_key_context,
            requested_model: requested_model.into(),
            stream,
            request_body,
            request_path: uri.path().to_owned(),
            http_method: "POST".to_owned(),
            request_id: header_value(headers, X_REQUEST_ID),
            trace_id: header_value(headers, X_TRACE_ID),
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum OpenAiInvocationFaultKind {
    RelayTransport,
    RelayInvalidStatus,
    RelayHttpStatus,
    UsageRecording,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct OpenAiInvocationFault {
    pub kind: OpenAiInvocationFaultKind,
    pub status_code: Option<u16>,
    pub error_code: String,
    pub message: String,
    pub retryable: bool,
    pub latency_ms: Option<i64>,
}

impl OpenAiInvocationFault {
    pub fn relay_transport(message: impl Into<String>) -> Self {
        Self {
            kind: OpenAiInvocationFaultKind::RelayTransport,
            status_code: None,
            error_code: "provider_relay_failed".to_owned(),
            message: message.into(),
            retryable: true,
            latency_ms: None,
        }
    }

    pub fn relay_invalid_status(message: impl Into<String>) -> Self {
        Self {
            kind: OpenAiInvocationFaultKind::RelayInvalidStatus,
            status_code: None,
            error_code: "provider_relay_invalid_status".to_owned(),
            message: message.into(),
            retryable: true,
            latency_ms: None,
        }
    }

    pub fn relay_http_status(
        status_code: u16,
        retryable: bool,
        message: impl Into<String>,
    ) -> Self {
        Self {
            kind: OpenAiInvocationFaultKind::RelayHttpStatus,
            status_code: Some(status_code),
            error_code: format!("upstream_http_{status_code}"),
            message: message.into(),
            retryable,
            latency_ms: None,
        }
    }

    pub fn usage_recording(message: impl Into<String>) -> Self {
        Self {
            kind: OpenAiInvocationFaultKind::UsageRecording,
            status_code: None,
            error_code: "provider_usage_record_failed".to_owned(),
            message: message.into(),
            retryable: false,
            latency_ms: None,
        }
    }

    pub fn with_latency_ms(mut self, latency_ms: i64) -> Self {
        self.latency_ms = Some(latency_ms.max(0));
        self
    }

    pub fn is_retryable(&self) -> bool {
        self.retryable
    }

    pub fn health_http_status(&self) -> Option<i32> {
        self.status_code.map(i32::from)
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct OpenAiInvocationRelayOutcome {
    pub status_code: u16,
    pub streaming: bool,
    pub response_body: Option<Value>,
    pub content_type: Option<String>,
    pub latency_ms: Option<i64>,
}

impl OpenAiInvocationRelayOutcome {
    pub fn json(status_code: u16, response_body: Value) -> Self {
        Self {
            status_code,
            streaming: false,
            response_body: Some(response_body),
            content_type: None,
            latency_ms: None,
        }
    }

    pub fn stream(status_code: u16, content_type: Option<String>) -> Self {
        Self {
            status_code,
            streaming: true,
            response_body: None,
            content_type,
            latency_ms: None,
        }
    }

    pub fn with_latency_ms(mut self, latency_ms: i64) -> Self {
        self.latency_ms = Some(latency_ms.max(0));
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct OpenAiInvocationPluginError {
    pub status_code: StatusCode,
    pub code: &'static str,
    pub error_type: &'static str,
    pub message: String,
}

impl OpenAiInvocationPluginError {
    pub fn new(
        status_code: StatusCode,
        code: &'static str,
        error_type: &'static str,
        message: impl Into<String>,
    ) -> Self {
        Self {
            status_code,
            code,
            error_type,
            message: message.into(),
        }
    }

    pub fn into_openai_response(self) -> Response {
        openai_error(self.status_code, self.code, self.error_type, self.message)
    }
}

impl OpenAiInvocationPlugin for OpenAiBillingSubjectGuardPlugin {
    fn before_route_selection<'a>(
        &'a self,
        context: &'a OpenAiInvocationContext,
    ) -> OpenAiInvocationPluginFuture<'a> {
        Box::pin(async move {
            let subject = &context.api_key_context;
            let mut missing = Vec::new();
            if subject.api_key_id <= 0 {
                missing.push("api key");
            }
            if subject.tenant_id <= 0 {
                missing.push("tenant");
            }
            if subject.organization_id <= 0 {
                missing.push("organization");
            }
            if subject.user_id <= 0 {
                missing.push("user");
            }
            if subject.group_id <= 0 {
                missing.push("api key group");
            }
            if subject.group_code.trim().is_empty() {
                missing.push("api key group code");
            }
            if subject.pricing_plan_code.trim().is_empty() {
                missing.push("pricing plan");
            }
            if missing.is_empty() {
                return Ok(());
            }

            Err(OpenAiInvocationPluginError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "billing_subject_missing",
                "server_error",
                format!(
                    "OpenAI relay request is missing required billing subject fields: {}",
                    missing.join(", ")
                ),
            ))
        })
    }
}

pub trait OpenAiInvocationPlugin: Send + Sync {
    fn before_route_selection<'a>(
        &'a self,
        _context: &'a OpenAiInvocationContext,
    ) -> OpenAiInvocationPluginFuture<'a> {
        ok_plugin_future()
    }

    fn after_route_selection<'a>(
        &'a self,
        _context: &'a OpenAiInvocationContext,
        _route: &'a mut OpenAiProviderRoute,
    ) -> OpenAiInvocationPluginFuture<'a> {
        ok_plugin_future()
    }

    fn before_relay<'a>(
        &'a self,
        _context: &'a OpenAiInvocationContext,
        _route: &'a mut OpenAiProviderRoute,
    ) -> OpenAiInvocationPluginFuture<'a> {
        ok_plugin_future()
    }

    fn after_relay<'a>(
        &'a self,
        _context: &'a OpenAiInvocationContext,
        _route: &'a OpenAiProviderRoute,
        _outcome: &'a OpenAiInvocationRelayOutcome,
    ) -> OpenAiInvocationPluginFuture<'a> {
        ok_plugin_future()
    }

    fn on_error<'a>(
        &'a self,
        _context: &'a OpenAiInvocationContext,
        _route: Option<&'a OpenAiProviderRoute>,
        _error: &'a OpenAiInvocationPluginError,
    ) -> OpenAiInvocationPluginFuture<'a> {
        ok_plugin_future()
    }

    fn on_route_fault<'a>(
        &'a self,
        _context: &'a OpenAiInvocationContext,
        _route: &'a OpenAiProviderRoute,
        _fault: &'a OpenAiInvocationFault,
    ) -> OpenAiInvocationPluginFuture<'a> {
        ok_plugin_future()
    }

    fn on_route_success<'a>(
        &'a self,
        _context: &'a OpenAiInvocationContext,
        _route: &'a OpenAiProviderRoute,
        _outcome: &'a OpenAiInvocationRelayOutcome,
    ) -> OpenAiInvocationPluginFuture<'a> {
        ok_plugin_future()
    }
}

pub(super) fn with_builtin_invocation_plugins(
    plugins: Vec<OpenAiInvocationPluginRef>,
) -> Vec<OpenAiInvocationPluginRef> {
    let mut invocation_plugins: Vec<OpenAiInvocationPluginRef> =
        Vec::with_capacity(plugins.len().saturating_add(1));
    let builtin_billing_guard: OpenAiInvocationPluginRef =
        Arc::new(OpenAiBillingSubjectGuardPlugin::new());
    invocation_plugins.push(builtin_billing_guard);
    invocation_plugins.extend(plugins);
    invocation_plugins
}

pub(super) async fn notify_before_route_selection(
    plugins: &[OpenAiInvocationPluginRef],
    context: &OpenAiInvocationContext,
) -> Result<(), OpenAiInvocationPluginError> {
    for plugin in plugins {
        plugin.before_route_selection(context).await?;
    }
    Ok(())
}

pub(super) async fn notify_after_route_selection(
    plugins: &[OpenAiInvocationPluginRef],
    context: &OpenAiInvocationContext,
    route: &mut OpenAiProviderRoute,
) -> Result<(), OpenAiInvocationPluginError> {
    for plugin in plugins {
        plugin.after_route_selection(context, route).await?;
    }
    Ok(())
}

pub(super) async fn notify_before_relay(
    plugins: &[OpenAiInvocationPluginRef],
    context: &OpenAiInvocationContext,
    route: &mut OpenAiProviderRoute,
) -> Result<(), OpenAiInvocationPluginError> {
    for plugin in plugins {
        plugin.before_relay(context, route).await?;
    }
    Ok(())
}

pub(super) async fn notify_after_relay_observers(
    plugins: &[OpenAiInvocationPluginRef],
    context: &OpenAiInvocationContext,
    route: &OpenAiProviderRoute,
    outcome: &OpenAiInvocationRelayOutcome,
) {
    for plugin in plugins {
        if let Err(error) = plugin.after_relay(context, route, outcome).await {
            notify_error(plugins, context, Some(route), &error).await;
            tracing::warn!(
                error_code = error.code,
                error = %error.message,
                status_code = outcome.status_code,
                "openai invocation after_relay observer failed"
            );
        }
    }
}

pub(super) async fn notify_error(
    plugins: &[OpenAiInvocationPluginRef],
    context: &OpenAiInvocationContext,
    route: Option<&OpenAiProviderRoute>,
    error: &OpenAiInvocationPluginError,
) {
    for plugin in plugins {
        if let Err(hook_error) = plugin.on_error(context, route, error).await {
            tracing::warn!(
                error_code = hook_error.code,
                error = %hook_error.message,
                "openai invocation plugin error hook failed"
            );
        }
    }
}

pub(super) async fn notify_route_fault(
    plugins: &[OpenAiInvocationPluginRef],
    context: &OpenAiInvocationContext,
    route: &OpenAiProviderRoute,
    fault: &OpenAiInvocationFault,
) {
    for plugin in plugins {
        if let Err(error) = plugin.on_route_fault(context, route, fault).await {
            tracing::warn!(
                error_code = error.code,
                error = %error.message,
                provider_code = route.provider_code,
                channel_id = route.channel_id,
                "openai invocation route fault hook failed"
            );
        }
    }
}

pub(super) async fn notify_route_success(
    plugins: &[OpenAiInvocationPluginRef],
    context: &OpenAiInvocationContext,
    route: &OpenAiProviderRoute,
    outcome: &OpenAiInvocationRelayOutcome,
) {
    for plugin in plugins {
        if let Err(error) = plugin.on_route_success(context, route, outcome).await {
            tracing::warn!(
                error_code = error.code,
                error = %error.message,
                provider_code = route.provider_code,
                channel_id = route.channel_id,
                status_code = outcome.status_code,
                "openai invocation route success hook failed"
            );
        }
    }
}

fn ok_plugin_future<'a>() -> OpenAiInvocationPluginFuture<'a> {
    Box::pin(async { Ok(()) })
}

fn header_value(headers: &HeaderMap, name: &str) -> Option<String> {
    headers
        .get(name)
        .and_then(|value| value.to_str().ok())
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned)
}
