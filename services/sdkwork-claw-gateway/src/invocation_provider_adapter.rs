use sdkwork_claw_config::ProviderAdapterConfig;
use sdkwork_claw_product::application::{Invocation, InvocationAdapterTarget, InvocationShape};
use sdkwork_claw_product::ports::ProviderAdapterRouteResolver;
use sdkwork_claw_provider_adapter_contract::AdapterInvocationShape;
use sdkwork_claw_provider_adapter_registry::{
    ProviderAdapterLookup, ProviderAdapterRegistry, ProviderInvocationMode,
};

#[derive(Clone)]
pub(crate) struct InvocationProviderAdapterResolver {
    registry: ProviderAdapterRegistry,
    gateway_token: String,
}

impl InvocationProviderAdapterResolver {
    pub(crate) fn from_config(config: ProviderAdapterConfig) -> Option<Self> {
        if config.routes().is_empty() {
            return None;
        }
        Some(Self {
            registry: ProviderAdapterRegistry::new(config.routes().to_vec()),
            gateway_token: config.gateway_token().to_owned(),
        })
    }
}

impl ProviderAdapterRouteResolver for InvocationProviderAdapterResolver {
    fn resolve_adapter_target(&self, invocation: &Invocation) -> Option<InvocationAdapterTarget> {
        let provider_code = invocation
            .account
            .as_ref()
            .map(|account| account.provider_code.as_str())
            .or(invocation.resource.provider_code.as_deref())?;
        let lookup = ProviderAdapterLookup {
            provider_code,
            method: invocation.request.method.as_str(),
            standard_path: invocation.request.path.as_str(),
            capability: Some(provider_native_capability_code(
                invocation.resource.capability,
            )),
            endpoint_key: invocation
                .resource
                .endpoint_key
                .as_deref()
                .or(Some(invocation.resource.route_key.as_str())),
        };
        match self.registry.resolve_standard_path(&lookup).mode {
            ProviderInvocationMode::DirectHttp => None,
            ProviderInvocationMode::InternalHttpAdapter(route) => Some(InvocationAdapterTarget {
                provider_code: route.provider_code.clone(),
                endpoint_key: route
                    .endpoint_key
                    .clone()
                    .unwrap_or_else(|| invocation.resource.route_key.clone()),
                base_url: route.adapter_base_url,
                path_template: route.adapter_path_template,
                gateway_token: Some(self.gateway_token.clone()),
                shape: invocation_shape_from_adapter_shape(route.invocation_shape),
            }),
        }
    }
}

fn provider_native_capability_code(
    capability: sdkwork_claw_product::domain::RoutingCapability,
) -> &'static str {
    match capability {
        sdkwork_claw_product::domain::RoutingCapability::Chat => "chat",
        sdkwork_claw_product::domain::RoutingCapability::Embedding => "embedding",
        sdkwork_claw_product::domain::RoutingCapability::Image => "image_generation",
        sdkwork_claw_product::domain::RoutingCapability::Audio => "audio",
        sdkwork_claw_product::domain::RoutingCapability::Music => "music_generation",
        sdkwork_claw_product::domain::RoutingCapability::Video => "video_generation",
        sdkwork_claw_product::domain::RoutingCapability::Rerank => "rerank",
        sdkwork_claw_product::domain::RoutingCapability::Network => "network",
    }
}

fn invocation_shape_from_adapter_shape(shape: AdapterInvocationShape) -> InvocationShape {
    match shape {
        AdapterInvocationShape::SseStream => InvocationShape::SseStream,
        AdapterInvocationShape::ByteStream | AdapterInvocationShape::FileUpload => {
            InvocationShape::ByteStream
        }
        AdapterInvocationShape::HealthProbe => InvocationShape::Empty,
        AdapterInvocationShape::SyncJson
        | AdapterInvocationShape::AsyncTaskStart
        | AdapterInvocationShape::AsyncTaskQuery
        | AdapterInvocationShape::AsyncTaskCancel
        | AdapterInvocationShape::WebhookCallback => InvocationShape::Json,
    }
}
