use std::sync::Arc;

use sdkwork_claw_provider_adapter_core::ProviderAdapter;

pub fn build_provider_adapters() -> Vec<Arc<dyn ProviderAdapter>> {
    vec![
        sdkwork_provider_adapter_tencent_cloud::provider_adapter(),
        sdkwork_provider_adapter_alicloud::provider_adapter(),
    ]
}
