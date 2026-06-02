use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAppGenerationHistoryReadStore;
use sdkwork_claw_product::ports::{AppGenerationHistoryReadStore, AppGenerationHistorySubject};
use serde_json::Value;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::SqlitePool;

#[tokio::test]
async fn sqlite_generation_history_loads_visible_statuses_for_subject_without_sensitive_fields() {
    let pool = sqlite_pool().await;
    create_generation_tables(&pool).await;
    seed_mixed_history(&pool).await;

    let store = SqliteAppGenerationHistoryReadStore::new(pool);
    let items = store
        .load_generation_history(Some(owner_subject()))
        .await
        .unwrap();

    let ids: Vec<&str> = items.iter().map(|item| item.id.as_str()).collect();
    assert_eq!(vec!["401", "301", "201", "102", "101"], ids);

    let statuses: Vec<&str> = items
        .iter()
        .map(|item| item.status.as_deref().unwrap())
        .collect();
    assert_eq!(
        vec!["pending", "cancelled", "failed", "processing", "completed"],
        statuses
    );

    assert_eq!("sfx", items[0].item_type);
    assert_eq!("2026-05-03", items[0].date);
    assert_eq!(
        "2026-05-03T10:30:00Z",
        items[0].created_at.as_deref().unwrap()
    );
    assert_eq!(
        "2026-05-03T10:30:00Z",
        items[0].updated_at.as_deref().unwrap()
    );
    assert_eq!("music", items[1].item_type);
    assert_eq!("audio", items[2].item_type);
    assert_eq!("video", items[3].item_type);
    assert_eq!("2026-05-03", items[3].date);
    assert_eq!(
        "2026-05-03T10:05:00Z",
        items[3].created_at.as_deref().unwrap()
    );
    assert_eq!(
        "2026-05-03T10:06:00Z",
        items[3].updated_at.as_deref().unwrap()
    );
    assert_eq!(
        "https://cdn.example.test/video-102.mp4",
        media_public_url(&items[3].videos[0])
    );
    assert_eq!(
        "https://cdn.example.test/video-102.jpg",
        media_public_url(&items[3].videos[0]["poster"])
    );
    assert_eq!("image", items[4].item_type);
    assert_eq!(
        "https://cdn.example.test/image-101.png",
        media_public_url(&items[4].images[0])
    );

    let payload = serde_json::to_string(&items).unwrap();
    for internal_value in [
        "storage://internal/image-101",
        "payload-hash-101",
        "trace-secret-201",
        "ip-hash-201",
        "ua-hash-201",
        "provider raw error",
    ] {
        assert!(
            !payload.contains(internal_value),
            "generation history DTO must not expose internal field value: {internal_value}"
        );
    }
}

#[tokio::test]
async fn sqlite_generation_history_orders_newest_first_and_limits_to_100() {
    let pool = sqlite_pool().await;
    create_generation_tables(&pool).await;
    for id in 1..=105_i64 {
        insert_job(
            &pool,
            id,
            10,
            20,
            30,
            &format!("2026-05-03 12:00:00.{id:03}"),
            None,
            "batch history item",
            2,
            0,
            "image-pro",
            1,
        )
        .await;
    }

    let store = SqliteAppGenerationHistoryReadStore::new(pool);
    let items = store
        .load_generation_history(Some(owner_subject()))
        .await
        .unwrap();

    assert_eq!(100, items.len());
    assert_eq!("105", items[0].id);
    assert_eq!("6", items[99].id);
}

#[tokio::test]
async fn sqlite_generation_history_skips_jobs_without_explicit_modality() {
    let pool = sqlite_pool().await;
    create_generation_tables(&pool).await;
    insert_job_without_modality(
        &pool,
        501,
        10,
        20,
        30,
        "2026-05-03 12:30:00",
        "missing modality must not be inferred from job type",
        2,
        "image-pro",
        1,
    )
    .await;

    let store = SqliteAppGenerationHistoryReadStore::new(pool);
    let items = store
        .load_generation_history(Some(owner_subject()))
        .await
        .unwrap();

    assert!(
        items.is_empty(),
        "generation history must not infer a missing modality from job_type"
    );
}

#[tokio::test]
async fn sqlite_generation_history_loads_standard_agent_runtime_playground_generation_runs() {
    let pool = sqlite_pool().await;
    create_generation_tables(&pool).await;
    seed_standard_agent_runtime_generation(&pool).await;

    let store = SqliteAppGenerationHistoryReadStore::new(pool);
    let items = store
        .load_generation_history(Some(owner_subject()))
        .await
        .unwrap();

    assert_eq!(1, items.len());
    let item = &items[0];
    assert_eq!("agent-run-1", item.id);
    assert_eq!("image", item.item_type);
    assert_eq!("Create launch image", item.prompt);
    assert_eq!("image-pro", item.model_info.as_deref().unwrap());
    assert_eq!("image-pro", item.model_catalog_key.as_deref().unwrap());
    assert_eq!("16:9", item.aspect_ratio.as_deref().unwrap());
    assert_eq!(5, item.duration_seconds.unwrap());
    assert_eq!("completed", item.status.as_deref().unwrap());
    assert_eq!(
        "Generated launch image text",
        item.output_text.as_deref().unwrap()
    );
    assert_eq!("2026-05-04", item.date);
    assert_eq!("2026-05-04T11:00:00Z", item.created_at.as_deref().unwrap());
    assert_eq!("2026-05-04T11:01:00Z", item.updated_at.as_deref().unwrap());
    assert_eq!(
        "https://cdn.example.test/runtime-image.png",
        media_public_url(&item.images[0])
    );
    assert_eq!(
        "https://cdn.example.test/runtime-image.png",
        media_public_url(item.asset.as_ref().unwrap())
    );
    assert_eq!(
        "image/png",
        item.asset.as_ref().unwrap()["mimeType"]
            .as_str()
            .expect("media resource mimeType must be preserved")
    );
    assert_eq!(
        "runtime/storage/hidden-image.png",
        item.asset.as_ref().unwrap()["objectKey"]
            .as_str()
            .expect("media resource objectKey must be preserved")
    );
    assert_eq!(
        5,
        item.asset.as_ref().unwrap()["durationSeconds"]
            .as_i64()
            .expect("media resource durationSeconds must be preserved")
    );

    let payload = serde_json::to_string(&items).unwrap();
    for internal_value in ["runtime-image-sha256", "agent-run-trace-secret"] {
        assert!(
            !payload.contains(internal_value),
            "generation history DTO must not expose standard runtime internal value: {internal_value}"
        );
    }
}

#[tokio::test]
async fn sqlite_generation_history_keeps_text_only_agent_runtime_output_as_text() {
    let pool = sqlite_pool().await;
    create_generation_tables(&pool).await;
    seed_text_only_agent_runtime_generation(&pool).await;

    let store = SqliteAppGenerationHistoryReadStore::new(pool);
    let items = store
        .load_generation_history(Some(owner_subject()))
        .await
        .unwrap();

    assert_eq!(1, items.len());
    let item = &items[0];
    assert_eq!("agent-run-text-1", item.id);
    assert_eq!("text", item.item_type);
    assert_eq!("Explain the launch plan", item.prompt);
    assert_eq!("llm-pro", item.model_info.as_deref().unwrap());
    assert_eq!("completed", item.status.as_deref().unwrap());
    assert_eq!("Text answer", item.output_text.as_deref().unwrap());
    assert!(item.images.is_empty());
    assert!(item.videos.is_empty());
    assert!(item.asset.is_none());
}

fn media_public_url(value: &Value) -> &str {
    value
        .get("publicUrl")
        .and_then(Value::as_str)
        .expect("media resource publicUrl")
}

async fn sqlite_pool() -> SqlitePool {
    SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap()
}

fn owner_subject() -> AppGenerationHistorySubject {
    AppGenerationHistorySubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    }
}

async fn create_generation_tables(pool: &SqlitePool) {
    for statement in [
        r#"
        CREATE TABLE ai_generation_asset (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            job_id INTEGER,
            created_at TEXT,
            updated_at TEXT,
            prompt_snapshot TEXT,
            asset_type INTEGER,
            model_snapshot TEXT,
            asset_media_resource_id TEXT,
            asset_object_blob_id INTEGER,
            asset_resource_snapshot TEXT,
            thumbnail_media_resource_id TEXT,
            thumbnail_object_blob_id INTEGER,
            thumbnail_resource_snapshot TEXT,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            storage_key TEXT,
            payload_hash TEXT,
            trace_id TEXT
        )
        "#,
        r#"
        CREATE TABLE ai_generation_job (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            created_at TEXT,
            completed_at TEXT,
            prompt TEXT,
            modality INTEGER,
            job_type INTEGER,
            model TEXT,
            status INTEGER NOT NULL,
            trace_id TEXT,
            client_ip_hash TEXT,
            user_agent_hash TEXT,
            provider_error TEXT
        )
        "#,
        r#"
        CREATE TABLE ai_agent_run (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            request_id TEXT NOT NULL,
            trace_id TEXT,
            status TEXT NOT NULL DEFAULT 'active',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            metadata TEXT NOT NULL DEFAULT '{}',
            agent_id INTEGER,
            agent_version_id INTEGER,
            agent_session_id TEXT,
            memory_space_id TEXT,
            runtime TEXT,
            model TEXT,
            run_uuid TEXT NOT NULL,
            run_status TEXT NOT NULL,
            source_surface TEXT,
            input_message TEXT,
            output_message TEXT,
            target_modality INTEGER,
            planner_model TEXT,
            execution_mode TEXT,
            started_at TEXT,
            completed_at TEXT,
            cancelled_at TEXT,
            failed_at TEXT,
            error_message_masked TEXT,
            metering_status INTEGER,
            usage_fact_id INTEGER,
            usage_json TEXT,
            total_steps INTEGER,
            prompt_tokens INTEGER,
            completion_tokens INTEGER,
            cached_tokens INTEGER,
            total_tokens INTEGER,
            image_count INTEGER,
            audio_seconds TEXT,
            video_seconds TEXT
        )
        "#,
        r#"
        CREATE TABLE ai_runtime_invocation (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            conversation_id TEXT,
            chat_turn_id TEXT,
            chat_item_id TEXT,
            agent_session_id TEXT,
            agent_run_id TEXT,
            agent_run_step_id TEXT,
            invocation_no INTEGER NOT NULL DEFAULT 1,
            invocation_type TEXT NOT NULL,
            runtime TEXT NOT NULL,
            endpoint TEXT,
            attempt_no INTEGER NOT NULL DEFAULT 1,
            status TEXT NOT NULL,
            request_id TEXT,
            trace_id TEXT,
            provider_response_id TEXT,
            provider_session_id TEXT,
            provider_conversation_id TEXT,
            provider_step_id TEXT,
            model TEXT,
            provider TEXT,
            tool_name TEXT,
            tool_call_id TEXT,
            cwd TEXT,
            sandbox_policy TEXT,
            approval_policy TEXT,
            permission_mode TEXT,
            streaming INTEGER NOT NULL DEFAULT 0,
            started_at TEXT,
            completed_at TEXT,
            latency_ms INTEGER,
            ttft_ms INTEGER,
            exit_code INTEGER,
            finish_reason TEXT,
            error_type TEXT,
            error_code TEXT,
            error_message_masked TEXT,
            request_json TEXT,
            response_json TEXT,
            usage_json TEXT,
            created_at TEXT NOT NULL,
            metadata TEXT NOT NULL DEFAULT '{}'
        )
        "#,
        r#"
        CREATE TABLE ai_runtime_artifact (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            conversation_id TEXT,
            chat_turn_id TEXT,
            message_id TEXT,
            chat_item_id TEXT,
            agent_session_id TEXT,
            agent_run_id TEXT,
            agent_run_step_id TEXT,
            runtime_invocation_id TEXT,
            artifact_type TEXT NOT NULL,
            name TEXT,
            mime_type TEXT,
            content_text TEXT,
            content_json TEXT,
            media_resource_id TEXT,
            object_blob_id INTEGER,
            resource_snapshot TEXT,
            sha256 TEXT,
            size_bytes INTEGER,
            created_at TEXT NOT NULL,
            metadata TEXT NOT NULL DEFAULT '{}'
        )
        "#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_mixed_history(pool: &SqlitePool) {
    insert_asset(
        pool,
        101,
        10,
        20,
        30,
        Some(1001),
        "2026-05-03 10:00:00",
        "2026-05-03 10:01:00",
        "commercial hero image",
        2,
        "image-pro",
        "https://cdn.example.test/image-101.png",
        "",
        1,
        None,
        "storage://internal/image-101",
        "payload-hash-101",
        "trace-secret-101",
    )
    .await;
    insert_asset(
        pool,
        102,
        10,
        20,
        30,
        Some(1002),
        "2026-05-03 10:05:00",
        "2026-05-03 10:06:00",
        "commercial launch video",
        3,
        "video-pro",
        "https://cdn.example.test/video-102.mp4",
        "https://cdn.example.test/video-102.jpg",
        2,
        None,
        "storage://internal/video-102",
        "payload-hash-102",
        "trace-secret-102",
    )
    .await;
    insert_job(
        pool,
        201,
        10,
        20,
        30,
        "2026-05-03 10:10:00",
        None,
        "voiceover failed",
        4,
        0,
        "audio-pro",
        3,
    )
    .await;
    insert_job(
        pool,
        301,
        10,
        20,
        30,
        "2026-05-03 10:20:00",
        None,
        "campaign music cancelled",
        5,
        0,
        "music-pro",
        4,
    )
    .await;
    insert_job(
        pool,
        401,
        10,
        20,
        30,
        "2026-05-03 10:30:00",
        None,
        "sfx pending",
        6,
        0,
        "sfx-pro",
        0,
    )
    .await;

    insert_asset(
        pool,
        901,
        99,
        20,
        30,
        None,
        "2026-05-03 11:00:00",
        "2026-05-03 11:00:00",
        "other tenant asset",
        2,
        "image-pro",
        "https://cdn.example.test/other-tenant.png",
        "",
        1,
        None,
        "storage://internal/other-tenant",
        "payload-hash-other-tenant",
        "trace-secret-other-tenant",
    )
    .await;
    insert_job(
        pool,
        902,
        10,
        20,
        31,
        "2026-05-03 11:10:00",
        None,
        "other user job",
        2,
        0,
        "image-pro",
        1,
    )
    .await;
    insert_asset(
        pool,
        903,
        10,
        20,
        30,
        None,
        "2026-05-03 11:20:00",
        "2026-05-03 11:20:00",
        "deleted asset",
        2,
        "image-pro",
        "https://cdn.example.test/deleted.png",
        "",
        1,
        Some("2026-05-03 11:21:00"),
        "storage://internal/deleted",
        "payload-hash-deleted",
        "trace-secret-deleted",
    )
    .await;
    insert_asset(
        pool,
        904,
        10,
        20,
        30,
        None,
        "2026-05-03 11:30:00",
        "2026-05-03 11:30:00",
        "unknown status asset",
        2,
        "image-pro",
        "https://cdn.example.test/unknown.png",
        "",
        99,
        None,
        "storage://internal/unknown",
        "payload-hash-unknown",
        "trace-secret-unknown",
    )
    .await;
    insert_job(
        pool,
        905,
        10,
        20,
        30,
        "2026-05-03 11:40:00",
        None,
        "unknown status job",
        2,
        0,
        "image-pro",
        99,
    )
    .await;
    insert_asset(
        pool,
        906,
        10,
        20,
        30,
        None,
        "2026-05-03 11:50:00",
        "2026-05-03 11:50:00",
        "unknown type asset",
        99,
        "unknown-pro",
        "https://cdn.example.test/unknown-type.bin",
        "",
        1,
        None,
        "storage://internal/unknown-type-asset",
        "payload-hash-unknown-type-asset",
        "trace-secret-unknown-type-asset",
    )
    .await;
    insert_job(
        pool,
        907,
        10,
        20,
        30,
        "2026-05-03 12:00:00",
        None,
        "unknown type job",
        99,
        0,
        "unknown-pro",
        1,
    )
    .await;
}

async fn seed_standard_agent_runtime_generation(pool: &SqlitePool) {
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
            runtime,
            model,
            run_uuid,
            run_status,
            source_surface,
            input_message,
            output_message,
            execution_mode,
            started_at,
            completed_at,
            total_steps
        )
        VALUES (
            'agent-run-1',
            10,
            20,
            30,
            'request-agent-run-1',
            'agent-run-trace-secret',
            'active',
            '2026-05-04 11:00:00',
            '{"completed":true}',
            101,
            201,
            'agent-session-1',
            'openai_compatible',
            'image-pro',
            'agent-run-1',
            'completed',
            'playground',
            'Create launch image',
            'Generated launch image text',
            'interactive',
            '2026-05-04 11:00:00',
            '2026-05-04 11:01:00',
            1
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO ai_runtime_invocation (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            agent_session_id,
            agent_run_id,
            invocation_type,
            runtime,
            endpoint,
            status,
            request_id,
            model,
            streaming,
            started_at,
            completed_at,
            request_json,
            response_json,
            created_at,
            metadata
        )
        VALUES (
            'runtime-invocation-1',
            10,
            20,
            30,
            'agent-session-1',
            'agent-run-1',
            'agent_run',
            'openai_compatible',
            'agent.stream',
            'completed',
            'request-agent-run-1',
            'image-pro',
            1,
            '2026-05-04 11:00:05',
            '2026-05-04 11:01:00',
            '{"targetType":"image","generationConfig":{"aspectRatio":"16:9"}}',
            '{"outputText":"Generated launch image text","media":[{"modality":"image","asset":{"kind":"image","source":"external_url","publicUrl":"https://cdn.example.test/runtime-image-response.png","url":"https://cdn.example.test/runtime-image-response.png","mimeType":"image/png","durationSeconds":9}}]}',
            '2026-05-04 11:00:05',
            '{"surface":"playground"}'
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO ai_runtime_artifact (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            agent_session_id,
            agent_run_id,
            runtime_invocation_id,
            artifact_type,
            name,
            mime_type,
            content_json,
            media_resource_id,
            object_blob_id,
            resource_snapshot,
            sha256,
            size_bytes,
            created_at,
            metadata
        )
        VALUES (
            'runtime-artifact-1',
            10,
            20,
            30,
            'agent-session-1',
            'agent-run-1',
            'runtime-invocation-1',
            'image',
            'runtime-image.png',
            'image/png',
            '{"modality":"image"}',
            'media-resource-runtime-image-1',
            445,
            '{"kind":"image","source":"external_url","publicUrl":"https://cdn.example.test/runtime-image.png","mimeType":"image/png","durationSeconds":5,"objectKey":"runtime/storage/hidden-image.png"}',
            'runtime-image-sha256',
            12345,
            '2026-05-04 11:00:50',
            '{"public":true}'
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
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
            runtime,
            model,
            run_uuid,
            run_status,
            source_surface,
            input_message,
            execution_mode,
            started_at,
            completed_at,
            total_steps
        )
        VALUES (
            'agent-run-other-user',
            10,
            20,
            31,
            'request-agent-run-other-user',
            'active',
            '2026-05-04 11:02:00',
            '{}',
            101,
            201,
            'openai_compatible',
            'image-pro',
            'agent-run-other-user',
            'completed',
            'playground',
            'Other user generation',
            'interactive',
            '2026-05-04 11:02:00',
            '2026-05-04 11:03:00',
            1
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
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
            runtime,
            model,
            run_uuid,
            run_status,
            source_surface,
            input_message,
            execution_mode,
            started_at,
            completed_at,
            total_steps
        )
        VALUES (
            'agent-run-chat-surface',
            10,
            20,
            30,
            'request-agent-run-chat-surface',
            'active',
            '2026-05-04 11:04:00',
            '{}',
            101,
            201,
            'openai_compatible',
            'image-pro',
            'agent-run-chat-surface',
            'completed',
            'chat',
            'Chat agent run must not appear',
            'interactive',
            '2026-05-04 11:04:00',
            '2026-05-04 11:05:00',
            1
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
}

async fn seed_text_only_agent_runtime_generation(pool: &SqlitePool) {
    sqlx::query(
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
            agent_session_id,
            runtime,
            model,
            run_uuid,
            run_status,
            source_surface,
            input_message,
            output_message,
            execution_mode,
            started_at,
            completed_at,
            total_steps
        )
        VALUES (
            'agent-run-text-1',
            10,
            20,
            30,
            'request-agent-run-text-1',
            'active',
            '2026-05-04 12:00:00',
            '{}',
            101,
            201,
            'agent-session-text-1',
            'openai_compatible',
            'llm-pro',
            'agent-run-text-1',
            'completed',
            'playground',
            'Explain the launch plan',
            '',
            'interactive',
            '2026-05-04 12:00:00',
            '2026-05-04 12:01:00',
            1
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO ai_runtime_invocation (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            agent_session_id,
            agent_run_id,
            invocation_type,
            runtime,
            endpoint,
            status,
            request_id,
            model,
            streaming,
            started_at,
            completed_at,
            request_json,
            response_json,
            created_at,
            metadata
        )
        VALUES (
            'runtime-invocation-text-1',
            10,
            20,
            30,
            'agent-session-text-1',
            'agent-run-text-1',
            'agent_run',
            'openai_compatible',
            'agent.stream',
            'completed',
            'request-agent-run-text-1',
            'llm-pro',
            1,
            '2026-05-04 12:00:05',
            '2026-05-04 12:01:00',
            '{"generationConfig":{"durationSeconds":5}}',
            '{"outputText":"Text answer"}',
            '2026-05-04 12:00:05',
            '{"surface":"playground"}'
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
}

async fn insert_asset(
    pool: &SqlitePool,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
    job_id: Option<i64>,
    created_at: &str,
    updated_at: &str,
    prompt_snapshot: &str,
    asset_type: i64,
    model_snapshot: &str,
    asset_locator: &str,
    thumbnail_locator: &str,
    status: i64,
    deleted_at: Option<&str>,
    storage_key: &str,
    payload_hash: &str,
    trace_id: &str,
) {
    sqlx::query(
        r#"
        INSERT INTO ai_generation_asset (
            id,
            tenant_id,
            organization_id,
            user_id,
            job_id,
            created_at,
            updated_at,
            prompt_snapshot,
            asset_type,
            model_snapshot,
            asset_resource_snapshot,
            thumbnail_resource_snapshot,
            status,
            deleted_at,
            storage_key,
            payload_hash,
            trace_id
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17)
        "#,
    )
    .bind(id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(user_id)
    .bind(job_id)
    .bind(created_at)
    .bind(updated_at)
    .bind(prompt_snapshot)
    .bind(asset_type)
    .bind(model_snapshot)
    .bind(media_resource_snapshot(asset_locator))
    .bind(media_resource_snapshot(thumbnail_locator))
    .bind(status)
    .bind(deleted_at)
    .bind(storage_key)
    .bind(payload_hash)
    .bind(trace_id)
    .execute(pool)
    .await
    .unwrap();
}

fn media_resource_snapshot(locator: &str) -> Option<String> {
    let locator = locator.trim();
    if locator.is_empty() {
        return None;
    }
    Some(
        serde_json::json!({
            "kind": "asset",
            "source": "external_url",
            "url": locator,
            "publicUrl": locator
        })
        .to_string(),
    )
}

async fn insert_job(
    pool: &SqlitePool,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
    created_at: &str,
    completed_at: Option<&str>,
    prompt: &str,
    modality: i64,
    job_type: i64,
    model: &str,
    status: i64,
) {
    sqlx::query(
        r#"
        INSERT INTO ai_generation_job (
            id,
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
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, 'trace-secret-201', 'ip-hash-201', 'ua-hash-201', 'provider raw error')
        "#,
    )
    .bind(id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(user_id)
    .bind(created_at)
    .bind(completed_at)
    .bind(prompt)
    .bind(modality)
    .bind(job_type)
    .bind(model)
    .bind(status)
    .execute(pool)
    .await
    .unwrap();
}

async fn insert_job_without_modality(
    pool: &SqlitePool,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
    created_at: &str,
    prompt: &str,
    job_type: i64,
    model: &str,
    status: i64,
) {
    sqlx::query(
        r#"
        INSERT INTO ai_generation_job (
            id,
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
        VALUES (?1, ?2, ?3, ?4, ?5, NULL, ?6, NULL, ?7, ?8, ?9, 'trace-secret-501', 'ip-hash-501', 'ua-hash-501', 'provider raw error')
        "#,
    )
    .bind(id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(user_id)
    .bind(created_at)
    .bind(prompt)
    .bind(job_type)
    .bind(model)
    .bind(status)
    .execute(pool)
    .await
    .unwrap();
}
