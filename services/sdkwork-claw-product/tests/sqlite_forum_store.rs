use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteForumStore;
use sdkwork_claw_product::ports::{
    CreateForumCommentCommand, CreateForumFeedCommand, ForumCommentCommandStore,
    ForumCommentReadStore, ForumFeedCommandStore, ForumFeedQuery, ForumFeedReadStore, ForumSubject,
};
use sdkwork_claw_product_test_support::{repair_sqlite_pool, schema_sqlite_pool};
use serde_json::json;

#[tokio::test]
async fn sqlite_forum_store_uses_java_content_forum_post_and_comments_contract() {
    let pool = repair_sqlite_pool().await;

    let store = SqliteForumStore::new(pool.clone());
    let subject = owner_subject();

    let feed = store
        .create_feed(
            CreateForumFeedCommand {
                subject,
                uuid: "feed-contract-1".to_owned(),
                title: Some("Provider fallback patterns".to_owned()),
                content: "How should Claw Router handle model provider failover?".to_owned(),
                category_id: Some(1001),
                images: vec![json!({
                    "kind": "image",
                    "source": "external_url",
                    "url": "https://cdn.sdkwork.com/forum/failover.png",
                    "publicUrl": "https://cdn.sdkwork.com/forum/failover.png"
                })],
                tags: vec!["routing".to_owned(), "fallback".to_owned()],
                source: Some("community".to_owned()),
                source_url: Some("https://sdkwork.com/forum/provider-fallback".to_owned()),
                requested_at: "2026-05-09T10:00:00Z".to_owned(),
            },
            Some(subject),
        )
        .await
        .unwrap();

    assert_eq!("Provider fallback patterns", feed.title);
    assert_eq!(
        "How should Claw Router handle model provider failover?",
        feed.content
    );
    assert_eq!("feeds", feed.content_type);
    assert_eq!(1001, feed.category_id);
    assert_eq!("image", feed.cover["kind"]);
    assert_eq!("external_url", feed.cover["source"]);
    assert_eq!(
        "https://cdn.sdkwork.com/forum/failover.png",
        feed.cover["publicUrl"]
    );
    assert_eq!(vec!["routing".to_owned(), "fallback".to_owned()], feed.tags);
    assert_eq!(0, feed.view_count);
    assert_eq!(0, feed.like_count);
    assert_eq!(0, feed.comment_count);
    assert!(!feed.is_liked);
    assert!(!feed.is_collected);

    let list = store
        .load_feeds(
            ForumFeedQuery {
                feed_type: Some("latest".to_owned()),
                keyword: Some("failover".to_owned()),
                page: Some(1),
                size: Some(10),
                ..ForumFeedQuery::default()
            },
            Some(subject),
        )
        .await
        .unwrap();
    assert_eq!(1, list.len());
    assert_eq!(feed.id, list[0].id);

    let detail = store
        .load_feed_detail(feed.id, Some(subject))
        .await
        .unwrap()
        .expect("created published feed must be readable");
    assert_eq!(1, detail.view_count);

    let comment = store
        .create_comment(
            CreateForumCommentCommand {
                subject,
                uuid: "comment-contract-1".to_owned(),
                content_type: "feeds".to_owned(),
                content_id: feed.id,
                content: "Use weighted fallback with explicit health windows.".to_owned(),
                parent_id: None,
                device_info: Some("rust-test".to_owned()),
                ip_address: Some("127.0.0.1".to_owned()),
                requested_at: "2026-05-09T10:01:00Z".to_owned(),
            },
            Some(subject),
        )
        .await
        .unwrap();
    assert_eq!("FEEDS", comment.content_type);
    assert_eq!(feed.id, comment.content_id);
    assert_eq!(subject.user_id, comment.user_id);
    assert_eq!("PUBLISHED", comment.status);
    assert_eq!(0, comment.reply_count);
    assert!(comment.parent_id.is_none());

    let reply = store
        .create_comment(
            CreateForumCommentCommand {
                subject,
                uuid: "reply-contract-1".to_owned(),
                content_type: "feeds".to_owned(),
                content_id: feed.id,
                content: "Agree, and expose the retry reason in trace logs.".to_owned(),
                parent_id: Some(comment.comment_id.parse::<i64>().unwrap()),
                device_info: Some("rust-test".to_owned()),
                ip_address: Some("127.0.0.1".to_owned()),
                requested_at: "2026-05-09T10:02:00Z".to_owned(),
            },
            Some(subject),
        )
        .await
        .unwrap();
    assert_eq!(
        Some(comment.comment_id.parse::<i64>().unwrap()),
        reply.parent_id
    );

    let comments = store
        .load_comments("feeds".to_owned(), feed.id, None, Some(subject))
        .await
        .unwrap();
    assert_eq!(1, comments.items.len());
    assert_eq!(comment.comment_id, comments.items[0].comment_id);
    assert_eq!(1, comments.items[0].reply_count);
    assert_eq!(1, comments.total_elements);

    let replies = store
        .load_comment_replies(
            comment.comment_id.parse::<i64>().unwrap(),
            None,
            Some(subject),
        )
        .await
        .unwrap();
    assert_eq!(1, replies.items.len());
    assert_eq!(reply.comment_id, replies.items[0].comment_id);

    let refreshed_feed = store
        .load_feed_detail(feed.id, Some(subject))
        .await
        .unwrap()
        .unwrap();
    assert_eq!(2, refreshed_feed.comment_count);
    assert_eq!(
        2, refreshed_feed.view_count,
        "detail reads must mirror Java app API and increment content_forum_post.view_count"
    );
}

#[tokio::test]
async fn sqlite_forum_store_scopes_comments_to_the_current_forum_subject() {
    let pool = schema_sqlite_pool().await;

    let store = SqliteForumStore::new(pool);
    let tenant_a = owner_subject();
    let tenant_b = ForumSubject {
        tenant_id: tenant_a.tenant_id + 1,
        organization_id: tenant_a.organization_id,
        user_id: tenant_a.user_id + 1,
    };
    let content_id = 9_900_042;

    let tenant_a_comment = store
        .create_comment(
            CreateForumCommentCommand {
                subject: tenant_a,
                uuid: "tenant-a-comment".to_owned(),
                content_type: "feeds".to_owned(),
                content_id,
                content: "Tenant A should only see this comment.".to_owned(),
                parent_id: None,
                device_info: None,
                ip_address: None,
                requested_at: "2026-05-09T10:03:00Z".to_owned(),
            },
            Some(tenant_a),
        )
        .await
        .unwrap();
    let tenant_b_comment = store
        .create_comment(
            CreateForumCommentCommand {
                subject: tenant_b,
                uuid: "tenant-b-comment".to_owned(),
                content_type: "feeds".to_owned(),
                content_id,
                content: "Tenant B must not leak into tenant A reads.".to_owned(),
                parent_id: None,
                device_info: None,
                ip_address: None,
                requested_at: "2026-05-09T10:04:00Z".to_owned(),
            },
            Some(tenant_b),
        )
        .await
        .unwrap();

    let tenant_a_comments = store
        .load_comments("feeds".to_owned(), content_id, None, Some(tenant_a))
        .await
        .unwrap();
    assert_eq!(1, tenant_a_comments.items.len());
    assert_eq!(
        tenant_a_comment.comment_id,
        tenant_a_comments.items[0].comment_id
    );
    assert_ne!(
        tenant_b_comment.comment_id,
        tenant_a_comments.items[0].comment_id
    );

    assert!(
        store
            .load_comment_detail(
                tenant_b_comment.comment_id.parse::<i64>().unwrap(),
                Some(tenant_a),
            )
            .await
            .unwrap()
            .is_none(),
        "comment details must not cross tenant boundaries",
    );
    assert_eq!(
        1,
        store
            .load_comment_statistics("feeds".to_owned(), content_id, Some(tenant_a))
            .await
            .unwrap()
            .total_comments,
    );
}

#[tokio::test]
async fn sqlite_forum_store_does_not_apply_feed_side_effects_across_tenants() {
    let pool = schema_sqlite_pool().await;

    let store = SqliteForumStore::new(pool.clone());
    let owner = owner_subject();
    let other_tenant = ForumSubject {
        tenant_id: owner.tenant_id + 1,
        organization_id: owner.organization_id,
        user_id: owner.user_id + 1,
    };

    let feed = store
        .create_feed(
            CreateForumFeedCommand {
                subject: owner,
                uuid: "tenant-owned-feed".to_owned(),
                title: Some("Tenant owned feed".to_owned()),
                content: "Cross-tenant access must not mutate this feed.".to_owned(),
                category_id: Some(1001),
                images: Vec::new(),
                tags: Vec::new(),
                source: None,
                source_url: None,
                requested_at: "2026-05-09T10:05:00Z".to_owned(),
            },
            Some(owner),
        )
        .await
        .unwrap();

    assert!(
        store
            .load_feed_detail(feed.id, Some(other_tenant))
            .await
            .unwrap()
            .is_none(),
        "feed detail reads must not cross tenant boundaries",
    );
    assert!(
        store.like_feed(feed.id, other_tenant).await.is_err(),
        "liking an invisible feed must fail before writing a vote",
    );
    assert!(
        store
            .collect_feed(feed.id, Some(77), other_tenant)
            .await
            .is_err(),
        "collecting an invisible feed must fail before writing a favorite",
    );
    assert!(
        store.share_feed(feed.id, other_tenant).await.is_err(),
        "sharing an invisible feed must fail before incrementing share_count",
    );

    let (view_count, like_count, favorite_count, share_count) =
        sqlx::query_as::<_, (i64, i64, i64, i64)>(
            r#"
            SELECT view_count, like_count, favorite_count, share_count
            FROM content_forum_post
            WHERE id = ?1
            "#,
        )
        .bind(feed.id)
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(0, view_count);
    assert_eq!(0, like_count);
    assert_eq!(0, favorite_count);
    assert_eq!(0, share_count);

    let foreign_votes = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT COUNT(1)
        FROM content_reaction
        WHERE tenant_id = ?1
          AND user_id = ?2
          AND content_id = ?3
        "#,
    )
    .bind(other_tenant.tenant_id)
    .bind(other_tenant.user_id)
    .bind(feed.id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(0, foreign_votes);

    let foreign_favorites = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT COUNT(1)
        FROM content_favorite
        WHERE tenant_id = ?1
          AND user_id = ?2
          AND content_id = ?3
        "#,
    )
    .bind(other_tenant.tenant_id)
    .bind(other_tenant.user_id)
    .bind(feed.id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(0, foreign_favorites);
}

fn owner_subject() -> ForumSubject {
    ForumSubject {
        tenant_id: 100_001,
        organization_id: 0,
        user_id: 30,
    }
}
