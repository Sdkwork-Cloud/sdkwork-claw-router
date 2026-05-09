use std::sync::Arc;

use axum::{routing::get, Router};
use sdkwork_claw_config::DatabaseConfig;
use sdkwork_claw_contract::{ApiSurface, ContractManifest};
use sdkwork_claw_core::DatabaseHealth;

use crate::contract_routes::{
    contract_fallback, gateway_openapi_document, openapi_document, openapi_schema_tabs,
    APP_OPENAPI_PATH, BACKEND_OPENAPI_PATH, GATEWAY_OPENAPI_PATH, OPENAPI_SCHEMA_TABS_PATH,
};
use crate::health::{healthz, readyz};

#[derive(Debug, Clone)]
pub struct ServiceState {
    pub(crate) service_name: &'static str,
    pub(crate) contract_surface: Option<ApiSurface>,
    pub(crate) contract_manifest: Option<Arc<ContractManifest>>,
    pub(crate) database: DatabaseHealth,
}

pub fn service_router(service_name: &'static str) -> Router {
    service_router_with_database_config(service_name, None)
}

pub fn service_router_with_database_config(
    service_name: &'static str,
    database_config: Option<&DatabaseConfig>,
) -> Router {
    base_router().with_state(service_state(service_name, None, database_config))
}

pub fn service_router_with_contract_routes(
    service_name: &'static str,
    surface: ApiSurface,
) -> Router {
    service_router_with_contract_routes_and_database_config(service_name, surface, None)
}

pub fn service_router_with_contract_routes_and_database_config(
    service_name: &'static str,
    surface: ApiSurface,
    database_config: Option<&DatabaseConfig>,
) -> Router {
    let manifest = ContractManifest::from_embedded()
        .expect("embedded ClawRouter API contract manifest must be valid JSON");
    base_router()
        .fallback(contract_fallback)
        .with_state(service_state(
            service_name,
            Some((surface, Arc::new(manifest))),
            database_config,
        ))
}

fn base_router() -> Router<ServiceState> {
    Router::new()
        .route("/healthz", get(healthz))
        .route("/readyz", get(readyz))
        .route(GATEWAY_OPENAPI_PATH, get(gateway_openapi_document))
        .route(OPENAPI_SCHEMA_TABS_PATH, get(openapi_schema_tabs))
        .route(APP_OPENAPI_PATH, get(openapi_document))
        .route(BACKEND_OPENAPI_PATH, get(openapi_document))
}

fn service_state(
    service_name: &'static str,
    contract: Option<(ApiSurface, Arc<ContractManifest>)>,
    database_config: Option<&DatabaseConfig>,
) -> ServiceState {
    let (contract_surface, contract_manifest) = match contract {
        Some((surface, manifest)) => (Some(surface), Some(manifest)),
        None => (None, None),
    };

    ServiceState {
        service_name,
        contract_surface,
        contract_manifest,
        database: DatabaseHealth::from_config(database_config),
    }
}
