use std::fmt;

#[derive(Clone, PartialEq, Eq)]
pub struct ApiKeySecurityConfig {
    pepper_secret: String,
}

impl ApiKeySecurityConfig {
    pub const ENV_API_KEY_PEPPER: &'static str = "SDKWORK_CLAW_API_KEY_PEPPER";
    pub const MIN_PEPPER_LEN: usize = 32;

    pub fn from_optional_parts(pepper_secret: Option<String>) -> Result<Option<Self>, String> {
        let Some(pepper_secret) = pepper_secret else {
            return Ok(None);
        };
        Self::from_pepper_secret(pepper_secret).map(Some)
    }

    pub fn from_pepper_secret(pepper_secret: impl Into<String>) -> Result<Self, String> {
        let pepper_secret = pepper_secret.into();
        let trimmed = pepper_secret.trim();
        if trimmed.is_empty() {
            return Err(format!("{} must not be blank", Self::ENV_API_KEY_PEPPER));
        }
        if trimmed.len() < Self::MIN_PEPPER_LEN {
            return Err(format!(
                "{} must be at least {} characters",
                Self::ENV_API_KEY_PEPPER,
                Self::MIN_PEPPER_LEN
            ));
        }
        Ok(Self {
            pepper_secret: trimmed.to_owned(),
        })
    }

    pub fn from_env() -> Result<Option<Self>, String> {
        Self::from_optional_parts(std::env::var(Self::ENV_API_KEY_PEPPER).ok())
    }

    pub fn pepper_secret(&self) -> &str {
        &self.pepper_secret
    }
}

impl fmt::Debug for ApiKeySecurityConfig {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter
            .debug_struct("ApiKeySecurityConfig")
            .field("pepper_secret", &"[REDACTED]")
            .finish()
    }
}
