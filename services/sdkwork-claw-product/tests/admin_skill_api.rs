use std::sync::{Arc, Mutex};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::application::EntityUuidGenerator;
use sdkwork_claw_product::domain::DomainResult;
use sdkwork_claw_product::ports::{
    AdminSkillArtifactItem, AdminSkillAssetItem, AdminSkillCategoryItem, AdminSkillCommandFuture,
    AdminSkillItem, AdminSkillPackageItem, AdminSkillStore, CreateAdminSkillArtifactCommand,
    CreateAdminSkillAssetCommand, CreateAdminSkillCategoryCommand, CreateAdminSkillCommand,
    CreateAdminSkillPackageCommand, DeleteAdminSkillArtifactCommand, DeleteAdminSkillAssetCommand,
    DeleteAdminSkillCategoryCommand, DeleteAdminSkillCommand, DeleteAdminSkillPackageCommand,
    ListAdminSkillArtifactsQuery, ListAdminSkillAssetsQuery, ListAdminSkillCategoriesQuery,
    ListAdminSkillPackagesQuery, ListAdminSkillsQuery, ReviewAdminSkillCommand,
    SetAdminSkillEnabledCommand, SetAdminSkillMarketStatusCommand,
    SetAdminSkillPackageEnabledCommand, UpdateAdminSkillArtifactCommand,
    UpdateAdminSkillAssetCommand, UpdateAdminSkillCategoryCommand, UpdateAdminSkillCommand,
    UpdateAdminSkillPackageCommand,
};
use serde_json::{json, Value};
use tower::ServiceExt;

#[tokio::test]
async fn admin_skill_route_manages_categories_skills_and_market_review_state() {
    let store = Arc::new(TestAdminSkillStore::default());
    let router = sdkwork_claw_product::api::admin_skill_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let category_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/skill/categories")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"name":"Prompt Engineering","code":"prompt-engineering","description":"Prompt and instruction skills","icon":"https://cdn.example.test/icons/prompt.png","sortWeight":90}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, category_response.status());
    let category_payload = json_payload(category_response).await;
    assert_eq!("2000", category_payload["code"]);
    assert_eq!(
        "Prompt Engineering",
        category_payload["data"]["item"]["name"]
    );
    assert_eq!(
        "prompt-engineering",
        category_payload["data"]["item"]["code"]
    );
    assert_eq!(19, category_payload["data"]["item"]["type"]);

    let category_update_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("PUT")
                .uri("/backend/v3/api/ecosystem/skills/categories/1")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"name":"Prompt Engineering Pro","sortWeight":95,"visible":false}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, category_update_response.status());
    let category_update_payload = json_payload(category_update_response).await;
    assert_eq!(
        "Prompt Engineering Pro",
        category_update_payload["data"]["item"]["name"]
    );
    assert_eq!(95, category_update_payload["data"]["item"]["sortWeight"]);
    assert_eq!(false, category_update_payload["data"]["item"]["visible"]);

    let create_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/skill")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .header("X-Request-Id", "req-create-skill")
                .body(Body::from(
                    r#"{"skillKey":"prompt-optimizer","name":"Prompt Optimizer","summary":"Improves prompts","description":"Optimizes prompts before model execution","categoryId":"1","provider":"SDKWork","version":"1.0.0","runtime":"wasm","entrypoint":"prompt_optimizer:start","manifestUrl":"https://cdn.example.test/skills/prompt/manifest.json","repositoryUrl":"https://github.com/sdkwork/prompt-optimizer","documentationUrl":"https://docs.example.test/prompt-optimizer","licenseName":"Apache-2.0","sourceType":"COMMUNITY","visibility":"PUBLIC","tags":["prompt","wasm","wasm"],"capabilities":["prompt","analysis"],"configSchema":{"type":"object"},"defaultConfig":{"mode":"balanced"},"featured":true,"recommendWeight":80}"#,
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
        "prompt-optimizer",
        create_payload["data"]["item"]["skillKey"]
    );
    assert_eq!("Prompt Optimizer", create_payload["data"]["item"]["name"]);
    assert_eq!("DRAFT", create_payload["data"]["item"]["marketStatus"]);
    assert_eq!("PENDING", create_payload["data"]["item"]["reviewStatus"]);
    assert_eq!(true, create_payload["data"]["item"]["featured"]);
    assert_eq!(
        json!(["prompt", "wasm"]),
        create_payload["data"]["item"]["tags"]
    );
    assert_eq!(
        "balanced",
        create_payload["data"]["item"]["defaultConfig"]["mode"]
    );

    let update_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("PUT")
                .uri("/backend/v3/api/skill/1")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"summary":"Polishes prompts","version":"1.0.1","capabilities":["prompt","analysis","workflow"],"featured":false,"recommendWeight":60}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, update_response.status());
    let update_payload = json_payload(update_response).await;
    assert_eq!(
        "Polishes prompts",
        update_payload["data"]["item"]["summary"]
    );
    assert_eq!("1.0.1", update_payload["data"]["item"]["version"]);
    assert_eq!(false, update_payload["data"]["item"]["featured"]);
    assert_eq!(60, update_payload["data"]["item"]["recommendWeight"]);
    assert_eq!(
        "workflow",
        update_payload["data"]["item"]["capabilities"][2]
    );

    for (path, expected_market_status, expected_review_status, expected_enabled) in [
        (
            "/backend/v3/api/skill/1/review/approve",
            "DRAFT",
            "APPROVED",
            true,
        ),
        (
            "/backend/v3/api/skill/1/publish",
            "PUBLISHED",
            "APPROVED",
            true,
        ),
        (
            "/backend/v3/api/skill/1/disable",
            "PUBLISHED",
            "APPROVED",
            false,
        ),
        (
            "/backend/v3/api/skill/1/enable",
            "PUBLISHED",
            "APPROVED",
            true,
        ),
        (
            "/backend/v3/api/skill/1/offline",
            "OFFLINE",
            "APPROVED",
            true,
        ),
        (
            "/backend/v3/api/skill/1/review/reject",
            "OFFLINE",
            "REJECTED",
            true,
        ),
    ] {
        let response = router
            .clone()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri(path)
                    .header("content-type", "application/json")
                    .header("x-sdkwork-tenant-id", "10")
                    .header("x-sdkwork-organization-id", "20")
                    .header("x-sdkwork-user-id", "30")
                    .body(Body::from(r#"{"comment":"reviewed"}"#))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(StatusCode::OK, response.status());
        let payload = json_payload(response).await;
        assert_eq!(
            expected_market_status,
            payload["data"]["item"]["marketStatus"]
        );
        assert_eq!(
            expected_review_status,
            payload["data"]["item"]["reviewStatus"]
        );
        assert_eq!(expected_enabled, payload["data"]["item"]["enabled"]);
    }

    let list_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/skill/list")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"keyword":"prompt","marketStatus":"OFFLINE"}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload = json_payload(list_response).await;
    assert_eq!(1, list_payload["data"]["items"].as_array().unwrap().len());
    assert_eq!("Prompt Optimizer", list_payload["data"]["items"][0]["name"]);

    let delete_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("DELETE")
                .uri("/backend/v3/api/skill/1")
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

    let category_delete_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("DELETE")
                .uri("/backend/v3/api/ecosystem/skills/categories/1")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, category_delete_response.status());
    let category_delete_payload = json_payload(category_delete_response).await;
    assert_eq!(true, category_delete_payload["data"]["deleted"]);

    let commands = store.commands.lock().unwrap();
    assert_eq!(
        vec![
            "create_category",
            "update_category",
            "create_skill",
            "update_skill",
            "review_skill",
            "set_market_status",
            "set_enabled",
            "set_enabled",
            "set_market_status",
            "review_skill",
            "delete_skill",
            "delete_category"
        ],
        *commands
    );
}

#[tokio::test]
async fn admin_skill_route_manages_skill_packages() {
    let store = Arc::new(TestAdminSkillStore::default());
    let router = sdkwork_claw_product::api::admin_skill_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let create_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/skill/package")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .header("X-Request-Id", "req-create-skill-package")
                .body(Body::from(
                    r#"{"packageKey":"agent-productivity","name":"Agent Productivity Pack","summary":"Productivity skill bundle","description":"Curated agent productivity skills","icon":"https://cdn.example.test/package/icon.png","coverImage":"https://cdn.example.test/package/cover.png","enabled":true,"featured":true,"sortWeight":100,"tags":["agent","productivity","agent"]}"#,
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
        "agent-productivity",
        create_payload["data"]["item"]["packageKey"]
    );
    assert_eq!(
        json!(["agent", "productivity"]),
        create_payload["data"]["item"]["tags"]
    );

    let update_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("PUT")
                .uri("/backend/v3/api/skill/package/1")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"summary":"Updated package","featured":false,"sortWeight":80,"tags":["workflow","quality"]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, update_response.status());
    let update_payload = json_payload(update_response).await;
    assert_eq!("Updated package", update_payload["data"]["item"]["summary"]);
    assert_eq!(false, update_payload["data"]["item"]["featured"]);
    assert_eq!(80, update_payload["data"]["item"]["sortWeight"]);

    for (path, expected_enabled) in [
        ("/backend/v3/api/skill/package/1/disable", false),
        ("/backend/v3/api/skill/package/1/enable", true),
    ] {
        let response = router
            .clone()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri(path)
                    .header("content-type", "application/json")
                    .header("x-sdkwork-tenant-id", "10")
                    .header("x-sdkwork-organization-id", "20")
                    .header("x-sdkwork-user-id", "30")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(StatusCode::OK, response.status());
        let payload = json_payload(response).await;
        assert_eq!(expected_enabled, payload["data"]["item"]["enabled"]);
    }

    let list_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/skill/package/list")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(r#"{"keyword":"productivity","enabled":true}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload = json_payload(list_response).await;
    assert_eq!(1, list_payload["data"]["items"].as_array().unwrap().len());

    let get_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/backend/v3/api/skill/package/1")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, get_response.status());
    let get_payload = json_payload(get_response).await;
    assert_eq!(
        "agent-productivity",
        get_payload["data"]["item"]["packageKey"]
    );

    let delete_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("DELETE")
                .uri("/backend/v3/api/skill/package/1")
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

    let commands = store.commands.lock().unwrap();
    assert_eq!(
        vec![
            "create_package",
            "update_package",
            "set_package_enabled",
            "set_package_enabled",
            "delete_package"
        ],
        *commands
    );
}

#[tokio::test]
async fn admin_skill_route_manages_skill_assets_and_artifacts() {
    let store = Arc::new(TestAdminSkillStore::default());
    let router = sdkwork_claw_product::api::admin_skill_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let create_skill_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/skill")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"skillKey":"asset-ready-skill","name":"Asset Ready Skill"}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_skill_response.status());

    let create_asset_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/skill/1/assets")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .header("X-Request-Id", "req-create-skill-asset")
                .body(Body::from(
                    r#"{"assetType":1,"assetUrl":"https://cdn.example.test/skills/asset-ready/cover.png","thumbnailUrl":"https://cdn.example.test/skills/asset-ready/thumb.png","title":"Skill cover","altText":"Skill marketplace cover","mimeType":"image/png","width":1200,"height":720,"fileSize":182000,"sortOrder":10,"publishedAt":"2026-05-09T00:00:00Z"}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_asset_response.status());
    let create_asset_payload = json_payload(create_asset_response).await;
    assert_eq!("2000", create_asset_payload["code"]);
    assert_eq!("1", create_asset_payload["data"]["item"]["id"]);
    assert_eq!("1", create_asset_payload["data"]["item"]["skillId"]);
    assert_eq!(35, create_asset_payload["data"]["item"]["targetType"]);
    assert_eq!(1, create_asset_payload["data"]["item"]["assetType"]);
    assert_eq!(
        "https://cdn.example.test/skills/asset-ready/cover.png",
        create_asset_payload["data"]["item"]["assetUrl"]
    );
    assert_eq!(1200, create_asset_payload["data"]["item"]["width"]);

    let update_asset_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("PUT")
                .uri("/backend/v3/api/skill/1/assets/1")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"title":"Updated cover","sortOrder":20,"thumbnailUrl":null}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, update_asset_response.status());
    let update_asset_payload = json_payload(update_asset_response).await;
    assert_eq!(
        "Updated cover",
        update_asset_payload["data"]["item"]["title"]
    );
    assert_eq!(20, update_asset_payload["data"]["item"]["sortOrder"]);
    assert_eq!(
        true,
        update_asset_payload["data"]["item"]["thumbnailUrl"].is_null()
    );

    let list_asset_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/backend/v3/api/skill/1/assets")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, list_asset_response.status());
    let list_asset_payload = json_payload(list_asset_response).await;
    assert_eq!(
        1,
        list_asset_payload["data"]["items"]
            .as_array()
            .unwrap()
            .len()
    );

    let create_artifact_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/skill/1/artifacts")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .header("X-Request-Id", "req-create-skill-artifact")
                .body(Body::from(
                    r#"{"artifactType":1,"version":"1.0.0","platformType":"agent","osName":"runtime","artifactRef":"builtin://sdkwork.skills.asset_ready@1.0.0","artifactUrl":"data/skills/artifacts/asset-ready-1.0.0.json","artifactSizeBytes":2048,"runtime":"builtin","frameworks":["Rust service","OpenAI-compatible","Rust service"],"licenseName":"SDKWork Commercial","checksumHash":"sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","releaseNotes":"Initial release.","publishedAt":"2026-05-09T00:00:00Z"}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_artifact_response.status());
    let create_artifact_payload = json_payload(create_artifact_response).await;
    assert_eq!("1", create_artifact_payload["data"]["item"]["id"]);
    assert_eq!("1", create_artifact_payload["data"]["item"]["skillId"]);
    assert_eq!(35, create_artifact_payload["data"]["item"]["targetType"]);
    assert_eq!(
        "builtin://sdkwork.skills.asset_ready@1.0.0",
        create_artifact_payload["data"]["item"]["artifactRef"]
    );
    assert_eq!(
        json!(["Rust service", "OpenAI-compatible"]),
        create_artifact_payload["data"]["item"]["frameworks"]
    );
    assert_eq!(
        "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        create_artifact_payload["data"]["item"]["checksumHash"]
    );

    let update_artifact_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("PUT")
                .uri("/backend/v3/api/skill/1/artifacts/1")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"version":"1.0.1","artifactSizeBytes":4096,"frameworks":["Rust service","React portal"],"checksumHash":null}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, update_artifact_response.status());
    let update_artifact_payload = json_payload(update_artifact_response).await;
    assert_eq!("1.0.1", update_artifact_payload["data"]["item"]["version"]);
    assert_eq!(
        4096,
        update_artifact_payload["data"]["item"]["artifactSizeBytes"]
    );
    assert_eq!(
        true,
        update_artifact_payload["data"]["item"]["checksumHash"].is_null()
    );

    let list_artifact_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/backend/v3/api/skill/1/artifacts")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, list_artifact_response.status());
    let list_artifact_payload = json_payload(list_artifact_response).await;
    assert_eq!(
        1,
        list_artifact_payload["data"]["items"]
            .as_array()
            .unwrap()
            .len()
    );

    let delete_asset_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("DELETE")
                .uri("/backend/v3/api/skill/1/assets/1")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, delete_asset_response.status());
    assert_eq!(
        true,
        json_payload(delete_asset_response).await["data"]["deleted"]
    );

    let delete_artifact_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("DELETE")
                .uri("/backend/v3/api/skill/1/artifacts/1")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, delete_artifact_response.status());
    assert_eq!(
        true,
        json_payload(delete_artifact_response).await["data"]["deleted"]
    );

    let bad_checksum_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/skill/1/artifacts")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"version":"2.0.0","artifactRef":"builtin://sdkwork.skills.asset_ready@2.0.0","checksumHash":"SHA256:bad"}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, bad_checksum_response.status());
    let bad_checksum_payload = json_payload(bad_checksum_response).await;
    assert!(bad_checksum_payload["msg"]
        .as_str()
        .unwrap()
        .contains("checksumHash"));

    let commands = store.commands.lock().unwrap();
    assert_eq!(
        vec![
            "create_skill",
            "create_asset",
            "update_asset",
            "create_artifact",
            "update_artifact",
            "delete_asset",
            "delete_artifact"
        ],
        *commands
    );
}

#[tokio::test]
async fn admin_skill_route_rejects_missing_trusted_subject_for_store_backed_router() {
    let router = sdkwork_claw_product::api::admin_skill_router_with_store(
        Arc::new(TestAdminSkillStore::default()),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/skill/list")
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
async fn admin_skill_route_rejects_invalid_payload_without_calling_store() {
    let store = Arc::new(TestAdminSkillStore::default());
    let router = sdkwork_claw_product::api::admin_skill_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/skill")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"skillKey":"not ok","name":"","sourceType":"bad","visibility":"PUBLIC"}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = json_payload(response).await;
    assert_eq!("4001", payload["code"]);
    assert!(payload["msg"].as_str().unwrap().contains("skillKey"));
    assert!(store.commands.lock().unwrap().is_empty());
}

async fn json_payload(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

#[derive(Default)]
struct TestAdminSkillStore {
    categories: Mutex<Vec<AdminSkillCategoryItem>>,
    packages: Mutex<Vec<AdminSkillPackageItem>>,
    skills: Mutex<Vec<AdminSkillItem>>,
    assets: Mutex<Vec<AdminSkillAssetItem>>,
    artifacts: Mutex<Vec<AdminSkillArtifactItem>>,
    commands: Mutex<Vec<&'static str>>,
}

impl AdminSkillStore for TestAdminSkillStore {
    fn list_categories<'a>(
        &'a self,
        query: ListAdminSkillCategoriesQuery,
    ) -> AdminSkillCommandFuture<'a, Vec<AdminSkillCategoryItem>> {
        Box::pin(async move {
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
        command: CreateAdminSkillCategoryCommand,
    ) -> AdminSkillCommandFuture<'a, AdminSkillCategoryItem> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("create_category");
            let id = self.categories.lock().unwrap().len() as i64 + 1;
            let item = AdminSkillCategoryItem {
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
        command: UpdateAdminSkillCategoryCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillCategoryItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("update_category");
            let mut categories = self.categories.lock().unwrap();
            let Some(item) = categories.iter_mut().find(|item| {
                item.id == command.category_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.status >= 0
            }) else {
                return Ok(None);
            };
            if let Some(name) = command.name {
                item.name = name;
            }
            if let Some(description) = command.description {
                item.description = description;
            }
            if let Some(code) = command.code {
                item.code = code;
            }
            if let Some(icon) = command.icon {
                item.icon = icon;
            }
            if let Some(sort_weight) = command.sort_weight {
                item.sort_weight = sort_weight;
            }
            if let Some(parent_id) = command.parent_id {
                item.parent_id = parent_id;
            }
            if let Some(path) = command.path {
                item.path = path;
            }
            if let Some(visible) = command.visible {
                item.visible = visible;
            }
            if let Some(status) = command.status {
                item.status = status;
            }
            if let Some(category_type) = command.category_type {
                item.category_type = category_type;
            }
            Ok(Some(item.clone()))
        })
    }

    fn delete_category<'a>(
        &'a self,
        command: DeleteAdminSkillCategoryCommand,
    ) -> AdminSkillCommandFuture<'a, bool> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("delete_category");
            let mut categories = self.categories.lock().unwrap();
            let Some(item) = categories.iter_mut().find(|item| {
                item.id == command.category_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.status >= 0
            }) else {
                return Ok(false);
            };
            item.status = -1;
            Ok(true)
        })
    }

    fn list_packages<'a>(
        &'a self,
        query: ListAdminSkillPackagesQuery,
    ) -> AdminSkillCommandFuture<'a, Vec<AdminSkillPackageItem>> {
        Box::pin(async move {
            Ok(self
                .packages
                .lock()
                .unwrap()
                .iter()
                .filter(|item| {
                    item.tenant_id == query.subject.tenant_id
                        && item.organization_id == query.subject.organization_id
                        && query
                            .keyword
                            .as_ref()
                            .map(|keyword| {
                                item.name.contains(keyword) || item.package_key.contains(keyword)
                            })
                            .unwrap_or(true)
                        && query
                            .enabled
                            .map(|enabled| item.enabled == enabled)
                            .unwrap_or(true)
                })
                .cloned()
                .collect())
        })
    }

    fn create_package<'a>(
        &'a self,
        command: CreateAdminSkillPackageCommand,
    ) -> AdminSkillCommandFuture<'a, AdminSkillPackageItem> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("create_package");
            let id = self.packages.lock().unwrap().len() as i64 + 1;
            let item = AdminSkillPackageItem {
                id,
                uuid: command.package_uuid,
                tenant_id: command.subject.tenant_id,
                organization_id: command.subject.organization_id,
                user_id: Some(command.subject.operator_id),
                package_key: command.package_key,
                name: command.name,
                summary: command.summary,
                description: command.description,
                icon: command.icon,
                cover_image: command.cover_image,
                category_id: command.category_id,
                enabled: command.enabled,
                featured: command.featured,
                sort_weight: command.sort_weight,
                tags: command.tags,
                latest_published_at: None,
                created_at: command.requested_at.clone(),
                updated_at: command.requested_at,
            };
            self.packages.lock().unwrap().push(item.clone());
            Ok(item)
        })
    }

    fn update_package<'a>(
        &'a self,
        command: UpdateAdminSkillPackageCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillPackageItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("update_package");
            let mut packages = self.packages.lock().unwrap();
            let Some(item) = packages.iter_mut().find(|item| {
                item.id == command.package_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
            }) else {
                return Ok(None);
            };
            if let Some(summary) = command.summary {
                item.summary = Some(summary);
            }
            if let Some(featured) = command.featured {
                item.featured = featured;
            }
            if let Some(sort_weight) = command.sort_weight {
                item.sort_weight = sort_weight;
            }
            if let Some(tags) = command.tags {
                item.tags = tags;
            }
            item.updated_at = command.requested_at;
            Ok(Some(item.clone()))
        })
    }

    fn set_package_enabled<'a>(
        &'a self,
        command: SetAdminSkillPackageEnabledCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillPackageItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("set_package_enabled");
            let mut packages = self.packages.lock().unwrap();
            let Some(item) = packages.iter_mut().find(|item| {
                item.id == command.package_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
            }) else {
                return Ok(None);
            };
            item.enabled = command.enabled;
            item.updated_at = command.requested_at;
            Ok(Some(item.clone()))
        })
    }

    fn delete_package<'a>(
        &'a self,
        command: DeleteAdminSkillPackageCommand,
    ) -> AdminSkillCommandFuture<'a, bool> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("delete_package");
            let mut packages = self.packages.lock().unwrap();
            let before = packages.len();
            packages.retain(|item| {
                item.id != command.package_id
                    || item.tenant_id != command.subject.tenant_id
                    || item.organization_id != command.subject.organization_id
            });
            Ok(packages.len() != before)
        })
    }

    fn list_skills<'a>(
        &'a self,
        query: ListAdminSkillsQuery,
    ) -> AdminSkillCommandFuture<'a, Vec<AdminSkillItem>> {
        Box::pin(async move {
            Ok(self
                .skills
                .lock()
                .unwrap()
                .iter()
                .filter(|item| {
                    item.tenant_id == query.subject.tenant_id
                        && item.organization_id == query.subject.organization_id
                        && item.deleted_at.is_none()
                        && query
                            .keyword
                            .as_ref()
                            .map(|keyword| {
                                item.name.contains(keyword) || item.skill_key.contains(keyword)
                            })
                            .unwrap_or(true)
                        && query
                            .market_status
                            .as_ref()
                            .map(|status| &item.market_status == status)
                            .unwrap_or(true)
                })
                .cloned()
                .collect())
        })
    }

    fn create_skill<'a>(
        &'a self,
        command: CreateAdminSkillCommand,
    ) -> AdminSkillCommandFuture<'a, AdminSkillItem> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("create_skill");
            let id = self.skills.lock().unwrap().len() as i64 + 1;
            let item = AdminSkillItem {
                id,
                uuid: command.skill_uuid,
                tenant_id: command.subject.tenant_id,
                organization_id: command.subject.organization_id,
                user_id: command.subject.operator_id,
                skill_key: command.skill_key,
                name: command.name,
                summary: command.summary,
                description: command.description,
                icon: command.icon,
                cover_image: command.cover_image,
                category_id: command.category_id,
                package_id: command.package_id,
                provider: command.provider,
                version: command.version,
                version_name: command.version_name,
                runtime: command.runtime,
                entrypoint: command.entrypoint,
                manifest_url: command.manifest_url,
                repository_url: command.repository_url,
                homepage_url: command.homepage_url,
                documentation_url: command.documentation_url,
                license_name: command.license_name,
                source_type: command.source_type,
                market_status: command.market_status,
                visibility: command.visibility,
                review_status: command.review_status,
                review_comment: None,
                reviewed_by: None,
                reviewed_at: None,
                builtin: command.builtin,
                is_builtin: command.is_builtin,
                enabled: command.enabled,
                featured: command.featured,
                recommend_weight: command.recommend_weight,
                price: command.price,
                currency: command.currency,
                install_count: 0,
                rating_avg: "0".to_owned(),
                rating_count: 0,
                tags: command.tags,
                capabilities: command.capabilities,
                config_schema: command.config_schema,
                default_config: command.default_config,
                latest_published_at: None,
                created_at: command.requested_at.clone(),
                updated_at: command.requested_at,
                deleted_at: None,
            };
            self.skills.lock().unwrap().push(item.clone());
            Ok(item)
        })
    }

    fn update_skill<'a>(
        &'a self,
        command: UpdateAdminSkillCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("update_skill");
            let mut skills = self.skills.lock().unwrap();
            let Some(item) = skills.iter_mut().find(|item| {
                item.id == command.skill_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.deleted_at.is_none()
            }) else {
                return Ok(None);
            };
            if let Some(summary) = command.summary {
                item.summary = Some(summary);
            }
            if let Some(version) = command.version {
                item.version = Some(version);
            }
            if let Some(capabilities) = command.capabilities {
                item.capabilities = capabilities;
            }
            if let Some(featured) = command.featured {
                item.featured = featured;
            }
            if let Some(recommend_weight) = command.recommend_weight {
                item.recommend_weight = recommend_weight;
            }
            item.updated_at = command.requested_at;
            Ok(Some(item.clone()))
        })
    }

    fn set_skill_enabled<'a>(
        &'a self,
        command: SetAdminSkillEnabledCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("set_enabled");
            let mut skills = self.skills.lock().unwrap();
            let Some(item) = skills.iter_mut().find(|item| {
                item.id == command.skill_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.deleted_at.is_none()
            }) else {
                return Ok(None);
            };
            item.enabled = command.enabled;
            item.updated_at = command.requested_at;
            Ok(Some(item.clone()))
        })
    }

    fn set_market_status<'a>(
        &'a self,
        command: SetAdminSkillMarketStatusCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("set_market_status");
            let mut skills = self.skills.lock().unwrap();
            let Some(item) = skills.iter_mut().find(|item| {
                item.id == command.skill_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.deleted_at.is_none()
            }) else {
                return Ok(None);
            };
            item.market_status = command.market_status;
            if command.publish {
                item.latest_published_at = Some(command.requested_at.clone());
            }
            item.updated_at = command.requested_at;
            Ok(Some(item.clone()))
        })
    }

    fn review_skill<'a>(
        &'a self,
        command: ReviewAdminSkillCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("review_skill");
            let mut skills = self.skills.lock().unwrap();
            let Some(item) = skills.iter_mut().find(|item| {
                item.id == command.skill_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.deleted_at.is_none()
            }) else {
                return Ok(None);
            };
            item.review_status = command.review_status;
            item.review_comment = command.review_comment;
            item.reviewed_by = Some(command.subject.operator_id);
            item.reviewed_at = Some(command.requested_at.clone());
            item.updated_at = command.requested_at;
            Ok(Some(item.clone()))
        })
    }

    fn delete_skill<'a>(
        &'a self,
        command: DeleteAdminSkillCommand,
    ) -> AdminSkillCommandFuture<'a, bool> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("delete_skill");
            let mut skills = self.skills.lock().unwrap();
            let Some(item) = skills.iter_mut().find(|item| {
                item.id == command.skill_id
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

    fn list_assets<'a>(
        &'a self,
        query: ListAdminSkillAssetsQuery,
    ) -> AdminSkillCommandFuture<'a, Vec<AdminSkillAssetItem>> {
        Box::pin(async move {
            Ok(self
                .assets
                .lock()
                .unwrap()
                .iter()
                .filter(|item| {
                    item.tenant_id == query.subject.tenant_id
                        && item.organization_id == query.subject.organization_id
                        && item.target_id == query.skill_id
                        && item.target_type == 35
                })
                .cloned()
                .collect())
        })
    }

    fn create_asset<'a>(
        &'a self,
        command: CreateAdminSkillAssetCommand,
    ) -> AdminSkillCommandFuture<'a, AdminSkillAssetItem> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("create_asset");
            if !self.skills.lock().unwrap().iter().any(|item| {
                item.id == command.skill_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.deleted_at.is_none()
            }) {
                return Err(sdkwork_claw_product::domain::DomainError::not_found(
                    "skill was not found",
                ));
            }
            let id = self.assets.lock().unwrap().len() as i64 + 1;
            let item = AdminSkillAssetItem {
                id,
                uuid: command.asset_uuid,
                tenant_id: command.subject.tenant_id,
                organization_id: command.subject.organization_id,
                status: command.status,
                target_type: 35,
                target_id: command.skill_id,
                artifact_id: command.artifact_id,
                asset_type: command.asset_type,
                asset_url: command.asset_url,
                thumbnail_url: command.thumbnail_url,
                title: command.title,
                alt_text: command.alt_text,
                mime_type: command.mime_type,
                width: command.width,
                height: command.height,
                duration_seconds: command.duration_seconds,
                file_size: command.file_size,
                sort_order: command.sort_order,
                published_at: command.published_at,
                created_at: command.requested_at.clone(),
                updated_at: command.requested_at,
            };
            self.assets.lock().unwrap().push(item.clone());
            Ok(item)
        })
    }

    fn update_asset<'a>(
        &'a self,
        command: UpdateAdminSkillAssetCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillAssetItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("update_asset");
            let mut assets = self.assets.lock().unwrap();
            let Some(item) = assets.iter_mut().find(|item| {
                item.id == command.asset_id
                    && item.target_id == command.skill_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.target_type == 35
            }) else {
                return Ok(None);
            };
            if let Some(title) = command.title {
                item.title = title;
            }
            if let Some(thumbnail_url) = command.thumbnail_url {
                item.thumbnail_url = thumbnail_url;
            }
            if let Some(sort_order) = command.sort_order {
                item.sort_order = sort_order;
            }
            item.updated_at = command.requested_at;
            Ok(Some(item.clone()))
        })
    }

    fn delete_asset<'a>(
        &'a self,
        command: DeleteAdminSkillAssetCommand,
    ) -> AdminSkillCommandFuture<'a, bool> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("delete_asset");
            let mut assets = self.assets.lock().unwrap();
            let before = assets.len();
            assets.retain(|item| {
                item.id != command.asset_id
                    || item.target_id != command.skill_id
                    || item.tenant_id != command.subject.tenant_id
                    || item.organization_id != command.subject.organization_id
                    || item.target_type != 35
            });
            Ok(assets.len() != before)
        })
    }

    fn list_artifacts<'a>(
        &'a self,
        query: ListAdminSkillArtifactsQuery,
    ) -> AdminSkillCommandFuture<'a, Vec<AdminSkillArtifactItem>> {
        Box::pin(async move {
            Ok(self
                .artifacts
                .lock()
                .unwrap()
                .iter()
                .filter(|item| {
                    item.tenant_id == query.subject.tenant_id
                        && item.organization_id == query.subject.organization_id
                        && item.target_id == query.skill_id
                        && item.target_type == 35
                })
                .cloned()
                .collect())
        })
    }

    fn create_artifact<'a>(
        &'a self,
        command: CreateAdminSkillArtifactCommand,
    ) -> AdminSkillCommandFuture<'a, AdminSkillArtifactItem> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("create_artifact");
            if !self.skills.lock().unwrap().iter().any(|item| {
                item.id == command.skill_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.deleted_at.is_none()
            }) {
                return Err(sdkwork_claw_product::domain::DomainError::not_found(
                    "skill was not found",
                ));
            }
            let id = self.artifacts.lock().unwrap().len() as i64 + 1;
            let item = AdminSkillArtifactItem {
                id,
                uuid: command.artifact_uuid,
                tenant_id: command.subject.tenant_id,
                organization_id: command.subject.organization_id,
                status: command.status,
                target_type: 35,
                target_id: command.skill_id,
                artifact_type: command.artifact_type,
                version: command.version,
                platform_type: command.platform_type,
                os_name: command.os_name,
                artifact_ref: command.artifact_ref,
                artifact_url: command.artifact_url,
                artifact_size_bytes: command.artifact_size_bytes,
                runtime: command.runtime,
                frameworks: command.frameworks,
                license_name: command.license_name,
                checksum_hash: command.checksum_hash,
                release_notes: command.release_notes,
                published_at: command.published_at,
                deprecated_at: command.deprecated_at,
                created_at: command.requested_at.clone(),
                updated_at: command.requested_at,
            };
            self.artifacts.lock().unwrap().push(item.clone());
            Ok(item)
        })
    }

    fn update_artifact<'a>(
        &'a self,
        command: UpdateAdminSkillArtifactCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillArtifactItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("update_artifact");
            let mut artifacts = self.artifacts.lock().unwrap();
            let Some(item) = artifacts.iter_mut().find(|item| {
                item.id == command.artifact_id
                    && item.target_id == command.skill_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.target_type == 35
            }) else {
                return Ok(None);
            };
            if let Some(version) = command.version {
                item.version = version;
            }
            if let Some(artifact_size_bytes) = command.artifact_size_bytes {
                item.artifact_size_bytes = artifact_size_bytes;
            }
            if let Some(frameworks) = command.frameworks {
                item.frameworks = frameworks;
            }
            if let Some(checksum_hash) = command.checksum_hash {
                item.checksum_hash = checksum_hash;
            }
            item.updated_at = command.requested_at;
            Ok(Some(item.clone()))
        })
    }

    fn delete_artifact<'a>(
        &'a self,
        command: DeleteAdminSkillArtifactCommand,
    ) -> AdminSkillCommandFuture<'a, bool> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("delete_artifact");
            let mut artifacts = self.artifacts.lock().unwrap();
            let before = artifacts.len();
            artifacts.retain(|item| {
                item.id != command.artifact_id
                    || item.target_id != command.skill_id
                    || item.tenant_id != command.subject.tenant_id
                    || item.organization_id != command.subject.organization_id
                    || item.target_type != 35
            });
            Ok(artifacts.len() != before)
        })
    }
}

struct TestUuidGenerator;

impl EntityUuidGenerator for TestUuidGenerator {
    fn generate_entity_uuid(&self) -> DomainResult<String> {
        Ok("test-uuid".to_owned())
    }
}
