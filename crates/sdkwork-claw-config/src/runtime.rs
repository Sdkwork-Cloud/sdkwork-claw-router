use crate::DeploymentMode;
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct RuntimeConfig {
    pub service_name: String,
    pub deployment_mode: DeploymentMode,
    pub bind_addr: String,
}

impl RuntimeConfig {
    pub fn new(service_name: impl Into<String>, bind_addr: impl Into<String>) -> Self {
        Self {
            service_name: service_name.into(),
            deployment_mode: DeploymentMode::from_env(),
            bind_addr: bind_addr.into(),
        }
    }

    pub fn from_env(
        service_name: impl Into<String>,
        bind_env_name: impl Into<String>,
        default_bind_addr: impl Into<String>,
    ) -> Result<Self, String> {
        let bind_env_name = bind_env_name.into();
        Self::from_optional_parts(
            service_name,
            bind_env_name.as_str(),
            default_bind_addr,
            std::env::var(&bind_env_name).ok(),
            std::env::var(DeploymentMode::ENV_DEPLOYMENT_MODE).ok(),
        )
    }

    pub fn from_optional_parts(
        service_name: impl Into<String>,
        bind_env_name: impl Into<String>,
        default_bind_addr: impl Into<String>,
        bind_addr: Option<String>,
        deployment_mode: Option<String>,
    ) -> Result<Self, String> {
        let service_name = service_name.into().trim().to_owned();
        if service_name.is_empty() {
            return Err("service name must not be blank".to_owned());
        }

        let bind_env_name = bind_env_name.into().trim().to_owned();
        if bind_env_name.is_empty() {
            return Err("bind environment variable name must not be blank".to_owned());
        }

        let bind_addr = bind_addr
            .unwrap_or_else(|| default_bind_addr.into())
            .trim()
            .to_owned();
        if bind_addr.is_empty() {
            return Err(format!("{bind_env_name} must not be blank"));
        }
        bind_addr
            .parse::<SocketAddr>()
            .map_err(|error| format!("{bind_env_name} must be a valid socket address: {error}"))?;

        Ok(Self {
            service_name,
            deployment_mode: DeploymentMode::from_optional_part(deployment_mode)?,
            bind_addr,
        })
    }

    pub fn bind_addr(&self) -> &str {
        &self.bind_addr
    }
}
