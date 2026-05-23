use sdkwork_claw_provider_adapter_contract::{
    AdapterError, AdapterInvocationRequest, AdapterInvocationResponse, AdapterInvocationShape,
};
use sdkwork_claw_provider_adapter_core::{
    AdapterInvocationContext, AdapterInvocationFuture, EndpointAdapter, ProviderAdapterEndpoint,
};
use serde_json::json;

pub const ENDPOINT_KEY: &str = "video.start_end2video";
pub const CAPABILITY: &str = "video_generation";
pub const STANDARD_PATH: &str = "/vidu/ent/v2/start-end2video";

#[derive(Debug, Clone, Copy, Default)]
pub struct TencentCloudViduStartEnd2VideoAdapter;

pub fn endpoint_manifest() -> ProviderAdapterEndpoint {
    ProviderAdapterEndpoint {
        endpoint_key: ENDPOINT_KEY.to_owned(),
        capability: Some(CAPABILITY.to_owned()),
        method: "POST".to_owned(),
        standard_path_pattern: STANDARD_PATH.to_owned(),
        invocation_shape: AdapterInvocationShape::AsyncTaskStart,
    }
}

impl EndpointAdapter for TencentCloudViduStartEnd2VideoAdapter {
    fn endpoint_key(&self) -> &'static str {
        ENDPOINT_KEY
    }

    fn method(&self) -> &'static str {
        "POST"
    }

    fn standard_path_pattern(&self) -> &'static str {
        STANDARD_PATH
    }

    fn invocation_shape(&self) -> AdapterInvocationShape {
        AdapterInvocationShape::AsyncTaskStart
    }

    fn invoke<'a>(
        &'a self,
        _context: AdapterInvocationContext,
        request: AdapterInvocationRequest,
    ) -> AdapterInvocationFuture<'a> {
        Box::pin(async move { invoke_start_end2video(request) })
    }
}

fn invoke_start_end2video(
    request: AdapterInvocationRequest,
) -> Result<AdapterInvocationResponse, AdapterError> {
    let _ = request;
    let provider_task_id = "tencent-cloud-vidu-task-1".to_owned();
    Ok(AdapterInvocationResponse::json_task(
        200,
        json!({
            "id": provider_task_id,
            "status": "queued"
        }),
    )
    .with_provider_task_id(provider_task_id)
    .with_billing_units(1))
}
