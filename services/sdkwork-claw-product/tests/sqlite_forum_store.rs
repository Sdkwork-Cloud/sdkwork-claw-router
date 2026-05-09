use sdkwork_claw_product::infrastructure::sql::installer::{
    DatabaseInstallOptions, DatabaseInstaller,
};
use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteForumStore;
use sdkwork_claw_product::ports::{
    CreateForumCommentCommand, CreateForumFeedCommand, ForumCommentCommandStore,
    ForumCommentReadStore, ForumFeedCommandStore, ForumFeedQuery, ForumFeedReadStore, ForumSubject,
};
use sqlx::sqlite::SqlitePoolOptions;

#[tokio::test]
async fn sqlite_forum_store_uses_java_plus_feeds_and_comments_contract() {
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
                images: vec!["https://cdn.sdkwork.com/forum/failover.png".to_owned()],
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
    assert_eq!(
        "https://cdn.sdkwork.com/forum/failover.png",
        feed.cover_image
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
        .load_feed_detail(feed.id.clone(), Some(subject))
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
                content_id: feed.id.parse::<i64>().unwrap(),
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
    assert_eq!(feed.id.parse::<i64>().unwrap(), comment.content_id);
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
                content_id: feed.id.parse::<i64>().unwrap(),
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
        .load_comments(
            "feeds".to_owned(),
            feed.id.parse::<i64>().unwrap(),
            None,
            Some(subject),
        )
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
        "detail reads must mirror Java app API and increment plus_feeds.view_count"
    );
}

fn owner_subject() -> ForumSubject {
    ForumSubject {
        tenant_id: 20_001,
        organization_id: 0,
        user_id: 30,
    }
}
