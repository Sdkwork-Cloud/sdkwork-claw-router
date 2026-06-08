use sqlx::{PgPool, Row};

use crate::domain::{DomainError, DomainResult};
use crate::infrastructure::sql::sql_admin_product_center::media_resource_from_snapshot;
use crate::ports::{
    AppUserProfileReadFuture, AppUserProfileReadStore, AppUserProfileSnapshot,
    AppUserProfileSubject,
};

const LOAD_USER_PROFILE: &str = r#"
WITH subject AS (
    SELECT
        $1::text AS tenant_id_text,
        $2::text AS organization_id_text,
        $3::text AS user_id_text,
        $4::bigint AS tenant_id,
        $5::bigint AS organization_id,
        $6::bigint AS user_id
),
latest_session AS (
    SELECT
        s.tenant_id,
        s.organization_id,
        s.user_id,
        CAST(s.created_at AS TEXT) AS last_login
    FROM iam_session s
    JOIN subject ON true
    WHERE s.tenant_id = subject.tenant_id_text
      AND s.organization_id = subject.organization_id_text
      AND s.user_id = subject.user_id_text
      AND s.revoked_at IS NULL
    ORDER BY s.created_at DESC NULLS LAST, s.id DESC
    LIMIT 1
),
latest_login AS (
    SELECT
        CAST(e.tenant_id AS TEXT) AS tenant_id,
        CAST(e.organization_id AS TEXT) AS organization_id,
        CAST(e.user_id AS TEXT) AS user_id,
        CAST(e.occurred_at AS TEXT) AS last_login,
        COALESCE(e.client_ip_masked, '') AS last_login_ip
    FROM iam_user_login_event e
    JOIN subject ON true
    WHERE e.tenant_id = subject.tenant_id
      AND e.organization_id = subject.organization_id
      AND e.user_id = subject.user_id
    ORDER BY e.occurred_at DESC NULLS LAST, e.id DESC
    LIMIT 1
),
identity_bindings AS (
    SELECT
        ui.user_id,
        COUNT(DISTINCT ui.provider) AS identity_binding_count
    FROM iam_user_identity ui
    JOIN subject ON true
    WHERE ui.tenant_id = subject.tenant_id_text
      AND ui.user_id = subject.user_id_text
    GROUP BY ui.user_id
)
SELECT
    u.id,
    COALESCE(u.username, '') AS username,
    COALESCE(NULLIF(u.display_name, ''), NULLIF(u.username, ''), 'SDKWork User') AS display_name,
    COALESCE(u.email, '') AS email,
    COALESCE(CAST(u.avatar_resource_snapshot AS TEXT), '') AS avatar_resource_snapshot,
    COALESCE(u.phone, '') AS phone,
    COALESCE(NULLIF(pref.language, ''), 'en-US') AS language,
    COALESCE(u.status, '') AS user_status,
    CAST(u.created_at AS TEXT) AS registered_at,
    COALESCE(ll.last_login, ls.last_login, '') AS last_login,
    COALESCE(ll.last_login_ip, '') AS last_login_ip,
    COALESCE(CAST(sec.password_last_changed_at AS TEXT), '') AS password_last_changed,
    COALESCE(sec.mfa_enabled, false) AS mfa_enabled,
    COALESCE(ib.identity_binding_count, 0) AS identity_binding_count
FROM iam_user u
JOIN subject ON true
JOIN iam_organization_membership om
  ON CAST(om.tenant_id AS TEXT) = u.tenant_id
 AND CAST(om.user_id AS TEXT) = u.id
 AND CAST(om.organization_id AS TEXT) = subject.organization_id_text
 AND om.status = 'active'
LEFT JOIN latest_session ls
  ON ls.tenant_id = u.tenant_id
 AND ls.user_id = u.id
LEFT JOIN latest_login ll
  ON ll.tenant_id = u.tenant_id
 AND ll.user_id = u.id
LEFT JOIN iam_user_preference pref
  ON pref.tenant_id = subject.tenant_id
 AND pref.organization_id = subject.organization_id
 AND pref.user_id = subject.user_id
LEFT JOIN iam_user_security_setting sec
  ON sec.tenant_id = subject.tenant_id
 AND sec.organization_id = subject.organization_id
 AND sec.user_id = subject.user_id
LEFT JOIN identity_bindings ib
  ON ib.user_id = u.id
WHERE CAST(u.tenant_id AS TEXT) = subject.tenant_id_text
  AND CAST(u.id AS TEXT) = subject.user_id_text
LIMIT 1
"#;

#[derive(Debug, Clone)]
pub struct PostgresAppUserProfileReadStore {
    pool: PgPool,
}

impl PostgresAppUserProfileReadStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl AppUserProfileReadStore for PostgresAppUserProfileReadStore {
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
    pool: &PgPool,
    subject: AppUserProfileSubject,
) -> DomainResult<AppUserProfileSnapshot> {
    let row = sqlx::query(LOAD_USER_PROFILE)
        .bind(subject.tenant_id.to_string())
        .bind(subject.organization_id.to_string())
        .bind(subject.user_id.to_string())
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

fn row_to_user_profile(row: &sqlx::postgres::PgRow) -> DomainResult<AppUserProfileSnapshot> {
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
        avatar: media_resource_from_row(row, "avatar_resource_snapshot", "image"),
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

fn media_resource_from_row(
    row: &sqlx::postgres::PgRow,
    column: &str,
    kind: &str,
) -> serde_json::Value {
    media_resource_from_snapshot(&string_cell(row, column), kind)
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

fn string_cell(row: &sqlx::postgres::PgRow, column: &str) -> String {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .unwrap_or_default()
}

fn integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> i64 {
    string_cell(row, column)
        .parse::<i64>()
        .or_else(|_| row.try_get::<i64, _>(column))
        .or_else(|_| row.try_get::<i32, _>(column).map(i64::from))
        .unwrap_or(0)
}

fn bool_cell(row: &sqlx::postgres::PgRow, column: &str) -> bool {
    row.try_get::<bool, _>(column)
        .ok()
        .or_else(|| Some(integer_cell(row, column) != 0))
        .unwrap_or(false)
}

fn sql_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}
