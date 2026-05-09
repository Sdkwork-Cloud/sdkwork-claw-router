use std::sync::{Arc, Mutex};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::application::EntityUuidGenerator;
use sdkwork_claw_product::domain::DomainResult;
use sdkwork_claw_product::ports::{
    AdminChannelCommandFuture, AdminChannelItem, AdminChannelStore, CreateAdminChannelCommand,
    DeleteAdminChannelCommand, ListAdminChannelsQuery, TestAdminChannelCommand,
    UpdateAdminChannelCommand,
};
use serde_json::Value;
use tower::ServiceExt;

#[tokio::test]
async fn admin_channel_route_creates_lists_updates_and_soft_deletes_items() {
    let store = Arc::new(TestChannelStore::default());
    let router = sdkwork_claw_product::api::admin_channel_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let create_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/channel")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"name":"OpenAI primary","vendor":"OpenAI","protocol":"OpenAI","accessType":"api-key","baseUrl":"https://api.openai.com/v1","secretRef":"vault://providers/openai/account/main","models":["openai/global/gpt-4o-mini"],"capabilities":["llm"],"timeoutMs":60000,"retryPolicy":{"maxAttempts":3,"retryableStatusCodes":[429,503],"backoffMs":25},"weight":80,"status":"active"}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, create_response.status());
    let create_payload = json_payload(create_response).await;
    assert_eq!("2000", create_payload["code"]);
    assert_eq!("OpenAI primary", create_payload["data"]["item"]["name"]);
    assert_eq!("OpenAI", create_payload["data"]["item"]["vendor"]);
    assert_eq!("active", create_payload["data"]["item"]["status"]);
    assert_eq!(80, create_payload["data"]["item"]["weight"]);
    assert_eq!(
        "openai/global/gpt-4o-mini",
        create_payload["data"]["item"]["models"][0]
    );
    assert_eq!(
        3,
        create_payload["data"]["item"]["retryPolicy"]["maxAttempts"]
    );
    assert_eq!(
        503,
        create_payload["data"]["item"]["retryPolicy"]["retryableStatusCodes"][1]
    );
    assert_eq!(
        25,
        create_payload["data"]["item"]["retryPolicy"]["backoffMs"]
    );
    assert_eq!(60_000, create_payload["data"]["item"]["timeoutMs"]);
    assert!(create_payload["data"]["item"].get("authKey").is_none());

    let update_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("PUT")
                .uri("/backend/v3/api/channel")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"id":"1","status":"disabled","weight":15,"models":["openai/global/gpt-4o-mini"],"capabilities":["llm","image"],"timeoutMs":120000,"retryPolicy":null}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, update_response.status());
    let update_payload = json_payload(update_response).await;
    assert_eq!("disabled", update_payload["data"]["item"]["status"]);
    assert_eq!(15, update_payload["data"]["item"]["weight"]);
    assert_eq!("image", update_payload["data"]["item"]["capabilities"][1]);
    assert_eq!(120_000, update_payload["data"]["item"]["timeoutMs"]);
    assert!(update_payload["data"]["item"].get("retryPolicy").is_none());
    assert_eq!(
        1,
        update_payload["data"]["item"]["models"]
            .as_array()
            .unwrap()
            .len()
    );

    let list_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/channel/list")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from("{}"))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload = json_payload(list_response).await;
    assert_eq!("2000", list_payload["code"]);
    assert_eq!(1, list_payload["data"]["items"].as_array().unwrap().len());
    assert_eq!("1", list_payload["data"]["items"][0]["id"]);
    assert_eq!("disabled", list_payload["data"]["items"][0]["status"]);
    assert_eq!(120_000, list_payload["data"]["items"][0]["timeoutMs"]);
    assert!(list_payload["data"]["items"][0]
        .get("retryPolicy")
        .is_none());

    let test_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/channel/1/test")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .header("X-Request-Id", "admin-channel-test-1")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, test_response.status());
    let test_payload = json_payload(test_response).await;
    assert_eq!("2000", test_payload["code"]);
    assert_eq!("1", test_payload["data"]["channelId"]);
    assert_eq!(true, test_payload["data"]["success"]);
    assert_eq!("active", test_payload["data"]["status"]);
    assert_eq!("37ms", test_payload["data"]["latency"]);
    assert_eq!("active", test_payload["data"]["item"]["status"]);
    assert!(test_payload["data"]["item"].get("authKey").is_none());

    let delete_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("DELETE")
                .uri("/backend/v3/api/channel/1")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, delete_response.status());
    let delete_payload = json_payload(delete_response).await;
    assert_eq!(true, delete_payload["data"]["deleted"]);

    let final_list_response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/channel/list")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from("{}"))
                .unwrap(),
        )
        .await
        .unwrap();
    let final_payload = json_payload(final_list_response).await;
    assert_eq!(0, final_payload["data"]["items"].as_array().unwrap().len());

    let commands = store.commands.lock().unwrap();
    assert_eq!(vec!["create", "update", "test", "delete"], *commands);
}

#[tokio::test]
async fn admin_channel_route_rejects_missing_trusted_subject_for_store_backed_router() {
    let router = sdkwork_claw_product::api::admin_channel_router_with_store(
        Arc::new(TestChannelStore::default()),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/channel/list")
                .body(Body::from("{}"))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
    let payload = json_payload(response).await;
    assert_eq!("4010", payload["code"]);
    assert!(payload["msg"]
        .as_str()
        .unwrap()
        .contains("x-sdkwork-tenant-id header is required"));
}

#[tokio::test]
async fn admin_channel_route_rejects_invalid_payload_without_calling_store() {
    let store = Arc::new(TestChannelStore::default());
    let router = sdkwork_claw_product::api::admin_channel_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/channel")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"name":"","vendor":"OpenAI","secretRef":"vault://providers/openai/account/main","models":["openai/global/gpt-4o-mini"],"capabilities":["llm"]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = json_payload(response).await;
    assert_eq!("4001", payload["code"]);
    assert!(payload["msg"]
        .as_str()
        .unwrap()
        .contains("channel name is required"));
    assert!(store.commands.lock().unwrap().is_empty());
}

#[tokio::test]
async fn admin_channel_route_rejects_plaintext_auth_key_without_calling_store() {
    let store = Arc::new(TestChannelStore::default());
    let router = sdkwork_claw_product::api::admin_channel_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/channel")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"name":"OpenAI primary","vendor":"OpenAI","authKey":"sk-live-secret","models":["openai/global/gpt-4o-mini"],"capabilities":["llm"]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = json_payload(response).await;
    assert_eq!("4001", payload["code"]);
    assert!(payload["msg"]
        .as_str()
        .unwrap()
        .contains("secretRef is required"));
    assert!(store.commands.lock().unwrap().is_empty());
}

#[tokio::test]
async fn admin_channel_route_rejects_invalid_base_url_without_calling_store() {
    let store = Arc::new(TestChannelStore::default());
    let router = sdkwork_claw_product::api::admin_channel_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/channel")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"name":"OpenAI primary","vendor":"OpenAI","baseUrl":"javascript:alert(1)","secretRef":"vault://providers/openai/account/main","models":["openai/global/gpt-4o-mini"],"capabilities":["llm"]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = json_payload(response).await;
    assert_eq!("4001", payload["code"]);
    assert!(payload["msg"]
        .as_str()
        .unwrap()
        .contains("channel baseUrl must be an absolute http or https URL"));
    assert!(store.commands.lock().unwrap().is_empty());
}

#[tokio::test]
async fn admin_channel_route_rejects_unsafe_secret_ref_without_calling_store() {
    let store = Arc::new(TestChannelStore::default());
    let router = sdkwork_claw_product::api::admin_channel_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let empty_locator_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/channel")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"name":"OpenAI primary","vendor":"OpenAI","secretRef":"vault://","models":["openai/global/gpt-4o-mini"],"capabilities":["llm"]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, empty_locator_response.status());
    let empty_locator_payload = json_payload(empty_locator_response).await;
    assert_eq!("4001", empty_locator_payload["code"]);
    assert!(empty_locator_payload["msg"]
        .as_str()
        .unwrap()
        .contains("secretRef must include a non-empty locator"));

    let plaintext_alias_response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/channel")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"name":"OpenAI primary","vendor":"OpenAI","secretRef":"vault://providers/openai/account/main","api_key":"sk-live-secret","models":["openai/global/gpt-4o-mini"],"capabilities":["llm"]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, plaintext_alias_response.status());
    let plaintext_alias_payload = json_payload(plaintext_alias_response).await;
    assert_eq!("4001", plaintext_alias_payload["code"]);
    assert!(plaintext_alias_payload["msg"]
        .as_str()
        .unwrap()
        .contains("plaintext credential fields are not accepted"));
    assert!(store.commands.lock().unwrap().is_empty());
}

#[tokio::test]
async fn admin_channel_route_rejects_invalid_retry_policy_without_calling_store() {
    let store = Arc::new(TestChannelStore::default());
    let router = sdkwork_claw_product::api::admin_channel_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/channel")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"name":"OpenAI primary","vendor":"OpenAI","secretRef":"vault://providers/openai/account/main","models":["openai/global/gpt-4o-mini"],"retryPolicy":{"maxAttempts":6,"retryableStatusCodes":[503]}}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = json_payload(response).await;
    assert_eq!("4001", payload["code"]);
    assert!(payload["msg"]
        .as_str()
        .unwrap()
        .contains("retryPolicy.maxAttempts must be between 1 and 5"));
    assert!(store.commands.lock().unwrap().is_empty());
}

#[tokio::test]
async fn admin_channel_route_rejects_null_create_runtime_policy_fields_without_calling_store() {
    let store = Arc::new(TestChannelStore::default());
    let router = sdkwork_claw_product::api::admin_channel_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let null_timeout_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/channel")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"name":"OpenAI primary","vendor":"OpenAI","secretRef":"vault://providers/openai/account/main","models":["openai/global/gpt-4o-mini"],"timeoutMs":null}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, null_timeout_response.status());
    let null_timeout_payload = json_payload(null_timeout_response).await;
    assert_eq!("4001", null_timeout_payload["code"]);
    assert!(null_timeout_payload["msg"]
        .as_str()
        .unwrap()
        .contains("timeoutMs must be an integer"));

    let null_retry_policy_response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/channel")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"name":"OpenAI primary","vendor":"OpenAI","secretRef":"vault://providers/openai/account/main","models":["openai/global/gpt-4o-mini"],"retryPolicy":null}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, null_retry_policy_response.status());
    let null_retry_policy_payload = json_payload(null_retry_policy_response).await;
    assert_eq!("4001", null_retry_policy_payload["code"]);
    assert!(null_retry_policy_payload["msg"]
        .as_str()
        .unwrap()
        .contains("retryPolicy must be a JSON object"));
    assert!(store.commands.lock().unwrap().is_empty());
}

async fn json_payload(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

#[derive(Default)]
struct TestChannelStore {
    items: Mutex<Vec<AdminChannelItem>>,
    commands: Mutex<Vec<&'static str>>,
}

impl AdminChannelStore for TestChannelStore {
    fn list_channels<'a>(
        &'a self,
        query: ListAdminChannelsQuery,
    ) -> AdminChannelCommandFuture<'a, Vec<AdminChannelItem>> {
        Box::pin(async move {
            Ok(self
                .items
                .lock()
                .unwrap()
                .iter()
                .filter(|item| {
                    item.tenant_id == query.subject.tenant_id
                        && item.organization_id == query.subject.organization_id
                        && item.deleted_at.is_none()
                })
                .cloned()
                .collect())
        })
    }

    fn create_channel<'a>(
        &'a self,
        command: CreateAdminChannelCommand,
    ) -> AdminChannelCommandFuture<'a, AdminChannelItem> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("create");
            let item = AdminChannelItem {
                id: 1,
                uuid: command.channel_uuid,
                tenant_id: command.subject.tenant_id,
                organization_id: command.subject.organization_id,
                name: command.name,
                vendor: command.vendor,
                provider_code: command.provider_code,
                protocol: command.protocol,
                access_type: command.access_type,
                base_url: command.base_url,
                secret_ref: Some(command.secret_ref),
                models: command.models,
                capabilities: command.capabilities,
                is_multimodal: command.is_multimodal,
                timeout_ms: command.timeout_ms,
                retry_policy_json: command.retry_policy_json,
                weight: command.weight,
                status: command.status,
                balance: "N/A".to_owned(),
                errors: 0,
                deleted_at: None,
            };
            self.items.lock().unwrap().push(item.clone());
            Ok(item)
        })
    }

    fn update_channel<'a>(
        &'a self,
        command: UpdateAdminChannelCommand,
    ) -> AdminChannelCommandFuture<'a, Option<AdminChannelItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("update");
            let mut items = self.items.lock().unwrap();
            let Some(item) = items.iter_mut().find(|item| {
                item.id == command.channel_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.deleted_at.is_none()
            }) else {
                return Ok(None);
            };
            if let Some(name) = command.name {
                item.name = name;
            }
            if let Some(vendor) = command.vendor {
                item.vendor = vendor;
            }
            if let Some(provider_code) = command.provider_code {
                item.provider_code = provider_code;
            }
            if let Some(protocol) = command.protocol {
                item.protocol = protocol;
            }
            if let Some(access_type) = command.access_type {
                item.access_type = access_type;
            }
            if let Some(base_url) = command.base_url {
                item.base_url = base_url;
            }
            if let Some(secret_ref) = command.secret_ref {
                item.secret_ref = Some(secret_ref);
            }
            if let Some(models) = command.models {
                item.models = models;
            }
            if let Some(capabilities) = command.capabilities {
                item.is_multimodal = capabilities.iter().any(|capability| capability != "llm");
                item.capabilities = capabilities;
            }
            if let Some(retry_policy_json) = command.retry_policy_json {
                item.retry_policy_json = retry_policy_json;
            }
            if let Some(timeout_ms) = command.timeout_ms {
                item.timeout_ms = timeout_ms;
            }
            if let Some(weight) = command.weight {
                item.weight = weight;
            }
            if let Some(status) = command.status {
                item.status = status;
            }
            Ok(Some(item.clone()))
        })
    }

    fn delete_channel<'a>(
        &'a self,
        command: DeleteAdminChannelCommand,
    ) -> AdminChannelCommandFuture<'a, bool> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("delete");
            let mut items = self.items.lock().unwrap();
            let Some(item) = items.iter_mut().find(|item| {
                item.id == command.channel_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.deleted_at.is_none()
            }) else {
                return Ok(false);
            };
            item.deleted_at = Some(command.requested_at);
            Ok(true)
        })
    }

    fn test_channel<'a>(
        &'a self,
        command: TestAdminChannelCommand,
    ) -> AdminChannelCommandFuture<'a, Option<sdkwork_claw_product::ports::AdminChannelTestOutcome>>
    {
        Box::pin(async move {
            self.commands.lock().unwrap().push("test");
            let mut items = self.items.lock().unwrap();
            let Some(item) = items.iter_mut().find(|item| {
                item.id == command.channel_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.deleted_at.is_none()
            }) else {
                return Ok(None);
            };
            item.status = "active".to_owned();
            item.errors = 0;
            Ok(Some(sdkwork_claw_product::ports::AdminChannelTestOutcome {
                channel_id: item.id.to_string(),
                success: true,
                status: item.status.clone(),
                latency: "37ms".to_owned(),
                item: item.clone(),
            }))
        })
    }
}

struct TestUuidGenerator;

impl EntityUuidGenerator for TestUuidGenerator {
    fn generate_entity_uuid(&self) -> DomainResult<String> {
        Ok("test-uuid".to_owned())
    }
}
