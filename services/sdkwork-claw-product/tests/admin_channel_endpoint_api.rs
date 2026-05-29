mod common;
use common::InternalTrustedSubjectHeaders;

use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::application::EntityUuidGenerator;
use sdkwork_claw_product::ports::{
    AdminChannelEndpointFuture, AdminChannelEndpointItem, AdminChannelEndpointStore,
    AdminChannelEndpointSubject, CreateAdminChannelEndpointCommand, ListAdminChannelEndpointsQuery,
    UpdateAdminChannelEndpointCommand,
};
use serde_json::Value;
use tower::ServiceExt;

#[tokio::test]
async fn admin_channel_endpoint_route_lists_region_endpoints() {
    let router = sdkwork_claw_product::api::admin_channel_endpoint_router_with_store(
        Arc::new(TestChannelEndpointStore),
        Arc::new(TestUuidGenerator::default()),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/backend/v3/api/integration/channel_endpoints")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = json_payload(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("9002", payload["data"]["items"][0]["channelId"]);
    assert_eq!("openrouter", payload["data"]["items"][0]["providerCode"]);
    assert_eq!("relay", payload["data"]["items"][0]["channelType"]);
    assert_eq!("openai", payload["data"]["items"][0]["vendorCode"]);
    assert_eq!("global", payload["data"]["items"][0]["regionCode"]);
    assert_eq!(
        "openai.chat_completions",
        payload["data"]["items"][0]["apiEndpointCode"]
    );
    assert_eq!(
        "https://provider-proxy.internal/openrouter/openai",
        payload["data"]["items"][0]["baseUrl"]
    );
}

#[tokio::test]
async fn admin_channel_endpoint_route_creates_and_updates_region_endpoints() {
    let router = sdkwork_claw_product::api::admin_channel_endpoint_router_with_store(
        Arc::new(TestChannelEndpointStore),
        Arc::new(TestUuidGenerator::default()),
    );

    let create_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/integration/channel_endpoints")
                .internal_trusted_subject(10, 20, 30)
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"channelId":"9002","providerCode":"malicious","channelCode":"spoofed","channelType":"official","vendorCode":" OpenAI ","regionCode":" Global ","apiEndpointCode":" OpenAI.Chat_Completions ","baseUrl":" https://provider-proxy.internal/openrouter/openai ","priority":20,"weight":300,"status":"active","effectiveFrom":"2026-05-28 10:00:00","effectiveTo":"2026-06-28 10:00:00"}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, create_response.status());
    let create_payload = json_payload(create_response).await;
    assert_eq!("2000", create_payload["code"]);
    assert_eq!("1", create_payload["data"]["item"]["id"]);
    assert_eq!(
        "openrouter", create_payload["data"]["item"]["providerCode"],
        "response provider identity must be derived by the store, not trusted from request body"
    );
    assert_eq!("relay", create_payload["data"]["item"]["channelType"]);
    assert_eq!("openai", create_payload["data"]["item"]["vendorCode"]);
    assert_eq!("global", create_payload["data"]["item"]["regionCode"]);
    assert_eq!(
        "openai.chat_completions",
        create_payload["data"]["item"]["apiEndpointCode"]
    );
    assert_eq!(20, create_payload["data"]["item"]["priority"]);
    assert_eq!(300, create_payload["data"]["item"]["weight"]);
    assert_eq!("active", create_payload["data"]["item"]["status"]);

    let update_response = router
        .oneshot(
            Request::builder()
                .method("PUT")
                .uri("/backend/v3/api/integration/channel_endpoints/42")
                .internal_trusted_subject(10, 20, 30)
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"regionCode":" US-East-1 ","baseUrl":"https://us-east.provider-proxy.internal/openrouter/openai","priority":5,"weight":500,"status":"disabled","effectiveTo":null}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, update_response.status());
    let update_payload = json_payload(update_response).await;
    assert_eq!("us-east-1", update_payload["data"]["item"]["regionCode"]);
    assert_eq!(
        "https://us-east.provider-proxy.internal/openrouter/openai",
        update_payload["data"]["item"]["baseUrl"]
    );
    assert_eq!("disabled", update_payload["data"]["item"]["status"]);
    assert!(update_payload["data"]["item"]["effectiveTo"].is_null());
}

#[tokio::test]
async fn admin_channel_endpoint_route_rejects_non_http_base_url() {
    let router = sdkwork_claw_product::api::admin_channel_endpoint_router_with_store(
        Arc::new(TestChannelEndpointStore),
        Arc::new(TestUuidGenerator::default()),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/integration/channel_endpoints")
                .internal_trusted_subject(10, 20, 30)
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"channelId":9002,"vendorCode":"openai","regionCode":"global","apiEndpointCode":"openai.chat_completions","baseUrl":"file:///tmp/provider.sock"}"#,
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
        .is_some_and(|message| message.contains("baseUrl must start with http:// or https://")));
}

async fn json_payload(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

struct TestChannelEndpointStore;

impl AdminChannelEndpointStore for TestChannelEndpointStore {
    fn list_channel_endpoints<'a>(
        &'a self,
        query: ListAdminChannelEndpointsQuery,
    ) -> AdminChannelEndpointFuture<'a, Vec<AdminChannelEndpointItem>> {
        Box::pin(async move {
            assert_eq!(subject(), query.subject);
            Ok(vec![sample_item(41)])
        })
    }

    fn create_channel_endpoint<'a>(
        &'a self,
        command: CreateAdminChannelEndpointCommand,
    ) -> AdminChannelEndpointFuture<'a, Option<AdminChannelEndpointItem>> {
        Box::pin(async move {
            assert_eq!(subject(), command.subject);
            assert_eq!("entity-1", command.endpoint_uuid);
            assert_eq!("entity-2", command.audit_log_uuid);
            assert_eq!(9002, command.channel_id);
            assert_eq!("openai", command.vendor_code);
            assert_eq!("global", command.region_code);
            assert_eq!("openai.chat_completions", command.api_endpoint_code);
            assert_eq!(
                "https://provider-proxy.internal/openrouter/openai",
                command.base_url
            );
            assert_eq!(20, command.priority);
            assert_eq!(300, command.weight);
            assert_eq!("active", command.status);
            assert_eq!(
                Some("2026-05-28 10:00:00"),
                command.effective_from.as_deref()
            );
            assert_eq!(Some("2026-06-28 10:00:00"), command.effective_to.as_deref());
            Ok(Some(AdminChannelEndpointItem {
                id: 1,
                channel_id: 9002,
                provider_code: "openrouter".to_owned(),
                channel_code: "openrouter-main".to_owned(),
                channel_type: "relay".to_owned(),
                vendor_code: command.vendor_code,
                region_code: command.region_code,
                api_endpoint_code: command.api_endpoint_code,
                base_url: command.base_url,
                priority: command.priority,
                weight: command.weight,
                health_status: "healthy".to_owned(),
                status: command.status,
                effective_from: command.effective_from,
                effective_to: command.effective_to,
            }))
        })
    }

    fn update_channel_endpoint<'a>(
        &'a self,
        command: UpdateAdminChannelEndpointCommand,
    ) -> AdminChannelEndpointFuture<'a, Option<AdminChannelEndpointItem>> {
        Box::pin(async move {
            assert_eq!(subject(), command.subject);
            assert_eq!(42, command.endpoint_id);
            assert_eq!("entity-3", command.audit_log_uuid);
            assert_eq!(Some("us-east-1"), command.region_code.as_deref());
            assert_eq!(
                Some("https://us-east.provider-proxy.internal/openrouter/openai"),
                command.base_url.as_deref()
            );
            assert_eq!(Some(5), command.priority);
            assert_eq!(Some(500), command.weight);
            assert_eq!(Some("disabled"), command.status.as_deref());
            assert_eq!(Some(None), command.effective_to);
            let mut item = sample_item(42);
            item.region_code = command.region_code.unwrap();
            item.base_url = command.base_url.unwrap();
            item.priority = command.priority.unwrap();
            item.weight = command.weight.unwrap();
            item.status = command.status.unwrap();
            item.effective_to = command.effective_to.unwrap();
            Ok(Some(item))
        })
    }
}

fn subject() -> AdminChannelEndpointSubject {
    AdminChannelEndpointSubject {
        tenant_id: 10,
        organization_id: 20,
        operator_id: 30,
        operator_type: 1,
    }
}

fn sample_item(id: i64) -> AdminChannelEndpointItem {
    AdminChannelEndpointItem {
        id,
        channel_id: 9002,
        provider_code: "openrouter".to_owned(),
        channel_code: "openrouter-main".to_owned(),
        channel_type: "relay".to_owned(),
        vendor_code: "openai".to_owned(),
        region_code: "global".to_owned(),
        api_endpoint_code: "openai.chat_completions".to_owned(),
        base_url: "https://provider-proxy.internal/openrouter/openai".to_owned(),
        priority: 20,
        weight: 300,
        health_status: "healthy".to_owned(),
        status: "active".to_owned(),
        effective_from: Some("2026-05-28 10:00:00".to_owned()),
        effective_to: Some("2026-06-28 10:00:00".to_owned()),
    }
}

struct TestUuidGenerator {
    next: AtomicUsize,
}

impl Default for TestUuidGenerator {
    fn default() -> Self {
        Self {
            next: AtomicUsize::new(1),
        }
    }
}

impl EntityUuidGenerator for TestUuidGenerator {
    fn generate_entity_uuid(&self) -> sdkwork_claw_product::domain::DomainResult<String> {
        Ok(format!(
            "entity-{}",
            self.next.fetch_add(1, Ordering::SeqCst)
        ))
    }
}
