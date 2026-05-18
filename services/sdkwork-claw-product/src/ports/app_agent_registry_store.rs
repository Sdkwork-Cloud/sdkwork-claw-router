use std::future::Future;
use std::pin::Pin;

use serde::Serialize;
use serde_json::Value;

use crate::domain::DomainResult;

pub type AppAgentRegistryFuture<'a, T> = Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AppAgentRegistrySubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
}

#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct AppAgentRegistryQuery {
    pub keyword: Option<String>,
    pub page_no: Option<i64>,
    pub page_size: Option<i64>,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppAgentItems {
    pub items: Vec<AppAgentItem>,
}

impl AppAgentItems {
    pub fn new(items: Vec<AppAgentItem>) -> Self {
        Self { items }
    }
}

#[derive(Debug, Clone, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppAgentItem {
    pub id: String,
    pub owner_user_id: i64,
    pub code: String,
    pub name: String,
    pub description: String,
    pub visibility: String,
    pub status: String,
    pub avatar_url: Option<String>,
    pub template_source: Option<String>,
    pub created_at: String,
    pub updated_at: String,
    pub default_version: AppAgentVersionItem,
    pub capabilities: AppAgentCapabilities,
}

#[derive(Debug, Clone, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppAgentVersionItem {
    pub id: String,
    pub version_no: i64,
    pub release_status: String,
    pub model: Option<String>,
    pub system_prompt: String,
    pub tool_policy: Value,
    pub memory_policy: Value,
    pub mcp_policy: Value,
    pub skill_policy: Value,
    pub runtime_policy: Value,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppAgentCapabilities {
    pub memory_enabled: bool,
    pub mcp_server_count: i64,
    pub skill_binding_count: i64,
}

#[derive(Debug, Clone, PartialEq)]
pub struct CreateAppAgentCommand {
    pub subject: AppAgentRegistrySubject,
    pub agent_uuid: String,
    pub version_uuid: String,
    pub idempotency_key: String,
    pub request_id: String,
    pub agent_code: String,
    pub name: String,
    pub description: Option<String>,
    pub model: Option<String>,
    pub system_prompt: Option<String>,
    pub tool_policy: Value,
    pub memory_policy: Value,
    pub mcp_policy: Value,
    pub skill_policy: Value,
    pub runtime_policy: Value,
    pub requested_at: String,
}

pub trait AppAgentRegistryStore {
    fn list_agents<'a>(
        &'a self,
        subject: AppAgentRegistrySubject,
        query: AppAgentRegistryQuery,
    ) -> AppAgentRegistryFuture<'a, Vec<AppAgentItem>>;

    fn get_agent<'a>(
        &'a self,
        subject: AppAgentRegistrySubject,
        agent_id: String,
    ) -> AppAgentRegistryFuture<'a, Option<AppAgentItem>>;

    fn create_agent<'a>(
        &'a self,
        command: CreateAppAgentCommand,
    ) -> AppAgentRegistryFuture<'a, AppAgentItem>;
}
