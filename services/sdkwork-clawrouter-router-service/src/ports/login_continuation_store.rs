use std::future::Future;
use std::pin::Pin;

use crate::domain::DomainResult;

pub type LoginContinuationFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

pub const LOGIN_CONTINUATION_TTL_SECONDS: i64 = 300;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct LoginContinuationRecord {
    pub tenant_id: i64,
    pub user_id: i64,
    pub organization_ids: Vec<i64>,
    pub auth_level: String,
    pub expires_at_unix: i64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct StoreLoginContinuationCommand {
    pub token: String,
    pub record: LoginContinuationRecord,
}

pub trait LoginContinuationStore {
    fn store_login_continuation<'a>(
        &'a self,
        command: StoreLoginContinuationCommand,
    ) -> LoginContinuationFuture<'a, ()>;

    fn take_login_continuation<'a>(
        &'a self,
        token: &'a str,
    ) -> LoginContinuationFuture<'a, Option<LoginContinuationRecord>>;
}
