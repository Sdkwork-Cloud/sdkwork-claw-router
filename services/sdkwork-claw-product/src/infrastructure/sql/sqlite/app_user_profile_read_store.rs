use sqlx::{Row, SqlitePool};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    AppUserProfileReadFuture, AppUserProfileReadStore, AppUserProfileSnapshot,
    AppUserProfileSubject,
};

const LOAD_USER_PROFILE: &str = r#"
WITH latest_login AS (
    SELECT
        tenant_id,
        organization_id,
        user_id,
        CAST(COALESCE(occurred_at, created_at) AS TEXT) AS last_login,
        COALESCE(NULLIF(client_ip_masked, ''), '') AS last_login_ip
    FROM iam_user_login_event
    WHERE tenant_id = ?1
      AND organization_id = ?2
      AND user_id = ?3
    ORDER BY COALESCE(occurred_at, created_at) DESC, id DESC
    LIMIT 1
),
oauth_bindings AS (
    SELECT
        user_id,
        COUNT(DISTINCT oauth_provider) AS oauth_binding_count
    FROM plus_oauth_account
    WHERE tenant_id = ?1
      AND organization_id = ?2
      AND user_id = ?3
    GROUP BY user_id
)
SELECT
    COALESCE(NULLIF(u.nickname, ''), NULLIF(u.username, ''), 'User') AS name,
    COALESCE(u.email, '') AS email,
    COALESCE(u.phone, '') AS phone,
    COALESCE(NULLIF(p.language, ''), 'en-US') AS language,
    u.status AS user_status,
    CAST(u.created_at AS TEXT) AS registered_at,
    COALESCE(ll.last_login, CAST(s.last_login_at AS TEXT), '') AS last_login,
    COALESCE(ll.last_login_ip, '') AS last_login_ip,
    CAST(COALESCE(s.password_last_changed_at, '') AS TEXT) AS password_last_changed,
    COALESCE(s.mfa_enabled, 0) AS mfa_enabled,
    COALESCE(s.security_level, 0) AS security_level,
    COALESCE(ob.oauth_binding_count, 0) AS oauth_binding_count
FROM plus_user u
LEFT JOIN iam_user_preference p
    ON p.tenant_id = u.tenant_id
   AND p.organization_id = u.organization_id
   AND p.user_id = u.id
   AND p.deleted_at IS NULL
LEFT JOIN iam_user_security_setting s
    ON s.tenant_id = u.tenant_id
   AND s.organization_id = u.organization_id
   AND s.user_id = u.id
   AND s.deleted_at IS NULL
LEFT JOIN latest_login ll
    ON ll.tenant_id = u.tenant_id
   AND ll.organization_id = u.organization_id
   AND ll.user_id = u.id
LEFT JOIN oauth_bindings ob
    ON ob.user_id = u.id
WHERE u.tenant_id = ?1
  AND u.organization_id = ?2
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
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .fetch_optional(pool)
        .await
        .map_err(sql_error)?;

    match row.as_ref() {
        Some(row) => row_to_user_profile(row),
        None => Ok(AppUserProfileSnapshot::default()),
    }
}

fn row_to_user_profile(row: &sqlx::sqlite::SqliteRow) -> DomainResult<AppUserProfileSnapshot> {
    let name = string_cell(row, "name");
    let email = string_cell(row, "email");
    let security_level = integer_cell(row, "security_level");

    Ok(AppUserProfileSnapshot {
        avatar: avatar_initial(&name, &email),
        name,
        email,
        phone: string_cell(row, "phone"),
        language: language_label(&string_cell(row, "language")),
        is_verified: security_level > 0,
        status: user_status_label(required_integer_cell(row, "user_status")?)?,
        registered_at: string_cell(row, "registered_at"),
        last_login: string_cell(row, "last_login"),
        last_login_ip: string_cell(row, "last_login_ip"),
        password_last_changed: string_cell(row, "password_last_changed"),
        two_factor_enabled: bool_cell(row, "mfa_enabled"),
        third_party_bound: third_party_bound_label(integer_cell(row, "oauth_binding_count")),
    })
}

fn require_subject(subject: Option<AppUserProfileSubject>) -> DomainResult<AppUserProfileSubject> {
    subject
        .ok_or_else(|| DomainError::new("trusted request subject is required for app user profile"))
}

fn avatar_initial(name: &str, email: &str) -> String {
    name.trim()
        .chars()
        .next()
        .or_else(|| email.trim().chars().next())
        .map(|ch| ch.to_uppercase().collect::<String>())
        .unwrap_or_default()
}

fn language_label(language: &str) -> String {
    let trimmed = language.trim();
    if trimmed.is_empty() {
        "en-US".to_owned()
    } else {
        trimmed.to_owned()
    }
}

fn user_status_label(status: i64) -> DomainResult<String> {
    match status {
        1 => Ok("active".to_owned()),
        0 => Ok("banned".to_owned()),
        value => Err(DomainError::new(format!(
            "invalid app user profile status from database row: {value}"
        ))),
    }
}

fn third_party_bound_label(binding_count: i64) -> String {
    binding_count.max(0).to_string()
}

fn string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> String {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .unwrap_or_default()
}

fn integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> i64 {
    optional_integer_cell(row, column).unwrap_or(0)
}

fn required_integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> DomainResult<i64> {
    optional_integer_cell(row, column)
        .ok_or_else(|| DomainError::new("missing app user profile status from database row"))
}

fn optional_integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<i64> {
    row.try_get::<Option<i64>, _>(column)
        .ok()
        .flatten()
        .or_else(|| {
            row.try_get::<Option<i32>, _>(column)
                .ok()
                .flatten()
                .map(i64::from)
        })
        .or_else(|| string_cell(row, column).parse::<i64>().ok())
}

fn bool_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> bool {
    row.try_get::<Option<bool>, _>(column)
        .ok()
        .flatten()
        .or_else(|| Some(integer_cell(row, column) != 0))
        .unwrap_or(false)
}

fn sql_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}
