use std::sync::Arc;

use axum::extract::{Path, Query, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::Deserialize;

use crate::api::response::PlusApiResult;
use crate::ports::{
    AppStoreItem, AppStoreItems, AppStoreQuery, AppStoreReadFuture, AppStoreReadStore,
    AppStoreSubject,
};

const MAX_CATALOG_PAGE_SIZE: i64 = 100;
const MAX_CATALOG_TEXT_LEN: usize = 128;
const MAX_CATALOG_TIME_LEN: usize = 64;

#[derive(Clone)]
struct AppStoreState {
    read_store: Arc<dyn AppStoreReadStore + Send + Sync>,
    require_subject: bool,
}

#[derive(Debug, Deserialize)]
struct AppStoreCatalogQuery {
    q: Option<String>,
    page: Option<i64>,
    page_size: Option<i64>,
    status: Option<String>,
    start_time: Option<String>,
    end_time: Option<String>,
}

struct EmptyAppStoreReadStore;

impl AppStoreReadStore for EmptyAppStoreReadStore {
    fn load_apps<'a>(
        &'a self,
        _query: AppStoreQuery,
        _subject: Option<AppStoreSubject>,
    ) -> AppStoreReadFuture<'a, Vec<AppStoreItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn load_app_by_id<'a>(
        &'a self,
        _app_id: String,
        _subject: Option<AppStoreSubject>,
    ) -> AppStoreReadFuture<'a, Option<AppStoreItem>> {
        Box::pin(async { Ok(None) })
    }

    fn load_categories<'a>(
        &'a self,
        _subject: Option<AppStoreSubject>,
    ) -> AppStoreReadFuture<'a, Vec<String>> {
        Box::pin(async { Ok(Vec::new()) })
    }
}

pub fn app_store_router() -> Router {
    app_store_router_with_state(Arc::new(EmptyAppStoreReadStore), false)
}

pub fn app_store_router_with_read_store(
    read_store: Arc<dyn AppStoreReadStore + Send + Sync>,
) -> Router {
    app_store_router_with_state(read_store, false)
}

fn app_store_router_with_state(
    read_store: Arc<dyn AppStoreReadStore + Send + Sync>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route("/app/v3/api/platform/apps/store", get(fetch_apps))
        .route(
            "/app/v3/api/platform/apps/store/categories",
            get(fetch_categories),
        )
        .route(
            "/app/v3/api/platform/apps/store/{app_id}",
            get(fetch_app_by_id),
        )
        .with_state(AppStoreState {
            read_store,
            require_subject,
        })
}

async fn fetch_apps(
    State(state): State<AppStoreState>,
    headers: HeaderMap,
    Query(query): Query<AppStoreCatalogQuery>,
) -> Response {
    let subject = match app_store_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = match validate_catalog_query(query) {
        Ok(query) => query,
        Err(message) => return bad_request(message),
    };

    match state.read_store.load_apps(query, subject).await {
        Ok(items) => Json(PlusApiResult::success(AppStoreItems::new(items))).into_response(),
        Err(error) => app_store_read_model_error(error),
    }
}

async fn fetch_app_by_id(
    State(state): State<AppStoreState>,
    Path(app_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    let subject = match app_store_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let app_id = match normalize_path_id(&app_id, "appId") {
        Ok(app_id) => app_id,
        Err(message) => return bad_request(message),
    };

    match state.read_store.load_app_by_id(app_id, subject).await {
        Ok(Some(item)) => Json(PlusApiResult::success(item)).into_response(),
        Ok(None) => not_found("app was not found"),
        Err(error) => app_store_read_model_error(error),
    }
}

async fn fetch_categories(State(state): State<AppStoreState>, headers: HeaderMap) -> Response {
    let subject = match app_store_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state.read_store.load_categories(subject).await {
        Ok(items) => Json(PlusApiResult::success(AppStoreItems::new(items))).into_response(),
        Err(error) => app_store_read_model_error(error),
    }
}

fn validate_catalog_query(query: AppStoreCatalogQuery) -> Result<AppStoreQuery, String> {
    let page_no = validate_optional_positive(query.page, "page")?;
    let page_size = validate_optional_positive(query.page_size, "page_size")?;
    if page_size.unwrap_or(1) > MAX_CATALOG_PAGE_SIZE {
        return Err(format!("page_size must be at most {MAX_CATALOG_PAGE_SIZE}"));
    }

    let start_time = normalize_time_filter(query.start_time, "start_time", false)?;
    let end_time = normalize_time_filter(query.end_time, "end_time", true)?;
    if let (Some(start_time), Some(end_time)) = (&start_time, &end_time) {
        if start_time > end_time {
            return Err("start_time must be earlier than or equal to end_time".to_owned());
        }
    }

    Ok(AppStoreQuery {
        keyword: normalize_query_text(query.q, "q", MAX_CATALOG_TEXT_LEN)?,
        page_no,
        page_size,
        status: normalize_status_filter(query.status)?,
        start_time,
        end_time,
    })
}

fn app_store_subject(
    headers: &HeaderMap,
    require_subject: bool,
) -> Result<Option<AppStoreSubject>, Response> {
    match TrustedRequestSubject::from_headers(headers) {
        Ok(subject) => Ok(Some(AppStoreSubject {
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

fn validate_optional_positive(value: Option<i64>, field: &str) -> Result<Option<i64>, String> {
    match value {
        Some(value) if value <= 0 => Err(format!("{field} must be a positive integer")),
        value => Ok(value),
    }
}

fn normalize_query_text(
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
    Ok(Some(value))
}

fn normalize_status_filter(value: Option<String>) -> Result<Option<String>, String> {
    let Some(value) = normalize_query_text(value, "status", 32)? else {
        return Ok(None);
    };
    match value.as_str() {
        "ACTIVE" => Ok(Some("ACTIVE".to_owned())),
        "INACTIVE" => Ok(Some("INACTIVE".to_owned())),
        _ => Err("status must be ACTIVE or INACTIVE".to_owned()),
    }
}

fn normalize_time_filter(
    value: Option<String>,
    field: &str,
    end_of_day: bool,
) -> Result<Option<String>, String> {
    let Some(value) = normalize_query_text(value, field, MAX_CATALOG_TIME_LEN)? else {
        return Ok(None);
    };
    if contains_timezone_offset(&value) {
        return Err(format!("{field} must use UTC Z or no timezone offset"));
    }
    let normalized = value.trim().trim_end_matches('Z');
    if let Some((date, time)) = normalized
        .split_once('T')
        .or_else(|| normalized.split_once(' '))
    {
        return normalize_datetime_parts(date, time, field);
    }
    if normalized.len() == 10 {
        validate_date(normalized, field)?;
        let suffix = if end_of_day { "23:59:59" } else { "00:00:00" };
        return Ok(Some(format!("{normalized} {suffix}")));
    }
    Err(format!("{field} must be an ISO-8601 date-time"))
}

fn normalize_datetime_parts(date: &str, time: &str, field: &str) -> Result<Option<String>, String> {
    validate_date(date, field)?;
    let time = time.split('.').next().unwrap_or_default();
    validate_time(time, field)?;
    Ok(Some(format!("{date} {time}")))
}

fn contains_timezone_offset(value: &str) -> bool {
    value
        .split_once('T')
        .or_else(|| value.split_once(' '))
        .map(|(_, time)| time.contains('+') || time.contains('-'))
        .unwrap_or(false)
}

fn validate_date(value: &str, field: &str) -> Result<(), String> {
    let bytes = value.as_bytes();
    if bytes.len() != 10 || bytes[4] != b'-' || bytes[7] != b'-' {
        return Err(format!("{field} must be an ISO-8601 date-time"));
    }
    let year = parse_fixed_i32(&bytes[0..4])
        .ok_or_else(|| format!("{field} must be an ISO-8601 date-time"))?;
    let month = parse_fixed_i32(&bytes[5..7])
        .ok_or_else(|| format!("{field} must be an ISO-8601 date-time"))?;
    let day = parse_fixed_i32(&bytes[8..10])
        .ok_or_else(|| format!("{field} must be an ISO-8601 date-time"))?;
    let valid_day = match month {
        1 | 3 | 5 | 7 | 8 | 10 | 12 => (1..=31).contains(&day),
        4 | 6 | 9 | 11 => (1..=30).contains(&day),
        2 if is_leap_year(year) => (1..=29).contains(&day),
        2 => (1..=28).contains(&day),
        _ => false,
    };
    if !valid_day || year < 1970 {
        return Err(format!("{field} must be an ISO-8601 date-time"));
    }
    Ok(())
}

fn validate_time(value: &str, field: &str) -> Result<(), String> {
    let bytes = value.as_bytes();
    if bytes.len() != 8 || bytes[2] != b':' || bytes[5] != b':' {
        return Err(format!("{field} must be an ISO-8601 date-time"));
    }
    let hour = parse_fixed_i32(&bytes[0..2])
        .ok_or_else(|| format!("{field} must be an ISO-8601 date-time"))?;
    let minute = parse_fixed_i32(&bytes[3..5])
        .ok_or_else(|| format!("{field} must be an ISO-8601 date-time"))?;
    let second = parse_fixed_i32(&bytes[6..8])
        .ok_or_else(|| format!("{field} must be an ISO-8601 date-time"))?;
    if (0..=23).contains(&hour) && (0..=59).contains(&minute) && (0..=59).contains(&second) {
        Ok(())
    } else {
        Err(format!("{field} must be an ISO-8601 date-time"))
    }
}

fn parse_fixed_i32(value: &[u8]) -> Option<i32> {
    let mut number = 0;
    for byte in value {
        if !byte.is_ascii_digit() {
            return None;
        }
        number = number * 10 + i32::from(byte - b'0');
    }
    Some(number)
}

fn is_leap_year(year: i32) -> bool {
    (year % 4 == 0 && year % 100 != 0) || year % 400 == 0
}

fn normalize_path_id(value: &str, field: &str) -> Result<String, String> {
    let value = value.trim();
    if value.is_empty() {
        return Err(format!("{field} is required"));
    }
    if value.chars().count() > 128 {
        return Err(format!("{field} must be at most 128 characters"));
    }
    if !value
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_' | b'.' | b':'))
    {
        return Err(format!("{field} contains unsupported characters"));
    }
    Ok(value.to_owned())
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

fn app_store_read_model_error(error: impl std::fmt::Display) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error(
            "5000",
            format!("app store read model is unavailable: {error}"),
        )),
    )
        .into_response()
}
