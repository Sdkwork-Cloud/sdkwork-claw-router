use sqlx::{Row, SqlitePool};

use crate::domain::{DomainError, DomainResult, IntegrationProviderType};
use crate::infrastructure::sql::provider_classification::provider_family_code;
use crate::ports::{
    AppProviderItem, AppProvidersReadFuture, AppProvidersReadStore, AppProvidersSubject,
};

const LOAD_PROVIDERS: &str = r#"
WITH latest_config AS (
    SELECT
        tenant_id,
        organization_id,
        MAX(created_at) AS latest_config_at
    FROM ops_config_snapshot
    WHERE tenant_id = ?1
      AND organization_id = ?2
      AND status = 1
      AND source_table IN (
          'integration_provider',
          'integration_channel',
          'integration_channel_model',
          'integration_provider_account',
          'integration_proxy'
      )
    GROUP BY tenant_id, organization_id
),
ranked_channel AS (
    SELECT
        c.id AS channel_id,
        c.provider_id,
        c.provider_code,
        c.account_id AS account_id,
        c.proxy_id AS proxy_id,
        COALESCE(NULLIF(c.base_url, ''), NULLIF(px.endpoint, '')) AS channel_url,
        c.status AS channel_status,
        c.health_status AS channel_health_status,
        a.status AS account_status,
        px.status AS proxy_status,
        px.health_status AS proxy_health_status,
        COUNT(m.id) AS model_count,
        ROW_NUMBER() OVER (
            PARTITION BY COALESCE(CAST(c.provider_id AS TEXT), c.provider_code)
            ORDER BY
                CASE WHEN c.status = 1 THEN 0 ELSE 1 END,
                CASE WHEN c.health_status = 1 THEN 0 ELSE 1 END,
                COALESCE(c.priority, 999999) ASC,
                COALESCE(c.weight, 0) DESC,
                c.id DESC
        ) AS channel_rank
    FROM integration_channel c
    LEFT JOIN integration_provider_account a
      ON a.id = c.account_id
     AND a.tenant_id = c.tenant_id
     AND a.organization_id = c.organization_id
     AND a.deleted_at IS NULL
    LEFT JOIN integration_proxy px
      ON px.id = c.proxy_id
     AND px.tenant_id = c.tenant_id
     AND px.organization_id = c.organization_id
     AND px.deleted_at IS NULL
    LEFT JOIN integration_channel_model m
      ON m.channel_id = c.id
     AND m.tenant_id = c.tenant_id
     AND m.organization_id = c.organization_id
     AND m.deleted_at IS NULL
     AND m.status = 1
     AND (m.effective_from IS NULL OR datetime(m.effective_from) <= CURRENT_TIMESTAMP)
     AND (m.effective_to IS NULL OR datetime(m.effective_to) > CURRENT_TIMESTAMP)
    WHERE c.tenant_id = ?1
      AND c.organization_id = ?2
      AND c.deleted_at IS NULL
    GROUP BY
        c.id,
        c.provider_id,
        c.provider_code,
        c.account_id,
        c.proxy_id,
        c.base_url,
        px.endpoint,
        c.status,
        c.health_status,
        a.status,
        px.status,
        px.health_status,
        c.priority,
        c.weight
)
SELECT
    CAST(p.id AS TEXT) AS id,
    COALESCE(NULLIF(p.provider_code, ''), CAST(p.id AS TEXT)) AS provider_code,
    COALESCE(NULLIF(p.default_vendor_code, ''), '') AS default_vendor_code,
    p.integration_type AS integration_type,
    COALESCE(NULLIF(p.display_name, ''), NULLIF(p.provider_code, ''), 'Provider') AS name,
    COALESCE(NULLIF(p.description, ''), NULLIF(p.provider_code, ''), 'Provider integration') AS description,
    COALESCE(NULLIF(rc.channel_url, ''), NULLIF(p.base_url, ''), '') AS url,
    rc.channel_id AS channel_id,
    rc.account_id AS account_id,
    rc.proxy_id AS proxy_id,
    p.status AS provider_status,
    rc.channel_status AS channel_status,
    rc.channel_health_status AS channel_health_status,
    rc.account_status AS account_status,
    rc.proxy_status AS proxy_status,
    rc.proxy_health_status AS proxy_health_status,
    COALESCE(rc.model_count, 0) AS model_count,
    CAST(lc.latest_config_at AS TEXT) AS latest_config_at
FROM integration_provider p
LEFT JOIN ranked_channel rc
  ON rc.channel_rank = 1
 AND (
       (p.id IS NOT NULL AND rc.provider_id = p.id)
       OR (NULLIF(rc.provider_code, '') IS NOT NULL AND rc.provider_code = p.provider_code)
     )
LEFT JOIN latest_config lc
  ON lc.tenant_id = ?1
 AND lc.organization_id = ?2
WHERE p.deleted_at IS NULL
  AND (p.tenant_id IS NULL OR p.tenant_id = 0 OR p.tenant_id = ?1)
  AND (p.organization_id IS NULL OR p.organization_id = 0 OR p.organization_id = ?2)
ORDER BY COALESCE(p.sort_order, 999999) ASC, p.id ASC
LIMIT 200
"#;

#[derive(Debug, Clone)]
pub struct SqliteAppProvidersReadStore {
    pool: SqlitePool,
}

impl SqliteAppProvidersReadStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl AppProvidersReadStore for SqliteAppProvidersReadStore {
    fn load_providers<'a>(
        &'a self,
        subject: Option<AppProvidersSubject>,
    ) -> AppProvidersReadFuture<'a, Vec<AppProviderItem>> {
        Box::pin(async move {
            let subject = require_subject(subject)?;
            let _request_user_id = subject.user_id;
            let rows = sqlx::query(LOAD_PROVIDERS)
                .bind(subject.tenant_id)
                .bind(subject.organization_id)
                .fetch_all(&self.pool)
                .await
                .map_err(sql_error)?;
            rows.into_iter().map(row_to_provider).collect()
        })
    }
}

fn row_to_provider(row: sqlx::sqlite::SqliteRow) -> DomainResult<AppProviderItem> {
    let provider_code = string_cell(&row, "provider_code");
    let default_vendor_code = string_cell(&row, "default_vendor_code");
    let integration_type = integration_type_code(&row)?;
    let channel_required = optional_integer_cell(&row, "channel_id").is_some();
    let account_required = optional_integer_cell(&row, "account_id").is_some();
    let proxy_required = optional_integer_cell(&row, "proxy_id").is_some();
    let provider_status = required_integer_cell(&row, "provider_status")?;
    let channel_status = related_integer_cell(&row, "channel_status", channel_required)?;
    let channel_health_status =
        related_integer_cell(&row, "channel_health_status", channel_required)?;
    let account_status = related_integer_cell(&row, "account_status", account_required)?;
    let proxy_status = related_integer_cell(&row, "proxy_status", proxy_required)?;
    let proxy_health_status = related_integer_cell(&row, "proxy_health_status", proxy_required)?;
    Ok(AppProviderItem {
        id: string_cell(&row, "id"),
        provider_family: provider_family_code(&provider_code, &default_vendor_code),
        integration_type,
        name: string_cell(&row, "name"),
        description: string_cell(&row, "description"),
        url: string_cell(&row, "url"),
        status: provider_status_label(
            provider_status,
            channel_status,
            channel_health_status,
            account_status,
            proxy_status,
            proxy_health_status,
        )?,
    })
}

fn require_subject(subject: Option<AppProvidersSubject>) -> DomainResult<AppProvidersSubject> {
    subject.ok_or_else(|| DomainError::new("trusted request subject is required for app providers"))
}

fn integration_type_code(row: &sqlx::sqlite::SqliteRow) -> DomainResult<String> {
    let Some(value) = optional_integer_cell(row, "integration_type") else {
        return Ok(IntegrationProviderType::Unknown.code().to_owned());
    };
    let code = i32::try_from(value).map_err(|_| {
        DomainError::new(format!(
            "invalid provider integration_type from database row: {value}"
        ))
    })?;
    IntegrationProviderType::try_from_int_code(code)
        .map(|integration_type| integration_type.code().to_owned())
        .ok_or_else(|| {
            DomainError::new(format!(
                "invalid provider integration_type from database row: {value}"
            ))
        })
}

fn provider_status_label(
    provider_status: i64,
    channel_status: Option<i64>,
    channel_health_status: Option<i64>,
    account_status: Option<i64>,
    proxy_status: Option<i64>,
    proxy_health_status: Option<i64>,
) -> DomainResult<String> {
    validate_status_code("provider_status", provider_status)?;
    validate_optional_status_code("channel_status", channel_status)?;
    validate_optional_health_status("channel_health_status", channel_health_status)?;
    validate_optional_status_code("account_status", account_status)?;
    validate_optional_status_code("proxy_status", proxy_status)?;
    validate_optional_health_status("proxy_health_status", proxy_health_status)?;

    let active = provider_status == 1
        && channel_status == Some(1)
        && channel_health_status == Some(1)
        && account_status.unwrap_or(1) == 1
        && proxy_status.unwrap_or(1) == 1
        && proxy_health_status.unwrap_or(1) == 1;

    Ok(if active { "active" } else { "inactive" }.to_owned())
}

fn validate_optional_status_code(column: &str, value: Option<i64>) -> DomainResult<()> {
    if let Some(value) = value {
        validate_status_code(column, value)?;
    }
    Ok(())
}

fn validate_optional_health_status(column: &str, value: Option<i64>) -> DomainResult<()> {
    match value {
        Some(1 | 2) | None => Ok(()),
        Some(value) => Err(DomainError::new(format!(
            "invalid provider {column} from database row: {value}"
        ))),
    }
}

fn validate_status_code(column: &str, value: i64) -> DomainResult<()> {
    match value {
        -1 | 0 | 1 | 2 => Ok(()),
        value => Err(DomainError::new(format!(
            "invalid provider {column} from database row: {value}"
        ))),
    }
}

fn string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> String {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .unwrap_or_default()
}

fn required_integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> DomainResult<i64> {
    optional_integer_cell(row, column)
        .ok_or_else(|| DomainError::new(format!("missing provider {column} from database row")))
}

fn related_integer_cell(
    row: &sqlx::sqlite::SqliteRow,
    column: &str,
    required: bool,
) -> DomainResult<Option<i64>> {
    let value = optional_integer_cell(row, column);
    if required && value.is_none() {
        return Err(DomainError::new(format!(
            "missing provider {column} from database row"
        )));
    }
    Ok(value)
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

fn sql_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}
