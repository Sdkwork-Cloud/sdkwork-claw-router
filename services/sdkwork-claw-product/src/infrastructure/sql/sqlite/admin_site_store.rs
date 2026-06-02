use sqlx::{Row, SqlitePool};

use crate::domain::{DomainError, DomainResult};
use crate::infrastructure::sql::sql_admin_product_center::{
    media_resource_object_blob_id, media_resource_stable_id,
};
use crate::infrastructure::sql::sql_admin_site::{
    default_site_service_code, health_status_label, site_environment_code, site_environment_label,
    site_status_code, site_status_label,
};
use crate::ports::{
    AdminSiteChannelItem, AdminSiteConnectionCheckItem, AdminSiteFuture, AdminSiteItem,
    AdminSiteModelCommand, AdminSiteModelItem, AdminSiteStore, CreateAdminSiteCommand,
    CreateAdminSiteModelCommand, DeleteAdminSiteCommand, DeleteAdminSiteModelCommand,
    ListAdminSiteChannelsQuery, ListAdminSiteModelsQuery, ListAdminSitesQuery,
    ReplaceAdminSiteModelsCommand, TestAdminSiteConnectionCommand, UpdateAdminSiteCommand,
    UpdateAdminSiteModelCommand,
};

const SITE_TARGET_TYPE: i32 = 93;
const SITE_MODEL_TARGET_TYPE: i32 = 94;

#[derive(Debug, Clone)]
pub struct SqliteAdminSiteStore {
    pool: SqlitePool,
}

impl SqliteAdminSiteStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl AdminSiteStore for SqliteAdminSiteStore {
    fn list_sites<'a>(
        &'a self,
        query: ListAdminSitesQuery,
    ) -> AdminSiteFuture<'a, Vec<AdminSiteItem>> {
        Box::pin(async move { list_sites(&self.pool, query).await })
    }

    fn create_site<'a>(
        &'a self,
        command: CreateAdminSiteCommand,
    ) -> AdminSiteFuture<'a, AdminSiteItem> {
        Box::pin(async move { create_site(&self.pool, command).await })
    }

    fn update_site<'a>(
        &'a self,
        command: UpdateAdminSiteCommand,
    ) -> AdminSiteFuture<'a, Option<AdminSiteItem>> {
        Box::pin(async move { update_site(&self.pool, command).await })
    }

    fn delete_site<'a>(&'a self, command: DeleteAdminSiteCommand) -> AdminSiteFuture<'a, bool> {
        Box::pin(async move { delete_site(&self.pool, command).await })
    }

    fn list_site_models<'a>(
        &'a self,
        query: ListAdminSiteModelsQuery,
    ) -> AdminSiteFuture<'a, Vec<AdminSiteModelItem>> {
        Box::pin(async move { list_site_models(&self.pool, query).await })
    }

    fn create_site_model<'a>(
        &'a self,
        command: CreateAdminSiteModelCommand,
    ) -> AdminSiteFuture<'a, AdminSiteModelItem> {
        Box::pin(async move { create_site_model(&self.pool, command).await })
    }

    fn replace_site_models<'a>(
        &'a self,
        command: ReplaceAdminSiteModelsCommand,
    ) -> AdminSiteFuture<'a, Vec<AdminSiteModelItem>> {
        Box::pin(async move { replace_site_models(&self.pool, command).await })
    }

    fn update_site_model<'a>(
        &'a self,
        command: UpdateAdminSiteModelCommand,
    ) -> AdminSiteFuture<'a, Option<AdminSiteModelItem>> {
        Box::pin(async move { update_site_model(&self.pool, command).await })
    }

    fn delete_site_model<'a>(
        &'a self,
        command: DeleteAdminSiteModelCommand,
    ) -> AdminSiteFuture<'a, bool> {
        Box::pin(async move { delete_site_model(&self.pool, command).await })
    }

    fn list_site_channels<'a>(
        &'a self,
        query: ListAdminSiteChannelsQuery,
    ) -> AdminSiteFuture<'a, Vec<AdminSiteChannelItem>> {
        Box::pin(async move { list_site_channels(&self.pool, query).await })
    }

    fn test_site_connection<'a>(
        &'a self,
        command: TestAdminSiteConnectionCommand,
    ) -> AdminSiteFuture<'a, AdminSiteConnectionCheckItem> {
        Box::pin(async move { test_site_connection(&self.pool, command).await })
    }
}

async fn list_sites(
    pool: &SqlitePool,
    query: ListAdminSitesQuery,
) -> DomainResult<Vec<AdminSiteItem>> {
    let search = query.search.as_ref().map(|value| format!("%{}%", value));
    let rows = sqlx::query(
        r#"
        SELECT id, site_code, site_name, display_name, description, COALESCE(base_url, '') AS base_url,
               website_url, docs_url, CAST(logo_resource_snapshot AS TEXT) AS logo_resource_snapshot,
               COALESCE(metadata, '{}') AS metadata, site_type, owner_kind, region_code, environment, health_status,
               last_latency_ms, consecutive_error_count, last_checked_at, last_sync_at, sort_order, status
        FROM ai_site
        WHERE tenant_id = ? AND organization_id = ? AND deleted_at IS NULL
          AND (? IS NULL OR site_code LIKE ? OR site_name LIKE ? OR display_name LIKE ?)
        ORDER BY sort_order ASC, id ASC
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(search.as_deref())
    .bind(search.as_deref())
    .bind(search.as_deref())
    .bind(search.as_deref())
    .fetch_all(pool)
    .await
    .map_err(store_error)?;
    Ok(rows.into_iter().map(site_from_row).collect())
}

async fn create_site(
    pool: &SqlitePool,
    command: CreateAdminSiteCommand,
) -> DomainResult<AdminSiteItem> {
    let mut tx = pool.begin().await.map_err(store_error)?;
    let service_code = default_site_service_code(&command.site_code);
    let status = site_status_code(&command.status);
    let environment = site_environment_code(&command.environment);
    let logo = command.logo.as_ref();
    let logo_media_resource_id = logo.map(media_resource_stable_id);
    let logo_object_blob_id = logo.and_then(media_resource_object_blob_id);
    let logo_resource_snapshot = logo.map(serde_json::Value::to_string);
    let metadata = site_metadata_json(&command.domains, &command.vendor_codes)?;
    let site_id = sqlx::query(
        r#"
        INSERT INTO ai_site (
            uuid, tenant_id, organization_id, status, site_code, site_name, display_name,
            description, base_url, website_url, docs_url, logo_media_resource_id,
            logo_object_blob_id, logo_resource_snapshot, metadata, site_type, owner_kind,
            region_code, environment, health_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        "#,
    )
    .bind(&command.site_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(status)
    .bind(&command.site_code)
    .bind(&command.site_name)
    .bind(&command.display_name)
    .bind(&command.description)
    .bind(&command.base_url)
    .bind(&command.website_url)
    .bind(&command.docs_url)
    .bind(&logo_media_resource_id)
    .bind(logo_object_blob_id)
    .bind(&logo_resource_snapshot)
    .bind(&metadata)
    .bind(&command.site_type)
    .bind(&command.owner_kind)
    .bind(&command.region_code)
    .bind(environment)
    .execute(&mut *tx)
    .await
    .map_err(conflict_or_store_error)?
    .last_insert_rowid();
    sqlx::query(
        r#"
        INSERT INTO ai_site_service (
            uuid, tenant_id, organization_id, status, site_id, site_code, service_code, service_name,
            service_type, protocol_code, base_url, credential_ref, masked_label, region_code,
            environment, health_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ai_model_relay', 'openai_compatible', ?, ?, ?, ?, ?, 1)
        "#,
    )
    .bind(&command.service_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(status)
    .bind(site_id)
    .bind(&command.site_code)
    .bind(&service_code)
    .bind(format!("{} AI model relay", command.display_name))
    .bind(&command.base_url)
    .bind(&command.credential_ref)
    .bind(&command.masked_label)
    .bind(&command.region_code)
    .bind(environment)
    .execute(&mut *tx)
    .await
    .map_err(conflict_or_store_error)?;
    insert_audit(
        &mut tx,
        &command.audit_log_uuid,
        &command.request_id,
        command.subject.tenant_id,
        command.subject.organization_id,
        command.subject.operator_id,
        command.subject.operator_type,
        "create_site",
        site_id,
        &command.requested_at,
    )
    .await?;
    tx.commit().await.map_err(store_error)?;
    load_site(
        pool,
        command.subject.tenant_id,
        command.subject.organization_id,
        site_id,
    )
    .await?
    .ok_or_else(|| DomainError::new("created site could not be reloaded"))
}

async fn update_site(
    pool: &SqlitePool,
    command: UpdateAdminSiteCommand,
) -> DomainResult<Option<AdminSiteItem>> {
    let Some(mut current) = load_site(
        pool,
        command.subject.tenant_id,
        command.subject.organization_id,
        command.site_id,
    )
    .await?
    else {
        return Ok(None);
    };
    let site_code = command
        .site_code
        .unwrap_or_else(|| current.site_code.clone());
    let site_name = command
        .site_name
        .unwrap_or_else(|| current.site_name.clone());
    let display_name = command
        .display_name
        .unwrap_or_else(|| current.display_name.clone());
    let description = command.description.unwrap_or(current.description.take());
    let base_url = command.base_url.unwrap_or_else(|| current.base_url.clone());
    let website_url = command.website_url.unwrap_or(current.website_url.take());
    let docs_url = command.docs_url.unwrap_or(current.docs_url.take());
    let logo = command.logo.unwrap_or(current.logo.take());
    let domains = command.domains.unwrap_or(current.domains);
    let vendor_codes = command.vendor_codes.unwrap_or(current.vendor_codes);
    let site_type = command
        .site_type
        .unwrap_or_else(|| current.site_type.clone());
    let owner_kind = command.owner_kind.unwrap_or(current.owner_kind.take());
    let region_code = command.region_code.unwrap_or(current.region_code.take());
    let environment = site_environment_code(&command.environment.unwrap_or(current.environment));
    let status = site_status_code(&command.status.unwrap_or(current.status));
    let logo_ref = logo.as_ref();
    let logo_media_resource_id = logo_ref.map(media_resource_stable_id);
    let logo_object_blob_id = logo_ref.and_then(media_resource_object_blob_id);
    let logo_resource_snapshot = logo_ref.map(serde_json::Value::to_string);
    let metadata = site_metadata_json(&domains, &vendor_codes)?;
    let mut tx = pool.begin().await.map_err(store_error)?;
    sqlx::query(
        r#"
        UPDATE ai_site
        SET site_code = ?, site_name = ?, display_name = ?, description = ?, base_url = ?,
            website_url = ?, docs_url = ?, logo_media_resource_id = ?, logo_object_blob_id = ?,
            logo_resource_snapshot = ?, metadata = ?, site_type = ?, owner_kind = ?, region_code = ?,
            environment = ?, status = ?, updated_at = CURRENT_TIMESTAMP, version = version + 1
        WHERE tenant_id = ? AND organization_id = ? AND id = ? AND deleted_at IS NULL
        "#,
    )
    .bind(&site_code)
    .bind(&site_name)
    .bind(&display_name)
    .bind(&description)
    .bind(&base_url)
    .bind(&website_url)
    .bind(&docs_url)
    .bind(&logo_media_resource_id)
    .bind(logo_object_blob_id)
    .bind(&logo_resource_snapshot)
    .bind(&metadata)
    .bind(&site_type)
    .bind(&owner_kind)
    .bind(&region_code)
    .bind(environment)
    .bind(status)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.site_id)
    .execute(&mut *tx)
    .await
    .map_err(conflict_or_store_error)?;
    sqlx::query(
        r#"
        UPDATE ai_site_service
        SET site_code = ?, service_name = ?, base_url = ?, region_code = ?, environment = ?,
            status = ?, credential_ref = COALESCE(?, credential_ref),
            masked_label = COALESCE(?, masked_label), updated_at = CURRENT_TIMESTAMP, version = version + 1
        WHERE tenant_id = ? AND organization_id = ? AND site_id = ? AND deleted_at IS NULL
        "#,
    )
    .bind(&site_code)
    .bind(format!("{display_name} AI model relay"))
    .bind(&base_url)
    .bind(&region_code)
    .bind(environment)
    .bind(status)
    .bind(command.credential_ref.flatten())
    .bind(command.masked_label.flatten())
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.site_id)
    .execute(&mut *tx)
    .await
    .map_err(store_error)?;
    insert_audit(
        &mut tx,
        &command.audit_log_uuid,
        &command.request_id,
        command.subject.tenant_id,
        command.subject.organization_id,
        command.subject.operator_id,
        command.subject.operator_type,
        "update_site",
        command.site_id,
        &command.requested_at,
    )
    .await?;
    tx.commit().await.map_err(store_error)?;
    load_site(
        pool,
        command.subject.tenant_id,
        command.subject.organization_id,
        command.site_id,
    )
    .await
}

async fn delete_site(pool: &SqlitePool, command: DeleteAdminSiteCommand) -> DomainResult<bool> {
    let mut tx = pool.begin().await.map_err(store_error)?;
    let bound_channels: i64 = sqlx::query_scalar("SELECT COUNT(1) FROM ai_channel WHERE tenant_id = ? AND organization_id = ? AND site_id = ? AND deleted_at IS NULL")
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(command.site_id)
        .fetch_one(&mut *tx)
        .await
        .map_err(store_error)?;
    if bound_channels > 0 {
        return Err(DomainError::conflict(
            "site has bound channels and cannot be deleted",
        ));
    }
    sqlx::query(
        "DELETE FROM ai_site_model WHERE tenant_id = ? AND organization_id = ? AND site_id = ?",
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.site_id)
    .execute(&mut *tx)
    .await
    .map_err(store_error)?;
    sqlx::query(
        "DELETE FROM ai_site_service WHERE tenant_id = ? AND organization_id = ? AND site_id = ?",
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.site_id)
    .execute(&mut *tx)
    .await
    .map_err(store_error)?;
    let affected = sqlx::query("DELETE FROM ai_site WHERE tenant_id = ? AND organization_id = ? AND id = ? AND deleted_at IS NULL")
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(command.site_id)
        .execute(&mut *tx)
        .await
        .map_err(store_error)?
        .rows_affected();
    if affected > 0 {
        insert_audit(
            &mut tx,
            &command.audit_log_uuid,
            &command.request_id,
            command.subject.tenant_id,
            command.subject.organization_id,
            command.subject.operator_id,
            command.subject.operator_type,
            "delete_site",
            command.site_id,
            &command.requested_at,
        )
        .await?;
    }
    tx.commit().await.map_err(store_error)?;
    Ok(affected > 0)
}

async fn list_site_models(
    pool: &SqlitePool,
    query: ListAdminSiteModelsQuery,
) -> DomainResult<Vec<AdminSiteModelItem>> {
    let rows = sqlx::query(
        r#"
        SELECT id, site_id, site_code, site_service_id, site_service_code, service_type, model_code,
               model_name, display_name, provider_model, provider_native_model, vendor_code, modality,
               COALESCE(capabilities, '[]') AS capabilities, context_tokens, max_input_tokens,
               max_output_tokens, COALESCE(supports_streaming, 0) AS supports_streaming,
               COALESCE(supports_tools, 0) AS supports_tools,
               COALESCE(supports_json_schema, 0) AS supports_json_schema,
               health_status, last_latency_ms, consecutive_error_count, last_sync_at, status
        FROM ai_site_model
        WHERE tenant_id = ? AND organization_id = ? AND site_id = ? AND deleted_at IS NULL
        ORDER BY model_code ASC, id ASC
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(query.site_id)
    .fetch_all(pool)
    .await
    .map_err(store_error)?;
    Ok(rows.into_iter().map(site_model_from_row).collect())
}

async fn create_site_model(
    pool: &SqlitePool,
    command: CreateAdminSiteModelCommand,
) -> DomainResult<AdminSiteModelItem> {
    let (service_id, site_code, service_code) = default_service(
        pool,
        command.subject.tenant_id,
        command.subject.organization_id,
        command.site_id,
    )
    .await?;
    let mut tx = pool.begin().await.map_err(store_error)?;
    let id = insert_site_model(
        &mut tx,
        &command.site_model_uuid,
        command.subject.tenant_id,
        command.subject.organization_id,
        command.site_id,
        service_id,
        &site_code,
        service_code.as_deref(),
        &command.input,
    )
    .await?;
    insert_audit(
        &mut tx,
        &command.audit_log_uuid,
        &command.request_id,
        command.subject.tenant_id,
        command.subject.organization_id,
        command.subject.operator_id,
        command.subject.operator_type,
        "create_site_model",
        id,
        &command.requested_at,
    )
    .await?;
    tx.commit().await.map_err(store_error)?;
    load_site_model(
        pool,
        command.subject.tenant_id,
        command.subject.organization_id,
        command.site_id,
        id,
    )
    .await?
    .ok_or_else(|| DomainError::new("created site model could not be reloaded"))
}

async fn replace_site_models(
    pool: &SqlitePool,
    command: ReplaceAdminSiteModelsCommand,
) -> DomainResult<Vec<AdminSiteModelItem>> {
    let (service_id, site_code, service_code) = default_service(
        pool,
        command.subject.tenant_id,
        command.subject.organization_id,
        command.site_id,
    )
    .await?;
    let mut tx = pool.begin().await.map_err(store_error)?;
    sqlx::query(
        "DELETE FROM ai_site_model WHERE tenant_id = ? AND organization_id = ? AND site_id = ?",
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.site_id)
    .execute(&mut *tx)
    .await
    .map_err(store_error)?;
    for (index, item) in command.items.iter().enumerate() {
        let uuid = command
            .site_model_uuids
            .get(index)
            .cloned()
            .unwrap_or_else(|| format!("site-model-{index}"));
        insert_site_model(
            &mut tx,
            &uuid,
            command.subject.tenant_id,
            command.subject.organization_id,
            command.site_id,
            service_id,
            &site_code,
            service_code.as_deref(),
            item,
        )
        .await?;
    }
    insert_audit(
        &mut tx,
        &command.audit_log_uuid,
        &command.request_id,
        command.subject.tenant_id,
        command.subject.organization_id,
        command.subject.operator_id,
        command.subject.operator_type,
        "replace_site_models",
        command.site_id,
        &command.requested_at,
    )
    .await?;
    tx.commit().await.map_err(store_error)?;
    list_site_models(
        pool,
        ListAdminSiteModelsQuery {
            subject: command.subject,
            site_id: command.site_id,
        },
    )
    .await
}

async fn update_site_model(
    pool: &SqlitePool,
    command: UpdateAdminSiteModelCommand,
) -> DomainResult<Option<AdminSiteModelItem>> {
    let Some(current) = load_site_model(
        pool,
        command.subject.tenant_id,
        command.subject.organization_id,
        command.site_id,
        command.site_model_id,
    )
    .await?
    else {
        return Ok(None);
    };
    let patch = command.input;
    let model_code = patch.model_code.unwrap_or(current.model_code);
    let model_name = patch.model_name.unwrap_or(current.model_name);
    let display_name = patch.display_name.unwrap_or(current.display_name);
    let provider_model = patch.provider_model.unwrap_or(current.provider_model);
    let provider_native_model = patch
        .provider_native_model
        .unwrap_or(current.provider_native_model);
    let vendor_code = patch.vendor_code.unwrap_or(current.vendor_code);
    let modality = patch.modality.unwrap_or(current.modality);
    let capabilities = patch.capabilities.unwrap_or(current.capabilities);
    let context_tokens = patch.context_tokens.unwrap_or(current.context_tokens);
    let max_input_tokens = patch.max_input_tokens.unwrap_or(current.max_input_tokens);
    let max_output_tokens = patch.max_output_tokens.unwrap_or(current.max_output_tokens);
    let supports_streaming = patch
        .supports_streaming
        .unwrap_or(current.supports_streaming);
    let supports_tools = patch.supports_tools.unwrap_or(current.supports_tools);
    let supports_json_schema = patch
        .supports_json_schema
        .unwrap_or(current.supports_json_schema);
    let status = site_status_code(&patch.status.unwrap_or(current.status));
    let capabilities_json = serde_json::to_string(&capabilities)
        .map_err(|error| DomainError::new(error.to_string()))?;
    let mut tx = pool.begin().await.map_err(store_error)?;
    sqlx::query(
        r#"
        UPDATE ai_site_model
        SET model_code = ?, model_name = ?, display_name = ?, provider_model = ?, provider_native_model = ?,
            vendor_code = ?, modality = ?, capabilities = ?, context_tokens = ?, max_input_tokens = ?,
            max_output_tokens = ?, supports_streaming = ?, supports_tools = ?, supports_json_schema = ?,
            status = ?, updated_at = CURRENT_TIMESTAMP, version = version + 1
        WHERE tenant_id = ? AND organization_id = ? AND site_id = ? AND id = ? AND deleted_at IS NULL
        "#,
    )
    .bind(&model_code)
    .bind(&model_name)
    .bind(&display_name)
    .bind(&provider_model)
    .bind(&provider_native_model)
    .bind(&vendor_code)
    .bind(&modality)
    .bind(&capabilities_json)
    .bind(context_tokens)
    .bind(max_input_tokens)
    .bind(max_output_tokens)
    .bind(supports_streaming)
    .bind(supports_tools)
    .bind(supports_json_schema)
    .bind(status)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.site_id)
    .bind(command.site_model_id)
    .execute(&mut *tx)
    .await
    .map_err(conflict_or_store_error)?;
    insert_audit(
        &mut tx,
        &command.audit_log_uuid,
        &command.request_id,
        command.subject.tenant_id,
        command.subject.organization_id,
        command.subject.operator_id,
        command.subject.operator_type,
        "update_site_model",
        command.site_model_id,
        &command.requested_at,
    )
    .await?;
    tx.commit().await.map_err(store_error)?;
    load_site_model(
        pool,
        command.subject.tenant_id,
        command.subject.organization_id,
        command.site_id,
        command.site_model_id,
    )
    .await
}

async fn delete_site_model(
    pool: &SqlitePool,
    command: DeleteAdminSiteModelCommand,
) -> DomainResult<bool> {
    let mut tx = pool.begin().await.map_err(store_error)?;
    let affected = sqlx::query("DELETE FROM ai_site_model WHERE tenant_id = ? AND organization_id = ? AND site_id = ? AND id = ? AND deleted_at IS NULL")
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(command.site_id)
        .bind(command.site_model_id)
        .execute(&mut *tx)
        .await
        .map_err(store_error)?
        .rows_affected();
    if affected > 0 {
        insert_audit(
            &mut tx,
            &command.audit_log_uuid,
            &command.request_id,
            command.subject.tenant_id,
            command.subject.organization_id,
            command.subject.operator_id,
            command.subject.operator_type,
            "delete_site_model",
            command.site_model_id,
            &command.requested_at,
        )
        .await?;
    }
    tx.commit().await.map_err(store_error)?;
    Ok(affected > 0)
}

async fn list_site_channels(
    pool: &SqlitePool,
    query: ListAdminSiteChannelsQuery,
) -> DomainResult<Vec<AdminSiteChannelItem>> {
    let rows = sqlx::query(
        r#"
        SELECT id, channel_code, channel_name, provider_code, site_code, site_service_code,
               site_channel_role, health_status, status
        FROM ai_channel
        WHERE tenant_id = ? AND organization_id = ? AND site_id = ? AND deleted_at IS NULL
        ORDER BY priority ASC, weight DESC, id ASC
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(query.site_id)
    .fetch_all(pool)
    .await
    .map_err(store_error)?;
    Ok(rows.into_iter().map(site_channel_from_row).collect())
}

async fn test_site_connection(
    pool: &SqlitePool,
    command: TestAdminSiteConnectionCommand,
) -> DomainResult<AdminSiteConnectionCheckItem> {
    let Some(site) = load_site(
        pool,
        command.subject.tenant_id,
        command.subject.organization_id,
        command.site_id,
    )
    .await?
    else {
        return Err(DomainError::not_found("site was not found"));
    };
    let checked_at = command.requested_at.clone();
    let latency_ms = Some(1);
    if command.persist_health {
        sqlx::query("UPDATE ai_site SET health_status = 2, last_latency_ms = ?, consecutive_error_count = 0, last_checked_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE tenant_id = ? AND organization_id = ? AND id = ?")
            .bind(latency_ms)
            .bind(command.subject.tenant_id)
            .bind(command.subject.organization_id)
            .bind(command.site_id)
            .execute(pool)
            .await
            .map_err(store_error)?;
    }
    insert_audit_pool(
        pool,
        &command.audit_log_uuid,
        &command.request_id,
        command.subject.tenant_id,
        command.subject.organization_id,
        command.subject.operator_id,
        command.subject.operator_type,
        if command.persist_health {
            "health_check_site"
        } else {
            "test_site_connection"
        },
        command.site_id,
        &command.requested_at,
    )
    .await?;
    Ok(AdminSiteConnectionCheckItem {
        site_id: site.id,
        status: "success".to_owned(),
        health_status: "healthy".to_owned(),
        latency_ms,
        checked_at,
        message: Some("site configuration is reachable".to_owned()),
    })
}

async fn load_site(
    pool: &SqlitePool,
    tenant_id: i64,
    organization_id: i64,
    site_id: i64,
) -> DomainResult<Option<AdminSiteItem>> {
    sqlx::query(
        r#"
        SELECT id, site_code, site_name, display_name, description, COALESCE(base_url, '') AS base_url,
               website_url, docs_url, CAST(logo_resource_snapshot AS TEXT) AS logo_resource_snapshot,
               COALESCE(metadata, '{}') AS metadata, site_type, owner_kind, region_code, environment, health_status,
               last_latency_ms, consecutive_error_count, last_checked_at, last_sync_at, sort_order, status
        FROM ai_site
        WHERE tenant_id = ? AND organization_id = ? AND id = ? AND deleted_at IS NULL
        "#,
    )
    .bind(tenant_id)
    .bind(organization_id)
    .bind(site_id)
    .fetch_optional(pool)
    .await
    .map_err(store_error)
    .map(|row| row.map(site_from_row))
}

async fn load_site_model(
    pool: &SqlitePool,
    tenant_id: i64,
    organization_id: i64,
    site_id: i64,
    site_model_id: i64,
) -> DomainResult<Option<AdminSiteModelItem>> {
    sqlx::query(
        r#"
        SELECT id, site_id, site_code, site_service_id, site_service_code, service_type, model_code,
               model_name, display_name, provider_model, provider_native_model, vendor_code, modality,
               COALESCE(capabilities, '[]') AS capabilities, context_tokens, max_input_tokens,
               max_output_tokens, COALESCE(supports_streaming, 0) AS supports_streaming,
               COALESCE(supports_tools, 0) AS supports_tools,
               COALESCE(supports_json_schema, 0) AS supports_json_schema,
               health_status, last_latency_ms, consecutive_error_count, last_sync_at, status
        FROM ai_site_model
        WHERE tenant_id = ? AND organization_id = ? AND site_id = ? AND id = ? AND deleted_at IS NULL
        "#,
    )
    .bind(tenant_id)
    .bind(organization_id)
    .bind(site_id)
    .bind(site_model_id)
    .fetch_optional(pool)
    .await
    .map_err(store_error)
    .map(|row| row.map(site_model_from_row))
}

async fn default_service(
    pool: &SqlitePool,
    tenant_id: i64,
    organization_id: i64,
    site_id: i64,
) -> DomainResult<(i64, String, Option<String>)> {
    let row = sqlx::query("SELECT id, site_code, service_code FROM ai_site_service WHERE tenant_id = ? AND organization_id = ? AND site_id = ? AND service_type = 'ai_model_relay' AND deleted_at IS NULL ORDER BY id ASC LIMIT 1")
        .bind(tenant_id)
        .bind(organization_id)
        .bind(site_id)
        .fetch_optional(pool)
        .await
        .map_err(store_error)?;
    row.map(|row| {
        (
            row.get::<i64, _>("id"),
            row.get::<String, _>("site_code"),
            row.try_get::<String, _>("service_code").ok(),
        )
    })
    .ok_or_else(|| DomainError::not_found("site default service was not found"))
}

async fn insert_site_model(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    uuid: &str,
    tenant_id: i64,
    organization_id: i64,
    site_id: i64,
    service_id: i64,
    site_code: &str,
    service_code: Option<&str>,
    input: &AdminSiteModelCommand,
) -> DomainResult<i64> {
    let capabilities_json = serde_json::to_string(&input.capabilities)
        .map_err(|error| DomainError::new(error.to_string()))?;
    let id = sqlx::query(
        r#"
        INSERT INTO ai_site_model (
            uuid, tenant_id, organization_id, status, site_id, site_service_id, site_code,
            site_service_code, service_type, model_code, model_name, display_name, provider_model,
            provider_native_model, vendor_code, modality, capabilities, context_tokens,
            max_input_tokens, max_output_tokens, supports_streaming, supports_tools,
            supports_json_schema, health_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ai_model_relay', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        "#,
    )
    .bind(uuid)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(site_status_code(&input.status))
    .bind(site_id)
    .bind(service_id)
    .bind(site_code)
    .bind(service_code)
    .bind(&input.model_code)
    .bind(&input.model_name)
    .bind(&input.display_name)
    .bind(&input.provider_model)
    .bind(&input.provider_native_model)
    .bind(&input.vendor_code)
    .bind(&input.modality)
    .bind(&capabilities_json)
    .bind(input.context_tokens)
    .bind(input.max_input_tokens)
    .bind(input.max_output_tokens)
    .bind(input.supports_streaming)
    .bind(input.supports_tools)
    .bind(input.supports_json_schema)
    .execute(&mut **tx)
    .await
    .map_err(conflict_or_store_error)?
    .last_insert_rowid();
    Ok(id)
}

fn site_from_row(row: sqlx::sqlite::SqliteRow) -> AdminSiteItem {
    let logo = site_logo_from_row(&row);
    let metadata = site_metadata_from_row(&row);
    AdminSiteItem {
        id: row.get("id"),
        site_code: row.get("site_code"),
        site_name: row.get("site_name"),
        display_name: row.get("display_name"),
        description: row.try_get("description").ok(),
        base_url: row.get("base_url"),
        website_url: row.try_get("website_url").ok(),
        docs_url: row.try_get("docs_url").ok(),
        logo,
        domains: site_metadata_string_array(&metadata, "domains"),
        vendor_codes: site_metadata_string_array(&metadata, "vendorCodes"),
        site_type: row.get("site_type"),
        owner_kind: row.try_get("owner_kind").ok(),
        region_code: row.try_get("region_code").ok(),
        environment: site_environment_label(row.get::<i32, _>("environment")),
        health_status: health_status_label(row.get::<i32, _>("health_status")),
        last_latency_ms: row.try_get::<i64, _>("last_latency_ms").ok(),
        consecutive_error_count: row.get("consecutive_error_count"),
        last_checked_at: row.try_get("last_checked_at").ok(),
        last_sync_at: row.try_get("last_sync_at").ok(),
        sort_order: i64::from(row.get::<i32, _>("sort_order")),
        status: site_status_label(row.get::<i32, _>("status")),
    }
}

fn site_model_from_row(row: sqlx::sqlite::SqliteRow) -> AdminSiteModelItem {
    let capabilities_raw = row
        .try_get::<String, _>("capabilities")
        .unwrap_or_else(|_| "[]".to_owned());
    AdminSiteModelItem {
        id: row.get("id"),
        site_id: row.get("site_id"),
        site_code: row.get("site_code"),
        site_service_id: row.get("site_service_id"),
        site_service_code: row.try_get("site_service_code").ok(),
        service_type: row.get("service_type"),
        model_code: row.get("model_code"),
        model_name: row.get("model_name"),
        display_name: row.try_get("display_name").ok(),
        provider_model: row.try_get("provider_model").ok(),
        provider_native_model: row.try_get("provider_native_model").ok(),
        vendor_code: row.try_get("vendor_code").ok(),
        modality: row.try_get("modality").ok(),
        capabilities: serde_json::from_str(&capabilities_raw).unwrap_or_default(),
        context_tokens: row.try_get("context_tokens").ok(),
        max_input_tokens: row.try_get("max_input_tokens").ok(),
        max_output_tokens: row.try_get("max_output_tokens").ok(),
        supports_streaming: row.get("supports_streaming"),
        supports_tools: row.get("supports_tools"),
        supports_json_schema: row.get("supports_json_schema"),
        health_status: health_status_label(row.get::<i32, _>("health_status")),
        last_latency_ms: row.try_get("last_latency_ms").ok(),
        consecutive_error_count: row.get("consecutive_error_count"),
        last_sync_at: row.try_get("last_sync_at").ok(),
        status: site_status_label(row.get::<i32, _>("status")),
    }
}

fn site_channel_from_row(row: sqlx::sqlite::SqliteRow) -> AdminSiteChannelItem {
    AdminSiteChannelItem {
        id: row.get("id"),
        channel_code: row.get("channel_code"),
        channel_name: row.get("channel_name"),
        provider_code: row.try_get("provider_code").ok(),
        site_code: row.try_get("site_code").ok(),
        site_service_code: row.try_get("site_service_code").ok(),
        site_channel_role: row.try_get("site_channel_role").ok(),
        health_status: health_status_label(row.get::<i32, _>("health_status")),
        status: site_status_label(row.get::<i32, _>("status")),
    }
}

fn site_metadata_json(domains: &[String], vendor_codes: &[String]) -> DomainResult<String> {
    serde_json::to_string(&serde_json::json!({
        "domains": domains,
        "vendorCodes": vendor_codes,
    }))
    .map_err(|error| DomainError::new(error.to_string()))
}

fn site_logo_from_row(row: &sqlx::sqlite::SqliteRow) -> Option<serde_json::Value> {
    row.try_get::<String, _>("logo_resource_snapshot")
        .ok()
        .and_then(|value| serde_json::from_str::<serde_json::Value>(&value).ok())
        .filter(|value| value.is_object())
}

fn site_metadata_from_row(row: &sqlx::sqlite::SqliteRow) -> serde_json::Value {
    row.try_get::<String, _>("metadata")
        .ok()
        .and_then(|value| serde_json::from_str::<serde_json::Value>(&value).ok())
        .filter(|value| value.is_object())
        .unwrap_or_else(|| serde_json::json!({}))
}

fn site_metadata_string_array(metadata: &serde_json::Value, key: &str) -> Vec<String> {
    metadata
        .get(key)
        .and_then(serde_json::Value::as_array)
        .map(|items| {
            items
                .iter()
                .filter_map(serde_json::Value::as_str)
                .map(str::trim)
                .filter(|value| !value.is_empty())
                .map(str::to_owned)
                .collect()
        })
        .unwrap_or_default()
}

async fn insert_audit(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    uuid: &str,
    request_id: &str,
    tenant_id: i64,
    organization_id: i64,
    operator_id: i64,
    operator_type: i32,
    action: &str,
    target_id: i64,
    requested_at: &str,
) -> DomainResult<()> {
    sqlx::query("INSERT INTO ops_audit_log (uuid, tenant_id, organization_id, request_id, operator_id, operator_type, action, target_type, target_id, created_at, metadata, change_summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)")
        .bind(uuid)
        .bind(tenant_id)
        .bind(organization_id)
        .bind(request_id)
        .bind(operator_id)
        .bind(operator_type)
        .bind(action)
        .bind(audit_target_type(action))
        .bind(target_id)
        .bind(format!(r#"{{"requestedAt":"{requested_at}"}}"#))
        .bind(format!(r#"{{"action":"{action}","targetId":{target_id}}}"#))
        .execute(&mut **tx)
        .await
        .map_err(store_error)?;
    Ok(())
}

async fn insert_audit_pool(
    pool: &SqlitePool,
    uuid: &str,
    request_id: &str,
    tenant_id: i64,
    organization_id: i64,
    operator_id: i64,
    operator_type: i32,
    action: &str,
    target_id: i64,
    requested_at: &str,
) -> DomainResult<()> {
    sqlx::query("INSERT INTO ops_audit_log (uuid, tenant_id, organization_id, request_id, operator_id, operator_type, action, target_type, target_id, created_at, metadata, change_summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)")
        .bind(uuid)
        .bind(tenant_id)
        .bind(organization_id)
        .bind(request_id)
        .bind(operator_id)
        .bind(operator_type)
        .bind(action)
        .bind(audit_target_type(action))
        .bind(target_id)
        .bind(format!(r#"{{"requestedAt":"{requested_at}"}}"#))
        .bind(format!(r#"{{"action":"{action}","targetId":{target_id}}}"#))
        .execute(pool)
        .await
        .map_err(store_error)?;
    Ok(())
}

fn audit_target_type(action: &str) -> i32 {
    if action.contains("site_model") || action == "replace_site_models" {
        SITE_MODEL_TARGET_TYPE
    } else {
        SITE_TARGET_TYPE
    }
}

fn store_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}

fn conflict_or_store_error(error: sqlx::Error) -> DomainError {
    match error {
        sqlx::Error::Database(database_error) if database_error.is_unique_violation() => {
            DomainError::conflict(database_error.to_string())
        }
        other => DomainError::new(other.to_string()),
    }
}
