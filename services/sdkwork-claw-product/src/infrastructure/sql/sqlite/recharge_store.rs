use std::time::{SystemTime, UNIX_EPOCH};

use sqlx::{Row, Sqlite, SqlitePool, Transaction};

use crate::domain::{DecimalValue, DomainError};
use crate::ports::{
    RechargeCommandFuture, RechargePackage, RechargeReadFuture, RechargeStore, RechargeSubject,
    SubmitRechargeCommand, SubmitRechargeOutcome,
};

const CUSTOM_RECHARGE_TYPE: i64 = 1;
const PACK_RECHARGE_TYPE: i64 = 2;

const LOAD_RECHARGE_PACKAGES: &str = r#"
SELECT
    p.id,
    CAST(p.price AS TEXT) AS rmb,
    COALESCE(p.point_amount, 0) AS bonus
FROM plus_vip_recharge_pack p
LEFT JOIN plus_sku s
    ON CAST(s.price AS TEXT) = CAST(p.price AS TEXT)
   AND s.status = 1
LEFT JOIN plus_product pr
    ON pr.id = s.product_id
   AND pr.status = 1
WHERE (p.tenant_id = ?1 OR p.tenant_id = 0)
  AND (p.organization_id = ?2 OR p.organization_id = 0)
  AND p.status = 1
  AND (p.valid_from IS NULL OR p.valid_from <= ?3)
  AND (p.valid_to IS NULL OR p.valid_to >= ?3)
GROUP BY p.id, p.price, p.point_amount, p.sort_weight
ORDER BY COALESCE(p.sort_weight, 0) ASC, p.price ASC, p.id ASC
LIMIT 100
"#;

const LOAD_RECHARGE_PACK_FOR_AMOUNT: &str = r#"
SELECT
    id,
    COALESCE(NULLIF(name, ''), 'Points recharge package') AS name,
    CAST(price AS TEXT) AS price,
    COALESCE(point_amount, 0) AS bonus,
    recharge_type AS recharge_type
FROM plus_vip_recharge_pack
WHERE (tenant_id = ?1 OR tenant_id = 0)
  AND (organization_id = ?2 OR organization_id = 0)
  AND status = 1
  AND CAST(price AS TEXT) IN (?3, ?4, ?5)
  AND (valid_from IS NULL OR valid_from <= ?6)
  AND (valid_to IS NULL OR valid_to >= ?6)
ORDER BY tenant_id DESC, organization_id DESC, COALESCE(sort_weight, 0) ASC, id ASC
LIMIT 1
"#;

const LOAD_RECHARGE_METHOD: &str = r#"
SELECT
    id,
    method_key
FROM plus_vip_recharge_method
WHERE (tenant_id = ?1 OR tenant_id = 0)
  AND (organization_id = ?2 OR organization_id = 0)
  AND status = 1
  AND (LOWER(method_key) = ?3 OR LOWER(method_key) = ?4)
ORDER BY tenant_id DESC, organization_id DESC, COALESCE(sort_weight, 0) ASC, id ASC
LIMIT 1
"#;

const LOAD_RECHARGE_PRODUCT_SKU: &str = r#"
SELECT
    pr.id AS product_id,
    s.id AS sku_id,
    COALESCE(pr.category_id, 0) AS category_id,
    COALESCE(NULLIF(s.name, ''), NULLIF(s.title, ''), NULLIF(pr.title, ''), 'Points recharge') AS product_name,
    COALESCE(NULLIF(s.specs, ''), '{}') AS sku_spec
FROM plus_sku s
JOIN plus_product pr ON pr.id = s.product_id
WHERE (s.tenant_id = ?1 OR s.tenant_id = 0)
  AND (s.organization_id = ?2 OR s.organization_id = 0)
  AND (pr.tenant_id = ?1 OR pr.tenant_id = 0)
  AND (pr.organization_id = ?2 OR pr.organization_id = 0)
  AND s.status = 1
  AND pr.status = 1
ORDER BY
    CASE WHEN CAST(s.price AS TEXT) IN (?3, ?4, ?5) THEN 0 ELSE 1 END,
    pr.id ASC,
    s.id ASC
LIMIT 1
"#;

#[derive(Debug, Clone)]
pub struct SqliteRechargeStore {
    pool: SqlitePool,
}

impl SqliteRechargeStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl RechargeStore for SqliteRechargeStore {
    fn load_recharge_packages<'a>(
        &'a self,
        subject: Option<RechargeSubject>,
    ) -> RechargeReadFuture<'a, Vec<RechargePackage>> {
        Box::pin(async move {
            let subject = subject.ok_or_else(|| {
                DomainError::new("trusted request subject is required for recharge packages")
            })?;
            load_recharge_packages(&self.pool, subject).await
        })
    }

    fn submit_recharge<'a>(&'a self, command: SubmitRechargeCommand) -> RechargeCommandFuture<'a> {
        Box::pin(async move { submit_recharge(&self.pool, command).await })
    }
}

async fn load_recharge_packages(
    pool: &SqlitePool,
    subject: RechargeSubject,
) -> Result<Vec<RechargePackage>, DomainError> {
    let rows = sqlx::query(LOAD_RECHARGE_PACKAGES)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(current_query_timestamp())
        .fetch_all(pool)
        .await
        .map_err(sql_error)?;

    rows.iter()
        .map(|row| {
            Ok(RechargePackage {
                id: integer_cell(row, "id").to_string(),
                rmb: decimal_string_cell(row, "rmb", "recharge package rmb")?,
                bonus: integer_cell(row, "bonus"),
            })
        })
        .collect()
}

async fn submit_recharge(
    pool: &SqlitePool,
    command: SubmitRechargeCommand,
) -> Result<SubmitRechargeOutcome, DomainError> {
    let mut tx = pool
        .begin()
        .await
        .map_err(|error| store_error("failed to begin recharge transaction", error))?;
    let method = load_recharge_method(&mut tx, &command).await?;
    let pack = load_recharge_pack(&mut tx, &command).await?;
    let product = load_recharge_product_sku(&mut tx, &command).await?;
    let base_points = recharge_base_points(&command.amount)?;
    let bonus_points = pack.as_ref().map(|item| item.bonus_points).unwrap_or(0);
    let credited_points = base_points + bonus_points;
    let subject = pack
        .as_ref()
        .map(|item| item.name.clone())
        .unwrap_or_else(|| "Points recharge".to_owned());
    let recharge_type = pack
        .as_ref()
        .map(|item| item.recharge_type)
        .unwrap_or(CUSTOM_RECHARGE_TYPE);
    let product_name = pack
        .as_ref()
        .map(|item| item.name.clone())
        .unwrap_or_else(|| product.product_name.clone());

    let order_id = insert_order(
        &mut tx,
        &command,
        &method,
        &product,
        &subject,
        credited_points,
    )
    .await?;
    insert_order_item(
        &mut tx,
        &command,
        &method,
        &product,
        order_id,
        &product_name,
    )
    .await?;
    insert_payment(
        &mut tx,
        &command,
        &method,
        &product,
        order_id,
        credited_points,
    )
    .await?;
    insert_vip_recharge(
        &mut tx,
        &command,
        &method,
        pack.as_ref().map(|item| item.id),
        credited_points,
        recharge_type,
    )
    .await?;
    tx.commit()
        .await
        .map_err(|error| store_error("failed to commit recharge transaction", error))?;

    Ok(SubmitRechargeOutcome {
        success: true,
        order_no: command.order_sn,
        amount: command.amount,
        points: credited_points,
        payment_method: method.method_key,
        status: "pending".to_owned(),
    })
}

#[derive(Debug, Clone)]
struct RechargeMethod {
    id: i64,
    method_key: String,
    channel: i64,
    provider: i64,
    product_type: String,
}

#[derive(Debug, Clone)]
struct RechargePack {
    id: i64,
    name: String,
    bonus_points: i64,
    recharge_type: i64,
}

#[derive(Debug, Clone)]
struct RechargeProductSku {
    product_id: i64,
    sku_id: i64,
    category_id: i64,
    product_name: String,
    sku_spec: String,
}

async fn load_recharge_method(
    tx: &mut Transaction<'_, Sqlite>,
    command: &SubmitRechargeCommand,
) -> Result<RechargeMethod, DomainError> {
    let alias = method_alias(&command.method);
    let row = sqlx::query(LOAD_RECHARGE_METHOD)
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(&command.method)
        .bind(alias)
        .fetch_optional(&mut **tx)
        .await
        .map_err(|error| store_error("failed to load recharge method", error))?
        .ok_or_else(|| DomainError::conflict("recharge payment method is unavailable"))?;
    let method_key = string_cell(&row, "method_key").to_ascii_lowercase();
    let (channel, provider, product_type) = payment_mapping(&method_key);
    Ok(RechargeMethod {
        id: integer_cell(&row, "id"),
        method_key,
        channel,
        provider,
        product_type: product_type.to_owned(),
    })
}

async fn load_recharge_pack(
    tx: &mut Transaction<'_, Sqlite>,
    command: &SubmitRechargeCommand,
) -> Result<Option<RechargePack>, DomainError> {
    let amount_match = decimal_sql_match_keys(&command.amount);
    let row = sqlx::query(LOAD_RECHARGE_PACK_FOR_AMOUNT)
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(&command.amount)
        .bind(&amount_match.compact)
        .bind(&amount_match.one_decimal)
        .bind(&command.requested_at)
        .fetch_optional(&mut **tx)
        .await
        .map_err(|error| store_error("failed to load recharge package", error))?;

    row.map(|row| {
        Ok(RechargePack {
            id: integer_cell(&row, "id"),
            name: string_cell(&row, "name"),
            bonus_points: integer_cell(&row, "bonus").max(0),
            recharge_type: validate_recharge_type(required_integer_cell(
                &row,
                "recharge_type",
                "recharge package",
            )?)?,
        })
    })
    .transpose()
}

async fn load_recharge_product_sku(
    tx: &mut Transaction<'_, Sqlite>,
    command: &SubmitRechargeCommand,
) -> Result<RechargeProductSku, DomainError> {
    let amount_match = decimal_sql_match_keys(&command.amount);
    let row = sqlx::query(LOAD_RECHARGE_PRODUCT_SKU)
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(&command.amount)
        .bind(&amount_match.compact)
        .bind(&amount_match.one_decimal)
        .fetch_optional(&mut **tx)
        .await
        .map_err(|error| store_error("failed to load recharge product sku", error))?
        .ok_or_else(|| DomainError::conflict("recharge product sku is unavailable"))?;

    Ok(RechargeProductSku {
        product_id: integer_cell(&row, "product_id"),
        sku_id: integer_cell(&row, "sku_id"),
        category_id: integer_cell(&row, "category_id"),
        product_name: string_cell(&row, "product_name"),
        sku_spec: string_cell(&row, "sku_spec"),
    })
}

async fn insert_order(
    tx: &mut Transaction<'_, Sqlite>,
    command: &SubmitRechargeCommand,
    method: &RechargeMethod,
    product: &RechargeProductSku,
    subject: &str,
    credited_points: i64,
) -> Result<i64, DomainError> {
    sqlx::query(
        r#"
        INSERT INTO plus_order
            (uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, subject, order_type, owner, owner_id, user_id, order_sn, out_trade_no, total_amount, paid_amount, paid_points_amount, status, category_id, content_id, product_amount, shipping_amount, discount_amount, tax_amount, refunded_amount, currency, payment_method, source_channel, merchant_remark, payment_expire_time, refund_status, payment_provider, payment_product_type)
        VALUES
            (?, ?, ?, 1, ?, ?, 0, ?, 4, 1, ?, ?, ?, ?, ?, 0, ?, 1, ?, ?, ?, 0, 0, 0, 0, 'CNY', ?, 'CONSOLE', ?, ?, 0, ?, ?)
        "#,
    )
    .bind(&command.order_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(subject)
    .bind(command.subject.user_id)
    .bind(command.subject.user_id)
    .bind(&command.order_sn)
    .bind(&command.out_trade_no)
    .bind(&command.amount)
    .bind(credited_points)
    .bind(product.category_id)
    .bind(product.product_id)
    .bind(&command.amount)
    .bind(&method.method_key)
    .bind(format!("points={credited_points}"))
    .bind(&command.expire_at)
    .bind(method.provider)
    .bind(&method.product_type)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert recharge order", error))?;
    sqlx::query_scalar("SELECT last_insert_rowid()")
        .fetch_one(&mut **tx)
        .await
        .map_err(|error| store_error("failed to read recharge order id", error))
}

async fn insert_order_item(
    tx: &mut Transaction<'_, Sqlite>,
    command: &SubmitRechargeCommand,
    method: &RechargeMethod,
    product: &RechargeProductSku,
    order_id: i64,
    product_name: &str,
) -> Result<(), DomainError> {
    sqlx::query(
        r#"
        INSERT INTO plus_order_item
            (uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, order_id, category_id, product_type, product_id, sku_id, quantity, unit_price, total_amount, content_id, product_name, sku_spec, discount_amount, paid_amount, refunded_amount, currency, refund_status, review_status, payment_provider, payment_product_type)
        VALUES
            (?, ?, ?, 1, ?, ?, 0, ?, ?, 'VIRTUAL', ?, ?, 1, ?, ?, ?, ?, ?, 0, 0, 0, 'CNY', 0, 0, ?, ?)
        "#,
    )
    .bind(&command.order_item_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(order_id)
    .bind(product.category_id)
    .bind(product.product_id)
    .bind(product.sku_id)
    .bind(&command.amount)
    .bind(&command.amount)
    .bind(product.product_id)
    .bind(product_name)
    .bind(&product.sku_spec)
    .bind(method.provider)
    .bind(&method.product_type)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert recharge order item", error))?;
    Ok(())
}

async fn insert_payment(
    tx: &mut Transaction<'_, Sqlite>,
    command: &SubmitRechargeCommand,
    method: &RechargeMethod,
    product: &RechargeProductSku,
    order_id: i64,
    credited_points: i64,
) -> Result<(), DomainError> {
    sqlx::query(
        r#"
        INSERT INTO plus_payment
            (uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, subject, purpose, order_id, out_trade_no, channel, provider, product_type, status, amount, expire_time, remark, content_id, pay_objects, metadata, client_info)
        VALUES
            (?, ?, ?, 1, ?, ?, 0, ?, 'POINTS', ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?)
        "#,
    )
    .bind(&command.payment_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind("Points recharge payment")
    .bind(order_id)
    .bind(&command.out_trade_no)
    .bind(method.channel)
    .bind(method.provider)
    .bind(&method.product_type)
    .bind(&command.amount)
    .bind(&command.expire_at)
    .bind(format!("points={credited_points}"))
    .bind(product.product_id)
    .bind("{}")
    .bind(format!(r#"{{"points":{credited_points}}}"#))
    .bind("{}")
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert recharge payment", error))?;
    Ok(())
}

async fn insert_vip_recharge(
    tx: &mut Transaction<'_, Sqlite>,
    command: &SubmitRechargeCommand,
    method: &RechargeMethod,
    pack_id: Option<i64>,
    credited_points: i64,
    recharge_type: i64,
) -> Result<(), DomainError> {
    sqlx::query(
        r#"
        INSERT INTO plus_vip_recharge
            (uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, user_id, amount, point_amount, recharge_type, recharge_time, transaction_no, status, remark, recharge_method_id, recharge_pack_id)
        VALUES
            (?, ?, ?, 1, ?, ?, 0, ?, ?, ?, ?, ?, ?, 3, ?, ?, ?)
        "#,
    )
    .bind(&command.recharge_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(command.subject.user_id)
    .bind(&command.amount)
    .bind(credited_points)
    .bind(recharge_type)
    .bind(&command.requested_at)
    .bind(&command.out_trade_no)
    .bind(format!("method={}", method.method_key))
    .bind(method.id)
    .bind(pack_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert vip recharge", error))?;
    Ok(())
}

fn recharge_base_points(amount: &str) -> Result<i64, DomainError> {
    let parsed_amount =
        DecimalValue::parse(amount).map_err(|_| DomainError::new("invalid recharge amount"))?;
    if parsed_amount <= DecimalValue::ZERO {
        return Err(DomainError::new("invalid recharge amount"));
    }
    let cents = money_cents(amount)?;
    Ok(((cents + 5) / 10).max(1))
}

fn method_alias(method: &str) -> &str {
    match method {
        "card" => "stripe",
        "stripe" => "card",
        "wechatpay" => "wechat",
        _ => method,
    }
}

fn payment_mapping(method: &str) -> (i64, i64, &'static str) {
    match method {
        "wechat" | "wechatpay" => (11, 1, "native"),
        "card" | "stripe" => (42, 7, "pc"),
        _ => (12, 2, "pc"),
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

fn optional_string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(column).ok().flatten()
}

fn string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> String {
    optional_string_cell(row, column).unwrap_or_default()
}

fn integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> i64 {
    optional_integer_cell(row, column).unwrap_or(0)
}

fn required_integer_cell(
    row: &sqlx::sqlite::SqliteRow,
    column: &str,
    source: &str,
) -> Result<i64, DomainError> {
    optional_integer_cell(row, column).ok_or_else(|| {
        if source == "recharge package" && column == "recharge_type" {
            DomainError::new("missing recharge package recharge_type from database row")
        } else {
            DomainError::new(format!("missing {source} {column} from database row"))
        }
    })
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
        .or_else(|| {
            string_cell(row, column)
                .parse::<f64>()
                .ok()
                .map(|value| value as i64)
        })
}

fn decimal_string_cell(
    row: &sqlx::sqlite::SqliteRow,
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

fn validate_recharge_type(value: i64) -> Result<i64, DomainError> {
    match value {
        CUSTOM_RECHARGE_TYPE | PACK_RECHARGE_TYPE => Ok(value),
        value => Err(DomainError::new(format!(
            "invalid recharge package recharge_type from database row: {value}"
        ))),
    }
}

struct DecimalSqlMatchKeys {
    compact: String,
    one_decimal: String,
}

fn decimal_sql_match_keys(amount: &str) -> DecimalSqlMatchKeys {
    let compact = amount
        .trim_end_matches('0')
        .trim_end_matches('.')
        .to_owned();
    let one_decimal = match amount.split_once('.') {
        Some((whole, fraction)) if fraction.len() == 2 && fraction.ends_with('0') => {
            format!("{}.{}", whole, &fraction[..1])
        }
        _ => amount.to_owned(),
    };
    DecimalSqlMatchKeys {
        compact,
        one_decimal,
    }
}

fn money_cents(amount: &str) -> Result<i64, DomainError> {
    let mut parts = amount.split('.');
    let whole = parts
        .next()
        .unwrap_or_default()
        .parse::<i64>()
        .map_err(|_| DomainError::new("invalid recharge amount"))?;
    let fraction = parts.next().unwrap_or_default();
    if parts.next().is_some() || fraction.len() > 2 {
        return Err(DomainError::new("invalid recharge amount"));
    }
    let mut padded = fraction.to_owned();
    while padded.len() < 2 {
        padded.push('0');
    }
    let cents = if padded.is_empty() {
        0
    } else {
        padded
            .parse::<i64>()
            .map_err(|_| DomainError::new("invalid recharge amount"))?
    };
    whole
        .checked_mul(100)
        .and_then(|value| value.checked_add(cents))
        .ok_or_else(|| DomainError::new("invalid recharge amount"))
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
    fn decimal_value_string_rejects_invalid_database_amount() {
        assert_eq!(
            "12.30",
            decimal_value_string("12.3", "recharge package rmb").unwrap()
        );

        let unsupported = decimal_value_string("not-money", "recharge package rmb")
            .expect_err("invalid package money must fail");
        assert!(
            unsupported
                .to_string()
                .contains("invalid recharge package rmb: not-money"),
            "{unsupported}"
        );
    }

    #[test]
    fn validate_recharge_type_rejects_unknown_package_type() {
        assert_eq!(CUSTOM_RECHARGE_TYPE, validate_recharge_type(1).unwrap());
        assert_eq!(PACK_RECHARGE_TYPE, validate_recharge_type(2).unwrap());
        assert_eq!(
            "invalid recharge package recharge_type from database row: 0",
            validate_recharge_type(0).unwrap_err().to_string()
        );
    }
}
