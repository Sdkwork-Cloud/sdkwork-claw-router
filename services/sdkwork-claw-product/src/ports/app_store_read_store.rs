use std::future::Future;
use std::ops::Deref;
use std::pin::Pin;

use serde::Serialize;

use crate::domain::DomainResult;

pub type AppStoreReadFuture<'a, T> = Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AppStoreSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
}

#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct AppStoreQuery {
    pub keyword: Option<String>,
    pub category: Option<String>,
    pub platform_types: Vec<String>,
    pub sort: Option<String>,
    pub page_no: Option<i64>,
    pub page_size: Option<i64>,
    pub status: Option<String>,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppStoreItems<T> {
    pub items: Vec<T>,
    pub total: i64,
    pub page: i64,
    pub page_size: i64,
    pub has_next_page: bool,
}

impl<T> AppStoreItems<T> {
    pub fn new(items: Vec<T>) -> Self {
        let total = items.len() as i64;
        Self {
            items,
            total,
            page: 1,
            page_size: total,
            has_next_page: false,
        }
    }

    pub fn page(items: Vec<T>, total: i64, page: i64, page_size: i64) -> Self {
        let total = total.max(0);
        let page = page.max(1);
        let page_size = page_size.max(1);
        let shown_until = (page - 1)
            .saturating_mul(page_size)
            .saturating_add(items.len() as i64);
        Self {
            items,
            total,
            page,
            page_size,
            has_next_page: shown_until < total,
        }
    }
}

impl<T> Deref for AppStoreItems<T> {
    type Target = [T];

    fn deref(&self) -> &Self::Target {
        &self.items
    }
}

impl<T> IntoIterator for AppStoreItems<T> {
    type Item = T;
    type IntoIter = std::vec::IntoIter<T>;

    fn into_iter(self) -> Self::IntoIter {
        self.items.into_iter()
    }
}

impl<'a, T> IntoIterator for &'a AppStoreItems<T> {
    type Item = &'a T;
    type IntoIter = std::slice::Iter<'a, T>;

    fn into_iter(self) -> Self::IntoIter {
        self.items.iter()
    }
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppStoreItem {
    pub id: String,
    pub name: String,
    pub developer: String,
    pub category: String,
    pub image: String,
    pub rating: f64,
    pub description: String,
    pub downloads: String,
    pub screenshots: Vec<String>,
    pub features: Vec<String>,
    pub releases: Vec<AppStoreReleaseItem>,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppStoreReleaseItem {
    pub id: String,
    pub platform_type: String,
    pub os: String,
    pub version: String,
    pub size: String,
    pub release_date: String,
    pub download_url: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub whats_new: Option<String>,
}

pub trait AppStoreReadStore {
    fn load_apps<'a>(
        &'a self,
        query: AppStoreQuery,
        subject: Option<AppStoreSubject>,
    ) -> AppStoreReadFuture<'a, AppStoreItems<AppStoreItem>>;

    fn load_app_by_id<'a>(
        &'a self,
        app_id: String,
        subject: Option<AppStoreSubject>,
    ) -> AppStoreReadFuture<'a, Option<AppStoreItem>>;

    fn load_categories<'a>(
        &'a self,
        subject: Option<AppStoreSubject>,
    ) -> AppStoreReadFuture<'a, Vec<String>>;
}
