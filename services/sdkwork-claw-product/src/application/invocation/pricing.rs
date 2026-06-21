use std::sync::Arc;

use super::{
    BillingMode, BillingQuantitySource, Invocation, InvocationError, InvocationErrorKind,
    InvocationFuture, InvocationInterceptor, InvocationPricingQuote, InvocationUsageLine,
};
use crate::application::{PricingResolver, ResolveModelPriceQuery, ResolvedModelPrice};
use crate::domain::{AiRouteModelRequirement, BillingMeter};
use crate::ports::PricingCatalog;

#[derive(Clone)]
pub struct PricingPreflightInterceptor<C>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    catalog: Arc<C>,
}

#[derive(Clone)]
pub struct PricingFinalizationInterceptor<C>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    catalog: Arc<C>,
}

impl<C> PricingPreflightInterceptor<C>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    pub fn new(catalog: Arc<C>) -> Self {
        Self { catalog }
    }
}

impl<C> PricingFinalizationInterceptor<C>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    pub fn new(catalog: Arc<C>) -> Self {
        Self { catalog }
    }
}

impl<C> InvocationInterceptor for PricingPreflightInterceptor<C>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    fn name(&self) -> &str {
        "pricing_preflight"
    }

    fn before<'a>(&'a self, invocation: &'a mut Invocation) -> InvocationFuture<'a, ()> {
        Box::pin(async move {
            if !invocation.billing.pricing_required || invocation.billing.mode == BillingMode::Free
            {
                return Ok(());
            }

            let meters = meters_for_pricing(invocation);
            for meter in meters {
                match resolve_quote(self.catalog.as_ref(), invocation, meter.clone()) {
                    Ok(quote) => invocation.usage.add_pricing_quote(quote),
                    Err(error) if optional_meter(&meter, invocation.billing.mode.clone()) => {
                        if is_missing_official_price(&error) {
                            continue;
                        }
                        return Err(error);
                    }
                    Err(error) => return Err(error),
                }
            }

            if invocation.billing.quantity_source == BillingQuantitySource::FixedRequest
                && !invocation.usage.pricing_quotes.is_empty()
                && !invocation
                    .usage
                    .lines
                    .iter()
                    .any(|line| line.meter == BillingMeter::ApiRequest)
            {
                invocation
                    .usage
                    .add_line(InvocationUsageLine::fixed_request());
            }

            Ok(())
        })
    }
}

impl<C> InvocationInterceptor for PricingFinalizationInterceptor<C>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    fn name(&self) -> &str {
        "pricing_finalization"
    }

    fn after<'a>(&'a self, invocation: &'a mut Invocation) -> InvocationFuture<'a, ()> {
        Box::pin(async move {
            if !invocation.billing.pricing_required
                || invocation.billing.mode == BillingMode::Free
                || invocation.usage.lines.is_empty()
            {
                return Ok(());
            }

            let meters = dedupe_meters(
                invocation
                    .usage
                    .lines
                    .iter()
                    .map(|line| line.meter.clone())
                    .collect(),
            );
            let mut quotes = Vec::new();
            for meter in meters {
                match resolve_quote(self.catalog.as_ref(), invocation, meter.clone()) {
                    Ok(quote) => quotes.push(quote),
                    Err(error)
                        if optional_meter(&meter, invocation.billing.mode.clone())
                            && is_missing_official_price(&error) =>
                    {
                        continue;
                    }
                    Err(error) => return Err(error),
                }
            }

            for line in &mut invocation.usage.lines {
                line.pricing_quote = quotes
                    .iter()
                    .find(|quote| quote.meter == line.meter)
                    .cloned();
            }
            invocation.usage.pricing_quotes = quotes;
            Ok(())
        })
    }
}

/// Returns billing meters that require pricing resolution based on the billing mode.
fn meters_for_pricing(invocation: &Invocation) -> Vec<BillingMeter> {
    let mut meters = Vec::new();
    match invocation.billing.mode {
        BillingMode::Free => {}
        BillingMode::Composite => {
            if let Some(meter) = invocation.billing.meter.clone() {
                meters.push(meter);
            }
            meters.push(BillingMeter::LlmOutputToken);
            meters.push(BillingMeter::LlmCacheReadToken);
        }
        BillingMode::ExternalUsageLine => {
            if let Some(meter) = invocation.billing.meter.clone() {
                meters.push(meter);
            }
            meters.push(BillingMeter::ApiResult);
            meters.push(BillingMeter::ApiItem);
            meters.push(BillingMeter::ApiRequest);
        }
        _ => {
            if let Some(meter) = invocation.billing.meter.clone() {
                meters.push(meter);
            }
        }
    }
    dedupe_meters(meters)
}

fn dedupe_meters(meters: Vec<BillingMeter>) -> Vec<BillingMeter> {
    let mut deduped = Vec::new();
    for meter in meters {
        if !deduped.contains(&meter) {
            deduped.push(meter);
        }
    }
    deduped
}

fn optional_meter(meter: &BillingMeter, mode: BillingMode) -> bool {
    mode == BillingMode::ExternalUsageLine
        || (mode == BillingMode::Composite && *meter == BillingMeter::LlmCacheReadToken)
}

fn resolve_quote<C>(
    catalog: &C,
    invocation: &Invocation,
    meter: BillingMeter,
) -> Result<InvocationPricingQuote, InvocationError>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let account = invocation
        .account
        .as_ref()
        .ok_or_else(|| pricing_error("pricing requires resolved invocation account"))?;
    let api_key_id = invocation
        .subject
        .api_key_id
        .ok_or_else(|| pricing_error("pricing requires api key context"))?;
    let model = priced_catalog_key(invocation)?;
    let resolved = PricingResolver::new(catalog)
        .resolve(ResolveModelPriceQuery {
            api_key_id,
            channel_group_id: invocation.subject.channel_group_id,
            model,
            billing_meter: meter,
            provider_code: Some(account.provider_code.clone()),
            channel_id: Some(account.channel_id),
            region_code: Some(account.region_code.clone()),
        })
        .map_err(|error| pricing_error(error.to_string()))?;
    Ok(quote_from_resolved(invocation, &resolved))
}

fn priced_catalog_key(invocation: &Invocation) -> Result<String, InvocationError> {
    if should_price_by_route_key_only(invocation) {
        return route_key_catalog_key(invocation);
    }

    [
        invocation.resource.requested_model_catalog_key.as_deref(),
        invocation.resource.requested_model.as_deref(),
        Some(invocation.resource.route_key.as_str()),
        Some(invocation.resource.api_code.as_str()),
    ]
    .into_iter()
    .flatten()
    .map(str::trim)
    .find(|value| !value.is_empty())
    .map(str::to_owned)
    .ok_or_else(|| pricing_error("pricing requires a resource catalog key"))
}

fn quote_from_resolved(
    invocation: &Invocation,
    resolved: &ResolvedModelPrice,
) -> InvocationPricingQuote {
    InvocationPricingQuote {
        catalog_key: resolved.official_reference.catalog_key.clone(),
        requested_model: priced_requested_model(invocation, resolved),
        provider_code: resolved.provider_code.clone(),
        channel_id: invocation
            .account
            .as_ref()
            .map(|account| account.channel_id),
        region_code: resolved.official_reference.region_code.clone(),
        meter: resolved.billing_meter.clone(),
        official_reference_unit_price: resolved.official_reference.unit_price.clone(),
        upstream_cost_unit_price: resolved
            .upstream_cost
            .as_ref()
            .map(|price| price.unit_price.clone()),
        customer_charge_before_rate: resolved.customer_charge_before_rate.clone(),
        customer_charge_unit_price: resolved.customer_charge.clone(),
        rate_multiplier: resolved.rate_multiplier.to_fixed_string(6),
        reference_multiplier: resolved.reference_multiplier.to_fixed_string(6),
        pricing_plan_code: resolved.pricing_plan_code.clone(),
        group_code: resolved.group_code.clone(),
    }
}

fn priced_requested_model(invocation: &Invocation, resolved: &ResolvedModelPrice) -> String {
    if should_price_by_route_key_only(invocation) {
        return resolved.model.clone();
    }
    invocation
        .resource
        .requested_model
        .clone()
        .unwrap_or_else(|| resolved.model.clone())
}

/// Returns true when pricing resolution failed because no price data exists for the model,
/// allowing optional meters (e.g. ExternalUsageLine) to be skipped gracefully.
fn is_missing_official_price(error: &InvocationError) -> bool {
    error.message.contains("official reference price not found")
        || error.message.contains("model not found")
        || error.message.contains("model is not available")
}

fn pricing_error(message: impl Into<String>) -> InvocationError {
    InvocationError::new(InvocationErrorKind::Pricing, message)
}

fn should_price_by_route_key_only(invocation: &Invocation) -> bool {
    if invocation.resource.model_requirement == AiRouteModelRequirement::Ignored {
        return true;
    }
    invocation.resource.model_requirement == AiRouteModelRequirement::Optional
        && invocation
            .resource
            .requested_model
            .as_deref()
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .is_none()
}

fn route_key_catalog_key(invocation: &Invocation) -> Result<String, InvocationError> {
    [
        Some(invocation.resource.route_key.as_str()),
        Some(invocation.resource.api_code.as_str()),
    ]
    .into_iter()
    .flatten()
    .map(str::trim)
    .find(|value| !value.is_empty())
    .map(str::to_owned)
    .ok_or_else(|| pricing_error("pricing requires a resource catalog key"))
}
