use std::collections::BTreeMap;
use std::fmt;

use sdkwork_claw_config::ProviderSecretMapConfig;

use crate::domain::{DomainError, DomainResult};
use crate::ports::ProviderSecretResolver;

#[derive(Clone)]
pub struct ProviderSecretMapResolver {
    secrets: BTreeMap<String, String>,
}

impl ProviderSecretMapResolver {
    pub fn from_config(config: ProviderSecretMapConfig) -> Self {
        Self {
            secrets: config.into_secret_map(),
        }
    }
}

impl ProviderSecretResolver for ProviderSecretMapResolver {
    fn resolve_secret_value(&self, secret_ref: &str) -> DomainResult<String> {
        let secret_ref = secret_ref.trim();
        if secret_ref.is_empty() {
            return Err(DomainError::new("provider secret_ref is required"));
        }
        self.secrets
            .get(secret_ref)
            .cloned()
            .ok_or_else(|| DomainError::new("provider secret_ref is not configured"))
    }
}

impl fmt::Debug for ProviderSecretMapResolver {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter
            .debug_struct("ProviderSecretMapResolver")
            .field("secret_count", &self.secrets.len())
            .field("secret_values", &"[REDACTED]")
            .finish()
    }
}
