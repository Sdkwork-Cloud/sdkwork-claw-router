use sqlx::{PgPool, Postgres, Row, Transaction};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    AppMemoryEntryItem, AppMemoryEntryList, AppMemoryFuture, AppMemorySpaceItem,
    AppMemorySpaceList, AppMemoryStore, AppMemorySubject, CreateAppMemoryEntryCommand,
    CreateAppMemorySpaceCommand,
};

#[derive(Debug, Clone)]
pub struct PostgresAppMemoryStore {
    pool: PgPool,
}

impl PostgresAppMemoryStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl AppMemoryStore for PostgresAppMemoryStore {
    fn list_spaces<'a>(
        &'a self,
        subject: AppMemorySubject,
        page: i64,
        page_size: i64,
    ) -> AppMemoryFuture<'a, AppMemorySpaceList> {
        Box::pin(async move {
            let offset = (page.max(1) - 1) * page_size.max(1);
            let rows = sqlx::query(&space_select_sql(
                r#"
                  AND status <> 'deleted'
                ORDER BY updated_at DESC NULLS LAST, id DESC
                LIMIT $4 OFFSET $5
                "#,
            ))
            .bind(subject.tenant_id)
            .bind(subject.organization_id)
            .bind(subject.user_id)
            .bind(page_size.max(1))
            .bind(offset)
            .fetch_all(&self.pool)
            .await
            .map_err(sql_error)?;
            rows.into_iter()
                .map(row_to_space)
                .collect::<DomainResult<Vec<_>>>()
                .map(|items| AppMemorySpaceList { items })
        })
    }

    fn get_space<'a>(
        &'a self,
        subject: AppMemorySubject,
        space_id: String,
    ) -> AppMemoryFuture<'a, Option<AppMemorySpaceItem>> {
        Box::pin(async move {
            let row = load_space_row_by_uuid(&self.pool, subject, &space_id)
                .await?
                .map(row_to_space)
                .transpose()?;
            Ok(row)
        })
    }

    fn create_space<'a>(
        &'a self,
        command: CreateAppMemorySpaceCommand,
    ) -> AppMemoryFuture<'a, AppMemorySpaceItem> {
        Box::pin(async move {
            let metadata = json_string(&command.metadata, "memory space metadata")?;
            let retention_policy =
                json_string(&command.retention_policy, "memory retention policy")?;
            let sensitivity_policy =
                json_string(&command.sensitivity_policy, "memory sensitivity policy")?;
            sqlx::query(
                r#"
                INSERT INTO ai_memory_space (
                    uuid,
                    tenant_id,
                    organization_id,
                    user_id,
                    space_type,
                    owner_type,
                    owner_id,
                    title,
                    status,
                    memory_enabled,
                    auto_extract_enabled,
                    auto_recall_enabled,
                    review_required,
                    max_injected_tokens,
                    retention_policy,
                    sensitivity_policy,
                    entry_count,
                    created_at,
                    updated_at,
                    metadata
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', $9, $10, $11, $12, $13, $14::jsonb, $15::jsonb, 0, $16::timestamp AT TIME ZONE 'UTC', $16::timestamp AT TIME ZONE 'UTC', $17::jsonb)
                "#,
            )
            .bind(&command.space_uuid)
            .bind(command.subject.tenant_id)
            .bind(command.subject.organization_id)
            .bind(command.subject.user_id)
            .bind(&command.space_type)
            .bind(&command.owner_type)
            .bind(
                command
                    .owner_id
                    .clone()
                    .unwrap_or_else(|| command.subject.user_id.to_string()),
            )
            .bind(&command.title)
            .bind(command.memory_enabled)
            .bind(command.auto_extract_enabled)
            .bind(command.auto_recall_enabled)
            .bind(command.review_required)
            .bind(command.max_injected_tokens)
            .bind(&retention_policy)
            .bind(&sensitivity_policy)
            .bind(&command.requested_at)
            .bind(&metadata)
            .execute(&self.pool)
            .await
            .map_err(sql_error)?;

            self.get_space(command.subject, command.space_uuid)
                .await?
                .ok_or_else(|| DomainError::new("created memory space was not found"))
        })
    }

    fn list_entries<'a>(
        &'a self,
        subject: AppMemorySubject,
        space_id: String,
        page: i64,
        page_size: i64,
    ) -> AppMemoryFuture<'a, AppMemoryEntryList> {
        Box::pin(async move {
            let offset = (page.max(1) - 1) * page_size.max(1);
            let space = load_space_row_by_uuid(&self.pool, subject, &space_id)
                .await?
                .ok_or_else(|| DomainError::not_found("memory space was not found"))?;
            let rows = sqlx::query(
                r#"
                SELECT
                    e.*,
                    s.uuid AS space_uuid,
                    CAST(e.importance_score AS TEXT) AS importance_score_text,
                    CAST(e.confidence_score AS TEXT) AS confidence_score_text,
                    CAST(e.created_at AS TEXT) AS created_at_text,
                    CAST(e.updated_at AS TEXT) AS updated_at_text
                FROM ai_memory_entry e
                INNER JOIN ai_memory_space s
                  ON s.id = e.space_id
                 AND s.tenant_id = e.tenant_id
                 AND s.organization_id = e.organization_id
                 AND s.user_id = e.user_id
                WHERE e.tenant_id = $1
                  AND e.organization_id = $2
                  AND e.user_id = $3
                  AND e.space_id = $4
                  AND e.status <> 'deleted'
                  AND e.deleted_at IS NULL
                ORDER BY e.updated_at DESC NULLS LAST, e.id DESC
                LIMIT $5 OFFSET $6
                "#,
            )
            .bind(subject.tenant_id)
            .bind(subject.organization_id)
            .bind(subject.user_id)
            .bind(integer_cell(&space, "id"))
            .bind(page_size.max(1))
            .bind(offset)
            .fetch_all(&self.pool)
            .await
            .map_err(sql_error)?;
            rows.into_iter()
                .map(row_to_entry)
                .collect::<DomainResult<Vec<_>>>()
                .map(|items| AppMemoryEntryList { items })
        })
    }

    fn get_entry<'a>(
        &'a self,
        subject: AppMemorySubject,
        entry_id: String,
    ) -> AppMemoryFuture<'a, Option<AppMemoryEntryItem>> {
        Box::pin(async move {
            let row = sqlx::query(
                r#"
                SELECT
                    e.*,
                    s.uuid AS space_uuid,
                    CAST(e.importance_score AS TEXT) AS importance_score_text,
                    CAST(e.confidence_score AS TEXT) AS confidence_score_text,
                    CAST(e.created_at AS TEXT) AS created_at_text,
                    CAST(e.updated_at AS TEXT) AS updated_at_text
                FROM ai_memory_entry e
                INNER JOIN ai_memory_space s
                 ON s.id = e.space_id
                 AND s.tenant_id = e.tenant_id
                 AND s.organization_id = e.organization_id
                 AND s.user_id = e.user_id
                WHERE e.tenant_id = $1
                  AND e.organization_id = $2
                  AND e.user_id = $3
                  AND e.uuid = $4
                  AND e.status <> 'deleted'
                  AND e.deleted_at IS NULL
                "#,
            )
            .bind(subject.tenant_id)
            .bind(subject.organization_id)
            .bind(subject.user_id)
            .bind(entry_id)
            .fetch_optional(&self.pool)
            .await
            .map_err(sql_error)?;
            row.map(row_to_entry).transpose()
        })
    }

    fn create_entry<'a>(
        &'a self,
        command: CreateAppMemoryEntryCommand,
    ) -> AppMemoryFuture<'a, AppMemoryEntryItem> {
        Box::pin(async move { create_entry(&self.pool, command).await })
    }
}

async fn create_entry(
    pool: &PgPool,
    command: CreateAppMemoryEntryCommand,
) -> DomainResult<AppMemoryEntryItem> {
    let metadata = json_string(&command.metadata, "memory entry metadata")?;
    let content_json = json_string(&command.content_json, "memory entry content json")?;
    let mut tx = pool.begin().await.map_err(|error| {
        DomainError::new(format!("failed to begin memory transaction: {error}"))
    })?;
    let space = load_space_row_by_uuid_in_tx(&mut tx, command.subject, &command.space_id)
        .await?
        .ok_or_else(|| DomainError::not_found("memory space was not found"))?;
    let space_pk = integer_cell(&space, "id");
    validate_source_context(&mut tx, &command).await?;

    let entry_id = sqlx::query_scalar::<_, i64>(
        r#"
        INSERT INTO ai_memory_entry (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            space_id,
            memory_code,
            memory_type,
            subject_type,
            subject_key,
            content_text,
            content_json,
            source_kind,
            source_conversation_id,
            source_turn_id,
            source_item_id,
            source_invocation_id,
            importance_score,
            confidence_score,
            sensitivity_level,
            trust_level,
            status,
            recall_count,
            version_no,
            created_by,
            created_at,
            updated_at,
            metadata
        )
        VALUES ($1, $2, $3, $4, $5, $1, $6, $7, $8, $9, $10::jsonb, $11, $12, $13, $14, $15, $16::numeric, $17::numeric, $18, $19, $20, 0, 1, $21, $22::timestamp AT TIME ZONE 'UTC', $22::timestamp AT TIME ZONE 'UTC', $23::jsonb)
        RETURNING id
        "#,
    )
    .bind(&command.entry_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.user_id)
    .bind(space_pk)
    .bind(&command.memory_type)
    .bind(&command.subject_type)
    .bind(&command.subject_key)
    .bind(&command.content_text)
    .bind(&content_json)
    .bind(&command.source_kind)
    .bind(&command.source_conversation_id)
    .bind(&command.source_turn_id)
    .bind(&command.source_item_id)
    .bind(&command.source_invocation_id)
    .bind(&command.importance_score)
    .bind(&command.confidence_score)
    .bind(&command.sensitivity_level)
    .bind(&command.trust_level)
    .bind(&command.status)
    .bind(command.subject.user_id.to_string())
    .bind(&command.requested_at)
    .bind(&metadata)
    .fetch_one(&mut *tx)
    .await
    .map_err(sql_error)?;

    sqlx::query(
        r#"
        INSERT INTO ai_memory_event (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            memory_id,
            space_id,
            event_type,
            actor_type,
            actor_id,
            conversation_id,
            turn_id,
            invocation_id,
            before_json,
            after_json,
            decision_reason,
            created_at,
            metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6, 'memory.created', 'user', $7, $8, $9, $10, NULL, $11::jsonb, 'manual_create', $12::timestamp AT TIME ZONE 'UTC', $13::jsonb)
        "#,
    )
    .bind(&command.event_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.user_id)
    .bind(entry_id)
    .bind(space_pk)
    .bind(command.subject.user_id.to_string())
    .bind(&command.source_conversation_id)
    .bind(&command.source_turn_id)
    .bind(&command.source_invocation_id)
    .bind(&content_json)
    .bind(&command.requested_at)
    .bind(&metadata)
    .execute(&mut *tx)
    .await
    .map_err(sql_error)?;

    sqlx::query(
        r#"
        UPDATE ai_memory_space
        SET entry_count = entry_count + 1,
            updated_at = $1::timestamp AT TIME ZONE 'UTC'
        WHERE id = $2
        "#,
    )
    .bind(&command.requested_at)
    .bind(space_pk)
    .execute(&mut *tx)
    .await
    .map_err(sql_error)?;

    tx.commit().await.map_err(|error| {
        DomainError::new(format!("failed to commit memory transaction: {error}"))
    })?;

    let entry = sqlx::query(
        r#"
        SELECT
            e.*,
            s.uuid AS space_uuid,
            CAST(e.importance_score AS TEXT) AS importance_score_text,
            CAST(e.confidence_score AS TEXT) AS confidence_score_text,
            CAST(e.created_at AS TEXT) AS created_at_text,
            CAST(e.updated_at AS TEXT) AS updated_at_text
        FROM ai_memory_entry e
        INNER JOIN ai_memory_space s
         ON s.id = e.space_id
         AND s.tenant_id = e.tenant_id
         AND s.organization_id = e.organization_id
         AND s.user_id = e.user_id
        WHERE e.id = $1
        "#,
    )
    .bind(entry_id)
    .fetch_one(pool)
    .await
    .map_err(sql_error)?;
    row_to_entry(entry)
}

async fn load_space_row_by_uuid(
    pool: &PgPool,
    subject: AppMemorySubject,
    space_id: &str,
) -> DomainResult<Option<sqlx::postgres::PgRow>> {
    sqlx::query(&space_select_sql(
        r#"
          AND uuid = $4
          AND status <> 'deleted'
        LIMIT 1
        "#,
    ))
    .bind(subject.tenant_id)
    .bind(subject.organization_id)
    .bind(subject.user_id)
    .bind(space_id)
    .fetch_optional(pool)
    .await
    .map_err(sql_error)
}

async fn load_space_row_by_uuid_in_tx(
    tx: &mut Transaction<'_, Postgres>,
    subject: AppMemorySubject,
    space_id: &str,
) -> DomainResult<Option<sqlx::postgres::PgRow>> {
    sqlx::query(&space_select_sql(
        r#"
          AND uuid = $4
          AND status <> 'deleted'
        LIMIT 1
        "#,
    ))
    .bind(subject.tenant_id)
    .bind(subject.organization_id)
    .bind(subject.user_id)
    .bind(space_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(sql_error)
}

async fn validate_source_context(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAppMemoryEntryCommand,
) -> DomainResult<()> {
    if non_empty(command.source_conversation_id.as_deref()).is_none()
        && non_empty(command.source_turn_id.as_deref()).is_none()
        && non_empty(command.source_item_id.as_deref()).is_none()
        && non_empty(command.source_invocation_id.as_deref()).is_none()
    {
        return Ok(());
    }

    let subject = command.subject;
    let conversation_pk =
        validate_source_conversation(tx, subject, command.source_conversation_id.as_deref())
            .await?;
    let turn_pk = validate_source_turn(
        tx,
        subject,
        command.source_turn_id.as_deref(),
        conversation_pk,
    )
    .await?;
    validate_source_item(
        tx,
        subject,
        command.source_item_id.as_deref(),
        conversation_pk,
        turn_pk,
    )
    .await?;
    validate_source_invocation(tx, command).await
}

async fn validate_source_conversation(
    tx: &mut Transaction<'_, Postgres>,
    subject: AppMemorySubject,
    conversation_id: Option<&str>,
) -> DomainResult<Option<i64>> {
    let Some(conversation_id) = non_empty(conversation_id) else {
        return Ok(None);
    };
    let id = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT id
        FROM ai_chat_conversation
        WHERE tenant_id = $1
          AND organization_id = $2
          AND user_id = $3
          AND (conversation_code = $4 OR uuid = $4)
          AND status <> 'deleted'
          AND deleted_at IS NULL
        LIMIT 1
        "#,
    )
    .bind(subject.tenant_id)
    .bind(subject.organization_id)
    .bind(subject.user_id)
    .bind(conversation_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(sql_error)?;
    id.map(Some)
        .ok_or_else(|| DomainError::not_found("source conversation was not found"))
}

async fn validate_source_turn(
    tx: &mut Transaction<'_, Postgres>,
    subject: AppMemorySubject,
    turn_id: Option<&str>,
    conversation_pk: Option<i64>,
) -> DomainResult<Option<i64>> {
    let Some(turn_id) = non_empty(turn_id) else {
        return Ok(None);
    };
    let id = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT id
        FROM ai_chat_turn
        WHERE tenant_id = $1
          AND organization_id = $2
          AND user_id = $3
          AND uuid = $4
          AND ($5 IS NULL OR conversation_id = $5)
          AND status <> 'deleted'
        LIMIT 1
        "#,
    )
    .bind(subject.tenant_id)
    .bind(subject.organization_id)
    .bind(subject.user_id)
    .bind(turn_id)
    .bind(conversation_pk)
    .fetch_optional(&mut **tx)
    .await
    .map_err(sql_error)?;
    id.map(Some)
        .ok_or_else(|| DomainError::not_found("source turn was not found"))
}

async fn validate_source_item(
    tx: &mut Transaction<'_, Postgres>,
    subject: AppMemorySubject,
    item_id: Option<&str>,
    conversation_pk: Option<i64>,
    turn_pk: Option<i64>,
) -> DomainResult<Option<i64>> {
    let Some(item_id) = non_empty(item_id) else {
        return Ok(None);
    };
    let id = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT id
        FROM ai_chat_item
        WHERE tenant_id = $1
          AND organization_id = $2
          AND user_id = $3
          AND uuid = $4
          AND ($5 IS NULL OR conversation_id = $5)
          AND ($6 IS NULL OR turn_id = $6)
          AND status <> 'deleted'
        LIMIT 1
        "#,
    )
    .bind(subject.tenant_id)
    .bind(subject.organization_id)
    .bind(subject.user_id)
    .bind(item_id)
    .bind(conversation_pk)
    .bind(turn_pk)
    .fetch_optional(&mut **tx)
    .await
    .map_err(sql_error)?;
    id.map(Some)
        .ok_or_else(|| DomainError::not_found("source item was not found"))
}

async fn validate_source_invocation(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAppMemoryEntryCommand,
) -> DomainResult<()> {
    let Some(invocation_id) = non_empty(command.source_invocation_id.as_deref()) else {
        return Ok(());
    };
    let exists = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT 1::BIGINT
        FROM ai_runtime_invocation
        WHERE tenant_id = $1
          AND organization_id = $2
          AND user_id = $3
          AND uuid = $4
          AND ($5 IS NULL OR conversation_id = $5)
          AND ($6 IS NULL OR chat_turn_id = $6)
          AND ($7 IS NULL OR chat_item_id = $7)
        LIMIT 1
        "#,
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.user_id)
    .bind(invocation_id)
    .bind(&command.source_conversation_id)
    .bind(&command.source_turn_id)
    .bind(&command.source_item_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(sql_error)?;
    if exists.is_none() {
        return Err(DomainError::not_found("source invocation was not found"));
    }
    Ok(())
}

fn space_select_sql(extra: &str) -> String {
    format!(
        r#"
        SELECT
            id,
            uuid,
            space_type,
            owner_type,
            owner_id,
            title,
            status,
            memory_enabled,
            auto_extract_enabled,
            auto_recall_enabled,
            review_required,
            max_injected_tokens,
            entry_count,
            CAST(created_at AS TEXT) AS created_at,
            CAST(updated_at AS TEXT) AS updated_at
        FROM ai_memory_space
        WHERE tenant_id = $1
          AND organization_id = $2
          AND user_id = $3
        {extra}
        "#
    )
}

fn row_to_space(row: sqlx::postgres::PgRow) -> DomainResult<AppMemorySpaceItem> {
    Ok(AppMemorySpaceItem {
        id: string_cell(&row, "uuid"),
        space_type: string_cell(&row, "space_type"),
        owner_type: optional_string_cell(&row, "owner_type"),
        owner_id: optional_string_cell(&row, "owner_id"),
        title: string_cell(&row, "title"),
        status: string_cell(&row, "status"),
        memory_enabled: bool_cell(&row, "memory_enabled"),
        auto_extract_enabled: bool_cell(&row, "auto_extract_enabled"),
        auto_recall_enabled: bool_cell(&row, "auto_recall_enabled"),
        review_required: bool_cell(&row, "review_required"),
        max_injected_tokens: optional_integer_cell(&row, "max_injected_tokens"),
        entry_count: integer_cell(&row, "entry_count"),
        created_at: string_cell(&row, "created_at"),
        updated_at: string_cell(&row, "updated_at"),
    })
}

fn row_to_entry(row: sqlx::postgres::PgRow) -> DomainResult<AppMemoryEntryItem> {
    Ok(AppMemoryEntryItem {
        id: string_cell(&row, "uuid"),
        space_id: string_cell(&row, "space_uuid"),
        memory_type: string_cell(&row, "memory_type"),
        subject_type: optional_string_cell(&row, "subject_type"),
        subject_key: optional_string_cell(&row, "subject_key"),
        content: string_cell(&row, "content_text"),
        source_kind: string_cell(&row, "source_kind"),
        source_conversation_id: optional_string_cell(&row, "source_conversation_id"),
        source_turn_id: optional_string_cell(&row, "source_turn_id"),
        source_item_id: optional_string_cell(&row, "source_item_id"),
        source_invocation_id: optional_string_cell(&row, "source_invocation_id"),
        importance_score: optional_string_cell(&row, "importance_score_text")
            .or_else(|| optional_string_cell(&row, "importance_score")),
        confidence_score: optional_string_cell(&row, "confidence_score_text")
            .or_else(|| optional_string_cell(&row, "confidence_score")),
        sensitivity_level: string_cell(&row, "sensitivity_level"),
        trust_level: string_cell(&row, "trust_level"),
        status: string_cell(&row, "status"),
        recall_count: integer_cell(&row, "recall_count"),
        created_at: optional_string_cell(&row, "created_at_text")
            .unwrap_or_else(|| string_cell(&row, "created_at")),
        updated_at: optional_string_cell(&row, "updated_at_text")
            .unwrap_or_else(|| string_cell(&row, "updated_at")),
    })
}

fn json_string(value: &serde_json::Value, field: &str) -> DomainResult<String> {
    serde_json::to_string(value)
        .map_err(|error| DomainError::new(format!("invalid {field}: {error}")))
}

fn string_cell(row: &sqlx::postgres::PgRow, column: &str) -> String {
    optional_string_cell(row, column).unwrap_or_default()
}

fn optional_string_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .or_else(|| row.try_get::<String, _>(column).ok())
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
}

fn integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> i64 {
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
        .or_else(|| row.try_get::<i32, _>(column).ok().map(i64::from))
        .unwrap_or_default()
}

fn optional_integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<i64> {
    row.try_get::<Option<i64>, _>(column)
        .ok()
        .flatten()
        .or_else(|| row.try_get::<i64, _>(column).ok())
}

fn bool_cell(row: &sqlx::postgres::PgRow, column: &str) -> bool {
    row.try_get::<Option<bool>, _>(column)
        .ok()
        .flatten()
        .or_else(|| row.try_get::<bool, _>(column).ok())
        .unwrap_or(false)
}

fn non_empty(value: Option<&str>) -> Option<&str> {
    value.map(str::trim).filter(|value| !value.is_empty())
}

fn sql_error(error: sqlx::Error) -> DomainError {
    DomainError::new(format!("postgres app memory store error: {error}"))
}
