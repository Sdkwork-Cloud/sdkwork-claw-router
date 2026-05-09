use sdkwork_claw_product::infrastructure::sql::installer::{
    DatabaseInstallOptions, DatabaseInstaller,
};
use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAdminAppStore;
use sdkwork_claw_product::ports::{
    AdminAppStore, AdminAppSubject, CreateAdminAppCommand, DeleteAdminAppCommand, GetAdminAppQuery,
    ListAdminAppsQuery, SetAdminAppStatusCommand, UpdateAdminAppCommand,
};
use serde_json::json;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::Row;

const TENANT_ID: i64 = 42;
const ORGANIZATION_ID: i64 = 84;
const OPERATOR_ID: i64 = 9001;
const ASSIGNED_ID_FLOOR: i64 = 1_000_000_000_000;

#[tokio::test]
async fn sqlite_admin_app_store_manages_plus_app_lifecycle_with_market_state_and_audit() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    DatabaseInstaller::for_sqlite(pool.clone())
        .with_options(DatabaseInstallOptions::new("test", "commercial").unwrap())
        .unwrap()
        .ensure_installed()
        .await
        .unwrap();

    let store = SqliteAdminAppStore::new(pool.clone());
    let subject = admin_subject();

    let created = store
        .create_app(CreateAdminAppCommand {
            subject,
            app_uuid: "admin-app-workflow-portal".to_owned(),
            audit_log_uuid: "audit-create-admin-app-workflow-portal".to_owned(),
            user_id: Some(OPERATOR_ID),
            name: "Workflow Portal".to_owned(),
            description: Some("Runs workflow automation apps.".to_owned()),
            version: Some("1.0.0".to_owned()),
            icon: json!({"url": "https://cdn.example.test/apps/workflow/icon.png"}),
            icon_url: Some("https://cdn.example.test/apps/workflow/icon.png".to_owned()),
            resource_list: json!({"screenshots": ["https://cdn.example.test/apps/workflow/s1.png"]}),
            project_id: Some(7001),
            access_url: Some("https://workflow.example.test".to_owned()),
            config: json!({
                "standard": {
                    "appKey": "workflow-portal",
                    "framework": "react"
                },
                "portal": {
                    "developer": "Workflow Studio"
                }
            }),
            app_key: Some("workflow-portal".to_owned()),
            status: "ACTIVE".to_owned(),
            market_status: "DRAFT".to_owned(),
            app_type: Some("web".to_owned()),
            platforms: json!({"platforms": ["web"]}),
            install_platforms: json!({"platforms": ["web"]}),
            install_skill: json!({"name": "Workflow Installer"}),
            install_config: json!({"packages": [{"version": "1.0.0", "downloadUrl": "https://cdn.example.test/apps/workflow.zip"}]}),
            release_notes: json!([{"version": "1.0.0", "summary": "Initial release"}]),
            package_name: Some("com.sdkwork.workflow.portal".to_owned()),
            bundle_id: Some("com.sdkwork.workflow.portal".to_owned()),
            store_url: Some("https://store.example.test/workflow".to_owned()),
            download_url: Some("https://cdn.example.test/apps/workflow.zip".to_owned()),
            request_id: "req-create-admin-app".to_owned(),
            requested_at: "2026-05-09 09:00:00".to_owned(),
        })
        .await
        .unwrap();

    assert!(
        created.id > ASSIGNED_ID_FLOOR,
        "admin-created apps must use Java-compatible assigned ids, not SQLite rowids"
    );
    assert_eq!(TENANT_ID, created.tenant_id);
    assert_eq!(ORGANIZATION_ID, created.organization_id);
    assert_eq!("workflow-portal", created.app_key.as_deref().unwrap());
    assert_eq!("DRAFT", created.market_status);
    assert_eq!("DRAFT", created.config["portal"]["marketStatus"]);

    let stored_config: String = sqlx::query_scalar("SELECT config FROM plus_app WHERE id = ?")
        .bind(created.id)
        .fetch_one(&pool)
        .await
        .unwrap();
    let stored_config: serde_json::Value = serde_json::from_str(&stored_config).unwrap();
    assert_eq!("workflow-portal", stored_config["standard"]["appKey"]);
    assert_eq!("DRAFT", stored_config["portal"]["marketStatus"]);

    let updated = store
        .update_app(UpdateAdminAppCommand {
            subject,
            app_id: created.id,
            audit_log_uuid: "audit-update-admin-app-workflow-portal".to_owned(),
            user_id: None,
            name: Some("Workflow Portal Pro".to_owned()),
            description: Some(Some("Runs production workflow automation apps.".to_owned())),
            version: Some(Some("1.1.0".to_owned())),
            icon: None,
            icon_url: None,
            resource_list: None,
            project_id: None,
            access_url: None,
            config: Some(json!({
                "standard": {
                    "appKey": "workflow-portal-pro",
                    "framework": "react"
                },
                "portal": {
                    "developer": "Workflow Studio"
                }
            })),
            app_key: Some(Some("workflow-portal-pro".to_owned())),
            app_type: Some(Some("react".to_owned())),
            platforms: None,
            install_platforms: None,
            install_skill: None,
            install_config: None,
            release_notes: Some(json!([{"version": "1.1.0", "summary": "Admin polished release"}])),
            package_name: None,
            bundle_id: None,
            store_url: None,
            download_url: None,
            request_id: "req-update-admin-app".to_owned(),
            requested_at: "2026-05-09 09:01:00".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();

    assert_eq!("Workflow Portal Pro", updated.name);
    assert_eq!("workflow-portal-pro", updated.app_key.as_deref().unwrap());
    assert_eq!("DRAFT", updated.market_status);
    assert_eq!("DRAFT", updated.config["portal"]["marketStatus"]);
    assert_eq!("react", updated.app_type.as_deref().unwrap());

    let published = store
        .set_app_status(SetAdminAppStatusCommand {
            subject,
            app_id: created.id,
            status: Some("ACTIVE".to_owned()),
            market_status: Some("PUBLISHED".to_owned()),
            audit_log_uuid: "audit-publish-admin-app-workflow-portal".to_owned(),
            request_id: "req-publish-admin-app".to_owned(),
            requested_at: "2026-05-09 09:02:00".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!("ACTIVE", published.status);
    assert_eq!("PUBLISHED", published.market_status);
    assert_eq!("PUBLISHED", published.config["portal"]["marketStatus"]);

    let disabled = store
        .set_app_status(SetAdminAppStatusCommand {
            subject,
            app_id: created.id,
            status: Some("INACTIVE".to_owned()),
            market_status: None,
            audit_log_uuid: "audit-disable-admin-app-workflow-portal".to_owned(),
            request_id: "req-disable-admin-app".to_owned(),
            requested_at: "2026-05-09 09:03:00".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!("INACTIVE", disabled.status);
    assert_eq!("PUBLISHED", disabled.market_status);

    let filtered = store
        .list_apps(ListAdminAppsQuery {
            subject,
            keyword: Some("portal".to_owned()),
            status: Some("INACTIVE".to_owned()),
            market_status: Some("PUBLISHED".to_owned()),
            app_type: Some("react".to_owned()),
            page_no: Some(1),
            page_size: Some(10),
        })
        .await
        .unwrap();
    assert_eq!(
        vec![created.id],
        filtered.iter().map(|item| item.id).collect::<Vec<_>>()
    );

    assert!(
        store
            .get_app(GetAdminAppQuery {
                subject: AdminAppSubject {
                    tenant_id: TENANT_ID + 1,
                    ..subject
                },
                app_id: created.id,
            })
            .await
            .unwrap()
            .is_none(),
        "admin app store reads must be scoped to trusted tenant and organization"
    );

    sqlx::query(
        r#"
        INSERT INTO studio_catalog_asset
            (uuid, tenant_id, organization_id, target_type, target_id, asset_type, asset_url)
        VALUES
            ('admin-app-asset-workflow-portal', ?, ?, 15, ?, 1, 'https://cdn.example.test/apps/workflow/icon.png')
        "#,
    )
    .bind(TENANT_ID)
    .bind(ORGANIZATION_ID)
    .bind(created.id)
    .execute(&pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        INSERT INTO studio_catalog_artifact
            (uuid, tenant_id, organization_id, target_type, target_id, artifact_type, version, platform_type, os_name)
        VALUES
            ('admin-app-artifact-workflow-portal', ?, ?, 15, ?, 1, '1.0.0', 'web', 'pc-web')
        "#,
    )
    .bind(TENANT_ID)
    .bind(ORGANIZATION_ID)
    .bind(created.id)
    .execute(&pool)
    .await
    .unwrap();

    let deleted = store
        .delete_app(DeleteAdminAppCommand {
            subject,
            app_id: created.id,
            audit_log_uuid: "audit-delete-admin-app-workflow-portal".to_owned(),
            request_id: "req-delete-admin-app".to_owned(),
            requested_at: "2026-05-09 09:04:00".to_owned(),
        })
        .await
        .unwrap();
    assert!(deleted);

    let app_rows: i64 = sqlx::query_scalar("SELECT COUNT(1) FROM plus_app WHERE id = ?")
        .bind(created.id)
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(0, app_rows);
    let asset_rows: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM studio_catalog_asset WHERE target_id = ?")
            .bind(created.id)
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(0, asset_rows);
    let artifact_rows: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM studio_catalog_artifact WHERE target_id = ?")
            .bind(created.id)
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(0, artifact_rows);

    let audit_rows = sqlx::query(
        r#"
        SELECT action, target_type, target_id, change_summary
        FROM ops_audit_log
        WHERE tenant_id = ?
          AND organization_id = ?
          AND target_type = 15
        ORDER BY id
        "#,
    )
    .bind(TENANT_ID)
    .bind(ORGANIZATION_ID)
    .fetch_all(&pool)
    .await
    .unwrap();
    assert_eq!(5, audit_rows.len());
    assert_eq!("create_app", audit_rows[0].get::<String, _>("action"));
    assert_eq!(created.id, audit_rows[0].get::<i64, _>("target_id"));
    let create_summary: serde_json::Value =
        serde_json::from_str(audit_rows[0].get::<String, _>("change_summary").as_str()).unwrap();
    assert_eq!("workflow-portal", create_summary["appKey"]);
}

#[tokio::test]
async fn sqlite_admin_app_store_rejects_market_state_aliases_as_runtime_status() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    DatabaseInstaller::for_sqlite(pool.clone())
        .with_options(DatabaseInstallOptions::new("test", "commercial").unwrap())
        .unwrap()
        .ensure_installed()
        .await
        .unwrap();

    let store = SqliteAdminAppStore::new(pool.clone());
    let subject = admin_subject();

    for status in [
        "PUBLISHED",
        "OFFLINE",
        "ENABLED",
        "DISABLED",
        "1",
        "0",
        "active",
    ] {
        let invalid_create = store
            .create_app(CreateAdminAppCommand {
                subject,
                app_uuid: format!("admin-app-invalid-runtime-status-{status}"),
                audit_log_uuid: format!("audit-invalid-runtime-status-{status}"),
                user_id: Some(OPERATOR_ID),
                name: "Invalid Runtime Status".to_owned(),
                description: None,
                version: Some("1.0.0".to_owned()),
                icon: json!({}),
                icon_url: None,
                resource_list: json!({}),
                project_id: None,
                access_url: None,
                config: json!({}),
                app_key: None,
                status: status.to_owned(),
                market_status: "DRAFT".to_owned(),
                app_type: Some("web".to_owned()),
                platforms: json!({"platforms": ["web"]}),
                install_platforms: json!({"platforms": ["web"]}),
                install_skill: json!({}),
                install_config: json!({"packages": []}),
                release_notes: json!([]),
                package_name: None,
                bundle_id: None,
                store_url: None,
                download_url: None,
                request_id: format!("req-invalid-runtime-status-{status}"),
                requested_at: "2026-05-09 10:00:00".to_owned(),
            })
            .await;

        assert!(invalid_create.is_err(), "{status}");
        assert!(invalid_create
            .unwrap_err()
            .to_string()
            .contains("app status must be ACTIVE or INACTIVE"));
    }

    let created_rows: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM plus_app WHERE uuid LIKE 'admin-app-invalid-runtime-status-%'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(0, created_rows);
}

#[tokio::test]
async fn sqlite_admin_app_store_rejects_invalid_market_status_values() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    DatabaseInstaller::for_sqlite(pool.clone())
        .with_options(DatabaseInstallOptions::new("test", "commercial").unwrap())
        .unwrap()
        .ensure_installed()
        .await
        .unwrap();

    let store = SqliteAdminAppStore::new(pool.clone());
    let subject = admin_subject();

    for market_status in ["published", "ACTIVE", "INACTIVE", "ENABLED", "1", ""] {
        let invalid_create = store
            .create_app(CreateAdminAppCommand {
                subject,
                app_uuid: format!(
                    "admin-app-invalid-market-status-{}",
                    market_status.replace(char::is_whitespace, "_")
                ),
                audit_log_uuid: format!(
                    "audit-invalid-market-status-{}",
                    market_status.replace(char::is_whitespace, "_")
                ),
                user_id: Some(OPERATOR_ID),
                name: "Invalid Market Status".to_owned(),
                description: None,
                version: Some("1.0.0".to_owned()),
                icon: json!({}),
                icon_url: None,
                resource_list: json!({}),
                project_id: None,
                access_url: None,
                config: json!({}),
                app_key: None,
                status: "ACTIVE".to_owned(),
                market_status: market_status.to_owned(),
                app_type: Some("web".to_owned()),
                platforms: json!({"platforms": ["web"]}),
                install_platforms: json!({"platforms": ["web"]}),
                install_skill: json!({}),
                install_config: json!({"packages": []}),
                release_notes: json!([]),
                package_name: None,
                bundle_id: None,
                store_url: None,
                download_url: None,
                request_id: format!("req-invalid-market-status-{market_status}"),
                requested_at: "2026-05-09 10:10:00".to_owned(),
            })
            .await;

        assert!(invalid_create.is_err(), "{market_status}");
        assert!(invalid_create
            .unwrap_err()
            .to_string()
            .contains("app marketStatus must be DRAFT, PUBLISHED, or OFFLINE"));
    }

    let created = store
        .create_app(CreateAdminAppCommand {
            subject,
            app_uuid: "admin-app-valid-market-status".to_owned(),
            audit_log_uuid: "audit-valid-market-status".to_owned(),
            user_id: Some(OPERATOR_ID),
            name: "Valid Market Status".to_owned(),
            description: None,
            version: Some("1.0.0".to_owned()),
            icon: json!({}),
            icon_url: None,
            resource_list: json!({}),
            project_id: None,
            access_url: None,
            config: json!({}),
            app_key: None,
            status: "ACTIVE".to_owned(),
            market_status: "DRAFT".to_owned(),
            app_type: Some("web".to_owned()),
            platforms: json!({"platforms": ["web"]}),
            install_platforms: json!({"platforms": ["web"]}),
            install_skill: json!({}),
            install_config: json!({"packages": []}),
            release_notes: json!([]),
            package_name: None,
            bundle_id: None,
            store_url: None,
            download_url: None,
            request_id: "req-valid-market-status".to_owned(),
            requested_at: "2026-05-09 10:11:00".to_owned(),
        })
        .await
        .unwrap();

    let invalid_update = store
        .set_app_status(SetAdminAppStatusCommand {
            subject,
            app_id: created.id,
            status: None,
            market_status: Some("published".to_owned()),
            audit_log_uuid: "audit-invalid-market-status-update".to_owned(),
            request_id: "req-invalid-market-status-update".to_owned(),
            requested_at: "2026-05-09 10:12:00".to_owned(),
        })
        .await;

    assert!(invalid_update.is_err());
    assert!(invalid_update
        .unwrap_err()
        .to_string()
        .contains("app marketStatus must be DRAFT, PUBLISHED, or OFFLINE"));
}

#[tokio::test]
async fn sqlite_admin_app_store_publishes_without_changing_runtime_status() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    DatabaseInstaller::for_sqlite(pool.clone())
        .with_options(DatabaseInstallOptions::new("test", "commercial").unwrap())
        .unwrap()
        .ensure_installed()
        .await
        .unwrap();

    let store = SqliteAdminAppStore::new(pool.clone());
    let subject = admin_subject();
    let created = store
        .create_app(CreateAdminAppCommand {
            subject,
            app_uuid: "admin-app-inactive-draft".to_owned(),
            audit_log_uuid: "audit-create-admin-app-inactive-draft".to_owned(),
            user_id: Some(OPERATOR_ID),
            name: "Inactive Draft App".to_owned(),
            description: None,
            version: Some("1.0.0".to_owned()),
            icon: json!({}),
            icon_url: None,
            resource_list: json!({}),
            project_id: None,
            access_url: None,
            config: json!({}),
            app_key: None,
            status: "INACTIVE".to_owned(),
            market_status: "DRAFT".to_owned(),
            app_type: Some("web".to_owned()),
            platforms: json!({"platforms": ["web"]}),
            install_platforms: json!({"platforms": ["web"]}),
            install_skill: json!({}),
            install_config: json!({"packages": []}),
            release_notes: json!([]),
            package_name: None,
            bundle_id: None,
            store_url: None,
            download_url: None,
            request_id: "req-create-inactive-draft-app".to_owned(),
            requested_at: "2026-05-09 10:20:00".to_owned(),
        })
        .await
        .unwrap();
    assert_eq!("INACTIVE", created.status);
    assert_eq!("DRAFT", created.market_status);

    let published = store
        .set_app_status(SetAdminAppStatusCommand {
            subject,
            app_id: created.id,
            status: None,
            market_status: Some("PUBLISHED".to_owned()),
            audit_log_uuid: "audit-publish-inactive-draft-app".to_owned(),
            request_id: "req-publish-inactive-draft-app".to_owned(),
            requested_at: "2026-05-09 10:21:00".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();

    assert_eq!("INACTIVE", published.status);
    assert_eq!("PUBLISHED", published.market_status);
    assert_eq!("PUBLISHED", published.config["portal"]["marketStatus"]);

    let status_code: i64 = sqlx::query_scalar("SELECT status FROM plus_app WHERE id = ?")
        .bind(created.id)
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(0, status_code);
}

fn admin_subject() -> AdminAppSubject {
    AdminAppSubject {
        tenant_id: TENANT_ID,
        organization_id: ORGANIZATION_ID,
        operator_id: OPERATOR_ID,
        operator_type: 1,
    }
}
