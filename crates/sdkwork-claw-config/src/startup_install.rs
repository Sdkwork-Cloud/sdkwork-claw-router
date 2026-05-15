#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum StartupInstallMode {
    Ensure,
    Skip,
}

impl StartupInstallMode {
    pub const ENV_STARTUP_INSTALL_MODE: &'static str = "SDKWORK_CLAW_STARTUP_INSTALL_MODE";

    pub fn from_env() -> Result<Self, String> {
        Self::from_optional_part(std::env::var(Self::ENV_STARTUP_INSTALL_MODE).ok())
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
