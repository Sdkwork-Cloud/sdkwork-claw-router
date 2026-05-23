#[test]
fn tencent_cloud_adapter_exposes_provider_family_and_vidu_standard_endpoint_mapping() {
    let adapter = sdkwork_provider_adapter_tencent_cloud::provider_adapter();

    assert_eq!("tencent-cloud", adapter.package());
    assert_eq!("tencent-cloud", adapter.provider_family());
    assert!(adapter.provider_codes().contains(&"tencent-cloud"));
    assert!(adapter.provider_codes().contains(&"tencent-hunyuan"));
    let endpoints = adapter.endpoints();
    let start_end2video = endpoints
        .iter()
        .find(|endpoint| endpoint.endpoint_key == "video.start_end2video")
        .expect("Tencent Cloud adapter should expose Vidu standard start-end2video mapping");
    assert_eq!(
        Some("video_generation"),
        start_end2video.capability.as_deref()
    );
    assert_eq!("POST", start_end2video.method);
    assert_eq!(
        "/vidu/ent/v2/start-end2video",
        start_end2video.standard_path_pattern
    );
}

#[test]
fn tc3_credentials_debug_redacts_secret_key() {
    let credentials =
        sdkwork_provider_adapter_tencent_cloud::common::signer_tc3::Tc3Credentials::new(
            "secret-id",
            "secret-key",
        );

    let debug = format!("{credentials:?}");

    assert!(debug.contains("secret-id"));
    assert!(!debug.contains("secret-key"));
    assert!(debug.contains("[REDACTED]"));
}
