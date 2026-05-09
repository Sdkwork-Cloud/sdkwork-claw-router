use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

use sqlx::{Row, Sqlite, SqlitePool, Transaction};

use crate::domain::DomainError;
use crate::ports::{
    UsageSettlementCommand, UsageSettlementFuture, UsageSettlementOutcome, UsageSettlementStore,
};

const ACCOUNT_TYPE_POINTS: i64 = 2;
const ASSET_TYPE_POINTS: i64 = 2;
const DIRECTION_DEBIT: i64 = 1;
const LEDGER_STATUS_SUCCESS: i64 = 2;
const TRANSACTION_TYPE_USAGE_DEBIT: i64 = 22;
const SOURCE_TYPE_USAGE_SETTLEMENT: i64 = 8;
const USAGE_SETTLEMENT_PENDING: i64 = 0;
const USAGE_SETTLEMENT_SUCCESS: i64 = 2;
const USAGE_SETTLEMENT_FAILED: i64 = 3;
const DECIMAL_SCALE: i128 = 1_000_000_000_000;

#[derive(Debug, Clone)]
pub struct SqliteUsageSettlementStore {
    pool: SqlitePool,
}

impl SqliteUsageSettlementStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl UsageSettlementStore for SqliteUsageSettlementStore {
    fn settle_pending_usage<'a>(
        &'a self,
        command: UsageSettlementCommand,
    ) -> UsageSettlementFuture<'a> {
        Box::pin(async move { settle_pending_usage(&self.pool, command).await })
    }
}

#[derive(Debug, Clone)]
struct UsageFactForSettlement {
    id: i64,
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
    request_id: String,
    trace_id: Option<String>,
    amount: String,
    tokens: i64,
    currency: String,
    pricing_snapshot: String,
}

#[derive(Debug, Clone)]
struct PointsAccount {
    id: i64,
    available_points: i64,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum SettlementStep {
    Settled(i64),
    Failed,
    Skipped,
}

async fn settle_pending_usage(
    pool: &SqlitePool,
    command: UsageSettlementCommand,
) -> Result<UsageSettlementOutcome, DomainError> {
    if command.limit <= 0 {
        return Ok(UsageSettlementOutcome {
            settled_count: 0,
            failed_count: 0,
            debited_points: 0,
        });
    }

    let mut tx = pool
        .begin()
        .await
        .map_err(|error| store_error("failed to begin usage settlement transaction", error))?;
    let usage_facts = load_settleable_usage_facts(&mut tx, &command).await?;
    let mut outcome = UsageSettlementOutcome {
        settled_count: 0,
        failed_count: 0,
        debited_points: 0,
    };
    for usage_fact in usage_facts {
        match settle_usage_fact(&mut tx, &command, &usage_fact).await? {
            SettlementStep::Settled(points) => {
                outcome.settled_count += 1;
                outcome.debited_points += points;
            }
            SettlementStep::Failed => {
                outcome.failed_count += 1;
            }
            SettlementStep::Skipped => {}
        }
    }
    tx.commit()
        .await
        .map_err(|error| store_error("failed to commit usage settlement transaction", error))?;
    Ok(outcome)
}

async fn load_settleable_usage_facts(
    tx: &mut Transaction<'_, Sqlite>,
    command: &UsageSettlementCommand,
) -> Result<Vec<UsageFactForSettlement>, DomainError> {
    let rows = sqlx::query(
        r#"
        SELECT
            id,
            tenant_id,
            organization_id,
            COALESCE(user_id, owner_id, 0) AS user_id,
            request_id,
            trace_id,
            CAST(COALESCE(NULLIF(customer_charge_amount, ''), NULLIF(cost_amount, ''), '0') AS TEXT) AS amount,
            COALESCE(total_tokens, 0) AS tokens,
            COALESCE(NULLIF(currency, ''), 'USD') AS currency,
            COALESCE(NULLIF(pricing_snapshot, ''), '{}') AS pricing_snapshot
        FROM ai_usage_fact
        WHERE (? <= 0 OR tenant_id = ?)
          AND (? <= 0 OR organization_id = ?)
          AND settlement_status IN (?, ?)
        ORDER BY COALESCE(occurred_at, ''), id
        LIMIT ?
        "#,
    )
    .bind(command.tenant_id)
    .bind(command.tenant_id)
    .bind(command.organization_id)
    .bind(command.organization_id)
    .bind(USAGE_SETTLEMENT_PENDING)
    .bind(USAGE_SETTLEMENT_FAILED)
    .bind(command.limit)
    .fetch_all(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load settleable usage facts", error))?;

    Ok(rows
        .iter()
        .map(|row| UsageFactForSettlement {
            id: integer_cell(row, "id"),
            tenant_id: integer_cell(row, "tenant_id"),
            organization_id: integer_cell(row, "organization_id"),
            user_id: integer_cell(row, "user_id"),
            request_id: string_cell(row, "request_id"),
            trace_id: optional_string_cell(row, "trace_id"),
            amount: string_cell(row, "amount"),
            tokens: integer_cell(row, "tokens"),
            currency: string_cell(row, "currency"),
            pricing_snapshot: string_cell(row, "pricing_snapshot"),
        })
        .collect())
}

async fn settle_usage_fact(
    tx: &mut Transaction<'_, Sqlite>,
    command: &UsageSettlementCommand,
    usage_fact: &UsageFactForSettlement,
) -> Result<SettlementStep, DomainError> {
    if already_settled(tx, usage_fact).await? {
        return Ok(SettlementStep::Skipped);
    }

    let points = charge_points(&usage_fact.amount)?;
    let account = ensure_points_account(tx, command, usage_fact).await?;
    let settlement_id =
        upsert_processing_settlement(tx, command, usage_fact, account.id, points).await?;
    if points == 0 {
        mark_settlement_success(tx, command, usage_fact, settlement_id, None).await?;
        return Ok(SettlementStep::Settled(0));
    }
    if account.available_points < points {
        mark_settlement_failed(
            tx,
            usage_fact,
            settlement_id,
            "INSUFFICIENT_POINTS",
            "available points are lower than usage charge points",
        )
        .await?;
        return Ok(SettlementStep::Failed);
    }

    let transaction_id = settlement_no(usage_fact.id);
    if existing_account_history_id(tx, account.id, &transaction_id)
        .await?
        .is_some()
    {
        mark_settlement_success(tx, command, usage_fact, settlement_id, None).await?;
        return Ok(SettlementStep::Skipped);
    }

    let balance_after = account.available_points - points;
    update_account_points(tx, account.id, balance_after).await?;
    let history_id = insert_account_history(
        tx,
        command,
        usage_fact,
        settlement_id,
        account.id,
        account.available_points,
        balance_after,
        points,
        &transaction_id,
    )
    .await?;
    mark_settlement_success(tx, command, usage_fact, settlement_id, Some(history_id)).await?;
    Ok(SettlementStep::Settled(points))
}

async fn already_settled(
    tx: &mut Transaction<'_, Sqlite>,
    usage_fact: &UsageFactForSettlement,
) -> Result<bool, DomainError> {
    let row = sqlx::query(
        r#"
        SELECT account_history_id
        FROM commerce_usage_settlement
        WHERE tenant_id = ?
          AND organization_id = ?
          AND usage_fact_id = ?
          AND settlement_status = ?
        LIMIT 1
        "#,
    )
    .bind(usage_fact.tenant_id)
    .bind(usage_fact.organization_id)
    .bind(usage_fact.id)
    .bind(USAGE_SETTLEMENT_SUCCESS)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to check usage settlement idempotency", error))?;
    Ok(row.is_some())
}

async fn ensure_points_account(
    tx: &mut Transaction<'_, Sqlite>,
    command: &UsageSettlementCommand,
    usage_fact: &UsageFactForSettlement,
) -> Result<PointsAccount, DomainError> {
    let existing = sqlx::query(
        r#"
        SELECT id, COALESCE(available_points, 0) AS available_points
        FROM plus_account
        WHERE tenant_id = ?
          AND organization_id = ?
          AND user_id = ?
          AND account_type = ?
          AND status = 1
        ORDER BY id ASC
        LIMIT 1
        "#,
    )
    .bind(usage_fact.tenant_id)
    .bind(usage_fact.organization_id)
    .bind(usage_fact.user_id)
    .bind(ACCOUNT_TYPE_POINTS)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load usage settlement points account", error))?;
    if let Some(row) = existing {
        return Ok(PointsAccount {
            id: integer_cell(&row, "id"),
            available_points: integer_cell(&row, "available_points"),
        });
    }

    sqlx::query(
        r#"
        INSERT INTO plus_account
            (uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, user_id, account_type, owner, owner_id, available_balance, frozen_balance, available_points, frozen_points, token_balance, frozen_token, status)
        VALUES
            (?, ?, ?, 1, ?, ?, 0, ?, ?, 0, ?, 0, 0, 0, 0, 0, 0, 1)
        "#,
    )
    .bind(stable_uuid("usage-account", usage_fact.id))
    .bind(usage_fact.tenant_id)
    .bind(usage_fact.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(usage_fact.user_id)
    .bind(ACCOUNT_TYPE_POINTS)
    .bind(usage_fact.user_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create usage settlement points account", error))?;
    let id: i64 = sqlx::query_scalar("SELECT last_insert_rowid()")
        .fetch_one(&mut **tx)
        .await
        .map_err(|error| store_error("failed to read usage settlement points account id", error))?;

    Ok(PointsAccount {
        id,
        available_points: 0,
    })
}

async fn upsert_processing_settlement(
    tx: &mut Transaction<'_, Sqlite>,
    command: &UsageSettlementCommand,
    usage_fact: &UsageFactForSettlement,
    account_id: i64,
    points: i64,
) -> Result<i64, DomainError> {
    sqlx::query(
        r#"
        INSERT INTO commerce_usage_settlement
            (uuid, tenant_id, organization_id, user_id, request_id, trace_id, status, created_at,
             metadata, settlement_no, usage_fact_id, account_id, asset_type, direction, amount,
             points, tokens, currency, price_snapshot, settlement_status)
        VALUES
            (?, ?, ?, ?, ?, ?, 1, ?, '{}', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (tenant_id, organization_id, usage_fact_id) DO UPDATE SET
            user_id = excluded.user_id,
            request_id = excluded.request_id,
            trace_id = excluded.trace_id,
            account_id = excluded.account_id,
            asset_type = excluded.asset_type,
            direction = excluded.direction,
            amount = excluded.amount,
            points = excluded.points,
            tokens = excluded.tokens,
            currency = excluded.currency,
            price_snapshot = excluded.price_snapshot,
            settlement_status = excluded.settlement_status,
            failure_code = NULL,
            failure_message = NULL
        "#,
    )
    .bind(stable_uuid("usage-settlement", usage_fact.id))
    .bind(usage_fact.tenant_id)
    .bind(usage_fact.organization_id)
    .bind(usage_fact.user_id)
    .bind(&usage_fact.request_id)
    .bind(usage_fact.trace_id.as_deref())
    .bind(&command.requested_at)
    .bind(settlement_no(usage_fact.id))
    .bind(usage_fact.id)
    .bind(account_id)
    .bind(ASSET_TYPE_POINTS)
    .bind(DIRECTION_DEBIT)
    .bind(&usage_fact.amount)
    .bind(points)
    .bind(usage_fact.tokens)
    .bind(&usage_fact.currency)
    .bind(&usage_fact.pricing_snapshot)
    .bind(USAGE_SETTLEMENT_PENDING)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to upsert usage settlement bridge", error))?;

    sqlx::query_scalar(
        r#"
        SELECT id
        FROM commerce_usage_settlement
        WHERE tenant_id = ?
          AND organization_id = ?
          AND usage_fact_id = ?
        LIMIT 1
        "#,
    )
    .bind(usage_fact.tenant_id)
    .bind(usage_fact.organization_id)
    .bind(usage_fact.id)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to read usage settlement bridge id", error))
}

async fn existing_account_history_id(
    tx: &mut Transaction<'_, Sqlite>,
    account_id: i64,
    transaction_id: &str,
) -> Result<Option<i64>, DomainError> {
    sqlx::query_scalar(
        r#"
        SELECT id
        FROM plus_account_history
        WHERE account_id = ?
          AND transaction_id = ?
        LIMIT 1
        "#,
    )
    .bind(account_id)
    .bind(transaction_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to check usage settlement ledger idempotency", error))
}

async fn update_account_points(
    tx: &mut Transaction<'_, Sqlite>,
    account_id: i64,
    balance_after: i64,
) -> Result<(), DomainError> {
    sqlx::query(
        r#"
        UPDATE plus_account
        SET available_points = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        "#,
    )
    .bind(balance_after)
    .bind(account_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update usage settlement account points", error))?;
    Ok(())
}

async fn insert_account_history(
    tx: &mut Transaction<'_, Sqlite>,
    command: &UsageSettlementCommand,
    usage_fact: &UsageFactForSettlement,
    settlement_id: i64,
    account_id: i64,
    balance_before: i64,
    balance_after: i64,
    points: i64,
    transaction_id: &str,
) -> Result<i64, DomainError> {
    sqlx::query(
        r#"
        INSERT INTO plus_account_history
            (uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v,
             account_type, asset_type, account_id, transaction_id, transaction_type,
             points_change, points_before, points_after, source_type, source_id, status,
             usage_result, remarks)
        VALUES
            (?, ?, ?, 1, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#,
    )
    .bind(stable_uuid("usage-ledger", usage_fact.id))
    .bind(usage_fact.tenant_id)
    .bind(usage_fact.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(ACCOUNT_TYPE_POINTS)
    .bind(ASSET_TYPE_POINTS)
    .bind(account_id)
    .bind(transaction_id)
    .bind(TRANSACTION_TYPE_USAGE_DEBIT)
    .bind(-points)
    .bind(balance_before)
    .bind(balance_after)
    .bind(SOURCE_TYPE_USAGE_SETTLEMENT)
    .bind(settlement_id.to_string())
    .bind(LEDGER_STATUS_SUCCESS)
    .bind(usage_result(usage_fact, settlement_id, points))
    .bind(format!("usage_request={}", usage_fact.request_id))
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert usage settlement account history", error))?;

    sqlx::query_scalar("SELECT last_insert_rowid()")
        .fetch_one(&mut **tx)
        .await
        .map_err(|error| store_error("failed to read usage settlement account history id", error))
}

async fn mark_settlement_success(
    tx: &mut Transaction<'_, Sqlite>,
    command: &UsageSettlementCommand,
    usage_fact: &UsageFactForSettlement,
    settlement_id: i64,
    history_id: Option<i64>,
) -> Result<(), DomainError> {
    sqlx::query(
        r#"
        UPDATE commerce_usage_settlement
        SET account_history_id = COALESCE(?, account_history_id),
            settlement_status = ?,
            settled_at = ?,
            failure_code = NULL,
            failure_message = NULL
        WHERE id = ?
        "#,
    )
    .bind(history_id)
    .bind(USAGE_SETTLEMENT_SUCCESS)
    .bind(&command.requested_at)
    .bind(settlement_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to mark usage settlement success", error))?;
    sqlx::query(
        r#"
        UPDATE ai_usage_fact
        SET settlement_status = ?,
            settlement_id = ?
        WHERE id = ?
        "#,
    )
    .bind(USAGE_SETTLEMENT_SUCCESS)
    .bind(settlement_id)
    .bind(usage_fact.id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to mark usage fact settled", error))?;
    Ok(())
}

async fn mark_settlement_failed(
    tx: &mut Transaction<'_, Sqlite>,
    usage_fact: &UsageFactForSettlement,
    settlement_id: i64,
    failure_code: &str,
    failure_message: &str,
) -> Result<(), DomainError> {
    sqlx::query(
        r#"
        UPDATE commerce_usage_settlement
        SET account_history_id = NULL,
            settlement_status = ?,
            settled_at = NULL,
            failure_code = ?,
            failure_message = ?
        WHERE id = ?
        "#,
    )
    .bind(USAGE_SETTLEMENT_FAILED)
    .bind(failure_code)
    .bind(truncate_message(failure_message))
    .bind(settlement_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to mark usage settlement failed", error))?;
    sqlx::query(
        r#"
        UPDATE ai_usage_fact
        SET settlement_status = ?,
            settlement_id = ?
        WHERE id = ?
        "#,
    )
    .bind(USAGE_SETTLEMENT_FAILED)
    .bind(settlement_id)
    .bind(usage_fact.id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to mark usage fact settlement failed", error))?;
    Ok(())
}

fn settlement_no(usage_fact_id: i64) -> String {
    format!("usage-settlement-{usage_fact_id}")
}

fn usage_result(usage_fact: &UsageFactForSettlement, settlement_id: i64, points: i64) -> String {
    format!(
        r#"{{"usage_fact_id":{},"settlement_id":{},"request_id":"{}","points":{}}}"#,
        usage_fact.id,
        settlement_id,
        json_escape(&usage_fact.request_id),
        points
    )
}

fn charge_points(amount: &str) -> Result<i64, DomainError> {
    let scaled = parse_decimal_scaled(amount)?;
    if scaled <= 0 {
        return Ok(0);
    }
    let tenths = scaled
        .checked_mul(10)
        .ok_or_else(|| DomainError::new("usage settlement amount is too large"))?;
    let points = (tenths + DECIMAL_SCALE - 1) / DECIMAL_SCALE;
    i64::try_from(points).map_err(|_| DomainError::new("usage settlement points overflow"))
}

fn parse_decimal_scaled(value: &str) -> Result<i128, DomainError> {
    let value = value.trim();
    if value.is_empty() {
        return Ok(0);
    }
    if value.starts_with('-') {
        return Err(DomainError::new(
            "usage settlement amount must not be negative",
        ));
    }
    let parts: Vec<&str> = value.split('.').collect();
    if parts.len() > 2 || parts[0].is_empty() || !parts[0].chars().all(|ch| ch.is_ascii_digit()) {
        return Err(DomainError::new(format!(
            "invalid usage settlement amount: {value}"
        )));
    }
    let whole = parts[0]
        .parse::<i128>()
        .map_err(|_| DomainError::new(format!("invalid usage settlement amount: {value}")))?;
    let mut scaled = whole
        .checked_mul(DECIMAL_SCALE)
        .ok_or_else(|| DomainError::new("usage settlement amount is too large"))?;
    if parts.len() == 2 {
        let fraction = parts[1];
        if fraction.len() > 12 || !fraction.chars().all(|ch| ch.is_ascii_digit()) {
            return Err(DomainError::new(format!(
                "invalid usage settlement amount: {value}"
            )));
        }
        let mut padded = fraction.to_owned();
        while padded.len() < 12 {
            padded.push('0');
        }
        let fraction_scaled = padded
            .parse::<i128>()
            .map_err(|_| DomainError::new(format!("invalid usage settlement amount: {value}")))?;
        scaled = scaled
            .checked_add(fraction_scaled)
            .ok_or_else(|| DomainError::new("usage settlement amount is too large"))?;
    }
    Ok(scaled)
}

fn stable_uuid(prefix: &str, usage_fact_id: i64) -> String {
    let mut hasher = DefaultHasher::new();
    prefix.hash(&mut hasher);
    usage_fact_id.hash(&mut hasher);
    format!("{prefix}-{:016x}", hasher.finish())
}

fn json_escape(value: &str) -> String {
    value.replace('\\', "\\\\").replace('"', "\\\"")
}

fn truncate_message(message: &str) -> String {
    message.chars().take(500).collect()
}

fn optional_string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(column).ok().flatten()
}

fn string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> String {
    optional_string_cell(row, column).unwrap_or_default()
}

fn integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> i64 {
    row.try_get::<Option<i64>, _>(column)
        .ok()
        .flatten()
        .or_else(|| {
            string_cell(row, column)
                .parse::<f64>()
                .ok()
                .map(|value| value as i64)
        })
        .unwrap_or(0)
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}
