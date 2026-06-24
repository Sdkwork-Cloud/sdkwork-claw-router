use sqlx::SqlitePool;

use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    LoginContinuationRecord, LoginContinuationStore, StoreLoginContinuationCommand,
};

const CREATE_TABLE_SQL: &str = r#"
CREATE TABLE IF NOT EXISTS iam_login_continuation (
    token_hash TEXT PRIMARY KEY,
    tenant_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    organization_ids_json TEXT NOT NULL,
    auth_level TEXT NOT NULL,
    expires_at_unix INTEGER NOT NULL,
    created_at TEXT NOT NULL
)
"#;

#[derive(Clone)]
pub struct SqliteLoginContinuationStore {
    pool: SqlitePool,
}

impl SqliteLoginContinuationStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }

    pub async fn ensure_schema(pool: &SqlitePool) -> DomainResult<()> {
        sqlx::query(CREATE_TABLE_SQL)
            .execute(pool)
            .await
            .map_err(|error| {
                store_error("failed to ensure iam_login_continuation schema", error)
            })?;
        Ok(())
    }
}

impl LoginContinuationStore for SqliteLoginContinuationStore {
    fn store_login_continuation<'a>(
        &'a self,
        command: StoreLoginContinuationCommand,
    ) -> crate::ports::LoginContinuationFuture<'a, ()> {
        Box::pin(async move {
            Self::ensure_schema(&self.pool).await?;
            let token_hash = sha256_hex(&command.token);
            let organization_ids_json = serde_json::to_string(&command.record.organization_ids)
                .map_err(|error| DomainError::new(error.to_string()))?;
            let created_at = current_timestamp_string();
            sqlx::query(
                r#"
                INSERT INTO iam_login_continuation
                    (token_hash, tenant_id, user_id, organization_ids_json, auth_level, expires_at_unix, created_at)
                VALUES
                    (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(token_hash) DO UPDATE SET
                    tenant_id = excluded.tenant_id,
                    user_id = excluded.user_id,
                    organization_ids_json = excluded.organization_ids_json,
                    auth_level = excluded.auth_level,
                    expires_at_unix = excluded.expires_at_unix,
                    created_at = excluded.created_at
                "#,
            )
            .bind(token_hash)
            .bind(command.record.tenant_id)
            .bind(command.record.user_id)
            .bind(organization_ids_json)
            .bind(command.record.auth_level)
            .bind(command.record.expires_at_unix)
            .bind(created_at)
            .execute(&self.pool)
            .await
            .map_err(|error| store_error("failed to store login continuation", error))?;
            Ok(())
        })
    }

    fn take_login_continuation<'a>(
        &'a self,
        token: &'a str,
    ) -> crate::ports::LoginContinuationFuture<'a, Option<LoginContinuationRecord>> {
        Box::pin(async move {
            Self::ensure_schema(&self.pool).await?;
            let token_hash = sha256_hex(token);
            let row = sqlx::query_as::<_, (i64, i64, String, String, i64)>(
                r#"
                SELECT tenant_id, user_id, organization_ids_json, auth_level, expires_at_unix
                FROM iam_login_continuation
                WHERE token_hash = ?
                "#,
            )
            .bind(&token_hash)
            .fetch_optional(&self.pool)
            .await
            .map_err(|error| store_error("failed to load login continuation", error))?;

            let Some((tenant_id, user_id, organization_ids_json, auth_level, expires_at_unix)) =
                row
            else {
                return Ok(None);
            };

            sqlx::query("DELETE FROM iam_login_continuation WHERE token_hash = ?")
                .bind(token_hash)
                .execute(&self.pool)
                .await
                .map_err(|error| store_error("failed to delete login continuation", error))?;

            let organization_ids: Vec<i64> = serde_json::from_str(&organization_ids_json)
                .map_err(|error| DomainError::new(error.to_string()))?;
            Ok(Some(LoginContinuationRecord {
                tenant_id,
                user_id,
                organization_ids,
                auth_level,
                expires_at_unix,
            }))
        })
    }
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}

fn sha256_hex(value: &str) -> String {
    use sha2::{Digest, Sha256};
    let digest = Sha256::digest(value.as_bytes());
    hex::encode(digest)
}

fn current_timestamp_string() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let seconds = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs() as i64;
    format_unix_timestamp(seconds)
}

fn format_unix_timestamp(seconds: i64) -> String {
    let days = seconds.div_euclid(86_400);
    let seconds_of_day = seconds.rem_euclid(86_400);
    let (year, month, day) = civil_from_days(days);
    let hour = seconds_of_day / 3_600;
    let minute = (seconds_of_day % 3_600) / 60;
    let second = seconds_of_day % 60;
    format!("{year:04}-{month:02}-{day:02} {hour:02}:{minute:02}:{second:02}")
}

fn civil_from_days(days: i64) -> (i64, i64, i64) {
    let z = days + 719_468;
    let era = if z >= 0 { z } else { z - 146_096 } / 146_097;
    let doe = z - era * 146_097;
    let yoe = (doe - doe / 1_460 + doe / 36_524 - doe / 146_096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = mp + if mp < 10 { 3 } else { -9 };
    let year = y + if m <= 2 { 1 } else { 0 };
    (year, m, d)
}
