use sdkwork_claw_provider_adapter_contract::{
    AdapterInvocationMetadata, AdapterInvocationRequest, AdapterInvocationShape,
    AdapterProviderContext, AdapterSecret, AdapterSubject,
};
use sdkwork_claw_provider_adapter_http::ProviderAdapterHttpError;
use serde_json::{json, Value};

use crate::domain::{DomainError, ProviderAuthProfile, ProviderAuthType};

#[derive(Debug, Clone, Copy)]
pub(crate) struct OpenAiAdapterEndpoint {
    pub method: &'static str,
    pub standard_path: &'static str,
    pub capability: &'static str,
    pub endpoint_key: &'static str,
    pub invocation_id_prefix: &'static str,
}

pub(crate) struct OpenAiAdapterInvocationParts {
    pub api_key_id: i64,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
    pub group_id: i64,
    pub group_code: String,
    pub pricing_plan_code: String,
    pub provider_code: String,
    pub provider_channel_id: i64,
    pub provider_model: String,
    pub provider_base_url: Option<String>,
    pub provider_secret_ref: Option<String>,
    pub provider_auth_profile: ProviderAuthProfile,
    pub provider_timeout_ms: Option<u64>,
    pub request_body: Value,
}

pub(crate) fn build_openai_adapter_invocation(
    endpoint: OpenAiAdapterEndpoint,
    parts: OpenAiAdapterInvocationParts,
) -> AdapterInvocationRequest {
    AdapterInvocationRequest {
        invocation: AdapterInvocationMetadata {
            id: format!(
                "{}-{}-{}-{}",
                endpoint.invocation_id_prefix,
                parts.api_key_id,
                parts.provider_code,
                parts.provider_channel_id
            ),
            endpoint_key: endpoint.endpoint_key.to_owned(),
            method: endpoint.method.to_owned(),
            standard_path: endpoint.standard_path.to_owned(),
            shape: AdapterInvocationShape::SyncJson,
            stream: false,
            request_id: None,
            trace_id: None,
        },
        subject: AdapterSubject {
            tenant_id: parts.tenant_id,
            organization_id: parts.organization_id,
            user_id: parts.user_id,
            api_key_id: parts.api_key_id,
            group_id: parts.group_id,
            group_code: parts.group_code,
            pricing_plan_code: parts.pricing_plan_code,
        },
        provider: AdapterProviderContext {
            provider_code: parts.provider_code,
            channel_id: parts.provider_channel_id,
            provider_model: parts.provider_model,
            base_url: parts.provider_base_url,
            auth_profile: provider_auth_profile_json(&parts.provider_auth_profile),
            timeout_ms: parts.provider_timeout_ms,
        },
        secret: adapter_secret(parts.provider_secret_ref),
        body: parts.request_body,
    }
}

pub(crate) fn adapter_http_error(error: ProviderAdapterHttpError) -> DomainError {
    let status = error
        .status_code
        .map(|status_code| format!(" HTTP {status_code}"))
        .unwrap_or_default();
    DomainError::new(format!(
        "provider adapter invocation failed{status}: {}",
        error.message
    ))
}

fn adapter_secret(secret_ref: Option<String>) -> AdapterSecret {
    secret_ref
        .filter(|secret_ref| !secret_ref.trim().is_empty())
        .map(|secret_ref| AdapterSecret::AdapterResolved { secret_ref })
        .unwrap_or(AdapterSecret::None)
}

fn provider_auth_profile_json(profile: &ProviderAuthProfile) -> Value {
    let auth_type = match profile.auth_type {
        ProviderAuthType::Bearer => "bearer",
        ProviderAuthType::Header => "header",
        ProviderAuthType::Query => "query",
    };
    let default_headers = profile
        .default_headers
        .iter()
        .map(|header| {
            json!({
                "name": header.name,
                "value": header.value,
            })
        })
        .collect::<Vec<_>>();

    json!({
        "type": auth_type,
        "name": profile.name,
        "defaultHeaders": default_headers,
    })
}
