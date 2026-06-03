use std::sync::Arc;

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_provider_adapter_contract::{
    AdapterInvocationMetadata, AdapterInvocationRequest, AdapterInvocationResponse,
    AdapterInvocationShape, AdapterProviderContext, AdapterSecret, AdapterSubject,
};
use sdkwork_claw_provider_adapter_core::{
    AdapterInvocationContext, AdapterInvocationFuture, EndpointAdapter, ProviderAdapter,
    ProviderAdapterEndpoint,
};
use serde_json::json;
use std::sync::{Mutex, OnceLock};
use tower::ServiceExt;

#[derive(Debug)]
struct EchoProviderAdapter;

#[derive(Debug)]
struct EchoEndpointAdapter;

impl ProviderAdapter for EchoProviderAdapter {
    fn package(&self) -> &'static str {
        "echo"
    }

    fn provider_family(&self) -> &'static str {
        "echo"
    }

    fn provider_codes(&self) -> &'static [&'static str] {
        &["tencent-cloud"]
    }

    fn endpoints(&self) -> Vec<ProviderAdapterEndpoint> {
        vec![ProviderAdapterEndpoint {
            endpoint_key: "video.start_end2video".to_owned(),
            capability: Some("video_generation".to_owned()),
            method: "POST".to_owned(),
            standard_path_pattern: "/vidu/ent/v2/start-end2video".to_owned(),
            invocation_shape: AdapterInvocationShape::AsyncTaskStart,
        }]
    }

    fn resolve_endpoint(
        &self,
        request: &AdapterInvocationRequest,
    ) -> Option<Arc<dyn EndpointAdapter>> {
        if request.invocation.endpoint_key == "video.start_end2video" {
            Some(Arc::new(EchoEndpointAdapter))
        } else {
            None
        }
    }
}

impl EndpointAdapter for EchoEndpointAdapter {
    fn endpoint_key(&self) -> &'static str {
        "video.start_end2video"
    }

    fn method(&self) -> &'static str {
        "POST"
    }

    fn standard_path_pattern(&self) -> &'static str {
        "/vidu/ent/v2/start-end2video"
    }

    fn invocation_shape(&self) -> AdapterInvocationShape {
        AdapterInvocationShape::AsyncTaskStart
    }

    fn invoke<'a>(
        &'a self,
        _context: AdapterInvocationContext,
        _request: AdapterInvocationRequest,
    ) -> AdapterInvocationFuture<'a> {
        Box::pin(async move {
            Ok(AdapterInvocationResponse::json_task(
                200,
                json!({"id": "task-1", "status": "queued"}),
            )
            .with_provider_task_id("native-task-1"))
        })
    }
}

#[tokio::test]
async fn adapter_service_exposes_health_and_manifest() {
    let router = sdkwork_claw_provider_adapter::router_with_adapters(
        vec![Arc::new(EchoProviderAdapter)],
        "test-token",
    );

    let health = router
        .clone()
        .oneshot(
            Request::builder()
                .uri("/healthz")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, health.status());

    let manifest_without_auth = router
        .clone()
        .oneshot(
            Request::builder()
                .uri("/internal/adapter-manifest")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, manifest_without_auth.status());

    let manifest = router
        .oneshot(
            Request::builder()
                .uri("/internal/adapter-manifest")
                .header("authorization", "Bearer test-token")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, manifest.status());
    let payload = response_json(manifest).await;
    assert_eq!("echo", payload["providers"][0]["package"]);
    assert_eq!(
        "video_generation",
        payload["providers"][0]["endpoints"][0]["capability"]
    );
    assert_eq!(
        "video.start_end2video",
        payload["providers"][0]["endpoints"][0]["endpointKey"]
    );
}

#[tokio::test]
async fn adapter_service_default_manifest_composes_provider_packages_without_false_endpoint_claims()
{
    let router = sdkwork_claw_provider_adapter::router_with_default_adapters("test-token");

    let manifest = router
        .oneshot(
            Request::builder()
                .uri("/internal/adapter-manifest")
                .header("authorization", "Bearer test-token")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, manifest.status());
    let payload = response_json(manifest).await;
    let providers = payload["providers"]
        .as_array()
        .expect("manifest providers should be an array");
    assert!(
        providers
            .iter()
            .all(|provider| provider["package"] != "vidu"),
        "official Vidu standard API must not be exposed as an adapter package"
    );

    let tencent_cloud = providers
        .iter()
        .find(|provider| provider["package"] == "tencent-cloud")
        .expect("default manifest should include tencent-cloud provider package");
    assert_eq!("tencent-cloud", tencent_cloud["providerFamily"]);
    assert_eq!(
        json!(["tencent-cloud", "tencent-hunyuan"]),
        tencent_cloud["providerCodes"]
    );
    assert_eq!(
        "video.start_end2video",
        tencent_cloud["endpoints"][0]["endpointKey"]
    );
    assert_eq!(
        "video_generation",
        tencent_cloud["endpoints"][0]["capability"]
    );
    assert_eq!("POST", tencent_cloud["endpoints"][0]["method"]);
    assert_eq!(
        "/vidu/ent/v2/start-end2video",
        tencent_cloud["endpoints"][0]["standardPathPattern"]
    );
    assert_eq!(
        "async_task_start",
        tencent_cloud["endpoints"][0]["invocationShape"]
    );

    let alicloud = providers
        .iter()
        .find(|provider| provider["package"] == "alicloud")
        .expect("default manifest should include alicloud provider package");
    assert_eq!("alicloud", alicloud["providerFamily"]);
    assert_eq!(json!(["alicloud", "aliyun"]), alicloud["providerCodes"]);
    assert_eq!(json!([]), alicloud["endpoints"]);
}

#[tokio::test]
async fn adapter_http_client_fetches_manifest_from_adapter_service() {
    let router = sdkwork_claw_provider_adapter::router_with_adapters(
        vec![Arc::new(EchoProviderAdapter)],
        "test-token",
    );
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let base_url = format!("http://{}", listener.local_addr().unwrap());
    let server = tokio::spawn(async move {
        axum::serve(listener, router).await.unwrap();
    });
    let client = sdkwork_claw_provider_adapter_http::ProviderAdapterHttpClient::new("test-token");

    let manifest = client.fetch_manifest(format!("{base_url}/")).await.unwrap();

    assert_eq!(1, manifest.providers.len());
    assert_eq!("echo", manifest.providers[0].package);
    assert_eq!(
        "video.start_end2video",
        manifest.providers[0].endpoints[0].endpoint_key
    );

    server.abort();
}

#[tokio::test]
async fn adapter_http_client_rejects_manifest_fetch_with_wrong_token() {
    let router = sdkwork_claw_provider_adapter::router_with_adapters(
        vec![Arc::new(EchoProviderAdapter)],
        "test-token",
    );
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let base_url = format!("http://{}", listener.local_addr().unwrap());
    let server = tokio::spawn(async move {
        axum::serve(listener, router).await.unwrap();
    });
    let client = sdkwork_claw_provider_adapter_http::ProviderAdapterHttpClient::new("wrong-token");

    let error = client
        .fetch_manifest(base_url)
        .await
        .expect_err("wrong manifest token should fail");

    assert_eq!(Some(401), error.status_code);
    assert!(!error.retryable);
    assert!(error.message.contains("adapter manifest returned HTTP 401"));

    server.abort();
}

#[tokio::test]
async fn adapter_service_requires_gateway_auth_for_provider_invocation() {
    let router = sdkwork_claw_provider_adapter::router_with_adapters(
        vec![Arc::new(EchoProviderAdapter)],
        "test-token",
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/providers/tencent-cloud/vidu/ent/v2/start-end2video")
                .header("content-type", "application/json")
                .body(Body::from(adapter_request_body()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
}

#[tokio::test]
async fn adapter_service_dispatches_provider_path_to_registered_adapter() {
    let router = sdkwork_claw_provider_adapter::router_with_adapters(
        vec![Arc::new(EchoProviderAdapter)],
        "test-token",
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/providers/tencent-cloud/vidu/ent/v2/start-end2video")
                .header("authorization", "Bearer test-token")
                .header("content-type", "application/json")
                .body(Body::from(adapter_request_body()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!(200, payload["statusCode"]);
    assert_eq!("native-task-1", payload["provider"]["taskId"]);
}

#[tokio::test]
async fn adapter_service_rejects_provider_path_that_does_not_match_invocation_standard_path() {
    let router = sdkwork_claw_provider_adapter::router_with_adapters(
        vec![Arc::new(EchoProviderAdapter)],
        "test-token",
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/providers/tencent-cloud/v1/chat/completions")
                .header("authorization", "Bearer test-token")
                .header("content-type", "application/json")
                .body(Body::from(adapter_request_body()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = response_json(response).await;
    assert_eq!("adapter_invocation_path_mismatch", payload["error"]["code"]);
}

#[tokio::test]
async fn adapter_service_rejects_provider_code_that_does_not_match_invocation_provider_context() {
    let router = sdkwork_claw_provider_adapter::router_with_adapters(
        vec![Arc::new(EchoProviderAdapter)],
        "test-token",
    );
    let mut request = adapter_request();
    request.provider.provider_code = "vidu-official".to_owned();

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/providers/tencent-cloud/vidu/ent/v2/start-end2video")
                .header("authorization", "Bearer test-token")
                .header("content-type", "application/json")
                .body(Body::from(serde_json::to_string(&request).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = response_json(response).await;
    assert_eq!(
        "adapter_invocation_provider_mismatch",
        payload["error"]["code"]
    );
}

#[tokio::test]
async fn adapter_service_rejects_method_that_does_not_match_invocation_metadata() {
    let router = sdkwork_claw_provider_adapter::router_with_adapters(
        vec![Arc::new(EchoProviderAdapter)],
        "test-token",
    );
    let mut request = adapter_request();
    request.invocation.method = "GET".to_owned();

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/providers/tencent-cloud/vidu/ent/v2/start-end2video")
                .header("authorization", "Bearer test-token")
                .header("content-type", "application/json")
                .body(Body::from(serde_json::to_string(&request).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = response_json(response).await;
    assert_eq!(
        "adapter_invocation_method_mismatch",
        payload["error"]["code"]
    );
}

#[test]
fn adapter_service_gateway_token_can_be_read_from_env_file() {
    let _env_lock = env_lock().lock().unwrap();
    clear_gateway_token_env();
    let token_path = unique_secret_path("provider-adapter-service-token");
    std::fs::write(&token_path, " adapter-service-token \n").unwrap();
    std::env::set_var(
        sdkwork_claw_provider_adapter::ENV_PROVIDER_ADAPTER_GATEWAY_TOKEN_FILE,
        token_path.display().to_string(),
    );

    let token = sdkwork_claw_provider_adapter::gateway_token_from_env().unwrap();

    assert_eq!("adapter-service-token", token);

    clear_gateway_token_env();
    let _ = std::fs::remove_file(token_path);
}

#[test]
fn adapter_service_gateway_token_env_value_precedes_token_file() {
    let _env_lock = env_lock().lock().unwrap();
    clear_gateway_token_env();
    let token_path = unique_secret_path("provider-adapter-service-token-shadowed");
    std::fs::write(&token_path, "file-token\n").unwrap();
    std::env::set_var(
        sdkwork_claw_provider_adapter::ENV_PROVIDER_ADAPTER_GATEWAY_TOKEN,
        "env-token",
    );
    std::env::set_var(
        sdkwork_claw_provider_adapter::ENV_PROVIDER_ADAPTER_GATEWAY_TOKEN_FILE,
        token_path.display().to_string(),
    );

    let token = sdkwork_claw_provider_adapter::gateway_token_from_env().unwrap();

    assert_eq!("env-token", token);

    clear_gateway_token_env();
    let _ = std::fs::remove_file(token_path);
}

#[test]
fn adapter_service_bind_addr_uses_default_or_env_override() {
    let _env_lock = env_lock().lock().unwrap();
    clear_bind_env();

    let default_bind = sdkwork_claw_provider_adapter::bind_addr_from_env().unwrap();
    assert_eq!("0.0.0.0:39110", default_bind);

    std::env::set_var(
        sdkwork_claw_provider_adapter::ENV_PROVIDER_ADAPTER_BIND,
        "127.0.0.1:49110",
    );
    let override_bind = sdkwork_claw_provider_adapter::bind_addr_from_env().unwrap();
    assert_eq!("127.0.0.1:49110", override_bind);

    clear_bind_env();
}

#[test]
fn adapter_service_bind_addr_rejects_invalid_env_override() {
    let _env_lock = env_lock().lock().unwrap();
    clear_bind_env();
    std::env::set_var(
        sdkwork_claw_provider_adapter::ENV_PROVIDER_ADAPTER_BIND,
        "not-a-socket",
    );

    let error = sdkwork_claw_provider_adapter::bind_addr_from_env().unwrap_err();

    assert!(error.to_string().contains("valid socket address"));

    clear_bind_env();
}

#[test]
fn adapter_service_bind_addr_uses_runtime_toml_before_default() {
    let _env_lock = env_lock().lock().unwrap();
    clear_bind_env();

    let bind_addr =
        sdkwork_claw_provider_adapter::bind_addr_from_env_or_toml(Some("127.0.0.1:39111")).unwrap();

    assert_eq!("127.0.0.1:39111", bind_addr);
}

#[test]
fn adapter_service_bind_addr_env_precedes_runtime_toml() {
    let _env_lock = env_lock().lock().unwrap();
    clear_bind_env();
    std::env::set_var(
        sdkwork_claw_provider_adapter::ENV_PROVIDER_ADAPTER_BIND,
        "127.0.0.1:49111",
    );

    let bind_addr =
        sdkwork_claw_provider_adapter::bind_addr_from_env_or_toml(Some("127.0.0.1:39111")).unwrap();

    assert_eq!("127.0.0.1:49111", bind_addr);

    clear_bind_env();
}

fn adapter_request_body() -> String {
    serde_json::to_string(&adapter_request()).unwrap()
}

fn adapter_request() -> AdapterInvocationRequest {
    AdapterInvocationRequest {
        invocation: AdapterInvocationMetadata {
            id: "inv-1".to_owned(),
            endpoint_key: "video.start_end2video".to_owned(),
            method: "POST".to_owned(),
            standard_path: "/vidu/ent/v2/start-end2video".to_owned(),
            shape: AdapterInvocationShape::AsyncTaskStart,
            stream: false,
            request_id: Some("req-1".to_owned()),
            trace_id: Some("trace-1".to_owned()),
        },
        subject: AdapterSubject {
            tenant_id: 10,
            organization_id: 20,
            user_id: 30,
            api_key_id: 100,
            group_id: 10,
            group_code: "standard-group".to_owned(),
            pricing_plan_code: "standard".to_owned(),
        },
        provider: AdapterProviderContext {
            provider_code: "tencent-cloud".to_owned(),
            channel_id: 3001,
            region_code: "global".to_owned(),
            provider_model: "hunyuan-video".to_owned(),
            base_url: Some("https://hunyuan.tencentcloudapi.com".to_owned()),
            auth_profile: json!({"type": "cloud_signature"}),
            timeout_ms: Some(120000),
        },
        secret: AdapterSecret::None,
        body: json!({"prompt": "make a video"}),
    }
}

async fn response_json(response: axum::response::Response) -> serde_json::Value {
    let bytes = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&bytes).unwrap()
}

fn env_lock() -> &'static Mutex<()> {
    static ENV_LOCK: OnceLock<Mutex<()>> = OnceLock::new();
    ENV_LOCK.get_or_init(|| Mutex::new(()))
}

fn clear_gateway_token_env() {
    std::env::remove_var(sdkwork_claw_provider_adapter::ENV_PROVIDER_ADAPTER_GATEWAY_TOKEN);
    std::env::remove_var(sdkwork_claw_provider_adapter::ENV_PROVIDER_ADAPTER_GATEWAY_TOKEN_FILE);
}

fn clear_bind_env() {
    std::env::remove_var(sdkwork_claw_provider_adapter::ENV_PROVIDER_ADAPTER_BIND);
}

fn unique_secret_path(name: &str) -> std::path::PathBuf {
    std::env::temp_dir().join(format!(
        "clawrouter-{name}-{}-{}.secret",
        std::process::id(),
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_nanos()
    ))
}
