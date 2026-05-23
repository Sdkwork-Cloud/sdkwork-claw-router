use sdkwork_claw_provider_adapter_contract::{
    AdapterInvocationShape, ProviderAdapterEndpointManifest, ProviderAdapterManifest,
    ProviderAdapterProviderManifest,
};

#[test]
fn provider_adapter_manifest_serializes_endpoint_capability() {
    let manifest = ProviderAdapterManifest {
        providers: vec![ProviderAdapterProviderManifest {
            package: "tencent-cloud".to_owned(),
            provider_family: "tencent-cloud".to_owned(),
            provider_codes: vec!["tencent-cloud".to_owned(), "tencent-hunyuan".to_owned()],
            endpoints: vec![ProviderAdapterEndpointManifest {
                endpoint_key: "video.start_end2video".to_owned(),
                capability: Some("video_generation".to_owned()),
                method: "POST".to_owned(),
                standard_path_pattern: "/vidu/ent/v2/start-end2video".to_owned(),
                invocation_shape: AdapterInvocationShape::AsyncTaskStart,
            }],
        }],
    };

    let payload = serde_json::to_value(&manifest).unwrap();

    assert_eq!("tencent-cloud", payload["providers"][0]["package"]);
    assert_eq!(
        "video_generation",
        payload["providers"][0]["endpoints"][0]["capability"]
    );
    assert_eq!(
        "async_task_start",
        payload["providers"][0]["endpoints"][0]["invocationShape"]
    );

    let round_trip: ProviderAdapterManifest = serde_json::from_value(payload).unwrap();
    assert_eq!(manifest, round_trip);
}
