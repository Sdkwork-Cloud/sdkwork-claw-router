use sqlx::{PgPool, Postgres, Row, Transaction};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    AdminCouponBatchItem, AdminCouponItem, AdminMarketingCommandFuture, AdminMarketingStore,
    AdminPromoCodeItem, AdminRechargeRecordItem, AdminRedemptionRecordItem, AdminReferralStatItem,
    CreateAdminCouponCommand, DeleteAdminCouponCommand, GenerateAdminCouponBatchCommand,
    ListAdminCouponBatchesQuery, ListAdminCouponsQuery, ListAdminPromoCodesQuery,
    ListAdminRechargeRecordsQuery, ListAdminRedemptionRecordsQuery, ListAdminReferralStatsQuery,
    UpdateAdminPromoCodeStatusCommand,
};

const COUPON_TYPE_AMOUNT: i64 = 1;
const COUPON_TYPE_DISCOUNT: i64 = 2;
const COUPON_STATUS_DELETED: i64 = -1;
const COUPON_STATUS_INACTIVE: i64 = 0;
const COUPON_STATUS_ACTIVE: i64 = 1;
const PROMO_STATUS_AVAILABLE: i64 = 1;
const PROMO_STATUS_CLAIMED: i64 = 2;
const PROMO_STATUS_USED: i64 = 3;
const PROMO_STATUS_VOIDED: i64 = 4;
const BATCH_STATUS_ACTIVE: i64 = 1;
const BATCH_GENERATION_STATUS_COMPLETED: i64 = 2;
const TARGET_TYPE_COUPON: i32 = 71;
const TARGET_TYPE_COUPON_BATCH: i32 = 72;
const TARGET_TYPE_PROMO_CODE: i32 = 73;

#[derive(Debug, Clone)]
struct PromoCodeStatusFact {
    status: i64,
    user_id: Option<i64>,
    used_at: Option<String>,
}

#[derive(Debug, Clone)]
pub struct PostgresAdminMarketingStore {
    pool: PgPool,
}

impl PostgresAdminMarketingStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl AdminMarketingStore for PostgresAdminMarketingStore {
    fn list_coupons<'a>(
        &'a self,
        query: ListAdminCouponsQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminCouponItem>> {
        Box::pin(async move { list_coupons(&self.pool, query).await })
    }

    fn create_coupon<'a>(
        &'a self,
        command: CreateAdminCouponCommand,
    ) -> AdminMarketingCommandFuture<'a, AdminCouponItem> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin admin coupon transaction", error)
                })?;
            let template_id = insert_coupon_template(&mut tx, &command).await?;
            let coupon_id = insert_coupon(&mut tx, &command).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_coupon",
                TARGET_TYPE_COUPON,
                coupon_id,
                serde_json::json!({
                    "action": "create_coupon",
                    "couponId": coupon_id,
                    "templateId": template_id,
                    "name": &command.name,
                    "type": &command.coupon_type,
                    "value": &command.value,
                    "status": &command.status
                }),
            )
            .await?;
            let item = load_coupon_by_id(
                &mut tx,
                coupon_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("created coupon could not be reloaded"))?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit admin coupon transaction", error))?;
            Ok(item)
        })
    }

    fn delete_coupon<'a>(
        &'a self,
        command: DeleteAdminCouponCommand,
    ) -> AdminMarketingCommandFuture<'a, bool> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin admin coupon delete transaction", error)
            })?;
            let deleted = soft_delete_coupon(&mut tx, &command).await?;
            if deleted {
                insert_audit_log(
                    &mut tx,
                    &command.audit_log_uuid,
                    &command.request_id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    command.subject.operator_id,
                    command.subject.operator_type,
                    "delete_coupon",
                    TARGET_TYPE_COUPON,
                    command.coupon_id,
                    serde_json::json!({
                        "action": "delete_coupon",
                        "couponId": command.coupon_id,
                        "deleted": true
                    }),
                )
                .await?;
            }
            tx.commit().await.map_err(|error| {
                store_error("failed to commit admin coupon delete transaction", error)
            })?;
            Ok(deleted)
        })
    }

    fn list_batches<'a>(
        &'a self,
        query: ListAdminCouponBatchesQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminCouponBatchItem>> {
        Box::pin(async move { list_batches(&self.pool, query).await })
    }

    fn generate_batch<'a>(
        &'a self,
        command: GenerateAdminCouponBatchCommand,
    ) -> AdminMarketingCommandFuture<'a, (AdminCouponBatchItem, Vec<AdminPromoCodeItem>)> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin coupon batch generation transaction", error)
            })?;
            if !coupon_exists(
                &mut tx,
                command.coupon_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            {
                return Err(DomainError::not_found("coupon was not found"));
            }
            let batch_id = insert_coupon_batch(&mut tx, &command).await?;
            let codes = insert_promo_codes(&mut tx, &command, batch_id).await?;
            update_coupon_received_count(&mut tx, &command).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "generate_coupon_batch",
                TARGET_TYPE_COUPON_BATCH,
                batch_id,
                serde_json::json!({
                    "action": "generate_coupon_batch",
                    "batchId": batch_id,
                    "couponId": command.coupon_id,
                    "count": command.count,
                    "prefix": &command.prefix
                }),
            )
            .await?;
            let batch = load_batch_by_id(
                &mut tx,
                batch_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("created coupon batch could not be reloaded"))?;
            tx.commit().await.map_err(|error| {
                store_error(
                    "failed to commit coupon batch generation transaction",
                    error,
                )
            })?;
            Ok((batch, codes))
        })
    }

    fn list_promo_codes<'a>(
        &'a self,
        query: ListAdminPromoCodesQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminPromoCodeItem>> {
        Box::pin(async move { list_promo_codes(&self.pool, query).await })
    }

    fn update_promo_code_status<'a>(
        &'a self,
        command: UpdateAdminPromoCodeStatusCommand,
    ) -> AdminMarketingCommandFuture<'a, bool> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin promo code status transaction", error)
            })?;
            let updated = update_promo_code_status(&mut tx, &command).await?;
            if updated {
                if let Some(batch_id) = find_batch_for_promo_code(&mut tx, &command).await? {
                    refresh_batch_counters(&mut tx, batch_id).await?;
                }
                insert_audit_log(
                    &mut tx,
                    &command.audit_log_uuid,
                    &command.request_id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    command.subject.operator_id,
                    command.subject.operator_type,
                    "update_promo_code_status",
                    TARGET_TYPE_PROMO_CODE,
                    command.promo_code_id,
                    serde_json::json!({
                        "action": "update_promo_code_status",
                        "promoCodeId": command.promo_code_id,
                        "status": &command.status
                    }),
                )
                .await?;
            }
            tx.commit().await.map_err(|error| {
                store_error("failed to commit promo code status transaction", error)
            })?;
            Ok(updated)
        })
    }

    fn list_redemption_records<'a>(
        &'a self,
        query: ListAdminRedemptionRecordsQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminRedemptionRecordItem>> {
        Box::pin(async move { list_redemption_records(&self.pool, query).await })
    }

    fn list_recharge_records<'a>(
        &'a self,
        query: ListAdminRechargeRecordsQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminRechargeRecordItem>> {
        Box::pin(async move { list_recharge_records(&self.pool, query).await })
    }

    fn list_referral_stats<'a>(
        &'a self,
        query: ListAdminReferralStatsQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminReferralStatItem>> {
        Box::pin(async move { list_referral_stats(&self.pool, query).await })
    }
}

async fn list_coupons(
    pool: &PgPool,
    query: ListAdminCouponsQuery,
) -> DomainResult<Vec<AdminCouponItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            id::text AS id,
            COALESCE(name, '') AS name,
            type AS type_code,
            COALESCE(amount, 0)::text AS amount,
            COALESCE(discount, 0)::text AS discount,
            status AS status
        FROM plus_coupon
        WHERE tenant_id = $1
          AND organization_id = $2
          AND status >= 0
        ORDER BY updated_at DESC, id DESC
        LIMIT 500
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list admin coupons", error))?;

    rows.iter().map(coupon_from_row).collect()
}

async fn insert_coupon_template(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAdminCouponCommand,
) -> DomainResult<i64> {
    sqlx::query_scalar(
        r#"
        INSERT INTO plus_coupon_template
            (uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, name, template_code, type, description, amount, discount, min_consume, total, get_limit, received_count, used_count, status, validity_type, validity_days, can_share, stackable, scope_type, scope_value)
        VALUES
            ($1, $2::timestamp AT TIME ZONE 'UTC', $2::timestamp AT TIME ZONE 'UTC', 0, $3, $4, 1, $5, $6, $7, '', $8, $9::double precision, 0, 0, 0, 0, 0, $10, 1, 0, false, false, 1, '')
        RETURNING id
        "#,
    )
    .bind(&command.template_uuid)
    .bind(&command.requested_at)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.name)
    .bind(format!("tpl-{}", command.template_uuid))
    .bind(coupon_type_code(&command.coupon_type))
    .bind(command.amount_cents)
    .bind(command.discount_value.as_deref())
    .bind(coupon_status_code(&command.status))
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create coupon template", error))
}

async fn insert_coupon(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAdminCouponCommand,
) -> DomainResult<i64> {
    sqlx::query_scalar(
        r#"
        INSERT INTO plus_coupon
            (uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, name, redeem_code, point_cost, type, description, amount, discount, min_consume, total, get_limit, received_count, used_count, status, stackable, scope_type, scope_value)
        VALUES
            ($1, $2::timestamp AT TIME ZONE 'UTC', $2::timestamp AT TIME ZONE 'UTC', 0, $3, $4, 1, $5, $6, 0, $7, '', $8, $9::double precision, 0, 0, 0, 0, 0, $10, false, 1, '')
        RETURNING id
        "#,
    )
    .bind(&command.coupon_uuid)
    .bind(&command.requested_at)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.name)
    .bind(format!("coupon-{}", command.coupon_uuid))
    .bind(coupon_type_code(&command.coupon_type))
    .bind(command.amount_cents)
    .bind(command.discount_value.as_deref())
    .bind(coupon_status_code(&command.status))
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create coupon", error))
}

async fn load_coupon_by_id(
    tx: &mut Transaction<'_, Postgres>,
    coupon_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminCouponItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            id::text AS id,
            COALESCE(name, '') AS name,
            type AS type_code,
            COALESCE(amount, 0)::text AS amount,
            COALESCE(discount, 0)::text AS discount,
            status AS status
        FROM plus_coupon
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
          AND status >= 0
        LIMIT 1
        "#,
    )
    .bind(coupon_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load coupon", error))?;

    row.as_ref().map(coupon_from_row).transpose()
}

async fn soft_delete_coupon(
    tx: &mut Transaction<'_, Postgres>,
    command: &DeleteAdminCouponCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE plus_coupon
        SET status = $1,
            updated_at = $2::timestamp AT TIME ZONE 'UTC',
            v = COALESCE(v, 0) + 1
        WHERE id = $3
          AND tenant_id = $4
          AND organization_id = $5
          AND status >= 0
        "#,
    )
    .bind(COUPON_STATUS_DELETED)
    .bind(&command.requested_at)
    .bind(command.coupon_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete coupon", error))?;
    Ok(result.rows_affected() > 0)
}

async fn list_batches(
    pool: &PgPool,
    query: ListAdminCouponBatchesQuery,
) -> DomainResult<Vec<AdminCouponBatchItem>> {
    let rows = sqlx::query(BATCH_LIST_SQL)
        .bind(query.subject.tenant_id)
        .bind(query.subject.organization_id)
        .fetch_all(pool)
        .await
        .map_err(|error| store_error("failed to list coupon batches", error))?;

    rows.iter().map(batch_from_row).collect()
}

async fn coupon_exists(
    tx: &mut Transaction<'_, Postgres>,
    coupon_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<bool> {
    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*)
        FROM plus_coupon
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
          AND status >= 0
        "#,
    )
    .bind(coupon_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to check coupon existence", error))?;
    Ok(count > 0)
}

async fn insert_coupon_batch(
    tx: &mut Transaction<'_, Postgres>,
    command: &GenerateAdminCouponBatchCommand,
) -> DomainResult<i64> {
    let batch_no = batch_no(&command.prefix, &command.batch_uuid);
    sqlx::query_scalar(
        r#"
        INSERT INTO ops_coupon_issue_batch
            (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, coupon_id, coupon_template_id, batch_no, campaign_code, name, code_prefix, code_pattern, requested_count, generated_count, available_count, claimed_count, used_count, voided_count, generation_status, audience_filter, generated_at, created_by)
        VALUES
            ($1, $2, $3, 1, $4, $5::timestamp AT TIME ZONE 'UTC', $5::timestamp AT TIME ZONE 'UTC', 0, $6, NULL, $7, $7, $8, $9, $10, $11, $11, $11, 0, 0, 0, $12, '{}'::jsonb, $5::timestamp AT TIME ZONE 'UTC', $13)
        RETURNING id
        "#,
    )
    .bind(&command.batch_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(BATCH_STATUS_ACTIVE)
    .bind(&command.requested_at)
    .bind(command.coupon_id)
    .bind(&batch_no)
    .bind(&command.name)
    .bind(&command.prefix)
    .bind(format!("{}-{{sequence:04}}", command.prefix))
    .bind(command.count)
    .bind(BATCH_GENERATION_STATUS_COMPLETED)
    .bind(command.subject.operator_id)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create coupon issue batch", error))
}

async fn insert_promo_codes(
    tx: &mut Transaction<'_, Postgres>,
    command: &GenerateAdminCouponBatchCommand,
    batch_id: i64,
) -> DomainResult<Vec<AdminPromoCodeItem>> {
    let mut codes = Vec::with_capacity(command.count as usize);
    let mut sequence = next_promo_code_sequence(tx, command).await?;
    for _ in 0..command.count {
        loop {
            let (current_sequence, code) = next_available_promo_code(tx, command, sequence).await?;
            let uuid = format!("{}-code-{current_sequence}", command.batch_uuid);
            let id: Option<i64> = sqlx::query_scalar(
                r#"
                INSERT INTO plus_user_coupon
                    (uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, user_id, coupon_id, coupon_code, acquire_at, acquire_request_no, acquire_type, point_cost, points_refunded, expire_at, status, can_shared)
                VALUES
                    ($1, $2::timestamp AT TIME ZONE 'UTC', $2::timestamp AT TIME ZONE 'UTC', 0, $3, $4, 1, NULL, $5, $6, $2::timestamp AT TIME ZONE 'UTC', $7, 20, 0, false, NULL, $8, false)
                ON CONFLICT (coupon_code) DO NOTHING
                RETURNING id
                "#,
            )
            .bind(uuid)
            .bind(&command.requested_at)
            .bind(command.subject.tenant_id)
            .bind(command.subject.organization_id)
            .bind(command.coupon_id)
            .bind(&code)
            .bind(format!(
                "{}-{current_sequence}",
                batch_no(&command.prefix, &command.batch_uuid)
            ))
            .bind(PROMO_STATUS_AVAILABLE)
            .fetch_optional(&mut **tx)
            .await
            .map_err(|error| store_error("failed to create promo code", error))?;
            sequence = current_sequence
                .checked_add(1)
                .ok_or_else(|| DomainError::conflict("promo code sequence exhausted"))?;
            let Some(id) = id else {
                continue;
            };
            codes.push(AdminPromoCodeItem {
                id: id.to_string(),
                batch_id: batch_id.to_string(),
                code,
                status: "available".to_owned(),
                used_by: None,
                used_at: None,
            });
            break;
        }
    }
    Ok(codes)
}

async fn next_promo_code_sequence(
    tx: &mut Transaction<'_, Postgres>,
    command: &GenerateAdminCouponBatchCommand,
) -> DomainResult<i64> {
    let code_pattern = format!("{}-%", escape_like_pattern(&command.prefix));
    let existing_codes: Vec<String> = sqlx::query_scalar(
        r#"
        SELECT coupon_code
        FROM plus_user_coupon
        WHERE coupon_code LIKE $1 ESCAPE '!'
        "#,
    )
    .bind(code_pattern)
    .fetch_all(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load existing promo codes", error))?;

    let max_sequence = existing_codes
        .iter()
        .filter_map(|code| promo_code_sequence(&command.prefix, code))
        .max()
        .unwrap_or(0);
    max_sequence
        .checked_add(1)
        .ok_or_else(|| DomainError::conflict("promo code sequence exhausted"))
}

async fn next_available_promo_code(
    tx: &mut Transaction<'_, Postgres>,
    command: &GenerateAdminCouponBatchCommand,
    mut sequence: i64,
) -> DomainResult<(i64, String)> {
    loop {
        let code = format_promo_code(&command.prefix, sequence);
        if !promo_code_exists(tx, &code).await? {
            return Ok((sequence, code));
        }
        sequence = sequence
            .checked_add(1)
            .ok_or_else(|| DomainError::conflict("promo code sequence exhausted"))?;
    }
}

async fn promo_code_exists(tx: &mut Transaction<'_, Postgres>, code: &str) -> DomainResult<bool> {
    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*)
        FROM plus_user_coupon
        WHERE coupon_code = $1
        "#,
    )
    .bind(code)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to check promo code uniqueness", error))?;
    Ok(count > 0)
}

async fn update_coupon_received_count(
    tx: &mut Transaction<'_, Postgres>,
    command: &GenerateAdminCouponBatchCommand,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE plus_coupon
        SET received_count = COALESCE(received_count, 0) + $1,
            updated_at = $2::timestamp AT TIME ZONE 'UTC',
            v = COALESCE(v, 0) + 1
        WHERE id = $3
          AND tenant_id = $4
          AND organization_id = $5
        "#,
    )
    .bind(command.count)
    .bind(&command.requested_at)
    .bind(command.coupon_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update coupon received count", error))?;
    Ok(())
}

async fn load_batch_by_id(
    tx: &mut Transaction<'_, Postgres>,
    batch_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminCouponBatchItem>> {
    let row = sqlx::query(BATCH_BY_ID_SQL)
        .bind(batch_id)
        .bind(tenant_id)
        .bind(organization_id)
        .fetch_optional(&mut **tx)
        .await
        .map_err(|error| store_error("failed to load coupon batch", error))?;

    row.as_ref().map(batch_from_row).transpose()
}

async fn list_promo_codes(
    pool: &PgPool,
    query: ListAdminPromoCodesQuery,
) -> DomainResult<Vec<AdminPromoCodeItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            uc.id::text AS id,
            COALESCE(
                (
                    SELECT b.id::text
                    FROM ops_coupon_issue_batch b
                    WHERE b.tenant_id = uc.tenant_id
                      AND b.organization_id = uc.organization_id
                      AND b.coupon_id = uc.coupon_id
                      AND b.status = 1
                      AND b.deleted_at IS NULL
                      AND SUBSTR(COALESCE(uc.acquire_request_no, ''), 1, LENGTH(COALESCE(b.batch_no, '')) + 1) = COALESCE(b.batch_no, '') || '-'
                    ORDER BY b.created_at DESC, b.id DESC
                    LIMIT 1
                ),
                (
                    SELECT b.id::text
                    FROM ops_coupon_issue_batch b
                    WHERE b.tenant_id = uc.tenant_id
                      AND b.organization_id = uc.organization_id
                      AND b.coupon_id = uc.coupon_id
                      AND b.status = 1
                      AND b.deleted_at IS NULL
                      AND SUBSTR(COALESCE(uc.coupon_code, ''), 1, LENGTH(COALESCE(b.code_prefix, '')) + 1) = COALESCE(b.code_prefix, '') || '-'
                    ORDER BY b.created_at DESC, b.id DESC
                    LIMIT 1
                ),
                '0'
            ) AS batch_id,
            COALESCE(uc.coupon_code, '') AS code,
            uc.status AS status,
            uc.user_id::text AS user_id,
            uc.use_at::text AS used_at,
            COALESCE(NULLIF(u.email, ''), NULLIF(u.username, ''), '') AS used_by
        FROM plus_user_coupon uc
        LEFT JOIN plus_user u
          ON u.id = uc.user_id
         AND u.tenant_id = uc.tenant_id
         AND u.organization_id = uc.organization_id
        WHERE uc.tenant_id = $1
          AND uc.organization_id = $2
          AND uc.status > 0
        ORDER BY uc.created_at DESC, uc.id DESC
        LIMIT 1000
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list promo codes", error))?;

    rows.iter().map(promo_code_from_row).collect()
}

async fn update_promo_code_status(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateAdminPromoCodeStatusCommand,
) -> DomainResult<bool> {
    let status = promo_status_code(&command.status);
    let Some(fact) = load_promo_code_status_fact(tx, command).await? else {
        return Ok(false);
    };
    ensure_promo_status_transition(&fact, status)?;
    let result = sqlx::query(
        r#"
        UPDATE plus_user_coupon
        SET status = $1,
            use_at = CASE
                WHEN $1 = $2 THEN COALESCE(use_at, $3::timestamp AT TIME ZONE 'UTC')
                WHEN $1 = $4 THEN NULL
                ELSE use_at
            END,
            updated_at = $3::timestamp AT TIME ZONE 'UTC',
            v = COALESCE(v, 0) + 1
        WHERE id = $5
          AND tenant_id = $6
          AND organization_id = $7
          AND status > 0
        "#,
    )
    .bind(status)
    .bind(PROMO_STATUS_USED)
    .bind(&command.requested_at)
    .bind(PROMO_STATUS_AVAILABLE)
    .bind(command.promo_code_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update promo code status", error))?;
    Ok(result.rows_affected() > 0)
}

async fn load_promo_code_status_fact(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateAdminPromoCodeStatusCommand,
) -> DomainResult<Option<PromoCodeStatusFact>> {
    let row = sqlx::query(
        r#"
        SELECT
            status AS status,
            user_id,
            use_at::text AS used_at
        FROM plus_user_coupon
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
          AND status > 0
        LIMIT 1
        "#,
    )
    .bind(command.promo_code_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load promo code status", error))?;

    row.map(|row| {
        Ok(PromoCodeStatusFact {
            status: required_integer_cell(&row, "status", "promo code")?,
            user_id: row.try_get("user_id").ok().flatten(),
            used_at: optional_string_cell(&row, "used_at").filter(|value| !value.is_empty()),
        })
    })
    .transpose()
}

async fn find_batch_for_promo_code(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateAdminPromoCodeStatusCommand,
) -> DomainResult<Option<i64>> {
    sqlx::query_scalar(
        r#"
        SELECT b.id
        FROM plus_user_coupon uc
        JOIN ops_coupon_issue_batch b
          ON b.tenant_id = uc.tenant_id
         AND b.organization_id = uc.organization_id
         AND b.coupon_id = uc.coupon_id
         AND b.status = 1
         AND b.deleted_at IS NULL
         AND (
             SUBSTR(COALESCE(uc.acquire_request_no, ''), 1, LENGTH(COALESCE(b.batch_no, '')) + 1) = COALESCE(b.batch_no, '') || '-'
             OR SUBSTR(COALESCE(uc.coupon_code, ''), 1, LENGTH(COALESCE(b.code_prefix, '')) + 1) = COALESCE(b.code_prefix, '') || '-'
         )
        WHERE uc.id = $1
          AND uc.tenant_id = $2
          AND uc.organization_id = $3
        ORDER BY
          CASE
            WHEN SUBSTR(COALESCE(uc.acquire_request_no, ''), 1, LENGTH(COALESCE(b.batch_no, '')) + 1) = COALESCE(b.batch_no, '') || '-' THEN 0
            ELSE 1
          END,
          b.created_at DESC,
          b.id DESC
        LIMIT 1
        "#,
    )
    .bind(command.promo_code_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to find promo code batch", error))
}

async fn refresh_batch_counters(
    tx: &mut Transaction<'_, Postgres>,
    batch_id: i64,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE ops_coupon_issue_batch
        SET available_count = (
                SELECT COUNT(*)
                FROM plus_user_coupon uc
                WHERE uc.tenant_id = ops_coupon_issue_batch.tenant_id
                  AND uc.organization_id = ops_coupon_issue_batch.organization_id
                  AND uc.coupon_id = ops_coupon_issue_batch.coupon_id
                  AND (
                      SUBSTR(COALESCE(uc.acquire_request_no, ''), 1, LENGTH(COALESCE(ops_coupon_issue_batch.batch_no, '')) + 1) = COALESCE(ops_coupon_issue_batch.batch_no, '') || '-'
                      OR (
                          NOT EXISTS (
                              SELECT 1
                              FROM ops_coupon_issue_batch exact_batch
                              WHERE exact_batch.tenant_id = uc.tenant_id
                                AND exact_batch.organization_id = uc.organization_id
                                AND exact_batch.coupon_id = uc.coupon_id
                                AND exact_batch.status = 1
                                AND exact_batch.deleted_at IS NULL
                                AND SUBSTR(COALESCE(uc.acquire_request_no, ''), 1, LENGTH(COALESCE(exact_batch.batch_no, '')) + 1) = COALESCE(exact_batch.batch_no, '') || '-'
                          )
                          AND SUBSTR(COALESCE(uc.coupon_code, ''), 1, LENGTH(COALESCE(ops_coupon_issue_batch.code_prefix, '')) + 1) = COALESCE(ops_coupon_issue_batch.code_prefix, '') || '-'
                      )
                  )
                  AND uc.status = 1
                  AND uc.user_id IS NULL
                  AND uc.use_at IS NULL
            ),
            claimed_count = (
                SELECT COUNT(*)
                FROM plus_user_coupon uc
                WHERE uc.tenant_id = ops_coupon_issue_batch.tenant_id
                  AND uc.organization_id = ops_coupon_issue_batch.organization_id
                  AND uc.coupon_id = ops_coupon_issue_batch.coupon_id
                  AND (
                      SUBSTR(COALESCE(uc.acquire_request_no, ''), 1, LENGTH(COALESCE(ops_coupon_issue_batch.batch_no, '')) + 1) = COALESCE(ops_coupon_issue_batch.batch_no, '') || '-'
                      OR (
                          NOT EXISTS (
                              SELECT 1
                              FROM ops_coupon_issue_batch exact_batch
                              WHERE exact_batch.tenant_id = uc.tenant_id
                                AND exact_batch.organization_id = uc.organization_id
                                AND exact_batch.coupon_id = uc.coupon_id
                                AND exact_batch.status = 1
                                AND exact_batch.deleted_at IS NULL
                                AND SUBSTR(COALESCE(uc.acquire_request_no, ''), 1, LENGTH(COALESCE(exact_batch.batch_no, '')) + 1) = COALESCE(exact_batch.batch_no, '') || '-'
                          )
                          AND SUBSTR(COALESCE(uc.coupon_code, ''), 1, LENGTH(COALESCE(ops_coupon_issue_batch.code_prefix, '')) + 1) = COALESCE(ops_coupon_issue_batch.code_prefix, '') || '-'
                      )
                  )
                  AND (uc.status = 2 OR (uc.status = 1 AND uc.user_id IS NOT NULL AND uc.use_at IS NULL))
            ),
            used_count = (
                SELECT COUNT(*)
                FROM plus_user_coupon uc
                WHERE uc.tenant_id = ops_coupon_issue_batch.tenant_id
                  AND uc.organization_id = ops_coupon_issue_batch.organization_id
                  AND uc.coupon_id = ops_coupon_issue_batch.coupon_id
                  AND (
                      SUBSTR(COALESCE(uc.acquire_request_no, ''), 1, LENGTH(COALESCE(ops_coupon_issue_batch.batch_no, '')) + 1) = COALESCE(ops_coupon_issue_batch.batch_no, '') || '-'
                      OR (
                          NOT EXISTS (
                              SELECT 1
                              FROM ops_coupon_issue_batch exact_batch
                              WHERE exact_batch.tenant_id = uc.tenant_id
                                AND exact_batch.organization_id = uc.organization_id
                                AND exact_batch.coupon_id = uc.coupon_id
                                AND exact_batch.status = 1
                                AND exact_batch.deleted_at IS NULL
                                AND SUBSTR(COALESCE(uc.acquire_request_no, ''), 1, LENGTH(COALESCE(exact_batch.batch_no, '')) + 1) = COALESCE(exact_batch.batch_no, '') || '-'
                          )
                          AND SUBSTR(COALESCE(uc.coupon_code, ''), 1, LENGTH(COALESCE(ops_coupon_issue_batch.code_prefix, '')) + 1) = COALESCE(ops_coupon_issue_batch.code_prefix, '') || '-'
                      )
                  )
                  AND (uc.status = 3 OR uc.use_at IS NOT NULL)
            ),
            voided_count = (
                SELECT COUNT(*)
                FROM plus_user_coupon uc
                WHERE uc.tenant_id = ops_coupon_issue_batch.tenant_id
                  AND uc.organization_id = ops_coupon_issue_batch.organization_id
                  AND uc.coupon_id = ops_coupon_issue_batch.coupon_id
                  AND (
                      SUBSTR(COALESCE(uc.acquire_request_no, ''), 1, LENGTH(COALESCE(ops_coupon_issue_batch.batch_no, '')) + 1) = COALESCE(ops_coupon_issue_batch.batch_no, '') || '-'
                      OR (
                          NOT EXISTS (
                              SELECT 1
                              FROM ops_coupon_issue_batch exact_batch
                              WHERE exact_batch.tenant_id = uc.tenant_id
                                AND exact_batch.organization_id = uc.organization_id
                                AND exact_batch.coupon_id = uc.coupon_id
                                AND exact_batch.status = 1
                                AND exact_batch.deleted_at IS NULL
                                AND SUBSTR(COALESCE(uc.acquire_request_no, ''), 1, LENGTH(COALESCE(exact_batch.batch_no, '')) + 1) = COALESCE(exact_batch.batch_no, '') || '-'
                          )
                          AND SUBSTR(COALESCE(uc.coupon_code, ''), 1, LENGTH(COALESCE(ops_coupon_issue_batch.code_prefix, '')) + 1) = COALESCE(ops_coupon_issue_batch.code_prefix, '') || '-'
                      )
                  )
                  AND uc.status = 4
            ),
            updated_at = CURRENT_TIMESTAMP,
            version = COALESCE(version, 0) + 1
        WHERE id = $1
        "#,
    )
    .bind(batch_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to refresh coupon batch counters", error))?;
    Ok(())
}

async fn list_redemption_records(
    pool: &PgPool,
    query: ListAdminRedemptionRecordsQuery,
) -> DomainResult<Vec<AdminRedemptionRecordItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            uc.id::text AS id,
            uc.user_id::text AS user_id,
            COALESCE(NULLIF(u.email, ''), NULLIF(u.username, ''), '') AS user_name,
            COALESCE(uc.coupon_code, '') AS code,
            COALESCE(c.amount, 0)::text AS amount,
            COALESCE(uc.use_at, uc.updated_at, uc.acquire_at)::text AS time
        FROM plus_user_coupon uc
        JOIN plus_coupon c
          ON c.id = uc.coupon_id
         AND c.tenant_id = uc.tenant_id
         AND c.organization_id = uc.organization_id
        LEFT JOIN plus_user u
          ON u.id = uc.user_id
         AND u.tenant_id = uc.tenant_id
         AND u.organization_id = uc.organization_id
        WHERE uc.tenant_id = $1
          AND uc.organization_id = $2
          AND uc.user_id IS NOT NULL
          AND (uc.use_at IS NOT NULL OR uc.status = $3)
        ORDER BY COALESCE(uc.use_at, uc.updated_at, uc.acquire_at) DESC, uc.id DESC
        LIMIT 500
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(PROMO_STATUS_USED)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list redemption records", error))?;

    rows.iter()
        .map(|row| {
            Ok(AdminRedemptionRecordItem {
                id: string_cell(row, "id"),
                user_id: string_cell(row, "user_id"),
                user: string_cell(row, "user_name"),
                code: string_cell(row, "code"),
                amount: cents_string_to_money(&string_cell(row, "amount")),
                time: string_cell(row, "time"),
            })
        })
        .collect()
}

async fn list_recharge_records(
    pool: &PgPool,
    query: ListAdminRechargeRecordsQuery,
) -> DomainResult<Vec<AdminRechargeRecordItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            vr.id::text AS id,
            COALESCE(NULLIF(vr.transaction_no, ''), 'recharge-' || vr.id::text) AS trade_no,
            vr.user_id::text AS user_id,
            COALESCE(NULLIF(u.email, ''), NULLIF(u.username, ''), '') AS user_name,
            COALESCE(vr.amount, 0)::text AS amount,
            COALESCE(vr.point_amount, 0)::text AS point_amount,
            COALESCE(NULLIF(m.method_key, ''), NULLIF(m.name, ''), 'manual') AS method,
            vr.status AS status,
            COALESCE(vr.recharge_time, vr.updated_at, vr.created_at)::text AS time
        FROM plus_vip_recharge vr
        LEFT JOIN plus_vip_recharge_method m
          ON m.id = vr.recharge_method_id
        LEFT JOIN plus_user u
          ON u.id = vr.user_id
         AND u.tenant_id = vr.tenant_id
         AND u.organization_id = vr.organization_id
        WHERE vr.tenant_id = $1
          AND vr.organization_id = $2
        ORDER BY COALESCE(vr.recharge_time, vr.updated_at, vr.created_at) DESC, vr.id DESC
        LIMIT 500
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list recharge records", error))?;

    rows.iter()
        .map(|row| {
            let status = recharge_status_label(integer_cell(row, "status"))?.to_owned();
            Ok(AdminRechargeRecordItem {
                id: string_cell(row, "id"),
                trade_no: string_cell(row, "trade_no"),
                user_id: string_cell(row, "user_id"),
                user: string_cell(row, "user_name"),
                amount: decimal_money_string(&string_cell(row, "amount")),
                usd_credited: string_cell(row, "point_amount"),
                method: string_cell(row, "method"),
                status,
                time: string_cell(row, "time"),
            })
        })
        .collect()
}

async fn list_referral_stats(
    pool: &PgPool,
    query: ListAdminReferralStatsQuery,
) -> DomainResult<Vec<AdminReferralStatItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            id::text AS id,
            COALESCE(NULLIF(inviter_name_snapshot, ''), NULLIF(inviter_email_snapshot, ''), inviter_user_id::text, '') AS inviter,
            COALESCE(total_invited_count, 0) AS total_invited,
            COALESCE(total_revenue_amount, 0)::text AS total_revenue,
            COALESCE(reward_awarded_amount, 0)::text AS bonus_awarded,
            COALESCE(invite_link, '') AS link
        FROM ops_referral_stat_snapshot
        WHERE tenant_id = $1
          AND organization_id = $2
          AND status = 1
        ORDER BY snapshot_at DESC, id DESC
        LIMIT 500
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list referral stats", error))?;

    rows.iter()
        .map(|row| {
            Ok(AdminReferralStatItem {
                id: string_cell(row, "id"),
                inviter: string_cell(row, "inviter"),
                total_invited: integer_cell(row, "total_invited"),
                total_revenue: decimal_money_string(&string_cell(row, "total_revenue")),
                bonus_awarded: decimal_money_string(&string_cell(row, "bonus_awarded")),
                link: string_cell(row, "link"),
            })
        })
        .collect()
}

async fn insert_audit_log(
    tx: &mut Transaction<'_, Postgres>,
    audit_log_uuid: &str,
    request_id: &str,
    tenant_id: i64,
    organization_id: i64,
    operator_id: i64,
    operator_type: i32,
    action: &'static str,
    target_type: i32,
    target_id: i64,
    change_summary: serde_json::Value,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        INSERT INTO ops_audit_log
            (uuid, tenant_id, organization_id, action, target_type, target_id, request_id, operator_id, operator_type, change_summary)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb)
        "#,
    )
    .bind(audit_log_uuid)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(action)
    .bind(target_type)
    .bind(target_id)
    .bind(request_id)
    .bind(operator_id)
    .bind(operator_type)
    .bind(change_summary.to_string())
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to write marketing audit log", error))?;
    Ok(())
}

const BATCH_LIST_SQL: &str = r#"
SELECT
    id::text AS id,
    COALESCE(coupon_id, 0)::text AS coupon_id,
    COALESCE(name, '') AS name,
    COALESCE(generated_count, requested_count, 0) AS count,
    COALESCE(code_prefix, '') AS prefix,
    created_at::text AS created_at
FROM ops_coupon_issue_batch
WHERE tenant_id = $1
  AND organization_id = $2
  AND status = 1
  AND deleted_at IS NULL
ORDER BY created_at DESC, id DESC
LIMIT 500
"#;

const BATCH_BY_ID_SQL: &str = r#"
SELECT
    id::text AS id,
    COALESCE(coupon_id, 0)::text AS coupon_id,
    COALESCE(name, '') AS name,
    COALESCE(generated_count, requested_count, 0) AS count,
    COALESCE(code_prefix, '') AS prefix,
    created_at::text AS created_at
FROM ops_coupon_issue_batch
WHERE id = $1
  AND tenant_id = $2
  AND organization_id = $3
  AND status = 1
  AND deleted_at IS NULL
LIMIT 1
"#;

fn coupon_from_row(row: &sqlx::postgres::PgRow) -> DomainResult<AdminCouponItem> {
    let amount = string_cell(row, "amount");
    let discount = string_cell(row, "discount");
    let coupon_type =
        coupon_type_label(required_integer_cell(row, "type_code", "coupon type")?)?.to_owned();
    let value = if coupon_type == "discount" {
        discount_value_string(&discount)
    } else {
        cents_string_to_money(&amount)
    };
    let status = coupon_status_label(required_integer_cell(row, "status", "coupon")?)?.to_owned();
    Ok(AdminCouponItem {
        id: string_cell(row, "id"),
        name: string_cell(row, "name"),
        coupon_type,
        value,
        status,
    })
}

fn batch_from_row(row: &sqlx::postgres::PgRow) -> DomainResult<AdminCouponBatchItem> {
    Ok(AdminCouponBatchItem {
        id: string_cell(row, "id"),
        coupon_id: string_cell(row, "coupon_id"),
        name: string_cell(row, "name"),
        count: integer_cell(row, "count"),
        prefix: string_cell(row, "prefix"),
        created_at: string_cell(row, "created_at"),
    })
}

fn promo_code_from_row(row: &sqlx::postgres::PgRow) -> DomainResult<AdminPromoCodeItem> {
    let user_id = optional_string_cell(row, "user_id");
    let used_at = optional_string_cell(row, "used_at").filter(|value| !value.is_empty());
    let status = required_integer_cell(row, "status", "promo code")?;
    let status = promo_status_label(status, user_id.as_deref(), used_at.as_deref())?.to_owned();
    Ok(AdminPromoCodeItem {
        id: string_cell(row, "id"),
        batch_id: string_cell(row, "batch_id"),
        code: string_cell(row, "code"),
        status,
        used_by: optional_string_cell(row, "used_by").filter(|value| !value.is_empty()),
        used_at,
    })
}

fn coupon_type_code(value: &str) -> i64 {
    if value == "discount" {
        COUPON_TYPE_DISCOUNT
    } else {
        COUPON_TYPE_AMOUNT
    }
}

fn coupon_type_label(type_code: i64) -> DomainResult<&'static str> {
    match type_code {
        COUPON_TYPE_AMOUNT => Ok("amount"),
        COUPON_TYPE_DISCOUNT => Ok("discount"),
        value => Err(DomainError::new(format!(
            "unsupported admin coupon type: {value}"
        ))),
    }
}

fn coupon_status_code(value: &str) -> i64 {
    if value == "inactive" {
        COUPON_STATUS_INACTIVE
    } else {
        COUPON_STATUS_ACTIVE
    }
}

fn coupon_status_label(status: i64) -> DomainResult<&'static str> {
    match status {
        COUPON_STATUS_ACTIVE => Ok("active"),
        COUPON_STATUS_INACTIVE => Ok("inactive"),
        value => Err(DomainError::new(format!(
            "unsupported admin coupon status: {value}"
        ))),
    }
}

fn promo_status_code(value: &str) -> i64 {
    match value {
        "claimed" => PROMO_STATUS_CLAIMED,
        "used" => PROMO_STATUS_USED,
        "voided" => PROMO_STATUS_VOIDED,
        _ => PROMO_STATUS_AVAILABLE,
    }
}

fn ensure_promo_status_transition(
    fact: &PromoCodeStatusFact,
    target_status: i64,
) -> DomainResult<()> {
    let has_user = fact.user_id.is_some();
    let has_used_at = fact
        .used_at
        .as_deref()
        .map(|value| !value.is_empty())
        .unwrap_or(false);
    let is_used = fact.status == PROMO_STATUS_USED || has_used_at;

    if is_used {
        if target_status == PROMO_STATUS_USED {
            return Ok(());
        }
        return Err(DomainError::conflict("used promo code cannot be reopened"));
    }

    if target_status == PROMO_STATUS_AVAILABLE && has_user {
        return Err(DomainError::conflict(
            "claimed promo code cannot be reopened",
        ));
    }

    if target_status == PROMO_STATUS_CLAIMED && !has_user {
        return Err(DomainError::conflict(
            "promo code must be assigned to a user before it can be marked claimed",
        ));
    }

    if target_status == PROMO_STATUS_USED && !has_user {
        return Err(DomainError::conflict(
            "promo code must be claimed before it can be marked used",
        ));
    }

    Ok(())
}

fn promo_status_label(
    status: i64,
    user_id: Option<&str>,
    used_at: Option<&str>,
) -> DomainResult<&'static str> {
    match status {
        PROMO_STATUS_VOIDED => Ok("voided"),
        PROMO_STATUS_USED => Ok("used"),
        PROMO_STATUS_CLAIMED => Ok("claimed"),
        PROMO_STATUS_AVAILABLE if used_at.is_some() => Ok("used"),
        PROMO_STATUS_AVAILABLE if user_id.map(|value| !value.is_empty()).unwrap_or(false) => {
            Ok("claimed")
        }
        PROMO_STATUS_AVAILABLE => Ok("available"),
        value => Err(DomainError::new(format!(
            "unsupported admin promo code status: {value}"
        ))),
    }
}

fn recharge_status_label(status: i64) -> DomainResult<&'static str> {
    match status {
        1 => Ok("success"),
        2 => Ok("pending"),
        3 => Ok("failed"),
        4 => Ok("closed"),
        value => Err(DomainError::new(format!(
            "unsupported admin recharge status: {value}"
        ))),
    }
}

fn batch_no(prefix: &str, batch_uuid: &str) -> String {
    let suffix: String = batch_uuid.chars().take(24).collect();
    format!("{prefix}-{suffix}")
}

fn format_promo_code(prefix: &str, sequence: i64) -> String {
    format!("{prefix}-{sequence:04}")
}

fn promo_code_sequence(prefix: &str, code: &str) -> Option<i64> {
    let suffix = code.strip_prefix(prefix)?.strip_prefix('-')?;
    if suffix.is_empty() || !suffix.bytes().all(|byte| byte.is_ascii_digit()) {
        return None;
    }
    suffix.parse().ok()
}

fn escape_like_pattern(value: &str) -> String {
    let mut escaped = String::with_capacity(value.len());
    for character in value.chars() {
        if matches!(character, '!' | '%' | '_') {
            escaped.push('!');
        }
        escaped.push(character);
    }
    escaped
}

fn optional_string_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .or_else(|| row.try_get::<String, _>(column).ok())
        .or_else(|| {
            row.try_get::<Option<i64>, _>(column)
                .ok()
                .flatten()
                .map(|value| value.to_string())
        })
        .or_else(|| {
            row.try_get::<i64, _>(column)
                .ok()
                .map(|value| value.to_string())
        })
}

fn string_cell(row: &sqlx::postgres::PgRow, column: &str) -> String {
    optional_string_cell(row, column).unwrap_or_default()
}

fn integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> i64 {
    optional_integer_cell(row, column).unwrap_or(0)
}

fn required_integer_cell(
    row: &sqlx::postgres::PgRow,
    column: &str,
    source: &str,
) -> DomainResult<i64> {
    optional_integer_cell(row, column).ok_or_else(|| missing_admin_marketing_status_error(source))
}

fn optional_integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<i64> {
    row.try_get::<i64, _>(column)
        .ok()
        .or_else(|| row.try_get::<Option<i64>, _>(column).ok().flatten())
        .or_else(|| {
            string_cell(row, column)
                .split('.')
                .next()
                .and_then(|value| value.parse().ok())
        })
}

fn missing_admin_marketing_status_error(source: &str) -> DomainError {
    match source {
        "coupon" => DomainError::new("missing admin marketing coupon status from database row"),
        "coupon type" => DomainError::new("missing admin marketing coupon type from database row"),
        "promo code" => {
            DomainError::new("missing admin marketing promo code status from database row")
        }
        value => DomainError::new(format!(
            "missing admin marketing {value} status from database row"
        )),
    }
}

fn cents_string_to_money(value: &str) -> String {
    let cents = value
        .split('.')
        .next()
        .and_then(|value| value.parse::<i64>().ok())
        .unwrap_or(0);
    format!("${}.{:02}", cents / 100, cents.rem_euclid(100))
}

fn decimal_money_string(value: &str) -> String {
    let normalized = value.trim();
    if normalized.is_empty() {
        return "$0.00".to_owned();
    }
    if let Some((whole, fraction)) = normalized.split_once('.') {
        let mut cents: String = fraction.chars().take(2).collect();
        while cents.len() < 2 {
            cents.push('0');
        }
        format!("${whole}.{cents}")
    } else {
        format!("${normalized}.00")
    }
}

fn discount_value_string(value: &str) -> String {
    let trimmed = value.trim();
    if trimmed.is_empty() {
        "0.00%".to_owned()
    } else if let Some((whole, fraction)) = trimmed.split_once('.') {
        let mut decimals: String = fraction.chars().take(2).collect();
        while decimals.len() < 2 {
            decimals.push('0');
        }
        format!("{whole}.{decimals}%")
    } else {
        format!("{trimmed}.00%")
    }
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn coupon_status_label_rejects_unknown_database_status() {
        assert_eq!("active", coupon_status_label(COUPON_STATUS_ACTIVE).unwrap());
        assert_eq!(
            "inactive",
            coupon_status_label(COUPON_STATUS_INACTIVE).unwrap()
        );

        let unsupported = coupon_status_label(2).expect_err("unknown coupon status must fail");
        assert!(
            unsupported
                .to_string()
                .contains("unsupported admin coupon status: 2"),
            "{unsupported}"
        );

        let deleted = coupon_status_label(COUPON_STATUS_DELETED)
            .expect_err("deleted coupon status must fail");
        assert!(
            deleted
                .to_string()
                .contains("unsupported admin coupon status: -1"),
            "{deleted}"
        );
    }

    #[test]
    fn coupon_type_label_rejects_unknown_database_type_without_deriving_from_discount() {
        assert_eq!("amount", coupon_type_label(COUPON_TYPE_AMOUNT).unwrap());
        assert_eq!("discount", coupon_type_label(COUPON_TYPE_DISCOUNT).unwrap());

        let unsupported = coupon_type_label(99).expect_err("unknown coupon type must fail");
        assert!(
            unsupported
                .to_string()
                .contains("unsupported admin coupon type: 99"),
            "{unsupported}"
        );
    }

    #[test]
    fn missing_admin_marketing_status_error_is_source_specific() {
        assert!(missing_admin_marketing_status_error("coupon")
            .to_string()
            .contains("missing admin marketing coupon status from database row"));
        assert!(missing_admin_marketing_status_error("coupon type")
            .to_string()
            .contains("missing admin marketing coupon type from database row"));
        assert!(missing_admin_marketing_status_error("promo code")
            .to_string()
            .contains("missing admin marketing promo code status from database row"));
    }

    #[test]
    fn promo_status_label_rejects_unknown_database_status_without_deriving_valid_state() {
        assert_eq!(
            "available",
            promo_status_label(PROMO_STATUS_AVAILABLE, None, None).unwrap()
        );
        assert_eq!(
            "claimed",
            promo_status_label(PROMO_STATUS_AVAILABLE, Some("30"), None).unwrap()
        );
        assert_eq!(
            "used",
            promo_status_label(PROMO_STATUS_AVAILABLE, Some("30"), Some("2026-05-01")).unwrap()
        );
        assert_eq!(
            "voided",
            promo_status_label(PROMO_STATUS_VOIDED, Some("30"), Some("2026-05-01")).unwrap()
        );

        let positive = promo_status_label(99, Some("30"), Some("2026-05-01"))
            .expect_err("unknown promo status must fail even with used metadata");
        assert!(
            positive
                .to_string()
                .contains("unsupported admin promo code status: 99"),
            "{positive}"
        );

        let negative =
            promo_status_label(-1, None, None).expect_err("negative promo status must fail");
        assert!(
            negative
                .to_string()
                .contains("unsupported admin promo code status: -1"),
            "{negative}"
        );
    }

    #[test]
    fn recharge_status_label_rejects_unknown_database_status() {
        assert_eq!("success", recharge_status_label(1).unwrap());
        assert_eq!("pending", recharge_status_label(2).unwrap());
        assert_eq!("failed", recharge_status_label(3).unwrap());
        assert_eq!("closed", recharge_status_label(4).unwrap());

        let unsupported = recharge_status_label(0).expect_err("unknown recharge status must fail");
        assert!(
            unsupported
                .to_string()
                .contains("unsupported admin recharge status: 0"),
            "{unsupported}"
        );
    }
}
