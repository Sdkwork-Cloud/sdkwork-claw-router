use sdkwork_clawrouter_router_service::infrastructure::sql::sqlite::SqliteVerificationDeliveryConfigStore;
use sdkwork_clawrouter_router_service::ports::{
    VerificationDeliveryConfigQuery, VerificationDeliveryConfigStore,
};
use sqlx::SqlitePool;

#[tokio::test]
async fn sqlite_verification_delivery_config_selects_active_email_config_from_messaging_route() {
    let pool = create_pool().await;
    create_tables(&pool).await;
    seed_configs(&pool).await;
    let store = SqliteVerificationDeliveryConfigStore::new(pool);

    let config = store
        .active_config_for(VerificationDeliveryConfigQuery {
            tenant_id: 100001,
            organization_id: 0,
            channel: "EMAIL".to_owned(),
            scene: "LOGIN".to_owned(),
        })
        .await
        .unwrap()
        .expect("expected active email verification config");

    assert_eq!(4002, config.route_rule_id);
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
    assert_eq!(Some(8002), config.sender_identity_id);
    assert_eq!(Some("noreply@example.com".to_owned()), config.sender);
    assert_eq!(10, config.priority);
    assert_eq!(20, config.weight);
}

#[tokio::test]
async fn sqlite_verification_delivery_config_selects_active_sms_config_for_register_scene() {
    let pool = create_pool().await;
    create_tables(&pool).await;
    seed_configs(&pool).await;
    let store = SqliteVerificationDeliveryConfigStore::new(pool);

    let config = store
        .active_config_for(VerificationDeliveryConfigQuery {
            tenant_id: 100001,
            organization_id: 0,
            channel: "SMS".to_owned(),
            scene: "REGISTER".to_owned(),
        })
        .await
        .unwrap()
        .expect("expected active sms verification config");

    assert_eq!(4004, config.route_rule_id);
    assert_eq!("aliyun_sms", config.provider_code);
    assert_eq!("sms", config.channel);
    assert_eq!("register", config.scene);
    assert_eq!(
        "vault://providers/aliyun-sms/account/default",
        config.secret_ref
    );
    assert_eq!(Some("SMS_REGISTER".to_owned()), config.template_code);
    assert_eq!(Some(8004), config.sender_identity_id);
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
            tenant_id: 100001,
            organization_id: 0,
            channel: "PUSH".to_owned(),
            scene: "LOGIN".to_owned(),
        })
        .await
        .unwrap();

    assert!(config.is_none());
}

#[tokio::test]
async fn sqlite_verification_delivery_config_fails_closed_when_secret_ref_is_missing() {
    let pool = create_pool().await;
    create_tables(&pool).await;
    seed_configs(&pool).await;
    sqlx::query("UPDATE integration_provider_account SET secret_ref = '' WHERE id = 9002")
        .execute(&pool)
        .await
        .unwrap();
    let store = SqliteVerificationDeliveryConfigStore::new(pool);

    let error = store
        .active_config_for(VerificationDeliveryConfigQuery {
            tenant_id: 100001,
            organization_id: 0,
            channel: "email".to_owned(),
            scene: "login".to_owned(),
        })
        .await
        .unwrap_err();

    assert!(
        error.to_string().contains("missing secret_ref"),
        "{error:?}"
    );
}

async fn create_pool() -> SqlitePool {
    SqlitePool::connect("sqlite::memory:").await.unwrap()
}

async fn create_tables(pool: &SqlitePool) {
    for statement in [
        r#"
        CREATE TABLE iam_verification_scene_policy (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            scene_code TEXT NOT NULL,
            allowed_channels TEXT NOT NULL DEFAULT '[]',
            default_channel TEXT,
            template_code TEXT NOT NULL
        )
        "#,
        r#"
        CREATE TABLE integration_provider_account (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            provider_code TEXT NOT NULL,
            account_code TEXT,
            base_url TEXT,
            secret_ref TEXT,
            status INTEGER NOT NULL,
            deleted_at TEXT
        )
        "#,
        r#"
        CREATE TABLE messaging_provider_capability (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            provider_code TEXT NOT NULL,
            provider_account_id INTEGER NOT NULL,
            channel TEXT NOT NULL,
            delivery_purpose TEXT NOT NULL,
            capability_schema TEXT NOT NULL DEFAULT '{}',
            supports_template_sync INTEGER NOT NULL DEFAULT 0,
            supports_delivery_receipt INTEGER NOT NULL DEFAULT 0,
            supports_test_send INTEGER NOT NULL DEFAULT 0,
            supports_batch_send INTEGER NOT NULL DEFAULT 0,
            supports_webhook INTEGER NOT NULL DEFAULT 0,
            sandbox_supported INTEGER NOT NULL DEFAULT 0,
            health_status TEXT NOT NULL DEFAULT 'unknown'
        )
        "#,
        r#"
        CREATE TABLE messaging_sender_identity (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            provider_account_id INTEGER NOT NULL,
            provider_code TEXT NOT NULL,
            channel TEXT NOT NULL,
            identity_code TEXT NOT NULL,
            display_name TEXT,
            from_email TEXT,
            from_name TEXT,
            reply_to TEXT,
            domain_name TEXT,
            sign_name TEXT,
            sender_id TEXT,
            country_code TEXT,
            approval_status TEXT NOT NULL DEFAULT 'draft'
        )
        "#,
        r#"
        CREATE TABLE messaging_template (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            template_code TEXT NOT NULL,
            scene_code TEXT NOT NULL,
            channel TEXT NOT NULL,
            delivery_purpose TEXT NOT NULL,
            category TEXT NOT NULL,
            template_name TEXT NOT NULL,
            current_version_id INTEGER,
            publish_status TEXT NOT NULL DEFAULT 'draft'
        )
        "#,
        r#"
        CREATE TABLE messaging_route_rule (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            rule_code TEXT NOT NULL,
            scene_code TEXT NOT NULL,
            channel TEXT NOT NULL,
            delivery_purpose TEXT NOT NULL,
            country_code TEXT NOT NULL DEFAULT '*',
            locale TEXT NOT NULL DEFAULT '*',
            user_segment TEXT NOT NULL DEFAULT '*',
            priority INTEGER NOT NULL DEFAULT 100,
            weight INTEGER NOT NULL DEFAULT 100,
            failover_policy TEXT NOT NULL DEFAULT '{}'
        )
        "#,
        r#"
        CREATE TABLE messaging_route_rule_target (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            route_rule_id INTEGER NOT NULL,
            provider_account_id INTEGER NOT NULL,
            provider_code TEXT NOT NULL,
            sender_identity_id INTEGER,
            template_binding_id INTEGER,
            target_order INTEGER NOT NULL DEFAULT 1,
            weight INTEGER NOT NULL DEFAULT 100
        )
        "#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_configs(pool: &SqlitePool) {
    sqlx::query(
        r#"
        INSERT INTO iam_verification_scene_policy
            (id, tenant_id, organization_id, scene_code, allowed_channels, default_channel, template_code, status)
        VALUES
            (6001, 100001, 0, 'login', '["email","sms"]', 'email', 'LOGIN_TEMPLATE', 1),
            (6002, 100001, 0, 'register', '["sms"]', 'sms', 'SMS_REGISTER', 1)
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO integration_provider_account
            (id, tenant_id, organization_id, provider_code, account_code, base_url, secret_ref, status)
        VALUES
            (9001, 100001, 0, 'ses', 'email-secondary', 'https://email.us-east-1.amazonaws.test', 'vault://providers/ses/account/secondary', 1),
            (9002, 100001, 0, 'sendgrid', 'email-primary', 'https://api.sendgrid.test', 'vault://providers/sendgrid/account/primary', 1),
            (9003, 100001, 0, 'aliyun_sms', 'sms-disabled', NULL, 'vault://providers/aliyun-sms/account/disabled', 1),
            (9004, 100001, 0, 'aliyun_sms', 'sms-default', NULL, 'vault://providers/aliyun-sms/account/default', 1)
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO messaging_provider_capability
            (id, tenant_id, organization_id, provider_code, provider_account_id, channel, delivery_purpose, status, health_status)
        VALUES
            (3001, 100001, 0, 'ses', 9001, 'email', 'verification', 1, 'healthy'),
            (3002, 100001, 0, 'sendgrid', 9002, 'email', 'verification', 1, 'healthy'),
            (3003, 100001, 0, 'aliyun_sms', 9003, 'sms', 'verification', 2, 'disabled'),
            (3004, 100001, 0, 'aliyun_sms', 9004, 'sms', 'verification', 1, 'healthy')
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO messaging_sender_identity
            (id, tenant_id, organization_id, provider_account_id, provider_code, channel, identity_code,
             from_email, sign_name, status, approval_status)
        VALUES
            (8001, 100001, 0, 9001, 'ses', 'email', 'ses-mailer', 'ses@example.com', NULL, 1, 'approved'),
            (8002, 100001, 0, 9002, 'sendgrid', 'email', 'primary-mailer', 'noreply@example.com', NULL, 1, 'approved'),
            (8003, 100001, 0, 9003, 'aliyun_sms', 'sms', 'disabled-sign', NULL, 'SDKWORK', 1, 'approved'),
            (8004, 100001, 0, 9004, 'aliyun_sms', 'sms', 'default-sign', NULL, 'SDKWORK', 1, 'approved')
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO messaging_template
            (id, tenant_id, organization_id, template_code, scene_code, channel, delivery_purpose, category,
             template_name, status, publish_status)
        VALUES
            (7001, 100001, 0, 'SES_LOGIN', 'login', 'email', 'verification', 'otp', 'SES Login', 1, 'published'),
            (7002, 100001, 0, 'LOGIN_TEMPLATE', 'login', 'email', 'verification', 'otp', 'Login Email', 1, 'published'),
            (7003, 100001, 0, 'SMS_DISABLED', 'register', 'sms', 'verification', 'otp', 'Disabled SMS', 1, 'published'),
            (7004, 100001, 0, 'SMS_REGISTER', 'register', 'sms', 'verification', 'otp', 'Register SMS', 1, 'published')
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO messaging_route_rule
            (id, tenant_id, organization_id, rule_code, scene_code, channel, delivery_purpose, country_code,
             locale, user_segment, priority, weight, status)
        VALUES
            (4001, 100001, 0, 'login-email-secondary', 'login', 'email', 'verification', '*', '*', '*', 20, 80, 1),
            (4002, 100001, 0, 'login-email-primary', 'login', 'email', 'verification', '*', '*', '*', 100001, 0, 1),
            (4003, 100001, 0, 'register-sms-disabled', 'register', 'sms', 'verification', '*', '*', '*', 5, 100, 1),
            (4004, 100001, 0, 'register-sms-default', 'register', 'sms', 'verification', '*', '*', '*', 10, 10, 1)
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO messaging_route_rule_target
            (id, tenant_id, organization_id, route_rule_id, provider_account_id, provider_code,
             sender_identity_id, target_order, weight, status)
        VALUES
            (5001, 100001, 0, 4001, 9001, 'ses', 8001, 1, 80, 1),
            (5002, 100001, 0, 4002, 9002, 'sendgrid', 8002, 1, 20, 1),
            (5003, 100001, 0, 4003, 9003, 'aliyun_sms', 8003, 1, 100, 1),
            (5004, 100001, 0, 4004, 9004, 'aliyun_sms', 8004, 1, 10, 1)
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
}
