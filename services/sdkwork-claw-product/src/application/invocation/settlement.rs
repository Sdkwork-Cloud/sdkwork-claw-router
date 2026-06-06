use serde_json::{json, Value};

use super::{
    BillingMode, Invocation, InvocationError, InvocationErrorKind, InvocationFuture,
    InvocationInterceptor, InvocationPricingQuote, InvocationUsageLine, InvocationUsageLineRole,
};
use crate::domain::{BillingMeter, DecimalValue, DomainResult};
use crate::ports::{GatewayUsageQuantity, GatewayUsageRecordCommand};

const TOKEN_BILLING_UNIT_SIZE: i64 = 1_000_000;
const USAGE_AMOUNT_DECIMAL_DIGITS: u32 = 12;

#[derive(Debug, Clone, Default)]
pub struct PricingSettlementInterceptor;

impl InvocationInterceptor for PricingSettlementInterceptor {
    fn name(&self) -> &str {
        "pricing_settlement"
    }

    fn after<'a>(&'a self, invocation: &'a mut Invocation) -> InvocationFuture<'a, ()> {
        Box::pin(async move {
            if !invocation.billing.settlement_required
                || invocation.billing.mode == BillingMode::Free
                || invocation.usage.lines.is_empty()
            {
                return Ok(());
            }

            invocation.usage.settlement_commands.clear();
            let mut commands = Vec::new();
            for line in invocation.usage.lines.clone() {
                let quote = line
                    .pricing_quote
                    .clone()
                    .or_else(|| invocation.usage.quote_for_meter(&line.meter).cloned())
                    .ok_or_else(|| {
                        settlement_error(format!(
                            "settlement requires pricing quote for meter {}",
                            line.meter.code()
                        ))
                    })?;
                commands.push(command_for_line(invocation, &line, &quote)?);
            }
            invocation.usage.settlement_commands = commands;
            Ok(())
        })
    }
}

fn command_for_line(
    invocation: &Invocation,
    line: &InvocationUsageLine,
    quote: &InvocationPricingQuote,
) -> Result<GatewayUsageRecordCommand, InvocationError> {
    let account = invocation
        .account
        .as_ref()
        .ok_or_else(|| settlement_error("settlement requires resolved invocation account"))?;
    let quantity = line.quantity.clone();
    let customer_charge_amount = amount_for_line(
        &line.meter,
        &quote.customer_charge_unit_price.unit_price,
        &quantity,
    )
    .map_err(|error| settlement_error(error.to_string()))?;
    let official_reference_amount = amount_for_line(
        &line.meter,
        &quote.official_reference_unit_price.unit_price,
        &quantity,
    )
    .map_err(|error| settlement_error(error.to_string()))?;
    let upstream_cost_amount = match quote.upstream_cost_unit_price.as_ref() {
        Some(price) => amount_for_line(&line.meter, &price.unit_price, &quantity)
            .map_err(|error| settlement_error(error.to_string()))?,
        None => DecimalValue::ZERO,
    };
    let (base_input_unit_price, base_output_unit_price, cache_read_unit_price) =
        unit_price_columns(line, quote);
    let (prompt_tokens, completion_tokens, cached_tokens, total_tokens) =
        token_columns(line, &quantity);

    Ok(GatewayUsageRecordCommand {
        request_id: invocation.request.request_id.clone(),
        trace_id: invocation.request.trace_id.clone(),
        tenant_id: invocation.subject.tenant_id,
        organization_id: invocation.subject.organization_id,
        user_id: invocation.subject.user_id,
        api_key_id: invocation.subject.api_key_id.unwrap_or_default(),
        api_key_name_snapshot: invocation
            .subject
            .api_key_name_snapshot
            .clone()
            .unwrap_or_default(),
        channel_group_id: invocation.subject.channel_group_id.unwrap_or_default(),
        channel_group_snapshot: invocation
            .subject
            .channel_group_code
            .clone()
            .unwrap_or_else(|| quote.group_code.clone()),
        catalog_key: quote.catalog_key.clone(),
        requested_model: quote.requested_model.clone(),
        requested_model_catalog_key: invocation
            .resource
            .requested_model_catalog_key
            .clone()
            .unwrap_or_else(|| quote.catalog_key.clone()),
        provider_code: account.provider_code.clone(),
        channel_id: account.channel_id,
        provider_model: account.provider_model.clone().unwrap_or_default(),
        provider_native_model: invocation
            .resource
            .provider_native_model
            .clone()
            .or_else(|| account.provider_model.clone())
            .unwrap_or_default(),
        region_code: account.region_code.clone(),
        request_path: invocation.request.path.clone(),
        http_method: invocation.request.method.as_str().to_owned(),
        user_agent: invocation.request.user_agent.clone(),
        http_status: effective_invocation_dispatch_status_code(invocation)
            .or_else(|| {
                invocation
                    .telemetry
                    .normalized_response
                    .as_ref()
                    .map(|response| response.status_code)
            })
            .unwrap_or(200),
        streaming: matches!(
            invocation.dispatch.invocation_shape,
            super::InvocationShape::SseStream
        ),
        modality: modality_for_meter(&line.meter),
        usage_type: usage_type_for_line(line),
        billing_meter_code: line.meter.code().to_owned(),
        billable_quantity: quantity.billable_quantity.clone(),
        prompt_tokens,
        completion_tokens,
        cached_tokens,
        total_tokens,
        request_count: quantity.request_count,
        result_count: quantity.result_count,
        item_count: quantity.item_count,
        character_count: quantity.character_count,
        image_count: quantity.image_count,
        audio_seconds: quantity.audio_seconds.clone(),
        video_seconds: quantity.video_seconds.clone(),
        latency_ms: invocation.telemetry.latency_ms,
        ttft_ms: invocation.telemetry.ttft_ms,
        provider_error_code: invocation.telemetry.provider_error_code.clone(),
        error_type: invocation.telemetry.error_type.clone(),
        error_message_masked: invocation.telemetry.error_message_masked.clone(),
        base_input_unit_price,
        base_output_unit_price,
        cache_read_unit_price,
        rate_multiplier: quote.rate_multiplier.clone(),
        reference_multiplier: quote.reference_multiplier.clone(),
        official_reference_amount: official_reference_amount
            .to_fixed_string(USAGE_AMOUNT_DECIMAL_DIGITS),
        customer_charge_amount: customer_charge_amount.to_fixed_string(USAGE_AMOUNT_DECIMAL_DIGITS),
        upstream_cost_amount: upstream_cost_amount.to_fixed_string(USAGE_AMOUNT_DECIMAL_DIGITS),
        currency: quote.customer_charge_unit_price.currency.clone(),
        pricing_plan_code: quote.pricing_plan_code.clone(),
        pricing_snapshot: pricing_snapshot(invocation, line, quote),
    })
}

fn amount_for_line(
    meter: &BillingMeter,
    unit_price: &DecimalValue,
    quantity: &GatewayUsageQuantity,
) -> DomainResult<DecimalValue> {
    if is_token_meter(meter) {
        unit_price
            .multiply_i64(integer_quantity(quantity)?)?
            .divide_i64(TOKEN_BILLING_UNIT_SIZE)
    } else {
        let quantity = DecimalValue::parse(&quantity.billable_quantity)?;
        unit_price.checked_multiply(quantity)
    }
}

fn integer_quantity(quantity: &GatewayUsageQuantity) -> DomainResult<i64> {
    quantity
        .billable_quantity
        .parse::<i64>()
        .map_err(|_| crate::domain::DomainError::new("settlement quantity must be an integer"))
}

fn unit_price_columns(
    line: &InvocationUsageLine,
    quote: &InvocationPricingQuote,
) -> (String, String, String) {
    let unit_price = quote.customer_charge_before_rate.to_fixed_string(6);
    match line.role {
        InvocationUsageLineRole::Output => {
            ("0.000000".to_owned(), unit_price, "0.000000".to_owned())
        }
        InvocationUsageLineRole::CacheRead => {
            ("0.000000".to_owned(), "0.000000".to_owned(), unit_price)
        }
        _ => (unit_price, "0.000000".to_owned(), "0.000000".to_owned()),
    }
}

fn token_columns(
    line: &InvocationUsageLine,
    quantity: &GatewayUsageQuantity,
) -> (i64, i64, i64, i64) {
    if !is_token_meter(&line.meter) {
        return (0, 0, 0, 0);
    }
    let tokens = quantity
        .billable_quantity
        .parse::<i64>()
        .unwrap_or_default();
    match line.role {
        InvocationUsageLineRole::Output => (0, tokens, 0, tokens),
        InvocationUsageLineRole::CacheRead => (0, 0, tokens, tokens),
        _ => (tokens, 0, 0, tokens),
    }
}

fn is_token_meter(meter: &BillingMeter) -> bool {
    matches!(
        meter,
        BillingMeter::LlmInputToken
            | BillingMeter::LlmOutputToken
            | BillingMeter::LlmReasoningToken
            | BillingMeter::LlmCacheWriteToken
            | BillingMeter::LlmCacheReadToken
            | BillingMeter::EmbeddingInputToken
            | BillingMeter::EmbeddingImage
            | BillingMeter::ImageInputToken
            | BillingMeter::ImageOutputToken
            | BillingMeter::AudioInputToken
            | BillingMeter::AudioOutputToken
            | BillingMeter::VideoInputToken
            | BillingMeter::VideoOutputToken
    )
}

fn modality_for_meter(meter: &BillingMeter) -> i64 {
    match meter {
        BillingMeter::EmbeddingInputToken | BillingMeter::EmbeddingImage => 6,
        BillingMeter::ImageInputToken
        | BillingMeter::ImageOutputToken
        | BillingMeter::ImageResult
        | BillingMeter::ImagePixel
        | BillingMeter::ImageMegapixel => 2,
        BillingMeter::AudioInputToken
        | BillingMeter::AudioOutputToken
        | BillingMeter::AudioInputSecond
        | BillingMeter::AudioOutputSecond
        | BillingMeter::AudioInputMinute
        | BillingMeter::AudioOutputMinute
        | BillingMeter::TtsInputCharacter
        | BillingMeter::SpeechCharacter
        | BillingMeter::SttAudioMinute
        | BillingMeter::MusicOutputSecond
        | BillingMeter::SfxResult => 3,
        BillingMeter::VideoInputToken
        | BillingMeter::VideoOutputToken
        | BillingMeter::VideoInputSecond
        | BillingMeter::VideoOutputSecond
        | BillingMeter::VideoResult => 4,
        BillingMeter::ApiRequest | BillingMeter::ApiResult | BillingMeter::ApiItem => 7,
        _ => 1,
    }
}

fn usage_type_for_line(line: &InvocationUsageLine) -> i64 {
    match line.role {
        InvocationUsageLineRole::Output | InvocationUsageLineRole::Result => 2,
        InvocationUsageLineRole::CacheRead => 3,
        InvocationUsageLineRole::CacheWrite => 4,
        InvocationUsageLineRole::Adapter => 5,
        InvocationUsageLineRole::Request | InvocationUsageLineRole::Input => 1,
    }
}

fn pricing_snapshot(
    invocation: &Invocation,
    line: &InvocationUsageLine,
    quote: &InvocationPricingQuote,
) -> String {
    json!({
        "invocation": {
            "id": invocation.id.0.as_str(),
            "path": invocation.request.path.as_str(),
            "routeKey": invocation.resource.route_key.as_str(),
            "apiCode": invocation.resource.api_code.as_str()
        },
        "resource": {
            "catalogKey": quote.catalog_key.as_str(),
            "requestedModel": quote.requested_model.as_str(),
            "providerNativeModel": invocation.resource.provider_native_model.as_deref()
        },
        "provider": {
            "code": quote.provider_code.as_deref(),
            "channelId": quote.channel_id,
            "regionCode": quote.region_code.as_str()
        },
        "pricing": {
            "meter": line.meter.code(),
            "plan": quote.pricing_plan_code.as_str(),
            "group": quote.group_code.as_str(),
            "officialReferenceUnitPrice": quote.official_reference_unit_price.to_fixed_string(6),
            "customerUnitPrice": quote.customer_charge_before_rate.to_fixed_string(6),
            "chargedUnitPrice": quote.customer_charge_unit_price.to_fixed_string(6),
            "upstreamUnitPrice": quote
                .upstream_cost_unit_price
                .as_ref()
                .map(|price| price.to_fixed_string(6))
                .unwrap_or_else(|| "0.000000".to_owned()),
            "currency": quote.customer_charge_unit_price.currency.as_str(),
            "rateMultiplier": quote.rate_multiplier.as_str(),
            "referenceMultiplier": quote.reference_multiplier.as_str()
        }
    })
    .to_string()
}

fn effective_invocation_dispatch_status_code(invocation: &Invocation) -> Option<u16> {
    invocation
        .dispatch
        .response
        .as_ref()
        .and_then(|response| effective_dispatch_status_code(invocation, response))
}

fn effective_dispatch_status_code(
    invocation: &Invocation,
    response: &super::InvocationDispatchResponse,
) -> Option<u16> {
    if invocation.dispatch.mode != super::DispatchMode::InternalProviderAdapter {
        return Some(response.status_code);
    }
    response
        .body
        .as_ref()
        .and_then(adapter_response_status_code)
        .or(Some(response.status_code))
}

fn adapter_response_status_code(body: &Value) -> Option<u16> {
    body.get("statusCode")
        .or_else(|| body.get("status_code"))
        .and_then(Value::as_u64)
        .and_then(|value| u16::try_from(value).ok())
}

fn settlement_error(message: impl Into<String>) -> InvocationError {
    InvocationError::new(InvocationErrorKind::Usage, message)
}
