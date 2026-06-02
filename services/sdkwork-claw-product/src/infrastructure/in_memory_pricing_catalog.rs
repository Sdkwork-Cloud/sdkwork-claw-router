use crate::domain::{
    AiModel, BillingMeter, ChannelGroup, ChannelGroupMetricSnapshot, GatewayAccessPolicy,
    GatewayApiKey, ModelPrice, ModelProviderRoute, ModelVendorDefinition, PriceSide, PricingPlan,
    ProviderChannelRoute, QuotaPolicy, RoutingPolicy, RoutingRule,
};
use crate::ports::PricingCatalog;

#[derive(Debug, Default, Clone)]
pub struct InMemoryPricingCatalog {
    vendors: Vec<ModelVendorDefinition>,
    models: Vec<AiModel>,
    provider_routes: Vec<ModelProviderRoute>,
    provider_channel_routes: Vec<ProviderChannelRoute>,
    routing_policies: Vec<RoutingPolicy>,
    routing_rules: Vec<RoutingRule>,
    plans: Vec<PricingPlan>,
    channel_groups: Vec<ChannelGroup>,
    api_keys: Vec<GatewayApiKey>,
    access_policies: Vec<GatewayAccessPolicy>,
    quota_policies: Vec<QuotaPolicy>,
    channel_group_metric_snapshots: Vec<ChannelGroupMetricSnapshot>,
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

    pub fn add_provider_channel_route(&mut self, route: ProviderChannelRoute) {
        self.provider_channel_routes
            .retain(|item| item.channel_id != route.channel_id);
        self.provider_channel_routes.push(route);
    }

    pub fn add_routing_policy(&mut self, policy: RoutingPolicy) {
        self.routing_policies.push(policy);
    }

    pub fn add_routing_rule(&mut self, rule: RoutingRule) {
        self.routing_rules.push(rule);
    }

    pub fn add_plan(&mut self, plan: PricingPlan) {
        self.plans.push(plan);
    }

    pub fn add_channel_group(&mut self, group: ChannelGroup) {
        self.channel_groups.push(group);
    }

    pub fn update_group_rate_multiplier(
        &mut self,
        group_id: i64,
        multiplier: crate::domain::DecimalValue,
    ) {
        if let Some(group) = self
            .channel_groups
            .iter_mut()
            .find(|group| group.id == group_id)
        {
            group.rate_multiplier = multiplier;
        }
    }

    pub fn add_api_key(&mut self, api_key: GatewayApiKey) {
        self.api_keys.retain(|item| item.id != api_key.id);
        self.api_keys.push(api_key);
    }

    pub fn add_access_policy(&mut self, policy: GatewayAccessPolicy) {
        self.access_policies.push(policy);
    }

    pub fn add_quota_policy(&mut self, policy: QuotaPolicy) {
        self.quota_policies.push(policy);
    }

    pub fn add_channel_group_metric_snapshot(&mut self, snapshot: ChannelGroupMetricSnapshot) {
        self.channel_group_metric_snapshots.push(snapshot);
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
            .filter(|route| catalog_key_matches_route_scope(&route.catalog_key, model))
            .cloned()
            .collect()
    }

    fn list_provider_channel_routes(&self) -> Vec<ProviderChannelRoute> {
        self.provider_channel_routes.clone()
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

    fn list_channel_groups(&self) -> Vec<ChannelGroup> {
        self.channel_groups.clone()
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
                catalog_key_matches_price_scope(&price.catalog_key, model)
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
                catalog_key_matches_price_scope(&price.catalog_key, model)
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

    fn find_channel_group(&self, group_id: i64) -> Option<ChannelGroup> {
        self.channel_groups
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

    fn find_latest_channel_group_metric_snapshot(
        &self,
        group_id: i64,
    ) -> Option<ChannelGroupMetricSnapshot> {
        self.channel_group_metric_snapshots
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
        let model = model.trim();
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
            .find(|route| {
                catalog_key_matches_route_scope(&route.catalog_key, model)
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
                catalog_key_matches_price_scope(&price.catalog_key, model)
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

fn catalog_key_matches_route_scope(candidate: &str, model_key: &str) -> bool {
    candidate.trim() == model_key.trim()
}

fn catalog_key_matches_price_scope(candidate: &str, model_key: &str) -> bool {
    candidate.trim() == model_key.trim()
}
