use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAdminSkillStore;
use sdkwork_claw_product::ports::{
    AdminSkillStore, AdminSkillSubject, CreateAdminSkillArtifactCommand,
    CreateAdminSkillAssetCommand, CreateAdminSkillCategoryCommand, CreateAdminSkillCommand,
    CreateAdminSkillPackageCommand, DeleteAdminSkillCategoryCommand, DeleteAdminSkillCommand,
    DeleteAdminSkillPackageCommand, ListAdminSkillArtifactsQuery, ListAdminSkillAssetsQuery,
    ListAdminSkillCategoriesQuery, ListAdminSkillPackagesQuery, ListAdminSkillsQuery,
    ReviewAdminSkillCommand, SetAdminSkillEnabledCommand, SetAdminSkillMarketStatusCommand,
    SetAdminSkillPackageEnabledCommand, UpdateAdminSkillArtifactCommand,
    UpdateAdminSkillAssetCommand, UpdateAdminSkillCategoryCommand, UpdateAdminSkillCommand,
    UpdateAdminSkillPackageCommand,
};
use sdkwork_claw_product_test_support::{repair_sqlite_pool, schema_sqlite_pool};
use serde_json::json;
use sqlx::Row;

const TENANT_ID: i64 = 42;
const ORGANIZATION_ID: i64 = 84;
const OPERATOR_ID: i64 = 9001;
const SNOWFLAKE_ID_FLOOR: i64 = 1_000_000_000_000;

fn external_image(url: &str) -> serde_json::Value {
    json!({
        "kind": "image",
        "source": "external_url",
        "url": url,
        "publicUrl": url
    })
}

fn object_icon(object_key: &str) -> serde_json::Value {
    json!({
        "kind": "image",
        "source": "object_storage",
        "objectKey": object_key
    })
}

#[tokio::test]
async fn sqlite_admin_skill_store_generates_assigned_ids_and_manages_market_lifecycle() {
    let pool = schema_sqlite_pool().await;

    let store = SqliteAdminSkillStore::new(pool.clone());
    let subject = admin_subject();

    let category = store
        .create_category(CreateAdminSkillCategoryCommand {
            subject,
            category_uuid: "admin-skill-category-workflow".to_owned(),
            audit_log_uuid: "audit-create-skill-category-workflow".to_owned(),
            name: "Workflow Automation".to_owned(),
            description: Some("Admin managed workflow skills".to_owned()),
            code: Some("workflow-automation".to_owned()),
            icon: Some(object_icon("workflow")),
            sort_weight: 77,
            parent_id: None,
            path: Some("/skills/workflow-automation".to_owned()),
            visible: true,
            status: 1,
            category_type: 19,
            request_id: "req-create-skill-category".to_owned(),
            requested_at: "2026-05-09T09:00:00Z".to_owned(),
        })
        .await
        .unwrap();

    assert!(
        category.id > SNOWFLAKE_ID_FLOOR,
        "skill category ids must use appbase Snowflake ids, not SQLite rowids"
    );
    assert_eq!(TENANT_ID, category.tenant_id);
    assert_eq!("workflow-automation", category.code.as_deref().unwrap());

    let categories = store
        .list_categories(ListAdminSkillCategoriesQuery { subject })
        .await
        .unwrap();
    assert!(categories.iter().any(|item| item.id == category.id));

    let package = store
        .create_package(CreateAdminSkillPackageCommand {
            subject,
            package_uuid: "admin-skill-package-workflow".to_owned(),
            audit_log_uuid: "audit-create-skill-package-workflow".to_owned(),
            package_key: "workflow-package".to_owned(),
            name: "Workflow Package".to_owned(),
            summary: Some("Workflow skill bundle".to_owned()),
            description: Some("Curated workflow skills".to_owned()),
            icon: Some(external_image(
                "https://cdn.example.test/skills/packages/workflow/icon.png",
            )),
            cover: Some(json!({
                "kind": "image",
                "source": "external_url",
                "url": "https://cdn.example.test/skills/packages/workflow/cover.png",
                "publicUrl": "https://cdn.example.test/skills/packages/workflow/cover.png"
            })),
            category_id: Some(category.id),
            enabled: true,
            featured: true,
            sort_weight: 91,
            tags: vec!["workflow".to_owned(), "agent".to_owned()],
            request_id: "req-create-skill-package".to_owned(),
            requested_at: "2026-05-09T09:00:30Z".to_owned(),
        })
        .await
        .unwrap();

    assert!(
        package.id > SNOWFLAKE_ID_FLOOR,
        "skill package ids must use appbase Snowflake ids"
    );
    assert_eq!("workflow-package", package.package_key);
    assert_eq!(category.id, package.category_id.unwrap());
    assert!(package.enabled);
    assert!(package.featured);

    let listed_packages = store
        .list_packages(ListAdminSkillPackagesQuery {
            subject,
            keyword: Some("workflow".to_owned()),
            enabled: Some(true),
            category_id: Some(category.id),
            page_no: Some(1),
            page_size: Some(10),
        })
        .await
        .unwrap();
    assert_eq!(
        vec![package.id],
        listed_packages
            .iter()
            .map(|item| item.id)
            .collect::<Vec<_>>()
    );

    let updated_package = store
        .update_package(UpdateAdminSkillPackageCommand {
            subject,
            package_id: package.id,
            audit_log_uuid: "audit-update-skill-package-workflow".to_owned(),
            package_key: None,
            name: None,
            summary: Some("Updated workflow skill bundle".to_owned()),
            description: None,
            icon: None,
            cover: None,
            category_id: None,
            enabled: None,
            featured: Some(false),
            sort_weight: Some(73),
            tags: Some(vec!["workflow".to_owned(), "quality".to_owned()]),
            request_id: "req-update-skill-package".to_owned(),
            requested_at: "2026-05-09T09:00:40Z".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!(
        "Updated workflow skill bundle",
        updated_package.summary.as_deref().unwrap()
    );
    assert!(!updated_package.featured);
    assert_eq!(73, updated_package.sort_weight);
    assert_eq!(vec!["workflow", "quality"], updated_package.tags);

    let disabled_package = store
        .set_package_enabled(SetAdminSkillPackageEnabledCommand {
            subject,
            package_id: package.id,
            enabled: false,
            audit_log_uuid: "audit-disable-skill-package-workflow".to_owned(),
            request_id: "req-disable-skill-package".to_owned(),
            requested_at: "2026-05-09T09:00:50Z".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    assert!(!disabled_package.enabled);

    let enabled_package = store
        .set_package_enabled(SetAdminSkillPackageEnabledCommand {
            subject,
            package_id: package.id,
            enabled: true,
            audit_log_uuid: "audit-enable-skill-package-workflow".to_owned(),
            request_id: "req-enable-skill-package".to_owned(),
            requested_at: "2026-05-09T09:00:55Z".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    assert!(enabled_package.enabled);

    let skill = store
        .create_skill(CreateAdminSkillCommand {
            subject,
            skill_uuid: "admin-skill-workflow-planner-pro".to_owned(),
            audit_log_uuid: "audit-create-skill-workflow-planner-pro".to_owned(),
            skill_key: "workflow-planner-pro".to_owned(),
            name: "Workflow Planner Pro".to_owned(),
            summary: Some("Plans agent delivery workflows".to_owned()),
            description: Some("Turns broad goals into executable plans.".to_owned()),
            icon: Some(external_image(
                "https://cdn.example.test/skills/workflow/icon.png",
            )),
            cover: Some(json!({
                "kind": "image",
                "source": "external_url",
                "url": "https://cdn.example.test/skills/workflow/cover.png",
                "publicUrl": "https://cdn.example.test/skills/workflow/cover.png"
            })),
            category_id: Some(category.id),
            package_id: Some(package.id),
            provider: Some("SDKWork".to_owned()),
            version: Some("1.0.0".to_owned()),
            version_name: Some("1.0.0".to_owned()),
            runtime: Some("wasm".to_owned()),
            entrypoint: Some("workflow_planner:start".to_owned()),
            manifest_url: Some("https://cdn.example.test/skills/workflow/manifest.json".to_owned()),
            repository_url: Some("https://github.com/sdkwork/workflow-planner-pro".to_owned()),
            homepage_url: Some("https://skills.example.test/workflow-planner-pro".to_owned()),
            documentation_url: Some("https://docs.example.test/workflow-planner-pro".to_owned()),
            license_name: Some("Apache-2.0".to_owned()),
            source_type: "COMMUNITY".to_owned(),
            market_status: "DRAFT".to_owned(),
            visibility: "PUBLIC".to_owned(),
            review_status: "PENDING".to_owned(),
            builtin: false,
            is_builtin: false,
            enabled: true,
            featured: true,
            recommend_weight: 88,
            price: Some("0".to_owned()),
            currency: "CNY".to_owned(),
            tags: vec!["agent".to_owned(), "workflow".to_owned()],
            capabilities: vec!["workflow.plan".to_owned(), "task.decompose".to_owned()],
            config_schema: json!({
                "type": "object",
                "properties": {
                    "planningDepth": {
                        "type": "string",
                        "enum": ["standard", "deep"]
                    }
                }
            }),
            default_config: json!({
                "planningDepth": "standard",
                "portal": {
                    "developer": "Workflow Studio"
                }
            }),
            request_id: "req-create-skill".to_owned(),
            requested_at: "2026-05-09T09:01:00Z".to_owned(),
        })
        .await
        .unwrap();

    assert!(
        skill.id > SNOWFLAKE_ID_FLOOR,
        "skills must use the same appbase Snowflake id standard on SQLite and Postgres"
    );
    assert_eq!(category.id, skill.category_id.unwrap());
    assert_eq!(package.id, skill.package_id.unwrap());
    assert_eq!("DRAFT", skill.market_status);
    assert_eq!("PENDING", skill.review_status);
    assert_eq!(vec!["agent", "workflow"], skill.tags);

    let stored_skill = sqlx::query(
        r#"
        SELECT id, tenant_id, organization_id, category_id, tags, capabilities,
               CAST(cover_resource_snapshot AS TEXT) AS cover_resource_snapshot,
               config_schema, default_config
        FROM plus_agent_skill
        WHERE id = ?
        "#,
    )
    .bind(skill.id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(skill.id, stored_skill.get::<i64, _>("id"));
    assert_eq!(TENANT_ID, stored_skill.get::<i64, _>("tenant_id"));
    assert_eq!(
        ORGANIZATION_ID,
        stored_skill.get::<i64, _>("organization_id")
    );
    assert_eq!(category.id, stored_skill.get::<i64, _>("category_id"));
    assert_eq!(
        vec!["agent".to_owned(), "workflow".to_owned()],
        serde_json::from_str::<Vec<String>>(stored_skill.get::<String, _>("tags").as_str())
            .unwrap()
    );
    let stored_cover: serde_json::Value = serde_json::from_str(
        stored_skill
            .get::<String, _>("cover_resource_snapshot")
            .as_str(),
    )
    .unwrap();
    assert_eq!(
        "https://cdn.example.test/skills/workflow/cover.png",
        stored_cover["url"]
    );
    assert_eq!(
        vec!["workflow.plan".to_owned(), "task.decompose".to_owned()],
        serde_json::from_str::<Vec<String>>(stored_skill.get::<String, _>("capabilities").as_str())
            .unwrap()
    );
    assert_eq!(
        "standard",
        serde_json::from_str::<serde_json::Value>(
            stored_skill.get::<String, _>("default_config").as_str()
        )
        .unwrap()["planningDepth"]
    );

    let updated = store
        .update_skill(UpdateAdminSkillCommand {
            subject,
            skill_id: skill.id,
            audit_log_uuid: "audit-update-skill-workflow-planner-pro".to_owned(),
            skill_key: None,
            name: None,
            summary: Some("Polishes agent implementation plans".to_owned()),
            description: None,
            icon: None,
            cover: None,
            category_id: None,
            package_id: None,
            provider: None,
            version: Some("1.1.0".to_owned()),
            version_name: Some(Some("1.1.0".to_owned())),
            runtime: None,
            entrypoint: None,
            manifest_url: None,
            repository_url: None,
            homepage_url: None,
            documentation_url: None,
            license_name: None,
            source_type: None,
            visibility: None,
            builtin: None,
            is_builtin: None,
            featured: Some(false),
            recommend_weight: Some(61),
            price: None,
            currency: None,
            tags: Some(vec!["agent".to_owned(), "planning".to_owned()]),
            capabilities: Some(vec![
                "workflow.plan".to_owned(),
                "verification.gate".to_owned(),
            ]),
            config_schema: None,
            default_config: Some(json!({"planningDepth": "deep"})),
            request_id: "req-update-skill".to_owned(),
            requested_at: "2026-05-09T09:02:00Z".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();

    assert_eq!("1.1.0", updated.version.as_deref().unwrap());
    assert_eq!(false, updated.featured);
    assert_eq!(61, updated.recommend_weight);
    assert_eq!(
        vec!["workflow.plan", "verification.gate"],
        updated.capabilities
    );
    assert_eq!("deep", updated.default_config["planningDepth"]);

    let approved = store
        .review_skill(ReviewAdminSkillCommand {
            subject,
            skill_id: skill.id,
            review_status: "APPROVED".to_owned(),
            review_comment: Some("Approved for publication.".to_owned()),
            audit_log_uuid: "audit-approve-skill-workflow-planner-pro".to_owned(),
            request_id: "req-approve-skill".to_owned(),
            requested_at: "2026-05-09T09:03:00Z".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!("APPROVED", approved.review_status);
    assert_eq!(Some(OPERATOR_ID), approved.reviewed_by);

    let published = store
        .set_market_status(SetAdminSkillMarketStatusCommand {
            subject,
            skill_id: skill.id,
            market_status: "PUBLISHED".to_owned(),
            publish: true,
            audit_log_uuid: "audit-publish-skill-workflow-planner-pro".to_owned(),
            request_id: "req-publish-skill".to_owned(),
            requested_at: "2026-05-09T09:04:00Z".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!("PUBLISHED", published.market_status);
    assert_eq!(
        Some("2026-05-09T09:04:00Z"),
        published.latest_published_at.as_deref()
    );

    let disabled = store
        .set_skill_enabled(SetAdminSkillEnabledCommand {
            subject,
            skill_id: skill.id,
            enabled: false,
            audit_log_uuid: "audit-disable-skill-workflow-planner-pro".to_owned(),
            request_id: "req-disable-skill".to_owned(),
            requested_at: "2026-05-09T09:05:00Z".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    assert!(!disabled.enabled);

    let enabled = store
        .set_skill_enabled(SetAdminSkillEnabledCommand {
            subject,
            skill_id: skill.id,
            enabled: true,
            audit_log_uuid: "audit-enable-skill-workflow-planner-pro".to_owned(),
            request_id: "req-enable-skill".to_owned(),
            requested_at: "2026-05-09T09:06:00Z".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    assert!(enabled.enabled);

    let offline = store
        .set_market_status(SetAdminSkillMarketStatusCommand {
            subject,
            skill_id: skill.id,
            market_status: "OFFLINE".to_owned(),
            publish: false,
            audit_log_uuid: "audit-offline-skill-workflow-planner-pro".to_owned(),
            request_id: "req-offline-skill".to_owned(),
            requested_at: "2026-05-09T09:07:00Z".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!("OFFLINE", offline.market_status);

    let rejected = store
        .review_skill(ReviewAdminSkillCommand {
            subject,
            skill_id: skill.id,
            review_status: "REJECTED".to_owned(),
            review_comment: Some("Needs clearer docs.".to_owned()),
            audit_log_uuid: "audit-reject-skill-workflow-planner-pro".to_owned(),
            request_id: "req-reject-skill".to_owned(),
            requested_at: "2026-05-09T09:08:00Z".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!("REJECTED", rejected.review_status);
    assert_eq!("Needs clearer docs.", rejected.review_comment.unwrap());

    let filtered = store
        .list_skills(ListAdminSkillsQuery {
            subject,
            keyword: Some("planner".to_owned()),
            market_status: Some("OFFLINE".to_owned()),
            review_status: Some("REJECTED".to_owned()),
            visibility: Some("PUBLIC".to_owned()),
            enabled: Some(true),
            category_id: Some(category.id),
            page_no: Some(1),
            page_size: Some(10),
        })
        .await
        .unwrap();
    assert_eq!(
        vec![skill.id],
        filtered.iter().map(|item| item.id).collect::<Vec<_>>()
    );

    let loaded = store
        .get_skill(
            ListAdminSkillsQuery {
                subject,
                keyword: None,
                market_status: Some("OFFLINE".to_owned()),
                review_status: None,
                visibility: None,
                enabled: None,
                category_id: None,
                page_no: None,
                page_size: None,
            },
            skill.id,
        )
        .await
        .unwrap()
        .unwrap();
    assert_eq!("workflow-planner-pro", loaded.skill_key);

    sqlx::query(
        r#"
        INSERT INTO plus_user_agent_skill
            (id, uuid, tenant_id, organization_id, data_scope, user_id, skill_id, enabled, config)
        VALUES
            (?, 'user-skill-workflow-planner-pro', ?, ?, 1, 1001, ?, 1, '{}')
        "#,
    )
    .bind(SNOWFLAKE_ID_FLOOR + 99)
    .bind(TENANT_ID)
    .bind(ORGANIZATION_ID)
    .bind(skill.id)
    .execute(&pool)
    .await
    .unwrap();

    let deleted = store
        .delete_skill(DeleteAdminSkillCommand {
            subject,
            skill_id: skill.id,
            audit_log_uuid: "audit-delete-skill-workflow-planner-pro".to_owned(),
            request_id: "req-delete-skill".to_owned(),
            requested_at: "2026-05-09T09:09:00Z".to_owned(),
        })
        .await
        .unwrap();
    assert!(deleted);

    let skill_rows: i64 = sqlx::query_scalar("SELECT COUNT(1) FROM plus_agent_skill WHERE id = ?")
        .bind(skill.id)
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(0, skill_rows);
    let user_skill_rows: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM plus_user_agent_skill WHERE skill_id = ?")
            .bind(skill.id)
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(0, user_skill_rows);

    let audit_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ops_audit_log
        WHERE tenant_id = ?
          AND organization_id = ?
          AND target_type = 35
        "#,
    )
    .bind(TENANT_ID)
    .bind(ORGANIZATION_ID)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(14, audit_count);

    let missing_category = store
        .create_skill(CreateAdminSkillCommand {
            subject,
            skill_uuid: "admin-skill-invalid-category".to_owned(),
            audit_log_uuid: "audit-create-invalid-category-skill".to_owned(),
            skill_key: "invalid-category-skill".to_owned(),
            name: "Invalid Category Skill".to_owned(),
            summary: None,
            description: None,
            icon: None,
            cover: None,
            category_id: Some(SNOWFLAKE_ID_FLOOR + 123),
            package_id: None,
            provider: None,
            version: None,
            version_name: None,
            runtime: None,
            entrypoint: None,
            manifest_url: None,
            repository_url: None,
            homepage_url: None,
            documentation_url: None,
            license_name: None,
            source_type: "COMMUNITY".to_owned(),
            market_status: "DRAFT".to_owned(),
            visibility: "PUBLIC".to_owned(),
            review_status: "PENDING".to_owned(),
            builtin: false,
            is_builtin: false,
            enabled: true,
            featured: false,
            recommend_weight: 0,
            price: None,
            currency: "CNY".to_owned(),
            tags: Vec::new(),
            capabilities: Vec::new(),
            config_schema: json!({}),
            default_config: json!({}),
            request_id: "req-invalid-category-skill".to_owned(),
            requested_at: "2026-05-09T09:10:00Z".to_owned(),
        })
        .await
        .unwrap_err();
    assert!(
        missing_category.is_not_found(),
        "store must reject skills linked to categories outside the tenant/org scope"
    );

    let missing_package = store
        .create_skill(CreateAdminSkillCommand {
            subject,
            skill_uuid: "admin-skill-invalid-package".to_owned(),
            audit_log_uuid: "audit-create-invalid-package-skill".to_owned(),
            skill_key: "invalid-package-skill".to_owned(),
            name: "Invalid Package Skill".to_owned(),
            summary: None,
            description: None,
            icon: None,
            cover: None,
            category_id: None,
            package_id: Some(SNOWFLAKE_ID_FLOOR + 456),
            provider: None,
            version: None,
            version_name: None,
            runtime: None,
            entrypoint: None,
            manifest_url: None,
            repository_url: None,
            homepage_url: None,
            documentation_url: None,
            license_name: None,
            source_type: "COMMUNITY".to_owned(),
            market_status: "DRAFT".to_owned(),
            visibility: "PUBLIC".to_owned(),
            review_status: "PENDING".to_owned(),
            builtin: false,
            is_builtin: false,
            enabled: true,
            featured: false,
            recommend_weight: 0,
            price: None,
            currency: "CNY".to_owned(),
            tags: Vec::new(),
            capabilities: Vec::new(),
            config_schema: json!({}),
            default_config: json!({}),
            request_id: "req-invalid-package-skill".to_owned(),
            requested_at: "2026-05-09T09:10:30Z".to_owned(),
        })
        .await
        .unwrap_err();
    assert!(
        missing_package.is_not_found(),
        "store must reject skills linked to packages outside the tenant/org scope"
    );

    let deleted_package = store
        .delete_package(DeleteAdminSkillPackageCommand {
            subject,
            package_id: package.id,
            audit_log_uuid: "audit-delete-skill-package-workflow".to_owned(),
            request_id: "req-delete-skill-package".to_owned(),
            requested_at: "2026-05-09T09:11:00Z".to_owned(),
        })
        .await
        .unwrap();
    assert!(deleted_package);

    let package_rows: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM plus_agent_skill_package WHERE id = ?")
            .bind(package.id)
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(0, package_rows);
    let linked_skill_rows: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM plus_agent_skill WHERE package_id = ?")
            .bind(package.id)
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(
        0, linked_skill_rows,
        "deleting a skill package must clear package links instead of deleting skills"
    );

    let updated_category = store
        .update_category(UpdateAdminSkillCategoryCommand {
            subject,
            category_id: category.id,
            audit_log_uuid: "audit-update-skill-category-workflow".to_owned(),
            name: Some("Workflow Orchestration".to_owned()),
            description: Some(None),
            code: Some(Some("workflow-orchestration".to_owned())),
            icon: Some(None),
            sort_weight: Some(66),
            parent_id: Some(None),
            path: Some(Some("/skills/workflow-orchestration".to_owned())),
            visible: Some(false),
            status: Some(1),
            category_type: Some(20),
            request_id: "req-update-skill-category".to_owned(),
            requested_at: "2026-05-09T09:12:00Z".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!("Workflow Orchestration", updated_category.name);
    assert_eq!(None, updated_category.description);
    assert_eq!(
        Some("workflow-orchestration"),
        updated_category.code.as_deref()
    );
    assert_eq!(None, updated_category.icon);
    assert_eq!(66, updated_category.sort_weight);
    assert!(!updated_category.visible);
    assert_eq!(20, updated_category.category_type);

    let deleted_category = store
        .delete_category(DeleteAdminSkillCategoryCommand {
            subject,
            category_id: category.id,
            audit_log_uuid: "audit-delete-skill-category-workflow".to_owned(),
            request_id: "req-delete-skill-category".to_owned(),
            requested_at: "2026-05-09T09:13:00Z".to_owned(),
        })
        .await
        .unwrap();
    assert!(deleted_category);

    let category_status: i64 = sqlx::query_scalar("SELECT status FROM plus_category WHERE id = ?")
        .bind(category.id)
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(-1, category_status);

    let categories = store
        .list_categories(ListAdminSkillCategoriesQuery { subject })
        .await
        .unwrap();
    assert!(
        categories.iter().all(|item| item.id != category.id),
        "deleted skill categories must be hidden from active category lists"
    );
}

#[tokio::test]
async fn sqlite_admin_skill_store_manages_assets_and_artifacts_as_skill_catalog_records() {
    let pool = schema_sqlite_pool().await;

    let store = SqliteAdminSkillStore::new(pool.clone());
    let subject = admin_subject();
    let skill = store
        .create_skill(CreateAdminSkillCommand {
            subject,
            skill_uuid: "admin-skill-asset-artifact-root".to_owned(),
            audit_log_uuid: "audit-create-asset-artifact-root".to_owned(),
            skill_key: "asset-artifact-root".to_owned(),
            name: "Asset Artifact Root".to_owned(),
            summary: Some("Skill with managed assets and artifacts".to_owned()),
            description: None,
            icon: None,
            cover: None,
            category_id: None,
            package_id: None,
            provider: Some("SDKWork".to_owned()),
            version: Some("1.0.0".to_owned()),
            version_name: Some("1.0.0".to_owned()),
            runtime: Some("builtin".to_owned()),
            entrypoint: Some("skill.json".to_owned()),
            manifest_url: Some("data/skills/manifests/asset-artifact-root.json".to_owned()),
            repository_url: None,
            homepage_url: None,
            documentation_url: None,
            license_name: Some("SDKWork Commercial".to_owned()),
            source_type: "OFFICIAL".to_owned(),
            market_status: "DRAFT".to_owned(),
            visibility: "PUBLIC".to_owned(),
            review_status: "PENDING".to_owned(),
            builtin: true,
            is_builtin: true,
            enabled: true,
            featured: false,
            recommend_weight: 10,
            price: Some("0".to_owned()),
            currency: "CNY".to_owned(),
            tags: vec!["asset".to_owned()],
            capabilities: vec!["catalog.asset".to_owned()],
            config_schema: json!({}),
            default_config: json!({}),
            request_id: "req-create-asset-artifact-root".to_owned(),
            requested_at: "2026-05-09T10:00:00Z".to_owned(),
        })
        .await
        .unwrap();

    let asset = store
        .create_asset(CreateAdminSkillAssetCommand {
            subject,
            skill_id: skill.id,
            asset_uuid: "admin-skill-asset-cover".to_owned(),
            audit_log_uuid: "audit-create-admin-skill-asset-cover".to_owned(),
            artifact_id: None,
            asset_type: 1,
            asset: json!({
                "kind": "image",
                "source": "external_url",
                "url": "https://cdn.example.test/skills/asset-artifact/cover.png",
                "publicUrl": "https://cdn.example.test/skills/asset-artifact/cover.png"
            }),
            thumbnail: Some(json!({
                "kind": "image",
                "source": "external_url",
                "url": "https://cdn.example.test/skills/asset-artifact/thumb.png",
                "publicUrl": "https://cdn.example.test/skills/asset-artifact/thumb.png"
            })),
            title: Some("Asset cover".to_owned()),
            alt_text: Some("Skill marketplace cover".to_owned()),
            mime_type: Some("image/png".to_owned()),
            width: Some(1200),
            height: Some(720),
            duration_seconds: None,
            file_size: Some(182000),
            sort_order: 10,
            status: 1,
            published_at: Some("2026-05-09T10:01:00Z".to_owned()),
            request_id: "req-create-admin-skill-asset-cover".to_owned(),
            requested_at: "2026-05-09T10:01:00Z".to_owned(),
        })
        .await
        .unwrap();

    assert!(
        asset.id > SNOWFLAKE_ID_FLOOR,
        "skill asset ids must use appbase Snowflake ids"
    );
    assert_eq!(35, asset.target_type);
    assert_eq!(skill.id, asset.target_id);
    assert_eq!(1, asset.asset_type);
    assert_eq!(
        "https://cdn.example.test/skills/asset-artifact/cover.png",
        asset.asset["url"]
    );
    assert_eq!(
        "https://cdn.example.test/skills/asset-artifact/thumb.png",
        asset.thumbnail.as_ref().unwrap()["url"]
    );

    let asset_row = sqlx::query(
        r#"
        SELECT id, tenant_id, organization_id, target_type, target_id, asset_type,
               asset_resource_snapshot, thumbnail_resource_snapshot, title, width, height, file_size, sort_order, status
        FROM studio_catalog_asset
        WHERE id = ?
        "#,
    )
    .bind(asset.id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(asset.id, asset_row.get::<i64, _>("id"));
    assert_eq!(TENANT_ID, asset_row.get::<i64, _>("tenant_id"));
    assert_eq!(ORGANIZATION_ID, asset_row.get::<i64, _>("organization_id"));
    assert_eq!(35, asset_row.get::<i64, _>("target_type"));
    assert_eq!(skill.id, asset_row.get::<i64, _>("target_id"));
    assert_eq!(1, asset_row.get::<i64, _>("asset_type"));
    let stored_asset: serde_json::Value =
        serde_json::from_str(&asset_row.get::<String, _>("asset_resource_snapshot")).unwrap();
    let stored_thumbnail: serde_json::Value =
        serde_json::from_str(&asset_row.get::<String, _>("thumbnail_resource_snapshot")).unwrap();
    assert_eq!(
        "https://cdn.example.test/skills/asset-artifact/cover.png",
        stored_asset["url"]
    );
    assert_eq!(
        "https://cdn.example.test/skills/asset-artifact/thumb.png",
        stored_thumbnail["url"]
    );
    assert_eq!("Asset cover", asset_row.get::<String, _>("title"));
    assert_eq!(1200, asset_row.get::<i64, _>("width"));
    assert_eq!(720, asset_row.get::<i64, _>("height"));
    assert_eq!(182000, asset_row.get::<i64, _>("file_size"));
    assert_eq!(10, asset_row.get::<i64, _>("sort_order"));
    assert_eq!(1, asset_row.get::<i64, _>("status"));

    let updated_asset = store
        .update_asset(UpdateAdminSkillAssetCommand {
            subject,
            skill_id: skill.id,
            asset_id: asset.id,
            audit_log_uuid: "audit-update-admin-skill-asset-cover".to_owned(),
            artifact_id: None,
            asset_type: Some(2),
            asset: None,
            thumbnail: Some(None),
            title: Some(Some("Updated asset cover".to_owned())),
            alt_text: None,
            mime_type: None,
            width: Some(Some(1280)),
            height: None,
            duration_seconds: None,
            file_size: Some(Some(190000)),
            sort_order: Some(20),
            status: Some(1),
            published_at: None,
            request_id: "req-update-admin-skill-asset-cover".to_owned(),
            requested_at: "2026-05-09T10:02:00Z".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!(2, updated_asset.asset_type);
    assert_eq!("Updated asset cover", updated_asset.title.unwrap());
    assert_eq!(None, updated_asset.thumbnail);
    assert_eq!(Some(1280), updated_asset.width);
    assert_eq!(Some(190000), updated_asset.file_size);
    assert_eq!(20, updated_asset.sort_order);

    let listed_assets = store
        .list_assets(ListAdminSkillAssetsQuery {
            subject,
            skill_id: skill.id,
        })
        .await
        .unwrap();
    assert_eq!(
        vec![asset.id],
        listed_assets.iter().map(|item| item.id).collect::<Vec<_>>()
    );

    let artifact = store
        .create_artifact(CreateAdminSkillArtifactCommand {
            subject,
            skill_id: skill.id,
            artifact_uuid: "admin-skill-artifact-runtime".to_owned(),
            audit_log_uuid: "audit-create-admin-skill-artifact-runtime".to_owned(),
            artifact_type: 1,
            version: "1.0.0".to_owned(),
            platform_type: "agent".to_owned(),
            os_name: "runtime".to_owned(),
            artifact_ref: Some("builtin://sdkwork.skills.asset_artifact@1.0.0".to_owned()),
            artifact: Some(json!({
                "kind": "document",
                "source": "external_url",
                "url": "data/skills/artifacts/asset-artifact-1.0.0.json",
                "publicUrl": "data/skills/artifacts/asset-artifact-1.0.0.json"
            })),
            artifact_size_bytes: 2048,
            runtime: Some("builtin".to_owned()),
            frameworks: vec!["Rust service".to_owned(), "OpenAI-compatible".to_owned()],
            license_name: Some("SDKWork Commercial".to_owned()),
            checksum_hash: Some(
                "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
                    .to_owned(),
            ),
            release_notes: Some("Initial release.".to_owned()),
            status: 1,
            published_at: Some("2026-05-09T10:03:00Z".to_owned()),
            deprecated_at: None,
            request_id: "req-create-admin-skill-artifact-runtime".to_owned(),
            requested_at: "2026-05-09T10:03:00Z".to_owned(),
        })
        .await
        .unwrap();

    assert!(
        artifact.id > SNOWFLAKE_ID_FLOOR,
        "skill artifact ids must use appbase Snowflake ids"
    );
    assert_eq!(35, artifact.target_type);
    assert_eq!(skill.id, artifact.target_id);
    assert_eq!(2048, artifact.artifact_size_bytes);
    assert_eq!(
        vec!["Rust service", "OpenAI-compatible"],
        artifact.frameworks
    );

    let artifact_row = sqlx::query(
        r#"
        SELECT id, tenant_id, organization_id, target_type, target_id, artifact_type,
               version, platform_type, os_name, artifact_ref,
               CAST(artifact_resource_snapshot AS TEXT) AS artifact_resource_snapshot,
               artifact_size_bytes, runtime, CAST(frameworks AS TEXT) AS frameworks,
               license_name, checksum_hash, release_notes, status
        FROM studio_catalog_artifact
        WHERE id = ?
        "#,
    )
    .bind(artifact.id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(artifact.id, artifact_row.get::<i64, _>("id"));
    assert_eq!(TENANT_ID, artifact_row.get::<i64, _>("tenant_id"));
    assert_eq!(
        ORGANIZATION_ID,
        artifact_row.get::<i64, _>("organization_id")
    );
    assert_eq!(35, artifact_row.get::<i64, _>("target_type"));
    assert_eq!(skill.id, artifact_row.get::<i64, _>("target_id"));
    assert_eq!("1.0.0", artifact_row.get::<String, _>("version"));
    assert_eq!("agent", artifact_row.get::<String, _>("platform_type"));
    assert_eq!("runtime", artifact_row.get::<String, _>("os_name"));
    assert_eq!(
        "builtin://sdkwork.skills.asset_artifact@1.0.0",
        artifact_row.get::<String, _>("artifact_ref")
    );
    let artifact_snapshot: serde_json::Value = serde_json::from_str(
        artifact_row
            .get::<String, _>("artifact_resource_snapshot")
            .as_str(),
    )
    .unwrap();
    assert_eq!(
        "data/skills/artifacts/asset-artifact-1.0.0.json",
        artifact_snapshot["url"]
    );
    assert_eq!(2048, artifact_row.get::<i64, _>("artifact_size_bytes"));
    assert_eq!(
        vec!["Rust service".to_owned(), "OpenAI-compatible".to_owned()],
        serde_json::from_str::<Vec<String>>(artifact_row.get::<String, _>("frameworks").as_str())
            .unwrap()
    );

    let updated_artifact = store
        .update_artifact(UpdateAdminSkillArtifactCommand {
            subject,
            skill_id: skill.id,
            artifact_id: artifact.id,
            audit_log_uuid: "audit-update-admin-skill-artifact-runtime".to_owned(),
            artifact_type: None,
            version: Some("1.0.1".to_owned()),
            platform_type: None,
            os_name: None,
            artifact_ref: None,
            artifact: None,
            artifact_size_bytes: Some(4096),
            runtime: None,
            frameworks: Some(vec!["Rust service".to_owned(), "React portal".to_owned()]),
            license_name: None,
            checksum_hash: Some(None),
            release_notes: Some(Some("Patch release.".to_owned())),
            status: Some(1),
            published_at: None,
            deprecated_at: None,
            request_id: "req-update-admin-skill-artifact-runtime".to_owned(),
            requested_at: "2026-05-09T10:04:00Z".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!("1.0.1", updated_artifact.version);
    assert_eq!(4096, updated_artifact.artifact_size_bytes);
    assert_eq!(
        vec!["Rust service", "React portal"],
        updated_artifact.frameworks
    );
    assert_eq!(None, updated_artifact.checksum_hash);

    let listed_artifacts = store
        .list_artifacts(ListAdminSkillArtifactsQuery {
            subject,
            skill_id: skill.id,
        })
        .await
        .unwrap();
    assert_eq!(
        vec![artifact.id],
        listed_artifacts
            .iter()
            .map(|item| item.id)
            .collect::<Vec<_>>()
    );

    let missing_skill_asset = store
        .create_asset(CreateAdminSkillAssetCommand {
            subject,
            skill_id: SNOWFLAKE_ID_FLOOR + 321,
            asset_uuid: "admin-skill-asset-missing-skill".to_owned(),
            audit_log_uuid: "audit-create-admin-skill-asset-missing-skill".to_owned(),
            artifact_id: None,
            asset_type: 1,
            asset: json!({
                "kind": "image",
                "source": "external_url",
                "url": "https://cdn.example.test/skills/missing/cover.png",
                "publicUrl": "https://cdn.example.test/skills/missing/cover.png"
            }),
            thumbnail: None,
            title: None,
            alt_text: None,
            mime_type: None,
            width: None,
            height: None,
            duration_seconds: None,
            file_size: None,
            sort_order: 0,
            status: 1,
            published_at: None,
            request_id: "req-create-admin-skill-asset-missing-skill".to_owned(),
            requested_at: "2026-05-09T10:05:00Z".to_owned(),
        })
        .await
        .unwrap_err();
    assert!(
        missing_skill_asset.is_not_found(),
        "asset creation must reject skills outside the tenant/org scope"
    );

    let missing_skill_artifact = store
        .create_artifact(CreateAdminSkillArtifactCommand {
            subject,
            skill_id: SNOWFLAKE_ID_FLOOR + 654,
            artifact_uuid: "admin-skill-artifact-missing-skill".to_owned(),
            audit_log_uuid: "audit-create-admin-skill-artifact-missing-skill".to_owned(),
            artifact_type: 1,
            version: "1.0.0".to_owned(),
            platform_type: "agent".to_owned(),
            os_name: "runtime".to_owned(),
            artifact_ref: Some("builtin://sdkwork.skills.missing@1.0.0".to_owned()),
            artifact: None,
            artifact_size_bytes: 1,
            runtime: Some("builtin".to_owned()),
            frameworks: Vec::new(),
            license_name: None,
            checksum_hash: None,
            release_notes: None,
            status: 1,
            published_at: None,
            deprecated_at: None,
            request_id: "req-create-admin-skill-artifact-missing-skill".to_owned(),
            requested_at: "2026-05-09T10:05:30Z".to_owned(),
        })
        .await
        .unwrap_err();
    assert!(
        missing_skill_artifact.is_not_found(),
        "artifact creation must reject skills outside the tenant/org scope"
    );

    let deleted = store
        .delete_skill(DeleteAdminSkillCommand {
            subject,
            skill_id: skill.id,
            audit_log_uuid: "audit-delete-asset-artifact-root".to_owned(),
            request_id: "req-delete-asset-artifact-root".to_owned(),
            requested_at: "2026-05-09T10:06:00Z".to_owned(),
        })
        .await
        .unwrap();
    assert!(deleted);

    let remaining_assets: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM studio_catalog_asset WHERE target_type = 35 AND target_id = ?",
    )
    .bind(skill.id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(0, remaining_assets);
    let remaining_artifacts: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM studio_catalog_artifact WHERE target_type = 35 AND target_id = ?",
    )
    .bind(skill.id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(0, remaining_artifacts);
}

#[tokio::test]
async fn sqlite_admin_skill_store_lists_skill_store_visible_catalog_scopes() {
    let pool = repair_sqlite_pool().await;

    insert_admin_visible_skill_catalog(
        &pool,
        40_001_001,
        40_001_101,
        40_001_201,
        TENANT_ID,
        ORGANIZATION_ID,
        "Tenant Skill Catalog",
        "tenant-catalog-skill",
    )
    .await;
    insert_admin_visible_skill_catalog(
        &pool,
        40_002_001,
        40_002_101,
        40_002_201,
        0,
        0,
        "Product Skill Catalog",
        "product-catalog-skill",
    )
    .await;
    insert_admin_visible_skill_catalog(
        &pool,
        40_003_001,
        40_003_101,
        40_003_201,
        TENANT_ID + 1,
        0,
        "Other Tenant Skill Catalog",
        "other-tenant-catalog-skill",
    )
    .await;
    insert_admin_visible_skill_asset(&pool, 40_002_301, 0, 0, 40_002_201, "product").await;
    insert_admin_visible_skill_artifact(&pool, 40_002_401, 0, 0, 40_002_201, "product").await;

    let store = SqliteAdminSkillStore::new(pool.clone());
    let subject = admin_subject();

    let categories = store
        .list_categories(ListAdminSkillCategoriesQuery { subject })
        .await
        .unwrap();
    let category_names = categories
        .iter()
        .map(|item| item.name.as_str())
        .collect::<Vec<_>>();
    assert!(category_names.contains(&"Tenant Skill Catalog"));
    assert!(
        category_names.contains(&"Product Skill Catalog"),
        "admin skill management must see public skill-store categories"
    );
    assert!(
        !category_names.contains(&"Other Tenant Skill Catalog"),
        "admin skill management must not cross into unrelated tenant skill catalogs"
    );

    let packages = store
        .list_packages(ListAdminSkillPackagesQuery {
            subject,
            keyword: Some("Catalog".to_owned()),
            enabled: Some(true),
            category_id: None,
            page_no: Some(1),
            page_size: Some(20),
        })
        .await
        .unwrap();
    let package_keys = packages
        .iter()
        .map(|item| item.package_key.as_str())
        .collect::<Vec<_>>();
    assert!(package_keys.contains(&"tenant-catalog-skill-package"));
    assert!(
        package_keys.contains(&"product-catalog-skill-package"),
        "admin skill management must see public skill-store packages"
    );
    assert!(!package_keys.contains(&"other-tenant-catalog-skill-package"));

    let skills = store
        .list_skills(ListAdminSkillsQuery {
            subject,
            keyword: Some("Catalog".to_owned()),
            market_status: Some("PUBLISHED".to_owned()),
            review_status: Some("APPROVED".to_owned()),
            visibility: Some("PUBLIC".to_owned()),
            enabled: Some(true),
            category_id: None,
            page_no: Some(1),
            page_size: Some(20),
        })
        .await
        .unwrap();
    let skill_keys = skills
        .iter()
        .map(|item| item.skill_key.as_str())
        .collect::<Vec<_>>();
    assert!(skill_keys.contains(&"tenant-catalog-skill"));
    assert!(
        skill_keys.contains(&"product-catalog-skill"),
        "admin skill management must see public skill-store skills"
    );
    assert!(!skill_keys.contains(&"other-tenant-catalog-skill"));

    let assets = store
        .list_assets(ListAdminSkillAssetsQuery {
            subject,
            skill_id: 40_002_201,
        })
        .await
        .unwrap();
    assert_eq!(
        vec![40_002_301],
        assets.iter().map(|item| item.id).collect::<Vec<_>>(),
        "admin skill management must read public skill-store assets"
    );

    let artifacts = store
        .list_artifacts(ListAdminSkillArtifactsQuery {
            subject,
            skill_id: 40_002_201,
        })
        .await
        .unwrap();
    assert_eq!(
        vec![40_002_401],
        artifacts.iter().map(|item| item.id).collect::<Vec<_>>(),
        "admin skill management must read public skill-store artifacts"
    );

    let public_update = store
        .set_skill_enabled(SetAdminSkillEnabledCommand {
            subject,
            skill_id: 40_002_201,
            enabled: false,
            audit_log_uuid: "audit-disable-public-skill-catalog".to_owned(),
            request_id: "req-disable-public-skill-catalog".to_owned(),
            requested_at: "2026-05-09T11:00:00Z".to_owned(),
        })
        .await
        .unwrap();
    assert!(
        public_update.is_none(),
        "public skill-store rows must be readable from admin but not mutable through tenant admin writes"
    );
    let public_enabled: i64 =
        sqlx::query_scalar("SELECT enabled FROM plus_agent_skill WHERE id = ?")
            .bind(40_002_201)
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(1, public_enabled);
}

fn admin_subject() -> AdminSkillSubject {
    AdminSkillSubject {
        tenant_id: TENANT_ID,
        organization_id: ORGANIZATION_ID,
        operator_id: OPERATOR_ID,
        operator_type: 1,
    }
}

async fn insert_admin_visible_skill_catalog(
    pool: &sqlx::SqlitePool,
    category_id: i64,
    package_id: i64,
    skill_id: i64,
    tenant_id: i64,
    organization_id: i64,
    name: &str,
    skill_key: &str,
) {
    let category_icon = external_image(&format!(
        "https://cdn.example.test/skills/{skill_key}/category-icon.png"
    ));
    let package_icon = external_image(&format!(
        "https://cdn.example.test/skills/{skill_key}/package-icon.png"
    ));
    let skill_icon = external_image(&format!(
        "https://cdn.example.test/skills/{skill_key}/icon.png"
    ));
    sqlx::query(
        r#"
        INSERT INTO plus_category
            (id, uuid, tenant_id, organization_id, data_scope, name, description, type, code,
             icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot,
             sort_weight, parent_id, path, visible, status, created_at, updated_at)
        VALUES
            (?, ?, ?, ?, 0, ?, ?, 19, ?, ?, NULL, ?, 10, NULL, ?, 1, 1, '2026-05-09 11:00:00', '2026-05-09 11:00:00')
        "#,
    )
    .bind(category_id)
    .bind(format!("admin-visible-skill-category-{category_id}"))
    .bind(tenant_id)
    .bind(organization_id)
    .bind(name)
    .bind(format!("{name} category"))
    .bind(format!("{skill_key}-category"))
    .bind(format!(
        "admin-visible-skill-category-icon-media-{category_id}"
    ))
    .bind(category_icon.to_string())
    .bind(format!("/skills/{skill_key}"))
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO plus_agent_skill_package
            (id, uuid, tenant_id, organization_id, data_scope, user_id, package_key, name, summary, description,
             icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot,
             cover_media_resource_id, cover_object_blob_id, cover_resource_snapshot,
             category_id, enabled, featured, sort_weight, tags, latest_published_at, created_at, updated_at)
        VALUES
            (?, ?, ?, ?, 0, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 20, ?, '2026-05-09 11:01:00', '2026-05-09 11:00:00', '2026-05-09 11:01:00')
        "#,
    )
    .bind(package_id)
    .bind(format!("admin-visible-skill-package-{package_id}"))
    .bind(tenant_id)
    .bind(organization_id)
    .bind(format!("{skill_key}-package"))
    .bind(format!("{name} Package"))
    .bind(format!("{name} package summary"))
    .bind(format!("{name} package description"))
    .bind(format!(
        "admin-visible-skill-package-icon-media-{package_id}"
    ))
    .bind(None::<i64>)
    .bind(package_icon.to_string())
    .bind(format!(
        "admin-visible-skill-package-cover-media-{package_id}"
    ))
    .bind(None::<i64>)
    .bind(
        json!({
            "kind": "image",
            "source": "external_url",
            "url": format!("https://cdn.example.test/skills/{skill_key}/package-cover.png"),
            "publicUrl": format!("https://cdn.example.test/skills/{skill_key}/package-cover.png")
        })
        .to_string(),
    )
    .bind(category_id)
    .bind(json!(["catalog", "skill"]).to_string())
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO plus_agent_skill
            (id, uuid, tenant_id, organization_id, data_scope, user_id, skill_key, name, summary,
             description, icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot,
             cover_media_resource_id, cover_object_blob_id, cover_resource_snapshot,
             category_id, package_id, provider, version,
             version_name, runtime, entrypoint, manifest_url, repository_url, homepage_url,
             documentation_url, license_name, source_type, market_status, visibility,
             review_status, review_comment, reviewed_by, reviewed_at, builtin, is_builtin,
             enabled, featured, recommend_weight, price, currency, install_count, rating_avg,
             rating_count, tags, capabilities, config_schema, default_config,
             latest_published_at, created_at, updated_at)
        VALUES
            (?, ?, ?, ?, 0, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SDKWork', '1.0.0',
             '1.0.0', 'builtin', 'skill.json', ?, NULL, NULL, NULL,
             'SDKWork Commercial', 'OFFICIAL', 'PUBLISHED', 'PUBLIC', 'APPROVED',
             NULL, NULL, NULL, 1, 1, 1, 1, 30, '0', 'CNY', 10, '5.0', 1,
             ?, ?, '{}', '{}', '2026-05-09 11:02:00', '2026-05-09 11:00:00',
             '2026-05-09 11:02:00')
        "#,
    )
    .bind(skill_id)
    .bind(format!("admin-visible-skill-{skill_id}"))
    .bind(tenant_id)
    .bind(organization_id)
    .bind(skill_key)
    .bind(name)
    .bind(format!("{name} summary"))
    .bind(format!("{name} description"))
    .bind(format!("admin-visible-skill-icon-media-{skill_id}"))
    .bind(None::<i64>)
    .bind(skill_icon.to_string())
    .bind(format!("admin-visible-skill-cover-media-{skill_id}"))
    .bind(None::<i64>)
    .bind(
        json!({
            "kind": "image",
            "source": "external_url",
            "url": format!("https://cdn.example.test/skills/{skill_key}/cover.png"),
            "publicUrl": format!("https://cdn.example.test/skills/{skill_key}/cover.png")
        })
        .to_string(),
    )
    .bind(category_id)
    .bind(package_id)
    .bind(format!(
        "https://cdn.example.test/skills/{skill_key}/manifest.json"
    ))
    .bind(json!(["catalog", "skill"]).to_string())
    .bind(json!(["catalog.skill"]).to_string())
    .execute(pool)
    .await
    .unwrap();
}

async fn insert_admin_visible_skill_asset(
    pool: &sqlx::SqlitePool,
    asset_id: i64,
    tenant_id: i64,
    organization_id: i64,
    skill_id: i64,
    name: &str,
) {
    sqlx::query(
        r#"
        INSERT INTO studio_catalog_asset
            (id, uuid, tenant_id, organization_id, data_scope, status, target_type, target_id, artifact_id, asset_type, asset_media_resource_id, asset_resource_snapshot, title, alt_text, mime_type, width, height, duration_seconds, file_size, sort_order, published_at, created_at, updated_at)
        VALUES
            (?, ?, ?, ?, 0, 1, 35, ?, NULL, 1, ?, ?, ?, ?, 'image/png', 1200, 720, NULL, 128000, 1, '2026-05-09 11:03:00', '2026-05-09 11:03:00', '2026-05-09 11:03:00')
        "#,
    )
    .bind(asset_id)
    .bind(format!("admin-visible-skill-asset-{asset_id}"))
    .bind(tenant_id)
    .bind(organization_id)
    .bind(skill_id)
    .bind(format!("admin-visible-skill-asset-media-{asset_id}"))
    .bind(
        json!({
            "kind": "image",
            "source": "external_url",
            "url": format!("https://cdn.example.test/skills/{name}/cover.png"),
            "publicUrl": format!("https://cdn.example.test/skills/{name}/cover.png")
        })
        .to_string(),
    )
    .bind(format!("{name} cover"))
    .bind(format!("{name} skill cover"))
    .execute(pool)
    .await
    .unwrap();
}

async fn insert_admin_visible_skill_artifact(
    pool: &sqlx::SqlitePool,
    artifact_id: i64,
    tenant_id: i64,
    organization_id: i64,
    skill_id: i64,
    name: &str,
) {
    sqlx::query(
        r#"
        INSERT INTO studio_catalog_artifact
            (id, uuid, tenant_id, organization_id, data_scope, status, target_type, target_id, artifact_type, version, platform_type, os_name, artifact_ref, artifact_media_resource_id, artifact_object_blob_id, artifact_resource_snapshot, artifact_size_bytes, runtime, frameworks, license_name, checksum_hash, release_notes, published_at, deprecated_at, created_at, updated_at)
        VALUES
            (?, ?, ?, ?, 0, 1, 35, ?, 1, '1.0.0', 'agent', 'runtime', ?, ?, ?, ?, 4096, 'builtin', ?, 'SDKWork Commercial', NULL, 'Initial release', '2026-05-09 11:04:00', NULL, '2026-05-09 11:04:00', '2026-05-09 11:04:00')
        "#,
    )
    .bind(artifact_id)
    .bind(format!("admin-visible-skill-artifact-{artifact_id}"))
    .bind(tenant_id)
    .bind(organization_id)
    .bind(skill_id)
    .bind(format!("builtin://sdkwork.skills.{name}@1.0.0"))
    .bind(format!("artifact:external_url:data/skills/{name}/artifact.json"))
    .bind(None::<i64>)
    .bind(
        json!({
            "kind": "document",
            "source": "external_url",
            "url": format!("data/skills/{name}/artifact.json"),
            "publicUrl": format!("data/skills/{name}/artifact.json")
        })
        .to_string(),
    )
    .bind(json!(["builtin"]).to_string())
    .execute(pool)
    .await
    .unwrap();
}
