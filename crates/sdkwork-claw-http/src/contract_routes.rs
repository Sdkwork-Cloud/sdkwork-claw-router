use axum::extract::{Request, State};
use axum::http::{header, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::Json;
use sdkwork_claw_contract::ApiSurface;
use serde::Serialize;

use crate::error::PlusErrorEnvelope;
use crate::router::ServiceState;

pub const GATEWAY_OPENAPI_PATH: &str = "/openapi.json";
pub const APP_OPENAPI_PATH: &str = "/app/v3/api/openapi.json";
pub const BACKEND_OPENAPI_PATH: &str = "/backend/v3/api/openapi.json";
pub const OPENAPI_SCHEMA_TABS_PATH: &str = "/openapi/schema-tabs.json";
pub const OPENAPI_SCHEMA_CACHE_TTL_SECONDS: u32 = 30;
pub const OPENAPI_SCHEMA_CACHE_CONTROL: &str = "public, max-age=30, stale-while-revalidate=60";

const GATEWAY_OPENAPI_JSON: &str = include_str!(concat!(env!("OUT_DIR"), "/gateway-openapi.json"));
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
    default_schema_url: &'static str,
    cache_ttl_seconds: u32,
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
        None => vec![gateway_schema_tab(), app_schema_tab(), backend_schema_tab()],
    }
}

fn gateway_schema_tab() -> OpenApiSchemaTab {
    OpenApiSchemaTab {
        id: "gateway",
        name: "Claw Router Open API",
        order: 10,
        schema_urls: vec![GATEWAY_OPENAPI_PATH],
        default_schema_url: GATEWAY_OPENAPI_PATH,
        cache_ttl_seconds: OPENAPI_SCHEMA_CACHE_TTL_SECONDS,
    }
}

fn app_schema_tab() -> OpenApiSchemaTab {
    OpenApiSchemaTab {
        id: "app",
        name: "App API",
        order: 20,
        schema_urls: vec![APP_OPENAPI_PATH],
        default_schema_url: APP_OPENAPI_PATH,
        cache_ttl_seconds: OPENAPI_SCHEMA_CACHE_TTL_SECONDS,
    }
}

fn backend_schema_tab() -> OpenApiSchemaTab {
    OpenApiSchemaTab {
        id: "backend",
        name: "Backend API",
        order: 30,
        schema_urls: vec![BACKEND_OPENAPI_PATH],
        default_schema_url: BACKEND_OPENAPI_PATH,
        cache_ttl_seconds: OPENAPI_SCHEMA_CACHE_TTL_SECONDS,
    }
}
