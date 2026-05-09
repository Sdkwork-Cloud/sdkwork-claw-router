use serde::{Deserialize, Serialize};
use std::str::FromStr;

#[derive(Debug, Default, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum DeploymentMode {
    #[default]
    Desktop,
    Server,
    Docker,
    Kubernetes,
}

impl DeploymentMode {
    pub const ENV_DEPLOYMENT_MODE: &'static str = "SDKWORK_CLAW_DEPLOYMENT_MODE";

    pub const fn as_str(self) -> &'static str {
        match self {
            Self::Desktop => "desktop",
            Self::Server => "server",
            Self::Docker => "docker",
            Self::Kubernetes => "kubernetes",
        }
    }

    pub fn from_env() -> Self {
        std::env::var(Self::ENV_DEPLOYMENT_MODE)
            .ok()
            .and_then(|value| Self::from_str(&value).ok())
            .unwrap_or_default()
    }

    pub fn from_optional_part(value: Option<String>) -> Result<Self, String> {
        let Some(value) = value else {
            return Ok(Self::default());
        };
        Self::from_str(&value).map_err(|error| format!("{}: {error}", Self::ENV_DEPLOYMENT_MODE))
    }
}

impl FromStr for DeploymentMode {
    type Err = String;

    fn from_str(value: &str) -> Result<Self, Self::Err> {
        match value.trim().to_ascii_lowercase().as_str() {
            "desktop" => Ok(Self::Desktop),
            "server" => Ok(Self::Server),
            "docker" => Ok(Self::Docker),
            "kubernetes" | "k8s" => Ok(Self::Kubernetes),
            other => Err(format!("unsupported deployment mode: {other}")),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::str::FromStr;

    #[test]
    fn deployment_modes_parse_all_supported_modes() {
        assert_eq!(
            DeploymentMode::Desktop,
            DeploymentMode::from_str("desktop").unwrap()
        );
        assert_eq!(
            DeploymentMode::Server,
            DeploymentMode::from_str("server").unwrap()
        );
        assert_eq!(
            DeploymentMode::Docker,
            DeploymentMode::from_str("docker").unwrap()
        );
        assert_eq!(
            DeploymentMode::Kubernetes,
            DeploymentMode::from_str("kubernetes").unwrap()
        );
        assert_eq!("kubernetes", DeploymentMode::Kubernetes.as_str());
    }

    #[test]
    fn deployment_mode_rejects_unknown_values() {
        let error = DeploymentMode::from_str("lambda").unwrap_err();

        assert!(error.contains("unsupported deployment mode"));
    }
}
