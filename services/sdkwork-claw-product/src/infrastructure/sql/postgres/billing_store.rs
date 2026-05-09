use sqlx::{PgPool, Postgres, Row, Transaction};

use crate::domain::{DecimalValue, DomainError};
use crate::ports::{
    BillingCommandFuture, BillingReadFuture, BillingRechargeHistoryItem, BillingRedeemHistoryItem,
    BillingStore, BillingSubject, RedeemCodeCommand, RedeemCodeOutcome,
};

const LOAD_REDEEM_HISTORY: &str = r#"
SELECT
    CAST(uc.id AS TEXT) AS id,
    COALESCE(NULLIF(uc.coupon_code, ''), NULLIF(c.redeem_code, ''), '-') AS code,
    CAST(COALESCE(vpc.change_amount::numeric / 10, CASE WHEN c.amount IS NULL THEN 0::numeric ELSE c.amount::numeric / 100 END, 0::numeric) AS TEXT) AS amount,
    CAST(COALESCE(uc.acquire_at, uc.created_at) AS TEXT) AS date,
    uc.status AS status
FROM plus_user_coupon uc
JOIN plus_coupon c ON c.id = uc.coupon_id
LEFT JOIN plus_vip_point_change vpc
    ON vpc.tenant_id = uc.tenant_id
   AND vpc.organization_id = uc.organization_id
   AND vpc.user_id = uc.user_id
   AND vpc.source_id = uc.id
WHERE uc.tenant_id = $1
  AND uc.organization_id = $2
  AND uc.user_id = $3
ORDER BY COALESCE(uc.acquire_at, uc.created_at) DESC NULLS LAST, uc.id DESC
LIMIT 100
"#;

const LOAD_RECHARGE_HISTORY: &str = r#"
SELECT
    CAST(COALESCE(p.id, o.id, vr.id) AS TEXT) AS id,
    p.id AS payment_id,
    vr.id AS recharge_id,
    COALESCE(NULLIF(p.out_trade_no, ''), NULLIF(o.out_trade_no, ''), NULLIF(o.order_sn, ''), NULLIF(vr.transaction_no, ''), '-') AS order_no,
    COALESCE(NULLIF(o.payment_method, ''), NULLIF(CAST(p.channel AS TEXT), ''), NULLIF(CAST(p.provider AS TEXT), ''), '-') AS method,
    CAST(COALESCE(vr.amount, p.amount, o.paid_amount, o.total_amount, 0) AS TEXT) AS amount,
    CAST(COALESCE(vr.recharge_time, p.success_time, p.created_at, o.pay_success_time, o.created_at) AS TEXT) AS date,
    o.status AS order_status,
    p.status AS payment_status,
    vr.status AS recharge_status
FROM plus_order o
LEFT JOIN plus_payment p
    ON p.tenant_id = o.tenant_id
   AND p.organization_id = o.organization_id
   AND p.order_id = o.id
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
ORDER BY COALESCE(vr.recharge_time, p.success_time, p.created_at, o.pay_success_time, o.created_at) DESC NULLS LAST, o.id DESC
LIMIT 100
"#;

const LOAD_COUPON_FOR_REDEEM: &str = r#"
SELECT
    CAST(id AS TEXT) AS id,
    CAST(COALESCE(amount, 0) AS TEXT) AS amount,
    CAST(end_time AS TEXT) AS end_time,
    CAST(COALESCE(total, 0) AS TEXT) AS total,
    CAST(COALESCE(received_count, 0) AS TEXT) AS received_count,
    CAST(COALESCE(get_limit, 0) AS TEXT) AS get_limit,
    COALESCE(stackable, false) AS stackable
FROM plus_coupon
WHERE redeem_code = $1
  AND status = 1
  AND (start_time IS NULL OR start_time <= ($2::timestamp AT TIME ZONE 'UTC'))
  AND (end_time IS NULL OR end_time >= ($2::timestamp AT TIME ZONE 'UTC'))
LIMIT 1
FOR UPDATE
"#;

#[derive(Debug, Clone)]
pub struct PostgresBillingStore {
    pool: PgPool,
}

impl PostgresBillingStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl BillingStore for PostgresBillingStore {
    fn load_redeem_history<'a>(
        &'a self,
        subject: Option<BillingSubject>,
    ) -> BillingReadFuture<'a, Vec<BillingRedeemHistoryItem>> {
        Box::pin(async move {
            let subject = subject.ok_or_else(|| {
                DomainError::new("trusted request subject is required for billing redeem history")
            })?;
            load_redeem_history(&self.pool, subject).await
        })
    }

    fn load_recharge_history<'a>(
        &'a self,
        subject: Option<BillingSubject>,
    ) -> BillingReadFuture<'a, Vec<BillingRechargeHistoryItem>> {
        Box::pin(async move {
            let subject = subject.ok_or_else(|| {
                DomainError::new("trusted request subject is required for billing recharge history")
            })?;
            load_recharge_history(&self.pool, subject).await
        })
    }

    fn redeem_code<'a>(&'a self, command: RedeemCodeCommand) -> BillingCommandFuture<'a> {
        Box::pin(async move { redeem_code(&self.pool, command).await })
    }
}

async fn load_redeem_history(
    pool: &PgPool,
    subject: BillingSubject,
) -> Result<Vec<BillingRedeemHistoryItem>, DomainError> {
    let rows = sqlx::query(LOAD_REDEEM_HISTORY)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .fetch_all(pool)
        .await
        .map_err(sql_error)?;

    rows.iter()
        .map(|row| {
            let status =
                coupon_status_label(required_status_cell(row, "status", "redeem")?)?.to_owned();
            Ok(BillingRedeemHistoryItem {
                id: integer_cell(row, "id"),
                code: string_cell(row, "code"),
                amount: decimal_string_cell(row, "amount", "billing redeem amount")?,
                date: string_cell(row, "date"),
                status,
            })
        })
        .collect()
}

async fn load_recharge_history(
    pool: &PgPool,
    subject: BillingSubject,
) -> Result<Vec<BillingRechargeHistoryItem>, DomainError> {
    let rows = sqlx::query(LOAD_RECHARGE_HISTORY)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .fetch_all(pool)
        .await
        .map_err(sql_error)?;

    rows.iter()
        .map(|row| {
            let status = recharge_history_status(row)?.to_owned();
            Ok(BillingRechargeHistoryItem {
                id: integer_cell(row, "id"),
                order_no: string_cell(row, "order_no"),
                method: string_cell(row, "method"),
                amount: decimal_string_cell(row, "amount", "billing recharge amount")?,
                date: string_cell(row, "date"),
                status,
            })
        })
        .collect()
}

async fn redeem_code(
    pool: &PgPool,
    command: RedeemCodeCommand,
) -> Result<RedeemCodeOutcome, DomainError> {
    let mut tx = pool
        .begin()
        .await
        .map_err(|error| store_error("failed to begin billing redeem transaction", error))?;
    let coupon = load_coupon_for_redeem(&mut tx, &command).await?;
    ensure_coupon_can_be_issued(&mut tx, &command, &coupon).await?;
    let account = ensure_points_account(&mut tx, &command).await?;
    let credited_points = coupon_credit_points(coupon.amount_cents);
    let balance_after = account.available_points + credited_points;
    let user_coupon_id = insert_user_coupon(&mut tx, &command, &coupon).await?;
    update_coupon_received_count(&mut tx, coupon.id).await?;
    update_account_points(&mut tx, account.id, balance_after).await?;
    insert_account_history(
        &mut tx,
        &command,
        account.id,
        account.available_points,
        balance_after,
        credited_points,
        user_coupon_id,
    )
    .await?;
    insert_point_change(
        &mut tx,
        &command,
        account.available_points,
        balance_after,
        credited_points,
        user_coupon_id,
    )
    .await?;
    tx.commit()
        .await
        .map_err(|error| store_error("failed to commit billing redeem transaction", error))?;

    Ok(RedeemCodeOutcome {
        message: "Redeem code applied".to_owned(),
        amount: points_to_money_string(credited_points),
        credited_points,
        balance: balance_after,
    })
}

#[derive(Debug, Clone)]
struct CouponForRedeem {
    id: i64,
    amount_cents: i64,
    total: i64,
    received_count: i64,
    get_limit: i64,
    stackable: bool,
    end_time: Option<String>,
}

#[derive(Debug, Clone)]
struct PointsAccount {
    id: i64,
    available_points: i64,
}

async fn load_coupon_for_redeem(
    tx: &mut Transaction<'_, Postgres>,
    command: &RedeemCodeCommand,
) -> Result<CouponForRedeem, DomainError> {
    let row = sqlx::query(LOAD_COUPON_FOR_REDEEM)
        .bind(&command.code)
        .bind(&command.requested_at)
        .fetch_optional(&mut **tx)
        .await
        .map_err(|error| store_error("failed to load redeem code", error))?
        .ok_or_else(|| DomainError::conflict("redeem code is invalid or unavailable"))?;

    Ok(CouponForRedeem {
        id: integer_cell(&row, "id"),
        amount_cents: integer_cell(&row, "amount"),
        total: integer_cell(&row, "total"),
        received_count: integer_cell(&row, "received_count"),
        get_limit: integer_cell(&row, "get_limit"),
        stackable: bool_cell(&row, "stackable"),
        end_time: optional_string_cell(&row, "end_time"),
    })
}

async fn ensure_coupon_can_be_issued(
    tx: &mut Transaction<'_, Postgres>,
    command: &RedeemCodeCommand,
    coupon: &CouponForRedeem,
) -> Result<(), DomainError> {
    if coupon.total > 0 && coupon.received_count >= coupon.total {
        return Err(DomainError::conflict(
            "redeem code has reached its issue limit",
        ));
    }
    if coupon.get_limit > 0 {
        let received_count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(1)
            FROM plus_user_coupon
            WHERE tenant_id = $1
              AND organization_id = $2
              AND user_id = $3
              AND coupon_id = $4
            "#,
        )
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(command.subject.user_id)
        .bind(coupon.id)
        .fetch_one(&mut **tx)
        .await
        .map_err(|error| store_error("failed to check redeem code user limit", error))?;
        if received_count >= coupon.get_limit {
            return Err(DomainError::conflict(
                "redeem code user receive limit has been reached",
            ));
        }
    }
    Ok(())
}

async fn ensure_points_account(
    tx: &mut Transaction<'_, Postgres>,
    command: &RedeemCodeCommand,
) -> Result<PointsAccount, DomainError> {
    let existing = sqlx::query(
        r#"
        SELECT CAST(id AS TEXT) AS id,
               CAST(COALESCE(available_points, 0) AS TEXT) AS available_points
        FROM plus_account
        WHERE tenant_id = $1
          AND organization_id = $2
          AND user_id = $3
          AND account_type = 2
          AND status = 1
        ORDER BY id ASC
        LIMIT 1
        FOR UPDATE
        "#,
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.user_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load points account", error))?;
    if let Some(row) = existing {
        return Ok(PointsAccount {
            id: integer_cell(&row, "id"),
            available_points: integer_cell(&row, "available_points"),
        });
    }

    let inserted = sqlx::query(
        r#"
        INSERT INTO plus_account
            (uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, user_id, account_type, owner, owner_id, available_balance, frozen_balance, available_points, frozen_points, token_balance, frozen_token, status)
        VALUES
            ($1, $2, $3, 1, $4::timestamp AT TIME ZONE 'UTC', $4::timestamp AT TIME ZONE 'UTC', 0, $5, 2, 0, $5, 0, 0, 0, 0, 0, 0, 1)
        ON CONFLICT (tenant_id, organization_id, user_id, account_type) DO NOTHING
        RETURNING CAST(id AS TEXT) AS id
        "#,
    )
    .bind(&command.account_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(command.subject.user_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create points account", error))?;
    if let Some(row) = inserted {
        return Ok(PointsAccount {
            id: integer_cell(&row, "id"),
            available_points: 0,
        });
    }

    let row = sqlx::query(
        r#"
        SELECT CAST(id AS TEXT) AS id,
               CAST(COALESCE(available_points, 0) AS TEXT) AS available_points
        FROM plus_account
        WHERE tenant_id = $1
          AND organization_id = $2
          AND user_id = $3
          AND account_type = 2
          AND status = 1
        ORDER BY id ASC
        LIMIT 1
        FOR UPDATE
        "#,
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.user_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load concurrently created points account", error))?
    .ok_or_else(|| {
        DomainError::conflict("points account was not available after concurrent creation")
    })?;

    Ok(PointsAccount {
        id: integer_cell(&row, "id"),
        available_points: integer_cell(&row, "available_points"),
    })
}

async fn insert_user_coupon(
    tx: &mut Transaction<'_, Postgres>,
    command: &RedeemCodeCommand,
    coupon: &CouponForRedeem,
) -> Result<i64, DomainError> {
    sqlx::query_scalar(
        r#"
        INSERT INTO plus_user_coupon
            (uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, user_id, coupon_id, coupon_code, acquire_at, acquire_type, point_cost, points_refunded, expire_at, status, can_shared)
        VALUES
            ($1, $2, $3, 1, $4::timestamp AT TIME ZONE 'UTC', $4::timestamp AT TIME ZONE 'UTC', 0, $5, $6, $7, $4::timestamp AT TIME ZONE 'UTC', 2, 0, false, $8::timestamp AT TIME ZONE 'UTC', 1, $9)
        RETURNING id
        "#,
    )
    .bind(&command.user_coupon_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(command.subject.user_id)
    .bind(coupon.id)
    .bind(&command.coupon_code)
    .bind(coupon.end_time.as_deref())
    .bind(coupon.stackable)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to issue user coupon", error))
}

async fn update_coupon_received_count(
    tx: &mut Transaction<'_, Postgres>,
    coupon_id: i64,
) -> Result<(), DomainError> {
    sqlx::query(
        r#"
        UPDATE plus_coupon
        SET received_count = COALESCE(received_count, 0) + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        "#,
    )
    .bind(coupon_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update coupon received count", error))?;
    Ok(())
}

async fn update_account_points(
    tx: &mut Transaction<'_, Postgres>,
    account_id: i64,
    balance_after: i64,
) -> Result<(), DomainError> {
    sqlx::query(
        r#"
        UPDATE plus_account
        SET available_points = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        "#,
    )
    .bind(balance_after)
    .bind(account_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update account points", error))?;
    Ok(())
}

async fn insert_account_history(
    tx: &mut Transaction<'_, Postgres>,
    command: &RedeemCodeCommand,
    account_id: i64,
    balance_before: i64,
    balance_after: i64,
    credited_points: i64,
    user_coupon_id: i64,
) -> Result<(), DomainError> {
    sqlx::query(
        r#"
        INSERT INTO plus_account_history
            (uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, account_type, asset_type, account_id, transaction_id, transaction_type, points_change, points_before, points_after, source_type, source_id, status, usage_result, remarks)
        VALUES
            ($1, $2, $3, 1, $4::timestamp AT TIME ZONE 'UTC', $4::timestamp AT TIME ZONE 'UTC', 0, 2, 2, $5, $6, 21, $7, $8, $9, 6, $10, 2, $11, $12)
        "#,
    )
    .bind(&command.account_history_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(account_id)
    .bind(&command.transaction_id)
    .bind(credited_points)
    .bind(balance_before)
    .bind(balance_after)
    .bind(user_coupon_id.to_string())
    .bind("{}")
    .bind(format!("redeem_code={}", command.code))
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert account history", error))?;
    Ok(())
}

async fn insert_point_change(
    tx: &mut Transaction<'_, Postgres>,
    command: &RedeemCodeCommand,
    balance_before: i64,
    balance_after: i64,
    credited_points: i64,
    user_coupon_id: i64,
) -> Result<(), DomainError> {
    sqlx::query(
        r#"
        INSERT INTO plus_vip_point_change
            (uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, user_id, change_type, change_amount, before_balance, after_balance, source_id, source_type, remark)
        VALUES
            ($1, $2, $3, 1, $4::timestamp AT TIME ZONE 'UTC', $4::timestamp AT TIME ZONE 'UTC', 0, $5, 1, $6, $7, $8, $9, 'SYSTEM', $10)
        "#,
    )
    .bind(&command.point_change_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(command.subject.user_id)
    .bind(credited_points)
    .bind(balance_before)
    .bind(balance_after)
    .bind(user_coupon_id)
    .bind(format!("redeem_code={}", command.code))
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert vip point change", error))?;
    Ok(())
}

fn coupon_credit_points(amount_cents: i64) -> i64 {
    if amount_cents <= 0 {
        0
    } else {
        (amount_cents / 10).max(1)
    }
}

fn coupon_status_label(value: i64) -> Result<&'static str, DomainError> {
    match value {
        1 => Ok("success"),
        2 => Ok("pending"),
        3 | 4 => Ok("failed"),
        status => Err(DomainError::new(format!(
            "unsupported billing coupon status: {status}"
        ))),
    }
}

fn payment_status_label(value: i64) -> Result<&'static str, DomainError> {
    match value {
        0 | 1 => Ok("pending"),
        2 => Ok("success"),
        3..=5 => Ok("failed"),
        status => Err(DomainError::new(format!(
            "unsupported billing payment status: {status}"
        ))),
    }
}

fn recharge_history_status(row: &sqlx::postgres::PgRow) -> Result<&'static str, DomainError> {
    let order_status =
        order_recharge_status_label(required_status_cell(row, "order_status", "order")?)?;
    let payment_status = related_status_cell(row, "payment_id", "payment_status", "payment")?
        .map(payment_status_label)
        .transpose()?
        .unwrap_or("pending");
    let recharge_status = related_status_cell(row, "recharge_id", "recharge_status", "recharge")?
        .map(vip_recharge_status_label)
        .transpose()?
        .unwrap_or("pending");
    Ok(recharge_history_status_label(
        order_status,
        payment_status,
        recharge_status,
    ))
}

fn recharge_history_status_label(
    order_status: &str,
    payment_status: &str,
    recharge_status: &str,
) -> &'static str {
    if order_status == "failed" {
        "failed"
    } else if recharge_status == "success"
        || payment_status == "success"
        || order_status == "success"
    {
        "success"
    } else if payment_status == "failed" || recharge_status == "failed" {
        "failed"
    } else {
        "pending"
    }
}

fn order_recharge_status_label(value: i64) -> Result<&'static str, DomainError> {
    match value {
        0 | 1 => Ok("pending"),
        2..=4 => Ok("success"),
        5 | 7 | 8 => Ok("failed"),
        6 => Ok("pending"),
        status => Err(DomainError::new(format!(
            "unsupported billing order status: {status}"
        ))),
    }
}

fn vip_recharge_status_label(value: i64) -> Result<&'static str, DomainError> {
    match value {
        1 => Ok("success"),
        2 => Ok("failed"),
        3 => Ok("pending"),
        status => Err(DomainError::new(format!(
            "unsupported billing vip recharge status: {status}"
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
    optional_integer_cell(row, column).ok_or_else(|| missing_billing_status_error(source))
}

fn related_status_cell(
    row: &sqlx::postgres::PgRow,
    relation_column: &str,
    status_column: &str,
    source: &str,
) -> Result<Option<i64>, DomainError> {
    if optional_integer_cell(row, relation_column).is_none() {
        return Ok(None);
    }
    required_status_cell(row, status_column, source).map(Some)
}

fn missing_billing_status_error(source: &str) -> DomainError {
    match source {
        "redeem" => DomainError::new("missing billing redeem status from database row"),
        "order" => DomainError::new("missing billing recharge order status from database row"),
        "payment" => DomainError::new("missing billing recharge payment status from database row"),
        "recharge" => {
            DomainError::new("missing billing recharge recharge status from database row")
        }
        value => DomainError::new(format!(
            "missing billing recharge {value} status from database row"
        )),
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
    DecimalValue::parse(value)
        .map(|amount| amount.to_fixed_string(2))
        .map_err(|_| DomainError::new(format!("invalid {field_name}: {value}")))
}

fn points_to_money_string(points: i64) -> String {
    let cents = i128::from(points) * 10;
    let sign = if cents < 0 { "-" } else { "" };
    let absolute = cents.abs();
    format!("{sign}{}.{:02}", absolute / 100, absolute % 100)
}

fn bool_cell(row: &sqlx::postgres::PgRow, column: &str) -> bool {
    row.try_get::<Option<bool>, _>(column)
        .ok()
        .flatten()
        .or_else(|| Some(integer_cell(row, column) != 0))
        .unwrap_or(false)
}

fn sql_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn coupon_status_label_rejects_unknown_database_status() {
        assert_eq!("success", coupon_status_label(1).unwrap());
        assert_eq!("pending", coupon_status_label(2).unwrap());
        assert_eq!("failed", coupon_status_label(3).unwrap());
        assert_eq!("failed", coupon_status_label(4).unwrap());

        let unsupported = coupon_status_label(99).expect_err("unknown coupon status must fail");
        assert!(
            unsupported
                .to_string()
                .contains("unsupported billing coupon status: 99"),
            "{unsupported}"
        );
    }

    #[test]
    fn missing_billing_status_error_is_source_specific() {
        assert!(missing_billing_status_error("redeem")
            .to_string()
            .contains("missing billing redeem status from database row"));
        assert!(missing_billing_status_error("payment")
            .to_string()
            .contains("missing billing recharge payment status from database row"));
    }

    #[test]
    fn payment_status_label_rejects_unknown_database_status() {
        assert_eq!("pending", payment_status_label(0).unwrap());
        assert_eq!("pending", payment_status_label(1).unwrap());
        assert_eq!("success", payment_status_label(2).unwrap());
        assert_eq!("failed", payment_status_label(3).unwrap());
        assert_eq!("failed", payment_status_label(4).unwrap());
        assert_eq!("failed", payment_status_label(5).unwrap());

        let unsupported = payment_status_label(99).expect_err("unknown payment status must fail");
        assert!(
            unsupported
                .to_string()
                .contains("unsupported billing payment status: 99"),
            "{unsupported}"
        );
    }

    #[test]
    fn recharge_history_status_label_is_source_aware() {
        assert_eq!(
            "success",
            recharge_history_status_label("success", "failed", "success")
        );
        assert_eq!(
            "failed",
            recharge_history_status_label("failed", "success", "success")
        );
        assert_eq!(
            "success",
            recharge_history_status_label("pending", "success", "pending")
        );
        assert_eq!(
            "pending",
            recharge_history_status_label("pending", "pending", "pending")
        );
        assert_eq!(
            "failed",
            recharge_history_status_label("pending", "failed", "pending")
        );

        assert_eq!("success", order_recharge_status_label(3).unwrap());
        assert_eq!("failed", payment_status_label(3).unwrap());
        assert_eq!("pending", vip_recharge_status_label(3).unwrap());

        let unsupported_order =
            order_recharge_status_label(99).expect_err("unknown order status must fail");
        assert!(unsupported_order
            .to_string()
            .contains("unsupported billing order status: 99"));

        let unsupported_recharge =
            vip_recharge_status_label(0).expect_err("unknown recharge status must fail");
        assert!(unsupported_recharge
            .to_string()
            .contains("unsupported billing vip recharge status: 0"));
    }

    #[test]
    fn decimal_value_string_rejects_invalid_database_amount() {
        assert_eq!(
            "12.30",
            decimal_value_string("12.3", "billing amount").unwrap()
        );

        let unsupported = decimal_value_string("not-money", "billing amount")
            .expect_err("invalid money must fail");
        assert!(
            unsupported
                .to_string()
                .contains("invalid billing amount: not-money"),
            "{unsupported}"
        );
    }
}
