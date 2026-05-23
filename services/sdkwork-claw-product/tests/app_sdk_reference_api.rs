use std::sync::{Arc, Mutex, OnceLock};

use axum::body::Body;
use axum::extract::{Path, State};
use axum::http::{header, HeaderMap, Request, StatusCode};
use axum::response::IntoResponse;
use axum::routing::{get, post};
use axum::{Json, Router};
use serde_json::{json, Value};
use tower::ServiceExt;

#[tokio::test]
async fn app_sdk_reference_archives_generate_with_rust_sdk_generator_client() {
    let _guard = env_guard().lock().unwrap();
    let fake_generator = spawn_fake_sdk_generator().await;
    set_generator_env(&fake_generator.base_url);

    let router = sdkwork_claw_product::api::app_sdk_reference_router();
    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/sdk_reference/archives")
                .header("content-type", "application/json")
                .body(Body::from(sdk_reference_request_body()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("generated-clawrouter-sdk.zip", payload["data"]["fileName"]);
    assert_eq!("application/zip", payload["data"]["contentType"]);
    assert_eq!("typescript", payload["data"]["language"]);
    assert!(payload["data"]["contentBase64"]
        .as_str()
        .is_some_and(|value| !value.is_empty()));
    let uploads = fake_generator.uploads.lock().unwrap();
    assert_eq!(1, uploads.len());
    assert_eq!(None, uploads[0].authorization);
    let upload_text = String::from_utf8_lossy(&uploads[0].body);
    assert!(upload_text.contains("typescript"));
    assert!(upload_text.contains("app"));
    assert!(upload_text.contains("https://api.sdkwork.com"));
    assert!(upload_text.contains("/app/v3/api"));
    assert!(upload_text.contains("@sdkwork/clawrouter-app-sdk"));

    clear_generator_env();
}

#[tokio::test]
async fn app_sdk_reference_documentation_generates_docs_after_generator_success() {
    let _guard = env_guard().lock().unwrap();
    let fake_generator = spawn_fake_sdk_generator().await;
    set_generator_env(&fake_generator.base_url);

    let router = sdkwork_claw_product::api::app_sdk_reference_router();
    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/sdk_reference/documentation")
                .header("content-type", "application/json")
                .body(Body::from(sdk_reference_request_body()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("typescript", payload["data"]["language"]);
    assert_eq!(true, payload["data"]["generated"]);
    let readme = payload["data"]["readme"].as_str().unwrap();
    assert!(readme.contains("## Installation"));
    assert!(readme.contains("## Quick Start"));
    assert!(readme.contains("## Usage Examples"));
    assert_eq!(1, fake_generator.uploads.lock().unwrap().len());

    clear_generator_env();
}

#[tokio::test]
async fn app_sdk_reference_documentation_accepts_large_openapi_documents() {
    let _guard = env_guard().lock().unwrap();
    clear_generator_env();

    let router = sdkwork_claw_product::api::app_sdk_reference_router();
    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/sdk_reference/documentation")
                .header("content-type", "application/json")
                .body(Body::from(large_sdk_reference_request_body()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::SERVICE_UNAVAILABLE, response.status());
    let payload = response_json(response).await;
    assert_eq!("5030", payload["code"]);
    assert_eq!("SDK generator is not configured", payload["msg"]);
}

#[derive(Clone)]
struct FakeSdkGenerator {
    base_url: String,
    uploads: Arc<Mutex<Vec<CapturedUpload>>>,
}

#[derive(Debug)]
struct CapturedUpload {
    authorization: Option<String>,
    body: Vec<u8>,
}

async fn spawn_fake_sdk_generator() -> FakeSdkGenerator {
    let uploads = Arc::new(Mutex::new(Vec::new()));
    let app = Router::new()
        .route("/v1/sdk-generator/generations:upload", post(fake_upload))
        .route("/v1/sdk-generator/jobs/{job_id}", get(fake_job))
        .route(
            "/v1/sdk-generator/jobs/{job_id}/download",
            get(fake_download),
        )
        .with_state(Arc::clone(&uploads));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move {
        axum::serve(listener, app).await.unwrap();
    });
    FakeSdkGenerator {
        base_url: format!("http://{addr}"),
        uploads,
    }
}

async fn fake_upload(
    State(uploads): State<Arc<Mutex<Vec<CapturedUpload>>>>,
    headers: HeaderMap,
    body: axum::body::Bytes,
) -> impl IntoResponse {
    uploads.lock().unwrap().push(CapturedUpload {
        authorization: headers
            .get(header::AUTHORIZATION)
            .and_then(|value| value.to_str().ok())
            .map(str::to_owned),
        body: body.to_vec(),
    });
    Json(json!({
        "jobId": "job-123",
        "status": "completed",
        "downloadUrl": "/v1/sdk-generator/jobs/job-123/download"
    }))
}

async fn fake_job(Path(job_id): Path<String>) -> impl IntoResponse {
    Json(json!({
        "jobId": job_id,
        "status": "completed"
    }))
}

async fn fake_download(Path(job_id): Path<String>) -> impl IntoResponse {
    let bytes = format!("PK\x03\x04 fake zip for {job_id}").into_bytes();
    (
        [
            (header::CONTENT_TYPE, "application/zip"),
            (
                header::CONTENT_DISPOSITION,
                "attachment; filename=\"generated-clawrouter-sdk.zip\"",
            ),
        ],
        bytes,
    )
}

fn sdk_reference_request_body() -> String {
    json!({
        "spec": {
            "openapi": "3.1.0",
            "info": {
                "title": "Claw Router App API",
                "version": "0.1.0"
            },
            "paths": {
                "/app/v3/api/ai/models": {
                    "get": {
                        "operationId": "models.list",
                        "responses": {
                            "200": {
                                "description": "ok"
                            }
                        }
                    }
                }
            }
        },
        "language": "typescript",
        "config": {
            "name": "SdkworkClawRouterAppClient",
            "version": "0.1.0",
            "language": "typescript",
            "sdkType": "app",
            "outputPath": "./sdk",
            "apiSpecPath": "/app/v3/api/openapi.json",
            "baseUrl": "https://api.sdkwork.com",
            "apiPrefix": "/app/v3/api",
            "packageName": "@sdkwork/clawrouter-app-sdk",
            "author": "SDKWork",
            "license": "MIT",
            "description": "Claw Router App SDK"
        }
    })
    .to_string()
}

fn large_sdk_reference_request_body() -> String {
    let mut payload: Value = serde_json::from_str(&sdk_reference_request_body()).unwrap();
    payload["spec"]["info"]["description"] = Value::String("x".repeat(2 * 1024 * 1024));
    payload.to_string()
}

async fn response_json(response: axum::response::Response) -> Value {
    let bytes = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&bytes).unwrap()
}

fn set_generator_env(base_url: &str) {
    clear_generator_env();
    std::env::set_var("SDKWORK_CLAW_SDK_GENERATOR_BASE_URL", base_url);
}

fn clear_generator_env() {
    for name in [
        "SDKWORK_CLAW_SDK_GENERATOR_BASE_URL",
        "SDKWORK_CLAW_SDK_GENERATOR_API_KEY",
        "SDKWORK_CLAW_SDK_GENERATOR_API_KEY_FILE",
        "PORTAL_TOOL_API_SDK_GENERATOR_BASE_URL",
        "PORTAL_TOOL_API_SDK_GENERATOR_API_KEY",
        "PORTAL_TOOL_API_SDK_GENERATOR_API_KEY_FILE",
    ] {
        std::env::remove_var(name);
    }
}

fn env_guard() -> &'static Mutex<()> {
    static ENV_GUARD: OnceLock<Mutex<()>> = OnceLock::new();
    ENV_GUARD.get_or_init(|| Mutex::new(()))
}
