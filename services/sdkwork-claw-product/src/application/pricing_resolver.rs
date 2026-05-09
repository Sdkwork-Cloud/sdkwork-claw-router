use crate::domain::{
    BillingMeter, DomainError, DomainResult, ModelPrice, ModelVendor, Money, PriceSide,
};
use crate::ports::PricingCatalog;

pub struct PricingResolver<'a, C: PricingCatalog> {
    catalog: &'a C,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ResolveModelPriceQuery {
    pub api_key_id: i64,
    pub model: String,
    pub billing_meter: BillingMeter,
    pub provider_code: Option<String>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ResolvedPriceSource {
    ExplicitCustomerCharge,
    DerivedFromOfficialReference,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ResolvedModelPrice {
    pub model: String,
    pub vendor: ModelVendor,
    pub group_code: String,
    pub pricing_plan_code: String,
    pub provider_code: Option<String>,
    pub billing_meter: BillingMeter,
    pub official_reference: ModelPrice,
    pub upstream_cost: Option<ModelPrice>,
    pub customer_charge: Money,
    pub gross_margin_per_unit: Option<crate::domain::DecimalValue>,
    pub source: ResolvedPriceSource,
}

impl<'a, C: PricingCatalog> PricingResolver<'a, C> {
    pub fn new(catalog: &'a C) -> Self {
        Self { catalog }
    }

    pub fn resolve(&self, query: ResolveModelPriceQuery) -> DomainResult<ResolvedModelPrice> {
        let api_key = self.find_api_key(query.api_key_id)?;
        let group = self.find_group(api_key.group_id)?;
        let plan = self.find_plan(&group.pricing_plan_code)?;
        let model = self.find_model(&query.model)?;
        let vendor = self.find_vendor(&model.vendor_code)?;
        let official = self.find_official_reference(&query)?;
        let upstream = self.find_upstream_cost(&query);

        if let Some(provider_code) = query.provider_code.as_deref() {
            self.ensure_provider_route(&query.model, provider_code)?;
        }

        let explicit_customer = self.catalog.find_model_price(
            &query.model,
            PriceSide::CustomerCharge,
            query.billing_meter.clone(),
            None,
            Some(&plan.plan_code),
        );
        let (customer_charge, source) = match explicit_customer {
            Some(price) => (
                price.unit_price.multiply(group.rate_multiplier),
                ResolvedPriceSource::ExplicitCustomerCharge,
            ),
            None => (
                official
                    .unit_price
                    .multiply(plan.default_multiplier)
                    .multiply(group.official_price_multiplier)
                    .add(&plan.default_markup_amount)?
                    .multiply(group.rate_multiplier),
                ResolvedPriceSource::DerivedFromOfficialReference,
            ),
        };
        let gross_margin_per_unit = upstream
            .as_ref()
            .map(|price| customer_charge.subtract(&price.unit_price))
            .transpose()?;

        Ok(ResolvedModelPrice {
            model: model.model,
            vendor: vendor.vendor,
            group_code: group.code,
            pricing_plan_code: plan.plan_code,
            provider_code: query.provider_code,
            billing_meter: query.billing_meter,
            official_reference: official,
            upstream_cost: upstream,
            customer_charge,
            gross_margin_per_unit,
            source,
        })
    }

    fn find_api_key(&self, api_key_id: i64) -> DomainResult<crate::domain::GatewayApiKey> {
        self.catalog
            .find_api_key(api_key_id)
            .ok_or_else(|| DomainError::new(format!("api key not found: {api_key_id}")))
    }

    fn find_group(&self, group_id: i64) -> DomainResult<crate::domain::ApiKeyGroup> {
        self.catalog
            .find_api_key_group(group_id)
            .ok_or_else(|| DomainError::new(format!("api key group not found: {group_id}")))
    }

    fn find_plan(&self, plan_code: &str) -> DomainResult<crate::domain::PricingPlan> {
        self.catalog
            .find_pricing_plan(plan_code)
            .ok_or_else(|| DomainError::new(format!("pricing plan not found: {plan_code}")))
    }

    fn find_model(&self, model: &str) -> DomainResult<crate::domain::AiModel> {
        self.catalog
            .find_model(model)
            .ok_or_else(|| DomainError::new(format!("model not found: {model}")))
    }

    fn find_vendor(&self, vendor_code: &str) -> DomainResult<crate::domain::ModelVendorDefinition> {
        self.catalog
            .find_vendor(vendor_code)
            .ok_or_else(|| DomainError::new(format!("model vendor not found: {vendor_code}")))
    }

    fn find_official_reference(&self, query: &ResolveModelPriceQuery) -> DomainResult<ModelPrice> {
        self.catalog
            .find_model_price(
                &query.model,
                PriceSide::OfficialReference,
                query.billing_meter.clone(),
                None,
                None,
            )
            .ok_or_else(|| {
                DomainError::new(format!(
                    "official reference price not found for model {} and meter {}",
                    query.model,
                    query.billing_meter.code()
                ))
            })
    }

    fn find_upstream_cost(&self, query: &ResolveModelPriceQuery) -> Option<ModelPrice> {
        self.catalog.find_model_price(
            &query.model,
            PriceSide::UpstreamCost,
            query.billing_meter.clone(),
            query.provider_code.as_deref(),
            None,
        )
    }

    fn ensure_provider_route(&self, model: &str, provider_code: &str) -> DomainResult<()> {
        self.catalog
            .find_provider_route(model, provider_code)
            .map(|_| ())
            .ok_or_else(|| {
                DomainError::new(format!(
                    "provider route not found for model {model} and provider {provider_code}"
                ))
            })
    }
}
