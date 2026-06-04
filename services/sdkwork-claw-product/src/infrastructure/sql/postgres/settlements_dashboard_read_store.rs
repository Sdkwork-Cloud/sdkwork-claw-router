use std::collections::HashMap;

use sqlx::{PgPool, Row};

use crate::domain::{DecimalValue, DomainError};
use crate::infrastructure::sql::model_modality::{
    MODALITY_AUDIO, MODALITY_IMAGE, MODALITY_MUSIC, MODALITY_TEXT, MODALITY_VIDEO,
};
use crate::ports::{
    SettlementBill, SettlementBillBreakdown, SettlementBillBreakdownItem, SettlementChartPoint,
    SettlementsDashboardQuery, SettlementsDashboardReadFuture, SettlementsDashboardReadStore,
    SettlementsDashboardSnapshot, SettlementsDashboardSubject,
};

const LOAD_SETTLEMENT_BILLS: &str = r#"
SELECT
    s.id AS statement_id,
    COALESCE(NULLIF(s.statement_no, ''), CAST(s.id AS TEXT)) AS statement_no,
    COALESCE(NULLIF(s.period, ''), substr(CAST(s.period_start AS TEXT), 1, 7), '-') AS period,
    CAST(COALESCE(s.period_start, s.created_at) AS TEXT) AS period_start,
    CAST(COALESCE(s.period_end, s.updated_at, s.created_at) AS TEXT) AS period_end,
    CAST(COALESCE(s.total_tokens, 0) AS TEXT) AS total_tokens,
    CAST(COALESCE(s.total_cost, 0) AS TEXT) AS total_cost,
    s.statement_status AS statement_status,
    s.payment_status AS payment_status,
    CAST(s.due_at AS TEXT) AS due_at,
    COUNT(DISTINCT us.id) AS settlement_count,
    COUNT(DISTINCT be.id) AS export_count,
    COUNT(DISTINCT pi.id) AS invoice_count
FROM commerce_usage_statement s
LEFT JOIN commerce_usage_settlement us
  ON us.status = 1
 AND us.tenant_id = s.tenant_id
 AND us.organization_id = s.organization_id
 AND us.created_at >= s.period_start
 AND us.created_at <= s.period_end
LEFT JOIN commerce_billing_export be
  ON be.status = 1
 AND be.tenant_id = s.tenant_id
 AND be.organization_id = s.organization_id
 AND be.id = s.export_id
LEFT JOIN commerce_invoice pi
  ON pi.id = CAST(s.invoice_id AS TEXT)
 AND pi.tenant_id = CAST(s.tenant_id AS TEXT)
 AND pi.organization_id = CAST(s.organization_id AS TEXT)
WHERE s.status = 1
  AND s.tenant_id = $1
  AND s.organization_id = $2
  AND s.owner_id = $3
  AND ($4::text IS NULL OR substr(CAST(s.period_start AS TEXT), 1, 4) = $4 OR s.period LIKE ($4 || '%'))
GROUP BY
    s.id,
    s.statement_no,
    s.period,
    s.period_start,
    s.period_end,
    s.created_at,
    s.updated_at,
    s.total_tokens,
    s.total_cost,
    s.statement_status,
    s.payment_status,
    s.due_at
ORDER BY s.period_end DESC NULLS LAST, s.id DESC
LIMIT 24
"#;

const LOAD_SETTLEMENT_ITEMS: &str = r#"
SELECT
    i.statement_id,
    i.modality,
    COALESCE(NULLIF(i.model, ''), '-') AS model,
    CAST(i.model_list AS TEXT) AS model_list,
    COALESCE(NULLIF(i.usage_text, ''), '') AS usage_text,
    CAST(COALESCE(i.request_count, 0) AS TEXT) AS request_count,
    CAST(COALESCE(i.token_count, 0) AS TEXT) AS token_count,
    CAST(COALESCE(i.asset_count, 0) AS TEXT) AS asset_count,
    CAST(COALESCE(i.duration_seconds, 0) AS TEXT) AS duration_seconds,
    CAST(COALESCE(i.cost_amount, 0) AS TEXT) AS cost_amount
FROM commerce_usage_statement_item i
JOIN commerce_usage_statement s
  ON s.id = i.statement_id
WHERE i.status = 1
  AND s.status = 1
  AND s.tenant_id = $1
  AND s.organization_id = $2
  AND s.owner_id = $3
  AND ($4::text IS NULL OR substr(CAST(s.period_start AS TEXT), 1, 4) = $4 OR s.period LIKE ($4 || '%'))
ORDER BY s.period_end DESC NULLS LAST, i.statement_id DESC, i.item_type ASC, i.model ASC
"#;

const LOAD_SETTLEMENT_CHART: &str = r#"
SELECT
    substr(CAST(occurred_at AS TEXT), 1, 10) AS day,
    CAST(COALESCE(SUM(CASE WHEN modality = 1 THEN COALESCE(customer_charge_amount, 0) ELSE 0 END), 0) AS TEXT) AS text_cost,
    CAST(COALESCE(SUM(CASE WHEN modality = 2 THEN COALESCE(customer_charge_amount, 0) ELSE 0 END), 0) AS TEXT) AS image_cost,
    CAST(COALESCE(SUM(CASE WHEN modality = 5 THEN COALESCE(customer_charge_amount, 0) ELSE 0 END), 0) AS TEXT) AS video_cost,
    CAST(COALESCE(SUM(CASE WHEN modality = 3 THEN COALESCE(customer_charge_amount, 0) ELSE 0 END), 0) AS TEXT) AS audio_cost,
    CAST(COALESCE(SUM(CASE WHEN modality = 4 THEN COALESCE(customer_charge_amount, 0) ELSE 0 END), 0) AS TEXT) AS music_cost
FROM ai_usage_fact
WHERE status = 1
  AND tenant_id = $1
  AND organization_id = $2
  AND user_id = $3
  AND occurred_at IS NOT NULL
  AND ($4::text IS NULL OR substr(CAST(occurred_at AS TEXT), 1, 4) = $4)
GROUP BY day
ORDER BY day ASC
LIMIT 366
"#;

pub struct PostgresSettlementsDashboardReadStore {
    pool: PgPool,
}

impl PostgresSettlementsDashboardReadStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl SettlementsDashboardReadStore for PostgresSettlementsDashboardReadStore {
    fn load_settlements_dashboard<'a>(
        &'a self,
        query: SettlementsDashboardQuery,
        subject: Option<SettlementsDashboardSubject>,
    ) -> SettlementsDashboardReadFuture<'a> {
        Box::pin(async move {
            let subject = subject.ok_or_else(|| {
                DomainError::new("trusted request subject is required for settlements dashboard")
            })?;
            let bills = load_settlement_bills(&self.pool, &query, subject).await?;
            let chart_data = load_settlement_chart(&self.pool, &query, subject).await?;

            Ok(SettlementsDashboardSnapshot { chart_data, bills })
        })
    }
}

async fn load_settlement_bills(
    pool: &PgPool,
    query: &SettlementsDashboardQuery,
    subject: SettlementsDashboardSubject,
) -> Result<Vec<SettlementBill>, DomainError> {
    let year = year_filter(query);
    let bill_rows = sqlx::query(LOAD_SETTLEMENT_BILLS)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .bind(year.as_deref())
        .fetch_all(pool)
        .await
        .map_err(sql_error)?;

    let mut bill_indexes = HashMap::new();
    let mut bills = Vec::with_capacity(bill_rows.len());
    for row in bill_rows {
        let statement_id = integer_cell(&row, "statement_id");
        bill_indexes.insert(statement_id, bills.len());
        bills.push(row_to_bill(row)?);
    }

    let item_rows = sqlx::query(LOAD_SETTLEMENT_ITEMS)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .bind(year.as_deref())
        .fetch_all(pool)
        .await
        .map_err(sql_error)?;

    for row in item_rows {
        let statement_id = integer_cell(&row, "statement_id");
        if let Some(index) = bill_indexes.get(&statement_id).copied() {
            merge_item_into_breakdown(&mut bills[index].breakdown, row)?;
        }
    }

    Ok(bills)
}

async fn load_settlement_chart(
    pool: &PgPool,
    query: &SettlementsDashboardQuery,
    subject: SettlementsDashboardSubject,
) -> Result<Vec<SettlementChartPoint>, DomainError> {
    let year = year_filter(query);
    let rows = sqlx::query(LOAD_SETTLEMENT_CHART)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .bind(year.as_deref())
        .fetch_all(pool)
        .await
        .map_err(sql_error)?;

    rows.into_iter()
        .map(|row| {
            Ok(SettlementChartPoint {
                day: string_cell(&row, "day"),
                text: decimal_string_cell(&row, "text_cost", 6, "settlement chart text cost")?,
                image: decimal_string_cell(&row, "image_cost", 6, "settlement chart image cost")?,
                video: decimal_string_cell(&row, "video_cost", 6, "settlement chart video cost")?,
                audio: decimal_string_cell(&row, "audio_cost", 6, "settlement chart audio cost")?,
                music: decimal_string_cell(&row, "music_cost", 6, "settlement chart music cost")?,
            })
        })
        .collect()
}

fn row_to_bill(row: sqlx::postgres::PgRow) -> Result<SettlementBill, DomainError> {
    Ok(SettlementBill {
        id: string_cell(&row, "statement_no"),
        period: string_cell(&row, "period"),
        start_date: string_cell(&row, "period_start"),
        end_date: string_cell(&row, "period_end"),
        total_tokens: string_cell(&row, "total_tokens"),
        total_cost: decimal_string_cell(&row, "total_cost", 6, "settlement bill total cost")?,
        status: statement_status_label(
            required_statement_status_cell(&row, "payment_status", "payment")?,
            required_statement_status_cell(&row, "statement_status", "statement")?,
        )?,
        breakdown: SettlementBillBreakdown::default(),
    })
}

fn merge_item_into_breakdown(
    breakdown: &mut SettlementBillBreakdown,
    row: sqlx::postgres::PgRow,
) -> Result<(), DomainError> {
    let modality = required_modality_cell(&row, "modality", "settlement item")?;
    let target = breakdown_item_mut(breakdown, modality)?;
    let item_cost = decimal_string_cell(&row, "cost_amount", 6, "settlement item cost")?;
    target.cost = decimal_add_strings(&target.cost, &item_cost, 6)?;
    if target.usage.is_empty() {
        target.usage = usage_label(&row, modality);
    }
    extend_unique_models(
        &mut target.models,
        model_list(
            &string_cell(&row, "model_list"),
            &string_cell(&row, "model"),
        )?,
    );
    Ok(())
}

fn breakdown_item_mut(
    breakdown: &mut SettlementBillBreakdown,
    modality: i64,
) -> Result<&mut SettlementBillBreakdownItem, DomainError> {
    match modality {
        MODALITY_TEXT => Ok(&mut breakdown.text),
        MODALITY_IMAGE => Ok(&mut breakdown.image),
        MODALITY_VIDEO => Ok(&mut breakdown.video),
        MODALITY_AUDIO => Ok(&mut breakdown.audio),
        MODALITY_MUSIC => Ok(&mut breakdown.music),
        value => Err(DomainError::new(format!(
            "unsupported settlement item modality: {value}"
        ))),
    }
}

fn usage_label(row: &sqlx::postgres::PgRow, modality: i64) -> String {
    let usage_text = string_cell(row, "usage_text");
    if !usage_text.is_empty() {
        return usage_text;
    }

    match modality {
        MODALITY_TEXT => format!("{} tokens", integer_cell(row, "token_count")),
        MODALITY_IMAGE => format!("{} items", integer_cell(row, "asset_count")),
        MODALITY_VIDEO | MODALITY_AUDIO | MODALITY_MUSIC => {
            format!("{}s", whole_decimal_string_cell(row, "duration_seconds"))
        }
        _ => format!("{} requests", integer_cell(row, "request_count")),
    }
}

fn model_list(raw: &str, fallback: &str) -> Result<Vec<String>, DomainError> {
    let mut models = if raw.trim().is_empty() {
        Vec::new()
    } else {
        serde_json::from_str::<Vec<String>>(raw).map_err(|error| {
            DomainError::new(format!(
                "invalid settlement model list json from database row: {error}"
            ))
        })?
    };
    models.retain(|model| !model.trim().is_empty());
    if models.is_empty() && fallback != "-" && !fallback.is_empty() {
        models.push(fallback.to_owned());
    }
    Ok(models)
}

fn extend_unique_models(target: &mut Vec<String>, values: Vec<String>) {
    for value in values {
        if !target.iter().any(|item| item == &value) {
            target.push(value);
        }
    }
}

fn statement_status_label(
    payment_status: i64,
    statement_status: i64,
) -> Result<String, DomainError> {
    ensure_statement_status("payment", payment_status)?;
    ensure_statement_status("statement", statement_status)?;
    Ok(match (payment_status, statement_status) {
        (2, _) | (_, 2) => "已结清",
        (3, _) | (_, 3) => "已逾期",
        _ => "待结算",
    }
    .to_owned())
}

fn year_filter(query: &SettlementsDashboardQuery) -> Option<String> {
    query.year.map(|year| year.to_string())
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

fn required_statement_status_cell(
    row: &sqlx::postgres::PgRow,
    column: &str,
    source: &str,
) -> Result<i64, DomainError> {
    optional_integer_cell(row, column).ok_or_else(|| missing_statement_status_error(source))
}

fn required_modality_cell(
    row: &sqlx::postgres::PgRow,
    column: &str,
    source: &str,
) -> Result<i64, DomainError> {
    optional_integer_cell(row, column).ok_or_else(|| missing_modality_error(source))
}

fn ensure_statement_status(source: &str, status: i64) -> Result<(), DomainError> {
    match status {
        0..=5 => Ok(()),
        value => Err(DomainError::new(format!(
            "unsupported settlement bill status {source}={value}"
        ))),
    }
}

fn missing_statement_status_error(source: &str) -> DomainError {
    match source {
        "payment" => DomainError::new("missing settlement bill status payment"),
        "statement" => DomainError::new("missing settlement bill status statement"),
        value => DomainError::new(format!("missing settlement bill status {value}")),
    }
}

fn missing_modality_error(source: &str) -> DomainError {
    match source {
        "settlement item" => DomainError::new("missing settlement item modality"),
        value => DomainError::new(format!("missing {value} modality")),
    }
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

fn decimal_add_strings(left: &str, right: &str, digits: u32) -> Result<String, DomainError> {
    let left = DecimalValue::parse(left)
        .map_err(|_| DomainError::new(format!("invalid settlement decimal addend: {left}")))?;
    let right = DecimalValue::parse(right)
        .map_err(|_| DomainError::new(format!("invalid settlement decimal addend: {right}")))?;
    Ok((left + right).to_fixed_string(digits))
}

fn whole_decimal_string_cell(row: &sqlx::postgres::PgRow, column: &str) -> String {
    let value = string_cell(row, column);
    let value = value.trim();
    if value.is_empty() {
        return "0".to_owned();
    }
    let unsigned = value.trim_start_matches('-');
    let whole = unsigned.split('.').next().unwrap_or("0");
    let whole = if whole.is_empty() { "0" } else { whole };
    if value.starts_with('-') && whole != "0" {
        format!("-{whole}")
    } else {
        whole.to_owned()
    }
}

fn sql_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn decimal_value_string_rejects_invalid_database_amount() {
        assert_eq!(
            "12.300000",
            decimal_value_string("12.3", 6, "settlement amount").unwrap()
        );

        let unsupported = decimal_value_string("not-money", 6, "settlement amount")
            .expect_err("invalid settlement money must fail");
        assert!(
            unsupported
                .to_string()
                .contains("invalid settlement amount: not-money"),
            "{unsupported}"
        );
    }

    #[test]
    fn decimal_add_strings_rejects_invalid_database_amount() {
        let unsupported = decimal_add_strings("1.00", "not-money", 6)
            .expect_err("invalid settlement item cost must fail");
        assert!(
            unsupported
                .to_string()
                .contains("invalid settlement decimal addend: not-money"),
            "{unsupported}"
        );
    }

    #[test]
    fn model_list_rejects_invalid_database_json() {
        assert_eq!(
            vec!["gpt-4o".to_owned()],
            model_list(r#"["gpt-4o"]"#, "fallback").expect("valid model json")
        );

        let unsupported =
            model_list("not-json", "fallback").expect_err("invalid model json must fail");
        assert!(
            unsupported
                .to_string()
                .contains("invalid settlement model list json from database row"),
            "{unsupported}"
        );
    }

    #[test]
    fn breakdown_item_mut_rejects_unknown_modality_instead_of_falling_back_to_text() {
        let mut breakdown = SettlementBillBreakdown::default();
        let unsupported = breakdown_item_mut(&mut breakdown, 99)
            .expect_err("unknown settlement modality must fail closed");
        assert!(
            unsupported
                .to_string()
                .contains("unsupported settlement item modality: 99"),
            "{unsupported}"
        );
    }
}
