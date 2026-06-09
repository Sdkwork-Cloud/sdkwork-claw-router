use std::collections::HashMap;

use axum::body::Bytes;
use axum::extract::{Path, Query, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{delete, get, patch, post};
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde_json::{json, Map, Value};
use sqlx::{PgPool, Row, SqlitePool};

use crate::api::response::PlusApiResult;
use crate::api::AdminAppbaseBackendIamSqlReadStore;
use crate::infrastructure::sql::runtime_id::next_claw_runtime_id;

#[derive(Clone)]
struct AdminAppbaseBackendIamOauthState {
    sql_read_store: AdminAppbaseBackendIamSqlReadStore,
}

#[derive(Debug, Clone, Copy)]
struct OAuthSubject {
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
}

#[derive(Debug, Clone, Copy)]
enum OAuthResource {
    ProviderCatalog,
    Integrations,
    Clients,
    Secrets,
    Surfaces,
    FlowConfigs,
    ScopeProfiles,
    ClaimMappings,
    Policies,
    TenantBindings,
    OperatorPlatforms,
    ResourceAccounts,
    ResourceAuthorizations,
    WebhookConfigs,
    OperationalResources,
    AccountLinks,
    Grants,
    CallbackEvents,
    DiagnosticRuns,
}

#[derive(Debug, Clone, Copy)]
enum OAuthAction {
    OperatorPreAuthorization,
    ResourceAccountVerification,
    MiniProgramLoginCheck,
    AuthorizationRefresh,
    WebhookVerification,
    OperationalResourcePublish,
}

#[derive(Debug, Clone, Copy)]
enum BindValue {
    Text,
    Integer,
}

#[derive(Debug, Clone)]
enum SqlParam {
    Text(String),
    Integer(i64),
}

#[derive(Debug)]
enum OAuthCommandError {
    BadRequest(String),
    NotFound(String),
    System(String),
}

#[derive(Debug, Clone, Copy)]
struct ResourceSpec {
    api_name: &'static str,
    table_name: &'static str,
    id_alias: &'static str,
    required_create_fields: &'static [&'static str],
}

pub fn admin_appbase_backend_iam_oauth_router_with_read_store(
    sql_read_store: AdminAppbaseBackendIamSqlReadStore,
) -> Router {
    Router::new()
        .route(
            "/backend/v3/api/iam/oauth/provider_catalog",
            get(list_provider_catalog).post(create_provider_catalog),
        )
        .route(
            "/backend/v3/api/iam/oauth/provider_catalog/{provider_catalog_id}",
            get(retrieve_provider_catalog).patch(update_provider_catalog),
        )
        .route(
            "/backend/v3/api/iam/oauth/integrations",
            get(list_integrations).post(create_integration),
        )
        .route(
            "/backend/v3/api/iam/oauth/integrations/{integration_id}",
            get(retrieve_integration)
                .patch(update_integration)
                .delete(delete_integration),
        )
        .route(
            "/backend/v3/api/iam/oauth/clients",
            get(list_clients).post(create_client),
        )
        .route(
            "/backend/v3/api/iam/oauth/clients/{client_id}",
            get(retrieve_client).patch(update_client).delete(delete_client),
        )
        .route(
            "/backend/v3/api/iam/oauth/secrets",
            get(list_secrets).post(create_secret),
        )
        .route(
            "/backend/v3/api/iam/oauth/secrets/{secret_id}",
            delete(delete_secret),
        )
        .route(
            "/backend/v3/api/iam/oauth/surfaces",
            get(list_surfaces).post(create_surface),
        )
        .route(
            "/backend/v3/api/iam/oauth/surfaces/{surface_id}",
            patch(update_surface).delete(delete_surface),
        )
        .route(
            "/backend/v3/api/iam/oauth/flow_configs",
            get(list_flow_configs).post(create_flow_config),
        )
        .route(
            "/backend/v3/api/iam/oauth/flow_configs/{flow_config_id}",
            patch(update_flow_config),
        )
        .route(
            "/backend/v3/api/iam/oauth/scope_profiles",
            get(list_scope_profiles).post(create_scope_profile),
        )
        .route(
            "/backend/v3/api/iam/oauth/scope_profiles/{scope_profile_id}",
            patch(update_scope_profile),
        )
        .route(
            "/backend/v3/api/iam/oauth/claim_mappings",
            get(list_claim_mappings).post(create_claim_mapping),
        )
        .route(
            "/backend/v3/api/iam/oauth/claim_mappings/{mapping_id}",
            patch(update_claim_mapping),
        )
        .route(
            "/backend/v3/api/iam/oauth/policies",
            get(list_policies).post(create_policy),
        )
        .route(
            "/backend/v3/api/iam/oauth/policies/{policy_id}",
            patch(update_policy),
        )
        .route(
            "/backend/v3/api/iam/oauth/tenant_bindings",
            get(list_tenant_bindings).post(create_tenant_binding),
        )
        .route(
            "/backend/v3/api/iam/oauth/tenant_bindings/{binding_id}",
            patch(update_tenant_binding),
        )
        .route(
            "/backend/v3/api/iam/oauth/operator_platforms",
            get(list_operator_platforms).post(create_operator_platform),
        )
        .route(
            "/backend/v3/api/iam/oauth/operator_platforms/{operator_platform_id}",
            patch(update_operator_platform),
        )
        .route(
            "/backend/v3/api/iam/oauth/operator_platforms/{operator_platform_id}/pre_authorizations",
            post(create_operator_pre_authorization),
        )
        .route(
            "/backend/v3/api/iam/oauth/resource_accounts",
            get(list_resource_accounts).post(create_resource_account),
        )
        .route(
            "/backend/v3/api/iam/oauth/resource_accounts/{resource_account_id}",
            patch(update_resource_account),
        )
        .route(
            "/backend/v3/api/iam/oauth/resource_accounts/{resource_account_id}/verifications",
            post(create_resource_account_verification),
        )
        .route(
            "/backend/v3/api/iam/oauth/resource_accounts/{resource_account_id}/mini_program_login_checks",
            post(create_mini_program_login_check),
        )
        .route(
            "/backend/v3/api/iam/oauth/resource_accounts/{resource_account_id}/authorization_refreshes",
            post(create_authorization_refresh),
        )
        .route(
            "/backend/v3/api/iam/oauth/resource_authorizations",
            get(list_resource_authorizations).post(create_resource_authorization),
        )
        .route(
            "/backend/v3/api/iam/oauth/resource_authorizations/{authorization_id}",
            patch(update_resource_authorization),
        )
        .route(
            "/backend/v3/api/iam/oauth/webhook_configs",
            get(list_webhook_configs).post(create_webhook_config),
        )
        .route(
            "/backend/v3/api/iam/oauth/webhook_configs/{webhook_config_id}",
            patch(update_webhook_config),
        )
        .route(
            "/backend/v3/api/iam/oauth/webhook_configs/{webhook_config_id}/verifications",
            post(create_webhook_verification),
        )
        .route(
            "/backend/v3/api/iam/oauth/operational_resources",
            get(list_operational_resources).post(create_operational_resource),
        )
        .route(
            "/backend/v3/api/iam/oauth/operational_resources/{resource_id}",
            patch(update_operational_resource).delete(delete_operational_resource),
        )
        .route(
            "/backend/v3/api/iam/oauth/operational_resources/{resource_id}/publishes",
            post(create_operational_resource_publish),
        )
        .route(
            "/backend/v3/api/iam/oauth/account_links",
            get(list_account_links),
        )
        .route(
            "/backend/v3/api/iam/oauth/account_links/{account_link_id}",
            patch(update_account_link),
        )
        .route("/backend/v3/api/iam/oauth/grants", get(list_grants))
        .route(
            "/backend/v3/api/iam/oauth/grants/{grant_id}",
            delete(delete_grant),
        )
        .route(
            "/backend/v3/api/iam/oauth/callback_events",
            get(list_callback_events),
        )
        .route(
            "/backend/v3/api/iam/oauth/diagnostic_runs",
            get(list_diagnostic_runs).post(create_diagnostic_run),
        )
        .route(
            "/backend/v3/api/iam/oauth/diagnostic_runs/{diagnostic_run_id}",
            get(retrieve_diagnostic_run),
        )
        .with_state(AdminAppbaseBackendIamOauthState { sql_read_store })
}

macro_rules! list_handler {
    ($name:ident, $resource:expr) => {
        async fn $name(
            State(state): State<AdminAppbaseBackendIamOauthState>,
            Query(query): Query<HashMap<String, String>>,
            headers: HeaderMap,
        ) -> Response {
            list_resource(state, headers, query, $resource).await
        }
    };
}

macro_rules! create_handler {
    ($name:ident, $resource:expr) => {
        async fn $name(
            State(state): State<AdminAppbaseBackendIamOauthState>,
            headers: HeaderMap,
            body: Bytes,
        ) -> Response {
            create_resource(state, headers, body, $resource).await
        }
    };
}

macro_rules! retrieve_handler {
    ($name:ident, $resource:expr, $param:ident) => {
        async fn $name(
            State(state): State<AdminAppbaseBackendIamOauthState>,
            Path($param): Path<String>,
            headers: HeaderMap,
        ) -> Response {
            retrieve_resource(state, headers, $resource, $param).await
        }
    };
}

macro_rules! update_handler {
    ($name:ident, $resource:expr, $param:ident) => {
        async fn $name(
            State(state): State<AdminAppbaseBackendIamOauthState>,
            Path($param): Path<String>,
            headers: HeaderMap,
            body: Bytes,
        ) -> Response {
            update_resource(state, headers, body, $resource, $param).await
        }
    };
}

macro_rules! delete_handler {
    ($name:ident, $resource:expr, $param:ident) => {
        async fn $name(
            State(state): State<AdminAppbaseBackendIamOauthState>,
            Path($param): Path<String>,
            headers: HeaderMap,
        ) -> Response {
            delete_resource(state, headers, $resource, $param).await
        }
    };
}

list_handler!(list_provider_catalog, OAuthResource::ProviderCatalog);
create_handler!(create_provider_catalog, OAuthResource::ProviderCatalog);
retrieve_handler!(
    retrieve_provider_catalog,
    OAuthResource::ProviderCatalog,
    provider_catalog_id
);
update_handler!(
    update_provider_catalog,
    OAuthResource::ProviderCatalog,
    provider_catalog_id
);
list_handler!(list_integrations, OAuthResource::Integrations);
create_handler!(create_integration, OAuthResource::Integrations);
retrieve_handler!(
    retrieve_integration,
    OAuthResource::Integrations,
    integration_id
);
update_handler!(
    update_integration,
    OAuthResource::Integrations,
    integration_id
);
delete_handler!(
    delete_integration,
    OAuthResource::Integrations,
    integration_id
);
list_handler!(list_clients, OAuthResource::Clients);
create_handler!(create_client, OAuthResource::Clients);
retrieve_handler!(retrieve_client, OAuthResource::Clients, client_id);
update_handler!(update_client, OAuthResource::Clients, client_id);
delete_handler!(delete_client, OAuthResource::Clients, client_id);
list_handler!(list_secrets, OAuthResource::Secrets);
create_handler!(create_secret, OAuthResource::Secrets);
delete_handler!(delete_secret, OAuthResource::Secrets, secret_id);
list_handler!(list_surfaces, OAuthResource::Surfaces);
create_handler!(create_surface, OAuthResource::Surfaces);
update_handler!(update_surface, OAuthResource::Surfaces, surface_id);
delete_handler!(delete_surface, OAuthResource::Surfaces, surface_id);
list_handler!(list_flow_configs, OAuthResource::FlowConfigs);
create_handler!(create_flow_config, OAuthResource::FlowConfigs);
update_handler!(
    update_flow_config,
    OAuthResource::FlowConfigs,
    flow_config_id
);
list_handler!(list_scope_profiles, OAuthResource::ScopeProfiles);
create_handler!(create_scope_profile, OAuthResource::ScopeProfiles);
update_handler!(
    update_scope_profile,
    OAuthResource::ScopeProfiles,
    scope_profile_id
);
list_handler!(list_claim_mappings, OAuthResource::ClaimMappings);
create_handler!(create_claim_mapping, OAuthResource::ClaimMappings);
update_handler!(
    update_claim_mapping,
    OAuthResource::ClaimMappings,
    mapping_id
);
list_handler!(list_policies, OAuthResource::Policies);
create_handler!(create_policy, OAuthResource::Policies);
update_handler!(update_policy, OAuthResource::Policies, policy_id);
list_handler!(list_tenant_bindings, OAuthResource::TenantBindings);
create_handler!(create_tenant_binding, OAuthResource::TenantBindings);
update_handler!(
    update_tenant_binding,
    OAuthResource::TenantBindings,
    binding_id
);
list_handler!(list_operator_platforms, OAuthResource::OperatorPlatforms);
create_handler!(create_operator_platform, OAuthResource::OperatorPlatforms);
update_handler!(
    update_operator_platform,
    OAuthResource::OperatorPlatforms,
    operator_platform_id
);
list_handler!(list_resource_accounts, OAuthResource::ResourceAccounts);
create_handler!(create_resource_account, OAuthResource::ResourceAccounts);
update_handler!(
    update_resource_account,
    OAuthResource::ResourceAccounts,
    resource_account_id
);
list_handler!(
    list_resource_authorizations,
    OAuthResource::ResourceAuthorizations
);
create_handler!(
    create_resource_authorization,
    OAuthResource::ResourceAuthorizations
);
update_handler!(
    update_resource_authorization,
    OAuthResource::ResourceAuthorizations,
    authorization_id
);
list_handler!(list_webhook_configs, OAuthResource::WebhookConfigs);
create_handler!(create_webhook_config, OAuthResource::WebhookConfigs);
update_handler!(
    update_webhook_config,
    OAuthResource::WebhookConfigs,
    webhook_config_id
);
list_handler!(
    list_operational_resources,
    OAuthResource::OperationalResources
);
create_handler!(
    create_operational_resource,
    OAuthResource::OperationalResources
);
update_handler!(
    update_operational_resource,
    OAuthResource::OperationalResources,
    resource_id
);
delete_handler!(
    delete_operational_resource,
    OAuthResource::OperationalResources,
    resource_id
);
list_handler!(list_account_links, OAuthResource::AccountLinks);
update_handler!(
    update_account_link,
    OAuthResource::AccountLinks,
    account_link_id
);
list_handler!(list_grants, OAuthResource::Grants);
delete_handler!(delete_grant, OAuthResource::Grants, grant_id);
list_handler!(list_callback_events, OAuthResource::CallbackEvents);
list_handler!(list_diagnostic_runs, OAuthResource::DiagnosticRuns);
create_handler!(create_diagnostic_run, OAuthResource::DiagnosticRuns);
retrieve_handler!(
    retrieve_diagnostic_run,
    OAuthResource::DiagnosticRuns,
    diagnostic_run_id
);

async fn create_operator_pre_authorization(
    State(state): State<AdminAppbaseBackendIamOauthState>,
    Path(operator_platform_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    create_action(
        state,
        headers,
        body,
        OAuthAction::OperatorPreAuthorization,
        "operator_platform",
        operator_platform_id,
    )
    .await
}

async fn create_resource_account_verification(
    State(state): State<AdminAppbaseBackendIamOauthState>,
    Path(resource_account_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    create_action(
        state,
        headers,
        body,
        OAuthAction::ResourceAccountVerification,
        "resource_account",
        resource_account_id,
    )
    .await
}

async fn create_mini_program_login_check(
    State(state): State<AdminAppbaseBackendIamOauthState>,
    Path(resource_account_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    create_action(
        state,
        headers,
        body,
        OAuthAction::MiniProgramLoginCheck,
        "resource_account",
        resource_account_id,
    )
    .await
}

async fn create_authorization_refresh(
    State(state): State<AdminAppbaseBackendIamOauthState>,
    Path(resource_account_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    create_action(
        state,
        headers,
        body,
        OAuthAction::AuthorizationRefresh,
        "resource_account",
        resource_account_id,
    )
    .await
}

async fn create_webhook_verification(
    State(state): State<AdminAppbaseBackendIamOauthState>,
    Path(webhook_config_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    create_action(
        state,
        headers,
        body,
        OAuthAction::WebhookVerification,
        "webhook_config",
        webhook_config_id,
    )
    .await
}

async fn create_operational_resource_publish(
    State(state): State<AdminAppbaseBackendIamOauthState>,
    Path(resource_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    create_action(
        state,
        headers,
        body,
        OAuthAction::OperationalResourcePublish,
        "operational_resource",
        resource_id,
    )
    .await
}

async fn list_resource(
    state: AdminAppbaseBackendIamOauthState,
    headers: HeaderMap,
    query: HashMap<String, String>,
    resource: OAuthResource,
) -> Response {
    let subject = match oauth_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match oauth_list(&state.sql_read_store, subject, resource, &query).await {
        Ok(items) => Json(PlusApiResult::success(json!({ "items": items }))).into_response(),
        Err(error) => oauth_sql_error(resource_spec(resource).api_name, error),
    }
}

async fn retrieve_resource(
    state: AdminAppbaseBackendIamOauthState,
    headers: HeaderMap,
    resource: OAuthResource,
    id: String,
) -> Response {
    let subject = match oauth_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match oauth_retrieve(&state.sql_read_store, subject, resource, &id).await {
        Ok(item) => Json(PlusApiResult::success(json!({ "item": item }))).into_response(),
        Err(error) => oauth_command_error_response(error),
    }
}

async fn create_resource(
    state: AdminAppbaseBackendIamOauthState,
    headers: HeaderMap,
    body: Bytes,
    resource: OAuthResource,
) -> Response {
    let subject = match oauth_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let body = match parse_oauth_body(&body) {
        Ok(body) => body,
        Err(response) => return response,
    };
    match oauth_create(&state.sql_read_store, subject, resource, &body).await {
        Ok(item) => Json(PlusApiResult::success(json!({ "item": item }))).into_response(),
        Err(error) => oauth_command_error_response(error),
    }
}

async fn update_resource(
    state: AdminAppbaseBackendIamOauthState,
    headers: HeaderMap,
    body: Bytes,
    resource: OAuthResource,
    id: String,
) -> Response {
    let subject = match oauth_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let body = match parse_oauth_body(&body) {
        Ok(body) => body,
        Err(response) => return response,
    };
    match oauth_update(&state.sql_read_store, subject, resource, &id, &body).await {
        Ok(item) => Json(PlusApiResult::success(json!({ "item": item }))).into_response(),
        Err(error) => oauth_command_error_response(error),
    }
}

async fn delete_resource(
    state: AdminAppbaseBackendIamOauthState,
    headers: HeaderMap,
    resource: OAuthResource,
    id: String,
) -> Response {
    let subject = match oauth_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match oauth_delete(&state.sql_read_store, subject, resource, &id).await {
        Ok(true) => Json(PlusApiResult::success(json!({ "deleted": true }))).into_response(),
        Ok(false) => oauth_command_error_response(OAuthCommandError::NotFound(format!(
            "{} was not found",
            resource_spec(resource).api_name
        ))),
        Err(error) => oauth_command_error_response(error),
    }
}

async fn create_action(
    state: AdminAppbaseBackendIamOauthState,
    headers: HeaderMap,
    body: Bytes,
    action: OAuthAction,
    target_type: &'static str,
    target_id: String,
) -> Response {
    let subject = match oauth_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let mut body = match parse_oauth_body(&body) {
        Ok(body) => body,
        Err(response) => return response,
    };
    set_object_field(&mut body, "runKind", action.run_kind());
    set_object_field(&mut body, "targetType", target_type);
    set_object_field(&mut body, "targetId", target_id.as_str());
    match oauth_create_action_diagnostic(&state.sql_read_store, subject, action, &body).await {
        Ok(item) => Json(PlusApiResult::success(json!({ "item": item }))).into_response(),
        Err(error) => oauth_command_error_response(error),
    }
}

impl OAuthAction {
    fn run_kind(self) -> &'static str {
        match self {
            Self::OperatorPreAuthorization => "operator_pre_authorization",
            Self::ResourceAccountVerification => "resource_account_verification",
            Self::MiniProgramLoginCheck => "mini_program_login_check",
            Self::AuthorizationRefresh => "authorization_refresh",
            Self::WebhookVerification => "webhook_verification",
            Self::OperationalResourcePublish => "operational_resource_publish",
        }
    }
}

async fn oauth_list(
    store: &AdminAppbaseBackendIamSqlReadStore,
    subject: OAuthSubject,
    resource: OAuthResource,
    query: &HashMap<String, String>,
) -> Result<Vec<Value>, sqlx::Error> {
    match store {
        AdminAppbaseBackendIamSqlReadStore::Sqlite(pool) => {
            sqlite_list(pool, subject, resource, query).await
        }
        AdminAppbaseBackendIamSqlReadStore::Postgres(pool) => {
            postgres_list(pool, subject, resource, query).await
        }
    }
}

async fn oauth_retrieve(
    store: &AdminAppbaseBackendIamSqlReadStore,
    subject: OAuthSubject,
    resource: OAuthResource,
    id: &str,
) -> Result<Value, OAuthCommandError> {
    match store {
        AdminAppbaseBackendIamSqlReadStore::Sqlite(pool) => {
            sqlite_retrieve(pool, subject, resource, id).await
        }
        AdminAppbaseBackendIamSqlReadStore::Postgres(pool) => {
            postgres_retrieve(pool, subject, resource, id).await
        }
    }
}

async fn oauth_create(
    store: &AdminAppbaseBackendIamSqlReadStore,
    subject: OAuthSubject,
    resource: OAuthResource,
    body: &Value,
) -> Result<Value, OAuthCommandError> {
    validate_required_create_fields(resource, body)?;
    match store {
        AdminAppbaseBackendIamSqlReadStore::Sqlite(pool) => {
            sqlite_create(pool, subject, resource, body).await
        }
        AdminAppbaseBackendIamSqlReadStore::Postgres(pool) => {
            postgres_create(pool, subject, resource, body).await
        }
    }
}

async fn oauth_update(
    store: &AdminAppbaseBackendIamSqlReadStore,
    subject: OAuthSubject,
    resource: OAuthResource,
    id: &str,
    body: &Value,
) -> Result<Value, OAuthCommandError> {
    match store {
        AdminAppbaseBackendIamSqlReadStore::Sqlite(pool) => {
            sqlite_update(pool, subject, resource, id, body).await
        }
        AdminAppbaseBackendIamSqlReadStore::Postgres(pool) => {
            postgres_update(pool, subject, resource, id, body).await
        }
    }
}

async fn oauth_delete(
    store: &AdminAppbaseBackendIamSqlReadStore,
    subject: OAuthSubject,
    resource: OAuthResource,
    id: &str,
) -> Result<bool, OAuthCommandError> {
    match store {
        AdminAppbaseBackendIamSqlReadStore::Sqlite(pool) => {
            sqlite_delete(pool, subject, resource, id).await
        }
        AdminAppbaseBackendIamSqlReadStore::Postgres(pool) => {
            postgres_delete(pool, subject, resource, id).await
        }
    }
}

async fn oauth_create_action_diagnostic(
    store: &AdminAppbaseBackendIamSqlReadStore,
    subject: OAuthSubject,
    action: OAuthAction,
    body: &Value,
) -> Result<Value, OAuthCommandError> {
    let mut command = body.clone();
    set_object_field(&mut command, "runKind", action.run_kind());
    set_object_field(&mut command, "status", "queued");
    set_object_field(
        &mut command,
        "resultSummary",
        "OAuth provider action was recorded for diagnostics; provider execution requires a configured provider worker.",
    );
    oauth_create(store, subject, OAuthResource::DiagnosticRuns, &command).await
}

async fn sqlite_list(
    pool: &SqlitePool,
    subject: OAuthSubject,
    resource: OAuthResource,
    query: &HashMap<String, String>,
) -> Result<Vec<Value>, sqlx::Error> {
    let spec = resource_spec(resource);
    let columns = sqlite_table_columns(pool, spec.table_name).await?;
    if columns.is_empty() {
        return Ok(Vec::new());
    }
    let mut params = Vec::new();
    let where_sql = sqlite_where_clause(&columns, subject, resource, query, &mut params);
    let order_column = default_order_column(&columns, resource);
    let limit = page_size(query);
    let offset = page_offset(query);
    params.push(SqlParam::Integer(limit));
    params.push(SqlParam::Integer(offset));
    let sql = format!(
        "SELECT {} FROM {}{} ORDER BY {} LIMIT ? OFFSET ?",
        sqlite_select_columns(&columns),
        quote_sqlite_identifier(spec.table_name),
        where_sql,
        quote_sqlite_identifier(order_column),
    );
    let mut sql_query = sqlx::query(sql.as_str());
    for param in params {
        sql_query = bind_sqlite_param(sql_query, param);
    }
    let rows = sql_query.fetch_all(pool).await?;
    Ok(rows
        .into_iter()
        .map(|row| sqlite_row_value(&row, resource, &columns))
        .collect())
}

async fn postgres_list(
    pool: &PgPool,
    subject: OAuthSubject,
    resource: OAuthResource,
    query: &HashMap<String, String>,
) -> Result<Vec<Value>, sqlx::Error> {
    let spec = resource_spec(resource);
    let columns = postgres_table_columns(pool, spec.table_name).await?;
    if columns.is_empty() {
        return Ok(Vec::new());
    }
    let mut params = Vec::new();
    let where_sql = postgres_where_clause(&columns, subject, resource, query, &mut params);
    let order_column = default_order_column(&columns, resource);
    let limit_placeholder = postgres_push_param(&mut params, SqlParam::Integer(page_size(query)));
    let offset_placeholder =
        postgres_push_param(&mut params, SqlParam::Integer(page_offset(query)));
    let sql = format!(
        "SELECT {} FROM {}{} ORDER BY {} LIMIT {} OFFSET {}",
        postgres_select_columns(&columns),
        quote_postgres_identifier(spec.table_name),
        where_sql,
        quote_postgres_identifier(order_column),
        limit_placeholder,
        offset_placeholder,
    );
    let mut sql_query = sqlx::query(sql.as_str());
    for param in params {
        sql_query = bind_postgres_param(sql_query, param);
    }
    let rows = sql_query.fetch_all(pool).await?;
    Ok(rows
        .into_iter()
        .map(|row| postgres_row_value(&row, resource, &columns))
        .collect())
}

async fn sqlite_retrieve(
    pool: &SqlitePool,
    subject: OAuthSubject,
    resource: OAuthResource,
    id: &str,
) -> Result<Value, OAuthCommandError> {
    let spec = resource_spec(resource);
    let columns = sqlite_table_columns(pool, spec.table_name).await?;
    if columns.is_empty() {
        return Err(OAuthCommandError::System(format!(
            "{} table is not installed",
            spec.table_name
        )));
    }
    let mut params = Vec::new();
    let where_sql = sqlite_identity_where_clause(&columns, subject, resource, id, &mut params);
    let sql = format!(
        "SELECT {} FROM {}{} LIMIT 1",
        sqlite_select_columns(&columns),
        quote_sqlite_identifier(spec.table_name),
        where_sql,
    );
    let mut sql_query = sqlx::query(sql.as_str());
    for param in params {
        sql_query = bind_sqlite_param(sql_query, param);
    }
    let row = sql_query
        .fetch_optional(pool)
        .await
        .map_err(OAuthCommandError::from)?
        .ok_or_else(|| OAuthCommandError::NotFound(format!("{} was not found", spec.api_name)))?;
    Ok(sqlite_row_value(&row, resource, &columns))
}

async fn postgres_retrieve(
    pool: &PgPool,
    subject: OAuthSubject,
    resource: OAuthResource,
    id: &str,
) -> Result<Value, OAuthCommandError> {
    let spec = resource_spec(resource);
    let columns = postgres_table_columns(pool, spec.table_name).await?;
    if columns.is_empty() {
        return Err(OAuthCommandError::System(format!(
            "{} table is not installed",
            spec.table_name
        )));
    }
    let mut params = Vec::new();
    let where_sql = postgres_identity_where_clause(&columns, subject, resource, id, &mut params);
    let sql = format!(
        "SELECT {} FROM {}{} LIMIT 1",
        postgres_select_columns(&columns),
        quote_postgres_identifier(spec.table_name),
        where_sql,
    );
    let mut sql_query = sqlx::query(sql.as_str());
    for param in params {
        sql_query = bind_postgres_param(sql_query, param);
    }
    let row = sql_query
        .fetch_optional(pool)
        .await
        .map_err(OAuthCommandError::from)?
        .ok_or_else(|| OAuthCommandError::NotFound(format!("{} was not found", spec.api_name)))?;
    Ok(postgres_row_value(&row, resource, &columns))
}

async fn sqlite_create(
    pool: &SqlitePool,
    subject: OAuthSubject,
    resource: OAuthResource,
    body: &Value,
) -> Result<Value, OAuthCommandError> {
    let spec = resource_spec(resource);
    let columns = sqlite_table_columns(pool, spec.table_name)
        .await
        .map_err(OAuthCommandError::from)?;
    if columns.is_empty() {
        return Err(OAuthCommandError::System(format!(
            "{} table is not installed",
            spec.table_name
        )));
    }
    let id = next_oauth_id(spec.api_name)?;
    let now = current_utc_timestamp_string();
    let mut insert_columns = Vec::new();
    let mut params = Vec::new();
    for column in columns.iter() {
        insert_columns.push(quote_sqlite_identifier(column));
        params.push(create_column_value(
            subject,
            resource,
            column,
            body,
            id.as_str(),
            now.as_str(),
        ));
    }
    let placeholders = vec!["?"; insert_columns.len()].join(", ");
    let sql = format!(
        "INSERT INTO {} ({}) VALUES ({})",
        quote_sqlite_identifier(spec.table_name),
        insert_columns.join(", "),
        placeholders,
    );
    let mut sql_query = sqlx::query(sql.as_str());
    for param in params {
        sql_query = bind_sqlite_param(sql_query, param);
    }
    sql_query
        .execute(pool)
        .await
        .map_err(OAuthCommandError::from)?;
    sqlite_retrieve(pool, subject, resource, id.as_str()).await
}

async fn postgres_create(
    pool: &PgPool,
    subject: OAuthSubject,
    resource: OAuthResource,
    body: &Value,
) -> Result<Value, OAuthCommandError> {
    let spec = resource_spec(resource);
    let columns = postgres_table_columns(pool, spec.table_name)
        .await
        .map_err(OAuthCommandError::from)?;
    if columns.is_empty() {
        return Err(OAuthCommandError::System(format!(
            "{} table is not installed",
            spec.table_name
        )));
    }
    let id = next_oauth_id(spec.api_name)?;
    let now = current_utc_timestamp_string();
    let mut insert_columns = Vec::new();
    let mut params = Vec::new();
    let mut placeholders = Vec::new();
    for column in columns.iter() {
        insert_columns.push(quote_postgres_identifier(column));
        let param = create_column_value(subject, resource, column, body, id.as_str(), now.as_str());
        placeholders.push(postgres_push_param(&mut params, param));
    }
    let sql = format!(
        "INSERT INTO {} ({}) VALUES ({})",
        quote_postgres_identifier(spec.table_name),
        insert_columns.join(", "),
        placeholders.join(", "),
    );
    let mut sql_query = sqlx::query(sql.as_str());
    for param in params {
        sql_query = bind_postgres_param(sql_query, param);
    }
    sql_query
        .execute(pool)
        .await
        .map_err(OAuthCommandError::from)?;
    postgres_retrieve(pool, subject, resource, id.as_str()).await
}

async fn sqlite_update(
    pool: &SqlitePool,
    subject: OAuthSubject,
    resource: OAuthResource,
    id: &str,
    body: &Value,
) -> Result<Value, OAuthCommandError> {
    let spec = resource_spec(resource);
    let columns = sqlite_table_columns(pool, spec.table_name)
        .await
        .map_err(OAuthCommandError::from)?;
    if columns.is_empty() {
        return Err(OAuthCommandError::System(format!(
            "{} table is not installed",
            spec.table_name
        )));
    }
    let mut params = Vec::new();
    let assignments = update_assignments(&columns, body, false, &mut params);
    if assignments.is_empty() {
        return sqlite_retrieve(pool, subject, resource, id).await;
    }
    let mut where_params = Vec::new();
    let where_sql =
        sqlite_identity_where_clause(&columns, subject, resource, id, &mut where_params);
    params.extend(where_params);
    let sql = format!(
        "UPDATE {} SET {}{}",
        quote_sqlite_identifier(spec.table_name),
        assignments.join(", "),
        where_sql,
    );
    let mut sql_query = sqlx::query(sql.as_str());
    for param in params {
        sql_query = bind_sqlite_param(sql_query, param);
    }
    let result = sql_query
        .execute(pool)
        .await
        .map_err(OAuthCommandError::from)?;
    if result.rows_affected() == 0 {
        return Err(OAuthCommandError::NotFound(format!(
            "{} was not found",
            spec.api_name
        )));
    }
    sqlite_retrieve(pool, subject, resource, id).await
}

async fn postgres_update(
    pool: &PgPool,
    subject: OAuthSubject,
    resource: OAuthResource,
    id: &str,
    body: &Value,
) -> Result<Value, OAuthCommandError> {
    let spec = resource_spec(resource);
    let columns = postgres_table_columns(pool, spec.table_name)
        .await
        .map_err(OAuthCommandError::from)?;
    if columns.is_empty() {
        return Err(OAuthCommandError::System(format!(
            "{} table is not installed",
            spec.table_name
        )));
    }
    let mut params = Vec::new();
    let assignments = update_assignments(&columns, body, true, &mut params);
    if assignments.is_empty() {
        return postgres_retrieve(pool, subject, resource, id).await;
    }
    let where_sql = postgres_identity_where_clause(&columns, subject, resource, id, &mut params);
    let sql = format!(
        "UPDATE {} SET {}{}",
        quote_postgres_identifier(spec.table_name),
        assignments.join(", "),
        where_sql,
    );
    let mut sql_query = sqlx::query(sql.as_str());
    for param in params {
        sql_query = bind_postgres_param(sql_query, param);
    }
    let result = sql_query
        .execute(pool)
        .await
        .map_err(OAuthCommandError::from)?;
    if result.rows_affected() == 0 {
        return Err(OAuthCommandError::NotFound(format!(
            "{} was not found",
            spec.api_name
        )));
    }
    postgres_retrieve(pool, subject, resource, id).await
}

async fn sqlite_delete(
    pool: &SqlitePool,
    subject: OAuthSubject,
    resource: OAuthResource,
    id: &str,
) -> Result<bool, OAuthCommandError> {
    let spec = resource_spec(resource);
    let columns = sqlite_table_columns(pool, spec.table_name)
        .await
        .map_err(OAuthCommandError::from)?;
    if columns.is_empty() {
        return Err(OAuthCommandError::System(format!(
            "{} table is not installed",
            spec.table_name
        )));
    }
    let mut params = Vec::new();
    let sql = if contains_column(&columns, "status") {
        let status = delete_status(resource);
        params.push(SqlParam::Text(status.to_owned()));
        if contains_column(&columns, "updated_at") {
            params.push(SqlParam::Text(current_utc_timestamp_string()));
        }
        let mut where_params = Vec::new();
        let where_sql =
            sqlite_identity_where_clause(&columns, subject, resource, id, &mut where_params);
        params.extend(where_params);
        format!(
            "UPDATE {} SET {}{}",
            quote_sqlite_identifier(spec.table_name),
            delete_assignments(&columns, false),
            where_sql,
        )
    } else {
        let where_sql = sqlite_identity_where_clause(&columns, subject, resource, id, &mut params);
        format!(
            "DELETE FROM {}{}",
            quote_sqlite_identifier(spec.table_name),
            where_sql,
        )
    };
    let mut sql_query = sqlx::query(sql.as_str());
    for param in params {
        sql_query = bind_sqlite_param(sql_query, param);
    }
    let result = sql_query
        .execute(pool)
        .await
        .map_err(OAuthCommandError::from)?;
    Ok(result.rows_affected() > 0)
}

async fn postgres_delete(
    pool: &PgPool,
    subject: OAuthSubject,
    resource: OAuthResource,
    id: &str,
) -> Result<bool, OAuthCommandError> {
    let spec = resource_spec(resource);
    let columns = postgres_table_columns(pool, spec.table_name)
        .await
        .map_err(OAuthCommandError::from)?;
    if columns.is_empty() {
        return Err(OAuthCommandError::System(format!(
            "{} table is not installed",
            spec.table_name
        )));
    }
    let mut params = Vec::new();
    let sql = if contains_column(&columns, "status") {
        let status = delete_status(resource);
        let status_placeholder =
            postgres_push_param(&mut params, SqlParam::Text(status.to_owned()));
        let updated_at_assignment = if contains_column(&columns, "updated_at") {
            let placeholder =
                postgres_push_param(&mut params, SqlParam::Text(current_utc_timestamp_string()));
            format!(
                ", {} = {}",
                quote_postgres_identifier("updated_at"),
                placeholder
            )
        } else {
            String::new()
        };
        let where_sql =
            postgres_identity_where_clause(&columns, subject, resource, id, &mut params);
        format!(
            "UPDATE {} SET {} = {}{}{}",
            quote_postgres_identifier(spec.table_name),
            quote_postgres_identifier("status"),
            status_placeholder,
            updated_at_assignment,
            where_sql,
        )
    } else {
        let where_sql =
            postgres_identity_where_clause(&columns, subject, resource, id, &mut params);
        format!(
            "DELETE FROM {}{}",
            quote_postgres_identifier(spec.table_name),
            where_sql,
        )
    };
    let mut sql_query = sqlx::query(sql.as_str());
    for param in params {
        sql_query = bind_postgres_param(sql_query, param);
    }
    let result = sql_query
        .execute(pool)
        .await
        .map_err(OAuthCommandError::from)?;
    Ok(result.rows_affected() > 0)
}

fn sqlite_where_clause(
    columns: &[String],
    subject: OAuthSubject,
    resource: OAuthResource,
    query: &HashMap<String, String>,
    params: &mut Vec<SqlParam>,
) -> String {
    let mut filters = Vec::new();
    append_sqlite_scope_filters(columns, subject, resource, &mut filters, params);
    append_sqlite_status_filter(columns, query, &mut filters, params);
    append_sqlite_optional_filter(
        columns,
        query,
        &mut filters,
        params,
        "providerCode",
        "provider_code",
    );
    append_sqlite_optional_filter(
        columns,
        query,
        &mut filters,
        params,
        "resourceAccountKind",
        "resource_account_kind",
    );
    append_sqlite_optional_filter(
        columns,
        query,
        &mut filters,
        params,
        "ownerMode",
        "access_mode",
    );
    append_sqlite_optional_filter(
        columns,
        query,
        &mut filters,
        params,
        "surface",
        "surface_kind",
    );
    append_sqlite_optional_filter(
        columns,
        query,
        &mut filters,
        params,
        "organizationId",
        "organization_id",
    );
    append_sqlite_search_filter(columns, query, &mut filters, params);
    where_from_filters(filters)
}

fn postgres_where_clause(
    columns: &[String],
    subject: OAuthSubject,
    resource: OAuthResource,
    query: &HashMap<String, String>,
    params: &mut Vec<SqlParam>,
) -> String {
    let mut filters = Vec::new();
    append_postgres_scope_filters(columns, subject, resource, &mut filters, params);
    append_postgres_status_filter(columns, query, &mut filters, params);
    append_postgres_optional_filter(
        columns,
        query,
        &mut filters,
        params,
        "providerCode",
        "provider_code",
    );
    append_postgres_optional_filter(
        columns,
        query,
        &mut filters,
        params,
        "resourceAccountKind",
        "resource_account_kind",
    );
    append_postgres_optional_filter(
        columns,
        query,
        &mut filters,
        params,
        "ownerMode",
        "access_mode",
    );
    append_postgres_optional_filter(
        columns,
        query,
        &mut filters,
        params,
        "surface",
        "surface_kind",
    );
    append_postgres_optional_filter(
        columns,
        query,
        &mut filters,
        params,
        "organizationId",
        "organization_id",
    );
    append_postgres_search_filter(columns, query, &mut filters, params);
    where_from_filters(filters)
}

fn sqlite_identity_where_clause(
    columns: &[String],
    subject: OAuthSubject,
    resource: OAuthResource,
    id: &str,
    params: &mut Vec<SqlParam>,
) -> String {
    let mut filters = Vec::new();
    append_sqlite_scope_filters(columns, subject, resource, &mut filters, params);
    if matches!(resource, OAuthResource::ProviderCatalog) {
        filters.push(format!(
            "({} = ? OR {} = ?)",
            sqlite_text_expr("id"),
            sqlite_text_expr("provider_code")
        ));
        params.push(SqlParam::Text(id.to_owned()));
        params.push(SqlParam::Text(id.to_owned()));
    } else {
        filters.push(format!("{} = ?", sqlite_text_expr("id")));
        params.push(SqlParam::Text(id.to_owned()));
    }
    where_from_filters(filters)
}

fn postgres_identity_where_clause(
    columns: &[String],
    subject: OAuthSubject,
    resource: OAuthResource,
    id: &str,
    params: &mut Vec<SqlParam>,
) -> String {
    let mut filters = Vec::new();
    append_postgres_scope_filters(columns, subject, resource, &mut filters, params);
    if matches!(resource, OAuthResource::ProviderCatalog) {
        let id_placeholder = postgres_push_param(params, SqlParam::Text(id.to_owned()));
        let code_placeholder = postgres_push_param(params, SqlParam::Text(id.to_owned()));
        filters.push(format!(
            "({} = {} OR {} = {})",
            postgres_text_expr("id"),
            id_placeholder,
            postgres_text_expr("provider_code"),
            code_placeholder
        ));
    } else {
        let placeholder = postgres_push_param(params, SqlParam::Text(id.to_owned()));
        filters.push(format!("{} = {}", postgres_text_expr("id"), placeholder));
    }
    where_from_filters(filters)
}

fn append_sqlite_scope_filters(
    columns: &[String],
    subject: OAuthSubject,
    resource: OAuthResource,
    filters: &mut Vec<String>,
    params: &mut Vec<SqlParam>,
) {
    if contains_column(columns, "tenant_id") {
        filters.push(format!("{} = ?", sqlite_text_expr("tenant_id")));
        params.push(SqlParam::Text(subject.tenant_id.to_string()));
    }
    if matches!(resource, OAuthResource::ProviderCatalog)
        && contains_column(columns, "owner_tenant_id")
    {
        filters.push(format!(
            "({} = ? OR {} = ?)",
            sqlite_text_expr("owner_tenant_id"),
            sqlite_text_expr("owner_tenant_id")
        ));
        params.push(SqlParam::Text("0".to_owned()));
        params.push(SqlParam::Text(subject.tenant_id.to_string()));
    }
}

fn append_postgres_scope_filters(
    columns: &[String],
    subject: OAuthSubject,
    resource: OAuthResource,
    filters: &mut Vec<String>,
    params: &mut Vec<SqlParam>,
) {
    if contains_column(columns, "tenant_id") {
        let placeholder =
            postgres_push_param(params, SqlParam::Text(subject.tenant_id.to_string()));
        filters.push(format!(
            "{} = {}",
            postgres_text_expr("tenant_id"),
            placeholder
        ));
    }
    if matches!(resource, OAuthResource::ProviderCatalog)
        && contains_column(columns, "owner_tenant_id")
    {
        let global_placeholder = postgres_push_param(params, SqlParam::Text("0".to_owned()));
        let tenant_placeholder =
            postgres_push_param(params, SqlParam::Text(subject.tenant_id.to_string()));
        filters.push(format!(
            "({} = {} OR {} = {})",
            postgres_text_expr("owner_tenant_id"),
            global_placeholder,
            postgres_text_expr("owner_tenant_id"),
            tenant_placeholder
        ));
    }
}

fn append_sqlite_status_filter(
    columns: &[String],
    query: &HashMap<String, String>,
    filters: &mut Vec<String>,
    params: &mut Vec<SqlParam>,
) {
    if !contains_column(columns, "status") {
        return;
    }
    let status = query_value(query, "status")
        .filter(|value| !value.eq_ignore_ascii_case("all"))
        .unwrap_or_else(|| "active".to_owned());
    filters.push(format!("LOWER({}) = LOWER(?)", sqlite_text_expr("status")));
    params.push(SqlParam::Text(status));
}

fn append_postgres_status_filter(
    columns: &[String],
    query: &HashMap<String, String>,
    filters: &mut Vec<String>,
    params: &mut Vec<SqlParam>,
) {
    if !contains_column(columns, "status") {
        return;
    }
    let status = query_value(query, "status")
        .filter(|value| !value.eq_ignore_ascii_case("all"))
        .unwrap_or_else(|| "active".to_owned());
    let placeholder = postgres_push_param(params, SqlParam::Text(status));
    filters.push(format!(
        "LOWER({}) = LOWER({})",
        postgres_text_expr("status"),
        placeholder
    ));
}

fn append_sqlite_optional_filter(
    columns: &[String],
    query: &HashMap<String, String>,
    filters: &mut Vec<String>,
    params: &mut Vec<SqlParam>,
    query_key: &str,
    column: &str,
) {
    if !contains_column(columns, column) {
        return;
    }
    let Some(value) = query_value(query, query_key) else {
        return;
    };
    filters.push(format!("LOWER({}) = LOWER(?)", sqlite_text_expr(column)));
    params.push(SqlParam::Text(value));
}

fn append_postgres_optional_filter(
    columns: &[String],
    query: &HashMap<String, String>,
    filters: &mut Vec<String>,
    params: &mut Vec<SqlParam>,
    query_key: &str,
    column: &str,
) {
    if !contains_column(columns, column) {
        return;
    }
    let Some(value) = query_value(query, query_key) else {
        return;
    };
    let placeholder = postgres_push_param(params, SqlParam::Text(value));
    filters.push(format!(
        "LOWER({}) = LOWER({})",
        postgres_text_expr(column),
        placeholder
    ));
}

fn append_sqlite_search_filter(
    columns: &[String],
    query: &HashMap<String, String>,
    filters: &mut Vec<String>,
    params: &mut Vec<SqlParam>,
) {
    let Some(q) = query_value(query, "q") else {
        return;
    };
    let searchable = searchable_columns(columns);
    if searchable.is_empty() {
        return;
    }
    let mut parts = Vec::new();
    for column in searchable {
        parts.push(format!("LOWER({}) LIKE ?", sqlite_text_expr(column)));
        params.push(SqlParam::Text(format!("%{}%", q.to_ascii_lowercase())));
    }
    filters.push(format!("({})", parts.join(" OR ")));
}

fn append_postgres_search_filter(
    columns: &[String],
    query: &HashMap<String, String>,
    filters: &mut Vec<String>,
    params: &mut Vec<SqlParam>,
) {
    let Some(q) = query_value(query, "q") else {
        return;
    };
    let searchable = searchable_columns(columns);
    if searchable.is_empty() {
        return;
    }
    let mut parts = Vec::new();
    for column in searchable {
        let placeholder = postgres_push_param(
            params,
            SqlParam::Text(format!("%{}%", q.to_ascii_lowercase())),
        );
        parts.push(format!(
            "LOWER({}) LIKE {}",
            postgres_text_expr(column),
            placeholder
        ));
    }
    filters.push(format!("({})", parts.join(" OR ")));
}

fn where_from_filters(filters: Vec<String>) -> String {
    if filters.is_empty() {
        String::new()
    } else {
        format!(" WHERE {}", filters.join(" AND "))
    }
}

fn update_assignments(
    columns: &[String],
    body: &Value,
    postgres: bool,
    params: &mut Vec<SqlParam>,
) -> Vec<String> {
    let mut assignments = Vec::new();
    for column in columns {
        if !is_writable_column(column) {
            continue;
        }
        let Some(value) = body_value_for_column(body, column) else {
            continue;
        };
        let param = sql_param_for_value(column, value);
        let placeholder = if postgres {
            postgres_push_param(params, param)
        } else {
            params.push(param);
            "?".to_owned()
        };
        let column_name = if postgres {
            quote_postgres_identifier(column)
        } else {
            quote_sqlite_identifier(column)
        };
        assignments.push(format!("{column_name} = {placeholder}"));
    }
    if contains_column(columns, "updated_at")
        && !assignments
            .iter()
            .any(|assignment| assignment.contains("updated_at"))
    {
        let param = SqlParam::Text(current_utc_timestamp_string());
        let placeholder = if postgres {
            postgres_push_param(params, param)
        } else {
            params.push(param);
            "?".to_owned()
        };
        let column_name = if postgres {
            quote_postgres_identifier("updated_at")
        } else {
            quote_sqlite_identifier("updated_at")
        };
        assignments.push(format!("{column_name} = {placeholder}"));
    }
    if contains_column(columns, "version") {
        let column_name = if postgres {
            quote_postgres_identifier("version")
        } else {
            quote_sqlite_identifier("version")
        };
        assignments.push(format!("{column_name} = COALESCE({column_name}, 0) + 1"));
    }
    assignments
}

fn delete_assignments(columns: &[String], postgres: bool) -> String {
    let status_column = if postgres {
        quote_postgres_identifier("status")
    } else {
        quote_sqlite_identifier("status")
    };
    let mut assignments = vec![format!("{status_column} = ?")];
    if contains_column(columns, "updated_at") {
        let updated_at_column = if postgres {
            quote_postgres_identifier("updated_at")
        } else {
            quote_sqlite_identifier("updated_at")
        };
        assignments.push(format!("{updated_at_column} = ?"));
    }
    assignments.join(", ")
}

fn create_column_value(
    subject: OAuthSubject,
    resource: OAuthResource,
    column: &str,
    body: &Value,
    id: &str,
    now: &str,
) -> SqlParam {
    if let Some(value) = body_value_for_column(body, column) {
        return sql_param_for_value(column, value);
    }
    match column {
        "id" | "uuid" => SqlParam::Text(id.to_owned()),
        "tenant_id" | "mapped_tenant_id" => SqlParam::Text(subject.tenant_id.to_string()),
        "owner_tenant_id" => SqlParam::Text("0".to_owned()),
        "organization_id" | "mapped_organization_id" => {
            SqlParam::Text(subject.organization_id.to_string())
        }
        "app_id" => SqlParam::Text("0".to_owned()),
        "environment" => SqlParam::Text("production".to_owned()),
        "deployment_mode" => SqlParam::Text("web".to_owned()),
        "created_by" | "updated_by" | "operator_user_id" => {
            SqlParam::Text(subject.user_id.to_string())
        }
        "created_at" | "updated_at" | "active_from" | "joined_at" | "linked_at" => {
            SqlParam::Text(now.to_owned())
        }
        "started_at" => SqlParam::Text(now.to_owned()),
        "status" => SqlParam::Text(default_status(resource).to_owned()),
        "health_status" => SqlParam::Text("unknown".to_owned()),
        "secret_config_status" | "self_managed_config_status" => {
            SqlParam::Text("not_configured".to_owned())
        }
        "authorization_status"
        | "operator_authorization_status"
        | "webhook_verify_status"
        | "domain_verify_status"
        | "verification_status"
        | "verification_token_status"
        | "encoding_aes_key_status"
        | "ticket_secret_status"
        | "token_secret_status" => SqlParam::Text("pending".to_owned()),
        "client_auth_method" => SqlParam::Text("client_secret_post".to_owned()),
        "pkce_default_mode" | "pkce_mode" => SqlParam::Text("optional".to_owned()),
        "redirect_validation_mode" => SqlParam::Text("exact".to_owned()),
        "flow_purpose" => SqlParam::Text("login".to_owned()),
        "flow_kind" => SqlParam::Text("authorization_code".to_owned()),
        "run_kind" => SqlParam::Text("manual".to_owned()),
        "provider_session_key_retention_policy" => SqlParam::Text("none".to_owned()),
        "binding_kind" => SqlParam::Text("tenant".to_owned()),
        "operator_mode" => SqlParam::Text("self_managed".to_owned()),
        "access_mode" => SqlParam::Text("self_managed".to_owned()),
        "resource_account_kind" => SqlParam::Text("web".to_owned()),
        "secret_owner_kind" => SqlParam::Text("integration".to_owned()),
        "secret_kind" => SqlParam::Text("client_secret".to_owned()),
        "surface_kind" => SqlParam::Text("web".to_owned()),
        "surface_code"
        | "integration_code"
        | "client_code"
        | "scope_profile_code"
        | "policy_code"
        | "platform_code"
        | "resource_account_code"
        | "webhook_code"
        | "resource_code" => SqlParam::Text(generated_code_from_body(body, column)),
        "display_name" | "provider_name" | "provider_display_name" => {
            SqlParam::Text(generated_display_name(body, resource))
        }
        "provider_code" => SqlParam::Text(generated_provider_code(body)),
        "provider_family" => SqlParam::Text(text_or_default(body, "providerFamily", "oauth")),
        "region_group" => SqlParam::Text(text_or_default(body, "regionGroup", "global")),
        "protocol_family" => SqlParam::Text(text_or_default(body, "protocolFamily", "oauth2")),
        "provider_catalog_id" => SqlParam::Text(text_or_default(body, "providerCatalogId", "")),
        "integration_id" => SqlParam::Text(text_or_default(body, "integrationId", "")),
        "oauth_client_id" => SqlParam::Text(text_or_default(body, "oauthClientId", "")),
        "provider_client_id" => SqlParam::Text(text_or_default(body, "providerClientId", "")),
        "provider_account_id" | "provider_platform_id" => {
            SqlParam::Text(text_or_default(body, "providerAccountId", ""))
        }
        "callback_url" => SqlParam::Text(text_or_default(body, "callbackUrl", "")),
        "callback_url_hash" => SqlParam::Text(text_or_default(body, "callbackUrlHash", "")),
        "callback_public_id" => SqlParam::Text(text_or_default(body, "callbackPublicId", id)),
        "webhook_kind" => SqlParam::Text(text_or_default(body, "webhookKind", "event")),
        "encryption_mode" => SqlParam::Text(text_or_default(body, "encryptionMode", "none")),
        "message_handling_mode" => {
            SqlParam::Text(text_or_default(body, "messageHandlingMode", "store"))
        }
        "resource_kind" => SqlParam::Text(text_or_default(body, "resourceKind", "menu")),
        "sync_mode" => SqlParam::Text(text_or_default(body, "syncMode", "manual")),
        "publish_status" => SqlParam::Text(text_or_default(body, "publishStatus", "draft")),
        "outcome" => SqlParam::Text(text_or_default(body, "outcome", "received")),
        "grant_owner_kind" => SqlParam::Text(text_or_default(body, "grantOwnerKind", "user")),
        "link_source" => SqlParam::Text(text_or_default(body, "linkSource", "manual")),
        _ if column.ends_with("_json") => SqlParam::Text(default_json_for_column(column, body)),
        _ if bind_value_kind(column).is_integer() => {
            SqlParam::Integer(default_integer_for_column(column))
        }
        _ => SqlParam::Text(String::new()),
    }
}

fn sql_param_for_value(column: &str, value: &Value) -> SqlParam {
    match bind_value_kind(column) {
        BindValue::Integer => SqlParam::Integer(value_to_i64(value)),
        BindValue::Text => SqlParam::Text(value_to_storage_text(column, value)),
    }
}

fn value_to_storage_text(column: &str, value: &Value) -> String {
    if column.ends_with("_json") {
        return match value {
            Value::String(value) => value.clone(),
            _ => value.to_string(),
        };
    }
    match value {
        Value::String(value) => value.trim().to_owned(),
        Value::Number(value) => value.to_string(),
        Value::Bool(value) => value.to_string(),
        Value::Array(_) | Value::Object(_) => value.to_string(),
        Value::Null => String::new(),
    }
}

fn value_to_i64(value: &Value) -> i64 {
    match value {
        Value::Number(value) => value.as_i64().unwrap_or_default(),
        Value::Bool(value) => i64::from(*value),
        Value::String(value) => match value.trim().to_ascii_lowercase().as_str() {
            "true" | "on" => 1,
            "false" | "off" => 0,
            value => value.parse::<i64>().unwrap_or_default(),
        },
        _ => 0,
    }
}

fn sqlite_row_value(
    row: &sqlx::sqlite::SqliteRow,
    resource: OAuthResource,
    columns: &[String],
) -> Value {
    let mut map = Map::new();
    for column in columns {
        let raw = row
            .try_get::<Option<String>, _>(column.as_str())
            .ok()
            .flatten()
            .unwrap_or_default();
        insert_output_value(&mut map, column, raw);
    }
    apply_resource_aliases(resource, &mut map);
    Value::Object(map)
}

fn postgres_row_value(
    row: &sqlx::postgres::PgRow,
    resource: OAuthResource,
    columns: &[String],
) -> Value {
    let mut map = Map::new();
    for column in columns {
        let raw = row
            .try_get::<Option<String>, _>(column.as_str())
            .ok()
            .flatten()
            .unwrap_or_default();
        insert_output_value(&mut map, column, raw);
    }
    apply_resource_aliases(resource, &mut map);
    Value::Object(map)
}

fn insert_output_value(map: &mut Map<String, Value>, column: &str, raw: String) {
    let alias = output_alias_for_column(column);
    let value = if column.ends_with("_json") {
        parse_json_value(raw.as_str(), column)
    } else if bind_value_kind(column).is_integer() && is_booleanish_column(column) {
        Value::Bool(matches!(
            raw.trim().to_ascii_lowercase().as_str(),
            "1" | "true" | "t" | "yes" | "on"
        ))
    } else if bind_value_kind(column).is_integer() {
        raw.trim()
            .parse::<i64>()
            .map(Value::from)
            .unwrap_or_else(|_| Value::String(raw))
    } else {
        Value::String(raw)
    };
    map.insert(alias, value);
}

fn apply_resource_aliases(resource: OAuthResource, map: &mut Map<String, Value>) {
    let spec = resource_spec(resource);
    copy_alias(map, "id", spec.id_alias);
    match resource {
        OAuthResource::ProviderCatalog => {
            copy_alias(map, "regionGroup", "region");
            copy_alias(map, "providerFamily", "providerKind");
            copy_alias(map, "supportedSurfaceKinds", "supportedSurfaces");
            copy_alias(map, "supportedAccessModes", "supportedOwnerModes");
        }
        OAuthResource::Integrations => {
            copy_alias(map, "regionGroup", "region");
        }
        OAuthResource::Clients => {
            copy_alias(map, "providerClientId", "clientId");
            copy_alias(map, "oauthClientId", "clientId");
            copy_alias(map, "redirectUris", "redirectUriCount");
        }
        OAuthResource::Secrets => {
            copy_alias(map, "secretOwnerKind", "ownerKind");
            copy_alias(map, "secretOwnerId", "ownerId");
        }
        OAuthResource::Surfaces => {
            copy_alias(map, "surfaceKind", "surface");
        }
        OAuthResource::FlowConfigs => {
            copy_alias(map, "flowKind", "flowType");
            copy_alias(map, "flowKind", "surface");
            copy_alias(map, "requiresPkce", "pkceRequired");
        }
        OAuthResource::ScopeProfiles => {
            copy_alias(map, "scopeProfileCode", "profileCode");
            copy_alias(map, "requestedScopes", "scopes");
        }
        OAuthResource::ClaimMappings => {
            copy_alias(map, "externalClaim", "claimName");
        }
        OAuthResource::OperatorPlatforms => {
            copy_alias(map, "displayName", "platformName");
            copy_alias(map, "operatorMode", "authorizationMode");
        }
        OAuthResource::ResourceAccounts => {
            copy_alias(map, "accessMode", "ownerMode");
            copy_alias(map, "displayName", "accountName");
            copy_alias(map, "providerAccountId", "appId");
        }
        OAuthResource::OperationalResources => {
            copy_alias(map, "resourceKind", "resourceType");
        }
        OAuthResource::AccountLinks => {
            copy_alias(map, "userId", "subjectId");
            copy_alias(map, "externalSubject", "externalSubjectId");
        }
        OAuthResource::Grants => {
            copy_alias(map, "userId", "subjectId");
            copy_alias(map, "tokenExpiresAt", "expiresAt");
        }
        OAuthResource::CallbackEvents => {
            copy_alias(map, "providerEventType", "eventType");
            copy_alias(map, "createdAt", "receivedAt");
            copy_alias(map, "outcome", "status");
        }
        OAuthResource::DiagnosticRuns => {
            expose_diagnostic_result_aliases(map);
        }
        _ => {}
    }
}

fn expose_diagnostic_result_aliases(map: &mut Map<String, Value>) {
    let target_type = map
        .get("redactedResult")
        .and_then(Value::as_object)
        .and_then(|result| {
            result
                .get("targetType")
                .or_else(|| result.get("target_type"))
        })
        .cloned();
    let target_id = map
        .get("redactedResult")
        .and_then(Value::as_object)
        .and_then(|result| result.get("targetId").or_else(|| result.get("target_id")))
        .cloned();
    if let Some(value) = target_type {
        map.insert("targetType".to_owned(), value.clone());
    }
    if let Some(value) = target_id {
        map.insert("targetId".to_owned(), value.clone());
    }
}

fn copy_alias(map: &mut Map<String, Value>, from: &str, to: &str) {
    if map.contains_key(to) {
        return;
    }
    if let Some(value) = map.get(from).cloned() {
        map.insert(to.to_owned(), value);
    }
}

fn output_alias_for_column(column: &str) -> String {
    if let Some(base) = column.strip_suffix("_json") {
        return snake_to_camel(base);
    }
    snake_to_camel(column)
}

fn parse_json_value(raw: &str, column: &str) -> Value {
    serde_json::from_str::<Value>(raw).unwrap_or_else(|_| {
        if default_json_is_array(column) {
            Value::Array(Vec::new())
        } else {
            Value::Object(Map::new())
        }
    })
}

fn body_value_for_column<'a>(body: &'a Value, column: &str) -> Option<&'a Value> {
    let object = body.as_object()?;
    object
        .get(column)
        .or_else(|| object.get(snake_to_camel(column).as_str()))
        .or_else(|| object.get(output_alias_for_column(column).as_str()))
        .or_else(|| object.get(input_alias_for_column(column)))
}

fn input_alias_for_column(column: &str) -> &'static str {
    match column {
        "provider_code" => "providerCode",
        "provider_family" => "providerKind",
        "region_group" => "region",
        "supported_surface_kinds_json" => "supportedSurfaces",
        "supported_access_modes_json" => "supportedOwnerModes",
        "provider_client_id" => "clientId",
        "secret_owner_kind" => "ownerKind",
        "secret_owner_id" => "ownerId",
        "surface_kind" => "surface",
        "flow_kind" => "flowType",
        "requires_pkce" => "pkceRequired",
        "scope_profile_code" => "profileCode",
        "requested_scopes_json" => "scopes",
        "external_claim" => "claimName",
        "operator_mode" => "authorizationMode",
        "access_mode" => "ownerMode",
        "display_name" => "displayName",
        "resource_kind" => "resourceType",
        "provider_event_type" => "eventType",
        "created_at" => "createdAt",
        "token_expires_at" => "expiresAt",
        _ => "",
    }
}

fn validate_required_create_fields(
    resource: OAuthResource,
    body: &Value,
) -> Result<(), OAuthCommandError> {
    let spec = resource_spec(resource);
    for field in spec.required_create_fields {
        if body
            .as_object()
            .and_then(|object| object.get(*field))
            .and_then(non_empty_value_text)
            .is_none()
        {
            return Err(OAuthCommandError::BadRequest(format!(
                "{field} is required"
            )));
        }
    }
    Ok(())
}

fn non_empty_value_text(value: &Value) -> Option<String> {
    match value {
        Value::String(value) => Some(value.trim().to_owned()).filter(|value| !value.is_empty()),
        Value::Number(value) => Some(value.to_string()),
        Value::Bool(value) => Some(value.to_string()),
        _ => None,
    }
}

fn query_value(query: &HashMap<String, String>, key: &str) -> Option<String> {
    query
        .get(key)
        .or_else(|| query.get(camel_to_snake(key).as_str()))
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
}

fn page_size(query: &HashMap<String, String>) -> i64 {
    query_value(query, "pageSize")
        .and_then(|value| value.parse::<i64>().ok())
        .unwrap_or(100)
        .clamp(1, 500)
}

fn page_offset(query: &HashMap<String, String>) -> i64 {
    let page = query_value(query, "page")
        .and_then(|value| value.parse::<i64>().ok())
        .unwrap_or(1)
        .max(1);
    (page - 1) * page_size(query)
}

fn searchable_columns(columns: &[String]) -> Vec<&str> {
    columns
        .iter()
        .map(String::as_str)
        .filter(|column| {
            !column.ends_with("_json")
                && !matches!(
                    *column,
                    "version"
                        | "sort_order"
                        | "catalog_version"
                        | "enabled"
                        | "supports_pkce"
                        | "supports_nonce"
                        | "supports_state"
                )
        })
        .collect()
}

fn default_order_column(columns: &[String], _resource: OAuthResource) -> &str {
    if contains_column(columns, "sort_order") {
        "sort_order"
    } else if contains_column(columns, "updated_at") {
        "updated_at"
    } else if contains_column(columns, "created_at") {
        "created_at"
    } else {
        "id"
    }
}

fn contains_column(columns: &[String], column: &str) -> bool {
    columns.iter().any(|candidate| candidate == column)
}

fn is_writable_column(column: &str) -> bool {
    !matches!(
        column,
        "id" | "uuid" | "tenant_id" | "owner_tenant_id" | "created_at" | "created_by"
    )
}

fn bind_value_kind(column: &str) -> BindValue {
    if is_integer_column(column) {
        BindValue::Integer
    } else {
        BindValue::Text
    }
}

impl BindValue {
    fn is_integer(self) -> bool {
        matches!(self, Self::Integer)
    }
}

fn is_integer_column(column: &str) -> bool {
    is_booleanish_column(column)
        || matches!(
            column,
            "sort_order"
                | "catalog_version"
                | "version"
                | "duration_ms"
                | "provider_http_status"
                | "token_exchange_ms"
                | "userinfo_fetch_ms"
                | "mini_program_code_ttl_seconds"
        )
        || column.ends_with("_seconds")
        || column.ends_with("_ms")
}

fn is_booleanish_column(column: &str) -> bool {
    column.starts_with("supports_")
        || column.starts_with("requires_")
        || column.ends_with("_enabled")
        || column.ends_with("_required")
        || matches!(
            column,
            "enabled"
                | "minimum_for_login"
                | "offline_access_requested"
                | "email_verified"
                | "phone_verified"
                | "state_valid"
                | "nonce_valid"
                | "pkce_valid"
                | "qr_default_enabled"
        )
}

fn default_integer_for_column(column: &str) -> i64 {
    match column {
        "supports_state" | "requires_state" | "catalog_version" | "version" => 1,
        _ => 0,
    }
}

fn default_status(resource: OAuthResource) -> &'static str {
    match resource {
        OAuthResource::DiagnosticRuns => "queued",
        OAuthResource::CallbackEvents => "received",
        _ => "active",
    }
}

fn delete_status(resource: OAuthResource) -> &'static str {
    match resource {
        OAuthResource::Grants => "revoked",
        _ => "archived",
    }
}

fn default_json_for_column(column: &str, body: &Value) -> String {
    if matches!(column, "redacted_result_json") {
        let mut result = Map::new();
        for key in ["targetType", "targetId", "action"] {
            if let Some(value) = body.as_object().and_then(|object| object.get(key)).cloned() {
                result.insert(key.to_owned(), value);
            }
        }
        return Value::Object(result).to_string();
    }
    if default_json_is_array(column) {
        "[]".to_owned()
    } else {
        "{}".to_owned()
    }
}

fn default_json_is_array(column: &str) -> bool {
    column.ends_with("scopes_json")
        || column.ends_with("kinds_json")
        || column.ends_with("capabilities_json")
        || column.ends_with("modes_json")
        || column.ends_with("methods_json")
        || column.ends_with("types_json")
        || column.ends_with("hosts_json")
        || column.ends_with("patterns_json")
        || matches!(
            column,
            "purpose_json"
                | "capability_json"
                | "allowed_response_types_json"
                | "allowed_grant_types_json"
                | "provider_api_purpose_json"
                | "authorized_scopes_json"
                | "authorized_capabilities_json"
                | "allowed_event_types_json"
                | "requested_scopes_json"
                | "required_scopes_json"
                | "blocked_scopes_json"
        )
}

fn generated_code_from_body(body: &Value, column: &str) -> String {
    for key in [
        snake_to_camel(column),
        "code".to_owned(),
        "displayName".to_owned(),
        "name".to_owned(),
        "providerCode".to_owned(),
    ] {
        if let Some(value) = body
            .as_object()
            .and_then(|object| object.get(key.as_str()))
            .and_then(non_empty_value_text)
        {
            return slug_code(value.as_str());
        }
    }
    "default".to_owned()
}

fn generated_display_name(body: &Value, resource: OAuthResource) -> String {
    for key in [
        "displayName",
        "providerName",
        "name",
        "providerCode",
        "code",
    ] {
        if let Some(value) = body
            .as_object()
            .and_then(|object| object.get(key))
            .and_then(non_empty_value_text)
        {
            return value;
        }
    }
    resource_spec(resource).api_name.to_owned()
}

fn generated_provider_code(body: &Value) -> String {
    text_or_default(body, "providerCode", "custom")
}

fn text_or_default(body: &Value, key: &str, default_value: &str) -> String {
    body.as_object()
        .and_then(|object| object.get(key))
        .and_then(non_empty_value_text)
        .unwrap_or_else(|| default_value.to_owned())
}

fn slug_code(value: &str) -> String {
    let mut code = value
        .chars()
        .map(|ch| {
            if ch.is_ascii_alphanumeric() {
                ch.to_ascii_lowercase()
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
    if code.is_empty() {
        "default".to_owned()
    } else {
        code
    }
}

async fn sqlite_table_columns(
    pool: &SqlitePool,
    table_name: &str,
) -> Result<Vec<String>, sqlx::Error> {
    let pragma = format!("PRAGMA table_info({})", quote_sqlite_identifier(table_name));
    let rows = sqlx::query(pragma.as_str()).fetch_all(pool).await?;
    Ok(rows
        .into_iter()
        .filter_map(|row| row.try_get::<String, _>("name").ok())
        .collect())
}

async fn postgres_table_columns(
    pool: &PgPool,
    table_name: &str,
) -> Result<Vec<String>, sqlx::Error> {
    let rows = sqlx::query(
        r#"
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = $1
        ORDER BY ordinal_position
        "#,
    )
    .bind(table_name)
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .filter_map(|row| row.try_get::<String, _>("column_name").ok())
        .collect())
}

fn sqlite_select_columns(columns: &[String]) -> String {
    columns
        .iter()
        .map(|column| {
            format!(
                "CAST({} AS TEXT) AS {}",
                quote_sqlite_identifier(column),
                quote_sqlite_identifier(column)
            )
        })
        .collect::<Vec<_>>()
        .join(", ")
}

fn postgres_select_columns(columns: &[String]) -> String {
    columns
        .iter()
        .map(|column| {
            format!(
                "{}::text AS {}",
                quote_postgres_identifier(column),
                quote_postgres_identifier(column)
            )
        })
        .collect::<Vec<_>>()
        .join(", ")
}

fn sqlite_text_expr(column: &str) -> String {
    format!("CAST({} AS TEXT)", quote_sqlite_identifier(column))
}

fn postgres_text_expr(column: &str) -> String {
    format!("{}::text", quote_postgres_identifier(column))
}

fn quote_sqlite_identifier(value: &str) -> String {
    format!("\"{}\"", value.replace('"', "\"\""))
}

fn quote_postgres_identifier(value: &str) -> String {
    format!("\"{}\"", value.replace('"', "\"\""))
}

fn postgres_push_param(params: &mut Vec<SqlParam>, param: SqlParam) -> String {
    params.push(param);
    format!("${}", params.len())
}

fn bind_sqlite_param<'q>(
    query: sqlx::query::Query<'q, sqlx::Sqlite, sqlx::sqlite::SqliteArguments<'q>>,
    param: SqlParam,
) -> sqlx::query::Query<'q, sqlx::Sqlite, sqlx::sqlite::SqliteArguments<'q>> {
    match param {
        SqlParam::Text(value) => query.bind(value),
        SqlParam::Integer(value) => query.bind(value),
    }
}

fn bind_postgres_param<'q>(
    query: sqlx::query::Query<'q, sqlx::Postgres, sqlx::postgres::PgArguments>,
    param: SqlParam,
) -> sqlx::query::Query<'q, sqlx::Postgres, sqlx::postgres::PgArguments> {
    match param {
        SqlParam::Text(value) => query.bind(value),
        SqlParam::Integer(value) => query.bind(value),
    }
}

fn parse_oauth_body(body: &Bytes) -> Result<Value, Response> {
    if body.is_empty() {
        return Ok(json!({}));
    }
    serde_json::from_slice::<Value>(body).map_err(|error| {
        oauth_command_error_response(OAuthCommandError::BadRequest(format!(
            "OAuth command body is invalid: {error}"
        )))
    })
}

fn oauth_subject(headers: &HeaderMap) -> Result<OAuthSubject, Response> {
    TrustedRequestSubject::from_headers(headers)
        .map(|subject| OAuthSubject {
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

fn oauth_sql_error(area: &str, error: sqlx::Error) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error(
            "5000",
            format!("appbase backend IAM OAuth {area} read model is unavailable: {error}"),
        )),
    )
        .into_response()
}

fn oauth_command_error_response(error: OAuthCommandError) -> Response {
    match error {
        OAuthCommandError::BadRequest(message) => (
            StatusCode::BAD_REQUEST,
            Json(PlusApiResult::error("4001", message)),
        )
            .into_response(),
        OAuthCommandError::NotFound(message) => (
            StatusCode::NOT_FOUND,
            Json(PlusApiResult::error("4040", message)),
        )
            .into_response(),
        OAuthCommandError::System(message) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(PlusApiResult::error("5000", message)),
        )
            .into_response(),
    }
}

impl From<sqlx::Error> for OAuthCommandError {
    fn from(error: sqlx::Error) -> Self {
        Self::System(format!(
            "appbase backend IAM OAuth store is unavailable: {error}"
        ))
    }
}

fn next_oauth_id(context: &str) -> Result<String, OAuthCommandError> {
    next_claw_runtime_id(context)
        .map(|value| value.to_string())
        .map_err(|error| OAuthCommandError::System(error.to_string()))
}

fn set_object_field(body: &mut Value, key: &str, value: &str) {
    if !body.is_object() {
        *body = json!({});
    }
    if let Some(object) = body.as_object_mut() {
        object.insert(key.to_owned(), Value::String(value.to_owned()));
    }
}

fn snake_to_camel(value: &str) -> String {
    let mut output = String::new();
    let mut uppercase_next = false;
    for ch in value.chars() {
        if ch == '_' {
            uppercase_next = true;
        } else if uppercase_next {
            output.push(ch.to_ascii_uppercase());
            uppercase_next = false;
        } else {
            output.push(ch);
        }
    }
    output
}

fn camel_to_snake(value: &str) -> String {
    let mut output = String::new();
    for ch in value.chars() {
        if ch.is_ascii_uppercase() {
            output.push('_');
            output.push(ch.to_ascii_lowercase());
        } else {
            output.push(ch);
        }
    }
    output.trim_start_matches('_').to_owned()
}

fn current_utc_timestamp_string() -> String {
    let seconds = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
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
    format!("{year:04}-{month:02}-{day:02}T{hour:02}:{minute:02}:{second:02}Z")
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

fn resource_spec(resource: OAuthResource) -> ResourceSpec {
    match resource {
        OAuthResource::ProviderCatalog => ResourceSpec {
            api_name: "provider catalog",
            table_name: "iam_oauth_provider_catalog",
            id_alias: "providerCatalogId",
            required_create_fields: &["providerCode"],
        },
        OAuthResource::Integrations => ResourceSpec {
            api_name: "integration",
            table_name: "iam_oauth_integration",
            id_alias: "integrationId",
            required_create_fields: &["providerCode", "displayName"],
        },
        OAuthResource::Clients => ResourceSpec {
            api_name: "client",
            table_name: "iam_oauth_client",
            id_alias: "oauthClientId",
            required_create_fields: &["integrationId", "providerCode", "displayName"],
        },
        OAuthResource::Secrets => ResourceSpec {
            api_name: "secret",
            table_name: "iam_oauth_secret",
            id_alias: "secretId",
            required_create_fields: &["secretRef"],
        },
        OAuthResource::Surfaces => ResourceSpec {
            api_name: "surface",
            table_name: "iam_oauth_surface",
            id_alias: "surfaceId",
            required_create_fields: &["integrationId", "displayName"],
        },
        OAuthResource::FlowConfigs => ResourceSpec {
            api_name: "flow config",
            table_name: "iam_oauth_flow_config",
            id_alias: "flowConfigId",
            required_create_fields: &["integrationId"],
        },
        OAuthResource::ScopeProfiles => ResourceSpec {
            api_name: "scope profile",
            table_name: "iam_oauth_scope_profile",
            id_alias: "scopeProfileId",
            required_create_fields: &["integrationId", "providerCode", "displayName"],
        },
        OAuthResource::ClaimMappings => ResourceSpec {
            api_name: "claim mapping",
            table_name: "iam_oauth_claim_mapping",
            id_alias: "mappingId",
            required_create_fields: &["integrationId", "providerCode"],
        },
        OAuthResource::Policies => ResourceSpec {
            api_name: "policy",
            table_name: "iam_oauth_policy",
            id_alias: "policyId",
            required_create_fields: &["displayName"],
        },
        OAuthResource::TenantBindings => ResourceSpec {
            api_name: "tenant binding",
            table_name: "iam_oauth_tenant_binding",
            id_alias: "bindingId",
            required_create_fields: &["providerCode", "integrationId"],
        },
        OAuthResource::OperatorPlatforms => ResourceSpec {
            api_name: "operator platform",
            table_name: "iam_oauth_operator_platform",
            id_alias: "operatorPlatformId",
            required_create_fields: &["integrationId", "providerCode", "displayName"],
        },
        OAuthResource::ResourceAccounts => ResourceSpec {
            api_name: "resource account",
            table_name: "iam_oauth_resource_account",
            id_alias: "resourceAccountId",
            required_create_fields: &["integrationId", "providerCode", "displayName"],
        },
        OAuthResource::ResourceAuthorizations => ResourceSpec {
            api_name: "resource authorization",
            table_name: "iam_oauth_resource_authorization",
            id_alias: "authorizationId",
            required_create_fields: &["integrationId", "resourceAccountId", "providerCode"],
        },
        OAuthResource::WebhookConfigs => ResourceSpec {
            api_name: "webhook config",
            table_name: "iam_oauth_webhook_config",
            id_alias: "webhookConfigId",
            required_create_fields: &["integrationId", "providerCode", "callbackUrl"],
        },
        OAuthResource::OperationalResources => ResourceSpec {
            api_name: "operational resource",
            table_name: "iam_oauth_operational_resource",
            id_alias: "resourceId",
            required_create_fields: &[
                "integrationId",
                "resourceAccountId",
                "providerCode",
                "displayName",
            ],
        },
        OAuthResource::AccountLinks => ResourceSpec {
            api_name: "account link",
            table_name: "iam_oauth_account_link",
            id_alias: "accountLinkId",
            required_create_fields: &[],
        },
        OAuthResource::Grants => ResourceSpec {
            api_name: "grant",
            table_name: "iam_oauth_grant",
            id_alias: "grantId",
            required_create_fields: &[],
        },
        OAuthResource::CallbackEvents => ResourceSpec {
            api_name: "callback event",
            table_name: "iam_oauth_callback_event",
            id_alias: "callbackEventId",
            required_create_fields: &[],
        },
        OAuthResource::DiagnosticRuns => ResourceSpec {
            api_name: "diagnostic run",
            table_name: "iam_oauth_diagnostic_run",
            id_alias: "diagnosticRunId",
            required_create_fields: &["providerCode"],
        },
    }
}
