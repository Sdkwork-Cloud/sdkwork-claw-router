use axum::extract::Request;
use sdkwork_web_core::WebRequestContext;

use crate::auth::{
    project_trusted_subject_for_legacy_handlers, TrustedRequestSubject, DEFAULT_USER_OPERATOR_TYPE,
};

/// Projects the standard `WebRequestContext` principal into the legacy
/// `TrustedRequestSubject` extension consumed by existing Claw handlers.
pub fn trusted_request_subject_from_web_context(
    context: &WebRequestContext,
) -> Option<TrustedRequestSubject> {
    let principal = context.principal.as_ref()?;
    let tenant_id = principal.tenant_id().parse().ok()?;
    let organization_id = principal
        .organization_id()
        .and_then(|value| value.parse().ok())
        .unwrap_or(0);
    let user_id = principal.user_id().parse().ok()?;
    Some(TrustedRequestSubject {
        tenant_id,
        organization_id,
        user_id,
        operator_id: user_id,
        operator_type: DEFAULT_USER_OPERATOR_TYPE,
    })
}

/// Injects trusted-subject extensions for handlers that still extract
/// `TrustedRequestSubject` while the sdkwork-web-framework pipeline is active.
pub fn inject_legacy_handler_context_from_web_context(
    request: &mut Request<axum::body::Body>,
    context: &WebRequestContext,
) {
    if let Some(subject) = trusted_request_subject_from_web_context(context) {
        project_trusted_subject_for_legacy_handlers(request, subject);
    }
}

#[cfg(test)]
mod tests {
    use axum::body::Body;
    use axum::extract::Request;
    use sdkwork_web_core::{
        ServerRequestId, WebApiSurface, WebAuthLevel, WebAuthMode, WebDeploymentMode,
        WebEnvironment, WebLoginScope, WebRequestContext, WebRequestPrincipal, WebTransportFacts,
    };

    use crate::auth::TrustedRequestSubject;

    use super::{
        inject_legacy_handler_context_from_web_context, trusted_request_subject_from_web_context,
    };

    #[test]
    fn trusted_request_subject_from_web_context_maps_principal_ids() {
        let principal = WebRequestPrincipal::builder()
            .tenant_id("100001")
            .organization_id(Some("30002".to_owned()))
            .user_id("40003")
            .login_scope(WebLoginScope::Organization)
            .session_id(Some("session-1".to_owned()))
            .app_id("sdkwork-clawrouter")
            .environment(WebEnvironment::Dev)
            .deployment_mode(WebDeploymentMode::Private)
            .auth_level(WebAuthLevel::Password)
            .build();
        let context = WebRequestContext {
            request_id: ServerRequestId("test-request".to_owned()),
            api_surface: WebApiSurface::AppApi,
            auth_mode: WebAuthMode::DualToken,
            transport: WebTransportFacts {
                path: "/app/v3/api/test".to_owned(),
                method: "GET".to_owned(),
                auth_token_present: true,
                access_token_present: true,
                api_key_present: false,
                oauth_bearer_present: false,
            },
            principal: Some(principal),
            locale: None,
            client_kind: None,
            operation: None,
        };

        let subject = trusted_request_subject_from_web_context(&context).expect("subject");
        assert_eq!(100_001, subject.tenant_id);
        assert_eq!(30_002, subject.organization_id);
        assert_eq!(40_003, subject.user_id);
    }

    #[test]
    fn inject_legacy_handler_context_projects_headers_and_extension() {
        let principal = WebRequestPrincipal::builder()
            .tenant_id("100001")
            .organization_id(Some("30002".to_owned()))
            .user_id("40003")
            .login_scope(WebLoginScope::Organization)
            .session_id(Some("session-1".to_owned()))
            .app_id("sdkwork-clawrouter")
            .environment(WebEnvironment::Dev)
            .deployment_mode(WebDeploymentMode::Private)
            .auth_level(WebAuthLevel::Password)
            .build();
        let context = WebRequestContext {
            request_id: ServerRequestId("test-request".to_owned()),
            api_surface: WebApiSurface::AppApi,
            auth_mode: WebAuthMode::DualToken,
            transport: WebTransportFacts {
                path: "/app/v3/api/test".to_owned(),
                method: "GET".to_owned(),
                auth_token_present: true,
                access_token_present: true,
                api_key_present: false,
                oauth_bearer_present: false,
            },
            principal: Some(principal),
            locale: None,
            client_kind: None,
            operation: None,
        };
        let mut request = Request::new(Body::empty());
        inject_legacy_handler_context_from_web_context(&mut request, &context);

        let subject = request
            .extensions()
            .get::<TrustedRequestSubject>()
            .copied()
            .expect("trusted subject extension");
        assert_eq!(100_001, subject.tenant_id);
        assert_eq!(
            "100001",
            request
                .headers()
                .get("x-sdkwork-tenant-id")
                .expect("tenant header")
                .to_str()
                .expect("tenant header utf8")
        );
        assert_eq!(
            "30002",
            request
                .headers()
                .get("x-sdkwork-organization-id")
                .expect("organization header")
                .to_str()
                .expect("organization header utf8")
        );
        assert_eq!(
            "40003",
            request
                .headers()
                .get("x-sdkwork-user-id")
                .expect("user header")
                .to_str()
                .expect("user header utf8")
        );
        assert_eq!(
            subject,
            TrustedRequestSubject::resolve_optional(request.headers(), request.extensions())
                .expect("resolved subject")
        );
    }

    #[test]
    fn resolve_optional_prefers_web_request_context_principal() {
        let principal = WebRequestPrincipal::builder()
            .tenant_id("100001")
            .organization_id(Some("30002".to_owned()))
            .user_id("40003")
            .login_scope(WebLoginScope::Organization)
            .session_id(Some("session-1".to_owned()))
            .app_id("sdkwork-clawrouter")
            .environment(WebEnvironment::Dev)
            .deployment_mode(WebDeploymentMode::Private)
            .auth_level(WebAuthLevel::Password)
            .build();
        let context = WebRequestContext {
            request_id: ServerRequestId("test-request".to_owned()),
            api_surface: WebApiSurface::AppApi,
            auth_mode: WebAuthMode::DualToken,
            transport: WebTransportFacts {
                path: "/app/v3/api/test".to_owned(),
                method: "GET".to_owned(),
                auth_token_present: true,
                access_token_present: true,
                api_key_present: false,
                oauth_bearer_present: false,
            },
            principal: Some(principal),
            locale: None,
            client_kind: None,
            operation: None,
        };
        let mut request = Request::new(Body::empty());
        request.extensions_mut().insert(context);

        let subject =
            TrustedRequestSubject::resolve_optional(request.headers(), request.extensions())
                .expect("subject from web context");
        assert_eq!(100_001, subject.tenant_id);
        assert_eq!(30_002, subject.organization_id);
        assert_eq!(40_003, subject.user_id);
    }
}
