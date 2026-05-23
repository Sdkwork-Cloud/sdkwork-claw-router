use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;

use sdkwork_claw_provider_adapter_contract::{
    AdapterError, AdapterInvocationRequest, AdapterInvocationResponse, AdapterInvocationShape,
    ProviderAdapterEndpointManifest, ProviderAdapterManifest, ProviderAdapterProviderManifest,
};

pub type AdapterInvocationFuture<'a> =
    Pin<Box<dyn Future<Output = Result<AdapterInvocationResponse, AdapterError>> + Send + 'a>>;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ProviderAdapterEndpoint {
    pub endpoint_key: String,
    pub capability: Option<String>,
    pub method: String,
    pub standard_path_pattern: String,
    pub invocation_shape: AdapterInvocationShape,
}

#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct AdapterInvocationContext {
    pub provider_code: String,
    pub request_id: Option<String>,
    pub trace_id: Option<String>,
}

pub trait EndpointAdapter: Send + Sync {
    fn endpoint_key(&self) -> &'static str;

    fn method(&self) -> &'static str;

    fn standard_path_pattern(&self) -> &'static str;

    fn invocation_shape(&self) -> AdapterInvocationShape;

    fn invoke<'a>(
        &'a self,
        context: AdapterInvocationContext,
        request: AdapterInvocationRequest,
    ) -> AdapterInvocationFuture<'a>;
}

pub trait ProviderAdapter: Send + Sync {
    fn package(&self) -> &'static str;

    fn provider_family(&self) -> &'static str;

    fn provider_codes(&self) -> &'static [&'static str];

    fn endpoints(&self) -> Vec<ProviderAdapterEndpoint>;

    fn resolve_endpoint(
        &self,
        request: &AdapterInvocationRequest,
    ) -> Option<Arc<dyn EndpointAdapter>>;
}

pub fn provider_adapter_manifest(adapters: &[Arc<dyn ProviderAdapter>]) -> ProviderAdapterManifest {
    ProviderAdapterManifest {
        providers: adapters
            .iter()
            .map(|adapter| ProviderAdapterProviderManifest {
                package: adapter.package().to_owned(),
                provider_family: adapter.provider_family().to_owned(),
                provider_codes: adapter
                    .provider_codes()
                    .iter()
                    .map(|provider_code| (*provider_code).to_owned())
                    .collect(),
                endpoints: adapter
                    .endpoints()
                    .into_iter()
                    .map(|endpoint| ProviderAdapterEndpointManifest {
                        endpoint_key: endpoint.endpoint_key,
                        capability: endpoint.capability,
                        method: endpoint.method,
                        standard_path_pattern: endpoint.standard_path_pattern,
                        invocation_shape: endpoint.invocation_shape,
                    })
                    .collect(),
            })
            .collect(),
    }
}
