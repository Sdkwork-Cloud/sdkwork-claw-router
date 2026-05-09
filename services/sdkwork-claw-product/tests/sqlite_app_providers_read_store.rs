use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAppProvidersReadStore;
use sdkwork_claw_product::ports::{AppProvidersReadStore, AppProvidersSubject};
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::SqlitePool;

#[tokio::test]
async fn sqlite_app_providers_loads_provider_family_and_canonical_integration_type() {
    let pool = sqlite_pool().await;
    create_provider_tables(&pool).await;
    seed_providers(&pool).await;

    let store = SqliteAppProvidersReadStore::new(pool);
    let items = store.load_providers(Some(owner_subject())).await.unwrap();

    assert_eq!(2, items.len());

    let azure = items
        .iter()
        .find(|item| item.id == "1")
        .expect("azure provider should be returned");
    assert_eq!("codex", azure.provider_family);
    assert_eq!("cloud_platform", azure.integration_type);
    assert_eq!("active", azure.status);

    let relay = items
        .iter()
        .find(|item| item.id == "2")
        .expect("relay provider should be returned");
    assert_eq!("opencode", relay.provider_family);
    assert_eq!("relay_aggregator", relay.integration_type);
    assert_eq!("active", relay.status);
}

#[tokio::test]
async fn sqlite_app_providers_counts_rfc3339_effective_channel_models_as_active() {
    let pool = sqlite_pool().await;
    create_provider_tables(&pool).await;
    seed_provider_with_type(&pool, 2).await;
    sqlx::query(
        r#"
        UPDATE integration_channel_model
        SET effective_from = strftime('%Y-%m-%dT00:00:00Z', 'now')
        WHERE id = 3001
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let store = SqliteAppProvidersReadStore::new(pool);
    let items = store.load_providers(Some(owner_subject())).await.unwrap();

    assert_eq!(1, items.len());
    assert_eq!("active", items[0].status);
}

#[tokio::test]
async fn sqlite_app_providers_rejects_unknown_integration_type_code() {
    let pool = sqlite_pool().await;
    create_provider_tables(&pool).await;
    seed_provider_with_type(&pool, 99).await;

    let store = SqliteAppProvidersReadStore::new(pool);
    let error = store
        .load_providers(Some(owner_subject()))
        .await
        .unwrap_err();

    assert!(
        error
            .to_string()
            .contains("invalid provider integration_type from database row: 99"),
        "unexpected error: {error}"
    );
}

async fn sqlite_pool() -> SqlitePool {
    SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap()
}

fn owner_subject() -> AppProvidersSubject {
    AppProvidersSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    }
}

async fn create_provider_tables(pool: &SqlitePool) {
    for statement in [
        r#"
        CREATE TABLE ops_config_snapshot (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            source_table TEXT NOT NULL,
            status INTEGER NOT NULL,
            created_at TEXT
        )
        "#,
        r#"
        CREATE TABLE integration_provider (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            provider_code TEXT NOT NULL,
            default_vendor_code TEXT,
            integration_type INTEGER,
            display_name TEXT,
            description TEXT,
            base_url_template TEXT,
            status INTEGER NOT NULL,
            sort_order INTEGER,
            deleted_at TEXT
        )
        "#,
        r#"
        CREATE TABLE integration_provider_account (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            provider_code TEXT NOT NULL,
            status INTEGER NOT NULL,
            deleted_at TEXT
        )
        "#,
        r#"
        CREATE TABLE integration_proxy (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            endpoint TEXT,
            status INTEGER NOT NULL,
            health_status INTEGER NOT NULL,
            deleted_at TEXT
        )
        "#,
        r#"
        CREATE TABLE integration_channel (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            provider_id INTEGER,
            provider_code TEXT NOT NULL,
            account_id INTEGER,
            proxy_id INTEGER,
            base_url_override TEXT,
            status INTEGER NOT NULL,
            health_status INTEGER NOT NULL,
            priority INTEGER NOT NULL,
            weight INTEGER NOT NULL,
            deleted_at TEXT
        )
        "#,
        r#"
        CREATE TABLE integration_channel_model (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            channel_id INTEGER NOT NULL,
            model TEXT NOT NULL,
            status INTEGER NOT NULL,
            effective_from TEXT,
            effective_to TEXT,
            deleted_at TEXT
        )
        "#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_providers(pool: &SqlitePool) {
    for integration_type in [2, 3] {
        seed_provider_with_type(pool, integration_type).await;
    }
}

async fn seed_provider_with_type(pool: &SqlitePool, integration_type: i64) {
    let (id, code, vendor, name, url, sort_order) = if integration_type == 2 {
        (
            1,
            "azure_openai",
            "openai",
            "Azure OpenAI",
            "https://azure.example.test/openai",
            1,
        )
    } else {
        (
            2,
            "openrouter",
            "openai",
            "OpenRouter",
            "https://relay.example.test/openrouter",
            2,
        )
    };

    sqlx::query(
        r#"
        INSERT INTO integration_provider (
            id, tenant_id, organization_id, provider_code, default_vendor_code, integration_type,
            display_name, description, base_url_template, status, sort_order
        )
        VALUES (?, 10, 20, ?, ?, ?, ?, 'Provider integration', ?, 1, ?)
        "#,
    )
    .bind(id)
    .bind(code)
    .bind(vendor)
    .bind(integration_type)
    .bind(name)
    .bind(url)
    .bind(sort_order)
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO integration_provider_account (
            id, tenant_id, organization_id, provider_code, status
        )
        VALUES (?, 10, 20, ?, 1)
        "#,
    )
    .bind(9000 + id)
    .bind(code)
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO integration_channel (
            id, tenant_id, organization_id, provider_id, provider_code, account_id,
            base_url_override, status, health_status, priority, weight
        )
        VALUES (?, 10, 20, ?, ?, ?, ?, 1, 1, 10, 100)
        "#,
    )
    .bind(2000 + id)
    .bind(id)
    .bind(code)
    .bind(9000 + id)
    .bind(url)
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO integration_channel_model (
            id, tenant_id, organization_id, channel_id, model, status
        )
        VALUES (?, 10, 20, ?, 'gpt-4o-mini', 1)
        "#,
    )
    .bind(3000 + id)
    .bind(2000 + id)
    .execute(pool)
    .await
    .unwrap();
}
