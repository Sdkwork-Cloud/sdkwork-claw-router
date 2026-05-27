#[path = "common/installed_sqlite.rs"]
mod installed_sqlite_common;

use installed_sqlite_common::schema_sqlite_pool;
use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAdminAccessGroupStore;
use sdkwork_claw_product::ports::{
    AdminAccessGroupChannelBindingInput, AdminAccessGroupStore, AdminAccessGroupSubject,
    ListAdminAccessGroupChannelBindingsQuery, ReplaceAdminAccessGroupChannelBindingsCommand,
};

#[tokio::test]
async fn sqlite_admin_access_group_store_allows_one_channel_in_multiple_groups() {
    let pool = schema_sqlite_pool().await;
    seed_access_group_channel_fixture(&pool).await;
    let store = SqliteAdminAccessGroupStore::new(pool.clone());
    let subject = AdminAccessGroupSubject {
        tenant_id: 10,
        organization_id: 20,
        operator_id: 30,
        operator_type: 1,
    };

    let group_10_bindings = store
        .replace_channel_bindings(replace_bindings_command(
            subject,
            10,
            vec![
                binding_input(3001, 10, 80, "active"),
                binding_input(3003, 20, 30, "active"),
            ],
            "2026-05-25 10:00:00",
        ))
        .await
        .unwrap();
    assert_eq!(2, group_10_bindings.len());
    assert_eq!(3001, group_10_bindings[0].channel_id);
    assert_eq!("OpenAI primary", group_10_bindings[0].channel_name);

    let group_11_bindings = store
        .replace_channel_bindings(replace_bindings_command(
            subject,
            11,
            vec![binding_input(3001, 5, 50, "active")],
            "2026-05-25 10:01:00",
        ))
        .await
        .unwrap();
    assert_eq!(1, group_11_bindings.len());
    assert_eq!(3001, group_11_bindings[0].channel_id);

    let shared_channel_active_group_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM iam_api_key_group_channel
        WHERE tenant_id = 10
          AND organization_id = 20
          AND channel_id = 3001
          AND status = 1
          AND deleted_at IS NULL
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        2, shared_channel_active_group_count,
        "one channel account must be reusable by multiple groups"
    );

    let replaced_group_10_bindings = store
        .replace_channel_bindings(replace_bindings_command(
            subject,
            10,
            vec![binding_input(3001, 1, 100, "active")],
            "2026-05-25 10:02:00",
        ))
        .await
        .unwrap();
    assert_eq!(1, replaced_group_10_bindings.len());
    assert_eq!(1, replaced_group_10_bindings[0].priority);
    assert_eq!(100, replaced_group_10_bindings[0].weight);

    let group_11_after_replace = store
        .list_channel_bindings(ListAdminAccessGroupChannelBindingsQuery {
            subject,
            group_id: 11,
        })
        .await
        .unwrap();
    assert_eq!(1, group_11_after_replace.len());
    assert_eq!(
        3001, group_11_after_replace[0].channel_id,
        "replacing one group must not remove another group's channel usage"
    );
}

fn replace_bindings_command(
    subject: AdminAccessGroupSubject,
    group_id: i64,
    items: Vec<AdminAccessGroupChannelBindingInput>,
    requested_at: &str,
) -> ReplaceAdminAccessGroupChannelBindingsCommand {
    let suffix = requested_at
        .chars()
        .filter(|value| value.is_ascii_alphanumeric())
        .collect::<String>();
    ReplaceAdminAccessGroupChannelBindingsCommand {
        subject,
        group_id,
        binding_uuids: items
            .iter()
            .enumerate()
            .map(|(index, item)| format!("binding-{group_id}-{}-{index}", item.channel_id))
            .collect(),
        audit_log_uuid: format!("audit-group-channel-{group_id}-{suffix}"),
        config_snapshot_uuid: format!("snapshot-group-channel-{group_id}-{suffix}"),
        items,
        request_id: format!("req-group-channel-{group_id}-{suffix}"),
        requested_at: requested_at.to_owned(),
    }
}

fn binding_input(
    channel_id: i64,
    priority: i64,
    weight: i64,
    status: &str,
) -> AdminAccessGroupChannelBindingInput {
    AdminAccessGroupChannelBindingInput {
        channel_id,
        priority,
        weight,
        status: status.to_owned(),
        model_scope: vec!["openai/global/gpt-4o-mini".to_owned()],
        capabilities: vec!["llm".to_owned()],
    }
}

async fn seed_access_group_channel_fixture(pool: &sqlx::SqlitePool) {
    sqlx::query(
        r#"
        INSERT INTO iam_gateway_api_key_group
            (id, uuid, tenant_id, organization_id, status, name, code, provider_code, group_type)
        VALUES
            (10, 'group-standard', 10, 20, 1, 'Standard group', 'standard-group', 'openai', 1),
            (11, 'group-premium', 10, 20, 1, 'Premium group', 'premium-group', 'openai', 1)
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO integration_provider
            (id, uuid, tenant_id, organization_id, status, provider_code, display_name, base_url)
        VALUES
            (1001, 'provider-openai', 10, 20, 1, 'openai', 'OpenAI', 'https://api.openai.com/v1'),
            (1003, 'provider-google', 10, 20, 1, 'google', 'Google', 'https://generativelanguage.googleapis.com/v1')
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO integration_provider_account
            (id, uuid, tenant_id, organization_id, status, provider_id, provider_code, account_code, account_name, secret_ref, masked_label)
        VALUES
            (9001, 'account-openai-main', 10, 20, 1, 1001, 'openai', 'openai-main', 'OpenAI main', 'secret://provider-accounts/openai/main', 'sk-***main'),
            (9003, 'account-google-main', 10, 20, 1, 1003, 'google', 'google-main', 'Google main', 'secret://provider-accounts/google/main', 'sk-***main')
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO integration_channel
            (id, uuid, tenant_id, organization_id, status, provider_id, provider_code, channel_code, name, base_url, account_id, priority, weight, health_status)
        VALUES
            (3001, 'channel-openai-primary', 10, 20, 1, 1001, 'openai', 'openai-primary', 'OpenAI primary', 'https://api.openai.com/v1', 9001, 10, 80, 1),
            (3003, 'channel-google-fallback', 10, 20, 1, 1003, 'google', 'google-fallback', 'Google fallback', 'https://generativelanguage.googleapis.com/v1', 9003, 20, 30, 1)
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
}
