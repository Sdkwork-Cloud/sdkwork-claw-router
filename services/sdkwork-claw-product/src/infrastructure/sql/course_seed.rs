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
    import_sqlite_categories(&mut tx, &seed).await?;
    import_sqlite_courses(&mut tx, &seed).await?;
    import_sqlite_sections(&mut tx, &seed).await?;
    import_sqlite_lessons(&mut tx, &seed).await?;
    import_sqlite_relations(&mut tx, &seed).await?;
    import_sqlite_comments(&mut tx, &seed).await?;
    import_sqlite_reactions(&mut tx, &seed).await?;
    tx.commit().await?;
    Ok(())
}

pub(crate) async fn repair_sqlite_course_seed(pool: &SqlitePool) -> Result<bool, sqlx::Error> {
    if sqlite_course_seed_complete(pool).await? {
        return Ok(false);
    }

    let seed = CourseSeedCatalog::load().map_err(json_decode_error)?;
    let sections_complete = sqlite_course_sections_complete(pool, &seed).await?;
    let relations_complete = sqlite_course_relations_complete(pool, &seed).await?;
    if sections_complete && relations_complete {
        import_sqlite_course_seed(pool).await?;
        return Ok(true);
    }

    let mut tx = pool.begin().await?;
    if !sections_complete {
        import_sqlite_sections(&mut tx, &seed).await?;
    }
    if !relations_complete {
        import_sqlite_relations(&mut tx, &seed).await?;
    }
    tx.commit().await?;

    if !sqlite_course_seed_complete(pool).await? {
        import_sqlite_course_seed(pool).await?;
    }
    Ok(true)
}

pub(crate) async fn import_postgres_course_seed(pool: &PgPool) -> Result<(), sqlx::Error> {
    let seed = CourseSeedCatalog::load().map_err(json_decode_error)?;
    let mut tx = pool.begin().await?;
    import_postgres_categories(&mut tx, &seed).await?;
    import_postgres_courses(&mut tx, &seed).await?;
    import_postgres_sections(&mut tx, &seed).await?;
    import_postgres_lessons(&mut tx, &seed).await?;
    import_postgres_relations(&mut tx, &seed).await?;
    import_postgres_comments(&mut tx, &seed).await?;
    import_postgres_reactions(&mut tx, &seed).await?;
    tx.commit().await?;
    Ok(())
}

pub(crate) async fn sqlite_course_seed_complete(pool: &SqlitePool) -> Result<bool, sqlx::Error> {
    let seed = CourseSeedCatalog::load().map_err(json_decode_error)?;
    let course_count = sqlite_seed_count(
        pool,
        "content_course",
        "id",
        &seed
            .bundle
            .courses
            .iter()
            .map(|item| item.id)
            .collect::<Vec<_>>(),
    )
    .await?;
    let category_count = sqlite_seed_count(
        pool,
        "c_category",
        "id",
        &seed
            .bundle
            .categories
            .iter()
            .map(|item| item.id)
            .collect::<Vec<_>>(),
    )
    .await?;
    let section_count = sqlite_seed_count(
        pool,
        "content_course_section",
        "id",
        &seed
            .bundle
            .sections
            .iter()
            .map(|item| item.id)
            .collect::<Vec<_>>(),
    )
    .await?;
    let lesson_count = sqlite_seed_count(
        pool,
        "content_course_lesson",
        "id",
        &seed
            .bundle
            .lessons
            .iter()
            .map(|item| item.id)
            .collect::<Vec<_>>(),
    )
    .await?;
    let relation_count = sqlite_seed_count(
        pool,
        "content_course_relation",
        "id",
        &seed
            .bundle
            .relations
            .iter()
            .map(|item| item.id)
            .collect::<Vec<_>>(),
    )
    .await?;
    let comment_count = sqlite_seed_count(
        pool,
        "content_comment",
        "id",
        &seed
            .bundle
            .comments
            .iter()
            .map(|item| item.id)
            .collect::<Vec<_>>(),
    )
    .await?;
    if !(course_count == seed.bundle.courses.len() as i64
        && category_count == seed.bundle.categories.len() as i64
        && section_count == seed.bundle.sections.len() as i64
        && lesson_count == seed.bundle.lessons.len() as i64
        && relation_count == seed.bundle.relations.len() as i64
        && comment_count == seed.bundle.comments.len() as i64)
    {
        return Ok(false);
    }
    sqlite_course_seed_standard_fields_complete(pool, &seed).await
}

pub(crate) async fn postgres_course_seed_complete(pool: &PgPool) -> Result<bool, sqlx::Error> {
    let seed = CourseSeedCatalog::load().map_err(json_decode_error)?;
    let course_count = postgres_seed_count(
        pool,
        "content_course",
        "id",
        &seed
            .bundle
            .courses
            .iter()
            .map(|item| item.id)
            .collect::<Vec<_>>(),
    )
    .await?;
    let category_count = postgres_seed_count(
        pool,
        "c_category",
        "id",
        &seed
            .bundle
            .categories
            .iter()
            .map(|item| item.id)
            .collect::<Vec<_>>(),
    )
    .await?;
    let section_count = postgres_seed_count(
        pool,
        "content_course_section",
        "id",
        &seed
            .bundle
            .sections
            .iter()
            .map(|item| item.id)
            .collect::<Vec<_>>(),
    )
    .await?;
    let lesson_count = postgres_seed_count(
        pool,
        "content_course_lesson",
        "id",
        &seed
            .bundle
            .lessons
            .iter()
            .map(|item| item.id)
            .collect::<Vec<_>>(),
    )
    .await?;
    let relation_count = postgres_seed_count(
        pool,
        "content_course_relation",
        "id",
        &seed
            .bundle
            .relations
            .iter()
            .map(|item| item.id)
            .collect::<Vec<_>>(),
    )
    .await?;
    let comment_count = postgres_seed_count(
        pool,
        "content_comment",
        "id",
        &seed
            .bundle
            .comments
            .iter()
            .map(|item| item.id)
            .collect::<Vec<_>>(),
    )
    .await?;
    if !(course_count == seed.bundle.courses.len() as i64
        && category_count == seed.bundle.categories.len() as i64
        && section_count == seed.bundle.sections.len() as i64
        && lesson_count == seed.bundle.lessons.len() as i64
        && relation_count == seed.bundle.relations.len() as i64
        && comment_count == seed.bundle.comments.len() as i64)
    {
        return Ok(false);
    }
    postgres_course_seed_standard_fields_complete(pool, &seed).await
}

async fn sqlite_course_seed_standard_fields_complete(
    pool: &SqlitePool,
    seed: &CourseSeedCatalog,
) -> Result<bool, sqlx::Error> {
    for item in &seed.bundle.categories {
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM c_category
            WHERE id = ?
              AND uuid = ?
              AND tenant_id = ?
              AND organization_id = ?
              AND data_scope = ?
              AND category_type = ?
              AND code = ?
              AND sort_weight = ?
              AND parent_id IS NULL
              AND path = ?
              AND visible = 1
              AND status = ?
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(COURSE_CATEGORY_TYPE)
        .bind(&item.code)
        .bind(item.sort_weight)
        .bind(format!("/course/{}", item.code))
        .bind(ACTIVE_STATUS)
        .fetch_one(pool)
        .await?;
        if count != 1 {
            return Ok(false);
        }
    }

    for item in &seed.bundle.courses {
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM content_course
            WHERE id = ?
              AND uuid = ?
              AND tenant_id = ?
              AND organization_id = ?
              AND data_scope = ?
              AND status = ?
              AND deleted_at IS NULL
              AND deleted_by IS NULL
              AND course_code = ?
              AND title = ?
              AND lessons_count = ?
              AND level = ?
              AND category = ?
              AND external_bvid = ?
              AND currency = ?
              AND is_collection = ?
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(&item.course_code)
        .bind(&item.title)
        .bind(item.lessons_count)
        .bind(item.level)
        .bind(&item.category)
        .bind(&item.external_bvid)
        .bind(&item.currency)
        .bind(item.is_collection)
        .fetch_one(pool)
        .await?;
        if count != 1 {
            return Ok(false);
        }
    }

    for item in &seed.bundle.sections {
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM content_course_section
            WHERE id = ?
              AND uuid = ?
              AND tenant_id = ?
              AND organization_id = ?
              AND data_scope = ?
              AND status = ?
              AND deleted_at IS NULL
              AND deleted_by IS NULL
              AND course_id = ?
              AND section_no = ?
              AND title = ?
              AND sort_order = ?
              AND lesson_count = ?
              AND duration_seconds = ?
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(seed.course_id(&item.course_code)?)
        .bind(item.section_no)
        .bind(&item.title)
        .bind(item.sort_order)
        .bind(item.lesson_count)
        .bind(item.duration_seconds)
        .fetch_one(pool)
        .await?;
        if count != 1 {
            return Ok(false);
        }
    }

    for item in &seed.bundle.lessons {
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM content_course_lesson
            WHERE id = ?
              AND uuid = ?
              AND tenant_id = ?
              AND organization_id = ?
              AND data_scope = ?
              AND status = ?
              AND deleted_at IS NULL
              AND deleted_by IS NULL
              AND course_id = ?
              AND section_id = ?
              AND lesson_no = ?
              AND title = ?
              AND external_bvid = ?
              AND source_provider = ?
              AND duration_seconds = ?
              AND sort_order = ?
              AND free_preview = ?
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(seed.course_id(&item.course_code)?)
        .bind(seed.section_id(&item.course_code, item.section_no)?)
        .bind(item.lesson_no)
        .bind(&item.title)
        .bind(&item.external_bvid)
        .bind(&item.source_provider)
        .bind(item.duration_seconds)
        .bind(item.sort_order)
        .bind(item.free_preview)
        .fetch_one(pool)
        .await?;
        if count != 1 {
            return Ok(false);
        }
    }

    for item in &seed.bundle.relations {
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM content_course_relation
            WHERE id = ?
              AND uuid = ?
              AND tenant_id = ?
              AND organization_id = ?
              AND data_scope = ?
              AND status = ?
              AND deleted_at IS NULL
              AND deleted_by IS NULL
              AND course_id = ?
              AND related_course_id = ?
              AND relation_type = ?
              AND sort_order = ?
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(seed.course_id(&item.course_code)?)
        .bind(seed.course_id(&item.related_course_code)?)
        .bind(item.relation_type)
        .bind(item.sort_order)
        .fetch_one(pool)
        .await?;
        if count != 1 {
            return Ok(false);
        }
    }

    for item in &seed.bundle.comments {
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM content_comment
            WHERE id = ?
              AND uuid = ?
              AND tenant_id = ?
              AND organization_id = ?
              AND data_scope = ?
              AND user_id = ?
              AND content_type = ?
              AND content_id = ?
              AND status = ?
              AND likes = ?
              AND reply_count = 0
              AND is_top = 0
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(item.user_id)
        .bind(CONTENT_TYPE_COURSE)
        .bind(seed.course_id(&item.course_code)?)
        .bind(COMMENT_STATUS_PUBLISHED)
        .bind(item.likes)
        .fetch_one(pool)
        .await?;
        if count != 1 {
            return Ok(false);
        }
    }

    Ok(true)
}

async fn sqlite_course_sections_complete(
    pool: &SqlitePool,
    seed: &CourseSeedCatalog,
) -> Result<bool, sqlx::Error> {
    for item in &seed.bundle.sections {
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM content_course_section
            WHERE id = ?
              AND uuid = ?
              AND tenant_id = ?
              AND organization_id = ?
              AND data_scope = ?
              AND status = ?
              AND deleted_at IS NULL
              AND deleted_by IS NULL
              AND course_id = ?
              AND section_no = ?
              AND title = ?
              AND sort_order = ?
              AND lesson_count = ?
              AND duration_seconds = ?
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(seed.course_id(&item.course_code)?)
        .bind(item.section_no)
        .bind(&item.title)
        .bind(item.sort_order)
        .bind(item.lesson_count)
        .bind(item.duration_seconds)
        .fetch_one(pool)
        .await?;
        if count != 1 {
            return Ok(false);
        }
    }

    Ok(true)
}

async fn sqlite_course_relations_complete(
    pool: &SqlitePool,
    seed: &CourseSeedCatalog,
) -> Result<bool, sqlx::Error> {
    for item in &seed.bundle.relations {
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM content_course_relation
            WHERE id = ?
              AND uuid = ?
              AND tenant_id = ?
              AND organization_id = ?
              AND data_scope = ?
              AND status = ?
              AND deleted_at IS NULL
              AND deleted_by IS NULL
              AND course_id = ?
              AND related_course_id = ?
              AND relation_type = ?
              AND sort_order = ?
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(seed.course_id(&item.course_code)?)
        .bind(seed.course_id(&item.related_course_code)?)
        .bind(item.relation_type)
        .bind(item.sort_order)
        .fetch_one(pool)
        .await?;
        if count != 1 {
            return Ok(false);
        }
    }

    Ok(true)
}

async fn postgres_course_seed_standard_fields_complete(
    pool: &PgPool,
    seed: &CourseSeedCatalog,
) -> Result<bool, sqlx::Error> {
    for item in &seed.bundle.categories {
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM c_category
            WHERE id = $1
              AND uuid = $2
              AND tenant_id = $3
              AND organization_id = $4
              AND data_scope = $5
              AND category_type = $6
              AND code = $7
              AND sort_weight = $8
              AND parent_id IS NULL
              AND path = $9
              AND visible = TRUE
              AND status = $10
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(COURSE_CATEGORY_TYPE)
        .bind(&item.code)
        .bind(item.sort_weight)
        .bind(format!("/course/{}", item.code))
        .bind(ACTIVE_STATUS)
        .fetch_one(pool)
        .await?;
        if count != 1 {
            return Ok(false);
        }
    }

    for item in &seed.bundle.courses {
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM content_course
            WHERE id = $1
              AND uuid = $2
              AND tenant_id = $3
              AND organization_id = $4
              AND data_scope = $5
              AND status = $6
              AND deleted_at IS NULL
              AND deleted_by IS NULL
              AND course_code = $7
              AND title = $8
              AND lessons_count = $9
              AND level = $10
              AND category = $11
              AND external_bvid = $12
              AND currency = $13
              AND is_collection = $14
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(&item.course_code)
        .bind(&item.title)
        .bind(item.lessons_count)
        .bind(item.level)
        .bind(&item.category)
        .bind(&item.external_bvid)
        .bind(&item.currency)
        .bind(item.is_collection)
        .fetch_one(pool)
        .await?;
        if count != 1 {
            return Ok(false);
        }
    }

    for item in &seed.bundle.sections {
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM content_course_section
            WHERE id = $1
              AND uuid = $2
              AND tenant_id = $3
              AND organization_id = $4
              AND data_scope = $5
              AND status = $6
              AND deleted_at IS NULL
              AND deleted_by IS NULL
              AND course_id = $7
              AND section_no = $8
              AND title = $9
              AND sort_order = $10
              AND lesson_count = $11
              AND duration_seconds = $12
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(seed.course_id(&item.course_code)?)
        .bind(item.section_no)
        .bind(&item.title)
        .bind(item.sort_order)
        .bind(item.lesson_count)
        .bind(item.duration_seconds)
        .fetch_one(pool)
        .await?;
        if count != 1 {
            return Ok(false);
        }
    }

    for item in &seed.bundle.lessons {
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM content_course_lesson
            WHERE id = $1
              AND uuid = $2
              AND tenant_id = $3
              AND organization_id = $4
              AND data_scope = $5
              AND status = $6
              AND deleted_at IS NULL
              AND deleted_by IS NULL
              AND course_id = $7
              AND section_id = $8
              AND lesson_no = $9
              AND title = $10
              AND external_bvid = $11
              AND source_provider = $12
              AND duration_seconds = $13
              AND sort_order = $14
              AND free_preview = $15
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(seed.course_id(&item.course_code)?)
        .bind(seed.section_id(&item.course_code, item.section_no)?)
        .bind(item.lesson_no)
        .bind(&item.title)
        .bind(&item.external_bvid)
        .bind(&item.source_provider)
        .bind(item.duration_seconds)
        .bind(item.sort_order)
        .bind(item.free_preview)
        .fetch_one(pool)
        .await?;
        if count != 1 {
            return Ok(false);
        }
    }

    for item in &seed.bundle.relations {
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM content_course_relation
            WHERE id = $1
              AND uuid = $2
              AND tenant_id = $3
              AND organization_id = $4
              AND data_scope = $5
              AND status = $6
              AND deleted_at IS NULL
              AND deleted_by IS NULL
              AND course_id = $7
              AND related_course_id = $8
              AND relation_type = $9
              AND sort_order = $10
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(seed.course_id(&item.course_code)?)
        .bind(seed.course_id(&item.related_course_code)?)
        .bind(item.relation_type)
        .bind(item.sort_order)
        .fetch_one(pool)
        .await?;
        if count != 1 {
            return Ok(false);
        }
    }

    for item in &seed.bundle.comments {
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM content_comment
            WHERE id = $1
              AND uuid = $2
              AND tenant_id = $3
              AND organization_id = $4
              AND data_scope = $5
              AND user_id = $6
              AND content_type = $7
              AND content_id = $8
              AND status = $9
              AND likes = $10
              AND reply_count = 0
              AND is_top = FALSE
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(item.user_id)
        .bind(CONTENT_TYPE_COURSE)
        .bind(seed.course_id(&item.course_code)?)
        .bind(COMMENT_STATUS_PUBLISHED)
        .bind(item.likes)
        .fetch_one(pool)
        .await?;
        if count != 1 {
            return Ok(false);
        }
    }

    Ok(true)
}

async fn import_sqlite_categories(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &CourseSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.bundle.categories {
        let icon = course_category_icon_resource(&item.icon_key);
        let icon_media_resource_id = media_resource_stable_id(&icon);
        let icon_object_blob_id = Option::<i64>::None;
        let icon_resource_snapshot = icon.to_string();
        sqlx::query(
            r#"
            INSERT INTO c_category
                (id, uuid, tenant_id, organization_id, data_scope, category_type, name, description, code, tags, icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot, sort_weight, parent_id, path, visible, status)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                uuid = excluded.uuid,
                tenant_id = excluded.tenant_id,
                organization_id = excluded.organization_id,
                data_scope = excluded.data_scope,
                name = excluded.name,
                description = excluded.description,
                category_type = excluded.category_type,
                code = excluded.code,
                tags = excluded.tags,
                icon_media_resource_id = excluded.icon_media_resource_id,
                icon_object_blob_id = excluded.icon_object_blob_id,
                icon_resource_snapshot = excluded.icon_resource_snapshot,
                sort_weight = excluded.sort_weight,
                parent_id = excluded.parent_id,
                path = excluded.path,
                visible = excluded.visible,
                status = excluded.status,
                updated_at = CURRENT_TIMESTAMP
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind("course")
        .bind(&item.name)
        .bind(&item.description)
        .bind(&item.code)
        .bind(json_string(&item.tags))
        .bind(icon_media_resource_id)
        .bind(icon_object_blob_id)
        .bind(icon_resource_snapshot)
        .bind(item.sort_weight)
        .bind(Option::<i64>::None)
        .bind(format!("/course/{}", item.code))
        .bind(true)
        .bind(ACTIVE_STATUS)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_postgres_categories(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &CourseSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.bundle.categories {
        let icon = course_category_icon_resource(&item.icon_key);
        let icon_media_resource_id = media_resource_stable_id(&icon);
        let icon_object_blob_id = Option::<i64>::None;
        let icon_resource_snapshot = icon.to_string();
        sqlx::query(
            r#"
            INSERT INTO c_category
                (id, uuid, tenant_id, organization_id, data_scope, category_type, name, description, code, tags, icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot, sort_weight, parent_id, path, visible, status)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13, $14, $15::jsonb, $16, $17, $18)
            ON CONFLICT(id) DO UPDATE SET
                uuid = excluded.uuid,
                tenant_id = excluded.tenant_id,
                organization_id = excluded.organization_id,
                data_scope = excluded.data_scope,
                name = excluded.name,
                description = excluded.description,
                category_type = excluded.category_type,
                code = excluded.code,
                tags = excluded.tags,
                icon_media_resource_id = excluded.icon_media_resource_id,
                icon_object_blob_id = excluded.icon_object_blob_id,
                icon_resource_snapshot = excluded.icon_resource_snapshot,
                sort_weight = excluded.sort_weight,
                parent_id = excluded.parent_id,
                path = excluded.path,
                visible = excluded.visible,
                status = excluded.status,
                updated_at = CURRENT_TIMESTAMP
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind("course")
        .bind(&item.name)
        .bind(&item.description)
        .bind(&item.code)
        .bind(json_string(&item.tags))
        .bind(icon_media_resource_id)
        .bind(icon_object_blob_id)
        .bind(icon_resource_snapshot)
        .bind(item.sort_weight)
        .bind(Option::<i64>::None)
        .bind(format!("/course/{}", item.code))
        .bind(true)
        .bind(ACTIVE_STATUS)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_sqlite_courses(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &CourseSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.bundle.courses {
        let thumbnail = item.thumbnail.clone();
        let thumbnail_media_resource_id = media_resource_stable_id(&thumbnail);
        let thumbnail_object_blob_id = media_resource_object_blob_id(&thumbnail);
        let thumbnail_resource_snapshot = thumbnail.to_string();
        sqlx::query(course_insert_sqlite())
            .bind(item.id)
            .bind(&item.uuid)
            .bind(SYSTEM_TENANT_ID)
            .bind(SYSTEM_ORGANIZATION_ID)
            .bind(SYSTEM_DATA_SCOPE)
            .bind(ACTIVE_STATUS)
            .bind(seed_metadata(seed, "course", &item.uuid))
            .bind(&item.course_code)
            .bind(&item.title)
            .bind(&item.description)
            .bind(thumbnail_media_resource_id)
            .bind(thumbnail_object_blob_id)
            .bind(thumbnail_resource_snapshot)
            .bind(item.instructor.to_string())
            .bind(&item.duration_text)
            .bind(item.lessons_count)
            .bind(&item.rating_score)
            .bind(item.students_count)
            .bind(item.level)
            .bind(&item.category)
            .bind(json_string(&item.tags))
            .bind(&item.external_bvid)
            .bind(&item.content)
            .bind(&item.price_amount)
            .bind(&item.currency)
            .bind(item.is_collection)
            .bind(&item.published_at)
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

async fn import_postgres_courses(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &CourseSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.bundle.courses {
        let thumbnail = item.thumbnail.clone();
        let thumbnail_media_resource_id = media_resource_stable_id(&thumbnail);
        let thumbnail_object_blob_id = media_resource_object_blob_id(&thumbnail);
        let thumbnail_resource_snapshot = thumbnail.to_string();
        sqlx::query(course_insert_postgres())
            .bind(item.id)
            .bind(&item.uuid)
            .bind(SYSTEM_TENANT_ID)
            .bind(SYSTEM_ORGANIZATION_ID)
            .bind(SYSTEM_DATA_SCOPE)
            .bind(ACTIVE_STATUS)
            .bind(seed_metadata(seed, "course", &item.uuid))
            .bind(&item.course_code)
            .bind(&item.title)
            .bind(&item.description)
            .bind(thumbnail_media_resource_id)
            .bind(thumbnail_object_blob_id)
            .bind(thumbnail_resource_snapshot)
            .bind(item.instructor.to_string())
            .bind(&item.duration_text)
            .bind(item.lessons_count)
            .bind(&item.rating_score)
            .bind(item.students_count)
            .bind(item.level)
            .bind(&item.category)
            .bind(json_string(&item.tags))
            .bind(&item.external_bvid)
            .bind(&item.content)
            .bind(&item.price_amount)
            .bind(&item.currency)
            .bind(item.is_collection)
            .bind(&item.published_at)
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

async fn import_sqlite_sections(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &CourseSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.bundle.sections {
        let course_id = seed.course_id(&item.course_code)?;
        delete_sqlite_section_natural_key_conflict(tx, item.id, course_id, item.section_no).await?;
        sqlx::query(section_insert_sqlite())
            .bind(item.id)
            .bind(&item.uuid)
            .bind(SYSTEM_TENANT_ID)
            .bind(SYSTEM_ORGANIZATION_ID)
            .bind(SYSTEM_DATA_SCOPE)
            .bind(ACTIVE_STATUS)
            .bind(seed_metadata(seed, "course_section", &item.uuid))
            .bind(course_id)
            .bind(item.section_no)
            .bind(&item.title)
            .bind(&item.description)
            .bind(item.sort_order)
            .bind(item.lesson_count)
            .bind(item.duration_seconds)
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

async fn import_postgres_sections(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &CourseSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.bundle.sections {
        let course_id = seed.course_id(&item.course_code)?;
        delete_postgres_section_natural_key_conflict(tx, item.id, course_id, item.section_no)
            .await?;
        sqlx::query(section_insert_postgres())
            .bind(item.id)
            .bind(&item.uuid)
            .bind(SYSTEM_TENANT_ID)
            .bind(SYSTEM_ORGANIZATION_ID)
            .bind(SYSTEM_DATA_SCOPE)
            .bind(ACTIVE_STATUS)
            .bind(seed_metadata(seed, "course_section", &item.uuid))
            .bind(course_id)
            .bind(item.section_no)
            .bind(&item.title)
            .bind(&item.description)
            .bind(item.sort_order)
            .bind(item.lesson_count)
            .bind(item.duration_seconds)
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

async fn import_sqlite_lessons(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &CourseSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.bundle.lessons {
        let course_id = seed.course_id(&item.course_code)?;
        delete_sqlite_lesson_natural_key_conflict(tx, item.id, course_id, item.lesson_no).await?;
        let video = item.video.clone();
        let video_media_resource_id = media_resource_stable_id(&video);
        let video_object_blob_id = media_resource_object_blob_id(&video);
        let video_resource_snapshot = video.to_string();
        sqlx::query(lesson_insert_sqlite())
            .bind(item.id)
            .bind(&item.uuid)
            .bind(SYSTEM_TENANT_ID)
            .bind(SYSTEM_ORGANIZATION_ID)
            .bind(SYSTEM_DATA_SCOPE)
            .bind(ACTIVE_STATUS)
            .bind(seed_metadata(seed, "course_lesson", &item.uuid))
            .bind(course_id)
            .bind(seed.section_id(&item.course_code, item.section_no)?)
            .bind(item.lesson_no)
            .bind(&item.title)
            .bind(&item.description)
            .bind(video_media_resource_id)
            .bind(video_object_blob_id)
            .bind(video_resource_snapshot)
            .bind(&item.external_bvid)
            .bind(&item.source_provider)
            .bind(item.duration_seconds)
            .bind(&item.duration_text)
            .bind(&item.content)
            .bind(item.sort_order)
            .bind(item.free_preview)
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

async fn import_postgres_lessons(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &CourseSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.bundle.lessons {
        let course_id = seed.course_id(&item.course_code)?;
        delete_postgres_lesson_natural_key_conflict(tx, item.id, course_id, item.lesson_no).await?;
        let video = item.video.clone();
        let video_media_resource_id = media_resource_stable_id(&video);
        let video_object_blob_id = media_resource_object_blob_id(&video);
        let video_resource_snapshot = video.to_string();
        sqlx::query(lesson_insert_postgres())
            .bind(item.id)
            .bind(&item.uuid)
            .bind(SYSTEM_TENANT_ID)
            .bind(SYSTEM_ORGANIZATION_ID)
            .bind(SYSTEM_DATA_SCOPE)
            .bind(ACTIVE_STATUS)
            .bind(seed_metadata(seed, "course_lesson", &item.uuid))
            .bind(course_id)
            .bind(seed.section_id(&item.course_code, item.section_no)?)
            .bind(item.lesson_no)
            .bind(&item.title)
            .bind(&item.description)
            .bind(video_media_resource_id)
            .bind(video_object_blob_id)
            .bind(video_resource_snapshot)
            .bind(&item.external_bvid)
            .bind(&item.source_provider)
            .bind(item.duration_seconds)
            .bind(&item.duration_text)
            .bind(&item.content)
            .bind(item.sort_order)
            .bind(item.free_preview)
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

async fn import_sqlite_relations(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &CourseSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.bundle.relations {
        let course_id = seed.course_id(&item.course_code)?;
        let related_course_id = seed.course_id(&item.related_course_code)?;
        delete_sqlite_relation_natural_key_conflict(
            tx,
            item.id,
            course_id,
            related_course_id,
            item.relation_type,
        )
        .await?;
        sqlx::query(relation_insert_sqlite())
            .bind(item.id)
            .bind(&item.uuid)
            .bind(SYSTEM_TENANT_ID)
            .bind(SYSTEM_ORGANIZATION_ID)
            .bind(SYSTEM_DATA_SCOPE)
            .bind(ACTIVE_STATUS)
            .bind(seed_metadata(seed, "course_relation", &item.uuid))
            .bind(course_id)
            .bind(related_course_id)
            .bind(item.relation_type)
            .bind(item.sort_order)
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

async fn import_postgres_relations(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &CourseSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.bundle.relations {
        let course_id = seed.course_id(&item.course_code)?;
        let related_course_id = seed.course_id(&item.related_course_code)?;
        delete_postgres_relation_natural_key_conflict(
            tx,
            item.id,
            course_id,
            related_course_id,
            item.relation_type,
        )
        .await?;
        sqlx::query(relation_insert_postgres())
            .bind(item.id)
            .bind(&item.uuid)
            .bind(SYSTEM_TENANT_ID)
            .bind(SYSTEM_ORGANIZATION_ID)
            .bind(SYSTEM_DATA_SCOPE)
            .bind(ACTIVE_STATUS)
            .bind(seed_metadata(seed, "course_relation", &item.uuid))
            .bind(course_id)
            .bind(related_course_id)
            .bind(item.relation_type)
            .bind(item.sort_order)
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

async fn delete_sqlite_section_natural_key_conflict(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    id: i64,
    course_id: i64,
    section_no: i32,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        DELETE FROM content_course_section
        WHERE id <> ?
          AND course_id = ?
          AND section_no = ?
        "#,
    )
    .bind(id)
    .bind(course_id)
    .bind(section_no)
    .execute(&mut **tx)
    .await?;
    Ok(())
}

async fn delete_postgres_section_natural_key_conflict(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    id: i64,
    course_id: i64,
    section_no: i32,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        DELETE FROM content_course_section
        WHERE id <> $1
          AND course_id = $2
          AND section_no = $3
        "#,
    )
    .bind(id)
    .bind(course_id)
    .bind(section_no)
    .execute(&mut **tx)
    .await?;
    Ok(())
}

async fn delete_sqlite_lesson_natural_key_conflict(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    id: i64,
    course_id: i64,
    lesson_no: i32,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        DELETE FROM content_course_lesson
        WHERE id <> ?
          AND course_id = ?
          AND lesson_no = ?
        "#,
    )
    .bind(id)
    .bind(course_id)
    .bind(lesson_no)
    .execute(&mut **tx)
    .await?;
    Ok(())
}

async fn delete_postgres_lesson_natural_key_conflict(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    id: i64,
    course_id: i64,
    lesson_no: i32,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        DELETE FROM content_course_lesson
        WHERE id <> $1
          AND course_id = $2
          AND lesson_no = $3
        "#,
    )
    .bind(id)
    .bind(course_id)
    .bind(lesson_no)
    .execute(&mut **tx)
    .await?;
    Ok(())
}

async fn delete_sqlite_relation_natural_key_conflict(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    id: i64,
    course_id: i64,
    related_course_id: i64,
    relation_type: i32,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        DELETE FROM content_course_relation
        WHERE id <> ?
          AND course_id = ?
          AND related_course_id = ?
          AND relation_type = ?
        "#,
    )
    .bind(id)
    .bind(course_id)
    .bind(related_course_id)
    .bind(relation_type)
    .execute(&mut **tx)
    .await?;
    Ok(())
}

async fn delete_postgres_relation_natural_key_conflict(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    id: i64,
    course_id: i64,
    related_course_id: i64,
    relation_type: i32,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        DELETE FROM content_course_relation
        WHERE id <> $1
          AND course_id = $2
          AND related_course_id = $3
          AND relation_type = $4
        "#,
    )
    .bind(id)
    .bind(course_id)
    .bind(related_course_id)
    .bind(relation_type)
    .execute(&mut **tx)
    .await?;
    Ok(())
}

async fn import_sqlite_comments(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &CourseSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.bundle.comments {
        sqlx::query(comment_insert_sqlite())
            .bind(item.id)
            .bind(&item.uuid)
            .bind(&item.created_at)
            .bind(&item.created_at)
            .bind(SYSTEM_TENANT_ID)
            .bind(SYSTEM_ORGANIZATION_ID)
            .bind(SYSTEM_DATA_SCOPE)
            .bind(item.user_id)
            .bind(&item.content)
            .bind(CONTENT_TYPE_COURSE)
            .bind(seed.course_id(&item.course_code)?)
            .bind(COMMENT_STATUS_PUBLISHED)
            .bind(item.likes)
            .bind(author_json(item.user_id))
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

async fn import_postgres_comments(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &CourseSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.bundle.comments {
        sqlx::query(comment_insert_postgres())
            .bind(item.id)
            .bind(&item.uuid)
            .bind(&item.created_at)
            .bind(SYSTEM_TENANT_ID)
            .bind(SYSTEM_ORGANIZATION_ID)
            .bind(SYSTEM_DATA_SCOPE)
            .bind(item.user_id)
            .bind(&item.content)
            .bind(CONTENT_TYPE_COURSE)
            .bind(seed.course_id(&item.course_code)?)
            .bind(COMMENT_STATUS_PUBLISHED)
            .bind(item.likes)
            .bind(author_json(item.user_id))
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

async fn import_sqlite_reactions(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &CourseSeedCatalog,
) -> Result<(), sqlx::Error> {
    for course in &seed.bundle.courses {
        for (reaction_type, count) in course_reaction_counts(course) {
            let id = course.id * 10 + i64::from(reaction_type);
            sqlx::query(reaction_insert_sqlite())
                .bind(id)
                .bind(format!(
                    "sdkwork-course-{}-reaction-{reaction_type}",
                    course.course_code
                ))
                .bind(SYSTEM_TENANT_ID)
                .bind(SYSTEM_ORGANIZATION_ID)
                .bind(0_i64)
                .bind(ACTIVE_STATUS)
                .bind(seed_metadata(seed, "course_reaction", &course.uuid))
                .bind(CONTENT_TYPE_COURSE)
                .bind(course.id)
                .bind(reaction_type)
                .bind(count.to_string())
                .execute(&mut **tx)
                .await?;
        }
    }
    Ok(())
}

async fn import_postgres_reactions(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &CourseSeedCatalog,
) -> Result<(), sqlx::Error> {
    for course in &seed.bundle.courses {
        for (reaction_type, count) in course_reaction_counts(course) {
            let id = course.id * 10 + i64::from(reaction_type);
            sqlx::query(reaction_insert_postgres())
                .bind(id)
                .bind(format!(
                    "sdkwork-course-{}-reaction-{reaction_type}",
                    course.course_code
                ))
                .bind(SYSTEM_TENANT_ID)
                .bind(SYSTEM_ORGANIZATION_ID)
                .bind(0_i64)
                .bind(ACTIVE_STATUS)
                .bind(seed_metadata(seed, "course_reaction", &course.uuid))
                .bind(CONTENT_TYPE_COURSE)
                .bind(course.id)
                .bind(reaction_type)
                .bind(count.to_string())
                .execute(&mut **tx)
                .await?;
        }
    }
    Ok(())
}

fn course_insert_sqlite() -> &'static str {
    r#"
    INSERT INTO content_course
        (id, uuid, tenant_id, organization_id, data_scope, status, metadata, course_code, title, description, thumbnail_media_resource_id, thumbnail_object_blob_id, thumbnail_resource_snapshot, instructor_snapshot, duration_text, lessons_count, rating_score, students_count, level, category, tags, external_bvid, content, price_amount, currency, is_collection, published_at)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(course_code) DO UPDATE SET
        uuid = excluded.uuid,
        tenant_id = excluded.tenant_id,
        organization_id = excluded.organization_id,
        data_scope = excluded.data_scope,
        status = excluded.status,
        metadata = excluded.metadata,
        title = excluded.title,
        description = excluded.description,
        thumbnail_media_resource_id = excluded.thumbnail_media_resource_id,
        thumbnail_object_blob_id = excluded.thumbnail_object_blob_id,
        thumbnail_resource_snapshot = excluded.thumbnail_resource_snapshot,
        instructor_snapshot = excluded.instructor_snapshot,
        duration_text = excluded.duration_text,
        lessons_count = excluded.lessons_count,
        rating_score = excluded.rating_score,
        students_count = excluded.students_count,
        level = excluded.level,
        category = excluded.category,
        tags = excluded.tags,
        external_bvid = excluded.external_bvid,
        content = excluded.content,
        price_amount = excluded.price_amount,
        currency = excluded.currency,
        is_collection = excluded.is_collection,
        published_at = excluded.published_at,
        deleted_at = NULL,
        updated_at = CURRENT_TIMESTAMP
    "#
}

fn course_insert_postgres() -> &'static str {
    r#"
    INSERT INTO content_course
        (id, uuid, tenant_id, organization_id, data_scope, status, metadata, course_code, title, description, thumbnail_media_resource_id, thumbnail_object_blob_id, thumbnail_resource_snapshot, instructor_snapshot, duration_text, lessons_count, rating_score, students_count, level, category, tags, external_bvid, content, price_amount, currency, is_collection, published_at)
    VALUES
        ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11, $12, $13::jsonb, $14::jsonb, $15, $16, $17::numeric, $18, $19, $20, $21::jsonb, $22, $23, $24::numeric, $25, $26, $27::timestamptz)
    ON CONFLICT(course_code) DO UPDATE SET
        uuid = excluded.uuid,
        tenant_id = excluded.tenant_id,
        organization_id = excluded.organization_id,
        data_scope = excluded.data_scope,
        status = excluded.status,
        metadata = excluded.metadata,
        title = excluded.title,
        description = excluded.description,
        thumbnail_media_resource_id = excluded.thumbnail_media_resource_id,
        thumbnail_object_blob_id = excluded.thumbnail_object_blob_id,
        thumbnail_resource_snapshot = excluded.thumbnail_resource_snapshot,
        instructor_snapshot = excluded.instructor_snapshot,
        duration_text = excluded.duration_text,
        lessons_count = excluded.lessons_count,
        rating_score = excluded.rating_score,
        students_count = excluded.students_count,
        level = excluded.level,
        category = excluded.category,
        tags = excluded.tags,
        external_bvid = excluded.external_bvid,
        content = excluded.content,
        price_amount = excluded.price_amount,
        currency = excluded.currency,
        is_collection = excluded.is_collection,
        published_at = excluded.published_at,
        deleted_at = NULL,
        updated_at = CURRENT_TIMESTAMP
    "#
}

fn section_insert_sqlite() -> &'static str {
    r#"
    INSERT INTO content_course_section
        (id, uuid, tenant_id, organization_id, data_scope, status, metadata, course_id, section_no, title, description, sort_order, lesson_count, duration_seconds)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
        uuid = excluded.uuid,
        tenant_id = excluded.tenant_id,
        organization_id = excluded.organization_id,
        data_scope = excluded.data_scope,
        course_id = excluded.course_id,
        section_no = excluded.section_no,
        status = excluded.status,
        metadata = excluded.metadata,
        title = excluded.title,
        description = excluded.description,
        sort_order = excluded.sort_order,
        lesson_count = excluded.lesson_count,
        duration_seconds = excluded.duration_seconds,
        deleted_at = NULL,
        updated_at = CURRENT_TIMESTAMP
    "#
}

fn section_insert_postgres() -> &'static str {
    r#"
    INSERT INTO content_course_section
        (id, uuid, tenant_id, organization_id, data_scope, status, metadata, course_id, section_no, title, description, sort_order, lesson_count, duration_seconds)
    VALUES
        ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11, $12, $13, $14)
    ON CONFLICT(id) DO UPDATE SET
        uuid = excluded.uuid,
        tenant_id = excluded.tenant_id,
        organization_id = excluded.organization_id,
        data_scope = excluded.data_scope,
        course_id = excluded.course_id,
        section_no = excluded.section_no,
        status = excluded.status,
        metadata = excluded.metadata,
        title = excluded.title,
        description = excluded.description,
        sort_order = excluded.sort_order,
        lesson_count = excluded.lesson_count,
        duration_seconds = excluded.duration_seconds,
        deleted_at = NULL,
        updated_at = CURRENT_TIMESTAMP
    "#
}

fn lesson_insert_sqlite() -> &'static str {
    r#"
    INSERT INTO content_course_lesson
        (id, uuid, tenant_id, organization_id, data_scope, status, metadata, course_id, section_id, lesson_no, title, description, video_media_resource_id, video_object_blob_id, video_resource_snapshot, external_bvid, source_provider, duration_seconds, duration_text, content, sort_order, free_preview)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
        uuid = excluded.uuid,
        tenant_id = excluded.tenant_id,
        organization_id = excluded.organization_id,
        data_scope = excluded.data_scope,
        course_id = excluded.course_id,
        section_id = excluded.section_id,
        lesson_no = excluded.lesson_no,
        status = excluded.status,
        metadata = excluded.metadata,
        title = excluded.title,
        description = excluded.description,
        video_media_resource_id = excluded.video_media_resource_id,
        video_object_blob_id = excluded.video_object_blob_id,
        video_resource_snapshot = excluded.video_resource_snapshot,
        external_bvid = excluded.external_bvid,
        source_provider = excluded.source_provider,
        duration_seconds = excluded.duration_seconds,
        duration_text = excluded.duration_text,
        content = excluded.content,
        sort_order = excluded.sort_order,
        free_preview = excluded.free_preview,
        deleted_at = NULL,
        updated_at = CURRENT_TIMESTAMP
    "#
}

fn lesson_insert_postgres() -> &'static str {
    r#"
    INSERT INTO content_course_lesson
        (id, uuid, tenant_id, organization_id, data_scope, status, metadata, course_id, section_id, lesson_no, title, description, video_media_resource_id, video_object_blob_id, video_resource_snapshot, external_bvid, source_provider, duration_seconds, duration_text, content, sort_order, free_preview)
    VALUES
        ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11, $12, $13, $14, $15::jsonb, $16, $17, $18, $19, $20, $21, $22)
    ON CONFLICT(id) DO UPDATE SET
        uuid = excluded.uuid,
        tenant_id = excluded.tenant_id,
        organization_id = excluded.organization_id,
        data_scope = excluded.data_scope,
        course_id = excluded.course_id,
        section_id = excluded.section_id,
        lesson_no = excluded.lesson_no,
        status = excluded.status,
        metadata = excluded.metadata,
        title = excluded.title,
        description = excluded.description,
        video_media_resource_id = excluded.video_media_resource_id,
        video_object_blob_id = excluded.video_object_blob_id,
        video_resource_snapshot = excluded.video_resource_snapshot,
        external_bvid = excluded.external_bvid,
        source_provider = excluded.source_provider,
        duration_seconds = excluded.duration_seconds,
        duration_text = excluded.duration_text,
        content = excluded.content,
        sort_order = excluded.sort_order,
        free_preview = excluded.free_preview,
        deleted_at = NULL,
        updated_at = CURRENT_TIMESTAMP
    "#
}

fn relation_insert_sqlite() -> &'static str {
    r#"
    INSERT INTO content_course_relation
        (id, uuid, tenant_id, organization_id, data_scope, status, metadata, course_id, related_course_id, relation_type, sort_order)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
        uuid = excluded.uuid,
        tenant_id = excluded.tenant_id,
        organization_id = excluded.organization_id,
        data_scope = excluded.data_scope,
        status = excluded.status,
        metadata = excluded.metadata,
        course_id = excluded.course_id,
        related_course_id = excluded.related_course_id,
        relation_type = excluded.relation_type,
        sort_order = excluded.sort_order,
        deleted_at = NULL,
        deleted_by = NULL,
        updated_at = CURRENT_TIMESTAMP
    "#
}

fn relation_insert_postgres() -> &'static str {
    r#"
    INSERT INTO content_course_relation
        (id, uuid, tenant_id, organization_id, data_scope, status, metadata, course_id, related_course_id, relation_type, sort_order)
    VALUES
        ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11)
    ON CONFLICT(id) DO UPDATE SET
        uuid = excluded.uuid,
        tenant_id = excluded.tenant_id,
        organization_id = excluded.organization_id,
        data_scope = excluded.data_scope,
        status = excluded.status,
        metadata = excluded.metadata,
        course_id = excluded.course_id,
        related_course_id = excluded.related_course_id,
        relation_type = excluded.relation_type,
        sort_order = excluded.sort_order,
        deleted_at = NULL,
        deleted_by = NULL,
        updated_at = CURRENT_TIMESTAMP
    "#
}

fn comment_insert_sqlite() -> &'static str {
    r#"
    INSERT INTO content_comment
        (id, uuid, created_at, updated_at, tenant_id, organization_id, data_scope, user_id, body, content_type, content_id, status, likes, reply_count, is_top, author)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?)
    ON CONFLICT(id) DO UPDATE SET
        uuid = excluded.uuid,
        created_at = excluded.created_at,
        updated_at = excluded.updated_at,
        tenant_id = excluded.tenant_id,
        organization_id = excluded.organization_id,
        data_scope = excluded.data_scope,
        user_id = excluded.user_id,
        body = excluded.body,
        content_type = excluded.content_type,
        content_id = excluded.content_id,
        status = excluded.status,
        likes = excluded.likes,
        author = excluded.author
    "#
}

fn comment_insert_postgres() -> &'static str {
    r#"
    INSERT INTO content_comment
        (id, uuid, created_at, updated_at, tenant_id, organization_id, data_scope, user_id, body, content_type, content_id, status, likes, reply_count, is_top, author)
    VALUES
        ($1, $2, $3::timestamptz, $3::timestamptz, $4, $5, $6, $7, $8, $9, $10, $11, $12, 0, false, $13::jsonb)
    ON CONFLICT(id) DO UPDATE SET
        uuid = excluded.uuid,
        created_at = excluded.created_at,
        updated_at = excluded.updated_at,
        tenant_id = excluded.tenant_id,
        organization_id = excluded.organization_id,
        data_scope = excluded.data_scope,
        user_id = excluded.user_id,
        body = excluded.body,
        content_type = excluded.content_type,
        content_id = excluded.content_id,
        status = excluded.status,
        likes = excluded.likes,
        author = excluded.author
    "#
}

fn reaction_insert_sqlite() -> &'static str {
    r#"
    INSERT INTO content_reaction
        (id, uuid, tenant_id, organization_id, user_id, status, metadata, target_type, target_id, reaction_type, reaction_value)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(tenant_id, organization_id, user_id, target_type, target_id, reaction_type) DO UPDATE SET
        uuid = excluded.uuid,
        status = excluded.status,
        metadata = excluded.metadata,
        reaction_value = excluded.reaction_value,
        cancelled_at = NULL
    "#
}

fn reaction_insert_postgres() -> &'static str {
    r#"
    INSERT INTO content_reaction
        (id, uuid, tenant_id, organization_id, user_id, status, metadata, target_type, target_id, reaction_type, reaction_value)
    VALUES
        ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11)
    ON CONFLICT(tenant_id, organization_id, user_id, target_type, target_id, reaction_type) DO UPDATE SET
        uuid = excluded.uuid,
        status = excluded.status,
        metadata = excluded.metadata,
        reaction_value = excluded.reaction_value,
        cancelled_at = NULL
    "#
}

fn course_reaction_counts(course: &CourseSeed) -> [(i32, i64); 4] {
    [
        (REACTION_TYPE_VIEW, course.engagement.views),
        (REACTION_TYPE_LIKE, course.engagement.likes),
        (REACTION_TYPE_SAVE, course.engagement.saves),
        (REACTION_TYPE_SHARE, course.engagement.shares),
    ]
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
