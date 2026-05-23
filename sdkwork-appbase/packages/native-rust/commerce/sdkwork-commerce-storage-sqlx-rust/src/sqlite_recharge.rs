use std::time::{SystemTime, UNIX_EPOCH};

use sdkwork_commerce_core::{CommerceMoney, CommercePaymentStatus, CommerceServiceError};
use sdkwork_commerce_payment::{
    CheckoutStatusQuery, CheckoutStatusSnapshot, CreatePointsRechargeOrderCommand,
    CreatePointsRechargeOrderOutcome, RechargePackageItem, RechargePackageListQuery,
};
use sqlx::{Row, Sqlite, SqlitePool, Transaction};

const LOAD_RECHARGE_PACKAGES: &str = r#"
SELECT
    p.id,
    CAST(p.price_amount AS TEXT) AS rmb,
    COALESCE(p.bonus_points, 0) AS bonus
FROM commerce_recharge_package p
LEFT JOIN commerce_product_sku s
    ON s.id = p.sku_id
   AND s.sales_status = 'active'
LEFT JOIN commerce_product_spu pr
    ON pr.id = s.spu_id
   AND pr.sales_status = 'active'
WHERE p.tenant_id = CAST(?1 AS TEXT)
  AND (p.organization_id = CAST(?2 AS TEXT) OR p.organization_id IS NULL)
  AND p.status = 'active'
  AND (p.valid_from IS NULL OR p.valid_from <= ?3)
  AND (p.valid_to IS NULL OR p.valid_to >= ?3)
GROUP BY p.id, p.price_amount, p.bonus_points, p.sort_weight
ORDER BY COALESCE(p.sort_weight, 0) ASC, p.price_amount ASC, p.id ASC
LIMIT 100
"#;

const LOAD_RECHARGE_PACK_FOR_AMOUNT: &str = r#"
SELECT
    COALESCE(NULLIF(name, ''), 'Points recharge package') AS name,
    CAST(price_amount AS TEXT) AS price,
    COALESCE(bonus_points, 0) AS bonus
FROM commerce_recharge_package
WHERE tenant_id = CAST(?1 AS TEXT)
  AND (organization_id = CAST(?2 AS TEXT) OR organization_id IS NULL)
  AND status = 'active'
  AND CAST(price_amount AS TEXT) IN (?3, ?4, ?5)
  AND (valid_from IS NULL OR valid_from <= ?6)
  AND (valid_to IS NULL OR valid_to >= ?6)
ORDER BY COALESCE(sort_weight, 0) ASC, id ASC
LIMIT 1
"#;

const LOAD_RECHARGE_METHOD: &str = r#"
SELECT method_key
FROM commerce_payment_method
WHERE tenant_id = CAST(?1 AS TEXT)
  AND (organization_id = CAST(?2 AS TEXT) OR organization_id IS NULL)
  AND status = 'active'
  AND (LOWER(method_key) = ?3 OR LOWER(method_key) = ?4)
ORDER BY COALESCE(sort_weight, 0) ASC, id ASC
LIMIT 1
"#;

const LOAD_RECHARGE_PRODUCT_SKU: &str = r#"
SELECT
    s.id AS sku_id,
    COALESCE(NULLIF(s.name, ''), NULLIF(s.title, ''), NULLIF(pr.title, ''), 'Points recharge') AS product_name
FROM commerce_product_sku s
JOIN commerce_product_spu pr ON pr.id = s.spu_id
WHERE s.tenant_id = CAST(?1 AS TEXT)
  AND (s.organization_id = CAST(?2 AS TEXT) OR s.organization_id IS NULL)
  AND pr.tenant_id = CAST(?1 AS TEXT)
  AND (pr.organization_id = CAST(?2 AS TEXT) OR pr.organization_id IS NULL)
  AND s.sales_status = 'active'
  AND pr.sales_status = 'active'
ORDER BY
    CASE WHEN CAST(s.price_amount AS TEXT) IN (?3, ?4, ?5) THEN 0 ELSE 1 END,
    pr.id ASC,
    s.id ASC
LIMIT 1
"#;

const LOAD_CHECKOUT_STATUS: &str = r#"
SELECT
    o.id AS order_id,
    pi.id AS payment_id,
    pa.id AS payment_attempt_id,
    COALESCE(NULLIF(o.order_no, ''), NULLIF(pa.out_trade_no, ''), '-') AS order_no,
    COALESCE(NULLIF(pa.out_trade_no, ''), NULLIF(o.order_no, ''), '-') AS out_trade_no,
    CAST(COALESCE(NULLIF(pa.amount, ''), NULLIF(pi.amount, ''), '0') AS TEXT) AS amount,
    CAST(COALESCE(
        NULLIF(json_extract(COALESCE(pa.callback_payload, '{}'), '$.points'), ''),
        NULLIF(pa.amount, ''),
        NULLIF(pi.amount, ''),
        '0'
    ) AS TEXT) AS points_value,
    COALESCE(NULLIF(pa.provider, ''), NULLIF(pi.provider, ''), '-') AS payment_method,
    o.status AS order_status,
    pi.status AS payment_status,
    pa.status AS payment_attempt_status,
    CAST(o.created_at AS TEXT) AS created_at,
    CAST(COALESCE(o.expired_at, '') AS TEXT) AS expires_at,
    CAST(COALESCE(pa.paid_at, o.paid_at, '') AS TEXT) AS paid_at
FROM commerce_order o
LEFT JOIN commerce_payment_intent pi
    ON pi.tenant_id = o.tenant_id
   AND (pi.organization_id IS NULL OR o.organization_id IS NULL OR pi.organization_id = o.organization_id)
   AND pi.order_id = o.id
LEFT JOIN commerce_payment_attempt pa
    ON pa.tenant_id = o.tenant_id
   AND (pa.organization_id IS NULL OR o.organization_id IS NULL OR pa.organization_id = o.organization_id)
   AND pa.order_id = o.id
WHERE o.tenant_id = CAST(?1 AS TEXT)
  AND ((o.organization_id = CAST(?2 AS TEXT)) OR (o.organization_id IS NULL AND ?2 IS NULL))
  AND o.owner_user_id = CAST(?3 AS TEXT)
  AND (
        o.order_no = ?4
        OR pa.out_trade_no = ?4
   )
ORDER BY COALESCE(pa.created_at, pi.created_at, o.created_at) DESC, o.id DESC
LIMIT 1
"#;

#[derive(Debug, Clone)]
pub struct SqliteCommerceRechargeStore {
    pool: SqlitePool,
}

#[derive(Debug, Clone)]
struct RechargeMethod {
    method_key: String,
}

#[derive(Debug, Clone)]
struct RechargePack {
    name: String,
    bonus_points: i64,
}

#[derive(Debug, Clone)]
struct RechargeProductSku {
    sku_id: String,
    product_name: String,
}

impl SqliteCommerceRechargeStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }

    pub async fn list_recharge_packages(
        &self,
        query: RechargePackageListQuery,
    ) -> Result<Vec<RechargePackageItem>, CommerceServiceError> {
        let rows = sqlx::query(LOAD_RECHARGE_PACKAGES)
            .bind(&query.tenant_id)
            .bind(query.organization_id.as_deref())
            .bind(current_query_timestamp())
            .fetch_all(&self.pool)
            .await
            .map_err(|error| store_error("failed to list recharge packages", error))?;

        rows.iter()
            .map(|row| {
                let rmb = commerce_money_cell(row, "rmb", "recharge package rmb")?;
                let bonus = integer_cell(row, "bonus").max(0);
                let points = recharge_base_points(rmb.as_str())? + bonus;
                RechargePackageItem::new(&string_cell(row, "id"), rmb, bonus, points)
            })
            .collect()
    }

    pub async fn create_points_recharge_order(
        &self,
        command: CreatePointsRechargeOrderCommand,
    ) -> Result<CreatePointsRechargeOrderOutcome, CommerceServiceError> {
        let mut tx = self
            .pool
            .begin()
            .await
            .map_err(|error| store_error("failed to begin recharge transaction", error))?;
        let method = load_recharge_method(&mut tx, &command).await?;
        let pack = load_recharge_pack(&mut tx, &command).await?;
        let product = load_recharge_product_sku(&mut tx, &command).await?;
        let base_points = recharge_base_points(command.amount.as_str())?;
        let bonus_points = pack.as_ref().map(|item| item.bonus_points).unwrap_or(0);
        let credited_points = base_points + bonus_points;
        let product_name = pack
            .as_ref()
            .map(|item| item.name.clone())
            .unwrap_or_else(|| product.product_name.clone());

        insert_order(&mut tx, &command).await?;
        insert_order_item(&mut tx, &command, &product, &product_name).await?;
        insert_order_amount_breakdown(&mut tx, &command).await?;
        insert_payment(&mut tx, &command, &method, credited_points).await?;
        tx.commit()
            .await
            .map_err(|error| store_error("failed to commit recharge transaction", error))?;

        Ok(CreatePointsRechargeOrderOutcome {
            success: true,
            order_no: command.order_no,
            amount: command.amount,
            points: credited_points,
            payment_method: method.method_key,
            status: "pending".to_string(),
        })
    }

    pub async fn load_checkout_status(
        &self,
        query: CheckoutStatusQuery,
    ) -> Result<Option<CheckoutStatusSnapshot>, CommerceServiceError> {
        let row = sqlx::query(LOAD_CHECKOUT_STATUS)
            .bind(&query.tenant_id)
            .bind(query.organization_id.as_deref())
            .bind(&query.owner_user_id)
            .bind(&query.order_no)
            .fetch_optional(&self.pool)
            .await
            .map_err(|error| store_error("failed to load checkout status", error))?;

        row.as_ref().map(map_checkout_status).transpose()
    }
}

async fn load_recharge_method(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreatePointsRechargeOrderCommand,
) -> Result<RechargeMethod, CommerceServiceError> {
    let alias = method_alias(&command.method);
    let row = sqlx::query(LOAD_RECHARGE_METHOD)
        .bind(&command.tenant_id)
        .bind(command.organization_id.as_deref())
        .bind(&command.method)
        .bind(alias)
        .fetch_optional(&mut **tx)
        .await
        .map_err(|error| store_error("failed to load recharge method", error))?
        .ok_or_else(|| CommerceServiceError::conflict("recharge payment method is unavailable"))?;
    let method_key = string_cell(&row, "method_key").to_ascii_lowercase();
    Ok(RechargeMethod { method_key })
}

async fn load_recharge_pack(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreatePointsRechargeOrderCommand,
) -> Result<Option<RechargePack>, CommerceServiceError> {
    let amount_match = decimal_sql_match_keys(command.amount.as_str());
    let row = sqlx::query(LOAD_RECHARGE_PACK_FOR_AMOUNT)
        .bind(&command.tenant_id)
        .bind(command.organization_id.as_deref())
        .bind(command.amount.as_str())
        .bind(&amount_match.compact)
        .bind(&amount_match.one_decimal)
        .bind(&command.requested_at)
        .fetch_optional(&mut **tx)
        .await
        .map_err(|error| store_error("failed to load recharge package", error))?;

    row.map(|row| {
        Ok(RechargePack {
            name: string_cell(&row, "name"),
            bonus_points: integer_cell(&row, "bonus").max(0),
        })
    })
    .transpose()
}

async fn load_recharge_product_sku(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreatePointsRechargeOrderCommand,
) -> Result<RechargeProductSku, CommerceServiceError> {
    let amount_match = decimal_sql_match_keys(command.amount.as_str());
    let row = sqlx::query(LOAD_RECHARGE_PRODUCT_SKU)
        .bind(&command.tenant_id)
        .bind(command.organization_id.as_deref())
        .bind(command.amount.as_str())
        .bind(&amount_match.compact)
        .bind(&amount_match.one_decimal)
        .fetch_optional(&mut **tx)
        .await
        .map_err(|error| store_error("failed to load recharge product sku", error))?
        .ok_or_else(|| CommerceServiceError::conflict("recharge product sku is unavailable"))?;

    Ok(RechargeProductSku {
        sku_id: string_cell(&row, "sku_id"),
        product_name: string_cell(&row, "product_name"),
    })
}

async fn insert_order(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreatePointsRechargeOrderCommand,
) -> Result<(), CommerceServiceError> {
    sqlx::query(
        r#"
        INSERT INTO commerce_order
            (id, tenant_id, organization_id, owner_user_id, order_no, status, subject, currency_code, request_no, idempotency_key, created_at, paid_at, cancelled_at, expired_at, updated_at)
        VALUES
            (?, CAST(? AS TEXT), CAST(? AS TEXT), CAST(? AS TEXT), ?, 'pending_payment', 'points_recharge', 'CNY', ?, ?, ?, NULL, NULL, ?, ?)
        "#,
    )
    .bind(&command.order_id)
    .bind(&command.tenant_id)
    .bind(command.organization_id.as_deref())
    .bind(&command.owner_user_id)
    .bind(&command.order_no)
    .bind(&command.order_no)
    .bind(&command.idempotency_key)
    .bind(&command.requested_at)
    .bind(&command.expire_at)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert recharge order", error))?;
    Ok(())
}

async fn insert_order_item(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreatePointsRechargeOrderCommand,
    product: &RechargeProductSku,
    product_name: &str,
) -> Result<(), CommerceServiceError> {
    sqlx::query(
        r#"
        INSERT INTO commerce_order_item
            (id, tenant_id, order_id, sku_id, title, quantity, unit_price_amount, total_amount, created_at)
        VALUES
            (?, CAST(? AS TEXT), ?, ?, ?, 1, ?, ?, ?)
        "#,
    )
    .bind(&command.order_item_id)
    .bind(&command.tenant_id)
    .bind(&command.order_id)
    .bind(&product.sku_id)
    .bind(product_name)
    .bind(command.amount.as_str())
    .bind(command.amount.as_str())
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert recharge order item", error))?;
    Ok(())
}

async fn insert_order_amount_breakdown(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreatePointsRechargeOrderCommand,
) -> Result<(), CommerceServiceError> {
    sqlx::query(
        r#"
        INSERT INTO commerce_order_amount_breakdown
            (id, tenant_id, order_id, original_amount, discount_amount, payable_amount, currency_code, created_at)
        VALUES
            (?, CAST(? AS TEXT), ?, ?, '0.00', ?, 'CNY', ?)
        "#,
    )
    .bind(format!("{}-amount", command.order_id))
    .bind(&command.tenant_id)
    .bind(&command.order_id)
    .bind(command.amount.as_str())
    .bind(command.amount.as_str())
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert recharge order amount breakdown", error))?;
    Ok(())
}

async fn insert_payment(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreatePointsRechargeOrderCommand,
    method: &RechargeMethod,
    credited_points: i64,
) -> Result<(), CommerceServiceError> {
    sqlx::query(
        r#"
        INSERT INTO commerce_payment_intent
            (id, tenant_id, organization_id, owner_user_id, order_id, provider, amount, currency_code, status, request_no, idempotency_key, created_at, updated_at)
        VALUES
            (?, CAST(? AS TEXT), CAST(? AS TEXT), CAST(? AS TEXT), ?, ?, ?, 'CNY', ?, ?, ?, ?, ?)
        "#,
    )
    .bind(&command.payment_intent_id)
    .bind(&command.tenant_id)
    .bind(command.organization_id.as_deref())
    .bind(&command.owner_user_id)
    .bind(&command.order_id)
    .bind(&method.method_key)
    .bind(command.amount.as_str())
    .bind(CommercePaymentStatus::Pending.as_str())
    .bind(&command.order_no)
    .bind(&command.idempotency_key)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert recharge payment intent", error))?;
    sqlx::query(
        r#"
        INSERT INTO commerce_payment_attempt
            (id, tenant_id, organization_id, owner_user_id, payment_intent_id, order_id, provider, out_trade_no, amount, currency_code, status, callback_payload, created_at, paid_at, updated_at)
        VALUES
            (?, CAST(? AS TEXT), CAST(? AS TEXT), CAST(? AS TEXT), ?, ?, ?, ?, ?, 'CNY', ?, ?, ?, NULL, ?)
        "#,
    )
    .bind(&command.payment_attempt_id)
    .bind(&command.tenant_id)
    .bind(command.organization_id.as_deref())
    .bind(&command.owner_user_id)
    .bind(&command.payment_intent_id)
    .bind(&command.order_id)
    .bind(&method.method_key)
    .bind(&command.out_trade_no)
    .bind(command.amount.as_str())
    .bind(CommercePaymentStatus::Pending.as_str())
    .bind(format!(r#"{{"points":{credited_points}}}"#))
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert recharge payment attempt", error))?;
    Ok(())
}

fn map_checkout_status(
    row: &sqlx::sqlite::SqliteRow,
) -> Result<CheckoutStatusSnapshot, CommerceServiceError> {
    let order_status_value = required_status_cell(row, "order_status", "order")?;
    let order_status = order_status_label(&order_status_value)?.to_owned();
    let payment_status_value = related_status_cell(row, "payment_id", "payment_status", "payment")?;
    let payment_status = payment_status_label(&payment_status_value)?.to_owned();
    let payment_attempt_status_value = related_status_cell(
        row,
        "payment_attempt_id",
        "payment_attempt_status",
        "payment attempt",
    )?;
    let payment_attempt_status = payment_status_label(&payment_attempt_status_value)?.to_owned();
    let recharge_status =
        checkout_effective_recharge_status(&order_status, &payment_status, &payment_attempt_status);
    let status = checkout_status_label(
        &order_status,
        &payment_status,
        &payment_attempt_status,
        &recharge_status,
    );
    let out_trade_no = string_cell(row, "out_trade_no");

    Ok(CheckoutStatusSnapshot {
        order_no: string_cell(row, "order_no"),
        out_trade_no: out_trade_no.clone(),
        amount: commerce_money_cell(row, "amount", "checkout amount")?,
        points: checkout_points(&string_cell(row, "points_value"))?,
        payment_method: string_cell(row, "payment_method"),
        order_status,
        payment_status: checkout_effective_payment_status(&payment_status, &payment_attempt_status),
        recharge_status,
        status: status.to_string(),
        created_at: string_cell(row, "created_at"),
        expires_at: string_cell(row, "expires_at"),
        paid_at: string_cell(row, "paid_at"),
        next_action: checkout_next_action(status).to_string(),
        qr_code_payload: out_trade_no,
    })
}

fn checkout_status_label(
    order_status: &str,
    payment_status: &str,
    payment_attempt_status: &str,
    recharge_status: &str,
) -> &'static str {
    if order_status == "refunded" {
        "refunded"
    } else if order_status == "refunding" {
        "refunding"
    } else if recharge_status == "success"
        || payment_attempt_status == "success"
        || payment_status == "success"
        || order_status == "success"
    {
        "success"
    } else if payment_attempt_status == "failed"
        || payment_status == "failed"
        || recharge_status == "failed"
    {
        "failed"
    } else if payment_attempt_status == "expired"
        || payment_status == "expired"
        || order_status == "expired"
    {
        "expired"
    } else {
        "pending"
    }
}

fn checkout_effective_recharge_status(
    order_status: &str,
    payment_status: &str,
    payment_attempt_status: &str,
) -> String {
    if payment_attempt_status == "success"
        || payment_status == "success"
        || order_status == "success"
    {
        "success".to_string()
    } else if payment_attempt_status == "failed"
        || payment_status == "failed"
        || order_status == "failed"
    {
        "failed".to_string()
    } else if payment_attempt_status == "expired"
        || payment_status == "expired"
        || order_status == "expired"
    {
        "expired".to_string()
    } else {
        "pending".to_string()
    }
}

fn checkout_effective_payment_status(payment_status: &str, payment_attempt_status: &str) -> String {
    if payment_attempt_status == "success" {
        "success".to_string()
    } else if payment_attempt_status == "failed" {
        "failed".to_string()
    } else if payment_attempt_status == "expired" {
        "expired".to_string()
    } else if payment_status == "success" {
        "success".to_string()
    } else {
        payment_status.to_string()
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

fn order_status_label(value: &str) -> Result<&'static str, CommerceServiceError> {
    match value.trim().to_ascii_lowercase().as_str() {
        "draft" | "pending_payment" | "pending" => Ok("pending"),
        "paid" | "fulfilled" | "completed" => Ok("success"),
        "cancelled" | "canceled" => Ok("failed"),
        "expired" => Ok("expired"),
        "refunding" => Ok("refunding"),
        "refunded" => Ok("refunded"),
        status => Err(CommerceServiceError::storage(format!(
            "unsupported checkout order status: {status}"
        ))),
    }
}

fn payment_status_label(value: &str) -> Result<&'static str, CommerceServiceError> {
    match value.trim().to_ascii_lowercase().as_str() {
        "" => Ok("pending"),
        status if status == CommercePaymentStatus::Pending.as_str() => Ok("pending"),
        status if status == CommercePaymentStatus::Succeeded.as_str() => Ok("success"),
        status if status == CommercePaymentStatus::Failed.as_str() => Ok("failed"),
        status if status == CommercePaymentStatus::Canceled.as_str() => Ok("expired"),
        status => Err(CommerceServiceError::storage(format!(
            "unsupported checkout payment status: {status}"
        ))),
    }
}

fn recharge_base_points(amount: &str) -> Result<i64, CommerceServiceError> {
    let cents = money_cents(amount)?;
    if cents <= 0 {
        return Err(CommerceServiceError::validation(
            "recharge amount must be greater than zero",
        ));
    }
    Ok(((cents + 5) / 10).max(1))
}

fn checkout_points(value: &str) -> Result<i64, CommerceServiceError> {
    if value.trim().contains('.') {
        return checkout_points_from_amount(value);
    }
    let points = value
        .trim()
        .parse::<i64>()
        .map_err(|_| CommerceServiceError::storage(format!("invalid checkout points: {value}")))?;
    if points < 0 {
        return Err(CommerceServiceError::storage(format!(
            "invalid checkout points: {value}"
        )));
    }
    Ok(points)
}

fn checkout_points_from_amount(amount: &str) -> Result<i64, CommerceServiceError> {
    let cents = money_cents(amount)?;
    Ok(cents / 10)
}

fn money_cents(amount: &str) -> Result<i64, CommerceServiceError> {
    let value = amount.trim();
    let mut parts = value.split('.');
    let whole = parts
        .next()
        .unwrap_or_default()
        .parse::<i64>()
        .map_err(|_| {
            CommerceServiceError::storage(format!("invalid commerce money amount: {value}"))
        })?;
    let fraction = parts.next().unwrap_or_default();
    if parts.next().is_some() || fraction.len() > 2 {
        return Err(CommerceServiceError::storage(format!(
            "invalid commerce money amount: {value}"
        )));
    }
    let mut padded = fraction.to_string();
    while padded.len() < 2 {
        padded.push('0');
    }
    let cents = if padded.is_empty() {
        0
    } else {
        padded.parse::<i64>().map_err(|_| {
            CommerceServiceError::storage(format!("invalid commerce money amount: {value}"))
        })?
    };
    whole
        .checked_mul(100)
        .and_then(|amount| amount.checked_add(cents))
        .ok_or_else(|| {
            CommerceServiceError::storage(format!("invalid commerce money amount: {value}"))
        })
}

fn commerce_money_cell(
    row: &sqlx::sqlite::SqliteRow,
    column: &str,
    field_name: &str,
) -> Result<CommerceMoney, CommerceServiceError> {
    let value = string_cell(row, column);
    let cents = money_cents(&value)
        .map_err(|_| CommerceServiceError::storage(format!("invalid {field_name}: {value}")))?;
    CommerceMoney::new(&format_money_minor(cents))
        .map_err(|message| CommerceServiceError::storage(format!("{message}: {value}")))
}

fn format_money_minor(cents: i64) -> String {
    let sign = if cents < 0 { "-" } else { "" };
    let abs = cents.abs();
    format!("{sign}{}.{:02}", abs / 100, abs % 100)
}

fn optional_string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(column).ok().flatten()
}

fn string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> String {
    optional_string_cell(row, column).unwrap_or_default()
}

fn required_status_cell(
    row: &sqlx::sqlite::SqliteRow,
    column: &str,
    source: &str,
) -> Result<String, CommerceServiceError> {
    optional_string_cell(row, column)
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
        .ok_or_else(|| missing_checkout_status_error(source))
}

fn related_status_cell(
    row: &sqlx::sqlite::SqliteRow,
    relation_column: &str,
    status_column: &str,
    source: &str,
) -> Result<String, CommerceServiceError> {
    if optional_string_cell(row, relation_column)
        .map(|value| value.trim().is_empty())
        .unwrap_or(true)
    {
        return Ok(String::new());
    }
    required_status_cell(row, status_column, source)
}

fn missing_checkout_status_error(source: &str) -> CommerceServiceError {
    match source {
        "order" => CommerceServiceError::storage("missing checkout order status from database row"),
        "payment" => {
            CommerceServiceError::storage("missing checkout payment status from database row")
        }
        value => CommerceServiceError::storage(format!(
            "missing checkout {value} status from database row"
        )),
    }
}

fn integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> i64 {
    row.try_get::<Option<i64>, _>(column)
        .ok()
        .flatten()
        .or_else(|| {
            row.try_get::<Option<i32>, _>(column)
                .ok()
                .flatten()
                .map(i64::from)
        })
        .or_else(|| {
            string_cell(row, column)
                .parse::<f64>()
                .ok()
                .map(|value| value as i64)
        })
        .unwrap_or(0)
}

struct DecimalSqlMatchKeys {
    compact: String,
    one_decimal: String,
}

fn decimal_sql_match_keys(amount: &str) -> DecimalSqlMatchKeys {
    let compact = amount
        .trim_end_matches('0')
        .trim_end_matches('.')
        .to_string();
    let one_decimal = match amount.split_once('.') {
        Some((whole, fraction)) if fraction.len() == 2 && fraction.ends_with('0') => {
            format!("{}.{}", whole, &fraction[..1])
        }
        _ => amount.to_string(),
    };
    DecimalSqlMatchKeys {
        compact,
        one_decimal,
    }
}

fn method_alias(method: &str) -> &str {
    match method {
        "card" => "stripe",
        "stripe" => "card",
        "wechatpay" => "wechat",
        _ => method,
    }
}

fn current_query_timestamp() -> String {
    let seconds = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0);
    format_unix_timestamp(seconds)
}

fn format_unix_timestamp(seconds: i64) -> String {
    let days = seconds.div_euclid(86_400);
    let seconds_of_day = seconds.rem_euclid(86_400);
    let (year, month, day) = civil_from_days(days);
    let hour = seconds_of_day / 3_600;
    let minute = (seconds_of_day % 3_600) / 60;
    let second = seconds_of_day % 60;
    format!("{year:04}-{month:02}-{day:02} {hour:02}:{minute:02}:{second:02}")
}

fn civil_from_days(days: i64) -> (i64, i64, i64) {
    let days = days + 719_468;
    let era = if days >= 0 { days } else { days - 146_096 } / 146_097;
    let day_of_era = days - era * 146_097;
    let year_of_era =
        (day_of_era - day_of_era / 1_460 + day_of_era / 36_524 - day_of_era / 146_096) / 365;
    let year = year_of_era + era * 400;
    let day_of_year = day_of_era - (365 * year_of_era + year_of_era / 4 - year_of_era / 100);
    let month_prime = (5 * day_of_year + 2) / 153;
    let day = day_of_year - (153 * month_prime + 2) / 5 + 1;
    let month = month_prime + if month_prime < 10 { 3 } else { -9 };
    let year = year + if month <= 2 { 1 } else { 0 };
    (year, month, day)
}

fn store_error(context: &str, error: sqlx::Error) -> CommerceServiceError {
    CommerceServiceError::storage(format!("{context}: {error}"))
}
