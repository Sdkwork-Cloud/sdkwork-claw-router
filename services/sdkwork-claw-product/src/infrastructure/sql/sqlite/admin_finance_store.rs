use sqlx::{Row, SqlitePool};

use crate::domain::{DecimalValue, DomainError};
use crate::ports::{
    AdminBillingRecordItem, AdminFinanceReadFuture, AdminFinanceStore, AdminTransactionRecordItem,
    ListAdminBillingRecordsQuery, ListAdminTransactionsQuery,
};

const LIST_ADMIN_TRANSACTIONS: &str = r#"
WITH ledger_entries AS (
    SELECT
        'ledger-' || CAST(h.id AS TEXT) AS id,
        CAST(COALESCE(h.created_at, h.updated_at) AS TEXT) AS occurred_at,
        CAST(COALESCE(a.user_id, o.user_id, 0) AS TEXT) AS user_id,
        CASE
            WHEN h.transaction_type IN (1, 21, 31) THEN 'recharge'
            WHEN h.transaction_type IN (3, 26, 33) THEN 'refund'
            WHEN CAST(COALESCE(NULLIF(CAST(h.amount AS TEXT), ''), '0') AS REAL) > 0 OR COALESCE(h.points_change, 0) > 0 THEN 'recharge'
            ELSE 'consume'
        END AS normalized_type,
        CASE
            WHEN ABS(CAST(COALESCE(NULLIF(CAST(h.amount AS TEXT), ''), '0') AS REAL)) > 0 THEN CAST(h.amount AS TEXT)
            WHEN COALESCE(h.points_change, 0) != 0 THEN CAST(h.points_change AS TEXT)
            ELSE '0'
        END AS amount,
        CASE
            WHEN CAST(COALESCE(NULLIF(CAST(h.balance_after AS TEXT), ''), '0') AS REAL) != 0 THEN CAST(h.balance_after AS TEXT)
            WHEN COALESCE(h.points_after, 0) != 0 THEN CAST(h.points_after AS TEXT)
            ELSE '0'
        END AS balance,
        COALESCE(
            NULLIF(h.remarks, ''),
            NULLIF(r.remark, ''),
            NULLIF(p.remark, ''),
            NULLIF(p.subject, ''),
            NULLIF(o.remark, ''),
            NULLIF(o.subject, ''),
            NULLIF(h.transaction_id, ''),
            'Account ledger entry'
        ) AS description,
        CASE
            WHEN h.status IS NOT NULL THEN 'transaction'
            WHEN p.status IS NOT NULL THEN 'payment'
            WHEN r.status IS NOT NULL THEN 'refund'
            WHEN o.status IS NOT NULL THEN 'order'
            ELSE 'transaction'
        END AS status_source,
        h.status AS transaction_status_code,
        p.status AS payment_status_code,
        r.status AS refund_status_code,
        o.status AS order_status_code,
        CASE
            WHEN h.status IS NOT NULL AND h.status IN (0, 1) THEN 'pending'
            WHEN h.status IS NOT NULL AND h.status = 2 THEN 'success'
            WHEN h.status IS NOT NULL AND h.status IN (3, 4) THEN 'failed'
            WHEN p.status IS NOT NULL AND p.status IN (0, 1) THEN 'pending'
            WHEN p.status IS NOT NULL AND p.status = 2 THEN 'success'
            WHEN p.status IS NOT NULL AND p.status IN (3, 4, 5) THEN 'failed'
            WHEN r.status IS NOT NULL AND r.status IN (0, 1) THEN 'pending'
            WHEN r.status IS NOT NULL AND r.status = 2 THEN 'success'
            WHEN r.status IS NOT NULL AND r.status IN (3, 4, 5) THEN 'failed'
            WHEN o.status IS NOT NULL AND o.status IN (0, 1, 6) THEN 'pending'
            WHEN o.status IS NOT NULL AND o.status IN (2, 3, 4, 7, 8) THEN 'success'
            WHEN o.status IS NOT NULL AND o.status = 5 THEN 'failed'
            WHEN h.status IS NULL AND p.status IS NULL AND r.status IS NULL AND o.status IS NULL THEN '__unsupported__'
            ELSE '__unsupported__'
        END AS normalized_status
    FROM plus_account_history h
    LEFT JOIN plus_account a
      ON a.id = h.account_id
     AND a.tenant_id = h.tenant_id
     AND a.organization_id = h.organization_id
    LEFT JOIN plus_order o
      ON o.tenant_id = h.tenant_id
     AND o.organization_id = h.organization_id
     AND (
        CAST(o.id AS TEXT) = h.source_id
        OR o.transaction_id = h.transaction_id
        OR o.out_trade_no = h.transaction_id
     )
    LEFT JOIN plus_payment p
      ON p.tenant_id = h.tenant_id
     AND p.organization_id = h.organization_id
     AND (
        p.order_id = o.id
        OR p.transaction_id = h.transaction_id
        OR p.out_trade_no = h.transaction_id
     )
    LEFT JOIN plus_refund r
      ON r.tenant_id = h.tenant_id
     AND r.organization_id = h.organization_id
     AND (
        CAST(r.id AS TEXT) = h.source_id
        OR r.refund_id = h.transaction_id
        OR r.out_refund_no = h.transaction_id
     )
    WHERE h.tenant_id = ?1
      AND h.organization_id = ?2

    UNION ALL

    SELECT
        'vip-point-' || CAST(v.id AS TEXT) AS id,
        CAST(COALESCE(v.created_at, v.updated_at) AS TEXT) AS occurred_at,
        CAST(v.user_id AS TEXT) AS user_id,
        CASE
            WHEN r.id IS NOT NULL OR UPPER(COALESCE(v.source_type, '')) LIKE '%REFUND%' THEN 'refund'
            WHEN v.change_amount > 0 THEN 'recharge'
            ELSE 'consume'
        END AS normalized_type,
        CAST(v.change_amount AS TEXT) AS amount,
        CAST(v.after_balance AS TEXT) AS balance,
        COALESCE(
            NULLIF(v.remark, ''),
            NULLIF(r.remark, ''),
            NULLIF(p.remark, ''),
            NULLIF(p.subject, ''),
            NULLIF(o.remark, ''),
            NULLIF(o.subject, ''),
            'VIP point change'
        ) AS description,
        CASE
            WHEN r.status IS NOT NULL THEN 'refund'
            WHEN p.status IS NOT NULL THEN 'payment'
            WHEN o.status IS NOT NULL THEN 'order'
            ELSE 'vip_point'
        END AS status_source,
        CAST(NULL AS INTEGER) AS transaction_status_code,
        p.status AS payment_status_code,
        r.status AS refund_status_code,
        o.status AS order_status_code,
        CASE
            WHEN r.status IS NOT NULL AND r.status IN (0, 1) THEN 'pending'
            WHEN r.status IS NOT NULL AND r.status = 2 THEN 'success'
            WHEN r.status IS NOT NULL AND r.status IN (3, 4, 5) THEN 'failed'
            WHEN p.status IS NOT NULL AND p.status IN (0, 1) THEN 'pending'
            WHEN p.status IS NOT NULL AND p.status = 2 THEN 'success'
            WHEN p.status IS NOT NULL AND p.status IN (3, 4, 5) THEN 'failed'
            WHEN o.status IS NOT NULL AND o.status IN (0, 1, 6) THEN 'pending'
            WHEN o.status IS NOT NULL AND o.status IN (2, 3, 4, 7, 8) THEN 'success'
            WHEN o.status IS NOT NULL AND o.status = 5 THEN 'failed'
            WHEN r.status IS NULL AND p.status IS NULL AND o.status IS NULL THEN 'success'
            ELSE '__unsupported__'
        END AS normalized_status
    FROM plus_vip_point_change v
    LEFT JOIN plus_order o
      ON o.tenant_id = v.tenant_id
     AND o.organization_id = v.organization_id
     AND o.id = v.source_id
    LEFT JOIN plus_payment p
      ON p.tenant_id = v.tenant_id
     AND p.organization_id = v.organization_id
     AND p.order_id = o.id
    LEFT JOIN plus_refund r
      ON r.tenant_id = v.tenant_id
     AND r.organization_id = v.organization_id
     AND r.order_id = o.id
    WHERE v.tenant_id = ?1
      AND v.organization_id = ?2
      AND NOT EXISTS (
          SELECT 1
          FROM plus_account_history h
          WHERE h.tenant_id = v.tenant_id
            AND h.organization_id = v.organization_id
            AND h.source_id = CAST(v.source_id AS TEXT)
            AND COALESCE(h.points_change, 0) = v.change_amount
      )
),
filtered_entries AS (
    SELECT *
    FROM ledger_entries
    WHERE (?3 IS NULL OR id LIKE ('%' || ?3 || '%') OR user_id LIKE ('%' || ?3 || '%') OR description LIKE ('%' || ?3 || '%'))
      AND (?4 IS NULL OR normalized_status = ?4 OR normalized_status = '__unsupported__')
      AND (?5 IS NULL OR occurred_at >= ?5)
      AND (?6 IS NULL OR occurred_at <= ?6)
)
SELECT id, occurred_at, user_id, normalized_type, amount, balance, description, status_source, transaction_status_code, payment_status_code, refund_status_code, order_status_code, normalized_status
FROM filtered_entries
ORDER BY occurred_at DESC, id DESC
LIMIT ?7 OFFSET ?8
"#;

const LIST_ADMIN_BILLING_RECORDS: &str = r#"
WITH billing_entries AS (
    SELECT
        COALESCE(NULLIF(s.statement_no, ''), 'statement-' || CAST(s.id AS TEXT)) AS id,
        CAST(COALESCE(s.owner_id, pi.user_id, 0) AS TEXT) AS user_id,
        COALESCE(NULLIF(s.period, ''), substr(CAST(s.period_start AS TEXT), 1, 7), '-') AS period,
        COALESCE(s.total_tokens, 0) AS total_tokens,
        CAST(COALESCE(s.total_cost, pi.total_amount, '0') AS TEXT) AS total_cost,
        s.payment_status AS payment_status_code,
        s.statement_status AS statement_status_code,
        pi.id AS invoice_id,
        pi.status AS invoice_status_code,
        CASE
            WHEN s.payment_status IS NULL OR s.statement_status IS NULL THEN '__unsupported__'
            WHEN s.payment_status NOT IN (0, 1, 2, 3, 4, 5) OR s.statement_status NOT IN (0, 1, 2, 3, 4, 5) THEN '__unsupported__'
            WHEN pi.id IS NOT NULL AND (pi.status IS NULL OR pi.status NOT IN (0, 1, 2, 3, 4, 5)) THEN '__unsupported__'
            WHEN s.payment_status = 2 OR s.statement_status = 2 OR pi.status = 2 THEN 'paid'
            WHEN s.payment_status = 3 OR s.statement_status = 3 THEN 'overdue'
            WHEN s.payment_status IN (0, 1, 4, 5)
             AND s.statement_status IN (0, 1, 4, 5)
             AND (pi.id IS NULL OR pi.status IN (0, 1, 4, 5)) THEN 'unpaid'
            ELSE '__unsupported__'
        END AS normalized_status,
        CAST(COALESCE(s.due_at, pi.invoice_time, s.period_end, s.updated_at, s.created_at) AS TEXT) AS due_date,
        CAST(COALESCE(s.period_end, s.updated_at, s.created_at) AS TEXT) AS sort_time,
        COUNT(DISTINCT us.id) AS settlement_count
    FROM commerce_usage_statement s
    LEFT JOIN plus_invoice pi
      ON pi.id = s.invoice_id
     AND pi.tenant_id = s.tenant_id
     AND pi.organization_id = s.organization_id
    LEFT JOIN commerce_usage_settlement us
      ON us.status = 1
     AND us.tenant_id = s.tenant_id
     AND us.organization_id = s.organization_id
     AND us.created_at >= s.period_start
     AND us.created_at <= s.period_end
    WHERE s.status = 1
      AND s.tenant_id = ?1
      AND s.organization_id = ?2
    GROUP BY
        s.id,
        s.statement_no,
        s.owner_id,
        s.period,
        s.period_start,
        s.period_end,
        s.total_tokens,
        s.total_cost,
        s.payment_status,
        s.statement_status,
        s.due_at,
        s.updated_at,
        s.created_at,
        pi.user_id,
        pi.total_amount,
        pi.id,
        pi.status,
        pi.invoice_time
),
filtered_entries AS (
    SELECT *
    FROM billing_entries
    WHERE (?3 IS NULL OR id LIKE ('%' || ?3 || '%') OR user_id LIKE ('%' || ?3 || '%') OR period LIKE ('%' || ?3 || '%'))
      AND (?4 IS NULL OR normalized_status = ?4 OR normalized_status = '__unsupported__')
      AND (?5 IS NULL OR sort_time >= ?5)
      AND (?6 IS NULL OR sort_time <= ?6)
)
SELECT id, user_id, period, total_tokens, total_cost, payment_status_code, statement_status_code, invoice_id, invoice_status_code, normalized_status, due_date
FROM filtered_entries
ORDER BY sort_time DESC, id DESC
LIMIT ?7 OFFSET ?8
"#;

#[derive(Debug, Clone)]
pub struct SqliteAdminFinanceStore {
    pool: SqlitePool,
}

impl SqliteAdminFinanceStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl AdminFinanceStore for SqliteAdminFinanceStore {
    fn list_transactions<'a>(
        &'a self,
        query: ListAdminTransactionsQuery,
    ) -> AdminFinanceReadFuture<'a, Vec<AdminTransactionRecordItem>> {
        Box::pin(async move { list_transactions(&self.pool, query).await })
    }

    fn list_billing_records<'a>(
        &'a self,
        query: ListAdminBillingRecordsQuery,
    ) -> AdminFinanceReadFuture<'a, Vec<AdminBillingRecordItem>> {
        Box::pin(async move { list_billing_records(&self.pool, query).await })
    }
}

async fn list_transactions(
    pool: &SqlitePool,
    query: ListAdminTransactionsQuery,
) -> Result<Vec<AdminTransactionRecordItem>, DomainError> {
    let rows = sqlx::query(LIST_ADMIN_TRANSACTIONS)
        .bind(query.subject.tenant_id)
        .bind(query.subject.organization_id)
        .bind(query.keyword.as_deref())
        .bind(query.status.as_deref())
        .bind(query.start_time.as_deref())
        .bind(query.end_time.as_deref())
        .bind(query.page_size)
        .bind(offset(query.page_no, query.page_size))
        .fetch_all(pool)
        .await
        .map_err(sql_error)?;

    rows.into_iter().map(row_to_transaction).collect()
}

async fn list_billing_records(
    pool: &SqlitePool,
    query: ListAdminBillingRecordsQuery,
) -> Result<Vec<AdminBillingRecordItem>, DomainError> {
    let rows = sqlx::query(LIST_ADMIN_BILLING_RECORDS)
        .bind(query.subject.tenant_id)
        .bind(query.subject.organization_id)
        .bind(query.keyword.as_deref())
        .bind(query.status.as_deref())
        .bind(query.start_time.as_deref())
        .bind(query.end_time.as_deref())
        .bind(query.page_size)
        .bind(offset(query.page_no, query.page_size))
        .fetch_all(pool)
        .await
        .map_err(sql_error)?;

    rows.into_iter().map(row_to_billing_record).collect()
}

fn row_to_transaction(
    row: sqlx::sqlite::SqliteRow,
) -> Result<AdminTransactionRecordItem, DomainError> {
    let status_source = string_cell(&row, "status_source");
    let status_code = transaction_status_cell(&row, &status_source)?;
    Ok(AdminTransactionRecordItem {
        id: string_cell(&row, "id"),
        time: string_cell(&row, "occurred_at"),
        user_id: string_cell(&row, "user_id"),
        transaction_type: string_cell(&row, "normalized_type"),
        amount: decimal_string_cell(&row, "amount", 2, "admin finance transaction amount")?,
        balance: decimal_string_cell(&row, "balance", 2, "admin finance transaction balance")?,
        description: string_cell(&row, "description"),
        status: transaction_status_label(&status_source, status_code)?.to_owned(),
    })
}

fn row_to_billing_record(
    row: sqlx::sqlite::SqliteRow,
) -> Result<AdminBillingRecordItem, DomainError> {
    Ok(AdminBillingRecordItem {
        id: string_cell(&row, "id"),
        user_id: string_cell(&row, "user_id"),
        period: string_cell(&row, "period"),
        total_tokens: integer_cell(&row, "total_tokens"),
        total_cost: decimal_string_cell(&row, "total_cost", 2, "admin finance billing total cost")?,
        status: billing_status_label(
            required_billing_status_cell(&row, "payment_status_code", "payment")?,
            required_billing_status_cell(&row, "statement_status_code", "statement")?,
            related_billing_status_cell(&row, "invoice_id", "invoice_status_code", "invoice")?,
        )?
        .to_owned(),
        due_date: string_cell(&row, "due_date"),
    })
}

fn offset(page_no: i64, page_size: i64) -> i64 {
    (page_no - 1) * page_size
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

fn required_billing_status_cell(
    row: &sqlx::sqlite::SqliteRow,
    column: &str,
    source: &str,
) -> Result<i64, DomainError> {
    let status =
        optional_integer_cell(row, column).ok_or_else(|| missing_billing_status_error(source))?;
    ensure_billing_status(source, status)?;
    Ok(status)
}

fn transaction_status_cell(
    row: &sqlx::sqlite::SqliteRow,
    source: &str,
) -> Result<Option<i64>, DomainError> {
    match source {
        "transaction" => {
            required_transaction_status_cell(row, "transaction_status_code", source).map(Some)
        }
        "payment" => required_transaction_status_cell(row, "payment_status_code", source).map(Some),
        "refund" => required_transaction_status_cell(row, "refund_status_code", source).map(Some),
        "order" => required_transaction_status_cell(row, "order_status_code", source).map(Some),
        "vip_point" => Ok(None),
        value => Err(DomainError::new(format!(
            "unsupported admin finance transaction status source: {value}"
        ))),
    }
}

fn required_transaction_status_cell(
    row: &sqlx::sqlite::SqliteRow,
    column: &str,
    source: &str,
) -> Result<i64, DomainError> {
    optional_integer_cell(row, column).ok_or_else(|| missing_transaction_status_error(source))
}

fn related_billing_status_cell(
    row: &sqlx::sqlite::SqliteRow,
    relation_column: &str,
    column: &str,
    source: &str,
) -> Result<i64, DomainError> {
    if !related_cell_present(row, relation_column) {
        return Ok(0);
    }
    required_billing_status_cell(row, column, source)
}

fn related_cell_present(row: &sqlx::sqlite::SqliteRow, column: &str) -> bool {
    if row
        .try_get::<Option<i64>, _>(column)
        .ok()
        .flatten()
        .is_some()
    {
        return true;
    }
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .map(|value| !value.trim().is_empty())
        .unwrap_or(false)
}

fn optional_integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<i64> {
    row.try_get::<Option<i64>, _>(column)
        .ok()
        .flatten()
        .or_else(|| string_cell(row, column).trim().parse::<i64>().ok())
}

fn decimal_string_cell(
    row: &sqlx::sqlite::SqliteRow,
    column: &str,
    digits: u32,
    field_name: &str,
) -> Result<String, DomainError> {
    let value = string_cell(row, column).replace(',', "");
    decimal_value_string(value.trim().trim_start_matches('$'), digits, field_name)
}

fn decimal_value_string(value: &str, digits: u32, field_name: &str) -> Result<String, DomainError> {
    DecimalValue::parse(value)
        .map(|amount| amount.to_fixed_string(digits))
        .map_err(|_| DomainError::new(format!("invalid {field_name}: {value}")))
}

fn transaction_status_label(
    source: &str,
    status: Option<i64>,
) -> Result<&'static str, DomainError> {
    match source {
        "vip_point" => match status {
            None => Ok("success"),
            Some(value) => Err(unsupported_transaction_status(source, value)),
        },
        "transaction" => match status {
            Some(0 | 1) => Ok("pending"),
            Some(2) => Ok("success"),
            Some(3 | 4) => Ok("failed"),
            Some(value) => Err(unsupported_transaction_status(source, value)),
            None => Err(missing_transaction_status_error(source)),
        },
        "payment" => match status {
            Some(0 | 1) => Ok("pending"),
            Some(2) => Ok("success"),
            Some(3..=5) => Ok("failed"),
            Some(value) => Err(unsupported_transaction_status(source, value)),
            None => Err(missing_transaction_status_error(source)),
        },
        "refund" => match status {
            Some(0 | 1) => Ok("pending"),
            Some(2) => Ok("success"),
            Some(3..=5) => Ok("failed"),
            Some(value) => Err(unsupported_transaction_status(source, value)),
            None => Err(missing_transaction_status_error(source)),
        },
        "order" => match status {
            Some(0 | 1 | 6) => Ok("pending"),
            Some(2 | 3 | 4 | 7 | 8) => Ok("success"),
            Some(5) => Ok("failed"),
            Some(value) => Err(unsupported_transaction_status(source, value)),
            None => Err(missing_transaction_status_error(source)),
        },
        value => Err(DomainError::new(format!(
            "unsupported admin finance transaction status source: {value}"
        ))),
    }
}

fn billing_status_label(
    payment_status: i64,
    statement_status: i64,
    invoice_status: i64,
) -> Result<&'static str, DomainError> {
    ensure_billing_status("payment", payment_status)?;
    ensure_billing_status("statement", statement_status)?;
    ensure_billing_status("invoice", invoice_status)?;
    if payment_status == 2 || statement_status == 2 || invoice_status == 2 {
        Ok("paid")
    } else if payment_status == 3 || statement_status == 3 {
        Ok("overdue")
    } else {
        Ok("unpaid")
    }
}

fn ensure_billing_status(source: &str, status: i64) -> Result<(), DomainError> {
    match status {
        0..=5 => Ok(()),
        value => Err(DomainError::new(format!(
            "unsupported admin finance billing status {source}={value}"
        ))),
    }
}

fn missing_billing_status_error(source: &str) -> DomainError {
    match source {
        "payment" => DomainError::new("missing admin finance billing status payment"),
        "statement" => DomainError::new("missing admin finance billing status statement"),
        "invoice" => DomainError::new("missing admin finance billing status invoice"),
        value => DomainError::new(format!("missing admin finance billing status {value}")),
    }
}

fn missing_transaction_status_error(source: &str) -> DomainError {
    DomainError::new(format!("missing admin finance transaction status {source}"))
}

fn unsupported_transaction_status(source: &str, status: i64) -> DomainError {
    DomainError::new(format!(
        "unsupported admin finance transaction status {source}={status}"
    ))
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
            decimal_value_string("12.3", 6, "admin finance amount").unwrap()
        );

        let unsupported = decimal_value_string("not-money", 2, "admin finance amount")
            .expect_err("invalid finance money must fail");
        assert!(
            unsupported
                .to_string()
                .contains("invalid admin finance amount: not-money"),
            "{unsupported}"
        );
    }

    #[test]
    fn transaction_status_label_rejects_unknown_database_status() {
        assert_eq!(
            "pending",
            transaction_status_label("transaction", Some(0)).unwrap()
        );
        assert_eq!(
            "pending",
            transaction_status_label("transaction", Some(1)).unwrap()
        );
        assert_eq!(
            "success",
            transaction_status_label("transaction", Some(2)).unwrap()
        );
        assert_eq!(
            "failed",
            transaction_status_label("transaction", Some(3)).unwrap()
        );
        assert_eq!(
            "failed",
            transaction_status_label("transaction", Some(4)).unwrap()
        );
        assert_eq!(
            "failed",
            transaction_status_label("payment", Some(5)).unwrap()
        );
        assert_eq!(
            "pending",
            transaction_status_label("order", Some(6)).unwrap()
        );
        assert_eq!(
            "success",
            transaction_status_label("order", Some(8)).unwrap()
        );
        assert_eq!(
            "failed",
            transaction_status_label("refund", Some(5)).unwrap()
        );
        assert_eq!(
            "success",
            transaction_status_label("vip_point", None).unwrap()
        );

        let unsupported = transaction_status_label("payment", Some(99))
            .expect_err("unknown transaction status must fail");
        assert!(
            unsupported
                .to_string()
                .contains("unsupported admin finance transaction status payment=99"),
            "{unsupported}"
        );

        let missing = transaction_status_label("payment", None)
            .expect_err("missing transaction status must fail");
        assert!(
            missing
                .to_string()
                .contains("missing admin finance transaction status payment"),
            "{missing}"
        );
    }

    #[test]
    fn billing_status_label_rejects_unknown_database_status() {
        assert_eq!("paid", billing_status_label(2, 0, 0).unwrap());
        assert_eq!("paid", billing_status_label(0, 2, 0).unwrap());
        assert_eq!("paid", billing_status_label(0, 0, 2).unwrap());
        assert_eq!("overdue", billing_status_label(3, 0, 0).unwrap());
        assert_eq!("overdue", billing_status_label(0, 3, 0).unwrap());
        assert_eq!("unpaid", billing_status_label(0, 0, 0).unwrap());
        assert_eq!("unpaid", billing_status_label(1, 1, 1).unwrap());

        let unsupported =
            billing_status_label(99, 0, 0).expect_err("unknown billing status must fail");
        assert!(
            unsupported
                .to_string()
                .contains("unsupported admin finance billing status payment=99"),
            "{unsupported}"
        );
    }
}
