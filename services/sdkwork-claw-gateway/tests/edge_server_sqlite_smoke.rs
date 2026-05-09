use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::{to_bytes, Body};
use axum::http::{header, Method, Request, StatusCode};
use axum::response::IntoResponse;
use axum::routing::get;
use axum::{Json, Router};
use sdkwork_claw_test_support::{
    app_session_bearer_token, app_session_config, default_trusted_request_subject,
    payment_webhook_config, seeded_sqlite_catalog, trusted_subject_config,
};
use serde_json::json;
use tokio::net::TcpListener;
use tokio::sync::oneshot;
use tower::ServiceExt;

use sdkwork_claw_product::domain::{
    AiModel, BillingMeter, ModelPrice, ModelVendor, ModelVendorDefinition, Money, PriceSide,
};
use sdkwork_claw_product::infrastructure::InMemoryPricingCatalog;
use sdkwork_claw_product::ports::{
    AppRoutingApiKeyItem, AppRoutingChannelCommandFuture, AppRoutingChannelCommandStore,
    AppRoutingChannelDeleteOutcome, AppRoutingChannelItem, AppRoutingChannelMutationOutcome,
    AppRoutingChannelTestOutcome, AppRoutingMappingRule, AppRoutingModelStats,
    AppRoutingReadFuture, AppRoutingReadStore, AppRoutingRequestTraceItem,
    AppRoutingStrategyFuture, AppRoutingStrategySnapshot, AppRoutingStrategyStore,
    AppRoutingStrategySubject, AppRoutingStrategyType, AppRoutingSubject, AppRoutingUsageData,
    AppRoutingUsageSnapshot, CreateAppRoutingChannelCommand, DeleteAppRoutingChannelCommand,
    SetAppRoutingChannelStatusCommand, TestAppRoutingChannelCommand,
    UpdateAppRoutingChannelCommand, UpdateAppRoutingStrategyCommand,
    UpdateAppRoutingStrategyOutcome,
};

struct RunningService {
    base_url: String,
    stop: oneshot::Sender<()>,
}

#[tokio::test]
async fn edge_server_proxies_real_sqlite_gateway_admin_and_app_services() {
    let catalog = seeded_sqlite_catalog().await.unwrap();
    let database_config = catalog.database_config().unwrap();
    let api_key_config = catalog.api_key_security_config().unwrap();
    let trusted_subject_config = trusted_subject_config().unwrap();
    let app_session_config = app_session_config().unwrap();
    let payment_webhook_config = payment_webhook_config().unwrap();

    let gateway_router = sdkwork_claw_gateway::router_with_database_and_api_key_config(
        database_config.clone(),
        Some(api_key_config.clone()),
    )
    .await
    .unwrap();
    let admin_router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        database_config.clone(),
        Some(api_key_config.clone()),
        Some(trusted_subject_config.clone()),
        Some(app_session_config.clone()),
    )
    .await
    .unwrap();
    let app_router =
        sdkwork_claw_app_api::router_with_database_config_api_key_trusted_subject_and_app_session_config(
            database_config,
            api_key_config,
            trusted_subject_config,
            app_session_config,
            payment_webhook_config,
        )
        .await
        .unwrap();

    let gateway = spawn_router(gateway_router).await;
    let admin = spawn_router(admin_router).await;
    let app = spawn_router(app_router).await;
    let portal = spawn_router(portal_router()).await;

    let edge_router = sdkwork_claw_gateway::edge_server_router(
        sdkwork_claw_gateway::EdgeServerConfig::try_new(
            &gateway.base_url,
            &admin.base_url,
            &app.base_url,
            &portal.base_url,
        )
        .unwrap(),
    );

    let readyz = json_request(edge_router.clone(), Method::GET, "/readyz", Body::empty())
        .send()
        .await;
    assert_eq!(StatusCode::OK, readyz.status);
    assert_eq!("ok", readyz.json["status"]);
    assert_eq!("ok", readyz.json["upstreams"]["gateway"]["status"]);
    assert_eq!("ok", readyz.json["upstreams"]["backend"]["status"]);
    assert_eq!("ok", readyz.json["upstreams"]["app"]["status"]);
    assert_eq!("ok", readyz.json["upstreams"]["portal"]["status"]);

    let catalog_models = json_request(
        edge_router.clone(),
        Method::GET,
        "/v1/models",
        Body::empty(),
    )
    .with_authorization(catalog.gateway_authorization_header())
    .send()
    .await;
    assert_eq!(StatusCode::OK, catalog_models.status);
    assert_eq!("list", catalog_models.json["object"]);
    assert_eq!("gpt-5.5", catalog_models.json["data"][0]["id"]);
    assert_eq!("openai", catalog_models.json["data"][0]["owned_by"]);

    let admin_models = json_request(
        edge_router.clone(),
        Method::POST,
        "/backend/v3/api/model/list",
        Body::from("{}"),
    )
    .with_authorization(app_session_authorization_header())
    .with_content_type("application/json")
    .send()
    .await;
    assert_eq!(StatusCode::OK, admin_models.status);
    assert_eq!("2000", admin_models.json["code"]);
    let admin_model = &admin_models.json["data"]["items"][0];
    assert_eq!("101", admin_model["id"]);
    assert_eq!("1", admin_model["vendorId"]);
    assert_eq!("openai", admin_model["vendorCode"]);
    assert_eq!("gpt-5.5", admin_model["name"]);
    assert_eq!("Chat", admin_model["type"]);
    assert_eq!("5.0", admin_model["priceIn"]);
    assert_eq!("30.0", admin_model["priceOut"]);
    assert_eq!("active", admin_model["status"]);
    assert!(admin_model.get("priceAvailability").is_none());

    let app_models = json_request(
        edge_router.clone(),
        Method::GET,
        "/app/v3/api/router/models",
        Body::empty(),
    )
    .send()
    .await;
    assert_eq!(StatusCode::OK, app_models.status);
    assert_eq!("2000", app_models.json["code"]);
    assert_eq!("gpt-5.5", app_models.json["data"]["items"][0]["model"]);
    assert_eq!(
        "reference",
        app_models.json["data"]["items"][0]["priceAvailability"]["status"]
    );

    let portal_home = text_request(edge_router.clone(), Method::GET, "/").await;
    assert_eq!(StatusCode::OK, portal_home.status);
    assert!(portal_home.body.contains("sdkwork-claw-router portal"));

    let gateway_openapi = json_request(
        edge_router.clone(),
        Method::GET,
        "/openapi.json",
        Body::empty(),
    )
    .send()
    .await;
    assert_eq!(StatusCode::OK, gateway_openapi.status);
    assert!(gateway_openapi.json["openapi"].is_string());

    let admin_openapi = json_request(
        edge_router.clone(),
        Method::GET,
        "/backend/v3/api/openapi.json",
        Body::empty(),
    )
    .send()
    .await;
    assert_eq!(StatusCode::OK, admin_openapi.status);
    assert!(admin_openapi.json["openapi"].is_string());

    let app_openapi = json_request(
        edge_router,
        Method::GET,
        "/app/v3/api/openapi.json",
        Body::empty(),
    )
    .send()
    .await;
    assert_eq!(StatusCode::OK, app_openapi.status);
    assert!(app_openapi.json["openapi"].is_string());

    let _ = gateway.stop.send(());
    let _ = admin.stop.send(());
    let _ = app.stop.send(());
    let _ = portal.stop.send(());
}

#[tokio::test]
async fn edge_server_proxies_app_router_console_routing_api_through_generated_sdk_paths() {
    let catalog = seeded_sqlite_catalog().await.unwrap();
    let database_config = catalog.database_config().unwrap();
    let api_key_config = catalog.api_key_security_config().unwrap();
    let trusted_subject_config = trusted_subject_config().unwrap();
    let app_session_config = app_session_config().unwrap();
    let routing_store = Arc::new(InMemoryAppRoutingStore::default());
    let app_router = sdkwork_claw_http::service_router_with_contract_routes(
        "sdkwork-claw-app-routing-smoke",
        sdkwork_claw_http::ApiSurface::App,
    )
    .merge(sdkwork_claw_product::api::app_model_catalog_router(
        Arc::new(app_smoke_model_catalog()),
    ))
    .merge(sdkwork_claw_product::api::app_routing_router_with_read_store(routing_store.clone()))
    .merge(
        sdkwork_claw_product::api::app_routing_strategy_router_with_store(
            routing_store.clone(),
            Arc::new(DeterministicEntityUuidGenerator),
        ),
    )
    .merge(
        sdkwork_claw_product::api::app_routing_channel_command_router_with_store(
            routing_store,
            Arc::new(DeterministicEntityUuidGenerator),
        ),
    )
    .layer(axum::middleware::from_fn_with_state(
        sdkwork_claw_http::AppSubjectBoundaryConfig::new(
            trusted_subject_config.clone(),
            app_session_config.clone(),
        ),
        sdkwork_claw_http::app_request_subject_boundary,
    ));
    let gateway_router = sdkwork_claw_gateway::router_with_database_and_api_key_config(
        database_config.clone(),
        Some(api_key_config.clone()),
    )
    .await
    .unwrap();
    let admin_router = sdkwork_claw_admin_api::router_with_database_and_api_key_config(
        database_config,
        Some(api_key_config),
        Some(trusted_subject_config),
        Some(app_session_config),
    )
    .await
    .unwrap();

    let gateway = spawn_router(gateway_router).await;
    let admin = spawn_router(admin_router).await;
    let app = spawn_router(app_router).await;
    let portal = spawn_router(portal_router()).await;
    let edge_router = sdkwork_claw_gateway::edge_server_router(
        sdkwork_claw_gateway::EdgeServerConfig::try_new(
            &gateway.base_url,
            &admin.base_url,
            &app.base_url,
            &portal.base_url,
        )
        .unwrap(),
    );
    let app_authorization = app_session_authorization_header();

    let models = json_request(
        edge_router.clone(),
        Method::GET,
        "/app/v3/api/router/models",
        Body::empty(),
    )
    .with_authorization(app_authorization.clone())
    .send()
    .await;
    assert_eq!(StatusCode::OK, models.status);
    assert_eq!("2000", models.json["code"]);
    assert_eq!("gpt-4o-mini", models.json["data"]["items"][0]["model"]);

    let channels = json_request(
        edge_router.clone(),
        Method::GET,
        "/app/v3/api/router/routing/channels",
        Body::empty(),
    )
    .with_authorization(app_authorization.clone())
    .send()
    .await;
    assert_eq!(StatusCode::OK, channels.status);
    assert_eq!("2000", channels.json["code"]);
    assert_eq!("OpenAI Primary", channels.json["data"]["items"][0]["name"]);
    assert_eq!(
        "ref:***openai-main",
        channels.json["data"]["items"][0]["apiKey"]
    );

    let api_keys = json_request(
        edge_router.clone(),
        Method::GET,
        "/app/v3/api/router/routing/api-keys",
        Body::empty(),
    )
    .with_authorization(app_authorization.clone())
    .send()
    .await;
    assert_eq!(StatusCode::OK, api_keys.status);
    assert_eq!("Owner Key", api_keys.json["data"]["items"][0]["name"]);

    let traces = json_request(
        edge_router.clone(),
        Method::GET,
        "/app/v3/api/router/routing/request-traces",
        Body::empty(),
    )
    .with_authorization(app_authorization.clone())
    .send()
    .await;
    assert_eq!(StatusCode::OK, traces.status);
    assert_eq!("trace-1", traces.json["data"]["items"][0]["id"]);
    assert_eq!("gpt-4o-mini", traces.json["data"]["items"][0]["model"]);

    let usage = json_request(
        edge_router.clone(),
        Method::GET,
        "/app/v3/api/router/routing/usage",
        Body::empty(),
    )
    .with_authorization(app_authorization.clone())
    .send()
    .await;
    assert_eq!(StatusCode::OK, usage.status);
    assert_eq!(1, usage.json["data"]["chartData"][0]["requests"]);
    assert_eq!("gpt-4o-mini", usage.json["data"]["modelStats"][0]["m"]);

    let strategy = json_request(
        edge_router.clone(),
        Method::GET,
        "/app/v3/api/router/routing/strategy",
        Body::empty(),
    )
    .with_authorization(app_authorization.clone())
    .send()
    .await;
    assert_eq!(StatusCode::OK, strategy.status);
    assert_eq!("weighted", strategy.json["data"]["strategy"]);
    assert_eq!(
        "gpt-4",
        strategy.json["data"]["mappingRules"][0]["sourceModel"]
    );

    let updated_strategy = json_request(
        edge_router.clone(),
        Method::PUT,
        "/app/v3/api/router/routing/strategy",
        Body::from(
            json!({
                "strategy": "cost",
                "mappingRules": [
                    {
                        "id": "rule-edge",
                        "sourceModel": "gpt-4o",
                        "targetModel": "openai-gpt-4o-low-cost"
                    }
                ]
            })
            .to_string(),
        ),
    )
    .with_authorization(app_authorization.clone())
    .with_content_type("application/json")
    .send()
    .await;
    assert_eq!(StatusCode::OK, updated_strategy.status);
    assert_eq!(true, updated_strategy.json["data"]["success"]);

    let create_channel = json_request(
        edge_router.clone(),
        Method::POST,
        "/app/v3/api/router/routing/channels",
        Body::from(
            json!({
                "name": "Edge Created OpenAI",
                "vendor": "OpenAI",
                "protocol": "OpenAI",
                "accessType": "Standard API Key",
                "baseUrl": "https://edge-created.example/v1",
                "secretRef": "vault://providers/openai/edge-created",
                "models": ["gpt-4o-mini"],
                "capabilities": ["llm"],
                "weight": 25,
                "status": "active"
            })
            .to_string(),
        ),
    )
    .with_authorization(app_authorization.clone())
    .with_content_type("application/json")
    .send()
    .await;
    assert_eq!(StatusCode::OK, create_channel.status);
    assert_eq!("2000", create_channel.json["code"]);
    assert_eq!(
        "Edge Created OpenAI",
        create_channel.json["data"]["item"]["name"]
    );
    let created_channel_id = create_channel.json["data"]["item"]["id"]
        .as_str()
        .unwrap()
        .to_owned();

    let update_channel = json_request(
        edge_router.clone(),
        Method::PUT,
        &format!("/app/v3/api/router/routing/channels/{created_channel_id}"),
        Body::from(
            json!({
                "name": "Edge Updated OpenAI",
                "models": ["gpt-4o"],
                "weight": 30
            })
            .to_string(),
        ),
    )
    .with_authorization(app_authorization.clone())
    .with_content_type("application/json")
    .send()
    .await;
    assert_eq!(StatusCode::OK, update_channel.status);
    assert_eq!(
        "Edge Updated OpenAI",
        update_channel.json["data"]["item"]["name"]
    );
    assert_eq!(30, update_channel.json["data"]["item"]["weight"]);

    let status = json_request(
        edge_router.clone(),
        Method::PUT,
        &format!("/app/v3/api/router/routing/channels/{created_channel_id}/status"),
        Body::from(r#"{"status":"disabled"}"#),
    )
    .with_authorization(app_authorization.clone())
    .with_content_type("application/json")
    .send()
    .await;
    assert_eq!(StatusCode::OK, status.status);
    assert_eq!("disabled", status.json["data"]["item"]["status"]);

    let test_channel = json_request(
        edge_router.clone(),
        Method::POST,
        &format!("/app/v3/api/router/routing/channels/{created_channel_id}/test"),
        Body::empty(),
    )
    .with_authorization(app_authorization.clone())
    .send()
    .await;
    assert_eq!(StatusCode::OK, test_channel.status);
    assert_eq!(true, test_channel.json["data"]["success"]);
    assert_eq!(created_channel_id, test_channel.json["data"]["channelId"]);

    let delete_channel = json_request(
        edge_router,
        Method::DELETE,
        &format!("/app/v3/api/router/routing/channels/{created_channel_id}"),
        Body::empty(),
    )
    .with_authorization(app_authorization)
    .send()
    .await;
    assert_eq!(StatusCode::OK, delete_channel.status);
    assert_eq!(true, delete_channel.json["data"]["deleted"]);

    let _ = gateway.stop.send(());
    let _ = admin.stop.send(());
    let _ = app.stop.send(());
    let _ = portal.stop.send(());
}

struct JsonRequestBuilder {
    router: Router,
    method: Method,
    uri: String,
    body: Body,
    authorization: Option<String>,
    content_type: Option<&'static str>,
}

impl JsonRequestBuilder {
    fn with_authorization(mut self, authorization: String) -> Self {
        self.authorization = Some(authorization);
        self
    }

    fn with_content_type(mut self, content_type: &'static str) -> Self {
        self.content_type = Some(content_type);
        self
    }

    async fn send(self) -> JsonResponse {
        let mut builder = Request::builder()
            .method(self.method)
            .uri(self.uri)
            .header(header::HOST, "sdkwork.example.test");
        if let Some(authorization) = self.authorization {
            builder = builder.header(header::AUTHORIZATION, authorization);
        }
        if let Some(content_type) = self.content_type {
            builder = builder.header(header::CONTENT_TYPE, content_type);
        }

        let response = self
            .router
            .oneshot(builder.body(self.body).unwrap())
            .await
            .unwrap();
        let status = response.status();
        let body = to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let json = serde_json::from_slice(&body).unwrap_or_else(|error| {
            panic!(
                "expected JSON response but got parse error {error}; body={}",
                String::from_utf8_lossy(&body)
            )
        });
        JsonResponse { status, json }
    }
}

struct JsonResponse {
    status: StatusCode,
    json: serde_json::Value,
}

struct TextResponse {
    status: StatusCode,
    body: String,
}

fn json_request(router: Router, method: Method, uri: &str, body: Body) -> JsonRequestBuilder {
    JsonRequestBuilder {
        router,
        method,
        uri: uri.to_owned(),
        body,
        authorization: None,
        content_type: None,
    }
}

async fn text_request(router: Router, method: Method, uri: &str) -> TextResponse {
    let response = router
        .oneshot(
            Request::builder()
                .method(method)
                .uri(uri)
                .header(header::HOST, "sdkwork.example.test")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    let status = response.status();
    let body = to_bytes(response.into_body(), usize::MAX).await.unwrap();
    TextResponse {
        status,
        body: String::from_utf8_lossy(&body).into_owned(),
    }
}

async fn spawn_router(router: Router) -> RunningService {
    let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
    let address = listener.local_addr().unwrap();
    let (stop, stopped) = oneshot::channel::<()>();

    tokio::spawn(async move {
        axum::serve(listener, router)
            .with_graceful_shutdown(async {
                let _ = stopped.await;
            })
            .await
            .unwrap();
    });

    RunningService {
        base_url: format!("http://{address}"),
        stop,
    }
}

fn portal_router() -> Router {
    Router::new()
        .route(
            "/healthz",
            get(|| async {
                Json(json!({
                    "status": "ok",
                    "service": "sdkwork-claw-router-portal",
                }))
                .into_response()
            }),
        )
        .fallback(|| async { "sdkwork-claw-router portal" })
}

fn app_session_authorization_header() -> String {
    let issued_at = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0);
    let expires_at = issued_at + 300;
    app_session_bearer_token(default_trusted_request_subject(), issued_at, expires_at).unwrap()
}

fn app_smoke_model_catalog() -> InMemoryPricingCatalog {
    let mut catalog = InMemoryPricingCatalog::default();
    catalog.add_vendor(ModelVendorDefinition::new(
        "openai",
        ModelVendor::OpenAi,
        "OpenAI",
    ));
    catalog.add_model(AiModel::new(
        "gpt-4o-mini",
        "GPT-4o mini",
        "openai",
        vec!["chat", "tools"],
    ));
    catalog.add_price(ModelPrice::new_for_catalog_key(
        "openai/global/gpt-4o-mini",
        "gpt-4o-mini",
        PriceSide::OfficialReference,
        BillingMeter::LlmInputToken,
        Money::usd("0.150000").unwrap(),
    ));
    catalog
}

#[derive(Default)]
struct InMemoryAppRoutingStore {
    channels: Mutex<Vec<AppRoutingChannelItem>>,
    strategy: Mutex<AppRoutingStrategySnapshot>,
}

impl InMemoryAppRoutingStore {
    fn channels_snapshot(&self) -> Vec<AppRoutingChannelItem> {
        let mut channels = self.channels.lock().unwrap();
        if channels.is_empty() {
            channels.push(default_routing_channel("3001", "OpenAI Primary"));
        }
        channels.clone()
    }

    fn strategy_snapshot(&self) -> AppRoutingStrategySnapshot {
        let mut strategy = self.strategy.lock().unwrap();
        if strategy.mapping_rules.is_empty() {
            *strategy = AppRoutingStrategySnapshot {
                strategy: AppRoutingStrategyType::Weighted,
                mapping_rules: vec![AppRoutingMappingRule {
                    id: "rule-1".to_owned(),
                    source_model: "gpt-4".to_owned(),
                    target_model: "azure-gpt4-32k".to_owned(),
                }],
            };
        }
        strategy.clone()
    }
}

impl AppRoutingReadStore for InMemoryAppRoutingStore {
    fn load_routing_channels<'a>(
        &'a self,
        _subject: Option<AppRoutingSubject>,
    ) -> AppRoutingReadFuture<'a, Vec<AppRoutingChannelItem>> {
        Box::pin(async move { Ok(self.channels_snapshot()) })
    }

    fn load_routing_api_keys<'a>(
        &'a self,
        _subject: Option<AppRoutingSubject>,
    ) -> AppRoutingReadFuture<'a, Vec<AppRoutingApiKeyItem>> {
        Box::pin(async move {
            Ok(vec![AppRoutingApiKeyItem {
                id: "100".to_owned(),
                name: "Owner Key".to_owned(),
                key: "sk-owner********ABCD".to_owned(),
                status: "enabled".to_owned(),
                total_usage: "5".to_owned(),
                created_at: "2026-04-29 12:00:00".to_owned(),
            }])
        })
    }

    fn load_routing_request_traces<'a>(
        &'a self,
        _subject: Option<AppRoutingSubject>,
    ) -> AppRoutingReadFuture<'a, Vec<AppRoutingRequestTraceItem>> {
        Box::pin(async move {
            Ok(vec![AppRoutingRequestTraceItem {
                id: "trace-1".to_owned(),
                time: "2026-04-29 12:01:00".to_owned(),
                model: "gpt-4o-mini".to_owned(),
                channel: "OpenAI Primary".to_owned(),
                status: 200,
                duration: "345ms".to_owned(),
                tokens: 150,
            }])
        })
    }

    fn load_routing_usage<'a>(
        &'a self,
        _subject: Option<AppRoutingSubject>,
    ) -> AppRoutingReadFuture<'a, AppRoutingUsageSnapshot> {
        Box::pin(async move {
            Ok(AppRoutingUsageSnapshot {
                chart_data: vec![AppRoutingUsageData {
                    time: "2026-04-29".to_owned(),
                    requests: 1,
                    latency: 345,
                }],
                model_stats: vec![AppRoutingModelStats {
                    m: "gpt-4o-mini".to_owned(),
                    req: "1".to_owned(),
                    sr: "100.0%".to_owned(),
                    tok: "150".to_owned(),
                    lat: "345ms".to_owned(),
                }],
            })
        })
    }
}

impl AppRoutingStrategyStore for InMemoryAppRoutingStore {
    fn load_routing_strategy<'a>(
        &'a self,
        _subject: Option<AppRoutingStrategySubject>,
    ) -> AppRoutingStrategyFuture<'a, AppRoutingStrategySnapshot> {
        Box::pin(async move { Ok(self.strategy_snapshot()) })
    }

    fn update_routing_strategy<'a>(
        &'a self,
        command: UpdateAppRoutingStrategyCommand,
    ) -> AppRoutingStrategyFuture<'a, UpdateAppRoutingStrategyOutcome> {
        Box::pin(async move {
            *self.strategy.lock().unwrap() = command.snapshot;
            Ok(UpdateAppRoutingStrategyOutcome { success: true })
        })
    }
}

impl AppRoutingChannelCommandStore for InMemoryAppRoutingStore {
    fn create_channel<'a>(
        &'a self,
        command: CreateAppRoutingChannelCommand,
    ) -> AppRoutingChannelCommandFuture<'a, AppRoutingChannelMutationOutcome> {
        Box::pin(async move {
            let mut channels = self.channels.lock().unwrap();
            let id = (channels.len() + 4001).to_string();
            let item = AppRoutingChannelItem {
                id,
                name: command.name,
                vendor: command.vendor.clone(),
                provider: command.vendor,
                provider_code: command.provider_code,
                protocol: command.protocol,
                access_type: command.access_type,
                base_url: command.base_url.unwrap_or_default(),
                api_key: "ref:***edge-created".to_owned(),
                models: command.models,
                capabilities: command.capabilities,
                is_multimodal: command.is_multimodal,
                weight: command.weight,
                status: command.status,
                latency: "N/A".to_owned(),
                rpm: 0,
                balance: "N/A".to_owned(),
                errors: 0,
            };
            channels.push(item.clone());
            Ok(AppRoutingChannelMutationOutcome { item })
        })
    }

    fn update_channel<'a>(
        &'a self,
        command: UpdateAppRoutingChannelCommand,
    ) -> AppRoutingChannelCommandFuture<'a, Option<AppRoutingChannelMutationOutcome>> {
        Box::pin(async move {
            let mut channels = self.channels.lock().unwrap();
            let Some(item) = channels
                .iter_mut()
                .find(|item| item.id == command.channel_id.to_string())
            else {
                return Ok(None);
            };
            if let Some(name) = command.name {
                item.name = name;
            }
            if let Some(vendor) = command.vendor {
                item.vendor = vendor.clone();
                item.provider = vendor;
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
                item.base_url = base_url.unwrap_or_default();
            }
            if let Some(models) = command.models {
                item.models = models;
            }
            if let Some(capabilities) = command.capabilities {
                item.capabilities = capabilities;
            }
            if let Some(weight) = command.weight {
                item.weight = weight;
            }
            if let Some(status) = command.status {
                item.status = status;
            }
            Ok(Some(AppRoutingChannelMutationOutcome {
                item: item.clone(),
            }))
        })
    }

    fn set_channel_status<'a>(
        &'a self,
        command: SetAppRoutingChannelStatusCommand,
    ) -> AppRoutingChannelCommandFuture<'a, Option<AppRoutingChannelMutationOutcome>> {
        Box::pin(async move {
            let mut channels = self.channels.lock().unwrap();
            let Some(item) = channels
                .iter_mut()
                .find(|item| item.id == command.channel_id.to_string())
            else {
                return Ok(None);
            };
            item.status = command.status;
            Ok(Some(AppRoutingChannelMutationOutcome {
                item: item.clone(),
            }))
        })
    }

    fn delete_channel<'a>(
        &'a self,
        command: DeleteAppRoutingChannelCommand,
    ) -> AppRoutingChannelCommandFuture<'a, AppRoutingChannelDeleteOutcome> {
        Box::pin(async move {
            let mut channels = self.channels.lock().unwrap();
            let before = channels.len();
            channels.retain(|item| item.id != command.channel_id.to_string());
            Ok(AppRoutingChannelDeleteOutcome {
                deleted: before != channels.len(),
            })
        })
    }

    fn test_channel<'a>(
        &'a self,
        command: TestAppRoutingChannelCommand,
    ) -> AppRoutingChannelCommandFuture<'a, Option<AppRoutingChannelTestOutcome>> {
        Box::pin(async move {
            let channels = self.channels.lock().unwrap();
            let Some(item) = channels
                .iter()
                .find(|item| item.id == command.channel_id.to_string())
                .cloned()
            else {
                return Ok(None);
            };
            Ok(Some(AppRoutingChannelTestOutcome {
                channel_id: command.channel_id.to_string(),
                success: true,
                status: item.status.clone(),
                latency: "12ms".to_owned(),
                item,
            }))
        })
    }
}

struct DeterministicEntityUuidGenerator;

impl sdkwork_claw_product::application::EntityUuidGenerator for DeterministicEntityUuidGenerator {
    fn generate_entity_uuid(&self) -> sdkwork_claw_product::domain::DomainResult<String> {
        Ok("edge-smoke-uuid".to_owned())
    }
}

fn default_routing_channel(id: &str, name: &str) -> AppRoutingChannelItem {
    AppRoutingChannelItem {
        id: id.to_owned(),
        name: name.to_owned(),
        vendor: "OpenAI".to_owned(),
        provider: "OpenAI".to_owned(),
        provider_code: "openai".to_owned(),
        protocol: "OpenAI".to_owned(),
        access_type: "Standard API Key".to_owned(),
        base_url: "https://api.openai.example/v1".to_owned(),
        api_key: "ref:***openai-main".to_owned(),
        models: vec!["gpt-4o-mini".to_owned()],
        capabilities: vec!["llm".to_owned()],
        is_multimodal: false,
        weight: 100,
        status: "active".to_owned(),
        latency: "120ms".to_owned(),
        rpm: 60,
        balance: "N/A".to_owned(),
        errors: 0,
    }
}
