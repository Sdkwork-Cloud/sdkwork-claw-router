use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAdminAiResourceStore;
use sdkwork_claw_product::ports::{
    AdminAiResourceMemberCommand, AdminAiResourceStore, AdminAiResourceSubject,
    CreateAdminAiResourceCommand, ListAdminAiResourcesQuery, UpdateAdminAiResourceCommand,
};
use sdkwork_claw_product_test_support::schema_sqlite_pool;
use sqlx::Row;

#[tokio::test]
async fn sqlite_admin_ai_resource_store_lists_resources_with_composition_members() {
    let pool = schema_sqlite_pool().await;
    seed_ai_resources(&pool).await;
    let store = SqliteAdminAiResourceStore::new(pool);

    let items = store
        .list_ai_resources(ListAdminAiResourcesQuery {
            subject: AdminAiResourceSubject {
                tenant_id: 10,
                organization_id: 20,
                operator_id: 30,
                operator_type: 1,
            },
        })
        .await
        .unwrap();

    let openai_vendor = items
        .iter()
        .find(|item| item.resource_code == "vendor.openai")
        .expect("OpenAI vendor resource should be installed");
    assert_eq!("vendor", openai_vendor.resource_type);
    assert_eq!(Some("openai"), openai_vendor.vendor_code.as_deref());

    let bundle = items
        .iter()
        .find(|item| item.resource_code == "bundle.openrouter.openai.standard")
        .expect("relay bundle resource should be installed");
    assert_eq!("bundle", bundle.resource_type);
    assert_eq!("all", bundle.composition_mode);
    assert_eq!(2, bundle.members.len());
    assert_eq!(
        "model.openai.gpt-4o-mini.chat",
        bundle.members[0].member_resource_code
    );
    assert_eq!(true, bundle.members[0].required);
}

#[tokio::test]
async fn sqlite_admin_ai_resource_store_creates_updates_and_audits_resource_graph() {
    let pool = schema_sqlite_pool().await;
    seed_ai_resources(&pool).await;
    let store = SqliteAdminAiResourceStore::new(pool.clone());

    let created = store
        .create_ai_resource(CreateAdminAiResourceCommand {
            subject: subject(),
            resource_uuid: "resource-openrouter-openai-extended".to_owned(),
            member_uuids: vec!["resource-member-openrouter-extended-chat".to_owned()],
            audit_log_uuid: "audit-ai-resource-create".to_owned(),
            resource_code: "bundle.openrouter.openai.extended".to_owned(),
            resource_type: "bundle".to_owned(),
            display_name: "OpenRouter OpenAI Extended".to_owned(),
            vendor_code: Some("openai".to_owned()),
            modality_code: None,
            api_endpoint_code: None,
            catalog_key: None,
            model: None,
            provider_native_model: None,
            composition_mode: "all".to_owned(),
            status: "active".to_owned(),
            sort_order: Some(10),
            members: vec![AdminAiResourceMemberCommand {
                member_resource_code: "model.openai.gpt-4o-mini.chat".to_owned(),
                member_role: "included".to_owned(),
                required: true,
                sort_order: Some(1),
            }],
            request_id: "req-ai-resource-create".to_owned(),
            requested_at: "2026-05-28 10:00:00".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("bundle.openrouter.openai.extended", created.resource_code);
    assert_eq!(1, created.members.len());
    assert_eq!(
        "model.openai.gpt-4o-mini.chat",
        created.members[0].member_resource_code
    );

    let updated = store
        .update_ai_resource(UpdateAdminAiResourceCommand {
            subject: subject(),
            resource_id: created.id,
            member_uuids: vec!["resource-member-openrouter-extended-embedding".to_owned()],
            audit_log_uuid: "audit-ai-resource-update".to_owned(),
            resource_code: Some("bundle.openrouter.openai.realtime".to_owned()),
            resource_type: None,
            display_name: Some("OpenRouter OpenAI Realtime".to_owned()),
            vendor_code: Some(None),
            modality_code: None,
            api_endpoint_code: None,
            catalog_key: None,
            model: None,
            provider_native_model: None,
            composition_mode: None,
            status: Some("disabled".to_owned()),
            sort_order: Some(None),
            members: Some(vec![AdminAiResourceMemberCommand {
                member_resource_code: "model.openai.text-embedding-3-small.embedding".to_owned(),
                member_role: "optional".to_owned(),
                required: false,
                sort_order: Some(2),
            }]),
            request_id: "req-ai-resource-update".to_owned(),
            requested_at: "2026-05-28 10:01:00".to_owned(),
        })
        .await
        .unwrap()
        .expect("updated resource should reload");

    assert_eq!("bundle.openrouter.openai.realtime", updated.resource_code);
    assert_eq!("OpenRouter OpenAI Realtime", updated.display_name);
    assert_eq!("disabled", updated.status);
    assert_eq!(None, updated.vendor_code);
    assert_eq!(None, updated.sort_order);
    assert_eq!(
        0,
        updated.members.len(),
        "disabled composite resources should not expose active members"
    );

    let row = sqlx::query(
        r#"
        SELECT vendor_code, sort_order
        FROM ai_resource
        WHERE id = ?
        "#,
    )
    .bind(created.id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(None::<String>, row.try_get("vendor_code").unwrap());
    assert_eq!(None::<i64>, row.try_get("sort_order").unwrap());

    let old_parent_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ai_resource_group_item
        WHERE tenant_id = 10
          AND organization_id = 20
          AND resource_group_code = 'bundle.openrouter.openai.extended'
          AND status = 1
          AND deleted_at IS NULL
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(0, old_parent_count);

    let (resource_group_status, new_parent_member_status): (i64, i64) = sqlx::query_as(
        r#"
        SELECT g.status, item.status
        FROM ai_resource_group g
        JOIN ai_resource_group_item item
          ON item.tenant_id = g.tenant_id
         AND item.organization_id = g.organization_id
         AND item.resource_group_id = g.id
         AND item.resource_group_code = g.group_code
         AND item.deleted_at IS NULL
        WHERE g.tenant_id = 10
          AND g.organization_id = 20
          AND g.group_code = 'bundle.openrouter.openai.realtime'
          AND g.deleted_at IS NULL
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(0, resource_group_status);
    assert_eq!(0, new_parent_member_status);

    let audit_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ops_audit_log
        WHERE tenant_id = 10
          AND organization_id = 20
          AND request_id IN ('req-ai-resource-create', 'req-ai-resource-update')
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(2, audit_count);

    let (config_version, changed_object_type, changed_object_id): (i64, String, i64) =
        sqlx::query_as(
            r#"
            SELECT config_version, changed_object_type, changed_object_id
            FROM ai_config_version
            WHERE tenant_id = 10
              AND organization_id = 20
              AND config_scope = 'routing'
            "#,
        )
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(2, config_version);
    assert_eq!("ai_resource", changed_object_type);
    assert_eq!(created.id, changed_object_id);

    let event_actions: Vec<String> = sqlx::query_scalar(
        r#"
        SELECT event_payload ->> 'action' AS event_action
        FROM ai_config_change_event
        WHERE tenant_id = 10
          AND organization_id = 20
          AND config_scope = 'routing'
          AND changed_object_type = 'ai_resource'
          AND changed_object_id = ?
        ORDER BY config_version ASC
        "#,
    )
    .bind(created.id)
    .fetch_all(&pool)
    .await
    .unwrap();
    assert_eq!(
        vec![
            "create_ai_resource".to_owned(),
            "update_ai_resource".to_owned()
        ],
        event_actions
    );
}

#[tokio::test]
async fn sqlite_admin_ai_resource_store_prefers_child_resource_group_members() {
    let pool = schema_sqlite_pool().await;
    seed_ai_resources(&pool).await;
    let store = SqliteAdminAiResourceStore::new(pool.clone());

    let created = store
        .create_ai_resource(CreateAdminAiResourceCommand {
            subject: subject(),
            resource_uuid: "resource-openrouter-openai-composite".to_owned(),
            member_uuids: vec!["resource-member-openrouter-standard-group".to_owned()],
            audit_log_uuid: "audit-ai-resource-create-group-member".to_owned(),
            resource_code: "bundle.openrouter.openai.composite".to_owned(),
            resource_type: "bundle".to_owned(),
            display_name: "OpenRouter OpenAI Composite".to_owned(),
            vendor_code: Some("openai".to_owned()),
            modality_code: None,
            api_endpoint_code: None,
            catalog_key: None,
            model: None,
            provider_native_model: None,
            composition_mode: "all".to_owned(),
            status: "active".to_owned(),
            sort_order: Some(11),
            members: vec![AdminAiResourceMemberCommand {
                member_resource_code: "bundle.openrouter.openai.standard".to_owned(),
                member_role: "included".to_owned(),
                required: false,
                sort_order: Some(1),
            }],
            request_id: "req-ai-resource-create-group-member".to_owned(),
            requested_at: "2026-05-28 10:02:00".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!(1, created.members.len());
    assert_eq!(
        "bundle.openrouter.openai.standard",
        created.members[0].member_resource_code
    );
    assert!(!created.members[0].required);

    let (item_type, resource_id, resource_code, child_resource_group_id, child_resource_group_code): (
        String,
        Option<i64>,
        Option<String>,
        Option<i64>,
        Option<String>,
    ) = sqlx::query_as(
        r#"
        SELECT item_type, resource_id, resource_code, child_resource_group_id, child_resource_group_code
        FROM ai_resource_group_item
        WHERE tenant_id = 10
          AND organization_id = 20
          AND resource_group_code = 'bundle.openrouter.openai.composite'
          AND status = 1
          AND deleted_at IS NULL
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();

    assert_eq!("resource_group", item_type);
    assert_eq!(None, resource_id);
    assert_eq!(Some(String::new()), resource_code);
    assert_eq!(Some(9204), child_resource_group_id);
    assert_eq!(
        Some("bundle.openrouter.openai.standard".to_owned()),
        child_resource_group_code
    );

    let items = store
        .list_ai_resources(ListAdminAiResourcesQuery { subject: subject() })
        .await
        .unwrap();
    let reloaded = items
        .iter()
        .find(|item| item.id == created.id)
        .expect("created AI resource should be listed");
    assert_eq!(1, reloaded.members.len());
    assert_eq!(
        "bundle.openrouter.openai.standard",
        reloaded.members[0].member_resource_code
    );
}

#[tokio::test]
async fn sqlite_admin_ai_resource_store_rejects_unknown_member_resource_code() {
    let pool = schema_sqlite_pool().await;
    seed_ai_resources(&pool).await;
    let store = SqliteAdminAiResourceStore::new(pool.clone());

    let error = store
        .create_ai_resource(CreateAdminAiResourceCommand {
            subject: subject(),
            resource_uuid: "resource-openrouter-openai-invalid".to_owned(),
            member_uuids: vec!["resource-member-openrouter-missing".to_owned()],
            audit_log_uuid: "audit-ai-resource-create-missing-member".to_owned(),
            resource_code: "bundle.openrouter.openai.invalid".to_owned(),
            resource_type: "bundle".to_owned(),
            display_name: "OpenRouter OpenAI Invalid".to_owned(),
            vendor_code: Some("openai".to_owned()),
            modality_code: None,
            api_endpoint_code: None,
            catalog_key: None,
            model: None,
            provider_native_model: None,
            composition_mode: "all".to_owned(),
            status: "active".to_owned(),
            sort_order: Some(12),
            members: vec![AdminAiResourceMemberCommand {
                member_resource_code: "model.openai.missing.chat".to_owned(),
                member_role: "included".to_owned(),
                required: true,
                sort_order: Some(1),
            }],
            request_id: "req-ai-resource-create-missing-member".to_owned(),
            requested_at: "2026-05-28 10:03:00".to_owned(),
        })
        .await
        .unwrap_err();

    assert!(
        error.is_not_found(),
        "missing member resource should be a not-found error: {error}"
    );
    assert!(error.to_string().contains("model.openai.missing.chat"));

    let created_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ai_resource
        WHERE tenant_id = 10
          AND organization_id = 20
          AND resource_code = 'bundle.openrouter.openai.invalid'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(0, created_count);
}

#[tokio::test]
async fn sqlite_admin_ai_resource_store_syncs_group_members_when_composite_resource_status_changes()
{
    let pool = schema_sqlite_pool().await;
    seed_ai_resources(&pool).await;
    let store = SqliteAdminAiResourceStore::new(pool.clone());

    let disabled = store
        .update_ai_resource(UpdateAdminAiResourceCommand {
            subject: subject(),
            resource_id: 9104,
            member_uuids: Vec::new(),
            audit_log_uuid: "audit-disable-composite-resource".to_owned(),
            resource_code: None,
            resource_type: None,
            display_name: None,
            vendor_code: None,
            modality_code: None,
            api_endpoint_code: None,
            catalog_key: None,
            model: None,
            provider_native_model: None,
            composition_mode: None,
            status: Some("disabled".to_owned()),
            sort_order: None,
            members: None,
            request_id: "req-disable-composite-resource".to_owned(),
            requested_at: "2026-05-28 10:04:00".to_owned(),
        })
        .await
        .unwrap()
        .expect("resource should update");
    assert_eq!("disabled", disabled.status);

    let (group_status, active_member_count): (i64, i64) = sqlx::query_as(
        r#"
        SELECT
            COALESCE(g.status, -999) AS group_status,
            (
                SELECT COUNT(1)
                FROM ai_resource_group_item item
                WHERE item.tenant_id = g.tenant_id
                  AND item.organization_id = g.organization_id
                  AND item.resource_group_id = g.id
                  AND item.status = 1
                  AND item.deleted_at IS NULL
            ) AS active_member_count
        FROM ai_resource_group g
        WHERE g.tenant_id = 10
          AND g.organization_id = 20
          AND g.group_code = 'bundle.openrouter.openai.standard'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(0, group_status);
    assert_eq!(
        0, active_member_count,
        "disabling a composite resource must disable its group members so recursive route expansion cannot still use them"
    );

    let enabled = store
        .update_ai_resource(UpdateAdminAiResourceCommand {
            subject: subject(),
            resource_id: 9104,
            member_uuids: Vec::new(),
            audit_log_uuid: "audit-enable-composite-resource".to_owned(),
            resource_code: None,
            resource_type: None,
            display_name: None,
            vendor_code: None,
            modality_code: None,
            api_endpoint_code: None,
            catalog_key: None,
            model: None,
            provider_native_model: None,
            composition_mode: None,
            status: Some("active".to_owned()),
            sort_order: None,
            members: None,
            request_id: "req-enable-composite-resource".to_owned(),
            requested_at: "2026-05-28 10:05:00".to_owned(),
        })
        .await
        .unwrap()
        .expect("resource should update");
    assert_eq!("active", enabled.status);

    let active_member_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ai_resource_group_item
        WHERE tenant_id = 10
          AND organization_id = 20
          AND resource_group_id = 9204
          AND status = 1
          AND deleted_at IS NULL
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        2, active_member_count,
        "re-enabling a composite resource should restore existing non-deleted member rows"
    );
}

fn subject() -> AdminAiResourceSubject {
    AdminAiResourceSubject {
        tenant_id: 10,
        organization_id: 20,
        operator_id: 30,
        operator_type: 1,
    }
}

async fn seed_ai_resources(pool: &sqlx::SqlitePool) {
    for statement in [
        "INSERT INTO ai_resource (id, uuid, tenant_id, organization_id, resource_code, resource_type, display_name, vendor_code, resource_schema, status, sort_order) VALUES (9101, 'test-resource-openai-vendor', 10, 20, 'vendor.openai', 'vendor', 'OpenAI', 'openai', '{\"compositionMode\":\"single\"}', 1, 1)",
        "INSERT INTO ai_resource (id, uuid, tenant_id, organization_id, resource_code, resource_type, display_name, vendor_code, modality_code, api_code, catalog_key, model, provider_native_model, resource_schema, status, sort_order) VALUES (9102, 'test-resource-openai-gpt-4o-mini-chat', 10, 20, 'model.openai.gpt-4o-mini.chat', 'model_api', 'GPT-4o mini Chat', 'openai', 'chat', 'openai.chat_completions', 'openai/gpt-4o-mini', 'gpt-4o-mini', 'gpt-4o-mini', '{\"compositionMode\":\"single\"}', 1, 2)",
        "INSERT INTO ai_resource (id, uuid, tenant_id, organization_id, resource_code, resource_type, display_name, vendor_code, modality_code, api_code, catalog_key, model, provider_native_model, resource_schema, status, sort_order) VALUES (9103, 'test-resource-openai-embedding-small', 10, 20, 'model.openai.text-embedding-3-small.embedding', 'model_api', 'Text Embedding 3 Small', 'openai', 'embedding', 'openai.embeddings', 'openai/text-embedding-3-small', 'text-embedding-3-small', 'text-embedding-3-small', '{\"compositionMode\":\"single\"}', 1, 3)",
        "INSERT INTO ai_resource (id, uuid, tenant_id, organization_id, resource_code, resource_type, display_name, vendor_code, resource_schema, status, sort_order) VALUES (9104, 'test-resource-openrouter-openai-standard', 10, 20, 'bundle.openrouter.openai.standard', 'bundle', 'OpenRouter OpenAI Standard', 'openai', '{\"compositionMode\":\"all\"}', 1, 4)",
        "INSERT INTO ai_resource_group (id, uuid, tenant_id, organization_id, group_code, group_name, group_type, selection_mode, status, sort_order) VALUES (9204, 'test-resource-group-openrouter-openai-standard', 10, 20, 'bundle.openrouter.openai.standard', 'OpenRouter OpenAI Standard', 'bundle', 'all', 1, 4)",
        "INSERT INTO ai_resource_group_item (id, uuid, tenant_id, organization_id, resource_group_id, resource_group_code, item_type, resource_id, resource_code, child_resource_group_code, item_role, metadata, status, sort_order) VALUES (9101, 'test-resource-member-openrouter-gpt-4o-mini', 10, 20, 9204, 'bundle.openrouter.openai.standard', 'resource', 9102, 'model.openai.gpt-4o-mini.chat', '', 'included', '{\"required\":true}', 1, 1)",
        "INSERT INTO ai_resource_group_item (id, uuid, tenant_id, organization_id, resource_group_id, resource_group_code, item_type, resource_id, resource_code, child_resource_group_code, item_role, metadata, status, sort_order) VALUES (9102, 'test-resource-member-openrouter-embedding-small', 10, 20, 9204, 'bundle.openrouter.openai.standard', 'resource', 9103, 'model.openai.text-embedding-3-small.embedding', '', 'included', '{\"required\":true}', 1, 2)",
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}
