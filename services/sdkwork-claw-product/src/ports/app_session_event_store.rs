use std::future::Future;
use std::pin::Pin;

use crate::domain::DomainResult;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RecordAppSessionIssuedEventCommand {
    pub session_id: String,
    pub security_event_id: String,
    pub audit_event_id: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
    pub request_id: Option<String>,
    pub auth_level: String,
    pub app_id: String,
    pub environment: String,
    pub deployment_mode: String,
    pub auth_token_hash: String,
    pub access_token_hash: String,
    pub refresh_token_hash: Option<String>,
    pub session_id_hash: String,
    pub sharding_key: String,
    pub sharding_strategy: String,
    pub data_scope_json: String,
    pub permission_scope_json: String,
    pub expires_at: String,
    pub created_at: String,
}

pub type AppSessionEventStoreFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

pub trait AppSessionEventStore {
    fn record_app_session_issued<'a>(
        &'a self,
        command: RecordAppSessionIssuedEventCommand,
    ) -> AppSessionEventStoreFuture<'a, ()>;
}
