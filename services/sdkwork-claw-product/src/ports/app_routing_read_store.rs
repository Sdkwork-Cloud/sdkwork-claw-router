use std::future::Future;
use std::pin::Pin;

use serde::Serialize;

use crate::domain::DomainResult;

pub type AppRoutingReadFuture<'a, T> = Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AppRoutingSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppRoutingItems<T> {
    pub items: Vec<T>,
}

impl<T> AppRoutingItems<T> {
    pub fn new(items: Vec<T>) -> Self {
        Self { items }
    }
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppRoutingChannelItem {
    pub id: String,
    pub name: String,
    pub vendor: String,
    pub provider: String,
    pub provider_code: String,
    pub protocol: String,
    pub access_type: String,
    pub base_url: String,
    pub api_key: String,
    pub models: Vec<String>,
    pub capabilities: Vec<String>,
    pub is_multimodal: bool,
    pub weight: i64,
    pub status: String,
    pub latency: String,
    pub rpm: i64,
    pub balance: String,
    pub errors: i64,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppRoutingApiKeyItem {
    pub id: String,
    pub name: String,
    pub key: String,
    pub status: String,
    pub total_usage: String,
    pub created_at: String,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppRoutingRequestTraceItem {
    pub id: String,
    pub time: String,
    pub model: String,
    pub channel: String,
    pub status: i64,
    pub duration: String,
    pub tokens: i64,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppRoutingUsageData {
    pub time: String,
    pub requests: i64,
    pub latency: i64,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppRoutingModelStats {
    pub m: String,
    pub req: String,
    pub sr: String,
    pub tok: String,
    pub lat: String,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppRoutingUsageSnapshot {
    pub chart_data: Vec<AppRoutingUsageData>,
    pub model_stats: Vec<AppRoutingModelStats>,
}

pub trait AppRoutingReadStore {
    fn load_routing_channels<'a>(
        &'a self,
        subject: Option<AppRoutingSubject>,
    ) -> AppRoutingReadFuture<'a, Vec<AppRoutingChannelItem>>;

    fn load_routing_api_keys<'a>(
        &'a self,
        subject: Option<AppRoutingSubject>,
    ) -> AppRoutingReadFuture<'a, Vec<AppRoutingApiKeyItem>>;

    fn load_routing_request_traces<'a>(
        &'a self,
        subject: Option<AppRoutingSubject>,
    ) -> AppRoutingReadFuture<'a, Vec<AppRoutingRequestTraceItem>>;

    fn load_routing_usage<'a>(
        &'a self,
        subject: Option<AppRoutingSubject>,
    ) -> AppRoutingReadFuture<'a, AppRoutingUsageSnapshot>;
}
