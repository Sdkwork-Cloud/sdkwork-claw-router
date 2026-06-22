use sqlx::{PgPool, Postgres, Row, Transaction};

use crate::domain::{DomainError, DomainResult};
use crate::infrastructure::sql::sql_hash::digest_hex;
use crate::infrastructure::sql::sql_site_settings::{
    settings_from_payload, settings_payload, settings_snapshot_payload, CONFIG_SCOPE_SITE,
    CONFIG_TYPE_SITE_SETTINGS, SITE_SETTINGS_AUDIT_TARGET_TYPE, SITE_SETTINGS_SOURCE_TABLE,
};
use crate::ports::{
    GetSiteSettingsQuery, GetSiteSettingsScopeQuery, SiteSettings, SiteSettingsFuture,
    SiteSettingsStore, UpdateSiteSettingsCommand,
};

#[derive(Debug, Clone)]
pub struct PostgresSiteSettingsStore {
    pool: PgPool,
}

impl PostgresSiteSettingsStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl SiteSettingsStore for PostgresSiteSettingsStore {
    fn get_site_settings<'a>(
        &'a self,
        query: GetSiteSettingsQuery,
    ) -> SiteSettingsFuture<'a, SiteSettings> {
        Box::pin(async move { load_site_settings(&self.pool, query).await })
    }

    fn get_site_settings_for_scope<'a>(
        &'a self,
        query: GetSiteSettingsScopeQuery,
    ) -> SiteSettingsFuture<'a, SiteSettings> {
        Box::pin(async move { load_site_settings_for_scope(&self.pool, query).await })
    }

    fn update_site_settings<'a>(
        &'a self,
        command: UpdateSiteSettingsCommand,
    ) -> SiteSettingsFuture<'a, SiteSettings> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin site settings transaction", error)
                })?;
            insert_config_snapshot(&mut tx, &command).await?;
            insert_audit_log(&mut tx, &command).await?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit site settings transaction", error)
            })?;
            Ok(command.settings)
        })
    }
}

async fn load_site_settings_for_scope(
    pool: &PgPool,
    query: GetSiteSettingsScopeQuery,
) -> DomainResult<SiteSettings> {
    let (tenant_id, organization_id) = resolve_site_settings_scope(
        pool,
        query.tenant_code.as_deref(),
        query.organization_code.as_deref(),
    )
    .await?;
    load_site_settings(
        pool,
        GetSiteSettingsQuery {
            subject: crate::ports::SiteSettingsSubject {
                tenant_id,
                organization_id,
                operator_id: 0,
                operator_type: 0,
            },
        },
    )
    .await
}

async fn load_site_settings(
    pool: &PgPool,
    query: GetSiteSettingsQuery,
) -> DomainResult<SiteSettings> {
    let payload = sqlx::query_scalar::<_, String>(
        r#"
        SELECT COALESCE(config_payload::text, '')
        FROM ops_config_snapshot
        WHERE tenant_id = $1
          AND organization_id = $2
          AND status = 1
          AND source_table = $3
        ORDER BY published_at DESC NULLS LAST, created_at DESC NULLS LAST, id DESC
        LIMIT 1
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(SITE_SETTINGS_SOURCE_TABLE)
    .fetch_optional(pool)
    .await
    .map_err(|error| store_error("failed to load site settings", error))?;

    match payload {
        Some(payload) => settings_from_payload(&payload),
        None => Ok(SiteSettings::default()),
    }
}

async fn resolve_site_settings_scope(
    pool: &PgPool,
    tenant_code: Option<&str>,
    organization_code: Option<&str>,
) -> DomainResult<(i64, i64)> {
    let tenant_row = match tenant_code {
        Some(code) if !code.trim().is_empty() => sqlx::query(
            "SELECT id FROM iam_tenant WHERE code = $1 AND status = 'active' ORDER BY id LIMIT 1",
        )
        .bind(code.trim())
        .fetch_optional(pool)
        .await,
        _ => {
            sqlx::query("SELECT id FROM iam_tenant WHERE status = 'active' ORDER BY id LIMIT 1")
                .fetch_optional(pool)
                .await
        }
    }
    .map_err(|error| store_error("failed to load site settings IAM tenant", error))?;
    let tenant_id = tenant_row
        .as_ref()
        .and_then(|row| numeric_cell(row, "id"))
        .ok_or_else(|| DomainError::not_found("active IAM tenant was not found"))?;

    let organization_row = match organization_code {
        Some(code) if !code.trim().is_empty() => sqlx::query(
            "SELECT id FROM iam_organization WHERE tenant_id = $1 AND code = $2 AND status = 'active' ORDER BY id LIMIT 1",
        )
        .bind(tenant_id.to_string())
        .bind(code.trim())
        .fetch_optional(pool)
        .await,
        _ => sqlx::query(
            "SELECT id FROM iam_organization WHERE tenant_id = $1 AND status = 'active' ORDER BY id LIMIT 1",
        )
        .bind(tenant_id.to_string())
        .fetch_optional(pool)
        .await,
    }
    .map_err(|error| store_error("failed to load site settings IAM organization", error))?;
    let organization_id = organization_row
        .as_ref()
        .and_then(|row| numeric_cell(row, "id"))
        .ok_or_else(|| DomainError::not_found("active IAM organization was not found"))?;

    Ok((tenant_id, organization_id))
}

async fn insert_config_snapshot(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateSiteSettingsCommand,
) -> DomainResult<()> {
    let payload = settings_snapshot_payload(&command.settings)?;
    let snapshot_no = format!("site-settings-update-{}", command.config_snapshot_uuid);
    sqlx::query(
        r#"
        INSERT INTO ops_config_snapshot
            (uuid, tenant_id, organization_id, user_id, request_id, status, snapshot_no, config_scope, config_type, source_table, source_ids, config_payload, config_hash, published_at, published_by)
        VALUES
            ($1, $2, $3, $4, $5, 1, $6, $7, $8, $9, $10::jsonb, $11::jsonb, $12, $13::timestamptz, $14)
        "#,
    )
    .bind(&command.config_snapshot_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.operator_id)
    .bind(&command.request_id)
    .bind(snapshot_no)
    .bind(CONFIG_SCOPE_SITE)
    .bind(CONFIG_TYPE_SITE_SETTINGS)
    .bind(SITE_SETTINGS_SOURCE_TABLE)
    .bind(serde_json::json!(["site-settings"]).to_string())
    .bind(&payload)
    .bind(digest_hex(&payload))
    .bind(&command.requested_at)
    .bind(command.subject.operator_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to write site settings config snapshot", error))?;
    Ok(())
}

async fn insert_audit_log(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateSiteSettingsCommand,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        INSERT INTO ops_audit_log
            (uuid, tenant_id, organization_id, action, target_type, target_id, request_id, operator_id, operator_type, change_summary)
        VALUES
            ($1, $2, $3, 'update_site_settings', $4, 0, $5, $6, $7, $8::jsonb)
        "#,
    )
    .bind(&command.audit_log_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(SITE_SETTINGS_AUDIT_TARGET_TYPE)
    .bind(&command.request_id)
    .bind(command.subject.operator_id)
    .bind(command.subject.operator_type)
    .bind(change_summary(&command.settings)?)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to write site settings audit log", error))?;
    Ok(())
}

fn change_summary(settings: &SiteSettings) -> DomainResult<String> {
    let settings = serde_json::from_str::<serde_json::Value>(&settings_payload(settings)?)
        .map_err(|error| DomainError::new(error.to_string()))?;
    Ok(serde_json::json!({
        "action": "update_site_settings",
        "settings": settings
    })
    .to_string())
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}

fn numeric_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<i64> {
    row.try_get::<i64, _>(column)
        .ok()
        .or_else(|| row.try_get::<i32, _>(column).ok().map(i64::from))
        .or_else(|| {
            row.try_get::<Option<String>, _>(column)
                .ok()
                .flatten()
                .and_then(|value| value.parse::<i64>().ok())
        })
}
