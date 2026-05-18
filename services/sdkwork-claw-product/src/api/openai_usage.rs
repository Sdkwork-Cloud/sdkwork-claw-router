use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::http::StatusCode;
use serde_json::Value;

use crate::api::openai_invocation::{
    OpenAiInvocationContext, OpenAiInvocationEndpoint, OpenAiInvocationFault,
    OpenAiInvocationPluginError, OpenAiInvocationRelayOutcome,
};
use crate::api::openai_runtime::ResolvedOpenAiProviderRoute;
use crate::application::{
    AuthenticatedApiKeyContext, PricingResolver, ResolveModelPriceQuery, ResolvedModelPrice,
};
use crate::domain::{BillingMeter, DecimalValue, DomainError, DomainResult};
use crate::ports::{GatewayUsageRecordCommand, GatewayUsageRecorder, PricingCatalog};

const MODALITY_TEXT: i64 = 1;
const MODALITY_EMBEDDING: i64 = 6;
const USAGE_TYPE_INPUT: i64 = 1;

#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) struct OpenAiUsageBillingProfile {
    input_meter: BillingMeter,
    output_meter: Option<BillingMeter>,
    modality: i64,
    usage_type: i64,
}

impl OpenAiUsageBillingProfile {
    fn chat() -> Self {
        Self {
            input_meter: BillingMeter::LlmInputToken,
            output_meter: Some(BillingMeter::LlmOutputToken),
            modality: MODALITY_TEXT,
            usage_type: USAGE_TYPE_INPUT,
        }
    }

    fn responses() -> Self {
        Self::chat()
    }

    fn embeddings() -> Self {
        Self {
            input_meter: BillingMeter::EmbeddingInputToken,
            output_meter: None,
            modality: MODALITY_EMBEDDING,
            usage_type: USAGE_TYPE_INPUT,
        }
    }

    fn for_endpoint(endpoint: OpenAiInvocationEndpoint) -> Self {
        match endpoint {
            OpenAiInvocationEndpoint::ChatCompletions => Self::chat(),
            OpenAiInvocationEndpoint::Responses => Self::responses(),
            OpenAiInvocationEndpoint::Embeddings => Self::embeddings(),
        }
    }
}

pub(crate) struct OpenAiUsageRecorder<C> {
    catalog: Arc<C>,
    usage_recorder: Arc<dyn GatewayUsageRecorder + Send + Sync>,
}

impl<C> OpenAiUsageRecorder<C> {
    pub(crate) fn new(
        catalog: Arc<C>,
        usage_recorder: Arc<dyn GatewayUsageRecorder + Send + Sync>,
    ) -> Self {
        Self {
            catalog,
            usage_recorder,
        }
    }
}

impl<C> OpenAiUsageRecorder<C>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    pub(crate) async fn record_after_relay(
        &self,
        context: &OpenAiInvocationContext,
        route: &ResolvedOpenAiProviderRoute,
        outcome: &OpenAiInvocationRelayOutcome,
    ) -> Result<(), OpenAiInvocationPluginError> {
        if context.stream || !(200..=299).contains(&outcome.status_code) {
            return Ok(());
        }
        let body = outcome.response_body.as_ref().ok_or_else(|| {
            OpenAiInvocationPluginError::new(
                StatusCode::BAD_GATEWAY,
                "provider_usage_record_failed",
                "server_error",
                format!(
                    "provider {} response body is missing for usage recording",
                    endpoint_label(context.endpoint)
                ),
            )
        })?;
        let usage =
            usage_from_response(context.endpoint, body).map_err(provider_usage_record_error)?;
        let command = build_usage_record_command(
            self.catalog.as_ref(),
            context,
            route,
            outcome.status_code,
            false,
            usage,
            OpenAiUsageBillingProfile::for_endpoint(context.endpoint),
        )
        .map_err(provider_usage_record_error)?;
        self.usage_recorder
            .record_gateway_usage(command)
            .await
            .map_err(provider_usage_record_error)?;
        Ok(())
    }

    pub(crate) async fn record_after_success(
        &self,
        context: &OpenAiInvocationContext,
        route: &ResolvedOpenAiProviderRoute,
        outcome: &OpenAiInvocationRelayOutcome,
    ) -> Result<(), OpenAiInvocationFault> {
        self.record_after_relay(context, route, outcome)
            .await
            .map_err(|error| OpenAiInvocationFault::usage_recording(error.message))
    }
}

#[derive(Debug, Clone)]
pub(crate) struct GatewayUsageRecordCommandBuilder {
    request_id: String,
    trace_id: Option<String>,
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
    api_key_id: i64,
    api_key_name_snapshot: String,
    api_key_group_id: i64,
    api_key_group_snapshot: String,
    catalog_key: String,
    requested_model: String,
    provider_code: String,
    channel_id: i64,
    provider_model: String,
    request_path: String,
    http_method: String,
    http_status: u16,
    streaming: bool,
    modality: i64,
    usage_type: i64,
    billing_meter_code: String,
    base_input_unit_price: String,
    base_output_unit_price: String,
    input_unit_price: DecimalValue,
    output_unit_price: DecimalValue,
    upstream_input_unit_price: DecimalValue,
    upstream_output_unit_price: DecimalValue,
    currency: String,
    pricing_plan_code: String,
}

impl GatewayUsageRecordCommandBuilder {
    pub(crate) fn build(self, usage: OpenAiTokenUsage) -> DomainResult<GatewayUsageRecordCommand> {
        let input_amount = self.input_unit_price.multiply_i64(usage.prompt_tokens)?;
        let output_amount = self
            .output_unit_price
            .multiply_i64(usage.completion_tokens)?;
        let upstream_input_amount = self
            .upstream_input_unit_price
            .multiply_i64(usage.prompt_tokens)?;
        let upstream_output_amount = self
            .upstream_output_unit_price
            .multiply_i64(usage.completion_tokens)?;
        Ok(GatewayUsageRecordCommand {
            request_id: self.request_id,
            trace_id: self.trace_id,
            tenant_id: self.tenant_id,
            organization_id: self.organization_id,
            user_id: self.user_id,
            api_key_id: self.api_key_id,
            api_key_name_snapshot: self.api_key_name_snapshot,
            api_key_group_id: self.api_key_group_id,
            api_key_group_snapshot: self.api_key_group_snapshot,
            catalog_key: self.catalog_key,
            requested_model: self.requested_model,
            provider_code: self.provider_code,
            channel_id: self.channel_id,
            provider_model: self.provider_model,
            request_path: self.request_path,
            http_method: self.http_method,
            http_status: self.http_status,
            streaming: self.streaming,
            modality: self.modality,
            usage_type: self.usage_type,
            billing_meter_code: self.billing_meter_code,
            prompt_tokens: usage.prompt_tokens,
            completion_tokens: usage.completion_tokens,
            cached_tokens: usage.cached_tokens,
            total_tokens: usage.total_tokens,
            base_input_unit_price: self.base_input_unit_price,
            base_output_unit_price: self.base_output_unit_price,
            customer_charge_amount: (input_amount + output_amount).to_fixed_string(6),
            upstream_cost_amount: (upstream_input_amount + upstream_output_amount)
                .to_fixed_string(6),
            currency: self.currency,
            pricing_plan_code: self.pricing_plan_code,
        })
    }
}

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
pub(crate) struct OpenAiTokenUsage {
    pub(crate) prompt_tokens: i64,
    pub(crate) completion_tokens: i64,
    pub(crate) cached_tokens: i64,
    pub(crate) total_tokens: i64,
}

pub(crate) fn usage_from_response(
    endpoint: OpenAiInvocationEndpoint,
    body: &Value,
) -> DomainResult<OpenAiTokenUsage> {
    match endpoint {
        OpenAiInvocationEndpoint::ChatCompletions => chat_usage_from_response(body),
        OpenAiInvocationEndpoint::Responses => responses_usage_from_response(body),
        OpenAiInvocationEndpoint::Embeddings => embeddings_usage_from_response(body),
    }
}

pub(crate) fn chat_usage_from_response(body: &Value) -> DomainResult<OpenAiTokenUsage> {
    let usage = body
        .get("usage")
        .ok_or_else(|| DomainError::new("provider chat completion response is missing usage"))?;
    usage_from_fields(
        usage,
        "prompt_tokens",
        "completion_tokens",
        "prompt_tokens_details",
    )
}

pub(crate) fn chat_usage_from_stream_event(body: &Value) -> DomainResult<Option<OpenAiTokenUsage>> {
    let Some(usage) = body.get("usage") else {
        return Ok(None);
    };
    if usage.is_null() {
        return Ok(None);
    }
    usage_from_fields(
        usage,
        "prompt_tokens",
        "completion_tokens",
        "prompt_tokens_details",
    )
    .map(Some)
}

fn responses_usage_from_response(body: &Value) -> DomainResult<OpenAiTokenUsage> {
    let usage = body
        .get("usage")
        .ok_or_else(|| DomainError::new("provider response is missing usage"))?;
    usage_from_fields(
        usage,
        "input_tokens",
        "output_tokens",
        "input_tokens_details",
    )
}

fn embeddings_usage_from_response(body: &Value) -> DomainResult<OpenAiTokenUsage> {
    let usage = body
        .get("usage")
        .ok_or_else(|| DomainError::new("provider embedding response is missing usage"))?;
    let prompt_tokens = required_integer_field(usage, "prompt_tokens")?;
    let total_tokens = required_integer_field(usage, "total_tokens")?;
    Ok(OpenAiTokenUsage {
        prompt_tokens,
        completion_tokens: 0,
        cached_tokens: 0,
        total_tokens,
    })
}

fn usage_from_fields(
    usage: &Value,
    input_field: &str,
    output_field: &str,
    input_details_field: &str,
) -> DomainResult<OpenAiTokenUsage> {
    let prompt_tokens = required_integer_field(usage, input_field)?;
    let completion_tokens = required_integer_field(usage, output_field)?;
    let cached_tokens = usage
        .get(input_details_field)
        .map(|details| optional_integer_field(details, "cached_tokens"))
        .transpose()?
        .unwrap_or(0);
    let total_tokens = required_integer_field(usage, "total_tokens")?;
    Ok(OpenAiTokenUsage {
        prompt_tokens,
        completion_tokens,
        cached_tokens,
        total_tokens,
    })
}

fn required_integer_field(value: &Value, field: &str) -> DomainResult<i64> {
    let integer = value
        .get(field)
        .and_then(Value::as_i64)
        .ok_or_else(|| DomainError::new(format!("provider usage.{field} is required")))?;
    non_negative_integer(field, integer)
}

fn optional_integer_field(value: &Value, field: &str) -> DomainResult<i64> {
    let Some(integer) = value.get(field).and_then(Value::as_i64) else {
        return Ok(0);
    };
    non_negative_integer(field, integer)
}

fn non_negative_integer(field: &str, integer: i64) -> DomainResult<i64> {
    if integer < 0 {
        return Err(DomainError::new(format!(
            "provider usage.{field} must be non-negative"
        )));
    }
    Ok(integer)
}

pub(crate) fn build_usage_record_command<C>(
    catalog: &C,
    invocation_context: &OpenAiInvocationContext,
    route: &ResolvedOpenAiProviderRoute,
    http_status: u16,
    streaming: bool,
    usage: OpenAiTokenUsage,
    billing_profile: OpenAiUsageBillingProfile,
) -> DomainResult<GatewayUsageRecordCommand>
where
    C: PricingCatalog + Send + Sync,
{
    build_usage_record_command_builder(
        catalog,
        invocation_context,
        &invocation_context.api_key_context,
        route,
        http_status,
        streaming,
        billing_profile,
    )?
    .build(usage)
}

pub(crate) fn build_usage_record_command_builder<C>(
    catalog: &C,
    invocation_context: &OpenAiInvocationContext,
    context: &AuthenticatedApiKeyContext,
    route: &ResolvedOpenAiProviderRoute,
    http_status: u16,
    streaming: bool,
    billing_profile: OpenAiUsageBillingProfile,
) -> DomainResult<GatewayUsageRecordCommandBuilder>
where
    C: PricingCatalog + Send + Sync,
{
    let input_price = PricingResolver::new(catalog).resolve(ResolveModelPriceQuery {
        api_key_id: context.api_key_id,
        model: route.catalog_key.clone(),
        billing_meter: billing_profile.input_meter.clone(),
        provider_code: Some(route.provider_code.clone()),
        channel_id: Some(route.channel_id),
    })?;
    let output_price = match billing_profile.output_meter.clone() {
        Some(output_meter) => Some(PricingResolver::new(catalog).resolve(
            ResolveModelPriceQuery {
                api_key_id: context.api_key_id,
                model: route.catalog_key.clone(),
                billing_meter: output_meter,
                provider_code: Some(route.provider_code.clone()),
                channel_id: Some(route.channel_id),
            },
        )?),
        None => None,
    };
    let upstream_input_unit_price = upstream_unit_price(&input_price);
    let upstream_output_unit_price = output_price
        .as_ref()
        .map(upstream_unit_price)
        .unwrap_or(DecimalValue::ZERO);
    let output_customer_charge = output_price
        .as_ref()
        .map(|price| price.customer_charge.clone())
        .unwrap_or_else(|| zero_money_like(&input_price));

    Ok(GatewayUsageRecordCommandBuilder {
        request_id: invocation_context
            .request_id
            .clone()
            .unwrap_or_else(|| generated_request_id(context.api_key_id)),
        trace_id: invocation_context.trace_id.clone(),
        tenant_id: context.tenant_id,
        organization_id: context.organization_id,
        user_id: context.user_id,
        api_key_id: context.api_key_id,
        api_key_name_snapshot: context.api_key_name_snapshot.clone(),
        api_key_group_id: context.group_id,
        api_key_group_snapshot: context.group_code.clone(),
        catalog_key: route.catalog_key.clone(),
        requested_model: invocation_context.requested_model.clone(),
        provider_code: route.provider_code.clone(),
        channel_id: route.channel_id,
        provider_model: route.provider_model.clone(),
        request_path: invocation_context.request_path.clone(),
        http_method: invocation_context.http_method.clone(),
        http_status,
        streaming,
        modality: billing_profile.modality,
        usage_type: billing_profile.usage_type,
        billing_meter_code: billing_profile.input_meter.code().to_owned(),
        base_input_unit_price: input_price.customer_charge.to_fixed_string(6),
        base_output_unit_price: output_customer_charge.to_fixed_string(6),
        input_unit_price: input_price.customer_charge.unit_price,
        output_unit_price: output_customer_charge.unit_price,
        upstream_input_unit_price,
        upstream_output_unit_price,
        currency: input_price.customer_charge.currency,
        pricing_plan_code: context.pricing_plan_code.clone(),
    })
}

pub(crate) fn chat_usage_billing_profile() -> OpenAiUsageBillingProfile {
    OpenAiUsageBillingProfile::chat()
}

pub(crate) fn provider_usage_record_error(error: DomainError) -> OpenAiInvocationPluginError {
    OpenAiInvocationPluginError::new(
        StatusCode::BAD_GATEWAY,
        "provider_usage_record_failed",
        "server_error",
        error.to_string(),
    )
}

fn upstream_unit_price(price: &ResolvedModelPrice) -> DecimalValue {
    price
        .upstream_cost
        .as_ref()
        .map(|price| price.unit_price.unit_price)
        .unwrap_or(DecimalValue::ZERO)
}

fn zero_money_like(price: &ResolvedModelPrice) -> crate::domain::Money {
    crate::domain::Money {
        currency: price.customer_charge.currency.clone(),
        unit_price: DecimalValue::ZERO,
    }
}

fn generated_request_id(api_key_id: i64) -> String {
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_nanos())
        .unwrap_or_default();
    format!("openai-usage-{api_key_id}-{nanos}")
}

fn endpoint_label(endpoint: OpenAiInvocationEndpoint) -> &'static str {
    match endpoint {
        OpenAiInvocationEndpoint::ChatCompletions => "chat completion",
        OpenAiInvocationEndpoint::Responses => "response",
        OpenAiInvocationEndpoint::Embeddings => "embedding",
    }
}
