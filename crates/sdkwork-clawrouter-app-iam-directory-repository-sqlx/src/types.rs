use std::future::Future;
use std::pin::Pin;

use serde::Serialize;

use crate::error::RepositoryResult;

pub type AppIamDirectoryReadFuture<'a, T> =
    Pin<Box<dyn Future<Output = RepositoryResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AppIamDirectorySubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
}

#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct AppIamDirectoryQuery {
    pub organization_id: Option<String>,
    pub department_id: Option<String>,
    pub user_id: Option<String>,
    pub scope_id: Option<String>,
    pub status: Option<String>,
    pub q: Option<String>,
    pub page: Option<i64>,
    pub page_size: Option<i64>,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppIamDirectoryItems<T> {
    pub items: Vec<T>,
}

impl<T> AppIamDirectoryItems<T> {
    pub fn new(items: Vec<T>) -> Self {
        Self { items }
    }
}

#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppIamOrganizationItem {
    pub id: String,
    pub tenant_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parent_id: Option<String>,
    pub code: String,
    pub name: String,
    pub path: String,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppIamOrganizationTreeItem {
    #[serde(flatten)]
    pub organization: AppIamOrganizationItem,
    pub children: Vec<AppIamOrganizationTreeItem>,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppIamOrganizationMembershipItem {
    pub id: String,
    pub tenant_id: String,
    pub organization_id: String,
    pub user_id: String,
    pub role_code: String,
    pub status: String,
    pub joined_at: String,
    pub left_at: String,
    pub remark: String,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppIamDepartmentItem {
    pub id: String,
    pub tenant_id: String,
    pub organization_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parent_department_id: Option<String>,
    pub code: String,
    pub name: String,
    pub path: String,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppIamDepartmentTreeItem {
    #[serde(flatten)]
    pub department: AppIamDepartmentItem,
    pub children: Vec<AppIamDepartmentTreeItem>,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppIamDepartmentAssignmentItem {
    pub id: String,
    pub tenant_id: String,
    pub organization_id: String,
    pub organization_membership_id: String,
    pub department_id: String,
    pub user_id: String,
    pub assignment_kind: String,
    pub is_primary: bool,
    pub effective_from: String,
    pub effective_to: String,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppIamPositionItem {
    pub id: String,
    pub tenant_id: String,
    pub organization_id: String,
    pub department_id: String,
    pub code: String,
    pub name: String,
    pub position_kind: String,
    pub rank_level: String,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppIamPositionAssignmentItem {
    pub id: String,
    pub tenant_id: String,
    pub organization_id: String,
    pub department_assignment_id: String,
    pub position_id: String,
    pub user_id: String,
    pub is_primary: bool,
    pub effective_from: String,
    pub effective_to: String,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppIamRoleBindingItem {
    pub id: String,
    pub tenant_id: String,
    pub role_id: String,
    pub principal_kind: String,
    pub principal_id: String,
    pub scope_kind: String,
    pub scope_id: String,
    pub effect: String,
    pub condition_json: String,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
}

pub trait AppIamDirectoryReadStore {
    fn list_organizations<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamOrganizationItem>>;

    fn retrieve_organization_tree<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamOrganizationTreeItem>>;

    fn list_organization_memberships<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamOrganizationMembershipItem>>;

    fn list_departments<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamDepartmentItem>>;

    fn retrieve_department_tree<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamDepartmentTreeItem>>;

    fn list_department_assignments<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamDepartmentAssignmentItem>>;

    fn list_positions<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamPositionItem>>;

    fn list_position_assignments<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamPositionAssignmentItem>>;

    fn list_role_bindings<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamRoleBindingItem>>;
}
