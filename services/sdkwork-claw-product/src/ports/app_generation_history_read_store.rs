use std::future::Future;
use std::pin::Pin;

use serde::Serialize;

use crate::domain::DomainResult;

pub type AppGenerationHistoryReadFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AppGenerationHistorySubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppGenerationHistoryItems<T> {
    pub items: Vec<T>,
}

impl<T> AppGenerationHistoryItems<T> {
    pub fn new(items: Vec<T>) -> Self {
        Self { items }
    }
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppGenerationMediaItem {
    pub url: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub thumb: Option<String>,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppGenerationHistoryItem {
    pub id: String,
    pub date: String,
    pub prompt: String,
    #[serde(rename = "type")]
    pub item_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub model_info: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub model_catalog_key: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,
    pub images: Vec<String>,
    pub videos: Vec<AppGenerationMediaItem>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub aspect_ratio: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub duration_seconds: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub output_text: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,
}

pub trait AppGenerationHistoryReadStore {
    fn load_generation_history<'a>(
        &'a self,
        subject: Option<AppGenerationHistorySubject>,
    ) -> AppGenerationHistoryReadFuture<'a, Vec<AppGenerationHistoryItem>>;
}
