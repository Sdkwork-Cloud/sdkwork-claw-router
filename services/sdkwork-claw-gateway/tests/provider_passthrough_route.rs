use axum::body::Body;
use axum::extract::State;
use axum::http::HeaderMap;
use axum::http::{Request, StatusCode};
use axum::routing::any;
use axum::Router;
use sdkwork_claw_config::ProviderRelayConfig;
use std::collections::BTreeSet;
use std::sync::{Arc, Mutex};
use tower::ServiceExt;

#[test]
fn openai_compatible_passthrough_path_manifest_stays_complete() {
    let paths = sdkwork_claw_gateway::openai_compatible_passthrough_paths();
    let method_paths = sdkwork_claw_gateway::openai_method_passthrough_paths();

    assert!(
        paths.contains(&"/v1/conversations/{conversation_id}/items/{item_id}"),
        "OpenAI conversation item passthrough must stay declared"
    );
    assert!(
        method_paths.contains(&"/v1/models/{model}"),
        "OpenAI model deletion passthrough must stay declared for DELETE /v1/models/{{model}}"
    );
    assert!(
        paths.contains(&"/v1/responses/input_tokens"),
        "OpenAI response input token counting passthrough must stay declared"
    );
    assert!(
        paths.contains(&"/v1/realtime/calls/{call_id}/hangup"),
        "OpenAI realtime call control passthrough must stay declared"
    );
    assert!(
        paths.contains(&"/v1/realtime/calls"),
        "OpenAI realtime call creation passthrough must stay declared"
    );
    assert!(
        paths.contains(&"/v1/realtime/translations"),
        "OpenAI realtime translation session passthrough must stay declared"
    );
    assert!(
        paths.contains(&"/v1/fine_tuning/alpha/graders/validate"),
        "OpenAI fine-tuning grader validation passthrough must stay declared"
    );
    assert!(
        paths.contains(&"/v1/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions"),
        "OpenAI fine-tuning checkpoint permissions passthrough must use the standard fine_tuned_model_checkpoint parameter"
    );
    assert!(
        !paths.contains(&"/v1/fine_tuning/checkpoints/{checkpoint_id}/permissions"),
        "OpenAI fine-tuning checkpoint permissions passthrough must not expose the nonstandard checkpoint_id parameter"
    );
    assert!(
        paths.contains(&"/v1/batches/{batch_id}/cancel"),
        "OpenAI batch cancellation passthrough must use the standard cancel subresource"
    );
    assert!(
        paths.contains(&"/v1/vector_stores/{vector_store_id}/file_batches/{batch_id}/cancel"),
        "OpenAI vector store file batch cancellation passthrough must use the standard cancel subresource"
    );
    assert!(
        !paths.contains(&"/v1/uploads/{upload_id}"),
        "OpenAI upload passthrough must expose explicit parts, complete, and cancel subresources"
    );
    assert!(
        paths.contains(&"/v1/audio/voice_consents/{consent_id}"),
        "OpenAI voice consent passthrough must use the standard consent_id parameter"
    );
    assert!(
        paths.contains(&"/v1/skills/{skill_id}/versions/{version}/content"),
        "OpenAI skill version content passthrough must use the standard version parameter"
    );
    assert!(
        paths.contains(&"/v1/organization/costs"),
        "OpenAI organization costs passthrough must stay declared"
    );
    assert!(
        paths.contains(&"/v1/organization/projects/{project_id}/archive"),
        "OpenAI project archive passthrough must stay declared"
    );
    assert!(
        paths.contains(&"/v1/organization/admin_api_keys/{key_id}"),
        "OpenAI admin API key passthrough must stay declared"
    );
    assert!(
        paths.contains(&"/v1/organization/users/{user_id}/roles/{role_id}"),
        "OpenAI organization user role assignment passthrough must stay declared"
    );
    assert!(
        paths.contains(&"/v1/organization/groups/{group_id}/roles/{role_id}"),
        "OpenAI organization group role assignment passthrough must stay declared"
    );
    assert!(
        paths.contains(&"/v1/organization/projects/{project_id}/api_keys/{key_id}"),
        "OpenAI project API key passthrough must use the standard key_id parameter"
    );
    assert!(
        !paths.contains(&"/v1/organization/projects/{project_id}/api_keys/{api_key_id}"),
        "OpenAI project API key passthrough must not expose the nonstandard api_key_id parameter"
    );
    assert!(
        paths.contains(&"/v1/projects/{project_id}/users/{user_id}/roles/{role_id}"),
        "OpenAI project role assignment passthrough must stay declared"
    );
    assert!(
        paths.contains(&"/v1/containers/{container_id}/files/{file_id}/content"),
        "OpenAI container file content passthrough must stay declared"
    );
    assert!(
        paths.contains(&"/v1/realtime/transcription_sessions"),
        "OpenAI realtime transcription session passthrough must stay declared"
    );
}

#[test]
fn gateway_openapi_v1_paths_are_product_routes_or_openai_passthrough_routes() {
    let spec: serde_json::Value = serde_json::from_str(include_str!(
        "../../../apps/sdkwork-claw-router-portal/public/openapi.json"
    ))
    .unwrap();
    let openapi_paths = spec["paths"]
        .as_object()
        .unwrap()
        .keys()
        .filter(|path| path.starts_with("/v1/"))
        .map(String::as_str)
        .collect::<BTreeSet<_>>();
    let passthrough_paths = sdkwork_claw_gateway::openai_compatible_passthrough_paths()
        .iter()
        .chain(sdkwork_claw_gateway::openai_method_passthrough_paths().iter())
        .chain(sdkwork_claw_gateway::stored_chat_completion_passthrough_paths().iter())
        .copied()
        .collect::<BTreeSet<_>>();
    let product_paths = BTreeSet::from([
        "/v1/chat/completions",
        "/v1/embeddings",
        "/v1/models",
        "/v1/models/{model}",
        "/v1/responses",
    ]);

    let missing_runtime_paths = openapi_paths
        .difference(&passthrough_paths)
        .filter(|path| !product_paths.contains(*path))
        .copied()
        .collect::<Vec<_>>();
    assert!(
        missing_runtime_paths.is_empty(),
        "OpenAPI /v1 paths must be implemented directly or declared as OpenAI-compatible passthrough routes: {missing_runtime_paths:?}"
    );

    let stale_passthrough_paths = passthrough_paths
        .difference(&openapi_paths)
        .copied()
        .collect::<Vec<_>>();
    assert!(
        stale_passthrough_paths.is_empty(),
        "OpenAI-compatible passthrough routes must be documented in the gateway OpenAPI spec: {stale_passthrough_paths:?}"
    );
}

#[test]
fn gateway_openapi_vendor_paths_are_runtime_provider_routes_without_public_manifest() {
    let spec: serde_json::Value = serde_json::from_str(include_str!(
        "../../../apps/sdkwork-claw-router-portal/public/openapi.json"
    ))
    .unwrap();
    assert!(
        spec.get("x-provider-passthrough").is_none(),
        "Public OpenAPI must not expose the internal provider route manifest"
    );
    let runtime_providers = sdkwork_claw_gateway::provider_native_passthrough_providers()
        .iter()
        .copied()
        .collect::<BTreeSet<_>>();
    let public_vendor_providers = spec["paths"]
        .as_object()
        .unwrap()
        .keys()
        .filter(|path| !path.starts_with("/v1/"))
        .filter_map(|path| path.strip_prefix('/'))
        .filter_map(|path| path.split('/').next())
        .collect::<BTreeSet<_>>();

    assert!(
        public_vendor_providers.is_subset(&runtime_providers),
        "Public vendor OpenAPI paths must be covered by the runtime provider routes: {public_vendor_providers:?}"
    );
}

#[derive(Debug, Default)]
struct CapturedNativeProviderRequest {
    method: String,
    path_and_query: String,
    authorization: Option<String>,
    google_api_key: Option<String>,
    anthropic_api_key: Option<String>,
    anthropic_version: Option<String>,
    vidu_token: Option<String>,
    content_type: Option<String>,
    client_api_key: Option<String>,
    body: String,
}

#[tokio::test]
async fn gateway_mounts_provider_native_passthrough_boundaries_without_404() {
    let router = sdkwork_claw_gateway::router();

    for (method, path, body) in [
        (
            "POST",
            "/provider/google/v1beta/models/gemini-2.5-flash:generateContent",
            r#"{"contents":[{"parts":[{"text":"hello"}]}]}"#,
        ),
        (
            "POST",
            "/provider/anthropic/v1/messages",
            r#"{"model":"claude-sonnet-4-5","max_tokens":128,"messages":[{"role":"user","content":"hello"}]}"#,
        ),
        (
            "POST",
            "/provider/suno/v1/music/generations",
            r#"{"prompt":"short piano theme"}"#,
        ),
        (
            "POST",
            "/provider/midjourney/v1/images/generations",
            r#"{"prompt":"product render"}"#,
        ),
        (
            "POST",
            "/provider/kling/v1/videos/generations",
            r#"{"prompt":"cinematic camera move"}"#,
        ),
        (
            "POST",
            "/vidu/ent/v2/text2video",
            r#"{"model":"vidu2.0","prompt":"animated product reveal"}"#,
        ),
        (
            "POST",
            "/provider/volcengine/api/v3/contents/generations/tasks",
            r#"{"model":"doubao-seedance","content":[{"type":"text","text":"video"}]}"#,
        ),
    ] {
        let response = router
            .clone()
            .oneshot(
                Request::builder()
                    .method(method)
                    .uri(path)
                    .header("content-type", "application/json")
                    .body(Body::from(body))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(StatusCode::NOT_IMPLEMENTED, response.status(), "{path}");
        let body = axum::body::to_bytes(response.into_body(), usize::MAX)
            .await
            .unwrap();
        let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();
        assert_eq!(
            "provider_passthrough_not_configured",
            payload["error"]["code"]
        );
        assert_eq!(path, payload["error"]["path"]);
    }
}

#[tokio::test]
async fn gateway_forwards_configured_vendor_prefixed_vidu_passthrough_request() {
    let captured = Arc::new(Mutex::new(Vec::new()));
    let provider = Router::new()
        .route("/vidu/ent/v2/text2video", any(capture_native_provider_request))
        .with_state(Arc::clone(&captured));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move {
        axum::serve(listener, provider).await.unwrap();
    });

    let config = ProviderRelayConfig::from_provider_passthrough_json(format!(
        r#"{{
            "vidu": {{
                "baseUrl": "http://{addr}/vidu",
                "auth": {{
                    "type": "header",
                    "name": "token",
                    "value": "sk-vidu-upstream"
                }}
            }}
        }}"#
    ))
    .unwrap();
    let router = sdkwork_claw_gateway::router_with_provider_passthrough_config(config);

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/vidu/ent/v2/text2video")
                .header("token", "client-token-should-not-pass")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"model":"vidu2.0","prompt":"provider route"}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::CREATED, response.status());
    let captured = captured.lock().unwrap();
    assert_eq!(1, captured.len());
    assert_eq!("POST", captured[0].method);
    assert_eq!("/vidu/ent/v2/text2video", captured[0].path_and_query);
    assert_eq!(None, captured[0].authorization);
    assert_eq!(Some("sk-vidu-upstream".to_owned()), captured[0].vidu_token);
    assert!(captured[0].body.contains("provider route"));
}

#[tokio::test]
async fn gateway_forwards_configured_provider_native_passthrough_request() {
    let captured = Arc::new(Mutex::new(Vec::new()));
    let provider = Router::new()
        .route(
            "/v1beta/models/gemini-2.5-flash:generateContent",
            any(capture_native_provider_request),
        )
        .with_state(Arc::clone(&captured));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move {
        axum::serve(listener, provider).await.unwrap();
    });

    let config = ProviderRelayConfig::from_parts("http://127.0.0.1:9", "sk-openai")
        .unwrap()
        .with_provider_passthrough("google", format!("http://{addr}"), "sk-google-upstream")
        .unwrap();
    let router = sdkwork_claw_gateway::router_with_provider_passthrough_config(config);

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/provider/google/v1beta/models/gemini-2.5-flash:generateContent?alt=sse")
                .header("authorization", "Bearer sk-claw-router-client")
                .header("x-api-key", "sk-client-api-key")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"contents":[{"parts":[{"text":"hello"}]}]}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::CREATED, response.status());
    assert_eq!(
        "provider-request-id",
        response.headers()["x-provider-request-id"]
    );
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();
    assert_eq!("native-ok", payload["id"]);

    let captured = captured.lock().unwrap();
    assert_eq!(1, captured.len());
    assert_eq!("POST", captured[0].method);
    assert_eq!(
        "/v1beta/models/gemini-2.5-flash:generateContent?alt=sse",
        captured[0].path_and_query
    );
    assert_eq!(
        Some("Bearer sk-google-upstream".to_owned()),
        captured[0].authorization
    );
    assert_eq!(
        Some("application/json".to_owned()),
        captured[0].content_type
    );
    assert_eq!(None, captured[0].client_api_key);
    assert!(captured[0].body.contains("hello"));
}

#[tokio::test]
async fn gateway_forwards_provider_native_passthrough_with_configured_header_auth() {
    let captured = Arc::new(Mutex::new(Vec::new()));
    let provider = Router::new()
        .route(
            "/v1beta/models/gemini-2.5-flash:generateContent",
            any(capture_native_provider_request),
        )
        .with_state(Arc::clone(&captured));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move {
        axum::serve(listener, provider).await.unwrap();
    });

    let config = ProviderRelayConfig::from_provider_passthrough_json(format!(
        r#"{{
            "google": {{
                "baseUrl": "http://{addr}",
                "auth": {{
                    "type": "header",
                    "name": "x-goog-api-key",
                    "value": "sk-google-upstream"
                }}
            }}
        }}"#
    ))
    .unwrap();
    let router = sdkwork_claw_gateway::router_with_provider_passthrough_config(config);

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/provider/google/v1beta/models/gemini-2.5-flash:generateContent")
                .header("authorization", "Bearer sk-client")
                .header("x-goog-api-key", "sk-client-google")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"contents":[{"parts":[{"text":"hello"}]}]}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::CREATED, response.status());
    let captured = captured.lock().unwrap();
    assert_eq!(1, captured.len());
    assert_eq!(None, captured[0].authorization);
    assert_eq!(
        Some("sk-google-upstream".to_owned()),
        captured[0].google_api_key
    );
}

#[tokio::test]
async fn gateway_forwards_anthropic_provider_native_passthrough_with_configured_header_auth() {
    let captured = Arc::new(Mutex::new(Vec::new()));
    let provider = Router::new()
        .route("/v1/messages", any(capture_native_provider_request))
        .with_state(Arc::clone(&captured));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move {
        axum::serve(listener, provider).await.unwrap();
    });

    let config = ProviderRelayConfig::from_provider_passthrough_json(format!(
        r#"{{
            "anthropic": {{
                "baseUrl": "http://{addr}",
                "auth": {{
                    "type": "header",
                    "name": "x-api-key",
                    "value": "sk-anthropic-upstream"
                }}
            }}
        }}"#
    ))
    .unwrap();
    let router = sdkwork_claw_gateway::router_with_provider_passthrough_config(config);

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/provider/anthropic/v1/messages")
                .header("authorization", "Bearer sk-client")
                .header("x-api-key", "sk-client-anthropic")
                .header("anthropic-version", "2023-06-01")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"claude-sonnet-4-5","max_tokens":128,"messages":[{"role":"user","content":"hello"}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::CREATED, response.status());
    let captured = captured.lock().unwrap();
    assert_eq!(1, captured.len());
    assert_eq!(None, captured[0].authorization);
    assert_eq!(
        Some("sk-anthropic-upstream".to_owned()),
        captured[0].anthropic_api_key
    );
    assert_eq!(Some("2023-06-01".to_owned()), captured[0].anthropic_version);
}

#[tokio::test]
async fn gateway_applies_configured_provider_native_passthrough_default_headers() {
    let captured = Arc::new(Mutex::new(Vec::new()));
    let provider = Router::new()
        .route("/v1/messages", any(capture_native_provider_request))
        .with_state(Arc::clone(&captured));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move {
        axum::serve(listener, provider).await.unwrap();
    });

    let config = ProviderRelayConfig::from_provider_passthrough_json(format!(
        r#"{{
            "anthropic": {{
                "baseUrl": "http://{addr}",
                "auth": {{
                    "type": "header",
                    "name": "x-api-key",
                    "value": "sk-anthropic-upstream"
                }},
                "defaultHeaders": {{
                    "anthropic-version": "2023-06-01"
                }}
            }}
        }}"#
    ))
    .unwrap();
    let router = sdkwork_claw_gateway::router_with_provider_passthrough_config(config);

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/provider/anthropic/v1/messages")
                .header("authorization", "Bearer sk-client")
                .header("x-api-key", "sk-client-anthropic")
                .header("anthropic-version", "client-version-should-not-win")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"claude-sonnet-4-5","max_tokens":128,"messages":[{"role":"user","content":"hello"}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::CREATED, response.status());
    let captured = captured.lock().unwrap();
    assert_eq!(1, captured.len());
    assert_eq!(
        Some("sk-anthropic-upstream".to_owned()),
        captured[0].anthropic_api_key
    );
    assert_eq!(Some("2023-06-01".to_owned()), captured[0].anthropic_version);
}

#[tokio::test]
async fn gateway_forwards_provider_native_passthrough_with_configured_query_auth() {
    let captured = Arc::new(Mutex::new(Vec::new()));
    let provider = Router::new()
        .route(
            "/v1beta/models/gemini-2.5-flash:generateContent",
            any(capture_native_provider_request),
        )
        .with_state(Arc::clone(&captured));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move {
        axum::serve(listener, provider).await.unwrap();
    });

    let config = ProviderRelayConfig::from_provider_passthrough_json(format!(
        r#"{{
            "google": {{
                "baseUrl": "http://{addr}",
                "auth": {{
                    "type": "query",
                    "name": "key",
                    "value": "sk-google-upstream"
                }}
            }}
        }}"#
    ))
    .unwrap();
    let router = sdkwork_claw_gateway::router_with_provider_passthrough_config(config);

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/provider/google/v1beta/models/gemini-2.5-flash:generateContent?alt=sse")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"contents":[{"parts":[{"text":"hello"}]}]}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::CREATED, response.status());
    let captured = captured.lock().unwrap();
    assert_eq!(
        "/v1beta/models/gemini-2.5-flash:generateContent?alt=sse&key=sk-google-upstream",
        captured[0].path_and_query
    );
    assert_eq!(None, captured[0].authorization);
}

#[tokio::test]
async fn gateway_percent_encodes_provider_native_passthrough_query_auth_name_and_value() {
    let captured = Arc::new(Mutex::new(Vec::new()));
    let provider = Router::new()
        .route(
            "/v1beta/models/gemini-2.5-flash:generateContent",
            any(capture_native_provider_request),
        )
        .with_state(Arc::clone(&captured));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move {
        axum::serve(listener, provider).await.unwrap();
    });

    let config = ProviderRelayConfig::from_provider_passthrough_json(format!(
        r#"{{
            "google": {{
                "baseUrl": "http://{addr}",
                "auth": {{
                    "type": "query",
                    "name": "api key",
                    "value": "sk-google+slash/value?tenant=acme&mode=test value"
                }}
            }}
        }}"#
    ))
    .unwrap();
    let router = sdkwork_claw_gateway::router_with_provider_passthrough_config(config);

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/provider/google/v1beta/models/gemini-2.5-flash:generateContent?alt=sse")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"contents":[{"parts":[{"text":"hello"}]}]}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::CREATED, response.status());
    let captured = captured.lock().unwrap();
    assert_eq!(
        "/v1beta/models/gemini-2.5-flash:generateContent?alt=sse&api%20key=sk-google%2Bslash%2Fvalue%3Ftenant%3Dacme%26mode%3Dtest%20value",
        captured[0].path_and_query
    );
    assert_eq!(None, captured[0].authorization);
}

#[tokio::test]
async fn gateway_forwards_provider_native_passthrough_without_openai_relay_target() {
    let captured = Arc::new(Mutex::new(Vec::new()));
    let provider = Router::new()
        .route(
            "/v1beta/models/gemini-2.5-flash:generateContent",
            any(capture_native_provider_request),
        )
        .with_state(Arc::clone(&captured));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move {
        axum::serve(listener, provider).await.unwrap();
    });

    let config = ProviderRelayConfig::from_provider_passthrough_json(format!(
        r#"{{
            "google": {{
                "baseUrl": "http://{addr}",
                "bearerToken": "sk-google-upstream"
            }}
        }}"#
    ))
    .unwrap();
    let router = sdkwork_claw_gateway::router_with_provider_passthrough_config(config);

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/provider/google/v1beta/models/gemini-2.5-flash:generateContent")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"contents":[{"parts":[{"text":"provider only"}]}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::CREATED, response.status());
    let captured = captured.lock().unwrap();
    assert_eq!(1, captured.len());
    assert_eq!(
        Some("Bearer sk-google-upstream".to_owned()),
        captured[0].authorization
    );
    assert!(captured[0].body.contains("provider only"));
}

#[tokio::test]
async fn gateway_database_router_merges_configured_provider_native_passthrough() {
    let captured = Arc::new(Mutex::new(Vec::new()));
    let provider = Router::new()
        .route("/v1/messages", any(capture_native_provider_request))
        .with_state(Arc::clone(&captured));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move {
        axum::serve(listener, provider).await.unwrap();
    });
    let catalog = sdkwork_claw_test_support::seeded_sqlite_catalog()
        .await
        .unwrap();
    let config = ProviderRelayConfig::from_parts("http://127.0.0.1:9", "sk-openai")
        .unwrap()
        .with_provider_passthrough(
            "anthropic",
            format!("http://{addr}"),
            "sk-anthropic-upstream",
        )
        .unwrap();
    let router = sdkwork_claw_gateway::router_with_database_api_key_and_provider_relay_config(
        catalog.database_config().unwrap(),
        Some(catalog.api_key_security_config().unwrap()),
        Some(config),
    )
    .await
    .unwrap();

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/provider/anthropic/v1/messages")
                .header("authorization", catalog.gateway_authorization_header())
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"claude-sonnet-4-5","messages":[{"role":"user","content":"hello"}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::CREATED, response.status());
    let captured = captured.lock().unwrap();
    assert_eq!(1, captured.len());
    assert_eq!("/v1/messages", captured[0].path_and_query);
    assert_eq!(
        Some("Bearer sk-anthropic-upstream".to_owned()),
        captured[0].authorization
    );
}

#[tokio::test]
async fn gateway_database_router_rejects_provider_native_passthrough_without_api_key() {
    let captured = Arc::new(Mutex::new(Vec::new()));
    let provider = Router::new()
        .route("/v1/messages", any(capture_native_provider_request))
        .with_state(Arc::clone(&captured));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move {
        axum::serve(listener, provider).await.unwrap();
    });
    let catalog = sdkwork_claw_test_support::seeded_sqlite_catalog()
        .await
        .unwrap();
    let config = ProviderRelayConfig::from_provider_passthrough_json(format!(
        r#"{{
            "anthropic": {{
                "baseUrl": "http://{addr}",
                "bearerToken": "sk-anthropic-upstream"
            }}
        }}"#
    ))
    .unwrap();
    let router = sdkwork_claw_gateway::router_with_database_api_key_and_provider_relay_config(
        catalog.database_config().unwrap(),
        Some(catalog.api_key_security_config().unwrap()),
        Some(config),
    )
    .await
    .unwrap();

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/provider/anthropic/v1/messages")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"claude-sonnet-4-5","messages":[{"role":"user","content":"hello"}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();
    assert_eq!("invalid_api_key", payload["error"]["code"]);
    assert_eq!(0, captured.lock().unwrap().len());
}

#[tokio::test]
async fn gateway_database_router_forwards_configured_openai_standard_passthrough() {
    let captured = Arc::new(Mutex::new(Vec::new()));
    let provider = Router::new()
        .route(
            "/v1/images/generations",
            any(capture_native_provider_request),
        )
        .with_state(Arc::clone(&captured));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move {
        axum::serve(listener, provider).await.unwrap();
    });
    let catalog = sdkwork_claw_test_support::seeded_sqlite_catalog()
        .await
        .unwrap();
    let config =
        ProviderRelayConfig::from_parts(format!("http://{addr}"), "sk-openai-upstream").unwrap();
    let router = sdkwork_claw_gateway::router_with_database_api_key_and_provider_relay_config(
        catalog.database_config().unwrap(),
        Some(catalog.api_key_security_config().unwrap()),
        Some(config),
    )
    .await
    .unwrap();

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/images/generations")
                .header("authorization", catalog.gateway_authorization_header())
                .header("x-api-key", "sk-client-key")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"model":"gpt-image-1","prompt":"logo"}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::CREATED, response.status());
    let captured = captured.lock().unwrap();
    assert_eq!(1, captured.len());
    assert_eq!("/v1/images/generations", captured[0].path_and_query);
    assert_eq!(
        Some("Bearer sk-openai-upstream".to_owned()),
        captured[0].authorization
    );
    assert_eq!(None, captured[0].client_api_key);
    assert!(captured[0].body.contains("gpt-image-1"));
}

#[tokio::test]
async fn gateway_database_router_forwards_configured_openai_supplemental_passthrough_surface() {
    let captured = Arc::new(Mutex::new(Vec::new()));
    let provider = Router::new()
        .route("/v1/conversations", any(capture_native_provider_request))
        .route(
            "/v1/models/ft:gpt-4o-mini:org:custom",
            any(capture_native_provider_request),
        )
        .route(
            "/v1/responses/input_tokens",
            any(capture_native_provider_request),
        )
        .route(
            "/v1/realtime/calls/call_123/hangup",
            any(capture_native_provider_request),
        )
        .route("/v1/realtime/calls", any(capture_native_provider_request))
        .route(
            "/v1/realtime/translations",
            any(capture_native_provider_request),
        )
        .route(
            "/v1/fine_tuning/alpha/graders/validate",
            any(capture_native_provider_request),
        )
        .route(
            "/v1/fine_tuning/checkpoints/ftckpt_123/permissions",
            any(capture_native_provider_request),
        )
        .route(
            "/v1/batches/batch_123/cancel",
            any(capture_native_provider_request),
        )
        .route(
            "/v1/vector_stores/vs_123/file_batches/batch_123/cancel",
            any(capture_native_provider_request),
        )
        .route(
            "/v1/audio/voice_consents/consent_123",
            any(capture_native_provider_request),
        )
        .route(
            "/v1/skills/skill_123/versions/v1/content",
            any(capture_native_provider_request),
        )
        .route(
            "/v1/organization/costs",
            any(capture_native_provider_request),
        )
        .route(
            "/v1/organization/projects/proj_123/archive",
            any(capture_native_provider_request),
        )
        .route(
            "/v1/organization/admin_api_keys/key_123",
            any(capture_native_provider_request),
        )
        .route(
            "/v1/organization/users/user_123/roles/role_123",
            any(capture_native_provider_request),
        )
        .route(
            "/v1/organization/groups/group_123/roles",
            any(capture_native_provider_request),
        )
        .route(
            "/v1/organization/projects/proj_123/api_keys/key_123",
            any(capture_native_provider_request),
        )
        .route(
            "/v1/projects/proj_123/users/user_123/roles/role_123",
            any(capture_native_provider_request),
        )
        .route(
            "/v1/containers/container_123/files/file_123/content",
            any(capture_native_provider_request),
        )
        .with_state(Arc::clone(&captured));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move {
        axum::serve(listener, provider).await.unwrap();
    });
    let catalog = sdkwork_claw_test_support::seeded_sqlite_catalog()
        .await
        .unwrap();
    let config =
        ProviderRelayConfig::from_parts(format!("http://{addr}"), "sk-openai-upstream").unwrap();
    let router = sdkwork_claw_gateway::router_with_database_api_key_and_provider_relay_config(
        catalog.database_config().unwrap(),
        Some(catalog.api_key_security_config().unwrap()),
        Some(config),
    )
    .await
    .unwrap();

    for (method, uri, body) in [
        ("GET", "/v1/conversations?limit=20&order=desc", ""),
        ("DELETE", "/v1/models/ft:gpt-4o-mini:org:custom", ""),
        (
            "POST",
            "/v1/responses/input_tokens",
            r#"{"model":"gpt-5.4","input":"hello"}"#,
        ),
        (
            "POST",
            "/v1/realtime/calls/call_123/hangup",
            r#"{"reason":"complete"}"#,
        ),
        (
            "POST",
            "/v1/realtime/calls",
            r#"{"model":"gpt-realtime","sdp":"offer"}"#,
        ),
        (
            "POST",
            "/v1/realtime/translations",
            r#"{"model":"gpt-realtime-translate","input_audio_format":"pcm16"}"#,
        ),
        (
            "POST",
            "/v1/fine_tuning/alpha/graders/validate",
            r#"{"grader":{"type":"string_check"}}"#,
        ),
        (
            "GET",
            "/v1/fine_tuning/checkpoints/ftckpt_123/permissions?project_id=proj_123",
            "",
        ),
        ("POST", "/v1/batches/batch_123/cancel", ""),
        (
            "POST",
            "/v1/vector_stores/vs_123/file_batches/batch_123/cancel",
            "",
        ),
        ("DELETE", "/v1/audio/voice_consents/consent_123", ""),
        ("GET", "/v1/skills/skill_123/versions/v1/content", ""),
        (
            "GET",
            "/v1/organization/costs?start_time=1700000000&group_by=project_id",
            "",
        ),
        ("POST", "/v1/organization/projects/proj_123/archive", ""),
        ("DELETE", "/v1/organization/admin_api_keys/key_123", ""),
        (
            "DELETE",
            "/v1/organization/users/user_123/roles/role_123",
            "",
        ),
        (
            "POST",
            "/v1/organization/groups/group_123/roles",
            r#"{"role_id":"role_123"}"#,
        ),
        (
            "GET",
            "/v1/organization/projects/proj_123/api_keys/key_123",
            "",
        ),
        (
            "DELETE",
            "/v1/projects/proj_123/users/user_123/roles/role_123",
            "",
        ),
        (
            "GET",
            "/v1/containers/container_123/files/file_123/content",
            "",
        ),
    ] {
        let response = router
            .clone()
            .oneshot(
                Request::builder()
                    .method(method)
                    .uri(uri)
                    .header("authorization", catalog.gateway_authorization_header())
                    .body(Body::from(body))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(StatusCode::CREATED, response.status(), "{method} {uri}");
    }

    let captured = captured.lock().unwrap();
    assert_eq!(20, captured.len());
    assert_eq!("GET", captured[0].method);
    assert_eq!(
        "/v1/conversations?limit=20&order=desc",
        captured[0].path_and_query
    );
    assert_eq!(
        Some("Bearer sk-openai-upstream".to_owned()),
        captured[0].authorization
    );
    assert_eq!("DELETE", captured[1].method);
    assert_eq!(
        "/v1/models/ft:gpt-4o-mini:org:custom",
        captured[1].path_and_query
    );
    assert_eq!("POST", captured[2].method);
    assert_eq!("/v1/responses/input_tokens", captured[2].path_and_query);
    assert!(captured[2].body.contains("gpt-5.4"));
    assert_eq!("POST", captured[3].method);
    assert_eq!(
        "/v1/realtime/calls/call_123/hangup",
        captured[3].path_and_query
    );
    assert_eq!("POST", captured[4].method);
    assert_eq!("/v1/realtime/calls", captured[4].path_and_query);
    assert_eq!("POST", captured[5].method);
    assert_eq!("/v1/realtime/translations", captured[5].path_and_query);
    assert_eq!("POST", captured[6].method);
    assert_eq!(
        "/v1/fine_tuning/alpha/graders/validate",
        captured[6].path_and_query
    );
    assert_eq!("GET", captured[7].method);
    assert_eq!(
        "/v1/fine_tuning/checkpoints/ftckpt_123/permissions?project_id=proj_123",
        captured[7].path_and_query
    );
    assert_eq!("POST", captured[8].method);
    assert_eq!("/v1/batches/batch_123/cancel", captured[8].path_and_query);
    assert_eq!("POST", captured[9].method);
    assert_eq!(
        "/v1/vector_stores/vs_123/file_batches/batch_123/cancel",
        captured[9].path_and_query
    );
    assert_eq!("DELETE", captured[10].method);
    assert_eq!(
        "/v1/audio/voice_consents/consent_123",
        captured[10].path_and_query
    );
    assert_eq!("GET", captured[11].method);
    assert_eq!(
        "/v1/skills/skill_123/versions/v1/content",
        captured[11].path_and_query
    );
    assert_eq!("GET", captured[12].method);
    assert_eq!(
        "/v1/organization/costs?start_time=1700000000&group_by=project_id",
        captured[12].path_and_query
    );
    assert_eq!("POST", captured[13].method);
    assert_eq!(
        "/v1/organization/projects/proj_123/archive",
        captured[13].path_and_query
    );
    assert_eq!("DELETE", captured[14].method);
    assert_eq!(
        "/v1/organization/admin_api_keys/key_123",
        captured[14].path_and_query
    );
    assert_eq!("DELETE", captured[15].method);
    assert_eq!(
        "/v1/organization/users/user_123/roles/role_123",
        captured[15].path_and_query
    );
    assert_eq!("POST", captured[16].method);
    assert_eq!(
        "/v1/organization/groups/group_123/roles",
        captured[16].path_and_query
    );
    assert_eq!("GET", captured[17].method);
    assert_eq!(
        "/v1/organization/projects/proj_123/api_keys/key_123",
        captured[17].path_and_query
    );
    assert_eq!("DELETE", captured[18].method);
    assert_eq!(
        "/v1/projects/proj_123/users/user_123/roles/role_123",
        captured[18].path_and_query
    );
    assert_eq!(
        "/v1/containers/container_123/files/file_123/content",
        captured[19].path_and_query
    );
}

#[tokio::test]
async fn gateway_database_router_forwards_stored_chat_completion_passthrough_methods() {
    let captured = Arc::new(Mutex::new(Vec::new()));
    let provider = Router::new()
        .route("/v1/chat/completions", any(capture_native_provider_request))
        .route(
            "/v1/chat/completions/chatcmpl_123",
            any(capture_native_provider_request),
        )
        .route(
            "/v1/chat/completions/chatcmpl_123/messages",
            any(capture_native_provider_request),
        )
        .with_state(Arc::clone(&captured));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move {
        axum::serve(listener, provider).await.unwrap();
    });
    let catalog = sdkwork_claw_test_support::seeded_sqlite_catalog()
        .await
        .unwrap();
    let config =
        ProviderRelayConfig::from_parts(format!("http://{addr}"), "sk-openai-upstream").unwrap();
    let router = sdkwork_claw_gateway::router_with_database_api_key_and_provider_relay_config(
        catalog.database_config().unwrap(),
        Some(catalog.api_key_security_config().unwrap()),
        Some(config),
    )
    .await
    .unwrap();

    for (method, uri, body) in [
        ("GET", "/v1/chat/completions?limit=20", ""),
        ("GET", "/v1/chat/completions/chatcmpl_123", ""),
        (
            "POST",
            "/v1/chat/completions/chatcmpl_123",
            r#"{"metadata":{"tenant":"demo"}}"#,
        ),
        ("DELETE", "/v1/chat/completions/chatcmpl_123", ""),
        ("GET", "/v1/chat/completions/chatcmpl_123/messages", ""),
    ] {
        let response = router
            .clone()
            .oneshot(
                Request::builder()
                    .method(method)
                    .uri(uri)
                    .header("authorization", catalog.gateway_authorization_header())
                    .header("content-type", "application/json")
                    .body(Body::from(body))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(StatusCode::CREATED, response.status(), "{method} {uri}");
    }

    let captured = captured.lock().unwrap();
    assert_eq!(5, captured.len());
    assert_eq!("GET", captured[0].method);
    assert_eq!("/v1/chat/completions?limit=20", captured[0].path_and_query);
    assert_eq!(
        Some("Bearer sk-openai-upstream".to_owned()),
        captured[0].authorization
    );
    assert_eq!(None, captured[0].client_api_key);
    assert_eq!("GET", captured[1].method);
    assert_eq!(
        "/v1/chat/completions/chatcmpl_123",
        captured[1].path_and_query
    );
    assert_eq!("POST", captured[2].method);
    assert!(captured[2].body.contains("tenant"));
    assert_eq!("DELETE", captured[3].method);
    assert_eq!("GET", captured[4].method);
    assert_eq!(
        "/v1/chat/completions/chatcmpl_123/messages",
        captured[4].path_and_query
    );
}

#[tokio::test]
async fn gateway_database_router_rejects_openai_standard_passthrough_without_api_key() {
    let captured = Arc::new(Mutex::new(Vec::new()));
    let provider = Router::new()
        .route(
            "/v1/images/generations",
            any(capture_native_provider_request),
        )
        .with_state(Arc::clone(&captured));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move {
        axum::serve(listener, provider).await.unwrap();
    });
    let catalog = sdkwork_claw_test_support::seeded_sqlite_catalog()
        .await
        .unwrap();
    let config =
        ProviderRelayConfig::from_parts(format!("http://{addr}"), "sk-openai-upstream").unwrap();
    let router = sdkwork_claw_gateway::router_with_database_api_key_and_provider_relay_config(
        catalog.database_config().unwrap(),
        Some(catalog.api_key_security_config().unwrap()),
        Some(config),
    )
    .await
    .unwrap();

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/images/generations")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"model":"gpt-image-1","prompt":"logo"}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();
    assert_eq!("invalid_api_key", payload["error"]["code"]);
    assert_eq!(0, captured.lock().unwrap().len());
}

#[tokio::test]
async fn gateway_mounts_openai_standard_passthrough_boundaries_without_404() {
    let router = sdkwork_claw_gateway::router();

    for (method, uri, expected_error_path, body) in [
        (
            "POST",
            "/v1/images/generations",
            "/v1/images/generations",
            r#"{"model":"gpt-image-1","prompt":"logo"}"#,
        ),
        (
            "POST",
            "/v1/completions",
            "/v1/completions",
            r#"{"model":"gpt-3.5-turbo-instruct","prompt":"hello"}"#,
        ),
        (
            "POST",
            "/v1/moderations",
            "/v1/moderations",
            r#"{"model":"omni-moderation-latest","input":"hello"}"#,
        ),
        (
            "POST",
            "/v1/images/edits",
            "/v1/images/edits",
            r#"{"model":"gpt-image-1","prompt":"edit"}"#,
        ),
        (
            "POST",
            "/v1/videos",
            "/v1/videos",
            r#"{"model":"sora-2","prompt":"product shot"}"#,
        ),
        (
            "POST",
            "/v1/videos/characters",
            "/v1/videos/characters",
            r#"{"name":"presenter"}"#,
        ),
        (
            "GET",
            "/v1/videos/characters/character_123",
            "/v1/videos/characters/character_123",
            "",
        ),
        (
            "POST",
            "/v1/videos/extensions",
            "/v1/videos/extensions",
            r#"{"video_id":"video_123","prompt":"extend"}"#,
        ),
        (
            "POST",
            "/v1/audio/speech",
            "/v1/audio/speech",
            r#"{"model":"gpt-4o-mini-tts","input":"hello","voice":"alloy"}"#,
        ),
        (
            "POST",
            "/v1/audio/voices",
            "/v1/audio/voices",
            r#"{"name":"narrator"}"#,
        ),
        (
            "GET",
            "/v1/audio/voice_consents",
            "/v1/audio/voice_consents",
            "",
        ),
        (
            "GET",
            "/v1/audio/voice_consents/consent_123",
            "/v1/audio/voice_consents/consent_123",
            "",
        ),
        (
            "POST",
            "/v1/audio/transcriptions",
            "/v1/audio/transcriptions",
            r#"{"model":"whisper-1"}"#,
        ),
        (
            "POST",
            "/v1/threads",
            "/v1/threads",
            r#"{"metadata":{"tenant":"demo"}}"#,
        ),
        (
            "POST",
            "/v1/threads/thread_123/runs",
            "/v1/threads/thread_123/runs",
            r#"{"assistant_id":"asst_123"}"#,
        ),
        (
            "POST",
            "/v1/threads/runs",
            "/v1/threads/runs",
            r#"{"assistant_id":"asst_123","thread":{"messages":[]}}"#,
        ),
        (
            "POST",
            "/v1/vector_stores",
            "/v1/vector_stores",
            r#"{"name":"docs"}"#,
        ),
        (
            "POST",
            "/v1/vector_stores/vs_123/search",
            "/v1/vector_stores/vs_123/search",
            r#"{"query":"router docs"}"#,
        ),
        (
            "POST",
            "/v1/batches",
            "/v1/batches",
            r#"{"input_file_id":"file_123","endpoint":"/v1/responses","completion_window":"24h"}"#,
        ),
        (
            "POST",
            "/v1/batches/batch_123/cancel",
            "/v1/batches/batch_123/cancel",
            "",
        ),
        (
            "POST",
            "/v1/vector_stores/vs_123/file_batches/batch_123/cancel",
            "/v1/vector_stores/vs_123/file_batches/batch_123/cancel",
            "",
        ),
        (
            "GET",
            "/v1/fine_tuning/jobs/ftjob_123/events",
            "/v1/fine_tuning/jobs/ftjob_123/events",
            "",
        ),
        ("GET", "/v1/conversations", "/v1/conversations", ""),
        (
            "POST",
            "/v1/containers",
            "/v1/containers",
            r#"{"name":"code sandbox"}"#,
        ),
        ("GET", "/v1/evals", "/v1/evals", ""),
        (
            "POST",
            "/v1/responses/input_tokens",
            "/v1/responses/input_tokens",
            r#"{"model":"gpt-5.4","input":"hello"}"#,
        ),
        (
            "POST",
            "/v1/fine_tuning/alpha/graders/run",
            "/v1/fine_tuning/alpha/graders/run",
            r#"{"grader":{"type":"string_check"},"item":{"input":"hello"}}"#,
        ),
        (
            "GET",
            "/v1/skills/skill_123/content",
            "/v1/skills/skill_123/content",
            "",
        ),
        (
            "GET",
            "/v1/organization/usage/completions?start_time=1700000000",
            "/v1/organization/usage/completions",
            "",
        ),
        (
            "POST",
            "/v1/organization/projects/proj_123/archive",
            "/v1/organization/projects/proj_123/archive",
            "",
        ),
        (
            "GET",
            "/v1/organization/admin_api_keys/key_123",
            "/v1/organization/admin_api_keys/key_123",
            "",
        ),
        (
            "DELETE",
            "/v1/projects/proj_123/users/user_123/roles/role_123",
            "/v1/projects/proj_123/users/user_123/roles/role_123",
            "",
        ),
        (
            "POST",
            "/v1/realtime/calls/call_123/hangup",
            "/v1/realtime/calls/call_123/hangup",
            r#"{"reason":"complete"}"#,
        ),
        (
            "POST",
            "/v1/realtime/calls",
            "/v1/realtime/calls",
            r#"{"model":"gpt-realtime","sdp":"offer"}"#,
        ),
        (
            "POST",
            "/v1/realtime/translations",
            "/v1/realtime/translations",
            r#"{"model":"gpt-realtime-translate","input_audio_format":"pcm16"}"#,
        ),
        (
            "POST",
            "/v1/realtime/sessions",
            "/v1/realtime/sessions",
            r#"{"model":"gpt-realtime"}"#,
        ),
    ] {
        let response = router
            .clone()
            .oneshot(
                Request::builder()
                    .method(method)
                    .uri(uri)
                    .header("content-type", "application/json")
                    .body(Body::from(body))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(StatusCode::NOT_IMPLEMENTED, response.status(), "{uri}");
        let body = axum::body::to_bytes(response.into_body(), usize::MAX)
            .await
            .unwrap();
        let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();
        assert_eq!(
            "openai_passthrough_not_configured",
            payload["error"]["code"]
        );
        assert_eq!(expected_error_path, payload["error"]["path"]);
    }
}

async fn capture_native_provider_request(
    State(captured): State<Arc<Mutex<Vec<CapturedNativeProviderRequest>>>>,
    headers: HeaderMap,
    request: Request<Body>,
) -> (StatusCode, HeaderMap, &'static str) {
    let (parts, body) = request.into_parts();
    let body = axum::body::to_bytes(body, usize::MAX).await.unwrap();
    captured
        .lock()
        .unwrap()
        .push(CapturedNativeProviderRequest {
            method: parts.method.to_string(),
            path_and_query: parts
                .uri
                .path_and_query()
                .map(|value| value.as_str().to_owned())
                .unwrap_or_else(|| parts.uri.path().to_owned()),
            authorization: headers
                .get("authorization")
                .and_then(|value| value.to_str().ok())
                .map(str::to_owned),
            google_api_key: headers
                .get("x-goog-api-key")
                .and_then(|value| value.to_str().ok())
                .map(str::to_owned),
            anthropic_api_key: headers
                .get("x-api-key")
                .and_then(|value| value.to_str().ok())
                .map(str::to_owned),
            anthropic_version: headers
                .get("anthropic-version")
                .and_then(|value| value.to_str().ok())
                .map(str::to_owned),
            vidu_token: headers
                .get("token")
                .and_then(|value| value.to_str().ok())
                .map(str::to_owned),
            content_type: headers
                .get("content-type")
                .and_then(|value| value.to_str().ok())
                .map(str::to_owned),
            client_api_key: headers
                .get("x-api-key")
                .and_then(|value| value.to_str().ok())
                .map(str::to_owned),
            body: String::from_utf8(body.to_vec()).unwrap(),
        });

    let mut headers = HeaderMap::new();
    headers.insert(
        "x-provider-request-id",
        "provider-request-id".parse().unwrap(),
    );
    (
        StatusCode::CREATED,
        headers,
        r#"{"id":"native-ok","object":"provider-response"}"#,
    )
}
