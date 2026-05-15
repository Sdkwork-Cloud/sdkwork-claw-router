use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteVerificationDeliveryConfigStore;
use sdkwork_claw_product::ports::{
    VerificationDeliveryConfigQuery, VerificationDeliveryConfigStore,
};
use sqlx::SqlitePool;

#[tokio::test]
async fn sqlite_verification_delivery_config_selects_active_email_config_by_scene_priority_and_weight(
) {
    let pool = create_pool().await;
    create_tables(&pool).await;
    seed_configs(&pool).await;
    let store = SqliteVerificationDeliveryConfigStore::new(pool);

    let config = store
        .active_config_for(VerificationDeliveryConfigQuery {
            tenant_id: 10,
            organization_id: 20,
            channel: "EMAIL".to_owned(),
            scene: "LOGIN".to_owned(),
        })
        .await
        .unwrap()
        .expect("expected active email verification config");

    assert_eq!(2002, config.channel_id);
    assert_eq!(9002, config.account_id);
    assert_eq!("sendgrid", config.provider_code);
    assert_eq!("email", config.channel);
    assert_eq!("login", config.scene);
    assert_eq!("email-primary", config.account_code);
    assert_eq!(
        "vault://providers/sendgrid/account/primary",
        config.secret_ref
    );
    assert_eq!(
        Some("https://api.sendgrid.test".to_owned()),
        config.base_url
    );
    assert_eq!(Some("LOGIN_TEMPLATE".to_owned()), config.template_code);
    assert_eq!(Some("noreply@example.com".to_owned()), config.sender);
}

#[tokio::test]
async fn sqlite_verification_delivery_config_selects_active_sms_config_for_register_scene() {
    let pool = create_pool().await;
    create_tables(&pool).await;
    seed_configs(&pool).await;
    let store = SqliteVerificationDeliveryConfigStore::new(pool);

    let config = store
        .active_config_for(VerificationDeliveryConfigQuery {
            tenant_id: 10,
            organization_id: 20,
            channel: "SMS".to_owned(),
            scene: "REGISTER".to_owned(),
        })
        .await
        .unwrap()
        .expect("expected active sms verification config");

    assert_eq!(2004, config.channel_id);
    assert_eq!("aliyun_sms", config.provider_code);
    assert_eq!("sms", config.channel);
    assert_eq!("register", config.scene);
    assert_eq!(
        "vault://providers/aliyun-sms/account/default",
        config.secret_ref
    );
    assert_eq!(Some("SMS_REGISTER".to_owned()), config.template_code);
    assert_eq!(Some("SDKWORK".to_owned()), config.sender);
}

#[tokio::test]
async fn sqlite_verification_delivery_config_returns_none_when_no_active_provider_matches() {
    let pool = create_pool().await;
    create_tables(&pool).await;
    seed_configs(&pool).await;
    let store = SqliteVerificationDeliveryConfigStore::new(pool);

    let config = store
        .active_config_for(VerificationDeliveryConfigQuery {
            tenant_id: 10,
            organization_id: 20,
            channel: "PUSH".to_owned(),
            scene: "LOGIN".to_owned(),
        })
        .await
        .unwrap();

    assert!(config.is_none());
}

async fn create_pool() -> SqlitePool {
    SqlitePool::connect("sqlite::memory:").await.unwrap()
}

async fn create_tables(pool: &SqlitePool) {
    for statement in [
        r#"
        CREATE TABLE integration_channel (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            provider_code TEXT NOT NULL,
            account_id INTEGER NOT NULL,
            base_url_override TEXT,
            capabilities TEXT,
            priority INTEGER,
            weight INTEGER,
            status INTEGER NOT NULL,
            deleted_at TEXT
        )
        "#,
        r#"
        CREATE TABLE integration_provider_account (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            provider_code TEXT NOT NULL,
            account_code TEXT,
            secret_ref TEXT,
            auth_config TEXT,
            status INTEGER NOT NULL,
            deleted_at TEXT
        )
        "#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_configs(pool: &SqlitePool) {
    sqlx::query(
        r#"
        INSERT INTO integration_provider_account
            (id, tenant_id, organization_id, provider_code, account_code, secret_ref, auth_config, status)
        VALUES
            (9001, 10, 20, 'ses', 'email-secondary', 'vault://providers/ses/account/secondary', '{"templateCode":"SES_LOGIN","sender":"ses@example.com"}', 1),
            (9002, 10, 20, 'sendgrid', 'email-primary', 'vault://providers/sendgrid/account/primary', '{"templateCode":"LOGIN_TEMPLATE","from":"noreply@example.com"}', 1),
            (9003, 10, 20, 'aliyun_sms', 'sms-disabled', 'vault://providers/aliyun-sms/account/disabled', '{"templateCode":"SMS_DISABLED","signName":"SDKWORK"}', 1),
            (9004, 10, 20, 'aliyun_sms', 'sms-default', 'vault://providers/aliyun-sms/account/default', '{"templateCode":"SMS_REGISTER","signName":"SDKWORK"}', 1)
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO integration_channel
            (id, tenant_id, organization_id, provider_code, account_id, base_url_override, capabilities, priority, weight, status)
        VALUES
            (2001, 10, 20, 'ses', 9001, 'https://email.us-east-1.amazonaws.test', '["verification","email","verification:scene:login"]', 20, 80, 1),
            (2002, 10, 20, 'sendgrid', 9002, 'https://api.sendgrid.test', '["verification:email","verification:scene:login"]', 10, 20, 1),
            (2003, 10, 20, 'aliyun_sms', 9003, NULL, '["verification:sms","verification:scene:register"]', 5, 100, 2),
            (2004, 10, 20, 'aliyun_sms', 9004, NULL, '["verification:sms","verification:scene:register"]', 10, 10, 1)
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
}
