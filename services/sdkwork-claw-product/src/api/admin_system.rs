use axum::extract::State;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use serde::Serialize;
use std::sync::Arc;

use crate::api::response::PlusApiResult;
use crate::infrastructure::sql::installer::{DatabaseInstallError, DatabaseInstaller};

#[derive(Clone)]
struct AdminSystemState {
    installer: Arc<DatabaseInstaller>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct InstallationStatusResponse {
    status: String,
    schema_version: &'static str,
    catalog_version: String,
    catalog_source: String,
    external_catalog: bool,
    last_catalog_refresh_status: String,
    environment: String,
    seed_profile: String,
    changed: bool,
}

pub fn admin_system_router_with_installer(installer: Arc<DatabaseInstaller>) -> Router {
    Router::new()
        .route(
            "/backend/v3/api/system/installation/status",
            get(fetch_installation_status),
        )
        .with_state(AdminSystemState { installer })
}

async fn fetch_installation_status(State(state): State<AdminSystemState>) -> Response {
    match state.installer.status_report().await {
        Ok(report) => Json(PlusApiResult::success(InstallationStatusResponse {
            status: installation_status_code(&report.status).to_owned(),
            schema_version: report.schema_version,
            catalog_version: report.catalog_version,
            catalog_source: report.catalog_source,
            external_catalog: report.external_catalog,
            last_catalog_refresh_status: report.last_catalog_refresh_status,
            environment: report.environment,
            seed_profile: report.seed_profile,
            changed: report.changed,
        }))
        .into_response(),
        Err(error) => installation_status_error_response(error),
    }
}

fn installation_status_code(
    status: &crate::infrastructure::sql::installer::InstallationStatus,
) -> &'static str {
    match status {
        crate::infrastructure::sql::installer::InstallationStatus::NotInstalled => "not_installed",
        crate::infrastructure::sql::installer::InstallationStatus::Installed => "installed",
        crate::infrastructure::sql::installer::InstallationStatus::UpgradeRequired => {
            "upgrade_required"
        }
        crate::infrastructure::sql::installer::InstallationStatus::Incomplete => "incomplete",
        crate::infrastructure::sql::installer::InstallationStatus::Corrupt => "corrupt",
        crate::infrastructure::sql::installer::InstallationStatus::CatalogUnavailable => {
            "catalog_unavailable"
        }
    }
}

fn installation_status_error_response(error: DatabaseInstallError) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error("5000", error.to_string())),
    )
        .into_response()
}
