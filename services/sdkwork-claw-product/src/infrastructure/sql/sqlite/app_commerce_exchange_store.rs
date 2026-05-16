use sqlx::{Row, SqlitePool};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    AppCommerceExchangeReadFuture, AppCommerceExchangeReadStore, AppCommerceExchangeRuleItem,
    AppCommerceExchangeRuleQuery, AppCommerceSubject,
};

const ACCOUNT_EXCHANGE_POINTS_TO_CASH_RATE: &str = "POINTS_TO_CASH_RATE";

#[derive(Debug, Clone)]
pub struct SqliteAppCommerceExchangeStore {
    pool: SqlitePool,
}

impl SqliteAppCommerceExchangeStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl AppCommerceExchangeReadStore for SqliteAppCommerceExchangeStore {
    fn list_exchange_rules<'a>(
        &'a self,
        query: AppCommerceExchangeRuleQuery,
    ) -> AppCommerceExchangeReadFuture<'a, Vec<AppCommerceExchangeRuleItem>> {
        Box::pin(async move { list_exchange_rules(&self.pool, query).await })
    }

    fn load_points_exchange_rate<'a>(
        &'a self,
        subject: Option<AppCommerceSubject>,
    ) -> AppCommerceExchangeReadFuture<'a, Option<AppCommerceExchangeRuleItem>> {
        Box::pin(async move { load_points_exchange_rate(&self.pool, subject).await })
    }
}

async fn list_exchange_rules(
    pool: &SqlitePool,
    query: AppCommerceExchangeRuleQuery,
) -> DomainResult<Vec<AppCommerceExchangeRuleItem>> {
    let rows = match query.subject {
        Some(subject) => {
            sqlx::query(EXCHANGE_RULES_FOR_SUBJECT_SQL)
                .bind(subject.tenant_id)
                .bind(subject.organization_id)
                .bind(ACCOUNT_EXCHANGE_POINTS_TO_CASH_RATE)
                .bind(subject.tenant_id)
                .bind(subject.organization_id)
                .fetch_all(pool)
                .await
        }
        None => {
            sqlx::query(EXCHANGE_RULES_GLOBAL_SQL)
                .bind(ACCOUNT_EXCHANGE_POINTS_TO_CASH_RATE)
                .fetch_all(pool)
                .await
        }
    }
    .map_err(|error| store_error("failed to list app exchange rules", error))?;

    rows.iter()
        .map(exchange_rule_from_row)
        .filter(|item| match item {
            Ok(item) => exchange_rule_matches_filters(item, &query),
            Err(_) => true,
        })
        .collect()
}

async fn load_points_exchange_rate(
    pool: &SqlitePool,
    subject: Option<AppCommerceSubject>,
) -> DomainResult<Option<AppCommerceExchangeRuleItem>> {
    let row = match subject {
        Some(subject) => {
            sqlx::query(EXCHANGE_RULES_FOR_SUBJECT_SQL)
                .bind(subject.tenant_id)
                .bind(subject.organization_id)
                .bind(ACCOUNT_EXCHANGE_POINTS_TO_CASH_RATE)
                .bind(subject.tenant_id)
                .bind(subject.organization_id)
                .fetch_optional(pool)
                .await
        }
        None => {
            sqlx::query(EXCHANGE_RULES_GLOBAL_SQL)
                .bind(ACCOUNT_EXCHANGE_POINTS_TO_CASH_RATE)
                .fetch_optional(pool)
                .await
        }
    }
    .map_err(|error| store_error("failed to load app exchange rate", error))?;

    row.as_ref().map(exchange_rule_from_row).transpose()
}

const EXCHANGE_RULES_FOR_SUBJECT_SQL: &str = r#"
SELECT
    COALESCE(NULLIF(uuid, ''), CAST(id AS TEXT)) AS id,
    COALESCE(config_key, '') AS config_key,
    CAST(COALESCE(config_value, 0) AS TEXT) AS rate,
    tenant_id,
    organization_id
FROM plus_account_exchange_config
WHERE ((tenant_id = ? AND organization_id = ?) OR (tenant_id = 0 AND organization_id = 0))
  AND config_key = ?
ORDER BY CASE WHEN tenant_id = ? AND organization_id = ? THEN 0 ELSE 1 END,
         updated_at DESC,
         id DESC
LIMIT 500
"#;

const EXCHANGE_RULES_GLOBAL_SQL: &str = r#"
SELECT
    COALESCE(NULLIF(uuid, ''), CAST(id AS TEXT)) AS id,
    COALESCE(config_key, '') AS config_key,
    CAST(COALESCE(config_value, 0) AS TEXT) AS rate,
    tenant_id,
    organization_id
FROM plus_account_exchange_config
WHERE tenant_id = 0
  AND organization_id = 0
  AND config_key = ?
ORDER BY updated_at DESC, id DESC
LIMIT 500
"#;

fn exchange_rule_from_row(
    row: &sqlx::sqlite::SqliteRow,
) -> DomainResult<AppCommerceExchangeRuleItem> {
    let config_key = string_cell(row, "config_key");
    let (source_asset_type, target_asset_type) = exchange_config_key_asset_pair(&config_key)?;
    Ok(AppCommerceExchangeRuleItem {
        id: string_cell(row, "id"),
        source_asset_type: source_asset_type.to_owned(),
        target_asset_type: target_asset_type.to_owned(),
        rate: canonical_decimal_string(&string_cell(row, "rate"), 6, "exchange rule rate")?,
        status: "active".to_owned(),
    })
}

fn exchange_rule_matches_filters(
    item: &AppCommerceExchangeRuleItem,
    query: &AppCommerceExchangeRuleQuery,
) -> bool {
    query
        .source_asset_type
        .as_deref()
        .map(|value| value == item.source_asset_type)
        .unwrap_or(true)
        && query
            .target_asset_type
            .as_deref()
            .map(|value| value == item.target_asset_type)
            .unwrap_or(true)
}

fn exchange_config_key_asset_pair(config_key: &str) -> DomainResult<(&'static str, &'static str)> {
    match config_key {
        ACCOUNT_EXCHANGE_POINTS_TO_CASH_RATE => Ok(("POINTS", "CASH")),
        value => Err(DomainError::new(format!(
            "unsupported app exchange rule config key: {value}"
        ))),
    }
}

fn canonical_decimal_string(value: &str, scale: usize, field_name: &str) -> DomainResult<String> {
    let value = value.trim().replace(',', "");
    if value.is_empty() || value.starts_with('-') || value.starts_with('+') {
        return Err(DomainError::new(format!("invalid {field_name}: {value}")));
    }
    let mut parts = value.split('.');
    let whole = parts
        .next()
        .unwrap_or_default()
        .trim_start_matches('0')
        .to_owned();
    let fraction = parts.next().unwrap_or_default();
    if parts.next().is_some()
        || whole.chars().any(|ch| !ch.is_ascii_digit())
        || fraction.chars().any(|ch| !ch.is_ascii_digit())
        || fraction.len() > scale
    {
        return Err(DomainError::new(format!("invalid {field_name}: {value}")));
    }
    let whole = if whole.is_empty() { "0" } else { &whole };
    let fraction = fraction.trim_end_matches('0');
    if fraction.is_empty() {
        Ok(whole.to_owned())
    } else {
        Ok(format!("{whole}.{fraction}"))
    }
}

fn optional_string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .or_else(|| row.try_get::<String, _>(column).ok())
        .or_else(|| {
            row.try_get::<Option<i64>, _>(column)
                .ok()
                .flatten()
                .map(|value| value.to_string())
        })
        .or_else(|| {
            row.try_get::<i64, _>(column)
                .ok()
                .map(|value| value.to_string())
        })
}

fn string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> String {
    optional_string_cell(row, column).unwrap_or_default()
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}
