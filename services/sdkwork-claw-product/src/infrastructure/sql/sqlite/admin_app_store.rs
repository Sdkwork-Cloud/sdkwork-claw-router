use sha2::{Digest, Sha256};
use sqlx::{Row, Sqlite, SqlitePool, Transaction};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    AdminAppCategoryItem, AdminAppCommandFuture, AdminAppItem, AdminAppPage, AdminAppStore,
    AdminAppTemplateItem, AdminAppTemplatePage, CreateAdminAppCategoryCommand,
    CreateAdminAppCommand, CreateAdminAppTemplateCommand, DeleteAdminAppCategoryCommand,
    DeleteAdminAppCommand, DeleteAdminAppTemplateCommand, GetAdminAppQuery,
    GetAdminAppTemplateQuery, ListAdminAppCategoriesQuery, ListAdminAppTemplatesQuery,
    ListAdminAppsQuery, SetAdminAppStatusCommand, SetAdminAppTemplatePublishStatusCommand,
    UpdateAdminAppCategoryCommand, UpdateAdminAppCommand, UpdateAdminAppTemplateCommand,
};

const APP_TARGET_TYPE: i32 = 15;
const APP_TEMPLATE_TARGET_TYPE: i32 = 16;
const PUBLIC_APP_STORE_TENANT_ID: i64 = 20_001;
const PUBLIC_APP_STORE_ORGANIZATION_ID: i64 = 0;
const APP_STORE_CATEGORY_TYPE: i32 = 999_999;
const APP_STORE_CATEGORY_GROUP: &str = "app-store";
const ASSIGNED_ID_FLOOR: i64 = 1_000_000_000_000;
const ASSIGNED_ID_RANGE: u64 = 8_000_000_000_000;
const MAX_ASSIGNED_ID_ATTEMPTS: u8 = 16;

#[derive(Debug, Clone)]
pub struct SqliteAdminAppStore {
    pool: SqlitePool,
}

impl SqliteAdminAppStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl AdminAppStore for SqliteAdminAppStore {
    fn list_categories<'a>(
        &'a self,
        query: ListAdminAppCategoriesQuery,
    ) -> AdminAppCommandFuture<'a, Vec<AdminAppCategoryItem>> {
        Box::pin(async move { list_categories(&self.pool, query).await })
    }

    fn create_category<'a>(
        &'a self,
        command: CreateAdminAppCategoryCommand,
    ) -> AdminAppCommandFuture<'a, AdminAppCategoryItem> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin app category transaction", error)
                })?;
            let id = insert_category(&mut tx, &command).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_app_category",
                APP_TARGET_TYPE,
                id,
                serde_json::json!({
                    "action": "create_app_category",
                    "categoryId": id,
                    "name": &command.name,
                    "type": command.category_type,
                    "group": APP_STORE_CATEGORY_GROUP
                }),
            )
            .await?;
            let item = load_category_by_id(
                &mut tx,
                id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("created app category could not be reloaded"))?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit app category transaction", error))?;
            Ok(item)
        })
    }

    fn update_category<'a>(
        &'a self,
        command: UpdateAdminAppCategoryCommand,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppCategoryItem>> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin app category transaction", error)
                })?;
            let updated = update_category(&mut tx, &command).await?;
            if !updated {
                tx.commit().await.map_err(|error| {
                    store_error("failed to commit app category transaction", error)
                })?;
                return Ok(None);
            }
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "update_app_category",
                APP_TARGET_TYPE,
                command.category_id,
                serde_json::json!({
                    "action": "update_app_category",
                    "categoryId": command.category_id,
                    "nameChanged": command.name.is_some(),
                    "parentChanged": command.parent_id.is_some()
                }),
            )
            .await?;
            let item = load_category_by_id(
                &mut tx,
                command.category_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit app category transaction", error))?;
            Ok(item)
        })
    }

    fn delete_category<'a>(
        &'a self,
        command: DeleteAdminAppCategoryCommand,
    ) -> AdminAppCommandFuture<'a, bool> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin app category transaction", error)
                })?;
            let deleted = delete_category(&mut tx, &command).await?;
            if deleted {
                insert_audit_log(
                    &mut tx,
                    &command.audit_log_uuid,
                    &command.request_id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    command.subject.operator_id,
                    command.subject.operator_type,
                    "delete_app_category",
                    APP_TARGET_TYPE,
                    command.category_id,
                    serde_json::json!({
                        "action": "delete_app_category",
                        "categoryId": command.category_id
                    }),
                )
                .await?;
            }
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit app category transaction", error))?;
            Ok(deleted)
        })
    }

    fn list_apps<'a>(
        &'a self,
        query: ListAdminAppsQuery,
    ) -> AdminAppCommandFuture<'a, AdminAppPage> {
        Box::pin(async move { list_apps(&self.pool, query).await })
    }

    fn get_app<'a>(
        &'a self,
        query: GetAdminAppQuery,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppItem>> {
        Box::pin(async move {
            load_app_by_id(
                &self.pool,
                query.app_id,
                query.subject.tenant_id,
                query.subject.organization_id,
            )
            .await
        })
    }

    fn create_app<'a>(
        &'a self,
        command: CreateAdminAppCommand,
    ) -> AdminAppCommandFuture<'a, AdminAppItem> {
        Box::pin(async move {
            let mut tx = self
                .pool
                .begin()
                .await
                .map_err(|error| store_error("failed to begin app transaction", error))?;
            let id = insert_app(&mut tx, &command).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_app",
                APP_TARGET_TYPE,
                id,
                serde_json::json!({
                    "action": "create_app",
                    "appId": id,
                    "appKey": &command.app_key,
                    "name": &command.name,
                    "status": &command.status,
                    "marketStatus": &command.market_status
                }),
            )
            .await?;
            let item = load_app_by_id_tx(
                &mut tx,
                id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("created app could not be reloaded"))?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit app transaction", error))?;
            Ok(item)
        })
    }

    fn update_app<'a>(
        &'a self,
        command: UpdateAdminAppCommand,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppItem>> {
        Box::pin(async move {
            let mut tx = self
                .pool
                .begin()
                .await
                .map_err(|error| store_error("failed to begin app transaction", error))?;
            let updated = update_app(&mut tx, &command).await?;
            if !updated {
                tx.commit()
                    .await
                    .map_err(|error| store_error("failed to commit app transaction", error))?;
                return Ok(None);
            }
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "update_app",
                APP_TARGET_TYPE,
                command.app_id,
                serde_json::json!({
                    "action": "update_app",
                    "appId": command.app_id,
                    "nameChanged": command.name.is_some(),
                    "appKeyChanged": command.app_key.is_some(),
                    "configChanged": command.config.is_some()
                }),
            )
            .await?;
            let item = load_app_by_id_tx(
                &mut tx,
                command.app_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit app transaction", error))?;
            Ok(item)
        })
    }

    fn set_app_status<'a>(
        &'a self,
        command: SetAdminAppStatusCommand,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppItem>> {
        Box::pin(async move {
            let mut tx = self
                .pool
                .begin()
                .await
                .map_err(|error| store_error("failed to begin app transaction", error))?;
            let updated = set_app_status(&mut tx, &command).await?;
            if !updated {
                tx.commit()
                    .await
                    .map_err(|error| store_error("failed to commit app transaction", error))?;
                return Ok(None);
            }
            let action = status_action(&command);
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                action,
                APP_TARGET_TYPE,
                command.app_id,
                serde_json::json!({
                    "action": action,
                    "appId": command.app_id,
                    "status": &command.status,
                    "marketStatus": &command.market_status
                }),
            )
            .await?;
            let item = load_app_by_id_tx(
                &mut tx,
                command.app_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit app transaction", error))?;
            Ok(item)
        })
    }

    fn delete_app<'a>(&'a self, command: DeleteAdminAppCommand) -> AdminAppCommandFuture<'a, bool> {
        Box::pin(async move {
            let mut tx = self
                .pool
                .begin()
                .await
                .map_err(|error| store_error("failed to begin app transaction", error))?;
            let deleted = delete_app(&mut tx, &command).await?;
            if deleted {
                insert_audit_log(
                    &mut tx,
                    &command.audit_log_uuid,
                    &command.request_id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    command.subject.operator_id,
                    command.subject.operator_type,
                    "delete_app",
                    APP_TARGET_TYPE,
                    command.app_id,
                    serde_json::json!({
                        "action": "delete_app",
                        "appId": command.app_id
                    }),
                )
                .await?;
            }
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit app transaction", error))?;
            Ok(deleted)
        })
    }

    fn list_app_templates<'a>(
        &'a self,
        query: ListAdminAppTemplatesQuery,
    ) -> AdminAppCommandFuture<'a, AdminAppTemplatePage> {
        Box::pin(async move { list_app_templates(&self.pool, query).await })
    }

    fn get_app_template<'a>(
        &'a self,
        query: GetAdminAppTemplateQuery,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppTemplateItem>> {
        Box::pin(async move {
            load_template_by_id(
                &self.pool,
                query.template_id,
                query.subject.tenant_id,
                query.subject.organization_id,
            )
            .await
        })
    }

    fn create_app_template<'a>(
        &'a self,
        command: CreateAdminAppTemplateCommand,
    ) -> AdminAppCommandFuture<'a, AdminAppTemplateItem> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin app template transaction", error)
                })?;
            let id = insert_app_template(&mut tx, &command).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_app_template",
                APP_TEMPLATE_TARGET_TYPE,
                id,
                serde_json::json!({
                    "action": "create_app_template",
                    "templateId": id,
                    "templateCode": &command.template_code,
                    "publishStatus": &command.publish_status
                }),
            )
            .await?;
            let item = load_template_by_id_tx(
                &mut tx,
                id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("created app template could not be reloaded"))?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit app template transaction", error))?;
            Ok(item)
        })
    }

    fn update_app_template<'a>(
        &'a self,
        command: UpdateAdminAppTemplateCommand,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppTemplateItem>> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin app template transaction", error)
                })?;
            let updated = update_app_template(&mut tx, &command).await?;
            if !updated {
                tx.commit().await.map_err(|error| {
                    store_error("failed to commit app template transaction", error)
                })?;
                return Ok(None);
            }
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "update_app_template",
                APP_TEMPLATE_TARGET_TYPE,
                command.template_id,
                serde_json::json!({
                    "action": "update_app_template",
                    "templateId": command.template_id,
                    "nameChanged": command.template_name.is_some(),
                    "schemaChanged": command.app_config_schema.is_some() || command.variable_schema.is_some()
                }),
            )
            .await?;
            let item = load_template_by_id_tx(
                &mut tx,
                command.template_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit app template transaction", error))?;
            Ok(item)
        })
    }

    fn set_app_template_publish_status<'a>(
        &'a self,
        command: SetAdminAppTemplatePublishStatusCommand,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppTemplateItem>> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin app template transaction", error)
                })?;
            let updated = set_app_template_publish_status(&mut tx, &command).await?;
            if !updated {
                tx.commit().await.map_err(|error| {
                    store_error("failed to commit app template transaction", error)
                })?;
                return Ok(None);
            }
            let action = template_publish_status_action(&command);
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                action,
                APP_TEMPLATE_TARGET_TYPE,
                command.template_id,
                serde_json::json!({
                    "action": action,
                    "templateId": command.template_id,
                    "publishStatus": &command.publish_status
                }),
            )
            .await?;
            let item = load_template_by_id_tx(
                &mut tx,
                command.template_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit app template transaction", error))?;
            Ok(item)
        })
    }

    fn delete_app_template<'a>(
        &'a self,
        command: DeleteAdminAppTemplateCommand,
    ) -> AdminAppCommandFuture<'a, bool> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin app template transaction", error)
                })?;
            let deleted = delete_app_template(&mut tx, &command).await?;
            if deleted {
                insert_audit_log(
                    &mut tx,
                    &command.audit_log_uuid,
                    &command.request_id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    command.subject.operator_id,
                    command.subject.operator_type,
                    "delete_app_template",
                    APP_TEMPLATE_TARGET_TYPE,
                    command.template_id,
                    serde_json::json!({
                        "action": "delete_app_template",
                        "templateId": command.template_id
                    }),
                )
                .await?;
            }
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit app template transaction", error))?;
            Ok(deleted)
        })
    }
}

async fn list_categories(
    pool: &SqlitePool,
    query: ListAdminAppCategoriesQuery,
) -> DomainResult<Vec<AdminAppCategoryItem>> {
    let rows = sqlx::query(
        r#"
        SELECT id, uuid, tenant_id, organization_id, name, description, code, icon,
               COALESCE(sort_weight, 0) AS sort_weight,
               parent_id, path, COALESCE(visible, 1) AS visible,
               COALESCE(status, 1) AS status, type AS category_type
        FROM plus_category
        WHERE (
              (tenant_id = ? AND organization_id = ?)
              OR (tenant_id = ? AND organization_id = ?)
          )
          AND type = ?
          AND group_name = ?
          AND COALESCE(status, 1) >= 0
        ORDER BY
            CASE
                WHEN tenant_id = ? AND organization_id = ? THEN 0
                WHEN tenant_id = ? AND organization_id = ? THEN 1
                ELSE 2
            END,
            COALESCE(sort_weight, 0) ASC,
            id ASC
        LIMIT 500
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(PUBLIC_APP_STORE_TENANT_ID)
    .bind(PUBLIC_APP_STORE_ORGANIZATION_ID)
    .bind(APP_STORE_CATEGORY_TYPE)
    .bind(APP_STORE_CATEGORY_GROUP)
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(PUBLIC_APP_STORE_TENANT_ID)
    .bind(PUBLIC_APP_STORE_ORGANIZATION_ID)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list app categories", error))?;
    rows.into_iter().map(category_from_row).collect()
}

async fn list_apps(pool: &SqlitePool, query: ListAdminAppsQuery) -> DomainResult<AdminAppPage> {
    let page_size = query.page_size.unwrap_or(100).clamp(1, 200);
    let page_no = query.page_no.unwrap_or(1).max(1);
    let offset = (page_no - 1) * page_size;
    let keyword = query
        .keyword
        .as_ref()
        .map(|value| format!("%{}%", value.replace('%', "\\%").replace('_', "\\_")));
    let status_filter = query.status.as_deref().map(app_status_code).transpose()?;
    let category = match query.category_id {
        Some(category_id) => {
            load_app_category_filter(
                pool,
                category_id,
                query.subject.tenant_id,
                query.subject.organization_id,
            )
            .await?
        }
        None => None,
    };
    if query.category_id.is_some() && category.is_none() {
        return Ok(AdminAppPage::new(Vec::new(), 0, page_no, page_size));
    }
    let category_name = category.as_ref().map(|category| category.0.as_str());
    let category_code = category.as_ref().and_then(|category| category.1.as_deref());
    let total: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_app
        WHERE (
              (
                  tenant_id = ?
                  AND (
                      organization_id = ?
                      OR (? > 0 AND organization_id = 0)
                  )
              )
              OR (tenant_id = ? AND organization_id = 0)
          )
          AND (? IS NULL OR name LIKE ? ESCAPE '\' OR COALESCE(description, '') LIKE ? ESCAPE '\' OR COALESCE(json_extract(config, '$.standard.appKey'), '') LIKE ? ESCAPE '\')
          AND (? IS NULL OR COALESCE(status, 1) = ?)
          AND (? IS NULL OR COALESCE(NULLIF(json_extract(config, '$.portal.marketStatus'), ''), NULLIF(json_extract(config, '$.marketStatus'), ''), 'DRAFT') = ?)
          AND (? IS NULL OR app_type = ?)
          AND (
              ? IS NULL
              OR lower(COALESCE(
                  NULLIF(json_extract(config, '$.portal.category'), ''),
                  NULLIF(json_extract(config, '$.category'), ''),
                  NULLIF(json_extract(install_config, '$.portal.category'), ''),
                  replace(replace(COALESCE(app_type, ''), 'APP_', ''), '_', ' ')
              )) = lower(?)
              OR (? IS NOT NULL AND lower(COALESCE(
                  NULLIF(json_extract(config, '$.portal.category'), ''),
                  NULLIF(json_extract(config, '$.category'), ''),
                  NULLIF(json_extract(install_config, '$.portal.category'), ''),
                  replace(replace(COALESCE(app_type, ''), 'APP_', ''), '_', ' ')
              )) = lower(?))
          )
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(query.subject.organization_id)
    .bind(PUBLIC_APP_STORE_TENANT_ID)
    .bind(keyword.as_deref())
    .bind(keyword.as_deref())
    .bind(keyword.as_deref())
    .bind(keyword.as_deref())
    .bind(status_filter)
    .bind(status_filter)
    .bind(query.market_status.as_deref())
    .bind(query.market_status.as_deref())
    .bind(query.app_type.as_deref())
    .bind(query.app_type.as_deref())
    .bind(category_name)
    .bind(category_name)
    .bind(category_code)
    .bind(category_code)
    .fetch_one(pool)
    .await
    .map_err(|error| store_error("failed to count apps", error))?;
    let rows = sqlx::query(
        r#"
        SELECT
            id, uuid, tenant_id, organization_id, user_id, name, description, version,
            CAST(icon AS TEXT) AS icon, icon_url, CAST(resource_list AS TEXT) AS resource_list,
            project_id, access_url, CAST(config AS TEXT) AS config,
            json_extract(config, '$.standard.appKey') AS app_key,
            COALESCE(status, 1) AS status,
            COALESCE(
                NULLIF(json_extract(config, '$.portal.marketStatus'), ''),
                NULLIF(json_extract(config, '$.marketStatus'), ''),
                'DRAFT'
            ) AS market_status,
            app_type, CAST(platforms AS TEXT) AS platforms,
            CAST(install_platforms AS TEXT) AS install_platforms,
            CAST(install_skill AS TEXT) AS install_skill,
            CAST(install_config AS TEXT) AS install_config,
            CAST(release_notes AS TEXT) AS release_notes,
            package_name, bundle_id, store_url, download_url,
            CAST(created_at AS TEXT) AS created_at,
            CAST(updated_at AS TEXT) AS updated_at
        FROM plus_app
        WHERE (
              (
                  tenant_id = ?
                  AND (
                      organization_id = ?
                      OR (? > 0 AND organization_id = 0)
                  )
              )
              OR (tenant_id = ? AND organization_id = 0)
          )
          AND (? IS NULL OR name LIKE ? ESCAPE '\' OR COALESCE(description, '') LIKE ? ESCAPE '\' OR COALESCE(json_extract(config, '$.standard.appKey'), '') LIKE ? ESCAPE '\')
          AND (? IS NULL OR COALESCE(status, 1) = ?)
          AND (? IS NULL OR COALESCE(NULLIF(json_extract(config, '$.portal.marketStatus'), ''), NULLIF(json_extract(config, '$.marketStatus'), ''), 'DRAFT') = ?)
          AND (? IS NULL OR app_type = ?)
          AND (
              ? IS NULL
              OR lower(COALESCE(
                  NULLIF(json_extract(config, '$.portal.category'), ''),
                  NULLIF(json_extract(config, '$.category'), ''),
                  NULLIF(json_extract(install_config, '$.portal.category'), ''),
                  replace(replace(COALESCE(app_type, ''), 'APP_', ''), '_', ' ')
              )) = lower(?)
              OR (? IS NOT NULL AND lower(COALESCE(
                  NULLIF(json_extract(config, '$.portal.category'), ''),
                  NULLIF(json_extract(config, '$.category'), ''),
                  NULLIF(json_extract(install_config, '$.portal.category'), ''),
                  replace(replace(COALESCE(app_type, ''), 'APP_', ''), '_', ' ')
              )) = lower(?))
          )
        ORDER BY
            CASE
                WHEN tenant_id = ? AND organization_id = ? THEN 0
                WHEN tenant_id = ? AND organization_id = 0 THEN 1
                WHEN tenant_id = ? AND organization_id = 0 THEN 2
                ELSE 3
            END,
            COALESCE(updated_at, created_at) DESC,
            id DESC
        LIMIT ? OFFSET ?
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(query.subject.organization_id)
    .bind(PUBLIC_APP_STORE_TENANT_ID)
    .bind(keyword.as_deref())
    .bind(keyword.as_deref())
    .bind(keyword.as_deref())
    .bind(keyword.as_deref())
    .bind(status_filter)
    .bind(status_filter)
    .bind(query.market_status.as_deref())
    .bind(query.market_status.as_deref())
    .bind(query.app_type.as_deref())
    .bind(query.app_type.as_deref())
    .bind(category_name)
    .bind(category_name)
    .bind(category_code)
    .bind(category_code)
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(query.subject.tenant_id)
    .bind(PUBLIC_APP_STORE_TENANT_ID)
    .bind(page_size)
    .bind(offset)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list apps", error))?;
    let items = rows
        .into_iter()
        .map(app_from_row)
        .collect::<DomainResult<Vec<_>>>()?;
    Ok(AdminAppPage::new(items, total, page_no, page_size))
}

async fn list_app_templates(
    pool: &SqlitePool,
    query: ListAdminAppTemplatesQuery,
) -> DomainResult<AdminAppTemplatePage> {
    let page_size = query.page_size.unwrap_or(100).clamp(1, 200);
    let page_no = query.page_no.unwrap_or(1).max(1);
    let offset = (page_no - 1) * page_size;
    let keyword = query
        .keyword
        .as_ref()
        .map(|value| format!("%{}%", value.replace('%', "\\%").replace('_', "\\_")));
    let publish_status = query
        .publish_status
        .as_deref()
        .map(template_publish_status_code)
        .transpose()?;

    let total: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM studio_app_template
        WHERE (
              (
                  tenant_id = ?
                  AND (
                      organization_id = ?
                      OR (? > 0 AND organization_id = 0)
                  )
              )
              OR (tenant_id = ? AND organization_id = 0)
          )
          AND COALESCE(status, 1) >= 0
          AND (? IS NULL OR template_name LIKE ? ESCAPE '\' OR template_code LIKE ? ESCAPE '\' OR COALESCE(description, '') LIKE ? ESCAPE '\')
          AND (? IS NULL OR COALESCE(publish_status, 1) = ?)
          AND (? IS NULL OR template_type = ?)
          AND (? IS NULL OR runtime = ?)
          AND (? IS NULL OR category_id = ?)
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(query.subject.organization_id)
    .bind(PUBLIC_APP_STORE_TENANT_ID)
    .bind(keyword.as_deref())
    .bind(keyword.as_deref())
    .bind(keyword.as_deref())
    .bind(keyword.as_deref())
    .bind(publish_status)
    .bind(publish_status)
    .bind(query.template_type.as_deref())
    .bind(query.template_type.as_deref())
    .bind(query.runtime.as_deref())
    .bind(query.runtime.as_deref())
    .bind(query.category_id)
    .bind(query.category_id)
    .fetch_one(pool)
    .await
    .map_err(|error| store_error("failed to count app templates", error))?;

    let rows = sqlx::query(
        r#"
        SELECT
            id, uuid, tenant_id, organization_id, template_no, template_code, template_name,
            description, category_id, category_code, template_type, runtime, framework, language,
            icon_url, cover_url, COALESCE(visibility, 1) AS visibility,
            COALESCE(publish_status, 1) AS publish_status,
            COALESCE(featured, 0) AS featured, COALESCE(sort_weight, 0) AS sort_weight,
            source_app_id, git_repo_url, git_ref, git_sub_path, current_version_id,
            CAST(app_config_schema AS TEXT) AS app_config_schema,
            CAST(default_app_config AS TEXT) AS default_app_config,
            CAST(variable_schema AS TEXT) AS variable_schema,
            CAST(dependency_manifest AS TEXT) AS dependency_manifest,
            CAST(capability_manifest AS TEXT) AS capability_manifest,
            CAST(created_at AS TEXT) AS created_at,
            CAST(updated_at AS TEXT) AS updated_at
        FROM studio_app_template
        WHERE (
              (
                  tenant_id = ?
                  AND (
                      organization_id = ?
                      OR (? > 0 AND organization_id = 0)
                  )
              )
              OR (tenant_id = ? AND organization_id = 0)
          )
          AND COALESCE(status, 1) >= 0
          AND (? IS NULL OR template_name LIKE ? ESCAPE '\' OR template_code LIKE ? ESCAPE '\' OR COALESCE(description, '') LIKE ? ESCAPE '\')
          AND (? IS NULL OR COALESCE(publish_status, 1) = ?)
          AND (? IS NULL OR template_type = ?)
          AND (? IS NULL OR runtime = ?)
          AND (? IS NULL OR category_id = ?)
        ORDER BY
            CASE
                WHEN tenant_id = ? AND organization_id = ? THEN 0
                WHEN tenant_id = ? AND organization_id = 0 THEN 1
                WHEN tenant_id = ? AND organization_id = 0 THEN 2
                ELSE 3
            END,
            COALESCE(featured, 0) DESC,
            COALESCE(sort_weight, 0) ASC,
            COALESCE(updated_at, created_at) DESC,
            id DESC
        LIMIT ? OFFSET ?
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(query.subject.organization_id)
    .bind(PUBLIC_APP_STORE_TENANT_ID)
    .bind(keyword.as_deref())
    .bind(keyword.as_deref())
    .bind(keyword.as_deref())
    .bind(keyword.as_deref())
    .bind(publish_status)
    .bind(publish_status)
    .bind(query.template_type.as_deref())
    .bind(query.template_type.as_deref())
    .bind(query.runtime.as_deref())
    .bind(query.runtime.as_deref())
    .bind(query.category_id)
    .bind(query.category_id)
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(query.subject.tenant_id)
    .bind(PUBLIC_APP_STORE_TENANT_ID)
    .bind(page_size)
    .bind(offset)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list app templates", error))?;
    let items = rows
        .into_iter()
        .map(template_from_row)
        .collect::<DomainResult<Vec<_>>>()?;
    Ok(AdminAppTemplatePage::new(items, total, page_no, page_size))
}

async fn load_app_category_filter(
    pool: &SqlitePool,
    category_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<(String, Option<String>)>> {
    let row = sqlx::query(
        r#"
        SELECT name, code
        FROM plus_category
        WHERE id = ?
          AND (
              (tenant_id = ? AND organization_id = ?)
              OR (tenant_id = ? AND organization_id = ?)
          )
          AND type = ?
          AND group_name = ?
          AND COALESCE(status, 1) >= 0
        ORDER BY
            CASE
                WHEN tenant_id = ? AND organization_id = ? THEN 0
                WHEN tenant_id = ? AND organization_id = ? THEN 1
                ELSE 2
            END
        LIMIT 1
        "#,
    )
    .bind(category_id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(PUBLIC_APP_STORE_TENANT_ID)
    .bind(PUBLIC_APP_STORE_ORGANIZATION_ID)
    .bind(APP_STORE_CATEGORY_TYPE)
    .bind(APP_STORE_CATEGORY_GROUP)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(PUBLIC_APP_STORE_TENANT_ID)
    .bind(PUBLIC_APP_STORE_ORGANIZATION_ID)
    .fetch_optional(pool)
    .await
    .map_err(|error| store_error("failed to load app category filter", error))?;
    Ok(row.map(|row| {
        (
            row.try_get::<String, _>("name").unwrap_or_default(),
            row.try_get::<Option<String>, _>("code").ok().flatten(),
        )
    }))
}

async fn load_app_by_id(
    pool: &SqlitePool,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminAppItem>> {
    let row = app_by_id_query()
        .bind(id)
        .bind(tenant_id)
        .bind(organization_id)
        .bind(organization_id)
        .bind(PUBLIC_APP_STORE_TENANT_ID)
        .bind(tenant_id)
        .bind(organization_id)
        .bind(tenant_id)
        .bind(PUBLIC_APP_STORE_TENANT_ID)
        .fetch_optional(pool)
        .await
        .map_err(|error| store_error("failed to load app", error))?;
    row.map(app_from_row).transpose()
}

async fn load_app_by_id_tx(
    tx: &mut Transaction<'_, Sqlite>,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminAppItem>> {
    let row = app_by_id_owned_query()
        .bind(id)
        .bind(tenant_id)
        .bind(organization_id)
        .fetch_optional(&mut **tx)
        .await
        .map_err(|error| store_error("failed to load app", error))?;
    row.map(app_from_row).transpose()
}

fn app_by_id_query() -> sqlx::query::Query<'static, Sqlite, sqlx::sqlite::SqliteArguments<'static>>
{
    sqlx::query(
        r#"
        SELECT
            id, uuid, tenant_id, organization_id, user_id, name, description, version,
            CAST(icon AS TEXT) AS icon, icon_url, CAST(resource_list AS TEXT) AS resource_list,
            project_id, access_url, CAST(config AS TEXT) AS config,
            json_extract(config, '$.standard.appKey') AS app_key,
            COALESCE(status, 1) AS status,
            COALESCE(
                NULLIF(json_extract(config, '$.portal.marketStatus'), ''),
                NULLIF(json_extract(config, '$.marketStatus'), ''),
                'DRAFT'
            ) AS market_status,
            app_type, CAST(platforms AS TEXT) AS platforms,
            CAST(install_platforms AS TEXT) AS install_platforms,
            CAST(install_skill AS TEXT) AS install_skill,
            CAST(install_config AS TEXT) AS install_config,
            CAST(release_notes AS TEXT) AS release_notes,
            package_name, bundle_id, store_url, download_url,
            CAST(created_at AS TEXT) AS created_at,
            CAST(updated_at AS TEXT) AS updated_at
        FROM plus_app
        WHERE id = ?
          AND (
              (
                  tenant_id = ?
                  AND (
                      organization_id = ?
                      OR (? > 0 AND organization_id = 0)
                  )
              )
              OR (tenant_id = ? AND organization_id = 0)
          )
        ORDER BY
            CASE
                WHEN tenant_id = ? AND organization_id = ? THEN 0
                WHEN tenant_id = ? AND organization_id = 0 THEN 1
                WHEN tenant_id = ? AND organization_id = 0 THEN 2
                ELSE 3
            END,
            id DESC
        LIMIT 1
        "#,
    )
}

fn app_by_id_owned_query(
) -> sqlx::query::Query<'static, Sqlite, sqlx::sqlite::SqliteArguments<'static>> {
    sqlx::query(
        r#"
        SELECT
            id, uuid, tenant_id, organization_id, user_id, name, description, version,
            CAST(icon AS TEXT) AS icon, icon_url, CAST(resource_list AS TEXT) AS resource_list,
            project_id, access_url, CAST(config AS TEXT) AS config,
            json_extract(config, '$.standard.appKey') AS app_key,
            COALESCE(status, 1) AS status,
            COALESCE(
                NULLIF(json_extract(config, '$.portal.marketStatus'), ''),
                NULLIF(json_extract(config, '$.marketStatus'), ''),
                'DRAFT'
            ) AS market_status,
            app_type, CAST(platforms AS TEXT) AS platforms,
            CAST(install_platforms AS TEXT) AS install_platforms,
            CAST(install_skill AS TEXT) AS install_skill,
            CAST(install_config AS TEXT) AS install_config,
            CAST(release_notes AS TEXT) AS release_notes,
            package_name, bundle_id, store_url, download_url,
            CAST(created_at AS TEXT) AS created_at,
            CAST(updated_at AS TEXT) AS updated_at
        FROM plus_app
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
        LIMIT 1
        "#,
    )
}

async fn load_template_by_id(
    pool: &SqlitePool,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminAppTemplateItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            id, uuid, tenant_id, organization_id, template_no, template_code, template_name,
            description, category_id, category_code, template_type, runtime, framework, language,
            icon_url, cover_url, COALESCE(visibility, 1) AS visibility,
            COALESCE(publish_status, 1) AS publish_status,
            COALESCE(featured, 0) AS featured, COALESCE(sort_weight, 0) AS sort_weight,
            source_app_id, git_repo_url, git_ref, git_sub_path, current_version_id,
            CAST(app_config_schema AS TEXT) AS app_config_schema,
            CAST(default_app_config AS TEXT) AS default_app_config,
            CAST(variable_schema AS TEXT) AS variable_schema,
            CAST(dependency_manifest AS TEXT) AS dependency_manifest,
            CAST(capability_manifest AS TEXT) AS capability_manifest,
            CAST(created_at AS TEXT) AS created_at,
            CAST(updated_at AS TEXT) AS updated_at
        FROM studio_app_template
        WHERE id = ?
          AND (
              (
                  tenant_id = ?
                  AND (
                      organization_id = ?
                      OR (? > 0 AND organization_id = 0)
                  )
              )
              OR (tenant_id = ? AND organization_id = 0)
          )
          AND COALESCE(status, 1) >= 0
        ORDER BY
            CASE
                WHEN tenant_id = ? AND organization_id = ? THEN 0
                WHEN tenant_id = ? AND organization_id = 0 THEN 1
                WHEN tenant_id = ? AND organization_id = 0 THEN 2
                ELSE 3
            END,
            id DESC
        LIMIT 1
        "#,
    )
    .bind(id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(organization_id)
    .bind(PUBLIC_APP_STORE_TENANT_ID)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(tenant_id)
    .bind(PUBLIC_APP_STORE_TENANT_ID)
    .fetch_optional(pool)
    .await
    .map_err(|error| store_error("failed to load app template", error))?;
    row.map(template_from_row).transpose()
}

async fn load_template_by_id_tx(
    tx: &mut Transaction<'_, Sqlite>,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminAppTemplateItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            id, uuid, tenant_id, organization_id, template_no, template_code, template_name,
            description, category_id, category_code, template_type, runtime, framework, language,
            icon_url, cover_url, COALESCE(visibility, 1) AS visibility,
            COALESCE(publish_status, 1) AS publish_status,
            COALESCE(featured, 0) AS featured, COALESCE(sort_weight, 0) AS sort_weight,
            source_app_id, git_repo_url, git_ref, git_sub_path, current_version_id,
            CAST(app_config_schema AS TEXT) AS app_config_schema,
            CAST(default_app_config AS TEXT) AS default_app_config,
            CAST(variable_schema AS TEXT) AS variable_schema,
            CAST(dependency_manifest AS TEXT) AS dependency_manifest,
            CAST(capability_manifest AS TEXT) AS capability_manifest,
            CAST(created_at AS TEXT) AS created_at,
            CAST(updated_at AS TEXT) AS updated_at
        FROM studio_app_template
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND COALESCE(status, 1) >= 0
        LIMIT 1
        "#,
    )
    .bind(id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load app template", error))?;
    row.map(template_from_row).transpose()
}

async fn insert_app_template(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminAppTemplateCommand,
) -> DomainResult<i64> {
    let id = next_template_assigned_id(tx, &command.template_uuid).await?;
    let visibility = template_visibility_code(&command.visibility)?;
    let publish_status = template_publish_status_code(&command.publish_status)?;
    sqlx::query(
        r#"
        INSERT INTO studio_app_template
            (id, uuid, tenant_id, organization_id, data_scope, status, template_no, template_code,
             template_name, description, category_id, category_code, template_type, runtime,
             framework, language, icon_url, cover_url, visibility, publish_status, featured,
             sort_weight, source_app_id, git_repo_url, git_ref, git_sub_path,
             app_config_schema, default_app_config, variable_schema,
             dependency_manifest, capability_manifest, created_at, updated_at)
        VALUES
            (?, ?, ?, ?, 1, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#,
    )
    .bind(id)
    .bind(&command.template_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.template_no)
    .bind(&command.template_code)
    .bind(&command.template_name)
    .bind(command.description.as_deref())
    .bind(command.category_id)
    .bind(command.category_code.as_deref())
    .bind(command.template_type.as_deref())
    .bind(command.runtime.as_deref())
    .bind(command.framework.as_deref())
    .bind(command.language.as_deref())
    .bind(command.icon_url.as_deref())
    .bind(command.cover_url.as_deref())
    .bind(visibility)
    .bind(publish_status)
    .bind(command.featured)
    .bind(command.sort_weight)
    .bind(command.source_app_id)
    .bind(command.git_repo_url.as_deref())
    .bind(command.git_ref.as_deref())
    .bind(command.git_sub_path.as_deref())
    .bind(command.app_config_schema.to_string())
    .bind(command.default_app_config.to_string())
    .bind(command.variable_schema.to_string())
    .bind(command.dependency_manifest.to_string())
    .bind(command.capability_manifest.to_string())
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create app template", error))?;
    Ok(id)
}

async fn update_app_template(
    tx: &mut Transaction<'_, Sqlite>,
    command: &UpdateAdminAppTemplateCommand,
) -> DomainResult<bool> {
    let Some(existing) = load_template_by_id_tx(
        tx,
        command.template_id,
        command.subject.tenant_id,
        command.subject.organization_id,
    )
    .await?
    else {
        return Ok(false);
    };
    let visibility = template_visibility_code(
        command
            .visibility
            .as_deref()
            .unwrap_or(existing.visibility.as_str()),
    )?;
    let publish_status = template_publish_status_code(
        command
            .publish_status
            .as_deref()
            .unwrap_or(existing.publish_status.as_str()),
    )?;
    sqlx::query(
        r#"
        UPDATE studio_app_template
        SET template_name = ?,
            description = ?,
            category_id = ?,
            category_code = ?,
            template_type = ?,
            runtime = ?,
            framework = ?,
            language = ?,
            icon_url = ?,
            cover_url = ?,
            visibility = ?,
            publish_status = ?,
            featured = ?,
            sort_weight = ?,
            source_app_id = ?,
            git_repo_url = ?,
            git_ref = ?,
            git_sub_path = ?,
            app_config_schema = ?,
            default_app_config = ?,
            variable_schema = ?,
            dependency_manifest = ?,
            capability_manifest = ?,
            updated_at = ?,
            version = COALESCE(version, 0) + 1
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND COALESCE(status, 1) >= 0
        "#,
    )
    .bind(
        command
            .template_name
            .as_deref()
            .unwrap_or(existing.template_name.as_str()),
    )
    .bind(command.description.clone().unwrap_or(existing.description))
    .bind(command.category_id.unwrap_or(existing.category_id))
    .bind(
        command
            .category_code
            .clone()
            .unwrap_or(existing.category_code),
    )
    .bind(
        command
            .template_type
            .clone()
            .unwrap_or(existing.template_type),
    )
    .bind(command.runtime.clone().unwrap_or(existing.runtime))
    .bind(command.framework.clone().unwrap_or(existing.framework))
    .bind(command.language.clone().unwrap_or(existing.language))
    .bind(command.icon_url.clone().unwrap_or(existing.icon_url))
    .bind(command.cover_url.clone().unwrap_or(existing.cover_url))
    .bind(visibility)
    .bind(publish_status)
    .bind(command.featured.unwrap_or(existing.featured))
    .bind(command.sort_weight.unwrap_or(existing.sort_weight))
    .bind(command.source_app_id.unwrap_or(existing.source_app_id))
    .bind(
        command
            .git_repo_url
            .clone()
            .unwrap_or(existing.git_repo_url),
    )
    .bind(command.git_ref.clone().unwrap_or(existing.git_ref))
    .bind(
        command
            .git_sub_path
            .clone()
            .unwrap_or(existing.git_sub_path),
    )
    .bind(
        command
            .app_config_schema
            .clone()
            .unwrap_or(existing.app_config_schema)
            .to_string(),
    )
    .bind(
        command
            .default_app_config
            .clone()
            .unwrap_or(existing.default_app_config)
            .to_string(),
    )
    .bind(
        command
            .variable_schema
            .clone()
            .unwrap_or(existing.variable_schema)
            .to_string(),
    )
    .bind(
        command
            .dependency_manifest
            .clone()
            .unwrap_or(existing.dependency_manifest)
            .to_string(),
    )
    .bind(
        command
            .capability_manifest
            .clone()
            .unwrap_or(existing.capability_manifest)
            .to_string(),
    )
    .bind(&command.requested_at)
    .bind(command.template_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update app template", error))?;
    Ok(true)
}

async fn set_app_template_publish_status(
    tx: &mut Transaction<'_, Sqlite>,
    command: &SetAdminAppTemplatePublishStatusCommand,
) -> DomainResult<bool> {
    let publish_status = template_publish_status_code(&command.publish_status)?;
    let result = sqlx::query(
        r#"
        UPDATE studio_app_template
        SET publish_status = ?,
            published_at = CASE WHEN ? = 2 THEN ? ELSE published_at END,
            deprecated_at = CASE WHEN ? = 3 THEN ? ELSE deprecated_at END,
            updated_at = ?,
            version = COALESCE(version, 0) + 1
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND COALESCE(status, 1) >= 0
        "#,
    )
    .bind(publish_status)
    .bind(publish_status)
    .bind(&command.requested_at)
    .bind(publish_status)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(command.template_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update app template publish status", error))?;
    Ok(result.rows_affected() > 0)
}

async fn delete_app_template(
    tx: &mut Transaction<'_, Sqlite>,
    command: &DeleteAdminAppTemplateCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE studio_app_template
        SET status = -1,
            deleted_at = ?,
            deleted_by = ?,
            updated_at = ?,
            version = COALESCE(version, 0) + 1
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND COALESCE(status, 1) >= 0
        "#,
    )
    .bind(&command.requested_at)
    .bind(command.subject.operator_id)
    .bind(&command.requested_at)
    .bind(command.template_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete app template", error))?;
    if result.rows_affected() == 0 {
        return Ok(false);
    }
    delete_template_catalog_projection(tx, "studio_catalog_action", command).await?;
    delete_template_catalog_projection(tx, "studio_catalog_asset", command).await?;
    delete_template_catalog_projection(tx, "studio_catalog_artifact", command).await?;
    Ok(true)
}

async fn insert_app(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminAppCommand,
) -> DomainResult<i64> {
    let id = next_assigned_id(tx, &command.app_uuid).await?;
    let mut config = command.config.clone();
    let status_code = app_status_code(&command.status)?;
    let market_status = app_market_status(&command.market_status)?;
    normalize_config(&mut config, command.app_key.as_deref(), Some(market_status))?;
    sqlx::query(
        r#"
        INSERT INTO plus_app
            (id, uuid, tenant_id, organization_id, data_scope, user_id, name, icon, resource_list, project_id, description, version, icon_url, access_url, config, status, app_type, platforms, install_platforms, install_skill, install_config, release_notes, package_name, bundle_id, store_url, download_url, created_at, updated_at)
        VALUES
            (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#,
    )
    .bind(id)
    .bind(&command.app_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.user_id)
    .bind(&command.name)
    .bind(command.icon.to_string())
    .bind(command.resource_list.to_string())
    .bind(command.project_id)
    .bind(command.description.as_deref())
    .bind(command.version.as_deref())
    .bind(command.icon_url.as_deref())
    .bind(command.access_url.as_deref())
    .bind(config.to_string())
    .bind(status_code)
    .bind(command.app_type.as_deref())
    .bind(command.platforms.to_string())
    .bind(command.install_platforms.to_string())
    .bind(command.install_skill.to_string())
    .bind(command.install_config.to_string())
    .bind(command.release_notes.to_string())
    .bind(command.package_name.as_deref())
    .bind(command.bundle_id.as_deref())
    .bind(command.store_url.as_deref())
    .bind(command.download_url.as_deref())
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create app", error))?;
    Ok(id)
}

async fn insert_category(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminAppCategoryCommand,
) -> DomainResult<i64> {
    let id = next_category_assigned_id(tx, &command.category_uuid).await?;
    sqlx::query(
        r#"
        INSERT INTO plus_category
            (id, uuid, tenant_id, organization_id, data_scope, name, description, type, group_name, code, icon, sort_weight, parent_id, path, visible, status, created_at, updated_at)
        VALUES
            (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#,
    )
    .bind(id)
    .bind(&command.category_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.name)
    .bind(command.description.as_deref())
    .bind(command.category_type)
    .bind(APP_STORE_CATEGORY_GROUP)
    .bind(command.code.as_deref())
    .bind(command.icon.as_deref())
    .bind(command.sort_weight)
    .bind(command.parent_id)
    .bind(command.path.as_deref())
    .bind(command.visible)
    .bind(command.status)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create app category", error))?;
    Ok(id)
}

async fn load_category_by_id(
    tx: &mut Transaction<'_, Sqlite>,
    category_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminAppCategoryItem>> {
    let row = sqlx::query(
        r#"
        SELECT id, uuid, tenant_id, organization_id, name, description, code, icon,
               COALESCE(sort_weight, 0) AS sort_weight,
               parent_id, path, COALESCE(visible, 1) AS visible,
               COALESCE(status, 1) AS status, type AS category_type
        FROM plus_category
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND type = ?
          AND group_name = ?
        "#,
    )
    .bind(category_id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(APP_STORE_CATEGORY_TYPE)
    .bind(APP_STORE_CATEGORY_GROUP)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load app category", error))?;
    row.map(category_from_row).transpose()
}

async fn update_app(
    tx: &mut Transaction<'_, Sqlite>,
    command: &UpdateAdminAppCommand,
) -> DomainResult<bool> {
    let Some(existing) = load_app_by_id_tx(
        tx,
        command.app_id,
        command.subject.tenant_id,
        command.subject.organization_id,
    )
    .await?
    else {
        return Ok(false);
    };
    let app_key = match &command.app_key {
        Some(value) => value.clone(),
        None => existing.app_key.clone(),
    };
    let mut config = command.config.clone().unwrap_or(existing.config);
    normalize_config(
        &mut config,
        app_key.as_deref(),
        Some(existing.market_status.as_str()),
    )?;
    sqlx::query(
        r#"
        UPDATE plus_app
        SET user_id = ?,
            name = ?,
            description = ?,
            version = ?,
            icon = ?,
            icon_url = ?,
            resource_list = ?,
            project_id = ?,
            access_url = ?,
            config = ?,
            app_type = ?,
            platforms = ?,
            install_platforms = ?,
            install_skill = ?,
            install_config = ?,
            release_notes = ?,
            package_name = ?,
            bundle_id = ?,
            store_url = ?,
            download_url = ?,
            updated_at = ?,
            v = COALESCE(v, 0) + 1
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
        "#,
    )
    .bind(command.user_id.unwrap_or(existing.user_id))
    .bind(command.name.as_deref().unwrap_or(existing.name.as_str()))
    .bind(
        command
            .description
            .clone()
            .unwrap_or(existing.description)
            .as_deref()
            .map(str::to_owned),
    )
    .bind(command.version.clone().unwrap_or(existing.version))
    .bind(command.icon.clone().unwrap_or(existing.icon).to_string())
    .bind(command.icon_url.clone().unwrap_or(existing.icon_url))
    .bind(
        command
            .resource_list
            .clone()
            .unwrap_or(existing.resource_list)
            .to_string(),
    )
    .bind(command.project_id.unwrap_or(existing.project_id))
    .bind(command.access_url.clone().unwrap_or(existing.access_url))
    .bind(config.to_string())
    .bind(command.app_type.clone().unwrap_or(existing.app_type))
    .bind(
        command
            .platforms
            .clone()
            .unwrap_or(existing.platforms)
            .to_string(),
    )
    .bind(
        command
            .install_platforms
            .clone()
            .unwrap_or(existing.install_platforms)
            .to_string(),
    )
    .bind(
        command
            .install_skill
            .clone()
            .unwrap_or(existing.install_skill)
            .to_string(),
    )
    .bind(
        command
            .install_config
            .clone()
            .unwrap_or(existing.install_config)
            .to_string(),
    )
    .bind(
        command
            .release_notes
            .clone()
            .unwrap_or(existing.release_notes)
            .to_string(),
    )
    .bind(
        command
            .package_name
            .clone()
            .unwrap_or(existing.package_name),
    )
    .bind(command.bundle_id.clone().unwrap_or(existing.bundle_id))
    .bind(command.store_url.clone().unwrap_or(existing.store_url))
    .bind(
        command
            .download_url
            .clone()
            .unwrap_or(existing.download_url),
    )
    .bind(&command.requested_at)
    .bind(command.app_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update app", error))?;
    Ok(true)
}

async fn update_category(
    tx: &mut Transaction<'_, Sqlite>,
    command: &UpdateAdminAppCategoryCommand,
) -> DomainResult<bool> {
    if command.parent_id.flatten() == Some(command.category_id) {
        return Err(DomainError::new(
            "app category parent cannot reference itself",
        ));
    }
    let result = sqlx::query(
        r#"
        UPDATE plus_category
        SET name = CASE WHEN ? THEN ? ELSE name END,
            description = CASE WHEN ? THEN ? ELSE description END,
            code = CASE WHEN ? THEN ? ELSE code END,
            icon = CASE WHEN ? THEN ? ELSE icon END,
            sort_weight = CASE WHEN ? THEN ? ELSE sort_weight END,
            parent_id = CASE WHEN ? THEN ? ELSE parent_id END,
            path = CASE WHEN ? THEN ? ELSE path END,
            visible = CASE WHEN ? THEN ? ELSE visible END,
            status = CASE WHEN ? THEN ? ELSE status END,
            updated_at = ?,
            v = COALESCE(v, 0) + 1
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND type = ?
          AND group_name = ?
        "#,
    )
    .bind(command.name.is_some())
    .bind(command.name.as_deref())
    .bind(command.description.is_some())
    .bind(command.description.clone().flatten())
    .bind(command.code.is_some())
    .bind(command.code.clone().flatten())
    .bind(command.icon.is_some())
    .bind(command.icon.clone().flatten())
    .bind(command.sort_weight.is_some())
    .bind(command.sort_weight)
    .bind(command.parent_id.is_some())
    .bind(command.parent_id.flatten())
    .bind(command.path.is_some())
    .bind(command.path.clone().flatten())
    .bind(command.visible.is_some())
    .bind(command.visible)
    .bind(command.status.is_some())
    .bind(command.status)
    .bind(&command.requested_at)
    .bind(command.category_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(APP_STORE_CATEGORY_TYPE)
    .bind(APP_STORE_CATEGORY_GROUP)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update app category", error))?;
    Ok(result.rows_affected() > 0)
}

async fn set_app_status(
    tx: &mut Transaction<'_, Sqlite>,
    command: &SetAdminAppStatusCommand,
) -> DomainResult<bool> {
    let Some(existing) = load_app_by_id_tx(
        tx,
        command.app_id,
        command.subject.tenant_id,
        command.subject.organization_id,
    )
    .await?
    else {
        return Ok(false);
    };
    let mut config = existing.config;
    normalize_config(
        &mut config,
        existing.app_key.as_deref(),
        command
            .market_status
            .as_deref()
            .map(app_market_status)
            .transpose()?,
    )?;
    let status = command
        .status
        .as_deref()
        .unwrap_or(existing.status.as_str());
    let status_code = app_status_code(status)?;
    sqlx::query(
        r#"
        UPDATE plus_app
        SET status = ?,
            config = ?,
            updated_at = ?,
            v = COALESCE(v, 0) + 1
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
        "#,
    )
    .bind(status_code)
    .bind(config.to_string())
    .bind(&command.requested_at)
    .bind(command.app_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update app status", error))?;
    Ok(true)
}

async fn delete_app(
    tx: &mut Transaction<'_, Sqlite>,
    command: &DeleteAdminAppCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        DELETE FROM plus_app
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
        "#,
    )
    .bind(command.app_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete app", error))?;
    if result.rows_affected() == 0 {
        return Ok(false);
    }
    delete_catalog_projection(tx, "studio_catalog_action", command).await?;
    delete_catalog_projection(tx, "studio_catalog_asset", command).await?;
    delete_catalog_projection(tx, "studio_catalog_artifact", command).await?;
    Ok(true)
}

async fn delete_category(
    tx: &mut Transaction<'_, Sqlite>,
    command: &DeleteAdminAppCategoryCommand,
) -> DomainResult<bool> {
    ensure_category_delete_allowed(tx, command).await?;
    let result = sqlx::query(
        r#"
        UPDATE plus_category
        SET status = -1,
            visible = 0,
            updated_at = ?,
            v = COALESCE(v, 0) + 1
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND type = ?
          AND group_name = ?
        "#,
    )
    .bind(&command.requested_at)
    .bind(command.category_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(APP_STORE_CATEGORY_TYPE)
    .bind(APP_STORE_CATEGORY_GROUP)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete app category", error))?;
    Ok(result.rows_affected() > 0)
}

async fn ensure_category_delete_allowed(
    tx: &mut Transaction<'_, Sqlite>,
    command: &DeleteAdminAppCategoryCommand,
) -> DomainResult<()> {
    let child_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_category
        WHERE tenant_id = ?
          AND organization_id = ?
          AND parent_id = ?
          AND type = ?
          AND group_name = ?
          AND COALESCE(status, 1) >= 0
        "#,
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.category_id)
    .bind(APP_STORE_CATEGORY_TYPE)
    .bind(APP_STORE_CATEGORY_GROUP)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to validate child app categories", error))?;
    if child_count > 0 {
        return Err(DomainError::conflict("app category has child categories"));
    }
    Ok(())
}

async fn delete_catalog_projection(
    tx: &mut Transaction<'_, Sqlite>,
    table_name: &'static str,
    command: &DeleteAdminAppCommand,
) -> DomainResult<()> {
    let sql = match table_name {
        "studio_catalog_action" => {
            r#"
            DELETE FROM studio_catalog_action
            WHERE tenant_id = ?
              AND organization_id = ?
              AND target_type = ?
              AND target_id = ?
            "#
        }
        "studio_catalog_asset" => {
            r#"
            DELETE FROM studio_catalog_asset
            WHERE tenant_id = ?
              AND organization_id = ?
              AND target_type = ?
              AND target_id = ?
            "#
        }
        "studio_catalog_artifact" => {
            r#"
            DELETE FROM studio_catalog_artifact
            WHERE tenant_id = ?
              AND organization_id = ?
              AND target_type = ?
              AND target_id = ?
            "#
        }
        _ => return Err(DomainError::new("unsupported app catalog projection table")),
    };
    sqlx::query(sql)
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(APP_TARGET_TYPE)
        .bind(command.app_id)
        .execute(&mut **tx)
        .await
        .map_err(|error| store_error("failed to delete app catalog projection", error))?;
    Ok(())
}

async fn delete_template_catalog_projection(
    tx: &mut Transaction<'_, Sqlite>,
    table_name: &'static str,
    command: &DeleteAdminAppTemplateCommand,
) -> DomainResult<()> {
    let sql = match table_name {
        "studio_catalog_action" => {
            r#"
            DELETE FROM studio_catalog_action
            WHERE tenant_id = ?
              AND organization_id = ?
              AND target_type = ?
              AND target_id = ?
            "#
        }
        "studio_catalog_asset" => {
            r#"
            DELETE FROM studio_catalog_asset
            WHERE tenant_id = ?
              AND organization_id = ?
              AND target_type = ?
              AND target_id = ?
            "#
        }
        "studio_catalog_artifact" => {
            r#"
            DELETE FROM studio_catalog_artifact
            WHERE tenant_id = ?
              AND organization_id = ?
              AND target_type = ?
              AND target_id = ?
            "#
        }
        _ => {
            return Err(DomainError::new(
                "unsupported app template catalog projection table",
            ))
        }
    };
    sqlx::query(sql)
        .bind(command.subject.tenant_id)
        .bind(command.subject.organization_id)
        .bind(APP_TEMPLATE_TARGET_TYPE)
        .bind(command.template_id)
        .execute(&mut **tx)
        .await
        .map_err(|error| store_error("failed to delete app template catalog projection", error))?;
    Ok(())
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
    .map_err(|error| store_error("failed to write app audit log", error))?;
    Ok(())
}

async fn next_assigned_id(tx: &mut Transaction<'_, Sqlite>, app_uuid: &str) -> DomainResult<i64> {
    for attempt in 0..MAX_ASSIGNED_ID_ATTEMPTS {
        let id = assigned_entity_id("admin-app", app_uuid, attempt);
        let exists: i64 = sqlx::query_scalar("SELECT COUNT(1) FROM plus_app WHERE id = ?")
            .bind(id)
            .fetch_one(&mut **tx)
            .await
            .map_err(|error| store_error("failed to check app assigned id", error))?;
        if exists == 0 {
            return Ok(id);
        }
    }
    Err(DomainError::conflict(
        "failed to allocate assigned id for admin-app",
    ))
}

async fn next_category_assigned_id(
    tx: &mut Transaction<'_, Sqlite>,
    category_uuid: &str,
) -> DomainResult<i64> {
    for attempt in 0..MAX_ASSIGNED_ID_ATTEMPTS {
        let id = assigned_entity_id("admin-app-category", category_uuid, attempt);
        let exists: i64 = sqlx::query_scalar("SELECT COUNT(1) FROM plus_category WHERE id = ?")
            .bind(id)
            .fetch_one(&mut **tx)
            .await
            .map_err(|error| store_error("failed to check app category assigned id", error))?;
        if exists == 0 {
            return Ok(id);
        }
    }
    Err(DomainError::conflict(
        "failed to allocate assigned id for admin-app-category",
    ))
}

async fn next_template_assigned_id(
    tx: &mut Transaction<'_, Sqlite>,
    template_uuid: &str,
) -> DomainResult<i64> {
    for attempt in 0..MAX_ASSIGNED_ID_ATTEMPTS {
        let id = assigned_entity_id("admin-app-template", template_uuid, attempt);
        let exists: i64 =
            sqlx::query_scalar("SELECT COUNT(1) FROM studio_app_template WHERE id = ?")
                .bind(id)
                .fetch_one(&mut **tx)
                .await
                .map_err(|error| store_error("failed to check app template assigned id", error))?;
        if exists == 0 {
            return Ok(id);
        }
    }
    Err(DomainError::conflict(
        "failed to allocate assigned id for admin-app-template",
    ))
}

fn assigned_entity_id(namespace: &str, entity_uuid: &str, attempt: u8) -> i64 {
    let mut hasher = Sha256::new();
    hasher.update(namespace.as_bytes());
    hasher.update([0]);
    hasher.update(entity_uuid.as_bytes());
    hasher.update([0]);
    hasher.update([attempt]);
    let digest = hasher.finalize();
    let mut bytes = [0_u8; 8];
    bytes.copy_from_slice(&digest[..8]);
    ASSIGNED_ID_FLOOR + (u64::from_be_bytes(bytes) % ASSIGNED_ID_RANGE) as i64
}

fn normalize_config(
    config: &mut serde_json::Value,
    app_key: Option<&str>,
    market_status: Option<&str>,
) -> DomainResult<()> {
    let serde_json::Value::Object(root) = config else {
        return Err(DomainError::new("app config must be a JSON object"));
    };
    if let Some(app_key) = app_key {
        let standard = root
            .entry("standard")
            .or_insert_with(|| serde_json::Value::Object(Default::default()));
        let serde_json::Value::Object(standard) = standard else {
            return Err(DomainError::new(
                "app config.standard must be a JSON object",
            ));
        };
        standard.insert(
            "appKey".to_owned(),
            serde_json::Value::String(app_key.to_owned()),
        );
    }
    if let Some(market_status) = market_status {
        let portal = root
            .entry("portal")
            .or_insert_with(|| serde_json::Value::Object(Default::default()));
        let serde_json::Value::Object(portal) = portal else {
            return Err(DomainError::new("app config.portal must be a JSON object"));
        };
        portal.insert(
            "marketStatus".to_owned(),
            serde_json::Value::String(market_status.to_owned()),
        );
    }
    Ok(())
}

fn app_from_row(row: sqlx::sqlite::SqliteRow) -> DomainResult<AdminAppItem> {
    let config = json_cell(&row, "config", "{}")?;
    let market_status = string_cell(&row, "market_status")
        .filter(|value| !value.trim().is_empty())
        .unwrap_or_else(|| "DRAFT".to_owned());
    Ok(AdminAppItem {
        id: row.try_get("id").map_err(row_error)?,
        uuid: row.try_get("uuid").map_err(row_error)?,
        tenant_id: row.try_get("tenant_id").map_err(row_error)?,
        organization_id: row.try_get("organization_id").map_err(row_error)?,
        user_id: row.try_get("user_id").ok().flatten(),
        name: row.try_get("name").map_err(row_error)?,
        description: row.try_get("description").ok().flatten(),
        version: row.try_get("version").ok().flatten(),
        icon: json_cell(&row, "icon", "{}")?,
        icon_url: row.try_get("icon_url").ok().flatten(),
        resource_list: json_cell(&row, "resource_list", "{}")?,
        project_id: row.try_get("project_id").ok().flatten(),
        access_url: row.try_get("access_url").ok().flatten(),
        app_key: string_cell(&row, "app_key").filter(|value| !value.trim().is_empty()),
        status: status_label(integer_cell(&row, "status")),
        market_status,
        app_type: row.try_get("app_type").ok().flatten(),
        platforms: json_cell(&row, "platforms", "{}")?,
        install_platforms: json_cell(&row, "install_platforms", "{}")?,
        install_skill: json_cell(&row, "install_skill", "{}")?,
        install_config: json_cell(&row, "install_config", "{}")?,
        release_notes: json_cell(&row, "release_notes", "[]")?,
        package_name: row.try_get("package_name").ok().flatten(),
        bundle_id: row.try_get("bundle_id").ok().flatten(),
        store_url: row.try_get("store_url").ok().flatten(),
        download_url: row.try_get("download_url").ok().flatten(),
        created_at: row.try_get("created_at").unwrap_or_default(),
        updated_at: row.try_get("updated_at").unwrap_or_default(),
        config,
    })
}

fn category_from_row(row: sqlx::sqlite::SqliteRow) -> DomainResult<AdminAppCategoryItem> {
    Ok(AdminAppCategoryItem {
        id: row.try_get("id").map_err(row_error)?,
        uuid: row.try_get("uuid").map_err(row_error)?,
        tenant_id: row.try_get("tenant_id").map_err(row_error)?,
        organization_id: row.try_get("organization_id").map_err(row_error)?,
        name: row.try_get("name").map_err(row_error)?,
        description: row.try_get("description").ok().flatten(),
        code: row.try_get("code").ok().flatten(),
        icon: row.try_get("icon").ok().flatten(),
        sort_weight: integer_cell(&row, "sort_weight") as i32,
        parent_id: row.try_get("parent_id").ok().flatten(),
        path: row.try_get("path").ok().flatten(),
        visible: integer_cell(&row, "visible") != 0,
        status: integer_cell(&row, "status") as i32,
        category_type: integer_cell(&row, "category_type") as i32,
    })
}

fn template_from_row(row: sqlx::sqlite::SqliteRow) -> DomainResult<AdminAppTemplateItem> {
    Ok(AdminAppTemplateItem {
        id: row.try_get("id").map_err(row_error)?,
        uuid: row.try_get("uuid").map_err(row_error)?,
        tenant_id: row.try_get("tenant_id").map_err(row_error)?,
        organization_id: row.try_get("organization_id").map_err(row_error)?,
        template_no: row.try_get("template_no").map_err(row_error)?,
        template_code: row.try_get("template_code").map_err(row_error)?,
        template_name: row.try_get("template_name").map_err(row_error)?,
        description: row.try_get("description").ok().flatten(),
        category_id: row.try_get("category_id").ok().flatten(),
        category_code: row.try_get("category_code").ok().flatten(),
        template_type: row.try_get("template_type").ok().flatten(),
        runtime: row.try_get("runtime").ok().flatten(),
        framework: row.try_get("framework").ok().flatten(),
        language: row.try_get("language").ok().flatten(),
        icon_url: row.try_get("icon_url").ok().flatten(),
        cover_url: row.try_get("cover_url").ok().flatten(),
        visibility: template_visibility_label(integer_cell(&row, "visibility")),
        publish_status: template_publish_status_label(integer_cell(&row, "publish_status")),
        featured: integer_cell(&row, "featured") != 0,
        sort_weight: integer_cell(&row, "sort_weight") as i32,
        source_app_id: row.try_get("source_app_id").ok().flatten(),
        git_repo_url: row.try_get("git_repo_url").ok().flatten(),
        git_ref: row.try_get("git_ref").ok().flatten(),
        git_sub_path: row.try_get("git_sub_path").ok().flatten(),
        current_version_id: row.try_get("current_version_id").ok().flatten(),
        app_config_schema: json_cell(&row, "app_config_schema", "{}")?,
        default_app_config: json_cell(&row, "default_app_config", "{}")?,
        variable_schema: json_cell(&row, "variable_schema", "{}")?,
        dependency_manifest: json_cell(&row, "dependency_manifest", "[]")?,
        capability_manifest: json_cell(&row, "capability_manifest", "[]")?,
        created_at: row.try_get("created_at").unwrap_or_default(),
        updated_at: row.try_get("updated_at").unwrap_or_default(),
    })
}

fn json_cell(
    row: &sqlx::sqlite::SqliteRow,
    column: &str,
    fallback: &str,
) -> DomainResult<serde_json::Value> {
    let value = row
        .try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .unwrap_or_else(|| fallback.to_owned());
    if value.trim().is_empty() {
        return serde_json::from_str(fallback)
            .map_err(|error| DomainError::new(format!("invalid fallback json: {error}")));
    }
    serde_json::from_str(value.as_str())
        .map_err(|error| DomainError::new(format!("invalid app json column {column}: {error}")))
}

fn string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(column).ok().flatten()
}

fn integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> i64 {
    row.try_get::<i64, _>(column)
        .ok()
        .or_else(|| row.try_get::<i32, _>(column).ok().map(i64::from))
        .unwrap_or(0)
}

fn app_status_code(value: &str) -> DomainResult<i32> {
    match value.trim() {
        "ACTIVE" => Ok(1),
        "INACTIVE" => Ok(0),
        _ => Err(DomainError::new("app status must be ACTIVE or INACTIVE")),
    }
}

fn app_market_status(value: &str) -> DomainResult<&'static str> {
    match value.trim() {
        "DRAFT" => Ok("DRAFT"),
        "PUBLISHED" => Ok("PUBLISHED"),
        "OFFLINE" => Ok("OFFLINE"),
        _ => Err(DomainError::new(
            "app marketStatus must be DRAFT, PUBLISHED, or OFFLINE",
        )),
    }
}

fn status_label(value: i64) -> String {
    if value == 1 {
        "ACTIVE".to_owned()
    } else {
        "INACTIVE".to_owned()
    }
}

fn status_action(command: &SetAdminAppStatusCommand) -> &'static str {
    match (command.status.as_deref(), command.market_status.as_deref()) {
        (_, Some("PUBLISHED")) => "publish_app",
        (_, Some("OFFLINE")) => "offline_app",
        (Some("ACTIVE"), _) => "enable_app",
        (Some("INACTIVE"), _) => "disable_app",
        _ => "update_app_status",
    }
}

fn template_visibility_code(value: &str) -> DomainResult<i32> {
    match value.trim() {
        "PRIVATE" => Ok(0),
        "TENANT" => Ok(1),
        "PUBLIC" => Ok(2),
        _ => Err(DomainError::new(
            "app template visibility must be PRIVATE, TENANT, or PUBLIC",
        )),
    }
}

fn template_visibility_label(value: i64) -> String {
    match value {
        0 => "PRIVATE".to_owned(),
        2 => "PUBLIC".to_owned(),
        _ => "TENANT".to_owned(),
    }
}

fn template_publish_status_code(value: &str) -> DomainResult<i32> {
    match value.trim() {
        "DRAFT" => Ok(1),
        "PUBLISHED" => Ok(2),
        "OFFLINE" => Ok(3),
        _ => Err(DomainError::new(
            "app template publishStatus must be DRAFT, PUBLISHED, or OFFLINE",
        )),
    }
}

fn template_publish_status_label(value: i64) -> String {
    match value {
        2 => "PUBLISHED".to_owned(),
        3 => "OFFLINE".to_owned(),
        _ => "DRAFT".to_owned(),
    }
}

fn template_publish_status_action(
    command: &SetAdminAppTemplatePublishStatusCommand,
) -> &'static str {
    match command.publish_status.as_str() {
        "PUBLISHED" => "publish_app_template",
        "OFFLINE" => "offline_app_template",
        _ => "update_app_template_publish_status",
    }
}

fn row_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    if let sqlx::Error::Database(database_error) = &error {
        if database_error.is_unique_violation() {
            return DomainError::conflict(format!("{context}: app record already exists"));
        }
    }
    DomainError::new(format!("{context}: {error}"))
}
