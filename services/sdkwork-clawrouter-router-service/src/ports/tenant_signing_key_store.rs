use std::future::Future;
use std::pin::Pin;

use crate::domain::DomainResult;

pub type TenantSigningKeyFuture<'a, T> = Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct TenantSigningKey {
    pub tenant_id: i64,
    pub kid: String,
    pub secret: Vec<u8>,
}

pub trait TenantSigningKeyStore {
    fn ensure_active_key<'a>(
        &'a self,
        tenant_id: i64,
    ) -> TenantSigningKeyFuture<'a, TenantSigningKey>;

    fn resolve_by_kid<'a>(
        &'a self,
        kid: &'a str,
    ) -> TenantSigningKeyFuture<'a, Option<TenantSigningKey>>;
}
