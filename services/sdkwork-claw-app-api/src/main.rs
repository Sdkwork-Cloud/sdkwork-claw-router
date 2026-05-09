#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let config = sdkwork_claw_config::RuntimeConfig::from_env(
        sdkwork_claw_app_api::SERVICE_NAME,
        "SDKWORK_CLAW_APP_API_BIND",
        "0.0.0.0:18082",
    )
    .map_err(anyhow::Error::msg)?;
    sdkwork_claw_app_api::serve(config.bind_addr()).await
}
