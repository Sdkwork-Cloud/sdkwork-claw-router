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

use crate::api::response::PlusApiResult;
use crate::application::EntityUuidGenerator;
use crate::domain::DomainError;
use crate::infrastructure::OsApiKeySecretGenerator;
use crate::ports::{
    CreateForumCommentCommand, CreateForumFeedCommand, ForumBooleanResult, ForumCommandFuture,
    ForumCommentCommandStore, ForumCommentItem, ForumCommentPage, ForumCommentReadStore,
    ForumCommentStatistics, ForumFeedCommandStore, ForumFeedItem, ForumFeedQuery,
    ForumFeedReadStore, ForumReadFuture, ForumSubject,
};

const DEFAULT_PAGE_SIZE: i64 = 20;
const MAX_PAGE_SIZE: i64 = 100;
const MAX_QUERY_TEXT_LEN: usize = 128;
const MAX_FORUM_BODY_BYTES: usize = 256 * 1024;

#[derive(Clone)]
struct AppForumState {
    feed_read_store: Arc<dyn ForumFeedReadStore + Send + Sync>,
    feed_command_store: Arc<dyn ForumFeedCommandStore + Send + Sync>,
    comment_read_store: Arc<dyn ForumCommentReadStore + Send + Sync>,
    comment_command_store: Arc<dyn ForumCommentCommandStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    require_subject: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ForumFeedHttpQuery {
    feed_type: Option<String>,
    #[serde(alias = "type")]
    content_type: Option<String>,
    keyword: Option<String>,
    author_id: Option<i64>,
    category_id: Option<i64>,
    page: Option<i64>,
    page_no: Option<i64>,
    size: Option<i64>,
    page_size: Option<i64>,
    limit: Option<i64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateFeedRequest {
    title: Option<String>,
    content: Option<String>,
    summary: Option<String>,
    category_id: Option<i64>,
    images: Option<Vec<String>>,
    tags: Option<Vec<String>>,
    source: Option<String>,
    source_url: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ForumCommentHttpQuery {
    content_type: Option<String>,
    content_id: Option<i64>,
    page: Option<i64>,
    page_no: Option<i64>,
    size: Option<i64>,
    page_size: Option<i64>,
    limit: Option<i64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateCommentRequest {
    content_type: Option<String>,
    content_id: Option<i64>,
    content: String,
    parent_id: Option<i64>,
    device_info: Option<String>,
    ip_address: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CollectFeedRequest {
    folder_id: Option<i64>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct ForumFeedItems {
    items: Vec<ForumFeedItem>,
    content: Vec<ForumFeedItem>,
    total_elements: i64,
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
        _feed_id: String,
        _subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, Option<ForumFeedItem>> {
        Box::pin(async { Ok(None) })
    }

    fn load_feed_categories<'a>(
        &'a self,
        _subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, Vec<String>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn is_feed_collected<'a>(
        &'a self,
        _feed_id: i64,
        _subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, bool> {
        Box::pin(async { Ok(false) })
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
        _subject: Option<ForumSubject>,
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
        false,
    )
}

pub fn app_forum_router_with_store(
    feed_read_store: Arc<dyn ForumFeedReadStore + Send + Sync>,
    feed_command_store: Arc<dyn ForumFeedCommandStore + Send + Sync>,
    comment_read_store: Arc<dyn ForumCommentReadStore + Send + Sync>,
    comment_command_store: Arc<dyn ForumCommentCommandStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    app_forum_router_with_state(
        feed_read_store,
        feed_command_store,
        comment_read_store,
        comment_command_store,
        entity_uuid_generator,
        true,
    )
}

fn app_forum_router_with_state(
    feed_read_store: Arc<dyn ForumFeedReadStore + Send + Sync>,
    feed_command_store: Arc<dyn ForumFeedCommandStore + Send + Sync>,
    comment_read_store: Arc<dyn ForumCommentReadStore + Send + Sync>,
    comment_command_store: Arc<dyn ForumCommentCommandStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route("/app/v3/api/feeds/list", get(fetch_feeds))
        .route("/app/v3/api/feeds/hot", get(fetch_hot_feeds))
        .route("/app/v3/api/feeds/recommend", get(fetch_recommended_feeds))
        .route("/app/v3/api/feeds/search", get(fetch_search_feeds))
        .route("/app/v3/api/feeds/top", get(fetch_top_feeds))
        .route(
            "/app/v3/api/feeds/category/{category_id}",
            get(fetch_category_feeds),
        )
        .route(
            "/app/v3/api/feeds/most-viewed",
            get(fetch_most_viewed_feeds),
        )
        .route("/app/v3/api/feeds/most-liked", get(fetch_most_liked_feeds))
        .route("/app/v3/api/feeds/categories", get(fetch_feed_categories))
        .route("/app/v3/api/feeds/detail/{feed_id}", get(fetch_feed_detail))
        .route(
            "/app/v3/api/feeds/check-collected/{feed_id}",
            get(check_feed_collected),
        )
        .route("/app/v3/api/feeds", post(create_feed))
        .route("/app/v3/api/feeds/{feed_id}", delete(delete_feed))
        .route("/app/v3/api/feeds/like/{feed_id}", post(like_feed))
        .route("/app/v3/api/feeds/unlike/{feed_id}", post(unlike_feed))
        .route("/app/v3/api/feeds/collect/{feed_id}", post(collect_feed))
        .route(
            "/app/v3/api/feeds/uncollect/{feed_id}",
            post(uncollect_feed),
        )
        .route("/app/v3/api/feeds/share/{feed_id}", post(share_feed))
        .route("/app/v3/api/comments", post(create_comment))
        .route("/app/v3/api/comments/list", get(fetch_comments))
        .route("/app/v3/api/comments/my", get(fetch_my_comments))
        .route(
            "/app/v3/api/comments/statistics",
            get(fetch_comment_statistics),
        )
        .route(
            "/app/v3/api/comments/{comment_id}/reply",
            post(reply_comment),
        )
        .route(
            "/app/v3/api/comments/{comment_id}/replies",
            get(fetch_comment_replies),
        )
        .route(
            "/app/v3/api/comments/{comment_id}",
            get(fetch_comment_detail),
        )
        .route("/app/v3/api/comments/{comment_id}", delete(delete_comment))
        .route("/app/v3/api/comments/{comment_id}/like", post(like_comment))
        .route(
            "/app/v3/api/comments/{comment_id}/like",
            delete(unlike_comment),
        )
        .route("/app/v3/api/comments/{comment_id}/pin", post(pin_comment))
        .route(
            "/app/v3/api/comments/{comment_id}/pin",
            delete(unpin_comment),
        )
        .with_state(AppForumState {
            feed_read_store,
            feed_command_store,
            comment_read_store,
            comment_command_store,
            entity_uuid_generator,
            require_subject,
        })
}

async fn fetch_feeds(
    State(state): State<AppForumState>,
    headers: HeaderMap,
    Query(query): Query<ForumFeedHttpQuery>,
) -> Response {
    fetch_feeds_with_type(state, headers, query, None, None).await
}

async fn fetch_hot_feeds(
    State(state): State<AppForumState>,
    headers: HeaderMap,
    Query(query): Query<ForumFeedHttpQuery>,
) -> Response {
    fetch_feeds_with_type(state, headers, query, Some("hot"), None).await
}

async fn fetch_recommended_feeds(
    State(state): State<AppForumState>,
    headers: HeaderMap,
    Query(query): Query<ForumFeedHttpQuery>,
) -> Response {
    fetch_feeds_with_type(state, headers, query, Some("recommend"), None).await
}

async fn fetch_search_feeds(
    State(state): State<AppForumState>,
    headers: HeaderMap,
    Query(query): Query<ForumFeedHttpQuery>,
) -> Response {
    fetch_feeds_with_type(state, headers, query, None, None).await
}

async fn fetch_top_feeds(
    State(state): State<AppForumState>,
    headers: HeaderMap,
    Query(query): Query<ForumFeedHttpQuery>,
) -> Response {
    fetch_feeds_with_type(state, headers, query, Some("top"), None).await
}

async fn fetch_most_viewed_feeds(
    State(state): State<AppForumState>,
    headers: HeaderMap,
    Query(query): Query<ForumFeedHttpQuery>,
) -> Response {
    fetch_feeds_with_type(state, headers, query, Some("most-viewed"), None).await
}

async fn fetch_most_liked_feeds(
    State(state): State<AppForumState>,
    headers: HeaderMap,
    Query(query): Query<ForumFeedHttpQuery>,
) -> Response {
    fetch_feeds_with_type(state, headers, query, Some("most-liked"), None).await
}

async fn fetch_category_feeds(
    State(state): State<AppForumState>,
    Path(category_id): Path<i64>,
    headers: HeaderMap,
    Query(query): Query<ForumFeedHttpQuery>,
) -> Response {
    fetch_feeds_with_type(state, headers, query, None, Some(category_id)).await
}

async fn fetch_feeds_with_type(
    state: AppForumState,
    headers: HeaderMap,
    query: ForumFeedHttpQuery,
    feed_type: Option<&str>,
    category_id: Option<i64>,
) -> Response {
    let subject = match forum_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = match validate_feed_query(query, feed_type, category_id) {
        Ok(query) => query,
        Err(message) => return bad_request(message),
    };
    match state.feed_read_store.load_feeds(query, subject).await {
        Ok(items) => Json(PlusApiResult::success(ForumFeedItems {
            total_elements: items.len() as i64,
            content: items.clone(),
            items,
        }))
        .into_response(),
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
    let feed_id = match normalize_path_id(&feed_id, "feedId") {
        Ok(feed_id) => feed_id,
        Err(message) => return bad_request(message),
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

async fn fetch_feed_categories(State(state): State<AppForumState>, headers: HeaderMap) -> Response {
    let subject = match forum_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match state.feed_read_store.load_feed_categories(subject).await {
        Ok(items) => Json(PlusApiResult::success(items)).into_response(),
        Err(error) => forum_error("forum feed read model is unavailable", error),
    }
}

async fn check_feed_collected(
    State(state): State<AppForumState>,
    Path(feed_id): Path<i64>,
    headers: HeaderMap,
) -> Response {
    let subject = match forum_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match state
        .feed_read_store
        .is_feed_collected(feed_id, subject)
        .await
    {
        Ok(ok) => Json(PlusApiResult::success(ForumBooleanResult { ok })).into_response(),
        Err(error) => forum_error("forum feed read model is unavailable", error),
    }
}

async fn create_feed(
    State(state): State<AppForumState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match required_forum_subject(&headers, state.require_subject, "create feed") {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_body::<CreateFeedRequest>(&body, "feed request") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let content = match normalize_required_text(
        request.content.clone().or_else(|| request.summary.clone()),
        "content",
        8192,
    ) {
        Ok(content) => content,
        Err(message) => return bad_request(message),
    };
    let command = match build_create_feed_command(&state, subject, request, content) {
        Ok(command) => command,
        Err(error) => return forum_error("forum feed command is invalid", error),
    };
    feed_command_response(
        state
            .feed_command_store
            .create_feed(command, Some(subject))
            .await,
    )
}

async fn delete_feed(
    State(state): State<AppForumState>,
    Path(feed_id): Path<i64>,
    headers: HeaderMap,
) -> Response {
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
    body: Bytes,
) -> Response {
    let subject = match required_forum_subject(&headers, state.require_subject, "collect feed") {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let folder_id = match parse_optional_json_body::<CollectFeedRequest>(&body, "collect request") {
        Ok(request) => request.and_then(|request| request.folder_id),
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
    let subject = match forum_subject(&headers, state.require_subject) {
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
    let subject = match forum_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = match validate_comment_page_query(query) {
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
    let query = match validate_comment_page_query(query) {
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
    let content_type = match normalize_required_text(query.content_type, "contentType", 64) {
        Ok(value) => value,
        Err(message) => return bad_request(message),
    };
    let Some(content_id) = query.content_id else {
        return bad_request("contentId is required".to_owned());
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
    let subject = match required_forum_subject(&headers, state.require_subject, "create comment") {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_body::<CreateCommentRequest>(&body, "comment request") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    create_comment_with_parent(state, subject, request, None).await
}

async fn reply_comment(
    State(state): State<AppForumState>,
    Path(comment_id): Path<i64>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match required_forum_subject(&headers, state.require_subject, "reply comment") {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_body::<CreateCommentRequest>(&body, "comment reply request") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    create_comment_with_parent(state, subject, request, Some(comment_id)).await
}

async fn create_comment_with_parent(
    state: AppForumState,
    subject: ForumSubject,
    request: CreateCommentRequest,
    parent_id: Option<i64>,
) -> Response {
    let content = match normalize_required_text(Some(request.content), "content", 8192) {
        Ok(content) => content,
        Err(message) => return bad_request(message),
    };
    let content_type = match normalize_required_text(request.content_type, "contentType", 64) {
        Ok(content_type) => content_type,
        Err(message) => return bad_request(message),
    };
    let Some(content_id) = request.content_id else {
        return bad_request("contentId is required".to_owned());
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
        parent_id: parent_id.or(request.parent_id),
        device_info: request.device_info,
        ip_address: request.ip_address,
        requested_at: current_timestamp_string(),
    };
    comment_command_response(
        state
            .comment_command_store
            .create_comment(command, Some(subject))
            .await,
    )
}

async fn delete_comment(
    State(state): State<AppForumState>,
    Path(comment_id): Path<i64>,
    headers: HeaderMap,
) -> Response {
    let subject = match required_forum_subject(&headers, state.require_subject, "delete comment") {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    boolean_command_response(
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
) -> Result<CreateForumFeedCommand, DomainError> {
    Ok(CreateForumFeedCommand {
        subject,
        uuid: state.entity_uuid_generator.generate_entity_uuid()?,
        title: normalize_optional_text(request.title, "title", 255).map_err(DomainError::new)?,
        content,
        category_id: request.category_id,
        images: request
            .images
            .unwrap_or_default()
            .into_iter()
            .filter_map(|value| normalize_optional_text(Some(value), "image", 1024).transpose())
            .collect::<Result<Vec<_>, _>>()
            .map_err(DomainError::new)?,
        tags: request
            .tags
            .unwrap_or_default()
            .into_iter()
            .filter_map(|value| normalize_optional_text(Some(value), "tag", 64).transpose())
            .collect::<Result<Vec<_>, _>>()
            .map_err(DomainError::new)?,
        source: normalize_optional_text(request.source, "source", 100).map_err(DomainError::new)?,
        source_url: normalize_optional_text(request.source_url, "sourceUrl", 500)
            .map_err(DomainError::new)?,
        requested_at: current_timestamp_string(),
    })
}

fn validate_feed_query(
    query: ForumFeedHttpQuery,
    feed_type_override: Option<&str>,
    category_id_override: Option<i64>,
) -> Result<ForumFeedQuery, String> {
    let page = validate_optional_positive(query.page.or(query.page_no), "page")?;
    let size = validate_optional_positive(query.size.or(query.page_size), "size")?;
    let limit = validate_optional_positive(query.limit, "limit")?;
    if size.unwrap_or(1) > MAX_PAGE_SIZE || limit.unwrap_or(1) > MAX_PAGE_SIZE {
        return Err(format!("size and limit must be at most {MAX_PAGE_SIZE}"));
    }
    Ok(ForumFeedQuery {
        feed_type: feed_type_override.map(ToOwned::to_owned).or_else(|| {
            normalize_optional_text(query.feed_type, "feedType", 64)
                .ok()
                .flatten()
        }),
        content_type: normalize_optional_text(query.content_type, "contentType", 64)?,
        keyword: normalize_optional_text(query.keyword, "keyword", MAX_QUERY_TEXT_LEN)?,
        author_id: query.author_id,
        category_id: category_id_override.or(query.category_id),
        page,
        size,
        limit,
    })
}

fn validate_comment_query(
    query: ForumCommentHttpQuery,
) -> Result<(String, i64, ForumFeedQuery), String> {
    let content_type = normalize_required_text(query.content_type.clone(), "contentType", 64)?;
    let Some(content_id) = query.content_id else {
        return Err("contentId is required".to_owned());
    };
    let query = validate_comment_page_query(query)?;
    Ok((content_type, content_id, query))
}

fn validate_comment_page_query(query: ForumCommentHttpQuery) -> Result<ForumFeedQuery, String> {
    let page = validate_optional_positive(query.page.or(query.page_no), "page")?;
    let size = validate_optional_positive(query.size.or(query.page_size), "size")?;
    let limit = validate_optional_positive(query.limit, "limit")?;
    if size.unwrap_or(1) > MAX_PAGE_SIZE || limit.unwrap_or(1) > MAX_PAGE_SIZE {
        return Err(format!("size and limit must be at most {MAX_PAGE_SIZE}"));
    }
    Ok(ForumFeedQuery {
        page,
        size,
        limit,
        ..ForumFeedQuery::default()
    })
}

fn page_size_from_query(query: Option<&ForumFeedQuery>) -> (i64, i64) {
    (
        query.and_then(|query| query.page).unwrap_or(1),
        query
            .and_then(|query| query.limit.or(query.size))
            .unwrap_or(DEFAULT_PAGE_SIZE),
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

fn parse_json_body<T>(body: &[u8], name: &str) -> Result<T, String>
where
    T: for<'de> Deserialize<'de>,
{
    if body.len() > MAX_FORUM_BODY_BYTES {
        return Err(format!(
            "{name} body must be at most {MAX_FORUM_BODY_BYTES} bytes"
        ));
    }
    serde_json::from_slice::<T>(body).map_err(|error| format!("invalid {name} body: {error}"))
}

fn parse_optional_json_body<T>(body: &[u8], name: &str) -> Result<Option<T>, String>
where
    T: for<'de> Deserialize<'de>,
{
    if body.iter().all(u8::is_ascii_whitespace) {
        return Ok(None);
    }
    parse_json_body(body, name).map(Some)
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

fn validate_optional_positive(value: Option<i64>, field: &str) -> Result<Option<i64>, String> {
    match value {
        Some(value) if value <= 0 => Err(format!("{field} must be a positive integer")),
        value => Ok(value),
    }
}

fn normalize_path_id(value: &str, field: &str) -> Result<String, String> {
    let value = value.trim();
    if value.is_empty() {
        return Err(format!("{field} is required"));
    }
    if value.chars().count() > 128 {
        return Err(format!("{field} must be at most 128 characters"));
    }
    if !value
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_' | b'.' | b':'))
    {
        return Err(format!("{field} contains unsupported characters"));
    }
    Ok(value.to_owned())
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
        Ok(ok) => Json(PlusApiResult::success(ForumBooleanResult { ok })).into_response(),
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
