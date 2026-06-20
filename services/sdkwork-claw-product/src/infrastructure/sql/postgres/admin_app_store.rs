use sqlx::{PgPool, Postgres, Row, Transaction};

use crate::domain::{DomainError, DomainResult};
use crate::infrastructure::sql::runtime_id::next_admin_app_id;
use crate::infrastructure::sql::sql_admin_product_center::{
    media_resource_locator, media_resource_object_blob_id, media_resource_stable_id,
};
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
const APP_STORE_CATEGORY_SCOPE: &str = "app_store";
const APP_STORE_CATEGORY_GROUP: &str = "app-store";
const MAX_RUNTIME_ID_ATTEMPTS: u8 = 16;
const DEFAULT_APPSTORE_PUBLISHER_ID: &str = "appstore-publisher-default-20";
const DEFAULT_APPSTORE_LOCALE: &str = "en-US";

fn canonical_appstore_category_id(category_id: i64) -> String {
    format!("appstore-category-{category_id}")
}

fn canonical_appstore_category_localization_id(category_id: i64) -> String {
    format!("appstore-category-loc-{category_id}-en-us")
}

fn parse_canonical_appstore_category_id(canonical_id: &str) -> Option<i64> {
    canonical_id
        .strip_prefix("appstore-category-")
        .and_then(|suffix| suffix.parse().ok())
}

fn optional_canonical_parent_category_id(parent_id: Option<i64>) -> Option<String> {
    parent_id.map(canonical_appstore_category_id)
}

fn parse_optional_canonical_parent_category_id(parent_canonical_id: Option<String>) -> Option<i64> {
    parent_canonical_id
        .as_deref()
        .and_then(parse_canonical_appstore_category_id)
}

fn category_status_to_appstore(status: i32) -> &'static str {
    if status >= 1 {
        "active"
    } else {
        "inactive"
    }
}

fn category_status_from_appstore(status: &str) -> i32 {
    match status {
        "active" => 1,
        "inactive" => 0,
        "retired" => -1,
        _ => 0,
    }
}

fn tenant_id_to_appstore(tenant_id: i64) -> String {
    tenant_id.to_string()
}

fn icon_from_media_resource_id(icon_media_resource_id: Option<String>) -> Option<serde_json::Value> {
    icon_media_resource_id.filter(|value| !value.trim().is_empty()).map(|value| {
        serde_json::json!({
            "kind": "image",
            "source": "media_resource",
            "id": value,
        })
    })
}

const APPSTORE_APP_SELECT: &str = r#"
    CAST(COALESCE(NULLIF(plus_app_id, ''), '0') AS BIGINT) AS id,
    legacy_uuid AS uuid,
    CAST(tenant_id AS BIGINT) AS tenant_id,
    CAST(organization_id AS BIGINT) AS organization_id,
    CAST(owner_user_id AS BIGINT) AS user_id,
    display_name AS name,
    description,
    latest_released_version AS version,
    icon::text AS icon,
    icon_resource_snapshot::text AS icon_resource_snapshot,
    resource_list::text AS resource_list,
    CAST(project_id AS BIGINT) AS project_id,
    access_url,
    config::text AS config,
    config -> 'standard' ->> 'appKey' AS app_key,
    COALESCE(runtime_status, 1) AS status,
    COALESCE(
        NULLIF(config -> 'portal' ->> 'marketStatus', ''),
        NULLIF(config ->> 'marketStatus', ''),
        'DRAFT'
    ) AS market_status,
    app_type,
    platforms::text AS platforms,
    install_platforms::text AS install_platforms,
    install_skill::text AS install_skill,
    install_config::text AS install_config,
    release_notes::text AS release_notes,
    package_name,
    bundle_id,
    store_url,
    artifact_resource_snapshot::text AS artifact_resource_snapshot,
    created_at::text AS created_at,
    updated_at::text AS updated_at
"#;

const APPSTORE_APP_SCOPE: &str = r#"
    (
        (
            CAST(tenant_id AS BIGINT) = $1
            AND (
                CAST(organization_id AS BIGINT) = $2
                OR ($2 > 0 AND CAST(organization_id AS BIGINT) = 0)
            )
        )
        OR (CAST(tenant_id AS BIGINT) = $3 AND CAST(organization_id AS BIGINT) = 0)
    )
"#;

#[derive(Debug, Clone)]
pub struct PostgresAdminAppStore {
    pool: PgPool,
}

impl PostgresAdminAppStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl AdminAppStore for PostgresAdminAppStore {
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
    pool: &PgPool,
    query: ListAdminAppCategoriesQuery,
) -> DomainResult<Vec<AdminAppCategoryItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            cat.id AS canonical_category_id,
            loc.id AS uuid,
            CASE
                WHEN cat.tenant_id = $5 THEN $3
                ELSE CAST(cat.tenant_id AS BIGINT)
            END AS tenant_id,
            CASE
                WHEN cat.tenant_id = $5 THEN $4
                ELSE $2
            END AS organization_id,
            loc.display_name AS name,
            loc.description,
            cat.category_code AS code,
            cat.icon_media_resource_id,
            cat.sort_order AS sort_weight,
            cat.parent_category_id AS parent_canonical_id,
            COALESCE('/app-store/' || cat.category_code, '') AS path,
            CASE WHEN cat.category_status = 'active' THEN true ELSE false END AS visible,
            CASE
                WHEN cat.category_status = 'active' THEN 1
                WHEN cat.category_status = 'inactive' THEN 0
                ELSE -1
            END AS status,
            $6 AS category_type
        FROM appstore_category cat
        INNER JOIN appstore_category_localization loc
            ON loc.category_id = cat.id
           AND loc.tenant_id = cat.tenant_id
           AND loc.locale = $7
        WHERE (
              cat.tenant_id = CAST($1 AS TEXT)
              OR cat.tenant_id = $5
          )
          AND cat.category_status <> 'retired'
        ORDER BY
            CASE
                WHEN cat.tenant_id = CAST($1 AS TEXT) THEN 0
                WHEN cat.tenant_id = $5 THEN 1
                ELSE 2
            END,
            COALESCE(cat.sort_order, 0) ASC,
            cat.id ASC
        LIMIT 500
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(PUBLIC_APP_STORE_TENANT_ID)
    .bind(PUBLIC_APP_STORE_ORGANIZATION_ID)
    .bind(PUBLIC_APP_STORE_TENANT_ID.to_string())
    .bind(APP_STORE_CATEGORY_SCOPE)
    .bind(DEFAULT_APPSTORE_LOCALE)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list app categories", error))?;
    rows.into_iter().map(category_from_row).collect()
}

async fn list_apps(pool: &PgPool, query: ListAdminAppsQuery) -> DomainResult<AdminAppPage> {
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
        FROM appstore_app
        WHERE (
              (
                  CAST(tenant_id AS BIGINT) = $1
                  AND (
                      CAST(organization_id AS BIGINT) = $2
                      OR ($2 > 0 AND CAST(organization_id AS BIGINT) = 0)
                  )
              )
              OR (CAST(tenant_id AS BIGINT) = $3 AND CAST(organization_id AS BIGINT) = 0)
          )
          AND ($4::text IS NULL OR display_name ILIKE $5 ESCAPE '\' OR COALESCE(description, '') ILIKE $6 ESCAPE '\' OR COALESCE(config -> 'standard' ->> 'appKey', '') ILIKE $7 ESCAPE '\')
          AND ($8::integer IS NULL OR COALESCE(runtime_status, 1) = $9)
          AND ($10::text IS NULL OR COALESCE(NULLIF(config -> 'portal' ->> 'marketStatus', ''), NULLIF(config ->> 'marketStatus', ''), 'DRAFT') = $11)
          AND ($12::text IS NULL OR app_type = $13)
          AND (
              $14::text IS NULL
              OR lower(COALESCE(
                  NULLIF(config -> 'portal' ->> 'category', ''),
                  NULLIF(config ->> 'category', ''),
                  NULLIF(install_config -> 'portal' ->> 'category', ''),
                  replace(replace(COALESCE(app_type::text, ''), 'APP_', ''), '_', ' ')
              )) = lower($15)
              OR ($16::text IS NOT NULL AND lower(COALESCE(
                  NULLIF(config -> 'portal' ->> 'category', ''),
                  NULLIF(config ->> 'category', ''),
                  NULLIF(install_config -> 'portal' ->> 'category', ''),
                  replace(replace(COALESCE(app_type::text, ''), 'APP_', ''), '_', ' ')
              )) = lower($17))
          )
        "#,
    )
    .bind(query.subject.tenant_id)
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
        &format!(
            r#"
        SELECT
            {APPSTORE_APP_SELECT}
        FROM appstore_app
        WHERE (
              (
                  CAST(tenant_id AS BIGINT) = $1
                  AND (
                      CAST(organization_id AS BIGINT) = $2
                      OR ($2 > 0 AND CAST(organization_id AS BIGINT) = 0)
                  )
              )
              OR (CAST(tenant_id AS BIGINT) = $3 AND CAST(organization_id AS BIGINT) = 0)
          )
          AND ($4::text IS NULL OR display_name ILIKE $5 ESCAPE '\' OR COALESCE(description, '') ILIKE $6 ESCAPE '\' OR COALESCE(config -> 'standard' ->> 'appKey', '') ILIKE $7 ESCAPE '\')
          AND ($8::integer IS NULL OR COALESCE(runtime_status, 1) = $9)
          AND ($10::text IS NULL OR COALESCE(NULLIF(config -> 'portal' ->> 'marketStatus', ''), NULLIF(config ->> 'marketStatus', ''), 'DRAFT') = $11)
          AND ($12::text IS NULL OR app_type = $13)
          AND (
              $14::text IS NULL
              OR lower(COALESCE(
                  NULLIF(config -> 'portal' ->> 'category', ''),
                  NULLIF(config ->> 'category', ''),
                  NULLIF(install_config -> 'portal' ->> 'category', ''),
                  replace(replace(COALESCE(app_type::text, ''), 'APP_', ''), '_', ' ')
              )) = lower($15)
              OR ($16::text IS NOT NULL AND lower(COALESCE(
                  NULLIF(config -> 'portal' ->> 'category', ''),
                  NULLIF(config ->> 'category', ''),
                  NULLIF(install_config -> 'portal' ->> 'category', ''),
                  replace(replace(COALESCE(app_type::text, ''), 'APP_', ''), '_', ' ')
              )) = lower($17))
          )
        ORDER BY
            CASE
                WHEN CAST(tenant_id AS BIGINT) = $1 AND CAST(organization_id AS BIGINT) = $2 THEN 0
                WHEN CAST(tenant_id AS BIGINT) = $1 AND CAST(organization_id AS BIGINT) = 0 THEN 1
                WHEN CAST(tenant_id AS BIGINT) = $3 AND CAST(organization_id AS BIGINT) = 0 THEN 2
                ELSE 3
            END,
            COALESCE(updated_at, created_at) DESC NULLS LAST,
            CAST(COALESCE(NULLIF(plus_app_id, ''), '0') AS BIGINT) DESC
        LIMIT $18 OFFSET $19
        "#
        )
    )
    .bind(query.subject.tenant_id)
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
    pool: &PgPool,
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
        FROM appstore_app_template
        WHERE (
              (
                  tenant_id = $1
                  AND (
                      organization_id = $2
                      OR ($2 > 0 AND organization_id = 0)
                  )
              )
              OR (tenant_id = $3 AND organization_id = 0)
          )
          AND COALESCE(status, 1) >= 0
          AND ($4::text IS NULL OR template_name ILIKE $5 ESCAPE '\' OR template_code ILIKE $6 ESCAPE '\' OR COALESCE(description, '') ILIKE $7 ESCAPE '\')
          AND ($8::integer IS NULL OR COALESCE(publish_status, 1) = $9)
          AND ($10::text IS NULL OR template_type = $11)
          AND ($12::text IS NULL OR runtime = $13)
          AND ($14::bigint IS NULL OR category_id = $15)
        "#,
    )
    .bind(query.subject.tenant_id)
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
            COALESCE(icon_resource_snapshot::text, '') AS icon_resource_snapshot,
            COALESCE(cover_resource_snapshot::text, '') AS cover_resource_snapshot,
            COALESCE(visibility, 1) AS visibility,
            COALESCE(publish_status, 1) AS publish_status,
            COALESCE(featured, false) AS featured, COALESCE(sort_weight, 0) AS sort_weight,
            source_app_id, git_repo_url, git_ref, git_sub_path, current_version_id,
            COALESCE(app_config_schema::text, '{}') AS app_config_schema,
            COALESCE(default_app_config::text, '{}') AS default_app_config,
            COALESCE(variable_schema::text, '{}') AS variable_schema,
            COALESCE(dependency_manifest::text, '[]') AS dependency_manifest,
            COALESCE(capability_manifest::text, '[]') AS capability_manifest,
            CAST(created_at AS TEXT) AS created_at,
            CAST(updated_at AS TEXT) AS updated_at
        FROM appstore_app_template
        WHERE (
              (
                  tenant_id = $1
                  AND (
                      organization_id = $2
                      OR ($2 > 0 AND organization_id = 0)
                  )
              )
              OR (tenant_id = $3 AND organization_id = 0)
          )
          AND COALESCE(status, 1) >= 0
          AND ($4::text IS NULL OR template_name ILIKE $5 ESCAPE '\' OR template_code ILIKE $6 ESCAPE '\' OR COALESCE(description, '') ILIKE $7 ESCAPE '\')
          AND ($8::integer IS NULL OR COALESCE(publish_status, 1) = $9)
          AND ($10::text IS NULL OR template_type = $11)
          AND ($12::text IS NULL OR runtime = $13)
          AND ($14::bigint IS NULL OR category_id = $15)
        ORDER BY
            CASE
                WHEN tenant_id = $1 AND organization_id = $2 THEN 0
                WHEN tenant_id = $1 AND organization_id = 0 THEN 1
                WHEN tenant_id = $3 AND organization_id = 0 THEN 2
                ELSE 3
            END,
            COALESCE(featured, false) DESC,
            COALESCE(sort_weight, 0) ASC,
            COALESCE(updated_at, created_at) DESC NULLS LAST,
            id DESC
        LIMIT $16 OFFSET $17
        "#,
    )
    .bind(query.subject.tenant_id)
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
    pool: &PgPool,
    category_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<(String, Option<String>)>> {
    let canonical_id = canonical_appstore_category_id(category_id);
    let row = sqlx::query(
        r#"
        SELECT loc.display_name AS name, cat.category_code AS code
        FROM appstore_category cat
        INNER JOIN appstore_category_localization loc
            ON loc.category_id = cat.id
           AND loc.tenant_id = cat.tenant_id
           AND loc.locale = $6
        WHERE cat.id = $1
          AND (
              cat.tenant_id = CAST($2 AS TEXT)
              OR cat.tenant_id = $5
          )
          AND cat.category_status <> 'retired'
        ORDER BY
            CASE
                WHEN cat.tenant_id = CAST($2 AS TEXT) THEN 0
                WHEN cat.tenant_id = $5 THEN 1
                ELSE 2
            END
        LIMIT 1
        "#,
    )
    .bind(canonical_id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(PUBLIC_APP_STORE_TENANT_ID)
    .bind(PUBLIC_APP_STORE_TENANT_ID.to_string())
    .bind(DEFAULT_APPSTORE_LOCALE)
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
    pool: &PgPool,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminAppItem>> {
    let row = sqlx::query(
        &format!(
            r#"
        SELECT
            {APPSTORE_APP_SELECT}
        FROM appstore_app
        WHERE CAST(COALESCE(NULLIF(plus_app_id, ''), '0') AS BIGINT) = $1
          AND (
              (
                  CAST(tenant_id AS BIGINT) = $2
                  AND (
                      CAST(organization_id AS BIGINT) = $3
                      OR ($3 > 0 AND CAST(organization_id AS BIGINT) = 0)
                  )
              )
              OR (CAST(tenant_id AS BIGINT) = $4 AND CAST(organization_id AS BIGINT) = 0)
          )
        ORDER BY
            CASE
                WHEN CAST(tenant_id AS BIGINT) = $2 AND CAST(organization_id AS BIGINT) = $3 THEN 0
                WHEN CAST(tenant_id AS BIGINT) = $2 AND CAST(organization_id AS BIGINT) = 0 THEN 1
                WHEN CAST(tenant_id AS BIGINT) = $4 AND CAST(organization_id AS BIGINT) = 0 THEN 2
                ELSE 3
            END,
            CAST(COALESCE(NULLIF(plus_app_id, ''), '0') AS BIGINT) DESC
        LIMIT 1
        "#
        ),
    )
    .bind(id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(PUBLIC_APP_STORE_TENANT_ID)
    .fetch_optional(pool)
    .await
    .map_err(|error| store_error("failed to load app", error))?;
    row.map(app_from_row).transpose()
}

async fn load_app_by_id_tx(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminAppItem>> {
    let row = sqlx::query(
        &format!(
            r#"
        SELECT
            {APPSTORE_APP_SELECT}
        FROM appstore_app
        WHERE CAST(COALESCE(NULLIF(plus_app_id, ''), '0') AS BIGINT) = $1
          AND CAST(tenant_id AS BIGINT) = $2
          AND CAST(organization_id AS BIGINT) = $3
        LIMIT 1
        "#
        ),
    )
    .bind(id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load app", error))?;
    row.map(app_from_row).transpose()
}

async fn load_template_by_id(
    pool: &PgPool,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminAppTemplateItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            id, uuid, tenant_id, organization_id, template_no, template_code, template_name,
            description, category_id, category_code, template_type, runtime, framework, language,
            COALESCE(icon_resource_snapshot::text, '') AS icon_resource_snapshot,
            COALESCE(cover_resource_snapshot::text, '') AS cover_resource_snapshot,
            COALESCE(visibility, 1) AS visibility,
            COALESCE(publish_status, 1) AS publish_status,
            COALESCE(featured, false) AS featured, COALESCE(sort_weight, 0) AS sort_weight,
            source_app_id, git_repo_url, git_ref, git_sub_path, current_version_id,
            COALESCE(app_config_schema::text, '{}') AS app_config_schema,
            COALESCE(default_app_config::text, '{}') AS default_app_config,
            COALESCE(variable_schema::text, '{}') AS variable_schema,
            COALESCE(dependency_manifest::text, '[]') AS dependency_manifest,
            COALESCE(capability_manifest::text, '[]') AS capability_manifest,
            CAST(created_at AS TEXT) AS created_at,
            CAST(updated_at AS TEXT) AS updated_at
        FROM appstore_app_template
        WHERE id = $1
          AND (
              (
                  tenant_id = $2
                  AND (
                      organization_id = $3
                      OR ($3 > 0 AND organization_id = 0)
                  )
              )
              OR (tenant_id = $4 AND organization_id = 0)
          )
          AND COALESCE(status, 1) >= 0
        ORDER BY
            CASE
                WHEN tenant_id = $2 AND organization_id = $3 THEN 0
                WHEN tenant_id = $2 AND organization_id = 0 THEN 1
                WHEN tenant_id = $4 AND organization_id = 0 THEN 2
                ELSE 3
            END,
            id DESC
        LIMIT 1
        "#,
    )
    .bind(id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(PUBLIC_APP_STORE_TENANT_ID)
    .fetch_optional(pool)
    .await
    .map_err(|error| store_error("failed to load app template", error))?;
    row.map(template_from_row).transpose()
}

async fn load_template_by_id_tx(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminAppTemplateItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            id, uuid, tenant_id, organization_id, template_no, template_code, template_name,
            description, category_id, category_code, template_type, runtime, framework, language,
            COALESCE(icon_resource_snapshot::text, '') AS icon_resource_snapshot,
            COALESCE(cover_resource_snapshot::text, '') AS cover_resource_snapshot,
            COALESCE(visibility, 1) AS visibility,
            COALESCE(publish_status, 1) AS publish_status,
            COALESCE(featured, false) AS featured, COALESCE(sort_weight, 0) AS sort_weight,
            source_app_id, git_repo_url, git_ref, git_sub_path, current_version_id,
            COALESCE(app_config_schema::text, '{}') AS app_config_schema,
            COALESCE(default_app_config::text, '{}') AS default_app_config,
            COALESCE(variable_schema::text, '{}') AS variable_schema,
            COALESCE(dependency_manifest::text, '[]') AS dependency_manifest,
            COALESCE(capability_manifest::text, '[]') AS capability_manifest,
            CAST(created_at AS TEXT) AS created_at,
            CAST(updated_at AS TEXT) AS updated_at
        FROM appstore_app_template
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
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
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAdminAppTemplateCommand,
) -> DomainResult<i64> {
    let id = next_template_assigned_id(tx, &command.template_uuid).await?;
    let visibility = template_visibility_code(&command.visibility)?;
    let publish_status = template_publish_status_code(&command.publish_status)?;
    let icon = command.icon.as_ref();
    let icon_media_resource_id = icon.map(media_resource_stable_id);
    let icon_object_blob_id = icon.and_then(media_resource_object_blob_id);
    let icon_resource_snapshot = icon.map(serde_json::Value::to_string);
    let cover = command.cover.as_ref();
    let cover_media_resource_id = cover.map(media_resource_stable_id);
    let cover_object_blob_id = cover.and_then(media_resource_object_blob_id);
    let cover_resource_snapshot = cover.map(serde_json::Value::to_string);
    sqlx::query(
        r#"
        INSERT INTO appstore_app_template
            (id, uuid, tenant_id, organization_id, data_scope, status, template_no, template_code,
             template_name, description, category_id, category_code, template_type, runtime,
             framework, language,
             icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot,
             cover_media_resource_id, cover_object_blob_id, cover_resource_snapshot,
             visibility, publish_status, featured,
             sort_weight, source_app_id, git_repo_url, git_ref, git_sub_path,
             app_config_schema, default_app_config, variable_schema,
             dependency_manifest, capability_manifest, created_at, updated_at)
        VALUES
            ($1, $2, $3, $4, 1, 1, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17::jsonb, $18, $19, $20::jsonb, $21, $22, $23, $24, $25, $26, $27, $28, $29::jsonb, $30::jsonb, $31::jsonb, $32::jsonb, $33::jsonb, $34::timestamptz, $35::timestamptz)
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
    .bind(icon_media_resource_id)
    .bind(icon_object_blob_id)
    .bind(icon_resource_snapshot.unwrap_or_default())
    .bind(cover_media_resource_id)
    .bind(cover_object_blob_id)
    .bind(cover_resource_snapshot)
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
    tx: &mut Transaction<'_, Postgres>,
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
    let icon_changed = command.icon.is_some();
    let icon = command
        .icon
        .clone()
        .unwrap_or_else(|| existing.icon.clone());
    let icon_media_resource_id = icon.as_ref().map(media_resource_stable_id);
    let icon_object_blob_id = icon.as_ref().and_then(media_resource_object_blob_id);
    let icon_resource_snapshot = icon.as_ref().map(serde_json::Value::to_string);
    let cover_changed = command.cover.is_some();
    let cover = command
        .cover
        .clone()
        .unwrap_or_else(|| existing.cover.clone());
    let cover_media_resource_id = cover.as_ref().map(media_resource_stable_id);
    let cover_object_blob_id = cover.as_ref().and_then(media_resource_object_blob_id);
    let cover_resource_snapshot = cover.as_ref().map(serde_json::Value::to_string);
    sqlx::query(
        r#"
        UPDATE appstore_app_template
        SET template_name = $1,
            description = $2,
            category_id = $3,
            category_code = $4,
            template_type = $5,
            runtime = $6,
            framework = $7,
            language = $8,
            icon_media_resource_id = CASE WHEN $9 THEN $10 ELSE icon_media_resource_id END,
            icon_object_blob_id = CASE WHEN $11 THEN $12 ELSE icon_object_blob_id END,
            icon_resource_snapshot = CASE WHEN $13 THEN $14::jsonb ELSE icon_resource_snapshot END,
            cover_media_resource_id = CASE WHEN $15 THEN $16 ELSE cover_media_resource_id END,
            cover_object_blob_id = CASE WHEN $17 THEN $18 ELSE cover_object_blob_id END,
            cover_resource_snapshot = CASE WHEN $19 THEN $20::jsonb ELSE cover_resource_snapshot END,
            visibility = $21,
            publish_status = $22,
            featured = $23,
            sort_weight = $24,
            source_app_id = $25,
            git_repo_url = $26,
            git_ref = $27,
            git_sub_path = $28,
            app_config_schema = $29::jsonb,
            default_app_config = $30::jsonb,
            variable_schema = $31::jsonb,
            dependency_manifest = $32::jsonb,
            capability_manifest = $33::jsonb,
            updated_at = $34::timestamptz,
            version = COALESCE(version, 0) + 1
        WHERE id = $35
          AND tenant_id = $36
          AND organization_id = $37
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
    .bind(icon_changed)
    .bind(icon_media_resource_id)
    .bind(icon_changed)
    .bind(icon_object_blob_id)
    .bind(icon_changed)
    .bind(icon_resource_snapshot.unwrap_or_default())
    .bind(cover_changed)
    .bind(cover_media_resource_id)
    .bind(cover_changed)
    .bind(cover_object_blob_id)
    .bind(cover_changed)
    .bind(cover_resource_snapshot)
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
    tx: &mut Transaction<'_, Postgres>,
    command: &SetAdminAppTemplatePublishStatusCommand,
) -> DomainResult<bool> {
    let publish_status = template_publish_status_code(&command.publish_status)?;
    let result = sqlx::query(
        r#"
        UPDATE appstore_app_template
        SET publish_status = $1,
            published_at = CASE WHEN $1 = 2 THEN $2::timestamptz ELSE published_at END,
            deprecated_at = CASE WHEN $1 = 3 THEN $2::timestamptz ELSE deprecated_at END,
            updated_at = $2::timestamptz,
            version = COALESCE(version, 0) + 1
        WHERE id = $3
          AND tenant_id = $4
          AND organization_id = $5
          AND COALESCE(status, 1) >= 0
        "#,
    )
    .bind(publish_status)
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
    tx: &mut Transaction<'_, Postgres>,
    command: &DeleteAdminAppTemplateCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE appstore_app_template
        SET status = -1,
            deleted_at = $1::timestamptz,
            deleted_by = $2,
            updated_at = $1::timestamptz,
            version = COALESCE(version, 0) + 1
        WHERE id = $3
          AND tenant_id = $4
          AND organization_id = $5
          AND COALESCE(status, 1) >= 0
        "#,
    )
    .bind(&command.requested_at)
    .bind(command.subject.operator_id)
    .bind(command.template_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete app template", error))?;
    if result.rows_affected() == 0 {
        return Ok(false);
    }
    delete_template_catalog_projection(tx, "ai_skill_action", command).await?;
    delete_template_catalog_projection(tx, "ai_skill_asset", command).await?;
    delete_template_catalog_projection(tx, "ai_skill_artifact", command).await?;
    Ok(true)
}

async fn insert_app(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAdminAppCommand,
) -> DomainResult<i64> {
    let id = next_assigned_id(tx, &command.app_uuid).await?;
    let mut config = command.config.clone();
    let status_code = app_status_code(&command.status)?;
    let market_status = app_market_status(&command.market_status)?;
    normalize_config(&mut config, command.app_key.as_deref(), Some(market_status))?;
    let (app_status, distribution_status, review_status) =
        appstore_lifecycle_fields(&command.status, market_status)?;
    let app_key = resolve_app_key(&config, command.app_key.as_deref());
    let icon_resource = media_resource_from_value(&command.icon, "image");
    let icon_media_id = icon_resource.as_ref().map(media_resource_stable_id);
    let icon_resource_snapshot = icon_resource.as_ref().map(serde_json::Value::to_string);
    let artifact_resource = command
        .artifact
        .as_ref()
        .and_then(|artifact| media_resource_from_value(artifact, "archive"));
    let artifact_resource_snapshot = artifact_resource.as_ref().map(serde_json::Value::to_string);
    let runtime_family = config
        .pointer("/standard/family")
        .and_then(|value| value.as_str())
        .unwrap_or("web");
    let runtime_framework = config
        .pointer("/standard/framework")
        .and_then(|value| value.as_str())
        .unwrap_or("unknown");
    let app_type = command
        .app_type
        .as_deref()
        .filter(|value| !value.trim().is_empty())
        .unwrap_or("application");
    sqlx::query(
        r#"
        INSERT INTO appstore_app
            (id, tenant_id, organization_id, publisher_id, app_no, app_key, plus_app_id, plus_app_key,
             app_slug, display_name, description, default_locale, app_type, runtime_family, runtime_framework,
             app_status, distribution_status, review_status, monetization_mode, official_website_url,
             icon_media_id, icon, icon_resource_snapshot, resource_list, access_url, config, runtime_status,
             install_skill, install_config, install_platforms, platforms, release_notes, package_name,
             bundle_id, store_url, artifact_resource_snapshot, legacy_uuid, owner_user_id, project_id,
             latest_released_version, manifest_snapshot_json, created_at, updated_at)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 'free', $19,
             $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43)
        "#,
    )
    .bind(canonical_appstore_app_id(id))
    .bind(command.subject.tenant_id.to_string())
    .bind(command.subject.organization_id.to_string())
    .bind(DEFAULT_APPSTORE_PUBLISHER_ID)
    .bind(&app_key)
    .bind(&app_key)
    .bind(id.to_string())
    .bind(&app_key)
    .bind(appstore_app_slug(&app_key))
    .bind(&command.name)
    .bind(command.description.as_deref())
    .bind(DEFAULT_APPSTORE_LOCALE)
    .bind(app_type)
    .bind(runtime_family)
    .bind(runtime_framework)
    .bind(app_status)
    .bind(distribution_status)
    .bind(review_status)
    .bind(command.access_url.as_deref())
    .bind(icon_media_id)
    .bind(command.icon.to_string())
    .bind(icon_resource_snapshot.unwrap_or_default())
    .bind(command.resource_list.to_string())
    .bind(command.access_url.as_deref())
    .bind(config.to_string())
    .bind(status_code)
    .bind(command.install_skill.to_string())
    .bind(command.install_config.to_string())
    .bind(command.install_platforms.to_string())
    .bind(command.platforms.to_string())
    .bind(command.release_notes.to_string())
    .bind(command.package_name.as_deref())
    .bind(command.bundle_id.as_deref())
    .bind(command.store_url.as_deref())
    .bind(artifact_resource_snapshot.unwrap_or_default())
    .bind(&command.app_uuid)
    .bind(command.user_id.map(|value| value.to_string()))
    .bind(command.project_id.map(|value| value.to_string()))
    .bind(command.version.as_deref())
    .bind("{}")
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create app", error))?;
    Ok(id)
}

async fn insert_category(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAdminAppCategoryCommand,
) -> DomainResult<i64> {
    let id = next_category_assigned_id(tx, &command.category_uuid).await?;
    let canonical_id = canonical_appstore_category_id(id);
    let tenant_str = tenant_id_to_appstore(command.subject.tenant_id);
    let icon = command.icon.as_ref();
    let icon_media_resource_id = icon.map(media_resource_stable_id);
    sqlx::query(
        r#"
        INSERT INTO appstore_category
            (id, tenant_id, category_code, parent_category_id, category_level, category_status,
             sort_order, icon_media_resource_id, created_at, updated_at)
        VALUES
            ($1, $2, $3, $4, 1, $5, $6, $7, $8, $9)
        "#,
    )
    .bind(&canonical_id)
    .bind(&tenant_str)
    .bind(command.code.as_deref().unwrap_or_default())
    .bind(optional_canonical_parent_category_id(command.parent_id))
    .bind(category_status_to_appstore(command.status))
    .bind(command.sort_weight)
    .bind(icon_media_resource_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create app category", error))?;
    sqlx::query(
        r#"
        INSERT INTO appstore_category_localization
            (id, tenant_id, category_id, locale, display_name, description, created_at, updated_at)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8)
        "#,
    )
    .bind(&command.category_uuid)
    .bind(&tenant_str)
    .bind(&canonical_id)
    .bind(DEFAULT_APPSTORE_LOCALE)
    .bind(&command.name)
    .bind(command.description.as_deref())
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create app category localization", error))?;
    Ok(id)
}

async fn load_category_by_id(
    tx: &mut Transaction<'_, Postgres>,
    category_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminAppCategoryItem>> {
    let canonical_id = canonical_appstore_category_id(category_id);
    let tenant_str = tenant_id_to_appstore(tenant_id);
    let row = sqlx::query(
        r#"
        SELECT
            cat.id AS canonical_category_id,
            loc.id AS uuid,
            CAST(cat.tenant_id AS BIGINT) AS tenant_id,
            $3 AS organization_id,
            loc.display_name AS name,
            loc.description,
            cat.category_code AS code,
            cat.icon_media_resource_id,
            cat.sort_order AS sort_weight,
            cat.parent_category_id AS parent_canonical_id,
            COALESCE('/app-store/' || cat.category_code, '') AS path,
            CASE WHEN cat.category_status = 'active' THEN true ELSE false END AS visible,
            CASE
                WHEN cat.category_status = 'active' THEN 1
                WHEN cat.category_status = 'inactive' THEN 0
                ELSE -1
            END AS status,
            $4 AS category_type
        FROM appstore_category cat
        INNER JOIN appstore_category_localization loc
            ON loc.category_id = cat.id
           AND loc.tenant_id = cat.tenant_id
           AND loc.locale = $5
        WHERE cat.id = $1
          AND cat.tenant_id = $2
        "#,
    )
    .bind(canonical_id)
    .bind(tenant_str)
    .bind(organization_id)
    .bind(APP_STORE_CATEGORY_SCOPE)
    .bind(DEFAULT_APPSTORE_LOCALE)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load app category", error))?;
    row.map(category_from_row).transpose()
}

async fn update_app(
    tx: &mut Transaction<'_, Postgres>,
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
    let next_icon = command
        .icon
        .clone()
        .unwrap_or_else(|| existing.icon.clone());
    let icon_resource = media_resource_from_value(&next_icon, "image");
    let icon_media_id = icon_resource.as_ref().map(media_resource_stable_id);
    let icon_resource_snapshot = icon_resource.as_ref().map(serde_json::Value::to_string);
    let artifact_resource = match &command.artifact {
        Some(Some(artifact)) => media_resource_from_value(artifact, "archive"),
        Some(None) => None,
        None => existing.artifact.clone(),
    };
    let artifact_resource_snapshot = artifact_resource.as_ref().map(serde_json::Value::to_string);
    sqlx::query(
        r#"
        UPDATE appstore_app
        SET owner_user_id = $1,
            display_name = $2,
            description = $3,
            latest_released_version = $4,
            icon = $5,
            icon_media_id = $6,
            icon_resource_snapshot = $7,
            resource_list = $8,
            project_id = $9,
            access_url = $10,
            config = $11,
            app_type = $12,
            platforms = $13,
            install_platforms = $14,
            install_skill = $15,
            install_config = $16,
            release_notes = $17,
            package_name = $18,
            bundle_id = $19,
            store_url = $20,
            artifact_resource_snapshot = $21,
            updated_at = $22,
            version = COALESCE(version, 0) + 1
        WHERE CAST(COALESCE(NULLIF(plus_app_id, ''), '0') AS BIGINT) = $23
          AND CAST(tenant_id AS BIGINT) = $24
          AND CAST(organization_id AS BIGINT) = $25
        "#,
    )
    .bind(
        command
            .user_id
            .unwrap_or(existing.user_id)
            .map(|value| value.to_string()),
    )
    .bind(command.name.as_deref().unwrap_or(existing.name.as_str()))
    .bind(command.description.clone().unwrap_or(existing.description))
    .bind(command.version.clone().unwrap_or(existing.version))
    .bind(next_icon.to_string())
    .bind(icon_media_id)
    .bind(icon_resource_snapshot.unwrap_or_default())
    .bind(
        command
            .resource_list
            .clone()
            .unwrap_or(existing.resource_list)
            .to_string(),
    )
    .bind(
        command
            .project_id
            .unwrap_or(existing.project_id)
            .map(|value| value.to_string()),
    )
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
    .bind(artifact_resource_snapshot.unwrap_or_default())
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
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateAdminAppCategoryCommand,
) -> DomainResult<bool> {
    if command.parent_id.flatten() == Some(command.category_id) {
        return Err(DomainError::new(
            "app category parent cannot reference itself",
        ));
    }
    let canonical_id = canonical_appstore_category_id(command.category_id);
    let tenant_str = tenant_id_to_appstore(command.subject.tenant_id);
    let category_updated = sqlx::query(
        r#"
        UPDATE appstore_category
        SET category_code = CASE WHEN $1 THEN $2 ELSE category_code END,
            icon_media_resource_id = CASE WHEN $3 THEN $4 ELSE icon_media_resource_id END,
            sort_order = CASE WHEN $5 THEN $6 ELSE sort_order END,
            parent_category_id = CASE WHEN $7 THEN $8 ELSE parent_category_id END,
            category_status = CASE WHEN $9 THEN $10 ELSE category_status END,
            updated_at = $11
        WHERE id = $12
          AND tenant_id = $13
        "#,
    )
    .bind(command.code.is_some())
    .bind(command.code.clone().flatten())
    .bind(command.icon.is_some())
    .bind(
        command
            .icon
            .as_ref()
            .and_then(|value| value.as_ref())
            .map(media_resource_stable_id),
    )
    .bind(command.sort_weight.is_some())
    .bind(command.sort_weight)
    .bind(command.parent_id.is_some())
    .bind(optional_canonical_parent_category_id(command.parent_id.flatten()))
    .bind(command.status.is_some())
    .bind(
        command
            .status
            .map(category_status_to_appstore)
            .unwrap_or("active"),
    )
    .bind(&command.requested_at)
    .bind(&canonical_id)
    .bind(&tenant_str)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update app category", error))?;
    let localization_updated = sqlx::query(
        r#"
        UPDATE appstore_category_localization
        SET display_name = CASE WHEN $1 THEN $2 ELSE display_name END,
            description = CASE WHEN $3 THEN $4 ELSE description END,
            updated_at = $5
        WHERE category_id = $6
          AND tenant_id = $7
          AND locale = $8
        "#,
    )
    .bind(command.name.is_some())
    .bind(command.name.as_deref())
    .bind(command.description.is_some())
    .bind(command.description.clone().flatten())
    .bind(&command.requested_at)
    .bind(&canonical_id)
    .bind(&tenant_str)
    .bind(DEFAULT_APPSTORE_LOCALE)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update app category localization", error))?;
    Ok(category_updated.rows_affected() > 0 || localization_updated.rows_affected() > 0)
}

async fn set_app_status(
    tx: &mut Transaction<'_, Postgres>,
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
    let market_status = command
        .market_status
        .as_deref()
        .map(app_market_status)
        .transpose()?
        .unwrap_or(existing.market_status.as_str());
    let (app_status, distribution_status, review_status) =
        appstore_lifecycle_fields(status, market_status)?;
    sqlx::query(
        r#"
        UPDATE appstore_app
        SET runtime_status = $1,
            config = $2,
            app_status = $3,
            distribution_status = $4,
            review_status = $5,
            updated_at = $6,
            version = COALESCE(version, 0) + 1
        WHERE CAST(COALESCE(NULLIF(plus_app_id, ''), '0') AS BIGINT) = $7
          AND CAST(tenant_id AS BIGINT) = $8
          AND CAST(organization_id AS BIGINT) = $9
        "#,
    )
    .bind(status_code)
    .bind(config.to_string())
    .bind(app_status)
    .bind(distribution_status)
    .bind(review_status)
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
    tx: &mut Transaction<'_, Postgres>,
    command: &DeleteAdminAppCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        DELETE FROM appstore_app
        WHERE CAST(COALESCE(NULLIF(plus_app_id, ''), '0') AS BIGINT) = $1
          AND CAST(tenant_id AS BIGINT) = $2
          AND CAST(organization_id AS BIGINT) = $3
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
    delete_catalog_projection(tx, "ai_skill_action", command).await?;
    delete_catalog_projection(tx, "ai_skill_asset", command).await?;
    delete_catalog_projection(tx, "ai_skill_artifact", command).await?;
    Ok(true)
}

async fn delete_category(
    tx: &mut Transaction<'_, Postgres>,
    command: &DeleteAdminAppCategoryCommand,
) -> DomainResult<bool> {
    ensure_category_delete_allowed(tx, command).await?;
    let canonical_id = canonical_appstore_category_id(command.category_id);
    let tenant_str = tenant_id_to_appstore(command.subject.tenant_id);
    let result = sqlx::query(
        r#"
        UPDATE appstore_category
        SET category_status = 'retired',
            updated_at = $1
        WHERE id = $2
          AND tenant_id = $3
        "#,
    )
    .bind(&command.requested_at)
    .bind(&canonical_id)
    .bind(&tenant_str)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete app category", error))?;
    Ok(result.rows_affected() > 0)
}

async fn ensure_category_delete_allowed(
    tx: &mut Transaction<'_, Postgres>,
    command: &DeleteAdminAppCategoryCommand,
) -> DomainResult<()> {
    let parent_canonical_id = canonical_appstore_category_id(command.category_id);
    let tenant_str = tenant_id_to_appstore(command.subject.tenant_id);
    let child_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM appstore_category
        WHERE tenant_id = $1
          AND parent_category_id = $2
          AND category_status <> 'retired'
        "#,
    )
    .bind(tenant_str)
    .bind(parent_canonical_id)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to validate child app categories", error))?;
    if child_count > 0 {
        return Err(DomainError::conflict("app category has child categories"));
    }
    Ok(())
}

async fn delete_catalog_projection(
    tx: &mut Transaction<'_, Postgres>,
    table_name: &'static str,
    command: &DeleteAdminAppCommand,
) -> DomainResult<()> {
    let sql = match table_name {
        "ai_skill_action" => {
            r#"
            DELETE FROM ai_skill_action
            WHERE tenant_id = $1
              AND organization_id = $2
              AND target_type = $3
              AND target_id = $4
            "#
        }
        "ai_skill_asset" => {
            r#"
            DELETE FROM ai_skill_asset
            WHERE tenant_id = $1
              AND organization_id = $2
              AND target_type = $3
              AND target_id = $4
            "#
        }
        "ai_skill_artifact" => {
            r#"
            DELETE FROM ai_skill_artifact
            WHERE tenant_id = $1
              AND organization_id = $2
              AND target_type = $3
              AND target_id = $4
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
    tx: &mut Transaction<'_, Postgres>,
    table_name: &'static str,
    command: &DeleteAdminAppTemplateCommand,
) -> DomainResult<()> {
    let sql = match table_name {
        "ai_skill_action" => {
            r#"
            DELETE FROM ai_skill_action
            WHERE tenant_id = $1
              AND organization_id = $2
              AND target_type = $3
              AND target_id = $4
            "#
        }
        "ai_skill_asset" => {
            r#"
            DELETE FROM ai_skill_asset
            WHERE tenant_id = $1
              AND organization_id = $2
              AND target_type = $3
              AND target_id = $4
            "#
        }
        "ai_skill_artifact" => {
            r#"
            DELETE FROM ai_skill_artifact
            WHERE tenant_id = $1
              AND organization_id = $2
              AND target_type = $3
              AND target_id = $4
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
    tx: &mut Transaction<'_, Postgres>,
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
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb)
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

async fn next_assigned_id(tx: &mut Transaction<'_, Postgres>, app_uuid: &str) -> DomainResult<i64> {
    for _ in 0..MAX_RUNTIME_ID_ATTEMPTS {
        let id = next_admin_app_id("admin-app")?;
        let exists: i64 = sqlx::query_scalar("SELECT COUNT(1) FROM appstore_app WHERE plus_app_id = $1")
            .bind(id.to_string())
            .fetch_one(&mut **tx)
            .await
            .map_err(|error| store_error("failed to check app runtime id", error))?;
        if exists == 0 {
            return Ok(id);
        }
    }
    Err(DomainError::conflict(format!(
        "failed to allocate snowflake id for admin-app: {app_uuid}"
    )))
}

async fn next_category_assigned_id(
    tx: &mut Transaction<'_, Postgres>,
    category_uuid: &str,
) -> DomainResult<i64> {
    for _ in 0..MAX_RUNTIME_ID_ATTEMPTS {
        let id = next_admin_app_id("admin-app-category")?;
        let canonical_id = canonical_appstore_category_id(id);
        let exists: i64 = sqlx::query_scalar(
            "SELECT COUNT(1) FROM appstore_category WHERE id = $1",
        )
        .bind(canonical_id)
        .fetch_one(&mut **tx)
        .await
        .map_err(|error| store_error("failed to check app category runtime id", error))?;
        if exists == 0 {
            return Ok(id);
        }
    }
    Err(DomainError::conflict(format!(
        "failed to allocate snowflake id for admin-app-category: {category_uuid}"
    )))
}

async fn next_template_assigned_id(
    tx: &mut Transaction<'_, Postgres>,
    template_uuid: &str,
) -> DomainResult<i64> {
    next_app_table_id(
        tx,
        "admin-app-template",
        template_uuid,
        "SELECT COUNT(1) FROM appstore_app_template WHERE id = $1",
        "failed to check app template runtime id",
    )
    .await
}

async fn next_app_table_id(
    tx: &mut Transaction<'_, Postgres>,
    context: &'static str,
    entity_uuid: &str,
    exists_sql: &'static str,
    exists_error: &'static str,
) -> DomainResult<i64> {
    for _ in 0..MAX_RUNTIME_ID_ATTEMPTS {
        let id = next_admin_app_id(context)?;
        let exists: i64 = sqlx::query_scalar(exists_sql)
            .bind(id)
            .fetch_one(&mut **tx)
            .await
            .map_err(|error| store_error(exists_error, error))?;
        if exists == 0 {
            return Ok(id);
        }
    }
    Err(DomainError::conflict(format!(
        "failed to allocate snowflake id for {context}: {entity_uuid}"
    )))
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

fn app_from_row(row: sqlx::postgres::PgRow) -> DomainResult<AdminAppItem> {
    let config = json_cell(&row, "config", "{}")?;
    let stored_icon = json_cell(&row, "icon", "{}")?;
    let icon = optional_media_resource_from_row(&row, "icon_resource_snapshot")
        .or_else(|| media_resource_from_value(&stored_icon, "image"))
        .unwrap_or_else(|| serde_json::json!({ "kind": "image", "source": "external_url" }));
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
        icon,
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
        artifact: optional_media_resource_from_row(&row, "artifact_resource_snapshot"),
        created_at: row.try_get("created_at").unwrap_or_default(),
        updated_at: row.try_get("updated_at").unwrap_or_default(),
        config,
    })
}

fn category_from_row(row: sqlx::postgres::PgRow) -> DomainResult<AdminAppCategoryItem> {
    let canonical_category_id = string_cell(&row, "canonical_category_id");
    Ok(AdminAppCategoryItem {
        id: canonical_category_id
            .as_deref()
            .and_then(parse_canonical_appstore_category_id)
            .unwrap_or_else(|| integer_cell(&row, "tenant_id")),
        uuid: row.try_get("uuid").map_err(row_error)?,
        tenant_id: row.try_get("tenant_id").map_err(row_error)?,
        organization_id: row.try_get("organization_id").map_err(row_error)?,
        name: row.try_get("name").map_err(row_error)?,
        description: row.try_get("description").ok().flatten(),
        code: row.try_get("code").ok().flatten(),
        icon: icon_from_media_resource_id(
            row.try_get::<Option<String>, _>("icon_media_resource_id")
                .ok()
                .flatten(),
        ),
        sort_weight: integer_cell(&row, "sort_weight") as i32,
        parent_id: parse_optional_canonical_parent_category_id(
            row.try_get("parent_canonical_id").ok().flatten(),
        ),
        path: row.try_get("path").ok().flatten(),
        visible: bool_cell(&row, "visible"),
        status: integer_cell(&row, "status") as i32,
        category_type: category_type_to_api(
            string_cell(&row, "category_type").unwrap_or_default(),
        ),
    })
}

fn category_type_to_api(scope: String) -> i32 {
    match scope.as_str() {
        "app_store" => APP_STORE_CATEGORY_TYPE,
        _ => scope.parse().unwrap_or(0),
    }
}

fn template_from_row(row: sqlx::postgres::PgRow) -> DomainResult<AdminAppTemplateItem> {
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
        icon: optional_media_resource_from_row(&row, "icon_resource_snapshot"),
        cover: optional_media_resource_from_row(&row, "cover_resource_snapshot"),
        visibility: template_visibility_label(integer_cell(&row, "visibility")),
        publish_status: template_publish_status_label(integer_cell(&row, "publish_status")),
        featured: bool_cell(&row, "featured"),
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
    row: &sqlx::postgres::PgRow,
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

fn optional_media_resource_from_row(
    row: &sqlx::postgres::PgRow,
    column: &str,
) -> Option<serde_json::Value> {
    row.try_get::<Option<serde_json::Value>, _>(column)
        .ok()
        .flatten()
        .or_else(|| {
            row.try_get::<Option<String>, _>(column)
                .ok()
                .flatten()
                .filter(|value| !value.trim().is_empty())
                .and_then(|value| serde_json::from_str(value.as_str()).ok())
        })
}

fn media_resource_from_value(value: &serde_json::Value, kind: &str) -> Option<serde_json::Value> {
    let locator = media_resource_locator(value)?;
    let mut object = value.as_object().cloned().unwrap_or_default();
    object
        .entry("kind".to_owned())
        .or_insert_with(|| serde_json::Value::String(kind.to_owned()));
    object
        .entry("source".to_owned())
        .or_insert_with(|| serde_json::Value::String("external_url".to_owned()));
    if !object.contains_key("url") {
        object.insert("url".to_owned(), serde_json::Value::String(locator.clone()));
    }
    if !object.contains_key("publicUrl") {
        object.insert("publicUrl".to_owned(), serde_json::Value::String(locator));
    }
    Some(serde_json::Value::Object(object))
}

fn string_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(column).ok().flatten()
}

fn integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> i64 {
    row.try_get::<i64, _>(column)
        .ok()
        .or_else(|| row.try_get::<i32, _>(column).ok().map(i64::from))
        .unwrap_or(0)
}

fn bool_cell(row: &sqlx::postgres::PgRow, column: &str) -> bool {
    row.try_get::<Option<bool>, _>(column)
        .ok()
        .flatten()
        .or_else(|| row.try_get::<bool, _>(column).ok())
        .unwrap_or(false)
}

fn app_status_code(value: &str) -> DomainResult<i32> {
    match value.trim() {
        "ACTIVE" => Ok(1),
        "INACTIVE" => Ok(0),
        _ => Err(DomainError::new("app status must be ACTIVE or INACTIVE")),
    }
}

fn canonical_appstore_app_id(stable_id: i64) -> String {
    format!("appstore-app-{stable_id}")
}

fn appstore_app_slug(app_key: &str) -> String {
    app_key
        .chars()
        .map(|ch| {
            if ch.is_ascii_alphanumeric() {
                ch.to_ascii_lowercase()
            } else {
                '-'
            }
        })
        .collect::<String>()
        .split('-')
        .filter(|segment| !segment.is_empty())
        .collect::<Vec<_>>()
        .join("-")
}

fn resolve_app_key(config: &serde_json::Value, explicit: Option<&str>) -> String {
    explicit
        .filter(|value| !value.trim().is_empty())
        .map(str::to_owned)
        .or_else(|| {
            config
                .pointer("/standard/appKey")
                .and_then(|value| value.as_str())
                .map(str::to_owned)
        })
        .unwrap_or_else(|| "admin-app".to_owned())
}

fn appstore_lifecycle_fields(
    runtime_status: &str,
    market_status: &str,
) -> DomainResult<(&'static str, &'static str, &'static str)> {
    let _ = app_status_code(runtime_status)?;
    match app_market_status(market_status)? {
        "DRAFT" => Ok(("draft", "unlisted", "draft")),
        "PUBLISHED" => Ok(("published", "listed", "approved")),
        "OFFLINE" => Ok(("published", "unlisted", "approved")),
        _ => Err(DomainError::new(
            "app marketStatus must be DRAFT, PUBLISHED, or OFFLINE",
        )),
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
