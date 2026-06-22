use sdkwork_clawrouter_app_user_profile_repository_sqlx::{
    AppUserProfileReadStore as RepositoryAppUserProfileReadStore,
    PostgresAppUserProfileReadStore as RepositoryPostgresAppUserProfileReadStore,
    SqliteAppUserProfileReadStore as RepositorySqliteAppUserProfileReadStore,
};

use crate::domain::DomainError;
use crate::ports::{AppUserProfileReadFuture, AppUserProfileReadStore, AppUserProfileSubject};

#[derive(Debug, Clone)]
pub struct PostgresAppUserProfileReadStore(RepositoryPostgresAppUserProfileReadStore);

impl PostgresAppUserProfileReadStore {
    pub fn new(pool: sqlx::PgPool) -> Self {
        Self(RepositoryPostgresAppUserProfileReadStore::new(pool))
    }
}

impl AppUserProfileReadStore for PostgresAppUserProfileReadStore {
    fn load_user_profile<'a>(
        &'a self,
        subject: Option<AppUserProfileSubject>,
    ) -> AppUserProfileReadFuture<'a> {
        Box::pin(async move {
            RepositoryAppUserProfileReadStore::load_user_profile(&self.0, subject)
                .await
                .map_err(|error| DomainError::new(error.to_string()))
        })
    }
}

#[derive(Debug, Clone)]
pub struct SqliteAppUserProfileReadStore(RepositorySqliteAppUserProfileReadStore);

impl SqliteAppUserProfileReadStore {
    pub fn new(pool: sqlx::SqlitePool) -> Self {
        Self(RepositorySqliteAppUserProfileReadStore::new(pool))
    }
}

impl AppUserProfileReadStore for SqliteAppUserProfileReadStore {
    fn load_user_profile<'a>(
        &'a self,
        subject: Option<AppUserProfileSubject>,
    ) -> AppUserProfileReadFuture<'a> {
        Box::pin(async move {
            RepositoryAppUserProfileReadStore::load_user_profile(&self.0, subject)
                .await
                .map_err(|error| DomainError::new(error.to_string()))
        })
    }
}
