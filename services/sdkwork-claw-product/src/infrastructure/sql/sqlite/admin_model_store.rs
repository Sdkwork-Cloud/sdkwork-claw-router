use sqlx::{Row, Sqlite, SqlitePool, Transaction};

use crate::domain::{DomainError, DomainResult};
use crate::infrastructure::sql::installer::ENV_MODELS_CATALOG_ROOT;
use crate::infrastructure::sql::model_catalog_import::{
    catalog_key as build_model_catalog_key, catalog_preview_admin_items, catalog_scope_counts,
    catalog_scope_source_hash, catalog_scope_vendor_codes, catalog_with_selected_vendors,
    is_dry_run_mode, load_catalog_root_with_pin, model_base_catalog_key, stable_uuid,
    CatalogScopeCounts,
};
use crate::infrastructure::sql::model_modality;
use crate::ports::{
    AdminAiModelItem, AdminModelCatalogSyncItem, AdminModelCommandFuture, AdminModelStore,
    AdminModelSubject, AdminModelVendorItem, CreateAdminAiModelCommand,
    CreateAdminModelVendorCommand, DeleteAdminAiModelCommand, ListAdminAiModelsQuery,
    ListAdminModelVendorsQuery, SyncAdminModelCatalogCommand, UpdateAdminAiModelCommand,
};

const MODEL_VENDOR_TARGET_TYPE: i32 = 41;
const AI_MODEL_TARGET_TYPE: i32 = 42;
const MODEL_CATALOG_SYNC_TARGET_TYPE: i32 = 43;
const OFFICIAL_REFERENCE_PRICE_SIDE: i32 = 1;
const DEFAULT_MODEL_REGION_CODE: &str = "global";
const INPUT_BILLING_METER_FILTER_SQL: &str = "('llm_input_token', 'embedding_input_token', 'image_input_token', 'audio_input_second', 'audio_input_minute', 'tts_input_character', 'api_request')";
const OUTPUT_BILLING_METER_FILTER_SQL: &str = "('llm_output_token', 'image_output_token', 'image_result', 'audio_output_second', 'music_output_second', 'sfx_result', 'video_output_second', 'api_result')";
const CACHE_READ_BILLING_METER_FILTER_SQL: &str = "('llm_cache_read_token')";
const CACHE_WRITE_BILLING_METER_FILTER_SQL: &str = "('llm_cache_write_token')";

#[derive(Debug, Clone)]
pub struct SqliteAdminModelStore {
    pool: SqlitePool,
    models_catalog_root: Option<String>,
}

#[derive(Debug, Clone)]
struct VendorIdentity {
    id: i64,
    code: String,
    name: String,
}

#[derive(Debug, Clone)]
struct EffectiveModelUpdate {
    model: String,
    display_name: String,
    model_type: String,
    region_code: String,
    price_in: String,
    price_out: String,
    cache_read_price: String,
    cache_write_price: String,
    status: String,
    description: Option<String>,
    modalities: Vec<String>,
    input_modalities: Vec<String>,
    output_modalities: Vec<String>,
    api_format: Option<String>,
    capability_intro: Option<String>,
    limitations: Vec<String>,
    supported_languages: Vec<String>,
    use_cases: Vec<String>,
    training_data_cutoff: Option<String>,
    context_tokens: Option<i64>,
    max_output_tokens: Option<i64>,
    supports_streaming: bool,
    supports_tools: bool,
    supports_json_schema: bool,
    release_stage: i32,
    shelf_state: i32,
    routing_state: i32,
    replacement_model: Option<String>,
}

impl SqliteAdminModelStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self {
            pool,
            models_catalog_root: None,
        }
    }

    pub fn with_models_catalog_root(pool: SqlitePool, models_catalog_root: Option<String>) -> Self {
        Self {
            pool,
            models_catalog_root,
        }
    }
}

impl AdminModelStore for SqliteAdminModelStore {
    fn list_vendors<'a>(
        &'a self,
        query: ListAdminModelVendorsQuery,
    ) -> AdminModelCommandFuture<'a, Vec<AdminModelVendorItem>> {
        Box::pin(async move { list_vendors(&self.pool, query).await })
    }

    fn list_models<'a>(
        &'a self,
        query: ListAdminAiModelsQuery,
    ) -> AdminModelCommandFuture<'a, Vec<AdminAiModelItem>> {
        Box::pin(async move { list_models(&self.pool, query).await })
    }

    fn create_vendor<'a>(
        &'a self,
        command: CreateAdminModelVendorCommand,
    ) -> AdminModelCommandFuture<'a, AdminModelVendorItem> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin model vendor transaction", error)
                })?;
            let vendor_id = insert_vendor(&mut tx, &command).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_model_vendor",
                MODEL_VENDOR_TARGET_TYPE,
                vendor_id,
                serde_json::json!({
                    "action": "create_model_vendor",
                    "vendorId": vendor_id,
                    "vendorCode": &command.vendor_code,
                    "name": &command.name,
                    "status": &command.status
                }),
            )
            .await?;
            let item = load_vendor_by_id(
                &mut tx,
                vendor_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("created model vendor could not be reloaded"))?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit model vendor transaction", error))?;
            Ok(item)
        })
    }

    fn create_model<'a>(
        &'a self,
        command: CreateAdminAiModelCommand,
    ) -> AdminModelCommandFuture<'a, AdminAiModelItem> {
        Box::pin(async move {
            let mut tx = self
                .pool
                .begin()
                .await
                .map_err(|error| store_error("failed to begin ai model transaction", error))?;
            let vendor = find_vendor(&mut tx, &command).await?;
            let model_id = insert_model(&mut tx, &command, &vendor).await?;
            insert_model_capability(&mut tx, model_id, &command, &vendor).await?;
            insert_model_region_pricing(&mut tx, model_id, &command, &vendor).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_ai_model",
                AI_MODEL_TARGET_TYPE,
                model_id,
                serde_json::json!({
                    "action": "create_ai_model",
                    "modelId": model_id,
                    "model": &command.model,
                    "displayName": &command.display_name,
                    "vendorId": vendor.id,
                    "vendorCode": &vendor.code,
                    "type": &command.model_type,
                    "priceIn": &command.price_in,
                    "priceOut": &command.price_out,
                    "cacheReadPrice": &command.cache_read_price,
                    "cacheWritePrice": &command.cache_write_price,
                    "contextTokens": command.context_tokens
                }),
            )
            .await?;
            let item = load_model_by_id(
                &mut tx,
                model_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("created ai model could not be reloaded"))?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit ai model transaction", error))?;
            Ok(item)
        })
    }

    fn update_model<'a>(
        &'a self,
        command: UpdateAdminAiModelCommand,
    ) -> AdminModelCommandFuture<'a, AdminAiModelItem> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin ai model update transaction", error)
            })?;
            let current = find_model_for_update(&mut tx, &command).await?;
            if is_status_only_model_update(&command) {
                let status = command.status.as_deref().unwrap_or(current.status.as_str());
                update_model_status_only(&mut tx, current.id, &command, status).await?;
                insert_audit_log(
                    &mut tx,
                    &command.audit_log_uuid,
                    &command.request_id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    command.subject.operator_id,
                    command.subject.operator_type,
                    "update_ai_model",
                    AI_MODEL_TARGET_TYPE,
                    current.id,
                    serde_json::json!({
                        "action": "update_ai_model",
                        "modelId": current.id,
                        "model": &current.model,
                        "status": status
                    }),
                )
                .await?;
                let item = load_model_by_id(
                    &mut tx,
                    current.id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                )
                .await?
                .ok_or_else(|| DomainError::new("updated ai model could not be reloaded"))?;
                tx.commit().await.map_err(|error| {
                    store_error("failed to commit ai model update transaction", error)
                })?;
                return Ok(item);
            }
            let vendor = match command.vendor_id.as_deref() {
                Some(vendor_id) => {
                    find_vendor_by_value(&mut tx, command.subject, vendor_id).await?
                }
                None => {
                    let vendor_id = current
                        .vendor_id
                        .trim()
                        .parse::<i64>()
                        .map_err(|_| DomainError::not_found("model vendor was not found"))?;
                    find_vendor_by_id_value(&mut tx, command.subject, vendor_id).await?
                }
            };
            let update = effective_model_update(&current, &command);
            let cache_read_price_update = command
                .cache_read_price
                .as_ref()
                .map(|_| update.cache_read_price.as_str());
            let cache_write_price_update = command
                .cache_write_price
                .as_ref()
                .map(|_| update.cache_write_price.as_str());
            update_model_core(&mut tx, current.id, &command, &vendor, &update).await?;
            upsert_model_capability(&mut tx, current.id, &command, &vendor, &update).await?;
            if let Some(region_prices) = command.region_prices.as_ref() {
                replace_model_region_pricing(
                    &mut tx,
                    current.id,
                    &command,
                    &vendor,
                    &update,
                    region_prices,
                )
                .await?;
            } else {
                upsert_model_pricing(&mut tx, current.id, &command, &vendor, &update, true).await?;
                upsert_model_pricing(&mut tx, current.id, &command, &vendor, &update, false)
                    .await?;
                upsert_optional_model_pricing(
                    &mut tx,
                    current.id,
                    &command,
                    &vendor,
                    &update,
                    &command.cache_read_pricing_uuid,
                    "llm_cache_read_token",
                    CACHE_READ_BILLING_METER_FILTER_SQL,
                    cache_read_price_update,
                    3,
                )
                .await?;
                upsert_optional_model_pricing(
                    &mut tx,
                    current.id,
                    &command,
                    &vendor,
                    &update,
                    &command.cache_write_pricing_uuid,
                    "llm_cache_write_token",
                    CACHE_WRITE_BILLING_METER_FILTER_SQL,
                    cache_write_price_update,
                    4,
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
                "update_ai_model",
                AI_MODEL_TARGET_TYPE,
                current.id,
                serde_json::json!({
                    "action": "update_ai_model",
                    "modelId": current.id,
                    "model": &update.model,
                    "displayName": &update.display_name,
                    "vendorId": vendor.id,
                    "vendorCode": &vendor.code,
                    "type": &update.model_type,
                    "priceIn": &update.price_in,
                    "priceOut": &update.price_out,
                    "cacheReadPrice": &update.cache_read_price,
                    "cacheWritePrice": &update.cache_write_price,
                    "contextTokens": update.context_tokens
                }),
            )
            .await?;
            let item = load_model_by_id(
                &mut tx,
                current.id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("updated ai model could not be reloaded"))?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit ai model update transaction", error)
            })?;
            Ok(item)
        })
    }

    fn sync_catalog<'a>(
        &'a self,
        command: SyncAdminModelCatalogCommand,
    ) -> AdminModelCommandFuture<'a, AdminModelCatalogSyncItem> {
        Box::pin(async move {
            let catalog = load_sync_model_catalog(&command, self.models_catalog_root.as_deref())?;
            let catalog_version = catalog.manifest.catalog_version.clone();
            let dry_run = is_dry_run_mode(&command.mode);
            let source_code = normalize_catalog_source_code(&command.source);
            let source_hash = catalog_scope_source_hash(&source_code, &catalog);
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin model catalog sync transaction", error)
            })?;
            if !dry_run {
                apply_sdkwork_models_catalog_refresh(&mut tx, &catalog).await?;
            }
            let (mut vendors, mut models) = if dry_run {
                catalog_preview_admin_items(&catalog, command.subject)
            } else {
                let vendors = list_vendors_tx(
                    &mut tx,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                )
                .await?;
                let models = list_models_tx(
                    &mut tx,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                )
                .await?;
                (vendors, models)
            };
            let scoped_vendor_codes = catalog_scope_vendor_codes(&catalog);
            filter_sync_catalog_items(&mut vendors, &mut models, &scoped_vendor_codes);
            let counts = catalog_scope_counts(&catalog);
            let snapshot_id = insert_pricing_import_snapshot(
                &mut tx,
                &command,
                counts.accepted_count(),
                &catalog_version,
                &source_hash,
                dry_run,
            )
            .await?;
            let sync_run_id = upsert_model_catalog_sync_run(
                &mut tx,
                &command,
                counts,
                &catalog_version,
                &source_hash,
                dry_run,
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
                "sync_model_catalog",
                MODEL_CATALOG_SYNC_TARGET_TYPE,
                sync_run_id,
                serde_json::json!({
                    "action": "sync_model_catalog",
                    "snapshotId": snapshot_id,
                    "syncRunId": sync_run_id,
                    "source": &command.source,
                    "mode": &command.mode,
                    "vendorCodes": &command.vendor_codes,
                    "force": command.force,
                    "catalogVersion": &catalog_version,
                    "catalogRoot": &command.catalog_root,
                    "sourceHash": &source_hash,
                    "dryRun": dry_run,
                    "vendorCount": vendors.len(),
                    "modelCount": models.len()
                }),
            )
            .await?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit model catalog sync transaction", error)
            })?;
            Ok(AdminModelCatalogSyncItem {
                synced: !dry_run,
                source: command.source,
                mode: command.mode,
                dry_run,
                catalog_version,
                requested_catalog_version: command.catalog_version,
                catalog_root: command.catalog_root,
                vendor_codes: scoped_vendor_codes,
                source_hash,
                meter_count: counts.meter_count,
                vendor_count: counts.vendor_count,
                family_count: counts.family_count,
                model_count: counts.model_count,
                capability_count: counts.capability_count,
                price_count: counts.price_count,
                ranking_count: counts.ranking_count,
                accepted_count: counts.accepted_count(),
                snapshot_id: Some(snapshot_id.to_string()),
                sync_run_id: Some(sync_run_id.to_string()),
                vendors,
                models,
            })
        })
    }

    fn delete_model<'a>(
        &'a self,
        command: DeleteAdminAiModelCommand,
    ) -> AdminModelCommandFuture<'a, ()> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin ai model delete transaction", error)
            })?;
            let model = find_model_for_delete(&mut tx, &command).await?;
            soft_delete_model_graph(&mut tx, model.id, &command).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "delete_ai_model",
                AI_MODEL_TARGET_TYPE,
                model.id,
                serde_json::json!({
                    "action": "delete_ai_model",
                    "modelId": model.id,
                    "model": model.model,
                    "displayName": model.display_name,
                    "vendorId": model.vendor_id,
                    "vendorCode": model.vendor_code
                }),
            )
            .await?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit ai model delete transaction", error)
            })?;
            Ok(())
        })
    }
}

fn is_status_only_model_update(command: &UpdateAdminAiModelCommand) -> bool {
    command.status.is_some()
        && command.vendor_id.is_none()
        && command.model.is_none()
        && command.display_name.is_none()
        && command.model_type.is_none()
        && command.price_in.is_none()
        && command.price_out.is_none()
        && command.cache_read_price.is_none()
        && command.cache_write_price.is_none()
        && command.region_code.is_none()
        && command.region_prices.is_none()
        && command.description.is_none()
        && command.modalities.is_none()
        && command.input_modalities.is_none()
        && command.output_modalities.is_none()
        && command.api_format.is_none()
        && command.capability_intro.is_none()
        && command.limitations.is_none()
        && command.supported_languages.is_none()
        && command.use_cases.is_none()
        && command.training_data_cutoff.is_none()
        && command.context_tokens.is_none()
        && command.max_output_tokens.is_none()
        && command.supports_streaming.is_none()
        && command.supports_tools.is_none()
        && command.supports_json_schema.is_none()
        && command.release_stage.is_none()
        && command.shelf_state.is_none()
        && command.routing_state.is_none()
        && command.replacement_model.is_none()
}

async fn apply_sdkwork_models_catalog_refresh(
    tx: &mut Transaction<'_, Sqlite>,
    catalog: &sdkwork_models::ModelCatalog,
) -> DomainResult<()> {
    crate::infrastructure::sql::sqlite::model_catalog_import::import_sqlite_model_catalog_tx(
        tx, catalog,
    )
    .await
    .map_err(|error| store_error("failed to refresh sdkwork models catalog", error))?;
    Ok(())
}

fn load_sync_model_catalog(
    command: &SyncAdminModelCatalogCommand,
    configured_catalog_root: Option<&str>,
) -> DomainResult<sdkwork_models::ModelCatalog> {
    let env_root = std::env::var(ENV_MODELS_CATALOG_ROOT).ok();
    let root = command
        .catalog_root
        .as_deref()
        .or(configured_catalog_root)
        .or_else(|| env_root.as_deref())
        .map(str::trim)
        .filter(|value| !value.is_empty());
    let catalog =
        load_catalog_root_with_pin(root, command.catalog_version.as_deref()).map_err(|error| {
            DomainError::new(format!("failed to load sdkwork models catalog: {error}"))
        })?;
    catalog_with_selected_vendors(&catalog, &command.vendor_codes).map_err(|error| {
        DomainError::new(format!(
            "failed to select sdkwork models catalog vendors: {error}"
        ))
    })
}

async fn list_vendors(
    pool: &SqlitePool,
    query: ListAdminModelVendorsQuery,
) -> DomainResult<Vec<AdminModelVendorItem>> {
    let rows = sqlx::query(
        vendor_select_sql(
            r#"
        WHERE (tenant_id IS NULL OR tenant_id = 0 OR tenant_id = ?)
          AND (organization_id IS NULL OR organization_id = 0 OR organization_id = ?)
          AND deleted_at IS NULL
        ORDER BY
          CASE WHEN tenant_id = ? AND organization_id = ? THEN 0 ELSE 1 END,
          COALESCE(sort_order, 1000000) ASC,
          display_name ASC,
          id ASC
        "#,
        )
        .as_str(),
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list model vendors", error))?;
    rows.into_iter().map(vendor_from_row).collect()
}

async fn list_models(
    pool: &SqlitePool,
    query: ListAdminAiModelsQuery,
) -> DomainResult<Vec<AdminAiModelItem>> {
    let rows = sqlx::query(
        model_select_sql(
            r#"
        WHERE (m.tenant_id IS NULL OR m.tenant_id = 0 OR m.tenant_id = ?)
          AND (m.organization_id IS NULL OR m.organization_id = 0 OR m.organization_id = ?)
          AND m.deleted_at IS NULL
          AND NOT EXISTS (
              SELECT 1
              FROM ai_model tenant_model
              WHERE tenant_model.tenant_id = ?
                AND tenant_model.organization_id = ?
                AND tenant_model.model = m.model
                AND tenant_model.id <> m.id
                AND tenant_model.deleted_at IS NULL
          )
        ORDER BY
          CAST(COALESCE(m.rank_score, '0') AS REAL) DESC,
          CASE WHEN m.tenant_id = ? AND m.organization_id = ? THEN 0 ELSE 1 END,
          m.display_name ASC,
          m.id ASC
        "#,
            query.subject.tenant_id,
            query.subject.organization_id,
        )
        .as_str(),
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list ai models", error))?;
    rows.into_iter().map(model_from_row).collect()
}

async fn list_vendors_tx(
    tx: &mut Transaction<'_, Sqlite>,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Vec<AdminModelVendorItem>> {
    let rows = sqlx::query(
        vendor_select_sql(
            r#"
        WHERE (tenant_id IS NULL OR tenant_id = 0 OR tenant_id = ?)
          AND (organization_id IS NULL OR organization_id = 0 OR organization_id = ?)
          AND deleted_at IS NULL
        ORDER BY
          CASE WHEN tenant_id = ? AND organization_id = ? THEN 0 ELSE 1 END,
          COALESCE(sort_order, 1000000) ASC,
          display_name ASC,
          id ASC
        "#,
        )
        .as_str(),
    )
    .bind(tenant_id)
    .bind(organization_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_all(&mut **tx)
    .await
    .map_err(|error| store_error("failed to list model vendors", error))?;
    rows.into_iter().map(vendor_from_row).collect()
}

async fn list_models_tx(
    tx: &mut Transaction<'_, Sqlite>,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Vec<AdminAiModelItem>> {
    let rows = sqlx::query(
        model_select_sql(
            r#"
        WHERE (m.tenant_id IS NULL OR m.tenant_id = 0 OR m.tenant_id = ?)
          AND (m.organization_id IS NULL OR m.organization_id = 0 OR m.organization_id = ?)
          AND m.deleted_at IS NULL
          AND NOT EXISTS (
              SELECT 1
              FROM ai_model tenant_model
              WHERE tenant_model.tenant_id = ?
                AND tenant_model.organization_id = ?
                AND tenant_model.model = m.model
                AND tenant_model.id <> m.id
                AND tenant_model.deleted_at IS NULL
          )
        ORDER BY
          CAST(COALESCE(m.rank_score, '0') AS REAL) DESC,
          CASE WHEN m.tenant_id = ? AND m.organization_id = ? THEN 0 ELSE 1 END,
          m.display_name ASC,
          m.id ASC
        "#,
            tenant_id,
            organization_id,
        )
        .as_str(),
    )
    .bind(tenant_id)
    .bind(organization_id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_all(&mut **tx)
    .await
    .map_err(|error| store_error("failed to list ai models", error))?;
    rows.into_iter().map(model_from_row).collect()
}

async fn insert_vendor(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminModelVendorCommand,
) -> DomainResult<i64> {
    sqlx::query(
        r#"
        INSERT INTO ai_model_vendor
            (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata, vendor_code, display_name, description, color_token, sort_order)
        VALUES
            (?, ?, ?, 1, ?, ?, ?, 0, '{}', ?, ?, ?, ?, COALESCE((SELECT MAX(sort_order) + 1 FROM ai_model_vendor), 1))
        "#,
    )
    .bind(&command.vendor_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(status_code(&command.status))
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(&command.vendor_code)
    .bind(&command.name)
    .bind(&command.description)
    .bind(&command.color)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create model vendor", error))?;
    last_insert_rowid(tx).await
}

async fn find_vendor(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminAiModelCommand,
) -> DomainResult<VendorIdentity> {
    find_vendor_by_value(tx, command.subject, &command.vendor_id).await
}

async fn find_vendor_by_value(
    tx: &mut Transaction<'_, Sqlite>,
    subject: AdminModelSubject,
    vendor_id: &str,
) -> DomainResult<VendorIdentity> {
    let vendor_code = normalize_vendor_lookup(vendor_id);
    let numeric_id = vendor_id.trim().parse::<i64>().ok();
    let row = sqlx::query(
        r#"
        SELECT id, COALESCE(vendor_code, '') AS vendor_code, COALESCE(display_name, vendor_code, '') AS display_name
        FROM ai_model_vendor
        WHERE (tenant_id IS NULL OR tenant_id = 0 OR tenant_id = ?)
          AND (organization_id IS NULL OR organization_id = 0 OR organization_id = ?)
          AND deleted_at IS NULL
          AND (? IS NOT NULL AND id = ? OR vendor_code = ? OR display_name = ?)
        ORDER BY
          CASE WHEN tenant_id = ? AND organization_id = ? THEN 0 ELSE 1 END,
          CASE WHEN id = ? THEN 0 ELSE 1 END,
          id ASC
        LIMIT 1
        "#,
    )
    .bind(subject.tenant_id)
    .bind(subject.organization_id)
    .bind(numeric_id)
    .bind(numeric_id.unwrap_or(0))
    .bind(&vendor_code)
    .bind(vendor_id)
    .bind(subject.tenant_id)
    .bind(subject.organization_id)
    .bind(numeric_id.unwrap_or(0))
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to find model vendor", error))?;
    let Some(row) = row else {
        return Err(DomainError::not_found("model vendor was not found"));
    };
    Ok(VendorIdentity {
        id: row.try_get("id").map_err(row_error)?,
        code: row.try_get("vendor_code").map_err(row_error)?,
        name: row.try_get("display_name").map_err(row_error)?,
    })
}

async fn find_vendor_by_id_value(
    tx: &mut Transaction<'_, Sqlite>,
    subject: AdminModelSubject,
    vendor_id: i64,
) -> DomainResult<VendorIdentity> {
    let row = sqlx::query(
        r#"
        SELECT id, COALESCE(vendor_code, '') AS vendor_code, COALESCE(display_name, vendor_code, '') AS display_name
        FROM ai_model_vendor
        WHERE id = ?
          AND (tenant_id IS NULL OR tenant_id = 0 OR tenant_id = ?)
          AND (organization_id IS NULL OR organization_id = 0 OR organization_id = ?)
          AND deleted_at IS NULL
        LIMIT 1
        "#,
    )
    .bind(vendor_id)
    .bind(subject.tenant_id)
    .bind(subject.organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to find model vendor", error))?;
    let Some(row) = row else {
        return Err(DomainError::not_found("model vendor was not found"));
    };
    Ok(VendorIdentity {
        id: row.try_get("id").map_err(row_error)?,
        code: row.try_get("vendor_code").map_err(row_error)?,
        name: row.try_get("display_name").map_err(row_error)?,
    })
}

async fn insert_model(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminAiModelCommand,
    vendor: &VendorIdentity,
) -> DomainResult<i64> {
    let capability = capability_code(&command.model_type);
    let modalities = json_array_text(&command.modalities)?;
    let input_modalities = json_array_text(&command.input_modalities)?;
    let output_modalities = json_array_text(&command.output_modalities)?;
    let limitations = json_array_text(&command.limitations)?;
    let supported_languages = json_array_text(&command.supported_languages)?;
    let use_cases = json_array_text(&command.use_cases)?;
    let catalog_key = model_base_catalog_key(&vendor.code, &command.model);
    sqlx::query(
        r#"
        INSERT INTO ai_model
            (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, deleted_at, metadata, catalog_key, model, display_name, vendor_id, vendor_code, vendor_name_snapshot, capability, modalities, input_modalities, output_modalities, description, capability_intro, limitations, supported_languages, use_cases, training_data_cutoff, context_tokens, max_output_tokens, supports_streaming, supports_tools, supports_json_schema, api_format, release_stage, shelf_state, routing_state, replacement_model, rank_score)
        VALUES
            (?, ?, ?, 1, 1, ?, ?, 0, NULL, '{}', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#,
    )
    .bind(&command.model_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(catalog_key)
    .bind(&command.model)
    .bind(&command.display_name)
    .bind(vendor.id)
    .bind(&vendor.code)
    .bind(&vendor.name)
    .bind(capability)
    .bind(modalities)
    .bind(input_modalities)
    .bind(output_modalities)
    .bind(command.description.as_deref())
    .bind(command.capability_intro.as_deref())
    .bind(limitations)
    .bind(supported_languages)
    .bind(use_cases)
    .bind(command.training_data_cutoff.as_deref())
    .bind(command.context_tokens)
    .bind(command.max_output_tokens)
    .bind(command.supports_streaming)
    .bind(command.supports_tools)
    .bind(command.supports_json_schema)
    .bind(&command.api_format)
    .bind(command.release_stage)
    .bind(command.shelf_state)
    .bind(command.routing_state)
    .bind(command.replacement_model.as_deref())
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create ai model", error))?;
    last_insert_rowid(tx).await
}

async fn insert_model_capability(
    tx: &mut Transaction<'_, Sqlite>,
    model_id: i64,
    command: &CreateAdminAiModelCommand,
    vendor: &VendorIdentity,
) -> DomainResult<()> {
    let capability_code_text = model_capability_code(&command.model_type);
    let catalog_key = model_base_catalog_key(&vendor.code, &command.model);
    sqlx::query(
        r#"
        INSERT INTO ai_model_capability
            (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata, model_id, catalog_key, model, vendor_code, capability, capability_code, modality, input_modalities, output_modalities, supported, schema_version, sort_order)
        VALUES
            (?, ?, ?, 1, 1, ?, ?, 0, '{}', ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'v1', 1)
        "#,
    )
    .bind(&command.capability_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(model_id)
    .bind(catalog_key)
    .bind(&command.model)
    .bind(&vendor.code)
    .bind(capability_code(&command.model_type))
    .bind(capability_code_text)
    .bind(modality_code(&command.model_type))
    .bind(json_array_text(&command.input_modalities)?)
    .bind(json_array_text(&command.output_modalities)?)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create model capability", error))?;
    Ok(())
}

async fn insert_model_region_pricing(
    tx: &mut Transaction<'_, Sqlite>,
    model_id: i64,
    command: &CreateAdminAiModelCommand,
    vendor: &VendorIdentity,
) -> DomainResult<()> {
    for region_price in &command.region_prices {
        insert_region_model_pricing(
            tx,
            model_id,
            command,
            vendor,
            &region_price.region_code,
            input_billing_meter(&command.model_type),
            &region_price.price_in,
            1,
            "input",
        )
        .await?;
        insert_region_model_pricing(
            tx,
            model_id,
            command,
            vendor,
            &region_price.region_code,
            output_billing_meter(&command.model_type),
            &region_price.price_out,
            2,
            "output",
        )
        .await?;
        if let Some(price) = region_price
            .cache_read_price
            .as_deref()
            .filter(|price| !price.trim().is_empty())
        {
            insert_region_model_pricing(
                tx,
                model_id,
                command,
                vendor,
                &region_price.region_code,
                "llm_cache_read_token",
                price,
                3,
                "cache_read",
            )
            .await?;
        }
        if let Some(price) = region_price
            .cache_write_price
            .as_deref()
            .filter(|price| !price.trim().is_empty())
        {
            insert_region_model_pricing(
                tx,
                model_id,
                command,
                vendor,
                &region_price.region_code,
                "llm_cache_write_token",
                price,
                4,
                "cache_write",
            )
            .await?;
        }
    }
    Ok(())
}

async fn insert_region_model_pricing(
    tx: &mut Transaction<'_, Sqlite>,
    model_id: i64,
    command: &CreateAdminAiModelCommand,
    vendor: &VendorIdentity,
    region_code: &str,
    meter: &str,
    unit_price: &str,
    priority: i32,
    price_kind: &str,
) -> DomainResult<()> {
    let catalog_key = model_catalog_key(&vendor.code, region_code, &command.model);
    let uuid = stable_uuid(
        "admin-price",
        &[&command.model_uuid, region_code, meter, price_kind],
    );
    sqlx::query(
        r#"
        INSERT INTO ai_model_pricing
            (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata, model_id, catalog_key, model, vendor_code, region_code, price_side, pricing_scope, billing_type, billing_mode, billing_meter_code, price_item_type, unit, unit_size, metering_mode, quantity_source, minimum_quantity, quantity_step, included_quantity, unit_price, currency, rounding_mode, min_charge_amount, pricing_formula_mode, price_origin, priority, effective_from)
        VALUES
            (?, ?, ?, 1, 1, ?, ?, 0, '{}', ?, ?, ?, ?, ?, ?, 1, 1, 1, ?, 1, 1, 1, 1, 1, 0, 1, 0, ?, 'USD', 1, 0, 1, 1, ?, ?)
        "#,
    )
    .bind(uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(model_id)
    .bind(catalog_key)
    .bind(&command.model)
    .bind(&vendor.code)
    .bind(region_code)
    .bind(OFFICIAL_REFERENCE_PRICE_SIDE)
    .bind(meter)
    .bind(unit_price)
    .bind(priority)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create regional model pricing", error))?;
    Ok(())
}

async fn insert_pricing_import_snapshot(
    tx: &mut Transaction<'_, Sqlite>,
    command: &SyncAdminModelCatalogCommand,
    row_count: i64,
    catalog_version: &str,
    source_hash: &str,
    dry_run: bool,
) -> DomainResult<i64> {
    let snapshot_source_hash = pricing_import_snapshot_hash(command, source_hash);
    let metadata = serde_json::json!({
        "source": command.source,
        "mode": command.mode,
        "vendorCodes": command.vendor_codes,
        "force": command.force,
        "catalogVersion": catalog_version,
        "catalogRoot": &command.catalog_root,
        "requestedCatalogVersion": &command.catalog_version,
        "sourceHash": source_hash,
        "catalogSourceHash": source_hash,
        "snapshotSourceHash": snapshot_source_hash,
        "dryRun": dry_run,
        "refreshKind": "admin_fast_catalog_refresh",
    })
    .to_string();
    sqlx::query(
        r#"
        INSERT INTO ai_pricing_import_snapshot
            (uuid, tenant_id, organization_id, user_id, request_id, status, metadata, import_source, source_name, source_hash, data_format, row_count, accepted_count, rejected_count, currency, observed_at)
        VALUES
            (?, ?, ?, ?, ?, 1, ?, 1, ?, ?, 'database', ?, ?, 0, 'USD', ?)
        "#,
    )
    .bind(&command.snapshot_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.operator_id)
    .bind(&command.request_id)
    .bind(metadata)
    .bind(&command.source)
    .bind(snapshot_source_hash)
    .bind(row_count)
    .bind(row_count)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to write pricing import snapshot", error))?;
    last_insert_rowid(tx).await
}

fn filter_sync_catalog_items(
    vendors: &mut Vec<AdminModelVendorItem>,
    models: &mut Vec<AdminAiModelItem>,
    vendor_codes: &[String],
) {
    if vendor_codes.is_empty() {
        return;
    }
    vendors.retain(|vendor| {
        vendor_codes
            .iter()
            .any(|vendor_code| vendor_code == &vendor.vendor_code)
    });
    models.retain(|model| {
        vendor_codes
            .iter()
            .any(|vendor_code| vendor_code == &model.vendor_code)
    });
}

async fn upsert_model_catalog_sync_run(
    tx: &mut Transaction<'_, Sqlite>,
    command: &SyncAdminModelCatalogCommand,
    counts: CatalogScopeCounts,
    catalog_version: &str,
    source_hash: &str,
    dry_run: bool,
) -> DomainResult<i64> {
    let source_code = normalize_catalog_source_code(&command.source);
    let source_name = format!("{} model catalog", command.source);
    let source_url = format!("manual://{}", source_code);
    let source_uuid = format!("catalog-source-{}", source_code);
    let sync_run_uuid = format!("catalog-sync-{}", command.snapshot_uuid);
    let last_success_at = if dry_run {
        None
    } else {
        Some(command.requested_at.as_str())
    };
    let metadata = serde_json::json!({
        "source": command.source,
        "requestId": command.request_id,
        "catalogVersion": catalog_version,
        "requestedCatalogVersion": &command.catalog_version,
        "catalogRoot": &command.catalog_root,
        "syncMode": command.mode,
        "vendorCodes": command.vendor_codes,
        "force": command.force,
        "sourceHash": source_hash,
        "dryRun": dry_run,
    })
    .to_string();
    let change_summary = serde_json::json!({
        "vendors": "snapshot",
        "models": counts.model_count,
        "accepted": counts.accepted_count(),
        "rejected": 0,
        "mode": command.mode,
        "vendorCodes": command.vendor_codes,
        "force": command.force,
        "catalogVersion": catalog_version,
        "sourceHash": source_hash,
        "dryRun": dry_run,
        "counts": {
            "meters": counts.meter_count,
            "vendors": counts.vendor_count,
            "families": counts.family_count,
            "models": counts.model_count,
            "capabilities": counts.capability_count,
            "prices": counts.price_count,
            "rankings": counts.ranking_count,
            "accepted": counts.accepted_count()
        }
    })
    .to_string();

    if dry_run {
        let dry_run_metadata = serde_json::json!({
            "source": command.source,
            "requestId": command.request_id,
            "syncMode": command.mode,
            "vendorCodes": command.vendor_codes,
            "force": command.force,
            "dryRun": true,
            "lastObservationOnly": true,
            "observedSourceHash": source_hash,
        })
        .to_string();
        sqlx::query(
            r#"
            INSERT INTO ai_model_catalog_source
                (uuid, tenant_id, organization_id, data_scope, status, metadata, source_code, vendor_code, provider_code, source_name, source_url, source_kind, trust_level, parser_kind, refresh_interval_seconds, last_observed_at, last_success_at, catalog_version, source_hash)
            VALUES
                (?, ?, ?, 1, 1, ?, ?, 'mixed', NULL, ?, ?, 2, 1, 'manual_refresh', 21600, ?, ?, ?, ?)
            ON CONFLICT(tenant_id, organization_id, source_code) DO UPDATE SET
                updated_at = CURRENT_TIMESTAMP,
                source_name = excluded.source_name,
                source_url = excluded.source_url,
                last_observed_at = excluded.last_observed_at,
                deleted_at = NULL,
                deleted_by = NULL,
                status = excluded.status
            "#,
        )
        .bind(&source_uuid)
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(&dry_run_metadata)
        .bind(&source_code)
        .bind(&source_name)
        .bind(&source_url)
        .bind(&command.requested_at)
        .bind(Option::<&str>::None)
        .bind(Option::<&str>::None)
        .bind(Option::<&str>::None)
        .execute(&mut **tx)
        .await
        .map_err(|error| store_error("failed to upsert model catalog source", error))?;
    } else {
        sqlx::query(
            r#"
            INSERT INTO ai_model_catalog_source
                (uuid, tenant_id, organization_id, data_scope, status, metadata, source_code, vendor_code, provider_code, source_name, source_url, source_kind, trust_level, parser_kind, refresh_interval_seconds, last_observed_at, last_success_at, catalog_version, source_hash)
            VALUES
                (?, ?, ?, 1, 1, ?, ?, 'mixed', NULL, ?, ?, 2, 1, 'manual_refresh', 21600, ?, ?, ?, ?)
            ON CONFLICT(tenant_id, organization_id, source_code) DO UPDATE SET
                updated_at = CURRENT_TIMESTAMP,
                metadata = excluded.metadata,
                source_name = excluded.source_name,
                source_url = excluded.source_url,
                last_observed_at = excluded.last_observed_at,
                last_success_at = excluded.last_success_at,
                catalog_version = excluded.catalog_version,
                source_hash = excluded.source_hash,
                deleted_at = NULL,
                deleted_by = NULL,
                status = excluded.status
            "#,
        )
        .bind(&source_uuid)
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(&metadata)
        .bind(&source_code)
        .bind(&source_name)
        .bind(&source_url)
        .bind(&command.requested_at)
        .bind(last_success_at)
        .bind(catalog_version)
        .bind(source_hash)
        .execute(&mut **tx)
        .await
        .map_err(|error| store_error("failed to upsert model catalog source", error))?;
    }

    let source_id: i64 = sqlx::query_scalar(
        r#"
        SELECT id
        FROM ai_model_catalog_source
        WHERE tenant_id = ? AND organization_id = ? AND source_code = ?
        LIMIT 1
        "#,
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&source_code)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to reload model catalog source", error))?;

    sqlx::query(
        r#"
        INSERT INTO ai_model_catalog_sync_run
            (uuid, tenant_id, organization_id, source_type, source_id, source_version, status, metadata, source_code, vendor_code, provider_code, run_status, started_at, finished_at, observed_at, catalog_version, source_hash, observed_vendor_count, observed_model_count, observed_meter_count, observed_price_count, accepted_count, rejected_count, change_summary)
        VALUES
            (?, ?, ?, 'manual_refresh', ?, 1, 1, ?, ?, 'mixed', NULL, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
        "#,
    )
    .bind(&sync_run_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(source_id)
    .bind(metadata)
    .bind(&source_code)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(catalog_version)
    .bind(source_hash)
    .bind(counts.vendor_count as i64)
    .bind(counts.model_count as i64)
    .bind(counts.meter_count as i64)
    .bind(counts.price_count as i64)
    .bind(counts.accepted_count())
    .bind(change_summary)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert model catalog sync run", error))?;

    last_insert_rowid(tx).await
}

async fn load_vendor_by_id(
    tx: &mut Transaction<'_, Sqlite>,
    vendor_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminModelVendorItem>> {
    let row = sqlx::query(
        vendor_select_sql(
            r#"
        WHERE id = ?
          AND (tenant_id IS NULL OR tenant_id = 0 OR tenant_id = ?)
          AND (organization_id IS NULL OR organization_id = 0 OR organization_id = ?)
        LIMIT 1
        "#,
        )
        .as_str(),
    )
    .bind(vendor_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load model vendor", error))?;
    row.map(vendor_from_row).transpose()
}

async fn load_model_by_id(
    tx: &mut Transaction<'_, Sqlite>,
    model_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminAiModelItem>> {
    let row = sqlx::query(
        model_select_sql(
            r#"
        WHERE m.id = ?
          AND (m.tenant_id IS NULL OR m.tenant_id = 0 OR m.tenant_id = ?)
          AND (m.organization_id IS NULL OR m.organization_id = 0 OR m.organization_id = ?)
        LIMIT 1
        "#,
            tenant_id,
            organization_id,
        )
        .as_str(),
    )
    .bind(model_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load ai model", error))?;
    row.map(model_from_row).transpose()
}

async fn find_model_for_delete(
    tx: &mut Transaction<'_, Sqlite>,
    command: &DeleteAdminAiModelCommand,
) -> DomainResult<AdminAiModelItem> {
    let numeric_id = command.model_id.trim().parse::<i64>().ok();
    let row = sqlx::query(
        model_select_sql(
            r#"
        WHERE (m.tenant_id IS NULL OR m.tenant_id = 0 OR m.tenant_id = ?)
          AND (m.organization_id IS NULL OR m.organization_id = 0 OR m.organization_id = ?)
          AND m.deleted_at IS NULL
          AND (? IS NOT NULL AND m.id = ? OR m.uuid = ?)
        ORDER BY
          CASE WHEN m.tenant_id = ? AND m.organization_id = ? THEN 0 ELSE 1 END,
          CASE WHEN m.id = ? THEN 0 ELSE 1 END,
          m.id ASC
        LIMIT 1
        "#,
            command.subject.tenant_id,
            command.subject.organization_id,
        )
        .as_str(),
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(numeric_id)
    .bind(numeric_id.unwrap_or(0))
    .bind(&command.model_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(numeric_id.unwrap_or(0))
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to find ai model for delete", error))?;
    row.map(model_from_row)
        .transpose()?
        .ok_or_else(|| DomainError::not_found("ai model was not found"))
}

async fn find_model_for_update(
    tx: &mut Transaction<'_, Sqlite>,
    command: &UpdateAdminAiModelCommand,
) -> DomainResult<AdminAiModelItem> {
    let numeric_id = command.model_id.trim().parse::<i64>().ok();
    let row = sqlx::query(
        model_select_sql(
            r#"
        WHERE (m.tenant_id IS NULL OR m.tenant_id = 0 OR m.tenant_id = ?)
          AND (m.organization_id IS NULL OR m.organization_id = 0 OR m.organization_id = ?)
          AND m.deleted_at IS NULL
          AND (? IS NOT NULL AND m.id = ? OR m.uuid = ?)
        ORDER BY
          CASE WHEN m.tenant_id = ? AND m.organization_id = ? THEN 0 ELSE 1 END,
          CASE WHEN m.id = ? THEN 0 ELSE 1 END,
          m.id ASC
        LIMIT 1
        "#,
            command.subject.tenant_id,
            command.subject.organization_id,
        )
        .as_str(),
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(numeric_id)
    .bind(numeric_id.unwrap_or(0))
    .bind(&command.model_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(numeric_id.unwrap_or(0))
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to find ai model for update", error))?;
    row.map(model_from_row)
        .transpose()?
        .ok_or_else(|| DomainError::not_found("ai model was not found"))
}

fn effective_model_update(
    current: &AdminAiModelItem,
    command: &UpdateAdminAiModelCommand,
) -> EffectiveModelUpdate {
    let model_type = command
        .model_type
        .clone()
        .unwrap_or_else(|| current.model_type.clone());
    let next_model = command
        .model
        .clone()
        .unwrap_or_else(|| current.model.clone());
    let display_name = match command.display_name.clone() {
        Some(Some(display_name)) => display_name,
        Some(None) => next_model.clone(),
        None if current.display_name.trim().is_empty() || current.display_name == current.model => {
            next_model.clone()
        }
        None => current.display_name.clone(),
    };
    EffectiveModelUpdate {
        model: next_model,
        display_name,
        model_type,
        region_code: command
            .region_code
            .clone()
            .unwrap_or_else(|| current.region_code.clone()),
        price_in: command
            .price_in
            .clone()
            .unwrap_or_else(|| current.price_in.clone()),
        price_out: command
            .price_out
            .clone()
            .unwrap_or_else(|| current.price_out.clone()),
        cache_read_price: command
            .cache_read_price
            .clone()
            .unwrap_or_else(|| Some(current.cache_read_price.clone()))
            .unwrap_or_default(),
        cache_write_price: command
            .cache_write_price
            .clone()
            .unwrap_or_else(|| Some(current.cache_write_price.clone()))
            .unwrap_or_default(),
        status: command
            .status
            .clone()
            .unwrap_or_else(|| current.status.clone()),
        description: command
            .description
            .clone()
            .unwrap_or_else(|| current.description.clone()),
        modalities: command
            .modalities
            .clone()
            .unwrap_or_else(|| current.modalities.clone()),
        input_modalities: command
            .input_modalities
            .clone()
            .unwrap_or_else(|| current.input_modalities.clone()),
        output_modalities: command
            .output_modalities
            .clone()
            .unwrap_or_else(|| current.output_modalities.clone()),
        api_format: command
            .api_format
            .clone()
            .or_else(|| current.api_format.clone()),
        capability_intro: command
            .capability_intro
            .clone()
            .unwrap_or_else(|| current.capability_intro.clone()),
        limitations: command
            .limitations
            .clone()
            .unwrap_or_else(|| current.limitations.clone()),
        supported_languages: command
            .supported_languages
            .clone()
            .unwrap_or_else(|| current.supported_languages.clone()),
        use_cases: command
            .use_cases
            .clone()
            .unwrap_or_else(|| current.use_cases.clone()),
        training_data_cutoff: command
            .training_data_cutoff
            .clone()
            .unwrap_or_else(|| current.training_data_cutoff.clone()),
        context_tokens: command.context_tokens.or(current.context_tokens),
        max_output_tokens: command
            .max_output_tokens
            .unwrap_or(current.max_output_tokens),
        supports_streaming: command
            .supports_streaming
            .unwrap_or(current.supports_streaming),
        supports_tools: command.supports_tools.unwrap_or(current.supports_tools),
        supports_json_schema: command
            .supports_json_schema
            .unwrap_or(current.supports_json_schema),
        release_stage: command.release_stage.or(current.release_stage).unwrap_or(1),
        shelf_state: command.shelf_state.or(current.shelf_state).unwrap_or(1),
        routing_state: command.routing_state.or(current.routing_state).unwrap_or(1),
        replacement_model: command
            .replacement_model
            .clone()
            .unwrap_or_else(|| current.replacement_model.clone()),
    }
}

async fn update_model_status_only(
    tx: &mut Transaction<'_, Sqlite>,
    model_id: i64,
    command: &UpdateAdminAiModelCommand,
    status: &str,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE ai_model
        SET status = ?,
            updated_at = ?,
            version = COALESCE(version, 0) + 1
        WHERE id = ?
          AND deleted_at IS NULL
        "#,
    )
    .bind(status_code(status))
    .bind(&command.requested_at)
    .bind(model_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update ai model status", error))?;
    Ok(())
}

async fn update_model_core(
    tx: &mut Transaction<'_, Sqlite>,
    model_id: i64,
    command: &UpdateAdminAiModelCommand,
    vendor: &VendorIdentity,
    update: &EffectiveModelUpdate,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE ai_model
        SET status = ?,
            updated_at = ?,
            version = COALESCE(version, 0) + 1,
            model = ?,
            display_name = ?,
            vendor_id = ?,
            vendor_code = ?,
            catalog_key = ?,
            vendor_name_snapshot = ?,
            capability = ?,
            modalities = ?,
            input_modalities = ?,
            output_modalities = ?,
            description = ?,
            capability_intro = ?,
            limitations = ?,
            supported_languages = ?,
            use_cases = ?,
            training_data_cutoff = ?,
            context_tokens = ?,
            max_output_tokens = ?,
            supports_streaming = ?,
            supports_tools = ?,
            supports_json_schema = ?,
            api_format = ?,
            release_stage = ?,
            shelf_state = ?,
            routing_state = ?,
            replacement_model = ?
        WHERE id = ?
          AND deleted_at IS NULL
        "#,
    )
    .bind(status_code(&update.status))
    .bind(&command.requested_at)
    .bind(&update.model)
    .bind(&update.display_name)
    .bind(vendor.id)
    .bind(&vendor.code)
    .bind(model_base_catalog_key(&vendor.code, &update.model))
    .bind(&vendor.name)
    .bind(capability_code(&update.model_type))
    .bind(json_array_text(&update.modalities)?)
    .bind(json_array_text(&update.input_modalities)?)
    .bind(json_array_text(&update.output_modalities)?)
    .bind(update.description.as_deref())
    .bind(update.capability_intro.as_deref())
    .bind(json_array_text(&update.limitations)?)
    .bind(json_array_text(&update.supported_languages)?)
    .bind(json_array_text(&update.use_cases)?)
    .bind(update.training_data_cutoff.as_deref())
    .bind(update.context_tokens)
    .bind(update.max_output_tokens)
    .bind(update.supports_streaming)
    .bind(update.supports_tools)
    .bind(update.supports_json_schema)
    .bind(update.api_format.as_deref())
    .bind(update.release_stage)
    .bind(update.shelf_state)
    .bind(update.routing_state)
    .bind(update.replacement_model.as_deref())
    .bind(model_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update ai model", error))?;
    Ok(())
}

async fn upsert_model_capability(
    tx: &mut Transaction<'_, Sqlite>,
    model_id: i64,
    command: &UpdateAdminAiModelCommand,
    vendor: &VendorIdentity,
    update: &EffectiveModelUpdate,
) -> DomainResult<()> {
    let capability_code_text = model_capability_code(&update.model_type);
    let result = sqlx::query(
        r#"
        UPDATE ai_model_capability
        SET status = 1,
            deleted_at = NULL,
            updated_at = ?,
            model = ?,
            vendor_code = ?,
            catalog_key = ?,
            capability = ?,
            capability_code = ?,
            modality = ?,
            input_modalities = ?,
            output_modalities = ?,
            supported = 1
        WHERE model_id = ?
          AND deleted_at IS NULL
        "#,
    )
    .bind(&command.requested_at)
    .bind(&update.model)
    .bind(&vendor.code)
    .bind(model_base_catalog_key(&vendor.code, &update.model))
    .bind(capability_code(&update.model_type))
    .bind(capability_code_text)
    .bind(modality_code(&update.model_type))
    .bind(json_array_text(&update.input_modalities)?)
    .bind(json_array_text(&update.output_modalities)?)
    .bind(model_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update model capability", error))?;
    if result.rows_affected() > 0 {
        return Ok(());
    }
    sqlx::query(
        r#"
        INSERT INTO ai_model_capability
            (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata, model_id, catalog_key, model, vendor_code, capability, capability_code, modality, input_modalities, output_modalities, supported, schema_version, sort_order)
        VALUES
            (?, ?, ?, 1, 1, ?, ?, 0, '{}', ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'v1', 1)
        "#,
    )
    .bind(&command.capability_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(model_id)
    .bind(model_base_catalog_key(&vendor.code, &update.model))
    .bind(&update.model)
    .bind(&vendor.code)
    .bind(capability_code(&update.model_type))
    .bind(capability_code_text)
    .bind(modality_code(&update.model_type))
    .bind(json_array_text(&update.input_modalities)?)
    .bind(json_array_text(&update.output_modalities)?)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create model capability during update", error))?;
    Ok(())
}

async fn upsert_model_pricing(
    tx: &mut Transaction<'_, Sqlite>,
    model_id: i64,
    command: &UpdateAdminAiModelCommand,
    vendor: &VendorIdentity,
    update: &EffectiveModelUpdate,
    input: bool,
) -> DomainResult<()> {
    let (uuid, meter, unit_price, priority) = if input {
        (
            &command.input_pricing_uuid,
            input_billing_meter(&update.model_type),
            &update.price_in,
            1_i32,
        )
    } else {
        (
            &command.output_pricing_uuid,
            output_billing_meter(&update.model_type),
            &update.price_out,
            2_i32,
        )
    };
    let meter_filter_sql = if input {
        INPUT_BILLING_METER_FILTER_SQL
    } else {
        OUTPUT_BILLING_METER_FILTER_SQL
    };
    let result = sqlx::query(
        format!(
            r#"
        UPDATE ai_model_pricing
        SET status = 1,
            deleted_at = NULL,
            updated_at = ?,
            model = ?,
            vendor_code = ?,
            catalog_key = ?,
            region_code = ?,
            billing_meter_code = ?,
            unit_price = ?,
            currency = 'USD',
            priority = ?,
            effective_from = COALESCE(effective_from, ?)
        WHERE id = (
            SELECT id
            FROM ai_model_pricing
            WHERE model_id = ?
              AND price_side = ?
              AND COALESCE(region_code, ?) = ?
              AND billing_meter_code IN {meter_filter_sql}
            ORDER BY id ASC
            LIMIT 1
        )
        "#,
        )
        .as_str(),
    )
    .bind(&command.requested_at)
    .bind(&update.model)
    .bind(&vendor.code)
    .bind(model_catalog_key(
        &vendor.code,
        &update.region_code,
        &update.model,
    ))
    .bind(&update.region_code)
    .bind(meter)
    .bind(unit_price)
    .bind(priority)
    .bind(&command.requested_at)
    .bind(model_id)
    .bind(OFFICIAL_REFERENCE_PRICE_SIDE)
    .bind(&update.region_code)
    .bind(&update.region_code)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update model pricing", error))?;
    if result.rows_affected() > 0 {
        return Ok(());
    }
    sqlx::query(
        r#"
        INSERT INTO ai_model_pricing
            (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata, model_id, catalog_key, model, vendor_code, region_code, price_side, pricing_scope, billing_type, billing_mode, billing_meter_code, price_item_type, unit, unit_size, metering_mode, quantity_source, minimum_quantity, quantity_step, included_quantity, unit_price, currency, rounding_mode, min_charge_amount, pricing_formula_mode, price_origin, priority, effective_from)
        VALUES
            (?, ?, ?, 1, 1, ?, ?, 0, '{}', ?, ?, ?, ?, ?, ?, 1, 1, 1, ?, 1, 1, 1, 1, 1, 0, 1, 0, ?, 'USD', 1, 0, 1, 1, ?, ?)
        "#,
    )
    .bind(uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(model_id)
    .bind(model_catalog_key(&vendor.code, &update.region_code, &update.model))
    .bind(&update.model)
    .bind(&vendor.code)
    .bind(&update.region_code)
    .bind(OFFICIAL_REFERENCE_PRICE_SIDE)
    .bind(meter)
    .bind(unit_price)
    .bind(priority)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create model pricing during update", error))?;
    Ok(())
}

async fn upsert_optional_model_pricing(
    tx: &mut Transaction<'_, Sqlite>,
    model_id: i64,
    command: &UpdateAdminAiModelCommand,
    vendor: &VendorIdentity,
    update: &EffectiveModelUpdate,
    uuid: &str,
    meter: &str,
    meter_filter_sql: &str,
    unit_price: Option<&str>,
    priority: i32,
) -> DomainResult<()> {
    let Some(unit_price) = unit_price else {
        return Ok(());
    };
    if unit_price.trim().is_empty() {
        sqlx::query(
            format!(
                r#"
        UPDATE ai_model_pricing
        SET status = 0,
            deleted_at = ?,
            updated_at = ?
        WHERE model_id = ?
          AND price_side = ?
          AND COALESCE(region_code, ?) = ?
          AND billing_meter_code IN {meter_filter_sql}
          AND deleted_at IS NULL
        "#,
            )
            .as_str(),
        )
        .bind(&command.requested_at)
        .bind(&command.requested_at)
        .bind(model_id)
        .bind(OFFICIAL_REFERENCE_PRICE_SIDE)
        .bind(&update.region_code)
        .bind(&update.region_code)
        .execute(&mut **tx)
        .await
        .map_err(|error| store_error("failed to clear optional model pricing", error))?;
        return Ok(());
    }
    let result = sqlx::query(
        format!(
            r#"
        UPDATE ai_model_pricing
        SET status = 1,
            deleted_at = NULL,
            updated_at = ?,
            model = ?,
            vendor_code = ?,
            catalog_key = ?,
            region_code = ?,
            billing_meter_code = ?,
            unit_price = ?,
            currency = 'USD',
            priority = ?,
            effective_from = COALESCE(effective_from, ?)
        WHERE id = (
            SELECT id
            FROM ai_model_pricing
            WHERE model_id = ?
              AND price_side = ?
              AND COALESCE(region_code, ?) = ?
              AND billing_meter_code IN {meter_filter_sql}
            ORDER BY id ASC
            LIMIT 1
        )
        "#,
        )
        .as_str(),
    )
    .bind(&command.requested_at)
    .bind(&update.model)
    .bind(&vendor.code)
    .bind(model_catalog_key(
        &vendor.code,
        &update.region_code,
        &update.model,
    ))
    .bind(&update.region_code)
    .bind(meter)
    .bind(unit_price)
    .bind(priority)
    .bind(&command.requested_at)
    .bind(model_id)
    .bind(OFFICIAL_REFERENCE_PRICE_SIDE)
    .bind(&update.region_code)
    .bind(&update.region_code)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update optional model pricing", error))?;
    if result.rows_affected() > 0 {
        return Ok(());
    }
    sqlx::query(
        r#"
        INSERT INTO ai_model_pricing
            (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata, model_id, catalog_key, model, vendor_code, region_code, price_side, pricing_scope, billing_type, billing_mode, billing_meter_code, price_item_type, unit, unit_size, metering_mode, quantity_source, minimum_quantity, quantity_step, included_quantity, unit_price, currency, rounding_mode, min_charge_amount, pricing_formula_mode, price_origin, priority, effective_from)
        VALUES
            (?, ?, ?, 1, 1, ?, ?, 0, '{}', ?, ?, ?, ?, ?, ?, 1, 1, 1, ?, 1, 1, 1, 1, 1, 0, 1, 0, ?, 'USD', 1, 0, 1, 1, ?, ?)
        "#,
    )
    .bind(uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(model_id)
    .bind(model_catalog_key(&vendor.code, &update.region_code, &update.model))
    .bind(&update.model)
    .bind(&vendor.code)
    .bind(&update.region_code)
    .bind(OFFICIAL_REFERENCE_PRICE_SIDE)
    .bind(meter)
    .bind(unit_price)
    .bind(priority)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create optional model pricing during update", error))?;
    Ok(())
}

async fn replace_model_region_pricing(
    tx: &mut Transaction<'_, Sqlite>,
    model_id: i64,
    command: &UpdateAdminAiModelCommand,
    vendor: &VendorIdentity,
    update: &EffectiveModelUpdate,
    region_prices: &[crate::ports::AdminAiModelRegionPriceCommand],
) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE ai_model_pricing
        SET status = 0,
            deleted_at = ?,
            updated_at = ?
        WHERE model_id = ?
          AND price_side = ?
          AND deleted_at IS NULL
        "#,
    )
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(model_id)
    .bind(OFFICIAL_REFERENCE_PRICE_SIDE)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to replace regional model pricing", error))?;

    for region_price in region_prices {
        insert_update_region_model_pricing(
            tx,
            model_id,
            command,
            vendor,
            update,
            &region_price.region_code,
            input_billing_meter(&update.model_type),
            &region_price.price_in,
            1,
            "input",
        )
        .await?;
        insert_update_region_model_pricing(
            tx,
            model_id,
            command,
            vendor,
            update,
            &region_price.region_code,
            output_billing_meter(&update.model_type),
            &region_price.price_out,
            2,
            "output",
        )
        .await?;
        if let Some(price) = region_price
            .cache_read_price
            .as_deref()
            .filter(|price| !price.trim().is_empty())
        {
            insert_update_region_model_pricing(
                tx,
                model_id,
                command,
                vendor,
                update,
                &region_price.region_code,
                "llm_cache_read_token",
                price,
                3,
                "cache_read",
            )
            .await?;
        }
        if let Some(price) = region_price
            .cache_write_price
            .as_deref()
            .filter(|price| !price.trim().is_empty())
        {
            insert_update_region_model_pricing(
                tx,
                model_id,
                command,
                vendor,
                update,
                &region_price.region_code,
                "llm_cache_write_token",
                price,
                4,
                "cache_write",
            )
            .await?;
        }
    }
    Ok(())
}

async fn insert_update_region_model_pricing(
    tx: &mut Transaction<'_, Sqlite>,
    model_id: i64,
    command: &UpdateAdminAiModelCommand,
    vendor: &VendorIdentity,
    update: &EffectiveModelUpdate,
    region_code: &str,
    meter: &str,
    unit_price: &str,
    priority: i32,
    price_kind: &str,
) -> DomainResult<()> {
    let catalog_key = model_catalog_key(&vendor.code, region_code, &update.model);
    let uuid = stable_uuid(
        "admin-price",
        &[&command.model_id, region_code, meter, price_kind],
    );
    sqlx::query(
        r#"
        INSERT INTO ai_model_pricing
            (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata, model_id, catalog_key, model, vendor_code, region_code, price_side, pricing_scope, billing_type, billing_mode, billing_meter_code, price_item_type, unit, unit_size, metering_mode, quantity_source, minimum_quantity, quantity_step, included_quantity, unit_price, currency, rounding_mode, min_charge_amount, pricing_formula_mode, price_origin, priority, effective_from)
        VALUES
            (?, ?, ?, 1, 1, ?, ?, 0, '{}', ?, ?, ?, ?, ?, ?, 1, 1, 1, ?, 1, 1, 1, 1, 1, 0, 1, 0, ?, 'USD', 1, 0, 1, 1, ?, ?)
        "#,
    )
    .bind(uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(model_id)
    .bind(catalog_key)
    .bind(&update.model)
    .bind(&vendor.code)
    .bind(region_code)
    .bind(OFFICIAL_REFERENCE_PRICE_SIDE)
    .bind(meter)
    .bind(unit_price)
    .bind(priority)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to replace regional model pricing row", error))?;
    Ok(())
}

async fn soft_delete_model_graph(
    tx: &mut Transaction<'_, Sqlite>,
    model_id: i64,
    command: &DeleteAdminAiModelCommand,
) -> DomainResult<()> {
    for statement in [
        r#"
        UPDATE ai_model_pricing
        SET status = 0,
            deleted_at = ?,
            updated_at = ?,
            deleted_by = ?
        WHERE model_id = ?
          AND deleted_at IS NULL
        "#,
        r#"
        UPDATE ai_model_capability
        SET status = 0,
            deleted_at = ?,
            updated_at = ?,
            deleted_by = ?
        WHERE model_id = ?
          AND deleted_at IS NULL
        "#,
        r#"
        UPDATE ai_model
        SET status = 0,
            deleted_at = ?,
            updated_at = ?,
            deleted_by = ?
        WHERE id = ?
          AND deleted_at IS NULL
        "#,
    ] {
        sqlx::query(statement)
            .bind(&command.requested_at)
            .bind(&command.requested_at)
            .bind(command.subject.operator_id)
            .bind(model_id)
            .execute(&mut **tx)
            .await
            .map_err(|error| store_error("failed to delete ai model graph", error))?;
    }
    Ok(())
}

async fn last_insert_rowid(tx: &mut Transaction<'_, Sqlite>) -> DomainResult<i64> {
    sqlx::query_scalar("SELECT last_insert_rowid()")
        .fetch_one(&mut **tx)
        .await
        .map_err(|error| store_error("failed to read inserted row id", error))
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
    .map_err(|error| store_error("failed to write admin model audit log", error))?;
    Ok(())
}

fn vendor_select_sql(predicate: &str) -> String {
    format!(
        r#"
        SELECT
            id,
            COALESCE(uuid, '') AS uuid,
            COALESCE(tenant_id, 0) AS tenant_id,
            COALESCE(organization_id, 0) AS organization_id,
            COALESCE(vendor_code, '') AS vendor_code,
            COALESCE(display_name, vendor_code, '') AS name,
            COALESCE(description, '') AS description,
            COALESCE(color_token, 'bg-slate-700') AS color,
            status,
            CAST(deleted_at AS TEXT) AS deleted_at
        FROM ai_model_vendor
        {predicate}
        "#
    )
}

fn model_select_sql(
    predicate: &str,
    ranking_tenant_id: i64,
    ranking_organization_id: i64,
) -> String {
    format!(
        r#"
        WITH selected_rank_snapshot AS (
            SELECT
                s.tenant_id,
                s.organization_id,
                s.snapshot_date,
                s.snapshot_period,
                lower(COALESCE(s.rank_scope, 'commercial-default')) AS rank_scope
            FROM ai_model_rank_snapshot s
            WHERE s.status = 1
              AND (
                  ({ranking_tenant_id} > 0 AND s.tenant_id = {ranking_tenant_id} AND s.organization_id = {ranking_organization_id})
                  OR ({ranking_tenant_id} > 0 AND {ranking_organization_id} > 0 AND s.tenant_id = {ranking_tenant_id} AND s.organization_id = 0)
                  OR (s.tenant_id = 0 AND s.organization_id = 0)
              )
              AND lower(COALESCE(s.rank_scope, 'commercial-default')) = 'commercial-default'
            GROUP BY
                s.tenant_id,
                s.organization_id,
                s.snapshot_date,
                s.snapshot_period,
                lower(COALESCE(s.rank_scope, 'commercial-default'))
            ORDER BY
                CASE
                    WHEN {ranking_tenant_id} > 0 AND s.tenant_id = {ranking_tenant_id} AND s.organization_id = {ranking_organization_id} THEN 3
                    WHEN {ranking_tenant_id} > 0 AND {ranking_organization_id} > 0 AND s.tenant_id = {ranking_tenant_id} AND s.organization_id = 0 THEN 2
                    WHEN s.tenant_id = 0 AND s.organization_id = 0 THEN 1
                    ELSE 0
                END DESC,
                s.snapshot_date DESC,
                s.snapshot_period DESC
            LIMIT 1
        ),
        selected_rank_calls AS (
            SELECT
                r.model,
                CAST(MAX(COALESCE(r.request_count, r.base_volume, 0)) AS TEXT) AS calls
            FROM ai_model_rank_snapshot r
            JOIN selected_rank_snapshot s
              ON r.tenant_id = s.tenant_id
             AND r.organization_id = s.organization_id
             AND COALESCE(CAST(r.snapshot_date AS TEXT), '') = COALESCE(CAST(s.snapshot_date AS TEXT), '')
             AND COALESCE(r.snapshot_period, -1) = COALESCE(s.snapshot_period, -1)
             AND lower(COALESCE(r.rank_scope, 'commercial-default')) = s.rank_scope
            WHERE r.status = 1
            GROUP BY r.model
        )
        SELECT
            m.id,
            COALESCE(m.uuid, '') AS uuid,
            COALESCE(m.tenant_id, 0) AS tenant_id,
            COALESCE(m.organization_id, 0) AS organization_id,
            CAST(COALESCE(m.vendor_id, 0) AS TEXT) AS vendor_id,
            COALESCE(m.vendor_code, '') AS vendor_code,
            COALESCE(
                NULLIF((
                    SELECT p.region_code
                    FROM ai_model_pricing p
                    WHERE p.model_id = m.id
                      AND p.status = 1
                      AND p.deleted_at IS NULL
                    ORDER BY p.priority ASC, p.id ASC
                    LIMIT 1
                ), ''),
                'global'
            ) AS region_code,
            COALESCE(m.catalog_key, COALESCE(m.vendor_code, '') || '/' || COALESCE(m.model, '')) AS catalog_key,
            COALESCE(m.model, '') AS model,
            COALESCE(NULLIF(m.display_name, ''), m.model, '') AS display_name,
            COALESCE(NULLIF(m.display_name, ''), m.model, '') AS name,
            m.capability,
            COALESCE(CAST(m.modalities AS TEXT), '[]') AS modalities_json,
            COALESCE(CAST(m.input_modalities AS TEXT), '[]') AS input_modalities_json,
            COALESCE(CAST(m.output_modalities AS TEXT), '[]') AS output_modalities_json,
            NULLIF(COALESCE(m.description, ''), '') AS description,
            NULLIF(COALESCE(m.api_format, ''), '') AS api_format,
            NULLIF(COALESCE(m.capability_intro, ''), '') AS capability_intro,
            COALESCE(CAST(m.limitations AS TEXT), '[]') AS limitations_json,
            COALESCE(CAST(m.supported_languages AS TEXT), '[]') AS supported_languages_json,
            COALESCE(CAST(m.use_cases AS TEXT), '[]') AS use_cases_json,
            NULLIF(COALESCE(m.training_data_cutoff, ''), '') AS training_data_cutoff,
            COALESCE((
                SELECT CAST(p.unit_price AS TEXT)
                FROM ai_model_pricing p
                WHERE p.model_id = m.id
                  AND p.price_side = 1
                  AND p.billing_meter_code IN ('llm_input_token', 'embedding_input_token', 'image_input_token', 'audio_input_second', 'audio_input_minute', 'tts_input_character', 'api_request')
                  AND p.status = 1
                  AND p.deleted_at IS NULL
                ORDER BY p.priority ASC, p.id ASC
                LIMIT 1
            ), '') AS price_in,
            COALESCE((
                SELECT CAST(p.unit_price AS TEXT)
                FROM ai_model_pricing p
                WHERE p.model_id = m.id
                  AND p.price_side = 1
                  AND p.billing_meter_code IN ('llm_output_token', 'image_output_token', 'image_result', 'audio_output_second', 'music_output_second', 'sfx_result', 'video_output_second', 'api_result')
                  AND p.status = 1
                  AND p.deleted_at IS NULL
                ORDER BY p.priority ASC, p.id ASC
                LIMIT 1
            ), '') AS price_out,
            COALESCE((
                SELECT CAST(p.unit_price AS TEXT)
                FROM ai_model_pricing p
                WHERE p.model_id = m.id
                  AND p.price_side = 1
                  AND p.billing_meter_code IN ('llm_cache_read_token')
                  AND p.status = 1
                  AND p.deleted_at IS NULL
                ORDER BY p.priority ASC, p.id ASC
                LIMIT 1
            ), '') AS cache_read_price,
            COALESCE((
                SELECT CAST(p.unit_price AS TEXT)
                FROM ai_model_pricing p
                WHERE p.model_id = m.id
                  AND p.price_side = 1
                  AND p.billing_meter_code IN ('llm_cache_write_token')
                  AND p.status = 1
                  AND p.deleted_at IS NULL
                ORDER BY p.priority ASC, p.id ASC
                LIMIT 1
            ), '') AS cache_write_price,
            COALESCE(rc.calls, '0') AS calls,
            m.status,
            m.context_tokens AS context_tokens,
            m.max_output_tokens AS max_output_tokens,
            COALESCE(m.supports_streaming, 0) AS supports_streaming,
            COALESCE(m.supports_tools, 0) AS supports_tools,
            COALESCE(m.supports_json_schema, 0) AS supports_json_schema,
            m.release_stage AS release_stage,
            m.shelf_state AS shelf_state,
            m.routing_state AS routing_state,
            NULLIF(COALESCE(m.replacement_model, ''), '') AS replacement_model,
            CAST(m.deleted_at AS TEXT) AS deleted_at
        FROM ai_model m
        LEFT JOIN selected_rank_calls rc ON rc.model = m.model
        {predicate}
        "#
    )
}

fn vendor_from_row(row: sqlx::sqlite::SqliteRow) -> DomainResult<AdminModelVendorItem> {
    Ok(AdminModelVendorItem {
        id: row.try_get("id").map_err(row_error)?,
        uuid: row.try_get("uuid").map_err(row_error)?,
        tenant_id: optional_integer_cell(&row, "tenant_id").unwrap_or(0),
        organization_id: optional_integer_cell(&row, "organization_id").unwrap_or(0),
        vendor_code: row.try_get("vendor_code").map_err(row_error)?,
        name: row.try_get("name").map_err(row_error)?,
        status: status_label(required_integer_cell(&row, "status", "vendor status")?)?,
        color: row.try_get("color").map_err(row_error)?,
        description: row.try_get("description").map_err(row_error)?,
        deleted_at: row.try_get("deleted_at").ok().flatten(),
    })
}

fn model_from_row(row: sqlx::sqlite::SqliteRow) -> DomainResult<AdminAiModelItem> {
    let capability = optional_integer_cell(&row, "capability");
    let modalities_json = row
        .try_get::<String, _>("modalities_json")
        .map_err(row_error)?;
    let modalities = parse_string_array(&modalities_json, "modalities")?;
    Ok(AdminAiModelItem {
        id: row.try_get("id").map_err(row_error)?,
        uuid: row.try_get("uuid").map_err(row_error)?,
        tenant_id: optional_integer_cell(&row, "tenant_id").unwrap_or(0),
        organization_id: optional_integer_cell(&row, "organization_id").unwrap_or(0),
        vendor_id: row.try_get("vendor_id").map_err(row_error)?,
        vendor_code: row.try_get("vendor_code").map_err(row_error)?,
        region_code: row
            .try_get("region_code")
            .unwrap_or_else(|_| "global".to_owned()),
        catalog_key: row.try_get("catalog_key").unwrap_or_default(),
        model: row.try_get("model").map_err(row_error)?,
        display_name: row.try_get("display_name").map_err(row_error)?,
        name: row.try_get("name").map_err(row_error)?,
        model_type: model_type_label(capability, &modalities)?,
        price_in: row.try_get("price_in").unwrap_or_default(),
        price_out: row.try_get("price_out").unwrap_or_default(),
        cache_read_price: row.try_get("cache_read_price").unwrap_or_default(),
        cache_write_price: row.try_get("cache_write_price").unwrap_or_default(),
        status: status_label(required_integer_cell(&row, "status", "model status")?)?,
        calls: row.try_get("calls").unwrap_or_else(|_| "0".to_owned()),
        description: row.try_get("description").ok().flatten(),
        modalities,
        input_modalities: parse_string_array(
            &row.try_get::<String, _>("input_modalities_json")
                .map_err(row_error)?,
            "input_modalities",
        )?,
        output_modalities: parse_string_array(
            &row.try_get::<String, _>("output_modalities_json")
                .map_err(row_error)?,
            "output_modalities",
        )?,
        api_format: row.try_get("api_format").ok().flatten(),
        capability_intro: row.try_get("capability_intro").ok().flatten(),
        limitations: parse_string_array(
            &row.try_get::<String, _>("limitations_json")
                .map_err(row_error)?,
            "limitations",
        )?,
        supported_languages: parse_string_array(
            &row.try_get::<String, _>("supported_languages_json")
                .map_err(row_error)?,
            "supported_languages",
        )?,
        use_cases: parse_string_array(
            &row.try_get::<String, _>("use_cases_json")
                .map_err(row_error)?,
            "use_cases",
        )?,
        training_data_cutoff: row.try_get("training_data_cutoff").ok().flatten(),
        context_tokens: optional_integer_cell(&row, "context_tokens"),
        max_output_tokens: optional_integer_cell(&row, "max_output_tokens"),
        supports_streaming: bool_cell(&row, "supports_streaming"),
        supports_tools: bool_cell(&row, "supports_tools"),
        supports_json_schema: bool_cell(&row, "supports_json_schema"),
        release_stage: optional_i32_cell(&row, "release_stage"),
        shelf_state: optional_i32_cell(&row, "shelf_state"),
        routing_state: optional_i32_cell(&row, "routing_state"),
        replacement_model: row.try_get("replacement_model").ok().flatten(),
        deleted_at: row.try_get("deleted_at").ok().flatten(),
    })
}

fn normalize_vendor_lookup(value: &str) -> String {
    let value = value.trim();
    let value = value.strip_prefix("v_").unwrap_or(value);
    value
        .bytes()
        .map(|byte| {
            if byte.is_ascii_alphanumeric() {
                (byte as char).to_ascii_lowercase()
            } else {
                '_'
            }
        })
        .collect::<String>()
        .trim_matches('_')
        .to_owned()
}

fn status_code(value: &str) -> i32 {
    if value == "inactive" {
        0
    } else {
        1
    }
}

fn status_label(value: i64) -> DomainResult<String> {
    match value {
        0 => Ok("inactive"),
        1 => Ok("active"),
        value => Err(DomainError::new(format!(
            "invalid admin model status from database row: {value}"
        ))),
    }
    .map(str::to_owned)
}

fn capability_code(model_type: &str) -> i32 {
    model_modality::model_type_capability_code(model_type)
}

fn modality_code(model_type: &str) -> i32 {
    model_modality::model_type_capability_code(model_type)
}

fn model_capability_code(model_type: &str) -> &'static str {
    match model_type {
        "Image" => "image",
        "Audio" => "audio",
        "Embedding" => "embedding",
        "Music" => "music",
        "SoundEffect" => "sfx",
        "Video" => "video",
        _ => "chat",
    }
}

fn model_type_label(capability: Option<i64>, modalities: &[String]) -> DomainResult<String> {
    if modalities
        .iter()
        .any(|modality| modality == "embedding" || modality == "embeddings")
    {
        return Ok("Embedding".to_owned());
    }
    if modalities.iter().any(|modality| {
        modality == "sfx" || modality == "sound_effect" || modality == "sound_effects"
    }) {
        return Ok("SoundEffect".to_owned());
    }
    Ok(match capability {
        Some(2) => "Image",
        Some(3) => "Audio",
        Some(4) => "Music",
        Some(5) => "Video",
        _ => "Chat",
    }
    .to_owned())
}

fn parse_string_array(value: &str, field_name: &str) -> DomainResult<Vec<String>> {
    let parsed: Vec<String> = serde_json::from_str(value).map_err(|error| {
        DomainError::new(format!(
            "invalid model {field_name} json from database row: {error}"
        ))
    })?;
    Ok(parsed
        .into_iter()
        .map(|modality| modality.trim().to_ascii_lowercase())
        .filter(|modality| !modality.is_empty())
        .collect())
}

fn json_array_text(values: &[String]) -> DomainResult<String> {
    serde_json::to_string(values)
        .map_err(|error| DomainError::new(format!("failed to encode ai model json array: {error}")))
}

fn model_catalog_key(vendor_code: &str, region_code: &str, model: &str) -> String {
    let region_code = if region_code.trim().is_empty() {
        DEFAULT_MODEL_REGION_CODE
    } else {
        region_code.trim()
    };
    build_model_catalog_key(vendor_code, region_code, model)
}

fn input_billing_meter(model_type: &str) -> &'static str {
    match model_type {
        "Image" => "image_input_token",
        "Audio" => "audio_input_second",
        "Embedding" => "embedding_input_token",
        "Music" => "api_request",
        "SoundEffect" => "api_request",
        "Video" => "api_request",
        _ => "llm_input_token",
    }
}

fn output_billing_meter(model_type: &str) -> &'static str {
    match model_type {
        "Image" => "image_output_token",
        "Audio" => "audio_output_second",
        "Music" => "music_output_second",
        "SoundEffect" => "sfx_result",
        "Embedding" => "api_result",
        "Video" => "video_output_second",
        _ => "llm_output_token",
    }
}

fn normalize_catalog_source_code(value: &str) -> String {
    let mut normalized = String::with_capacity(value.len());
    let mut last_was_separator = false;
    for character in value.chars() {
        let next = if character.is_ascii_alphanumeric() {
            last_was_separator = false;
            Some(character.to_ascii_lowercase())
        } else if !last_was_separator {
            last_was_separator = true;
            Some('_')
        } else {
            None
        };
        if let Some(character) = next {
            normalized.push(character);
        }
    }
    let normalized = normalized.trim_matches('_');
    if normalized.is_empty() {
        "manual_model_catalog".to_owned()
    } else {
        normalized.chars().take(96).collect()
    }
}

fn pricing_import_snapshot_hash(
    command: &SyncAdminModelCatalogCommand,
    catalog_source_hash: &str,
) -> String {
    crate::infrastructure::sql::model_catalog_import::stable_uuid(
        "pricing-import",
        &[
            &command.source,
            catalog_source_hash,
            &command.snapshot_uuid,
            &command.request_id,
            &command.requested_at,
        ],
    )
}

fn optional_integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<i64> {
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

fn optional_i32_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<i32> {
    optional_integer_cell(row, column).and_then(|value| i32::try_from(value).ok())
}

fn bool_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> bool {
    row.try_get::<bool, _>(column)
        .ok()
        .or_else(|| optional_integer_cell(row, column).map(|value| value != 0))
        .unwrap_or(false)
}

fn required_integer_cell(
    row: &sqlx::sqlite::SqliteRow,
    column: &str,
    field: &str,
) -> DomainResult<i64> {
    optional_integer_cell(row, column).ok_or_else(|| missing_integer_cell_error(field))
}

fn missing_integer_cell_error(field: &str) -> DomainError {
    match field {
        "vendor status" => DomainError::new("missing admin model vendor status from database row"),
        "model status" => DomainError::new("missing admin model model status from database row"),
        _ => DomainError::new(format!("missing admin model {field} from database row")),
    }
}

fn row_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    if let sqlx::Error::Database(database_error) = &error {
        let message = database_error.message();
        if message.contains("UNIQUE")
            || database_error
                .code()
                .map(|code| code == "23505")
                .unwrap_or(false)
        {
            return DomainError::conflict(format!("{context}: model catalog entry already exists"));
        }
    }
    DomainError::new(format!("{context}: {error}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn model_type_label_uses_parsed_modalities() {
        let modalities =
            parse_string_array(r#"["embedding"]"#, "modalities").expect("valid modalities json");

        assert_eq!(
            "Embedding",
            model_type_label(Some(1), &modalities).expect("valid model type label")
        );
    }

    #[test]
    fn parse_string_array_rejects_invalid_modalities_json() {
        let invalid =
            parse_string_array("not-json", "modalities").expect_err("invalid modalities json");
        assert!(invalid
            .to_string()
            .contains("invalid model modalities json from database row"));
    }
}
