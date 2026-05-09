use sqlx::{PgPool, Row};

use crate::domain::{DecimalValue, DomainError};
use crate::ports::{CheckoutReadFuture, CheckoutStatusSnapshot, CheckoutStore, CheckoutSubject};

const LOAD_CHECKOUT_STATUS: &str = r#"
SELECT
    o.id AS order_id,
    p.id AS payment_id,
    vr.id AS recharge_id,
    COALESCE(NULLIF(o.order_sn, ''), NULLIF(o.out_trade_no, ''), NULLIF(p.out_trade_no, ''), '-') AS order_no,
    COALESCE(NULLIF(p.out_trade_no, ''), NULLIF(o.out_trade_no, ''), NULLIF(o.order_sn, ''), '-') AS out_trade_no,
    CAST(COALESCE(p.amount, o.total_amount, o.paid_amount, 0) AS TEXT) AS amount,
    CAST(COALESCE(vr.point_amount, o.paid_points_amount, 0) AS TEXT) AS points,
    COALESCE(NULLIF(o.payment_method, ''), NULLIF(CAST(p.channel AS TEXT), ''), NULLIF(CAST(p.provider AS TEXT), ''), '-') AS payment_method,
    o.status AS order_status,
    p.status AS payment_status,
    vr.status AS recharge_status,
    CAST(COALESCE(o.created_at, p.created_at, vr.created_at) AS TEXT) AS created_at,
    CAST(COALESCE(p.expire_time, o.payment_expire_time) AS TEXT) AS expires_at,
    CAST(COALESCE(p.success_time, o.pay_success_time) AS TEXT) AS paid_at
FROM plus_order o
LEFT JOIN plus_payment p
    ON p.tenant_id = o.tenant_id
   AND p.organization_id = o.organization_id
   AND (
        p.order_id = o.id
        OR p.out_trade_no = o.out_trade_no
        OR p.out_trade_no = o.order_sn
   )
LEFT JOIN plus_vip_recharge vr
    ON vr.tenant_id = o.tenant_id
   AND vr.organization_id = o.organization_id
   AND vr.user_id = o.user_id
   AND (
        vr.transaction_no = p.out_trade_no
        OR vr.transaction_no = o.out_trade_no
        OR vr.transaction_no = o.order_sn
   )
WHERE o.tenant_id = $1
  AND o.organization_id = $2
  AND o.user_id = $3
  AND (
        o.order_sn = $4
        OR o.out_trade_no = $4
        OR p.out_trade_no = $4
   )
ORDER BY COALESCE(p.id, 0) DESC, o.id DESC
LIMIT 1
"#;

#[derive(Debug, Clone)]
pub struct PostgresCheckoutStore {
    pool: PgPool,
}

impl PostgresCheckoutStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl CheckoutStore for PostgresCheckoutStore {
    fn load_checkout_status<'a>(
        &'a self,
        subject: Option<CheckoutSubject>,
        order_no: String,
    ) -> CheckoutReadFuture<'a, Option<CheckoutStatusSnapshot>> {
        Box::pin(async move {
            let subject = subject.ok_or_else(|| {
                DomainError::new("trusted request subject is required for checkout status")
            })?;
            load_checkout_status(&self.pool, subject, &order_no).await
        })
    }
}

async fn load_checkout_status(
    pool: &PgPool,
    subject: CheckoutSubject,
    order_no: &str,
) -> Result<Option<CheckoutStatusSnapshot>, DomainError> {
    let row = sqlx::query(LOAD_CHECKOUT_STATUS)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .bind(order_no)
        .fetch_optional(pool)
        .await
        .map_err(sql_error)?;

    row.as_ref().map(map_checkout_status).transpose()
}

fn map_checkout_status(row: &sqlx::postgres::PgRow) -> Result<CheckoutStatusSnapshot, DomainError> {
    let order_status =
        order_status_label(required_status_cell(row, "order_status", "order")?)?.to_owned();
    let payment_status = payment_status_label(related_status_cell(
        row,
        "payment_id",
        "payment_status",
        "payment",
    )?)?
    .to_owned();
    let recharge_status = recharge_status_label(related_status_cell(
        row,
        "recharge_id",
        "recharge_status",
        "recharge",
    )?)?
    .to_owned();
    let status = checkout_status_label(&order_status, &payment_status, &recharge_status);
    let out_trade_no = string_cell(row, "out_trade_no");

    Ok(CheckoutStatusSnapshot {
        order_no: string_cell(row, "order_no"),
        out_trade_no: out_trade_no.clone(),
        amount: decimal_string_cell(row, "amount", "checkout amount")?,
        points: integer_cell(row, "points"),
        payment_method: string_cell(row, "payment_method"),
        order_status,
        payment_status,
        recharge_status,
        status: status.to_owned(),
        created_at: string_cell(row, "created_at"),
        expires_at: string_cell(row, "expires_at"),
        paid_at: string_cell(row, "paid_at"),
        next_action: checkout_next_action(status).to_owned(),
        qr_code_payload: out_trade_no,
    })
}

fn checkout_status_label(
    order_status: &str,
    payment_status: &str,
    recharge_status: &str,
) -> &'static str {
    if order_status == "refunded" {
        "refunded"
    } else if order_status == "refunding" {
        "refunding"
    } else if recharge_status == "success" {
        "success"
    } else if payment_status == "failed" || recharge_status == "failed" {
        "failed"
    } else if payment_status == "expired" || order_status == "expired" {
        "expired"
    } else {
        "pending"
    }
}

fn checkout_next_action(status: &str) -> &'static str {
    match status {
        "success" => "completed",
        "failed" => "contactSupport",
        "expired" => "restartPayment",
        "refunding" => "awaitRefund",
        "refunded" => "refundCompleted",
        _ => "awaitPayment",
    }
}

fn order_status_label(value: i64) -> Result<&'static str, DomainError> {
    match value {
        0 | 1 => Ok("pending"),
        2 | 3 | 4 => Ok("success"),
        5 => Ok("expired"),
        6 => Ok("refunding"),
        7 | 8 => Ok("refunded"),
        status => Err(DomainError::new(format!(
            "unsupported checkout order status: {status}"
        ))),
    }
}

fn payment_status_label(value: i64) -> Result<&'static str, DomainError> {
    match value {
        0 | 1 => Ok("pending"),
        2 => Ok("success"),
        3 => Ok("failed"),
        4 | 5 => Ok("expired"),
        status => Err(DomainError::new(format!(
            "unsupported checkout payment status: {status}"
        ))),
    }
}

fn recharge_status_label(value: i64) -> Result<&'static str, DomainError> {
    match value {
        0 | 3 => Ok("pending"),
        1 => Ok("success"),
        2 => Ok("failed"),
        status => Err(DomainError::new(format!(
            "unsupported checkout recharge status: {status}"
        ))),
    }
}

fn optional_string_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(column).ok().flatten()
}

fn string_cell(row: &sqlx::postgres::PgRow, column: &str) -> String {
    optional_string_cell(row, column).unwrap_or_default()
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

fn required_status_cell(
    row: &sqlx::postgres::PgRow,
    column: &str,
    source: &str,
) -> Result<i64, DomainError> {
    optional_integer_cell(row, column).ok_or_else(|| missing_checkout_status_error(source))
}

fn related_status_cell(
    row: &sqlx::postgres::PgRow,
    relation_column: &str,
    status_column: &str,
    source: &str,
) -> Result<i64, DomainError> {
    if optional_integer_cell(row, relation_column).is_none() {
        return Ok(0);
    }
    required_status_cell(row, status_column, source)
}

fn missing_checkout_status_error(source: &str) -> DomainError {
    match source {
        "order" => DomainError::new("missing checkout order status from database row"),
        "payment" => DomainError::new("missing checkout payment status from database row"),
        "recharge" => DomainError::new("missing checkout recharge status from database row"),
        value => DomainError::new(format!("missing checkout {value} status from database row")),
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
    field_name: &str,
) -> Result<String, DomainError> {
    let value = string_cell(row, column);
    decimal_value_string(&value, field_name)
}

fn decimal_value_string(value: &str, field_name: &str) -> Result<String, DomainError> {
    DecimalValue::parse(&value)
        .map(|amount| amount.to_fixed_string(2))
        .map_err(|_| DomainError::new(format!("invalid {field_name}: {value}")))
}

fn sql_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn checkout_status_query_casts_integer_projection_aliases_for_stable_postgres_mapping() {
        for projection in [
            "CAST(COALESCE(vr.point_amount, o.paid_points_amount, 0) AS TEXT) AS points",
            "p.id AS payment_id",
            "vr.id AS recharge_id",
            "o.status AS order_status",
            "p.status AS payment_status",
            "vr.status AS recharge_status",
        ] {
            assert!(
                LOAD_CHECKOUT_STATUS.contains(projection),
                "checkout Postgres SQL must project {projection} to avoid int4/int8 row mapping drift"
            );
        }
    }

    #[test]
    fn checkout_status_query_scopes_every_lookup_to_app_subject() {
        for predicate in [
            "WHERE o.tenant_id = $1",
            "AND o.organization_id = $2",
            "AND o.user_id = $3",
        ] {
            assert!(
                LOAD_CHECKOUT_STATUS.contains(predicate),
                "checkout Postgres SQL must include subject predicate {predicate}"
            );
        }
    }

    #[test]
    fn order_status_label_rejects_unknown_database_status() {
        assert_eq!("pending", order_status_label(0).unwrap());
        assert_eq!("pending", order_status_label(1).unwrap());
        assert_eq!("success", order_status_label(2).unwrap());
        assert_eq!("success", order_status_label(3).unwrap());
        assert_eq!("success", order_status_label(4).unwrap());
        assert_eq!("expired", order_status_label(5).unwrap());
        assert_eq!("refunding", order_status_label(6).unwrap());
        assert_eq!("refunded", order_status_label(7).unwrap());
        assert_eq!("refunded", order_status_label(8).unwrap());

        let unsupported = order_status_label(99).expect_err("unknown order status must fail");
        assert!(
            unsupported
                .to_string()
                .contains("unsupported checkout order status: 99"),
            "{unsupported}"
        );
    }

    #[test]
    fn payment_status_label_rejects_unknown_database_status() {
        assert_eq!("pending", payment_status_label(0).unwrap());
        assert_eq!("pending", payment_status_label(1).unwrap());
        assert_eq!("success", payment_status_label(2).unwrap());
        assert_eq!("failed", payment_status_label(3).unwrap());
        assert_eq!("expired", payment_status_label(4).unwrap());
        assert_eq!("expired", payment_status_label(5).unwrap());

        let unsupported = payment_status_label(99).expect_err("unknown payment status must fail");
        assert!(
            unsupported
                .to_string()
                .contains("unsupported checkout payment status: 99"),
            "{unsupported}"
        );
    }

    #[test]
    fn recharge_status_label_rejects_unknown_database_status() {
        assert_eq!("pending", recharge_status_label(0).unwrap());
        assert_eq!("success", recharge_status_label(1).unwrap());
        assert_eq!("failed", recharge_status_label(2).unwrap());
        assert_eq!("pending", recharge_status_label(3).unwrap());

        let unsupported = recharge_status_label(99).expect_err("unknown recharge status must fail");
        assert!(
            unsupported
                .to_string()
                .contains("unsupported checkout recharge status: 99"),
            "{unsupported}"
        );
    }

    #[test]
    fn decimal_value_string_rejects_invalid_database_amount() {
        assert_eq!(
            "12.30",
            decimal_value_string("12.3", "checkout amount").unwrap()
        );

        let unsupported = decimal_value_string("not-money", "checkout amount")
            .expect_err("invalid money must fail");
        assert!(
            unsupported
                .to_string()
                .contains("invalid checkout amount: not-money"),
            "{unsupported}"
        );
    }
}
