use std::future::Future;
use std::pin::Pin;

use serde::Serialize;
use serde_json::Value;

use crate::domain::DomainResult;

pub type AppAgentRunFuture<'a, T> = Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AppAgentRunSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppAgentRunList {
    pub items: Vec<AppAgentRunItem>,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppAgentRunItem {
    pub id: String,
    pub session_id: Option<String>,
    pub agent_id: String,
    pub agent_version_id: String,
    pub request_id: String,
    pub trace_id: Option<String>,
    pub status: String,
    pub source_surface: String,
    pub input_message: Option<String>,
    pub output_message: Option<String>,
    pub memory_space_id: Option<String>,
    pub runtime: Option<String>,
    pub model: Option<String>,
    pub execution_mode: String,
    pub started_at: Option<String>,
    pub completed_at: Option<String>,
    pub error_message_masked: Option<String>,
    pub total_steps: i64,
    pub input_tokens: Option<i64>,
    pub output_tokens: Option<i64>,
    pub cached_tokens: Option<i64>,
    pub total_tokens: Option<i64>,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppAgentRunStepList {
    pub items: Vec<AppAgentRunStepItem>,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppAgentRunStepItem {
    pub id: String,
    pub run_id: String,
    pub step_index: i64,
    pub step_type: String,
    pub status: String,
    pub title: Option<String>,
    pub model: Option<String>,
    pub runtime_invocation_id: Option<String>,
    pub tool_name: Option<String>,
    pub input_tokens: Option<i64>,
    pub output_tokens: Option<i64>,
    pub cached_tokens: Option<i64>,
    pub total_tokens: Option<i64>,
    pub started_at: Option<String>,
    pub completed_at: Option<String>,
    pub latency_ms: Option<i64>,
    pub created_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct CreateAppAgentRunCommand {
    pub subject: AppAgentRunSubject,
    pub session_id: String,
    pub run_uuid: String,
    pub agent_id: String,
    pub agent_version_id: String,
    pub request_id: String,
    pub trace_id: Option<String>,
    pub source_surface: String,
    pub input_message: Option<String>,
    pub memory_space_id: Option<String>,
    pub runtime: Option<String>,
    pub model: Option<String>,
    pub execution_mode: String,
    pub metadata: Value,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct CompleteAppAgentRunCommand {
    pub subject: AppAgentRunSubject,
    pub run_id: String,
    pub usage_link_uuid: String,
    pub status: String,
    pub output_message: Option<String>,
    pub error_message_masked: Option<String>,
    pub input_tokens: Option<i64>,
    pub output_tokens: Option<i64>,
    pub cached_tokens: Option<i64>,
    pub reasoning_tokens: Option<i64>,
    pub total_tokens: Option<i64>,
    pub cost_amount: Option<String>,
    pub currency: Option<String>,
    pub usage_fact_id: Option<i64>,
    pub usage_json: Value,
    pub metadata: Value,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct CreateAppAgentRunStepCommand {
    pub subject: AppAgentRunSubject,
    pub run_id: String,
    pub step_uuid: String,
    pub usage_link_uuid: String,
    pub step_type: String,
    pub status: String,
    pub title: Option<String>,
    pub model: Option<String>,
    pub runtime_invocation_id: Option<String>,
    pub tool_name: Option<String>,
    pub input_json: Value,
    pub output_json: Value,
    pub input_tokens: Option<i64>,
    pub output_tokens: Option<i64>,
    pub cached_tokens: Option<i64>,
    pub reasoning_tokens: Option<i64>,
    pub total_tokens: Option<i64>,
    pub cost_amount: Option<String>,
    pub currency: Option<String>,
    pub usage_fact_id: Option<i64>,
    pub usage_json: Value,
    pub metadata: Value,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct CompleteAppAgentRunStepCommand {
    pub subject: AppAgentRunSubject,
    pub run_id: String,
    pub step_id: String,
    pub usage_link_uuid: String,
    pub status: String,
    pub output_json: Value,
    pub error_message_masked: Option<String>,
    pub input_tokens: Option<i64>,
    pub output_tokens: Option<i64>,
    pub cached_tokens: Option<i64>,
    pub reasoning_tokens: Option<i64>,
    pub total_tokens: Option<i64>,
    pub cost_amount: Option<String>,
    pub currency: Option<String>,
    pub usage_fact_id: Option<i64>,
    pub usage_json: Value,
    pub metadata: Value,
    pub requested_at: String,
}

pub trait AppAgentRunStore {
    fn list_runs<'a>(
        &'a self,
        subject: AppAgentRunSubject,
        session_id: String,
        page: i64,
        page_size: i64,
    ) -> AppAgentRunFuture<'a, AppAgentRunList>;

    fn get_run<'a>(
        &'a self,
        subject: AppAgentRunSubject,
        run_id: String,
    ) -> AppAgentRunFuture<'a, Option<AppAgentRunItem>>;

    fn create_run<'a>(
        &'a self,
        command: CreateAppAgentRunCommand,
    ) -> AppAgentRunFuture<'a, AppAgentRunItem>;

    fn complete_run<'a>(
        &'a self,
        command: CompleteAppAgentRunCommand,
    ) -> AppAgentRunFuture<'a, AppAgentRunItem>;

    fn list_steps<'a>(
        &'a self,
        subject: AppAgentRunSubject,
        run_id: String,
        page: i64,
        page_size: i64,
    ) -> AppAgentRunFuture<'a, AppAgentRunStepList>;

    fn create_step<'a>(
        &'a self,
        command: CreateAppAgentRunStepCommand,
    ) -> AppAgentRunFuture<'a, AppAgentRunStepItem>;

    fn complete_step<'a>(
        &'a self,
        command: CompleteAppAgentRunStepCommand,
    ) -> AppAgentRunFuture<'a, AppAgentRunStepItem>;
}
