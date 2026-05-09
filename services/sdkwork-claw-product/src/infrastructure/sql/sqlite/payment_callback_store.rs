use sqlx::{Row, Sqlite, SqlitePool, Transaction};

use crate::domain::{DecimalValue, DomainError};
use crate::ports::{
    PaymentCallbackCommand, PaymentCallbackFuture, PaymentCallbackOutcome, PaymentCallbackStatus,
    PaymentCallbackStore,
};

// Java enum alignment for callback mutations: payment success status = 2, failed status = 3,
// closed status = 5, and vip recharge success status = 1.
#[derive(Debug, Clone)]
pub struct SqlitePaymentCallbackStore {
    pool: SqlitePool,
}

impl SqlitePaymentCallbackStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl PaymentCallbackStore for SqlitePaymentCallbackStore {
    fn process_payment_callback<'a>(
        &'a self,
        command: PaymentCallbackCommand,
    ) -> PaymentCallbackFuture<'a> {
        Box::pin(async move { process_payment_callback(&self.pool, command).await })
    }
}

async fn process_payment_callback(
    pool: &SqlitePool,
    command: PaymentCallbackCommand,
) -> Result<PaymentCallbackOutcome, DomainError> {
    let mut tx = pool
        .begin()
        .await
        .map_err(|error| store_error("failed to begin payment callback transaction", error))?;
    let webhook = begin_webhook_event(&mut tx, &command).await?;
    if webhook.duplicate {
        tx.commit().await.map_err(|error| {
            store_error(
                "failed to commit duplicate payment callback transaction",
                error,
            )
        })?;
        return Ok(PaymentCallbackOutcome {
            success: true,
            duplicate: true,
            out_trade_no: command.out_trade_no,
            transaction_id: command.transaction_id,
            status: command.status.as_str().to_owned(),
            message: "duplicate webhook event ignored".to_owned(),
            credited_points: 0,
            balance: 0,
        });
    }

    let result = process_payment_status(&mut tx, &command).await;
    match result {
        Ok(outcome) => {
            finish_webhook_event(&mut tx, webhook.id, "SUCCESS", &command, &outcome.message)
                .await?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit payment callback transaction", error)
            })?;
            Ok(outcome)
        }
        Err(error) => {
            let message = error.to_string();
            finish_webhook_event(&mut tx, webhook.id, "FAILED", &command, &message).await?;
            tx.commit().await.map_err(|commit_error| {
                store_error(
                    "failed to commit failed payment callback event",
                    commit_error,
                )
            })?;
            Err(error)
        }
    }
}

#[derive(Debug, Clone, Copy)]
struct WebhookEvent {
    id: i64,
    duplicate: bool,
}

async fn begin_webhook_event(
    tx: &mut Transaction<'_, Sqlite>,
    command: &PaymentCallbackCommand,
) -> Result<WebhookEvent, DomainError> {
    let nonce_replay = sqlx::query(
        r#"
        SELECT event_id
        FROM plus_payment_webhook_event
        WHERE provider = ?
          AND nonce = ?
        LIMIT 1
        "#,
    )
    .bind(command.provider)
    .bind(&command.nonce)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to check payment callback nonce replay", error))?;
    if let Some(row) = nonce_replay {
        let existing_event_id = string_cell(&row, "event_id");
        if existing_event_id != command.event_id {
            return Err(DomainError::conflict(
                "payment callback nonce replay detected",
            ));
        }
    }

    let existing = sqlx::query(
        r#"
        SELECT id, status
        FROM plus_payment_webhook_event
        WHERE provider = ?
          AND event_id = ?
        LIMIT 1
        "#,
    )
    .bind(command.provider)
    .bind(&command.event_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load payment callback webhook event", error))?;
    if let Some(row) = existing {
        let id = integer_cell(&row, "id");
        let status = string_cell(&row, "status");
        if status == "SUCCESS" {
            return Ok(WebhookEvent {
                id,
                duplicate: true,
            });
        }
        sqlx::query(
            r#"
            UPDATE plus_payment_webhook_event
            SET status = 'RECEIVED',
                out_trade_no = ?,
                transaction_id = ?,
                payload_digest = ?,
                message = 'retrying webhook event',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            "#,
        )
        .bind(&command.out_trade_no)
        .bind(&command.transaction_id)
        .bind(&command.payload_digest)
        .bind(id)
        .execute(&mut **tx)
        .await
        .map_err(|error| store_error("failed to reset payment callback webhook event", error))?;
        return Ok(WebhookEvent {
            id,
            duplicate: false,
        });
    }

    sqlx::query(
        r#"
        INSERT INTO plus_payment_webhook_event
            (uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, provider, event_id, nonce, signature, request_timestamp, out_trade_no, transaction_id, payload_digest, status, message)
        VALUES
            (?, 0, 0, 1, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, 'RECEIVED', 'received webhook event')
        "#,
    )
    .bind(&command.event_uuid)
    .bind(&command.received_at)
    .bind(&command.received_at)
    .bind(command.provider)
    .bind(&command.event_id)
    .bind(&command.nonce)
    .bind(command.signature.as_deref())
    .bind(command.request_timestamp)
    .bind(&command.out_trade_no)
    .bind(&command.transaction_id)
    .bind(&command.payload_digest)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert payment callback webhook event", error))?;
    let id: i64 = sqlx::query_scalar("SELECT last_insert_rowid()")
        .fetch_one(&mut **tx)
        .await
        .map_err(|error| store_error("failed to read payment callback webhook event id", error))?;
    Ok(WebhookEvent {
        id,
        duplicate: false,
    })
}

async fn finish_webhook_event(
    tx: &mut Transaction<'_, Sqlite>,
    webhook_id: i64,
    status: &str,
    command: &PaymentCallbackCommand,
    message: &str,
) -> Result<(), DomainError> {
    sqlx::query(
        r#"
        UPDATE plus_payment_webhook_event
        SET status = ?,
            processed_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP,
            out_trade_no = ?,
            transaction_id = ?,
            message = ?
        WHERE id = ?
        "#,
    )
    .bind(status)
    .bind(&command.out_trade_no)
    .bind(&command.transaction_id)
    .bind(truncate_message(message))
    .bind(webhook_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to finish payment callback webhook event", error))?;
    Ok(())
}

async fn process_payment_status(
    tx: &mut Transaction<'_, Sqlite>,
    command: &PaymentCallbackCommand,
) -> Result<PaymentCallbackOutcome, DomainError> {
    let payment = load_payment_for_callback(tx, command).await?;
    match command.status {
        PaymentCallbackStatus::Success => {
            let amount = command.amount.as_ref().ok_or_else(|| {
                DomainError::conflict("payment callback amount is required for success")
            })?;
            if !money_matches(&payment.amount, amount) {
                return Err(DomainError::conflict(
                    "payment callback amount does not match payment amount",
                ));
            }
            mark_payment_success(tx, &payment, command).await?;
            fulfill_recharge_once(tx, &payment, command).await
        }
        PaymentCallbackStatus::Failed => {
            mark_payment_failed(tx, &payment, command, 3).await?;
            Ok(PaymentCallbackOutcome {
                success: true,
                duplicate: false,
                out_trade_no: command.out_trade_no.clone(),
                transaction_id: command.transaction_id.clone(),
                status: "failed".to_owned(),
                message: "payment callback marked payment failed".to_owned(),
                credited_points: 0,
                balance: 0,
            })
        }
        PaymentCallbackStatus::Closed => {
            mark_payment_failed(tx, &payment, command, 5).await?;
            Ok(PaymentCallbackOutcome {
                success: true,
                duplicate: false,
                out_trade_no: command.out_trade_no.clone(),
                transaction_id: command.transaction_id.clone(),
                status: "closed".to_owned(),
                message: "payment callback marked payment closed".to_owned(),
                credited_points: 0,
                balance: 0,
            })
        }
    }
}

#[derive(Debug, Clone)]
struct PaymentFact {
    id: i64,
    order_id: i64,
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
    amount: String,
    status: i64,
    purpose: String,
}

async fn load_payment_for_callback(
    tx: &mut Transaction<'_, Sqlite>,
    command: &PaymentCallbackCommand,
) -> Result<PaymentFact, DomainError> {
    let row = sqlx::query(
        r#"
        SELECT
            p.id,
            p.order_id,
            p.tenant_id,
            p.organization_id,
            COALESCE(o.user_id, 0) AS user_id,
            CAST(COALESCE(p.amount, 0) AS TEXT) AS amount,
            p.status AS status,
            COALESCE(p.provider, 0) AS provider,
            COALESCE(NULLIF(p.purpose, ''), 'ORDER') AS purpose
        FROM plus_payment p
        JOIN plus_order o
          ON o.id = p.order_id
         AND o.tenant_id = p.tenant_id
         AND o.organization_id = p.organization_id
        WHERE p.provider = ?
          AND p.out_trade_no = ?
        LIMIT 1
        "#,
    )
    .bind(command.provider)
    .bind(&command.out_trade_no)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load payment callback payment", error))?
    .ok_or_else(|| DomainError::conflict("payment callback payment was not found"))?;

    let provider = integer_cell(&row, "provider");
    if provider != command.provider {
        return Err(DomainError::conflict(
            "payment callback provider does not match payment provider",
        ));
    }
    Ok(PaymentFact {
        id: integer_cell(&row, "id"),
        order_id: integer_cell(&row, "order_id"),
        tenant_id: integer_cell(&row, "tenant_id"),
        organization_id: integer_cell(&row, "organization_id"),
        user_id: integer_cell(&row, "user_id"),
        amount: string_cell(&row, "amount"),
        status: required_integer_cell(&row, "status", "payment")?,
        purpose: string_cell(&row, "purpose"),
    })
}

async fn mark_payment_success(
    tx: &mut Transaction<'_, Sqlite>,
    payment: &PaymentFact,
    command: &PaymentCallbackCommand,
) -> Result<(), DomainError> {
    sqlx::query(
        r#"
        UPDATE plus_payment
        SET status = 2,
            transaction_id = ?,
            success_time = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
          AND status <> 2
        "#,
    )
    .bind(&command.transaction_id)
    .bind(payment.id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to mark callback payment success", error))?;
    sqlx::query(
        r#"
        UPDATE plus_order
        SET status = 2,
            transaction_id = ?,
            paid_amount = total_amount,
            pay_success_time = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
          AND status IN (1, 5)
        "#,
    )
    .bind(&command.transaction_id)
    .bind(payment.order_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to mark callback order paid", error))?;
    Ok(())
}

async fn mark_payment_failed(
    tx: &mut Transaction<'_, Sqlite>,
    payment: &PaymentFact,
    command: &PaymentCallbackCommand,
    payment_status: i64,
) -> Result<(), DomainError> {
    sqlx::query(
        r#"
        UPDATE plus_payment
        SET status = ?,
            transaction_id = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
          AND status <> 2
        "#,
    )
    .bind(payment_status)
    .bind(&command.transaction_id)
    .bind(payment.id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to mark callback payment failed", error))?;
    sqlx::query(
        r#"
        UPDATE plus_order
        SET status = 5,
            cancel_time = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
          AND status = 1
        "#,
    )
    .bind(payment.order_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to mark callback order cancelled", error))?;
    sqlx::query(
        r#"
        UPDATE plus_vip_recharge
        SET status = 2,
            updated_at = CURRENT_TIMESTAMP,
            remark = ?
        WHERE tenant_id = ?
          AND organization_id = ?
          AND user_id = ?
          AND transaction_no = ?
          AND status <> 1
        "#,
    )
    .bind(format!(
        "payment_callback_status={}",
        command.status.as_str()
    ))
    .bind(payment.tenant_id)
    .bind(payment.organization_id)
    .bind(payment.user_id)
    .bind(&command.out_trade_no)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to mark callback recharge failed", error))?;
    Ok(())
}

#[derive(Debug, Clone)]
struct RechargeFact {
    id: i64,
    status: i64,
    point_amount: i64,
}

async fn fulfill_recharge_once(
    tx: &mut Transaction<'_, Sqlite>,
    payment: &PaymentFact,
    command: &PaymentCallbackCommand,
) -> Result<PaymentCallbackOutcome, DomainError> {
    let recharge = sqlx::query(
        r#"
        SELECT id, status AS status, COALESCE(point_amount, 0) AS point_amount
        FROM plus_vip_recharge
        WHERE tenant_id = ?
          AND organization_id = ?
          AND user_id = ?
          AND transaction_no = ?
        LIMIT 1
        "#,
    )
    .bind(payment.tenant_id)
    .bind(payment.organization_id)
    .bind(payment.user_id)
    .bind(&command.out_trade_no)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load callback vip recharge", error))?;
    let Some(row) = recharge else {
        if payment.purpose.eq_ignore_ascii_case("POINTS") {
            return Err(DomainError::conflict(
                "payment callback points recharge record was not found",
            ));
        }
        return Ok(PaymentCallbackOutcome {
            success: true,
            duplicate: payment.status == 2,
            out_trade_no: command.out_trade_no.clone(),
            transaction_id: command.transaction_id.clone(),
            status: "success".to_owned(),
            message: "payment callback processed non-recharge payment".to_owned(),
            credited_points: 0,
            balance: 0,
        });
    };
    let recharge = RechargeFact {
        id: integer_cell(&row, "id"),
        status: required_integer_cell(&row, "status", "vip recharge")?,
        point_amount: integer_cell(&row, "point_amount"),
    };
    let account = ensure_points_account(tx, payment, command).await?;
    if recharge.status == 1 {
        return Ok(PaymentCallbackOutcome {
            success: true,
            duplicate: true,
            out_trade_no: command.out_trade_no.clone(),
            transaction_id: command.transaction_id.clone(),
            status: "success".to_owned(),
            message: "payment callback recharge was already fulfilled".to_owned(),
            credited_points: recharge.point_amount,
            balance: account.available_points,
        });
    }

    let history_count = existing_account_history_count(tx, account.id, command).await?;
    let point_change_count = existing_point_change_count(tx, payment, recharge.id).await?;
    let mut balance_after = account.available_points;
    if history_count == 0 && point_change_count == 0 {
        balance_after = account.available_points + recharge.point_amount;
        update_account_points(tx, account.id, balance_after).await?;
        insert_account_history(
            tx,
            command,
            payment,
            account.id,
            account.available_points,
            balance_after,
            recharge.point_amount,
        )
        .await?;
        insert_point_change(
            tx,
            command,
            payment,
            recharge.id,
            account.available_points,
            balance_after,
            recharge.point_amount,
        )
        .await?;
    }

    sqlx::query(
        r#"
        UPDATE plus_vip_recharge
        SET status = 1,
            recharge_time = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP,
            remark = ?
        WHERE id = ?
        "#,
    )
    .bind(format!(
        "payment_callback_transaction={}",
        command.transaction_id
    ))
    .bind(recharge.id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to mark callback recharge success", error))?;

    Ok(PaymentCallbackOutcome {
        success: true,
        duplicate: history_count > 0 || point_change_count > 0 || payment.status == 2,
        out_trade_no: command.out_trade_no.clone(),
        transaction_id: command.transaction_id.clone(),
        status: "success".to_owned(),
        message: "payment callback fulfilled recharge successfully".to_owned(),
        credited_points: recharge.point_amount,
        balance: balance_after,
    })
}

#[derive(Debug, Clone)]
struct PointsAccount {
    id: i64,
    available_points: i64,
}

async fn ensure_points_account(
    tx: &mut Transaction<'_, Sqlite>,
    payment: &PaymentFact,
    command: &PaymentCallbackCommand,
) -> Result<PointsAccount, DomainError> {
    let existing = sqlx::query(
        r#"
        SELECT id, COALESCE(available_points, 0) AS available_points
        FROM plus_account
        WHERE tenant_id = ?
          AND organization_id = ?
          AND user_id = ?
          AND account_type = 2
          AND status = 1
        ORDER BY id ASC
        LIMIT 1
        "#,
    )
    .bind(payment.tenant_id)
    .bind(payment.organization_id)
    .bind(payment.user_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load callback points account", error))?;
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
            (?, ?, ?, 1, ?, ?, 0, ?, 2, 0, ?, 0, 0, 0, 0, 0, 0, 1)
        "#,
    )
    .bind(&command.account_uuid)
    .bind(payment.tenant_id)
    .bind(payment.organization_id)
    .bind(&command.received_at)
    .bind(&command.received_at)
    .bind(payment.user_id)
    .bind(payment.user_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create callback points account", error))?;
    let id: i64 = sqlx::query_scalar("SELECT last_insert_rowid()")
        .fetch_one(&mut **tx)
        .await
        .map_err(|error| store_error("failed to read callback points account id", error))?;
    Ok(PointsAccount {
        id,
        available_points: 0,
    })
}

async fn existing_account_history_count(
    tx: &mut Transaction<'_, Sqlite>,
    account_id: i64,
    command: &PaymentCallbackCommand,
) -> Result<i64, DomainError> {
    sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_account_history
        WHERE account_id = ?
          AND transaction_id = ?
        "#,
    )
    .bind(account_id)
    .bind(&command.out_trade_no)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| {
        store_error(
            "failed to check callback account history idempotency",
            error,
        )
    })
}

async fn existing_point_change_count(
    tx: &mut Transaction<'_, Sqlite>,
    payment: &PaymentFact,
    recharge_id: i64,
) -> Result<i64, DomainError> {
    sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_vip_point_change
        WHERE tenant_id = ?
          AND organization_id = ?
          AND user_id = ?
          AND source_id = ?
          AND source_type = 'PURCHASE'
        "#,
    )
    .bind(payment.tenant_id)
    .bind(payment.organization_id)
    .bind(payment.user_id)
    .bind(recharge_id)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to check callback point change idempotency", error))
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
    .map_err(|error| store_error("failed to update callback account points", error))?;
    Ok(())
}

async fn insert_account_history(
    tx: &mut Transaction<'_, Sqlite>,
    command: &PaymentCallbackCommand,
    payment: &PaymentFact,
    account_id: i64,
    balance_before: i64,
    balance_after: i64,
    credited_points: i64,
) -> Result<(), DomainError> {
    sqlx::query(
        r#"
        INSERT INTO plus_account_history
            (uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, account_type, asset_type, account_id, transaction_id, transaction_type, points_change, points_before, points_after, source_type, source_id, status, usage_result, remarks)
        VALUES
            (?, ?, ?, 1, ?, ?, 0, 2, 2, ?, ?, 21, ?, ?, ?, 1, ?, 2, ?, ?)
        "#,
    )
    .bind(&command.account_history_uuid)
    .bind(payment.tenant_id)
    .bind(payment.organization_id)
    .bind(&command.received_at)
    .bind(&command.received_at)
    .bind(account_id)
    .bind(&command.out_trade_no)
    .bind(credited_points)
    .bind(balance_before)
    .bind(balance_after)
    .bind(payment.order_id.to_string())
    .bind("{}")
    .bind(format!("payment_callback_transaction={}", command.transaction_id))
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert callback account history", error))?;
    Ok(())
}

async fn insert_point_change(
    tx: &mut Transaction<'_, Sqlite>,
    command: &PaymentCallbackCommand,
    payment: &PaymentFact,
    recharge_id: i64,
    balance_before: i64,
    balance_after: i64,
    credited_points: i64,
) -> Result<(), DomainError> {
    sqlx::query(
        r#"
        INSERT INTO plus_vip_point_change
            (uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, user_id, change_type, change_amount, before_balance, after_balance, source_id, source_type, remark)
        VALUES
            (?, ?, ?, 1, ?, ?, 0, ?, 1, ?, ?, ?, ?, 'PURCHASE', ?)
        "#,
    )
    .bind(&command.point_change_uuid)
    .bind(payment.tenant_id)
    .bind(payment.organization_id)
    .bind(&command.received_at)
    .bind(&command.received_at)
    .bind(payment.user_id)
    .bind(credited_points)
    .bind(balance_before)
    .bind(balance_after)
    .bind(recharge_id)
    .bind(format!("payment_callback_out_trade_no={}", command.out_trade_no))
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert callback vip point change", error))?;
    Ok(())
}

fn money_matches(expected: &str, actual: &str) -> bool {
    match (DecimalValue::parse(expected), DecimalValue::parse(actual)) {
        (Ok(expected), Ok(actual)) => expected == actual,
        _ => false,
    }
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
    optional_integer_cell(row, column).unwrap_or(0)
}

fn required_integer_cell(
    row: &sqlx::sqlite::SqliteRow,
    column: &str,
    source: &str,
) -> Result<i64, DomainError> {
    optional_integer_cell(row, column).ok_or_else(|| missing_status_error(source))
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

fn missing_status_error(source: &str) -> DomainError {
    match source {
        "payment" => DomainError::new("missing payment callback payment status from database row"),
        "vip recharge" => {
            DomainError::new("missing payment callback vip recharge status from database row")
        }
        value => DomainError::new(format!(
            "missing payment callback {value} status from database row"
        )),
    }
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}
