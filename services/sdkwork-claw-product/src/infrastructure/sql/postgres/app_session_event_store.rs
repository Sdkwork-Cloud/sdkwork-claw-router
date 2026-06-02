use sqlx::{PgPool, Row};

use crate::domain::DomainError;
use crate::infrastructure::sql::sql_admin_product_center::media_resource_from_snapshot;
use crate::ports::{
    ActiveAppSession, AppSessionEventStore, AppSessionEventStoreFuture, AppSessionRecord,
    AppSessionUserRecord, LoadActiveAppSessionQuery, RecordAppSecurityEventCommand,
    RecordAppSessionIssuedEventCommand, ResolveAppSessionOrganizationQuery,
    ResolvedAppSessionOrganization, RevokeAppSessionCommand, RotateAppSessionTokensCommand,
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
                    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
                     $14::jsonb, $15::jsonb, to_timestamp($16::double precision), NULL,
                     to_timestamp($17::double precision), to_timestamp($17::double precision))
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
            .execute(&mut *tx)
            .await
            .map_err(|error| store_error("failed to insert IAM session", error))?;

            sqlx::query(
                r#"
                INSERT INTO iam_security_event
                    (id, tenant_id, user_id, session_id, event_type, severity, detail_json, created_at)
                VALUES
                    ($1, $2, $3, $4, 'sessions.create', 'info', $5::jsonb, to_timestamp($6::double precision))
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
                    ($1, $2, $3, $4, 'sessions.create', 'iam_session', $5, $6, $7, $8, $9,
                     $10::jsonb, to_timestamp($11::double precision))
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

    fn load_active_app_session<'a>(
        &'a self,
        query: LoadActiveAppSessionQuery,
    ) -> AppSessionEventStoreFuture<'a, Option<ActiveAppSession>> {
        Box::pin(async move { load_active_app_session(&self.pool, query).await })
    }

    fn resolve_app_session_organization<'a>(
        &'a self,
        query: ResolveAppSessionOrganizationQuery,
    ) -> AppSessionEventStoreFuture<'a, Option<ResolvedAppSessionOrganization>> {
        Box::pin(async move { resolve_app_session_organization(&self.pool, query).await })
    }

    fn rotate_app_session_tokens<'a>(
        &'a self,
        command: RotateAppSessionTokensCommand,
    ) -> AppSessionEventStoreFuture<'a, bool> {
        Box::pin(async move { rotate_app_session_tokens(&self.pool, command).await })
    }

    fn revoke_app_session<'a>(
        &'a self,
        command: RevokeAppSessionCommand,
    ) -> AppSessionEventStoreFuture<'a, bool> {
        Box::pin(async move { revoke_app_session(&self.pool, command).await })
    }

    fn record_app_security_event<'a>(
        &'a self,
        command: RecordAppSecurityEventCommand,
    ) -> AppSessionEventStoreFuture<'a, ()> {
        Box::pin(async move { record_app_security_event(&self.pool, command).await })
    }
}

async fn record_app_security_event(
    pool: &PgPool,
    command: RecordAppSecurityEventCommand,
) -> crate::domain::DomainResult<()> {
    sqlx::query(
        r#"
        INSERT INTO iam_security_event
            (id, tenant_id, user_id, session_id, event_type, severity, detail_json, created_at)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7::jsonb, to_timestamp($8::double precision))
        "#,
    )
    .bind(&command.security_event_id)
    .bind(command.tenant_id.map(|value| value.to_string()))
    .bind(command.user_id.map(|value| value.to_string()))
    .bind(command.session_id.as_deref())
    .bind(&command.event_type)
    .bind(&command.severity)
    .bind(&command.detail_json)
    .bind(&command.created_at)
    .execute(pool)
    .await
    .map_err(|error| store_error("failed to insert IAM security event", error))?;
    Ok(())
}

async fn load_active_app_session(
    pool: &PgPool,
    query: LoadActiveAppSessionQuery,
) -> crate::domain::DomainResult<Option<ActiveAppSession>> {
    let mut sql = LOAD_ACTIVE_APP_SESSION.to_owned();
    if query.refresh_token_hash.is_some() {
        sql.push_str(" AND s.refresh_token_hash = $3");
    }
    sql.push_str(" LIMIT 1");
    let mut query_builder = sqlx::query(&sql)
        .bind(query.auth_token_hash)
        .bind(query.access_token_hash);
    if let Some(refresh_token_hash) = query.refresh_token_hash {
        query_builder = query_builder.bind(refresh_token_hash);
    }
    let row = query_builder
        .fetch_optional(pool)
        .await
        .map_err(|error| store_error("failed to load active IAM session", error))?;
    let Some(row) = row else {
        return Ok(None);
    };
    let session = session_record_from_row(&row)?;
    if !session_is_active(&session.expires_at, query.now) {
        return Ok(None);
    }
    Ok(Some(ActiveAppSession {
        session,
        user: user_record_from_row(&row)?,
    }))
}

async fn resolve_app_session_organization(
    pool: &PgPool,
    query: ResolveAppSessionOrganizationQuery,
) -> crate::domain::DomainResult<Option<ResolvedAppSessionOrganization>> {
    let row = match (query.organization_id, query.organization_code) {
        (Some(organization_id), _) => {
            sqlx::query(
                r#"
                SELECT CAST(o.id AS TEXT) AS organization_id
                FROM iam_organization o
                JOIN iam_organization_member om
                  ON om.tenant_id = o.tenant_id
                 AND om.organization_id = o.id
                 AND om.user_id = $1
                 AND om.status = 'active'
                WHERE o.tenant_id = $2
                  AND o.id = $3
                  AND o.status = 'active'
                LIMIT 1
                "#,
            )
            .bind(query.user_id.to_string())
            .bind(query.tenant_id.to_string())
            .bind(organization_id)
            .fetch_optional(pool)
            .await
        }
        (None, Some(organization_code)) => {
            sqlx::query(
                r#"
                SELECT CAST(o.id AS TEXT) AS organization_id
                FROM iam_organization o
                JOIN iam_organization_member om
                  ON om.tenant_id = o.tenant_id
                 AND om.organization_id = o.id
                 AND om.user_id = $1
                 AND om.status = 'active'
                WHERE o.tenant_id = $2
                  AND o.code = $3
                  AND o.status = 'active'
                ORDER BY o.updated_at DESC NULLS LAST, o.id DESC
                LIMIT 1
                "#,
            )
            .bind(query.user_id.to_string())
            .bind(query.tenant_id.to_string())
            .bind(organization_code)
            .fetch_optional(pool)
            .await
        }
        (None, None) => return Ok(None),
    }
    .map_err(|error| store_error("failed to resolve app session organization", error))?;
    row.map(|row| {
        Ok(ResolvedAppSessionOrganization {
            organization_id: parse_i64(&string_cell(&row, "organization_id"), "organization_id")?,
        })
    })
    .transpose()
}

async fn rotate_app_session_tokens(
    pool: &PgPool,
    command: RotateAppSessionTokensCommand,
) -> crate::domain::DomainResult<bool> {
    let mut tx = pool
        .begin()
        .await
        .map_err(|error| store_error("failed to begin IAM session rotate transaction", error))?;
    let result = sqlx::query(
        r#"
        UPDATE iam_session
        SET auth_token_hash = $1,
            access_token_hash = $2,
            refresh_token_hash = $3,
            organization_id = COALESCE($4, organization_id),
            data_scope_json = COALESCE($5::jsonb, data_scope_json),
            expires_at = to_timestamp($6::double precision),
            updated_at = to_timestamp($7::double precision)
        WHERE id = $8
          AND tenant_id = $9
          AND user_id = $10
          AND auth_token_hash = $11
          AND access_token_hash = $12
          AND ($13 IS NULL OR refresh_token_hash = $14)
          AND revoked_at IS NULL
        "#,
    )
    .bind(&command.auth_token_hash)
    .bind(&command.access_token_hash)
    .bind(&command.refresh_token_hash)
    .bind(command.organization_id.map(|value: i64| value.to_string()))
    .bind(command.data_scope_json.as_deref())
    .bind(&command.expires_at)
    .bind(&command.updated_at)
    .bind(&command.session_id)
    .bind(command.tenant_id.to_string())
    .bind(command.user_id.to_string())
    .bind(&command.expected_auth_token_hash)
    .bind(&command.expected_access_token_hash)
    .bind(command.expected_refresh_token_hash.as_deref())
    .bind(command.expected_refresh_token_hash.as_deref())
    .execute(&mut *tx)
    .await
    .map_err(|error| store_error("failed to rotate IAM session tokens", error))?;
    if result.rows_affected() == 0 {
        tx.rollback().await.map_err(|error| {
            store_error("failed to rollback IAM session rotate transaction", error)
        })?;
        return Ok(false);
    }

    insert_security_event(
        &mut tx,
        InsertSecurityEvent {
            id: &command.security_event_id,
            tenant_id: command.tenant_id,
            user_id: command.user_id,
            session_id: &command.session_id,
            event_type: &command.event_type,
            severity: "info",
            detail_json: &command.detail_json,
            created_at: &command.updated_at,
        },
    )
    .await?;
    tx.commit()
        .await
        .map_err(|error| store_error("failed to commit IAM session rotate transaction", error))?;
    Ok(true)
}

async fn revoke_app_session(
    pool: &PgPool,
    command: RevokeAppSessionCommand,
) -> crate::domain::DomainResult<bool> {
    let mut tx = pool
        .begin()
        .await
        .map_err(|error| store_error("failed to begin IAM session revoke transaction", error))?;
    let result = sqlx::query(
        r#"
        UPDATE iam_session
        SET revoked_at = to_timestamp($1::double precision),
            updated_at = to_timestamp($1::double precision)
        WHERE id = $2
          AND tenant_id = $3
          AND user_id = $4
          AND auth_token_hash = $5
          AND access_token_hash = $6
          AND revoked_at IS NULL
        "#,
    )
    .bind(&command.revoked_at)
    .bind(&command.session_id)
    .bind(command.tenant_id.to_string())
    .bind(command.user_id.to_string())
    .bind(&command.expected_auth_token_hash)
    .bind(&command.expected_access_token_hash)
    .execute(&mut *tx)
    .await
    .map_err(|error| store_error("failed to revoke IAM session", error))?;
    if result.rows_affected() == 0 {
        tx.rollback().await.map_err(|error| {
            store_error("failed to rollback IAM session revoke transaction", error)
        })?;
        return Ok(false);
    }

    insert_security_event(
        &mut tx,
        InsertSecurityEvent {
            id: &command.security_event_id,
            tenant_id: command.tenant_id,
            user_id: command.user_id,
            session_id: &command.session_id,
            event_type: "sessions.revoke",
            severity: "info",
            detail_json: &command.detail_json,
            created_at: &command.revoked_at,
        },
    )
    .await?;
    tx.commit()
        .await
        .map_err(|error| store_error("failed to commit IAM session revoke transaction", error))?;
    Ok(true)
}

const LOAD_ACTIVE_APP_SESSION: &str = r#"
SELECT
    CAST(s.id AS TEXT) AS session_id,
    CAST(s.tenant_id AS TEXT) AS session_tenant_id,
    CAST(COALESCE(s.organization_id, '') AS TEXT) AS session_organization_id,
    CAST(s.user_id AS TEXT) AS session_user_id,
    COALESCE(s.app_id, '') AS app_id,
    COALESCE(s.environment, '') AS environment,
    COALESCE(s.deployment_mode, '') AS deployment_mode,
    COALESCE(s.auth_level, '') AS auth_level,
    CAST(COALESCE(s.data_scope_json, '[]'::jsonb) AS TEXT) AS data_scope_json,
    CAST(COALESCE(s.permission_scope_json, '[]'::jsonb) AS TEXT) AS permission_scope_json,
    CAST(EXTRACT(EPOCH FROM s.expires_at)::bigint AS TEXT) AS expires_at,
    CAST(EXTRACT(EPOCH FROM s.updated_at)::bigint AS TEXT) AS session_updated_at,
    CAST(u.id AS TEXT) AS user_id,
    CAST(u.tenant_id AS TEXT) AS user_tenant_id,
    COALESCE(u.username, '') AS username,
    COALESCE(NULLIF(u.display_name, ''), NULLIF(u.username, ''), 'SDKWork User') AS display_name,
    COALESCE(u.email, '') AS email,
    COALESCE(CAST(u.avatar_resource_snapshot AS TEXT), '') AS avatar_resource_snapshot,
    COALESCE(u.phone, '') AS phone,
    COALESCE(NULLIF(pref.language, ''), 'en-US') AS language,
    COALESCE(u.status, '') AS user_status,
    CAST(u.created_at AS TEXT) AS registered_at,
    COALESCE(CAST(ll.occurred_at AS TEXT), CAST(s.created_at AS TEXT), '') AS last_login,
    COALESCE(ll.client_ip_masked, '') AS last_login_ip,
    COALESCE(CAST(sec.password_last_changed_at AS TEXT), '') AS password_last_changed,
    COALESCE(sec.mfa_enabled, false) AS mfa_enabled,
    COALESCE(ib.identity_binding_count, 0) AS identity_binding_count
FROM iam_session s
JOIN iam_user u
  ON u.tenant_id = s.tenant_id
 AND u.id = s.user_id
JOIN iam_organization_member om
  ON om.tenant_id = s.tenant_id
 AND om.organization_id = s.organization_id
 AND om.user_id = s.user_id
 AND om.status = 'active'
LEFT JOIN iam_user_preference pref
  ON pref.tenant_id = s.tenant_id
 AND pref.organization_id = s.organization_id
 AND pref.user_id = s.user_id
LEFT JOIN iam_user_security_setting sec
  ON sec.tenant_id = s.tenant_id
 AND sec.organization_id = s.organization_id
 AND sec.user_id = s.user_id
LEFT JOIN (
    SELECT tenant_id, user_id, COUNT(DISTINCT provider) AS identity_binding_count
    FROM iam_user_identity
    GROUP BY tenant_id, user_id
) ib
  ON ib.tenant_id = s.tenant_id
 AND ib.user_id = s.user_id
LEFT JOIN iam_user_login_event ll
  ON ll.id = (
      SELECT id
      FROM iam_user_login_event
      WHERE tenant_id = s.tenant_id
        AND organization_id = s.organization_id
        AND user_id = s.user_id
      ORDER BY occurred_at DESC NULLS LAST, id DESC
      LIMIT 1
  )
WHERE s.auth_token_hash = $1
  AND s.access_token_hash = $2
  AND s.revoked_at IS NULL
  AND u.status = 'active'
"#;

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

struct InsertSecurityEvent<'a> {
    id: &'a str,
    tenant_id: i64,
    user_id: i64,
    session_id: &'a str,
    event_type: &'a str,
    severity: &'a str,
    detail_json: &'a str,
    created_at: &'a str,
}

async fn insert_security_event(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    event: InsertSecurityEvent<'_>,
) -> crate::domain::DomainResult<()> {
    sqlx::query(
        r#"
        INSERT INTO iam_security_event
            (id, tenant_id, user_id, session_id, event_type, severity, detail_json, created_at)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7::jsonb, to_timestamp($8::double precision))
        "#,
    )
    .bind(event.id)
    .bind(event.tenant_id.to_string())
    .bind(event.user_id.to_string())
    .bind(event.session_id)
    .bind(event.event_type)
    .bind(event.severity)
    .bind(event.detail_json)
    .bind(event.created_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert IAM session security event", error))?;
    Ok(())
}

fn session_record_from_row(
    row: &sqlx::postgres::PgRow,
) -> crate::domain::DomainResult<AppSessionRecord> {
    Ok(AppSessionRecord {
        session_id: string_cell(row, "session_id"),
        tenant_id: parse_i64(&string_cell(row, "session_tenant_id"), "tenant_id")?,
        organization_id: parse_i64(
            &string_cell(row, "session_organization_id"),
            "organization_id",
        )?,
        user_id: parse_i64(&string_cell(row, "session_user_id"), "user_id")?,
        app_id: string_cell(row, "app_id"),
        environment: string_cell(row, "environment"),
        deployment_mode: string_cell(row, "deployment_mode"),
        auth_level: string_cell(row, "auth_level"),
        data_scope_json: string_cell(row, "data_scope_json"),
        permission_scope_json: string_cell(row, "permission_scope_json"),
        expires_at: string_cell(row, "expires_at"),
        updated_at: string_cell(row, "session_updated_at"),
    })
}

fn user_record_from_row(
    row: &sqlx::postgres::PgRow,
) -> crate::domain::DomainResult<AppSessionUserRecord> {
    let status = string_cell(row, "user_status");
    Ok(AppSessionUserRecord {
        id: parse_i64(&string_cell(row, "user_id"), "user_id")?,
        tenant_id: parse_i64(&string_cell(row, "user_tenant_id"), "tenant_id")?,
        organization_id: parse_i64(
            &string_cell(row, "session_organization_id"),
            "organization_id",
        )?,
        username: string_cell(row, "username"),
        display_name: string_cell(row, "display_name"),
        email: string_cell(row, "email"),
        avatar: media_resource_from_row(row, "avatar_resource_snapshot", "image"),
        phone: string_cell(row, "phone"),
        language: string_cell(row, "language"),
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

fn parse_i64(value: &str, field: &str) -> crate::domain::DomainResult<i64> {
    value
        .trim()
        .parse::<i64>()
        .map_err(|_| DomainError::new(format!("invalid IAM session {field} value")))
}

fn session_is_active(expires_at: &str, now: i64) -> bool {
    expires_at
        .trim()
        .parse::<i64>()
        .map(|expires_at| expires_at > now)
        .unwrap_or(false)
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}
