use std::sync::Arc;

use axum::Router;
use sdkwork_claw_config::{AppSessionConfig, DeploymentMode};
use sdkwork_claw_config::DatabaseConfig as ClawDatabaseConfig;
use sdkwork_clawrouter_router_service::application::{EntityUuidGenerator, PasswordHasher};
use sdkwork_clawrouter_router_service::ports::{AppAuthStore, AppSessionEventStore};
use sdkwork_database_config::{
    DatabaseConfig as StandardDatabaseConfig, DatabaseEngine as StandardDatabaseEngine,
    SqliteConfig, SqliteJournalMode,
};
use sdkwork_database_sqlx::{DatabasePool, PoolContext};
use sdkwork_router_iam_app_api::PasswordSessionBridge;
use sqlx::{PgPool, SqlitePool};

use crate::claw_password_session_bridge::ClawPasswordSessionBridge;

pub(crate) async fn merge_appbase_oauth_device_authorization_router(
    router: Router,
    config: &ClawDatabaseConfig,
    pool: DatabasePool,
    password_session_bridge: Option<Arc<dyn PasswordSessionBridge>>,
) -> Result<Router, String> {
    match sdkwork_router_iam_app_api::build_sdkwork_appbase_oauth_device_authorization_router_with_pool_and_password_session_bridge(
        pool,
        password_session_bridge,
    )
    .await
    {
        Ok(iam_router) => Ok(router.merge(iam_router)),
        Err(error) => {
            if DeploymentMode::from_env().is_production_like() {
                return Err(format!(
                    "appbase oauth device authorization routes are required in production-like deployments ({error})"
                ));
            }
            tracing::warn!(
                database_engine = ?config.engine,
                %error,
                "appbase oauth device authorization routes are unavailable"
            );
            Ok(router)
        }
    }
}

pub(crate) fn build_claw_password_session_bridge(
    auth_store: Arc<dyn AppAuthStore + Send + Sync>,
    password_hasher: Arc<dyn PasswordHasher + Send + Sync>,
    app_session_config: AppSessionConfig,
    event_store: Arc<dyn AppSessionEventStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    tenant_signing_key_store: Option<
        Arc<dyn sdkwork_clawrouter_router_service::ports::TenantSigningKeyStore + Send + Sync>,
    >,
) -> Arc<dyn PasswordSessionBridge> {
    Arc::new(ClawPasswordSessionBridge::new(
        auth_store,
        password_hasher,
        app_session_config,
        event_store,
        entity_uuid_generator,
        tenant_signing_key_store,
    ))
}

pub(crate) fn password_session_bridge_for_database(
    auth_store: Arc<dyn AppAuthStore + Send + Sync>,
    password_hasher: Arc<dyn PasswordHasher + Send + Sync>,
    app_session_config: AppSessionConfig,
    event_store: Arc<dyn AppSessionEventStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    tenant_signing_key_store: Option<
        Arc<dyn sdkwork_clawrouter_router_service::ports::TenantSigningKeyStore + Send + Sync>,
    >,
) -> Arc<dyn PasswordSessionBridge> {
    build_claw_password_session_bridge(
        auth_store,
        password_hasher,
        app_session_config,
        event_store,
        entity_uuid_generator,
        tenant_signing_key_store,
    )
}

#[allow(clippy::too_many_arguments)]
pub(crate) fn sqlite_password_session_bridge_for_engine(
    config: &ClawDatabaseConfig,
    auth_store: Arc<dyn AppAuthStore + Send + Sync>,
    password_hasher: Arc<dyn PasswordHasher + Send + Sync>,
    app_session_config: AppSessionConfig,
    event_store: Arc<dyn AppSessionEventStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    tenant_signing_key_store: Option<
        Arc<dyn sdkwork_clawrouter_router_service::ports::TenantSigningKeyStore + Send + Sync>,
    >,
) -> Option<Arc<dyn PasswordSessionBridge>> {
    let _ = config;
    Some(password_session_bridge_for_database(
        auth_store,
        password_hasher,
        app_session_config,
        event_store,
        entity_uuid_generator,
        tenant_signing_key_store,
    ))
}

pub(crate) fn sqlite_database_pool(config: &ClawDatabaseConfig, pool: SqlitePool) -> DatabasePool {
    DatabasePool::Sqlite(
        pool,
        PoolContext {
            config: standard_database_config_from_claw(config),
        },
    )
}

pub(crate) fn postgres_database_pool(config: &ClawDatabaseConfig, pool: PgPool) -> DatabasePool {
    DatabasePool::Postgres(
        pool,
        PoolContext {
            config: standard_database_config_from_claw(config),
        },
    )
}

fn standard_database_config_from_claw(config: &ClawDatabaseConfig) -> StandardDatabaseConfig {
    let engine = match config.engine {
        sdkwork_claw_config::DatabaseEngine::Sqlite => StandardDatabaseEngine::Sqlite,
        sdkwork_claw_config::DatabaseEngine::Postgres => StandardDatabaseEngine::Postgres,
    };
    StandardDatabaseConfig {
        engine,
        url: config.url.clone(),
        max_connections: config.max_connections,
        sqlite: SqliteConfig {
            journal_mode: SqliteJournalMode::Wal,
            busy_timeout_secs: 30,
            foreign_keys: true,
            create_if_missing: true,
            ..SqliteConfig::default()
        },
        ..StandardDatabaseConfig::default()
    }
}
