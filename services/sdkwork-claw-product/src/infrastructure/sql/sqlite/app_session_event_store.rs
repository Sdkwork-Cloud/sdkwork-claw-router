use sqlx::SqlitePool;

use crate::domain::DomainError;
use crate::ports::{
    AppSessionEventStore, AppSessionEventStoreFuture, RecordAppSessionIssuedEventCommand,
};

#[derive(Debug, Clone)]
pub struct SqliteAppSessionEventStore {
    pool: SqlitePool,
}

impl SqliteAppSessionEventStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl AppSessionEventStore for SqliteAppSessionEventStore {
    fn record_app_session_issued<'a>(
        &'a self,
        command: RecordAppSessionIssuedEventCommand,
    ) -> AppSessionEventStoreFuture<'a, ()> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin app session transaction", error)
                })?;
            sqlx::query(
                r#"
                INSERT INTO iam_session
                    (id, tenant_id, organization_id, user_id, app_id, environment, deployment_mode, auth_level,
                     auth_token_hash, access_token_hash, refresh_token_hash, sharding_key, sharding_strategy,
                     data_scope_json, permission_scope_json, expires_at, revoked_at, created_at, updated_at)
                VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)
                "#,
            )
            .bind(&command.session_id)
            .bind(command.tenant_id.to_string())
            .bind(command.organization_id.to_string())
            .bind(command.user_id.to_string())
            .bind(&command.app_id)
            .bind(&command.environment)
            .bind(&command.deployment_mode)
            .bind(&command.auth_level)
            .bind(&command.auth_token_hash)
            .bind(&command.access_token_hash)
            .bind(command.refresh_token_hash.as_deref())
            .bind(&command.sharding_key)
            .bind(&command.sharding_strategy)
            .bind(&command.data_scope_json)
            .bind(&command.permission_scope_json)
            .bind(&command.expires_at)
            .bind(&command.created_at)
            .bind(&command.created_at)
            .execute(&mut *tx)
            .await
            .map_err(|error| store_error("failed to insert IAM session", error))?;

            sqlx::query(
                r#"
                INSERT INTO iam_security_event
                    (id, tenant_id, user_id, session_id, event_type, severity, detail_json, created_at)
                VALUES
                    (?, ?, ?, ?, 'sessions.create', 'info', ?, ?)
                "#,
            )
            .bind(&command.security_event_id)
            .bind(command.tenant_id.to_string())
            .bind(command.user_id.to_string())
            .bind(&command.session_id)
            .bind(security_event_detail_json(&command))
            .bind(&command.created_at)
            .execute(&mut *tx)
            .await
            .map_err(|error| store_error("failed to insert IAM security event", error))?;

            sqlx::query(
                r#"
                INSERT INTO iam_audit_event
                    (id, tenant_id, organization_id, actor_user_id, action, resource_type, resource_id,
                     request_id, app_id, environment, sharding_key, detail_json, created_at)
                VALUES
                    (?, ?, ?, ?, 'sessions.create', 'iam_session', ?, ?, ?, ?, ?, ?, ?)
                "#,
            )
            .bind(&command.audit_event_id)
            .bind(command.tenant_id.to_string())
            .bind(command.organization_id.to_string())
            .bind(command.user_id.to_string())
            .bind(&command.session_id)
            .bind(command.request_id.as_deref())
            .bind(&command.app_id)
            .bind(&command.environment)
            .bind(&command.sharding_key)
            .bind(audit_event_detail_json(&command))
            .bind(&command.created_at)
            .execute(&mut *tx)
            .await
            .map_err(|error| store_error("failed to insert IAM audit event", error))?;

            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit app session transaction", error))?;
            Ok(())
        })
    }
}

fn security_event_detail_json(command: &RecordAppSessionIssuedEventCommand) -> String {
    serde_json::json!({
        "authLevel": command.auth_level,
        "appId": command.app_id,
        "deploymentMode": command.deployment_mode,
        "environment": command.environment,
        "requestId": command.request_id,
    })
    .to_string()
}

fn audit_event_detail_json(command: &RecordAppSessionIssuedEventCommand) -> String {
    serde_json::json!({
        "authLevel": command.auth_level,
        "dataScope": command.data_scope_json,
        "permissionScope": command.permission_scope_json,
        "sessionIdHash": command.session_id_hash,
    })
    .to_string()
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}
