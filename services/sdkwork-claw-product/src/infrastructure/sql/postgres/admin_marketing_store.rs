use sqlx::{PgPool, Postgres, Row, Transaction};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    AdminCouponBatchItem, AdminCouponItem, AdminExchangeRuleItem, AdminMarketingCommandFuture,
    AdminMarketingStore, AdminPaymentAttemptItem, AdminPromoCodeItem, AdminRechargePackageItem,
    AdminRechargePackageStatus, AdminRechargeRecordItem, AdminRedemptionRecordItem,
    AdminReferralStatItem, CreateAdminCouponCommand, CreateAdminRechargePackageCommand,
    DeleteAdminCouponCommand, DeleteAdminRechargePackageCommand, GenerateAdminCouponBatchCommand,
    ListAdminCouponBatchesQuery, ListAdminCouponsQuery, ListAdminExchangeRulesQuery,
    ListAdminPaymentAttemptsQuery, ListAdminPromoCodesQuery, ListAdminRechargePackagesQuery,
    ListAdminRechargeRecordsQuery, ListAdminRedemptionRecordsQuery, ListAdminReferralStatsQuery,
    LoadAdminRechargeRecordQuery, UpdateAdminCouponCommand, UpdateAdminExchangeRuleCommand,
    UpdateAdminPromoCodeStatusCommand, UpdateAdminRechargePackageCommand,
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
const TARGET_TYPE_RECHARGE_PACKAGE: i32 = 74;
const TARGET_TYPE_EXCHANGE_RULE: i32 = 75;
const RECHARGE_PACKAGE_TYPE: i64 = 2;
const RECHARGE_PRODUCT_CATEGORY_ID: i64 = 1;
const ACCOUNT_EXCHANGE_POINTS_TO_CASH_RATE: &str = "POINTS_TO_CASH_RATE";

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

    fn update_coupon<'a>(
        &'a self,
        command: UpdateAdminCouponCommand,
    ) -> AdminMarketingCommandFuture<'a, AdminCouponItem> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin admin coupon update transaction", error)
            })?;
            let updated = update_coupon_row(&mut tx, &command).await?;
            if !updated {
                return Err(DomainError::not_found("coupon was not found"));
            }
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "update_coupon",
                TARGET_TYPE_COUPON,
                command.coupon_id,
                serde_json::json!({
                    "action": "update_coupon",
                    "couponId": command.coupon_id,
                    "name": &command.name,
                    "type": &command.coupon_type,
                    "value": &command.value,
                    "status": &command.status
                }),
            )
            .await?;
            let item = load_coupon_by_id(
                &mut tx,
                command.coupon_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("updated coupon could not be reloaded"))?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit admin coupon update transaction", error)
            })?;
            Ok(item)
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

    fn load_recharge_record<'a>(
        &'a self,
        query: LoadAdminRechargeRecordQuery,
    ) -> AdminMarketingCommandFuture<'a, Option<AdminRechargeRecordItem>> {
        Box::pin(async move { load_recharge_record(&self.pool, query).await })
    }

    fn list_recharge_packages<'a>(
        &'a self,
        query: ListAdminRechargePackagesQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminRechargePackageItem>> {
        Box::pin(async move { list_recharge_packages(&self.pool, query).await })
    }

    fn list_exchange_rules<'a>(
        &'a self,
        query: ListAdminExchangeRulesQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminExchangeRuleItem>> {
        Box::pin(async move { list_exchange_rules(&self.pool, query).await })
    }

    fn create_recharge_package<'a>(
        &'a self,
        command: CreateAdminRechargePackageCommand,
    ) -> AdminMarketingCommandFuture<'a, AdminRechargePackageItem> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error(
                    "failed to begin recharge package creation transaction",
                    error,
                )
            })?;
            let package_id = insert_recharge_package(&mut tx, &command).await?;
            sync_recharge_package_product_for_create(&mut tx, &command).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_recharge_package",
                TARGET_TYPE_RECHARGE_PACKAGE,
                package_id,
                serde_json::json!({
                    "action": "create_recharge_package",
                    "packageId": package_id,
                    "rmb": &command.rmb,
                    "bonus": command.bonus,
                    "status": recharge_package_status_label(command.status)
                }),
            )
            .await?;
            let item = load_recharge_package_by_id(
                &mut tx,
                package_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("created recharge package could not be reloaded"))?;
            tx.commit().await.map_err(|error| {
                store_error(
                    "failed to commit recharge package creation transaction",
                    error,
                )
            })?;
            Ok(item)
        })
    }

    fn update_recharge_package<'a>(
        &'a self,
        command: UpdateAdminRechargePackageCommand,
    ) -> AdminMarketingCommandFuture<'a, AdminRechargePackageItem> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin recharge package update transaction", error)
            })?;
            let previous_rmb = load_recharge_package_amount(
                &mut tx,
                command.package_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?;
            let updated = update_recharge_package_row(&mut tx, &command).await?;
            if !updated {
                return Err(DomainError::not_found("recharge package was not found"));
            }
            sync_recharge_package_product_for_update(&mut tx, &command, previous_rmb.as_deref())
                .await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "update_recharge_package",
                TARGET_TYPE_RECHARGE_PACKAGE,
                command.package_id,
                serde_json::json!({
                    "action": "update_recharge_package",
                    "packageId": command.package_id,
                    "rmb": &command.rmb,
                    "bonus": command.bonus,
                    "status": recharge_package_status_label(command.status)
                }),
            )
            .await?;
            let item = load_recharge_package_by_id(
                &mut tx,
                command.package_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("updated recharge package could not be reloaded"))?;
            tx.commit().await.map_err(|error| {
                store_error(
                    "failed to commit recharge package update transaction",
                    error,
                )
            })?;
            Ok(item)
        })
    }

    fn delete_recharge_package<'a>(
        &'a self,
        command: DeleteAdminRechargePackageCommand,
    ) -> AdminMarketingCommandFuture<'a, bool> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin recharge package delete transaction", error)
            })?;
            let deleted = soft_delete_recharge_package(&mut tx, &command).await?;
            if deleted {
                disable_recharge_product_and_sku_for_amount(&mut tx, &command).await?;
                insert_audit_log(
                    &mut tx,
                    &command.audit_log_uuid,
                    &command.request_id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    command.subject.operator_id,
                    command.subject.operator_type,
                    "delete_recharge_package",
                    TARGET_TYPE_RECHARGE_PACKAGE,
                    command.package_id,
                    serde_json::json!({
                        "action": "delete_recharge_package",
                        "packageId": command.package_id,
                        "deleted": true
                    }),
                )
                .await?;
            }
            tx.commit().await.map_err(|error| {
                store_error(
                    "failed to commit recharge package delete transaction",
                    error,
                )
            })?;
            Ok(deleted)
        })
    }

    fn update_exchange_rule<'a>(
        &'a self,
        command: UpdateAdminExchangeRuleCommand,
    ) -> AdminMarketingCommandFuture<'a, AdminExchangeRuleItem> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin exchange rule update transaction", error)
            })?;
            let exchange_rule_id = upsert_exchange_rule(&mut tx, &command).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "update_exchange_rule",
                TARGET_TYPE_EXCHANGE_RULE,
                exchange_rule_id,
                serde_json::json!({
                    "action": "update_exchange_rule",
                    "exchangeRuleId": exchange_rule_id,
                    "sourceAssetType": &command.source_asset_type,
                    "targetAssetType": &command.target_asset_type,
                    "rate": &command.rate
                }),
            )
            .await?;
            let item = load_exchange_rule_by_id(
                &mut tx,
                exchange_rule_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("updated exchange rule could not be reloaded"))?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit exchange rule update transaction", error)
            })?;
            Ok(item)
        })
    }

    fn list_payment_attempts<'a>(
        &'a self,
        query: ListAdminPaymentAttemptsQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminPaymentAttemptItem>> {
        Box::pin(async move { list_payment_attempts(&self.pool, query).await })
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

async fn update_coupon_row(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateAdminCouponCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE plus_coupon
        SET name = $1,
            type = $2,
            amount = $3,
            discount = $4::double precision,
            status = $5,
            updated_at = $6::timestamp AT TIME ZONE 'UTC',
            v = COALESCE(v, 0) + 1
        WHERE id = $7
          AND tenant_id = $8
          AND organization_id = $9
          AND status >= 0
        "#,
    )
    .bind(&command.name)
    .bind(coupon_type_code(&command.coupon_type))
    .bind(command.amount_cents)
    .bind(command.discount_value.as_deref())
    .bind(coupon_status_code(&command.status))
    .bind(&command.requested_at)
    .bind(command.coupon_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update coupon", error))?;
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
        LEFT JOIN iam_user u
          ON u.id = uc.user_id::text
         AND u.tenant_id = uc.tenant_id::text
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
        LEFT JOIN iam_user u
          ON u.id = uc.user_id::text
         AND u.tenant_id = uc.tenant_id::text
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
        LEFT JOIN iam_user u
          ON u.id = vr.user_id::text
         AND u.tenant_id = vr.tenant_id::text
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

    rows.iter().map(recharge_record_from_row).collect()
}

async fn load_recharge_record(
    pool: &PgPool,
    query: LoadAdminRechargeRecordQuery,
) -> DomainResult<Option<AdminRechargeRecordItem>> {
    let row = sqlx::query(
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
        LEFT JOIN iam_user u
          ON u.id = vr.user_id::text
         AND u.tenant_id = vr.tenant_id::text
        WHERE vr.tenant_id = $1
          AND vr.organization_id = $2
          AND (
              vr.transaction_no = $3
              OR 'recharge-' || vr.id::text = $3
          )
        LIMIT 1
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(&query.order_no)
    .fetch_optional(pool)
    .await
    .map_err(|error| store_error("failed to load recharge record", error))?;

    row.as_ref().map(recharge_record_from_row).transpose()
}

async fn list_recharge_packages(
    pool: &PgPool,
    query: ListAdminRechargePackagesQuery,
) -> DomainResult<Vec<AdminRechargePackageItem>> {
    let rows = if let Some(status) = query.status {
        sqlx::query(
            r#"
            SELECT
                id::text AS id,
                price::text AS rmb,
                COALESCE(point_amount, 0)::text AS bonus
            FROM plus_vip_recharge_pack
            WHERE tenant_id = $1
              AND organization_id = $2
              AND status = $3
            ORDER BY COALESCE(sort_weight, 0) ASC, id ASC
            LIMIT 500
            "#,
        )
        .bind(query.subject.tenant_id)
        .bind(query.subject.organization_id)
        .bind(recharge_package_status_code(status))
        .fetch_all(pool)
        .await
    } else {
        sqlx::query(
            r#"
            SELECT
                id::text AS id,
                price::text AS rmb,
                COALESCE(point_amount, 0)::text AS bonus
            FROM plus_vip_recharge_pack
            WHERE tenant_id = $1
              AND organization_id = $2
              AND status >= 0
            ORDER BY COALESCE(sort_weight, 0) ASC, id ASC
            LIMIT 500
            "#,
        )
        .bind(query.subject.tenant_id)
        .bind(query.subject.organization_id)
        .fetch_all(pool)
        .await
    }
    .map_err(|error| store_error("failed to list recharge packages", error))?;

    rows.iter().map(recharge_package_from_row).collect()
}

async fn list_exchange_rules(
    pool: &PgPool,
    query: ListAdminExchangeRulesQuery,
) -> DomainResult<Vec<AdminExchangeRuleItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            COALESCE(NULLIF(uuid, ''), id::text) AS id,
            COALESCE(config_key, '') AS config_key,
            COALESCE(config_value, 0)::text AS rate
        FROM plus_account_exchange_config
        WHERE tenant_id = $1
          AND organization_id = $2
          AND config_key = $3
        ORDER BY updated_at DESC, id DESC
        LIMIT 500
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(ACCOUNT_EXCHANGE_POINTS_TO_CASH_RATE)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list exchange rules", error))?;

    rows.iter()
        .map(exchange_rule_from_row)
        .filter(|item| match item {
            Ok(item) => exchange_rule_matches_filters(item, &query),
            Err(_) => true,
        })
        .collect()
}

async fn insert_recharge_package(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAdminRechargePackageCommand,
) -> DomainResult<i64> {
    sqlx::query_scalar(
        r#"
        INSERT INTO plus_vip_recharge_pack
            (uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, app_id, name, description, price, point_amount, vip_duration_days, status, sort_weight, valid_from, valid_to, remark, recharge_type)
        VALUES
            ($1, $2::timestamp AT TIME ZONE 'UTC', $2::timestamp AT TIME ZONE 'UTC', 0, $3, $4, 1, 1, $5, '', $6::numeric, $7, NULL, $8, 0, NULL, NULL, '', $9)
        RETURNING id
        "#,
    )
    .bind(&command.package_uuid)
    .bind(&command.requested_at)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(recharge_package_name(&command.rmb))
    .bind(&command.rmb)
    .bind(command.bonus)
    .bind(recharge_package_status_code(command.status))
    .bind(RECHARGE_PACKAGE_TYPE)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create recharge package", error))
}

async fn update_recharge_package_row(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateAdminRechargePackageCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE plus_vip_recharge_pack
        SET name = $1,
            price = $2::numeric,
            point_amount = $3,
            status = $4,
            recharge_type = $5,
            updated_at = $6::timestamp AT TIME ZONE 'UTC',
            v = COALESCE(v, 0) + 1
        WHERE id = $7
          AND tenant_id = $8
          AND organization_id = $9
          AND status >= 0
        "#,
    )
    .bind(recharge_package_name(&command.rmb))
    .bind(&command.rmb)
    .bind(command.bonus)
    .bind(recharge_package_status_code(command.status))
    .bind(RECHARGE_PACKAGE_TYPE)
    .bind(&command.requested_at)
    .bind(command.package_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update recharge package", error))?;
    Ok(result.rows_affected() > 0)
}

async fn soft_delete_recharge_package(
    tx: &mut Transaction<'_, Postgres>,
    command: &DeleteAdminRechargePackageCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE plus_vip_recharge_pack
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
    .bind(command.package_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete recharge package", error))?;
    Ok(result.rows_affected() > 0)
}

async fn load_recharge_package_amount(
    tx: &mut Transaction<'_, Postgres>,
    package_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<String>> {
    let value: Option<String> = sqlx::query_scalar(
        r#"
        SELECT price::text
        FROM plus_vip_recharge_pack
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
        LIMIT 1
        "#,
    )
    .bind(package_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load recharge package amount", error))?;
    value
        .as_deref()
        .map(|amount| canonical_money_string(amount, "recharge package rmb"))
        .transpose()
}

async fn load_recharge_package_by_id(
    tx: &mut Transaction<'_, Postgres>,
    package_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminRechargePackageItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            id::text AS id,
            price::text AS rmb,
            COALESCE(point_amount, 0)::text AS bonus
        FROM plus_vip_recharge_pack
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
          AND status >= 0
        LIMIT 1
        "#,
    )
    .bind(package_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load recharge package", error))?;

    row.as_ref().map(recharge_package_from_row).transpose()
}

async fn upsert_exchange_rule(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateAdminExchangeRuleCommand,
) -> DomainResult<i64> {
    let updated = sqlx::query(
        r#"
        UPDATE plus_account_exchange_config
        SET config_value = $1::numeric,
            remarks = $2,
            updated_at = $3::timestamp AT TIME ZONE 'UTC',
            v = COALESCE(v, 0) + 1
        WHERE tenant_id = $4
          AND organization_id = $5
          AND config_key = $6
        "#,
    )
    .bind(&command.rate)
    .bind(exchange_rule_remarks(command))
    .bind(&command.requested_at)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(ACCOUNT_EXCHANGE_POINTS_TO_CASH_RATE)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update exchange rule", error))?;

    if updated.rows_affected() > 0 {
        return load_exchange_rule_id(
            tx,
            command.subject.tenant_id,
            command.subject.organization_id,
        )
        .await?
        .ok_or_else(|| DomainError::new("updated exchange rule id could not be reloaded"));
    }

    sqlx::query_scalar(
        r#"
        WITH next_id AS (
            SELECT COALESCE(MAX(id), 0) + 1 AS id
            FROM plus_account_exchange_config
        )
        INSERT INTO plus_account_exchange_config
            (id, uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, config_key, config_value, remarks)
        SELECT
            next_id.id,
            $1,
            $2::timestamp AT TIME ZONE 'UTC',
            $2::timestamp AT TIME ZONE 'UTC',
            0,
            $3,
            $4,
            1,
            $5,
            $6::numeric,
            $7
        FROM next_id
        RETURNING id
        "#,
    )
    .bind(format!("exchange-rule-{}", command.audit_log_uuid))
    .bind(&command.requested_at)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(ACCOUNT_EXCHANGE_POINTS_TO_CASH_RATE)
    .bind(&command.rate)
    .bind(exchange_rule_remarks(command))
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert exchange rule", error))
}

async fn load_exchange_rule_id(
    tx: &mut Transaction<'_, Postgres>,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<i64>> {
    sqlx::query_scalar(
        r#"
        SELECT id
        FROM plus_account_exchange_config
        WHERE tenant_id = $1
          AND organization_id = $2
          AND config_key = $3
        LIMIT 1
        "#,
    )
    .bind(tenant_id)
    .bind(organization_id)
    .bind(ACCOUNT_EXCHANGE_POINTS_TO_CASH_RATE)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load exchange rule id", error))
}

async fn load_exchange_rule_by_id(
    tx: &mut Transaction<'_, Postgres>,
    exchange_rule_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminExchangeRuleItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            COALESCE(NULLIF(uuid, ''), id::text) AS id,
            COALESCE(config_key, '') AS config_key,
            COALESCE(config_value, 0)::text AS rate
        FROM plus_account_exchange_config
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
          AND config_key = $4
        LIMIT 1
        "#,
    )
    .bind(exchange_rule_id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(ACCOUNT_EXCHANGE_POINTS_TO_CASH_RATE)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load exchange rule", error))?;

    row.as_ref().map(exchange_rule_from_row).transpose()
}

async fn sync_recharge_package_product_for_create(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAdminRechargePackageCommand,
) -> DomainResult<()> {
    let product_id = insert_recharge_product(
        tx,
        &command.product_uuid,
        &command.requested_at,
        command.subject.tenant_id,
        command.subject.organization_id,
        &command.rmb,
        command.status,
    )
    .await?;
    insert_recharge_sku(
        tx,
        &command.sku_uuid,
        &command.requested_at,
        command.subject.tenant_id,
        command.subject.organization_id,
        product_id,
        &command.rmb,
        command.status,
    )
    .await
}

async fn sync_recharge_package_product_for_update(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateAdminRechargePackageCommand,
    previous_rmb: Option<&str>,
) -> DomainResult<()> {
    let product_id = if let Some(previous_rmb) = previous_rmb {
        find_recharge_product_for_amount(tx, previous_rmb).await?
    } else {
        None
    };
    let product_id = if product_id.is_some() {
        product_id
    } else {
        find_recharge_product_for_amount(tx, &command.rmb).await?
    };
    if let Some(product_id) = product_id {
        update_recharge_product_and_sku(
            tx,
            product_id,
            &command.requested_at,
            &command.rmb,
            command.status,
        )
        .await
    } else {
        let product_id = insert_recharge_product(
            tx,
            &command.product_uuid,
            &command.requested_at,
            command.subject.tenant_id,
            command.subject.organization_id,
            &command.rmb,
            command.status,
        )
        .await?;
        insert_recharge_sku(
            tx,
            &command.sku_uuid,
            &command.requested_at,
            command.subject.tenant_id,
            command.subject.organization_id,
            product_id,
            &command.rmb,
            command.status,
        )
        .await
    }
}

async fn disable_recharge_product_and_sku_for_amount(
    tx: &mut Transaction<'_, Postgres>,
    command: &DeleteAdminRechargePackageCommand,
) -> DomainResult<()> {
    let Some(rmb) = load_recharge_package_amount(
        tx,
        command.package_id,
        command.subject.tenant_id,
        command.subject.organization_id,
    )
    .await?
    else {
        return Ok(());
    };
    if let Some(product_id) = find_recharge_product_for_amount(tx, &rmb).await? {
        update_recharge_product_and_sku(
            tx,
            product_id,
            &command.requested_at,
            &rmb,
            AdminRechargePackageStatus::Inactive,
        )
        .await?;
    }
    Ok(())
}

async fn insert_recharge_product(
    tx: &mut Transaction<'_, Postgres>,
    uuid: &str,
    requested_at: &str,
    tenant_id: i64,
    organization_id: i64,
    rmb: &str,
    status: AdminRechargePackageStatus,
) -> DomainResult<i64> {
    sqlx::query_scalar(
        r#"
        INSERT INTO plus_product
            (uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, user_id, title, code, subtitle, resources, price, original_price, stock, sales_count, status, on_sale_at, description, tags, category_id, base_attributes, spec_attributes)
        VALUES
            ($1, $2::timestamp AT TIME ZONE 'UTC', $2::timestamp AT TIME ZONE 'UTC', 0, $3, $4, 1, NULL, $5, $6, '', '{}'::jsonb, $7::numeric, $7::numeric, 999999, 0, $8, $2::timestamp AT TIME ZONE 'UTC', '', 'billing,recharge', $9, '{}'::jsonb, '{}'::jsonb)
        RETURNING id
        "#,
    )
    .bind(uuid)
    .bind(requested_at)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(recharge_package_name(rmb))
    .bind(recharge_product_code(rmb))
    .bind(rmb)
    .bind(recharge_package_status_code(status))
    .bind(RECHARGE_PRODUCT_CATEGORY_ID)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create recharge product", error))
}

async fn insert_recharge_sku(
    tx: &mut Transaction<'_, Postgres>,
    uuid: &str,
    requested_at: &str,
    tenant_id: i64,
    organization_id: i64,
    product_id: i64,
    rmb: &str,
    status: AdminRechargePackageStatus,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        INSERT INTO plus_sku
            (uuid, created_at, updated_at, v, tenant_id, organization_id, data_scope, product_id, sku_code, name, title, price, original_price, stock, sales, status, image, specs)
        VALUES
            ($1, $2::timestamp AT TIME ZONE 'UTC', $2::timestamp AT TIME ZONE 'UTC', 0, $3, $4, 1, $5, $6, $7, $7, $8::numeric, $8::numeric, 999999, 0, $9, '', $10::jsonb)
        "#,
    )
    .bind(uuid)
    .bind(requested_at)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(product_id)
    .bind(recharge_sku_code(rmb))
    .bind(recharge_package_name(rmb))
    .bind(rmb)
    .bind(recharge_package_status_code(status))
    .bind(recharge_sku_specs(rmb))
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create recharge sku", error))?;
    Ok(())
}

async fn find_recharge_product_for_amount(
    tx: &mut Transaction<'_, Postgres>,
    rmb: &str,
) -> DomainResult<Option<i64>> {
    sqlx::query_scalar(
        r#"
        SELECT pr.id
        FROM plus_product pr
        JOIN plus_sku s ON s.product_id = pr.id
        WHERE s.price = $1::numeric
          AND pr.status >= 0
          AND s.status >= 0
        ORDER BY pr.id ASC
        LIMIT 1
        "#,
    )
    .bind(rmb)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to find recharge product", error))
}

async fn update_recharge_product_and_sku(
    tx: &mut Transaction<'_, Postgres>,
    product_id: i64,
    requested_at: &str,
    rmb: &str,
    status: AdminRechargePackageStatus,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE plus_product
        SET title = $1,
            price = $2::numeric,
            original_price = $2::numeric,
            status = $3,
            updated_at = $4::timestamp AT TIME ZONE 'UTC',
            v = COALESCE(v, 0) + 1
        WHERE id = $5
        "#,
    )
    .bind(recharge_package_name(rmb))
    .bind(rmb)
    .bind(recharge_package_status_code(status))
    .bind(requested_at)
    .bind(product_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update recharge product", error))?;

    sqlx::query(
        r#"
        UPDATE plus_sku
        SET name = $1,
            title = $1,
            price = $2::numeric,
            original_price = $2::numeric,
            status = $3,
            specs = $4::jsonb,
            updated_at = $5::timestamp AT TIME ZONE 'UTC',
            v = COALESCE(v, 0) + 1
        WHERE product_id = $6
        "#,
    )
    .bind(recharge_package_name(rmb))
    .bind(rmb)
    .bind(recharge_package_status_code(status))
    .bind(recharge_sku_specs(rmb))
    .bind(requested_at)
    .bind(product_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update recharge sku", error))?;
    Ok(())
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

async fn list_payment_attempts(
    pool: &PgPool,
    query: ListAdminPaymentAttemptsQuery,
) -> DomainResult<Vec<AdminPaymentAttemptItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            'payment-' || p.id::text AS id,
            COALESCE(NULLIF(p.out_trade_no, ''), NULLIF(o.order_sn, ''), '') AS order_no,
            p.provider AS provider,
            COALESCE(p.amount, 0)::text AS amount,
            p.status AS status,
            COALESCE(p.success_time, p.updated_at, p.created_at)::text AS created_at
        FROM plus_payment p
        LEFT JOIN plus_order o
          ON o.id = p.order_id
        WHERE p.tenant_id = $1
          AND p.organization_id = $2
        ORDER BY COALESCE(p.success_time, p.updated_at, p.created_at) DESC, p.id DESC
        LIMIT 500
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list payment attempts", error))?;

    rows.iter().map(payment_attempt_from_row).collect()
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

fn recharge_record_from_row(row: &sqlx::postgres::PgRow) -> DomainResult<AdminRechargeRecordItem> {
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

fn recharge_package_from_row(
    row: &sqlx::postgres::PgRow,
) -> DomainResult<AdminRechargePackageItem> {
    let rmb = canonical_money_string(&string_cell(row, "rmb"), "recharge package rmb")?;
    let bonus = integer_cell(row, "bonus").max(0);
    Ok(AdminRechargePackageItem {
        id: string_cell(row, "id"),
        points: recharge_base_points(&rmb)? + bonus,
        rmb,
        bonus,
    })
}

fn exchange_rule_from_row(row: &sqlx::postgres::PgRow) -> DomainResult<AdminExchangeRuleItem> {
    let config_key = string_cell(row, "config_key");
    let (source_asset_type, target_asset_type) = exchange_config_key_asset_pair(&config_key)?;
    Ok(AdminExchangeRuleItem {
        id: string_cell(row, "id"),
        source_asset_type: source_asset_type.to_owned(),
        target_asset_type: target_asset_type.to_owned(),
        rate: canonical_decimal_string(&string_cell(row, "rate"), 6, "exchange rule rate")?,
        status: "active".to_owned(),
    })
}

fn payment_attempt_from_row(row: &sqlx::postgres::PgRow) -> DomainResult<AdminPaymentAttemptItem> {
    Ok(AdminPaymentAttemptItem {
        id: string_cell(row, "id"),
        order_no: string_cell(row, "order_no"),
        provider: payment_provider_label(&string_cell(row, "provider")),
        amount: canonical_money_string(&string_cell(row, "amount"), "payment attempt amount")?,
        status: payment_status_label(required_integer_cell(row, "status", "payment attempt")?)?
            .to_owned(),
        created_at: string_cell(row, "created_at"),
    })
}

fn recharge_package_status_code(status: AdminRechargePackageStatus) -> i64 {
    match status {
        AdminRechargePackageStatus::Active => COUPON_STATUS_ACTIVE,
        AdminRechargePackageStatus::Inactive => COUPON_STATUS_INACTIVE,
    }
}

fn recharge_package_status_label(status: AdminRechargePackageStatus) -> &'static str {
    match status {
        AdminRechargePackageStatus::Active => "active",
        AdminRechargePackageStatus::Inactive => "inactive",
    }
}

fn exchange_rule_matches_filters(
    item: &AdminExchangeRuleItem,
    query: &ListAdminExchangeRulesQuery,
) -> bool {
    query
        .source_asset_type
        .as_deref()
        .map(|value| value == item.source_asset_type)
        .unwrap_or(true)
        && query
            .target_asset_type
            .as_deref()
            .map(|value| value == item.target_asset_type)
            .unwrap_or(true)
        && query
            .status
            .as_deref()
            .map(|value| value == item.status)
            .unwrap_or(true)
}

fn exchange_config_key_asset_pair(config_key: &str) -> DomainResult<(&'static str, &'static str)> {
    match config_key {
        ACCOUNT_EXCHANGE_POINTS_TO_CASH_RATE => Ok(("POINTS", "CASH")),
        value => Err(DomainError::new(format!(
            "unsupported exchange rule config key: {value}"
        ))),
    }
}

fn payment_provider_label(value: &str) -> String {
    let value = value.trim();
    if value.is_empty() {
        return "unknown".to_owned();
    }
    if value.bytes().all(|byte| byte.is_ascii_digit()) {
        format!("provider-{value}")
    } else {
        value.to_owned()
    }
}

fn payment_status_label(status: i64) -> DomainResult<&'static str> {
    match status {
        0 | 1 => Ok("pending"),
        2 => Ok("success"),
        3 => Ok("failed"),
        4 | 5 => Ok("expired"),
        value => Err(DomainError::new(format!(
            "unsupported admin payment attempt status: {value}"
        ))),
    }
}

fn recharge_base_points(amount: &str) -> DomainResult<i64> {
    let cents = money_cents(amount)?;
    Ok(((cents + 5) / 10).max(1))
}

fn canonical_money_string(value: &str, field_name: &str) -> DomainResult<String> {
    let cents = money_cents(value)
        .map_err(|_| DomainError::new(format!("invalid {field_name}: {value}")))?;
    Ok(format!("{}.{:02}", cents / 100, cents.rem_euclid(100)))
}

fn canonical_decimal_string(value: &str, scale: usize, field_name: &str) -> DomainResult<String> {
    let value = value.trim().replace(',', "");
    if value.is_empty() || value.starts_with('-') || value.starts_with('+') {
        return Err(DomainError::new(format!("invalid {field_name}: {value}")));
    }
    let mut parts = value.split('.');
    let whole = parts
        .next()
        .unwrap_or_default()
        .trim_start_matches('0')
        .to_owned();
    let fraction = parts.next().unwrap_or_default();
    if parts.next().is_some()
        || whole.chars().any(|ch| !ch.is_ascii_digit())
        || fraction.chars().any(|ch| !ch.is_ascii_digit())
        || fraction.len() > scale
    {
        return Err(DomainError::new(format!("invalid {field_name}: {value}")));
    }
    let whole = if whole.is_empty() { "0" } else { &whole };
    let fraction = fraction.trim_end_matches('0');
    if fraction.is_empty() {
        Ok(whole.to_owned())
    } else {
        Ok(format!("{whole}.{fraction}"))
    }
}

fn exchange_rule_remarks(command: &UpdateAdminExchangeRuleCommand) -> String {
    format!(
        "{} to {} exchange rate",
        command.source_asset_type, command.target_asset_type
    )
}

fn money_cents(amount: &str) -> DomainResult<i64> {
    let amount = amount.trim().trim_start_matches('$').replace(',', "");
    if amount.is_empty() || amount.starts_with('-') {
        return Err(DomainError::new("invalid money amount"));
    }
    let mut parts = amount.split('.');
    let whole = parts
        .next()
        .unwrap_or_default()
        .parse::<i64>()
        .map_err(|_| DomainError::new("invalid money amount"))?;
    let fraction = parts.next().unwrap_or_default();
    if parts.next().is_some() || fraction.len() > 2 {
        return Err(DomainError::new("invalid money amount"));
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
            .map_err(|_| DomainError::new("invalid money amount"))?
    };
    let total = whole
        .checked_mul(100)
        .and_then(|value| value.checked_add(cents))
        .ok_or_else(|| DomainError::new("invalid money amount"))?;
    if total <= 0 {
        return Err(DomainError::new("invalid money amount"));
    }
    Ok(total)
}

fn recharge_package_name(rmb: &str) -> String {
    format!("Points recharge {rmb}")
}

fn recharge_product_code(rmb: &str) -> String {
    format!("points-recharge-{}", rmb.replace('.', "-"))
}

fn recharge_sku_code(rmb: &str) -> String {
    format!("points-recharge-sku-{}", rmb.replace('.', "-"))
}

fn recharge_sku_specs(rmb: &str) -> String {
    format!(r#"{{"amount":"{rmb}"}}"#)
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
