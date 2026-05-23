use sqlx::{Row, SqlitePool};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    AppAgentSessionFuture, AppAgentSessionItem, AppAgentSessionList, AppAgentSessionStore,
    AppAgentSessionSubject, CreateAppAgentSessionCommand,
};

#[derive(Debug, Clone)]
pub struct SqliteAppAgentSessionStore {
    pool: SqlitePool,
}

impl SqliteAppAgentSessionStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl AppAgentSessionStore for SqliteAppAgentSessionStore {
    fn list_sessions<'a>(
        &'a self,
        subject: AppAgentSessionSubject,
        agent_id: String,
        page: i64,
        page_size: i64,
    ) -> AppAgentSessionFuture<'a, AppAgentSessionList> {
        Box::pin(async move {
            let offset = (page.max(1) - 1) * page_size.max(1);
            let rows = sqlx::query(
                r#"
                SELECT *
                FROM ai_agent_session
                WHERE tenant_id = ?1
                  AND organization_id = ?2
                  AND user_id = ?3
                  AND agent_id = ?4
                  AND status <> 'deleted'
                ORDER BY updated_at DESC, id DESC
                LIMIT ?5 OFFSET ?6
                "#,
            )
            .bind(subject.tenant_id)
            .bind(subject.organization_id)
            .bind(subject.user_id)
            .bind(agent_id)
            .bind(page_size.max(1))
            .bind(offset)
            .fetch_all(&self.pool)
            .await
            .map_err(sql_error)?;
            rows.into_iter()
                .map(row_to_session)
                .collect::<DomainResult<Vec<_>>>()
                .map(|items| AppAgentSessionList { items })
        })
    }

    fn get_session<'a>(
        &'a self,
        subject: AppAgentSessionSubject,
        session_id: String,
    ) -> AppAgentSessionFuture<'a, Option<AppAgentSessionItem>> {
        Box::pin(async move {
            let row = sqlx::query(
                r#"
                SELECT *
                FROM ai_agent_session
                WHERE tenant_id = ?1
                  AND organization_id = ?2
                  AND user_id = ?3
                  AND session_code = ?4
                  AND status <> 'deleted'
                "#,
            )
            .bind(subject.tenant_id)
            .bind(subject.organization_id)
            .bind(subject.user_id)
            .bind(session_id)
            .fetch_optional(&self.pool)
            .await
            .map_err(sql_error)?;
            row.map(row_to_session).transpose()
        })
    }

    fn create_session<'a>(
        &'a self,
        command: CreateAppAgentSessionCommand,
    ) -> AppAgentSessionFuture<'a, AppAgentSessionItem> {
        Box::pin(async move {
            let title = command
                .title
                .clone()
                .filter(|value| !value.trim().is_empty())
                .unwrap_or_else(|| "New agent session".to_owned());
            validate_memory_space_scope(
                &self.pool,
                command.subject,
                command.memory_space_id.as_deref(),
            )
            .await?;
            let metadata = serde_json::to_string(&command.metadata).map_err(|error| {
                DomainError::new(format!("invalid agent session metadata: {error}"))
            })?;
            sqlx::query(
                r#"
                INSERT INTO ai_agent_session (
                    uuid,
                    tenant_id,
                    organization_id,
                    user_id,
                    agent_id,
                    agent_version_id,
                    session_code,
                    title,
                    session_kind,
                    source_surface,
                    status,
                    chat_conversation_id,
                    memory_space_id,
                    runtime,
                    cwd,
                    sandbox_policy,
                    approval_policy,
                    permission_mode,
                    default_model,
                    last_run_id,
                    last_step_id,
                    last_active_at,
                    run_count,
                    step_count,
                    tool_call_count,
                    created_at,
                    updated_at,
                    metadata
                )
                VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, 'active', ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, NULL, NULL, NULL, 0, 0, 0, ?19, ?19, ?20)
                "#,
            )
            .bind(&command.session_uuid)
            .bind(command.subject.tenant_id)
            .bind(command.subject.organization_id)
            .bind(command.subject.user_id)
            .bind(&command.agent_id)
            .bind(&command.agent_version_id)
            .bind(&command.session_uuid)
            .bind(&title)
            .bind(&command.session_kind)
            .bind(&command.source_surface)
            .bind(&command.chat_conversation_id)
            .bind(&command.memory_space_id)
            .bind(&command.runtime)
            .bind(&command.cwd)
            .bind(&command.sandbox_policy)
            .bind(&command.approval_policy)
            .bind(&command.permission_mode)
            .bind(&command.default_model)
            .bind(&command.requested_at)
            .bind(&metadata)
            .execute(&self.pool)
            .await
            .map_err(sql_error)?;

            self.get_session(command.subject, command.session_uuid)
                .await?
                .ok_or_else(|| DomainError::new("created agent session was not found"))
        })
    }
}

async fn validate_memory_space_scope(
    pool: &SqlitePool,
    subject: AppAgentSessionSubject,
    memory_space_id: Option<&str>,
) -> DomainResult<()> {
    let Some(memory_space_id) = memory_space_id.filter(|value| !value.trim().is_empty()) else {
        return Ok(());
    };
    let exists: Option<i64> = sqlx::query_scalar(
        r#"
        SELECT 1
        FROM ai_memory_space
        WHERE tenant_id = ?1
          AND organization_id = ?2
          AND user_id = ?3
          AND uuid = ?4
          AND status <> 'deleted'
        LIMIT 1
        "#,
    )
    .bind(subject.tenant_id)
    .bind(subject.organization_id)
    .bind(subject.user_id)
    .bind(memory_space_id)
    .fetch_optional(pool)
    .await
    .map_err(sql_error)?;
    if exists.is_none() {
        return Err(DomainError::not_found("memory space was not found"));
    }
    Ok(())
}

fn row_to_session(row: sqlx::sqlite::SqliteRow) -> DomainResult<AppAgentSessionItem> {
    Ok(AppAgentSessionItem {
        id: string_cell(&row, "session_code"),
        agent_id: string_cell(&row, "agent_id"),
        agent_version_id: optional_string_cell(&row, "agent_version_id"),
        title: string_cell(&row, "title"),
        session_kind: string_cell(&row, "session_kind"),
        source_surface: string_cell(&row, "source_surface"),
        status: string_cell(&row, "status"),
        chat_conversation_id: optional_string_cell(&row, "chat_conversation_id"),
        memory_space_id: optional_string_cell(&row, "memory_space_id"),
        runtime: optional_string_cell(&row, "runtime"),
        cwd: optional_string_cell(&row, "cwd"),
        sandbox_policy: optional_string_cell(&row, "sandbox_policy"),
        approval_policy: optional_string_cell(&row, "approval_policy"),
        permission_mode: optional_string_cell(&row, "permission_mode"),
        default_model: optional_string_cell(&row, "default_model"),
        last_run_id: optional_string_cell(&row, "last_run_id"),
        last_step_id: optional_integer_cell(&row, "last_step_id"),
        last_active_at: optional_string_cell(&row, "last_active_at"),
        run_count: integer_cell(&row, "run_count"),
        step_count: integer_cell(&row, "step_count"),
        tool_call_count: integer_cell(&row, "tool_call_count"),
        created_at: string_cell(&row, "created_at"),
        updated_at: string_cell(&row, "updated_at"),
    })
}

fn string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> String {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .unwrap_or_default()
}

fn optional_string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<String> {
    string_cell(row, column)
        .trim()
        .to_owned()
        .pipe(|value| (!value.is_empty()).then_some(value))
}

fn integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> i64 {
    row.try_get::<Option<i64>, _>(column)
        .ok()
        .flatten()
        .unwrap_or_default()
}

fn optional_integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<i64> {
    row.try_get::<Option<i64>, _>(column).ok().flatten()
}

fn sql_error(error: sqlx::Error) -> DomainError {
    DomainError::new(format!("sqlite app agent session store error: {error}"))
}

trait Pipe: Sized {
    fn pipe<T>(self, f: impl FnOnce(Self) -> T) -> T {
        f(self)
    }
}

impl<T> Pipe for T {}
