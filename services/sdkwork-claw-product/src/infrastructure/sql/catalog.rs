use std::collections::BTreeMap;

use crate::domain::{
    AiModel, ApiKeyGroup, ApiKeyGroupMetricSnapshot, BillingMeter, DecimalValue, DomainResult,
    GatewayAccessPolicy, GatewayApiKey, ModelPrice, ModelProviderRoute, ModelVendorDefinition,
    Money, PriceSide, PricingPlan, ProviderAccountPoolRoute, QuotaPolicy, RoutingPolicy,
    RoutingRule,
};
use crate::infrastructure::sql::rows::{
    AiModelRow, ApiKeyGroupMetricSnapshotRow, ApiKeyGroupRow, GatewayAccessPolicyRow,
    GatewayApiKeyRow, ModelPriceRow, ModelProviderRouteRow, ModelVendorRow, PricingPlanRow,
    ProviderAccountPoolRouteRow, QuotaPolicyRow, RoutingPolicyRow, RoutingRuleRow,
};
use crate::ports::PricingCatalog;
use std::sync::{Arc, RwLock};

#[derive(Default)]
pub struct PricingCatalogRows {
    pub vendors: Vec<ModelVendorRow>,
    pub models: Vec<AiModelRow>,
    pub provider_routes: Vec<ModelProviderRouteRow>,
    pub provider_account_pool_routes: Vec<ProviderAccountPoolRouteRow>,
    pub routing_policies: Vec<RoutingPolicyRow>,
    pub routing_rules: Vec<RoutingRuleRow>,
    pub pricing_plans: Vec<PricingPlanRow>,
    pub api_key_groups: Vec<ApiKeyGroupRow>,
    pub api_keys: Vec<GatewayApiKeyRow>,
    pub access_policies: Vec<GatewayAccessPolicyRow>,
    pub quota_policies: Vec<QuotaPolicyRow>,
    pub api_key_group_metric_snapshots: Vec<ApiKeyGroupMetricSnapshotRow>,
    pub prices: Vec<ModelPriceRow>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SqlPricingCatalogSnapshotSummary {
    pub vendors: usize,
    pub models: usize,
    pub provider_routes: usize,
    pub callable_provider_routes: usize,
    pub provider_account_pool_routes: usize,
    pub callable_provider_account_pool_routes: usize,
    pub provider_account_pool_group_bindings: usize,
    pub routing_policies: usize,
    pub routing_rules: usize,
    pub pricing_plans: usize,
    pub api_key_groups: usize,
    pub api_keys: usize,
    pub prices: usize,
    pub managed_provider_secrets: usize,
}

pub struct SqlPricingCatalogSnapshot {
    vendors: Vec<ModelVendorDefinition>,
    models: Vec<AiModel>,
    provider_routes: Vec<ModelProviderRoute>,
    provider_account_pool_routes: Vec<ProviderAccountPoolRoute>,
    routing_policies: Vec<RoutingPolicy>,
    routing_rules: Vec<RoutingRule>,
    pricing_plans: Vec<PricingPlan>,
    api_key_groups: Vec<ApiKeyGroup>,
    api_keys: Vec<GatewayApiKey>,
    access_policies: Vec<GatewayAccessPolicy>,
    quota_policies: Vec<QuotaPolicy>,
    api_key_group_metric_snapshots: Vec<ApiKeyGroupMetricSnapshot>,
    prices: Vec<ModelPrice>,
    managed_provider_secrets: BTreeMap<String, String>,
}

impl SqlPricingCatalogSnapshot {
    pub fn from_rows(rows: PricingCatalogRows) -> DomainResult<Self> {
        Self::from_rows_and_managed_provider_secrets(rows, BTreeMap::new())
    }

    pub fn from_rows_and_managed_provider_secrets(
        rows: PricingCatalogRows,
        managed_provider_secrets: BTreeMap<String, String>,
    ) -> DomainResult<Self> {
        let pricing_plans = pricing_plans_with_standard_fallback(map_rows(
            rows.pricing_plans,
            PricingPlanRow::try_into_domain,
        )?)?;
        Ok(Self {
            vendors: map_rows(rows.vendors, ModelVendorRow::try_into_domain)?,
            models: map_rows(rows.models, AiModelRow::try_into_domain)?,
            provider_routes: map_rows(
                rows.provider_routes,
                ModelProviderRouteRow::try_into_domain,
            )?,
            provider_account_pool_routes: map_rows(
                rows.provider_account_pool_routes,
                ProviderAccountPoolRouteRow::try_into_domain,
            )?,
            routing_policies: map_rows(rows.routing_policies, RoutingPolicyRow::try_into_domain)?,
            routing_rules: map_rows(rows.routing_rules, RoutingRuleRow::try_into_domain)?,
            pricing_plans,
            api_key_groups: map_rows(rows.api_key_groups, ApiKeyGroupRow::try_into_domain)?,
            api_keys: rows
                .api_keys
                .into_iter()
                .map(GatewayApiKeyRow::into_domain)
                .collect(),
            access_policies: map_rows(
                rows.access_policies,
                GatewayAccessPolicyRow::try_into_domain,
            )?,
            quota_policies: map_rows(rows.quota_policies, QuotaPolicyRow::try_into_domain)?,
            api_key_group_metric_snapshots: map_rows(
                rows.api_key_group_metric_snapshots,
                ApiKeyGroupMetricSnapshotRow::try_into_domain,
            )?,
            prices: map_rows(rows.prices, ModelPriceRow::try_into_domain)?,
            managed_provider_secrets,
        })
    }

    pub fn managed_provider_secrets(&self) -> BTreeMap<String, String> {
        self.managed_provider_secrets.clone()
    }

    pub fn summary(&self) -> SqlPricingCatalogSnapshotSummary {
        SqlPricingCatalogSnapshotSummary {
            vendors: self.vendors.len(),
            models: self.models.len(),
            provider_routes: self.provider_routes.len(),
            callable_provider_routes: self
                .provider_routes
                .iter()
                .filter(|route| {
                    has_text(route.base_url.as_deref()) && has_text(route.secret_ref.as_deref())
                })
                .count(),
            provider_account_pool_routes: self.provider_account_pool_routes.len(),
            callable_provider_account_pool_routes: self
                .provider_account_pool_routes
                .iter()
                .filter(|route| {
                    has_text(route.base_url.as_deref()) && has_text(route.secret_ref.as_deref())
                })
                .count(),
            provider_account_pool_group_bindings: self
                .provider_account_pool_routes
                .iter()
                .map(|route| route.group_bindings.len())
                .sum(),
            routing_policies: self.routing_policies.len(),
            routing_rules: self.routing_rules.len(),
            pricing_plans: self.pricing_plans.len(),
            api_key_groups: self.api_key_groups.len(),
            api_keys: self.api_keys.len(),
            prices: self.prices.len(),
            managed_provider_secrets: self.managed_provider_secrets.len(),
        }
    }
}

pub struct RefreshableSqlPricingCatalog {
    snapshot: RwLock<Arc<SqlPricingCatalogSnapshot>>,
}

impl RefreshableSqlPricingCatalog {
    pub fn new(snapshot: SqlPricingCatalogSnapshot) -> Self {
        Self {
            snapshot: RwLock::new(Arc::new(snapshot)),
        }
    }

    pub fn replace_snapshot(&self, snapshot: SqlPricingCatalogSnapshot) {
        match self.snapshot.write() {
            Ok(mut current) => {
                *current = Arc::new(snapshot);
            }
            Err(poisoned) => {
                *poisoned.into_inner() = Arc::new(snapshot);
            }
        }
    }

    fn current_snapshot(&self) -> Arc<SqlPricingCatalogSnapshot> {
        match self.snapshot.read() {
            Ok(snapshot) => Arc::clone(&snapshot),
            Err(poisoned) => Arc::clone(&poisoned.into_inner()),
        }
    }
}

impl PricingCatalog for RefreshableSqlPricingCatalog {
    fn list_models(&self, vendor_code: Option<&str>) -> Vec<AiModel> {
        self.current_snapshot().list_models(vendor_code)
    }

    fn list_provider_routes(&self, model: &str) -> Vec<ModelProviderRoute> {
        self.current_snapshot().list_provider_routes(model)
    }

    fn list_provider_account_pool_routes(&self) -> Vec<ProviderAccountPoolRoute> {
        self.current_snapshot().list_provider_account_pool_routes()
    }

    fn list_routing_policies(&self) -> Vec<RoutingPolicy> {
        self.current_snapshot().list_routing_policies()
    }

    fn list_routing_rules(&self, profile_id: i64) -> Vec<RoutingRule> {
        self.current_snapshot().list_routing_rules(profile_id)
    }

    fn list_api_keys(&self) -> Vec<GatewayApiKey> {
        self.current_snapshot().list_api_keys()
    }

    fn list_api_key_groups(&self) -> Vec<ApiKeyGroup> {
        self.current_snapshot().list_api_key_groups()
    }

    fn list_model_prices(
        &self,
        model: &str,
        price_side: PriceSide,
        billing_meter: BillingMeter,
    ) -> Vec<ModelPrice> {
        self.current_snapshot()
            .list_model_prices(model, price_side, billing_meter)
    }

    fn list_model_prices_for_side(&self, model: &str, price_side: PriceSide) -> Vec<ModelPrice> {
        self.current_snapshot()
            .list_model_prices_for_side(model, price_side)
    }

    fn find_api_key(&self, api_key_id: i64) -> Option<GatewayApiKey> {
        self.current_snapshot().find_api_key(api_key_id)
    }

    fn find_api_key_by_hash(&self, key_hash: &str) -> Option<GatewayApiKey> {
        self.current_snapshot().find_api_key_by_hash(key_hash)
    }

    fn find_api_key_group(&self, group_id: i64) -> Option<ApiKeyGroup> {
        self.current_snapshot().find_api_key_group(group_id)
    }

    fn find_access_policy(&self, policy_id: i64) -> Option<GatewayAccessPolicy> {
        self.current_snapshot().find_access_policy(policy_id)
    }

    fn find_quota_policy(&self, policy_id: i64) -> Option<QuotaPolicy> {
        self.current_snapshot().find_quota_policy(policy_id)
    }

    fn find_latest_api_key_group_metric_snapshot(
        &self,
        group_id: i64,
    ) -> Option<ApiKeyGroupMetricSnapshot> {
        self.current_snapshot()
            .find_latest_api_key_group_metric_snapshot(group_id)
    }

    fn find_pricing_plan(&self, plan_code: &str) -> Option<PricingPlan> {
        self.current_snapshot().find_pricing_plan(plan_code)
    }

    fn find_model(&self, model: &str) -> Option<AiModel> {
        self.current_snapshot().find_model(model)
    }

    fn find_vendor(&self, vendor_code: &str) -> Option<ModelVendorDefinition> {
        self.current_snapshot().find_vendor(vendor_code)
    }

    fn find_provider_route(&self, model: &str, provider_code: &str) -> Option<ModelProviderRoute> {
        self.current_snapshot()
            .find_provider_route(model, provider_code)
    }

    fn find_model_price(
        &self,
        model: &str,
        price_side: PriceSide,
        billing_meter: BillingMeter,
        provider_code: Option<&str>,
        pricing_plan_code: Option<&str>,
    ) -> Option<ModelPrice> {
        self.current_snapshot().find_model_price(
            model,
            price_side,
            billing_meter,
            provider_code,
            pricing_plan_code,
        )
    }
}

impl PricingCatalog for SqlPricingCatalogSnapshot {
    fn list_models(&self, vendor_code: Option<&str>) -> Vec<AiModel> {
        self.models
            .iter()
            .filter(|model| {
                vendor_code
                    .map(|vendor_code| model.vendor_code == vendor_code)
                    .unwrap_or(true)
            })
            .cloned()
            .collect()
    }

    fn list_provider_routes(&self, model: &str) -> Vec<ModelProviderRoute> {
        self.provider_routes
            .iter()
            .filter(|route| catalog_key_matches_runtime_scope(&route.catalog_key, model))
            .cloned()
            .collect()
    }

    fn list_provider_account_pool_routes(&self) -> Vec<ProviderAccountPoolRoute> {
        self.provider_account_pool_routes.clone()
    }

    fn list_routing_policies(&self) -> Vec<RoutingPolicy> {
        self.routing_policies.clone()
    }

    fn list_routing_rules(&self, profile_id: i64) -> Vec<RoutingRule> {
        self.routing_rules
            .iter()
            .filter(|rule| rule.profile_id == profile_id)
            .cloned()
            .collect()
    }

    fn list_api_keys(&self) -> Vec<GatewayApiKey> {
        self.api_keys.clone()
    }

    fn list_api_key_groups(&self) -> Vec<ApiKeyGroup> {
        self.api_key_groups.clone()
    }

    fn list_model_prices(
        &self,
        model: &str,
        price_side: PriceSide,
        billing_meter: BillingMeter,
    ) -> Vec<ModelPrice> {
        self.prices
            .iter()
            .filter(|price| {
                catalog_key_matches_runtime_scope(&price.catalog_key, model)
                    && price.price_side == price_side
                    && price.billing_meter == billing_meter
            })
            .cloned()
            .collect()
    }

    fn list_model_prices_for_side(&self, model: &str, price_side: PriceSide) -> Vec<ModelPrice> {
        self.prices
            .iter()
            .filter(|price| {
                catalog_key_matches_runtime_scope(&price.catalog_key, model)
                    && price.price_side == price_side
            })
            .cloned()
            .collect()
    }

    fn find_api_key(&self, api_key_id: i64) -> Option<GatewayApiKey> {
        self.api_keys
            .iter()
            .find(|api_key| api_key.id == api_key_id)
            .cloned()
    }

    fn find_api_key_by_hash(&self, key_hash: &str) -> Option<GatewayApiKey> {
        self.api_keys
            .iter()
            .find(|api_key| api_key.key_hash == key_hash)
            .cloned()
    }

    fn find_api_key_group(&self, group_id: i64) -> Option<ApiKeyGroup> {
        self.api_key_groups
            .iter()
            .find(|group| group.id == group_id)
            .cloned()
    }

    fn find_access_policy(&self, policy_id: i64) -> Option<GatewayAccessPolicy> {
        self.access_policies
            .iter()
            .find(|policy| policy.id == policy_id)
            .cloned()
    }

    fn find_quota_policy(&self, policy_id: i64) -> Option<QuotaPolicy> {
        self.quota_policies
            .iter()
            .find(|policy| policy.id == policy_id)
            .cloned()
    }

    fn find_latest_api_key_group_metric_snapshot(
        &self,
        group_id: i64,
    ) -> Option<ApiKeyGroupMetricSnapshot> {
        self.api_key_group_metric_snapshots
            .iter()
            .find(|snapshot| snapshot.group_id == group_id)
            .cloned()
    }

    fn find_pricing_plan(&self, plan_code: &str) -> Option<PricingPlan> {
        self.pricing_plans
            .iter()
            .find(|plan| plan.plan_code == plan_code)
            .cloned()
    }

    fn find_model(&self, model: &str) -> Option<AiModel> {
        self.models
            .iter()
            .find(|candidate| catalog_key_matches_model_key(&candidate.catalog_key, model))
            .cloned()
    }

    fn find_vendor(&self, vendor_code: &str) -> Option<ModelVendorDefinition> {
        self.vendors
            .iter()
            .find(|vendor| vendor.vendor_code == vendor_code)
            .cloned()
    }

    fn find_provider_route(&self, model: &str, provider_code: &str) -> Option<ModelProviderRoute> {
        self.provider_routes
            .iter()
            .find(|route| {
                catalog_key_matches_runtime_scope(&route.catalog_key, model)
                    && route.provider_code == provider_code
            })
            .cloned()
    }

    fn find_model_price(
        &self,
        model: &str,
        price_side: PriceSide,
        billing_meter: BillingMeter,
        provider_code: Option<&str>,
        pricing_plan_code: Option<&str>,
    ) -> Option<ModelPrice> {
        self.prices
            .iter()
            .find(|price| {
                catalog_key_matches_runtime_scope(&price.catalog_key, model)
                    && price.price_side == price_side
                    && price.billing_meter == billing_meter
                    && option_matches(price.provider_code.as_deref(), provider_code)
                    && option_matches(price.pricing_plan_code.as_deref(), pricing_plan_code)
            })
            .cloned()
    }
}

fn map_rows<R, T>(rows: Vec<R>, mapper: impl Fn(R) -> DomainResult<T>) -> DomainResult<Vec<T>> {
    rows.into_iter().map(mapper).collect()
}

fn pricing_plans_with_standard_fallback(
    mut pricing_plans: Vec<PricingPlan>,
) -> DomainResult<Vec<PricingPlan>> {
    if pricing_plans
        .iter()
        .all(|plan| plan.plan_code.trim() != "standard")
    {
        pricing_plans.push(PricingPlan::new(
            "standard",
            PriceSide::OfficialReference,
            DecimalValue::parse("1.000000")?,
            Money::usd("0.000000")?,
        ));
    }
    Ok(pricing_plans)
}

fn has_text(value: Option<&str>) -> bool {
    value.map(str::trim).is_some_and(|value| !value.is_empty())
}

fn option_matches(actual: Option<&str>, expected: Option<&str>) -> bool {
    match expected {
        Some(expected) => actual == Some(expected),
        None => actual.is_none(),
    }
}

fn catalog_key_matches_model_key(candidate: &str, model_key: &str) -> bool {
    if candidate == model_key {
        return true;
    }
    match (catalog_key_parts(candidate), catalog_key_parts(model_key)) {
        (Some((candidate_vendor, candidate_model)), Some((model_vendor, model_model))) => {
            candidate_vendor == model_vendor && candidate_model == model_model
        }
        _ => false,
    }
}

fn catalog_key_matches_runtime_scope(candidate: &str, model_key: &str) -> bool {
    if candidate == model_key {
        return true;
    }
    match catalog_key_shape(model_key) {
        CatalogKeyShape::Base { vendor, model } => catalog_key_parts(candidate)
            .map(|(candidate_vendor, candidate_model)| {
                candidate_vendor == vendor && candidate_model == model
            })
            .unwrap_or(false),
        CatalogKeyShape::Regional { .. } | CatalogKeyShape::Other => false,
    }
}

fn catalog_key_parts(value: &str) -> Option<(&str, &str)> {
    let parts = value
        .split('/')
        .filter(|part| !part.is_empty())
        .collect::<Vec<_>>();
    match parts.as_slice() {
        [vendor, model] => Some((*vendor, *model)),
        [vendor, _region, model] => Some((*vendor, *model)),
        _ => None,
    }
}

enum CatalogKeyShape<'a> {
    Base { vendor: &'a str, model: &'a str },
    Regional,
    Other,
}

fn catalog_key_shape(value: &str) -> CatalogKeyShape<'_> {
    let parts = value
        .split('/')
        .filter(|part| !part.is_empty())
        .collect::<Vec<_>>();
    match parts.as_slice() {
        [vendor, model] => CatalogKeyShape::Base { vendor, model },
        [_vendor, _region, _model] => CatalogKeyShape::Regional,
        _ => CatalogKeyShape::Other,
    }
}
