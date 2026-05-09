use std::future::Future;
use std::pin::Pin;

use crate::domain::{
    ApiKeyGroup, ApiKeyGroupMetricSnapshot, DomainResult, GatewayAccessPolicy, GatewayApiKey,
    QuotaPolicy,
};
use crate::ports::PricingCatalog;

pub type ApiKeyManagementReadFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct GatewayApiKeyManagementSnapshot {
    pub api_keys: Vec<GatewayApiKey>,
    pub api_key_groups: Vec<ApiKeyGroup>,
    pub access_policies: Vec<GatewayAccessPolicy>,
    pub quota_policies: Vec<QuotaPolicy>,
    pub api_key_group_metric_snapshots: Vec<ApiKeyGroupMetricSnapshot>,
}

impl GatewayApiKeyManagementSnapshot {
    pub fn from_pricing_catalog<C>(catalog: &C) -> Self
    where
        C: PricingCatalog + ?Sized,
    {
        let api_keys = catalog.list_api_keys();
        let api_key_groups = catalog.list_api_key_groups();
        let access_policies = collect_access_policies(catalog, &api_keys);
        let quota_policies = collect_quota_policies(catalog, &api_keys);
        let api_key_group_metric_snapshots =
            collect_api_key_group_metric_snapshots(catalog, &api_key_groups);

        Self {
            api_keys,
            api_key_groups,
            access_policies,
            quota_policies,
            api_key_group_metric_snapshots,
        }
    }

    pub fn find_api_key_group(&self, group_id: i64) -> Option<ApiKeyGroup> {
        self.api_key_groups
            .iter()
            .find(|group| group.id == group_id)
            .cloned()
    }

    pub fn find_access_policy(&self, policy_id: i64) -> Option<GatewayAccessPolicy> {
        self.access_policies
            .iter()
            .find(|policy| policy.id == policy_id)
            .cloned()
    }

    pub fn find_quota_policy(&self, policy_id: i64) -> Option<QuotaPolicy> {
        self.quota_policies
            .iter()
            .find(|policy| policy.id == policy_id)
            .cloned()
    }

    pub fn find_latest_api_key_group_metric_snapshot(
        &self,
        group_id: i64,
    ) -> Option<ApiKeyGroupMetricSnapshot> {
        self.api_key_group_metric_snapshots
            .iter()
            .find(|snapshot| snapshot.group_id == group_id)
            .cloned()
    }

    pub fn for_subject(&self, tenant_id: i64, organization_id: i64, user_id: i64) -> Self {
        let api_keys: Vec<GatewayApiKey> = self
            .api_keys
            .iter()
            .filter(|api_key| {
                api_key.tenant_id == tenant_id
                    && api_key.organization_id == organization_id
                    && api_key.user_id == user_id
            })
            .cloned()
            .collect();
        let access_policies = collect_snapshot_access_policies(self, &api_keys);
        let quota_policies = collect_snapshot_quota_policies(self, &api_keys);

        Self {
            api_keys,
            api_key_groups: self.api_key_groups.clone(),
            access_policies,
            quota_policies,
            api_key_group_metric_snapshots: self.api_key_group_metric_snapshots.clone(),
        }
    }

    pub fn with_created_api_key(
        &self,
        api_key: GatewayApiKey,
        access_policy: Option<GatewayAccessPolicy>,
        quota_policy: Option<QuotaPolicy>,
    ) -> Self {
        let mut snapshot = self.clone();
        snapshot.api_keys.push(api_key);
        if let Some(access_policy) = access_policy {
            snapshot.access_policies.push(access_policy);
        }
        if let Some(quota_policy) = quota_policy {
            snapshot.quota_policies.push(quota_policy);
        }
        snapshot
    }
}

pub trait GatewayApiKeyManagementReadStore {
    fn load_gateway_api_key_management_snapshot<'a>(
        &'a self,
    ) -> ApiKeyManagementReadFuture<'a, GatewayApiKeyManagementSnapshot>;
}

fn collect_access_policies<C>(catalog: &C, api_keys: &[GatewayApiKey]) -> Vec<GatewayAccessPolicy>
where
    C: PricingCatalog + ?Sized,
{
    let mut policies = Vec::new();
    for policy_id in api_keys.iter().filter_map(|api_key| api_key.policy_id) {
        if policies
            .iter()
            .any(|policy: &GatewayAccessPolicy| policy.id == policy_id)
        {
            continue;
        }
        if let Some(policy) = catalog.find_access_policy(policy_id) {
            policies.push(policy);
        }
    }
    policies
}

fn collect_quota_policies<C>(catalog: &C, api_keys: &[GatewayApiKey]) -> Vec<QuotaPolicy>
where
    C: PricingCatalog + ?Sized,
{
    let mut policies = Vec::new();
    for policy_id in api_keys
        .iter()
        .filter_map(|api_key| api_key.quota_policy_id)
    {
        if policies
            .iter()
            .any(|policy: &QuotaPolicy| policy.id == policy_id)
        {
            continue;
        }
        if let Some(policy) = catalog.find_quota_policy(policy_id) {
            policies.push(policy);
        }
    }
    policies
}

fn collect_api_key_group_metric_snapshots<C>(
    catalog: &C,
    groups: &[ApiKeyGroup],
) -> Vec<ApiKeyGroupMetricSnapshot>
where
    C: PricingCatalog + ?Sized,
{
    let mut snapshots = Vec::new();
    for group in groups {
        if let Some(snapshot) = catalog.find_latest_api_key_group_metric_snapshot(group.id) {
            snapshots.push(snapshot);
        }
    }
    snapshots
}

fn collect_snapshot_access_policies(
    snapshot: &GatewayApiKeyManagementSnapshot,
    api_keys: &[GatewayApiKey],
) -> Vec<GatewayAccessPolicy> {
    let mut policies = Vec::new();
    for policy_id in api_keys.iter().filter_map(|api_key| api_key.policy_id) {
        if policies
            .iter()
            .any(|policy: &GatewayAccessPolicy| policy.id == policy_id)
        {
            continue;
        }
        if let Some(policy) = snapshot.find_access_policy(policy_id) {
            policies.push(policy);
        }
    }
    policies
}

fn collect_snapshot_quota_policies(
    snapshot: &GatewayApiKeyManagementSnapshot,
    api_keys: &[GatewayApiKey],
) -> Vec<QuotaPolicy> {
    let mut policies = Vec::new();
    for policy_id in api_keys
        .iter()
        .filter_map(|api_key| api_key.quota_policy_id)
    {
        if policies
            .iter()
            .any(|policy: &QuotaPolicy| policy.id == policy_id)
        {
            continue;
        }
        if let Some(policy) = snapshot.find_quota_policy(policy_id) {
            policies.push(policy);
        }
    }
    policies
}
