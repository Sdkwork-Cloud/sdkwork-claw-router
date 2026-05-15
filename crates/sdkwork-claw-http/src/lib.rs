pub mod auth;
pub mod contract_routes;
pub mod error;
pub mod headers;
pub mod health;
pub mod router;

pub use auth::{
    app_request_subject_boundary, inject_optional_app_request_subject,
    inject_verified_app_request_subject, inject_verified_trusted_request_subject,
    optional_app_request_subject_boundary, sign_app_session_token, sign_trusted_request_subject,
    trusted_request_subject_boundary, verify_app_session_authorization_header,
    verify_app_session_token, ApiKeyCredential, ApiKeyCredentialSource, ApiKeyIdentity,
    ApiKeyIdentityError, AppSessionTokenError, AppSubjectBoundaryConfig, TrustedRequestSubject,
    TrustedRequestSubjectError, TrustedSubjectBoundaryError,
};
pub use contract_routes::{
    app_openapi_response, backend_openapi_response, contract_fallback, gateway_openapi_response,
    openapi_schema_tabs_response_for_surface, APP_OPENAPI_PATH, BACKEND_OPENAPI_PATH,
    GATEWAY_OPENAPI_PATH, OPENAPI_SCHEMA_TABS_PATH,
};
pub use error::{NotImplementedData, PlusErrorEnvelope};
pub use headers::{default_security_headers, redact_http_header};
pub use router::{
    service_router, service_router_with_contract_routes,
    service_router_with_contract_routes_and_database_config, service_router_with_database_config,
};
pub use sdkwork_claw_contract::ApiSurface;
