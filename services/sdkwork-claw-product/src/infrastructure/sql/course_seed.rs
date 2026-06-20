use std::collections::BTreeMap;

use serde::Deserialize;
use serde_json::Value;
use sha2::{Digest, Sha256};
use sqlx::{PgPool, Row, SqlitePool};

use crate::infrastructure::sql::sql_admin_product_center::{
    media_resource_object_blob_id, media_resource_stable_id,
};

const COURSE_SEED_JSON: &str = include_str!("../../../../../data/courses/course-seed.json");
const SYSTEM_TENANT_ID: i64 = 0;
const SYSTEM_ORGANIZATION_ID: i64 = 0;
const SYSTEM_DATA_SCOPE: i32 = 0;
const ACTIVE_STATUS: i32 = 1;
const COURSE_CATEGORY_TYPE: &str = "course";
const CONTENT_TYPE_COURSE: i32 = 6;
const COMMENT_STATUS_PUBLISHED: i32 = 1;
const REACTION_TYPE_VIEW: i32 = 1;
const REACTION_TYPE_LIKE: i32 = 2;
const REACTION_TYPE_SAVE: i32 = 3;
const REACTION_TYPE_SHARE: i32 = 4;

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CourseSeedBundle {
    schema_version: i32,
    kind: String,
    generated_at: String,
    categories: Vec<CourseCategorySeed>,
    courses: Vec<CourseSeed>,
    sections: Vec<CourseSectionSeed>,
    lessons: Vec<CourseLessonSeed>,
    relations: Vec<CourseRelationSeed>,
    comments: Vec<CourseCommentSeed>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CourseCategorySeed {
    id: i64,
    uuid: String,
    name: String,
    description: String,
    code: String,
    icon_key: String,
    sort_weight: i32,
    tags: Vec<String>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CourseSeed {
    id: i64,
    uuid: String,
    course_code: String,
    title: String,
    description: String,
    #[serde(deserialize_with = "deserialize_required_media_resource")]
    thumbnail: Value,
    instructor: Value,
    duration_text: String,
    lessons_count: i32,
    rating_score: String,
    students_count: i64,
    level: i32,
    category: String,
    tags: Vec<String>,
    external_bvid: String,
    content: String,
    price_amount: Option<String>,
    currency: String,
    is_collection: bool,
    published_at: String,
    engagement: CourseEngagementSeed,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CourseEngagementSeed {
    views: i64,
    likes: i64,
    saves: i64,
    shares: i64,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CourseSectionSeed {
    id: i64,
    uuid: String,
    course_code: String,
    section_no: i32,
    title: String,
    description: String,
    sort_order: i32,
    lesson_count: i32,
    duration_seconds: i64,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CourseLessonSeed {
    id: i64,
    uuid: String,
    course_code: String,
    section_no: i32,
    lesson_no: i32,
    title: String,
    description: String,
    #[serde(deserialize_with = "deserialize_required_media_resource")]
    video: Value,
    external_bvid: String,
    source_provider: String,
    duration_seconds: i64,
    duration_text: String,
    content: String,
    sort_order: i32,
    free_preview: bool,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CourseRelationSeed {
    id: i64,
    uuid: String,
    course_code: String,
    related_course_code: String,
    relation_type: i32,
    sort_order: i32,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CourseCommentSeed {
    id: i64,
    uuid: String,
    course_code: String,
    user_id: i64,
    content: String,
    likes: i32,
    created_at: String,
}

#[derive(Debug, Clone)]
struct CourseSeedCatalog {
    bundle: CourseSeedBundle,
    course_ids: BTreeMap<String, i64>,
    section_ids: BTreeMap<(String, i32), i64>,
    source_hash: String,
}

impl CourseSeedCatalog {
    fn load() -> Result<Self, serde_json::Error> {
        let bundle: CourseSeedBundle = serde_json::from_str(COURSE_SEED_JSON)?;
        let course_ids = bundle
            .courses
            .iter()
            .map(|course| (course.course_code.clone(), course.id))
            .collect::<BTreeMap<_, _>>();
        let section_ids = bundle
            .sections
            .iter()
            .map(|section| {
                (
                    (section.course_code.clone(), section.section_no),
                    section.id,
                )
            })
            .collect::<BTreeMap<_, _>>();
        Ok(Self {
            bundle,
            course_ids,
            section_ids,
            source_hash: seed_hash(),
        })
    }

    fn payload(&self) -> String {
        serde_json::json!({
            "kind": self.bundle.kind,
            "schemaVersion": self.bundle.schema_version,
            "generatedAt": self.bundle.generated_at,
            "categoryCount": self.bundle.categories.len(),
            "courseCount": self.bundle.courses.len(),
            "sectionCount": self.bundle.sections.len(),
            "lessonCount": self.bundle.lessons.len(),
            "relationCount": self.bundle.relations.len(),
            "commentCount": self.bundle.comments.len(),
        })
        .to_string()
    }

    fn course_id(&self, course_code: &str) -> Result<i64, sqlx::Error> {
        self.course_ids
            .get(course_code)
            .copied()
            .ok_or_else(|| protocol_error(format!("missing course seed id for {course_code}")))
    }

    fn section_id(&self, course_code: &str, section_no: i32) -> Result<i64, sqlx::Error> {
        self.section_ids
            .get(&(course_code.to_owned(), section_no))
            .copied()
            .ok_or_else(|| {
                protocol_error(format!(
                    "missing course section seed id for {course_code}#{section_no}"
                ))
            })
    }
}

fn deserialize_required_media_resource<'de, D>(deserializer: D) -> Result<Value, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let raw = Value::deserialize(deserializer)?;
    validate_seed_media_resource(raw)
}

fn validate_seed_media_resource<E>(value: Value) -> Result<Value, E>
where
    E: serde::de::Error,
{
    let object = value
        .as_object()
        .ok_or_else(|| E::custom("course seed media resource must be an object"))?;
    let kind = object
        .get("kind")
        .and_then(Value::as_str)
        .map(str::trim)
        .filter(|value| !value.is_empty());
    let source = object
        .get("source")
        .and_then(Value::as_str)
        .map(str::trim)
        .filter(|value| !value.is_empty());
    let locator = ["publicUrl", "url", "uri", "objectKey", "objectBlobId", "id"]
        .iter()
        .find_map(|key| {
            object
                .get(*key)
                .and_then(|value| match value {
                    Value::String(text) => Some(text.trim().to_owned()),
                    Value::Number(number) => Some(number.to_string()),
                    _ => None,
                })
                .filter(|value| !value.is_empty())
        });
    if kind.is_none() || source.is_none() || locator.is_none() {
        return Err(E::custom(
            "course seed media resource must include kind, source, and a stable locator",
        ));
    }
    Ok(value)
}

pub(crate) fn bundled_course_seed_payload() -> Result<String, serde_json::Error> {
    Ok(CourseSeedCatalog::load()?.payload())
}

pub(crate) async fn import_sqlite_course_seed(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    let seed = CourseSeedCatalog::load().map_err(json_decode_error)?;
    let mut tx = pool.begin().await?;
    sync_sqlite_canonical_course_module(&mut tx, &seed).await?;
    tx.commit().await?;
    Ok(())
}

pub(crate) async fn repair_sqlite_course_seed(pool: &SqlitePool) -> Result<bool, sqlx::Error> {
    if sqlite_course_seed_complete(pool).await? {
        return Ok(false);
    }
    import_sqlite_course_seed(pool).await?;
    Ok(true)
}

pub(crate) async fn import_postgres_course_seed(pool: &PgPool) -> Result<(), sqlx::Error> {
    let seed = CourseSeedCatalog::load().map_err(json_decode_error)?;
    let mut tx = pool.begin().await?;
    sync_postgres_canonical_course_module(&mut tx, &seed).await?;
    tx.commit().await?;
    Ok(())
}

pub(crate) async fn sqlite_course_seed_complete(pool: &SqlitePool) -> Result<bool, sqlx::Error> {
    let seed = CourseSeedCatalog::load().map_err(json_decode_error)?;
    let course_count = sqlite_canonical_seed_count(
        pool,
        "course_catalog",
        &seed
            .bundle
            .courses
            .iter()
            .map(|item| canonical_course_id(item.id))
            .collect::<Vec<_>>(),
    )
    .await?;
    let category_count = sqlite_canonical_seed_count(
        pool,
        "course_category",
        &seed
            .bundle
            .categories
            .iter()
            .map(|item| canonical_category_id(item.id))
            .collect::<Vec<_>>(),
    )
    .await?;
    let section_count = sqlite_canonical_seed_count(
        pool,
        "course_section",
        &seed
            .bundle
            .sections
            .iter()
            .map(|item| canonical_course_id(item.id))
            .collect::<Vec<_>>(),
    )
    .await?;
    let lesson_count = sqlite_canonical_seed_count(
        pool,
        "course_lesson",
        &seed
            .bundle
            .lessons
            .iter()
            .map(|item| canonical_course_id(item.id))
            .collect::<Vec<_>>(),
    )
    .await?;
    let relation_count = sqlite_canonical_seed_count(
        pool,
        "course_catalog_link",
        &seed
            .bundle
            .relations
            .iter()
            .map(|item| canonical_catalog_link_id(item.id))
            .collect::<Vec<_>>(),
    )
    .await?;
    let comment_count = sqlite_canonical_seed_count(
        pool,
        "course_comment",
        &seed
            .bundle
            .comments
            .iter()
            .map(|item| canonical_comment_id(item.id))
            .collect::<Vec<_>>(),
    )
    .await?;
    Ok(course_count == seed.bundle.courses.len() as i64
        && category_count == seed.bundle.categories.len() as i64
        && section_count == seed.bundle.sections.len() as i64
        && lesson_count == seed.bundle.lessons.len() as i64
        && relation_count == seed.bundle.relations.len() as i64
        && comment_count == seed.bundle.comments.len() as i64)
}

pub(crate) async fn postgres_course_seed_complete(pool: &PgPool) -> Result<bool, sqlx::Error> {
    let seed = CourseSeedCatalog::load().map_err(json_decode_error)?;
    let course_count = postgres_canonical_seed_count(
        pool,
        "course_catalog",
        &seed
            .bundle
            .courses
            .iter()
            .map(|item| canonical_course_id(item.id))
            .collect::<Vec<_>>(),
    )
    .await?;
    let category_count = postgres_canonical_seed_count(
        pool,
        "course_category",
        &seed
            .bundle
            .categories
            .iter()
            .map(|item| canonical_category_id(item.id))
            .collect::<Vec<_>>(),
    )
    .await?;
    let section_count = postgres_canonical_seed_count(
        pool,
        "course_section",
        &seed
            .bundle
            .sections
            .iter()
            .map(|item| canonical_course_id(item.id))
            .collect::<Vec<_>>(),
    )
    .await?;
    let lesson_count = postgres_canonical_seed_count(
        pool,
        "course_lesson",
        &seed
            .bundle
            .lessons
            .iter()
            .map(|item| canonical_course_id(item.id))
            .collect::<Vec<_>>(),
    )
    .await?;
    let relation_count = postgres_canonical_seed_count(
        pool,
        "course_catalog_link",
        &seed
            .bundle
            .relations
            .iter()
            .map(|item| canonical_catalog_link_id(item.id))
            .collect::<Vec<_>>(),
    )
    .await?;
    let comment_count = postgres_canonical_seed_count(
        pool,
        "course_comment",
        &seed
            .bundle
            .comments
            .iter()
            .map(|item| canonical_comment_id(item.id))
            .collect::<Vec<_>>(),
    )
    .await?;
    Ok(course_count == seed.bundle.courses.len() as i64
        && category_count == seed.bundle.categories.len() as i64
        && section_count == seed.bundle.sections.len() as i64
        && lesson_count == seed.bundle.lessons.len() as i64
        && relation_count == seed.bundle.relations.len() as i64
        && comment_count == seed.bundle.comments.len() as i64)
}

fn course_reaction_counts(course: &CourseSeed) -> [(i32, i64); 4] {
    [
        (REACTION_TYPE_VIEW, course.engagement.views),
        (REACTION_TYPE_LIKE, course.engagement.likes),
        (REACTION_TYPE_SAVE, course.engagement.saves),
        (REACTION_TYPE_SHARE, course.engagement.shares),
    ]
}

async fn sqlite_canonical_seed_count(
    pool: &SqlitePool,
    table_name: &str,
    ids: &[String],
) -> Result<i64, sqlx::Error> {
    if ids.is_empty() {
        return Ok(0);
    }
    let placeholders = std::iter::repeat_n("?", ids.len())
        .collect::<Vec<_>>()
        .join(", ");
    let sql = format!("SELECT COUNT(1) AS count FROM {table_name} WHERE id IN ({placeholders})");
    let mut query = sqlx::query(sql.as_str());
    for id in ids {
        query = query.bind(id);
    }
    let row = query.fetch_one(pool).await?;
    Ok(row.get::<i64, _>("count"))
}

async fn postgres_canonical_seed_count(
    pool: &PgPool,
    table_name: &str,
    ids: &[String],
) -> Result<i64, sqlx::Error> {
    if ids.is_empty() {
        return Ok(0);
    }
    let placeholders = (1..=ids.len())
        .map(|index| format!("${index}"))
        .collect::<Vec<_>>()
        .join(", ");
    let sql = format!("SELECT COUNT(1) AS count FROM {table_name} WHERE id IN ({placeholders})");
    let mut query = sqlx::query(sql.as_str());
    for id in ids {
        query = query.bind(id);
    }
    let row = query.fetch_one(pool).await?;
    Ok(row.get::<i64, _>("count"))
}

async fn sqlite_seed_count(
    pool: &SqlitePool,
    table_name: &str,
    column_name: &str,
    ids: &[i64],
) -> Result<i64, sqlx::Error> {
    if ids.is_empty() {
        return Ok(0);
    }
    let placeholders = std::iter::repeat_n("?", ids.len())
        .collect::<Vec<_>>()
        .join(", ");
    let sql = format!(
        "SELECT COUNT(1) AS count FROM {table_name} WHERE {column_name} IN ({placeholders})"
    );
    let mut query = sqlx::query(sql.as_str());
    for id in ids {
        query = query.bind(id);
    }
    let row = query.fetch_one(pool).await?;
    Ok(row.get::<i64, _>("count"))
}

async fn postgres_seed_count(
    pool: &PgPool,
    table_name: &str,
    column_name: &str,
    ids: &[i64],
) -> Result<i64, sqlx::Error> {
    if ids.is_empty() {
        return Ok(0);
    }
    let sql = format!("SELECT COUNT(1) AS count FROM {table_name} WHERE {column_name} = ANY($1)");
    let row = sqlx::query(sql.as_str()).bind(ids).fetch_one(pool).await?;
    Ok(row.get::<i64, _>("count"))
}

fn author_json(user_id: i64) -> String {
    serde_json::json!({
        "id": user_id,
        "name": format!("Learner-{user_id}"),
        "avatar": external_url_media_resource("/assets/courses/avatars/learner.svg", "image"),
        "bio": "Course learner",
        "isFollowing": false
    })
    .to_string()
}

fn seed_metadata(seed: &CourseSeedCatalog, item_type: &str, item_uuid: &str) -> String {
    serde_json::json!({
        "source": seed.bundle.kind,
        "schemaVersion": seed.bundle.schema_version,
        "generatedAt": seed.bundle.generated_at,
        "itemType": item_type,
        "itemUuid": item_uuid,
        "sourceHash": &seed.source_hash,
    })
    .to_string()
}

fn external_url_media_resource(url: &str, kind: &str) -> Value {
    serde_json::json!({
        "kind": kind,
        "source": "external_url",
        "url": url,
        "publicUrl": url
    })
}

fn course_category_icon_resource(icon_key: &str) -> Value {
    serde_json::json!({
        "kind": "image",
        "source": "provider_asset",
        "uri": icon_key
    })
}

fn seed_hash() -> String {
    let mut hasher = Sha256::new();
    hasher.update(COURSE_SEED_JSON.as_bytes());
    hex::encode(hasher.finalize())
}

fn json_string<T: serde::Serialize>(value: &T) -> String {
    serde_json::to_string(value).unwrap_or_else(|_| "[]".to_owned())
}

fn json_decode_error(error: serde_json::Error) -> sqlx::Error {
    protocol_error(format!("invalid bundled course seed data: {error}"))
}

fn protocol_error(message: String) -> sqlx::Error {
    sqlx::Error::Protocol(message)
}

fn canonical_course_id(course_id: i64) -> String {
    course_id.to_string()
}

fn canonical_category_id(category_id: i64) -> String {
    format!("course-category-{category_id}")
}

fn json_path_text(value: &Value, path: &[&str]) -> String {
    let mut current = Some(value);
    for segment in path {
        current = current.and_then(|value| value.get(*segment));
    }
    current
        .and_then(|value| match value {
            Value::String(text) => Some(text.trim().to_owned()),
            Value::Number(number) => Some(number.to_string()),
            Value::Bool(value) => Some(value.to_string()),
            _ => None,
        })
        .filter(|value| !value.is_empty())
        .unwrap_or_default()
}

fn canonical_instructor_id(course_id: i64) -> String {
    format!("course-instructor-{course_id}")
}

fn category_id_for_course(seed: &CourseSeedCatalog, category_code: &str) -> Option<String> {
    let normalized = category_code.trim();
    if normalized.is_empty() {
        return None;
    }
    seed.bundle
        .categories
        .iter()
        .find(|item| {
            item.code.eq_ignore_ascii_case(normalized)
                || item.name.eq_ignore_ascii_case(normalized)
        })
        .map(|item| canonical_category_id(item.id))
}

fn difficulty_level_label(level: i32) -> String {
    match level {
        1 => "Beginner".to_owned(),
        2 => "Intermediate".to_owned(),
        3 => "Advanced".to_owned(),
        _ => "All".to_owned(),
    }
}

fn canonical_resource_ref_id(owner_id: i64, resource_role: &str) -> String {
    format!("course-resource-{owner_id}-{resource_role}")
}

fn canonical_catalog_link_id(relation_id: i64) -> String {
    format!("course-link-{relation_id}")
}

fn canonical_comment_id(comment_id: i64) -> String {
    format!("course-comment-{comment_id}")
}

fn canonical_reaction_id(course_id: i64, reaction_type: i32) -> String {
    format!("course-reaction-{course_id}-{reaction_type}")
}

fn canonical_reaction_type(reaction_type: i32) -> &'static str {
    match reaction_type {
        REACTION_TYPE_VIEW => "view",
        REACTION_TYPE_LIKE => "like",
        REACTION_TYPE_SAVE => "save",
        REACTION_TYPE_SHARE => "share",
        _ => "unknown",
    }
}

fn non_empty_instructor_name(name: &str, fallback_title: &str) -> String {
    let trimmed = name.trim();
    if trimmed.is_empty() {
        fallback_title.to_owned()
    } else {
        trimmed.to_owned()
    }
}

async fn sync_sqlite_canonical_course_module(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &CourseSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.bundle.categories {
        let icon = course_category_icon_resource(&item.icon_key);
        sqlx::query(
            r#"
            INSERT INTO course_category
                (id, uuid, tenant_id, organization_id, category_code, name, description, icon_resource_snapshot, sort_order, status, created_at, updated_at)
            VALUES
                (?, ?, '0', '0', ?, ?, ?, ?, ?, 'active', datetime('now'), datetime('now'))
            ON CONFLICT(id) DO UPDATE SET
                name = excluded.name,
                description = excluded.description,
                icon_resource_snapshot = excluded.icon_resource_snapshot,
                sort_order = excluded.sort_order,
                status = excluded.status,
                updated_at = datetime('now')
            "#,
        )
        .bind(canonical_category_id(item.id))
        .bind(&item.uuid)
        .bind(&item.code)
        .bind(&item.name)
        .bind(&item.description)
        .bind(icon.to_string())
        .bind(item.sort_weight)
        .execute(&mut **tx)
        .await?;
    }

    for item in &seed.bundle.courses {
        let course_id = seed.course_id(&item.course_code)?;
        let thumbnail = item.thumbnail.to_string();
        sqlx::query(
            r#"
            INSERT INTO course_catalog
                (id, uuid, tenant_id, organization_id, course_code, title, summary, description, cover_resource_snapshot, tags_json, estimated_duration_seconds, lesson_count_snapshot, student_count_snapshot, rating_score_snapshot, publish_status, published_at, status, created_at, updated_at)
            VALUES
                (?, ?, '0', '0', ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, 'published', ?, 'active', datetime('now'), datetime('now'))
            ON CONFLICT(tenant_id, organization_id, course_code) DO UPDATE SET
                uuid = excluded.uuid,
                title = excluded.title,
                summary = excluded.summary,
                description = excluded.description,
                cover_resource_snapshot = excluded.cover_resource_snapshot,
                tags_json = excluded.tags_json,
                lesson_count_snapshot = excluded.lesson_count_snapshot,
                student_count_snapshot = excluded.student_count_snapshot,
                rating_score_snapshot = excluded.rating_score_snapshot,
                publish_status = excluded.publish_status,
                published_at = excluded.published_at,
                status = excluded.status,
                updated_at = datetime('now')
            "#,
        )
        .bind(canonical_course_id(course_id))
        .bind(&item.uuid)
        .bind(&item.course_code)
        .bind(&item.title)
        .bind(&item.description)
        .bind(&item.description)
        .bind(thumbnail)
        .bind(json_string(&item.tags))
        .bind(item.lessons_count)
        .bind(item.students_count)
        .bind(&item.rating_score)
        .bind(&item.published_at)
        .execute(&mut **tx)
        .await?;
    }

    for item in &seed.bundle.sections {
        let course_id = seed.course_id(&item.course_code)?;
        sqlx::query(
            r#"
            INSERT INTO course_section
                (id, uuid, tenant_id, organization_id, course_id, section_no, title, description, sort_order, lesson_count_snapshot, duration_seconds_snapshot, status, created_at, updated_at)
            VALUES
                (?, ?, '0', '0', ?, ?, ?, ?, ?, ?, ?, 'active', datetime('now'), datetime('now'))
            ON CONFLICT(id) DO UPDATE SET
                course_id = excluded.course_id,
                section_no = excluded.section_no,
                title = excluded.title,
                description = excluded.description,
                sort_order = excluded.sort_order,
                lesson_count_snapshot = excluded.lesson_count_snapshot,
                duration_seconds_snapshot = excluded.duration_seconds_snapshot,
                status = excluded.status,
                updated_at = datetime('now')
            "#,
        )
        .bind(canonical_course_id(item.id))
        .bind(&item.uuid)
        .bind(canonical_course_id(course_id))
        .bind(item.section_no.to_string())
        .bind(&item.title)
        .bind(&item.description)
        .bind(item.sort_order)
        .bind(item.lesson_count)
        .bind(item.duration_seconds)
        .execute(&mut **tx)
        .await?;
    }

    for item in &seed.bundle.lessons {
        let course_id = seed.course_id(&item.course_code)?;
        sqlx::query(
            r#"
            INSERT INTO course_lesson
                (id, uuid, tenant_id, organization_id, course_id, section_id, lesson_no, lesson_kind, title, description, content, duration_seconds, free_preview, status, sort_order, created_at, updated_at)
            VALUES
                (?, ?, '0', '0', ?, ?, ?, 'video', ?, ?, ?, ?, ?, 'active', ?, datetime('now'), datetime('now'))
            ON CONFLICT(tenant_id, course_id, lesson_no) DO UPDATE SET
                section_id = excluded.section_id,
                title = excluded.title,
                description = excluded.description,
                content = excluded.content,
                duration_seconds = excluded.duration_seconds,
                free_preview = excluded.free_preview,
                sort_order = excluded.sort_order,
                status = excluded.status,
                updated_at = datetime('now')
            "#,
        )
        .bind(canonical_course_id(item.id))
        .bind(&item.uuid)
        .bind(canonical_course_id(course_id))
        .bind(canonical_course_id(
            seed.bundle
                .sections
                .iter()
                .find(|section| {
                    section.course_code == item.course_code && section.section_no == item.section_no
                })
                .map(|section| section.id)
                .unwrap_or(item.id),
        ))
        .bind(item.lesson_no.to_string())
        .bind(&item.title)
        .bind(&item.description)
        .bind(&item.content)
        .bind(item.duration_seconds)
        .bind(i32::from(item.free_preview))
        .bind(item.sort_order)
        .execute(&mut **tx)
        .await?;
    }

    sync_sqlite_canonical_course_extensions(tx, seed).await?;
    Ok(())
}

async fn sync_sqlite_canonical_course_extensions(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &CourseSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.bundle.courses {
        let course_id = seed.course_id(&item.course_code)?;
        let instructor_id = canonical_instructor_id(course_id);
        let instructor_name = json_path_text(&item.instructor, &["name"]);
        sqlx::query(
            r#"
            INSERT INTO course_instructor
                (id, uuid, tenant_id, organization_id, display_name, profile_links_json, status, created_at, updated_at)
            VALUES
                (?, ?, '0', '0', ?, ?, 'active', datetime('now'), datetime('now'))
            ON CONFLICT(id) DO UPDATE SET
                display_name = excluded.display_name,
                profile_links_json = excluded.profile_links_json,
                updated_at = datetime('now')
            "#,
        )
        .bind(&instructor_id)
        .bind(format!("{instructor_id}-uuid"))
        .bind(non_empty_instructor_name(&instructor_name, &item.title))
        .bind(item.instructor.to_string())
        .execute(&mut **tx)
        .await?;

        let category_id = category_id_for_course(seed, &item.category);
        sqlx::query(
            r#"
            UPDATE course_catalog
            SET
                category_id = ?,
                primary_instructor_id = ?,
                subtitle = ?,
                difficulty_level = ?,
                external_source_id = ?,
                body_content = ?,
                price_amount = ?,
                currency = ?,
                is_collection = ?,
                updated_at = datetime('now')
            WHERE id = ?
            "#,
        )
        .bind(category_id)
        .bind(&instructor_id)
        .bind(&item.duration_text)
        .bind(difficulty_level_label(item.level))
        .bind(&item.external_bvid)
        .bind(&item.content)
        .bind(&item.price_amount)
        .bind(&item.currency)
        .bind(i32::from(item.is_collection))
        .bind(canonical_course_id(course_id))
        .execute(&mut **tx)
        .await?;
    }

    for item in &seed.bundle.lessons {
        sqlx::query(
            r#"
            UPDATE course_lesson
            SET
                duration_text = ?,
                external_source_id = ?,
                source_provider = ?,
                updated_at = datetime('now')
            WHERE id = ?
            "#,
        )
        .bind(&item.duration_text)
        .bind(&item.external_bvid)
        .bind(&item.source_provider)
        .bind(canonical_course_id(item.id))
        .execute(&mut **tx)
        .await?;

        let video = item.video.to_string();
        sqlx::query(
            r#"
            INSERT INTO course_resource_ref
                (id, uuid, tenant_id, organization_id, owner_type, owner_id, resource_role, drive_resource_id, media_resource_snapshot, status, created_at, updated_at)
            VALUES
                (?, ?, '0', '0', 'lesson', ?, 'primary_video', ?, ?, 'active', datetime('now'), datetime('now'))
            ON CONFLICT(id) DO UPDATE SET
                media_resource_snapshot = excluded.media_resource_snapshot,
                updated_at = datetime('now')
            "#,
        )
        .bind(canonical_resource_ref_id(item.id, "primary_video"))
        .bind(format!("course-lesson-video-{}", item.uuid))
        .bind(canonical_course_id(item.id))
        .bind(&item.external_bvid)
        .bind(video)
        .execute(&mut **tx)
        .await?;
    }

    for item in &seed.bundle.relations {
        let course_id = seed.course_id(&item.course_code)?;
        let related_course_id = seed.course_id(&item.related_course_code)?;
        sqlx::query(
            r#"
            INSERT INTO course_catalog_link
                (id, uuid, tenant_id, organization_id, course_id, linked_course_id, link_type, sort_order, status, created_at, updated_at)
            VALUES
                (?, ?, '0', '0', ?, ?, ?, ?, 'active', datetime('now'), datetime('now'))
            ON CONFLICT(id) DO UPDATE SET
                course_id = excluded.course_id,
                linked_course_id = excluded.linked_course_id,
                link_type = excluded.link_type,
                sort_order = excluded.sort_order,
                status = excluded.status,
                updated_at = datetime('now')
            "#,
        )
        .bind(canonical_catalog_link_id(item.id))
        .bind(&item.uuid)
        .bind(canonical_course_id(course_id))
        .bind(canonical_course_id(related_course_id))
        .bind(item.relation_type.to_string())
        .bind(item.sort_order)
        .execute(&mut **tx)
        .await?;
    }

    for item in &seed.bundle.comments {
        let course_id = seed.course_id(&item.course_code)?;
        sqlx::query(
            r#"
            INSERT INTO course_comment
                (id, uuid, tenant_id, organization_id, target_type, target_id, author_user_id, content, moderation_status, like_count_snapshot, status, created_at, updated_at)
            VALUES
                (?, ?, '0', '0', 'course', ?, ?, ?, 'approved', ?, 'active', ?, datetime('now'))
            ON CONFLICT(id) DO UPDATE SET
                content = excluded.content,
                like_count_snapshot = excluded.like_count_snapshot,
                updated_at = datetime('now')
            "#,
        )
        .bind(canonical_comment_id(item.id))
        .bind(&item.uuid)
        .bind(canonical_course_id(course_id))
        .bind(item.user_id.to_string())
        .bind(&item.content)
        .bind(item.likes)
        .bind(&item.created_at)
        .execute(&mut **tx)
        .await?;
    }

    for course in &seed.bundle.courses {
        let course_id = seed.course_id(&course.course_code)?;
        for (reaction_type, count) in course_reaction_counts(course) {
            sqlx::query(
                r#"
                INSERT INTO course_reaction
                    (id, uuid, tenant_id, organization_id, target_type, target_id, actor_user_id, reaction_type, reaction_value, status, created_at, updated_at)
                VALUES
                    (?, ?, '0', '0', 'course', ?, '0', ?, ?, 'active', datetime('now'), datetime('now'))
                ON CONFLICT(id) DO UPDATE SET
                    reaction_value = excluded.reaction_value,
                    updated_at = datetime('now')
                "#,
            )
            .bind(canonical_reaction_id(course_id, reaction_type))
            .bind(format!(
                "sdkwork-course-{}-reaction-{reaction_type}",
                course.course_code
            ))
            .bind(canonical_course_id(course_id))
            .bind(canonical_reaction_type(reaction_type))
            .bind(count.to_string())
            .execute(&mut **tx)
            .await?;
        }
    }
    Ok(())
}

async fn sync_postgres_canonical_course_module(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &CourseSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.bundle.categories {
        let icon = course_category_icon_resource(&item.icon_key);
        sqlx::query(
            r#"
            INSERT INTO course_category
                (id, uuid, tenant_id, organization_id, category_code, name, description, icon_resource_snapshot, sort_order, status, created_at, updated_at)
            VALUES
                ($1, $2, '0', '0', $3, $4, $5, $6, $7, 'active', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text)
            ON CONFLICT(id) DO UPDATE SET
                name = excluded.name,
                description = excluded.description,
                icon_resource_snapshot = excluded.icon_resource_snapshot,
                sort_order = excluded.sort_order,
                status = excluded.status,
                updated_at = CURRENT_TIMESTAMP::text
            "#,
        )
        .bind(canonical_category_id(item.id))
        .bind(&item.uuid)
        .bind(&item.code)
        .bind(&item.name)
        .bind(&item.description)
        .bind(icon.to_string())
        .bind(item.sort_weight)
        .execute(&mut **tx)
        .await?;
    }

    for item in &seed.bundle.courses {
        let course_id = seed.course_id(&item.course_code)?;
        let thumbnail = item.thumbnail.to_string();
        sqlx::query(
            r#"
            INSERT INTO course_catalog
                (id, uuid, tenant_id, organization_id, course_code, title, summary, description, cover_resource_snapshot, tags_json, estimated_duration_seconds, lesson_count_snapshot, student_count_snapshot, rating_score_snapshot, publish_status, published_at, status, created_at, updated_at)
            VALUES
                ($1, $2, '0', '0', $3, $4, $5, $6, $7, $8, 0, $9, $10, $11, 'published', $12, 'active', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text)
            ON CONFLICT(tenant_id, organization_id, course_code) DO UPDATE SET
                uuid = excluded.uuid,
                title = excluded.title,
                summary = excluded.summary,
                description = excluded.description,
                cover_resource_snapshot = excluded.cover_resource_snapshot,
                tags_json = excluded.tags_json,
                lesson_count_snapshot = excluded.lesson_count_snapshot,
                student_count_snapshot = excluded.student_count_snapshot,
                rating_score_snapshot = excluded.rating_score_snapshot,
                publish_status = excluded.publish_status,
                published_at = excluded.published_at,
                status = excluded.status,
                updated_at = CURRENT_TIMESTAMP::text
            "#,
        )
        .bind(canonical_course_id(course_id))
        .bind(&item.uuid)
        .bind(&item.course_code)
        .bind(&item.title)
        .bind(&item.description)
        .bind(&item.description)
        .bind(thumbnail)
        .bind(json_string(&item.tags))
        .bind(item.lessons_count)
        .bind(item.students_count)
        .bind(&item.rating_score)
        .bind(&item.published_at)
        .execute(&mut **tx)
        .await?;
    }

    for item in &seed.bundle.sections {
        let course_id = seed.course_id(&item.course_code)?;
        sqlx::query(
            r#"
            INSERT INTO course_section
                (id, uuid, tenant_id, organization_id, course_id, section_no, title, description, sort_order, lesson_count_snapshot, duration_seconds_snapshot, status, created_at, updated_at)
            VALUES
                ($1, $2, '0', '0', $3, $4, $5, $6, $7, $8, $9, 'active', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text)
            ON CONFLICT(id) DO UPDATE SET
                course_id = excluded.course_id,
                section_no = excluded.section_no,
                title = excluded.title,
                description = excluded.description,
                sort_order = excluded.sort_order,
                lesson_count_snapshot = excluded.lesson_count_snapshot,
                duration_seconds_snapshot = excluded.duration_seconds_snapshot,
                status = excluded.status,
                updated_at = CURRENT_TIMESTAMP::text
            "#,
        )
        .bind(canonical_course_id(item.id))
        .bind(&item.uuid)
        .bind(canonical_course_id(course_id))
        .bind(item.section_no.to_string())
        .bind(&item.title)
        .bind(&item.description)
        .bind(item.sort_order)
        .bind(item.lesson_count)
        .bind(item.duration_seconds)
        .execute(&mut **tx)
        .await?;
    }

    for item in &seed.bundle.lessons {
        let course_id = seed.course_id(&item.course_code)?;
        let section_id = seed
            .bundle
            .sections
            .iter()
            .find(|section| {
                section.course_code == item.course_code && section.section_no == item.section_no
            })
            .map(|section| section.id)
            .unwrap_or(item.id);
        sqlx::query(
            r#"
            INSERT INTO course_lesson
                (id, uuid, tenant_id, organization_id, course_id, section_id, lesson_no, lesson_kind, title, description, content, duration_seconds, free_preview, status, sort_order, created_at, updated_at)
            VALUES
                ($1, $2, '0', '0', $3, $4, $5, 'video', $6, $7, $8, $9, $10, 'active', $11, CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text)
            ON CONFLICT(tenant_id, course_id, lesson_no) DO UPDATE SET
                section_id = excluded.section_id,
                title = excluded.title,
                description = excluded.description,
                content = excluded.content,
                duration_seconds = excluded.duration_seconds,
                free_preview = excluded.free_preview,
                sort_order = excluded.sort_order,
                status = excluded.status,
                updated_at = CURRENT_TIMESTAMP::text
            "#,
        )
        .bind(canonical_course_id(item.id))
        .bind(&item.uuid)
        .bind(canonical_course_id(course_id))
        .bind(canonical_course_id(section_id))
        .bind(item.lesson_no.to_string())
        .bind(&item.title)
        .bind(&item.description)
        .bind(&item.content)
        .bind(item.duration_seconds)
        .bind(i32::from(item.free_preview))
        .bind(item.sort_order)
        .execute(&mut **tx)
        .await?;
    }

    sync_postgres_canonical_course_extensions(tx, seed).await?;
    Ok(())
}

async fn sync_postgres_canonical_course_extensions(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &CourseSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.bundle.courses {
        let course_id = seed.course_id(&item.course_code)?;
        let instructor_id = canonical_instructor_id(course_id);
        let instructor_name = json_path_text(&item.instructor, &["name"]);
        sqlx::query(
            r#"
            INSERT INTO course_instructor
                (id, uuid, tenant_id, organization_id, display_name, profile_links_json, status, created_at, updated_at)
            VALUES
                ($1, $2, '0', '0', $3, $4, 'active', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text)
            ON CONFLICT(id) DO UPDATE SET
                display_name = excluded.display_name,
                profile_links_json = excluded.profile_links_json,
                updated_at = CURRENT_TIMESTAMP::text
            "#,
        )
        .bind(&instructor_id)
        .bind(format!("{instructor_id}-uuid"))
        .bind(non_empty_instructor_name(&instructor_name, &item.title))
        .bind(item.instructor.to_string())
        .execute(&mut **tx)
        .await?;

        let category_id = category_id_for_course(seed, &item.category);
        sqlx::query(
            r#"
            UPDATE course_catalog
            SET
                category_id = $1,
                primary_instructor_id = $2,
                subtitle = $3,
                difficulty_level = $4,
                external_source_id = $5,
                body_content = $6,
                price_amount = $7,
                currency = $8,
                is_collection = $9,
                updated_at = CURRENT_TIMESTAMP::text
            WHERE id = $10
            "#,
        )
        .bind(category_id)
        .bind(&instructor_id)
        .bind(&item.duration_text)
        .bind(difficulty_level_label(item.level))
        .bind(&item.external_bvid)
        .bind(&item.content)
        .bind(&item.price_amount)
        .bind(&item.currency)
        .bind(i32::from(item.is_collection))
        .bind(canonical_course_id(course_id))
        .execute(&mut **tx)
        .await?;
    }

    for item in &seed.bundle.lessons {
        sqlx::query(
            r#"
            UPDATE course_lesson
            SET
                duration_text = $1,
                external_source_id = $2,
                source_provider = $3,
                updated_at = CURRENT_TIMESTAMP::text
            WHERE id = $4
            "#,
        )
        .bind(&item.duration_text)
        .bind(&item.external_bvid)
        .bind(&item.source_provider)
        .bind(canonical_course_id(item.id))
        .execute(&mut **tx)
        .await?;

        let video = item.video.to_string();
        sqlx::query(
            r#"
            INSERT INTO course_resource_ref
                (id, uuid, tenant_id, organization_id, owner_type, owner_id, resource_role, drive_resource_id, media_resource_snapshot, status, created_at, updated_at)
            VALUES
                ($1, $2, '0', '0', 'lesson', $3, 'primary_video', $4, $5, 'active', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text)
            ON CONFLICT(id) DO UPDATE SET
                media_resource_snapshot = excluded.media_resource_snapshot,
                updated_at = CURRENT_TIMESTAMP::text
            "#,
        )
        .bind(canonical_resource_ref_id(item.id, "primary_video"))
        .bind(format!("course-lesson-video-{}", item.uuid))
        .bind(canonical_course_id(item.id))
        .bind(&item.external_bvid)
        .bind(video)
        .execute(&mut **tx)
        .await?;
    }

    for item in &seed.bundle.relations {
        let course_id = seed.course_id(&item.course_code)?;
        let related_course_id = seed.course_id(&item.related_course_code)?;
        sqlx::query(
            r#"
            INSERT INTO course_catalog_link
                (id, uuid, tenant_id, organization_id, course_id, linked_course_id, link_type, sort_order, status, created_at, updated_at)
            VALUES
                ($1, $2, '0', '0', $3, $4, $5, $6, 'active', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text)
            ON CONFLICT(id) DO UPDATE SET
                course_id = excluded.course_id,
                linked_course_id = excluded.linked_course_id,
                link_type = excluded.link_type,
                sort_order = excluded.sort_order,
                status = excluded.status,
                updated_at = CURRENT_TIMESTAMP::text
            "#,
        )
        .bind(canonical_catalog_link_id(item.id))
        .bind(&item.uuid)
        .bind(canonical_course_id(course_id))
        .bind(canonical_course_id(related_course_id))
        .bind(item.relation_type.to_string())
        .bind(item.sort_order)
        .execute(&mut **tx)
        .await?;
    }

    for item in &seed.bundle.comments {
        let course_id = seed.course_id(&item.course_code)?;
        sqlx::query(
            r#"
            INSERT INTO course_comment
                (id, uuid, tenant_id, organization_id, target_type, target_id, author_user_id, content, moderation_status, like_count_snapshot, status, created_at, updated_at)
            VALUES
                ($1, $2, '0', '0', 'course', $3, $4, $5, 'approved', $6, 'active', $7, CURRENT_TIMESTAMP::text)
            ON CONFLICT(id) DO UPDATE SET
                content = excluded.content,
                like_count_snapshot = excluded.like_count_snapshot,
                updated_at = CURRENT_TIMESTAMP::text
            "#,
        )
        .bind(canonical_comment_id(item.id))
        .bind(&item.uuid)
        .bind(canonical_course_id(course_id))
        .bind(item.user_id.to_string())
        .bind(&item.content)
        .bind(item.likes)
        .bind(&item.created_at)
        .execute(&mut **tx)
        .await?;
    }

    for course in &seed.bundle.courses {
        let course_id = seed.course_id(&course.course_code)?;
        for (reaction_type, count) in course_reaction_counts(course) {
            sqlx::query(
                r#"
                INSERT INTO course_reaction
                    (id, uuid, tenant_id, organization_id, target_type, target_id, actor_user_id, reaction_type, reaction_value, status, created_at, updated_at)
                VALUES
                    ($1, $2, '0', '0', 'course', $3, '0', $4, $5, 'active', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text)
                ON CONFLICT(id) DO UPDATE SET
                    reaction_value = excluded.reaction_value,
                    updated_at = CURRENT_TIMESTAMP::text
                "#,
            )
            .bind(canonical_reaction_id(course_id, reaction_type))
            .bind(format!(
                "sdkwork-course-{}-reaction-{reaction_type}",
                course.course_code
            ))
            .bind(canonical_course_id(course_id))
            .bind(canonical_reaction_type(reaction_type))
            .bind(count.to_string())
            .execute(&mut **tx)
            .await?;
        }
    }
    Ok(())
}
