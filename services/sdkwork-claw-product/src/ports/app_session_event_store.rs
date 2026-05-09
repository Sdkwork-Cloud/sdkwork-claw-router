use std::future::Future;
use std::pin::Pin;

use crate::domain::DomainResult;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RecordAppSessionIssuedEventCommand {
    pub event_uuid: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
    pub request_id: Option<String>,
    pub auth_provider: Option<String>,
    pub session_id_hash: String,
}

pub type AppSessionEventStoreFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

pub trait AppSessionEventStore {
    fn record_app_session_issued<'a>(
        &'a self,
        command: RecordAppSessionIssuedEventCommand,
    ) -> AppSessionEventStoreFuture<'a, ()>;
}
