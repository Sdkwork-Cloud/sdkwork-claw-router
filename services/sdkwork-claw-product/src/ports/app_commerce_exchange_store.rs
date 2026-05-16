use std::future::Future;
use std::pin::Pin;

use serde::Serialize;

use crate::domain::DomainResult;

pub type AppCommerceExchangeReadFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AppCommerceSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AppCommerceExchangeRuleQuery {
    pub subject: Option<AppCommerceSubject>,
    pub source_asset_type: Option<String>,
    pub target_asset_type: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppCommerceExchangeRuleItem {
    pub id: String,
    pub source_asset_type: String,
    pub target_asset_type: String,
    pub rate: String,
    pub status: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppCommercePointsExchangeRateResponse {
    pub source_asset_type: String,
    pub target_asset_type: String,
    pub rate: String,
}

pub trait AppCommerceExchangeReadStore {
    fn list_exchange_rules<'a>(
        &'a self,
        query: AppCommerceExchangeRuleQuery,
    ) -> AppCommerceExchangeReadFuture<'a, Vec<AppCommerceExchangeRuleItem>>;

    fn load_points_exchange_rate<'a>(
        &'a self,
        subject: Option<AppCommerceSubject>,
    ) -> AppCommerceExchangeReadFuture<'a, Option<AppCommerceExchangeRuleItem>>;
}
