use sha2::{Digest, Sha256};
use sqlx::{PgPool, Postgres, Row, Transaction};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    AdminAccessGroupCommandFuture, AdminAccessGroupItem, AdminAccessGroupStore,
    CreateAdminAccessGroupCommand, DeleteAdminAccessGroupCommand, ListAdminAccessGroupsQuery,
    UpdateAdminAccessGroupCommand,
};

const ACCESS_GROUP_TARGET_TYPE: i32 = 41;
const API_KEY_GROUP_SUBJECT_TYPE: i32 = 3;
const CONFIG_SCOPE_ROUTER: i32 = 10;
const CONFIG_TYPE_ACCESS_GROUP: i32 = ACCESS_GROUP_TARGET_TYPE;

#[derive(Debug, Clone)]
pub struct PostgresAdminAccessGroupStore {
    pool: PgPool,
}

impl PostgresAdminAccessGroupStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl AdminAccessGroupStore for PostgresAdminAccessGroupStore {
    fn list_access_groups<'a>(
        &'a self,
        query: ListAdminAccessGroupsQuery,
    ) -> AdminAccessGroupCommandFuture<'a, Vec<AdminAccessGroupItem>> {
        Box::pin(async move { list_access_groups(&self.pool, query).await })
    }

    fn create_access_group<'a>(
        &'a self,
        command: CreateAdminAccessGroupCommand,
    ) -> AdminAccessGroupCommandFuture<'a, AdminAccessGroupItem> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin access group transaction", error)
                })?;
            let pricing_plan = find_default_pricing_plan(
                &mut tx,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?;
            let id = insert_access_group(&mut tx, &command, pricing_plan.as_ref()).await?;
            if let Some((pricing_plan_id, pricing_plan_code)) = pricing_plan {
                upsert_pricing_plan_binding(
                    &mut tx,
                    &command.binding_uuid,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    id,
                    &command.code,
                    pricing_plan_id,
                    &pricing_plan_code,
                    command.rate_multiplier,
                    &command.requested_at,
                )
                .await?;
            }
            insert_config_snapshot(
                &mut tx,
                &command.config_snapshot_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                "create_access_group",
                id,
                serde_json::json!({
                    "action": "create_access_group",
                    "accessGroupId": id,
                    "name": &command.name,
                    "platform": &command.platform,
                    "billingType": &command.billing_type,
                    "rateMultiplier": command.rate_multiplier,
                    "type": &command.group_type,
                    "capacityTotal": command.capacity_total,
                    "status": &command.status
                }),
                &command.requested_at,
            )
            .await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_access_group",
                id,
                serde_json::json!({
                    "action": "create_access_group",
                    "accessGroupId": id,
                    "name": &command.name,
                    "platform": &command.platform,
                    "rateMultiplier": command.rate_multiplier,
                    "status": &command.status
                }),
            )
            .await?;
            let item = load_access_group_by_id(
                &mut tx,
                id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("created access group could not be reloaded"))?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit access group transaction", error))?;
            Ok(item)
        })
    }

    fn update_access_group<'a>(
        &'a self,
        command: UpdateAdminAccessGroupCommand,
    ) -> AdminAccessGroupCommandFuture<'a, Option<AdminAccessGroupItem>> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin access group transaction", error)
                })?;
            let updated = update_access_group(&mut tx, &command).await?;
            if !updated {
                tx.commit().await.map_err(|error| {
                    store_error("failed to commit access group transaction", error)
                })?;
                return Ok(None);
            }
            if let Some(rate_multiplier) = command.rate_multiplier {
                if let Some((pricing_plan_id, pricing_plan_code)) = find_group_pricing_plan(
                    &mut tx,
                    command.group_id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                )
                .await?
                {
                    let subject_code = load_group_code(
                        &mut tx,
                        command.group_id,
                        command.subject.tenant_id,
                        command.subject.organization_id,
                    )
                    .await?
                    .unwrap_or_else(|| format!("group-{}", command.group_id));
                    upsert_pricing_plan_binding(
                        &mut tx,
                        &command.binding_uuid,
                        command.subject.tenant_id,
                        command.subject.organization_id,
                        command.group_id,
                        &subject_code,
                        pricing_plan_id,
                        &pricing_plan_code,
                        rate_multiplier,
                        &command.requested_at,
                    )
                    .await?;
                }
            }
            insert_config_snapshot(
                &mut tx,
                &command.config_snapshot_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                "update_access_group",
                command.group_id,
                serde_json::json!({
                    "action": "update_access_group",
                    "accessGroupId": command.group_id,
                    "nameChanged": command.name.is_some(),
                    "platformChanged": command.platform.is_some(),
                    "billingTypeChanged": command.billing_type.is_some(),
                    "rateMultiplier": command.rate_multiplier,
                    "type": &command.group_type,
                    "capacityTotal": command.capacity_total,
                    "status": &command.status
                }),
                &command.requested_at,
            )
            .await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "update_access_group",
                command.group_id,
                serde_json::json!({
                    "action": "update_access_group",
                    "accessGroupId": command.group_id,
                    "nameChanged": command.name.is_some(),
                    "platformChanged": command.platform.is_some(),
                    "billingTypeChanged": command.billing_type.is_some(),
                    "rateMultiplier": command.rate_multiplier,
                    "status": command.status
                }),
            )
            .await?;
            let item = load_access_group_by_id(
                &mut tx,
                command.group_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit access group transaction", error))?;
            Ok(item)
        })
    }

    fn delete_access_group<'a>(
        &'a self,
        command: DeleteAdminAccessGroupCommand,
    ) -> AdminAccessGroupCommandFuture<'a, bool> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin access group transaction", error)
                })?;
            let deleted = soft_delete_access_group(&mut tx, &command).await?;
            if deleted {
                soft_delete_group_bindings(&mut tx, &command).await?;
                insert_config_snapshot(
                    &mut tx,
                    &command.config_snapshot_uuid,
                    &command.request_id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    command.subject.operator_id,
                    "delete_access_group",
                    command.group_id,
                    serde_json::json!({
                        "action": "delete_access_group",
                        "accessGroupId": command.group_id,
                        "deleted": true
                    }),
                    &command.requested_at,
                )
                .await?;
                insert_audit_log(
                    &mut tx,
                    &command.audit_log_uuid,
                    &command.request_id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    command.subject.operator_id,
                    command.subject.operator_type,
                    "delete_access_group",
                    command.group_id,
                    serde_json::json!({
                        "action": "delete_access_group",
                        "accessGroupId": command.group_id
                    }),
                )
                .await?;
            }
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit access group transaction", error))?;
            Ok(deleted)
        })
    }
}

async fn list_access_groups(
    pool: &PgPool,
    query: ListAdminAccessGroupsQuery,
) -> DomainResult<Vec<AdminAccessGroupItem>> {
    let sql = access_group_select_sql(
        r#"
        WHERE g.tenant_id = $1
          AND g.organization_id = $2
          AND g.deleted_at IS NULL
        ORDER BY g.updated_at DESC NULLS LAST, g.id DESC
        LIMIT 200
        "#,
    );
    let rows = sqlx::query(&sql)
        .bind(query.subject.tenant_id)
        .bind(query.subject.organization_id)
        .fetch_all(pool)
        .await
        .map_err(|error| store_error("failed to list access groups", error))?;

    rows.into_iter().map(item_from_row).collect()
}

async fn find_default_pricing_plan(
    tx: &mut Transaction<'_, Postgres>,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<(i64, String)>> {
    let row = sqlx::query(
        r#"
        SELECT id, COALESCE(plan_code, '') AS plan_code
        FROM ai_pricing_plan
        WHERE status = 1
          AND deleted_at IS NULL
          AND (tenant_id = $1 OR tenant_id = 0 OR tenant_id IS NULL)
          AND (organization_id = $2 OR organization_id = 0 OR organization_id IS NULL)
        ORDER BY CASE
            WHEN tenant_id = $1 AND organization_id = $2 THEN 0
            WHEN tenant_id = $1 AND organization_id = 0 THEN 1
            WHEN tenant_id = 0 AND organization_id = 0 THEN 2
            ELSE 3
          END,
          priority ASC NULLS LAST,
          id ASC
        LIMIT 1
        "#,
    )
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load default pricing plan", error))?;
    let Some(row) = row else {
        return Ok(None);
    };
    let id = row.try_get::<i64, _>("id").map_err(row_error)?;
    let code = row.try_get::<String, _>("plan_code").map_err(row_error)?;
    Ok(Some((id, code)))
}

async fn find_group_pricing_plan(
    tx: &mut Transaction<'_, Postgres>,
    group_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<(i64, String)>> {
    let row = sqlx::query(
        r#"
        SELECT pricing_plan_id, COALESCE(pricing_plan_code, '') AS pricing_plan_code
        FROM iam_gateway_api_key_group
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
          AND deleted_at IS NULL
        LIMIT 1
        "#,
    )
    .bind(group_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load group pricing plan", error))?;
    let Some(row) = row else {
        return Ok(None);
    };
    let Some(id) = optional_integer_cell(&row, "pricing_plan_id") else {
        return Ok(None);
    };
    let code = row
        .try_get::<Option<String>, _>("pricing_plan_code")
        .ok()
        .flatten()
        .unwrap_or_default();
    Ok(Some((id, code)))
}

async fn load_group_code(
    tx: &mut Transaction<'_, Postgres>,
    group_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<String>> {
    sqlx::query_scalar(
        r#"
        SELECT code
        FROM iam_gateway_api_key_group
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
          AND deleted_at IS NULL
        LIMIT 1
        "#,
    )
    .bind(group_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load access group code", error))
}

async fn insert_access_group(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAdminAccessGroupCommand,
    pricing_plan: Option<&(i64, String)>,
) -> DomainResult<i64> {
    let (pricing_plan_id, pricing_plan_code) = pricing_plan
        .map(|(id, code)| (Some(*id), Some(code.as_str())))
        .unwrap_or((None, None));
    sqlx::query_scalar(
        r#"
        INSERT INTO iam_gateway_api_key_group
            (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, name, code, description, provider_code, group_type, environment, pricing_plan_id, pricing_plan_code, rate_multiplier, official_price_multiplier, billing_type, capacity_limit, allowed_origin, metadata)
        VALUES
            ($1, $2, $3, 1, $4, $5::timestamptz, $6::timestamptz, 0, $7, $8, '', $9, $10, 1, $11, $12, $13::numeric, $14::numeric, $15, $16, '{}'::jsonb, '{}'::jsonb)
        RETURNING id
        "#,
    )
    .bind(&command.group_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(status_code(&command.status))
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(&command.name)
    .bind(&command.code)
    .bind(&command.platform)
    .bind(group_type_code(&command.group_type))
    .bind(pricing_plan_id)
    .bind(pricing_plan_code)
    .bind(decimal_string(command.rate_multiplier))
    .bind(decimal_string(command.rate_multiplier))
    .bind(billing_type_code(&command.billing_type))
    .bind(command.capacity_total.round() as i64)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create access group", error))
}

async fn update_access_group(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateAdminAccessGroupCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE iam_gateway_api_key_group
        SET name = COALESCE($1, name),
            provider_code = COALESCE($2, provider_code),
            billing_type = COALESCE($3, billing_type),
            rate_multiplier = COALESCE($4::numeric, rate_multiplier),
            official_price_multiplier = COALESCE($5::numeric, official_price_multiplier),
            group_type = COALESCE($6, group_type),
            capacity_limit = COALESCE($7, capacity_limit),
            status = COALESCE($8, status),
            updated_at = $9::timestamptz,
            version = COALESCE(version, 0) + 1
        WHERE id = $10
          AND tenant_id = $11
          AND organization_id = $12
          AND deleted_at IS NULL
        "#,
    )
    .bind(command.name.as_deref())
    .bind(command.platform.as_deref())
    .bind(
        command
            .billing_type
            .as_ref()
            .map(|value| billing_type_code(value)),
    )
    .bind(command.rate_multiplier.map(decimal_string))
    .bind(command.rate_multiplier.map(decimal_string))
    .bind(
        command
            .group_type
            .as_ref()
            .map(|value| group_type_code(value)),
    )
    .bind(command.capacity_total.map(|value| value.round() as i64))
    .bind(command.status.as_ref().map(|value| status_code(value)))
    .bind(&command.requested_at)
    .bind(command.group_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update access group", error))?;

    Ok(result.rows_affected() > 0)
}

async fn soft_delete_access_group(
    tx: &mut Transaction<'_, Postgres>,
    command: &DeleteAdminAccessGroupCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE iam_gateway_api_key_group
        SET status = -1,
            deleted_at = $1::timestamptz,
            deleted_by = $2,
            updated_at = $3::timestamptz,
            version = COALESCE(version, 0) + 1
        WHERE id = $4
          AND tenant_id = $5
          AND organization_id = $6
          AND deleted_at IS NULL
        "#,
    )
    .bind(&command.requested_at)
    .bind(command.subject.operator_id)
    .bind(&command.requested_at)
    .bind(command.group_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete access group", error))?;

    Ok(result.rows_affected() > 0)
}

async fn load_access_group_by_id(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminAccessGroupItem>> {
    let sql = access_group_select_sql(
        r#"
        WHERE g.id = $1
          AND g.tenant_id = $2
          AND g.organization_id = $3
          AND g.deleted_at IS NULL
        LIMIT 1
        "#,
    );
    let row = sqlx::query(&sql)
        .bind(id)
        .bind(tenant_id)
        .bind(organization_id)
        .fetch_optional(&mut **tx)
        .await
        .map_err(|error| store_error("failed to load access group", error))?;

    row.map(item_from_row).transpose()
}

async fn upsert_pricing_plan_binding(
    tx: &mut Transaction<'_, Postgres>,
    binding_uuid: &str,
    tenant_id: i64,
    organization_id: i64,
    group_id: i64,
    group_code: &str,
    pricing_plan_id: i64,
    pricing_plan_code: &str,
    rate_multiplier: f64,
    requested_at: &str,
) -> DomainResult<()> {
    let updated = sqlx::query(
        r#"
        UPDATE ai_pricing_plan_binding
        SET status = 1,
            updated_at = $1::timestamptz,
            deleted_at = NULL,
            multiplier_override = $2::numeric,
            subject_code = $3,
            version = COALESCE(version, 0) + 1
        WHERE tenant_id = $4
          AND organization_id = $5
          AND subject_type = $6
          AND subject_id = $7
          AND pricing_plan_id = $8
        "#,
    )
    .bind(requested_at)
    .bind(decimal_string(rate_multiplier))
    .bind(group_code)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(API_KEY_GROUP_SUBJECT_TYPE)
    .bind(group_id)
    .bind(pricing_plan_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update access group pricing binding", error))?
    .rows_affected();

    if updated > 0 {
        return Ok(());
    }

    sqlx::query(
        r#"
        INSERT INTO ai_pricing_plan_binding
            (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, pricing_plan_id, pricing_plan_code, subject_type, subject_id, subject_code, binding_source, multiplier_override, priority, effective_from)
        VALUES
            ($1, $2, $3, 1, 1, $4::timestamptz, $5::timestamptz, 0, $6, $7, $8, $9, $10, 1, $11::numeric, 1, $12::timestamptz)
        "#,
    )
    .bind(binding_uuid)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(requested_at)
    .bind(requested_at)
    .bind(pricing_plan_id)
    .bind(pricing_plan_code)
    .bind(API_KEY_GROUP_SUBJECT_TYPE)
    .bind(group_id)
    .bind(group_code)
    .bind(decimal_string(rate_multiplier))
    .bind(requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create access group pricing binding", error))?;
    Ok(())
}

async fn soft_delete_group_bindings(
    tx: &mut Transaction<'_, Postgres>,
    command: &DeleteAdminAccessGroupCommand,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE ai_pricing_plan_binding
        SET status = -1,
            deleted_at = $1::timestamptz,
            deleted_by = $2,
            updated_at = $3::timestamptz,
            version = COALESCE(version, 0) + 1
        WHERE tenant_id = $4
          AND organization_id = $5
          AND subject_type = $6
          AND subject_id = $7
          AND deleted_at IS NULL
        "#,
    )
    .bind(&command.requested_at)
    .bind(command.subject.operator_id)
    .bind(&command.requested_at)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(API_KEY_GROUP_SUBJECT_TYPE)
    .bind(command.group_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete access group pricing bindings", error))?;
    Ok(())
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
    .bind(ACCESS_GROUP_TARGET_TYPE)
    .bind(target_id)
    .bind(request_id)
    .bind(operator_id)
    .bind(operator_type)
    .bind(change_summary.to_string())
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to write access group audit log", error))?;
    Ok(())
}

async fn insert_config_snapshot(
    tx: &mut Transaction<'_, Postgres>,
    snapshot_uuid: &str,
    request_id: &str,
    tenant_id: i64,
    organization_id: i64,
    operator_id: i64,
    action: &'static str,
    target_id: i64,
    payload: serde_json::Value,
    requested_at: &str,
) -> DomainResult<()> {
    let payload = payload.to_string();
    let snapshot_no = format!("access-group-{target_id}-{action}-{snapshot_uuid}");
    sqlx::query(
        r#"
        INSERT INTO ops_config_snapshot
            (uuid, tenant_id, organization_id, user_id, request_id, status, snapshot_no, config_scope, config_type, source_table, source_ids, config_payload, config_hash, published_at, published_by)
        VALUES
            ($1, $2, $3, $4, $5, 1, $6, $7, $8, 'iam_gateway_api_key_group', $9::jsonb, $10::jsonb, $11, $12::timestamptz, $13)
        "#,
    )
    .bind(snapshot_uuid)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(operator_id)
    .bind(request_id)
    .bind(snapshot_no)
    .bind(CONFIG_SCOPE_ROUTER)
    .bind(CONFIG_TYPE_ACCESS_GROUP)
    .bind(serde_json::json!([target_id]).to_string())
    .bind(&payload)
    .bind(digest_hex(&payload))
    .bind(requested_at)
    .bind(operator_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to write access group config snapshot", error))?;
    Ok(())
}

fn access_group_select_sql(predicate: &str) -> String {
    format!(
        r#"
        SELECT
            g.id,
            g.uuid,
            g.tenant_id,
            g.organization_id,
            COALESCE(g.name, g.code, '') AS name,
            COALESCE(g.provider_code, '') AS platform,
            g.billing_type,
            COALESCE(g.rate_multiplier, g.official_price_multiplier, 1)::text AS rate_multiplier,
            g.group_type,
            COALESCE(m.account_available_count, 0) AS account_available,
            COALESCE(m.account_total_count, 0) AS account_total,
            COALESCE(m.capacity_used, 0)::text AS capacity_used,
            COALESCE(m.capacity_limit, g.capacity_limit, 0)::text AS capacity_total,
            COALESCE(m.usage_amount_today, 0)::text AS usage_today,
            COALESCE(m.usage_amount_total, 0)::text AS usage_total,
            g.status,
            g.deleted_at::text AS deleted_at
        FROM iam_gateway_api_key_group g
        LEFT JOIN LATERAL (
            SELECT latest.*
            FROM iam_gateway_api_key_group_metric_snapshot latest
            WHERE latest.tenant_id = g.tenant_id
              AND latest.organization_id = g.organization_id
              AND latest.group_id = g.id
              AND latest.status = 1
            ORDER BY latest.snapshot_at DESC NULLS LAST, latest.id DESC
            LIMIT 1
        ) m ON true
        {predicate}
        "#
    )
}

fn item_from_row(row: sqlx::postgres::PgRow) -> DomainResult<AdminAccessGroupItem> {
    Ok(AdminAccessGroupItem {
        id: row.try_get("id").map_err(row_error)?,
        uuid: row.try_get("uuid").map_err(row_error)?,
        tenant_id: row.try_get("tenant_id").map_err(row_error)?,
        organization_id: row.try_get("organization_id").map_err(row_error)?,
        name: row.try_get("name").map_err(row_error)?,
        platform: row.try_get("platform").map_err(row_error)?,
        billing_type: billing_type_label(required_integer_cell(
            &row,
            "billing_type",
            "billing_type",
        )?)?,
        rate_multiplier: decimal_cell(&row, "rate_multiplier"),
        group_type: group_type_label(required_integer_cell(&row, "group_type", "group_type")?)?,
        account_available: optional_integer_cell(&row, "account_available").unwrap_or(0),
        account_total: optional_integer_cell(&row, "account_total").unwrap_or(0),
        capacity_used: decimal_cell(&row, "capacity_used"),
        capacity_total: decimal_cell(&row, "capacity_total"),
        usage_today: decimal_cell(&row, "usage_today"),
        usage_total: decimal_cell(&row, "usage_total"),
        status: status_label(required_integer_cell(&row, "status", "status")?)?,
        deleted_at: row.try_get("deleted_at").ok().flatten(),
    })
}

fn billing_type_code(value: &str) -> i32 {
    if value == "subscription" {
        2
    } else {
        1
    }
}

fn billing_type_label(value: i64) -> DomainResult<String> {
    match value {
        1 => Ok("standard"),
        2 => Ok("subscription"),
        value => Err(DomainError::new(format!(
            "invalid admin access group billing_type from database row: {value}"
        ))),
    }
    .map(str::to_owned)
}

fn group_type_code(value: &str) -> i32 {
    if value == "dedicated" {
        2
    } else {
        1
    }
}

fn group_type_label(value: i64) -> DomainResult<String> {
    match value {
        1 => Ok("public"),
        2 => Ok("dedicated"),
        value => Err(DomainError::new(format!(
            "invalid admin access group group_type from database row: {value}"
        ))),
    }
    .map(str::to_owned)
}

fn status_code(value: &str) -> i32 {
    if value == "disabled" {
        0
    } else {
        1
    }
}

fn status_label(value: i64) -> DomainResult<String> {
    match value {
        0 => Ok("disabled"),
        1 => Ok("active"),
        value => Err(DomainError::new(format!(
            "invalid admin access group status from database row: {value}"
        ))),
    }
    .map(str::to_owned)
}

fn decimal_string(value: f64) -> String {
    format!("{value:.6}")
}

fn digest_hex(value: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(value.as_bytes());
    hex::encode(hasher.finalize())
}

fn decimal_cell(row: &sqlx::postgres::PgRow, column: &str) -> f64 {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .and_then(|value| value.parse::<f64>().ok())
        .unwrap_or(0.0)
}

fn optional_integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<i64> {
    row.try_get::<Option<i64>, _>(column)
        .ok()
        .flatten()
        .or_else(|| {
            row.try_get::<Option<i32>, _>(column)
                .ok()
                .flatten()
                .map(i64::from)
        })
}

fn required_integer_cell(
    row: &sqlx::postgres::PgRow,
    column: &str,
    field: &str,
) -> DomainResult<i64> {
    optional_integer_cell(row, column).ok_or_else(|| missing_integer_cell_error(field))
}

fn missing_integer_cell_error(field: &str) -> DomainError {
    match field {
        "billing_type" => {
            DomainError::new("missing admin access group billing_type from database row")
        }
        "group_type" => DomainError::new("missing admin access group group_type from database row"),
        "status" => DomainError::new("missing admin access group status from database row"),
        _ => DomainError::new(format!(
            "missing admin access group {field} from database row"
        )),
    }
}

fn row_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    if let sqlx::Error::Database(database_error) = &error {
        if database_error
            .code()
            .map(|code| code == "23505")
            .unwrap_or(false)
        {
            return DomainError::conflict(format!("{context}: access group already exists"));
        }
    }
    DomainError::new(format!("{context}: {error}"))
}
