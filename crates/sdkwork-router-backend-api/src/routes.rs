use std::sync::Arc;
use std::time::Duration;

use crate::{manifest, paths};
use axum::body::Body;
use axum::extract::State;
use axum::http::{HeaderMap, Request, StatusCode};
use axum::middleware::from_fn_with_state;
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};
use axum::Json;
use axum::Router;
use sdkwork_claw_config::{
    ApiKeySecurityConfig, AppSessionConfig, DatabaseConfig, DatabaseEngine, DeploymentMode,
    ProviderSecretMapConfig, RedisConfig, RequestLimitsConfig, RuntimeTomlConfig,
    StartupInstallMode, TrustedSubjectConfig,
};
use sdkwork_claw_http::TrustedRequestSubject;
use sdkwork_claw_product::application::{
    default_desktop_cache_manager, default_service_cache_manager,
    AiRoutingCacheInvalidatingAdminAiResourceStore,
    AiRoutingCacheInvalidatingAdminChannelGroupStore, AiRoutingCacheInvalidatingAdminChannelStore,
    AiRoutingCacheInvalidatingAdminModelStore, AiRoutingCacheInvalidatingAdminProviderSecretStore,
    ApiKeySecretCodec, ApiKeySecretHasher, ModelRankingsService, RedisCacheBackend,
    RuntimeCacheManager, DEFAULT_CACHE_KEY_PREFIX, DEFAULT_REDIS_CONNECTION_PROFILE_NAME,
    DEFAULT_SERVICE_CACHE_INSTANCE_NAME,
};
use sdkwork_claw_product::infrastructure::crypto::{
    HmacSha256ApiKeySecretHasher, RingAeadApiKeySecretCodec,
};
use sdkwork_claw_product::infrastructure::provider::{
    ProviderSecretMapResolver, SecretRefOpenAiCompatibleProviderHealthProbe,
    DEFAULT_HEALTH_PROBE_TIMEOUT_MILLIS,
};
use sdkwork_claw_product::infrastructure::sql::catalog::RefreshableSqlPricingCatalog;
use sdkwork_claw_product::infrastructure::sql::installer::{
    log_bootstrap_admin_report, DatabaseInstallError, DatabaseInstaller,
};
use sdkwork_claw_product::infrastructure::sql::postgres::{
    PostgresAdminAiResourceStore, PostgresAdminAnalyticsReadStore, PostgresAdminAnnouncementStore,
    PostgresAdminApiKeyRateLimitStore, PostgresAdminAppStore, PostgresAdminAuthSettingsStore,
    PostgresAdminCatalogStore, PostgresAdminChannelGroupStore, PostgresAdminChannelStore,
    PostgresAdminDashboardReadStore, PostgresAdminFinanceStore, PostgresAdminFirewallRuleStore,
    PostgresAdminInventoryStore, PostgresAdminIpRateLimitStore, PostgresAdminMarketingStore,
    PostgresAdminMcpStore, PostgresAdminModelRateLimitStore, PostgresAdminModelStore,
    PostgresAdminMonitorReadStore, PostgresAdminPromptStore, PostgresAdminProviderSecretStore,
    PostgresAdminRecordStore, PostgresAdminServiceNodeStore, PostgresAdminServiceProviderStore,
    PostgresAdminSiteStore, PostgresAdminSkillStore, PostgresAdminStorageStore,
    PostgresAdminTransactionCenterStore, PostgresAppAgentRegistryStore, PostgresCatalogLoadError,
    PostgresGatewayApiKeyCommandStore, PostgresModelRankingRefreshStore,
    PostgresModelRankingsReadStore, PostgresPricingCatalogLoader,
    PostgresRuntimeRegionSettingsStore, PostgresSiteSettingsStore,
};
use sdkwork_claw_product::infrastructure::sql::sqlite::{
    SqlCatalogLoadError, SqliteAdminAiResourceStore, SqliteAdminAnalyticsReadStore,
    SqliteAdminAnnouncementStore, SqliteAdminApiKeyRateLimitStore, SqliteAdminAppStore,
    SqliteAdminAuthSettingsStore, SqliteAdminCatalogStore, SqliteAdminChannelGroupStore,
    SqliteAdminChannelStore, SqliteAdminDashboardReadStore, SqliteAdminFinanceStore,
    SqliteAdminFirewallRuleStore, SqliteAdminInventoryStore, SqliteAdminIpRateLimitStore,
    SqliteAdminMarketingStore, SqliteAdminMcpStore, SqliteAdminModelRateLimitStore,
    SqliteAdminModelStore, SqliteAdminMonitorReadStore, SqliteAdminPromptStore,
    SqliteAdminProviderSecretStore, SqliteAdminRecordStore, SqliteAdminServiceNodeStore,
    SqliteAdminServiceProviderStore, SqliteAdminSiteStore, SqliteAdminSkillStore,
    SqliteAdminStorageStore, SqliteAdminTransactionCenterStore, SqliteAppAgentRegistryStore,
    SqliteGatewayApiKeyCommandStore, SqliteModelRankingRefreshStore, SqliteModelRankingsReadStore,
    SqlitePricingCatalogLoader, SqliteRuntimeRegionSettingsStore, SqliteSiteSettingsStore,
};
use sdkwork_claw_product::infrastructure::OsApiKeySecretGenerator;
use sdkwork_claw_product::ports::{
    AdminAgentStore, AdminAiResourceStore, AdminAnalyticsReadStore, AdminAnnouncementStore,
    AdminApiKeyRateLimitStore, AdminAppStore, AdminAuthSettingsStore, AdminCatalogStore,
    AdminChannelGroupStore, AdminChannelStore, AdminDashboardReadStore, AdminFinanceStore,
    AdminFirewallRuleStore, AdminInventoryStore, AdminIpRateLimitStore, AdminMarketingStore,
    AdminMcpStore, AdminModelRateLimitStore, AdminModelStore, AdminMonitorReadStore,
    AdminPromptStore, AdminProviderSecretStore, AdminRecordStore, AdminServiceNodeStore,
    AdminServiceProviderStore, AdminSiteStore, AdminSkillStore, AdminStorageStore,
    AdminTransactionCenterStore, GatewayApiKeyCommandStore, ModelRankingRefreshStore,
    ModelRankingsReadModelStore, PricingCatalog, ProviderHealthProbe, RuntimeRegionSettingsStore,
    SiteSettingsStore, UnconfiguredProviderHealthProbe,
};
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};
use sqlx::{PgPool, SqlitePool};
use std::str::FromStr;

const X_SDKWORK_SUBJECT_TENANT_ID: &str = "x-sdkwork-subject-tenant-id";
const X_SDKWORK_SUBJECT_ORGANIZATION_ID: &str = "x-sdkwork-subject-organization-id";
const X_SDKWORK_SUBJECT_USER_ID: &str = "x-sdkwork-subject-user-id";
const X_SDKWORK_SUBJECT_TIMESTAMP: &str = "x-sdkwork-subject-timestamp";
const X_SDKWORK_SUBJECT_SIGNATURE: &str = "x-sdkwork-subject-signature";

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouterApiRouteModule {
    pub package_name: &'static str,
    pub schema_tab_id: &'static str,
    pub default_schema_url: &'static str,
    pub route_prefix: &'static str,
}

pub const SERVICE_NAME: &str = "sdkwork-claw-admin";
type ApiKeyHasher = Arc<dyn ApiKeySecretHasher + Send + Sync>;
type ApiKeyCodec = Arc<dyn ApiKeySecretCodec + Send + Sync>;
type AdminAgentRuntimeStore = Arc<dyn AdminAgentStore + Send + Sync>;
type AdminAnnouncementRuntimeStore = Arc<dyn AdminAnnouncementStore + Send + Sync>;
type AdminAppRuntimeStore = Arc<dyn AdminAppStore + Send + Sync>;
type AdminAuthSettingsRuntimeStore = Arc<dyn AdminAuthSettingsStore + Send + Sync>;
type ApiKeyCommandRuntimeStore = Arc<dyn GatewayApiKeyCommandStore + Send + Sync>;
type AdminCatalogRuntimeStore = Arc<dyn AdminCatalogStore + Send + Sync>;
type AdminInventoryRuntimeStore = Arc<dyn AdminInventoryStore + Send + Sync>;
type SiteSettingsRuntimeStore = Arc<dyn SiteSettingsStore + Send + Sync>;
type RuntimeRegionSettingsRuntimeStore = Arc<dyn RuntimeRegionSettingsStore + Send + Sync>;
type AdminAiResourceRuntimeStore = Arc<dyn AdminAiResourceStore + Send + Sync>;
type AdminChannelRuntimeStore = Arc<dyn AdminChannelStore + Send + Sync>;
type AdminProviderSecretRuntimeStore = Arc<dyn AdminProviderSecretStore + Send + Sync>;
type AdminChannelGroupRuntimeStore = Arc<dyn AdminChannelGroupStore + Send + Sync>;
type AdminIpRateLimitRuntimeStore = Arc<dyn AdminIpRateLimitStore + Send + Sync>;
type AdminFirewallRuleRuntimeStore = Arc<dyn AdminFirewallRuleStore + Send + Sync>;
type AdminApiKeyRateLimitRuntimeStore = Arc<dyn AdminApiKeyRateLimitStore + Send + Sync>;
type AdminModelRateLimitRuntimeStore = Arc<dyn AdminModelRateLimitStore + Send + Sync>;
type AdminModelRuntimeStore = Arc<dyn AdminModelStore + Send + Sync>;
type AdminFinanceRuntimeStore = Arc<dyn AdminFinanceStore + Send + Sync>;
type AdminMarketingRuntimeStore = Arc<dyn AdminMarketingStore + Send + Sync>;
type AdminPromptRuntimeStore = Arc<dyn AdminPromptStore + Send + Sync>;
type AdminMcpRuntimeStore = Arc<dyn AdminMcpStore + Send + Sync>;
type AdminServiceNodeRuntimeStore = Arc<dyn AdminServiceNodeStore + Send + Sync>;
type AdminServiceProviderRuntimeStore = Arc<dyn AdminServiceProviderStore + Send + Sync>;
type AdminSiteRuntimeStore = Arc<dyn AdminSiteStore + Send + Sync>;
type AdminStorageRuntimeStore = Arc<dyn AdminStorageStore + Send + Sync>;
type AdminTransactionCenterRuntimeStore = Arc<dyn AdminTransactionCenterStore + Send + Sync>;
type AdminDashboardRuntimeReadStore = Arc<dyn AdminDashboardReadStore + Send + Sync>;
type AdminAnalyticsRuntimeReadStore = Arc<dyn AdminAnalyticsReadStore + Send + Sync>;
type AdminMonitorRuntimeReadStore = Arc<dyn AdminMonitorReadStore + Send + Sync>;
type AdminRecordRuntimeStore = Arc<dyn AdminRecordStore + Send + Sync>;
type AdminSkillRuntimeStore = Arc<dyn AdminSkillStore + Send + Sync>;
type ModelRankingsRuntimeStore = Arc<dyn ModelRankingsReadModelStore + Send + Sync>;
type ModelRankingRefreshRuntimeStore = Arc<dyn ModelRankingRefreshStore + Send + Sync>;
type ProviderHealthProbeRuntime = Arc<dyn ProviderHealthProbe + Send + Sync>;
type DatabaseInstallerRuntime = Arc<DatabaseInstaller>;
type CacheManagerRuntime = RuntimeCacheManager;

pub fn route_module() -> RouterApiRouteModule {
    RouterApiRouteModule {
        package_name: manifest::PACKAGE_NAME,
        schema_tab_id: paths::SCHEMA_TAB_ID,
        default_schema_url: paths::DEFAULT_SCHEMA_URL,
        route_prefix: paths::ROUTE_PREFIX,
    }
}

pub fn build_sdkwork_claw_router_backend_api_router() -> Router {
    router()
}

pub async fn build_sdkwork_claw_router_backend_api_router_from_env(
) -> Result<Router, ProductCatalogRouterError> {
    router_from_env().await
}

#[derive(Clone)]
enum AdminAccessChecker {
    Sqlite(SqlitePool),
    Postgres(PgPool),
}

#[derive(Clone)]
struct AdminSubjectBoundaryConfig {
    subject_boundary: sdkwork_claw_http::AppSubjectBoundaryConfig,
    access_checker: AdminAccessChecker,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminBoundaryErrorEnvelope {
    code: &'static str,
    msg: String,
    data: Option<()>,
}

#[derive(Default)]
struct AdminRouterRuntime<'a> {
    database_config: Option<&'a DatabaseConfig>,
    api_key_hasher: Option<ApiKeyHasher>,
    agent_store: Option<AdminAgentRuntimeStore>,
    announcement_store: Option<AdminAnnouncementRuntimeStore>,
    app_store: Option<AdminAppRuntimeStore>,
    auth_settings_store: Option<AdminAuthSettingsRuntimeStore>,
    api_key_command_store: Option<ApiKeyCommandRuntimeStore>,
    catalog_store: Option<AdminCatalogRuntimeStore>,
    inventory_store: Option<AdminInventoryRuntimeStore>,
    site_settings_store: Option<SiteSettingsRuntimeStore>,
    runtime_region_settings_store: Option<RuntimeRegionSettingsRuntimeStore>,
    ai_resource_store: Option<AdminAiResourceRuntimeStore>,
    channel_store: Option<AdminChannelRuntimeStore>,
    provider_secret_store: Option<AdminProviderSecretRuntimeStore>,
    channel_group_store: Option<AdminChannelGroupRuntimeStore>,
    ip_rate_limit_store: Option<AdminIpRateLimitRuntimeStore>,
    firewall_rule_store: Option<AdminFirewallRuleRuntimeStore>,
    api_key_rate_limit_store: Option<AdminApiKeyRateLimitRuntimeStore>,
    model_rate_limit_store: Option<AdminModelRateLimitRuntimeStore>,
    model_store: Option<AdminModelRuntimeStore>,
    finance_store: Option<AdminFinanceRuntimeStore>,
    marketing_store: Option<AdminMarketingRuntimeStore>,
    prompt_store: Option<AdminPromptRuntimeStore>,
    mcp_store: Option<AdminMcpRuntimeStore>,
    service_node_store: Option<AdminServiceNodeRuntimeStore>,
    service_provider_store: Option<AdminServiceProviderRuntimeStore>,
    site_store: Option<AdminSiteRuntimeStore>,
    storage_store: Option<AdminStorageRuntimeStore>,
    transaction_center_store: Option<AdminTransactionCenterRuntimeStore>,
    dashboard_read_store: Option<AdminDashboardRuntimeReadStore>,
    analytics_read_store: Option<AdminAnalyticsRuntimeReadStore>,
    monitor_read_store: Option<AdminMonitorRuntimeReadStore>,
    record_store: Option<AdminRecordRuntimeStore>,
    skill_store: Option<AdminSkillRuntimeStore>,
    model_rankings_store: Option<ModelRankingsRuntimeStore>,
    model_ranking_refresh_store: Option<ModelRankingRefreshRuntimeStore>,
    cache_manager: Option<CacheManagerRuntime>,
    database_installer: Option<DatabaseInstallerRuntime>,
    trusted_subject_config: Option<TrustedSubjectConfig>,
    app_session_config: Option<AppSessionConfig>,
    admin_access_checker: Option<AdminAccessChecker>,
    request_limits_config: RequestLimitsConfig,
}

pub fn router() -> Router {
    router_with_database_status(None)
}

fn router_with_database_status(config: Option<&DatabaseConfig>) -> Router {
    sdkwork_claw_http::service_router_with_filtered_contract_routes_and_database_config(
        SERVICE_NAME,
        sdkwork_claw_http::ApiSurface::Backend,
        config,
        product_local_contract_operation,
    )
}

fn product_local_contract_operation(operation: &sdkwork_claw_http::ContractOperation) -> bool {
    operation.sdk_domain.as_deref() != Some("commerce")
        && !is_commerce_dependency_contract_path(&operation.path)
        && !is_appbase_dependency_contract_path(&operation.path)
        && !is_messaging_dependency_contract_path(&operation.path)
}

fn is_appbase_dependency_contract_path(path: &str) -> bool {
    const APPBASE_BACKEND_PREFIXES: &[&str] = &[
        "/backend/v3/api/iam/",
        "/backend/v3/api/oauth/",
        "/backend/v3/api/system/iam/",
    ];

    APPBASE_BACKEND_PREFIXES
        .iter()
        .any(|prefix| path == prefix.trim_end_matches('/') || path.starts_with(prefix))
}

fn is_commerce_dependency_contract_path(path: &str) -> bool {
    const COMMERCE_BACKEND_PREFIXES: &[&str] = &[
        "/backend/v3/api/catalog/",
        "/backend/v3/api/commerce_reports/",
        "/backend/v3/api/inventory/",
        "/backend/v3/api/memberships/",
        "/backend/v3/api/orders",
        "/backend/v3/api/payments/",
        "/backend/v3/api/promotions/",
        "/backend/v3/api/refunds",
        "/backend/v3/api/shipments",
        "/backend/v3/api/wallet/",
    ];

    COMMERCE_BACKEND_PREFIXES
        .iter()
        .any(|prefix| path == prefix.trim_end_matches('/') || path.starts_with(prefix))
}

fn is_messaging_dependency_contract_path(path: &str) -> bool {
    const MESSAGING_BACKEND_PREFIXES: &[&str] = &["/backend/v3/api/messaging/"];

    MESSAGING_BACKEND_PREFIXES
        .iter()
        .any(|prefix| path == prefix.trim_end_matches('/') || path.starts_with(prefix))
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
        agent_store,
        announcement_store,
        app_store,
        auth_settings_store,
        api_key_command_store,
        catalog_store: _catalog_store,
        inventory_store,
        site_settings_store,
        runtime_region_settings_store,
        ai_resource_store,
        channel_store,
        provider_secret_store,
        channel_group_store,
        ip_rate_limit_store,
        firewall_rule_store,
        api_key_rate_limit_store,
        model_rate_limit_store,
        model_store,
        finance_store,
        marketing_store,
        prompt_store,
        mcp_store,
        service_node_store,
        service_provider_store,
        site_store,
        storage_store,
        transaction_center_store,
        dashboard_read_store,
        analytics_read_store,
        monitor_read_store,
        record_store,
        skill_store,
        model_rankings_store,
        model_ranking_refresh_store,
        cache_manager,
        database_installer,
        trusted_subject_config,
        app_session_config,
        admin_access_checker,
        request_limits_config,
    } = runtime;

    let routing_cache_manager = cache_manager.clone();
    let route_explain_router =
        sdkwork_claw_product::api::admin_route_explain_router(Arc::clone(&catalog));
    let catalog_router = match api_key_hasher.as_ref() {
        Some(hasher) => sdkwork_claw_product::api::admin_model_catalog_router_with_api_key_hasher(
            Arc::clone(&catalog),
            Arc::clone(hasher),
        ),
        None => sdkwork_claw_product::api::admin_model_catalog_router(Arc::clone(&catalog)),
    };
    let mut router = router_with_database_status(database_config);
    router = router.merge(route_explain_router);
    if model_store.is_none() {
        router = router.merge(catalog_router);
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
    let admin_subject_boundary_config = match (
        subject_boundary_config.clone(),
        admin_access_checker.clone(),
    ) {
        (Some(subject_boundary), Some(access_checker)) => Some(AdminSubjectBoundaryConfig {
            subject_boundary,
            access_checker,
        }),
        _ => None,
    };
    if let Some(installer) = database_installer {
        let system_router =
            sdkwork_claw_product::api::admin_system_router_with_installer(installer);
        router = match admin_subject_boundary_config.clone() {
            Some(admin_subject_boundary_config) => {
                router.merge(system_router.layer(from_fn_with_state(
                    admin_subject_boundary_config,
                    admin_request_subject_boundary,
                )))
            }
            None => router.merge(system_router),
        };
    }

    if let Some(manager) = cache_manager.clone() {
        let cache_router = sdkwork_claw_product::api::admin_cache_router_with_manager(manager);
        router = match admin_subject_boundary_config.clone() {
            Some(admin_subject_boundary_config) => {
                router.merge(cache_router.layer(from_fn_with_state(
                    admin_subject_boundary_config,
                    admin_request_subject_boundary,
                )))
            }
            None => router.merge(cache_router),
        };
    }

    if let (Some(store), Some(admin_subject_boundary_config)) =
        (model_store.clone(), admin_subject_boundary_config.clone())
    {
        let store = ai_routing_cache_invalidating_model_store(store, routing_cache_manager.clone());
        router = router.merge(
            sdkwork_claw_product::api::admin_model_management_router_with_store(
                store,
                Arc::new(OsApiKeySecretGenerator),
            )
            .layer(from_fn_with_state(
                admin_subject_boundary_config,
                admin_request_subject_boundary,
            )),
        );
    }
    router = match (
        model_rankings_store,
        model_ranking_refresh_store,
        admin_subject_boundary_config.clone(),
    ) {
        (Some(read_store), Some(refresh_store), Some(admin_subject_boundary_config)) => router.merge(
            sdkwork_claw_product::api::admin_model_rankings_router_with_read_store_and_refresh_store(
                read_store,
                refresh_store,
            )
            .layer(from_fn_with_state(
                admin_subject_boundary_config,
                admin_request_subject_boundary,
            )),
        ),
        (Some(read_store), Some(refresh_store), None) => router.merge(
            sdkwork_claw_product::api::admin_model_rankings_router_with_read_store_and_refresh_store(
                read_store,
                refresh_store,
            ),
        ),
        (Some(read_store), None, Some(admin_subject_boundary_config)) => router.merge(
            sdkwork_claw_product::api::admin_model_rankings_router_with_read_store(read_store)
                .layer(from_fn_with_state(
                    admin_subject_boundary_config,
                    admin_request_subject_boundary,
                )),
        ),
        (Some(read_store), None, None) => router.merge(
            sdkwork_claw_product::api::admin_model_rankings_router_with_read_store(read_store),
        ),
        (None, _, _) => router.merge(sdkwork_claw_product::api::admin_model_rankings_router()),
    };
    let payment_runtime_router = sdkwork_claw_product::api::admin_payment_runtime_router();
    router = match admin_subject_boundary_config.clone() {
        Some(admin_subject_boundary_config) => {
            router.merge(payment_runtime_router.layer(from_fn_with_state(
                admin_subject_boundary_config,
                admin_request_subject_boundary,
            )))
        }
        None => router.merge(payment_runtime_router),
    };
    if let Some(store) = inventory_store {
        let inventory_router = sdkwork_claw_product::api::admin_inventory_router_with_store(store);
        router = match admin_subject_boundary_config.clone() {
            Some(admin_subject_boundary_config) => {
                router.merge(inventory_router.layer(from_fn_with_state(
                    admin_subject_boundary_config,
                    admin_request_subject_boundary,
                )))
            }
            None => router.merge(inventory_router),
        };
    }
    if let Some(admin_subject_boundary_config) = admin_subject_boundary_config {
        if let (Some(store), Some(api_key_hasher)) = (api_key_command_store, api_key_hasher.clone())
        {
            router = router.merge(
                sdkwork_claw_product::api::admin_user_api_key_command_router_with_store(
                    store,
                    api_key_hasher,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    admin_subject_boundary_config.clone(),
                    admin_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = agent_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_agent_router_with_store(store).layer(
                    from_fn_with_state(
                        admin_subject_boundary_config.clone(),
                        admin_request_subject_boundary,
                    ),
                ),
            );
        }
        if let Some(store) = announcement_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_announcement_router_with_store(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    admin_subject_boundary_config.clone(),
                    admin_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = app_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_app_router_with_store_and_json_body_limit(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                    request_limits_config.admin_app_json_body_max_bytes(),
                )
                .layer(from_fn_with_state(
                    admin_subject_boundary_config.clone(),
                    admin_request_subject_boundary,
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
                    admin_subject_boundary_config.clone(),
                    admin_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = site_settings_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_site_settings_router_with_store(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    admin_subject_boundary_config.clone(),
                    admin_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = runtime_region_settings_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_runtime_region_settings_router_with_store(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    admin_subject_boundary_config.clone(),
                    admin_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = ai_resource_store {
            let store = ai_routing_cache_invalidating_ai_resource_store(
                store,
                routing_cache_manager.clone(),
            );
            router = router.merge(
                sdkwork_claw_product::api::admin_ai_resource_router_with_store(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    admin_subject_boundary_config.clone(),
                    admin_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = channel_store {
            let store =
                ai_routing_cache_invalidating_channel_store(store, routing_cache_manager.clone());
            router = router.merge(
                sdkwork_claw_product::api::admin_channel_router_with_store(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    admin_subject_boundary_config.clone(),
                    admin_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = provider_secret_store {
            let store = ai_routing_cache_invalidating_provider_secret_store(
                store,
                routing_cache_manager.clone(),
            );
            router = router.merge(
                sdkwork_claw_product::api::admin_provider_secret_router_with_store(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    admin_subject_boundary_config.clone(),
                    admin_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = channel_group_store {
            let store = ai_routing_cache_invalidating_channel_group_store(
                store,
                routing_cache_manager.clone(),
            );
            router = router.merge(
                sdkwork_claw_product::api::admin_channel_group_router_with_store(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    admin_subject_boundary_config.clone(),
                    admin_request_subject_boundary,
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
                    admin_subject_boundary_config.clone(),
                    admin_request_subject_boundary,
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
                    admin_subject_boundary_config.clone(),
                    admin_request_subject_boundary,
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
                    admin_subject_boundary_config.clone(),
                    admin_request_subject_boundary,
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
                    admin_subject_boundary_config.clone(),
                    admin_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = finance_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_finance_router_with_store(store).layer(
                    from_fn_with_state(
                        admin_subject_boundary_config.clone(),
                        admin_request_subject_boundary,
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
                    admin_subject_boundary_config.clone(),
                    admin_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = prompt_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_prompt_router_with_store(store).layer(
                    from_fn_with_state(
                        admin_subject_boundary_config.clone(),
                        admin_request_subject_boundary,
                    ),
                ),
            );
        }
        if let Some(store) = mcp_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_mcp_router_with_store(store).layer(
                    from_fn_with_state(
                        admin_subject_boundary_config.clone(),
                        admin_request_subject_boundary,
                    ),
                ),
            );
        }
        if let Some(store) = service_node_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_service_node_router_with_store(store).layer(
                    from_fn_with_state(
                        admin_subject_boundary_config.clone(),
                        admin_request_subject_boundary,
                    ),
                ),
            );
        }
        if let Some(store) = service_provider_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_service_provider_router_with_store(store).layer(
                    from_fn_with_state(
                        admin_subject_boundary_config.clone(),
                        admin_request_subject_boundary,
                    ),
                ),
            );
        }
        if let Some(store) = site_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_site_router_with_store(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                )
                .layer(from_fn_with_state(
                    admin_subject_boundary_config.clone(),
                    admin_request_subject_boundary,
                )),
            );
        }
        if let Some(store) = storage_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_storage_router_with_store(store).layer(
                    from_fn_with_state(
                        admin_subject_boundary_config.clone(),
                        admin_request_subject_boundary,
                    ),
                ),
            );
        }
        if let Some(store) = transaction_center_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_transaction_center_router_with_store(store).layer(
                    from_fn_with_state(
                        admin_subject_boundary_config.clone(),
                        admin_request_subject_boundary,
                    ),
                ),
            );
        }
        if let Some(store) = dashboard_read_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_dashboard_router_with_read_store(store).layer(
                    from_fn_with_state(
                        admin_subject_boundary_config.clone(),
                        admin_request_subject_boundary,
                    ),
                ),
            );
        }
        if let Some(store) = analytics_read_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_analytics_router_with_read_store(store).layer(
                    from_fn_with_state(
                        admin_subject_boundary_config.clone(),
                        admin_request_subject_boundary,
                    ),
                ),
            );
        }
        if let Some(store) = monitor_read_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_monitor_router_with_read_store(store).layer(
                    from_fn_with_state(
                        admin_subject_boundary_config.clone(),
                        admin_request_subject_boundary,
                    ),
                ),
            );
        }
        if let Some(store) = record_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_record_router_with_store(store).layer(
                    from_fn_with_state(
                        admin_subject_boundary_config.clone(),
                        admin_request_subject_boundary,
                    ),
                ),
            );
        }
        if let Some(store) = skill_store {
            router = router.merge(
                sdkwork_claw_product::api::admin_skill_router_with_store_and_json_body_limit(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                    request_limits_config.admin_skill_json_body_max_bytes(),
                )
                .layer(from_fn_with_state(
                    admin_subject_boundary_config.clone(),
                    admin_request_subject_boundary,
                )),
            );
        }
    }
    router
}

fn ai_routing_cache_invalidating_model_store(
    store: AdminModelRuntimeStore,
    cache_manager: Option<RuntimeCacheManager>,
) -> AdminModelRuntimeStore {
    match cache_manager {
        Some(manager) => Arc::new(AiRoutingCacheInvalidatingAdminModelStore::new(
            store, manager,
        )),
        None => store,
    }
}

fn ai_routing_cache_invalidating_ai_resource_store(
    store: AdminAiResourceRuntimeStore,
    cache_manager: Option<RuntimeCacheManager>,
) -> AdminAiResourceRuntimeStore {
    match cache_manager {
        Some(manager) => Arc::new(AiRoutingCacheInvalidatingAdminAiResourceStore::new(
            store, manager,
        )),
        None => store,
    }
}

fn ai_routing_cache_invalidating_channel_store(
    store: AdminChannelRuntimeStore,
    cache_manager: Option<RuntimeCacheManager>,
) -> AdminChannelRuntimeStore {
    match cache_manager {
        Some(manager) => Arc::new(AiRoutingCacheInvalidatingAdminChannelStore::new(
            store, manager,
        )),
        None => store,
    }
}

fn ai_routing_cache_invalidating_provider_secret_store(
    store: AdminProviderSecretRuntimeStore,
    cache_manager: Option<RuntimeCacheManager>,
) -> AdminProviderSecretRuntimeStore {
    match cache_manager {
        Some(manager) => Arc::new(AiRoutingCacheInvalidatingAdminProviderSecretStore::new(
            store, manager,
        )),
        None => store,
    }
}

fn ai_routing_cache_invalidating_channel_group_store(
    store: AdminChannelGroupRuntimeStore,
    cache_manager: Option<RuntimeCacheManager>,
) -> AdminChannelGroupRuntimeStore {
    match cache_manager {
        Some(manager) => Arc::new(AiRoutingCacheInvalidatingAdminChannelGroupStore::new(
            store, manager,
        )),
        None => store,
    }
}

pub async fn router_with_sqlite_product_catalog(
    pool: SqlitePool,
) -> Result<Router, SqlCatalogLoadError> {
    let snapshot = SqlitePricingCatalogLoader::new(pool.clone())
        .load_snapshot()
        .await?;
    let catalog_store: AdminCatalogRuntimeStore =
        Arc::new(SqliteAdminCatalogStore::new(pool.clone()));
    let inventory_store: AdminInventoryRuntimeStore =
        Arc::new(SqliteAdminInventoryStore::new(pool));
    Ok(router_with_product_catalog_and_runtime(
        Arc::new(snapshot),
        AdminRouterRuntime {
            catalog_store: Some(catalog_store),
            inventory_store: Some(inventory_store),
            ..AdminRouterRuntime::default()
        },
    ))
}

pub async fn router_with_postgres_product_catalog(
    pool: PgPool,
) -> Result<Router, PostgresCatalogLoadError> {
    let snapshot = PostgresPricingCatalogLoader::new(pool.clone())
        .load_snapshot()
        .await?;
    let catalog_store: AdminCatalogRuntimeStore =
        Arc::new(PostgresAdminCatalogStore::new(pool.clone()));
    let inventory_store: AdminInventoryRuntimeStore =
        Arc::new(PostgresAdminInventoryStore::new(pool));
    Ok(router_with_product_catalog_and_runtime(
        Arc::new(snapshot),
        AdminRouterRuntime {
            catalog_store: Some(catalog_store),
            inventory_store: Some(inventory_store),
            ..AdminRouterRuntime::default()
        },
    ))
}

pub fn router_with_sqlite_shared_runtime(
    config: DatabaseConfig,
    pool: SqlitePool,
    catalog: Arc<RefreshableSqlPricingCatalog>,
    api_key_security_config: ApiKeySecurityConfig,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
    provider_health_probe: Arc<dyn ProviderHealthProbe + Send + Sync>,
    cache_manager: RuntimeCacheManager,
    database_installer: Arc<DatabaseInstaller>,
    request_limits_config: RequestLimitsConfig,
    models_catalog_root: Option<String>,
) -> Result<Router, ProductCatalogRouterError> {
    let api_key_hasher = build_api_key_hasher(&api_key_security_config)?;
    let api_key_secret_codec = api_key_secret_codec_from_config(&api_key_security_config)?;
    let announcement_store: AdminAnnouncementRuntimeStore =
        Arc::new(SqliteAdminAnnouncementStore::new(pool.clone()));
    let agent_store: AdminAgentRuntimeStore =
        Arc::new(SqliteAppAgentRegistryStore::new(pool.clone()));
    let app_store: AdminAppRuntimeStore = Arc::new(SqliteAdminAppStore::new(pool.clone()));
    let auth_settings_store: AdminAuthSettingsRuntimeStore =
        Arc::new(SqliteAdminAuthSettingsStore::new(pool.clone()));
    let api_key_command_store: ApiKeyCommandRuntimeStore = Arc::new(
        SqliteGatewayApiKeyCommandStore::new(pool.clone(), api_key_secret_codec.clone()),
    );
    let catalog_store: AdminCatalogRuntimeStore =
        Arc::new(SqliteAdminCatalogStore::new(pool.clone()));
    let inventory_store: AdminInventoryRuntimeStore =
        Arc::new(SqliteAdminInventoryStore::new(pool.clone()));
    let site_settings_store: SiteSettingsRuntimeStore =
        Arc::new(SqliteSiteSettingsStore::new(pool.clone()));
    let runtime_region_settings_store: RuntimeRegionSettingsRuntimeStore =
        Arc::new(SqliteRuntimeRegionSettingsStore::new(pool.clone()));
    let ai_resource_store: AdminAiResourceRuntimeStore =
        Arc::new(SqliteAdminAiResourceStore::new(pool.clone()));
    let channel_store: AdminChannelRuntimeStore = Arc::new(
        SqliteAdminChannelStore::with_provider_health_probe_and_api_key_secret_codec(
            pool.clone(),
            provider_health_probe,
            api_key_secret_codec.clone(),
        ),
    );
    let provider_secret_store: AdminProviderSecretRuntimeStore =
        Arc::new(SqliteAdminProviderSecretStore::new(pool.clone()));
    let channel_group_store: AdminChannelGroupRuntimeStore =
        Arc::new(SqliteAdminChannelGroupStore::new(pool.clone()));
    let ip_rate_limit_store: AdminIpRateLimitRuntimeStore =
        Arc::new(SqliteAdminIpRateLimitStore::new(pool.clone()));
    let firewall_rule_store: AdminFirewallRuleRuntimeStore =
        Arc::new(SqliteAdminFirewallRuleStore::new(pool.clone()));
    let api_key_rate_limit_store: AdminApiKeyRateLimitRuntimeStore =
        Arc::new(SqliteAdminApiKeyRateLimitStore::new(pool.clone()));
    let model_rate_limit_store: AdminModelRateLimitRuntimeStore =
        Arc::new(SqliteAdminModelRateLimitStore::new(pool.clone()));
    let model_store: AdminModelRuntimeStore = Arc::new(
        SqliteAdminModelStore::with_models_catalog_root(pool.clone(), models_catalog_root),
    );
    let finance_store: AdminFinanceRuntimeStore =
        Arc::new(SqliteAdminFinanceStore::new(pool.clone()));
    let marketing_store: AdminMarketingRuntimeStore =
        Arc::new(SqliteAdminMarketingStore::new(pool.clone()));
    let prompt_store: AdminPromptRuntimeStore = Arc::new(SqliteAdminPromptStore::new(pool.clone()));
    let mcp_store: AdminMcpRuntimeStore = Arc::new(SqliteAdminMcpStore::new(pool.clone()));
    let service_provider_store: AdminServiceProviderRuntimeStore =
        Arc::new(SqliteAdminServiceProviderStore::new(pool.clone()));
    let site_store: AdminSiteRuntimeStore = Arc::new(SqliteAdminSiteStore::new(pool.clone()));
    let service_node_store: AdminServiceNodeRuntimeStore =
        Arc::new(SqliteAdminServiceNodeStore::new(pool.clone()));
    let storage_store: AdminStorageRuntimeStore =
        Arc::new(SqliteAdminStorageStore::new(pool.clone()));
    let transaction_center_store: AdminTransactionCenterRuntimeStore =
        Arc::new(SqliteAdminTransactionCenterStore::new(pool.clone()));
    let dashboard_read_store: AdminDashboardRuntimeReadStore =
        Arc::new(SqliteAdminDashboardReadStore::new(pool.clone()));
    let analytics_read_store: AdminAnalyticsRuntimeReadStore =
        Arc::new(SqliteAdminAnalyticsReadStore::new(pool.clone()));
    let monitor_read_store: AdminMonitorRuntimeReadStore =
        Arc::new(SqliteAdminMonitorReadStore::new(pool.clone()));
    let record_store: AdminRecordRuntimeStore = Arc::new(SqliteAdminRecordStore::new(pool.clone()));
    let skill_store: AdminSkillRuntimeStore = Arc::new(SqliteAdminSkillStore::new(pool.clone()));
    let model_rankings_store: ModelRankingsRuntimeStore =
        model_rankings_service(Arc::new(SqliteModelRankingsReadStore::new(pool.clone())));
    let model_ranking_refresh_store: ModelRankingRefreshRuntimeStore =
        Arc::new(SqliteModelRankingRefreshStore::new(pool.clone()));
    let admin_access_checker = AdminAccessChecker::Sqlite(pool.clone());

    Ok(router_with_product_catalog_and_runtime(
        catalog,
        AdminRouterRuntime {
            database_config: Some(&config),
            api_key_hasher: Some(api_key_hasher),
            agent_store: Some(agent_store),
            announcement_store: Some(announcement_store),
            app_store: Some(app_store),
            auth_settings_store: Some(auth_settings_store),
            api_key_command_store: Some(api_key_command_store),
            catalog_store: Some(catalog_store),
            inventory_store: Some(inventory_store),
            site_settings_store: Some(site_settings_store),
            runtime_region_settings_store: Some(runtime_region_settings_store),
            ai_resource_store: Some(ai_resource_store),
            channel_store: Some(channel_store),
            provider_secret_store: Some(provider_secret_store),
            channel_group_store: Some(channel_group_store),
            ip_rate_limit_store: Some(ip_rate_limit_store),
            firewall_rule_store: Some(firewall_rule_store),
            api_key_rate_limit_store: Some(api_key_rate_limit_store),
            model_rate_limit_store: Some(model_rate_limit_store),
            model_store: Some(model_store),
            finance_store: Some(finance_store),
            marketing_store: Some(marketing_store),
            prompt_store: Some(prompt_store),
            mcp_store: Some(mcp_store),
            service_node_store: Some(service_node_store),
            service_provider_store: Some(service_provider_store),
            site_store: Some(site_store),
            storage_store: Some(storage_store),
            transaction_center_store: Some(transaction_center_store),
            dashboard_read_store: Some(dashboard_read_store),
            analytics_read_store: Some(analytics_read_store),
            monitor_read_store: Some(monitor_read_store),
            record_store: Some(record_store),
            skill_store: Some(skill_store),
            model_rankings_store: Some(model_rankings_store),
            model_ranking_refresh_store: Some(model_ranking_refresh_store),
            cache_manager: Some(cache_manager),
            database_installer: Some(database_installer),
            trusted_subject_config: Some(trusted_subject_config),
            app_session_config: Some(app_session_config),
            admin_access_checker: Some(admin_access_checker),
            request_limits_config,
        },
    ))
}

pub fn router_with_postgres_shared_runtime(
    config: DatabaseConfig,
    pool: PgPool,
    catalog: Arc<RefreshableSqlPricingCatalog>,
    api_key_security_config: ApiKeySecurityConfig,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
    provider_health_probe: Arc<dyn ProviderHealthProbe + Send + Sync>,
    cache_manager: RuntimeCacheManager,
    database_installer: Arc<DatabaseInstaller>,
    request_limits_config: RequestLimitsConfig,
    models_catalog_root: Option<String>,
) -> Result<Router, ProductCatalogRouterError> {
    let api_key_hasher = build_api_key_hasher(&api_key_security_config)?;
    let api_key_secret_codec = api_key_secret_codec_from_config(&api_key_security_config)?;
    let announcement_store: AdminAnnouncementRuntimeStore =
        Arc::new(PostgresAdminAnnouncementStore::new(pool.clone()));
    let agent_store: AdminAgentRuntimeStore =
        Arc::new(PostgresAppAgentRegistryStore::new(pool.clone()));
    let app_store: AdminAppRuntimeStore = Arc::new(PostgresAdminAppStore::new(pool.clone()));
    let auth_settings_store: AdminAuthSettingsRuntimeStore =
        Arc::new(PostgresAdminAuthSettingsStore::new(pool.clone()));
    let api_key_command_store: ApiKeyCommandRuntimeStore = Arc::new(
        PostgresGatewayApiKeyCommandStore::new(pool.clone(), api_key_secret_codec.clone()),
    );
    let catalog_store: AdminCatalogRuntimeStore =
        Arc::new(PostgresAdminCatalogStore::new(pool.clone()));
    let inventory_store: AdminInventoryRuntimeStore =
        Arc::new(PostgresAdminInventoryStore::new(pool.clone()));
    let site_settings_store: SiteSettingsRuntimeStore =
        Arc::new(PostgresSiteSettingsStore::new(pool.clone()));
    let runtime_region_settings_store: RuntimeRegionSettingsRuntimeStore =
        Arc::new(PostgresRuntimeRegionSettingsStore::new(pool.clone()));
    let ai_resource_store: AdminAiResourceRuntimeStore =
        Arc::new(PostgresAdminAiResourceStore::new(pool.clone()));
    let channel_store: AdminChannelRuntimeStore = Arc::new(
        PostgresAdminChannelStore::with_provider_health_probe_and_api_key_secret_codec(
            pool.clone(),
            provider_health_probe,
            api_key_secret_codec.clone(),
        ),
    );
    let provider_secret_store: AdminProviderSecretRuntimeStore =
        Arc::new(PostgresAdminProviderSecretStore::new(pool.clone()));
    let channel_group_store: AdminChannelGroupRuntimeStore =
        Arc::new(PostgresAdminChannelGroupStore::new(pool.clone()));
    let ip_rate_limit_store: AdminIpRateLimitRuntimeStore =
        Arc::new(PostgresAdminIpRateLimitStore::new(pool.clone()));
    let firewall_rule_store: AdminFirewallRuleRuntimeStore =
        Arc::new(PostgresAdminFirewallRuleStore::new(pool.clone()));
    let api_key_rate_limit_store: AdminApiKeyRateLimitRuntimeStore =
        Arc::new(PostgresAdminApiKeyRateLimitStore::new(pool.clone()));
    let model_rate_limit_store: AdminModelRateLimitRuntimeStore =
        Arc::new(PostgresAdminModelRateLimitStore::new(pool.clone()));
    let model_store: AdminModelRuntimeStore = Arc::new(
        PostgresAdminModelStore::with_models_catalog_root(pool.clone(), models_catalog_root),
    );
    let finance_store: AdminFinanceRuntimeStore =
        Arc::new(PostgresAdminFinanceStore::new(pool.clone()));
    let marketing_store: AdminMarketingRuntimeStore =
        Arc::new(PostgresAdminMarketingStore::new(pool.clone()));
    let prompt_store: AdminPromptRuntimeStore =
        Arc::new(PostgresAdminPromptStore::new(pool.clone()));
    let mcp_store: AdminMcpRuntimeStore = Arc::new(PostgresAdminMcpStore::new(pool.clone()));
    let service_provider_store: AdminServiceProviderRuntimeStore =
        Arc::new(PostgresAdminServiceProviderStore::new(pool.clone()));
    let site_store: AdminSiteRuntimeStore = Arc::new(PostgresAdminSiteStore::new(pool.clone()));
    let service_node_store: AdminServiceNodeRuntimeStore =
        Arc::new(PostgresAdminServiceNodeStore::new(pool.clone()));
    let storage_store: AdminStorageRuntimeStore =
        Arc::new(PostgresAdminStorageStore::new(pool.clone()));
    let transaction_center_store: AdminTransactionCenterRuntimeStore =
        Arc::new(PostgresAdminTransactionCenterStore::new(pool.clone()));
    let dashboard_read_store: AdminDashboardRuntimeReadStore =
        Arc::new(PostgresAdminDashboardReadStore::new(pool.clone()));
    let analytics_read_store: AdminAnalyticsRuntimeReadStore =
        Arc::new(PostgresAdminAnalyticsReadStore::new(pool.clone()));
    let monitor_read_store: AdminMonitorRuntimeReadStore =
        Arc::new(PostgresAdminMonitorReadStore::new(pool.clone()));
    let record_store: AdminRecordRuntimeStore =
        Arc::new(PostgresAdminRecordStore::new(pool.clone()));
    let skill_store: AdminSkillRuntimeStore = Arc::new(PostgresAdminSkillStore::new(pool.clone()));
    let model_rankings_store: ModelRankingsRuntimeStore =
        model_rankings_service(Arc::new(PostgresModelRankingsReadStore::new(pool.clone())));
    let model_ranking_refresh_store: ModelRankingRefreshRuntimeStore =
        Arc::new(PostgresModelRankingRefreshStore::new(pool.clone()));
    let admin_access_checker = AdminAccessChecker::Postgres(pool.clone());

    Ok(router_with_product_catalog_and_runtime(
        catalog,
        AdminRouterRuntime {
            database_config: Some(&config),
            api_key_hasher: Some(api_key_hasher),
            agent_store: Some(agent_store),
            announcement_store: Some(announcement_store),
            app_store: Some(app_store),
            auth_settings_store: Some(auth_settings_store),
            api_key_command_store: Some(api_key_command_store),
            catalog_store: Some(catalog_store),
            inventory_store: Some(inventory_store),
            site_settings_store: Some(site_settings_store),
            runtime_region_settings_store: Some(runtime_region_settings_store),
            ai_resource_store: Some(ai_resource_store),
            channel_store: Some(channel_store),
            provider_secret_store: Some(provider_secret_store),
            channel_group_store: Some(channel_group_store),
            ip_rate_limit_store: Some(ip_rate_limit_store),
            firewall_rule_store: Some(firewall_rule_store),
            api_key_rate_limit_store: Some(api_key_rate_limit_store),
            model_rate_limit_store: Some(model_rate_limit_store),
            model_store: Some(model_store),
            finance_store: Some(finance_store),
            marketing_store: Some(marketing_store),
            prompt_store: Some(prompt_store),
            mcp_store: Some(mcp_store),
            service_node_store: Some(service_node_store),
            service_provider_store: Some(service_provider_store),
            site_store: Some(site_store),
            storage_store: Some(storage_store),
            transaction_center_store: Some(transaction_center_store),
            dashboard_read_store: Some(dashboard_read_store),
            analytics_read_store: Some(analytics_read_store),
            monitor_read_store: Some(monitor_read_store),
            record_store: Some(record_store),
            skill_store: Some(skill_store),
            model_rankings_store: Some(model_rankings_store),
            model_ranking_refresh_store: Some(model_ranking_refresh_store),
            cache_manager: Some(cache_manager),
            database_installer: Some(database_installer),
            trusted_subject_config: Some(trusted_subject_config),
            app_session_config: Some(app_session_config),
            admin_access_checker: Some(admin_access_checker),
            request_limits_config,
        },
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

pub async fn router_with_database_and_api_key_config_and_startup_install_mode(
    config: DatabaseConfig,
    api_key_config: Option<ApiKeySecurityConfig>,
    trusted_subject_config: Option<TrustedSubjectConfig>,
    app_session_config: Option<AppSessionConfig>,
    startup_install_mode: StartupInstallMode,
) -> Result<Router, ProductCatalogRouterError> {
    router_with_database_api_key_trusted_subject_app_session_and_optional_provider_secret_map_config_and_startup_install_mode(
        config,
        api_key_config,
        trusted_subject_config,
        app_session_config,
        None,
        startup_install_mode,
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

pub async fn router_with_database_api_key_trusted_subject_app_session_provider_secret_map_config_and_startup_install_mode(
    config: DatabaseConfig,
    api_key_config: ApiKeySecurityConfig,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
    provider_secret_map_config: ProviderSecretMapConfig,
    startup_install_mode: StartupInstallMode,
) -> Result<Router, ProductCatalogRouterError> {
    router_with_database_api_key_trusted_subject_app_session_and_optional_provider_secret_map_config_and_startup_install_mode(
        config,
        Some(api_key_config),
        Some(trusted_subject_config),
        Some(app_session_config),
        Some(provider_secret_map_config),
        startup_install_mode,
        None,
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
        None,
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
    runtime_toml: Option<&RuntimeTomlConfig>,
) -> Result<Router, ProductCatalogRouterError> {
    let request_limits_config = RequestLimitsConfig::from_env_or_runtime_toml(runtime_toml)
        .map_err(ProductCatalogRouterError::Config)?;
    let cache_manager = cache_manager_from_env_or_toml(runtime_toml)?;
    let api_key_security_config = require_api_key_security_config(api_key_config)?;
    let api_key_hasher = build_api_key_hasher(&api_key_security_config)?;
    let api_key_secret_codec = api_key_secret_codec_from_config(&api_key_security_config)?;
    let trusted_subject_config = require_trusted_subject_config(trusted_subject_config)?;
    let app_session_config = require_app_session_config(app_session_config)?;
    let provider_health_probe =
        build_provider_health_probe(provider_secret_map_config, runtime_toml)?;
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
                let install_report = database_installer.ensure_installed().await?;
                log_bootstrap_admin_report(SERVICE_NAME, &install_report);
            }
            let snapshot = SqlitePricingCatalogLoader::with_api_key_secret_codec(
                pool.clone(),
                api_key_secret_codec.clone(),
            )
            .load_snapshot()
            .await?;
            let announcement_store: AdminAnnouncementRuntimeStore =
                Arc::new(SqliteAdminAnnouncementStore::new(pool.clone()));
            let agent_store: AdminAgentRuntimeStore =
                Arc::new(SqliteAppAgentRegistryStore::new(pool.clone()));
            let app_store: AdminAppRuntimeStore = Arc::new(SqliteAdminAppStore::new(pool.clone()));
            let auth_settings_store: AdminAuthSettingsRuntimeStore =
                Arc::new(SqliteAdminAuthSettingsStore::new(pool.clone()));
            let api_key_command_store: ApiKeyCommandRuntimeStore = Arc::new(
                SqliteGatewayApiKeyCommandStore::new(pool.clone(), api_key_secret_codec.clone()),
            );
            let catalog_store: AdminCatalogRuntimeStore =
                Arc::new(SqliteAdminCatalogStore::new(pool.clone()));
            let inventory_store: AdminInventoryRuntimeStore =
                Arc::new(SqliteAdminInventoryStore::new(pool.clone()));
            let site_settings_store: SiteSettingsRuntimeStore =
                Arc::new(SqliteSiteSettingsStore::new(pool.clone()));
            let runtime_region_settings_store: RuntimeRegionSettingsRuntimeStore =
                Arc::new(SqliteRuntimeRegionSettingsStore::new(pool.clone()));
            let ai_resource_store: AdminAiResourceRuntimeStore =
                Arc::new(SqliteAdminAiResourceStore::new(pool.clone()));
            let channel_store: AdminChannelRuntimeStore = Arc::new(
                SqliteAdminChannelStore::with_provider_health_probe_and_api_key_secret_codec(
                    pool.clone(),
                    provider_health_probe.clone(),
                    api_key_secret_codec.clone(),
                ),
            );
            let provider_secret_store: AdminProviderSecretRuntimeStore =
                Arc::new(SqliteAdminProviderSecretStore::new(pool.clone()));
            let channel_group_store: AdminChannelGroupRuntimeStore =
                Arc::new(SqliteAdminChannelGroupStore::new(pool.clone()));
            let ip_rate_limit_store: AdminIpRateLimitRuntimeStore =
                Arc::new(SqliteAdminIpRateLimitStore::new(pool.clone()));
            let firewall_rule_store: AdminFirewallRuleRuntimeStore =
                Arc::new(SqliteAdminFirewallRuleStore::new(pool.clone()));
            let api_key_rate_limit_store: AdminApiKeyRateLimitRuntimeStore =
                Arc::new(SqliteAdminApiKeyRateLimitStore::new(pool.clone()));
            let model_rate_limit_store: AdminModelRateLimitRuntimeStore =
                Arc::new(SqliteAdminModelRateLimitStore::new(pool.clone()));
            let model_store: AdminModelRuntimeStore =
                Arc::new(SqliteAdminModelStore::with_models_catalog_root(
                    pool.clone(),
                    configured_models_catalog_root(runtime_toml),
                ));
            let finance_store: AdminFinanceRuntimeStore =
                Arc::new(SqliteAdminFinanceStore::new(pool.clone()));
            let marketing_store: AdminMarketingRuntimeStore =
                Arc::new(SqliteAdminMarketingStore::new(pool.clone()));
            let prompt_store: AdminPromptRuntimeStore =
                Arc::new(SqliteAdminPromptStore::new(pool.clone()));
            let mcp_store: AdminMcpRuntimeStore = Arc::new(SqliteAdminMcpStore::new(pool.clone()));
            let service_provider_store: AdminServiceProviderRuntimeStore =
                Arc::new(SqliteAdminServiceProviderStore::new(pool.clone()));
            let site_store: AdminSiteRuntimeStore =
                Arc::new(SqliteAdminSiteStore::new(pool.clone()));
            let service_node_store: AdminServiceNodeRuntimeStore =
                Arc::new(SqliteAdminServiceNodeStore::new(pool.clone()));
            let storage_store: AdminStorageRuntimeStore =
                Arc::new(SqliteAdminStorageStore::new(pool.clone()));
            let transaction_center_store: AdminTransactionCenterRuntimeStore =
                Arc::new(SqliteAdminTransactionCenterStore::new(pool.clone()));
            let dashboard_read_store: AdminDashboardRuntimeReadStore =
                Arc::new(SqliteAdminDashboardReadStore::new(pool.clone()));
            let analytics_read_store: AdminAnalyticsRuntimeReadStore =
                Arc::new(SqliteAdminAnalyticsReadStore::new(pool.clone()));
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
            let admin_access_checker = AdminAccessChecker::Sqlite(pool.clone());
            Ok(router_with_product_catalog_and_runtime(
                Arc::new(snapshot),
                AdminRouterRuntime {
                    database_config: Some(&config),
                    api_key_hasher: Some(Arc::clone(&api_key_hasher)),
                    agent_store: Some(agent_store),
                    announcement_store: Some(announcement_store),
                    app_store: Some(app_store),
                    auth_settings_store: Some(auth_settings_store),
                    api_key_command_store: Some(api_key_command_store),
                    catalog_store: Some(catalog_store),
                    inventory_store: Some(inventory_store),
                    site_settings_store: Some(site_settings_store),
                    runtime_region_settings_store: Some(runtime_region_settings_store),
                    ai_resource_store: Some(ai_resource_store),
                    channel_store: Some(channel_store),
                    provider_secret_store: Some(provider_secret_store),
                    channel_group_store: Some(channel_group_store),
                    ip_rate_limit_store: Some(ip_rate_limit_store),
                    firewall_rule_store: Some(firewall_rule_store),
                    api_key_rate_limit_store: Some(api_key_rate_limit_store),
                    model_rate_limit_store: Some(model_rate_limit_store),
                    model_store: Some(model_store),
                    finance_store: Some(finance_store),
                    marketing_store: Some(marketing_store),
                    prompt_store: Some(prompt_store),
                    mcp_store: Some(mcp_store),
                    service_node_store: Some(service_node_store),
                    service_provider_store: Some(service_provider_store),
                    site_store: Some(site_store),
                    storage_store: Some(storage_store),
                    transaction_center_store: Some(transaction_center_store),
                    dashboard_read_store: Some(dashboard_read_store),
                    analytics_read_store: Some(analytics_read_store),
                    monitor_read_store: Some(monitor_read_store),
                    record_store: Some(record_store),
                    skill_store: Some(skill_store),
                    model_rankings_store: Some(model_rankings_store),
                    model_ranking_refresh_store: Some(model_ranking_refresh_store),
                    cache_manager: Some(cache_manager.clone()),
                    database_installer: Some(Arc::clone(&database_installer)),
                    trusted_subject_config: Some(trusted_subject_config),
                    app_session_config: Some(app_session_config),
                    admin_access_checker: Some(admin_access_checker),
                    request_limits_config,
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
                let install_report = database_installer.ensure_installed().await?;
                log_bootstrap_admin_report(SERVICE_NAME, &install_report);
            }
            let snapshot = PostgresPricingCatalogLoader::with_api_key_secret_codec(
                pool.clone(),
                api_key_secret_codec.clone(),
            )
            .load_snapshot()
            .await?;
            let announcement_store: AdminAnnouncementRuntimeStore =
                Arc::new(PostgresAdminAnnouncementStore::new(pool.clone()));
            let agent_store: AdminAgentRuntimeStore =
                Arc::new(PostgresAppAgentRegistryStore::new(pool.clone()));
            let app_store: AdminAppRuntimeStore =
                Arc::new(PostgresAdminAppStore::new(pool.clone()));
            let auth_settings_store: AdminAuthSettingsRuntimeStore =
                Arc::new(PostgresAdminAuthSettingsStore::new(pool.clone()));
            let api_key_command_store: ApiKeyCommandRuntimeStore = Arc::new(
                PostgresGatewayApiKeyCommandStore::new(pool.clone(), api_key_secret_codec.clone()),
            );
            let catalog_store: AdminCatalogRuntimeStore =
                Arc::new(PostgresAdminCatalogStore::new(pool.clone()));
            let inventory_store: AdminInventoryRuntimeStore =
                Arc::new(PostgresAdminInventoryStore::new(pool.clone()));
            let site_settings_store: SiteSettingsRuntimeStore =
                Arc::new(PostgresSiteSettingsStore::new(pool.clone()));
            let runtime_region_settings_store: RuntimeRegionSettingsRuntimeStore =
                Arc::new(PostgresRuntimeRegionSettingsStore::new(pool.clone()));
            let ai_resource_store: AdminAiResourceRuntimeStore =
                Arc::new(PostgresAdminAiResourceStore::new(pool.clone()));
            let channel_store: AdminChannelRuntimeStore = Arc::new(
                PostgresAdminChannelStore::with_provider_health_probe_and_api_key_secret_codec(
                    pool.clone(),
                    provider_health_probe,
                    api_key_secret_codec.clone(),
                ),
            );
            let provider_secret_store: AdminProviderSecretRuntimeStore =
                Arc::new(PostgresAdminProviderSecretStore::new(pool.clone()));
            let channel_group_store: AdminChannelGroupRuntimeStore =
                Arc::new(PostgresAdminChannelGroupStore::new(pool.clone()));
            let ip_rate_limit_store: AdminIpRateLimitRuntimeStore =
                Arc::new(PostgresAdminIpRateLimitStore::new(pool.clone()));
            let firewall_rule_store: AdminFirewallRuleRuntimeStore =
                Arc::new(PostgresAdminFirewallRuleStore::new(pool.clone()));
            let api_key_rate_limit_store: AdminApiKeyRateLimitRuntimeStore =
                Arc::new(PostgresAdminApiKeyRateLimitStore::new(pool.clone()));
            let model_rate_limit_store: AdminModelRateLimitRuntimeStore =
                Arc::new(PostgresAdminModelRateLimitStore::new(pool.clone()));
            let model_store: AdminModelRuntimeStore =
                Arc::new(PostgresAdminModelStore::with_models_catalog_root(
                    pool.clone(),
                    configured_models_catalog_root(runtime_toml),
                ));
            let finance_store: AdminFinanceRuntimeStore =
                Arc::new(PostgresAdminFinanceStore::new(pool.clone()));
            let marketing_store: AdminMarketingRuntimeStore =
                Arc::new(PostgresAdminMarketingStore::new(pool.clone()));
            let prompt_store: AdminPromptRuntimeStore =
                Arc::new(PostgresAdminPromptStore::new(pool.clone()));
            let mcp_store: AdminMcpRuntimeStore =
                Arc::new(PostgresAdminMcpStore::new(pool.clone()));
            let service_provider_store: AdminServiceProviderRuntimeStore =
                Arc::new(PostgresAdminServiceProviderStore::new(pool.clone()));
            let site_store: AdminSiteRuntimeStore =
                Arc::new(PostgresAdminSiteStore::new(pool.clone()));
            let service_node_store: AdminServiceNodeRuntimeStore =
                Arc::new(PostgresAdminServiceNodeStore::new(pool.clone()));
            let storage_store: AdminStorageRuntimeStore =
                Arc::new(PostgresAdminStorageStore::new(pool.clone()));
            let transaction_center_store: AdminTransactionCenterRuntimeStore =
                Arc::new(PostgresAdminTransactionCenterStore::new(pool.clone()));
            let dashboard_read_store: AdminDashboardRuntimeReadStore =
                Arc::new(PostgresAdminDashboardReadStore::new(pool.clone()));
            let analytics_read_store: AdminAnalyticsRuntimeReadStore =
                Arc::new(PostgresAdminAnalyticsReadStore::new(pool.clone()));
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
            let admin_access_checker = AdminAccessChecker::Postgres(pool.clone());
            Ok(router_with_product_catalog_and_runtime(
                Arc::new(snapshot),
                AdminRouterRuntime {
                    database_config: Some(&config),
                    api_key_hasher: Some(api_key_hasher),
                    agent_store: Some(agent_store),
                    announcement_store: Some(announcement_store),
                    app_store: Some(app_store),
                    auth_settings_store: Some(auth_settings_store),
                    api_key_command_store: Some(api_key_command_store),
                    catalog_store: Some(catalog_store),
                    inventory_store: Some(inventory_store),
                    site_settings_store: Some(site_settings_store),
                    runtime_region_settings_store: Some(runtime_region_settings_store),
                    ai_resource_store: Some(ai_resource_store),
                    channel_store: Some(channel_store),
                    provider_secret_store: Some(provider_secret_store),
                    channel_group_store: Some(channel_group_store),
                    ip_rate_limit_store: Some(ip_rate_limit_store),
                    firewall_rule_store: Some(firewall_rule_store),
                    api_key_rate_limit_store: Some(api_key_rate_limit_store),
                    model_rate_limit_store: Some(model_rate_limit_store),
                    model_store: Some(model_store),
                    finance_store: Some(finance_store),
                    marketing_store: Some(marketing_store),
                    prompt_store: Some(prompt_store),
                    mcp_store: Some(mcp_store),
                    service_node_store: Some(service_node_store),
                    service_provider_store: Some(service_provider_store),
                    site_store: Some(site_store),
                    storage_store: Some(storage_store),
                    transaction_center_store: Some(transaction_center_store),
                    dashboard_read_store: Some(dashboard_read_store),
                    analytics_read_store: Some(analytics_read_store),
                    monitor_read_store: Some(monitor_read_store),
                    record_store: Some(record_store),
                    skill_store: Some(skill_store),
                    model_rankings_store: Some(model_rankings_store),
                    model_ranking_refresh_store: Some(model_ranking_refresh_store),
                    cache_manager: Some(cache_manager),
                    database_installer: Some(Arc::clone(&database_installer)),
                    trusted_subject_config: Some(trusted_subject_config),
                    app_session_config: Some(app_session_config),
                    admin_access_checker: Some(admin_access_checker),
                    request_limits_config,
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
    let runtime_toml =
        RuntimeTomlConfig::from_env_config_file().map_err(ProductCatalogRouterError::Config)?;
    let config = database_config_from_env_for_startup(runtime_toml.as_ref())?;
    let startup_install_mode = StartupInstallMode::from_env_or_runtime_toml(runtime_toml.as_ref())
        .map_err(ProductCatalogRouterError::Config)?;
    let api_key_config = ApiKeySecurityConfig::from_env_or_runtime_toml(runtime_toml.as_ref())
        .map_err(ProductCatalogRouterError::Config)?;
    let trusted_subject_config =
        TrustedSubjectConfig::from_env_or_runtime_toml(runtime_toml.as_ref())
            .map_err(ProductCatalogRouterError::Config)?;
    let app_session_config = AppSessionConfig::from_env_or_runtime_toml(runtime_toml.as_ref())
        .map_err(ProductCatalogRouterError::Config)?;
    let provider_secret_map_config =
        ProviderSecretMapConfig::from_env_or_runtime_toml(runtime_toml.as_ref())
            .map_err(ProductCatalogRouterError::Config)?;
    match config {
        Some(config) => {
            router_with_database_api_key_trusted_subject_app_session_and_optional_provider_secret_map_config_and_startup_install_mode(
                config,
                Some(require_api_key_security_config(api_key_config)?),
                Some(require_trusted_subject_config(trusted_subject_config)?),
                Some(require_app_session_config(app_session_config)?),
                provider_secret_map_config,
                startup_install_mode,
                runtime_toml.as_ref(),
            )
            .await
        }
        None => Ok(router()),
    }
}

fn database_config_from_env_for_startup(
    runtime_toml: Option<&RuntimeTomlConfig>,
) -> Result<Option<DatabaseConfig>, ProductCatalogRouterError> {
    DatabaseConfig::from_env_or_runtime_toml_or_initialize(runtime_toml)
        .map_err(ProductCatalogRouterError::Config)
}

fn cache_manager_from_env_or_toml(
    runtime_toml: Option<&RuntimeTomlConfig>,
) -> Result<RuntimeCacheManager, ProductCatalogRouterError> {
    let deployment_mode = deployment_mode_from_env_or_toml(runtime_toml)
        .map_err(ProductCatalogRouterError::Config)?;
    if deployment_mode == DeploymentMode::Desktop {
        return Ok(default_desktop_cache_manager());
    }

    let redis_config = RedisConfig::from_env_or_runtime_toml_with_default_enabled(runtime_toml, true)
        .map_err(ProductCatalogRouterError::Config)?
        .ok_or_else(|| {
            ProductCatalogRouterError::Config(format!(
                "Redis cache is required for {} deployment mode. Configure SDKWORK_CLAW_REDIS_URL or structured Redis host/port/database fields.",
                deployment_mode.as_str()
            ))
        })?;
    Ok(default_service_cache_manager(
        DEFAULT_REDIS_CONNECTION_PROFILE_NAME,
        redis_config
            .key_prefix()
            .unwrap_or(DEFAULT_CACHE_KEY_PREFIX)
            .to_owned(),
    )
    .with_backend(
        DEFAULT_SERVICE_CACHE_INSTANCE_NAME,
        Arc::new(
            RedisCacheBackend::with_command_timeout(
                redis_config.url(),
                Duration::from_millis(redis_config.command_timeout_millis()),
            )
            .map_err(|error| ProductCatalogRouterError::Config(error.to_string()))?,
        ),
    ))
}

pub fn shared_cache_manager_from_runtime_toml(
    runtime_toml: Option<&RuntimeTomlConfig>,
) -> Result<RuntimeCacheManager, ProductCatalogRouterError> {
    cache_manager_from_env_or_toml(runtime_toml)
}

fn deployment_mode_from_env_or_toml(
    runtime_toml: Option<&RuntimeTomlConfig>,
) -> Result<DeploymentMode, String> {
    DeploymentMode::from_optional_part(
        std::env::var(DeploymentMode::ENV_DEPLOYMENT_MODE)
            .ok()
            .or_else(|| runtime_toml.and_then(|config| config.runtime.deployment_mode.clone())),
    )
}

fn configured_models_catalog_root(runtime_toml: Option<&RuntimeTomlConfig>) -> Option<String> {
    sdkwork_claw_config::runtime::config_value(
        sdkwork_claw_product::infrastructure::sql::installer::ENV_MODELS_CATALOG_ROOT,
        runtime_toml.and_then(|config| config.install.models_catalog_root.as_deref()),
    )
}

pub fn shared_models_catalog_root_from_runtime_toml(
    runtime_toml: Option<&RuntimeTomlConfig>,
) -> Option<String> {
    configured_models_catalog_root(runtime_toml)
}

fn build_api_key_hasher(
    config: &ApiKeySecurityConfig,
) -> Result<ApiKeyHasher, ProductCatalogRouterError> {
    let hasher = HmacSha256ApiKeySecretHasher::new(config.pepper_secret())
        .map_err(|error| ProductCatalogRouterError::Config(error.to_string()))?;
    Ok(Arc::new(hasher))
}

fn api_key_secret_codec_from_config(
    config: &ApiKeySecurityConfig,
) -> Result<ApiKeyCodec, ProductCatalogRouterError> {
    Ok(Arc::new(
        RingAeadApiKeySecretCodec::new(config.pepper_secret())
            .map_err(|error| ProductCatalogRouterError::Config(error.to_string()))?,
    ))
}

fn build_provider_health_probe(
    provider_secret_map_config: Option<ProviderSecretMapConfig>,
    runtime_toml: Option<&RuntimeTomlConfig>,
) -> Result<ProviderHealthProbeRuntime, ProductCatalogRouterError> {
    let health_probe_timeout = provider_health_probe_timeout_from_env_or_toml(runtime_toml)
        .map_err(ProductCatalogRouterError::Config)?;
    match provider_secret_map_config {
        Some(config) => {
            let resolver = Arc::new(ProviderSecretMapResolver::from_config(config));
            Ok(Arc::new(
                SecretRefOpenAiCompatibleProviderHealthProbe::with_response_timeout(
                    resolver,
                    health_probe_timeout,
                ),
            ))
        }
        None => Ok(Arc::new(UnconfiguredProviderHealthProbe)),
    }
}

pub fn shared_provider_health_probe_from_runtime_toml(
    provider_secret_map_config: Option<ProviderSecretMapConfig>,
    runtime_toml: Option<&RuntimeTomlConfig>,
) -> Result<Arc<dyn ProviderHealthProbe + Send + Sync>, ProductCatalogRouterError> {
    build_provider_health_probe(provider_secret_map_config, runtime_toml)
}

fn provider_health_probe_timeout_from_env_or_toml(
    runtime_toml: Option<&RuntimeTomlConfig>,
) -> Result<Duration, String> {
    const HEALTH_PROBE_TIMEOUT: &str = "SDKWORK_CLAW_PROVIDER_HEALTH_PROBE_TIMEOUT_MILLIS";
    let timeout_millis = sdkwork_claw_config::runtime::config_u64(
        HEALTH_PROBE_TIMEOUT,
        runtime_toml.and_then(|config| config.provider_relay.runtime.health_probe_timeout_millis),
    )?
    .unwrap_or(DEFAULT_HEALTH_PROBE_TIMEOUT_MILLIS);
    if timeout_millis == 0 {
        return Err(format!("{HEALTH_PROBE_TIMEOUT} must be a positive integer"));
    }
    Ok(Duration::from_millis(timeout_millis))
}

fn model_rankings_service(read_store: ModelRankingsRuntimeStore) -> ModelRankingsRuntimeStore {
    Arc::new(ModelRankingsService::new(read_store))
}

async fn admin_request_subject_boundary(
    State(config): State<AdminSubjectBoundaryConfig>,
    mut request: Request<Body>,
    next: Next,
) -> Response {
    let method = request.method().as_str().to_owned();
    let path_and_query = request
        .uri()
        .path_and_query()
        .map(|value| value.as_str().to_owned())
        .unwrap_or_else(|| request.uri().path().to_owned());
    let was_signed_subject_request = has_any_signed_subject_header(request.headers());
    let subject = match sdkwork_claw_http::verified_app_request_subject(
        request.headers_mut(),
        &method,
        &path_and_query,
        &config.subject_boundary,
        current_unix_seconds(),
    ) {
        Ok(subject) => subject,
        Err(message) => return admin_unauthorized_response(message),
    };
    sdkwork_claw_http::attach_trusted_request_subject(&mut request, subject);
    if was_signed_subject_request {
        return next.run(request).await;
    }

    match config.access_checker.has_admin_access(subject).await {
        Ok(true) => next.run(request).await,
        Ok(false) => admin_forbidden_response("admin access is required".to_owned()),
        Err(error) => {
            tracing::warn!(
                tenant_id = subject.tenant_id,
                organization_id = subject.organization_id,
                user_id = subject.user_id,
                error = %error,
                "failed to verify admin access"
            );
            admin_internal_error_response("failed to verify admin access".to_owned())
        }
    }
}

impl AdminAccessChecker {
    async fn has_admin_access(&self, subject: TrustedRequestSubject) -> Result<bool, sqlx::Error> {
        match self {
            Self::Sqlite(pool) => has_sqlite_admin_access(pool, subject).await,
            Self::Postgres(pool) => has_postgres_admin_access(pool, subject).await,
        }
    }
}

async fn has_sqlite_admin_access(
    pool: &SqlitePool,
    subject: TrustedRequestSubject,
) -> Result<bool, sqlx::Error> {
    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM iam_organization_membership
        WHERE tenant_id = ?
          AND organization_id = ?
          AND user_id = ?
          AND status = 'active'
          AND LOWER(COALESCE(membership_kind, '')) = 'admin'
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(subject.organization_id.to_string())
    .bind(subject.user_id.to_string())
    .fetch_one(pool)
    .await?;
    Ok(count > 0)
}

async fn has_postgres_admin_access(
    pool: &PgPool,
    subject: TrustedRequestSubject,
) -> Result<bool, sqlx::Error> {
    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM iam_organization_membership
        WHERE CAST(tenant_id AS TEXT) = $1
          AND CAST(organization_id AS TEXT) = $2
          AND CAST(user_id AS TEXT) = $3
          AND status = 'active'
          AND LOWER(COALESCE(membership_kind, '')) = 'admin'
        "#,
    )
    .bind(subject.tenant_id.to_string())
    .bind(subject.organization_id.to_string())
    .bind(subject.user_id.to_string())
    .fetch_one(pool)
    .await?;
    Ok(count > 0)
}

fn has_any_signed_subject_header(headers: &HeaderMap) -> bool {
    [
        X_SDKWORK_SUBJECT_TENANT_ID,
        X_SDKWORK_SUBJECT_ORGANIZATION_ID,
        X_SDKWORK_SUBJECT_USER_ID,
        X_SDKWORK_SUBJECT_TIMESTAMP,
        X_SDKWORK_SUBJECT_SIGNATURE,
    ]
    .iter()
    .any(|name| headers.contains_key(*name))
}

fn current_unix_seconds() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0)
}

fn admin_unauthorized_response(message: String) -> Response {
    admin_boundary_error_response(StatusCode::UNAUTHORIZED, "4010", message)
}

fn admin_forbidden_response(message: String) -> Response {
    admin_boundary_error_response(StatusCode::FORBIDDEN, "4030", message)
}

fn admin_internal_error_response(message: String) -> Response {
    admin_boundary_error_response(StatusCode::INTERNAL_SERVER_ERROR, "5000", message)
}

fn admin_boundary_error_response(
    status: StatusCode,
    code: &'static str,
    message: String,
) -> Response {
    (
        status,
        Json(AdminBoundaryErrorEnvelope {
            code,
            msg: message,
            data: None,
        }),
    )
        .into_response()
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
    let runtime_toml = sdkwork_claw_config::RuntimeTomlConfig::from_env_config_file()
        .map_err(anyhow::Error::msg)?;
    serve_with_runtime_config(bind_addr, runtime_toml.as_ref()).await
}

pub async fn serve_with_runtime_config(
    bind_addr: &str,
    runtime_toml: Option<&sdkwork_claw_config::RuntimeTomlConfig>,
) -> anyhow::Result<()> {
    sdkwork_claw_observability::init_tracing_with_runtime_config(
        runtime_toml.map(|config| &config.observability),
    )
    .map_err(anyhow::Error::msg)?;
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
    async fn router_from_env_initializes_zero_config_desktop_sqlite() {
        let _guard = env_guard().lock().unwrap();
        let saved_database_url = std::env::var("SDKWORK_CLAW_DATABASE_URL").ok();
        let saved_deployment_mode = std::env::var("SDKWORK_CLAW_DEPLOYMENT_MODE").ok();
        let saved_config_file = std::env::var("SDKWORK_CLAW_CONFIG_FILE").ok();
        let saved_api_key_pepper = std::env::var("SDKWORK_CLAW_API_KEY_PEPPER").ok();
        let saved_trusted_subject_secret =
            std::env::var("SDKWORK_CLAW_TRUSTED_SUBJECT_SECRET").ok();
        let saved_app_session_secret = std::env::var("SDKWORK_CLAW_APP_SESSION_SECRET").ok();
        let config_path = unique_runtime_config_path();
        std::env::remove_var("SDKWORK_CLAW_DATABASE_URL");
        std::env::set_var("SDKWORK_CLAW_DEPLOYMENT_MODE", "desktop");
        std::env::set_var("SDKWORK_CLAW_CONFIG_FILE", &config_path);
        std::env::set_var(
            "SDKWORK_CLAW_API_KEY_PEPPER",
            "0123456789abcdef0123456789abcdef",
        );
        std::env::set_var(
            "SDKWORK_CLAW_TRUSTED_SUBJECT_SECRET",
            "trusted-subject-secret-0123456789",
        );
        std::env::set_var(
            "SDKWORK_CLAW_APP_SESSION_SECRET",
            "app-session-secret-0123456789abcd",
        );

        let router_result = router_from_env().await;

        restore_env_var("SDKWORK_CLAW_DATABASE_URL", saved_database_url);
        restore_env_var("SDKWORK_CLAW_DEPLOYMENT_MODE", saved_deployment_mode);
        restore_env_var("SDKWORK_CLAW_CONFIG_FILE", saved_config_file);
        restore_env_var("SDKWORK_CLAW_API_KEY_PEPPER", saved_api_key_pepper);
        restore_env_var(
            "SDKWORK_CLAW_TRUSTED_SUBJECT_SECRET",
            saved_trusted_subject_secret,
        );
        restore_env_var("SDKWORK_CLAW_APP_SESSION_SECRET", saved_app_session_secret);

        let router = router_result
            .expect("admin-api desktop startup should initialize local SQLite by default");

        drop(router);
        assert!(config_path.exists());
        let generated_config = std::fs::read_to_string(config_path).unwrap();
        assert!(generated_config.contains("engine = \"sqlite\""));
        assert!(generated_config.contains("deployment_mode = \"desktop\""));
        assert!(generated_config.contains("clawrouter.sqlite"));
    }

    fn unique_runtime_config_path() -> std::path::PathBuf {
        let millis = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis();
        let mut path = std::env::temp_dir();
        path.push(format!("sdkwork-claw-admin-runtime-{millis}"));
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
