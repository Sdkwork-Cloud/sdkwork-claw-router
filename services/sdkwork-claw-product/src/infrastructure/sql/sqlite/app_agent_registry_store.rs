use sqlx::{Row, Sqlite, SqlitePool, Transaction};

use crate::domain::{DomainError, DomainResult};
use crate::infrastructure::sql::sql_admin_product_center::{
    media_resource_from_snapshot, media_resource_locator,
};
use crate::ports::{
    AdminAgentReadFuture, AdminAgentStore, AppAgentCapabilities, AppAgentItem,
    AppAgentRegistryFuture, AppAgentRegistryQuery, AppAgentRegistryStore, AppAgentRegistrySubject,
    AppAgentVersionItem, CreateAppAgentCommand, GetAdminAgentQuery, ListAdminAgentsQuery,
};

const STATUS_ACTIVE: i64 = 1;
const VISIBILITY_PRIVATE: i64 = 1;
const RELEASE_STATUS_DRAFT: i64 = 1;
const DEFAULT_PAGE_SIZE: i64 = 50;
const MAX_PAGE_SIZE: i64 = 100;

#[derive(Debug, Clone)]
pub struct SqliteAppAgentRegistryStore {
    pool: SqlitePool,
}

impl SqliteAppAgentRegistryStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl AppAgentRegistryStore for SqliteAppAgentRegistryStore {
    fn list_agents<'a>(
        &'a self,
        subject: AppAgentRegistrySubject,
        query: AppAgentRegistryQuery,
    ) -> AppAgentRegistryFuture<'a, Vec<AppAgentItem>> {
        Box::pin(async move { list_agents(&self.pool, subject, query).await })
    }

    fn get_agent<'a>(
        &'a self,
        subject: AppAgentRegistrySubject,
        agent_id: String,
    ) -> AppAgentRegistryFuture<'a, Option<AppAgentItem>> {
        Box::pin(async move { get_agent(&self.pool, subject, agent_id).await })
    }

    fn create_agent<'a>(
        &'a self,
        command: CreateAppAgentCommand,
    ) -> AppAgentRegistryFuture<'a, AppAgentItem> {
        Box::pin(async move { create_agent(&self.pool, command).await })
    }
}

impl AdminAgentStore for SqliteAppAgentRegistryStore {
    fn list_agents<'a>(
        &'a self,
        query: ListAdminAgentsQuery,
    ) -> AdminAgentReadFuture<'a, Vec<AppAgentItem>> {
        Box::pin(async move { list_admin_agents(&self.pool, query).await })
    }

    fn get_agent<'a>(
        &'a self,
        query: GetAdminAgentQuery,
    ) -> AdminAgentReadFuture<'a, Option<AppAgentItem>> {
        Box::pin(async move { get_admin_agent(&self.pool, query).await })
    }
}

async fn list_agents(
    pool: &SqlitePool,
    subject: AppAgentRegistrySubject,
    query: AppAgentRegistryQuery,
) -> DomainResult<Vec<AppAgentItem>> {
    let limit = page_size(query.page_size);
    let offset = page_offset(query.page_no, limit);
    let keyword = query
        .keyword
        .map(|value| format!("%{}%", value.replace('%', "\\%").replace('_', "\\_")));
    let rows = if let Some(keyword) = keyword {
        let sql = agent_select_sql(
            r#"
              AND (a.name LIKE ?4 ESCAPE '\' OR a.agent_code LIKE ?4 ESCAPE '\')
            ORDER BY a.updated_at DESC, a.id DESC
            LIMIT ?5 OFFSET ?6
            "#,
        );
        sqlx::query(&sql)
            .bind(subject.tenant_id)
            .bind(subject.organization_id)
            .bind(subject.user_id)
            .bind(keyword)
            .bind(limit)
            .bind(offset)
            .fetch_all(pool)
            .await
            .map_err(|error| store_error("failed to list app agents", error))?
    } else {
        let sql = agent_select_sql(
            r#"
            ORDER BY a.updated_at DESC, a.id DESC
            LIMIT ?4 OFFSET ?5
            "#,
        );
        sqlx::query(&sql)
            .bind(subject.tenant_id)
            .bind(subject.organization_id)
            .bind(subject.user_id)
            .bind(limit)
            .bind(offset)
            .fetch_all(pool)
            .await
            .map_err(|error| store_error("failed to list app agents", error))?
    };
    rows.into_iter().map(row_to_agent).collect()
}

async fn get_agent(
    pool: &SqlitePool,
    subject: AppAgentRegistrySubject,
    agent_id: String,
) -> DomainResult<Option<AppAgentItem>> {
    let sql = agent_select_sql(
        r#"
          AND (CAST(a.id AS TEXT) = ?4 OR a.uuid = ?4 OR a.agent_code = ?4)
        LIMIT 1
        "#,
    );
    let row = sqlx::query(&sql)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .bind(agent_id)
        .fetch_optional(pool)
        .await
        .map_err(|error| store_error("failed to load app agent", error))?;

    row.map(row_to_agent).transpose()
}

async fn list_admin_agents(
    pool: &SqlitePool,
    query: ListAdminAgentsQuery,
) -> DomainResult<Vec<AppAgentItem>> {
    let mut sql = admin_agent_select_sql("");
    let keyword = query
        .keyword
        .as_deref()
        .map(|value| format!("%{}%", value.replace('%', "\\%").replace('_', "\\_")));
    if query.owner_user_id.is_some() {
        sql.push_str(" AND a.owner_user_id = ?");
    }
    if query.status.is_some() {
        sql.push_str(" AND a.status = ?");
    }
    if query.visibility.is_some() {
        sql.push_str(" AND a.visibility = ?");
    }
    if keyword.is_some() {
        sql.push_str(" AND (a.name LIKE ? ESCAPE '\\' OR a.agent_code LIKE ? ESCAPE '\\')");
    }
    sql.push_str(" ORDER BY a.updated_at DESC, a.id DESC LIMIT ? OFFSET ?");

    let mut statement = sqlx::query(&sql)
        .bind(query.subject.tenant_id)
        .bind(query.subject.organization_id);
    if let Some(owner_user_id) = query.owner_user_id {
        statement = statement.bind(owner_user_id);
    }
    if let Some(status) = query.status.as_deref() {
        statement = statement.bind(agent_status_code(status));
    }
    if let Some(visibility) = query.visibility.as_deref() {
        statement = statement.bind(agent_visibility_code(visibility));
    }
    if let Some(keyword) = keyword {
        statement = statement.bind(keyword.clone()).bind(keyword);
    }
    let rows = statement
        .bind(query.page_size)
        .bind(query.offset)
        .fetch_all(pool)
        .await
        .map_err(|error| store_error("failed to list admin agents", error))?;

    rows.into_iter().map(row_to_agent).collect()
}

async fn get_admin_agent(
    pool: &SqlitePool,
    query: GetAdminAgentQuery,
) -> DomainResult<Option<AppAgentItem>> {
    let sql = admin_agent_select_sql(
        r#"
          AND (CAST(a.id AS TEXT) = ? OR a.uuid = ? OR a.agent_code = ?)
        LIMIT 1
        "#,
    );
    let row = sqlx::query(&sql)
        .bind(query.subject.tenant_id)
        .bind(query.subject.organization_id)
        .bind(&query.agent_id)
        .bind(&query.agent_id)
        .bind(&query.agent_id)
        .fetch_optional(pool)
        .await
        .map_err(|error| store_error("failed to load admin agent", error))?;

    row.map(row_to_agent).transpose()
}

async fn create_agent(
    pool: &SqlitePool,
    command: CreateAppAgentCommand,
) -> DomainResult<AppAgentItem> {
    if let Some(item) =
        find_agent_by_idempotency_key(pool, command.subject, &command.idempotency_key).await?
    {
        return idempotent_agent_result(item, &command);
    }

    let model_policy = model_policy_json(command.model.as_deref())?;
    let tool_policy = policy_json(&command.tool_policy)?;
    let memory_policy = policy_json(&command.memory_policy)?;
    let mcp_policy = policy_json(&command.mcp_policy)?;
    let skill_policy = policy_json(&command.skill_policy)?;
    let runtime_policy = policy_json(&command.runtime_policy)?;
    let config_hash = config_hash(&[
        &model_policy,
        &tool_policy,
        &memory_policy,
        &mcp_policy,
        &skill_policy,
        &runtime_policy,
    ]);

    let mut tx = pool
        .begin()
        .await
        .map_err(|error| store_error("failed to begin app agent transaction", error))?;
    let agent_id = match insert_agent(&mut tx, &command).await {
        Ok(agent_id) => agent_id,
        Err(error) if error.is_conflict() => {
            tx.rollback()
                .await
                .map_err(|error| store_error("failed to roll back app agent transaction", error))?;
            if let Some(item) =
                find_agent_by_idempotency_key(pool, command.subject, &command.idempotency_key)
                    .await?
            {
                return idempotent_agent_result(item, &command);
            }
            return Err(error);
        }
        Err(error) => return Err(error),
    };
    let version_id = insert_agent_version(
        &mut tx,
        agent_id,
        &command,
        &model_policy,
        &tool_policy,
        &memory_policy,
        &mcp_policy,
        &skill_policy,
        &runtime_policy,
        &config_hash,
    )
    .await?;
    sqlx::query(
        r#"
        UPDATE ai_agent
        SET default_version_id = ?1,
            updated_at = ?2,
            version = version + 1
        WHERE id = ?3
        "#,
    )
    .bind(version_id)
    .bind(&command.requested_at)
    .bind(agent_id)
    .execute(&mut *tx)
    .await
    .map_err(|error| store_error("failed to attach default app agent version", error))?;
    tx.commit()
        .await
        .map_err(|error| store_error("failed to commit app agent transaction", error))?;

    get_agent(pool, command.subject, agent_id.to_string())
        .await?
        .ok_or_else(|| DomainError::new("created app agent could not be reloaded"))
}

async fn insert_agent(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAppAgentCommand,
) -> DomainResult<i64> {
    sqlx::query(
        r#"
        INSERT INTO ai_agent (
            uuid,
            tenant_id,
            organization_id,
            data_scope,
            status,
            created_at,
            updated_at,
            version,
            metadata,
            owner_user_id,
            agent_code,
            name,
            description,
            visibility,
            governance_status
        )
        VALUES (?1, ?2, ?3, 1, ?4, ?5, ?5, 0, ?6, ?7, ?8, ?9, ?10, ?11, 1)
        "#,
    )
    .bind(&command.agent_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(STATUS_ACTIVE)
    .bind(&command.requested_at)
    .bind(agent_metadata_json(command)?)
    .bind(command.subject.user_id)
    .bind(&command.agent_code)
    .bind(&command.name)
    .bind(command.description.as_deref())
    .bind(VISIBILITY_PRIVATE)
    .execute(&mut **tx)
    .await
    .map_err(create_error)?;
    sqlx::query_scalar::<_, i64>("SELECT last_insert_rowid()")
        .fetch_one(&mut **tx)
        .await
        .map_err(|error| store_error("failed to read app agent id", error))
}

async fn find_agent_by_idempotency_key(
    pool: &SqlitePool,
    subject: AppAgentRegistrySubject,
    idempotency_key: &str,
) -> DomainResult<Option<AppAgentItem>> {
    let sql = agent_select_sql(
        r#"
          AND json_extract(a.metadata, '$.idempotencyKey') = ?4
        LIMIT 1
        "#,
    );
    let row = sqlx::query(&sql)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .bind(idempotency_key)
        .fetch_optional(pool)
        .await
        .map_err(|error| store_error("failed to load idempotent app agent", error))?;

    row.map(row_to_agent).transpose()
}

fn idempotent_agent_result(
    item: AppAgentItem,
    command: &CreateAppAgentCommand,
) -> DomainResult<AppAgentItem> {
    if item_matches_command_payload(&item, command) {
        Ok(item)
    } else {
        Err(DomainError::conflict(
            "idempotency key already exists with different agent payload",
        ))
    }
}

fn item_matches_command_payload(item: &AppAgentItem, command: &CreateAppAgentCommand) -> bool {
    item.code == command.agent_code
        && item.name == command.name
        && optional_text_matches(&item.description, command.description.as_deref())
        && item.default_version.model == command.model
        && optional_text_matches(
            &item.default_version.system_prompt,
            command.system_prompt.as_deref(),
        )
        && item.default_version.tool_policy == command.tool_policy
        && item.default_version.memory_policy == command.memory_policy
        && item.default_version.mcp_policy == command.mcp_policy
        && item.default_version.skill_policy == command.skill_policy
        && item.default_version.runtime_policy == command.runtime_policy
}

fn optional_text_matches(stored: &str, requested: Option<&str>) -> bool {
    stored == requested.unwrap_or("")
}

#[allow(clippy::too_many_arguments)]
async fn insert_agent_version(
    tx: &mut Transaction<'_, Sqlite>,
    agent_id: i64,
    command: &CreateAppAgentCommand,
    model_policy: &str,
    tool_policy: &str,
    memory_policy: &str,
    mcp_policy: &str,
    skill_policy: &str,
    runtime_policy: &str,
    config_hash: &str,
) -> DomainResult<i64> {
    sqlx::query(
        r#"
        INSERT INTO ai_agent_version (
            uuid,
            tenant_id,
            organization_id,
            data_scope,
            status,
            created_at,
            updated_at,
            version,
            metadata,
            agent_id,
            version_no,
            release_status,
            system_prompt,
            model_policy,
            tool_policy,
            memory_policy,
            mcp_policy,
            skill_policy,
            runtime_policy,
            config_hash
        )
        VALUES (?1, ?2, ?3, 1, ?4, ?5, ?5, 0, '{}', ?6, 1, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)
        "#,
    )
    .bind(&command.version_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(STATUS_ACTIVE)
    .bind(&command.requested_at)
    .bind(agent_id)
    .bind(RELEASE_STATUS_DRAFT)
    .bind(command.system_prompt.as_deref().unwrap_or(""))
    .bind(model_policy)
    .bind(tool_policy)
    .bind(memory_policy)
    .bind(mcp_policy)
    .bind(skill_policy)
    .bind(runtime_policy)
    .bind(config_hash)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create app agent version", error))?;
    sqlx::query_scalar::<_, i64>("SELECT last_insert_rowid()")
        .fetch_one(&mut **tx)
        .await
        .map_err(|error| store_error("failed to read app agent version id", error))
}

fn agent_select_sql(extra: &str) -> String {
    format!(
        r#"
        SELECT
            CAST(a.id AS TEXT) AS agent_id,
            a.owner_user_id,
            a.agent_code,
            a.name,
            COALESCE(a.description, '') AS description,
            a.visibility,
            a.status AS agent_status,
            COALESCE(CAST(a.avatar_resource_snapshot AS TEXT), '') AS avatar_resource_snapshot,
            a.template_source,
            a.created_at AS agent_created_at,
            a.updated_at AS agent_updated_at,
            CAST(v.id AS TEXT) AS version_id,
            v.version_no,
            v.release_status,
            COALESCE(v.system_prompt, '') AS system_prompt,
            COALESCE(v.model_policy, '{{}}') AS model_policy,
            COALESCE(v.tool_policy, '{{}}') AS tool_policy,
            COALESCE(v.memory_policy, '{{}}') AS memory_policy,
            COALESCE(v.mcp_policy, '{{}}') AS mcp_policy,
            COALESCE(v.skill_policy, '{{}}') AS skill_policy,
            COALESCE(v.runtime_policy, '{{}}') AS runtime_policy,
            v.created_at AS version_created_at,
            v.updated_at AS version_updated_at
        FROM ai_agent a
        JOIN ai_agent_version v
          ON v.id = a.default_version_id
         AND v.tenant_id = a.tenant_id
         AND v.organization_id = a.organization_id
         AND v.deleted_at IS NULL
         AND v.status = 1
        WHERE a.tenant_id = ?1
          AND a.organization_id = ?2
          AND a.owner_user_id = ?3
          AND a.deleted_at IS NULL
          AND a.status = 1
        {extra}
        "#
    )
}

fn admin_agent_select_sql(extra: &str) -> String {
    format!(
        r#"
        SELECT
            CAST(a.id AS TEXT) AS agent_id,
            a.owner_user_id,
            a.agent_code,
            a.name,
            COALESCE(a.description, '') AS description,
            a.visibility,
            a.status AS agent_status,
            COALESCE(CAST(a.avatar_resource_snapshot AS TEXT), '') AS avatar_resource_snapshot,
            a.template_source,
            a.created_at AS agent_created_at,
            a.updated_at AS agent_updated_at,
            CAST(v.id AS TEXT) AS version_id,
            v.version_no,
            v.release_status,
            COALESCE(v.system_prompt, '') AS system_prompt,
            COALESCE(v.model_policy, '{{}}') AS model_policy,
            COALESCE(v.tool_policy, '{{}}') AS tool_policy,
            COALESCE(v.memory_policy, '{{}}') AS memory_policy,
            COALESCE(v.mcp_policy, '{{}}') AS mcp_policy,
            COALESCE(v.skill_policy, '{{}}') AS skill_policy,
            COALESCE(v.runtime_policy, '{{}}') AS runtime_policy,
            v.created_at AS version_created_at,
            v.updated_at AS version_updated_at
        FROM ai_agent a
        JOIN ai_agent_version v
          ON v.id = a.default_version_id
         AND v.tenant_id = a.tenant_id
         AND v.organization_id = a.organization_id
         AND v.deleted_at IS NULL
         AND v.status = 1
        WHERE a.tenant_id = ?
          AND a.organization_id = ?
          AND a.deleted_at IS NULL
          AND a.status IN (0, 1)
        {extra}
        "#
    )
}

fn row_to_agent(row: sqlx::sqlite::SqliteRow) -> DomainResult<AppAgentItem> {
    let model_policy = json_cell(&row, "model_policy")?;
    let tool_policy = json_cell(&row, "tool_policy")?;
    let memory_policy = json_cell(&row, "memory_policy")?;
    let mcp_policy = json_cell(&row, "mcp_policy")?;
    let skill_policy = json_cell(&row, "skill_policy")?;
    let runtime_policy = json_cell(&row, "runtime_policy")?;
    let model = model_policy
        .get("model")
        .and_then(|value| value.as_str())
        .map(str::to_owned);
    let capabilities = AppAgentCapabilities {
        memory_enabled: memory_policy
            .get("enabled")
            .and_then(|value| value.as_bool())
            .unwrap_or(false),
        mcp_server_count: json_array_count(&mcp_policy, "servers"),
        skill_binding_count: json_array_count(&skill_policy, "skills"),
    };

    Ok(AppAgentItem {
        id: string_cell(&row, "agent_id"),
        owner_user_id: integer_cell(&row, "owner_user_id"),
        code: string_cell(&row, "agent_code"),
        name: string_cell(&row, "name"),
        description: string_cell(&row, "description"),
        visibility: visibility_label(integer_cell(&row, "visibility")).to_owned(),
        status: status_label(integer_cell(&row, "agent_status")).to_owned(),
        avatar: optional_media_resource_from_row(&row, "avatar_resource_snapshot"),
        template_source: optional_string_cell(&row, "template_source"),
        created_at: string_cell(&row, "agent_created_at"),
        updated_at: string_cell(&row, "agent_updated_at"),
        default_version: AppAgentVersionItem {
            id: string_cell(&row, "version_id"),
            version_no: integer_cell(&row, "version_no"),
            release_status: release_status_label(integer_cell(&row, "release_status")).to_owned(),
            model,
            system_prompt: string_cell(&row, "system_prompt"),
            tool_policy,
            memory_policy,
            mcp_policy,
            skill_policy,
            runtime_policy,
            created_at: string_cell(&row, "version_created_at"),
            updated_at: string_cell(&row, "version_updated_at"),
        },
        capabilities,
    })
}

fn model_policy_json(model: Option<&str>) -> DomainResult<String> {
    let value = match model {
        Some(model) => serde_json::json!({ "model": model }),
        None => serde_json::json!({}),
    };
    serde_json::to_string(&value).map_err(|error| DomainError::new(error.to_string()))
}

fn policy_json(value: &serde_json::Value) -> DomainResult<String> {
    serde_json::to_string(value).map_err(|error| DomainError::new(error.to_string()))
}

fn agent_metadata_json(command: &CreateAppAgentCommand) -> DomainResult<String> {
    serde_json::to_string(&serde_json::json!({
        "idempotencyKey": command.idempotency_key,
        "requestId": command.request_id,
        "createdBy": "app-agent-registry"
    }))
    .map_err(|error| DomainError::new(error.to_string()))
}

fn config_hash(parts: &[&str]) -> String {
    let mut hash = 0xcbf29ce484222325u64;
    for part in parts {
        for byte in part.as_bytes() {
            hash ^= u64::from(*byte);
            hash = hash.wrapping_mul(0x100000001b3);
        }
    }
    format!("{hash:016x}")
}

fn page_size(value: Option<i64>) -> i64 {
    value.unwrap_or(DEFAULT_PAGE_SIZE).clamp(1, MAX_PAGE_SIZE)
}

fn page_offset(page_no: Option<i64>, page_size: i64) -> i64 {
    (page_no.unwrap_or(1).max(1) - 1) * page_size
}

fn visibility_label(value: i64) -> &'static str {
    match value {
        2 => "organization",
        3 => "public",
        _ => "private",
    }
}

fn status_label(value: i64) -> &'static str {
    match value {
        0 => "disabled",
        _ => "active",
    }
}

fn release_status_label(value: i64) -> &'static str {
    match value {
        2 => "published",
        3 => "archived",
        _ => "draft",
    }
}

fn agent_status_code(value: &str) -> i64 {
    match value {
        "disabled" => 0,
        _ => 1,
    }
}

fn agent_visibility_code(value: &str) -> i64 {
    match value {
        "organization" => 2,
        "public" => 3,
        _ => 1,
    }
}

fn json_array_count(value: &serde_json::Value, key: &str) -> i64 {
    value
        .get(key)
        .and_then(|value| value.as_array())
        .map(|items| items.len() as i64)
        .unwrap_or(0)
}

fn json_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> DomainResult<serde_json::Value> {
    let raw = optional_string_cell(row, column).unwrap_or_else(|| "{}".to_owned());
    serde_json::from_str(&raw)
        .map_err(|error| DomainError::new(format!("invalid app agent {column} json: {error}")))
}

fn string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> String {
    optional_string_cell(row, column).unwrap_or_else(String::new)
}

fn optional_media_resource_from_row(
    row: &sqlx::sqlite::SqliteRow,
    column: &str,
) -> Option<serde_json::Value> {
    let snapshot = string_cell(row, column);
    if snapshot.trim().is_empty() {
        return None;
    }
    let resource = media_resource_from_snapshot(&snapshot, "image");
    media_resource_locator(&resource).map(|_| resource)
}

fn optional_string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .or_else(|| row.try_get::<String, _>(column).ok())
        .or_else(|| {
            row.try_get::<Option<i64>, _>(column)
                .ok()
                .flatten()
                .map(|value| value.to_string())
        })
        .or_else(|| {
            row.try_get::<i64, _>(column)
                .ok()
                .map(|value| value.to_string())
        })
}

fn integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> i64 {
    row.try_get::<Option<i64>, _>(column)
        .ok()
        .flatten()
        .or_else(|| row.try_get::<i64, _>(column).ok())
        .or_else(|| {
            row.try_get::<Option<i32>, _>(column)
                .ok()
                .flatten()
                .map(i64::from)
        })
        .unwrap_or(0)
}

fn create_error(error: sqlx::Error) -> DomainError {
    if is_unique_constraint_error(&error) {
        DomainError::conflict("agent code already exists")
    } else {
        store_error("failed to create app agent", error)
    }
}

fn is_unique_constraint_error(error: &sqlx::Error) -> bool {
    match error {
        sqlx::Error::Database(database_error) => {
            let message = database_error.message().to_ascii_lowercase();
            message.contains("unique")
                || message.contains("duplicate")
                || message.contains("uk_ai_agent_tenant_code")
        }
        _ => false,
    }
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}
