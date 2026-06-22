use std::future::Future;
use std::pin::Pin;

use serde_json::Value;

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

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct LoadActiveAppSessionQuery {
    pub auth_token_hash: String,
    pub access_token_hash: String,
    pub refresh_token_hash: Option<String>,
    pub now: i64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AppSessionRecord {
    pub session_id: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
    pub app_id: String,
    pub environment: String,
    pub deployment_mode: String,
    pub auth_level: String,
    pub data_scope_json: String,
    pub permission_scope_json: String,
    pub expires_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AppSessionUserRecord {
    pub id: i64,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub username: String,
    pub display_name: String,
    pub email: String,
    pub avatar: Value,
    pub phone: String,
    pub language: String,
    pub is_verified: bool,
    pub status: String,
    pub registered_at: String,
    pub last_login: String,
    pub last_login_ip: String,
    pub password_last_changed: String,
    pub two_factor_enabled: bool,
    pub third_party_bound: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ActiveAppSession {
    pub session: AppSessionRecord,
    pub user: AppSessionUserRecord,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ResolveAppSessionOrganizationQuery {
    pub tenant_id: i64,
    pub user_id: i64,
    pub organization_id: Option<String>,
    pub organization_code: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ResolvedAppSessionOrganization {
    pub organization_id: i64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RotateAppSessionTokensCommand {
    pub session_id: String,
    pub tenant_id: i64,
    pub user_id: i64,
    pub expected_auth_token_hash: String,
    pub expected_access_token_hash: String,
    pub expected_refresh_token_hash: Option<String>,
    pub auth_token_hash: String,
    pub access_token_hash: String,
    pub refresh_token_hash: String,
    pub organization_id: Option<i64>,
    pub data_scope_json: Option<String>,
    pub expires_at: String,
    pub updated_at: String,
    pub security_event_id: String,
    pub event_type: String,
    pub detail_json: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RevokeAppSessionCommand {
    pub session_id: String,
    pub tenant_id: i64,
    pub user_id: i64,
    pub expected_auth_token_hash: String,
    pub expected_access_token_hash: String,
    pub revoked_at: String,
    pub security_event_id: String,
    pub detail_json: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RecordAppSecurityEventCommand {
    pub security_event_id: String,
    pub tenant_id: Option<i64>,
    pub user_id: Option<i64>,
    pub session_id: Option<String>,
    pub event_type: String,
    pub severity: String,
    pub detail_json: String,
    pub created_at: String,
}

pub type AppSessionEventStoreFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

pub trait AppSessionEventStore {
    fn record_app_session_issued<'a>(
        &'a self,
        command: RecordAppSessionIssuedEventCommand,
    ) -> AppSessionEventStoreFuture<'a, ()>;

    fn load_active_app_session<'a>(
        &'a self,
        _query: LoadActiveAppSessionQuery,
    ) -> AppSessionEventStoreFuture<'a, Option<ActiveAppSession>> {
        Box::pin(async {
            Err(crate::domain::DomainError::new(
                "app session lifecycle store is not configured",
            ))
        })
    }

    fn resolve_app_session_organization<'a>(
        &'a self,
        _query: ResolveAppSessionOrganizationQuery,
    ) -> AppSessionEventStoreFuture<'a, Option<ResolvedAppSessionOrganization>> {
        Box::pin(async {
            Err(crate::domain::DomainError::new(
                "app session lifecycle store is not configured",
            ))
        })
    }

    fn rotate_app_session_tokens<'a>(
        &'a self,
        _command: RotateAppSessionTokensCommand,
    ) -> AppSessionEventStoreFuture<'a, bool> {
        Box::pin(async {
            Err(crate::domain::DomainError::new(
                "app session lifecycle store is not configured",
            ))
        })
    }

    fn revoke_app_session<'a>(
        &'a self,
        _command: RevokeAppSessionCommand,
    ) -> AppSessionEventStoreFuture<'a, bool> {
        Box::pin(async {
            Err(crate::domain::DomainError::new(
                "app session lifecycle store is not configured",
            ))
        })
    }

    fn record_app_security_event<'a>(
        &'a self,
        _command: RecordAppSecurityEventCommand,
    ) -> AppSessionEventStoreFuture<'a, ()> {
        Box::pin(async {
            Err(crate::domain::DomainError::new(
                "app session lifecycle store is not configured",
            ))
        })
    }
}
