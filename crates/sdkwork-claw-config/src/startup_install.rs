#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum StartupInstallMode {
    Ensure,
    Skip,
}

impl StartupInstallMode {
    pub const ENV_STARTUP_INSTALL_MODE: &'static str = "SDKWORK_CLAW_STARTUP_INSTALL_MODE";

    pub fn from_env() -> Result<Self, String> {
        Self::from_env_or_runtime_toml(None)
    }

    pub fn from_env_or_runtime_toml(
        runtime_toml: Option<&crate::RuntimeTomlConfig>,
    ) -> Result<Self, String> {
        Self::from_optional_part(
            crate::runtime::env_optional(Self::ENV_STARTUP_INSTALL_MODE)
                .or_else(|| runtime_toml.and_then(|config| config.install.startup_mode.clone())),
        )
    }

    pub fn from_optional_part(value: Option<String>) -> Result<Self, String> {
        let Some(value) = value else {
            return Ok(Self::Ensure);
        };
        match value.trim().to_ascii_lowercase().as_str() {
            "" | "ensure" => Ok(Self::Ensure),
            "skip" => Ok(Self::Skip),
            _ => Err(format!(
                "{} must be ensure or skip",
                Self::ENV_STARTUP_INSTALL_MODE
            )),
        }
    }

    pub fn should_ensure(self) -> bool {
        matches!(self, Self::Ensure)
    }
}
