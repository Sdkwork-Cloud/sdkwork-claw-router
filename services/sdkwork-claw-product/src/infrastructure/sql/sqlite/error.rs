use std::error::Error;
use std::fmt::{Display, Formatter};

use crate::domain::DomainError;

#[derive(Debug)]
pub enum SqlCatalogLoadError {
    Database(sqlx::Error),
    Domain(DomainError),
}

impl Display for SqlCatalogLoadError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Database(error) => write!(f, "catalog database load failed: {error}"),
            Self::Domain(error) => write!(f, "catalog row mapping failed: {error}"),
        }
    }
}

impl Error for SqlCatalogLoadError {}

impl From<sqlx::Error> for SqlCatalogLoadError {
    fn from(value: sqlx::Error) -> Self {
        Self::Database(value)
    }
}

impl From<DomainError> for SqlCatalogLoadError {
    fn from(value: DomainError) -> Self {
        Self::Domain(value)
    }
}
