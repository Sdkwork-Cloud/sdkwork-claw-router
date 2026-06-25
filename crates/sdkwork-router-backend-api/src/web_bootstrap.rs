use std::sync::Arc;

use axum::Router;
use sdkwork_claw_config::{AppSessionConfig, DatabaseConfig, DeploymentMode};
use sdkwork_claw_http::ClawRouterWebRequestContextResolver;
use sdkwork_clawrouter_router_service::infrastructure::{
    tenant_signing_key_store_for_database_config, TenantSigningKeyStoreWebResolver,
};
use sdkwork_iam_web_adapter::{build_web_framework_layer, IamAppContextInjector};
use sdkwork_web_axum::with_web_request_context;
use sdkwork_web_core::{DomainContextInjector, WebRequestContext};

use crate::http_route_manifest::http_route_manifest;

pub fn claw_router_backend_public_path_prefixes() -> Vec<String> {
    vec![
        "/healthz".to_owned(),
        "/readyz".to_owned(),
        "/metrics".to_owned(),
        "/backend/v3/api/openapi.json".to_owned(),
    ]
}

#[derive(Clone, Default)]
struct ClawRouterBackendDomainInjector {
    iam: IamAppContextInjector,
}

impl DomainContextInjector for ClawRouterBackendDomainInjector {
    fn inject(&self, request: &mut axum::extract::Request, context: &WebRequestContext) {
        self.iam.inject(request, context);
        sdkwork_claw_http::inject_legacy_handler_context_from_web_context(request, context);
    }
}

pub fn wrap_router_with_web_framework(
    resolver: ClawRouterWebRequestContextResolver,
    router: Router,
) -> Router {
    let prefixes = claw_router_backend_public_path_prefixes();
    if let Err(error) = http_route_manifest().validate_public_path_prefixes(&prefixes) {
        tracing::warn!(%error, "claw router backend-api public path prefixes overlap protected routes");
    }
    let layer = build_web_framework_layer(resolver, http_route_manifest(), prefixes)
        .with_domain_injector(Arc::new(ClawRouterBackendDomainInjector::default()));
    with_web_request_context(router, layer)
}

pub async fn claw_web_resolver_from_env(
    database_config: Option<&DatabaseConfig>,
) -> ClawRouterWebRequestContextResolver {
    let iam = sdkwork_iam_web_adapter::iam_database_resolver_from_env().await;
    let app_session = AppSessionConfig::from_env()
        .map_err(|error| error.to_string())
        .expect("claw router web framework requires SDKWORK_CLAW_APP_SESSION_SECRET")
        .unwrap_or_else(|| {
            panic!(
                "{} is required for claw router web framework bootstrap access tokens",
                AppSessionConfig::ENV_APP_SESSION_SECRET
            )
        });
    let mut resolver = ClawRouterWebRequestContextResolver::new(iam, app_session);
    if let Some(config) = database_config {
        match tenant_signing_key_store_for_database_config(config).await {
            Ok(store) => {
                resolver = resolver.with_tenant_signing_key_resolver(Arc::new(
                    TenantSigningKeyStoreWebResolver::new(store),
                ));
            }
            Err(error) => {
                if DeploymentMode::from_env().is_production_like() {
                    panic!(
                        "tenant signing key store is required for production-like deployments ({})",
                        error
                    );
                }
                tracing::warn!(
                    %error,
                    "tenant signing key resolver unavailable in non-production deployment; web framework falls back to legacy app session secret"
                );
            }
        }
    }
    resolver
}

pub async fn wrap_router_with_web_framework_from_env(router: Router) -> Router {
    let resolver = claw_web_resolver_from_env(None).await;
    wrap_router_with_web_framework(resolver, router)
}

pub async fn maybe_wrap_router_with_web_framework_and_database_config(
    router: Router,
    database_config: &DatabaseConfig,
) -> Router {
    if web_framework_enabled_from_env() {
        let resolver = claw_web_resolver_from_env(Some(database_config)).await;
        wrap_router_with_web_framework(resolver, router)
    } else {
        router
    }
}

pub fn web_framework_enabled_from_env() -> bool {
    sdkwork_claw_http::claw_web_framework_enabled_from_env()
}

/// Applies the sdkwork-web-framework layer once on any externally served backend-api router.
pub async fn finalize_served_router(router: Router) -> Router {
    maybe_wrap_router_with_web_framework(router).await
}

pub async fn maybe_wrap_router_with_web_framework(router: Router) -> Router {
    if web_framework_enabled_from_env() {
        wrap_router_with_web_framework_from_env(router).await
    } else {
        router
    }
}
