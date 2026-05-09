use sqlx::{PgPool, Row};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    AppMessageItem, AppMessagesReadFuture, AppMessagesReadStore, AppMessagesSubject,
};

const LOAD_MESSAGES: &str = r#"
SELECT
    CAST(m.id AS TEXT) AS id,
    COALESCE(NULLIF(m.title, ''), 'Untitled message') AS title,
    COALESCE(NULLIF(m.summary, ''), '') AS desc,
    COALESCE(NULLIF(m.content, ''), NULLIF(m.summary, ''), '') AS content,
    CAST(COALESCE(m.published_at, m.created_at) AS TEXT) AS time,
    m.message_type AS message_type,
    m.severity AS severity,
    d.id AS delivery_id,
    d.delivery_status AS delivery_status,
    CAST(d.read_at AS TEXT) AS read_at,
    CAST(d.delivered_at AS TEXT) AS delivered_at
FROM ops_notification_message m
LEFT JOIN ops_notification_delivery d
    ON d.message_id = m.id
   AND d.tenant_id = m.tenant_id
   AND d.organization_id = m.organization_id
   AND d.user_id = $3
   AND d.deleted_at IS NULL
   AND d.status = 1
WHERE m.status = 1
  AND m.deleted_at IS NULL
  AND m.tenant_id = $1
  AND m.organization_id = $2
  AND (m.published_at IS NULL OR m.published_at <= CURRENT_TIMESTAMP)
  AND (m.expire_at IS NULL OR m.expire_at > CURRENT_TIMESTAMP)
  AND (
      d.user_id = $3
      OR m.target_user_id = $3
      OR COALESCE(m.target_scope, 1) = 1
  )
ORDER BY
    CASE WHEN d.read_at IS NULL THEN 0 ELSE 1 END,
    COALESCE(m.published_at, m.created_at) DESC NULLS LAST,
    m.id DESC
LIMIT 100
"#;

#[derive(Debug, Clone)]
pub struct PostgresAppMessagesReadStore {
    pool: PgPool,
}

impl PostgresAppMessagesReadStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl AppMessagesReadStore for PostgresAppMessagesReadStore {
    fn load_messages<'a>(
        &'a self,
        subject: Option<AppMessagesSubject>,
    ) -> AppMessagesReadFuture<'a, Vec<AppMessageItem>> {
        Box::pin(async move {
            let subject = require_subject(subject)?;
            let rows = sqlx::query(LOAD_MESSAGES)
                .bind(subject.tenant_id)
                .bind(subject.organization_id)
                .bind(subject.user_id)
                .fetch_all(&self.pool)
                .await
                .map_err(sql_error)?;
            rows.into_iter().map(row_to_message).collect()
        })
    }
}

fn row_to_message(row: sqlx::postgres::PgRow) -> DomainResult<AppMessageItem> {
    let read_at = string_cell(&row, "read_at");
    let delivered_at = string_cell(&row, "delivered_at");
    let delivery_required = optional_integer_cell(&row, "delivery_id").is_some();
    let delivery_status = related_integer_cell(&row, "delivery_status", delivery_required)?;
    if let Some(delivery_status) = delivery_status {
        validate_delivery_status(delivery_status)?;
    }
    let summary = string_cell(&row, "desc");
    let content = string_cell(&row, "content");
    let message_type = message_type_label(required_integer_cell(&row, "message_type")?)?;
    let severity = required_integer_cell(&row, "severity")?;
    validate_message_severity(severity)?;
    let message_type = message_type_for_display(message_type, severity)?;

    Ok(AppMessageItem {
        id: string_cell(&row, "id"),
        title: string_cell(&row, "title"),
        desc: summary.clone(),
        content: if content.trim().is_empty() {
            summary
        } else {
            content
        },
        time: string_cell(&row, "time"),
        message_type,
        read: message_read_status(&read_at, &delivered_at, delivery_status),
    })
}

fn require_subject(subject: Option<AppMessagesSubject>) -> DomainResult<AppMessagesSubject> {
    subject.ok_or_else(|| DomainError::new("trusted request subject is required for app messages"))
}

fn message_read_status(read_at: &str, _delivered_at: &str, _delivery_status: Option<i64>) -> bool {
    !read_at.trim().is_empty()
}

fn string_cell(row: &sqlx::postgres::PgRow, column: &str) -> String {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .unwrap_or_default()
}

fn related_integer_cell(
    row: &sqlx::postgres::PgRow,
    column: &str,
    required: bool,
) -> DomainResult<Option<i64>> {
    let value = optional_integer_cell(row, column);
    if required && value.is_none() {
        if column == "delivery_status" {
            return Err(DomainError::new(
                "missing app message delivery_status from database row",
            ));
        }
        return Err(DomainError::new(format!(
            "missing app message {column} from database row"
        )));
    }
    Ok(value)
}

fn required_integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> DomainResult<i64> {
    optional_integer_cell(row, column).ok_or_else(|| missing_app_message_integer_cell_error(column))
}

fn missing_app_message_integer_cell_error(column: &str) -> DomainError {
    match column {
        "message_type" => DomainError::new("missing app message message_type from database row"),
        "severity" => DomainError::new("missing app message severity from database row"),
        value => DomainError::new(format!("missing app message {value} from database row")),
    }
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
        .or_else(|| string_cell(row, column).parse::<i64>().ok())
}

fn validate_delivery_status(value: i64) -> DomainResult<()> {
    match value {
        0..=5 => Ok(()),
        value => Err(DomainError::new(format!(
            "invalid app message delivery_status from database row: {value}"
        ))),
    }
}

fn message_type_label(message_type: i64) -> DomainResult<String> {
    match message_type {
        1 => Ok("info".to_owned()),
        2 => Ok("billing".to_owned()),
        3 => Ok("warning".to_owned()),
        4 => Ok("alert".to_owned()),
        value => Err(DomainError::new(format!(
            "invalid app message message_type from database row: {value}"
        ))),
    }
}

fn validate_message_severity(severity: i64) -> DomainResult<()> {
    match severity {
        1 | 2 | 3 | 4 => Ok(()),
        value => Err(DomainError::new(format!(
            "invalid app message severity from database row: {value}"
        ))),
    }
}

fn message_type_for_display(message_type: String, severity: i64) -> DomainResult<String> {
    match severity {
        4 => Ok("alert".to_owned()),
        3 => Ok("warning".to_owned()),
        1 | 2 => Ok(message_type),
        value => Err(DomainError::new(format!(
            "invalid app message severity from database row: {value}"
        ))),
    }
}

fn sql_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}
