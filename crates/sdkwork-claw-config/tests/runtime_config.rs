use sdkwork_claw_config::{DeploymentMode, RuntimeConfig};

#[test]
fn runtime_config_uses_default_bind_and_desktop_mode_when_env_parts_are_absent() {
    let config = RuntimeConfig::from_optional_parts(
        "sdkwork-claw-gateway",
        "SDKWORK_CLAW_GATEWAY_BIND",
        "0.0.0.0:18080",
        None,
        None,
    )
    .unwrap();

    assert_eq!("sdkwork-claw-gateway", config.service_name);
    assert_eq!(DeploymentMode::Desktop, config.deployment_mode);
    assert_eq!("0.0.0.0:18080", config.bind_addr);
}

#[test]
fn runtime_config_accepts_service_bind_override_and_kubernetes_alias() {
    let config = RuntimeConfig::from_optional_parts(
        "sdkwork-claw-gateway",
        "SDKWORK_CLAW_GATEWAY_BIND",
        "0.0.0.0:18080",
        Some("127.0.0.1:19090".to_owned()),
        Some("k8s".to_owned()),
    )
    .unwrap();

    assert_eq!(DeploymentMode::Kubernetes, config.deployment_mode);
    assert_eq!("127.0.0.1:19090", config.bind_addr);
}

#[test]
fn runtime_config_rejects_blank_or_invalid_bind_address() {
    let blank = RuntimeConfig::from_optional_parts(
        "sdkwork-claw-gateway",
        "SDKWORK_CLAW_GATEWAY_BIND",
        "0.0.0.0:18080",
        Some("   ".to_owned()),
        None,
    )
    .unwrap_err();
    assert!(blank.contains("SDKWORK_CLAW_GATEWAY_BIND"));

    let invalid = RuntimeConfig::from_optional_parts(
        "sdkwork-claw-gateway",
        "SDKWORK_CLAW_GATEWAY_BIND",
        "0.0.0.0:18080",
        Some("not-a-socket".to_owned()),
        None,
    )
    .unwrap_err();
    assert!(invalid.contains("valid socket address"));
}

#[test]
fn runtime_config_rejects_invalid_deployment_mode() {
    let error = RuntimeConfig::from_optional_parts(
        "sdkwork-claw-gateway",
        "SDKWORK_CLAW_GATEWAY_BIND",
        "0.0.0.0:18080",
        None,
        Some("lambda".to_owned()),
    )
    .unwrap_err();

    assert!(error.contains("SDKWORK_CLAW_DEPLOYMENT_MODE"));
}
