use axum::http::request::Builder;
use std::sync::Once;

pub const INTERNAL_TENANT_HEADER: &str = concat!("x-sdkwork-", "tenant-id");
pub const INTERNAL_ORGANIZATION_HEADER: &str = concat!("x-sdkwork-", "organization-id");
pub const INTERNAL_USER_HEADER: &str = concat!("x-sdkwork-", "user-id");

static LEGACY_TRUSTED_SUBJECT_ENV: Once = Once::new();

pub fn enable_legacy_trusted_subject_headers() {
    LEGACY_TRUSTED_SUBJECT_ENV.call_once(|| {
        // Router unit tests inject trusted subject via signed internal headers.
        // Disable web-framework-only resolution so header fallback remains available.
        std::env::set_var("SDKWORK_CLAW_WEB_FRAMEWORK_LEGACY", "true");
    });
}

pub trait InternalTrustedSubjectHeaders {
    fn internal_trusted_subject(self, tenant_id: i64, organization_id: i64, user_id: i64) -> Self;
}

impl InternalTrustedSubjectHeaders for Builder {
    fn internal_trusted_subject(self, tenant_id: i64, organization_id: i64, user_id: i64) -> Self {
        enable_legacy_trusted_subject_headers();
        self.header(INTERNAL_TENANT_HEADER, tenant_id.to_string())
            .header(INTERNAL_ORGANIZATION_HEADER, organization_id.to_string())
            .header(INTERNAL_USER_HEADER, user_id.to_string())
    }
}

#[allow(dead_code)]
pub fn missing_internal_tenant_header_message() -> &'static str {
    concat!("x-sdkwork-", "tenant-id", " header is required")
}
