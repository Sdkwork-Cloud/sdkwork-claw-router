use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::api::{app_skills_router_with_read_store, app_skills_router_with_store};
use sdkwork_claw_product::application::EntityUuidGenerator;
use sdkwork_claw_product::domain::DomainResult;
use sdkwork_claw_product::ports::{
    AppInstalledSkillItem, AppSkillItem, AppSkillPackageItem, AppSkillsCommandFuture,
    AppSkillsCommandStore, AppSkillsQuery, AppSkillsReadFuture, AppSkillsReadStore,
    AppSkillsSubject, EnableAppSkillCommand, SetAppSkillEnabledCommand,
    UpdateAppSkillConfigCommand,
};
use serde_json::Value;
use tower::ServiceExt;

#[tokio::test]
async fn app_skills_catalog_route_returns_sdk_contract_items() {
    let router = app_skills_router_with_read_store(Arc::new(FixedAppSkillsReadStore));

    let response = router
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/ecosystem/skills?search_query=router&page=1&page_size=20")
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
    assert_eq!("SUCCESS", payload["message"]);
    assert_eq!(1, payload["data"]["items"].as_array().unwrap().len());
    assert_eq!("routing-skill", payload["data"]["items"][0]["id"]);
    assert_eq!("Routing Skill", payload["data"]["items"][0]["name"]);
    assert_eq!("SDKWork", payload["data"]["items"][0]["developer"]);
    assert_eq!("Routing", payload["data"]["items"][0]["category"]);
    assert_eq!("MIT", payload["data"]["items"][0]["license"]);
    assert_eq!(4.9, payload["data"]["items"][0]["rating"]);
    assert_eq!("8.4K", payload["data"]["items"][0]["downloads"]);
    assert_eq!(
        "clawhub.io/sdkwork/routing:v1.0.0",
        payload["data"]["items"][0]["clawhubImage"]
    );
    assert_eq!("Rust", payload["data"]["items"][0]["frameworks"][0]);
    assert_eq!(
        "clawhub.io/sdkwork/routing:v1.0.0",
        payload["data"]["items"][0]["packages"][0]["artifactRef"]
    );
}

#[tokio::test]
async fn app_skills_detail_route_returns_direct_item_data() {
    let router = app_skills_router_with_read_store(Arc::new(FixedAppSkillsReadStore));

    let response = router
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/ecosystem/skills/routing-skill")
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
    assert_eq!("routing-skill", payload["data"]["id"]);
    assert_eq!("Routing Skill", payload["data"]["name"]);
    assert!(
        payload["data"]["items"].is_null(),
        "detail data must be the direct SDK SkillDetailResponse object"
    );
}

#[tokio::test]
async fn app_skills_categories_route_returns_string_items() {
    let router = app_skills_router_with_read_store(Arc::new(FixedAppSkillsReadStore));

    let response = router
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/ecosystem/skills/categories")
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
    assert_eq!("Routing", payload["data"]["items"][0]);
    assert_eq!("Automation", payload["data"]["items"][1]);
}

#[tokio::test]
async fn app_skills_my_route_returns_user_installations() {
    let router = app_skills_router_with_store(
        Arc::new(FixedAppSkillsReadStore),
        Arc::new(FixedAppSkillsCommandStore),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/ecosystem/skills/mine")
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
    assert_eq!("install-routing-skill", payload["data"]["items"][0]["id"]);
    assert_eq!("routing-skill", payload["data"]["items"][0]["skillId"]);
    assert_eq!(true, payload["data"]["items"][0]["enabled"]);
    assert_eq!("strict", payload["data"]["items"][0]["config"]["mode"]);
    assert_eq!(
        "Routing Skill", payload["data"]["items"][0]["skill"]["name"],
        "installed skill item must embed the same public skill DTO used by the catalog"
    );
}

#[tokio::test]
async fn app_skills_enable_route_installs_or_reenables_skill() {
    let router = app_skills_router_with_store(
        Arc::new(FixedAppSkillsReadStore),
        Arc::new(FixedAppSkillsCommandStore),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/ecosystem/skills/routing-skill/enable")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"config":{"mode":"strict"}}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;

    assert_eq!("2000", payload["code"]);
    assert_eq!("routing-skill", payload["data"]["item"]["skillId"]);
    assert_eq!(true, payload["data"]["item"]["enabled"]);
    assert_eq!("strict", payload["data"]["item"]["config"]["mode"]);
}

#[tokio::test]
async fn app_skills_disable_route_disables_existing_installation() {
    let router = app_skills_router_with_store(
        Arc::new(FixedAppSkillsReadStore),
        Arc::new(FixedAppSkillsCommandStore),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/ecosystem/skills/routing-skill/disable")
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
    assert_eq!("routing-skill", payload["data"]["item"]["skillId"]);
    assert_eq!(false, payload["data"]["item"]["enabled"]);
}

#[tokio::test]
async fn app_skills_config_route_rejects_non_object_config() {
    let router = app_skills_router_with_store(
        Arc::new(FixedAppSkillsReadStore),
        Arc::new(FixedAppSkillsCommandStore),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("PUT")
                .uri("/app/v3/api/ecosystem/skills/routing-skill/config")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"config":["invalid"]}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = response_json(response).await;
    assert_eq!("4001", payload["code"]);
}

#[tokio::test]
async fn app_skills_config_route_rejects_reserved_portal_metadata() {
    let router = app_skills_router_with_store(
        Arc::new(FixedAppSkillsReadStore),
        Arc::new(FixedAppSkillsCommandStore),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/ecosystem/skills/routing-skill/enable")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"config":{"portal":{"features":["bad"]}}}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = response_json(response).await;
    assert_eq!("4001", payload["code"]);
    assert!(payload["message"]
        .as_str()
        .unwrap()
        .contains("reserved portal metadata"));
}

#[tokio::test]
async fn app_skills_config_route_rejects_reserved_portal_metadata_inside_arrays() {
    let router = app_skills_router_with_store(
        Arc::new(FixedAppSkillsReadStore),
        Arc::new(FixedAppSkillsCommandStore),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("PUT")
                .uri("/app/v3/api/ecosystem/skills/routing-skill/config")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"config":{"rules":[{"portal":{"features":["bad"]}}]}}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = response_json(response).await;
    assert_eq!("4001", payload["code"]);
    assert!(payload["message"]
        .as_str()
        .unwrap()
        .contains("reserved portal metadata"));
}

#[tokio::test]
async fn app_skills_config_route_updates_existing_installation_config() {
    let router = app_skills_router_with_store(
        Arc::new(FixedAppSkillsReadStore),
        Arc::new(FixedAppSkillsCommandStore),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("PUT")
                .uri("/app/v3/api/ecosystem/skills/routing-skill/config")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"config":{"mode":"balanced"}}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;

    assert_eq!("routing-skill", payload["data"]["item"]["skillId"]);
    assert_eq!("balanced", payload["data"]["item"]["config"]["mode"]);
}

#[tokio::test]
async fn app_skills_detail_route_reports_missing_skill_as_not_found() {
    let router = app_skills_router_with_read_store(Arc::new(FixedAppSkillsReadStore));

    let response = router
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/ecosystem/skills/missing-skill")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::NOT_FOUND, response.status());
    let payload = response_json(response).await;
    assert_eq!("4004", payload["code"]);
}

async fn response_json(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

struct FixedAppSkillsReadStore;

impl AppSkillsReadStore for FixedAppSkillsReadStore {
    fn load_skills<'a>(
        &'a self,
        _query: AppSkillsQuery,
        _subject: Option<AppSkillsSubject>,
    ) -> AppSkillsReadFuture<'a, Vec<AppSkillItem>> {
        async_result(vec![skill_item()])
    }

    fn load_skill_by_id<'a>(
        &'a self,
        skill_id: String,
        _subject: Option<AppSkillsSubject>,
    ) -> AppSkillsReadFuture<'a, Option<AppSkillItem>> {
        async_result(if skill_id == "routing-skill" {
            Some(skill_item())
        } else {
            None
        })
    }

    fn load_categories<'a>(
        &'a self,
        _subject: Option<AppSkillsSubject>,
    ) -> AppSkillsReadFuture<'a, Vec<String>> {
        async_result(vec!["Routing".to_owned(), "Automation".to_owned()])
    }

    fn load_user_skills<'a>(
        &'a self,
        _subject: Option<AppSkillsSubject>,
    ) -> AppSkillsReadFuture<'a, Vec<AppInstalledSkillItem>> {
        async_result(vec![installed_skill_item(true, "strict")])
    }
}

struct FixedAppSkillsCommandStore;

impl AppSkillsCommandStore for FixedAppSkillsCommandStore {
    fn enable_skill<'a>(
        &'a self,
        command: EnableAppSkillCommand,
    ) -> AppSkillsCommandFuture<'a, AppInstalledSkillItem> {
        let mode = command
            .config
            .as_ref()
            .and_then(|config| config.get("mode"))
            .and_then(Value::as_str)
            .unwrap_or("strict")
            .to_owned();
        async_result(installed_skill_item(true, &mode))
    }

    fn set_skill_enabled<'a>(
        &'a self,
        command: SetAppSkillEnabledCommand,
    ) -> AppSkillsCommandFuture<'a, AppInstalledSkillItem> {
        async_result(installed_skill_item(command.enabled, "strict"))
    }

    fn update_skill_config<'a>(
        &'a self,
        command: UpdateAppSkillConfigCommand,
    ) -> AppSkillsCommandFuture<'a, AppInstalledSkillItem> {
        let mode = command
            .config
            .get("mode")
            .and_then(Value::as_str)
            .unwrap_or("balanced")
            .to_owned();
        async_result(installed_skill_item(true, &mode))
    }
}

fn async_result<'a, T: Send + 'a>(
    value: T,
) -> Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>> {
    Box::pin(async move { Ok(value) })
}

fn skill_item() -> AppSkillItem {
    AppSkillItem {
        id: "routing-skill".to_owned(),
        name: "Routing Skill".to_owned(),
        developer: "SDKWork".to_owned(),
        description: "Route requests intelligently".to_owned(),
        category: "Routing".to_owned(),
        image: "https://cdn.example.test/skill-cover.png".to_owned(),
        rating: 4.9,
        downloads: "8.4K".to_owned(),
        features: vec!["Policy routing".to_owned()],
        last_updated: "2026-05-01".to_owned(),
        clawhub_image: "clawhub.io/sdkwork/routing:v1.0.0".to_owned(),
        version: "1.0.0".to_owned(),
        size: "42 MB".to_owned(),
        license: "MIT".to_owned(),
        frameworks: vec!["Rust".to_owned()],
        screenshots: vec!["https://cdn.example.test/skill-screen.png".to_owned()],
        packages: vec![AppSkillPackageItem {
            id: "pkg-routing-1".to_owned(),
            version: "1.0.0".to_owned(),
            artifact_ref: "clawhub.io/sdkwork/routing:v1.0.0".to_owned(),
            artifact_size_bytes: 44_040_192,
            frameworks: vec!["Rust".to_owned()],
            license_name: "MIT".to_owned(),
            published_at: "2026-05-01".to_owned(),
        }],
    }
}

fn installed_skill_item(enabled: bool, mode: &str) -> AppInstalledSkillItem {
    AppInstalledSkillItem {
        id: "install-routing-skill".to_owned(),
        skill_id: "routing-skill".to_owned(),
        enabled,
        config: serde_json::json!({ "mode": mode }),
        installed_at: "2026-05-09 00:00:00".to_owned(),
        last_enabled_at: "2026-05-09 00:00:00".to_owned(),
        skill: skill_item(),
    }
}

struct TestUuidGenerator;

impl EntityUuidGenerator for TestUuidGenerator {
    fn generate_entity_uuid(&self) -> DomainResult<String> {
        Ok("test-skill-install-uuid".to_owned())
    }
}
