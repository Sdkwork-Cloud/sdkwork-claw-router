use std::error::Error;
use std::fmt::{Display, Formatter};

use crate::domain::DomainError;

#[derive(Debug)]
pub enum PostgresCatalogLoadError {
    Database(sqlx::Error),
    Domain(DomainError),
}

impl Display for PostgresCatalogLoadError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Database(error) => write!(f, "catalog database load failed: {error}"),
            Self::Domain(error) => write!(f, "catalog row mapping failed: {error}"),
        }
    }
}

impl Error for PostgresCatalogLoadError {}

impl From<sqlx::Error> for PostgresCatalogLoadError {
    fn from(value: sqlx::Error) -> Self {
        Self::Database(value)
    }
}

impl From<DomainError> for PostgresCatalogLoadError {
    fn from(value: DomainError) -> Self {
        Self::Domain(value)
    }
}
