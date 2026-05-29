use sqlx::{PgPool, Postgres, Row, Transaction};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    AdminChannelEndpointFuture, AdminChannelEndpointItem, AdminChannelEndpointStore,
    CreateAdminChannelEndpointCommand, ListAdminChannelEndpointsQuery,
    UpdateAdminChannelEndpointCommand,
};

const CHANNEL_ENDPOINT_TARGET_TYPE: i32 = 92;

#[derive(Debug, Clone)]
pub struct PostgresAdminChannelEndpointStore {
    pool: PgPool,
}

impl PostgresAdminChannelEndpointStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl AdminChannelEndpointStore for PostgresAdminChannelEndpointStore {
    fn list_channel_endpoints<'a>(
        &'a self,
        query: ListAdminChannelEndpointsQuery,
    ) -> AdminChannelEndpointFuture<'a, Vec<AdminChannelEndpointItem>> {
        Box::pin(async move { list_channel_endpoints(&self.pool, query).await })
    }

    fn create_channel_endpoint<'a>(
        &'a self,
        command: CreateAdminChannelEndpointCommand,
    ) -> AdminChannelEndpointFuture<'a, Option<AdminChannelEndpointItem>> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin channel endpoint transaction", error)
            })?;
            let Some(endpoint_id) = insert_channel_endpoint(&mut tx, &command).await? else {
                return Ok(None);
            };
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_channel_endpoint",
                endpoint_id,
                serde_json::json!({
                    "action": "create_channel_endpoint",
                    "endpointId": endpoint_id,
                    "channelId": command.channel_id,
                    "vendorCode": &command.vendor_code,
                    "regionCode": &command.region_code,
                    "apiEndpointCode": &command.api_endpoint_code,
                    "status": &command.status
                }),
            )
            .await?;
            let item = load_endpoint_by_id(
                &mut tx,
                endpoint_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("created channel endpoint could not be reloaded"))?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit channel endpoint transaction", error)
            })?;
            Ok(Some(item))
        })
    }

    fn update_channel_endpoint<'a>(
        &'a self,
        command: UpdateAdminChannelEndpointCommand,
    ) -> AdminChannelEndpointFuture<'a, Option<AdminChannelEndpointItem>> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin channel endpoint update transaction", error)
            })?;
            let Some(_) = load_endpoint_by_id(
                &mut tx,
                command.endpoint_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            else {
                return Ok(None);
            };
            update_channel_endpoint_core(&mut tx, &command).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "update_channel_endpoint",
                command.endpoint_id,
                serde_json::json!({
                    "action": "update_channel_endpoint",
                    "endpointId": command.endpoint_id,
                    "vendorCodeChanged": command.vendor_code.is_some(),
                    "regionCodeChanged": command.region_code.is_some(),
                    "apiEndpointCodeChanged": command.api_endpoint_code.is_some(),
                    "baseUrlChanged": command.base_url.is_some(),
                    "statusChanged": command.status.is_some()
                }),
            )
            .await?;
            let item = load_endpoint_by_id(
                &mut tx,
                command.endpoint_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("updated channel endpoint could not be reloaded"))?;
            tx.commit().await.map_err(|error| {
                store_error(
                    "failed to commit channel endpoint update transaction",
                    error,
                )
            })?;
            Ok(Some(item))
        })
    }
}

async fn list_channel_endpoints(
    pool: &PgPool,
    query: ListAdminChannelEndpointsQuery,
) -> DomainResult<Vec<AdminChannelEndpointItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            id,
            channel_id AS channel_id,
            provider_code,
            channel_code AS channel_code,
            COALESCE(NULLIF(channel_type, ''), 'official') AS channel_type,
            vendor_code,
            region_code,
            api_code AS api_endpoint_code,
            base_url,
            COALESCE(priority, 100) AS priority,
            COALESCE(weight, 100) AS weight,
            COALESCE(health_status, 1) AS health_status,
            status,
            effective_from::text AS effective_from,
            effective_to::text AS effective_to
        FROM ai_channel_endpoint
        WHERE tenant_id = $1
          AND organization_id = $2
          AND deleted_at IS NULL
        ORDER BY provider_code ASC, channel_code ASC, vendor_code ASC, region_code ASC, api_endpoint_code ASC, id ASC
        LIMIT 2000
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list channel endpoints", error))?;

    rows.into_iter().map(item_from_row).collect()
}

async fn insert_channel_endpoint(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAdminChannelEndpointCommand,
) -> DomainResult<Option<i64>> {
    sqlx::query_scalar(
        r#"
        INSERT INTO ai_channel_endpoint
            (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata,
             channel_id, provider_code, channel_code, channel_type, vendor_id, vendor_code,
             region_code, api_endpoint_id, api_code, base_url, priority, weight, health_status,
             effective_from, effective_to)
        SELECT
            $1, a.tenant_id, a.organization_id, 1, $2, $3, $4, 0, '{}'::jsonb,
            a.id,
            a.provider_code,
            COALESCE(NULLIF(a.channel_code, ''), a.provider_code || '-' || a.id::text),
            COALESCE(NULLIF(a.channel_type, ''), 'official'),
            (
                SELECT v.id
                FROM ai_model_vendor v
                WHERE v.tenant_id = a.tenant_id
                  AND v.organization_id = a.organization_id
                  AND v.vendor_code = $5
                  AND v.deleted_at IS NULL
                LIMIT 1
            ),
            $6,
            $7,
            (
                SELECT e.id
                FROM ai_api_endpoint e
                WHERE e.tenant_id = a.tenant_id
                  AND e.organization_id = a.organization_id
                  AND e.endpoint_code = $8
                  AND e.deleted_at IS NULL
                LIMIT 1
            ),
            $9,
            $10,
            $11,
            $12,
            1,
            $13,
            $14
        FROM ai_channel a
        WHERE a.id = $15
          AND a.tenant_id = $16
          AND a.organization_id = $17
          AND a.deleted_at IS NULL
        RETURNING id
        "#,
    )
    .bind(&command.endpoint_uuid)
    .bind(status_code(&command.status))
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(&command.vendor_code)
    .bind(&command.vendor_code)
    .bind(&command.region_code)
    .bind(&command.api_endpoint_code)
    .bind(&command.api_endpoint_code)
    .bind(&command.base_url)
    .bind(command.priority)
    .bind(command.weight)
    .bind(command.effective_from.as_deref())
    .bind(command.effective_to.as_deref())
    .bind(command.channel_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create channel endpoint", error))
}

async fn update_channel_endpoint_core(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateAdminChannelEndpointCommand,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE ai_channel_endpoint
        SET vendor_code = COALESCE($1, vendor_code),
            vendor_id = CASE WHEN $2 THEN (
                SELECT v.id
                FROM ai_model_vendor v
                WHERE v.tenant_id = ai_channel_endpoint.tenant_id
                  AND v.organization_id = ai_channel_endpoint.organization_id
                  AND v.vendor_code = $3
                  AND v.deleted_at IS NULL
                LIMIT 1
            ) ELSE vendor_id END,
            region_code = COALESCE($4, region_code),
            api_code = COALESCE($5, api_code),
            api_endpoint_id = CASE WHEN $6 THEN (
                SELECT e.id
                FROM ai_api_endpoint e
                WHERE e.tenant_id = ai_channel_endpoint.tenant_id
                  AND e.organization_id = ai_channel_endpoint.organization_id
                  AND e.endpoint_code = $7
                  AND e.deleted_at IS NULL
                LIMIT 1
            ) ELSE api_endpoint_id END,
            base_url = COALESCE($8, base_url),
            priority = COALESCE($9, priority),
            weight = COALESCE($10, weight),
            status = COALESCE($11, status),
            effective_from = CASE WHEN $12 THEN $13 ELSE effective_from END,
            effective_to = CASE WHEN $14 THEN $15 ELSE effective_to END,
            updated_at = $16,
            version = COALESCE(version, 0) + 1
        WHERE id = $17
          AND tenant_id = $18
          AND organization_id = $19
          AND deleted_at IS NULL
        "#,
    )
    .bind(command.vendor_code.as_deref())
    .bind(command.vendor_code.is_some())
    .bind(command.vendor_code.as_deref())
    .bind(command.region_code.as_deref())
    .bind(command.api_endpoint_code.as_deref())
    .bind(command.api_endpoint_code.is_some())
    .bind(command.api_endpoint_code.as_deref())
    .bind(command.base_url.as_deref())
    .bind(command.priority)
    .bind(command.weight)
    .bind(command.status.as_ref().map(|value| status_code(value)))
    .bind(command.effective_from.is_some())
    .bind(
        command
            .effective_from
            .as_ref()
            .and_then(|value| value.as_deref()),
    )
    .bind(command.effective_to.is_some())
    .bind(
        command
            .effective_to
            .as_ref()
            .and_then(|value| value.as_deref()),
    )
    .bind(&command.requested_at)
    .bind(command.endpoint_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update channel endpoint", error))?;
    Ok(())
}

async fn load_endpoint_by_id(
    tx: &mut Transaction<'_, Postgres>,
    endpoint_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminChannelEndpointItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            id,
            channel_id AS channel_id,
            provider_code,
            channel_code AS channel_code,
            COALESCE(NULLIF(channel_type, ''), 'official') AS channel_type,
            vendor_code,
            region_code,
            api_code AS api_endpoint_code,
            base_url,
            COALESCE(priority, 100) AS priority,
            COALESCE(weight, 100) AS weight,
            COALESCE(health_status, 1) AS health_status,
            status,
            effective_from::text AS effective_from,
            effective_to::text AS effective_to
        FROM ai_channel_endpoint
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
          AND deleted_at IS NULL
        LIMIT 1
        "#,
    )
    .bind(endpoint_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load channel endpoint", error))?;

    row.map(item_from_row).transpose()
}

fn item_from_row(row: sqlx::postgres::PgRow) -> DomainResult<AdminChannelEndpointItem> {
    let status: i64 = row.try_get("status").map_err(row_error)?;
    let health_status: i64 = row.try_get("health_status").map_err(row_error)?;
    Ok(AdminChannelEndpointItem {
        id: row.try_get("id").map_err(row_error)?,
        channel_id: row.try_get("channel_id").map_err(row_error)?,
        provider_code: row.try_get("provider_code").map_err(row_error)?,
        channel_code: row.try_get("channel_code").map_err(row_error)?,
        channel_type: row.try_get("channel_type").map_err(row_error)?,
        vendor_code: row.try_get("vendor_code").map_err(row_error)?,
        region_code: row.try_get("region_code").map_err(row_error)?,
        api_endpoint_code: row.try_get("api_endpoint_code").map_err(row_error)?,
        base_url: row.try_get("base_url").map_err(row_error)?,
        priority: row.try_get("priority").map_err(row_error)?,
        weight: row.try_get("weight").map_err(row_error)?,
        health_status: health_status_label(health_status)?,
        status: status_label(status),
        effective_from: optional_string_cell(&row, "effective_from"),
        effective_to: optional_string_cell(&row, "effective_to"),
    })
}

fn status_label(status: i64) -> String {
    match status {
        1 => "active",
        0 => "disabled",
        _ => "inactive",
    }
    .to_owned()
}

fn status_code(status: &str) -> i32 {
    match status {
        "disabled" => 0,
        "inactive" => -1,
        _ => 1,
    }
}

fn health_status_label(status: i64) -> DomainResult<String> {
    match status {
        1 => Ok("healthy".to_owned()),
        2 => Ok("unhealthy".to_owned()),
        0 => Ok("unknown".to_owned()),
        value => Err(DomainError::new(format!(
            "invalid channel endpoint health_status from database row: {value}"
        ))),
    }
}

fn optional_string_cell(row: &sqlx::postgres::PgRow, name: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(name)
        .ok()
        .flatten()
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
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
    .bind(CHANNEL_ENDPOINT_TARGET_TYPE)
    .bind(target_id)
    .bind(request_id)
    .bind(operator_id)
    .bind(operator_type)
    .bind(change_summary.to_string())
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to write channel endpoint audit log", error))?;
    Ok(())
}

fn row_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    if let sqlx::Error::Database(database_error) = &error {
        let message = database_error.message().to_ascii_lowercase();
        if message.contains("unique") || message.contains("duplicate") {
            return DomainError::conflict(format!("{context}: channel endpoint already exists"));
        }
    }
    DomainError::new(format!("{context}: {error}"))
}
