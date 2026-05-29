mod common;
use common::InternalTrustedSubjectHeaders;

use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::application::EntityUuidGenerator;
use sdkwork_claw_product::ports::{
    AdminAiResourceItem, AdminAiResourceMemberItem, AdminAiResourceReadFuture,
    AdminAiResourceStore, AdminAiResourceSubject, CreateAdminAiResourceCommand,
    ListAdminAiResourcesQuery, UpdateAdminAiResourceCommand,
};
use serde_json::Value;
use tower::ServiceExt;

#[tokio::test]
async fn admin_ai_resource_route_lists_resources_with_members() {
    let router = sdkwork_claw_product::api::admin_ai_resource_router_with_store(
        Arc::new(TestAiResourceStore),
        Arc::new(TestUuidGenerator::default()),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/backend/v3/api/ai/resources")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = json_payload(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("vendor.openai", payload["data"]["items"][0]["resourceCode"]);
    assert_eq!("vendor", payload["data"]["items"][0]["resourceType"]);
    assert_eq!(
        "bundle.openrouter.openai.standard",
        payload["data"]["items"][1]["resourceCode"]
    );
    assert_eq!(
        "model.openai.gpt-4o-mini.chat",
        payload["data"]["items"][1]["members"][0]["memberResourceCode"]
    );
    assert_eq!(true, payload["data"]["items"][1]["members"][0]["required"]);
}

#[tokio::test]
async fn admin_ai_resource_route_creates_and_updates_resources() {
    let router = sdkwork_claw_product::api::admin_ai_resource_router_with_store(
        Arc::new(TestAiResourceStore),
        Arc::new(TestUuidGenerator::default()),
    );

    let create_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/ai/resources")
                .internal_trusted_subject(10, 20, 30)
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"resourceCode":" Bundle.OpenRouter.OpenAI.Standard ","resourceType":"bundle","displayName":"OpenRouter OpenAI Standard","vendorCode":" OpenAI ","compositionMode":"all","status":"active","sortOrder":5,"members":[{"memberResourceCode":"model.openai.gpt-4o-mini.chat","memberRole":"included","required":true,"sortOrder":1}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, create_response.status());
    let create_payload = json_payload(create_response).await;
    assert_eq!("2000", create_payload["code"]);
    assert_eq!(
        "bundle.openrouter.openai.standard",
        create_payload["data"]["item"]["resourceCode"]
    );
    assert_eq!("bundle", create_payload["data"]["item"]["resourceType"]);
    assert_eq!("all", create_payload["data"]["item"]["compositionMode"]);
    assert_eq!(
        "model.openai.gpt-4o-mini.chat",
        create_payload["data"]["item"]["members"][0]["memberResourceCode"]
    );

    let update_response = router
        .oneshot(
            Request::builder()
                .method("PUT")
                .uri("/backend/v3/api/ai/resources/5")
                .internal_trusted_subject(10, 20, 30)
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"displayName":"OpenRouter OpenAI Bundle","status":"disabled","members":[]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, update_response.status());
    let update_payload = json_payload(update_response).await;
    assert_eq!("disabled", update_payload["data"]["item"]["status"]);
    assert_eq!(
        "OpenRouter OpenAI Bundle",
        update_payload["data"]["item"]["displayName"]
    );
    assert_eq!(
        0,
        update_payload["data"]["item"]["members"]
            .as_array()
            .unwrap()
            .len()
    );
}

async fn json_payload(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

struct TestAiResourceStore;

impl AdminAiResourceStore for TestAiResourceStore {
    fn list_ai_resources<'a>(
        &'a self,
        query: ListAdminAiResourcesQuery,
    ) -> AdminAiResourceReadFuture<'a, Vec<AdminAiResourceItem>> {
        Box::pin(async move {
            assert_eq!(
                AdminAiResourceSubject {
                    tenant_id: 10,
                    organization_id: 20,
                    operator_id: 30,
                    operator_type: 1,
                },
                query.subject
            );
            Ok(vec![
                AdminAiResourceItem {
                    id: 1,
                    resource_code: "vendor.openai".to_owned(),
                    resource_type: "vendor".to_owned(),
                    display_name: "OpenAI".to_owned(),
                    vendor_code: Some("openai".to_owned()),
                    modality_code: None,
                    api_endpoint_code: None,
                    catalog_key: None,
                    model: None,
                    provider_native_model: None,
                    composition_mode: "single".to_owned(),
                    status: "active".to_owned(),
                    sort_order: Some(1),
                    members: Vec::new(),
                },
                AdminAiResourceItem {
                    id: 5,
                    resource_code: "bundle.openrouter.openai.standard".to_owned(),
                    resource_type: "bundle".to_owned(),
                    display_name: "OpenRouter OpenAI Standard".to_owned(),
                    vendor_code: Some("openai".to_owned()),
                    modality_code: None,
                    api_endpoint_code: None,
                    catalog_key: None,
                    model: None,
                    provider_native_model: None,
                    composition_mode: "all".to_owned(),
                    status: "active".to_owned(),
                    sort_order: Some(5),
                    members: vec![AdminAiResourceMemberItem {
                        parent_resource_code: "bundle.openrouter.openai.standard".to_owned(),
                        member_resource_code: "model.openai.gpt-4o-mini.chat".to_owned(),
                        member_role: "included".to_owned(),
                        required: true,
                        sort_order: Some(1),
                    }],
                },
            ])
        })
    }

    fn create_ai_resource<'a>(
        &'a self,
        command: CreateAdminAiResourceCommand,
    ) -> AdminAiResourceReadFuture<'a, AdminAiResourceItem> {
        Box::pin(async move {
            assert_eq!("entity-1", command.resource_uuid);
            assert_eq!("entity-2", command.member_uuids[0]);
            assert_eq!("entity-3", command.audit_log_uuid);
            assert_eq!("bundle.openrouter.openai.standard", command.resource_code);
            assert_eq!("OpenRouter OpenAI Standard", command.display_name);
            assert_eq!(Some("openai"), command.vendor_code.as_deref());
            assert_eq!("all", command.composition_mode);
            assert_eq!(Some(5), command.sort_order);
            assert_eq!(1, command.members.len());
            assert_eq!(
                "model.openai.gpt-4o-mini.chat",
                command.members[0].member_resource_code
            );
            assert_eq!("included", command.members[0].member_role);
            assert!(command.members[0].required);
            Ok(AdminAiResourceItem {
                id: 5,
                resource_code: command.resource_code,
                resource_type: command.resource_type,
                display_name: command.display_name,
                vendor_code: command.vendor_code,
                modality_code: command.modality_code,
                api_endpoint_code: command.api_endpoint_code,
                catalog_key: command.catalog_key,
                model: command.model,
                provider_native_model: command.provider_native_model,
                composition_mode: command.composition_mode,
                status: command.status,
                sort_order: command.sort_order,
                members: vec![AdminAiResourceMemberItem {
                    parent_resource_code: "bundle.openrouter.openai.standard".to_owned(),
                    member_resource_code: "model.openai.gpt-4o-mini.chat".to_owned(),
                    member_role: "included".to_owned(),
                    required: true,
                    sort_order: Some(1),
                }],
            })
        })
    }

    fn update_ai_resource<'a>(
        &'a self,
        command: UpdateAdminAiResourceCommand,
    ) -> AdminAiResourceReadFuture<'a, Option<AdminAiResourceItem>> {
        Box::pin(async move {
            assert_eq!(5, command.resource_id);
            assert_eq!("entity-4", command.audit_log_uuid);
            assert_eq!(
                Some("OpenRouter OpenAI Bundle"),
                command.display_name.as_deref()
            );
            assert_eq!(Some("disabled"), command.status.as_deref());
            assert_eq!(Some(0), command.members.as_ref().map(Vec::len));
            Ok(Some(AdminAiResourceItem {
                id: command.resource_id,
                resource_code: "bundle.openrouter.openai.standard".to_owned(),
                resource_type: "bundle".to_owned(),
                display_name: command.display_name.unwrap(),
                vendor_code: Some("openai".to_owned()),
                modality_code: None,
                api_endpoint_code: None,
                catalog_key: None,
                model: None,
                provider_native_model: None,
                composition_mode: "all".to_owned(),
                status: command.status.unwrap(),
                sort_order: Some(5),
                members: Vec::new(),
            }))
        })
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
