use crate::domain::{
    AiModel, ApiKeyGroup, ApiKeyGroupMetricSnapshot, BillingMeter, GatewayAccessPolicy,
    GatewayApiKey, ModelPrice, ModelProviderRoute, ModelVendorDefinition, PriceSide, PricingPlan,
    QuotaPolicy,
};
use crate::ports::PricingCatalog;

#[derive(Debug, Default, Clone)]
pub struct InMemoryPricingCatalog {
    vendors: Vec<ModelVendorDefinition>,
    models: Vec<AiModel>,
    provider_routes: Vec<ModelProviderRoute>,
    plans: Vec<PricingPlan>,
    api_key_groups: Vec<ApiKeyGroup>,
    api_keys: Vec<GatewayApiKey>,
    access_policies: Vec<GatewayAccessPolicy>,
    quota_policies: Vec<QuotaPolicy>,
    api_key_group_metric_snapshots: Vec<ApiKeyGroupMetricSnapshot>,
    prices: Vec<ModelPrice>,
}

impl InMemoryPricingCatalog {
    pub fn add_vendor(&mut self, vendor: ModelVendorDefinition) {
        self.vendors.push(vendor);
    }

    pub fn add_model(&mut self, model: AiModel) {
        self.models.push(model);
    }

    pub fn add_provider_route(&mut self, route: ModelProviderRoute) {
        self.provider_routes.push(route);
    }

    pub fn add_plan(&mut self, plan: PricingPlan) {
        self.plans.push(plan);
    }

    pub fn add_api_key_group(&mut self, group: ApiKeyGroup) {
        self.api_key_groups.push(group);
    }

    pub fn update_group_rate_multiplier(
        &mut self,
        group_id: i64,
        multiplier: crate::domain::DecimalValue,
    ) {
        if let Some(group) = self
            .api_key_groups
            .iter_mut()
            .find(|group| group.id == group_id)
        {
            group.rate_multiplier = multiplier;
        }
    }

    pub fn add_api_key(&mut self, api_key: GatewayApiKey) {
        self.api_keys.push(api_key);
    }

    pub fn add_access_policy(&mut self, policy: GatewayAccessPolicy) {
        self.access_policies.push(policy);
    }

    pub fn add_quota_policy(&mut self, policy: QuotaPolicy) {
        self.quota_policies.push(policy);
    }

    pub fn add_api_key_group_metric_snapshot(&mut self, snapshot: ApiKeyGroupMetricSnapshot) {
        self.api_key_group_metric_snapshots.push(snapshot);
    }

    pub fn add_price(&mut self, price: ModelPrice) {
        self.prices.push(price);
    }
}

impl PricingCatalog for InMemoryPricingCatalog {
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
            .filter(|route| route.catalog_key == model)
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
                price.catalog_key == model
                    && price.price_side == price_side
                    && price.billing_meter == billing_meter
            })
            .cloned()
            .collect()
    }

    fn list_model_prices_for_side(&self, model: &str, price_side: PriceSide) -> Vec<ModelPrice> {
        self.prices
            .iter()
            .filter(|price| price.catalog_key == model && price.price_side == price_side)
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
        self.plans
            .iter()
            .find(|plan| plan.plan_code == plan_code)
            .cloned()
    }

    fn find_model(&self, model: &str) -> Option<AiModel> {
        self.models
            .iter()
            .find(|candidate| candidate.catalog_key == model)
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
            .find(|route| route.catalog_key == model && route.provider_code == provider_code)
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
                price.catalog_key == model
                    && price.price_side == price_side
                    && price.billing_meter == billing_meter
                    && option_matches(price.provider_code.as_deref(), provider_code)
                    && option_matches(price.pricing_plan_code.as_deref(), pricing_plan_code)
            })
            .cloned()
    }
}

fn option_matches(actual: Option<&str>, expected: Option<&str>) -> bool {
    match expected {
        Some(expected) => actual == Some(expected),
        None => actual.is_none(),
    }
}
