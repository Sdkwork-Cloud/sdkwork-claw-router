const ADMIN_API_LIB: &str = include_str!("../src/lib.rs");

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_config::{ApiKeySecurityConfig, DatabaseConfig};
use sdkwork_claw_test_support::{
    app_session_config, app_session_dual_token_headers, trusted_request_subject,
    trusted_subject_config,
};
use serde_json::{json, Value};
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use tower::ServiceExt;

static DB_COUNTER: AtomicU64 = AtomicU64::new(0);

#[test]
fn admin_api_database_runtime_mounts_storage_center() {
    assert!(
        ADMIN_API_LIB.contains("AdminStorageRuntimeStore"),
        "admin api runtime must own a storage store"
    );
    assert!(
        ADMIN_API_LIB.contains("SqliteAdminStorageStore::new(pool.clone())"),
        "sqlite runtime must create the storage store"
    );
    assert!(
        ADMIN_API_LIB.contains("PostgresAdminStorageStore::new(pool.clone())"),
        "postgres runtime must create the storage store"
    );
    assert!(
        ADMIN_API_LIB.contains("admin_storage_router_with_store"),
        "admin api must mount the storage router"
    );
    assert!(
        ADMIN_API_LIB.contains("storage_store: Some(storage_store)"),
        "database runtime must pass the storage store into router assembly"
    );
}

#[tokio::test]
async fn fresh_sqlite_database_serves_storage_center_routes_after_install() {
    let database_url = unique_sqlite_url();
    let database_config =
        DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap();
    let api_key_config =
        ApiKeySecurityConfig::from_pepper_secret("0123456789abcdef0123456789abcdef").unwrap();

    let router = sdkwork_clawrouter_admin_api_server::router_with_database_and_api_key_config(
        database_config,
        Some(api_key_config),
        Some(trusted_subject_config().unwrap()),
        Some(app_session_config().unwrap()),
    )
    .await
    .unwrap();

    let response = tokio::time::timeout(
        Duration::from_secs(3),
        router.oneshot(app_session_request(
            "GET",
            "/backend/v3/api/storage/providers",
            Body::empty(),
        )),
    )
    .await
    .expect("storage center route should not hang after startup install")
    .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: Value = serde_json::from_slice(&body).unwrap();

    assert_eq!("2000", payload["code"], "payload={payload}");
    assert!(payload["data"]["items"].is_array(), "payload={payload}");
    assert_ne!("Not implemented", payload["msg"], "payload={payload}");
}

#[tokio::test]
async fn fresh_sqlite_database_supports_storage_center_management_commands_after_install() {
    let database_url = unique_sqlite_url();
    let database_config =
        DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap();
    let api_key_config =
        ApiKeySecurityConfig::from_pepper_secret("0123456789abcdef0123456789abcdef").unwrap();

    let router = sdkwork_clawrouter_admin_api_server::router_with_database_and_api_key_config(
        database_config,
        Some(api_key_config),
        Some(trusted_subject_config().unwrap()),
        Some(app_session_config().unwrap()),
    )
    .await
    .unwrap();

    let provider = request_json(
        router.clone(),
        app_session_json_request(
            "POST",
            "/backend/v3/api/storage/providers",
            "idem-storage-route-provider",
            json!({
                "providerCode": "minio-route",
                "providerType": "minio",
                "endpointUrl": "http://127.0.0.1:9000",
                "region": "local",
                "credentialRef": "secret://oss/minio-route",
                "pathStyleEnabled": true,
                "supportsMultipart": true,
                "supportsLifecycle": false,
                "supportsObjectLock": false
            }),
        ),
    )
    .await;
    assert_eq!("2000", provider["code"], "payload={provider}");
    let provider_id = json_string(&provider, &["data", "provider", "id"]);
    assert_eq!(
        "minio-route", provider["data"]["provider"]["providerCode"],
        "payload={provider}"
    );

    let providers = request_json(
        router.clone(),
        app_session_request("GET", "/backend/v3/api/storage/providers", Body::empty()),
    )
    .await;
    assert_eq!("2000", providers["code"], "payload={providers}");
    assert_list_contains_id(&providers, &provider_id);

    let health = request_json(
        router.clone(),
        app_session_request_with_request_id(
            "POST",
            &format!("/backend/v3/api/storage/providers/{provider_id}/health_check"),
            Body::empty(),
            "req-storage-route-provider-health",
        ),
    )
    .await;
    assert_eq!("2000", health["code"], "payload={health}");
    assert_eq!(true, health["data"]["healthy"], "payload={health}");

    let bucket = request_json(
        router.clone(),
        app_session_json_request(
            "POST",
            "/backend/v3/api/storage/buckets",
            "idem-storage-route-bucket",
            json!({
                "bucketName": "tenant-private-route",
                "providerId": provider_id,
                "logicalScope": "tenant_private",
                "bucketRegion": "local",
                "dataResidencyRegion": "LOCAL",
                "objectKeyPrefix": "tenants/{tenantId}/",
                "defaultStorageClass": "STANDARD",
                "defaultEncryptionMode": "sse_s3",
                "versioningEnabled": true,
                "objectLockEnabled": false,
                "lifecycleEnabled": false,
                "publicAccessBlocked": true
            }),
        ),
    )
    .await;
    assert_eq!("2000", bucket["code"], "payload={bucket}");
    let bucket_id = json_string(&bucket, &["data", "bucket", "id"]);
    assert_eq!(
        "tenant-private-route", bucket["data"]["bucket"]["bucketName"],
        "payload={bucket}"
    );

    let bucket_update = request_json(
        router.clone(),
        app_session_json_request_without_idempotency(
            "PATCH",
            &format!("/backend/v3/api/storage/buckets/{bucket_id}"),
            json!({
                "status": "disabled",
                "reason": "route regression maintenance"
            }),
            "req-storage-route-bucket-update",
        ),
    )
    .await;
    assert_eq!("2000", bucket_update["code"], "payload={bucket_update}");
    assert_eq!(
        "disabled", bucket_update["data"]["bucket"]["status"],
        "payload={bucket_update}"
    );

    let default_bucket = request_json(
        router.clone(),
        app_session_json_request_without_idempotency(
            "PATCH",
            "/backend/v3/api/storage/default_buckets/tenant_private",
            json!({
                "bucketId": bucket_id,
                "reason": "route regression tenant private default"
            }),
            "req-storage-route-default-bucket",
        ),
    )
    .await;
    assert_eq!("2000", default_bucket["code"], "payload={default_bucket}");
    assert_eq!(
        "tenant_private", default_bucket["data"]["defaultBucket"]["logicalScope"],
        "payload={default_bucket}"
    );
    let default_bucket_id = json_string(&default_bucket, &["data", "defaultBucket", "id"]);

    let quota = request_json(
        router.clone(),
        app_session_json_request(
            "POST",
            "/backend/v3/api/storage/quotas",
            "idem-storage-route-quota",
            json!({
                "scopeType": "organization",
                "scopeId": "20",
                "quotaLimitBytes": 1099511627776_i64,
                "singleFileLimitBytes": 10737418240_i64,
                "enforcement": "hard"
            }),
        ),
    )
    .await;
    assert_eq!("2000", quota["code"], "payload={quota}");
    let quota_id = json_string(&quota, &["data", "quotaPolicy", "id"]);
    assert_eq!(
        1099511627776_i64, quota["data"]["quotaPolicy"]["quotaLimitBytes"],
        "payload={quota}"
    );

    let reconciliation = request_json(
        router.clone(),
        app_session_json_request(
            "POST",
            "/backend/v3/api/storage/reconciliation_runs",
            "idem-storage-route-reconciliation",
            json!({
                "providerId": provider_id,
                "bucketId": bucket_id,
                "runType": "metadata",
                "dryRun": true,
                "reason": "route regression"
            }),
        ),
    )
    .await;
    assert_eq!("2000", reconciliation["code"], "payload={reconciliation}");
    let reconciliation_id = json_string(&reconciliation, &["data", "reconciliationRun", "id"]);

    let gc = request_json(
        router.clone(),
        app_session_json_request(
            "POST",
            "/backend/v3/api/storage/gc_jobs",
            "idem-storage-route-gc",
            json!({
                "jobType": "expired_uploads",
                "target": "uploads",
                "dryRun": true,
                "retentionWindow": "P7D",
                "dryRunSample": "100"
            }),
        ),
    )
    .await;
    assert_eq!("2000", gc["code"], "payload={gc}");
    let gc_id = json_string(&gc, &["data", "job", "id"]);

    for (path, expected_id) in [
        ("/backend/v3/api/storage/buckets", bucket_id.as_str()),
        (
            "/backend/v3/api/storage/default_buckets",
            default_bucket_id.as_str(),
        ),
        ("/backend/v3/api/storage/quotas", quota_id.as_str()),
        (
            "/backend/v3/api/storage/reconciliation_runs",
            reconciliation_id.as_str(),
        ),
        ("/backend/v3/api/storage/gc_jobs", gc_id.as_str()),
    ] {
        let payload = request_json(
            router.clone(),
            app_session_request("GET", path, Body::empty()),
        )
        .await;
        assert_eq!("2000", payload["code"], "path={path} payload={payload}");
        assert_list_contains_id(&payload, expected_id);
        assert_ne!(
            "Not implemented", payload["msg"],
            "path={path} payload={payload}"
        );
    }
}

fn unique_sqlite_url() -> String {
    let millis = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis();
    let counter = DB_COUNTER.fetch_add(1, Ordering::Relaxed);
    let mut path = std::env::temp_dir();
    path.push(format!(
        "sdkwork-clawrouter-admin-api-server-storage-route-{millis}-{counter}.sqlite"
    ));
    format!("sqlite://{}", path.to_string_lossy().replace('\\', "/"))
}

fn app_session_request(method: &str, path: &str, body: Body) -> Request<Body> {
    app_session_request_builder(method, path)
        .header("content-type", "application/json")
        .body(body)
        .unwrap()
}

fn app_session_request_with_request_id(
    method: &str,
    path: &str,
    body: Body,
    request_id: &str,
) -> Request<Body> {
    app_session_request_builder(method, path)
        .header("content-type", "application/json")
        .header("X-Request-Id", request_id)
        .body(body)
        .unwrap()
}

fn app_session_json_request(
    method: &str,
    path: &str,
    idempotency_key: &str,
    body: Value,
) -> Request<Body> {
    app_session_request_builder(method, path)
        .header("content-type", "application/json")
        .header("Idempotency-Key", idempotency_key)
        .header("X-Request-Id", format!("req-{idempotency_key}"))
        .body(Body::from(body.to_string()))
        .unwrap()
}

fn app_session_json_request_without_idempotency(
    method: &str,
    path: &str,
    body: Value,
    request_id: &str,
) -> Request<Body> {
    app_session_request_builder(method, path)
        .header("content-type", "application/json")
        .header("X-Request-Id", request_id)
        .body(Body::from(body.to_string()))
        .unwrap()
}

fn app_session_request_builder(method: &str, path: &str) -> axum::http::request::Builder {
    let issued_at = current_unix_seconds();
    let expires_at = issued_at + 3600;
    let (authorization, access_token) =
        app_session_dual_token_headers(trusted_request_subject(100_001, 0, 1), issued_at, expires_at)
            .unwrap();
    Request::builder()
        .method(method)
        .uri(path)
        .header("authorization", authorization)
        .header("Access-Token", access_token)
}

async fn request_json(router: axum::Router, request: Request<Body>) -> Value {
    let response = tokio::time::timeout(Duration::from_secs(3), router.oneshot(request))
        .await
        .expect("storage center route should not hang")
        .unwrap();
    let status = response.status();
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: Value = serde_json::from_slice(&body).unwrap();
    assert_eq!(StatusCode::OK, status, "payload={payload}");
    payload
}

fn json_string(payload: &Value, path: &[&str]) -> String {
    let mut value = payload;
    for segment in path {
        value = &value[*segment];
    }
    value
        .as_str()
        .unwrap_or_else(|| panic!("expected string at {path:?}, payload={payload}"))
        .to_owned()
}

fn assert_list_contains_id(payload: &Value, expected_id: &str) {
    let items = payload["data"]["items"]
        .as_array()
        .unwrap_or_else(|| panic!("expected data.items array, payload={payload}"));
    assert!(
        items
            .iter()
            .any(|item| item["id"].as_str() == Some(expected_id)),
        "expected id {expected_id}, payload={payload}"
    );
}

fn current_unix_seconds() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0)
}
