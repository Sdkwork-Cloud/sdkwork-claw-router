use std::sync::{Arc, Mutex};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::application::EntityUuidGenerator;
use sdkwork_claw_product::domain::DomainResult;
use sdkwork_claw_product::ports::{
    AdminAccessGroupCommandFuture, AdminAccessGroupItem, AdminAccessGroupStore,
    CreateAdminAccessGroupCommand, DeleteAdminAccessGroupCommand, ListAdminAccessGroupsQuery,
    UpdateAdminAccessGroupCommand,
};
use serde_json::Value;
use tower::ServiceExt;

#[tokio::test]
async fn admin_access_group_route_creates_lists_updates_and_soft_deletes_groups() {
    let store = Arc::new(TestAccessGroupStore::default());
    let router = sdkwork_claw_product::api::admin_access_group_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );
    let expected_create_name = format!("{} standard", "\u{4e2d}\u{6587}");

    let create_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/router/access-groups")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"name":"\u4e2d\u6587 standard","platform":"OpenAI","billingType":"standard","rateMultiplier":1.25,"type":"dedicated","capacity":{"total":500},"status":"active"}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, create_response.status());
    let create_payload = json_payload(create_response).await;
    assert_eq!("2000", create_payload["code"]);
    assert_eq!(
        expected_create_name,
        create_payload["data"]["item"]["name"].as_str().unwrap()
    );
    assert_eq!("openai", create_payload["data"]["item"]["platform"]);
    assert_eq!("standard", create_payload["data"]["item"]["billingType"]);
    assert_eq!(1.25, create_payload["data"]["item"]["rateMultiplier"]);
    assert_eq!("dedicated", create_payload["data"]["item"]["type"]);
    assert_eq!(500.0, create_payload["data"]["item"]["capacity"]["total"]);
    assert_eq!("active", create_payload["data"]["item"]["status"]);

    let update_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("PATCH")
                .uri("/backend/v3/api/router/access-groups/1")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"name":"OpenAI enterprise","rateMultiplier":1.5,"capacity":{"total":750},"status":"disabled"}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, update_response.status());
    let update_payload = json_payload(update_response).await;
    assert_eq!("OpenAI enterprise", update_payload["data"]["item"]["name"]);
    assert_eq!(1.5, update_payload["data"]["item"]["rateMultiplier"]);
    assert_eq!(750.0, update_payload["data"]["item"]["capacity"]["total"]);
    assert_eq!("disabled", update_payload["data"]["item"]["status"]);

    let list_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/backend/v3/api/router/access-groups")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload = json_payload(list_response).await;
    assert_eq!(1, list_payload["data"]["items"].as_array().unwrap().len());
    assert_eq!("disabled", list_payload["data"]["items"][0]["status"]);

    let delete_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("DELETE")
                .uri("/backend/v3/api/router/access-groups/1")
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
                .method("GET")
                .uri("/backend/v3/api/router/access-groups")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    let final_payload = json_payload(final_list_response).await;
    assert_eq!(0, final_payload["data"]["items"].as_array().unwrap().len());

    let commands = store.commands.lock().unwrap();
    assert_eq!(vec!["create", "update", "delete"], *commands);
}

#[tokio::test]
async fn admin_access_group_route_rejects_missing_trusted_subject() {
    let router = sdkwork_claw_product::api::admin_access_group_router_with_store(
        Arc::new(TestAccessGroupStore::default()),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/backend/v3/api/router/access-groups")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
    let payload = json_payload(response).await;
    assert_eq!("4010", payload["code"]);
}

#[tokio::test]
async fn admin_access_group_route_rejects_invalid_multiplier_without_calling_store() {
    let store = Arc::new(TestAccessGroupStore::default());
    let router = sdkwork_claw_product::api::admin_access_group_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/router/access-groups")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"name":"Invalid","platform":"OpenAI","rateMultiplier":0}"#,
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
        .contains("rateMultiplier must be between"));
    assert!(store.commands.lock().unwrap().is_empty());
}

async fn json_payload(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

#[derive(Default)]
struct TestAccessGroupStore {
    items: Mutex<Vec<AdminAccessGroupItem>>,
    commands: Mutex<Vec<&'static str>>,
}

impl AdminAccessGroupStore for TestAccessGroupStore {
    fn list_access_groups<'a>(
        &'a self,
        query: ListAdminAccessGroupsQuery,
    ) -> AdminAccessGroupCommandFuture<'a, Vec<AdminAccessGroupItem>> {
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

    fn create_access_group<'a>(
        &'a self,
        command: CreateAdminAccessGroupCommand,
    ) -> AdminAccessGroupCommandFuture<'a, AdminAccessGroupItem> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("create");
            let item = AdminAccessGroupItem {
                id: 1,
                uuid: command.group_uuid,
                tenant_id: command.subject.tenant_id,
                organization_id: command.subject.organization_id,
                name: command.name,
                platform: command.platform,
                billing_type: command.billing_type,
                rate_multiplier: command.rate_multiplier,
                group_type: command.group_type,
                account_available: 0,
                account_total: 0,
                capacity_used: 0.0,
                capacity_total: command.capacity_total,
                usage_today: 0.0,
                usage_total: 0.0,
                status: command.status,
                deleted_at: None,
            };
            self.items.lock().unwrap().push(item.clone());
            Ok(item)
        })
    }

    fn update_access_group<'a>(
        &'a self,
        command: UpdateAdminAccessGroupCommand,
    ) -> AdminAccessGroupCommandFuture<'a, Option<AdminAccessGroupItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("update");
            let mut items = self.items.lock().unwrap();
            let Some(item) = items.iter_mut().find(|item| {
                item.id == command.group_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.deleted_at.is_none()
            }) else {
                return Ok(None);
            };
            if let Some(name) = command.name {
                item.name = name;
            }
            if let Some(platform) = command.platform {
                item.platform = platform;
            }
            if let Some(billing_type) = command.billing_type {
                item.billing_type = billing_type;
            }
            if let Some(rate_multiplier) = command.rate_multiplier {
                item.rate_multiplier = rate_multiplier;
            }
            if let Some(group_type) = command.group_type {
                item.group_type = group_type;
            }
            if let Some(capacity_total) = command.capacity_total {
                item.capacity_total = capacity_total;
            }
            if let Some(status) = command.status {
                item.status = status;
            }
            Ok(Some(item.clone()))
        })
    }

    fn delete_access_group<'a>(
        &'a self,
        command: DeleteAdminAccessGroupCommand,
    ) -> AdminAccessGroupCommandFuture<'a, bool> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("delete");
            let mut items = self.items.lock().unwrap();
            let Some(item) = items.iter_mut().find(|item| {
                item.id == command.group_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.deleted_at.is_none()
            }) else {
                return Ok(false);
            };
            item.status = "deleted".to_owned();
            item.deleted_at = Some(command.requested_at);
            Ok(true)
        })
    }
}

struct TestUuidGenerator;

impl EntityUuidGenerator for TestUuidGenerator {
    fn generate_entity_uuid(&self) -> DomainResult<String> {
        Ok("test-uuid".to_owned())
    }
}
