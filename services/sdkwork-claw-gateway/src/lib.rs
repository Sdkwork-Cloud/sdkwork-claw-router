pub mod edge_server;
mod passthrough;
pub mod runtime;

pub use edge_server::{edge_server_router, EdgeServerConfig};
pub use passthrough::{
    openai_compatible_passthrough_paths, openai_method_passthrough_paths,
    provider_native_passthrough_providers, router_with_provider_passthrough_config,
    stored_chat_completion_passthrough_paths,
};
pub use runtime::{
    router_from_env, router_with_database_and_api_key_config,
    router_with_database_api_key_and_provider_configs,
    router_with_database_api_key_and_provider_relay_config,
    router_with_database_api_key_provider_configs_and_usage_settlement_worker_config,
    router_with_optional_database_api_key_and_provider_configs,
    router_with_optional_database_api_key_and_provider_relay_config,
    router_with_optional_database_config, router_with_product_catalog_and_api_key_hasher,
    router_with_product_catalog_api_key_hasher_and_chat_completion_relay,
    router_with_product_catalog_api_key_hasher_and_chat_completion_streaming_relay,
    router_with_product_catalog_api_key_hasher_and_embeddings_relay,
    router_with_product_catalog_api_key_hasher_and_responses_relay, GatewayRouterError,
};

pub const SERVICE_NAME: &str = "sdkwork-claw-gateway";

pub fn router() -> Router {
    router_with_database_status(None)
}

fn router_with_database_status(config: Option<&sdkwork_claw_config::DatabaseConfig>) -> Router {
    router_with_database_status_and_passthrough_placeholder(config, true)
}

pub(crate) fn router_with_database_status_and_passthrough_placeholder(
    config: Option<&sdkwork_claw_config::DatabaseConfig>,
    include_passthrough_placeholder: bool,
) -> Router {
    let router = sdkwork_claw_http::service_router_with_database_config(SERVICE_NAME, config);
    if include_passthrough_placeholder {
        router.merge(passthrough::gateway_passthrough_router())
    } else {
        router
    }
}

pub async fn serve(bind_addr: &str) -> anyhow::Result<()> {
    sdkwork_claw_observability::init_tracing();
    let listener = tokio::net::TcpListener::bind(bind_addr).await?;
    axum::serve(listener, router_from_env().await?).await?;
    Ok(())
}

pub async fn serve_edge_server(bind_addr: &str, config: EdgeServerConfig) -> anyhow::Result<()> {
    sdkwork_claw_observability::init_tracing();
    let listener = tokio::net::TcpListener::bind(bind_addr).await?;
    axum::serve(listener, edge_server_router(config)).await?;
    Ok(())
}

use axum::Router;
