use sdkwork_commerce_core::{CommerceCouponStatus, CommercePaymentStatus, CommerceRechargeStatus};
use sqlx::{Row, Sqlite, SqlitePool, Transaction};

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

const TARGET_TYPE_COUPON: i32 = 71;
const TARGET_TYPE_COUPON_BATCH: i32 = 72;
const TARGET_TYPE_PROMO_CODE: i32 = 73;
const TARGET_TYPE_RECHARGE_PACKAGE: i32 = 74;
const TARGET_TYPE_EXCHANGE_RULE: i32 = 75;
const POINTS_ASSET_TYPE: &str = "POINTS";
const CASH_ASSET_TYPE: &str = "CASH";
const POINTS_STORAGE_ASSET_TYPE: &str = "points";
const CASH_STORAGE_ASSET_TYPE: &str = "cash";
const EXCHANGE_RULE_STATUS_ACTIVE: &str = "active";
const POINTS_TO_CASH_RULE_NO: &str = "POINTS_TO_CASH";

#[derive(Debug, Clone)]
struct PromoCodeStatusFact {
    status: String,
    user_id: Option<String>,
    used_at: Option<String>,
}

#[derive(Debug, Clone)]
pub struct SqliteAdminMarketingStore {
    pool: SqlitePool,
}

impl SqliteAdminMarketingStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl AdminMarketingStore for SqliteAdminMarketingStore {
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
            let coupon_id = upsert_coupon_template(&mut tx, &command).await?;
            insert_audit_log_for_target_uuid(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_coupon",
                TARGET_TYPE_COUPON,
                &coupon_id,
                serde_json::json!({
                    "action": "create_coupon",
                    "couponId": &coupon_id,
                    "name": &command.name,
                    "type": &command.coupon_type,
                    "value": &command.value,
                    "status": &command.status
                }),
            )
            .await?;
            let item = load_coupon_by_id(
                &mut tx,
                &coupon_id,
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
                insert_audit_log_for_target_uuid(
                    &mut tx,
                    &command.audit_log_uuid,
                    &command.request_id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    command.subject.operator_id,
                    command.subject.operator_type,
                    "delete_coupon",
                    TARGET_TYPE_COUPON,
                    &command.coupon_id,
                    serde_json::json!({
                        "action": "delete_coupon",
                        "couponId": &command.coupon_id,
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
            insert_audit_log_for_target_uuid(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "update_coupon",
                TARGET_TYPE_COUPON,
                &command.coupon_id,
                serde_json::json!({
                    "action": "update_coupon",
                    "couponId": &command.coupon_id,
                    "name": &command.name,
                    "type": &command.coupon_type,
                    "value": &command.value,
                    "status": &command.status
                }),
            )
            .await?;
            let item = load_coupon_by_id(
                &mut tx,
                &command.coupon_id,
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
                &command.coupon_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            {
                return Err(DomainError::not_found("coupon was not found"));
            }
            let batch_id = insert_coupon_batch(&mut tx, &command).await?;
            let codes = insert_promo_codes(&mut tx, &command, &batch_id).await?;
            update_coupon_received_count(&mut tx, &command).await?;
            insert_audit_log_for_target_uuid(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "generate_coupon_batch",
                TARGET_TYPE_COUPON_BATCH,
                &batch_id,
                serde_json::json!({
                    "action": "generate_coupon_batch",
                    "batchId": &batch_id,
                    "couponId": &command.coupon_id,
                    "count": command.count,
                    "prefix": &command.prefix
                }),
            )
            .await?;
            let batch = load_batch_by_id(
                &mut tx,
                &batch_id,
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
                    refresh_batch_counters(&mut tx, &batch_id).await?;
                }
                insert_audit_log_for_target_uuid(
                    &mut tx,
                    &command.audit_log_uuid,
                    &command.request_id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    command.subject.operator_id,
                    command.subject.operator_type,
                    "update_promo_code_status",
                    TARGET_TYPE_PROMO_CODE,
                    &command.promo_code_id,
                    serde_json::json!({
                        "action": "update_promo_code_status",
                        "promoCodeId": &command.promo_code_id,
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
            let package_sequence = insert_recharge_package(&mut tx, &command).await?;
            let package_id = recharge_package_id(
                command.subject.tenant_id,
                command.subject.organization_id,
                package_sequence,
            );
            sync_recharge_package_product_for_create(&mut tx, &command, package_sequence).await?;
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
                0,
                serde_json::json!({
                    "action": "create_recharge_package",
                    "packageId": &package_id,
                    "rmb": &command.rmb,
                    "bonus": command.bonus,
                    "status": recharge_package_status_label(command.status)
                }),
            )
            .await?;
            let item = load_recharge_package_by_id(
                &mut tx,
                &package_id,
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
                &command.package_id,
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
                0,
                serde_json::json!({
                    "action": "update_recharge_package",
                    "packageId": &command.package_id,
                    "rmb": &command.rmb,
                    "bonus": command.bonus,
                    "status": recharge_package_status_label(command.status)
                }),
            )
            .await?;
            let item = load_recharge_package_by_id(
                &mut tx,
                &command.package_id,
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
                    0,
                    serde_json::json!({
                        "action": "delete_recharge_package",
                        "packageId": &command.package_id,
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
            insert_audit_log_for_target_uuid(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "update_exchange_rule",
                TARGET_TYPE_EXCHANGE_RULE,
                &exchange_rule_id,
                serde_json::json!({
                    "action": "update_exchange_rule",
                    "exchangeRuleId": &exchange_rule_id,
                    "sourceAssetType": &command.source_asset_type,
                    "targetAssetType": &command.target_asset_type,
                    "rate": &command.rate
                }),
            )
            .await?;
            let item = load_exchange_rule_by_id(
                &mut tx,
                &exchange_rule_id,
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
    pool: &SqlitePool,
    query: ListAdminCouponsQuery,
) -> DomainResult<Vec<AdminCouponItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            CAST(id AS TEXT) AS id,
            COALESCE(title, '') AS name,
            COALESCE(discount_type, '') AS type_code,
            CAST(COALESCE(discount_value, '0') AS TEXT) AS amount,
            CAST(COALESCE(discount_value, '0') AS TEXT) AS discount,
            status AS status
        FROM commerce_coupon_template
        WHERE tenant_id = CAST(? AS TEXT)
          AND organization_id = CAST(? AS TEXT)
          AND status <> 'disabled'
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

async fn upsert_coupon_template(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminCouponCommand,
) -> DomainResult<String> {
    sqlx::query(
        r#"
        INSERT INTO commerce_coupon_template
            (id, tenant_id, organization_id, template_no, title, discount_type, discount_value, minimum_amount, total_quantity, claimed_quantity, redeemed_quantity, status, starts_at, expires_at, created_at, updated_at)
        VALUES
            (?, CAST(? AS TEXT), CAST(? AS TEXT), ?, ?, ?, ?, '0', NULL, 0, 0, ?, NULL, NULL, ?, ?)
        "#,
    )
    .bind(&command.coupon_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(coupon_template_no(&command.coupon_uuid))
    .bind(&command.name)
    .bind(coupon_discount_type(&command.coupon_type))
    .bind(coupon_discount_value(command))
    .bind(coupon_status_value(&command.status))
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create coupon template", error))?;
    Ok(command.coupon_uuid.clone())
}

async fn load_coupon_by_id(
    tx: &mut Transaction<'_, Sqlite>,
    coupon_id: &str,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminCouponItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            CAST(id AS TEXT) AS id,
            COALESCE(title, '') AS name,
            COALESCE(discount_type, '') AS type_code,
            CAST(COALESCE(discount_value, '0') AS TEXT) AS amount,
            CAST(COALESCE(discount_value, '0') AS TEXT) AS discount,
            status AS status
        FROM commerce_coupon_template
        WHERE id = ?
          AND tenant_id = CAST(? AS TEXT)
          AND organization_id = CAST(? AS TEXT)
          AND status <> 'disabled'
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
    tx: &mut Transaction<'_, Sqlite>,
    command: &DeleteAdminCouponCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE commerce_coupon_template
        SET status = ?,
            updated_at = ?
        WHERE id = ?
          AND tenant_id = CAST(? AS TEXT)
          AND organization_id = CAST(? AS TEXT)
          AND status <> 'disabled'
        "#,
    )
    .bind(CommerceCouponStatus::Disabled.as_str())
    .bind(&command.requested_at)
    .bind(&command.coupon_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete coupon", error))?;
    Ok(result.rows_affected() > 0)
}

async fn update_coupon_row(
    tx: &mut Transaction<'_, Sqlite>,
    command: &UpdateAdminCouponCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE commerce_coupon_template
        SET title = ?,
            discount_type = ?,
            discount_value = ?,
            status = ?,
            updated_at = ?
        WHERE id = ?
          AND tenant_id = CAST(? AS TEXT)
          AND organization_id = CAST(? AS TEXT)
          AND status <> 'disabled'
        "#,
    )
    .bind(&command.name)
    .bind(coupon_discount_type(&command.coupon_type))
    .bind(coupon_discount_value(command))
    .bind(coupon_status_value(&command.status))
    .bind(&command.requested_at)
    .bind(&command.coupon_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update coupon", error))?;
    Ok(result.rows_affected() > 0)
}

async fn list_batches(
    pool: &SqlitePool,
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
    tx: &mut Transaction<'_, Sqlite>,
    coupon_id: &str,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<bool> {
    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*)
        FROM commerce_coupon_template
        WHERE id = ?
          AND tenant_id = CAST(? AS TEXT)
          AND organization_id = CAST(? AS TEXT)
          AND status <> 'disabled'
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
    tx: &mut Transaction<'_, Sqlite>,
    command: &GenerateAdminCouponBatchCommand,
) -> DomainResult<String> {
    let batch_no = batch_no(&command.prefix, &command.batch_uuid);
    sqlx::query(
        r#"
        INSERT INTO commerce_coupon_issue_batch
            (id, tenant_id, organization_id, coupon_template_id, batch_no, campaign_code, title, code_prefix, code_pattern, requested_quantity, generated_quantity, available_quantity, claimed_quantity, redeemed_quantity, disabled_quantity, status, generation_status, audience_filter, generated_at, created_by, created_at, updated_at)
        VALUES
            (?, CAST(? AS TEXT), CAST(? AS TEXT), ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 'active', 'completed', '{}', ?, CAST(? AS TEXT), ?, ?)
        "#,
    )
    .bind(&command.batch_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.coupon_id)
    .bind(&batch_no)
    .bind(&batch_no)
    .bind(&command.name)
    .bind(&command.prefix)
    .bind(format!("{}-{{sequence:04}}", command.prefix))
    .bind(command.count)
    .bind(command.count)
    .bind(command.count)
    .bind(&command.requested_at)
    .bind(command.subject.operator_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create coupon issue batch", error))?;
    Ok(command.batch_uuid.clone())
}

async fn insert_promo_codes(
    tx: &mut Transaction<'_, Sqlite>,
    command: &GenerateAdminCouponBatchCommand,
    batch_id: &str,
) -> DomainResult<Vec<AdminPromoCodeItem>> {
    let mut codes = Vec::with_capacity(command.count as usize);
    let mut sequence = next_promo_code_sequence(tx, command).await?;
    for _ in 0..command.count {
        loop {
            let (current_sequence, code) = next_available_promo_code(tx, command, sequence).await?;
            let uuid = format!("{}-code-{current_sequence}", command.batch_uuid);
            let result = sqlx::query(
                r#"
                INSERT INTO commerce_coupon
                    (id, tenant_id, organization_id, template_id, issue_batch_id, owner_user_id, coupon_code, status, claimed_at, expires_at, redeemed_at, disabled_at, request_no, idempotency_key, created_at, updated_at)
                VALUES
                    (?, CAST(? AS TEXT), CAST(? AS TEXT), ?, ?, NULL, ?, ?, NULL, NULL, NULL, NULL, ?, ?, ?, ?)
                ON CONFLICT(tenant_id, coupon_code) DO NOTHING
                "#,
            )
            .bind(&uuid)
            .bind(command.subject.tenant_id)
            .bind(command.subject.organization_id)
            .bind(&command.coupon_id)
            .bind(batch_id)
            .bind(&code)
            .bind(CommerceCouponStatus::Active.as_str())
            .bind(format!(
                "{}-{current_sequence}",
                batch_no(&command.prefix, &command.batch_uuid)
            ))
            .bind(format!(
                "{}-{current_sequence}",
                batch_no(&command.prefix, &command.batch_uuid)
            ))
            .bind(&command.requested_at)
            .bind(&command.requested_at)
            .execute(&mut **tx)
            .await
            .map_err(|error| store_error("failed to create promo code", error))?;
            sequence = current_sequence
                .checked_add(1)
                .ok_or_else(|| DomainError::conflict("promo code sequence exhausted"))?;
            if result.rows_affected() == 0 {
                continue;
            }
            codes.push(AdminPromoCodeItem {
                id: uuid,
                batch_id: batch_id.to_owned(),
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
    tx: &mut Transaction<'_, Sqlite>,
    command: &GenerateAdminCouponBatchCommand,
) -> DomainResult<i64> {
    let code_pattern = format!("{}-%", escape_like_pattern(&command.prefix));
    let existing_codes: Vec<String> = sqlx::query_scalar(
        r#"
        SELECT coupon_code
        FROM commerce_coupon
        WHERE coupon_code LIKE ? ESCAPE '!'
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
    tx: &mut Transaction<'_, Sqlite>,
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

async fn promo_code_exists(tx: &mut Transaction<'_, Sqlite>, code: &str) -> DomainResult<bool> {
    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*)
        FROM commerce_coupon
        WHERE coupon_code = ?
        "#,
    )
    .bind(code)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to check promo code uniqueness", error))?;
    Ok(count > 0)
}

async fn update_coupon_received_count(
    tx: &mut Transaction<'_, Sqlite>,
    command: &GenerateAdminCouponBatchCommand,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE commerce_coupon_template
        SET claimed_quantity = COALESCE(claimed_quantity, 0) + ?,
            updated_at = ?
        WHERE id = ?
          AND tenant_id = CAST(? AS TEXT)
          AND organization_id = CAST(? AS TEXT)
        "#,
    )
    .bind(command.count)
    .bind(&command.requested_at)
    .bind(&command.coupon_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update coupon received count", error))?;
    Ok(())
}

async fn load_batch_by_id(
    tx: &mut Transaction<'_, Sqlite>,
    batch_id: &str,
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
    pool: &SqlitePool,
    query: ListAdminPromoCodesQuery,
) -> DomainResult<Vec<AdminPromoCodeItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            CAST(uc.id AS TEXT) AS id,
            COALESCE(uc.issue_batch_id, '') AS batch_id,
            COALESCE(uc.coupon_code, '') AS code,
            uc.status AS status,
            uc.owner_user_id AS user_id,
            CAST(uc.redeemed_at AS TEXT) AS used_at,
            COALESCE(NULLIF(u.email, ''), NULLIF(u.username, ''), '') AS used_by
        FROM commerce_coupon uc
        LEFT JOIN iam_user u
          ON u.id = uc.owner_user_id
         AND u.tenant_id = uc.tenant_id
        WHERE uc.tenant_id = CAST(? AS TEXT)
          AND uc.organization_id = CAST(? AS TEXT)
          AND uc.issue_batch_id IS NOT NULL
        ORDER BY uc.created_at DESC, uc.coupon_code DESC, uc.id DESC
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
    tx: &mut Transaction<'_, Sqlite>,
    command: &UpdateAdminPromoCodeStatusCommand,
) -> DomainResult<bool> {
    let status = promo_status_value(&command.status);
    let Some(fact) = load_promo_code_status_fact(tx, command).await? else {
        return Ok(false);
    };
    ensure_promo_status_transition(&fact, &status)?;
    let result = sqlx::query(
        r#"
        UPDATE commerce_coupon
        SET status = ?,
            redeemed_at = CASE
                WHEN ? = 'redeemed' THEN COALESCE(redeemed_at, ?)
                WHEN ? = 'active' THEN NULL
                ELSE redeemed_at
            END,
            disabled_at = CASE
                WHEN ? = 'disabled' THEN COALESCE(disabled_at, ?)
                WHEN ? = 'active' THEN NULL
                ELSE disabled_at
            END,
            updated_at = ?
        WHERE id = ?
          AND tenant_id = CAST(? AS TEXT)
          AND organization_id = CAST(? AS TEXT)
          AND status <> 'disabled'
        "#,
    )
    .bind(&status)
    .bind(&status)
    .bind(&command.requested_at)
    .bind(&status)
    .bind(&status)
    .bind(&command.requested_at)
    .bind(&status)
    .bind(&command.requested_at)
    .bind(&command.promo_code_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update promo code status", error))?;
    Ok(result.rows_affected() > 0)
}

async fn load_promo_code_status_fact(
    tx: &mut Transaction<'_, Sqlite>,
    command: &UpdateAdminPromoCodeStatusCommand,
) -> DomainResult<Option<PromoCodeStatusFact>> {
    let row = sqlx::query(
        r#"
        SELECT
            status AS status,
            owner_user_id AS user_id,
            CAST(redeemed_at AS TEXT) AS used_at
        FROM commerce_coupon
        WHERE id = ?
          AND tenant_id = CAST(? AS TEXT)
          AND organization_id = CAST(? AS TEXT)
          AND status <> 'disabled'
        LIMIT 1
        "#,
    )
    .bind(&command.promo_code_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load promo code status", error))?;

    row.map(|row| {
        Ok(PromoCodeStatusFact {
            status: string_cell(&row, "status"),
            user_id: optional_string_cell(&row, "user_id").filter(|value| !value.is_empty()),
            used_at: optional_string_cell(&row, "used_at").filter(|value| !value.is_empty()),
        })
    })
    .transpose()
}

async fn find_batch_for_promo_code(
    tx: &mut Transaction<'_, Sqlite>,
    command: &UpdateAdminPromoCodeStatusCommand,
) -> DomainResult<Option<String>> {
    sqlx::query_scalar(
        r#"
        SELECT issue_batch_id
        FROM commerce_coupon
        WHERE id = ?
          AND tenant_id = CAST(? AS TEXT)
          AND organization_id = CAST(? AS TEXT)
        LIMIT 1
        "#,
    )
    .bind(&command.promo_code_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to find promo code batch", error))
}

async fn refresh_batch_counters(
    tx: &mut Transaction<'_, Sqlite>,
    batch_id: &str,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE commerce_coupon_issue_batch
        SET available_quantity = (
                SELECT COUNT(*)
                FROM commerce_coupon c
                WHERE c.tenant_id = commerce_coupon_issue_batch.tenant_id
                  AND c.organization_id = commerce_coupon_issue_batch.organization_id
                  AND c.issue_batch_id = commerce_coupon_issue_batch.id
                  AND c.status = 'active'
                  AND c.owner_user_id IS NULL
                  AND c.redeemed_at IS NULL
            ),
            claimed_quantity = (
                SELECT COUNT(*)
                FROM commerce_coupon c
                WHERE c.tenant_id = commerce_coupon_issue_batch.tenant_id
                  AND c.organization_id = commerce_coupon_issue_batch.organization_id
                  AND c.issue_batch_id = commerce_coupon_issue_batch.id
                  AND c.status = 'active'
                  AND c.owner_user_id IS NOT NULL
                  AND c.redeemed_at IS NULL
            ),
            redeemed_quantity = (
                SELECT COUNT(*)
                FROM commerce_coupon c
                WHERE c.tenant_id = commerce_coupon_issue_batch.tenant_id
                  AND c.organization_id = commerce_coupon_issue_batch.organization_id
                  AND c.issue_batch_id = commerce_coupon_issue_batch.id
                  AND (c.status = 'redeemed' OR c.redeemed_at IS NOT NULL)
            ),
            disabled_quantity = (
                SELECT COUNT(*)
                FROM commerce_coupon c
                WHERE c.tenant_id = commerce_coupon_issue_batch.tenant_id
                  AND c.organization_id = commerce_coupon_issue_batch.organization_id
                  AND c.issue_batch_id = commerce_coupon_issue_batch.id
                  AND c.status = 'disabled'
            ),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        "#,
    )
    .bind(batch_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to refresh coupon batch counters", error))?;
    Ok(())
}

async fn list_redemption_records(
    pool: &SqlitePool,
    query: ListAdminRedemptionRecordsQuery,
) -> DomainResult<Vec<AdminRedemptionRecordItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            CAST(c.id AS TEXT) AS id,
            CAST(c.owner_user_id AS TEXT) AS user_id,
            COALESCE(NULLIF(u.email, ''), NULLIF(u.username, ''), '') AS user_name,
            COALESCE(c.coupon_code, '') AS code,
            CAST(COALESCE(t.discount_value, '0') AS TEXT) AS amount,
            CAST(COALESCE(c.redeemed_at, c.updated_at, c.claimed_at, c.created_at) AS TEXT) AS time
        FROM commerce_coupon c
        JOIN commerce_coupon_template t
          ON t.id = c.template_id
         AND t.tenant_id = c.tenant_id
        LEFT JOIN iam_user u
          ON u.id = c.owner_user_id
         AND u.tenant_id = c.tenant_id
        WHERE c.tenant_id = CAST(? AS TEXT)
          AND c.organization_id = CAST(? AS TEXT)
          AND c.owner_user_id IS NOT NULL
          AND (c.redeemed_at IS NOT NULL OR c.status = 'redeemed')
        ORDER BY COALESCE(c.redeemed_at, c.updated_at, c.claimed_at, c.created_at) DESC, c.id DESC
        LIMIT 500
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
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
                amount: decimal_money_string(&string_cell(row, "amount")),
                time: string_cell(row, "time"),
            })
        })
        .collect()
}

async fn list_recharge_records(
    pool: &SqlitePool,
    query: ListAdminRechargeRecordsQuery,
) -> DomainResult<Vec<AdminRechargeRecordItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            CAST(pa.id AS TEXT) AS id,
            COALESCE(NULLIF(pa.out_trade_no, ''), NULLIF(o.order_no, ''), pa.id) AS trade_no,
            CAST(pa.owner_user_id AS TEXT) AS user_id,
            COALESCE(NULLIF(u.email, ''), NULLIF(u.username, ''), '') AS user_name,
            CAST(COALESCE(pa.amount, '0') AS TEXT) AS amount,
            COALESCE(NULLIF(json_extract(COALESCE(pa.callback_payload, '{}'), '$.points'), ''), '0') AS point_amount,
            COALESCE(NULLIF(pm.display_name, ''), NULLIF(pa.provider, ''), 'manual') AS method,
            COALESCE(NULLIF(o.status, ''), NULLIF(pa.status, ''), 'pending') AS status,
            CAST(COALESCE(pa.paid_at, pa.updated_at, pa.created_at, o.updated_at, o.created_at) AS TEXT) AS time
        FROM commerce_payment_attempt pa
        JOIN commerce_order o
          ON o.id = pa.order_id
         AND o.tenant_id = pa.tenant_id
         AND (o.organization_id IS NULL OR pa.organization_id IS NULL OR o.organization_id = pa.organization_id)
         AND o.subject = 'points_recharge'
        LEFT JOIN commerce_payment_method pm
          ON pm.tenant_id = pa.tenant_id
         AND (pm.organization_id IS NULL OR pa.organization_id IS NULL OR pm.organization_id = pa.organization_id)
         AND pm.method_key = pa.provider
        LEFT JOIN iam_user u
          ON u.id = CAST(pa.owner_user_id AS TEXT)
         AND u.tenant_id = pa.tenant_id
        WHERE pa.tenant_id = CAST(? AS TEXT)
          AND pa.organization_id = CAST(? AS TEXT)
        ORDER BY COALESCE(pa.paid_at, pa.updated_at, pa.created_at, o.updated_at, o.created_at) DESC, pa.id DESC
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
    pool: &SqlitePool,
    query: LoadAdminRechargeRecordQuery,
) -> DomainResult<Option<AdminRechargeRecordItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            CAST(pa.id AS TEXT) AS id,
            COALESCE(NULLIF(pa.out_trade_no, ''), NULLIF(o.order_no, ''), pa.id) AS trade_no,
            CAST(pa.owner_user_id AS TEXT) AS user_id,
            COALESCE(NULLIF(u.email, ''), NULLIF(u.username, ''), '') AS user_name,
            CAST(COALESCE(pa.amount, '0') AS TEXT) AS amount,
            COALESCE(NULLIF(json_extract(COALESCE(pa.callback_payload, '{}'), '$.points'), ''), '0') AS point_amount,
            COALESCE(NULLIF(pm.display_name, ''), NULLIF(pa.provider, ''), 'manual') AS method,
            COALESCE(NULLIF(o.status, ''), NULLIF(pa.status, ''), 'pending') AS status,
            CAST(COALESCE(pa.paid_at, pa.updated_at, pa.created_at, o.updated_at, o.created_at) AS TEXT) AS time
        FROM commerce_payment_attempt pa
        JOIN commerce_order o
          ON o.id = pa.order_id
         AND o.tenant_id = pa.tenant_id
         AND (o.organization_id IS NULL OR pa.organization_id IS NULL OR o.organization_id = pa.organization_id)
         AND o.subject = 'points_recharge'
        LEFT JOIN commerce_payment_method pm
          ON pm.tenant_id = pa.tenant_id
         AND (pm.organization_id IS NULL OR pa.organization_id IS NULL OR pm.organization_id = pa.organization_id)
         AND pm.method_key = pa.provider
        LEFT JOIN iam_user u
          ON u.id = CAST(pa.owner_user_id AS TEXT)
         AND u.tenant_id = pa.tenant_id
        WHERE pa.tenant_id = CAST(? AS TEXT)
          AND pa.organization_id = CAST(? AS TEXT)
          AND (
              pa.out_trade_no = ?
              OR o.order_no = ?
              OR pa.id = ?
          )
        LIMIT 1
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(&query.order_no)
    .bind(&query.order_no)
    .bind(&query.order_no)
    .fetch_optional(pool)
    .await
    .map_err(|error| store_error("failed to load recharge record", error))?;

    row.as_ref().map(recharge_record_from_row).transpose()
}

async fn list_recharge_packages(
    pool: &SqlitePool,
    query: ListAdminRechargePackagesQuery,
) -> DomainResult<Vec<AdminRechargePackageItem>> {
    let mut sql = String::from(
        r#"
        SELECT
            CAST(id AS TEXT) AS id,
            CAST(price_amount AS TEXT) AS rmb,
            COALESCE(bonus_points, 0) AS bonus
        FROM commerce_recharge_package
        WHERE tenant_id = CAST(? AS TEXT)
          AND organization_id = CAST(? AS TEXT)
        "#,
    );
    if query.status.is_some() {
        sql.push_str(" AND status = ?");
    } else {
        sql.push_str(" AND status <> 'deleted'");
    }
    sql.push_str(" ORDER BY COALESCE(sort_weight, 0) ASC, id ASC LIMIT 500");

    let mut query_builder = sqlx::query(&sql)
        .bind(query.subject.tenant_id)
        .bind(query.subject.organization_id);
    if let Some(status) = query.status {
        query_builder = query_builder.bind(recharge_package_status_label(status));
    }
    let rows = query_builder
        .fetch_all(pool)
        .await
        .map_err(|error| store_error("failed to list recharge packages", error))?;

    rows.iter().map(recharge_package_from_row).collect()
}

async fn list_exchange_rules(
    pool: &SqlitePool,
    query: ListAdminExchangeRulesQuery,
) -> DomainResult<Vec<AdminExchangeRuleItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            id,
            source_asset_type,
            target_asset_type,
            rate,
            status
        FROM commerce_exchange_rule
        WHERE tenant_id = CAST(? AS TEXT)
          AND organization_id = CAST(? AS TEXT)
          AND source_asset_type = 'points'
          AND target_asset_type = 'cash'
          AND status = 'active'
        ORDER BY updated_at DESC, id DESC
        LIMIT 500
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
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
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminRechargePackageCommand,
) -> DomainResult<i64> {
    let sequence = next_recharge_package_sequence(
        tx,
        command.subject.tenant_id,
        command.subject.organization_id,
    )
    .await?;
    let package_id = recharge_package_id(
        command.subject.tenant_id,
        command.subject.organization_id,
        sequence,
    );
    let sku_id = recharge_sku_id(
        command.subject.tenant_id,
        command.subject.organization_id,
        sequence,
    );
    sqlx::query(
        r#"
        INSERT INTO commerce_recharge_package
            (id, tenant_id, organization_id, external_id, package_no, sku_id, name, price_amount, currency_code, bonus_points, status, valid_from, valid_to, sort_weight, request_no, idempotency_key, created_at, updated_at)
        VALUES
            (?, CAST(? AS TEXT), CAST(? AS TEXT), ?, ?, ?, ?, ?, 'CNY', ?, ?, NULL, NULL, ?, ?, ?, ?, ?)
        "#,
    )
    .bind(&package_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(sequence)
    .bind(recharge_package_no(sequence))
    .bind(&sku_id)
    .bind(recharge_package_name(&command.rmb))
    .bind(&command.rmb)
    .bind(command.bonus)
    .bind(recharge_package_status_label(command.status))
    .bind(sequence)
    .bind(&command.request_id)
    .bind(&command.request_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create recharge package", error))?;

    Ok(sequence)
}

async fn next_recharge_package_sequence(
    tx: &mut Transaction<'_, Sqlite>,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<i64> {
    let current: Option<i64> = sqlx::query_scalar(
        r#"
        SELECT MAX(external_id)
        FROM commerce_recharge_package
        WHERE tenant_id = CAST(? AS TEXT)
          AND organization_id = CAST(? AS TEXT)
        "#,
    )
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to allocate recharge package id", error))?;
    Ok(current.unwrap_or(0) + 1)
}

async fn update_recharge_package_row(
    tx: &mut Transaction<'_, Sqlite>,
    command: &UpdateAdminRechargePackageCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE commerce_recharge_package
        SET name = ?,
            price_amount = ?,
            bonus_points = ?,
            status = ?,
            request_no = ?,
            idempotency_key = ?,
            updated_at = ?
        WHERE id = ?
          AND tenant_id = CAST(? AS TEXT)
          AND organization_id = CAST(? AS TEXT)
          AND status <> 'deleted'
        "#,
    )
    .bind(recharge_package_name(&command.rmb))
    .bind(&command.rmb)
    .bind(command.bonus)
    .bind(recharge_package_status_label(command.status))
    .bind(&command.request_id)
    .bind(&command.request_id)
    .bind(&command.requested_at)
    .bind(&command.package_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update recharge package", error))?;
    Ok(result.rows_affected() > 0)
}

async fn soft_delete_recharge_package(
    tx: &mut Transaction<'_, Sqlite>,
    command: &DeleteAdminRechargePackageCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE commerce_recharge_package
        SET status = ?,
            request_no = ?,
            idempotency_key = ?,
            updated_at = ?
        WHERE id = ?
          AND tenant_id = CAST(? AS TEXT)
          AND organization_id = CAST(? AS TEXT)
          AND status <> 'deleted'
        "#,
    )
    .bind("deleted")
    .bind(&command.request_id)
    .bind(&command.request_id)
    .bind(&command.requested_at)
    .bind(&command.package_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete recharge package", error))?;
    Ok(result.rows_affected() > 0)
}

async fn load_recharge_package_amount(
    tx: &mut Transaction<'_, Sqlite>,
    package_id: &str,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<String>> {
    let value: Option<String> = sqlx::query_scalar(
        r#"
        SELECT CAST(price_amount AS TEXT)
        FROM commerce_recharge_package
        WHERE id = ?
          AND tenant_id = CAST(? AS TEXT)
          AND organization_id = CAST(? AS TEXT)
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
    tx: &mut Transaction<'_, Sqlite>,
    package_id: &str,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminRechargePackageItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            CAST(id AS TEXT) AS id,
            CAST(price_amount AS TEXT) AS rmb,
            COALESCE(bonus_points, 0) AS bonus
        FROM commerce_recharge_package
        WHERE id = ?
          AND tenant_id = CAST(? AS TEXT)
          AND organization_id = CAST(? AS TEXT)
          AND status <> 'deleted'
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
    tx: &mut Transaction<'_, Sqlite>,
    command: &UpdateAdminExchangeRuleCommand,
) -> DomainResult<String> {
    let rule_id = exchange_rule_id(command);
    let source_asset_type = storage_asset_type(&command.source_asset_type)?;
    let target_asset_type = storage_asset_type(&command.target_asset_type)?;
    sqlx::query(
        r#"
        INSERT INTO commerce_exchange_rule
            (id, tenant_id, organization_id, rule_no, source_asset_type, target_asset_type, rate, status, remark, request_no, idempotency_key, created_at, updated_at)
        VALUES
            (?, CAST(? AS TEXT), CAST(? AS TEXT), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(tenant_id, organization_id, source_asset_type, target_asset_type) DO UPDATE SET
            rate = excluded.rate,
            status = excluded.status,
            remark = excluded.remark,
            request_no = excluded.request_no,
            idempotency_key = excluded.idempotency_key,
            updated_at = excluded.updated_at
        "#,
    )
    .bind(&rule_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(POINTS_TO_CASH_RULE_NO)
    .bind(source_asset_type)
    .bind(target_asset_type)
    .bind(&command.rate)
    .bind(EXCHANGE_RULE_STATUS_ACTIVE)
    .bind(exchange_rule_remarks(command))
    .bind(&command.request_id)
    .bind(&command.request_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to upsert exchange rule", error))?;

    load_exchange_rule_id(
        tx,
        command.subject.tenant_id,
        command.subject.organization_id,
        source_asset_type,
        target_asset_type,
    )
    .await?
    .ok_or_else(|| DomainError::new("upserted exchange rule id could not be reloaded"))
}

async fn load_exchange_rule_id(
    tx: &mut Transaction<'_, Sqlite>,
    tenant_id: i64,
    organization_id: i64,
    source_asset_type: &str,
    target_asset_type: &str,
) -> DomainResult<Option<String>> {
    sqlx::query_scalar(
        r#"
        SELECT id
        FROM commerce_exchange_rule
        WHERE tenant_id = CAST(? AS TEXT)
          AND organization_id = CAST(? AS TEXT)
          AND source_asset_type = ?
          AND target_asset_type = ?
        LIMIT 1
        "#,
    )
    .bind(tenant_id)
    .bind(organization_id)
    .bind(source_asset_type)
    .bind(target_asset_type)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load exchange rule id", error))
}

async fn load_exchange_rule_by_id(
    tx: &mut Transaction<'_, Sqlite>,
    exchange_rule_id: &str,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminExchangeRuleItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            id,
            source_asset_type,
            target_asset_type,
            rate,
            status
        FROM commerce_exchange_rule
        WHERE id = ?
          AND tenant_id = CAST(? AS TEXT)
          AND organization_id = CAST(? AS TEXT)
          AND source_asset_type = 'points'
          AND target_asset_type = 'cash'
        LIMIT 1
        "#,
    )
    .bind(exchange_rule_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load exchange rule", error))?;

    row.as_ref().map(exchange_rule_from_row).transpose()
}

async fn sync_recharge_package_product_for_create(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminRechargePackageCommand,
    sequence: i64,
) -> DomainResult<()> {
    let product_id = insert_recharge_product_for_create(tx, command, sequence).await?;
    insert_recharge_sku_for_create(tx, command, sequence, &product_id).await
}

async fn sync_recharge_package_product_for_update(
    tx: &mut Transaction<'_, Sqlite>,
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
            &product_id,
            &command.requested_at,
            &command.request_id,
            &command.rmb,
            command.status,
        )
        .await
    } else {
        let sequence = next_recharge_package_sequence(
            tx,
            command.subject.tenant_id,
            command.subject.organization_id,
        )
        .await?;
        let product_id = insert_recharge_product_for_update(tx, command, sequence).await?;
        insert_recharge_sku_for_update(tx, command, sequence, &product_id).await
    }
}

async fn disable_recharge_product_and_sku_for_amount(
    tx: &mut Transaction<'_, Sqlite>,
    command: &DeleteAdminRechargePackageCommand,
) -> DomainResult<()> {
    let Some(rmb) = load_recharge_package_amount(
        tx,
        &command.package_id,
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
            &product_id,
            &command.requested_at,
            &command.request_id,
            &rmb,
            AdminRechargePackageStatus::Inactive,
        )
        .await?;
    }
    Ok(())
}

async fn insert_recharge_product_for_create(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminRechargePackageCommand,
    sequence: i64,
) -> DomainResult<String> {
    insert_recharge_product_row(
        tx,
        &command.requested_at,
        &command.request_id,
        command.subject.tenant_id,
        command.subject.organization_id,
        sequence,
        &command.rmb,
        command.status,
    )
    .await
}

async fn insert_recharge_product_for_update(
    tx: &mut Transaction<'_, Sqlite>,
    command: &UpdateAdminRechargePackageCommand,
    sequence: i64,
) -> DomainResult<String> {
    insert_recharge_product_row(
        tx,
        &command.requested_at,
        &command.request_id,
        command.subject.tenant_id,
        command.subject.organization_id,
        sequence,
        &command.rmb,
        command.status,
    )
    .await
}

async fn insert_recharge_product_row(
    tx: &mut Transaction<'_, Sqlite>,
    requested_at: &str,
    request_id: &str,
    tenant_id: i64,
    organization_id: i64,
    sequence: i64,
    rmb: &str,
    status: AdminRechargePackageStatus,
) -> DomainResult<String> {
    let product_id = recharge_product_id(tenant_id, organization_id, sequence);
    sqlx::query(
        r#"
        INSERT INTO commerce_product
            (id, tenant_id, organization_id, product_no, title, subtitle, description, category_id, status, created_at, updated_at)
        VALUES
            (?, CAST(? AS TEXT), CAST(? AS TEXT), ?, ?, '', ?, 'recharge', ?, ?, ?)
        ON CONFLICT(tenant_id, product_no) DO UPDATE SET
            title = excluded.title,
            description = excluded.description,
            status = excluded.status,
            updated_at = excluded.updated_at
        "#,
    )
    .bind(&product_id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(recharge_product_no(sequence))
    .bind(recharge_package_name(rmb))
    .bind(format!("request_id={request_id}"))
    .bind(recharge_package_status_label(status))
    .bind(requested_at)
    .bind(requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create recharge product", error))?;

    Ok(product_id)
}

async fn insert_recharge_sku_for_create(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminRechargePackageCommand,
    sequence: i64,
    product_id: &str,
) -> DomainResult<()> {
    insert_recharge_sku_row(
        tx,
        &command.requested_at,
        command.subject.tenant_id,
        command.subject.organization_id,
        sequence,
        product_id,
        &command.rmb,
        command.status,
    )
    .await
}

async fn insert_recharge_sku_for_update(
    tx: &mut Transaction<'_, Sqlite>,
    command: &UpdateAdminRechargePackageCommand,
    sequence: i64,
    product_id: &str,
) -> DomainResult<()> {
    insert_recharge_sku_row(
        tx,
        &command.requested_at,
        command.subject.tenant_id,
        command.subject.organization_id,
        sequence,
        product_id,
        &command.rmb,
        command.status,
    )
    .await
}

async fn insert_recharge_sku_row(
    tx: &mut Transaction<'_, Sqlite>,
    requested_at: &str,
    tenant_id: i64,
    organization_id: i64,
    sequence: i64,
    product_id: &str,
    rmb: &str,
    status: AdminRechargePackageStatus,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        INSERT INTO commerce_sku
            (id, tenant_id, organization_id, product_id, sku_no, name, title, price_amount, original_price_amount, currency_code, stock_quantity, sold_quantity, status, spec_json, created_at, updated_at)
        VALUES
            (?, CAST(? AS TEXT), CAST(? AS TEXT), ?, ?, ?, ?, ?, ?, 'CNY', 999999, 0, ?, ?, ?, ?)
        ON CONFLICT(tenant_id, sku_no) DO UPDATE SET
            name = excluded.name,
            title = excluded.title,
            price_amount = excluded.price_amount,
            original_price_amount = excluded.original_price_amount,
            status = excluded.status,
            spec_json = excluded.spec_json,
            updated_at = excluded.updated_at
        "#,
    )
    .bind(recharge_sku_id(tenant_id, organization_id, sequence))
    .bind(tenant_id)
    .bind(organization_id)
    .bind(product_id)
    .bind(recharge_sku_no(sequence))
    .bind(recharge_package_name(rmb))
    .bind(recharge_package_name(rmb))
    .bind(rmb)
    .bind(rmb)
    .bind(recharge_package_status_label(status))
    .bind(recharge_sku_specs(rmb))
    .bind(requested_at)
    .bind(requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create recharge sku", error))?;
    Ok(())
}

async fn find_recharge_product_for_amount(
    tx: &mut Transaction<'_, Sqlite>,
    rmb: &str,
) -> DomainResult<Option<String>> {
    sqlx::query_scalar(
        r#"
        SELECT pr.id
        FROM commerce_product pr
        JOIN commerce_sku s ON s.product_id = pr.id
        WHERE CAST(s.price_amount AS TEXT) = CAST(? AS TEXT)
          AND pr.status <> 'deleted'
          AND s.status <> 'deleted'
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
    tx: &mut Transaction<'_, Sqlite>,
    product_id: &str,
    requested_at: &str,
    request_id: &str,
    rmb: &str,
    status: AdminRechargePackageStatus,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE commerce_product
        SET title = ?,
            status = ?,
            description = ?,
            updated_at = ?
        WHERE id = ?
        "#,
    )
    .bind(recharge_package_name(rmb))
    .bind(recharge_package_status_label(status))
    .bind(format!("request_id={request_id}"))
    .bind(requested_at)
    .bind(product_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update recharge product", error))?;

    sqlx::query(
        r#"
        UPDATE commerce_sku
        SET name = ?,
            title = ?,
            price_amount = ?,
            original_price_amount = ?,
            status = ?,
            spec_json = ?,
            updated_at = ?
        WHERE product_id = ?
        "#,
    )
    .bind(recharge_package_name(rmb))
    .bind(recharge_package_name(rmb))
    .bind(rmb)
    .bind(rmb)
    .bind(recharge_package_status_label(status))
    .bind(recharge_sku_specs(rmb))
    .bind(requested_at)
    .bind(product_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update recharge sku", error))?;
    Ok(())
}

async fn list_referral_stats(
    pool: &SqlitePool,
    query: ListAdminReferralStatsQuery,
) -> DomainResult<Vec<AdminReferralStatItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            CAST(id AS TEXT) AS id,
            COALESCE(NULLIF(inviter_name_snapshot, ''), NULLIF(inviter_email_snapshot, ''), CAST(inviter_user_id AS TEXT), '') AS inviter,
            COALESCE(total_invited_count, 0) AS total_invited,
            CAST(COALESCE(total_revenue_amount, 0) AS TEXT) AS total_revenue,
            CAST(COALESCE(reward_awarded_amount, 0) AS TEXT) AS bonus_awarded,
            COALESCE(invite_link, '') AS link
        FROM ops_referral_stat_snapshot
        WHERE tenant_id = ?
          AND organization_id = ?
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
    pool: &SqlitePool,
    query: ListAdminPaymentAttemptsQuery,
) -> DomainResult<Vec<AdminPaymentAttemptItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            CAST(pa.id AS TEXT) AS id,
            COALESCE(NULLIF(o.order_no, ''), NULLIF(pa.out_trade_no, ''), '') AS order_no,
            pa.provider AS provider,
            CAST(COALESCE(pa.amount, '0') AS TEXT) AS amount,
            pa.status AS status,
            CAST(COALESCE(pa.paid_at, pa.updated_at, pa.created_at) AS TEXT) AS created_at
        FROM commerce_payment_attempt pa
        LEFT JOIN commerce_order o
          ON o.id = pa.order_id
         AND o.tenant_id = pa.tenant_id
         AND (o.organization_id IS NULL OR pa.organization_id IS NULL OR o.organization_id = pa.organization_id)
        WHERE pa.tenant_id = CAST(? AS TEXT)
          AND pa.organization_id = CAST(? AS TEXT)
        ORDER BY COALESCE(pa.paid_at, pa.updated_at, pa.created_at) DESC, pa.id DESC
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
    tx: &mut Transaction<'_, Sqlite>,
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
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

async fn insert_audit_log_for_target_uuid(
    tx: &mut Transaction<'_, Sqlite>,
    audit_log_uuid: &str,
    request_id: &str,
    tenant_id: i64,
    organization_id: i64,
    operator_id: i64,
    operator_type: i32,
    action: &'static str,
    target_type: i32,
    target_uuid: &str,
    change_summary: serde_json::Value,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        INSERT INTO ops_audit_log
            (uuid, tenant_id, organization_id, action, target_type, target_uuid, request_id, operator_id, operator_type, change_summary)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#,
    )
    .bind(audit_log_uuid)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(action)
    .bind(target_type)
    .bind(target_uuid)
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
    CAST(id AS TEXT) AS id,
    CAST(coupon_template_id AS TEXT) AS coupon_id,
    COALESCE(title, '') AS name,
    COALESCE(generated_quantity, requested_quantity, 0) AS count,
    COALESCE(code_prefix, '') AS prefix,
    CAST(created_at AS TEXT) AS created_at
FROM commerce_coupon_issue_batch
WHERE tenant_id = CAST(? AS TEXT)
  AND organization_id = CAST(? AS TEXT)
  AND status = 'active'
ORDER BY created_at DESC, id DESC
LIMIT 500
"#;

const BATCH_BY_ID_SQL: &str = r#"
SELECT
    CAST(id AS TEXT) AS id,
    CAST(coupon_template_id AS TEXT) AS coupon_id,
    COALESCE(title, '') AS name,
    COALESCE(generated_quantity, requested_quantity, 0) AS count,
    COALESCE(code_prefix, '') AS prefix,
    CAST(created_at AS TEXT) AS created_at
FROM commerce_coupon_issue_batch
WHERE id = ?
  AND tenant_id = CAST(? AS TEXT)
  AND organization_id = CAST(? AS TEXT)
  AND status = 'active'
LIMIT 1
"#;

fn coupon_from_row(row: &sqlx::sqlite::SqliteRow) -> DomainResult<AdminCouponItem> {
    let amount = string_cell(row, "amount");
    let discount = string_cell(row, "discount");
    let coupon_type = coupon_type_label(&string_cell(row, "type_code"))?.to_owned();
    let value = if coupon_type == "discount" {
        discount_value_string(&discount)
    } else {
        decimal_money_string(&amount)
    };
    let status = coupon_status_label(&string_cell(row, "status"))?.to_owned();
    Ok(AdminCouponItem {
        id: string_cell(row, "id"),
        name: string_cell(row, "name"),
        coupon_type,
        value,
        status,
    })
}

fn batch_from_row(row: &sqlx::sqlite::SqliteRow) -> DomainResult<AdminCouponBatchItem> {
    Ok(AdminCouponBatchItem {
        id: string_cell(row, "id"),
        coupon_id: string_cell(row, "coupon_id"),
        name: string_cell(row, "name"),
        count: integer_cell(row, "count"),
        prefix: string_cell(row, "prefix"),
        created_at: string_cell(row, "created_at"),
    })
}

fn promo_code_from_row(row: &sqlx::sqlite::SqliteRow) -> DomainResult<AdminPromoCodeItem> {
    let user_id = optional_string_cell(row, "user_id");
    let used_at = optional_string_cell(row, "used_at").filter(|value| !value.is_empty());
    let status = promo_status_label(
        &string_cell(row, "status"),
        user_id.as_deref(),
        used_at.as_deref(),
    )?
    .to_owned();
    Ok(AdminPromoCodeItem {
        id: string_cell(row, "id"),
        batch_id: string_cell(row, "batch_id"),
        code: string_cell(row, "code"),
        status,
        used_by: optional_string_cell(row, "used_by").filter(|value| !value.is_empty()),
        used_at,
    })
}

fn recharge_record_from_row(
    row: &sqlx::sqlite::SqliteRow,
) -> DomainResult<AdminRechargeRecordItem> {
    let status = recharge_status_label(&string_cell(row, "status"))?.to_owned();
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

fn coupon_template_no(coupon_uuid: &str) -> String {
    format!("tpl-{coupon_uuid}")
}

fn coupon_discount_type(value: &str) -> &'static str {
    if value == "discount" {
        "percentage"
    } else {
        "fixed_amount"
    }
}

trait AdminCouponDiscountValue {
    fn coupon_type(&self) -> &str;
    fn amount_cents(&self) -> i64;
    fn discount_value(&self) -> Option<&str>;
}

impl AdminCouponDiscountValue for CreateAdminCouponCommand {
    fn coupon_type(&self) -> &str {
        &self.coupon_type
    }

    fn amount_cents(&self) -> i64 {
        self.amount_cents
    }

    fn discount_value(&self) -> Option<&str> {
        self.discount_value.as_deref()
    }
}

impl AdminCouponDiscountValue for UpdateAdminCouponCommand {
    fn coupon_type(&self) -> &str {
        &self.coupon_type
    }

    fn amount_cents(&self) -> i64 {
        self.amount_cents
    }

    fn discount_value(&self) -> Option<&str> {
        self.discount_value.as_deref()
    }
}

fn coupon_discount_value(command: &impl AdminCouponDiscountValue) -> String {
    if command.coupon_type() == "discount" {
        command.discount_value().unwrap_or("0").to_owned()
    } else {
        let cents = command.amount_cents();
        format!("{}.{:02}", cents / 100, cents.rem_euclid(100))
    }
}

fn coupon_type_label(value: &str) -> DomainResult<&'static str> {
    match value.trim().to_ascii_lowercase().as_str() {
        "fixed_amount" | "amount" | "fixed" | "cash" => Ok("amount"),
        "percentage" | "percent" | "discount" => Ok("discount"),
        value => Err(DomainError::new(format!(
            "unsupported admin coupon type: {value}"
        ))),
    }
}

fn coupon_status_value(value: &str) -> &'static str {
    if value == "inactive" {
        CommerceCouponStatus::Draft.as_str()
    } else {
        CommerceCouponStatus::Active.as_str()
    }
}

fn coupon_status_label(value: &str) -> DomainResult<&'static str> {
    match value.trim().to_ascii_lowercase().as_str() {
        status if status == CommerceCouponStatus::Active.as_str() => Ok("active"),
        status if status == CommerceCouponStatus::Draft.as_str() => Ok("inactive"),
        status if status == CommerceCouponStatus::Disabled.as_str() => Ok("inactive"),
        status if status == CommerceCouponStatus::Expired.as_str() => Ok("inactive"),
        status if status == CommerceCouponStatus::Redeemed.as_str() => Ok("inactive"),
        value => Err(DomainError::new(format!(
            "unsupported admin coupon status: {value}"
        ))),
    }
}

fn promo_status_value(value: &str) -> &'static str {
    match value {
        "used" => CommerceCouponStatus::Redeemed.as_str(),
        "voided" => CommerceCouponStatus::Disabled.as_str(),
        _ => CommerceCouponStatus::Active.as_str(),
    }
}

fn ensure_promo_status_transition(
    fact: &PromoCodeStatusFact,
    target_status: &str,
) -> DomainResult<()> {
    let has_user = fact.user_id.is_some();
    let has_used_at = fact
        .used_at
        .as_deref()
        .map(|value| !value.is_empty())
        .unwrap_or(false);
    let is_used = fact.status == CommerceCouponStatus::Redeemed.as_str() || has_used_at;

    if is_used {
        if target_status == CommerceCouponStatus::Redeemed.as_str() {
            return Ok(());
        }
        return Err(DomainError::conflict("used promo code cannot be reopened"));
    }

    if target_status == CommerceCouponStatus::Active.as_str() && has_user {
        return Err(DomainError::conflict(
            "claimed promo code cannot be reopened",
        ));
    }

    if target_status == CommerceCouponStatus::Redeemed.as_str() && !has_user {
        return Err(DomainError::conflict(
            "promo code must be claimed before it can be marked used",
        ));
    }

    Ok(())
}

fn promo_status_label(
    status: &str,
    user_id: Option<&str>,
    used_at: Option<&str>,
) -> DomainResult<&'static str> {
    match status.trim().to_ascii_lowercase().as_str() {
        status if status == CommerceCouponStatus::Disabled.as_str() => Ok("voided"),
        status if status == CommerceCouponStatus::Redeemed.as_str() => Ok("used"),
        status if status == CommerceCouponStatus::Active.as_str() && used_at.is_some() => {
            Ok("used")
        }
        status
            if status == CommerceCouponStatus::Active.as_str()
                && user_id.map(|value| !value.is_empty()).unwrap_or(false) =>
        {
            Ok("claimed")
        }
        status if status == CommerceCouponStatus::Active.as_str() => Ok("available"),
        status if status == CommerceCouponStatus::Draft.as_str() => Ok("available"),
        value => Err(DomainError::new(format!(
            "unsupported admin promo code status: {value}"
        ))),
    }
}

fn recharge_status_label(value: &str) -> DomainResult<&'static str> {
    match value.trim().to_ascii_lowercase().as_str() {
        "" | "pending" | "pending_payment" => Ok("pending"),
        status if status == CommerceRechargeStatus::Pending.as_str() => Ok("pending"),
        status if status == CommerceRechargeStatus::Paid.as_str() => Ok("success"),
        status if status == CommerceRechargeStatus::Fulfilled.as_str() => Ok("success"),
        "succeeded" | "success" => Ok("success"),
        "failed" | "cancelled" | "canceled" => Ok("failed"),
        status if status == CommerceRechargeStatus::Closed.as_str() => Ok("closed"),
        "expired" => Ok("closed"),
        status => Err(DomainError::new(format!(
            "unsupported admin recharge status: {status}"
        ))),
    }
}

fn recharge_package_from_row(
    row: &sqlx::sqlite::SqliteRow,
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

fn exchange_rule_from_row(row: &sqlx::sqlite::SqliteRow) -> DomainResult<AdminExchangeRuleItem> {
    Ok(AdminExchangeRuleItem {
        id: string_cell(row, "id"),
        source_asset_type: display_asset_type(&string_cell(row, "source_asset_type"))?,
        target_asset_type: display_asset_type(&string_cell(row, "target_asset_type"))?,
        rate: canonical_decimal_string(&string_cell(row, "rate"), 6, "exchange rule rate")?,
        status: string_cell(row, "status"),
    })
}

fn payment_attempt_from_row(
    row: &sqlx::sqlite::SqliteRow,
) -> DomainResult<AdminPaymentAttemptItem> {
    Ok(AdminPaymentAttemptItem {
        id: string_cell(row, "id"),
        order_no: string_cell(row, "order_no"),
        provider: payment_provider_label(&string_cell(row, "provider")),
        amount: canonical_money_string(&string_cell(row, "amount"), "payment attempt amount")?,
        status: payment_status_label(&string_cell(row, "status"))?.to_owned(),
        created_at: string_cell(row, "created_at"),
    })
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

fn payment_status_label(value: &str) -> DomainResult<&'static str> {
    match value.trim().to_ascii_lowercase().as_str() {
        "" => Ok("pending"),
        status if status == CommercePaymentStatus::Pending.as_str() => Ok("pending"),
        status if status == CommercePaymentStatus::Succeeded.as_str() => Ok("success"),
        "success" => Ok("success"),
        status if status == CommercePaymentStatus::Failed.as_str() => Ok("failed"),
        status if status == CommercePaymentStatus::Canceled.as_str() => Ok("expired"),
        "cancelled" | "expired" => Ok("expired"),
        status => Err(DomainError::new(format!(
            "unsupported admin payment attempt status: {status}"
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

fn exchange_rule_id(command: &UpdateAdminExchangeRuleCommand) -> String {
    format!(
        "exchange-rule-{}-{}-{}-{}",
        command.subject.tenant_id,
        command.subject.organization_id,
        storage_asset_type(&command.source_asset_type).unwrap_or(POINTS_STORAGE_ASSET_TYPE),
        storage_asset_type(&command.target_asset_type).unwrap_or(CASH_STORAGE_ASSET_TYPE)
    )
}

fn storage_asset_type(value: &str) -> DomainResult<&'static str> {
    match value.trim() {
        POINTS_ASSET_TYPE => Ok(POINTS_STORAGE_ASSET_TYPE),
        CASH_ASSET_TYPE => Ok(CASH_STORAGE_ASSET_TYPE),
        value => Err(DomainError::new(format!(
            "unsupported exchange rule asset type: {value}"
        ))),
    }
}

fn display_asset_type(value: &str) -> DomainResult<String> {
    match value.trim() {
        POINTS_STORAGE_ASSET_TYPE => Ok(POINTS_ASSET_TYPE.to_owned()),
        CASH_STORAGE_ASSET_TYPE => Ok(CASH_ASSET_TYPE.to_owned()),
        value => Err(DomainError::new(format!(
            "unsupported exchange rule asset type: {value}"
        ))),
    }
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

fn recharge_package_id(tenant_id: i64, organization_id: i64, sequence: i64) -> String {
    format!("recharge-package-{tenant_id}-{organization_id}-{sequence}")
}

fn recharge_package_no(sequence: i64) -> String {
    format!("RECHARGE-PACKAGE-{sequence}")
}

fn recharge_product_id(tenant_id: i64, organization_id: i64, sequence: i64) -> String {
    format!("recharge-product-{tenant_id}-{organization_id}-{sequence}")
}

fn recharge_product_no(sequence: i64) -> String {
    format!("RECHARGE-PRODUCT-{sequence}")
}

fn recharge_sku_id(tenant_id: i64, organization_id: i64, sequence: i64) -> String {
    format!("recharge-sku-{tenant_id}-{organization_id}-{sequence}")
}

fn recharge_sku_no(sequence: i64) -> String {
    format!("RECHARGE-SKU-{sequence}")
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

fn optional_string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<String> {
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

fn string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> String {
    optional_string_cell(row, column).unwrap_or_default()
}

fn integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> i64 {
    optional_integer_cell(row, column).unwrap_or(0)
}

fn optional_integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<i64> {
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
        assert_eq!(
            "active",
            coupon_status_label(CommerceCouponStatus::Active.as_str()).unwrap()
        );
        assert_eq!(
            "inactive",
            coupon_status_label(CommerceCouponStatus::Draft.as_str()).unwrap()
        );
        assert_eq!(
            "inactive",
            coupon_status_label(CommerceCouponStatus::Disabled.as_str()).unwrap()
        );

        let unsupported =
            coupon_status_label("legacy-status").expect_err("unknown coupon status must fail");
        assert!(
            unsupported
                .to_string()
                .contains("unsupported admin coupon status: legacy-status"),
            "{unsupported}"
        );
    }

    #[test]
    fn coupon_type_label_rejects_unknown_database_type_without_deriving_from_discount() {
        assert_eq!("amount", coupon_type_label("fixed_amount").unwrap());
        assert_eq!("discount", coupon_type_label("percentage").unwrap());

        let unsupported =
            coupon_type_label("legacy-type").expect_err("unknown coupon type must fail");
        assert!(
            unsupported
                .to_string()
                .contains("unsupported admin coupon type: legacy-type"),
            "{unsupported}"
        );
    }

    #[test]
    fn promo_status_label_rejects_unknown_database_status_without_deriving_valid_state() {
        assert_eq!(
            "available",
            promo_status_label(CommerceCouponStatus::Active.as_str(), None, None).unwrap()
        );
        assert_eq!(
            "claimed",
            promo_status_label(CommerceCouponStatus::Active.as_str(), Some("30"), None).unwrap()
        );
        assert_eq!(
            "used",
            promo_status_label(
                CommerceCouponStatus::Active.as_str(),
                Some("30"),
                Some("2026-05-01")
            )
            .unwrap()
        );
        assert_eq!(
            "voided",
            promo_status_label(
                CommerceCouponStatus::Disabled.as_str(),
                Some("30"),
                Some("2026-05-01")
            )
            .unwrap()
        );

        let positive = promo_status_label("legacy-status", Some("30"), Some("2026-05-01"))
            .expect_err("unknown promo status must fail even with used metadata");
        assert!(
            positive
                .to_string()
                .contains("unsupported admin promo code status: legacy-status"),
            "{positive}"
        );
    }

    #[test]
    fn recharge_status_label_rejects_unknown_database_status() {
        assert_eq!("pending", recharge_status_label("pending_payment").unwrap());
        assert_eq!(
            "pending",
            recharge_status_label(CommerceRechargeStatus::Pending.as_str()).unwrap()
        );
        assert_eq!(
            "success",
            recharge_status_label(CommerceRechargeStatus::Paid.as_str()).unwrap()
        );
        assert_eq!(
            "success",
            recharge_status_label(CommerceRechargeStatus::Fulfilled.as_str()).unwrap()
        );
        assert_eq!("failed", recharge_status_label("cancelled").unwrap());
        assert_eq!(
            "closed",
            recharge_status_label(CommerceRechargeStatus::Closed.as_str()).unwrap()
        );
        assert_eq!("closed", recharge_status_label("expired").unwrap());

        let unsupported =
            recharge_status_label("legacy-status").expect_err("unknown recharge status must fail");
        assert!(
            unsupported
                .to_string()
                .contains("unsupported admin recharge status: legacy-status"),
            "{unsupported}"
        );
    }

    #[test]
    fn payment_status_label_rejects_unknown_database_status() {
        assert_eq!(
            "pending",
            payment_status_label(CommercePaymentStatus::Pending.as_str()).unwrap()
        );
        assert_eq!(
            "success",
            payment_status_label(CommercePaymentStatus::Succeeded.as_str()).unwrap()
        );
        assert_eq!(
            "failed",
            payment_status_label(CommercePaymentStatus::Failed.as_str()).unwrap()
        );
        assert_eq!(
            "expired",
            payment_status_label(CommercePaymentStatus::Canceled.as_str()).unwrap()
        );

        let unsupported =
            payment_status_label("legacy-status").expect_err("unknown payment status must fail");
        assert!(
            unsupported
                .to_string()
                .contains("unsupported admin payment attempt status: legacy-status"),
            "{unsupported}"
        );
    }
}
