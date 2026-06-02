use sha2::{Digest, Sha256};
use sqlx::{Row, Sqlite, SqlitePool, Transaction};

use crate::domain::{DomainError, DomainResult};
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
const PUBLIC_SKILLS_TENANT_ID: i64 = 0;
const PUBLIC_SKILLS_ORGANIZATION_ID: i64 = 0;
const ASSIGNED_ID_FLOOR: i64 = 1_000_000_000_000;
const ASSIGNED_ID_RANGE: u64 = 8_000_000_000_000;
const MAX_ASSIGNED_ID_ATTEMPTS: u8 = 16;

#[derive(Debug, Clone)]
pub struct SqliteAdminSkillStore {
    pool: SqlitePool,
}

impl SqliteAdminSkillStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl AdminSkillStore for SqliteAdminSkillStore {
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
                    "nameChanged": command.name.is_some(),
                    "marketEditableChanged": true
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
                id,
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
                command.subject.tenant_id,
                command.subject.organization_id,
                command.skill_id,
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
                command.asset_id,
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
                command.subject.tenant_id,
                command.subject.organization_id,
                command.skill_id,
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
                    command.asset_id,
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
                id,
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
                command.subject.tenant_id,
                command.subject.organization_id,
                command.skill_id,
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
                command.artifact_id,
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
                command.subject.tenant_id,
                command.subject.organization_id,
                command.skill_id,
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
                    command.artifact_id,
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
    pool: &SqlitePool,
    query: ListAdminSkillCategoriesQuery,
) -> DomainResult<Vec<AdminSkillCategoryItem>> {
    let rows = sqlx::query(
        r#"
        SELECT id, uuid, tenant_id, organization_id, name, description, code,
               CAST(icon_resource_snapshot AS TEXT) AS icon_resource_snapshot,
               COALESCE(sort_weight, 0) AS sort_weight,
               parent_id, path, COALESCE(visible, 1) AS visible,
               COALESCE(status, 1) AS status, type AS category_type
        FROM plus_category
        WHERE (
              (tenant_id = ? AND organization_id = ?)
              OR (tenant_id = ? AND organization_id = ?)
          )
          AND type IN (?, ?)
          AND COALESCE(status, 1) >= 0
        ORDER BY
            CASE
                WHEN tenant_id = ? AND organization_id = ? THEN 0
                WHEN tenant_id = ? AND organization_id = ? THEN 1
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
    .bind(CATEGORY_TYPE_SKILLS)
    .bind(CATEGORY_TYPE_SKILLS_COLLECTION)
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(PUBLIC_SKILLS_TENANT_ID)
    .bind(PUBLIC_SKILLS_ORGANIZATION_ID)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list skill categories", error))?;
    rows.into_iter().map(category_from_row).collect()
}

async fn insert_category(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminSkillCategoryCommand,
) -> DomainResult<i64> {
    let id = next_assigned_id(
        tx,
        "plus_category",
        "admin-skill-category",
        &command.category_uuid,
    )
    .await?;
    let icon = command.icon.as_ref();
    let icon_media_resource_id = icon.map(media_resource_stable_id);
    let icon_object_blob_id = icon.and_then(media_resource_object_blob_id);
    let icon_resource_snapshot = icon
        .map(serde_json::to_string)
        .transpose()
        .map_err(|error| DomainError::new(error.to_string()))?;
    sqlx::query(
        r#"
        INSERT INTO plus_category
            (id, uuid, tenant_id, organization_id, data_scope, name, description, type, code,
             icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot,
             sort_weight, parent_id, path, visible, status, created_at, updated_at)
        VALUES
            (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#,
    )
    .bind(id)
    .bind(&command.category_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.name)
    .bind(command.description.as_deref())
    .bind(command.category_type)
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
    tx: &mut Transaction<'_, Sqlite>,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminSkillCategoryItem>> {
    let row = sqlx::query(
        r#"
        SELECT id, uuid, tenant_id, organization_id, name, description, code,
               CAST(icon_resource_snapshot AS TEXT) AS icon_resource_snapshot,
               COALESCE(sort_weight, 0) AS sort_weight,
               parent_id, path, COALESCE(visible, 1) AS visible,
               COALESCE(status, 1) AS status, type AS category_type
        FROM plus_category
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND type IN (?, ?)
        LIMIT 1
        "#,
    )
    .bind(id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(CATEGORY_TYPE_SKILLS)
    .bind(CATEGORY_TYPE_SKILLS_COLLECTION)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load skill category", error))?;
    row.map(category_from_row).transpose()
}

async fn update_category(
    tx: &mut Transaction<'_, Sqlite>,
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
    let icon_resource_snapshot = icon
        .map(serde_json::to_string)
        .transpose()
        .map_err(|error| DomainError::new(error.to_string()))?;
    let result = sqlx::query(
        r#"
        UPDATE plus_category
        SET name = COALESCE(?, name),
            description = CASE WHEN ? THEN ? ELSE description END,
            code = CASE WHEN ? THEN ? ELSE code END,
            icon_media_resource_id = CASE WHEN ? THEN ? ELSE icon_media_resource_id END,
            icon_object_blob_id = CASE WHEN ? THEN ? ELSE icon_object_blob_id END,
            icon_resource_snapshot = CASE WHEN ? THEN ? ELSE icon_resource_snapshot END,
            sort_weight = COALESCE(?, sort_weight),
            parent_id = CASE WHEN ? THEN ? ELSE parent_id END,
            path = CASE WHEN ? THEN ? ELSE path END,
            visible = COALESCE(?, visible),
            status = COALESCE(?, status),
            type = COALESCE(?, type),
            updated_at = ?,
            v = COALESCE(v, 0) + 1
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND type IN (?, ?)
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
    .bind(command.category_type)
    .bind(&command.requested_at)
    .bind(command.category_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(CATEGORY_TYPE_SKILLS)
    .bind(CATEGORY_TYPE_SKILLS_COLLECTION)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update skill category", error))?;
    Ok(result.rows_affected() > 0)
}

async fn delete_category(
    tx: &mut Transaction<'_, Sqlite>,
    command: &DeleteAdminSkillCategoryCommand,
) -> DomainResult<bool> {
    ensure_category_delete_allowed(tx, command).await?;
    let result = sqlx::query(
        r#"
        UPDATE plus_category
        SET status = -1,
            updated_at = ?,
            v = COALESCE(v, 0) + 1
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND type IN (?, ?)
          AND COALESCE(status, 1) >= 0
        "#,
    )
    .bind(&command.requested_at)
    .bind(command.category_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(CATEGORY_TYPE_SKILLS)
    .bind(CATEGORY_TYPE_SKILLS_COLLECTION)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete skill category", error))?;
    Ok(result.rows_affected() > 0)
}

async fn list_packages(
    pool: &SqlitePool,
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
               summary, description,
               CAST(icon_resource_snapshot AS TEXT) AS icon_resource_snapshot,
               CAST(cover_resource_snapshot AS TEXT) AS cover_resource_snapshot,
               category_id,
               COALESCE(enabled, 0) AS enabled,
               COALESCE(featured, 0) AS featured,
               COALESCE(sort_weight, 0) AS sort_weight,
               COALESCE(CAST(tags AS TEXT), '[]') AS tags,
               CAST(latest_published_at AS TEXT) AS latest_published_at,
               CAST(created_at AS TEXT) AS created_at,
               CAST(updated_at AS TEXT) AS updated_at
        FROM plus_agent_skill_package
        WHERE (
              (tenant_id = ? AND organization_id = ?)
              OR (tenant_id = ? AND organization_id = ?)
          )
          AND (? IS NULL OR name LIKE ? ESCAPE '\' OR package_key LIKE ? ESCAPE '\')
          AND (? IS NULL OR enabled = ?)
          AND (? IS NULL OR category_id = ?)
        ORDER BY
            CASE
                WHEN tenant_id = ? AND organization_id = ? THEN 0
                WHEN tenant_id = ? AND organization_id = ? THEN 1
                ELSE 2
            END,
            COALESCE(featured, 0) DESC,
            COALESCE(sort_weight, 0) DESC,
            id DESC
        LIMIT ? OFFSET ?
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
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(PUBLIC_SKILLS_TENANT_ID)
    .bind(PUBLIC_SKILLS_ORGANIZATION_ID)
    .bind(page_size)
    .bind(offset)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list skill packages", error))?;
    rows.into_iter().map(package_from_row).collect()
}

async fn insert_package(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminSkillPackageCommand,
) -> DomainResult<i64> {
    let id = next_assigned_id(
        tx,
        "plus_agent_skill_package",
        "admin-agent-skill-package",
        &command.package_uuid,
    )
    .await?;
    let cover = command.cover.as_ref();
    let cover_media_resource_id = cover.map(media_resource_stable_id);
    let cover_object_blob_id = cover.and_then(media_resource_object_blob_id);
    let cover_resource_snapshot = cover
        .map(serde_json::to_string)
        .transpose()
        .map_err(|error| DomainError::new(error.to_string()))?;
    let icon = command.icon.as_ref();
    let icon_media_resource_id = icon.map(media_resource_stable_id);
    let icon_object_blob_id = icon.and_then(media_resource_object_blob_id);
    let icon_resource_snapshot = icon
        .map(serde_json::to_string)
        .transpose()
        .map_err(|error| DomainError::new(error.to_string()))?;
    sqlx::query(
        r#"
        INSERT INTO plus_agent_skill_package
            (id, uuid, tenant_id, organization_id, data_scope, user_id, package_key, name,
             summary, description, icon_media_resource_id, icon_object_blob_id,
             icon_resource_snapshot, cover_media_resource_id, cover_object_blob_id,
             cover_resource_snapshot, category_id, enabled, featured,
             sort_weight, tags, created_at, updated_at)
        VALUES
            (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    tx: &mut Transaction<'_, Sqlite>,
    command: &UpdateAdminSkillPackageCommand,
) -> DomainResult<bool> {
    let cover_changed = command.cover.is_some();
    let cover = command.cover.as_ref().and_then(|value| value.as_ref());
    let cover_media_resource_id = cover.map(media_resource_stable_id);
    let cover_object_blob_id = cover.and_then(media_resource_object_blob_id);
    let cover_resource_snapshot = cover
        .map(serde_json::to_string)
        .transpose()
        .map_err(|error| DomainError::new(error.to_string()))?;
    let icon_changed = command.icon.is_some();
    let icon = command.icon.as_ref().and_then(|value| value.as_ref());
    let icon_media_resource_id = icon.map(media_resource_stable_id);
    let icon_object_blob_id = icon.and_then(media_resource_object_blob_id);
    let icon_resource_snapshot = icon
        .map(serde_json::to_string)
        .transpose()
        .map_err(|error| DomainError::new(error.to_string()))?;
    let result = sqlx::query(
        r#"
        UPDATE plus_agent_skill_package
        SET package_key = COALESCE(?, package_key),
            name = COALESCE(?, name),
            summary = COALESCE(?, summary),
            description = CASE WHEN ? THEN ? ELSE description END,
            icon_media_resource_id = CASE WHEN ? THEN ? ELSE icon_media_resource_id END,
            icon_object_blob_id = CASE WHEN ? THEN ? ELSE icon_object_blob_id END,
            icon_resource_snapshot = CASE WHEN ? THEN ? ELSE icon_resource_snapshot END,
            cover_media_resource_id = CASE WHEN ? THEN ? ELSE cover_media_resource_id END,
            cover_object_blob_id = CASE WHEN ? THEN ? ELSE cover_object_blob_id END,
            cover_resource_snapshot = CASE WHEN ? THEN ? ELSE cover_resource_snapshot END,
            category_id = CASE WHEN ? THEN ? ELSE category_id END,
            enabled = COALESCE(?, enabled),
            featured = COALESCE(?, featured),
            sort_weight = COALESCE(?, sort_weight),
            tags = COALESCE(?, tags),
            updated_at = ?,
            v = COALESCE(v, 0) + 1
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
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
    tx: &mut Transaction<'_, Sqlite>,
    command: &SetAdminSkillPackageEnabledCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE plus_agent_skill_package
        SET enabled = ?,
            updated_at = ?,
            v = COALESCE(v, 0) + 1
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
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
    tx: &mut Transaction<'_, Sqlite>,
    command: &DeleteAdminSkillPackageCommand,
) -> DomainResult<bool> {
    sqlx::query(
        r#"
        UPDATE plus_agent_skill
        SET package_id = NULL,
            updated_at = ?,
            v = COALESCE(v, 0) + 1
        WHERE tenant_id = ?
          AND organization_id = ?
          AND package_id = ?
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
        DELETE FROM plus_agent_skill_package
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
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
    tx: &mut Transaction<'_, Sqlite>,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminSkillPackageItem>> {
    let row = sqlx::query(
        r#"
        SELECT id, uuid, tenant_id, organization_id, user_id, package_key, name,
               summary, description,
               CAST(icon_resource_snapshot AS TEXT) AS icon_resource_snapshot,
               CAST(cover_resource_snapshot AS TEXT) AS cover_resource_snapshot,
               category_id,
               COALESCE(enabled, 0) AS enabled,
               COALESCE(featured, 0) AS featured,
               COALESCE(sort_weight, 0) AS sort_weight,
               COALESCE(CAST(tags AS TEXT), '[]') AS tags,
               CAST(latest_published_at AS TEXT) AS latest_published_at,
               CAST(created_at AS TEXT) AS created_at,
               CAST(updated_at AS TEXT) AS updated_at
        FROM plus_agent_skill_package
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
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
    pool: &SqlitePool,
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
            skill_key, name, summary, description,
            CAST(icon_resource_snapshot AS TEXT) AS icon_resource_snapshot,
            CAST(cover_resource_snapshot AS TEXT) AS cover_resource_snapshot,
            category_id, package_id,
            provider, version, version_name, runtime, entrypoint, manifest_url,
            repository_url, homepage_url, documentation_url, license_name, source_type,
            market_status, visibility, review_status, review_comment, reviewed_by,
            CAST(reviewed_at AS TEXT) AS reviewed_at,
            COALESCE(builtin, 0) AS builtin,
            COALESCE(is_builtin, 0) AS is_builtin,
            COALESCE(enabled, 0) AS enabled,
            COALESCE(featured, 0) AS featured,
            COALESCE(recommend_weight, 0) AS recommend_weight,
            CAST(price AS TEXT) AS price,
            COALESCE(currency, 'CNY') AS currency,
            COALESCE(install_count, 0) AS install_count,
            CAST(COALESCE(rating_avg, 0) AS TEXT) AS rating_avg,
            COALESCE(rating_count, 0) AS rating_count,
            COALESCE(CAST(tags AS TEXT), '[]') AS tags,
            COALESCE(CAST(capabilities AS TEXT), '[]') AS capabilities,
            COALESCE(CAST(config_schema AS TEXT), '{}') AS config_schema,
            COALESCE(CAST(default_config AS TEXT), '{}') AS default_config,
            CAST(latest_published_at AS TEXT) AS latest_published_at,
            CAST(created_at AS TEXT) AS created_at,
            CAST(updated_at AS TEXT) AS updated_at
        FROM plus_agent_skill
        WHERE (
              (tenant_id = ? AND organization_id = ?)
              OR (tenant_id = ? AND organization_id = ?)
          )
          AND (? IS NULL OR name LIKE ? ESCAPE '\' OR skill_key LIKE ? ESCAPE '\')
          AND (? IS NULL OR market_status = ?)
          AND (? IS NULL OR review_status = ?)
          AND (? IS NULL OR visibility = ?)
          AND (? IS NULL OR enabled = ?)
          AND (? IS NULL OR category_id = ?)
        ORDER BY
            CASE
                WHEN tenant_id = ? AND organization_id = ? THEN 0
                WHEN tenant_id = ? AND organization_id = ? THEN 1
                ELSE 2
            END,
            COALESCE(featured, 0) DESC,
            COALESCE(recommend_weight, 0) DESC,
            id DESC
        LIMIT ? OFFSET ?
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
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(PUBLIC_SKILLS_TENANT_ID)
    .bind(PUBLIC_SKILLS_ORGANIZATION_ID)
    .bind(page_size)
    .bind(offset)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list skills", error))?;
    rows.into_iter().map(skill_from_row).collect()
}

async fn insert_skill(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminSkillCommand,
) -> DomainResult<i64> {
    let id = next_assigned_id(
        tx,
        "plus_agent_skill",
        "admin-agent-skill",
        &command.skill_uuid,
    )
    .await?;
    let cover = command.cover.as_ref();
    let cover_media_resource_id = cover.map(media_resource_stable_id);
    let cover_object_blob_id = cover.and_then(media_resource_object_blob_id);
    let cover_resource_snapshot = cover
        .map(serde_json::to_string)
        .transpose()
        .map_err(|error| DomainError::new(error.to_string()))?;
    let icon = command.icon.as_ref();
    let icon_media_resource_id = icon.map(media_resource_stable_id);
    let icon_object_blob_id = icon.and_then(media_resource_object_blob_id);
    let icon_resource_snapshot = icon
        .map(serde_json::to_string)
        .transpose()
        .map_err(|error| DomainError::new(error.to_string()))?;
    sqlx::query(
        r#"
        INSERT INTO plus_agent_skill
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
            (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?, ?, ?, ?, ?, ?)
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
    tx: &mut Transaction<'_, Sqlite>,
    command: &UpdateAdminSkillCommand,
) -> DomainResult<bool> {
    let cover_changed = command.cover.is_some();
    let cover = command.cover.as_ref().and_then(|value| value.as_ref());
    let cover_media_resource_id = cover.map(media_resource_stable_id);
    let cover_object_blob_id = cover.and_then(media_resource_object_blob_id);
    let cover_resource_snapshot = cover
        .map(serde_json::to_string)
        .transpose()
        .map_err(|error| DomainError::new(error.to_string()))?;
    let icon_changed = command.icon.is_some();
    let icon = command.icon.as_ref().and_then(|value| value.as_ref());
    let icon_media_resource_id = icon.map(media_resource_stable_id);
    let icon_object_blob_id = icon.and_then(media_resource_object_blob_id);
    let icon_resource_snapshot = icon
        .map(serde_json::to_string)
        .transpose()
        .map_err(|error| DomainError::new(error.to_string()))?;
    let result = sqlx::query(
        r#"
        UPDATE plus_agent_skill
        SET skill_key = COALESCE(?, skill_key),
            name = COALESCE(?, name),
            summary = COALESCE(?, summary),
            description = CASE WHEN ? THEN ? ELSE description END,
            icon_media_resource_id = CASE WHEN ? THEN ? ELSE icon_media_resource_id END,
            icon_object_blob_id = CASE WHEN ? THEN ? ELSE icon_object_blob_id END,
            icon_resource_snapshot = CASE WHEN ? THEN ? ELSE icon_resource_snapshot END,
            cover_media_resource_id = CASE WHEN ? THEN ? ELSE cover_media_resource_id END,
            cover_object_blob_id = CASE WHEN ? THEN ? ELSE cover_object_blob_id END,
            cover_resource_snapshot = CASE WHEN ? THEN ? ELSE cover_resource_snapshot END,
            category_id = CASE WHEN ? THEN ? ELSE category_id END,
            package_id = CASE WHEN ? THEN ? ELSE package_id END,
            provider = CASE WHEN ? THEN ? ELSE provider END,
            version = COALESCE(?, version),
            version_name = CASE WHEN ? THEN ? ELSE version_name END,
            runtime = CASE WHEN ? THEN ? ELSE runtime END,
            entrypoint = CASE WHEN ? THEN ? ELSE entrypoint END,
            manifest_url = CASE WHEN ? THEN ? ELSE manifest_url END,
            repository_url = CASE WHEN ? THEN ? ELSE repository_url END,
            homepage_url = CASE WHEN ? THEN ? ELSE homepage_url END,
            documentation_url = CASE WHEN ? THEN ? ELSE documentation_url END,
            license_name = CASE WHEN ? THEN ? ELSE license_name END,
            source_type = COALESCE(?, source_type),
            visibility = COALESCE(?, visibility),
            builtin = COALESCE(?, builtin),
            is_builtin = COALESCE(?, is_builtin),
            featured = COALESCE(?, featured),
            recommend_weight = COALESCE(?, recommend_weight),
            price = CASE WHEN ? THEN ? ELSE price END,
            currency = COALESCE(?, currency),
            tags = COALESCE(?, tags),
            capabilities = COALESCE(?, capabilities),
            config_schema = COALESCE(?, config_schema),
            default_config = COALESCE(?, default_config),
            updated_at = ?,
            v = COALESCE(v, 0) + 1
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
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
    tx: &mut Transaction<'_, Sqlite>,
    command: &SetAdminSkillEnabledCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE plus_agent_skill
        SET enabled = ?,
            updated_at = ?,
            v = COALESCE(v, 0) + 1
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
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
    tx: &mut Transaction<'_, Sqlite>,
    command: &SetAdminSkillMarketStatusCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE plus_agent_skill
        SET market_status = ?,
            latest_published_at = CASE WHEN ? THEN ? ELSE latest_published_at END,
            updated_at = ?,
            v = COALESCE(v, 0) + 1
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
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
    tx: &mut Transaction<'_, Sqlite>,
    command: &ReviewAdminSkillCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE plus_agent_skill
        SET review_status = ?,
            review_comment = ?,
            reviewed_by = ?,
            reviewed_at = ?,
            updated_at = ?,
            v = COALESCE(v, 0) + 1
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
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
    tx: &mut Transaction<'_, Sqlite>,
    command: &DeleteAdminSkillCommand,
) -> DomainResult<bool> {
    sqlx::query(
        r#"
        DELETE FROM plus_user_agent_skill
        WHERE tenant_id = ?
          AND organization_id = ?
          AND skill_id = ?
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
        DELETE FROM plus_agent_skill
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
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

async fn list_assets(
    tx: &mut Transaction<'_, Sqlite>,
    query: ListAdminSkillAssetsQuery,
) -> DomainResult<Vec<AdminSkillAssetItem>> {
    let sql = asset_select_sql(
        r#"
        WHERE (
              (tenant_id = ? AND organization_id = ?)
              OR (tenant_id = ? AND organization_id = ?)
          )
          AND target_type = ?
          AND target_id = ?
          AND deleted_at IS NULL
        ORDER BY
            CASE
                WHEN tenant_id = ? AND organization_id = ? THEN 0
                WHEN tenant_id = ? AND organization_id = ? THEN 1
                ELSE 2
            END,
            COALESCE(sort_order, 0) ASC,
            id ASC
        "#,
    );
    let rows = sqlx::query(&sql)
        .bind(query.subject.tenant_id)
        .bind(query.subject.organization_id)
        .bind(PUBLIC_SKILLS_TENANT_ID)
        .bind(PUBLIC_SKILLS_ORGANIZATION_ID)
        .bind(SKILL_TARGET_TYPE)
        .bind(query.skill_id)
        .bind(query.subject.tenant_id)
        .bind(query.subject.organization_id)
        .bind(PUBLIC_SKILLS_TENANT_ID)
        .bind(PUBLIC_SKILLS_ORGANIZATION_ID)
        .fetch_all(&mut **tx)
        .await
        .map_err(|error| store_error("failed to list skill assets", error))?;
    rows.into_iter().map(asset_from_row).collect()
}

async fn insert_asset(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminSkillAssetCommand,
) -> DomainResult<i64> {
    let id = next_assigned_id(
        tx,
        "studio_catalog_asset",
        "admin-agent-skill-asset",
        &command.asset_uuid,
    )
    .await?;
    let asset_media_resource_id = media_resource_stable_id(&command.asset);
    let asset_object_blob_id = media_resource_object_blob_id(&command.asset);
    let asset_resource_snapshot = serde_json::to_string(&command.asset)
        .map_err(|error| DomainError::new(error.to_string()))?;
    let thumbnail_media_resource_id = command.thumbnail.as_ref().map(media_resource_stable_id);
    let thumbnail_object_blob_id = command
        .thumbnail
        .as_ref()
        .and_then(media_resource_object_blob_id);
    let thumbnail_resource_snapshot = command
        .thumbnail
        .as_ref()
        .map(serde_json::to_string)
        .transpose()
        .map_err(|error| DomainError::new(error.to_string()))?;
    sqlx::query(
        r#"
        INSERT INTO studio_catalog_asset
            (id, uuid, tenant_id, organization_id, data_scope, status, metadata, target_type,
             target_id, artifact_id, asset_type, asset_media_resource_id, asset_object_blob_id,
             asset_resource_snapshot, thumbnail_media_resource_id, thumbnail_object_blob_id,
             thumbnail_resource_snapshot, title, alt_text, mime_type, width, height,
             duration_seconds, file_size, sort_order, published_at, created_at, updated_at)
        VALUES
            (?, ?, ?, ?, 1, ?, '{}', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    .bind(asset_resource_snapshot)
    .bind(thumbnail_media_resource_id)
    .bind(thumbnail_object_blob_id)
    .bind(thumbnail_resource_snapshot)
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
    tx: &mut Transaction<'_, Sqlite>,
    command: &UpdateAdminSkillAssetCommand,
) -> DomainResult<bool> {
    let asset_media_resource_id = command.asset.as_ref().map(media_resource_stable_id);
    let asset_object_blob_id = command
        .asset
        .as_ref()
        .and_then(media_resource_object_blob_id);
    let asset_resource_snapshot = command
        .asset
        .as_ref()
        .map(serde_json::to_string)
        .transpose()
        .map_err(|error| DomainError::new(error.to_string()))?;
    let thumbnail = command.thumbnail.as_ref().and_then(|value| value.as_ref());
    let thumbnail_media_resource_id = thumbnail.map(media_resource_stable_id);
    let thumbnail_object_blob_id = thumbnail.and_then(media_resource_object_blob_id);
    let thumbnail_resource_snapshot = thumbnail
        .map(serde_json::to_string)
        .transpose()
        .map_err(|error| DomainError::new(error.to_string()))?;
    let result = sqlx::query(
        r#"
        UPDATE studio_catalog_asset
        SET artifact_id = CASE WHEN ? THEN ? ELSE artifact_id END,
            asset_type = COALESCE(?, asset_type),
            asset_media_resource_id = CASE WHEN ? THEN ? ELSE asset_media_resource_id END,
            asset_object_blob_id = CASE WHEN ? THEN ? ELSE asset_object_blob_id END,
            asset_resource_snapshot = CASE WHEN ? THEN ? ELSE asset_resource_snapshot END,
            thumbnail_media_resource_id = CASE WHEN ? THEN ? ELSE thumbnail_media_resource_id END,
            thumbnail_object_blob_id = CASE WHEN ? THEN ? ELSE thumbnail_object_blob_id END,
            thumbnail_resource_snapshot = CASE WHEN ? THEN ? ELSE thumbnail_resource_snapshot END,
            title = CASE WHEN ? THEN ? ELSE title END,
            alt_text = CASE WHEN ? THEN ? ELSE alt_text END,
            mime_type = CASE WHEN ? THEN ? ELSE mime_type END,
            width = CASE WHEN ? THEN ? ELSE width END,
            height = CASE WHEN ? THEN ? ELSE height END,
            duration_seconds = CASE WHEN ? THEN ? ELSE duration_seconds END,
            file_size = CASE WHEN ? THEN ? ELSE file_size END,
            sort_order = COALESCE(?, sort_order),
            status = COALESCE(?, status),
            published_at = CASE WHEN ? THEN ? ELSE published_at END,
            updated_at = ?,
            version = COALESCE(version, 0) + 1
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND target_type = ?
          AND target_id = ?
          AND deleted_at IS NULL
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
    tx: &mut Transaction<'_, Sqlite>,
    command: &DeleteAdminSkillAssetCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        DELETE FROM studio_catalog_asset
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND target_type = ?
          AND target_id = ?
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
    tx: &mut Transaction<'_, Sqlite>,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
    skill_id: i64,
) -> DomainResult<Option<AdminSkillAssetItem>> {
    let sql = asset_select_sql(
        r#"
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND target_type = ?
          AND target_id = ?
          AND deleted_at IS NULL
        LIMIT 1
        "#,
    );
    let row = sqlx::query(&sql)
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
    tx: &mut Transaction<'_, Sqlite>,
    query: ListAdminSkillArtifactsQuery,
) -> DomainResult<Vec<AdminSkillArtifactItem>> {
    let sql = artifact_select_sql(
        r#"
        WHERE (
              (tenant_id = ? AND organization_id = ?)
              OR (tenant_id = ? AND organization_id = ?)
          )
          AND target_type = ?
          AND target_id = ?
          AND deleted_at IS NULL
        ORDER BY
            CASE
                WHEN tenant_id = ? AND organization_id = ? THEN 0
                WHEN tenant_id = ? AND organization_id = ? THEN 1
                ELSE 2
            END,
            published_at DESC,
            id DESC
        "#,
    );
    let rows = sqlx::query(&sql)
        .bind(query.subject.tenant_id)
        .bind(query.subject.organization_id)
        .bind(PUBLIC_SKILLS_TENANT_ID)
        .bind(PUBLIC_SKILLS_ORGANIZATION_ID)
        .bind(SKILL_TARGET_TYPE)
        .bind(query.skill_id)
        .bind(query.subject.tenant_id)
        .bind(query.subject.organization_id)
        .bind(PUBLIC_SKILLS_TENANT_ID)
        .bind(PUBLIC_SKILLS_ORGANIZATION_ID)
        .fetch_all(&mut **tx)
        .await
        .map_err(|error| store_error("failed to list skill artifacts", error))?;
    rows.into_iter().map(artifact_from_row).collect()
}

async fn insert_artifact(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminSkillArtifactCommand,
) -> DomainResult<i64> {
    let id = next_assigned_id(
        tx,
        "studio_catalog_artifact",
        "admin-agent-skill-artifact",
        &command.artifact_uuid,
    )
    .await?;
    let artifact = command.artifact.as_ref();
    let artifact_media_resource_id = artifact.map(media_resource_stable_id);
    let artifact_object_blob_id = artifact.and_then(media_resource_object_blob_id);
    let artifact_resource_snapshot = artifact
        .map(serde_json::to_string)
        .transpose()
        .map_err(|error| DomainError::new(error.to_string()))?;
    sqlx::query(
        r#"
        INSERT INTO studio_catalog_artifact
            (id, uuid, tenant_id, organization_id, data_scope, status, metadata, target_type,
             target_id, artifact_type, version, platform_type, os_name, artifact_ref,
             artifact_media_resource_id, artifact_object_blob_id, artifact_resource_snapshot,
             artifact_size_bytes, runtime, frameworks, license_name, checksum_hash, release_notes,
             published_at, deprecated_at, created_at, updated_at)
        VALUES
            (?, ?, ?, ?, 1, ?, '{}', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    tx: &mut Transaction<'_, Sqlite>,
    command: &UpdateAdminSkillArtifactCommand,
) -> DomainResult<bool> {
    let artifact_changed = command.artifact.is_some();
    let artifact = command.artifact.as_ref().and_then(|value| value.as_ref());
    let artifact_media_resource_id = artifact.map(media_resource_stable_id);
    let artifact_object_blob_id = artifact.and_then(media_resource_object_blob_id);
    let artifact_resource_snapshot = artifact
        .map(serde_json::to_string)
        .transpose()
        .map_err(|error| DomainError::new(error.to_string()))?;
    let result = sqlx::query(
        r#"
        UPDATE studio_catalog_artifact
        SET artifact_type = COALESCE(?, artifact_type),
            version = COALESCE(?, version),
            platform_type = COALESCE(?, platform_type),
            os_name = COALESCE(?, os_name),
            artifact_ref = CASE WHEN ? THEN ? ELSE artifact_ref END,
            artifact_media_resource_id = CASE WHEN ? THEN ? ELSE artifact_media_resource_id END,
            artifact_object_blob_id = CASE WHEN ? THEN ? ELSE artifact_object_blob_id END,
            artifact_resource_snapshot = CASE WHEN ? THEN ? ELSE artifact_resource_snapshot END,
            artifact_size_bytes = COALESCE(?, artifact_size_bytes),
            runtime = CASE WHEN ? THEN ? ELSE runtime END,
            frameworks = COALESCE(?, frameworks),
            license_name = CASE WHEN ? THEN ? ELSE license_name END,
            checksum_hash = CASE WHEN ? THEN ? ELSE checksum_hash END,
            release_notes = CASE WHEN ? THEN ? ELSE release_notes END,
            status = COALESCE(?, status),
            published_at = CASE WHEN ? THEN ? ELSE published_at END,
            deprecated_at = CASE WHEN ? THEN ? ELSE deprecated_at END,
            updated_at = ?
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND target_type = ?
          AND target_id = ?
          AND deleted_at IS NULL
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
    .bind(
        command
            .frameworks
            .as_ref()
            .map(|values| json_text_array(values))
            .transpose()?,
    )
    .bind(command.license_name.is_some())
    .bind(
        command
            .license_name
            .as_ref()
            .and_then(|value| value.as_deref()),
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
    tx: &mut Transaction<'_, Sqlite>,
    command: &DeleteAdminSkillArtifactCommand,
) -> DomainResult<bool> {
    sqlx::query(
        r#"
        DELETE FROM studio_catalog_asset
        WHERE tenant_id = ?
          AND organization_id = ?
          AND artifact_id = ?
        "#,
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.artifact_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete skill artifact assets", error))?;

    let result = sqlx::query(
        r#"
        DELETE FROM studio_catalog_artifact
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND target_type = ?
          AND target_id = ?
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

async fn load_artifact_by_id(
    tx: &mut Transaction<'_, Sqlite>,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
    skill_id: i64,
) -> DomainResult<Option<AdminSkillArtifactItem>> {
    let sql = artifact_select_sql(
        r#"
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND target_type = ?
          AND target_id = ?
          AND deleted_at IS NULL
        LIMIT 1
        "#,
    );
    let row = sqlx::query(&sql)
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

async fn delete_skill_catalog_records(
    tx: &mut Transaction<'_, Sqlite>,
    tenant_id: i64,
    organization_id: i64,
    skill_id: i64,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        DELETE FROM studio_catalog_asset
        WHERE tenant_id = ?
          AND organization_id = ?
          AND target_type = ?
          AND target_id = ?
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
        DELETE FROM studio_catalog_artifact
        WHERE tenant_id = ?
          AND organization_id = ?
          AND target_type = ?
          AND target_id = ?
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

async fn load_skill_by_id(
    tx: &mut Transaction<'_, Sqlite>,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminSkillItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            id, uuid, tenant_id, organization_id, COALESCE(user_id, 0) AS user_id,
            skill_key, name, summary, description,
            CAST(icon_resource_snapshot AS TEXT) AS icon_resource_snapshot,
            CAST(cover_resource_snapshot AS TEXT) AS cover_resource_snapshot,
            category_id, package_id,
            provider, version, version_name, runtime, entrypoint, manifest_url,
            repository_url, homepage_url, documentation_url, license_name, source_type,
            market_status, visibility, review_status, review_comment, reviewed_by,
            CAST(reviewed_at AS TEXT) AS reviewed_at,
            COALESCE(builtin, 0) AS builtin,
            COALESCE(is_builtin, 0) AS is_builtin,
            COALESCE(enabled, 0) AS enabled,
            COALESCE(featured, 0) AS featured,
            COALESCE(recommend_weight, 0) AS recommend_weight,
            CAST(price AS TEXT) AS price,
            COALESCE(currency, 'CNY') AS currency,
            COALESCE(install_count, 0) AS install_count,
            CAST(COALESCE(rating_avg, 0) AS TEXT) AS rating_avg,
            COALESCE(rating_count, 0) AS rating_count,
            COALESCE(CAST(tags AS TEXT), '[]') AS tags,
            COALESCE(CAST(capabilities AS TEXT), '[]') AS capabilities,
            COALESCE(CAST(config_schema AS TEXT), '{}') AS config_schema,
            COALESCE(CAST(default_config AS TEXT), '{}') AS default_config,
            CAST(latest_published_at AS TEXT) AS latest_published_at,
            CAST(created_at AS TEXT) AS created_at,
            CAST(updated_at AS TEXT) AS updated_at
        FROM plus_agent_skill
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
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

async fn ensure_category_exists(
    tx: &mut Transaction<'_, Sqlite>,
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
        FROM plus_category
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND type IN (?, ?)
          AND COALESCE(status, 1) >= 0
        "#,
    )
    .bind(category_id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(CATEGORY_TYPE_SKILLS)
    .bind(CATEGORY_TYPE_SKILLS_COLLECTION)
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
    tx: &mut Transaction<'_, Sqlite>,
    command: &DeleteAdminSkillCategoryCommand,
) -> DomainResult<()> {
    let child_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_category
        WHERE tenant_id = ?
          AND organization_id = ?
          AND parent_id = ?
          AND type IN (?, ?)
          AND COALESCE(status, 1) >= 0
        "#,
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.category_id)
    .bind(CATEGORY_TYPE_SKILLS)
    .bind(CATEGORY_TYPE_SKILLS_COLLECTION)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to validate child skill categories", error))?;
    if child_count > 0 {
        return Err(DomainError::conflict("skill category has child categories"));
    }

    let package_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_agent_skill_package
        WHERE tenant_id = ?
          AND organization_id = ?
          AND category_id = ?
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
        FROM plus_agent_skill
        WHERE tenant_id = ?
          AND organization_id = ?
          AND category_id = ?
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
    tx: &mut Transaction<'_, Sqlite>,
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
        FROM plus_agent_skill_package
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
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
    tx: &mut Transaction<'_, Sqlite>,
    tenant_id: i64,
    organization_id: i64,
    skill_id: i64,
) -> DomainResult<()> {
    let exists: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_agent_skill
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
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
    tx: &mut Transaction<'_, Sqlite>,
    tenant_id: i64,
    organization_id: i64,
    skill_id: i64,
) -> DomainResult<()> {
    let exists: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_agent_skill
        WHERE id = ?
          AND (
              (tenant_id = ? AND organization_id = ?)
              OR (tenant_id = ? AND organization_id = ?)
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
    tx: &mut Transaction<'_, Sqlite>,
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
        FROM studio_catalog_artifact
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND target_type = ?
          AND target_id = ?
          AND deleted_at IS NULL
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

fn category_from_row(row: sqlx::sqlite::SqliteRow) -> DomainResult<AdminSkillCategoryItem> {
    Ok(AdminSkillCategoryItem {
        id: row.try_get("id").map_err(row_error)?,
        uuid: row.try_get("uuid").map_err(row_error)?,
        tenant_id: row.try_get("tenant_id").map_err(row_error)?,
        organization_id: row.try_get("organization_id").map_err(row_error)?,
        name: row.try_get("name").map_err(row_error)?,
        description: row.try_get("description").ok().flatten(),
        code: row.try_get("code").ok().flatten(),
        icon: optional_media_resource_from_row(&row, "icon_resource_snapshot")?,
        sort_weight: integer_cell(&row, "sort_weight") as i32,
        parent_id: row.try_get("parent_id").ok().flatten(),
        path: row.try_get("path").ok().flatten(),
        visible: bool_cell(&row, "visible"),
        status: integer_cell(&row, "status") as i32,
        category_type: integer_cell(&row, "category_type") as i32,
    })
}

fn package_from_row(row: sqlx::sqlite::SqliteRow) -> DomainResult<AdminSkillPackageItem> {
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
        icon: optional_media_resource_from_row(&row, "icon_resource_snapshot")?,
        cover: optional_media_resource_from_row(&row, "cover_resource_snapshot")?,
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

fn skill_from_row(row: sqlx::sqlite::SqliteRow) -> DomainResult<AdminSkillItem> {
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
        icon: optional_media_resource_from_row(&row, "icon_resource_snapshot")?,
        cover: optional_media_resource_from_row(&row, "cover_resource_snapshot")?,
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

fn asset_select_sql(where_sql: &str) -> String {
    format!(
        r#"
        SELECT id, uuid, tenant_id, organization_id, COALESCE(status, 1) AS status,
               COALESCE(target_type, 0) AS target_type,
               COALESCE(target_id, 0) AS target_id,
               artifact_id,
               COALESCE(asset_type, 0) AS asset_type,
               CAST(asset_resource_snapshot AS TEXT) AS asset_resource_snapshot,
               CAST(thumbnail_resource_snapshot AS TEXT) AS thumbnail_resource_snapshot,
               title, alt_text, mime_type,
               width, height, CAST(duration_seconds AS TEXT) AS duration_seconds,
               file_size, COALESCE(sort_order, 0) AS sort_order,
               CAST(published_at AS TEXT) AS published_at,
               CAST(created_at AS TEXT) AS created_at,
               CAST(updated_at AS TEXT) AS updated_at
        FROM studio_catalog_asset
        {where_sql}
        "#
    )
}

fn artifact_select_sql(where_sql: &str) -> String {
    format!(
        r#"
        SELECT id, uuid, tenant_id, organization_id, COALESCE(status, 1) AS status,
               COALESCE(target_type, 0) AS target_type,
               COALESCE(target_id, 0) AS target_id,
               COALESCE(artifact_type, 0) AS artifact_type,
               COALESCE(version, '') AS version,
               COALESCE(platform_type, '') AS platform_type,
               COALESCE(os_name, '') AS os_name,
               artifact_ref, CAST(artifact_resource_snapshot AS TEXT) AS artifact_resource_snapshot,
               COALESCE(artifact_size_bytes, 0) AS artifact_size_bytes,
               runtime,
               COALESCE(CAST(frameworks AS TEXT), '[]') AS frameworks,
               license_name, checksum_hash, release_notes,
               CAST(published_at AS TEXT) AS published_at,
               CAST(deprecated_at AS TEXT) AS deprecated_at,
               CAST(created_at AS TEXT) AS created_at,
               CAST(updated_at AS TEXT) AS updated_at
        FROM studio_catalog_artifact
        {where_sql}
        "#
    )
}

fn asset_from_row(row: sqlx::sqlite::SqliteRow) -> DomainResult<AdminSkillAssetItem> {
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
        )?,
        thumbnail: optional_media_resource_from_row(&row, "thumbnail_resource_snapshot")?,
        title: row.try_get("title").ok().flatten(),
        alt_text: row.try_get("alt_text").ok().flatten(),
        mime_type: row.try_get("mime_type").ok().flatten(),
        width: row
            .try_get::<i64, _>("width")
            .ok()
            .map(|value| value as i32)
            .or_else(|| row.try_get::<i32, _>("width").ok()),
        height: row
            .try_get::<i64, _>("height")
            .ok()
            .map(|value| value as i32)
            .or_else(|| row.try_get::<i32, _>("height").ok()),
        duration_seconds: row.try_get("duration_seconds").ok().flatten(),
        file_size: row.try_get("file_size").ok().flatten(),
        sort_order: integer_cell(&row, "sort_order") as i32,
        published_at: row.try_get("published_at").ok().flatten(),
        created_at: row.try_get("created_at").unwrap_or_default(),
        updated_at: row.try_get("updated_at").unwrap_or_default(),
    })
}

fn artifact_from_row(row: sqlx::sqlite::SqliteRow) -> DomainResult<AdminSkillArtifactItem> {
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
        artifact: optional_media_resource_from_row(&row, "artifact_resource_snapshot")?,
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
    row: &sqlx::sqlite::SqliteRow,
    column: &str,
    kind: &str,
) -> DomainResult<serde_json::Value> {
    let raw = row.try_get::<Option<String>, _>(column).ok().flatten();
    parse_media_resource(raw.as_deref(), kind)
}

fn optional_media_resource_from_row(
    row: &sqlx::sqlite::SqliteRow,
    column: &str,
) -> DomainResult<Option<serde_json::Value>> {
    let Some(raw) = row.try_get::<Option<String>, _>(column).ok().flatten() else {
        return Ok(None);
    };
    if raw.trim().is_empty() {
        return Ok(None);
    }
    Ok(Some(parse_media_resource(Some(raw.as_str()), "image")?))
}

fn parse_media_resource(raw: Option<&str>, kind: &str) -> DomainResult<serde_json::Value> {
    let Some(raw) = raw.map(str::trim).filter(|value| !value.is_empty()) else {
        return Ok(empty_media_resource(kind));
    };
    let value: serde_json::Value = serde_json::from_str(raw)
        .map_err(|error| DomainError::new(format!("invalid skill media resource json: {error}")))?;
    if value.is_object() {
        Ok(value)
    } else {
        Ok(empty_media_resource(kind))
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
    tx: &mut Transaction<'_, Sqlite>,
    table_name: &'static str,
    namespace: &'static str,
    entity_uuid: &str,
) -> DomainResult<i64> {
    for attempt in 0..MAX_ASSIGNED_ID_ATTEMPTS {
        let id = assigned_entity_id(namespace, entity_uuid, attempt);
        if !assigned_id_exists(tx, table_name, id).await? {
            return Ok(id);
        }
    }
    Err(DomainError::conflict(format!(
        "failed to allocate assigned id for {namespace}"
    )))
}

async fn assigned_id_exists(
    tx: &mut Transaction<'_, Sqlite>,
    table_name: &'static str,
    id: i64,
) -> DomainResult<bool> {
    let count: i64 = match table_name {
        "plus_category" => sqlx::query_scalar("SELECT COUNT(1) FROM plus_category WHERE id = ?")
            .bind(id)
            .fetch_one(&mut **tx)
            .await
            .map_err(|error| store_error("failed to check category assigned id", error))?,
        "plus_agent_skill" => {
            sqlx::query_scalar("SELECT COUNT(1) FROM plus_agent_skill WHERE id = ?")
                .bind(id)
                .fetch_one(&mut **tx)
                .await
                .map_err(|error| store_error("failed to check skill assigned id", error))?
        }
        "plus_agent_skill_package" => {
            sqlx::query_scalar("SELECT COUNT(1) FROM plus_agent_skill_package WHERE id = ?")
                .bind(id)
                .fetch_one(&mut **tx)
                .await
                .map_err(|error| store_error("failed to check skill package assigned id", error))?
        }
        "studio_catalog_asset" => {
            sqlx::query_scalar("SELECT COUNT(1) FROM studio_catalog_asset WHERE id = ?")
                .bind(id)
                .fetch_one(&mut **tx)
                .await
                .map_err(|error| store_error("failed to check skill asset assigned id", error))?
        }
        "studio_catalog_artifact" => {
            sqlx::query_scalar("SELECT COUNT(1) FROM studio_catalog_artifact WHERE id = ?")
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

fn bool_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> bool {
    row.try_get::<bool, _>(column)
        .ok()
        .or_else(|| row.try_get::<i64, _>(column).ok().map(|value| value != 0))
        .or_else(|| row.try_get::<i32, _>(column).ok().map(|value| value != 0))
        .unwrap_or(false)
}

fn integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> i64 {
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
