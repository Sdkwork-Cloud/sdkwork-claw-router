use std::future::Future;
use std::pin::Pin;

pub use sdkwork_clawrouter_app_iam_directory_repository_sqlx::{
    AppIamDepartmentAssignmentItem, AppIamDepartmentItem, AppIamDepartmentTreeItem,
    AppIamDirectoryItems, AppIamDirectoryQuery, AppIamDirectorySubject, AppIamOrganizationItem,
    AppIamOrganizationMembershipItem, AppIamOrganizationTreeItem, AppIamPositionAssignmentItem,
    AppIamPositionItem, AppIamRoleBindingItem,
};

use crate::domain::DomainResult;

pub type AppIamDirectoryReadFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

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
