use std::sync::{Arc, Mutex};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::application::EntityUuidGenerator;
use sdkwork_claw_product::domain::DomainResult;
use sdkwork_claw_product::ports::{
    AppMemoryEntryItem, AppMemoryEntryList, AppMemoryFuture, AppMemorySpaceItem,
    AppMemorySpaceList, AppMemoryStore, AppMemorySubject, CreateAppMemoryEntryCommand,
    CreateAppMemorySpaceCommand,
};
use serde_json::Value;
use tower::ServiceExt;

#[tokio::test]
async fn app_memory_create_space_uses_product_memory_namespace_and_store_contract() {
    let store = Arc::new(TestAppMemoryStore::default());
    let router = sdkwork_claw_product::api::app_memory_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(vec!["memory-space-uuid-1"])),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/memory/spaces")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{
                      "title":"Project coding memory",
                      "spaceType":"project",
                      "ownerType":"agent",
                      "ownerId":"agent-1",
                      "memoryEnabled":true,
                      "autoExtractEnabled":true,
                      "autoRecallEnabled":true,
                      "reviewRequired":false,
                      "maxInjectedTokens":4096,
                      "retentionPolicy":{"ttlDays":365},
                      "sensitivityPolicy":{"level":"standard"}
                    }"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("memory-space-1", payload["data"]["item"]["id"]);
    assert_eq!("Project coding memory", payload["data"]["item"]["title"]);
    assert_eq!("project", payload["data"]["item"]["spaceType"]);

    let commands = store.create_space_commands.lock().unwrap();
    assert_eq!(1, commands.len());
    assert_eq!(10, commands[0].subject.tenant_id);
    assert_eq!(20, commands[0].subject.organization_id);
    assert_eq!(30, commands[0].subject.user_id);
    assert_eq!("memory-space-uuid-1", commands[0].space_uuid);
    assert_eq!("Project coding memory", commands[0].title);
    assert_eq!("project", commands[0].space_type);
    assert_eq!("agent", commands[0].owner_type.as_deref().unwrap());
    assert_eq!("agent-1", commands[0].owner_id.as_deref().unwrap());
    assert!(commands[0].memory_enabled);
    assert!(commands[0].auto_extract_enabled);
    assert!(commands[0].auto_recall_enabled);
    assert!(!commands[0].review_required);
    assert_eq!(4096, commands[0].max_injected_tokens.unwrap());
}

#[tokio::test]
async fn app_memory_create_entry_links_to_space_and_source_context() {
    let store = Arc::new(TestAppMemoryStore::default());
    let router = sdkwork_claw_product::api::app_memory_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(vec![
            "memory-entry-uuid-1",
            "memory-event-uuid-1",
        ])),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/memory/spaces/memory-space-1/entries")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{
                      "memoryType":"preference",
                      "subjectType":"user",
                      "subjectKey":"user-30",
                      "content":"Prefers concise implementation plans and direct verification evidence.",
                      "sourceKind":"chat",
                      "sourceConversationId":"chat-conversation-1",
                      "sourceTurnId":"chat-turn-1",
                      "importanceScore":"0.9000",
                      "confidenceScore":"0.9500",
                      "sensitivityLevel":"standard",
                      "trustLevel":"observed",
                      "status":"active",
                      "metadata":{"origin":"manual"}
                    }"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("memory-entry-1", payload["data"]["item"]["id"]);
    assert_eq!("memory-space-1", payload["data"]["item"]["spaceId"]);
    assert_eq!("preference", payload["data"]["item"]["memoryType"]);

    let commands = store.create_entry_commands.lock().unwrap();
    assert_eq!(1, commands.len());
    assert_eq!("memory-space-1", commands[0].space_id);
    assert_eq!("memory-entry-uuid-1", commands[0].entry_uuid);
    assert_eq!("memory-event-uuid-1", commands[0].event_uuid);
    assert_eq!("preference", commands[0].memory_type);
    assert_eq!(
        "Prefers concise implementation plans and direct verification evidence.",
        commands[0].content_text
    );
    assert_eq!("chat", commands[0].source_kind);
    assert_eq!(
        "chat-conversation-1",
        commands[0].source_conversation_id.as_deref().unwrap()
    );
    assert_eq!(
        "chat-turn-1",
        commands[0].source_turn_id.as_deref().unwrap()
    );
}

#[tokio::test]
async fn app_memory_lists_spaces_and_entries_for_trusted_subject() {
    let store = Arc::new(TestAppMemoryStore::default());
    let router = sdkwork_claw_product::api::app_memory_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(Vec::new())),
    );

    let response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/memory/spaces?page=1&pageSize=20")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("memory-space-1", payload["data"]["items"][0]["id"]);

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/memory/spaces/memory-space-1/entries")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("memory-entry-1", payload["data"]["items"][0]["id"]);

    let subjects = store.list_space_subjects.lock().unwrap();
    assert_eq!(
        vec![AppMemorySubject {
            tenant_id: 10,
            organization_id: 20,
            user_id: 30
        }],
        *subjects
    );
}

#[tokio::test]
async fn app_memory_does_not_expose_playground_backend_namespace() {
    let router = sdkwork_claw_product::api::app_memory_router_with_store(
        Arc::new(TestAppMemoryStore::default()),
        Arc::new(SequentialUuidGenerator::new(Vec::new())),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/playground/memory/spaces")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from("{}"))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::NOT_FOUND, response.status());
}

#[derive(Default)]
struct TestAppMemoryStore {
    create_space_commands: Mutex<Vec<CreateAppMemorySpaceCommand>>,
    create_entry_commands: Mutex<Vec<CreateAppMemoryEntryCommand>>,
    list_space_subjects: Mutex<Vec<AppMemorySubject>>,
}

impl AppMemoryStore for TestAppMemoryStore {
    fn list_spaces<'a>(
        &'a self,
        subject: AppMemorySubject,
        _page: i64,
        _page_size: i64,
    ) -> AppMemoryFuture<'a, AppMemorySpaceList> {
        Box::pin(async move {
            self.list_space_subjects.lock().unwrap().push(subject);
            Ok(AppMemorySpaceList {
                items: vec![sample_space()],
            })
        })
    }

    fn get_space<'a>(
        &'a self,
        _subject: AppMemorySubject,
        _space_id: String,
    ) -> AppMemoryFuture<'a, Option<AppMemorySpaceItem>> {
        Box::pin(async { Ok(Some(sample_space())) })
    }

    fn create_space<'a>(
        &'a self,
        command: CreateAppMemorySpaceCommand,
    ) -> AppMemoryFuture<'a, AppMemorySpaceItem> {
        Box::pin(async move {
            self.create_space_commands.lock().unwrap().push(command);
            Ok(sample_space())
        })
    }

    fn list_entries<'a>(
        &'a self,
        _subject: AppMemorySubject,
        _space_id: String,
        _page: i64,
        _page_size: i64,
    ) -> AppMemoryFuture<'a, AppMemoryEntryList> {
        Box::pin(async {
            Ok(AppMemoryEntryList {
                items: vec![sample_entry()],
            })
        })
    }

    fn get_entry<'a>(
        &'a self,
        _subject: AppMemorySubject,
        _entry_id: String,
    ) -> AppMemoryFuture<'a, Option<AppMemoryEntryItem>> {
        Box::pin(async { Ok(Some(sample_entry())) })
    }

    fn create_entry<'a>(
        &'a self,
        command: CreateAppMemoryEntryCommand,
    ) -> AppMemoryFuture<'a, AppMemoryEntryItem> {
        Box::pin(async move {
            self.create_entry_commands.lock().unwrap().push(command);
            Ok(sample_entry())
        })
    }
}

fn sample_space() -> AppMemorySpaceItem {
    AppMemorySpaceItem {
        id: "memory-space-1".to_owned(),
        space_type: "project".to_owned(),
        owner_type: Some("agent".to_owned()),
        owner_id: Some("agent-1".to_owned()),
        title: "Project coding memory".to_owned(),
        status: "active".to_owned(),
        memory_enabled: true,
        auto_extract_enabled: true,
        auto_recall_enabled: true,
        review_required: false,
        max_injected_tokens: Some(4096),
        entry_count: 1,
        created_at: "2026-05-18T00:00:00Z".to_owned(),
        updated_at: "2026-05-18T00:00:00Z".to_owned(),
    }
}

fn sample_entry() -> AppMemoryEntryItem {
    AppMemoryEntryItem {
        id: "memory-entry-1".to_owned(),
        space_id: "memory-space-1".to_owned(),
        memory_type: "preference".to_owned(),
        subject_type: Some("user".to_owned()),
        subject_key: Some("user-30".to_owned()),
        content: "Prefers concise implementation plans and direct verification evidence."
            .to_owned(),
        source_kind: "chat".to_owned(),
        source_conversation_id: Some("chat-conversation-1".to_owned()),
        source_turn_id: Some("chat-turn-1".to_owned()),
        source_item_id: None,
        source_invocation_id: None,
        importance_score: Some("0.9000".to_owned()),
        confidence_score: Some("0.9500".to_owned()),
        sensitivity_level: "standard".to_owned(),
        trust_level: "observed".to_owned(),
        status: "active".to_owned(),
        recall_count: 0,
        created_at: "2026-05-18T00:00:00Z".to_owned(),
        updated_at: "2026-05-18T00:00:00Z".to_owned(),
    }
}

async fn response_json(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

#[derive(Debug)]
struct SequentialUuidGenerator {
    values: Mutex<Vec<String>>,
}

impl SequentialUuidGenerator {
    fn new(values: Vec<&str>) -> Self {
        Self {
            values: Mutex::new(values.into_iter().rev().map(str::to_owned).collect()),
        }
    }
}

impl EntityUuidGenerator for SequentialUuidGenerator {
    fn generate_entity_uuid(&self) -> DomainResult<String> {
        Ok(self
            .values
            .lock()
            .unwrap()
            .pop()
            .unwrap_or_else(|| "generated-uuid".to_owned()))
    }
}
