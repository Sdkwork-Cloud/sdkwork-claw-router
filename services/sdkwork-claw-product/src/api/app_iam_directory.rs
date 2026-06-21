use std::sync::Arc;

use axum::extract::{Query, State};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;

use crate::api::app_iam_directory_query::AppIamDirectoryHttpQuery;
use crate::api::response::PlusApiResult;
use crate::api::subject::map_optional_app_user_subject;
use crate::ports::{
    AppIamDepartmentAssignmentItem, AppIamDepartmentItem, AppIamDepartmentTreeItem,
    AppIamDirectoryItems, AppIamDirectoryQuery, AppIamDirectoryReadFuture,
    AppIamDirectoryReadStore, AppIamDirectorySubject, AppIamOrganizationItem,
    AppIamOrganizationMembershipItem, AppIamOrganizationTreeItem, AppIamPositionAssignmentItem,
    AppIamPositionItem, AppIamRoleBindingItem,
};

#[derive(Clone)]
struct AppIamDirectoryState {
    read_store: Arc<dyn AppIamDirectoryReadStore + Send + Sync>,
    require_subject: bool,
}

struct EmptyAppIamDirectoryReadStore;

impl AppIamDirectoryReadStore for EmptyAppIamDirectoryReadStore {
    fn list_organizations<'a>(
        &'a self,
        _subject: Option<AppIamDirectorySubject>,
        _query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamOrganizationItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn retrieve_organization_tree<'a>(
        &'a self,
        _subject: Option<AppIamDirectorySubject>,
        _query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamOrganizationTreeItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn list_organization_memberships<'a>(
        &'a self,
        _subject: Option<AppIamDirectorySubject>,
        _query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamOrganizationMembershipItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn list_departments<'a>(
        &'a self,
        _subject: Option<AppIamDirectorySubject>,
        _query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamDepartmentItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn retrieve_department_tree<'a>(
        &'a self,
        _subject: Option<AppIamDirectorySubject>,
        _query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamDepartmentTreeItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn list_department_assignments<'a>(
        &'a self,
        _subject: Option<AppIamDirectorySubject>,
        _query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamDepartmentAssignmentItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn list_positions<'a>(
        &'a self,
        _subject: Option<AppIamDirectorySubject>,
        _query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamPositionItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn list_position_assignments<'a>(
        &'a self,
        _subject: Option<AppIamDirectorySubject>,
        _query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamPositionAssignmentItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn list_role_bindings<'a>(
        &'a self,
        _subject: Option<AppIamDirectorySubject>,
        _query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamRoleBindingItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }
}

pub fn app_iam_directory_router() -> Router {
    app_iam_directory_router_with_state(Arc::new(EmptyAppIamDirectoryReadStore), false)
}

pub fn app_iam_directory_router_with_read_store(
    read_store: Arc<dyn AppIamDirectoryReadStore + Send + Sync>,
) -> Router {
    app_iam_directory_router_with_state(read_store, true)
}

fn app_iam_directory_router_with_state(
    read_store: Arc<dyn AppIamDirectoryReadStore + Send + Sync>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route("/app/v3/api/iam/organizations", get(list_organizations))
        .route(
            "/app/v3/api/iam/organizations/tree",
            get(retrieve_organization_tree),
        )
        .route(
            "/app/v3/api/iam/organization_memberships",
            get(list_organization_memberships),
        )
        .route("/app/v3/api/iam/departments", get(list_departments))
        .route(
            "/app/v3/api/iam/departments/tree",
            get(retrieve_department_tree),
        )
        .route(
            "/app/v3/api/iam/department_assignments",
            get(list_department_assignments),
        )
        .route("/app/v3/api/iam/positions", get(list_positions))
        .route(
            "/app/v3/api/iam/position_assignments",
            get(list_position_assignments),
        )
        .route("/app/v3/api/iam/role_bindings", get(list_role_bindings))
        .with_state(AppIamDirectoryState {
            read_store,
            require_subject,
        })
}

async fn list_organizations(
    State(state): State<AppIamDirectoryState>,
    subject: Option<TrustedRequestSubject>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
) -> Response {
    let subject = match iam_directory_subject(subject, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state.read_store.list_organizations(subject, query).await {
        Ok(items) => Json(PlusApiResult::success(AppIamDirectoryItems::new(items))).into_response(),
        Err(error) => app_iam_directory_read_model_error(error),
    }
}

async fn retrieve_organization_tree(
    State(state): State<AppIamDirectoryState>,
    subject: Option<TrustedRequestSubject>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
) -> Response {
    let subject = match iam_directory_subject(subject, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state
        .read_store
        .retrieve_organization_tree(subject, query)
        .await
    {
        Ok(items) => Json(PlusApiResult::success(AppIamDirectoryItems::new(items))).into_response(),
        Err(error) => app_iam_directory_read_model_error(error),
    }
}

async fn list_organization_memberships(
    State(state): State<AppIamDirectoryState>,
    subject: Option<TrustedRequestSubject>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
) -> Response {
    let subject = match iam_directory_subject(subject, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state
        .read_store
        .list_organization_memberships(subject, query)
        .await
    {
        Ok(items) => Json(PlusApiResult::success(AppIamDirectoryItems::new(items))).into_response(),
        Err(error) => app_iam_directory_read_model_error(error),
    }
}

async fn list_departments(
    State(state): State<AppIamDirectoryState>,
    subject: Option<TrustedRequestSubject>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
) -> Response {
    let subject = match iam_directory_subject(subject, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state.read_store.list_departments(subject, query).await {
        Ok(items) => Json(PlusApiResult::success(AppIamDirectoryItems::new(items))).into_response(),
        Err(error) => app_iam_directory_read_model_error(error),
    }
}

async fn retrieve_department_tree(
    State(state): State<AppIamDirectoryState>,
    subject: Option<TrustedRequestSubject>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
) -> Response {
    let subject = match iam_directory_subject(subject, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state
        .read_store
        .retrieve_department_tree(subject, query)
        .await
    {
        Ok(items) => Json(PlusApiResult::success(AppIamDirectoryItems::new(items))).into_response(),
        Err(error) => app_iam_directory_read_model_error(error),
    }
}

async fn list_department_assignments(
    State(state): State<AppIamDirectoryState>,
    subject: Option<TrustedRequestSubject>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
) -> Response {
    let subject = match iam_directory_subject(subject, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state
        .read_store
        .list_department_assignments(subject, query)
        .await
    {
        Ok(items) => Json(PlusApiResult::success(AppIamDirectoryItems::new(items))).into_response(),
        Err(error) => app_iam_directory_read_model_error(error),
    }
}

async fn list_positions(
    State(state): State<AppIamDirectoryState>,
    subject: Option<TrustedRequestSubject>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
) -> Response {
    let subject = match iam_directory_subject(subject, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state.read_store.list_positions(subject, query).await {
        Ok(items) => Json(PlusApiResult::success(AppIamDirectoryItems::new(items))).into_response(),
        Err(error) => app_iam_directory_read_model_error(error),
    }
}

async fn list_position_assignments(
    State(state): State<AppIamDirectoryState>,
    subject: Option<TrustedRequestSubject>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
) -> Response {
    let subject = match iam_directory_subject(subject, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state
        .read_store
        .list_position_assignments(subject, query)
        .await
    {
        Ok(items) => Json(PlusApiResult::success(AppIamDirectoryItems::new(items))).into_response(),
        Err(error) => app_iam_directory_read_model_error(error),
    }
}

async fn list_role_bindings(
    State(state): State<AppIamDirectoryState>,
    subject: Option<TrustedRequestSubject>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
) -> Response {
    let subject = match iam_directory_subject(subject, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state.read_store.list_role_bindings(subject, query).await {
        Ok(items) => Json(PlusApiResult::success(AppIamDirectoryItems::new(items))).into_response(),
        Err(error) => app_iam_directory_read_model_error(error),
    }
}

fn iam_directory_subject(
    subject: Option<TrustedRequestSubject>,
    require_subject: bool,
) -> Result<Option<AppIamDirectorySubject>, Response> {
    map_optional_app_user_subject(subject, require_subject, |trusted| AppIamDirectorySubject {
        tenant_id: trusted.tenant_id,
        organization_id: trusted.organization_id,
        user_id: trusted.user_id,
    })
}

fn app_iam_directory_read_model_error(error: impl std::fmt::Display) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error(
            "5000",
            format!("app IAM directory read model is unavailable: {error}"),
        )),
    )
        .into_response()
}
