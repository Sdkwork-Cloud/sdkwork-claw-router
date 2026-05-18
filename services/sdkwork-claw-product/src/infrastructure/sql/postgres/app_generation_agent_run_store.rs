use std::collections::HashSet;

use sqlx::{PgPool, Postgres, Row, Transaction};

use crate::domain::DomainResult;
use crate::infrastructure::sql::app_generation_agent_runtime::{
    agent_snapshot, catalog_key, config_hash, default_agent_metadata,
    default_agent_version_metadata, history_date, input_snapshot_json, input_step, metadata_json,
    model_policy_json, modality_code, run_metadata_json, run_snapshot, runtime_policy_json,
    step_metadata_json, store_error, timestamp_to_iso8601, usage_fact_metadata_json,
    usage_summary, usage_uuid, BILLING_METER_LLM_INPUT_TOKEN, DEFAULT_AGENT_DESCRIPTION,
    DEFAULT_AGENT_ID, DEFAULT_AGENT_NAME, DEFAULT_AGENT_SYSTEM_PROMPT, DEFAULT_AGENT_VERSION_ID,
    EXECUTION_MODE_GENERATION, SOURCE_SURFACE_APP,
};
use crate::ports::{
    AppAgentUsageSummary, AppGenerationAgentRunCommand, AppGenerationAgentRunFuture,
    AppGenerationAgentRunOutcome, AppGenerationAgentRunStore, AppGenerationHistoryItem,
};

const STATUS_PENDING: i32 = 0;
const STATUS_ACTIVE: i64 = 1;
const JOB_TYPE_AGENT: i32 = 1;
const VISIBILITY_PRIVATE: i64 = 1;
const RELEASE_STATUS_DRAFT: i64 = 1;
const OWNER_TYPE_USER: i64 = 1;
const RUN_STATUS_QUEUED: i64 = 1;
const STEP_TYPE_INPUT: i64 = 1;
const STEP_STATUS_SUCCEEDED: i64 = 3;
const USAGE_TYPE_TOKEN: i64 = 1;
const SETTLEMENT_PENDING: i64 = 0;
const METERING_RECORDED: i64 = 1;

#[derive(Debug, Clone)]
pub struct PostgresAppGenerationAgentRunStore {
    pool: PgPool,
}

impl PostgresAppGenerationAgentRunStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl AppGenerationAgentRunStore for PostgresAppGenerationAgentRunStore {
    fn create_agent_run<'a>(
        &'a self,
        command: AppGenerationAgentRunCommand,
    ) -> AppGenerationAgentRunFuture<'a, AppGenerationAgentRunOutcome> {
        Box::pin(async move { create_agent_run(&self.pool, command).await })
    }
}

async fn create_agent_run(
    pool: &PgPool,
    command: AppGenerationAgentRunCommand,
) -> DomainResult<AppGenerationAgentRunOutcome> {
    let modality_code = modality_code(&command.target_type)?;
    let metadata = metadata_json(&command)?;
    let model = command.selected_model.clone().unwrap_or_default();
    let has_generated_schema = has_column(pool, "ai_generation_job", "uuid").await?;
    let has_usage_fact_id = has_column(pool, "ai_generation_job", "usage_fact_id").await?;
    let has_agent_runtime_schema = has_agent_runtime_schema(pool).await?;

    let mut tx = pool
        .begin()
        .await
        .map_err(|error| store_error("failed to begin generation agent run transaction", error))?;

    let job_id: i64 = if has_generated_schema {
        sqlx::query_scalar(
            r#"
            INSERT INTO ai_generation_job (
                uuid,
                tenant_id,
                organization_id,
                user_id,
                request_id,
                status,
                created_at,
                metadata,
                job_type,
                modality,
                model,
                prompt,
                parameter_snapshot,
                progress_percent
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7::timestamp AT TIME ZONE 'UTC',
                $8::jsonb,
                $9,
                $10,
                $11,
                $12,
                $13::jsonb,
                0
            )
            RETURNING id
            "#,
        )
        .bind(&command.run_uuid)
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(command.subject.user_id)
        .bind(&command.request_id)
        .bind(STATUS_PENDING)
        .bind(&command.requested_at)
        .bind(&metadata)
        .bind(JOB_TYPE_AGENT)
        .bind(modality_code)
        .bind(&model)
        .bind(&command.prompt)
        .bind(&metadata)
        .fetch_one(&mut *tx)
        .await
        .map_err(|error| store_error("failed to create generation agent run", error))?
    } else {
        sqlx::query_scalar(
            r#"
            INSERT INTO ai_generation_job (
                tenant_id,
                organization_id,
                user_id,
                created_at,
                completed_at,
                prompt,
                modality,
                job_type,
                model,
                status,
                trace_id,
                client_ip_hash,
                user_agent_hash,
                provider_error
            )
            VALUES ($1, $2, $3, $4::timestamp AT TIME ZONE 'UTC', NULL, $5, $6, $7, $8, $9, $10, '', '', '')
            RETURNING id
            "#,
        )
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(command.subject.user_id)
        .bind(&command.requested_at)
        .bind(&command.prompt)
        .bind(modality_code)
        .bind(JOB_TYPE_AGENT)
        .bind(&model)
        .bind(STATUS_PENDING)
        .bind(&command.request_id)
        .fetch_one(&mut *tx)
        .await
        .map_err(|error| store_error("failed to create generation agent run", error))?
    };

    let run_id = job_id.to_string();
    let selected_model = command.selected_model.clone();
    let usage = usage_summary(&run_id, &command);
    let metering_events = usage.events.clone();
    if has_agent_runtime_schema {
        let usage_fact_id =
            persist_agent_runtime(&mut tx, job_id, modality_code, &model, &command, &usage).await?;
        if has_usage_fact_id {
            sqlx::query(
                r#"
                UPDATE ai_generation_job
                SET usage_fact_id = $1
                WHERE id = $2
                "#,
            )
            .bind(usage_fact_id)
            .bind(job_id)
            .execute(&mut *tx)
            .await
            .map_err(|error| {
                store_error(
                    "failed to attach generation agent usage fact to generation job",
                    error,
                )
            })?;
        }
    }
    tx.commit()
        .await
        .map_err(|error| store_error("failed to commit generation agent run transaction", error))?;

    let item = AppGenerationHistoryItem {
        id: job_id.to_string(),
        date: history_date(&command.requested_at),
        prompt: command.prompt,
        item_type: command.target_type.clone(),
        model_info: command.selected_model,
        url: None,
        images: Vec::new(),
        videos: Vec::new(),
        status: Some("pending".to_owned()),
        created_at: Some(timestamp_to_iso8601(&command.requested_at)),
        updated_at: Some(timestamp_to_iso8601(&command.requested_at)),
    };

    Ok(AppGenerationAgentRunOutcome {
        agent: agent_snapshot(selected_model),
        item,
        metering_events,
        run: run_snapshot(&run_id, &command.request_id),
        steps: vec![input_step(&run_id)],
        target_type: command.target_type,
        status: "pending".to_owned(),
        usage,
    })
}

async fn persist_agent_runtime(
    tx: &mut Transaction<'_, Postgres>,
    job_id: i64,
    modality_code: i32,
    model: &str,
    command: &AppGenerationAgentRunCommand,
    usage: &AppAgentUsageSummary,
) -> DomainResult<i64> {
    let agent_id = upsert_default_agent(tx, command).await?;
    let version_id = upsert_default_agent_version(tx, agent_id, model, command).await?;
    attach_default_agent_version(tx, agent_id, version_id, command).await?;
    let usage_fact_id =
        upsert_usage_fact(tx, job_id, modality_code, model, command, usage).await?;
    let agent_run_id = upsert_agent_run(
        tx,
        agent_id,
        version_id,
        usage_fact_id,
        modality_code,
        model,
        command,
        usage,
    )
    .await?;
    upsert_agent_run_step(
        tx,
        agent_run_id,
        agent_id,
        version_id,
        usage_fact_id,
        model,
        command,
        usage,
    )
    .await?;
    Ok(usage_fact_id)
}

async fn upsert_default_agent(
    tx: &mut Transaction<'_, Postgres>,
    command: &AppGenerationAgentRunCommand,
) -> DomainResult<i64> {
    sqlx::query_scalar(
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
        VALUES ($1, $2, $3, 1, $4, $5::timestamp AT TIME ZONE 'UTC', $5::timestamp AT TIME ZONE 'UTC', 0, $6::jsonb, $7, $8, $9, $10, $11, 1)
        ON CONFLICT (tenant_id, organization_id, agent_code) DO UPDATE SET
            owner_user_id = excluded.owner_user_id,
            name = excluded.name,
            description = excluded.description,
            visibility = excluded.visibility,
            status = excluded.status,
            updated_at = excluded.updated_at,
            metadata = excluded.metadata
        RETURNING id
        "#,
    )
    .bind(DEFAULT_AGENT_ID)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(STATUS_ACTIVE)
    .bind(&command.requested_at)
    .bind(default_agent_metadata()?)
    .bind(command.subject.user_id)
    .bind(DEFAULT_AGENT_ID)
    .bind(DEFAULT_AGENT_NAME)
    .bind(DEFAULT_AGENT_DESCRIPTION)
    .bind(VISIBILITY_PRIVATE)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to upsert default generation agent", error))
}

async fn upsert_default_agent_version(
    tx: &mut Transaction<'_, Postgres>,
    agent_id: i64,
    model: &str,
    command: &AppGenerationAgentRunCommand,
) -> DomainResult<i64> {
    let model_policy = model_policy_json(model)?;
    let runtime_policy = runtime_policy_json(&command.target_type)?;
    let config_hash = config_hash(&[&model_policy, &runtime_policy]);
    sqlx::query_scalar(
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
        VALUES ($1, $2, $3, 1, $4, $5::timestamp AT TIME ZONE 'UTC', $5::timestamp AT TIME ZONE 'UTC', 0, $6::jsonb, $7, 1, $8, $9, $10::jsonb, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, $11::jsonb, $12)
        ON CONFLICT (tenant_id, organization_id, agent_id, version_no) DO UPDATE SET
            status = excluded.status,
            updated_at = excluded.updated_at,
            release_status = excluded.release_status,
            system_prompt = excluded.system_prompt,
            model_policy = excluded.model_policy,
            runtime_policy = excluded.runtime_policy,
            config_hash = excluded.config_hash
        RETURNING id
        "#,
    )
    .bind(DEFAULT_AGENT_VERSION_ID)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(STATUS_ACTIVE)
    .bind(&command.requested_at)
    .bind(default_agent_version_metadata()?)
    .bind(agent_id)
    .bind(RELEASE_STATUS_DRAFT)
    .bind(DEFAULT_AGENT_SYSTEM_PROMPT)
    .bind(&model_policy)
    .bind(&runtime_policy)
    .bind(config_hash)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to upsert default generation agent version", error))
}

async fn attach_default_agent_version(
    tx: &mut Transaction<'_, Postgres>,
    agent_id: i64,
    version_id: i64,
    command: &AppGenerationAgentRunCommand,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE ai_agent
        SET default_version_id = $1,
            updated_at = $2::timestamp AT TIME ZONE 'UTC',
            version = version + 1
        WHERE id = $3
        "#,
    )
    .bind(version_id)
    .bind(&command.requested_at)
    .bind(agent_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to attach default generation agent version", error))?;
    Ok(())
}

async fn upsert_usage_fact(
    tx: &mut Transaction<'_, Postgres>,
    job_id: i64,
    modality_code: i32,
    model: &str,
    command: &AppGenerationAgentRunCommand,
    usage: &AppAgentUsageSummary,
) -> DomainResult<i64> {
    let usage_metadata = usage_fact_metadata_json(&job_id.to_string(), command)?;
    let catalog_key = catalog_key(model, &command.target_type);
    sqlx::query_scalar(
        r#"
        INSERT INTO ai_usage_fact (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            request_id,
            status,
            created_at,
            metadata,
            owner_type,
            owner_id,
            catalog_key,
            model,
            modality,
            usage_type,
            billing_meter_code,
            billable_quantity,
            prompt_tokens,
            completion_tokens,
            cached_tokens,
            total_tokens,
            request_count,
            image_count,
            video_seconds,
            occurred_at,
            settlement_status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7::timestamp AT TIME ZONE 'UTC', $8::jsonb, $9, $10, $11, $12, $13, $14, $15, $16::numeric, $17, $18, $19, $20, 1, $21, $22::numeric, $23::timestamp AT TIME ZONE 'UTC', $24)
        ON CONFLICT (tenant_id, organization_id, request_id, usage_type) DO UPDATE SET
            user_id = excluded.user_id,
            status = excluded.status,
            metadata = excluded.metadata,
            owner_type = excluded.owner_type,
            owner_id = excluded.owner_id,
            catalog_key = excluded.catalog_key,
            model = excluded.model,
            modality = excluded.modality,
            billing_meter_code = excluded.billing_meter_code,
            billable_quantity = excluded.billable_quantity,
            prompt_tokens = excluded.prompt_tokens,
            completion_tokens = excluded.completion_tokens,
            cached_tokens = excluded.cached_tokens,
            total_tokens = excluded.total_tokens,
            request_count = excluded.request_count,
            image_count = excluded.image_count,
            video_seconds = excluded.video_seconds,
            occurred_at = excluded.occurred_at,
            settlement_status = excluded.settlement_status
        RETURNING id
        "#,
    )
    .bind(usage_uuid(&command.run_uuid))
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.user_id)
    .bind(&command.request_id)
    .bind(STATUS_ACTIVE)
    .bind(&command.requested_at)
    .bind(usage_metadata)
    .bind(OWNER_TYPE_USER)
    .bind(command.subject.user_id)
    .bind(catalog_key)
    .bind(model)
    .bind(i64::from(modality_code))
    .bind(USAGE_TYPE_TOKEN)
    .bind(BILLING_METER_LLM_INPUT_TOKEN)
    .bind(usage.prompt_tokens.to_string())
    .bind(usage.prompt_tokens)
    .bind(usage.completion_tokens)
    .bind(usage.cached_tokens)
    .bind(usage.total_tokens)
    .bind(usage.image_count)
    .bind(&usage.video_seconds)
    .bind(&command.requested_at)
    .bind(SETTLEMENT_PENDING)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to upsert generation agent usage fact", error))
}

#[allow(clippy::too_many_arguments)]
async fn upsert_agent_run(
    tx: &mut Transaction<'_, Postgres>,
    agent_id: i64,
    version_id: i64,
    usage_fact_id: i64,
    modality_code: i32,
    model: &str,
    command: &AppGenerationAgentRunCommand,
    usage: &AppAgentUsageSummary,
) -> DomainResult<i64> {
    let run_metadata = run_metadata_json(usage_fact_id, command)?;
    sqlx::query_scalar(
        r#"
        INSERT INTO ai_agent_run (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            request_id,
            status,
            created_at,
            metadata,
            agent_id,
            agent_version_id,
            run_uuid,
            run_status,
            source_surface,
            input_message,
            target_modality,
            planner_model,
            execution_mode,
            started_at,
            metering_status,
            usage_fact_id,
            total_steps,
            prompt_tokens,
            completion_tokens,
            cached_tokens,
            total_tokens,
            image_count,
            video_seconds
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7::timestamp AT TIME ZONE 'UTC', $8::jsonb, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18::timestamp AT TIME ZONE 'UTC', $19, $20, 1, $21, $22, $23, $24, $25, $26::numeric)
        ON CONFLICT (tenant_id, organization_id, request_id) DO UPDATE SET
            user_id = excluded.user_id,
            status = excluded.status,
            metadata = excluded.metadata,
            agent_id = excluded.agent_id,
            agent_version_id = excluded.agent_version_id,
            run_uuid = excluded.run_uuid,
            run_status = excluded.run_status,
            source_surface = excluded.source_surface,
            input_message = excluded.input_message,
            target_modality = excluded.target_modality,
            planner_model = excluded.planner_model,
            execution_mode = excluded.execution_mode,
            started_at = excluded.started_at,
            metering_status = excluded.metering_status,
            usage_fact_id = excluded.usage_fact_id,
            total_steps = excluded.total_steps,
            prompt_tokens = excluded.prompt_tokens,
            completion_tokens = excluded.completion_tokens,
            cached_tokens = excluded.cached_tokens,
            total_tokens = excluded.total_tokens,
            image_count = excluded.image_count,
            video_seconds = excluded.video_seconds
        RETURNING id
        "#,
    )
    .bind(&command.run_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.user_id)
    .bind(&command.request_id)
    .bind(STATUS_ACTIVE)
    .bind(&command.requested_at)
    .bind(run_metadata)
    .bind(agent_id)
    .bind(version_id)
    .bind(&command.run_uuid)
    .bind(RUN_STATUS_QUEUED)
    .bind(SOURCE_SURFACE_APP)
    .bind(&command.prompt)
    .bind(i64::from(modality_code))
    .bind(model)
    .bind(EXECUTION_MODE_GENERATION)
    .bind(&command.requested_at)
    .bind(METERING_RECORDED)
    .bind(usage_fact_id)
    .bind(usage.prompt_tokens)
    .bind(usage.completion_tokens)
    .bind(usage.cached_tokens)
    .bind(usage.total_tokens)
    .bind(usage.image_count)
    .bind(&usage.video_seconds)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to upsert generation agent run", error))
}

#[allow(clippy::too_many_arguments)]
async fn upsert_agent_run_step(
    tx: &mut Transaction<'_, Postgres>,
    agent_run_id: i64,
    agent_id: i64,
    version_id: i64,
    usage_fact_id: i64,
    model: &str,
    command: &AppGenerationAgentRunCommand,
    usage: &AppAgentUsageSummary,
) -> DomainResult<()> {
    let input_snapshot = input_snapshot_json(command)?;
    let step_metadata = step_metadata_json(usage_fact_id, command)?;
    sqlx::query(
        r#"
        INSERT INTO ai_agent_run_step (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            request_id,
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
            model,
            input_snapshot,
            started_at,
            completed_at,
            prompt_tokens,
            completion_tokens,
            cached_tokens,
            total_tokens,
            image_count,
            video_seconds,
            usage_fact_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7::timestamp AT TIME ZONE 'UTC', $8::jsonb, $9, $10, $11, 0, $12, $13, $14, $15, $16::jsonb, $17::timestamp AT TIME ZONE 'UTC', $17::timestamp AT TIME ZONE 'UTC', $18, $19, $20, $21, $22, $23::numeric, $24)
        ON CONFLICT (tenant_id, organization_id, run_id, step_index) DO UPDATE SET
            user_id = excluded.user_id,
            request_id = excluded.request_id,
            status = excluded.status,
            metadata = excluded.metadata,
            agent_id = excluded.agent_id,
            agent_version_id = excluded.agent_version_id,
            step_type = excluded.step_type,
            step_status = excluded.step_status,
            title = excluded.title,
            model = excluded.model,
            input_snapshot = excluded.input_snapshot,
            completed_at = excluded.completed_at,
            prompt_tokens = excluded.prompt_tokens,
            completion_tokens = excluded.completion_tokens,
            cached_tokens = excluded.cached_tokens,
            total_tokens = excluded.total_tokens,
            image_count = excluded.image_count,
            video_seconds = excluded.video_seconds,
            usage_fact_id = excluded.usage_fact_id
        "#,
    )
    .bind(format!("{}-step-input", command.run_uuid))
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.user_id)
    .bind(&command.request_id)
    .bind(STATUS_ACTIVE)
    .bind(&command.requested_at)
    .bind(step_metadata)
    .bind(agent_run_id)
    .bind(agent_id)
    .bind(version_id)
    .bind(STEP_TYPE_INPUT)
    .bind(STEP_STATUS_SUCCEEDED)
    .bind("User input accepted")
    .bind(model)
    .bind(input_snapshot)
    .bind(&command.requested_at)
    .bind(usage.prompt_tokens)
    .bind(usage.completion_tokens)
    .bind(usage.cached_tokens)
    .bind(usage.total_tokens)
    .bind(usage.image_count)
    .bind(&usage.video_seconds)
    .bind(usage_fact_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to upsert generation agent run step", error))?;
    Ok(())
}

async fn has_agent_runtime_schema(pool: &PgPool) -> DomainResult<bool> {
    for (table, columns) in [
        (
            "ai_agent",
            &[
                "uuid",
                "tenant_id",
                "organization_id",
                "status",
                "created_at",
                "updated_at",
                "version",
                "metadata",
                "owner_user_id",
                "agent_code",
                "name",
                "description",
                "visibility",
                "default_version_id",
                "governance_status",
            ][..],
        ),
        (
            "ai_agent_version",
            &[
                "uuid",
                "tenant_id",
                "organization_id",
                "status",
                "created_at",
                "updated_at",
                "version",
                "metadata",
                "agent_id",
                "version_no",
                "release_status",
                "system_prompt",
                "model_policy",
                "tool_policy",
                "memory_policy",
                "mcp_policy",
                "skill_policy",
                "runtime_policy",
                "config_hash",
            ][..],
        ),
        (
            "ai_usage_fact",
            &[
                "uuid",
                "tenant_id",
                "organization_id",
                "user_id",
                "request_id",
                "status",
                "created_at",
                "metadata",
                "owner_type",
                "owner_id",
                "catalog_key",
                "model",
                "modality",
                "usage_type",
                "billing_meter_code",
                "billable_quantity",
                "prompt_tokens",
                "completion_tokens",
                "cached_tokens",
                "total_tokens",
                "request_count",
                "image_count",
                "video_seconds",
                "occurred_at",
                "settlement_status",
            ][..],
        ),
        (
            "ai_agent_run",
            &[
                "uuid",
                "tenant_id",
                "organization_id",
                "user_id",
                "request_id",
                "status",
                "created_at",
                "metadata",
                "agent_id",
                "agent_version_id",
                "run_uuid",
                "run_status",
                "source_surface",
                "input_message",
                "target_modality",
                "planner_model",
                "execution_mode",
                "started_at",
                "metering_status",
                "usage_fact_id",
                "total_steps",
                "prompt_tokens",
                "completion_tokens",
                "cached_tokens",
                "total_tokens",
                "image_count",
                "video_seconds",
            ][..],
        ),
        (
            "ai_agent_run_step",
            &[
                "uuid",
                "tenant_id",
                "organization_id",
                "user_id",
                "request_id",
                "status",
                "created_at",
                "metadata",
                "run_id",
                "agent_id",
                "agent_version_id",
                "step_index",
                "step_type",
                "step_status",
                "title",
                "model",
                "input_snapshot",
                "started_at",
                "completed_at",
                "prompt_tokens",
                "completion_tokens",
                "cached_tokens",
                "total_tokens",
                "image_count",
                "video_seconds",
                "usage_fact_id",
            ][..],
        ),
    ] {
        if !has_columns(pool, table, columns).await? {
            return Ok(false);
        }
    }
    Ok(true)
}

async fn has_column(pool: &PgPool, table: &str, column: &str) -> DomainResult<bool> {
    has_columns(pool, table, &[column]).await
}

async fn has_columns(pool: &PgPool, table: &str, columns: &[&str]) -> DomainResult<bool> {
    let rows = sqlx::query(
        r#"
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = $1
        "#,
    )
    .bind(table)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to inspect generation job schema", error))?;
    if rows.is_empty() {
        return Ok(false);
    }
    let available = rows
        .iter()
        .filter_map(|row| row.try_get::<String, _>("column_name").ok())
        .map(|name| name.to_ascii_lowercase())
        .collect::<HashSet<_>>();
    Ok(columns
        .iter()
        .all(|column| available.contains(&column.to_ascii_lowercase())))
}
