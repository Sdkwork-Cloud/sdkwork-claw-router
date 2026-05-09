use std::collections::BTreeSet;

use serde::Deserialize;
use serde_json::Value;
use sha2::{Digest, Sha256};
use sqlx::{PgPool, Row, SqlitePool};

const FORUM_SEED_JSON: &str = include_str!("../../../../../data/forum/forum-seed.json");

const SYSTEM_DATA_SCOPE: i32 = 0;
const CONTENT_TYPE_FEEDS: i32 = 5;
const CONTENT_TYPE_COMMENTS: i32 = 22;
const FEEDS_STATUS_PUBLISHED: i32 = 2;
const FEEDS_STATUS_DELETED: i32 = 3;
const COMMENT_STATUS_PUBLISHED: i32 = 1;
const COMMENT_STATUS_DELETED: i32 = 3;
const FAVORITE_STATUS_ACTIVE: i32 = 1;
const FAVORITE_STATUS_DELETED: i32 = 0;
const VOTE_ROW_ID_BASE: i64 = 520_000;
const FAVORITE_ROW_ID_BASE: i64 = 530_000;

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ForumSeedBundle {
    catalog_code: String,
    catalog_version: String,
    schema_version: String,
    generated_at: String,
    source: Option<Value>,
    feeds: Vec<ForumFeedSeed>,
    comments: Vec<ForumCommentSeed>,
    votes: Vec<ForumVoteSeed>,
    favorites: Vec<ForumFavoriteSeed>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ForumFeedSeed {
    id: i64,
    uuid: String,
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
    title: String,
    summary: String,
    content: String,
    category_id: i64,
    tags: Vec<String>,
    author: ForumAuthorSeed,
    view_count: i64,
    like_count: i64,
    comment_count: i64,
    share_count: i64,
    favorite_count: i64,
    is_top: bool,
    is_hot: bool,
    is_recommended: bool,
    sort_order: i32,
    created_at: String,
    updated_at: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ForumCommentSeed {
    id: i64,
    uuid: String,
    feed_id: i64,
    user_id: i64,
    parent_id: Option<i64>,
    content: String,
    likes: i64,
    reply_count: i64,
    is_top: bool,
    author: ForumAuthorSeed,
    created_at: String,
    updated_at: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ForumAuthorSeed {
    id: i64,
    name: String,
    avatar: Option<String>,
    bio: Option<String>,
    #[serde(default)]
    is_following: bool,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ForumVoteSeed {
    uuid: String,
    user_id: i64,
    content_id: i64,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ForumFavoriteSeed {
    uuid: String,
    user_id: i64,
    content_id: i64,
    title: String,
}

#[derive(Debug, Clone)]
struct ContentVoteRow {
    id: i64,
    uuid: String,
    user_id: i64,
    content_type: i32,
    content_id: i64,
}

#[derive(Debug, Clone)]
struct FavoriteRow {
    id: i64,
    uuid: String,
    user_id: i64,
    content_id: i64,
    title: String,
}

impl ForumSeedBundle {
    fn load() -> Result<Self, serde_json::Error> {
        serde_json::from_str(FORUM_SEED_JSON)
    }

    fn payload(&self) -> String {
        serde_json::json!({
            "catalogCode": self.catalog_code,
            "catalogVersion": self.catalog_version,
            "schemaVersion": self.schema_version,
            "generatedAt": self.generated_at,
            "source": self.source,
            "feedCount": self.feeds.len(),
            "commentCount": self.comments.len(),
            "voteCount": self.vote_rows().len(),
            "favoriteCount": self.favorite_rows().len(),
            "sourceHash": self.source_hash(),
        })
        .to_string()
    }

    fn vote_rows(&self) -> Vec<ContentVoteRow> {
        let mut rows = Vec::new();
        for item in &self.votes {
            rows.push(ContentVoteRow {
                id: 0,
                uuid: item.uuid.clone(),
                user_id: item.user_id,
                content_type: CONTENT_TYPE_FEEDS,
                content_id: item.content_id,
            });
        }

        for feed in &self.feeds {
            append_generated_votes(
                &mut rows,
                "feed",
                CONTENT_TYPE_FEEDS,
                feed.id,
                feed.like_count,
            );
        }
        for comment in &self.comments {
            append_generated_votes(
                &mut rows,
                "comment",
                CONTENT_TYPE_COMMENTS,
                comment.id,
                comment.likes,
            );
        }

        rows.into_iter()
            .enumerate()
            .map(|(index, mut row)| {
                row.id = VOTE_ROW_ID_BASE + index as i64 + 1;
                row
            })
            .collect()
    }

    fn favorite_rows(&self) -> Vec<FavoriteRow> {
        let mut rows = self
            .favorites
            .iter()
            .map(|item| FavoriteRow {
                id: 0,
                uuid: item.uuid.clone(),
                user_id: item.user_id,
                content_id: item.content_id,
                title: item.title.clone(),
            })
            .collect::<Vec<_>>();

        for feed in &self.feeds {
            append_generated_favorites(&mut rows, feed);
        }

        rows.into_iter()
            .enumerate()
            .map(|(index, mut row)| {
                row.id = FAVORITE_ROW_ID_BASE + index as i64 + 1;
                row
            })
            .collect()
    }

    fn source_hash(&self) -> String {
        let mut hasher = Sha256::new();
        hasher.update(FORUM_SEED_JSON.as_bytes());
        hex::encode(hasher.finalize())
    }
}

pub(crate) fn bundled_forum_seed_payload() -> Result<String, serde_json::Error> {
    Ok(ForumSeedBundle::load()?.payload())
}

pub(crate) async fn import_sqlite_forum_seed(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    let seed = ForumSeedBundle::load().map_err(json_decode_error)?;
    let vote_rows = seed.vote_rows();
    let favorite_rows = seed.favorite_rows();
    let mut tx = pool.begin().await?;
    retire_sqlite_stale_seed_rows(&mut tx, &seed, &vote_rows, &favorite_rows).await?;
    import_sqlite_feeds(&mut tx, &seed).await?;
    import_sqlite_comments(&mut tx, &seed).await?;
    import_sqlite_votes(&mut tx, &seed, &vote_rows).await?;
    import_sqlite_favorites(&mut tx, &seed, &favorite_rows).await?;
    tx.commit().await?;
    Ok(())
}

pub(crate) async fn import_postgres_forum_seed(pool: &PgPool) -> Result<(), sqlx::Error> {
    let seed = ForumSeedBundle::load().map_err(json_decode_error)?;
    let vote_rows = seed.vote_rows();
    let favorite_rows = seed.favorite_rows();
    let mut tx = pool.begin().await?;
    retire_postgres_stale_seed_rows(&mut tx, &seed, &vote_rows, &favorite_rows).await?;
    import_postgres_feeds(&mut tx, &seed).await?;
    import_postgres_comments(&mut tx, &seed).await?;
    import_postgres_votes(&mut tx, &seed, &vote_rows).await?;
    import_postgres_favorites(&mut tx, &seed, &favorite_rows).await?;
    tx.commit().await?;
    Ok(())
}

pub(crate) async fn sqlite_forum_seed_complete(pool: &SqlitePool) -> Result<bool, sqlx::Error> {
    let seed = ForumSeedBundle::load().map_err(json_decode_error)?;
    let vote_rows = seed.vote_rows();
    let favorite_rows = seed.favorite_rows();
    Ok(
        sqlite_feed_seed_standard_count(pool, &seed.feeds).await? == seed.feeds.len() as i64
            && sqlite_comment_seed_standard_count(pool, &seed.comments).await?
                == seed.comments.len() as i64
            && sqlite_vote_seed_count(pool, &vote_rows).await? == vote_rows.len() as i64
            && sqlite_favorite_seed_count(pool, &favorite_rows).await?
                == favorite_rows.len() as i64
            && sqlite_stale_forum_seed_count(pool, &seed, &vote_rows, &favorite_rows).await? == 0,
    )
}

pub(crate) async fn postgres_forum_seed_complete(pool: &PgPool) -> Result<bool, sqlx::Error> {
    let seed = ForumSeedBundle::load().map_err(json_decode_error)?;
    let vote_rows = seed.vote_rows();
    let favorite_rows = seed.favorite_rows();
    Ok(
        postgres_feed_seed_standard_count(pool, &seed.feeds).await? == seed.feeds.len() as i64
            && postgres_comment_seed_standard_count(pool, &seed.comments).await?
                == seed.comments.len() as i64
            && postgres_vote_seed_count(pool, &vote_rows).await? == vote_rows.len() as i64
            && postgres_favorite_seed_count(pool, &favorite_rows).await?
                == favorite_rows.len() as i64
            && postgres_stale_forum_seed_count(pool, &seed, &vote_rows, &favorite_rows).await? == 0,
    )
}

async fn import_sqlite_feeds(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &ForumSeedBundle,
) -> Result<(), sqlx::Error> {
    for item in &seed.feeds {
        sqlx::query(
            r#"
            INSERT INTO plus_feeds
                (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, user_id,
                 title, summary, category_id, content_type, content_id, cover_images, resource_list,
                 author, source, source_url, publish_time, tags, status, view_count, like_count,
                 comment_count, share_count, favorite_count, is_top, is_hot, is_recommended, sort_order)
            VALUES
                (?, ?, ?, ?, 0, ?, ?, ?, ?,
                 ?, ?, ?, ?, ?, ?, ?,
                 ?, ?, ?, ?, ?, ?, ?, ?,
                 ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                uuid = excluded.uuid,
                tenant_id = excluded.tenant_id,
                organization_id = excluded.organization_id,
                data_scope = excluded.data_scope,
                user_id = excluded.user_id,
                title = excluded.title,
                summary = excluded.summary,
                category_id = excluded.category_id,
                content_type = excluded.content_type,
                content_id = excluded.content_id,
                cover_images = excluded.cover_images,
                resource_list = excluded.resource_list,
                author = excluded.author,
                source = excluded.source,
                source_url = excluded.source_url,
                publish_time = excluded.publish_time,
                tags = excluded.tags,
                status = excluded.status,
                view_count = excluded.view_count,
                like_count = excluded.like_count,
                comment_count = excluded.comment_count,
                share_count = excluded.share_count,
                favorite_count = excluded.favorite_count,
                is_top = excluded.is_top,
                is_hot = excluded.is_hot,
                is_recommended = excluded.is_recommended,
                sort_order = excluded.sort_order,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(&item.created_at)
        .bind(&item.updated_at)
        .bind(item.tenant_id)
        .bind(item.organization_id)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(item.user_id)
        .bind(&item.title)
        .bind(&item.content)
        .bind(item.category_id)
        .bind(CONTENT_TYPE_FEEDS)
        .bind(item.id)
        .bind(cover_images_json())
        .bind(resource_list_json(&item.summary))
        .bind(author_json(&item.author))
        .bind("community")
        .bind(Option::<String>::None)
        .bind(&item.created_at)
        .bind(tags_json(&item.tags))
        .bind(FEEDS_STATUS_PUBLISHED)
        .bind(item.view_count)
        .bind(item.like_count)
        .bind(item.comment_count)
        .bind(item.share_count)
        .bind(item.favorite_count)
        .bind(item.is_top)
        .bind(item.is_hot)
        .bind(item.is_recommended)
        .bind(item.sort_order)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_postgres_feeds(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &ForumSeedBundle,
) -> Result<(), sqlx::Error> {
    for item in &seed.feeds {
        sqlx::query(
            r#"
            INSERT INTO plus_feeds
                (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, user_id,
                 title, summary, category_id, content_type, content_id, cover_images, resource_list,
                 author, source, source_url, publish_time, tags, status, view_count, like_count,
                 comment_count, share_count, favorite_count, is_top, is_hot, is_recommended, sort_order)
            VALUES
                ($1, $2, $3::timestamptz, $4::timestamptz, 0, $5, $6, $7, $8,
                 $9, $10, $11, $12, $13, $14::jsonb, $15::jsonb,
                 $16::jsonb, $17, $18, $19::timestamptz, $20::jsonb, $21, $22, $23,
                 $24, $25, $26, $27, $28, $29, $30)
            ON CONFLICT(id) DO UPDATE SET
                uuid = excluded.uuid,
                tenant_id = excluded.tenant_id,
                organization_id = excluded.organization_id,
                data_scope = excluded.data_scope,
                user_id = excluded.user_id,
                title = excluded.title,
                summary = excluded.summary,
                category_id = excluded.category_id,
                content_type = excluded.content_type,
                content_id = excluded.content_id,
                cover_images = excluded.cover_images,
                resource_list = excluded.resource_list,
                author = excluded.author,
                source = excluded.source,
                source_url = excluded.source_url,
                publish_time = excluded.publish_time,
                tags = excluded.tags,
                status = excluded.status,
                view_count = excluded.view_count,
                like_count = excluded.like_count,
                comment_count = excluded.comment_count,
                share_count = excluded.share_count,
                favorite_count = excluded.favorite_count,
                is_top = excluded.is_top,
                is_hot = excluded.is_hot,
                is_recommended = excluded.is_recommended,
                sort_order = excluded.sort_order,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(&item.created_at)
        .bind(&item.updated_at)
        .bind(item.tenant_id)
        .bind(item.organization_id)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(item.user_id)
        .bind(&item.title)
        .bind(&item.content)
        .bind(item.category_id)
        .bind(CONTENT_TYPE_FEEDS)
        .bind(item.id)
        .bind(cover_images_json())
        .bind(resource_list_json(&item.summary))
        .bind(author_json(&item.author))
        .bind("community")
        .bind(Option::<String>::None)
        .bind(&item.created_at)
        .bind(tags_json(&item.tags))
        .bind(FEEDS_STATUS_PUBLISHED)
        .bind(item.view_count)
        .bind(item.like_count)
        .bind(item.comment_count)
        .bind(item.share_count)
        .bind(item.favorite_count)
        .bind(item.is_top)
        .bind(item.is_hot)
        .bind(item.is_recommended)
        .bind(item.sort_order)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_sqlite_comments(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &ForumSeedBundle,
) -> Result<(), sqlx::Error> {
    for item in &seed.comments {
        sqlx::query(
            r#"
            INSERT INTO plus_comments
                (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope,
                 user_id, parent_id, path, sort_weight, content, content_type, content_id,
                 status, likes, reply_count, is_top, ip_address, device_info, author)
            VALUES
                (?, ?, ?, ?, 0, 0, 0, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                uuid = excluded.uuid,
                tenant_id = excluded.tenant_id,
                organization_id = excluded.organization_id,
                data_scope = excluded.data_scope,
                user_id = excluded.user_id,
                parent_id = excluded.parent_id,
                path = excluded.path,
                content = excluded.content,
                content_type = excluded.content_type,
                content_id = excluded.content_id,
                status = excluded.status,
                likes = excluded.likes,
                reply_count = excluded.reply_count,
                is_top = excluded.is_top,
                ip_address = excluded.ip_address,
                device_info = excluded.device_info,
                author = excluded.author,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(&item.created_at)
        .bind(&item.updated_at)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(item.user_id)
        .bind(item.parent_id)
        .bind(comment_path(item))
        .bind(&item.content)
        .bind(CONTENT_TYPE_FEEDS)
        .bind(item.feed_id)
        .bind(COMMENT_STATUS_PUBLISHED)
        .bind(item.likes)
        .bind(item.reply_count)
        .bind(item.is_top)
        .bind(Option::<String>::None)
        .bind("seed")
        .bind(author_json(&item.author))
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_postgres_comments(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &ForumSeedBundle,
) -> Result<(), sqlx::Error> {
    for item in &seed.comments {
        sqlx::query(
            r#"
            INSERT INTO plus_comments
                (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope,
                 user_id, parent_id, path, sort_weight, content, content_type, content_id,
                 status, likes, reply_count, is_top, ip_address, device_info, author)
            VALUES
                ($1, $2, $3::timestamptz, $4::timestamptz, 0, 0, 0, $5,
                 $6, $7, $8, 0, $9, $10, $11,
                 $12, $13, $14, $15, $16, $17, $18::jsonb)
            ON CONFLICT(id) DO UPDATE SET
                uuid = excluded.uuid,
                tenant_id = excluded.tenant_id,
                organization_id = excluded.organization_id,
                data_scope = excluded.data_scope,
                user_id = excluded.user_id,
                parent_id = excluded.parent_id,
                path = excluded.path,
                content = excluded.content,
                content_type = excluded.content_type,
                content_id = excluded.content_id,
                status = excluded.status,
                likes = excluded.likes,
                reply_count = excluded.reply_count,
                is_top = excluded.is_top,
                ip_address = excluded.ip_address,
                device_info = excluded.device_info,
                author = excluded.author,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(&item.created_at)
        .bind(&item.updated_at)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(item.user_id)
        .bind(item.parent_id)
        .bind(comment_path(item))
        .bind(&item.content)
        .bind(CONTENT_TYPE_FEEDS)
        .bind(item.feed_id)
        .bind(COMMENT_STATUS_PUBLISHED)
        .bind(item.likes)
        .bind(item.reply_count)
        .bind(item.is_top)
        .bind(Option::<String>::None)
        .bind("seed")
        .bind(author_json(&item.author))
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_sqlite_votes(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &ForumSeedBundle,
    rows: &[ContentVoteRow],
) -> Result<(), sqlx::Error> {
    for row in rows {
        sqlx::query(
            r#"
            INSERT INTO plus_content_vote
                (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope,
                 user_id, content_type, content_id, rating, metadata, source)
            VALUES
                (?, ?, ?, ?, 0, 0, 0, ?, ?, ?, ?, 'like', ?, ?)
            ON CONFLICT(user_id, content_type, content_id) DO UPDATE SET
                uuid = excluded.uuid,
                rating = excluded.rating,
                metadata = excluded.metadata,
                source = excluded.source,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(row.id)
        .bind(&row.uuid)
        .bind(&seed.generated_at)
        .bind(&seed.generated_at)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(row.user_id)
        .bind(row.content_type)
        .bind(row.content_id)
        .bind(seed_metadata(seed, "forum_vote", &row.uuid))
        .bind("forum-seed")
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_postgres_votes(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &ForumSeedBundle,
    rows: &[ContentVoteRow],
) -> Result<(), sqlx::Error> {
    for row in rows {
        sqlx::query(
            r#"
            INSERT INTO plus_content_vote
                (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope,
                 user_id, content_type, content_id, rating, metadata, source)
            VALUES
                ($1, $2, $3::timestamptz, $4::timestamptz, 0, 0, 0, $5,
                 $6, $7, $8, 'like', $9::jsonb, $10)
            ON CONFLICT(user_id, content_type, content_id) DO UPDATE SET
                uuid = excluded.uuid,
                rating = excluded.rating,
                metadata = excluded.metadata,
                source = excluded.source,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(row.id)
        .bind(&row.uuid)
        .bind(&seed.generated_at)
        .bind(&seed.generated_at)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(row.user_id)
        .bind(row.content_type)
        .bind(row.content_id)
        .bind(seed_metadata(seed, "forum_vote", &row.uuid))
        .bind("forum-seed")
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_sqlite_favorites(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &ForumSeedBundle,
    rows: &[FavoriteRow],
) -> Result<(), sqlx::Error> {
    for row in rows {
        sqlx::query(
            r#"
            INSERT INTO plus_favorite
                (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope,
                 user_id, title, image, content_type, content_id, folder_id, remark, tags,
                 sort_weight, is_private, status, view_count, last_viewed_at)
            VALUES
                (?, ?, ?, ?, 0, 0, 0, ?, ?, ?, ?, ?, ?, NULL, NULL, '',
                 0, 0, ?, 0, NULL)
            ON CONFLICT(user_id, content_type, content_id) DO UPDATE SET
                uuid = excluded.uuid,
                title = excluded.title,
                image = excluded.image,
                status = excluded.status,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(row.id)
        .bind(&row.uuid)
        .bind(&seed.generated_at)
        .bind(&seed.generated_at)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(row.user_id)
        .bind(&row.title)
        .bind("{}")
        .bind(CONTENT_TYPE_FEEDS)
        .bind(row.content_id)
        .bind(FAVORITE_STATUS_ACTIVE)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_postgres_favorites(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &ForumSeedBundle,
    rows: &[FavoriteRow],
) -> Result<(), sqlx::Error> {
    for row in rows {
        sqlx::query(
            r#"
            INSERT INTO plus_favorite
                (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope,
                 user_id, title, image, content_type, content_id, folder_id, remark, tags,
                 sort_weight, is_private, status, view_count, last_viewed_at)
            VALUES
                ($1, $2, $3::timestamptz, $4::timestamptz, 0, 0, 0, $5,
                 $6, $7, $8::jsonb, $9, $10, NULL, NULL, '',
                 0, false, $11, 0, NULL)
            ON CONFLICT(user_id, content_type, content_id) DO UPDATE SET
                uuid = excluded.uuid,
                title = excluded.title,
                image = excluded.image,
                status = excluded.status,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(row.id)
        .bind(&row.uuid)
        .bind(&seed.generated_at)
        .bind(&seed.generated_at)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(row.user_id)
        .bind(&row.title)
        .bind("{}")
        .bind(CONTENT_TYPE_FEEDS)
        .bind(row.content_id)
        .bind(FAVORITE_STATUS_ACTIVE)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn retire_sqlite_stale_seed_rows(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &ForumSeedBundle,
    vote_rows: &[ContentVoteRow],
    favorite_rows: &[FavoriteRow],
) -> Result<(), sqlx::Error> {
    retire_sqlite_stale_status_rows(
        tx,
        "plus_feeds",
        "sdkwork-forum-feed-%",
        &seed
            .feeds
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
        FEEDS_STATUS_DELETED,
    )
    .await?;
    retire_sqlite_stale_status_rows(
        tx,
        "plus_comments",
        "sdkwork-forum-comment-%",
        &seed
            .comments
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
        COMMENT_STATUS_DELETED,
    )
    .await?;
    delete_sqlite_stale_rows(
        tx,
        "plus_content_vote",
        "sdkwork-forum-vote-%",
        &vote_rows
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
    )
    .await?;
    retire_sqlite_stale_status_rows(
        tx,
        "plus_favorite",
        "sdkwork-forum-favorite-%",
        &favorite_rows
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
        FAVORITE_STATUS_DELETED,
    )
    .await?;
    Ok(())
}

async fn retire_postgres_stale_seed_rows(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &ForumSeedBundle,
    vote_rows: &[ContentVoteRow],
    favorite_rows: &[FavoriteRow],
) -> Result<(), sqlx::Error> {
    retire_postgres_stale_status_rows(
        tx,
        "plus_feeds",
        "sdkwork-forum-feed-%",
        &seed
            .feeds
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
        FEEDS_STATUS_DELETED,
    )
    .await?;
    retire_postgres_stale_status_rows(
        tx,
        "plus_comments",
        "sdkwork-forum-comment-%",
        &seed
            .comments
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
        COMMENT_STATUS_DELETED,
    )
    .await?;
    delete_postgres_stale_rows(
        tx,
        "plus_content_vote",
        "sdkwork-forum-vote-%",
        &vote_rows
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
    )
    .await?;
    retire_postgres_stale_status_rows(
        tx,
        "plus_favorite",
        "sdkwork-forum-favorite-%",
        &favorite_rows
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
        FAVORITE_STATUS_DELETED,
    )
    .await?;
    Ok(())
}

async fn sqlite_feed_seed_standard_count(
    pool: &SqlitePool,
    feeds: &[ForumFeedSeed],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in feeds {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM plus_feeds
            WHERE id = ?
              AND uuid = ?
              AND tenant_id = ?
              AND organization_id = ?
              AND user_id = ?
              AND title = ?
              AND category_id = ?
              AND content_type = ?
              AND content_id = ?
              AND status = ?
              AND view_count = ?
              AND like_count = ?
              AND comment_count = ?
              AND favorite_count = ?
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(item.tenant_id)
        .bind(item.organization_id)
        .bind(item.user_id)
        .bind(&item.title)
        .bind(item.category_id)
        .bind(CONTENT_TYPE_FEEDS)
        .bind(item.id)
        .bind(FEEDS_STATUS_PUBLISHED)
        .bind(item.view_count)
        .bind(item.like_count)
        .bind(item.comment_count)
        .bind(item.favorite_count)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn postgres_feed_seed_standard_count(
    pool: &PgPool,
    feeds: &[ForumFeedSeed],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in feeds {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM plus_feeds
            WHERE id = $1
              AND uuid = $2
              AND tenant_id = $3
              AND organization_id = $4
              AND user_id = $5
              AND title = $6
              AND category_id = $7
              AND content_type = $8
              AND content_id = $9
              AND status = $10
              AND view_count = $11
              AND like_count = $12
              AND comment_count = $13
              AND favorite_count = $14
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(item.tenant_id)
        .bind(item.organization_id)
        .bind(item.user_id)
        .bind(&item.title)
        .bind(item.category_id)
        .bind(CONTENT_TYPE_FEEDS)
        .bind(item.id)
        .bind(FEEDS_STATUS_PUBLISHED)
        .bind(item.view_count)
        .bind(item.like_count)
        .bind(item.comment_count)
        .bind(item.favorite_count)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn sqlite_comment_seed_standard_count(
    pool: &SqlitePool,
    comments: &[ForumCommentSeed],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in comments {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM plus_comments
            WHERE id = ?
              AND uuid = ?
              AND user_id = ?
              AND COALESCE(parent_id, 0) = ?
              AND content = ?
              AND content_type = ?
              AND content_id = ?
              AND status = ?
              AND likes = ?
              AND reply_count = ?
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(item.user_id)
        .bind(item.parent_id.unwrap_or_default())
        .bind(&item.content)
        .bind(CONTENT_TYPE_FEEDS)
        .bind(item.feed_id)
        .bind(COMMENT_STATUS_PUBLISHED)
        .bind(item.likes)
        .bind(item.reply_count)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn postgres_comment_seed_standard_count(
    pool: &PgPool,
    comments: &[ForumCommentSeed],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in comments {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM plus_comments
            WHERE id = $1
              AND uuid = $2
              AND user_id = $3
              AND COALESCE(parent_id, 0) = $4
              AND content = $5
              AND content_type = $6
              AND content_id = $7
              AND status = $8
              AND likes = $9
              AND reply_count = $10
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(item.user_id)
        .bind(item.parent_id.unwrap_or_default())
        .bind(&item.content)
        .bind(CONTENT_TYPE_FEEDS)
        .bind(item.feed_id)
        .bind(COMMENT_STATUS_PUBLISHED)
        .bind(item.likes)
        .bind(item.reply_count)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn sqlite_vote_seed_count(
    pool: &SqlitePool,
    votes: &[ContentVoteRow],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in votes {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM plus_content_vote
            WHERE uuid = ?
              AND user_id = ?
              AND content_type = ?
              AND content_id = ?
              AND rating = 'like'
            "#,
        )
        .bind(&item.uuid)
        .bind(item.user_id)
        .bind(item.content_type)
        .bind(item.content_id)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn postgres_vote_seed_count(
    pool: &PgPool,
    votes: &[ContentVoteRow],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in votes {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM plus_content_vote
            WHERE uuid = $1
              AND user_id = $2
              AND content_type = $3
              AND content_id = $4
              AND rating = 'like'
            "#,
        )
        .bind(&item.uuid)
        .bind(item.user_id)
        .bind(item.content_type)
        .bind(item.content_id)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn sqlite_favorite_seed_count(
    pool: &SqlitePool,
    favorites: &[FavoriteRow],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in favorites {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM plus_favorite
            WHERE uuid = ?
              AND user_id = ?
              AND content_type = ?
              AND content_id = ?
              AND status = ?
            "#,
        )
        .bind(&item.uuid)
        .bind(item.user_id)
        .bind(CONTENT_TYPE_FEEDS)
        .bind(item.content_id)
        .bind(FAVORITE_STATUS_ACTIVE)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn postgres_favorite_seed_count(
    pool: &PgPool,
    favorites: &[FavoriteRow],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in favorites {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM plus_favorite
            WHERE uuid = $1
              AND user_id = $2
              AND content_type = $3
              AND content_id = $4
              AND status = $5
            "#,
        )
        .bind(&item.uuid)
        .bind(item.user_id)
        .bind(CONTENT_TYPE_FEEDS)
        .bind(item.content_id)
        .bind(FAVORITE_STATUS_ACTIVE)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn sqlite_stale_forum_seed_count(
    pool: &SqlitePool,
    seed: &ForumSeedBundle,
    vote_rows: &[ContentVoteRow],
    favorite_rows: &[FavoriteRow],
) -> Result<i64, sqlx::Error> {
    Ok(sqlite_stale_count(
        pool,
        "plus_feeds",
        "sdkwork-forum-feed-%",
        &seed
            .feeds
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
    )
    .await?
        + sqlite_stale_count(
            pool,
            "plus_comments",
            "sdkwork-forum-comment-%",
            &seed
                .comments
                .iter()
                .map(|item| item.uuid.as_str())
                .collect::<Vec<_>>(),
        )
        .await?
        + sqlite_stale_count(
            pool,
            "plus_content_vote",
            "sdkwork-forum-vote-%",
            &vote_rows
                .iter()
                .map(|item| item.uuid.as_str())
                .collect::<Vec<_>>(),
        )
        .await?
        + sqlite_stale_count(
            pool,
            "plus_favorite",
            "sdkwork-forum-favorite-%",
            &favorite_rows
                .iter()
                .map(|item| item.uuid.as_str())
                .collect::<Vec<_>>(),
        )
        .await?)
}

async fn postgres_stale_forum_seed_count(
    pool: &PgPool,
    seed: &ForumSeedBundle,
    vote_rows: &[ContentVoteRow],
    favorite_rows: &[FavoriteRow],
) -> Result<i64, sqlx::Error> {
    Ok(postgres_stale_count(
        pool,
        "plus_feeds",
        "sdkwork-forum-feed-%",
        &seed
            .feeds
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
    )
    .await?
        + postgres_stale_count(
            pool,
            "plus_comments",
            "sdkwork-forum-comment-%",
            &seed
                .comments
                .iter()
                .map(|item| item.uuid.as_str())
                .collect::<Vec<_>>(),
        )
        .await?
        + postgres_stale_count(
            pool,
            "plus_content_vote",
            "sdkwork-forum-vote-%",
            &vote_rows
                .iter()
                .map(|item| item.uuid.as_str())
                .collect::<Vec<_>>(),
        )
        .await?
        + postgres_stale_count(
            pool,
            "plus_favorite",
            "sdkwork-forum-favorite-%",
            &favorite_rows
                .iter()
                .map(|item| item.uuid.as_str())
                .collect::<Vec<_>>(),
        )
        .await?)
}

async fn retire_sqlite_stale_status_rows(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    table: &str,
    prefix: &str,
    current_uuids: &[&str],
    status: i32,
) -> Result<(), sqlx::Error> {
    for uuid in sqlite_stale_uuids(&mut **tx, table, prefix, current_uuids).await? {
        let sql =
            format!("UPDATE {table} SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE uuid = ?");
        sqlx::query(sql.as_str())
            .bind(status)
            .bind(uuid)
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

async fn retire_postgres_stale_status_rows(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    table: &str,
    prefix: &str,
    current_uuids: &[&str],
    status: i32,
) -> Result<(), sqlx::Error> {
    for uuid in postgres_stale_uuids(&mut **tx, table, prefix, current_uuids).await? {
        let sql = format!(
            "UPDATE {table} SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE uuid = $2"
        );
        sqlx::query(sql.as_str())
            .bind(status)
            .bind(uuid)
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

async fn delete_sqlite_stale_rows(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    table: &str,
    prefix: &str,
    current_uuids: &[&str],
) -> Result<(), sqlx::Error> {
    for uuid in sqlite_stale_uuids(&mut **tx, table, prefix, current_uuids).await? {
        let sql = format!("DELETE FROM {table} WHERE uuid = ?");
        sqlx::query(sql.as_str())
            .bind(uuid)
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

async fn delete_postgres_stale_rows(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    table: &str,
    prefix: &str,
    current_uuids: &[&str],
) -> Result<(), sqlx::Error> {
    for uuid in postgres_stale_uuids(&mut **tx, table, prefix, current_uuids).await? {
        let sql = format!("DELETE FROM {table} WHERE uuid = $1");
        sqlx::query(sql.as_str())
            .bind(uuid)
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

async fn sqlite_stale_count(
    pool: &SqlitePool,
    table: &str,
    prefix: &str,
    current_uuids: &[&str],
) -> Result<i64, sqlx::Error> {
    let rows = sqlx::query(format!("SELECT uuid FROM {table} WHERE uuid LIKE ?").as_str())
        .bind(prefix)
        .fetch_all(pool)
        .await?;
    let current = current_uuids.iter().copied().collect::<BTreeSet<_>>();
    Ok(rows
        .into_iter()
        .filter(|row| {
            let uuid = row.get::<String, _>("uuid");
            !current.contains(uuid.as_str())
        })
        .count() as i64)
}

async fn postgres_stale_count(
    pool: &PgPool,
    table: &str,
    prefix: &str,
    current_uuids: &[&str],
) -> Result<i64, sqlx::Error> {
    let rows = sqlx::query(format!("SELECT uuid FROM {table} WHERE uuid LIKE $1").as_str())
        .bind(prefix)
        .fetch_all(pool)
        .await?;
    let current = current_uuids.iter().copied().collect::<BTreeSet<_>>();
    Ok(rows
        .into_iter()
        .filter(|row| {
            let uuid = row.get::<String, _>("uuid");
            !current.contains(uuid.as_str())
        })
        .count() as i64)
}

async fn sqlite_stale_uuids<'a, E>(
    executor: E,
    table: &str,
    prefix: &str,
    current_uuids: &[&str],
) -> Result<Vec<String>, sqlx::Error>
where
    E: sqlx::Executor<'a, Database = sqlx::Sqlite>,
{
    let rows = sqlx::query(format!("SELECT uuid FROM {table} WHERE uuid LIKE ?").as_str())
        .bind(prefix)
        .fetch_all(executor)
        .await?;
    let current = current_uuids.iter().copied().collect::<BTreeSet<_>>();
    Ok(rows
        .into_iter()
        .filter_map(|row| {
            let uuid = row.get::<String, _>("uuid");
            (!current.contains(uuid.as_str())).then_some(uuid)
        })
        .collect())
}

async fn postgres_stale_uuids<'a, E>(
    executor: E,
    table: &str,
    prefix: &str,
    current_uuids: &[&str],
) -> Result<Vec<String>, sqlx::Error>
where
    E: sqlx::Executor<'a, Database = sqlx::Postgres>,
{
    let rows = sqlx::query(format!("SELECT uuid FROM {table} WHERE uuid LIKE $1").as_str())
        .bind(prefix)
        .fetch_all(executor)
        .await?;
    let current = current_uuids.iter().copied().collect::<BTreeSet<_>>();
    Ok(rows
        .into_iter()
        .filter_map(|row| {
            let uuid = row.get::<String, _>("uuid");
            (!current.contains(uuid.as_str())).then_some(uuid)
        })
        .collect())
}

fn append_generated_votes(
    rows: &mut Vec<ContentVoteRow>,
    target: &str,
    content_type: i32,
    content_id: i64,
    expected_count: i64,
) {
    let existing_users = rows
        .iter()
        .filter(|row| row.content_type == content_type && row.content_id == content_id)
        .map(|row| row.user_id)
        .collect::<BTreeSet<_>>();
    let existing_count = existing_users.len() as i64;
    if expected_count <= existing_count {
        return;
    }
    let mut appended = 0_i64;
    let mut sequence = 1_i64;
    while appended < expected_count - existing_count {
        let user_id = synthetic_user_id(8_000_000_000, content_id, sequence);
        sequence += 1;
        if existing_users.contains(&user_id) {
            continue;
        }
        rows.push(ContentVoteRow {
            id: 0,
            uuid: format!("sdkwork-forum-vote-{target}-{content_id}-{sequence}"),
            user_id,
            content_type,
            content_id,
        });
        appended += 1;
    }
}

fn append_generated_favorites(rows: &mut Vec<FavoriteRow>, feed: &ForumFeedSeed) {
    let existing_users = rows
        .iter()
        .filter(|row| row.content_id == feed.id)
        .map(|row| row.user_id)
        .collect::<BTreeSet<_>>();
    let existing_count = existing_users.len() as i64;
    if feed.favorite_count <= existing_count {
        return;
    }
    let mut appended = 0_i64;
    let mut sequence = 1_i64;
    while appended < feed.favorite_count - existing_count {
        let user_id = synthetic_user_id(8_500_000_000, feed.id, sequence);
        sequence += 1;
        if existing_users.contains(&user_id) {
            continue;
        }
        rows.push(FavoriteRow {
            id: 0,
            uuid: format!("sdkwork-forum-favorite-feed-{}-{sequence}", feed.id),
            user_id,
            content_id: feed.id,
            title: feed.title.clone(),
        });
        appended += 1;
    }
}

fn synthetic_user_id(base: i64, content_id: i64, sequence: i64) -> i64 {
    base + content_id.saturating_mul(1_000) + sequence
}

fn author_json(author: &ForumAuthorSeed) -> String {
    serde_json::json!({
        "id": author.id,
        "name": author.name,
        "avatar": author.avatar,
        "bio": author.bio,
        "isFollowing": author.is_following,
    })
    .to_string()
}

fn tags_json(tags: &[String]) -> String {
    serde_json::json!({ "list": tags }).to_string()
}

fn cover_images_json() -> String {
    serde_json::json!({ "images": [] }).to_string()
}

fn resource_list_json(summary: &str) -> String {
    serde_json::json!({
        "resources": [],
        "excerpt": summary,
    })
    .to_string()
}

fn comment_path(comment: &ForumCommentSeed) -> String {
    match comment.parent_id {
        Some(parent_id) => format!("/{parent_id}/{}", comment.id),
        None => format!("/{}", comment.id),
    }
}

fn seed_metadata(seed: &ForumSeedBundle, item_type: &str, item_uuid: &str) -> String {
    serde_json::json!({
        "source": seed.catalog_code,
        "catalogVersion": seed.catalog_version,
        "schemaVersion": seed.schema_version,
        "generatedAt": seed.generated_at,
        "itemType": item_type,
        "itemUuid": item_uuid,
        "sourceHash": seed.source_hash(),
    })
    .to_string()
}

fn json_decode_error(error: serde_json::Error) -> sqlx::Error {
    sqlx::Error::Protocol(format!("invalid bundled forum seed data: {error}"))
}
