use tonic::Code;

pub const SDKWORK_AUTHORIZATION_METADATA: &str = "authorization";
pub const SDKWORK_ACCESS_TOKEN_METADATA: &str = "sdkwork-access-token";
pub const SDKWORK_REQUEST_ID_METADATA: &str = "x-request-id";
pub const SDKWORK_TRACEPARENT_METADATA: &str = "traceparent";
pub const SDKWORK_IDEMPOTENCY_KEY_METADATA: &str = "idempotency-key";
pub const SDKWORK_REQUEST_HASH_METADATA: &str = "x-request-hash";

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SdkworkRpcErrorKind {
    Validation,
    Unauthenticated,
    Unauthorized,
    NotFound,
    Conflict,
    InvalidState,
    UnsupportedCapability,
    RateLimited,
    Deadline,
    Canceled,
    ProviderUnavailable,
    Storage,
    Unknown,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SdkworkRpcMethod {
    pub method_name: &'static str,
    pub operation_id: &'static str,
    pub auth_policy: &'static str,
    pub requires_idempotency: bool,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SdkworkRpcServiceManifest {
    pub package_name: &'static str,
    pub service_name: &'static str,
    pub surface: &'static str,
    pub owner_domain: &'static str,
    pub methods: Vec<SdkworkRpcMethod>,
}

impl SdkworkRpcMethod {
    pub fn new(
        method_name: &'static str,
        operation_id: &'static str,
        auth_policy: &'static str,
        requires_idempotency: bool,
    ) -> Self {
        Self {
            method_name,
            operation_id,
            auth_policy,
            requires_idempotency,
        }
    }
}

impl SdkworkRpcServiceManifest {
    pub fn new(
        package_name: &'static str,
        service_name: &'static str,
        surface: &'static str,
        owner_domain: &'static str,
        methods: Vec<SdkworkRpcMethod>,
    ) -> Self {
        Self {
            package_name,
            service_name,
            surface,
            owner_domain,
            methods,
        }
    }
}

pub fn validate_manifest(manifest: &SdkworkRpcServiceManifest) -> Result<(), &'static str> {
    require_non_empty(manifest.package_name, "package_name is required")?;
    require_non_empty(manifest.service_name, "service_name is required")?;
    require_non_empty(manifest.surface, "surface is required")?;
    require_non_empty(manifest.owner_domain, "owner_domain is required")?;

    if manifest.methods.is_empty() {
        return Err("at least one method is required");
    }

    for method in &manifest.methods {
        require_non_empty(method.method_name, "method_name is required")?;
        require_non_empty(method.operation_id, "operation_id is required")?;
        require_non_empty(method.auth_policy, "auth_policy is required")?;
        if !method.operation_id.contains('.') {
            return Err("operation_id must use dotted SDKWork form");
        }
    }

    Ok(())
}

pub fn map_error_kind_to_code(kind: SdkworkRpcErrorKind) -> Code {
    match kind {
        SdkworkRpcErrorKind::Validation => Code::InvalidArgument,
        SdkworkRpcErrorKind::Unauthenticated => Code::Unauthenticated,
        SdkworkRpcErrorKind::Unauthorized => Code::PermissionDenied,
        SdkworkRpcErrorKind::NotFound => Code::NotFound,
        SdkworkRpcErrorKind::Conflict => Code::Aborted,
        SdkworkRpcErrorKind::InvalidState => Code::FailedPrecondition,
        SdkworkRpcErrorKind::UnsupportedCapability => Code::Unimplemented,
        SdkworkRpcErrorKind::RateLimited => Code::ResourceExhausted,
        SdkworkRpcErrorKind::Deadline => Code::DeadlineExceeded,
        SdkworkRpcErrorKind::Canceled => Code::Cancelled,
        SdkworkRpcErrorKind::ProviderUnavailable => Code::Unavailable,
        SdkworkRpcErrorKind::Storage => Code::Internal,
        SdkworkRpcErrorKind::Unknown => Code::Unknown,
    }
}

fn require_non_empty(value: &str, error: &'static str) -> Result<(), &'static str> {
    if value.trim().is_empty() {
        return Err(error);
    }

    Ok(())
}
