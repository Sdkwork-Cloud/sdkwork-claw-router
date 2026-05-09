use sqlx::{Row, SqlitePool};

use crate::domain::DomainError;
use crate::ports::{
    AccountConsumptionItem, AccountInvoiceSettings, AccountLoginLog, AccountSecuritySummary,
    AccountSummaryReadFuture, AccountSummaryReadStore, AccountSummarySnapshot,
    AccountSummarySubject,
};

const LOAD_ACCOUNT_PROFILE: &str = r#"
SELECT
    CAST(u.id AS TEXT) AS user_id,
    COALESCE(NULLIF(u.nickname, ''), NULLIF(u.username, ''), 'User') AS name,
    COALESCE(u.email, '') AS email,
    COALESCE(o.name, '') AS organization,
    CAST(COALESCE(SUM(CASE WHEN a.account_type = 2 AND a.status = 1 THEN COALESCE(a.available_points, 0) ELSE 0 END), 0) AS TEXT) AS available_points
FROM plus_user u
LEFT JOIN plus_organization o
    ON o.tenant_id = ?1
   AND o.id = ?2
LEFT JOIN plus_account a
    ON a.tenant_id = ?1
   AND a.organization_id = ?2
   AND a.user_id = u.id
   AND a.owner_id = u.id
WHERE u.tenant_id = ?1
  AND u.organization_id = ?2
  AND u.id = ?3
GROUP BY u.id, u.nickname, u.username, u.email, o.name
LIMIT 1
"#;

const LOAD_MONTHLY_CONSUMPTION: &str = r#"
SELECT CAST(COALESCE(SUM(COALESCE(customer_charge_amount, cost_amount, 0)), 0) AS TEXT) AS monthly_consumption
FROM ai_usage_fact
WHERE status = 1
  AND tenant_id = ?1
  AND organization_id = ?2
  AND user_id = ?3
  AND occurred_at >= date('now', 'start of month')
"#;

const LOAD_CONSUMPTION_BY_SERVICE: &str = r#"
SELECT
    modality,
    CAST(COALESCE(SUM(COALESCE(customer_charge_amount, cost_amount, 0)), 0) AS TEXT) AS value
FROM ai_usage_fact
WHERE status = 1
  AND tenant_id = ?1
  AND organization_id = ?2
  AND user_id = ?3
  AND occurred_at >= date('now', 'start of month')
GROUP BY modality
ORDER BY modality ASC
"#;

const LOAD_INVOICE_SETTINGS: &str = r#"
SELECT
    COALESCE(NULLIF(title, ''), '') AS org_full,
    COALESCE(NULLIF(tax_no, ''), '') AS tax_id,
    COALESCE(NULLIF(bank_name, ''), '') AS payment_method,
    COALESCE(NULLIF(CAST(type AS TEXT), ''), NULLIF(title_type, ''), '') AS invoice_type
FROM plus_invoice
WHERE tenant_id = ?1
  AND organization_id = ?2
  AND user_id = ?3
ORDER BY updated_at DESC, id DESC
LIMIT 1
"#;

const LOAD_SECURITY: &str = r#"
SELECT
    mfa_enabled,
    COALESCE(trusted_device_count, 0) AS trusted_device_count
FROM iam_user_security_setting
WHERE tenant_id = ?1
  AND organization_id = ?2
  AND user_id = ?3
  AND deleted_at IS NULL
ORDER BY updated_at DESC, id DESC
LIMIT 1
"#;

const LOAD_LOGIN_LOGS: &str = r#"
SELECT
    COALESCE(NULLIF(client_ip_masked, ''), '-') AS ip,
    COALESCE(NULLIF(client_ip_region, ''), '-') AS location,
    COALESCE(NULLIF(device_label, ''), '-') AS device,
    CAST(COALESCE(occurred_at, created_at) AS TEXT) AS time,
    login_result,
    risk_level
FROM iam_user_login_event
WHERE tenant_id = ?1
  AND organization_id = ?2
  AND user_id = ?3
ORDER BY COALESCE(occurred_at, created_at) DESC, id DESC
LIMIT 5
"#;

pub struct SqliteAccountSummaryReadStore {
    pool: SqlitePool,
}

impl SqliteAccountSummaryReadStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl AccountSummaryReadStore for SqliteAccountSummaryReadStore {
    fn load_account_summary<'a>(
        &'a self,
        subject: Option<AccountSummarySubject>,
    ) -> AccountSummaryReadFuture<'a> {
        Box::pin(async move {
            let subject = subject.ok_or_else(|| {
                DomainError::new("trusted request subject is required for account summary")
            })?;
            load_account_summary(&self.pool, subject).await
        })
    }
}

async fn load_account_summary(
    pool: &SqlitePool,
    subject: AccountSummarySubject,
) -> Result<AccountSummarySnapshot, DomainError> {
    let profile = load_profile(pool, subject).await?;
    let monthly_consumption = load_monthly_consumption(pool, subject).await?;
    let consumption_by_service = load_consumption_by_service(pool, subject).await?;
    let invoice_settings = load_invoice_settings(pool, subject).await?;
    let security = load_security(pool, subject).await?;
    let login_logs = load_login_logs(pool, subject).await?;
    let is_verified = !invoice_settings.org_full.is_empty() || !invoice_settings.tax_id.is_empty();

    Ok(AccountSummarySnapshot {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        is_verified,
        tier: "Standard".to_owned(),
        organization: profile.organization,
        available_credits: profile.available_points,
        est_days_remaining: estimate_days_remaining(profile.available_points, monthly_consumption),
        monthly_consumption,
        consumption_by_service,
        invoice_settings,
        security,
        login_logs,
    })
}

#[derive(Debug, Clone)]
struct AccountProfile {
    id: String,
    name: String,
    email: String,
    organization: String,
    available_points: f64,
}

async fn load_profile(
    pool: &SqlitePool,
    subject: AccountSummarySubject,
) -> Result<AccountProfile, DomainError> {
    let row = sqlx::query(LOAD_ACCOUNT_PROFILE)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .fetch_optional(pool)
        .await
        .map_err(sql_error)?;

    Ok(row
        .as_ref()
        .map(|row| AccountProfile {
            id: string_cell(row, "user_id"),
            name: string_cell(row, "name"),
            email: string_cell(row, "email"),
            organization: string_cell(row, "organization"),
            available_points: decimal_cell(row, "available_points"),
        })
        .unwrap_or_else(|| AccountProfile {
            id: subject.user_id.to_string(),
            name: String::new(),
            email: String::new(),
            organization: String::new(),
            available_points: 0.0,
        }))
}

async fn load_monthly_consumption(
    pool: &SqlitePool,
    subject: AccountSummarySubject,
) -> Result<f64, DomainError> {
    let row = sqlx::query(LOAD_MONTHLY_CONSUMPTION)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .fetch_one(pool)
        .await
        .map_err(sql_error)?;
    Ok(decimal_cell(&row, "monthly_consumption"))
}

async fn load_consumption_by_service(
    pool: &SqlitePool,
    subject: AccountSummarySubject,
) -> Result<Vec<AccountConsumptionItem>, DomainError> {
    let rows = sqlx::query(LOAD_CONSUMPTION_BY_SERVICE)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .fetch_all(pool)
        .await
        .map_err(sql_error)?;
    let mut items: Vec<AccountConsumptionItem> = rows
        .iter()
        .map(|row| {
            let modality = optional_integer_cell(row, "modality");
            AccountConsumptionItem {
                name: modality_label(modality).to_owned(),
                value: decimal_cell(row, "value"),
                color: modality_color(modality).to_owned(),
                percentage: 0.0,
            }
        })
        .collect();
    apply_percentages(&mut items);
    Ok(items)
}

async fn load_invoice_settings(
    pool: &SqlitePool,
    subject: AccountSummarySubject,
) -> Result<AccountInvoiceSettings, DomainError> {
    let row = sqlx::query(LOAD_INVOICE_SETTINGS)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .fetch_optional(pool)
        .await
        .map_err(sql_error)?;

    Ok(row
        .as_ref()
        .map(|row| AccountInvoiceSettings {
            org_full: string_cell(row, "org_full"),
            tax_id: string_cell(row, "tax_id"),
            payment_method: string_cell(row, "payment_method"),
            invoice_type: invoice_type_label(&string_cell(row, "invoice_type")).to_owned(),
        })
        .unwrap_or_default())
}

async fn load_security(
    pool: &SqlitePool,
    subject: AccountSummarySubject,
) -> Result<AccountSecuritySummary, DomainError> {
    let row = sqlx::query(LOAD_SECURITY)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .fetch_optional(pool)
        .await
        .map_err(sql_error)?;

    Ok(row
        .as_ref()
        .map(|row| AccountSecuritySummary {
            mfa_enabled: bool_cell(row, "mfa_enabled"),
            qps_limit: 0,
            ip_whitelist_count: integer_cell(row, "trusted_device_count"),
        })
        .unwrap_or_default())
}

async fn load_login_logs(
    pool: &SqlitePool,
    subject: AccountSummarySubject,
) -> Result<Vec<AccountLoginLog>, DomainError> {
    let rows = sqlx::query(LOAD_LOGIN_LOGS)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .fetch_all(pool)
        .await
        .map_err(sql_error)?;

    Ok(rows
        .iter()
        .map(|row| AccountLoginLog {
            ip: string_cell(row, "ip"),
            location: string_cell(row, "location"),
            device: string_cell(row, "device"),
            time: string_cell(row, "time"),
            status: login_status(
                optional_integer_cell(row, "login_result"),
                optional_integer_cell(row, "risk_level"),
            )
            .to_owned(),
        })
        .collect())
}

fn estimate_days_remaining(available_credits: f64, monthly_consumption: f64) -> i64 {
    if available_credits <= 0.0 || monthly_consumption <= 0.0 {
        return 0;
    }
    let daily_average = monthly_consumption / 30.0;
    (available_credits / daily_average).floor().max(0.0) as i64
}

fn apply_percentages(items: &mut [AccountConsumptionItem]) {
    let total: f64 = items.iter().map(|item| item.value).sum();
    if total <= 0.0 {
        return;
    }
    for item in items {
        item.percentage = ((item.value / total) * 100.0).clamp(0.0, 100.0);
    }
}

fn modality_label(value: Option<i64>) -> &'static str {
    match value {
        Some(1) => "Text",
        Some(2) => "Image",
        Some(3) => "Video",
        Some(4) => "Audio",
        Some(5) => "Music",
        None => "Unknown",
        Some(_) => "Unknown",
    }
}

fn modality_color(value: Option<i64>) -> &'static str {
    match value {
        Some(1) => "bg-emerald-500",
        Some(2) => "bg-blue-500",
        Some(3) => "bg-violet-500",
        Some(4) => "bg-amber-500",
        Some(5) => "bg-pink-500",
        None => "bg-slate-500",
        Some(_) => "bg-slate-500",
    }
}

fn invoice_type_label(value: &str) -> &'static str {
    match value.to_ascii_uppercase().as_str() {
        "SPECIAL" | "2" => "SPECIAL",
        "ELECTRONIC" | "3" => "ELECTRONIC",
        "PAPER" | "4" => "PAPER",
        "NORMAL" | "1" => "NORMAL",
        _ => "",
    }
}

fn login_status(login_result: Option<i64>, risk_level: Option<i64>) -> &'static str {
    match (login_result, risk_level) {
        (Some(1), Some(0..=2)) => "success",
        _ => "warning",
    }
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

fn optional_integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<i64> {
    row.try_get::<Option<i64>, _>(column)
        .ok()
        .flatten()
        .or_else(|| {
            string_cell(row, column)
                .parse::<f64>()
                .ok()
                .map(|value| value as i64)
        })
}

fn decimal_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> f64 {
    row.try_get::<Option<f64>, _>(column)
        .ok()
        .flatten()
        .or_else(|| string_cell(row, column).parse::<f64>().ok())
        .unwrap_or(0.0)
}

fn bool_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> bool {
    row.try_get::<Option<bool>, _>(column)
        .ok()
        .flatten()
        .or_else(|| optional_integer_cell(row, column).map(|value| value != 0))
        .unwrap_or(false)
}

fn sql_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn consumption_modality_reports_unknown_instead_of_defaulting_to_text() {
        assert_eq!("Text", modality_label(Some(1)));
        assert_eq!("Image", modality_label(Some(2)));
        assert_eq!("Unknown", modality_label(None));
        assert_eq!("Unknown", modality_label(Some(99)));
        assert_eq!("bg-emerald-500", modality_color(Some(1)));
        assert_eq!("bg-blue-500", modality_color(Some(2)));
        assert_eq!("bg-slate-500", modality_color(None));
        assert_eq!("bg-slate-500", modality_color(Some(99)));
    }

    #[test]
    fn account_login_status_fails_closed_for_missing_or_unknown_values() {
        assert_eq!("success", login_status(Some(1), Some(0)));
        assert_eq!("success", login_status(Some(1), Some(2)));
        assert_eq!("warning", login_status(Some(2), Some(0)));
        assert_eq!("warning", login_status(Some(1), Some(3)));
        assert_eq!("warning", login_status(None, Some(0)));
        assert_eq!("warning", login_status(Some(1), None));
        assert_eq!("warning", login_status(Some(99), Some(0)));
    }
}
