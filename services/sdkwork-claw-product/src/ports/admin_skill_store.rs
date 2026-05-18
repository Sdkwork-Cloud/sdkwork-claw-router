use std::future::Future;
use std::pin::Pin;

use serde_json::Value;

use crate::domain::DomainResult;

pub type AdminSkillCommandFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AdminSkillSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub operator_id: i64,
    pub operator_type: i32,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AdminSkillCategoryItem {
    pub id: i64,
    pub uuid: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub name: String,
    pub description: Option<String>,
    pub code: Option<String>,
    pub icon: Option<String>,
    pub sort_weight: i32,
    pub parent_id: Option<i64>,
    pub path: Option<String>,
    pub visible: bool,
    pub status: i32,
    pub category_type: i32,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AdminSkillPackageItem {
    pub id: i64,
    pub uuid: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: Option<i64>,
    pub package_key: String,
    pub name: String,
    pub summary: Option<String>,
    pub description: Option<String>,
    pub icon: Option<String>,
    pub cover_image: Option<String>,
    pub category_id: Option<i64>,
    pub enabled: bool,
    pub featured: bool,
    pub sort_weight: i32,
    pub tags: Vec<String>,
    pub latest_published_at: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct AdminSkillItem {
    pub id: i64,
    pub uuid: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
    pub skill_key: String,
    pub name: String,
    pub summary: Option<String>,
    pub description: Option<String>,
    pub icon: Option<String>,
    pub cover_image: Option<String>,
    pub category_id: Option<i64>,
    pub package_id: Option<i64>,
    pub provider: Option<String>,
    pub version: Option<String>,
    pub version_name: Option<String>,
    pub runtime: Option<String>,
    pub entrypoint: Option<String>,
    pub manifest_url: Option<String>,
    pub repository_url: Option<String>,
    pub homepage_url: Option<String>,
    pub documentation_url: Option<String>,
    pub license_name: Option<String>,
    pub source_type: String,
    pub market_status: String,
    pub visibility: String,
    pub review_status: String,
    pub review_comment: Option<String>,
    pub reviewed_by: Option<i64>,
    pub reviewed_at: Option<String>,
    pub builtin: bool,
    pub is_builtin: bool,
    pub enabled: bool,
    pub featured: bool,
    pub recommend_weight: i32,
    pub price: Option<String>,
    pub currency: String,
    pub install_count: i64,
    pub rating_avg: String,
    pub rating_count: i64,
    pub tags: Vec<String>,
    pub capabilities: Vec<String>,
    pub config_schema: Value,
    pub default_config: Value,
    pub latest_published_at: Option<String>,
    pub created_at: String,
    pub updated_at: String,
    pub deleted_at: Option<String>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct AdminSkillAssetItem {
    pub id: i64,
    pub uuid: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub status: i32,
    pub target_type: i32,
    pub target_id: i64,
    pub artifact_id: Option<i64>,
    pub asset_type: i32,
    pub asset_url: String,
    pub thumbnail_url: Option<String>,
    pub title: Option<String>,
    pub alt_text: Option<String>,
    pub mime_type: Option<String>,
    pub width: Option<i32>,
    pub height: Option<i32>,
    pub duration_seconds: Option<String>,
    pub file_size: Option<i64>,
    pub sort_order: i32,
    pub published_at: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct AdminSkillArtifactItem {
    pub id: i64,
    pub uuid: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub status: i32,
    pub target_type: i32,
    pub target_id: i64,
    pub artifact_type: i32,
    pub version: String,
    pub platform_type: String,
    pub os_name: String,
    pub artifact_ref: Option<String>,
    pub artifact_url: Option<String>,
    pub artifact_size_bytes: i64,
    pub runtime: Option<String>,
    pub frameworks: Vec<String>,
    pub license_name: Option<String>,
    pub checksum_hash: Option<String>,
    pub release_notes: Option<String>,
    pub published_at: Option<String>,
    pub deprecated_at: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListAdminSkillCategoriesQuery {
    pub subject: AdminSkillSubject,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ListAdminSkillPackagesQuery {
    pub subject: AdminSkillSubject,
    pub keyword: Option<String>,
    pub enabled: Option<bool>,
    pub category_id: Option<i64>,
    pub page_no: Option<i64>,
    pub page_size: Option<i64>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CreateAdminSkillCategoryCommand {
    pub subject: AdminSkillSubject,
    pub category_uuid: String,
    pub audit_log_uuid: String,
    pub name: String,
    pub description: Option<String>,
    pub code: Option<String>,
    pub icon: Option<String>,
    pub sort_weight: i32,
    pub parent_id: Option<i64>,
    pub path: Option<String>,
    pub visible: bool,
    pub status: i32,
    pub category_type: i32,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UpdateAdminSkillCategoryCommand {
    pub subject: AdminSkillSubject,
    pub category_id: i64,
    pub audit_log_uuid: String,
    pub name: Option<String>,
    pub description: Option<Option<String>>,
    pub code: Option<Option<String>>,
    pub icon: Option<Option<String>>,
    pub sort_weight: Option<i32>,
    pub parent_id: Option<Option<i64>>,
    pub path: Option<Option<String>>,
    pub visible: Option<bool>,
    pub status: Option<i32>,
    pub category_type: Option<i32>,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DeleteAdminSkillCategoryCommand {
    pub subject: AdminSkillSubject,
    pub category_id: i64,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CreateAdminSkillPackageCommand {
    pub subject: AdminSkillSubject,
    pub package_uuid: String,
    pub audit_log_uuid: String,
    pub package_key: String,
    pub name: String,
    pub summary: Option<String>,
    pub description: Option<String>,
    pub icon: Option<String>,
    pub cover_image: Option<String>,
    pub category_id: Option<i64>,
    pub enabled: bool,
    pub featured: bool,
    pub sort_weight: i32,
    pub tags: Vec<String>,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UpdateAdminSkillPackageCommand {
    pub subject: AdminSkillSubject,
    pub package_id: i64,
    pub audit_log_uuid: String,
    pub package_key: Option<String>,
    pub name: Option<String>,
    pub summary: Option<String>,
    pub description: Option<Option<String>>,
    pub icon: Option<Option<String>>,
    pub cover_image: Option<Option<String>>,
    pub category_id: Option<Option<i64>>,
    pub enabled: Option<bool>,
    pub featured: Option<bool>,
    pub sort_weight: Option<i32>,
    pub tags: Option<Vec<String>>,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SetAdminSkillPackageEnabledCommand {
    pub subject: AdminSkillSubject,
    pub package_id: i64,
    pub enabled: bool,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DeleteAdminSkillPackageCommand {
    pub subject: AdminSkillSubject,
    pub package_id: i64,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ListAdminSkillsQuery {
    pub subject: AdminSkillSubject,
    pub keyword: Option<String>,
    pub market_status: Option<String>,
    pub review_status: Option<String>,
    pub visibility: Option<String>,
    pub enabled: Option<bool>,
    pub category_id: Option<i64>,
    pub page_no: Option<i64>,
    pub page_size: Option<i64>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct CreateAdminSkillCommand {
    pub subject: AdminSkillSubject,
    pub skill_uuid: String,
    pub audit_log_uuid: String,
    pub skill_key: String,
    pub name: String,
    pub summary: Option<String>,
    pub description: Option<String>,
    pub icon: Option<String>,
    pub cover_image: Option<String>,
    pub category_id: Option<i64>,
    pub package_id: Option<i64>,
    pub provider: Option<String>,
    pub version: Option<String>,
    pub version_name: Option<String>,
    pub runtime: Option<String>,
    pub entrypoint: Option<String>,
    pub manifest_url: Option<String>,
    pub repository_url: Option<String>,
    pub homepage_url: Option<String>,
    pub documentation_url: Option<String>,
    pub license_name: Option<String>,
    pub source_type: String,
    pub market_status: String,
    pub visibility: String,
    pub review_status: String,
    pub builtin: bool,
    pub is_builtin: bool,
    pub enabled: bool,
    pub featured: bool,
    pub recommend_weight: i32,
    pub price: Option<String>,
    pub currency: String,
    pub tags: Vec<String>,
    pub capabilities: Vec<String>,
    pub config_schema: Value,
    pub default_config: Value,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct UpdateAdminSkillCommand {
    pub subject: AdminSkillSubject,
    pub skill_id: i64,
    pub audit_log_uuid: String,
    pub skill_key: Option<String>,
    pub name: Option<String>,
    pub summary: Option<String>,
    pub description: Option<Option<String>>,
    pub icon: Option<Option<String>>,
    pub cover_image: Option<Option<String>>,
    pub category_id: Option<Option<i64>>,
    pub package_id: Option<Option<i64>>,
    pub provider: Option<Option<String>>,
    pub version: Option<String>,
    pub version_name: Option<Option<String>>,
    pub runtime: Option<Option<String>>,
    pub entrypoint: Option<Option<String>>,
    pub manifest_url: Option<Option<String>>,
    pub repository_url: Option<Option<String>>,
    pub homepage_url: Option<Option<String>>,
    pub documentation_url: Option<Option<String>>,
    pub license_name: Option<Option<String>>,
    pub source_type: Option<String>,
    pub visibility: Option<String>,
    pub builtin: Option<bool>,
    pub is_builtin: Option<bool>,
    pub featured: Option<bool>,
    pub recommend_weight: Option<i32>,
    pub price: Option<Option<String>>,
    pub currency: Option<String>,
    pub tags: Option<Vec<String>>,
    pub capabilities: Option<Vec<String>>,
    pub config_schema: Option<Value>,
    pub default_config: Option<Value>,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SetAdminSkillEnabledCommand {
    pub subject: AdminSkillSubject,
    pub skill_id: i64,
    pub enabled: bool,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SetAdminSkillMarketStatusCommand {
    pub subject: AdminSkillSubject,
    pub skill_id: i64,
    pub market_status: String,
    pub publish: bool,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ReviewAdminSkillCommand {
    pub subject: AdminSkillSubject,
    pub skill_id: i64,
    pub review_status: String,
    pub review_comment: Option<String>,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DeleteAdminSkillCommand {
    pub subject: AdminSkillSubject,
    pub skill_id: i64,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListAdminSkillAssetsQuery {
    pub subject: AdminSkillSubject,
    pub skill_id: i64,
}

#[derive(Debug, Clone, PartialEq)]
pub struct CreateAdminSkillAssetCommand {
    pub subject: AdminSkillSubject,
    pub skill_id: i64,
    pub asset_uuid: String,
    pub audit_log_uuid: String,
    pub artifact_id: Option<i64>,
    pub asset_type: i32,
    pub asset_url: String,
    pub thumbnail_url: Option<String>,
    pub title: Option<String>,
    pub alt_text: Option<String>,
    pub mime_type: Option<String>,
    pub width: Option<i32>,
    pub height: Option<i32>,
    pub duration_seconds: Option<String>,
    pub file_size: Option<i64>,
    pub sort_order: i32,
    pub status: i32,
    pub published_at: Option<String>,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct UpdateAdminSkillAssetCommand {
    pub subject: AdminSkillSubject,
    pub skill_id: i64,
    pub asset_id: i64,
    pub audit_log_uuid: String,
    pub artifact_id: Option<Option<i64>>,
    pub asset_type: Option<i32>,
    pub asset_url: Option<String>,
    pub thumbnail_url: Option<Option<String>>,
    pub title: Option<Option<String>>,
    pub alt_text: Option<Option<String>>,
    pub mime_type: Option<Option<String>>,
    pub width: Option<Option<i32>>,
    pub height: Option<Option<i32>>,
    pub duration_seconds: Option<Option<String>>,
    pub file_size: Option<Option<i64>>,
    pub sort_order: Option<i32>,
    pub status: Option<i32>,
    pub published_at: Option<Option<String>>,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DeleteAdminSkillAssetCommand {
    pub subject: AdminSkillSubject,
    pub skill_id: i64,
    pub asset_id: i64,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListAdminSkillArtifactsQuery {
    pub subject: AdminSkillSubject,
    pub skill_id: i64,
}

#[derive(Debug, Clone, PartialEq)]
pub struct CreateAdminSkillArtifactCommand {
    pub subject: AdminSkillSubject,
    pub skill_id: i64,
    pub artifact_uuid: String,
    pub audit_log_uuid: String,
    pub artifact_type: i32,
    pub version: String,
    pub platform_type: String,
    pub os_name: String,
    pub artifact_ref: Option<String>,
    pub artifact_url: Option<String>,
    pub artifact_size_bytes: i64,
    pub runtime: Option<String>,
    pub frameworks: Vec<String>,
    pub license_name: Option<String>,
    pub checksum_hash: Option<String>,
    pub release_notes: Option<String>,
    pub status: i32,
    pub published_at: Option<String>,
    pub deprecated_at: Option<String>,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct UpdateAdminSkillArtifactCommand {
    pub subject: AdminSkillSubject,
    pub skill_id: i64,
    pub artifact_id: i64,
    pub audit_log_uuid: String,
    pub artifact_type: Option<i32>,
    pub version: Option<String>,
    pub platform_type: Option<String>,
    pub os_name: Option<String>,
    pub artifact_ref: Option<Option<String>>,
    pub artifact_url: Option<Option<String>>,
    pub artifact_size_bytes: Option<i64>,
    pub runtime: Option<Option<String>>,
    pub frameworks: Option<Vec<String>>,
    pub license_name: Option<Option<String>>,
    pub checksum_hash: Option<Option<String>>,
    pub release_notes: Option<Option<String>>,
    pub status: Option<i32>,
    pub published_at: Option<Option<String>>,
    pub deprecated_at: Option<Option<String>>,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DeleteAdminSkillArtifactCommand {
    pub subject: AdminSkillSubject,
    pub skill_id: i64,
    pub artifact_id: i64,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

pub trait AdminSkillStore {
    fn list_categories<'a>(
        &'a self,
        query: ListAdminSkillCategoriesQuery,
    ) -> AdminSkillCommandFuture<'a, Vec<AdminSkillCategoryItem>>;

    fn create_category<'a>(
        &'a self,
        command: CreateAdminSkillCategoryCommand,
    ) -> AdminSkillCommandFuture<'a, AdminSkillCategoryItem>;

    fn update_category<'a>(
        &'a self,
        command: UpdateAdminSkillCategoryCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillCategoryItem>>;

    fn delete_category<'a>(
        &'a self,
        command: DeleteAdminSkillCategoryCommand,
    ) -> AdminSkillCommandFuture<'a, bool>;

    fn list_packages<'a>(
        &'a self,
        query: ListAdminSkillPackagesQuery,
    ) -> AdminSkillCommandFuture<'a, Vec<AdminSkillPackageItem>>;

    fn get_package<'a>(
        &'a self,
        query: ListAdminSkillPackagesQuery,
        package_id: i64,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillPackageItem>>
    where
        Self: Sync,
    {
        Box::pin(async move {
            let mut query = query;
            query.page_no = Some(1);
            query.page_size = Some(500);
            let items = self.list_packages(query).await?;
            Ok(items.into_iter().find(|item| item.id == package_id))
        })
    }

    fn create_package<'a>(
        &'a self,
        command: CreateAdminSkillPackageCommand,
    ) -> AdminSkillCommandFuture<'a, AdminSkillPackageItem>;

    fn update_package<'a>(
        &'a self,
        command: UpdateAdminSkillPackageCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillPackageItem>>;

    fn set_package_enabled<'a>(
        &'a self,
        command: SetAdminSkillPackageEnabledCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillPackageItem>>;

    fn delete_package<'a>(
        &'a self,
        command: DeleteAdminSkillPackageCommand,
    ) -> AdminSkillCommandFuture<'a, bool>;

    fn list_skills<'a>(
        &'a self,
        query: ListAdminSkillsQuery,
    ) -> AdminSkillCommandFuture<'a, Vec<AdminSkillItem>>;

    fn get_skill<'a>(
        &'a self,
        query: ListAdminSkillsQuery,
        skill_id: i64,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillItem>>
    where
        Self: Sync,
    {
        Box::pin(async move {
            let mut query = query;
            query.page_no = Some(1);
            query.page_size = Some(500);
            let items = self.list_skills(query).await?;
            Ok(items.into_iter().find(|item| item.id == skill_id))
        })
    }

    fn create_skill<'a>(
        &'a self,
        command: CreateAdminSkillCommand,
    ) -> AdminSkillCommandFuture<'a, AdminSkillItem>;

    fn update_skill<'a>(
        &'a self,
        command: UpdateAdminSkillCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillItem>>;

    fn set_skill_enabled<'a>(
        &'a self,
        command: SetAdminSkillEnabledCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillItem>>;

    fn set_market_status<'a>(
        &'a self,
        command: SetAdminSkillMarketStatusCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillItem>>;

    fn review_skill<'a>(
        &'a self,
        command: ReviewAdminSkillCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillItem>>;

    fn delete_skill<'a>(
        &'a self,
        command: DeleteAdminSkillCommand,
    ) -> AdminSkillCommandFuture<'a, bool>;

    fn list_assets<'a>(
        &'a self,
        query: ListAdminSkillAssetsQuery,
    ) -> AdminSkillCommandFuture<'a, Vec<AdminSkillAssetItem>>;

    fn create_asset<'a>(
        &'a self,
        command: CreateAdminSkillAssetCommand,
    ) -> AdminSkillCommandFuture<'a, AdminSkillAssetItem>;

    fn update_asset<'a>(
        &'a self,
        command: UpdateAdminSkillAssetCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillAssetItem>>;

    fn delete_asset<'a>(
        &'a self,
        command: DeleteAdminSkillAssetCommand,
    ) -> AdminSkillCommandFuture<'a, bool>;

    fn list_artifacts<'a>(
        &'a self,
        query: ListAdminSkillArtifactsQuery,
    ) -> AdminSkillCommandFuture<'a, Vec<AdminSkillArtifactItem>>;

    fn create_artifact<'a>(
        &'a self,
        command: CreateAdminSkillArtifactCommand,
    ) -> AdminSkillCommandFuture<'a, AdminSkillArtifactItem>;

    fn update_artifact<'a>(
        &'a self,
        command: UpdateAdminSkillArtifactCommand,
    ) -> AdminSkillCommandFuture<'a, Option<AdminSkillArtifactItem>>;

    fn delete_artifact<'a>(
        &'a self,
        command: DeleteAdminSkillArtifactCommand,
    ) -> AdminSkillCommandFuture<'a, bool>;
}
