use std::fmt;

use hmac::{Hmac, Mac};
use sha2::Sha256;

use crate::application::ApiKeySecretHasher;
use crate::domain::{DomainError, DomainResult};

type HmacSha256 = Hmac<Sha256>;

#[derive(Clone)]
pub struct HmacSha256ApiKeySecretHasher {
    pepper_secret: String,
}

impl HmacSha256ApiKeySecretHasher {
    pub fn new(pepper_secret: impl Into<String>) -> DomainResult<Self> {
        let pepper_secret = pepper_secret.into();
        let trimmed = pepper_secret.trim();
        if trimmed.is_empty() {
            return Err(DomainError::new("api key pepper must not be blank"));
        }
        Ok(Self {
            pepper_secret: trimmed.to_owned(),
        })
    }
}

impl ApiKeySecretHasher for HmacSha256ApiKeySecretHasher {
    fn hash_secret(&self, secret: &str) -> DomainResult<String> {
        let mut mac = HmacSha256::new_from_slice(self.pepper_secret.as_bytes())
            .map_err(|_| DomainError::new("api key pepper is invalid"))?;
        mac.update(secret.as_bytes());
        Ok(hex::encode(mac.finalize().into_bytes()))
    }
}

impl fmt::Debug for HmacSha256ApiKeySecretHasher {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter
            .debug_struct("HmacSha256ApiKeySecretHasher")
            .field("pepper_secret", &"[REDACTED]")
            .finish()
    }
}
