use std::sync::Arc;

use sdkwork_claw_provider_adapter_contract::AdapterInvocationShape;
use sdkwork_claw_provider_adapter_core::{ProviderAdapter, ProviderAdapterEndpoint};

#[derive(Debug)]
struct EchoProviderAdapter;

impl ProviderAdapter for EchoProviderAdapter {
    fn package(&self) -> &'static str {
        "echo"
    }

    fn provider_family(&self) -> &'static str {
        "echo"
    }

    fn provider_codes(&self) -> &'static [&'static str] {
        &["echo-provider"]
    }

    fn endpoints(&self) -> Vec<ProviderAdapterEndpoint> {
        vec![ProviderAdapterEndpoint {
            endpoint_key: "video.start_end2video".to_owned(),
            capability: Some("video_generation".to_owned()),
            method: "POST".to_owned(),
            standard_path_pattern: "/vidu/ent/v2/start-end2video".to_owned(),
            invocation_shape: AdapterInvocationShape::AsyncTaskStart,
        }]
    }

    fn resolve_endpoint(
        &self,
        _request: &sdkwork_claw_provider_adapter_contract::AdapterInvocationRequest,
    ) -> Option<Arc<dyn sdkwork_claw_provider_adapter_core::EndpointAdapter>> {
        None
    }
}

#[test]
fn provider_adapter_exposes_manifest_endpoint_metadata() {
    let adapter = EchoProviderAdapter;

    let endpoints = adapter.endpoints();

    assert_eq!(adapter.package(), "echo");
    assert_eq!(adapter.provider_codes(), &["echo-provider"]);
    assert_eq!(endpoints[0].endpoint_key, "video.start_end2video");
    assert_eq!(endpoints[0].capability.as_deref(), Some("video_generation"));
    assert_eq!(
        endpoints[0].standard_path_pattern,
        "/vidu/ent/v2/start-end2video"
    );
    assert_eq!(
        endpoints[0].invocation_shape,
        AdapterInvocationShape::AsyncTaskStart
    );
}
