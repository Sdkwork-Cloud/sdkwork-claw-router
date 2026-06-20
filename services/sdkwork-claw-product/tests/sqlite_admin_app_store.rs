use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAdminAppStore;
use sdkwork_claw_product::ports::{
    AdminAppStore, AdminAppSubject, CreateAdminAppCommand, CreateAdminAppTemplateCommand,
    DeleteAdminAppCommand, DeleteAdminAppTemplateCommand, GetAdminAppQuery,
    ListAdminAppTemplatesQuery, ListAdminAppsQuery, SetAdminAppStatusCommand,
    SetAdminAppTemplatePublishStatusCommand, UpdateAdminAppCommand, UpdateAdminAppTemplateCommand,
};
use serde_json::json;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::{Row, SqlitePool};

const TENANT_ID: i64 = 42;
const ORGANIZATION_ID: i64 = 84;
const OPERATOR_ID: i64 = 9001;
const SNOWFLAKE_ID_FLOOR: i64 = 1_000_000_000_000;
const PUBLIC_APP_STORE_TENANT_ID: i64 = 20_001;

fn external_media_resource(locator: &str, kind: &str) -> serde_json::Value {
    json!({
        "kind": kind,
        "source": "external_url",
        "url": locator,
        "publicUrl": locator
    })
}

#[tokio::test]
async fn sqlite_admin_app_store_manages_platform_app_lifecycle_with_market_state_and_audit() {
    let pool = sqlite_pool().await;

    let store = SqliteAdminAppStore::new(pool.clone());
    let subject = admin_subject();
    let workflow_artifact =
        external_media_resource("https://cdn.example.test/apps/workflow.zip", "document");

    let created = store
        .create_app(CreateAdminAppCommand {
            subject,
            app_uuid: "admin-app-workflow-portal".to_owned(),
            audit_log_uuid: "audit-create-admin-app-workflow-portal".to_owned(),
            user_id: Some(OPERATOR_ID),
            name: "Workflow Portal".to_owned(),
            description: Some("Runs workflow automation apps.".to_owned()),
            version: Some("1.0.0".to_owned()),
            icon: json!({
                "kind": "image",
                "source": "external_url",
                "url": "https://cdn.example.test/apps/workflow/icon.png",
                "publicUrl": "https://cdn.example.test/apps/workflow/icon.png"
            }),
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
            install_config: json!({"packages": [{"version": "1.0.0", "artifact": workflow_artifact.clone()}]}),
            release_notes: json!([{"version": "1.0.0", "summary": "Initial release"}]),
            package_name: Some("com.sdkwork.workflow.portal".to_owned()),
            bundle_id: Some("com.sdkwork.workflow.portal".to_owned()),
            store_url: Some("https://store.example.test/workflow".to_owned()),
            artifact: Some(workflow_artifact),
            request_id: "req-create-admin-app".to_owned(),
            requested_at: "2026-05-09 09:00:00".to_owned(),
        })
        .await
        .unwrap();

    assert!(
        created.id > SNOWFLAKE_ID_FLOOR,
        "admin-created apps must use appbase Snowflake ids, not SQLite rowids"
    );
    assert_eq!(TENANT_ID, created.tenant_id);
    assert_eq!(ORGANIZATION_ID, created.organization_id);
    assert_eq!("workflow-portal", created.app_key.as_deref().unwrap());
    assert_eq!("DRAFT", created.market_status);
    assert_eq!("DRAFT", created.config["portal"]["marketStatus"]);

    let stored_config: String = sqlx::query_scalar("SELECT config FROM platform_app WHERE id = ?")
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
            artifact: None,
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
            category_id: None,
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
        INSERT INTO ai_skill_asset
            (uuid, tenant_id, organization_id, target_type, target_id, asset_type, asset_resource_snapshot)
        VALUES
            ('admin-app-asset-workflow-portal', ?, ?, 15, ?, 1, '{"kind":"image","source":"external_url","url":"https://cdn.example.test/apps/workflow/icon.png","publicUrl":"https://cdn.example.test/apps/workflow/icon.png"}')
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
        INSERT INTO ai_skill_artifact
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

    let app_rows: i64 = sqlx::query_scalar("SELECT COUNT(1) FROM platform_app WHERE id = ?")
        .bind(created.id)
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(0, app_rows);
    let asset_rows: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM ai_skill_asset WHERE target_id = ?")
            .bind(created.id)
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(0, asset_rows);
    let artifact_rows: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM ai_skill_artifact WHERE target_id = ?")
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
async fn sqlite_admin_app_store_manages_app_template_lifecycle_with_audit() {
    let pool = sqlite_pool().await;

    let store = SqliteAdminAppStore::new(pool.clone());
    let subject = admin_subject();

    let created = store
        .create_app_template(CreateAdminAppTemplateCommand {
            subject,
            template_uuid: "admin-app-template-agent-dashboard".to_owned(),
            audit_log_uuid: "audit-create-admin-app-template-agent-dashboard".to_owned(),
            template_no: "TPL-AGENT-DASHBOARD".to_owned(),
            template_code: "agent-dashboard".to_owned(),
            template_name: "Agent Dashboard".to_owned(),
            description: Some("Start from an agent operations shell.".to_owned()),
            category_id: Some(6001),
            category_code: Some("operations".to_owned()),
            template_type: Some("dashboard".to_owned()),
            runtime: Some("web".to_owned()),
            framework: Some("react".to_owned()),
            language: Some("typescript".to_owned()),
            icon: Some(json!({
                "kind": "image",
                "source": "external_url",
                "url": "https://cdn.example.test/templates/agent.svg",
                "publicUrl": "https://cdn.example.test/templates/agent.svg"
            })),
            cover: Some(json!({
                "kind": "image",
                "source": "external_url",
                "url": "https://cdn.example.test/templates/agent.png",
                "publicUrl": "https://cdn.example.test/templates/agent.png"
            })),
            visibility: "TENANT".to_owned(),
            publish_status: "DRAFT".to_owned(),
            featured: true,
            sort_weight: 90,
            source_app_id: None,
            git_repo_url: Some("https://github.com/sdkwork/app-templates.git".to_owned()),
            git_ref: Some("main".to_owned()),
            git_sub_path: Some("apps/agent-dashboard".to_owned()),
            app_config_schema: json!({"type": "object"}),
            default_app_config: json!({"theme": "light"}),
            variable_schema: json!({"required": ["agentId"]}),
            dependency_manifest: json!([{"name": "@sdkwork/runtime"}]),
            capability_manifest: json!([{"capability": "agent"}]),
            request_id: "req-create-admin-app-template".to_owned(),
            requested_at: "2026-05-09 12:00:00".to_owned(),
        })
        .await
        .unwrap();

    assert!(
        created.id > SNOWFLAKE_ID_FLOOR,
        "admin-created app templates must use appbase Snowflake ids"
    );
    assert_eq!("agent-dashboard", created.template_code);
    assert_eq!("TENANT", created.visibility);
    assert_eq!("DRAFT", created.publish_status);
    assert_eq!(true, created.featured);
    assert_eq!(
        Some("https://github.com/sdkwork/app-templates.git"),
        created.git_repo_url.as_deref()
    );
    assert_eq!(Some("main"), created.git_ref.as_deref());
    assert_eq!(
        Some("apps/agent-dashboard"),
        created.git_sub_path.as_deref()
    );

    let stored_template: (i64, i64, String, String, String) =
        sqlx::query_as("SELECT visibility, publish_status, git_repo_url, git_ref, git_sub_path FROM platform_app_template WHERE id = ?")
            .bind(created.id)
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(
        (
            1,
            1,
            "https://github.com/sdkwork/app-templates.git".to_owned(),
            "main".to_owned(),
            "apps/agent-dashboard".to_owned()
        ),
        stored_template
    );

    let updated = store
        .update_app_template(UpdateAdminAppTemplateCommand {
            subject,
            template_id: created.id,
            audit_log_uuid: "audit-update-admin-app-template-agent-dashboard".to_owned(),
            template_name: Some("Agent Dashboard Pro".to_owned()),
            description: None,
            category_id: None,
            category_code: None,
            template_type: None,
            runtime: None,
            framework: Some(Some("react-router".to_owned())),
            language: None,
            icon: None,
            cover: None,
            visibility: None,
            publish_status: None,
            featured: Some(false),
            sort_weight: None,
            source_app_id: None,
            git_repo_url: Some(Some("git@github.com:sdkwork/app-templates.git".to_owned())),
            git_ref: Some(Some("release/2026.05".to_owned())),
            git_sub_path: Some(Some("apps/agent-dashboard-pro".to_owned())),
            app_config_schema: None,
            default_app_config: Some(json!({"theme": "dark"})),
            variable_schema: None,
            dependency_manifest: None,
            capability_manifest: None,
            request_id: "req-update-admin-app-template".to_owned(),
            requested_at: "2026-05-09 12:01:00".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();

    assert_eq!("Agent Dashboard Pro", updated.template_name);
    assert_eq!("react-router", updated.framework.as_deref().unwrap());
    assert_eq!(false, updated.featured);
    assert_eq!(
        Some("git@github.com:sdkwork/app-templates.git"),
        updated.git_repo_url.as_deref()
    );
    assert_eq!(Some("release/2026.05"), updated.git_ref.as_deref());
    assert_eq!(
        Some("apps/agent-dashboard-pro"),
        updated.git_sub_path.as_deref()
    );
    assert_eq!("dark", updated.default_app_config["theme"]);

    let published = store
        .set_app_template_publish_status(SetAdminAppTemplatePublishStatusCommand {
            subject,
            template_id: created.id,
            publish_status: "PUBLISHED".to_owned(),
            audit_log_uuid: "audit-publish-admin-app-template-agent-dashboard".to_owned(),
            request_id: "req-publish-admin-app-template".to_owned(),
            requested_at: "2026-05-09 12:02:00".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!("PUBLISHED", published.publish_status);

    let listed = store
        .list_app_templates(ListAdminAppTemplatesQuery {
            subject,
            keyword: Some("Agent".to_owned()),
            publish_status: Some("PUBLISHED".to_owned()),
            template_type: Some("dashboard".to_owned()),
            runtime: Some("web".to_owned()),
            category_id: Some(6001),
            page_no: Some(1),
            page_size: Some(10),
        })
        .await
        .unwrap();
    assert_eq!(
        vec![created.id],
        listed.iter().map(|item| item.id).collect::<Vec<_>>()
    );

    let offline = store
        .set_app_template_publish_status(SetAdminAppTemplatePublishStatusCommand {
            subject,
            template_id: created.id,
            publish_status: "OFFLINE".to_owned(),
            audit_log_uuid: "audit-offline-admin-app-template-agent-dashboard".to_owned(),
            request_id: "req-offline-admin-app-template".to_owned(),
            requested_at: "2026-05-09 12:03:00".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!("OFFLINE", offline.publish_status);

    sqlx::query(
        r#"
        INSERT INTO ai_skill_asset
            (uuid, tenant_id, organization_id, target_type, target_id, asset_type, asset_resource_snapshot)
        VALUES
            ('admin-app-template-asset-agent-dashboard', ?, ?, 16, ?, 1, '{"kind":"image","source":"external_url","url":"https://cdn.example.test/templates/agent.svg","publicUrl":"https://cdn.example.test/templates/agent.svg"}')
        "#,
    )
    .bind(TENANT_ID)
    .bind(ORGANIZATION_ID)
    .bind(created.id)
    .execute(&pool)
    .await
    .unwrap();

    let deleted = store
        .delete_app_template(DeleteAdminAppTemplateCommand {
            subject,
            template_id: created.id,
            audit_log_uuid: "audit-delete-admin-app-template-agent-dashboard".to_owned(),
            request_id: "req-delete-admin-app-template".to_owned(),
            requested_at: "2026-05-09 12:04:00".to_owned(),
        })
        .await
        .unwrap();
    assert!(deleted);

    let template_status: i64 =
        sqlx::query_scalar("SELECT status FROM platform_app_template WHERE id = ?")
            .bind(created.id)
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(-1, template_status);
    let asset_rows: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM ai_skill_asset WHERE target_type = 16 AND target_id = ?",
    )
    .bind(created.id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(0, asset_rows);

    let audit_rows = sqlx::query(
        r#"
        SELECT action, target_type, target_id
        FROM ops_audit_log
        WHERE tenant_id = ?
          AND organization_id = ?
          AND target_type = 16
        ORDER BY id
        "#,
    )
    .bind(TENANT_ID)
    .bind(ORGANIZATION_ID)
    .fetch_all(&pool)
    .await
    .unwrap();
    assert_eq!(5, audit_rows.len());
    assert_eq!(
        "create_app_template",
        audit_rows[0].get::<String, _>("action")
    );
    assert_eq!(
        "publish_app_template",
        audit_rows[2].get::<String, _>("action")
    );
    assert_eq!(
        "delete_app_template",
        audit_rows[4].get::<String, _>("action")
    );
    assert_eq!(created.id, audit_rows[4].get::<i64, _>("target_id"));
}

#[tokio::test]
async fn sqlite_admin_app_store_rejects_market_state_aliases_as_runtime_status() {
    let pool = sqlite_pool().await;

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
                artifact: None,
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
        "SELECT COUNT(1) FROM platform_app WHERE uuid LIKE 'admin-app-invalid-runtime-status-%'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(0, created_rows);
}

#[tokio::test]
async fn sqlite_admin_app_store_rejects_invalid_market_status_values() {
    let pool = sqlite_pool().await;

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
                artifact: None,
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
            artifact: None,
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
    let pool = sqlite_pool().await;

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
            artifact: None,
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

    let status_code: i64 = sqlx::query_scalar("SELECT status FROM platform_app WHERE id = ?")
        .bind(created.id)
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(0, status_code);
}

#[tokio::test]
async fn sqlite_admin_app_store_lists_app_center_visible_catalog_scopes() {
    let pool = sqlite_pool().await;

    insert_admin_visible_app(
        &pool,
        30_001_001,
        TENANT_ID,
        0,
        "Tenant Public Console App",
        "tenant-public-console-app",
    )
    .await;
    insert_admin_visible_app(
        &pool,
        30_001_002,
        PUBLIC_APP_STORE_TENANT_ID,
        0,
        "Product Public Console App",
        "product-public-console-app",
    )
    .await;
    insert_admin_visible_app(
        &pool,
        30_001_003,
        TENANT_ID + 1,
        0,
        "Other Tenant Public Console App",
        "other-tenant-public-console-app",
    )
    .await;

    let store = SqliteAdminAppStore::new(pool);
    let subject = admin_subject();
    let listed = store
        .list_apps(ListAdminAppsQuery {
            subject,
            keyword: Some("Public Console".to_owned()),
            status: Some("ACTIVE".to_owned()),
            market_status: Some("PUBLISHED".to_owned()),
            app_type: Some("web".to_owned()),
            category_id: None,
            page_no: Some(1),
            page_size: Some(20),
        })
        .await
        .unwrap();
    let listed_names = listed
        .iter()
        .map(|item| item.name.as_str())
        .collect::<Vec<_>>();

    assert!(
        listed_names.contains(&"Tenant Public Console App"),
        "admin app management must see tenant-level apps that the App Center exposes to the current organization"
    );
    assert!(
        listed_names.contains(&"Product Public Console App"),
        "admin app management must see product-level public App Center entries"
    );
    assert!(
        !listed_names.contains(&"Other Tenant Public Console App"),
        "admin app management must not cross into unrelated tenant public apps"
    );

    let public_detail = store
        .get_app(GetAdminAppQuery {
            subject,
            app_id: 30_001_002,
        })
        .await
        .unwrap()
        .expect("product public App Center entry must be readable from admin details");
    assert_eq!(
        "product-public-console-app",
        public_detail.app_key.as_deref().unwrap()
    );

    assert!(
        store
            .get_app(GetAdminAppQuery {
                subject,
                app_id: 30_001_003,
            })
            .await
            .unwrap()
            .is_none(),
        "unrelated tenant public apps must stay outside the admin app read scope"
    );
}

fn admin_subject() -> AdminAppSubject {
    AdminAppSubject {
        tenant_id: TENANT_ID,
        organization_id: ORGANIZATION_ID,
        operator_id: OPERATOR_ID,
        operator_type: 1,
    }
}

async fn sqlite_pool() -> SqlitePool {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_admin_app_store_tables(&pool).await;
    pool
}

async fn create_admin_app_store_tables(pool: &SqlitePool) {
    for statement in [
        r#"
        CREATE TABLE platform_app (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER,
            user_id INTEGER,
            name TEXT NOT NULL,
            icon TEXT,
            resource_list TEXT,
            project_id INTEGER,
            description TEXT,
            version TEXT,
            icon_media_resource_id TEXT,
            icon_object_blob_id INTEGER,
            icon_resource_snapshot TEXT,
            access_url TEXT,
            config TEXT,
            status INTEGER,
            app_type TEXT,
            platforms TEXT,
            install_platforms TEXT,
            install_skill TEXT,
            install_config TEXT,
            release_notes TEXT,
            package_name TEXT,
            bundle_id TEXT,
            store_url TEXT,
            artifact_media_resource_id TEXT,
            artifact_object_blob_id INTEGER,
            artifact_resource_snapshot TEXT,
            created_at TEXT,
            updated_at TEXT,
            v INTEGER
        )
        "#,
        r#"
        CREATE TABLE c_category (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER,
            name TEXT NOT NULL,
            description TEXT,
            type INTEGER NOT NULL,
            group_name TEXT,
            code TEXT,
            icon_media_resource_id TEXT,
            icon_object_blob_id INTEGER,
            icon_resource_snapshot TEXT,
            sort_weight INTEGER,
            parent_id INTEGER,
            path TEXT,
            visible INTEGER,
            status INTEGER,
            created_at TEXT,
            updated_at TEXT,
            v INTEGER
        )
        "#,
        r#"
        CREATE TABLE ai_skill_action (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            target_type INTEGER NOT NULL,
            target_id INTEGER NOT NULL
        )
        "#,
        r#"
        CREATE TABLE ai_skill_asset (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            target_type INTEGER NOT NULL,
            target_id INTEGER NOT NULL,
            artifact_id INTEGER,
            asset_type INTEGER,
            asset_media_resource_id TEXT,
            asset_object_blob_id INTEGER,
            asset_resource_snapshot TEXT,
            thumbnail_media_resource_id TEXT,
            thumbnail_object_blob_id INTEGER,
            thumbnail_resource_snapshot TEXT
        )
        "#,
        r#"
        CREATE TABLE ai_skill_artifact (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            target_type INTEGER NOT NULL,
            target_id INTEGER NOT NULL,
            artifact_type INTEGER,
            version TEXT,
            platform_type TEXT,
            os_name TEXT
        )
        "#,
        r#"
        CREATE TABLE platform_app_template (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL UNIQUE,
            created_at TEXT,
            updated_at TEXT,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            status INTEGER NOT NULL DEFAULT 1,
            deleted_at TEXT,
            deleted_by INTEGER,
            version INTEGER NOT NULL DEFAULT 0,
            template_no TEXT NOT NULL,
            template_code TEXT NOT NULL,
            template_name TEXT NOT NULL,
            description TEXT,
            category_id INTEGER,
            category_code TEXT,
            template_type TEXT,
            runtime TEXT,
            framework TEXT,
            language TEXT,
            icon_media_resource_id TEXT,
            icon_object_blob_id INTEGER,
            icon_resource_snapshot TEXT,
            cover_media_resource_id TEXT,
            cover_object_blob_id INTEGER,
            cover_resource_snapshot TEXT,
            visibility INTEGER NOT NULL DEFAULT 1,
            publish_status INTEGER NOT NULL DEFAULT 1,
            featured INTEGER NOT NULL DEFAULT 0,
            sort_weight INTEGER NOT NULL DEFAULT 0,
            owner_user_id INTEGER,
            source_app_id INTEGER,
            git_repo_url TEXT,
            git_ref TEXT,
            git_sub_path TEXT,
            current_version_id INTEGER,
            app_config_schema TEXT NOT NULL DEFAULT '{}',
            default_app_config TEXT NOT NULL DEFAULT '{}',
            variable_schema TEXT NOT NULL DEFAULT '{}',
            dependency_manifest TEXT NOT NULL DEFAULT '[]',
            capability_manifest TEXT NOT NULL DEFAULT '[]',
            metadata TEXT NOT NULL DEFAULT '{}',
            published_at TEXT,
            deprecated_at TEXT
        )
        "#,
        r#"
        CREATE TABLE ops_audit_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            action TEXT NOT NULL,
            target_type INTEGER NOT NULL,
            target_id INTEGER NOT NULL,
            request_id TEXT,
            operator_id INTEGER,
            operator_type INTEGER,
            change_summary TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        "#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn insert_admin_visible_app(
    pool: &SqlitePool,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
    name: &str,
    app_key: &str,
) {
    sqlx::query(
        r#"
        INSERT INTO platform_app
            (id, uuid, tenant_id, organization_id, data_scope, user_id, name, icon, resource_list, project_id, description, version, access_url, config, status, app_type, platforms, install_platforms, install_skill, install_config, release_notes, package_name, bundle_id, store_url, artifact_media_resource_id, artifact_object_blob_id, artifact_resource_snapshot, created_at, updated_at)
        VALUES
            (?, ?, ?, ?, 0, 0, ?, '{}', '{}', 0, ?, '1.0.0', ?, ?, 1, 'web', '{"platforms":["web"]}', '{"platforms":["web"]}', '{}', '{"packages":[]}', '[]', NULL, NULL, NULL, ?, NULL, ?, '2026-05-09 11:00:00', '2026-05-09 11:00:00')
        "#,
    )
    .bind(id)
    .bind(format!("admin-visible-app-{id}"))
    .bind(tenant_id)
    .bind(organization_id)
    .bind(name)
    .bind(format!("{name} description"))
    .bind(format!("https://apps.example.test/{app_key}"))
    .bind(json!({
        "standard": {
            "appKey": app_key
        },
        "portal": {
            "developer": "SDKWork",
            "marketStatus": "PUBLISHED"
        }
    })
    .to_string())
    .bind(format!("test-admin-app-artifact-{id}"))
    .bind(external_media_resource(
        &format!("https://cdn.example.test/apps/{app_key}.zip"),
        "archive",
    )
    .to_string())
    .execute(pool)
    .await
    .unwrap();
}
