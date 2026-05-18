use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    AppAgentMeteringEvent, AppAgentRunSnapshot, AppAgentRunStepSnapshot, AppAgentSnapshot,
    AppAgentUsageFactMetadata, AppAgentUsageSummary, AppGenerationAgentRunCommand,
};

pub(crate) const DEFAULT_AGENT_ID: &str = "default-generation-agent";
pub(crate) const DEFAULT_AGENT_VERSION_ID: &str = "default-generation-agent-v1";
pub(crate) const DEFAULT_AGENT_NAME: &str = "Generation Agent";
pub(crate) const SOURCE_SURFACE_APP: &str = "app";
pub(crate) const EXECUTION_MODE_GENERATION: &str = "generation";
pub(crate) const RUN_SOURCE_GENERATION_AGENT: &str = "generation-agent";
pub(crate) const BILLING_METER_LLM_INPUT_TOKEN: &str = "llm_input_token";
pub(crate) const METERING_SOURCE_AGENT_RUNTIME: &str = "agent-runtime";
pub(crate) const DEFAULT_AGENT_DESCRIPTION: &str =
    "Default vertical agent for generation workloads";
pub(crate) const DEFAULT_AGENT_SYSTEM_PROMPT: &str =
    "You are a generation agent that plans and meters image, video, audio, music, and sound-effect generation requests.";

pub(crate) fn metadata_json(command: &AppGenerationAgentRunCommand) -> DomainResult<String> {
    serde_json::to_string(&serde_json::json!({
        "source": "generation-agent",
        "agentId": DEFAULT_AGENT_ID,
        "agentVersionId": DEFAULT_AGENT_VERSION_ID,
        "agentName": DEFAULT_AGENT_NAME,
        "runLifecycle": "run-step-event-metering",
        "targetType": command.target_type,
        "selectedModel": command.selected_model,
        "generationConfig": command.generation_config,
        "referenceImages": command.reference_images,
    }))
    .map_err(|error| DomainError::new(error.to_string()))
}

pub(crate) fn default_agent_metadata() -> DomainResult<String> {
    serde_json::to_string(&serde_json::json!({
        "createdBy": "generation-agent-runtime",
        "agentKind": "generation",
        "default": true
    }))
    .map_err(|error| DomainError::new(error.to_string()))
}

pub(crate) fn default_agent_version_metadata() -> DomainResult<String> {
    serde_json::to_string(&serde_json::json!({
        "createdBy": "generation-agent-runtime",
        "agentKind": "generation",
        "versionKind": "default"
    }))
    .map_err(|error| DomainError::new(error.to_string()))
}

pub(crate) fn model_policy_json(model: &str) -> DomainResult<String> {
    let value = if model.trim().is_empty() {
        serde_json::json!({})
    } else {
        serde_json::json!({
            "model": model,
            "selectedModel": model
        })
    };
    serde_json::to_string(&value).map_err(|error| DomainError::new(error.to_string()))
}

pub(crate) fn runtime_policy_json(target_type: &str) -> DomainResult<String> {
    serde_json::to_string(&serde_json::json!({
        "executionMode": EXECUTION_MODE_GENERATION,
        "sourceSurface": SOURCE_SURFACE_APP,
        "targetType": target_type
    }))
    .map_err(|error| DomainError::new(error.to_string()))
}

pub(crate) fn usage_fact_metadata_json(
    run_id: &str,
    command: &AppGenerationAgentRunCommand,
) -> DomainResult<String> {
    let metadata = metering_event(
        run_id,
        "token",
        "0".to_owned(),
        command.subject.user_id.to_string(),
    )
    .usage_fact_metadata;
    serde_json::to_string(&metadata).map_err(|error| DomainError::new(error.to_string()))
}

pub(crate) fn run_metadata_json(
    usage_fact_id: i64,
    command: &AppGenerationAgentRunCommand,
) -> DomainResult<String> {
    serde_json::to_string(&serde_json::json!({
        "agentId": DEFAULT_AGENT_ID,
        "agentVersionId": DEFAULT_AGENT_VERSION_ID,
        "requestId": command.request_id,
        "targetType": command.target_type,
        "meteringSource": METERING_SOURCE_AGENT_RUNTIME,
        "usageFactId": usage_fact_id.to_string()
    }))
    .map_err(|error| DomainError::new(error.to_string()))
}

pub(crate) fn step_metadata_json(
    usage_fact_id: i64,
    command: &AppGenerationAgentRunCommand,
) -> DomainResult<String> {
    serde_json::to_string(&serde_json::json!({
        "agentId": DEFAULT_AGENT_ID,
        "agentVersionId": DEFAULT_AGENT_VERSION_ID,
        "requestId": command.request_id,
        "stepType": "input",
        "meteringSource": METERING_SOURCE_AGENT_RUNTIME,
        "usageFactId": usage_fact_id.to_string()
    }))
    .map_err(|error| DomainError::new(error.to_string()))
}

pub(crate) fn input_snapshot_json(command: &AppGenerationAgentRunCommand) -> DomainResult<String> {
    serde_json::to_string(&serde_json::json!({
        "prompt": command.prompt,
        "targetType": command.target_type,
        "selectedModel": command.selected_model,
        "generationConfig": command.generation_config,
        "referenceImages": command.reference_images
    }))
    .map_err(|error| DomainError::new(error.to_string()))
}

pub(crate) fn agent_snapshot(selected_model: Option<String>) -> AppAgentSnapshot {
    AppAgentSnapshot {
        id: DEFAULT_AGENT_ID.to_owned(),
        version_id: DEFAULT_AGENT_VERSION_ID.to_owned(),
        name: DEFAULT_AGENT_NAME.to_owned(),
        model: selected_model,
    }
}

pub(crate) fn run_snapshot(run_id: &str, request_id: &str) -> AppAgentRunSnapshot {
    AppAgentRunSnapshot {
        id: run_id.to_owned(),
        request_id: request_id.to_owned(),
        source: RUN_SOURCE_GENERATION_AGENT.to_owned(),
        status: "queued".to_owned(),
    }
}

pub(crate) fn input_step(run_id: &str) -> AppAgentRunStepSnapshot {
    AppAgentRunStepSnapshot {
        id: format!("{run_id}-step-input"),
        index: 0,
        step_type: "input".to_owned(),
        status: "succeeded".to_owned(),
        title: "User input accepted".to_owned(),
    }
}

pub(crate) fn usage_summary(run_id: &str, command: &AppGenerationAgentRunCommand) -> AppAgentUsageSummary {
    let prompt_tokens = estimate_prompt_tokens(&command.prompt);
    let image_count = match command.target_type.as_str() {
        "image" | "images" => configured_image_count(&command.generation_config).unwrap_or(1),
        _ => 0,
    };
    let video_seconds = match command.target_type.as_str() {
        "video" => configured_duration_seconds(&command.generation_config)
            .unwrap_or_else(|| estimate_video_seconds(&command.prompt))
            .to_string(),
        _ => "0".to_owned(),
    };
    AppAgentUsageSummary {
        prompt_tokens,
        cached_tokens: 0,
        completion_tokens: 0,
        total_tokens: prompt_tokens,
        image_count,
        video_seconds,
        events: vec![metering_event(
            run_id,
            "token",
            prompt_tokens.to_string(),
            command.subject.user_id.to_string(),
        )],
    }
}

pub(crate) fn metering_event(
    run_id: &str,
    event_type: &str,
    quantity: String,
    user_id: String,
) -> AppAgentMeteringEvent {
    let step_id = format!("{run_id}-step-input");
    AppAgentMeteringEvent {
        event_type: event_type.to_owned(),
        quantity,
        usage_fact_metadata: AppAgentUsageFactMetadata {
            agent_id: DEFAULT_AGENT_ID.to_owned(),
            agent_version_id: DEFAULT_AGENT_VERSION_ID.to_owned(),
            run_id: run_id.to_owned(),
            step_id,
            user_id,
            skill_id: None,
            mcp_server_id: None,
            tool_id: None,
            metering_source: METERING_SOURCE_AGENT_RUNTIME.to_owned(),
        },
    }
}

pub(crate) fn usage_uuid(run_uuid: &str) -> String {
    format!("usage-{run_uuid}")
}

pub(crate) fn catalog_key(model: &str, target_type: &str) -> String {
    let model = model.trim();
    if model.is_empty() {
        format!("generation-agent/{target_type}")
    } else {
        model.to_owned()
    }
}

pub(crate) fn config_hash(parts: &[&str]) -> String {
    let mut hash = 0xcbf29ce484222325u64;
    for part in parts {
        for byte in part.as_bytes() {
            hash ^= u64::from(*byte);
            hash = hash.wrapping_mul(0x100000001b3);
        }
    }
    format!("{hash:016x}")
}

pub(crate) fn modality_code(value: &str) -> DomainResult<i32> {
    match value {
        "image" | "images" => Ok(2),
        "video" => Ok(3),
        "audio" => Ok(4),
        "music" => Ok(5),
        "sfx" => Ok(6),
        value => Err(DomainError::new(format!(
            "unsupported generation agent target type: {value}"
        ))),
    }
}

pub(crate) fn history_date(value: &str) -> String {
    value.get(0..10).unwrap_or(value).to_owned()
}

pub(crate) fn timestamp_to_iso8601(value: &str) -> String {
    if value.contains('T') {
        value.to_owned()
    } else {
        format!("{}Z", value.replace(' ', "T"))
    }
}

pub(crate) fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::ports::AppGenerationHistorySubject;
    use serde_json::Value;

    fn sample_command(target_type: &str, selected_model: Option<&str>, generation_config: Value) -> AppGenerationAgentRunCommand {
        AppGenerationAgentRunCommand {
            subject: AppGenerationHistorySubject {
                tenant_id: 1,
                organization_id: 2,
                user_id: 3,
            },
            run_uuid: "run-001".to_owned(),
            request_id: "request-001".to_owned(),
            prompt: "Create a launch asset".to_owned(),
            target_type: target_type.to_owned(),
            selected_model: selected_model.map(str::to_owned),
            generation_config,
            reference_images: Vec::new(),
            requested_at: "2026-05-17 08:00:00".to_owned(),
        }
    }

    #[test]
    fn runtime_snapshots_keep_generation_agent_source_and_app_surface_separate() {
        let command = sample_command(
            "video",
            Some("gpt-video-1"),
            serde_json::json!({
                "durationSeconds": 12
            }),
        );

        let metadata: Value = serde_json::from_str(&metadata_json(&command).unwrap()).unwrap();
        let runtime_policy: Value =
            serde_json::from_str(&runtime_policy_json(&command.target_type).unwrap()).unwrap();
        let usage = usage_summary(&command.run_uuid, &command);

        assert_eq!("generation-agent", metadata["source"]);
        assert_eq!("app", runtime_policy["sourceSurface"]);
        assert_eq!("generation", runtime_policy["executionMode"]);
        assert_eq!("generation-agent", run_snapshot("run-001", "request-001").source);
        assert_eq!(
            "agent-runtime",
            usage.events[0].usage_fact_metadata.metering_source
        );
        assert_eq!("run-001-step-input", usage.events[0].usage_fact_metadata.step_id);
    }

    #[test]
    fn runtime_usage_and_catalog_helpers_follow_generation_targets() {
        let image_command = sample_command("image", None, serde_json::json!({}));
        let image_usage = usage_summary(&image_command.run_uuid, &image_command);
        let video_command = sample_command(
            "video",
            Some("gpt-video-1"),
            serde_json::json!({
                "durationSeconds": 24
            }),
        );
        let video_usage = usage_summary(&video_command.run_uuid, &video_command);

        assert_eq!(1, image_usage.image_count);
        assert_eq!("0", image_usage.video_seconds);
        assert_eq!(24, video_usage.video_seconds.parse::<i64>().unwrap());
        assert_eq!("generation-agent/video", catalog_key("", "video"));
        assert_eq!("gpt-video-1", catalog_key("gpt-video-1", "video"));
        assert_eq!("usage-run-001", usage_uuid("run-001"));
        assert_eq!("2026-05-17", history_date("2026-05-17 08:00:00"));
        assert_eq!(
            "2026-05-17T08:00:00Z",
            timestamp_to_iso8601("2026-05-17 08:00:00")
        );
        assert_eq!(2, modality_code("images").unwrap());
        assert!(modality_code("bogus").is_err());
    }

    #[test]
    fn runtime_metadata_helpers_keep_user_and_usage_fact_links_consistent() {
        let command = sample_command(
            "image",
            Some("gpt-image-1"),
            serde_json::json!({
                "imageCount": 3
            }),
        );

        let usage_fact_metadata: Value =
            serde_json::from_str(&usage_fact_metadata_json("run-001", &command).unwrap()).unwrap();
        let run_metadata: Value =
            serde_json::from_str(&run_metadata_json(42, &command).unwrap()).unwrap();
        let step_metadata: Value =
            serde_json::from_str(&step_metadata_json(42, &command).unwrap()).unwrap();
        let input_snapshot: Value =
            serde_json::from_str(&input_snapshot_json(&command).unwrap()).unwrap();

        assert_eq!("default-generation-agent", usage_fact_metadata["agentId"]);
        assert_eq!("default-generation-agent-v1", usage_fact_metadata["agentVersionId"]);
        assert_eq!("run-001", usage_fact_metadata["runId"]);
        assert_eq!("run-001-step-input", usage_fact_metadata["stepId"]);
        assert_eq!("3", usage_fact_metadata["userId"]);
        assert_eq!("agent-runtime", usage_fact_metadata["meteringSource"]);

        assert_eq!("default-generation-agent", run_metadata["agentId"]);
        assert_eq!("default-generation-agent-v1", run_metadata["agentVersionId"]);
        assert_eq!("request-001", run_metadata["requestId"]);
        assert_eq!("image", run_metadata["targetType"]);
        assert_eq!("agent-runtime", run_metadata["meteringSource"]);
        assert_eq!("42", run_metadata["usageFactId"]);

        assert_eq!("default-generation-agent", step_metadata["agentId"]);
        assert_eq!("default-generation-agent-v1", step_metadata["agentVersionId"]);
        assert_eq!("request-001", step_metadata["requestId"]);
        assert_eq!("input", step_metadata["stepType"]);
        assert_eq!("agent-runtime", step_metadata["meteringSource"]);
        assert_eq!("42", step_metadata["usageFactId"]);

        assert_eq!("Create a launch asset", input_snapshot["prompt"]);
        assert_eq!("image", input_snapshot["targetType"]);
        assert_eq!("gpt-image-1", input_snapshot["selectedModel"]);
        assert_eq!(3, input_snapshot["generationConfig"]["imageCount"]);
    }
}

fn configured_image_count(config: &serde_json::Value) -> Option<i64> {
    config
        .get("imageCount")?
        .as_i64()
        .filter(|value| *value > 0)
}

fn configured_duration_seconds(config: &serde_json::Value) -> Option<i64> {
    config
        .get("durationSeconds")?
        .as_i64()
        .filter(|value| *value > 0)
}

fn estimate_prompt_tokens(prompt: &str) -> i64 {
    let chars = prompt.chars().count() as i64;
    if chars == 0 {
        0
    } else {
        ((chars + 3) / 4).max(1)
    }
}

fn estimate_video_seconds(prompt: &str) -> i64 {
    let mut current = String::new();
    for character in prompt.chars() {
        if character.is_ascii_digit() {
            current.push(character);
            continue;
        }
        if !current.is_empty() {
            let suffix = prompt
                .split_once(&current)
                .map(|(_, rest)| rest.trim_start().to_ascii_lowercase())
                .unwrap_or_default();
            if suffix.starts_with("second")
                || suffix.starts_with("sec")
                || suffix.starts_with('s')
                || suffix.starts_with('\u{79d2}')
            {
                return current.parse::<i64>().unwrap_or(0).max(0);
            }
            current.clear();
        }
    }
    0
}
