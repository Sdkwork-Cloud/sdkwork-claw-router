use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAdminChannelEndpointStore;
use sdkwork_claw_product::ports::{
    AdminChannelEndpointStore, AdminChannelEndpointSubject, CreateAdminChannelEndpointCommand,
    ListAdminChannelEndpointsQuery, UpdateAdminChannelEndpointCommand,
};
use sdkwork_claw_product_test_support::schema_sqlite_pool;
use sqlx::Row;

#[tokio::test]
async fn sqlite_admin_channel_endpoint_store_creates_updates_lists_and_audits_region_endpoint() {
    let pool = schema_sqlite_pool().await;
    seed_provider_account_scope(&pool).await;
    let store = SqliteAdminChannelEndpointStore::new(pool.clone());

    let created = store
        .create_channel_endpoint(CreateAdminChannelEndpointCommand {
            subject: subject(),
            endpoint_uuid: "endpoint-openrouter-openai-global-chat".to_owned(),
            audit_log_uuid: "audit-provider-account-endpoint-create".to_owned(),
            channel_id: 9002,
            vendor_code: "openai".to_owned(),
            region_code: "global".to_owned(),
            api_endpoint_code: "openai.chat_completions".to_owned(),
            base_url: "https://provider-proxy.internal/openrouter/openai".to_owned(),
            priority: 20,
            weight: 300,
            status: "active".to_owned(),
            effective_from: Some("2026-05-28 10:00:00".to_owned()),
            effective_to: Some("2026-06-28 10:00:00".to_owned()),
            request_id: "req-provider-account-endpoint-create".to_owned(),
            requested_at: "2026-05-28 10:00:00".to_owned(),
        })
        .await
        .unwrap()
        .expect("created endpoint should be returned");

    assert_eq!(9002, created.channel_id);
    assert_eq!("openrouter", created.provider_code);
    assert_eq!("openrouter-main", created.channel_code);
    assert_eq!("relay", created.channel_type);
    assert_eq!("openai", created.vendor_code);
    assert_eq!("global", created.region_code);
    assert_eq!("openai.chat_completions", created.api_endpoint_code);
    assert_eq!(
        "https://provider-proxy.internal/openrouter/openai",
        created.base_url
    );
    assert_eq!("healthy", created.health_status);
    assert_eq!("active", created.status);

    let stored = sqlx::query(
        r#"
        SELECT provider_code, channel_code, channel_type, vendor_id, api_endpoint_id
        FROM ai_channel_endpoint
        WHERE id = ?
        "#,
    )
    .bind(created.id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("openrouter", stored.get::<String, _>("provider_code"));
    assert_eq!("openrouter-main", stored.get::<String, _>("channel_code"));
    assert_eq!("relay", stored.get::<String, _>("channel_type"));
    assert_eq!(Some(9101), stored.get::<Option<i64>, _>("vendor_id"));
    assert_eq!(Some(9201), stored.get::<Option<i64>, _>("api_endpoint_id"));

    let listed = store
        .list_channel_endpoints(ListAdminChannelEndpointsQuery { subject: subject() })
        .await
        .unwrap();
    assert_eq!(1, listed.len());
    assert_eq!(created.id, listed[0].id);

    let updated = store
        .update_channel_endpoint(UpdateAdminChannelEndpointCommand {
            subject: subject(),
            endpoint_id: created.id,
            audit_log_uuid: "audit-provider-account-endpoint-update".to_owned(),
            vendor_code: None,
            region_code: Some("us-east-1".to_owned()),
            api_endpoint_code: None,
            base_url: Some("https://us-east.provider-proxy.internal/openrouter/openai".to_owned()),
            priority: Some(5),
            weight: Some(500),
            status: Some("disabled".to_owned()),
            effective_from: Some(None),
            effective_to: Some(None),
            request_id: "req-provider-account-endpoint-update".to_owned(),
            requested_at: "2026-05-28 10:01:00".to_owned(),
        })
        .await
        .unwrap()
        .expect("updated endpoint should be returned");

    assert_eq!("us-east-1", updated.region_code);
    assert_eq!(
        "https://us-east.provider-proxy.internal/openrouter/openai",
        updated.base_url
    );
    assert_eq!(5, updated.priority);
    assert_eq!(500, updated.weight);
    assert_eq!("disabled", updated.status);
    assert_eq!(None, updated.effective_from);
    assert_eq!(None, updated.effective_to);

    let audit_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ops_audit_log
        WHERE tenant_id = 10
          AND organization_id = 20
          AND request_id IN ('req-provider-account-endpoint-create', 'req-provider-account-endpoint-update')
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
    assert_eq!("ai_channel_endpoint", changed_object_type);
    assert_eq!(created.id, changed_object_id);

    let event_actions: Vec<String> = sqlx::query_scalar(
        r#"
        SELECT event_payload ->> 'action' AS event_action
        FROM ai_config_change_event
        WHERE tenant_id = 10
          AND organization_id = 20
          AND config_scope = 'routing'
          AND changed_object_type = 'ai_channel_endpoint'
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
            "create_channel_endpoint".to_owned(),
            "update_channel_endpoint".to_owned()
        ],
        event_actions
    );
}

#[tokio::test]
async fn sqlite_admin_channel_endpoint_store_returns_none_when_account_is_out_of_scope() {
    let pool = schema_sqlite_pool().await;
    seed_provider_account_scope(&pool).await;
    let store = SqliteAdminChannelEndpointStore::new(pool);

    let result = store
        .create_channel_endpoint(CreateAdminChannelEndpointCommand {
            subject: subject(),
            endpoint_uuid: "endpoint-out-of-scope".to_owned(),
            audit_log_uuid: "audit-out-of-scope".to_owned(),
            channel_id: 9902,
            vendor_code: "openai".to_owned(),
            region_code: "global".to_owned(),
            api_endpoint_code: "openai.chat_completions".to_owned(),
            base_url: "https://provider-proxy.internal/out-of-scope".to_owned(),
            priority: 100,
            weight: 100,
            status: "active".to_owned(),
            effective_from: None,
            effective_to: None,
            request_id: "req-out-of-scope".to_owned(),
            requested_at: "2026-05-28 10:00:00".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!(None, result);
}

#[tokio::test]
async fn sqlite_admin_channel_endpoint_store_resolves_system_vendor_and_api_endpoint_catalog() {
    let pool = schema_sqlite_pool().await;
    seed_channel_with_system_catalog_scope(&pool).await;
    let store = SqliteAdminChannelEndpointStore::new(pool.clone());

    let created = store
        .create_channel_endpoint(CreateAdminChannelEndpointCommand {
            subject: subject(),
            endpoint_uuid: "endpoint-system-catalog".to_owned(),
            audit_log_uuid: "audit-system-catalog".to_owned(),
            channel_id: 9003,
            vendor_code: "openai".to_owned(),
            region_code: "global".to_owned(),
            api_endpoint_code: "openai.chat_completions".to_owned(),
            base_url: "https://api.openai.com/v1".to_owned(),
            priority: 100,
            weight: 100,
            status: "disabled".to_owned(),
            effective_from: None,
            effective_to: None,
            request_id: "req-system-catalog".to_owned(),
            requested_at: "2026-05-28 10:04:00".to_owned(),
        })
        .await
        .unwrap()
        .expect("system catalog-backed endpoint should be created");

    let stored = sqlx::query(
        r#"
        SELECT vendor_id, api_endpoint_id
        FROM ai_channel_endpoint
        WHERE id = ?
        "#,
    )
    .bind(created.id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(Some(9100), stored.get::<Option<i64>, _>("vendor_id"));
    assert_eq!(Some(9200), stored.get::<Option<i64>, _>("api_endpoint_id"));
}

#[tokio::test]
async fn sqlite_admin_channel_endpoint_store_rejects_unresolved_vendor_or_api_endpoint() {
    let pool = schema_sqlite_pool().await;
    seed_provider_account_scope(&pool).await;
    let store = SqliteAdminChannelEndpointStore::new(pool.clone());

    let unknown_vendor = store
        .create_channel_endpoint(CreateAdminChannelEndpointCommand {
            subject: subject(),
            endpoint_uuid: "endpoint-unknown-vendor".to_owned(),
            audit_log_uuid: "audit-unknown-vendor".to_owned(),
            channel_id: 9002,
            vendor_code: "missing-vendor".to_owned(),
            region_code: "global".to_owned(),
            api_endpoint_code: "openai.chat_completions".to_owned(),
            base_url: "https://provider-proxy.internal/unknown-vendor".to_owned(),
            priority: 100,
            weight: 100,
            status: "active".to_owned(),
            effective_from: None,
            effective_to: None,
            request_id: "req-unknown-vendor".to_owned(),
            requested_at: "2026-05-28 10:02:00".to_owned(),
        })
        .await;
    assert!(
        unknown_vendor.is_err(),
        "endpoint vendor_code must resolve to ai_model_vendor before a relationship row is written"
    );

    let unknown_api = store
        .create_channel_endpoint(CreateAdminChannelEndpointCommand {
            subject: subject(),
            endpoint_uuid: "endpoint-unknown-api".to_owned(),
            audit_log_uuid: "audit-unknown-api".to_owned(),
            channel_id: 9002,
            vendor_code: "openai".to_owned(),
            region_code: "global".to_owned(),
            api_endpoint_code: "missing.api".to_owned(),
            base_url: "https://provider-proxy.internal/unknown-api".to_owned(),
            priority: 100,
            weight: 100,
            status: "active".to_owned(),
            effective_from: None,
            effective_to: None,
            request_id: "req-unknown-api".to_owned(),
            requested_at: "2026-05-28 10:03:00".to_owned(),
        })
        .await;
    assert!(
        unknown_api.is_err(),
        "endpoint api_endpoint_code must resolve to ai_api_endpoint before a relationship row is written"
    );

    let endpoint_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ai_channel_endpoint
        WHERE tenant_id = 10
          AND organization_id = 20
          AND uuid IN ('endpoint-unknown-vendor', 'endpoint-unknown-api')
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        0, endpoint_count,
        "failed relationship writes must rollback without orphan endpoint rows"
    );
}

fn subject() -> AdminChannelEndpointSubject {
    AdminChannelEndpointSubject {
        tenant_id: 10,
        organization_id: 20,
        operator_id: 30,
        operator_type: 1,
    }
}

async fn seed_provider_account_scope(pool: &sqlx::SqlitePool) {
    for statement in [
        "INSERT INTO ai_model_vendor (id, uuid, tenant_id, organization_id, vendor_code, display_name, status) VALUES (9101, 'test-vendor-openai', 10, 20, 'openai', 'OpenAI', 1)",
        "INSERT INTO ai_api_endpoint (id, uuid, tenant_id, organization_id, endpoint_code, protocol_code, display_name, path_template, status) VALUES (9201, 'test-endpoint-openai-chat-completions', 10, 20, 'openai.chat_completions', 'openai', 'OpenAI Chat Completions', '/v1/chat/completions', 1)",
        "INSERT INTO ai_channel (id, uuid, tenant_id, organization_id, provider_code, channel_code, channel_name, channel_type, credential_ref, status) VALUES (9002, 'test-channel-openrouter-main', 10, 20, 'openrouter', 'openrouter-main', 'OpenRouter main', 'relay', 'secret://providers/openrouter/main', 1)",
        "INSERT INTO ai_channel (id, uuid, tenant_id, organization_id, provider_code, channel_code, channel_name, channel_type, credential_ref, status) VALUES (9902, 'test-channel-openrouter-other-org', 10, 99, 'openrouter', 'openrouter-other', 'OpenRouter other org', 'relay', 'secret://providers/openrouter/other', 1)",
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_channel_with_system_catalog_scope(pool: &sqlx::SqlitePool) {
    for statement in [
        "INSERT INTO ai_model_vendor (id, uuid, tenant_id, organization_id, vendor_code, display_name, status) VALUES (9100, 'test-system-vendor-openai', 0, 0, 'openai', 'OpenAI', 1)",
        "INSERT INTO ai_api_endpoint (id, uuid, tenant_id, organization_id, endpoint_code, protocol_code, display_name, path_template, status) VALUES (9200, 'test-system-endpoint-openai-chat-completions', 0, 0, 'openai.chat_completions', 'openai', 'OpenAI Chat Completions', '/v1/chat/completions', 1)",
        "INSERT INTO ai_channel (id, uuid, tenant_id, organization_id, provider_code, channel_code, channel_name, channel_type, credential_ref, status) VALUES (9003, 'test-channel-openai-default', 10, 20, 'openai', 'openai-default', 'OpenAI default', 'official', 'secret://providers/openai/default', 0)",
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}
