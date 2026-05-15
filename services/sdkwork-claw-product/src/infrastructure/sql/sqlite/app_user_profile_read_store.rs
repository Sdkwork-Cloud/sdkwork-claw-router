use sqlx::{Row, SqlitePool};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    AppUserProfileReadFuture, AppUserProfileReadStore, AppUserProfileSnapshot,
    AppUserProfileSubject,
};

const LOAD_USER_PROFILE: &str = r#"
WITH latest_session AS (
    SELECT
        tenant_id,
        organization_id,
        user_id,
        CAST(created_at AS TEXT) AS last_login
    FROM iam_session
    WHERE tenant_id = ?1
      AND organization_id = ?2
      AND user_id = ?3
      AND revoked_at IS NULL
    ORDER BY created_at DESC, id DESC
    LIMIT 1
),
latest_login AS (
    SELECT
        tenant_id,
        organization_id,
        user_id,
        CAST(occurred_at AS TEXT) AS last_login,
        COALESCE(client_ip_masked, '') AS last_login_ip
    FROM iam_user_login_event
    WHERE tenant_id = ?1
      AND organization_id = ?2
      AND user_id = ?3
    ORDER BY occurred_at DESC, id DESC
    LIMIT 1
),
identity_bindings AS (
    SELECT
        user_id,
        COUNT(DISTINCT provider) AS identity_binding_count
    FROM iam_user_identity
    WHERE tenant_id = ?1
      AND user_id = ?3
    GROUP BY user_id
)
SELECT
    u.id,
    COALESCE(u.username, '') AS username,
    COALESCE(NULLIF(u.display_name, ''), NULLIF(u.username, ''), 'SDKWork User') AS display_name,
    COALESCE(u.email, '') AS email,
    COALESCE(u.avatar_url, '') AS avatar_url,
    COALESCE(u.phone, '') AS phone,
    COALESCE(NULLIF(pref.language, ''), 'en-US') AS language,
    COALESCE(u.status, '') AS user_status,
    CAST(u.created_at AS TEXT) AS registered_at,
    COALESCE(ll.last_login, ls.last_login, '') AS last_login,
    COALESCE(ll.last_login_ip, '') AS last_login_ip,
    COALESCE(CAST(sec.password_last_changed_at AS TEXT), '') AS password_last_changed,
    COALESCE(sec.mfa_enabled, 0) AS mfa_enabled,
    COALESCE(ib.identity_binding_count, 0) AS identity_binding_count
FROM iam_user u
JOIN iam_organization_member om
  ON om.tenant_id = u.tenant_id
 AND om.user_id = u.id
 AND om.organization_id = ?2
 AND om.status = 'active'
LEFT JOIN latest_session ls
  ON ls.tenant_id = u.tenant_id
 AND ls.user_id = u.id
LEFT JOIN latest_login ll
  ON ll.tenant_id = u.tenant_id
 AND ll.user_id = u.id
LEFT JOIN iam_user_preference pref
  ON pref.tenant_id = u.tenant_id
 AND pref.organization_id = ?2
 AND pref.user_id = u.id
LEFT JOIN iam_user_security_setting sec
  ON sec.tenant_id = u.tenant_id
 AND sec.organization_id = ?2
 AND sec.user_id = u.id
LEFT JOIN identity_bindings ib
  ON ib.user_id = u.id
WHERE u.tenant_id = ?1
  AND u.id = ?3
LIMIT 1
"#;

#[derive(Debug, Clone)]
pub struct SqliteAppUserProfileReadStore {
    pool: SqlitePool,
}

impl SqliteAppUserProfileReadStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl AppUserProfileReadStore for SqliteAppUserProfileReadStore {
    fn load_user_profile<'a>(
        &'a self,
        subject: Option<AppUserProfileSubject>,
    ) -> AppUserProfileReadFuture<'a> {
        Box::pin(async move {
            let subject = require_subject(subject)?;
            load_user_profile(&self.pool, subject).await
        })
    }
}

async fn load_user_profile(
    pool: &SqlitePool,
    subject: AppUserProfileSubject,
) -> DomainResult<AppUserProfileSnapshot> {
    let row = sqlx::query(LOAD_USER_PROFILE)
        .bind(subject.tenant_id.to_string())
        .bind(subject.organization_id.to_string())
        .bind(subject.user_id.to_string())
        .fetch_optional(pool)
        .await
        .map_err(sql_error)?;

    match row.as_ref() {
        Some(row) => row_to_user_profile(row),
        None => Ok(AppUserProfileSnapshot::default()),
    }
}

fn row_to_user_profile(row: &sqlx::sqlite::SqliteRow) -> DomainResult<AppUserProfileSnapshot> {
    let status = string_cell(row, "user_status");
    if status.is_empty() {
        return Err(DomainError::new(
            "missing app user profile status from database row",
        ));
    }
    Ok(AppUserProfileSnapshot {
        id: string_cell(row, "id"),
        username: string_cell(row, "username"),
        display_name: string_cell(row, "display_name"),
        email: string_cell(row, "email"),
        avatar_url: string_cell(row, "avatar_url"),
        phone: string_cell(row, "phone"),
        language: language_label(&string_cell(row, "language")),
        is_verified: status == "active",
        status,
        registered_at: string_cell(row, "registered_at"),
        last_login: string_cell(row, "last_login"),
        last_login_ip: string_cell(row, "last_login_ip"),
        password_last_changed: string_cell(row, "password_last_changed"),
        two_factor_enabled: bool_cell(row, "mfa_enabled"),
        third_party_bound: integer_cell(row, "identity_binding_count")
            .max(0)
            .to_string(),
    })
}

fn require_subject(subject: Option<AppUserProfileSubject>) -> DomainResult<AppUserProfileSubject> {
    subject
        .ok_or_else(|| DomainError::new("trusted request subject is required for app user profile"))
}

fn language_label(language: &str) -> String {
    let trimmed = language.trim();
    if trimmed.is_empty() {
        "en-US".to_owned()
    } else {
        trimmed.to_owned()
    }
}

fn string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> String {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .unwrap_or_default()
}

fn integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> i64 {
    string_cell(row, column)
        .parse::<i64>()
        .or_else(|_| row.try_get::<i64, _>(column))
        .or_else(|_| row.try_get::<i32, _>(column).map(i64::from))
        .unwrap_or(0)
}

fn bool_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> bool {
    row.try_get::<bool, _>(column)
        .ok()
        .or_else(|| Some(integer_cell(row, column) != 0))
        .unwrap_or(false)
}

fn sql_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}
