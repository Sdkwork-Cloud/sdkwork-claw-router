use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::extract::State;
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::post;
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::Deserialize;

use crate::api::response::PlusApiResult;
use crate::application::EntityUuidGenerator;
use crate::domain::DomainError;
use crate::infrastructure::OsApiKeySecretGenerator;
use crate::ports::{
    AppGenerationAgentRunCommand, AppGenerationAgentRunFuture, AppGenerationAgentRunOutcome,
    AppGenerationAgentRunStore, AppGenerationHistorySubject, AppGenerationReferenceImage,
};
use serde_json::{Map, Value};

const MAX_PROMPT_LEN: usize = 4096;
const MAX_MODEL_LEN: usize = 128;
const MAX_REFERENCE_IMAGE_NAME_LEN: usize = 256;
const MAX_REFERENCE_IMAGE_MIME_LEN: usize = 128;
const MAX_REFERENCE_IMAGE_DATA_URL_LEN: usize = 10 * 1024 * 1024;
const MAX_REFERENCE_IMAGE_URL_LEN: usize = 2048;
const MAX_REFERENCE_IMAGE_ASSET_ID_LEN: usize = 128;
const MAX_REFERENCE_IMAGES: usize = 4;

#[derive(Clone)]
struct AppGenerationAgentState {
    store: Arc<dyn AppGenerationAgentRunStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    require_subject: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppGenerationAgentRunRequest {
    prompt: Option<String>,
    target_type: Option<String>,
    selected_model: Option<String>,
    generation_config: Option<Value>,
    reference_images: Option<Vec<AppGenerationReferenceImageRequest>>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppGenerationReferenceImageRequest {
    name: String,
    mime_type: Option<String>,
    size_bytes: Option<i64>,
    data_url: Option<String>,
    url: Option<String>,
    asset_id: Option<String>,
}

struct EmptyAppGenerationAgentRunStore;

impl AppGenerationAgentRunStore for EmptyAppGenerationAgentRunStore {
    fn create_agent_run<'a>(
        &'a self,
        _command: AppGenerationAgentRunCommand,
    ) -> AppGenerationAgentRunFuture<'a, AppGenerationAgentRunOutcome> {
        Box::pin(async {
            Err(DomainError::new(
                "generation agent command store is unavailable without database configuration",
            ))
        })
    }
}

pub fn app_generation_agent_router() -> Router {
    app_generation_agent_router_with_state(
        Arc::new(EmptyAppGenerationAgentRunStore),
        Arc::new(OsApiKeySecretGenerator),
        false,
    )
}

pub fn app_generation_agent_router_with_store(
    store: Arc<dyn AppGenerationAgentRunStore + Send + Sync>,
) -> Router {
    app_generation_agent_router_with_state(store, Arc::new(OsApiKeySecretGenerator), true)
}

pub fn app_generation_agent_router_with_store_and_uuid_generator(
    store: Arc<dyn AppGenerationAgentRunStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    app_generation_agent_router_with_state(store, entity_uuid_generator, true)
}

fn app_generation_agent_router_with_state(
    store: Arc<dyn AppGenerationAgentRunStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route(
            "/app/v3/api/ai/generation/agents/runs",
            post(create_generation_agent_run),
        )
        .with_state(AppGenerationAgentState {
            store,
            entity_uuid_generator,
            require_subject,
        })
}

async fn create_generation_agent_run(
    State(state): State<AppGenerationAgentState>,
    headers: HeaderMap,
    Json(request): Json<AppGenerationAgentRunRequest>,
) -> Response {
    let subject = match resolve_required_generation_agent_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let prompt = match normalize_prompt(request.prompt.as_deref()) {
        Ok(prompt) => prompt,
        Err(message) => return bad_request(message),
    };
    let selected_model = match normalize_selected_model(request.selected_model.as_deref()) {
        Ok(selected_model) => selected_model,
        Err(message) => return bad_request(message),
    };
    let target_type = match normalize_target_type(request.target_type.as_deref(), &prompt) {
        Ok(target_type) => target_type,
        Err(message) => return bad_request(message),
    };
    let generation_config = match normalize_generation_config(request.generation_config) {
        Ok(generation_config) => generation_config,
        Err(message) => return bad_request(message),
    };
    let reference_images = match normalize_reference_images(request.reference_images) {
        Ok(reference_images) => reference_images,
        Err(message) => return bad_request(message),
    };
    let command = match build_generation_agent_run_command(
        state.clone(),
        subject,
        prompt,
        target_type,
        selected_model,
        generation_config,
        reference_images,
    ) {
        Ok(command) => command,
        Err(error) => {
            return generation_agent_system_response("generation agent command is invalid", error)
        }
    };

    match state.store.create_agent_run(command).await {
        Ok(outcome) => Json(PlusApiResult::success(outcome)).into_response(),
        Err(error) => {
            generation_agent_system_response("generation agent command store is unavailable", error)
        }
    }
}

fn resolve_generation_agent_subject(
    state: &AppGenerationAgentState,
    headers: &HeaderMap,
) -> Result<Option<AppGenerationHistorySubject>, Response> {
    match TrustedRequestSubject::from_headers(headers) {
        Ok(subject) => Ok(Some(AppGenerationHistorySubject {
            tenant_id: subject.tenant_id,
            organization_id: subject.organization_id,
            user_id: subject.user_id,
        })),
        Err(error) if state.require_subject => Err((
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error("4010", error.to_string())),
        )
            .into_response()),
        Err(_) => Ok(None),
    }
}

fn resolve_required_generation_agent_subject(
    state: &AppGenerationAgentState,
    headers: &HeaderMap,
) -> Result<AppGenerationHistorySubject, Response> {
    match resolve_generation_agent_subject(state, headers)? {
        Some(subject) => Ok(subject),
        None => Err((
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error(
                "4010",
                "trusted request subject is required for generation agent command",
            )),
        )
            .into_response()),
    }
}

fn normalize_prompt(value: Option<&str>) -> Result<String, String> {
    let prompt = value.unwrap_or_default().trim();
    if prompt.is_empty() {
        return Err("prompt is required".to_owned());
    }
    if prompt.chars().count() > MAX_PROMPT_LEN {
        return Err(format!(
            "prompt must be at most {MAX_PROMPT_LEN} characters"
        ));
    }
    Ok(prompt.to_owned())
}

fn normalize_selected_model(value: Option<&str>) -> Result<Option<String>, String> {
    let Some(value) = value.map(str::trim).filter(|value| !value.is_empty()) else {
        return Ok(None);
    };
    if value.chars().count() > MAX_MODEL_LEN {
        return Err(format!(
            "selectedModel must be at most {MAX_MODEL_LEN} characters"
        ));
    }
    Ok(Some(value.to_owned()))
}

fn normalize_target_type(value: Option<&str>, prompt: &str) -> Result<String, String> {
    let target_type = value
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned)
        .unwrap_or_else(|| classify_generation_target_type(prompt).to_owned());
    match target_type.as_str() {
        "image" | "video" | "music" | "audio" | "sfx" => Ok(target_type),
        _ => Err("targetType must be one of image, video, music, audio, or sfx".to_owned()),
    }
}

fn normalize_generation_config(value: Option<Value>) -> Result<Value, String> {
    let Some(value) = value else {
        return Ok(Value::Object(Map::new()));
    };
    if !value.is_object() {
        return Err("generationConfig must be an object".to_owned());
    }
    Ok(value)
}

fn normalize_reference_images(
    value: Option<Vec<AppGenerationReferenceImageRequest>>,
) -> Result<Vec<AppGenerationReferenceImage>, String> {
    let Some(value) = value else {
        return Ok(Vec::new());
    };
    if value.len() > MAX_REFERENCE_IMAGES {
        return Err(format!(
            "referenceImages must contain at most {MAX_REFERENCE_IMAGES} items"
        ));
    }

    value
        .into_iter()
        .map(|item| {
            let name = item.name.trim();
            if name.is_empty() {
                return Err("referenceImages.name is required".to_owned());
            }
            if name.chars().count() > MAX_REFERENCE_IMAGE_NAME_LEN {
                return Err(format!(
                    "referenceImages.name must be at most {MAX_REFERENCE_IMAGE_NAME_LEN} characters"
                ));
            }
            let mime_type = item
                .mime_type
                .map(|value| value.trim().to_owned())
                .filter(|value| !value.is_empty());
            if mime_type
                .as_deref()
                .is_some_and(|value| value.chars().count() > MAX_REFERENCE_IMAGE_MIME_LEN)
            {
                return Err(format!(
                    "referenceImages.mimeType must be at most {MAX_REFERENCE_IMAGE_MIME_LEN} characters"
                ));
            }
            if item.size_bytes.is_some_and(|value| value < 0) {
                return Err(
                    "referenceImages.sizeBytes must be greater than or equal to 0".to_owned(),
                );
            }
            let data_url = normalize_optional_reference_text(
                item.data_url,
                "referenceImages.dataUrl",
                MAX_REFERENCE_IMAGE_DATA_URL_LEN,
            )?;
            if data_url
                .as_deref()
                .is_some_and(|value| !value.starts_with("data:image/"))
            {
                return Err("referenceImages.dataUrl must be an image data URL".to_owned());
            }
            let url = normalize_optional_reference_text(
                item.url,
                "referenceImages.url",
                MAX_REFERENCE_IMAGE_URL_LEN,
            )?;
            let asset_id = normalize_optional_reference_text(
                item.asset_id,
                "referenceImages.assetId",
                MAX_REFERENCE_IMAGE_ASSET_ID_LEN,
            )?;
            Ok(AppGenerationReferenceImage {
                name: name.to_owned(),
                mime_type,
                size_bytes: item.size_bytes,
                data_url,
                url,
                asset_id,
            })
        })
        .collect()
}

fn normalize_optional_reference_text(
    value: Option<String>,
    field: &str,
    max_len: usize,
) -> Result<Option<String>, String> {
    let Some(value) = value
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
    else {
        return Ok(None);
    };
    if value.chars().count() > max_len {
        return Err(format!("{field} must be at most {max_len} characters"));
    }
    Ok(Some(value))
}

fn build_generation_agent_run_command(
    state: AppGenerationAgentState,
    subject: AppGenerationHistorySubject,
    prompt: String,
    target_type: String,
    selected_model: Option<String>,
    generation_config: Value,
    reference_images: Vec<AppGenerationReferenceImage>,
) -> Result<AppGenerationAgentRunCommand, DomainError> {
    let run_uuid = state.entity_uuid_generator.generate_entity_uuid()?;
    Ok(AppGenerationAgentRunCommand {
        subject,
        request_id: format!("generation-agent-{run_uuid}"),
        run_uuid,
        target_type,
        prompt,
        selected_model,
        generation_config,
        reference_images,
        requested_at: current_timestamp_string(),
    })
}

fn classify_generation_target_type(prompt: &str) -> &'static str {
    let normalized = prompt.to_lowercase();
    if contains_any(
        &normalized,
        &[
            "video",
            "movie",
            "clip",
            "animation",
            "animate",
            "trailer",
            "reel",
            "视频",
            "影片",
            "动画",
            "短片",
        ],
    ) {
        return "video";
    }
    if contains_any(
        &normalized,
        &[
            "music",
            "song",
            "melody",
            "soundtrack",
            "bgm",
            "音乐",
            "歌曲",
            "旋律",
            "配乐",
        ],
    ) {
        return "music";
    }
    if contains_any(
        &normalized,
        &["sound effect", "sfx", "foley", "音效", "环境声", "声音效果"],
    ) {
        return "sfx";
    }
    if contains_any(
        &normalized,
        &[
            "voice",
            "speech",
            "audio",
            "tts",
            "narration",
            "语音",
            "旁白",
            "朗读",
            "音频",
        ],
    ) {
        return "audio";
    }
    "image"
}
fn contains_any(value: &str, candidates: &[&str]) -> bool {
    candidates.iter().any(|candidate| value.contains(candidate))
}

fn bad_request(message: String) -> Response {
    (
        StatusCode::BAD_REQUEST,
        Json(PlusApiResult::error("4001", message)),
    )
        .into_response()
}

fn generation_agent_system_response(context: &str, error: DomainError) -> Response {
    tracing::error!(error = %error, context, "generation agent API failed");
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error("5000", context.to_owned())),
    )
        .into_response()
}

fn current_timestamp_string() -> String {
    let seconds = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0);
    format_unix_timestamp(seconds)
}

fn format_unix_timestamp(seconds: i64) -> String {
    let days = seconds.div_euclid(86_400);
    let seconds_of_day = seconds.rem_euclid(86_400);
    let (year, month, day) = civil_from_days(days);
    let hour = seconds_of_day / 3_600;
    let minute = (seconds_of_day % 3_600) / 60;
    let second = seconds_of_day % 60;
    format!("{year:04}-{month:02}-{day:02} {hour:02}:{minute:02}:{second:02}")
}

fn civil_from_days(days: i64) -> (i64, i64, i64) {
    let days = days + 719_468;
    let era = if days >= 0 { days } else { days - 146_096 } / 146_097;
    let day_of_era = days - era * 146_097;
    let year_of_era =
        (day_of_era - day_of_era / 1_460 + day_of_era / 36_524 - day_of_era / 146_096) / 365;
    let year = year_of_era + era * 400;
    let day_of_year = day_of_era - (365 * year_of_era + year_of_era / 4 - year_of_era / 100);
    let month_prime = (5 * day_of_year + 2) / 153;
    let day = day_of_year - (153 * month_prime + 2) / 5 + 1;
    let month = month_prime + if month_prime < 10 { 3 } else { -9 };
    let year = year + if month <= 2 { 1 } else { 0 };
    (year, month, day)
}
