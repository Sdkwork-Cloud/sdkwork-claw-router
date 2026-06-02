use sqlx::{PgPool, Postgres, Row, Transaction};

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
pub struct PostgresAdminSiteStore {
    pool: PgPool,
}

impl PostgresAdminSiteStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl AdminSiteStore for PostgresAdminSiteStore {
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

async fn list_sites(pool: &PgPool, query: ListAdminSitesQuery) -> DomainResult<Vec<AdminSiteItem>> {
    let search = query.search.as_ref().map(|value| format!("%{}%", value));
    let rows = sqlx::query(
        r#"
        SELECT id, site_code, site_name, display_name, description, COALESCE(base_url, '') AS base_url,
               website_url, docs_url, COALESCE(logo_resource_snapshot::text, '') AS logo_resource_snapshot,
               COALESCE(metadata::text, '{}') AS metadata, site_type, owner_kind, region_code, environment, health_status,
               last_latency_ms, consecutive_error_count, last_checked_at::text AS last_checked_at,
               last_sync_at::text AS last_sync_at, sort_order, status
        FROM ai_site
        WHERE tenant_id = $1 AND organization_id = $2 AND deleted_at IS NULL
          AND ($3 IS NULL OR site_code ILIKE $4 OR site_name ILIKE $5 OR display_name ILIKE $6)
        ORDER BY sort_order ASC NULLS LAST, id ASC
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
    .map_err(|error| store_error("failed to list sites", error))?;
    rows.into_iter().map(site_from_row).collect()
}

async fn create_site(
    pool: &PgPool,
    command: CreateAdminSiteCommand,
) -> DomainResult<AdminSiteItem> {
    let mut tx = pool
        .begin()
        .await
        .map_err(|error| store_error("failed to begin site create transaction", error))?;
    let service_code = default_site_service_code(&command.site_code);
    let status = site_status_code(&command.status);
    let environment = site_environment_code(&command.environment);
    let logo = command.logo.as_ref();
    let logo_media_resource_id = logo.map(media_resource_stable_id);
    let logo_object_blob_id = logo.and_then(media_resource_object_blob_id);
    let logo_resource_snapshot = logo.map(serde_json::Value::to_string);
    let metadata = site_metadata_json(&command.domains, &command.vendor_codes)?;
    let site_id: i64 = sqlx::query_scalar(
        r#"
        INSERT INTO ai_site (
            uuid, tenant_id, organization_id, status, site_code, site_name, display_name,
            description, base_url, website_url, docs_url, logo_media_resource_id,
            logo_object_blob_id, logo_resource_snapshot, metadata, site_type, owner_kind,
            region_code, environment, health_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14::jsonb, $15::jsonb, $16, $17, $18, $19, 1)
        RETURNING id
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
    .fetch_one(&mut *tx)
    .await
    .map_err(|error| conflict_or_store_error("failed to create site", error))?;
    sqlx::query(
        r#"
        INSERT INTO ai_site_service (
            uuid, tenant_id, organization_id, status, site_id, site_code, service_code, service_name,
            service_type, protocol_code, base_url, credential_ref, masked_label, region_code,
            environment, health_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'ai_model_relay', 'openai_compatible', $9, $10, $11, $12, $13, 1)
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
    .map_err(|error| conflict_or_store_error("failed to create site service", error))?;
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
    tx.commit()
        .await
        .map_err(|error| store_error("failed to commit site create transaction", error))?;
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
    pool: &PgPool,
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
    let service_code = default_site_service_code(&site_code);
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
    let credential_ref_changed = command.credential_ref.is_some();
    let credential_ref = command.credential_ref.flatten();
    let masked_label_changed = command.masked_label.is_some();
    let masked_label = command.masked_label.flatten();
    let logo_ref = logo.as_ref();
    let logo_media_resource_id = logo_ref.map(media_resource_stable_id);
    let logo_object_blob_id = logo_ref.and_then(media_resource_object_blob_id);
    let logo_resource_snapshot = logo_ref.map(serde_json::Value::to_string);
    let metadata = site_metadata_json(&domains, &vendor_codes)?;
    let mut tx = pool
        .begin()
        .await
        .map_err(|error| store_error("failed to begin site update transaction", error))?;
    sqlx::query(
        r#"
        UPDATE ai_site
        SET site_code = $1, site_name = $2, display_name = $3, description = $4, base_url = $5,
            website_url = $6, docs_url = $7, logo_media_resource_id = $8, logo_object_blob_id = $9,
            logo_resource_snapshot = $10::jsonb, metadata = $11::jsonb, site_type = $12,
            owner_kind = $13, region_code = $14, environment = $15, status = $16,
            updated_at = CURRENT_TIMESTAMP, version = version + 1
        WHERE tenant_id = $17 AND organization_id = $18 AND id = $19 AND deleted_at IS NULL
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
    .map_err(|error| conflict_or_store_error("failed to update site", error))?;
    sqlx::query(
        r#"
        UPDATE ai_site_service
        SET site_code = $1, service_code = $2, service_name = $3, base_url = $4,
            region_code = $5, environment = $6, status = $7,
            credential_ref = CASE WHEN $8 THEN $9 ELSE credential_ref END,
            masked_label = CASE WHEN $10 THEN $11 ELSE masked_label END,
            updated_at = CURRENT_TIMESTAMP, version = version + 1
        WHERE tenant_id = $12 AND organization_id = $13 AND site_id = $14 AND deleted_at IS NULL
        "#,
    )
    .bind(&site_code)
    .bind(&service_code)
    .bind(format!("{display_name} AI model relay"))
    .bind(&base_url)
    .bind(&region_code)
    .bind(environment)
    .bind(status)
    .bind(credential_ref_changed)
    .bind(credential_ref.as_deref())
    .bind(masked_label_changed)
    .bind(masked_label.as_deref())
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.site_id)
    .execute(&mut *tx)
    .await
    .map_err(|error| conflict_or_store_error("failed to update site service", error))?;
    sqlx::query(
        r#"
        UPDATE ai_site_model
        SET site_code = $1, site_service_code = $2, updated_at = CURRENT_TIMESTAMP, version = version + 1
        WHERE tenant_id = $3 AND organization_id = $4 AND site_id = $5 AND deleted_at IS NULL
        "#,
    )
    .bind(&site_code)
    .bind(&service_code)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.site_id)
    .execute(&mut *tx)
    .await
    .map_err(|error| store_error("failed to update site model bindings", error))?;
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
    tx.commit()
        .await
        .map_err(|error| store_error("failed to commit site update transaction", error))?;
    load_site(
        pool,
        command.subject.tenant_id,
        command.subject.organization_id,
        command.site_id,
    )
    .await
}

async fn delete_site(pool: &PgPool, command: DeleteAdminSiteCommand) -> DomainResult<bool> {
    let mut tx = pool
        .begin()
        .await
        .map_err(|error| store_error("failed to begin site delete transaction", error))?;
    let bound_channels: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ai_channel
        WHERE tenant_id = $1 AND organization_id = $2 AND site_id = $3 AND deleted_at IS NULL
        "#,
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.site_id)
    .fetch_one(&mut *tx)
    .await
    .map_err(|error| store_error("failed to check site channel bindings", error))?;
    if bound_channels > 0 {
        return Err(DomainError::conflict(
            "site has bound channels and cannot be deleted",
        ));
    }
    sqlx::query(
        "DELETE FROM ai_site_model WHERE tenant_id = $1 AND organization_id = $2 AND site_id = $3",
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.site_id)
    .execute(&mut *tx)
    .await
    .map_err(|error| store_error("failed to delete site models", error))?;
    sqlx::query(
        "DELETE FROM ai_site_service WHERE tenant_id = $1 AND organization_id = $2 AND site_id = $3",
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.site_id)
    .execute(&mut *tx)
    .await
    .map_err(|error| store_error("failed to delete site services", error))?;
    let affected = sqlx::query(
        "DELETE FROM ai_site WHERE tenant_id = $1 AND organization_id = $2 AND id = $3 AND deleted_at IS NULL",
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.site_id)
    .execute(&mut *tx)
    .await
    .map_err(|error| store_error("failed to delete site", error))?
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
    tx.commit()
        .await
        .map_err(|error| store_error("failed to commit site delete transaction", error))?;
    Ok(affected > 0)
}

async fn list_site_models(
    pool: &PgPool,
    query: ListAdminSiteModelsQuery,
) -> DomainResult<Vec<AdminSiteModelItem>> {
    let rows = sqlx::query(
        r#"
        SELECT id, site_id, site_code, site_service_id, site_service_code, service_type, model_code,
               model_name, display_name, provider_model, provider_native_model, vendor_code, modality,
               COALESCE(capabilities::text, '[]') AS capabilities, context_tokens, max_input_tokens,
               max_output_tokens, COALESCE(supports_streaming, false) AS supports_streaming,
               COALESCE(supports_tools, false) AS supports_tools,
               COALESCE(supports_json_schema, false) AS supports_json_schema,
               health_status, last_latency_ms, consecutive_error_count, last_sync_at::text AS last_sync_at, status
        FROM ai_site_model
        WHERE tenant_id = $1 AND organization_id = $2 AND site_id = $3 AND deleted_at IS NULL
        ORDER BY model_code ASC, id ASC
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(query.site_id)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list site models", error))?;
    rows.into_iter().map(site_model_from_row).collect()
}

async fn create_site_model(
    pool: &PgPool,
    command: CreateAdminSiteModelCommand,
) -> DomainResult<AdminSiteModelItem> {
    let (service_id, site_code, service_code) = default_service(
        pool,
        command.subject.tenant_id,
        command.subject.organization_id,
        command.site_id,
    )
    .await?;
    let mut tx = pool
        .begin()
        .await
        .map_err(|error| store_error("failed to begin site model create transaction", error))?;
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
    tx.commit()
        .await
        .map_err(|error| store_error("failed to commit site model create transaction", error))?;
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
    pool: &PgPool,
    command: ReplaceAdminSiteModelsCommand,
) -> DomainResult<Vec<AdminSiteModelItem>> {
    let (service_id, site_code, service_code) = default_service(
        pool,
        command.subject.tenant_id,
        command.subject.organization_id,
        command.site_id,
    )
    .await?;
    let mut tx = pool
        .begin()
        .await
        .map_err(|error| store_error("failed to begin site models replace transaction", error))?;
    sqlx::query(
        "DELETE FROM ai_site_model WHERE tenant_id = $1 AND organization_id = $2 AND site_id = $3",
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.site_id)
    .execute(&mut *tx)
    .await
    .map_err(|error| store_error("failed to clear site models", error))?;
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
    tx.commit()
        .await
        .map_err(|error| store_error("failed to commit site models replace transaction", error))?;
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
    pool: &PgPool,
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
    let mut tx = pool
        .begin()
        .await
        .map_err(|error| store_error("failed to begin site model update transaction", error))?;
    sqlx::query(
        r#"
        UPDATE ai_site_model
        SET model_code = $1, model_name = $2, display_name = $3, provider_model = $4, provider_native_model = $5,
            vendor_code = $6, modality = $7, capabilities = $8::jsonb, context_tokens = $9, max_input_tokens = $10,
            max_output_tokens = $11, supports_streaming = $12, supports_tools = $13, supports_json_schema = $14,
            status = $15, updated_at = CURRENT_TIMESTAMP, version = version + 1
        WHERE tenant_id = $16 AND organization_id = $17 AND site_id = $18 AND id = $19 AND deleted_at IS NULL
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
    .map_err(|error| conflict_or_store_error("failed to update site model", error))?;
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
    tx.commit()
        .await
        .map_err(|error| store_error("failed to commit site model update transaction", error))?;
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
    pool: &PgPool,
    command: DeleteAdminSiteModelCommand,
) -> DomainResult<bool> {
    let mut tx = pool
        .begin()
        .await
        .map_err(|error| store_error("failed to begin site model delete transaction", error))?;
    let affected = sqlx::query(
        "DELETE FROM ai_site_model WHERE tenant_id = $1 AND organization_id = $2 AND site_id = $3 AND id = $4 AND deleted_at IS NULL",
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.site_id)
    .bind(command.site_model_id)
    .execute(&mut *tx)
    .await
    .map_err(|error| store_error("failed to delete site model", error))?
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
    tx.commit()
        .await
        .map_err(|error| store_error("failed to commit site model delete transaction", error))?;
    Ok(affected > 0)
}

async fn list_site_channels(
    pool: &PgPool,
    query: ListAdminSiteChannelsQuery,
) -> DomainResult<Vec<AdminSiteChannelItem>> {
    let rows = sqlx::query(
        r#"
        SELECT id, channel_code, channel_name, provider_code, site_code, site_service_code,
               site_channel_role, health_status, status
        FROM ai_channel
        WHERE tenant_id = $1 AND organization_id = $2 AND site_id = $3 AND deleted_at IS NULL
        ORDER BY priority ASC NULLS LAST, weight DESC NULLS LAST, id ASC
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(query.site_id)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list site channels", error))?;
    rows.into_iter().map(site_channel_from_row).collect()
}

async fn test_site_connection(
    pool: &PgPool,
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
        let mut tx = pool
            .begin()
            .await
            .map_err(|error| store_error("failed to begin site health transaction", error))?;
        sqlx::query(
            r#"
            UPDATE ai_site
            SET health_status = 2, last_latency_ms = $1, consecutive_error_count = 0,
                last_checked_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
            WHERE tenant_id = $2 AND organization_id = $3 AND id = $4 AND deleted_at IS NULL
            "#,
        )
        .bind(latency_ms)
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(command.site_id)
        .execute(&mut *tx)
        .await
        .map_err(|error| store_error("failed to update site health", error))?;
        sqlx::query(
            r#"
            UPDATE ai_site_service
            SET health_status = 2, last_latency_ms = $1, consecutive_error_count = 0,
                last_verified_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
            WHERE tenant_id = $2 AND organization_id = $3 AND site_id = $4 AND deleted_at IS NULL
            "#,
        )
        .bind(latency_ms)
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(command.site_id)
        .execute(&mut *tx)
        .await
        .map_err(|error| store_error("failed to update site service health", error))?;
        insert_audit(
            &mut tx,
            &command.audit_log_uuid,
            &command.request_id,
            command.subject.tenant_id,
            command.subject.organization_id,
            command.subject.operator_id,
            command.subject.operator_type,
            "health_check_site",
            command.site_id,
            &command.requested_at,
        )
        .await?;
        tx.commit()
            .await
            .map_err(|error| store_error("failed to commit site health transaction", error))?;
    } else {
        insert_audit_pool(
            pool,
            &command.audit_log_uuid,
            &command.request_id,
            command.subject.tenant_id,
            command.subject.organization_id,
            command.subject.operator_id,
            command.subject.operator_type,
            "test_site_connection",
            command.site_id,
            &command.requested_at,
        )
        .await?;
    }
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
    pool: &PgPool,
    tenant_id: i64,
    organization_id: i64,
    site_id: i64,
) -> DomainResult<Option<AdminSiteItem>> {
    sqlx::query(
        r#"
        SELECT id, site_code, site_name, display_name, description, COALESCE(base_url, '') AS base_url,
               website_url, docs_url, COALESCE(logo_resource_snapshot::text, '') AS logo_resource_snapshot,
               COALESCE(metadata::text, '{}') AS metadata, site_type, owner_kind, region_code, environment, health_status,
               last_latency_ms, consecutive_error_count, last_checked_at::text AS last_checked_at,
               last_sync_at::text AS last_sync_at, sort_order, status
        FROM ai_site
        WHERE tenant_id = $1 AND organization_id = $2 AND id = $3 AND deleted_at IS NULL
        "#,
    )
    .bind(tenant_id)
    .bind(organization_id)
    .bind(site_id)
    .fetch_optional(pool)
    .await
    .map_err(|error| store_error("failed to load site", error))?
    .map(site_from_row)
    .transpose()
}

async fn load_site_model(
    pool: &PgPool,
    tenant_id: i64,
    organization_id: i64,
    site_id: i64,
    site_model_id: i64,
) -> DomainResult<Option<AdminSiteModelItem>> {
    sqlx::query(
        r#"
        SELECT id, site_id, site_code, site_service_id, site_service_code, service_type, model_code,
               model_name, display_name, provider_model, provider_native_model, vendor_code, modality,
               COALESCE(capabilities::text, '[]') AS capabilities, context_tokens, max_input_tokens,
               max_output_tokens, COALESCE(supports_streaming, false) AS supports_streaming,
               COALESCE(supports_tools, false) AS supports_tools,
               COALESCE(supports_json_schema, false) AS supports_json_schema,
               health_status, last_latency_ms, consecutive_error_count, last_sync_at::text AS last_sync_at, status
        FROM ai_site_model
        WHERE tenant_id = $1 AND organization_id = $2 AND site_id = $3 AND id = $4 AND deleted_at IS NULL
        "#,
    )
    .bind(tenant_id)
    .bind(organization_id)
    .bind(site_id)
    .bind(site_model_id)
    .fetch_optional(pool)
    .await
    .map_err(|error| store_error("failed to load site model", error))?
    .map(site_model_from_row)
    .transpose()
}

async fn default_service(
    pool: &PgPool,
    tenant_id: i64,
    organization_id: i64,
    site_id: i64,
) -> DomainResult<(i64, String, Option<String>)> {
    let row = sqlx::query(
        r#"
        SELECT id, site_code, service_code
        FROM ai_site_service
        WHERE tenant_id = $1 AND organization_id = $2 AND site_id = $3
          AND service_type = 'ai_model_relay' AND deleted_at IS NULL
        ORDER BY id ASC
        LIMIT 1
        "#,
    )
    .bind(tenant_id)
    .bind(organization_id)
    .bind(site_id)
    .fetch_optional(pool)
    .await
    .map_err(|error| store_error("failed to load site default service", error))?;
    row.map(|row| {
        Ok((
            row.try_get::<i64, _>("id").map_err(row_error)?,
            row.try_get::<String, _>("site_code").map_err(row_error)?,
            row.try_get::<Option<String>, _>("service_code")
                .ok()
                .flatten(),
        ))
    })
    .transpose()?
    .ok_or_else(|| DomainError::not_found("site default service was not found"))
}

async fn insert_site_model(
    tx: &mut Transaction<'_, Postgres>,
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
    let id: i64 = sqlx::query_scalar(
        r#"
        INSERT INTO ai_site_model (
            uuid, tenant_id, organization_id, status, site_id, site_service_id, site_code,
            site_service_code, service_type, model_code, model_name, display_name, provider_model,
            provider_native_model, vendor_code, modality, capabilities, context_tokens,
            max_input_tokens, max_output_tokens, supports_streaming, supports_tools,
            supports_json_schema, health_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'ai_model_relay', $9, $10, $11, $12, $13, $14, $15, $16::jsonb, $17, $18, $19, $20, $21, $22, 1)
        RETURNING id
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
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| conflict_or_store_error("failed to create site model", error))?;
    Ok(id)
}

fn site_from_row(row: sqlx::postgres::PgRow) -> DomainResult<AdminSiteItem> {
    let logo = site_logo_from_row(&row);
    let metadata = site_metadata_from_row(&row);
    Ok(AdminSiteItem {
        id: row.try_get("id").map_err(row_error)?,
        site_code: row.try_get("site_code").map_err(row_error)?,
        site_name: row.try_get("site_name").map_err(row_error)?,
        display_name: row.try_get("display_name").map_err(row_error)?,
        description: optional_string_cell(&row, "description"),
        base_url: row.try_get("base_url").map_err(row_error)?,
        website_url: optional_string_cell(&row, "website_url"),
        docs_url: optional_string_cell(&row, "docs_url"),
        logo,
        domains: site_metadata_string_array(&metadata, "domains"),
        vendor_codes: site_metadata_string_array(&metadata, "vendorCodes"),
        site_type: row.try_get("site_type").map_err(row_error)?,
        owner_kind: optional_string_cell(&row, "owner_kind"),
        region_code: optional_string_cell(&row, "region_code"),
        environment: site_environment_label(required_i32_cell(&row, "environment")?),
        health_status: health_status_label(required_i32_cell(&row, "health_status")?),
        last_latency_ms: optional_integer_cell(&row, "last_latency_ms"),
        consecutive_error_count: optional_integer_cell(&row, "consecutive_error_count")
            .unwrap_or(0),
        last_checked_at: optional_string_cell(&row, "last_checked_at"),
        last_sync_at: optional_string_cell(&row, "last_sync_at"),
        sort_order: optional_integer_cell(&row, "sort_order").unwrap_or(100),
        status: site_status_label(required_i32_cell(&row, "status")?),
    })
}

fn site_model_from_row(row: sqlx::postgres::PgRow) -> DomainResult<AdminSiteModelItem> {
    let capabilities_raw = row
        .try_get::<String, _>("capabilities")
        .unwrap_or_else(|_| "[]".to_owned());
    Ok(AdminSiteModelItem {
        id: row.try_get("id").map_err(row_error)?,
        site_id: row.try_get("site_id").map_err(row_error)?,
        site_code: row.try_get("site_code").map_err(row_error)?,
        site_service_id: row.try_get("site_service_id").map_err(row_error)?,
        site_service_code: optional_string_cell(&row, "site_service_code"),
        service_type: row.try_get("service_type").map_err(row_error)?,
        model_code: row.try_get("model_code").map_err(row_error)?,
        model_name: row.try_get("model_name").map_err(row_error)?,
        display_name: optional_string_cell(&row, "display_name"),
        provider_model: optional_string_cell(&row, "provider_model"),
        provider_native_model: optional_string_cell(&row, "provider_native_model"),
        vendor_code: optional_string_cell(&row, "vendor_code"),
        modality: optional_string_cell(&row, "modality"),
        capabilities: serde_json::from_str(&capabilities_raw).unwrap_or_default(),
        context_tokens: optional_integer_cell(&row, "context_tokens"),
        max_input_tokens: optional_integer_cell(&row, "max_input_tokens"),
        max_output_tokens: optional_integer_cell(&row, "max_output_tokens"),
        supports_streaming: bool_cell(&row, "supports_streaming"),
        supports_tools: bool_cell(&row, "supports_tools"),
        supports_json_schema: bool_cell(&row, "supports_json_schema"),
        health_status: health_status_label(required_i32_cell(&row, "health_status")?),
        last_latency_ms: optional_integer_cell(&row, "last_latency_ms"),
        consecutive_error_count: optional_integer_cell(&row, "consecutive_error_count")
            .unwrap_or(0),
        last_sync_at: optional_string_cell(&row, "last_sync_at"),
        status: site_status_label(required_i32_cell(&row, "status")?),
    })
}

fn site_channel_from_row(row: sqlx::postgres::PgRow) -> DomainResult<AdminSiteChannelItem> {
    Ok(AdminSiteChannelItem {
        id: row.try_get("id").map_err(row_error)?,
        channel_code: row.try_get("channel_code").map_err(row_error)?,
        channel_name: row.try_get("channel_name").map_err(row_error)?,
        provider_code: optional_string_cell(&row, "provider_code"),
        site_code: optional_string_cell(&row, "site_code"),
        site_service_code: optional_string_cell(&row, "site_service_code"),
        site_channel_role: optional_string_cell(&row, "site_channel_role"),
        health_status: health_status_label(optional_i32_cell(&row, "health_status").unwrap_or(1)),
        status: site_status_label(required_i32_cell(&row, "status")?),
    })
}

fn site_metadata_json(domains: &[String], vendor_codes: &[String]) -> DomainResult<String> {
    serde_json::to_string(&serde_json::json!({
        "domains": domains,
        "vendorCodes": vendor_codes,
    }))
    .map_err(|error| DomainError::new(error.to_string()))
}

fn site_logo_from_row(row: &sqlx::postgres::PgRow) -> Option<serde_json::Value> {
    row.try_get::<String, _>("logo_resource_snapshot")
        .ok()
        .and_then(|value| serde_json::from_str::<serde_json::Value>(&value).ok())
        .filter(|value| value.is_object())
}

fn site_metadata_from_row(row: &sqlx::postgres::PgRow) -> serde_json::Value {
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
    tx: &mut Transaction<'_, Postgres>,
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
    let metadata = serde_json::json!({ "requestedAt": requested_at }).to_string();
    let change_summary = serde_json::json!({ "action": action, "targetId": target_id }).to_string();
    sqlx::query(
        r#"
        INSERT INTO ops_audit_log
            (uuid, tenant_id, organization_id, request_id, operator_id, operator_type, action, target_type, target_id, created_at, metadata, change_summary)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, $10::jsonb, $11::jsonb)
        "#,
    )
    .bind(uuid)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(request_id)
    .bind(operator_id)
    .bind(operator_type)
    .bind(action)
    .bind(audit_target_type(action))
    .bind(target_id)
    .bind(metadata)
    .bind(change_summary)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to write site audit log", error))?;
    Ok(())
}

async fn insert_audit_pool(
    pool: &PgPool,
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
    let metadata = serde_json::json!({ "requestedAt": requested_at }).to_string();
    let change_summary = serde_json::json!({ "action": action, "targetId": target_id }).to_string();
    sqlx::query(
        r#"
        INSERT INTO ops_audit_log
            (uuid, tenant_id, organization_id, request_id, operator_id, operator_type, action, target_type, target_id, created_at, metadata, change_summary)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, $10::jsonb, $11::jsonb)
        "#,
    )
    .bind(uuid)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(request_id)
    .bind(operator_id)
    .bind(operator_type)
    .bind(action)
    .bind(audit_target_type(action))
    .bind(target_id)
    .bind(metadata)
    .bind(change_summary)
    .execute(pool)
    .await
    .map_err(|error| store_error("failed to write site audit log", error))?;
    Ok(())
}

fn audit_target_type(action: &str) -> i32 {
    if action.contains("site_model") || action == "replace_site_models" {
        SITE_MODEL_TARGET_TYPE
    } else {
        SITE_TARGET_TYPE
    }
}

fn optional_string_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
}

fn optional_integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<i64> {
    row.try_get::<Option<i64>, _>(column)
        .ok()
        .flatten()
        .or_else(|| row.try_get::<i64, _>(column).ok())
        .or_else(|| {
            row.try_get::<Option<i32>, _>(column)
                .ok()
                .flatten()
                .map(i64::from)
        })
        .or_else(|| row.try_get::<i32, _>(column).ok().map(i64::from))
}

fn optional_i32_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<i32> {
    optional_integer_cell(row, column).and_then(|value| i32::try_from(value).ok())
}

fn required_i32_cell(row: &sqlx::postgres::PgRow, column: &str) -> DomainResult<i32> {
    optional_i32_cell(row, column)
        .ok_or_else(|| DomainError::new(format!("missing integer database column: {column}")))
}

fn bool_cell(row: &sqlx::postgres::PgRow, column: &str) -> bool {
    row.try_get::<Option<bool>, _>(column)
        .ok()
        .flatten()
        .or_else(|| row.try_get::<bool, _>(column).ok())
        .or_else(|| optional_integer_cell(row, column).map(|value| value != 0))
        .unwrap_or(false)
}

fn row_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}

fn conflict_or_store_error(context: &str, error: sqlx::Error) -> DomainError {
    match &error {
        sqlx::Error::Database(database_error)
            if database_error
                .code()
                .map(|code| code == "23505")
                .unwrap_or(false) =>
        {
            DomainError::conflict(format!("{context}: site entry already exists"))
        }
        _ => store_error(context, error),
    }
}
