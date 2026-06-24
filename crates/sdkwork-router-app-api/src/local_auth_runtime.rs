use std::sync::Arc;

use axum::Router;
use sdkwork_claw_config::{
    AppSessionConfig, DeploymentMode, RuntimeTomlConfig, TrustedSubjectConfig,
};
use sdkwork_clawrouter_router_service::application::{
    EntityUuidGenerator, IamRuntimeContext, PasswordHasher,
};
use sdkwork_clawrouter_router_service::infrastructure::sql::postgres::{
    PostgresAdminAuthSettingsStore, PostgresAppAuthStore, PostgresAppSessionEventStore,
    PostgresLoginContinuationStore,
};
use sdkwork_clawrouter_router_service::infrastructure::sql::sqlite::{
    SqliteAdminAuthSettingsStore, SqliteAppAuthStore, SqliteAppSessionEventStore,
    SqliteLoginContinuationStore,
};
use sdkwork_clawrouter_router_service::infrastructure::sql::{
    PostgresTenantSigningKeyStore, SqliteTenantSigningKeyStore,
};
use sdkwork_clawrouter_router_service::ports::{
    AdminAuthSettingsStore, AppAuthStore, AppSessionEventStore, LoginContinuationStore,
    TenantSigningKeyStore, VerificationCodeSender,
};
use sqlx::{PgPool, SqlitePool};

type AppAuthRuntimeStore = Arc<dyn AppAuthStore + Send + Sync>;
type AppAuthSettingsRuntimeStore = Arc<dyn AdminAuthSettingsStore + Send + Sync>;
type AppSessionAuditStore = Arc<dyn AppSessionEventStore + Send + Sync>;
pub(crate) type TenantSigningKeyRuntimeStore = Arc<dyn TenantSigningKeyStore + Send + Sync>;
pub(crate) type LoginContinuationRuntimeStore = Arc<dyn LoginContinuationStore + Send + Sync>;
type EntityUuidGen = Arc<dyn EntityUuidGenerator + Send + Sync>;
type AppVerificationCodeSender = Arc<dyn VerificationCodeSender + Send + Sync>;
type AppPasswordHasher = Arc<dyn PasswordHasher + Send + Sync>;

pub(crate) fn build_local_auth_router(
    app_auth_store: Option<AppAuthRuntimeStore>,
    app_auth_settings_store: Option<AppAuthSettingsRuntimeStore>,
    app_session_event_store: AppSessionAuditStore,
    entity_uuid_generator: EntityUuidGen,
    tenant_signing_key_store: TenantSigningKeyRuntimeStore,
    login_continuation_store: LoginContinuationRuntimeStore,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
    password_hasher: AppPasswordHasher,
    verification_code_sender: AppVerificationCodeSender,
    expose_debug_verification_code: bool,
) -> Router {
    let runtime_toml = RuntimeTomlConfig::from_env_config_file().ok().flatten();
    let deployment_mode = DeploymentMode::from_env();
    let iam_runtime = IamRuntimeContext::from_runtime_toml(deployment_mode, runtime_toml.as_ref());

    sdkwork_clawrouter_router_service::api::app_auth_router_with_runtime(
        app_auth_store
            .unwrap_or_else(sdkwork_clawrouter_router_service::api::unconfigured_app_auth_store),
        app_auth_settings_store,
        app_session_event_store,
        entity_uuid_generator,
        trusted_subject_config,
        app_session_config,
        password_hasher,
        verification_code_sender,
        expose_debug_verification_code,
        login_continuation_store,
        Some(tenant_signing_key_store),
        iam_runtime,
        runtime_toml.as_ref(),
    )
}

pub(crate) fn sqlite_local_auth_runtime_components(
    pool: SqlitePool,
    entity_uuid_generator: EntityUuidGen,
) -> (
    AppAuthRuntimeStore,
    AppAuthSettingsRuntimeStore,
    AppSessionAuditStore,
    TenantSigningKeyRuntimeStore,
    LoginContinuationRuntimeStore,
) {
    (
        Arc::new(SqliteAppAuthStore::new(pool.clone())),
        Arc::new(SqliteAdminAuthSettingsStore::new(pool.clone())),
        Arc::new(SqliteAppSessionEventStore::new(pool.clone())),
        Arc::new(SqliteTenantSigningKeyStore::new(
            pool.clone(),
            Arc::clone(&entity_uuid_generator),
        )),
        Arc::new(SqliteLoginContinuationStore::new(pool)),
    )
}

pub(crate) fn postgres_local_auth_runtime_components(
    pool: PgPool,
    entity_uuid_generator: EntityUuidGen,
) -> (
    AppAuthRuntimeStore,
    AppAuthSettingsRuntimeStore,
    AppSessionAuditStore,
    TenantSigningKeyRuntimeStore,
    LoginContinuationRuntimeStore,
) {
    (
        Arc::new(PostgresAppAuthStore::new(pool.clone())),
        Arc::new(PostgresAdminAuthSettingsStore::new(pool.clone())),
        Arc::new(PostgresAppSessionEventStore::new(pool.clone())),
        postgres_tenant_signing_key_store(pool.clone(), Arc::clone(&entity_uuid_generator)),
        Arc::new(PostgresLoginContinuationStore::new(pool)),
    )
}

pub(crate) fn postgres_tenant_signing_key_store(
    pool: PgPool,
    entity_uuid_generator: EntityUuidGen,
) -> TenantSigningKeyRuntimeStore {
    Arc::new(PostgresTenantSigningKeyStore::new(
        pool,
        entity_uuid_generator,
    ))
}
