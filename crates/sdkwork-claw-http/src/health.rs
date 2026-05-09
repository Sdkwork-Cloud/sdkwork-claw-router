use axum::{extract::State, Json};
use sdkwork_claw_config::DeploymentMode;
use sdkwork_claw_core::HealthResponse;

use crate::router::ServiceState;

pub async fn healthz(State(state): State<ServiceState>) -> Json<HealthResponse> {
    Json(
        HealthResponse::new(state.service_name, DeploymentMode::from_env())
            .with_database(state.database),
    )
}

pub async fn readyz(State(state): State<ServiceState>) -> Json<HealthResponse> {
    Json(
        HealthResponse::new(state.service_name, DeploymentMode::from_env())
            .with_database(state.database),
    )
}
