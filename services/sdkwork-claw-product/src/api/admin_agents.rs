use std::sync::Arc;

use axum::extract::{Path, Query, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::Deserialize;
use serde::Serialize;

use crate::api::response::PlusApiResult;
use crate::domain::DomainError;
use crate::ports::{
    AdminAgentStore, AdminAgentSubject, AppAgentItem, GetAdminAgentQuery, ListAdminAgentsQuery,
};

const DEFAULT_PAGE_NO: i64 = 1;
const DEFAULT_PAGE_SIZE: i64 = 50;
const MAX_PAGE_SIZE: i64 = 100;
const MAX_FILTER_LEN: usize = 128;

#[derive(Clone)]
struct AdminAgentState {
    store: Arc<dyn AdminAgentStore + Send + Sync>,
}

#[derive(Debug, Default, Deserialize)]
struct AdminAgentListRequest {
    page: Option<i64>,
    page_size: Option<i64>,
    q: Option<String>,
    owner_user_id: Option<i64>,
    status: Option<String>,
    visibility: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminAgentListResponse {
    items: Vec<AppAgentItem>,
}

pub fn admin_agent_router_with_store(store: Arc<dyn AdminAgentStore + Send + Sync>) -> Router {
    Router::new()
        .route("/backend/v3/api/agents", get(list_agents))
        .route("/backend/v3/api/agents/{agent_id}", get(get_agent))
        .with_state(AdminAgentState { store })
}

async fn list_agents(
    State(state): State<AdminAgentState>,
    headers: HeaderMap,
    Query(request): Query<AdminAgentListRequest>,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = match build_list_query(subject, request) {
        Ok(query) => query,
        Err(message) => return bad_request(message),
    };

    match state.store.list_agents(query).await {
        Ok(items) => Json(PlusApiResult::success(AdminAgentListResponse { items })).into_response(),
        Err(error) => admin_agent_system_response("admin agent read model is unavailable", error),
    }
}

async fn get_agent(
    State(state): State<AdminAgentState>,
    headers: HeaderMap,
    Path(agent_id): Path<String>,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let agent_id = match normalize_path_id(&agent_id, "agentId") {
        Ok(agent_id) => agent_id,
        Err(message) => return bad_request(message),
    };

    match state
        .store
        .get_agent(GetAdminAgentQuery { subject, agent_id })
        .await
    {
        Ok(Some(item)) => Json(PlusApiResult::success(item)).into_response(),
        Ok(None) => (
            StatusCode::NOT_FOUND,
            Json(PlusApiResult::error(
                "4004",
                "agent was not found".to_owned(),
            )),
        )
            .into_response(),
        Err(error) => admin_agent_system_response("admin agent read model is unavailable", error),
    }
}

fn resolve_subject(headers: &HeaderMap) -> Result<AdminAgentSubject, Response> {
    TrustedRequestSubject::from_headers(headers)
        .map(|subject| AdminAgentSubject {
            tenant_id: subject.tenant_id,
            organization_id: subject.organization_id,
            operator_id: subject.operator_id,
            operator_type: subject.operator_type,
        })
        .map_err(|error| {
            (
                StatusCode::UNAUTHORIZED,
                Json(PlusApiResult::error("4010", error.to_string())),
            )
                .into_response()
        })
}

fn build_list_query(
    subject: AdminAgentSubject,
    request: AdminAgentListRequest,
) -> Result<ListAdminAgentsQuery, String> {
    let page_no = request.page.unwrap_or(DEFAULT_PAGE_NO);
    if page_no < 1 {
        return Err("page must be greater than or equal to 1".to_owned());
    }
    let page_size = request.page_size.unwrap_or(DEFAULT_PAGE_SIZE);
    if !(1..=MAX_PAGE_SIZE).contains(&page_size) {
        return Err(format!("page_size must be between 1 and {MAX_PAGE_SIZE}"));
    }
    let owner_user_id = match request.owner_user_id {
        Some(value) if value < 1 => {
            return Err("owner_user_id must be greater than or equal to 1".to_owned())
        }
        value => value,
    };

    Ok(ListAdminAgentsQuery {
        subject,
        keyword: normalize_filter(request.q, "q")?,
        owner_user_id,
        status: normalize_enum_filter(request.status, "status", &["active", "disabled"])?,
        visibility: normalize_enum_filter(
            request.visibility,
            "visibility",
            &["private", "organization", "public"],
        )?,
        page_no,
        page_size,
        offset: (page_no - 1) * page_size,
    })
}

fn normalize_filter(value: Option<String>, field: &str) -> Result<Option<String>, String> {
    let Some(value) = value else {
        return Ok(None);
    };
    let value = value.trim();
    if value.is_empty() {
        return Ok(None);
    }
    if value.chars().count() > MAX_FILTER_LEN || value.chars().any(char::is_control) {
        return Err(format!(
            "{field} must be at most {MAX_FILTER_LEN} characters"
        ));
    }
    Ok(Some(value.to_owned()))
}

fn normalize_enum_filter(
    value: Option<String>,
    field: &str,
    allowed: &[&str],
) -> Result<Option<String>, String> {
    let Some(value) = normalize_filter(value, field)? else {
        return Ok(None);
    };
    let value = value.to_ascii_lowercase();
    if !allowed.contains(&value.as_str()) {
        return Err(format!("{field} is not supported"));
    }
    Ok(Some(value))
}

fn normalize_path_id(value: &str, field: &str) -> Result<String, String> {
    let value = value.trim();
    if value.is_empty() {
        return Err(format!("{field} is required"));
    }
    if value.chars().count() > MAX_FILTER_LEN {
        return Err(format!(
            "{field} must be at most {MAX_FILTER_LEN} characters"
        ));
    }
    if !value
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_' | b'.' | b':'))
    {
        return Err(format!("{field} contains unsupported characters"));
    }
    Ok(value.to_owned())
}

fn bad_request(message: impl Into<String>) -> Response {
    (
        StatusCode::BAD_REQUEST,
        Json(PlusApiResult::error("4001", message.into())),
    )
        .into_response()
}

fn admin_agent_system_response(context: &str, error: DomainError) -> Response {
    tracing::error!(error = %error, context, "admin agent API failed");
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error("5000", context.to_owned())),
    )
        .into_response()
}
