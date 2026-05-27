mod common;

use common::InternalTrustedSubjectHeaders;
use std::sync::{Arc, Mutex};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::ports::{
    AdminPromptBindingItem, AdminPromptCommandFuture, AdminPromptItem, AdminPromptStore,
    AdminPromptVersionItem, CreateAdminPromptBindingCommand, CreateAdminPromptCommand,
    CreateAdminPromptVersionCommand, ListAdminPromptBindingsQuery, ListAdminPromptVersionsQuery,
    ListAdminPromptsQuery, PublishAdminPromptVersionCommand, RenderAdminPromptVersionCommand,
    UpdateAdminPromptBindingCommand,
};
use serde_json::{json, Value};
use tower::ServiceExt;

#[tokio::test]
async fn admin_prompt_route_manages_prompts_versions_rendering_and_bindings() {
    let store = Arc::new(TestAdminPromptStore::default());
    let router = sdkwork_claw_product::api::admin_prompt_router_with_store(store.clone());

    let create_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/prompts")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{"promptKey":"system.general.assistant","name":"General Assistant","description":"Default system prompt","categoryId":"1001","promptType":"system","visibility":"system","tags":["general","assistant"]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, create_response.status());
    let create_payload = json_payload(create_response).await;
    assert_eq!("2000", create_payload["code"]);
    assert_eq!(
        "system.general.assistant",
        create_payload["data"]["item"]["promptKey"]
    );
    assert_eq!("1001", create_payload["data"]["item"]["categoryId"]);

    let version_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/prompts/1/versions")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{"versionNo":"1.0.0","title":"Initial release","content":"You are a {{tone}} assistant for {{language}} users.","variableSchema":{"tone":{"type":"string"},"language":{"type":"string"}},"outputSchema":{"type":"object"}}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, version_response.status());
    let version_payload = json_payload(version_response).await;
    assert_eq!("1.0.0", version_payload["data"]["item"]["versionNo"]);
    assert_eq!("draft", version_payload["data"]["item"]["lifecycleStatus"]);

    let publish_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/prompts/versions/1/publish")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, publish_response.status());
    let publish_payload = json_payload(publish_response).await;
    assert_eq!(
        "published",
        publish_payload["data"]["item"]["lifecycleStatus"]
    );

    let render_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/prompts/versions/1/render")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{"variables":{"tone":"professional","language":"Chinese"}}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, render_response.status());
    let render_payload = json_payload(render_response).await;
    assert_eq!(
        "You are a professional assistant for Chinese users.",
        render_payload["data"]["rendered"]
    );

    let create_binding_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/prompts/1/bindings")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{"promptVersionId":1,"ownerType":"agent","ownerId":100,"bindingRole":"system","priority":10,"enabled":true,"policyJson":{"maxCalls":4}}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, create_binding_response.status());
    let create_binding_payload = json_payload(create_binding_response).await;
    assert_eq!("agent", create_binding_payload["data"]["item"]["ownerType"]);
    assert_eq!(
        "system",
        create_binding_payload["data"]["item"]["bindingRole"]
    );
    assert_eq!(
        4,
        create_binding_payload["data"]["item"]["policyJson"]["maxCalls"]
    );

    let update_binding_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("PUT")
                .uri("/backend/v3/api/prompts/bindings/1")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{"bindingRole":"fallback","priority":20,"enabled":false,"policyJson":{"maxCalls":8}}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, update_binding_response.status());
    let update_binding_payload = json_payload(update_binding_response).await;
    assert_eq!(
        "fallback",
        update_binding_payload["data"]["item"]["bindingRole"]
    );
    assert_eq!(false, update_binding_payload["data"]["item"]["enabled"]);
    assert_eq!(
        8,
        update_binding_payload["data"]["item"]["policyJson"]["maxCalls"]
    );

    let list_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/backend/v3/api/prompts?page=1&page_size=50")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload = json_payload(list_response).await;
    assert_eq!(1, list_payload["data"]["items"].as_array().unwrap().len());

    let bindings_response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/backend/v3/api/prompts/1/bindings")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, bindings_response.status());
    let bindings_payload = json_payload(bindings_response).await;
    assert_eq!("agent", bindings_payload["data"]["items"][0]["ownerType"]);
}

#[derive(Default)]
struct TestAdminPromptStore {
    prompts: Mutex<Vec<AdminPromptItem>>,
    versions: Mutex<Vec<AdminPromptVersionItem>>,
    bindings: Mutex<Vec<AdminPromptBindingItem>>,
}

impl AdminPromptStore for TestAdminPromptStore {
    fn list_prompts<'a>(
        &'a self,
        _query: ListAdminPromptsQuery,
    ) -> AdminPromptCommandFuture<'a, Vec<AdminPromptItem>> {
        Box::pin(async move { Ok(self.prompts.lock().unwrap().clone()) })
    }

    fn create_prompt<'a>(
        &'a self,
        command: CreateAdminPromptCommand,
    ) -> AdminPromptCommandFuture<'a, AdminPromptItem> {
        Box::pin(async move {
            let item = AdminPromptItem {
                id: 1,
                uuid: "prompt-1".to_owned(),
                tenant_id: command.subject.tenant_id,
                organization_id: command.subject.organization_id,
                prompt_key: command.prompt_key,
                name: command.name,
                description: command.description,
                category_id: command.category_id,
                category_code: None,
                prompt_type: command.prompt_type,
                visibility: command.visibility,
                owner_user_id: Some(command.subject.operator_id),
                latest_version_id: None,
                published_version_id: None,
                status: "enabled".to_owned(),
                tags: command.tags,
                created_at: "2026-05-26 10:00:00".to_owned(),
                updated_at: "2026-05-26 10:00:00".to_owned(),
            };
            self.prompts.lock().unwrap().push(item.clone());
            Ok(item)
        })
    }

    fn list_versions<'a>(
        &'a self,
        _query: ListAdminPromptVersionsQuery,
    ) -> AdminPromptCommandFuture<'a, Vec<AdminPromptVersionItem>> {
        Box::pin(async move { Ok(self.versions.lock().unwrap().clone()) })
    }

    fn create_version<'a>(
        &'a self,
        command: CreateAdminPromptVersionCommand,
    ) -> AdminPromptCommandFuture<'a, AdminPromptVersionItem> {
        Box::pin(async move {
            let item = AdminPromptVersionItem {
                id: 1,
                uuid: "prompt-version-1".to_owned(),
                tenant_id: command.subject.tenant_id,
                organization_id: command.subject.organization_id,
                prompt_id: command.prompt_id,
                version_no: command.version_no,
                title: command.title,
                content: command.content,
                variable_schema: command.variable_schema,
                output_schema: command.output_schema,
                model_constraints: command.model_constraints,
                safety_policy: command.safety_policy,
                examples_json: command.examples_json,
                checksum_hash: "hash".to_owned(),
                lifecycle_status: "draft".to_owned(),
                review_status: "pending".to_owned(),
                review_comment: None,
                created_by: command.subject.operator_id,
                published_at: None,
                created_at: "2026-05-26 10:01:00".to_owned(),
                updated_at: "2026-05-26 10:01:00".to_owned(),
            };
            self.versions.lock().unwrap().push(item.clone());
            Ok(item)
        })
    }

    fn publish_version<'a>(
        &'a self,
        command: PublishAdminPromptVersionCommand,
    ) -> AdminPromptCommandFuture<'a, Option<AdminPromptVersionItem>> {
        Box::pin(async move {
            let mut versions = self.versions.lock().unwrap();
            let Some(item) = versions
                .iter_mut()
                .find(|item| item.id == command.version_id)
            else {
                return Ok(None);
            };
            item.lifecycle_status = "published".to_owned();
            item.published_at = Some("2026-05-26 10:02:00".to_owned());
            Ok(Some(item.clone()))
        })
    }

    fn render_version<'a>(
        &'a self,
        command: RenderAdminPromptVersionCommand,
    ) -> AdminPromptCommandFuture<'a, Option<String>> {
        Box::pin(async move {
            let versions = self.versions.lock().unwrap();
            let Some(item) = versions.iter().find(|item| item.id == command.version_id) else {
                return Ok(None);
            };
            let mut rendered = item.content.clone();
            if let Some(variables) = command.variables.as_object() {
                for (key, value) in variables {
                    if let Some(value) = value.as_str() {
                        rendered = rendered.replace(&format!("{{{{{key}}}}}"), value);
                    }
                }
            }
            Ok(Some(rendered))
        })
    }

    fn list_bindings<'a>(
        &'a self,
        query: ListAdminPromptBindingsQuery,
    ) -> AdminPromptCommandFuture<'a, Vec<AdminPromptBindingItem>> {
        Box::pin(async move {
            Ok(self
                .bindings
                .lock()
                .unwrap()
                .iter()
                .filter(|item| item.prompt_id == query.prompt_id)
                .cloned()
                .collect())
        })
    }

    fn create_binding<'a>(
        &'a self,
        command: CreateAdminPromptBindingCommand,
    ) -> AdminPromptCommandFuture<'a, AdminPromptBindingItem> {
        Box::pin(async move {
            let item = AdminPromptBindingItem {
                id: 1,
                uuid: "prompt-binding-1".to_owned(),
                tenant_id: command.subject.tenant_id,
                organization_id: command.subject.organization_id,
                prompt_id: command.prompt_id,
                prompt_version_id: command.prompt_version_id,
                owner_type: command.owner_type,
                owner_id: command.owner_id,
                binding_role: command.binding_role,
                priority: command.priority,
                enabled: command.enabled,
                policy_json: command.policy_json,
                snapshot_json: json!({ "source": "api-test" }),
                created_at: "2026-05-26 10:03:00".to_owned(),
                updated_at: "2026-05-26 10:03:00".to_owned(),
            };
            self.bindings.lock().unwrap().push(item.clone());
            Ok(item)
        })
    }

    fn update_binding<'a>(
        &'a self,
        command: UpdateAdminPromptBindingCommand,
    ) -> AdminPromptCommandFuture<'a, Option<AdminPromptBindingItem>> {
        Box::pin(async move {
            let mut bindings = self.bindings.lock().unwrap();
            let Some(item) = bindings
                .iter_mut()
                .find(|item| item.id == command.binding_id)
            else {
                return Ok(None);
            };
            if let Some(prompt_version_id) = command.prompt_version_id {
                item.prompt_version_id = prompt_version_id;
            }
            if let Some(owner_type) = command.owner_type {
                item.owner_type = owner_type;
            }
            if let Some(owner_id) = command.owner_id {
                item.owner_id = owner_id;
            }
            if let Some(binding_role) = command.binding_role {
                item.binding_role = binding_role;
            }
            if let Some(priority) = command.priority {
                item.priority = priority;
            }
            if let Some(enabled) = command.enabled {
                item.enabled = enabled;
            }
            if let Some(policy_json) = command.policy_json {
                item.policy_json = policy_json;
            }
            item.updated_at = "2026-05-26 10:04:00".to_owned();
            Ok(Some(item.clone()))
        })
    }
}

async fn json_payload(response: axum::response::Response) -> Value {
    let bytes = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&bytes).unwrap()
}
