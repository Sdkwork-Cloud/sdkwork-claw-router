use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteCourseStore;
use sdkwork_claw_product::ports::{
    CourseApplicationCommandStore, CourseQuery, CourseReadStore, CourseSubject,
    CreateCourseApplicationCommand,
};
use sdkwork_claw_product_test_support::{repair_sqlite_pool, schema_sqlite_pool};
use serde_json::json;

#[tokio::test]
async fn sqlite_course_store_reads_seeded_course_catalog_from_java_compatible_tables() {
    let pool = repair_sqlite_pool().await;

    let store = SqliteCourseStore::new(pool);
    let courses = store
        .load_courses(
            CourseQuery {
                keyword: Some("claude".to_owned()),
                page: Some(1),
                size: Some(10),
                ..CourseQuery::default()
            },
            None,
        )
        .await
        .unwrap();
    assert!(
        courses.iter().any(|course| course.course_code == "c1"),
        "installer seed must populate content_course rows readable by course store"
    );
    let first = courses
        .iter()
        .find(|course| course.course_code == "c1")
        .unwrap();
    assert!(first.content_id > 0);
    assert!(!first.title.trim().is_empty());
    assert_eq!("image", first.thumbnail["kind"]);
    assert!(first.thumbnail["publicUrl"]
        .as_str()
        .is_some_and(|value| !value.trim().is_empty()));
    assert!(first.lessons_count > 0);
    assert!(first.engagement.students_count > 0);
    assert_eq!(
        155, first.engagement.likes,
        "course engagement must preserve aggregated content_reaction.reaction_value counts"
    );
    assert_eq!(
        22, first.engagement.saves,
        "course engagement must preserve aggregated save counts from seed data"
    );
    assert_eq!(
        11, first.engagement.shares,
        "course engagement must preserve aggregated share counts from seed data"
    );

    let detail = store
        .load_course_detail("c1".to_owned(), None)
        .await
        .unwrap()
        .expect("seed course c1 must be readable by course_code");
    assert_eq!(first.content_id, detail.course.content_id);
    assert_eq!("c1", detail.course.course_code);
    assert!(!detail.sections.is_empty());
    assert!(
        detail
            .sections
            .iter()
            .flat_map(|section| section.lessons.iter())
            .any(|lesson| lesson.free_preview),
        "seeded course detail should preserve lesson preview metadata"
    );
    assert!(
        detail
            .related_courses
            .iter()
            .all(|course| course.course_code != detail.course.course_code),
        "related course list must resolve persisted content_course_relation links"
    );

    let categories = store.load_categories(None).await.unwrap();
    assert!(
        categories
            .iter()
            .any(|category| category.code == "ai-coding" && category.course_count > 0),
        "course categories must come from c_category type 6 with live course counts"
    );

    let overview = store.load_overview(None).await.unwrap();
    assert!(overview.stats.total_courses >= courses.len() as i64);
    assert!(overview.stats.total_lessons >= detail.course.lessons_count);
    assert_eq!("Live course data", overview.source.source_label);
    assert_eq!(
        vec![
            "content_course".to_owned(),
            "content_course_section".to_owned(),
            "content_course_lesson".to_owned(),
            "content_course_relation".to_owned(),
            "c_category".to_owned(),
            "content_comment".to_owned(),
            "content_reaction".to_owned(),
        ],
        overview.source.source_tables
    );
}

#[tokio::test]
async fn sqlite_course_store_persists_course_application_upload_requests() {
    let pool = schema_sqlite_pool().await;

    let store = SqliteCourseStore::new(pool);
    let item = store
        .create_course_application(CreateCourseApplicationCommand {
            subject: CourseSubject {
                tenant_id: 7,
                organization_id: 9,
                user_id: 11,
            },
            uuid: "course-application-test-1".to_owned(),
            title: "即梦 AI 图片制作课".to_owned(),
            category: "ai-image-creation".to_owned(),
            description: "提交一门即梦图片制作课程供平台审核发布。".to_owned(),
            source_provider: "local".to_owned(),
            external_bvid: None,
            video: Some(json!({
                "kind": "video",
                "source": "external_url",
                "url": "/uploads/courses/applications/jimeng-image-course.mp4",
                "publicUrl": "/uploads/courses/applications/jimeng-image-course.mp4"
            })),
            contact_name: Some("Ada".to_owned()),
            contact_email: Some("ada@example.com".to_owned()),
            notes: Some("本地上传视频教程".to_owned()),
            submitted_at: "2026-05-12T09:00:00Z".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("course-application-test-1", item.id);
    assert!(item.application_id > 0);
    assert_eq!("即梦 AI 图片制作课", item.title);
    assert_eq!("ai-image-creation", item.category);
    assert_eq!("local", item.source_provider);
    assert_eq!(
        "/uploads/courses/applications/jimeng-image-course.mp4",
        item.video
            .as_ref()
            .and_then(|video| video["publicUrl"].as_str())
            .unwrap()
    );
    assert_eq!("pending", item.status);
}
