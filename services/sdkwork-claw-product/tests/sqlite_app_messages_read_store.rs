use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAppMessagesReadStore;
use sdkwork_claw_product::ports::{AppMessagesReadStore, AppMessagesSubject};
use sqlx::sqlite::SqlitePoolOptions;

#[tokio::test]
async fn sqlite_app_messages_read_store_merges_popup_announcements_into_notifications() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_schema(&pool).await;

    sqlx::query(
        r#"
        INSERT INTO ops_notification_message
            (id, tenant_id, organization_id, status, title, summary, content, published_at, created_at, message_type, severity, target_scope)
        VALUES
            (1, 10, 20, 1, 'Billing notice', 'Recharge complete', 'Credits are ready.', '2026-05-17 10:00:00', '2026-05-17 10:00:00', 2, 1, 1)
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO content_announcement
            (id, tenant_id, organization_id, status, title, content, target_scope, audience_filter, published_at, created_at, announcement_type)
        VALUES
            (10, 10, 20, 1, 'Popup announcement', 'Read this before continuing.', 1, '{"target":"all","showAsPopup":true}', '2026-05-17 11:00:00', '2026-05-17 11:00:00', 3),
            (11, 10, 20, 1, 'Inline announcement', 'No popup flag.', 1, '{"target":"all","showAsPopup":false}', '2026-05-17 12:00:00', '2026-05-17 12:00:00', 1),
            (12, 10, 20, 0, 'Draft popup', 'Drafts stay hidden.', 1, '{"target":"all","showAsPopup":true}', '2026-05-17 13:00:00', '2026-05-17 13:00:00', 4)
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let items = SqliteAppMessagesReadStore::new(pool)
        .load_messages(Some(AppMessagesSubject {
            tenant_id: 10,
            organization_id: 20,
            user_id: 30,
        }))
        .await
        .unwrap();

    let popup = items
        .iter()
        .find(|item| item.id == "announcement-10")
        .expect("popup announcement should be included");
    assert_eq!("Popup announcement", popup.title);
    assert_eq!("warning", popup.message_type);
    assert_eq!(false, popup.read);
    assert_eq!(true, popup.show_as_popup);
    assert!(items
        .iter()
        .any(|item| item.id == "1" && !item.show_as_popup));
    assert!(!items.iter().any(|item| item.id == "announcement-11"));
    assert!(!items.iter().any(|item| item.id == "announcement-12"));
}

async fn create_schema(pool: &sqlx::SqlitePool) {
    for statement in [
        r#"
        CREATE TABLE ops_notification_message (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            title TEXT,
            summary TEXT,
            content TEXT,
            published_at TEXT,
            created_at TEXT,
            expire_at TEXT,
            message_type INTEGER,
            severity INTEGER,
            target_scope INTEGER,
            target_user_id INTEGER
        )
        "#,
        r#"
        CREATE TABLE ops_notification_delivery (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            message_id INTEGER,
            user_id INTEGER,
            delivery_status INTEGER,
            read_at TEXT,
            delivered_at TEXT
        )
        "#,
        r#"
        CREATE TABLE content_announcement (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            status INTEGER NOT NULL,
            deleted_at TEXT,
            title TEXT,
            content TEXT,
            target_scope INTEGER,
            audience_filter TEXT,
            announcement_type INTEGER,
            published_at TEXT,
            created_at TEXT,
            effective_from TEXT,
            effective_to TEXT
        )
        "#,
        r#"
        CREATE TABLE plus_vip_user (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            status INTEGER NOT NULL,
            valid_from TEXT,
            valid_to TEXT
        )
        "#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}
