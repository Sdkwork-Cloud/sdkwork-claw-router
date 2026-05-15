use std::sync::Arc;

use crate::api::base::{RequestHeaders};
use crate::api::paths::app_path;
use crate::api::paths::append_query_string;
use crate::http::{SdkworkError, SdkworkHttpClient};
use crate::models::{ApplicationsCreateResult, ApplicationsVideosCreateResult, CommentsCreateResult, CommentsDeleteResult, CommentsLikesCreateResult, CommentsLikesCurrentDeleteResult, CommentsListResult, CommentsPinsCreateResult, CommentsPinsCurrentDeleteResult, CommentsRepliesListResult, CommentsReplyCreateResult, CommentsRetrieveResult, CommentsStatisticsListResult, CourseApplicationCreateRequest, CourseApplicationVideoUploadRequest, CoursesCategoriesListResult, CoursesListResult, CoursesOverviewRetrieveResult, CoursesRetrieveResult, FeedsCategoryRetrieveResult, FeedsCollectionsCreateResult, FeedsCollectionsCurrentDeleteResult, FeedsCollectionsCurrentRetrieveResult, FeedsCreateResult, FeedsDeleteResult, FeedsHotListResult, FeedsLikesCreateResult, FeedsLikesCurrentDeleteResult, FeedsListResult, FeedsMostLikedListResult, FeedsMostViewedListResult, FeedsOverviewRetrieveResult, FeedsRecommendListResult, FeedsRetrieveResult, FeedsSharesCreateResult, FeedsTopListResult, ForumCreateCommentRequest, ForumCreateFeedRequest, ForumReplyCommentRequest, UsersCurrentCommentsListResult};

#[derive(Clone)]
pub struct ContentApi {
    client: Arc<SdkworkHttpClient>,
}

impl ContentApi {
    pub fn new(client: Arc<SdkworkHttpClient>) -> Self {
        Self { client }
    }

    /// List forum comments
    pub async fn comments_list(&self, content_type: &str, content_id: i64, page: Option<i64>, page_size: Option<i64>) -> Result<CommentsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("content_type", content_type, "form", true, false, None),
            QueryParameterSpec::new("content_id", content_id, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/content/comments".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Create forum comment
    pub async fn comments_create(&self, body: &ForumCreateCommentRequest, x_request_id: Option<&str>) -> Result<CommentsCreateResult, SdkworkError> {
        let path = app_path(&"/content/comments".to_string());
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// List forum comment statistics
    pub async fn comments_statistics_list(&self, content_type: &str, content_id: i64) -> Result<CommentsStatisticsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("content_type", content_type, "form", true, false, None),
            QueryParameterSpec::new("content_id", content_id, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/content/comments/statistics".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Delete forum comment
    pub async fn comments_delete(&self, comment_id: &str) -> Result<CommentsDeleteResult, SdkworkError> {
        let path = app_path(&format!("/content/comments/{}", serialize_path_parameter(comment_id, PathParameterSpec::new("commentId", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// List forum comment detail
    pub async fn comments_retrieve(&self, comment_id: &str) -> Result<CommentsRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/content/comments/{}", serialize_path_parameter(comment_id, PathParameterSpec::new("commentId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Like forum comment
    pub async fn comments_likes_create(&self, comment_id: &str, x_request_id: Option<&str>) -> Result<CommentsLikesCreateResult, SdkworkError> {
        let path = app_path(&format!("/content/comments/{}/likes", serialize_path_parameter(comment_id, PathParameterSpec::new("commentId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Option::<&serde_json::Value>::None, None, headers.as_ref(), None).await
    }

    /// Unlike forum comment
    pub async fn comments_likes_current_delete(&self, comment_id: &str) -> Result<CommentsLikesCurrentDeleteResult, SdkworkError> {
        let path = app_path(&format!("/content/comments/{}/likes/current", serialize_path_parameter(comment_id, PathParameterSpec::new("commentId", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// Pin forum comment
    pub async fn comments_pins_create(&self, comment_id: &str, x_request_id: Option<&str>) -> Result<CommentsPinsCreateResult, SdkworkError> {
        let path = app_path(&format!("/content/comments/{}/pins", serialize_path_parameter(comment_id, PathParameterSpec::new("commentId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Option::<&serde_json::Value>::None, None, headers.as_ref(), None).await
    }

    /// Unpin forum comment
    pub async fn comments_pins_current_delete(&self, comment_id: &str) -> Result<CommentsPinsCurrentDeleteResult, SdkworkError> {
        let path = app_path(&format!("/content/comments/{}/pins/current", serialize_path_parameter(comment_id, PathParameterSpec::new("commentId", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// List forum comment replies
    pub async fn comments_replies_list(&self, comment_id: &str, page: Option<i64>, page_size: Option<i64>) -> Result<CommentsRepliesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&format!("/content/comments/{}/replies", serialize_path_parameter(comment_id, PathParameterSpec::new("commentId", "simple", false)))), &query);
        self.client.get(&path, None, None).await
    }

    /// Reply forum comment
    pub async fn comments_reply_create(&self, comment_id: &str, body: &ForumReplyCommentRequest, x_request_id: Option<&str>) -> Result<CommentsReplyCreateResult, SdkworkError> {
        let path = app_path(&format!("/content/comments/{}/reply", serialize_path_parameter(comment_id, PathParameterSpec::new("commentId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// List forum feeds
    pub async fn feeds_list(&self, r#type: Option<&str>, content_type: Option<&str>, q: Option<&str>, author_id: Option<i64>, page: Option<i64>, page_size: Option<i64>) -> Result<FeedsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("type", r#type, "form", true, false, None),
            QueryParameterSpec::new("content_type", content_type, "form", true, false, None),
            QueryParameterSpec::new("q", q, "form", true, false, None),
            QueryParameterSpec::new("author_id", author_id, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/content/feeds".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Create forum feed
    pub async fn feeds_create(&self, body: &ForumCreateFeedRequest, x_request_id: Option<&str>) -> Result<FeedsCreateResult, SdkworkError> {
        let path = app_path(&"/content/feeds".to_string());
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// List category forum feeds
    pub async fn feeds_category_retrieve(&self, category_id: &str, page: Option<i64>, page_size: Option<i64>) -> Result<FeedsCategoryRetrieveResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&format!("/content/feeds/category/{}", serialize_path_parameter(category_id, PathParameterSpec::new("categoryId", "simple", false)))), &query);
        self.client.get(&path, None, None).await
    }

    /// List hot forum feeds
    pub async fn feeds_hot_list(&self, limit: Option<i64>) -> Result<FeedsHotListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("limit", limit, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/content/feeds/hot".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// List most liked forum feeds
    pub async fn feeds_most_liked_list(&self, limit: Option<i64>) -> Result<FeedsMostLikedListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("limit", limit, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/content/feeds/most_liked".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// List most viewed forum feeds
    pub async fn feeds_most_viewed_list(&self, limit: Option<i64>) -> Result<FeedsMostViewedListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("limit", limit, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/content/feeds/most_viewed".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// List forum overview
    pub async fn feeds_overview_retrieve(&self) -> Result<FeedsOverviewRetrieveResult, SdkworkError> {
        let path = app_path(&"/content/feeds/overview".to_string());
        self.client.get(&path, None, None).await
    }

    /// List recommended forum feeds
    pub async fn feeds_recommend_list(&self, limit: Option<i64>) -> Result<FeedsRecommendListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("limit", limit, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/content/feeds/recommend".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// List top forum feeds
    pub async fn feeds_top_list(&self, limit: Option<i64>) -> Result<FeedsTopListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("limit", limit, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/content/feeds/top".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Delete forum feed
    pub async fn feeds_delete(&self, id: &str) -> Result<FeedsDeleteResult, SdkworkError> {
        let path = app_path(&format!("/content/feeds/{}", serialize_path_parameter(id, PathParameterSpec::new("id", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// List forum feed detail
    pub async fn feeds_retrieve(&self, id: &str) -> Result<FeedsRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/content/feeds/{}", serialize_path_parameter(id, PathParameterSpec::new("id", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Collect forum feed
    pub async fn feeds_collections_create(&self, id: &str, folder_id: Option<i64>, x_request_id: Option<&str>) -> Result<FeedsCollectionsCreateResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("folder_id", folder_id, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&format!("/content/feeds/{}/collections", serialize_path_parameter(id, PathParameterSpec::new("id", "simple", false)))), &query);
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Option::<&serde_json::Value>::None, None, headers.as_ref(), None).await
    }

    /// Uncollect forum feed
    pub async fn feeds_collections_current_delete(&self, id: &str, x_request_id: Option<&str>) -> Result<FeedsCollectionsCurrentDeleteResult, SdkworkError> {
        let path = app_path(&format!("/content/feeds/{}/collections/current", serialize_path_parameter(id, PathParameterSpec::new("id", "simple", false))));
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.delete(&path, None, headers.as_ref()).await
    }

    /// Check forum feed collected
    pub async fn feeds_collections_current_retrieve(&self, id: &str) -> Result<FeedsCollectionsCurrentRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/content/feeds/{}/collections/current", serialize_path_parameter(id, PathParameterSpec::new("id", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Like forum feed
    pub async fn feeds_likes_create(&self, id: &str, x_request_id: Option<&str>) -> Result<FeedsLikesCreateResult, SdkworkError> {
        let path = app_path(&format!("/content/feeds/{}/likes", serialize_path_parameter(id, PathParameterSpec::new("id", "simple", false))));
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Option::<&serde_json::Value>::None, None, headers.as_ref(), None).await
    }

    /// Unlike forum feed
    pub async fn feeds_likes_current_delete(&self, id: &str, x_request_id: Option<&str>) -> Result<FeedsLikesCurrentDeleteResult, SdkworkError> {
        let path = app_path(&format!("/content/feeds/{}/likes/current", serialize_path_parameter(id, PathParameterSpec::new("id", "simple", false))));
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.delete(&path, None, headers.as_ref()).await
    }

    /// Share forum feed
    pub async fn feeds_shares_create(&self, id: &str, x_request_id: Option<&str>) -> Result<FeedsSharesCreateResult, SdkworkError> {
        let path = app_path(&format!("/content/feeds/{}/shares", serialize_path_parameter(id, PathParameterSpec::new("id", "simple", false))));
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Option::<&serde_json::Value>::None, None, headers.as_ref(), None).await
    }

    /// List my forum comments
    pub async fn users_current_comments_list(&self, page: Option<i64>, page_size: Option<i64>) -> Result<UsersCurrentCommentsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/content/users/current/comments".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// List courses
    pub async fn courses_list(&self, level: Option<i64>, category: Option<&str>, q: Option<&str>, page: Option<i64>, page_size: Option<i64>) -> Result<CoursesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("level", level, "form", true, false, None),
            QueryParameterSpec::new("category", category, "form", true, false, None),
            QueryParameterSpec::new("q", q, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/courses".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Create course application
    pub async fn applications_create(&self, body: &CourseApplicationCreateRequest) -> Result<ApplicationsCreateResult, SdkworkError> {
        let path = app_path(&"/courses/applications".to_string());
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Upload course application video
    pub async fn applications_videos_create(&self, body: &CourseApplicationVideoUploadRequest) -> Result<ApplicationsVideosCreateResult, SdkworkError> {
        let path = app_path(&"/courses/applications/videos".to_string());
        self.client.post(&path, Some(body), None, None, Some("multipart/form-data")).await
    }

    /// List course categories
    pub async fn courses_categories_list(&self) -> Result<CoursesCategoriesListResult, SdkworkError> {
        let path = app_path(&"/courses/categories".to_string());
        self.client.get(&path, None, None).await
    }

    /// List course overview
    pub async fn courses_overview_retrieve(&self) -> Result<CoursesOverviewRetrieveResult, SdkworkError> {
        let path = app_path(&"/courses/overview".to_string());
        self.client.get(&path, None, None).await
    }

    /// List course detail
    pub async fn courses_retrieve(&self, course_id: &str) -> Result<CoursesRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/courses/{}", serialize_path_parameter(course_id, PathParameterSpec::new("courseId", "simple", false))));
        self.client.get(&path, None, None).await
    }

}

struct PathParameterSpec<'a> {
    name: &'a str,
    style: &'a str,
    explode: bool,
}

impl<'a> PathParameterSpec<'a> {
    fn new(name: &'a str, style: &'a str, explode: bool) -> Self {
        Self { name, style, explode }
    }
}

fn serialize_path_parameter<T: serde::Serialize>(value: T, spec: PathParameterSpec<'_>) -> String {
    let value = serde_json::to_value(value).unwrap_or(serde_json::Value::Null);
    if value.is_null() {
        return String::new();
    }
    let style = if spec.style.is_empty() { "simple" } else { spec.style };
    match value {
        serde_json::Value::Array(values) => serialize_path_array(spec.name, &values, style, spec.explode),
        serde_json::Value::Object(values) => serialize_path_object(spec.name, &values, style, spec.explode),
        value => format!("{}{}", path_primitive_prefix(spec.name, style), percent_encode(&primitive_to_string(&value))),
    }
}

fn serialize_path_array(name: &str, values: &[serde_json::Value], style: &str, explode: bool) -> String {
    let serialized = values
        .iter()
        .filter(|value| !value.is_null())
        .map(|value| percent_encode(&primitive_to_string(value)))
        .collect::<Vec<_>>();
    if serialized.is_empty() {
        return path_prefix(name, style);
    }
    if style == "matrix" {
        if explode {
            return serialized.iter().map(|item| format!(";{}={}", name, item)).collect::<Vec<_>>().join("");
        }
        return format!(";{}={}", name, serialized.join(","));
    }
    let separator = if explode { "." } else { "," };
    format!("{}{}", path_prefix(name, style), serialized.join(separator))
}

fn serialize_path_object(
    name: &str,
    values: &serde_json::Map<String, serde_json::Value>,
    style: &str,
    explode: bool,
) -> String {
    let mut entries = Vec::new();
    let mut exploded = Vec::new();
    for (key, value) in values {
        if value.is_null() {
            continue;
        }
        let escaped_key = percent_encode(key);
        let escaped_value = percent_encode(&primitive_to_string(value));
        if explode {
            if style == "matrix" {
                exploded.push(format!(";{}={}", escaped_key, escaped_value));
            } else {
                exploded.push(format!("{}={}", escaped_key, escaped_value));
            }
        } else {
            entries.push(escaped_key);
            entries.push(escaped_value);
        }
    }
    if style == "matrix" {
        if explode {
            return exploded.join("");
        }
        return format!(";{}={}", name, entries.join(","));
    }
    if explode {
        let separator = if style == "label" { "." } else { "," };
        return format!("{}{}", path_prefix(name, style), exploded.join(separator));
    }
    format!("{}{}", path_prefix(name, style), entries.join(","))
}

fn path_prefix(name: &str, style: &str) -> String {
    match style {
        "label" => ".".to_string(),
        "matrix" => format!(";{}", name),
        _ => String::new(),
    }
}

fn path_primitive_prefix(name: &str, style: &str) -> String {
    if style == "matrix" {
        format!(";{}=", name)
    } else {
        path_prefix(name, style)
    }
}

struct HeaderParameterSpec {
    value: serde_json::Value,
    explode: bool,
    content_type: Option<&'static str>,
}

impl HeaderParameterSpec {
    fn new<T: serde::Serialize>(
        value: T,
        _style: &'static str,
        explode: bool,
        content_type: Option<&'static str>,
    ) -> Self {
        Self {
            value: serde_json::to_value(value).unwrap_or(serde_json::Value::Null),
            explode,
            content_type,
        }
    }
}

fn build_request_headers(headers: &[(&str, HeaderParameterSpec)], cookies: &[(&str, HeaderParameterSpec)]) -> Option<RequestHeaders> {
    let mut request_headers = RequestHeaders::new();
    for (name, parameter) in headers {
        if let Some(value) = serialize_header_parameter(parameter) {
            request_headers.insert((*name).to_string(), value);
        }
    }

    let cookie_header = build_cookie_header(cookies);
    if !cookie_header.is_empty() {
        request_headers
            .entry("Cookie".to_string())
            .and_modify(|existing| {
                existing.push_str("; ");
                existing.push_str(&cookie_header);
            })
            .or_insert(cookie_header);
    }

    if request_headers.is_empty() {
        None
    } else {
        Some(request_headers)
    }
}

fn build_cookie_header(cookies: &[(&str, HeaderParameterSpec)]) -> String {
    cookies
        .iter()
        .filter_map(|(name, value)| {
            serialize_header_parameter(value)
                .map(|value| format!("{}={}", percent_encode(name), percent_encode(&value)))
        })
        .collect::<Vec<_>>()
        .join("; ")
}

fn serialize_header_parameter(parameter: &HeaderParameterSpec) -> Option<String> {
    if parameter.value.is_null() {
        return None;
    }
    if parameter.content_type.is_some() {
        return Some(parameter.value.to_string());
    }
    match &parameter.value {
        serde_json::Value::Null => None,
        serde_json::Value::String(value) => Some(value.clone()),
        serde_json::Value::Number(value) => Some(value.to_string()),
        serde_json::Value::Bool(value) => Some(value.to_string()),
        serde_json::Value::Array(values) => {
            let serialized = values
                .iter()
                .filter_map(serialize_json_value)
                .collect::<Vec<_>>();
            if serialized.is_empty() {
                None
            } else {
                Some(serialized.join(","))
            }
        }
        serde_json::Value::Object(values) => {
            let serialized = values
                .iter()
                .filter_map(|(key, value)| {
                    serialize_json_value(value).map(|serialized| {
                        if parameter.explode {
                            format!("{}={}", key, serialized)
                        } else {
                            format!("{},{}", key, serialized)
                        }
                    })
                })
                .collect::<Vec<_>>();
            if serialized.is_empty() {
                None
            } else {
                Some(serialized.join(","))
            }
        }
    }
}

fn serialize_json_value(value: &serde_json::Value) -> Option<String> {
    match value {
        serde_json::Value::Null => None,
        serde_json::Value::String(value) => Some(value.clone()),
        serde_json::Value::Number(value) => Some(value.to_string()),
        serde_json::Value::Bool(value) => Some(value.to_string()),
        other => Some(other.to_string()),
    }
}

struct QueryParameterSpec<'a> {
    name: &'a str,
    value: serde_json::Value,
    style: &'a str,
    explode: bool,
    allow_reserved: bool,
    content_type: Option<&'a str>,
}

impl<'a> QueryParameterSpec<'a> {
    fn new<T: serde::Serialize>(
        name: &'a str,
        value: T,
        style: &'a str,
        explode: bool,
        allow_reserved: bool,
        content_type: Option<&'a str>,
    ) -> Self {
        Self {
            name,
            value: serde_json::to_value(value).unwrap_or(serde_json::Value::Null),
            style,
            explode,
            allow_reserved,
            content_type,
        }
    }
}

fn build_query_string(parameters: &[QueryParameterSpec<'_>]) -> String {
    let mut pairs = Vec::new();
    for parameter in parameters {
        append_serialized_parameter(&mut pairs, parameter);
    }
    pairs.join("&")
}

fn append_serialized_parameter(pairs: &mut Vec<String>, parameter: &QueryParameterSpec<'_>) {
    if parameter.value.is_null() {
        return;
    }
    if parameter.content_type.is_some() {
        pairs.push(format!(
            "{}={}",
            percent_encode(parameter.name),
            encode_query_value(&parameter.value.to_string(), parameter.allow_reserved)
        ));
        return;
    }

    let style = if parameter.style.is_empty() { "form" } else { parameter.style };
    match &parameter.value {
        serde_json::Value::Array(values) => append_array_parameter(pairs, parameter.name, values, style, parameter.explode, parameter.allow_reserved),
        serde_json::Value::Object(values) if style == "deepObject" => append_deep_object_parameter(pairs, parameter.name, values, parameter.allow_reserved),
        serde_json::Value::Object(values) => append_object_parameter(pairs, parameter.name, values, style, parameter.explode, parameter.allow_reserved),
        value => pairs.push(format!("{}={}", percent_encode(parameter.name), encode_query_value(&primitive_to_string(value), parameter.allow_reserved))),
    }
}

fn append_array_parameter(
    pairs: &mut Vec<String>,
    name: &str,
    values: &[serde_json::Value],
    style: &str,
    explode: bool,
    allow_reserved: bool,
) {
    let serialized = values.iter().filter(|value| !value.is_null()).map(primitive_to_string).collect::<Vec<_>>();
    if serialized.is_empty() {
        return;
    }
    if style == "form" && explode {
        for item in serialized {
            pairs.push(format!("{}={}", percent_encode(name), encode_query_value(&item, allow_reserved)));
        }
        return;
    }
    pairs.push(format!("{}={}", percent_encode(name), encode_query_value(&serialized.join(","), allow_reserved)));
}

fn append_object_parameter(
    pairs: &mut Vec<String>,
    name: &str,
    values: &serde_json::Map<String, serde_json::Value>,
    style: &str,
    explode: bool,
    allow_reserved: bool,
) {
    let mut serialized = Vec::new();
    for (key, value) in values {
        if value.is_null() {
            continue;
        }
        if style == "form" && explode {
            pairs.push(format!("{}={}", percent_encode(key), encode_query_value(&primitive_to_string(value), allow_reserved)));
        } else {
            serialized.push(key.clone());
            serialized.push(primitive_to_string(value));
        }
    }
    if !serialized.is_empty() {
        pairs.push(format!("{}={}", percent_encode(name), encode_query_value(&serialized.join(","), allow_reserved)));
    }
}

fn append_deep_object_parameter(
    pairs: &mut Vec<String>,
    name: &str,
    values: &serde_json::Map<String, serde_json::Value>,
    allow_reserved: bool,
) {
    for (key, value) in values {
        if !value.is_null() {
            pairs.push(format!("{}={}", percent_encode(&format!("{}[{}]", name, key)), encode_query_value(&primitive_to_string(value), allow_reserved)));
        }
    }
}

fn encode_query_value(value: &str, allow_reserved: bool) -> String {
    let mut encoded = percent_encode(value);
    if !allow_reserved {
        return encoded;
    }
    for (escaped, reserved) in [
        ("%3A", ":"), ("%2F", "/"), ("%3F", "?"), ("%23", "#"),
        ("%5B", "["), ("%5D", "]"), ("%40", "@"), ("%21", "!"),
        ("%24", "$"), ("%26", "&"), ("%27", "'"), ("%28", "("),
        ("%29", ")"), ("%2A", "*"), ("%2B", "+"), ("%2C", ","),
        ("%3B", ";"), ("%3D", "="),
    ] {
        encoded = encoded.replace(escaped, reserved);
    }
    encoded
}

fn primitive_to_string(value: &serde_json::Value) -> String {
    match value {
        serde_json::Value::String(value) => value.clone(),
        serde_json::Value::Number(value) => value.to_string(),
        serde_json::Value::Bool(value) => value.to_string(),
        other => other.to_string(),
    }
}

fn percent_encode(value: &str) -> String {
    value
        .bytes()
        .flat_map(|byte| match byte {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                vec![byte as char]
            }
            _ => format!("%{:02X}", byte).chars().collect(),
        })
        .collect()
}
