use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteVerificationDeliveryQueueSender;
use sdkwork_claw_product::ports::{
    ProviderVerificationDeliveryRequest, ProviderVerificationDeliverySender,
    VerificationCodeDeliveryRequest, VerificationDeliveryConfig,
};
use sqlx::{Row, SqlitePool};

#[tokio::test]
async fn sqlite_verification_delivery_queue_sender_records_queued_delivery_without_plaintext_code()
{
    let pool = create_pool().await;
    create_tables(&pool).await;
    seed_template(&pool).await;
    let sender = SqliteVerificationDeliveryQueueSender::new(pool.clone());

    let receipt = sender
        .send_with_config(ProviderVerificationDeliveryRequest {
            config: verification_config(),
            delivery: VerificationCodeDeliveryRequest {
                code_id: "verification-code-1".to_owned(),
                target: "new-user@example.com".to_owned(),
                scene: "REGISTER".to_owned(),
                channel: "EMAIL".to_owned(),
                code: "654321".to_owned(),
                expires_at: "2026-05-25T10:05:00Z".to_owned(),
            },
        })
        .await
        .unwrap();

    assert_eq!("verification-code-1", receipt.message_id);
    assert!(!receipt.delivered_at.is_empty());

    let request_row = sqlx::query(
        r#"
        SELECT request_no, idempotency_key, scene_code, channel, delivery_purpose, target_type,
               target_hash, target_masked, template_version_id, template_variant_id,
               resolved_route_rule_id, resolved_provider_account_id, request_payload_redacted,
               dry_run, delivery_status
        FROM messaging_send_request
        LIMIT 1
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        "verification-code-1",
        request_row.get::<String, _>("request_no")
    );
    assert_eq!(
        "verification-code:verification-code-1",
        request_row.get::<String, _>("idempotency_key")
    );
    assert_eq!("register", request_row.get::<String, _>("scene_code"));
    assert_eq!("email", request_row.get::<String, _>("channel"));
    assert_eq!(
        "verification",
        request_row.get::<String, _>("delivery_purpose")
    );
    assert_eq!("email", request_row.get::<String, _>("target_type"));
    assert_eq!(64, request_row.get::<String, _>("target_hash").len());
    assert_eq!(
        "n***@example.com",
        request_row.get::<String, _>("target_masked")
    );
    assert_eq!(7001_i64, request_row.get::<i64, _>("template_version_id"));
    assert_eq!(7101_i64, request_row.get::<i64, _>("template_variant_id"));
    assert_eq!(
        4001_i64,
        request_row.get::<i64, _>("resolved_route_rule_id")
    );
    assert_eq!(
        9101_i64,
        request_row.get::<i64, _>("resolved_provider_account_id")
    );
    assert_eq!(0_i64, request_row.get::<i64, _>("dry_run"));
    assert_eq!("queued", request_row.get::<String, _>("delivery_status"));
    let redacted_payload = request_row.get::<String, _>("request_payload_redacted");
    assert!(redacted_payload.contains("\"variableKeys\":[\"code\",\"expiresAt\"]"));
    assert!(!redacted_payload.contains("654321"));
    assert!(!redacted_payload.contains("new-user@example.com"));
    assert!(!redacted_payload.contains("vault://"));

    let attempt_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM messaging_send_attempt WHERE provider_code = 'sendgrid' AND provider_status = 'queued'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1, attempt_count);

    let event_payload: String = sqlx::query_scalar(
        "SELECT payload_redacted FROM messaging_delivery_event WHERE event_type = 'queued'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert!(event_payload.contains("\"variableKeys\":[\"code\",\"expiresAt\"]"));
    assert!(event_payload.contains("\"deliveryStatus\":\"queued\""));
    assert!(!event_payload.contains("654321"));
    assert!(!event_payload.contains("new-user@example.com"));
}

#[tokio::test]
async fn sqlite_verification_delivery_queue_sender_fails_closed_after_recording_rate_limited_request(
) {
    let pool = create_pool().await;
    create_tables(&pool).await;
    seed_template(&pool).await;
    let sender = SqliteVerificationDeliveryQueueSender::new(pool.clone());
    let config = verification_config();

    sender
        .send_with_config(ProviderVerificationDeliveryRequest {
            config: config.clone(),
            delivery: VerificationCodeDeliveryRequest {
                code_id: "verification-code-rate-1".to_owned(),
                target: "limited@example.com".to_owned(),
                scene: "REGISTER".to_owned(),
                channel: "EMAIL".to_owned(),
                code: "111111".to_owned(),
                expires_at: "2026-05-25T10:05:00Z".to_owned(),
            },
        })
        .await
        .unwrap();
    let rate_limited_request = ProviderVerificationDeliveryRequest {
        config,
        delivery: VerificationCodeDeliveryRequest {
            code_id: "verification-code-rate-2".to_owned(),
            target: "limited@example.com".to_owned(),
            scene: "REGISTER".to_owned(),
            channel: "EMAIL".to_owned(),
            code: "222222".to_owned(),
            expires_at: "2026-05-25T10:06:00Z".to_owned(),
        },
    };
    let error = sender
        .send_with_config(rate_limited_request.clone())
        .await
        .unwrap_err();
    assert!(
        error
            .to_string()
            .contains("verification code delivery is rate limited"),
        "{error:?}"
    );
    let replay_error = sender
        .send_with_config(rate_limited_request)
        .await
        .unwrap_err();
    assert!(
        replay_error
            .to_string()
            .contains("verification code delivery is rate limited"),
        "{replay_error:?}"
    );

    let statuses: Vec<String> =
        sqlx::query_scalar("SELECT delivery_status FROM messaging_send_request ORDER BY id ASC")
            .fetch_all(&pool)
            .await
            .unwrap();
    assert_eq!(
        vec!["queued".to_owned(), "rate_limited".to_owned()],
        statuses
    );
    let attempt_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM messaging_send_attempt")
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(1, attempt_count);
    let bucket =
        sqlx::query("SELECT send_count, reject_count FROM messaging_rate_limit_bucket LIMIT 1")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(1_i64, bucket.get::<i64, _>("send_count"));
    assert_eq!(1_i64, bucket.get::<i64, _>("reject_count"));

    let rate_limited_event_payload: String = sqlx::query_scalar(
        "SELECT payload_redacted FROM messaging_delivery_event WHERE event_type = 'rate_limited'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert!(rate_limited_event_payload.contains("\"deliveryStatus\":\"rate_limited\""));
    assert!(!rate_limited_event_payload.contains("222222"));
    assert!(!rate_limited_event_payload.contains("limited@example.com"));
}

fn verification_config() -> VerificationDeliveryConfig {
    VerificationDeliveryConfig {
        route_rule_id: 4001,
        account_id: 9101,
        tenant_id: 10,
        organization_id: 20,
        provider_code: "sendgrid".to_owned(),
        channel: "email".to_owned(),
        scene: "register".to_owned(),
        account_code: "email-primary".to_owned(),
        secret_ref: "vault://providers/sendgrid/account/primary".to_owned(),
        base_url: Some("https://api.sendgrid.test".to_owned()),
        template_code: Some("REGISTER_EMAIL".to_owned()),
        sender_identity_id: Some(8101),
        sender: Some("noreply@example.com".to_owned()),
        priority: 10,
        weight: 100,
    }
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
            status INTEGER NOT NULL DEFAULT 1,
            deleted_at TEXT,
            scene_code TEXT NOT NULL,
            max_send_per_hour INTEGER NOT NULL DEFAULT 5
        )
        "#,
        r#"
        CREATE TABLE messaging_template (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            status INTEGER NOT NULL DEFAULT 1,
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
        CREATE TABLE messaging_template_version (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            status INTEGER NOT NULL DEFAULT 1,
            deleted_at TEXT,
            template_id INTEGER NOT NULL,
            version_no INTEGER NOT NULL,
            subject_template TEXT,
            text_template TEXT,
            html_template TEXT,
            variable_schema TEXT NOT NULL DEFAULT '{}',
            content_hash TEXT NOT NULL,
            review_status TEXT NOT NULL DEFAULT 'draft',
            published_at TEXT
        )
        "#,
        r#"
        CREATE TABLE messaging_template_variant (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            status INTEGER NOT NULL DEFAULT 1,
            deleted_at TEXT,
            template_version_id INTEGER NOT NULL,
            channel TEXT NOT NULL,
            locale TEXT NOT NULL,
            content_format TEXT NOT NULL,
            body_template TEXT NOT NULL
        )
        "#,
        r#"
        CREATE TABLE messaging_send_request (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            request_id TEXT,
            payload_hash TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            request_no TEXT NOT NULL,
            idempotency_key TEXT NOT NULL,
            scene_code TEXT NOT NULL,
            channel TEXT NOT NULL,
            delivery_purpose TEXT NOT NULL,
            target_type TEXT NOT NULL,
            target_hash TEXT NOT NULL,
            target_masked TEXT,
            template_version_id INTEGER,
            template_variant_id INTEGER,
            resolved_route_rule_id INTEGER,
            resolved_provider_account_id INTEGER,
            resolved_sender_identity_id INTEGER,
            render_hash TEXT NOT NULL,
            request_payload_redacted TEXT NOT NULL DEFAULT '{}',
            dry_run INTEGER NOT NULL DEFAULT 0,
            delivery_status TEXT NOT NULL
        )
        "#,
        r#"
        CREATE TABLE messaging_send_attempt (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            request_id TEXT,
            payload_hash TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            send_request_id INTEGER NOT NULL,
            attempt_no INTEGER NOT NULL,
            provider_code TEXT NOT NULL,
            provider_account_id INTEGER NOT NULL,
            provider_status TEXT,
            attempted_at TEXT NOT NULL
        )
        "#,
        r#"
        CREATE TABLE messaging_delivery_event (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            request_id TEXT,
            payload_hash TEXT NOT NULL,
            send_request_id INTEGER NOT NULL,
            send_attempt_id INTEGER,
            provider_code TEXT NOT NULL,
            provider_event_id TEXT NOT NULL,
            provider_message_id TEXT,
            event_type TEXT NOT NULL,
            event_at TEXT NOT NULL,
            payload_redacted TEXT NOT NULL DEFAULT '{}'
        )
        "#,
        r#"
        CREATE TABLE messaging_rate_limit_bucket (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            deleted_at TEXT,
            scene_code TEXT NOT NULL,
            channel TEXT NOT NULL,
            target_hash TEXT NOT NULL,
            ip_hash TEXT NOT NULL,
            device_hash TEXT NOT NULL,
            window_start TEXT NOT NULL,
            window_seconds INTEGER NOT NULL,
            send_count INTEGER NOT NULL DEFAULT 0,
            verify_count INTEGER NOT NULL DEFAULT 0,
            reject_count INTEGER NOT NULL DEFAULT 0,
            last_event_at TEXT
        )
        "#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_template(pool: &SqlitePool) {
    sqlx::query(
        r#"
        INSERT INTO iam_verification_scene_policy
            (id, tenant_id, organization_id, scene_code, max_send_per_hour, status)
        VALUES
            (6101, 10, 20, 'register', 1, 1)
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        INSERT INTO messaging_template
            (id, tenant_id, organization_id, template_code, scene_code, channel, delivery_purpose,
             category, template_name, current_version_id, publish_status, status)
        VALUES
            (7000, 10, 20, 'REGISTER_EMAIL', 'register', 'email', 'verification',
             'otp', 'Register Email', 7001, 'published', 1)
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        INSERT INTO messaging_template_version
            (id, tenant_id, organization_id, template_id, version_no, subject_template,
             text_template, html_template, variable_schema, content_hash, review_status,
             published_at, status)
        VALUES
            (7001, 10, 20, 7000, 1, 'Your verification code',
             'Code {{code}} expires at {{expiresAt}}',
             '<p>Code {{code}} expires at {{expiresAt}}</p>',
             '{"required":["code","expiresAt"]}', 'hash-register-email-v1',
             'published', '2026-05-25 10:00:00', 1)
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        INSERT INTO messaging_template_variant
            (id, tenant_id, organization_id, template_version_id, channel, locale,
             content_format, body_template, status)
        VALUES
            (7101, 10, 20, 7001, 'email', 'default', 'html',
             '<p>Code {{code}} expires at {{expiresAt}}</p>', 1)
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
}
