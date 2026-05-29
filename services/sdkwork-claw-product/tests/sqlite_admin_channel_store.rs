#[path = "common/installed_sqlite.rs"]
mod installed_sqlite_common;

use std::sync::Arc;

use installed_sqlite_common::schema_sqlite_pool;
use sdkwork_claw_product::application::ApiKeySecretCodec;
use sdkwork_claw_product::infrastructure::crypto::RingAeadApiKeySecretCodec;
use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAdminChannelStore;
use sdkwork_claw_product::ports::{
    AdminChannelStore, AdminChannelSubject, CreateAdminChannelCommand, ListAdminChannelsQuery,
    UpdateAdminChannelCommand,
};
use serde_json::Value;

#[tokio::test]
async fn sqlite_admin_channel_store_encrypts_channel_api_key_material() {
    let pool = schema_sqlite_pool().await;
    let codec = Arc::new(RingAeadApiKeySecretCodec::new("test-pepper").unwrap());
    let store = SqliteAdminChannelStore::with_api_key_secret_codec(pool.clone(), codec.clone());

    let item = store
        .create_channel(CreateAdminChannelCommand {
            subject: AdminChannelSubject {
                tenant_id: 10,
                organization_id: 20,
                operator_id: 30,
                operator_type: 1,
            },
            channel_uuid: "channel-api-key-credential".to_owned(),
            model_uuids: vec!["channel-model-api-key-credential".to_owned()],
            audit_log_uuid: "audit-api-key-credential".to_owned(),
            config_snapshot_uuid: "snapshot-api-key-credential".to_owned(),
            name: "OpenAI primary".to_owned(),
            vendor: "OpenAI".to_owned(),
            provider_code: "openai".to_owned(),
            channel_type: "official".to_owned(),
            protocol: "OpenAI".to_owned(),
            access_type: "Standard API Key".to_owned(),
            base_url: Some("https://api.openai.com/v1".to_owned()),
            secret_ref: "secret://ai-channels/openai/testhash".to_owned(),
            secret_hash: "test-secret-hash".to_owned(),
            masked_label: "sk-l***cret".to_owned(),
            credential_material: Some("sk-live-provider-secret".to_owned()),
            models: vec!["openai/gpt-4o-mini".to_owned()],
            capabilities: vec!["llm".to_owned()],
            resource_codes: vec![
                "vendor.openai".to_owned(),
                "model.openai.gpt-4o-mini.chat".to_owned(),
            ],
            is_multimodal: false,
            timeout_ms: None,
            retry_policy_json: None,
            circuit_breaker_policy_json: None,
            expires_at: Some("2026-06-30T08:00:00Z".to_owned()),
            weight: 100,
            status: "active".to_owned(),
            request_id: "req-api-key-credential".to_owned(),
            requested_at: "2026-05-18 12:00:00".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!(
        Some("secret://ai-channels/openai/testhash"),
        item.secret_ref.as_deref()
    );
    assert_eq!("2026-05-18 12:00:00", item.created_at);
    assert_eq!(Some("2026-06-30T08:00:00Z"), item.expires_at.as_deref());
    let channel_metadata_json: String =
        sqlx::query_scalar("SELECT CAST(metadata AS TEXT) FROM ai_channel WHERE id = ?")
            .bind(item.id)
            .fetch_one(&pool)
            .await
            .unwrap();
    let channel_metadata: Value = serde_json::from_str(&channel_metadata_json).unwrap();
    assert_eq!(
        Some("2026-06-30T08:00:00Z"),
        channel_metadata.get("expiresAt").and_then(Value::as_str)
    );
    let auth_config_json: String = sqlx::query_scalar(
        "SELECT CAST(auth_config AS TEXT) FROM ai_channel WHERE credential_ref = ?",
    )
    .bind("secret://ai-channels/openai/testhash")
    .fetch_one(&pool)
    .await
    .unwrap();
    assert!(!auth_config_json.contains("sk-live-provider-secret"));
    let auth_config: Value = serde_json::from_str(&auth_config_json).unwrap();
    assert_eq!(
        Some("channelCredentialInput"),
        auth_config.get("credentialSource").and_then(Value::as_str)
    );
    assert_eq!(
        Some("encrypted-channel-auth-config"),
        auth_config
            .get("secretMaterialStorage")
            .and_then(Value::as_str)
    );
    let ciphertext = auth_config
        .get("secretMaterialCiphertext")
        .and_then(Value::as_str)
        .expect("channel auth_config should contain encrypted key material");
    assert_ne!("sk-live-provider-secret", ciphertext);
    assert_eq!(
        "sk-live-provider-secret",
        codec.decode_secret(ciphertext).unwrap()
    );

    let listed = store
        .list_channels(ListAdminChannelsQuery {
            subject: AdminChannelSubject {
                tenant_id: 10,
                organization_id: 20,
                operator_id: 30,
                operator_type: 1,
            },
        })
        .await
        .unwrap();
    assert_eq!(
        Some("sk-live-provider-secret"),
        listed.first().and_then(|item| item.api_key.as_deref())
    );
    assert_eq!(
        Some("2026-06-30T08:00:00Z"),
        listed.first().and_then(|item| item.expires_at.as_deref())
    );
    assert_eq!(
        Some("official"),
        listed.first().map(|item| item.channel_type.as_str())
    );
    let channel_id: i64 = sqlx::query_scalar("SELECT id FROM ai_channel WHERE id = ?")
        .bind(item.id)
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(channel_id, item.channel_id);
    assert_eq!(Some(channel_id), listed.first().map(|item| item.channel_id));
    assert_eq!(
        vec![
            "vendor.openai".to_owned(),
            "model.openai.gpt-4o-mini.chat".to_owned(),
            "modality.llm".to_owned(),
        ],
        listed
            .first()
            .map(|item| item.resource_codes.clone())
            .unwrap_or_default()
    );
    let channel_type: String =
        sqlx::query_scalar("SELECT channel_type FROM ai_channel WHERE credential_ref = ?")
            .bind("secret://ai-channels/openai/testhash")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!("official", channel_type);
    let channel_resource_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM ai_channel_resource WHERE channel_id = ? AND status = 1 AND grant_type = 'allow' AND deleted_at IS NULL",
    )
    .bind(item.id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(3, channel_resource_count);
}

#[tokio::test]
async fn sqlite_admin_channel_store_updates_modality_resources_without_clearing_vendor_resources() {
    let pool = schema_sqlite_pool().await;
    let codec = Arc::new(RingAeadApiKeySecretCodec::new("test-pepper").unwrap());
    let store = SqliteAdminChannelStore::with_api_key_secret_codec(pool.clone(), codec);

    let created = store
        .create_channel(CreateAdminChannelCommand {
            subject: AdminChannelSubject {
                tenant_id: 10,
                organization_id: 20,
                operator_id: 30,
                operator_type: 1,
            },
            channel_uuid: "channel-modality-resource-update".to_owned(),
            model_uuids: vec!["channel-model-modality-resource-update".to_owned()],
            audit_log_uuid: "audit-modality-resource-update-create".to_owned(),
            config_snapshot_uuid: "snapshot-modality-resource-update-create".to_owned(),
            name: "OpenAI modality resource".to_owned(),
            vendor: "OpenAI".to_owned(),
            provider_code: "openai".to_owned(),
            channel_type: "official".to_owned(),
            protocol: "OpenAI".to_owned(),
            access_type: "Standard API Key".to_owned(),
            base_url: Some("https://api.openai.com/v1".to_owned()),
            secret_ref: "secret://ai-channels/openai/modality-resource".to_owned(),
            secret_hash: "modality-resource-secret-hash".to_owned(),
            masked_label: "sk-m***ource".to_owned(),
            credential_material: Some("sk-live-modality-resource".to_owned()),
            models: vec!["openai/gpt-4o-mini".to_owned()],
            capabilities: vec!["llm".to_owned()],
            resource_codes: vec![
                "vendor.openai".to_owned(),
                "api.openai.chat_completions".to_owned(),
            ],
            is_multimodal: false,
            timeout_ms: None,
            retry_policy_json: None,
            circuit_breaker_policy_json: None,
            expires_at: None,
            weight: 100,
            status: "active".to_owned(),
            request_id: "req-modality-resource-update-create".to_owned(),
            requested_at: "2026-05-18 12:00:00".to_owned(),
        })
        .await
        .unwrap();

    let updated = store
        .update_channel(UpdateAdminChannelCommand {
            subject: AdminChannelSubject {
                tenant_id: 10,
                organization_id: 20,
                operator_id: 30,
                operator_type: 1,
            },
            channel_id: created.id,
            model_uuids: Vec::new(),
            audit_log_uuid: "audit-modality-resource-update".to_owned(),
            config_snapshot_uuid: "snapshot-modality-resource-update".to_owned(),
            name: None,
            vendor: None,
            provider_code: None,
            channel_type: None,
            protocol: None,
            access_type: None,
            base_url: None,
            secret_ref: None,
            secret_hash: None,
            masked_label: None,
            credential_material: None,
            models: None,
            capabilities: Some(vec!["llm".to_owned(), "image".to_owned()]),
            resource_codes: None,
            timeout_ms: None,
            retry_policy_json: None,
            circuit_breaker_policy_json: None,
            expires_at: None,
            weight: None,
            status: Some("disabled".to_owned()),
            request_id: "req-modality-resource-update".to_owned(),
            requested_at: "2026-05-18 12:05:00".to_owned(),
        })
        .await
        .unwrap()
        .expect("channel should update");

    assert_eq!(vec!["llm".to_owned(), "image".to_owned()], updated.capabilities);
    assert_eq!(
        vec![
            "vendor.openai".to_owned(),
            "api.openai.chat_completions".to_owned(),
            "modality.llm".to_owned(),
            "modality.image".to_owned(),
        ],
        updated.resource_codes
    );
}

#[tokio::test]
async fn sqlite_admin_channel_store_allows_duplicate_secret_hash_for_distinct_channels() {
    let pool = schema_sqlite_pool().await;
    let codec = Arc::new(RingAeadApiKeySecretCodec::new("test-pepper").unwrap());
    let store = SqliteAdminChannelStore::with_api_key_secret_codec(pool.clone(), codec);

    let first = store
        .create_channel(duplicate_secret_channel_command(
            "primary",
            "2026-05-18 12:00:00",
        ))
        .await
        .unwrap();
    let second = store
        .create_channel(duplicate_secret_channel_command(
            "backup",
            "2026-05-18 12:01:00",
        ))
        .await
        .unwrap();

    assert_ne!(first.id, second.id);
    assert_eq!("OpenAI primary", first.name);
    assert_eq!("OpenAI backup", second.name);

    let channel_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ai_channel
        WHERE tenant_id = 10
          AND organization_id = 20
          AND provider_code = 'openai'
          AND credential_hash = 'duplicate-secret-hash'
          AND deleted_at IS NULL
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        2, channel_count,
        "duplicate credentials must be allowed for distinct AI channels"
    );
}

fn duplicate_secret_channel_command(suffix: &str, requested_at: &str) -> CreateAdminChannelCommand {
    CreateAdminChannelCommand {
        subject: AdminChannelSubject {
            tenant_id: 10,
            organization_id: 20,
            operator_id: 30,
            operator_type: 1,
        },
        channel_uuid: format!("{suffix}-channel-duplicate-secret"),
        model_uuids: vec![format!("channel-model-duplicate-secret-{suffix}")],
        audit_log_uuid: format!("audit-duplicate-secret-{suffix}"),
        config_snapshot_uuid: format!("snapshot-duplicate-secret-{suffix}"),
        name: format!("OpenAI {suffix}"),
        vendor: "OpenAI".to_owned(),
        provider_code: "openai".to_owned(),
        channel_type: "official".to_owned(),
        protocol: "OpenAI".to_owned(),
        access_type: "Standard API Key".to_owned(),
        base_url: Some("https://api.openai.com/v1".to_owned()),
        secret_ref: format!("secret://ai-channels/openai/duplicate/{suffix}"),
        secret_hash: "duplicate-secret-hash".to_owned(),
        masked_label: "sk-l***same".to_owned(),
        credential_material: Some("sk-live-duplicate-provider-secret".to_owned()),
        models: vec!["openai/gpt-4o-mini".to_owned()],
        capabilities: vec!["llm".to_owned()],
        resource_codes: Vec::new(),
        is_multimodal: false,
        timeout_ms: None,
        retry_policy_json: None,
        circuit_breaker_policy_json: None,
        expires_at: None,
        weight: 100,
        status: "active".to_owned(),
        request_id: format!("req-duplicate-secret-{suffix}"),
        requested_at: requested_at.to_owned(),
    }
}
