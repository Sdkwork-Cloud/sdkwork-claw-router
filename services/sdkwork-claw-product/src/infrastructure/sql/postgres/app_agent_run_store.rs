use sqlx::{PgPool, Postgres, Row, Transaction};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    AppAgentRunFuture, AppAgentRunItem, AppAgentRunList, AppAgentRunStepItem, AppAgentRunStepList,
    AppAgentRunStore, AppAgentRunSubject, CompleteAppAgentRunCommand,
    CompleteAppAgentRunStepCommand, CreateAppAgentRunCommand, CreateAppAgentRunStepCommand,
};

const STEP_TYPE_INPUT: i64 = 1;
const STEP_TYPE_MODEL: i64 = 2;
const STEP_TYPE_TOOL: i64 = 3;
const STEP_TYPE_MEMORY: i64 = 4;
const STEP_TYPE_RUNTIME: i64 = 5;
const STEP_TYPE_SYSTEM: i64 = 6;
const STEP_TYPE_CUSTOM: i64 = 99;

#[derive(Debug, Clone)]
pub struct PostgresAppAgentRunStore {
    pool: PgPool,
}

impl PostgresAppAgentRunStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl AppAgentRunStore for PostgresAppAgentRunStore {
    fn list_runs<'a>(
        &'a self,
        subject: AppAgentRunSubject,
        session_id: String,
        page: i64,
        page_size: i64,
    ) -> AppAgentRunFuture<'a, AppAgentRunList> {
        Box::pin(async move {
            load_session_row_by_code(&self.pool, subject, &session_id)
                .await?
                .ok_or_else(|| DomainError::not_found("agent session was not found"))?;
            let offset = (page.max(1) - 1) * page_size.max(1);
            let rows = sqlx::query(
                r#"
                SELECT
                    id,
                    uuid,
                    tenant_id,
                    organization_id,
                    user_id,
                    request_id,
                    trace_id,
                    status,
                    CAST(created_at AS TEXT) AS created_at_text,
                    metadata,
                    agent_id,
                    agent_version_id,
                    agent_session_id,
                    memory_space_id,
                    runtime,
                    model,
                    run_uuid,
                    run_status,
                    source_surface,
                    input_message,
                    output_message,
                    planner_model,
                    execution_mode,
                    CAST(started_at AS TEXT) AS started_at_text,
                    CAST(completed_at AS TEXT) AS completed_at_text,
                    CAST(cancelled_at AS TEXT) AS cancelled_at_text,
                    CAST(failed_at AS TEXT) AS failed_at_text,
                    error_message_masked,
                    metering_status,
                    usage_fact_id,
                    total_steps,
                    prompt_tokens,
                    completion_tokens,
                    cached_tokens,
                    total_tokens,
                    image_count,
                    CAST(audio_seconds AS TEXT) AS audio_seconds_text,
                    CAST(video_seconds AS TEXT) AS video_seconds_text
                FROM ai_agent_run
                WHERE tenant_id = $1
                  AND organization_id = $2
                  AND user_id = $3
                  AND agent_session_id = $4
                  AND status <> 'deleted'
                ORDER BY created_at DESC NULLS LAST, id DESC
                LIMIT $5 OFFSET $6
                "#,
            )
            .bind(subject.tenant_id)
            .bind(subject.organization_id)
            .bind(subject.user_id)
            .bind(session_id)
            .bind(page_size.max(1))
            .bind(offset)
            .fetch_all(&self.pool)
            .await
            .map_err(sql_error)?;
            rows.into_iter()
                .map(row_to_run)
                .collect::<DomainResult<Vec<_>>>()
                .map(|items| AppAgentRunList { items })
        })
    }

    fn get_run<'a>(
        &'a self,
        subject: AppAgentRunSubject,
        run_id: String,
    ) -> AppAgentRunFuture<'a, Option<AppAgentRunItem>> {
        Box::pin(async move {
            load_run_row_by_uuid(&self.pool, subject, &run_id)
                .await?
                .map(row_to_run)
                .transpose()
        })
    }

    fn create_run<'a>(
        &'a self,
        command: CreateAppAgentRunCommand,
    ) -> AppAgentRunFuture<'a, AppAgentRunItem> {
        Box::pin(async move { create_run(&self.pool, command).await })
    }

    fn complete_run<'a>(
        &'a self,
        command: CompleteAppAgentRunCommand,
    ) -> AppAgentRunFuture<'a, AppAgentRunItem> {
        Box::pin(async move { complete_run(&self.pool, command).await })
    }

    fn list_steps<'a>(
        &'a self,
        subject: AppAgentRunSubject,
        run_id: String,
        page: i64,
        page_size: i64,
    ) -> AppAgentRunFuture<'a, AppAgentRunStepList> {
        Box::pin(async move {
            let run = load_run_row_by_uuid(&self.pool, subject, &run_id)
                .await?
                .ok_or_else(|| DomainError::not_found("agent run was not found"))?;
            let offset = (page.max(1) - 1) * page_size.max(1);
            let rows = sqlx::query(
                r#"
                SELECT
                    s.id,
                    s.uuid,
                    s.tenant_id,
                    s.organization_id,
                    s.user_id,
                    s.request_id,
                    s.trace_id,
                    s.status,
                    CAST(s.created_at AS TEXT) AS created_at_text,
                    s.metadata,
                    s.run_id,
                    s.agent_id,
                    s.agent_version_id,
                    s.step_index,
                    s.step_type,
                    s.step_status,
                    s.title,
                    s.tool_name,
                    s.model,
                    s.runtime_invocation_id,
                    s.input_snapshot,
                    s.output_snapshot,
                    s.usage_json,
                    CAST(s.started_at AS TEXT) AS started_at_text,
                    CAST(s.completed_at AS TEXT) AS completed_at_text,
                    s.latency_ms,
                    s.prompt_tokens,
                    s.completion_tokens,
                    s.cached_tokens,
                    s.total_tokens,
                    CAST(s.audio_seconds AS TEXT) AS audio_seconds_text,
                    CAST(s.video_seconds AS TEXT) AS video_seconds_text,
                    s.usage_fact_id,
                    r.run_uuid AS run_uuid
                FROM ai_agent_run_step s
                INNER JOIN ai_agent_run r
                  ON r.id = s.run_id
                 AND r.tenant_id = s.tenant_id
                 AND r.organization_id = s.organization_id
                 AND r.user_id = s.user_id
                WHERE s.tenant_id = $1
                  AND s.organization_id = $2
                  AND s.user_id = $3
                  AND s.run_id = $4
                  AND s.status <> 'deleted'
                  AND r.status <> 'deleted'
                ORDER BY s.step_index ASC, s.id ASC
                LIMIT $5 OFFSET $6
                "#,
            )
            .bind(subject.tenant_id)
            .bind(subject.organization_id)
            .bind(subject.user_id)
            .bind(integer_cell(&run, "id"))
            .bind(page_size.max(1))
            .bind(offset)
            .fetch_all(&self.pool)
            .await
            .map_err(sql_error)?;
            rows.into_iter()
                .map(row_to_step)
                .collect::<DomainResult<Vec<_>>>()
                .map(|items| AppAgentRunStepList { items })
        })
    }

    fn create_step<'a>(
        &'a self,
        command: CreateAppAgentRunStepCommand,
    ) -> AppAgentRunFuture<'a, AppAgentRunStepItem> {
        Box::pin(async move { create_step(&self.pool, command).await })
    }

    fn complete_step<'a>(
        &'a self,
        command: CompleteAppAgentRunStepCommand,
    ) -> AppAgentRunFuture<'a, AppAgentRunStepItem> {
        Box::pin(async move { complete_step(&self.pool, command).await })
    }
}

async fn create_run(
    pool: &PgPool,
    command: CreateAppAgentRunCommand,
) -> DomainResult<AppAgentRunItem> {
    let metadata = json_string(&command.metadata, "agent run metadata")?;
    let mut tx = pool.begin().await.map_err(|error| {
        DomainError::new(format!("failed to begin agent run transaction: {error}"))
    })?;
    let session = load_session_row_by_code_in_tx(&mut tx, command.subject, &command.session_id)
        .await?
        .ok_or_else(|| DomainError::not_found("agent session was not found"))?;
    validate_session_matches_run(&session, &command)?;
    sqlx::query(
        r#"
        INSERT INTO ai_agent_run (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            request_id,
            trace_id,
            status,
            created_at,
            metadata,
            agent_id,
            agent_version_id,
            agent_session_id,
            memory_space_id,
            runtime,
            model,
            run_uuid,
            run_status,
            source_surface,
            input_message,
            output_message,
            planner_model,
            execution_mode,
            started_at,
            completed_at,
            cancelled_at,
            failed_at,
            error_message_masked,
            metering_status,
            usage_fact_id,
            usage_json,
            total_steps,
            prompt_tokens,
            completion_tokens,
            cached_tokens,
            total_tokens,
            image_count,
            audio_seconds,
            video_seconds
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8::timestamp AT TIME ZONE 'UTC',
            $9::jsonb,
            $10,
            $11,
            $12,
            $13,
            $14,
            $15,
            $1,
            $16,
            $17,
            $18,
            NULL,
            $15,
            $19,
            $8::timestamp AT TIME ZONE 'UTC',
            NULL,
            NULL,
            NULL,
            NULL,
            1,
            NULL,
            '{}'::jsonb,
            0,
            NULL,
            NULL,
            NULL,
            NULL,
            NULL,
            NULL,
            NULL
        )
        "#,
    )
    .bind(&command.run_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.user_id)
    .bind(&command.request_id)
    .bind(&command.trace_id)
    .bind("active")
    .bind(&command.requested_at)
    .bind(&metadata)
    .bind(parse_positive_i64(&command.agent_id, "agentId")?)
    .bind(parse_positive_i64(
        &command.agent_version_id,
        "agentVersionId",
    )?)
    .bind(&command.session_id)
    .bind(&command.memory_space_id)
    .bind(&command.runtime)
    .bind(&command.model)
    .bind("running")
    .bind(&command.source_surface)
    .bind(&command.input_message)
    .bind(&command.execution_mode)
    .execute(&mut *tx)
    .await
    .map_err(sql_error)?;

    sqlx::query(
        r#"
        UPDATE ai_agent_session
        SET run_count = run_count + 1,
            last_run_id = $1,
            last_active_at = $2::timestamp AT TIME ZONE 'UTC',
            updated_at = $2::timestamp AT TIME ZONE 'UTC'
        WHERE id = $3
        "#,
    )
    .bind(&command.run_uuid)
    .bind(&command.requested_at)
    .bind(integer_cell(&session, "id"))
    .execute(&mut *tx)
    .await
    .map_err(sql_error)?;

    tx.commit().await.map_err(|error| {
        DomainError::new(format!("failed to commit agent run transaction: {error}"))
    })?;

    load_run_row_by_uuid(pool, command.subject, &command.run_uuid)
        .await?
        .map(row_to_run)
        .transpose()?
        .ok_or_else(|| DomainError::new("created agent run was not found"))
}

async fn complete_run(
    pool: &PgPool,
    command: CompleteAppAgentRunCommand,
) -> DomainResult<AppAgentRunItem> {
    let usage_json = json_string(&command.usage_json, "agent run usage json")?;
    let metadata = json_string(&command.metadata, "agent run metadata")?;
    let mut tx = pool.begin().await.map_err(|error| {
        DomainError::new(format!(
            "failed to begin agent run complete transaction: {error}"
        ))
    })?;
    let run = load_run_row_by_uuid_in_tx(&mut tx, command.subject, &command.run_id)
        .await?
        .ok_or_else(|| DomainError::not_found("agent run was not found"))?;
    let run_pk = integer_cell(&run, "id");
    let total_steps = count_steps_for_run_pk(&mut tx, command.subject, run_pk).await?;
    let result = sqlx::query(
        r#"
        UPDATE ai_agent_run
        SET run_status = $1,
            output_message = $2,
            error_message_masked = $3,
            completed_at = CASE WHEN $4 IS NOT NULL THEN $4::timestamp AT TIME ZONE 'UTC' ELSE completed_at END,
            cancelled_at = CASE WHEN $5 IS NOT NULL THEN $5::timestamp AT TIME ZONE 'UTC' ELSE cancelled_at END,
            failed_at = CASE WHEN $6 IS NOT NULL THEN $6::timestamp AT TIME ZONE 'UTC' ELSE failed_at END,
            usage_json = $7::jsonb,
            metadata = $8::jsonb,
            total_steps = $9,
            prompt_tokens = $10,
            completion_tokens = $11,
            cached_tokens = $12,
            total_tokens = $13
        WHERE id = $14
        "#,
    )
    .bind(&command.status)
    .bind(&command.output_message)
    .bind(&command.error_message_masked)
    .bind(terminal_timestamp(&command.status, "completed", &command.requested_at))
    .bind(terminal_timestamp(&command.status, "cancelled", &command.requested_at))
    .bind(terminal_timestamp(&command.status, "failed", &command.requested_at))
    .bind(&usage_json)
    .bind(&metadata)
    .bind(total_steps)
    .bind(command.input_tokens)
    .bind(command.output_tokens)
    .bind(command.cached_tokens)
    .bind(command.total_tokens)
    .bind(run_pk)
    .execute(&mut *tx)
    .await
    .map_err(sql_error)?;
    if result.rows_affected() == 0 {
        return Err(DomainError::not_found("agent run was not found"));
    }

    insert_run_usage_link(&mut tx, &command, &run, &metadata).await?;

    tx.commit().await.map_err(|error| {
        DomainError::new(format!(
            "failed to commit agent run complete transaction: {error}"
        ))
    })?;

    load_run_row_by_uuid(pool, command.subject, &command.run_id)
        .await?
        .map(row_to_run)
        .transpose()?
        .ok_or_else(|| DomainError::not_found("agent run was not found"))
}

async fn create_step(
    pool: &PgPool,
    command: CreateAppAgentRunStepCommand,
) -> DomainResult<AppAgentRunStepItem> {
    let input_json = json_string(&command.input_json, "agent run step input json")?;
    let output_json = json_string(&command.output_json, "agent run step output json")?;
    let usage_json = json_string(&command.usage_json, "agent run step usage json")?;
    let metadata = json_string(&command.metadata, "agent run step metadata")?;
    let mut tx = pool.begin().await.map_err(|error| {
        DomainError::new(format!(
            "failed to begin agent run step transaction: {error}"
        ))
    })?;
    let run = load_run_row_by_uuid_in_tx(&mut tx, command.subject, &command.run_id)
        .await?
        .ok_or_else(|| DomainError::not_found("agent run was not found"))?;
    let run_pk = integer_cell(&run, "id");
    let step_index = next_step_index(&mut tx, command.subject, run_pk).await?;
    let step_pk = sqlx::query(
        r#"
        INSERT INTO ai_agent_run_step (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            request_id,
            trace_id,
            status,
            created_at,
            metadata,
            run_id,
            agent_id,
            agent_version_id,
            step_index,
            step_type,
            step_status,
            title,
            tool_name,
            model,
            runtime_invocation_id,
            input_snapshot,
            output_snapshot,
            usage_json,
            started_at,
            completed_at,
            latency_ms,
            prompt_tokens,
            completion_tokens,
            cached_tokens,
            total_tokens
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8::timestamp AT TIME ZONE 'UTC',
            $9::jsonb,
            $10,
            $11,
            $12,
            $13,
            $14,
            $15,
            $16,
            $17,
            $18,
            $19,
            $20::jsonb,
            $21::jsonb,
            $22::jsonb,
            $8::timestamp AT TIME ZONE 'UTC',
            CASE WHEN $15 = 'completed' THEN $8::timestamp AT TIME ZONE 'UTC' ELSE NULL END,
            NULL,
            $23,
            $24,
            $25,
            $26
        )
        RETURNING id
        "#,
    )
    .bind(&command.step_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.user_id)
    .bind(optional_string_cell(&run, "request_id"))
    .bind(optional_string_cell(&run, "trace_id"))
    .bind("active")
    .bind(&command.requested_at)
    .bind(&metadata)
    .bind(run_pk)
    .bind(integer_cell(&run, "agent_id"))
    .bind(integer_cell(&run, "agent_version_id"))
    .bind(step_index)
    .bind(step_type_code(&command.step_type))
    .bind(&command.status)
    .bind(&command.title)
    .bind(&command.tool_name)
    .bind(&command.model)
    .bind(&command.runtime_invocation_id)
    .bind(&input_json)
    .bind(&output_json)
    .bind(&usage_json)
    .bind(command.input_tokens)
    .bind(command.output_tokens)
    .bind(command.cached_tokens)
    .bind(command.total_tokens)
    .fetch_one(&mut *tx)
    .await
    .map_err(sql_error)
    .map(|row| integer_cell(&row, "id"))?;

    sqlx::query(
        r#"
        UPDATE ai_agent_run
        SET total_steps = COALESCE(total_steps, 0) + 1
        WHERE id = $1
        "#,
    )
    .bind(run_pk)
    .execute(&mut *tx)
    .await
    .map_err(sql_error)?;

    if let Some(session_id) = optional_string_cell(&run, "agent_session_id") {
        sqlx::query(
            r#"
            UPDATE ai_agent_session
            SET step_count = step_count + 1,
                last_run_id = $1,
                last_step_id = $2,
                last_active_at = $3::timestamp AT TIME ZONE 'UTC',
                tool_call_count = CASE WHEN $4 THEN tool_call_count + 1 ELSE tool_call_count END,
                updated_at = $3::timestamp AT TIME ZONE 'UTC'
            WHERE tenant_id = $5
              AND organization_id = $6
              AND user_id = $7
              AND session_code = $8
            "#,
        )
        .bind(&command.run_id)
        .bind(step_pk)
        .bind(&command.requested_at)
        .bind(matches!(command.step_type.as_str(), "tool"))
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(command.subject.user_id)
        .bind(session_id)
        .execute(&mut *tx)
        .await
        .map_err(sql_error)?;
    }

    if let Some(runtime_invocation_id) = command.runtime_invocation_id.as_deref() {
        let result = sqlx::query(
            r#"
            UPDATE ai_runtime_invocation
            SET agent_run_id = $1,
                agent_run_step_id = $2
            WHERE tenant_id = $3
              AND organization_id = $4
              AND user_id = $5
              AND uuid = $6
            "#,
        )
        .bind(&command.run_id)
        .bind(&command.step_uuid)
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(command.subject.user_id)
        .bind(runtime_invocation_id)
        .execute(&mut *tx)
        .await
        .map_err(sql_error)?;
        if result.rows_affected() == 0 {
            return Err(DomainError::not_found("runtime invocation was not found"));
        }

        let invocation_pk = sqlx::query_scalar::<_, i64>(
            r#"
            SELECT id
            FROM ai_runtime_invocation
            WHERE tenant_id = $1
              AND organization_id = $2
              AND user_id = $3
              AND uuid = $4
            "#,
        )
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(command.subject.user_id)
        .bind(runtime_invocation_id)
        .fetch_one(&mut *tx)
        .await
        .map_err(sql_error)?;

        sqlx::query(
            r#"
            UPDATE ai_runtime_invocation_event
            SET agent_run_id = $1,
                agent_run_step_id = $2
            WHERE tenant_id = $3
              AND organization_id = $4
              AND user_id = $5
              AND invocation_id = $6
            "#,
        )
        .bind(&command.run_id)
        .bind(&command.step_uuid)
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(command.subject.user_id)
        .bind(invocation_pk)
        .execute(&mut *tx)
        .await
        .map_err(sql_error)?;

        sqlx::query(
            r#"
            UPDATE ai_runtime_artifact
            SET agent_run_id = $1,
                agent_run_step_id = $2
            WHERE tenant_id = $3
              AND organization_id = $4
              AND user_id = $5
              AND runtime_invocation_id = $6
            "#,
        )
        .bind(&command.run_id)
        .bind(&command.step_uuid)
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(command.subject.user_id)
        .bind(runtime_invocation_id)
        .execute(&mut *tx)
        .await
        .map_err(sql_error)?;
    }

    insert_step_usage_link(&mut tx, &command, &run, &metadata).await?;

    tx.commit().await.map_err(|error| {
        DomainError::new(format!(
            "failed to commit agent run step transaction: {error}"
        ))
    })?;

    let row = sqlx::query(
        r#"
        SELECT
            s.id,
            s.uuid,
            s.tenant_id,
            s.organization_id,
            s.user_id,
            s.request_id,
            s.trace_id,
            s.status,
            CAST(s.created_at AS TEXT) AS created_at_text,
            s.metadata,
            s.run_id,
            s.agent_id,
            s.agent_version_id,
            s.step_index,
            s.step_type,
            s.step_status,
            s.title,
            s.tool_name,
            s.model,
            s.runtime_invocation_id,
            s.input_snapshot,
            s.output_snapshot,
            s.usage_json,
            CAST(s.started_at AS TEXT) AS started_at_text,
            CAST(s.completed_at AS TEXT) AS completed_at_text,
            s.latency_ms,
            s.prompt_tokens,
            s.completion_tokens,
            s.cached_tokens,
            s.total_tokens,
            CAST(s.audio_seconds AS TEXT) AS audio_seconds_text,
            CAST(s.video_seconds AS TEXT) AS video_seconds_text,
            s.usage_fact_id,
            r.run_uuid AS run_uuid
        FROM ai_agent_run_step s
        INNER JOIN ai_agent_run r
          ON r.id = s.run_id
         AND r.tenant_id = s.tenant_id
         AND r.organization_id = s.organization_id
         AND r.user_id = s.user_id
        WHERE s.uuid = $1
          AND s.tenant_id = $2
          AND s.organization_id = $3
          AND s.user_id = $4
        "#,
    )
    .bind(&command.step_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.user_id)
    .fetch_one(pool)
    .await
    .map_err(sql_error)?;
    row_to_step(row)
}

async fn complete_step(
    pool: &PgPool,
    command: CompleteAppAgentRunStepCommand,
) -> DomainResult<AppAgentRunStepItem> {
    let output_json = json_string(&command.output_json, "agent run step output json")?;
    let usage_json = json_string(&command.usage_json, "agent run step usage json")?;
    let metadata = json_string(&command.metadata, "agent run step metadata")?;
    let mut tx = pool.begin().await.map_err(|error| {
        DomainError::new(format!(
            "failed to begin agent run step complete transaction: {error}"
        ))
    })?;
    let (step, run) =
        load_step_row_by_uuid_in_tx(&mut tx, command.subject, &command.step_id, &command.run_id)
            .await?
            .ok_or_else(|| DomainError::not_found("agent run step was not found"))?;
    let step_pk = integer_cell(&step, "id");

    let result = sqlx::query(
        r#"
        UPDATE ai_agent_run_step
        SET step_status = $1,
            output_snapshot = $2::jsonb,
            usage_json = $3::jsonb,
            metadata = $4::jsonb,
            error_message_masked = $5,
            completed_at = CASE WHEN $6 IS NOT NULL THEN $6::timestamp AT TIME ZONE 'UTC' ELSE completed_at END,
            latency_ms = CASE
                WHEN started_at IS NOT NULL AND $6 IS NOT NULL
                THEN GREATEST(0, FLOOR(EXTRACT(EPOCH FROM (($6::timestamp AT TIME ZONE 'UTC') - started_at)) * 1000)::BIGINT)
                ELSE latency_ms
            END,
            prompt_tokens = $7,
            completion_tokens = $8,
            cached_tokens = $9,
            total_tokens = $10,
            usage_fact_id = $11
        WHERE id = $12
        "#,
    )
    .bind(&command.status)
    .bind(&output_json)
    .bind(&usage_json)
    .bind(&metadata)
    .bind(&command.error_message_masked)
    .bind(terminal_timestamp_for_any_terminal(&command.status, &command.requested_at))
    .bind(command.input_tokens)
    .bind(command.output_tokens)
    .bind(command.cached_tokens)
    .bind(command.total_tokens)
    .bind(command.usage_fact_id)
    .bind(step_pk)
    .execute(&mut *tx)
    .await
    .map_err(sql_error)?;
    if result.rows_affected() == 0 {
        return Err(DomainError::not_found("agent run step was not found"));
    }

    insert_completed_step_usage_link(&mut tx, &command, &step, &run, &metadata).await?;

    tx.commit().await.map_err(|error| {
        DomainError::new(format!(
            "failed to commit agent run step complete transaction: {error}"
        ))
    })?;

    load_step_row_by_uuid(pool, command.subject, &command.step_id, &command.run_id)
        .await?
        .map(|(step, _)| step)
        .map(row_to_step)
        .transpose()?
        .ok_or_else(|| DomainError::not_found("agent run step was not found"))
}

async fn count_steps_for_run_pk(
    tx: &mut Transaction<'_, Postgres>,
    subject: AppAgentRunSubject,
    run_pk: i64,
) -> DomainResult<i64> {
    let row = sqlx::query(
        r#"
        SELECT COUNT(*) AS step_count
        FROM ai_agent_run_step
        WHERE tenant_id = $1
          AND organization_id = $2
          AND user_id = $3
          AND run_id = $4
          AND status <> 'deleted'
        "#,
    )
    .bind(subject.tenant_id)
    .bind(subject.organization_id)
    .bind(subject.user_id)
    .bind(run_pk)
    .fetch_one(&mut **tx)
    .await
    .map_err(sql_error)?;
    Ok(integer_cell(&row, "step_count"))
}

async fn next_step_index(
    tx: &mut Transaction<'_, Postgres>,
    subject: AppAgentRunSubject,
    run_pk: i64,
) -> DomainResult<i64> {
    let row = sqlx::query(
        r#"
        SELECT COALESCE(MAX(step_index), 0) + 1 AS next_value
        FROM ai_agent_run_step
        WHERE tenant_id = $1
          AND organization_id = $2
          AND user_id = $3
          AND run_id = $4
        "#,
    )
    .bind(subject.tenant_id)
    .bind(subject.organization_id)
    .bind(subject.user_id)
    .bind(run_pk)
    .fetch_one(&mut **tx)
    .await
    .map_err(sql_error)?;
    Ok(integer_cell(&row, "next_value"))
}

async fn insert_run_usage_link(
    tx: &mut Transaction<'_, Postgres>,
    command: &CompleteAppAgentRunCommand,
    run: &sqlx::postgres::PgRow,
    metadata: &str,
) -> DomainResult<()> {
    if !has_usage(
        command.input_tokens,
        command.output_tokens,
        command.cached_tokens,
        command.reasoning_tokens,
        command.total_tokens,
        command.cost_amount.as_deref(),
        command.currency.as_deref(),
        command.usage_fact_id,
        None,
    ) {
        return Ok(());
    }
    sqlx::query(
        r#"
        INSERT INTO ai_runtime_usage_link (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            agent_session_id,
            agent_run_id,
            agent_run_step_id,
            runtime_invocation_id,
            usage_fact_id,
            usage_type,
            model,
            request_id,
            trace_id,
            input_tokens,
            output_tokens,
            cached_tokens,
            reasoning_tokens,
            total_tokens,
            cost_amount,
            currency,
            occurred_at,
            metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6, NULL, NULL, $7, 'agent_run_total', $8, $9, $10, $11, $12, $13, $14, $15, $16::numeric, $17, $18::timestamp AT TIME ZONE 'UTC', $19::jsonb)
        ON CONFLICT (tenant_id, organization_id, user_id, agent_run_id, usage_type, agent_run_step_id_key) DO UPDATE SET
            usage_fact_id = COALESCE(excluded.usage_fact_id, ai_runtime_usage_link.usage_fact_id),
            model = COALESCE(excluded.model, ai_runtime_usage_link.model),
            request_id = COALESCE(excluded.request_id, ai_runtime_usage_link.request_id),
            trace_id = COALESCE(excluded.trace_id, ai_runtime_usage_link.trace_id),
            input_tokens = excluded.input_tokens,
            output_tokens = excluded.output_tokens,
            cached_tokens = excluded.cached_tokens,
            reasoning_tokens = excluded.reasoning_tokens,
            total_tokens = excluded.total_tokens,
            cost_amount = COALESCE(excluded.cost_amount, ai_runtime_usage_link.cost_amount),
            currency = COALESCE(excluded.currency, ai_runtime_usage_link.currency),
            occurred_at = excluded.occurred_at,
            metadata = excluded.metadata
        "#,
    )
    .bind(&command.usage_link_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.user_id)
    .bind(optional_string_cell(run, "agent_session_id"))
    .bind(&command.run_id)
    .bind(command.usage_fact_id)
    .bind(optional_string_cell(run, "model").or_else(|| optional_string_cell(run, "planner_model")))
    .bind(optional_string_cell(run, "request_id"))
    .bind(optional_string_cell(run, "trace_id"))
    .bind(command.input_tokens.unwrap_or_default())
    .bind(command.output_tokens.unwrap_or_default())
    .bind(command.cached_tokens.unwrap_or_default())
    .bind(command.reasoning_tokens.unwrap_or_default())
    .bind(command.total_tokens.unwrap_or_else(|| {
        command.input_tokens.unwrap_or_default()
            + command.output_tokens.unwrap_or_default()
            + command.cached_tokens.unwrap_or_default()
            + command.reasoning_tokens.unwrap_or_default()
    }))
    .bind(&command.cost_amount)
    .bind(&command.currency)
    .bind(&command.requested_at)
    .bind(metadata)
    .execute(&mut **tx)
    .await
    .map_err(sql_error)?;
    Ok(())
}

async fn insert_step_usage_link(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAppAgentRunStepCommand,
    run: &sqlx::postgres::PgRow,
    metadata: &str,
) -> DomainResult<()> {
    if !has_usage(
        command.input_tokens,
        command.output_tokens,
        command.cached_tokens,
        command.reasoning_tokens,
        command.total_tokens,
        command.cost_amount.as_deref(),
        command.currency.as_deref(),
        command.usage_fact_id,
        command.runtime_invocation_id.as_deref(),
    ) {
        return Ok(());
    }
    sqlx::query(
        r#"
        INSERT INTO ai_runtime_usage_link (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            agent_session_id,
            agent_run_id,
            agent_run_step_id,
            runtime_invocation_id,
            usage_fact_id,
            usage_type,
            model,
            request_id,
            trace_id,
            input_tokens,
            output_tokens,
            cached_tokens,
            reasoning_tokens,
            total_tokens,
            cost_amount,
            currency,
            occurred_at,
            metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'agent_step', $10, $11, $12, $13, $14, $15, $16, $17, $18::numeric, $19, $20::timestamp AT TIME ZONE 'UTC', $21::jsonb)
        "#,
    )
    .bind(&command.usage_link_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.user_id)
    .bind(optional_string_cell(run, "agent_session_id"))
    .bind(&command.run_id)
    .bind(&command.step_uuid)
    .bind(&command.runtime_invocation_id)
    .bind(command.usage_fact_id)
    .bind(
        command
            .model
            .clone()
            .or_else(|| optional_string_cell(run, "model"))
            .or_else(|| optional_string_cell(run, "planner_model")),
    )
    .bind(optional_string_cell(run, "request_id"))
    .bind(optional_string_cell(run, "trace_id"))
    .bind(command.input_tokens.unwrap_or_default())
    .bind(command.output_tokens.unwrap_or_default())
    .bind(command.cached_tokens.unwrap_or_default())
    .bind(command.reasoning_tokens.unwrap_or_default())
    .bind(command.total_tokens.unwrap_or_else(|| {
        command.input_tokens.unwrap_or_default()
            + command.output_tokens.unwrap_or_default()
            + command.cached_tokens.unwrap_or_default()
            + command.reasoning_tokens.unwrap_or_default()
    }))
    .bind(&command.cost_amount)
    .bind(&command.currency)
    .bind(&command.requested_at)
    .bind(metadata)
    .execute(&mut **tx)
    .await
    .map_err(sql_error)?;
    Ok(())
}

async fn insert_completed_step_usage_link(
    tx: &mut Transaction<'_, Postgres>,
    command: &CompleteAppAgentRunStepCommand,
    step: &sqlx::postgres::PgRow,
    run: &sqlx::postgres::PgRow,
    metadata: &str,
) -> DomainResult<()> {
    let runtime_invocation_id = optional_string_cell(step, "runtime_invocation_id");
    if !has_usage(
        command.input_tokens,
        command.output_tokens,
        command.cached_tokens,
        command.reasoning_tokens,
        command.total_tokens,
        command.cost_amount.as_deref(),
        command.currency.as_deref(),
        command.usage_fact_id,
        runtime_invocation_id.as_deref(),
    ) {
        return Ok(());
    }
    sqlx::query(
        r#"
        INSERT INTO ai_runtime_usage_link (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            agent_session_id,
            agent_run_id,
            agent_run_step_id,
            runtime_invocation_id,
            usage_fact_id,
            usage_type,
            model,
            request_id,
            trace_id,
            input_tokens,
            output_tokens,
            cached_tokens,
            reasoning_tokens,
            total_tokens,
            cost_amount,
            currency,
            occurred_at,
            metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'agent_step', $10, $11, $12, $13, $14, $15, $16, $17, $18::numeric, $19, $20::timestamp AT TIME ZONE 'UTC', $21::jsonb)
        ON CONFLICT (tenant_id, organization_id, user_id, agent_run_id, usage_type, agent_run_step_id_key) DO UPDATE SET
            runtime_invocation_id = COALESCE(excluded.runtime_invocation_id, ai_runtime_usage_link.runtime_invocation_id),
            usage_fact_id = COALESCE(excluded.usage_fact_id, ai_runtime_usage_link.usage_fact_id),
            model = COALESCE(excluded.model, ai_runtime_usage_link.model),
            request_id = COALESCE(excluded.request_id, ai_runtime_usage_link.request_id),
            trace_id = COALESCE(excluded.trace_id, ai_runtime_usage_link.trace_id),
            input_tokens = excluded.input_tokens,
            output_tokens = excluded.output_tokens,
            cached_tokens = excluded.cached_tokens,
            reasoning_tokens = excluded.reasoning_tokens,
            total_tokens = excluded.total_tokens,
            cost_amount = COALESCE(excluded.cost_amount, ai_runtime_usage_link.cost_amount),
            currency = COALESCE(excluded.currency, ai_runtime_usage_link.currency),
            occurred_at = excluded.occurred_at,
            metadata = excluded.metadata
        "#,
    )
    .bind(&command.usage_link_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.user_id)
    .bind(optional_string_cell(run, "agent_session_id"))
    .bind(&command.run_id)
    .bind(&command.step_id)
    .bind(&runtime_invocation_id)
    .bind(command.usage_fact_id)
    .bind(optional_string_cell(step, "model").or_else(|| optional_string_cell(run, "model")).or_else(|| optional_string_cell(run, "planner_model")))
    .bind(optional_string_cell(run, "request_id"))
    .bind(optional_string_cell(run, "trace_id"))
    .bind(command.input_tokens.unwrap_or_default())
    .bind(command.output_tokens.unwrap_or_default())
    .bind(command.cached_tokens.unwrap_or_default())
    .bind(command.reasoning_tokens.unwrap_or_default())
    .bind(command.total_tokens.unwrap_or_else(|| {
        command.input_tokens.unwrap_or_default()
            + command.output_tokens.unwrap_or_default()
            + command.cached_tokens.unwrap_or_default()
            + command.reasoning_tokens.unwrap_or_default()
    }))
    .bind(&command.cost_amount)
    .bind(&command.currency)
    .bind(&command.requested_at)
    .bind(metadata)
    .execute(&mut **tx)
    .await
    .map_err(sql_error)?;
    Ok(())
}

async fn load_session_row_by_code(
    pool: &PgPool,
    subject: AppAgentRunSubject,
    session_id: &str,
) -> DomainResult<Option<sqlx::postgres::PgRow>> {
    sqlx::query(session_select_sql())
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .bind(session_id)
        .fetch_optional(pool)
        .await
        .map_err(sql_error)
}

async fn load_session_row_by_code_in_tx(
    tx: &mut Transaction<'_, Postgres>,
    subject: AppAgentRunSubject,
    session_id: &str,
) -> DomainResult<Option<sqlx::postgres::PgRow>> {
    sqlx::query(session_select_sql())
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .bind(session_id)
        .fetch_optional(&mut **tx)
        .await
        .map_err(sql_error)
}

fn session_select_sql() -> &'static str {
    r#"
    SELECT
        id,
        uuid,
        agent_id,
        agent_version_id,
        session_code,
        memory_space_id,
        runtime,
        run_count,
        step_count,
        last_run_id,
        CAST(created_at AS TEXT) AS created_at_text,
        CAST(updated_at AS TEXT) AS updated_at_text
    FROM ai_agent_session
    WHERE tenant_id = $1
      AND organization_id = $2
      AND user_id = $3
      AND session_code = $4
      AND status <> 'deleted'
    "#
}

async fn load_run_row_by_uuid(
    pool: &PgPool,
    subject: AppAgentRunSubject,
    run_id: &str,
) -> DomainResult<Option<sqlx::postgres::PgRow>> {
    sqlx::query(run_select_sql())
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .bind(run_id)
        .fetch_optional(pool)
        .await
        .map_err(sql_error)
}

async fn load_run_row_by_uuid_in_tx(
    tx: &mut Transaction<'_, Postgres>,
    subject: AppAgentRunSubject,
    run_id: &str,
) -> DomainResult<Option<sqlx::postgres::PgRow>> {
    sqlx::query(run_select_sql())
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .bind(run_id)
        .fetch_optional(&mut **tx)
        .await
        .map_err(sql_error)
}

fn run_select_sql() -> &'static str {
    r#"
    SELECT
        id,
        uuid,
        tenant_id,
        organization_id,
        user_id,
        request_id,
        trace_id,
        status,
        CAST(created_at AS TEXT) AS created_at_text,
        metadata,
        agent_id,
        agent_version_id,
        agent_session_id,
        memory_space_id,
        runtime,
        model,
        run_uuid,
        run_status,
        source_surface,
        input_message,
        output_message,
        planner_model,
        execution_mode,
        CAST(started_at AS TEXT) AS started_at_text,
        CAST(completed_at AS TEXT) AS completed_at_text,
        CAST(cancelled_at AS TEXT) AS cancelled_at_text,
        CAST(failed_at AS TEXT) AS failed_at_text,
        error_message_masked,
        metering_status,
        usage_fact_id,
        total_steps,
        prompt_tokens,
        completion_tokens,
        cached_tokens,
        total_tokens,
        image_count,
        CAST(audio_seconds AS TEXT) AS audio_seconds_text,
        CAST(video_seconds AS TEXT) AS video_seconds_text
    FROM ai_agent_run
    WHERE tenant_id = $1
      AND organization_id = $2
      AND user_id = $3
      AND (run_uuid = $4 OR uuid = $4)
      AND status <> 'deleted'
    "#
}

async fn load_step_row_by_uuid(
    pool: &PgPool,
    subject: AppAgentRunSubject,
    step_id: &str,
    run_id: &str,
) -> DomainResult<Option<(sqlx::postgres::PgRow, sqlx::postgres::PgRow)>> {
    let step = sqlx::query(step_select_sql())
        .bind(step_id)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .bind(run_id)
        .fetch_optional(pool)
        .await
        .map_err(sql_error)?;
    let Some(step) = step else {
        return Ok(None);
    };
    let run = load_run_row_by_uuid(pool, subject, run_id)
        .await?
        .ok_or_else(|| DomainError::not_found("agent run was not found"))?;
    Ok(Some((step, run)))
}

async fn load_step_row_by_uuid_in_tx(
    tx: &mut Transaction<'_, Postgres>,
    subject: AppAgentRunSubject,
    step_id: &str,
    run_id: &str,
) -> DomainResult<Option<(sqlx::postgres::PgRow, sqlx::postgres::PgRow)>> {
    let step = sqlx::query(step_select_sql())
        .bind(step_id)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .bind(run_id)
        .fetch_optional(&mut **tx)
        .await
        .map_err(sql_error)?;
    let Some(step) = step else {
        return Ok(None);
    };
    let run = load_run_row_by_uuid_in_tx(tx, subject, run_id)
        .await?
        .ok_or_else(|| DomainError::not_found("agent run was not found"))?;
    Ok(Some((step, run)))
}

fn step_select_sql() -> &'static str {
    r#"
    SELECT
        s.id,
        s.uuid,
        s.tenant_id,
        s.organization_id,
        s.user_id,
        s.request_id,
        s.trace_id,
        s.status,
        CAST(s.created_at AS TEXT) AS created_at_text,
        s.metadata,
        s.run_id,
        s.agent_id,
        s.agent_version_id,
        s.step_index,
        s.step_type,
        s.step_status,
        s.title,
        s.tool_name,
        s.model,
        s.runtime_invocation_id,
        s.input_snapshot,
        s.output_snapshot,
        s.usage_json,
        CAST(s.started_at AS TEXT) AS started_at_text,
        CAST(s.completed_at AS TEXT) AS completed_at_text,
        s.latency_ms,
        s.prompt_tokens,
        s.completion_tokens,
        s.cached_tokens,
        s.total_tokens,
        CAST(s.audio_seconds AS TEXT) AS audio_seconds_text,
        CAST(s.video_seconds AS TEXT) AS video_seconds_text,
        s.usage_fact_id,
        r.run_uuid AS run_uuid
    FROM ai_agent_run_step s
    INNER JOIN ai_agent_run r
      ON r.id = s.run_id
     AND r.tenant_id = s.tenant_id
     AND r.organization_id = s.organization_id
     AND r.user_id = s.user_id
    WHERE s.uuid = $1
      AND s.tenant_id = $2
      AND s.organization_id = $3
      AND s.user_id = $4
      AND r.run_uuid = $5
      AND s.status <> 'deleted'
      AND r.status <> 'deleted'
    "#
}

fn validate_session_matches_run(
    session: &sqlx::postgres::PgRow,
    command: &CreateAppAgentRunCommand,
) -> DomainResult<()> {
    if id_string_cell(session, "agent_id") != command.agent_id {
        return Err(DomainError::conflict(
            "agent run agentId must match the agent session",
        ));
    }
    if let Some(version_id) = optional_id_string_cell(session, "agent_version_id") {
        if version_id != command.agent_version_id {
            return Err(DomainError::conflict(
                "agent run agentVersionId must match the agent session",
            ));
        }
    }
    if let Some(memory_space_id) = optional_string_cell(session, "memory_space_id") {
        if command
            .memory_space_id
            .as_deref()
            .filter(|value| !value.is_empty())
            .map(str::to_owned)
            .as_deref()
            != Some(memory_space_id.as_str())
        {
            return Err(DomainError::conflict(
                "agent run memorySpaceId must match the agent session",
            ));
        }
    }
    if let Some(runtime) = optional_string_cell(session, "runtime") {
        if command
            .runtime
            .as_deref()
            .filter(|value| !value.is_empty())
            .map(str::to_owned)
            .as_deref()
            != Some(runtime.as_str())
        {
            return Err(DomainError::conflict(
                "agent run runtime must match the agent session",
            ));
        }
    }
    Ok(())
}

fn row_to_run(row: sqlx::postgres::PgRow) -> DomainResult<AppAgentRunItem> {
    Ok(AppAgentRunItem {
        id: optional_string_cell(&row, "run_uuid").unwrap_or_else(|| string_cell(&row, "uuid")),
        session_id: optional_string_cell(&row, "agent_session_id"),
        agent_id: id_string_cell(&row, "agent_id"),
        agent_version_id: id_string_cell(&row, "agent_version_id"),
        request_id: string_cell(&row, "request_id"),
        trace_id: optional_string_cell(&row, "trace_id"),
        status: string_cell(&row, "run_status"),
        source_surface: string_cell(&row, "source_surface"),
        input_message: optional_string_cell(&row, "input_message"),
        output_message: optional_string_cell(&row, "output_message"),
        memory_space_id: optional_string_cell(&row, "memory_space_id"),
        runtime: optional_string_cell(&row, "runtime"),
        model: optional_string_cell(&row, "model")
            .or_else(|| optional_string_cell(&row, "planner_model")),
        execution_mode: string_cell(&row, "execution_mode"),
        started_at: optional_string_cell(&row, "started_at_text")
            .or_else(|| optional_string_cell(&row, "started_at")),
        completed_at: optional_string_cell(&row, "completed_at_text")
            .or_else(|| optional_string_cell(&row, "completed_at")),
        error_message_masked: optional_string_cell(&row, "error_message_masked"),
        total_steps: integer_cell(&row, "total_steps"),
        input_tokens: optional_integer_cell(&row, "prompt_tokens"),
        output_tokens: optional_integer_cell(&row, "completion_tokens"),
        cached_tokens: optional_integer_cell(&row, "cached_tokens"),
        total_tokens: optional_integer_cell(&row, "total_tokens"),
        created_at: optional_string_cell(&row, "created_at_text")
            .unwrap_or_else(|| string_cell(&row, "created_at")),
    })
}

fn row_to_step(row: sqlx::postgres::PgRow) -> DomainResult<AppAgentRunStepItem> {
    Ok(AppAgentRunStepItem {
        id: string_cell(&row, "uuid"),
        run_id: string_cell(&row, "run_uuid"),
        step_index: integer_cell(&row, "step_index"),
        step_type: step_type_string(integer_cell(&row, "step_type")),
        status: string_cell(&row, "step_status"),
        title: optional_string_cell(&row, "title"),
        model: optional_string_cell(&row, "model"),
        runtime_invocation_id: optional_string_cell(&row, "runtime_invocation_id"),
        tool_name: optional_string_cell(&row, "tool_name"),
        input_tokens: optional_integer_cell(&row, "prompt_tokens"),
        output_tokens: optional_integer_cell(&row, "completion_tokens"),
        cached_tokens: optional_integer_cell(&row, "cached_tokens"),
        total_tokens: optional_integer_cell(&row, "total_tokens"),
        started_at: optional_string_cell(&row, "started_at_text")
            .or_else(|| optional_string_cell(&row, "started_at")),
        completed_at: optional_string_cell(&row, "completed_at_text")
            .or_else(|| optional_string_cell(&row, "completed_at")),
        latency_ms: optional_integer_cell(&row, "latency_ms"),
        created_at: optional_string_cell(&row, "created_at_text")
            .unwrap_or_else(|| string_cell(&row, "created_at")),
    })
}

fn parse_positive_i64(value: &str, field: &str) -> DomainResult<i64> {
    value
        .parse::<i64>()
        .ok()
        .filter(|value| *value > 0)
        .ok_or_else(|| DomainError::new(format!("{field} must be a positive integer string")))
}

fn step_type_code(step_type: &str) -> i64 {
    match step_type {
        "input" => STEP_TYPE_INPUT,
        "model" => STEP_TYPE_MODEL,
        "tool" => STEP_TYPE_TOOL,
        "memory" => STEP_TYPE_MEMORY,
        "runtime" => STEP_TYPE_RUNTIME,
        "system" => STEP_TYPE_SYSTEM,
        _ => STEP_TYPE_CUSTOM,
    }
}

fn step_type_string(step_type: i64) -> String {
    match step_type {
        STEP_TYPE_INPUT => "input",
        STEP_TYPE_MODEL => "model",
        STEP_TYPE_TOOL => "tool",
        STEP_TYPE_MEMORY => "memory",
        STEP_TYPE_RUNTIME => "runtime",
        STEP_TYPE_SYSTEM => "system",
        _ => "custom",
    }
    .to_owned()
}

fn terminal_timestamp(status: &str, terminal: &str, requested_at: &str) -> Option<String> {
    (status == terminal).then(|| requested_at.to_owned())
}

fn terminal_timestamp_for_any_terminal(status: &str, requested_at: &str) -> Option<String> {
    matches!(status, "completed" | "failed" | "cancelled").then(|| requested_at.to_owned())
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

fn id_string_cell(row: &sqlx::postgres::PgRow, column: &str) -> String {
    optional_id_string_cell(row, column).unwrap_or_default()
}

fn optional_id_string_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<String> {
    optional_string_cell(row, column)
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
        .or_else(|| {
            row.try_get::<Option<i32>, _>(column)
                .ok()
                .flatten()
                .map(|value| value.to_string())
        })
        .or_else(|| {
            row.try_get::<i32, _>(column)
                .ok()
                .map(|value| value.to_string())
        })
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
        .or_else(|| {
            row.try_get::<Option<i32>, _>(column)
                .ok()
                .flatten()
                .map(i64::from)
        })
        .or_else(|| row.try_get::<i32, _>(column).ok().map(i64::from))
}

fn has_usage(
    input_tokens: Option<i64>,
    output_tokens: Option<i64>,
    cached_tokens: Option<i64>,
    reasoning_tokens: Option<i64>,
    total_tokens: Option<i64>,
    cost_amount: Option<&str>,
    currency: Option<&str>,
    usage_fact_id: Option<i64>,
    runtime_invocation_id: Option<&str>,
) -> bool {
    input_tokens.unwrap_or_default() > 0
        || output_tokens.unwrap_or_default() > 0
        || cached_tokens.unwrap_or_default() > 0
        || reasoning_tokens.unwrap_or_default() > 0
        || total_tokens.unwrap_or_default() > 0
        || cost_amount
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .is_some()
        || currency
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .is_some()
        || usage_fact_id.is_some()
        || runtime_invocation_id
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .is_some()
}

fn sql_error(error: sqlx::Error) -> DomainError {
    DomainError::new(format!("postgres app agent run store error: {error}"))
}
