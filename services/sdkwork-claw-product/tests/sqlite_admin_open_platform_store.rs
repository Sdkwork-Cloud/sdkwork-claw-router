use std::sync::Arc;

use sdkwork_claw_product::application::ApiKeySecretCodec;
use sdkwork_claw_product::infrastructure::crypto::RingAeadApiKeySecretCodec;
use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAdminOpenPlatformStore;
use sdkwork_claw_product::ports::{
    AdminOpenPlatformStore, AdminOpenPlatformSubject, CreateAdminOpenPlatformAccountCommand,
    CreateAdminOpenPlatformEntryCommand, CreateAdminOpenPlatformPayBindingCommand,
    DeleteAdminOpenPlatformAccountCommand, DeleteAdminOpenPlatformEntryCommand,
    DeleteAdminOpenPlatformPayBindingCommand, ListAdminOpenPlatformAccountsQuery,
    ListAdminOpenPlatformEntriesQuery, ListAdminOpenPlatformManifestsQuery,
    ListAdminOpenPlatformPayBindingsQuery, ListAdminOpenPlatformProvidersQuery,
    UpdateAdminOpenPlatformAccountCommand,
};
use sqlx::sqlite::SqlitePoolOptions;

#[tokio::test]
async fn sqlite_admin_open_platform_store_manages_accounts_entries_pay_bindings_and_audit() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_schema(&pool).await;
    seed_dictionary(&pool).await;

    let codec =
        Arc::new(RingAeadApiKeySecretCodec::new("open-platform-test-secret-codec-pepper").unwrap());
    let store =
        SqliteAdminOpenPlatformStore::with_api_key_secret_codec(pool.clone(), codec.clone());
    let subject = subject();

    let providers = store
        .list_providers(ListAdminOpenPlatformProvidersQuery {
            subject,
            status: Some("active".to_owned()),
        })
        .await
        .unwrap();
    assert_eq!(1, providers.len());
    assert_eq!("wechat", providers[0].provider);

    let manifests = store
        .list_manifests(ListAdminOpenPlatformManifestsQuery {
            subject,
            provider: Some("wechat".to_owned()),
            account_type: Some("official_account".to_owned()),
            status: Some("active".to_owned()),
        })
        .await
        .unwrap();
    assert_eq!("wechat.official_account.v1", manifests[0].key);

    let account = store
        .create_account(CreateAdminOpenPlatformAccountCommand {
            subject,
            account_uuid: "account-uuid".to_owned(),
            audit_log_uuid: "audit-account-create".to_owned(),
            key: "wechat.oa.main".to_owned(),
            name: "WeChat Official Main".to_owned(),
            provider: "wechat".to_owned(),
            account_type: "official_account".to_owned(),
            app_id: Some("wx123".to_owned()),
            secret_ref: Some("vault://open-platform/wechat/main/app-secret".to_owned()),
            secret_material: Some("wx-secret-value".to_owned()),
            token_ref: Some("vault://open-platform/wechat/main/token".to_owned()),
            token_material: Some("wechat-token".to_owned()),
            aes_key_ref: Some("vault://open-platform/wechat/main/aes-key".to_owned()),
            aes_key_material: Some("wechat-encoding-aes-key".to_owned()),
            request_id: "req-account-create".to_owned(),
            requested_at: "2026-05-21 10:00:00".to_owned(),
        })
        .await
        .unwrap();
    assert_eq!(1, account.id);
    assert_eq!("wechat.oa.main", account.key);
    assert!(!account.qr_default);
    let metadata = load_account_metadata(&pool, account.id).await;
    assert!(!metadata.contains("wx-secret-value"));
    assert!(!metadata.contains("wechat-token"));
    assert!(!metadata.contains("wechat-encoding-aes-key"));
    let metadata: serde_json::Value = serde_json::from_str(&metadata).unwrap();
    assert_eq!(
        "encrypted-open-platform-account-metadata",
        metadata["credentialMaterial"]["storage"]
    );
    assert_eq!(
        "wx-secret-value",
        decode_open_platform_material(codec.as_ref(), &metadata, "appSecret")
    );
    assert_eq!(
        "wechat-token",
        decode_open_platform_material(codec.as_ref(), &metadata, "token")
    );
    assert_eq!(
        "wechat-encoding-aes-key",
        decode_open_platform_material(codec.as_ref(), &metadata, "encodingAesKey")
    );

    let entry = store
        .create_entry(CreateAdminOpenPlatformEntryCommand {
            subject,
            entry_uuid: "entry-uuid".to_owned(),
            audit_log_uuid: "audit-entry-create".to_owned(),
            account_id: account.id,
            key: "wechat.oa.login".to_owned(),
            entry_type: "qr".to_owned(),
            url: "https://portal.example.test/auth/qrcode/wechat".to_owned(),
            request_id: "req-entry-create".to_owned(),
            requested_at: "2026-05-21 10:01:00".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!(account.id, entry.account_id);

    let account = store
        .update_account(UpdateAdminOpenPlatformAccountCommand {
            subject,
            account_id: account.id,
            audit_log_uuid: "audit-account-default".to_owned(),
            name: None,
            app_id: None,
            secret_ref: Some(Some(
                "vault://open-platform/wechat/main/app-secret-rotated".to_owned(),
            )),
            secret_material: Some("rotated-secret".to_owned()),
            token_ref: None,
            token_material: None,
            aes_key_ref: None,
            aes_key_material: None,
            default_entry_id: Some(Some(entry.id)),
            qr_default: Some(true),
            status: None,
            request_id: "req-account-default".to_owned(),
            requested_at: "2026-05-21 10:02:00".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!(Some(entry.id), account.default_entry_id);
    assert!(account.qr_default);
    let metadata = load_account_metadata(&pool, account.id).await;
    assert!(!metadata.contains("rotated-secret"));
    assert!(!metadata.contains("wechat-token"));
    let metadata: serde_json::Value = serde_json::from_str(&metadata).unwrap();
    assert_eq!(
        "rotated-secret",
        decode_open_platform_material(codec.as_ref(), &metadata, "appSecret")
    );
    assert_eq!(
        "wechat-token",
        decode_open_platform_material(codec.as_ref(), &metadata, "token")
    );

    let binding = store
        .create_pay_binding(CreateAdminOpenPlatformPayBindingCommand {
            subject,
            pay_binding_uuid: "pay-binding-uuid".to_owned(),
            audit_log_uuid: "audit-pay-binding-create".to_owned(),
            account_id: account.id,
            payment_account_id: "pay-wechat-main".to_owned(),
            payment_channel_id: Some("channel-wechat-jsapi".to_owned()),
            scene: "official_account".to_owned(),
            mode: "direct".to_owned(),
            request_id: "req-pay-binding-create".to_owned(),
            requested_at: "2026-05-21 10:03:00".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!("official_account", binding.scene);

    assert_eq!(
        1,
        store
            .list_accounts(ListAdminOpenPlatformAccountsQuery {
                subject,
                provider: Some("wechat".to_owned()),
                account_type: Some("official_account".to_owned()),
                status: Some("active".to_owned()),
                page_no: 1,
                page_size: 20,
                offset: 0,
            })
            .await
            .unwrap()
            .len()
    );
    assert_eq!(
        1,
        store
            .list_entries(ListAdminOpenPlatformEntriesQuery {
                subject,
                account_id: account.id,
            })
            .await
            .unwrap()
            .len()
    );
    assert_eq!(
        1,
        store
            .list_pay_bindings(ListAdminOpenPlatformPayBindingsQuery {
                subject,
                account_id: account.id,
            })
            .await
            .unwrap()
            .len()
    );

    store
        .delete_pay_binding(DeleteAdminOpenPlatformPayBindingCommand {
            subject,
            account_id: account.id,
            binding_id: binding.id,
            audit_log_uuid: "audit-pay-binding-delete".to_owned(),
            request_id: "req-pay-binding-delete".to_owned(),
            requested_at: "2026-05-21 10:04:00".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    store
        .delete_entry(DeleteAdminOpenPlatformEntryCommand {
            subject,
            account_id: account.id,
            entry_id: entry.id,
            audit_log_uuid: "audit-entry-delete".to_owned(),
            request_id: "req-entry-delete".to_owned(),
            requested_at: "2026-05-21 10:05:00".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();
    store
        .delete_account(DeleteAdminOpenPlatformAccountCommand {
            subject,
            account_id: account.id,
            audit_log_uuid: "audit-account-delete".to_owned(),
            request_id: "req-account-delete".to_owned(),
            requested_at: "2026-05-21 10:06:00".to_owned(),
        })
        .await
        .unwrap()
        .unwrap();

    let visible = store
        .list_accounts(ListAdminOpenPlatformAccountsQuery {
            subject,
            provider: None,
            account_type: None,
            status: Some("active".to_owned()),
            page_no: 1,
            page_size: 20,
            offset: 0,
        })
        .await
        .unwrap();
    assert!(visible.is_empty());

    let audit_count: i64 =
        sqlx::query_scalar("SELECT COUNT(*) FROM ops_audit_log WHERE target_type IN (81, 82, 83)")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(7, audit_count);
}

fn subject() -> AdminOpenPlatformSubject {
    AdminOpenPlatformSubject {
        tenant_id: 10,
        organization_id: 20,
        operator_id: 30,
        operator_type: 1,
    }
}

async fn load_account_metadata(pool: &sqlx::SqlitePool, account_id: i64) -> String {
    sqlx::query_scalar("SELECT metadata FROM open_platform_account WHERE id = ?")
        .bind(account_id)
        .fetch_one(pool)
        .await
        .unwrap()
}

fn decode_open_platform_material(
    codec: &dyn ApiKeySecretCodec,
    metadata: &serde_json::Value,
    material_key: &str,
) -> String {
    let ciphertext = metadata["credentialMaterial"][material_key]["ciphertext"]
        .as_str()
        .unwrap();
    codec.decode_secret(ciphertext).unwrap()
}

async fn create_schema(pool: &sqlx::SqlitePool) {
    for statement in [
        r#"
        CREATE TABLE open_platform_provider (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL DEFAULT 1,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT NOT NULL DEFAULT '{}',
            provider TEXT NOT NULL,
            name TEXT NOT NULL,
            sort_order INTEGER
        )
        "#,
        r#"
        CREATE TABLE open_platform_manifest (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL DEFAULT 1,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version TEXT NOT NULL,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT NOT NULL DEFAULT '{}',
            manifest_key TEXT NOT NULL,
            provider TEXT NOT NULL,
            account_type TEXT NOT NULL,
            sort_order INTEGER
        )
        "#,
        r#"
        CREATE TABLE open_platform_account (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL DEFAULT 1,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT NOT NULL DEFAULT '{}',
            account_key TEXT NOT NULL,
            name TEXT NOT NULL,
            provider TEXT NOT NULL,
            account_type TEXT NOT NULL,
            app_id TEXT,
            secret_ref TEXT,
            token_ref TEXT,
            aes_key_ref TEXT,
            default_entry_id INTEGER,
            qr_default INTEGER NOT NULL DEFAULT 0
        )
        "#,
        r#"
        CREATE TABLE open_platform_entry (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL DEFAULT 1,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT NOT NULL DEFAULT '{}',
            account_id INTEGER NOT NULL,
            entry_key TEXT NOT NULL,
            entry_type TEXT NOT NULL,
            entry_url TEXT NOT NULL
        )
        "#,
        r#"
        CREATE TABLE open_platform_pay_binding (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL DEFAULT 1,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT NOT NULL DEFAULT '{}',
            account_id INTEGER NOT NULL,
            payment_account_id TEXT NOT NULL,
            payment_channel_id TEXT,
            scene TEXT NOT NULL,
            mode TEXT NOT NULL
        )
        "#,
        r#"
        CREATE TABLE ops_audit_log (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            action TEXT NOT NULL,
            target_type INTEGER NOT NULL,
            target_id INTEGER,
            request_id TEXT,
            operator_id INTEGER,
            operator_type INTEGER,
            change_summary TEXT
        )
        "#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_dictionary(pool: &sqlx::SqlitePool) {
    sqlx::query(
        r#"
        INSERT INTO open_platform_provider
            (id, uuid, tenant_id, organization_id, provider, name, status)
        VALUES
            (1, 'provider-wechat', 10, 20, 'wechat', 'WeChat', 1)
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        INSERT INTO open_platform_manifest
            (id, uuid, tenant_id, organization_id, manifest_key, provider, account_type, version, status)
        VALUES
            (1, 'manifest-wechat-oa', 10, 20, 'wechat.official_account.v1', 'wechat', 'official_account', '1.0.0', 1)
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
}
