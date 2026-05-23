use std::time::{SystemTime, UNIX_EPOCH};

use sdkwork_commerce_core::{
    CommerceAccountAssetType, CommerceCouponStatus, CommerceLedgerDirection, CommerceServiceError,
};
use sdkwork_commerce_promotion::{
    CurrentUserCouponItem, CurrentUserCouponListQuery, PointsBalance, PointsBalanceQuery,
    PointsHistoryItem, PointsHistoryQuery, RedeemCodeCommand, RedeemCodeOutcome,
};
use sqlx::{PgPool, Postgres, Row, Transaction};

const POINTS_CURRENCY_CODE: &str = "POINT";
const REDEMPTION_STATUS_SUCCEEDED: &str = "succeeded";
const REDEEM_CODE_SCOPE: &str = "coupons.redeem.create";

#[derive(Debug, Clone)]
pub struct PostgresCommercePromotionStore {
    pool: PgPool,
}

#[derive(Debug, Clone)]
struct RedeemTemplate {
    id: String,
    discount_value: String,
    total_quantity: i64,
    claimed_quantity: i64,
    expires_at: Option<String>,
}

#[derive(Debug, Clone)]
struct PointsAccount {
    id: String,
    available_points: i64,
}

impl PostgresCommercePromotionStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn list_current_user_coupons(
        &self,
        query: CurrentUserCouponListQuery,
    ) -> Result<Vec<CurrentUserCouponItem>, CommerceServiceError> {
        let rows = sqlx::query(
            r#"
            SELECT c.id,
                   COALESCE(NULLIF(c.coupon_code, ''), '-') AS code,
                   CAST(COALESCE(r.discount_amount, t.discount_value, '0') AS TEXT) AS amount,
                   CAST(COALESCE(r.redeemed_at, c.redeemed_at, c.claimed_at, c.created_at) AS TEXT) AS date,
                   c.status AS status
            FROM commerce_coupon c
            JOIN commerce_coupon_template t
              ON t.tenant_id = c.tenant_id
             AND t.id = c.template_id
            LEFT JOIN commerce_coupon_redemption r
              ON r.tenant_id = c.tenant_id
             AND r.coupon_id = c.id
             AND r.owner_user_id = c.owner_user_id
            WHERE c.tenant_id = CAST($1 AS TEXT)
              AND ((c.organization_id = CAST($2 AS TEXT)) OR (c.organization_id IS NULL AND $2 IS NULL))
              AND c.owner_user_id = CAST($3 AS TEXT)
              AND ($4 IS NULL OR c.status = $4)
            ORDER BY COALESCE(r.redeemed_at, c.redeemed_at, c.claimed_at, c.created_at) DESC NULLS LAST, c.id DESC
            "#,
        )
        .bind(&query.tenant_id)
        .bind(query.organization_id.as_deref())
        .bind(&query.owner_user_id)
        .bind(query.status.as_deref())
        .fetch_all(&self.pool)
        .await
        .map_err(|error| store_error("failed to list current user coupons", error))?;

        rows.iter()
            .map(|row| {
                let status = coupon_status_label(&required_status_cell(row, "status", "redeem")?)?
                    .to_owned();
                CurrentUserCouponItem::new(
                    &string_cell(row, "id"),
                    &string_cell(row, "code"),
                    &string_cell(row, "amount"),
                    &string_cell(row, "date"),
                    &status,
                )
            })
            .collect()
    }

    pub async fn retrieve_points_balance(
        &self,
        query: PointsBalanceQuery,
    ) -> Result<PointsBalance, CommerceServiceError> {
        let row = sqlx::query(
            r#"
            SELECT CAST(COALESCE(SUM(CASE WHEN status = 'active' THEN CAST(available_amount AS BIGINT) ELSE 0 END), 0) AS BIGINT) AS available_points,
                   CAST(COALESCE(SUM(CASE WHEN status = 'active' THEN CAST(frozen_amount AS BIGINT) ELSE 0 END), 0) AS BIGINT) AS frozen_points
            FROM commerce_account
            WHERE tenant_id = CAST($1 AS TEXT)
              AND ((organization_id = CAST($2 AS TEXT)) OR (organization_id IS NULL AND $2 IS NULL))
              AND owner_user_id = CAST($3 AS TEXT)
              AND asset_type = $4
              AND currency_code = $5
            "#,
        )
        .bind(&query.tenant_id)
        .bind(query.organization_id.as_deref())
        .bind(&query.owner_user_id)
        .bind(CommerceAccountAssetType::Points.as_str())
        .bind(POINTS_CURRENCY_CODE)
        .fetch_one(&self.pool)
        .await
        .map_err(|error| store_error("failed to retrieve points balance", error))?;

        PointsBalance::new(
            integer_cell(&row, "available_points"),
            integer_cell(&row, "frozen_points"),
        )
    }

    pub async fn list_points_history(
        &self,
        query: PointsHistoryQuery,
    ) -> Result<Vec<PointsHistoryItem>, CommerceServiceError> {
        let rows = sqlx::query(
            r#"
            SELECT id,
                   CAST(amount AS BIGINT) AS amount,
                   direction,
                   CAST(balance_after AS BIGINT) AS balance_after,
                   business_type,
                   CAST(created_at AS TEXT) AS created_at
            FROM commerce_account_ledger_entry
            WHERE tenant_id = CAST($1 AS TEXT)
              AND ((organization_id = CAST($2 AS TEXT)) OR (organization_id IS NULL AND $2 IS NULL))
              AND owner_user_id = CAST($3 AS TEXT)
              AND asset_type = $4
            ORDER BY created_at DESC NULLS LAST, id DESC
            "#,
        )
        .bind(&query.tenant_id)
        .bind(query.organization_id.as_deref())
        .bind(&query.owner_user_id)
        .bind(CommerceAccountAssetType::Points.as_str())
        .fetch_all(&self.pool)
        .await
        .map_err(|error| store_error("failed to list points history", error))?;

        rows.iter()
            .map(|row| {
                let amount = integer_cell(row, "amount").max(0);
                PointsHistoryItem::new(
                    &string_cell(row, "id"),
                    amount,
                    points_direction(&string_cell(row, "direction")),
                    integer_cell(row, "balance_after").max(0),
                    points_business_type(&string_cell(row, "business_type")),
                    &string_cell(row, "created_at"),
                )
            })
            .collect()
    }

    pub async fn redeem_code(
        &self,
        command: RedeemCodeCommand,
    ) -> Result<RedeemCodeOutcome, CommerceServiceError> {
        let mut tx = self
            .pool
            .begin()
            .await
            .map_err(|error| store_error("failed to begin redeem code transaction", error))?;
        let now = current_timestamp_string();
        let request_hash = redeem_request_hash(&command);
        if let Some(row) = load_redeem_idempotency_row(&mut tx, &command).await? {
            if string_cell(&row, "request_hash") != request_hash {
                return Err(CommerceServiceError::conflict(
                    "idempotency key was used with a different redeem code request",
                ));
            }
            if string_cell(&row, "status") == "completed" {
                let outcome = replay_redeem_outcome(&row)?;
                tx.commit()
                    .await
                    .map_err(|error| store_error("failed to commit redeem code replay", error))?;
                return Ok(outcome);
            }
            refresh_redeem_idempotency_lock(&mut tx, &command, &now).await?;
        } else {
            insert_redeem_idempotency_lock(&mut tx, &command, &request_hash, &now).await?;
        }

        let template = load_template_for_redeem(&mut tx, &command, &now).await?;
        ensure_template_can_be_redeemed(&mut tx, &command, &template).await?;
        let account = ensure_points_account(&mut tx, &command, &now).await?;
        let credited_points = coupon_credit_points(&template.discount_value)?;
        let balance_after = account.available_points + credited_points;
        let coupon_id = coupon_id(&command);
        let redemption_id = redemption_id(&command);

        insert_user_coupon(&mut tx, &command, &template, &coupon_id, &now).await?;
        insert_coupon_redemption(
            &mut tx,
            &command,
            &template,
            &coupon_id,
            &redemption_id,
            &now,
        )
        .await?;
        update_template_counters(&mut tx, &template.id).await?;
        update_account_points(&mut tx, &account.id, balance_after, &now).await?;
        insert_account_ledger(
            &mut tx,
            &command,
            &account.id,
            balance_after,
            credited_points,
            &redemption_id,
            &now,
        )
        .await?;
        let outcome = RedeemCodeOutcome::new(
            "Redeem code applied",
            &points_to_money_string(credited_points),
            credited_points,
            balance_after,
        )?;
        complete_redeem_idempotency(&mut tx, &command, &outcome, &now).await?;

        tx.commit()
            .await
            .map_err(|error| store_error("failed to commit redeem code transaction", error))?;

        Ok(outcome)
    }
}

async fn load_redeem_idempotency_row(
    tx: &mut Transaction<'_, Postgres>,
    command: &RedeemCodeCommand,
) -> Result<Option<sqlx::postgres::PgRow>, CommerceServiceError> {
    sqlx::query(
        r#"
        SELECT request_hash, response_json, status
        FROM commerce_idempotency_key
        WHERE tenant_id = $1 AND scope = $2 AND idempotency_key = $3
        LIMIT 1
        FOR UPDATE
        "#,
    )
    .bind(&command.tenant_id)
    .bind(REDEEM_CODE_SCOPE)
    .bind(&command.idempotency_key)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load redeem idempotency record", error))
}

async fn refresh_redeem_idempotency_lock(
    tx: &mut Transaction<'_, Postgres>,
    command: &RedeemCodeCommand,
    now: &str,
) -> Result<(), CommerceServiceError> {
    sqlx::query(
        r#"
        UPDATE commerce_idempotency_key
        SET status = 'locked',
            locked_until = $1,
            expires_at = $2,
            updated_at = $3
        WHERE tenant_id = $4 AND scope = $5 AND idempotency_key = $6
        "#,
    )
    .bind(now)
    .bind(now)
    .bind(now)
    .bind(&command.tenant_id)
    .bind(REDEEM_CODE_SCOPE)
    .bind(&command.idempotency_key)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to refresh redeem idempotency lock", error))?;
    Ok(())
}

async fn insert_redeem_idempotency_lock(
    tx: &mut Transaction<'_, Postgres>,
    command: &RedeemCodeCommand,
    request_hash: &str,
    now: &str,
) -> Result<(), CommerceServiceError> {
    sqlx::query(
        r#"
        INSERT INTO commerce_idempotency_key
            (id, tenant_id, organization_id, scope, idempotency_key, request_hash,
             response_json, status, locked_until, expires_at, created_at, updated_at)
        VALUES
            ($1, $2, $3, $4, $5, $6, NULL, 'locked', $7, $8, $9, $10)
        "#,
    )
    .bind(redeem_idempotency_id(command))
    .bind(&command.tenant_id)
    .bind(command.organization_id.as_deref())
    .bind(REDEEM_CODE_SCOPE)
    .bind(&command.idempotency_key)
    .bind(request_hash)
    .bind(now)
    .bind(now)
    .bind(now)
    .bind(now)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert redeem idempotency lock", error))?;
    Ok(())
}

async fn complete_redeem_idempotency(
    tx: &mut Transaction<'_, Postgres>,
    command: &RedeemCodeCommand,
    outcome: &RedeemCodeOutcome,
    now: &str,
) -> Result<(), CommerceServiceError> {
    let response_json = serde_json::json!({
        "message": outcome.message,
        "amount": outcome.amount.as_str(),
        "creditedPoints": outcome.credited_points,
        "balance": outcome.balance,
    })
    .to_string();
    sqlx::query(
        r#"
        UPDATE commerce_idempotency_key
        SET response_json = $1,
            status = 'completed',
            locked_until = NULL,
            updated_at = $2
        WHERE tenant_id = $3 AND scope = $4 AND idempotency_key = $5
        "#,
    )
    .bind(response_json)
    .bind(now)
    .bind(&command.tenant_id)
    .bind(REDEEM_CODE_SCOPE)
    .bind(&command.idempotency_key)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to complete redeem idempotency record", error))?;
    Ok(())
}

fn replay_redeem_outcome(
    row: &sqlx::postgres::PgRow,
) -> Result<RedeemCodeOutcome, CommerceServiceError> {
    let response_json = optional_string_cell(row, "response_json").ok_or_else(|| {
        CommerceServiceError::invalid_state("redeem idempotency record has no response")
    })?;
    let value: serde_json::Value = serde_json::from_str(&response_json).map_err(|error| {
        CommerceServiceError::storage(format!("invalid redeem idempotency response: {error}"))
    })?;
    let message = value
        .get("message")
        .and_then(serde_json::Value::as_str)
        .ok_or_else(|| CommerceServiceError::storage("redeem response message is missing"))?;
    let amount = value
        .get("amount")
        .and_then(serde_json::Value::as_str)
        .ok_or_else(|| CommerceServiceError::storage("redeem response amount is missing"))?;
    let credited_points = value
        .get("creditedPoints")
        .and_then(serde_json::Value::as_i64)
        .ok_or_else(|| {
            CommerceServiceError::storage("redeem response creditedPoints is missing")
        })?;
    let balance = value
        .get("balance")
        .and_then(serde_json::Value::as_i64)
        .ok_or_else(|| CommerceServiceError::storage("redeem response balance is missing"))?;

    RedeemCodeOutcome::new(message, amount, credited_points, balance)
}

async fn load_template_for_redeem(
    tx: &mut Transaction<'_, Postgres>,
    command: &RedeemCodeCommand,
    now: &str,
) -> Result<RedeemTemplate, CommerceServiceError> {
    let row = sqlx::query(
        r#"
        SELECT id,
               CAST(discount_value AS TEXT) AS discount_value,
               COALESCE(total_quantity, 0) AS total_quantity,
               COALESCE(claimed_quantity, 0) AS claimed_quantity,
               CAST(expires_at AS TEXT) AS expires_at
        FROM commerce_coupon_template
        WHERE tenant_id = CAST($1 AS TEXT)
          AND ((organization_id = CAST($2 AS TEXT)) OR (organization_id IS NULL AND $2 IS NULL))
          AND template_no = CAST($3 AS TEXT)
          AND status = 'active'
          AND (starts_at IS NULL OR starts_at <= $4)
          AND (expires_at IS NULL OR expires_at >= $4)
        ORDER BY organization_id DESC NULLS LAST, id ASC
        LIMIT 1
        FOR UPDATE
        "#,
    )
    .bind(&command.tenant_id)
    .bind(command.organization_id.as_deref())
    .bind(&command.code)
    .bind(now)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load redeem code", error))?
    .ok_or_else(|| CommerceServiceError::conflict("redeem code is invalid or unavailable"))?;

    Ok(RedeemTemplate {
        id: string_cell(&row, "id"),
        discount_value: string_cell(&row, "discount_value"),
        total_quantity: integer_cell(&row, "total_quantity"),
        claimed_quantity: integer_cell(&row, "claimed_quantity"),
        expires_at: optional_string_cell(&row, "expires_at"),
    })
}

async fn ensure_template_can_be_redeemed(
    tx: &mut Transaction<'_, Postgres>,
    command: &RedeemCodeCommand,
    template: &RedeemTemplate,
) -> Result<(), CommerceServiceError> {
    if template.total_quantity > 0 && template.claimed_quantity >= template.total_quantity {
        return Err(CommerceServiceError::conflict(
            "redeem code has reached its issue limit",
        ));
    }
    let received_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM commerce_coupon
        WHERE tenant_id = CAST($1 AS TEXT)
          AND ((organization_id = CAST($2 AS TEXT)) OR (organization_id IS NULL AND $2 IS NULL))
          AND owner_user_id = CAST($3 AS TEXT)
          AND template_id = $4
        "#,
    )
    .bind(&command.tenant_id)
    .bind(command.organization_id.as_deref())
    .bind(&command.owner_user_id)
    .bind(&template.id)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to check redeem code user limit", error))?;
    if received_count > 0 {
        return Err(CommerceServiceError::conflict(
            "redeem code user receive limit has been reached",
        ));
    }
    Ok(())
}

async fn ensure_points_account(
    tx: &mut Transaction<'_, Postgres>,
    command: &RedeemCodeCommand,
    now: &str,
) -> Result<PointsAccount, CommerceServiceError> {
    if let Some(account) = load_points_account(tx, command).await? {
        return Ok(account);
    }

    let account_id = account_id(command);
    sqlx::query(
        r#"
        INSERT INTO commerce_account
            (id, tenant_id, organization_id, owner_user_id, asset_type, currency_code,
             available_amount, frozen_amount, version, status, created_at, updated_at)
        VALUES
            ($1, $2, $3, $4, $5, $6, '0', '0', 0, 'active', $7, $8)
        ON CONFLICT (tenant_id, organization_id, owner_user_id, asset_type, currency_code)
        DO NOTHING
        "#,
    )
    .bind(&account_id)
    .bind(&command.tenant_id)
    .bind(command.organization_id.as_deref())
    .bind(&command.owner_user_id)
    .bind(CommerceAccountAssetType::Points.as_str())
    .bind(POINTS_CURRENCY_CODE)
    .bind(now)
    .bind(now)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create points account", error))?;

    load_points_account(tx, command).await?.ok_or_else(|| {
        CommerceServiceError::storage("points account was not available after creation")
    })
}

async fn load_points_account(
    tx: &mut Transaction<'_, Postgres>,
    command: &RedeemCodeCommand,
) -> Result<Option<PointsAccount>, CommerceServiceError> {
    let row = sqlx::query(
        r#"
        SELECT id, CAST(COALESCE(available_amount, '0') AS BIGINT) AS available_points
        FROM commerce_account
        WHERE tenant_id = CAST($1 AS TEXT)
          AND ((organization_id = CAST($2 AS TEXT)) OR (organization_id IS NULL AND $2 IS NULL))
          AND owner_user_id = CAST($3 AS TEXT)
          AND asset_type = $4
          AND currency_code = $5
          AND status = 'active'
        ORDER BY id ASC
        LIMIT 1
        FOR UPDATE
        "#,
    )
    .bind(&command.tenant_id)
    .bind(command.organization_id.as_deref())
    .bind(&command.owner_user_id)
    .bind(CommerceAccountAssetType::Points.as_str())
    .bind(POINTS_CURRENCY_CODE)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load points account", error))?;

    Ok(row.map(|row| PointsAccount {
        id: string_cell(&row, "id"),
        available_points: integer_cell(&row, "available_points"),
    }))
}

async fn insert_user_coupon(
    tx: &mut Transaction<'_, Postgres>,
    command: &RedeemCodeCommand,
    template: &RedeemTemplate,
    coupon_id: &str,
    now: &str,
) -> Result<(), CommerceServiceError> {
    sqlx::query(
        r#"
        INSERT INTO commerce_coupon
            (id, tenant_id, organization_id, template_id, owner_user_id, coupon_code, status,
             claimed_at, expires_at, redeemed_at, disabled_at, request_no, idempotency_key,
             created_at, updated_at)
        VALUES
            ($1, $2, $3, $4, $5, $6, 'redeemed', $7, $8, $9, NULL, $10, $11, $12, $13)
        "#,
    )
    .bind(coupon_id)
    .bind(&command.tenant_id)
    .bind(command.organization_id.as_deref())
    .bind(&template.id)
    .bind(&command.owner_user_id)
    .bind(issued_coupon_code(command))
    .bind(now)
    .bind(template.expires_at.as_deref())
    .bind(now)
    .bind(&command.request_no)
    .bind(&command.idempotency_key)
    .bind(now)
    .bind(now)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to issue user coupon", error))?;
    Ok(())
}

async fn insert_coupon_redemption(
    tx: &mut Transaction<'_, Postgres>,
    command: &RedeemCodeCommand,
    template: &RedeemTemplate,
    coupon_id: &str,
    redemption_id: &str,
    now: &str,
) -> Result<(), CommerceServiceError> {
    sqlx::query(
        r#"
        INSERT INTO commerce_coupon_redemption
            (id, tenant_id, organization_id, coupon_id, order_id, owner_user_id, discount_amount,
             status, request_no, idempotency_key, redeemed_at, rolled_back_at, created_at, updated_at)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NULL, $12, $13)
        "#,
    )
    .bind(redemption_id)
    .bind(&command.tenant_id)
    .bind(command.organization_id.as_deref())
    .bind(coupon_id)
    .bind(&command.request_no)
    .bind(&command.owner_user_id)
    .bind(&template.discount_value)
    .bind(REDEMPTION_STATUS_SUCCEEDED)
    .bind(&command.request_no)
    .bind(&command.idempotency_key)
    .bind(now)
    .bind(now)
    .bind(now)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to record coupon redemption", error))?;
    Ok(())
}

async fn update_template_counters(
    tx: &mut Transaction<'_, Postgres>,
    template_id: &str,
) -> Result<(), CommerceServiceError> {
    sqlx::query(
        r#"
        UPDATE commerce_coupon_template
        SET claimed_quantity = COALESCE(claimed_quantity, 0) + 1,
            redeemed_quantity = COALESCE(redeemed_quantity, 0) + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        "#,
    )
    .bind(template_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update coupon template counters", error))?;
    Ok(())
}

async fn update_account_points(
    tx: &mut Transaction<'_, Postgres>,
    account_id: &str,
    balance_after: i64,
    now: &str,
) -> Result<(), CommerceServiceError> {
    sqlx::query(
        r#"
        UPDATE commerce_account
        SET available_amount = $1,
            version = version + 1,
            updated_at = $2
        WHERE id = $3
        "#,
    )
    .bind(balance_after.to_string())
    .bind(now)
    .bind(account_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update account points", error))?;
    Ok(())
}

async fn insert_account_ledger(
    tx: &mut Transaction<'_, Postgres>,
    command: &RedeemCodeCommand,
    account_id: &str,
    balance_after: i64,
    credited_points: i64,
    redemption_id: &str,
    now: &str,
) -> Result<(), CommerceServiceError> {
    sqlx::query(
        r#"
        INSERT INTO commerce_account_ledger_entry
            (id, tenant_id, organization_id, account_id, owner_user_id, asset_type, direction,
             amount, balance_after, business_type, transaction_no, request_no, idempotency_key,
             source_type, source_id, remark, created_at)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'redeem', $10, $11, $12, 'commerce_coupon_redemption', $13, $14, $15)
        "#,
    )
    .bind(ledger_entry_id(command))
    .bind(&command.tenant_id)
    .bind(command.organization_id.as_deref())
    .bind(account_id)
    .bind(&command.owner_user_id)
    .bind(CommerceAccountAssetType::Points.as_str())
    .bind(CommerceLedgerDirection::Credit.as_str())
    .bind(credited_points.to_string())
    .bind(balance_after.to_string())
    .bind(&command.request_no)
    .bind(&command.request_no)
    .bind(&command.idempotency_key)
    .bind(redemption_id)
    .bind(format!("redeem_code={}", command.code))
    .bind(now)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert account ledger entry", error))?;
    Ok(())
}

fn coupon_credit_points(discount_value: &str) -> Result<i64, CommerceServiceError> {
    let cents = money_cents(discount_value)?;
    if cents <= 0 {
        Ok(0)
    } else {
        Ok((cents / 10).max(1))
    }
}

fn money_cents(value: &str) -> Result<i64, CommerceServiceError> {
    let normalized = value.trim();
    if normalized.is_empty() || normalized.starts_with('-') || normalized.starts_with('+') {
        return Err(CommerceServiceError::storage(format!(
            "invalid commerce money amount: {value}"
        )));
    }
    let mut parts = normalized.split('.');
    let integer = parts.next().unwrap_or_default();
    let fraction = parts.next();
    if parts.next().is_some()
        || integer.is_empty()
        || !integer.chars().all(|character| character.is_ascii_digit())
    {
        return Err(CommerceServiceError::storage(format!(
            "invalid commerce money amount: {value}"
        )));
    }
    let integer_cents = integer.parse::<i64>().map_err(|_| {
        CommerceServiceError::storage(format!("invalid commerce money amount: {value}"))
    })? * 100;
    let fraction_cents = match fraction {
        Some(fraction) => {
            if fraction.is_empty()
                || fraction.len() > 2
                || !fraction.chars().all(|character| character.is_ascii_digit())
            {
                return Err(CommerceServiceError::storage(format!(
                    "invalid commerce money amount: {value}"
                )));
            }
            let padded = if fraction.len() == 1 {
                format!("{fraction}0")
            } else {
                fraction.to_string()
            };
            padded.parse::<i64>().map_err(|_| {
                CommerceServiceError::storage(format!("invalid commerce money amount: {value}"))
            })?
        }
        None => 0,
    };
    Ok(integer_cents + fraction_cents)
}

fn coupon_status_label(value: &str) -> Result<&'static str, CommerceServiceError> {
    match value.trim().to_ascii_lowercase().as_str() {
        status if status == CommerceCouponStatus::Redeemed.as_str() => Ok("success"),
        status if status == CommerceCouponStatus::Active.as_str() => Ok("pending"),
        status if status == CommerceCouponStatus::Draft.as_str() => Ok("pending"),
        status if status == CommerceCouponStatus::Expired.as_str() => Ok("failed"),
        status if status == CommerceCouponStatus::Disabled.as_str() => Ok("failed"),
        status => Err(CommerceServiceError::storage(format!(
            "unsupported billing coupon status: {status}"
        ))),
    }
}

fn points_direction(value: &str) -> &'static str {
    match value.trim().to_ascii_lowercase().as_str() {
        "credit" => "in",
        "debit" => "out",
        _ => "unknown",
    }
}

fn points_business_type(value: &str) -> &'static str {
    match value.trim().to_ascii_lowercase().as_str() {
        "redeem" => "redeem",
        "recharge" => "recharge",
        "transfer" => "transfer",
        "exchange" => "exchange",
        _ => "adjustment",
    }
}

fn points_to_money_string(points: i64) -> String {
    let cents = i128::from(points) * 10;
    format!("{}.{:02}", cents / 100, cents % 100)
}

fn stable_storage_id(parts: &[&str]) -> String {
    parts
        .iter()
        .map(|part| {
            part.chars()
                .map(|character| {
                    if character.is_ascii_alphanumeric() || matches!(character, '-' | '_' | '.') {
                        character
                    } else {
                        '-'
                    }
                })
                .collect::<String>()
        })
        .collect::<Vec<_>>()
        .join("-")
}

fn account_id(command: &RedeemCodeCommand) -> String {
    stable_storage_id(&[
        "account",
        &command.tenant_id,
        command.organization_id.as_deref().unwrap_or("global"),
        &command.owner_user_id,
        "points",
        POINTS_CURRENCY_CODE,
    ])
}

fn coupon_id(command: &RedeemCodeCommand) -> String {
    stable_storage_id(&["coupon", &command.tenant_id, &command.request_no])
}

fn redemption_id(command: &RedeemCodeCommand) -> String {
    stable_storage_id(&["redemption", &command.tenant_id, &command.request_no])
}

fn ledger_entry_id(command: &RedeemCodeCommand) -> String {
    stable_storage_id(&["ledger", &command.tenant_id, &command.request_no])
}

fn issued_coupon_code(command: &RedeemCodeCommand) -> String {
    stable_storage_id(&["CP", &command.request_no])
}

fn redeem_idempotency_id(command: &RedeemCodeCommand) -> String {
    stable_storage_id(&[
        "idem",
        &command.tenant_id,
        REDEEM_CODE_SCOPE,
        &command.idempotency_key,
    ])
}

fn redeem_request_hash(command: &RedeemCodeCommand) -> String {
    stable_storage_id(&[
        "redeem",
        &command.tenant_id,
        command.organization_id.as_deref().unwrap_or("global"),
        &command.owner_user_id,
        &command.code,
        &command.request_no,
    ])
}

fn optional_string_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(column).ok().flatten()
}

fn string_cell(row: &sqlx::postgres::PgRow, column: &str) -> String {
    optional_string_cell(row, column).unwrap_or_default()
}

fn required_status_cell(
    row: &sqlx::postgres::PgRow,
    column: &str,
    source: &str,
) -> Result<String, CommerceServiceError> {
    let value = string_cell(row, column);
    if value.trim().is_empty() {
        Err(missing_billing_status_error(source))
    } else {
        Ok(value)
    }
}

fn missing_billing_status_error(source: &str) -> CommerceServiceError {
    let message = match source {
        "redeem" => "missing billing redeem status from database row".to_owned(),
        source => format!("missing billing {source} status from database row"),
    };
    CommerceServiceError::storage(message)
}

fn integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> i64 {
    row.try_get::<i64, _>(column)
        .or_else(|_| row.try_get::<i32, _>(column).map(i64::from))
        .unwrap_or(0)
}

fn store_error(context: &str, error: sqlx::Error) -> CommerceServiceError {
    CommerceServiceError::storage(format!("{context}: {error}"))
}

fn current_timestamp_string() -> String {
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
