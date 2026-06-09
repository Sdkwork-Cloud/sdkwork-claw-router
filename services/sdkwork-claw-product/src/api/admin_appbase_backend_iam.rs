use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Bytes;
use axum::extract::{Path, Query, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{delete, get, patch};
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::Deserialize;
use serde_json::{json, Value};
use sqlx::{PgPool, Row, SqlitePool};

use crate::api::app_iam_directory_query::AppIamDirectoryHttpQuery;
use crate::api::response::PlusApiResult;
use crate::infrastructure::sql::runtime_id::next_claw_runtime_id;
use crate::ports::{
    AppIamDepartmentAssignmentItem, AppIamDepartmentItem, AppIamDepartmentTreeItem,
    AppIamDirectoryItems, AppIamDirectoryQuery, AppIamDirectoryReadStore, AppIamDirectorySubject,
    AppIamOrganizationItem, AppIamOrganizationMembershipItem, AppIamOrganizationTreeItem,
    AppIamPositionAssignmentItem, AppIamPositionItem, AppIamRoleBindingItem,
};

#[derive(Clone)]
pub enum AdminAppbaseBackendIamSqlReadStore {
    Sqlite(SqlitePool),
    Postgres(PgPool),
}

impl AdminAppbaseBackendIamSqlReadStore {
    pub fn sqlite(pool: SqlitePool) -> Self {
        Self::Sqlite(pool)
    }

    pub fn postgres(pool: PgPool) -> Self {
        Self::Postgres(pool)
    }

    async fn list_roles(
        &self,
        subject: AppIamDirectorySubject,
        query: &AppIamDirectoryQuery,
    ) -> Result<Vec<Value>, sqlx::Error> {
        match self {
            Self::Sqlite(pool) => list_sqlite_roles(pool, subject, query).await,
            Self::Postgres(pool) => list_postgres_roles(pool, subject, query).await,
        }
    }

    async fn list_permissions(
        &self,
        subject: AppIamDirectorySubject,
        role_id: Option<&str>,
        query: &AppIamDirectoryQuery,
    ) -> Result<Vec<Value>, sqlx::Error> {
        match self {
            Self::Sqlite(pool) => list_sqlite_permissions(pool, subject, role_id, query).await,
            Self::Postgres(pool) => list_postgres_permissions(pool, subject, role_id, query).await,
        }
    }

    async fn create_department(
        &self,
        subject: AppIamDirectorySubject,
        request: DepartmentCommandRequest,
    ) -> Result<AppIamDepartmentItem, AdminAppbaseBackendIamCommandError> {
        match self {
            Self::Sqlite(pool) => create_sqlite_department(pool, subject, request).await,
            Self::Postgres(pool) => create_postgres_department(pool, subject, request).await,
        }
    }

    async fn retrieve_department(
        &self,
        subject: AppIamDirectorySubject,
        department_id: &str,
    ) -> Result<AppIamDepartmentItem, AdminAppbaseBackendIamCommandError> {
        match self {
            Self::Sqlite(pool) => retrieve_sqlite_department(pool, subject, department_id).await,
            Self::Postgres(pool) => {
                retrieve_postgres_department(pool, subject, department_id).await
            }
        }
    }

    async fn update_department(
        &self,
        subject: AppIamDirectorySubject,
        department_id: &str,
        request: DepartmentCommandRequest,
    ) -> Result<AppIamDepartmentItem, AdminAppbaseBackendIamCommandError> {
        match self {
            Self::Sqlite(pool) => {
                update_sqlite_department(pool, subject, department_id, request).await
            }
            Self::Postgres(pool) => {
                update_postgres_department(pool, subject, department_id, request).await
            }
        }
    }

    async fn delete_department(
        &self,
        subject: AppIamDirectorySubject,
        department_id: &str,
    ) -> Result<bool, AdminAppbaseBackendIamCommandError> {
        match self {
            Self::Sqlite(pool) => delete_sqlite_department(pool, subject, department_id).await,
            Self::Postgres(pool) => delete_postgres_department(pool, subject, department_id).await,
        }
    }

    async fn execute_command(
        &self,
        subject: AppIamDirectorySubject,
        command: IamBackendCommand,
        body: Value,
    ) -> Result<Value, AdminAppbaseBackendIamCommandError> {
        match self {
            Self::Sqlite(pool) => execute_sqlite_command(pool, subject, command, body).await,
            Self::Postgres(pool) => execute_postgres_command(pool, subject, command, body).await,
        }
    }
}

#[derive(Clone)]
struct AdminAppbaseBackendIamState {
    directory_store: Arc<dyn AppIamDirectoryReadStore + Send + Sync>,
    sql_read_store: AdminAppbaseBackendIamSqlReadStore,
}

#[derive(Debug, Clone, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
struct DepartmentCommandRequest {
    #[serde(default)]
    organization_id: Option<String>,
    #[serde(default)]
    parent_department_id: Option<String>,
    #[serde(default)]
    code: Option<String>,
    #[serde(default)]
    name: Option<String>,
    #[serde(default)]
    department_kind: Option<String>,
    #[serde(default)]
    cost_center_code: Option<String>,
    #[serde(default)]
    manager_membership_id: Option<String>,
    #[serde(default)]
    status: Option<String>,
}

#[derive(Debug)]
enum AdminAppbaseBackendIamCommandError {
    BadRequest(String),
    Forbidden(String),
    NotFound(String),
    Conflict(String),
    System(String),
}

#[derive(Debug, Clone)]
enum IamBackendCommand {
    CreateOrganization,
    RetrieveOrganization {
        id: String,
    },
    UpdateOrganization {
        id: String,
    },
    DeleteOrganization {
        id: String,
    },
    CreateOrganizationMembership,
    UpdateOrganizationMembership {
        id: String,
    },
    CreateDepartmentAssignment,
    UpdateDepartmentAssignment {
        id: String,
    },
    CreatePosition,
    RetrievePosition {
        id: String,
    },
    UpdatePosition {
        id: String,
    },
    DeletePosition {
        id: String,
    },
    CreatePositionAssignment,
    UpdatePositionAssignment {
        id: String,
    },
    CreateRoleBinding,
    DeleteRoleBinding {
        id: String,
    },
    CreateRole,
    RetrieveRole {
        id: String,
    },
    UpdateRole {
        id: String,
    },
    DeleteRole {
        id: String,
    },
    GrantRolePermission {
        role_id: String,
    },
    RevokeRolePermission {
        role_id: String,
        permission_id: String,
    },
    CreatePermission,
    RetrievePermission {
        id: String,
    },
    UpdatePermission {
        id: String,
    },
    DeletePermission {
        id: String,
    },
}

impl From<sqlx::Error> for AdminAppbaseBackendIamCommandError {
    fn from(error: sqlx::Error) -> Self {
        Self::System(format!(
            "appbase backend IAM command store is unavailable: {error}"
        ))
    }
}

pub fn admin_appbase_backend_iam_directory_router_with_read_store(
    directory_store: Arc<dyn AppIamDirectoryReadStore + Send + Sync>,
    sql_read_store: AdminAppbaseBackendIamSqlReadStore,
) -> Router {
    Router::new()
        .route(
            "/backend/v3/api/iam/organizations",
            get(list_organizations).post(create_organization),
        )
        .route(
            "/backend/v3/api/iam/organizations/tree",
            get(retrieve_organization_tree),
        )
        .route(
            "/backend/v3/api/iam/organizations/{organization_id}",
            get(retrieve_organization)
                .patch(update_organization)
                .delete(delete_organization),
        )
        .route(
            "/backend/v3/api/iam/organization_memberships",
            get(list_organization_memberships).post(create_organization_membership),
        )
        .route(
            "/backend/v3/api/iam/organization_memberships/{membership_id}",
            patch(update_organization_membership),
        )
        .route(
            "/backend/v3/api/iam/departments",
            get(list_departments).post(create_department),
        )
        .route(
            "/backend/v3/api/iam/departments/tree",
            get(retrieve_department_tree),
        )
        .route(
            "/backend/v3/api/iam/departments/{department_id}",
            get(retrieve_department)
                .patch(update_department)
                .delete(delete_department),
        )
        .route(
            "/backend/v3/api/iam/department_assignments",
            get(list_department_assignments).post(create_department_assignment),
        )
        .route(
            "/backend/v3/api/iam/department_assignments/{assignment_id}",
            patch(update_department_assignment),
        )
        .route(
            "/backend/v3/api/iam/positions",
            get(list_positions).post(create_position),
        )
        .route(
            "/backend/v3/api/iam/positions/{position_id}",
            get(retrieve_position)
                .patch(update_position)
                .delete(delete_position),
        )
        .route(
            "/backend/v3/api/iam/position_assignments",
            get(list_position_assignments).post(create_position_assignment),
        )
        .route(
            "/backend/v3/api/iam/position_assignments/{assignment_id}",
            patch(update_position_assignment),
        )
        .route(
            "/backend/v3/api/iam/role_bindings",
            get(list_role_bindings).post(create_role_binding),
        )
        .route(
            "/backend/v3/api/iam/role_bindings/{role_binding_id}",
            delete(delete_role_binding),
        )
        .route(
            "/backend/v3/api/iam/roles",
            get(list_roles).post(create_role),
        )
        .route(
            "/backend/v3/api/iam/roles/{role_id}",
            get(retrieve_role).patch(update_role).delete(delete_role),
        )
        .route(
            "/backend/v3/api/iam/roles/{role_id}/permissions",
            get(list_role_permissions).post(grant_role_permission),
        )
        .route(
            "/backend/v3/api/iam/roles/{role_id}/permissions/{permission_id}",
            delete(revoke_role_permission),
        )
        .route(
            "/backend/v3/api/iam/permissions",
            get(list_permissions).post(create_permission),
        )
        .route(
            "/backend/v3/api/iam/permissions/{permission_id}",
            get(retrieve_permission)
                .patch(update_permission)
                .delete(delete_permission),
        )
        .with_state(AdminAppbaseBackendIamState {
            directory_store,
            sql_read_store,
        })
}

async fn list_organizations(
    State(state): State<AdminAppbaseBackendIamState>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
    headers: HeaderMap,
) -> Response {
    let subject = match directory_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state
        .directory_store
        .list_organizations(Some(subject), query)
        .await
    {
        Ok(items) => ok_items(items.into_iter().map(organization_value).collect()),
        Err(error) => read_model_error(error),
    }
}

async fn retrieve_organization_tree(
    State(state): State<AdminAppbaseBackendIamState>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
    headers: HeaderMap,
) -> Response {
    let subject = match directory_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state
        .directory_store
        .retrieve_organization_tree(Some(subject), query)
        .await
    {
        Ok(items) => ok_items(items.into_iter().map(organization_tree_value).collect()),
        Err(error) => read_model_error(error),
    }
}

async fn create_organization(
    State(state): State<AdminAppbaseBackendIamState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    execute_backend_command(state, headers, body, IamBackendCommand::CreateOrganization).await
}

async fn retrieve_organization(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(organization_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    execute_backend_command(
        state,
        headers,
        Bytes::new(),
        IamBackendCommand::RetrieveOrganization {
            id: organization_id,
        },
    )
    .await
}

async fn update_organization(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(organization_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    execute_backend_command(
        state,
        headers,
        body,
        IamBackendCommand::UpdateOrganization {
            id: organization_id,
        },
    )
    .await
}

async fn delete_organization(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(organization_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    execute_backend_command(
        state,
        headers,
        Bytes::new(),
        IamBackendCommand::DeleteOrganization {
            id: organization_id,
        },
    )
    .await
}

async fn list_organization_memberships(
    State(state): State<AdminAppbaseBackendIamState>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
    headers: HeaderMap,
) -> Response {
    let subject = match directory_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state
        .directory_store
        .list_organization_memberships(Some(subject), query)
        .await
    {
        Ok(items) => ok_items(
            items
                .into_iter()
                .map(organization_membership_value)
                .collect(),
        ),
        Err(error) => read_model_error(error),
    }
}

async fn create_organization_membership(
    State(state): State<AdminAppbaseBackendIamState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    execute_backend_command(
        state,
        headers,
        body,
        IamBackendCommand::CreateOrganizationMembership,
    )
    .await
}

async fn update_organization_membership(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(membership_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    execute_backend_command(
        state,
        headers,
        body,
        IamBackendCommand::UpdateOrganizationMembership { id: membership_id },
    )
    .await
}

async fn list_departments(
    State(state): State<AdminAppbaseBackendIamState>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
    headers: HeaderMap,
) -> Response {
    let subject = match directory_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state
        .directory_store
        .list_departments(Some(subject), query)
        .await
    {
        Ok(items) => ok_items(items.into_iter().map(department_value).collect()),
        Err(error) => read_model_error(error),
    }
}

async fn retrieve_department_tree(
    State(state): State<AdminAppbaseBackendIamState>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
    headers: HeaderMap,
) -> Response {
    let subject = match directory_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state
        .directory_store
        .retrieve_department_tree(Some(subject), query)
        .await
    {
        Ok(items) => ok_items(items.into_iter().map(department_tree_value).collect()),
        Err(error) => read_model_error(error),
    }
}

async fn create_department(
    State(state): State<AdminAppbaseBackendIamState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match directory_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_department_command_body(&body, true) {
        Ok(request) => request,
        Err(response) => return response,
    };
    match state
        .sql_read_store
        .create_department(subject, request)
        .await
    {
        Ok(item) => ok_item(department_value(item)),
        Err(error) => command_error_response(error),
    }
}

async fn retrieve_department(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(department_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    let subject = match directory_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let department_id = match normalize_required_text(Some(department_id.as_str()), "departmentId")
    {
        Ok(value) => value,
        Err(error) => return command_error_response(error),
    };
    match state
        .sql_read_store
        .retrieve_department(subject, department_id.as_str())
        .await
    {
        Ok(item) => ok_item(department_value(item)),
        Err(error) => command_error_response(error),
    }
}

async fn update_department(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(department_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match directory_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let department_id = match normalize_required_text(Some(department_id.as_str()), "departmentId")
    {
        Ok(value) => value,
        Err(error) => return command_error_response(error),
    };
    let request = match parse_department_command_body(&body, false) {
        Ok(request) => request,
        Err(response) => return response,
    };
    match state
        .sql_read_store
        .update_department(subject, department_id.as_str(), request)
        .await
    {
        Ok(item) => ok_item(department_value(item)),
        Err(error) => command_error_response(error),
    }
}

async fn delete_department(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(department_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    let subject = match directory_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let department_id = match normalize_required_text(Some(department_id.as_str()), "departmentId")
    {
        Ok(value) => value,
        Err(error) => return command_error_response(error),
    };
    match state
        .sql_read_store
        .delete_department(subject, department_id.as_str())
        .await
    {
        Ok(true) => Json(PlusApiResult::success(json!({ "deleted": true }))).into_response(),
        Ok(false) => command_error_response(AdminAppbaseBackendIamCommandError::NotFound(
            "department was not found".to_owned(),
        )),
        Err(error) => command_error_response(error),
    }
}

async fn list_department_assignments(
    State(state): State<AdminAppbaseBackendIamState>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
    headers: HeaderMap,
) -> Response {
    let subject = match directory_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state
        .directory_store
        .list_department_assignments(Some(subject), query)
        .await
    {
        Ok(items) => ok_items(items.into_iter().map(department_assignment_value).collect()),
        Err(error) => read_model_error(error),
    }
}

async fn create_department_assignment(
    State(state): State<AdminAppbaseBackendIamState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    execute_backend_command(
        state,
        headers,
        body,
        IamBackendCommand::CreateDepartmentAssignment,
    )
    .await
}

async fn update_department_assignment(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(assignment_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    execute_backend_command(
        state,
        headers,
        body,
        IamBackendCommand::UpdateDepartmentAssignment { id: assignment_id },
    )
    .await
}

async fn list_positions(
    State(state): State<AdminAppbaseBackendIamState>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
    headers: HeaderMap,
) -> Response {
    let subject = match directory_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state
        .directory_store
        .list_positions(Some(subject), query)
        .await
    {
        Ok(items) => ok_items(items.into_iter().map(position_value).collect()),
        Err(error) => read_model_error(error),
    }
}

async fn create_position(
    State(state): State<AdminAppbaseBackendIamState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    execute_backend_command(state, headers, body, IamBackendCommand::CreatePosition).await
}

async fn retrieve_position(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(position_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    execute_backend_command(
        state,
        headers,
        Bytes::new(),
        IamBackendCommand::RetrievePosition { id: position_id },
    )
    .await
}

async fn update_position(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(position_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    execute_backend_command(
        state,
        headers,
        body,
        IamBackendCommand::UpdatePosition { id: position_id },
    )
    .await
}

async fn delete_position(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(position_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    execute_backend_command(
        state,
        headers,
        Bytes::new(),
        IamBackendCommand::DeletePosition { id: position_id },
    )
    .await
}

async fn list_position_assignments(
    State(state): State<AdminAppbaseBackendIamState>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
    headers: HeaderMap,
) -> Response {
    let subject = match directory_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state
        .directory_store
        .list_position_assignments(Some(subject), query)
        .await
    {
        Ok(items) => ok_items(items.into_iter().map(position_assignment_value).collect()),
        Err(error) => read_model_error(error),
    }
}

async fn create_position_assignment(
    State(state): State<AdminAppbaseBackendIamState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    execute_backend_command(
        state,
        headers,
        body,
        IamBackendCommand::CreatePositionAssignment,
    )
    .await
}

async fn update_position_assignment(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(assignment_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    execute_backend_command(
        state,
        headers,
        body,
        IamBackendCommand::UpdatePositionAssignment { id: assignment_id },
    )
    .await
}

async fn list_role_bindings(
    State(state): State<AdminAppbaseBackendIamState>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
    headers: HeaderMap,
) -> Response {
    let subject = match directory_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state
        .directory_store
        .list_role_bindings(Some(subject), query)
        .await
    {
        Ok(items) => ok_items(items.into_iter().map(role_binding_value).collect()),
        Err(error) => read_model_error(error),
    }
}

async fn create_role_binding(
    State(state): State<AdminAppbaseBackendIamState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    execute_backend_command(state, headers, body, IamBackendCommand::CreateRoleBinding).await
}

async fn delete_role_binding(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(role_binding_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    execute_backend_command(
        state,
        headers,
        Bytes::new(),
        IamBackendCommand::DeleteRoleBinding {
            id: role_binding_id,
        },
    )
    .await
}

async fn list_roles(
    State(state): State<AdminAppbaseBackendIamState>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
    headers: HeaderMap,
) -> Response {
    let subject = match directory_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state.sql_read_store.list_roles(subject, &query).await {
        Ok(items) => ok_items(items),
        Err(error) => sql_read_model_error("roles", error),
    }
}

async fn create_role(
    State(state): State<AdminAppbaseBackendIamState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    execute_backend_command(state, headers, body, IamBackendCommand::CreateRole).await
}

async fn retrieve_role(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(role_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    execute_backend_command(
        state,
        headers,
        Bytes::new(),
        IamBackendCommand::RetrieveRole { id: role_id },
    )
    .await
}

async fn update_role(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(role_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    execute_backend_command(
        state,
        headers,
        body,
        IamBackendCommand::UpdateRole { id: role_id },
    )
    .await
}

async fn delete_role(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(role_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    execute_backend_command(
        state,
        headers,
        Bytes::new(),
        IamBackendCommand::DeleteRole { id: role_id },
    )
    .await
}

async fn list_permissions(
    State(state): State<AdminAppbaseBackendIamState>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
    headers: HeaderMap,
) -> Response {
    let subject = match directory_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state
        .sql_read_store
        .list_permissions(subject, None, &query)
        .await
    {
        Ok(items) => ok_items(items),
        Err(error) => sql_read_model_error("permissions", error),
    }
}

async fn list_role_permissions(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(role_id): Path<String>,
    Query(query): Query<AppIamDirectoryHttpQuery>,
    headers: HeaderMap,
) -> Response {
    let subject = match directory_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = query.into_port_query();
    match state
        .sql_read_store
        .list_permissions(subject, Some(role_id.as_str()), &query)
        .await
    {
        Ok(items) => ok_items(items),
        Err(error) => sql_read_model_error("role permissions", error),
    }
}

async fn grant_role_permission(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(role_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    execute_backend_command(
        state,
        headers,
        body,
        IamBackendCommand::GrantRolePermission { role_id },
    )
    .await
}

async fn revoke_role_permission(
    State(state): State<AdminAppbaseBackendIamState>,
    Path((role_id, permission_id)): Path<(String, String)>,
    headers: HeaderMap,
) -> Response {
    execute_backend_command(
        state,
        headers,
        Bytes::new(),
        IamBackendCommand::RevokeRolePermission {
            role_id,
            permission_id,
        },
    )
    .await
}

async fn create_permission(
    State(state): State<AdminAppbaseBackendIamState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    execute_backend_command(state, headers, body, IamBackendCommand::CreatePermission).await
}

async fn retrieve_permission(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(permission_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    execute_backend_command(
        state,
        headers,
        Bytes::new(),
        IamBackendCommand::RetrievePermission { id: permission_id },
    )
    .await
}

async fn update_permission(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(permission_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    execute_backend_command(
        state,
        headers,
        body,
        IamBackendCommand::UpdatePermission { id: permission_id },
    )
    .await
}

async fn delete_permission(
    State(state): State<AdminAppbaseBackendIamState>,
    Path(permission_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    execute_backend_command(
        state,
        headers,
        Bytes::new(),
        IamBackendCommand::DeletePermission { id: permission_id },
    )
    .await
}

async fn execute_backend_command(
    state: AdminAppbaseBackendIamState,
    headers: HeaderMap,
    body: Bytes,
    command: IamBackendCommand,
) -> Response {
    let subject = match directory_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let body = match parse_command_value_body(&body) {
        Ok(body) => body,
        Err(response) => return response,
    };
    match state
        .sql_read_store
        .execute_command(subject, command, body)
        .await
    {
        Ok(data) => Json(PlusApiResult::success(data)).into_response(),
        Err(error) => command_error_response(error),
    }
}

fn directory_subject(headers: &HeaderMap) -> Result<AppIamDirectorySubject, Response> {
    TrustedRequestSubject::from_headers(headers)
        .map(|subject| AppIamDirectorySubject {
            tenant_id: subject.tenant_id,
            organization_id: subject.organization_id,
            user_id: subject.user_id,
        })
        .map_err(|error| {
            (
                StatusCode::UNAUTHORIZED,
                Json(PlusApiResult::error("4010", error.to_string())),
            )
                .into_response()
        })
}

fn ok_items(items: Vec<Value>) -> Response {
    Json(PlusApiResult::success(AppIamDirectoryItems::new(items))).into_response()
}

fn ok_item(item: Value) -> Response {
    Json(PlusApiResult::success(json!({ "item": item }))).into_response()
}

fn read_model_error(error: impl std::fmt::Display) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error(
            "5000",
            format!("appbase backend IAM read model is unavailable: {error}"),
        )),
    )
        .into_response()
}

fn sql_read_model_error(area: &str, error: sqlx::Error) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error(
            "5000",
            format!("appbase backend IAM {area} read model is unavailable: {error}"),
        )),
    )
        .into_response()
}

fn command_error_response(error: AdminAppbaseBackendIamCommandError) -> Response {
    match error {
        AdminAppbaseBackendIamCommandError::BadRequest(message) => (
            StatusCode::BAD_REQUEST,
            Json(PlusApiResult::error("4001", message)),
        )
            .into_response(),
        AdminAppbaseBackendIamCommandError::Forbidden(message) => (
            StatusCode::FORBIDDEN,
            Json(PlusApiResult::error("4030", message)),
        )
            .into_response(),
        AdminAppbaseBackendIamCommandError::NotFound(message) => (
            StatusCode::NOT_FOUND,
            Json(PlusApiResult::error("4040", message)),
        )
            .into_response(),
        AdminAppbaseBackendIamCommandError::Conflict(message) => (
            StatusCode::CONFLICT,
            Json(PlusApiResult::error("4090", message)),
        )
            .into_response(),
        AdminAppbaseBackendIamCommandError::System(message) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(PlusApiResult::error("5000", message)),
        )
            .into_response(),
    }
}

fn parse_department_command_body(
    body: &Bytes,
    required: bool,
) -> Result<DepartmentCommandRequest, Response> {
    if body.is_empty() {
        if required {
            return Err(command_error_response(
                AdminAppbaseBackendIamCommandError::BadRequest(
                    "department command body is required".to_owned(),
                ),
            ));
        }
        return Ok(DepartmentCommandRequest::default());
    }
    serde_json::from_slice::<DepartmentCommandRequest>(body).map_err(|error| {
        command_error_response(AdminAppbaseBackendIamCommandError::BadRequest(format!(
            "department command body is invalid: {error}"
        )))
    })
}

fn parse_command_value_body(body: &Bytes) -> Result<Value, Response> {
    if body.is_empty() {
        return Ok(json!({}));
    }
    serde_json::from_slice::<Value>(body).map_err(|error| {
        command_error_response(AdminAppbaseBackendIamCommandError::BadRequest(format!(
            "appbase backend IAM command body is invalid: {error}"
        )))
    })
}

fn command_required_text(
    body: &Value,
    keys: &[&str],
    field_name: &str,
) -> Result<String, AdminAppbaseBackendIamCommandError> {
    normalize_required_text(command_text(body, keys).as_deref(), field_name)
}

fn command_optional_text(
    body: &Value,
    keys: &[&str],
    field_name: &str,
) -> Result<Option<String>, AdminAppbaseBackendIamCommandError> {
    normalize_optional_text(command_text(body, keys).as_deref(), field_name)
}

fn command_text(body: &Value, keys: &[&str]) -> Option<String> {
    keys.iter().find_map(|key| match body.get(*key) {
        Some(Value::String(value)) => Some(value.clone()),
        Some(Value::Number(value)) => Some(value.to_string()),
        Some(Value::Bool(value)) => Some(value.to_string()),
        _ => None,
    })
}

fn command_i64(body: &Value, keys: &[&str], default_value: i64) -> i64 {
    keys.iter()
        .find_map(|key| body.get(*key))
        .and_then(|value| {
            value.as_i64().or_else(|| {
                value
                    .as_str()
                    .and_then(|value| value.trim().parse::<i64>().ok())
            })
        })
        .unwrap_or(default_value)
}

fn command_bool(body: &Value, keys: &[&str], default_value: bool) -> bool {
    keys.iter()
        .find_map(|key| body.get(*key))
        .and_then(|value| {
            value.as_bool().or_else(|| {
                value.as_str().and_then(|value| match value.trim() {
                    "true" | "1" | "on" => Some(true),
                    "false" | "0" | "off" => Some(false),
                    _ => None,
                })
            })
        })
        .unwrap_or(default_value)
}

fn next_iam_command_id(context: &str) -> Result<String, AdminAppbaseBackendIamCommandError> {
    next_claw_runtime_id(context)
        .map(|value| value.to_string())
        .map_err(|error| AdminAppbaseBackendIamCommandError::System(error.to_string()))
}

fn normalize_required_text(
    value: Option<&str>,
    field_name: &str,
) -> Result<String, AdminAppbaseBackendIamCommandError> {
    let value = value
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .ok_or_else(|| {
            AdminAppbaseBackendIamCommandError::BadRequest(format!("{field_name} is required"))
        })?;
    if value.len() > 128 {
        return Err(AdminAppbaseBackendIamCommandError::BadRequest(format!(
            "{field_name} must be at most 128 characters"
        )));
    }
    Ok(value.to_owned())
}

fn normalize_optional_text(
    value: Option<&str>,
    field_name: &str,
) -> Result<Option<String>, AdminAppbaseBackendIamCommandError> {
    let Some(value) = value.map(str::trim).filter(|value| !value.is_empty()) else {
        return Ok(None);
    };
    if value.len() > 128 {
        return Err(AdminAppbaseBackendIamCommandError::BadRequest(format!(
            "{field_name} must be at most 128 characters"
        )));
    }
    Ok(Some(value.to_owned()))
}

fn normalize_status(
    value: Option<&str>,
    default_value: &str,
) -> Result<String, AdminAppbaseBackendIamCommandError> {
    let value = value
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .unwrap_or(default_value)
        .to_ascii_lowercase();
    match value.as_str() {
        "active" | "inactive" | "archived" => Ok(value),
        _ => Err(AdminAppbaseBackendIamCommandError::BadRequest(
            "status must be active, inactive, or archived".to_owned(),
        )),
    }
}

fn normalize_department_kind(
    value: Option<&str>,
) -> Result<String, AdminAppbaseBackendIamCommandError> {
    let value = value
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .unwrap_or("department")
        .to_ascii_lowercase();
    if value.len() > 64 {
        return Err(AdminAppbaseBackendIamCommandError::BadRequest(
            "departmentKind must be at most 64 characters".to_owned(),
        ));
    }
    Ok(value)
}

fn generated_entity_code(name: &str, fallback_code: &str) -> String {
    let code = generated_code_base(name);
    if code.is_empty() {
        fallback_code.to_owned()
    } else {
        code
    }
}

fn generated_code_base(name: &str) -> String {
    let mut code = name
        .chars()
        .map(|value| {
            if value.is_ascii_alphanumeric() {
                value.to_ascii_lowercase()
            } else {
                '-'
            }
        })
        .collect::<String>()
        .trim_matches('-')
        .to_owned();
    while code.contains("--") {
        code = code.replace("--", "-");
    }
    code
}

async fn unique_sqlite_organization_code(
    pool: &SqlitePool,
    tenant_id: i64,
    requested_code: Option<&str>,
    name: &str,
    _organization_id: &str,
) -> Result<String, AdminAppbaseBackendIamCommandError> {
    let generated = requested_code
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned)
        .unwrap_or_else(|| generated_entity_code(name, "organization"));
    let base_code = normalize_required_text(Some(generated.as_str()), "code")?;
    unique_sqlite_code(
        pool,
        "iam_organization",
        tenant_id,
        None,
        base_code.as_str(),
    )
    .await
}

async fn unique_postgres_organization_code(
    pool: &PgPool,
    tenant_id: i64,
    requested_code: Option<&str>,
    name: &str,
    _organization_id: &str,
) -> Result<String, AdminAppbaseBackendIamCommandError> {
    let generated = requested_code
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned)
        .unwrap_or_else(|| generated_entity_code(name, "organization"));
    let base_code = normalize_required_text(Some(generated.as_str()), "code")?;
    unique_postgres_code(
        pool,
        "iam_organization",
        tenant_id,
        None,
        base_code.as_str(),
    )
    .await
}

async fn unique_sqlite_department_code(
    pool: &SqlitePool,
    tenant_id: i64,
    organization_id: &str,
    requested_code: Option<&str>,
    name: &str,
    _department_id: &str,
) -> Result<String, AdminAppbaseBackendIamCommandError> {
    let generated = requested_code
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned)
        .unwrap_or_else(|| generated_entity_code(name, "department"));
    let base_code = normalize_required_text(Some(generated.as_str()), "code")?;
    unique_sqlite_code(
        pool,
        "iam_department",
        tenant_id,
        Some(organization_id),
        base_code.as_str(),
    )
    .await
}

async fn unique_postgres_department_code(
    pool: &PgPool,
    tenant_id: i64,
    organization_id: &str,
    requested_code: Option<&str>,
    name: &str,
    _department_id: &str,
) -> Result<String, AdminAppbaseBackendIamCommandError> {
    let generated = requested_code
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned)
        .unwrap_or_else(|| generated_entity_code(name, "department"));
    let base_code = normalize_required_text(Some(generated.as_str()), "code")?;
    unique_postgres_code(
        pool,
        "iam_department",
        tenant_id,
        Some(organization_id),
        base_code.as_str(),
    )
    .await
}

async fn unique_sqlite_position_code(
    pool: &SqlitePool,
    tenant_id: i64,
    organization_id: &str,
    requested_code: Option<&str>,
    name: &str,
    _position_id: &str,
) -> Result<String, AdminAppbaseBackendIamCommandError> {
    let generated = requested_code
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned)
        .unwrap_or_else(|| generated_entity_code(name, "position"));
    let base_code = normalize_required_text(Some(generated.as_str()), "code")?;
    unique_sqlite_code(
        pool,
        "iam_position",
        tenant_id,
        Some(organization_id),
        base_code.as_str(),
    )
    .await
}

async fn unique_postgres_position_code(
    pool: &PgPool,
    tenant_id: i64,
    organization_id: &str,
    requested_code: Option<&str>,
    name: &str,
    _position_id: &str,
) -> Result<String, AdminAppbaseBackendIamCommandError> {
    let generated = requested_code
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned)
        .unwrap_or_else(|| generated_entity_code(name, "position"));
    let base_code = normalize_required_text(Some(generated.as_str()), "code")?;
    unique_postgres_code(
        pool,
        "iam_position",
        tenant_id,
        Some(organization_id),
        base_code.as_str(),
    )
    .await
}

async fn unique_sqlite_code(
    pool: &SqlitePool,
    table_name: &str,
    tenant_id: i64,
    organization_id: Option<&str>,
    base_code: &str,
) -> Result<String, AdminAppbaseBackendIamCommandError> {
    let mut code = base_code.to_owned();
    for suffix in 0..1000 {
        if suffix > 0 {
            code = format!("{base_code}-{suffix}");
        }
        let exists = match organization_id {
            Some(organization_id) => {
                sqlx::query_scalar::<_, i64>(&format!(
                    "SELECT COUNT(1) FROM {table_name} WHERE CAST(tenant_id AS TEXT) = ?1 AND CAST(organization_id AS TEXT) = ?2 AND code = ?3"
                ))
                .bind(tenant_id.to_string())
                .bind(organization_id)
                .bind(code.as_str())
                .fetch_one(pool)
                .await?
            }
            None => {
                sqlx::query_scalar::<_, i64>(&format!(
                    "SELECT COUNT(1) FROM {table_name} WHERE CAST(tenant_id AS TEXT) = ?1 AND code = ?2"
                ))
                .bind(tenant_id.to_string())
                .bind(code.as_str())
                .fetch_one(pool)
                .await?
            }
        };
        if exists == 0 {
            return Ok(code);
        }
    }
    Err(AdminAppbaseBackendIamCommandError::Conflict(
        "IAM code already exists".to_owned(),
    ))
}

async fn unique_postgres_code(
    pool: &PgPool,
    table_name: &str,
    tenant_id: i64,
    organization_id: Option<&str>,
    base_code: &str,
) -> Result<String, AdminAppbaseBackendIamCommandError> {
    let mut code = base_code.to_owned();
    for suffix in 0..1000 {
        if suffix > 0 {
            code = format!("{base_code}-{suffix}");
        }
        let exists = match organization_id {
            Some(organization_id) => {
                sqlx::query_scalar::<_, i64>(&format!(
                    "SELECT COUNT(1) FROM {table_name} WHERE tenant_id::text = $1 AND organization_id::text = $2 AND code = $3"
                ))
                .bind(tenant_id.to_string())
                .bind(organization_id)
                .bind(code.as_str())
                .fetch_one(pool)
                .await?
            }
            None => {
                sqlx::query_scalar::<_, i64>(&format!(
                    "SELECT COUNT(1) FROM {table_name} WHERE tenant_id::text = $1 AND code = $2"
                ))
                .bind(tenant_id.to_string())
                .bind(code.as_str())
                .fetch_one(pool)
                .await?
            }
        };
        if exists == 0 {
            return Ok(code);
        }
    }
    Err(AdminAppbaseBackendIamCommandError::Conflict(
        "IAM code already exists".to_owned(),
    ))
}

fn current_timestamp_string() -> String {
    let seconds = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or_default();
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

fn organization_value(item: AppIamOrganizationItem) -> Value {
    json!({
        "id": item.id,
        "tenantId": item.tenant_id,
        "code": item.code,
        "name": item.name,
        "organizationKind": "organization",
        "kind": "organization",
        "parentOrganizationId": item.parent_id,
        "parentId": item.parent_id,
        "status": item.status,
        "ownerUserId": Value::Null,
        "memberCount": 0,
        "departmentCount": 0,
        "sortWeight": 0,
        "createdAt": item.created_at,
        "updatedAt": item.updated_at,
    })
}

fn organization_tree_value(item: AppIamOrganizationTreeItem) -> Value {
    let mut value = organization_value(item.organization);
    value["children"] = Value::Array(
        item.children
            .into_iter()
            .map(organization_tree_value)
            .collect(),
    );
    value
}

fn organization_membership_value(item: AppIamOrganizationMembershipItem) -> Value {
    json!({
        "id": item.id,
        "tenantId": item.tenant_id,
        "organizationId": item.organization_id,
        "userId": item.user_id,
        "displayName": item.user_id,
        "username": item.user_id,
        "email": "",
        "mobile": "",
        "memberKind": item.role_code,
        "role": item.role_code,
        "status": item.status,
        "joinedAt": item.joined_at,
        "createdAt": item.joined_at,
    })
}

fn department_value(item: AppIamDepartmentItem) -> Value {
    json!({
        "id": item.id,
        "tenantId": item.tenant_id,
        "organizationId": item.organization_id,
        "code": item.code,
        "name": item.name,
        "parentDepartmentId": item.parent_department_id,
        "parentId": item.parent_department_id,
        "status": item.status,
        "managerUserId": Value::Null,
        "memberCount": 0,
        "sortWeight": 0,
        "createdAt": item.created_at,
        "updatedAt": item.updated_at,
    })
}

fn department_tree_value(item: AppIamDepartmentTreeItem) -> Value {
    let mut value = department_value(item.department);
    value["children"] = Value::Array(
        item.children
            .into_iter()
            .map(department_tree_value)
            .collect(),
    );
    value
}

fn department_assignment_value(item: AppIamDepartmentAssignmentItem) -> Value {
    json!({
        "id": item.id,
        "tenantId": item.tenant_id,
        "organizationId": item.organization_id,
        "departmentId": item.department_id,
        "membershipId": item.organization_membership_id,
        "organizationMembershipId": item.organization_membership_id,
        "userId": item.user_id,
        "role": item.assignment_kind,
        "assignmentKind": item.assignment_kind,
        "status": item.status,
        "isPrimary": item.is_primary,
        "createdAt": item.created_at,
        "updatedAt": item.updated_at,
    })
}

fn position_value(item: AppIamPositionItem) -> Value {
    json!({
        "id": item.id,
        "tenantId": item.tenant_id,
        "organizationId": item.organization_id,
        "departmentId": nullable_string(item.department_id),
        "code": item.code,
        "name": item.name,
        "positionKind": item.position_kind,
        "status": item.status,
        "rankLevel": item.rank_level.parse::<i64>().unwrap_or_default(),
        "description": "",
        "createdAt": item.created_at,
        "updatedAt": item.updated_at,
    })
}

fn position_assignment_value(item: AppIamPositionAssignmentItem) -> Value {
    json!({
        "id": item.id,
        "tenantId": item.tenant_id,
        "organizationId": item.organization_id,
        "positionId": item.position_id,
        "membershipId": item.department_assignment_id,
        "departmentAssignmentId": item.department_assignment_id,
        "userId": item.user_id,
        "status": item.status,
        "isPrimary": item.is_primary,
        "startedAt": item.effective_from,
        "endedAt": item.effective_to,
        "createdAt": item.created_at,
        "updatedAt": item.updated_at,
    })
}

fn role_binding_value(item: AppIamRoleBindingItem) -> Value {
    let organization_id = if item.scope_kind == "organization" {
        nullable_string(item.scope_id.clone())
    } else {
        Value::Null
    };
    let department_id = if item.scope_kind == "department" {
        nullable_string(item.scope_id.clone())
    } else {
        Value::Null
    };
    json!({
        "id": item.id,
        "tenantId": item.tenant_id,
        "roleId": item.role_id,
        "principalKind": item.principal_kind,
        "principalType": item.principal_kind,
        "principalId": item.principal_id,
        "organizationId": organization_id,
        "departmentId": department_id,
        "scopeKind": item.scope_kind,
        "scopeId": item.scope_id,
        "effect": item.effect,
        "conditionJson": item.condition_json,
        "status": item.status,
        "createdAt": item.created_at,
        "updatedAt": item.updated_at,
    })
}

fn nullable_string(value: String) -> Value {
    if value.trim().is_empty() {
        Value::Null
    } else {
        Value::String(value)
    }
}

async fn create_sqlite_department(
    pool: &SqlitePool,
    subject: AppIamDirectorySubject,
    request: DepartmentCommandRequest,
) -> Result<AppIamDepartmentItem, AdminAppbaseBackendIamCommandError> {
    ensure_sqlite_department_table(pool).await?;
    let organization_id =
        normalize_required_text(request.organization_id.as_deref(), "organizationId")?;
    ensure_sqlite_organization_exists(pool, subject, organization_id.as_str()).await?;
    ensure_sqlite_organization_membership(pool, subject, organization_id.as_str()).await?;

    let department_id = next_claw_runtime_id("appbase backend IAM department")
        .map_err(|error| AdminAppbaseBackendIamCommandError::System(error.to_string()))?
        .to_string();
    let name = normalize_required_text(request.name.as_deref(), "name")?;
    let code = unique_sqlite_department_code(
        pool,
        subject.tenant_id,
        organization_id.as_str(),
        request.code.as_deref(),
        name.as_str(),
        department_id.as_str(),
    )
    .await?;
    let parent_department_id = normalize_optional_text(
        request.parent_department_id.as_deref(),
        "parentDepartmentId",
    )?;
    let parent_path = match parent_department_id.as_deref() {
        Some(parent_id) => {
            let parent = load_sqlite_department(pool, subject.tenant_id, parent_id).await?;
            if parent.organization_id != organization_id {
                return Err(AdminAppbaseBackendIamCommandError::BadRequest(
                    "parentDepartmentId must belong to the same organization".to_owned(),
                ));
            }
            Some(parent.path)
        }
        None => None,
    };
    let path = department_path(parent_path.as_deref(), department_id.as_str());
    let department_kind = normalize_department_kind(request.department_kind.as_deref())?;
    let cost_center_code =
        normalize_optional_text(request.cost_center_code.as_deref(), "costCenterCode")?;
    let manager_membership_id = normalize_optional_text(
        request.manager_membership_id.as_deref(),
        "managerMembershipId",
    )?;
    let status = normalize_status(request.status.as_deref(), "active")?;
    let now = current_timestamp_string();

    sqlx::query(
        r#"
        INSERT INTO iam_department (
            id,
            tenant_id,
            organization_id,
            parent_department_id,
            code,
            name,
            department_kind,
            path,
            cost_center_code,
            manager_membership_id,
            status,
            created_at,
            updated_at
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)
        "#,
    )
    .bind(department_id.as_str())
    .bind(subject.tenant_id.to_string())
    .bind(organization_id.as_str())
    .bind(parent_department_id.as_deref())
    .bind(code.as_str())
    .bind(name.as_str())
    .bind(department_kind.as_str())
    .bind(path.as_str())
    .bind(cost_center_code.as_deref())
    .bind(manager_membership_id.as_deref())
    .bind(status.as_str())
    .bind(now.as_str())
    .bind(now.as_str())
    .execute(pool)
    .await
    .map_err(command_sql_error)?;

    load_sqlite_department(pool, subject.tenant_id, department_id.as_str()).await
}

async fn create_postgres_department(
    pool: &PgPool,
    subject: AppIamDirectorySubject,
    request: DepartmentCommandRequest,
) -> Result<AppIamDepartmentItem, AdminAppbaseBackendIamCommandError> {
    ensure_postgres_department_table(pool).await?;
    let organization_id =
        normalize_required_text(request.organization_id.as_deref(), "organizationId")?;
    ensure_postgres_organization_exists(pool, subject, organization_id.as_str()).await?;
    ensure_postgres_organization_membership(pool, subject, organization_id.as_str()).await?;

    let department_id = next_claw_runtime_id("appbase backend IAM department")
        .map_err(|error| AdminAppbaseBackendIamCommandError::System(error.to_string()))?
        .to_string();
    let name = normalize_required_text(request.name.as_deref(), "name")?;
    let code = unique_postgres_department_code(
        pool,
        subject.tenant_id,
        organization_id.as_str(),
        request.code.as_deref(),
        name.as_str(),
        department_id.as_str(),
    )
    .await?;
    let parent_department_id = normalize_optional_text(
        request.parent_department_id.as_deref(),
        "parentDepartmentId",
    )?;
    let parent_path = match parent_department_id.as_deref() {
        Some(parent_id) => {
            let parent = load_postgres_department(pool, subject.tenant_id, parent_id).await?;
            if parent.organization_id != organization_id {
                return Err(AdminAppbaseBackendIamCommandError::BadRequest(
                    "parentDepartmentId must belong to the same organization".to_owned(),
                ));
            }
            Some(parent.path)
        }
        None => None,
    };
    let path = department_path(parent_path.as_deref(), department_id.as_str());
    let department_kind = normalize_department_kind(request.department_kind.as_deref())?;
    let cost_center_code =
        normalize_optional_text(request.cost_center_code.as_deref(), "costCenterCode")?;
    let manager_membership_id = normalize_optional_text(
        request.manager_membership_id.as_deref(),
        "managerMembershipId",
    )?;
    let status = normalize_status(request.status.as_deref(), "active")?;
    let now = current_timestamp_string();

    sqlx::query(
        r#"
        INSERT INTO iam_department (
            id,
            tenant_id,
            organization_id,
            parent_department_id,
            code,
            name,
            department_kind,
            path,
            cost_center_code,
            manager_membership_id,
            status,
            created_at,
            updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::timestamptz, $13::timestamptz)
        "#,
    )
    .bind(department_id.as_str())
    .bind(subject.tenant_id.to_string())
    .bind(organization_id.as_str())
    .bind(parent_department_id.as_deref())
    .bind(code.as_str())
    .bind(name.as_str())
    .bind(department_kind.as_str())
    .bind(path.as_str())
    .bind(cost_center_code.as_deref())
    .bind(manager_membership_id.as_deref())
    .bind(status.as_str())
    .bind(now.as_str())
    .bind(now.as_str())
    .execute(pool)
    .await
    .map_err(command_sql_error)?;

    load_postgres_department(pool, subject.tenant_id, department_id.as_str()).await
}

async fn retrieve_sqlite_department(
    pool: &SqlitePool,
    subject: AppIamDirectorySubject,
    department_id: &str,
) -> Result<AppIamDepartmentItem, AdminAppbaseBackendIamCommandError> {
    ensure_sqlite_department_table(pool).await?;
    let item = load_sqlite_department(pool, subject.tenant_id, department_id).await?;
    ensure_sqlite_organization_membership(pool, subject, item.organization_id.as_str()).await?;
    Ok(item)
}

async fn retrieve_postgres_department(
    pool: &PgPool,
    subject: AppIamDirectorySubject,
    department_id: &str,
) -> Result<AppIamDepartmentItem, AdminAppbaseBackendIamCommandError> {
    ensure_postgres_department_table(pool).await?;
    let item = load_postgres_department(pool, subject.tenant_id, department_id).await?;
    ensure_postgres_organization_membership(pool, subject, item.organization_id.as_str()).await?;
    Ok(item)
}

async fn update_sqlite_department(
    pool: &SqlitePool,
    subject: AppIamDirectorySubject,
    department_id: &str,
    request: DepartmentCommandRequest,
) -> Result<AppIamDepartmentItem, AdminAppbaseBackendIamCommandError> {
    ensure_sqlite_department_table(pool).await?;
    let current = load_sqlite_department(pool, subject.tenant_id, department_id).await?;
    ensure_sqlite_organization_membership(pool, subject, current.organization_id.as_str()).await?;
    if let Some(organization_id) =
        normalize_optional_text(request.organization_id.as_deref(), "organizationId")?
    {
        if organization_id != current.organization_id {
            return Err(AdminAppbaseBackendIamCommandError::BadRequest(
                "organizationId cannot be changed by department update".to_owned(),
            ));
        }
    }

    let parent_department_id = if request.parent_department_id.is_some() {
        normalize_optional_text(
            request.parent_department_id.as_deref(),
            "parentDepartmentId",
        )?
    } else {
        current.parent_department_id.clone()
    };
    if parent_department_id.as_deref() == Some(department_id) {
        return Err(AdminAppbaseBackendIamCommandError::BadRequest(
            "parentDepartmentId cannot reference the same department".to_owned(),
        ));
    }
    let parent_path = match parent_department_id.as_deref() {
        Some(parent_id) => {
            let parent = load_sqlite_department(pool, subject.tenant_id, parent_id).await?;
            if parent.organization_id != current.organization_id {
                return Err(AdminAppbaseBackendIamCommandError::BadRequest(
                    "parentDepartmentId must belong to the same organization".to_owned(),
                ));
            }
            Some(parent.path)
        }
        None => None,
    };
    let path = department_path(parent_path.as_deref(), department_id);
    let code = if request.code.is_some() {
        normalize_required_text(request.code.as_deref(), "code")?
    } else {
        current.code
    };
    let name = if request.name.is_some() {
        normalize_required_text(request.name.as_deref(), "name")?
    } else {
        current.name
    };
    let department_kind = if request.department_kind.is_some() {
        Some(normalize_department_kind(
            request.department_kind.as_deref(),
        )?)
    } else {
        None
    };
    let cost_center_code =
        normalize_optional_text(request.cost_center_code.as_deref(), "costCenterCode")?;
    let manager_membership_id = normalize_optional_text(
        request.manager_membership_id.as_deref(),
        "managerMembershipId",
    )?;
    let status = if request.status.is_some() {
        normalize_status(request.status.as_deref(), "active")?
    } else {
        current.status
    };
    let now = current_timestamp_string();

    sqlx::query(
        r#"
        UPDATE iam_department
        SET parent_department_id = ?1,
            code = ?2,
            name = ?3,
            department_kind = COALESCE(?4, department_kind),
            cost_center_code = COALESCE(?5, cost_center_code),
            manager_membership_id = COALESCE(?6, manager_membership_id),
            status = ?7,
            path = ?8,
            updated_at = ?9
        WHERE CAST(tenant_id AS TEXT) = ?10
          AND CAST(id AS TEXT) = ?11
        "#,
    )
    .bind(parent_department_id.as_deref())
    .bind(code.as_str())
    .bind(name.as_str())
    .bind(department_kind.as_deref())
    .bind(cost_center_code.as_deref())
    .bind(manager_membership_id.as_deref())
    .bind(status.as_str())
    .bind(path.as_str())
    .bind(now.as_str())
    .bind(subject.tenant_id.to_string())
    .bind(department_id)
    .execute(pool)
    .await
    .map_err(command_sql_error)?;

    load_sqlite_department(pool, subject.tenant_id, department_id).await
}

async fn update_postgres_department(
    pool: &PgPool,
    subject: AppIamDirectorySubject,
    department_id: &str,
    request: DepartmentCommandRequest,
) -> Result<AppIamDepartmentItem, AdminAppbaseBackendIamCommandError> {
    ensure_postgres_department_table(pool).await?;
    let current = load_postgres_department(pool, subject.tenant_id, department_id).await?;
    ensure_postgres_organization_membership(pool, subject, current.organization_id.as_str())
        .await?;
    if let Some(organization_id) =
        normalize_optional_text(request.organization_id.as_deref(), "organizationId")?
    {
        if organization_id != current.organization_id {
            return Err(AdminAppbaseBackendIamCommandError::BadRequest(
                "organizationId cannot be changed by department update".to_owned(),
            ));
        }
    }

    let parent_department_id = if request.parent_department_id.is_some() {
        normalize_optional_text(
            request.parent_department_id.as_deref(),
            "parentDepartmentId",
        )?
    } else {
        current.parent_department_id.clone()
    };
    if parent_department_id.as_deref() == Some(department_id) {
        return Err(AdminAppbaseBackendIamCommandError::BadRequest(
            "parentDepartmentId cannot reference the same department".to_owned(),
        ));
    }
    let parent_path = match parent_department_id.as_deref() {
        Some(parent_id) => {
            let parent = load_postgres_department(pool, subject.tenant_id, parent_id).await?;
            if parent.organization_id != current.organization_id {
                return Err(AdminAppbaseBackendIamCommandError::BadRequest(
                    "parentDepartmentId must belong to the same organization".to_owned(),
                ));
            }
            Some(parent.path)
        }
        None => None,
    };
    let path = department_path(parent_path.as_deref(), department_id);
    let code = if request.code.is_some() {
        normalize_required_text(request.code.as_deref(), "code")?
    } else {
        current.code
    };
    let name = if request.name.is_some() {
        normalize_required_text(request.name.as_deref(), "name")?
    } else {
        current.name
    };
    let department_kind = if request.department_kind.is_some() {
        Some(normalize_department_kind(
            request.department_kind.as_deref(),
        )?)
    } else {
        None
    };
    let cost_center_code =
        normalize_optional_text(request.cost_center_code.as_deref(), "costCenterCode")?;
    let manager_membership_id = normalize_optional_text(
        request.manager_membership_id.as_deref(),
        "managerMembershipId",
    )?;
    let status = if request.status.is_some() {
        normalize_status(request.status.as_deref(), "active")?
    } else {
        current.status
    };
    let now = current_timestamp_string();

    sqlx::query(
        r#"
        UPDATE iam_department
        SET parent_department_id = $1,
            code = $2,
            name = $3,
            department_kind = COALESCE($4, department_kind),
            cost_center_code = COALESCE($5, cost_center_code),
            manager_membership_id = COALESCE($6, manager_membership_id),
            status = $7,
            path = $8,
            updated_at = $9::timestamptz
        WHERE tenant_id::text = $10
          AND id::text = $11
        "#,
    )
    .bind(parent_department_id.as_deref())
    .bind(code.as_str())
    .bind(name.as_str())
    .bind(department_kind.as_deref())
    .bind(cost_center_code.as_deref())
    .bind(manager_membership_id.as_deref())
    .bind(status.as_str())
    .bind(path.as_str())
    .bind(now.as_str())
    .bind(subject.tenant_id.to_string())
    .bind(department_id)
    .execute(pool)
    .await
    .map_err(command_sql_error)?;

    load_postgres_department(pool, subject.tenant_id, department_id).await
}

async fn delete_sqlite_department(
    pool: &SqlitePool,
    subject: AppIamDirectorySubject,
    department_id: &str,
) -> Result<bool, AdminAppbaseBackendIamCommandError> {
    ensure_sqlite_department_table(pool).await?;
    let current = load_sqlite_department(pool, subject.tenant_id, department_id).await?;
    ensure_sqlite_organization_membership(pool, subject, current.organization_id.as_str()).await?;
    let result = sqlx::query(
        r#"
        UPDATE iam_department
        SET status = 'archived',
            updated_at = ?1
        WHERE CAST(tenant_id AS TEXT) = ?2
          AND CAST(id AS TEXT) = ?3
        "#,
    )
    .bind(current_timestamp_string())
    .bind(subject.tenant_id.to_string())
    .bind(department_id)
    .execute(pool)
    .await?;
    Ok(result.rows_affected() > 0)
}

async fn delete_postgres_department(
    pool: &PgPool,
    subject: AppIamDirectorySubject,
    department_id: &str,
) -> Result<bool, AdminAppbaseBackendIamCommandError> {
    ensure_postgres_department_table(pool).await?;
    let current = load_postgres_department(pool, subject.tenant_id, department_id).await?;
    ensure_postgres_organization_membership(pool, subject, current.organization_id.as_str())
        .await?;
    let result = sqlx::query(
        r#"
        UPDATE iam_department
        SET status = 'archived',
            updated_at = $1::timestamptz
        WHERE tenant_id::text = $2
          AND id::text = $3
        "#,
    )
    .bind(current_timestamp_string())
    .bind(subject.tenant_id.to_string())
    .bind(department_id)
    .execute(pool)
    .await?;
    Ok(result.rows_affected() > 0)
}

async fn create_sqlite_creator_organization_membership(
    pool: &SqlitePool,
    subject: AppIamDirectorySubject,
    organization_id: &str,
    now: &str,
) -> Result<(), AdminAppbaseBackendIamCommandError> {
    ensure_sqlite_table(pool, "iam_organization_membership").await?;
    let id = next_iam_command_id("appbase backend IAM organization creator membership")?;
    sqlx::query(
        r#"
        INSERT OR IGNORE INTO iam_organization_membership
            (id, tenant_id, organization_id, user_id, membership_kind, display_name, is_primary, status, joined_at, created_at, updated_at)
        VALUES (?1, ?2, ?3, ?4, 'admin', NULL, 1, 'active', ?5, ?5, ?5)
        "#,
    )
    .bind(id.as_str())
    .bind(subject.tenant_id.to_string())
    .bind(organization_id)
    .bind(subject.user_id.to_string())
    .bind(now)
    .execute(pool)
    .await
    .map_err(command_sql_error)?;
    Ok(())
}

async fn create_postgres_creator_organization_membership(
    pool: &PgPool,
    subject: AppIamDirectorySubject,
    organization_id: &str,
    now: &str,
) -> Result<(), AdminAppbaseBackendIamCommandError> {
    ensure_postgres_table(pool, "iam_organization_membership").await?;
    let id = next_iam_command_id("appbase backend IAM organization creator membership")?;
    sqlx::query(
        r#"
        INSERT INTO iam_organization_membership
            (id, tenant_id, organization_id, user_id, membership_kind, display_name, is_primary, status, joined_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, 'admin', NULL, 1, 'active', $5::timestamptz, $5::timestamptz, $5::timestamptz)
        ON CONFLICT (tenant_id, organization_id, user_id, membership_kind) DO NOTHING
        "#,
    )
    .bind(id.as_str())
    .bind(subject.tenant_id.to_string())
    .bind(organization_id)
    .bind(subject.user_id.to_string())
    .bind(now)
    .execute(pool)
    .await
    .map_err(command_sql_error)?;
    Ok(())
}

async fn ensure_sqlite_department_table(
    pool: &SqlitePool,
) -> Result<(), AdminAppbaseBackendIamCommandError> {
    if sqlite_table_exists(pool, "iam_department").await? {
        Ok(())
    } else {
        Err(AdminAppbaseBackendIamCommandError::System(
            "appbase backend IAM department table is unavailable".to_owned(),
        ))
    }
}

async fn ensure_postgres_department_table(
    pool: &PgPool,
) -> Result<(), AdminAppbaseBackendIamCommandError> {
    if postgres_table_exists(pool, "iam_department").await? {
        Ok(())
    } else {
        Err(AdminAppbaseBackendIamCommandError::System(
            "appbase backend IAM department table is unavailable".to_owned(),
        ))
    }
}

async fn ensure_sqlite_organization_exists(
    pool: &SqlitePool,
    subject: AppIamDirectorySubject,
    organization_id: &str,
) -> Result<(), AdminAppbaseBackendIamCommandError> {
    if !sqlite_table_exists(pool, "iam_organization").await? {
        return Err(AdminAppbaseBackendIamCommandError::System(
            "appbase backend IAM organization table is unavailable".to_owned(),
        ));
    }
    let count = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT COUNT(1)
        FROM iam_organization
        WHERE CAST(tenant_id AS TEXT) = ?1
          AND CAST(id AS TEXT) = ?2
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(organization_id)
    .fetch_one(pool)
    .await?;
    if count > 0 {
        Ok(())
    } else {
        Err(AdminAppbaseBackendIamCommandError::NotFound(
            "organization was not found".to_owned(),
        ))
    }
}

async fn ensure_postgres_organization_exists(
    pool: &PgPool,
    subject: AppIamDirectorySubject,
    organization_id: &str,
) -> Result<(), AdminAppbaseBackendIamCommandError> {
    if !postgres_table_exists(pool, "iam_organization").await? {
        return Err(AdminAppbaseBackendIamCommandError::System(
            "appbase backend IAM organization table is unavailable".to_owned(),
        ));
    }
    let count = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT COUNT(1)
        FROM iam_organization
        WHERE tenant_id::text = $1
          AND id::text = $2
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(organization_id)
    .fetch_one(pool)
    .await?;
    if count > 0 {
        Ok(())
    } else {
        Err(AdminAppbaseBackendIamCommandError::NotFound(
            "organization was not found".to_owned(),
        ))
    }
}

async fn ensure_sqlite_organization_membership(
    pool: &SqlitePool,
    subject: AppIamDirectorySubject,
    organization_id: &str,
) -> Result<(), AdminAppbaseBackendIamCommandError> {
    if !sqlite_table_exists(pool, "iam_organization_membership").await? {
        return Err(AdminAppbaseBackendIamCommandError::System(
            "appbase backend IAM organization membership table is unavailable".to_owned(),
        ));
    }
    let has_membership = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT COUNT(1)
        FROM iam_organization_membership
        WHERE CAST(tenant_id AS TEXT) = ?1
          AND CAST(organization_id AS TEXT) = ?2
          AND CAST(user_id AS TEXT) = ?3
          AND (LOWER(CAST(status AS TEXT)) = 'active' OR CAST(status AS TEXT) = '1')
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(organization_id)
    .bind(subject.user_id.to_string())
    .fetch_one(pool)
    .await?
        > 0;

    if has_membership {
        Ok(())
    } else {
        Err(AdminAppbaseBackendIamCommandError::Forbidden(
            "active organization membership is required for department command".to_owned(),
        ))
    }
}

async fn ensure_postgres_organization_membership(
    pool: &PgPool,
    subject: AppIamDirectorySubject,
    organization_id: &str,
) -> Result<(), AdminAppbaseBackendIamCommandError> {
    if !postgres_table_exists(pool, "iam_organization_membership").await? {
        return Err(AdminAppbaseBackendIamCommandError::System(
            "appbase backend IAM organization membership table is unavailable".to_owned(),
        ));
    }
    let has_membership = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT COUNT(1)
        FROM iam_organization_membership
        WHERE tenant_id::text = $1
          AND organization_id::text = $2
          AND user_id::text = $3
          AND (LOWER(status::text) = 'active' OR status::text = '1')
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(organization_id)
    .bind(subject.user_id.to_string())
    .fetch_one(pool)
    .await?
        > 0;

    if has_membership {
        Ok(())
    } else {
        Err(AdminAppbaseBackendIamCommandError::Forbidden(
            "active organization membership is required for department command".to_owned(),
        ))
    }
}

async fn load_sqlite_department(
    pool: &SqlitePool,
    tenant_id: i64,
    department_id: &str,
) -> Result<AppIamDepartmentItem, AdminAppbaseBackendIamCommandError> {
    let row = sqlx::query(
        r#"
        SELECT
            CAST(id AS TEXT) AS id,
            CAST(tenant_id AS TEXT) AS tenant_id,
            CAST(organization_id AS TEXT) AS organization_id,
            CAST(parent_department_id AS TEXT) AS parent_department_id,
            COALESCE(code, '') AS code,
            COALESCE(name, '') AS name,
            COALESCE(path, '') AS path,
            COALESCE(CAST(status AS TEXT), '') AS status,
            COALESCE(CAST(created_at AS TEXT), '') AS created_at,
            COALESCE(CAST(updated_at AS TEXT), '') AS updated_at
        FROM iam_department
        WHERE CAST(tenant_id AS TEXT) = ?1
          AND CAST(id AS TEXT) = ?2
        "#,
    )
    .bind(tenant_id.to_string())
    .bind(department_id)
    .fetch_optional(pool)
    .await?;
    row.map(sqlite_department_item).transpose()?.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound("department was not found".to_owned())
    })
}

async fn load_postgres_department(
    pool: &PgPool,
    tenant_id: i64,
    department_id: &str,
) -> Result<AppIamDepartmentItem, AdminAppbaseBackendIamCommandError> {
    let row = sqlx::query(
        r#"
        SELECT
            id::text AS id,
            tenant_id::text AS tenant_id,
            organization_id::text AS organization_id,
            parent_department_id::text AS parent_department_id,
            COALESCE(code, '') AS code,
            COALESCE(name, '') AS name,
            COALESCE(path, '') AS path,
            COALESCE(status::text, '') AS status,
            COALESCE(created_at::text, '') AS created_at,
            COALESCE(updated_at::text, '') AS updated_at
        FROM iam_department
        WHERE tenant_id::text = $1
          AND id::text = $2
        "#,
    )
    .bind(tenant_id.to_string())
    .bind(department_id)
    .fetch_optional(pool)
    .await?;
    row.map(postgres_department_item)
        .transpose()?
        .ok_or_else(|| {
            AdminAppbaseBackendIamCommandError::NotFound("department was not found".to_owned())
        })
}

fn sqlite_department_item(
    row: sqlx::sqlite::SqliteRow,
) -> Result<AppIamDepartmentItem, AdminAppbaseBackendIamCommandError> {
    Ok(AppIamDepartmentItem {
        id: sqlite_string_cell(&row, "id"),
        tenant_id: sqlite_string_cell(&row, "tenant_id"),
        organization_id: sqlite_string_cell(&row, "organization_id"),
        parent_department_id: sqlite_optional_string_cell(&row, "parent_department_id"),
        code: sqlite_string_cell(&row, "code"),
        name: sqlite_string_cell(&row, "name"),
        path: sqlite_string_cell(&row, "path"),
        status: sqlite_string_cell(&row, "status"),
        created_at: sqlite_string_cell(&row, "created_at"),
        updated_at: sqlite_string_cell(&row, "updated_at"),
    })
}

fn postgres_department_item(
    row: sqlx::postgres::PgRow,
) -> Result<AppIamDepartmentItem, AdminAppbaseBackendIamCommandError> {
    Ok(AppIamDepartmentItem {
        id: postgres_string_cell(&row, "id"),
        tenant_id: postgres_string_cell(&row, "tenant_id"),
        organization_id: postgres_string_cell(&row, "organization_id"),
        parent_department_id: postgres_optional_string_cell(&row, "parent_department_id"),
        code: postgres_string_cell(&row, "code"),
        name: postgres_string_cell(&row, "name"),
        path: postgres_string_cell(&row, "path"),
        status: postgres_string_cell(&row, "status"),
        created_at: postgres_string_cell(&row, "created_at"),
        updated_at: postgres_string_cell(&row, "updated_at"),
    })
}

fn department_path(parent_path: Option<&str>, department_id: &str) -> String {
    match parent_path.map(str::trim).filter(|value| !value.is_empty()) {
        Some(parent_path) => format!("{}/{}", parent_path.trim_end_matches('/'), department_id),
        None => format!("/{department_id}"),
    }
}

fn command_sql_error(error: sqlx::Error) -> AdminAppbaseBackendIamCommandError {
    if is_unique_violation(&error) {
        AdminAppbaseBackendIamCommandError::Conflict("IAM record already exists".to_owned())
    } else {
        AdminAppbaseBackendIamCommandError::from(error)
    }
}

fn is_unique_violation(error: &sqlx::Error) -> bool {
    error
        .as_database_error()
        .and_then(|error| error.code())
        .is_some_and(|code| matches!(code.as_ref(), "23505" | "2067" | "1555"))
}

async fn execute_sqlite_command(
    pool: &SqlitePool,
    subject: AppIamDirectorySubject,
    command: IamBackendCommand,
    body: Value,
) -> Result<Value, AdminAppbaseBackendIamCommandError> {
    let now = current_timestamp_string();
    match command {
        IamBackendCommand::CreateOrganization => {
            ensure_sqlite_table(pool, "iam_organization").await?;
            ensure_sqlite_table(pool, "iam_organization_membership").await?;
            let id = next_iam_command_id("appbase backend IAM organization")?;
            let name = command_required_text(&body, &["name"], "name")?;
            let code = unique_sqlite_organization_code(
                pool,
                subject.tenant_id,
                command_text(&body, &["code"]).as_deref(),
                name.as_str(),
                id.as_str(),
            )
            .await?;
            let parent_id = command_optional_text(
                &body,
                &["parentOrganizationId", "parentId"],
                "parentOrganizationId",
            )?;
            let parent_path = match parent_id.as_deref() {
                Some(parent_id) => {
                    Some(sqlite_organization_path(pool, subject.tenant_id, parent_id).await?)
                }
                None => None,
            };
            let path = department_path(parent_path.as_deref(), id.as_str());
            let status = normalize_status(command_text(&body, &["status"]).as_deref(), "active")?;
            sqlx::query(
                r#"
                INSERT INTO iam_organization
                    (id, tenant_id, parent_id, code, name, path, status, created_at, updated_at)
                VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
                "#,
            )
            .bind(id.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(parent_id.as_deref())
            .bind(code.as_str())
            .bind(name.as_str())
            .bind(path.as_str())
            .bind(status.as_str())
            .bind(now.as_str())
            .bind(now.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            create_sqlite_creator_organization_membership(pool, subject, id.as_str(), now.as_str())
                .await?;
            Ok(json!({ "item": {
                "id": id,
                "tenantId": subject.tenant_id.to_string(),
                "code": code,
                "name": name,
                "organizationKind": command_text(&body, &["organizationKind"]).unwrap_or_else(|| "organization".to_owned()),
                "kind": "organization",
                "parentOrganizationId": parent_id,
                "parentId": parent_id,
                "status": status,
                "ownerUserId": command_text(&body, &["ownerUserId"]),
                "memberCount": 0,
                "departmentCount": 0,
                "sortWeight": 0,
                "createdAt": now,
                "updatedAt": now
            }}))
        }
        IamBackendCommand::RetrieveOrganization { id } => {
            let id = normalize_required_text(Some(id.as_str()), "organizationId")?;
            retrieve_sqlite_organization_value(pool, subject, id.as_str()).await
        }
        IamBackendCommand::UpdateOrganization { id } => {
            ensure_sqlite_table(pool, "iam_organization").await?;
            let id = normalize_required_text(Some(id.as_str()), "organizationId")?;
            let current = retrieve_sqlite_organization_value(pool, subject, id.as_str()).await?;
            let item = current["item"].clone();
            let code = command_optional_text(&body, &["code"], "code")?
                .unwrap_or_else(|| item["code"].as_str().unwrap_or_default().to_owned());
            let name = command_optional_text(&body, &["name"], "name")?
                .unwrap_or_else(|| item["name"].as_str().unwrap_or_default().to_owned());
            let parent_id =
                if body.get("parentOrganizationId").is_some() || body.get("parentId").is_some() {
                    command_optional_text(
                        &body,
                        &["parentOrganizationId", "parentId"],
                        "parentOrganizationId",
                    )?
                } else {
                    item["parentOrganizationId"].as_str().map(str::to_owned)
                };
            if parent_id.as_deref() == Some(id.as_str()) {
                return Err(AdminAppbaseBackendIamCommandError::BadRequest(
                    "parentOrganizationId cannot reference the same organization".to_owned(),
                ));
            }
            let parent_path = match parent_id.as_deref() {
                Some(parent_id) => {
                    Some(sqlite_organization_path(pool, subject.tenant_id, parent_id).await?)
                }
                None => None,
            };
            let path = department_path(parent_path.as_deref(), id.as_str());
            let status = if body.get("status").is_some() {
                normalize_status(command_text(&body, &["status"]).as_deref(), "active")?
            } else {
                item["status"].as_str().unwrap_or("active").to_owned()
            };
            sqlx::query(
                r#"
                UPDATE iam_organization
                SET parent_id = ?1,
                    code = ?2,
                    name = ?3,
                    path = ?4,
                    status = ?5,
                    updated_at = ?6
                WHERE CAST(tenant_id AS TEXT) = ?7
                  AND CAST(id AS TEXT) = ?8
                "#,
            )
            .bind(parent_id.as_deref())
            .bind(code.as_str())
            .bind(name.as_str())
            .bind(path.as_str())
            .bind(status.as_str())
            .bind(now.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(id.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            retrieve_sqlite_organization_value(pool, subject, id.as_str()).await
        }
        IamBackendCommand::DeleteOrganization { id } => {
            ensure_sqlite_table(pool, "iam_organization").await?;
            let id = normalize_required_text(Some(id.as_str()), "organizationId")?;
            let result = sqlx::query(
                r#"
                UPDATE iam_organization
                SET status = 'archived',
                    updated_at = ?1
                WHERE CAST(tenant_id AS TEXT) = ?2
                  AND CAST(id AS TEXT) = ?3
                "#,
            )
            .bind(now.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(id.as_str())
            .execute(pool)
            .await?;
            deleted_result(result.rows_affected())
        }
        IamBackendCommand::CreateOrganizationMembership => {
            ensure_sqlite_table(pool, "iam_organization_membership").await?;
            let id = next_iam_command_id("appbase backend IAM organization membership")?;
            let organization_id =
                command_required_text(&body, &["organizationId"], "organizationId")?;
            ensure_sqlite_organization_exists(pool, subject, organization_id.as_str()).await?;
            let user_id = command_required_text(&body, &["userId"], "userId")?;
            let membership_kind =
                command_text(&body, &["memberKind"]).unwrap_or_else(|| "member".to_owned());
            let display_name = command_text(&body, &["displayName"]);
            let status = normalize_status(command_text(&body, &["status"]).as_deref(), "active")?;
            sqlx::query(
                r#"
                INSERT INTO iam_organization_membership
                    (id, tenant_id, organization_id, user_id, membership_kind, display_name, is_primary, status, joined_at, created_at, updated_at)
                VALUES (?1, ?2, ?3, ?4, ?5, ?6, 0, ?7, ?8, ?8, ?8)
                "#,
            )
            .bind(id.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(organization_id.as_str())
            .bind(user_id.as_str())
            .bind(membership_kind.as_str())
            .bind(display_name.as_deref())
            .bind(status.as_str())
            .bind(now.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            Ok(json!({ "item": {
                "id": id,
                "tenantId": subject.tenant_id.to_string(),
                "organizationId": organization_id,
                "userId": user_id,
                "displayName": display_name.unwrap_or_default(),
                "username": user_id,
                "email": command_text(&body, &["email"]).unwrap_or_default(),
                "mobile": command_text(&body, &["mobile"]).unwrap_or_default(),
                "memberKind": membership_kind,
                "role": membership_kind,
                "status": status,
                "joinedAt": now,
                "createdAt": now
            }}))
        }
        IamBackendCommand::UpdateOrganizationMembership { id } => {
            ensure_sqlite_table(pool, "iam_organization_membership").await?;
            let id = normalize_required_text(Some(id.as_str()), "membershipId")?;
            let status = normalize_status(command_text(&body, &["status"]).as_deref(), "active")?;
            let membership_kind = command_text(&body, &["memberKind"]);
            let result = sqlx::query(
                r#"
                UPDATE iam_organization_membership
                SET membership_kind = COALESCE(?1, membership_kind),
                    status = ?2
                WHERE CAST(tenant_id AS TEXT) = ?3
                  AND CAST(id AS TEXT) = ?4
                "#,
            )
            .bind(membership_kind.as_deref())
            .bind(status.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(id.as_str())
            .execute(pool)
            .await?;
            if result.rows_affected() == 0 {
                return Err(AdminAppbaseBackendIamCommandError::NotFound(
                    "organization membership was not found".to_owned(),
                ));
            }
            retrieve_sqlite_membership_value(pool, subject, id.as_str()).await
        }
        IamBackendCommand::CreateDepartmentAssignment => {
            ensure_sqlite_table(pool, "iam_department_assignment").await?;
            let department_id = command_required_text(&body, &["departmentId"], "departmentId")?;
            let department =
                retrieve_sqlite_department(pool, subject, department_id.as_str()).await?;
            let membership_id = command_required_text(
                &body,
                &["membershipId", "organizationMembershipId"],
                "membershipId",
            )?;
            let (membership_user_id, _) =
                sqlite_membership_user_and_organization(pool, subject, membership_id.as_str())
                    .await?;
            let id = next_iam_command_id("appbase backend IAM department assignment")?;
            let assignment_kind = command_text(&body, &["role", "assignmentKind"])
                .unwrap_or_else(|| "member".to_owned());
            let is_primary = command_bool(&body, &["isPrimary"], false);
            let status = normalize_status(command_text(&body, &["status"]).as_deref(), "active")?;
            sqlx::query(
                r#"
                INSERT INTO iam_department_assignment
                    (id, tenant_id, organization_id, organization_membership_id, department_id, user_id, assignment_kind, is_primary, effective_from, effective_to, status, created_at, updated_at)
                VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, NULL, ?10, ?11, ?12)
                "#,
            )
            .bind(id.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(department.organization_id.as_str())
            .bind(membership_id.as_str())
            .bind(department_id.as_str())
            .bind(membership_user_id.as_str())
            .bind(assignment_kind.as_str())
            .bind(if is_primary { 1 } else { 0 })
            .bind(now.as_str())
            .bind(status.as_str())
            .bind(now.as_str())
            .bind(now.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            Ok(json!({ "item": {
                "id": id,
                "tenantId": subject.tenant_id.to_string(),
                "organizationId": department.organization_id,
                "departmentId": department_id,
                "membershipId": membership_id,
                "organizationMembershipId": membership_id,
                "userId": membership_user_id,
                "role": assignment_kind,
                "assignmentKind": assignment_kind,
                "status": status,
                "isPrimary": is_primary,
                "createdAt": now,
                "updatedAt": now
            }}))
        }
        IamBackendCommand::UpdateDepartmentAssignment { id } => {
            let id = normalize_required_text(Some(id.as_str()), "assignmentId")?;
            update_status_only_sqlite(
                pool,
                "iam_department_assignment",
                subject.tenant_id,
                id.as_str(),
                normalize_status(command_text(&body, &["status"]).as_deref(), "active")?.as_str(),
                now.as_str(),
            )
            .await?;
            retrieve_sqlite_department_assignment_value(pool, subject, id.as_str()).await
        }
        IamBackendCommand::CreatePosition => {
            ensure_sqlite_table(pool, "iam_position").await?;
            let organization_id =
                command_required_text(&body, &["organizationId"], "organizationId")?;
            ensure_sqlite_organization_exists(pool, subject, organization_id.as_str()).await?;
            ensure_sqlite_organization_membership(pool, subject, organization_id.as_str()).await?;
            let department_id = command_optional_text(&body, &["departmentId"], "departmentId")?;
            if let Some(department_id) = department_id.as_deref() {
                let department = retrieve_sqlite_department(pool, subject, department_id).await?;
                if department.organization_id != organization_id {
                    return Err(AdminAppbaseBackendIamCommandError::BadRequest(
                        "departmentId must belong to organizationId".to_owned(),
                    ));
                }
            }
            let id = next_iam_command_id("appbase backend IAM position")?;
            let name = command_required_text(&body, &["name"], "name")?;
            let code = unique_sqlite_position_code(
                pool,
                subject.tenant_id,
                organization_id.as_str(),
                command_text(&body, &["code"]).as_deref(),
                name.as_str(),
                id.as_str(),
            )
            .await?;
            let rank_level = command_i64(&body, &["rankLevel"], 0);
            let status = normalize_status(command_text(&body, &["status"]).as_deref(), "active")?;
            sqlx::query(
                r#"
                INSERT INTO iam_position
                    (id, tenant_id, organization_id, department_id, code, name, position_kind, rank_level, status, created_at, updated_at)
                VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'position', ?7, ?8, ?9, ?10)
                "#,
            )
            .bind(id.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(organization_id.as_str())
            .bind(department_id.as_deref())
            .bind(code.as_str())
            .bind(name.as_str())
            .bind(rank_level)
            .bind(status.as_str())
            .bind(now.as_str())
            .bind(now.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            Ok(position_json(
                id,
                subject.tenant_id.to_string(),
                organization_id,
                department_id,
                code,
                name,
                rank_level.to_string(),
                status,
                now.clone(),
                now,
            ))
        }
        IamBackendCommand::RetrievePosition { id } => {
            retrieve_sqlite_position_value(pool, subject, id.as_str()).await
        }
        IamBackendCommand::UpdatePosition { id } => {
            let id = normalize_required_text(Some(id.as_str()), "positionId")?;
            let current = retrieve_sqlite_position_value(pool, subject, id.as_str()).await?;
            let item = current["item"].clone();
            let code = command_optional_text(&body, &["code"], "code")?
                .unwrap_or_else(|| item["code"].as_str().unwrap_or_default().to_owned());
            let name = command_optional_text(&body, &["name"], "name")?
                .unwrap_or_else(|| item["name"].as_str().unwrap_or_default().to_owned());
            let department_id = if body.get("departmentId").is_some() {
                command_optional_text(&body, &["departmentId"], "departmentId")?
            } else {
                item["departmentId"].as_str().map(str::to_owned)
            };
            let rank_level = command_i64(
                &body,
                &["rankLevel"],
                item["rankLevel"].as_i64().unwrap_or_default(),
            );
            let status = if body.get("status").is_some() {
                normalize_status(command_text(&body, &["status"]).as_deref(), "active")?
            } else {
                item["status"].as_str().unwrap_or("active").to_owned()
            };
            sqlx::query(
                r#"
                UPDATE iam_position
                SET department_id = ?1,
                    code = ?2,
                    name = ?3,
                    rank_level = ?4,
                    status = ?5,
                    updated_at = ?6
                WHERE CAST(tenant_id AS TEXT) = ?7
                  AND CAST(id AS TEXT) = ?8
                "#,
            )
            .bind(department_id.as_deref())
            .bind(code.as_str())
            .bind(name.as_str())
            .bind(rank_level)
            .bind(status.as_str())
            .bind(now.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(id.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            retrieve_sqlite_position_value(pool, subject, id.as_str()).await
        }
        IamBackendCommand::DeletePosition { id } => {
            update_delete_status_sqlite(
                pool,
                "iam_position",
                subject.tenant_id,
                id.as_str(),
                now.as_str(),
            )
            .await
        }
        IamBackendCommand::CreatePositionAssignment => {
            ensure_sqlite_table(pool, "iam_position_assignment").await?;
            let position_id = command_required_text(&body, &["positionId"], "positionId")?;
            let position =
                retrieve_sqlite_position_value(pool, subject, position_id.as_str()).await?;
            let organization_id = position["item"]["organizationId"]
                .as_str()
                .unwrap_or_default()
                .to_owned();
            let department_assignment_id = command_required_text(
                &body,
                &["membershipId", "departmentAssignmentId"],
                "membershipId",
            )?;
            let (user_id, assignment_organization_id) =
                sqlite_department_assignment_user_and_organization(
                    pool,
                    subject,
                    department_assignment_id.as_str(),
                )
                .await?;
            if assignment_organization_id != organization_id {
                return Err(AdminAppbaseBackendIamCommandError::BadRequest(
                    "membershipId must belong to the same organization as positionId".to_owned(),
                ));
            }
            let id = next_iam_command_id("appbase backend IAM position assignment")?;
            let status = normalize_status(command_text(&body, &["status"]).as_deref(), "active")?;
            let effective_from =
                command_text(&body, &["startedAt", "effectiveFrom"]).unwrap_or_else(|| now.clone());
            let effective_to = command_text(&body, &["endedAt", "effectiveTo"]);
            sqlx::query(
                r#"
                INSERT INTO iam_position_assignment
                    (id, tenant_id, organization_id, department_assignment_id, position_id, user_id, is_primary, effective_from, effective_to, status, created_at, updated_at)
                VALUES (?1, ?2, ?3, ?4, ?5, ?6, 0, ?7, ?8, ?9, ?10, ?11)
                "#,
            )
            .bind(id.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(organization_id.as_str())
            .bind(department_assignment_id.as_str())
            .bind(position_id.as_str())
            .bind(user_id.as_str())
            .bind(effective_from.as_str())
            .bind(effective_to.as_deref())
            .bind(status.as_str())
            .bind(now.as_str())
            .bind(now.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            Ok(json!({ "item": {
                "id": id,
                "tenantId": subject.tenant_id.to_string(),
                "organizationId": organization_id,
                "positionId": position_id,
                "membershipId": department_assignment_id,
                "departmentAssignmentId": department_assignment_id,
                "userId": user_id,
                "status": status,
                "isPrimary": false,
                "startedAt": effective_from,
                "endedAt": effective_to,
                "createdAt": now,
                "updatedAt": now
            }}))
        }
        IamBackendCommand::UpdatePositionAssignment { id } => {
            let id = normalize_required_text(Some(id.as_str()), "assignmentId")?;
            update_status_only_sqlite(
                pool,
                "iam_position_assignment",
                subject.tenant_id,
                id.as_str(),
                normalize_status(command_text(&body, &["status"]).as_deref(), "active")?.as_str(),
                now.as_str(),
            )
            .await?;
            retrieve_sqlite_position_assignment_value(pool, subject, id.as_str()).await
        }
        IamBackendCommand::CreateRole => {
            ensure_sqlite_table(pool, "iam_role").await?;
            let id = next_iam_command_id("appbase backend IAM role")?;
            let code = command_required_text(&body, &["code"], "code")?;
            let name = command_required_text(&body, &["name"], "name")?;
            let status = normalize_status(command_text(&body, &["status"]).as_deref(), "active")?;
            sqlx::query(
                r#"
                INSERT INTO iam_role (id, tenant_id, code, name, status, created_at, updated_at)
                VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
                "#,
            )
            .bind(id.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(code.as_str())
            .bind(name.as_str())
            .bind(status.as_str())
            .bind(now.as_str())
            .bind(now.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            Ok(json!({ "item": role_value(id, code, name, status, now.clone(), now) }))
        }
        IamBackendCommand::RetrieveRole { id } => {
            retrieve_sqlite_role_value(pool, subject, id.as_str()).await
        }
        IamBackendCommand::UpdateRole { id } => {
            let id = normalize_required_text(Some(id.as_str()), "roleId")?;
            let current = retrieve_sqlite_role_value(pool, subject, id.as_str()).await?;
            let item = current["item"].clone();
            let code = command_optional_text(&body, &["code"], "code")?
                .unwrap_or_else(|| item["code"].as_str().unwrap_or_default().to_owned());
            let name = command_optional_text(&body, &["name"], "name")?
                .unwrap_or_else(|| item["name"].as_str().unwrap_or_default().to_owned());
            let status = if body.get("status").is_some() {
                normalize_status(command_text(&body, &["status"]).as_deref(), "active")?
            } else {
                item["status"].as_str().unwrap_or("active").to_owned()
            };
            sqlx::query(
                r#"
                UPDATE iam_role
                SET code = ?1,
                    name = ?2,
                    status = ?3,
                    updated_at = ?4
                WHERE CAST(tenant_id AS TEXT) = ?5
                  AND CAST(id AS TEXT) = ?6
                "#,
            )
            .bind(code.as_str())
            .bind(name.as_str())
            .bind(status.as_str())
            .bind(now.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(id.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            retrieve_sqlite_role_value(pool, subject, id.as_str()).await
        }
        IamBackendCommand::DeleteRole { id } => {
            update_delete_status_sqlite(
                pool,
                "iam_role",
                subject.tenant_id,
                id.as_str(),
                now.as_str(),
            )
            .await
        }
        IamBackendCommand::CreatePermission => {
            ensure_sqlite_table(pool, "iam_permission").await?;
            let id = next_iam_command_id("appbase backend IAM permission")?;
            let code = command_required_text(&body, &["code"], "code")?;
            let name = command_required_text(&body, &["name"], "name")?;
            let resource = command_optional_text(&body, &["resource"], "resource")?
                .unwrap_or_else(|| code.split('.').next().unwrap_or("iam").to_owned());
            let action = command_optional_text(&body, &["action"], "action")?
                .unwrap_or_else(|| code.rsplit('.').next().unwrap_or("manage").to_owned());
            sqlx::query(
                r#"
                INSERT INTO iam_permission (id, code, name, resource, action, created_at)
                VALUES (?1, ?2, ?3, ?4, ?5, ?6)
                "#,
            )
            .bind(id.as_str())
            .bind(code.as_str())
            .bind(name.as_str())
            .bind(resource.as_str())
            .bind(action.as_str())
            .bind(now.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            Ok(json!({ "item": permission_value(id, code, name, resource, action, now) }))
        }
        IamBackendCommand::RetrievePermission { id } => {
            retrieve_sqlite_permission_value(pool, id.as_str()).await
        }
        IamBackendCommand::UpdatePermission { id } => {
            let id = normalize_required_text(Some(id.as_str()), "permissionId")?;
            let current = retrieve_sqlite_permission_value(pool, id.as_str()).await?;
            let item = current["item"].clone();
            let code = command_optional_text(&body, &["code"], "code")?
                .unwrap_or_else(|| item["code"].as_str().unwrap_or_default().to_owned());
            let name = command_optional_text(&body, &["name"], "name")?
                .unwrap_or_else(|| item["name"].as_str().unwrap_or_default().to_owned());
            let resource = command_optional_text(&body, &["resource"], "resource")?
                .unwrap_or_else(|| item["resource"].as_str().unwrap_or_default().to_owned());
            let action = command_optional_text(&body, &["action"], "action")?
                .unwrap_or_else(|| item["action"].as_str().unwrap_or_default().to_owned());
            sqlx::query(
                r#"
                UPDATE iam_permission
                SET code = ?1,
                    name = ?2,
                    resource = ?3,
                    action = ?4
                WHERE CAST(id AS TEXT) = ?5
                "#,
            )
            .bind(code.as_str())
            .bind(name.as_str())
            .bind(resource.as_str())
            .bind(action.as_str())
            .bind(id.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            retrieve_sqlite_permission_value(pool, id.as_str()).await
        }
        IamBackendCommand::DeletePermission { id } => {
            let id = normalize_required_text(Some(id.as_str()), "permissionId")?;
            let result = sqlx::query("DELETE FROM iam_permission WHERE CAST(id AS TEXT) = ?1")
                .bind(id.as_str())
                .execute(pool)
                .await?;
            deleted_result(result.rows_affected())
        }
        IamBackendCommand::GrantRolePermission { role_id } => {
            ensure_sqlite_table(pool, "iam_role_permission").await?;
            let role_id = normalize_required_text(Some(role_id.as_str()), "roleId")?;
            let permission_id =
                command_required_text(&body, &["permissionId", "id"], "permissionId")?;
            let id = next_iam_command_id("appbase backend IAM role permission")?;
            sqlx::query(
                r#"
                INSERT INTO iam_role_permission (id, tenant_id, role_id, permission_id, created_at)
                VALUES (?1, ?2, ?3, ?4, ?5)
                "#,
            )
            .bind(id.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(role_id.as_str())
            .bind(permission_id.as_str())
            .bind(now.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            retrieve_sqlite_permission_value(pool, permission_id.as_str()).await
        }
        IamBackendCommand::RevokeRolePermission {
            role_id,
            permission_id,
        } => {
            let role_id = normalize_required_text(Some(role_id.as_str()), "roleId")?;
            let permission_id =
                normalize_required_text(Some(permission_id.as_str()), "permissionId")?;
            let result = sqlx::query(
                r#"
                DELETE FROM iam_role_permission
                WHERE CAST(tenant_id AS TEXT) = ?1
                  AND CAST(role_id AS TEXT) = ?2
                  AND CAST(permission_id AS TEXT) = ?3
                "#,
            )
            .bind(subject.tenant_id.to_string())
            .bind(role_id.as_str())
            .bind(permission_id.as_str())
            .execute(pool)
            .await?;
            deleted_result(result.rows_affected())
        }
        IamBackendCommand::CreateRoleBinding => {
            ensure_sqlite_table(pool, "iam_role_binding").await?;
            let id = next_iam_command_id("appbase backend IAM role binding")?;
            let role_id = command_required_text(&body, &["roleId"], "roleId")?;
            let principal_kind =
                command_required_text(&body, &["principalKind", "principalType"], "principalKind")?;
            let principal_id = command_required_text(&body, &["principalId"], "principalId")?;
            let scope_kind = command_required_text(&body, &["scopeKind"], "scopeKind")?;
            let scope_id = command_required_text(&body, &["scopeId"], "scopeId")?;
            let status = normalize_status(command_text(&body, &["status"]).as_deref(), "active")?;
            sqlx::query(
                r#"
                INSERT INTO iam_role_binding
                    (id, tenant_id, role_id, principal_kind, principal_id, scope_kind, scope_id, effect, condition_json, status, created_at, updated_at)
                VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 'allow', NULL, ?8, ?9, ?10)
                "#,
            )
            .bind(id.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(role_id.as_str())
            .bind(principal_kind.as_str())
            .bind(principal_id.as_str())
            .bind(scope_kind.as_str())
            .bind(scope_id.as_str())
            .bind(status.as_str())
            .bind(now.as_str())
            .bind(now.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            Ok(json!({ "item": {
                "id": id,
                "tenantId": subject.tenant_id.to_string(),
                "roleId": role_id,
                "principalKind": principal_kind,
                "principalType": principal_kind,
                "principalId": principal_id,
                "organizationId": if scope_kind == "organization" { Value::String(scope_id.clone()) } else { Value::Null },
                "departmentId": if scope_kind == "department" { Value::String(scope_id.clone()) } else { Value::Null },
                "scopeKind": scope_kind,
                "scopeId": scope_id,
                "effect": "allow",
                "conditionJson": "",
                "status": status,
                "createdAt": now,
                "updatedAt": now
            }}))
        }
        IamBackendCommand::DeleteRoleBinding { id } => {
            update_delete_status_sqlite(
                pool,
                "iam_role_binding",
                subject.tenant_id,
                id.as_str(),
                now.as_str(),
            )
            .await
        }
    }
}

async fn execute_postgres_command(
    pool: &PgPool,
    subject: AppIamDirectorySubject,
    command: IamBackendCommand,
    body: Value,
) -> Result<Value, AdminAppbaseBackendIamCommandError> {
    let now = current_timestamp_string();
    match command {
        IamBackendCommand::CreateOrganization => {
            ensure_postgres_table(pool, "iam_organization").await?;
            ensure_postgres_table(pool, "iam_organization_membership").await?;
            let id = next_iam_command_id("appbase backend IAM organization")?;
            let name = command_required_text(&body, &["name"], "name")?;
            let code = unique_postgres_organization_code(
                pool,
                subject.tenant_id,
                command_text(&body, &["code"]).as_deref(),
                name.as_str(),
                id.as_str(),
            )
            .await?;
            let parent_id = command_optional_text(
                &body,
                &["parentOrganizationId", "parentId"],
                "parentOrganizationId",
            )?;
            let parent_path = match parent_id.as_deref() {
                Some(parent_id) => {
                    Some(postgres_organization_path(pool, subject.tenant_id, parent_id).await?)
                }
                None => None,
            };
            let path = department_path(parent_path.as_deref(), id.as_str());
            let status = normalize_status(command_text(&body, &["status"]).as_deref(), "active")?;
            sqlx::query(
                r#"
                INSERT INTO iam_organization
                    (id, tenant_id, parent_id, code, name, path, status, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8::timestamptz, $8::timestamptz)
                "#,
            )
            .bind(id.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(parent_id.as_deref())
            .bind(code.as_str())
            .bind(name.as_str())
            .bind(path.as_str())
            .bind(status.as_str())
            .bind(now.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            create_postgres_creator_organization_membership(
                pool,
                subject,
                id.as_str(),
                now.as_str(),
            )
            .await?;
            Ok(json!({ "item": {
                "id": id,
                "tenantId": subject.tenant_id.to_string(),
                "code": code,
                "name": name,
                "organizationKind": command_text(&body, &["organizationKind"]).unwrap_or_else(|| "organization".to_owned()),
                "kind": "organization",
                "parentOrganizationId": parent_id,
                "parentId": parent_id,
                "status": status,
                "ownerUserId": command_text(&body, &["ownerUserId"]),
                "memberCount": 0,
                "departmentCount": 0,
                "sortWeight": 0,
                "createdAt": now,
                "updatedAt": now
            }}))
        }
        IamBackendCommand::RetrieveOrganization { id } => {
            let id = normalize_required_text(Some(id.as_str()), "organizationId")?;
            retrieve_postgres_organization_value(pool, subject, id.as_str()).await
        }
        IamBackendCommand::UpdateOrganization { id } => {
            ensure_postgres_table(pool, "iam_organization").await?;
            let id = normalize_required_text(Some(id.as_str()), "organizationId")?;
            let current = retrieve_postgres_organization_value(pool, subject, id.as_str()).await?;
            let item = current["item"].clone();
            let code = command_optional_text(&body, &["code"], "code")?
                .unwrap_or_else(|| item["code"].as_str().unwrap_or_default().to_owned());
            let name = command_optional_text(&body, &["name"], "name")?
                .unwrap_or_else(|| item["name"].as_str().unwrap_or_default().to_owned());
            let parent_id =
                if body.get("parentOrganizationId").is_some() || body.get("parentId").is_some() {
                    command_optional_text(
                        &body,
                        &["parentOrganizationId", "parentId"],
                        "parentOrganizationId",
                    )?
                } else {
                    item["parentOrganizationId"].as_str().map(str::to_owned)
                };
            if parent_id.as_deref() == Some(id.as_str()) {
                return Err(AdminAppbaseBackendIamCommandError::BadRequest(
                    "parentOrganizationId cannot reference the same organization".to_owned(),
                ));
            }
            let parent_path = match parent_id.as_deref() {
                Some(parent_id) => {
                    Some(postgres_organization_path(pool, subject.tenant_id, parent_id).await?)
                }
                None => None,
            };
            let path = department_path(parent_path.as_deref(), id.as_str());
            let status = if body.get("status").is_some() {
                normalize_status(command_text(&body, &["status"]).as_deref(), "active")?
            } else {
                item["status"].as_str().unwrap_or("active").to_owned()
            };
            sqlx::query(
                r#"
                UPDATE iam_organization
                SET parent_id = $1,
                    code = $2,
                    name = $3,
                    path = $4,
                    status = $5,
                    updated_at = $6::timestamptz
                WHERE tenant_id::text = $7
                  AND id::text = $8
                "#,
            )
            .bind(parent_id.as_deref())
            .bind(code.as_str())
            .bind(name.as_str())
            .bind(path.as_str())
            .bind(status.as_str())
            .bind(now.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(id.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            retrieve_postgres_organization_value(pool, subject, id.as_str()).await
        }
        IamBackendCommand::DeleteOrganization { id } => {
            ensure_postgres_table(pool, "iam_organization").await?;
            let id = normalize_required_text(Some(id.as_str()), "organizationId")?;
            let result = sqlx::query(
                r#"
                UPDATE iam_organization
                SET status = 'archived',
                    updated_at = $1::timestamptz
                WHERE tenant_id::text = $2
                  AND id::text = $3
                "#,
            )
            .bind(now.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(id.as_str())
            .execute(pool)
            .await?;
            deleted_result(result.rows_affected())
        }
        IamBackendCommand::CreateOrganizationMembership => {
            ensure_postgres_table(pool, "iam_organization_membership").await?;
            let id = next_iam_command_id("appbase backend IAM organization membership")?;
            let organization_id =
                command_required_text(&body, &["organizationId"], "organizationId")?;
            ensure_postgres_organization_exists(pool, subject, organization_id.as_str()).await?;
            let user_id = command_required_text(&body, &["userId"], "userId")?;
            let membership_kind =
                command_text(&body, &["memberKind"]).unwrap_or_else(|| "member".to_owned());
            let display_name = command_text(&body, &["displayName"]);
            let status = normalize_status(command_text(&body, &["status"]).as_deref(), "active")?;
            sqlx::query(
                r#"
                INSERT INTO iam_organization_membership
                    (id, tenant_id, organization_id, user_id, membership_kind, display_name, is_primary, status, joined_at, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, 0, $7, $8::timestamptz, $8::timestamptz, $8::timestamptz)
                "#,
            )
            .bind(id.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(organization_id.as_str())
            .bind(user_id.as_str())
            .bind(membership_kind.as_str())
            .bind(display_name.as_deref())
            .bind(status.as_str())
            .bind(now.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            Ok(json!({ "item": {
                "id": id,
                "tenantId": subject.tenant_id.to_string(),
                "organizationId": organization_id,
                "userId": user_id,
                "displayName": display_name.unwrap_or_default(),
                "username": user_id,
                "email": command_text(&body, &["email"]).unwrap_or_default(),
                "mobile": command_text(&body, &["mobile"]).unwrap_or_default(),
                "memberKind": membership_kind,
                "role": membership_kind,
                "status": status,
                "joinedAt": now,
                "createdAt": now
            }}))
        }
        IamBackendCommand::UpdateOrganizationMembership { id } => {
            ensure_postgres_table(pool, "iam_organization_membership").await?;
            let id = normalize_required_text(Some(id.as_str()), "membershipId")?;
            let status = normalize_status(command_text(&body, &["status"]).as_deref(), "active")?;
            let membership_kind = command_text(&body, &["memberKind"]);
            let result = sqlx::query(
                r#"
                UPDATE iam_organization_membership
                SET membership_kind = COALESCE($1, membership_kind),
                    status = $2,
                    updated_at = $3::timestamptz
                WHERE tenant_id::text = $4
                  AND id::text = $5
                "#,
            )
            .bind(membership_kind.as_deref())
            .bind(status.as_str())
            .bind(now.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(id.as_str())
            .execute(pool)
            .await?;
            if result.rows_affected() == 0 {
                return Err(AdminAppbaseBackendIamCommandError::NotFound(
                    "organization membership was not found".to_owned(),
                ));
            }
            retrieve_postgres_membership_value(pool, subject, id.as_str()).await
        }
        IamBackendCommand::CreateDepartmentAssignment => {
            ensure_postgres_table(pool, "iam_department_assignment").await?;
            let department_id = command_required_text(&body, &["departmentId"], "departmentId")?;
            let department =
                retrieve_postgres_department(pool, subject, department_id.as_str()).await?;
            let membership_id = command_required_text(
                &body,
                &["membershipId", "organizationMembershipId"],
                "membershipId",
            )?;
            let (membership_user_id, _) =
                postgres_membership_user_and_organization(pool, subject, membership_id.as_str())
                    .await?;
            let id = next_iam_command_id("appbase backend IAM department assignment")?;
            let assignment_kind = command_text(&body, &["role", "assignmentKind"])
                .unwrap_or_else(|| "member".to_owned());
            let is_primary = command_bool(&body, &["isPrimary"], false);
            let status = normalize_status(command_text(&body, &["status"]).as_deref(), "active")?;
            sqlx::query(
                r#"
                INSERT INTO iam_department_assignment
                    (id, tenant_id, organization_id, organization_membership_id, department_id, user_id, assignment_kind, is_primary, effective_from, effective_to, status, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::timestamptz, NULL, $10, $11::timestamptz, $12::timestamptz)
                "#,
            )
            .bind(id.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(department.organization_id.as_str())
            .bind(membership_id.as_str())
            .bind(department_id.as_str())
            .bind(membership_user_id.as_str())
            .bind(assignment_kind.as_str())
            .bind(if is_primary { 1 } else { 0 })
            .bind(now.as_str())
            .bind(status.as_str())
            .bind(now.as_str())
            .bind(now.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            Ok(json!({ "item": {
                "id": id,
                "tenantId": subject.tenant_id.to_string(),
                "organizationId": department.organization_id,
                "departmentId": department_id,
                "membershipId": membership_id,
                "organizationMembershipId": membership_id,
                "userId": membership_user_id,
                "role": assignment_kind,
                "assignmentKind": assignment_kind,
                "status": status,
                "isPrimary": is_primary,
                "createdAt": now,
                "updatedAt": now
            }}))
        }
        IamBackendCommand::UpdateDepartmentAssignment { id } => {
            let id = normalize_required_text(Some(id.as_str()), "assignmentId")?;
            update_status_only_postgres(
                pool,
                "iam_department_assignment",
                subject.tenant_id,
                id.as_str(),
                normalize_status(command_text(&body, &["status"]).as_deref(), "active")?.as_str(),
                now.as_str(),
            )
            .await?;
            retrieve_postgres_department_assignment_value(pool, subject, id.as_str()).await
        }
        IamBackendCommand::CreatePosition => {
            ensure_postgres_table(pool, "iam_position").await?;
            let organization_id =
                command_required_text(&body, &["organizationId"], "organizationId")?;
            ensure_postgres_organization_exists(pool, subject, organization_id.as_str()).await?;
            ensure_postgres_organization_membership(pool, subject, organization_id.as_str())
                .await?;
            let department_id = command_optional_text(&body, &["departmentId"], "departmentId")?;
            if let Some(department_id) = department_id.as_deref() {
                let department = retrieve_postgres_department(pool, subject, department_id).await?;
                if department.organization_id != organization_id {
                    return Err(AdminAppbaseBackendIamCommandError::BadRequest(
                        "departmentId must belong to organizationId".to_owned(),
                    ));
                }
            }
            let id = next_iam_command_id("appbase backend IAM position")?;
            let name = command_required_text(&body, &["name"], "name")?;
            let code = unique_postgres_position_code(
                pool,
                subject.tenant_id,
                organization_id.as_str(),
                command_text(&body, &["code"]).as_deref(),
                name.as_str(),
                id.as_str(),
            )
            .await?;
            let rank_level = command_i64(&body, &["rankLevel"], 0);
            let status = normalize_status(command_text(&body, &["status"]).as_deref(), "active")?;
            sqlx::query(
                r#"
                INSERT INTO iam_position
                    (id, tenant_id, organization_id, department_id, code, name, position_kind, rank_level, status, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, 'position', $7, $8, $9::timestamptz, $10::timestamptz)
                "#,
            )
            .bind(id.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(organization_id.as_str())
            .bind(department_id.as_deref())
            .bind(code.as_str())
            .bind(name.as_str())
            .bind(rank_level)
            .bind(status.as_str())
            .bind(now.as_str())
            .bind(now.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            Ok(position_json(
                id,
                subject.tenant_id.to_string(),
                organization_id,
                department_id,
                code,
                name,
                rank_level.to_string(),
                status,
                now.clone(),
                now,
            ))
        }
        IamBackendCommand::RetrievePosition { id } => {
            retrieve_postgres_position_value(pool, subject, id.as_str()).await
        }
        IamBackendCommand::UpdatePosition { id } => {
            let id = normalize_required_text(Some(id.as_str()), "positionId")?;
            let current = retrieve_postgres_position_value(pool, subject, id.as_str()).await?;
            let item = current["item"].clone();
            let code = command_optional_text(&body, &["code"], "code")?
                .unwrap_or_else(|| item["code"].as_str().unwrap_or_default().to_owned());
            let name = command_optional_text(&body, &["name"], "name")?
                .unwrap_or_else(|| item["name"].as_str().unwrap_or_default().to_owned());
            let department_id = if body.get("departmentId").is_some() {
                command_optional_text(&body, &["departmentId"], "departmentId")?
            } else {
                item["departmentId"].as_str().map(str::to_owned)
            };
            let rank_level = command_i64(
                &body,
                &["rankLevel"],
                item["rankLevel"].as_i64().unwrap_or_default(),
            );
            let status = if body.get("status").is_some() {
                normalize_status(command_text(&body, &["status"]).as_deref(), "active")?
            } else {
                item["status"].as_str().unwrap_or("active").to_owned()
            };
            sqlx::query(
                r#"
                UPDATE iam_position
                SET department_id = $1,
                    code = $2,
                    name = $3,
                    rank_level = $4,
                    status = $5,
                    updated_at = $6::timestamptz
                WHERE tenant_id::text = $7
                  AND id::text = $8
                "#,
            )
            .bind(department_id.as_deref())
            .bind(code.as_str())
            .bind(name.as_str())
            .bind(rank_level)
            .bind(status.as_str())
            .bind(now.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(id.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            retrieve_postgres_position_value(pool, subject, id.as_str()).await
        }
        IamBackendCommand::DeletePosition { id } => {
            update_delete_status_postgres(
                pool,
                "iam_position",
                subject.tenant_id,
                id.as_str(),
                now.as_str(),
            )
            .await
        }
        IamBackendCommand::CreatePositionAssignment => {
            ensure_postgres_table(pool, "iam_position_assignment").await?;
            let position_id = command_required_text(&body, &["positionId"], "positionId")?;
            let position =
                retrieve_postgres_position_value(pool, subject, position_id.as_str()).await?;
            let organization_id = position["item"]["organizationId"]
                .as_str()
                .unwrap_or_default()
                .to_owned();
            let department_assignment_id = command_required_text(
                &body,
                &["membershipId", "departmentAssignmentId"],
                "membershipId",
            )?;
            let (user_id, assignment_organization_id) =
                postgres_department_assignment_user_and_organization(
                    pool,
                    subject,
                    department_assignment_id.as_str(),
                )
                .await?;
            if assignment_organization_id != organization_id {
                return Err(AdminAppbaseBackendIamCommandError::BadRequest(
                    "membershipId must belong to the same organization as positionId".to_owned(),
                ));
            }
            let id = next_iam_command_id("appbase backend IAM position assignment")?;
            let status = normalize_status(command_text(&body, &["status"]).as_deref(), "active")?;
            let effective_from =
                command_text(&body, &["startedAt", "effectiveFrom"]).unwrap_or_else(|| now.clone());
            let effective_to = command_text(&body, &["endedAt", "effectiveTo"]);
            sqlx::query(
                r#"
                INSERT INTO iam_position_assignment
                    (id, tenant_id, organization_id, department_assignment_id, position_id, user_id, is_primary, effective_from, effective_to, status, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, 0, $7::timestamptz, $8::timestamptz, $9, $10::timestamptz, $11::timestamptz)
                "#,
            )
            .bind(id.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(organization_id.as_str())
            .bind(department_assignment_id.as_str())
            .bind(position_id.as_str())
            .bind(user_id.as_str())
            .bind(effective_from.as_str())
            .bind(effective_to.as_deref())
            .bind(status.as_str())
            .bind(now.as_str())
            .bind(now.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            Ok(json!({ "item": {
                "id": id,
                "tenantId": subject.tenant_id.to_string(),
                "organizationId": organization_id,
                "positionId": position_id,
                "membershipId": department_assignment_id,
                "departmentAssignmentId": department_assignment_id,
                "userId": user_id,
                "status": status,
                "isPrimary": false,
                "startedAt": effective_from,
                "endedAt": effective_to,
                "createdAt": now,
                "updatedAt": now
            }}))
        }
        IamBackendCommand::UpdatePositionAssignment { id } => {
            let id = normalize_required_text(Some(id.as_str()), "assignmentId")?;
            update_status_only_postgres(
                pool,
                "iam_position_assignment",
                subject.tenant_id,
                id.as_str(),
                normalize_status(command_text(&body, &["status"]).as_deref(), "active")?.as_str(),
                now.as_str(),
            )
            .await?;
            retrieve_postgres_position_assignment_value(pool, subject, id.as_str()).await
        }
        IamBackendCommand::CreateRole => {
            ensure_postgres_table(pool, "iam_role").await?;
            let id = next_iam_command_id("appbase backend IAM role")?;
            let code = command_required_text(&body, &["code"], "code")?;
            let name = command_required_text(&body, &["name"], "name")?;
            let status = normalize_status(command_text(&body, &["status"]).as_deref(), "active")?;
            sqlx::query(
                r#"
                INSERT INTO iam_role (id, tenant_id, code, name, status, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6::timestamptz, $7::timestamptz)
                "#,
            )
            .bind(id.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(code.as_str())
            .bind(name.as_str())
            .bind(status.as_str())
            .bind(now.as_str())
            .bind(now.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            Ok(json!({ "item": role_value(id, code, name, status, now.clone(), now) }))
        }
        IamBackendCommand::RetrieveRole { id } => {
            retrieve_postgres_role_value(pool, subject, id.as_str()).await
        }
        IamBackendCommand::UpdateRole { id } => {
            let id = normalize_required_text(Some(id.as_str()), "roleId")?;
            let current = retrieve_postgres_role_value(pool, subject, id.as_str()).await?;
            let item = current["item"].clone();
            let code = command_optional_text(&body, &["code"], "code")?
                .unwrap_or_else(|| item["code"].as_str().unwrap_or_default().to_owned());
            let name = command_optional_text(&body, &["name"], "name")?
                .unwrap_or_else(|| item["name"].as_str().unwrap_or_default().to_owned());
            let status = if body.get("status").is_some() {
                normalize_status(command_text(&body, &["status"]).as_deref(), "active")?
            } else {
                item["status"].as_str().unwrap_or("active").to_owned()
            };
            sqlx::query(
                r#"
                UPDATE iam_role
                SET code = $1,
                    name = $2,
                    status = $3,
                    updated_at = $4::timestamptz
                WHERE tenant_id::text = $5
                  AND id::text = $6
                "#,
            )
            .bind(code.as_str())
            .bind(name.as_str())
            .bind(status.as_str())
            .bind(now.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(id.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            retrieve_postgres_role_value(pool, subject, id.as_str()).await
        }
        IamBackendCommand::DeleteRole { id } => {
            update_delete_status_postgres(
                pool,
                "iam_role",
                subject.tenant_id,
                id.as_str(),
                now.as_str(),
            )
            .await
        }
        IamBackendCommand::CreatePermission => {
            ensure_postgres_table(pool, "iam_permission").await?;
            let id = next_iam_command_id("appbase backend IAM permission")?;
            let code = command_required_text(&body, &["code"], "code")?;
            let name = command_required_text(&body, &["name"], "name")?;
            let resource = command_optional_text(&body, &["resource"], "resource")?
                .unwrap_or_else(|| code.split('.').next().unwrap_or("iam").to_owned());
            let action = command_optional_text(&body, &["action"], "action")?
                .unwrap_or_else(|| code.rsplit('.').next().unwrap_or("manage").to_owned());
            sqlx::query(
                r#"
                INSERT INTO iam_permission (id, code, name, resource, action, created_at)
                VALUES ($1, $2, $3, $4, $5, $6::timestamptz)
                "#,
            )
            .bind(id.as_str())
            .bind(code.as_str())
            .bind(name.as_str())
            .bind(resource.as_str())
            .bind(action.as_str())
            .bind(now.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            Ok(json!({ "item": permission_value(id, code, name, resource, action, now) }))
        }
        IamBackendCommand::RetrievePermission { id } => {
            retrieve_postgres_permission_value(pool, id.as_str()).await
        }
        IamBackendCommand::UpdatePermission { id } => {
            let id = normalize_required_text(Some(id.as_str()), "permissionId")?;
            let current = retrieve_postgres_permission_value(pool, id.as_str()).await?;
            let item = current["item"].clone();
            let code = command_optional_text(&body, &["code"], "code")?
                .unwrap_or_else(|| item["code"].as_str().unwrap_or_default().to_owned());
            let name = command_optional_text(&body, &["name"], "name")?
                .unwrap_or_else(|| item["name"].as_str().unwrap_or_default().to_owned());
            let resource = command_optional_text(&body, &["resource"], "resource")?
                .unwrap_or_else(|| item["resource"].as_str().unwrap_or_default().to_owned());
            let action = command_optional_text(&body, &["action"], "action")?
                .unwrap_or_else(|| item["action"].as_str().unwrap_or_default().to_owned());
            sqlx::query(
                r#"
                UPDATE iam_permission
                SET code = $1,
                    name = $2,
                    resource = $3,
                    action = $4
                WHERE id::text = $5
                "#,
            )
            .bind(code.as_str())
            .bind(name.as_str())
            .bind(resource.as_str())
            .bind(action.as_str())
            .bind(id.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            retrieve_postgres_permission_value(pool, id.as_str()).await
        }
        IamBackendCommand::DeletePermission { id } => {
            let id = normalize_required_text(Some(id.as_str()), "permissionId")?;
            let result = sqlx::query("DELETE FROM iam_permission WHERE id::text = $1")
                .bind(id.as_str())
                .execute(pool)
                .await?;
            deleted_result(result.rows_affected())
        }
        IamBackendCommand::GrantRolePermission { role_id } => {
            ensure_postgres_table(pool, "iam_role_permission").await?;
            let role_id = normalize_required_text(Some(role_id.as_str()), "roleId")?;
            let permission_id =
                command_required_text(&body, &["permissionId", "id"], "permissionId")?;
            let id = next_iam_command_id("appbase backend IAM role permission")?;
            sqlx::query(
                r#"
                INSERT INTO iam_role_permission (id, tenant_id, role_id, permission_id, created_at)
                VALUES ($1, $2, $3, $4, $5::timestamptz)
                "#,
            )
            .bind(id.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(role_id.as_str())
            .bind(permission_id.as_str())
            .bind(now.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            retrieve_postgres_permission_value(pool, permission_id.as_str()).await
        }
        IamBackendCommand::RevokeRolePermission {
            role_id,
            permission_id,
        } => {
            let role_id = normalize_required_text(Some(role_id.as_str()), "roleId")?;
            let permission_id =
                normalize_required_text(Some(permission_id.as_str()), "permissionId")?;
            let result = sqlx::query(
                r#"
                DELETE FROM iam_role_permission
                WHERE tenant_id::text = $1
                  AND role_id::text = $2
                  AND permission_id::text = $3
                "#,
            )
            .bind(subject.tenant_id.to_string())
            .bind(role_id.as_str())
            .bind(permission_id.as_str())
            .execute(pool)
            .await?;
            deleted_result(result.rows_affected())
        }
        IamBackendCommand::CreateRoleBinding => {
            ensure_postgres_table(pool, "iam_role_binding").await?;
            let id = next_iam_command_id("appbase backend IAM role binding")?;
            let role_id = command_required_text(&body, &["roleId"], "roleId")?;
            let principal_kind =
                command_required_text(&body, &["principalKind", "principalType"], "principalKind")?;
            let principal_id = command_required_text(&body, &["principalId"], "principalId")?;
            let scope_kind = command_required_text(&body, &["scopeKind"], "scopeKind")?;
            let scope_id = command_required_text(&body, &["scopeId"], "scopeId")?;
            let status = normalize_status(command_text(&body, &["status"]).as_deref(), "active")?;
            sqlx::query(
                r#"
                INSERT INTO iam_role_binding
                    (id, tenant_id, role_id, principal_kind, principal_id, scope_kind, scope_id, effect, condition_json, status, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, 'allow', NULL, $8, $9::timestamptz, $10::timestamptz)
                "#,
            )
            .bind(id.as_str())
            .bind(subject.tenant_id.to_string())
            .bind(role_id.as_str())
            .bind(principal_kind.as_str())
            .bind(principal_id.as_str())
            .bind(scope_kind.as_str())
            .bind(scope_id.as_str())
            .bind(status.as_str())
            .bind(now.as_str())
            .bind(now.as_str())
            .execute(pool)
            .await
            .map_err(command_sql_error)?;
            Ok(json!({ "item": {
                "id": id,
                "tenantId": subject.tenant_id.to_string(),
                "roleId": role_id,
                "principalKind": principal_kind,
                "principalType": principal_kind,
                "principalId": principal_id,
                "organizationId": if scope_kind == "organization" { Value::String(scope_id.clone()) } else { Value::Null },
                "departmentId": if scope_kind == "department" { Value::String(scope_id.clone()) } else { Value::Null },
                "scopeKind": scope_kind,
                "scopeId": scope_id,
                "effect": "allow",
                "conditionJson": "",
                "status": status,
                "createdAt": now,
                "updatedAt": now
            }}))
        }
        IamBackendCommand::DeleteRoleBinding { id } => {
            update_delete_status_postgres(
                pool,
                "iam_role_binding",
                subject.tenant_id,
                id.as_str(),
                now.as_str(),
            )
            .await
        }
    }
}

async fn ensure_sqlite_table(
    pool: &SqlitePool,
    table_name: &str,
) -> Result<(), AdminAppbaseBackendIamCommandError> {
    if sqlite_table_exists(pool, table_name).await? {
        Ok(())
    } else {
        Err(AdminAppbaseBackendIamCommandError::System(format!(
            "appbase backend IAM table {table_name} is unavailable"
        )))
    }
}

async fn ensure_postgres_table(
    pool: &PgPool,
    table_name: &str,
) -> Result<(), AdminAppbaseBackendIamCommandError> {
    if postgres_table_exists(pool, table_name).await? {
        Ok(())
    } else {
        Err(AdminAppbaseBackendIamCommandError::System(format!(
            "appbase backend IAM table {table_name} is unavailable"
        )))
    }
}

fn deleted_result(rows_affected: u64) -> Result<Value, AdminAppbaseBackendIamCommandError> {
    if rows_affected > 0 {
        Ok(json!({ "deleted": true }))
    } else {
        Err(AdminAppbaseBackendIamCommandError::NotFound(
            "resource was not found".to_owned(),
        ))
    }
}

async fn sqlite_organization_path(
    pool: &SqlitePool,
    tenant_id: i64,
    organization_id: &str,
) -> Result<String, AdminAppbaseBackendIamCommandError> {
    ensure_sqlite_table(pool, "iam_organization").await?;
    let path = sqlx::query_scalar::<_, Option<String>>(
        r#"
        SELECT CAST(path AS TEXT)
        FROM iam_organization
        WHERE CAST(tenant_id AS TEXT) = ?1
          AND CAST(id AS TEXT) = ?2
        "#,
    )
    .bind(tenant_id.to_string())
    .bind(organization_id)
    .fetch_optional(pool)
    .await?
    .flatten();
    path.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound("organization was not found".to_owned())
    })
}

async fn postgres_organization_path(
    pool: &PgPool,
    tenant_id: i64,
    organization_id: &str,
) -> Result<String, AdminAppbaseBackendIamCommandError> {
    ensure_postgres_table(pool, "iam_organization").await?;
    let path = sqlx::query_scalar::<_, Option<String>>(
        r#"
        SELECT path::text
        FROM iam_organization
        WHERE tenant_id::text = $1
          AND id::text = $2
        "#,
    )
    .bind(tenant_id.to_string())
    .bind(organization_id)
    .fetch_optional(pool)
    .await?
    .flatten();
    path.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound("organization was not found".to_owned())
    })
}

async fn retrieve_sqlite_organization_value(
    pool: &SqlitePool,
    subject: AppIamDirectorySubject,
    organization_id: &str,
) -> Result<Value, AdminAppbaseBackendIamCommandError> {
    ensure_sqlite_table(pool, "iam_organization").await?;
    let row = sqlx::query(
        r#"
        SELECT
            CAST(id AS TEXT) AS id,
            CAST(tenant_id AS TEXT) AS tenant_id,
            CAST(parent_id AS TEXT) AS parent_id,
            COALESCE(code, '') AS code,
            COALESCE(name, '') AS name,
            COALESCE(path, '') AS path,
            COALESCE(CAST(status AS TEXT), '') AS status,
            COALESCE(CAST(created_at AS TEXT), '') AS created_at,
            COALESCE(CAST(updated_at AS TEXT), '') AS updated_at
        FROM iam_organization
        WHERE CAST(tenant_id AS TEXT) = ?1
          AND CAST(id AS TEXT) = ?2
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(organization_id)
    .fetch_optional(pool)
    .await?;
    let row = row.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound("organization was not found".to_owned())
    })?;
    Ok(json!({ "item": organization_value(AppIamOrganizationItem {
        id: sqlite_string_cell(&row, "id"),
        tenant_id: sqlite_string_cell(&row, "tenant_id"),
        parent_id: sqlite_optional_string_cell(&row, "parent_id"),
        code: sqlite_string_cell(&row, "code"),
        name: sqlite_string_cell(&row, "name"),
        path: sqlite_string_cell(&row, "path"),
        status: sqlite_string_cell(&row, "status"),
        created_at: sqlite_string_cell(&row, "created_at"),
        updated_at: sqlite_string_cell(&row, "updated_at"),
    }) }))
}

async fn retrieve_postgres_organization_value(
    pool: &PgPool,
    subject: AppIamDirectorySubject,
    organization_id: &str,
) -> Result<Value, AdminAppbaseBackendIamCommandError> {
    ensure_postgres_table(pool, "iam_organization").await?;
    let row = sqlx::query(
        r#"
        SELECT
            id::text AS id,
            tenant_id::text AS tenant_id,
            parent_id::text AS parent_id,
            COALESCE(code, '') AS code,
            COALESCE(name, '') AS name,
            COALESCE(path, '') AS path,
            COALESCE(status::text, '') AS status,
            COALESCE(created_at::text, '') AS created_at,
            COALESCE(updated_at::text, '') AS updated_at
        FROM iam_organization
        WHERE tenant_id::text = $1
          AND id::text = $2
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(organization_id)
    .fetch_optional(pool)
    .await?;
    let row = row.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound("organization was not found".to_owned())
    })?;
    Ok(json!({ "item": organization_value(AppIamOrganizationItem {
        id: postgres_string_cell(&row, "id"),
        tenant_id: postgres_string_cell(&row, "tenant_id"),
        parent_id: postgres_optional_string_cell(&row, "parent_id"),
        code: postgres_string_cell(&row, "code"),
        name: postgres_string_cell(&row, "name"),
        path: postgres_string_cell(&row, "path"),
        status: postgres_string_cell(&row, "status"),
        created_at: postgres_string_cell(&row, "created_at"),
        updated_at: postgres_string_cell(&row, "updated_at"),
    }) }))
}

async fn retrieve_sqlite_membership_value(
    pool: &SqlitePool,
    subject: AppIamDirectorySubject,
    membership_id: &str,
) -> Result<Value, AdminAppbaseBackendIamCommandError> {
    let row = sqlx::query(
        r#"
        SELECT
            CAST(id AS TEXT) AS id,
            CAST(tenant_id AS TEXT) AS tenant_id,
            CAST(organization_id AS TEXT) AS organization_id,
            CAST(user_id AS TEXT) AS user_id,
            COALESCE(membership_kind, '') AS role_code,
            COALESCE(CAST(status AS TEXT), '') AS status,
            COALESCE(CAST(joined_at AS TEXT), '') AS joined_at
        FROM iam_organization_membership
        WHERE CAST(tenant_id AS TEXT) = ?1
          AND CAST(id AS TEXT) = ?2
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(membership_id)
    .fetch_optional(pool)
    .await?;
    let row = row.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound(
            "organization membership was not found".to_owned(),
        )
    })?;
    Ok(
        json!({ "item": organization_membership_value(AppIamOrganizationMembershipItem {
        id: sqlite_string_cell(&row, "id"),
        tenant_id: sqlite_string_cell(&row, "tenant_id"),
        organization_id: sqlite_string_cell(&row, "organization_id"),
        user_id: sqlite_string_cell(&row, "user_id"),
        role_code: sqlite_string_cell(&row, "role_code"),
        status: sqlite_string_cell(&row, "status"),
        joined_at: sqlite_string_cell(&row, "joined_at"),
        left_at: String::new(),
        remark: String::new(),
    }) }),
    )
}

async fn retrieve_postgres_membership_value(
    pool: &PgPool,
    subject: AppIamDirectorySubject,
    membership_id: &str,
) -> Result<Value, AdminAppbaseBackendIamCommandError> {
    let row = sqlx::query(
        r#"
        SELECT
            id::text AS id,
            tenant_id::text AS tenant_id,
            organization_id::text AS organization_id,
            user_id::text AS user_id,
            COALESCE(membership_kind, '') AS role_code,
            COALESCE(status::text, '') AS status,
            COALESCE(joined_at::text, '') AS joined_at
        FROM iam_organization_membership
        WHERE tenant_id::text = $1
          AND id::text = $2
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(membership_id)
    .fetch_optional(pool)
    .await?;
    let row = row.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound(
            "organization membership was not found".to_owned(),
        )
    })?;
    Ok(
        json!({ "item": organization_membership_value(AppIamOrganizationMembershipItem {
        id: postgres_string_cell(&row, "id"),
        tenant_id: postgres_string_cell(&row, "tenant_id"),
        organization_id: postgres_string_cell(&row, "organization_id"),
        user_id: postgres_string_cell(&row, "user_id"),
        role_code: postgres_string_cell(&row, "role_code"),
        status: postgres_string_cell(&row, "status"),
        joined_at: postgres_string_cell(&row, "joined_at"),
        left_at: String::new(),
        remark: String::new(),
    }) }),
    )
}

async fn sqlite_membership_user_and_organization(
    pool: &SqlitePool,
    subject: AppIamDirectorySubject,
    membership_id: &str,
) -> Result<(String, String), AdminAppbaseBackendIamCommandError> {
    let row = sqlx::query(
        r#"
        SELECT CAST(user_id AS TEXT) AS user_id,
               CAST(organization_id AS TEXT) AS organization_id
        FROM iam_organization_membership
        WHERE CAST(tenant_id AS TEXT) = ?1
          AND CAST(id AS TEXT) = ?2
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(membership_id)
    .fetch_optional(pool)
    .await?;
    let row = row.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound(
            "organization membership was not found".to_owned(),
        )
    })?;
    Ok((
        sqlite_string_cell(&row, "user_id"),
        sqlite_string_cell(&row, "organization_id"),
    ))
}

async fn postgres_membership_user_and_organization(
    pool: &PgPool,
    subject: AppIamDirectorySubject,
    membership_id: &str,
) -> Result<(String, String), AdminAppbaseBackendIamCommandError> {
    let row = sqlx::query(
        r#"
        SELECT user_id::text AS user_id,
               organization_id::text AS organization_id
        FROM iam_organization_membership
        WHERE tenant_id::text = $1
          AND id::text = $2
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(membership_id)
    .fetch_optional(pool)
    .await?;
    let row = row.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound(
            "organization membership was not found".to_owned(),
        )
    })?;
    Ok((
        postgres_string_cell(&row, "user_id"),
        postgres_string_cell(&row, "organization_id"),
    ))
}

async fn retrieve_sqlite_department_assignment_value(
    pool: &SqlitePool,
    subject: AppIamDirectorySubject,
    assignment_id: &str,
) -> Result<Value, AdminAppbaseBackendIamCommandError> {
    let row = sqlx::query(
        r#"
        SELECT
            CAST(id AS TEXT) AS id,
            CAST(tenant_id AS TEXT) AS tenant_id,
            CAST(organization_id AS TEXT) AS organization_id,
            CAST(organization_membership_id AS TEXT) AS organization_membership_id,
            CAST(department_id AS TEXT) AS department_id,
            CAST(user_id AS TEXT) AS user_id,
            COALESCE(assignment_kind, '') AS assignment_kind,
            COALESCE(is_primary, 0) AS is_primary,
            COALESCE(CAST(effective_from AS TEXT), '') AS effective_from,
            COALESCE(CAST(effective_to AS TEXT), '') AS effective_to,
            COALESCE(CAST(status AS TEXT), '') AS status,
            COALESCE(CAST(created_at AS TEXT), '') AS created_at,
            COALESCE(CAST(updated_at AS TEXT), '') AS updated_at
        FROM iam_department_assignment
        WHERE CAST(tenant_id AS TEXT) = ?1
          AND CAST(id AS TEXT) = ?2
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(assignment_id)
    .fetch_optional(pool)
    .await?;
    let row = row.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound(
            "department assignment was not found".to_owned(),
        )
    })?;
    Ok(
        json!({ "item": department_assignment_value(AppIamDepartmentAssignmentItem {
        id: sqlite_string_cell(&row, "id"),
        tenant_id: sqlite_string_cell(&row, "tenant_id"),
        organization_id: sqlite_string_cell(&row, "organization_id"),
        organization_membership_id: sqlite_string_cell(&row, "organization_membership_id"),
        department_id: sqlite_string_cell(&row, "department_id"),
        user_id: sqlite_string_cell(&row, "user_id"),
        assignment_kind: sqlite_string_cell(&row, "assignment_kind"),
        is_primary: row.try_get::<i64, _>("is_primary").unwrap_or_default() != 0,
        effective_from: sqlite_string_cell(&row, "effective_from"),
        effective_to: sqlite_string_cell(&row, "effective_to"),
        status: sqlite_string_cell(&row, "status"),
        created_at: sqlite_string_cell(&row, "created_at"),
        updated_at: sqlite_string_cell(&row, "updated_at"),
    }) }),
    )
}

async fn retrieve_postgres_department_assignment_value(
    pool: &PgPool,
    subject: AppIamDirectorySubject,
    assignment_id: &str,
) -> Result<Value, AdminAppbaseBackendIamCommandError> {
    let row = sqlx::query(
        r#"
        SELECT
            id::text AS id,
            tenant_id::text AS tenant_id,
            organization_id::text AS organization_id,
            organization_membership_id::text AS organization_membership_id,
            department_id::text AS department_id,
            user_id::text AS user_id,
            COALESCE(assignment_kind, '') AS assignment_kind,
            COALESCE(is_primary, 0) AS is_primary,
            COALESCE(effective_from::text, '') AS effective_from,
            COALESCE(effective_to::text, '') AS effective_to,
            COALESCE(status::text, '') AS status,
            COALESCE(created_at::text, '') AS created_at,
            COALESCE(updated_at::text, '') AS updated_at
        FROM iam_department_assignment
        WHERE tenant_id::text = $1
          AND id::text = $2
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(assignment_id)
    .fetch_optional(pool)
    .await?;
    let row = row.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound(
            "department assignment was not found".to_owned(),
        )
    })?;
    Ok(
        json!({ "item": department_assignment_value(AppIamDepartmentAssignmentItem {
        id: postgres_string_cell(&row, "id"),
        tenant_id: postgres_string_cell(&row, "tenant_id"),
        organization_id: postgres_string_cell(&row, "organization_id"),
        organization_membership_id: postgres_string_cell(&row, "organization_membership_id"),
        department_id: postgres_string_cell(&row, "department_id"),
        user_id: postgres_string_cell(&row, "user_id"),
        assignment_kind: postgres_string_cell(&row, "assignment_kind"),
        is_primary: row.try_get::<i32, _>("is_primary").unwrap_or_default() != 0,
        effective_from: postgres_string_cell(&row, "effective_from"),
        effective_to: postgres_string_cell(&row, "effective_to"),
        status: postgres_string_cell(&row, "status"),
        created_at: postgres_string_cell(&row, "created_at"),
        updated_at: postgres_string_cell(&row, "updated_at"),
    }) }),
    )
}

async fn update_status_only_sqlite(
    pool: &SqlitePool,
    table_name: &str,
    tenant_id: i64,
    id: &str,
    status: &str,
    updated_at: &str,
) -> Result<(), AdminAppbaseBackendIamCommandError> {
    ensure_sqlite_table(pool, table_name).await?;
    let sql = format!(
        "UPDATE {table_name} SET status = ?1, updated_at = ?2 WHERE CAST(tenant_id AS TEXT) = ?3 AND CAST(id AS TEXT) = ?4"
    );
    let result = sqlx::query(sql.as_str())
        .bind(status)
        .bind(updated_at)
        .bind(tenant_id.to_string())
        .bind(id)
        .execute(pool)
        .await?;
    if result.rows_affected() == 0 {
        Err(AdminAppbaseBackendIamCommandError::NotFound(
            "resource was not found".to_owned(),
        ))
    } else {
        Ok(())
    }
}

async fn update_status_only_postgres(
    pool: &PgPool,
    table_name: &str,
    tenant_id: i64,
    id: &str,
    status: &str,
    updated_at: &str,
) -> Result<(), AdminAppbaseBackendIamCommandError> {
    ensure_postgres_table(pool, table_name).await?;
    let sql = format!(
        "UPDATE {table_name} SET status = $1, updated_at = $2::timestamptz WHERE tenant_id::text = $3 AND id::text = $4"
    );
    let result = sqlx::query(sql.as_str())
        .bind(status)
        .bind(updated_at)
        .bind(tenant_id.to_string())
        .bind(id)
        .execute(pool)
        .await?;
    if result.rows_affected() == 0 {
        Err(AdminAppbaseBackendIamCommandError::NotFound(
            "resource was not found".to_owned(),
        ))
    } else {
        Ok(())
    }
}

async fn update_delete_status_sqlite(
    pool: &SqlitePool,
    table_name: &str,
    tenant_id: i64,
    id: &str,
    updated_at: &str,
) -> Result<Value, AdminAppbaseBackendIamCommandError> {
    update_status_only_sqlite(pool, table_name, tenant_id, id, "archived", updated_at).await?;
    Ok(json!({ "deleted": true }))
}

async fn update_delete_status_postgres(
    pool: &PgPool,
    table_name: &str,
    tenant_id: i64,
    id: &str,
    updated_at: &str,
) -> Result<Value, AdminAppbaseBackendIamCommandError> {
    update_status_only_postgres(pool, table_name, tenant_id, id, "archived", updated_at).await?;
    Ok(json!({ "deleted": true }))
}

fn position_json(
    id: String,
    tenant_id: String,
    organization_id: String,
    department_id: Option<String>,
    code: String,
    name: String,
    rank_level: String,
    status: String,
    created_at: String,
    updated_at: String,
) -> Value {
    json!({ "item": position_value(AppIamPositionItem {
        id,
        tenant_id,
        organization_id,
        department_id: department_id.unwrap_or_default(),
        code,
        name,
        position_kind: "position".to_owned(),
        rank_level,
        status,
        created_at,
        updated_at,
    }) })
}

async fn retrieve_sqlite_position_value(
    pool: &SqlitePool,
    subject: AppIamDirectorySubject,
    position_id: &str,
) -> Result<Value, AdminAppbaseBackendIamCommandError> {
    let row = sqlx::query(
        r#"
        SELECT
            CAST(id AS TEXT) AS id,
            CAST(tenant_id AS TEXT) AS tenant_id,
            CAST(organization_id AS TEXT) AS organization_id,
            CAST(department_id AS TEXT) AS department_id,
            COALESCE(code, '') AS code,
            COALESCE(name, '') AS name,
            COALESCE(position_kind, '') AS position_kind,
            COALESCE(CAST(rank_level AS TEXT), '') AS rank_level,
            COALESCE(CAST(status AS TEXT), '') AS status,
            COALESCE(CAST(created_at AS TEXT), '') AS created_at,
            COALESCE(CAST(updated_at AS TEXT), '') AS updated_at
        FROM iam_position
        WHERE CAST(tenant_id AS TEXT) = ?1
          AND CAST(id AS TEXT) = ?2
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(position_id)
    .fetch_optional(pool)
    .await?;
    let row = row.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound("position was not found".to_owned())
    })?;
    Ok(json!({ "item": position_value(AppIamPositionItem {
        id: sqlite_string_cell(&row, "id"),
        tenant_id: sqlite_string_cell(&row, "tenant_id"),
        organization_id: sqlite_string_cell(&row, "organization_id"),
        department_id: sqlite_string_cell(&row, "department_id"),
        code: sqlite_string_cell(&row, "code"),
        name: sqlite_string_cell(&row, "name"),
        position_kind: sqlite_string_cell(&row, "position_kind"),
        rank_level: sqlite_string_cell(&row, "rank_level"),
        status: sqlite_string_cell(&row, "status"),
        created_at: sqlite_string_cell(&row, "created_at"),
        updated_at: sqlite_string_cell(&row, "updated_at"),
    }) }))
}

async fn retrieve_postgres_position_value(
    pool: &PgPool,
    subject: AppIamDirectorySubject,
    position_id: &str,
) -> Result<Value, AdminAppbaseBackendIamCommandError> {
    let row = sqlx::query(
        r#"
        SELECT
            id::text AS id,
            tenant_id::text AS tenant_id,
            organization_id::text AS organization_id,
            department_id::text AS department_id,
            COALESCE(code, '') AS code,
            COALESCE(name, '') AS name,
            COALESCE(position_kind, '') AS position_kind,
            COALESCE(rank_level::text, '') AS rank_level,
            COALESCE(status::text, '') AS status,
            COALESCE(created_at::text, '') AS created_at,
            COALESCE(updated_at::text, '') AS updated_at
        FROM iam_position
        WHERE tenant_id::text = $1
          AND id::text = $2
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(position_id)
    .fetch_optional(pool)
    .await?;
    let row = row.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound("position was not found".to_owned())
    })?;
    Ok(json!({ "item": position_value(AppIamPositionItem {
        id: postgres_string_cell(&row, "id"),
        tenant_id: postgres_string_cell(&row, "tenant_id"),
        organization_id: postgres_string_cell(&row, "organization_id"),
        department_id: postgres_string_cell(&row, "department_id"),
        code: postgres_string_cell(&row, "code"),
        name: postgres_string_cell(&row, "name"),
        position_kind: postgres_string_cell(&row, "position_kind"),
        rank_level: postgres_string_cell(&row, "rank_level"),
        status: postgres_string_cell(&row, "status"),
        created_at: postgres_string_cell(&row, "created_at"),
        updated_at: postgres_string_cell(&row, "updated_at"),
    }) }))
}

async fn sqlite_department_assignment_user_and_organization(
    pool: &SqlitePool,
    subject: AppIamDirectorySubject,
    assignment_id: &str,
) -> Result<(String, String), AdminAppbaseBackendIamCommandError> {
    let row = sqlx::query(
        r#"
        SELECT CAST(user_id AS TEXT) AS user_id,
               CAST(organization_id AS TEXT) AS organization_id
        FROM iam_department_assignment
        WHERE CAST(tenant_id AS TEXT) = ?1
          AND CAST(id AS TEXT) = ?2
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(assignment_id)
    .fetch_optional(pool)
    .await?;
    let row = row.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound(
            "department assignment was not found".to_owned(),
        )
    })?;
    Ok((
        sqlite_string_cell(&row, "user_id"),
        sqlite_string_cell(&row, "organization_id"),
    ))
}

async fn postgres_department_assignment_user_and_organization(
    pool: &PgPool,
    subject: AppIamDirectorySubject,
    assignment_id: &str,
) -> Result<(String, String), AdminAppbaseBackendIamCommandError> {
    let row = sqlx::query(
        r#"
        SELECT user_id::text AS user_id,
               organization_id::text AS organization_id
        FROM iam_department_assignment
        WHERE tenant_id::text = $1
          AND id::text = $2
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(assignment_id)
    .fetch_optional(pool)
    .await?;
    let row = row.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound(
            "department assignment was not found".to_owned(),
        )
    })?;
    Ok((
        postgres_string_cell(&row, "user_id"),
        postgres_string_cell(&row, "organization_id"),
    ))
}

async fn retrieve_sqlite_position_assignment_value(
    pool: &SqlitePool,
    subject: AppIamDirectorySubject,
    assignment_id: &str,
) -> Result<Value, AdminAppbaseBackendIamCommandError> {
    let row = sqlx::query(
        r#"
        SELECT
            CAST(id AS TEXT) AS id,
            CAST(tenant_id AS TEXT) AS tenant_id,
            CAST(organization_id AS TEXT) AS organization_id,
            CAST(department_assignment_id AS TEXT) AS department_assignment_id,
            CAST(position_id AS TEXT) AS position_id,
            CAST(user_id AS TEXT) AS user_id,
            COALESCE(is_primary, 0) AS is_primary,
            COALESCE(CAST(effective_from AS TEXT), '') AS effective_from,
            COALESCE(CAST(effective_to AS TEXT), '') AS effective_to,
            COALESCE(CAST(status AS TEXT), '') AS status,
            COALESCE(CAST(created_at AS TEXT), '') AS created_at,
            COALESCE(CAST(updated_at AS TEXT), '') AS updated_at
        FROM iam_position_assignment
        WHERE CAST(tenant_id AS TEXT) = ?1
          AND CAST(id AS TEXT) = ?2
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(assignment_id)
    .fetch_optional(pool)
    .await?;
    let row = row.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound("position assignment was not found".to_owned())
    })?;
    Ok(
        json!({ "item": position_assignment_value(AppIamPositionAssignmentItem {
        id: sqlite_string_cell(&row, "id"),
        tenant_id: sqlite_string_cell(&row, "tenant_id"),
        organization_id: sqlite_string_cell(&row, "organization_id"),
        department_assignment_id: sqlite_string_cell(&row, "department_assignment_id"),
        position_id: sqlite_string_cell(&row, "position_id"),
        user_id: sqlite_string_cell(&row, "user_id"),
        is_primary: row.try_get::<i64, _>("is_primary").unwrap_or_default() != 0,
        effective_from: sqlite_string_cell(&row, "effective_from"),
        effective_to: sqlite_string_cell(&row, "effective_to"),
        status: sqlite_string_cell(&row, "status"),
        created_at: sqlite_string_cell(&row, "created_at"),
        updated_at: sqlite_string_cell(&row, "updated_at"),
    }) }),
    )
}

async fn retrieve_postgres_position_assignment_value(
    pool: &PgPool,
    subject: AppIamDirectorySubject,
    assignment_id: &str,
) -> Result<Value, AdminAppbaseBackendIamCommandError> {
    let row = sqlx::query(
        r#"
        SELECT
            id::text AS id,
            tenant_id::text AS tenant_id,
            organization_id::text AS organization_id,
            department_assignment_id::text AS department_assignment_id,
            position_id::text AS position_id,
            user_id::text AS user_id,
            COALESCE(is_primary, 0) AS is_primary,
            COALESCE(effective_from::text, '') AS effective_from,
            COALESCE(effective_to::text, '') AS effective_to,
            COALESCE(status::text, '') AS status,
            COALESCE(created_at::text, '') AS created_at,
            COALESCE(updated_at::text, '') AS updated_at
        FROM iam_position_assignment
        WHERE tenant_id::text = $1
          AND id::text = $2
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(assignment_id)
    .fetch_optional(pool)
    .await?;
    let row = row.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound("position assignment was not found".to_owned())
    })?;
    Ok(
        json!({ "item": position_assignment_value(AppIamPositionAssignmentItem {
        id: postgres_string_cell(&row, "id"),
        tenant_id: postgres_string_cell(&row, "tenant_id"),
        organization_id: postgres_string_cell(&row, "organization_id"),
        department_assignment_id: postgres_string_cell(&row, "department_assignment_id"),
        position_id: postgres_string_cell(&row, "position_id"),
        user_id: postgres_string_cell(&row, "user_id"),
        is_primary: row.try_get::<i32, _>("is_primary").unwrap_or_default() != 0,
        effective_from: postgres_string_cell(&row, "effective_from"),
        effective_to: postgres_string_cell(&row, "effective_to"),
        status: postgres_string_cell(&row, "status"),
        created_at: postgres_string_cell(&row, "created_at"),
        updated_at: postgres_string_cell(&row, "updated_at"),
    }) }),
    )
}

async fn retrieve_sqlite_role_value(
    pool: &SqlitePool,
    subject: AppIamDirectorySubject,
    role_id: &str,
) -> Result<Value, AdminAppbaseBackendIamCommandError> {
    let row = sqlx::query(
        r#"
        SELECT
            CAST(id AS TEXT) AS id,
            COALESCE(code, '') AS code,
            COALESCE(name, '') AS name,
            COALESCE(CAST(status AS TEXT), '') AS status,
            COALESCE(CAST(created_at AS TEXT), '') AS created_at,
            COALESCE(CAST(updated_at AS TEXT), '') AS updated_at
        FROM iam_role
        WHERE CAST(tenant_id AS TEXT) = ?1
          AND CAST(id AS TEXT) = ?2
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(role_id)
    .fetch_optional(pool)
    .await?;
    let row = row.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound("role was not found".to_owned())
    })?;
    Ok(json!({ "item": role_value(
        sqlite_string_cell(&row, "id"),
        sqlite_string_cell(&row, "code"),
        sqlite_string_cell(&row, "name"),
        sqlite_string_cell(&row, "status"),
        sqlite_string_cell(&row, "created_at"),
        sqlite_string_cell(&row, "updated_at"),
    ) }))
}

async fn retrieve_postgres_role_value(
    pool: &PgPool,
    subject: AppIamDirectorySubject,
    role_id: &str,
) -> Result<Value, AdminAppbaseBackendIamCommandError> {
    let row = sqlx::query(
        r#"
        SELECT
            id::text AS id,
            COALESCE(code, '') AS code,
            COALESCE(name, '') AS name,
            COALESCE(status::text, '') AS status,
            COALESCE(created_at::text, '') AS created_at,
            COALESCE(updated_at::text, '') AS updated_at
        FROM iam_role
        WHERE tenant_id::text = $1
          AND id::text = $2
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(role_id)
    .fetch_optional(pool)
    .await?;
    let row = row.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound("role was not found".to_owned())
    })?;
    Ok(json!({ "item": role_value(
        postgres_string_cell(&row, "id"),
        postgres_string_cell(&row, "code"),
        postgres_string_cell(&row, "name"),
        postgres_string_cell(&row, "status"),
        postgres_string_cell(&row, "created_at"),
        postgres_string_cell(&row, "updated_at"),
    ) }))
}

async fn retrieve_sqlite_permission_value(
    pool: &SqlitePool,
    permission_id: &str,
) -> Result<Value, AdminAppbaseBackendIamCommandError> {
    let row = sqlx::query(
        r#"
        SELECT
            CAST(id AS TEXT) AS id,
            COALESCE(code, '') AS code,
            COALESCE(name, '') AS name,
            COALESCE(resource, '') AS resource,
            COALESCE(action, '') AS action,
            COALESCE(CAST(created_at AS TEXT), '') AS created_at
        FROM iam_permission
        WHERE CAST(id AS TEXT) = ?1
        "#,
    )
    .bind(permission_id)
    .fetch_optional(pool)
    .await?;
    let row = row.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound("permission was not found".to_owned())
    })?;
    Ok(json!({ "item": permission_value(
        sqlite_string_cell(&row, "id"),
        sqlite_string_cell(&row, "code"),
        sqlite_string_cell(&row, "name"),
        sqlite_string_cell(&row, "resource"),
        sqlite_string_cell(&row, "action"),
        sqlite_string_cell(&row, "created_at"),
    ) }))
}

async fn retrieve_postgres_permission_value(
    pool: &PgPool,
    permission_id: &str,
) -> Result<Value, AdminAppbaseBackendIamCommandError> {
    let row = sqlx::query(
        r#"
        SELECT
            id::text AS id,
            COALESCE(code, '') AS code,
            COALESCE(name, '') AS name,
            COALESCE(resource, '') AS resource,
            COALESCE(action, '') AS action,
            COALESCE(created_at::text, '') AS created_at
        FROM iam_permission
        WHERE id::text = $1
        "#,
    )
    .bind(permission_id)
    .fetch_optional(pool)
    .await?;
    let row = row.ok_or_else(|| {
        AdminAppbaseBackendIamCommandError::NotFound("permission was not found".to_owned())
    })?;
    Ok(json!({ "item": permission_value(
        postgres_string_cell(&row, "id"),
        postgres_string_cell(&row, "code"),
        postgres_string_cell(&row, "name"),
        postgres_string_cell(&row, "resource"),
        postgres_string_cell(&row, "action"),
        postgres_string_cell(&row, "created_at"),
    ) }))
}

async fn list_sqlite_roles(
    pool: &SqlitePool,
    subject: AppIamDirectorySubject,
    query: &AppIamDirectoryQuery,
) -> Result<Vec<Value>, sqlx::Error> {
    if !sqlite_table_exists(pool, "iam_role").await? {
        return Ok(Vec::new());
    }
    let rows = sqlx::query(
        r#"
        SELECT
            CAST(id AS TEXT) AS id,
            COALESCE(code, '') AS code,
            COALESCE(name, '') AS name,
            COALESCE(CAST(status AS TEXT), '') AS status,
            COALESCE(CAST(created_at AS TEXT), '') AS created_at,
            COALESCE(CAST(updated_at AS TEXT), '') AS updated_at
        FROM iam_role
        WHERE CAST(tenant_id AS TEXT) = ?1
          AND (?2 = 'all' OR LOWER(CAST(status AS TEXT)) = LOWER(?2) OR (?2 = 'active' AND CAST(status AS TEXT) = '1'))
          AND (?3 = '' OR LOWER(COALESCE(code, '') || ' ' || COALESCE(name, '')) LIKE '%' || LOWER(?3) || '%')
        ORDER BY code ASC, id ASC
        LIMIT ?4
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(status_filter(query))
    .bind(search_filter(query))
    .bind(page_size(query))
    .fetch_all(pool)
    .await?;
    Ok(rows.into_iter().map(sqlite_role_value).collect())
}

async fn list_postgres_roles(
    pool: &PgPool,
    subject: AppIamDirectorySubject,
    query: &AppIamDirectoryQuery,
) -> Result<Vec<Value>, sqlx::Error> {
    if !postgres_table_exists(pool, "iam_role").await? {
        return Ok(Vec::new());
    }
    let rows = sqlx::query(
        r#"
        SELECT
            id::text AS id,
            COALESCE(code, '') AS code,
            COALESCE(name, '') AS name,
            COALESCE(status::text, '') AS status,
            COALESCE(created_at::text, '') AS created_at,
            COALESCE(updated_at::text, '') AS updated_at
        FROM iam_role
        WHERE tenant_id::text = $1
          AND ($2 = 'all' OR LOWER(status::text) = LOWER($2) OR ($2 = 'active' AND status::text = '1'))
          AND ($3 = '' OR LOWER(COALESCE(code, '') || ' ' || COALESCE(name, '')) LIKE '%' || LOWER($3) || '%')
        ORDER BY code ASC, id ASC
        LIMIT $4
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(status_filter(query))
    .bind(search_filter(query))
    .bind(page_size(query))
    .fetch_all(pool)
    .await?;
    Ok(rows.into_iter().map(postgres_role_value).collect())
}

async fn list_sqlite_permissions(
    pool: &SqlitePool,
    subject: AppIamDirectorySubject,
    role_id: Option<&str>,
    query: &AppIamDirectoryQuery,
) -> Result<Vec<Value>, sqlx::Error> {
    if !sqlite_table_exists(pool, "iam_permission").await? {
        return Ok(Vec::new());
    }
    if let Some(role_id) = role_id {
        if !sqlite_table_exists(pool, "iam_role_permission").await? {
            return Ok(Vec::new());
        }
        let rows = sqlx::query(
            r#"
            SELECT
                CAST(p.id AS TEXT) AS id,
                COALESCE(p.code, '') AS code,
                COALESCE(p.name, '') AS name,
                COALESCE(p.resource, '') AS resource,
                COALESCE(p.action, '') AS action,
                COALESCE(CAST(p.created_at AS TEXT), '') AS created_at
            FROM iam_permission p
            JOIN iam_role_permission rp ON rp.permission_id = p.id
            WHERE CAST(rp.tenant_id AS TEXT) = ?1
              AND CAST(rp.role_id AS TEXT) = ?2
              AND (?3 = '' OR LOWER(COALESCE(p.code, '') || ' ' || COALESCE(p.name, '') || ' ' || COALESCE(p.resource, '') || ' ' || COALESCE(p.action, '')) LIKE '%' || LOWER(?3) || '%')
            ORDER BY p.code ASC, p.id ASC
            LIMIT ?4
            "#,
        )
        .bind(subject.tenant_id.to_string())
        .bind(role_id)
        .bind(search_filter(query))
        .bind(page_size(query))
        .fetch_all(pool)
        .await?;
        return Ok(rows.into_iter().map(sqlite_permission_value).collect());
    }
    let rows = sqlx::query(
        r#"
        SELECT
            CAST(id AS TEXT) AS id,
            COALESCE(code, '') AS code,
            COALESCE(name, '') AS name,
            COALESCE(resource, '') AS resource,
            COALESCE(action, '') AS action,
            COALESCE(CAST(created_at AS TEXT), '') AS created_at
        FROM iam_permission
        WHERE (?1 = '' OR LOWER(COALESCE(code, '') || ' ' || COALESCE(name, '') || ' ' || COALESCE(resource, '') || ' ' || COALESCE(action, '')) LIKE '%' || LOWER(?1) || '%')
        ORDER BY code ASC, id ASC
        LIMIT ?2
        "#,
    )
    .bind(search_filter(query))
    .bind(page_size(query))
    .fetch_all(pool)
    .await?;
    Ok(rows.into_iter().map(sqlite_permission_value).collect())
}

async fn list_postgres_permissions(
    pool: &PgPool,
    subject: AppIamDirectorySubject,
    role_id: Option<&str>,
    query: &AppIamDirectoryQuery,
) -> Result<Vec<Value>, sqlx::Error> {
    if !postgres_table_exists(pool, "iam_permission").await? {
        return Ok(Vec::new());
    }
    if let Some(role_id) = role_id {
        if !postgres_table_exists(pool, "iam_role_permission").await? {
            return Ok(Vec::new());
        }
        let rows = sqlx::query(
            r#"
            SELECT
                p.id::text AS id,
                COALESCE(p.code, '') AS code,
                COALESCE(p.name, '') AS name,
                COALESCE(p.resource, '') AS resource,
                COALESCE(p.action, '') AS action,
                COALESCE(p.created_at::text, '') AS created_at
            FROM iam_permission p
            JOIN iam_role_permission rp ON rp.permission_id = p.id
            WHERE rp.tenant_id::text = $1
              AND rp.role_id::text = $2
              AND ($3 = '' OR LOWER(COALESCE(p.code, '') || ' ' || COALESCE(p.name, '') || ' ' || COALESCE(p.resource, '') || ' ' || COALESCE(p.action, '')) LIKE '%' || LOWER($3) || '%')
            ORDER BY p.code ASC, p.id ASC
            LIMIT $4
            "#,
        )
        .bind(subject.tenant_id.to_string())
        .bind(role_id)
        .bind(search_filter(query))
        .bind(page_size(query))
        .fetch_all(pool)
        .await?;
        return Ok(rows.into_iter().map(postgres_permission_value).collect());
    }
    let rows = sqlx::query(
        r#"
        SELECT
            id::text AS id,
            COALESCE(code, '') AS code,
            COALESCE(name, '') AS name,
            COALESCE(resource, '') AS resource,
            COALESCE(action, '') AS action,
            COALESCE(created_at::text, '') AS created_at
        FROM iam_permission
        WHERE ($1 = '' OR LOWER(COALESCE(code, '') || ' ' || COALESCE(name, '') || ' ' || COALESCE(resource, '') || ' ' || COALESCE(action, '')) LIKE '%' || LOWER($1) || '%')
        ORDER BY code ASC, id ASC
        LIMIT $2
        "#,
    )
    .bind(search_filter(query))
    .bind(page_size(query))
    .fetch_all(pool)
    .await?;
    Ok(rows.into_iter().map(postgres_permission_value).collect())
}

async fn sqlite_table_exists(pool: &SqlitePool, table_name: &str) -> Result<bool, sqlx::Error> {
    let count = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(1) FROM sqlite_master WHERE type = 'table' AND name = ?",
    )
    .bind(table_name)
    .fetch_one(pool)
    .await?;
    Ok(count > 0)
}

async fn postgres_table_exists(pool: &PgPool, table_name: &str) -> Result<bool, sqlx::Error> {
    let exists = sqlx::query_scalar::<_, bool>(
        r#"
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = ANY (current_schemas(false))
              AND table_name = $1
        )
        "#,
    )
    .bind(table_name)
    .fetch_one(pool)
    .await?;
    Ok(exists)
}

fn sqlite_role_value(row: sqlx::sqlite::SqliteRow) -> Value {
    role_value(
        sqlite_string_cell(&row, "id"),
        sqlite_string_cell(&row, "code"),
        sqlite_string_cell(&row, "name"),
        sqlite_string_cell(&row, "status"),
        sqlite_string_cell(&row, "created_at"),
        sqlite_string_cell(&row, "updated_at"),
    )
}

fn postgres_role_value(row: sqlx::postgres::PgRow) -> Value {
    role_value(
        postgres_string_cell(&row, "id"),
        postgres_string_cell(&row, "code"),
        postgres_string_cell(&row, "name"),
        postgres_string_cell(&row, "status"),
        postgres_string_cell(&row, "created_at"),
        postgres_string_cell(&row, "updated_at"),
    )
}

fn role_value(
    id: String,
    code: String,
    name: String,
    status: String,
    created_at: String,
    updated_at: String,
) -> Value {
    json!({
        "id": id,
        "code": code,
        "name": name,
        "status": status,
        "description": "",
        "createdAt": created_at,
        "updatedAt": updated_at,
    })
}

fn sqlite_permission_value(row: sqlx::sqlite::SqliteRow) -> Value {
    permission_value(
        sqlite_string_cell(&row, "id"),
        sqlite_string_cell(&row, "code"),
        sqlite_string_cell(&row, "name"),
        sqlite_string_cell(&row, "resource"),
        sqlite_string_cell(&row, "action"),
        sqlite_string_cell(&row, "created_at"),
    )
}

fn postgres_permission_value(row: sqlx::postgres::PgRow) -> Value {
    permission_value(
        postgres_string_cell(&row, "id"),
        postgres_string_cell(&row, "code"),
        postgres_string_cell(&row, "name"),
        postgres_string_cell(&row, "resource"),
        postgres_string_cell(&row, "action"),
        postgres_string_cell(&row, "created_at"),
    )
}

fn permission_value(
    id: String,
    code: String,
    name: String,
    resource: String,
    action: String,
    created_at: String,
) -> Value {
    json!({
        "id": id,
        "code": code,
        "name": name,
        "resource": resource,
        "action": action,
        "status": "active",
        "description": "",
        "createdAt": created_at,
        "updatedAt": created_at,
    })
}

fn sqlite_string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> String {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .unwrap_or_default()
}

fn sqlite_optional_string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<String> {
    let value = sqlite_string_cell(row, column);
    if value.trim().is_empty() {
        None
    } else {
        Some(value)
    }
}

fn postgres_string_cell(row: &sqlx::postgres::PgRow, column: &str) -> String {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .unwrap_or_default()
}

fn postgres_optional_string_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<String> {
    let value = postgres_string_cell(row, column);
    if value.trim().is_empty() {
        None
    } else {
        Some(value)
    }
}

fn status_filter(query: &AppIamDirectoryQuery) -> String {
    query
        .status
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .unwrap_or("active")
        .to_owned()
}

fn search_filter(query: &AppIamDirectoryQuery) -> String {
    query
        .q
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .unwrap_or("")
        .to_owned()
}

fn page_size(query: &AppIamDirectoryQuery) -> i64 {
    query.page_size.unwrap_or(200).clamp(1, 500)
}
