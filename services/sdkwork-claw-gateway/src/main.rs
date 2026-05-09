#[tokio::main]
async fn main() -> anyhow::Result<()> {
    if env_truthy("SDKWORK_CLAW_EDGE_SERVER") {
        let config = sdkwork_claw_config::RuntimeConfig::from_env(
            sdkwork_claw_gateway::SERVICE_NAME,
            "SDKWORK_CLAW_SERVER_BIND",
            "0.0.0.0:3900",
        )
        .map_err(anyhow::Error::msg)?;
        let edge_config = build_edge_server_config()?;
        return sdkwork_claw_gateway::serve_edge_server(config.bind_addr(), edge_config).await;
    }

    let config = sdkwork_claw_config::RuntimeConfig::from_env(
        sdkwork_claw_gateway::SERVICE_NAME,
        "SDKWORK_CLAW_GATEWAY_BIND",
        "0.0.0.0:18080",
    )
    .map_err(anyhow::Error::msg)?;
    sdkwork_claw_gateway::serve(config.bind_addr()).await
}

fn build_edge_server_config() -> anyhow::Result<sdkwork_claw_gateway::EdgeServerConfig> {
    let mut edge_config = sdkwork_claw_gateway::EdgeServerConfig::try_new(
        env_or_default(
            "SDKWORK_CLAW_EDGE_GATEWAY_BASE_URL",
            "http://127.0.0.1:18080",
        ),
        env_or_default(
            "SDKWORK_CLAW_EDGE_BACKEND_API_BASE_URL",
            "http://127.0.0.1:18081",
        ),
        env_or_default(
            "SDKWORK_CLAW_EDGE_APP_API_BASE_URL",
            "http://127.0.0.1:18082",
        ),
        env_or_default("SDKWORK_CLAW_EDGE_PORTAL_BASE_URL", "http://127.0.0.1:3901"),
    )
    .and_then(|config| {
        config.with_external_scheme(env_or_default("SDKWORK_CLAW_EDGE_EXTERNAL_SCHEME", "http"))
    })
    .map(|config| {
        config
            .with_trusted_forwarded_headers(env_truthy("SDKWORK_CLAW_EDGE_TRUST_FORWARDED_HEADERS"))
    })
    .map_err(anyhow::Error::msg)?;

    if let Some(path) = env_optional("SDKWORK_CLAW_EDGE_PORTAL_STATIC_DIST") {
        edge_config = edge_config
            .with_portal_static_dist(path)
            .map_err(anyhow::Error::msg)?;
    }
    if let Some(value) = env_optional("PORTAL_PUBLIC_API_BASE_URL") {
        edge_config = edge_config
            .with_portal_public_api_base_url(value)
            .map_err(anyhow::Error::msg)?;
    }
    if let Some(value) = env_optional("PORTAL_PUBLIC_APP_API_BASE_URL") {
        edge_config = edge_config
            .with_portal_public_app_api_base_url(value)
            .map_err(anyhow::Error::msg)?;
    }
    if let Some(value) = env_optional("PORTAL_PUBLIC_BACKEND_API_BASE_URL") {
        edge_config = edge_config
            .with_portal_public_backend_api_base_url(value)
            .map_err(anyhow::Error::msg)?;
    }
    if let Some(value) = env_optional("PORTAL_CSP_CONNECT_SRC") {
        edge_config = edge_config
            .with_portal_csp_connect_src(value)
            .map_err(anyhow::Error::msg)?;
    }
    edge_config = edge_config
        .with_portal_public_tool_api_enabled(env_truthy("PORTAL_PUBLIC_TOOL_API_ENABLED"));
    let tool_api_rate_limit_requests =
        env_u32_or_default("PORTAL_TOOL_API_RATE_LIMIT_REQUESTS", 120)?;
    let tool_api_rate_limit_window_seconds =
        env_u64_or_default("PORTAL_TOOL_API_RATE_LIMIT_WINDOW_SECONDS", 60)?;
    edge_config = edge_config
        .with_portal_tool_api_rate_limit(
            tool_api_rate_limit_requests,
            std::time::Duration::from_secs(tool_api_rate_limit_window_seconds),
        )
        .map_err(anyhow::Error::msg)?;
    if let Some(path) = env_optional("PORTAL_TOOL_API_SDK_ARCHIVE_ROOT") {
        edge_config = edge_config
            .with_portal_tool_api_sdk_archive_root(path)
            .map_err(anyhow::Error::msg)?;
    }
    if let Some(value) = env_optional("PORTAL_TOOL_API_SDK_GENERATOR_BASE_URL") {
        edge_config = edge_config
            .with_portal_tool_api_sdk_generator_base_url(value)
            .map_err(anyhow::Error::msg)?;
    }
    if let Some(value) = env_optional("PORTAL_TOOL_API_SDK_GENERATOR_API_KEY") {
        edge_config = edge_config
            .with_portal_tool_api_sdk_generator_api_key(value)
            .map_err(anyhow::Error::msg)?;
    }

    Ok(edge_config)
}

fn env_or_default(name: &str, default_value: &str) -> String {
    std::env::var(name).unwrap_or_else(|_| default_value.to_owned())
}

fn env_optional(name: &str) -> Option<String> {
    std::env::var(name)
        .ok()
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
}

fn env_truthy(name: &str) -> bool {
    std::env::var(name)
        .ok()
        .is_some_and(|value| matches!(value.as_str(), "1" | "true" | "yes" | "on"))
}

fn env_u32_or_default(name: &str, default_value: u32) -> anyhow::Result<u32> {
    let Some(value) = env_optional(name) else {
        return Ok(default_value);
    };
    value
        .parse::<u32>()
        .map_err(|error| anyhow::anyhow!("{name} must be a positive integer: {error}"))
}

fn env_u64_or_default(name: &str, default_value: u64) -> anyhow::Result<u64> {
    let Some(value) = env_optional(name) else {
        return Ok(default_value);
    };
    value
        .parse::<u64>()
        .map_err(|error| anyhow::anyhow!("{name} must be a positive integer: {error}"))
}
