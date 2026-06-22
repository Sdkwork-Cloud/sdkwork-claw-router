use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_test_support::{
    app_session_config, app_session_dual_token_headers, trusted_request_subject,
    trusted_subject_config,
};
use sdkwork_clawrouter_router_service::application::EntityUuidGenerator;
use sdkwork_clawrouter_router_service::domain::{DomainError, DomainResult};
use sdkwork_clawrouter_router_service::ports::{
    CreateForumCommentCommand, CreateForumFeedCommand, ForumCommandFuture,
    ForumCommentCommandStore, ForumCommentDetail, ForumCommentItem, ForumCommentPage,
    ForumCommentReadStore, ForumCommentStatistics, ForumFeedCommandStore, ForumFeedItem,
    ForumFeedQuery, ForumFeedReadStore, ForumOverview, ForumOverviewSource, ForumOverviewStats,
    ForumReadFuture, ForumSubject,
};
use tower::ServiceExt;

#[tokio::test]
async fn app_api_forum_boundary_allows_public_reads_and_public_publishing_while_user_actions_need_subject(
) {
    let feed_store = Arc::new(TestForumStore);
    let comment_store = feed_store.clone();
    let router =
        sdkwork_clawrouter_app_api_server::app_forum_router_with_store_and_subject_boundary(
            feed_store.clone(),
            feed_store.clone(),
            comment_store.clone(),
            comment_store,
            trusted_subject_config().unwrap(),
            app_session_config().unwrap(),
            sdkwork_claw_config::RequestLimitsConfig::DEFAULT_FORUM_JSON_BODY_MAX_BYTES,
        );

    let public_list_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/content/feeds")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, public_list_response.status());

    let public_overview_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/content/feeds/overview")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, public_overview_response.status());

    let public_create_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/content/feeds")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"title":"Unauthorized post","content":"Write actions still require a subject."}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, public_create_response.status());

    let public_share_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/content/feeds/42/shares")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, public_share_response.status());

    let signed_create_response = router
        .clone()
        .oneshot(app_session_request(
            "POST",
            "/app/v3/api/content/feeds",
            Body::from(r#"{"title":"Signed post","content":"A signed forum write."}"#),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, signed_create_response.status());

    let signed_share_response = router
        .oneshot(app_session_request(
            "POST",
            "/app/v3/api/content/feeds/42/shares",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, signed_share_response.status());
}

struct TestForumStore;

impl ForumFeedReadStore for TestForumStore {
    fn load_feeds<'a>(
        &'a self,
        _query: ForumFeedQuery,
        subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, Vec<ForumFeedItem>> {
        Box::pin(async move {
            Ok(vec![ForumFeedItem {
                id: 42,
                title: if subject.is_some() {
                    "Signed forum feed".to_owned()
                } else {
                    "Public forum feed".to_owned()
                },
                content: "Forum reads should not require authorization.".to_owned(),
                summary: "Forum reads should not require authorization.".to_owned(),
                content_type: "feeds".to_owned(),
                category_id: 1001,
                created_at: "2026-05-11 10:00:00".to_owned(),
                updated_at: "2026-05-11 10:00:00".to_owned(),
                ..ForumFeedItem::default()
            }])
        })
    }

    fn load_feed_detail<'a>(
        &'a self,
        feed_id: i64,
        _subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, Option<ForumFeedItem>> {
        Box::pin(async move {
            Ok(Some(ForumFeedItem {
                id: feed_id,
                title: "Forum feed detail".to_owned(),
                content: "Forum detail reads should not require authorization.".to_owned(),
                summary: "Forum detail reads should not require authorization.".to_owned(),
                content_type: "feeds".to_owned(),
                category_id: 1001,
                ..ForumFeedItem::default()
            }))
        })
    }

    fn is_feed_collected<'a>(
        &'a self,
        _feed_id: i64,
        subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, bool> {
        Box::pin(async move { Ok(subject.is_some()) })
    }

    fn load_overview<'a>(
        &'a self,
        _subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, ForumOverview> {
        Box::pin(async {
            Ok(ForumOverview {
                stats: ForumOverviewStats {
                    total_posts: 1,
                    total_comments: 0,
                    member_count: 0,
                    online_members: 0,
                },
                source: ForumOverviewSource {
                    source_label: "Live forum data".to_owned(),
                    source_description:
                        "Derived from Java-compatible PlusFeeds, PlusComments, vote, and favorite tables."
                            .to_owned(),
                    source_tables: vec![
                        "content_forum_post".to_owned(),
                        "content_comment".to_owned(),
                        "content_reaction".to_owned(),
                        "content_favorite".to_owned(),
                    ],
                    observed_at: "2026-05-11 10:00:00".to_owned(),
                },
            })
        })
    }
}

impl ForumFeedCommandStore for TestForumStore {
    fn create_feed<'a>(
        &'a self,
        command: CreateForumFeedCommand,
        subject: Option<ForumSubject>,
    ) -> ForumCommandFuture<'a, ForumFeedItem> {
        Box::pin(async move {
            if subject.is_none()
                && (command.subject.tenant_id != 0
                    || command.subject.organization_id != 0
                    || command.subject.user_id != 0)
            {
                return Err(DomainError::new(
                    "public forum writes must use public subject",
                ));
            }
            Ok(ForumFeedItem {
                id: 43,
                title: command.title.unwrap_or_else(|| "Signed post".to_owned()),
                content: command.content,
                summary: "A signed forum write.".to_owned(),
                content_type: "feeds".to_owned(),
                category_id: command.category_id.unwrap_or_default(),
                ..ForumFeedItem::default()
            })
        })
    }

    fn delete_feed<'a>(
        &'a self,
        _feed_id: i64,
        _subject: ForumSubject,
    ) -> ForumCommandFuture<'a, bool> {
        Box::pin(async { Ok(true) })
    }

    fn like_feed<'a>(
        &'a self,
        feed_id: i64,
        _subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumFeedItem> {
        Box::pin(async move { Ok(feed_item(feed_id, 1, false)) })
    }

    fn unlike_feed<'a>(
        &'a self,
        feed_id: i64,
        _subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumFeedItem> {
        Box::pin(async move { Ok(feed_item(feed_id, 0, false)) })
    }

    fn collect_feed<'a>(
        &'a self,
        feed_id: i64,
        _folder_id: Option<i64>,
        _subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumFeedItem> {
        Box::pin(async move { Ok(feed_item(feed_id, 0, true)) })
    }

    fn uncollect_feed<'a>(
        &'a self,
        feed_id: i64,
        _subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumFeedItem> {
        Box::pin(async move { Ok(feed_item(feed_id, 0, false)) })
    }

    fn share_feed<'a>(
        &'a self,
        feed_id: i64,
        _subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumFeedItem> {
        Box::pin(async move {
            let mut item = feed_item(feed_id, 0, false);
            item.share_count = 1;
            Ok(item)
        })
    }
}

impl ForumCommentReadStore for TestForumStore {
    fn load_comments<'a>(
        &'a self,
        _content_type: String,
        _content_id: i64,
        _query: Option<ForumFeedQuery>,
        _subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, ForumCommentPage> {
        Box::pin(async { Ok(ForumCommentPage::default()) })
    }

    fn load_comment_replies<'a>(
        &'a self,
        _comment_id: i64,
        _query: Option<ForumFeedQuery>,
        _subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, ForumCommentPage> {
        Box::pin(async { Ok(ForumCommentPage::default()) })
    }

    fn load_comment_detail<'a>(
        &'a self,
        comment_id: i64,
        _subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, Option<ForumCommentDetail>> {
        Box::pin(async move {
            Ok(Some(ForumCommentDetail {
                comment_id: comment_id.to_string(),
                content: "Comment".to_owned(),
                content_type: "FEEDS".to_owned(),
                content_id: 42,
                status: "PUBLISHED".to_owned(),
                created_at: "2026-05-11 10:00:00".to_owned(),
                updated_at: "2026-05-11 10:00:00".to_owned(),
                ..ForumCommentDetail::default()
            }))
        })
    }

    fn load_my_comments<'a>(
        &'a self,
        _query: Option<ForumFeedQuery>,
        _subject: ForumSubject,
    ) -> ForumReadFuture<'a, ForumCommentPage> {
        Box::pin(async { Ok(ForumCommentPage::default()) })
    }

    fn load_comment_statistics<'a>(
        &'a self,
        _content_type: String,
        _content_id: i64,
        _subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, ForumCommentStatistics> {
        Box::pin(async { Ok(ForumCommentStatistics { total_comments: 0 }) })
    }
}

impl ForumCommentCommandStore for TestForumStore {
    fn create_comment<'a>(
        &'a self,
        command: CreateForumCommentCommand,
        _subject: Option<ForumSubject>,
    ) -> ForumCommandFuture<'a, ForumCommentItem> {
        Box::pin(async move {
            Ok(ForumCommentItem {
                comment_id: "100".to_owned(),
                content: command.content,
                content_type: command.content_type.to_ascii_uppercase(),
                content_id: command.content_id,
                status: "PUBLISHED".to_owned(),
                parent_id: command.parent_id,
                ..ForumCommentItem::default()
            })
        })
    }

    fn delete_comment<'a>(
        &'a self,
        _comment_id: i64,
        _subject: ForumSubject,
    ) -> ForumCommandFuture<'a, bool> {
        Box::pin(async { Ok(true) })
    }

    fn like_comment<'a>(
        &'a self,
        comment_id: i64,
        _subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumCommentItem> {
        Box::pin(async move { Ok(comment_item(comment_id, 1)) })
    }

    fn unlike_comment<'a>(
        &'a self,
        comment_id: i64,
        _subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumCommentItem> {
        Box::pin(async move { Ok(comment_item(comment_id, 0)) })
    }

    fn pin_comment<'a>(
        &'a self,
        comment_id: i64,
        _subject: ForumSubject,
        pinned: bool,
    ) -> ForumCommandFuture<'a, ForumCommentItem> {
        Box::pin(async move {
            let mut item = comment_item(comment_id, 0);
            item.is_top = pinned;
            Ok(item)
        })
    }
}

impl EntityUuidGenerator for TestForumStore {
    fn generate_entity_uuid(&self) -> DomainResult<String> {
        Ok("forum-route-test-uuid".to_owned())
    }
}

fn feed_item(id: i64, like_count: i64, is_collected: bool) -> ForumFeedItem {
    ForumFeedItem {
        id,
        title: "Forum feed".to_owned(),
        content: "Forum content".to_owned(),
        summary: "Forum content".to_owned(),
        content_type: "feeds".to_owned(),
        category_id: 1001,
        like_count,
        is_liked: like_count > 0,
        is_collected,
        ..ForumFeedItem::default()
    }
}

fn comment_item(id: i64, likes: i64) -> ForumCommentItem {
    ForumCommentItem {
        comment_id: id.to_string(),
        content: "Comment".to_owned(),
        content_type: "FEEDS".to_owned(),
        content_id: 42,
        status: "PUBLISHED".to_owned(),
        likes,
        ..ForumCommentItem::default()
    }
}

fn app_session_request(method: &str, path: &str, body: Body) -> Request<Body> {
    let issued_at = current_unix_seconds();
    let expires_at = issued_at + 3600;
    let (authorization, access_token) = app_session_dual_token_headers(
        trusted_request_subject(100_001, 0, 30),
        issued_at,
        expires_at,
    )
    .unwrap();
    Request::builder()
        .method(method)
        .uri(path)
        .header("content-type", "application/json")
        .header("authorization", authorization)
        .header("Access-Token", access_token)
        .body(body)
        .unwrap()
}

fn current_unix_seconds() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0)
}
