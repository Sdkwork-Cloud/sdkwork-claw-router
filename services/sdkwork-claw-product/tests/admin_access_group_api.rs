mod common;
use common::InternalTrustedSubjectHeaders;
use std::sync::{Arc, Mutex};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::application::EntityUuidGenerator;
use sdkwork_claw_product::domain::DomainResult;
use sdkwork_claw_product::ports::{
    AdminAccessGroupChannelBindingItem, AdminAccessGroupCommandFuture, AdminAccessGroupItem,
    AdminAccessGroupStore, CreateAdminAccessGroupCommand, DeleteAdminAccessGroupCommand,
    ListAdminAccessGroupChannelBindingsQuery, ListAdminAccessGroupsQuery,
    ReplaceAdminAccessGroupChannelBindingsCommand, UpdateAdminAccessGroupCommand,
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
                .uri("/backend/v3/api/router/access_groups")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
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
                .uri("/backend/v3/api/router/access_groups/1")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
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
                .uri("/backend/v3/api/router/access_groups")
                .internal_trusted_subject(10, 20, 30)
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
                .uri("/backend/v3/api/router/access_groups/1")
                .internal_trusted_subject(10, 20, 30)
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
                .uri("/backend/v3/api/router/access_groups")
                .internal_trusted_subject(10, 20, 30)
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
async fn admin_access_group_route_lists_and_replaces_channel_bindings() {
    let store = Arc::new(TestAccessGroupStore::with_bindings(vec![
        channel_binding_item(1, 10, 3001, "OpenAI primary", "openai", 10, 80, "active"),
        channel_binding_item(
            2,
            10,
            3002,
            "OpenRouter backup",
            "openrouter",
            20,
            30,
            "active",
        ),
        channel_binding_item(3, 11, 3001, "OpenAI primary", "openai", 10, 50, "active"),
    ]));
    let router = sdkwork_claw_product::api::admin_access_group_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let list_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/backend/v3/api/router/access_groups/10/channel_bindings")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload = json_payload(list_response).await;
    assert_eq!("2000", list_payload["code"]);
    assert_eq!(2, list_payload["data"]["items"].as_array().unwrap().len());
    assert_eq!("3001", list_payload["data"]["items"][0]["channelId"]);
    assert_eq!(
        "OpenAI primary",
        list_payload["data"]["items"][0]["channelName"]
    );
    assert_eq!("openai", list_payload["data"]["items"][0]["providerCode"]);
    assert_eq!(80, list_payload["data"]["items"][0]["weight"]);
    assert!(list_payload["data"]["items"][0].get("secretRef").is_none());

    let replace_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("PUT")
                .uri("/backend/v3/api/router/access_groups/10/channel_bindings")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{"items":[{"channelId":"3001","priority":5,"weight":100,"status":"active","modelScope":["openai/global/gpt-4o-mini"],"capabilities":["llm"]},{"channelId":"3003","priority":30,"weight":20,"status":"disabled"}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, replace_response.status());
    let replace_payload = json_payload(replace_response).await;
    assert_eq!("2000", replace_payload["code"]);
    assert_eq!(
        2,
        replace_payload["data"]["items"].as_array().unwrap().len()
    );
    assert_eq!("3001", replace_payload["data"]["items"][0]["channelId"]);
    assert_eq!(5, replace_payload["data"]["items"][0]["priority"]);
    assert_eq!(100, replace_payload["data"]["items"][0]["weight"]);
    assert_eq!(
        "openai/global/gpt-4o-mini",
        replace_payload["data"]["items"][0]["modelScope"][0]
    );
    assert_eq!(
        "llm",
        replace_payload["data"]["items"][0]["capabilities"][0]
    );

    let final_list_response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/backend/v3/api/router/access_groups/11/channel_bindings")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    let final_payload = json_payload(final_list_response).await;
    assert_eq!(
        "3001", final_payload["data"]["items"][0]["channelId"],
        "a channel account can remain bound to another group"
    );

    let commands = store.commands.lock().unwrap();
    assert_eq!(vec!["replace_channel_bindings"], *commands);
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
                .uri("/backend/v3/api/router/access_groups")
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
                .uri("/backend/v3/api/router/access_groups")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
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
    bindings: Mutex<Vec<AdminAccessGroupChannelBindingItem>>,
    commands: Mutex<Vec<&'static str>>,
}

impl TestAccessGroupStore {
    fn with_bindings(bindings: Vec<AdminAccessGroupChannelBindingItem>) -> Self {
        Self {
            bindings: Mutex::new(bindings),
            ..Self::default()
        }
    }
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

    fn list_channel_bindings<'a>(
        &'a self,
        query: ListAdminAccessGroupChannelBindingsQuery,
    ) -> AdminAccessGroupCommandFuture<'a, Vec<AdminAccessGroupChannelBindingItem>> {
        Box::pin(async move {
            Ok(self
                .bindings
                .lock()
                .unwrap()
                .iter()
                .filter(|item| {
                    item.tenant_id == query.subject.tenant_id
                        && item.organization_id == query.subject.organization_id
                        && item.group_id == query.group_id
                        && item.deleted_at.is_none()
                })
                .cloned()
                .collect())
        })
    }

    fn replace_channel_bindings<'a>(
        &'a self,
        command: ReplaceAdminAccessGroupChannelBindingsCommand,
    ) -> AdminAccessGroupCommandFuture<'a, Vec<AdminAccessGroupChannelBindingItem>> {
        Box::pin(async move {
            self.commands
                .lock()
                .unwrap()
                .push("replace_channel_bindings");
            let mut bindings = self.bindings.lock().unwrap();
            for item in bindings.iter_mut().filter(|item| {
                item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.group_id == command.group_id
                    && item.deleted_at.is_none()
            }) {
                item.deleted_at = Some(command.requested_at.clone());
            }
            for (index, input) in command.items.into_iter().enumerate() {
                let mut item = channel_binding_item(
                    100 + index as i64,
                    command.group_id,
                    input.channel_id,
                    match input.channel_id {
                        3001 => "OpenAI primary",
                        3003 => "Gemini fallback",
                        _ => "Provider channel",
                    },
                    match input.channel_id {
                        3001 => "openai",
                        3003 => "google",
                        _ => "custom",
                    },
                    input.priority,
                    input.weight,
                    &input.status,
                );
                item.model_scope = input.model_scope;
                item.capabilities = input.capabilities;
                bindings.push(item);
            }
            Ok(bindings
                .iter()
                .filter(|item| {
                    item.tenant_id == command.subject.tenant_id
                        && item.organization_id == command.subject.organization_id
                        && item.group_id == command.group_id
                        && item.deleted_at.is_none()
                })
                .cloned()
                .collect())
        })
    }
}

fn channel_binding_item(
    id: i64,
    group_id: i64,
    channel_id: i64,
    channel_name: &str,
    provider_code: &str,
    priority: i64,
    weight: i64,
    status: &str,
) -> AdminAccessGroupChannelBindingItem {
    AdminAccessGroupChannelBindingItem {
        id,
        uuid: format!("binding-{id}"),
        tenant_id: 10,
        organization_id: 20,
        group_id,
        channel_id,
        channel_name: channel_name.to_owned(),
        provider_code: provider_code.to_owned(),
        provider_name: provider_code.to_owned(),
        channel_code: format!("{provider_code}-{channel_id}"),
        models: Vec::new(),
        capabilities: Vec::new(),
        model_scope: Vec::new(),
        priority,
        weight,
        status: status.to_owned(),
        health_status: "active".to_owned(),
        deleted_at: None,
    }
}

struct TestUuidGenerator;

impl EntityUuidGenerator for TestUuidGenerator {
    fn generate_entity_uuid(&self) -> DomainResult<String> {
        Ok("test-uuid".to_owned())
    }
}
