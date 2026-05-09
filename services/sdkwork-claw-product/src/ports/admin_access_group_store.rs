use std::future::Future;
use std::pin::Pin;

use crate::domain::DomainResult;

pub type AdminAccessGroupCommandFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AdminAccessGroupSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub operator_id: i64,
    pub operator_type: i32,
}

#[derive(Debug, Clone, PartialEq)]
pub struct AdminAccessGroupItem {
    pub id: i64,
    pub uuid: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub name: String,
    pub platform: String,
    pub billing_type: String,
    pub rate_multiplier: f64,
    pub group_type: String,
    pub account_available: i64,
    pub account_total: i64,
    pub capacity_used: f64,
    pub capacity_total: f64,
    pub usage_today: f64,
    pub usage_total: f64,
    pub status: String,
    pub deleted_at: Option<String>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListAdminAccessGroupsQuery {
    pub subject: AdminAccessGroupSubject,
}

#[derive(Debug, Clone, PartialEq)]
pub struct CreateAdminAccessGroupCommand {
    pub subject: AdminAccessGroupSubject,
    pub group_uuid: String,
    pub audit_log_uuid: String,
    pub config_snapshot_uuid: String,
    pub binding_uuid: String,
    pub code: String,
    pub name: String,
    pub platform: String,
    pub billing_type: String,
    pub rate_multiplier: f64,
    pub group_type: String,
    pub capacity_total: f64,
    pub status: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct UpdateAdminAccessGroupCommand {
    pub subject: AdminAccessGroupSubject,
    pub group_id: i64,
    pub audit_log_uuid: String,
    pub config_snapshot_uuid: String,
    pub binding_uuid: String,
    pub name: Option<String>,
    pub platform: Option<String>,
    pub billing_type: Option<String>,
    pub rate_multiplier: Option<f64>,
    pub group_type: Option<String>,
    pub capacity_total: Option<f64>,
    pub status: Option<String>,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DeleteAdminAccessGroupCommand {
    pub subject: AdminAccessGroupSubject,
    pub group_id: i64,
    pub audit_log_uuid: String,
    pub config_snapshot_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

pub trait AdminAccessGroupStore {
    fn list_access_groups<'a>(
        &'a self,
        query: ListAdminAccessGroupsQuery,
    ) -> AdminAccessGroupCommandFuture<'a, Vec<AdminAccessGroupItem>>;

    fn create_access_group<'a>(
        &'a self,
        command: CreateAdminAccessGroupCommand,
    ) -> AdminAccessGroupCommandFuture<'a, AdminAccessGroupItem>;

    fn update_access_group<'a>(
        &'a self,
        command: UpdateAdminAccessGroupCommand,
    ) -> AdminAccessGroupCommandFuture<'a, Option<AdminAccessGroupItem>>;

    fn delete_access_group<'a>(
        &'a self,
        command: DeleteAdminAccessGroupCommand,
    ) -> AdminAccessGroupCommandFuture<'a, bool>;
}
