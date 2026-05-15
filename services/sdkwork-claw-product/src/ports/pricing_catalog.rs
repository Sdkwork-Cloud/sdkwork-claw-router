use crate::domain::{
    AiModel, ApiKeyGroup, ApiKeyGroupMetricSnapshot, BillingMeter, GatewayAccessPolicy,
    GatewayApiKey, ModelPrice, ModelProviderRoute, ModelVendorDefinition, PriceSide, PricingPlan,
    ProviderAccountPoolRoute, QuotaPolicy, RoutingPolicy, RoutingRule,
};

pub trait PricingCatalog {
    fn list_models(&self, vendor_code: Option<&str>) -> Vec<AiModel>;
    fn list_provider_routes(&self, model: &str) -> Vec<ModelProviderRoute>;
    fn list_provider_account_pool_routes(&self) -> Vec<ProviderAccountPoolRoute>;
    fn list_routing_policies(&self) -> Vec<RoutingPolicy>;
    fn list_routing_rules(&self, profile_id: i64) -> Vec<RoutingRule>;
    fn list_api_keys(&self) -> Vec<GatewayApiKey>;
    fn list_api_key_groups(&self) -> Vec<ApiKeyGroup>;
    fn list_model_prices(
        &self,
        model: &str,
        price_side: PriceSide,
        billing_meter: BillingMeter,
    ) -> Vec<ModelPrice>;
    fn list_model_prices_for_side(&self, model: &str, price_side: PriceSide) -> Vec<ModelPrice>;
    fn find_api_key(&self, api_key_id: i64) -> Option<GatewayApiKey>;
    fn find_api_key_by_hash(&self, key_hash: &str) -> Option<GatewayApiKey>;
    fn find_api_key_group(&self, group_id: i64) -> Option<ApiKeyGroup>;
    fn find_access_policy(&self, policy_id: i64) -> Option<GatewayAccessPolicy>;
    fn find_quota_policy(&self, policy_id: i64) -> Option<QuotaPolicy>;
    fn find_latest_api_key_group_metric_snapshot(
        &self,
        group_id: i64,
    ) -> Option<ApiKeyGroupMetricSnapshot>;
    fn find_pricing_plan(&self, plan_code: &str) -> Option<PricingPlan>;
    fn find_model(&self, model: &str) -> Option<AiModel>;
    fn find_vendor(&self, vendor_code: &str) -> Option<ModelVendorDefinition>;
    fn find_provider_route(&self, model: &str, provider_code: &str) -> Option<ModelProviderRoute>;
    fn find_model_price(
        &self,
        model: &str,
        price_side: PriceSide,
        billing_meter: BillingMeter,
        provider_code: Option<&str>,
        pricing_plan_code: Option<&str>,
    ) -> Option<ModelPrice>;
}
