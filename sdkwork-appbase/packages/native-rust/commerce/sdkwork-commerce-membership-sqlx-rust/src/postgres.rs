use std::collections::BTreeMap;

use sdkwork_commerce_core::{CommercePaymentStatus, CommerceServiceError};
use sqlx::{PgPool, Postgres, Row, Transaction};

use crate::read_model::is_missing_postgres_read_model;
use crate::shared::{
    benefits_for_plan, build_package_group_from_packages, decimal_string,
    map_membership_package_record, method_alias, normalize_payment_method,
    parse_membership_plan_benefit_json, parse_points_amount, plan_code_from_rank,
    plan_rank_from_code, privilege_usage_from_benefits, ParsedMembershipPackage,
    StoredMembershipPlan, POINTS_ASSET_TYPE, POINTS_CURRENCY_CODE,
};
use crate::{
    AdminMembershipEntitlementItem, AdminMembershipFuture, AdminMembershipMemberItem,
    AdminMembershipPackageGroupItem, AdminMembershipPackageItem, AdminMembershipPlanItem,
    AdminMembershipStore, AppMembershipBenefitItem, AppMembershipCommandFuture,
    AppMembershipDailyRewardResponse, AppMembershipDailyRewardStatusResponse,
    AppMembershipInfoResponse, AppMembershipPackageGroupItem, AppMembershipPackageItem,
    AppMembershipPlanItem, AppMembershipPointsBalanceResponse, AppMembershipPointsHistoryItem,
    AppMembershipPointsHistoryQuery, AppMembershipPrivilegeUsageResponse,
    AppMembershipPurchaseOutcome, AppMembershipReadFuture, AppMembershipResult,
    AppMembershipStatusResponse, AppMembershipStore, AppMembershipSubject,
    CreateAdminMembershipPackageCommand, CreateAdminMembershipPackageGroupCommand,
    CreateAdminMembershipPlanCommand, DeleteAdminMembershipPackageCommand,
    DeleteAdminMembershipPackageGroupCommand, DeleteAdminMembershipPlanCommand,
    ListAdminMembershipEntitlementsQuery, ListAdminMembershipMembersQuery,
    ListAdminMembershipPackageGroupsQuery, ListAdminMembershipPackagesQuery,
    ListAdminMembershipPlansQuery, SubmitMembershipPurchaseCommand,
    UpdateAdminMembershipMemberStatusCommand, UpdateAdminMembershipPackageCommand,
    UpdateAdminMembershipPackageGroupCommand, UpdateAdminMembershipPlanCommand,
};

const LOAD_MEMBERSHIP_PLANS: &str = r#"
SELECT
    id,
    plan_no AS plan_no,
    name,
    benefits_json AS benefit_json
FROM commerce_membership_plan
WHERE (tenant_id = '0' OR tenant_id IS NULL)
  AND (organization_id = '0' OR organization_id IS NULL)
  AND status = 'active'
ORDER BY rank ASC, plan_no ASC, id ASC
"#;

const LOAD_MEMBERSHIP_PACKAGES: &str = r#"
SELECT
    CAST(p.external_id AS BIGINT) AS external_id,
    p.name,
    p.description,
    CAST(p.price_amount AS TEXT) AS price_amount,
    CAST(COALESCE(p.original_price_amount, '') AS TEXT) AS original_price_amount,
    CAST(COALESCE(p.point_amount, 0) AS BIGINT) AS point_amount,
    CAST(p.duration_days AS BIGINT) AS duration_days,
    CAST(COALESCE(p.sort_weight, 0) AS BIGINT) AS sort_weight,
    CAST(COALESCE(p.recommended, 0) AS BIGINT) AS recommended,
    COALESCE(p.tags_json, '[]') AS tags_json,
    p.id AS package_storage_id,
    p.package_group_id AS package_group_storage_id,
    p.plan_id AS plan_storage_id,
    p.sku_id,
    CAST(g.external_id AS BIGINT) AS group_external_id,
    g.name AS group_name,
    g.description AS group_description,
    CAST(COALESCE(g.sort_weight, 0) AS BIGINT) AS group_sort_weight,
    l.plan_no AS plan_no,
    l.name AS plan_name,
    CAST(l.rank AS BIGINT) AS rank
FROM commerce_membership_package p
JOIN commerce_membership_package_group g
    ON g.id = p.package_group_id
LEFT JOIN commerce_membership_plan l
    ON l.id = p.plan_id
WHERE (p.tenant_id = '0' OR p.tenant_id IS NULL)
  AND (p.organization_id = '0' OR p.organization_id IS NULL)
  AND (g.tenant_id = '0' OR g.tenant_id IS NULL)
  AND (g.organization_id = '0' OR g.organization_id IS NULL)
  AND p.status = 'active'
  AND g.status = 'active'
ORDER BY g.sort_weight ASC, p.sort_weight ASC, p.external_id ASC
"#;

const LOAD_MEMBERSHIP: &str = r#"
SELECT
    m.id AS membership_id,
    m.plan_id AS plan_storage_id,
    m.status,
    CAST(m.starts_at AS TEXT) AS starts_at,
    CAST(m.expires_at AS TEXT) AS expires_at,
    l.plan_no AS plan_no,
    l.name AS plan_name,
    l.benefits_json AS benefit_json,
    CAST(COALESCE(ab.payable_amount, pi.amount, '0') AS TEXT) AS total_spent
FROM commerce_membership m
LEFT JOIN commerce_membership_plan l
    ON l.id = m.plan_id
LEFT JOIN commerce_order_amount_breakdown ab
    ON ab.order_id = m.source_order_id
LEFT JOIN commerce_payment_intent pi
    ON pi.id = m.source_payment_intent_id
WHERE m.tenant_id = CAST($1 AS TEXT)
  AND (m.organization_id IS NULL OR m.organization_id = CAST($2 AS TEXT))
  AND m.owner_user_id = CAST($3 AS TEXT)
ORDER BY m.created_at DESC NULLS LAST, m.id DESC
LIMIT 1
"#;

const LOAD_POINTS_BALANCE: &str = r#"
SELECT
    CAST(available_amount AS TEXT) AS available_amount,
    CAST(frozen_amount AS TEXT) AS frozen_amount
FROM commerce_account
WHERE tenant_id = CAST($1 AS TEXT)
  AND (organization_id IS NULL OR organization_id = CAST($2 AS TEXT))
  AND owner_user_id = CAST($3 AS TEXT)
  AND asset_type = $4
  AND (currency_code = $5 OR currency_code IS NULL)
  AND status = 'active'
ORDER BY updated_at DESC NULLS LAST, id DESC
LIMIT 1
"#;

const LOAD_POINTS_HISTORY: &str = r#"
SELECT
    id,
    direction,
    CAST(amount AS TEXT) AS amount,
    CAST(balance_after AS TEXT) AS balance_after,
    business_type,
    source_type,
    remark,
    CAST(created_at AS TEXT) AS created_at
FROM commerce_account_ledger_entry
WHERE tenant_id = CAST($1 AS TEXT)
  AND (organization_id IS NULL OR organization_id = CAST($2 AS TEXT))
  AND owner_user_id = CAST($3 AS TEXT)
  AND asset_type = $4
ORDER BY created_at DESC NULLS LAST, id DESC
LIMIT $5 OFFSET $6
"#;

const LOAD_PAYMENT_METHOD: &str = r#"
SELECT
    method_key,
    provider
FROM commerce_payment_method
WHERE (tenant_id = CAST($1 AS TEXT) OR tenant_id = '0')
  AND (organization_id = CAST($2 AS TEXT) OR organization_id = '0')
  AND status = 'active'
  AND (LOWER(method_key) = $3 OR LOWER(method_key) = $4 OR LOWER(provider) = $3 OR LOWER(provider) = $4)
ORDER BY tenant_id DESC, organization_id DESC, sort_weight ASC, id ASC
LIMIT 1
"#;

#[derive(Debug, Clone)]
pub struct PostgresCommerceMembershipStore {
    pool: PgPool,
}

impl PostgresCommerceMembershipStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub fn load_info<'a>(
        &'a self,
        subject: Option<AppMembershipSubject>,
    ) -> AppMembershipReadFuture<'a, AppMembershipInfoResponse> {
        <Self as AppMembershipStore>::load_info(self, subject)
    }

    pub fn load_status<'a>(
        &'a self,
        subject: Option<AppMembershipSubject>,
    ) -> AppMembershipReadFuture<'a, AppMembershipStatusResponse> {
        <Self as AppMembershipStore>::load_status(self, subject)
    }

    pub fn load_plans<'a>(&'a self) -> AppMembershipReadFuture<'a, Vec<AppMembershipPlanItem>> {
        <Self as AppMembershipStore>::load_plans(self)
    }

    pub fn load_benefits<'a>(
        &'a self,
        subject: Option<AppMembershipSubject>,
        plan_id: Option<i64>,
    ) -> AppMembershipReadFuture<'a, Vec<AppMembershipBenefitItem>> {
        <Self as AppMembershipStore>::load_benefits(self, subject, plan_id)
    }

    pub fn load_packages<'a>(
        &'a self,
        package_group_id: Option<i64>,
        plan_id: Option<i64>,
    ) -> AppMembershipReadFuture<'a, Vec<AppMembershipPackageItem>> {
        <Self as AppMembershipStore>::load_packages(self, package_group_id, plan_id)
    }

    pub fn load_package<'a>(
        &'a self,
        package_id: i64,
    ) -> AppMembershipReadFuture<'a, Option<AppMembershipPackageItem>> {
        <Self as AppMembershipStore>::load_package(self, package_id)
    }

    pub fn load_package_groups<'a>(
        &'a self,
        plan_id: Option<i64>,
        recommended_only: bool,
    ) -> AppMembershipReadFuture<'a, Vec<AppMembershipPackageGroupItem>> {
        <Self as AppMembershipStore>::load_package_groups(self, plan_id, recommended_only)
    }

    pub fn load_package_group<'a>(
        &'a self,
        package_group_id: i64,
    ) -> AppMembershipReadFuture<'a, Option<AppMembershipPackageGroupItem>> {
        <Self as AppMembershipStore>::load_package_group(self, package_group_id)
    }

    pub fn load_points_balance<'a>(
        &'a self,
        subject: Option<AppMembershipSubject>,
    ) -> AppMembershipReadFuture<'a, AppMembershipPointsBalanceResponse> {
        <Self as AppMembershipStore>::load_points_balance(self, subject)
    }

    pub fn load_points_history<'a>(
        &'a self,
        subject: Option<AppMembershipSubject>,
        query: AppMembershipPointsHistoryQuery,
    ) -> AppMembershipReadFuture<'a, Vec<AppMembershipPointsHistoryItem>> {
        <Self as AppMembershipStore>::load_points_history(self, subject, query)
    }

    pub fn load_daily_reward_status<'a>(
        &'a self,
        subject: Option<AppMembershipSubject>,
    ) -> AppMembershipReadFuture<'a, AppMembershipDailyRewardStatusResponse> {
        <Self as AppMembershipStore>::load_daily_reward_status(self, subject)
    }

    pub fn claim_daily_reward<'a>(
        &'a self,
        subject: AppMembershipSubject,
        requested_at: String,
    ) -> AppMembershipReadFuture<'a, AppMembershipDailyRewardResponse> {
        <Self as AppMembershipStore>::claim_daily_reward(self, subject, requested_at)
    }

    pub fn load_privilege_usage<'a>(
        &'a self,
        subject: Option<AppMembershipSubject>,
    ) -> AppMembershipReadFuture<'a, AppMembershipPrivilegeUsageResponse> {
        <Self as AppMembershipStore>::load_privilege_usage(self, subject)
    }

    pub fn submit_purchase<'a>(
        &'a self,
        command: SubmitMembershipPurchaseCommand,
    ) -> AppMembershipCommandFuture<'a> {
        <Self as AppMembershipStore>::submit_purchase(self, command)
    }
}

impl AppMembershipStore for PostgresCommerceMembershipStore {
    fn load_info<'a>(
        &'a self,
        subject: Option<AppMembershipSubject>,
    ) -> AppMembershipReadFuture<'a, AppMembershipInfoResponse> {
        Box::pin(async move { load_info(&self.pool, subject).await })
    }

    fn load_status<'a>(
        &'a self,
        subject: Option<AppMembershipSubject>,
    ) -> AppMembershipReadFuture<'a, AppMembershipStatusResponse> {
        Box::pin(async move { load_status(&self.pool, subject).await })
    }

    fn load_plans<'a>(&'a self) -> AppMembershipReadFuture<'a, Vec<AppMembershipPlanItem>> {
        Box::pin(async move { load_plans(&self.pool).await.map(plan_items) })
    }

    fn load_benefits<'a>(
        &'a self,
        subject: Option<AppMembershipSubject>,
        plan_id: Option<i64>,
    ) -> AppMembershipReadFuture<'a, Vec<AppMembershipBenefitItem>> {
        Box::pin(async move { load_benefits(&self.pool, subject, plan_id).await })
    }

    fn load_packages<'a>(
        &'a self,
        package_group_id: Option<i64>,
        plan_id: Option<i64>,
    ) -> AppMembershipReadFuture<'a, Vec<AppMembershipPackageItem>> {
        Box::pin(async move {
            load_package_rows(&self.pool, package_group_id, plan_id)
                .await
                .map(package_items)
        })
    }

    fn load_package<'a>(
        &'a self,
        package_id: i64,
    ) -> AppMembershipReadFuture<'a, Option<AppMembershipPackageItem>> {
        Box::pin(async move {
            Ok(load_package_rows(&self.pool, None, None)
                .await?
                .into_iter()
                .find(|package| package.item.id == package_id)
                .map(|package| package.item))
        })
    }

    fn load_package_groups<'a>(
        &'a self,
        plan_id: Option<i64>,
        recommended_only: bool,
    ) -> AppMembershipReadFuture<'a, Vec<AppMembershipPackageGroupItem>> {
        Box::pin(async move { load_package_groups(&self.pool, plan_id, recommended_only).await })
    }

    fn load_package_group<'a>(
        &'a self,
        package_group_id: i64,
    ) -> AppMembershipReadFuture<'a, Option<AppMembershipPackageGroupItem>> {
        Box::pin(async move {
            Ok(load_package_groups(&self.pool, None, false)
                .await?
                .into_iter()
                .find(|group| group.id == package_group_id))
        })
    }

    fn load_points_balance<'a>(
        &'a self,
        subject: Option<AppMembershipSubject>,
    ) -> AppMembershipReadFuture<'a, AppMembershipPointsBalanceResponse> {
        Box::pin(async move { load_points_balance(&self.pool, subject).await })
    }

    fn load_points_history<'a>(
        &'a self,
        subject: Option<AppMembershipSubject>,
        query: AppMembershipPointsHistoryQuery,
    ) -> AppMembershipReadFuture<'a, Vec<AppMembershipPointsHistoryItem>> {
        Box::pin(async move { load_points_history(&self.pool, subject, query).await })
    }

    fn load_daily_reward_status<'a>(
        &'a self,
        _subject: Option<AppMembershipSubject>,
    ) -> AppMembershipReadFuture<'a, AppMembershipDailyRewardStatusResponse> {
        Box::pin(async {
            Ok(AppMembershipDailyRewardStatusResponse {
                can_claim: false,
                claimed_today: false,
                consecutive_days: 0,
                total_days: 0,
            })
        })
    }

    fn claim_daily_reward<'a>(
        &'a self,
        _subject: AppMembershipSubject,
        _requested_at: String,
    ) -> AppMembershipReadFuture<'a, AppMembershipDailyRewardResponse> {
        Box::pin(async {
            Err(CommerceServiceError::conflict(
                "membership daily reward is unavailable without reward configuration",
            ))
        })
    }

    fn load_privilege_usage<'a>(
        &'a self,
        subject: Option<AppMembershipSubject>,
    ) -> AppMembershipReadFuture<'a, AppMembershipPrivilegeUsageResponse> {
        Box::pin(async move {
            let benefits = load_benefits(&self.pool, subject, None).await?;
            Ok(privilege_usage_from_benefits(&benefits))
        })
    }

    fn consume_speed_up<'a>(
        &'a self,
        subject: AppMembershipSubject,
        requested_at: String,
    ) -> AppMembershipReadFuture<'a, ()> {
        Box::pin(async move { consume_speed_up(&self.pool, subject, requested_at).await })
    }

    fn submit_purchase<'a>(
        &'a self,
        command: SubmitMembershipPurchaseCommand,
    ) -> AppMembershipCommandFuture<'a> {
        Box::pin(async move { submit_purchase(&self.pool, command).await })
    }
}

impl AdminMembershipStore for PostgresCommerceMembershipStore {
    fn list_admin_membership_plans<'a>(
        &'a self,
        query: ListAdminMembershipPlansQuery,
    ) -> AdminMembershipFuture<'a, Vec<AdminMembershipPlanItem>> {
        Box::pin(async move { list_admin_membership_plans(&self.pool, query).await })
    }

    fn create_admin_membership_plan<'a>(
        &'a self,
        command: CreateAdminMembershipPlanCommand,
    ) -> AdminMembershipFuture<'a, AdminMembershipPlanItem> {
        Box::pin(async move { create_admin_membership_plan(&self.pool, command).await })
    }

    fn update_admin_membership_plan<'a>(
        &'a self,
        command: UpdateAdminMembershipPlanCommand,
    ) -> AdminMembershipFuture<'a, AdminMembershipPlanItem> {
        Box::pin(async move { update_admin_membership_plan(&self.pool, command).await })
    }

    fn delete_admin_membership_plan<'a>(
        &'a self,
        command: DeleteAdminMembershipPlanCommand,
    ) -> AdminMembershipFuture<'a, bool> {
        Box::pin(async move { delete_admin_membership_plan(&self.pool, command).await })
    }

    fn list_admin_membership_packages<'a>(
        &'a self,
        query: ListAdminMembershipPackagesQuery,
    ) -> AdminMembershipFuture<'a, Vec<AdminMembershipPackageItem>> {
        Box::pin(async move { list_admin_membership_packages(&self.pool, query).await })
    }

    fn list_admin_membership_package_groups<'a>(
        &'a self,
        query: ListAdminMembershipPackageGroupsQuery,
    ) -> AdminMembershipFuture<'a, Vec<AdminMembershipPackageGroupItem>> {
        Box::pin(async move { list_admin_membership_package_groups(&self.pool, query).await })
    }

    fn create_admin_membership_package_group<'a>(
        &'a self,
        command: CreateAdminMembershipPackageGroupCommand,
    ) -> AdminMembershipFuture<'a, AdminMembershipPackageGroupItem> {
        Box::pin(async move { create_admin_membership_package_group(&self.pool, command).await })
    }

    fn update_admin_membership_package_group<'a>(
        &'a self,
        command: UpdateAdminMembershipPackageGroupCommand,
    ) -> AdminMembershipFuture<'a, AdminMembershipPackageGroupItem> {
        Box::pin(async move { update_admin_membership_package_group(&self.pool, command).await })
    }

    fn delete_admin_membership_package_group<'a>(
        &'a self,
        command: DeleteAdminMembershipPackageGroupCommand,
    ) -> AdminMembershipFuture<'a, bool> {
        Box::pin(async move { delete_admin_membership_package_group(&self.pool, command).await })
    }

    fn create_admin_membership_package<'a>(
        &'a self,
        command: CreateAdminMembershipPackageCommand,
    ) -> AdminMembershipFuture<'a, AdminMembershipPackageItem> {
        Box::pin(async move { create_admin_membership_package(&self.pool, command).await })
    }

    fn update_admin_membership_package<'a>(
        &'a self,
        command: UpdateAdminMembershipPackageCommand,
    ) -> AdminMembershipFuture<'a, AdminMembershipPackageItem> {
        Box::pin(async move { update_admin_membership_package(&self.pool, command).await })
    }

    fn delete_admin_membership_package<'a>(
        &'a self,
        command: DeleteAdminMembershipPackageCommand,
    ) -> AdminMembershipFuture<'a, bool> {
        Box::pin(async move { delete_admin_membership_package(&self.pool, command).await })
    }

    fn list_admin_membership_members<'a>(
        &'a self,
        query: ListAdminMembershipMembersQuery,
    ) -> AdminMembershipFuture<'a, Vec<AdminMembershipMemberItem>> {
        Box::pin(async move { list_admin_membership_members(&self.pool, query).await })
    }

    fn update_admin_membership_member_status<'a>(
        &'a self,
        command: UpdateAdminMembershipMemberStatusCommand,
    ) -> AdminMembershipFuture<'a, AdminMembershipMemberItem> {
        Box::pin(async move { update_admin_membership_member_status(&self.pool, command).await })
    }

    fn list_admin_membership_entitlements<'a>(
        &'a self,
        query: ListAdminMembershipEntitlementsQuery,
    ) -> AdminMembershipFuture<'a, Vec<AdminMembershipEntitlementItem>> {
        Box::pin(async move { list_admin_membership_entitlements(&self.pool, query).await })
    }
}

async fn list_admin_membership_plans(
    pool: &PgPool,
    query: ListAdminMembershipPlansQuery,
) -> AppMembershipResult<Vec<AdminMembershipPlanItem>> {
    let rows = sqlx::query(
        r#"
        SELECT id, plan_no AS plan_no, name, CAST(rank AS BIGINT) AS rank, benefits_json AS benefit_json, status
        FROM commerce_membership_plan
        WHERE (tenant_id = '0' OR tenant_id = CAST($1 AS TEXT))
          AND ($2 IS NULL OR status = $2)
        ORDER BY rank ASC, plan_no ASC, id ASC
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.status.as_deref())
    .fetch_all(pool)
    .await
    .or_else(empty_rows_when_read_model_is_missing)?;
    Ok(rows.iter().map(map_admin_plan).collect())
}

async fn create_admin_membership_plan(
    pool: &PgPool,
    command: CreateAdminMembershipPlanCommand,
) -> AppMembershipResult<AdminMembershipPlanItem> {
    let benefit_json =
        admin_plan_benefit_json("{}", command.input.rank, command.input.benefits.as_deref());
    sqlx::query(
        r#"
        INSERT INTO commerce_membership_plan
            (id, tenant_id, organization_id, plan_no, name, plan_code, rank, duration_days, benefits_json, visible_surfaces, status, created_at, updated_at)
        VALUES
            ($1, '0', '0', $2, $3, $2, $7, 0, $4, '["membership","console","playground","api"]', $5, $6, $6)
        "#,
    )
    .bind(&command.plan_id)
    .bind(&command.input.code)
    .bind(&command.input.name)
    .bind(benefit_json)
    .bind(&command.input.status)
    .bind(&command.requested_at)
    .bind(command.input.rank)
    .execute(pool)
    .await
    .map_err(|error| store_error("failed to create membership plan", error))?;
    load_admin_membership_plan(pool, &command.plan_id).await
}

async fn update_admin_membership_plan(
    pool: &PgPool,
    command: UpdateAdminMembershipPlanCommand,
) -> AppMembershipResult<AdminMembershipPlanItem> {
    let row = sqlx::query(
        r#"
        SELECT id, benefits_json AS benefit_json
        FROM commerce_membership_plan
        WHERE id = $1 OR plan_no = $2
        ORDER BY CASE WHEN id = $1 THEN 0 ELSE 1 END
        LIMIT 1
        "#,
    )
    .bind(&command.plan_id)
    .bind(&command.input.code)
    .fetch_optional(pool)
    .await
    .or_else(none_when_read_model_is_missing)?
    .ok_or_else(|| CommerceServiceError::conflict("membership plan was not found"))?;
    let plan_id = string_cell(&row, "id");
    let benefit_json = admin_plan_benefit_json(
        &string_cell(&row, "benefit_json"),
        command.input.rank,
        command.input.benefits.as_deref(),
    );
    sqlx::query(
        r#"
        UPDATE commerce_membership_plan
        SET plan_no = $1,
            plan_code = $1,
            name = $2,
            rank = $3,
            benefits_json = $4,
            status = $5,
            updated_at = $6
        WHERE id = $7
        "#,
    )
    .bind(&command.input.code)
    .bind(&command.input.name)
    .bind(command.input.rank)
    .bind(benefit_json)
    .bind(&command.input.status)
    .bind(&command.requested_at)
    .bind(&plan_id)
    .execute(pool)
    .await
    .map_err(|error| store_error("failed to update membership plan", error))?;
    load_admin_membership_plan(pool, &plan_id).await
}

async fn delete_admin_membership_plan(
    pool: &PgPool,
    command: DeleteAdminMembershipPlanCommand,
) -> AppMembershipResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE commerce_membership_plan
        SET status = 'disabled',
            updated_at = $2
        WHERE id = $1 OR plan_no = $1
        "#,
    )
    .bind(&command.plan_id)
    .bind(&command.requested_at)
    .execute(pool)
    .await
    .map_err(|error| store_error("failed to delete membership plan", error))?;
    Ok(result.rows_affected() > 0)
}

async fn list_admin_membership_packages(
    pool: &PgPool,
    query: ListAdminMembershipPackagesQuery,
) -> AppMembershipResult<Vec<AdminMembershipPackageItem>> {
    let rows = sqlx::query(
        r#"
        SELECT id, package_no, package_group_id AS package_group_id, plan_id AS plan_id, name, CAST(price_amount AS TEXT) AS price_amount,
               currency_code, duration_days AS duration_days, status
        FROM commerce_membership_package
        WHERE (tenant_id = '0' OR tenant_id = CAST($1 AS TEXT))
          AND ($2 IS NULL OR package_group_id = $2)
          AND ($3 IS NULL OR plan_id = $3)
          AND ($4 IS NULL OR status = $4)
        ORDER BY sort_weight ASC, external_id ASC, id ASC
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.package_group_id.as_deref())
    .bind(query.plan_id.as_deref())
    .bind(query.status.as_deref())
    .fetch_all(pool)
    .await
    .or_else(empty_rows_when_read_model_is_missing)?;
    Ok(rows.iter().map(map_admin_package).collect())
}

async fn list_admin_membership_package_groups(
    pool: &PgPool,
    query: ListAdminMembershipPackageGroupsQuery,
) -> AppMembershipResult<Vec<AdminMembershipPackageGroupItem>> {
    let rows = sqlx::query(
        r#"
        SELECT id, group_no, name, description, billing_cycle, duration_days,
               sort_weight, status
        FROM commerce_membership_package_group
        WHERE (tenant_id = '0' OR tenant_id = CAST($1 AS TEXT))
          AND ($2 IS NULL OR status = $2)
        ORDER BY sort_weight ASC NULLS LAST, external_id ASC, id ASC
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.status.as_deref())
    .fetch_all(pool)
    .await
    .or_else(empty_rows_when_read_model_is_missing)?;
    Ok(rows.iter().map(map_admin_package_group).collect())
}

async fn create_admin_membership_package_group(
    pool: &PgPool,
    command: CreateAdminMembershipPackageGroupCommand,
) -> AppMembershipResult<AdminMembershipPackageGroupItem> {
    let external_id = next_admin_package_group_external_id(pool).await?;
    sqlx::query(
        r#"
        INSERT INTO commerce_membership_package_group
            (id, tenant_id, organization_id, external_id, group_no, name, description, billing_cycle, duration_days, sort_weight, status, created_at, updated_at)
        VALUES
            ($1, '0', '0', $2, $3, $4, $5, $6, $7, $8, $9, $10, $10)
        "#,
    )
    .bind(&command.package_group_id)
    .bind(external_id)
    .bind(&command.input.code)
    .bind(&command.input.name)
    .bind(command.input.description.as_deref())
    .bind(recurrence_cycle_from_duration(command.input.duration_days))
    .bind(command.input.duration_days)
    .bind(command.input.sort_weight)
    .bind(&command.input.status)
    .bind(&command.requested_at)
    .execute(pool)
    .await
    .map_err(|error| store_error("failed to create membership package group", error))?;
    load_admin_membership_package_group(pool, &command.package_group_id).await
}

async fn update_admin_membership_package_group(
    pool: &PgPool,
    command: UpdateAdminMembershipPackageGroupCommand,
) -> AppMembershipResult<AdminMembershipPackageGroupItem> {
    let package_group_id =
        package_group_external_id_for_update(pool, &command.package_group_id).await?;
    sqlx::query(
        r#"
        UPDATE commerce_membership_package_group
        SET group_no = $1,
            name = $2,
            description = $3,
            billing_cycle = $4,
            duration_days = $5,
            sort_weight = $6,
            status = $7,
            updated_at = $8
        WHERE id = $9
        "#,
    )
    .bind(&command.input.code)
    .bind(&command.input.name)
    .bind(command.input.description.as_deref())
    .bind(recurrence_cycle_from_duration(command.input.duration_days))
    .bind(command.input.duration_days)
    .bind(command.input.sort_weight)
    .bind(&command.input.status)
    .bind(&command.requested_at)
    .bind(&package_group_id)
    .execute(pool)
    .await
    .map_err(|error| store_error("failed to update membership package group", error))?;
    load_admin_membership_package_group(pool, &package_group_id).await
}

async fn delete_admin_membership_package_group(
    pool: &PgPool,
    command: DeleteAdminMembershipPackageGroupCommand,
) -> AppMembershipResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE commerce_membership_package_group
        SET status = 'disabled',
            updated_at = $2
        WHERE id = $1 OR group_no = $1
        "#,
    )
    .bind(&command.package_group_id)
    .bind(&command.requested_at)
    .execute(pool)
    .await
    .map_err(|error| store_error("failed to delete membership package group", error))?;
    Ok(result.rows_affected() > 0)
}

async fn create_admin_membership_package(
    pool: &PgPool,
    command: CreateAdminMembershipPackageCommand,
) -> AppMembershipResult<AdminMembershipPackageItem> {
    ensure_admin_plan_exists(pool, &command.input.plan_id).await?;
    ensure_admin_package_group_exists(pool, &command.input.package_group_id).await?;
    let external_id = next_admin_package_external_id(pool).await?;
    let sku_id = format!("{}-sku", command.package_id);
    sqlx::query(
        r#"
        INSERT INTO commerce_product_sku
            (id, tenant_id, organization_id, spu_id, sku_no, name, title, price_amount, original_price_amount, currency_code, delivery_mode, inventory_tracking, sales_status, spec_json, created_at, updated_at)
        VALUES
            ($1, '0', '0', 'seed-product-membership', $2, $3, $3, $4, NULL, $5, 'membership_activation', 'untracked', $6, '{}', $7, $7)
        ON CONFLICT (id) DO UPDATE SET
            sku_no = EXCLUDED.sku_no,
            name = EXCLUDED.name,
            title = EXCLUDED.title,
            price_amount = EXCLUDED.price_amount,
            currency_code = EXCLUDED.currency_code,
            sales_status = EXCLUDED.sales_status,
            updated_at = EXCLUDED.updated_at
        "#,
    )
    .bind(&sku_id)
    .bind(&command.input.code)
    .bind(&command.input.name)
    .bind(&command.input.price_amount)
    .bind(&command.input.currency_code)
    .bind(&command.input.status)
    .bind(&command.requested_at)
    .execute(pool)
    .await
    .map_err(|error| store_error("failed to upsert membership package sku", error))?;
    sqlx::query(
        r#"
        INSERT INTO commerce_membership_package
            (id, tenant_id, organization_id, external_id, package_no, package_group_id, plan_id, sku_id, name, description, price_amount, original_price_amount, currency_code, point_amount, duration_days, recurrence_cycle, sort_weight, recommended, tags_json, status, starts_at, ends_at, created_at, updated_at)
        VALUES
            ($1, '0', '0', $2, $3, $4, $5, $6, $7, NULL, $8, NULL, $9, 0, $10, $13, $2, 0, '[]', $11, NULL, NULL, $12, $12)
        "#,
    )
    .bind(&command.package_id)
    .bind(external_id)
    .bind(&command.input.code)
    .bind(&command.input.package_group_id)
    .bind(&command.input.plan_id)
    .bind(&sku_id)
    .bind(&command.input.name)
    .bind(&command.input.price_amount)
    .bind(&command.input.currency_code)
    .bind(command.input.duration_days)
    .bind(&command.input.status)
    .bind(&command.requested_at)
    .bind(recurrence_cycle_from_duration(command.input.duration_days))
    .execute(pool)
    .await
    .map_err(|error| store_error("failed to create membership package", error))?;
    load_admin_membership_package(pool, &command.package_id).await
}

async fn update_admin_membership_package(
    pool: &PgPool,
    command: UpdateAdminMembershipPackageCommand,
) -> AppMembershipResult<AdminMembershipPackageItem> {
    ensure_admin_plan_exists(pool, &command.input.plan_id).await?;
    ensure_admin_package_group_exists(pool, &command.input.package_group_id).await?;
    let current = sqlx::query(
        "SELECT sku_id FROM commerce_membership_package WHERE id = $1 OR package_no = $1 LIMIT 1",
    )
    .bind(&command.package_id)
    .fetch_optional(pool)
    .await
    .or_else(none_when_read_model_is_missing)?
    .ok_or_else(|| CommerceServiceError::conflict("membership package was not found"))?;
    let package_id = package_id_for_update(pool, &command.package_id).await?;
    let sku_id = optional_string_cell(&current, "sku_id")
        .filter(|value| !value.trim().is_empty())
        .unwrap_or_else(|| format!("{package_id}-sku"));
    sqlx::query(
        r#"
        INSERT INTO commerce_product_sku
            (id, tenant_id, organization_id, spu_id, sku_no, name, title, price_amount, original_price_amount, currency_code, delivery_mode, inventory_tracking, sales_status, spec_json, created_at, updated_at)
        VALUES
            ($1, '0', '0', 'seed-product-membership', $2, $3, $3, $4, NULL, $5, 'membership_activation', 'untracked', $6, '{}', $7, $7)
        ON CONFLICT (id) DO UPDATE SET
            sku_no = EXCLUDED.sku_no,
            name = EXCLUDED.name,
            title = EXCLUDED.title,
            price_amount = EXCLUDED.price_amount,
            currency_code = EXCLUDED.currency_code,
            sales_status = EXCLUDED.sales_status,
            updated_at = EXCLUDED.updated_at
        "#,
    )
    .bind(&sku_id)
    .bind(&command.input.code)
    .bind(&command.input.name)
    .bind(&command.input.price_amount)
    .bind(&command.input.currency_code)
    .bind(&command.input.status)
    .bind(&command.requested_at)
    .execute(pool)
    .await
    .map_err(|error| store_error("failed to upsert membership package sku", error))?;
    sqlx::query(
        r#"
        UPDATE commerce_membership_package
        SET package_no = $1,
            package_group_id = $2,
            plan_id = $3,
            sku_id = $4,
            name = $5,
            price_amount = $6,
            currency_code = $7,
            duration_days = $8,
            status = $9,
            updated_at = $10
        WHERE id = $11
        "#,
    )
    .bind(&command.input.code)
    .bind(&command.input.package_group_id)
    .bind(&command.input.plan_id)
    .bind(&sku_id)
    .bind(&command.input.name)
    .bind(&command.input.price_amount)
    .bind(&command.input.currency_code)
    .bind(command.input.duration_days)
    .bind(&command.input.status)
    .bind(&command.requested_at)
    .bind(&package_id)
    .execute(pool)
    .await
    .map_err(|error| store_error("failed to update membership package", error))?;
    load_admin_membership_package(pool, &package_id).await
}

async fn delete_admin_membership_package(
    pool: &PgPool,
    command: DeleteAdminMembershipPackageCommand,
) -> AppMembershipResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE commerce_membership_package
        SET status = 'disabled',
            updated_at = $2
        WHERE id = $1 OR package_no = $1
        "#,
    )
    .bind(&command.package_id)
    .bind(&command.requested_at)
    .execute(pool)
    .await
    .map_err(|error| store_error("failed to delete membership package", error))?;
    Ok(result.rows_affected() > 0)
}

async fn list_admin_membership_members(
    pool: &PgPool,
    query: ListAdminMembershipMembersQuery,
) -> AppMembershipResult<Vec<AdminMembershipMemberItem>> {
    let rows = sqlx::query(
        r#"
        SELECT m.id, m.owner_user_id, m.status, CAST(m.starts_at AS TEXT) AS starts_at,
               CAST(m.expires_at AS TEXT) AS expires_at, l.plan_no AS plan_no, m.plan_id AS plan_id
        FROM commerce_membership m
        LEFT JOIN commerce_membership_plan l ON l.id = m.plan_id
        WHERE m.tenant_id = CAST($1 AS TEXT)
          AND ($2 IS NULL OR m.organization_id IS NULL OR m.organization_id = CAST($2 AS TEXT))
          AND ($3 IS NULL OR m.owner_user_id = $3)
          AND ($4 IS NULL OR m.plan_id = $4 OR l.plan_no = $4)
          AND ($5 IS NULL OR m.status = $5)
        ORDER BY m.created_at DESC NULLS LAST, m.id DESC
        LIMIT 200
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(query.user_id.as_deref())
    .bind(query.plan_id.as_deref())
    .bind(query.status.as_deref())
    .fetch_all(pool)
    .await
    .or_else(empty_rows_when_read_model_is_missing)?;
    Ok(rows.iter().map(map_admin_membership).collect())
}

async fn update_admin_membership_member_status(
    pool: &PgPool,
    command: UpdateAdminMembershipMemberStatusCommand,
) -> AppMembershipResult<AdminMembershipMemberItem> {
    let result = sqlx::query(
        r#"
        UPDATE commerce_membership
        SET status = $1,
            updated_at = $2
        WHERE tenant_id = CAST($3 AS TEXT)
          AND id = $4
        "#,
    )
    .bind(&command.status)
    .bind(&command.requested_at)
    .bind(command.subject.tenant_id)
    .bind(&command.membership_id)
    .execute(pool)
    .await
    .map_err(|error| store_error("failed to update membership membership status", error))?;
    if result.rows_affected() == 0 {
        return Err(CommerceServiceError::conflict(
            "membership membership was not found",
        ));
    }
    load_admin_membership(pool, command.subject.tenant_id, &command.membership_id).await
}

async fn list_admin_membership_entitlements(
    pool: &PgPool,
    query: ListAdminMembershipEntitlementsQuery,
) -> AppMembershipResult<Vec<AdminMembershipEntitlementItem>> {
    let rows = sqlx::query(
        r#"
        SELECT e.id, e.entitlement_code, e.membership_id, e.granted_quantity, e.used_quantity,
               m.plan_id AS plan_id
        FROM commerce_membership_entitlement e
        LEFT JOIN commerce_membership m ON m.id = e.membership_id AND m.tenant_id = e.tenant_id
        WHERE e.tenant_id = CAST($1 AS TEXT)
          AND ($2 IS NULL OR m.plan_id = $2)
          AND ($3 IS NULL OR e.membership_id = $3)
        ORDER BY e.created_at DESC NULLS LAST, e.id DESC
        LIMIT 200
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.plan_id.as_deref())
    .bind(query.membership_id.as_deref())
    .fetch_all(pool)
    .await
    .or_else(empty_rows_when_read_model_is_missing)?;
    let status_filter = query.status.as_deref();
    Ok(rows
        .iter()
        .map(map_admin_entitlement)
        .filter(|item| {
            status_filter
                .map(|status| item.status == status)
                .unwrap_or(true)
        })
        .collect())
}

async fn load_admin_membership_plan(
    pool: &PgPool,
    plan_id: &str,
) -> AppMembershipResult<AdminMembershipPlanItem> {
    let row = sqlx::query(
        "SELECT id, plan_no AS plan_no, name, CAST(rank AS BIGINT) AS rank, benefits_json AS benefit_json, status FROM commerce_membership_plan WHERE id = $1 LIMIT 1",
    )
    .bind(plan_id)
    .fetch_optional(pool)
    .await
    .or_else(none_when_read_model_is_missing)?
    .ok_or_else(|| CommerceServiceError::conflict("membership plan was not found"))?;
    Ok(map_admin_plan(&row))
}

async fn load_admin_membership_package(
    pool: &PgPool,
    package_id: &str,
) -> AppMembershipResult<AdminMembershipPackageItem> {
    let row = sqlx::query(
        r#"
        SELECT id, package_no, package_group_id AS package_group_id, plan_id AS plan_id, name, CAST(price_amount AS TEXT) AS price_amount,
               currency_code, duration_days AS duration_days, status
        FROM commerce_membership_package
        WHERE id = $1 OR package_no = $1
        LIMIT 1
        "#,
    )
    .bind(package_id)
    .fetch_optional(pool)
    .await
    .or_else(none_when_read_model_is_missing)?
    .ok_or_else(|| CommerceServiceError::conflict("membership package was not found"))?;
    Ok(map_admin_package(&row))
}

async fn load_admin_membership_package_group(
    pool: &PgPool,
    package_group_id: &str,
) -> AppMembershipResult<AdminMembershipPackageGroupItem> {
    let row = sqlx::query(
        r#"
        SELECT id, group_no, name, description, billing_cycle, duration_days,
               sort_weight, status
        FROM commerce_membership_package_group
        WHERE id = $1 OR group_no = $1
        LIMIT 1
        "#,
    )
    .bind(package_group_id)
    .fetch_optional(pool)
    .await
    .or_else(none_when_read_model_is_missing)?
    .ok_or_else(|| CommerceServiceError::conflict("membership package group was not found"))?;
    Ok(map_admin_package_group(&row))
}

async fn load_admin_membership(
    pool: &PgPool,
    tenant_id: i64,
    membership_id: &str,
) -> AppMembershipResult<AdminMembershipMemberItem> {
    let row = sqlx::query(
        r#"
        SELECT m.id, m.owner_user_id, m.status, CAST(m.starts_at AS TEXT) AS starts_at,
               CAST(m.expires_at AS TEXT) AS expires_at, l.plan_no AS plan_no, m.plan_id AS plan_id
        FROM commerce_membership m
        LEFT JOIN commerce_membership_plan l ON l.id = m.plan_id
        WHERE m.tenant_id = CAST($1 AS TEXT) AND m.id = $2
        LIMIT 1
        "#,
    )
    .bind(tenant_id)
    .bind(membership_id)
    .fetch_optional(pool)
    .await
    .or_else(none_when_read_model_is_missing)?
    .ok_or_else(|| CommerceServiceError::conflict("membership membership was not found"))?;
    Ok(map_admin_membership(&row))
}

async fn ensure_admin_plan_exists(pool: &PgPool, plan_id: &str) -> AppMembershipResult<()> {
    let exists: Option<i64> = sqlx::query_scalar(
        "SELECT 1 FROM commerce_membership_plan WHERE id = $1 OR plan_no = $1 LIMIT 1",
    )
    .bind(plan_id)
    .fetch_optional(pool)
    .await
    .map_err(sql_error)?;
    exists
        .map(|_| ())
        .ok_or_else(|| CommerceServiceError::conflict("membership target plan was not found"))
}

async fn ensure_admin_package_group_exists(
    pool: &PgPool,
    package_group_id: &str,
) -> AppMembershipResult<()> {
    let exists: Option<i64> = sqlx::query_scalar(
        "SELECT 1 FROM commerce_membership_package_group WHERE id = $1 OR group_no = $1 LIMIT 1",
    )
    .bind(package_group_id)
    .fetch_optional(pool)
    .await
    .map_err(sql_error)?;
    exists
        .map(|_| ())
        .ok_or_else(|| CommerceServiceError::conflict("membership package group was not found"))
}

async fn next_admin_package_external_id(pool: &PgPool) -> AppMembershipResult<i64> {
    let max_id: Option<i64> =
        sqlx::query_scalar("SELECT MAX(external_id) FROM commerce_membership_package")
            .fetch_one(pool)
            .await
            .map_err(sql_error)?;
    Ok(max_id.unwrap_or(0) + 1)
}

async fn next_admin_package_group_external_id(pool: &PgPool) -> AppMembershipResult<i64> {
    let max_id: Option<i64> =
        sqlx::query_scalar("SELECT MAX(external_id) FROM commerce_membership_package_group")
            .fetch_one(pool)
            .await
            .map_err(sql_error)?;
    Ok(max_id.unwrap_or(0) + 1)
}

async fn package_id_for_update(pool: &PgPool, value: &str) -> AppMembershipResult<String> {
    let row = sqlx::query(
        "SELECT id FROM commerce_membership_package WHERE id = $1 OR package_no = $1 LIMIT 1",
    )
    .bind(value)
    .fetch_optional(pool)
    .await
    .or_else(none_when_read_model_is_missing)?
    .ok_or_else(|| CommerceServiceError::conflict("membership package was not found"))?;
    Ok(string_cell(&row, "id"))
}

async fn package_group_external_id_for_update(
    pool: &PgPool,
    value: &str,
) -> AppMembershipResult<String> {
    let row = sqlx::query(
        "SELECT id FROM commerce_membership_package_group WHERE id = $1 OR group_no = $1 LIMIT 1",
    )
    .bind(value)
    .fetch_optional(pool)
    .await
    .or_else(none_when_read_model_is_missing)?
    .ok_or_else(|| CommerceServiceError::conflict("membership package group was not found"))?;
    Ok(string_cell(&row, "id"))
}

fn map_admin_plan(row: &sqlx::postgres::PgRow) -> AdminMembershipPlanItem {
    let code = string_cell(row, "plan_no");
    let (_, _, _, _, benefits) =
        parse_membership_plan_benefit_json(&string_cell(row, "benefit_json"));
    let rank = integer_cell(row, "rank");
    AdminMembershipPlanItem {
        id: string_cell(row, "id"),
        code: code.clone(),
        name: string_cell(row, "name"),
        rank: if rank == 0 {
            plan_rank_from_code(&code)
        } else {
            rank
        },
        benefits,
        status: string_cell(row, "status"),
    }
}

fn map_admin_package(row: &sqlx::postgres::PgRow) -> AdminMembershipPackageItem {
    AdminMembershipPackageItem {
        id: string_cell(row, "id"),
        code: string_cell(row, "package_no"),
        package_group_id: string_cell(row, "package_group_id"),
        plan_id: string_cell(row, "plan_id"),
        name: string_cell(row, "name"),
        price_amount: decimal_string(
            &string_cell(row, "price_amount"),
            "membership package price",
        )
        .unwrap_or_else(|_| string_cell(row, "price_amount")),
        currency_code: string_cell(row, "currency_code"),
        duration_days: integer_cell(row, "duration_days"),
        status: string_cell(row, "status"),
    }
}

fn map_admin_package_group(row: &sqlx::postgres::PgRow) -> AdminMembershipPackageGroupItem {
    AdminMembershipPackageGroupItem {
        id: string_cell(row, "id"),
        code: string_cell(row, "group_no"),
        name: string_cell(row, "name"),
        description: optional_string_cell(row, "description"),
        billing_cycle: string_cell(row, "billing_cycle"),
        duration_days: integer_cell(row, "duration_days"),
        sort_weight: integer_cell(row, "sort_weight"),
        status: string_cell(row, "status"),
    }
}

fn map_admin_membership(row: &sqlx::postgres::PgRow) -> AdminMembershipMemberItem {
    AdminMembershipMemberItem {
        id: string_cell(row, "id"),
        owner_user_id: string_cell(row, "owner_user_id"),
        plan_code: optional_string_cell(row, "plan_no")
            .filter(|value| !value.trim().is_empty())
            .unwrap_or_else(|| string_cell(row, "plan_id")),
        status: admin_membership_status(&string_cell(row, "status")).to_owned(),
        started_at: string_cell(row, "starts_at"),
        expires_at: string_cell(row, "expires_at"),
    }
}

fn map_admin_entitlement(row: &sqlx::postgres::PgRow) -> AdminMembershipEntitlementItem {
    let granted = integer_cell(row, "granted_quantity");
    let used = integer_cell(row, "used_quantity");
    AdminMembershipEntitlementItem {
        id: string_cell(row, "id"),
        code: string_cell(row, "entitlement_code"),
        plan_id: string_cell(row, "plan_id"),
        membership_id: string_cell(row, "membership_id"),
        quota: granted.to_string(),
        status: if granted > 0 && used >= granted {
            "exhausted".to_owned()
        } else {
            "active".to_owned()
        },
    }
}

fn admin_plan_benefit_json(
    existing: &str,
    rank: i64,
    benefits: Option<&[AppMembershipBenefitItem]>,
) -> String {
    let mut value = serde_json::from_str::<serde_json::Value>(existing)
        .unwrap_or_else(|_| serde_json::json!({}));
    if !value.is_object() {
        value = serde_json::json!({});
    }
    if let Some(object) = value.as_object_mut() {
        object.insert("planRank".to_owned(), serde_json::json!(rank));
        if let Some(benefits) = benefits {
            object.insert(
                "items".to_owned(),
                serde_json::to_value(benefits).unwrap_or_else(|_| serde_json::json!([])),
            );
        }
    }
    value.to_string()
}

fn admin_membership_status(status: &str) -> &'static str {
    match status.trim().to_ascii_lowercase().as_str() {
        "active" => "active",
        "expired" => "expired",
        "suspended" => "suspended",
        "cancelled" => "cancelled",
        _ => "inactive",
    }
}

fn recurrence_cycle_from_duration(duration_days: i64) -> &'static str {
    match duration_days {
        365.. => "year",
        30..=364 => "month",
        7..=29 => "week",
        _ => "day",
    }
}

async fn load_info(
    pool: &PgPool,
    subject: Option<AppMembershipSubject>,
) -> AppMembershipResult<AppMembershipInfoResponse> {
    let membership = match subject {
        Some(subject) => load_current_membership(pool, subject).await?,
        None => None,
    };
    let points = load_points_balance(pool, subject).await?;
    match membership {
        Some(membership) => Ok(AppMembershipInfoResponse {
            plan_rank: membership.rank,
            plan_name: membership.plan_name,
            membership_status: membership.status,
            started_at: Some(membership.starts_at),
            expires_at: Some(membership.expires_at.clone()),
            remaining_days: None,
            total_days: None,
            total_spent: Some(membership.total_spent),
            points: Some(points.available_points),
            growth_value: Some(points.available_points),
            upgrade_growth_value: None,
            benefits: membership.benefits,
        }),
        None => {
            let benefits = load_benefits(pool, subject, Some(0))
                .await
                .unwrap_or_default();
            Ok(AppMembershipInfoResponse {
                plan_rank: 0,
                plan_name: "Free".to_owned(),
                membership_status: "free".to_owned(),
                started_at: None,
                expires_at: None,
                remaining_days: None,
                total_days: None,
                total_spent: Some("0.00".to_owned()),
                points: Some(points.available_points),
                growth_value: Some(points.available_points),
                upgrade_growth_value: None,
                benefits,
            })
        }
    }
}

async fn load_status(
    pool: &PgPool,
    subject: Option<AppMembershipSubject>,
) -> AppMembershipResult<AppMembershipStatusResponse> {
    let membership = match subject {
        Some(subject) => load_current_membership(pool, subject).await?,
        None => None,
    };
    let points = load_points_balance(pool, subject).await?;
    Ok(AppMembershipStatusResponse {
        active: membership
            .as_ref()
            .map(|item| item.rank > 0 && item.status != "expired")
            .unwrap_or(false),
        plan_rank: membership.as_ref().map(|item| item.rank).unwrap_or(0),
        expires_at: membership.map(|item| item.expires_at),
        point_balance: Some(points.available_points),
    })
}

async fn load_benefits(
    pool: &PgPool,
    subject: Option<AppMembershipSubject>,
    plan_id: Option<i64>,
) -> AppMembershipResult<Vec<AppMembershipBenefitItem>> {
    let plans = load_plans(pool).await?;
    let rank = match plan_id {
        Some(value) => value,
        None => match subject {
            Some(subject) => load_current_membership(pool, subject)
                .await?
                .map(|membership| membership.rank)
                .unwrap_or(0),
            None => 0,
        },
    };
    Ok(benefits_for_plan(&plans, rank))
}

async fn load_plans(pool: &PgPool) -> AppMembershipResult<Vec<StoredMembershipPlan>> {
    let rows = sqlx::query(LOAD_MEMBERSHIP_PLANS)
        .fetch_all(pool)
        .await
        .or_else(empty_rows_when_read_model_is_missing)?;
    let mut plans = rows.iter().map(map_plan).collect::<Vec<_>>();
    plans.sort_by_key(|plan| (plan.rank, plan.id));
    Ok(plans)
}

fn map_plan(row: &sqlx::postgres::PgRow) -> StoredMembershipPlan {
    let storage_id = string_cell(row, "id");
    let plan_no = string_cell(row, "plan_no");
    let name = string_cell(row, "name");
    let benefit_json = string_cell(row, "benefit_json");
    let (parsed_rank, required_points, badge, description, benefits) =
        parse_membership_plan_benefit_json(&benefit_json);
    let rank = if parsed_rank == 0 {
        plan_rank_from_code(&plan_no)
    } else {
        parsed_rank
    };
    StoredMembershipPlan {
        id: rank,
        storage_id,
        plan_no,
        item: AppMembershipPlanItem {
            id: rank,
            name,
            rank: rank,
            required_points,
            description,
            icon: None,
            badge,
        },
        benefits,
        rank,
    }
}

async fn load_package_rows(
    pool: &PgPool,
    package_group_id: Option<i64>,
    plan_id: Option<i64>,
) -> AppMembershipResult<Vec<ParsedMembershipPackage>> {
    let rows = sqlx::query(LOAD_MEMBERSHIP_PACKAGES)
        .fetch_all(pool)
        .await
        .or_else(empty_rows_when_read_model_is_missing)?;
    let mut packages = rows
        .iter()
        .filter_map(map_package)
        .filter(|package| {
            package_group_id
                .map(|id| package.group_external_id == id)
                .unwrap_or(true)
        })
        .filter(|package| plan_id.map(|id| package.rank == id).unwrap_or(true))
        .collect::<Vec<_>>();
    packages.sort_by_key(|package| {
        (
            package.group_sort_weight,
            package.item.sort_weight,
            package.item.id,
        )
    });
    Ok(packages)
}

fn map_package(row: &sqlx::postgres::PgRow) -> Option<ParsedMembershipPackage> {
    let id = integer_cell(row, "external_id");
    let price = decimal_string(
        &string_cell(row, "price_amount"),
        "membership package price",
    )
    .ok()?;
    let original_price = optional_string_cell(row, "original_price_amount")
        .filter(|value| !value.trim().is_empty())
        .and_then(|value| decimal_string(&value, "membership package original price").ok());
    map_membership_package_record(
        id,
        string_cell(row, "name"),
        optional_string_cell(row, "description"),
        price,
        original_price,
        integer_cell(row, "point_amount"),
        integer_cell(row, "duration_days"),
        optional_string_cell(row, "plan_name"),
        integer_cell(row, "sort_weight"),
        integer_cell(row, "recommended") != 0,
        &string_cell(row, "tags_json"),
        integer_cell(row, "group_external_id"),
        string_cell(row, "group_name"),
        optional_string_cell(row, "group_description"),
        integer_cell(row, "group_sort_weight"),
        optional_string_cell(row, "plan_no"),
        integer_cell(row, "rank"),
        optional_string_cell(row, "sku_id"),
    )
}

fn package_items(packages: Vec<ParsedMembershipPackage>) -> Vec<AppMembershipPackageItem> {
    packages.into_iter().map(|package| package.item).collect()
}

fn plan_items(plans: Vec<StoredMembershipPlan>) -> Vec<AppMembershipPlanItem> {
    plans.into_iter().map(|plan| plan.item).collect()
}

async fn load_package_groups(
    pool: &PgPool,
    plan_id: Option<i64>,
    recommended_only: bool,
) -> AppMembershipResult<Vec<AppMembershipPackageGroupItem>> {
    let packages = load_package_rows(pool, None, plan_id).await?;
    let mut grouped: BTreeMap<i64, (String, Option<String>, i64, Vec<AppMembershipPackageItem>)> =
        BTreeMap::new();
    for package in packages {
        if recommended_only && !package.item.recommended {
            continue;
        }
        let package_group_id = package.group_external_id;
        if package_group_id <= 0 {
            continue;
        }
        let entry = grouped.entry(package_group_id).or_insert_with(|| {
            (
                package.group_name.clone(),
                package.group_description.clone(),
                package.group_sort_weight,
                Vec::new(),
            )
        });
        entry.3.push(package.item);
    }
    let mut groups = grouped
        .into_iter()
        .map(
            |(package_group_id, (name, description, sort_weight, mut packages))| {
                packages.sort_by_key(|package| (package.sort_weight, package.id));
                build_package_group_from_packages(
                    package_group_id,
                    name,
                    description,
                    sort_weight,
                    packages,
                )
            },
        )
        .collect::<Vec<_>>();
    groups.sort_by_key(|group| (group.sort_weight, group.id));
    Ok(groups)
}

async fn load_points_balance(
    pool: &PgPool,
    subject: Option<AppMembershipSubject>,
) -> AppMembershipResult<AppMembershipPointsBalanceResponse> {
    let Some(subject) = subject else {
        return Ok(AppMembershipPointsBalanceResponse::default());
    };
    let row = sqlx::query(LOAD_POINTS_BALANCE)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .bind(POINTS_ASSET_TYPE)
        .bind(POINTS_CURRENCY_CODE)
        .fetch_optional(pool)
        .await
        .map_err(sql_error)?;
    let available_points = row
        .as_ref()
        .map(|row| parse_points_amount(&string_cell(row, "available_amount")))
        .unwrap_or(0);
    let frozen_points = row
        .as_ref()
        .map(|row| parse_points_amount(&string_cell(row, "frozen_amount")))
        .unwrap_or(0);
    Ok(AppMembershipPointsBalanceResponse {
        points: available_points + frozen_points,
        available_points,
        frozen_points,
    })
}

async fn load_points_history(
    pool: &PgPool,
    subject: Option<AppMembershipSubject>,
    query: AppMembershipPointsHistoryQuery,
) -> AppMembershipResult<Vec<AppMembershipPointsHistoryItem>> {
    let Some(subject) = subject else {
        return Ok(Vec::new());
    };
    let limit = query.limit();
    let offset = query.offset();
    let _cursor = query.cursor;
    let rows = sqlx::query(LOAD_POINTS_HISTORY)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .bind(POINTS_ASSET_TYPE)
        .bind(limit)
        .bind(offset)
        .fetch_all(pool)
        .await
        .or_else(empty_rows_when_read_model_is_missing)?;
    Ok(rows.iter().map(map_points_history_item).collect())
}

fn map_points_history_item(row: &sqlx::postgres::PgRow) -> AppMembershipPointsHistoryItem {
    let amount = parse_points_amount(&string_cell(row, "amount"));
    let after_balance = parse_points_amount(&string_cell(row, "balance_after"));
    let direction = string_cell(row, "direction").to_ascii_lowercase();
    let signed_amount = if direction == "debit" || direction == "out" {
        -amount
    } else {
        amount
    };
    AppMembershipPointsHistoryItem {
        id: string_cell(row, "id"),
        change_type: string_cell(row, "business_type"),
        change_amount: signed_amount,
        before_balance: Some(after_balance - signed_amount),
        after_balance,
        source_type: string_cell(row, "source_type"),
        remark: optional_string_cell(row, "remark"),
        created_at: optional_string_cell(row, "created_at"),
    }
}

#[derive(Debug, Clone)]
struct CurrentMembership {
    rank: i64,
    plan_name: String,
    status: String,
    starts_at: String,
    expires_at: String,
    total_spent: String,
    benefits: Vec<AppMembershipBenefitItem>,
}

async fn load_current_membership(
    pool: &PgPool,
    subject: AppMembershipSubject,
) -> AppMembershipResult<Option<CurrentMembership>> {
    let row = sqlx::query(LOAD_MEMBERSHIP)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .fetch_optional(pool)
        .await
        .or_else(none_when_read_model_is_missing)?;
    Ok(row.as_ref().map(map_membership))
}

fn map_membership(row: &sqlx::postgres::PgRow) -> CurrentMembership {
    let plan_no = string_cell(row, "plan_no");
    let (parsed_rank, _, _, _, benefits) =
        parse_membership_plan_benefit_json(&string_cell(row, "benefit_json"));
    let rank = if parsed_rank == 0 {
        plan_rank_from_code(&plan_no)
    } else {
        parsed_rank
    };
    CurrentMembership {
        rank,
        plan_name: string_cell(row, "plan_name"),
        status: membership_status_label(&string_cell(row, "status")).to_owned(),
        starts_at: string_cell(row, "starts_at"),
        expires_at: string_cell(row, "expires_at"),
        total_spent: decimal_string(
            &string_cell(row, "total_spent"),
            "membership membership total spent",
        )
        .unwrap_or_else(|_| "0.00".to_owned()),
        benefits,
    }
}

async fn submit_purchase(
    pool: &PgPool,
    command: SubmitMembershipPurchaseCommand,
) -> AppMembershipResult<AppMembershipPurchaseOutcome> {
    let mut tx = pool
        .begin()
        .await
        .map_err(|error| store_error("failed to begin membership purchase transaction", error))?;
    let package = load_package_for_purchase(&mut tx, command.package_id).await?;
    let method = load_payment_method(&mut tx, &command).await?;
    let plan = load_plan_for_package(&mut tx, &package).await?;
    let membership_expires_at =
        add_days_to_timestamp(&command.requested_at, package.item.duration_days);

    insert_order(&mut tx, &command, &package).await?;
    insert_order_item(&mut tx, &command, &package).await?;
    insert_order_amount_breakdown(&mut tx, &command, &package).await?;
    insert_payment(&mut tx, &command, &package, &method).await?;
    insert_membership(&mut tx, &command, &plan, &membership_expires_at).await?;
    insert_entitlements(&mut tx, &command, &plan, &membership_expires_at).await?;
    tx.commit()
        .await
        .map_err(|error| store_error("failed to commit membership purchase transaction", error))?;

    Ok(AppMembershipPurchaseOutcome {
        success: true,
        request_no: command.order_no.clone(),
        order_id: command.order_no.clone(),
        payment_id: command.payment_uuid.clone(),
        qr_code_payload: membership_payment_qr_code_payload(
            &command.payment_uuid,
            &command.order_no,
        ),
        qr_code_image_url: None,
        package_id: package.item.id,
        package_name: package.item.name,
        amount: package.item.price,
        duration_days: package.item.duration_days,
        target_plan_rank: plan.rank,
        target_plan_name: plan.item.name,
        status: "pending".to_owned(),
    })
}

fn membership_payment_qr_code_payload(payment_id: &str, order_id: &str) -> String {
    format!("https://im.sdkwork.com/pay?type=qrcode&paymentId={payment_id}&orderId={order_id}")
}

async fn load_package_for_purchase(
    tx: &mut Transaction<'_, Postgres>,
    package_id: i64,
) -> AppMembershipResult<ParsedMembershipPackage> {
    let rows = sqlx::query(LOAD_MEMBERSHIP_PACKAGES)
        .fetch_all(&mut **tx)
        .await
        .map_err(|error| store_error("failed to load membership packages", error))?;
    rows.iter()
        .filter_map(map_package)
        .find(|package| package.item.id == package_id)
        .ok_or_else(|| CommerceServiceError::conflict("membership package is unavailable"))
}

#[derive(Debug, Clone)]
struct MembershipPaymentMethod {
    method_key: String,
}

async fn load_payment_method(
    tx: &mut Transaction<'_, Postgres>,
    command: &SubmitMembershipPurchaseCommand,
) -> AppMembershipResult<MembershipPaymentMethod> {
    let method = normalize_payment_method(&command.payment_method);
    let alias = method_alias(&method);
    let row = sqlx::query(LOAD_PAYMENT_METHOD)
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(&method)
        .bind(alias)
        .fetch_optional(&mut **tx)
        .await
        .map_err(|error| store_error("failed to load membership payment method", error))?
        .ok_or_else(|| {
            CommerceServiceError::conflict("membership payment method is unavailable")
        })?;
    Ok(MembershipPaymentMethod {
        method_key: normalize_payment_method(&string_cell(&row, "method_key")),
    })
}

async fn load_plan_for_package(
    tx: &mut Transaction<'_, Postgres>,
    package: &ParsedMembershipPackage,
) -> AppMembershipResult<StoredMembershipPlan> {
    let rows = sqlx::query(LOAD_MEMBERSHIP_PLANS)
        .fetch_all(&mut **tx)
        .await
        .map_err(|error| store_error("failed to load membership plans for purchase", error))?;
    rows.iter()
        .map(map_plan)
        .find(|plan| plan.plan_no == package.plan_no || plan.rank == package.rank)
        .ok_or_else(|| CommerceServiceError::conflict("membership target plan is unavailable"))
}

async fn insert_order(
    tx: &mut Transaction<'_, Postgres>,
    command: &SubmitMembershipPurchaseCommand,
    package: &ParsedMembershipPackage,
) -> AppMembershipResult<()> {
    sqlx::query(
        r#"
        INSERT INTO commerce_order
            (id, tenant_id, organization_id, owner_user_id, order_no, status, subject, currency_code, request_no, idempotency_key, created_at, paid_at, cancelled_at, expired_at, updated_at)
        VALUES
            ($1, CAST($2 AS TEXT), CAST($3 AS TEXT), CAST($4 AS TEXT), $5, 'pending_payment', 'membership', 'CNY', $6, $7, $8, NULL, NULL, $9, $8)
        "#,
    )
    .bind(&command.order_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.user_id)
    .bind(&command.order_no)
    .bind(&command.order_no)
    .bind(&command.out_trade_no)
    .bind(&command.requested_at)
    .bind(&command.expire_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert membership order", error))?;
    let _ = package;
    Ok(())
}

async fn insert_order_item(
    tx: &mut Transaction<'_, Postgres>,
    command: &SubmitMembershipPurchaseCommand,
    package: &ParsedMembershipPackage,
) -> AppMembershipResult<()> {
    sqlx::query(
        r#"
        INSERT INTO commerce_order_item
            (id, tenant_id, order_id, sku_id, title, quantity, unit_price_amount, total_amount, created_at)
        VALUES
            ($1, CAST($2 AS TEXT), $3, CAST($4 AS TEXT), $5, 1, $6, $6, $7)
        "#,
    )
    .bind(&command.order_item_uuid)
    .bind(command.subject.tenant_id)
    .bind(&command.order_uuid)
    .bind(package.sku_id.as_deref().unwrap_or(""))
    .bind(&package.item.name)
    .bind(&package.item.price)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert membership order item", error))?;
    Ok(())
}

async fn insert_order_amount_breakdown(
    tx: &mut Transaction<'_, Postgres>,
    command: &SubmitMembershipPurchaseCommand,
    package: &ParsedMembershipPackage,
) -> AppMembershipResult<()> {
    sqlx::query(
        r#"
        INSERT INTO commerce_order_amount_breakdown
            (id, tenant_id, order_id, original_amount, discount_amount, payable_amount, currency_code, created_at)
        VALUES
            ($1, CAST($2 AS TEXT), $3, $4, '0.00', $5, 'CNY', $6)
        "#,
    )
    .bind(format!("{}-amount", command.order_uuid))
    .bind(command.subject.tenant_id)
    .bind(&command.order_uuid)
    .bind(package.item.original_price.as_ref().unwrap_or(&package.item.price))
    .bind(&package.item.price)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert membership order amount breakdown", error))?;
    Ok(())
}

async fn insert_payment(
    tx: &mut Transaction<'_, Postgres>,
    command: &SubmitMembershipPurchaseCommand,
    package: &ParsedMembershipPackage,
    method: &MembershipPaymentMethod,
) -> AppMembershipResult<()> {
    sqlx::query(
        r#"
        INSERT INTO commerce_payment_intent
            (id, tenant_id, organization_id, owner_user_id, order_id, provider, amount, currency_code, status, request_no, idempotency_key, created_at, updated_at)
        VALUES
            ($1, CAST($2 AS TEXT), CAST($3 AS TEXT), CAST($4 AS TEXT), $5, $6, $7, 'CNY', $8, $9, $10, $11, $11)
        "#,
    )
    .bind(&command.payment_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.user_id)
    .bind(&command.order_uuid)
    .bind(&method.method_key)
    .bind(&package.item.price)
    .bind(CommercePaymentStatus::Pending.as_str())
    .bind(&command.order_no)
    .bind(&command.out_trade_no)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert membership payment intent", error))?;
    sqlx::query(
        r#"
        INSERT INTO commerce_payment_attempt
            (id, tenant_id, organization_id, owner_user_id, payment_intent_id, order_id, provider, out_trade_no, amount, currency_code, status, callback_payload, created_at, paid_at, updated_at)
        VALUES
            ($1, CAST($2 AS TEXT), CAST($3 AS TEXT), CAST($4 AS TEXT), $5, $6, $7, $8, $9, 'CNY', $10, $11, $12, NULL, $12)
        "#,
    )
    .bind(&command.attempt_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.user_id)
    .bind(&command.payment_uuid)
    .bind(&command.order_uuid)
    .bind(&method.method_key)
    .bind(&command.out_trade_no)
    .bind(&package.item.price)
    .bind(CommercePaymentStatus::Pending.as_str())
    .bind(format!(
        r#"{{"subject":"membership","packageId":{},"action":"{}"}}"#,
        package.item.id, command.action
    ))
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert membership payment attempt", error))?;
    Ok(())
}

async fn insert_membership(
    tx: &mut Transaction<'_, Postgres>,
    command: &SubmitMembershipPurchaseCommand,
    plan: &StoredMembershipPlan,
    expires_at: &str,
) -> AppMembershipResult<()> {
    sqlx::query(
        r#"
        INSERT INTO commerce_membership
            (id, tenant_id, organization_id, membership_no, owner_user_id, plan_id, source_order_id, source_payment_intent_id, status, starts_at, expires_at, grace_until, request_no, idempotency_key, created_at, updated_at)
        VALUES
            ($1, CAST($2 AS TEXT), CAST($3 AS TEXT), $4, CAST($5 AS TEXT), $6, $7, $8, 'pending_activation', $9, $10, NULL, $11, $12, $13, $13)
        "#,
    )
    .bind(&command.membership_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.membership_uuid)
    .bind(command.subject.user_id)
    .bind(plan_id_for_storage(plan))
    .bind(&command.order_uuid)
    .bind(&command.payment_uuid)
    .bind(&command.requested_at)
    .bind(expires_at)
    .bind(&command.order_no)
    .bind(&command.out_trade_no)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert membership membership", error))?;
    Ok(())
}

async fn insert_entitlements(
    tx: &mut Transaction<'_, Postgres>,
    command: &SubmitMembershipPurchaseCommand,
    plan: &StoredMembershipPlan,
    expires_at: &str,
) -> AppMembershipResult<()> {
    for (index, benefit) in plan.benefits.iter().enumerate() {
        let entitlement_code = benefit
            .benefit_key
            .clone()
            .unwrap_or_else(|| format!("membership-benefit-{}", benefit.id));
        sqlx::query(
            r#"
            INSERT INTO commerce_membership_entitlement
                (id, tenant_id, organization_id, membership_id, entitlement_code, plan_id, name, quota_amount, quota_period, reset_policy, granted_quantity, used_quantity, expires_at, status, created_at, updated_at)
            VALUES
                ($1, CAST($2 AS TEXT), CAST($3 AS TEXT), $4, $5, $6, $7, CAST($8 AS TEXT), NULL, NULL, $9, 0, $10, 'active', $11, $11)
            "#,
        )
        .bind(format!("{}-entitlement-{}", command.membership_uuid, index + 1))
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(&command.membership_uuid)
        .bind(entitlement_code)
        .bind(plan_id_for_storage(plan))
        .bind(&benefit.name)
        .bind(benefit.usage_limit.unwrap_or(0).max(0))
        .bind(benefit.usage_limit.unwrap_or(0).max(0))
        .bind(expires_at)
        .bind(&command.requested_at)
        .execute(&mut **tx)
        .await
        .map_err(|error| store_error("failed to insert membership entitlement", error))?;
    }
    Ok(())
}

async fn consume_speed_up(
    pool: &PgPool,
    subject: AppMembershipSubject,
    requested_at: String,
) -> AppMembershipResult<()> {
    let mut tx = pool
        .begin()
        .await
        .map_err(|error| store_error("failed to begin membership speed up transaction", error))?;
    let row = sqlx::query(
        r#"
        SELECT id, entitlement_code, membership_id, granted_quantity, used_quantity
        FROM commerce_membership_entitlement
        WHERE tenant_id = CAST($1 AS TEXT)
          AND membership_id IN (
              SELECT id
              FROM commerce_membership
              WHERE tenant_id = CAST($1 AS TEXT)
                AND (organization_id IS NULL OR organization_id = CAST($2 AS TEXT))
                AND owner_user_id = CAST($3 AS TEXT)
              ORDER BY created_at DESC NULLS LAST, id DESC
              LIMIT 1
          )
          AND entitlement_code IN ('top_priority', 'high_priority', 'normal_priority')
          AND used_quantity < granted_quantity
        ORDER BY CASE entitlement_code
            WHEN 'top_priority' THEN 0
            WHEN 'high_priority' THEN 1
            WHEN 'normal_priority' THEN 2
            ELSE 3
        END, updated_at ASC NULLS LAST, created_at ASC NULLS LAST, id ASC
        LIMIT 1
        "#,
    )
    .bind(subject.tenant_id)
    .bind(subject.organization_id)
    .bind(subject.user_id)
    .fetch_optional(&mut *tx)
    .await
    .map_err(|error| store_error("failed to load membership speed up entitlement", error))?
    .ok_or_else(|| {
        CommerceServiceError::conflict("membership speed up privilege is unavailable")
    })?;

    let entitlement_id = string_cell(&row, "id");
    let membership_id = string_cell(&row, "membership_id");
    let entitlement_code = string_cell(&row, "entitlement_code");
    let granted_quantity = integer_cell(&row, "granted_quantity").max(0);
    let used_quantity = integer_cell(&row, "used_quantity").max(0);
    if used_quantity >= granted_quantity || granted_quantity <= 0 {
        return Err(CommerceServiceError::conflict(
            "membership speed up privilege is exhausted",
        ));
    }

    let updated_rows = sqlx::query(
        r#"
        UPDATE commerce_membership_entitlement
        SET used_quantity = used_quantity + 1,
            updated_at = $2
        WHERE id = $1
          AND used_quantity < granted_quantity
        "#,
    )
    .bind(&entitlement_id)
    .bind(&requested_at)
    .execute(&mut *tx)
    .await
    .map_err(|error| store_error("failed to update membership speed up entitlement", error))?
    .rows_affected();
    if updated_rows == 0 {
        return Err(CommerceServiceError::conflict(
            "membership speed up privilege is exhausted",
        ));
    }

    let usage_id = format!("{entitlement_id}-usage-{used_quantity}");
    let request_no = format!(
        "membership-speed-up-{}-{}",
        subject.user_id,
        used_quantity + 1
    );
    sqlx::query(
        r#"
        INSERT INTO commerce_membership_entitlement_usage
            (id, tenant_id, organization_id, membership_id, entitlement_id, owner_user_id, entitlement_code, usage_no, used_amount, balance_after, idempotency_key, source_type, source_id, occurred_at, created_at)
        VALUES
            ($1, CAST($2 AS TEXT), CAST($3 AS TEXT), $4, $5, CAST($6 AS TEXT), $7, $8, '1', CAST($9 AS TEXT), $10, 'membership_speed_up', $11, $12, $12)
        "#,
    )
    .bind(&usage_id)
    .bind(subject.tenant_id)
    .bind(subject.organization_id)
    .bind(&membership_id)
    .bind(&entitlement_id)
    .bind(subject.user_id)
    .bind(&entitlement_code)
    .bind(&usage_id)
    .bind((granted_quantity - used_quantity - 1).max(0))
    .bind(&request_no)
    .bind("speed_up")
    .bind(&requested_at)
    .execute(&mut *tx)
    .await
    .map_err(|error| store_error("failed to insert membership speed up usage", error))?;

    tx.commit()
        .await
        .map_err(|error| store_error("failed to commit membership speed up transaction", error))?;
    Ok(())
}

fn plan_id_for_storage(plan: &StoredMembershipPlan) -> String {
    if !plan.storage_id.trim().is_empty() {
        plan.storage_id.clone()
    } else if plan.plan_no.trim().is_empty() {
        format!("membership-plan-{}", plan_code_from_rank(plan.rank))
    } else {
        format!("membership-plan-{}", plan.plan_no.trim())
    }
}

fn membership_status_label(status: &str) -> &'static str {
    match status.trim().to_ascii_lowercase().as_str() {
        "active" => "active",
        "pending_activation" | "pending" => "pending",
        "expired" => "expired",
        _ => "free",
    }
}

fn add_days_to_timestamp(timestamp: &str, days: i64) -> String {
    let Some(seconds) = parse_timestamp(timestamp) else {
        return timestamp.to_owned();
    };
    format_unix_timestamp(seconds + days.max(0) * 86_400)
}

fn parse_timestamp(timestamp: &str) -> Option<i64> {
    let (date, time) = timestamp.trim().split_once(' ')?;
    let mut date_parts = date.split('-');
    let year = date_parts.next()?.parse::<i64>().ok()?;
    let month = date_parts.next()?.parse::<i64>().ok()?;
    let day = date_parts.next()?.parse::<i64>().ok()?;
    let mut time_parts = time.split(':');
    let hour = time_parts.next()?.parse::<i64>().ok()?;
    let minute = time_parts.next()?.parse::<i64>().ok()?;
    let second = time_parts.next()?.parse::<i64>().ok()?;
    Some(days_from_civil(year, month, day) * 86_400 + hour * 3_600 + minute * 60 + second)
}

fn days_from_civil(year: i64, month: i64, day: i64) -> i64 {
    let year = year - if month <= 2 { 1 } else { 0 };
    let era = if year >= 0 { year } else { year - 399 } / 400;
    let yoe = year - era * 400;
    let month = month + if month > 2 { -3 } else { 9 };
    let doy = (153 * month + 2) / 5 + day - 1;
    let doe = yoe * 365 + yoe / 4 - yoe / 100 + doy;
    era * 146_097 + doe - 719_468
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

fn optional_string_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(column).ok().flatten()
}

fn string_cell(row: &sqlx::postgres::PgRow, column: &str) -> String {
    optional_string_cell(row, column).unwrap_or_default()
}

fn integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> i64 {
    row.try_get::<i64, _>(column)
        .or_else(|_| row.try_get::<i32, _>(column).map(i64::from))
        .or_else(|_| string_cell(row, column).parse::<i64>())
        .unwrap_or(0)
}

fn sql_error(error: sqlx::Error) -> CommerceServiceError {
    CommerceServiceError::storage(error.to_string())
}

fn store_error(context: &str, error: sqlx::Error) -> CommerceServiceError {
    CommerceServiceError::storage(format!("{context}: {error}"))
}

fn empty_rows_when_read_model_is_missing(
    error: sqlx::Error,
) -> Result<Vec<sqlx::postgres::PgRow>, CommerceServiceError> {
    if is_missing_postgres_read_model(&error) {
        Ok(Vec::new())
    } else {
        Err(sql_error(error))
    }
}

fn none_when_read_model_is_missing(
    error: sqlx::Error,
) -> Result<Option<sqlx::postgres::PgRow>, CommerceServiceError> {
    if is_missing_postgres_read_model(&error) {
        Ok(None)
    } else {
        Err(sql_error(error))
    }
}
