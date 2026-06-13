use std::sync::Arc;

use axum::Router;
use sdkwork_claw_config::{AppSessionConfig, TrustedSubjectConfig};
use sdkwork_claw_product::application::{EntityUuidGenerator, PasswordHasher};
use sdkwork_claw_product::infrastructure::sql::postgres::{
    PostgresAdminAuthSettingsStore, PostgresAppAuthStore, PostgresAppSessionEventStore,
};
use sdkwork_claw_product::infrastructure::sql::sqlite::{
    SqliteAdminAuthSettingsStore, SqliteAppAuthStore, SqliteAppSessionEventStore,
};
use sdkwork_claw_product::ports::{
    AdminAuthSettingsStore, AppAuthStore, AppSessionEventStore, VerificationCodeSender,
};
use sqlx::{PgPool, SqlitePool};

type AppAuthRuntimeStore = Arc<dyn AppAuthStore + Send + Sync>;
type AppAuthSettingsRuntimeStore = Arc<dyn AdminAuthSettingsStore + Send + Sync>;
type AppSessionAuditStore = Arc<dyn AppSessionEventStore + Send + Sync>;
type EntityUuidGen = Arc<dyn EntityUuidGenerator + Send + Sync>;
type AppVerificationCodeSender = Arc<dyn VerificationCodeSender + Send + Sync>;
type AppPasswordHasher = Arc<dyn PasswordHasher + Send + Sync>;

pub(crate) fn build_local_auth_router(
    app_auth_store: Option<AppAuthRuntimeStore>,
    app_auth_settings_store: Option<AppAuthSettingsRuntimeStore>,
    app_session_event_store: AppSessionAuditStore,
    entity_uuid_generator: EntityUuidGen,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
    password_hasher: AppPasswordHasher,
    verification_code_sender: AppVerificationCodeSender,
    expose_debug_verification_code: bool,
) -> Router {
    let public_auth_router =
        sdkwork_claw_product::api::app_public_auth_router_with_store_auth_settings_store_and_verification_sender(
            app_auth_store.clone(),
            app_auth_settings_store.clone(),
            Arc::clone(&app_session_event_store),
            Arc::clone(&entity_uuid_generator),
            trusted_subject_config.clone(),
            app_session_config.clone(),
            Arc::clone(&password_hasher),
            Arc::clone(&verification_code_sender),
            expose_debug_verification_code,
        );
    sdkwork_claw_product::api::app_sessions_router_with_store_and_verification_sender(
        app_auth_store,
        app_auth_settings_store,
        app_session_event_store,
        entity_uuid_generator,
        trusted_subject_config,
        app_session_config,
        password_hasher,
        verification_code_sender,
        expose_debug_verification_code,
    )
    .merge(public_auth_router)
}

pub(crate) fn sqlite_local_auth_runtime_components(
    pool: SqlitePool,
) -> (
    AppAuthRuntimeStore,
    AppAuthSettingsRuntimeStore,
    AppSessionAuditStore,
) {
    (
        Arc::new(SqliteAppAuthStore::new(pool.clone())),
        Arc::new(SqliteAdminAuthSettingsStore::new(pool.clone())),
        Arc::new(SqliteAppSessionEventStore::new(pool)),
    )
}

pub(crate) fn postgres_local_auth_runtime_components(
    pool: PgPool,
) -> (
    AppAuthRuntimeStore,
    AppAuthSettingsRuntimeStore,
    AppSessionAuditStore,
) {
    (
        Arc::new(PostgresAppAuthStore::new(pool.clone())),
        Arc::new(PostgresAdminAuthSettingsStore::new(pool.clone())),
        Arc::new(PostgresAppSessionEventStore::new(pool)),
    )
}
