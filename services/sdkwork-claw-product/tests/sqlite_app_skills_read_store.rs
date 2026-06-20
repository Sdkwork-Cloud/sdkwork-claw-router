use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAppSkillsReadStore;
use sdkwork_claw_product::ports::{
    AppSkillsCommandStore, AppSkillsQuery, AppSkillsReadStore, AppSkillsSubject,
    EnableAppSkillCommand, SetAppSkillEnabledCommand, UpdateAppSkillConfigCommand,
};
use serde_json::json;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::{Row, SqlitePool};

#[tokio::test]
async fn sqlite_app_skills_reads_public_catalog_without_trusted_subject() {
    let pool = sqlite_pool().await;
    create_skill_tables(&pool).await;
    seed_skills(&pool).await;
    sqlx::query(
        r#"
        INSERT INTO c_category (
            id, tenant_id, organization_id, parent_id, category_type, name, description,
            code, tags, icon_media_resource_id, icon_object_blob_id,
            icon_resource_snapshot, sort_weight, path, visible, status
        )
        VALUES (3901, 0, 0, NULL, 'skill_market', 'Official', NULL, 'official', NULL, NULL, NULL, NULL, 1, '/official', 1, 1)
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();
    insert_skill(
        &pool,
        3902,
        0,
        0,
        0,
        "Public Skill",
        "System public skill",
        3901,
        701,
        "PUBLISHED",
        "PUBLIC",
        "APPROVED",
        1,
        "2026-05-04 08:00:00",
    )
    .await;

    let store = SqliteAppSkillsReadStore::new(pool);
    let items = store
        .load_skills(AppSkillsQuery::default(), None)
        .await
        .unwrap();

    assert!(
        items.iter().any(|item| item.id == "3902"),
        "anonymous users must be able to browse public skills"
    );
    let my_skills = store.load_user_skills(None).await.unwrap();
    assert!(my_skills.is_empty());
}

#[tokio::test]
async fn sqlite_app_skills_loads_public_approved_published_enabled_skills() {
    let pool = sqlite_pool().await;
    create_skill_tables(&pool).await;
    seed_skills(&pool).await;

    let store = SqliteAppSkillsReadStore::new(pool);
    let items = store
        .load_skills(AppSkillsQuery::default(), Some(owner_subject()))
        .await
        .unwrap();

    assert_eq!(1, items.len());
    let skill = &items[0];
    assert_eq!("201", skill.id);
    assert_eq!("Router Skill", skill.name);
    assert_eq!("SDKWork", skill.developer);
    assert_eq!("Routes requests with market policies", skill.description);
    assert_eq!("Routing", skill.category);
    assert_eq!("image", skill.image["kind"]);
    assert_eq!("external_url", skill.image["source"]);
    assert_eq!(
        "https://cdn.example.test/skills/router-cover.png",
        skill.image["publicUrl"]
    );
    assert_eq!(4.7, skill.rating);
    assert_eq!("1.5K", skill.downloads);
    assert_eq!(
        vec!["policy".to_owned(), "fallback".to_owned()],
        skill.features
    );
    assert_eq!("2026-05-02", skill.last_updated);
    assert_eq!("artifact://skills/router.wasm", skill.clawhub_image);
    assert_eq!("2.1.0", skill.version);
    assert_eq!("5 MB", skill.size);
    assert_eq!("Apache-2.0", skill.license);
    assert_eq!(vec!["wasm".to_owned(), "rust".to_owned()], skill.frameworks);
    assert_eq!(
        vec![serde_json::json!({
            "kind": "image",
            "source": "external_url",
            "url": "https://cdn.example.test/skills/router-screen.png",
            "publicUrl": "https://cdn.example.test/skills/router-screen.png"
        })],
        skill.screenshots
    );
    assert_eq!(1, skill.packages.len());
    assert_eq!("9101", skill.packages[0].id);
    assert_eq!("2.1.0", skill.packages[0].version);
    assert_eq!(
        "artifact://skills/router.wasm",
        skill.packages[0].artifact_ref
    );
    assert_eq!(5_242_880, skill.packages[0].artifact_size_bytes);
    assert_eq!("Apache-2.0", skill.packages[0].license_name);
    assert_eq!("2026-05-02", skill.packages[0].published_at);

    let payload = serde_json::to_string(&items).unwrap();
    for internal_value in [
        "internal-payload-hash",
        "internal-ip-hash",
        "internal-user-agent-hash",
        "raw-internal-metadata",
    ] {
        assert!(
            !payload.contains(internal_value),
            "skills hub DTO must not expose internal field value: {internal_value}"
        );
    }
}

#[tokio::test]
async fn sqlite_app_skills_filters_keyword_and_loads_detail_and_categories() {
    let pool = sqlite_pool().await;
    create_skill_tables(&pool).await;
    seed_skills(&pool).await;

    let store = SqliteAppSkillsReadStore::new(pool);
    let query = AppSkillsQuery {
        keyword: Some("market".to_owned()),
        page_no: Some(1),
        page_size: Some(10),
        ..AppSkillsQuery::default()
    };
    let items = store
        .load_skills(query, Some(owner_subject()))
        .await
        .unwrap();

    assert_eq!(1, items.len());
    assert_eq!("201", items[0].id);

    let detail = store
        .load_skill_by_id("201".to_owned(), Some(owner_subject()))
        .await
        .unwrap()
        .unwrap();
    assert_eq!("Router Skill", detail.name);

    let missing = store
        .load_skill_by_id("does-not-exist".to_owned(), Some(owner_subject()))
        .await
        .unwrap();
    assert!(missing.is_none());

    let categories = store.load_categories(Some(owner_subject())).await.unwrap();
    assert_eq!(vec!["Routing".to_owned()], categories);
}

#[tokio::test]
async fn sqlite_app_skills_enable_disable_and_configure_user_installation() {
    let pool = sqlite_pool().await;
    create_skill_tables(&pool).await;
    seed_skills(&pool).await;

    let store = SqliteAppSkillsReadStore::new(pool.clone());
    let enabled = store
        .enable_skill(EnableAppSkillCommand {
            subject: owner_subject(),
            skill_id: "router-skill".to_owned(),
            install_uuid: "install-uuid-1".to_owned(),
            config: Some(json!({ "mode": "strict" })),
            requested_at: "2026-05-09 10:00:00".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("201", enabled.skill_id);
    assert!(enabled.enabled);
    assert_eq!("strict", enabled.config["mode"]);
    assert_eq!("Router Skill", enabled.skill.name);

    let install_count: i64 = sqlx::query(
        r#"
        SELECT COUNT(*) AS total
        FROM ai_user_agent_skill
        WHERE tenant_id = 10
          AND organization_id = 20
          AND user_id = 30
          AND skill_id = 201
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap()
    .try_get("total")
    .unwrap();
    assert_eq!(1, install_count);

    let disabled = store
        .set_skill_enabled(SetAppSkillEnabledCommand {
            subject: owner_subject(),
            skill_id: "201".to_owned(),
            enabled: false,
            requested_at: "2026-05-09 10:10:00".to_owned(),
        })
        .await
        .unwrap();
    assert!(!disabled.enabled);

    let configured = store
        .update_skill_config(UpdateAppSkillConfigCommand {
            subject: owner_subject(),
            skill_id: "201".to_owned(),
            config: json!({ "mode": "balanced" }),
            requested_at: "2026-05-09 10:20:00".to_owned(),
        })
        .await
        .unwrap();
    assert!(!configured.enabled);
    assert_eq!("balanced", configured.config["mode"]);

    let my_skills = store.load_user_skills(Some(owner_subject())).await.unwrap();
    assert_eq!(1, my_skills.len());
    assert_eq!("201", my_skills[0].skill_id);
    assert_eq!("Router Skill", my_skills[0].skill.name);
    assert!(!my_skills[0].enabled);
    assert_eq!("balanced", my_skills[0].config["mode"]);
}

#[tokio::test]
async fn sqlite_app_skills_enable_merges_runtime_default_config_without_portal_metadata() {
    let pool = sqlite_pool().await;
    create_skill_tables(&pool).await;
    seed_skills(&pool).await;

    let store = SqliteAppSkillsReadStore::new(pool);
    let enabled_with_defaults = store
        .enable_skill(EnableAppSkillCommand {
            subject: owner_subject(),
            skill_id: "router-skill".to_owned(),
            install_uuid: "install-uuid-defaults".to_owned(),
            config: None,
            requested_at: "2026-05-09 11:00:00".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("balanced", enabled_with_defaults.config["mode"]);
    assert_eq!(3, enabled_with_defaults.config["limits"]["maxRetries"]);
    assert!(
        enabled_with_defaults.config.get("portal").is_none(),
        "installation config must not persist skill store presentation metadata"
    );

    let enabled_with_override = store
        .enable_skill(EnableAppSkillCommand {
            subject: owner_subject(),
            skill_id: "router-skill".to_owned(),
            install_uuid: "install-uuid-overrides".to_owned(),
            config: Some(json!({
                "mode": "strict",
                "portal": {
                    "features": ["client metadata must not persist"]
                },
                "limits": {
                    "timeoutSeconds": 45
                }
            })),
            requested_at: "2026-05-09 11:05:00".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("strict", enabled_with_override.config["mode"]);
    assert_eq!(3, enabled_with_override.config["limits"]["maxRetries"]);
    assert_eq!(45, enabled_with_override.config["limits"]["timeoutSeconds"]);
    assert!(enabled_with_override.config.get("portal").is_none());
}

async fn sqlite_pool() -> SqlitePool {
    SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap()
}

fn owner_subject() -> AppSkillsSubject {
    AppSkillsSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    }
}

async fn create_skill_tables(pool: &SqlitePool) {
    for statement in [
        r#"
        CREATE TABLE c_category (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            parent_id INTEGER,
            category_type TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            code TEXT,
            tags TEXT,
            icon_media_resource_id TEXT,
            icon_object_blob_id INTEGER,
            icon_resource_snapshot TEXT,
            sort_weight INTEGER,
            path TEXT,
            visible INTEGER,
            status INTEGER
        )
        "#,
        r#"
        CREATE TABLE ai_agent_skill_package (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            package_key TEXT,
            name TEXT,
            summary TEXT,
            description TEXT,
            icon_media_resource_id TEXT,
            icon_object_blob_id INTEGER,
            icon_resource_snapshot TEXT,
            cover_media_resource_id TEXT,
            cover_object_blob_id INTEGER,
            cover_resource_snapshot TEXT,
            category_id INTEGER,
            enabled INTEGER,
            featured INTEGER,
            sort_weight INTEGER,
            tags TEXT,
            latest_published_at TEXT
        )
        "#,
        r#"
        CREATE TABLE ai_agent_skill (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL UNIQUE,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            skill_key TEXT,
            name TEXT,
            summary TEXT,
            description TEXT,
            icon_media_resource_id TEXT,
            icon_object_blob_id INTEGER,
            icon_resource_snapshot TEXT,
            cover_media_resource_id TEXT,
            cover_object_blob_id INTEGER,
            cover_resource_snapshot TEXT,
            category_id INTEGER,
            package_id INTEGER,
            provider TEXT,
            version TEXT,
            version_name TEXT,
            runtime TEXT,
            entrypoint TEXT,
            manifest_url TEXT,
            repository_url TEXT,
            homepage_url TEXT,
            documentation_url TEXT,
            license_name TEXT,
            source_type TEXT,
            market_status TEXT,
            visibility TEXT,
            review_status TEXT,
            review_comment TEXT,
            reviewed_by INTEGER,
            reviewed_at TEXT,
            builtin INTEGER,
            is_builtin INTEGER,
            enabled INTEGER,
            featured INTEGER,
            recommend_weight INTEGER,
            price TEXT,
            currency TEXT,
            install_count INTEGER,
            rating_avg REAL,
            rating_count INTEGER,
            tags TEXT,
            capabilities TEXT,
            config_schema TEXT,
            default_config TEXT,
            latest_published_at TEXT,
            updated_at TEXT
        )
        "#,
        r#"
        CREATE TABLE ai_user_agent_skill (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL DEFAULT 0,
            user_id INTEGER NOT NULL,
            skill_id INTEGER NOT NULL,
            enabled INTEGER NOT NULL DEFAULT 1,
            config TEXT NOT NULL DEFAULT '{}',
            installed_at TEXT,
            last_enabled_at TEXT,
            last_used_at TEXT,
            used_count INTEGER NOT NULL DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(tenant_id, organization_id, user_id, skill_id)
        )
        "#,
        r#"
        CREATE TABLE ai_skill_action (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            target_type INTEGER NOT NULL,
            target_id INTEGER NOT NULL,
            release_id INTEGER,
            action_type TEXT,
            rating_score REAL,
            created_at TEXT,
            payload_hash TEXT,
            client_ip_hash TEXT,
            user_agent_hash TEXT,
            metadata TEXT
        )
        "#,
        r#"
        CREATE TABLE ai_skill_asset (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            target_type INTEGER NOT NULL,
            target_id INTEGER NOT NULL,
            artifact_id INTEGER,
            asset_type TEXT,
            asset_media_resource_id TEXT,
            asset_object_blob_id INTEGER,
            asset_resource_snapshot TEXT,
            thumbnail_media_resource_id TEXT,
            thumbnail_object_blob_id INTEGER,
            thumbnail_resource_snapshot TEXT,
            title TEXT,
            sort_order INTEGER,
            published_at TEXT,
            status INTEGER,
            deleted_at TEXT,
            metadata TEXT
        )
        "#,
        r#"
        CREATE TABLE ai_skill_artifact (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            target_type INTEGER NOT NULL,
            target_id INTEGER NOT NULL,
            artifact_type TEXT,
            platform_type TEXT,
            os_name TEXT,
            version TEXT,
            artifact_ref TEXT,
            artifact_media_resource_id TEXT,
            artifact_object_blob_id INTEGER,
            artifact_resource_snapshot TEXT,
            artifact_size_bytes INTEGER,
            runtime TEXT,
            frameworks TEXT,
            license_name TEXT,
            release_notes TEXT,
            published_at TEXT,
            status INTEGER,
            deleted_at TEXT,
            metadata TEXT
        )
        "#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_skills(pool: &SqlitePool) {
    sqlx::query(
        r#"
        INSERT INTO c_category (
            id, tenant_id, organization_id, parent_id, category_type, name, description,
            code, tags, icon_media_resource_id, icon_object_blob_id,
            icon_resource_snapshot, sort_weight, path, visible, status
        )
        VALUES (301, 10, 20, NULL, 'skill_market', 'Routing', NULL, 'routing', NULL, NULL, NULL, NULL, 10, '/routing', 1, 1)
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        INSERT INTO ai_agent_skill_package (
            id, tenant_id, organization_id, user_id, package_key, name, summary,
            description, icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot,
            cover_media_resource_id, cover_object_blob_id, cover_resource_snapshot,
            category_id, enabled, featured,
            sort_weight, tags, latest_published_at
        )
        VALUES (
            701, 10, 20, 30, 'router-package', 'Router Package', 'Routes',
            'Package context',
            'test-skill-package-icon-701', NULL,
            '{"kind":"image","source":"external_url","url":"https://cdn.example.test/skills/pkg.png","publicUrl":"https://cdn.example.test/skills/pkg.png"}',
            'test-skill-package-cover-701', NULL,
            '{"kind":"image","source":"external_url","url":"https://cdn.example.test/skills/pkg-cover.png","publicUrl":"https://cdn.example.test/skills/pkg-cover.png"}',
            301, 1, 1,
            10, '["wasm","rust"]', '2026-05-02 07:00:00'
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    insert_skill(
        pool,
        201,
        10,
        20,
        30,
        "Router Skill",
        "Routes requests with market policies",
        301,
        701,
        "PUBLISHED",
        "PUBLIC",
        "APPROVED",
        1,
        "2026-05-02 08:00:00",
    )
    .await;
    insert_skill(
        pool,
        202,
        10,
        20,
        30,
        "Draft Skill",
        "Must not be exposed",
        301,
        701,
        "DRAFT",
        "PUBLIC",
        "APPROVED",
        1,
        "2026-05-03 08:00:00",
    )
    .await;
    insert_skill(
        pool,
        203,
        10,
        20,
        30,
        "Private Skill",
        "Must not be exposed",
        301,
        701,
        "PUBLISHED",
        "PRIVATE",
        "APPROVED",
        1,
        "2026-05-03 08:00:00",
    )
    .await;
    insert_skill(
        pool,
        204,
        10,
        20,
        30,
        "Rejected Skill",
        "Must not be exposed",
        301,
        701,
        "PUBLISHED",
        "PUBLIC",
        "REJECTED",
        1,
        "2026-05-03 08:00:00",
    )
    .await;
    insert_skill(
        pool,
        205,
        10,
        20,
        30,
        "Disabled Skill",
        "Must not be exposed",
        301,
        701,
        "PUBLISHED",
        "PUBLIC",
        "APPROVED",
        0,
        "2026-05-03 08:00:00",
    )
    .await;
    insert_skill(
        pool,
        206,
        99,
        20,
        30,
        "Other Tenant Skill",
        "Must not cross tenant boundary",
        301,
        701,
        "PUBLISHED",
        "PUBLIC",
        "APPROVED",
        1,
        "2026-05-03 08:00:00",
    )
    .await;
    insert_skill_asset(pool).await;
    insert_skill_artifact(pool).await;
    insert_action(pool, 201, "install", None).await;
    insert_action(pool, 201, "install", None).await;
    insert_action(pool, 201, "rating", Some(4.0)).await;
    insert_action(pool, 201, "rating", Some(5.4)).await;
}

async fn insert_skill(
    pool: &SqlitePool,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
    name: &str,
    description: &str,
    category_id: i64,
    package_id: i64,
    market_status: &str,
    visibility: &str,
    review_status: &str,
    enabled: i64,
    latest_published_at: &str,
) {
    sqlx::query(
        r#"
        INSERT INTO ai_agent_skill (
            id, uuid, tenant_id, organization_id, user_id, skill_key, name, summary,
            description, icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot,
            cover_media_resource_id, cover_object_blob_id, cover_resource_snapshot,
            category_id, package_id, provider,
            version, version_name, runtime, entrypoint, manifest_url, repository_url,
            homepage_url, documentation_url, license_name, source_type, market_status,
            visibility, review_status, review_comment, reviewed_by, reviewed_at,
            builtin, is_builtin, enabled, featured, recommend_weight, price, currency,
            install_count, rating_avg, rating_count, tags, capabilities, config_schema,
            default_config, latest_published_at, updated_at
        )
        VALUES (
            ?1, ?2, ?3, ?4, ?5, 'router-skill', ?6, 'Routes',
            ?7,
            ?8, NULL,
            '{"kind":"image","source":"external_url","url":"https://cdn.example.test/skills/router.png","publicUrl":"https://cdn.example.test/skills/router.png"}',
            ?8, NULL,
            '{"kind":"image","source":"external_url","url":"https://cdn.example.test/skills/router-cover.png","publicUrl":"https://cdn.example.test/skills/router-cover.png"}',
            ?9, ?10, 'SDKWork',
            '2.1.0', '2.1.0', 'wasm', 'router:start',
            'https://cdn.example.test/skills/router-manifest.json',
            NULL, NULL, NULL, 'Apache-2.0', 'COMMUNITY', ?11,
            ?12, ?13, NULL, NULL, NULL,
            0, 0, ?14, 1, 10, '0', 'USD',
            1500, 4.7, 10, '["wasm","rust"]', '["policy","fallback"]', NULL,
            '{"mode":"balanced","limits":{"maxRetries":3,"timeoutSeconds":30},"portal":{"features":["hidden metadata"]}}',
            ?15,
            '2026-05-01 08:00:00'
        )
        "#,
    )
    .bind(id)
    .bind(format!("skill-uuid-{id}"))
    .bind(tenant_id)
    .bind(organization_id)
    .bind(user_id)
    .bind(name)
    .bind(description)
    .bind(format!("test-skill-cover-{id}"))
    .bind(category_id)
    .bind(package_id)
    .bind(market_status)
    .bind(visibility)
    .bind(review_status)
    .bind(enabled)
    .bind(latest_published_at)
    .execute(pool)
    .await
    .unwrap();
}

async fn insert_skill_asset(pool: &SqlitePool) {
    sqlx::query(
        r#"
        INSERT INTO ai_skill_asset (
            id, tenant_id, organization_id, target_type, target_id, artifact_id,
            asset_type, asset_media_resource_id, asset_object_blob_id, asset_resource_snapshot,
            thumbnail_media_resource_id, thumbnail_object_blob_id, thumbnail_resource_snapshot,
            title, sort_order, published_at,
            status, deleted_at, metadata
        )
        VALUES (
            801, 10, 20, 35, 201, NULL, 'screenshot',
            'test-skill-asset-801', NULL,
            '{"kind":"image","source":"external_url","url":"https://cdn.example.test/skills/router-screen.png","publicUrl":"https://cdn.example.test/skills/router-screen.png"}',
            NULL, NULL, NULL, NULL, 1, '2026-05-02 09:00:00',
            1, NULL, 'raw-internal-metadata'
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
}

async fn insert_skill_artifact(pool: &SqlitePool) {
    sqlx::query(
        r#"
        INSERT INTO ai_skill_artifact (
            id, tenant_id, organization_id, target_type, target_id, artifact_type,
            platform_type, os_name, version, artifact_ref, artifact_media_resource_id,
            artifact_object_blob_id, artifact_resource_snapshot,
            artifact_size_bytes, runtime, frameworks, license_name, release_notes,
            published_at, status, deleted_at, metadata
        )
        VALUES (
            9101, 10, 20, 35, 201, 'skill-package',
            'wasm', 'any', '2.1.0', 'artifact://skills/router.wasm',
            'media-resource-router-wasm', 91001,
            '{"kind":"binary","source":"external_url","url":"https://cdn.example.test/skills/router.wasm","publicUrl":"https://cdn.example.test/skills/router.wasm","objectBlobId":91001}',
            5242880, 'wasm',
            '["wasm","rust"]', 'Apache-2.0', 'Initial market release',
            '2026-05-02 08:00:00', 1, NULL, 'raw-internal-metadata'
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
}

async fn insert_action(
    pool: &SqlitePool,
    target_id: i64,
    action_type: &str,
    rating_score: Option<f64>,
) {
    sqlx::query(
        r#"
        INSERT INTO ai_skill_action (
            tenant_id, organization_id, user_id, target_type, target_id, release_id,
            action_type, rating_score, created_at, payload_hash, client_ip_hash,
            user_agent_hash, metadata
        )
        VALUES (
            10, 20, 30, 35, ?1, NULL,
            ?2, ?3, '2026-05-02 12:00:00', 'internal-payload-hash',
            'internal-ip-hash', 'internal-user-agent-hash', 'raw-internal-metadata'
        )
        "#,
    )
    .bind(target_id)
    .bind(action_type)
    .bind(rating_score)
    .execute(pool)
    .await
    .unwrap();
}
