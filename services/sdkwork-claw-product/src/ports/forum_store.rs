use std::future::Future;
use std::pin::Pin;

use serde::Serialize;
use serde_json::Value;

use crate::domain::DomainResult;

pub type ForumReadFuture<'a, T> = Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;
pub type ForumCommandFuture<'a, T> = Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ForumSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
}

#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct ForumFeedQuery {
    pub feed_type: Option<String>,
    pub content_type: Option<String>,
    pub keyword: Option<String>,
    pub author_id: Option<i64>,
    pub category_id: Option<i64>,
    pub page: Option<i64>,
    pub size: Option<i64>,
    pub limit: Option<i64>,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ForumAuthor {
    pub id: i64,
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub avatar: Option<Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bio: Option<String>,
    pub is_following: bool,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ForumFeedItem {
    pub id: i64,
    pub title: String,
    pub content: String,
    pub summary: String,
    pub cover: Value,
    pub content_type: String,
    pub category_id: i64,
    pub tags: Vec<String>,
    pub author: ForumAuthor,
    pub view_count: i64,
    pub like_count: i64,
    pub comment_count: i64,
    pub share_count: i64,
    pub is_liked: bool,
    pub is_collected: bool,
    pub is_top: bool,
    pub is_hot: bool,
    pub is_recommended: bool,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ForumCommentItem {
    pub comment_id: String,
    pub content: String,
    pub content_type: String,
    pub content_id: i64,
    pub user_id: i64,
    pub status: String,
    pub likes: i64,
    pub reply_count: i64,
    pub is_top: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parent_id: Option<i64>,
    pub author: ForumAuthor,
    pub created_at: String,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ForumCommentDetail {
    pub comment_id: String,
    pub content: String,
    pub content_type: String,
    pub content_id: i64,
    pub user_id: i64,
    pub status: String,
    pub likes: i64,
    pub reply_count: i64,
    pub is_top: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parent_id: Option<i64>,
    pub author: ForumAuthor,
    pub ip_address: String,
    pub device_info: String,
    pub created_at: String,
    pub updated_at: String,
    pub replies: Vec<ForumCommentItem>,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ForumCommentPage {
    pub items: Vec<ForumCommentItem>,
    pub content: Vec<ForumCommentItem>,
    pub total_elements: i64,
    pub page: i64,
    pub size: i64,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ForumCommentStatistics {
    pub total_comments: i64,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ForumOverviewStats {
    pub total_posts: i64,
    pub total_comments: i64,
    pub member_count: i64,
    pub online_members: i64,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ForumCommunityLink {
    pub id: String,
    pub label: String,
    pub url: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub qr_code: Option<Value>,
    pub tone: String,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ForumOverviewSource {
    pub source_label: String,
    pub source_description: String,
    pub source_tables: Vec<String>,
    pub observed_at: String,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ForumOverview {
    pub stats: ForumOverviewStats,
    pub source: ForumOverviewSource,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CreateForumFeedCommand {
    pub subject: ForumSubject,
    pub uuid: String,
    pub title: Option<String>,
    pub content: String,
    pub category_id: Option<i64>,
    pub images: Vec<Value>,
    pub tags: Vec<String>,
    pub source: Option<String>,
    pub source_url: Option<String>,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CreateForumCommentCommand {
    pub subject: ForumSubject,
    pub uuid: String,
    pub content_type: String,
    pub content_id: i64,
    pub content: String,
    pub parent_id: Option<i64>,
    pub device_info: Option<String>,
    pub ip_address: Option<String>,
    pub requested_at: String,
}

pub trait ForumFeedReadStore {
    fn load_feeds<'a>(
        &'a self,
        query: ForumFeedQuery,
        subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, Vec<ForumFeedItem>>;

    fn load_feed_detail<'a>(
        &'a self,
        feed_id: i64,
        subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, Option<ForumFeedItem>>;

    fn is_feed_collected<'a>(
        &'a self,
        feed_id: i64,
        subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, bool>;

    fn load_overview<'a>(
        &'a self,
        subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, ForumOverview>;
}

pub trait ForumFeedCommandStore {
    fn create_feed<'a>(
        &'a self,
        command: CreateForumFeedCommand,
        subject: Option<ForumSubject>,
    ) -> ForumCommandFuture<'a, ForumFeedItem>;

    fn delete_feed<'a>(
        &'a self,
        feed_id: i64,
        subject: ForumSubject,
    ) -> ForumCommandFuture<'a, bool>;

    fn like_feed<'a>(
        &'a self,
        feed_id: i64,
        subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumFeedItem>;

    fn unlike_feed<'a>(
        &'a self,
        feed_id: i64,
        subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumFeedItem>;

    fn collect_feed<'a>(
        &'a self,
        feed_id: i64,
        folder_id: Option<i64>,
        subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumFeedItem>;

    fn uncollect_feed<'a>(
        &'a self,
        feed_id: i64,
        subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumFeedItem>;

    fn share_feed<'a>(
        &'a self,
        feed_id: i64,
        subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumFeedItem>;
}

pub trait ForumCommentReadStore {
    fn load_comments<'a>(
        &'a self,
        content_type: String,
        content_id: i64,
        query: Option<ForumFeedQuery>,
        subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, ForumCommentPage>;

    fn load_comment_replies<'a>(
        &'a self,
        comment_id: i64,
        query: Option<ForumFeedQuery>,
        subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, ForumCommentPage>;

    fn load_comment_detail<'a>(
        &'a self,
        comment_id: i64,
        subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, Option<ForumCommentDetail>>;

    fn load_my_comments<'a>(
        &'a self,
        query: Option<ForumFeedQuery>,
        subject: ForumSubject,
    ) -> ForumReadFuture<'a, ForumCommentPage>;

    fn load_comment_statistics<'a>(
        &'a self,
        content_type: String,
        content_id: i64,
        subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, ForumCommentStatistics>;
}

pub trait ForumCommentCommandStore {
    fn create_comment<'a>(
        &'a self,
        command: CreateForumCommentCommand,
        subject: Option<ForumSubject>,
    ) -> ForumCommandFuture<'a, ForumCommentItem>;

    fn delete_comment<'a>(
        &'a self,
        comment_id: i64,
        subject: ForumSubject,
    ) -> ForumCommandFuture<'a, bool>;

    fn like_comment<'a>(
        &'a self,
        comment_id: i64,
        subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumCommentItem>;

    fn unlike_comment<'a>(
        &'a self,
        comment_id: i64,
        subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumCommentItem>;

    fn pin_comment<'a>(
        &'a self,
        comment_id: i64,
        subject: ForumSubject,
        pinned: bool,
    ) -> ForumCommandFuture<'a, ForumCommentItem>;
}

pub trait ForumStore:
    ForumFeedReadStore + ForumFeedCommandStore + ForumCommentReadStore + ForumCommentCommandStore
{
}

impl<T> ForumStore for T where
    T: ForumFeedReadStore
        + ForumFeedCommandStore
        + ForumCommentReadStore
        + ForumCommentCommandStore
{
}
