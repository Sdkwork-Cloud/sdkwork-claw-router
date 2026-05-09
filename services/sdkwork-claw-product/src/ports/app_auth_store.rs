use std::future::Future;
use std::pin::Pin;

use crate::domain::DomainResult;

pub type AppAuthFuture<'a, T> = Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AppAuthUserCredential {
    pub id: i64,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub username: String,
    pub email: String,
    pub name: String,
    pub avatar: String,
    pub password_hash: String,
    pub status: i64,
}

pub trait AppAuthStore {
    fn find_user_for_password_login<'a>(
        &'a self,
        account: &'a str,
    ) -> AppAuthFuture<'a, Option<AppAuthUserCredential>>;
}
