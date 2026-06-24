use std::sync::Arc;

use async_trait::async_trait;
use sdkwork_claw_http::AppSessionTenantSigningKeyResolver;

use crate::ports::TenantSigningKeyStore;

pub struct TenantSigningKeyStoreWebResolver {
    store: Arc<dyn TenantSigningKeyStore + Send + Sync>,
}

impl TenantSigningKeyStoreWebResolver {
    pub fn new(store: Arc<dyn TenantSigningKeyStore + Send + Sync>) -> Self {
        Self { store }
    }
}

#[async_trait]
impl AppSessionTenantSigningKeyResolver for TenantSigningKeyStoreWebResolver {
    async fn resolve_signing_secret_by_kid(&self, kid: &str) -> Option<Vec<u8>> {
        self.store
            .resolve_by_kid(kid)
            .await
            .ok()
            .flatten()
            .map(|signing_key| signing_key.secret)
    }
}
