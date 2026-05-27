use std::future::Future;
use std::ops::Deref;
use std::pin::Pin;

use serde_json::Value;

use crate::domain::DomainResult;

pub type AdminAppCommandFuture<'a, T> = Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AdminAppSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub operator_id: i64,
    pub operator_type: i32,
}

#[derive(Debug, Clone, PartialEq)]
pub struct AdminAppItem {
    pub id: i64,
    pub uuid: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: Option<i64>,
    pub name: String,
    pub description: Option<String>,
    pub version: Option<String>,
    pub icon: Value,
    pub icon_url: Option<String>,
    pub resource_list: Value,
    pub project_id: Option<i64>,
    pub access_url: Option<String>,
    pub config: Value,
    pub app_key: Option<String>,
    pub status: String,
    pub market_status: String,
    pub app_type: Option<String>,
    pub platforms: Value,
    pub install_platforms: Value,
    pub install_skill: Value,
    pub install_config: Value,
    pub release_notes: Value,
    pub package_name: Option<String>,
    pub bundle_id: Option<String>,
    pub store_url: Option<String>,
    pub download_url: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct AdminAppCategoryItem {
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

#[derive(Debug, Clone, PartialEq)]
pub struct AdminAppTemplateItem {
    pub id: i64,
    pub uuid: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub template_no: String,
    pub template_code: String,
    pub template_name: String,
    pub description: Option<String>,
    pub category_id: Option<i64>,
    pub category_code: Option<String>,
    pub template_type: Option<String>,
    pub runtime: Option<String>,
    pub framework: Option<String>,
    pub language: Option<String>,
    pub icon_url: Option<String>,
    pub cover_url: Option<String>,
    pub visibility: String,
    pub publish_status: String,
    pub featured: bool,
    pub sort_weight: i32,
    pub source_app_id: Option<i64>,
    pub git_repo_url: Option<String>,
    pub git_ref: Option<String>,
    pub git_sub_path: Option<String>,
    pub current_version_id: Option<i64>,
    pub app_config_schema: Value,
    pub default_app_config: Value,
    pub variable_schema: Value,
    pub dependency_manifest: Value,
    pub capability_manifest: Value,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ListAdminAppsQuery {
    pub subject: AdminAppSubject,
    pub keyword: Option<String>,
    pub status: Option<String>,
    pub market_status: Option<String>,
    pub app_type: Option<String>,
    pub category_id: Option<i64>,
    pub page_no: Option<i64>,
    pub page_size: Option<i64>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ListAdminAppTemplatesQuery {
    pub subject: AdminAppSubject,
    pub keyword: Option<String>,
    pub publish_status: Option<String>,
    pub template_type: Option<String>,
    pub runtime: Option<String>,
    pub category_id: Option<i64>,
    pub page_no: Option<i64>,
    pub page_size: Option<i64>,
}

#[derive(Debug, Clone, Default, PartialEq)]
pub struct AdminAppPage {
    pub items: Vec<AdminAppItem>,
    pub total: i64,
    pub page: i64,
    pub page_size: i64,
    pub has_next_page: bool,
}

impl AdminAppPage {
    pub fn new(items: Vec<AdminAppItem>, total: i64, page: i64, page_size: i64) -> Self {
        let total = total.max(0);
        let page = page.max(1);
        let page_size = page_size.max(1);
        let shown_until = (page - 1)
            .saturating_mul(page_size)
            .saturating_add(items.len() as i64);
        Self {
            items,
            total,
            page,
            page_size,
            has_next_page: shown_until < total,
        }
    }
}

impl Deref for AdminAppPage {
    type Target = [AdminAppItem];

    fn deref(&self) -> &Self::Target {
        &self.items
    }
}

impl IntoIterator for AdminAppPage {
    type Item = AdminAppItem;
    type IntoIter = std::vec::IntoIter<AdminAppItem>;

    fn into_iter(self) -> Self::IntoIter {
        self.items.into_iter()
    }
}

impl<'a> IntoIterator for &'a AdminAppPage {
    type Item = &'a AdminAppItem;
    type IntoIter = std::slice::Iter<'a, AdminAppItem>;

    fn into_iter(self) -> Self::IntoIter {
        self.items.iter()
    }
}

#[derive(Debug, Clone, Default, PartialEq)]
pub struct AdminAppTemplatePage {
    pub items: Vec<AdminAppTemplateItem>,
    pub total: i64,
    pub page: i64,
    pub page_size: i64,
    pub has_next_page: bool,
}

impl AdminAppTemplatePage {
    pub fn new(items: Vec<AdminAppTemplateItem>, total: i64, page: i64, page_size: i64) -> Self {
        let total = total.max(0);
        let page = page.max(1);
        let page_size = page_size.max(1);
        let shown_until = (page - 1)
            .saturating_mul(page_size)
            .saturating_add(items.len() as i64);
        Self {
            items,
            total,
            page,
            page_size,
            has_next_page: shown_until < total,
        }
    }
}

impl Deref for AdminAppTemplatePage {
    type Target = [AdminAppTemplateItem];

    fn deref(&self) -> &Self::Target {
        &self.items
    }
}

impl IntoIterator for AdminAppTemplatePage {
    type Item = AdminAppTemplateItem;
    type IntoIter = std::vec::IntoIter<AdminAppTemplateItem>;

    fn into_iter(self) -> Self::IntoIter {
        self.items.into_iter()
    }
}

impl<'a> IntoIterator for &'a AdminAppTemplatePage {
    type Item = &'a AdminAppTemplateItem;
    type IntoIter = std::slice::Iter<'a, AdminAppTemplateItem>;

    fn into_iter(self) -> Self::IntoIter {
        self.items.iter()
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListAdminAppCategoriesQuery {
    pub subject: AdminAppSubject,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct GetAdminAppQuery {
    pub subject: AdminAppSubject,
    pub app_id: i64,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct GetAdminAppTemplateQuery {
    pub subject: AdminAppSubject,
    pub template_id: i64,
}

#[derive(Debug, Clone, PartialEq)]
pub struct CreateAdminAppCommand {
    pub subject: AdminAppSubject,
    pub app_uuid: String,
    pub audit_log_uuid: String,
    pub user_id: Option<i64>,
    pub name: String,
    pub description: Option<String>,
    pub version: Option<String>,
    pub icon: Value,
    pub icon_url: Option<String>,
    pub resource_list: Value,
    pub project_id: Option<i64>,
    pub access_url: Option<String>,
    pub config: Value,
    pub app_key: Option<String>,
    pub status: String,
    pub market_status: String,
    pub app_type: Option<String>,
    pub platforms: Value,
    pub install_platforms: Value,
    pub install_skill: Value,
    pub install_config: Value,
    pub release_notes: Value,
    pub package_name: Option<String>,
    pub bundle_id: Option<String>,
    pub store_url: Option<String>,
    pub download_url: Option<String>,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct CreateAdminAppTemplateCommand {
    pub subject: AdminAppSubject,
    pub template_uuid: String,
    pub audit_log_uuid: String,
    pub template_no: String,
    pub template_code: String,
    pub template_name: String,
    pub description: Option<String>,
    pub category_id: Option<i64>,
    pub category_code: Option<String>,
    pub template_type: Option<String>,
    pub runtime: Option<String>,
    pub framework: Option<String>,
    pub language: Option<String>,
    pub icon_url: Option<String>,
    pub cover_url: Option<String>,
    pub visibility: String,
    pub publish_status: String,
    pub featured: bool,
    pub sort_weight: i32,
    pub source_app_id: Option<i64>,
    pub git_repo_url: Option<String>,
    pub git_ref: Option<String>,
    pub git_sub_path: Option<String>,
    pub app_config_schema: Value,
    pub default_app_config: Value,
    pub variable_schema: Value,
    pub dependency_manifest: Value,
    pub capability_manifest: Value,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct CreateAdminAppCategoryCommand {
    pub subject: AdminAppSubject,
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

#[derive(Debug, Clone, PartialEq)]
pub struct UpdateAdminAppTemplateCommand {
    pub subject: AdminAppSubject,
    pub template_id: i64,
    pub audit_log_uuid: String,
    pub template_name: Option<String>,
    pub description: Option<Option<String>>,
    pub category_id: Option<Option<i64>>,
    pub category_code: Option<Option<String>>,
    pub template_type: Option<Option<String>>,
    pub runtime: Option<Option<String>>,
    pub framework: Option<Option<String>>,
    pub language: Option<Option<String>>,
    pub icon_url: Option<Option<String>>,
    pub cover_url: Option<Option<String>>,
    pub visibility: Option<String>,
    pub publish_status: Option<String>,
    pub featured: Option<bool>,
    pub sort_weight: Option<i32>,
    pub source_app_id: Option<Option<i64>>,
    pub git_repo_url: Option<Option<String>>,
    pub git_ref: Option<Option<String>>,
    pub git_sub_path: Option<Option<String>>,
    pub app_config_schema: Option<Value>,
    pub default_app_config: Option<Value>,
    pub variable_schema: Option<Value>,
    pub dependency_manifest: Option<Value>,
    pub capability_manifest: Option<Value>,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct UpdateAdminAppCommand {
    pub subject: AdminAppSubject,
    pub app_id: i64,
    pub audit_log_uuid: String,
    pub user_id: Option<Option<i64>>,
    pub name: Option<String>,
    pub description: Option<Option<String>>,
    pub version: Option<Option<String>>,
    pub icon: Option<Value>,
    pub icon_url: Option<Option<String>>,
    pub resource_list: Option<Value>,
    pub project_id: Option<Option<i64>>,
    pub access_url: Option<Option<String>>,
    pub config: Option<Value>,
    pub app_key: Option<Option<String>>,
    pub app_type: Option<Option<String>>,
    pub platforms: Option<Value>,
    pub install_platforms: Option<Value>,
    pub install_skill: Option<Value>,
    pub install_config: Option<Value>,
    pub release_notes: Option<Value>,
    pub package_name: Option<Option<String>>,
    pub bundle_id: Option<Option<String>>,
    pub store_url: Option<Option<String>>,
    pub download_url: Option<Option<String>>,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct UpdateAdminAppCategoryCommand {
    pub subject: AdminAppSubject,
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
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SetAdminAppStatusCommand {
    pub subject: AdminAppSubject,
    pub app_id: i64,
    pub status: Option<String>,
    pub market_status: Option<String>,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SetAdminAppTemplatePublishStatusCommand {
    pub subject: AdminAppSubject,
    pub template_id: i64,
    pub publish_status: String,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DeleteAdminAppCommand {
    pub subject: AdminAppSubject,
    pub app_id: i64,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DeleteAdminAppTemplateCommand {
    pub subject: AdminAppSubject,
    pub template_id: i64,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DeleteAdminAppCategoryCommand {
    pub subject: AdminAppSubject,
    pub category_id: i64,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

pub trait AdminAppStore {
    fn list_categories<'a>(
        &'a self,
        query: ListAdminAppCategoriesQuery,
    ) -> AdminAppCommandFuture<'a, Vec<AdminAppCategoryItem>>;

    fn create_category<'a>(
        &'a self,
        command: CreateAdminAppCategoryCommand,
    ) -> AdminAppCommandFuture<'a, AdminAppCategoryItem>;

    fn update_category<'a>(
        &'a self,
        command: UpdateAdminAppCategoryCommand,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppCategoryItem>>;

    fn delete_category<'a>(
        &'a self,
        command: DeleteAdminAppCategoryCommand,
    ) -> AdminAppCommandFuture<'a, bool>;

    fn list_apps<'a>(
        &'a self,
        query: ListAdminAppsQuery,
    ) -> AdminAppCommandFuture<'a, AdminAppPage>;

    fn get_app<'a>(
        &'a self,
        query: GetAdminAppQuery,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppItem>>;

    fn create_app<'a>(
        &'a self,
        command: CreateAdminAppCommand,
    ) -> AdminAppCommandFuture<'a, AdminAppItem>;

    fn update_app<'a>(
        &'a self,
        command: UpdateAdminAppCommand,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppItem>>;

    fn set_app_status<'a>(
        &'a self,
        command: SetAdminAppStatusCommand,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppItem>>;

    fn delete_app<'a>(&'a self, command: DeleteAdminAppCommand) -> AdminAppCommandFuture<'a, bool>;

    fn list_app_templates<'a>(
        &'a self,
        query: ListAdminAppTemplatesQuery,
    ) -> AdminAppCommandFuture<'a, AdminAppTemplatePage>;

    fn get_app_template<'a>(
        &'a self,
        query: GetAdminAppTemplateQuery,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppTemplateItem>>;

    fn create_app_template<'a>(
        &'a self,
        command: CreateAdminAppTemplateCommand,
    ) -> AdminAppCommandFuture<'a, AdminAppTemplateItem>;

    fn update_app_template<'a>(
        &'a self,
        command: UpdateAdminAppTemplateCommand,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppTemplateItem>>;

    fn set_app_template_publish_status<'a>(
        &'a self,
        command: SetAdminAppTemplatePublishStatusCommand,
    ) -> AdminAppCommandFuture<'a, Option<AdminAppTemplateItem>>;

    fn delete_app_template<'a>(
        &'a self,
        command: DeleteAdminAppTemplateCommand,
    ) -> AdminAppCommandFuture<'a, bool>;
}
