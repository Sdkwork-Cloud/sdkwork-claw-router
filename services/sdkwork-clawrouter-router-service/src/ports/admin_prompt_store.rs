use std::future::Future;
use std::pin::Pin;

use serde::Serialize;
use serde_json::Value;

use crate::domain::DomainResult;

pub type AdminPromptCommandFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AdminPromptSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub operator_id: i64,
    pub operator_type: i32,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AdminPromptItem {
    pub id: i64,
    pub uuid: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub prompt_key: String,
    pub name: String,
    pub description: Option<String>,
    pub category_id: Option<String>,
    pub category_code: Option<String>,
    pub prompt_type: String,
    pub visibility: String,
    pub owner_user_id: Option<i64>,
    pub latest_version_id: Option<i64>,
    pub published_version_id: Option<i64>,
    pub status: String,
    pub tags: Vec<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AdminPromptVersionItem {
    pub id: i64,
    pub uuid: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub prompt_id: i64,
    pub version_no: String,
    pub title: String,
    pub content: String,
    pub variable_schema: Value,
    pub output_schema: Value,
    pub model_constraints: Value,
    pub safety_policy: Value,
    pub examples_json: Value,
    pub checksum_hash: String,
    pub lifecycle_status: String,
    pub review_status: String,
    pub review_comment: Option<String>,
    pub created_by: i64,
    pub published_at: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AdminPromptBindingItem {
    pub id: i64,
    pub uuid: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub prompt_id: i64,
    pub prompt_version_id: Option<i64>,
    pub owner_type: String,
    pub owner_id: i64,
    pub binding_role: String,
    pub priority: i32,
    pub enabled: bool,
    pub policy_json: Value,
    pub snapshot_json: Value,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ListAdminPromptsQuery {
    pub subject: AdminPromptSubject,
    pub keyword: Option<String>,
    pub prompt_type: Option<String>,
    pub visibility: Option<String>,
    pub status: Option<String>,
    pub category_id: Option<String>,
    pub page_no: i64,
    pub page_size: i64,
    pub offset: i64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CreateAdminPromptCommand {
    pub subject: AdminPromptSubject,
    pub prompt_key: String,
    pub name: String,
    pub description: Option<String>,
    pub category_id: Option<String>,
    pub prompt_type: String,
    pub visibility: String,
    pub tags: Vec<String>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListAdminPromptVersionsQuery {
    pub subject: AdminPromptSubject,
    pub prompt_id: i64,
}

#[derive(Debug, Clone, PartialEq)]
pub struct CreateAdminPromptVersionCommand {
    pub subject: AdminPromptSubject,
    pub prompt_id: i64,
    pub version_no: String,
    pub title: String,
    pub content: String,
    pub variable_schema: Value,
    pub output_schema: Value,
    pub model_constraints: Value,
    pub safety_policy: Value,
    pub examples_json: Value,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct PublishAdminPromptVersionCommand {
    pub subject: AdminPromptSubject,
    pub version_id: i64,
}

#[derive(Debug, Clone, PartialEq)]
pub struct RenderAdminPromptVersionCommand {
    pub subject: AdminPromptSubject,
    pub version_id: i64,
    pub variables: Value,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListAdminPromptBindingsQuery {
    pub subject: AdminPromptSubject,
    pub prompt_id: i64,
}

#[derive(Debug, Clone, PartialEq)]
pub struct CreateAdminPromptBindingCommand {
    pub subject: AdminPromptSubject,
    pub prompt_id: i64,
    pub prompt_version_id: Option<i64>,
    pub owner_type: String,
    pub owner_id: i64,
    pub binding_role: String,
    pub priority: i32,
    pub enabled: bool,
    pub policy_json: Value,
}

#[derive(Debug, Clone, PartialEq)]
pub struct UpdateAdminPromptBindingCommand {
    pub subject: AdminPromptSubject,
    pub binding_id: i64,
    pub prompt_version_id: Option<Option<i64>>,
    pub owner_type: Option<String>,
    pub owner_id: Option<i64>,
    pub binding_role: Option<String>,
    pub priority: Option<i32>,
    pub enabled: Option<bool>,
    pub policy_json: Option<Value>,
}

pub trait AdminPromptStore {
    fn list_prompts<'a>(
        &'a self,
        query: ListAdminPromptsQuery,
    ) -> AdminPromptCommandFuture<'a, Vec<AdminPromptItem>>;

    fn create_prompt<'a>(
        &'a self,
        command: CreateAdminPromptCommand,
    ) -> AdminPromptCommandFuture<'a, AdminPromptItem>;

    fn list_versions<'a>(
        &'a self,
        query: ListAdminPromptVersionsQuery,
    ) -> AdminPromptCommandFuture<'a, Vec<AdminPromptVersionItem>>;

    fn create_version<'a>(
        &'a self,
        command: CreateAdminPromptVersionCommand,
    ) -> AdminPromptCommandFuture<'a, AdminPromptVersionItem>;

    fn publish_version<'a>(
        &'a self,
        command: PublishAdminPromptVersionCommand,
    ) -> AdminPromptCommandFuture<'a, Option<AdminPromptVersionItem>>;

    fn render_version<'a>(
        &'a self,
        command: RenderAdminPromptVersionCommand,
    ) -> AdminPromptCommandFuture<'a, Option<String>>;

    fn list_bindings<'a>(
        &'a self,
        query: ListAdminPromptBindingsQuery,
    ) -> AdminPromptCommandFuture<'a, Vec<AdminPromptBindingItem>>;

    fn create_binding<'a>(
        &'a self,
        command: CreateAdminPromptBindingCommand,
    ) -> AdminPromptCommandFuture<'a, AdminPromptBindingItem>;

    fn update_binding<'a>(
        &'a self,
        command: UpdateAdminPromptBindingCommand,
    ) -> AdminPromptCommandFuture<'a, Option<AdminPromptBindingItem>>;
}
