use async_trait::async_trait;

/// Resolves tenant-bound app-session signing secrets for web-framework token verification.
#[async_trait]
pub trait AppSessionTenantSigningKeyResolver: Send + Sync {
    async fn resolve_signing_secret_by_kid(&self, kid: &str) -> Option<Vec<u8>>;
}
