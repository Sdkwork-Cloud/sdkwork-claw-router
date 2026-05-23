use sdkwork_rpc_core::{
    map_error_kind_to_code, validate_manifest, SdkworkRpcErrorKind, SdkworkRpcMethod,
    SdkworkRpcServiceManifest, SDKWORK_ACCESS_TOKEN_METADATA, SDKWORK_AUTHORIZATION_METADATA,
    SDKWORK_IDEMPOTENCY_KEY_METADATA, SDKWORK_REQUEST_HASH_METADATA, SDKWORK_REQUEST_ID_METADATA,
    SDKWORK_TRACEPARENT_METADATA,
};
use tonic::Code;

#[test]
fn metadata_keys_match_sdkwork_rpc_standard() {
    assert_eq!(SDKWORK_AUTHORIZATION_METADATA, "authorization");
    assert_eq!(SDKWORK_ACCESS_TOKEN_METADATA, "sdkwork-access-token");
    assert_eq!(SDKWORK_REQUEST_ID_METADATA, "x-request-id");
    assert_eq!(SDKWORK_TRACEPARENT_METADATA, "traceparent");
    assert_eq!(SDKWORK_IDEMPOTENCY_KEY_METADATA, "idempotency-key");
    assert_eq!(SDKWORK_REQUEST_HASH_METADATA, "x-request-hash");
}

#[test]
fn service_manifest_requires_package_service_and_operation_ids() {
    let manifest = SdkworkRpcServiceManifest::new(
        "sdkwork.iam.app.v3",
        "SessionService",
        "app",
        "iam",
        vec![
            SdkworkRpcMethod::new("CreateSession", "sessions.create", "public", true),
            SdkworkRpcMethod::new(
                "RetrieveCurrentSession",
                "sessions.current.retrieve",
                "dual_token",
                false,
            ),
        ],
    );

    assert!(validate_manifest(&manifest).is_ok());
    assert_eq!(manifest.methods.len(), 2);
}

#[test]
fn empty_or_malformed_manifest_is_rejected() {
    let missing_method = SdkworkRpcServiceManifest::new(
        "sdkwork.iam.app.v3",
        "SessionService",
        "app",
        "iam",
        vec![SdkworkRpcMethod::new("", "sessions.create", "public", true)],
    );

    let missing_operation = SdkworkRpcServiceManifest::new(
        "sdkwork.iam.app.v3",
        "SessionService",
        "app",
        "iam",
        vec![SdkworkRpcMethod::new("CreateSession", "", "public", true)],
    );

    assert!(validate_manifest(&missing_method).is_err());
    assert!(validate_manifest(&missing_operation).is_err());
}

#[test]
fn sdkwork_error_kinds_map_to_grpc_status_codes() {
    assert_eq!(
        map_error_kind_to_code(SdkworkRpcErrorKind::Validation),
        Code::InvalidArgument
    );
    assert_eq!(
        map_error_kind_to_code(SdkworkRpcErrorKind::Unauthenticated),
        Code::Unauthenticated
    );
    assert_eq!(
        map_error_kind_to_code(SdkworkRpcErrorKind::Unauthorized),
        Code::PermissionDenied
    );
    assert_eq!(
        map_error_kind_to_code(SdkworkRpcErrorKind::NotFound),
        Code::NotFound
    );
    assert_eq!(
        map_error_kind_to_code(SdkworkRpcErrorKind::Conflict),
        Code::Aborted
    );
    assert_eq!(
        map_error_kind_to_code(SdkworkRpcErrorKind::UnsupportedCapability),
        Code::Unimplemented
    );
    assert_eq!(
        map_error_kind_to_code(SdkworkRpcErrorKind::ProviderUnavailable),
        Code::Unavailable
    );
}
