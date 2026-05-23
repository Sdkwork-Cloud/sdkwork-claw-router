use std::future::Future;
use std::pin::Pin;

use serde::Serialize;
use serde_json::Value;

use crate::domain::DomainResult;

pub type AppAgentSessionFuture<'a, T> = Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AppAgentSessionSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppAgentSessionList {
    pub items: Vec<AppAgentSessionItem>,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppAgentSessionItem {
    pub id: String,
    pub agent_id: String,
    pub agent_version_id: Option<String>,
    pub title: String,
    pub session_kind: String,
    pub source_surface: String,
    pub status: String,
    pub chat_conversation_id: Option<String>,
    pub memory_space_id: Option<String>,
    pub runtime: Option<String>,
    pub cwd: Option<String>,
    pub sandbox_policy: Option<String>,
    pub approval_policy: Option<String>,
    pub permission_mode: Option<String>,
    pub default_model: Option<String>,
    pub last_run_id: Option<String>,
    pub last_step_id: Option<i64>,
    pub last_active_at: Option<String>,
    pub run_count: i64,
    pub step_count: i64,
    pub tool_call_count: i64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct CreateAppAgentSessionCommand {
    pub subject: AppAgentSessionSubject,
    pub agent_id: String,
    pub agent_version_id: Option<String>,
    pub session_uuid: String,
    pub title: Option<String>,
    pub session_kind: String,
    pub source_surface: String,
    pub chat_conversation_id: Option<String>,
    pub memory_space_id: Option<String>,
    pub runtime: Option<String>,
    pub cwd: Option<String>,
    pub sandbox_policy: Option<String>,
    pub approval_policy: Option<String>,
    pub permission_mode: Option<String>,
    pub default_model: Option<String>,
    pub metadata: Value,
    pub requested_at: String,
}

pub trait AppAgentSessionStore {
    fn list_sessions<'a>(
        &'a self,
        subject: AppAgentSessionSubject,
        agent_id: String,
        page: i64,
        page_size: i64,
    ) -> AppAgentSessionFuture<'a, AppAgentSessionList>;

    fn get_session<'a>(
        &'a self,
        subject: AppAgentSessionSubject,
        session_id: String,
    ) -> AppAgentSessionFuture<'a, Option<AppAgentSessionItem>>;

    fn create_session<'a>(
        &'a self,
        command: CreateAppAgentSessionCommand,
    ) -> AppAgentSessionFuture<'a, AppAgentSessionItem>;
}
