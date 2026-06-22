use axum::http::request::Builder;

pub const INTERNAL_TENANT_HEADER: &str = concat!("x-sdkwork-", "tenant-id");
pub const INTERNAL_ORGANIZATION_HEADER: &str = concat!("x-sdkwork-", "organization-id");
pub const INTERNAL_USER_HEADER: &str = concat!("x-sdkwork-", "user-id");

pub trait InternalTrustedSubjectHeaders {
    fn internal_trusted_subject(self, tenant_id: i64, organization_id: i64, user_id: i64) -> Self;
}

impl InternalTrustedSubjectHeaders for Builder {
    fn internal_trusted_subject(self, tenant_id: i64, organization_id: i64, user_id: i64) -> Self {
        self.header(INTERNAL_TENANT_HEADER, tenant_id.to_string())
            .header(INTERNAL_ORGANIZATION_HEADER, organization_id.to_string())
            .header(INTERNAL_USER_HEADER, user_id.to_string())
    }
}

#[allow(dead_code)]
pub fn missing_internal_tenant_header_message() -> &'static str {
    concat!("x-sdkwork-", "tenant-id", " header is required")
}
