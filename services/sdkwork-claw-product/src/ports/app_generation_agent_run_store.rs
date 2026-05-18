use std::future::Future;
use std::pin::Pin;

use serde::Serialize;
use serde_json::Value;

use crate::domain::DomainResult;
use crate::ports::{AppGenerationHistoryItem, AppGenerationHistorySubject};

pub type AppGenerationAgentRunFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppGenerationReferenceImage {
    pub name: String,
    pub mime_type: Option<String>,
    pub size_bytes: Option<i64>,
    pub data_url: Option<String>,
    pub url: Option<String>,
    pub asset_id: Option<String>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct AppGenerationAgentRunCommand {
    pub subject: AppGenerationHistorySubject,
    pub run_uuid: String,
    pub request_id: String,
    pub prompt: String,
    pub target_type: String,
    pub selected_model: Option<String>,
    pub generation_config: Value,
    pub reference_images: Vec<AppGenerationReferenceImage>,
    pub requested_at: String,
}

#[derive(Debug, Clone, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppGenerationAgentRunOutcome {
    pub agent: AppAgentSnapshot,
    pub item: AppGenerationHistoryItem,
    pub metering_events: Vec<AppAgentMeteringEvent>,
    pub run: AppAgentRunSnapshot,
    pub steps: Vec<AppAgentRunStepSnapshot>,
    pub target_type: String,
    pub status: String,
    pub usage: AppAgentUsageSummary,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppAgentSnapshot {
    pub id: String,
    pub version_id: String,
    pub name: String,
    pub model: Option<String>,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppAgentRunSnapshot {
    pub id: String,
    pub request_id: String,
    pub source: String,
    pub status: String,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppAgentRunStepSnapshot {
    pub id: String,
    pub index: i32,
    #[serde(rename = "type")]
    pub step_type: String,
    pub status: String,
    pub title: String,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppAgentUsageSummary {
    pub prompt_tokens: i64,
    pub cached_tokens: i64,
    pub completion_tokens: i64,
    pub total_tokens: i64,
    pub image_count: i64,
    pub video_seconds: String,
    pub events: Vec<AppAgentMeteringEvent>,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppAgentMeteringEvent {
    #[serde(rename = "type")]
    pub event_type: String,
    pub quantity: String,
    pub usage_fact_metadata: AppAgentUsageFactMetadata,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppAgentUsageFactMetadata {
    pub agent_id: String,
    pub agent_version_id: String,
    pub run_id: String,
    pub step_id: String,
    pub user_id: String,
    pub skill_id: Option<String>,
    pub mcp_server_id: Option<String>,
    pub tool_id: Option<String>,
    pub metering_source: String,
}

pub trait AppGenerationAgentRunStore {
    fn create_agent_run<'a>(
        &'a self,
        command: AppGenerationAgentRunCommand,
    ) -> AppGenerationAgentRunFuture<'a, AppGenerationAgentRunOutcome>;
}
