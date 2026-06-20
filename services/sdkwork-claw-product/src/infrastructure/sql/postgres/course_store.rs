use serde_json::Value;
use sqlx::{PgPool, Row};

use crate::domain::{DomainError, DomainResult};
use crate::infrastructure::sql::sql_admin_product_center::{
    empty_media_resource, media_resource_from_snapshot, media_resource_locator,
    media_resource_object_blob_id, media_resource_stable_id,
};
use crate::ports::{
    CourseApplicationCommandStore, CourseApplicationItem, CourseCategoryItem, CourseCommandFuture,
    CourseDetail, CourseEngagement, CourseInstructor, CourseItem, CourseLessonItem, CourseOverview,
    CourseOverviewSource, CourseOverviewStats, CourseQuery, CourseReadFuture, CourseReadStore,
    CourseSectionItem, CourseSubject, CreateCourseApplicationCommand,
};

const COURSE_STATUS_PUBLISHED: i64 = 1;
const COURSE_STATUS_ACTIVE: &str = "active";
const COURSE_PUBLISH_STATUS_PUBLISHED: &str = "published";
const COURSE_CATEGORY_TYPE: &str = "course";
const COMMENT_STATUS_PUBLISHED: i64 = 1;
const CONTENT_TYPE_COURSE: i64 = 6;
const REACTION_TYPE_VIEW: i64 = 1;
const REACTION_TYPE_LIKE: i64 = 2;
const REACTION_TYPE_SAVE: i64 = 3;
const REACTION_TYPE_SHARE: i64 = 4;
const DEFAULT_PAGE_SIZE: i64 = 12;
const MAX_PAGE_SIZE: i64 = 240;

#[derive(Debug, Clone)]
pub struct PostgresCourseStore {
    pool: PgPool,
}

impl PostgresCourseStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[derive(Debug, Clone)]
pub struct PostgresCourseApplicationCommandStore {
    pool: PgPool,
}

impl PostgresCourseApplicationCommandStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl CourseReadStore for PostgresCourseStore {
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

impl CourseApplicationCommandStore for PostgresCourseStore {
    fn create_course_application<'a>(
        &'a self,
        command: CreateCourseApplicationCommand,
    ) -> CourseCommandFuture<'a, CourseApplicationItem> {
        Box::pin(async move { create_course_application(&self.pool, command).await })
    }
}

impl CourseApplicationCommandStore for PostgresCourseApplicationCommandStore {
    fn create_course_application<'a>(
        &'a self,
        command: CreateCourseApplicationCommand,
    ) -> CourseCommandFuture<'a, CourseApplicationItem> {
        Box::pin(async move { create_course_application(&self.pool, command).await })
    }
}

async fn create_course_application(
    pool: &PgPool,
    command: CreateCourseApplicationCommand,
) -> DomainResult<CourseApplicationItem> {
    let metadata = serde_json::json!({
        "source": "course_application",
        "sourceProvider": command.source_provider,
        "externalBvid": command.external_bvid,
        "notes": command.notes,
        "video": command.video,
    })
    .to_string();
    let video = command.video.as_ref();
    let sample_resource_ref_id = video.map(media_resource_stable_id);
    let row = sqlx::query(
        r#"
        INSERT INTO course_application
            (id, uuid, tenant_id, organization_id, applicant_user_id, title,
             category_id, description, sample_resource_ref_id, contact_name, contact_email,
             application_status, metadata_json, status, created_at, updated_at, version)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'submitted', $12, 'active', $13, $14, 0)
        RETURNING
            id,
            uuid,
            title,
            category_id AS category,
            description,
            application_status,
            metadata_json,
            COALESCE(contact_name, '') AS contact_name,
            COALESCE(contact_email, '') AS contact_email,
            created_at AS submitted_at
        "#,
    )
    .bind(&command.uuid)
    .bind(&command.uuid)
    .bind(command.subject.tenant_id.to_string())
    .bind(command.subject.organization_id.to_string())
    .bind(command.subject.user_id.to_string())
    .bind(&command.title)
    .bind(&command.category)
    .bind(&command.description)
    .bind(sample_resource_ref_id)
    .bind(command.contact_name.as_deref())
    .bind(command.contact_email.as_deref())
    .bind(metadata)
    .bind(&command.submitted_at)
    .bind(&command.submitted_at)
    .fetch_one(pool)
    .await
    .map_err(sql_error)?;
    Ok(course_application_from_row(&row))
}

async fn load_courses(
    pool: &PgPool,
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
        WHERE c.status = '{active_status}'
          AND c.publish_status = '{publish_status}'
          AND c.deleted_at IS NULL
          AND ($3::int8 IS NULL OR CASE lower(COALESCE(c.difficulty_level, ''))
                WHEN 'beginner' THEN 1
                WHEN 'intermediate' THEN 2
                WHEN 'advanced' THEN 3
                ELSE 0
            END = $3)
          AND ($4::text IS NULL OR lower(COALESCE(cat.category_code, '')) = $4)
          AND (
                $5::text IS NULL
             OR lower(COALESCE(c.title, '') || ' ' || COALESCE(c.description, '') || ' ' || COALESCE(cat.category_code, '') || ' ' || COALESCE(c.tags_json::text, '[]')) LIKE $5
          )
          AND {scope_filter}
        ORDER BY COALESCE(c.published_at, c.updated_at, c.created_at) DESC NULLS LAST, CAST(c.id AS BIGINT) DESC
        LIMIT $6 OFFSET $7
        "#,
        select = COURSE_SELECT_COLUMNS,
        scope_filter = postgres_canonical_scope_filter("c"),
        active_status = COURSE_STATUS_ACTIVE,
        publish_status = COURSE_PUBLISH_STATUS_PUBLISHED,
    );
    let rows = sqlx::query(sql.as_str())
        .bind(scope.tenant_id)
        .bind(scope.organization_id)
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
    pool: &PgPool,
    course_id: &str,
    subject: Option<CourseSubject>,
) -> DomainResult<Option<CourseItem>> {
    let scope = read_scope(subject);
    let numeric_id = course_id.parse::<i64>().ok();
    let sql = format!(
        r#"
        {select}
        WHERE c.status = '{active_status}'
          AND c.publish_status = '{publish_status}'
          AND c.deleted_at IS NULL
          AND (
                lower(COALESCE(c.course_code, '')) = $3
             OR c.id = $4
             OR ($5::int8 IS NOT NULL AND CAST(c.id AS BIGINT) = $5)
          )
          AND {scope_filter}
        LIMIT 1
        "#,
        select = COURSE_SELECT_COLUMNS,
        scope_filter = postgres_canonical_scope_filter("c"),
        active_status = COURSE_STATUS_ACTIVE,
        publish_status = COURSE_PUBLISH_STATUS_PUBLISHED,
    );
    let row = sqlx::query(sql.as_str())
        .bind(scope.tenant_id)
        .bind(scope.organization_id)
        .bind(course_id.trim().to_ascii_lowercase())
        .bind(course_id.trim())
        .bind(numeric_id)
        .fetch_optional(pool)
        .await
        .map_err(sql_error)?;
    Ok(row.as_ref().map(course_from_row))
}

async fn load_related_courses(
    pool: &PgPool,
    course_id: i64,
    subject: Option<CourseSubject>,
) -> DomainResult<Vec<CourseItem>> {
    let scope = read_scope(subject);
    let canonical_course_id = course_id.to_string();
    let sql = format!(
        r#"
        {select}
        JOIN course_catalog_link r
          ON r.linked_course_id = c.id
         AND r.course_id = $3
         AND r.status = '{active_status}'
        WHERE c.status = '{active_status}'
          AND c.publish_status = '{publish_status}'
          AND c.deleted_at IS NULL
          AND {scope_filter}
        ORDER BY COALESCE(r.sort_order, 0), CAST(c.id AS BIGINT)
        LIMIT 8
        "#,
        select = COURSE_SELECT_COLUMNS,
        scope_filter = postgres_canonical_scope_filter("c"),
        active_status = COURSE_STATUS_ACTIVE,
        publish_status = COURSE_PUBLISH_STATUS_PUBLISHED,
    );
    let rows = sqlx::query(sql.as_str())
        .bind(scope.tenant_id)
        .bind(scope.organization_id)
        .bind(canonical_course_id)
        .fetch_all(pool)
        .await
        .map_err(sql_error)?;
    Ok(rows.iter().map(course_from_row).collect())
}

async fn load_sections(pool: &PgPool, course_id: i64) -> DomainResult<Vec<CourseSectionItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            id,
            COALESCE(NULLIF(section_no, '')::int, 0) AS section_no,
            COALESCE(title, '') AS title,
            COALESCE(description, '') AS description,
            COALESCE(sort_order, NULLIF(section_no, '')::int, 0) AS sort_order,
            COALESCE(lesson_count_snapshot, 0) AS lesson_count,
            COALESCE(duration_seconds_snapshot, 0) AS duration_seconds
        FROM course_section
        WHERE course_id = $1
          AND status = $2
          AND deleted_at IS NULL
        ORDER BY COALESCE(sort_order, NULLIF(section_no, '')::int, 0), id
        "#,
    )
    .bind(course_id.to_string())
    .bind(COURSE_STATUS_ACTIVE)
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
    pool: &PgPool,
    course_id: i64,
    section_id: i64,
) -> DomainResult<Vec<CourseLessonItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            l.id,
            COALESCE(NULLIF(l.lesson_no, '')::int, 0) AS lesson_no,
            COALESCE(l.title, '') AS title,
            COALESCE(l.description, '') AS description,
            COALESCE(ref.media_resource_snapshot::text, '') AS video_resource_snapshot,
            COALESCE(l.external_source_id, '') AS external_bvid,
            COALESCE(l.source_provider, '') AS source_provider,
            COALESCE(l.duration_seconds, 0) AS duration_seconds,
            COALESCE(l.duration_text, '') AS duration_text,
            COALESCE(l.content, '') AS content,
            COALESCE(l.sort_order, NULLIF(l.lesson_no, '')::int, 0) AS sort_order,
            COALESCE(l.free_preview, false) AS free_preview
        FROM course_lesson l
        LEFT JOIN course_resource_ref ref
          ON ref.owner_type = 'lesson'
         AND ref.owner_id = l.id
         AND ref.resource_role = 'primary_video'
         AND ref.status = $4
         AND ref.deleted_at IS NULL
        WHERE l.course_id = $1
          AND l.section_id = $2
          AND l.status = $3
          AND l.deleted_at IS NULL
        ORDER BY COALESCE(l.sort_order, NULLIF(l.lesson_no, '')::int, 0), l.id
        "#,
    )
    .bind(course_id.to_string())
    .bind(section_id.to_string())
    .bind(COURSE_STATUS_ACTIVE)
    .bind(COURSE_STATUS_ACTIVE)
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
                video: media_resource_from_row(row, "video_resource_snapshot", "video"),
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
    pool: &PgPool,
    subject: Option<CourseSubject>,
) -> DomainResult<Vec<CourseCategoryItem>> {
    let scope = read_scope(subject);
    let sql = format!(
        r#"
        SELECT
            cat.id,
            COALESCE(cat.category_code, '') AS code,
            COALESCE(cat.name, '') AS name,
            COALESCE(cat.description, '') AS description,
            COALESCE(cat.icon_resource_snapshot::text, '') AS icon_resource_snapshot,
            COALESCE(cat.sort_order, 0) AS sort_weight,
            (
                SELECT COUNT(1)
                FROM course_catalog c
                WHERE c.category_id = cat.id
                  AND c.status = '{active_status}'
                  AND c.publish_status = '{publish_status}'
                  AND c.deleted_at IS NULL
                  AND {course_scope_filter}
            ) AS course_count
        FROM course_category cat
        WHERE cat.category_code <> 'root'
          AND cat.status = '{active_status}'
          AND cat.deleted_at IS NULL
          AND {category_scope_filter}
        ORDER BY COALESCE(cat.sort_order, 0), cat.id
        "#,
        course_scope_filter = postgres_canonical_scope_filter("c"),
        category_scope_filter = postgres_canonical_scope_filter("cat"),
        active_status = COURSE_STATUS_ACTIVE,
        publish_status = COURSE_PUBLISH_STATUS_PUBLISHED,
    );
    let rows = sqlx::query(sql.as_str())
        .bind(scope.tenant_id)
        .bind(scope.organization_id)
        .fetch_all(pool)
        .await
        .map_err(sql_error)?;
    Ok(rows
        .iter()
        .map(|row| {
            let id = string_cell(row, "id");
            let name = string_cell(row, "name");
            let code = string_cell(row, "code");
            CourseCategoryItem {
                id,
                code,
                label: name.clone(),
                name,
                description: string_cell(row, "description"),
                icon_key: media_resource_locator_from_row(row, "icon_resource_snapshot", "image"),
                sort_weight: integer_cell(row, "sort_weight"),
                course_count: integer_cell(row, "course_count"),
            }
        })
        .collect())
}

async fn load_overview(
    pool: &PgPool,
    subject: Option<CourseSubject>,
) -> DomainResult<CourseOverview> {
    let scope = read_scope(subject);
    let sql = format!(
        r#"
        SELECT
            COUNT(1) AS total_courses,
            COALESCE(SUM(COALESCE(c.lesson_count_snapshot, 0)), 0) AS total_lessons,
            COALESCE(SUM(COALESCE(c.student_count_snapshot, 0)), 0) AS total_students
        FROM course_catalog c
        WHERE c.status = '{active_status}'
          AND c.publish_status = '{publish_status}'
          AND c.deleted_at IS NULL
          AND {scope_filter}
        "#,
        scope_filter = postgres_canonical_scope_filter("c"),
        active_status = COURSE_STATUS_ACTIVE,
        publish_status = COURSE_PUBLISH_STATUS_PUBLISHED,
    );
    let row = sqlx::query(sql.as_str())
        .bind(scope.tenant_id)
        .bind(scope.organization_id)
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
        CAST(c.id AS BIGINT) AS id,
        COALESCE(c.course_code, '') AS course_code,
        COALESCE(c.title, '') AS title,
        COALESCE(c.description, '') AS description,
        COALESCE(c.cover_resource_snapshot::text, '') AS thumbnail_resource_snapshot,
        COALESCE(inst.profile_links_json::text, '{}') AS instructor_snapshot,
        COALESCE(c.subtitle, '') AS duration_text,
        COALESCE(c.lesson_count_snapshot, 0) AS lessons_count,
        CAST(COALESCE(c.rating_score_snapshot, '0') AS TEXT) AS rating_score,
        COALESCE(c.student_count_snapshot, 0) AS students_count,
        CASE lower(COALESCE(c.difficulty_level, ''))
            WHEN 'beginner' THEN 1
            WHEN 'intermediate' THEN 2
            WHEN 'advanced' THEN 3
            ELSE 0
        END AS level,
        COALESCE(cat.category_code, '') AS category,
        COALESCE(cat.name, cat.category_code, '') AS category_label,
        COALESCE(c.tags_json::text, '[]') AS tags,
        COALESCE(c.external_source_id, '') AS external_bvid,
        COALESCE(c.body_content, '') AS content,
        CAST(c.price_amount AS TEXT) AS price_amount,
        COALESCE(c.currency, '') AS currency,
        COALESCE(c.is_collection, false) AS is_collection,
        COALESCE(to_char((COALESCE(c.published_at, c.updated_at, c.created_at) AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '') AS published_at,
        (
            SELECT COUNT(1)
            FROM course_comment comments
            WHERE comments.target_type = 'course'
              AND comments.target_id = c.id
              AND comments.status = 'active'
              AND comments.deleted_at IS NULL
        ) AS comment_count,
        (
            SELECT CAST(
                COALESCE(
                    SUM(
                        CASE
                            WHEN btrim(COALESCE(reaction.reaction_value, '')) ~ '^[0-9]+$'
                            THEN btrim(reaction.reaction_value)::bigint
                            ELSE 1
                        END
                    ),
                    0
                ) AS BIGINT
            )
            FROM course_reaction reaction
            WHERE reaction.target_type = 'course'
              AND reaction.target_id = c.id
              AND reaction.reaction_type = 'view'
              AND reaction.status = 'active'
              AND reaction.deleted_at IS NULL
        ) AS view_count,
        (
            SELECT CAST(
                COALESCE(
                    SUM(
                        CASE
                            WHEN btrim(COALESCE(reaction.reaction_value, '')) ~ '^[0-9]+$'
                            THEN btrim(reaction.reaction_value)::bigint
                            ELSE 1
                        END
                    ),
                    0
                ) AS BIGINT
            )
            FROM course_reaction reaction
            WHERE reaction.target_type = 'course'
              AND reaction.target_id = c.id
              AND reaction.reaction_type = 'like'
              AND reaction.status = 'active'
              AND reaction.deleted_at IS NULL
        ) AS like_count,
        (
            SELECT CAST(
                COALESCE(
                    SUM(
                        CASE
                            WHEN btrim(COALESCE(reaction.reaction_value, '')) ~ '^[0-9]+$'
                            THEN btrim(reaction.reaction_value)::bigint
                            ELSE 1
                        END
                    ),
                    0
                ) AS BIGINT
            )
            FROM course_reaction reaction
            WHERE reaction.target_type = 'course'
              AND reaction.target_id = c.id
              AND reaction.reaction_type = 'save'
              AND reaction.status = 'active'
              AND reaction.deleted_at IS NULL
        ) AS save_count,
        (
            SELECT CAST(
                COALESCE(
                    SUM(
                        CASE
                            WHEN btrim(COALESCE(reaction.reaction_value, '')) ~ '^[0-9]+$'
                            THEN btrim(reaction.reaction_value)::bigint
                            ELSE 1
                        END
                    ),
                    0
                ) AS BIGINT
            )
            FROM course_reaction reaction
            WHERE reaction.target_type = 'course'
              AND reaction.target_id = c.id
              AND reaction.reaction_type = 'share'
              AND reaction.status = 'active'
              AND reaction.deleted_at IS NULL
        ) AS share_count
    FROM course_catalog c
    LEFT JOIN course_category cat
      ON cat.id = c.category_id
    LEFT JOIN course_instructor inst
      ON inst.id = c.primary_instructor_id
"#;

fn course_from_row(row: &sqlx::postgres::PgRow) -> CourseItem {
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
        thumbnail: media_resource_from_row(row, "thumbnail_resource_snapshot", "image"),
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

fn course_application_from_row(row: &sqlx::postgres::PgRow) -> CourseApplicationItem {
    let metadata_text = string_cell(row, "metadata_json");
    let metadata: Value =
        serde_json::from_str(metadata_text.as_str()).unwrap_or(Value::Null);
    CourseApplicationItem {
        id: string_cell(row, "uuid"),
        application_id: stable_application_numeric_id(&string_cell(row, "id")),
        title: string_cell(row, "title"),
        category: string_cell(row, "category"),
        description: string_cell(row, "description"),
        source_provider: metadata
            .get("sourceProvider")
            .and_then(Value::as_str)
            .unwrap_or("local")
            .to_owned(),
        external_bvid: metadata
            .get("externalBvid")
            .and_then(Value::as_str)
            .unwrap_or("")
            .to_owned(),
        video: metadata.get("video").cloned().filter(|value| !value.is_null()),
        contact_name: string_cell(row, "contact_name"),
        contact_email: string_cell(row, "contact_email"),
        status: canonical_course_application_status_label(&string_cell(
            row,
            "application_status",
        ))
        .to_owned(),
        submitted_at: string_cell(row, "submitted_at"),
    }
}

fn stable_application_numeric_id(application_key: &str) -> i64 {
    let mut hash: u64 = 0;
    for byte in application_key.bytes() {
        hash = hash.wrapping_mul(31).wrapping_add(byte as u64);
    }
    ((hash & i64::MAX as u64) as i64).max(1)
}

fn canonical_course_application_status_label(status: &str) -> &'static str {
    match status {
        "submitted" => "pending",
        "approved" => "approved",
        "rejected" => "rejected",
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

fn postgres_canonical_scope_filter(alias: &str) -> String {
    format!(
        r#"(
            ($1 > 0 AND {alias}.tenant_id = CAST($1 AS TEXT) AND COALESCE({alias}.organization_id, '0') = CAST($2 AS TEXT))
            OR ($1 > 0 AND $2 > 0 AND {alias}.tenant_id = CAST($1 AS TEXT) AND COALESCE({alias}.organization_id, '0') = '0')
            OR ({alias}.tenant_id = '0' AND COALESCE({alias}.organization_id, '0') = '0')
        )"#
    )
}

fn postgres_scope_filter(alias: &str) -> String {
    format!(
        r#"(
            ($1 > 0 AND {alias}.tenant_id = $1 AND {alias}.organization_id = $2)
            OR ($1 > 0 AND $2 > 0 AND {alias}.tenant_id = $1 AND {alias}.organization_id = 0)
            OR ({alias}.tenant_id = 0 AND {alias}.organization_id = 0)
        )"#
    )
}

fn media_resource_from_locator_value(locator: &str, kind: &str) -> serde_json::Value {
    serde_json::json!({
        "kind": kind,
        "source": "external_url",
        "url": locator,
        "publicUrl": locator
    })
}

fn media_resource_from_row(row: &sqlx::postgres::PgRow, column: &str, kind: &str) -> Value {
    media_resource_from_snapshot(&string_cell(row, column), kind)
}

fn optional_media_resource_from_row(
    row: &sqlx::postgres::PgRow,
    column: &str,
    kind: &str,
) -> Option<Value> {
    let snapshot = string_cell(row, column);
    if snapshot.trim().is_empty() {
        return None;
    }
    let resource = media_resource_from_snapshot(&snapshot, kind);
    media_resource_locator(&resource).map(|_| resource)
}

fn media_resource_locator_from_row(
    row: &sqlx::postgres::PgRow,
    column: &str,
    kind: &str,
) -> String {
    media_resource_locator(&media_resource_from_row(row, column, kind)).unwrap_or_default()
}

fn media_resource_from_value(value: &Value, kind: &str) -> Option<Value> {
    if let Some(text) = value
        .as_str()
        .map(str::trim)
        .filter(|value| !value.is_empty())
    {
        return Some(media_resource_from_locator_value(text, kind));
    }
    let locator = media_resource_locator(value)?;
    let mut object = value.as_object().cloned().unwrap_or_default();
    object
        .entry("kind".to_owned())
        .or_insert_with(|| Value::String(kind.to_owned()));
    object
        .entry("source".to_owned())
        .or_insert_with(|| Value::String("external_url".to_owned()));
    if !object.contains_key("url") {
        object.insert("url".to_owned(), Value::String(locator.clone()));
    }
    if !object.contains_key("publicUrl") {
        object.insert("publicUrl".to_owned(), Value::String(locator));
    }
    Some(Value::Object(object))
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
            .and_then(|value| media_resource_from_value(value, "image"))
            .unwrap_or_else(|| empty_media_resource("image")),
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
            "Derived from sdkwork-course module catalog, category, comment, and reaction tables."
                .to_owned(),
        source_tables: vec![
            "course_catalog".to_owned(),
            "course_section".to_owned(),
            "course_lesson".to_owned(),
            "course_catalog_link".to_owned(),
            "course_category".to_owned(),
            "course_instructor".to_owned(),
            "course_comment".to_owned(),
            "course_reaction".to_owned(),
            "course_resource_ref".to_owned(),
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

fn string_cell(row: &sqlx::postgres::PgRow, column: &str) -> String {
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

fn optional_string_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .filter(|value| !value.trim().is_empty())
}

fn integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> i64 {
    optional_integer_cell(row, column).unwrap_or_default()
}

fn optional_integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<i64> {
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

fn bool_cell(row: &sqlx::postgres::PgRow, column: &str) -> bool {
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
