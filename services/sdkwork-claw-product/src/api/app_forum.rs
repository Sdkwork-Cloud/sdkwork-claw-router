use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Bytes;
use axum::extract::{Path, Query, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{delete, get, post};
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::Deserialize;
use serde::Serialize;
use serde_json::Value;

use crate::api::response::PlusApiResult;
use crate::application::EntityUuidGenerator;
use crate::domain::DomainError;
use crate::infrastructure::OsApiKeySecretGenerator;
use crate::ports::{
    CreateForumCommentCommand, CreateForumFeedCommand, ForumCommandFuture,
    ForumCommentCommandStore, ForumCommentItem, ForumCommentPage, ForumCommentReadStore,
    ForumCommentStatistics, ForumCommunityLink, ForumFeedCommandStore, ForumFeedItem,
    ForumFeedQuery, ForumFeedReadStore, ForumOverview, ForumOverviewSource, ForumOverviewStats,
    ForumReadFuture, ForumSubject,
};

const DEFAULT_FEED_PAGE_SIZE: i64 = 10;
const DEFAULT_COMMENT_PAGE_SIZE: i64 = 20;
const DEFAULT_REPLY_PAGE_SIZE: i64 = 10;
const DEFAULT_FEED_LIMIT: i64 = 10;
const DEFAULT_TOP_FEED_LIMIT: i64 = 5;
const MAX_PAGE_SIZE: i64 = 100;
const MAX_QUERY_TEXT_LEN: usize = 128;
const DEFAULT_JSON_BODY_MAX_BYTES: usize =
    sdkwork_claw_config::RequestLimitsConfig::DEFAULT_FORUM_JSON_BODY_MAX_BYTES;
const MAX_FEED_IMAGES: usize = 20;
const MAX_FEED_TAGS: usize = 20;
const MAX_FEED_TAG_LEN: usize = 64;
const MAX_COMMENT_CONTENT_LEN: usize = 20_000;
const MAX_COMMENT_DEVICE_INFO_LEN: usize = 512;
const ENV_FORUM_COMMUNITY_LINKS: &str = "SDKWORK_CLAW_FORUM_COMMUNITY_LINKS";

#[derive(Clone)]
struct AppForumState {
    feed_read_store: Arc<dyn ForumFeedReadStore + Send + Sync>,
    feed_command_store: Arc<dyn ForumFeedCommandStore + Send + Sync>,
    comment_read_store: Arc<dyn ForumCommentReadStore + Send + Sync>,
    comment_command_store: Arc<dyn ForumCommentCommandStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    community_links: Arc<Vec<ForumCommunityLink>>,
    require_subject: bool,
    json_body_max_bytes: usize,
}

#[derive(Debug, Deserialize)]
struct ForumFeedHttpQuery {
    #[serde(rename = "type")]
    type_: Option<String>,
    content_type: Option<String>,
    q: Option<String>,
    author_id: Option<i64>,
    page: Option<i64>,
    page_size: Option<i64>,
    limit: Option<i64>,
}

#[derive(Debug, Deserialize)]
struct CollectFeedQuery {
    folder_id: Option<i64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateFeedRequest {
    title: Option<String>,
    content: Option<String>,
    category_id: Option<i64>,
    images: Option<Vec<Value>>,
    tags: Option<Vec<String>>,
    source: Option<String>,
    source_url: Option<String>,
}

#[derive(Debug, Deserialize)]
struct ForumCommentHttpQuery {
    content_type: Option<String>,
    content_id: Option<i64>,
    page: Option<i64>,
    page_size: Option<i64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateCommentRequest {
    content_type: Option<String>,
    content_id: Option<i64>,
    content: String,
    device_info: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ReplyCommentRequest {
    content: String,
    device_info: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct ForumOverviewResponse {
    stats: ForumOverviewStats,
    community_links: Vec<ForumCommunityLink>,
    source: ForumOverviewSource,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ForumCommunityLinkConfig {
    id: String,
    label: String,
    url: String,
    qr_code: Option<Value>,
    tone: Option<String>,
}

struct EmptyForumFeedReadStore;
struct EmptyForumFeedCommandStore;
struct EmptyForumCommentReadStore;
struct EmptyForumCommentCommandStore;

impl ForumFeedReadStore for EmptyForumFeedReadStore {
    fn load_feeds<'a>(
        &'a self,
        _query: ForumFeedQuery,
        _subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, Vec<ForumFeedItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn load_feed_detail<'a>(
        &'a self,
        _feed_id: i64,
        _subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, Option<ForumFeedItem>> {
        Box::pin(async { Ok(None) })
    }

    fn is_feed_collected<'a>(
        &'a self,
        _feed_id: i64,
        _subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, bool> {
        Box::pin(async { Ok(false) })
    }

    fn load_overview<'a>(
        &'a self,
        _subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, ForumOverview> {
        Box::pin(async {
            Ok(ForumOverview {
                stats: ForumOverviewStats::default(),
                source: ForumOverviewSource {
                    source_label: "Live forum data".to_owned(),
                    source_description:
                        "Derived from PlusFeeds, PlusComments, vote, and favorite tables."
                            .to_owned(),
                    source_tables: vec![
                        "plus_feeds".to_owned(),
                        "plus_comments".to_owned(),
                        "plus_content_vote".to_owned(),
                        "plus_favorite".to_owned(),
                    ],
                    observed_at: current_timestamp_string(),
                },
            })
        })
    }
}

impl ForumFeedCommandStore for EmptyForumFeedCommandStore {
    fn create_feed<'a>(
        &'a self,
        _command: CreateForumFeedCommand,
        _subject: Option<ForumSubject>,
    ) -> ForumCommandFuture<'a, ForumFeedItem> {
        Box::pin(async { Err(unavailable("forum feed command store")) })
    }

    fn delete_feed<'a>(
        &'a self,
        _feed_id: i64,
        _subject: ForumSubject,
    ) -> ForumCommandFuture<'a, bool> {
        Box::pin(async { Err(unavailable("forum feed command store")) })
    }

    fn like_feed<'a>(
        &'a self,
        _feed_id: i64,
        _subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumFeedItem> {
        Box::pin(async { Err(unavailable("forum feed command store")) })
    }

    fn unlike_feed<'a>(
        &'a self,
        _feed_id: i64,
        _subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumFeedItem> {
        Box::pin(async { Err(unavailable("forum feed command store")) })
    }

    fn collect_feed<'a>(
        &'a self,
        _feed_id: i64,
        _folder_id: Option<i64>,
        _subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumFeedItem> {
        Box::pin(async { Err(unavailable("forum feed command store")) })
    }

    fn uncollect_feed<'a>(
        &'a self,
        _feed_id: i64,
        _subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumFeedItem> {
        Box::pin(async { Err(unavailable("forum feed command store")) })
    }

    fn share_feed<'a>(
        &'a self,
        _feed_id: i64,
        _subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumFeedItem> {
        Box::pin(async { Err(unavailable("forum feed command store")) })
    }
}

impl ForumCommentReadStore for EmptyForumCommentReadStore {
    fn load_comments<'a>(
        &'a self,
        _content_type: String,
        _content_id: i64,
        query: Option<ForumFeedQuery>,
        _subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, ForumCommentPage> {
        Box::pin(async move {
            let (page, size) = page_size_from_query(query.as_ref());
            Ok(ForumCommentPage {
                page,
                size,
                ..ForumCommentPage::default()
            })
        })
    }

    fn load_comment_replies<'a>(
        &'a self,
        _comment_id: i64,
        query: Option<ForumFeedQuery>,
        _subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, ForumCommentPage> {
        Box::pin(async move {
            let (page, size) = page_size_from_query(query.as_ref());
            Ok(ForumCommentPage {
                page,
                size,
                ..ForumCommentPage::default()
            })
        })
    }

    fn load_comment_detail<'a>(
        &'a self,
        _comment_id: i64,
        _subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, Option<crate::ports::ForumCommentDetail>> {
        Box::pin(async { Ok(None) })
    }

    fn load_my_comments<'a>(
        &'a self,
        query: Option<ForumFeedQuery>,
        _subject: ForumSubject,
    ) -> ForumReadFuture<'a, ForumCommentPage> {
        Box::pin(async move {
            let (page, size) = page_size_from_query(query.as_ref());
            Ok(ForumCommentPage {
                page,
                size,
                ..ForumCommentPage::default()
            })
        })
    }

    fn load_comment_statistics<'a>(
        &'a self,
        _content_type: String,
        _content_id: i64,
        _subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, ForumCommentStatistics> {
        Box::pin(async { Ok(ForumCommentStatistics::default()) })
    }
}

impl ForumCommentCommandStore for EmptyForumCommentCommandStore {
    fn create_comment<'a>(
        &'a self,
        _command: CreateForumCommentCommand,
        _subject: Option<ForumSubject>,
    ) -> ForumCommandFuture<'a, ForumCommentItem> {
        Box::pin(async { Err(unavailable("forum comment command store")) })
    }

    fn delete_comment<'a>(
        &'a self,
        _comment_id: i64,
        _subject: ForumSubject,
    ) -> ForumCommandFuture<'a, bool> {
        Box::pin(async { Err(unavailable("forum comment command store")) })
    }

    fn like_comment<'a>(
        &'a self,
        _comment_id: i64,
        _subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumCommentItem> {
        Box::pin(async { Err(unavailable("forum comment command store")) })
    }

    fn unlike_comment<'a>(
        &'a self,
        _comment_id: i64,
        _subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumCommentItem> {
        Box::pin(async { Err(unavailable("forum comment command store")) })
    }

    fn pin_comment<'a>(
        &'a self,
        _comment_id: i64,
        _subject: ForumSubject,
        _pinned: bool,
    ) -> ForumCommandFuture<'a, ForumCommentItem> {
        Box::pin(async { Err(unavailable("forum comment command store")) })
    }
}

pub fn app_forum_router() -> Router {
    let feed_read_store = Arc::new(EmptyForumFeedReadStore);
    let feed_command_store = Arc::new(EmptyForumFeedCommandStore);
    let comment_read_store = Arc::new(EmptyForumCommentReadStore);
    let comment_command_store = Arc::new(EmptyForumCommentCommandStore);
    app_forum_router_with_state(
        feed_read_store,
        feed_command_store,
        comment_read_store,
        comment_command_store,
        Arc::new(OsApiKeySecretGenerator),
        configured_forum_community_links(),
        false,
        DEFAULT_JSON_BODY_MAX_BYTES,
    )
}

pub fn app_forum_router_with_store(
    feed_read_store: Arc<dyn ForumFeedReadStore + Send + Sync>,
    feed_command_store: Arc<dyn ForumFeedCommandStore + Send + Sync>,
    comment_read_store: Arc<dyn ForumCommentReadStore + Send + Sync>,
    comment_command_store: Arc<dyn ForumCommentCommandStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    app_forum_router_with_store_community_links_and_json_body_limit(
        feed_read_store,
        feed_command_store,
        comment_read_store,
        comment_command_store,
        entity_uuid_generator,
        configured_forum_community_links(),
        DEFAULT_JSON_BODY_MAX_BYTES,
    )
}

pub fn app_forum_router_with_store_and_community_links(
    feed_read_store: Arc<dyn ForumFeedReadStore + Send + Sync>,
    feed_command_store: Arc<dyn ForumFeedCommandStore + Send + Sync>,
    comment_read_store: Arc<dyn ForumCommentReadStore + Send + Sync>,
    comment_command_store: Arc<dyn ForumCommentCommandStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    community_links: Vec<ForumCommunityLink>,
) -> Router {
    app_forum_router_with_store_community_links_and_json_body_limit(
        feed_read_store,
        feed_command_store,
        comment_read_store,
        comment_command_store,
        entity_uuid_generator,
        community_links,
        DEFAULT_JSON_BODY_MAX_BYTES,
    )
}

pub fn app_forum_router_with_store_community_links_and_json_body_limit(
    feed_read_store: Arc<dyn ForumFeedReadStore + Send + Sync>,
    feed_command_store: Arc<dyn ForumFeedCommandStore + Send + Sync>,
    comment_read_store: Arc<dyn ForumCommentReadStore + Send + Sync>,
    comment_command_store: Arc<dyn ForumCommentCommandStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    community_links: Vec<ForumCommunityLink>,
    json_body_max_bytes: usize,
) -> Router {
    app_forum_router_with_state(
        feed_read_store,
        feed_command_store,
        comment_read_store,
        comment_command_store,
        entity_uuid_generator,
        community_links,
        false,
        json_body_max_bytes,
    )
}

fn app_forum_router_with_state(
    feed_read_store: Arc<dyn ForumFeedReadStore + Send + Sync>,
    feed_command_store: Arc<dyn ForumFeedCommandStore + Send + Sync>,
    comment_read_store: Arc<dyn ForumCommentReadStore + Send + Sync>,
    comment_command_store: Arc<dyn ForumCommentCommandStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    community_links: Vec<ForumCommunityLink>,
    require_subject: bool,
    json_body_max_bytes: usize,
) -> Router {
    let community_links = Arc::new(community_links);
    Router::new()
        .route(
            "/app/v3/api/content/feeds/overview",
            get(fetch_forum_overview),
        )
        .route("/app/v3/api/content/feeds", get(fetch_feeds))
        .route("/app/v3/api/content/feeds/hot", get(fetch_hot_feeds))
        .route(
            "/app/v3/api/content/feeds/recommend",
            get(fetch_recommended_feeds),
        )
        .route("/app/v3/api/content/feeds/top", get(fetch_top_feeds))
        .route(
            "/app/v3/api/content/feeds/category/{categoryId}",
            get(fetch_category_feeds),
        )
        .route(
            "/app/v3/api/content/feeds/most_viewed",
            get(fetch_most_viewed_feeds),
        )
        .route(
            "/app/v3/api/content/feeds/most_liked",
            get(fetch_most_liked_feeds),
        )
        .route("/app/v3/api/content/feeds/{id}", get(fetch_feed_detail))
        .route(
            "/app/v3/api/content/feeds/{id}/collections/current",
            get(check_feed_collected),
        )
        .route("/app/v3/api/content/feeds", post(create_feed))
        .route("/app/v3/api/content/feeds/{id}", delete(delete_feed))
        .route("/app/v3/api/content/feeds/{id}/likes", post(like_feed))
        .route(
            "/app/v3/api/content/feeds/{id}/likes/current",
            delete(unlike_feed),
        )
        .route(
            "/app/v3/api/content/feeds/{id}/collections",
            post(collect_feed),
        )
        .route(
            "/app/v3/api/content/feeds/{id}/collections/current",
            delete(uncollect_feed),
        )
        .route("/app/v3/api/content/feeds/{id}/shares", post(share_feed))
        .route("/app/v3/api/content/comments", post(create_comment))
        .route("/app/v3/api/content/comments", get(fetch_comments))
        .route(
            "/app/v3/api/content/users/current/comments",
            get(fetch_my_comments),
        )
        .route(
            "/app/v3/api/content/comments/statistics",
            get(fetch_comment_statistics),
        )
        .route(
            "/app/v3/api/content/comments/{comment_id}/reply",
            post(reply_comment),
        )
        .route(
            "/app/v3/api/content/comments/{comment_id}/replies",
            get(fetch_comment_replies),
        )
        .route(
            "/app/v3/api/content/comments/{comment_id}",
            get(fetch_comment_detail),
        )
        .route(
            "/app/v3/api/content/comments/{comment_id}",
            delete(delete_comment),
        )
        .route(
            "/app/v3/api/content/comments/{comment_id}/likes",
            post(like_comment),
        )
        .route(
            "/app/v3/api/content/comments/{comment_id}/likes/current",
            delete(unlike_comment),
        )
        .route(
            "/app/v3/api/content/comments/{comment_id}/pins",
            post(pin_comment),
        )
        .route(
            "/app/v3/api/content/comments/{comment_id}/pins/current",
            delete(unpin_comment),
        )
        .with_state(AppForumState {
            feed_read_store,
            feed_command_store,
            comment_read_store,
            comment_command_store,
            entity_uuid_generator,
            community_links,
            require_subject,
            json_body_max_bytes: json_body_max_bytes.max(1),
        })
}

async fn fetch_forum_overview(State(state): State<AppForumState>, headers: HeaderMap) -> Response {
    let subject = match forum_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match state.feed_read_store.load_overview(subject).await {
        Ok(overview) => Json(PlusApiResult::success(ForumOverviewResponse {
            stats: overview.stats,
            community_links: state.community_links.as_ref().clone(),
            source: overview.source,
        }))
        .into_response(),
        Err(error) => forum_error("forum overview read model is unavailable", error),
    }
}

async fn fetch_feeds(
    State(state): State<AppForumState>,
    headers: HeaderMap,
    Query(query): Query<ForumFeedHttpQuery>,
) -> Response {
    fetch_feeds_with_query(state, headers, validate_feed_list_query(query)).await
}

async fn fetch_hot_feeds(
    State(state): State<AppForumState>,
    headers: HeaderMap,
    Query(query): Query<ForumFeedHttpQuery>,
) -> Response {
    fetch_feeds_with_query(
        state,
        headers,
        validate_feed_shortcut_query(query, "hot", DEFAULT_FEED_LIMIT),
    )
    .await
}

async fn fetch_recommended_feeds(
    State(state): State<AppForumState>,
    headers: HeaderMap,
    Query(query): Query<ForumFeedHttpQuery>,
) -> Response {
    fetch_feeds_with_query(
        state,
        headers,
        validate_feed_shortcut_query(query, "recommend", DEFAULT_FEED_LIMIT),
    )
    .await
}

async fn fetch_top_feeds(
    State(state): State<AppForumState>,
    headers: HeaderMap,
    Query(query): Query<ForumFeedHttpQuery>,
) -> Response {
    fetch_feeds_with_query(
        state,
        headers,
        validate_feed_shortcut_query(query, "top", DEFAULT_TOP_FEED_LIMIT),
    )
    .await
}

async fn fetch_most_viewed_feeds(
    State(state): State<AppForumState>,
    headers: HeaderMap,
    Query(query): Query<ForumFeedHttpQuery>,
) -> Response {
    fetch_feeds_with_query(
        state,
        headers,
        validate_feed_shortcut_query(query, "most_viewed", DEFAULT_FEED_LIMIT),
    )
    .await
}

async fn fetch_most_liked_feeds(
    State(state): State<AppForumState>,
    headers: HeaderMap,
    Query(query): Query<ForumFeedHttpQuery>,
) -> Response {
    fetch_feeds_with_query(
        state,
        headers,
        validate_feed_shortcut_query(query, "most_liked", DEFAULT_FEED_LIMIT),
    )
    .await
}

async fn fetch_category_feeds(
    State(state): State<AppForumState>,
    Path(category_id): Path<i64>,
    headers: HeaderMap,
    Query(query): Query<ForumFeedHttpQuery>,
) -> Response {
    fetch_feeds_with_query(
        state,
        headers,
        validate_feed_category_query(query, category_id),
    )
    .await
}

async fn fetch_feeds_with_query(
    state: AppForumState,
    headers: HeaderMap,
    query: Result<ForumFeedQuery, String>,
) -> Response {
    let subject = match forum_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = match query {
        Ok(query) => query,
        Err(message) => return bad_request(message),
    };
    match state.feed_read_store.load_feeds(query, subject).await {
        Ok(items) => Json(PlusApiResult::success(items)).into_response(),
        Err(error) => forum_error("forum feed read model is unavailable", error),
    }
}

async fn fetch_feed_detail(
    State(state): State<AppForumState>,
    Path(feed_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    let subject = match forum_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let feed_id = match feed_id.parse::<i64>() {
        Ok(feed_id) => match validate_positive_id(feed_id, "id") {
            Ok(feed_id) => feed_id,
            Err(message) => return bad_request(message),
        },
        Err(_) => return not_found("feed was not found"),
    };
    match state
        .feed_read_store
        .load_feed_detail(feed_id, subject)
        .await
    {
        Ok(Some(item)) => Json(PlusApiResult::success(item)).into_response(),
        Ok(None) => not_found("feed was not found"),
        Err(error) => forum_error("forum feed read model is unavailable", error),
    }
}

async fn check_feed_collected(
    State(state): State<AppForumState>,
    Path(feed_id): Path<i64>,
    headers: HeaderMap,
) -> Response {
    let feed_id = match validate_positive_id(feed_id, "id") {
        Ok(feed_id) => feed_id,
        Err(message) => return bad_request(message),
    };
    let subject = match forum_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match state
        .feed_read_store
        .is_feed_collected(feed_id, subject)
        .await
    {
        Ok(ok) => Json(PlusApiResult::success(ok)).into_response(),
        Err(error) => forum_error("forum feed read model is unavailable", error),
    }
}

async fn create_feed(
    State(state): State<AppForumState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let request_subject = match forum_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let subject = request_subject.unwrap_or_else(public_forum_subject);
    let request = match parse_json_body::<CreateFeedRequest>(
        &body,
        "feed request",
        state.json_body_max_bytes,
    ) {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let content = match normalize_required_text(request.content.clone(), "content", 2000) {
        Ok(content) => content,
        Err(message) => return bad_request(message),
    };
    let command = match build_create_feed_command(&state, subject, request, content) {
        Ok(command) => command,
        Err(message) => return bad_request(message),
    };
    feed_command_response(
        state
            .feed_command_store
            .create_feed(command, request_subject)
            .await,
    )
}

async fn delete_feed(
    State(state): State<AppForumState>,
    Path(feed_id): Path<i64>,
    headers: HeaderMap,
) -> Response {
    let feed_id = match validate_positive_id(feed_id, "id") {
        Ok(feed_id) => feed_id,
        Err(message) => return bad_request(message),
    };
    let subject = match required_forum_subject(&headers, state.require_subject, "delete feed") {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    boolean_command_response(state.feed_command_store.delete_feed(feed_id, subject).await)
}

async fn like_feed(
    State(state): State<AppForumState>,
    Path(feed_id): Path<i64>,
    headers: HeaderMap,
) -> Response {
    let feed_id = match validate_positive_id(feed_id, "id") {
        Ok(feed_id) => feed_id,
        Err(message) => return bad_request(message),
    };
    let subject = match required_forum_subject(&headers, state.require_subject, "like feed") {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    feed_command_response(state.feed_command_store.like_feed(feed_id, subject).await)
}

async fn unlike_feed(
    State(state): State<AppForumState>,
    Path(feed_id): Path<i64>,
    headers: HeaderMap,
) -> Response {
    let feed_id = match validate_positive_id(feed_id, "id") {
        Ok(feed_id) => feed_id,
        Err(message) => return bad_request(message),
    };
    let subject = match required_forum_subject(&headers, state.require_subject, "unlike feed") {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    feed_command_response(state.feed_command_store.unlike_feed(feed_id, subject).await)
}

async fn collect_feed(
    State(state): State<AppForumState>,
    Path(feed_id): Path<i64>,
    headers: HeaderMap,
    Query(query): Query<CollectFeedQuery>,
) -> Response {
    let feed_id = match validate_positive_id(feed_id, "id") {
        Ok(feed_id) => feed_id,
        Err(message) => return bad_request(message),
    };
    let subject = match required_forum_subject(&headers, state.require_subject, "collect feed") {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let folder_id = match validate_optional_positive(query.folder_id, "folder_id") {
        Ok(folder_id) => folder_id,
        Err(message) => return bad_request(message),
    };
    feed_command_response(
        state
            .feed_command_store
            .collect_feed(feed_id, folder_id, subject)
            .await,
    )
}

async fn uncollect_feed(
    State(state): State<AppForumState>,
    Path(feed_id): Path<i64>,
    headers: HeaderMap,
) -> Response {
    let feed_id = match validate_positive_id(feed_id, "id") {
        Ok(feed_id) => feed_id,
        Err(message) => return bad_request(message),
    };
    let subject = match required_forum_subject(&headers, state.require_subject, "uncollect feed") {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    feed_command_response(
        state
            .feed_command_store
            .uncollect_feed(feed_id, subject)
            .await,
    )
}

async fn share_feed(
    State(state): State<AppForumState>,
    Path(feed_id): Path<i64>,
    headers: HeaderMap,
) -> Response {
    let feed_id = match validate_positive_id(feed_id, "id") {
        Ok(feed_id) => feed_id,
        Err(message) => return bad_request(message),
    };
    let subject = match required_forum_subject(&headers, state.require_subject, "share feed") {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    feed_command_response(state.feed_command_store.share_feed(feed_id, subject).await)
}

async fn fetch_comments(
    State(state): State<AppForumState>,
    headers: HeaderMap,
    Query(query): Query<ForumCommentHttpQuery>,
) -> Response {
    let subject = match forum_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let (content_type, content_id, query) = match validate_comment_query(query) {
        Ok(value) => value,
        Err(message) => return bad_request(message),
    };
    match state
        .comment_read_store
        .load_comments(content_type, content_id, Some(query), subject)
        .await
    {
        Ok(page) => Json(PlusApiResult::success(page)).into_response(),
        Err(error) => forum_error("forum comment read model is unavailable", error),
    }
}

async fn fetch_comment_replies(
    State(state): State<AppForumState>,
    Path(comment_id): Path<i64>,
    headers: HeaderMap,
    Query(query): Query<ForumCommentHttpQuery>,
) -> Response {
    let comment_id = match validate_positive_id(comment_id, "commentId") {
        Ok(comment_id) => comment_id,
        Err(message) => return bad_request(message),
    };
    let subject = match forum_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = match validate_comment_page_query(query, DEFAULT_REPLY_PAGE_SIZE) {
        Ok(query) => query,
        Err(message) => return bad_request(message),
    };
    match state
        .comment_read_store
        .load_comment_replies(comment_id, Some(query), subject)
        .await
    {
        Ok(page) => Json(PlusApiResult::success(page)).into_response(),
        Err(error) => forum_error("forum comment read model is unavailable", error),
    }
}

async fn fetch_comment_detail(
    State(state): State<AppForumState>,
    Path(comment_id): Path<i64>,
    headers: HeaderMap,
) -> Response {
    let comment_id = match validate_positive_id(comment_id, "commentId") {
        Ok(comment_id) => comment_id,
        Err(message) => return bad_request(message),
    };
    let subject = match forum_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match state
        .comment_read_store
        .load_comment_detail(comment_id, subject)
        .await
    {
        Ok(Some(item)) => Json(PlusApiResult::success(item)).into_response(),
        Ok(None) => not_found("comment was not found"),
        Err(error) => forum_error("forum comment read model is unavailable", error),
    }
}

async fn fetch_my_comments(
    State(state): State<AppForumState>,
    headers: HeaderMap,
    Query(query): Query<ForumCommentHttpQuery>,
) -> Response {
    let subject = match required_forum_subject(&headers, state.require_subject, "my comments") {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = match validate_comment_page_query(query, DEFAULT_COMMENT_PAGE_SIZE) {
        Ok(query) => query,
        Err(message) => return bad_request(message),
    };
    match state
        .comment_read_store
        .load_my_comments(Some(query), subject)
        .await
    {
        Ok(page) => Json(PlusApiResult::success(page)).into_response(),
        Err(error) => forum_error("forum comment read model is unavailable", error),
    }
}

async fn fetch_comment_statistics(
    State(state): State<AppForumState>,
    headers: HeaderMap,
    Query(query): Query<ForumCommentHttpQuery>,
) -> Response {
    let subject = match forum_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let content_type = match normalize_comment_content_type(query.content_type) {
        Ok(value) => value,
        Err(message) => return bad_request(message),
    };
    let content_id = match query
        .content_id
        .ok_or_else(|| "content_id is required".to_owned())
        .and_then(|content_id| validate_positive_id(content_id, "content_id"))
    {
        Ok(content_id) => content_id,
        Err(message) => return bad_request(message),
    };
    match state
        .comment_read_store
        .load_comment_statistics(content_type, content_id, subject)
        .await
    {
        Ok(stats) => Json(PlusApiResult::success(stats)).into_response(),
        Err(error) => forum_error("forum comment read model is unavailable", error),
    }
}

async fn create_comment(
    State(state): State<AppForumState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let request_subject = match forum_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let subject = request_subject.unwrap_or_else(public_forum_subject);
    let request = match parse_json_body::<CreateCommentRequest>(
        &body,
        "comment request",
        state.json_body_max_bytes,
    ) {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let content_type = match normalize_comment_content_type(request.content_type) {
        Ok(content_type) => content_type,
        Err(message) => return bad_request(message),
    };
    let content_id = match request
        .content_id
        .ok_or_else(|| "contentId is required".to_owned())
        .and_then(|content_id| validate_positive_id(content_id, "contentId"))
    {
        Ok(content_id) => content_id,
        Err(message) => return bad_request(message),
    };
    create_comment_with_target(
        state,
        subject,
        request_subject,
        content_type,
        content_id,
        request.content,
        None,
        request.device_info,
        None,
    )
    .await
}

async fn reply_comment(
    State(state): State<AppForumState>,
    Path(comment_id): Path<i64>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let comment_id = match validate_positive_id(comment_id, "commentId") {
        Ok(comment_id) => comment_id,
        Err(message) => return bad_request(message),
    };
    let request_subject = match forum_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let subject = request_subject.unwrap_or_else(public_forum_subject);
    let request = match parse_json_body::<ReplyCommentRequest>(
        &body,
        "comment reply request",
        state.json_body_max_bytes,
    ) {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let parent = match state
        .comment_read_store
        .load_comment_detail(comment_id, Some(subject))
        .await
    {
        Ok(Some(parent)) => parent,
        Ok(None) => return not_found("parent comment was not found"),
        Err(error) => return forum_error("forum comment read model is unavailable", error),
    };
    create_comment_with_target(
        state,
        subject,
        request_subject,
        parent.content_type,
        parent.content_id,
        request.content,
        Some(comment_id),
        request.device_info,
        None,
    )
    .await
}

async fn create_comment_with_target(
    state: AppForumState,
    subject: ForumSubject,
    request_subject: Option<ForumSubject>,
    content_type: String,
    content_id: i64,
    content: String,
    parent_id: Option<i64>,
    device_info: Option<String>,
    ip_address: Option<String>,
) -> Response {
    let content_id = match validate_positive_id(content_id, "contentId") {
        Ok(content_id) => content_id,
        Err(message) => return bad_request(message),
    };
    let content_type = match normalize_comment_content_type(Some(content_type)) {
        Ok(content_type) => content_type,
        Err(message) => return bad_request(message),
    };
    let content = match normalize_required_text(Some(content), "content", MAX_COMMENT_CONTENT_LEN) {
        Ok(content) => content,
        Err(message) => return bad_request(message),
    };
    let device_info =
        match normalize_optional_text(device_info, "deviceInfo", MAX_COMMENT_DEVICE_INFO_LEN) {
            Ok(content) => content,
            Err(message) => return bad_request(message),
        };
    let uuid = match state.entity_uuid_generator.generate_entity_uuid() {
        Ok(uuid) => uuid,
        Err(error) => return forum_error("forum comment command is invalid", error),
    };
    let command = CreateForumCommentCommand {
        subject,
        uuid,
        content_type,
        content_id,
        content,
        parent_id,
        device_info,
        ip_address,
        requested_at: current_timestamp_string(),
    };
    comment_command_response(
        state
            .comment_command_store
            .create_comment(command, request_subject)
            .await,
    )
}

async fn delete_comment(
    State(state): State<AppForumState>,
    Path(comment_id): Path<i64>,
    headers: HeaderMap,
) -> Response {
    let comment_id = match validate_positive_id(comment_id, "commentId") {
        Ok(comment_id) => comment_id,
        Err(message) => return bad_request(message),
    };
    let subject = match required_forum_subject(&headers, state.require_subject, "delete comment") {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    void_command_response(
        state
            .comment_command_store
            .delete_comment(comment_id, subject)
            .await,
    )
}

async fn like_comment(
    State(state): State<AppForumState>,
    Path(comment_id): Path<i64>,
    headers: HeaderMap,
) -> Response {
    let comment_id = match validate_positive_id(comment_id, "commentId") {
        Ok(comment_id) => comment_id,
        Err(message) => return bad_request(message),
    };
    let subject = match required_forum_subject(&headers, state.require_subject, "like comment") {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    comment_command_response(
        state
            .comment_command_store
            .like_comment(comment_id, subject)
            .await,
    )
}

async fn unlike_comment(
    State(state): State<AppForumState>,
    Path(comment_id): Path<i64>,
    headers: HeaderMap,
) -> Response {
    let comment_id = match validate_positive_id(comment_id, "commentId") {
        Ok(comment_id) => comment_id,
        Err(message) => return bad_request(message),
    };
    let subject = match required_forum_subject(&headers, state.require_subject, "unlike comment") {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    comment_command_response(
        state
            .comment_command_store
            .unlike_comment(comment_id, subject)
            .await,
    )
}

async fn pin_comment(
    State(state): State<AppForumState>,
    Path(comment_id): Path<i64>,
    headers: HeaderMap,
) -> Response {
    set_comment_pin(state, comment_id, headers, true).await
}

async fn unpin_comment(
    State(state): State<AppForumState>,
    Path(comment_id): Path<i64>,
    headers: HeaderMap,
) -> Response {
    set_comment_pin(state, comment_id, headers, false).await
}

async fn set_comment_pin(
    state: AppForumState,
    comment_id: i64,
    headers: HeaderMap,
    pinned: bool,
) -> Response {
    let comment_id = match validate_positive_id(comment_id, "commentId") {
        Ok(comment_id) => comment_id,
        Err(message) => return bad_request(message),
    };
    let subject = match required_forum_subject(&headers, state.require_subject, "pin comment") {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    comment_command_response(
        state
            .comment_command_store
            .pin_comment(comment_id, subject, pinned)
            .await,
    )
}

fn build_create_feed_command(
    state: &AppForumState,
    subject: ForumSubject,
    request: CreateFeedRequest,
    content: String,
) -> Result<CreateForumFeedCommand, String> {
    let category_id = match request.category_id {
        Some(category_id) if category_id < 0 => {
            return Err("categoryId must be greater than or equal to 0".to_owned());
        }
        value => value,
    };
    Ok(CreateForumFeedCommand {
        subject,
        uuid: state
            .entity_uuid_generator
            .generate_entity_uuid()
            .map_err(|error| error.to_string())?,
        title: normalize_optional_text(request.title, "title", 255)?,
        content,
        category_id,
        images: normalize_optional_media_resource_list(request.images, "images", MAX_FEED_IMAGES)?,
        tags: normalize_optional_text_list(
            request.tags,
            "tags",
            "tag",
            MAX_FEED_TAGS,
            MAX_FEED_TAG_LEN,
        )?,
        source: normalize_optional_text(request.source, "source", 100)?,
        source_url: normalize_optional_text(request.source_url, "sourceUrl", 500)?,
        requested_at: current_timestamp_string(),
    })
}

fn validate_feed_list_query(query: ForumFeedHttpQuery) -> Result<ForumFeedQuery, String> {
    let page = validate_optional_positive(query.page, "page")?;
    let size = validate_optional_positive(query.page_size, "page_size")?;
    if size.unwrap_or(1) > MAX_PAGE_SIZE {
        return Err(format!("page_size must be at most {MAX_PAGE_SIZE}"));
    }
    let feed_type = normalize_feed_type(query.type_)?;
    let content_type = normalize_feed_content_type(query.content_type)?;
    Ok(ForumFeedQuery {
        feed_type: Some(feed_type),
        content_type: Some(content_type),
        keyword: normalize_optional_text(query.q, "q", MAX_QUERY_TEXT_LEN)?,
        author_id: query.author_id,
        page: Some(page.unwrap_or(1)),
        size: Some(size.unwrap_or(DEFAULT_FEED_PAGE_SIZE)),
        ..ForumFeedQuery::default()
    })
}

fn normalize_feed_type(value: Option<String>) -> Result<String, String> {
    let value =
        normalize_optional_text(value, "type", 64)?.unwrap_or_else(|| "recommend".to_owned());
    match value.as_str() {
        "recommend" | "hot" | "top" => Ok(value),
        _ => Err("type must be recommend, hot, or top".to_owned()),
    }
}

fn normalize_feed_content_type(value: Option<String>) -> Result<String, String> {
    let value =
        normalize_optional_text(value, "content_type", 64)?.unwrap_or_else(|| "all".to_owned());
    match value.as_str() {
        "all" | "feeds" | "FEEDS" => Ok(value),
        _ => Err("content_type must be all or feeds".to_owned()),
    }
}

fn validate_feed_shortcut_query(
    query: ForumFeedHttpQuery,
    feed_type: &str,
    default_limit: i64,
) -> Result<ForumFeedQuery, String> {
    let limit = validate_optional_positive(query.limit, "limit")?.unwrap_or(default_limit);
    if limit > MAX_PAGE_SIZE {
        return Err(format!("limit must be at most {MAX_PAGE_SIZE}"));
    }
    Ok(ForumFeedQuery {
        feed_type: Some(feed_type.to_owned()),
        page: Some(1),
        size: Some(limit),
        limit: Some(limit),
        ..ForumFeedQuery::default()
    })
}

fn validate_feed_category_query(
    query: ForumFeedHttpQuery,
    category_id: i64,
) -> Result<ForumFeedQuery, String> {
    let category_id = validate_positive_id(category_id, "categoryId")?;
    let page = validate_optional_positive(query.page, "page")?;
    let size = validate_optional_positive(query.page_size, "page_size")?;
    if size.unwrap_or(1) > MAX_PAGE_SIZE {
        return Err(format!("page_size must be at most {MAX_PAGE_SIZE}"));
    }
    Ok(ForumFeedQuery {
        category_id: Some(category_id),
        page: Some(page.unwrap_or(1)),
        size: Some(size.unwrap_or(DEFAULT_FEED_PAGE_SIZE)),
        ..ForumFeedQuery::default()
    })
}

fn validate_comment_query(
    query: ForumCommentHttpQuery,
) -> Result<(String, i64, ForumFeedQuery), String> {
    let content_type = normalize_comment_content_type(query.content_type.clone())?;
    let content_id = query
        .content_id
        .ok_or_else(|| "content_id is required".to_owned())
        .and_then(|content_id| validate_positive_id(content_id, "content_id"))?;
    let query = validate_comment_page_query(query, DEFAULT_COMMENT_PAGE_SIZE)?;
    Ok((content_type, content_id, query))
}

fn normalize_comment_content_type(value: Option<String>) -> Result<String, String> {
    let value = normalize_required_text(value, "content_type", 64)?;
    match value.as_str() {
        "feeds" | "comments" | "course" | "courses" | "FEEDS" | "COMMENTS" | "COURSE"
        | "COURSES" => Ok(value),
        _ => Err("content_type must be feeds, comments, or course".to_owned()),
    }
}

fn validate_comment_page_query(
    query: ForumCommentHttpQuery,
    default_size: i64,
) -> Result<ForumFeedQuery, String> {
    let page = validate_optional_positive(query.page, "page")?;
    let size = validate_optional_positive(query.page_size, "page_size")?;
    if size.unwrap_or(1) > MAX_PAGE_SIZE {
        return Err(format!("page_size must be at most {MAX_PAGE_SIZE}"));
    }
    Ok(ForumFeedQuery {
        page: Some(page.unwrap_or(1)),
        size: Some(size.unwrap_or(default_size)),
        ..ForumFeedQuery::default()
    })
}

fn page_size_from_query(query: Option<&ForumFeedQuery>) -> (i64, i64) {
    (
        query.and_then(|query| query.page).unwrap_or(1),
        query
            .and_then(|query| query.size)
            .unwrap_or(DEFAULT_COMMENT_PAGE_SIZE),
    )
}

fn forum_subject(
    headers: &HeaderMap,
    require_subject: bool,
) -> Result<Option<ForumSubject>, Response> {
    match TrustedRequestSubject::from_headers(headers) {
        Ok(subject) => Ok(Some(ForumSubject {
            tenant_id: subject.tenant_id,
            organization_id: subject.organization_id,
            user_id: subject.user_id,
        })),
        Err(error) if require_subject => Err((
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error("4010", error.to_string())),
        )
            .into_response()),
        Err(_) => Ok(None),
    }
}

fn required_forum_subject(
    headers: &HeaderMap,
    require_subject: bool,
    action: &str,
) -> Result<ForumSubject, Response> {
    match forum_subject(headers, require_subject)? {
        Some(subject) => Ok(subject),
        None => Err((
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error(
                "4010",
                format!("trusted request subject is required to {action}"),
            )),
        )
            .into_response()),
    }
}

fn public_forum_subject() -> ForumSubject {
    ForumSubject {
        tenant_id: 0,
        organization_id: 0,
        user_id: 0,
    }
}

pub fn configured_forum_community_links() -> Vec<ForumCommunityLink> {
    let runtime_toml = sdkwork_claw_config::RuntimeTomlConfig::from_env_config_file()
        .ok()
        .flatten();
    let raw = match sdkwork_claw_config::runtime::config_secret_value(
        ENV_FORUM_COMMUNITY_LINKS,
        "SDKWORK_CLAW_FORUM_COMMUNITY_LINKS_FILE",
        runtime_toml
            .as_ref()
            .and_then(|config| config.forum.community_links_json.as_deref()),
        runtime_toml
            .as_ref()
            .and_then(|config| config.forum.community_links_json_file.as_deref()),
    ) {
        Ok(Some(raw)) => raw,
        Ok(None) | Err(_) => return Vec::new(),
    };
    parse_forum_community_links_config(&raw)
}

pub fn parse_forum_community_links_config(raw: &str) -> Vec<ForumCommunityLink> {
    serde_json::from_str::<Vec<ForumCommunityLinkConfig>>(raw)
        .ok()
        .unwrap_or_default()
        .into_iter()
        .filter_map(normalize_community_link)
        .collect()
}

fn normalize_community_link(item: ForumCommunityLinkConfig) -> Option<ForumCommunityLink> {
    let id = normalize_optional_text(Some(item.id), "id", 64)
        .ok()
        .flatten()?;
    let label = normalize_optional_text(Some(item.label), "label", 128)
        .ok()
        .flatten()?;
    let url = normalize_public_url(item.url)?;
    let qr_code = item.qr_code.and_then(normalize_community_link_qr_code);
    let tone = normalize_optional_text(item.tone, "tone", 32)
        .ok()
        .flatten()
        .filter(|value| matches!(value.as_str(), "green" | "blue" | "teal" | "red" | "pink"))
        .unwrap_or_else(|| "blue".to_owned());
    Some(ForumCommunityLink {
        id,
        label,
        url,
        qr_code,
        tone,
    })
}

fn normalize_community_link_qr_code(value: Value) -> Option<Value> {
    let value = normalize_media_resource(value, "qrCode").ok()?;
    if media_resource_uses_only_public_urls(&value) {
        Some(value)
    } else {
        None
    }
}

fn media_resource_uses_only_public_urls(value: &Value) -> bool {
    let Some(record) = value.as_object() else {
        return false;
    };
    for key in ["publicUrl", "url"] {
        let Some(raw) = record.get(key).and_then(Value::as_str) else {
            continue;
        };
        if normalize_public_url(raw.to_owned()).is_none() {
            return false;
        }
    }
    if let Some(raw) = record.get("uri").and_then(Value::as_str) {
        let trimmed = raw.trim();
        if (trimmed.starts_with("http://") || trimmed.starts_with("https://"))
            && normalize_public_url(trimmed.to_owned()).is_none()
        {
            return false;
        }
    }
    true
}

fn normalize_public_url(value: String) -> Option<String> {
    let value = normalize_optional_text(Some(value), "url", 2048)
        .ok()
        .flatten()?;
    if value.chars().any(char::is_whitespace) {
        return None;
    }
    let (scheme, remainder) = value.split_once("://")?;
    if !scheme.eq_ignore_ascii_case("https") && !scheme.eq_ignore_ascii_case("http") {
        return None;
    }
    let host_port_path = remainder.split(['/', '?', '#']).next().unwrap_or_default();
    let host = public_authority_host(host_port_path)?;
    if !is_public_host(host) {
        return None;
    }
    Some(value)
}

fn public_authority_host(authority: &str) -> Option<&str> {
    if authority.is_empty() || authority.contains('@') {
        return None;
    }

    if authority.starts_with('[') {
        let closing_bracket = authority.find(']')?;
        let host = &authority[1..closing_bracket];
        let port_suffix = &authority[closing_bracket + 1..];
        if !is_valid_optional_port_suffix(port_suffix) {
            return None;
        }
        return Some(host);
    }

    if authority.contains('[') || authority.contains(']') {
        return None;
    }

    match authority.split_once(':') {
        Some((host, port)) => {
            if port.contains(':') || !is_valid_public_port(port) {
                return None;
            }
            Some(host)
        }
        None => {
            if authority.contains(':') {
                return None;
            }
            Some(authority)
        }
    }
}

fn is_valid_optional_port_suffix(value: &str) -> bool {
    if value.is_empty() {
        return true;
    }
    let Some(port) = value.strip_prefix(':') else {
        return false;
    };
    is_valid_public_port(port)
}

fn is_valid_public_port(value: &str) -> bool {
    !value.is_empty()
        && value.chars().all(|ch| ch.is_ascii_digit())
        && value.parse::<u16>().map(|port| port > 0).unwrap_or(false)
}

fn is_public_host(host: &str) -> bool {
    let host = host.trim_end_matches('.').to_ascii_lowercase();
    if host.is_empty()
        || host.len() > 253
        || host == "localhost"
        || host.ends_with(".localhost")
        || host.ends_with(".local")
        || host.ends_with(".internal")
    {
        return false;
    }
    if host.parse::<std::net::IpAddr>().is_ok() {
        return false;
    }
    let labels = host.split('.').collect::<Vec<_>>();
    labels.len() >= 2
        && labels.iter().all(|label| is_public_dns_label(label))
        && labels
            .last()
            .map(|label| label.chars().any(|ch| ch.is_ascii_alphabetic()))
            .unwrap_or(false)
}

fn is_public_dns_label(label: &str) -> bool {
    let Some(first) = label.as_bytes().first() else {
        return false;
    };
    let Some(last) = label.as_bytes().last() else {
        return false;
    };
    label.len() <= 63
        && first.is_ascii_alphanumeric()
        && last.is_ascii_alphanumeric()
        && label
            .chars()
            .all(|ch| ch.is_ascii_alphanumeric() || ch == '-')
}

fn parse_json_body<T>(body: &[u8], name: &str, max_bytes: usize) -> Result<T, String>
where
    T: for<'de> Deserialize<'de>,
{
    if body.len() > max_bytes {
        return Err(format!("{name} body must be at most {max_bytes} bytes"));
    }
    serde_json::from_slice::<T>(body).map_err(|error| format!("invalid {name} body: {error}"))
}

fn normalize_required_text(
    value: Option<String>,
    field: &str,
    max_len: usize,
) -> Result<String, String> {
    normalize_optional_text(value, field, max_len)?.ok_or_else(|| format!("{field} is required"))
}

fn normalize_optional_text(
    value: Option<String>,
    field: &str,
    max_len: usize,
) -> Result<Option<String>, String> {
    let Some(value) = value else {
        return Ok(None);
    };
    let value = value.split_whitespace().collect::<Vec<_>>().join(" ");
    if value.is_empty() {
        return Ok(None);
    }
    if value.chars().count() > max_len {
        return Err(format!("{field} must be at most {max_len} characters"));
    }
    if value.chars().any(char::is_control) {
        return Err(format!("{field} must not contain control characters"));
    }
    Ok(Some(value))
}

fn normalize_optional_text_list(
    values: Option<Vec<String>>,
    list_field: &str,
    item_field: &str,
    max_items: usize,
    max_len: usize,
) -> Result<Vec<String>, String> {
    let values = values.unwrap_or_default();
    if values.len() > max_items {
        return Err(format!(
            "{list_field} must contain at most {max_items} items"
        ));
    }
    values
        .into_iter()
        .filter_map(|value| normalize_optional_text(Some(value), item_field, max_len).transpose())
        .collect()
}

fn normalize_optional_media_resource_list(
    values: Option<Vec<Value>>,
    field: &str,
    max_items: usize,
) -> Result<Vec<Value>, String> {
    let values = values.unwrap_or_default();
    if values.len() > max_items {
        return Err(format!("{field} must contain at most {max_items} items"));
    }
    values
        .into_iter()
        .map(|value| normalize_media_resource(value, &format!("{field} item")))
        .collect()
}

fn normalize_media_resource(value: Value, field: &str) -> Result<Value, String> {
    let Some(record) = value.as_object() else {
        return Err(format!("{field} must be a MediaResource object"));
    };
    let kind = record
        .get("kind")
        .and_then(Value::as_str)
        .map(str::trim)
        .unwrap_or_default();
    let source = record
        .get("source")
        .and_then(Value::as_str)
        .map(str::trim)
        .unwrap_or_default();
    if kind.is_empty() || source.is_empty() {
        return Err(format!(
            "{field} must include MediaResource kind and source"
        ));
    }
    let has_locator = ["id", "publicUrl", "url", "uri", "objectKey", "objectBlobId"]
        .iter()
        .any(|key| {
            record
                .get(*key)
                .and_then(Value::as_str)
                .map(str::trim)
                .is_some_and(|value| !value.is_empty())
        });
    if !has_locator {
        return Err(format!("{field} must include a media resource locator"));
    }
    Ok(Value::Object(record.clone()))
}

fn validate_optional_positive(value: Option<i64>, field: &str) -> Result<Option<i64>, String> {
    match value {
        Some(value) if value <= 0 => Err(format!("{field} must be a positive integer")),
        value => Ok(value),
    }
}

fn validate_positive_id(value: i64, field: &str) -> Result<i64, String> {
    if value > 0 {
        Ok(value)
    } else {
        Err(format!("{field} must be a positive integer"))
    }
}

fn feed_command_response(result: Result<ForumFeedItem, DomainError>) -> Response {
    match result {
        Ok(item) => Json(PlusApiResult::success(item)).into_response(),
        Err(error) if error.is_not_found() => not_found(&error.to_string()),
        Err(error) if error.is_conflict() => conflict(&error.to_string()),
        Err(error) => forum_error("forum feed command store is unavailable", error),
    }
}

fn comment_command_response(result: Result<ForumCommentItem, DomainError>) -> Response {
    match result {
        Ok(item) => Json(PlusApiResult::success(item)).into_response(),
        Err(error) if error.is_not_found() => not_found(&error.to_string()),
        Err(error) if error.is_conflict() => conflict(&error.to_string()),
        Err(error) => forum_error("forum comment command store is unavailable", error),
    }
}

fn boolean_command_response(result: Result<bool, DomainError>) -> Response {
    match result {
        Ok(ok) => Json(PlusApiResult::success(ok)).into_response(),
        Err(error) if error.is_not_found() => not_found(&error.to_string()),
        Err(error) if error.is_conflict() => conflict(&error.to_string()),
        Err(error) => forum_error("forum command store is unavailable", error),
    }
}

fn void_command_response(result: Result<bool, DomainError>) -> Response {
    match result {
        Ok(true) => Json(PlusApiResult::success(())).into_response(),
        Ok(false) => not_found("resource was not found"),
        Err(error) if error.is_not_found() => not_found(&error.to_string()),
        Err(error) if error.is_conflict() => conflict(&error.to_string()),
        Err(error) => forum_error("forum command store is unavailable", error),
    }
}

fn bad_request(message: String) -> Response {
    (
        StatusCode::BAD_REQUEST,
        Json(PlusApiResult::error("4001", message)),
    )
        .into_response()
}

fn not_found(message: &str) -> Response {
    (
        StatusCode::NOT_FOUND,
        Json(PlusApiResult::error("4004", message)),
    )
        .into_response()
}

fn conflict(message: &str) -> Response {
    (
        StatusCode::CONFLICT,
        Json(PlusApiResult::error("4090", message.to_owned())),
    )
        .into_response()
}

fn forum_error(context: &str, error: impl std::fmt::Display) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error("5000", format!("{context}: {error}"))),
    )
        .into_response()
}

fn unavailable(name: &str) -> DomainError {
    DomainError::new(format!(
        "{name} is unavailable without database configuration"
    ))
}

fn current_timestamp_string() -> String {
    let seconds = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0);
    format_unix_timestamp(seconds)
}

fn format_unix_timestamp(seconds: i64) -> String {
    let days = seconds.div_euclid(86_400);
    let seconds_of_day = seconds.rem_euclid(86_400);
    let (year, month, day) = civil_from_days(days);
    let hour = seconds_of_day / 3_600;
    let minute = (seconds_of_day % 3_600) / 60;
    let second = seconds_of_day % 60;
    format!("{year:04}-{month:02}-{day:02} {hour:02}:{minute:02}:{second:02}")
}

fn civil_from_days(days: i64) -> (i64, i64, i64) {
    let days = days + 719_468;
    let era = if days >= 0 { days } else { days - 146_096 } / 146_097;
    let day_of_era = days - era * 146_097;
    let year_of_era =
        (day_of_era - day_of_era / 1_460 + day_of_era / 36_524 - day_of_era / 146_096) / 365;
    let year = year_of_era + era * 400;
    let day_of_year = day_of_era - (365 * year_of_era + year_of_era / 4 - year_of_era / 100);
    let month_prime = (5 * day_of_year + 2) / 153;
    let day = day_of_year - (153 * month_prime + 2) / 5 + 1;
    let month = month_prime + if month_prime < 10 { 3 } else { -9 };
    let year = year + if month <= 2 { 1 } else { 0 };
    (year, month, day)
}
