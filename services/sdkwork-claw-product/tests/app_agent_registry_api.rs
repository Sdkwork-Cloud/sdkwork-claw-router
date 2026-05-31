mod common;
use common::missing_internal_tenant_header_message;
use common::InternalTrustedSubjectHeaders;
use std::sync::{Arc, Mutex};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::application::EntityUuidGenerator;
use sdkwork_claw_product::domain::DomainResult;
use sdkwork_claw_product::ports::{
    AppAgentCapabilities, AppAgentItem, AppAgentRegistryFuture, AppAgentRegistryQuery,
    AppAgentRegistryStore, AppAgentRegistrySubject, AppAgentVersionItem, CreateAppAgentCommand,
};
use serde_json::{json, Value};
use tower::ServiceExt;

const TEST_REQUEST_ID: &str = "11111111-2222-4333-8444-555555555555";

#[tokio::test]
async fn app_agent_registry_create_route_returns_standard_agent_definition() {
    let store = Arc::new(FixedAppAgentRegistryStore::new());
    let router = sdkwork_claw_product::api::app_agent_registry_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(vec![
            "agent-uuid-001",
            "agent-version-uuid-001",
        ])),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/agents")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .header("Idempotency-Key", "create-product-studio-agent")
                .header("X-Request-Id", TEST_REQUEST_ID)
                .body(Body::from(
                    r#"{
                      "name":"Product Studio Agent",
                      "description":"Creates product launch assets",
                      "model":"gpt-5.1",
                      "systemPrompt":"You are a precise launch content agent.",
                      "memoryPolicy":{"enabled":true},
                      "mcpPolicy":{"servers":["filesystem"]},
                      "skillPolicy":{"skills":["image.generate"]},
                      "runtimePolicy":{"executionMode":"interactive"}
                    }"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("agent-1", payload["data"]["item"]["id"]);
    assert_eq!(
        "product-studio-agent", payload["data"]["item"]["code"],
        "agent code must be generated deterministically from the user-visible name"
    );
    assert_eq!("Product Studio Agent", payload["data"]["item"]["name"]);
    assert_eq!("private", payload["data"]["item"]["visibility"]);
    assert_eq!("active", payload["data"]["item"]["status"]);
    assert_eq!(
        "agent-version-1",
        payload["data"]["item"]["defaultVersion"]["id"]
    );
    assert_eq!(1, payload["data"]["item"]["defaultVersion"]["versionNo"]);
    assert_eq!(
        "draft",
        payload["data"]["item"]["defaultVersion"]["releaseStatus"]
    );
    assert_eq!(
        "gpt-5.1",
        payload["data"]["item"]["defaultVersion"]["model"]
    );
    assert_eq!(
        "You are a precise launch content agent.",
        payload["data"]["item"]["defaultVersion"]["systemPrompt"]
    );
    assert_eq!(
        true,
        payload["data"]["item"]["capabilities"]["memoryEnabled"]
    );
    assert_eq!(
        1,
        payload["data"]["item"]["capabilities"]["skillBindingCount"]
    );
    assert_eq!(1, payload["data"]["item"]["capabilities"]["mcpServerCount"]);

    let commands = store.commands.lock().unwrap();
    assert_eq!(1, commands.len());
    assert_eq!(10, commands[0].subject.tenant_id);
    assert_eq!(20, commands[0].subject.organization_id);
    assert_eq!(30, commands[0].subject.user_id);
    assert_eq!("create-product-studio-agent", commands[0].idempotency_key);
    assert_server_request_id(&commands[0].request_id, TEST_REQUEST_ID);
    assert_eq!("agent-uuid-001", commands[0].agent_uuid);
    assert_eq!("agent-version-uuid-001", commands[0].version_uuid);
    assert_eq!("Product Studio Agent", commands[0].name);
    assert_eq!("product-studio-agent", commands[0].agent_code);
    assert_eq!("gpt-5.1", commands[0].model.as_deref().unwrap());
    assert_eq!(true, commands[0].memory_policy["enabled"]);
    assert_eq!("filesystem", commands[0].mcp_policy["servers"][0]);
    assert_eq!("image.generate", commands[0].skill_policy["skills"][0]);
}

#[tokio::test]
async fn app_agent_registry_list_and_detail_routes_return_direct_sdk_contracts() {
    let store = Arc::new(FixedAppAgentRegistryStore::new());
    let router = sdkwork_claw_product::api::app_agent_registry_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(Vec::new())),
    );

    let list_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/agents?page=1&pageSize=20&q=studio")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload = response_json(list_response).await;
    assert_eq!("2000", list_payload["code"]);
    assert_eq!(1, list_payload["data"]["items"].as_array().unwrap().len());
    assert_eq!("agent-1", list_payload["data"]["items"][0]["id"]);
    assert_eq!(
        "Product Studio Agent",
        list_payload["data"]["items"][0]["name"]
    );

    let detail_response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/agents/agent-1")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, detail_response.status());
    let detail_payload = response_json(detail_response).await;
    assert_eq!("2000", detail_payload["code"]);
    assert_eq!("agent-1", detail_payload["data"]["id"]);
    assert!(
        detail_payload["data"]["items"].is_null(),
        "detail response must be the direct Agent response object, not a nested list envelope"
    );

    let queries = store.queries.lock().unwrap();
    assert_eq!(1, queries.len());
    assert_eq!(Some("studio"), queries[0].keyword.as_deref());
    assert_eq!(Some(1), queries[0].page_no);
    assert_eq!(Some(20), queries[0].page_size);
}

#[tokio::test]
async fn app_agent_registry_list_route_accepts_standard_snake_case_page_size_query() {
    let store = Arc::new(FixedAppAgentRegistryStore::new());
    let router = sdkwork_claw_product::api::app_agent_registry_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(Vec::new())),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/agents?page=2&page_size=40&q=studio")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let queries = store.queries.lock().unwrap();
    assert_eq!(1, queries.len());
    assert_eq!(Some("studio"), queries[0].keyword.as_deref());
    assert_eq!(Some(2), queries[0].page_no);
    assert_eq!(Some(40), queries[0].page_size);
}

#[tokio::test]
async fn app_agent_registry_create_route_rejects_blank_names_without_calling_store() {
    let store = Arc::new(FixedAppAgentRegistryStore::new());
    let router = sdkwork_claw_product::api::app_agent_registry_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(Vec::new())),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/agents")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .header("Idempotency-Key", "create-blank-agent")
                .header("X-Request-Id", "request-blank-agent")
                .body(Body::from(r#"{"name":"   "}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = response_json(response).await;
    assert_eq!("4001", payload["code"]);
    assert!(payload["msg"]
        .as_str()
        .unwrap()
        .contains("agent name is required"));
    assert!(store.commands.lock().unwrap().is_empty());
}

#[tokio::test]
async fn app_agent_registry_create_route_requires_idempotency_key() {
    let store = Arc::new(FixedAppAgentRegistryStore::new());
    let router = sdkwork_claw_product::api::app_agent_registry_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(Vec::new())),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/agents")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .header("X-Request-Id", "request-without-idempotency")
                .body(Body::from(r#"{"name":"Product Studio Agent"}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = response_json(response).await;
    assert_eq!("4001", payload["code"]);
    assert!(payload["msg"]
        .as_str()
        .unwrap()
        .contains("Idempotency-Key header is required"));
    assert!(store.commands.lock().unwrap().is_empty());
}

#[tokio::test]
async fn app_agent_registry_create_route_rejects_whitespace_wrapped_request_tokens() {
    let store = Arc::new(FixedAppAgentRegistryStore::new());
    let router = sdkwork_claw_product::api::app_agent_registry_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(Vec::new())),
    );

    let idempotency_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/agents")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .header("Idempotency-Key", " create-product-studio-agent ")
                .header("X-Request-Id", TEST_REQUEST_ID)
                .body(Body::from(r#"{"name":"Product Studio Agent"}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, idempotency_response.status());
    let idempotency_payload = response_json(idempotency_response).await;
    assert_eq!("4001", idempotency_payload["code"]);
    assert!(idempotency_payload["msg"]
        .as_str()
        .unwrap()
        .contains("Idempotency-Key must contain only visible ASCII characters"));

    assert!(store.commands.lock().unwrap().is_empty());
}

#[tokio::test]
async fn app_agent_registry_create_route_rejects_oversized_request_tokens() {
    let store = Arc::new(FixedAppAgentRegistryStore::new());
    let router = sdkwork_claw_product::api::app_agent_registry_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(Vec::new())),
    );
    let oversized = "a".repeat(129);

    let idempotency_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/agents")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .header("Idempotency-Key", oversized.as_str())
                .header("X-Request-Id", TEST_REQUEST_ID)
                .body(Body::from(r#"{"name":"Product Studio Agent"}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, idempotency_response.status());
    let idempotency_payload = response_json(idempotency_response).await;
    assert_eq!("4001", idempotency_payload["code"]);
    assert!(idempotency_payload["msg"]
        .as_str()
        .unwrap()
        .contains("Idempotency-Key must be at most 128 characters"));

    assert!(store.commands.lock().unwrap().is_empty());
}

#[tokio::test]
async fn app_agent_registry_create_route_generates_request_id_when_header_is_absent() {
    let store = Arc::new(FixedAppAgentRegistryStore::new());
    let router = sdkwork_claw_product::api::app_agent_registry_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(vec![
            "agent-uuid-001",
            "agent-version-uuid-001",
        ])),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/agents")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .header("Idempotency-Key", "create-product-studio-agent")
                .body(Body::from(r#"{"name":"Product Studio Agent"}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let commands = store.commands.lock().unwrap();
    assert_eq!(1, commands.len());
    assert_uuid(&commands[0].request_id);
    assert_eq!("agent-uuid-001", commands[0].agent_uuid);
    assert_eq!("agent-version-uuid-001", commands[0].version_uuid);
}

#[tokio::test]
async fn app_agent_registry_routes_require_trusted_subject() {
    let router = sdkwork_claw_product::api::app_agent_registry_router_with_store(
        Arc::new(FixedAppAgentRegistryStore::new()),
        Arc::new(SequentialUuidGenerator::new(Vec::new())),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/agents")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
    let payload = response_json(response).await;
    assert_eq!("4010", payload["code"]);
    assert!(payload["msg"]
        .as_str()
        .unwrap()
        .contains(missing_internal_tenant_header_message()));
}

async fn response_json(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

fn assert_uuid(value: &str) {
    let bytes = value.as_bytes();
    assert_eq!(36, bytes.len(), "request id must be a canonical UUID");
    assert_eq!(b'-', bytes[8]);
    assert_eq!(b'-', bytes[13]);
    assert_eq!(b'-', bytes[18]);
    assert_eq!(b'-', bytes[23]);
    assert_eq!(b'4', bytes[14], "generated request id must be UUID v4");
    assert!(
        matches!(bytes[19], b'8' | b'9' | b'a' | b'b'),
        "generated request id must use RFC 4122 variant"
    );
    assert!(bytes.iter().enumerate().all(|(index, byte)| {
        matches!(index, 8 | 13 | 18 | 23) && *byte == b'-'
            || !matches!(index, 8 | 13 | 18 | 23) && byte.is_ascii_hexdigit()
    }));
}

fn assert_server_request_id(value: &str, client_header_value: &str) {
    assert_uuid(value);
    assert_ne!(
        client_header_value, value,
        "server-generated request id must ignore client X-Request-Id"
    );
}

struct FixedAppAgentRegistryStore {
    commands: Mutex<Vec<CreateAppAgentCommand>>,
    queries: Mutex<Vec<AppAgentRegistryQuery>>,
}

impl FixedAppAgentRegistryStore {
    fn new() -> Self {
        Self {
            commands: Mutex::new(Vec::new()),
            queries: Mutex::new(Vec::new()),
        }
    }
}

impl AppAgentRegistryStore for FixedAppAgentRegistryStore {
    fn list_agents<'a>(
        &'a self,
        subject: AppAgentRegistrySubject,
        query: AppAgentRegistryQuery,
    ) -> AppAgentRegistryFuture<'a, Vec<AppAgentItem>> {
        Box::pin(async move {
            self.queries
                .lock()
                .map_err(|_| sdkwork_claw_product::domain::DomainError::new("query lock poisoned"))?
                .push(query);
            let mut item = agent_item();
            item.owner_user_id = subject.user_id;
            Ok(vec![item])
        })
    }

    fn get_agent<'a>(
        &'a self,
        _subject: AppAgentRegistrySubject,
        agent_id: String,
    ) -> AppAgentRegistryFuture<'a, Option<AppAgentItem>> {
        Box::pin(async move {
            Ok(if agent_id == "agent-1" {
                Some(agent_item())
            } else {
                None
            })
        })
    }

    fn create_agent<'a>(
        &'a self,
        command: CreateAppAgentCommand,
    ) -> AppAgentRegistryFuture<'a, AppAgentItem> {
        Box::pin(async move {
            self.commands
                .lock()
                .map_err(|_| {
                    sdkwork_claw_product::domain::DomainError::new("command lock poisoned")
                })?
                .push(command.clone());
            let mut item = agent_item();
            item.code = command.agent_code;
            item.name = command.name;
            item.description = command.description.unwrap_or_default();
            item.owner_user_id = command.subject.user_id;
            item.default_version.model = command.model;
            item.default_version.system_prompt = command.system_prompt.unwrap_or_default();
            item.default_version.memory_policy = command.memory_policy;
            item.default_version.mcp_policy = command.mcp_policy;
            item.default_version.skill_policy = command.skill_policy;
            item.default_version.runtime_policy = command.runtime_policy;
            item.capabilities.memory_enabled = item.default_version.memory_policy["enabled"]
                .as_bool()
                .unwrap_or(false);
            item.capabilities.mcp_server_count = item
                .default_version
                .mcp_policy
                .get("servers")
                .and_then(Value::as_array)
                .map(Vec::len)
                .unwrap_or(0) as i64;
            item.capabilities.skill_binding_count = item
                .default_version
                .skill_policy
                .get("skills")
                .and_then(Value::as_array)
                .map(Vec::len)
                .unwrap_or(0) as i64;
            Ok(item)
        })
    }
}

fn agent_item() -> AppAgentItem {
    AppAgentItem {
        id: "agent-1".to_owned(),
        owner_user_id: 30,
        code: "product-studio-agent".to_owned(),
        name: "Product Studio Agent".to_owned(),
        description: "Creates product launch assets".to_owned(),
        visibility: "private".to_owned(),
        status: "active".to_owned(),
        avatar_url: None,
        template_source: None,
        created_at: "2026-05-17 08:00:00".to_owned(),
        updated_at: "2026-05-17 08:00:00".to_owned(),
        default_version: AppAgentVersionItem {
            id: "agent-version-1".to_owned(),
            version_no: 1,
            release_status: "draft".to_owned(),
            model: Some("gpt-5.1".to_owned()),
            system_prompt: "You are a precise launch content agent.".to_owned(),
            tool_policy: json!({}),
            memory_policy: json!({ "enabled": true }),
            mcp_policy: json!({ "servers": ["filesystem"] }),
            skill_policy: json!({ "skills": ["image.generate"] }),
            runtime_policy: json!({ "executionMode": "interactive" }),
            created_at: "2026-05-17 08:00:00".to_owned(),
            updated_at: "2026-05-17 08:00:00".to_owned(),
        },
        capabilities: AppAgentCapabilities {
            memory_enabled: true,
            mcp_server_count: 1,
            skill_binding_count: 1,
        },
    }
}

struct SequentialUuidGenerator {
    values: Mutex<Vec<String>>,
}

impl SequentialUuidGenerator {
    fn new(values: Vec<&str>) -> Self {
        Self {
            values: Mutex::new(values.into_iter().map(str::to_owned).rev().collect()),
        }
    }
}

impl EntityUuidGenerator for SequentialUuidGenerator {
    fn generate_entity_uuid(&self) -> DomainResult<String> {
        self.values
            .lock()
            .map_err(|_| sdkwork_claw_product::domain::DomainError::new("uuid lock poisoned"))?
            .pop()
            .ok_or_else(|| sdkwork_claw_product::domain::DomainError::new("missing test uuid"))
    }
}
