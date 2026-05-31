use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAppRoutingChannelCommandStore;
use sdkwork_claw_product::ports::{
    AppRoutingChannelCommandStore, AppRoutingSubject, DeleteAppRoutingChannelCommand,
};
use sdkwork_claw_product_test_support::schema_sqlite_pool;

#[tokio::test]
async fn sqlite_app_routing_channel_command_store_delete_cascades_channel_relationships() {
    let pool = schema_sqlite_pool().await;
    seed_app_routing_channel_with_relationships(&pool).await;
    let store = SqliteAppRoutingChannelCommandStore::new(pool.clone());

    let outcome = store
        .delete_channel(DeleteAppRoutingChannelCommand {
            subject: AppRoutingSubject {
                tenant_id: 10,
                organization_id: 20,
                user_id: 30,
            },
            channel_id: 41001,
            audit_log_uuid: "audit-app-routing-delete-channel".to_owned(),
            config_snapshot_uuid: "snapshot-app-routing-delete-channel".to_owned(),
            request_id: "req-app-routing-delete-channel".to_owned(),
            requested_at: "2026-05-29 10:00:00".to_owned(),
        })
        .await
        .unwrap();

    assert!(outcome.deleted);

    let active_relation_count: i64 = sqlx::query_scalar(
        r#"
        SELECT (
            SELECT COUNT(1)
            FROM ai_channel_model
            WHERE tenant_id = 10
              AND organization_id = 20
              AND channel_id = 41001
              AND deleted_at IS NULL
        ) + (
            SELECT COUNT(1)
            FROM ai_channel_resource
            WHERE tenant_id = 10
              AND organization_id = 20
              AND channel_id = 41001
              AND deleted_at IS NULL
        ) + (
            SELECT COUNT(1)
            FROM ai_channel_vendor
            WHERE tenant_id = 10
              AND organization_id = 20
              AND channel_id = 41001
              AND deleted_at IS NULL
        ) + (
            SELECT COUNT(1)
            FROM ai_channel_endpoint
            WHERE tenant_id = 10
              AND organization_id = 20
              AND channel_id = 41001
              AND deleted_at IS NULL
        )
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        0, active_relation_count,
        "deleting a routing channel must soft-delete every channel-owned relationship row"
    );
}

async fn seed_app_routing_channel_with_relationships(pool: &sqlx::SqlitePool) {
    for statement in [
        r#"
        INSERT INTO ai_channel
            (id, uuid, tenant_id, organization_id, status, provider_code, channel_code, channel_name, channel_type, base_url, credential_ref, masked_label)
        VALUES
            (41001, 'app-routing-channel-delete-cascade', 10, 20, 1, 'openai', 'app-routing-openai', 'App Routing OpenAI', 'official', 'https://api.openai.com/v1', 'secret://app-routing/openai', 'sk-***openai')
        "#,
        r#"
        INSERT INTO ai_channel_model
            (id, uuid, tenant_id, organization_id, status, channel_id, catalog_key, model, vendor_code, provider_model, provider_native_model, api_code, capability)
        VALUES
            (41011, 'app-routing-channel-model-delete-cascade', 10, 20, 1, 41001, 'openai/gpt-4o-mini', 'gpt-4o-mini', 'openai', 'gpt-4o-mini', 'gpt-4o-mini', 'openai.chat_completions', 1)
        "#,
        r#"
        INSERT INTO ai_channel_resource
            (id, uuid, tenant_id, organization_id, status, channel_id, provider_code, channel_code, resource_code, grant_type)
        VALUES
            (41021, 'app-routing-channel-resource-delete-cascade', 10, 20, 1, 41001, 'openai', 'app-routing-openai', 'model.openai.gpt-4o-mini.chat', 'allow')
        "#,
        r#"
        INSERT INTO ai_channel_vendor
            (id, uuid, tenant_id, organization_id, status, channel_id, provider_code, channel_code, vendor_code, supported)
        VALUES
            (41031, 'app-routing-channel-vendor-delete-cascade', 10, 20, 1, 41001, 'openai', 'app-routing-openai', 'openai', 1)
        "#,
        r#"
        INSERT INTO ai_channel_endpoint
            (id, uuid, tenant_id, organization_id, status, channel_id, provider_code, channel_code, channel_type, vendor_code, region_code, api_code, base_url)
        VALUES
            (41041, 'app-routing-channel-endpoint-delete-cascade', 10, 20, 1, 41001, 'openai', 'app-routing-openai', 'official', 'openai', 'global', 'openai.chat_completions', 'https://api.openai.com/v1')
        "#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}
