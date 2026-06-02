use sdkwork_claw_product::application::{PasswordHasher, Pbkdf2Sha256PasswordHasher};
use sdkwork_claw_product::domain::DecimalValue;
use sdkwork_claw_product::infrastructure::sql::installer::{
    CatalogRefreshOptions, DatabaseInstallOptions, DatabaseInstaller, InstallationStatus,
};
use sdkwork_claw_product::infrastructure::sql::sqlite::{
    SqliteAdminMarketingStore, SqliteAdminUserStore, SqliteAppSkillsReadStore, SqliteForumStore,
    SqlitePricingCatalogLoader,
};
use sdkwork_claw_product::ports::{
    AdminMarketingStore, AdminMarketingSubject, AdminUserStore, AdminUserSubject, AppSkillsQuery,
    AppSkillsReadStore, AppSkillsSubject, CreateAdminUserApiKeyCommand, CreateAdminUserCommand,
    ForumFeedQuery, ForumFeedReadStore, ListAdminUsersQuery, PricingCatalog,
    UpdateAdminUserCommand,
};
use sdkwork_claw_product_test_support::repair_sqlite_pool;
use sdkwork_commerce_bootstrap::{
    commerce_payment_channel_seeds, commerce_payment_method_seeds,
    commerce_payment_provider_account_seeds, commerce_payment_provider_seeds,
    commerce_payment_route_rule_seeds, membership_package_group_seeds, membership_plan_seeds,
};
use sdkwork_commerce_storage_sqlx::commerce_database_tables;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::{Row, SqlitePool};
use std::collections::{BTreeMap, BTreeSet};
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

const SCHEMA_VERSION: &str = "2026.05.08.1";
const CATALOG_VERSION: &str = "2026.05.08.1";

static CATALOG_ROOT_COUNTER: AtomicU64 = AtomicU64::new(0);

fn legacy_channel_group_table(prefix: &str, suffix: &str) -> String {
    format!("{prefix}{}{suffix}", "api_key_")
}

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
    assert_table_exists(&pool, "ai_model_capability").await;
    assert_table_exists(&pool, "ai_model_vendor").await;
    assert_table_exists(&pool, "ai_billing_meter").await;
    assert_table_exists(&pool, "ai_model_pricing").await;
    assert_table_exists(&pool, "ai_usage_fact").await;
    assert_table_exists(&pool, "ai_model_rank_snapshot").await;
    assert_table_exists(&pool, "ai_channel_group").await;
    assert_table_exists(&pool, "ai_channel_group_member").await;
    assert_table_exists(&pool, "ai_channel_group_metric_snapshot").await;
    assert_table_absent(&pool, &legacy_channel_group_table("iam_gateway_", "group")).await;
    assert_table_absent(&pool, &legacy_channel_group_table("iam_", "group_channel")).await;
    assert_table_absent(
        &pool,
        &legacy_channel_group_table("iam_gateway_", "group_metric_snapshot"),
    )
    .await;
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
    assert_table_exists(&pool, "ai_chat_conversation").await;
    assert_table_exists(&pool, "ai_chat_turn").await;
    assert_table_exists(&pool, "ai_chat_message").await;
    assert_table_exists(&pool, "ai_agent_session").await;
    assert_table_exists(&pool, "ai_agent_run").await;
    assert_table_exists(&pool, "ai_agent_run_step").await;
    assert_table_exists(&pool, "ai_memory_space").await;
    assert_table_exists(&pool, "ai_memory_entry").await;
    assert_table_exists(&pool, "ai_runtime_invocation").await;
    assert_table_exists(&pool, "ai_runtime_invocation_event").await;
    assert_table_exists(&pool, "ai_runtime_usage_link").await;
    assert_table_exists(&pool, "ai_runtime_artifact").await;
    for table in commerce_database_tables() {
        assert_table_exists(&pool, table).await;
    }
    assert_sqlite_index_exists(&pool, "idx_ai_model_public_rank_desc").await;
    assert_sqlite_index_exists(&pool, "idx_ai_model_catalog_search").await;
    assert_sqlite_index_exists(&pool, "idx_ai_model_rank_snapshot_latest_scope").await;
    assert_sqlite_index_exists(&pool, "idx_ai_model_rank_snapshot_filter_rank").await;
    assert_sqlite_index_exists(&pool, "idx_ops_job_execution_model_ranking_scope_started").await;
    assert_sqlite_index_exists(&pool, "idx_app_user_id").await;
    assert_sqlite_index_exists(&pool, "idx_app_project_id").await;
    assert_sqlite_index_exists(&pool, "idx_app_status").await;
    assert_sqlite_index_exists(&pool, "idx_category_type_shop").await;
    assert_sqlite_index_exists(&pool, "uk_ops_notification_delivery_user_message_app").await;
    assert_sqlite_index_exists(&pool, "uk_plus_agent_skill_key").await;
    assert_sqlite_index_exists(&pool, "idx_plus_agent_skill_market").await;
    assert_sqlite_index_exists(&pool, "uk_plus_user_agent_skill").await;
    assert_sqlite_index_exists(&pool, "uk_ai_runtime_usage_link_agent_scope").await;
    assert_sqlite_index_exists(&pool, "idx_commerce_order_owner_status_created_at").await;
    assert_sqlite_columns_absent(&pool, "ai_model", &["region_code"]).await;
    assert_sqlite_columns_absent(&pool, "ai_model_capability", &["region_code"]).await;
    assert_sqlite_columns_absent(&pool, "ai_model_vendor", &["region_code"]).await;
    assert_sqlite_columns_absent(&pool, "ai_model_family", &["region_code"]).await;
    assert_table_exists(&pool, "ai_modality").await;
    assert_table_exists(&pool, "ai_api_endpoint").await;
    assert_table_exists(&pool, "ai_resource").await;
    assert_table_exists(&pool, "ai_resource_group").await;
    assert_table_exists(&pool, "ai_resource_group_item").await;
    assert_table_exists(&pool, "ai_channel_vendor").await;
    assert_table_exists(&pool, "ai_channel_resource").await;
    assert_table_exists(&pool, "ai_channel_endpoint").await;
    assert_sqlite_columns_exist(
        &pool,
        "ai_channel_endpoint",
        &[
            "channel_id",
            "provider_code",
            "channel_code",
            "channel_type",
            "vendor_code",
            "region_code",
            "api_code",
            "base_url",
            "priority",
            "weight",
            "health_status",
        ],
    )
    .await;
    assert_sqlite_index_exists(&pool, "uk_ai_channel_endpoint_scope").await;
    assert_sqlite_index_columns(
        &pool,
        "uk_ai_channel_endpoint_scope",
        true,
        &[
            "tenant_id",
            "organization_id",
            "channel_id",
            "vendor_code",
            "region_code",
            "api_code",
        ],
    )
    .await;
    assert_sqlite_index_exists(&pool, "idx_ai_channel_endpoint_lookup").await;
    assert_sqlite_index_columns(
        &pool,
        "idx_ai_channel_endpoint_lookup",
        false,
        &[
            "tenant_id",
            "organization_id",
            "status",
            "channel_id",
            "vendor_code",
            "region_code",
            "api_code",
            "priority",
            "weight",
            "id",
        ],
    )
    .await;
    assert_sqlite_columns_exist(
        &pool,
        "ai_channel_model",
        &["provider_native_model", "api_code"],
    )
    .await;
    assert_sqlite_columns_exist(&pool, "ai_model_pricing", &["region_code"]).await;
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
        "iam_organization_member",
        &[
            "organization_id",
            "user_id",
            "role_code",
            "status",
            "joined_at",
            "left_at",
            "remark",
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
            "icon_media_resource_id",
            "icon_object_blob_id",
            "icon_resource_snapshot",
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
            "artifact_media_resource_id",
            "artifact_object_blob_id",
            "artifact_resource_snapshot",
        ],
    )
    .await;
    assert_sqlite_columns_exist(
        &pool,
        "ai_runtime_usage_link",
        &[
            "tenant_id",
            "organization_id",
            "user_id",
            "agent_session_id",
            "agent_run_id",
            "agent_run_step_id",
            "usage_fact_id",
            "usage_type",
            "input_tokens",
            "output_tokens",
            "total_tokens",
        ],
    )
    .await;
    assert_sqlite_columns_exist(
        &pool,
        "ai_memory_space",
        &[
            "tenant_id",
            "organization_id",
            "user_id",
            "owner_type",
            "owner_id",
        ],
    )
    .await;
    assert_sqlite_columns_exist(
        &pool,
        "ai_memory_entry",
        &[
            "tenant_id",
            "organization_id",
            "user_id",
            "space_id",
            "memory_code",
        ],
    )
    .await;
    assert_sqlite_columns_exist(
        &pool,
        "ai_memory_event",
        &[
            "tenant_id",
            "organization_id",
            "user_id",
            "memory_id",
            "space_id",
        ],
    )
    .await;
    assert_sqlite_columns_exist(
        &pool,
        "ai_memory_link",
        &[
            "tenant_id",
            "organization_id",
            "user_id",
            "memory_id",
            "link_type",
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
            "vendor_code",
            "region_code",
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
    assert_sqlite_usage_link_agent_scope_index(&pool).await;

    let catalog = bundled_catalog();
    assert_catalog_rows(&pool, &catalog).await;
    assert_app_store_seed_rows(&pool).await;
    assert_skill_store_seed_rows(&pool).await;
    assert_skill_store_seed_visible_to_app_tenants(&pool).await;
    assert_forum_tutorial_seed_rows(&pool).await;
    assert_commerce_experience_seed_rows(&pool).await;
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
    assert_eq!(catalog_model_keys(&catalog).len() as i64, model_count_again);
}

#[tokio::test]
async fn sqlite_installer_bootstraps_initial_admin_login_once() {
    let pool = sqlite_pool().await;
    let installer =
        installer(pool.clone()).with_bootstrap_admin_password("Admin-Init-Test-Password-2026!");

    let installed = installer.ensure_installed().await.unwrap();

    let bootstrap = installed
        .bootstrap_admin
        .expect("first install must expose one-time bootstrap admin credentials");
    assert_eq!("created", bootstrap.status);
    assert_eq!("admin", bootstrap.username);
    assert_eq!("10", bootstrap.tenant_id);
    assert_eq!("20", bootstrap.organization_id);
    assert_eq!("Admin-Init-Test-Password-2026!", bootstrap.initial_password);

    let admin = sqlx::query(
        r#"
        SELECT
            u.id,
            u.tenant_id,
            u.username,
            u.display_name,
            u.email,
            u.status,
            m.organization_id,
            m.role_code,
            c.credential_hash
        FROM iam_user u
        JOIN iam_organization_member m
          ON m.tenant_id = u.tenant_id
         AND m.user_id = u.id
         AND m.status = 'active'
        JOIN iam_credential c
          ON c.tenant_id = u.tenant_id
         AND c.user_id = u.id
         AND c.credential_type = 'password'
         AND c.status = 'active'
        WHERE u.tenant_id = '10'
          AND u.username = 'admin'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();

    assert_eq!("1", admin.get::<String, _>("id"));
    assert_eq!("10", admin.get::<String, _>("tenant_id"));
    assert_eq!("admin", admin.get::<String, _>("username"));
    assert_eq!("Administrator", admin.get::<String, _>("display_name"));
    assert_eq!("admin@sdkwork.com", admin.get::<String, _>("email"));
    assert_eq!("active", admin.get::<String, _>("status"));
    assert_eq!("20", admin.get::<String, _>("organization_id"));
    assert_eq!("admin", admin.get::<String, _>("role_code"));
    assert!(
        Pbkdf2Sha256PasswordHasher
            .verify_password(
                "Admin-Init-Test-Password-2026!",
                &admin.get::<String, _>("credential_hash"),
            )
            .unwrap(),
        "bootstrap password must be stored with the normal IAM password hash format"
    );

    let installed_again = installer.ensure_installed().await.unwrap();
    assert!(
        installed_again.bootstrap_admin.is_none(),
        "bootstrap password must not be returned after the admin account already exists"
    );
}

#[tokio::test]
async fn sqlite_installed_admin_user_store_lists_iam_bootstrap_admin_without_plus_user() {
    let pool = repair_sqlite_pool().await;

    let legacy_plus_user_exists: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM sqlite_master
        WHERE type = 'table'
          AND name = 'plus_user'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        0, legacy_plus_user_exists,
        "fresh appbase installs should not require the legacy plus_user table"
    );

    let store = SqliteAdminUserStore::new(pool.clone());
    let users = store
        .list_users(ListAdminUsersQuery {
            subject: AdminUserSubject {
                tenant_id: 10,
                organization_id: 20,
                operator_id: 1,
                operator_type: 1,
            },
        })
        .await
        .unwrap();

    let admin = users
        .iter()
        .find(|user| user.id == 1)
        .expect("bootstrap admin must be visible through admin user read store");
    assert_eq!("admin", admin.username);
    assert_eq!("admin@sdkwork.com", admin.email);
    assert_eq!("admin", admin.role);
    assert_eq!("admin", admin.group);
    assert_eq!("active", admin.status);
}

#[tokio::test]
async fn sqlite_admin_user_store_creates_and_updates_iam_users_without_plus_user() {
    let pool = repair_sqlite_pool().await;
    let store = SqliteAdminUserStore::new(pool.clone());
    let subject = AdminUserSubject {
        tenant_id: 10,
        organization_id: 20,
        operator_id: 1,
        operator_type: 1,
    };

    let created = store
        .create_user(CreateAdminUserCommand {
            user_uuid: "user-admin-create-iam".to_owned(),
            account_uuid: "account-admin-create-iam".to_owned(),
            audit_log_uuid: "audit-admin-create-iam".to_owned(),
            subject,
            email: "created-admin-user@example.com".to_owned(),
            username: "created-admin-user".to_owned(),
            initial_balance: DecimalValue::ZERO,
            requested_at: "2026-05-17T10:00:00Z".to_owned(),
            request_id: "request-admin-create-iam".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("created-admin-user", created.username);
    assert_eq!("created-admin-user@example.com", created.email);
    assert_eq!("user", created.role);
    assert_eq!("standard", created.group);
    assert_eq!(
        "$0.00", created.balance,
        "fresh appbase installs do not include the external legacy ledger tables"
    );

    let iam_user_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM iam_user u
        JOIN iam_organization_member m
          ON m.tenant_id = u.tenant_id
         AND m.user_id = u.id
        WHERE u.id = ?
          AND u.tenant_id = '10'
          AND m.organization_id = '20'
          AND m.role_code = 'standard'
        "#,
    )
    .bind(created.id.to_string())
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1, iam_user_count);

    let updated = store
        .update_user(UpdateAdminUserCommand {
            audit_log_uuid: "audit-admin-update-iam".to_owned(),
            subject,
            user_id: created.id,
            username: Some("renamed-admin-user".to_owned()),
            group: Some("vip".to_owned()),
            status: Some("banned".to_owned()),
            requested_at: "2026-05-17T10:05:00Z".to_owned(),
            request_id: "request-admin-update-iam".to_owned(),
        })
        .await
        .unwrap()
        .expect("created IAM user must be updateable through admin user store");

    assert_eq!("renamed-admin-user", updated.username);
    assert_eq!("vip", updated.group);
    assert_eq!("user", updated.role);
    assert_eq!("banned", updated.status);

    let membership_role: String = sqlx::query_scalar(
        r#"
        SELECT role_code
        FROM iam_organization_member
        WHERE tenant_id = '10'
          AND organization_id = '20'
          AND user_id = ?
        "#,
    )
    .bind(created.id.to_string())
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("vip", membership_role);
}

#[tokio::test]
async fn sqlite_admin_user_store_creates_default_channel_group_when_missing() {
    let pool = repair_sqlite_pool().await;
    let store = SqliteAdminUserStore::new(pool.clone());
    let subject = AdminUserSubject {
        tenant_id: 10,
        organization_id: 20,
        operator_id: 1,
        operator_type: 1,
    };

    sqlx::query("DELETE FROM ai_channel_group")
        .execute(&pool)
        .await
        .unwrap();

    let created = store
        .create_api_key(CreateAdminUserApiKeyCommand {
            api_key_uuid: "api-key-admin-default-group".to_owned(),
            audit_log_uuid: "audit-admin-default-group".to_owned(),
            subject,
            user_id: 1,
            name: "Admin Console Key".to_owned(),
            key_prefix: "sk-test".to_owned(),
            key_display_masked: "sk-test********".to_owned(),
            key_hash: "hash-admin-default-group".to_owned(),
            hash_alg: "sha256".to_owned(),
            secret_version: 1,
            idempotency_key: "idem-admin-default-group".to_owned(),
            requested_at: "2026-05-17T10:10:00Z".to_owned(),
            request_id: "request-admin-default-group".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("Admin Console Key", created.name);
    assert_eq!(1, created.user_id);
    assert_eq!("sk-test********", created.key);

    let group = sqlx::query(
        r#"
        SELECT
            id,
            group_code,
            group_name,
            pricing_plan_code,
            printf('%.6f', rate_multiplier) AS rate_multiplier,
            printf('%.6f', official_price_multiplier) AS official_price_multiplier
        FROM ai_channel_group
        WHERE tenant_id = 10
          AND organization_id = 20
          AND group_code = 'default'
          AND status = 1
          AND deleted_at IS NULL
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("default", group.get::<String, _>("group_code"));
    assert_eq!("Default", group.get::<String, _>("group_name"));
    assert_eq!("standard", group.get::<String, _>("pricing_plan_code"));
    assert_eq!("1.000000", group.get::<String, _>("rate_multiplier"));
    assert_eq!(
        "1.000000",
        group.get::<String, _>("official_price_multiplier")
    );

    let channel_group_id: i64 = sqlx::query_scalar(
        r#"
        SELECT channel_group_id
        FROM iam_gateway_api_key
        WHERE id = ?
        "#,
    )
    .bind(created.id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(group.get::<i64, _>("id"), channel_group_id);
}

#[tokio::test]
async fn sqlite_installer_repairs_incomplete_bootstrap_admin_login() {
    let pool = repair_sqlite_pool().await;
    let installer =
        installer(pool.clone()).with_bootstrap_admin_password("Admin-Repair-Test-Password-2026!");

    sqlx::query(
        r#"
        UPDATE iam_user_identity
        SET id = 'identity-1-email'
        WHERE tenant_id = '10'
          AND user_id = '1'
          AND provider = 'email'
          AND subject = 'admin@sdkwork.com'
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        DELETE FROM iam_credential
        WHERE tenant_id = '10'
          AND user_id = '1'
          AND credential_type = 'password'
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        DELETE FROM iam_organization_member
        WHERE tenant_id = '10'
          AND user_id = '1'
          AND organization_id = '20'
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "startup status must detect incomplete bootstrap admin login state"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    let bootstrap = repaired
        .bootstrap_admin
        .expect("repair must expose the one-time password that was written");
    assert_eq!("1", bootstrap.user_id);
    assert_eq!("admin", bootstrap.username);
    assert_eq!(
        "Admin-Repair-Test-Password-2026!",
        bootstrap.initial_password
    );

    let admin_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM iam_user
        WHERE tenant_id = '10'
          AND username = 'admin'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        1, admin_count,
        "bootstrap repair must reuse the existing admin user instead of creating a duplicate"
    );

    let repaired_admin = sqlx::query(
        r#"
        SELECT
            m.role_code,
            c.credential_hash
        FROM iam_user u
        JOIN iam_organization_member m
          ON m.tenant_id = u.tenant_id
         AND m.user_id = u.id
         AND m.status = 'active'
        JOIN iam_credential c
          ON c.tenant_id = u.tenant_id
         AND c.user_id = u.id
         AND c.credential_type = 'password'
         AND c.status = 'active'
        WHERE u.tenant_id = '10'
          AND u.id = '1'
          AND u.username = 'admin'
          AND m.organization_id = '20'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("admin", repaired_admin.get::<String, _>("role_code"));
    assert_pbkdf2_sha256_hash_format(
        &repaired_admin.get::<String, _>("credential_hash"),
        "repaired admin password",
    );

    let repaired_again = installer.ensure_installed().await.unwrap();
    assert!(
        repaired_again.bootstrap_admin.is_none(),
        "repair password must not be returned after the admin login state is complete"
    );
}

#[tokio::test]
async fn sqlite_installer_repairs_bootstrap_admin_membership_without_resetting_password() {
    let pool = repair_sqlite_pool().await;
    let installer =
        installer(pool.clone()).with_bootstrap_admin_password("Admin-Original-Password-2026!");

    let original_hash: String = sqlx::query_scalar(
        r#"
        SELECT credential_hash
        FROM iam_credential
        WHERE tenant_id = '10'
          AND user_id = '1'
          AND credential_type = 'password'
          AND status = 'active'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        UPDATE iam_organization_member
        SET id = 'member-1',
            role_code = 'owner'
        WHERE tenant_id = '10'
          AND user_id = '1'
          AND organization_id = '20'
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "startup status must detect incomplete bootstrap admin membership state"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert!(
        repaired.bootstrap_admin.is_none(),
        "membership-only repair must not expose or reset the existing admin password"
    );
    let repaired_hash: String = sqlx::query_scalar(
        r#"
        SELECT credential_hash
        FROM iam_credential
        WHERE tenant_id = '10'
          AND user_id = '1'
          AND credential_type = 'password'
          AND status = 'active'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        original_hash, repaired_hash,
        "membership-only repair must preserve the existing admin password hash"
    );
    let member_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM iam_organization_member
        WHERE tenant_id = '10'
          AND user_id = '1'
          AND organization_id = '20'
          AND role_code = 'admin'
          AND status = 'active'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1, member_count);
}

#[tokio::test]
async fn sqlite_installer_reset_admin_password_rotates_existing_password() {
    let pool = repair_sqlite_pool().await;
    let installer =
        installer(pool.clone()).with_bootstrap_admin_password("Admin-Original-Password-2026!");

    let original_hash: String = active_admin_password_hash(&pool).await;
    assert_pbkdf2_sha256_hash_format(&original_hash, "original admin password");

    let report = installer
        .reset_admin_password(
            "admin",
            "Administrator",
            "admin@sdkwork.com",
            "Admin-Rotated-Password-2026!",
        )
        .await
        .unwrap();

    assert_eq!("reset", report.status);
    assert_eq!("admin", report.username);
    assert_eq!("admin@sdkwork.com", report.email);
    assert_eq!("1", report.user_id);
    assert_eq!("10", report.tenant_id);
    assert_eq!("20", report.organization_id);
    assert_eq!("Admin-Rotated-Password-2026!", report.initial_password);
    assert_eq!(false, report.generated_password);

    let rotated_hash: String = active_admin_password_hash(&pool).await;
    assert_ne!(
        original_hash, rotated_hash,
        "reset-admin must write a new password hash"
    );
    assert_pbkdf2_sha256_hash_format(&rotated_hash, "rotated admin password");

    let active_password_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM iam_credential
        WHERE tenant_id = '10'
          AND user_id = '1'
          AND credential_type = 'password'
          AND status = 'active'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        1, active_password_count,
        "reset-admin must leave exactly one active password credential"
    );

    let rotated_password_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM iam_credential
        WHERE tenant_id = '10'
          AND user_id = '1'
          AND credential_type = 'password'
          AND status = 'rotated'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert!(
        rotated_password_count >= 1,
        "reset-admin must retain old password credentials as rotated audit history"
    );
}

#[tokio::test]
async fn sqlite_installer_reset_admin_password_bootstraps_empty_database() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());

    let report = installer
        .reset_admin_password(
            "admin",
            "Administrator",
            "admin@sdkwork.com",
            "Admin-Reset-Empty-Db-2026!",
        )
        .await
        .unwrap();

    assert_eq!("reset", report.status);
    assert_eq!("admin", report.username);
    assert_eq!("admin@sdkwork.com", report.email);
    assert_eq!("10", report.tenant_id);
    assert_eq!("20", report.organization_id);
    assert_eq!(
        InstallationStatus::Installed,
        installer.status().await.unwrap()
    );

    let password_hash = active_admin_password_hash(&pool).await;
    assert_pbkdf2_sha256_hash_format(&password_hash, "reset-admin on an empty database password");
}

#[tokio::test]
async fn sqlite_installer_bootstraps_admin_without_touching_existing_plus_user_table() {
    let pool = sqlite_pool().await;
    sqlx::query(
        r#"
        CREATE TABLE plus_user (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            nickname TEXT,
            username TEXT,
            email TEXT,
            phone TEXT,
            avatar TEXT,
            password TEXT,
            salt TEXT,
            status INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        INSERT INTO plus_user
            (id, uuid, tenant_id, organization_id, nickname, username, email, phone, avatar, password, salt, status, created_at, updated_at)
        VALUES
            (99, 'legacy-user-99', 10, 20, 'Legacy User', 'legacy-user', 'legacy@example.com', '', '', '', '', 1, '2026-05-17T00:00:00Z', '2026-05-17T00:00:00Z')
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let installer =
        installer(pool.clone()).with_bootstrap_admin_password("Admin-No-Compat-Test-2026!");

    let installed = installer.ensure_installed().await.unwrap();

    assert_eq!(InstallationStatus::Installed, installed.status);
    let bootstrap = installed
        .bootstrap_admin
        .expect("existing plus_user table must not skip IAM bootstrap admin creation");
    assert_eq!("created", bootstrap.status);
    assert_eq!("1", bootstrap.user_id);

    let iam_admin = sqlx::query(
        r#"
        SELECT u.username, u.display_name, u.email, u.status, m.role_code
        FROM iam_user u
        JOIN iam_organization_member m
          ON m.tenant_id = u.tenant_id
         AND m.user_id = u.id
        WHERE u.id = '1'
          AND u.tenant_id = '10'
          AND m.organization_id = '20'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("admin", iam_admin.get::<String, _>("username"));
    assert_eq!("Administrator", iam_admin.get::<String, _>("display_name"));
    assert_eq!("admin@sdkwork.com", iam_admin.get::<String, _>("email"));
    assert_eq!("active", iam_admin.get::<String, _>("status"));
    assert_eq!("admin", iam_admin.get::<String, _>("role_code"));

    let legacy_rows: i64 = sqlx::query_scalar("SELECT COUNT(1) FROM plus_user")
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(
        1, legacy_rows,
        "IAM bootstrap must not mirror users into legacy plus_user"
    );

    let mirrored_admin_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM plus_user WHERE username = 'admin'")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(
        0, mirrored_admin_count,
        "plus_user is not an identity source and must not receive bootstrap admin rows"
    );
}

#[tokio::test]
async fn sqlite_installer_keeps_model_catalog_vendor_scoped_and_pricing_region_scoped() {
    let pool = repair_sqlite_pool().await;

    let rows = sqlx::query(
        r#"
        SELECT model, catalog_key, vendor_code
        FROM ai_model
        WHERE model = 'MiniMax-M2.7'
          AND status = 1
        ORDER BY catalog_key
        "#,
    )
    .fetch_all(&pool)
    .await
    .unwrap();

    assert_eq!(
        1,
        rows.len(),
        "ai_model must keep one active row per vendor/model catalog key"
    );
    assert_eq!("minimax", rows[0].get::<String, _>("vendor_code"));
    assert_eq!(
        "minimax/MiniMax-M2.7",
        rows[0].get::<String, _>("catalog_key")
    );

    let currencies = sqlx::query(
        r#"
        SELECT catalog_key, region_code, currency
        FROM ai_model_pricing
        WHERE model = 'MiniMax-M2.7'
          AND billing_meter_code = 'llm_input_token'
          AND price_side = 1
          AND status = 1
        ORDER BY region_code, currency
        "#,
    )
    .fetch_all(&pool)
    .await
    .unwrap()
    .into_iter()
    .map(|row| {
        (
            row.get::<String, _>("catalog_key"),
            row.get::<String, _>("region_code"),
            row.get::<String, _>("currency"),
        )
    })
    .collect::<Vec<_>>();

    assert_eq!(
        vec![
            (
                "minimax/MiniMax-M2.7".to_owned(),
                "cn".to_owned(),
                "CNY".to_owned()
            ),
            (
                "minimax/MiniMax-M2.7".to_owned(),
                "global".to_owned(),
                "USD".to_owned()
            ),
        ],
        currencies,
        "regional MiniMax prices must preserve each vendor's billing currency"
    );
}

#[tokio::test]
async fn sqlite_installer_imports_course_comment_seed_with_canonical_scope_fields() {
    let pool = repair_sqlite_pool().await;

    let comment = sqlx::query(
        r#"
        SELECT tenant_id, organization_id, data_scope, user_id, content_type, content_id, status, likes, reply_count, is_top
        FROM plus_comments
        WHERE id = 30006001
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(0, comment.get::<i64, _>("tenant_id"));
    assert_eq!(0, comment.get::<i64, _>("organization_id"));
    assert_eq!(0, comment.get::<i64, _>("data_scope"));
    assert_eq!(301, comment.get::<i64, _>("user_id"));
    assert_eq!(6, comment.get::<i64, _>("content_type"));
    assert_eq!(30001001, comment.get::<i64, _>("content_id"));
    assert_eq!(1, comment.get::<i64, _>("status"));
    assert_eq!(8, comment.get::<i64, _>("likes"));
    assert_eq!(0, comment.get::<i64, _>("reply_count"));
    assert_eq!(0, comment.get::<i64, _>("is_top"));
}

#[tokio::test]
async fn sqlite_installer_repairs_drifted_course_relation_seed_identity_on_startup_check() {
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());
    let catalog = bundled_catalog();
    let deleted_catalog_keys = catalog_model_keys(&catalog)
        .into_iter()
        .take(2)
        .collect::<Vec<_>>();

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
async fn sqlite_installer_repairs_missing_regional_model_price_rows_on_startup_check() {
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());
    let missing_price_uuid = duplicate_regional_price_uuid(&pool).await;

    sqlx::query("DELETE FROM ai_model_pricing WHERE uuid = ?")
        .bind(&missing_price_uuid)
        .execute(&pool)
        .await
        .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect a missing regional price row even when another region still has the same model/meter/side/scope"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);

    let repaired_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM ai_model_pricing WHERE uuid = ? AND status = 1")
            .bind(&missing_price_uuid)
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(1, repaired_count);
}

#[tokio::test]
async fn sqlite_installer_imports_model_catalog_capability_projection_rows() {
    let pool = sqlite_pool().await;
    let installer = installer(pool.clone());
    let catalog = bundled_catalog();

    installer.ensure_installed().await.unwrap();

    assert_catalog_capability_projection_rows(&pool, &catalog).await;
}

#[tokio::test]
async fn sqlite_installer_repairs_missing_model_catalog_capability_projection_rows_on_startup_check(
) {
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());
    let catalog = bundled_catalog();
    let model_resource_code = catalog_model_resource_codes(&catalog)
        .into_iter()
        .next()
        .expect("bundled catalog must expose a model AI resource");

    sqlx::query("DELETE FROM ai_model_api_endpoint")
        .execute(&pool)
        .await
        .unwrap();
    sqlx::query("DELETE FROM ai_resource WHERE resource_code = ?")
        .bind(&model_resource_code)
        .execute(&pool)
        .await
        .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect missing model catalog endpoint/resource projections"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);

    assert_catalog_capability_projection_rows(&pool, &catalog).await;
}

#[tokio::test]
async fn sqlite_installer_repairs_missing_default_channel_endpoints_on_startup_check() {
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

    sqlx::query(
        r#"
        DELETE FROM ai_channel_endpoint
        WHERE tenant_id = 10
          AND organization_id = 20
          AND json_extract(metadata, '$.catalogCode') = 'sdkwork-ai-routing'
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO ai_channel
            (id, uuid, tenant_id, organization_id, provider_code, channel_code, channel_name, channel_type, status)
        VALUES
            (999003, 'test-shadow-openai-channel', 10, 20, 'openai', 'openai-shadow', 'OpenAI shadow', 'official', 0)
        ON CONFLICT(tenant_id, organization_id, channel_code) DO UPDATE SET
            deleted_at = NULL
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO ai_channel_endpoint
            (uuid, tenant_id, organization_id, data_scope, status, metadata,
             channel_id, provider_code, channel_code, channel_type, vendor_code, region_code,
             api_code, base_url, priority, weight, health_status)
        SELECT
            'test-shadow-default-endpoint-' || e.endpoint_code,
            10,
            20,
            1,
            0,
            '{"catalogCode":"sdkwork-ai-routing","itemType":"wrong_channel_shadow"}',
            999003,
            'openai',
            'openai-shadow',
            'official',
            'openai',
            'global',
            e.endpoint_code,
            'https://api.openai.com/v1',
            100,
            100,
            1
        FROM ai_api_endpoint e
        WHERE e.tenant_id = 0
          AND e.organization_id = 0
          AND e.endpoint_code LIKE 'openai.%'
          AND e.deleted_at IS NULL
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect missing default admin channel endpoint seed rows attached to openai-default"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);

    let repaired_endpoint_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ai_channel_endpoint e
        INNER JOIN ai_channel c
          ON c.id = e.channel_id
         AND c.tenant_id = e.tenant_id
         AND c.organization_id = e.organization_id
        WHERE e.tenant_id = 10
          AND e.organization_id = 20
          AND e.vendor_code = 'openai'
          AND e.region_code = 'global'
          AND e.base_url = 'https://api.openai.com/v1'
          AND e.status = 0
          AND e.deleted_at IS NULL
          AND c.channel_code = 'openai-default'
          AND c.deleted_at IS NULL
          AND json_extract(e.metadata, '$.catalogCode') = 'sdkwork-ai-routing'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert!(
        repaired_endpoint_count >= 3,
        "startup repair must restore the default admin channel endpoints"
    );
}

#[tokio::test]
async fn sqlite_installer_repairs_missing_skills_seed_rows_on_startup_check() {
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
async fn sqlite_installer_repairs_core_skill_seed_without_reimporting_full_skill_catalog_when_payload_current(
) {
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

    let lean_skill_count = sqlite_core_skill_seed_row_count(&pool).await;
    assert_eq!(
        3, lean_skill_count,
        "lean startup repair fixture must retain only the canonical core skill rows"
    );

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
        "installer status must detect drift in the core startup skills seed"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);
    assert_eq!(
        3,
        sqlite_core_skill_seed_row_count(&pool).await,
        "payload-current startup repair must not reimport the full bundled skills catalog"
    );
    assert_skill_store_seed_rows(&pool).await;
}

#[tokio::test]
async fn sqlite_installer_repairs_missing_forum_tutorial_seed_rows_on_startup_check() {
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
            (uuid, tenant_id, organization_id, data_scope, status, metadata, target_type, target_id, artifact_type, version, platform_type, os_name, artifact_ref, artifact_media_resource_id, artifact_object_blob_id, artifact_resource_snapshot, artifact_size_bytes, published_at)
        VALUES
            ('sdkapp-artifact-stale-video-cut-windows', 20001, 0, 0, 1, '{"seedKind":"sdkwork.plus_app.seed","itemType":"app_artifact","appKey":"sdkwork-video-cut","sourceHash":"old"}', 15, ?, 1, '0.1.4', 'DESKTOP_WINDOWS', 'desktop-windows-x64', 'desktop-windows-msi', 'stale-video-cut-windows-artifact', NULL, '{"kind":"document","source":"external_url","url":"https://cdn.example.test/stale/video-cut.msi","publicUrl":"https://cdn.example.test/stale/video-cut.msi"}', 1, '2026-05-09T00:00:00Z')
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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
            (uuid, tenant_id, organization_id, data_scope, status, metadata, target_type, target_id, asset_type, asset_media_resource_id, asset_resource_snapshot, sort_order)
        VALUES
            ('sdkapp-asset-stale-claw-router-screen', 20001, 0, 0, 1, '{"seedKind":"sdkwork.plus_app.seed","itemType":"app_asset","appKey":"sdkwork-claw-router","sourceHash":"old"}', 15, ?, 2, 'stale-claw-router-screen-asset', '{"kind":"image","source":"external_url","url":"https://cdn.example.test/stale/claw-router.png","publicUrl":"https://cdn.example.test/stale/claw-router.png"}', 99)
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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

    sqlx::query(
        r#"
        INSERT INTO plus_category
            (id, uuid, tenant_id, organization_id, data_scope, name, description, shop_id, type, group_name, code, tags, icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot, sort_weight, parent_id, path, visible, status)
        VALUES
            (20999998, 'sdkwork-app-category-removed', 20001, 0, 0, 'Removed Category', 'Removed stale app category.', 0, 999999, 'app-store', 'app-store-removed', '["app","app-store","removed"]', 'stale-app-category-icon', NULL, '{"kind":"image","source":"provider_asset","uri":"app-window"}', 999, NULL, '/apps/categories/app-store-removed', 1, 1)
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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

    sqlx::query(
        r#"
        INSERT INTO plus_category
            (id, uuid, tenant_id, organization_id, data_scope, name, description, shop_id, type, group_name, code, tags, icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot, sort_weight, parent_id, path, visible, status)
        VALUES
            (20999996, 'sdkwork-app-category-half-retired', 20001, 0, 0, 'Half Retired Category', 'Half retired stale app category.', 0, 999999, 'app-store', 'app-store-half-retired', '["app","app-store","half-retired"]', 'stale-app-category-icon', NULL, '{"kind":"image","source":"provider_asset","uri":"app-window"}', 999, NULL, '/apps/categories/app-store-half-retired', 1, 0)
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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
async fn sqlite_installer_marks_appbase_commerce_order_schema_table_loss_as_corrupt() {
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

    sqlx::query("DROP TABLE commerce_order")
        .execute(&pool)
        .await
        .unwrap();

    assert_eq!(
        InstallationStatus::Corrupt,
        installer.status().await.unwrap(),
        "installer status must validate sdkwork-appbase commerce tables used by shared base modules"
    );
}

#[tokio::test]
async fn sqlite_installer_repairs_missing_generated_schema_indexes_on_startup_check() {
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
async fn sqlite_installer_repairs_changed_generated_schema_index_definitions_before_catalog_import()
{
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

    sqlx::query("DROP INDEX uk_ai_model_rank_snapshot_scope_catalog_key")
        .execute(&pool)
        .await
        .unwrap();
    sqlx::query(
        r#"
        CREATE UNIQUE INDEX uk_ai_model_rank_snapshot_scope_catalog_key
        ON ai_model_rank_snapshot (
            tenant_id,
            organization_id,
            snapshot_date,
            snapshot_period,
            rank_scope,
            catalog_key
        )
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        DELETE FROM ai_model_rank_snapshot
        WHERE uuid IN (
            SELECT uuid
            FROM ai_model_rank_snapshot
            WHERE status = 1
            LIMIT 1
        )
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect stale same-name SQLite unique indexes before model catalog import uses ON CONFLICT"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);
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
            "vendor_code",
            "region_code",
            "catalog_key",
        ],
    )
    .await;
}

#[tokio::test]
async fn sqlite_installer_repairs_missing_notification_delivery_upsert_index() {
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

    assert_sqlite_index_exists(&pool, "uk_ops_notification_delivery_user_message_app").await;
    sqlx::query("DROP INDEX uk_ops_notification_delivery_user_message_app")
        .execute(&pool)
        .await
        .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect the missing app notification delivery unique index because acknowledge uses it for ON CONFLICT upsert"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);
    assert_sqlite_index_exists(&pool, "uk_ops_notification_delivery_user_message_app").await;
}

#[tokio::test]
async fn sqlite_installer_repairs_missing_generated_schema_columns_on_startup_check() {
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

    sqlx::query("ALTER TABLE ai_chat_turn DROP COLUMN request_id")
        .execute(&pool)
        .await
        .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect missing generated schema columns because runtime stores depend on them"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);
    assert_sqlite_columns_exist(&pool, "ai_chat_turn", &["request_id"]).await;
}

#[tokio::test]
async fn sqlite_installer_repairs_missing_appbase_commerce_order_schema_indexes_on_startup_check() {
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

    sqlx::query("DROP INDEX idx_commerce_order_owner_status_created_at")
        .execute(&pool)
        .await
        .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect missing sdkwork-appbase commerce indexes"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);
    assert_sqlite_index_exists(&pool, "idx_commerce_order_owner_status_created_at").await;
}

#[tokio::test]
async fn sqlite_installer_installs_seed_projection_indexes_for_fast_startup_checks() {
    let pool = repair_sqlite_pool().await;

    assert_sqlite_index_exists(&pool, "idx_studio_catalog_asset_seed_source").await;
    assert_sqlite_index_exists(&pool, "idx_studio_catalog_artifact_seed_source").await;
    assert_sqlite_index_exists(&pool, "idx_studio_catalog_asset_seed_kind").await;
    assert_sqlite_index_exists(&pool, "idx_studio_catalog_artifact_seed_kind").await;
}

#[tokio::test]
async fn sqlite_installer_repairs_missing_commerce_experience_seed_on_startup_check() {
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

    assert_sqlite_row_exists(&pool, "membership_package", "id = '302'").await;
    assert_sqlite_row_exists(
        &pool,
        "commerce_payment_channel",
        "id = 'seed-payment-channel-card-checkout'",
    )
    .await;
    sqlx::query("DELETE FROM membership_package WHERE id = '302'")
        .execute(&pool)
        .await
        .unwrap();
    sqlx::query(
        "DELETE FROM commerce_payment_channel WHERE id = 'seed-payment-channel-card-checkout'",
    )
    .execute(&pool)
    .await
    .unwrap();
    sqlx::query(
        "UPDATE commerce_payment_provider SET display_name = 'Production Stripe' WHERE provider_code = 'stripe'",
    )
    .execute(&pool)
    .await
    .unwrap();

    assert_eq!(
        InstallationStatus::UpgradeRequired,
        installer.status().await.unwrap(),
        "installer status must detect missing membership and recharge experience seed rows"
    );

    let repaired = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, repaired.status);
    assert!(repaired.changed);
    assert_commerce_experience_seed_rows(&pool).await;
    let provider_display_name: String = sqlx::query_scalar(
        "SELECT display_name FROM commerce_payment_provider WHERE provider_code = 'stripe'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        "Production Stripe", provider_display_name,
        "startup repair must not replay unrelated commerce seed slices when the bundled payload is already current"
    );
}

#[tokio::test]
async fn sqlite_installer_status_report_reads_latest_catalog_refresh_status() {
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
async fn sqlite_installer_catalog_sync_failure_preserves_original_error_when_audit_fails() {
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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
async fn sqlite_installer_refresh_catalog_bootstraps_admin_on_empty_full_install() {
    let catalog_root = single_vendor_catalog_root("openai");
    let pool = sqlite_pool().await;
    let installer =
        installer(pool.clone()).with_bootstrap_admin_password("Admin-Refresh-Test-Password-2026!");

    installer
        .refresh_catalog(CatalogRefreshOptions {
            catalog_root: Some(catalog_root.to_string_lossy().to_string()),
            force: true,
            ..CatalogRefreshOptions::default()
        })
        .await
        .unwrap();

    assert_eq!(
        InstallationStatus::Installed,
        installer.status().await.unwrap(),
        "full refresh-catalog on an empty database must leave the installation usable without a follow-up ensure"
    );

    let admin = sqlx::query(
        r#"
        SELECT
            u.id,
            m.role_code,
            c.credential_hash
        FROM iam_user u
        JOIN iam_organization_member m
          ON m.tenant_id = u.tenant_id
         AND m.user_id = u.id
         AND m.status = 'active'
        JOIN iam_credential c
          ON c.tenant_id = u.tenant_id
         AND c.user_id = u.id
         AND c.credential_type = 'password'
         AND c.status = 'active'
        WHERE u.tenant_id = '10'
          AND u.username = 'admin'
          AND m.organization_id = '20'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("1", admin.get::<String, _>("id"));
    assert_eq!("admin", admin.get::<String, _>("role_code"));
    assert!(
        Pbkdf2Sha256PasswordHasher
            .verify_password(
                "Admin-Refresh-Test-Password-2026!",
                &admin.get::<String, _>("credential_hash"),
            )
            .unwrap(),
        "refresh-catalog bootstrap admin password must use the normal IAM hash format"
    );

    remove_catalog_root(catalog_root);
}

#[tokio::test]
async fn sqlite_installer_auto_initializes_recharge_catalog_for_non_default_admin_subject() {
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

    let installed = installer.ensure_installed().await.unwrap();
    assert_eq!(InstallationStatus::Installed, installed.status);

    let store = SqliteAdminMarketingStore::new(pool.clone());
    let subject = AdminMarketingSubject {
        tenant_id: 999,
        organization_id: 888,
        operator_id: 1,
        operator_type: 1,
    };

    let packages = store
        .list_recharge_packages(
            sdkwork_claw_product::ports::ListAdminRechargePackagesQuery {
                subject,
                status: None,
            },
        )
        .await
        .unwrap();
    assert_eq!(
        18,
        packages.len(),
        "non-default admin tenant must receive a full recharge catalog on first read"
    );
    assert_eq!(
        9,
        packages
            .iter()
            .filter(|item| item.status == "active")
            .count(),
        "non-default admin tenant must activate only RMB recharge packages by default"
    );
    assert_eq!(
        9,
        packages
            .iter()
            .filter(|item| item.status == "inactive")
            .count(),
        "non-default admin tenant must keep USD recharge packages inactive by default"
    );

    let settings = store.load_recharge_settings(subject).await.unwrap();
    assert_eq!("CNY", settings.base_currency_code);
    assert_eq!("10", settings.base_points_per_cny);
    assert_eq!(
        Some("1"),
        settings
            .currency_to_cny_rates
            .get("CNY")
            .map(String::as_str)
    );
    assert_eq!(
        Some("7"),
        settings
            .currency_to_cny_rates
            .get("USD")
            .map(String::as_str)
    );

    let persisted_package_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM commerce_recharge_package
        WHERE tenant_id = '999'
          AND organization_id = '888'
          AND status <> 'deleted'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        18, persisted_package_count,
        "first admin read must persist the initialized recharge catalog for the current tenant"
    );

    let persisted_active_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM commerce_recharge_package
        WHERE tenant_id = '999'
          AND organization_id = '888'
          AND status = 'active'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        9, persisted_active_count,
        "persisted tenant-scoped recharge catalog must activate only RMB packages by default"
    );

    let persisted_settings = sqlx::query(
        r#"
        SELECT rate, remark
        FROM commerce_exchange_rule
        WHERE tenant_id = '999'
          AND organization_id = '888'
          AND rule_no = 'CASH_TO_POINTS'
          AND source_asset_type = 'cash'
          AND target_asset_type = 'points'
          AND status = 'active'
        LIMIT 1
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("10", persisted_settings.get::<String, _>("rate"));
    let remark: serde_json::Value =
        serde_json::from_str(&persisted_settings.get::<String, _>("remark")).unwrap();
    assert_eq!(
        "CNY",
        remark["baseCurrencyCode"].as_str().unwrap_or_default()
    );
    assert_eq!(
        "1",
        remark["currencyToCnyRates"]["CNY"]
            .as_str()
            .unwrap_or_default()
    );
    assert_eq!(
        "7",
        remark["currencyToCnyRates"]["USD"]
            .as_str()
            .unwrap_or_default()
    );
}

#[tokio::test]
async fn sqlite_installer_installs_external_catalog_scope() {
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
            mode: "vendor_refresh".to_owned(),
            vendor_codes: vec!["openai".to_owned()],
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
            mode: "vendor_refresh".to_owned(),
            vendor_codes: vec!["openai".to_owned()],
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
            mode: "vendor_refresh".to_owned(),
            vendor_codes: vec!["openai".to_owned()],
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
            mode: "vendor_refresh".to_owned(),
            vendor_codes: vec!["openai".to_owned()],
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
    let pool = repair_sqlite_pool().await;
    let installer = installer(pool.clone());

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

async fn active_admin_password_hash(pool: &SqlitePool) -> String {
    sqlx::query_scalar(
        r#"
        SELECT c.credential_hash
        FROM iam_user u
        JOIN iam_credential c
          ON c.tenant_id = u.tenant_id
         AND c.user_id = u.id
         AND c.credential_type = 'password'
         AND c.status = 'active'
        WHERE u.tenant_id = '10'
          AND u.username = 'admin'
        ORDER BY c.updated_at DESC, c.id DESC
        LIMIT 1
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap()
}

async fn duplicate_regional_price_uuid(pool: &SqlitePool) -> String {
    let row = sqlx::query(
        r#"
        SELECT p.uuid
        FROM ai_model_pricing p
        JOIN (
            SELECT catalog_key, billing_meter_code, price_side, pricing_scope
            FROM ai_model_pricing
            WHERE status = 1
            GROUP BY catalog_key, billing_meter_code, price_side, pricing_scope
            HAVING COUNT(1) > 1
            LIMIT 1
        ) duplicate_key
          ON duplicate_key.catalog_key = p.catalog_key
         AND duplicate_key.billing_meter_code = p.billing_meter_code
         AND duplicate_key.price_side = p.price_side
         AND duplicate_key.pricing_scope = p.pricing_scope
        WHERE p.status = 1
        ORDER BY p.region_code ASC, p.uuid ASC
        LIMIT 1
        "#,
    )
    .fetch_one(pool)
    .await
    .expect("bundled catalog must include at least one region-scoped duplicate price key");
    row.get::<String, _>("uuid")
}

async fn sqlite_string_column(pool: &SqlitePool, query: &str) -> BTreeSet<String> {
    sqlx::query(query)
        .fetch_all(pool)
        .await
        .unwrap()
        .into_iter()
        .map(|row| row.get::<String, _>(0))
        .collect()
}

fn assert_pbkdf2_sha256_hash_format(hash: &str, label: &str) {
    assert!(
        hash.starts_with("pbkdf2-sha256$v=1$i=") && hash.contains("$s=") && hash.contains("$h="),
        "{label} must use the normal IAM PBKDF2-SHA256 password hash format"
    );
}

async fn assert_catalog_rows(pool: &SqlitePool, catalog: &sdkwork_models::ModelCatalog) {
    let expected_model_keys = catalog_model_keys(catalog);
    let expected_price_keys = catalog_price_keys(catalog);
    let expected_ranking_keys = catalog_ranking_keys(catalog);

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
    let family_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(DISTINCT vendor_code || '/' || family_code)
        FROM ai_model_family
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

    assert_eq!(catalog_vendor_codes(catalog).len() as i64, vendor_count);
    assert_eq!(catalog_family_keys(catalog).len() as i64, family_count);
    assert_eq!(expected_model_keys.len() as i64, model_count);
    assert_eq!(catalog.meters.len() as i64, meter_count);
    assert!(
        pricing_count >= expected_price_keys.len() as i64,
        "ai_model_pricing may expand catalog price entries into runtime-specific rows, but it must contain every catalog price key"
    );
    assert_eq!(expected_ranking_keys.len() as i64, ranking_count);

    let actual_model_capabilities = sqlx::query(
        r#"
        SELECT catalog_key, capabilities
        FROM ai_model
        WHERE status = 1
        "#,
    )
    .fetch_all(pool)
    .await
    .unwrap()
    .into_iter()
    .map(|row| {
        (
            row.get::<String, _>("catalog_key"),
            row.get::<Option<String>, _>("capabilities")
                .unwrap_or_default(),
        )
    })
    .collect::<BTreeMap<_, _>>();

    for vendor in &catalog.vendors {
        for model in &vendor.models {
            let catalog_key = catalog_model_key(&vendor.vendor.vendor_code, &model.model_id);
            let capabilities = actual_model_capabilities
                .get(&catalog_key)
                .unwrap_or_else(|| panic!("{catalog_key} must be imported from sdkwork-models"));
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

    let actual_price_keys = sqlx::query(
        r#"
        SELECT catalog_key, billing_meter_code, price_side, pricing_scope
        FROM ai_model_pricing
        WHERE status = 1
        "#,
    )
    .fetch_all(pool)
    .await
    .unwrap()
    .into_iter()
    .map(|row| CatalogPriceKey {
        catalog_key: row.get::<String, _>("catalog_key"),
        meter_code: row.get::<String, _>("billing_meter_code"),
        price_side: row.get::<i64, _>("price_side") as i32,
        pricing_scope: row.get::<i64, _>("pricing_scope") as i32,
    })
    .collect::<BTreeSet<_>>();
    for price_key in expected_price_keys {
        assert!(
            actual_price_keys.contains(&price_key),
            "{} {} side={} scope={} must be imported from sdkwork-models pricing",
            price_key.catalog_key,
            price_key.meter_code,
            price_key.price_side,
            price_key.pricing_scope
        );
    }

    let actual_ranking_keys = sqlx::query(
        r#"
        SELECT snapshot_date, rank_scope, vendor_code, region_code, catalog_key
        FROM ai_model_rank_snapshot
        WHERE status = 1
        "#,
    )
    .fetch_all(pool)
    .await
    .unwrap()
    .into_iter()
    .map(|row| CatalogRankingKey {
        snapshot_date: row.get::<String, _>("snapshot_date"),
        rank_scope: row.get::<String, _>("rank_scope"),
        vendor_code: row.get::<String, _>("vendor_code"),
        region_code: row.get::<String, _>("region_code"),
        catalog_key: row.get::<String, _>("catalog_key"),
    })
    .collect::<BTreeSet<_>>();
    for ranking_key in expected_ranking_keys {
        assert!(
            actual_ranking_keys.contains(&ranking_key),
            "{} {} {} {} {} must be imported from sdkwork-models rankings",
            ranking_key.snapshot_date,
            ranking_key.rank_scope,
            ranking_key.vendor_code,
            ranking_key.region_code,
            ranking_key.catalog_key
        );
    }
}

async fn assert_catalog_capability_projection_rows(
    pool: &SqlitePool,
    catalog: &sdkwork_models::ModelCatalog,
) {
    let expected_modalities = catalog_modality_codes(catalog);
    let expected_api_endpoints = catalog_api_endpoint_codes(catalog);
    let expected_model_keys = catalog_model_keys(catalog);
    let expected_model_resource_codes = catalog_model_resource_codes(catalog);
    let expected_modality_resource_codes = catalog_modality_resource_codes(catalog);
    let expected_vendor_resource_codes = catalog_vendor_codes(catalog)
        .into_iter()
        .map(|vendor_code| format!("vendor.{vendor_code}"))
        .collect::<BTreeSet<_>>();

    let actual_modalities = sqlite_string_column(
        pool,
        r#"
        SELECT modality_code
        FROM ai_modality
        WHERE status = 1
          AND deleted_at IS NULL
        "#,
    )
    .await;
    assert!(
        expected_modalities.is_subset(&actual_modalities),
        "ai_modality must contain every sdkwork-models modality/capability used by the catalog"
    );

    let actual_api_endpoints = sqlite_string_column(
        pool,
        r#"
        SELECT endpoint_code
        FROM ai_api_endpoint
        WHERE status = 1
          AND deleted_at IS NULL
        "#,
    )
    .await;
    assert!(
        expected_api_endpoints.is_subset(&actual_api_endpoints),
        "ai_api_endpoint must contain every endpoint code derived from sdkwork-models capabilities"
    );

    let model_api_endpoint_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(DISTINCT catalog_key)
        FROM ai_model_api_endpoint
        WHERE status = 1
          AND deleted_at IS NULL
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!(
        expected_model_keys.len() as i64,
        model_api_endpoint_count,
        "ai_model_api_endpoint must expose one endpoint projection for each catalog model"
    );

    let actual_resource_codes = sqlite_string_column(
        pool,
        r#"
        SELECT resource_code
        FROM ai_resource
        WHERE status = 1
          AND deleted_at IS NULL
        "#,
    )
    .await;
    assert!(
        expected_vendor_resource_codes.is_subset(&actual_resource_codes),
        "ai_resource must expose vendor resources for channel binding"
    );
    assert!(
        expected_modality_resource_codes.is_subset(&actual_resource_codes),
        "ai_resource must expose modality resources for channel binding"
    );
    assert!(
        expected_model_resource_codes.is_subset(&actual_resource_codes),
        "ai_resource must expose model API resources for channel binding"
    );

    let vendor_modality_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM ai_vendor_modality WHERE status = 1")
            .fetch_one(pool)
            .await
            .unwrap();
    let vendor_api_endpoint_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM ai_vendor_api_endpoint WHERE status = 1")
            .fetch_one(pool)
            .await
            .unwrap();
    let model_modality_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM ai_model_modality WHERE status = 1")
            .fetch_one(pool)
            .await
            .unwrap();
    let modality_api_endpoint_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM ai_modality_api_endpoint WHERE status = 1")
            .fetch_one(pool)
            .await
            .unwrap();

    assert!(vendor_modality_count > 0);
    assert!(vendor_api_endpoint_count > 0);
    assert!(model_modality_count > 0);
    assert!(modality_api_endpoint_count > 0);
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

async fn sqlite_core_skill_seed_row_count(pool: &SqlitePool) -> i64 {
    sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_agent_skill
        WHERE tenant_id = 0
          AND organization_id = 0
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap()
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
        SELECT name, version, icon_resource_snapshot, access_url, config, install_config, release_notes, status
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
        serde_json::from_str::<serde_json::Value>(
            claw_router
                .get::<String, _>("icon_resource_snapshot")
                .as_str(),
        )
        .unwrap()["publicUrl"]
            .as_str()
            .unwrap()
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

async fn assert_commerce_experience_seed_rows(pool: &SqlitePool) {
    let membership_plan_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM membership_plan
        WHERE tenant_id = '0'
          AND organization_id = '0'
          AND status = 'active'
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!(
        4, membership_plan_count,
        "installer must seed four membership plans: free, pro, max, vip"
    );

    let membership_product_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM commerce_product_spu
        WHERE tenant_id = '0'
          AND organization_id = '0'
          AND spu_no = 'membership'
          AND sales_status = 'active'
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!(
        1, membership_product_count,
        "membership product SPU must be seeded"
    );

    let membership_package_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM membership_package
        WHERE tenant_id = '0'
          AND organization_id = '0'
          AND package_no LIKE 'membership-%'
          AND status = 'active'
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!(
        6, membership_package_count,
        "installer must seed two purchase groups with three membership packages each"
    );

    let expected_groups = membership_package_group_seeds()
        .into_iter()
        .map(|group| {
            (
                group
                    .package_group_no
                    .strip_prefix("membership-")
                    .unwrap_or(group.package_group_no)
                    .to_owned(),
                group.name.to_owned(),
                group.duration_days,
            )
        })
        .collect::<Vec<_>>();
    for (group_code, group_name, duration_days) in expected_groups {
        let group_count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM membership_package
            WHERE tenant_id = '0'
              AND organization_id = '0'
              AND package_no LIKE ?
              AND status = 'active'
            "#,
        )
        .bind(format!("membership-{group_code}-%"))
        .fetch_one(pool)
        .await
        .unwrap();
        assert_eq!(
            3, group_count,
            "{group_name} group must contain pro/max/vip packages"
        );

        let rows = sqlx::query(
            r#"
            SELECT sku_no, spec_json
            FROM commerce_product_sku
            WHERE tenant_id = '0'
              AND organization_id = '0'
              AND spu_id = 'seed-product-membership'
              AND sku_no LIKE ?
              AND sales_status = 'active'
            "#,
        )
        .bind(format!("membership-{group_code}-%"))
        .fetch_all(pool)
        .await
        .unwrap();
        let mut tier_codes = BTreeSet::new();
        for row in rows {
            let sku_no = row.get::<String, _>("sku_no");
            let spec: serde_json::Value =
                serde_json::from_str(&row.get::<String, _>("spec_json")).unwrap();
            assert_eq!(
                "membership_package",
                spec["kind"].as_str().unwrap_or_default()
            );
            assert_eq!(
                group_code.as_str(),
                spec["groupCode"].as_str().unwrap_or_default()
            );
            assert_eq!(
                group_name.as_str(),
                spec["groupName"].as_str().unwrap_or_default()
            );
            assert_eq!(
                duration_days,
                spec["durationDays"].as_i64().unwrap_or_default()
            );
            let tier_code = spec["planCode"].as_str().unwrap_or_default().to_owned();
            assert!(
                tier_codes.insert(tier_code),
                "{sku_no} must not duplicate tier code inside {group_name}"
            );
        }
        assert_eq!(
            ["max", "pro", "vip"]
                .into_iter()
                .map(str::to_owned)
                .collect::<BTreeSet<_>>(),
            tier_codes,
            "{group_name} group must seed expected tier codes"
        );
    }

    let expected_levels = membership_plan_seeds()
        .into_iter()
        .map(|level| (level.plan_no.to_owned(), level.name.to_owned(), level.rank))
        .collect::<Vec<_>>();
    for (level_no, name, level_value) in expected_levels {
        let row = sqlx::query(
            r#"
            SELECT name, rank
            FROM membership_plan
            WHERE tenant_id = '0'
              AND organization_id = '0'
              AND plan_no = ?
              AND status = 'active'
            "#,
        )
        .bind(level_no.as_str())
        .fetch_one(pool)
        .await
        .unwrap();
        assert_eq!(name, row.get::<String, _>("name"));
        assert_eq!(level_value, row.get::<i64, _>("rank"));
    }

    let recharge_product_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM commerce_product_spu
        WHERE tenant_id = '0'
          AND organization_id = '0'
          AND spu_no IN ('points-recharge-cny', 'points-recharge-non-cny')
          AND sales_status = 'active'
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!(
        2, recharge_product_count,
        "points recharge seed products must include CNY and non-CNY groups"
    );

    let recharge_package_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM commerce_recharge_package
        WHERE tenant_id = '0'
          AND organization_id = '0'
          AND status = 'active'
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!(
        9, recharge_package_count,
        "installer must seed nine active default points recharge packages"
    );

    let recharge_package_total_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM commerce_recharge_package
        WHERE tenant_id = '0'
          AND organization_id = '0'
          AND status <> 'deleted'
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!(
        18, recharge_package_total_count,
        "installer must initialize the full recharge package catalog"
    );

    let recharge_settings = sqlx::query(
        r#"
        SELECT rate, remark
        FROM commerce_exchange_rule
        WHERE tenant_id = '0'
          AND organization_id = '0'
          AND rule_no = 'CASH_TO_POINTS'
          AND source_asset_type = 'cash'
          AND target_asset_type = 'points'
          AND status = 'active'
        LIMIT 1
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!("10", recharge_settings.get::<String, _>("rate"));
    let remark: serde_json::Value =
        serde_json::from_str(&recharge_settings.get::<String, _>("remark")).unwrap();
    assert_eq!(
        "CNY",
        remark["baseCurrencyCode"].as_str().unwrap_or_default()
    );
    assert_eq!(
        "1",
        remark["currencyToCnyRates"]["CNY"]
            .as_str()
            .unwrap_or_default()
    );
    assert_eq!(
        "7",
        remark["currencyToCnyRates"]["USD"]
            .as_str()
            .unwrap_or_default()
    );

    let store = SqliteAdminMarketingStore::new(pool.clone());
    let subject = AdminMarketingSubject {
        tenant_id: 10,
        organization_id: 20,
        operator_id: 1,
        operator_type: 1,
    };
    let admin_packages = store
        .list_recharge_packages(
            sdkwork_claw_product::ports::ListAdminRechargePackagesQuery {
                subject,
                status: None,
            },
        )
        .await
        .unwrap();
    assert_eq!(
        18,
        admin_packages.len(),
        "default admin tenant must see the initialized recharge package catalog on startup"
    );
    assert_eq!(
        9,
        admin_packages
            .iter()
            .filter(|item| item.status == "active")
            .count(),
        "default admin catalog must only activate the RMB recharge packages on startup"
    );
    assert_eq!(
        9,
        admin_packages
            .iter()
            .filter(|item| item.status == "inactive")
            .count(),
        "default admin catalog must keep USD recharge packages inactive on startup"
    );
    let admin_settings = store.load_recharge_settings(subject).await.unwrap();
    assert_eq!("CNY", admin_settings.base_currency_code);
    assert_eq!("10", admin_settings.base_points_per_cny);
    assert_eq!(
        Some("1"),
        admin_settings
            .currency_to_cny_rates
            .get("CNY")
            .map(String::as_str)
    );
    assert_eq!(
        Some("7"),
        admin_settings
            .currency_to_cny_rates
            .get("USD")
            .map(String::as_str)
    );

    assert_seed_statuses(
        pool,
        "commerce_payment_method",
        "method_key",
        "status",
        commerce_payment_method_seeds()
            .into_iter()
            .map(|method| (method.method_key.to_owned(), "active".to_owned()))
            .collect(),
        "payment methods",
    )
    .await;

    assert_seed_statuses(
        pool,
        "commerce_payment_provider",
        "provider_code",
        "status",
        commerce_payment_provider_seeds()
            .into_iter()
            .map(|provider| (provider.provider_code.to_owned(), "active".to_owned()))
            .collect(),
        "payment providers",
    )
    .await;
    assert_seed_statuses(
        pool,
        "commerce_payment_provider_account",
        "account_no",
        "status",
        commerce_payment_provider_account_seeds()
            .into_iter()
            .map(|account| (account.account_no.to_owned(), account.status.to_owned()))
            .collect(),
        "payment provider accounts",
    )
    .await;
    assert_seed_statuses(
        pool,
        "commerce_payment_channel",
        "channel_no",
        "status",
        commerce_payment_channel_seeds()
            .into_iter()
            .map(|channel| (channel.channel_no.to_owned(), channel.status.to_owned()))
            .collect(),
        "payment channels",
    )
    .await;
    assert_seed_statuses(
        pool,
        "commerce_payment_route_rule",
        "rule_no",
        "status",
        commerce_payment_route_rule_seeds()
            .into_iter()
            .map(|rule| (rule.rule_no.to_owned(), rule.status.to_owned()))
            .collect(),
        "payment route rules",
    )
    .await;
}

async fn assert_seed_statuses(
    pool: &SqlitePool,
    table: &str,
    key_column: &str,
    status_column: &str,
    expected: BTreeMap<String, String>,
    label: &str,
) {
    let rows = sqlx::query(
        format!(
            r#"
            SELECT {key_column} AS seed_key, {status_column} AS seed_status
            FROM {table}
            WHERE tenant_id = '0'
              AND organization_id = '0'
            "#
        )
        .as_str(),
    )
    .fetch_all(pool)
    .await
    .unwrap();
    let actual = rows
        .into_iter()
        .map(|row| {
            (
                row.get::<String, _>("seed_key"),
                row.get::<String, _>("seed_status"),
            )
        })
        .collect::<BTreeMap<_, _>>();
    assert_eq!(
        expected, actual,
        "installer must seed all standard {label} with the bootstrap-defined status"
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

fn catalog_model_keys(catalog: &sdkwork_models::ModelCatalog) -> Vec<String> {
    let mut catalog_keys = catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            vendor
                .models
                .iter()
                .map(|model| catalog_model_key(&vendor.vendor.vendor_code, &model.model_id))
        })
        .collect::<Vec<_>>();
    catalog_keys.sort();
    catalog_keys.dedup();
    catalog_keys
}

fn catalog_model_key(vendor_code: &str, model_id: &str) -> String {
    format!("{vendor_code}/{model_id}")
}

fn catalog_family_keys(catalog: &sdkwork_models::ModelCatalog) -> BTreeSet<String> {
    catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            vendor
                .families
                .iter()
                .map(|family| format!("{}/{}", vendor.vendor.vendor_code, family.family_code))
        })
        .collect()
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
                .map(|model| catalog_model_key(&vendor.vendor.vendor_code, &model.model_id))
        })
        .collect::<Vec<_>>();
    catalog_keys.sort();
    catalog_keys.dedup();
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

fn catalog_modality_codes(catalog: &sdkwork_models::ModelCatalog) -> BTreeSet<String> {
    catalog
        .vendors
        .iter()
        .flat_map(|vendor| vendor.models.iter())
        .flat_map(|model| {
            model
                .input_modalities
                .iter()
                .chain(model.output_modalities.iter())
                .chain(std::iter::once(&model.primary_capability))
                .cloned()
        })
        .collect()
}

fn catalog_modality_resource_codes(catalog: &sdkwork_models::ModelCatalog) -> BTreeSet<String> {
    let mut values = catalog_modality_codes(catalog)
        .into_iter()
        .map(|modality_code| format!("modality.{modality_code}"))
        .collect::<BTreeSet<_>>();
    if values.iter().any(|value| {
        matches!(
            value.as_str(),
            "modality.chat" | "modality.text" | "modality.embedding" | "modality.rerank"
        )
    }) {
        values.insert("modality.llm".to_owned());
    }
    values
}

fn catalog_api_endpoint_codes(catalog: &sdkwork_models::ModelCatalog) -> BTreeSet<String> {
    catalog
        .vendors
        .iter()
        .flat_map(|vendor| vendor.models.iter())
        .map(catalog_model_endpoint_code)
        .collect()
}

fn catalog_model_resource_codes(catalog: &sdkwork_models::ModelCatalog) -> BTreeSet<String> {
    catalog
        .vendors
        .iter()
        .flat_map(|vendor| vendor.models.iter())
        .map(|model| {
            format!(
                "model.{}.{}.{}",
                model.vendor_code,
                model.model_id,
                catalog_model_resource_suffix(model)
            )
        })
        .collect()
}

fn catalog_model_endpoint_code(model: &sdkwork_models::ModelInfo) -> String {
    match model.primary_capability.as_str() {
        "image" => "openai.images",
        "audio" => "openai.audio",
        "music" => "suno.music",
        "video" => "openai.video",
        "embedding" => "openai.embeddings",
        "rerank" => "rerank",
        _ => "openai.chat_completions",
    }
    .to_owned()
}

fn catalog_model_resource_suffix(model: &sdkwork_models::ModelInfo) -> String {
    if model.primary_capability == "chat" {
        "chat".to_owned()
    } else {
        model.primary_capability.clone()
    }
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
    vendor_code: String,
    region_code: String,
    catalog_key: String,
}

fn catalog_ranking_keys(catalog: &sdkwork_models::ModelCatalog) -> BTreeSet<CatalogRankingKey> {
    let model_catalog_keys = catalog_model_keys(catalog)
        .into_iter()
        .collect::<BTreeSet<_>>();
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
            let model_catalog_keys = model_catalog_keys.clone();
            snapshot.items.iter().filter_map(move |item| {
                let catalog_key = sdkwork_models::catalog_key(
                    &vendor.vendor.vendor_code,
                    &vendor.vendor.region_code,
                    &item.model_id,
                );
                let model_catalog_key =
                    catalog_model_key(&vendor.vendor.vendor_code, &item.model_id);
                if model_catalog_keys.contains(&model_catalog_key) {
                    Some(CatalogRankingKey {
                        snapshot_date: snapshot.snapshot_date.clone(),
                        rank_scope: snapshot.rank_scope.clone(),
                        vendor_code: vendor.vendor.vendor_code.clone(),
                        region_code: vendor.vendor.region_code.clone(),
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
    fs::copy(
        sdkwork_models_source_root()
            .join("models")
            .join("protocols.json"),
        root.join("models").join("protocols.json"),
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

async fn assert_table_absent(pool: &SqlitePool, table: &str) {
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
    assert_eq!(0, exists, "{table} table must not exist after installation");
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

async fn assert_sqlite_row_exists(pool: &SqlitePool, table: &str, predicate: &str) {
    let sql = format!("SELECT COUNT(1) FROM {table} WHERE {predicate}");
    let exists: i64 = sqlx::query_scalar(sql.as_str())
        .fetch_one(pool)
        .await
        .unwrap();
    assert_eq!(1, exists, "{table} seed row must exist before repair");
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

async fn assert_sqlite_columns_absent(pool: &SqlitePool, table: &str, absent_columns: &[&str]) {
    let columns = sqlite_table_columns(pool, table).await;
    for absent_column in absent_columns {
        assert!(
            !columns.contains(&absent_column.to_string()),
            "{table}.{absent_column} column must not exist after installation; actual columns: {columns:?}"
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

async fn assert_sqlite_usage_link_agent_scope_index(pool: &SqlitePool) {
    let row = sqlx::query(
        r#"
        SELECT [unique] AS is_unique
        FROM pragma_index_list('ai_runtime_usage_link')
        WHERE name = 'uk_ai_runtime_usage_link_agent_scope'
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert_eq!(
        1,
        row.get::<i64, _>("is_unique"),
        "ai_runtime_usage_link agent scope index must be unique"
    );

    let index_sql: String = sqlx::query_scalar(
        r#"
        SELECT sql
        FROM sqlite_master
        WHERE type = 'index'
          AND name = 'uk_ai_runtime_usage_link_agent_scope'
        "#,
    )
    .fetch_one(pool)
    .await
    .unwrap();
    assert!(
        index_sql.contains("tenant_id, organization_id, user_id, agent_run_id, usage_type"),
        "usage link agent scope index must scope by trusted product subject and run"
    );
    assert!(
        index_sql.contains("COALESCE(agent_run_step_id, '')"),
        "usage link agent scope index must normalize missing agent_run_step_id for idempotent run totals"
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
