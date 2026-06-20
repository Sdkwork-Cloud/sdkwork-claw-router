use sqlx::{PgPool, Postgres, Row, Transaction};

use crate::domain::{DomainError, DomainResult};
use crate::infrastructure::sql::runtime_id::next_admin_skill_id;
use crate::infrastructure::sql::sql_admin_product_center::{
    empty_media_resource, media_resource_object_blob_id, media_resource_stable_id,
};
use crate::ports::{
    AdminSkillArtifactItem, AdminSkillAssetItem, AdminSkillCategoryItem, AdminSkillCommandFuture,
    AdminSkillItem, AdminSkillPackageItem, AdminSkillStore, CreateAdminSkillArtifactCommand,
    CreateAdminSkillAssetCommand, CreateAdminSkillCategoryCommand, CreateAdminSkillCommand,
    CreateAdminSkillPackageCommand, DeleteAdminSkillArtifactCommand, DeleteAdminSkillAssetCommand,
    DeleteAdminSkillCategoryCommand, DeleteAdminSkillCommand, DeleteAdminSkillPackageCommand,
    ListAdminSkillArtifactsQuery, ListAdminSkillAssetsQuery, ListAdminSkillCategoriesQuery,
    ListAdminSkillPackagesQuery, ListAdminSkillsQuery, ReviewAdminSkillCommand,
    SetAdminSkillEnabledCommand, SetAdminSkillMarketStatusCommand,
    SetAdminSkillPackageEnabledCommand, UpdateAdminSkillArtifactCommand,
    UpdateAdminSkillAssetCommand, UpdateAdminSkillCategoryCommand, UpdateAdminSkillCommand,
    UpdateAdminSkillPackageCommand,
};

const SKILL_TARGET_TYPE: i32 = 35;
const CATEGORY_TYPE_SKILLS: i32 = 19;
const CATEGORY_TYPE_SKILLS_COLLECTION: i32 = 20;
const SKILL_CATEGORY_TYPE_MARKET: &str = "skill_market";
const SKILL_CATEGORY_TYPE_COLLECTION: &str = "skills_collection";

fn skill_category_type_label(value: i32) -> &'static str {
    match value {
        CATEGORY_TYPE_SKILLS_COLLECTION => SKILL_CATEGORY_TYPE_COLLECTION,
        _ => SKILL_CATEGORY_TYPE_MARKET,
    }
}

fn skill_category_type_code(value: &str) -> i32 {
    match value {
        SKILL_CATEGORY_TYPE_COLLECTION => CATEGORY_TYPE_SKILLS_COLLECTION,
        _ => CATEGORY_TYPE_SKILLS,
    }
}
const PUBLIC_SKILLS_TENANT_ID: i64 = 0;
const PUBLIC_SKILLS_ORGANIZATION_ID: i64 = 0;
const MAX_RUNTIME_ID_ATTEMPTS: u8 = 16;

#[derive(Debug, Clone)]
pub struct PostgresAdminSkillStore {
    pool: PgPool,
}

impl PostgresAdminSkillStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl AdminSkillStore for PostgresAdminSkillStore {
    fn list_categories<'a>(
        &'a self,
        query: ListAdminSkillCategoriesQuery,
    ) -> AdminSkillCommandFuture<'a, Vec<AdminSkillCategoryItem>> {
        Box::pin(async move { list_categories(&self.pool, query).await })
    }

    fn create_category<'a>(
        &'a self,
        command: CreateAdminSkillCategoryCommand,
    ) -> AdminSkillCommandFuture<'a, AdminSkillCategoryItem> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin skill category transaction", error)
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
                "create_skill_category",
                id,
                serde_json::json!({
                    "action": "create_skill_category",
                    "categoryId": id,
                    "name": &command.name,
                    "code": &command.code,
                    "type": command.category_type
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
            .ok_or_else(|| DomainError::new("created skill category could not be reloaded"))?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit skill category transaction", error)
            })?;
            Ok(item)
        })
    }

    fn update_category<'a>(
        &'a self,
        command: UpdateAdminSkillCategoryCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillCategoryItem>> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin skill category transaction", error)
            })?;
            ensure_category_exists(
                &mut tx,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.parent_id.flatten(),
            )
            .await?;
            let updated = update_category(&mut tx, &command).await?;
            if !updated {
                tx.commit().await.map_err(|error| {
                    store_error("failed to commit skill category transaction", error)
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
                "update_skill_category",
                command.category_id,
                serde_json::json!({
                    "action": "update_skill_category",
                    "categoryId": command.category_id,
                    "nameChanged": command.name.is_some(),
                    "codeChanged": command.code.is_some(),
                    "typeChanged": command.category_type.is_some()
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
            tx.commit().await.map_err(|error| {
                store_error("failed to commit skill category transaction", error)
            })?;
            Ok(item)
        })
    }

    fn delete_category<'a>(
        &'a self,
        command: DeleteAdminSkillCategoryCommand,
    ) -> AdminSkillCommandFuture<'a, bool> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin skill category transaction", error)
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
                    "delete_skill_category",
                    command.category_id,
                    serde_json::json!({
                        "action": "delete_skill_category",
                        "categoryId": command.category_id
                    }),
                )
                .await?;
            }
            tx.commit().await.map_err(|error| {
                store_error("failed to commit skill category transaction", error)
            })?;
            Ok(deleted)
        })
    }

    fn list_packages<'a>(
        &'a self,
        query: ListAdminSkillPackagesQuery,
    ) -> AdminSkillCommandFuture<'a, Vec<AdminSkillPackageItem>> {
        Box::pin(async move { list_packages(&self.pool, query).await })
    }

    fn create_package<'a>(
        &'a self,
        command: CreateAdminSkillPackageCommand,
    ) -> AdminSkillCommandFuture<'a, AdminSkillPackageItem> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin skill package transaction", error)
                })?;
            ensure_category_exists(
                &mut tx,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.category_id,
            )
            .await?;
            let id = insert_package(&mut tx, &command).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_skill_package",
                id,
                serde_json::json!({
                    "action": "create_skill_package",
                    "packageId": id,
                    "packageKey": &command.package_key,
                    "name": &command.name
                }),
            )
            .await?;
            let item = load_package_by_id(
                &mut tx,
                id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("created skill package could not be reloaded"))?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit skill package transaction", error)
            })?;
            Ok(item)
        })
    }

    fn update_package<'a>(
        &'a self,
        command: UpdateAdminSkillPackageCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillPackageItem>> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin skill package transaction", error)
                })?;
            ensure_category_exists(
                &mut tx,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.category_id.flatten(),
            )
            .await?;
            let updated = update_package(&mut tx, &command).await?;
            if !updated {
                tx.commit().await.map_err(|error| {
                    store_error("failed to commit skill package transaction", error)
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
                "update_skill_package",
                command.package_id,
                serde_json::json!({
                    "action": "update_skill_package",
                    "packageId": command.package_id,
                    "packageKeyChanged": command.package_key.is_some(),
                    "nameChanged": command.name.is_some()
                }),
            )
            .await?;
            let item = load_package_by_id(
                &mut tx,
                command.package_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit skill package transaction", error)
            })?;
            Ok(item)
        })
    }

    fn set_package_enabled<'a>(
        &'a self,
        command: SetAdminSkillPackageEnabledCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillPackageItem>> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin skill package transaction", error)
                })?;
            let updated = set_package_enabled(&mut tx, &command).await?;
            if !updated {
                tx.commit().await.map_err(|error| {
                    store_error("failed to commit skill package transaction", error)
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
                if command.enabled {
                    "enable_skill_package"
                } else {
                    "disable_skill_package"
                },
                command.package_id,
                serde_json::json!({
                    "action": if command.enabled { "enable_skill_package" } else { "disable_skill_package" },
                    "packageId": command.package_id,
                    "enabled": command.enabled
                }),
            )
            .await?;
            let item = load_package_by_id(
                &mut tx,
                command.package_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit skill package transaction", error)
            })?;
            Ok(item)
        })
    }

    fn delete_package<'a>(
        &'a self,
        command: DeleteAdminSkillPackageCommand,
    ) -> AdminSkillCommandFuture<'a, bool> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin skill package transaction", error)
                })?;
            let deleted = delete_package(&mut tx, &command).await?;
            if deleted {
                insert_audit_log(
                    &mut tx,
                    &command.audit_log_uuid,
                    &command.request_id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    command.subject.operator_id,
                    command.subject.operator_type,
                    "delete_skill_package",
                    command.package_id,
                    serde_json::json!({
                        "action": "delete_skill_package",
                        "packageId": command.package_id
                    }),
                )
                .await?;
            }
            tx.commit().await.map_err(|error| {
                store_error("failed to commit skill package transaction", error)
            })?;
            Ok(deleted)
        })
    }

    fn list_skills<'a>(
        &'a self,
        query: ListAdminSkillsQuery,
    ) -> AdminSkillCommandFuture<'a, Vec<AdminSkillItem>> {
        Box::pin(async move { list_skills(&self.pool, query).await })
    }

    fn create_skill<'a>(
        &'a self,
        command: CreateAdminSkillCommand,
    ) -> AdminSkillCommandFuture<'a, AdminSkillItem> {
        Box::pin(async move {
            let mut tx = self
                .pool
                .begin()
                .await
                .map_err(|error| store_error("failed to begin skill transaction", error))?;
            ensure_category_exists(
                &mut tx,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.category_id,
            )
            .await?;
            ensure_package_exists(
                &mut tx,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.package_id,
            )
            .await?;
            let id = insert_skill(&mut tx, &command).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_skill",
                id,
                serde_json::json!({
                    "action": "create_skill",
                    "skillId": id,
                    "skillKey": &command.skill_key,
                    "name": &command.name,
                    "marketStatus": &command.market_status,
                    "reviewStatus": &command.review_status,
                    "visibility": &command.visibility
                }),
            )
            .await?;
            let item = load_skill_by_id(
                &mut tx,
                id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("created skill could not be reloaded"))?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit skill transaction", error))?;
            Ok(item)
        })
    }

    fn update_skill<'a>(
        &'a self,
        command: UpdateAdminSkillCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillItem>> {
        Box::pin(async move {
            let mut tx = self
                .pool
                .begin()
                .await
                .map_err(|error| store_error("failed to begin skill transaction", error))?;
            ensure_category_exists(
                &mut tx,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.category_id.flatten(),
            )
            .await?;
            ensure_package_exists(
                &mut tx,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.package_id.flatten(),
            )
            .await?;
            let updated = update_skill(&mut tx, &command).await?;
            if !updated {
                tx.commit()
                    .await
                    .map_err(|error| store_error("failed to commit skill transaction", error))?;
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
                "update_skill",
                command.skill_id,
                serde_json::json!({
                    "action": "update_skill",
                    "skillId": command.skill_id,
                    "skillKeyChanged": command.skill_key.is_some(),
                    "nameChanged": command.name.is_some()
                }),
            )
            .await?;
            let item = load_skill_by_id(
                &mut tx,
                command.skill_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit skill transaction", error))?;
            Ok(item)
        })
    }

    fn set_skill_enabled<'a>(
        &'a self,
        command: SetAdminSkillEnabledCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillItem>> {
        Box::pin(async move {
            let mut tx = self
                .pool
                .begin()
                .await
                .map_err(|error| store_error("failed to begin skill transaction", error))?;
            let updated = set_skill_enabled(&mut tx, &command).await?;
            if !updated {
                tx.commit()
                    .await
                    .map_err(|error| store_error("failed to commit skill transaction", error))?;
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
                if command.enabled {
                    "enable_skill"
                } else {
                    "disable_skill"
                },
                command.skill_id,
                serde_json::json!({
                    "action": if command.enabled { "enable_skill" } else { "disable_skill" },
                    "skillId": command.skill_id,
                    "enabled": command.enabled
                }),
            )
            .await?;
            let item = load_skill_by_id(
                &mut tx,
                command.skill_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit skill transaction", error))?;
            Ok(item)
        })
    }

    fn set_market_status<'a>(
        &'a self,
        command: SetAdminSkillMarketStatusCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillItem>> {
        Box::pin(async move {
            let mut tx = self
                .pool
                .begin()
                .await
                .map_err(|error| store_error("failed to begin skill transaction", error))?;
            let updated = set_market_status(&mut tx, &command).await?;
            if !updated {
                tx.commit()
                    .await
                    .map_err(|error| store_error("failed to commit skill transaction", error))?;
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
                if command.publish {
                    "publish_skill"
                } else {
                    "offline_skill"
                },
                command.skill_id,
                serde_json::json!({
                    "action": if command.publish { "publish_skill" } else { "offline_skill" },
                    "skillId": command.skill_id,
                    "marketStatus": &command.market_status
                }),
            )
            .await?;
            let item = load_skill_by_id(
                &mut tx,
                command.skill_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit skill transaction", error))?;
            Ok(item)
        })
    }

    fn review_skill<'a>(
        &'a self,
        command: ReviewAdminSkillCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillItem>> {
        Box::pin(async move {
            let mut tx = self
                .pool
                .begin()
                .await
                .map_err(|error| store_error("failed to begin skill transaction", error))?;
            let updated = review_skill(&mut tx, &command).await?;
            if !updated {
                tx.commit()
                    .await
                    .map_err(|error| store_error("failed to commit skill transaction", error))?;
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
                "review_skill",
                command.skill_id,
                serde_json::json!({
                    "action": "review_skill",
                    "skillId": command.skill_id,
                    "reviewStatus": &command.review_status,
                    "hasComment": command.review_comment.is_some()
                }),
            )
            .await?;
            let item = load_skill_by_id(
                &mut tx,
                command.skill_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit skill transaction", error))?;
            Ok(item)
        })
    }

    fn delete_skill<'a>(
        &'a self,
        command: DeleteAdminSkillCommand,
    ) -> AdminSkillCommandFuture<'a, bool> {
        Box::pin(async move {
            let mut tx = self
                .pool
                .begin()
                .await
                .map_err(|error| store_error("failed to begin skill transaction", error))?;
            let deleted = delete_skill(&mut tx, &command).await?;
            if deleted {
                insert_audit_log(
                    &mut tx,
                    &command.audit_log_uuid,
                    &command.request_id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    command.subject.operator_id,
                    command.subject.operator_type,
                    "delete_skill",
                    command.skill_id,
                    serde_json::json!({
                        "action": "delete_skill",
                        "skillId": command.skill_id
                    }),
                )
                .await?;
            }
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit skill transaction", error))?;
            Ok(deleted)
        })
    }

    fn list_assets<'a>(
        &'a self,
        query: ListAdminSkillAssetsQuery,
    ) -> AdminSkillCommandFuture<'a, Vec<AdminSkillAssetItem>> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin skill asset transaction", error)
                })?;
            ensure_visible_skill_exists(
                &mut tx,
                query.subject.tenant_id,
                query.subject.organization_id,
                query.skill_id,
            )
            .await?;
            let items = list_assets(&mut tx, query).await?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit skill asset transaction", error))?;
            Ok(items)
        })
    }

    fn create_asset<'a>(
        &'a self,
        command: CreateAdminSkillAssetCommand,
    ) -> AdminSkillCommandFuture<'a, AdminSkillAssetItem> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin skill asset transaction", error)
                })?;
            ensure_skill_exists(
                &mut tx,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.skill_id,
            )
            .await?;
            ensure_skill_artifact_exists(
                &mut tx,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.skill_id,
                command.artifact_id,
            )
            .await?;
            let id = insert_asset(&mut tx, &command).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_skill_asset",
                command.skill_id,
                serde_json::json!({
                    "action": "create_skill_asset",
                    "skillId": command.skill_id,
                    "assetId": id,
                    "assetType": command.asset_type,
                    "asset": &command.asset
                }),
            )
            .await?;
            let item = load_asset_by_id(
                &mut tx,
                id,
                command.skill_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("created skill asset could not be reloaded"))?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit skill asset transaction", error))?;
            Ok(item)
        })
    }

    fn update_asset<'a>(
        &'a self,
        command: UpdateAdminSkillAssetCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillAssetItem>> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin skill asset transaction", error)
                })?;
            ensure_skill_exists(
                &mut tx,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.skill_id,
            )
            .await?;
            ensure_skill_artifact_exists(
                &mut tx,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.skill_id,
                command.artifact_id.flatten(),
            )
            .await?;
            let updated = update_asset(&mut tx, &command).await?;
            if !updated {
                tx.commit().await.map_err(|error| {
                    store_error("failed to commit skill asset transaction", error)
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
                "update_skill_asset",
                command.skill_id,
                serde_json::json!({
                    "action": "update_skill_asset",
                    "skillId": command.skill_id,
                    "assetId": command.asset_id
                }),
            )
            .await?;
            let item = load_asset_by_id(
                &mut tx,
                command.asset_id,
                command.skill_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit skill asset transaction", error))?;
            Ok(item)
        })
    }

    fn delete_asset<'a>(
        &'a self,
        command: DeleteAdminSkillAssetCommand,
    ) -> AdminSkillCommandFuture<'a, bool> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin skill asset transaction", error)
                })?;
            ensure_skill_exists(
                &mut tx,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.skill_id,
            )
            .await?;
            let deleted = delete_asset(&mut tx, &command).await?;
            if deleted {
                insert_audit_log(
                    &mut tx,
                    &command.audit_log_uuid,
                    &command.request_id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    command.subject.operator_id,
                    command.subject.operator_type,
                    "delete_skill_asset",
                    command.skill_id,
                    serde_json::json!({
                        "action": "delete_skill_asset",
                        "skillId": command.skill_id,
                        "assetId": command.asset_id
                    }),
                )
                .await?;
            }
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit skill asset transaction", error))?;
            Ok(deleted)
        })
    }

    fn list_artifacts<'a>(
        &'a self,
        query: ListAdminSkillArtifactsQuery,
    ) -> AdminSkillCommandFuture<'a, Vec<AdminSkillArtifactItem>> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin skill artifact transaction", error)
            })?;
            ensure_visible_skill_exists(
                &mut tx,
                query.subject.tenant_id,
                query.subject.organization_id,
                query.skill_id,
            )
            .await?;
            let items = list_artifacts(&mut tx, query).await?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit skill artifact transaction", error)
            })?;
            Ok(items)
        })
    }

    fn create_artifact<'a>(
        &'a self,
        command: CreateAdminSkillArtifactCommand,
    ) -> AdminSkillCommandFuture<'a, AdminSkillArtifactItem> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin skill artifact transaction", error)
            })?;
            ensure_skill_exists(
                &mut tx,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.skill_id,
            )
            .await?;
            let id = insert_artifact(&mut tx, &command).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_skill_artifact",
                command.skill_id,
                serde_json::json!({
                    "action": "create_skill_artifact",
                    "skillId": command.skill_id,
                    "artifactId": id,
                    "artifactRef": &command.artifact_ref,
                    "artifact": &command.artifact,
                    "version": &command.version
                }),
            )
            .await?;
            let item = load_artifact_by_id(
                &mut tx,
                id,
                command.skill_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("created skill artifact could not be reloaded"))?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit skill artifact transaction", error)
            })?;
            Ok(item)
        })
    }

    fn update_artifact<'a>(
        &'a self,
        command: UpdateAdminSkillArtifactCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillArtifactItem>> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin skill artifact transaction", error)
            })?;
            ensure_skill_exists(
                &mut tx,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.skill_id,
            )
            .await?;
            let updated = update_artifact(&mut tx, &command).await?;
            if !updated {
                tx.commit().await.map_err(|error| {
                    store_error("failed to commit skill artifact transaction", error)
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
                "update_skill_artifact",
                command.skill_id,
                serde_json::json!({
                    "action": "update_skill_artifact",
                    "skillId": command.skill_id,
                    "artifactId": command.artifact_id
                }),
            )
            .await?;
            let item = load_artifact_by_id(
                &mut tx,
                command.artifact_id,
                command.skill_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit skill artifact transaction", error)
            })?;
            Ok(item)
        })
    }

    fn delete_artifact<'a>(
        &'a self,
        command: DeleteAdminSkillArtifactCommand,
    ) -> AdminSkillCommandFuture<'a, bool> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin skill artifact transaction", error)
            })?;
            ensure_skill_exists(
                &mut tx,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.skill_id,
            )
            .await?;
            let deleted = delete_artifact(&mut tx, &command).await?;
            if deleted {
                insert_audit_log(
                    &mut tx,
                    &command.audit_log_uuid,
                    &command.request_id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    command.subject.operator_id,
                    command.subject.operator_type,
                    "delete_skill_artifact",
                    command.skill_id,
                    serde_json::json!({
                        "action": "delete_skill_artifact",
                        "skillId": command.skill_id,
                        "artifactId": command.artifact_id
                    }),
                )
                .await?;
            }
            tx.commit().await.map_err(|error| {
                store_error("failed to commit skill artifact transaction", error)
            })?;
            Ok(deleted)
        })
    }
}

async fn list_categories(
    pool: &PgPool,
    query: ListAdminSkillCategoriesQuery,
) -> DomainResult<Vec<AdminSkillCategoryItem>> {
    let rows = sqlx::query(
        r#"
        SELECT id, uuid, tenant_id, organization_id, name, description, code,
               icon_resource_snapshot,
               COALESCE(sort_weight, 0) AS sort_weight,
               parent_id, path, COALESCE(visible, true) AS visible,
               COALESCE(status, 1) AS status, category_type
        FROM c_category
        WHERE (
              (tenant_id = $1 AND organization_id = $2)
              OR (tenant_id = $3 AND organization_id = $4)
          )
          AND category_type IN ($5, $6)
          AND COALESCE(status, 1) >= 0
        ORDER BY
            CASE
                WHEN tenant_id = $1 AND organization_id = $2 THEN 0
                WHEN tenant_id = $3 AND organization_id = $4 THEN 1
                ELSE 2
            END,
            COALESCE(sort_weight, 0) DESC,
            id ASC
        LIMIT 500
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(PUBLIC_SKILLS_TENANT_ID)
    .bind(PUBLIC_SKILLS_ORGANIZATION_ID)
    .bind(SKILL_CATEGORY_TYPE_MARKET)
    .bind(SKILL_CATEGORY_TYPE_COLLECTION)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list skill categories", error))?;
    rows.into_iter().map(category_from_row).collect()
}

async fn insert_category(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAdminSkillCategoryCommand,
) -> DomainResult<i64> {
    let id = next_assigned_id(
        tx,
        "c_category",
        "admin-skill-category",
        &command.category_uuid,
    )
    .await?;
    let icon = command.icon.as_ref();
    let icon_media_resource_id = icon.map(media_resource_stable_id);
    let icon_object_blob_id = icon.and_then(media_resource_object_blob_id);
    let icon_resource_snapshot = icon.map(serde_json::Value::to_string);
    sqlx::query(
        r#"
        INSERT INTO c_category
            (id, uuid, tenant_id, organization_id, data_scope, category_type, name, description, code,
             icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot,
             sort_weight, parent_id, path, visible, status, created_at, updated_at)
        VALUES
            ($1, $2, $3, $4, 1, $5, $6, $7, $8, $9, $10, $11::jsonb, $12, $13, $14, $15, $16, $17::timestamptz, $18::timestamptz)
        "#,
    )
    .bind(id)
    .bind(&command.category_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(skill_category_type_label(command.category_type))
    .bind(&command.name)
    .bind(command.description.as_deref())
    .bind(command.code.as_deref())
    .bind(icon_media_resource_id)
    .bind(icon_object_blob_id)
    .bind(icon_resource_snapshot)
    .bind(command.sort_weight)
    .bind(command.parent_id)
    .bind(command.path.as_deref())
    .bind(command.visible)
    .bind(command.status)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create skill category", error))?;
    Ok(id)
}

async fn load_category_by_id(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminSkillCategoryItem>> {
    let row = sqlx::query(
        r#"
        SELECT id, uuid, tenant_id, organization_id, name, description, code,
               icon_resource_snapshot,
               COALESCE(sort_weight, 0) AS sort_weight,
               parent_id, path, COALESCE(visible, true) AS visible,
               COALESCE(status, 1) AS status, category_type
        FROM c_category
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
          AND category_type IN ($4, $5)
        LIMIT 1
        "#,
    )
    .bind(id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(SKILL_CATEGORY_TYPE_MARKET)
    .bind(SKILL_CATEGORY_TYPE_COLLECTION)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load skill category", error))?;
    row.map(category_from_row).transpose()
}

async fn update_category(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateAdminSkillCategoryCommand,
) -> DomainResult<bool> {
    if command.parent_id.flatten() == Some(command.category_id) {
        return Err(DomainError::conflict(
            "skill category parent cannot reference itself",
        ));
    }
    let icon_changed = command.icon.is_some();
    let icon = command.icon.as_ref().and_then(|value| value.as_ref());
    let icon_media_resource_id = icon.map(media_resource_stable_id);
    let icon_object_blob_id = icon.and_then(media_resource_object_blob_id);
    let icon_resource_snapshot = icon.map(serde_json::Value::to_string);
    let result = sqlx::query(
        r#"
        UPDATE c_category
        SET name = COALESCE($1, name),
            description = CASE WHEN $2 THEN $3 ELSE description END,
            code = CASE WHEN $4 THEN $5 ELSE code END,
            icon_media_resource_id = CASE WHEN $6 THEN $7 ELSE icon_media_resource_id END,
            icon_object_blob_id = CASE WHEN $8 THEN $9 ELSE icon_object_blob_id END,
            icon_resource_snapshot = CASE WHEN $10 THEN $11::jsonb ELSE icon_resource_snapshot END,
            sort_weight = COALESCE($12, sort_weight),
            parent_id = CASE WHEN $13 THEN $14 ELSE parent_id END,
            path = CASE WHEN $15 THEN $16 ELSE path END,
            visible = COALESCE($17, visible),
            status = COALESCE($18, status),
            category_type = COALESCE($19, category_type),
            updated_at = $20::timestamptz,
            v = COALESCE(v, 0) + 1
        WHERE id = $21
          AND tenant_id = $22
          AND organization_id = $23
          AND category_type IN ($24, $25)
        "#,
    )
    .bind(command.name.as_deref())
    .bind(command.description.is_some())
    .bind(
        command
            .description
            .as_ref()
            .and_then(|value: &Option<String>| value.as_deref()),
    )
    .bind(command.code.is_some())
    .bind(
        command
            .code
            .as_ref()
            .and_then(|value: &Option<String>| value.as_deref()),
    )
    .bind(icon_changed)
    .bind(icon_media_resource_id)
    .bind(icon_changed)
    .bind(icon_object_blob_id)
    .bind(icon_changed)
    .bind(icon_resource_snapshot)
    .bind(command.sort_weight)
    .bind(command.parent_id.is_some())
    .bind(command.parent_id.flatten())
    .bind(command.path.is_some())
    .bind(
        command
            .path
            .as_ref()
            .and_then(|value: &Option<String>| value.as_deref()),
    )
    .bind(command.visible)
    .bind(command.status)
    .bind(
        command
            .category_type
            .map(|value| skill_category_type_label(value).to_owned()),
    )
    .bind(&command.requested_at)
    .bind(command.category_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(SKILL_CATEGORY_TYPE_MARKET)
    .bind(SKILL_CATEGORY_TYPE_COLLECTION)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update skill category", error))?;
    Ok(result.rows_affected() > 0)
}

async fn delete_category(
    tx: &mut Transaction<'_, Postgres>,
    command: &DeleteAdminSkillCategoryCommand,
) -> DomainResult<bool> {
    ensure_category_delete_allowed(tx, command).await?;
    let result = sqlx::query(
        r#"
        UPDATE c_category
        SET status = -1,
            updated_at = $1::timestamptz,
            v = COALESCE(v, 0) + 1
        WHERE id = $2
          AND tenant_id = $3
          AND organization_id = $4
          AND category_type IN ($5, $6)
          AND COALESCE(status, 1) >= 0
        "#,
    )
    .bind(&command.requested_at)
    .bind(command.category_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(SKILL_CATEGORY_TYPE_MARKET)
    .bind(SKILL_CATEGORY_TYPE_COLLECTION)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete skill category", error))?;
    Ok(result.rows_affected() > 0)
}

async fn list_packages(
    pool: &PgPool,
    query: ListAdminSkillPackagesQuery,
) -> DomainResult<Vec<AdminSkillPackageItem>> {
    let page_size = query.page_size.unwrap_or(100).clamp(1, 200);
    let page_no = query.page_no.unwrap_or(1).max(1);
    let offset = (page_no - 1) * page_size;
    let keyword = query
        .keyword
        .as_ref()
        .map(|value| format!("%{}%", value.replace('%', "\\%").replace('_', "\\_")));
    let rows = sqlx::query(
        r#"
        SELECT id, uuid, tenant_id, organization_id, user_id, package_key, name,
               summary, description, icon_resource_snapshot, cover_resource_snapshot, category_id,
               COALESCE(enabled, false) AS enabled,
               COALESCE(featured, false) AS featured,
               COALESCE(sort_weight, 0) AS sort_weight,
               COALESCE(tags::text, '[]') AS tags,
               CAST(latest_published_at AS TEXT) AS latest_published_at,
               CAST(created_at AS TEXT) AS created_at,
               CAST(updated_at AS TEXT) AS updated_at
        FROM ai_agent_skill_package
        WHERE (
              (tenant_id = $1 AND organization_id = $2)
              OR (tenant_id = $3 AND organization_id = $4)
          )
          AND ($5::text IS NULL OR name ILIKE $6 ESCAPE '\' OR package_key ILIKE $7 ESCAPE '\')
          AND ($8::boolean IS NULL OR enabled = $9)
          AND ($10::bigint IS NULL OR category_id = $11)
        ORDER BY
            CASE
                WHEN tenant_id = $1 AND organization_id = $2 THEN 0
                WHEN tenant_id = $3 AND organization_id = $4 THEN 1
                ELSE 2
            END,
            COALESCE(featured, false) DESC,
            COALESCE(sort_weight, 0) DESC,
            id DESC
        LIMIT $12 OFFSET $13
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(PUBLIC_SKILLS_TENANT_ID)
    .bind(PUBLIC_SKILLS_ORGANIZATION_ID)
    .bind(keyword.as_deref())
    .bind(keyword.as_deref())
    .bind(keyword.as_deref())
    .bind(query.enabled)
    .bind(query.enabled)
    .bind(query.category_id)
    .bind(query.category_id)
    .bind(page_size)
    .bind(offset)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list skill packages", error))?;
    rows.into_iter().map(package_from_row).collect()
}

async fn insert_package(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAdminSkillPackageCommand,
) -> DomainResult<i64> {
    let id = next_assigned_id(
        tx,
        "ai_agent_skill_package",
        "admin-agent-skill-package",
        &command.package_uuid,
    )
    .await?;
    let cover = command.cover.as_ref();
    let cover_media_resource_id = cover.map(media_resource_stable_id);
    let cover_object_blob_id = cover.and_then(media_resource_object_blob_id);
    let cover_resource_snapshot = cover.map(serde_json::Value::to_string);
    let icon = command.icon.as_ref();
    let icon_media_resource_id = icon.map(media_resource_stable_id);
    let icon_object_blob_id = icon.and_then(media_resource_object_blob_id);
    let icon_resource_snapshot = icon.map(serde_json::Value::to_string);
    sqlx::query(
        r#"
        INSERT INTO ai_agent_skill_package
            (id, uuid, tenant_id, organization_id, data_scope, user_id, package_key, name,
             summary, description, icon_media_resource_id, icon_object_blob_id,
             icon_resource_snapshot, cover_media_resource_id, cover_object_blob_id,
             cover_resource_snapshot, category_id, enabled, featured,
             sort_weight, tags, created_at, updated_at)
        VALUES
            ($1, $2, $3, $4, 1, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13, $14,
             $15::jsonb, $16, $17, $18, $19, $20::jsonb, $21::timestamptz, $22::timestamptz)
        "#,
    )
    .bind(id)
    .bind(&command.package_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.operator_id)
    .bind(&command.package_key)
    .bind(&command.name)
    .bind(command.summary.as_deref())
    .bind(command.description.as_deref())
    .bind(icon_media_resource_id)
    .bind(icon_object_blob_id)
    .bind(icon_resource_snapshot)
    .bind(cover_media_resource_id)
    .bind(cover_object_blob_id)
    .bind(cover_resource_snapshot)
    .bind(command.category_id)
    .bind(command.enabled)
    .bind(command.featured)
    .bind(command.sort_weight)
    .bind(json_text_array(&command.tags)?)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create skill package", error))?;
    Ok(id)
}

async fn update_package(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateAdminSkillPackageCommand,
) -> DomainResult<bool> {
    let cover_changed = command.cover.is_some();
    let cover = command.cover.as_ref().and_then(|value| value.as_ref());
    let cover_media_resource_id = cover.map(media_resource_stable_id);
    let cover_object_blob_id = cover.and_then(media_resource_object_blob_id);
    let cover_resource_snapshot = cover.map(serde_json::Value::to_string);
    let icon_changed = command.icon.is_some();
    let icon = command.icon.as_ref().and_then(|value| value.as_ref());
    let icon_media_resource_id = icon.map(media_resource_stable_id);
    let icon_object_blob_id = icon.and_then(media_resource_object_blob_id);
    let icon_resource_snapshot = icon.map(serde_json::Value::to_string);
    let result = sqlx::query(
        r#"
        UPDATE ai_agent_skill_package
        SET package_key = COALESCE($1, package_key),
            name = COALESCE($2, name),
            summary = COALESCE($3, summary),
            description = CASE WHEN $4 THEN $5 ELSE description END,
            icon_media_resource_id = CASE WHEN $6 THEN $7 ELSE icon_media_resource_id END,
            icon_object_blob_id = CASE WHEN $8 THEN $9 ELSE icon_object_blob_id END,
            icon_resource_snapshot = CASE WHEN $10 THEN $11::jsonb ELSE icon_resource_snapshot END,
            cover_media_resource_id = CASE WHEN $12 THEN $13 ELSE cover_media_resource_id END,
            cover_object_blob_id = CASE WHEN $14 THEN $15 ELSE cover_object_blob_id END,
            cover_resource_snapshot = CASE WHEN $16 THEN $17::jsonb ELSE cover_resource_snapshot END,
            category_id = CASE WHEN $18 THEN $19 ELSE category_id END,
            enabled = COALESCE($20, enabled),
            featured = COALESCE($21, featured),
            sort_weight = COALESCE($22, sort_weight),
            tags = COALESCE($23::jsonb, tags),
            updated_at = $24::timestamptz,
            v = COALESCE(v, 0) + 1
        WHERE id = $25
          AND tenant_id = $26
          AND organization_id = $27
        "#,
    )
    .bind(command.package_key.as_deref())
    .bind(command.name.as_deref())
    .bind(command.summary.as_deref())
    .bind(command.description.is_some())
    .bind(
        command
            .description
            .as_ref()
            .and_then(|value| value.as_deref()),
    )
    .bind(icon_changed)
    .bind(icon_media_resource_id)
    .bind(icon_changed)
    .bind(icon_object_blob_id)
    .bind(icon_changed)
    .bind(icon_resource_snapshot)
    .bind(cover_changed)
    .bind(cover_media_resource_id)
    .bind(cover_changed)
    .bind(cover_object_blob_id)
    .bind(cover_changed)
    .bind(cover_resource_snapshot)
    .bind(command.category_id.is_some())
    .bind(command.category_id.flatten())
    .bind(command.enabled)
    .bind(command.featured)
    .bind(command.sort_weight)
    .bind(
        command
            .tags
            .as_ref()
            .map(|values| json_text_array(values))
            .transpose()?,
    )
    .bind(&command.requested_at)
    .bind(command.package_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update skill package", error))?;
    Ok(result.rows_affected() > 0)
}

async fn set_package_enabled(
    tx: &mut Transaction<'_, Postgres>,
    command: &SetAdminSkillPackageEnabledCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE ai_agent_skill_package
        SET enabled = $1,
            updated_at = $2::timestamptz,
            v = COALESCE(v, 0) + 1
        WHERE id = $3
          AND tenant_id = $4
          AND organization_id = $5
        "#,
    )
    .bind(command.enabled)
    .bind(&command.requested_at)
    .bind(command.package_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update skill package enabled state", error))?;
    Ok(result.rows_affected() > 0)
}

async fn delete_package(
    tx: &mut Transaction<'_, Postgres>,
    command: &DeleteAdminSkillPackageCommand,
) -> DomainResult<bool> {
    sqlx::query(
        r#"
        UPDATE ai_agent_skill
        SET package_id = NULL,
            updated_at = $1::timestamptz,
            v = COALESCE(v, 0) + 1
        WHERE tenant_id = $2
          AND organization_id = $3
          AND package_id = $4
        "#,
    )
    .bind(&command.requested_at)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.package_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to clear skill package links", error))?;

    let result = sqlx::query(
        r#"
        DELETE FROM ai_agent_skill_package
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
        "#,
    )
    .bind(command.package_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete skill package", error))?;
    Ok(result.rows_affected() > 0)
}

async fn load_package_by_id(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminSkillPackageItem>> {
    let row = sqlx::query(
        r#"
        SELECT id, uuid, tenant_id, organization_id, user_id, package_key, name,
               summary, description, icon_resource_snapshot, cover_resource_snapshot, category_id,
               COALESCE(enabled, false) AS enabled,
               COALESCE(featured, false) AS featured,
               COALESCE(sort_weight, 0) AS sort_weight,
               COALESCE(tags::text, '[]') AS tags,
               CAST(latest_published_at AS TEXT) AS latest_published_at,
               CAST(created_at AS TEXT) AS created_at,
               CAST(updated_at AS TEXT) AS updated_at
        FROM ai_agent_skill_package
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
        LIMIT 1
        "#,
    )
    .bind(id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load skill package", error))?;
    row.map(package_from_row).transpose()
}

async fn list_skills(
    pool: &PgPool,
    query: ListAdminSkillsQuery,
) -> DomainResult<Vec<AdminSkillItem>> {
    let page_size = query.page_size.unwrap_or(100).clamp(1, 200);
    let page_no = query.page_no.unwrap_or(1).max(1);
    let offset = (page_no - 1) * page_size;
    let keyword = query
        .keyword
        .as_ref()
        .map(|value| format!("%{}%", value.replace('%', "\\%").replace('_', "\\_")));
    let rows = sqlx::query(
        r#"
        SELECT
            id, uuid, tenant_id, organization_id, COALESCE(user_id, 0) AS user_id,
            skill_key, name, summary, description, icon_resource_snapshot, cover_resource_snapshot,
            category_id, package_id,
            provider, version, version_name, runtime, entrypoint, manifest_url,
            repository_url, homepage_url, documentation_url, license_name, source_type,
            market_status, visibility, review_status, review_comment, reviewed_by,
            CAST(reviewed_at AS TEXT) AS reviewed_at,
            COALESCE(builtin, false) AS builtin,
            COALESCE(is_builtin, false) AS is_builtin,
            COALESCE(enabled, false) AS enabled,
            COALESCE(featured, false) AS featured,
            COALESCE(recommend_weight, 0) AS recommend_weight,
            CAST(price AS TEXT) AS price,
            COALESCE(currency, 'CNY') AS currency,
            COALESCE(install_count, 0) AS install_count,
            CAST(COALESCE(rating_avg, 0) AS TEXT) AS rating_avg,
            COALESCE(rating_count, 0) AS rating_count,
            COALESCE(tags::text, '[]') AS tags,
            COALESCE(capabilities::text, '[]') AS capabilities,
            COALESCE(config_schema::text, '{}') AS config_schema,
            COALESCE(default_config::text, '{}') AS default_config,
            CAST(latest_published_at AS TEXT) AS latest_published_at,
            CAST(created_at AS TEXT) AS created_at,
            CAST(updated_at AS TEXT) AS updated_at
        FROM ai_agent_skill
        WHERE (
              (tenant_id = $1 AND organization_id = $2)
              OR (tenant_id = $3 AND organization_id = $4)
          )
          AND ($5::text IS NULL OR name ILIKE $6 ESCAPE '\' OR skill_key ILIKE $7 ESCAPE '\')
          AND ($8::text IS NULL OR market_status = $9)
          AND ($10::text IS NULL OR review_status = $11)
          AND ($12::text IS NULL OR visibility = $13)
          AND ($14::boolean IS NULL OR enabled = $15)
          AND ($16::bigint IS NULL OR category_id = $17)
        ORDER BY
            CASE
                WHEN tenant_id = $1 AND organization_id = $2 THEN 0
                WHEN tenant_id = $3 AND organization_id = $4 THEN 1
                ELSE 2
            END,
            COALESCE(featured, false) DESC,
            COALESCE(recommend_weight, 0) DESC,
            id DESC
        LIMIT $18 OFFSET $19
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(PUBLIC_SKILLS_TENANT_ID)
    .bind(PUBLIC_SKILLS_ORGANIZATION_ID)
    .bind(keyword.as_deref())
    .bind(keyword.as_deref())
    .bind(keyword.as_deref())
    .bind(query.market_status.as_deref())
    .bind(query.market_status.as_deref())
    .bind(query.review_status.as_deref())
    .bind(query.review_status.as_deref())
    .bind(query.visibility.as_deref())
    .bind(query.visibility.as_deref())
    .bind(query.enabled)
    .bind(query.enabled)
    .bind(query.category_id)
    .bind(query.category_id)
    .bind(page_size)
    .bind(offset)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list skills", error))?;
    rows.into_iter().map(skill_from_row).collect()
}

async fn insert_skill(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAdminSkillCommand,
) -> DomainResult<i64> {
    let id = next_assigned_id(
        tx,
        "ai_agent_skill",
        "admin-agent-skill",
        &command.skill_uuid,
    )
    .await?;
    let cover = command.cover.as_ref();
    let cover_media_resource_id = cover.map(media_resource_stable_id);
    let cover_object_blob_id = cover.and_then(media_resource_object_blob_id);
    let cover_resource_snapshot = cover.map(serde_json::Value::to_string);
    let icon = command.icon.as_ref();
    let icon_media_resource_id = icon.map(media_resource_stable_id);
    let icon_object_blob_id = icon.and_then(media_resource_object_blob_id);
    let icon_resource_snapshot = icon.map(serde_json::Value::to_string);
    sqlx::query(
        r#"
        INSERT INTO ai_agent_skill
            (id, uuid, tenant_id, organization_id, data_scope, user_id, skill_key, name, summary,
             description, icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot,
             cover_media_resource_id, cover_object_blob_id,
             cover_resource_snapshot, category_id, package_id, provider, version,
             version_name, runtime, entrypoint, manifest_url, repository_url, homepage_url,
             documentation_url, license_name, source_type, market_status, visibility,
             review_status, builtin, is_builtin, enabled, featured, recommend_weight, price,
             currency, install_count, rating_avg, rating_count, tags, capabilities,
             config_schema, default_config, created_at, updated_at)
        VALUES
            ($1, $2, $3, $4, 1, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13, $14,
             $15::jsonb, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27,
             $28, $29, $30, $31, $32, $33, $34, $35, $36, $37::numeric, $38, 0, 0, 0,
             $39::jsonb, $40::jsonb, $41::jsonb, $42::jsonb, $43::timestamptz, $44::timestamptz)
        "#,
    )
    .bind(id)
    .bind(&command.skill_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.operator_id)
    .bind(&command.skill_key)
    .bind(&command.name)
    .bind(command.summary.as_deref())
    .bind(command.description.as_deref())
    .bind(icon_media_resource_id)
    .bind(icon_object_blob_id)
    .bind(icon_resource_snapshot)
    .bind(cover_media_resource_id)
    .bind(cover_object_blob_id)
    .bind(cover_resource_snapshot)
    .bind(command.category_id)
    .bind(command.package_id)
    .bind(command.provider.as_deref())
    .bind(command.version.as_deref())
    .bind(command.version_name.as_deref())
    .bind(command.runtime.as_deref())
    .bind(command.entrypoint.as_deref())
    .bind(command.manifest_url.as_deref())
    .bind(command.repository_url.as_deref())
    .bind(command.homepage_url.as_deref())
    .bind(command.documentation_url.as_deref())
    .bind(command.license_name.as_deref())
    .bind(&command.source_type)
    .bind(&command.market_status)
    .bind(&command.visibility)
    .bind(&command.review_status)
    .bind(command.builtin)
    .bind(command.is_builtin)
    .bind(command.enabled)
    .bind(command.featured)
    .bind(command.recommend_weight)
    .bind(command.price.as_deref())
    .bind(&command.currency)
    .bind(json_text_array(&command.tags)?)
    .bind(json_text_array(&command.capabilities)?)
    .bind(command.config_schema.to_string())
    .bind(command.default_config.to_string())
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create skill", error))?;
    Ok(id)
}

async fn update_skill(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateAdminSkillCommand,
) -> DomainResult<bool> {
    let cover_changed = command.cover.is_some();
    let cover = command.cover.as_ref().and_then(|value| value.as_ref());
    let cover_media_resource_id = cover.map(media_resource_stable_id);
    let cover_object_blob_id = cover.and_then(media_resource_object_blob_id);
    let cover_resource_snapshot = cover.map(serde_json::Value::to_string);
    let icon_changed = command.icon.is_some();
    let icon = command.icon.as_ref().and_then(|value| value.as_ref());
    let icon_media_resource_id = icon.map(media_resource_stable_id);
    let icon_object_blob_id = icon.and_then(media_resource_object_blob_id);
    let icon_resource_snapshot = icon.map(serde_json::Value::to_string);
    let result = sqlx::query(
        r#"
        UPDATE ai_agent_skill
        SET skill_key = COALESCE($1, skill_key),
            name = COALESCE($2, name),
            summary = COALESCE($3, summary),
            description = CASE WHEN $4 THEN $5 ELSE description END,
            icon_media_resource_id = CASE WHEN $6 THEN $7 ELSE icon_media_resource_id END,
            icon_object_blob_id = CASE WHEN $8 THEN $9 ELSE icon_object_blob_id END,
            icon_resource_snapshot = CASE WHEN $10 THEN $11::jsonb ELSE icon_resource_snapshot END,
            cover_media_resource_id = CASE WHEN $12 THEN $13 ELSE cover_media_resource_id END,
            cover_object_blob_id = CASE WHEN $14 THEN $15 ELSE cover_object_blob_id END,
            cover_resource_snapshot = CASE WHEN $16 THEN $17::jsonb ELSE cover_resource_snapshot END,
            category_id = CASE WHEN $18 THEN $19 ELSE category_id END,
            package_id = CASE WHEN $20 THEN $21 ELSE package_id END,
            provider = CASE WHEN $22 THEN $23 ELSE provider END,
            version = COALESCE($24, version),
            version_name = CASE WHEN $25 THEN $26 ELSE version_name END,
            runtime = CASE WHEN $27 THEN $28 ELSE runtime END,
            entrypoint = CASE WHEN $29 THEN $30 ELSE entrypoint END,
            manifest_url = CASE WHEN $31 THEN $32 ELSE manifest_url END,
            repository_url = CASE WHEN $33 THEN $34 ELSE repository_url END,
            homepage_url = CASE WHEN $35 THEN $36 ELSE homepage_url END,
            documentation_url = CASE WHEN $37 THEN $38 ELSE documentation_url END,
            license_name = CASE WHEN $39 THEN $40 ELSE license_name END,
            source_type = COALESCE($41, source_type),
            visibility = COALESCE($42, visibility),
            builtin = COALESCE($43, builtin),
            is_builtin = COALESCE($44, is_builtin),
            featured = COALESCE($45, featured),
            recommend_weight = COALESCE($46, recommend_weight),
            price = CASE WHEN $47 THEN $48::numeric ELSE price END,
            currency = COALESCE($49, currency),
            tags = COALESCE($50::jsonb, tags),
            capabilities = COALESCE($51::jsonb, capabilities),
            config_schema = COALESCE($52::jsonb, config_schema),
            default_config = COALESCE($53::jsonb, default_config),
            updated_at = $54::timestamptz,
            v = COALESCE(v, 0) + 1
        WHERE id = $55
          AND tenant_id = $56
          AND organization_id = $57
        "#,
    )
    .bind(command.skill_key.as_deref())
    .bind(command.name.as_deref())
    .bind(command.summary.as_deref())
    .bind(command.description.is_some())
    .bind(
        command
            .description
            .as_ref()
            .and_then(|value| value.as_deref()),
    )
    .bind(icon_changed)
    .bind(icon_media_resource_id)
    .bind(icon_changed)
    .bind(icon_object_blob_id)
    .bind(icon_changed)
    .bind(icon_resource_snapshot)
    .bind(cover_changed)
    .bind(cover_media_resource_id)
    .bind(cover_changed)
    .bind(cover_object_blob_id)
    .bind(cover_changed)
    .bind(cover_resource_snapshot)
    .bind(command.category_id.is_some())
    .bind(command.category_id.flatten())
    .bind(command.package_id.is_some())
    .bind(command.package_id.flatten())
    .bind(command.provider.is_some())
    .bind(command.provider.as_ref().and_then(|value| value.as_deref()))
    .bind(command.version.as_deref())
    .bind(command.version_name.is_some())
    .bind(
        command
            .version_name
            .as_ref()
            .and_then(|value| value.as_deref()),
    )
    .bind(command.runtime.is_some())
    .bind(command.runtime.as_ref().and_then(|value| value.as_deref()))
    .bind(command.entrypoint.is_some())
    .bind(
        command
            .entrypoint
            .as_ref()
            .and_then(|value| value.as_deref()),
    )
    .bind(command.manifest_url.is_some())
    .bind(
        command
            .manifest_url
            .as_ref()
            .and_then(|value| value.as_deref()),
    )
    .bind(command.repository_url.is_some())
    .bind(
        command
            .repository_url
            .as_ref()
            .and_then(|value| value.as_deref()),
    )
    .bind(command.homepage_url.is_some())
    .bind(
        command
            .homepage_url
            .as_ref()
            .and_then(|value| value.as_deref()),
    )
    .bind(command.documentation_url.is_some())
    .bind(
        command
            .documentation_url
            .as_ref()
            .and_then(|value| value.as_deref()),
    )
    .bind(command.license_name.is_some())
    .bind(
        command
            .license_name
            .as_ref()
            .and_then(|value| value.as_deref()),
    )
    .bind(command.source_type.as_deref())
    .bind(command.visibility.as_deref())
    .bind(command.builtin)
    .bind(command.is_builtin)
    .bind(command.featured)
    .bind(command.recommend_weight)
    .bind(command.price.is_some())
    .bind(command.price.as_ref().and_then(|value| value.as_deref()))
    .bind(command.currency.as_deref())
    .bind(
        command
            .tags
            .as_ref()
            .map(|values| json_text_array(values))
            .transpose()?,
    )
    .bind(
        command
            .capabilities
            .as_ref()
            .map(|values| json_text_array(values))
            .transpose()?,
    )
    .bind(
        command
            .config_schema
            .as_ref()
            .map(|value| value.to_string()),
    )
    .bind(
        command
            .default_config
            .as_ref()
            .map(|value| value.to_string()),
    )
    .bind(&command.requested_at)
    .bind(command.skill_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update skill", error))?;
    Ok(result.rows_affected() > 0)
}

async fn set_skill_enabled(
    tx: &mut Transaction<'_, Postgres>,
    command: &SetAdminSkillEnabledCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE ai_agent_skill
        SET enabled = $1,
            updated_at = $2::timestamptz,
            v = COALESCE(v, 0) + 1
        WHERE id = $3
          AND tenant_id = $4
          AND organization_id = $5
        "#,
    )
    .bind(command.enabled)
    .bind(&command.requested_at)
    .bind(command.skill_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update skill enabled state", error))?;
    Ok(result.rows_affected() > 0)
}

async fn set_market_status(
    tx: &mut Transaction<'_, Postgres>,
    command: &SetAdminSkillMarketStatusCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE ai_agent_skill
        SET market_status = $1,
            latest_published_at = CASE WHEN $2 THEN $3::timestamptz ELSE latest_published_at END,
            updated_at = $4::timestamptz,
            v = COALESCE(v, 0) + 1
        WHERE id = $5
          AND tenant_id = $6
          AND organization_id = $7
        "#,
    )
    .bind(&command.market_status)
    .bind(command.publish)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(command.skill_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update skill market status", error))?;
    Ok(result.rows_affected() > 0)
}

async fn review_skill(
    tx: &mut Transaction<'_, Postgres>,
    command: &ReviewAdminSkillCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE ai_agent_skill
        SET review_status = $1,
            review_comment = $2,
            reviewed_by = $3,
            reviewed_at = $4::timestamptz,
            updated_at = $5::timestamptz,
            v = COALESCE(v, 0) + 1
        WHERE id = $6
          AND tenant_id = $7
          AND organization_id = $8
        "#,
    )
    .bind(&command.review_status)
    .bind(command.review_comment.as_deref())
    .bind(command.subject.operator_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(command.skill_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to review skill", error))?;
    Ok(result.rows_affected() > 0)
}

async fn delete_skill(
    tx: &mut Transaction<'_, Postgres>,
    command: &DeleteAdminSkillCommand,
) -> DomainResult<bool> {
    sqlx::query(
        r#"
        DELETE FROM ai_user_agent_skill
        WHERE tenant_id = $1
          AND organization_id = $2
          AND skill_id = $3
        "#,
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.skill_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete user skill bindings", error))?;

    delete_skill_catalog_records(
        tx,
        command.subject.tenant_id,
        command.subject.organization_id,
        command.skill_id,
    )
    .await?;

    let result = sqlx::query(
        r#"
        DELETE FROM ai_agent_skill
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
        "#,
    )
    .bind(command.skill_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete skill", error))?;
    Ok(result.rows_affected() > 0)
}

async fn load_skill_by_id(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminSkillItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            id, uuid, tenant_id, organization_id, COALESCE(user_id, 0) AS user_id,
            skill_key, name, summary, description, icon_resource_snapshot, cover_resource_snapshot,
            category_id, package_id,
            provider, version, version_name, runtime, entrypoint, manifest_url,
            repository_url, homepage_url, documentation_url, license_name, source_type,
            market_status, visibility, review_status, review_comment, reviewed_by,
            CAST(reviewed_at AS TEXT) AS reviewed_at,
            COALESCE(builtin, false) AS builtin,
            COALESCE(is_builtin, false) AS is_builtin,
            COALESCE(enabled, false) AS enabled,
            COALESCE(featured, false) AS featured,
            COALESCE(recommend_weight, 0) AS recommend_weight,
            CAST(price AS TEXT) AS price,
            COALESCE(currency, 'CNY') AS currency,
            COALESCE(install_count, 0) AS install_count,
            CAST(COALESCE(rating_avg, 0) AS TEXT) AS rating_avg,
            COALESCE(rating_count, 0) AS rating_count,
            COALESCE(tags::text, '[]') AS tags,
            COALESCE(capabilities::text, '[]') AS capabilities,
            COALESCE(config_schema::text, '{}') AS config_schema,
            COALESCE(default_config::text, '{}') AS default_config,
            CAST(latest_published_at AS TEXT) AS latest_published_at,
            CAST(created_at AS TEXT) AS created_at,
            CAST(updated_at AS TEXT) AS updated_at
        FROM ai_agent_skill
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
        LIMIT 1
        "#,
    )
    .bind(id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load skill", error))?;
    row.map(skill_from_row).transpose()
}

async fn list_assets(
    tx: &mut Transaction<'_, Postgres>,
    query: ListAdminSkillAssetsQuery,
) -> DomainResult<Vec<AdminSkillAssetItem>> {
    let rows = sqlx::query(
        r#"
        SELECT id, uuid, tenant_id, organization_id, COALESCE(status, 1) AS status,
               COALESCE(target_type, 0) AS target_type, COALESCE(target_id, 0) AS target_id,
               artifact_id, COALESCE(asset_type, 0) AS asset_type,
               asset_resource_snapshot, thumbnail_resource_snapshot,
               title, alt_text, mime_type, width, height,
               CAST(duration_seconds AS TEXT) AS duration_seconds, file_size,
               COALESCE(sort_order, 0) AS sort_order,
               CAST(published_at AS TEXT) AS published_at,
               CAST(created_at AS TEXT) AS created_at,
               CAST(updated_at AS TEXT) AS updated_at
        FROM ai_skill_asset
        WHERE (
              (tenant_id = $1 AND organization_id = $2)
              OR (tenant_id = $3 AND organization_id = $4)
          )
          AND target_type = $5
          AND target_id = $6
        ORDER BY
            CASE
                WHEN tenant_id = $1 AND organization_id = $2 THEN 0
                WHEN tenant_id = $3 AND organization_id = $4 THEN 1
                ELSE 2
            END,
            COALESCE(sort_order, 0) ASC,
            id ASC
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(PUBLIC_SKILLS_TENANT_ID)
    .bind(PUBLIC_SKILLS_ORGANIZATION_ID)
    .bind(SKILL_TARGET_TYPE)
    .bind(query.skill_id)
    .fetch_all(&mut **tx)
    .await
    .map_err(|error| store_error("failed to list skill assets", error))?;
    rows.into_iter().map(asset_from_row).collect()
}

async fn insert_asset(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAdminSkillAssetCommand,
) -> DomainResult<i64> {
    let id = next_assigned_id(
        tx,
        "ai_skill_asset",
        "admin-skill-asset",
        &command.asset_uuid,
    )
    .await?;
    let asset_media_resource_id = media_resource_stable_id(&command.asset);
    let asset_object_blob_id = media_resource_object_blob_id(&command.asset);
    let thumbnail_media_resource_id = command.thumbnail.as_ref().map(media_resource_stable_id);
    let thumbnail_object_blob_id = command
        .thumbnail
        .as_ref()
        .and_then(media_resource_object_blob_id);
    sqlx::query(
        r#"
        INSERT INTO ai_skill_asset
            (id, uuid, tenant_id, organization_id, data_scope, status, target_type, target_id,
             artifact_id, asset_type, asset_media_resource_id, asset_object_blob_id,
             asset_resource_snapshot, thumbnail_media_resource_id, thumbnail_object_blob_id,
             thumbnail_resource_snapshot, title, alt_text, mime_type, width, height,
             duration_seconds, file_size, sort_order, published_at, created_at, updated_at)
        VALUES
            ($1, $2, $3, $4, 1, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13, $14,
             $15::jsonb, $16, $17, $18, $19, $20, $21, $22, $23::timestamptz,
             $24::timestamptz, $25::timestamptz)
        "#,
    )
    .bind(id)
    .bind(&command.asset_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.status)
    .bind(SKILL_TARGET_TYPE)
    .bind(command.skill_id)
    .bind(command.artifact_id)
    .bind(command.asset_type)
    .bind(asset_media_resource_id)
    .bind(asset_object_blob_id)
    .bind(command.asset.to_string())
    .bind(thumbnail_media_resource_id)
    .bind(thumbnail_object_blob_id)
    .bind(command.thumbnail.as_ref().map(serde_json::Value::to_string))
    .bind(command.title.as_deref())
    .bind(command.alt_text.as_deref())
    .bind(command.mime_type.as_deref())
    .bind(command.width)
    .bind(command.height)
    .bind(command.duration_seconds.as_deref())
    .bind(command.file_size)
    .bind(command.sort_order)
    .bind(command.published_at.as_deref())
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create skill asset", error))?;
    Ok(id)
}

async fn update_asset(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateAdminSkillAssetCommand,
) -> DomainResult<bool> {
    let asset_media_resource_id = command.asset.as_ref().map(media_resource_stable_id);
    let asset_object_blob_id = command
        .asset
        .as_ref()
        .and_then(media_resource_object_blob_id);
    let asset_resource_snapshot = command.asset.as_ref().map(serde_json::Value::to_string);
    let thumbnail = command.thumbnail.as_ref().and_then(|value| value.as_ref());
    let thumbnail_media_resource_id = thumbnail.map(media_resource_stable_id);
    let thumbnail_object_blob_id = thumbnail.and_then(media_resource_object_blob_id);
    let thumbnail_resource_snapshot = thumbnail.map(serde_json::Value::to_string);
    let result = sqlx::query(
        r#"
        UPDATE ai_skill_asset
        SET artifact_id = CASE WHEN $1 THEN $2 ELSE artifact_id END,
            asset_type = COALESCE($3, asset_type),
            asset_media_resource_id = CASE WHEN $4 THEN $5 ELSE asset_media_resource_id END,
            asset_object_blob_id = CASE WHEN $6 THEN $7 ELSE asset_object_blob_id END,
            asset_resource_snapshot = CASE WHEN $8 THEN $9::jsonb ELSE asset_resource_snapshot END,
            thumbnail_media_resource_id = CASE WHEN $10 THEN $11 ELSE thumbnail_media_resource_id END,
            thumbnail_object_blob_id = CASE WHEN $12 THEN $13 ELSE thumbnail_object_blob_id END,
            thumbnail_resource_snapshot = CASE WHEN $14 THEN $15::jsonb ELSE thumbnail_resource_snapshot END,
            title = CASE WHEN $16 THEN $17 ELSE title END,
            alt_text = CASE WHEN $18 THEN $19 ELSE alt_text END,
            mime_type = CASE WHEN $20 THEN $21 ELSE mime_type END,
            width = CASE WHEN $22 THEN $23 ELSE width END,
            height = CASE WHEN $24 THEN $25 ELSE height END,
            duration_seconds = CASE WHEN $26 THEN $27 ELSE duration_seconds END,
            file_size = CASE WHEN $28 THEN $29 ELSE file_size END,
            sort_order = COALESCE($30, sort_order),
            status = COALESCE($31, status),
            published_at = CASE WHEN $32 THEN $33::timestamptz ELSE published_at END,
            updated_at = $34::timestamptz,
            version = COALESCE(version, 0) + 1
        WHERE id = $35
          AND tenant_id = $36
          AND organization_id = $37
          AND target_type = $38
          AND target_id = $39
        "#,
    )
    .bind(command.artifact_id.is_some())
    .bind(command.artifact_id.flatten())
    .bind(command.asset_type)
    .bind(command.asset.is_some())
    .bind(asset_media_resource_id)
    .bind(command.asset.is_some())
    .bind(asset_object_blob_id)
    .bind(command.asset.is_some())
    .bind(asset_resource_snapshot)
    .bind(command.thumbnail.is_some())
    .bind(thumbnail_media_resource_id)
    .bind(command.thumbnail.is_some())
    .bind(thumbnail_object_blob_id)
    .bind(command.thumbnail.is_some())
    .bind(thumbnail_resource_snapshot)
    .bind(command.title.is_some())
    .bind(command.title.as_ref().and_then(|value| value.as_deref()))
    .bind(command.alt_text.is_some())
    .bind(command.alt_text.as_ref().and_then(|value| value.as_deref()))
    .bind(command.mime_type.is_some())
    .bind(
        command
            .mime_type
            .as_ref()
            .and_then(|value| value.as_deref()),
    )
    .bind(command.width.is_some())
    .bind(command.width.flatten())
    .bind(command.height.is_some())
    .bind(command.height.flatten())
    .bind(command.duration_seconds.is_some())
    .bind(
        command
            .duration_seconds
            .as_ref()
            .and_then(|value| value.as_deref()),
    )
    .bind(command.file_size.is_some())
    .bind(command.file_size.flatten())
    .bind(command.sort_order)
    .bind(command.status)
    .bind(command.published_at.is_some())
    .bind(
        command
            .published_at
            .as_ref()
            .and_then(|value| value.as_deref()),
    )
    .bind(&command.requested_at)
    .bind(command.asset_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(SKILL_TARGET_TYPE)
    .bind(command.skill_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update skill asset", error))?;
    Ok(result.rows_affected() > 0)
}

async fn delete_asset(
    tx: &mut Transaction<'_, Postgres>,
    command: &DeleteAdminSkillAssetCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        DELETE FROM ai_skill_asset
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
          AND target_type = $4
          AND target_id = $5
        "#,
    )
    .bind(command.asset_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(SKILL_TARGET_TYPE)
    .bind(command.skill_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete skill asset", error))?;
    Ok(result.rows_affected() > 0)
}

async fn load_asset_by_id(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    skill_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminSkillAssetItem>> {
    let row = sqlx::query(
        r#"
        SELECT id, uuid, tenant_id, organization_id, COALESCE(status, 1) AS status,
               COALESCE(target_type, 0) AS target_type, COALESCE(target_id, 0) AS target_id,
               artifact_id, COALESCE(asset_type, 0) AS asset_type,
               asset_resource_snapshot, thumbnail_resource_snapshot,
               title, alt_text, mime_type, width, height,
               CAST(duration_seconds AS TEXT) AS duration_seconds, file_size,
               COALESCE(sort_order, 0) AS sort_order,
               CAST(published_at AS TEXT) AS published_at,
               CAST(created_at AS TEXT) AS created_at,
               CAST(updated_at AS TEXT) AS updated_at
        FROM ai_skill_asset
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
          AND target_type = $4
          AND target_id = $5
        LIMIT 1
        "#,
    )
    .bind(id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(SKILL_TARGET_TYPE)
    .bind(skill_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load skill asset", error))?;
    row.map(asset_from_row).transpose()
}

async fn list_artifacts(
    tx: &mut Transaction<'_, Postgres>,
    query: ListAdminSkillArtifactsQuery,
) -> DomainResult<Vec<AdminSkillArtifactItem>> {
    let rows = sqlx::query(
        r#"
        SELECT id, uuid, tenant_id, organization_id, COALESCE(status, 1) AS status,
               COALESCE(target_type, 0) AS target_type, COALESCE(target_id, 0) AS target_id,
               COALESCE(artifact_type, 0) AS artifact_type, COALESCE(version, '') AS version,
               COALESCE(platform_type, '') AS platform_type, COALESCE(os_name, '') AS os_name,
               artifact_ref, artifact_resource_snapshot,
               COALESCE(artifact_size_bytes, 0) AS artifact_size_bytes,
               runtime, COALESCE(frameworks::text, '[]') AS frameworks,
               license_name, checksum_hash, release_notes,
               CAST(published_at AS TEXT) AS published_at,
               CAST(deprecated_at AS TEXT) AS deprecated_at,
               CAST(created_at AS TEXT) AS created_at,
               CAST(updated_at AS TEXT) AS updated_at
        FROM ai_skill_artifact
        WHERE (
              (tenant_id = $1 AND organization_id = $2)
              OR (tenant_id = $3 AND organization_id = $4)
          )
          AND target_type = $5
          AND target_id = $6
        ORDER BY
            CASE
                WHEN tenant_id = $1 AND organization_id = $2 THEN 0
                WHEN tenant_id = $3 AND organization_id = $4 THEN 1
                ELSE 2
            END,
            published_at DESC NULLS LAST,
            id DESC
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(PUBLIC_SKILLS_TENANT_ID)
    .bind(PUBLIC_SKILLS_ORGANIZATION_ID)
    .bind(SKILL_TARGET_TYPE)
    .bind(query.skill_id)
    .fetch_all(&mut **tx)
    .await
    .map_err(|error| store_error("failed to list skill artifacts", error))?;
    rows.into_iter().map(artifact_from_row).collect()
}

async fn insert_artifact(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAdminSkillArtifactCommand,
) -> DomainResult<i64> {
    let id = next_assigned_id(
        tx,
        "ai_skill_artifact",
        "admin-skill-artifact",
        &command.artifact_uuid,
    )
    .await?;
    let artifact = command.artifact.as_ref();
    let artifact_media_resource_id = artifact.map(media_resource_stable_id);
    let artifact_object_blob_id = artifact.and_then(media_resource_object_blob_id);
    let artifact_resource_snapshot = artifact.map(serde_json::Value::to_string);
    sqlx::query(
        r#"
        INSERT INTO ai_skill_artifact
            (id, uuid, tenant_id, organization_id, data_scope, status, target_type, target_id,
             artifact_type, version, platform_type, os_name, artifact_ref,
             artifact_media_resource_id, artifact_object_blob_id, artifact_resource_snapshot,
             artifact_size_bytes, runtime, frameworks, license_name, checksum_hash, release_notes,
             published_at, deprecated_at, created_at, updated_at)
        VALUES
            ($1, $2, $3, $4, 1, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
             $15::jsonb, $16, $17, $18::jsonb, $19, $20, $21, $22::timestamptz,
             $23::timestamptz, $24::timestamptz, $25::timestamptz)
        "#,
    )
    .bind(id)
    .bind(&command.artifact_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.status)
    .bind(SKILL_TARGET_TYPE)
    .bind(command.skill_id)
    .bind(command.artifact_type)
    .bind(&command.version)
    .bind(&command.platform_type)
    .bind(&command.os_name)
    .bind(command.artifact_ref.as_deref())
    .bind(artifact_media_resource_id)
    .bind(artifact_object_blob_id)
    .bind(artifact_resource_snapshot)
    .bind(command.artifact_size_bytes)
    .bind(command.runtime.as_deref())
    .bind(json_text_array(&command.frameworks)?)
    .bind(command.license_name.as_deref())
    .bind(command.checksum_hash.as_deref())
    .bind(command.release_notes.as_deref())
    .bind(command.published_at.as_deref())
    .bind(command.deprecated_at.as_deref())
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create skill artifact", error))?;
    Ok(id)
}

async fn update_artifact(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateAdminSkillArtifactCommand,
) -> DomainResult<bool> {
    let artifact_changed = command.artifact.is_some();
    let artifact = command.artifact.as_ref().and_then(|value| value.as_ref());
    let artifact_media_resource_id = artifact.map(media_resource_stable_id);
    let artifact_object_blob_id = artifact.and_then(media_resource_object_blob_id);
    let artifact_resource_snapshot = artifact.map(serde_json::Value::to_string);
    let result = sqlx::query(
        r#"
        UPDATE ai_skill_artifact
        SET artifact_type = COALESCE($1, artifact_type),
            version = COALESCE($2, version),
            platform_type = COALESCE($3, platform_type),
            os_name = COALESCE($4, os_name),
            artifact_ref = CASE WHEN $5 THEN $6 ELSE artifact_ref END,
            artifact_media_resource_id = CASE WHEN $7 THEN $8 ELSE artifact_media_resource_id END,
            artifact_object_blob_id = CASE WHEN $9 THEN $10 ELSE artifact_object_blob_id END,
            artifact_resource_snapshot = CASE WHEN $11 THEN $12::jsonb ELSE artifact_resource_snapshot END,
            artifact_size_bytes = COALESCE($13, artifact_size_bytes),
            runtime = CASE WHEN $14 THEN $15 ELSE runtime END,
            license_name = CASE WHEN $16 THEN $17 ELSE license_name END,
            frameworks = COALESCE($18::jsonb, frameworks),
            checksum_hash = CASE WHEN $19 THEN $20 ELSE checksum_hash END,
            release_notes = CASE WHEN $21 THEN $22 ELSE release_notes END,
            status = COALESCE($23, status),
            published_at = CASE WHEN $24 THEN $25::timestamptz ELSE published_at END,
            deprecated_at = CASE WHEN $26 THEN $27::timestamptz ELSE deprecated_at END,
            updated_at = $28::timestamptz
        WHERE id = $29
          AND tenant_id = $30
          AND organization_id = $31
          AND target_type = $32
          AND target_id = $33
        "#,
    )
    .bind(command.artifact_type)
    .bind(command.version.as_deref())
    .bind(command.platform_type.as_deref())
    .bind(command.os_name.as_deref())
    .bind(command.artifact_ref.is_some())
    .bind(
        command
            .artifact_ref
            .as_ref()
            .and_then(|value| value.as_deref()),
    )
    .bind(artifact_changed)
    .bind(artifact_media_resource_id)
    .bind(artifact_changed)
    .bind(artifact_object_blob_id)
    .bind(artifact_changed)
    .bind(artifact_resource_snapshot)
    .bind(command.artifact_size_bytes)
    .bind(command.runtime.is_some())
    .bind(command.runtime.as_ref().and_then(|value| value.as_deref()))
    .bind(command.license_name.is_some())
    .bind(
        command
            .license_name
            .as_ref()
            .and_then(|value| value.as_deref()),
    )
    .bind(
        command
            .frameworks
            .as_ref()
            .map(|values| json_text_array(values))
            .transpose()?,
    )
    .bind(command.checksum_hash.is_some())
    .bind(
        command
            .checksum_hash
            .as_ref()
            .and_then(|value| value.as_deref()),
    )
    .bind(command.release_notes.is_some())
    .bind(
        command
            .release_notes
            .as_ref()
            .and_then(|value| value.as_deref()),
    )
    .bind(command.status)
    .bind(command.published_at.is_some())
    .bind(
        command
            .published_at
            .as_ref()
            .and_then(|value| value.as_deref()),
    )
    .bind(command.deprecated_at.is_some())
    .bind(
        command
            .deprecated_at
            .as_ref()
            .and_then(|value| value.as_deref()),
    )
    .bind(&command.requested_at)
    .bind(command.artifact_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(SKILL_TARGET_TYPE)
    .bind(command.skill_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update skill artifact", error))?;
    Ok(result.rows_affected() > 0)
}

async fn delete_artifact(
    tx: &mut Transaction<'_, Postgres>,
    command: &DeleteAdminSkillArtifactCommand,
) -> DomainResult<bool> {
    sqlx::query(
        r#"
        UPDATE ai_skill_asset
        SET artifact_id = NULL,
            updated_at = $1::timestamptz,
            version = COALESCE(version, 0) + 1
        WHERE tenant_id = $2
          AND organization_id = $3
          AND target_type = $4
          AND target_id = $5
          AND artifact_id = $6
        "#,
    )
    .bind(&command.requested_at)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(SKILL_TARGET_TYPE)
    .bind(command.skill_id)
    .bind(command.artifact_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to clear skill artifact asset links", error))?;

    let result = sqlx::query(
        r#"
        DELETE FROM ai_skill_artifact
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
          AND target_type = $4
          AND target_id = $5
        "#,
    )
    .bind(command.artifact_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(SKILL_TARGET_TYPE)
    .bind(command.skill_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete skill artifact", error))?;
    Ok(result.rows_affected() > 0)
}

async fn delete_skill_catalog_records(
    tx: &mut Transaction<'_, Postgres>,
    tenant_id: i64,
    organization_id: i64,
    skill_id: i64,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        DELETE FROM ai_skill_asset
        WHERE tenant_id = $1
          AND organization_id = $2
          AND target_type = $3
          AND target_id = $4
        "#,
    )
    .bind(tenant_id)
    .bind(organization_id)
    .bind(SKILL_TARGET_TYPE)
    .bind(skill_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete skill catalog assets", error))?;

    sqlx::query(
        r#"
        DELETE FROM ai_skill_artifact
        WHERE tenant_id = $1
          AND organization_id = $2
          AND target_type = $3
          AND target_id = $4
        "#,
    )
    .bind(tenant_id)
    .bind(organization_id)
    .bind(SKILL_TARGET_TYPE)
    .bind(skill_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete skill catalog artifacts", error))?;
    Ok(())
}

async fn load_artifact_by_id(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    skill_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminSkillArtifactItem>> {
    let row = sqlx::query(
        r#"
        SELECT id, uuid, tenant_id, organization_id, COALESCE(status, 1) AS status,
               COALESCE(target_type, 0) AS target_type, COALESCE(target_id, 0) AS target_id,
               COALESCE(artifact_type, 0) AS artifact_type, COALESCE(version, '') AS version,
               COALESCE(platform_type, '') AS platform_type, COALESCE(os_name, '') AS os_name,
               artifact_ref, artifact_resource_snapshot,
               COALESCE(artifact_size_bytes, 0) AS artifact_size_bytes,
               runtime, COALESCE(frameworks::text, '[]') AS frameworks,
               license_name, checksum_hash, release_notes,
               CAST(published_at AS TEXT) AS published_at,
               CAST(deprecated_at AS TEXT) AS deprecated_at,
               CAST(created_at AS TEXT) AS created_at,
               CAST(updated_at AS TEXT) AS updated_at
        FROM ai_skill_artifact
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
          AND target_type = $4
          AND target_id = $5
        LIMIT 1
        "#,
    )
    .bind(id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(SKILL_TARGET_TYPE)
    .bind(skill_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load skill artifact", error))?;
    row.map(artifact_from_row).transpose()
}

async fn ensure_category_exists(
    tx: &mut Transaction<'_, Postgres>,
    tenant_id: i64,
    organization_id: i64,
    category_id: Option<i64>,
) -> DomainResult<()> {
    let Some(category_id) = category_id else {
        return Ok(());
    };
    let exists: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM c_category
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
          AND category_type IN ($4, $5)
          AND COALESCE(status, 1) >= 0
        "#,
    )
    .bind(category_id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(SKILL_CATEGORY_TYPE_MARKET)
    .bind(SKILL_CATEGORY_TYPE_COLLECTION)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to validate skill category", error))?;
    if exists == 0 {
        Err(DomainError::not_found("skill category was not found"))
    } else {
        Ok(())
    }
}

async fn ensure_category_delete_allowed(
    tx: &mut Transaction<'_, Postgres>,
    command: &DeleteAdminSkillCategoryCommand,
) -> DomainResult<()> {
    let child_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM c_category
        WHERE tenant_id = $1
          AND organization_id = $2
          AND parent_id = $3
          AND category_type IN ($4, $5)
          AND COALESCE(status, 1) >= 0
        "#,
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.category_id)
    .bind(SKILL_CATEGORY_TYPE_MARKET)
    .bind(SKILL_CATEGORY_TYPE_COLLECTION)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to validate child skill categories", error))?;
    if child_count > 0 {
        return Err(DomainError::conflict("skill category has child categories"));
    }

    let package_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ai_agent_skill_package
        WHERE tenant_id = $1
          AND organization_id = $2
          AND category_id = $3
        "#,
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.category_id)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to validate skill package category links", error))?;
    if package_count > 0 {
        return Err(DomainError::conflict("skill category is still referenced"));
    }

    let skill_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ai_agent_skill
        WHERE tenant_id = $1
          AND organization_id = $2
          AND category_id = $3
        "#,
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.category_id)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to validate skill category links", error))?;
    if skill_count > 0 {
        return Err(DomainError::conflict("skill category is still referenced"));
    }
    Ok(())
}

async fn ensure_package_exists(
    tx: &mut Transaction<'_, Postgres>,
    tenant_id: i64,
    organization_id: i64,
    package_id: Option<i64>,
) -> DomainResult<()> {
    let Some(package_id) = package_id else {
        return Ok(());
    };
    let exists: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ai_agent_skill_package
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
        "#,
    )
    .bind(package_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to validate skill package", error))?;
    if exists == 0 {
        Err(DomainError::not_found("skill package was not found"))
    } else {
        Ok(())
    }
}

async fn ensure_skill_exists(
    tx: &mut Transaction<'_, Postgres>,
    tenant_id: i64,
    organization_id: i64,
    skill_id: i64,
) -> DomainResult<()> {
    let exists: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ai_agent_skill
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
        "#,
    )
    .bind(skill_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to validate skill", error))?;
    if exists == 0 {
        Err(DomainError::not_found("skill was not found"))
    } else {
        Ok(())
    }
}

async fn ensure_visible_skill_exists(
    tx: &mut Transaction<'_, Postgres>,
    tenant_id: i64,
    organization_id: i64,
    skill_id: i64,
) -> DomainResult<()> {
    let exists: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ai_agent_skill
        WHERE id = $1
          AND (
              (tenant_id = $2 AND organization_id = $3)
              OR (tenant_id = $4 AND organization_id = $5)
          )
        "#,
    )
    .bind(skill_id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(PUBLIC_SKILLS_TENANT_ID)
    .bind(PUBLIC_SKILLS_ORGANIZATION_ID)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to validate visible skill", error))?;
    if exists == 0 {
        Err(DomainError::not_found("skill was not found"))
    } else {
        Ok(())
    }
}

async fn ensure_skill_artifact_exists(
    tx: &mut Transaction<'_, Postgres>,
    tenant_id: i64,
    organization_id: i64,
    skill_id: i64,
    artifact_id: Option<i64>,
) -> DomainResult<()> {
    let Some(artifact_id) = artifact_id else {
        return Ok(());
    };
    let exists: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ai_skill_artifact
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
          AND target_type = $4
          AND target_id = $5
        "#,
    )
    .bind(artifact_id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(SKILL_TARGET_TYPE)
    .bind(skill_id)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to validate skill artifact", error))?;
    if exists == 0 {
        Err(DomainError::not_found("skill artifact was not found"))
    } else {
        Ok(())
    }
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
    .bind(SKILL_TARGET_TYPE)
    .bind(target_id)
    .bind(request_id)
    .bind(operator_id)
    .bind(operator_type)
    .bind(change_summary.to_string())
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to write skill audit log", error))?;
    Ok(())
}

fn category_from_row(row: sqlx::postgres::PgRow) -> DomainResult<AdminSkillCategoryItem> {
    Ok(AdminSkillCategoryItem {
        id: row.try_get("id").map_err(row_error)?,
        uuid: row.try_get("uuid").map_err(row_error)?,
        tenant_id: row.try_get("tenant_id").map_err(row_error)?,
        organization_id: row.try_get("organization_id").map_err(row_error)?,
        name: row.try_get("name").map_err(row_error)?,
        description: row.try_get("description").ok().flatten(),
        code: row.try_get("code").ok().flatten(),
        icon: optional_media_resource_from_row(&row, "icon_resource_snapshot"),
        sort_weight: integer_cell(&row, "sort_weight") as i32,
        parent_id: row.try_get("parent_id").ok().flatten(),
        path: row.try_get("path").ok().flatten(),
        visible: bool_cell(&row, "visible"),
        status: integer_cell(&row, "status") as i32,
        category_type: skill_category_type_code(
            row.try_get::<String, _>("category_type")
                .map_err(row_error)?
                .as_str(),
        ),
    })
}

fn package_from_row(row: sqlx::postgres::PgRow) -> DomainResult<AdminSkillPackageItem> {
    Ok(AdminSkillPackageItem {
        id: row.try_get("id").map_err(row_error)?,
        uuid: row.try_get("uuid").map_err(row_error)?,
        tenant_id: row.try_get("tenant_id").map_err(row_error)?,
        organization_id: row.try_get("organization_id").map_err(row_error)?,
        user_id: row.try_get("user_id").ok().flatten(),
        package_key: row.try_get("package_key").map_err(row_error)?,
        name: row.try_get("name").map_err(row_error)?,
        summary: row.try_get("summary").ok().flatten(),
        description: row.try_get("description").ok().flatten(),
        icon: optional_media_resource_from_row(&row, "icon_resource_snapshot"),
        cover: optional_media_resource_from_row(&row, "cover_resource_snapshot"),
        category_id: row.try_get("category_id").ok().flatten(),
        enabled: bool_cell(&row, "enabled"),
        featured: bool_cell(&row, "featured"),
        sort_weight: integer_cell(&row, "sort_weight") as i32,
        tags: parse_string_array(
            row.try_get::<String, _>("tags")
                .map_err(row_error)?
                .as_str(),
        )?,
        latest_published_at: row.try_get("latest_published_at").ok().flatten(),
        created_at: row.try_get("created_at").unwrap_or_default(),
        updated_at: row.try_get("updated_at").unwrap_or_default(),
    })
}

fn skill_from_row(row: sqlx::postgres::PgRow) -> DomainResult<AdminSkillItem> {
    Ok(AdminSkillItem {
        id: row.try_get("id").map_err(row_error)?,
        uuid: row.try_get("uuid").map_err(row_error)?,
        tenant_id: row.try_get("tenant_id").map_err(row_error)?,
        organization_id: row.try_get("organization_id").map_err(row_error)?,
        user_id: row.try_get("user_id").map_err(row_error)?,
        skill_key: row.try_get("skill_key").map_err(row_error)?,
        name: row.try_get("name").map_err(row_error)?,
        summary: row.try_get("summary").ok().flatten(),
        description: row.try_get("description").ok().flatten(),
        icon: optional_media_resource_from_row(&row, "icon_resource_snapshot"),
        cover: optional_media_resource_from_row(&row, "cover_resource_snapshot"),
        category_id: row.try_get("category_id").ok().flatten(),
        package_id: row.try_get("package_id").ok().flatten(),
        provider: row.try_get("provider").ok().flatten(),
        version: row.try_get("version").ok().flatten(),
        version_name: row.try_get("version_name").ok().flatten(),
        runtime: row.try_get("runtime").ok().flatten(),
        entrypoint: row.try_get("entrypoint").ok().flatten(),
        manifest_url: row.try_get("manifest_url").ok().flatten(),
        repository_url: row.try_get("repository_url").ok().flatten(),
        homepage_url: row.try_get("homepage_url").ok().flatten(),
        documentation_url: row.try_get("documentation_url").ok().flatten(),
        license_name: row.try_get("license_name").ok().flatten(),
        source_type: row.try_get("source_type").map_err(row_error)?,
        market_status: row.try_get("market_status").map_err(row_error)?,
        visibility: row.try_get("visibility").map_err(row_error)?,
        review_status: row.try_get("review_status").map_err(row_error)?,
        review_comment: row.try_get("review_comment").ok().flatten(),
        reviewed_by: row.try_get("reviewed_by").ok().flatten(),
        reviewed_at: row.try_get("reviewed_at").ok().flatten(),
        builtin: bool_cell(&row, "builtin"),
        is_builtin: bool_cell(&row, "is_builtin"),
        enabled: bool_cell(&row, "enabled"),
        featured: bool_cell(&row, "featured"),
        recommend_weight: integer_cell(&row, "recommend_weight") as i32,
        price: row.try_get("price").ok().flatten(),
        currency: row.try_get("currency").map_err(row_error)?,
        install_count: integer_cell(&row, "install_count"),
        rating_avg: row.try_get("rating_avg").map_err(row_error)?,
        rating_count: integer_cell(&row, "rating_count"),
        tags: parse_string_array(
            row.try_get::<String, _>("tags")
                .map_err(row_error)?
                .as_str(),
        )?,
        capabilities: parse_string_array(
            row.try_get::<String, _>("capabilities")
                .map_err(row_error)?
                .as_str(),
        )?,
        config_schema: parse_object(
            row.try_get::<String, _>("config_schema")
                .map_err(row_error)?
                .as_str(),
        )?,
        default_config: parse_object(
            row.try_get::<String, _>("default_config")
                .map_err(row_error)?
                .as_str(),
        )?,
        latest_published_at: row.try_get("latest_published_at").ok().flatten(),
        created_at: row.try_get("created_at").unwrap_or_default(),
        updated_at: row.try_get("updated_at").unwrap_or_default(),
        deleted_at: None,
    })
}

fn asset_from_row(row: sqlx::postgres::PgRow) -> DomainResult<AdminSkillAssetItem> {
    let asset_type = integer_cell(&row, "asset_type") as i32;
    Ok(AdminSkillAssetItem {
        id: row.try_get("id").map_err(row_error)?,
        uuid: row.try_get("uuid").map_err(row_error)?,
        tenant_id: row.try_get("tenant_id").map_err(row_error)?,
        organization_id: row.try_get("organization_id").map_err(row_error)?,
        status: integer_cell(&row, "status") as i32,
        target_type: integer_cell(&row, "target_type") as i32,
        target_id: integer_cell(&row, "target_id"),
        artifact_id: row.try_get("artifact_id").ok().flatten(),
        asset_type,
        asset: media_resource_from_row(
            &row,
            "asset_resource_snapshot",
            skill_asset_kind(asset_type),
        ),
        thumbnail: optional_media_resource_from_row(&row, "thumbnail_resource_snapshot"),
        title: row.try_get("title").ok().flatten(),
        alt_text: row.try_get("alt_text").ok().flatten(),
        mime_type: row.try_get("mime_type").ok().flatten(),
        width: row.try_get("width").ok().flatten(),
        height: row.try_get("height").ok().flatten(),
        duration_seconds: row.try_get("duration_seconds").ok().flatten(),
        file_size: row.try_get("file_size").ok().flatten(),
        sort_order: integer_cell(&row, "sort_order") as i32,
        published_at: row.try_get("published_at").ok().flatten(),
        created_at: row.try_get("created_at").unwrap_or_default(),
        updated_at: row.try_get("updated_at").unwrap_or_default(),
    })
}

fn artifact_from_row(row: sqlx::postgres::PgRow) -> DomainResult<AdminSkillArtifactItem> {
    Ok(AdminSkillArtifactItem {
        id: row.try_get("id").map_err(row_error)?,
        uuid: row.try_get("uuid").map_err(row_error)?,
        tenant_id: row.try_get("tenant_id").map_err(row_error)?,
        organization_id: row.try_get("organization_id").map_err(row_error)?,
        status: integer_cell(&row, "status") as i32,
        target_type: integer_cell(&row, "target_type") as i32,
        target_id: integer_cell(&row, "target_id"),
        artifact_type: integer_cell(&row, "artifact_type") as i32,
        version: row.try_get("version").map_err(row_error)?,
        platform_type: row.try_get("platform_type").map_err(row_error)?,
        os_name: row.try_get("os_name").map_err(row_error)?,
        artifact_ref: row.try_get("artifact_ref").ok().flatten(),
        artifact: optional_media_resource_from_row(&row, "artifact_resource_snapshot"),
        artifact_size_bytes: integer_cell(&row, "artifact_size_bytes"),
        runtime: row.try_get("runtime").ok().flatten(),
        frameworks: parse_string_array(
            row.try_get::<String, _>("frameworks")
                .map_err(row_error)?
                .as_str(),
        )?,
        license_name: row.try_get("license_name").ok().flatten(),
        checksum_hash: row.try_get("checksum_hash").ok().flatten(),
        release_notes: row.try_get("release_notes").ok().flatten(),
        published_at: row.try_get("published_at").ok().flatten(),
        deprecated_at: row.try_get("deprecated_at").ok().flatten(),
        created_at: row.try_get("created_at").unwrap_or_default(),
        updated_at: row.try_get("updated_at").unwrap_or_default(),
    })
}

fn parse_string_array(value: &str) -> DomainResult<Vec<String>> {
    if value.trim().is_empty() {
        return Ok(Vec::new());
    }
    serde_json::from_str::<Vec<String>>(value)
        .map(|mut values| {
            values.retain(|value| !value.trim().is_empty());
            values
        })
        .map_err(|error| DomainError::new(format!("invalid skill string array json: {error}")))
}

fn parse_object(value: &str) -> DomainResult<serde_json::Value> {
    if value.trim().is_empty() {
        return Ok(serde_json::json!({}));
    }
    let value: serde_json::Value = serde_json::from_str(value)
        .map_err(|error| DomainError::new(format!("invalid skill object json: {error}")))?;
    if value.is_object() {
        Ok(value)
    } else {
        Ok(serde_json::json!({}))
    }
}

fn media_resource_from_row(
    row: &sqlx::postgres::PgRow,
    column: &str,
    kind: &str,
) -> serde_json::Value {
    let raw = row
        .try_get::<Option<serde_json::Value>, _>(column)
        .ok()
        .flatten();
    parse_media_resource(raw, kind)
}

fn optional_media_resource_from_row(
    row: &sqlx::postgres::PgRow,
    column: &str,
) -> Option<serde_json::Value> {
    let raw = row
        .try_get::<Option<serde_json::Value>, _>(column)
        .ok()
        .flatten()?;
    Some(parse_media_resource(Some(raw), "image"))
}

fn parse_media_resource(raw: Option<serde_json::Value>, kind: &str) -> serde_json::Value {
    match raw {
        Some(value) if value.is_object() => value,
        _ => empty_media_resource(kind),
    }
}

fn skill_asset_kind(asset_type: i32) -> &'static str {
    match asset_type {
        1 => "image",
        2 => "video",
        3 => "document",
        _ => "other",
    }
}

fn json_text_array(values: &[String]) -> DomainResult<String> {
    serde_json::to_string(values).map_err(|error| DomainError::new(error.to_string()))
}

async fn next_assigned_id(
    tx: &mut Transaction<'_, Postgres>,
    table_name: &'static str,
    namespace: &'static str,
    entity_uuid: &str,
) -> DomainResult<i64> {
    for _ in 0..MAX_RUNTIME_ID_ATTEMPTS {
        let id = next_admin_skill_id(namespace)?;
        if !assigned_id_exists(tx, table_name, id).await? {
            return Ok(id);
        }
    }
    Err(DomainError::conflict(format!(
        "failed to allocate snowflake id for {namespace}: {entity_uuid}"
    )))
}

async fn assigned_id_exists(
    tx: &mut Transaction<'_, Postgres>,
    table_name: &'static str,
    id: i64,
) -> DomainResult<bool> {
    let count: i64 = match table_name {
        "c_category" => sqlx::query_scalar("SELECT COUNT(1) FROM c_category WHERE id = $1")
            .bind(id)
            .fetch_one(&mut **tx)
            .await
            .map_err(|error| store_error("failed to check category assigned id", error))?,
        "ai_agent_skill" => {
            sqlx::query_scalar("SELECT COUNT(1) FROM ai_agent_skill WHERE id = $1")
                .bind(id)
                .fetch_one(&mut **tx)
                .await
                .map_err(|error| store_error("failed to check skill assigned id", error))?
        }
        "ai_agent_skill_package" => {
            sqlx::query_scalar("SELECT COUNT(1) FROM ai_agent_skill_package WHERE id = $1")
                .bind(id)
                .fetch_one(&mut **tx)
                .await
                .map_err(|error| store_error("failed to check skill package assigned id", error))?
        }
        "ai_skill_asset" => {
            sqlx::query_scalar("SELECT COUNT(1) FROM ai_skill_asset WHERE id = $1")
                .bind(id)
                .fetch_one(&mut **tx)
                .await
                .map_err(|error| store_error("failed to check skill asset assigned id", error))?
        }
        "ai_skill_artifact" => {
            sqlx::query_scalar("SELECT COUNT(1) FROM ai_skill_artifact WHERE id = $1")
                .bind(id)
                .fetch_one(&mut **tx)
                .await
                .map_err(|error| store_error("failed to check skill artifact assigned id", error))?
        }
        _ => {
            return Err(DomainError::new(format!(
                "unsupported assigned-id table: {table_name}"
            )));
        }
    };
    Ok(count > 0)
}

fn bool_cell(row: &sqlx::postgres::PgRow, column: &str) -> bool {
    row.try_get::<bool, _>(column)
        .ok()
        .or_else(|| row.try_get::<i64, _>(column).ok().map(|value| value != 0))
        .or_else(|| row.try_get::<i32, _>(column).ok().map(|value| value != 0))
        .unwrap_or(false)
}

fn integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> i64 {
    row.try_get::<i64, _>(column)
        .ok()
        .or_else(|| row.try_get::<i32, _>(column).ok().map(i64::from))
        .unwrap_or(0)
}

fn row_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    if let sqlx::Error::Database(database_error) = &error {
        if database_error.is_unique_violation() {
            return DomainError::conflict(format!("{context}: skill record already exists"));
        }
    }
    DomainError::new(format!("{context}: {error}"))
}
