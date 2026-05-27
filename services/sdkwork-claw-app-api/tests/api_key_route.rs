use std::collections::HashSet;
use std::sync::atomic::{AtomicI64, Ordering};
use std::sync::Arc;
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_config::{ApiKeySecurityConfig, AppSessionConfig, TrustedSubjectConfig};
use sdkwork_claw_http::{
    sign_app_session_token, sign_trusted_request_subject, TrustedRequestSubject,
};
use sdkwork_claw_product::domain::{
    AiModel, ApiKeyGroup, ApiKeyGroupMetricSnapshot, BillingMeter, DecimalValue, DomainError,
    GatewayAccessPolicy, GatewayApiKey, ModelPrice, ModelProviderRoute, ModelVendor,
    ModelVendorDefinition, Money, PriceSide, PricingPlan, QuotaPolicy,
};
use sdkwork_claw_product::infrastructure::InMemoryPricingCatalog;
use sdkwork_claw_product::ports::{
    ApiKeyCommandStoreFuture, ApiKeyManagementReadFuture, AppSessionEventStore,
    AppSessionEventStoreFuture, CreateGatewayApiKeyCommand, CreatedGatewayApiKey,
    DeleteGatewayApiKeyCommand, EnsureDefaultApiKeyGroupCommand, GatewayApiKeyCommandStore,
    GatewayApiKeyManagementReadStore, GatewayApiKeyManagementSnapshot, PricingCatalog,
    RecordAppSessionIssuedEventCommand, UpdateGatewayApiKeyCommand, UpdatedGatewayApiKey,
};
use tower::ServiceExt;

const API_KEYS_PATH: &str = "/app/v3/api/iam/api_keys";
const TRUSTED_SUBJECT_SECRET: &str = "trusted-subject-secret-0123456789";
const APP_SESSION_SECRET: &str = "app-session-secret-0123456789abcd";
const INTERNAL_TENANT_HEADER: &str = concat!("x-sdkwork-", "tenant-id");
const INTERNAL_ORGANIZATION_HEADER: &str = concat!("x-sdkwork-", "organization-id");
const INTERNAL_USER_HEADER: &str = concat!("x-sdkwork-", "user-id");

fn catalog() -> InMemoryPricingCatalog {
    let mut catalog = InMemoryPricingCatalog::default();
    catalog.add_api_key_group(ApiKeyGroup::new(
        10,
        "standard-group",
        "standard",
        DecimalValue::parse("1.000000").unwrap(),
        DecimalValue::parse("1.100000").unwrap(),
    ));
    catalog.add_api_key(
        GatewayApiKey::new(100, 10, "sk-test", "hash:sk-live-secret")
            .with_owner(10, 20, 30)
            .with_management_metadata(
                "Production Key",
                "sk-test********ABCD",
                Some(700),
                Some(900),
                "2026-04-10 20:55:41",
                Some("2027-01-01 00:00:00"),
            )
            .with_copyable_key("sk-live-secret"),
    );
    catalog.add_access_policy(GatewayAccessPolicy::new(
        700,
        vec!["text".to_owned(), "image".to_owned()],
        vec!["192.168.1.1".to_owned(), "10.0.0.0/24".to_owned()],
    ));
    catalog.add_quota_policy(QuotaPolicy::new(
        900,
        Some(DecimalValue::parse("1000.000000").unwrap()),
    ));
    catalog.add_api_key_group_metric_snapshot(ApiKeyGroupMetricSnapshot::new(
        10,
        Some(DecimalValue::parse("37.500000").unwrap()),
        Some(DecimalValue::parse("1000.000000").unwrap()),
        Some(DecimalValue::parse("37.500000").unwrap()),
        Some("2026-04-29 00:00:00".to_owned()),
    ));
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
    catalog.add_provider_route(ModelProviderRoute::new_for_catalog_key(
        "openai/global/gpt-4o-mini",
        "gpt-4o-mini",
        "openrouter",
        3001,
        "openai/global/gpt-4o-mini",
    ));
    catalog.add_plan(PricingPlan::new(
        "standard",
        PriceSide::OfficialReference,
        DecimalValue::parse("1.200000").unwrap(),
        Money::usd("0.000000").unwrap(),
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

fn secured_router() -> axum::Router {
    let store = Arc::new(TestGatewayApiKeyStore::new(catalog()));
    let read_store: Arc<dyn GatewayApiKeyManagementReadStore + Send + Sync> = store.clone();
    let command_store: Arc<dyn GatewayApiKeyCommandStore + Send + Sync> = store;

    sdkwork_claw_app_api::router_with_api_key_management_read_store_command_store_and_api_key_security_config(
        read_store,
        command_store,
        Arc::new(TestAppSessionEventStore::default()),
        ApiKeySecurityConfig::from_pepper_secret("0123456789abcdef0123456789abcdef").unwrap(),
        trusted_subject_config(),
        app_session_config(),
    )
    .unwrap()
}

fn trusted_subject_config() -> TrustedSubjectConfig {
    TrustedSubjectConfig::from_signing_secret(TRUSTED_SUBJECT_SECRET).unwrap()
}

fn app_session_config() -> AppSessionConfig {
    AppSessionConfig::from_signing_secret(APP_SESSION_SECRET).unwrap()
}

fn session_authorization_header(
    builder: axum::http::request::Builder,
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
) -> axum::http::request::Builder {
    let issued_at = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0);
    let expires_at = issued_at + 300;
    let subject = TrustedRequestSubject {
        tenant_id,
        organization_id,
        user_id,
        operator_id: user_id,
        operator_type: 1,
    };
    let auth_token = sign_app_session_token(&app_session_config(), subject, issued_at, expires_at);
    let access_token = sign_app_session_token(
        &app_session_config(),
        subject,
        issued_at + 1,
        expires_at + 1,
    );
    builder
        .header("authorization", format!("Bearer {auth_token}"))
        .header("Access-Token", access_token)
}

fn signed_subject_headers(
    builder: axum::http::request::Builder,
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
) -> axum::http::request::Builder {
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0);
    let subject = TrustedRequestSubject {
        tenant_id,
        organization_id,
        user_id,
        operator_id: user_id,
        operator_type: 1,
    };
    let signature = sign_trusted_request_subject(
        &trusted_subject_config(),
        subject,
        timestamp,
        "POST",
        API_KEYS_PATH,
    );
    builder
        .header("x-sdkwork-subject-tenant-id", tenant_id.to_string())
        .header(
            "x-sdkwork-subject-organization-id",
            organization_id.to_string(),
        )
        .header("x-sdkwork-subject-user-id", user_id.to_string())
        .header("x-sdkwork-subject-timestamp", timestamp.to_string())
        .header("x-sdkwork-subject-signature", signature)
}

#[derive(Debug)]
struct TestGatewayApiKeyStore {
    catalog: Mutex<InMemoryPricingCatalog>,
    idempotency_keys: Mutex<HashSet<(i64, String)>>,
    next_api_key_id: AtomicI64,
    next_access_policy_id: AtomicI64,
    next_quota_policy_id: AtomicI64,
}

impl TestGatewayApiKeyStore {
    fn new(catalog: InMemoryPricingCatalog) -> Self {
        Self {
            catalog: Mutex::new(catalog),
            idempotency_keys: Mutex::new(HashSet::new()),
            next_api_key_id: AtomicI64::new(1_000_000),
            next_access_policy_id: AtomicI64::new(2_000_000),
            next_quota_policy_id: AtomicI64::new(3_000_000),
        }
    }
}

#[derive(Debug, Default)]
struct TestAppSessionEventStore {
    events: Mutex<Vec<RecordAppSessionIssuedEventCommand>>,
}

impl AppSessionEventStore for TestAppSessionEventStore {
    fn record_app_session_issued<'a>(
        &'a self,
        command: RecordAppSessionIssuedEventCommand,
    ) -> AppSessionEventStoreFuture<'a, ()> {
        Box::pin(async move {
            self.events
                .lock()
                .map_err(|_| DomainError::new("test app session event lock poisoned"))?
                .push(command);
            Ok(())
        })
    }
}

impl GatewayApiKeyManagementReadStore for TestGatewayApiKeyStore {
    fn load_gateway_api_key_management_snapshot<'a>(
        &'a self,
    ) -> ApiKeyManagementReadFuture<'a, GatewayApiKeyManagementSnapshot> {
        Box::pin(async move {
            let catalog = self
                .catalog
                .lock()
                .map_err(|_| DomainError::new("test api key catalog lock poisoned"))?;
            Ok(GatewayApiKeyManagementSnapshot::from_pricing_catalog(
                &*catalog,
            ))
        })
    }
}

impl GatewayApiKeyCommandStore for TestGatewayApiKeyStore {
    fn ensure_default_api_key_group<'a>(
        &'a self,
        command: EnsureDefaultApiKeyGroupCommand,
    ) -> ApiKeyCommandStoreFuture<'a, ApiKeyGroup> {
        Box::pin(async move {
            let mut catalog = self
                .catalog
                .lock()
                .map_err(|_| DomainError::new("test api key catalog lock poisoned"))?;
            if let Some(group) = catalog.list_api_key_groups().into_iter().find(|group| {
                group.code == command.code
                    && (group.tenant_id == 0 || group.tenant_id == command.tenant_id)
                    && (group.organization_id == 0
                        || group.organization_id == command.organization_id)
            }) {
                return Ok(group);
            }
            let group = ApiKeyGroup::new_scoped(
                500,
                command.tenant_id,
                command.organization_id,
                &command.code,
                &command.pricing_plan_code,
                command.rate_multiplier,
                command.official_price_multiplier,
            );
            catalog.add_api_key_group(group.clone());
            Ok(group)
        })
    }

    fn create_gateway_api_key<'a>(
        &'a self,
        command: CreateGatewayApiKeyCommand,
    ) -> ApiKeyCommandStoreFuture<'a, CreatedGatewayApiKey> {
        Box::pin(async move {
            {
                let mut idempotency_keys = self
                    .idempotency_keys
                    .lock()
                    .map_err(|_| DomainError::new("test idempotency key lock poisoned"))?;
                if !idempotency_keys.insert((command.tenant_id, command.idempotency_key.clone())) {
                    return Err(DomainError::conflict(
                        "api key creation idempotency key has already been used",
                    ));
                }
            }
            let access_policy = command.requires_access_policy().then(|| {
                GatewayAccessPolicy::new(
                    self.next_access_policy_id.fetch_add(1, Ordering::Relaxed),
                    command.allowed_capabilities.clone(),
                    command.ip_allowlist.clone(),
                )
            });
            let quota_policy = command.quota_limit.map(|quota_limit| {
                QuotaPolicy::new(
                    self.next_quota_policy_id.fetch_add(1, Ordering::Relaxed),
                    Some(quota_limit),
                )
            });
            let api_key = GatewayApiKey {
                id: self.next_api_key_id.fetch_add(1, Ordering::Relaxed),
                tenant_id: command.tenant_id,
                organization_id: command.organization_id,
                user_id: command.user_id,
                group_id: command.group_id,
                name: command.name,
                key_prefix: command.key_prefix,
                key_display_masked: command.key_display_masked,
                key_hash: command.key_hash,
                copyable_key: Some(command.copyable_key),
                policy_id: access_policy.as_ref().map(|policy| policy.id),
                quota_policy_id: quota_policy.as_ref().map(|policy| policy.id),
                created_at: command.created_at,
                expire_at: command.expire_at,
                status_code: 1,
                default_for_runtime: command.default_for_runtime,
            };

            let mut catalog = self
                .catalog
                .lock()
                .map_err(|_| DomainError::new("test api key catalog lock poisoned"))?;
            catalog.add_api_key(api_key.clone());
            if let Some(access_policy) = access_policy.clone() {
                catalog.add_access_policy(access_policy);
            }
            if let Some(quota_policy) = quota_policy.clone() {
                catalog.add_quota_policy(quota_policy);
            }

            Ok(CreatedGatewayApiKey {
                api_key,
                access_policy,
                quota_policy,
            })
        })
    }

    fn update_gateway_api_key<'a>(
        &'a self,
        command: UpdateGatewayApiKeyCommand,
    ) -> ApiKeyCommandStoreFuture<'a, Option<UpdatedGatewayApiKey>> {
        Box::pin(async move {
            let mut catalog = self
                .catalog
                .lock()
                .map_err(|_| DomainError::new("test api key catalog lock poisoned"))?;
            let existing = catalog.list_api_keys().into_iter().find(|api_key| {
                api_key.id == command.api_key_id
                    && api_key.tenant_id == command.tenant_id
                    && api_key.organization_id == command.organization_id
                    && api_key.user_id == command.user_id
            });
            let Some(mut api_key) = existing else {
                return Ok(None);
            };
            if let Some(name) = command.name {
                api_key.name = name;
            }
            if let Some(group_id) = command.group_id {
                api_key.group_id = group_id;
            }
            if let Some(expire_at) = command.expire_at {
                api_key.expire_at = expire_at;
            }
            if let Some(default_for_runtime) = command.default_for_runtime {
                api_key.default_for_runtime = default_for_runtime;
            }
            catalog.add_api_key(api_key.clone());
            Ok(Some(UpdatedGatewayApiKey {
                api_key,
                access_policy: None,
                quota_policy: None,
            }))
        })
    }

    fn delete_gateway_api_key<'a>(
        &'a self,
        command: DeleteGatewayApiKeyCommand,
    ) -> ApiKeyCommandStoreFuture<'a, bool> {
        Box::pin(async move {
            let catalog = self
                .catalog
                .lock()
                .map_err(|_| DomainError::new("test api key catalog lock poisoned"))?;
            Ok(catalog.list_api_keys().into_iter().any(|api_key| {
                api_key.id == command.api_key_id
                    && api_key.tenant_id == command.tenant_id
                    && api_key.organization_id == command.organization_id
                    && api_key.user_id == command.user_id
            }))
        })
    }
}

#[tokio::test]
async fn injected_product_catalog_serves_app_api_keys_without_secret_material() {
    let router = sdkwork_claw_app_api::router_with_product_catalog(Arc::new(catalog()));
    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri(API_KEYS_PATH)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body_text = String::from_utf8(body.to_vec()).unwrap();
    let payload: serde_json::Value = serde_json::from_str(&body_text).unwrap();

    assert_eq!("2000", payload["code"]);
    let item = &payload["data"]["items"][0];
    assert_eq!("100", item["id"]);
    assert_eq!("Production Key", item["name"]);
    assert_eq!("sk-test********ABCD", item["maskedKey"]);
    assert!(item.get("copyableKey").is_none());
    assert!(item.get("keyVal").is_none());
    assert!(item.get("fullKey").is_none());
    assert_eq!("standard-group", item["group"]);
    assert_eq!("1.00x", item["rate"]);
    assert_eq!("1000.000000", item["quota"]);
    assert_eq!("37.500000", item["usedQuota"]);
    assert_eq!("text", item["modalities"][0]);
    assert_eq!("image", item["modalities"][1]);
    assert_eq!("192.168.1.1, 10.0.0.0/24", item["ipLimit"]);
    assert_eq!("2026-04-10 20:55:41", item["created"]);
    assert_eq!("2027-01-01 00:00:00", item["expires"]);
    assert_eq!("enabled", item["status"]);
    assert!(!body_text.contains("hash:sk-live-secret"));
    assert!(!body_text.contains("sk-live-secret"));
    assert!(!body_text.contains("keyHash"));
    assert!(!body_text.contains("key_hash"));
}

#[tokio::test]
async fn injected_product_catalog_serves_app_model_catalog_without_secret_material() {
    let router = sdkwork_claw_app_api::router_with_product_catalog(Arc::new(catalog()));
    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/ai/models")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body_text = String::from_utf8(body.to_vec()).unwrap();
    let payload: serde_json::Value = serde_json::from_str(&body_text).unwrap();

    assert_eq!("2000", payload["code"]);
    assert_eq!("gpt-4o-mini", payload["data"]["items"][0]["model"]);
    assert_eq!("openai", payload["data"]["items"][0]["vendor"]);
    assert_eq!(
        "reference",
        payload["data"]["items"][0]["priceAvailability"]["status"]
    );
    assert_eq!(
        "Public reference price only. Customer-specific pricing requires an API key context.",
        payload["data"]["items"][0]["priceAvailability"]["reason"]
    );
    assert!(!body_text.contains("hash:sk-live-secret"));
    assert!(!body_text.contains("sk-live-secret"));
    assert!(!body_text.contains("keyHash"));
    assert!(!body_text.contains("key_hash"));
}

#[tokio::test]
async fn app_api_key_create_accepts_app_session_token_subject() {
    let router = secured_router();
    let response = router
        .clone()
        .oneshot(
            session_authorization_header(
                Request::builder()
                    .method("POST")
                    .uri(API_KEYS_PATH)
                    .header("content-type", "application/json"),
                10,
                20,
                30,
            )
            .header("Idempotency-Key", "create-search-service-1")
            .header("X-Request-Id", "00000000-0000-4000-8000-000000000001")
            .body(Body::from(
                serde_json::json!({
                    "name": "Search Service",
                    "group": "standard-group",
                    "quota": "250.000000",
                    "isUnlimitedQuota": false,
                    "modalities": ["text", "image"],
                    "ipLimit": "192.168.1.1, 10.0.0.0/24",
                    "expires": "2027-02-01T00:00"
                })
                .to_string(),
            ))
            .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body_text = String::from_utf8(body.to_vec()).unwrap();
    let payload: serde_json::Value = serde_json::from_str(&body_text).unwrap();

    assert_eq!("2000", payload["code"]);
    let raw_key = payload["data"]["rawKey"].as_str().unwrap();
    assert!(raw_key.starts_with("sk-claw-"));
    assert_eq!(raw_key, payload["data"]["item"]["copyableKey"]);
    assert_eq!("Search Service", payload["data"]["item"]["name"]);
    assert_eq!("standard-group", payload["data"]["item"]["group"]);
    assert_eq!("250.000000", payload["data"]["item"]["quota"]);
    assert_eq!("0.000000", payload["data"]["item"]["usedQuota"]);
    assert_eq!("text", payload["data"]["item"]["modalities"][0]);
    assert_eq!("image", payload["data"]["item"]["modalities"][1]);
    assert_eq!(
        "192.168.1.1, 10.0.0.0/24",
        payload["data"]["item"]["ipLimit"]
    );
    assert_eq!("2027-02-01 00:00:00", payload["data"]["item"]["expires"]);
    assert_ne!(raw_key, payload["data"]["item"]["maskedKey"]);
    assert!(payload["data"]["item"].get("keyVal").is_none());
    assert!(payload["data"]["item"].get("fullKey").is_none());
    assert!(!body_text.contains("keyHash"));
    assert!(!body_text.contains("key_hash"));

    let list_response = router
        .oneshot(
            session_authorization_header(
                Request::builder().method("GET").uri(API_KEYS_PATH),
                10,
                20,
                30,
            )
            .body(Body::empty())
            .unwrap(),
        )
        .await
        .unwrap();
    let list_body = axum::body::to_bytes(list_response.into_body(), usize::MAX)
        .await
        .unwrap();
    let list_text = String::from_utf8(list_body.to_vec()).unwrap();
    let list_payload: serde_json::Value = serde_json::from_str(&list_text).unwrap();
    assert_eq!("Search Service", list_payload["data"]["items"][0]["name"]);
    assert_eq!(raw_key, list_payload["data"]["items"][0]["copyableKey"]);
    assert_ne!(
        list_payload["data"]["items"][0]["maskedKey"],
        list_payload["data"]["items"][0]["copyableKey"]
    );
}

#[tokio::test]
async fn app_api_key_create_accepts_signed_trusted_subject_boundary() {
    let response = secured_router()
        .oneshot(
            signed_subject_headers(
                Request::builder()
                    .method("POST")
                    .uri(API_KEYS_PATH)
                    .header("content-type", "application/json"),
                10,
                20,
                30,
            )
            .header("Idempotency-Key", "signed-subject-create-1")
            .header("X-Request-Id", "00000000-0000-4000-8000-000000000002")
            .body(Body::from(
                serde_json::json!({
                    "name": "Signed Subject Service",
                    "group": "standard-group",
                    "quota": "250.000000",
                    "isUnlimitedQuota": false,
                    "modalities": ["text"],
                    "ipLimit": "unrestricted",
                    "expires": "2027-02-01T00:00"
                })
                .to_string(),
            ))
            .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body_text = String::from_utf8(body.to_vec()).unwrap();
    let payload: serde_json::Value = serde_json::from_str(&body_text).unwrap();

    assert_eq!("2000", payload["code"]);
    assert_eq!("Signed Subject Service", payload["data"]["item"]["name"]);
    assert!(payload["data"]["rawKey"]
        .as_str()
        .unwrap()
        .starts_with("sk-claw-"));
    assert_eq!(
        payload["data"]["rawKey"],
        payload["data"]["item"]["copyableKey"]
    );
}

#[tokio::test]
async fn app_api_key_update_rebinds_owner_key_group_through_app_router() {
    let response = secured_router()
        .oneshot(
            session_authorization_header(
                Request::builder()
                    .method("PATCH")
                    .uri(format!("{API_KEYS_PATH}/100"))
                    .header("content-type", "application/json"),
                10,
                20,
                30,
            )
            .header("X-Request-Id", "00000000-0000-4000-8000-000000000003")
            .body(Body::from(
                serde_json::json!({
                    "group": "standard-group",
                    "name": "Updated Production Key"
                })
                .to_string(),
            ))
            .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body_text = String::from_utf8(body.to_vec()).unwrap();
    let payload: serde_json::Value = serde_json::from_str(&body_text).unwrap();

    assert_eq!("2000", payload["code"]);
    assert_eq!("100", payload["data"]["item"]["id"]);
    assert_eq!("Updated Production Key", payload["data"]["item"]["name"]);
    assert_eq!("standard-group", payload["data"]["item"]["group"]);
    assert_eq!("sk-test********ABCD", payload["data"]["item"]["maskedKey"]);
    assert_eq!("sk-live-secret", payload["data"]["item"]["copyableKey"]);
    assert!(!body_text.contains("hash:sk-live-secret"));
}

#[tokio::test]
async fn app_api_key_delete_revokes_owner_key_through_app_router() {
    let response = secured_router()
        .oneshot(
            session_authorization_header(
                Request::builder()
                    .method("DELETE")
                    .uri(format!("{API_KEYS_PATH}/100")),
                10,
                20,
                30,
            )
            .header("X-Request-Id", "00000000-0000-4000-8000-000000000004")
            .body(Body::empty())
            .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body_text = String::from_utf8(body.to_vec()).unwrap();
    let payload: serde_json::Value = serde_json::from_str(&body_text).unwrap();

    assert_eq!("2000", payload["code"]);
    assert_eq!("100", payload["data"]["id"]);
    assert_eq!(true, payload["data"]["deleted"]);
    assert!(!body_text.contains("hash:sk-live-secret"));
    assert!(!body_text.contains("sk-live-secret"));
}

#[tokio::test]
async fn app_api_key_create_requires_trusted_user_context() {
    let response = secured_router()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(API_KEYS_PATH)
                .header("content-type", "application/json")
                .header("Idempotency-Key", "missing-subject-1")
                .header("X-Request-Id", "00000000-0000-4000-8000-000000000005")
                .body(Body::from(
                    serde_json::json!({
                        "name": "Search Service",
                        "group": "standard-group",
                        "quota": "250.000000",
                        "isUnlimitedQuota": false,
                        "modalities": ["text"],
                        "ipLimit": "unrestricted",
                        "expires": "2027-02-01T00:00"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body_text = String::from_utf8(body.to_vec()).unwrap();
    let payload: serde_json::Value = serde_json::from_str(&body_text).unwrap();

    assert_eq!("4010", payload["code"]);
    assert!(body_text.contains("app session bearer token is required"));
    assert!(!body_text.contains(INTERNAL_TENANT_HEADER));
    assert!(!body_text.contains("rawKey"));
}

#[tokio::test]
async fn app_api_key_create_rejects_direct_trusted_subject_headers() {
    let response = secured_router()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(API_KEYS_PATH)
                .header("content-type", "application/json")
                .header(INTERNAL_TENANT_HEADER, "999")
                .header(INTERNAL_ORGANIZATION_HEADER, "999")
                .header(INTERNAL_USER_HEADER, "999")
                .header("Idempotency-Key", "direct-subject-1")
                .header("X-Request-Id", "00000000-0000-4000-8000-000000000006")
                .body(Body::from(
                    serde_json::json!({
                        "name": "Search Service",
                        "group": "standard-group",
                        "quota": "250.000000",
                        "isUnlimitedQuota": false,
                        "modalities": ["text"],
                        "ipLimit": "unrestricted",
                        "expires": "2027-02-01T00:00"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body_text = String::from_utf8(body.to_vec()).unwrap();
    let payload: serde_json::Value = serde_json::from_str(&body_text).unwrap();

    assert_eq!("4010", payload["code"]);
    assert!(body_text.contains("app session bearer token is required"));
    assert!(!body_text.contains(INTERNAL_TENANT_HEADER));
    assert!(!body_text.contains("999"));
    assert!(!body_text.contains("rawKey"));
}

#[tokio::test]
async fn app_api_key_create_requires_idempotency_key_header() {
    let response = secured_router()
        .oneshot(
            session_authorization_header(
                Request::builder()
                    .method("POST")
                    .uri(API_KEYS_PATH)
                    .header("content-type", "application/json"),
                10,
                20,
                30,
            )
            .body(Body::from(
                serde_json::json!({
                    "name": "Search Service",
                    "group": "standard-group",
                    "quota": "250.000000",
                    "isUnlimitedQuota": false,
                    "modalities": ["text"],
                    "ipLimit": "unrestricted",
                    "expires": "2027-02-01T00:00"
                })
                .to_string(),
            ))
            .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body_text = String::from_utf8(body.to_vec()).unwrap();
    let payload: serde_json::Value = serde_json::from_str(&body_text).unwrap();

    assert_eq!("4001", payload["code"]);
    assert!(body_text.contains("Idempotency-Key header is required"));
    assert!(!body_text.contains("rawKey"));
}

#[tokio::test]
async fn app_api_key_create_rejects_duplicate_idempotency_key_without_second_secret() {
    let router = secured_router();
    let request_body = serde_json::json!({
        "name": "Search Service",
        "group": "standard-group",
        "quota": "250.000000",
        "isUnlimitedQuota": false,
        "modalities": ["text"],
        "ipLimit": "unrestricted",
        "expires": "2027-02-01T00:00"
    })
    .to_string();
    let first = router
        .clone()
        .oneshot(
            session_authorization_header(
                Request::builder()
                    .method("POST")
                    .uri(API_KEYS_PATH)
                    .header("content-type", "application/json"),
                10,
                20,
                30,
            )
            .header("Idempotency-Key", "duplicate-key-1")
            .header("X-Request-Id", "00000000-0000-4000-8000-000000000007")
            .body(Body::from(request_body.clone()))
            .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, first.status());

    let second = router
        .oneshot(
            session_authorization_header(
                Request::builder()
                    .method("POST")
                    .uri(API_KEYS_PATH)
                    .header("content-type", "application/json"),
                10,
                20,
                30,
            )
            .header("Idempotency-Key", "duplicate-key-1")
            .header("X-Request-Id", "00000000-0000-4000-8000-000000000008")
            .body(Body::from(request_body))
            .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::CONFLICT, second.status());
    let body = axum::body::to_bytes(second.into_body(), usize::MAX)
        .await
        .unwrap();
    let body_text = String::from_utf8(body.to_vec()).unwrap();
    let payload: serde_json::Value = serde_json::from_str(&body_text).unwrap();

    assert_eq!("4090", payload["code"]);
    assert!(body_text.contains("idempotency key has already been used"));
    assert!(!body_text.contains("rawKey"));
}

#[tokio::test]
async fn app_api_key_create_scopes_idempotency_key_by_tenant() {
    let router = secured_router();
    let request_body = serde_json::json!({
        "name": "Search Service",
        "group": "standard-group",
        "quota": "250.000000",
        "isUnlimitedQuota": false,
        "modalities": ["text"],
        "ipLimit": "unrestricted",
        "expires": "2027-02-01T00:00"
    })
    .to_string();
    let first = router
        .clone()
        .oneshot(
            session_authorization_header(
                Request::builder()
                    .method("POST")
                    .uri(API_KEYS_PATH)
                    .header("content-type", "application/json"),
                10,
                20,
                30,
            )
            .header("Idempotency-Key", "tenant-scoped-key-1")
            .header("X-Request-Id", "00000000-0000-4000-8000-000000000009")
            .body(Body::from(request_body.clone()))
            .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, first.status());

    let second = router
        .oneshot(
            session_authorization_header(
                Request::builder()
                    .method("POST")
                    .uri(API_KEYS_PATH)
                    .header("content-type", "application/json"),
                11,
                21,
                31,
            )
            .header("Idempotency-Key", "tenant-scoped-key-1")
            .header("X-Request-Id", "00000000-0000-4000-8000-000000000010")
            .body(Body::from(request_body))
            .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, second.status());
    let body = axum::body::to_bytes(second.into_body(), usize::MAX)
        .await
        .unwrap();
    let body_text = String::from_utf8(body.to_vec()).unwrap();
    let payload: serde_json::Value = serde_json::from_str(&body_text).unwrap();

    assert_eq!("2000", payload["code"]);
    assert!(payload["data"]["rawKey"]
        .as_str()
        .unwrap()
        .starts_with("sk-claw-"));
}

#[tokio::test]
async fn app_api_key_create_rejects_invalid_ip_allowlist_without_revealing_key() {
    let response = secured_router()
        .oneshot(
            session_authorization_header(
                Request::builder()
                    .method("POST")
                    .uri(API_KEYS_PATH)
                    .header("content-type", "application/json"),
                10,
                20,
                30,
            )
            .header("Idempotency-Key", "invalid-ip-1")
            .header("X-Request-Id", "00000000-0000-4000-8000-000000000011")
            .body(Body::from(
                serde_json::json!({
                    "name": "Search Service",
                    "group": "standard-group",
                    "quota": "250.000000",
                    "isUnlimitedQuota": false,
                    "modalities": ["text"],
                    "ipLimit": "192.168.1.999",
                    "expires": "2027-02-01T00:00"
                })
                .to_string(),
            ))
            .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body_text = String::from_utf8(body.to_vec()).unwrap();
    let payload: serde_json::Value = serde_json::from_str(&body_text).unwrap();

    assert_eq!("4001", payload["code"]);
    assert!(body_text.contains("invalid ip allowlist entry"));
    assert!(!body_text.contains("rawKey"));
    assert!(!body_text.contains("sk-claw-"));
}

#[tokio::test]
async fn app_api_key_create_rejects_invalid_expiration_date() {
    let response = secured_router()
        .oneshot(
            session_authorization_header(
                Request::builder()
                    .method("POST")
                    .uri(API_KEYS_PATH)
                    .header("content-type", "application/json"),
                10,
                20,
                30,
            )
            .header("Idempotency-Key", "invalid-expiration-1")
            .header("X-Request-Id", "00000000-0000-4000-8000-000000000012")
            .body(Body::from(
                serde_json::json!({
                    "name": "Search Service",
                    "group": "standard-group",
                    "quota": "250.000000",
                    "isUnlimitedQuota": false,
                    "modalities": ["text"],
                    "ipLimit": "unrestricted",
                    "expires": "2027-02-31T00:00"
                })
                .to_string(),
            ))
            .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body_text = String::from_utf8(body.to_vec()).unwrap();
    let payload: serde_json::Value = serde_json::from_str(&body_text).unwrap();

    assert_eq!("4001", payload["code"]);
    assert!(body_text.contains("api key expiration must be a valid timestamp"));
    assert!(!body_text.contains("rawKey"));
}

#[tokio::test]
async fn app_api_key_create_rejects_non_positive_quota() {
    let response = secured_router()
        .oneshot(
            session_authorization_header(
                Request::builder()
                    .method("POST")
                    .uri(API_KEYS_PATH)
                    .header("content-type", "application/json"),
                10,
                20,
                30,
            )
            .header("Idempotency-Key", "non-positive-quota-1")
            .header("X-Request-Id", "00000000-0000-4000-8000-000000000013")
            .body(Body::from(
                serde_json::json!({
                    "name": "Search Service",
                    "group": "standard-group",
                    "quota": "0",
                    "isUnlimitedQuota": false,
                    "modalities": ["text"],
                    "ipLimit": "unrestricted",
                    "expires": "2027-02-01T00:00"
                })
                .to_string(),
            ))
            .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body_text = String::from_utf8(body.to_vec()).unwrap();
    let payload: serde_json::Value = serde_json::from_str(&body_text).unwrap();

    assert_eq!("4001", payload["code"]);
    assert!(body_text.contains("api key quota must be greater than zero"));
    assert!(!body_text.contains("rawKey"));
}
