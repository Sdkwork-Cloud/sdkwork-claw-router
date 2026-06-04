use axum::extract::{Request, State};
use axum::http::{header, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::Json;
use sdkwork_claw_contract::ApiSurface;
use sdkwork_claw_paas_api::standard_paas_service_groups;
use serde::Serialize;

use crate::error::PlusErrorEnvelope;
use crate::router::ServiceState;

pub const GATEWAY_OPENAPI_PATH: &str = "/openapi.json";
pub const PAYMENT_AGGREGATE_OPENAPI_PATH: &str = "/payments/v3/openapi.json";
pub const PAAS_OPENAPI_PATH: &str = "/paas/v3/openapi.json";
pub const CLOUD_SERVICES_OPENAPI_PATH: &str = "/cloud/v3/openapi.json";
pub const APP_OPENAPI_PATH: &str = "/app/v3/api/openapi.json";
pub const BACKEND_OPENAPI_PATH: &str = "/backend/v3/api/openapi.json";
pub const OPENAPI_SCHEMA_TABS_PATH: &str = "/openapi/schema-tabs.json";
pub const OPENAPI_SCHEMA_CACHE_TTL_SECONDS: u32 = 30;
pub const OPENAPI_SCHEMA_CACHE_CONTROL: &str = "public, max-age=30, stale-while-revalidate=60";

const GATEWAY_OPENAPI_JSON: &str = include_str!(concat!(env!("OUT_DIR"), "/gateway-openapi.json"));
const PAYMENT_AGGREGATE_OPENAPI_JSON: &str =
    include_str!("../specs/payment-aggregate-openapi.json");
const PAAS_OPENAPI_JSON: &str = include_str!("../specs/paas-openapi.json");
const CLOUD_SERVICES_OPENAPI_JSON: &str = include_str!("../specs/cloud-services-openapi.json");
const APP_OPENAPI_JSON: &str =
    include_str!(concat!(env!("OUT_DIR"), "/clawrouter-app-openapi.json"));
const BACKEND_OPENAPI_JSON: &str =
    include_str!(concat!(env!("OUT_DIR"), "/clawrouter-backend-openapi.json"));

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct OpenApiSchemaTabsDocument {
    cache_ttl_seconds: u32,
    tabs: Vec<OpenApiSchemaTab>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct OpenApiSchemaTab {
    id: &'static str,
    name: &'static str,
    order: u32,
    schema_urls: Vec<&'static str>,
    #[serde(skip_serializing_if = "Option::is_none")]
    default_schema_url: Option<&'static str>,
    cache_ttl_seconds: u32,
    status: &'static str,
    #[serde(skip_serializing_if = "Option::is_none")]
    description: Option<&'static str>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    service_groups: Vec<OpenApiSchemaServiceGroup>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct OpenApiSchemaServiceGroup {
    code: &'static str,
    name: &'static str,
    description: &'static str,
    provider_codes: Vec<&'static str>,
    operations: Vec<&'static str>,
}

pub async fn gateway_openapi_document(State(state): State<ServiceState>) -> Response {
    if state.contract_surface.is_some() {
        return StatusCode::NOT_FOUND.into_response();
    }

    gateway_openapi_response()
}

pub async fn openapi_schema_tabs(State(state): State<ServiceState>) -> Response {
    openapi_schema_tabs_response_for_surface(state.contract_surface)
}

pub fn gateway_openapi_response() -> Response {
    (openapi_json_headers(), GATEWAY_OPENAPI_JSON).into_response()
}

pub async fn payment_aggregate_openapi_document(State(state): State<ServiceState>) -> Response {
    if state.contract_surface.is_some() {
        return StatusCode::NOT_FOUND.into_response();
    }

    payment_aggregate_openapi_response()
}

pub async fn paas_openapi_document(State(state): State<ServiceState>) -> Response {
    if state.contract_surface.is_some() {
        return StatusCode::NOT_FOUND.into_response();
    }

    paas_openapi_response()
}

pub async fn cloud_services_openapi_document(State(state): State<ServiceState>) -> Response {
    if state.contract_surface.is_some() {
        return StatusCode::NOT_FOUND.into_response();
    }

    cloud_services_openapi_response()
}

pub fn payment_aggregate_openapi_response() -> Response {
    (openapi_json_headers(), PAYMENT_AGGREGATE_OPENAPI_JSON).into_response()
}

pub fn paas_openapi_response() -> Response {
    (openapi_json_headers(), PAAS_OPENAPI_JSON).into_response()
}

pub fn cloud_services_openapi_response() -> Response {
    (openapi_json_headers(), CLOUD_SERVICES_OPENAPI_JSON).into_response()
}

pub fn app_openapi_response() -> Response {
    (openapi_json_headers(), APP_OPENAPI_JSON).into_response()
}

pub fn backend_openapi_response() -> Response {
    (openapi_json_headers(), BACKEND_OPENAPI_JSON).into_response()
}

pub fn openapi_schema_tabs_response_for_surface(surface: Option<ApiSurface>) -> Response {
    (
        openapi_json_headers(),
        Json(OpenApiSchemaTabsDocument {
            cache_ttl_seconds: OPENAPI_SCHEMA_CACHE_TTL_SECONDS,
            tabs: schema_tabs_for_surface(surface),
        }),
    )
        .into_response()
}

pub async fn openapi_document(State(state): State<ServiceState>) -> Response {
    let Some(surface) = state.contract_surface else {
        return StatusCode::NOT_FOUND.into_response();
    };

    match surface {
        ApiSurface::App => app_openapi_response(),
        ApiSurface::Backend => backend_openapi_response(),
        ApiSurface::OpenAiV1 => StatusCode::NOT_FOUND.into_response(),
    }
}

pub async fn contract_fallback(State(state): State<ServiceState>, request: Request) -> Response {
    let Some(surface) = state.contract_surface else {
        return StatusCode::NOT_FOUND.into_response();
    };
    let Some(manifest) = state.contract_manifest.as_deref() else {
        return StatusCode::NOT_FOUND.into_response();
    };

    let method = request.method().as_str();
    let path = request.uri().path();

    match manifest.find_operation(surface, method, path) {
        Some(operation) => (
            StatusCode::NOT_IMPLEMENTED,
            Json(PlusErrorEnvelope::not_implemented(operation, surface, path)),
        )
            .into_response(),
        None => StatusCode::NOT_FOUND.into_response(),
    }
}

fn openapi_json_headers() -> [(header::HeaderName, &'static str); 2] {
    [
        (header::CONTENT_TYPE, "application/json; charset=utf-8"),
        (header::CACHE_CONTROL, OPENAPI_SCHEMA_CACHE_CONTROL),
    ]
}

fn schema_tabs_for_surface(surface: Option<ApiSurface>) -> Vec<OpenApiSchemaTab> {
    match surface {
        Some(ApiSurface::App) => vec![app_schema_tab()],
        Some(ApiSurface::Backend) => vec![backend_schema_tab()],
        Some(ApiSurface::OpenAiV1) => vec![gateway_schema_tab()],
        None => vec![
            gateway_schema_tab(),
            payment_aggregate_schema_tab(),
            paas_api_schema_tab(),
            cloud_services_schema_tab(),
            app_schema_tab(),
            backend_schema_tab(),
        ],
    }
}

fn gateway_schema_tab() -> OpenApiSchemaTab {
    OpenApiSchemaTab {
        id: "gateway",
        name: "AI聚合API",
        order: 10,
        schema_urls: vec![GATEWAY_OPENAPI_PATH],
        default_schema_url: Some(GATEWAY_OPENAPI_PATH),
        cache_ttl_seconds: OPENAPI_SCHEMA_CACHE_TTL_SECONDS,
        status: "available",
        description: Some(
            "AI aggregation APIs for OpenAI-compatible and provider-compatible model routing.",
        ),
        service_groups: Vec::new(),
    }
}

fn payment_aggregate_schema_tab() -> OpenApiSchemaTab {
    OpenApiSchemaTab {
        id: "payment-aggregate",
        name: "支付聚合API",
        order: 20,
        schema_urls: vec![PAYMENT_AGGREGATE_OPENAPI_PATH],
        default_schema_url: Some(PAYMENT_AGGREGATE_OPENAPI_PATH),
        cache_ttl_seconds: OPENAPI_SCHEMA_CACHE_TTL_SECONDS,
        status: "available",
        description: Some(
            "Payment aggregation APIs for unified order, refund, reconciliation, webhook, and provider-native payment channel contracts.",
        ),
        service_groups: Vec::new(),
    }
}

fn paas_api_schema_tab() -> OpenApiSchemaTab {
    OpenApiSchemaTab {
        id: "paas-api",
        name: "PaaS API",
        order: 30,
        schema_urls: vec![PAAS_OPENAPI_PATH],
        default_schema_url: Some(PAAS_OPENAPI_PATH),
        cache_ttl_seconds: OPENAPI_SCHEMA_CACHE_TTL_SECONDS,
        status: "available",
        description: Some(
            "PaaS aggregation APIs for OCR, face verification, document intelligence, content safety, and provider-compatible cloud service capabilities.",
        ),
        service_groups: standard_paas_service_groups()
            .into_iter()
            .map(|group| OpenApiSchemaServiceGroup {
                code: group.code,
                name: group.name,
                description: group.description,
                provider_codes: group.provider_codes,
                operations: group.operations,
            })
            .collect(),
    }
}

fn cloud_services_schema_tab() -> OpenApiSchemaTab {
    OpenApiSchemaTab {
        id: "cloud-services",
        name: "基础云服务API",
        order: 40,
        schema_urls: vec![CLOUD_SERVICES_OPENAPI_PATH],
        default_schema_url: Some(CLOUD_SERVICES_OPENAPI_PATH),
        cache_ttl_seconds: OPENAPI_SCHEMA_CACHE_TTL_SECONDS,
        status: "available",
        description: Some(
            "Cloud service aggregation APIs for S3-compatible object storage, reusable browser SDK configuration, presigned URL flows, and future cloud infrastructure capabilities.",
        ),
        service_groups: vec![
            OpenApiSchemaServiceGroup {
                code: "object_storage",
                name: "S3 Compatible Object Storage",
                description: "S3-compatible object storage covering buckets, objects, multipart uploads, presigned URLs, and browser SDK configuration.",
                provider_codes: vec![
                    "aws_s3",
                    "minio",
                    "cloudflare_r2",
                    "aliyun_oss",
                    "tencent_cos",
                    "huawei_obs",
                    "volcengine_tos",
                    "baidu_bos",
                ],
                operations: vec![
                    "s3_bucket_list",
                    "s3_bucket_create",
                    "s3_bucket_acl",
                    "s3_bucket_tagging",
                    "s3_object_list",
                    "s3_object_get",
                    "s3_object_put",
                    "s3_object_delete",
                    "s3_object_batch_delete",
                    "s3_object_copy",
                    "s3_object_acl",
                    "s3_object_tagging",
                    "s3_multipart_upload",
                    "s3_multipart_upload_list",
                    "s3_presigned_url",
                    "s3_presigned_post",
                    "s3_browser_sdk_config",
                    "s3_temporary_credentials",
                    "s3_checksum",
                    "s3_server_side_encryption",
                    "native_operation",
                ],
            },
            OpenApiSchemaServiceGroup {
                code: "cloud_compute",
                name: "Cloud Compute",
                description: "Unified IaaS compute lifecycle APIs for VM inventory, provisioning, resizing, lifecycle actions, images, flavors, SSH keys, security groups, and volumes.",
                provider_codes: vec![
                    "aws_ec2",
                    "azure_compute",
                    "gcp_compute",
                    "alicloud_ecs",
                    "tencent_cvm",
                    "huawei_ecs",
                    "volcengine_ecs",
                ],
                operations: vec![
                    "compute_instance_list",
                    "compute_instance_create",
                    "compute_instance_lifecycle",
                    "compute_instance_resize",
                    "compute_image_list",
                    "compute_flavor_list",
                    "compute_ssh_key",
                    "compute_security_group",
                    "compute_volume",
                ],
            },
            OpenApiSchemaServiceGroup {
                code: "container_runtime",
                name: "Container Runtime",
                description: "Definition-only container runtime APIs for provider-backed container creation and lifecycle actions.",
                provider_codes: vec![
                    "aws_ec2",
                    "azure_compute",
                    "gcp_compute",
                    "alicloud_ecs",
                    "tencent_cvm",
                    "huawei_ecs",
                    "volcengine_ecs",
                ],
                operations: vec!["container_create", "container_actions"],
            },
            OpenApiSchemaServiceGroup {
                code: "deployment_orchestration",
                name: "Deployment Orchestration",
                description: "Definition-only deployment application, release, and rollout action APIs for cloud provider orchestration.",
                provider_codes: vec![
                    "aws_ec2",
                    "azure_compute",
                    "gcp_compute",
                    "alicloud_ecs",
                    "tencent_cvm",
                    "huawei_ecs",
                    "volcengine_ecs",
                ],
                operations: vec![
                    "deployment_application",
                    "deployment_release",
                    "deployment_rollout",
                ],
            },
        ],
    }
}

fn app_schema_tab() -> OpenApiSchemaTab {
    OpenApiSchemaTab {
        id: "app",
        name: "App API",
        order: 50,
        schema_urls: vec![APP_OPENAPI_PATH],
        default_schema_url: Some(APP_OPENAPI_PATH),
        cache_ttl_seconds: OPENAPI_SCHEMA_CACHE_TTL_SECONDS,
        status: "available",
        description: Some("App API for user-facing portal and console business operations."),
        service_groups: Vec::new(),
    }
}

fn backend_schema_tab() -> OpenApiSchemaTab {
    OpenApiSchemaTab {
        id: "backend",
        name: "Backend API",
        order: 60,
        schema_urls: vec![BACKEND_OPENAPI_PATH],
        default_schema_url: Some(BACKEND_OPENAPI_PATH),
        cache_ttl_seconds: OPENAPI_SCHEMA_CACHE_TTL_SECONDS,
        status: "available",
        description: Some("Backend API for administration, operations, and management workflows."),
        service_groups: Vec::new(),
    }
}
