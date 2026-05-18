use std::sync::Arc;

use sdkwork_claw_product::application::ApiKeySecretCodec;
use sdkwork_claw_product::infrastructure::crypto::RingAeadApiKeySecretCodec;
use sdkwork_claw_product::infrastructure::sql::installer::{
    DatabaseInstallOptions, DatabaseInstaller,
};
use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAdminChannelStore;
use sdkwork_claw_product::ports::{
    AdminChannelStore, AdminChannelSubject, CreateAdminChannelCommand,
};
use serde_json::Value;
use sqlx::sqlite::SqlitePoolOptions;

#[tokio::test]
async fn sqlite_admin_channel_store_encrypts_provider_account_api_key_material() {
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
            channel_uuid: "channel-api-key-account".to_owned(),
            account_uuid: "account-api-key-account".to_owned(),
            model_uuids: vec!["channel-model-api-key-account".to_owned()],
            audit_log_uuid: "audit-api-key-account".to_owned(),
            config_snapshot_uuid: "snapshot-api-key-account".to_owned(),
            name: "OpenAI primary".to_owned(),
            vendor: "OpenAI".to_owned(),
            provider_code: "openai".to_owned(),
            protocol: "OpenAI".to_owned(),
            access_type: "Standard API Key".to_owned(),
            base_url: Some("https://api.openai.com/v1".to_owned()),
            secret_ref: "secret://provider-accounts/openai/testhash".to_owned(),
            secret_hash: "test-secret-hash".to_owned(),
            masked_label: "sk-l***cret".to_owned(),
            credential_material: Some("sk-live-provider-secret".to_owned()),
            models: vec!["openai/global/gpt-4o-mini".to_owned()],
            capabilities: vec!["llm".to_owned()],
            is_multimodal: false,
            timeout_ms: None,
            retry_policy_json: None,
            circuit_breaker_policy_json: None,
            weight: 100,
            status: "active".to_owned(),
            request_id: "req-api-key-account".to_owned(),
            requested_at: "2026-05-18 12:00:00".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!(
        Some("secret://provider-accounts/openai/testhash"),
        item.secret_ref.as_deref()
    );
    let auth_config_json: String = sqlx::query_scalar(
        "SELECT CAST(auth_config AS TEXT) FROM integration_provider_account WHERE secret_ref = ?",
    )
    .bind("secret://provider-accounts/openai/testhash")
    .fetch_one(&pool)
    .await
    .unwrap();
    assert!(!auth_config_json.contains("sk-live-provider-secret"));
    let auth_config: Value = serde_json::from_str(&auth_config_json).unwrap();
    assert_eq!(
        Some("providerAccountInput"),
        auth_config.get("credentialSource").and_then(Value::as_str)
    );
    assert_eq!(
        Some("encrypted-provider-account-auth-config"),
        auth_config
            .get("secretMaterialStorage")
            .and_then(Value::as_str)
    );
    let ciphertext = auth_config
        .get("secretMaterialCiphertext")
        .and_then(Value::as_str)
        .expect("provider account auth_config should contain encrypted key material");
    assert_ne!("sk-live-provider-secret", ciphertext);
    assert_eq!(
        "sk-live-provider-secret",
        codec.decode_secret(ciphertext).unwrap()
    );
}
