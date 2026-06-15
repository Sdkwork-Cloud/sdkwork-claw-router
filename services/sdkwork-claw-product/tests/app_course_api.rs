use std::fs;
use std::path::PathBuf;
use std::sync::Arc;
use std::sync::{Mutex, OnceLock};
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Body;
use axum::http::{header, Request, StatusCode};
use sdkwork_claw_product::api::{
    app_course_application_router_with_command_store, app_course_router_with_store,
    app_course_router_with_store_and_upload_root,
    app_course_router_with_store_upload_root_and_upload_limits, configured_course_upload_limits,
    configured_course_upload_root, CourseUploadLimits,
};
use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteCourseStore;
use sdkwork_claw_product_test_support::{repair_sqlite_pool, schema_sqlite_pool};
use serde_json::Value;
use tower::ServiceExt;

#[tokio::test]
async fn app_course_public_read_routes_return_seeded_live_courses_without_auth() {
    let pool = repair_sqlite_pool().await;

    let store = Arc::new(SqliteCourseStore::new(pool));
    let router = app_course_router_with_store(store.clone(), store);

    for uri in [
        "/app/v3/api/courses?page=1&page_size=10",
        "/app/v3/api/courses/categories",
        "/app/v3/api/courses/overview",
        "/app/v3/api/courses/c1",
    ] {
        let response = router
            .clone()
            .oneshot(Request::builder().uri(uri).body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_ne!(
            StatusCode::UNAUTHORIZED,
            response.status(),
            "course public read route must not require trusted subject headers"
        );
        assert_eq!(StatusCode::OK, response.status(), "{uri}");
    }

    let list_payload = response_json(
        router
            .clone()
            .oneshot(
                Request::builder()
                    .uri("/app/v3/api/courses?search_query=claude&page=1&page_size=10")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap(),
    )
    .await;
    assert_eq!("2000", list_payload["code"]);
    let courses = list_payload["data"]["items"].as_array().unwrap();
    assert!(
        courses.iter().any(|course| course["courseCode"] == "c1"),
        "seeded SDKWork AI Coding course must be visible through the live API"
    );
    assert!(
        courses[0].get("contentId").is_some(),
        "course API must expose numeric contentId for Java-compatible comments"
    );

    let detail_payload = response_json(
        router
            .oneshot(
                Request::builder()
                    .uri("/app/v3/api/courses/c1")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap(),
    )
    .await;
    assert_eq!("2000", detail_payload["code"]);
    assert_eq!("c1", detail_payload["data"]["courseCode"]);
    assert!(
        detail_payload["data"]["sections"]
            .as_array()
            .unwrap()
            .iter()
            .any(|section| !section["lessons"].as_array().unwrap().is_empty()),
        "course detail must include persisted sections and lessons"
    );
    assert_eq!(
        "Live course data",
        detail_payload["data"]["source"]["sourceLabel"]
    );
}

#[tokio::test]
async fn app_course_application_route_persists_course_upload_requests() {
    let pool = schema_sqlite_pool().await;

    let store = Arc::new(SqliteCourseStore::new(pool));
    let router = app_course_router_with_store(store.clone(), store);

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/courses/applications")
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(
                    serde_json::json!({
                        "title": "Claude Code 实战课",
                        "category": "ai-coding",
                        "description": "适合在线学习的 Claude Code 入门课程",
                        "sourceProvider": "bilibili",
                        "externalBvid": "BV1FAiPBeEZf",
                        "contactName": "Ada",
                        "contactEmail": "ada@example.com"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());

    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("Claude Code 实战课", payload["data"]["title"]);
    assert_eq!("ai-coding", payload["data"]["category"]);
    assert_eq!("bilibili", payload["data"]["sourceProvider"]);
    assert_eq!("pending", payload["data"]["status"]);
    assert!(
        payload["data"]["applicationId"].as_i64().unwrap() > 0,
        "course application response must expose persisted id"
    );
}

#[tokio::test]
async fn app_course_application_router_does_not_mount_foundation_read_routes() {
    let pool = schema_sqlite_pool().await;

    let store = Arc::new(SqliteCourseStore::new(pool));
    let router = app_course_application_router_with_command_store(store);

    for uri in [
        "/app/v3/api/courses",
        "/app/v3/api/courses/categories",
        "/app/v3/api/courses/overview",
        "/app/v3/api/courses/c1",
    ] {
        let response = router
            .clone()
            .oneshot(Request::builder().uri(uri).body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_eq!(StatusCode::NOT_FOUND, response.status(), "{uri}");
    }

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/courses/applications")
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(
                    serde_json::json!({
                        "title": "Claw Router application-only course",
                        "category": "ai-coding",
                        "description": "Product-owned course application route",
                        "sourceProvider": "bilibili",
                        "externalBvid": "BV1FAiPBeEZf",
                        "contactName": "Ada",
                        "contactEmail": "ada@example.com"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
}

#[tokio::test]
async fn course_application_video_upload_stores_and_serves_local_tutorial_video() {
    let pool = schema_sqlite_pool().await;

    let upload_root = unique_upload_root("course-upload-success");
    let store = Arc::new(SqliteCourseStore::new(pool));
    let router =
        app_course_router_with_store_and_upload_root(store.clone(), store, upload_root.clone());
    let video_bytes = b"course video bytes";
    let boundary = "sdkwork-course-upload-boundary";
    let body = multipart_body(
        boundary,
        "file",
        "Claude Code Lesson.mp4",
        "video/mp4",
        video_bytes,
    );

    let response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/courses/applications/videos")
                .header(
                    header::CONTENT_TYPE,
                    format!("multipart/form-data; boundary={boundary}"),
                )
                .body(Body::from(body))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    let data = &payload["data"];
    assert!(data.get("videoUrl").is_none());
    let video = &data["video"];
    assert_eq!("video", video["kind"]);
    assert_eq!("external_url", video["source"]);
    let video_url = video["publicUrl"].as_str().unwrap();
    assert!(
        video_url.starts_with("/uploads/courses/applications/"),
        "uploaded course tutorial video must be exposed under the course upload URL space"
    );
    assert_eq!("video/mp4", data["contentType"]);
    assert_eq!(
        video_bytes.len() as i64,
        data["sizeBytes"].as_i64().unwrap()
    );
    assert_eq!(64, data["sha256"].as_str().unwrap().len());
    assert_eq!(
        video_bytes,
        fs::read(upload_root.join(video_url.trim_start_matches("/uploads/courses/")))
            .unwrap()
            .as_slice()
    );

    let asset_response = router
        .oneshot(
            Request::builder()
                .uri(video_url)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, asset_response.status());
    assert_eq!(
        "video/mp4",
        asset_response
            .headers()
            .get(header::CONTENT_TYPE)
            .unwrap()
            .to_str()
            .unwrap()
    );
    let served_bytes = axum::body::to_bytes(asset_response.into_body(), usize::MAX)
        .await
        .unwrap();
    assert_eq!(video_bytes, served_bytes.as_ref());
}

#[tokio::test]
async fn course_application_video_upload_rejects_non_video_files() {
    let pool = schema_sqlite_pool().await;

    let upload_root = unique_upload_root("course-upload-reject");
    let store = Arc::new(SqliteCourseStore::new(pool));
    let router = app_course_router_with_store_and_upload_root(store.clone(), store, upload_root);
    let boundary = "sdkwork-course-upload-boundary";
    let body = multipart_body(boundary, "file", "lesson.txt", "text/plain", b"not a video");

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/courses/applications/videos")
                .header(
                    header::CONTENT_TYPE,
                    format!("multipart/form-data; boundary={boundary}"),
                )
                .body(Body::from(body))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = response_json(response).await;
    assert_eq!("4001", payload["code"]);
}

#[tokio::test]
async fn course_application_video_upload_uses_configured_size_limit() {
    let pool = schema_sqlite_pool().await;

    let upload_root = unique_upload_root("course-upload-size-limit");
    let store = Arc::new(SqliteCourseStore::new(pool));
    let router = app_course_router_with_store_upload_root_and_upload_limits(
        store.clone(),
        store,
        upload_root,
        CourseUploadLimits {
            video_upload_max_bytes: 4,
            video_upload_body_limit_bytes: 1024,
        },
    );
    let boundary = "sdkwork-course-upload-boundary";
    let body = multipart_body(boundary, "file", "lesson.mp4", "video/mp4", b"12345");

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/courses/applications/videos")
                .header(
                    header::CONTENT_TYPE,
                    format!("multipart/form-data; boundary={boundary}"),
                )
                .body(Body::from(body))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = response_json(response).await;
    assert_eq!("file must be at most 4 bytes", payload["msg"]);
}

#[test]
fn configured_course_upload_root_reads_runtime_toml_paths_section() {
    let _guard = env_guard().lock().unwrap();
    let upload_root = unique_upload_root("course-upload-configured");
    let config_path = upload_root.with_extension("toml");
    fs::write(
        &config_path,
        format!(
            "[paths]\ncourse_upload_root = \"{}\"\n",
            toml_path(&upload_root)
        ),
    )
    .unwrap();
    let saved_config_file = std::env::var("SDKWORK_CLAW_CONFIG_FILE").ok();
    let saved_upload_root = std::env::var("SDKWORK_CLAW_COURSE_UPLOAD_ROOT").ok();
    std::env::set_var("SDKWORK_CLAW_CONFIG_FILE", &config_path);
    std::env::remove_var("SDKWORK_CLAW_COURSE_UPLOAD_ROOT");

    assert_eq!(upload_root, configured_course_upload_root());

    restore_env_var("SDKWORK_CLAW_CONFIG_FILE", saved_config_file);
    restore_env_var("SDKWORK_CLAW_COURSE_UPLOAD_ROOT", saved_upload_root);
}

#[test]
fn configured_course_upload_limits_read_runtime_toml_courses_section() {
    let _guard = env_guard().lock().unwrap();
    let config_path = unique_upload_root("course-upload-limits-configured").with_extension("toml");
    fs::write(
        &config_path,
        "[courses]\nvideo_upload_max_bytes = 4096\nvideo_upload_body_limit_bytes = 8192\n",
    )
    .unwrap();
    let saved_config_file = std::env::var("SDKWORK_CLAW_CONFIG_FILE").ok();
    let saved_max = std::env::var("SDKWORK_CLAW_COURSE_VIDEO_UPLOAD_MAX_BYTES").ok();
    let saved_body_limit = std::env::var("SDKWORK_CLAW_COURSE_VIDEO_UPLOAD_BODY_LIMIT_BYTES").ok();
    std::env::set_var("SDKWORK_CLAW_CONFIG_FILE", &config_path);
    std::env::remove_var("SDKWORK_CLAW_COURSE_VIDEO_UPLOAD_MAX_BYTES");
    std::env::remove_var("SDKWORK_CLAW_COURSE_VIDEO_UPLOAD_BODY_LIMIT_BYTES");

    let limits = configured_course_upload_limits();

    assert_eq!(4096, limits.video_upload_max_bytes);
    assert_eq!(8192, limits.video_upload_body_limit_bytes);

    restore_env_var("SDKWORK_CLAW_CONFIG_FILE", saved_config_file);
    restore_env_var("SDKWORK_CLAW_COURSE_VIDEO_UPLOAD_MAX_BYTES", saved_max);
    restore_env_var(
        "SDKWORK_CLAW_COURSE_VIDEO_UPLOAD_BODY_LIMIT_BYTES",
        saved_body_limit,
    );
}

async fn response_json(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

fn multipart_body(
    boundary: &str,
    field_name: &str,
    file_name: &str,
    content_type: &str,
    bytes: &[u8],
) -> Vec<u8> {
    let mut body = Vec::new();
    body.extend_from_slice(format!("--{boundary}\r\n").as_bytes());
    body.extend_from_slice(
        format!(
            "Content-Disposition: form-data; name=\"{field_name}\"; filename=\"{file_name}\"\r\n"
        )
        .as_bytes(),
    );
    body.extend_from_slice(format!("Content-Type: {content_type}\r\n\r\n").as_bytes());
    body.extend_from_slice(bytes);
    body.extend_from_slice(format!("\r\n--{boundary}--\r\n").as_bytes());
    body
}

fn unique_upload_root(label: &str) -> PathBuf {
    let millis = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis();
    std::env::temp_dir().join(format!("sdkwork-{label}-{millis}"))
}

fn toml_path(path: &std::path::Path) -> String {
    path.to_string_lossy().replace('\\', "\\\\")
}

fn env_guard() -> &'static Mutex<()> {
    static LOCK: OnceLock<Mutex<()>> = OnceLock::new();
    LOCK.get_or_init(|| Mutex::new(()))
}

fn restore_env_var(name: &str, value: Option<String>) {
    match value {
        Some(value) => std::env::set_var(name, value),
        None => std::env::remove_var(name),
    }
}
