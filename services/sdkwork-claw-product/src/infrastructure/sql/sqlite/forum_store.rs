use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

use serde_json::{json, Value};
use sqlx::{Row, SqlitePool};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    CreateForumCommentCommand, CreateForumFeedCommand, ForumAuthor, ForumCommandFuture,
    ForumCommentCommandStore, ForumCommentDetail, ForumCommentItem, ForumCommentPage,
    ForumCommentReadStore, ForumCommentStatistics, ForumFeedCommandStore, ForumFeedItem,
    ForumFeedQuery, ForumFeedReadStore, ForumOverview, ForumOverviewSource, ForumOverviewStats,
    ForumReadFuture, ForumSubject,
};

const CONTENT_TYPE_FEEDS: i64 = 5;
const CONTENT_TYPE_COURSE: i64 = 6;
const CONTENT_TYPE_COMMENTS: i64 = 22;
const FEEDS_STATUS_PUBLISHED: i64 = 2;
const FEEDS_STATUS_DELETED: i64 = 3;
const COMMENT_STATUS_PUBLISHED: i64 = 1;
const COMMENT_STATUS_DELETED: i64 = 3;
const FAVORITE_STATUS_ACTIVE: i64 = 1;
const REACTION_TYPE_LIKE: i64 = 2;
const DEFAULT_PAGE_SIZE: i64 = 20;
const MAX_PAGE_SIZE: i64 = 100;

static FORUM_ENTITY_SEQUENCE: AtomicU64 = AtomicU64::new(1);

#[derive(Debug, Clone)]
pub struct SqliteForumStore {
    pool: SqlitePool,
}

impl SqliteForumStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl ForumFeedReadStore for SqliteForumStore {
    fn load_feeds<'a>(
        &'a self,
        query: ForumFeedQuery,
        subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, Vec<ForumFeedItem>> {
        Box::pin(async move {
            let scope = read_scope(subject);
            let page = query.page.unwrap_or(1).max(1);
            let size = query
                .size
                .or(query.limit)
                .unwrap_or(DEFAULT_PAGE_SIZE)
                .clamp(1, MAX_PAGE_SIZE);
            let offset = (page - 1) * size;
            let content_type = query
                .content_type
                .as_deref()
                .and_then(content_type_code)
                .filter(|value| *value > 0);
            let keyword = normalize_like_pattern(query.keyword.as_deref());
            let feed_type = query.feed_type.as_deref().unwrap_or("latest");
            let order_by = feed_order_by(feed_type);

            let sql = format!(
                r#"
                SELECT
                    f.id,
                    f.uuid,
                    f.tenant_id,
                    f.organization_id,
                    f.user_id,
                    COALESCE(f.title, '') AS title,
                    COALESCE(f.summary, '') AS summary,
                    COALESCE(f.category_id, 0) AS category_id,
                    COALESCE(f.content_type, 0) AS content_type,
                    COALESCE(f.content_id, 0) AS content_id,
                    CAST(COALESCE(f.cover_resources, '') AS TEXT) AS cover_resources,
                    CAST(COALESCE(f.tags, '') AS TEXT) AS tags,
                    CAST(COALESCE(f.author, '') AS TEXT) AS author,
                    COALESCE(f.view_count, 0) AS view_count,
                    COALESCE(f.like_count, 0) AS like_count,
                    COALESCE(f.comment_count, 0) AS comment_count,
                    COALESCE(f.share_count, 0) AS share_count,
                    COALESCE(f.favorite_count, 0) AS favorite_count,
                    COALESCE(f.is_top, 0) AS is_top,
                    COALESCE(f.is_hot, 0) AS is_hot,
                    COALESCE(f.is_recommended, 0) AS is_recommended,
                    CAST(COALESCE(f.created_at, '') AS TEXT) AS created_at,
                    CAST(COALESCE(f.updated_at, '') AS TEXT) AS updated_at,
                    EXISTS (
                        SELECT 1
                        FROM content_reaction v
                        WHERE v.tenant_id = f.tenant_id
                          AND v.organization_id = f.organization_id
                          AND v.user_id = ?3
                          AND v.target_type = ?4
                          AND v.target_id = f.id
                          AND v.reaction_type = 2
                          AND v.cancelled_at IS NULL
                    ) AS is_liked,
                    EXISTS (
                        SELECT 1
                        FROM content_favorite fav
                        WHERE fav.tenant_id = f.tenant_id
                          AND fav.organization_id = f.organization_id
                          AND fav.user_id = ?3
                          AND fav.content_type = ?4
                          AND fav.content_id = f.id
                          AND COALESCE(fav.status, 0) = ?5
                    ) AS is_collected
                FROM content_forum_post f
                WHERE COALESCE(f.status, 0) = ?6
                  AND (?7 IS NULL OR COALESCE(f.content_type, 0) = ?7)
                  AND (?8 IS NULL OR COALESCE(f.user_id, 0) = ?8)
                  AND (?9 IS NULL OR COALESCE(f.category_id, 0) = ?9)
                  AND (?10 IS NULL OR lower(COALESCE(f.title, '') || ' ' || COALESCE(f.summary, '')) LIKE ?10)
                  AND {scope_filter}
                ORDER BY {order_by}
                LIMIT ?11 OFFSET ?12
                "#,
                scope_filter = sqlite_scope_filter("f"),
            );

            let rows = sqlx::query(sql.as_str())
                .bind(scope.tenant_id)
                .bind(scope.organization_id)
                .bind(scope.user_id)
                .bind(CONTENT_TYPE_FEEDS)
                .bind(FAVORITE_STATUS_ACTIVE)
                .bind(FEEDS_STATUS_PUBLISHED)
                .bind(content_type)
                .bind(query.author_id)
                .bind(query.category_id)
                .bind(keyword.as_deref())
                .bind(size)
                .bind(offset)
                .fetch_all(&self.pool)
                .await
                .map_err(sql_error)?;

            Ok(rows.iter().map(feed_from_row).collect())
        })
    }

    fn load_feed_detail<'a>(
        &'a self,
        feed_id: i64,
        subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, Option<ForumFeedItem>> {
        Box::pin(async move {
            if load_feed_by_id(&self.pool, feed_id, subject)
                .await?
                .is_none()
            {
                return Ok(None);
            }
            increment_feed_view_count(&self.pool, feed_id, subject).await?;
            load_feed_by_id(&self.pool, feed_id, subject).await
        })
    }

    fn is_feed_collected<'a>(
        &'a self,
        feed_id: i64,
        subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, bool> {
        Box::pin(async move {
            let Some(subject) = subject else {
                return Ok(false);
            };
            feed_is_collected(&self.pool, feed_id, subject).await
        })
    }

    fn load_overview<'a>(
        &'a self,
        subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, ForumOverview> {
        Box::pin(async move { load_forum_overview(&self.pool, subject).await })
    }
}

impl ForumFeedCommandStore for SqliteForumStore {
    fn create_feed<'a>(
        &'a self,
        command: CreateForumFeedCommand,
        subject: Option<ForumSubject>,
    ) -> ForumCommandFuture<'a, ForumFeedItem> {
        Box::pin(async move {
            let subject = effective_subject(command.subject, subject)?;
            let feed_id = next_entity_id();
            let title = normalized_title(command.title.as_deref(), &command.content);
            let category_id = command.category_id.unwrap_or_default();
            let cover_resources = cover_resources_json(&command.images);
            let resource_list = resource_list_json(&command.images);
            let tags = tags_json(&command.tags);
            let author = author_json(subject);

            sqlx::query(
                r#"
                INSERT INTO content_forum_post
                    (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, user_id,
                     title, summary, category_id, content_type, content_id, cover_resources, resource_list,
                     author, source, source_url, publish_time, tags, status, view_count, like_count,
                     comment_count, share_count, favorite_count, is_top, is_hot, is_recommended, sort_order)
                VALUES
                    (?1, ?2, ?3, ?3, 0, ?4, ?5, 1, ?6,
                     ?7, ?8, ?9, ?10, ?1, ?11, ?12,
                     ?13, ?14, ?15, ?3, ?16, ?17, 0, 0,
                     0, 0, 0, 0, 0, 0, 0)
                "#,
            )
            .bind(feed_id)
            .bind(&command.uuid)
            .bind(&command.requested_at)
            .bind(subject.tenant_id)
            .bind(subject.organization_id)
            .bind(subject.user_id)
            .bind(&title)
            .bind(&command.content)
            .bind(category_id)
            .bind(CONTENT_TYPE_FEEDS)
            .bind(cover_resources.to_string())
            .bind(resource_list.to_string())
            .bind(author.to_string())
            .bind(command.source.as_deref())
            .bind(command.source_url.as_deref())
            .bind(tags.to_string())
            .bind(FEEDS_STATUS_PUBLISHED)
            .execute(&self.pool)
            .await
            .map_err(sql_error)?;

            load_feed_by_id(&self.pool, feed_id, Some(subject))
                .await?
                .ok_or_else(|| DomainError::not_found("created feed was not found"))
        })
    }

    fn delete_feed<'a>(
        &'a self,
        feed_id: i64,
        subject: ForumSubject,
    ) -> ForumCommandFuture<'a, bool> {
        Box::pin(async move {
            let rows = sqlx::query(
                r#"
                UPDATE content_forum_post
                SET status = ?1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?2
                  AND tenant_id = ?3
                  AND organization_id = ?4
                  AND user_id = ?5
                  AND COALESCE(status, 0) <> ?1
                "#,
            )
            .bind(FEEDS_STATUS_DELETED)
            .bind(feed_id)
            .bind(subject.tenant_id)
            .bind(subject.organization_id)
            .bind(subject.user_id)
            .execute(&self.pool)
            .await
            .map_err(sql_error)?
            .rows_affected();
            Ok(rows > 0)
        })
    }

    fn like_feed<'a>(
        &'a self,
        feed_id: i64,
        subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumFeedItem> {
        Box::pin(async move {
            require_feed(&self.pool, feed_id, Some(subject)).await?;
            upsert_like_vote(
                &self.pool,
                subject,
                CONTENT_TYPE_FEEDS,
                feed_id,
                format!("forum-feed-like-{feed_id}-{}", subject.user_id),
            )
            .await?;
            refresh_feed_like_count(&self.pool, feed_id).await?;
            require_feed(&self.pool, feed_id, Some(subject)).await
        })
    }

    fn unlike_feed<'a>(
        &'a self,
        feed_id: i64,
        subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumFeedItem> {
        Box::pin(async move {
            require_feed(&self.pool, feed_id, Some(subject)).await?;
            delete_like_vote(&self.pool, subject, CONTENT_TYPE_FEEDS, feed_id).await?;
            refresh_feed_like_count(&self.pool, feed_id).await?;
            require_feed(&self.pool, feed_id, Some(subject)).await
        })
    }

    fn collect_feed<'a>(
        &'a self,
        feed_id: i64,
        folder_id: Option<i64>,
        subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumFeedItem> {
        Box::pin(async move {
            let feed = require_feed(&self.pool, feed_id, Some(subject)).await?;
            let metadata = json!({
                "title": feed.title,
                "folderId": folder_id,
            })
            .to_string();
            sqlx::query(
                r#"
                INSERT INTO content_favorite
                    (id, uuid, tenant_id, organization_id, data_scope, user_id, content_type,
                     content_id, status, metadata, source)
                VALUES
                    (?1, ?2, ?3, ?4, 1, ?5, ?6, ?7, ?8, ?9, 'forum')
                ON CONFLICT(user_id, content_type, content_id) DO UPDATE SET
                    status = excluded.status,
                    metadata = excluded.metadata,
                    updated_at = CURRENT_TIMESTAMP
                "#,
            )
            .bind(next_entity_id())
            .bind(format!("forum-feed-favorite-{feed_id}-{}", subject.user_id))
            .bind(subject.tenant_id)
            .bind(subject.organization_id)
            .bind(subject.user_id)
            .bind(CONTENT_TYPE_FEEDS)
            .bind(feed_id)
            .bind(FAVORITE_STATUS_ACTIVE)
            .bind(metadata)
            .execute(&self.pool)
            .await
            .map_err(sql_error)?;
            refresh_feed_favorite_count(&self.pool, feed_id).await?;
            require_feed(&self.pool, feed_id, Some(subject)).await
        })
    }

    fn uncollect_feed<'a>(
        &'a self,
        feed_id: i64,
        subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumFeedItem> {
        Box::pin(async move {
            require_feed(&self.pool, feed_id, Some(subject)).await?;
            sqlx::query(
                r#"
                DELETE FROM content_favorite
                WHERE tenant_id = ?1
                  AND organization_id = ?2
                  AND user_id = ?3
                  AND content_type = ?4
                  AND content_id = ?5
                "#,
            )
            .bind(subject.tenant_id)
            .bind(subject.organization_id)
            .bind(subject.user_id)
            .bind(CONTENT_TYPE_FEEDS)
            .bind(feed_id)
            .execute(&self.pool)
            .await
            .map_err(sql_error)?;
            refresh_feed_favorite_count(&self.pool, feed_id).await?;
            require_feed(&self.pool, feed_id, Some(subject)).await
        })
    }

    fn share_feed<'a>(
        &'a self,
        feed_id: i64,
        subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumFeedItem> {
        Box::pin(async move {
            require_feed(&self.pool, feed_id, Some(subject)).await?;
            sqlx::query(
                r#"
                UPDATE content_forum_post
                SET share_count = COALESCE(share_count, 0) + 1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?3
                  AND COALESCE(status, 0) = ?4
                  AND tenant_id = ?1
                  AND organization_id = ?2
                "#,
            )
            .bind(subject.tenant_id)
            .bind(subject.organization_id)
            .bind(feed_id)
            .bind(FEEDS_STATUS_PUBLISHED)
            .execute(&self.pool)
            .await
            .map_err(sql_error)?;
            require_feed(&self.pool, feed_id, Some(subject)).await
        })
    }
}

impl ForumCommentReadStore for SqliteForumStore {
    fn load_comments<'a>(
        &'a self,
        content_type: String,
        content_id: i64,
        query: Option<ForumFeedQuery>,
        subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, ForumCommentPage> {
        Box::pin(async move {
            let content_type = required_content_type_code(&content_type)?;
            load_comment_page(&self.pool, content_type, content_id, None, query, subject).await
        })
    }

    fn load_comment_replies<'a>(
        &'a self,
        comment_id: i64,
        query: Option<ForumFeedQuery>,
        subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, ForumCommentPage> {
        Box::pin(async move {
            let parent = load_comment_parent(&self.pool, comment_id, subject)
                .await?
                .ok_or_else(|| DomainError::not_found("comment was not found"))?;
            load_comment_page(
                &self.pool,
                parent.content_type,
                parent.content_id,
                Some(comment_id),
                query,
                subject,
            )
            .await
        })
    }

    fn load_comment_detail<'a>(
        &'a self,
        comment_id: i64,
        subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, Option<ForumCommentDetail>> {
        Box::pin(async move {
            let scope = read_scope(subject);
            let sql = format!(
                r#"
                {select}
                WHERE id = ?3
                  AND COALESCE(status, 0) = ?4
                  AND {scope_filter}
                LIMIT 1
                "#,
                select = COMMENT_SELECT_COLUMNS,
                scope_filter = sqlite_scope_filter("content_comment"),
            );
            let row = sqlx::query(sql.as_str())
                .bind(scope.tenant_id)
                .bind(scope.organization_id)
                .bind(comment_id)
                .bind(COMMENT_STATUS_PUBLISHED)
                .fetch_optional(&self.pool)
                .await
                .map_err(sql_error)?;
            let Some(row) = row else {
                return Ok(None);
            };
            let replies =
                load_comment_items_by_parent(&self.pool, comment_id, DEFAULT_PAGE_SIZE, 0, subject)
                    .await?;
            Ok(Some(comment_detail_from_row(&row, replies)))
        })
    }

    fn load_my_comments<'a>(
        &'a self,
        query: Option<ForumFeedQuery>,
        subject: ForumSubject,
    ) -> ForumReadFuture<'a, ForumCommentPage> {
        Box::pin(async move {
            let (page, size, offset) = page_window(query.as_ref());
            let rows = sqlx::query(
                r#"
                SELECT
                    id, uuid, tenant_id, organization_id, user_id, parent_id,
                    content, content_type, content_id, status, likes, reply_count, is_top,
                    CAST(COALESCE(author, '') AS TEXT) AS author,
                    CAST(COALESCE(created_at, '') AS TEXT) AS created_at
                FROM content_comment
                WHERE tenant_id = ?1
                  AND organization_id = ?2
                  AND user_id = ?3
                  AND COALESCE(status, 0) = ?4
                ORDER BY created_at DESC, id DESC
                LIMIT ?5 OFFSET ?6
                "#,
            )
            .bind(subject.tenant_id)
            .bind(subject.organization_id)
            .bind(subject.user_id)
            .bind(COMMENT_STATUS_PUBLISHED)
            .bind(size)
            .bind(offset)
            .fetch_all(&self.pool)
            .await
            .map_err(sql_error)?;
            let total = sqlx::query_scalar::<_, i64>(
                r#"
                SELECT COUNT(1)
                FROM content_comment
                WHERE tenant_id = ?1
                  AND organization_id = ?2
                  AND user_id = ?3
                  AND COALESCE(status, 0) = ?4
                "#,
            )
            .bind(subject.tenant_id)
            .bind(subject.organization_id)
            .bind(subject.user_id)
            .bind(COMMENT_STATUS_PUBLISHED)
            .fetch_one(&self.pool)
            .await
            .map_err(sql_error)?;
            let items: Vec<ForumCommentItem> = rows.iter().map(comment_item_from_row).collect();
            Ok(ForumCommentPage {
                content: items.clone(),
                items,
                total_elements: total,
                page,
                size,
            })
        })
    }

    fn load_comment_statistics<'a>(
        &'a self,
        content_type: String,
        content_id: i64,
        subject: Option<ForumSubject>,
    ) -> ForumReadFuture<'a, ForumCommentStatistics> {
        Box::pin(async move {
            let content_type = required_content_type_code(&content_type)?;
            let scope = read_scope(subject);
            let total = sqlx::query_scalar::<_, i64>(
                format!(
                    r#"
                SELECT COUNT(1)
                FROM content_comment
                WHERE content_type = ?3
                  AND content_id = ?4
                  AND COALESCE(status, 0) = ?5
                  AND {scope_filter}
                "#,
                    scope_filter = sqlite_scope_filter("content_comment"),
                )
                .as_str(),
            )
            .bind(scope.tenant_id)
            .bind(scope.organization_id)
            .bind(content_type)
            .bind(content_id)
            .bind(COMMENT_STATUS_PUBLISHED)
            .fetch_one(&self.pool)
            .await
            .map_err(sql_error)?;
            Ok(ForumCommentStatistics {
                total_comments: total,
            })
        })
    }
}

impl ForumCommentCommandStore for SqliteForumStore {
    fn create_comment<'a>(
        &'a self,
        command: CreateForumCommentCommand,
        subject: Option<ForumSubject>,
    ) -> ForumCommandFuture<'a, ForumCommentItem> {
        Box::pin(async move {
            let subject = effective_subject(command.subject, subject)?;
            let content_type = required_content_type_code(&command.content_type)?;
            let comment_id = next_entity_id();
            let author = author_json(subject);
            let path = if let Some(parent_id) = command.parent_id {
                let parent = load_comment_parent(&self.pool, parent_id, Some(subject))
                    .await?
                    .ok_or_else(|| DomainError::not_found("parent comment was not found"))?;
                if parent.content_type != content_type || parent.content_id != command.content_id {
                    return Err(DomainError::new(
                        "parent comment does not belong to target content",
                    ));
                }
                format!(
                    "{}/{}",
                    parent.path.unwrap_or_else(|| parent_id.to_string()),
                    comment_id
                )
            } else {
                comment_id.to_string()
            };

            sqlx::query(
                r#"
                INSERT INTO content_comment
                    (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, user_id,
                     parent_id, path, sort_weight, body, content_type, content_id, status,
                     likes, reply_count, is_top, ip_address, device_info, author)
                VALUES
                    (?1, ?2, ?3, ?3, 0, ?4, ?5, 1, ?6,
                     ?7, ?8, 0, ?9, ?10, ?11, ?12,
                     0, 0, 0, ?13, ?14, ?15)
                "#,
            )
            .bind(comment_id)
            .bind(&command.uuid)
            .bind(&command.requested_at)
            .bind(subject.tenant_id)
            .bind(subject.organization_id)
            .bind(subject.user_id)
            .bind(command.parent_id)
            .bind(path)
            .bind(&command.content)
            .bind(content_type)
            .bind(command.content_id)
            .bind(COMMENT_STATUS_PUBLISHED)
            .bind(command.ip_address.as_deref())
            .bind(command.device_info.as_deref())
            .bind(author.to_string())
            .execute(&self.pool)
            .await
            .map_err(sql_error)?;

            if let Some(parent_id) = command.parent_id {
                sqlx::query(
                    r#"
                    UPDATE content_comment
                    SET reply_count = COALESCE(reply_count, 0) + 1,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?1
                    "#,
                )
                .bind(parent_id)
                .execute(&self.pool)
                .await
                .map_err(sql_error)?;
            }
            increment_target_comment_count(&self.pool, content_type, command.content_id).await?;
            require_comment_item(&self.pool, comment_id, Some(subject)).await
        })
    }

    fn delete_comment<'a>(
        &'a self,
        comment_id: i64,
        subject: ForumSubject,
    ) -> ForumCommandFuture<'a, bool> {
        Box::pin(async move {
            let parent = load_comment_parent(&self.pool, comment_id, Some(subject)).await?;
            let rows = sqlx::query(
                r#"
                UPDATE content_comment
                SET status = ?1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?2
                  AND tenant_id = ?3
                  AND organization_id = ?4
                  AND user_id = ?5
                  AND COALESCE(status, 0) <> ?1
                "#,
            )
            .bind(COMMENT_STATUS_DELETED)
            .bind(comment_id)
            .bind(subject.tenant_id)
            .bind(subject.organization_id)
            .bind(subject.user_id)
            .execute(&self.pool)
            .await
            .map_err(sql_error)?
            .rows_affected();

            if rows > 0 {
                if let Some(parent) = parent {
                    decrement_target_comment_count(
                        &self.pool,
                        parent.content_type,
                        parent.content_id,
                    )
                    .await?;
                    if let Some(parent_id) = parent.parent_id {
                        sqlx::query(
                            r#"
                            UPDATE content_comment
                            SET reply_count = MAX(COALESCE(reply_count, 0) - 1, 0),
                                updated_at = CURRENT_TIMESTAMP
                            WHERE id = ?1
                            "#,
                        )
                        .bind(parent_id)
                        .execute(&self.pool)
                        .await
                        .map_err(sql_error)?;
                    }
                }
            }
            Ok(rows > 0)
        })
    }

    fn like_comment<'a>(
        &'a self,
        comment_id: i64,
        subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumCommentItem> {
        Box::pin(async move {
            require_comment_item(&self.pool, comment_id, Some(subject)).await?;
            upsert_like_vote(
                &self.pool,
                subject,
                CONTENT_TYPE_COMMENTS,
                comment_id,
                format!("forum-comment-like-{comment_id}-{}", subject.user_id),
            )
            .await?;
            refresh_comment_like_count(&self.pool, comment_id).await?;
            require_comment_item(&self.pool, comment_id, Some(subject)).await
        })
    }

    fn unlike_comment<'a>(
        &'a self,
        comment_id: i64,
        subject: ForumSubject,
    ) -> ForumCommandFuture<'a, ForumCommentItem> {
        Box::pin(async move {
            require_comment_item(&self.pool, comment_id, Some(subject)).await?;
            delete_like_vote(&self.pool, subject, CONTENT_TYPE_COMMENTS, comment_id).await?;
            refresh_comment_like_count(&self.pool, comment_id).await?;
            require_comment_item(&self.pool, comment_id, Some(subject)).await
        })
    }

    fn pin_comment<'a>(
        &'a self,
        comment_id: i64,
        subject: ForumSubject,
        pinned: bool,
    ) -> ForumCommandFuture<'a, ForumCommentItem> {
        Box::pin(async move {
            let rows = sqlx::query(
                r#"
                UPDATE content_comment
                SET is_top = ?1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?2
                  AND tenant_id = ?3
                  AND organization_id = ?4
                  AND user_id = ?5
                  AND COALESCE(status, 0) = ?6
                "#,
            )
            .bind(pinned)
            .bind(comment_id)
            .bind(subject.tenant_id)
            .bind(subject.organization_id)
            .bind(subject.user_id)
            .bind(COMMENT_STATUS_PUBLISHED)
            .execute(&self.pool)
            .await
            .map_err(sql_error)?
            .rows_affected();
            if rows == 0 {
                return Err(DomainError::not_found("comment was not found"));
            }
            require_comment_item(&self.pool, comment_id, Some(subject)).await
        })
    }
}

const COMMENT_SELECT_COLUMNS: &str = r#"
    SELECT
        id, uuid, tenant_id, organization_id, user_id, parent_id,
        content, content_type, content_id, status, likes, reply_count, is_top,
        COALESCE(ip_address, '') AS ip_address,
        COALESCE(device_info, '') AS device_info,
        CAST(COALESCE(author, '') AS TEXT) AS author,
        CAST(COALESCE(created_at, '') AS TEXT) AS created_at,
        CAST(COALESCE(updated_at, '') AS TEXT) AS updated_at
    FROM content_comment
"#;

async fn load_feed_by_id(
    pool: &SqlitePool,
    feed_id: i64,
    subject: Option<ForumSubject>,
) -> DomainResult<Option<ForumFeedItem>> {
    let scope = read_scope(subject);
    let row = sqlx::query(
        format!(
            r#"
            SELECT
                f.id,
                f.uuid,
                f.tenant_id,
                f.organization_id,
                f.user_id,
                COALESCE(f.title, '') AS title,
                COALESCE(f.summary, '') AS summary,
                COALESCE(f.category_id, 0) AS category_id,
                COALESCE(f.content_type, 0) AS content_type,
                COALESCE(f.content_id, 0) AS content_id,
                CAST(COALESCE(f.cover_resources, '') AS TEXT) AS cover_resources,
                CAST(COALESCE(f.tags, '') AS TEXT) AS tags,
                CAST(COALESCE(f.author, '') AS TEXT) AS author,
                COALESCE(f.view_count, 0) AS view_count,
                COALESCE(f.like_count, 0) AS like_count,
                COALESCE(f.comment_count, 0) AS comment_count,
                COALESCE(f.share_count, 0) AS share_count,
                COALESCE(f.favorite_count, 0) AS favorite_count,
                COALESCE(f.is_top, 0) AS is_top,
                COALESCE(f.is_hot, 0) AS is_hot,
                COALESCE(f.is_recommended, 0) AS is_recommended,
                CAST(COALESCE(f.created_at, '') AS TEXT) AS created_at,
                CAST(COALESCE(f.updated_at, '') AS TEXT) AS updated_at,
                EXISTS (
                    SELECT 1
                    FROM content_reaction v
                    WHERE v.tenant_id = f.tenant_id
                      AND v.organization_id = f.organization_id
                      AND v.user_id = ?3
                      AND v.target_type = ?4
                      AND v.target_id = f.id
                      AND v.reaction_type = 2
                      AND v.cancelled_at IS NULL
                ) AS is_liked,
                EXISTS (
                    SELECT 1
                    FROM content_favorite fav
                    WHERE fav.tenant_id = f.tenant_id
                      AND fav.organization_id = f.organization_id
                      AND fav.user_id = ?3
                      AND fav.content_type = ?4
                      AND fav.content_id = f.id
                      AND COALESCE(fav.status, 0) = ?5
                ) AS is_collected
            FROM content_forum_post f
            WHERE f.id = ?6
              AND COALESCE(f.status, 0) = ?7
              AND {scope_filter}
            LIMIT 1
            "#,
            scope_filter = sqlite_scope_filter("f"),
        )
        .as_str(),
    )
    .bind(scope.tenant_id)
    .bind(scope.organization_id)
    .bind(scope.user_id)
    .bind(CONTENT_TYPE_FEEDS)
    .bind(FAVORITE_STATUS_ACTIVE)
    .bind(feed_id)
    .bind(FEEDS_STATUS_PUBLISHED)
    .fetch_optional(pool)
    .await
    .map_err(sql_error)?;

    Ok(row.as_ref().map(feed_from_row))
}

async fn require_feed(
    pool: &SqlitePool,
    feed_id: i64,
    subject: Option<ForumSubject>,
) -> DomainResult<ForumFeedItem> {
    load_feed_by_id(pool, feed_id, subject)
        .await?
        .ok_or_else(|| DomainError::not_found("feed was not found"))
}

async fn increment_feed_view_count(
    pool: &SqlitePool,
    feed_id: i64,
    subject: Option<ForumSubject>,
) -> DomainResult<()> {
    let scope = read_scope(subject);
    sqlx::query(
        format!(
            r#"
        UPDATE content_forum_post
        SET view_count = COALESCE(view_count, 0) + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?3
          AND COALESCE(status, 0) = ?4
          AND {scope_filter}
        "#,
            scope_filter = sqlite_scope_filter("content_forum_post"),
        )
        .as_str(),
    )
    .bind(scope.tenant_id)
    .bind(scope.organization_id)
    .bind(feed_id)
    .bind(FEEDS_STATUS_PUBLISHED)
    .execute(pool)
    .await
    .map_err(sql_error)?;
    Ok(())
}

async fn feed_is_collected(
    pool: &SqlitePool,
    feed_id: i64,
    subject: ForumSubject,
) -> DomainResult<bool> {
    let count = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT COUNT(1)
        FROM content_favorite
        WHERE tenant_id = ?1
          AND organization_id = ?2
          AND user_id = ?3
          AND content_type = ?4
          AND content_id = ?5
          AND COALESCE(status, 0) = ?6
        "#,
    )
    .bind(subject.tenant_id)
    .bind(subject.organization_id)
    .bind(subject.user_id)
    .bind(CONTENT_TYPE_FEEDS)
    .bind(feed_id)
    .bind(FAVORITE_STATUS_ACTIVE)
    .fetch_one(pool)
    .await
    .map_err(sql_error)?;
    Ok(count > 0)
}

async fn load_forum_overview(
    pool: &SqlitePool,
    subject: Option<ForumSubject>,
) -> DomainResult<ForumOverview> {
    let scope = read_scope(subject);
    let sql = format!(
        r#"
        WITH published_feeds AS (
            SELECT id, user_id, created_at, updated_at
            FROM content_forum_post
            WHERE COALESCE(status, 0) = ?3
              AND {feed_scope_filter}
        ),
        published_comments AS (
            SELECT user_id, created_at, updated_at
            FROM content_comment
            WHERE COALESCE(status, 0) = ?4
              AND COALESCE(content_type, 0) IN (5, 22)
              AND {comment_scope_filter}
        ),
        activity_users AS (
            SELECT user_id FROM published_feeds WHERE COALESCE(user_id, 0) > 0
            UNION
            SELECT user_id FROM published_comments WHERE COALESCE(user_id, 0) > 0
        ),
        recent_activity_users AS (
            SELECT user_id
            FROM published_feeds
            WHERE COALESCE(user_id, 0) > 0
              AND datetime(replace(replace(COALESCE(updated_at, created_at), 'T', ' '), 'Z', '')) >= datetime('now', '-7 days')
            UNION
            SELECT user_id
            FROM published_comments
            WHERE COALESCE(user_id, 0) > 0
              AND datetime(replace(replace(COALESCE(updated_at, created_at), 'T', ' '), 'Z', '')) >= datetime('now', '-7 days')
        )
        SELECT
            (SELECT COUNT(1) FROM published_feeds) AS total_posts,
            (SELECT COUNT(1) FROM published_comments) AS total_comments,
            (SELECT COUNT(1) FROM activity_users) AS member_count,
            (SELECT COUNT(1) FROM recent_activity_users) AS online_members
        "#,
        feed_scope_filter = sqlite_scope_filter("content_forum_post"),
        comment_scope_filter = sqlite_scope_filter("content_comment"),
    );
    let row = sqlx::query(sql.as_str())
        .bind(scope.tenant_id)
        .bind(scope.organization_id)
        .bind(FEEDS_STATUS_PUBLISHED)
        .bind(COMMENT_STATUS_PUBLISHED)
        .fetch_one(pool)
        .await
        .map_err(sql_error)?;
    Ok(ForumOverview {
        stats: ForumOverviewStats {
            total_posts: integer_cell(&row, "total_posts"),
            total_comments: integer_cell(&row, "total_comments"),
            member_count: integer_cell(&row, "member_count"),
            online_members: integer_cell(&row, "online_members"),
        },
        source: ForumOverviewSource {
            source_label: "Live forum data".to_owned(),
            source_description: "Derived from PlusFeeds, PlusComments, vote, and favorite tables."
                .to_owned(),
            source_tables: vec![
                "content_forum_post".to_owned(),
                "content_comment".to_owned(),
                "content_reaction".to_owned(),
                "content_favorite".to_owned(),
            ],
            observed_at: current_timestamp_string(),
        },
    })
}

async fn upsert_like_vote(
    pool: &SqlitePool,
    subject: ForumSubject,
    content_type: i64,
    content_id: i64,
    uuid: String,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        INSERT INTO content_reaction
            (id, uuid, tenant_id, organization_id, user_id, status, metadata, target_type,
             target_id, reaction_type, reaction_value)
        VALUES
            (?1, ?2, ?3, ?4, ?5, 1, '{}', ?6, ?7, 2, '1')
        ON CONFLICT(tenant_id, organization_id, user_id, target_type, target_id, reaction_type) DO UPDATE SET
            reaction_value = '1',
            cancelled_at = NULL
        "#,
    )
    .bind(next_entity_id())
    .bind(uuid)
    .bind(subject.tenant_id)
    .bind(subject.organization_id)
    .bind(subject.user_id)
    .bind(content_type)
    .bind(content_id)
    .execute(pool)
    .await
    .map_err(sql_error)?;
    Ok(())
}

async fn delete_like_vote(
    pool: &SqlitePool,
    subject: ForumSubject,
    content_type: i64,
    content_id: i64,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        DELETE FROM content_reaction
        WHERE tenant_id = ?1
          AND organization_id = ?2
          AND user_id = ?3
          AND target_type = ?4
          AND target_id = ?5
          AND reaction_type = 2
        "#,
    )
    .bind(subject.tenant_id)
    .bind(subject.organization_id)
    .bind(subject.user_id)
    .bind(content_type)
    .bind(content_id)
    .execute(pool)
    .await
    .map_err(sql_error)?;
    Ok(())
}

async fn refresh_feed_like_count(pool: &SqlitePool, feed_id: i64) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE content_forum_post
        SET like_count = (
                SELECT COUNT(1)
                FROM content_reaction
                WHERE target_type = ?1
                  AND target_id = ?2
                  AND reaction_type = 2
                  AND cancelled_at IS NULL
            ),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?2
        "#,
    )
    .bind(CONTENT_TYPE_FEEDS)
    .bind(feed_id)
    .execute(pool)
    .await
    .map_err(sql_error)?;
    Ok(())
}

async fn refresh_feed_favorite_count(pool: &SqlitePool, feed_id: i64) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE content_forum_post
        SET favorite_count = (
                SELECT COUNT(1)
                FROM content_favorite
                WHERE content_type = ?1
                  AND content_id = ?2
                  AND COALESCE(status, 0) = ?3
            ),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?2
        "#,
    )
    .bind(CONTENT_TYPE_FEEDS)
    .bind(feed_id)
    .bind(FAVORITE_STATUS_ACTIVE)
    .execute(pool)
    .await
    .map_err(sql_error)?;
    Ok(())
}

async fn refresh_comment_like_count(pool: &SqlitePool, comment_id: i64) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE content_comment
        SET likes = (
                SELECT COUNT(1)
                FROM content_reaction
                WHERE target_type = ?1
                  AND target_id = ?2
                  AND reaction_type = 2
                  AND cancelled_at IS NULL
            ),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?2
        "#,
    )
    .bind(CONTENT_TYPE_COMMENTS)
    .bind(comment_id)
    .execute(pool)
    .await
    .map_err(sql_error)?;
    Ok(())
}

async fn increment_target_comment_count(
    pool: &SqlitePool,
    content_type: i64,
    content_id: i64,
) -> DomainResult<()> {
    if content_type == CONTENT_TYPE_FEEDS {
        sqlx::query(
            r#"
            UPDATE content_forum_post
            SET comment_count = COALESCE(comment_count, 0) + 1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?1
            "#,
        )
        .bind(content_id)
        .execute(pool)
        .await
        .map_err(sql_error)?;
    }
    Ok(())
}

async fn decrement_target_comment_count(
    pool: &SqlitePool,
    content_type: i64,
    content_id: i64,
) -> DomainResult<()> {
    if content_type == CONTENT_TYPE_FEEDS {
        sqlx::query(
            r#"
            UPDATE content_forum_post
            SET comment_count = MAX(COALESCE(comment_count, 0) - 1, 0),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?1
            "#,
        )
        .bind(content_id)
        .execute(pool)
        .await
        .map_err(sql_error)?;
    }
    Ok(())
}

async fn load_comment_page(
    pool: &SqlitePool,
    content_type: i64,
    content_id: i64,
    parent_id: Option<i64>,
    query: Option<ForumFeedQuery>,
    subject: Option<ForumSubject>,
) -> DomainResult<ForumCommentPage> {
    let scope = read_scope(subject);
    let (page, size, offset) = page_window(query.as_ref());
    let parent_filter = if parent_id.is_some() {
        "parent_id = ?6"
    } else {
        "parent_id IS NULL"
    };
    let sql = format!(
        r#"
        {select}
        WHERE content_type = ?3
          AND content_id = ?4
          AND COALESCE(status, 0) = ?5
          AND {parent_filter}
          AND {scope_filter}
        ORDER BY COALESCE(is_top, 0) DESC, created_at ASC, id ASC
        LIMIT ?7 OFFSET ?8
        "#,
        select = COMMENT_SELECT_COLUMNS,
        scope_filter = sqlite_scope_filter("content_comment"),
    );
    let rows = sqlx::query(sql.as_str())
        .bind(scope.tenant_id)
        .bind(scope.organization_id)
        .bind(content_type)
        .bind(content_id)
        .bind(COMMENT_STATUS_PUBLISHED)
        .bind(parent_id)
        .bind(size)
        .bind(offset)
        .fetch_all(pool)
        .await
        .map_err(sql_error)?;

    let count_sql = format!(
        r#"
        SELECT COUNT(1)
        FROM content_comment
        WHERE content_type = ?3
          AND content_id = ?4
          AND COALESCE(status, 0) = ?5
          AND {parent_filter}
          AND {scope_filter}
        "#,
        scope_filter = sqlite_scope_filter("content_comment"),
    );
    let total = sqlx::query_scalar::<_, i64>(count_sql.as_str())
        .bind(scope.tenant_id)
        .bind(scope.organization_id)
        .bind(content_type)
        .bind(content_id)
        .bind(COMMENT_STATUS_PUBLISHED)
        .bind(parent_id)
        .fetch_one(pool)
        .await
        .map_err(sql_error)?;
    let items: Vec<ForumCommentItem> = rows.iter().map(comment_item_from_row).collect();
    Ok(ForumCommentPage {
        content: items.clone(),
        items,
        total_elements: total,
        page,
        size,
    })
}

async fn load_comment_items_by_parent(
    pool: &SqlitePool,
    parent_id: i64,
    limit: i64,
    offset: i64,
    subject: Option<ForumSubject>,
) -> DomainResult<Vec<ForumCommentItem>> {
    let scope = read_scope(subject);
    let rows = sqlx::query(
        format!(
            r#"
            {select}
            WHERE parent_id = ?3
              AND COALESCE(status, 0) = ?4
              AND {scope_filter}
            ORDER BY created_at ASC, id ASC
            LIMIT ?5 OFFSET ?6
            "#,
            select = COMMENT_SELECT_COLUMNS,
            scope_filter = sqlite_scope_filter("content_comment"),
        )
        .as_str(),
    )
    .bind(scope.tenant_id)
    .bind(scope.organization_id)
    .bind(parent_id)
    .bind(COMMENT_STATUS_PUBLISHED)
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await
    .map_err(sql_error)?;
    Ok(rows.iter().map(comment_item_from_row).collect())
}

#[derive(Debug, Clone)]
struct CommentParent {
    content_type: i64,
    content_id: i64,
    parent_id: Option<i64>,
    path: Option<String>,
}

async fn load_comment_parent(
    pool: &SqlitePool,
    comment_id: i64,
    subject: Option<ForumSubject>,
) -> DomainResult<Option<CommentParent>> {
    let scope = read_scope(subject);
    let row = sqlx::query(
        format!(
            r#"
        SELECT content_type, content_id, parent_id, path
        FROM content_comment
        WHERE id = ?3
          AND COALESCE(status, 0) = ?4
          AND {scope_filter}
        LIMIT 1
        "#,
            scope_filter = sqlite_scope_filter("content_comment"),
        )
        .as_str(),
    )
    .bind(scope.tenant_id)
    .bind(scope.organization_id)
    .bind(comment_id)
    .bind(COMMENT_STATUS_PUBLISHED)
    .fetch_optional(pool)
    .await
    .map_err(sql_error)?;
    Ok(row.map(|row| CommentParent {
        content_type: integer_cell(&row, "content_type"),
        content_id: integer_cell(&row, "content_id"),
        parent_id: optional_integer_cell(&row, "parent_id"),
        path: optional_string_cell(&row, "path"),
    }))
}

async fn require_comment_item(
    pool: &SqlitePool,
    comment_id: i64,
    subject: Option<ForumSubject>,
) -> DomainResult<ForumCommentItem> {
    let scope = read_scope(subject);
    let sql = format!(
        r#"
        {select}
        WHERE id = ?3
          AND COALESCE(status, 0) = ?4
          AND {scope_filter}
        LIMIT 1
        "#,
        select = COMMENT_SELECT_COLUMNS,
        scope_filter = sqlite_scope_filter("content_comment"),
    );
    let row = sqlx::query(sql.as_str())
        .bind(scope.tenant_id)
        .bind(scope.organization_id)
        .bind(comment_id)
        .bind(COMMENT_STATUS_PUBLISHED)
        .fetch_optional(pool)
        .await
        .map_err(sql_error)?;
    row.as_ref()
        .map(comment_item_from_row)
        .ok_or_else(|| DomainError::not_found("comment was not found"))
}

fn feed_from_row(row: &sqlx::sqlite::SqliteRow) -> ForumFeedItem {
    let user_id = integer_cell(row, "user_id");
    ForumFeedItem {
        id: integer_cell(row, "id"),
        title: string_cell(row, "title"),
        content: string_cell(row, "summary"),
        summary: string_cell(row, "summary"),
        cover: first_cover_media_resource(&string_cell(row, "cover_resources")),
        content_type: content_type_slug(integer_cell(row, "content_type")).to_owned(),
        category_id: integer_cell(row, "category_id"),
        tags: parse_tags(&string_cell(row, "tags")),
        author: parse_author(&string_cell(row, "author"), user_id),
        view_count: integer_cell(row, "view_count"),
        like_count: integer_cell(row, "like_count"),
        comment_count: integer_cell(row, "comment_count"),
        share_count: integer_cell(row, "share_count"),
        is_liked: bool_cell(row, "is_liked"),
        is_collected: bool_cell(row, "is_collected"),
        is_top: bool_cell(row, "is_top"),
        is_hot: bool_cell(row, "is_hot"),
        is_recommended: bool_cell(row, "is_recommended"),
        created_at: string_cell(row, "created_at"),
        updated_at: string_cell(row, "updated_at"),
    }
}

fn comment_item_from_row(row: &sqlx::sqlite::SqliteRow) -> ForumCommentItem {
    let user_id = integer_cell(row, "user_id");
    ForumCommentItem {
        comment_id: integer_cell(row, "id").to_string(),
        content: string_cell(row, "content"),
        content_type: content_type_name(integer_cell(row, "content_type")).to_owned(),
        content_id: integer_cell(row, "content_id"),
        user_id,
        status: comment_status_name(integer_cell(row, "status")).to_owned(),
        likes: integer_cell(row, "likes"),
        reply_count: integer_cell(row, "reply_count"),
        is_top: bool_cell(row, "is_top"),
        parent_id: optional_integer_cell(row, "parent_id"),
        author: parse_author(&string_cell(row, "author"), user_id),
        created_at: string_cell(row, "created_at"),
    }
}

fn comment_detail_from_row(
    row: &sqlx::sqlite::SqliteRow,
    replies: Vec<ForumCommentItem>,
) -> ForumCommentDetail {
    let item = comment_item_from_row(row);
    ForumCommentDetail {
        comment_id: item.comment_id,
        content: item.content,
        content_type: item.content_type,
        content_id: item.content_id,
        user_id: item.user_id,
        status: item.status,
        likes: item.likes,
        reply_count: item.reply_count,
        is_top: item.is_top,
        parent_id: item.parent_id,
        author: item.author,
        ip_address: string_cell(row, "ip_address"),
        device_info: string_cell(row, "device_info"),
        created_at: item.created_at,
        updated_at: string_cell(row, "updated_at"),
        replies,
    }
}

#[derive(Debug, Clone, Copy)]
struct ReadScope {
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
}

fn read_scope(subject: Option<ForumSubject>) -> ReadScope {
    let subject = subject.unwrap_or(ForumSubject {
        tenant_id: 0,
        organization_id: 0,
        user_id: 0,
    });
    ReadScope {
        tenant_id: subject.tenant_id.max(0),
        organization_id: subject.organization_id.max(0),
        user_id: subject.user_id.max(0),
    }
}

fn sqlite_scope_filter(alias: &str) -> String {
    format!(
        r#"(
            (?1 > 0 AND {alias}.tenant_id = ?1 AND {alias}.organization_id = ?2)
            OR (?1 > 0 AND ?2 > 0 AND {alias}.tenant_id = ?1 AND {alias}.organization_id = 0)
            OR ({alias}.tenant_id = 0 AND {alias}.organization_id = 0)
        )"#
    )
}

fn effective_subject(
    command_subject: ForumSubject,
    request_subject: Option<ForumSubject>,
) -> DomainResult<ForumSubject> {
    if let Some(request_subject) = request_subject {
        if request_subject != command_subject {
            return Err(DomainError::new(
                "trusted request subject does not match command subject",
            ));
        }
    }
    Ok(command_subject)
}

fn next_entity_id() -> i64 {
    let millis = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_millis() as u64)
        .unwrap_or_default();
    let sequence = FORUM_ENTITY_SEQUENCE.fetch_add(1, Ordering::Relaxed) & 0xffff;
    ((millis << 16) | sequence) as i64
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

fn page_window(query: Option<&ForumFeedQuery>) -> (i64, i64, i64) {
    let page = query.and_then(|query| query.page).unwrap_or(1).max(1);
    let size = query
        .and_then(|query| query.limit.or(query.size))
        .unwrap_or(DEFAULT_PAGE_SIZE)
        .clamp(1, MAX_PAGE_SIZE);
    let offset = (page - 1) * size;
    (page, size, offset)
}

fn normalized_title(title: Option<&str>, content: &str) -> String {
    let title = title.unwrap_or_default().trim();
    if !title.is_empty() {
        return truncate_chars(title, 255);
    }
    let compact = content.split_whitespace().collect::<Vec<_>>().join(" ");
    if compact.chars().count() <= 32 {
        truncate_chars(&compact, 255)
    } else {
        format!("{}...", truncate_chars(&compact, 32))
    }
}

fn truncate_chars(value: &str, max: usize) -> String {
    value.chars().take(max).collect()
}

fn normalize_like_pattern(value: Option<&str>) -> Option<String> {
    let normalized = value?.trim().to_ascii_lowercase();
    if normalized.is_empty() {
        None
    } else {
        Some(format!(
            "%{}%",
            normalized.replace('%', "\\%").replace('_', "\\_")
        ))
    }
}

fn feed_order_by(feed_type: &str) -> &'static str {
    match feed_type.trim().to_ascii_lowercase().as_str() {
        "hot" => {
            "COALESCE(f.is_hot, 0) DESC, COALESCE(f.like_count, 0) DESC, COALESCE(f.view_count, 0) DESC, COALESCE(f.publish_time, f.created_at) DESC, f.id DESC"
        }
        "recommend" | "recommended" => {
            "COALESCE(f.is_recommended, 0) DESC, COALESCE(f.sort_order, 0) DESC, COALESCE(f.publish_time, f.created_at) DESC, f.id DESC"
        }
        "top" | "pinned" => {
            "COALESCE(f.is_top, 0) DESC, COALESCE(f.publish_time, f.created_at) DESC, f.id DESC"
        }
        "most_viewed" | "viewed" => {
            "COALESCE(f.view_count, 0) DESC, COALESCE(f.publish_time, f.created_at) DESC, f.id DESC"
        }
        "most_liked" | "liked" => {
            "COALESCE(f.like_count, 0) DESC, COALESCE(f.publish_time, f.created_at) DESC, f.id DESC"
        }
        _ => "COALESCE(f.is_top, 0) DESC, COALESCE(f.publish_time, f.created_at) DESC, f.id DESC",
    }
}

fn required_content_type_code(value: &str) -> DomainResult<i64> {
    content_type_code(value)
        .filter(|value| *value > 0)
        .ok_or_else(|| DomainError::new(format!("unsupported content type: {value}")))
}

fn content_type_code(value: &str) -> Option<i64> {
    match value.trim().to_ascii_lowercase().replace('-', "_").as_str() {
        "feeds" | "feed" | "forum" | "post" => Some(CONTENT_TYPE_FEEDS),
        "course" | "courses" => Some(CONTENT_TYPE_COURSE),
        "comments" | "comment" => Some(CONTENT_TYPE_COMMENTS),
        "all" | "" => None,
        _ => value.trim().parse::<i64>().ok(),
    }
}

fn content_type_slug(value: i64) -> &'static str {
    match value {
        CONTENT_TYPE_FEEDS => "feeds",
        CONTENT_TYPE_COURSE => "course",
        CONTENT_TYPE_COMMENTS => "comments",
        _ => "unknown",
    }
}

fn content_type_name(value: i64) -> &'static str {
    match value {
        CONTENT_TYPE_FEEDS => "FEEDS",
        CONTENT_TYPE_COURSE => "COURSE",
        CONTENT_TYPE_COMMENTS => "COMMENTS",
        _ => "DEFAULT",
    }
}

fn comment_status_name(value: i64) -> &'static str {
    match value {
        COMMENT_STATUS_PUBLISHED => "PUBLISHED",
        2 => "PENDING",
        COMMENT_STATUS_DELETED => "DELETED",
        _ => "DEFAULT",
    }
}

fn cover_resources_json(images: &[Value]) -> Value {
    json!({
        "images": images
            .iter()
            .map(|value| value_to_media_resource(value, "image"))
            .filter(media_resource_has_locator)
            .collect::<Vec<_>>()
    })
}

fn resource_list_json(images: &[Value]) -> Value {
    json!({
        "resources": images
            .iter()
            .map(|value| value_to_media_resource(value, "image"))
            .filter(media_resource_has_locator)
            .collect::<Vec<_>>()
    })
}

fn tags_json(tags: &[String]) -> Value {
    json!({
        "list": tags
            .iter()
            .map(|tag| tag.trim())
            .filter(|tag| !tag.is_empty())
            .collect::<Vec<_>>()
    })
}

fn author_json(subject: ForumSubject) -> Value {
    if subject.user_id <= 0 {
        return json!({
            "id": 0,
            "name": "Community Member",
            "avatar": Value::Null,
            "bio": Value::Null,
            "isFollowing": false
        });
    }
    json!({
        "id": subject.user_id,
        "name": format!("User-{}", subject.user_id),
        "avatar": Value::Null,
        "bio": Value::Null,
        "isFollowing": false
    })
}

fn first_cover_media_resource(raw: &str) -> Value {
    let Ok(value) = serde_json::from_str::<Value>(raw) else {
        return empty_media_resource("image");
    };
    find_media_resource_in_value(&value, "image").unwrap_or_else(|| empty_media_resource("image"))
}

fn find_media_resource_in_value(value: &Value, kind: &str) -> Option<Value> {
    match value {
        Value::String(value) => {
            Some(media_resource_from_url(value, kind)).filter(media_resource_has_locator)
        }
        Value::Array(items) => items
            .iter()
            .find_map(|value| find_media_resource_in_value(value, kind)),
        Value::Object(object) => {
            let resource = value_to_media_resource(value, kind);
            if media_resource_has_locator(&resource) {
                return Some(resource);
            }
            for key in [
                "images",
                "resources",
                "list",
                "items",
                "faceImage",
                "avatar",
            ] {
                if let Some(value) = object
                    .get(key)
                    .and_then(|value| find_media_resource_in_value(value, kind))
                {
                    return Some(value);
                }
            }
            None
        }
        _ => None,
    }
}

fn value_to_media_resource(value: &Value, kind: &str) -> Value {
    if let Value::Object(object) = value {
        if matches!(object.get("kind"), Some(Value::String(_)))
            && matches!(object.get("source"), Some(Value::String(_)))
        {
            return value.clone();
        }
    }
    media_resource_from_url(&value_to_media_url(value).unwrap_or_default(), kind)
}

fn media_resource_from_url(url: &str, kind: &str) -> Value {
    let url = url.trim();
    if url.is_empty() {
        return empty_media_resource(kind);
    }
    let source = if url.starts_with("data:") {
        "data_url"
    } else if url.contains("://") && !url.starts_with("http://") && !url.starts_with("https://") {
        "provider_asset"
    } else {
        "external_url"
    };
    json!({
        "kind": kind,
        "source": source,
        "url": url,
        "publicUrl": url,
    })
}

fn empty_media_resource(kind: &str) -> Value {
    json!({
        "kind": kind,
        "source": "external_url",
    })
}

fn media_resource_has_locator(value: &Value) -> bool {
    let Some(object) = value.as_object() else {
        return false;
    };
    ["publicUrl", "url", "uri", "objectKey", "objectBlobId", "id"]
        .iter()
        .any(|key| {
            object
                .get(*key)
                .and_then(Value::as_str)
                .map(str::trim)
                .is_some_and(|value| !value.is_empty())
        })
}

fn value_to_media_url(value: &Value) -> Option<String> {
    match value {
        Value::String(value) => Some(value.clone()),
        Value::Number(value) => Some(value.to_string()),
        Value::Object(object) => object
            .get("publicUrl")
            .or_else(|| object.get("public_url"))
            .or_else(|| object.get("url"))
            .or_else(|| object.get("uri"))
            .and_then(value_to_media_url),
        _ => None,
    }
}

fn parse_tags(raw: &str) -> Vec<String> {
    let Ok(value) = serde_json::from_str::<Value>(raw) else {
        return Vec::new();
    };
    match value {
        Value::Array(items) => strings_from_values(&items),
        Value::Object(object) => object
            .get("list")
            .or_else(|| object.get("tags"))
            .and_then(Value::as_array)
            .map(|items| strings_from_values(items))
            .unwrap_or_default(),
        _ => Vec::new(),
    }
}

fn strings_from_values(items: &[Value]) -> Vec<String> {
    items
        .iter()
        .filter_map(Value::as_str)
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned)
        .collect()
}

fn parse_author(raw: &str, fallback_user_id: i64) -> ForumAuthor {
    let value = serde_json::from_str::<Value>(raw).unwrap_or(Value::Null);
    let object = value.as_object();
    let id = object
        .and_then(|object| object.get("id"))
        .and_then(value_to_i64)
        .unwrap_or(fallback_user_id);
    let name = object
        .and_then(|object| object.get("name").or_else(|| object.get("nickname")))
        .and_then(Value::as_str)
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned)
        .unwrap_or_else(|| format!("User-{id}"));
    let avatar = object
        .and_then(|object| object.get("avatar").or_else(|| object.get("faceImage")))
        .and_then(|value| find_media_resource_in_value(value, "image"));
    let bio = object
        .and_then(|object| object.get("bio"))
        .and_then(Value::as_str)
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned);
    let is_following = object
        .and_then(|object| {
            object
                .get("isFollowing")
                .or_else(|| object.get("is_following"))
        })
        .and_then(Value::as_bool)
        .unwrap_or(false);
    ForumAuthor {
        id,
        name,
        avatar,
        bio,
        is_following,
    }
}

fn value_to_i64(value: &Value) -> Option<i64> {
    value
        .as_i64()
        .or_else(|| value.as_str().and_then(|value| value.parse::<i64>().ok()))
}

fn string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> String {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .or_else(|| {
            row.try_get::<Option<i64>, _>(column)
                .ok()
                .flatten()
                .map(|value| value.to_string())
        })
        .unwrap_or_default()
}

fn optional_string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .filter(|value| !value.trim().is_empty())
}

fn integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> i64 {
    optional_integer_cell(row, column).unwrap_or_default()
}

fn optional_integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<i64> {
    row.try_get::<Option<i64>, _>(column)
        .ok()
        .flatten()
        .or_else(|| {
            row.try_get::<Option<i32>, _>(column)
                .ok()
                .flatten()
                .map(i64::from)
        })
        .or_else(|| string_cell(row, column).parse::<i64>().ok())
}

fn bool_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> bool {
    row.try_get::<Option<bool>, _>(column)
        .ok()
        .flatten()
        .or_else(|| optional_integer_cell(row, column).map(|value| value != 0))
        .unwrap_or(false)
}

fn sql_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}
