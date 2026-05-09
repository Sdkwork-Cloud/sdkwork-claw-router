use sqlx::PgPool;

use crate::domain::DomainError;
use crate::ports::{
    AppSessionEventStore, AppSessionEventStoreFuture, RecordAppSessionIssuedEventCommand,
};

#[derive(Debug, Clone)]
pub struct PostgresAppSessionEventStore {
    pool: PgPool,
}

impl PostgresAppSessionEventStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl AppSessionEventStore for PostgresAppSessionEventStore {
    fn record_app_session_issued<'a>(
        &'a self,
        command: RecordAppSessionIssuedEventCommand,
    ) -> AppSessionEventStoreFuture<'a, ()> {
        Box::pin(async move {
            let auth_provider = command
                .auth_provider
                .as_deref()
                .unwrap_or("trusted-subject-exchange");
            sqlx::query(
                r#"
                INSERT INTO iam_user_login_event
                    (uuid, tenant_id, organization_id, user_id, request_id, auth_method, auth_provider, login_result, risk_level, mfa_verified, session_id_hash, occurred_at)
                VALUES
                    ($1, $2, $3, $4, $5, 2, $6, 1, 0, true, $7, CURRENT_TIMESTAMP)
                "#,
            )
            .bind(&command.event_uuid)
            .bind(command.tenant_id)
            .bind(command.organization_id)
            .bind(command.user_id)
            .bind(command.request_id.as_deref())
            .bind(auth_provider)
            .bind(&command.session_id_hash)
            .execute(&self.pool)
            .await
            .map_err(|error| store_error("failed to record app session login event", error))?;
            Ok(())
        })
    }
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}
