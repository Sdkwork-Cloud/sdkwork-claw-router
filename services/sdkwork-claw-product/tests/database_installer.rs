use sdkwork_claw_product::infrastructure::sql::installer::{
    CatalogRefreshOptions, DatabaseInstallOptions, DatabaseInstaller, InstallationStatus,
};
use sdkwork_claw_product::infrastructure::sql::sqlite::{
    SqliteAppSkillsReadStore, SqliteForumStore, SqlitePricingCatalogLoader,
};
use sdkwork_claw_product::ports::{
    AppSkillsQuery, AppSkillsReadStore, AppSkillsSubject, ForumFeedQuery, ForumFeedReadStore,
    PricingCatalog,
};
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::{Row, SqlitePool};
use std::collections::BTreeSet;
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

const SCHEMA_VERSION: &str = "2026.05.08.1";
const CATALOG_VERSION: &str = "2026.05.08.1";

static CATALOG_ROOT_COUNTER: AtomicU64 = AtomicU64::new(0);

#[tokio::test]
async fn sqlite_installer_installs_schema_and_sdkwork_models_catalog_once() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    assert_eq!(
        InstallationStatus::NotInstalled,
        installer.status().await.unwrap()
    );

    let installed = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, installed.status);
    assert_eq!(CATALOG_VERSION, installed.catalog_version);

    let state = sqlx::query(
        r#"
        SELECT schema_version, catalog_version, environment, seed_profile, status
        FROM system_installation_state
        WHERE id = 1
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(SCHEMA_VERSION, state.get::<String, _>("schema_version"));
    assert_eq!(CATALOG_VERSION, state.get::<String, _>("catalog_version"));
    assert_eq!("test", state.get::<String, _>("environment"));
    assert_eq!("commercial", state.get::<String, _>("seed_profile"));
    assert_eq!("installed", state.get::<String, _>("status"));

    assert_table_exists(&pool, "ai_model").await;
    assert_table_exists(&pool, "ai_model_vendor").await;
    assert_table_exists(&pool, "ai_billing_meter").await;
    assert_table_exists(&pool, "ai_model_pricing").await;
    assert_table_exists(&pool, "ai_usage_fact").await;
    assert_table_exists(&pool, "ai_model_rank_snapshot").await;
    assert_table_exists(&pool, "ops_job_execution").await;
    assert_table_exists(&pool, "ai_request_trace").await;
    assert_table_exists(&pool, "plus_app").await;
    assert_table_exists(&pool, "plus_category").await;
    assert_table_exists(&pool, "plus_agent_skill_package").await;
    assert_table_exists(&pool, "plus_agent_skill").await;
    assert_table_exists(&pool, "plus_user_agent_skill").await;
    assert_table_exists(&pool, "plus_feeds").await;
    assert_table_exists(&pool, "plus_comments").await;
    assert_table_exists(&pool, "plus_content_vote").await;
    assert_table_exists(&pool, "plus_favorite").await;
    assert_sqlite_index_exists(&pool, "idx_ai_model_public_rank_desc").await;
    assert_sqlite_index_exists(&pool, "idx_ai_model_catalog_search").await;
    assert_sqlite_index_exists(&pool, "idx_ai_model_rank_snapshot_latest_scope").await;
    assert_sqlite_index_exists(&pool, "idx_ai_model_rank_snapshot_filter_rank").await;
    assert_sqlite_index_exists(&pool, "idx_ops_job_execution_model_ranking_scope_started").await;
    assert_sqlite_index_exists(&pool, "idx_app_user_id").await;
    assert_sqlite_index_exists(&pool, "idx_app_project_id").await;
    assert_sqlite_index_exists(&pool, "idx_app_status").await;
    assert_sqlite_index_exists(&pool, "idx_category_type_shop").await;
    assert_sqlite_index_exists(&pool, "uk_plus_agent_skill_key").await;
    assert_sqlite_index_exists(&pool, "idx_plus_agent_skill_market").await;
    assert_sqlite_index_exists(&pool, "uk_plus_user_agent_skill").await;
    assert_sqlite_columns_exist(
        &pool,
        "ai_usage_fact",
        &[
            "tenant_id",
            "organization_id",
            "catalog_key",
            "occurred_at",
            "cost_amount",
            "currency",
            "pricing_snapshot",
        ],
    )
    .await;
    assert_sqlite_columns_exist(
        &pool,
        "ai_model_rank_snapshot",
        &[
            "tenant_id",
            "organization_id",
            "snapshot_date",
            "snapshot_period",
            "rank_scope",
            "catalog_key",
            "region_code",
            "metadata",
            "rank_payload",
        ],
    )
    .await;
    assert_sqlite_columns_exist(
        &pool,
        "ops_job_execution",
        &[
            "tenant_id",
            "organization_id",
            "status",
            "job_name",
            "job_type",
            "trigger_type",
            "started_at",
            "ended_at",
            "payload",
        ],
    )
    .await;
    assert_sqlite_columns_exist(
        &pool,
        "plus_app",
        &[
            "tenant_id",
            "organization_id",
            "user_id",
            "name",
            "icon",
            "resource_list",
            "project_id",
            "description",
            "version",
            "icon_url",
            "access_url",
            "config",
            "status",
            "app_type",
            "platforms",
            "install_platforms",
            "install_skill",
            "install_config",
            "release_notes",
            "package_name",
            "bundle_id",
            "store_url",
            "download_url",
        ],
    )
    .await;
    assert_sqlite_index_columns(
        &pool,
        "idx_ai_usage_fact_model_occurred",
        false,
        &[
            "tenant_id",
            "organization_id",
            "catalog_key",
            "occurred_at",
            "id",
        ],
    )
    .await;
    assert_sqlite_index_columns(
        &pool,
        "uk_ai_model_rank_snapshot_scope_catalog_key",
        true,
        &[
            "tenant_id",
            "organization_id",
            "snapshot_date",
            "snapshot_period",
            "rank_scope",
            "catalog_key",
        ],
    )
    .await;
    assert_sqlite_index_columns(
        &pool,
        "idx_ai_model_rank_snapshot_latest_scope",
        false,
        &[
            "tenant_id",
            "organization_id",
            "status",
            "rank_scope",
            "snapshot_date",
            "snapshot_period",
            "rank_no",
        ],
    )
    .await;
    assert_sqlite_index_columns(
        &pool,
        "idx_ai_model_rank_snapshot_filter_rank",
        false,
        &[
            "tenant_id",
            "organization_id",
            "status",
            "snapshot_date",
            "snapshot_period",
            "rank_scope",
            "vendor_code",
            "region_code",
            "modality",
            "rank_no",
        ],
    )
    .await;
    assert_sqlite_index_columns(
        &pool,
        "idx_ops_job_execution_model_ranking_scope_started",
        false,
        &[
            "tenant_id",
            "organization_id",
            "status",
            "job_type",
            "job_name",
            "started_at",
            "id",
        ],
    )
    .await;

    let catalog = bundled_catalog();
    assert_catalog_rows(&pool, &catalog).await;
    assert_app_store_seed_rows(&pool).await;
    assert_skill_store_seed_rows(&pool).await;
    assert_skill_store_seed_visible_to_app_tenants(&pool).await;
    assert_forum_tutorial_seed_rows(&pool).await;
    assert_pricing_snapshot_contains_catalog_models(&pool, &catalog).await;

    let migration_count: i64 = sqlx::query_scalar("SELECT COUNT(1) FROM system_schema_migration")
        .fetch_one(&pool)
        .await
        .unwrap();
    assert!(
        migration_count >= 2,
        "installer must record schema and catalog migrations"
    );

    let installed_again = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, installed_again.status);
    assert!(!installed_again.changed);

    let model_count_again: i64 = sqlx::query_scalar("SELECT COUNT(1) FROM ai_model")
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(catalog_keys(&catalog).len() as i64, model_count_again);
}

#[tokio::test]
async fn sqlite_installer_keeps_regional_vendor_models_as_distinct_catalog_rows() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();

    let rows = sqlx::query(
        r#"
        SELECT model, catalog_key, vendor_code, region_code
        FROM ai_model
        WHERE model = 'MiniMax-M2.7'
          AND status = 1
        ORDER BY region_code
        "#,
    )
    .fetch_all(&pool)
    .await
    .unwrap();

    assert_eq!(
        2,
        rows.len(),
        "same upstream model id must not be collapsed across regional MiniMax vendors"
    );
    assert_eq!("minimax", rows[0].get::<String, _>("vendor_code"));
    assert_eq!(
        "minimax/cn/MiniMax-M2.7",
        rows[0].get::<String, _>("catalog_key")
    );
    assert_eq!("cn", rows[0].get::<String, _>("region_code"));
    assert_eq!("minimax", rows[1].get::<String, _>("vendor_code"));
    assert_eq!(
        "minimax/global/MiniMax-M2.7",
        rows[1].get::<String, _>("catalog_key")
    );
    assert_eq!("global", rows[1].get::<String, _>("region_code"));

    let currencies = sqlx::query(
        r#"
        SELECT catalog_key, currency
        FROM ai_model_pricing
        WHERE model = 'MiniMax-M2.7'
          AND billing_meter_code = 'llm_input_token'
          AND price_side = 1
          AND status = 1
        ORDER BY catalog_key
        "#,
    )
    .fetch_all(&pool)
    .await
    .unwrap()
    .into_iter()
    .map(|row| {
        (
            row.get::<String, _>("catalog_key"),
            row.get::<String, _>("currency"),
        )
    })
    .collect::<Vec<_>>();

    assert_eq!(
        vec![
            ("minimax/cn/MiniMax-M2.7".to_owned(), "CNY".to_owned()),
            ("minimax/global/MiniMax-M2.7".to_owned(), "USD".to_owned()),
        ],
        currencies,
        "regional MiniMax prices must preserve each vendor's billing currency"
    );
}

#[tokio::test]
async fn sqlite_installer_upgrades_existing_installation_when_versions_change() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query(
        r#"
        UPDATE system_installation_state
        SET schema_version = '2026.05.06.1',
            catalog_version = '2026.05.06.1'
        WHERE id = 1
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap()
    );

    let upgraded = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, upgraded.status);
    assert!(upgraded.changed);
    assert_eq!(CATALOG_VERSION, upgraded.catalog_version);

    let state = sqlx::query(
        r#"
        SELECT schema_version, catalog_version, status
        FROM system_installation_state
        WHERE id = 1
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(SCHEMA_VERSION, state.get::<String, _>("schema_version"));
    assert_eq!(CATALOG_VERSION, state.get::<String, _>("catalog_version"));
    assert_eq!("installed", state.get::<String, _>("status"));

    assert_catalog_rows(&pool, &bundled_catalog()).await;
}

#[tokio::test]
async fn sqlite_installer_repairs_drifted_course_relation_seed_identity_on_startup_check() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query(
        r#"
        UPDATE content_course_relation
        SET course_id = 30001001,
            related_course_id = 30001003,
            relation_type = 1,
            sort_order = 9001
        WHERE id = 30005002
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        UPDATE system_installation_state
        SET schema_version = '2026.05.06.1',
            catalog_version = '2026.05.06.1'
        WHERE id = 1
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must force a course seed repair pass when the persisted installation version is stale"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);

    let relation = sqlx::query(
        r#"
        SELECT course_id, related_course_id, relation_type, sort_order, status, deleted_at
        FROM content_course_relation
        WHERE id = 30005002
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(30001001, relation.get::<i64, _>("course_id"));
    assert_eq!(30001006, relation.get::<i64, _>("related_course_id"));
    assert_eq!(1, relation.get::<i64, _>("relation_type"));
    assert_eq!(20, relation.get::<i64, _>("sort_order"));
    assert_eq!(1, relation.get::<i64, _>("status"));
    assert!(
        relation.get::<Option<String>, _>("deleted_at").is_none(),
        "course relation seed repair must restore the canonical active relation row"
    );
}

#[tokio::test]
async fn sqlite_installer_reimports_course_seed_when_recorded_payload_is_stale() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query(
        r#"
        UPDATE system_schema_migration
        SET checksum = 'stale-course-seed-checksum',
            status = 'completed'
        WHERE migration_key = ?
        "#,
    )
    .bind(format!("course:{SCHEMA_VERSION}"))
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect a stale course seed payload even when seed ids are present"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);

    let course_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM content_course
        WHERE course_code LIKE 'c%'
          AND deleted_at IS NULL
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert!(
        course_count >= 200,
        "course seed repair must restore the expanded online learning catalog"
    );

    let course_migration = sqlx::query(
        r#"
        SELECT status, checksum
        FROM system_schema_migration
        WHERE migration_key = ?
        "#,
    )
    .bind(format!("course:{SCHEMA_VERSION}"))
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("completed", course_migration.get::<String, _>("status"));
    assert_ne!(
        "stale-course-seed-checksum",
        course_migration.get::<String, _>("checksum")
    );
}

#[tokio::test]
async fn sqlite_installer_repairs_drifted_course_section_seed_identity_on_payload_refresh() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query(
        r#"
        UPDATE content_course_section
        SET course_id = 30001002,
            section_no = 9,
            title = 'Drifted section'
        WHERE id = 30003001
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        UPDATE system_schema_migration
        SET checksum = 'stale-course-seed-checksum',
            status = 'completed'
        WHERE migration_key = ?
        "#,
    )
    .bind(format!("course:{SCHEMA_VERSION}"))
    .execute(&pool)
    .await
    .unwrap();

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);

    let section = sqlx::query(
        r#"
        SELECT course_id, section_no, title, status, deleted_at
        FROM content_course_section
        WHERE id = 30003001
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(30001001, section.get::<i64, _>("course_id"));
    assert_eq!(1, section.get::<i64, _>("section_no"));
    assert_ne!("Drifted section", section.get::<String, _>("title"));
    assert_eq!(1, section.get::<i64, _>("status"));
    assert!(section.get::<Option<String>, _>("deleted_at").is_none());
}

#[tokio::test]
async fn sqlite_installer_repairs_missing_sdkwork_models_catalog_rows_on_startup_check() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());
    let catalog = bundled_catalog();
    let deleted_catalog_keys = catalog_keys(&catalog)
        .into_iter()
        .take(2)
        .collect::<Vec<_>>();

    installer.ensure_installed().await.unwrap();
    sqlx::query("DELETE FROM ai_model_rank_snapshot")
        .execute(&pool)
        .await
        .unwrap();
    for catalog_key in &deleted_catalog_keys {
        sqlx::query("DELETE FROM ai_model WHERE catalog_key = ?")
            .bind(catalog_key)
            .execute(&pool)
            .await
            .unwrap();
    }

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap()
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);

    for catalog_key in &deleted_catalog_keys {
        let repaired_model_count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM ai_model
            WHERE catalog_key = ?
              AND status = 1
            "#,
        )
        .bind(catalog_key)
        .fetch_one(&pool)
        .await
        .unwrap();
        assert_eq!(
            1, repaired_model_count,
            "startup ensure must repair missing sdkwork-models catalog row {catalog_key}"
        );
    }

    assert_catalog_rows(&pool, &catalog).await;
}

#[tokio::test]
async fn sqlite_installer_repairs_missing_skills_seed_rows_on_startup_check() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query(
        "DELETE FROM studio_catalog_artifact WHERE uuid = 'skill-artifact-prompt-optimizer-wasm'",
    )
    .execute(&pool)
    .await
    .unwrap();
    sqlx::query("DELETE FROM plus_agent_skill WHERE skill_key = 'prompt-optimizer'")
        .execute(&pool)
        .await
        .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect missing official skills seed rows"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);
    assert_skill_store_seed_rows(&pool).await;
}

#[tokio::test]
async fn sqlite_installer_repairs_missing_forum_tutorial_seed_rows_on_startup_check() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query("DELETE FROM plus_feeds WHERE uuid = 'sdkwork-forum-tutorial-quick-start'")
        .execute(&pool)
        .await
        .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect missing bundled forum tutorial rows"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(
        InstallationStatus::Installed,
        repaired.status,
        "forum seed repair must restore the default tutorial rows"
    );
    assert!(repaired.changed);

    assert_forum_tutorial_seed_rows(&pool).await;
}

#[tokio::test]
async fn sqlite_installer_repairs_missing_default_iam_subject_on_startup_check() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query("DELETE FROM iam_organization")
        .execute(&pool)
        .await
        .unwrap();
    sqlx::query("DELETE FROM iam_tenant")
        .execute(&pool)
        .await
        .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect that server-mode app-api startup has no active IAM subject"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);

    let active_subject_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM iam_tenant t
        JOIN iam_organization o ON o.tenant_id = t.id
        WHERE t.code = 'default'
          AND t.status = 'active'
          AND o.code = 'root'
          AND o.status = 'active'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        1, active_subject_count,
        "installer repair must restore a default active IAM tenant and organization"
    );
}

#[tokio::test]
async fn sqlite_installer_repairs_drifted_skills_seed_standard_fields_on_startup_check() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query(
        r#"
        UPDATE plus_agent_skill
        SET source_type = 'LEGACY_EXTERNAL',
            market_status = 'DRAFT',
            visibility = 'PRIVATE',
            review_status = 'PENDING',
            enabled = 0,
            builtin = 0,
            is_builtin = 0
        WHERE tenant_id = 0
          AND organization_id = 0
          AND skill_key = 'prompt-optimizer'
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect official skills seed rows drifted away from the Java enum and store publication standard"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);

    let prompt_optimizer = sqlx::query(
        r#"
        SELECT source_type, market_status, visibility, review_status, enabled, builtin, is_builtin
        FROM plus_agent_skill
        WHERE tenant_id = 0
          AND organization_id = 0
          AND skill_key = 'prompt-optimizer'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();

    assert_eq!("OFFICIAL", prompt_optimizer.get::<String, _>("source_type"));
    assert_eq!(
        "PUBLISHED",
        prompt_optimizer.get::<String, _>("market_status")
    );
    assert_eq!("PUBLIC", prompt_optimizer.get::<String, _>("visibility"));
    assert_eq!(
        "APPROVED",
        prompt_optimizer.get::<String, _>("review_status")
    );
    assert_eq!(1, prompt_optimizer.get::<i64, _>("enabled"));
    assert_eq!(1, prompt_optimizer.get::<i64, _>("builtin"));
    assert_eq!(1, prompt_optimizer.get::<i64, _>("is_builtin"));
    assert_skill_store_seed_rows(&pool).await;
}

#[tokio::test]
async fn sqlite_installer_repairs_drifted_skill_package_identity_on_startup_check() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query(
        r#"
        UPDATE plus_agent_skill_package
        SET package_key = 'legacy-sdkwork-official-skills',
            name = 'Legacy SDKWork Official Skills',
            enabled = 0,
            featured = 0
        WHERE tenant_id = 0
          AND organization_id = 0
          AND id = 7101
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect seed package identity drift before startup repair"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);

    let package = sqlx::query(
        r#"
        SELECT package_key, name, enabled, featured
        FROM plus_agent_skill_package
        WHERE tenant_id = 0
          AND organization_id = 0
          AND id = 7101
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        "sdkwork-official-skills",
        package.get::<String, _>("package_key")
    );
    assert_eq!("SDKWork Official Skills", package.get::<String, _>("name"));
    assert_eq!(1, package.get::<i64, _>("enabled"));
    assert_eq!(1, package.get::<i64, _>("featured"));
    assert_skill_store_seed_rows(&pool).await;
}

#[tokio::test]
async fn sqlite_installer_reclaims_skill_package_key_from_stale_seed_duplicate_on_startup_check() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query(
        r#"
        UPDATE plus_agent_skill_package
        SET package_key = 'legacy-sdkwork-official-skills',
            name = 'Legacy SDKWork Official Skills',
            enabled = 0
        WHERE tenant_id = 0
          AND organization_id = 0
          AND id = 7101
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        INSERT INTO plus_agent_skill_package
            (id, uuid, tenant_id, organization_id, data_scope, user_id, package_key, name, enabled, featured, sort_weight, tags)
        VALUES
            (97101, 'stale-seed-package-sdkwork-official-skills', 0, 0, 0, 0, 'sdkwork-official-skills', 'Stale SDKWork Official Skills Duplicate', 0, 0, 999, '[]')
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect stale duplicate seed packages that occupy the canonical package key"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);

    let canonical_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_agent_skill_package
        WHERE tenant_id = 0
          AND organization_id = 0
          AND package_key = 'sdkwork-official-skills'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1, canonical_count);

    let stale_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_agent_skill_package
        WHERE tenant_id = 0
          AND organization_id = 0
          AND id = 97101
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(0, stale_count);

    let package = sqlx::query(
        r#"
        SELECT package_key, name, enabled, featured
        FROM plus_agent_skill_package
        WHERE tenant_id = 0
          AND organization_id = 0
          AND id = 7101
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        "sdkwork-official-skills",
        package.get::<String, _>("package_key")
    );
    assert_eq!("SDKWork Official Skills", package.get::<String, _>("name"));
    assert_eq!(1, package.get::<i64, _>("enabled"));
    assert_eq!(1, package.get::<i64, _>("featured"));
    assert_skill_store_seed_rows(&pool).await;
}

#[tokio::test]
async fn sqlite_installer_repairs_skills_seed_when_store_visible_catalog_becomes_empty() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query(
        r#"
        UPDATE plus_category
        SET visible = 0,
            status = 0
        WHERE tenant_id = 0
          AND organization_id = 0
          AND type IN (19, 20)
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect skill seed drift that makes the public SkillsHub categories and skill joins empty"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);
    assert_skill_store_seed_visible_to_app_tenants(&pool).await;

    let categories = SqliteAppSkillsReadStore::new(pool.clone())
        .load_categories(Some(AppSkillsSubject {
            tenant_id: 10,
            organization_id: 20,
            user_id: 30,
        }))
        .await
        .unwrap();
    assert_eq!(
        Some("SDKWork Official"),
        categories.first().map(String::as_str),
        "SDKWork Official must remain the first visible SkillsHub category after seed repair"
    );
}

#[tokio::test]
async fn sqlite_installer_repairs_drifted_skills_artifact_standard_fields_on_startup_check() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query(
        r#"
        UPDATE studio_catalog_artifact
        SET artifact_ref = 'builtin://sdkwork.skills.prompt_optimizer@0.0.0',
            artifact_size_bytes = 1,
            checksum_hash = 'sha256:0000000000000000000000000000000000000000000000000000000000000000',
            status = 0,
            deleted_at = CURRENT_TIMESTAMP
        WHERE tenant_id = 0
          AND organization_id = 0
          AND uuid = 'skill-artifact-prompt-optimizer-100'
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect official skills artifact rows drifted away from the bundled checksum and install metadata"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);

    let artifact = sqlx::query(
        r#"
        SELECT artifact_ref, artifact_size_bytes, checksum_hash, status, deleted_at
        FROM studio_catalog_artifact
        WHERE tenant_id = 0
          AND organization_id = 0
          AND uuid = 'skill-artifact-prompt-optimizer-100'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        "builtin://sdkwork.skills.prompt_optimizer@1.0.0",
        artifact.get::<String, _>("artifact_ref")
    );
    assert_eq!(1748, artifact.get::<i64, _>("artifact_size_bytes"));
    assert_eq!(
        "sha256:3dae84ec4a2bbff9c17a65db78aded0974cbcac33007decee51bff6f779bfc0f",
        artifact.get::<String, _>("checksum_hash")
    );
    assert_eq!(1, artifact.get::<i64, _>("status"));
    assert!(artifact.get::<Option<String>, _>("deleted_at").is_none());
    assert_skill_store_seed_rows(&pool).await;
}

#[tokio::test]
async fn sqlite_installer_repairs_drifted_app_seed_standard_fields_on_startup_check() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query(
        r#"
        UPDATE plus_app
        SET name = 'Drifted Claw Router',
            status = 0,
            config = '{"standard":{"appKey":"sdkwork-claw-router"},"portal":{"marketStatus":"DRAFT"}}',
            install_config = '{"packages":[]}',
            release_notes = '[]'
        WHERE tenant_id = 20001
          AND organization_id = 0
          AND uuid = 'sdkwork-app-sdkwork-claw-router'
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect app seed rows drifted away from the PlusApp runtime and marketplace standard"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);

    let claw_router = sqlx::query(
        r#"
        SELECT name, status, config, install_config, release_notes
        FROM plus_app
        WHERE tenant_id = 20001
          AND organization_id = 0
          AND uuid = 'sdkwork-app-sdkwork-claw-router'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("SDKWork Claw Router", claw_router.get::<String, _>("name"));
    assert_eq!(1, claw_router.get::<i64, _>("status"));

    let config: serde_json::Value =
        serde_json::from_str(claw_router.get::<String, _>("config").as_str()).unwrap();
    assert_eq!("sdkwork-claw-router", config["standard"]["appKey"]);
    assert_eq!("PUBLISHED", config["portal"]["marketStatus"]);

    let install_config: serde_json::Value =
        serde_json::from_str(claw_router.get::<String, _>("install_config").as_str()).unwrap();
    assert!(
        install_config["packages"].as_array().unwrap().len() >= 4,
        "app seed repair must restore install packages"
    );
    let release_notes: serde_json::Value =
        serde_json::from_str(claw_router.get::<String, _>("release_notes").as_str()).unwrap();
    assert!(
        !release_notes.as_array().unwrap().is_empty(),
        "app seed repair must restore release metadata"
    );
}

#[tokio::test]
async fn sqlite_installer_retires_stale_app_seed_artifact_projections_on_startup_check() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    let video_cut_app_id: i64 = sqlx::query_scalar(
        r#"
        SELECT id
        FROM plus_app
        WHERE tenant_id = 20001
          AND organization_id = 0
          AND json_extract(config, '$.standard.appKey') = 'sdkwork-video-cut'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        INSERT INTO studio_catalog_artifact
            (uuid, tenant_id, organization_id, data_scope, status, metadata, target_type, target_id, artifact_type, version, platform_type, os_name, artifact_ref, artifact_url, artifact_size_bytes, published_at)
        VALUES
            ('sdkapp-artifact-stale-video-cut-windows', 20001, 0, 0, 1, '{"seedKind":"sdkwork.plus_app.seed","itemType":"app_artifact","appKey":"sdkwork-video-cut","sourceHash":"old"}', 15, ?, 1, '0.1.4', 'DESKTOP_WINDOWS', 'desktop-windows-x64', 'desktop-windows-msi', 'https://cdn.example.test/stale/video-cut.msi', 1, '2026-05-09T00:00:00Z')
        "#,
    )
    .bind(video_cut_app_id)
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect stale active app seed artifacts that are no longer in the canonical package matrix"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);

    let stale = sqlx::query(
        r#"
        SELECT status, deleted_at, deleted_by
        FROM studio_catalog_artifact
        WHERE uuid = 'sdkapp-artifact-stale-video-cut-windows'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(0, stale.get::<i64, _>("status"));
    assert!(
        stale.get::<Option<String>, _>("deleted_at").is_some(),
        "stale app seed artifacts must be tombstoned instead of remaining visible"
    );
    assert_eq!(0, stale.get::<i64, _>("deleted_by"));
}

#[tokio::test]
async fn sqlite_installer_retires_stale_app_seed_asset_projections_on_startup_check() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    let app_id: i64 = sqlx::query_scalar(
        r#"
        SELECT id
        FROM plus_app
        WHERE tenant_id = 20001
          AND organization_id = 0
          AND json_extract(config, '$.standard.appKey') = 'sdkwork-claw-router'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        INSERT INTO studio_catalog_asset
            (uuid, tenant_id, organization_id, data_scope, status, metadata, target_type, target_id, asset_type, asset_url, sort_order)
        VALUES
            ('sdkapp-asset-stale-claw-router-screen', 20001, 0, 0, 1, '{"seedKind":"sdkwork.plus_app.seed","itemType":"app_asset","appKey":"sdkwork-claw-router","sourceHash":"old"}', 15, ?, 2, 'https://cdn.example.test/stale/claw-router.png', 99)
        "#,
    )
    .bind(app_id)
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect stale active app seed assets that are no longer in the canonical media matrix"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);

    let stale = sqlx::query(
        r#"
        SELECT status, deleted_at, deleted_by
        FROM studio_catalog_asset
        WHERE uuid = 'sdkapp-asset-stale-claw-router-screen'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(0, stale.get::<i64, _>("status"));
    assert!(
        stale.get::<Option<String>, _>("deleted_at").is_some(),
        "stale app seed assets must be tombstoned instead of remaining visible"
    );
    assert_eq!(0, stale.get::<i64, _>("deleted_by"));
}

#[tokio::test]
async fn sqlite_installer_retires_stale_app_seed_apps_on_startup_check() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query(
        r#"
        INSERT INTO plus_app
            (id, uuid, tenant_id, organization_id, data_scope, user_id, name, icon, resource_list, project_id, config, status, platforms, install_platforms, install_skill, install_config, release_notes)
        VALUES
            (20999999, 'sdkwork-app-removed-seed-app', 20001, 0, 0, 0, 'Removed Seed App', '{}', '{}', 0, '{"standard":{"appKey":"removed-seed-app"},"portal":{"marketStatus":"PUBLISHED"}}', 1, '{"platforms":["Web"]}', '{"platforms":["Web"]}', '{}', '{"packages":[]}', '[]')
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect stale active PlusApp seed rows that are no longer in the canonical app bundle"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);

    let stale = sqlx::query(
        r#"
        SELECT status, config
        FROM plus_app
        WHERE uuid = 'sdkwork-app-removed-seed-app'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(0, stale.get::<i64, _>("status"));

    let config: serde_json::Value =
        serde_json::from_str(stale.get::<String, _>("config").as_str()).unwrap();
    assert_eq!(
        "OFFLINE", config["portal"]["marketStatus"],
        "stale app seed rows must be removed from the public marketplace without losing their stable appKey metadata"
    );
    assert_eq!("removed-seed-app", config["standard"]["appKey"]);
}

#[tokio::test]
async fn sqlite_installer_repairs_half_retired_stale_app_seed_apps_on_startup_check() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query(
        r#"
        INSERT INTO plus_app
            (id, uuid, tenant_id, organization_id, data_scope, user_id, name, icon, resource_list, project_id, config, status, platforms, install_platforms, install_skill, install_config, release_notes)
        VALUES
            (20999997, 'sdkwork-app-half-retired-seed-app', 20001, 0, 0, 0, 'Half Retired Seed App', '{}', '{}', 0, '{"standard":{"appKey":"half-retired-seed-app"},"portal":{"marketStatus":"PUBLISHED"}}', 0, '{"platforms":["Web"]}', '{"platforms":["Web"]}', '{}', '{"packages":[]}', '[]')
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect stale seed apps that are inactive but still published in marketplace metadata"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);

    let config_text: String = sqlx::query_scalar(
        r#"
        SELECT config
        FROM plus_app
        WHERE uuid = 'sdkwork-app-half-retired-seed-app'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    let config: serde_json::Value = serde_json::from_str(config_text.as_str()).unwrap();
    assert_eq!("OFFLINE", config["portal"]["marketStatus"]);
    assert_eq!("half-retired-seed-app", config["standard"]["appKey"]);
}

#[tokio::test]
async fn sqlite_installer_retires_stale_app_seed_categories_on_startup_check() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query(
        r#"
        INSERT INTO plus_category
            (id, uuid, tenant_id, organization_id, data_scope, name, description, shop_id, type, group_name, code, tags, icon, sort_weight, parent_id, path, visible, status)
        VALUES
            (20999998, 'sdkwork-app-category-removed', 20001, 0, 0, 'Removed Category', 'Removed stale app category.', 0, 999999, 'app-store', 'app-store-removed', '["app","app-store","removed"]', 'app-window', 999, NULL, '/apps/categories/app-store-removed', 1, 1)
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect stale active AppCenter category seed rows that are no longer derived from the canonical app bundle"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);

    let stale = sqlx::query(
        r#"
        SELECT visible, status
        FROM plus_category
        WHERE uuid = 'sdkwork-app-category-removed'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(0, stale.get::<i64, _>("visible"));
    assert_eq!(0, stale.get::<i64, _>("status"));
}

#[tokio::test]
async fn sqlite_installer_repairs_half_retired_stale_app_seed_categories_on_startup_check() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query(
        r#"
        INSERT INTO plus_category
            (id, uuid, tenant_id, organization_id, data_scope, name, description, shop_id, type, group_name, code, tags, icon, sort_weight, parent_id, path, visible, status)
        VALUES
            (20999996, 'sdkwork-app-category-half-retired', 20001, 0, 0, 'Half Retired Category', 'Half retired stale app category.', 0, 999999, 'app-store', 'app-store-half-retired', '["app","app-store","half-retired"]', 'app-window', 999, NULL, '/apps/categories/app-store-half-retired', 1, 0)
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect stale seed categories that are inactive but still visible"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);

    let stale = sqlx::query(
        r#"
        SELECT visible, status
        FROM plus_category
        WHERE uuid = 'sdkwork-app-category-half-retired'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(0, stale.get::<i64, _>("visible"));
    assert_eq!(0, stale.get::<i64, _>("status"));
}

#[tokio::test]
async fn sqlite_installer_marks_generated_schema_table_loss_as_corrupt() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query("DROP TABLE ai_model_family")
        .execute(&pool)
        .await
        .unwrap();

    assert_eq!(
        InstallationStatus::Corrupt,
        installer.status().await.unwrap(),
        "installer status must validate every table generated from the schema registry"
    );
}

#[tokio::test]
async fn sqlite_installer_repairs_missing_generated_schema_indexes_on_startup_check() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query("DROP INDEX idx_ai_model_public_rank_desc")
        .execute(&pool)
        .await
        .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect missing generated schema indexes because runtime catalog queries depend on them"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);
    assert_sqlite_index_exists(&pool, "idx_ai_model_public_rank_desc").await;
}

#[tokio::test]
async fn sqlite_installer_status_report_reads_latest_catalog_refresh_status() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    assert_eq!(
        "not_run",
        installer
            .status_report()
            .await
            .unwrap()
            .last_catalog_refresh_status
    );

    installer
        .refresh_catalog(CatalogRefreshOptions {
            mode: "dry_run".to_owned(),
            vendor_codes: vec!["openai".to_owned()],
            force: false,
            ..CatalogRefreshOptions::default()
        })
        .await
        .unwrap();

    assert_eq!(
        "dry_run",
        installer
            .status_report()
            .await
            .unwrap()
            .last_catalog_refresh_status,
        "status report must expose the latest catalog refresh run status"
    );
}

#[tokio::test]
async fn sqlite_installer_dry_run_prepares_schema_without_catalog_facts() {
    let catalog_root = single_vendor_catalog_root("openai");
    let pool = sqlite_pool().await;
    let options = DatabaseInstallOptions::new("test", "commercial")
        .unwrap()
        .with_models_catalog_root(Some(catalog_root.to_string_lossy().to_string()))
        .unwrap();
    let installer = DatabaseInstaller::for_sqlite(pool.clone())
        .with_options(options)
        .unwrap();

    let report = installer
        .refresh_catalog(CatalogRefreshOptions {
            mode: "dry_run".to_owned(),
            force: false,
            ..CatalogRefreshOptions::default()
        })
        .await
        .unwrap();

    assert!(!report.synced);
    assert_eq!(1, report.vendor_count);
    assert_table_exists(&pool, "ai_model").await;
    assert_eq!(
        InstallationStatus::Incomplete,
        installer.status().await.unwrap(),
        "dry-run must prepare schema without marking catalog installation complete"
    );

    let vendor_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM ai_model_vendor WHERE status = 1")
            .fetch_one(&pool)
            .await
            .unwrap();
    let model_count: i64 = sqlx::query_scalar("SELECT COUNT(1) FROM ai_model WHERE status = 1")
        .fetch_one(&pool)
        .await
        .unwrap();
    let pricing_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM ai_model_pricing WHERE status = 1")
            .fetch_one(&pool)
            .await
            .unwrap();
    let dry_run_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ai_model_catalog_sync_run
        WHERE run_status = 1
          AND json_extract(metadata, '$.dryRun') = 1
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(0, vendor_count);
    assert_eq!(0, model_count);
    assert_eq!(0, pricing_count);
    assert_eq!(1, dry_run_count);

    remove_catalog_root(catalog_root);
}

#[tokio::test]
async fn sqlite_installer_status_report_maps_successful_catalog_refresh_status() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    installer
        .refresh_catalog(CatalogRefreshOptions {
            mode: "official_refresh".to_owned(),
            vendor_codes: vec!["openai".to_owned()],
            force: true,
            ..CatalogRefreshOptions::default()
        })
        .await
        .unwrap();

    assert_eq!(
        "success",
        installer
            .status_report()
            .await
            .unwrap()
            .last_catalog_refresh_status,
        "successful non-dry-run refreshes must use the public status contract"
    );
}

#[tokio::test]
async fn sqlite_installer_status_report_maps_failed_catalog_refresh_status() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query(
        r#"
        INSERT INTO ai_model_catalog_sync_run
            (uuid, source_code, run_status, started_at, metadata)
        VALUES
            ('catalog-sync-failed-status-test', 'manual', 2, '2999-01-01T00:00:00Z', '{}')
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        "failed",
        installer
            .status_report()
            .await
            .unwrap()
            .last_catalog_refresh_status,
        "failed refresh run records must use the public status contract"
    );
}

#[tokio::test]
async fn sqlite_installer_status_report_uses_highest_id_for_same_refresh_timestamp() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query(
        r#"
        INSERT INTO ai_model_catalog_sync_run
            (uuid, source_code, run_status, started_at, metadata)
        VALUES
            ('catalog-sync-same-time-failed', 'manual', 2, '2999-01-01T00:00:00Z', '{}'),
            ('catalog-sync-same-time-success', 'manual', 1, '2999-01-01T00:00:00Z', '{"syncMode":"dry_run"}')
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        "dry_run",
        installer
            .status_report()
            .await
            .unwrap()
            .last_catalog_refresh_status,
        "latest catalog refresh status must be deterministic when sync rows share the same timestamp"
    );
}

#[tokio::test]
async fn sqlite_installer_failed_catalog_refresh_records_failed_sync_run() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    let error = installer
        .refresh_catalog(CatalogRefreshOptions {
            mode: "vendor_refresh".to_owned(),
            vendor_codes: vec!["missing_vendor".to_owned()],
            force: false,
            ..CatalogRefreshOptions::default()
        })
        .await
        .unwrap_err();

    assert!(error.to_string().contains("missing_vendor"));
    let report = installer.status_report().await.unwrap();
    assert_eq!(
        "failed", report.last_catalog_refresh_status,
        "failed refresh attempts must be visible in installer status reports"
    );
    let failed_runs: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ai_model_catalog_sync_run
        WHERE run_status <> 1
          AND source_code = 'sdkwork_models'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        1, failed_runs,
        "failed refresh attempts must leave an audit row"
    );

    let failed_run = sqlx::query(
        r#"
        SELECT catalog_version, metadata, change_summary
        FROM ai_model_catalog_sync_run
        WHERE run_status <> 1
          AND source_code = 'sdkwork_models'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        CATALOG_VERSION,
        failed_run.get::<String, _>("catalog_version"),
        "failed refresh audit rows must preserve the loaded catalog version when catalog loading succeeds"
    );

    let metadata: serde_json::Value =
        serde_json::from_str(failed_run.get::<String, _>("metadata").as_str()).unwrap();
    assert_eq!(
        CATALOG_VERSION, metadata["catalogVersion"],
        "failed refresh metadata must preserve the loaded catalog version"
    );
    assert_eq!(
        serde_json::json!(["missing_vendor"]),
        metadata["vendorCodes"],
        "failed refresh metadata must preserve the requested vendor scope"
    );

    let change_summary: serde_json::Value =
        serde_json::from_str(failed_run.get::<String, _>("change_summary").as_str()).unwrap();
    assert_eq!(
        CATALOG_VERSION, change_summary["catalogVersion"],
        "failed refresh change summaries must preserve the loaded catalog version"
    );
}

#[tokio::test]
async fn sqlite_installer_catalog_load_failure_on_empty_database_records_failed_sync_run() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());
    let mut missing_catalog_root = std::env::temp_dir();
    missing_catalog_root.push(format!(
        "sdkwork-models-missing-{}",
        CATALOG_ROOT_COUNTER.fetch_add(1, Ordering::Relaxed)
    ));

    let error = installer
        .refresh_catalog(CatalogRefreshOptions {
            catalog_root: Some(missing_catalog_root.to_string_lossy().to_string()),
            force: true,
            ..CatalogRefreshOptions::default()
        })
        .await
        .unwrap_err();

    assert!(
        !error.to_string().is_empty(),
        "catalog load failures must return a useful installer error"
    );
    assert_table_exists(&pool, "ai_model_catalog_sync_run").await;
    assert_eq!(
        InstallationStatus::Incomplete,
        installer.status().await.unwrap(),
        "failed first refresh must leave schema prepared but not report a complete installation"
    );
    assert_eq!(
        "failed",
        installer
            .status_report()
            .await
            .unwrap()
            .last_catalog_refresh_status,
        "catalog load failures must be visible in installer status reports"
    );

    let failed_run = sqlx::query(
        r#"
        SELECT catalog_version, metadata, change_summary, error_message_masked
        FROM ai_model_catalog_sync_run
        WHERE run_status <> 1
          AND source_code = 'sdkwork_models'
        ORDER BY id DESC
        LIMIT 1
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("unknown", failed_run.get::<String, _>("catalog_version"));
    assert!(
        !failed_run
            .get::<String, _>("error_message_masked")
            .is_empty(),
        "failed catalog load audit must retain a masked error message"
    );

    let metadata: serde_json::Value =
        serde_json::from_str(failed_run.get::<String, _>("metadata").as_str()).unwrap();
    assert_eq!("unknown", metadata["catalogVersion"]);
    assert_eq!(
        missing_catalog_root.to_string_lossy().as_ref(),
        metadata["catalogRoot"]
    );

    let change_summary: serde_json::Value =
        serde_json::from_str(failed_run.get::<String, _>("change_summary").as_str()).unwrap();
    assert_eq!("unknown", change_summary["catalogVersion"]);
    assert_eq!("failed", change_summary["vendors"]);
}

#[tokio::test]
async fn sqlite_installer_catalog_sync_failure_records_failed_sync_run() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query(
        r#"
        CREATE TRIGGER reject_success_catalog_sync_run
        BEFORE INSERT ON ai_model_catalog_sync_run
        WHEN NEW.run_status = 1
        BEGIN
            SELECT RAISE(ABORT, 'test forced successful sync run failure');
        END
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let error = installer
        .refresh_catalog(CatalogRefreshOptions {
            mode: "vendor_refresh".to_owned(),
            vendor_codes: vec!["openai".to_owned()],
            force: true,
            ..CatalogRefreshOptions::default()
        })
        .await
        .unwrap_err();

    assert!(
        error
            .to_string()
            .contains("test forced successful sync run failure"),
        "refresh errors should preserve the sync failure context"
    );
    assert_eq!(
        "failed",
        installer
            .status_report()
            .await
            .unwrap()
            .last_catalog_refresh_status,
        "sync execution failures must be visible in installer status reports"
    );

    let failed_run = sqlx::query(
        r#"
        SELECT catalog_version, metadata, change_summary, error_message_masked
        FROM ai_model_catalog_sync_run
        WHERE run_status <> 1
          AND source_code = 'sdkwork_models'
        ORDER BY id DESC
        LIMIT 1
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        CATALOG_VERSION,
        failed_run.get::<String, _>("catalog_version")
    );
    assert!(failed_run
        .get::<String, _>("error_message_masked")
        .contains("test forced successful sync run failure"));

    let metadata: serde_json::Value =
        serde_json::from_str(failed_run.get::<String, _>("metadata").as_str()).unwrap();
    assert_eq!(CATALOG_VERSION, metadata["catalogVersion"]);
    assert_eq!(serde_json::json!(["openai"]), metadata["vendorCodes"]);

    let change_summary: serde_json::Value =
        serde_json::from_str(failed_run.get::<String, _>("change_summary").as_str()).unwrap();
    assert_eq!(CATALOG_VERSION, change_summary["catalogVersion"]);
    assert_eq!("failed", change_summary["vendors"]);
}

#[tokio::test]
async fn sqlite_installer_catalog_sync_failure_rolls_back_catalog_rows() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    let original_price: String = sqlx::query_scalar(
        r#"
        SELECT printf('%.6f', unit_price)
        FROM ai_model_pricing
        WHERE model = 'gpt-5.5-pro'
          AND billing_meter_code = 'llm_input_token'
          AND status = 1
        LIMIT 1
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        UPDATE ai_model_pricing
        SET unit_price = '999999.000000'
        WHERE model = 'gpt-5.5-pro'
          AND billing_meter_code = 'llm_input_token'
          AND status = 1
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TRIGGER reject_catalog_refresh_snapshot
        BEFORE INSERT ON ai_pricing_import_snapshot
        BEGIN
            SELECT RAISE(ABORT, 'test forced pricing import snapshot failure');
        END
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let error = installer
        .refresh_catalog(CatalogRefreshOptions {
            mode: "vendor_refresh".to_owned(),
            vendor_codes: vec!["openai".to_owned()],
            force: true,
            ..CatalogRefreshOptions::default()
        })
        .await
        .unwrap_err();

    assert!(
        error
            .to_string()
            .contains("test forced pricing import snapshot failure"),
        "refresh must return the root snapshot failure"
    );
    let price_after_failure: String = sqlx::query_scalar(
        r#"
        SELECT printf('%.6f', unit_price)
        FROM ai_model_pricing
        WHERE model = 'gpt-5.5-pro'
          AND billing_meter_code = 'llm_input_token'
          AND status = 1
        LIMIT 1
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        "999999.000000", price_after_failure,
        "failed catalog sync must not partially update model pricing before sync audit commits"
    );
    assert_ne!(
        original_price, price_after_failure,
        "the test must prove rollback against a catalog value that would otherwise be restored"
    );
}

#[tokio::test]
async fn sqlite_installer_catalog_sync_failure_preserves_original_error_when_audit_fails() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    sqlx::query(
        r#"
        CREATE TRIGGER reject_all_catalog_sync_runs
        BEFORE INSERT ON ai_model_catalog_sync_run
        BEGIN
            SELECT
                CASE
                    WHEN NEW.run_status = 1 THEN RAISE(ABORT, 'test original sync failure')
                    ELSE RAISE(ABORT, 'test audit write failure')
                END;
        END
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let error = installer
        .refresh_catalog(CatalogRefreshOptions {
            mode: "vendor_refresh".to_owned(),
            vendor_codes: vec!["openai".to_owned()],
            force: true,
            ..CatalogRefreshOptions::default()
        })
        .await
        .unwrap_err()
        .to_string();

    assert!(
        error.contains("test original sync failure"),
        "refresh must return the original sync failure when failure audit persistence also fails"
    );
    assert!(
        !error.contains("test audit write failure"),
        "failure audit persistence must not mask the root refresh failure"
    );
}

#[tokio::test]
async fn sqlite_installer_ensure_upgrade_report_preserves_latest_catalog_refresh_status() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    installer
        .refresh_catalog(CatalogRefreshOptions {
            mode: "official_refresh".to_owned(),
            vendor_codes: vec!["openai".to_owned()],
            force: true,
            ..CatalogRefreshOptions::default()
        })
        .await
        .unwrap();
    sqlx::query(
        r#"
        UPDATE system_installation_state
        SET schema_version = '2026.05.06.1'
        WHERE id = 1
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let report = installer.ensure_installed().await.unwrap();
    assert!(report.changed);
    assert_eq!(
        "success", report.last_catalog_refresh_status,
        "upgrade reports must preserve the latest catalog refresh observability state"
    );
}

#[tokio::test]
async fn sqlite_installer_status_uses_external_catalog_scope() {
    let catalog_root = single_vendor_catalog_root("openai");
    let catalog = sdkwork_models::load_catalog(&catalog_root).unwrap();
    assert_eq!(1, catalog.vendors.len());

    let pool = sqlite_pool().await;
    let options = DatabaseInstallOptions::new("test", "commercial")
        .unwrap()
        .with_models_catalog_root(Some(catalog_root.to_string_lossy().to_string()))
        .unwrap();
    let installer = DatabaseInstaller::for_sqlite(pool.clone())
        .with_options(options)
        .unwrap();

    let installed = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, installed.status);
    assert!(installed.external_catalog);
    assert_eq!(CATALOG_VERSION, installed.catalog_version);
    assert_eq!(
        InstallationStatus::Installed,
        installer.status().await.unwrap()
    );

    assert_catalog_rows(&pool, &catalog).await;

    remove_catalog_root(catalog_root);
}

#[tokio::test]
async fn sqlite_installer_reports_catalog_unavailable_when_persisted_external_catalog_is_missing() {
    let catalog_root = single_vendor_catalog_root("openai");
    let pool = sqlite_pool().await;
    let options = DatabaseInstallOptions::new("test", "commercial")
        .unwrap()
        .with_models_catalog_root(Some(catalog_root.to_string_lossy().to_string()))
        .unwrap();
    let installer = DatabaseInstaller::for_sqlite(pool.clone())
        .with_options(options)
        .unwrap();

    let installed = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, installed.status);

    remove_catalog_root(catalog_root);

    let report = DatabaseInstaller::for_sqlite(pool)
        .with_options(DatabaseInstallOptions::new("test", "commercial").unwrap())
        .unwrap()
        .status_report()
        .await
        .unwrap();
    assert_eq!(InstallationStatus::CatalogUnavailable, report.status);
    assert!(report.external_catalog);
    assert_eq!(CATALOG_VERSION, report.catalog_version);
}

#[tokio::test]
async fn sqlite_installer_refresh_deactivates_models_removed_from_vendor_catalog() {
    let catalog_root = single_vendor_catalog_root("openai");
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer
        .refresh_catalog(CatalogRefreshOptions {
            catalog_root: Some(catalog_root.to_string_lossy().to_string()),
            force: true,
            ..CatalogRefreshOptions::default()
        })
        .await
        .unwrap();
    assert_active_model_graph(&pool, "gpt-5.2", 1).await;

    remove_model_from_catalog_root(&catalog_root, "openai", "gpt-5.2");
    installer
        .refresh_catalog(CatalogRefreshOptions {
            catalog_root: Some(catalog_root.to_string_lossy().to_string()),
            force: true,
            ..CatalogRefreshOptions::default()
        })
        .await
        .unwrap();

    assert_active_model_graph(&pool, "gpt-5.2", 0).await;
    assert_active_model_graph(&pool, "gpt-5.5", 1).await;

    remove_catalog_root(catalog_root);
}

#[tokio::test]
async fn sqlite_installer_refresh_reactivates_soft_deleted_catalog_rows() {
    let catalog_root = single_vendor_catalog_root("openai");
    let catalog = sdkwork_models::load_catalog(&catalog_root).unwrap();
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer
        .refresh_catalog(CatalogRefreshOptions {
            catalog_root: Some(catalog_root.to_string_lossy().to_string()),
            force: true,
            ..CatalogRefreshOptions::default()
        })
        .await
        .unwrap();
    assert_active_model_graph(&pool, "gpt-5.2", 1).await;

    let family_code: String = sqlx::query_scalar(
        "SELECT family_code FROM ai_model WHERE model = 'gpt-5.2' AND status = 1",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    soft_delete_catalog_row(
        &pool,
        "ai_billing_meter",
        "meter_code = 'llm_input_token'",
        true,
    )
    .await;
    soft_delete_catalog_row(&pool, "ai_model_vendor", "vendor_code = 'openai'", true).await;
    soft_delete_catalog_row(
        &pool,
        "ai_model_family",
        format!("vendor_code = 'openai' AND family_code = '{family_code}'").as_str(),
        true,
    )
    .await;
    soft_delete_catalog_row(&pool, "ai_model", "model = 'gpt-5.2'", true).await;
    soft_delete_catalog_row(&pool, "ai_model_capability", "model = 'gpt-5.2'", true).await;
    soft_delete_catalog_row(&pool, "ai_model_pricing", "model = 'gpt-5.2'", true).await;
    soft_delete_catalog_row(&pool, "ai_model_rank_snapshot", "model = 'gpt-5.2'", false).await;

    installer
        .refresh_catalog(CatalogRefreshOptions {
            catalog_root: Some(catalog_root.to_string_lossy().to_string()),
            force: true,
            ..CatalogRefreshOptions::default()
        })
        .await
        .unwrap();

    assert_catalog_row_restored(
        &pool,
        "ai_billing_meter",
        "meter_code = 'llm_input_token'",
        true,
    )
    .await;
    assert_catalog_row_restored(&pool, "ai_model_vendor", "vendor_code = 'openai'", true).await;
    assert_catalog_row_restored(
        &pool,
        "ai_model_family",
        format!("vendor_code = 'openai' AND family_code = '{family_code}'").as_str(),
        true,
    )
    .await;
    assert_catalog_row_restored(&pool, "ai_model", "model = 'gpt-5.2'", true).await;
    assert_catalog_row_restored(&pool, "ai_model_capability", "model = 'gpt-5.2'", true).await;
    assert_catalog_row_restored(&pool, "ai_model_pricing", "model = 'gpt-5.2'", true).await;
    assert_catalog_row_restored(&pool, "ai_model_rank_snapshot", "model = 'gpt-5.2'", false).await;
    assert_pricing_snapshot_contains_catalog_models(&pool, &catalog).await;

    remove_catalog_root(catalog_root);
}

#[tokio::test]
async fn sqlite_installer_status_detects_catalog_rows_hidden_by_soft_delete_markers() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    installer.ensure_installed().await.unwrap();
    let family_code: String = sqlx::query_scalar(
        "SELECT family_code FROM ai_model WHERE model = 'gpt-5.2' AND status = 1",
    )
    .fetch_one(&pool)
    .await
    .unwrap();

    mark_catalog_row_deleted_but_active(
        &pool,
        "ai_billing_meter",
        "meter_code = 'llm_input_token'",
    )
    .await;
    mark_catalog_row_deleted_but_active(&pool, "ai_model_vendor", "vendor_code = 'openai'").await;
    mark_catalog_row_deleted_but_active(
        &pool,
        "ai_model_family",
        format!("vendor_code = 'openai' AND family_code = '{family_code}'").as_str(),
    )
    .await;
    mark_catalog_row_deleted_but_active(&pool, "ai_model", "model = 'gpt-5.2'").await;
    mark_catalog_row_deleted_but_active(&pool, "ai_model_capability", "model = 'gpt-5.2'").await;
    mark_catalog_row_deleted_but_active(&pool, "ai_model_pricing", "model = 'gpt-5.2'").await;

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must treat soft-deleted catalog rows as incomplete because runtime queries hide them"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);
    assert_catalog_row_restored(
        &pool,
        "ai_billing_meter",
        "meter_code = 'llm_input_token'",
        true,
    )
    .await;
    assert_catalog_row_restored(&pool, "ai_model_vendor", "vendor_code = 'openai'", true).await;
    assert_catalog_row_restored(
        &pool,
        "ai_model_family",
        format!("vendor_code = 'openai' AND family_code = '{family_code}'").as_str(),
        true,
    )
    .await;
    assert_catalog_row_restored(&pool, "ai_model", "model = 'gpt-5.2'", true).await;
    assert_catalog_row_restored(&pool, "ai_model_capability", "model = 'gpt-5.2'", true).await;
    assert_catalog_row_restored(&pool, "ai_model_pricing", "model = 'gpt-5.2'", true).await;
}

#[test]
fn installer_options_reject_control_characters_in_external_catalog_root() {
    let error = DatabaseInstallOptions::new("test", "commercial")
        .unwrap()
        .with_models_catalog_root(Some("target/sdkwork-models\nbad".to_owned()))
        .unwrap_err()
        .to_string();

    assert!(
        error.contains("must not contain control characters"),
        "install options must enforce the same catalog root boundary as refresh-catalog: {error}"
    );
}

async fn assert_active_model_graph(pool: &SqlitePool, model: &str, expected_model_count: i64) {
    let model_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM ai_model WHERE model = ? AND status = 1")
            .bind(model)
            .fetch_one(pool)
            .await
            .unwrap();
    let capability_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM ai_model_capability WHERE model = ? AND status = 1",
    )
    .bind(model)
    .fetch_one(pool)
    .await
    .unwrap();
    let pricing_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM ai_model_pricing WHERE model = ? AND status = 1")
            .bind(model)
            .fetch_one(pool)
            .await
            .unwrap();
    let ranking_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM ai_model_rank_snapshot WHERE model = ? AND status = 1",
    )
    .bind(model)
    .fetch_one(pool)
    .await
    .unwrap();

    assert_eq!(expected_model_count, model_count);
    if expected_model_count == 0 {
        assert_eq!(0, capability_count);
        assert_eq!(0, pricing_count);
        assert_eq!(0, ranking_count);
    } else {
        assert!(capability_count > 0);
        assert!(pricing_count > 0);
    }
}

async fn mark_catalog_row_deleted_but_active(pool: &SqlitePool, table: &str, predicate: &str) {
    let sql = format!(
        "UPDATE {table} SET status = 1, deleted_at = '2099-01-01T00:00:00Z', deleted_by = 9001 WHERE {predicate}"
    );
    let changed = sqlx::query(sql.as_str())
        .execute(pool)
        .await
        .unwrap()
        .rows_affected();
    assert!(
        changed > 0,
        "test setup must mark at least one active row deleted in {table}"
    );
}

async fn soft_delete_catalog_row(
    pool: &SqlitePool,
    table: &str,
    predicate: &str,
    has_deleted_columns: bool,
) {
    let sql = if has_deleted_columns {
        format!(
            "UPDATE {table} SET status = 0, deleted_at = '2099-01-01T00:00:00Z', deleted_by = 9001 WHERE {predicate}"
        )
    } else {
        format!("UPDATE {table} SET status = 0 WHERE {predicate}")
    };
    let changed = sqlx::query(sql.as_str())
        .execute(pool)
        .await
        .unwrap()
        .rows_affected();
    assert!(
        changed > 0,
        "test setup must soft-delete at least one row from {table}"
    );
}

async fn assert_catalog_row_restored(
    pool: &SqlitePool,
    table: &str,
    predicate: &str,
    has_deleted_columns: bool,
) {
    let sql = if has_deleted_columns {
        format!(
            "SELECT COUNT(1) FROM {table} WHERE {predicate} AND status = 1 AND deleted_at IS NULL AND deleted_by IS NULL"
        )
    } else {
        format!("SELECT COUNT(1) FROM {table} WHERE {predicate} AND status = 1")
    };
    let restored_count: i64 = sqlx::query_scalar(sql.as_str())
        .fetch_one(pool)
        .await
        .unwrap();
    assert!(
        restored_count > 0,
        "catalog refresh must restore active non-deleted rows in {table}"
    );
}

async fn sqlite_pool() -> SqlitePool {
    SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap()
}

fn installer(pool: SqlitePool) -> DatabaseInstaller {
    DatabaseInstaller::for_sqlite(pool)
        .with_options(DatabaseInstallOptions::new("test", "commercial").unwrap())
        .unwrap()
}

async fn assert_catalog_rows(pool: &SqlitePool, catalog: &sdkwork_models::ModelCatalog) {
    let vendor_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(DISTINCT vendor_code)
        FROM ai_model_vendor
        WHERE status = 1
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    let vendor_region_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ai_model_vendor_region
        WHERE status = 1
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    let model_count: i64 = sqlx::query_scalar("SELECT COUNT(1) FROM ai_model WHERE status = 1")
        .fetch_one(pool)
        .await
        .unwrap();
    let meter_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM ai_billing_meter WHERE status = 1")
            .fetch_one(pool)
            .await
            .unwrap();
    let pricing_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM ai_model_pricing WHERE status = 1")
            .fetch_one(pool)
            .await
            .unwrap();
    let ranking_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ai_model_rank_snapshot
        WHERE status = 1
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    let expected_ranking_count = catalog_ranking_keys(catalog).len() as i64;

    assert_eq!(catalog_vendor_codes(catalog).len() as i64, vendor_count);
    assert_eq!(catalog.vendors.len() as i64, vendor_region_count);
    assert_eq!(catalog_keys(catalog).len() as i64, model_count);
    assert_eq!(catalog.meters.len() as i64, meter_count);
    assert!(
        pricing_count >= catalog_price_keys(catalog).len() as i64,
        "ai_model_pricing may expand catalog price entries into runtime-specific rows, but it must contain every catalog price key"
    );
    assert_eq!(expected_ranking_count, ranking_count);

    for vendor in &catalog.vendors {
        for model in &vendor.models {
            let catalog_key = sdkwork_models::catalog_key(
                &vendor.vendor.vendor_code,
                &vendor.vendor.region_code,
                &model.model_id,
            );
            let count: i64 = sqlx::query_scalar(
                r#"
                SELECT COUNT(1)
                FROM ai_model
                WHERE catalog_key = ?
                  AND status = 1
                "#,
            )
            .bind(&catalog_key)
            .fetch_one(pool)
            .await
            .unwrap();
            assert_eq!(
                1, count,
                "{} must be imported from sdkwork-models",
                catalog_key
            );

            let capabilities: Option<String> = sqlx::query_scalar(
                r#"
                SELECT capabilities
                FROM ai_model
                WHERE catalog_key = ?
                  AND status = 1
                "#,
            )
            .bind(&catalog_key)
            .fetch_one(pool)
            .await
            .unwrap();
            let capabilities = capabilities.unwrap_or_else(|| {
                panic!(
                    "{} must preserve sdkwork-models capabilities on ai_model",
                    catalog_key
                )
            });
            let capabilities: Vec<String> = serde_json::from_str(&capabilities)
                .expect("ai_model.capabilities must be a JSON string array");
            assert!(
                !capabilities.is_empty(),
                "{} must not import an empty ai_model.capabilities array",
                catalog_key
            );
            let expected_capabilities = if model.capabilities.is_empty() {
                vec![model.primary_capability.clone()]
            } else {
                model.capabilities.clone()
            };
            for expected in expected_capabilities {
                assert!(
                    capabilities.contains(&expected),
                    "{} capabilities must include {expected}",
                    catalog_key
                );
            }
        }
    }

    for price_key in catalog_price_keys(catalog) {
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM ai_model_pricing
            WHERE catalog_key = ?
              AND billing_meter_code = ?
              AND price_side = ?
              AND pricing_scope = ?
              AND status = 1
            "#,
        )
        .bind(&price_key.catalog_key)
        .bind(&price_key.meter_code)
        .bind(price_key.price_side)
        .bind(price_key.pricing_scope)
        .fetch_one(pool)
        .await
        .unwrap();
        assert!(
            count > 0,
            "{} {} side={} scope={} must be imported from sdkwork-models pricing",
            price_key.catalog_key,
            price_key.meter_code,
            price_key.price_side,
            price_key.pricing_scope
        );
    }

    for ranking_key in catalog_ranking_keys(catalog) {
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM ai_model_rank_snapshot
            WHERE snapshot_date = ?
              AND rank_scope = ?
              AND catalog_key = ?
              AND status = 1
            "#,
        )
        .bind(&ranking_key.snapshot_date)
        .bind(&ranking_key.rank_scope)
        .bind(&ranking_key.catalog_key)
        .fetch_one(pool)
        .await
        .unwrap();
        assert!(
            count > 0,
            "{} {} {} must be imported from sdkwork-models rankings",
            ranking_key.snapshot_date,
            ranking_key.rank_scope,
            ranking_key.catalog_key
        );
    }

    for catalog_key in catalog_keys(catalog) {
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM ai_model
            WHERE catalog_key = ?
              AND status = 1
            "#,
        )
        .bind(&catalog_key)
        .fetch_one(pool)
        .await
        .unwrap();
        assert_eq!(
            1, count,
            "{catalog_key} must be imported from sdkwork-models"
        );
    }
}

async fn assert_pricing_snapshot_contains_catalog_models(
    pool: &SqlitePool,
    catalog: &sdkwork_models::ModelCatalog,
) {
    let snapshot = SqlitePricingCatalogLoader::new(pool.clone())
        .load_snapshot()
        .await
        .unwrap();
    for model in catalog_routable_keys(catalog) {
        assert!(
            snapshot.find_model(&model).is_some(),
            "{model} must be visible to the pricing catalog loader"
        );
    }
}

async fn assert_skill_store_seed_rows(pool: &SqlitePool) {
    let category_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_category
        WHERE tenant_id = 0
          AND organization_id = 0
          AND type IN (19, 20)
          AND status = 1
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert!(
        category_count >= 2,
        "installer must seed official skills and collection categories"
    );

    let package_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_agent_skill_package
        WHERE tenant_id = 0
          AND organization_id = 0
          AND enabled = 1
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert!(
        package_count >= 1,
        "installer must seed at least one official skill package"
    );

    let skill_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_agent_skill
        WHERE tenant_id = 0
          AND organization_id = 0
          AND enabled = 1
          AND market_status = 'PUBLISHED'
          AND visibility = 'PUBLIC'
          AND review_status = 'APPROVED'
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert!(
        skill_count >= 3,
        "installer must seed a useful official skills store catalog"
    );

    let concrete_skill = sqlx::query(
        r#"
        SELECT name, provider, tags, capabilities, default_config
        FROM plus_agent_skill
        WHERE skill_key = 'prompt-optimizer'
          AND tenant_id = 0
          AND organization_id = 0
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!(
        "Prompt Optimizer",
        concrete_skill.get::<String, _>("name"),
        "seed data must include the canonical prompt optimizer skill"
    );
    assert_eq!(
        "SDKWork",
        concrete_skill.get::<String, _>("provider"),
        "seed data must preserve the official provider"
    );
    let tags: Vec<String> =
        serde_json::from_str(concrete_skill.get::<String, _>("tags").as_str()).unwrap();
    assert!(
        tags.contains(&"agent".to_owned()),
        "seeded skill tags must be stored as JSON arrays"
    );
    let capabilities: Vec<String> =
        serde_json::from_str(concrete_skill.get::<String, _>("capabilities").as_str()).unwrap();
    assert!(
        capabilities.contains(&"prompt.analysis".to_owned()),
        "seeded skill capabilities must be stored as JSON arrays"
    );
    let default_config: serde_json::Value =
        serde_json::from_str(concrete_skill.get::<String, _>("default_config").as_str()).unwrap();
    assert_eq!(
        "Prompt Copilot", default_config["portal"]["developer"],
        "seeded skill portal metadata must be available to the SkillsHub adapter"
    );
}

async fn assert_app_store_seed_rows(pool: &SqlitePool) {
    let expected_app_count = sdkwork_app_seed_count();
    let app_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_app
        WHERE tenant_id = 20001
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!(
        expected_app_count as i64, app_count,
        "installer must seed every sdkwork.app.config.json PlusApp projection"
    );

    let claw_router = sqlx::query(
        r#"
        SELECT name, version, icon_url, access_url, config, install_config, release_notes, status
        FROM plus_app
        WHERE tenant_id = 20001
          AND organization_id = 0
          AND json_extract(config, '$.standard.appKey') = 'sdkwork-claw-router'
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!(
        "SDKWork Claw Router",
        claw_router.get::<String, _>("name"),
        "seed data must include the root Claw Router app"
    );
    assert_eq!(1, claw_router.get::<i64, _>("status"));
    assert_eq!("0.1.0", claw_router.get::<String, _>("version"));
    assert_eq!(
        "https://cdn.sdkwork.com/apps/sdkwork-claw-router/assets/icon-1024.png",
        claw_router.get::<String, _>("icon_url")
    );
    assert_eq!(
        "https://api.sdkwork.com/apps/sdkwork-claw-router",
        claw_router.get::<String, _>("access_url")
    );

    let config: serde_json::Value =
        serde_json::from_str(claw_router.get::<String, _>("config").as_str()).unwrap();
    assert_eq!("sdkwork-claw-router", config["standard"]["appKey"]);
    assert_eq!(3, config["standard"]["schemaVersion"]);

    let install_config: serde_json::Value =
        serde_json::from_str(claw_router.get::<String, _>("install_config").as_str()).unwrap();
    assert!(
        install_config["packages"].as_array().unwrap().len() >= 4,
        "PlusApp install_config must preserve the package matrix"
    );

    let release_notes: serde_json::Value =
        serde_json::from_str(claw_router.get::<String, _>("release_notes").as_str()).unwrap();
    assert!(
        !release_notes.as_array().unwrap().is_empty(),
        "PlusApp release_notes must preserve standard release metadata"
    );

    let app_category_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_category
        WHERE tenant_id = 20001
          AND organization_id = 0
          AND code IN ('app-store-html', 'app-store-react', 'app-store-productivity')
          AND type = 999999
          AND status = 1
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!(
        3, app_category_count,
        "installer must normalize AppCenter portal categories into PlusCategory records"
    );

    let app_id: i64 = sqlx::query_scalar(
        r#"
        SELECT id
        FROM plus_app
        WHERE tenant_id = 20001
          AND organization_id = 0
          AND json_extract(config, '$.standard.appKey') = 'sdkwork-claw-router'
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();

    let asset_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM studio_catalog_asset
        WHERE tenant_id = 20001
          AND organization_id = 0
          AND target_type = 15
          AND target_id = ?
          AND asset_type IN (1, 2, 3)
          AND status = 1
          AND deleted_at IS NULL
        "#,
    )
    .bind(app_id)
    .fetch_one(pool)
    .await
    .unwrap();
    assert!(
        asset_count >= 3,
        "installer must project app icon, screenshot, and preview media into studio_catalog_asset"
    );

    let artifact_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM studio_catalog_artifact
        WHERE tenant_id = 20001
          AND organization_id = 0
          AND target_type = 15
          AND target_id = ?
          AND artifact_type = 1
          AND status = 1
          AND deleted_at IS NULL
        "#,
    )
    .bind(app_id)
    .fetch_one(pool)
    .await
    .unwrap();
    assert!(
        artifact_count >= 4,
        "installer must project app install packages into studio_catalog_artifact"
    );

    let video_cut_app_id: i64 = sqlx::query_scalar(
        r#"
        SELECT id
        FROM plus_app
        WHERE tenant_id = 20001
          AND organization_id = 0
          AND json_extract(config, '$.standard.appKey') = 'sdkwork-video-cut'
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    let disabled_video_cut_artifacts: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM studio_catalog_artifact
        WHERE tenant_id = 20001
          AND organization_id = 0
          AND target_type = 15
          AND target_id = ?
          AND artifact_type = 1
          AND status = 0
          AND deleted_at IS NULL
        "#,
    )
    .bind(video_cut_app_id)
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!(
        6, disabled_video_cut_artifacts,
        "installer must preserve disabled app package projections as inactive artifacts instead of dropping the package matrix"
    );

    let active_video_cut_artifacts: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM studio_catalog_artifact
        WHERE tenant_id = 20001
          AND organization_id = 0
          AND target_type = 15
          AND target_id = ?
          AND artifact_type = 1
          AND status = 1
          AND deleted_at IS NULL
        "#,
    )
    .bind(video_cut_app_id)
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!(
        0, active_video_cut_artifacts,
        "disabled app packages must not be visible as active App Store release artifacts"
    );
}

async fn assert_skill_store_seed_visible_to_app_tenants(pool: &SqlitePool) {
    let store = SqliteAppSkillsReadStore::new(pool.clone());
    let skills = store
        .load_skills(
            AppSkillsQuery::default(),
            Some(AppSkillsSubject {
                tenant_id: 10,
                organization_id: 20,
                user_id: 30,
            }),
        )
        .await
        .unwrap();

    assert!(
        skills.iter().any(|skill| skill.name == "Prompt Optimizer"),
        "official global skills seed must be visible to any app tenant"
    );
    let categories = store
        .load_categories(Some(AppSkillsSubject {
            tenant_id: 10,
            organization_id: 20,
            user_id: 30,
        }))
        .await
        .unwrap();
    assert!(
        categories
            .iter()
            .any(|category| category == "SDKWork Official"),
        "official global skill categories must be visible to any app tenant"
    );
}

async fn assert_forum_tutorial_seed_rows(pool: &SqlitePool) {
    let feed_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_feeds
        WHERE uuid LIKE 'sdkwork-forum-tutorial-%'
          AND COALESCE(status, 0) = 2
          AND tenant_id = 0
          AND organization_id = 0
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!(
        8, feed_count,
        "installer must create default professional forum tutorial posts"
    );

    let tutorial = sqlx::query(
        r#"
        SELECT title, summary, category_id, is_top, is_recommended, tags
        FROM plus_feeds
        WHERE uuid = 'sdkwork-forum-tutorial-quick-start'
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!(
        "Claw Router 快速入门：从安装到第一次模型调用",
        tutorial.get::<String, _>("title")
    );
    assert!(
        tutorial.get::<String, _>("summary").contains("安装完成后"),
        "quick-start tutorial summary must explain post-install onboarding"
    );
    assert_eq!(1004, tutorial.get::<i64, _>("category_id"));
    assert!(tutorial.get::<bool, _>("is_top"));
    assert!(tutorial.get::<bool, _>("is_recommended"));
    assert!(
        tutorial.get::<String, _>("tags").contains("快速入门"),
        "tutorial tags must be written as JSON text for SQLite"
    );

    let forum_comment_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_comments
        WHERE uuid LIKE 'sdkwork-forum-comment-%'
          AND COALESCE(content_type, 0) = 5
          AND tenant_id = 0
          AND organization_id = 0
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!(
        8, forum_comment_count,
        "installer must create default forum tutorial comments"
    );

    let vote_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_content_vote
        WHERE uuid LIKE 'sdkwork-forum-vote-%'
          AND COALESCE(content_type, 0) = 5
          AND tenant_id = 0
          AND organization_id = 0
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert!(
        vote_count >= 8,
        "installer must create default forum engagement votes"
    );

    let favorite_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_favorite
        WHERE uuid LIKE 'sdkwork-forum-favorite-%'
          AND COALESCE(content_type, 0) = 5
          AND tenant_id = 0
          AND organization_id = 0
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert!(
        favorite_count >= 4,
        "installer must create default forum collection examples"
    );

    let migration_status: String = sqlx::query_scalar(
        r#"
        SELECT status
        FROM system_schema_migration
        WHERE migration_key = ?
        "#,
    )
    .bind(format!("forum:{SCHEMA_VERSION}"))
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!("completed", migration_status);

    let store = SqliteForumStore::new(pool.clone());
    let posts = store
        .load_feeds(
            ForumFeedQuery {
                content_type: Some("feeds".to_owned()),
                keyword: Some("模型调用".to_owned()),
                page: Some(1),
                size: Some(10),
                ..ForumFeedQuery::default()
            },
            None,
        )
        .await
        .unwrap();
    assert!(
        posts
            .iter()
            .any(|post| post.title.contains("第一次模型调用")),
        "default tutorial posts must be visible through the forum read store"
    );

    let quick_start_post = posts
        .iter()
        .find(|post| post.title.contains("第一次模型调用"))
        .expect("quick-start tutorial must be returned by the forum read store");
    let quick_start_detail = store
        .load_feed_detail(quick_start_post.id, None)
        .await
        .unwrap()
        .expect("quick-start tutorial detail must be readable after install");
    assert!(
        quick_start_detail.content.contains("第一步")
            && quick_start_detail.content.contains("OpenAI 兼容接口"),
        "default tutorial detail must expose the full onboarding article body"
    );
}

fn bundled_catalog() -> sdkwork_models::ModelCatalog {
    sdkwork_models::load_bundled_catalog().unwrap()
}

fn sdkwork_app_seed_count() -> usize {
    let seed: serde_json::Value =
        serde_json::from_str(include_str!("../../../data/app/sdkwork-apps.json"))
            .expect("bundled app seed must parse");
    let declared_count = seed
        .get("count")
        .and_then(serde_json::Value::as_u64)
        .expect("bundled app seed must declare count") as usize;
    let actual_count = seed
        .get("apps")
        .and_then(serde_json::Value::as_array)
        .expect("bundled app seed must include apps")
        .len();
    assert_eq!(
        declared_count, actual_count,
        "bundled app seed count must match apps length"
    );
    actual_count
}

fn catalog_keys(catalog: &sdkwork_models::ModelCatalog) -> Vec<String> {
    let mut catalog_keys = catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            vendor.models.iter().map(|model| {
                sdkwork_models::catalog_key(
                    &vendor.vendor.vendor_code,
                    &vendor.vendor.region_code,
                    &model.model_id,
                )
            })
        })
        .collect::<Vec<_>>();
    catalog_keys.sort();
    catalog_keys
}

fn catalog_vendor_codes(catalog: &sdkwork_models::ModelCatalog) -> BTreeSet<String> {
    catalog
        .vendors
        .iter()
        .map(|vendor| vendor.vendor.vendor_code.clone())
        .collect()
}

fn catalog_routable_keys(catalog: &sdkwork_models::ModelCatalog) -> Vec<String> {
    let mut catalog_keys = catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            vendor
                .models
                .iter()
                .filter(|model| model.routing_state == "enabled" && model.shelf_state != "archived")
                .map(|model| {
                    sdkwork_models::catalog_key(
                        &vendor.vendor.vendor_code,
                        &vendor.vendor.region_code,
                        &model.model_id,
                    )
                })
        })
        .collect::<Vec<_>>();
    catalog_keys.sort();
    catalog_keys
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
struct CatalogPriceKey {
    catalog_key: String,
    meter_code: String,
    price_side: i32,
    pricing_scope: i32,
}

fn catalog_price_keys(catalog: &sdkwork_models::ModelCatalog) -> BTreeSet<CatalogPriceKey> {
    catalog
        .vendors
        .iter()
        .flat_map(|vendor| vendor.pricing.iter().map(move |pricing| (vendor, pricing)))
        .flat_map(|(vendor, pricing)| {
            let catalog_key = sdkwork_models::catalog_key(
                &vendor.vendor.vendor_code,
                &vendor.vendor.region_code,
                &pricing.model_id,
            );
            pricing.prices.iter().map(move |price| CatalogPriceKey {
                catalog_key: catalog_key.clone(),
                meter_code: price.meter_code.clone(),
                price_side: catalog_price_side_code(&price.price_side),
                pricing_scope: catalog_pricing_scope_code(price.pricing_scope.as_deref()),
            })
        })
        .collect()
}

fn catalog_price_side_code(value: &str) -> i32 {
    match value {
        "upstream" => 2,
        "customer" => 3,
        _ => 1,
    }
}

fn catalog_pricing_scope_code(value: Option<&str>) -> i32 {
    match value {
        Some("provider") => 2,
        Some("channel") => 3,
        Some("plan") => 4,
        _ => 1,
    }
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
struct CatalogRankingKey {
    snapshot_date: String,
    rank_scope: String,
    catalog_key: String,
}

fn catalog_ranking_keys(catalog: &sdkwork_models::ModelCatalog) -> BTreeSet<CatalogRankingKey> {
    let catalog_keys = catalog_keys(catalog).into_iter().collect::<BTreeSet<_>>();
    catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            vendor
                .rankings
                .iter()
                .map(move |snapshot| (vendor, snapshot))
        })
        .flat_map(|(vendor, snapshot)| {
            let catalog_keys = catalog_keys.clone();
            snapshot.items.iter().filter_map(move |item| {
                let catalog_key = sdkwork_models::catalog_key(
                    &vendor.vendor.vendor_code,
                    &vendor.vendor.region_code,
                    &item.model_id,
                );
                if catalog_keys.contains(&catalog_key) {
                    Some(CatalogRankingKey {
                        snapshot_date: snapshot.snapshot_date.clone(),
                        rank_scope: snapshot.rank_scope.clone(),
                        catalog_key,
                    })
                } else {
                    None
                }
            })
        })
        .collect()
}

fn single_vendor_catalog_root(vendor_code: &str) -> PathBuf {
    let millis = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis();
    let counter = CATALOG_ROOT_COUNTER.fetch_add(1, Ordering::Relaxed);
    let mut root = std::env::temp_dir();
    root.push(format!(
        "sdkwork-models-single-{vendor_code}-{millis}-{counter}"
    ));
    if root.exists() {
        fs::remove_dir_all(&root).unwrap();
    }
    fs::create_dir_all(root.join("models")).unwrap();
    fs::copy(
        sdkwork_models_source_root().join("sdkwork-models.json"),
        root.join("sdkwork-models.json"),
    )
    .unwrap();
    fs::copy(
        sdkwork_models_source_root()
            .join("models")
            .join("meters.json"),
        root.join("models").join("meters.json"),
    )
    .unwrap();
    copy_dir_recursive(
        &sdkwork_models_source_root()
            .join("models")
            .join(vendor_code),
        &root.join("models").join(vendor_code),
    );
    write_single_vendor_index_files(&root, vendor_code);
    root
}

fn remove_catalog_root(catalog_root: PathBuf) {
    if catalog_root.exists() {
        fs::remove_dir_all(catalog_root).unwrap();
    }
}

fn remove_model_from_catalog_root(catalog_root: &Path, vendor_code: &str, model: &str) {
    let vendor_root = catalog_root.join("models").join(vendor_code);
    for region_entry in fs::read_dir(&vendor_root).unwrap() {
        let region_entry = region_entry.unwrap();
        if !region_entry.file_type().unwrap().is_dir() {
            continue;
        }
        let region_root = region_entry.path();
        if !region_root.join("vendor.json").is_file() {
            continue;
        }
        remove_file_if_exists(region_root.join("models").join(format!("{model}.json")));
        remove_file_if_exists(region_root.join("pricing").join(format!("{model}.json")));
        let rankings_path = region_root.join("rankings.json");
        let mut rankings: serde_json::Value =
            serde_json::from_str(&fs::read_to_string(&rankings_path).unwrap()).unwrap();
        for snapshot in rankings["snapshots"].as_array_mut().unwrap() {
            let items = snapshot["items"].as_array_mut().unwrap();
            items.retain(|item| item["modelId"].as_str() != Some(model));
        }
        fs::write(
            rankings_path,
            serde_json::to_string_pretty(&rankings).unwrap(),
        )
        .unwrap();
    }
    write_single_vendor_index_files(catalog_root, vendor_code);
}

fn remove_file_if_exists(path: PathBuf) {
    if path.exists() {
        fs::remove_file(path).unwrap();
    }
}

fn sdkwork_models_source_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../../data/sdkwork-models")
}

fn copy_dir_recursive(from: &Path, to: &Path) {
    fs::create_dir_all(to).unwrap();
    for entry in fs::read_dir(from).unwrap() {
        let entry = entry.unwrap();
        let destination = to.join(entry.file_name());
        if entry.file_type().unwrap().is_dir() {
            copy_dir_recursive(&entry.path(), &destination);
        } else {
            fs::copy(entry.path(), destination).unwrap();
        }
    }
}

fn write_single_vendor_index_files(catalog_root: &Path, vendor_code: &str) {
    let source_models_root = sdkwork_models_source_root().join("models");
    let target_models_root = catalog_root.join("models");

    let mut index: serde_json::Value =
        serde_json::from_str(&fs::read_to_string(source_models_root.join("index.json")).unwrap())
            .unwrap();
    retain_vendor_region_entries(&mut index, vendor_code);
    refresh_index_counts(&mut index, vendor_code, &target_models_root);
    fs::write(
        target_models_root.join("index.json"),
        serde_json::to_string_pretty(&index).unwrap(),
    )
    .unwrap();

    let mut vendors: serde_json::Value =
        serde_json::from_str(&fs::read_to_string(source_models_root.join("vendors.json")).unwrap())
            .unwrap();
    retain_vendor_entries(&mut vendors, vendor_code);
    refresh_vendors_counts(&mut vendors, vendor_code, &target_models_root);
    fs::write(
        target_models_root.join("vendors.json"),
        serde_json::to_string_pretty(&vendors).unwrap(),
    )
    .unwrap();
}

fn retain_vendor_region_entries(payload: &mut serde_json::Value, vendor_code: &str) {
    let entries = payload["vendors"].as_array_mut().unwrap();
    entries.retain(|entry| entry["vendorCode"].as_str() == Some(vendor_code));
}

fn retain_vendor_entries(payload: &mut serde_json::Value, vendor_code: &str) {
    let entries = payload["vendors"].as_array_mut().unwrap();
    entries.retain(|entry| entry["vendorCode"].as_str() == Some(vendor_code));
}

fn refresh_index_counts(
    payload: &mut serde_json::Value,
    vendor_code: &str,
    target_models_root: &Path,
) {
    let mut model_count = 0usize;
    let mut pricing_count = 0usize;
    let mut region_count = 0usize;
    for entry in payload["vendors"].as_array_mut().unwrap() {
        let Some(region_code) = entry["regionCode"].as_str().map(str::to_owned) else {
            continue;
        };
        let counts = vendor_region_counts(target_models_root, vendor_code, &region_code);
        entry["modelCount"] = serde_json::json!(counts.model_count);
        entry["pricingFileCount"] = serde_json::json!(counts.pricing_file_count);
        entry["rankingSnapshotCount"] = serde_json::json!(counts.ranking_snapshot_count);
        entry["modelFiles"] = serde_json::json!(counts.model_files);
        entry["pricingFiles"] = serde_json::json!(counts.pricing_files);
        model_count += counts.model_count;
        pricing_count += counts.pricing_file_count;
        region_count += 1;
    }
    payload["vendorCount"] = serde_json::json!(if region_count == 0 { 0 } else { 1 });
    payload["regionCount"] = serde_json::json!(region_count);
    payload["modelCount"] = serde_json::json!(model_count);
    payload["pricingFileCount"] = serde_json::json!(pricing_count);
}

fn refresh_vendors_counts(
    payload: &mut serde_json::Value,
    vendor_code: &str,
    target_models_root: &Path,
) {
    for vendor in payload["vendors"].as_array_mut().unwrap() {
        let mut vendor_model_count = 0usize;
        let mut vendor_pricing_count = 0usize;
        let mut vendor_ranking_count = 0usize;
        for region in vendor["regions"].as_array_mut().unwrap() {
            let Some(region_code) = region["regionCode"].as_str().map(str::to_owned) else {
                continue;
            };
            let counts = vendor_region_counts(target_models_root, vendor_code, &region_code);
            region["modelCount"] = serde_json::json!(counts.model_count);
            region["pricingFileCount"] = serde_json::json!(counts.pricing_file_count);
            region["rankingSnapshotCount"] = serde_json::json!(counts.ranking_snapshot_count);
            vendor_model_count += counts.model_count;
            vendor_pricing_count += counts.pricing_file_count;
            vendor_ranking_count += counts.ranking_snapshot_count;
        }
        vendor["modelCount"] = serde_json::json!(vendor_model_count);
        vendor["pricingFileCount"] = serde_json::json!(vendor_pricing_count);
        vendor["rankingSnapshotCount"] = serde_json::json!(vendor_ranking_count);
    }
}

#[derive(Debug, Clone)]
struct VendorRegionCounts {
    model_count: usize,
    pricing_file_count: usize,
    ranking_snapshot_count: usize,
    model_files: Vec<String>,
    pricing_files: Vec<String>,
}

fn vendor_region_counts(
    target_models_root: &Path,
    vendor_code: &str,
    region_code: &str,
) -> VendorRegionCounts {
    let region_root = target_models_root.join(vendor_code).join(region_code);
    let model_files = json_file_refs(target_models_root, &region_root.join("models"));
    let pricing_files = json_file_refs(target_models_root, &region_root.join("pricing"));
    VendorRegionCounts {
        model_count: model_files.len(),
        pricing_file_count: pricing_files.len(),
        ranking_snapshot_count: ranking_snapshot_count(&region_root.join("rankings.json")),
        model_files,
        pricing_files,
    }
}

fn json_file_refs(target_models_root: &Path, path: &Path) -> Vec<String> {
    let mut refs: Vec<String> = fs::read_dir(path)
        .unwrap()
        .filter_map(Result::ok)
        .filter(|entry| entry.path().extension().and_then(|value| value.to_str()) == Some("json"))
        .map(|entry| {
            entry
                .path()
                .strip_prefix(target_models_root)
                .unwrap()
                .to_string_lossy()
                .replace('\\', "/")
        })
        .collect();
    refs.sort();
    refs
}

fn ranking_snapshot_count(path: &Path) -> usize {
    let rankings: serde_json::Value =
        serde_json::from_str(&fs::read_to_string(path).unwrap()).unwrap();
    rankings["snapshots"].as_array().unwrap().len()
}

async fn assert_table_exists(pool: &SqlitePool, table: &str) {
    let exists: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM sqlite_master
        WHERE type = 'table'
          AND name = ?
        "#,
    )
    .bind(table)
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!(1, exists, "{table} table must exist after installation");
}

async fn assert_sqlite_index_exists(pool: &SqlitePool, index: &str) {
    let exists: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM sqlite_master
        WHERE type = 'index'
          AND name = ?
        "#,
    )
    .bind(index)
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!(1, exists, "{index} index must exist after installation");
}

async fn assert_sqlite_columns_exist(pool: &SqlitePool, table: &str, expected_columns: &[&str]) {
    let columns = sqlite_table_columns(pool, table).await;
    for expected_column in expected_columns {
        assert!(
            columns.contains(&expected_column.to_string()),
            "{table}.{expected_column} column must exist after installation; actual columns: {columns:?}"
        );
    }
}

async fn assert_sqlite_index_columns(
    pool: &SqlitePool,
    index: &str,
    expected_unique: bool,
    expected_columns: &[&str],
) {
    assert_sqlite_index_exists(pool, index).await;
    let row = sqlx::query(
        r#"
        SELECT [unique] AS is_unique
        FROM pragma_index_list(?)
        WHERE name = ?
        "#,
    )
    .bind(index_table_name(pool, index).await)
    .bind(index)
    .fetch_one(pool)
    .await
    .unwrap();
    let unique = row.get::<i64, _>("is_unique") == 1;
    assert_eq!(
        expected_unique, unique,
        "{index} unique flag must match the schema contract"
    );

    let columns = sqlx::query(
        r#"
        SELECT name
        FROM pragma_index_info(?)
        ORDER BY seqno
        "#,
    )
    .bind(index)
    .fetch_all(pool)
    .await
    .unwrap()
    .into_iter()
    .map(|row| row.get::<String, _>("name"))
    .collect::<Vec<_>>();
    assert_eq!(
        expected_columns
            .iter()
            .map(|column| column.to_string())
            .collect::<Vec<_>>(),
        columns,
        "{index} column order must match the ranking refresh/read query contract"
    );
}

async fn sqlite_table_columns(pool: &SqlitePool, table: &str) -> BTreeSet<String> {
    sqlx::query(
        r#"
        SELECT name
        FROM pragma_table_info(?)
        "#,
    )
    .bind(table)
    .fetch_all(pool)
    .await
    .unwrap()
    .into_iter()
    .map(|row| row.get::<String, _>("name"))
    .collect()
}

async fn index_table_name(pool: &SqlitePool, index: &str) -> String {
    sqlx::query_scalar(
        r#"
        SELECT tbl_name
        FROM sqlite_master
        WHERE type = 'index'
          AND name = ?
        "#,
    )
    .bind(index)
    .fetch_one(pool)
    .await
    .unwrap()
}
