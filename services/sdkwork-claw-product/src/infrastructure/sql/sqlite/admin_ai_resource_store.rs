use std::collections::HashMap;

use sqlx::{Row, Sqlite, SqlitePool, Transaction};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    AdminAiResourceItem, AdminAiResourceMemberCommand, AdminAiResourceMemberItem,
    AdminAiResourceReadFuture, AdminAiResourceStore, CreateAdminAiResourceCommand,
    ListAdminAiResourcesQuery, UpdateAdminAiResourceCommand,
};

const AI_RESOURCE_TARGET_TYPE: i32 = 91;

#[derive(Debug, Clone)]
pub struct SqliteAdminAiResourceStore {
    pool: SqlitePool,
}

impl SqliteAdminAiResourceStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl AdminAiResourceStore for SqliteAdminAiResourceStore {
    fn list_ai_resources<'a>(
        &'a self,
        query: ListAdminAiResourcesQuery,
    ) -> AdminAiResourceReadFuture<'a, Vec<AdminAiResourceItem>> {
        Box::pin(async move { list_ai_resources(&self.pool, query).await })
    }

    fn create_ai_resource<'a>(
        &'a self,
        command: CreateAdminAiResourceCommand,
    ) -> AdminAiResourceReadFuture<'a, AdminAiResourceItem> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin AI resource transaction", error)
                })?;
            let resource_id = insert_ai_resource(&mut tx, &command).await?;
            replace_members_for_create(&mut tx, resource_id, &command).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_ai_resource",
                resource_id,
                serde_json::json!({
                    "action": "create_ai_resource",
                    "resourceId": resource_id,
                    "resourceCode": &command.resource_code,
                    "resourceType": &command.resource_type,
                    "status": &command.status,
                    "memberCount": command.members.len()
                }),
            )
            .await?;
            let item = load_resource_by_id(
                &mut tx,
                resource_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("created AI resource could not be reloaded"))?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit AI resource transaction", error))?;
            Ok(item)
        })
    }

    fn update_ai_resource<'a>(
        &'a self,
        command: UpdateAdminAiResourceCommand,
    ) -> AdminAiResourceReadFuture<'a, Option<AdminAiResourceItem>> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin AI resource update transaction", error)
            })?;
            let Some(current) = load_resource_by_id(
                &mut tx,
                command.resource_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            else {
                return Ok(None);
            };
            update_ai_resource_core(&mut tx, &command).await?;
            let effective_resource_code = command
                .resource_code
                .as_deref()
                .unwrap_or(current.resource_code.as_str());
            if let Some(members) = command.members.as_ref() {
                replace_members_for_update(
                    &mut tx,
                    &current.resource_code,
                    effective_resource_code,
                    members,
                    &command,
                )
                .await?;
            } else if command.resource_code.is_some()
                && effective_resource_code != current.resource_code.as_str()
            {
                rename_members_for_resource_code(
                    &mut tx,
                    command.resource_id,
                    &current.resource_code,
                    effective_resource_code,
                    &command,
                )
                .await?;
            }
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "update_ai_resource",
                command.resource_id,
                serde_json::json!({
                    "action": "update_ai_resource",
                    "resourceId": command.resource_id,
                    "resourceCodeChanged": command.resource_code.is_some(),
                    "statusChanged": command.status.is_some(),
                    "membersChanged": command.members.is_some()
                }),
            )
            .await?;
            let item = load_resource_by_id(
                &mut tx,
                command.resource_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("updated AI resource could not be reloaded"))?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit AI resource update transaction", error)
            })?;
            Ok(Some(item))
        })
    }
}

async fn list_ai_resources(
    pool: &SqlitePool,
    query: ListAdminAiResourcesQuery,
) -> DomainResult<Vec<AdminAiResourceItem>> {
    let members =
        load_members(pool, query.subject.tenant_id, query.subject.organization_id).await?;
    let rows = sqlx::query(
        r#"
        SELECT
            id,
            resource_code,
            resource_type AS resource_type,
            COALESCE(NULLIF(display_name, ''), resource_code) AS display_name,
            vendor_code,
            modality_code,
            api_code AS api_endpoint_code,
            catalog_key,
            model,
            provider_native_model,
            COALESCE(
                NULLIF(json_extract(COALESCE(resource_schema, '{}'), '$.compositionMode'), ''),
                (
                    SELECT NULLIF(g.selection_mode, '')
                    FROM ai_resource_group g
                    WHERE g.tenant_id = ai_resource.tenant_id
                      AND g.organization_id = ai_resource.organization_id
                      AND g.group_code = ai_resource.resource_code
                      AND g.deleted_at IS NULL
                    LIMIT 1
                ),
                'single'
            ) AS composition_mode,
            status,
            sort_order
        FROM ai_resource
        WHERE tenant_id = ?
          AND organization_id = ?
          AND deleted_at IS NULL
        ORDER BY COALESCE(sort_order, 100000) ASC, id ASC
        LIMIT 1000
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list AI resources", error))?;

    rows.into_iter()
        .map(|row| item_from_row(row, &members))
        .collect()
}

async fn insert_ai_resource(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminAiResourceCommand,
) -> DomainResult<i64> {
    sqlx::query(
        r#"
        INSERT INTO ai_resource
            (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata, resource_code, resource_type, display_name, vendor_code, modality_code, api_code, catalog_key, model, provider_native_model, resource_schema, sort_order)
        VALUES
            (?, ?, ?, 1, ?, ?, ?, 0, '{}', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#,
    )
    .bind(&command.resource_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(status_code(&command.status))
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(&command.resource_code)
    .bind(&command.resource_type)
    .bind(&command.display_name)
    .bind(command.vendor_code.as_deref())
    .bind(command.modality_code.as_deref())
    .bind(command.api_endpoint_code.as_deref())
    .bind(command.catalog_key.as_deref())
    .bind(command.model.as_deref())
    .bind(command.provider_native_model.as_deref())
    .bind(serde_json::json!({ "compositionMode": &command.composition_mode }).to_string())
    .bind(command.sort_order)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create AI resource", error))?;
    last_insert_rowid(tx).await
}

async fn update_ai_resource_core(
    tx: &mut Transaction<'_, Sqlite>,
    command: &UpdateAdminAiResourceCommand,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE ai_resource
        SET resource_code = COALESCE(?, resource_code),
            resource_type = COALESCE(?, resource_type),
            display_name = COALESCE(?, display_name),
            vendor_code = CASE WHEN ? THEN ? ELSE vendor_code END,
            modality_code = CASE WHEN ? THEN ? ELSE modality_code END,
            api_code = CASE WHEN ? THEN ? ELSE api_code END,
            catalog_key = CASE WHEN ? THEN ? ELSE catalog_key END,
            model = CASE WHEN ? THEN ? ELSE model END,
            provider_native_model = CASE WHEN ? THEN ? ELSE provider_native_model END,
            resource_schema = CASE
                WHEN ? IS NULL THEN resource_schema
                ELSE json_set(COALESCE(resource_schema, '{}'), '$.compositionMode', ?)
            END,
            status = COALESCE(?, status),
            sort_order = CASE WHEN ? THEN ? ELSE sort_order END,
            updated_at = ?,
            version = COALESCE(version, 0) + 1
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND deleted_at IS NULL
        "#,
    )
    .bind(command.resource_code.as_deref())
    .bind(command.resource_type.as_deref())
    .bind(command.display_name.as_deref())
    .bind(present_flag(command.vendor_code.is_some()))
    .bind(optional_optional_str(&command.vendor_code))
    .bind(present_flag(command.modality_code.is_some()))
    .bind(optional_optional_str(&command.modality_code))
    .bind(present_flag(command.api_endpoint_code.is_some()))
    .bind(optional_optional_str(&command.api_endpoint_code))
    .bind(present_flag(command.catalog_key.is_some()))
    .bind(optional_optional_str(&command.catalog_key))
    .bind(present_flag(command.model.is_some()))
    .bind(optional_optional_str(&command.model))
    .bind(present_flag(command.provider_native_model.is_some()))
    .bind(optional_optional_str(&command.provider_native_model))
    .bind(command.composition_mode.as_deref())
    .bind(command.composition_mode.as_deref())
    .bind(command.status.as_ref().map(|value| status_code(value)))
    .bind(present_flag(command.sort_order.is_some()))
    .bind(command.sort_order.flatten())
    .bind(&command.requested_at)
    .bind(command.resource_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update AI resource", error))?;
    Ok(())
}

async fn replace_members_for_create(
    tx: &mut Transaction<'_, Sqlite>,
    resource_id: i64,
    command: &CreateAdminAiResourceCommand,
) -> DomainResult<()> {
    insert_members(
        tx,
        resource_id,
        &command.resource_code,
        command.subject.tenant_id,
        command.subject.organization_id,
        &command.requested_at,
        &command.member_uuids,
        &command.members,
    )
    .await
}

async fn replace_members_for_update(
    tx: &mut Transaction<'_, Sqlite>,
    previous_parent_resource_code: &str,
    effective_parent_resource_code: &str,
    members: &[AdminAiResourceMemberCommand],
    command: &UpdateAdminAiResourceCommand,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE ai_resource_group_item
        SET status = -1, deleted_at = ?, deleted_by = ?, updated_at = ?,
            version = COALESCE(version, 0) + 1
        WHERE tenant_id = ?
          AND organization_id = ?
          AND resource_group_code = ?
          AND deleted_at IS NULL
        "#,
    )
    .bind(&command.requested_at)
    .bind(command.subject.operator_id)
    .bind(&command.requested_at)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(previous_parent_resource_code)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to clear AI resource members", error))?;

    insert_members(
        tx,
        command.resource_id,
        effective_parent_resource_code,
        command.subject.tenant_id,
        command.subject.organization_id,
        &command.requested_at,
        &command.member_uuids,
        members,
    )
    .await
}

async fn rename_members_for_resource_code(
    tx: &mut Transaction<'_, Sqlite>,
    _parent_resource_id: i64,
    previous_parent_resource_code: &str,
    effective_parent_resource_code: &str,
    command: &UpdateAdminAiResourceCommand,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE ai_resource_group_item
        SET resource_group_code = ?, updated_at = ?,
            version = COALESCE(version, 0) + 1
        WHERE tenant_id = ?
          AND organization_id = ?
          AND resource_group_code = ?
          AND deleted_at IS NULL
        "#,
    )
    .bind(effective_parent_resource_code)
    .bind(&command.requested_at)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(previous_parent_resource_code)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to rename AI resource members", error))?;
    sqlx::query(
        r#"
        UPDATE ai_resource_group
        SET group_code = ?, updated_at = ?,
            version = COALESCE(version, 0) + 1
        WHERE tenant_id = ?
          AND organization_id = ?
          AND group_code = ?
          AND deleted_at IS NULL
        "#,
    )
    .bind(effective_parent_resource_code)
    .bind(&command.requested_at)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(previous_parent_resource_code)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to rename resource group", error))?;
    Ok(())
}

async fn insert_members(
    tx: &mut Transaction<'_, Sqlite>,
    parent_resource_id: i64,
    parent_resource_code: &str,
    tenant_id: i64,
    organization_id: i64,
    requested_at: &str,
    member_uuids: &[String],
    members: &[AdminAiResourceMemberCommand],
) -> DomainResult<()> {
    if members.is_empty() {
        return Ok(());
    }
    let group_id = ensure_resource_group(
        tx,
        parent_resource_id,
        parent_resource_code,
        tenant_id,
        organization_id,
        requested_at,
        "all",
    )
    .await?;
    for (index, member) in members.iter().enumerate() {
        let uuid = member_uuids
            .get(index)
            .cloned()
            .unwrap_or_else(|| format!("{parent_resource_code}-member-{index}"));
        sqlx::query(
            r#"
            INSERT INTO ai_resource_group_item
                (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata, resource_group_id, resource_group_code, item_type, resource_id, resource_code, child_resource_group_id, child_resource_group_code, item_role, sort_order)
            VALUES
                (?, ?, ?, 1, 1, ?, ?, 0, ?, ?, ?, 'resource', (
                    SELECT id
                    FROM ai_resource
                    WHERE tenant_id = ?
                      AND organization_id = ?
                      AND resource_code = ?
                      AND deleted_at IS NULL
                    LIMIT 1
                ), ?, NULL, '', ?, ?)
            ON CONFLICT(tenant_id, organization_id, resource_group_id, item_type, resource_code, child_resource_group_code) DO UPDATE SET
                status = 1,
                deleted_at = NULL,
                deleted_by = NULL,
                updated_at = excluded.updated_at,
                metadata = excluded.metadata,
                resource_id = excluded.resource_id,
                item_role = excluded.item_role,
                sort_order = excluded.sort_order,
                version = COALESCE(ai_resource_group_item.version, 0) + 1
            "#,
        )
        .bind(uuid)
        .bind(tenant_id)
        .bind(organization_id)
        .bind(requested_at)
        .bind(requested_at)
        .bind(serde_json::json!({ "required": member.required }).to_string())
        .bind(group_id)
        .bind(parent_resource_code)
        .bind(tenant_id)
        .bind(organization_id)
        .bind(&member.member_resource_code)
        .bind(&member.member_resource_code)
        .bind(&member.member_role)
        .bind(member.sort_order)
        .execute(&mut **tx)
        .await
        .map_err(|error| store_error("failed to upsert AI resource member", error))?;
    }
    Ok(())
}

async fn ensure_resource_group(
    tx: &mut Transaction<'_, Sqlite>,
    resource_id: i64,
    resource_code: &str,
    tenant_id: i64,
    organization_id: i64,
    requested_at: &str,
    composition_mode: &str,
) -> DomainResult<i64> {
    let group_uuid = format!("ai-resource-group-{resource_id}");
    if let Some(group_id) = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT id
        FROM ai_resource_group
        WHERE tenant_id = ?
          AND organization_id = ?
          AND group_code = ?
          AND deleted_at IS NULL
        LIMIT 1
        "#,
    )
    .bind(tenant_id)
    .bind(organization_id)
    .bind(resource_code)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load resource group", error))?
    {
        return Ok(group_id);
    }

    sqlx::query(
        r#"
        UPDATE ai_resource_group
        SET group_code = ?,
            group_name = COALESCE((
                SELECT NULLIF(display_name, '')
                FROM ai_resource r
                WHERE r.id = ?
                  AND r.tenant_id = ai_resource_group.tenant_id
                  AND r.organization_id = ai_resource_group.organization_id
                  AND r.deleted_at IS NULL
                LIMIT 1
            ), ?),
            selection_mode = COALESCE(NULLIF(selection_mode, ''), ?),
            status = 1,
            deleted_at = NULL,
            deleted_by = NULL,
            updated_at = ?,
            version = COALESCE(version, 0) + 1
        WHERE uuid = ?
          AND tenant_id = ?
          AND organization_id = ?
        "#,
    )
    .bind(resource_code)
    .bind(resource_id)
    .bind(resource_code)
    .bind(composition_mode)
    .bind(requested_at)
    .bind(&group_uuid)
    .bind(tenant_id)
    .bind(organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update resource group", error))?;
    if let Some(group_id) = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT id
        FROM ai_resource_group
        WHERE uuid = ?
          AND tenant_id = ?
          AND organization_id = ?
        LIMIT 1
        "#,
    )
    .bind(&group_uuid)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to reload resource group", error))?
    {
        return Ok(group_id);
    }

    sqlx::query(
        r#"
        INSERT INTO ai_resource_group
            (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata, group_code, group_name, group_type, selection_mode, sort_order)
        SELECT
            ?,
            tenant_id,
            organization_id,
            data_scope,
            status,
            ?,
            ?,
            0,
            '{}',
            resource_code,
            COALESCE(NULLIF(display_name, ''), resource_code),
            resource_type,
            ?,
            sort_order
        FROM ai_resource
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND deleted_at IS NULL
        "#,
    )
    .bind(group_uuid)
    .bind(requested_at)
    .bind(requested_at)
    .bind(composition_mode)
    .bind(resource_id)
    .bind(tenant_id)
    .bind(organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create resource group", error))?;

    sqlx::query_scalar("SELECT last_insert_rowid()")
        .fetch_one(&mut **tx)
        .await
        .map_err(|error| store_error("failed to read resource group id", error))
}

async fn load_resource_by_id(
    tx: &mut Transaction<'_, Sqlite>,
    resource_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminAiResourceItem>> {
    let members = load_members_tx(tx, tenant_id, organization_id).await?;
    let row = sqlx::query(
        r#"
        SELECT
            id,
            resource_code,
            resource_type AS resource_type,
            COALESCE(NULLIF(display_name, ''), resource_code) AS display_name,
            vendor_code,
            modality_code,
            api_code AS api_endpoint_code,
            catalog_key,
            model,
            provider_native_model,
            COALESCE(
                NULLIF(json_extract(COALESCE(resource_schema, '{}'), '$.compositionMode'), ''),
                (
                    SELECT NULLIF(g.selection_mode, '')
                    FROM ai_resource_group g
                    WHERE g.tenant_id = ai_resource.tenant_id
                      AND g.organization_id = ai_resource.organization_id
                      AND g.group_code = ai_resource.resource_code
                      AND g.deleted_at IS NULL
                    LIMIT 1
                ),
                'single'
            ) AS composition_mode,
            status,
            sort_order
        FROM ai_resource
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND deleted_at IS NULL
        LIMIT 1
        "#,
    )
    .bind(resource_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load AI resource", error))?;

    row.map(|row| item_from_row(row, &members)).transpose()
}

async fn load_members(
    pool: &SqlitePool,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<HashMap<String, Vec<AdminAiResourceMemberItem>>> {
    let rows = sqlx::query(
        r#"
        SELECT
            resource_group_code AS parent_resource_code,
            resource_code AS member_resource_code,
            COALESCE(NULLIF(item_role, ''), 'included') AS member_role,
            COALESCE(json_extract(COALESCE(metadata, '{}'), '$.required'), 1) AS required,
            sort_order
        FROM ai_resource_group_item
        WHERE tenant_id = ?
          AND organization_id = ?
          AND deleted_at IS NULL
          AND status = 1
        ORDER BY resource_group_code ASC, COALESCE(sort_order, 100000) ASC, id ASC
        "#,
    )
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list AI resource members", error))?;

    members_from_rows(rows)
}

async fn load_members_tx(
    tx: &mut Transaction<'_, Sqlite>,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<HashMap<String, Vec<AdminAiResourceMemberItem>>> {
    let rows = sqlx::query(
        r#"
        SELECT
            resource_group_code AS parent_resource_code,
            resource_code AS member_resource_code,
            COALESCE(NULLIF(item_role, ''), 'included') AS member_role,
            COALESCE(json_extract(COALESCE(metadata, '{}'), '$.required'), 1) AS required,
            sort_order
        FROM ai_resource_group_item
        WHERE tenant_id = ?
          AND organization_id = ?
          AND deleted_at IS NULL
          AND status = 1
        ORDER BY resource_group_code ASC, COALESCE(sort_order, 100000) ASC, id ASC
        "#,
    )
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_all(&mut **tx)
    .await
    .map_err(|error| store_error("failed to list AI resource members", error))?;

    members_from_rows(rows)
}

fn members_from_rows(
    rows: Vec<sqlx::sqlite::SqliteRow>,
) -> DomainResult<HashMap<String, Vec<AdminAiResourceMemberItem>>> {
    let mut members = HashMap::<String, Vec<AdminAiResourceMemberItem>>::new();
    for row in rows {
        let parent_resource_code: String =
            row.try_get("parent_resource_code").map_err(row_error)?;
        members
            .entry(parent_resource_code.clone())
            .or_default()
            .push(AdminAiResourceMemberItem {
                parent_resource_code,
                member_resource_code: row.try_get("member_resource_code").map_err(row_error)?,
                member_role: row.try_get("member_role").map_err(row_error)?,
                required: row
                    .try_get::<i64, _>("required")
                    .map(|value| value != 0)
                    .map_err(row_error)?,
                sort_order: row.try_get("sort_order").ok().flatten(),
            });
    }
    Ok(members)
}

fn item_from_row(
    row: sqlx::sqlite::SqliteRow,
    members: &HashMap<String, Vec<AdminAiResourceMemberItem>>,
) -> DomainResult<AdminAiResourceItem> {
    let resource_code: String = row.try_get("resource_code").map_err(row_error)?;
    let status: i64 = row.try_get("status").map_err(row_error)?;
    Ok(AdminAiResourceItem {
        id: row.try_get("id").map_err(row_error)?,
        resource_code: resource_code.clone(),
        resource_type: row.try_get("resource_type").map_err(row_error)?,
        display_name: row.try_get("display_name").map_err(row_error)?,
        vendor_code: optional_string_cell(&row, "vendor_code"),
        modality_code: optional_string_cell(&row, "modality_code"),
        api_endpoint_code: optional_string_cell(&row, "api_endpoint_code"),
        catalog_key: optional_string_cell(&row, "catalog_key"),
        model: optional_string_cell(&row, "model"),
        provider_native_model: optional_string_cell(&row, "provider_native_model"),
        composition_mode: row.try_get("composition_mode").map_err(row_error)?,
        status: status_label(status),
        sort_order: row.try_get("sort_order").ok().flatten(),
        members: members.get(&resource_code).cloned().unwrap_or_default(),
    })
}

fn optional_string_cell(row: &sqlx::sqlite::SqliteRow, name: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(name)
        .ok()
        .flatten()
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
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

fn present_flag(is_present: bool) -> i32 {
    if is_present {
        1
    } else {
        0
    }
}

fn optional_optional_str(value: &Option<Option<String>>) -> Option<&str> {
    value.as_ref().and_then(|inner| inner.as_deref())
}

async fn last_insert_rowid(tx: &mut Transaction<'_, Sqlite>) -> DomainResult<i64> {
    sqlx::query_scalar("SELECT last_insert_rowid()")
        .fetch_one(&mut **tx)
        .await
        .map_err(|error| store_error("failed to read inserted AI resource id", error))
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
    .bind(AI_RESOURCE_TARGET_TYPE)
    .bind(target_id)
    .bind(request_id)
    .bind(operator_id)
    .bind(operator_type)
    .bind(change_summary.to_string())
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to write AI resource audit log", error))?;
    Ok(())
}

fn row_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    if let sqlx::Error::Database(database_error) = &error {
        let message = database_error.message().to_ascii_lowercase();
        if message.contains("unique") || message.contains("duplicate") {
            return DomainError::conflict(format!(
                "{context}: AI resource already exists ({})",
                database_error.message()
            ));
        }
    }
    DomainError::new(format!("{context}: {error}"))
}
