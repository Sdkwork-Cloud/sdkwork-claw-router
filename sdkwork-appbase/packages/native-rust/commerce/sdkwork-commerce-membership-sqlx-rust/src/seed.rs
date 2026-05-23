use sdkwork_commerce_bootstrap::{
    commerce_membership_package_group_seeds, commerce_membership_package_seeds,
    commerce_membership_plan_seeds, commerce_payment_method_seeds, commerce_recharge_package_seeds,
    CommerceMembershipBenefitSeed, CommerceMembershipPackageGroupSeed,
    CommerceMembershipPackageSeed, CommerceMembershipPlanSeed, CommercePaymentMethodSeed,
    CommerceRechargePackageSeed,
};
use sdkwork_commerce_core::CommerceServiceError;
use sqlx::{PgPool, SqlitePool};

const SEED_TIMESTAMP: &str = "2026-05-19 00:00:00";
const MEMBERSHIP_PRODUCT_ID: &str = "seed-product-membership";
const RECHARGE_PRODUCT_ID: &str = "seed-product-points-recharge";

pub async fn upsert_sqlite_commerce_experience_seed(
    pool: &SqlitePool,
) -> Result<(), CommerceServiceError> {
    upsert_sqlite_seed_product(
        pool,
        MEMBERSHIP_PRODUCT_ID,
        "membership",
        "Membership",
        "SDKWork membership catalog",
        "Reusable SDKWork commerce membership product.",
        "commerce-membership",
    )
    .await?;
    upsert_sqlite_seed_product(
        pool,
        RECHARGE_PRODUCT_ID,
        "points-recharge",
        "Points recharge",
        "SDKWork points recharge catalog",
        "Reusable SDKWork commerce points recharge packages.",
        "commerce-recharge",
    )
    .await?;
    upsert_sqlite_membership_plans(pool).await?;
    upsert_sqlite_membership_package_groups(pool).await?;
    upsert_sqlite_membership_packages(pool).await?;
    upsert_sqlite_recharge_packages(pool).await?;
    upsert_sqlite_payment_methods(pool).await?;
    Ok(())
}

pub async fn upsert_postgres_commerce_experience_seed(
    pool: &PgPool,
) -> Result<(), CommerceServiceError> {
    upsert_postgres_seed_product(
        pool,
        MEMBERSHIP_PRODUCT_ID,
        "membership",
        "Membership",
        "SDKWork membership catalog",
        "Reusable SDKWork commerce membership product.",
        "commerce-membership",
    )
    .await?;
    upsert_postgres_seed_product(
        pool,
        RECHARGE_PRODUCT_ID,
        "points-recharge",
        "Points recharge",
        "SDKWork points recharge catalog",
        "Reusable SDKWork commerce points recharge packages.",
        "commerce-recharge",
    )
    .await?;
    upsert_postgres_membership_plans(pool).await?;
    upsert_postgres_membership_package_groups(pool).await?;
    upsert_postgres_membership_packages(pool).await?;
    upsert_postgres_recharge_packages(pool).await?;
    upsert_postgres_payment_methods(pool).await?;
    Ok(())
}

pub async fn sqlite_commerce_experience_seed_complete(
    pool: &SqlitePool,
) -> Result<bool, CommerceServiceError> {
    let product_count = sqlite_count(pool, COMPLETE_PRODUCT_COUNT_SQL).await?;
    if product_count != 2 {
        return Ok(false);
    }

    let membership_plan_count = sqlite_count(pool, COMPLETE_MEMBERSHIP_PLAN_COUNT_SQL).await?;
    if membership_plan_count != 4 {
        return Ok(false);
    }

    let membership_package_group_count =
        sqlite_count(pool, COMPLETE_MEMBERSHIP_PACKAGE_GROUP_COUNT_SQL).await?;
    if membership_package_group_count != 4 {
        return Ok(false);
    }

    let membership_package_count =
        sqlite_count(pool, COMPLETE_MEMBERSHIP_PACKAGE_COUNT_SQL).await?;
    if membership_package_count != 16 {
        return Ok(false);
    }

    let complete_group_count =
        sqlite_count(pool, COMPLETE_MEMBERSHIP_GROUP_PACKAGE_COUNT_SQL).await?;
    if complete_group_count != 4 {
        return Ok(false);
    }

    let membership_sku_count = sqlite_count(pool, COMPLETE_MEMBERSHIP_SKU_COUNT_SQL).await?;
    if membership_sku_count != 16 {
        return Ok(false);
    }

    let recharge_package_count = sqlite_count(pool, COMPLETE_RECHARGE_PACKAGE_COUNT_SQL).await?;
    if recharge_package_count != 4 {
        return Ok(false);
    }

    let recharge_sku_count = sqlite_count(pool, COMPLETE_RECHARGE_SKU_COUNT_SQL).await?;
    if recharge_sku_count != 4 {
        return Ok(false);
    }

    let payment_method_count = sqlite_count(pool, COMPLETE_PAYMENT_METHOD_COUNT_SQL).await?;
    Ok(payment_method_count == 3)
}

pub async fn postgres_commerce_experience_seed_complete(
    pool: &PgPool,
) -> Result<bool, CommerceServiceError> {
    let product_count = postgres_count(pool, COMPLETE_PRODUCT_COUNT_SQL).await?;
    if product_count != 2 {
        return Ok(false);
    }

    let membership_plan_count = postgres_count(pool, COMPLETE_MEMBERSHIP_PLAN_COUNT_SQL).await?;
    if membership_plan_count != 4 {
        return Ok(false);
    }

    let membership_package_group_count =
        postgres_count(pool, COMPLETE_MEMBERSHIP_PACKAGE_GROUP_COUNT_SQL).await?;
    if membership_package_group_count != 4 {
        return Ok(false);
    }

    let membership_package_count =
        postgres_count(pool, COMPLETE_MEMBERSHIP_PACKAGE_COUNT_SQL).await?;
    if membership_package_count != 16 {
        return Ok(false);
    }

    let complete_group_count =
        postgres_count(pool, COMPLETE_MEMBERSHIP_GROUP_PACKAGE_COUNT_SQL).await?;
    if complete_group_count != 4 {
        return Ok(false);
    }

    let membership_sku_count = postgres_count(pool, COMPLETE_MEMBERSHIP_SKU_COUNT_SQL).await?;
    if membership_sku_count != 16 {
        return Ok(false);
    }

    let recharge_package_count = postgres_count(pool, COMPLETE_RECHARGE_PACKAGE_COUNT_SQL).await?;
    if recharge_package_count != 4 {
        return Ok(false);
    }

    let recharge_sku_count = postgres_count(pool, COMPLETE_RECHARGE_SKU_COUNT_SQL).await?;
    if recharge_sku_count != 4 {
        return Ok(false);
    }

    let payment_method_count = postgres_count(pool, COMPLETE_PAYMENT_METHOD_COUNT_SQL).await?;
    Ok(payment_method_count == 3)
}

async fn upsert_sqlite_seed_product(
    pool: &SqlitePool,
    id: &str,
    spu_no: &str,
    title: &str,
    subtitle: &str,
    description: &str,
    category_id: &str,
) -> Result<(), CommerceServiceError> {
    sqlx::query(
        r#"
        INSERT INTO commerce_product_spu
            (id, tenant_id, organization_id, spu_no, title, subtitle, description, product_type, category_id, sales_status, visible_surfaces, created_at, updated_at)
        VALUES
            (?, '0', '0', ?, ?, ?, ?, ?, ?, 'active', '["app","console","admin"]', ?, ?)
        ON CONFLICT(tenant_id, spu_no) DO UPDATE SET
            id = excluded.id,
            organization_id = excluded.organization_id,
            title = excluded.title,
            subtitle = excluded.subtitle,
            description = excluded.description,
            product_type = excluded.product_type,
            category_id = excluded.category_id,
            sales_status = excluded.sales_status,
            visible_surfaces = excluded.visible_surfaces,
            updated_at = excluded.updated_at
        "#,
    )
    .bind(id)
    .bind(spu_no)
    .bind(title)
    .bind(subtitle)
    .bind(description)
    .bind(seed_product_type(spu_no))
    .bind(category_id)
    .bind(SEED_TIMESTAMP)
    .bind(SEED_TIMESTAMP)
    .execute(pool)
    .await
    .map_err(|error| storage_error("failed to upsert commerce seed product", error))?;
    Ok(())
}

async fn upsert_postgres_seed_product(
    pool: &PgPool,
    id: &str,
    spu_no: &str,
    title: &str,
    subtitle: &str,
    description: &str,
    category_id: &str,
) -> Result<(), CommerceServiceError> {
    sqlx::query(
        r#"
        INSERT INTO commerce_product_spu
            (id, tenant_id, organization_id, spu_no, title, subtitle, description, product_type, category_id, sales_status, visible_surfaces, created_at, updated_at)
        VALUES
            ($1, '0', '0', $2, $3, $4, $5, $6, $7, 'active', '["app","console","admin"]', $8, $9)
        ON CONFLICT(tenant_id, spu_no) DO UPDATE SET
            id = excluded.id,
            organization_id = excluded.organization_id,
            title = excluded.title,
            subtitle = excluded.subtitle,
            description = excluded.description,
            product_type = excluded.product_type,
            category_id = excluded.category_id,
            sales_status = excluded.sales_status,
            visible_surfaces = excluded.visible_surfaces,
            updated_at = excluded.updated_at
        "#,
    )
    .bind(id)
    .bind(spu_no)
    .bind(title)
    .bind(subtitle)
    .bind(description)
    .bind(seed_product_type(spu_no))
    .bind(category_id)
    .bind(SEED_TIMESTAMP)
    .bind(SEED_TIMESTAMP)
    .execute(pool)
    .await
    .map_err(|error| storage_error("failed to upsert commerce seed product", error))?;
    Ok(())
}

async fn upsert_sqlite_membership_plans(pool: &SqlitePool) -> Result<(), CommerceServiceError> {
    for plan in commerce_membership_plan_seeds() {
        sqlx::query(
            r#"
            INSERT INTO commerce_membership_plan
                (id, tenant_id, organization_id, plan_no, name, plan_code, rank, duration_days, benefits_json, visible_surfaces, status, created_at, updated_at)
            VALUES
                (?, '0', '0', ?, ?, ?, ?, ?, ?, '["membership","console","playground","api"]', 'active', ?, ?)
            ON CONFLICT(tenant_id, plan_no) DO UPDATE SET
                id = excluded.id,
                organization_id = excluded.organization_id,
                name = excluded.name,
                plan_code = excluded.plan_code,
                rank = excluded.rank,
                duration_days = excluded.duration_days,
                benefits_json = excluded.benefits_json,
                visible_surfaces = excluded.visible_surfaces,
                status = excluded.status,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(plan_id_for(plan.plan_no))
        .bind(plan.plan_no)
        .bind(plan.name)
        .bind(plan.plan_no)
        .bind(plan.rank)
        .bind(plan.validity_days)
        .bind(membership_plan_benefit_json(&plan))
        .bind(SEED_TIMESTAMP)
        .bind(SEED_TIMESTAMP)
        .execute(pool)
        .await
        .map_err(|error| storage_error("failed to upsert membership plan", error))?;
    }
    Ok(())
}

async fn upsert_postgres_membership_plans(pool: &PgPool) -> Result<(), CommerceServiceError> {
    for plan in commerce_membership_plan_seeds() {
        sqlx::query(
            r#"
            INSERT INTO commerce_membership_plan
                (id, tenant_id, organization_id, plan_no, name, plan_code, rank, duration_days, benefits_json, visible_surfaces, status, created_at, updated_at)
            VALUES
                ($1, '0', '0', $2, $3, $4, $5, $6, $7, '["membership","console","playground","api"]', 'active', $8, $9)
            ON CONFLICT(tenant_id, plan_no) DO UPDATE SET
                id = excluded.id,
                organization_id = excluded.organization_id,
                name = excluded.name,
                plan_code = excluded.plan_code,
                rank = excluded.rank,
                duration_days = excluded.duration_days,
                benefits_json = excluded.benefits_json,
                visible_surfaces = excluded.visible_surfaces,
                status = excluded.status,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(plan_id_for(plan.plan_no))
        .bind(plan.plan_no)
        .bind(plan.name)
        .bind(plan.plan_no)
        .bind(plan.rank)
        .bind(plan.validity_days)
        .bind(membership_plan_benefit_json(&plan))
        .bind(SEED_TIMESTAMP)
        .bind(SEED_TIMESTAMP)
        .execute(pool)
        .await
        .map_err(|error| storage_error("failed to upsert membership plan", error))?;
    }
    Ok(())
}

async fn upsert_sqlite_membership_package_groups(
    pool: &SqlitePool,
) -> Result<(), CommerceServiceError> {
    for group in commerce_membership_package_group_seeds() {
        sqlx::query(
            r#"
            INSERT INTO commerce_membership_package_group
                (id, tenant_id, organization_id, external_id, group_no, plan_id, name, description, billing_cycle, duration_days, sort_weight, status, created_at, updated_at)
            VALUES
                (?, '0', '0', ?, ?, NULL, ?, ?, ?, ?, ?, 'active', ?, ?)
            ON CONFLICT(tenant_id, group_no) DO UPDATE SET
                id = excluded.id,
                organization_id = excluded.organization_id,
                external_id = excluded.external_id,
                plan_id = excluded.plan_id,
                name = excluded.name,
                description = excluded.description,
                billing_cycle = excluded.billing_cycle,
                duration_days = excluded.duration_days,
                sort_weight = excluded.sort_weight,
                status = excluded.status,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(package_group_id_for(group.package_group_no))
        .bind(group.external_id)
        .bind(group_no_for(group.package_group_no))
        .bind(group.name)
        .bind(group.description)
        .bind(group.billing_cycle)
        .bind(group.duration_days)
        .bind(group.sort_weight)
        .bind(SEED_TIMESTAMP)
        .bind(SEED_TIMESTAMP)
        .execute(pool)
        .await
        .map_err(|error| storage_error("failed to upsert membership package group", error))?;
    }
    Ok(())
}

async fn upsert_postgres_membership_package_groups(
    pool: &PgPool,
) -> Result<(), CommerceServiceError> {
    for group in commerce_membership_package_group_seeds() {
        sqlx::query(
            r#"
            INSERT INTO commerce_membership_package_group
                (id, tenant_id, organization_id, external_id, group_no, plan_id, name, description, billing_cycle, duration_days, sort_weight, status, created_at, updated_at)
            VALUES
                ($1, '0', '0', $2, $3, NULL, $4, $5, $6, $7, $8, 'active', $9, $10)
            ON CONFLICT(tenant_id, group_no) DO UPDATE SET
                id = excluded.id,
                organization_id = excluded.organization_id,
                external_id = excluded.external_id,
                plan_id = excluded.plan_id,
                name = excluded.name,
                description = excluded.description,
                billing_cycle = excluded.billing_cycle,
                duration_days = excluded.duration_days,
                sort_weight = excluded.sort_weight,
                status = excluded.status,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(package_group_id_for(group.package_group_no))
        .bind(group.external_id)
        .bind(group_no_for(group.package_group_no))
        .bind(group.name)
        .bind(group.description)
        .bind(group.billing_cycle)
        .bind(group.duration_days)
        .bind(group.sort_weight)
        .bind(SEED_TIMESTAMP)
        .bind(SEED_TIMESTAMP)
        .execute(pool)
        .await
        .map_err(|error| storage_error("failed to upsert membership package group", error))?;
    }
    Ok(())
}

async fn upsert_sqlite_membership_packages(pool: &SqlitePool) -> Result<(), CommerceServiceError> {
    for package in commerce_membership_package_seeds() {
        upsert_sqlite_membership_package_sku(pool, &package).await?;
        sqlx::query(
            r#"
            INSERT INTO commerce_membership_package
                (id, tenant_id, organization_id, external_id, package_no, package_group_id, plan_id, sku_id, name, description, price_amount, original_price_amount, currency_code, point_amount, duration_days, recurrence_cycle, sort_weight, recommended, tags_json, status, starts_at, ends_at, created_at, updated_at)
            VALUES
                (?, '0', '0', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NULL, NULL, ?, ?)
            ON CONFLICT(tenant_id, package_no) DO UPDATE SET
                id = excluded.id,
                organization_id = excluded.organization_id,
                external_id = excluded.external_id,
                package_group_id = excluded.package_group_id,
                plan_id = excluded.plan_id,
                sku_id = excluded.sku_id,
                name = excluded.name,
                description = excluded.description,
                price_amount = excluded.price_amount,
                original_price_amount = excluded.original_price_amount,
                currency_code = excluded.currency_code,
                point_amount = excluded.point_amount,
                duration_days = excluded.duration_days,
                recurrence_cycle = excluded.recurrence_cycle,
                sort_weight = excluded.sort_weight,
                recommended = excluded.recommended,
                tags_json = excluded.tags_json,
                status = excluded.status,
                starts_at = excluded.starts_at,
                ends_at = excluded.ends_at,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(package.id)
        .bind(package.external_id)
        .bind(package_no_for(package.package_no))
        .bind(package_group_id_for(package.package_group_no))
        .bind(plan_id_for(package.plan_no))
        .bind(package.sku_id)
        .bind(package.name)
        .bind(package.description)
        .bind(package.price_amount)
        .bind(package.original_price_amount)
        .bind(package.currency_code)
        .bind(package.point_amount)
        .bind(package.duration_days)
        .bind(recurrence_cycle_for(package.package_group_no))
        .bind(package.sort_weight)
        .bind(i64::from(package.recommended))
        .bind(seed_tags_json(&package.tags))
        .bind(SEED_TIMESTAMP)
        .bind(SEED_TIMESTAMP)
        .execute(pool)
        .await
        .map_err(|error| storage_error("failed to upsert membership package", error))?;
    }
    Ok(())
}

async fn upsert_postgres_membership_packages(pool: &PgPool) -> Result<(), CommerceServiceError> {
    for package in commerce_membership_package_seeds() {
        upsert_postgres_membership_package_sku(pool, &package).await?;
        sqlx::query(
            r#"
            INSERT INTO commerce_membership_package
                (id, tenant_id, organization_id, external_id, package_no, package_group_id, plan_id, sku_id, name, description, price_amount, original_price_amount, currency_code, point_amount, duration_days, recurrence_cycle, sort_weight, recommended, tags_json, status, starts_at, ends_at, created_at, updated_at)
            VALUES
                ($1, '0', '0', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'active', NULL, NULL, $18, $19)
            ON CONFLICT(tenant_id, package_no) DO UPDATE SET
                id = excluded.id,
                organization_id = excluded.organization_id,
                external_id = excluded.external_id,
                package_group_id = excluded.package_group_id,
                plan_id = excluded.plan_id,
                sku_id = excluded.sku_id,
                name = excluded.name,
                description = excluded.description,
                price_amount = excluded.price_amount,
                original_price_amount = excluded.original_price_amount,
                currency_code = excluded.currency_code,
                point_amount = excluded.point_amount,
                duration_days = excluded.duration_days,
                recurrence_cycle = excluded.recurrence_cycle,
                sort_weight = excluded.sort_weight,
                recommended = excluded.recommended,
                tags_json = excluded.tags_json,
                status = excluded.status,
                starts_at = excluded.starts_at,
                ends_at = excluded.ends_at,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(package.id)
        .bind(package.external_id)
        .bind(package_no_for(package.package_no))
        .bind(package_group_id_for(package.package_group_no))
        .bind(plan_id_for(package.plan_no))
        .bind(package.sku_id)
        .bind(package.name)
        .bind(package.description)
        .bind(package.price_amount)
        .bind(package.original_price_amount)
        .bind(package.currency_code)
        .bind(package.point_amount)
        .bind(package.duration_days)
        .bind(recurrence_cycle_for(package.package_group_no))
        .bind(package.sort_weight)
        .bind(i64::from(package.recommended))
        .bind(seed_tags_json(&package.tags))
        .bind(SEED_TIMESTAMP)
        .bind(SEED_TIMESTAMP)
        .execute(pool)
        .await
        .map_err(|error| storage_error("failed to upsert membership package", error))?;
    }
    Ok(())
}

async fn upsert_sqlite_membership_package_sku(
    pool: &SqlitePool,
    package: &CommerceMembershipPackageSeed,
) -> Result<(), CommerceServiceError> {
    sqlx::query(
        r#"
        INSERT INTO commerce_product_sku
            (id, tenant_id, organization_id, spu_id, sku_no, name, title, price_amount, original_price_amount, currency_code, delivery_mode, inventory_tracking, sales_status, spec_json, created_at, updated_at)
        VALUES
            (?, '0', '0', ?, ?, ?, ?, ?, ?, ?, 'membership_activation', 'untracked', 'active', ?, ?, ?)
        ON CONFLICT(tenant_id, sku_no) DO UPDATE SET
            id = excluded.id,
            organization_id = excluded.organization_id,
            spu_id = excluded.spu_id,
            name = excluded.name,
            title = excluded.title,
            price_amount = excluded.price_amount,
            original_price_amount = excluded.original_price_amount,
            currency_code = excluded.currency_code,
            delivery_mode = excluded.delivery_mode,
            inventory_tracking = excluded.inventory_tracking,
            sales_status = excluded.sales_status,
            spec_json = excluded.spec_json,
            updated_at = excluded.updated_at
        "#,
    )
    .bind(package.sku_id)
    .bind(MEMBERSHIP_PRODUCT_ID)
    .bind(sku_no_for(package.sku_no))
    .bind(package.name)
    .bind(package.title)
    .bind(package.price_amount)
    .bind(package.original_price_amount)
    .bind(package.currency_code)
    .bind(membership_sku_spec_json(package))
    .bind(SEED_TIMESTAMP)
    .bind(SEED_TIMESTAMP)
    .execute(pool)
    .await
    .map_err(|error| storage_error("failed to upsert membership sku", error))?;
    Ok(())
}

async fn upsert_postgres_membership_package_sku(
    pool: &PgPool,
    package: &CommerceMembershipPackageSeed,
) -> Result<(), CommerceServiceError> {
    sqlx::query(
        r#"
        INSERT INTO commerce_product_sku
            (id, tenant_id, organization_id, spu_id, sku_no, name, title, price_amount, original_price_amount, currency_code, delivery_mode, inventory_tracking, sales_status, spec_json, created_at, updated_at)
        VALUES
            ($1, '0', '0', $2, $3, $4, $5, $6, $7, $8, 'membership_activation', 'untracked', 'active', $9, $10, $11)
        ON CONFLICT(tenant_id, sku_no) DO UPDATE SET
            id = excluded.id,
            organization_id = excluded.organization_id,
            spu_id = excluded.spu_id,
            name = excluded.name,
            title = excluded.title,
            price_amount = excluded.price_amount,
            original_price_amount = excluded.original_price_amount,
            currency_code = excluded.currency_code,
            delivery_mode = excluded.delivery_mode,
            inventory_tracking = excluded.inventory_tracking,
            sales_status = excluded.sales_status,
            spec_json = excluded.spec_json,
            updated_at = excluded.updated_at
        "#,
    )
    .bind(package.sku_id)
    .bind(MEMBERSHIP_PRODUCT_ID)
    .bind(sku_no_for(package.sku_no))
    .bind(package.name)
    .bind(package.title)
    .bind(package.price_amount)
    .bind(package.original_price_amount)
    .bind(package.currency_code)
    .bind(membership_sku_spec_json(package))
    .bind(SEED_TIMESTAMP)
    .bind(SEED_TIMESTAMP)
    .execute(pool)
    .await
    .map_err(|error| storage_error("failed to upsert membership sku", error))?;
    Ok(())
}

async fn upsert_sqlite_recharge_packages(pool: &SqlitePool) -> Result<(), CommerceServiceError> {
    for package in commerce_recharge_package_seeds() {
        upsert_sqlite_recharge_package_sku(pool, &package).await?;
        sqlx::query(
            r#"
            INSERT INTO commerce_recharge_package
                (id, tenant_id, organization_id, external_id, package_no, sku_id, name, price_amount, currency_code, bonus_points, status, valid_from, valid_to, sort_weight, request_no, idempotency_key, created_at, updated_at)
            VALUES
                (?, '0', '0', ?, ?, ?, ?, ?, ?, ?, 'active', NULL, NULL, ?, ?, ?, ?, ?)
            ON CONFLICT(tenant_id, package_no) DO UPDATE SET
                id = excluded.id,
                organization_id = excluded.organization_id,
                external_id = excluded.external_id,
                sku_id = excluded.sku_id,
                name = excluded.name,
                price_amount = excluded.price_amount,
                currency_code = excluded.currency_code,
                bonus_points = excluded.bonus_points,
                status = excluded.status,
                valid_from = excluded.valid_from,
                valid_to = excluded.valid_to,
                sort_weight = excluded.sort_weight,
                request_no = excluded.request_no,
                idempotency_key = excluded.idempotency_key,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(package.package_id)
        .bind(package.external_id)
        .bind(package.package_no)
        .bind(package.sku_id)
        .bind(package.name)
        .bind(package.price_amount)
        .bind(package.currency_code)
        .bind(package.bonus_points)
        .bind(package.sort_weight)
        .bind(format!("seed-recharge-package-{}", package.package_no))
        .bind(format!("seed-recharge-package-{}", package.package_no))
        .bind(SEED_TIMESTAMP)
        .bind(SEED_TIMESTAMP)
        .execute(pool)
        .await
        .map_err(|error| storage_error("failed to upsert recharge package", error))?;
    }
    Ok(())
}

async fn upsert_postgres_recharge_packages(pool: &PgPool) -> Result<(), CommerceServiceError> {
    for package in commerce_recharge_package_seeds() {
        upsert_postgres_recharge_package_sku(pool, &package).await?;
        sqlx::query(
            r#"
            INSERT INTO commerce_recharge_package
                (id, tenant_id, organization_id, external_id, package_no, sku_id, name, price_amount, currency_code, bonus_points, status, valid_from, valid_to, sort_weight, request_no, idempotency_key, created_at, updated_at)
            VALUES
                ($1, '0', '0', $2, $3, $4, $5, $6, $7, $8, 'active', NULL, NULL, $9, $10, $11, $12, $13)
            ON CONFLICT(tenant_id, package_no) DO UPDATE SET
                id = excluded.id,
                organization_id = excluded.organization_id,
                external_id = excluded.external_id,
                sku_id = excluded.sku_id,
                name = excluded.name,
                price_amount = excluded.price_amount,
                currency_code = excluded.currency_code,
                bonus_points = excluded.bonus_points,
                status = excluded.status,
                valid_from = excluded.valid_from,
                valid_to = excluded.valid_to,
                sort_weight = excluded.sort_weight,
                request_no = excluded.request_no,
                idempotency_key = excluded.idempotency_key,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(package.package_id)
        .bind(package.external_id)
        .bind(package.package_no)
        .bind(package.sku_id)
        .bind(package.name)
        .bind(package.price_amount)
        .bind(package.currency_code)
        .bind(package.bonus_points)
        .bind(package.sort_weight)
        .bind(format!("seed-recharge-package-{}", package.package_no))
        .bind(format!("seed-recharge-package-{}", package.package_no))
        .bind(SEED_TIMESTAMP)
        .bind(SEED_TIMESTAMP)
        .execute(pool)
        .await
        .map_err(|error| storage_error("failed to upsert recharge package", error))?;
    }
    Ok(())
}

async fn upsert_sqlite_recharge_package_sku(
    pool: &SqlitePool,
    package: &CommerceRechargePackageSeed,
) -> Result<(), CommerceServiceError> {
    sqlx::query(
        r#"
        INSERT INTO commerce_product_sku
            (id, tenant_id, organization_id, spu_id, sku_no, name, title, price_amount, original_price_amount, currency_code, delivery_mode, inventory_tracking, sales_status, spec_json, created_at, updated_at)
        VALUES
            (?, '0', '0', ?, ?, ?, ?, ?, NULL, ?, 'points_credit', 'untracked', 'active', ?, ?, ?)
        ON CONFLICT(tenant_id, sku_no) DO UPDATE SET
            id = excluded.id,
            organization_id = excluded.organization_id,
            spu_id = excluded.spu_id,
            name = excluded.name,
            title = excluded.title,
            price_amount = excluded.price_amount,
            currency_code = excluded.currency_code,
            delivery_mode = excluded.delivery_mode,
            inventory_tracking = excluded.inventory_tracking,
            sales_status = excluded.sales_status,
            spec_json = excluded.spec_json,
            updated_at = excluded.updated_at
        "#,
    )
    .bind(package.sku_id)
    .bind(RECHARGE_PRODUCT_ID)
    .bind(package.sku_no)
    .bind(package.name)
    .bind(package.name)
    .bind(package.price_amount)
    .bind(package.currency_code)
    .bind(recharge_sku_spec_json(package))
    .bind(SEED_TIMESTAMP)
    .bind(SEED_TIMESTAMP)
    .execute(pool)
    .await
    .map_err(|error| storage_error("failed to upsert recharge sku", error))?;
    Ok(())
}

async fn upsert_postgres_recharge_package_sku(
    pool: &PgPool,
    package: &CommerceRechargePackageSeed,
) -> Result<(), CommerceServiceError> {
    sqlx::query(
        r#"
        INSERT INTO commerce_product_sku
            (id, tenant_id, organization_id, spu_id, sku_no, name, title, price_amount, original_price_amount, currency_code, delivery_mode, inventory_tracking, sales_status, spec_json, created_at, updated_at)
        VALUES
            ($1, '0', '0', $2, $3, $4, $5, $6, NULL, $7, 'points_credit', 'untracked', 'active', $8, $9, $10)
        ON CONFLICT(tenant_id, sku_no) DO UPDATE SET
            id = excluded.id,
            organization_id = excluded.organization_id,
            spu_id = excluded.spu_id,
            name = excluded.name,
            title = excluded.title,
            price_amount = excluded.price_amount,
            currency_code = excluded.currency_code,
            delivery_mode = excluded.delivery_mode,
            inventory_tracking = excluded.inventory_tracking,
            sales_status = excluded.sales_status,
            spec_json = excluded.spec_json,
            updated_at = excluded.updated_at
        "#,
    )
    .bind(package.sku_id)
    .bind(RECHARGE_PRODUCT_ID)
    .bind(package.sku_no)
    .bind(package.name)
    .bind(package.name)
    .bind(package.price_amount)
    .bind(package.currency_code)
    .bind(recharge_sku_spec_json(package))
    .bind(SEED_TIMESTAMP)
    .bind(SEED_TIMESTAMP)
    .execute(pool)
    .await
    .map_err(|error| storage_error("failed to upsert recharge sku", error))?;
    Ok(())
}

async fn upsert_sqlite_payment_methods(pool: &SqlitePool) -> Result<(), CommerceServiceError> {
    for method in commerce_payment_method_seeds() {
        sqlx::query(
            r#"
            INSERT INTO commerce_payment_method
                (id, tenant_id, organization_id, method_key, display_name, provider, status, sort_weight, request_no, idempotency_key, created_at, updated_at)
            VALUES
                (?, '0', '0', ?, ?, ?, 'active', ?, ?, ?, ?, ?)
            ON CONFLICT(tenant_id, organization_id, method_key) DO UPDATE SET
                id = excluded.id,
                display_name = excluded.display_name,
                provider = excluded.provider,
                status = excluded.status,
                sort_weight = excluded.sort_weight,
                request_no = excluded.request_no,
                idempotency_key = excluded.idempotency_key,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(method.id)
        .bind(method.method_key)
        .bind(method.display_name)
        .bind(method.provider)
        .bind(method.sort_weight)
        .bind(payment_method_request_no(&method))
        .bind(payment_method_request_no(&method))
        .bind(SEED_TIMESTAMP)
        .bind(SEED_TIMESTAMP)
        .execute(pool)
        .await
        .map_err(|error| storage_error("failed to upsert payment method", error))?;
    }
    Ok(())
}

async fn upsert_postgres_payment_methods(pool: &PgPool) -> Result<(), CommerceServiceError> {
    for method in commerce_payment_method_seeds() {
        sqlx::query(
            r#"
            INSERT INTO commerce_payment_method
                (id, tenant_id, organization_id, method_key, display_name, provider, status, sort_weight, request_no, idempotency_key, created_at, updated_at)
            VALUES
                ($1, '0', '0', $2, $3, $4, 'active', $5, $6, $7, $8, $9)
            ON CONFLICT(tenant_id, organization_id, method_key) DO UPDATE SET
                id = excluded.id,
                display_name = excluded.display_name,
                provider = excluded.provider,
                status = excluded.status,
                sort_weight = excluded.sort_weight,
                request_no = excluded.request_no,
                idempotency_key = excluded.idempotency_key,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(method.id)
        .bind(method.method_key)
        .bind(method.display_name)
        .bind(method.provider)
        .bind(method.sort_weight)
        .bind(payment_method_request_no(&method))
        .bind(payment_method_request_no(&method))
        .bind(SEED_TIMESTAMP)
        .bind(SEED_TIMESTAMP)
        .execute(pool)
        .await
        .map_err(|error| storage_error("failed to upsert payment method", error))?;
    }
    Ok(())
}

fn membership_plan_benefit_json(plan: &CommerceMembershipPlanSeed) -> String {
    serde_json::json!({
        "planNo": plan.plan_no,
        "planRank": plan.rank,
        "requiredPoints": plan.required_points,
        "badge": plan.badge,
        "description": plan.description,
        "items": plan
            .benefits
            .iter()
            .map(membership_benefit_json)
            .collect::<Vec<_>>(),
    })
    .to_string()
}

fn membership_benefit_json(benefit: &CommerceMembershipBenefitSeed) -> serde_json::Value {
    serde_json::json!({
        "id": benefit.id,
        "benefitKey": benefit.benefit_key,
        "name": benefit.name,
        "description": benefit.description,
        "type": benefit.benefit_type,
        "usageLimit": benefit.usage_limit,
        "claimed": false,
        "usedCount": 0,
    })
}

fn membership_sku_spec_json(package: &CommerceMembershipPackageSeed) -> String {
    let group = group_seed_for(package.package_group_no);
    serde_json::json!({
        "kind": "membership_package",
        "packageId": package.id,
        "packageNo": package_no_for(package.package_no),
        "groupCode": group_code(package.package_group_no),
        "groupNo": group_no_for(package.package_group_no),
        "groupName": group.as_ref().map(|item| item.name).unwrap_or(package.package_group_no),
        "planNo": package.plan_no,
        "planCode": package.plan_no,
        "durationDays": package.duration_days,
        "recurrenceCycle": recurrence_cycle_for(package.package_group_no),
        "pointAmount": package.point_amount,
        "recommended": package.recommended,
        "tags": package.tags,
    })
    .to_string()
}

fn recharge_sku_spec_json(package: &CommerceRechargePackageSeed) -> String {
    serde_json::json!({
        "kind": "points_recharge_package",
        "packageId": package.package_id,
        "packageNo": package.package_no,
        "externalId": package.external_id,
        "bonusPoints": package.bonus_points,
    })
    .to_string()
}

fn package_group_id_for(package_group_no: &str) -> &'static str {
    match group_code(package_group_no) {
        "month" => "seed-membership-package-group-month",
        "year" => "seed-membership-package-group-year",
        "day" => "seed-membership-package-group-day",
        "week" => "seed-membership-package-group-week",
        _ => "seed-membership-package-group-unknown",
    }
}

fn plan_id_for(plan_no: &str) -> &'static str {
    match plan_no {
        "basic" => "seed-membership-plan-basic",
        "pro" => "seed-membership-plan-pro",
        "premium" => "seed-membership-plan-premium",
        _ => "seed-membership-plan-free",
    }
}

fn group_seed_for(group_no: &str) -> Option<CommerceMembershipPackageGroupSeed> {
    commerce_membership_package_group_seeds()
        .into_iter()
        .find(|group| group.package_group_no == group_no)
}

fn group_code(group_no: &str) -> &str {
    group_no.strip_prefix("membership-").unwrap_or(group_no)
}

fn group_no_for(group_no: &str) -> String {
    format!("membership-{}", group_code(group_no))
}

fn package_no_for(package_no: &str) -> String {
    package_no.to_owned()
}

fn sku_no_for(sku_no: &str) -> String {
    sku_no.to_owned()
}

fn recurrence_cycle_for(group_no: &str) -> &str {
    match group_code(group_no) {
        "year" => "year",
        "week" => "week",
        "day" => "day",
        _ => "month",
    }
}

fn seed_tags_json(tags: &[&str]) -> String {
    serde_json::to_string(tags).unwrap_or_else(|_| "[]".to_owned())
}

fn payment_method_request_no(method: &CommercePaymentMethodSeed) -> String {
    format!("seed-payment-method-{}", method.method_key)
}

fn seed_product_type(spu_no: &str) -> &'static str {
    match spu_no {
        "membership" => "membership",
        "points-recharge" => "points_recharge",
        _ => "virtual",
    }
}

async fn sqlite_count(pool: &SqlitePool, statement: &str) -> Result<i64, CommerceServiceError> {
    sqlx::query_scalar::<_, i64>(statement)
        .fetch_one(pool)
        .await
        .map_err(|error| storage_error("failed to count commerce seed rows", error))
}

async fn postgres_count(pool: &PgPool, statement: &str) -> Result<i64, CommerceServiceError> {
    sqlx::query_scalar::<_, i64>(statement)
        .fetch_one(pool)
        .await
        .map_err(|error| storage_error("failed to count commerce seed rows", error))
}

const COMPLETE_PRODUCT_COUNT_SQL: &str = r#"
SELECT COUNT(1)
FROM commerce_product_spu
WHERE tenant_id = '0'
  AND organization_id = '0'
  AND spu_no IN ('membership', 'points-recharge')
  AND sales_status = 'active'
"#;

const COMPLETE_MEMBERSHIP_PLAN_COUNT_SQL: &str = r#"
SELECT COUNT(1)
FROM commerce_membership_plan
WHERE tenant_id = '0'
  AND organization_id = '0'
  AND plan_no IN ('free', 'basic', 'pro', 'premium')
  AND status = 'active'
"#;

const COMPLETE_MEMBERSHIP_PACKAGE_GROUP_COUNT_SQL: &str = r#"
SELECT COUNT(1)
FROM commerce_membership_package_group
WHERE tenant_id = '0'
  AND organization_id = '0'
  AND external_id IN (1, 2, 3, 4)
  AND group_no IN ('membership-month', 'membership-year', 'membership-day', 'membership-week')
  AND status = 'active'
"#;

const COMPLETE_MEMBERSHIP_PACKAGE_COUNT_SQL: &str = r#"
SELECT COUNT(1)
FROM commerce_membership_package
WHERE tenant_id = '0'
  AND organization_id = '0'
  AND external_id IN (101, 102, 103, 104, 201, 202, 203, 204, 301, 302, 303, 304, 401, 402, 403, 404)
  AND package_no LIKE 'membership-%'
  AND status = 'active'
"#;

const COMPLETE_MEMBERSHIP_GROUP_PACKAGE_COUNT_SQL: &str = r#"
SELECT COUNT(1)
FROM (
    SELECT package_group_id, COUNT(1) AS package_count
    FROM commerce_membership_package
    WHERE tenant_id = '0'
      AND organization_id = '0'
      AND status = 'active'
    GROUP BY package_group_id
    HAVING COUNT(1) = 4
) seeded_groups
"#;

const COMPLETE_MEMBERSHIP_SKU_COUNT_SQL: &str = r#"
SELECT COUNT(1)
FROM commerce_product_sku
WHERE tenant_id = '0'
  AND organization_id = '0'
  AND spu_id = 'seed-product-membership'
  AND sku_no LIKE 'membership-%'
  AND sales_status = 'active'
"#;

const COMPLETE_RECHARGE_PACKAGE_COUNT_SQL: &str = r#"
SELECT COUNT(1)
FROM commerce_recharge_package
WHERE tenant_id = '0'
  AND organization_id = '0'
  AND package_no IN ('points-990', 'points-1990', 'points-4990', 'points-9990')
  AND status = 'active'
"#;

const COMPLETE_RECHARGE_SKU_COUNT_SQL: &str = r#"
SELECT COUNT(1)
FROM commerce_product_sku
WHERE tenant_id = '0'
  AND organization_id = '0'
  AND spu_id = 'seed-product-points-recharge'
  AND sku_no IN ('points-recharge-990', 'points-recharge-1990', 'points-recharge-4990', 'points-recharge-9990')
  AND sales_status = 'active'
"#;

const COMPLETE_PAYMENT_METHOD_COUNT_SQL: &str = r#"
SELECT COUNT(1)
FROM commerce_payment_method
WHERE tenant_id = '0'
  AND organization_id = '0'
  AND method_key IN ('wechat', 'alipay', 'stripe')
  AND status = 'active'
"#;

fn storage_error(context: &str, error: sqlx::Error) -> CommerceServiceError {
    CommerceServiceError::storage(format!("{context}: {error}"))
}
