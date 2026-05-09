use sqlx::{Row, SqlitePool};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{AppAuthFuture, AppAuthStore, AppAuthUserCredential};

#[derive(Debug, Clone)]
pub struct SqliteAppAuthStore {
    pool: SqlitePool,
}

impl SqliteAppAuthStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl AppAuthStore for SqliteAppAuthStore {
    fn find_user_for_password_login<'a>(
        &'a self,
        account: &'a str,
    ) -> AppAuthFuture<'a, Option<AppAuthUserCredential>> {
        Box::pin(async move { find_user_for_password_login(&self.pool, account).await })
    }
}

async fn find_user_for_password_login(
    pool: &SqlitePool,
    account: &str,
) -> DomainResult<Option<AppAuthUserCredential>> {
    let row = sqlx::query(
        r#"
        SELECT
            id,
            tenant_id,
            organization_id,
            COALESCE(username, '') AS username,
            COALESCE(email, '') AS email,
            COALESCE(NULLIF(nickname, ''), NULLIF(username, ''), NULLIF(email, ''), 'Claw Router User') AS name,
            COALESCE(avatar, '') AS avatar,
            COALESCE(password, '') AS password_hash,
            COALESCE(status, 0) AS status
        FROM plus_user
        WHERE LOWER(COALESCE(username, '')) = LOWER(?)
           OR LOWER(COALESCE(email, '')) = LOWER(?)
        ORDER BY status DESC, updated_at DESC, id DESC
        LIMIT 1
        "#,
    )
    .bind(account)
    .bind(account)
    .fetch_optional(pool)
    .await
    .map_err(|error| store_error("failed to load app auth user", error))?;

    row.map(user_from_row).transpose()
}

fn user_from_row(row: sqlx::sqlite::SqliteRow) -> DomainResult<AppAuthUserCredential> {
    Ok(AppAuthUserCredential {
        id: integer_cell(&row, "id"),
        tenant_id: integer_cell(&row, "tenant_id"),
        organization_id: integer_cell(&row, "organization_id"),
        username: row.try_get("username").map_err(row_error)?,
        email: row.try_get("email").map_err(row_error)?,
        name: row.try_get("name").map_err(row_error)?,
        avatar: row.try_get("avatar").map_err(row_error)?,
        password_hash: row.try_get("password_hash").map_err(row_error)?,
        status: integer_cell(&row, "status"),
    })
}

fn integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> i64 {
    row.try_get::<i64, _>(column)
        .ok()
        .or_else(|| row.try_get::<i32, _>(column).ok().map(i64::from))
        .unwrap_or(0)
}

fn row_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}
