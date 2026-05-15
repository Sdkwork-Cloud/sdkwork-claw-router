use std::sync::Arc;

use axum::middleware::from_fn_with_state;
use axum::Router;
use sdkwork_claw_config::{
    ApiKeySecurityConfig, AppSessionConfig, DatabaseConfig, DatabaseEngine, DeploymentMode,
    ProviderSecretMapConfig, RuntimeConfigProfile, StartupInstallMode, TrustedSubjectConfig,
};
use sdkwork_claw_product::application::{ApiKeySecretHasher, ModelRankingsService};
use sdkwork_claw_product::infrastructure::crypto::HmacSha256ApiKeySecretHasher;
use sdkwork_claw_product::infrastructure::provider::{
    ProviderSecretMapResolver, SecretRefOpenAiCompatibleProviderHealthProbe,
};
use sdkwork_claw_product::infrastructure::sql::installer::{
    DatabaseInstallError, DatabaseInstaller,
};
use sdkwork_claw_product::infrastructure::sql::postgres::{
    PostgresAdminAccessGroupStore, PostgresAdminAnnouncementStore,
    PostgresAdminApiKeyRateLimitStore, PostgresAdminAppStore, PostgresAdminAuthSettingsStore,
    PostgresAdminChannelStore, PostgresAdminFinanceStore, PostgresAdminFirewallRuleStore,
    PostgresAdminIpRateLimitStore, PostgresAdminMarketingStore, PostgresAdminModelRateLimitStore,
    PostgresAdminModelStore, PostgresAdminMonitorReadStore, PostgresAdminProviderSecretStore,
    PostgresAdminRecordStore, PostgresAdminSkillStore, PostgresAdminUserStore,
    PostgresCatalogLoadError, PostgresModelRankingRefreshStore, PostgresModelRankingsReadStore,
    PostgresPricingCatalogLoader,
};
use sdkwork_claw_product::infrastructure::sql::sqlite::{
    SqlCatalogLoadError, SqliteAdminAccessGroupStore, SqliteAdminAnnouncementStore,
    SqliteAdminApiKeyRateLimitStore, SqliteAdminAppStore, SqliteAdminAuthSettingsStore,
    SqliteAdminChannelStore, SqliteAdminFinanceStore, SqliteAdminFirewallRuleStore,
    SqliteAdminIpRateLimitStore, SqliteAdminMarketingStore, SqliteAdminModelRateLimitStore,
    SqliteAdminModelStore, SqliteAdminMonitorReadStore, SqliteAdminProviderSecretStore,
    SqliteAdminRecordStore, SqliteAdminSkillStore, SqliteAdminUserStore,
    SqliteModelRankingRefreshStore, SqliteModelRankingsReadStore, SqlitePricingCatalogLoader,
};
use sdkwork_claw_product::infrastructure::OsApiKeySecretGenerator;
use sdkwork_claw_product::ports::{
    AdminAccessGroupStore, AdminAnnouncementStore, AdminApiKeyRateLimitStore, AdminAppStore,
    AdminAuthSettingsStore, AdminChannelStore, AdminFinanceStore, AdminFirewallRuleStore,
    AdminIpRateLimitStore, AdminMarketingStore, AdminModelRateLimitStore, AdminModelStore,
    AdminMonitorReadStore, AdminProviderSecretStore, AdminRecordStore, AdminSkillStore,
    AdminUserStore, ModelRankingRefreshStore, ModelRankingsReadModelStore, PricingCatalog,
    ProviderHealthProbe, UnconfiguredProviderHealthProbe,
};
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};
use sqlx::{PgPool, SqlitePool};
use std::str::FromStr;

pub const SERVICE_NAME: &str = "sdkwork-claw-admin-api";
type ApiKeyHasher = Arc<dyn ApiKeySecretHasher + Send + Sync>;
type AdminAnnouncementRuntimeStore = Arc<dyn AdminAnnouncementStore + Send + Sync>;
type AdminAppRuntimeStore = Arc<dyn AdminAppStore + Send + Sync>;
type AdminAuthSettingsRuntimeStore = Arc<dyn AdminAuthSettingsStore + Send + Sync>;
type AdminChannelRuntimeStore = Arc<dyn AdminChannelStore + Send + Sync>;
type AdminProviderSecretRuntimeStore = Arc<dyn AdminProviderSecretStore + Send + Sync>;
type AdminAccessGroupRuntimeStore = Arc<dyn AdminAccessGroupStore + Send + Sync>;
type AdminIpRateLimitRuntimeStore = Arc<dyn AdminIpRateLimitStore + Send + Sync>;
type AdminFirewallRuleRuntimeStore = Arc<dyn AdminFirewallRuleStore + Send + Sync>;
type AdminApiKeyRateLimitRuntimeStore = Arc<dyn AdminApiKeyRateLimitStore + Send + Sync>;
type AdminModelRateLimitRuntimeStore = Arc<dyn AdminModelRateLimitStore + Send + Sync>;
type AdminModelRuntimeStore = Arc<dyn AdminModelStore + Send + Sync>;
type AdminFinanceRuntimeStore = Arc<dyn AdminFinanceStore + Send + Sync>;
type AdminMarketingRuntimeStore = Arc<dyn AdminMarketingStore + Send + Sync>;
type AdminMonitorRuntimeReadStore = Arc<dyn AdminMonitorReadStore + Send + Sync>;
type AdminRecordRuntimeStore = Arc<dyn AdminRecordStore + Send + Sync>;
type AdminSkillRuntimeStore = Arc<dyn AdminSkillStore + Send + Sync>;
type AdminUserRuntimeStore = Arc<dyn AdminUserStore + Send + Sync>;
type ModelRankingsRuntimeStore = Arc<dyn ModelRankingsReadModelStore + Send + Sync>;
type ModelRankingRefreshRuntimeStore = Arc<dyn ModelRankingRefreshStore + Send + Sync>;
type ProviderHealthProbeRuntime = Arc<dyn ProviderHealthProbe + Send + Sync>;
type DatabaseInstallerRuntime = Arc<DatabaseInstaller>;

#[derive(Default)]
struct AdminRouterRuntime<'a> {
    database_config: Option<&'a DatabaseConfig>,
    api_key_hasher: Option<ApiKeyHasher>,
    announcement_store: Option<AdminAnnouncementRuntimeStore>,
    app_store: Option<AdminAppRuntimeStore>,
    auth_settings_store: Option<AdminAuthSettingsRuntimeStore>,
    channel_store: Option<AdminChannelRuntimeStore>,
    provider_secret_store: Option<AdminProviderSecretRuntimeStore>,
    access_group_store: Option<AdminAccessGroupRuntimeStore>,
    ip_rate_limit_store: Option<AdminIpRateLimitRuntimeStore>,
    firewall_rule_store: Option<AdminFirewallRuleRuntimeStore>,
    api_key_rate_limit_store: Option<AdminApiKeyRateLimitRuntimeStore>,
    model_rate_limit_store: Option<AdminModelRateLimitRuntimeStore>,
    model_store: Option<AdminModelRuntimeStore>,
    finance_store: Option<AdminFinanceRuntimeStore>,
    marketing_store: Option<AdminMarketingRuntimeStore>,
    monitor_read_store: Option<AdminMonitorRuntimeReadStore>,
    record_store: Option<AdminRecordRuntimeStore>,
    skill_store: Option<AdminSkillRuntimeStore>,
    user_store: Option<AdminUserRuntimeStore>,
    model_rankings_store: Option<ModelRankingsRuntimeStore>,
    model_ranking_refresh_store: Option<ModelRankingRefreshRuntimeStore>,
    database_installer: Option<DatabaseInstallerRuntime>,
    trusted_subject_config: Option<TrustedSubjectConfig>,
    app_session_config: Option<AppSessionConfig>,
}

pub fn router() -> Router {
    router_with_database_status(None)
}

fn router_with_database_status(config: Option<&DatabaseConfig>) -> Router {
    sdkwork_claw_http::service_router_with_contract_routes_and_database_config(
        SERVICE_NAME,
        sdkwork_claw_http::ApiSurface::Backend,
        config,
    )
}

pub fn router_with_product_catalog<C>(catalog: Arc<C>) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    router_with_product_catalog_and_runtime(catalog, AdminRouterRuntime::default())
}

fn router_with_product_catalog_and_runtime<C>(
    catalog: Arc<C>,
    runtime: AdminRouterRuntime<'_>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let AdminRouterRuntime {
        database_config,
        api_key_hasher,
        announcement_store,
        app_store,
        auth_settings_store,
        channel_store,
        provider_secret_store,
        access_group_store,
        ip_rate_limit_store,
        firewall_rule_store,
        api_key_rate_limit_store,
        model_rate_limit_store,
        model_store,
        finance_store,
        marketing_store,
        monitor_read_store,
        record_store,
        skill_store,
        user_store,
        model_rankings_store,
        model_ranking_refresh_store,
        database_installer,
        trusted_subject_config,
        app_session_config,
    } = runtime;

    let catalog_router = match api_key_hasher.as_ref() {
        Some(hasher) => sdkwork_claw_product::api::admin_model_catalog_router_with_api_key_hasher(
            catalog,
            Arc::clone(hasher),
        ),
        None => sdkwork_claw_product::api::admin_model_catalog_router(catalog),
    };
    let mut router = router_with_database_status(database_config);
    if model_store.is_none() {
        router = router.merge(catalog_router);
    }
    if let Some(installer) = database_installer {
        router =
            router.merge(sdkwork_claw_product::api::admin_system_router_with_installer(installer));
    }
    let subject_boundary_config = match (trusted_subject_config.clone(), app_session_config.clone())
    {
        (Some(trusted_subject_config), Some(app_session_config)) => {
            Some(sdkwork_claw_http::AppSubjectBoundaryConfig::new(
                trusted_subject_config,
                app_session_config,
            ))
        }
        _ => None,
    };

    if let (Some(store), Some(subject_boundary_config)) =
        (model_store.clone(), subject_boundary_config.clone())
    {
        router = router.merge(
            sdkwork_claw_product::api::admin_model_management_router_with_store(
                store,
                Arc::new(OsApiKeySecretGenerator),
            )
            .layer(from_fn_with_state(
                subject_boundary_config,
                sdkwork_claw_http::app_request_subject_boundary,
            )),
        );
    }
    router = match (
        model_rankings_store,
        model_ranking_refresh_store,
        subject_boundary_config,
    ) {
        (Some(read_store), Some(refresh_store), Some(subject_boundary_config)) => router.merge(
            sdkwork_claw_product::api::admin_model_rankings_router_with_read_store_and_refresh_store(
                read_store,
                refresh_store,
            )
            .layer(from_fn_with_state(
                subject_boundary_config,
                sdkwork_claw_http::app_request_subject_boundary,
            )),
        ),
        (Some(read_store), Some(refresh_store), None) => router.merge(
            sdkwork_claw_product::api::admin_model_rankings_router_with_read_store_and_refresh_store(
                read_store,
                refresh_store,
            ),
        ),
        (Some(read_store), None, Some(subject_boundary_config)) => router.merge(
            sdkwork_claw_product::api::admin_model_rankings_router_with_read_store(read_store)
                .layer(from_fn_with_state(
                    subject_boundary_config,
                    sdkwork_claw_http::app_request_subject_boundary,
                )),
        ),
        (Some(read_store), None, None) => router.merge(
            sdkwork_claw_product::api::admin_model_rankings_router_with_read_store(read_store),
        ),
        (None, _, _) => router.merge(sdkwork_claw_product::api::admin_model_rankings_router()),
    };
    if let (Some(trusted_subject_config), Some(app_session_config)) =
        (trusted_subject_config, app_session_config)
    {
        if let Some(store) = announcement_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_announcement_router_with_store(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    sdkwork_claw_http::AppSubjectBoundaryConfig::new(
                        trusted_subject_config.clone(),
                        app_session_config.clone(),
                    ),
                    sdkwork_claw_http::app_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = app_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_app_router_with_store(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    sdkwork_claw_http::AppSubjectBoundaryConfig::new(
                        trusted_subject_config.clone(),
                        app_session_config.clone(),
                    ),
                    sdkwork_claw_http::app_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = auth_settings_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_auth_settings_router_with_store(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    sdkwork_claw_http::AppSubjectBoundaryConfig::new(
                        trusted_subject_config.clone(),
                        app_session_config.clone(),
                    ),
                    sdkwork_claw_http::app_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = channel_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_channel_router_with_store(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    sdkwork_claw_http::AppSubjectBoundaryConfig::new(
                        trusted_subject_config.clone(),
                        app_session_config.clone(),
                    ),
                    sdkwork_claw_http::app_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = provider_secret_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_provider_secret_router_with_store(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    sdkwork_claw_http::AppSubjectBoundaryConfig::new(
                        trusted_subject_config.clone(),
                        app_session_config.clone(),
                    ),
                    sdkwork_claw_http::app_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = access_group_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_access_group_router_with_store(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    sdkwork_claw_http::AppSubjectBoundaryConfig::new(
                        trusted_subject_config.clone(),
                        app_session_config.clone(),
                    ),
                    sdkwork_claw_http::app_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = ip_rate_limit_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_ip_rate_limit_router_with_store(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    sdkwork_claw_http::AppSubjectBoundaryConfig::new(
                        trusted_subject_config.clone(),
                        app_session_config.clone(),
                    ),
                    sdkwork_claw_http::app_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = firewall_rule_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_firewall_rule_router_with_store(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    sdkwork_claw_http::AppSubjectBoundaryConfig::new(
                        trusted_subject_config.clone(),
                        app_session_config.clone(),
                    ),
                    sdkwork_claw_http::app_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = api_key_rate_limit_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_api_key_rate_limit_router_with_store(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    sdkwork_claw_http::AppSubjectBoundaryConfig::new(
                        trusted_subject_config.clone(),
                        app_session_config.clone(),
                    ),
                    sdkwork_claw_http::app_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = model_rate_limit_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_model_rate_limit_router_with_store(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    sdkwork_claw_http::AppSubjectBoundaryConfig::new(
                        trusted_subject_config.clone(),
                        app_session_config.clone(),
                    ),
                    sdkwork_claw_http::app_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = finance_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_finance_router_with_store(store).layer(
                    from_fn_with_state(
                        sdkwork_claw_http::AppSubjectBoundaryConfig::new(
                            trusted_subject_config.clone(),
                            app_session_config.clone(),
                        ),
                        sdkwork_claw_http::app_request_subject_boundary,
                    ),
                ),
            );
        }
        if let Some(store) = marketing_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_marketing_router_with_store(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    sdkwork_claw_http::AppSubjectBoundaryConfig::new(
                        trusted_subject_config.clone(),
                        app_session_config.clone(),
                    ),
                    sdkwork_claw_http::app_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = monitor_read_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_monitor_router_with_read_store(store).layer(
                    from_fn_with_state(
                        sdkwork_claw_http::AppSubjectBoundaryConfig::new(
                            trusted_subject_config.clone(),
                            app_session_config.clone(),
                        ),
                        sdkwork_claw_http::app_request_subject_boundary,
                    ),
                ),
            );
        }
        if let Some(store) = record_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_record_router_with_store(store).layer(
                    from_fn_with_state(
                        sdkwork_claw_http::AppSubjectBoundaryConfig::new(
                            trusted_subject_config.clone(),
                            app_session_config.clone(),
                        ),
                        sdkwork_claw_http::app_request_subject_boundary,
                    ),
                ),
            );
        }
        if let Some(store) = skill_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_skill_router_with_store(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    sdkwork_claw_http::AppSubjectBoundaryConfig::new(
                        trusted_subject_config.clone(),
                        app_session_config.clone(),
                    ),
                    sdkwork_claw_http::app_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = user_store {
            router =
                router.merge(
                    sdkwork_claw_product::api::admin_user_router_with_store(
                        store,
                        Arc::clone(api_key_hasher.as_ref().expect(
                            "api key hasher must exist when admin user routes are mounted",
                        )),
                        Arc::new(OsApiKeySecretGenerator),
                    )
                    .layer(from_fn_with_state(
                        sdkwork_claw_http::AppSubjectBoundaryConfig::new(
                            trusted_subject_config,
                            app_session_config,
                        ),
                        sdkwork_claw_http::app_request_subject_boundary,
                    )),
                );
        }
    }
    router
}

pub async fn router_with_sqlite_product_catalog(
    pool: SqlitePool,
) -> Result<Router, SqlCatalogLoadError> {
    let snapshot = SqlitePricingCatalogLoader::new(pool)
        .load_snapshot()
        .await?;
    Ok(router_with_product_catalog_and_runtime(
        Arc::new(snapshot),
        AdminRouterRuntime::default(),
    ))
}

pub async fn router_with_postgres_product_catalog(
    pool: PgPool,
) -> Result<Router, PostgresCatalogLoadError> {
    let snapshot = PostgresPricingCatalogLoader::new(pool)
        .load_snapshot()
        .await?;
    Ok(router_with_product_catalog_and_runtime(
        Arc::new(snapshot),
        AdminRouterRuntime::default(),
    ))
}

pub async fn router_with_database_config(
    config: DatabaseConfig,
) -> Result<Router, ProductCatalogRouterError> {
    let api_key_config = require_api_key_security_config(
        ApiKeySecurityConfig::from_env().map_err(ProductCatalogRouterError::Config)?,
    )?;
    let trusted_subject_config = require_trusted_subject_config(
        TrustedSubjectConfig::from_env().map_err(ProductCatalogRouterError::Config)?,
    )?;
    let app_session_config = require_app_session_config(
        AppSessionConfig::from_env().map_err(ProductCatalogRouterError::Config)?,
    )?;
    let provider_secret_map_config =
        ProviderSecretMapConfig::from_env().map_err(ProductCatalogRouterError::Config)?;
    router_with_database_api_key_trusted_subject_app_session_and_optional_provider_secret_map_config(
        config,
        Some(api_key_config),
        Some(trusted_subject_config),
        Some(app_session_config),
        provider_secret_map_config,
    )
    .await
}

pub async fn router_with_database_and_api_key_config(
    config: DatabaseConfig,
    api_key_config: Option<ApiKeySecurityConfig>,
    trusted_subject_config: Option<TrustedSubjectConfig>,
    app_session_config: Option<AppSessionConfig>,
) -> Result<Router, ProductCatalogRouterError> {
    router_with_database_api_key_trusted_subject_app_session_and_optional_provider_secret_map_config(
        config,
        api_key_config,
        trusted_subject_config,
        app_session_config,
        None,
    )
    .await
}

pub async fn router_with_database_api_key_trusted_subject_app_session_and_provider_secret_map_config(
    config: DatabaseConfig,
    api_key_config: ApiKeySecurityConfig,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
    provider_secret_map_config: ProviderSecretMapConfig,
) -> Result<Router, ProductCatalogRouterError> {
    router_with_database_api_key_trusted_subject_app_session_and_optional_provider_secret_map_config(
        config,
        Some(api_key_config),
        Some(trusted_subject_config),
        Some(app_session_config),
        Some(provider_secret_map_config),
    )
    .await
}

async fn router_with_database_api_key_trusted_subject_app_session_and_optional_provider_secret_map_config(
    config: DatabaseConfig,
    api_key_config: Option<ApiKeySecurityConfig>,
    trusted_subject_config: Option<TrustedSubjectConfig>,
    app_session_config: Option<AppSessionConfig>,
    provider_secret_map_config: Option<ProviderSecretMapConfig>,
) -> Result<Router, ProductCatalogRouterError> {
    router_with_database_api_key_trusted_subject_app_session_and_optional_provider_secret_map_config_and_startup_install_mode(
        config,
        api_key_config,
        trusted_subject_config,
        app_session_config,
        provider_secret_map_config,
        StartupInstallMode::Ensure,
    )
    .await
}

async fn router_with_database_api_key_trusted_subject_app_session_and_optional_provider_secret_map_config_and_startup_install_mode(
    config: DatabaseConfig,
    api_key_config: Option<ApiKeySecurityConfig>,
    trusted_subject_config: Option<TrustedSubjectConfig>,
    app_session_config: Option<AppSessionConfig>,
    provider_secret_map_config: Option<ProviderSecretMapConfig>,
    startup_install_mode: StartupInstallMode,
) -> Result<Router, ProductCatalogRouterError> {
    let api_key_hasher = build_api_key_hasher(api_key_config)?;
    let trusted_subject_config = require_trusted_subject_config(trusted_subject_config)?;
    let app_session_config = require_app_session_config(app_session_config)?;
    let provider_health_probe = build_provider_health_probe(provider_secret_map_config);
    match config.engine {
        DatabaseEngine::Sqlite => {
            let sqlite_options = SqliteConnectOptions::from_str(config.url.as_str())
                .map_err(|error| {
                    ProductCatalogRouterError::Sqlite(SqlCatalogLoadError::Database(error))
                })?
                .create_if_missing(true);
            let pool = SqlitePoolOptions::new()
                .max_connections(config.max_connections)
                .connect_with(sqlite_options)
                .await
                .map_err(|error| {
                    ProductCatalogRouterError::Sqlite(SqlCatalogLoadError::Database(error))
                })?;
            let database_installer =
                Arc::new(DatabaseInstaller::for_sqlite(pool.clone()).with_env_options()?);
            if startup_install_mode.should_ensure() {
                database_installer.ensure_installed().await?;
            }
            let snapshot = SqlitePricingCatalogLoader::new(pool.clone())
                .load_snapshot()
                .await?;
            let announcement_store: AdminAnnouncementRuntimeStore =
                Arc::new(SqliteAdminAnnouncementStore::new(pool.clone()));
            let app_store: AdminAppRuntimeStore = Arc::new(SqliteAdminAppStore::new(pool.clone()));
            let auth_settings_store: AdminAuthSettingsRuntimeStore =
                Arc::new(SqliteAdminAuthSettingsStore::new(pool.clone()));
            let channel_store: AdminChannelRuntimeStore =
                Arc::new(SqliteAdminChannelStore::with_provider_health_probe(
                    pool.clone(),
                    provider_health_probe.clone(),
                ));
            let provider_secret_store: AdminProviderSecretRuntimeStore =
                Arc::new(SqliteAdminProviderSecretStore::new(pool.clone()));
            let access_group_store: AdminAccessGroupRuntimeStore =
                Arc::new(SqliteAdminAccessGroupStore::new(pool.clone()));
            let ip_rate_limit_store: AdminIpRateLimitRuntimeStore =
                Arc::new(SqliteAdminIpRateLimitStore::new(pool.clone()));
            let firewall_rule_store: AdminFirewallRuleRuntimeStore =
                Arc::new(SqliteAdminFirewallRuleStore::new(pool.clone()));
            let api_key_rate_limit_store: AdminApiKeyRateLimitRuntimeStore =
                Arc::new(SqliteAdminApiKeyRateLimitStore::new(pool.clone()));
            let model_rate_limit_store: AdminModelRateLimitRuntimeStore =
                Arc::new(SqliteAdminModelRateLimitStore::new(pool.clone()));
            let model_store: AdminModelRuntimeStore =
                Arc::new(SqliteAdminModelStore::new(pool.clone()));
            let finance_store: AdminFinanceRuntimeStore =
                Arc::new(SqliteAdminFinanceStore::new(pool.clone()));
            let marketing_store: AdminMarketingRuntimeStore =
                Arc::new(SqliteAdminMarketingStore::new(pool.clone()));
            let monitor_read_store: AdminMonitorRuntimeReadStore =
                Arc::new(SqliteAdminMonitorReadStore::new(pool.clone()));
            let record_store: AdminRecordRuntimeStore =
                Arc::new(SqliteAdminRecordStore::new(pool.clone()));
            let skill_store: AdminSkillRuntimeStore =
                Arc::new(SqliteAdminSkillStore::new(pool.clone()));
            let model_rankings_store: ModelRankingsRuntimeStore =
                model_rankings_service(Arc::new(SqliteModelRankingsReadStore::new(pool.clone())));
            let model_ranking_refresh_store: ModelRankingRefreshRuntimeStore =
                Arc::new(SqliteModelRankingRefreshStore::new(pool.clone()));
            let user_store: AdminUserRuntimeStore = Arc::new(SqliteAdminUserStore::new(pool));
            Ok(router_with_product_catalog_and_runtime(
                Arc::new(snapshot),
                AdminRouterRuntime {
                    database_config: Some(&config),
                    api_key_hasher: Some(Arc::clone(&api_key_hasher)),
                    announcement_store: Some(announcement_store),
                    app_store: Some(app_store),
                    auth_settings_store: Some(auth_settings_store),
                    channel_store: Some(channel_store),
                    provider_secret_store: Some(provider_secret_store),
                    access_group_store: Some(access_group_store),
                    ip_rate_limit_store: Some(ip_rate_limit_store),
                    firewall_rule_store: Some(firewall_rule_store),
                    api_key_rate_limit_store: Some(api_key_rate_limit_store),
                    model_rate_limit_store: Some(model_rate_limit_store),
                    model_store: Some(model_store),
                    finance_store: Some(finance_store),
                    marketing_store: Some(marketing_store),
                    monitor_read_store: Some(monitor_read_store),
                    record_store: Some(record_store),
                    skill_store: Some(skill_store),
                    user_store: Some(user_store),
                    model_rankings_store: Some(model_rankings_store),
                    model_ranking_refresh_store: Some(model_ranking_refresh_store),
                    database_installer: Some(Arc::clone(&database_installer)),
                    trusted_subject_config: Some(trusted_subject_config),
                    app_session_config: Some(app_session_config),
                },
            ))
        }
        DatabaseEngine::Postgres => {
            let pool = sqlx::postgres::PgPoolOptions::new()
                .max_connections(config.max_connections)
                .connect(&config.url)
                .await
                .map_err(|error| {
                    ProductCatalogRouterError::Postgres(PostgresCatalogLoadError::Database(error))
                })?;
            let database_installer =
                Arc::new(DatabaseInstaller::for_postgres(pool.clone()).with_env_options()?);
            if startup_install_mode.should_ensure() {
                database_installer.ensure_installed().await?;
            }
            let snapshot = PostgresPricingCatalogLoader::new(pool.clone())
                .load_snapshot()
                .await?;
            let announcement_store: AdminAnnouncementRuntimeStore =
                Arc::new(PostgresAdminAnnouncementStore::new(pool.clone()));
            let app_store: AdminAppRuntimeStore =
                Arc::new(PostgresAdminAppStore::new(pool.clone()));
            let auth_settings_store: AdminAuthSettingsRuntimeStore =
                Arc::new(PostgresAdminAuthSettingsStore::new(pool.clone()));
            let channel_store: AdminChannelRuntimeStore =
                Arc::new(PostgresAdminChannelStore::with_provider_health_probe(
                    pool.clone(),
                    provider_health_probe,
                ));
            let provider_secret_store: AdminProviderSecretRuntimeStore =
                Arc::new(PostgresAdminProviderSecretStore::new(pool.clone()));
            let access_group_store: AdminAccessGroupRuntimeStore =
                Arc::new(PostgresAdminAccessGroupStore::new(pool.clone()));
            let ip_rate_limit_store: AdminIpRateLimitRuntimeStore =
                Arc::new(PostgresAdminIpRateLimitStore::new(pool.clone()));
            let firewall_rule_store: AdminFirewallRuleRuntimeStore =
                Arc::new(PostgresAdminFirewallRuleStore::new(pool.clone()));
            let api_key_rate_limit_store: AdminApiKeyRateLimitRuntimeStore =
                Arc::new(PostgresAdminApiKeyRateLimitStore::new(pool.clone()));
            let model_rate_limit_store: AdminModelRateLimitRuntimeStore =
                Arc::new(PostgresAdminModelRateLimitStore::new(pool.clone()));
            let model_store: AdminModelRuntimeStore =
                Arc::new(PostgresAdminModelStore::new(pool.clone()));
            let finance_store: AdminFinanceRuntimeStore =
                Arc::new(PostgresAdminFinanceStore::new(pool.clone()));
            let marketing_store: AdminMarketingRuntimeStore =
                Arc::new(PostgresAdminMarketingStore::new(pool.clone()));
            let monitor_read_store: AdminMonitorRuntimeReadStore =
                Arc::new(PostgresAdminMonitorReadStore::new(pool.clone()));
            let record_store: AdminRecordRuntimeStore =
                Arc::new(PostgresAdminRecordStore::new(pool.clone()));
            let skill_store: AdminSkillRuntimeStore =
                Arc::new(PostgresAdminSkillStore::new(pool.clone()));
            let model_rankings_store: ModelRankingsRuntimeStore =
                model_rankings_service(Arc::new(PostgresModelRankingsReadStore::new(pool.clone())));
            let model_ranking_refresh_store: ModelRankingRefreshRuntimeStore =
                Arc::new(PostgresModelRankingRefreshStore::new(pool.clone()));
            let user_store: AdminUserRuntimeStore = Arc::new(PostgresAdminUserStore::new(pool));
            Ok(router_with_product_catalog_and_runtime(
                Arc::new(snapshot),
                AdminRouterRuntime {
                    database_config: Some(&config),
                    api_key_hasher: Some(api_key_hasher),
                    announcement_store: Some(announcement_store),
                    app_store: Some(app_store),
                    auth_settings_store: Some(auth_settings_store),
                    channel_store: Some(channel_store),
                    provider_secret_store: Some(provider_secret_store),
                    access_group_store: Some(access_group_store),
                    ip_rate_limit_store: Some(ip_rate_limit_store),
                    firewall_rule_store: Some(firewall_rule_store),
                    api_key_rate_limit_store: Some(api_key_rate_limit_store),
                    model_rate_limit_store: Some(model_rate_limit_store),
                    model_store: Some(model_store),
                    finance_store: Some(finance_store),
                    marketing_store: Some(marketing_store),
                    monitor_read_store: Some(monitor_read_store),
                    record_store: Some(record_store),
                    skill_store: Some(skill_store),
                    user_store: Some(user_store),
                    model_rankings_store: Some(model_rankings_store),
                    model_ranking_refresh_store: Some(model_ranking_refresh_store),
                    database_installer: Some(Arc::clone(&database_installer)),
                    trusted_subject_config: Some(trusted_subject_config),
                    app_session_config: Some(app_session_config),
                },
            ))
        }
    }
}

pub async fn router_with_optional_database_config(
    config: Option<DatabaseConfig>,
) -> Result<Router, ProductCatalogRouterError> {
    match config {
        Some(config) => router_with_database_config(config).await,
        None => Ok(router()),
    }
}

pub async fn router_from_env() -> Result<Router, ProductCatalogRouterError> {
    let config = database_config_from_env_for_startup()?;
    let startup_install_mode =
        StartupInstallMode::from_env().map_err(ProductCatalogRouterError::Config)?;
    let api_key_config =
        ApiKeySecurityConfig::from_env().map_err(ProductCatalogRouterError::Config)?;
    let trusted_subject_config =
        TrustedSubjectConfig::from_env().map_err(ProductCatalogRouterError::Config)?;
    let app_session_config =
        AppSessionConfig::from_env().map_err(ProductCatalogRouterError::Config)?;
    let provider_secret_map_config =
        ProviderSecretMapConfig::from_env().map_err(ProductCatalogRouterError::Config)?;
    match config {
        Some(config) => {
            router_with_database_api_key_trusted_subject_app_session_and_optional_provider_secret_map_config_and_startup_install_mode(
                config,
                Some(require_api_key_security_config(api_key_config)?),
                Some(require_trusted_subject_config(trusted_subject_config)?),
                Some(require_app_session_config(app_session_config)?),
                provider_secret_map_config,
                startup_install_mode,
            )
            .await
        }
        None => Ok(router()),
    }
}

fn database_config_from_env_for_startup(
) -> Result<Option<DatabaseConfig>, ProductCatalogRouterError> {
    let profile = runtime_config_profile_from_deployment_mode();
    if profile == RuntimeConfigProfile::Server {
        return DatabaseConfig::from_env_or_initialize().map_err(ProductCatalogRouterError::Config);
    }

    let config = DatabaseConfig::from_env().map_err(ProductCatalogRouterError::Config)?;
    let location = DatabaseConfig::runtime_config_location_from_env(profile);
    if let Some(config) = &config {
        config
            .validate_for_runtime_profile_at(profile, &location)
            .map_err(ProductCatalogRouterError::Config)?;
        return Ok(Some(config.clone()));
    }
    Ok(None)
}

fn runtime_config_profile_from_deployment_mode() -> RuntimeConfigProfile {
    match DeploymentMode::from_env() {
        DeploymentMode::Desktop => RuntimeConfigProfile::Desktop,
        DeploymentMode::Server | DeploymentMode::Docker | DeploymentMode::Kubernetes => {
            RuntimeConfigProfile::Server
        }
    }
}

fn build_api_key_hasher(
    config: Option<ApiKeySecurityConfig>,
) -> Result<ApiKeyHasher, ProductCatalogRouterError> {
    let config = require_api_key_security_config(config)?;
    let hasher = HmacSha256ApiKeySecretHasher::new(config.pepper_secret())
        .map_err(|error| ProductCatalogRouterError::Config(error.to_string()))?;
    Ok(Arc::new(hasher))
}

fn build_provider_health_probe(
    provider_secret_map_config: Option<ProviderSecretMapConfig>,
) -> ProviderHealthProbeRuntime {
    match provider_secret_map_config {
        Some(config) => {
            let resolver = Arc::new(ProviderSecretMapResolver::from_config(config));
            Arc::new(SecretRefOpenAiCompatibleProviderHealthProbe::new(resolver))
        }
        None => Arc::new(UnconfiguredProviderHealthProbe),
    }
}

fn model_rankings_service(read_store: ModelRankingsRuntimeStore) -> ModelRankingsRuntimeStore {
    Arc::new(ModelRankingsService::new(read_store))
}

fn require_api_key_security_config(
    config: Option<ApiKeySecurityConfig>,
) -> Result<ApiKeySecurityConfig, ProductCatalogRouterError> {
    config.ok_or_else(|| {
        ProductCatalogRouterError::Config(format!(
            "{} is required when SDKWORK_CLAW_DATABASE_URL is configured",
            ApiKeySecurityConfig::ENV_API_KEY_PEPPER
        ))
    })
}

fn require_trusted_subject_config(
    config: Option<TrustedSubjectConfig>,
) -> Result<TrustedSubjectConfig, ProductCatalogRouterError> {
    config.ok_or_else(|| {
        ProductCatalogRouterError::Config(format!(
            "{} is required when SDKWORK_CLAW_DATABASE_URL is configured",
            TrustedSubjectConfig::ENV_TRUSTED_SUBJECT_SECRET
        ))
    })
}

fn require_app_session_config(
    config: Option<AppSessionConfig>,
) -> Result<AppSessionConfig, ProductCatalogRouterError> {
    config.ok_or_else(|| {
        ProductCatalogRouterError::Config(format!(
            "{} is required when SDKWORK_CLAW_DATABASE_URL is configured",
            AppSessionConfig::ENV_APP_SESSION_SECRET
        ))
    })
}

#[derive(Debug)]
pub enum ProductCatalogRouterError {
    Config(String),
    Installer(DatabaseInstallError),
    Sqlite(SqlCatalogLoadError),
    Postgres(PostgresCatalogLoadError),
}

impl std::fmt::Display for ProductCatalogRouterError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Config(error) => write!(f, "{error}"),
            Self::Installer(error) => write!(f, "{error}"),
            Self::Sqlite(error) => write!(f, "{error}"),
            Self::Postgres(error) => write!(f, "{error}"),
        }
    }
}

impl std::error::Error for ProductCatalogRouterError {}

impl From<SqlCatalogLoadError> for ProductCatalogRouterError {
    fn from(value: SqlCatalogLoadError) -> Self {
        Self::Sqlite(value)
    }
}

impl From<DatabaseInstallError> for ProductCatalogRouterError {
    fn from(value: DatabaseInstallError) -> Self {
        Self::Installer(value)
    }
}

impl From<PostgresCatalogLoadError> for ProductCatalogRouterError {
    fn from(value: PostgresCatalogLoadError) -> Self {
        Self::Postgres(value)
    }
}

pub async fn serve(bind_addr: &str) -> anyhow::Result<()> {
    sdkwork_claw_observability::init_tracing();
    let listener = tokio::net::TcpListener::bind(bind_addr).await?;
    axum::serve(listener, router_from_env().await?).await?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::router_from_env;
    use std::sync::{Mutex, OnceLock};
    use std::time::{SystemTime, UNIX_EPOCH};

    #[tokio::test(flavor = "current_thread")]
    async fn router_from_env_initializes_server_config_and_blocks_missing_postgres() {
        let _guard = env_guard().lock().unwrap();
        let saved_database_url = std::env::var("SDKWORK_CLAW_DATABASE_URL").ok();
        let saved_deployment_mode = std::env::var("SDKWORK_CLAW_DEPLOYMENT_MODE").ok();
        let saved_config_file = std::env::var("SDKWORK_CLAW_CONFIG_FILE").ok();
        let config_path = unique_runtime_config_path();
        std::env::remove_var("SDKWORK_CLAW_DATABASE_URL");
        std::env::set_var("SDKWORK_CLAW_DEPLOYMENT_MODE", "server");
        std::env::set_var("SDKWORK_CLAW_CONFIG_FILE", &config_path);

        let error = router_from_env()
            .await
            .expect_err("admin-api server startup must not silently serve without PostgreSQL");

        restore_env_var("SDKWORK_CLAW_DATABASE_URL", saved_database_url);
        restore_env_var("SDKWORK_CLAW_DEPLOYMENT_MODE", saved_deployment_mode);
        restore_env_var("SDKWORK_CLAW_CONFIG_FILE", saved_config_file);

        assert!(
            error
                .to_string()
                .contains("PostgreSQL configuration is required"),
            "unexpected startup error: {error}"
        );
        assert!(error.to_string().contains("Runtime config file:"));
        assert!(config_path.exists());
        let generated_config = std::fs::read_to_string(config_path).unwrap();
        assert!(generated_config.contains("engine = \"postgresql\""));
        assert!(generated_config.contains("change-me@localhost"));
    }

    fn unique_runtime_config_path() -> std::path::PathBuf {
        let millis = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis();
        let mut path = std::env::temp_dir();
        path.push(format!("sdkwork-claw-admin-api-runtime-{millis}"));
        path.push("sdkwork-claw-router.toml");
        path
    }

    fn env_guard() -> &'static Mutex<()> {
        static ENV_GUARD: OnceLock<Mutex<()>> = OnceLock::new();
        ENV_GUARD.get_or_init(|| Mutex::new(()))
    }

    fn restore_env_var(name: &str, value: Option<String>) {
        if let Some(value) = value {
            std::env::set_var(name, value);
        } else {
            std::env::remove_var(name);
        }
    }
}
