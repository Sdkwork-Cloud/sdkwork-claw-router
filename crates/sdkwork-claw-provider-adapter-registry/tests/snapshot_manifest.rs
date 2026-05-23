use sdkwork_claw_provider_adapter_contract::{
    AdapterInvocationShape, AdapterKind, AdapterRouteStatus, ProviderAdapterEndpointManifest,
    ProviderAdapterManifest, ProviderAdapterProviderManifest,
};
use sdkwork_claw_provider_adapter_registry::ProviderAdapterSnapshot;

#[test]
fn snapshot_builds_internal_http_routes_from_adapter_manifest() {
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

    let snapshot =
        ProviderAdapterSnapshot::from_manifest(&manifest, "http://127.0.0.1:39110").unwrap();

    assert_eq!(2, snapshot.routes.len());
    let official_route = snapshot
        .routes
        .iter()
        .find(|route| route.provider_code == "tencent-cloud")
        .unwrap();
    assert_eq!(AdapterKind::InternalHttp, official_route.adapter_kind);
    assert_eq!("http://127.0.0.1:39110", official_route.adapter_base_url);
    assert_eq!(
        Some("video_generation"),
        official_route.capability.as_deref()
    );
    assert_eq!(
        Some("video.start_end2video"),
        official_route.endpoint_key.as_deref()
    );
    assert_eq!("POST", official_route.method);
    assert_eq!(
        AdapterInvocationShape::AsyncTaskStart,
        official_route.invocation_shape
    );
    assert_eq!(
        "/vidu/ent/v2/start-end2video",
        official_route.standard_path_pattern
    );
    assert_eq!(
        "/providers/{provider_code}{standard_path}",
        official_route.adapter_path_template
    );
    assert_eq!(AdapterRouteStatus::Enabled, official_route.status);
    assert_eq!(10, official_route.priority);
    assert_eq!(
        "/providers/tencent-cloud/vidu/ent/v2/start-end2video",
        official_route.adapter_path("/vidu/ent/v2/start-end2video")
    );
}

#[test]
fn snapshot_rejects_blank_adapter_base_url_when_manifest_has_routes() {
    let manifest = ProviderAdapterManifest {
        providers: vec![ProviderAdapterProviderManifest {
            package: "tencent-cloud".to_owned(),
            provider_family: "tencent-cloud".to_owned(),
            provider_codes: vec!["tencent-cloud".to_owned()],
            endpoints: vec![ProviderAdapterEndpointManifest {
                endpoint_key: "video.start_end2video".to_owned(),
                capability: Some("video_generation".to_owned()),
                method: "POST".to_owned(),
                standard_path_pattern: "/vidu/ent/v2/start-end2video".to_owned(),
                invocation_shape: AdapterInvocationShape::AsyncTaskStart,
            }],
        }],
    };

    let error = ProviderAdapterSnapshot::from_manifest(&manifest, "   ").unwrap_err();

    assert!(error.contains("adapter base URL"));
}
