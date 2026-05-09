use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAppPlaygroundHistoryReadStore;
use sdkwork_claw_product::ports::{AppPlaygroundHistoryReadStore, AppPlaygroundHistorySubject};
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::SqlitePool;

#[tokio::test]
async fn sqlite_playground_history_loads_visible_statuses_for_subject_without_sensitive_fields() {
    let pool = sqlite_pool().await;
    create_generation_tables(&pool).await;
    seed_mixed_history(&pool).await;

    let store = SqliteAppPlaygroundHistoryReadStore::new(pool);
    let items = store
        .load_playground_history(Some(owner_subject()))
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
        items[3].videos[0].url
    );
    assert_eq!(
        Some("https://cdn.example.test/video-102.jpg"),
        items[3].videos[0].thumb.as_deref()
    );
    assert_eq!("image", items[4].item_type);
    assert_eq!(
        vec!["https://cdn.example.test/image-101.png".to_owned()],
        items[4].images
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
            "playground history DTO must not expose internal field value: {internal_value}"
        );
    }
}

#[tokio::test]
async fn sqlite_playground_history_orders_newest_first_and_limits_to_100() {
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

    let store = SqliteAppPlaygroundHistoryReadStore::new(pool);
    let items = store
        .load_playground_history(Some(owner_subject()))
        .await
        .unwrap();

    assert_eq!(100, items.len());
    assert_eq!("105", items[0].id);
    assert_eq!("6", items[99].id);
}

#[tokio::test]
async fn sqlite_playground_history_skips_jobs_without_explicit_modality() {
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

    let store = SqliteAppPlaygroundHistoryReadStore::new(pool);
    let items = store
        .load_playground_history(Some(owner_subject()))
        .await
        .unwrap();

    assert!(
        items.is_empty(),
        "playground history must not infer a missing modality from job_type"
    );
}

async fn sqlite_pool() -> SqlitePool {
    SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap()
}

fn owner_subject() -> AppPlaygroundHistorySubject {
    AppPlaygroundHistorySubject {
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
            asset_url TEXT,
            thumbnail_url TEXT,
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
    asset_url: &str,
    thumbnail_url: &str,
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
            asset_url,
            thumbnail_url,
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
    .bind(asset_url)
    .bind(thumbnail_url)
    .bind(status)
    .bind(deleted_at)
    .bind(storage_key)
    .bind(payload_hash)
    .bind(trace_id)
    .execute(pool)
    .await
    .unwrap();
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
