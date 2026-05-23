use std::future::Future;
use std::pin::Pin;

use serde::Serialize;
use serde_json::Value;

use crate::domain::DomainResult;

pub type AppMemoryFuture<'a, T> = Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AppMemorySubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppMemorySpaceList {
    pub items: Vec<AppMemorySpaceItem>,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppMemorySpaceItem {
    pub id: String,
    pub space_type: String,
    pub owner_type: Option<String>,
    pub owner_id: Option<String>,
    pub title: String,
    pub status: String,
    pub memory_enabled: bool,
    pub auto_extract_enabled: bool,
    pub auto_recall_enabled: bool,
    pub review_required: bool,
    pub max_injected_tokens: Option<i64>,
    pub entry_count: i64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppMemoryEntryList {
    pub items: Vec<AppMemoryEntryItem>,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppMemoryEntryItem {
    pub id: String,
    pub space_id: String,
    pub memory_type: String,
    pub subject_type: Option<String>,
    pub subject_key: Option<String>,
    #[serde(rename = "content")]
    pub content: String,
    pub source_kind: String,
    pub source_conversation_id: Option<String>,
    pub source_turn_id: Option<String>,
    pub source_item_id: Option<String>,
    pub source_invocation_id: Option<String>,
    pub importance_score: Option<String>,
    pub confidence_score: Option<String>,
    pub sensitivity_level: String,
    pub trust_level: String,
    pub status: String,
    pub recall_count: i64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct CreateAppMemorySpaceCommand {
    pub subject: AppMemorySubject,
    pub space_uuid: String,
    pub title: String,
    pub space_type: String,
    pub owner_type: Option<String>,
    pub owner_id: Option<String>,
    pub memory_enabled: bool,
    pub auto_extract_enabled: bool,
    pub auto_recall_enabled: bool,
    pub review_required: bool,
    pub max_injected_tokens: Option<i64>,
    pub retention_policy: Value,
    pub sensitivity_policy: Value,
    pub metadata: Value,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct CreateAppMemoryEntryCommand {
    pub subject: AppMemorySubject,
    pub space_id: String,
    pub entry_uuid: String,
    pub event_uuid: String,
    pub memory_type: String,
    pub subject_type: Option<String>,
    pub subject_key: Option<String>,
    pub content_text: String,
    pub content_json: Value,
    pub source_kind: String,
    pub source_conversation_id: Option<String>,
    pub source_turn_id: Option<String>,
    pub source_item_id: Option<String>,
    pub source_invocation_id: Option<String>,
    pub importance_score: Option<String>,
    pub confidence_score: Option<String>,
    pub sensitivity_level: String,
    pub trust_level: String,
    pub status: String,
    pub metadata: Value,
    pub requested_at: String,
}

pub trait AppMemoryStore {
    fn list_spaces<'a>(
        &'a self,
        subject: AppMemorySubject,
        page: i64,
        page_size: i64,
    ) -> AppMemoryFuture<'a, AppMemorySpaceList>;

    fn get_space<'a>(
        &'a self,
        subject: AppMemorySubject,
        space_id: String,
    ) -> AppMemoryFuture<'a, Option<AppMemorySpaceItem>>;

    fn create_space<'a>(
        &'a self,
        command: CreateAppMemorySpaceCommand,
    ) -> AppMemoryFuture<'a, AppMemorySpaceItem>;

    fn list_entries<'a>(
        &'a self,
        subject: AppMemorySubject,
        space_id: String,
        page: i64,
        page_size: i64,
    ) -> AppMemoryFuture<'a, AppMemoryEntryList>;

    fn get_entry<'a>(
        &'a self,
        subject: AppMemorySubject,
        entry_id: String,
    ) -> AppMemoryFuture<'a, Option<AppMemoryEntryItem>>;

    fn create_entry<'a>(
        &'a self,
        command: CreateAppMemoryEntryCommand,
    ) -> AppMemoryFuture<'a, AppMemoryEntryItem>;
}
