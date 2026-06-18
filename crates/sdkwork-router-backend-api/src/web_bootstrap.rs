use std::sync::Arc;

use axum::Router;
use sdkwork_iam_web_adapter::{
    build_web_framework_layer, IamAppContextInjector, IamDatabaseWebRequestContextResolver,
};
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
    resolver: IamDatabaseWebRequestContextResolver,
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

pub async fn wrap_router_with_web_framework_from_env(router: Router) -> Router {
    let resolver = sdkwork_iam_web_adapter::iam_database_resolver_from_env().await;
    wrap_router_with_web_framework(resolver, router)
}

pub fn web_framework_legacy_from_env() -> bool {
    !sdkwork_claw_http::claw_web_framework_enabled_from_env()
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
