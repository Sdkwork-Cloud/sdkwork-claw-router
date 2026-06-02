use std::path::{Component, Path as FsPath, PathBuf};
use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::{Body, Bytes};
use axum::extract::{DefaultBodyLimit, Multipart, Path, Query, State};
use axum::http::{header, HeaderMap, HeaderValue, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use futures_util::stream;
use sdkwork_claw_http::TrustedRequestSubject;
use serde::Deserialize;
use serde::Serialize;
use serde_json::{Map, Value};
use sha2::{Digest, Sha256};
use tokio::fs;
use tokio::io::{AsyncReadExt, AsyncWriteExt};

use crate::api::response::PlusApiResult;
use crate::domain::DomainError;
use crate::ports::{
    CourseApplicationCommandStore, CourseCategoryItem, CourseDetail, CourseItem, CourseOverview,
    CourseOverviewSource, CourseOverviewStats, CourseQuery, CourseReadFuture, CourseReadStore,
    CourseSubject, CreateCourseApplicationCommand,
};

const ENV_COURSE_UPLOAD_ROOT: &str = "SDKWORK_CLAW_COURSE_UPLOAD_ROOT";
const ENV_COURSE_VIDEO_UPLOAD_MAX_BYTES: &str = "SDKWORK_CLAW_COURSE_VIDEO_UPLOAD_MAX_BYTES";
const ENV_COURSE_VIDEO_UPLOAD_BODY_LIMIT_BYTES: &str =
    "SDKWORK_CLAW_COURSE_VIDEO_UPLOAD_BODY_LIMIT_BYTES";
const DEFAULT_COURSE_PAGE_SIZE: i64 = 12;
const MAX_COURSE_PAGE_SIZE: i64 = 240;
const MAX_QUERY_TEXT_LEN: usize = 128;
const MAX_COURSE_APPLICATION_TITLE_LEN: usize = 200;
const MAX_COURSE_APPLICATION_CATEGORY_LEN: usize = 64;
const MAX_COURSE_APPLICATION_DESCRIPTION_LEN: usize = 2000;
const MAX_COURSE_APPLICATION_SOURCE_PROVIDER_LEN: usize = 64;
const MAX_COURSE_APPLICATION_BVID_LEN: usize = 64;
const MAX_COURSE_APPLICATION_VIDEO_LOCATOR_LEN: usize = 1024;
const MAX_COURSE_APPLICATION_CONTACT_NAME_LEN: usize = 128;
const MAX_COURSE_APPLICATION_CONTACT_EMAIL_LEN: usize = 254;
const MAX_COURSE_APPLICATION_NOTES_LEN: usize = 2000;
const DEFAULT_COURSE_VIDEO_UPLOAD_MAX_BYTES: usize = 1024 * 1024 * 1024;
const DEFAULT_COURSE_VIDEO_UPLOAD_BODY_LIMIT_BYTES: usize =
    DEFAULT_COURSE_VIDEO_UPLOAD_MAX_BYTES + 1024 * 1024;
const COURSE_UPLOAD_APPLICATIONS_DIR: &str = "applications";

#[derive(Clone)]
struct AppCourseState {
    read_store: Arc<dyn CourseReadStore + Send + Sync>,
    command_store: Option<Arc<dyn CourseApplicationCommandStore + Send + Sync>>,
    require_subject: bool,
    upload_root: Arc<PathBuf>,
    upload_limits: CourseUploadLimits,
}

#[derive(Debug, Deserialize)]
struct CourseHttpQuery {
    level: Option<i64>,
    category: Option<String>,
    q: Option<String>,
    page: Option<i64>,
    page_size: Option<i64>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct CourseListResponse {
    items: Vec<CourseItem>,
    content: Vec<CourseItem>,
    page: i64,
    size: i64,
    total_elements: i64,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CourseApplicationRequest {
    title: String,
    category: String,
    description: String,
    source_provider: String,
    external_bvid: Option<String>,
    video: Option<Value>,
    contact_name: Option<String>,
    contact_email: Option<String>,
    notes: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct CourseApplicationVideoUploadResponse {
    video: Value,
    file_name: String,
    content_type: String,
    size_bytes: u64,
    sha256: String,
    uploaded_at: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct CourseUploadLimits {
    pub video_upload_max_bytes: usize,
    pub video_upload_body_limit_bytes: usize,
}

struct EmptyCourseReadStore;

impl CourseReadStore for EmptyCourseReadStore {
    fn load_courses<'a>(
        &'a self,
        query: CourseQuery,
        _subject: Option<CourseSubject>,
    ) -> CourseReadFuture<'a, Vec<CourseItem>> {
        Box::pin(async move {
            let _ = query;
            Ok(Vec::new())
        })
    }

    fn load_course_detail<'a>(
        &'a self,
        _course_id: String,
        _subject: Option<CourseSubject>,
    ) -> CourseReadFuture<'a, Option<CourseDetail>> {
        Box::pin(async { Ok(None) })
    }

    fn load_categories<'a>(
        &'a self,
        _subject: Option<CourseSubject>,
    ) -> CourseReadFuture<'a, Vec<CourseCategoryItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn load_overview<'a>(
        &'a self,
        _subject: Option<CourseSubject>,
    ) -> CourseReadFuture<'a, CourseOverview> {
        Box::pin(async {
            Ok(CourseOverview {
                stats: CourseOverviewStats::default(),
                source: live_course_source(),
            })
        })
    }
}

pub fn app_course_router() -> Router {
    app_course_router_with_state(
        Arc::new(EmptyCourseReadStore),
        None,
        false,
        configured_course_upload_root(),
    )
}

pub fn app_course_router_with_read_store(
    read_store: Arc<dyn CourseReadStore + Send + Sync>,
) -> Router {
    app_course_router_with_state(read_store, None, false, configured_course_upload_root())
}

pub fn app_course_router_with_store(
    read_store: Arc<dyn CourseReadStore + Send + Sync>,
    command_store: Arc<dyn CourseApplicationCommandStore + Send + Sync>,
) -> Router {
    app_course_router_with_state(
        read_store,
        Some(command_store),
        false,
        configured_course_upload_root(),
    )
}

pub fn app_course_router_with_store_and_upload_root(
    read_store: Arc<dyn CourseReadStore + Send + Sync>,
    command_store: Arc<dyn CourseApplicationCommandStore + Send + Sync>,
    upload_root: impl Into<PathBuf>,
) -> Router {
    app_course_router_with_state_and_upload_limits(
        read_store,
        Some(command_store),
        false,
        upload_root.into(),
        configured_course_upload_limits(),
    )
}

pub fn app_course_router_with_store_upload_root_and_upload_limits(
    read_store: Arc<dyn CourseReadStore + Send + Sync>,
    command_store: Arc<dyn CourseApplicationCommandStore + Send + Sync>,
    upload_root: impl Into<PathBuf>,
    upload_limits: CourseUploadLimits,
) -> Router {
    app_course_router_with_state_and_upload_limits(
        read_store,
        Some(command_store),
        false,
        upload_root.into(),
        upload_limits,
    )
}

fn app_course_router_with_state(
    read_store: Arc<dyn CourseReadStore + Send + Sync>,
    command_store: Option<Arc<dyn CourseApplicationCommandStore + Send + Sync>>,
    require_subject: bool,
    upload_root: PathBuf,
) -> Router {
    app_course_router_with_state_and_upload_limits(
        read_store,
        command_store,
        require_subject,
        upload_root,
        configured_course_upload_limits(),
    )
}

fn app_course_router_with_state_and_upload_limits(
    read_store: Arc<dyn CourseReadStore + Send + Sync>,
    command_store: Option<Arc<dyn CourseApplicationCommandStore + Send + Sync>>,
    require_subject: bool,
    upload_root: PathBuf,
    upload_limits: CourseUploadLimits,
) -> Router {
    Router::new()
        .route("/app/v3/api/courses", get(fetch_courses))
        .route(
            "/app/v3/api/courses/applications/videos",
            post(upload_course_application_video),
        )
        .route(
            "/app/v3/api/courses/applications",
            post(submit_course_application),
        )
        .route("/app/v3/api/courses/overview", get(fetch_course_overview))
        .route(
            "/app/v3/api/courses/categories",
            get(fetch_course_categories),
        )
        .route("/app/v3/api/courses/{courseId}", get(fetch_course_detail))
        .route(
            "/uploads/courses/{*filePath}",
            get(serve_course_upload_asset),
        )
        .layer(DefaultBodyLimit::max(
            upload_limits.video_upload_body_limit_bytes,
        ))
        .with_state(AppCourseState {
            read_store,
            command_store,
            require_subject,
            upload_root: Arc::new(upload_root),
            upload_limits,
        })
}

async fn fetch_courses(
    State(state): State<AppCourseState>,
    headers: HeaderMap,
    Query(query): Query<CourseHttpQuery>,
) -> Response {
    let subject = match course_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = match validate_course_query(query) {
        Ok(query) => query,
        Err(message) => return bad_request(message),
    };
    let page = query.page.unwrap_or(1);
    let size = query.size.unwrap_or(DEFAULT_COURSE_PAGE_SIZE);
    match state.read_store.load_courses(query, subject).await {
        Ok(items) => Json(PlusApiResult::success(CourseListResponse {
            total_elements: items.len() as i64,
            content: items.clone(),
            items,
            page,
            size,
        }))
        .into_response(),
        Err(error) => course_error("course read model is unavailable", error),
    }
}

async fn fetch_course_categories(
    State(state): State<AppCourseState>,
    headers: HeaderMap,
) -> Response {
    let subject = match course_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match state.read_store.load_categories(subject).await {
        Ok(categories) => Json(PlusApiResult::success(categories)).into_response(),
        Err(error) => course_error("course category read model is unavailable", error),
    }
}

async fn fetch_course_overview(
    State(state): State<AppCourseState>,
    headers: HeaderMap,
) -> Response {
    let subject = match course_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match state.read_store.load_overview(subject).await {
        Ok(overview) => Json(PlusApiResult::success(overview)).into_response(),
        Err(error) => course_error("course overview read model is unavailable", error),
    }
}

async fn fetch_course_detail(
    State(state): State<AppCourseState>,
    Path(course_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    let subject = match course_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let course_id = match normalize_required_text(Some(course_id), "courseId", 64) {
        Ok(course_id) => course_id,
        Err(message) => return bad_request(message),
    };
    match state
        .read_store
        .load_course_detail(course_id, subject)
        .await
    {
        Ok(Some(detail)) => Json(PlusApiResult::success(detail)).into_response(),
        Ok(None) => not_found("course was not found"),
        Err(error) => course_error("course detail read model is unavailable", error),
    }
}

async fn submit_course_application(
    State(state): State<AppCourseState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let request_subject = match course_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let subject = request_subject.unwrap_or_else(public_course_subject);
    let Some(command_store) = state.command_store else {
        return course_error(
            "course application command model is unavailable",
            "command store is not configured",
        );
    };
    let request =
        match parse_json_body::<CourseApplicationRequest>(&body, "course application request") {
            Ok(request) => request,
            Err(message) => return bad_request(message),
        };
    let command = match course_application_command(subject, request) {
        Ok(command) => command,
        Err(message) => return bad_request(message),
    };
    match command_store.create_course_application(command).await {
        Ok(item) => Json(PlusApiResult::success(item)).into_response(),
        Err(error) => course_error("course application command model is unavailable", error),
    }
}

async fn upload_course_application_video(
    State(state): State<AppCourseState>,
    headers: HeaderMap,
    mut multipart: Multipart,
) -> Response {
    if let Err(response) = course_subject(&headers, state.require_subject) {
        return response;
    }
    loop {
        let field = match multipart.next_field().await {
            Ok(field) => field,
            Err(error) => return bad_request(format!("invalid course video upload body: {error}")),
        };
        let Some(field) = field else {
            return bad_request("file is required".to_owned());
        };
        if field.name() != Some("file") {
            continue;
        }
        return store_course_application_video(state, field).await;
    }
}

async fn store_course_application_video(
    state: AppCourseState,
    mut field: axum::extract::multipart::Field<'_>,
) -> Response {
    let original_file_name = field.file_name().unwrap_or("course-video.mp4").to_owned();
    let content_type = field.content_type().unwrap_or("").to_owned();
    let (extension, content_type) =
        match validate_course_video_upload_metadata(&original_file_name, &content_type) {
            Ok(metadata) => metadata,
            Err(message) => return bad_request(message),
        };
    let upload_dir = state.upload_root.join(COURSE_UPLOAD_APPLICATIONS_DIR);
    if let Err(error) = fs::create_dir_all(&upload_dir).await {
        return course_error("course video upload directory is unavailable", error);
    }
    let temp_file_name = format!(
        "course-application-video-{}-{}.tmp",
        current_millis(),
        sanitize_file_stem(&original_file_name)
    );
    let temp_path = upload_dir.join(temp_file_name);
    let mut file = match fs::File::create(&temp_path).await {
        Ok(file) => file,
        Err(error) => return course_error("course video upload file is unavailable", error),
    };
    let mut hasher = Sha256::new();
    let mut size_bytes = 0usize;
    loop {
        let chunk = match field.chunk().await {
            Ok(chunk) => chunk,
            Err(error) => {
                remove_file_quietly(&temp_path).await;
                return bad_request(format!("invalid course video upload chunk: {error}"));
            }
        };
        let Some(chunk) = chunk else {
            break;
        };
        size_bytes = match size_bytes.checked_add(chunk.len()) {
            Some(size_bytes) => size_bytes,
            None => {
                remove_file_quietly(&temp_path).await;
                return bad_request("file is too large".to_owned());
            }
        };
        if size_bytes > state.upload_limits.video_upload_max_bytes {
            remove_file_quietly(&temp_path).await;
            return bad_request(format!(
                "file must be at most {} bytes",
                state.upload_limits.video_upload_max_bytes
            ));
        }
        hasher.update(&chunk);
        if let Err(error) = file.write_all(&chunk).await {
            remove_file_quietly(&temp_path).await;
            return course_error("course video upload write failed", error);
        }
    }
    if size_bytes == 0 {
        remove_file_quietly(&temp_path).await;
        return bad_request("file must not be empty".to_owned());
    }
    if let Err(error) = file.flush().await {
        remove_file_quietly(&temp_path).await;
        return course_error("course video upload flush failed", error);
    }
    drop(file);
    let sha256 = hex::encode(hasher.finalize());
    let safe_stem = sanitize_file_stem(&original_file_name);
    let file_name = format!(
        "course-application-video-{}-{}-{}.{}",
        current_millis(),
        &sha256[..16],
        safe_stem,
        extension
    );
    let final_path = upload_dir.join(&file_name);
    if let Err(error) = fs::rename(&temp_path, &final_path).await {
        remove_file_quietly(&temp_path).await;
        return course_error("course video upload finalize failed", error);
    }
    let video_locator = format!("/uploads/courses/{COURSE_UPLOAD_APPLICATIONS_DIR}/{file_name}");
    Json(PlusApiResult::success(
        CourseApplicationVideoUploadResponse {
            video: upload_video_media_resource(
                &video_locator,
                &file_name,
                &content_type,
                size_bytes as u64,
                &sha256,
            ),
            file_name,
            content_type,
            size_bytes: size_bytes as u64,
            sha256,
            uploaded_at: current_timestamp_string(),
        },
    ))
    .into_response()
}

async fn serve_course_upload_asset(
    State(state): State<AppCourseState>,
    Path(file_path): Path<String>,
) -> Response {
    let asset_path = match resolve_course_upload_path(&state.upload_root, &file_path) {
        Ok(asset_path) => asset_path,
        Err(message) => return bad_request(message),
    };
    let content_type = match course_video_content_type_for_path(&asset_path) {
        Some(content_type) => content_type,
        None => {
            return bad_request("course upload asset must be a supported video file".to_owned());
        }
    };
    let file = match fs::File::open(&asset_path).await {
        Ok(file) => file,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {
            return not_found("course upload asset was not found");
        }
        Err(error) => return course_error("course upload asset is unavailable", error),
    };
    let stream = stream::try_unfold(file, |mut file| async move {
        let mut buffer = vec![0u8; 64 * 1024];
        let bytes_read = file.read(&mut buffer).await?;
        if bytes_read == 0 {
            return Ok::<Option<(Bytes, fs::File)>, std::io::Error>(None);
        }
        buffer.truncate(bytes_read);
        Ok::<Option<(Bytes, fs::File)>, std::io::Error>(Some((Bytes::from(buffer), file)))
    });
    let mut response = Response::new(Body::from_stream(stream));
    response
        .headers_mut()
        .insert(header::CONTENT_TYPE, HeaderValue::from_static(content_type));
    response.headers_mut().insert(
        header::CACHE_CONTROL,
        HeaderValue::from_static("private, max-age=3600"),
    );
    response
}

fn course_application_command(
    subject: CourseSubject,
    request: CourseApplicationRequest,
) -> Result<CreateCourseApplicationCommand, String> {
    let title = normalize_required_text(
        Some(request.title),
        "title",
        MAX_COURSE_APPLICATION_TITLE_LEN,
    )?;
    let category = normalize_required_text(
        Some(request.category),
        "category",
        MAX_COURSE_APPLICATION_CATEGORY_LEN,
    )?;
    let description = normalize_required_text(
        Some(request.description),
        "description",
        MAX_COURSE_APPLICATION_DESCRIPTION_LEN,
    )?;
    let source_provider = normalize_source_provider(request.source_provider)?;
    let external_bvid =
        normalize_optional_bvid(request.external_bvid, MAX_COURSE_APPLICATION_BVID_LEN)?;
    let video = normalize_optional_media_resource(request.video, "video")?;
    if source_provider == "bilibili" && external_bvid.is_none() {
        return Err("externalBvid is required when sourceProvider is bilibili".to_owned());
    }
    if source_provider == "local" && video.is_none() {
        return Err("video is required when sourceProvider is local".to_owned());
    }
    Ok(CreateCourseApplicationCommand {
        subject,
        uuid: format!("course-application-{}", current_millis()),
        title,
        category,
        description,
        source_provider,
        external_bvid,
        video,
        contact_name: normalize_optional_text(
            request.contact_name,
            "contactName",
            MAX_COURSE_APPLICATION_CONTACT_NAME_LEN,
        )?,
        contact_email: normalize_optional_email(request.contact_email)?,
        notes: normalize_optional_text(request.notes, "notes", MAX_COURSE_APPLICATION_NOTES_LEN)?,
        submitted_at: current_timestamp_string(),
    })
}

fn validate_course_query(query: CourseHttpQuery) -> Result<CourseQuery, String> {
    let page = validate_optional_positive(query.page, "page")?.unwrap_or(1);
    let size = validate_optional_positive(query.page_size, "page_size")?
        .unwrap_or(DEFAULT_COURSE_PAGE_SIZE);
    if size > MAX_COURSE_PAGE_SIZE {
        return Err(format!("page_size must be at most {MAX_COURSE_PAGE_SIZE}"));
    }
    let level = match query.level {
        Some(level) if !(1..=3).contains(&level) => {
            return Err("level must be 1, 2, or 3".to_owned());
        }
        value => value,
    };
    Ok(CourseQuery {
        level,
        category: normalize_optional_text(query.category, "category", 64)?,
        keyword: normalize_optional_text(query.q, "q", MAX_QUERY_TEXT_LEN)?,
        page: Some(page),
        size: Some(size),
    })
}

fn course_subject(
    headers: &HeaderMap,
    require_subject: bool,
) -> Result<Option<CourseSubject>, Response> {
    match TrustedRequestSubject::from_headers(headers) {
        Ok(subject) => Ok(Some(CourseSubject {
            tenant_id: subject.tenant_id,
            organization_id: subject.organization_id,
            user_id: subject.user_id,
        })),
        Err(error) if require_subject => Err((
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error("4010", error.to_string())),
        )
            .into_response()),
        Err(_) => Ok(None),
    }
}

fn public_course_subject() -> CourseSubject {
    CourseSubject {
        tenant_id: 0,
        organization_id: 0,
        user_id: 0,
    }
}

fn parse_json_body<T>(body: &[u8], name: &str) -> Result<T, String>
where
    T: for<'de> Deserialize<'de>,
{
    if body.is_empty() {
        return Err(format!("{name} body is required"));
    }
    serde_json::from_slice::<T>(body).map_err(|error| format!("invalid {name} body: {error}"))
}

fn validate_optional_positive(value: Option<i64>, field: &str) -> Result<Option<i64>, String> {
    match value {
        Some(value) if value <= 0 => Err(format!("{field} must be a positive integer")),
        value => Ok(value),
    }
}

fn normalize_required_text(
    value: Option<String>,
    field: &str,
    max_len: usize,
) -> Result<String, String> {
    normalize_optional_text(value, field, max_len)?.ok_or_else(|| format!("{field} is required"))
}

fn normalize_optional_text(
    value: Option<String>,
    field: &str,
    max_len: usize,
) -> Result<Option<String>, String> {
    let Some(value) = value else {
        return Ok(None);
    };
    let value = value.split_whitespace().collect::<Vec<_>>().join(" ");
    if value.is_empty() {
        return Ok(None);
    }
    if value.chars().count() > max_len {
        return Err(format!("{field} must be at most {max_len} characters"));
    }
    if value.chars().any(char::is_control) {
        return Err(format!("{field} must not contain control characters"));
    }
    Ok(Some(value))
}

fn normalize_source_provider(value: String) -> Result<String, String> {
    let value = normalize_required_text(
        Some(value),
        "sourceProvider",
        MAX_COURSE_APPLICATION_SOURCE_PROVIDER_LEN,
    )?
    .to_ascii_lowercase();
    match value.as_str() {
        "bilibili" | "local" => Ok(value),
        _ => Err("sourceProvider must be bilibili or local".to_owned()),
    }
}

fn normalize_optional_bvid(
    value: Option<String>,
    max_len: usize,
) -> Result<Option<String>, String> {
    let Some(value) = normalize_optional_text(value, "externalBvid", max_len)? else {
        return Ok(None);
    };
    let valid = value.len() >= 10
        && value.len() <= max_len
        && value
            .chars()
            .all(|character| character.is_ascii_alphanumeric());
    if !valid {
        return Err("externalBvid must be a valid Bilibili BV id".to_owned());
    }
    Ok(Some(value))
}

fn normalize_optional_media_resource(
    value: Option<Value>,
    field: &str,
) -> Result<Option<Value>, String> {
    let Some(value) = value else {
        return Ok(None);
    };
    if value.is_null() {
        return Ok(None);
    }
    normalize_media_resource(value, field).map(Some)
}

fn normalize_media_resource(value: Value, field: &str) -> Result<Value, String> {
    let mut object = value
        .as_object()
        .cloned()
        .ok_or_else(|| format!("{field} must be a MediaResource object"))?;
    let kind = media_resource_required_text(field, &object, "kind")?;
    let source = media_resource_required_text(field, &object, "source")?;
    object.insert("kind".to_owned(), Value::String(kind));
    object.insert("source".to_owned(), Value::String(source));

    let mut has_locator = false;
    for key in ["id", "publicUrl", "url", "uri", "objectKey", "objectBlobId"] {
        if let Some(value) = object.get_mut(key) {
            let Some(text) = value.as_str() else {
                return Err(format!("{field}.{key} must be a string"));
            };
            let normalized = normalize_optional_text(
                Some(text.to_owned()),
                &format!("{field}.{key}"),
                MAX_COURSE_APPLICATION_VIDEO_LOCATOR_LEN,
            )?;
            if let Some(normalized) = normalized {
                has_locator = true;
                *value = Value::String(normalized);
            } else {
                *value = Value::String(String::new());
            }
        }
    }
    if !has_locator {
        return Err(format!("{field} must include a media resource locator"));
    }

    Ok(Value::Object(object))
}

fn media_resource_required_text(
    field: &str,
    object: &Map<String, Value>,
    key: &str,
) -> Result<String, String> {
    let value = object.get(key).and_then(Value::as_str).map(str::to_owned);
    normalize_required_text(
        value,
        &format!("{field}.{key}"),
        MAX_COURSE_APPLICATION_VIDEO_LOCATOR_LEN,
    )
}

fn upload_video_media_resource(
    url: &str,
    file_name: &str,
    content_type: &str,
    size_bytes: u64,
    sha256: &str,
) -> Value {
    serde_json::json!({
        "kind": "video",
        "source": "external_url",
        "url": url,
        "publicUrl": url,
        "fileName": file_name,
        "mimeType": content_type,
        "sizeBytes": size_bytes.to_string(),
        "checksum": {
            "algorithm": "sha256",
            "value": sha256
        }
    })
}

fn normalize_optional_email(value: Option<String>) -> Result<Option<String>, String> {
    let Some(value) = normalize_optional_text(
        value,
        "contactEmail",
        MAX_COURSE_APPLICATION_CONTACT_EMAIL_LEN,
    )?
    else {
        return Ok(None);
    };
    if value.contains('@') && !value.contains('/') {
        return Ok(Some(value));
    }
    Err("contactEmail must be a valid email address".to_owned())
}

pub fn configured_course_upload_root() -> PathBuf {
    let runtime_toml = sdkwork_claw_config::RuntimeTomlConfig::from_env_config_file()
        .ok()
        .flatten();
    sdkwork_claw_config::runtime::config_value(
        ENV_COURSE_UPLOAD_ROOT,
        runtime_toml
            .as_ref()
            .and_then(|config| config.paths.course_upload_root.as_deref()),
    )
    .and_then(|value| {
        normalize_optional_text(Some(value), ENV_COURSE_UPLOAD_ROOT, 1024)
            .ok()
            .flatten()
    })
    .map(PathBuf::from)
    .unwrap_or_else(default_course_upload_root)
}

pub fn configured_course_upload_limits() -> CourseUploadLimits {
    let runtime_toml = sdkwork_claw_config::RuntimeTomlConfig::from_env_config_file()
        .ok()
        .flatten();
    let default_limits = CourseUploadLimits::default();
    let video_upload_max_bytes = configured_usize(
        ENV_COURSE_VIDEO_UPLOAD_MAX_BYTES,
        runtime_toml
            .as_ref()
            .and_then(|config| config.courses.video_upload_max_bytes),
        default_limits.video_upload_max_bytes,
    );
    let configured_body_limit = configured_usize(
        ENV_COURSE_VIDEO_UPLOAD_BODY_LIMIT_BYTES,
        runtime_toml
            .as_ref()
            .and_then(|config| config.courses.video_upload_body_limit_bytes),
        default_limits.video_upload_body_limit_bytes,
    );
    CourseUploadLimits {
        video_upload_max_bytes,
        video_upload_body_limit_bytes: configured_body_limit.max(video_upload_max_bytes),
    }
}

impl Default for CourseUploadLimits {
    fn default() -> Self {
        Self {
            video_upload_max_bytes: DEFAULT_COURSE_VIDEO_UPLOAD_MAX_BYTES,
            video_upload_body_limit_bytes: DEFAULT_COURSE_VIDEO_UPLOAD_BODY_LIMIT_BYTES,
        }
    }
}

fn default_course_upload_root() -> PathBuf {
    PathBuf::from("uploads").join("courses")
}

fn configured_usize(name: &str, config_value: Option<u64>, default_value: usize) -> usize {
    sdkwork_claw_config::runtime::env_optional(name)
        .and_then(|value| value.parse::<u64>().ok())
        .or(config_value)
        .and_then(|value| usize::try_from(value).ok())
        .filter(|value| *value > 0)
        .unwrap_or(default_value)
}

fn validate_course_video_upload_metadata(
    file_name: &str,
    content_type: &str,
) -> Result<(String, String), String> {
    let extension = FsPath::new(file_name)
        .extension()
        .and_then(|extension| extension.to_str())
        .map(|extension| extension.trim().to_ascii_lowercase())
        .ok_or_else(|| "file extension is required".to_owned())?;
    if !matches!(extension.as_str(), "mp4" | "webm" | "mov" | "m4v") {
        return Err("file extension must be .mp4, .webm, .mov, or .m4v".to_owned());
    }
    let normalized_content_type = content_type
        .split(';')
        .next()
        .unwrap_or("")
        .trim()
        .to_ascii_lowercase();
    if !matches!(
        normalized_content_type.as_str(),
        "video/mp4" | "video/webm" | "video/quicktime" | "video/x-m4v"
    ) {
        return Err(
            "file content type must be video/mp4, video/webm, video/quicktime, or video/x-m4v"
                .to_owned(),
        );
    }
    Ok((extension, normalized_content_type))
}

fn sanitize_file_stem(file_name: &str) -> String {
    let stem = FsPath::new(file_name)
        .file_stem()
        .and_then(|stem| stem.to_str())
        .unwrap_or("course-video");
    let mut sanitized = String::with_capacity(stem.len());
    let mut last_was_dash = false;
    for character in stem.chars() {
        let normalized = if character.is_ascii_alphanumeric() {
            Some(character.to_ascii_lowercase())
        } else if matches!(character, '-' | '_' | '.' | ' ') {
            Some('-')
        } else {
            None
        };
        let Some(character) = normalized else {
            continue;
        };
        if character == '-' {
            if last_was_dash {
                continue;
            }
            last_was_dash = true;
        } else {
            last_was_dash = false;
        }
        sanitized.push(character);
    }
    let sanitized = sanitized.trim_matches('-');
    if sanitized.is_empty() {
        "course-video".to_owned()
    } else {
        sanitized.chars().take(80).collect()
    }
}

fn resolve_course_upload_path(upload_root: &FsPath, file_path: &str) -> Result<PathBuf, String> {
    if file_path.is_empty() {
        return Err("course upload asset path is required".to_owned());
    }
    let mut safe_path = PathBuf::new();
    for component in FsPath::new(file_path).components() {
        match component {
            Component::Normal(segment) => safe_path.push(segment),
            Component::CurDir => {}
            _ => {
                return Err(
                    "course upload asset path must stay within /uploads/courses/".to_owned(),
                );
            }
        }
    }
    if safe_path.as_os_str().is_empty() {
        return Err("course upload asset path is required".to_owned());
    }
    Ok(upload_root.join(safe_path))
}

fn course_video_content_type_for_path(path: &FsPath) -> Option<&'static str> {
    match path
        .extension()
        .and_then(|extension| extension.to_str())
        .map(|extension| extension.to_ascii_lowercase())
        .as_deref()
    {
        Some("mp4") => Some("video/mp4"),
        Some("webm") => Some("video/webm"),
        Some("mov") => Some("video/quicktime"),
        Some("m4v") => Some("video/x-m4v"),
        _ => None,
    }
}

async fn remove_file_quietly(path: &FsPath) {
    let _ = fs::remove_file(path).await;
}

fn bad_request(message: String) -> Response {
    (
        StatusCode::BAD_REQUEST,
        Json(PlusApiResult::error("4001", message)),
    )
        .into_response()
}

fn not_found(message: &str) -> Response {
    (
        StatusCode::NOT_FOUND,
        Json(PlusApiResult::error("4004", message)),
    )
        .into_response()
}

fn course_error(context: &str, error: impl std::fmt::Display) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error("5000", format!("{context}: {error}"))),
    )
        .into_response()
}

fn live_course_source() -> CourseOverviewSource {
    CourseOverviewSource {
        source_label: "Live course data".to_owned(),
        source_description:
            "Derived from Java-compatible course, category, comment, and reaction tables."
                .to_owned(),
        source_tables: vec![
            "content_course".to_owned(),
            "content_course_section".to_owned(),
            "content_course_lesson".to_owned(),
            "content_course_relation".to_owned(),
            "plus_category".to_owned(),
            "plus_comments".to_owned(),
            "content_reaction".to_owned(),
        ],
        observed_at: current_timestamp_string(),
    }
}

fn current_timestamp_string() -> String {
    let seconds = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0);
    format_unix_timestamp(seconds)
}

fn current_millis() -> u128 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_millis())
        .unwrap_or(0)
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

fn _assert_domain_error_send_sync(error: DomainError) -> DomainError {
    error
}
