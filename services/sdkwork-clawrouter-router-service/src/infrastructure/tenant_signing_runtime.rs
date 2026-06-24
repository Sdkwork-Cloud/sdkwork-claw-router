use std::sync::Arc;

use sdkwork_claw_config::{DatabaseConfig, DatabaseEngine};

use crate::application::EntityUuidGenerator;
use crate::infrastructure::sql::pool::{
    connect_claw_sqlite_runtime_pool, connect_postgres_runtime_pool,
};
use crate::infrastructure::sql::{PostgresTenantSigningKeyStore, SqliteTenantSigningKeyStore};
use crate::infrastructure::OsApiKeySecretGenerator;
use crate::ports::TenantSigningKeyStore;

pub async fn tenant_signing_key_store_for_database_config(
    config: &DatabaseConfig,
) -> Result<Arc<dyn TenantSigningKeyStore + Send + Sync>, String> {
    let entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync> =
        Arc::new(OsApiKeySecretGenerator);
    match config.engine {
        DatabaseEngine::Sqlite => {
            let pool = connect_claw_sqlite_runtime_pool(config)
                .await
                .map_err(|error| error.to_string())?;
            Ok(Arc::new(SqliteTenantSigningKeyStore::new(
                pool,
                entity_uuid_generator,
            )))
        }
        DatabaseEngine::Postgres => {
            let pool = connect_postgres_runtime_pool(&config.url, config.max_connections)
                .await
                .map_err(|error| error.to_string())?;
            Ok(Arc::new(PostgresTenantSigningKeyStore::new(
                pool,
                entity_uuid_generator,
            )))
        }
    }
}
