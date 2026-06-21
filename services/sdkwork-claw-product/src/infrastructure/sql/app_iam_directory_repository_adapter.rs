use sdkwork_clawrouter_app_iam_directory_repository_sqlx::{
    AppIamDirectoryQuery, AppIamDirectoryReadStore as RepositoryAppIamDirectoryReadStore,
    AppIamDirectorySubject, PostgresAppIamDirectoryReadStore as RepositoryPostgresAppIamDirectoryReadStore,
    SqliteAppIamDirectoryReadStore as RepositorySqliteAppIamDirectoryReadStore,
};

use crate::domain::DomainError;
use crate::ports::{
    AppIamDepartmentAssignmentItem, AppIamDepartmentItem, AppIamDepartmentTreeItem,
    AppIamDirectoryReadFuture, AppIamDirectoryReadStore, AppIamOrganizationItem,
    AppIamOrganizationMembershipItem, AppIamOrganizationTreeItem, AppIamPositionAssignmentItem,
    AppIamPositionItem, AppIamRoleBindingItem,
};

#[derive(Debug, Clone)]
pub struct PostgresAppIamDirectoryReadStore(RepositoryPostgresAppIamDirectoryReadStore);

impl PostgresAppIamDirectoryReadStore {
    pub fn new(pool: sqlx::PgPool) -> Self {
        Self(RepositoryPostgresAppIamDirectoryReadStore::new(pool))
    }
}

impl AppIamDirectoryReadStore for PostgresAppIamDirectoryReadStore {
    fn list_organizations<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamOrganizationItem>> {
        Box::pin(async move {
            RepositoryAppIamDirectoryReadStore::list_organizations(&self.0, subject, query)
                .await
                .map_err(|error| DomainError::new(error.to_string()))
        })
    }

    fn retrieve_organization_tree<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamOrganizationTreeItem>> {
        Box::pin(async move {
            RepositoryAppIamDirectoryReadStore::retrieve_organization_tree(&self.0, subject, query)
                .await
                .map_err(|error| DomainError::new(error.to_string()))
        })
    }

    fn list_organization_memberships<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamOrganizationMembershipItem>> {
        Box::pin(async move {
            RepositoryAppIamDirectoryReadStore::list_organization_memberships(
                &self.0, subject, query,
            )
            .await
            .map_err(|error| DomainError::new(error.to_string()))
        })
    }

    fn list_departments<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamDepartmentItem>> {
        Box::pin(async move {
            RepositoryAppIamDirectoryReadStore::list_departments(&self.0, subject, query)
                .await
                .map_err(|error| DomainError::new(error.to_string()))
        })
    }

    fn retrieve_department_tree<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamDepartmentTreeItem>> {
        Box::pin(async move {
            RepositoryAppIamDirectoryReadStore::retrieve_department_tree(&self.0, subject, query)
                .await
                .map_err(|error| DomainError::new(error.to_string()))
        })
    }

    fn list_department_assignments<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamDepartmentAssignmentItem>> {
        Box::pin(async move {
            RepositoryAppIamDirectoryReadStore::list_department_assignments(
                &self.0, subject, query,
            )
            .await
            .map_err(|error| DomainError::new(error.to_string()))
        })
    }

    fn list_positions<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamPositionItem>> {
        Box::pin(async move {
            RepositoryAppIamDirectoryReadStore::list_positions(&self.0, subject, query)
                .await
                .map_err(|error| DomainError::new(error.to_string()))
        })
    }

    fn list_position_assignments<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamPositionAssignmentItem>> {
        Box::pin(async move {
            RepositoryAppIamDirectoryReadStore::list_position_assignments(
                &self.0, subject, query,
            )
            .await
            .map_err(|error| DomainError::new(error.to_string()))
        })
    }

    fn list_role_bindings<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamRoleBindingItem>> {
        Box::pin(async move {
            RepositoryAppIamDirectoryReadStore::list_role_bindings(&self.0, subject, query)
                .await
                .map_err(|error| DomainError::new(error.to_string()))
        })
    }
}

#[derive(Debug, Clone)]
pub struct SqliteAppIamDirectoryReadStore(RepositorySqliteAppIamDirectoryReadStore);

impl SqliteAppIamDirectoryReadStore {
    pub fn new(pool: sqlx::SqlitePool) -> Self {
        Self(RepositorySqliteAppIamDirectoryReadStore::new(pool))
    }
}

impl AppIamDirectoryReadStore for SqliteAppIamDirectoryReadStore {
    fn list_organizations<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamOrganizationItem>> {
        Box::pin(async move {
            RepositoryAppIamDirectoryReadStore::list_organizations(&self.0, subject, query)
                .await
                .map_err(|error| DomainError::new(error.to_string()))
        })
    }

    fn retrieve_organization_tree<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamOrganizationTreeItem>> {
        Box::pin(async move {
            RepositoryAppIamDirectoryReadStore::retrieve_organization_tree(&self.0, subject, query)
                .await
                .map_err(|error| DomainError::new(error.to_string()))
        })
    }

    fn list_organization_memberships<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamOrganizationMembershipItem>> {
        Box::pin(async move {
            RepositoryAppIamDirectoryReadStore::list_organization_memberships(
                &self.0, subject, query,
            )
            .await
            .map_err(|error| DomainError::new(error.to_string()))
        })
    }

    fn list_departments<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamDepartmentItem>> {
        Box::pin(async move {
            RepositoryAppIamDirectoryReadStore::list_departments(&self.0, subject, query)
                .await
                .map_err(|error| DomainError::new(error.to_string()))
        })
    }

    fn retrieve_department_tree<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamDepartmentTreeItem>> {
        Box::pin(async move {
            RepositoryAppIamDirectoryReadStore::retrieve_department_tree(&self.0, subject, query)
                .await
                .map_err(|error| DomainError::new(error.to_string()))
        })
    }

    fn list_department_assignments<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamDepartmentAssignmentItem>> {
        Box::pin(async move {
            RepositoryAppIamDirectoryReadStore::list_department_assignments(
                &self.0, subject, query,
            )
            .await
            .map_err(|error| DomainError::new(error.to_string()))
        })
    }

    fn list_positions<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamPositionItem>> {
        Box::pin(async move {
            RepositoryAppIamDirectoryReadStore::list_positions(&self.0, subject, query)
                .await
                .map_err(|error| DomainError::new(error.to_string()))
        })
    }

    fn list_position_assignments<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamPositionAssignmentItem>> {
        Box::pin(async move {
            RepositoryAppIamDirectoryReadStore::list_position_assignments(
                &self.0, subject, query,
            )
            .await
            .map_err(|error| DomainError::new(error.to_string()))
        })
    }

    fn list_role_bindings<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamRoleBindingItem>> {
        Box::pin(async move {
            RepositoryAppIamDirectoryReadStore::list_role_bindings(&self.0, subject, query)
                .await
                .map_err(|error| DomainError::new(error.to_string()))
        })
    }
}
