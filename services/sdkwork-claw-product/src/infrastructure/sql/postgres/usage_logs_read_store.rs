use sqlx::{PgPool, Row};

use crate::domain::{DecimalValue, DomainError};
use crate::infrastructure::sql::model_modality;
use crate::ports::{
    UsageLogItem, UsageLogsPage, UsageLogsQuery, UsageLogsReadFuture, UsageLogsReadStore,
    UsageLogsStatus, UsageLogsSubject,
};

const LOAD_USAGE_LOGS: &str = r#"
WITH selected_trace AS (
    SELECT *
    FROM (
        SELECT
            t.*,
            ROW_NUMBER() OVER (
                PARTITION BY COALESCE(NULLIF(t.request_id, ''), CAST(t.id AS TEXT))
                ORDER BY t.started_at DESC NULLS LAST, t.id DESC
            ) AS trace_rank
        FROM ai_request_trace t
        WHERE t.status = 1
          AND t.tenant_id = $1
          AND t.organization_id = $2
          AND t.user_id = $3
          AND t.started_at IS NOT NULL
          AND ($4::text IS NULL OR t.started_at >= ($4::timestamp AT TIME ZONE 'UTC'))
          AND ($5::text IS NULL OR t.started_at <= ($5::timestamp AT TIME ZONE 'UTC'))
    )
    WHERE trace_rank = 1
),
usage_by_request AS (
    SELECT
        tenant_id,
        organization_id,
        request_id,
        MAX(catalog_key) AS catalog_key,
        MAX(model) AS model,
        MAX(modality) AS modality,
        CAST(COALESCE(SUM(COALESCE(prompt_tokens, 0)), 0) AS TEXT) AS prompt_tokens,
        CAST(COALESCE(SUM(COALESCE(cached_tokens, 0)), 0) AS TEXT) AS cached_tokens,
        CAST(COALESCE(SUM(COALESCE(completion_tokens, 0)), 0) AS TEXT) AS completion_tokens,
        CAST(COALESCE(SUM(COALESCE(customer_charge_amount, cost_amount, 0)), 0) AS TEXT) AS cost_amount,
        CAST(COALESCE(MAX(COALESCE(rate_multiplier, 1)), 1) AS TEXT) AS rate_multiplier,
        CAST(COALESCE(MAX(COALESCE(base_input_unit_price, 0)), 0) AS TEXT) AS base_input_unit_price,
        CAST(COALESCE(MAX(COALESCE(base_output_unit_price, 0)), 0) AS TEXT) AS base_output_unit_price,
        CAST(COALESCE(MAX(COALESCE(cache_read_unit_price, 0)), 0) AS TEXT) AS cache_read_unit_price
    FROM ai_usage_fact
    WHERE status = 1
      AND tenant_id = $1
      AND organization_id = $2
      AND user_id = $3
      AND NULLIF(request_id, '') IS NOT NULL
      AND ($4::text IS NULL OR occurred_at >= ($4::timestamp AT TIME ZONE 'UTC'))
      AND ($5::text IS NULL OR occurred_at <= ($5::timestamp AT TIME ZONE 'UTC'))
    GROUP BY tenant_id, organization_id, request_id
)
SELECT
    CAST(t.id AS TEXT) AS id,
    COALESCE(NULLIF(t.request_id, ''), CAST(t.id AS TEXT)) AS request_id,
    CAST(COALESCE(t.started_at, t.created_at) AS TEXT) AS started_at,
    COALESCE(NULLIF(t.api_key_name_snapshot, ''), '-') AS api_key_name_snapshot,
    COALESCE(NULLIF(t.api_key_group_snapshot, ''), '-') AS api_key_group_snapshot,
    u.modality AS modality,
    COALESCE(NULLIF(u.catalog_key, ''), NULLIF(d.resolved_model, ''), NULLIF(t.provider_model, ''), NULLIF(t.requested_model, ''), '-') AS model,
    t.latency_ms AS latency_ms,
    COALESCE(t.ttft_ms, 0) AS ttft_ms,
    CASE WHEN COALESCE(t.streaming, false) THEN 1 ELSE 0 END AS is_stream,
    COALESCE(u.prompt_tokens, CAST(COALESCE(t.prompt_tokens, 0) AS TEXT)) AS prompt_tokens,
    COALESCE(u.cached_tokens, CAST(COALESCE(t.cached_tokens, 0) AS TEXT)) AS cached_tokens,
    COALESCE(u.completion_tokens, CAST(COALESCE(t.completion_tokens, 0) AS TEXT)) AS completion_tokens,
    COALESCE(u.cost_amount, '0') AS cost_amount,
    COALESCE(u.rate_multiplier, '1') AS rate_multiplier,
    COALESCE(u.base_input_unit_price, '0') AS base_input_unit_price,
    COALESCE(u.base_output_unit_price, '0') AS base_output_unit_price,
    COALESCE(u.cache_read_unit_price, '0') AS cache_read_unit_price,
    COALESCE(NULLIF(t.request_path, ''), NULLIF(t.endpoint, ''), '-') AS request_path,
    COALESCE(NULLIF(t.reasoning_effort, ''), '-') AS reasoning_effort,
    COALESCE(NULLIF(t.client_ip_masked, ''), '-') AS client_ip_masked
FROM selected_trace t
LEFT JOIN usage_by_request u
  ON u.tenant_id = t.tenant_id
 AND u.organization_id = t.organization_id
 AND u.request_id = t.request_id
LEFT JOIN ai_routing_decision_log d
  ON d.status = 1
 AND d.tenant_id = t.tenant_id
 AND d.organization_id = t.organization_id
 AND d.request_id = t.request_id
WHERE (
    $6::text IS NULL
    OR lower(COALESCE(t.request_id, '')) LIKE $6
    OR lower(COALESCE(t.api_key_name_snapshot, '')) LIKE $6
    OR lower(COALESCE(t.api_key_group_snapshot, '')) LIKE $6
    OR lower(COALESCE(t.requested_model, '')) LIKE $6
    OR lower(COALESCE(u.catalog_key, '')) LIKE $6
    OR lower(COALESCE(u.model, '')) LIKE $6
    OR lower(COALESCE(t.request_path, '')) LIKE $6
    OR lower(COALESCE(t.client_ip_masked, '')) LIKE $6
)
AND (
    $7 = 0
    OR ($7 = 1 AND NOT ((t.http_status IS NOT NULL AND t.http_status >= 400) OR t.error_type IS NOT NULL OR NULLIF(t.provider_error_code, '') IS NOT NULL))
    OR ($7 = 2 AND ((t.http_status IS NOT NULL AND t.http_status >= 400) OR t.error_type IS NOT NULL OR NULLIF(t.provider_error_code, '') IS NOT NULL))
)
ORDER BY t.started_at DESC NULLS LAST, t.id DESC
LIMIT $8 OFFSET $9
"#;

const LOAD_USAGE_LOGS_TOTAL: &str = r#"
WITH selected_trace AS (
    SELECT *
    FROM (
        SELECT
            t.*,
            ROW_NUMBER() OVER (
                PARTITION BY COALESCE(NULLIF(t.request_id, ''), CAST(t.id AS TEXT))
                ORDER BY t.started_at DESC NULLS LAST, t.id DESC
            ) AS trace_rank
        FROM ai_request_trace t
        WHERE t.status = 1
          AND t.tenant_id = $1
          AND t.organization_id = $2
          AND t.user_id = $3
          AND t.started_at IS NOT NULL
          AND ($4::text IS NULL OR t.started_at >= ($4::timestamp AT TIME ZONE 'UTC'))
          AND ($5::text IS NULL OR t.started_at <= ($5::timestamp AT TIME ZONE 'UTC'))
    )
    WHERE trace_rank = 1
),
usage_by_request AS (
    SELECT tenant_id, organization_id, request_id, MAX(catalog_key) AS catalog_key, MAX(model) AS model
    FROM ai_usage_fact
    WHERE status = 1
      AND tenant_id = $1
      AND organization_id = $2
      AND user_id = $3
      AND NULLIF(request_id, '') IS NOT NULL
      AND ($4::text IS NULL OR occurred_at >= ($4::timestamp AT TIME ZONE 'UTC'))
      AND ($5::text IS NULL OR occurred_at <= ($5::timestamp AT TIME ZONE 'UTC'))
    GROUP BY tenant_id, organization_id, request_id
)
SELECT CAST(COUNT(1) AS TEXT) AS total
FROM selected_trace t
LEFT JOIN usage_by_request u
  ON u.tenant_id = t.tenant_id
 AND u.organization_id = t.organization_id
 AND u.request_id = t.request_id
LEFT JOIN ai_routing_decision_log d
  ON d.status = 1
 AND d.tenant_id = t.tenant_id
 AND d.organization_id = t.organization_id
 AND d.request_id = t.request_id
WHERE (
    $6::text IS NULL
    OR lower(COALESCE(t.request_id, '')) LIKE $6
    OR lower(COALESCE(t.api_key_name_snapshot, '')) LIKE $6
    OR lower(COALESCE(t.api_key_group_snapshot, '')) LIKE $6
    OR lower(COALESCE(t.requested_model, '')) LIKE $6
    OR lower(COALESCE(u.catalog_key, '')) LIKE $6
    OR lower(COALESCE(u.model, '')) LIKE $6
    OR lower(COALESCE(t.request_path, '')) LIKE $6
    OR lower(COALESCE(t.client_ip_masked, '')) LIKE $6
)
AND (
    $7 = 0
    OR ($7 = 1 AND NOT ((t.http_status IS NOT NULL AND t.http_status >= 400) OR t.error_type IS NOT NULL OR NULLIF(t.provider_error_code, '') IS NOT NULL))
    OR ($7 = 2 AND ((t.http_status IS NOT NULL AND t.http_status >= 400) OR t.error_type IS NOT NULL OR NULLIF(t.provider_error_code, '') IS NOT NULL))
)
"#;

pub struct PostgresUsageLogsReadStore {
    pool: PgPool,
}

impl PostgresUsageLogsReadStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl UsageLogsReadStore for PostgresUsageLogsReadStore {
    fn load_usage_logs<'a>(
        &'a self,
        query: UsageLogsQuery,
        subject: Option<UsageLogsSubject>,
    ) -> UsageLogsReadFuture<'a> {
        Box::pin(async move {
            let subject = subject.ok_or_else(|| {
                DomainError::new("trusted request subject is required for usage logs")
            })?;
            let total = load_usage_logs_total(&self.pool, &query, subject).await?;
            let rows = sqlx::query(LOAD_USAGE_LOGS)
                .bind(subject.tenant_id)
                .bind(subject.organization_id)
                .bind(subject.user_id)
                .bind(query.start_time.as_deref())
                .bind(query.end_time.as_deref())
                .bind(keyword_like(query.keyword.as_deref()))
                .bind(status_code(query.status))
                .bind(query.page_size)
                .bind(query.offset)
                .fetch_all(&self.pool)
                .await
                .map_err(sql_error)?;

            Ok(UsageLogsPage {
                logs: rows
                    .into_iter()
                    .map(row_to_usage_log)
                    .collect::<Result<Vec<_>, DomainError>>()?,
                total,
                page_no: query.page_no,
                page_size: query.page_size,
            })
        })
    }
}

async fn load_usage_logs_total(
    pool: &PgPool,
    query: &UsageLogsQuery,
    subject: UsageLogsSubject,
) -> Result<i64, DomainError> {
    let row = sqlx::query(LOAD_USAGE_LOGS_TOTAL)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .bind(query.start_time.as_deref())
        .bind(query.end_time.as_deref())
        .bind(keyword_like(query.keyword.as_deref()))
        .bind(status_code(query.status))
        .fetch_one(pool)
        .await
        .map_err(sql_error)?;
    Ok(integer_cell(&row, "total"))
}

fn row_to_usage_log(row: sqlx::postgres::PgRow) -> Result<UsageLogItem, DomainError> {
    Ok(UsageLogItem {
        id: string_cell(&row, "id"),
        request_id: string_cell(&row, "request_id"),
        time: string_cell(&row, "started_at"),
        token_name: string_cell(&row, "api_key_name_snapshot"),
        group: string_cell(&row, "api_key_group_snapshot"),
        log_type: modality_label(optional_integer_cell(&row, "modality")),
        model: string_cell(&row, "model"),
        total_time: duration_label(required_latency_cell(&row, "latency_ms")?),
        ttft: duration_label(integer_cell(&row, "ttft_ms")),
        is_stream: integer_cell(&row, "is_stream") != 0,
        input_tokens: integer_cell(&row, "prompt_tokens"),
        cache_read_tokens: integer_cell(&row, "cached_tokens"),
        output_tokens: integer_cell(&row, "completion_tokens"),
        cost: decimal_string_cell(&row, "cost_amount", 6, "usage log cost")?,
        multiplier: decimal_string_cell(&row, "rate_multiplier", 6, "usage log rate multiplier")?,
        base_input_price: decimal_string_cell(
            &row,
            "base_input_unit_price",
            6,
            "usage log base input price",
        )?,
        base_output_price: decimal_string_cell(
            &row,
            "base_output_unit_price",
            6,
            "usage log base output price",
        )?,
        cache_read_price: decimal_string_cell(
            &row,
            "cache_read_unit_price",
            6,
            "usage log cache read price",
        )?,
        path: string_cell(&row, "request_path"),
        reasoning_effort: string_cell(&row, "reasoning_effort"),
        ip: string_cell(&row, "client_ip_masked"),
    })
}

fn keyword_like(keyword: Option<&str>) -> Option<String> {
    keyword.map(|value| format!("%{}%", value.to_ascii_lowercase()))
}

fn status_code(status: UsageLogsStatus) -> i64 {
    match status {
        UsageLogsStatus::All => 0,
        UsageLogsStatus::Success => 1,
        UsageLogsStatus::Error => 2,
    }
}

fn duration_label(value: i64) -> String {
    format!("{value}ms")
}

fn modality_label(value: Option<i64>) -> String {
    model_modality::label(value).to_owned()
}

fn string_cell(row: &sqlx::postgres::PgRow, column: &str) -> String {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .unwrap_or_default()
}

fn integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> i64 {
    optional_integer_cell(row, column).unwrap_or(0)
}

fn required_latency_cell(row: &sqlx::postgres::PgRow, column: &str) -> Result<i64, DomainError> {
    let value = optional_integer_cell(row, column).ok_or_else(|| {
        if column == "latency_ms" {
            DomainError::new("missing usage log latency_ms from database row")
        } else {
            DomainError::new(format!("missing usage log {column} from database row"))
        }
    })?;
    if value < 0 {
        if column == "latency_ms" {
            return Err(DomainError::new(format!(
                "invalid usage log latency_ms from database row: {value}"
            )));
        }
        return Err(DomainError::new(format!(
            "invalid usage log {column} from database row: {value}"
        )));
    }
    Ok(value)
}

fn optional_integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<i64> {
    row.try_get::<Option<i64>, _>(column)
        .ok()
        .flatten()
        .or_else(|| {
            row.try_get::<Option<i32>, _>(column)
                .ok()
                .flatten()
                .map(i64::from)
        })
        .or_else(|| integer_string_cell(&string_cell(row, column)))
}

fn integer_string_cell(value: &str) -> Option<i64> {
    let value = value.trim();
    if let Ok(parsed) = value.parse::<i64>() {
        return Some(parsed);
    }
    let (whole, fraction) = value.split_once('.')?;
    if fraction.chars().all(|ch| ch == '0') {
        return whole.parse::<i64>().ok();
    }
    None
}

fn decimal_string_cell(
    row: &sqlx::postgres::PgRow,
    column: &str,
    digits: u32,
    field_name: &str,
) -> Result<String, DomainError> {
    let value = string_cell(row, column);
    decimal_value_string(&value, digits, field_name)
}

fn decimal_value_string(value: &str, digits: u32, field_name: &str) -> Result<String, DomainError> {
    DecimalValue::parse(&value)
        .map(|amount| amount.to_fixed_string(digits))
        .map_err(|_| DomainError::new(format!("invalid {field_name}: {value}")))
}

fn sql_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::infrastructure::sql::model_modality::{MODALITY_IMAGE, MODALITY_TEXT};

    #[test]
    fn decimal_value_string_rejects_invalid_database_amount() {
        assert_eq!(
            "12.300000",
            decimal_value_string("12.3", 6, "usage log amount").unwrap()
        );

        let unsupported = decimal_value_string("not-money", 6, "usage log amount")
            .expect_err("invalid usage log money must fail");
        assert!(
            unsupported
                .to_string()
                .contains("invalid usage log amount: not-money"),
            "{unsupported}"
        );
    }

    #[test]
    fn modality_label_reports_unknown_instead_of_defaulting_to_text() {
        assert_eq!("text", modality_label(Some(MODALITY_TEXT)));
        assert_eq!("image", modality_label(Some(MODALITY_IMAGE)));
        assert_eq!("unknown", modality_label(None));
        assert_eq!("unknown", modality_label(Some(99)));
    }

    #[test]
    fn usage_logs_queries_scope_trace_and_usage_rows_to_app_subject() {
        let sql = [LOAD_USAGE_LOGS, LOAD_USAGE_LOGS_TOTAL].join("\n");
        for predicate in [
            "t.tenant_id = $1",
            "t.organization_id = $2",
            "t.user_id = $3",
            "tenant_id = $1",
            "organization_id = $2",
            "user_id = $3",
        ] {
            assert!(
                sql.contains(predicate),
                "usage logs Postgres SQL must include subject predicate {predicate}"
            );
        }
    }

    #[test]
    fn usage_logs_query_projects_only_masked_client_identity_and_billing_fields() {
        for projection in [
            "api_key_name_snapshot",
            "api_key_group_snapshot",
            "prompt_tokens",
            "cached_tokens",
            "completion_tokens",
            "cost_amount",
            "rate_multiplier",
            "base_input_unit_price",
            "base_output_unit_price",
            "cache_read_unit_price",
            "client_ip_masked",
        ] {
            assert!(
                LOAD_USAGE_LOGS.contains(projection),
                "usage logs Postgres SQL must project {projection}"
            );
        }
        assert!(
            !LOAD_USAGE_LOGS.contains("client_ip,"),
            "usage logs Postgres SQL must not project raw client_ip"
        );
    }

    #[test]
    fn usage_logs_queries_apply_time_keyword_and_status_filters_to_total_and_page_sql() {
        let total_sql = LOAD_USAGE_LOGS_TOTAL;
        let page_sql = LOAD_USAGE_LOGS;
        for predicate in [
            "$4::text IS NULL OR t.started_at >=",
            "$5::text IS NULL OR t.started_at <=",
            "$6::text IS NULL",
            "$7 = 0",
            "$7 = 1",
            "$7 = 2",
        ] {
            assert!(
                total_sql.contains(predicate) && page_sql.contains(predicate),
                "usage logs Postgres total and page SQL must both include filter predicate {predicate}"
            );
        }
    }
}
