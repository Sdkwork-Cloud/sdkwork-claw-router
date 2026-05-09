use std::future::Future;
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

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ListAdminAppsQuery {
    pub subject: AdminAppSubject,
    pub keyword: Option<String>,
    pub status: Option<String>,
    pub market_status: Option<String>,
    pub app_type: Option<String>,
    pub page_no: Option<i64>,
    pub page_size: Option<i64>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct GetAdminAppQuery {
    pub subject: AdminAppSubject,
    pub app_id: i64,
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
pub struct DeleteAdminAppCommand {
    pub subject: AdminAppSubject,
    pub app_id: i64,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

pub trait AdminAppStore {
    fn list_apps<'a>(
        &'a self,
        query: ListAdminAppsQuery,
    ) -> AdminAppCommandFuture<'a, Vec<AdminAppItem>>;

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
}
