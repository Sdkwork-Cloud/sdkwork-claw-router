mod common;
use common::InternalTrustedSubjectHeaders;
use std::sync::{Arc, Mutex};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::application::EntityUuidGenerator;
use sdkwork_claw_product::domain::DomainResult;
use sdkwork_claw_product::ports::{
    AdminAppCategoryItem, AdminAppCommandFuture, AdminAppItem, AdminAppPage, AdminAppStore,
    AdminAppTemplateItem, AdminAppTemplatePage, CreateAdminAppCategoryCommand,
    CreateAdminAppCommand, CreateAdminAppTemplateCommand, DeleteAdminAppCategoryCommand,
    DeleteAdminAppCommand, DeleteAdminAppTemplateCommand, GetAdminAppQuery,
    GetAdminAppTemplateQuery, ListAdminAppCategoriesQuery, ListAdminAppTemplatesQuery,
    ListAdminAppsQuery, SetAdminAppStatusCommand, SetAdminAppTemplatePublishStatusCommand,
    UpdateAdminAppCategoryCommand, UpdateAdminAppCommand, UpdateAdminAppTemplateCommand,
};
use serde_json::Value;
use tower::ServiceExt;

#[tokio::test]
async fn admin_app_route_manages_plus_apps_and_market_state() {
    let store = Arc::new(TestAdminAppStore::default());
    let router = sdkwork_claw_product::api::admin_app_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let create_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/platform/apps")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .header("X-Request-Id", "00000000-0000-4000-8000-000000000101")
                .body(Body::from(
                    r#"{"name":"Claw Router Portal","description":"Unified app portal","version":"1.0.0","iconUrl":"https://cdn.example.test/app.png","accessUrl":"https://portal.example.test","config":{"standard":{"appKey":"claw-router-portal"}},"appType":"web","platforms":{"platforms":["web"]},"installPlatforms":{"platforms":["web"]},"installSkill":{"name":"Portal Installer"},"installConfig":{"packages":[{"version":"1.0.0","downloadUrl":"https://cdn.example.test/portal.zip"}]},"releaseNotes":[{"version":"1.0.0","notes":["Initial release"]}],"packageName":"com.sdkwork.claw.portal","bundleId":"com.sdkwork.claw.portal","storeUrl":"https://store.example.test/portal","downloadUrl":"https://cdn.example.test/portal.zip"}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, create_response.status());
    let create_payload = json_payload(create_response).await;
    assert_eq!("2000", create_payload["code"]);
    assert_eq!("1", create_payload["data"]["item"]["id"]);
    assert_eq!("Claw Router Portal", create_payload["data"]["item"]["name"]);
    assert_eq!("ACTIVE", create_payload["data"]["item"]["status"]);
    assert_eq!("DRAFT", create_payload["data"]["item"]["marketStatus"]);
    assert_eq!(
        "claw-router-portal",
        create_payload["data"]["item"]["appKey"]
    );
    assert_eq!(
        "web",
        create_payload["data"]["item"]["platforms"]["platforms"][0]
    );

    let update_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("PUT")
                .uri("/backend/v3/api/platform/apps/1")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{"description":"Production-grade app portal","version":"1.0.1","config":{"standard":{"appKey":"claw-router-portal","framework":"react"}},"releaseNotes":[{"version":"1.0.1","notes":["Polished app management"]}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, update_response.status());
    let update_payload = json_payload(update_response).await;
    assert_eq!(
        "Production-grade app portal",
        update_payload["data"]["item"]["description"]
    );
    assert_eq!("1.0.1", update_payload["data"]["item"]["version"]);
    assert_eq!(
        "react",
        update_payload["data"]["item"]["config"]["standard"]["framework"]
    );

    for (path, expected_status, expected_market_status) in [
        (
            "/backend/v3/api/platform/apps/1/publish",
            "ACTIVE",
            "PUBLISHED",
        ),
        (
            "/backend/v3/api/platform/apps/1/disable",
            "INACTIVE",
            "PUBLISHED",
        ),
        (
            "/backend/v3/api/platform/apps/1/enable",
            "ACTIVE",
            "PUBLISHED",
        ),
        (
            "/backend/v3/api/platform/apps/1/offline",
            "ACTIVE",
            "OFFLINE",
        ),
    ] {
        let response = router
            .clone()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri(path)
                    .header("content-type", "application/json")
                    .internal_trusted_subject(10, 20, 30)
                    .body(Body::from("{}"))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(StatusCode::OK, response.status());
        let payload = json_payload(response).await;
        assert_eq!(expected_status, payload["data"]["item"]["status"]);
        assert_eq!(
            expected_market_status,
            payload["data"]["item"]["marketStatus"]
        );
    }

    let detail_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/backend/v3/api/platform/apps/1")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, detail_response.status());
    let detail_payload = json_payload(detail_response).await;
    assert_eq!(
        "claw-router-portal",
        detail_payload["data"]["item"]["appKey"]
    );

    let list_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/platform/apps/list")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{"keyword":"portal","marketStatus":"OFFLINE"}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload = json_payload(list_response).await;
    assert_eq!(1, list_payload["data"]["items"].as_array().unwrap().len());
    assert_eq!(1, list_payload["data"]["total"]);
    assert_eq!(1, list_payload["data"]["page"]);
    assert_eq!(100, list_payload["data"]["pageSize"]);
    assert_eq!(false, list_payload["data"]["hasNextPage"]);
    assert_eq!(
        "Claw Router Portal",
        list_payload["data"]["items"][0]["name"]
    );

    let delete_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("DELETE")
                .uri("/backend/v3/api/platform/apps/1")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, delete_response.status());
    let delete_payload = json_payload(delete_response).await;
    assert_eq!(true, delete_payload["data"]["deleted"]);

    let commands = store.commands.lock().unwrap();
    assert_eq!(
        vec![
            "create_app",
            "update_app",
            "set_status",
            "set_status",
            "set_status",
            "set_status",
            "delete_app"
        ],
        *commands
    );
}

#[tokio::test]
async fn admin_app_route_manages_app_store_categories() {
    let store = Arc::new(TestAdminAppStore::default());
    let router = sdkwork_claw_product::api::admin_app_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let create_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/platform/apps/categories")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .header("X-Request-Id", "00000000-0000-4000-8000-000000000102")
                .body(Body::from(
                    r#"{"name":"Productivity","code":"app-store-productivity","description":"Work apps","sortWeight":120,"path":"/app-store/productivity","visible":true,"status":1}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_response.status());
    let create_payload = json_payload(create_response).await;
    assert_eq!("2000", create_payload["code"]);
    assert_eq!("1", create_payload["data"]["item"]["id"]);
    assert_eq!("Productivity", create_payload["data"]["item"]["name"]);
    assert_eq!(999999, create_payload["data"]["item"]["type"]);

    let list_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/backend/v3/api/platform/apps/categories")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload = json_payload(list_response).await;
    assert_eq!(1, list_payload["data"]["items"].as_array().unwrap().len());

    let update_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("PUT")
                .uri("/backend/v3/api/platform/apps/categories/1")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(r#"{"name":"Workflows","sortWeight":140}"#))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, update_response.status());
    let update_payload = json_payload(update_response).await;
    assert_eq!("Workflows", update_payload["data"]["item"]["name"]);
    assert_eq!(140, update_payload["data"]["item"]["sortWeight"]);

    let delete_response = router
        .oneshot(
            Request::builder()
                .method("DELETE")
                .uri("/backend/v3/api/platform/apps/categories/1")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, delete_response.status());
    let delete_payload = json_payload(delete_response).await;
    assert_eq!(true, delete_payload["data"]["deleted"]);
    assert_eq!(
        vec![
            "create_app_category",
            "list_app_categories",
            "update_app_category",
            "delete_app_category"
        ],
        *store.commands.lock().unwrap()
    );
}

#[tokio::test]
async fn admin_app_route_manages_app_templates() {
    let store = Arc::new(TestAdminAppStore::default());
    let router = sdkwork_claw_product::api::admin_app_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let create_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/platform/apps/templates")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .header("X-Request-Id", "00000000-0000-4000-8000-000000000103")
                .body(Body::from(
                    r#"{"templateCode":"agent-dashboard","templateName":"Agent Dashboard","description":"Start from an agent operations app shell","templateType":"dashboard","runtime":"web","framework":"react","language":"typescript","visibility":"TENANT","publishStatus":"DRAFT","featured":true,"sortWeight":90,"gitRepoUrl":"https://github.com/sdkwork/app-templates.git","gitRef":"main","gitSubPath":"apps/agent-dashboard","appConfigSchema":{"type":"object"},"defaultAppConfig":{"theme":"light"},"variableSchema":{"required":["agentId"]},"dependencyManifest":[{"name":"@sdkwork/runtime"}],"capabilityManifest":[{"capability":"agent"}]}"#,
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
        "agent-dashboard",
        create_payload["data"]["item"]["templateCode"]
    );
    assert_eq!(
        "Agent Dashboard",
        create_payload["data"]["item"]["templateName"]
    );
    assert_eq!("TENANT", create_payload["data"]["item"]["visibility"]);
    assert_eq!("DRAFT", create_payload["data"]["item"]["publishStatus"]);
    assert_eq!(true, create_payload["data"]["item"]["featured"]);
    assert_eq!(
        "https://github.com/sdkwork/app-templates.git",
        create_payload["data"]["item"]["gitRepoUrl"]
    );
    assert_eq!("main", create_payload["data"]["item"]["gitRef"]);
    assert_eq!(
        "apps/agent-dashboard",
        create_payload["data"]["item"]["gitSubPath"]
    );

    let update_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("PUT")
                .uri("/backend/v3/api/platform/apps/templates/1")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{"templateName":"Agent Dashboard Pro","framework":"react-router","featured":false,"gitRepoUrl":"git@github.com:sdkwork/app-templates.git","gitRef":"release/2026.05","gitSubPath":"apps/agent-dashboard-pro","defaultAppConfig":{"theme":"dark"}}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, update_response.status());
    let update_payload = json_payload(update_response).await;
    assert_eq!(
        "Agent Dashboard Pro",
        update_payload["data"]["item"]["templateName"]
    );
    assert_eq!("react-router", update_payload["data"]["item"]["framework"]);
    assert_eq!(false, update_payload["data"]["item"]["featured"]);
    assert_eq!(
        "git@github.com:sdkwork/app-templates.git",
        update_payload["data"]["item"]["gitRepoUrl"]
    );
    assert_eq!("release/2026.05", update_payload["data"]["item"]["gitRef"]);
    assert_eq!(
        "apps/agent-dashboard-pro",
        update_payload["data"]["item"]["gitSubPath"]
    );

    let publish_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/platform/apps/templates/1/publish")
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
        "PUBLISHED",
        publish_payload["data"]["item"]["publishStatus"]
    );

    let list_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/backend/v3/api/platform/apps/templates?q=agent&publish_status=PUBLISHED&page=1&page_size=20")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload = json_payload(list_response).await;
    assert_eq!(1, list_payload["data"]["total"]);
    assert_eq!(
        "Agent Dashboard Pro",
        list_payload["data"]["items"][0]["templateName"]
    );

    let offline_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/platform/apps/templates/1/offline")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, offline_response.status());
    let offline_payload = json_payload(offline_response).await;
    assert_eq!("OFFLINE", offline_payload["data"]["item"]["publishStatus"]);

    let delete_response = router
        .oneshot(
            Request::builder()
                .method("DELETE")
                .uri("/backend/v3/api/platform/apps/templates/1")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, delete_response.status());
    let delete_payload = json_payload(delete_response).await;
    assert_eq!(true, delete_payload["data"]["deleted"]);
    assert_eq!(
        vec![
            "create_app_template",
            "update_app_template",
            "set_template_publish_status",
            "list_app_templates",
            "set_template_publish_status",
            "delete_app_template"
        ],
        *store.commands.lock().unwrap()
    );
}

#[tokio::test]
async fn admin_app_route_rejects_missing_trusted_subject() {
    let router = sdkwork_claw_product::api::admin_app_router_with_store(
        Arc::new(TestAdminAppStore::default()),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/platform/apps/list")
                .body(Body::from("{}"))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
    let payload = json_payload(response).await;
    assert_eq!("4010", payload["code"]);
}

#[tokio::test]
async fn admin_app_route_rejects_invalid_payload_without_calling_store() {
    let store = Arc::new(TestAdminAppStore::default());
    let router = sdkwork_claw_product::api::admin_app_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/platform/apps")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{"name":"","config":{"standard":{"appKey":"valid-app-key"}}}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = json_payload(response).await;
    assert_eq!("4001", payload["code"]);
    assert!(payload["msg"].as_str().unwrap().contains("name"));
    assert!(store.commands.lock().unwrap().is_empty());
}

#[tokio::test]
async fn admin_app_route_rejects_invalid_runtime_status_without_calling_store() {
    for (method, uri, request_body, expected_fragment) in [
        (
            "POST",
            "/backend/v3/api/platform/apps",
            r#"{"name":"Lowercase Runtime Status","status":"active","config":{"standard":{"appKey":"lowercase-runtime-status"}}}"#,
            "status",
        ),
        (
            "POST",
            "/backend/v3/api/platform/apps",
            r#"{"name":"Enabled Runtime Status","status":"ENABLED","config":{"standard":{"appKey":"enabled-runtime-status"}}}"#,
            "status",
        ),
        (
            "POST",
            "/backend/v3/api/platform/apps",
            r#"{"name":"Numeric Runtime Status","status":"1","config":{"standard":{"appKey":"numeric-runtime-status"}}}"#,
            "status",
        ),
        (
            "POST",
            "/backend/v3/api/platform/apps",
            r#"{"name":"Published Runtime Status","status":"PUBLISHED","config":{"standard":{"appKey":"published-runtime-status"}}}"#,
            "status",
        ),
        (
            "POST",
            "/backend/v3/api/platform/apps",
            r#"{"name":"Offline Runtime Status","status":"OFFLINE","config":{"standard":{"appKey":"offline-runtime-status"}}}"#,
            "status",
        ),
        (
            "POST",
            "/backend/v3/api/platform/apps/list",
            r#"{"name":"Published Runtime Status","status":"PUBLISHED"}"#,
            "status",
        ),
        (
            "POST",
            "/backend/v3/api/platform/apps/list",
            r#"{"name":"Offline Runtime Status","status":"OFFLINE"}"#,
            "status",
        ),
        (
            "POST",
            "/backend/v3/api/platform/apps/list",
            r#"{"status":"PUBLISHED"}"#,
            "status",
        ),
        (
            "POST",
            "/backend/v3/api/platform/apps/list",
            r#"{"status":"active"}"#,
            "status",
        ),
        (
            "POST",
            "/backend/v3/api/platform/apps/list",
            r#"{"status":"ENABLED"}"#,
            "status",
        ),
        (
            "POST",
            "/backend/v3/api/platform/apps/list",
            r#"{"status":"1"}"#,
            "status",
        ),
    ] {
        let store = Arc::new(TestAdminAppStore::default());
        let router = sdkwork_claw_product::api::admin_app_router_with_store(
            store.clone(),
            Arc::new(TestUuidGenerator),
        );

        let response = router
            .oneshot(
                Request::builder()
                    .method(method)
                    .uri(uri)
                    .header("content-type", "application/json")
                    .internal_trusted_subject(10, 20, 30)
                    .body(Body::from(request_body))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(StatusCode::BAD_REQUEST, response.status());
        let payload = json_payload(response).await;
        assert_eq!("4001", payload["code"]);
        assert!(payload["msg"].as_str().unwrap().contains(expected_fragment));
        assert!(store.commands.lock().unwrap().is_empty());
    }
}

#[tokio::test]
async fn admin_app_route_rejects_invalid_market_status_without_calling_store() {
    for (method, uri, request_body) in [
        (
            "POST",
            "/backend/v3/api/platform/apps",
            r#"{"name":"Lowercase Market Status","marketStatus":"published","config":{"standard":{"appKey":"lowercase-market-status"}}}"#,
        ),
        (
            "POST",
            "/backend/v3/api/platform/apps",
            r#"{"name":"Active Market Status","marketStatus":"ACTIVE","config":{"standard":{"appKey":"active-market-status"}}}"#,
        ),
        (
            "POST",
            "/backend/v3/api/platform/apps",
            r#"{"name":"Numeric Market Status","marketStatus":"1","config":{"standard":{"appKey":"numeric-market-status"}}}"#,
        ),
        (
            "POST",
            "/backend/v3/api/platform/apps/list",
            r#"{"marketStatus":"published"}"#,
        ),
        (
            "POST",
            "/backend/v3/api/platform/apps/list",
            r#"{"marketStatus":"ACTIVE"}"#,
        ),
        (
            "POST",
            "/backend/v3/api/platform/apps/list",
            r#"{"marketStatus":"1"}"#,
        ),
    ] {
        let store = Arc::new(TestAdminAppStore::default());
        let router = sdkwork_claw_product::api::admin_app_router_with_store(
            store.clone(),
            Arc::new(TestUuidGenerator),
        );

        let response = router
            .oneshot(
                Request::builder()
                    .method(method)
                    .uri(uri)
                    .header("content-type", "application/json")
                    .internal_trusted_subject(10, 20, 30)
                    .body(Body::from(request_body))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(StatusCode::BAD_REQUEST, response.status());
        let payload = json_payload(response).await;
        assert_eq!("4001", payload["code"]);
        assert!(payload["msg"].as_str().unwrap().contains("marketStatus"));
        assert!(store.commands.lock().unwrap().is_empty());
    }
}

#[tokio::test]
async fn admin_app_route_rejects_reserved_config_shapes_without_calling_store() {
    for (request_body, expected_fragment) in [
        (
            r#"{"name":"Invalid Config Root","config":[]}"#,
            "config must be a JSON object",
        ),
        (
            r#"{"name":"Invalid Standard Config","config":{"standard":[]}}"#,
            "config.standard must be a JSON object",
        ),
        (
            r#"{"name":"Invalid Portal Config","marketStatus":"PUBLISHED","config":{"portal":[]}}"#,
            "config.portal must be a JSON object",
        ),
    ] {
        let store = Arc::new(TestAdminAppStore::default());
        let router = sdkwork_claw_product::api::admin_app_router_with_store(
            store.clone(),
            Arc::new(TestUuidGenerator),
        );

        let response = router
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/backend/v3/api/platform/apps")
                    .header("content-type", "application/json")
                    .internal_trusted_subject(10, 20, 30)
                    .body(Body::from(request_body))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(StatusCode::BAD_REQUEST, response.status());
        let payload = json_payload(response).await;
        assert_eq!("4001", payload["code"]);
        assert!(payload["msg"].as_str().unwrap().contains(expected_fragment));
        assert!(store.commands.lock().unwrap().is_empty());
    }
}

#[tokio::test]
async fn admin_app_route_requires_standard_app_key_on_create_and_update_config() {
    for (method, uri, request_body, expected_fragment) in [
        (
            "POST",
            "/backend/v3/api/platform/apps",
            r#"{"name":"Missing App Key"}"#,
            "config.standard.appKey is required",
        ),
        (
            "POST",
            "/backend/v3/api/platform/apps",
            r#"{"name":"Missing App Key","config":{"standard":{}}}"#,
            "config.standard.appKey is required",
        ),
        (
            "POST",
            "/backend/v3/api/platform/apps",
            r#"{"name":"Uppercase App Key","config":{"standard":{"appKey":"Admin-App"}}}"#,
            "appKey must use lowercase kebab-case",
        ),
        (
            "POST",
            "/backend/v3/api/platform/apps",
            r#"{"name":"Underscore App Key","config":{"standard":{"appKey":"admin_app"}}}"#,
            "appKey must use lowercase kebab-case",
        ),
        (
            "POST",
            "/backend/v3/api/platform/apps",
            r#"{"name":"Colon App Key","config":{"standard":{"appKey":"admin:app"}}}"#,
            "appKey must use lowercase kebab-case",
        ),
        (
            "PUT",
            "/backend/v3/api/platform/apps/1",
            r#"{"config":{"standard":{}}}"#,
            "config.standard.appKey is required",
        ),
        (
            "PUT",
            "/backend/v3/api/platform/apps/1",
            r#"{"config":{"standard":{"appKey":"admin_app"}}}"#,
            "appKey must use lowercase kebab-case",
        ),
    ] {
        let store = Arc::new(TestAdminAppStore::default());
        let router = sdkwork_claw_product::api::admin_app_router_with_store(
            store.clone(),
            Arc::new(TestUuidGenerator),
        );

        let response = router
            .oneshot(
                Request::builder()
                    .method(method)
                    .uri(uri)
                    .header("content-type", "application/json")
                    .internal_trusted_subject(10, 20, 30)
                    .body(Body::from(request_body))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(StatusCode::BAD_REQUEST, response.status());
        let payload = json_payload(response).await;
        assert_eq!("4001", payload["code"]);
        assert!(
            payload["msg"].as_str().unwrap().contains(expected_fragment),
            "expected `{}` to contain `{}`",
            payload["msg"].as_str().unwrap(),
            expected_fragment
        );
        assert!(store.commands.lock().unwrap().is_empty());
    }
}

#[tokio::test]
async fn admin_app_route_accepts_market_status_independently_from_runtime_status() {
    let store = Arc::new(TestAdminAppStore::default());
    let router = sdkwork_claw_product::api::admin_app_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/platform/apps")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{"name":"Published Market App","marketStatus":"PUBLISHED","config":{"standard":{"appKey":"published-market-app"},"portal":{}}}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = json_payload(response).await;
    assert_eq!("ACTIVE", payload["data"]["item"]["status"]);
    assert_eq!("PUBLISHED", payload["data"]["item"]["marketStatus"]);
    assert_eq!(vec!["create_app"], *store.commands.lock().unwrap());
}

#[tokio::test]
async fn admin_app_publish_does_not_change_runtime_status() {
    let store = Arc::new(TestAdminAppStore::default());
    let router = sdkwork_claw_product::api::admin_app_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let create_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/platform/apps")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{"name":"Inactive Draft App","status":"INACTIVE","marketStatus":"DRAFT","config":{"standard":{"appKey":"inactive-draft-app"}}}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_response.status());
    let create_payload = json_payload(create_response).await;
    assert_eq!("INACTIVE", create_payload["data"]["item"]["status"]);
    assert_eq!("DRAFT", create_payload["data"]["item"]["marketStatus"]);

    let publish_response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/platform/apps/1/publish")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from("{}"))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, publish_response.status());
    let publish_payload = json_payload(publish_response).await;
    assert_eq!("INACTIVE", publish_payload["data"]["item"]["status"]);
    assert_eq!("PUBLISHED", publish_payload["data"]["item"]["marketStatus"]);
    assert_eq!(
        vec!["create_app", "set_status"],
        *store.commands.lock().unwrap()
    );
}

async fn json_payload(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

#[derive(Default)]
struct TestAdminAppStore {
    apps: Mutex<Vec<AdminAppItem>>,
    categories: Mutex<Vec<AdminAppCategoryItem>>,
    templates: Mutex<Vec<AdminAppTemplateItem>>,
    commands: Mutex<Vec<&'static str>>,
}

impl AdminAppStore for TestAdminAppStore {
    fn list_categories<'a>(
        &'a self,
        query: ListAdminAppCategoriesQuery,
    ) -> AdminAppCommandFuture<'a, Vec<AdminAppCategoryItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("list_app_categories");
            Ok(self
                .categories
                .lock()
                .unwrap()
                .iter()
                .filter(|item| {
                    item.tenant_id == query.subject.tenant_id
                        && item.organization_id == query.subject.organization_id
                })
                .cloned()
                .collect())
        })
    }

    fn create_category<'a>(
        &'a self,
        command: CreateAdminAppCategoryCommand,
    ) -> AdminAppCommandFuture<'a, AdminAppCategoryItem> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("create_app_category");
            let id = self.categories.lock().unwrap().len() as i64 + 1;
            let item = AdminAppCategoryItem {
                id,
                uuid: command.category_uuid,
                tenant_id: command.subject.tenant_id,
                organization_id: command.subject.organization_id,
                name: command.name,
                description: command.description,
                code: command.code,
                icon: command.icon,
                sort_weight: command.sort_weight,
                parent_id: command.parent_id,
                path: command.path,
                visible: command.visible,
                status: command.status,
                category_type: command.category_type,
            };
            self.categories.lock().unwrap().push(item.clone());
            Ok(item)
        })
    }

    fn update_category<'a>(
        &'a self,
        command: UpdateAdminAppCategoryCommand,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppCategoryItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("update_app_category");
            let mut categories = self.categories.lock().unwrap();
            let Some(item) = categories.iter_mut().find(|item| {
                item.id == command.category_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
            }) else {
                return Ok(None);
            };
            if let Some(value) = command.name {
                item.name = value;
            }
            if let Some(value) = command.sort_weight {
                item.sort_weight = value;
            }
            Ok(Some(item.clone()))
        })
    }

    fn delete_category<'a>(
        &'a self,
        command: DeleteAdminAppCategoryCommand,
    ) -> AdminAppCommandFuture<'a, bool> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("delete_app_category");
            let mut categories = self.categories.lock().unwrap();
            let before = categories.len();
            categories.retain(|item| {
                !(item.id == command.category_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id)
            });
            Ok(categories.len() != before)
        })
    }

    fn list_apps<'a>(
        &'a self,
        query: ListAdminAppsQuery,
    ) -> AdminAppCommandFuture<'a, AdminAppPage> {
        Box::pin(async move {
            let keyword = query.keyword.as_deref().map(str::to_lowercase);
            let mut items = self
                .apps
                .lock()
                .unwrap()
                .iter()
                .filter(|item| {
                    item.tenant_id == query.subject.tenant_id
                        && item.organization_id == query.subject.organization_id
                })
                .filter(|item| {
                    keyword.as_ref().map_or(true, |keyword| {
                        item.name.to_lowercase().contains(keyword)
                            || item
                                .description
                                .as_deref()
                                .unwrap_or_default()
                                .to_lowercase()
                                .contains(keyword)
                            || item
                                .app_key
                                .as_deref()
                                .unwrap_or_default()
                                .to_lowercase()
                                .contains(keyword)
                    })
                })
                .filter(|item| {
                    query
                        .status
                        .as_ref()
                        .map_or(true, |status| item.status == *status)
                })
                .filter(|item| {
                    query
                        .market_status
                        .as_ref()
                        .map_or(true, |status| item.market_status == *status)
                })
                .cloned()
                .collect::<Vec<_>>();
            let total = items.len() as i64;
            let page_size = query.page_size.unwrap_or(100).max(1);
            let page_no = query.page_no.unwrap_or(1).max(1);
            let offset = ((page_no - 1) * page_size) as usize;
            items = items
                .into_iter()
                .skip(offset)
                .take(page_size as usize)
                .collect();
            Ok(AdminAppPage::new(items, total, page_no, page_size))
        })
    }

    fn get_app<'a>(
        &'a self,
        query: GetAdminAppQuery,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppItem>> {
        Box::pin(async move {
            Ok(self
                .apps
                .lock()
                .unwrap()
                .iter()
                .find(|item| {
                    item.id == query.app_id
                        && item.tenant_id == query.subject.tenant_id
                        && item.organization_id == query.subject.organization_id
                })
                .cloned())
        })
    }

    fn create_app<'a>(
        &'a self,
        command: CreateAdminAppCommand,
    ) -> AdminAppCommandFuture<'a, AdminAppItem> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("create_app");
            let id = self.apps.lock().unwrap().len() as i64 + 1;
            let item = AdminAppItem {
                id,
                uuid: command.app_uuid,
                tenant_id: command.subject.tenant_id,
                organization_id: command.subject.organization_id,
                user_id: Some(command.subject.operator_id),
                name: command.name,
                description: command.description,
                version: command.version,
                icon: command.icon,
                icon_url: command.icon_url,
                resource_list: command.resource_list,
                project_id: command.project_id,
                access_url: command.access_url,
                config: command.config,
                app_key: command.app_key,
                status: command.status,
                market_status: command.market_status,
                app_type: command.app_type,
                platforms: command.platforms,
                install_platforms: command.install_platforms,
                install_skill: command.install_skill,
                install_config: command.install_config,
                release_notes: command.release_notes,
                package_name: command.package_name,
                bundle_id: command.bundle_id,
                store_url: command.store_url,
                download_url: command.download_url,
                created_at: command.requested_at.clone(),
                updated_at: command.requested_at,
            };
            self.apps.lock().unwrap().push(item.clone());
            Ok(item)
        })
    }

    fn update_app<'a>(
        &'a self,
        command: UpdateAdminAppCommand,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("update_app");
            let mut apps = self.apps.lock().unwrap();
            let Some(item) = apps.iter_mut().find(|item| {
                item.id == command.app_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
            }) else {
                return Ok(None);
            };
            if let Some(value) = command.name {
                item.name = value;
            }
            if let Some(value) = command.description {
                item.description = value;
            }
            if let Some(value) = command.version {
                item.version = value;
            }
            if let Some(value) = command.config {
                item.config = value;
            }
            if let Some(value) = command.app_key {
                item.app_key = value;
            }
            if let Some(value) = command.release_notes {
                item.release_notes = value;
            }
            item.updated_at = command.requested_at;
            Ok(Some(item.clone()))
        })
    }

    fn set_app_status<'a>(
        &'a self,
        command: SetAdminAppStatusCommand,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("set_status");
            let mut apps = self.apps.lock().unwrap();
            let Some(item) = apps.iter_mut().find(|item| {
                item.id == command.app_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
            }) else {
                return Ok(None);
            };
            if let Some(status) = command.status {
                item.status = status;
            }
            if let Some(market_status) = command.market_status {
                item.market_status = market_status;
            }
            item.updated_at = command.requested_at;
            Ok(Some(item.clone()))
        })
    }

    fn delete_app<'a>(&'a self, command: DeleteAdminAppCommand) -> AdminAppCommandFuture<'a, bool> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("delete_app");
            let mut apps = self.apps.lock().unwrap();
            let before = apps.len();
            apps.retain(|item| {
                !(item.id == command.app_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id)
            });
            Ok(apps.len() != before)
        })
    }

    fn list_app_templates<'a>(
        &'a self,
        query: ListAdminAppTemplatesQuery,
    ) -> AdminAppCommandFuture<'a, AdminAppTemplatePage> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("list_app_templates");
            let keyword = query.keyword.as_deref().map(str::to_lowercase);
            let mut items = self
                .templates
                .lock()
                .unwrap()
                .iter()
                .filter(|item| {
                    item.tenant_id == query.subject.tenant_id
                        && item.organization_id == query.subject.organization_id
                })
                .filter(|item| {
                    keyword.as_ref().map_or(true, |keyword| {
                        item.template_name.to_lowercase().contains(keyword)
                            || item.template_code.to_lowercase().contains(keyword)
                            || item
                                .description
                                .as_deref()
                                .unwrap_or_default()
                                .to_lowercase()
                                .contains(keyword)
                    })
                })
                .filter(|item| {
                    query
                        .publish_status
                        .as_ref()
                        .map_or(true, |status| item.publish_status == *status)
                })
                .cloned()
                .collect::<Vec<_>>();
            let total = items.len() as i64;
            let page_size = query.page_size.unwrap_or(100).max(1);
            let page_no = query.page_no.unwrap_or(1).max(1);
            let offset = ((page_no - 1) * page_size) as usize;
            items = items
                .into_iter()
                .skip(offset)
                .take(page_size as usize)
                .collect();
            Ok(AdminAppTemplatePage::new(items, total, page_no, page_size))
        })
    }

    fn get_app_template<'a>(
        &'a self,
        query: GetAdminAppTemplateQuery,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppTemplateItem>> {
        Box::pin(async move {
            Ok(self
                .templates
                .lock()
                .unwrap()
                .iter()
                .find(|item| {
                    item.id == query.template_id
                        && item.tenant_id == query.subject.tenant_id
                        && item.organization_id == query.subject.organization_id
                })
                .cloned())
        })
    }

    fn create_app_template<'a>(
        &'a self,
        command: CreateAdminAppTemplateCommand,
    ) -> AdminAppCommandFuture<'a, AdminAppTemplateItem> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("create_app_template");
            let id = self.templates.lock().unwrap().len() as i64 + 1;
            let item = AdminAppTemplateItem {
                id,
                uuid: command.template_uuid,
                tenant_id: command.subject.tenant_id,
                organization_id: command.subject.organization_id,
                template_no: command.template_no,
                template_code: command.template_code,
                template_name: command.template_name,
                description: command.description,
                category_id: command.category_id,
                category_code: command.category_code,
                template_type: command.template_type,
                runtime: command.runtime,
                framework: command.framework,
                language: command.language,
                icon_url: command.icon_url,
                cover_url: command.cover_url,
                visibility: command.visibility,
                publish_status: command.publish_status,
                featured: command.featured,
                sort_weight: command.sort_weight,
                source_app_id: command.source_app_id,
                git_repo_url: command.git_repo_url,
                git_ref: command.git_ref,
                git_sub_path: command.git_sub_path,
                current_version_id: None,
                app_config_schema: command.app_config_schema,
                default_app_config: command.default_app_config,
                variable_schema: command.variable_schema,
                dependency_manifest: command.dependency_manifest,
                capability_manifest: command.capability_manifest,
                created_at: command.requested_at.clone(),
                updated_at: command.requested_at,
            };
            self.templates.lock().unwrap().push(item.clone());
            Ok(item)
        })
    }

    fn update_app_template<'a>(
        &'a self,
        command: UpdateAdminAppTemplateCommand,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppTemplateItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("update_app_template");
            let mut templates = self.templates.lock().unwrap();
            let Some(item) = templates.iter_mut().find(|item| {
                item.id == command.template_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
            }) else {
                return Ok(None);
            };
            if let Some(value) = command.template_name {
                item.template_name = value;
            }
            if let Some(value) = command.description {
                item.description = value;
            }
            if let Some(value) = command.framework {
                item.framework = value;
            }
            if let Some(value) = command.featured {
                item.featured = value;
            }
            if let Some(value) = command.git_repo_url {
                item.git_repo_url = value;
            }
            if let Some(value) = command.git_ref {
                item.git_ref = value;
            }
            if let Some(value) = command.git_sub_path {
                item.git_sub_path = value;
            }
            if let Some(value) = command.default_app_config {
                item.default_app_config = value;
            }
            item.updated_at = command.requested_at;
            Ok(Some(item.clone()))
        })
    }

    fn set_app_template_publish_status<'a>(
        &'a self,
        command: SetAdminAppTemplatePublishStatusCommand,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppTemplateItem>> {
        Box::pin(async move {
            self.commands
                .lock()
                .unwrap()
                .push("set_template_publish_status");
            let mut templates = self.templates.lock().unwrap();
            let Some(item) = templates.iter_mut().find(|item| {
                item.id == command.template_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
            }) else {
                return Ok(None);
            };
            item.publish_status = command.publish_status;
            item.updated_at = command.requested_at;
            Ok(Some(item.clone()))
        })
    }

    fn delete_app_template<'a>(
        &'a self,
        command: DeleteAdminAppTemplateCommand,
    ) -> AdminAppCommandFuture<'a, bool> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("delete_app_template");
            let mut templates = self.templates.lock().unwrap();
            let before = templates.len();
            templates.retain(|item| {
                !(item.id == command.template_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id)
            });
            Ok(templates.len() != before)
        })
    }
}

struct TestUuidGenerator;

impl EntityUuidGenerator for TestUuidGenerator {
    fn generate_entity_uuid(&self) -> DomainResult<String> {
        Ok("00000000-0000-7000-8000-000000000001".to_owned())
    }
}
