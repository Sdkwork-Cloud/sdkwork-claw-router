use serde_json::Value;
use sqlx::{Row, SqlitePool};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    CourseApplicationCommandStore, CourseApplicationItem, CourseCategoryItem, CourseCommandFuture,
    CourseDetail, CourseEngagement, CourseInstructor, CourseItem, CourseLessonItem, CourseOverview,
    CourseOverviewSource, CourseOverviewStats, CourseQuery, CourseReadFuture, CourseReadStore,
    CourseSectionItem, CourseSubject, CreateCourseApplicationCommand,
};

const COURSE_STATUS_PUBLISHED: i64 = 1;
const COURSE_CATEGORY_TYPE: i64 = 6;
const COMMENT_STATUS_PUBLISHED: i64 = 1;
const CONTENT_TYPE_COURSE: i64 = 6;
const REACTION_TYPE_VIEW: i64 = 1;
const REACTION_TYPE_LIKE: i64 = 2;
const REACTION_TYPE_SAVE: i64 = 3;
const REACTION_TYPE_SHARE: i64 = 4;
const DEFAULT_PAGE_SIZE: i64 = 12;
const MAX_PAGE_SIZE: i64 = 240;
const COURSE_APPLICATION_STATUS_PENDING: i64 = 1;

#[derive(Debug, Clone)]
pub struct SqliteCourseStore {
    pool: SqlitePool,
}

impl SqliteCourseStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl CourseReadStore for SqliteCourseStore {
    fn load_courses<'a>(
        &'a self,
        query: CourseQuery,
        subject: Option<CourseSubject>,
    ) -> CourseReadFuture<'a, Vec<CourseItem>> {
        Box::pin(async move { load_courses(&self.pool, query, subject).await })
    }

    fn load_course_detail<'a>(
        &'a self,
        course_id: String,
        subject: Option<CourseSubject>,
    ) -> CourseReadFuture<'a, Option<CourseDetail>> {
        Box::pin(async move {
            let Some(course) = load_course_by_identifier(&self.pool, &course_id, subject).await?
            else {
                return Ok(None);
            };
            let sections = load_sections(&self.pool, course.content_id).await?;
            let related_courses =
                load_related_courses(&self.pool, course.content_id, subject).await?;
            Ok(Some(CourseDetail {
                course,
                sections,
                related_courses,
                source: live_course_source(),
            }))
        })
    }

    fn load_categories<'a>(
        &'a self,
        subject: Option<CourseSubject>,
    ) -> CourseReadFuture<'a, Vec<CourseCategoryItem>> {
        Box::pin(async move { load_categories(&self.pool, subject).await })
    }

    fn load_overview<'a>(
        &'a self,
        subject: Option<CourseSubject>,
    ) -> CourseReadFuture<'a, CourseOverview> {
        Box::pin(async move { load_overview(&self.pool, subject).await })
    }
}

impl CourseApplicationCommandStore for SqliteCourseStore {
    fn create_course_application<'a>(
        &'a self,
        command: CreateCourseApplicationCommand,
    ) -> CourseCommandFuture<'a, CourseApplicationItem> {
        Box::pin(async move { create_course_application(&self.pool, command).await })
    }
}

async fn create_course_application(
    pool: &SqlitePool,
    command: CreateCourseApplicationCommand,
) -> DomainResult<CourseApplicationItem> {
    let metadata = serde_json::json!({
        "source": "course_application",
        "notes": command.notes,
    })
    .to_string();
    let row = sqlx::query(
        r#"
        INSERT INTO content_course_application
            (uuid, tenant_id, organization_id, user_id, owner_type, owner_id, data_scope, status, metadata, title, category, description, source_provider, external_bvid, video_url, contact_name, contact_email, submitted_at)
        VALUES
            (?, ?, ?, ?, 1, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING
            id,
            uuid,
            title,
            category,
            description,
            source_provider,
            COALESCE(external_bvid, '') AS external_bvid,
            COALESCE(video_url, '') AS video_url,
            COALESCE(contact_name, '') AS contact_name,
            COALESCE(contact_email, '') AS contact_email,
            status,
            COALESCE(CAST(submitted_at AS TEXT), '') AS submitted_at
        "#,
    )
    .bind(&command.uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.user_id)
    .bind(command.subject.user_id)
    .bind(COURSE_APPLICATION_STATUS_PENDING)
    .bind(metadata)
    .bind(&command.title)
    .bind(&command.category)
    .bind(&command.description)
    .bind(&command.source_provider)
    .bind(command.external_bvid.as_deref())
    .bind(command.video_url.as_deref())
    .bind(command.contact_name.as_deref())
    .bind(command.contact_email.as_deref())
    .bind(&command.submitted_at)
    .fetch_one(pool)
    .await
    .map_err(sql_error)?;
    Ok(course_application_from_row(&row))
}

async fn load_courses(
    pool: &SqlitePool,
    query: CourseQuery,
    subject: Option<CourseSubject>,
) -> DomainResult<Vec<CourseItem>> {
    let scope = read_scope(subject);
    let page = query.page.unwrap_or(1).max(1);
    let size = query
        .size
        .unwrap_or(DEFAULT_PAGE_SIZE)
        .clamp(1, MAX_PAGE_SIZE);
    let offset = (page - 1) * size;
    let keyword = normalize_like_pattern(query.keyword.as_deref());
    let category = normalize_category_filter(query.category.as_deref());
    let sql = format!(
        r#"
        {select}
        WHERE COALESCE(c.status, 0) = ?3
          AND c.deleted_at IS NULL
          AND (?4 IS NULL OR COALESCE(c.level, 0) = ?4)
          AND (?5 IS NULL OR lower(COALESCE(c.category, '')) = ?5)
          AND (
                ?6 IS NULL
             OR lower(COALESCE(c.title, '') || ' ' || COALESCE(c.description, '') || ' ' || COALESCE(c.category, '') || ' ' || CAST(COALESCE(c.tags, '') AS TEXT)) LIKE ?6
          )
          AND {scope_filter}
        ORDER BY COALESCE(c.published_at, c.updated_at, c.created_at) DESC, c.id DESC
        LIMIT ?7 OFFSET ?8
        "#,
        select = COURSE_SELECT_COLUMNS,
        scope_filter = sqlite_scope_filter("c"),
    );
    let rows = sqlx::query(sql.as_str())
        .bind(scope.tenant_id)
        .bind(scope.organization_id)
        .bind(COURSE_STATUS_PUBLISHED)
        .bind(query.level)
        .bind(category.as_deref())
        .bind(keyword.as_deref())
        .bind(size)
        .bind(offset)
        .fetch_all(pool)
        .await
        .map_err(sql_error)?;
    Ok(rows.iter().map(course_from_row).collect())
}

async fn load_course_by_identifier(
    pool: &SqlitePool,
    course_id: &str,
    subject: Option<CourseSubject>,
) -> DomainResult<Option<CourseItem>> {
    let scope = read_scope(subject);
    let numeric_id = course_id.parse::<i64>().ok();
    let sql = format!(
        r#"
        {select}
        WHERE COALESCE(c.status, 0) = ?3
          AND c.deleted_at IS NULL
          AND (
                lower(COALESCE(c.course_code, '')) = ?4
             OR (?5 IS NOT NULL AND c.id = ?5)
          )
          AND {scope_filter}
        LIMIT 1
        "#,
        select = COURSE_SELECT_COLUMNS,
        scope_filter = sqlite_scope_filter("c"),
    );
    let row = sqlx::query(sql.as_str())
        .bind(scope.tenant_id)
        .bind(scope.organization_id)
        .bind(COURSE_STATUS_PUBLISHED)
        .bind(course_id.trim().to_ascii_lowercase())
        .bind(numeric_id)
        .fetch_optional(pool)
        .await
        .map_err(sql_error)?;
    Ok(row.as_ref().map(course_from_row))
}

async fn load_related_courses(
    pool: &SqlitePool,
    course_id: i64,
    subject: Option<CourseSubject>,
) -> DomainResult<Vec<CourseItem>> {
    let scope = read_scope(subject);
    let sql = format!(
        r#"
        {select}
        JOIN content_course_relation r
          ON r.related_course_id = c.id
         AND r.course_id = ?3
         AND COALESCE(r.status, 0) = ?4
         AND r.deleted_at IS NULL
        WHERE COALESCE(c.status, 0) = ?4
          AND c.deleted_at IS NULL
          AND {scope_filter}
        ORDER BY COALESCE(r.sort_order, 0), c.id
        LIMIT 8
        "#,
        select = COURSE_SELECT_COLUMNS,
        scope_filter = sqlite_scope_filter("c"),
    );
    let rows = sqlx::query(sql.as_str())
        .bind(scope.tenant_id)
        .bind(scope.organization_id)
        .bind(course_id)
        .bind(COURSE_STATUS_PUBLISHED)
        .fetch_all(pool)
        .await
        .map_err(sql_error)?;
    Ok(rows.iter().map(course_from_row).collect())
}

async fn load_sections(pool: &SqlitePool, course_id: i64) -> DomainResult<Vec<CourseSectionItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            id,
            COALESCE(section_no, 0) AS section_no,
            COALESCE(title, '') AS title,
            COALESCE(description, '') AS description,
            COALESCE(sort_order, section_no, id) AS sort_order,
            COALESCE(lesson_count, 0) AS lesson_count,
            COALESCE(duration_seconds, 0) AS duration_seconds
        FROM content_course_section
        WHERE course_id = ?1
          AND COALESCE(status, 0) = ?2
          AND deleted_at IS NULL
        ORDER BY COALESCE(sort_order, section_no, id), id
        "#,
    )
    .bind(course_id)
    .bind(COURSE_STATUS_PUBLISHED)
    .fetch_all(pool)
    .await
    .map_err(sql_error)?;

    let mut sections = Vec::new();
    for row in rows {
        let section_id = integer_cell(&row, "id");
        let lessons = load_lessons(pool, course_id, section_id).await?;
        sections.push(CourseSectionItem {
            id: section_id.to_string(),
            section_id,
            section_no: integer_cell(&row, "section_no"),
            title: string_cell(&row, "title"),
            description: string_cell(&row, "description"),
            sort_order: integer_cell(&row, "sort_order"),
            lesson_count: integer_cell(&row, "lesson_count").max(lessons.len() as i64),
            duration_seconds: integer_cell(&row, "duration_seconds"),
            lessons,
        });
    }
    Ok(sections)
}

async fn load_lessons(
    pool: &SqlitePool,
    course_id: i64,
    section_id: i64,
) -> DomainResult<Vec<CourseLessonItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            id,
            COALESCE(lesson_no, 0) AS lesson_no,
            COALESCE(title, '') AS title,
            COALESCE(description, '') AS description,
            COALESCE(video_url, '') AS video_url,
            COALESCE(external_bvid, '') AS external_bvid,
            COALESCE(source_provider, '') AS source_provider,
            COALESCE(duration_seconds, 0) AS duration_seconds,
            COALESCE(duration_text, '') AS duration_text,
            COALESCE(content, '') AS content,
            COALESCE(sort_order, lesson_no, id) AS sort_order,
            COALESCE(free_preview, 0) AS free_preview
        FROM content_course_lesson
        WHERE course_id = ?1
          AND section_id = ?2
          AND COALESCE(status, 0) = ?3
          AND deleted_at IS NULL
        ORDER BY COALESCE(sort_order, lesson_no, id), id
        "#,
    )
    .bind(course_id)
    .bind(section_id)
    .bind(COURSE_STATUS_PUBLISHED)
    .fetch_all(pool)
    .await
    .map_err(sql_error)?;
    Ok(rows
        .iter()
        .map(|row| {
            let lesson_id = integer_cell(row, "id");
            let lesson_no = integer_cell(row, "lesson_no");
            CourseLessonItem {
                id: lesson_id.to_string(),
                lesson_id,
                lesson_no,
                number: lesson_no,
                title: string_cell(row, "title"),
                description: string_cell(row, "description"),
                video_url: string_cell(row, "video_url"),
                external_bvid: string_cell(row, "external_bvid"),
                source_provider: string_cell(row, "source_provider"),
                duration_seconds: integer_cell(row, "duration_seconds"),
                duration_text: string_cell(row, "duration_text"),
                content: string_cell(row, "content"),
                sort_order: integer_cell(row, "sort_order"),
                free_preview: bool_cell(row, "free_preview"),
            }
        })
        .collect())
}

async fn load_categories(
    pool: &SqlitePool,
    subject: Option<CourseSubject>,
) -> DomainResult<Vec<CourseCategoryItem>> {
    let scope = read_scope(subject);
    let sql = format!(
        r#"
        SELECT
            cat.id,
            COALESCE(cat.code, '') AS code,
            COALESCE(cat.name, '') AS name,
            COALESCE(cat.description, '') AS description,
            COALESCE(cat.icon, '') AS icon,
            COALESCE(cat.sort_weight, 0) AS sort_weight,
            (
                SELECT COUNT(1)
                FROM content_course c
                WHERE COALESCE(c.status, 0) = ?3
                  AND c.deleted_at IS NULL
                  AND lower(COALESCE(c.category, '')) = lower(COALESCE(cat.code, cat.name, ''))
                  AND {course_scope_filter}
            ) AS course_count
        FROM plus_category cat
        WHERE COALESCE(cat.type, 0) = ?4
          AND COALESCE(cat.visible, 1) = 1
          AND COALESCE(cat.status, 0) = 1
          AND lower(COALESCE(cat.group_name, '')) = 'course'
          AND {category_scope_filter}
        ORDER BY COALESCE(cat.sort_weight, 0), cat.id
        "#,
        course_scope_filter = sqlite_scope_filter("c"),
        category_scope_filter = sqlite_scope_filter("cat"),
    );
    let rows = sqlx::query(sql.as_str())
        .bind(scope.tenant_id)
        .bind(scope.organization_id)
        .bind(COURSE_STATUS_PUBLISHED)
        .bind(COURSE_CATEGORY_TYPE)
        .fetch_all(pool)
        .await
        .map_err(sql_error)?;
    Ok(rows
        .iter()
        .map(|row| {
            let id = integer_cell(row, "id");
            let name = string_cell(row, "name");
            let code = string_cell(row, "code");
            CourseCategoryItem {
                id: id.to_string(),
                code,
                label: name.clone(),
                name,
                description: string_cell(row, "description"),
                icon: string_cell(row, "icon"),
                sort_weight: integer_cell(row, "sort_weight"),
                course_count: integer_cell(row, "course_count"),
            }
        })
        .collect())
}

async fn load_overview(
    pool: &SqlitePool,
    subject: Option<CourseSubject>,
) -> DomainResult<CourseOverview> {
    let scope = read_scope(subject);
    let sql = format!(
        r#"
        SELECT
            COUNT(1) AS total_courses,
            COALESCE(SUM(COALESCE(lessons_count, 0)), 0) AS total_lessons,
            COALESCE(SUM(COALESCE(students_count, 0)), 0) AS total_students
        FROM content_course c
        WHERE COALESCE(c.status, 0) = ?3
          AND c.deleted_at IS NULL
          AND {scope_filter}
        "#,
        scope_filter = sqlite_scope_filter("c"),
    );
    let row = sqlx::query(sql.as_str())
        .bind(scope.tenant_id)
        .bind(scope.organization_id)
        .bind(COURSE_STATUS_PUBLISHED)
        .fetch_one(pool)
        .await
        .map_err(sql_error)?;
    let total_categories = load_categories(pool, subject).await?.len() as i64;
    Ok(CourseOverview {
        stats: CourseOverviewStats {
            total_courses: integer_cell(&row, "total_courses"),
            total_lessons: integer_cell(&row, "total_lessons"),
            total_students: integer_cell(&row, "total_students"),
            total_categories,
        },
        source: live_course_source(),
    })
}

const COURSE_SELECT_COLUMNS: &str = r#"
    SELECT
        c.id,
        COALESCE(c.course_code, '') AS course_code,
        COALESCE(c.title, '') AS title,
        COALESCE(c.description, '') AS description,
        COALESCE(c.thumbnail_url, '') AS thumbnail_url,
        CAST(COALESCE(c.instructor_snapshot, '') AS TEXT) AS instructor_snapshot,
        COALESCE(c.duration_text, '') AS duration_text,
        COALESCE(c.lessons_count, 0) AS lessons_count,
        CAST(COALESCE(c.rating_score, 0) AS TEXT) AS rating_score,
        COALESCE(c.students_count, 0) AS students_count,
        COALESCE(c.level, 0) AS level,
        COALESCE(c.category, '') AS category,
        COALESCE(cat.name, c.category, '') AS category_label,
        CAST(COALESCE(c.tags, '') AS TEXT) AS tags,
        COALESCE(c.external_bvid, '') AS external_bvid,
        COALESCE(c.content, '') AS content,
        CAST(c.price_amount AS TEXT) AS price_amount,
        COALESCE(c.currency, '') AS currency,
        COALESCE(c.is_collection, 0) AS is_collection,
        CAST(COALESCE(c.published_at, c.updated_at, c.created_at) AS TEXT) AS published_at,
        (
            SELECT COUNT(1)
            FROM plus_comments comments
            WHERE comments.content_type = 6
              AND comments.content_id = c.id
              AND COALESCE(comments.status, 0) = 1
        ) AS comment_count,
        (
            SELECT COALESCE(
                SUM(
                    CASE
                        WHEN TRIM(COALESCE(reaction.reaction_value, '')) <> ''
                         AND TRIM(COALESCE(reaction.reaction_value, '')) NOT GLOB '*[^0-9]*'
                        THEN CAST(TRIM(reaction.reaction_value) AS INTEGER)
                        ELSE 1
                    END
                ),
                0
            )
            FROM content_reaction reaction
            WHERE reaction.target_type = 6
              AND reaction.target_id = c.id
              AND reaction.reaction_type = 1
              AND COALESCE(reaction.status, 0) = 1
              AND reaction.cancelled_at IS NULL
        ) AS view_count,
        (
            SELECT COALESCE(
                SUM(
                    CASE
                        WHEN TRIM(COALESCE(reaction.reaction_value, '')) <> ''
                         AND TRIM(COALESCE(reaction.reaction_value, '')) NOT GLOB '*[^0-9]*'
                        THEN CAST(TRIM(reaction.reaction_value) AS INTEGER)
                        ELSE 1
                    END
                ),
                0
            )
            FROM content_reaction reaction
            WHERE reaction.target_type = 6
              AND reaction.target_id = c.id
              AND reaction.reaction_type = 2
              AND COALESCE(reaction.status, 0) = 1
              AND reaction.cancelled_at IS NULL
        ) AS like_count,
        (
            SELECT COALESCE(
                SUM(
                    CASE
                        WHEN TRIM(COALESCE(reaction.reaction_value, '')) <> ''
                         AND TRIM(COALESCE(reaction.reaction_value, '')) NOT GLOB '*[^0-9]*'
                        THEN CAST(TRIM(reaction.reaction_value) AS INTEGER)
                        ELSE 1
                    END
                ),
                0
            )
            FROM content_reaction reaction
            WHERE reaction.target_type = 6
              AND reaction.target_id = c.id
              AND reaction.reaction_type = 3
              AND COALESCE(reaction.status, 0) = 1
              AND reaction.cancelled_at IS NULL
        ) AS save_count,
        (
            SELECT COALESCE(
                SUM(
                    CASE
                        WHEN TRIM(COALESCE(reaction.reaction_value, '')) <> ''
                         AND TRIM(COALESCE(reaction.reaction_value, '')) NOT GLOB '*[^0-9]*'
                        THEN CAST(TRIM(reaction.reaction_value) AS INTEGER)
                        ELSE 1
                    END
                ),
                0
            )
            FROM content_reaction reaction
            WHERE reaction.target_type = 6
              AND reaction.target_id = c.id
              AND reaction.reaction_type = 4
              AND COALESCE(reaction.status, 0) = 1
              AND reaction.cancelled_at IS NULL
        ) AS share_count
    FROM content_course c
    LEFT JOIN plus_category cat
      ON lower(COALESCE(cat.code, '')) = lower(COALESCE(c.category, ''))
     AND cat.type = 6
     AND lower(COALESCE(cat.group_name, '')) = 'course'
"#;

fn course_from_row(row: &sqlx::sqlite::SqliteRow) -> CourseItem {
    let content_id = integer_cell(row, "id");
    let course_code = string_cell(row, "course_code");
    let id = if course_code.trim().is_empty() {
        content_id.to_string()
    } else {
        course_code.clone()
    };
    let students_count = integer_cell(row, "students_count");
    let comment_count = integer_cell(row, "comment_count");
    let view_count = integer_cell(row, "view_count").max(students_count);
    let like_count = integer_cell(row, "like_count");
    let save_count = integer_cell(row, "save_count");
    let share_count = integer_cell(row, "share_count");
    let level = integer_cell(row, "level");
    CourseItem {
        id,
        content_id,
        course_code,
        title: string_cell(row, "title"),
        description: string_cell(row, "description"),
        thumbnail_url: string_cell(row, "thumbnail_url"),
        instructor: parse_instructor(&string_cell(row, "instructor_snapshot")),
        duration_text: string_cell(row, "duration_text"),
        lessons_count: integer_cell(row, "lessons_count"),
        rating_score: string_cell(row, "rating_score")
            .parse::<f64>()
            .unwrap_or_default(),
        students_count,
        level,
        level_label: level_label(level).to_owned(),
        category: string_cell(row, "category"),
        category_label: string_cell(row, "category_label"),
        tags: parse_tags(&string_cell(row, "tags")),
        external_bvid: string_cell(row, "external_bvid"),
        content: string_cell(row, "content"),
        price_amount: optional_string_cell(row, "price_amount"),
        currency: string_cell(row, "currency"),
        is_collection: bool_cell(row, "is_collection"),
        published_at: string_cell(row, "published_at"),
        comment_count,
        engagement: CourseEngagement {
            views: view_count,
            likes: like_count,
            saves: save_count,
            shares: share_count,
            discussions: comment_count,
            students_count,
        },
    }
}

fn course_application_from_row(row: &sqlx::sqlite::SqliteRow) -> CourseApplicationItem {
    CourseApplicationItem {
        id: string_cell(row, "uuid"),
        application_id: integer_cell(row, "id"),
        title: string_cell(row, "title"),
        category: string_cell(row, "category"),
        description: string_cell(row, "description"),
        source_provider: string_cell(row, "source_provider"),
        external_bvid: string_cell(row, "external_bvid"),
        video_url: string_cell(row, "video_url"),
        contact_name: string_cell(row, "contact_name"),
        contact_email: string_cell(row, "contact_email"),
        status: course_application_status_label(integer_cell(row, "status")).to_owned(),
        submitted_at: string_cell(row, "submitted_at"),
    }
}

fn course_application_status_label(status: i64) -> &'static str {
    match status {
        COURSE_APPLICATION_STATUS_PENDING => "pending",
        2 => "approved",
        3 => "rejected",
        _ => "pending",
    }
}

#[derive(Debug, Clone, Copy)]
struct ReadScope {
    tenant_id: i64,
    organization_id: i64,
}

fn read_scope(subject: Option<CourseSubject>) -> ReadScope {
    let subject = subject.unwrap_or(CourseSubject {
        tenant_id: 0,
        organization_id: 0,
        user_id: 0,
    });
    ReadScope {
        tenant_id: subject.tenant_id.max(0),
        organization_id: subject.organization_id.max(0),
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

fn parse_instructor(raw: &str) -> CourseInstructor {
    let value = serde_json::from_str::<Value>(raw).unwrap_or(Value::Null);
    let object = value.as_object();
    CourseInstructor {
        name: object
            .and_then(|object| object.get("name"))
            .and_then(Value::as_str)
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .map(str::to_owned)
            .unwrap_or_else(|| "SDKWork Academy".to_owned()),
        avatar: object
            .and_then(|object| object.get("avatar"))
            .and_then(Value::as_str)
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .map(str::to_owned)
            .unwrap_or_default(),
        title: object
            .and_then(|object| object.get("title"))
            .and_then(Value::as_str)
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .map(str::to_owned)
            .unwrap_or_default(),
        bio: object
            .and_then(|object| object.get("bio"))
            .and_then(Value::as_str)
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .map(str::to_owned)
            .unwrap_or_default(),
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

fn normalize_category_filter(value: Option<&str>) -> Option<String> {
    let value = value?.trim();
    if value.is_empty() || value.eq_ignore_ascii_case("all") {
        None
    } else {
        Some(value.to_ascii_lowercase())
    }
}

fn level_label(level: i64) -> &'static str {
    match level {
        1 => "Beginner",
        2 => "Intermediate",
        3 => "Advanced",
        _ => "All",
    }
}

fn live_course_source() -> CourseOverviewSource {
    CourseOverviewSource {
        source_label: "Live course data".to_owned(),
        source_description:
            "Derived from Java-compatible course, category, comment, and reaction tables."
                .to_owned(),
        source_tables: vec![
            "content_course".to_owned(),
            "content_course_section".to_owned(),
            "content_course_lesson".to_owned(),
            "content_course_relation".to_owned(),
            "plus_category".to_owned(),
            "plus_comments".to_owned(),
            "content_reaction".to_owned(),
        ],
        observed_at: current_timestamp_string(),
    }
}

fn current_timestamp_string() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
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

#[allow(dead_code)]
fn _assert_course_constants() {
    let _ = (
        COMMENT_STATUS_PUBLISHED,
        CONTENT_TYPE_COURSE,
        REACTION_TYPE_VIEW,
        REACTION_TYPE_LIKE,
        REACTION_TYPE_SAVE,
        REACTION_TYPE_SHARE,
    );
}
