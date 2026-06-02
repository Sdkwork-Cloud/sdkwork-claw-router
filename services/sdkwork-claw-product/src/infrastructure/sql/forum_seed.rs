use std::collections::BTreeSet;
use std::fmt::{Display, Formatter};

use serde::{Deserialize, Serialize};
use serde_json::Value;
use sha2::{Digest, Sha256};
use sqlx::{PgPool, Row, SqlitePool};

const FORUM_SEED_JSON: &str = include_str!("../../../../../data/forum/forum-seed.json");
const SYSTEM_DATA_SCOPE: i32 = 0;
const CONTENT_TYPE_FEEDS: i32 = 5;
const FEEDS_STATUS_PUBLISHED: i32 = 2;
const COMMENT_STATUS_PUBLISHED: i32 = 1;
const FAVORITE_STATUS_ACTIVE: i32 = 1;

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ForumSeedBundle {
    catalog_code: String,
    catalog_version: String,
    schema_version: i32,
    generated_at: String,
    source: ForumSeedSource,
    feeds: Vec<ForumFeedSeed>,
    comments: Vec<ForumCommentSeed>,
    votes: Vec<ForumVoteSeed>,
    favorites: Vec<ForumFavoriteSeed>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct ForumSeedSource {
    label: String,
    description: String,
    source_tables: Vec<String>,
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
    author: Value,
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
    likes: i32,
    reply_count: i32,
    is_top: bool,
    author: Value,
    created_at: String,
    updated_at: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ForumVoteSeed {
    id: i64,
    uuid: String,
    user_id: i64,
    content_id: i64,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ForumFavoriteSeed {
    id: i64,
    uuid: String,
    user_id: i64,
    content_id: i64,
    title: String,
}

#[derive(Debug)]
pub(crate) enum ForumSeedLoadError {
    Json(serde_json::Error),
    Validation(String),
}

impl Display for ForumSeedLoadError {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Json(error) => write!(formatter, "{error}"),
            Self::Validation(message) => formatter.write_str(message),
        }
    }
}

impl std::error::Error for ForumSeedLoadError {}

impl From<serde_json::Error> for ForumSeedLoadError {
    fn from(error: serde_json::Error) -> Self {
        Self::Json(error)
    }
}

impl ForumSeedBundle {
    fn load() -> Result<Self, ForumSeedLoadError> {
        let seed = serde_json::from_str::<Self>(FORUM_SEED_JSON)?;
        validate_forum_seed(&seed)?;
        Ok(seed)
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
            "voteCount": self.votes.len(),
            "favoriteCount": self.favorites.len(),
            "sourceHash": seed_hash(),
        })
        .to_string()
    }
}

pub(crate) fn bundled_forum_seed_payload() -> Result<String, ForumSeedLoadError> {
    Ok(ForumSeedBundle::load()?.payload())
}

pub(crate) async fn import_sqlite_forum_seed(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    let seed = ForumSeedBundle::load().map_err(json_decode_error)?;
    let mut tx = pool.begin().await?;
    import_sqlite_feeds(&mut tx, &seed).await?;
    import_sqlite_comments(&mut tx, &seed).await?;
    import_sqlite_votes(&mut tx, &seed).await?;
    import_sqlite_favorites(&mut tx, &seed).await?;
    tx.commit().await?;
    Ok(())
}

pub(crate) async fn import_postgres_forum_seed(pool: &PgPool) -> Result<(), sqlx::Error> {
    let seed = ForumSeedBundle::load().map_err(json_decode_error)?;
    let mut tx = pool.begin().await?;
    import_postgres_feeds(&mut tx, &seed).await?;
    import_postgres_comments(&mut tx, &seed).await?;
    import_postgres_votes(&mut tx, &seed).await?;
    import_postgres_favorites(&mut tx, &seed).await?;
    tx.commit().await?;
    Ok(())
}

pub(crate) async fn sqlite_forum_seed_complete(pool: &SqlitePool) -> Result<bool, sqlx::Error> {
    let seed = ForumSeedBundle::load().map_err(json_decode_error)?;
    let feed_count = sqlite_feed_seed_standard_count(pool, &seed).await?;
    let comment_count = sqlite_seed_count(
        pool,
        "plus_comments",
        "uuid",
        &seed
            .comments
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
    )
    .await?;
    let vote_count = sqlite_seed_count(
        pool,
        "plus_content_vote",
        "uuid",
        &seed
            .votes
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
    )
    .await?;
    let favorite_count = sqlite_seed_count(
        pool,
        "plus_favorite",
        "uuid",
        &seed
            .favorites
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
    )
    .await?;
    Ok(feed_count == seed.feeds.len() as i64
        && comment_count == seed.comments.len() as i64
        && vote_count == seed.votes.len() as i64
        && favorite_count == seed.favorites.len() as i64)
}

pub(crate) async fn postgres_forum_seed_complete(pool: &PgPool) -> Result<bool, sqlx::Error> {
    let seed = ForumSeedBundle::load().map_err(json_decode_error)?;
    let feed_count = postgres_feed_seed_standard_count(pool, &seed).await?;
    let comment_count = postgres_seed_count(
        pool,
        "plus_comments",
        "uuid",
        &seed
            .comments
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
    )
    .await?;
    let vote_count = postgres_seed_count(
        pool,
        "plus_content_vote",
        "uuid",
        &seed
            .votes
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
    )
    .await?;
    let favorite_count = postgres_seed_count(
        pool,
        "plus_favorite",
        "uuid",
        &seed
            .favorites
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
    )
    .await?;
    Ok(feed_count == seed.feeds.len() as i64
        && comment_count == seed.comments.len() as i64
        && vote_count == seed.votes.len() as i64
        && favorite_count == seed.favorites.len() as i64)
}

async fn import_sqlite_feeds(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &ForumSeedBundle,
) -> Result<(), sqlx::Error> {
    for item in &seed.feeds {
        sqlx::query(
            r#"
            INSERT INTO plus_feeds
                (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope,
                 user_id, title, summary, category_id, content_type, content_id, cover_resources,
                 resource_list, author, source, source_url, publish_time, tags, status, view_count,
                 like_count, comment_count, share_count, favorite_count, is_top, is_hot,
                 is_recommended, sort_order)
            VALUES
                (?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                uuid = excluded.uuid,
                created_at = excluded.created_at,
                updated_at = excluded.updated_at,
                tenant_id = excluded.tenant_id,
                organization_id = excluded.organization_id,
                data_scope = excluded.data_scope,
                user_id = excluded.user_id,
                title = excluded.title,
                summary = excluded.summary,
                category_id = excluded.category_id,
                content_type = excluded.content_type,
                content_id = excluded.content_id,
                cover_resources = excluded.cover_resources,
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
                sort_order = excluded.sort_order
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
        .bind(feed_content(item))
        .bind(item.category_id)
        .bind(CONTENT_TYPE_FEEDS)
        .bind(item.id)
        .bind(empty_images_json())
        .bind(empty_resources_json())
        .bind(item.author.to_string())
        .bind(seed.source.label.as_str())
        .bind(Option::<&str>::None)
        .bind(&item.created_at)
        .bind(json_string(&item.tags))
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
                (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope,
                 user_id, title, summary, category_id, content_type, content_id, cover_resources,
                 resource_list, author, source, source_url, publish_time, tags, status, view_count,
                 like_count, comment_count, share_count, favorite_count, is_top, is_hot,
                 is_recommended, sort_order)
            VALUES
                ($1, $2, $3::timestamptz, $4::timestamptz, 0, $5, $6, $7, $8, $9, $10, $11,
                 $12, $13, $14::jsonb, $15::jsonb, $16::jsonb, $17, $18, $19::timestamptz,
                 $20::jsonb, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30)
            ON CONFLICT(id) DO UPDATE SET
                uuid = excluded.uuid,
                created_at = excluded.created_at,
                updated_at = excluded.updated_at,
                tenant_id = excluded.tenant_id,
                organization_id = excluded.organization_id,
                data_scope = excluded.data_scope,
                user_id = excluded.user_id,
                title = excluded.title,
                summary = excluded.summary,
                category_id = excluded.category_id,
                content_type = excluded.content_type,
                content_id = excluded.content_id,
                cover_resources = excluded.cover_resources,
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
                sort_order = excluded.sort_order
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
        .bind(feed_content(item))
        .bind(item.category_id)
        .bind(CONTENT_TYPE_FEEDS)
        .bind(item.id)
        .bind(empty_images_json())
        .bind(empty_resources_json())
        .bind(item.author.to_string())
        .bind(seed.source.label.as_str())
        .bind(Option::<&str>::None)
        .bind(&item.created_at)
        .bind(json_string(&item.tags))
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
        let feed = seed_feed(seed, item.feed_id)?;
        sqlx::query(comment_insert_sqlite())
            .bind(item.id)
            .bind(&item.uuid)
            .bind(&item.created_at)
            .bind(&item.updated_at)
            .bind(feed.tenant_id)
            .bind(feed.organization_id)
            .bind(SYSTEM_DATA_SCOPE)
            .bind(item.user_id)
            .bind(item.parent_id)
            .bind(comment_path(item.parent_id))
            .bind(&item.content)
            .bind(CONTENT_TYPE_FEEDS)
            .bind(item.feed_id)
            .bind(COMMENT_STATUS_PUBLISHED)
            .bind(item.likes)
            .bind(item.reply_count)
            .bind(item.is_top)
            .bind(Option::<&str>::None)
            .bind("forum-seed")
            .bind(item.author.to_string())
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
        let feed = seed_feed(seed, item.feed_id)?;
        sqlx::query(comment_insert_postgres())
            .bind(item.id)
            .bind(&item.uuid)
            .bind(&item.created_at)
            .bind(&item.updated_at)
            .bind(feed.tenant_id)
            .bind(feed.organization_id)
            .bind(SYSTEM_DATA_SCOPE)
            .bind(item.user_id)
            .bind(item.parent_id)
            .bind(comment_path(item.parent_id))
            .bind(&item.content)
            .bind(CONTENT_TYPE_FEEDS)
            .bind(item.feed_id)
            .bind(COMMENT_STATUS_PUBLISHED)
            .bind(item.likes)
            .bind(item.reply_count)
            .bind(item.is_top)
            .bind(Option::<&str>::None)
            .bind("forum-seed")
            .bind(item.author.to_string())
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

async fn import_sqlite_votes(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &ForumSeedBundle,
) -> Result<(), sqlx::Error> {
    for item in &seed.votes {
        let feed = seed_feed(seed, item.content_id)?;
        sqlx::query(vote_insert_sqlite())
            .bind(item.id)
            .bind(&item.uuid)
            .bind(feed.tenant_id)
            .bind(feed.organization_id)
            .bind(SYSTEM_DATA_SCOPE)
            .bind(item.user_id)
            .bind(CONTENT_TYPE_FEEDS)
            .bind(item.content_id)
            .bind(seed_metadata(seed, "vote", &item.uuid))
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

async fn import_postgres_votes(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &ForumSeedBundle,
) -> Result<(), sqlx::Error> {
    for item in &seed.votes {
        let feed = seed_feed(seed, item.content_id)?;
        sqlx::query(vote_insert_postgres())
            .bind(item.id)
            .bind(&item.uuid)
            .bind(feed.tenant_id)
            .bind(feed.organization_id)
            .bind(SYSTEM_DATA_SCOPE)
            .bind(item.user_id)
            .bind(CONTENT_TYPE_FEEDS)
            .bind(item.content_id)
            .bind(seed_metadata(seed, "vote", &item.uuid))
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

async fn import_sqlite_favorites(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &ForumSeedBundle,
) -> Result<(), sqlx::Error> {
    for item in &seed.favorites {
        let feed = seed_feed(seed, item.content_id)?;
        sqlx::query(favorite_insert_sqlite())
            .bind(item.id)
            .bind(&item.uuid)
            .bind(feed.tenant_id)
            .bind(feed.organization_id)
            .bind(SYSTEM_DATA_SCOPE)
            .bind(item.user_id)
            .bind(&item.title)
            .bind(empty_images_json())
            .bind(CONTENT_TYPE_FEEDS)
            .bind(item.content_id)
            .bind(FAVORITE_STATUS_ACTIVE)
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

async fn import_postgres_favorites(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &ForumSeedBundle,
) -> Result<(), sqlx::Error> {
    for item in &seed.favorites {
        let feed = seed_feed(seed, item.content_id)?;
        sqlx::query(favorite_insert_postgres())
            .bind(item.id)
            .bind(&item.uuid)
            .bind(feed.tenant_id)
            .bind(feed.organization_id)
            .bind(SYSTEM_DATA_SCOPE)
            .bind(item.user_id)
            .bind(&item.title)
            .bind(empty_images_json())
            .bind(CONTENT_TYPE_FEEDS)
            .bind(item.content_id)
            .bind(FAVORITE_STATUS_ACTIVE)
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

fn comment_insert_sqlite() -> &'static str {
    r#"
    INSERT INTO plus_comments
        (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, user_id,
         parent_id, path, sort_weight, content, content_type, content_id, status, likes,
         reply_count, is_top, ip_address, device_info, author)
    VALUES
        (?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
        uuid = excluded.uuid,
        created_at = excluded.created_at,
        updated_at = excluded.updated_at,
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
        author = excluded.author
    "#
}

fn comment_insert_postgres() -> &'static str {
    r#"
    INSERT INTO plus_comments
        (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, user_id,
         parent_id, path, sort_weight, content, content_type, content_id, status, likes,
         reply_count, is_top, ip_address, device_info, author)
    VALUES
        ($1, $2, $3::timestamptz, $4::timestamptz, 0, $5, $6, $7, $8, $9, $10, 0,
         $11, $12, $13, $14, $15, $16, $17, $18, $19, $20::jsonb)
    ON CONFLICT(id) DO UPDATE SET
        uuid = excluded.uuid,
        created_at = excluded.created_at,
        updated_at = excluded.updated_at,
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
        author = excluded.author
    "#
}

fn vote_insert_sqlite() -> &'static str {
    r#"
    INSERT INTO plus_content_vote
        (id, uuid, tenant_id, organization_id, data_scope, user_id, content_type, content_id,
         rating, metadata, source)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, 'like', ?, 'forum-seed')
    ON CONFLICT(user_id, content_type, content_id) DO UPDATE SET
        uuid = excluded.uuid,
        tenant_id = excluded.tenant_id,
        organization_id = excluded.organization_id,
        data_scope = excluded.data_scope,
        rating = excluded.rating,
        metadata = excluded.metadata,
        source = excluded.source,
        updated_at = CURRENT_TIMESTAMP
    "#
}

fn vote_insert_postgres() -> &'static str {
    r#"
    INSERT INTO plus_content_vote
        (id, uuid, tenant_id, organization_id, data_scope, user_id, content_type, content_id,
         rating, metadata, source)
    VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, 'like', $9::jsonb, 'forum-seed')
    ON CONFLICT(user_id, content_type, content_id) DO UPDATE SET
        uuid = excluded.uuid,
        tenant_id = excluded.tenant_id,
        organization_id = excluded.organization_id,
        data_scope = excluded.data_scope,
        rating = excluded.rating,
        metadata = excluded.metadata,
        source = excluded.source,
        updated_at = CURRENT_TIMESTAMP
    "#
}

fn favorite_insert_sqlite() -> &'static str {
    r#"
    INSERT INTO plus_favorite
        (id, uuid, tenant_id, organization_id, data_scope, user_id, title, image, content_type,
         content_id, folder_id, remark, tags, sort_weight, is_private, status, view_count)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 'forum tutorial seed', NULL, 0, 0, ?, 0)
    ON CONFLICT(user_id, content_type, content_id) DO UPDATE SET
        uuid = excluded.uuid,
        tenant_id = excluded.tenant_id,
        organization_id = excluded.organization_id,
        data_scope = excluded.data_scope,
        title = excluded.title,
        image = excluded.image,
        status = excluded.status,
        updated_at = CURRENT_TIMESTAMP
    "#
}

fn favorite_insert_postgres() -> &'static str {
    r#"
    INSERT INTO plus_favorite
        (id, uuid, tenant_id, organization_id, data_scope, user_id, title, image, content_type,
         content_id, folder_id, remark, tags, sort_weight, is_private, status, view_count)
    VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, NULL, 'forum tutorial seed',
         NULL, 0, false, $11, 0)
    ON CONFLICT(user_id, content_type, content_id) DO UPDATE SET
        uuid = excluded.uuid,
        tenant_id = excluded.tenant_id,
        organization_id = excluded.organization_id,
        data_scope = excluded.data_scope,
        title = excluded.title,
        image = excluded.image,
        status = excluded.status,
        updated_at = CURRENT_TIMESTAMP
    "#
}

async fn sqlite_feed_seed_standard_count(
    pool: &SqlitePool,
    seed: &ForumSeedBundle,
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in &seed.feeds {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM plus_feeds
            WHERE id = ?
              AND uuid = ?
              AND tenant_id = ?
              AND organization_id = ?
              AND title = ?
              AND summary = ?
              AND content_type = ?
              AND content_id = ?
              AND category_id = ?
              AND tags = ?
              AND status = ?
              AND is_top = ?
              AND is_recommended = ?
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(item.tenant_id)
        .bind(item.organization_id)
        .bind(&item.title)
        .bind(feed_content(item))
        .bind(CONTENT_TYPE_FEEDS)
        .bind(item.id)
        .bind(item.category_id)
        .bind(json_string(&item.tags))
        .bind(FEEDS_STATUS_PUBLISHED)
        .bind(item.is_top)
        .bind(item.is_recommended)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn postgres_feed_seed_standard_count(
    pool: &PgPool,
    seed: &ForumSeedBundle,
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in &seed.feeds {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM plus_feeds
            WHERE id = $1
              AND uuid = $2
              AND tenant_id = $3
              AND organization_id = $4
              AND title = $5
              AND summary = $6
              AND content_type = $7
              AND content_id = $8
              AND category_id = $9
              AND tags = $10::jsonb
              AND status = $11
              AND is_top = $12
              AND is_recommended = $13
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(item.tenant_id)
        .bind(item.organization_id)
        .bind(&item.title)
        .bind(feed_content(item))
        .bind(CONTENT_TYPE_FEEDS)
        .bind(item.id)
        .bind(item.category_id)
        .bind(json_string(&item.tags))
        .bind(FEEDS_STATUS_PUBLISHED)
        .bind(item.is_top)
        .bind(item.is_recommended)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn sqlite_seed_count(
    pool: &SqlitePool,
    table_name: &str,
    column_name: &str,
    values: &[&str],
) -> Result<i64, sqlx::Error> {
    if values.is_empty() {
        return Ok(0);
    }
    let placeholders = std::iter::repeat_n("?", values.len())
        .collect::<Vec<_>>()
        .join(", ");
    let sql = format!(
        "SELECT COUNT(1) AS count FROM {table_name} WHERE {column_name} IN ({placeholders})"
    );
    let mut query = sqlx::query(sql.as_str());
    for value in values {
        query = query.bind(value);
    }
    let row = query.fetch_one(pool).await?;
    Ok(row.get::<i64, _>("count"))
}

async fn postgres_seed_count(
    pool: &PgPool,
    table_name: &str,
    column_name: &str,
    values: &[&str],
) -> Result<i64, sqlx::Error> {
    if values.is_empty() {
        return Ok(0);
    }
    let sql = format!("SELECT COUNT(1) AS count FROM {table_name} WHERE {column_name} = ANY($1)");
    let row = sqlx::query(sql.as_str())
        .bind(values)
        .fetch_one(pool)
        .await?;
    Ok(row.get::<i64, _>("count"))
}

fn validate_forum_seed(seed: &ForumSeedBundle) -> Result<(), ForumSeedLoadError> {
    if seed.feeds.len() < 8 {
        return Err(ForumSeedLoadError::Validation(
            "forum seed must contain at least 8 tutorial feeds".to_owned(),
        ));
    }
    if seed.comments.len() < seed.feeds.len() {
        return Err(ForumSeedLoadError::Validation(
            "forum seed must contain at least one comment per tutorial feed".to_owned(),
        ));
    }
    let feed_ids = seed
        .feeds
        .iter()
        .map(|item| item.id)
        .collect::<BTreeSet<_>>();
    let feed_uuids = seed
        .feeds
        .iter()
        .map(|item| item.uuid.as_str())
        .collect::<BTreeSet<_>>();
    if feed_ids.len() != seed.feeds.len() || feed_uuids.len() != seed.feeds.len() {
        return Err(ForumSeedLoadError::Validation(
            "forum feed ids and uuids must be unique".to_owned(),
        ));
    }
    if !seed
        .feeds
        .iter()
        .any(|item| item.uuid == "sdkwork-forum-tutorial-quick-start")
    {
        return Err(ForumSeedLoadError::Validation(
            "forum seed must include the quick start tutorial".to_owned(),
        ));
    }
    for item in &seed.comments {
        if !feed_ids.contains(&item.feed_id) {
            return Err(ForumSeedLoadError::Validation(format!(
                "forum comment {} references missing feed {}",
                item.uuid, item.feed_id
            )));
        }
    }
    for item in &seed.votes {
        if !feed_ids.contains(&item.content_id) {
            return Err(ForumSeedLoadError::Validation(format!(
                "forum vote {} references missing feed {}",
                item.uuid, item.content_id
            )));
        }
    }
    for item in &seed.favorites {
        if !feed_ids.contains(&item.content_id) {
            return Err(ForumSeedLoadError::Validation(format!(
                "forum favorite {} references missing feed {}",
                item.uuid, item.content_id
            )));
        }
    }
    Ok(())
}

fn seed_feed(seed: &ForumSeedBundle, feed_id: i64) -> Result<&ForumFeedSeed, sqlx::Error> {
    seed.feeds
        .iter()
        .find(|item| item.id == feed_id)
        .ok_or_else(|| protocol_error(format!("missing forum seed feed id {feed_id}")))
}

fn feed_content(item: &ForumFeedSeed) -> String {
    let summary = item.summary.trim();
    let content = item.content.trim();
    if summary.is_empty() {
        return content.to_owned();
    }
    if content.is_empty() || content.starts_with(summary) {
        return content.to_owned();
    }
    format!("{summary}\n\n{content}")
}

fn comment_path(parent_id: Option<i64>) -> Option<String> {
    parent_id.map(|parent_id| format!("/{parent_id}/"))
}

fn empty_images_json() -> String {
    serde_json::json!({ "images": [] }).to_string()
}

fn empty_resources_json() -> String {
    serde_json::json!({ "resources": [] }).to_string()
}

fn seed_metadata(seed: &ForumSeedBundle, item_type: &str, item_uuid: &str) -> String {
    serde_json::json!({
        "source": seed.catalog_code,
        "catalogVersion": seed.catalog_version,
        "schemaVersion": seed.schema_version,
        "generatedAt": seed.generated_at,
        "itemType": item_type,
        "itemUuid": item_uuid,
        "sourceHash": seed_hash(),
    })
    .to_string()
}

fn seed_hash() -> String {
    let mut hasher = Sha256::new();
    hasher.update(FORUM_SEED_JSON.as_bytes());
    hex::encode(hasher.finalize())
}

fn json_string<T: serde::Serialize>(value: &T) -> String {
    serde_json::to_string(value).unwrap_or_else(|_| "[]".to_owned())
}

fn json_decode_error(error: ForumSeedLoadError) -> sqlx::Error {
    protocol_error(format!("invalid bundled forum seed data: {error}"))
}

fn protocol_error(message: String) -> sqlx::Error {
    sqlx::Error::Protocol(message)
}
