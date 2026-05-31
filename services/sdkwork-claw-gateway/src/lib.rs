pub mod edge_server;
mod gateway_api_key_auth;
mod openai_passthrough_payload;
mod openai_passthrough_routes;
mod openai_route_taxonomy;
mod passthrough;
mod provider_account_auth;
pub mod provider_adapter_transport;
mod provider_passthrough_transport;
mod request_identity;
mod route_scoped_openai_passthrough;
pub mod runtime;

pub use edge_server::{
    all_in_one_edge_router_from_env, edge_server_router,
    edge_server_router_with_in_process_upstreams, serve,
    serve_all_in_one_edge_server_with_runtime_config, serve_edge_server,
    serve_edge_server_with_runtime_config, serve_with_runtime_config, EdgeInProcessUpstreams,
    EdgeServerConfig,
};
#[rustfmt::skip]
pub use openai_passthrough_routes::{openai_compatible_passthrough_paths, openai_method_passthrough_paths, stored_chat_completion_passthrough_paths};
#[rustfmt::skip]
pub use passthrough::{provider_native_passthrough_providers, router_with_provider_passthrough_and_adapter_config, router_with_provider_passthrough_config};
#[rustfmt::skip]
pub use runtime::{
    router_from_env, router_with_database_and_api_key_config,
    router_with_database_api_key_and_provider_configs,
    router_with_database_api_key_provider_configs_and_adapter_config,
    router_with_database_api_key_and_provider_relay_config,
    router_with_database_api_key_provider_configs_and_usage_settlement_worker_config,
    router_with_optional_database_api_key_and_provider_configs, router_with_optional_database_api_key_and_provider_relay_config,
    router_with_optional_database_config, router_with_product_catalog_and_api_key_hasher, router_with_product_catalog_api_key_hasher_and_chat_completion_relay,
    router_with_product_catalog_api_key_hasher_and_chat_completion_streaming_relay,
    router_with_product_catalog_api_key_hasher_and_embeddings_relay,
    router_with_product_catalog_api_key_hasher_and_responses_relay, GatewayRouterError,
};

pub const SERVICE_NAME: &str = "sdkwork-claw-gateway";

pub fn router() -> axum::Router {
    router_with_database_status_and_passthrough_placeholder(None, true)
}

pub(crate) fn router_with_database_status_and_passthrough_placeholder(
    config: Option<&sdkwork_claw_config::DatabaseConfig>,
    include_passthrough_placeholder: bool,
) -> axum::Router {
    let router = sdkwork_claw_http::service_router_with_database_config(SERVICE_NAME, config);
    if include_passthrough_placeholder {
        router.merge(passthrough::gateway_passthrough_router())
    } else {
        router
    }
}
