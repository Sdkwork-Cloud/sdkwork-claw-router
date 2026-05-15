use std::collections::BTreeMap;

use serde::Deserialize;
use serde_json::Value;
use sha2::{Digest, Sha256};
use sqlx::{PgPool, Row, SqlitePool};

const COURSE_SEED_JSON: &str = include_str!("../../../../../data/courses/course-seed.json");
const SYSTEM_TENANT_ID: i64 = 0;
const SYSTEM_ORGANIZATION_ID: i64 = 0;
const SYSTEM_DATA_SCOPE: i32 = 0;
const ACTIVE_STATUS: i32 = 1;
const COURSE_CATEGORY_TYPE: i32 = 6;
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
    icon: String,
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
    thumbnail_url: String,
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
    video_url: String,
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
        "plus_category",
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
        "plus_comments",
        "id",
        &seed
            .bundle
            .comments
            .iter()
            .map(|item| item.id)
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
        "plus_category",
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
        "plus_comments",
        "id",
        &seed
            .bundle
            .comments
            .iter()
            .map(|item| item.id)
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

async fn import_sqlite_categories(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &CourseSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.bundle.categories {
        sqlx::query(
            r#"
            INSERT INTO plus_category
                (id, uuid, tenant_id, organization_id, data_scope, name, description, shop_id, type, group_name, code, tags, icon, sort_weight, parent_id, path, visible, status)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                uuid = excluded.uuid,
                tenant_id = excluded.tenant_id,
                organization_id = excluded.organization_id,
                data_scope = excluded.data_scope,
                name = excluded.name,
                description = excluded.description,
                shop_id = excluded.shop_id,
                type = excluded.type,
                group_name = excluded.group_name,
                code = excluded.code,
                tags = excluded.tags,
                icon = excluded.icon,
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
        .bind(&item.name)
        .bind(&item.description)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(COURSE_CATEGORY_TYPE)
        .bind("course")
        .bind(&item.code)
        .bind(json_string(&item.tags))
        .bind(&item.icon)
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
        sqlx::query(
            r#"
            INSERT INTO plus_category
                (id, uuid, tenant_id, organization_id, data_scope, name, description, shop_id, type, group_name, code, tags, icon, sort_weight, parent_id, path, visible, status)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13, $14, $15, $16, $17, $18)
            ON CONFLICT(id) DO UPDATE SET
                uuid = excluded.uuid,
                tenant_id = excluded.tenant_id,
                organization_id = excluded.organization_id,
                data_scope = excluded.data_scope,
                name = excluded.name,
                description = excluded.description,
                shop_id = excluded.shop_id,
                type = excluded.type,
                group_name = excluded.group_name,
                code = excluded.code,
                tags = excluded.tags,
                icon = excluded.icon,
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
        .bind(&item.name)
        .bind(&item.description)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(COURSE_CATEGORY_TYPE)
        .bind("course")
        .bind(&item.code)
        .bind(json_string(&item.tags))
        .bind(&item.icon)
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
            .bind(&item.thumbnail_url)
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
            .bind(&item.thumbnail_url)
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
            .bind(&item.video_url)
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
            .bind(&item.video_url)
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
        (id, uuid, tenant_id, organization_id, data_scope, status, metadata, course_code, title, description, thumbnail_url, instructor_snapshot, duration_text, lessons_count, rating_score, students_count, level, category, tags, external_bvid, content, price_amount, currency, is_collection, published_at)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(course_code) DO UPDATE SET
        uuid = excluded.uuid,
        tenant_id = excluded.tenant_id,
        organization_id = excluded.organization_id,
        data_scope = excluded.data_scope,
        status = excluded.status,
        metadata = excluded.metadata,
        title = excluded.title,
        description = excluded.description,
        thumbnail_url = excluded.thumbnail_url,
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
        (id, uuid, tenant_id, organization_id, data_scope, status, metadata, course_code, title, description, thumbnail_url, instructor_snapshot, duration_text, lessons_count, rating_score, students_count, level, category, tags, external_bvid, content, price_amount, currency, is_collection, published_at)
    VALUES
        ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11, $12::jsonb, $13, $14, $15::numeric, $16, $17, $18, $19::jsonb, $20, $21, $22::numeric, $23, $24, $25::timestamptz)
    ON CONFLICT(course_code) DO UPDATE SET
        uuid = excluded.uuid,
        tenant_id = excluded.tenant_id,
        organization_id = excluded.organization_id,
        data_scope = excluded.data_scope,
        status = excluded.status,
        metadata = excluded.metadata,
        title = excluded.title,
        description = excluded.description,
        thumbnail_url = excluded.thumbnail_url,
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
        (id, uuid, tenant_id, organization_id, data_scope, status, metadata, course_id, section_id, lesson_no, title, description, video_url, external_bvid, source_provider, duration_seconds, duration_text, content, sort_order, free_preview)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        video_url = excluded.video_url,
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
        (id, uuid, tenant_id, organization_id, data_scope, status, metadata, course_id, section_id, lesson_no, title, description, video_url, external_bvid, source_provider, duration_seconds, duration_text, content, sort_order, free_preview)
    VALUES
        ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
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
        video_url = excluded.video_url,
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
    INSERT INTO plus_comments
        (id, uuid, created_at, updated_at, tenant_id, organization_id, data_scope, user_id, content, content_type, content_id, status, likes, reply_count, is_top, author)
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
        content = excluded.content,
        content_type = excluded.content_type,
        content_id = excluded.content_id,
        status = excluded.status,
        likes = excluded.likes,
        author = excluded.author
    "#
}

fn comment_insert_postgres() -> &'static str {
    r#"
    INSERT INTO plus_comments
        (id, uuid, created_at, updated_at, tenant_id, organization_id, data_scope, user_id, content, content_type, content_id, status, likes, reply_count, is_top, author)
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
        content = excluded.content,
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
        "avatar": "/assets/courses/avatars/learner.svg",
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
        "sourceHash": seed_hash(),
    })
    .to_string()
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
