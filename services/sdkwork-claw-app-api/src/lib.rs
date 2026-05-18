use std::sync::Arc;
use std::time::Duration;

use axum::middleware::from_fn_with_state;
use axum::Router;
use sdkwork_claw_config::{
    ApiKeySecurityConfig, AppSessionConfig, DatabaseConfig, DatabaseEngine, DeploymentMode,
    PaymentWebhookConfig, ProviderSecretMapConfig, RequestLimitsConfig, RuntimeConfigProfile,
    RuntimeTomlConfig, StartupInstallMode, TrustedSubjectConfig,
};
use sdkwork_claw_http::AppSubjectBoundaryConfig;
use sdkwork_claw_product::application::{
    ApiKeySecretCodec, ApiKeySecretHasher, EntityUuidGenerator, ModelRankingRefreshWorker,
    ModelRankingRefreshWorkerConfig, ModelRankingsService, PasswordHasher,
    Pbkdf2Sha256PasswordHasher,
};
use sdkwork_claw_product::infrastructure::crypto::{
    HmacSha256ApiKeySecretHasher, RingAeadApiKeySecretCodec,
};
use sdkwork_claw_product::infrastructure::provider::{
    ProviderSecretMapResolver, SecretRefOpenAiCompatibleProviderHealthProbe,
    DEFAULT_HEALTH_PROBE_TIMEOUT_MILLIS,
};
use sdkwork_claw_product::infrastructure::sql::installer::{
    log_bootstrap_admin_report, DatabaseInstallError, DatabaseInstaller,
};
use sdkwork_claw_product::infrastructure::sql::postgres::{
    PostgresAccountSummaryReadStore, PostgresAdminAuthSettingsStore, PostgresAppAgentRegistryStore,
    PostgresAppAuthStore, PostgresAppCommerceExchangeStore, PostgresAppGatewayTracesReadStore,
    PostgresAppGenerationAgentRunStore, PostgresAppGenerationHistoryReadStore,
    PostgresAppMessagesReadStore, PostgresAppProvidersReadStore,
    PostgresAppRoutingChannelCommandStore, PostgresAppRoutingReadStore,
    PostgresAppRoutingStrategyStore, PostgresAppSessionEventStore, PostgresAppSkillsReadStore,
    PostgresAppStoreReadStore, PostgresAppUserProfileReadStore, PostgresBillingStore,
    PostgresCatalogLoadError, PostgresCheckoutStore, PostgresCourseStore,
    PostgresDashboardOverviewReadStore, PostgresForumStore, PostgresGatewayApiKeyCommandStore,
    PostgresModelRankingRefreshStore, PostgresModelRankingsReadStore, PostgresPaymentCallbackStore,
    PostgresPricingCatalogLoader, PostgresRechargeStore, PostgresSettingsStore,
    PostgresSettlementsDashboardReadStore, PostgresUsageLogsReadStore,
    PostgresVerificationDeliveryConfigStore,
};
use sdkwork_claw_product::infrastructure::sql::sqlite::{
    SqlCatalogLoadError, SqliteAccountSummaryReadStore, SqliteAdminAuthSettingsStore,
    SqliteAppAgentRegistryStore, SqliteAppAuthStore, SqliteAppCommerceExchangeStore,
    SqliteAppGatewayTracesReadStore, SqliteAppGenerationAgentRunStore,
    SqliteAppGenerationHistoryReadStore, SqliteAppMessagesReadStore, SqliteAppProvidersReadStore,
    SqliteAppRoutingChannelCommandStore, SqliteAppRoutingReadStore, SqliteAppRoutingStrategyStore,
    SqliteAppSessionEventStore, SqliteAppSkillsReadStore, SqliteAppStoreReadStore,
    SqliteAppUserProfileReadStore, SqliteBillingStore, SqliteCheckoutStore, SqliteCourseStore,
    SqliteDashboardOverviewReadStore, SqliteForumStore, SqliteGatewayApiKeyCommandStore,
    SqliteModelRankingRefreshStore, SqliteModelRankingsReadStore, SqlitePaymentCallbackStore,
    SqlitePricingCatalogLoader, SqliteRechargeStore, SqliteSettingsStore,
    SqliteSettlementsDashboardReadStore, SqliteUsageLogsReadStore,
    SqliteVerificationDeliveryConfigStore,
};
use sdkwork_claw_product::infrastructure::OsApiKeySecretGenerator;
use sdkwork_claw_product::ports::PricingCatalog;
use sdkwork_claw_product::ports::{
    AccountSummaryReadStore, AdminAuthSettingsStore, AppAgentRegistryStore, AppAuthStore,
    AppCommerceExchangeReadStore, AppGatewayTracesReadStore, AppGenerationAgentRunStore,
    AppGenerationHistoryReadStore, AppMessagesReadStore, AppProvidersReadStore,
    AppRoutingChannelCommandStore, AppRoutingReadStore, AppRoutingStrategyStore,
    AppSessionEventStore, AppSkillsCommandStore, AppSkillsReadStore, AppStoreReadStore,
    AppUserProfileReadStore, BillingStore, CheckoutStore, CourseApplicationCommandStore,
    CourseReadStore, DashboardOverviewReadStore, ForumCommentCommandStore, ForumCommentReadStore,
    ForumFeedCommandStore, ForumFeedReadStore, GatewayApiKeyCommandStore,
    GatewayApiKeyManagementReadStore, ModelRankingRefreshOutcome, ModelRankingRefreshRunStatus,
    ModelRankingRefreshStore, ModelRankingsCacheInvalidation, ModelRankingsReadModelStore,
    PaymentCallbackStore, ProviderHealthProbe, RechargeStore, SettingsStore,
    SettlementsDashboardReadStore, UnconfiguredProviderHealthProbe, UsageLogsReadStore,
    VerificationCodeSender,
};
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};
use sqlx::{PgPool, SqlitePool};
use std::str::FromStr;

pub const SERVICE_NAME: &str = "sdkwork-claw-app-api";
type ApiKeyHasher = Arc<dyn ApiKeySecretHasher + Send + Sync>;
type ApiKeyCodec = Arc<dyn ApiKeySecretCodec + Send + Sync>;
type ApiKeyManagementReadStore = Arc<dyn GatewayApiKeyManagementReadStore + Send + Sync>;
type AccountSummaryStore = Arc<dyn AccountSummaryReadStore + Send + Sync>;
type AppAgentRegistryRuntimeStore = Arc<dyn AppAgentRegistryStore + Send + Sync>;
type AppGatewayTracesStore = Arc<dyn AppGatewayTracesReadStore + Send + Sync>;
type AppGenerationAgentRunRuntimeStore = Arc<dyn AppGenerationAgentRunStore + Send + Sync>;
type AppMessagesStore = Arc<dyn AppMessagesReadStore + Send + Sync>;
type AppGenerationHistoryStore = Arc<dyn AppGenerationHistoryReadStore + Send + Sync>;
type AppProvidersStore = Arc<dyn AppProvidersReadStore + Send + Sync>;
type AppRoutingChannelCommandRuntimeStore = Arc<dyn AppRoutingChannelCommandStore + Send + Sync>;
type AppRoutingStore = Arc<dyn AppRoutingReadStore + Send + Sync>;
type AppRoutingStrategyRuntimeStore = Arc<dyn AppRoutingStrategyStore + Send + Sync>;
type AppAuthRuntimeStore = Arc<dyn AppAuthStore + Send + Sync>;
type AppCommerceExchangeRuntimeStore = Arc<dyn AppCommerceExchangeReadStore + Send + Sync>;
type AppAuthSettingsRuntimeStore = Arc<dyn AdminAuthSettingsStore + Send + Sync>;
type AppSessionAuditStore = Arc<dyn AppSessionEventStore + Send + Sync>;
type AppVerificationCodeSender = Arc<dyn VerificationCodeSender + Send + Sync>;
type AppPasswordHasher = Arc<dyn PasswordHasher + Send + Sync>;
type AppSkillsRuntimeStore = Arc<dyn AppSkillsReadStore + Send + Sync>;
type AppSkillsCommandRuntimeStore = Arc<dyn AppSkillsCommandStore + Send + Sync>;
type AppStoreRuntimeStore = Arc<dyn AppStoreReadStore + Send + Sync>;
type AppUserProfileStore = Arc<dyn AppUserProfileReadStore + Send + Sync>;
type CourseReadRuntimeStore = Arc<dyn CourseReadStore + Send + Sync>;
type CourseCommandRuntimeStore = Arc<dyn CourseApplicationCommandStore + Send + Sync>;
type ForumFeedReadRuntimeStore = Arc<dyn ForumFeedReadStore + Send + Sync>;
type ForumFeedCommandRuntimeStore = Arc<dyn ForumFeedCommandStore + Send + Sync>;
type ForumCommentReadRuntimeStore = Arc<dyn ForumCommentReadStore + Send + Sync>;
type ForumCommentCommandRuntimeStore = Arc<dyn ForumCommentCommandStore + Send + Sync>;
type BillingRuntimeStore = Arc<dyn BillingStore + Send + Sync>;
type CheckoutRuntimeStore = Arc<dyn CheckoutStore + Send + Sync>;
type DashboardReadStore = Arc<dyn DashboardOverviewReadStore + Send + Sync>;
type EntityUuidGen = Arc<dyn EntityUuidGenerator + Send + Sync>;
type PaymentCallbackRuntimeStore = Arc<dyn PaymentCallbackStore + Send + Sync>;
type RechargeRuntimeStore = Arc<dyn RechargeStore + Send + Sync>;
type SettlementsDashboardStore = Arc<dyn SettlementsDashboardReadStore + Send + Sync>;
type SettingsRuntimeStore = Arc<dyn SettingsStore + Send + Sync>;
type UsageLogsStore = Arc<dyn UsageLogsReadStore + Send + Sync>;
type ProviderHealthProbeRuntime = Arc<dyn ProviderHealthProbe + Send + Sync>;
type ModelRankingRefreshRuntimeStore = Arc<dyn ModelRankingRefreshStore + Send + Sync>;
type ModelRankingsRuntimeStore = Arc<dyn ModelRankingsReadModelStore + Send + Sync>;

pub fn router() -> Router {
    merge_commerce_foundation_router(router_with_database_status(None))
        .merge(sdkwork_claw_product::api::app_account_summary_router())
        .merge(sdkwork_claw_product::api::app_user_profile_router())
        .merge(sdkwork_claw_product::api::app_billing_router())
        .merge(sdkwork_claw_product::api::app_checkout_router())
        .merge(sdkwork_claw_product::api::app_recharge_router())
        .merge(sdkwork_claw_product::api::app_payment_callback_router())
        .merge(sdkwork_claw_product::api::app_dashboard_overview_router())
        .merge(sdkwork_claw_product::api::app_model_rankings_router())
        .merge(sdkwork_claw_product::api::app_settlements_dashboard_router())
        .merge(sdkwork_claw_product::api::app_settings_router())
        .merge(sdkwork_claw_product::api::app_usage_logs_router())
        .merge(sdkwork_claw_product::api::app_gateway_traces_router())
        .merge(sdkwork_claw_product::api::app_messages_router())
        .merge(sdkwork_claw_product::api::app_generation_history_router())
        .merge(sdkwork_claw_product::api::app_generation_agent_router())
        .merge(sdkwork_claw_product::api::app_agent_registry_router())
        .merge(sdkwork_claw_product::api::app_store_router())
        .merge(sdkwork_claw_product::api::app_skills_router())
        .merge(sdkwork_claw_product::api::app_course_router())
        .merge(sdkwork_claw_product::api::app_forum_router())
        .merge(sdkwork_claw_product::api::app_providers_router())
        .merge(sdkwork_claw_product::api::app_routing_router())
        .merge(sdkwork_claw_product::api::app_routing_strategy_router())
        .merge(sdkwork_claw_product::api::app_routing_channel_command_router())
}

fn router_with_database_status(config: Option<&DatabaseConfig>) -> Router {
    sdkwork_claw_http::service_router_with_contract_routes_and_database_config(
        SERVICE_NAME,
        sdkwork_claw_http::ApiSurface::App,
        config,
    )
}

pub fn router_with_product_catalog<C>(catalog: Arc<C>) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    router_with_product_catalog_and_database_status(catalog, None)
}

pub fn router_with_api_key_management_read_store_command_store_and_api_key_security_config(
    read_store: ApiKeyManagementReadStore,
    command_store: Arc<dyn GatewayApiKeyCommandStore + Send + Sync>,
    app_session_event_store: AppSessionAuditStore,
    api_key_security_config: ApiKeySecurityConfig,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
) -> Result<Router, ProductCatalogRouterError> {
    Ok(router_with_api_key_management_store_and_database_status(
        read_store,
        command_store,
        app_session_event_store,
        None,
        None,
        api_key_hasher_from_config(&api_key_security_config)?,
        api_key_secret_codec_from_config(&api_key_security_config)?,
        Arc::new(OsApiKeySecretGenerator),
        trusted_subject_config,
        app_session_config,
        Arc::new(Pbkdf2Sha256PasswordHasher),
        Arc::new(sdkwork_claw_product::ports::DebugVerificationCodeSender),
        true,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        None,
        RequestLimitsConfig::default(),
    ))
}

pub fn router_with_app_session_event_store_and_config(
    app_session_event_store: AppSessionAuditStore,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
) -> Router {
    router_with_app_session_event_store_auth_settings_store_and_config_inner(
        app_session_event_store,
        None,
        trusted_subject_config,
        app_session_config,
    )
}

pub fn router_with_app_session_event_store_auth_settings_store_and_config(
    app_session_event_store: AppSessionAuditStore,
    app_auth_settings_store: Arc<dyn AdminAuthSettingsStore + Send + Sync>,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
) -> Router {
    router_with_app_session_event_store_auth_settings_store_and_config_inner(
        app_session_event_store,
        Some(app_auth_settings_store),
        trusted_subject_config,
        app_session_config,
    )
}

fn router_with_app_session_event_store_auth_settings_store_and_config_inner(
    app_session_event_store: AppSessionAuditStore,
    app_auth_settings_store: Option<AppAuthSettingsRuntimeStore>,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
) -> Router {
    merge_commerce_foundation_router(router_with_database_status(None))
        .merge(sdkwork_claw_product::api::app_account_summary_router())
        .merge(sdkwork_claw_product::api::app_user_profile_router())
        .merge(sdkwork_claw_product::api::app_billing_router())
        .merge(sdkwork_claw_product::api::app_checkout_router())
        .merge(sdkwork_claw_product::api::app_recharge_router())
        .merge(sdkwork_claw_product::api::app_payment_callback_router())
        .merge(sdkwork_claw_product::api::app_dashboard_overview_router())
        .merge(sdkwork_claw_product::api::app_model_rankings_router())
        .merge(sdkwork_claw_product::api::app_settlements_dashboard_router())
        .merge(sdkwork_claw_product::api::app_settings_router())
        .merge(sdkwork_claw_product::api::app_usage_logs_router())
        .merge(sdkwork_claw_product::api::app_gateway_traces_router())
        .merge(sdkwork_claw_product::api::app_messages_router())
        .merge(sdkwork_claw_product::api::app_generation_history_router())
        .merge(sdkwork_claw_product::api::app_generation_agent_router())
        .merge(sdkwork_claw_product::api::app_agent_registry_router())
        .merge(sdkwork_claw_product::api::app_store_router())
        .merge(sdkwork_claw_product::api::app_skills_router())
        .merge(sdkwork_claw_product::api::app_course_router())
        .merge(sdkwork_claw_product::api::app_forum_router())
        .merge(sdkwork_claw_product::api::app_providers_router())
        .merge(sdkwork_claw_product::api::app_routing_router())
        .merge(sdkwork_claw_product::api::app_routing_strategy_router())
        .merge(sdkwork_claw_product::api::app_routing_channel_command_router())
        .merge(app_sessions_router(
            None,
            app_auth_settings_store,
            app_session_event_store,
            Arc::new(OsApiKeySecretGenerator),
            trusted_subject_config,
            app_session_config,
            Arc::new(Pbkdf2Sha256PasswordHasher),
            Arc::new(sdkwork_claw_product::ports::DebugVerificationCodeSender),
            true,
        ))
}

fn router_with_product_catalog_and_database_status<C>(
    catalog: Arc<C>,
    config: Option<&DatabaseConfig>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    merge_commerce_foundation_router(router_with_database_status(config))
        .merge(sdkwork_claw_product::api::app_account_summary_router())
        .merge(sdkwork_claw_product::api::app_user_profile_router())
        .merge(sdkwork_claw_product::api::app_billing_router())
        .merge(sdkwork_claw_product::api::app_checkout_router())
        .merge(sdkwork_claw_product::api::app_recharge_router())
        .merge(sdkwork_claw_product::api::app_payment_callback_router())
        .merge(sdkwork_claw_product::api::app_dashboard_overview_router())
        .merge(sdkwork_claw_product::api::app_model_rankings_router())
        .merge(sdkwork_claw_product::api::app_settlements_dashboard_router())
        .merge(sdkwork_claw_product::api::app_settings_router())
        .merge(sdkwork_claw_product::api::app_usage_logs_router())
        .merge(sdkwork_claw_product::api::app_gateway_traces_router())
        .merge(sdkwork_claw_product::api::app_messages_router())
        .merge(sdkwork_claw_product::api::app_generation_history_router())
        .merge(sdkwork_claw_product::api::app_generation_agent_router())
        .merge(sdkwork_claw_product::api::app_agent_registry_router())
        .merge(sdkwork_claw_product::api::app_store_router())
        .merge(sdkwork_claw_product::api::app_skills_router())
        .merge(sdkwork_claw_product::api::app_course_router())
        .merge(sdkwork_claw_product::api::app_forum_router())
        .merge(sdkwork_claw_product::api::app_providers_router())
        .merge(sdkwork_claw_product::api::app_routing_router())
        .merge(sdkwork_claw_product::api::app_routing_strategy_router())
        .merge(sdkwork_claw_product::api::app_routing_channel_command_router())
        .merge(sdkwork_claw_product::api::app_model_catalog_router(
            Arc::clone(&catalog),
        ))
        .merge(sdkwork_claw_product::api::app_api_key_router(catalog))
}

fn router_with_api_key_management_store_and_database_status(
    read_store: ApiKeyManagementReadStore,
    command_store: Arc<dyn GatewayApiKeyCommandStore + Send + Sync>,
    app_session_event_store: AppSessionAuditStore,
    app_auth_store: Option<AppAuthRuntimeStore>,
    app_auth_settings_store: Option<AppAuthSettingsRuntimeStore>,
    api_key_hasher: ApiKeyHasher,
    _api_key_secret_codec: ApiKeyCodec,
    entity_uuid_generator: EntityUuidGen,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
    password_hasher: AppPasswordHasher,
    verification_code_sender: AppVerificationCodeSender,
    expose_debug_verification_code: bool,
    payment_webhook_config: Option<PaymentWebhookConfig>,
    app_commerce_exchange_store: Option<AppCommerceExchangeRuntimeStore>,
    account_summary_read_store: Option<AccountSummaryStore>,
    app_user_profile_read_store: Option<AppUserProfileStore>,
    billing_store: Option<BillingRuntimeStore>,
    checkout_store: Option<CheckoutRuntimeStore>,
    recharge_store: Option<RechargeRuntimeStore>,
    payment_callback_store: Option<PaymentCallbackRuntimeStore>,
    dashboard_read_store: Option<DashboardReadStore>,
    settlements_dashboard_read_store: Option<SettlementsDashboardStore>,
    settings_store: Option<SettingsRuntimeStore>,
    usage_logs_read_store: Option<UsageLogsStore>,
    app_gateway_traces_read_store: Option<AppGatewayTracesStore>,
    app_messages_read_store: Option<AppMessagesStore>,
    app_generation_history_read_store: Option<AppGenerationHistoryStore>,
    app_generation_agent_run_store: Option<AppGenerationAgentRunRuntimeStore>,
    app_agent_registry_store: Option<AppAgentRegistryRuntimeStore>,
    app_store_read_store: Option<AppStoreRuntimeStore>,
    app_skills_read_store: Option<AppSkillsRuntimeStore>,
    app_skills_command_store: Option<AppSkillsCommandRuntimeStore>,
    course_read_store: Option<CourseReadRuntimeStore>,
    course_command_store: Option<CourseCommandRuntimeStore>,
    forum_feed_read_store: Option<ForumFeedReadRuntimeStore>,
    forum_feed_command_store: Option<ForumFeedCommandRuntimeStore>,
    forum_comment_read_store: Option<ForumCommentReadRuntimeStore>,
    forum_comment_command_store: Option<ForumCommentCommandRuntimeStore>,
    app_providers_read_store: Option<AppProvidersStore>,
    app_routing_read_store: Option<AppRoutingStore>,
    app_routing_strategy_store: Option<AppRoutingStrategyRuntimeStore>,
    app_routing_channel_command_store: Option<AppRoutingChannelCommandRuntimeStore>,
    model_catalog_router: Option<Router>,
    config: Option<&DatabaseConfig>,
    request_limits_config: RequestLimitsConfig,
) -> Router {
    let subject_boundary_config =
        AppSubjectBoundaryConfig::new(trusted_subject_config.clone(), app_session_config.clone());
    let app_session_router = app_sessions_router(
        app_auth_store.clone(),
        app_auth_settings_store.clone(),
        Arc::clone(&app_session_event_store),
        Arc::clone(&entity_uuid_generator),
        trusted_subject_config,
        app_session_config.clone(),
        Arc::clone(&password_hasher),
        verification_code_sender,
        expose_debug_verification_code,
    );
    let api_key_router =
        sdkwork_claw_product::api::app_api_key_router_with_read_store_and_command_store(
            read_store,
            command_store,
            api_key_hasher,
            Arc::new(OsApiKeySecretGenerator),
        )
        .layer(from_fn_with_state(
            subject_boundary_config.clone(),
            sdkwork_claw_http::app_request_subject_boundary,
        ));
    let foundation_router = match app_commerce_exchange_store {
        Some(exchange_store) => {
            sdkwork_claw_product::api::app_commerce_foundation_router_with_exchange_store(
                exchange_store,
            )
            .layer(from_fn_with_state(
                subject_boundary_config.clone(),
                sdkwork_claw_http::app_request_subject_boundary,
            ))
        }
        None => sdkwork_claw_product::api::app_commerce_foundation_router(),
    };
    let mut router = router_with_database_status(config)
        .merge(foundation_router)
        .merge(app_session_router)
        .merge(api_key_router);
    if let Some(model_catalog_router) = model_catalog_router {
        router = router.merge(model_catalog_router);
    }
    router = match account_summary_read_store {
        Some(read_store) => router.merge(
            sdkwork_claw_product::api::app_account_summary_router_with_read_store(read_store)
                .layer(from_fn_with_state(
                    subject_boundary_config.clone(),
                    sdkwork_claw_http::app_request_subject_boundary,
                )),
        ),
        None => router.merge(sdkwork_claw_product::api::app_account_summary_router()),
    };
    router = match app_user_profile_read_store {
        Some(read_store) => router.merge(
            sdkwork_claw_product::api::app_user_profile_router_with_read_store(read_store).layer(
                from_fn_with_state(
                    subject_boundary_config.clone(),
                    sdkwork_claw_http::app_request_subject_boundary,
                ),
            ),
        ),
        None => router.merge(sdkwork_claw_product::api::app_user_profile_router()),
    };
    router = match billing_store {
        Some(store) => router.merge(
            sdkwork_claw_product::api::app_billing_router_with_store(
                store,
                Arc::new(OsApiKeySecretGenerator),
            )
            .layer(from_fn_with_state(
                subject_boundary_config.clone(),
                sdkwork_claw_http::optional_app_request_subject_boundary,
            )),
        ),
        None => router.merge(sdkwork_claw_product::api::app_billing_router()),
    };
    router = match checkout_store {
        Some(store) => router.merge(
            sdkwork_claw_product::api::app_checkout_router_with_store(store).layer(
                from_fn_with_state(
                    subject_boundary_config.clone(),
                    sdkwork_claw_http::app_request_subject_boundary,
                ),
            ),
        ),
        None => router.merge(sdkwork_claw_product::api::app_checkout_router()),
    };
    router = match recharge_store {
        Some(store) => router.merge(
            sdkwork_claw_product::api::app_recharge_router_with_store(
                store,
                Arc::new(OsApiKeySecretGenerator),
            )
            .layer(from_fn_with_state(
                subject_boundary_config.clone(),
                sdkwork_claw_http::optional_app_request_subject_boundary,
            )),
        ),
        None => router.merge(sdkwork_claw_product::api::app_recharge_router()),
    };
    // payment callback router must not use app_request_subject_boundary: providers cannot send app user session headers.
    router = match payment_callback_store {
        Some(store) => match payment_webhook_config {
            Some(payment_webhook_config) => router.merge(
                sdkwork_claw_product::api::app_payment_callback_router_with_store_and_body_limit(
                    store,
                    Arc::new(OsApiKeySecretGenerator),
                    payment_webhook_config,
                    request_limits_config.payment_callback_body_max_bytes(),
                ),
            ),
            None => router.merge(sdkwork_claw_product::api::app_payment_callback_router()),
        },
        None => router.merge(sdkwork_claw_product::api::app_payment_callback_router()),
    };
    router = match dashboard_read_store {
        Some(read_store) => router.merge(
            sdkwork_claw_product::api::app_dashboard_overview_router_with_read_store(read_store)
                .layer(from_fn_with_state(
                    subject_boundary_config.clone(),
                    sdkwork_claw_http::app_request_subject_boundary,
                )),
        ),
        None => router.merge(sdkwork_claw_product::api::app_dashboard_overview_router()),
    };
    router = match usage_logs_read_store {
        Some(read_store) => router.merge(
            sdkwork_claw_product::api::app_usage_logs_router_with_read_store(read_store).layer(
                from_fn_with_state(
                    subject_boundary_config.clone(),
                    sdkwork_claw_http::app_request_subject_boundary,
                ),
            ),
        ),
        None => router.merge(sdkwork_claw_product::api::app_usage_logs_router()),
    };
    router = match app_gateway_traces_read_store {
        Some(read_store) => router.merge(
            sdkwork_claw_product::api::app_gateway_traces_router_with_read_store(read_store).layer(
                from_fn_with_state(
                    subject_boundary_config.clone(),
                    sdkwork_claw_http::app_request_subject_boundary,
                ),
            ),
        ),
        None => router.merge(sdkwork_claw_product::api::app_gateway_traces_router()),
    };
    router = match app_messages_read_store {
        Some(read_store) => router.merge(
            sdkwork_claw_product::api::app_messages_router_with_read_store(read_store).layer(
                from_fn_with_state(
                    subject_boundary_config.clone(),
                    sdkwork_claw_http::app_request_subject_boundary,
                ),
            ),
        ),
        None => router.merge(sdkwork_claw_product::api::app_messages_router()),
    };
    router = match app_generation_history_read_store {
        Some(read_store) => router.merge(
            sdkwork_claw_product::api::app_generation_history_router_with_read_store(read_store)
                .layer(from_fn_with_state(
                    subject_boundary_config.clone(),
                    sdkwork_claw_http::app_request_subject_boundary,
                )),
        ),
        None => router.merge(sdkwork_claw_product::api::app_generation_history_router()),
    };
    router = match app_generation_agent_run_store {
        Some(store) => router.merge(
            sdkwork_claw_product::api::app_generation_agent_router_with_store_and_uuid_generator(
                store,
                Arc::new(OsApiKeySecretGenerator),
            )
            .layer(from_fn_with_state(
                subject_boundary_config.clone(),
                sdkwork_claw_http::app_request_subject_boundary,
            )),
        ),
        None => router.merge(sdkwork_claw_product::api::app_generation_agent_router()),
    };
    router = match app_agent_registry_store {
        Some(store) => router.merge(
            sdkwork_claw_product::api::app_agent_registry_router_with_store(
                store,
                Arc::new(OsApiKeySecretGenerator),
            )
            .layer(from_fn_with_state(
                subject_boundary_config.clone(),
                sdkwork_claw_http::app_request_subject_boundary,
            )),
        ),
        None => router.merge(sdkwork_claw_product::api::app_agent_registry_router()),
    };
    router = match app_store_read_store {
        Some(read_store) => router.merge(
            sdkwork_claw_product::api::app_store_router_with_read_store(read_store).layer(
                from_fn_with_state(
                    subject_boundary_config.clone(),
                    sdkwork_claw_http::optional_app_request_subject_boundary,
                ),
            ),
        ),
        None => router.merge(sdkwork_claw_product::api::app_store_router()),
    };
    router = match app_skills_read_store {
        Some(read_store) => {
            let skills_router = match app_skills_command_store {
                Some(command_store) => sdkwork_claw_product::api::app_skills_router_with_store(
                    read_store,
                    command_store,
                    Arc::new(OsApiKeySecretGenerator),
                ),
                None => sdkwork_claw_product::api::app_skills_router_with_read_store(read_store),
            };
            router.merge(skills_router.layer(from_fn_with_state(
                subject_boundary_config.clone(),
                sdkwork_claw_http::optional_app_request_subject_boundary,
            )))
        }
        None => router.merge(sdkwork_claw_product::api::app_skills_router()),
    };
    router = match (course_read_store, course_command_store) {
        (Some(read_store), Some(command_store)) => router.merge(
            sdkwork_claw_product::api::app_course_router_with_store(read_store, command_store)
                .layer(from_fn_with_state(
                    subject_boundary_config.clone(),
                    sdkwork_claw_http::optional_app_request_subject_boundary,
                )),
        ),
        (Some(read_store), None) => router.merge(
            sdkwork_claw_product::api::app_course_router_with_read_store(read_store).layer(
                from_fn_with_state(
                    subject_boundary_config.clone(),
                    sdkwork_claw_http::optional_app_request_subject_boundary,
                ),
            ),
        ),
        _ => router.merge(sdkwork_claw_product::api::app_course_router()),
    };
    router = match (
        forum_feed_read_store,
        forum_feed_command_store,
        forum_comment_read_store,
        forum_comment_command_store,
    ) {
        (
            Some(feed_read_store),
            Some(feed_command_store),
            Some(comment_read_store),
            Some(comment_command_store),
        ) => router.merge(app_forum_router_with_store_and_subject_boundary(
            feed_read_store,
            feed_command_store,
            comment_read_store,
            comment_command_store,
            subject_boundary_config.trusted_subject().clone(),
            subject_boundary_config.app_session().clone(),
            request_limits_config.forum_json_body_max_bytes(),
        )),
        _ => router.merge(sdkwork_claw_product::api::app_forum_router()),
    };
    router = match app_providers_read_store {
        Some(read_store) => router.merge(
            sdkwork_claw_product::api::app_providers_router_with_read_store(read_store).layer(
                from_fn_with_state(
                    subject_boundary_config.clone(),
                    sdkwork_claw_http::app_request_subject_boundary,
                ),
            ),
        ),
        None => router.merge(sdkwork_claw_product::api::app_providers_router()),
    };
    router = match app_routing_read_store {
        Some(read_store) => router.merge(
            sdkwork_claw_product::api::app_routing_router_with_read_store(read_store).layer(
                from_fn_with_state(
                    subject_boundary_config.clone(),
                    sdkwork_claw_http::app_request_subject_boundary,
                ),
            ),
        ),
        None => router.merge(sdkwork_claw_product::api::app_routing_router()),
    };
    router = match app_routing_strategy_store {
        Some(store) => router.merge(
            sdkwork_claw_product::api::app_routing_strategy_router_with_store(
                store,
                Arc::new(OsApiKeySecretGenerator),
            )
            .layer(from_fn_with_state(
                subject_boundary_config.clone(),
                sdkwork_claw_http::app_request_subject_boundary,
            )),
        ),
        None => router.merge(sdkwork_claw_product::api::app_routing_strategy_router()),
    };
    router = match app_routing_channel_command_store {
        Some(store) => router.merge(
            sdkwork_claw_product::api::app_routing_channel_command_router_with_store(
                store,
                Arc::new(OsApiKeySecretGenerator),
            )
            .layer(from_fn_with_state(
                subject_boundary_config.clone(),
                sdkwork_claw_http::app_request_subject_boundary,
            )),
        ),
        None => router.merge(sdkwork_claw_product::api::app_routing_channel_command_router()),
    };
    router = match settings_store {
        Some(store) => router.merge(
            sdkwork_claw_product::api::app_settings_router_with_store(
                store,
                Arc::new(OsApiKeySecretGenerator),
            )
            .layer(from_fn_with_state(
                subject_boundary_config.clone(),
                sdkwork_claw_http::app_request_subject_boundary,
            )),
        ),
        None => router.merge(sdkwork_claw_product::api::app_settings_router()),
    };
    router = match settlements_dashboard_read_store {
        Some(read_store) => router.merge(
            sdkwork_claw_product::api::app_settlements_dashboard_router_with_read_store(read_store)
                .layer(from_fn_with_state(
                    subject_boundary_config,
                    sdkwork_claw_http::app_request_subject_boundary,
                )),
        ),
        None => router.merge(sdkwork_claw_product::api::app_settlements_dashboard_router()),
    };
    router
}

fn merge_commerce_foundation_router(router: Router) -> Router {
    router.merge(sdkwork_claw_product::api::app_commerce_foundation_router())
}

fn app_sessions_router(
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
}

async fn sqlite_verification_code_sender(
    pool: &SqlitePool,
    deployment_mode: DeploymentMode,
) -> Result<(AppVerificationCodeSender, bool), sqlx::Error> {
    Ok(match deployment_mode {
        DeploymentMode::Desktop => (
            Arc::new(sdkwork_claw_product::ports::DebugVerificationCodeSender),
            true,
        ),
        DeploymentMode::Server | DeploymentMode::Docker | DeploymentMode::Kubernetes => {
            let subject = sqlite_default_verification_delivery_subject(pool).await?;
            (
                Arc::new(
                    sdkwork_claw_product::ports::ConfiguredVerificationCodeSender::new(Arc::new(
                        SqliteVerificationDeliveryConfigStore::new(pool.clone()),
                    ))
                    .with_subject(subject.0, subject.1),
                ),
                false,
            )
        }
    })
}

async fn postgres_verification_code_sender(
    pool: &PgPool,
    deployment_mode: DeploymentMode,
) -> Result<(AppVerificationCodeSender, bool), sqlx::Error> {
    Ok(match deployment_mode {
        DeploymentMode::Desktop => (
            Arc::new(sdkwork_claw_product::ports::DebugVerificationCodeSender),
            true,
        ),
        DeploymentMode::Server | DeploymentMode::Docker | DeploymentMode::Kubernetes => {
            let subject = postgres_default_verification_delivery_subject(pool).await?;
            (
                Arc::new(
                    sdkwork_claw_product::ports::ConfiguredVerificationCodeSender::new(Arc::new(
                        PostgresVerificationDeliveryConfigStore::new(pool.clone()),
                    ))
                    .with_subject(subject.0, subject.1),
                ),
                false,
            )
        }
    })
}

async fn sqlite_default_verification_delivery_subject(
    pool: &SqlitePool,
) -> Result<(i64, i64), sqlx::Error> {
    let tenant_id_raw: String =
        sqlx::query_scalar("SELECT id FROM iam_tenant WHERE status = 'active' ORDER BY id LIMIT 1")
            .fetch_one(pool)
            .await?;
    let organization_id_raw: String = sqlx::query_scalar(
        "SELECT id FROM iam_organization WHERE tenant_id = ? AND status = 'active' ORDER BY id LIMIT 1",
    )
    .bind(&tenant_id_raw)
    .fetch_one(pool)
    .await?;
    let tenant_id = parse_numeric_subject_id("iam_tenant.id", &tenant_id_raw)?;
    let organization_id = parse_numeric_subject_id("iam_organization.id", &organization_id_raw)?;
    Ok((tenant_id, organization_id))
}

async fn postgres_default_verification_delivery_subject(
    pool: &PgPool,
) -> Result<(i64, i64), sqlx::Error> {
    let tenant_id_raw: String =
        sqlx::query_scalar("SELECT id FROM iam_tenant WHERE status = 'active' ORDER BY id LIMIT 1")
            .fetch_one(pool)
            .await?;
    let organization_id_raw: String = sqlx::query_scalar(
        "SELECT id FROM iam_organization WHERE tenant_id = $1 AND status = 'active' ORDER BY id LIMIT 1",
    )
    .bind(&tenant_id_raw)
    .fetch_one(pool)
    .await?;
    let tenant_id = parse_numeric_subject_id("iam_tenant.id", &tenant_id_raw)?;
    let organization_id = parse_numeric_subject_id("iam_organization.id", &organization_id_raw)?;
    Ok((tenant_id, organization_id))
}

fn parse_numeric_subject_id(column: &'static str, value: &str) -> Result<i64, sqlx::Error> {
    value
        .trim()
        .parse::<i64>()
        .map_err(|error| sqlx::Error::Protocol(format!("{column} must be numeric: {error}")))
}

pub fn app_forum_router_with_store_and_subject_boundary(
    feed_read_store: Arc<dyn ForumFeedReadStore + Send + Sync>,
    feed_command_store: Arc<dyn ForumFeedCommandStore + Send + Sync>,
    comment_read_store: Arc<dyn ForumCommentReadStore + Send + Sync>,
    comment_command_store: Arc<dyn ForumCommentCommandStore + Send + Sync>,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
    json_body_max_bytes: usize,
) -> Router {
    sdkwork_claw_product::api::app_forum_router_with_store_community_links_and_json_body_limit(
        feed_read_store,
        feed_command_store,
        comment_read_store,
        comment_command_store,
        Arc::new(OsApiKeySecretGenerator),
        sdkwork_claw_product::api::configured_forum_community_links(),
        json_body_max_bytes,
    )
    .layer(from_fn_with_state(
        AppSubjectBoundaryConfig::new(trusted_subject_config, app_session_config),
        sdkwork_claw_http::optional_app_request_subject_boundary,
    ))
}

pub async fn router_with_sqlite_product_catalog(
    pool: SqlitePool,
    api_key_security_config: ApiKeySecurityConfig,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
    payment_webhook_config: PaymentWebhookConfig,
) -> Result<Router, ProductCatalogRouterError> {
    let api_key_hasher = api_key_hasher_from_config(&api_key_security_config)?;
    let api_key_secret_codec = api_key_secret_codec_from_config(&api_key_security_config)?;
    let read_store = SqlitePricingCatalogLoader::with_api_key_secret_codec(
        pool.clone(),
        api_key_secret_codec.clone(),
    );
    let model_catalog_snapshot = read_store.load_snapshot().await?;
    let model_rankings_store =
        model_rankings_service(Arc::new(SqliteModelRankingsReadStore::new(pool.clone())));
    let model_catalog_router =
        sdkwork_claw_product::api::app_model_catalog_router(Arc::new(model_catalog_snapshot))
            .merge(app_model_rankings_router_with_subject_boundary(
                model_rankings_store,
                &trusted_subject_config,
                &app_session_config,
            ));
    let account_summary_read_store = Arc::new(SqliteAccountSummaryReadStore::new(pool.clone()));
    let app_user_profile_read_store = Arc::new(SqliteAppUserProfileReadStore::new(pool.clone()));
    let billing_store = Arc::new(SqliteBillingStore::new(pool.clone()));
    let app_commerce_exchange_store = Arc::new(SqliteAppCommerceExchangeStore::new(pool.clone()));
    let checkout_store = Arc::new(SqliteCheckoutStore::new(pool.clone()));
    let recharge_store = Arc::new(SqliteRechargeStore::new(pool.clone()));
    let payment_callback_store = Arc::new(SqlitePaymentCallbackStore::new(pool.clone()));
    let dashboard_read_store = Arc::new(SqliteDashboardOverviewReadStore::new(pool.clone()));
    let settlements_dashboard_read_store =
        Arc::new(SqliteSettlementsDashboardReadStore::new(pool.clone()));
    let settings_store = Arc::new(SqliteSettingsStore::new(pool.clone()));
    let usage_logs_read_store = Arc::new(SqliteUsageLogsReadStore::new(pool.clone()));
    let app_gateway_traces_read_store =
        Arc::new(SqliteAppGatewayTracesReadStore::new(pool.clone()));
    let app_messages_read_store = Arc::new(SqliteAppMessagesReadStore::new(pool.clone()));
    let app_generation_history_read_store =
        Arc::new(SqliteAppGenerationHistoryReadStore::new(pool.clone()));
    let app_generation_agent_run_store =
        Arc::new(SqliteAppGenerationAgentRunStore::new(pool.clone()));
    let app_agent_registry_store = Arc::new(SqliteAppAgentRegistryStore::new(pool.clone()));
    let app_store_read_store = Arc::new(SqliteAppStoreReadStore::new(pool.clone()));
    let app_skills_store = Arc::new(SqliteAppSkillsReadStore::new(pool.clone()));
    let course_store = Arc::new(SqliteCourseStore::new(pool.clone()));
    let forum_store = Arc::new(SqliteForumStore::new(pool.clone()));
    let app_providers_read_store = Arc::new(SqliteAppProvidersReadStore::new(pool.clone()));
    let app_routing_read_store = Arc::new(SqliteAppRoutingReadStore::with_api_key_secret_codec(
        pool.clone(),
        api_key_secret_codec.clone(),
    ));
    let app_routing_strategy_store = Arc::new(SqliteAppRoutingStrategyStore::new(pool.clone()));
    let app_routing_channel_command_store =
        Arc::new(SqliteAppRoutingChannelCommandStore::new(pool.clone()));
    let app_auth_settings_store = Arc::new(SqliteAdminAuthSettingsStore::new(pool.clone()));
    Ok(router_with_api_key_management_store_and_database_status(
        Arc::new(read_store),
        Arc::new(SqliteGatewayApiKeyCommandStore::new(
            pool.clone(),
            api_key_secret_codec.clone(),
        )),
        Arc::new(SqliteAppSessionEventStore::new(pool.clone())),
        Some(Arc::new(SqliteAppAuthStore::new(pool))),
        Some(app_auth_settings_store),
        api_key_hasher,
        api_key_secret_codec,
        Arc::new(OsApiKeySecretGenerator),
        trusted_subject_config,
        app_session_config,
        Arc::new(Pbkdf2Sha256PasswordHasher),
        Arc::new(sdkwork_claw_product::ports::DebugVerificationCodeSender),
        true,
        Some(payment_webhook_config),
        Some(app_commerce_exchange_store),
        Some(account_summary_read_store),
        Some(app_user_profile_read_store),
        Some(billing_store),
        Some(checkout_store),
        Some(recharge_store),
        Some(payment_callback_store),
        Some(dashboard_read_store),
        Some(settlements_dashboard_read_store),
        Some(settings_store),
        Some(usage_logs_read_store),
        Some(app_gateway_traces_read_store),
        Some(app_messages_read_store),
        Some(app_generation_history_read_store),
        Some(app_generation_agent_run_store),
        Some(app_agent_registry_store),
        Some(app_store_read_store),
        Some(app_skills_store.clone()),
        Some(app_skills_store),
        Some(course_store.clone()),
        Some(course_store),
        Some(forum_store.clone()),
        Some(forum_store.clone()),
        Some(forum_store.clone()),
        Some(forum_store),
        Some(app_providers_read_store),
        Some(app_routing_read_store),
        Some(app_routing_strategy_store),
        Some(app_routing_channel_command_store),
        Some(model_catalog_router),
        None,
        RequestLimitsConfig::default(),
    ))
}

pub async fn router_with_postgres_product_catalog(
    pool: PgPool,
    api_key_security_config: ApiKeySecurityConfig,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
    payment_webhook_config: PaymentWebhookConfig,
) -> Result<Router, ProductCatalogRouterError> {
    let api_key_hasher = api_key_hasher_from_config(&api_key_security_config)?;
    let api_key_secret_codec = api_key_secret_codec_from_config(&api_key_security_config)?;
    let read_store = PostgresPricingCatalogLoader::with_api_key_secret_codec(
        pool.clone(),
        api_key_secret_codec.clone(),
    );
    let model_catalog_snapshot = read_store.load_snapshot().await?;
    let model_rankings_store =
        model_rankings_service(Arc::new(PostgresModelRankingsReadStore::new(pool.clone())));
    let model_catalog_router =
        sdkwork_claw_product::api::app_model_catalog_router(Arc::new(model_catalog_snapshot))
            .merge(app_model_rankings_router_with_subject_boundary(
                model_rankings_store,
                &trusted_subject_config,
                &app_session_config,
            ));
    let account_summary_read_store = Arc::new(PostgresAccountSummaryReadStore::new(pool.clone()));
    let app_user_profile_read_store = Arc::new(PostgresAppUserProfileReadStore::new(pool.clone()));
    let billing_store = Arc::new(PostgresBillingStore::new(pool.clone()));
    let app_commerce_exchange_store = Arc::new(PostgresAppCommerceExchangeStore::new(pool.clone()));
    let checkout_store = Arc::new(PostgresCheckoutStore::new(pool.clone()));
    let recharge_store = Arc::new(PostgresRechargeStore::new(pool.clone()));
    let payment_callback_store = Arc::new(PostgresPaymentCallbackStore::new(pool.clone()));
    let dashboard_read_store = Arc::new(PostgresDashboardOverviewReadStore::new(pool.clone()));
    let settlements_dashboard_read_store =
        Arc::new(PostgresSettlementsDashboardReadStore::new(pool.clone()));
    let settings_store = Arc::new(PostgresSettingsStore::new(pool.clone()));
    let usage_logs_read_store = Arc::new(PostgresUsageLogsReadStore::new(pool.clone()));
    let app_gateway_traces_read_store =
        Arc::new(PostgresAppGatewayTracesReadStore::new(pool.clone()));
    let app_messages_read_store = Arc::new(PostgresAppMessagesReadStore::new(pool.clone()));
    let app_generation_history_read_store =
        Arc::new(PostgresAppGenerationHistoryReadStore::new(pool.clone()));
    let app_generation_agent_run_store =
        Arc::new(PostgresAppGenerationAgentRunStore::new(pool.clone()));
    let app_agent_registry_store = Arc::new(PostgresAppAgentRegistryStore::new(pool.clone()));
    let app_store_read_store = Arc::new(PostgresAppStoreReadStore::new(pool.clone()));
    let app_skills_store = Arc::new(PostgresAppSkillsReadStore::new(pool.clone()));
    let course_store = Arc::new(PostgresCourseStore::new(pool.clone()));
    let forum_store = Arc::new(PostgresForumStore::new(pool.clone()));
    let app_providers_read_store = Arc::new(PostgresAppProvidersReadStore::new(pool.clone()));
    let app_routing_read_store = Arc::new(PostgresAppRoutingReadStore::with_api_key_secret_codec(
        pool.clone(),
        api_key_secret_codec.clone(),
    ));
    let app_routing_strategy_store = Arc::new(PostgresAppRoutingStrategyStore::new(pool.clone()));
    let app_routing_channel_command_store =
        Arc::new(PostgresAppRoutingChannelCommandStore::new(pool.clone()));
    let app_auth_settings_store = Arc::new(PostgresAdminAuthSettingsStore::new(pool.clone()));
    Ok(router_with_api_key_management_store_and_database_status(
        Arc::new(read_store),
        Arc::new(PostgresGatewayApiKeyCommandStore::new(
            pool.clone(),
            api_key_secret_codec.clone(),
        )),
        Arc::new(PostgresAppSessionEventStore::new(pool.clone())),
        Some(Arc::new(PostgresAppAuthStore::new(pool))),
        Some(app_auth_settings_store),
        api_key_hasher,
        api_key_secret_codec,
        Arc::new(OsApiKeySecretGenerator),
        trusted_subject_config,
        app_session_config,
        Arc::new(Pbkdf2Sha256PasswordHasher),
        Arc::new(sdkwork_claw_product::ports::DebugVerificationCodeSender),
        true,
        Some(payment_webhook_config),
        Some(app_commerce_exchange_store),
        Some(account_summary_read_store),
        Some(app_user_profile_read_store),
        Some(billing_store),
        Some(checkout_store),
        Some(recharge_store),
        Some(payment_callback_store),
        Some(dashboard_read_store),
        Some(settlements_dashboard_read_store),
        Some(settings_store),
        Some(usage_logs_read_store),
        Some(app_gateway_traces_read_store),
        Some(app_messages_read_store),
        Some(app_generation_history_read_store),
        Some(app_generation_agent_run_store),
        Some(app_agent_registry_store),
        Some(app_store_read_store),
        Some(app_skills_store.clone()),
        Some(app_skills_store),
        Some(course_store.clone()),
        Some(course_store),
        Some(forum_store.clone()),
        Some(forum_store.clone()),
        Some(forum_store.clone()),
        Some(forum_store),
        Some(app_providers_read_store),
        Some(app_routing_read_store),
        Some(app_routing_strategy_store),
        Some(app_routing_channel_command_store),
        Some(model_catalog_router),
        None,
        RequestLimitsConfig::default(),
    ))
}

pub async fn router_with_database_config(
    config: DatabaseConfig,
) -> Result<Router, ProductCatalogRouterError> {
    let api_key_security_config = require_api_key_security_config(
        ApiKeySecurityConfig::from_env().map_err(ProductCatalogRouterError::Config)?,
    )?;
    let trusted_subject_config = require_trusted_subject_config(
        TrustedSubjectConfig::from_env().map_err(ProductCatalogRouterError::Config)?,
    )?;
    let app_session_config = require_app_session_config(
        AppSessionConfig::from_env().map_err(ProductCatalogRouterError::Config)?,
    )?;
    let payment_webhook_config = require_payment_webhook_config(
        PaymentWebhookConfig::from_env().map_err(ProductCatalogRouterError::Config)?,
    )?;
    let provider_secret_map_config =
        ProviderSecretMapConfig::from_env().map_err(ProductCatalogRouterError::Config)?;
    router_with_database_config_api_key_trusted_subject_app_session_and_optional_provider_secret_map_config(
        config,
        api_key_security_config,
        trusted_subject_config,
        app_session_config,
        payment_webhook_config,
        provider_secret_map_config,
        DeploymentMode::from_env(),
    )
    .await
}

pub async fn router_with_database_config_api_key_trusted_subject_and_app_session_config(
    config: DatabaseConfig,
    api_key_security_config: ApiKeySecurityConfig,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
    payment_webhook_config: PaymentWebhookConfig,
) -> Result<Router, ProductCatalogRouterError> {
    router_with_database_config_api_key_trusted_subject_app_session_and_optional_provider_secret_map_config(
        config,
        api_key_security_config,
        trusted_subject_config,
        app_session_config,
        payment_webhook_config,
        None,
        DeploymentMode::from_env(),
    )
    .await
}

pub async fn router_with_database_config_api_key_trusted_subject_app_session_deployment_mode_config(
    config: DatabaseConfig,
    api_key_security_config: ApiKeySecurityConfig,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
    payment_webhook_config: PaymentWebhookConfig,
    deployment_mode: DeploymentMode,
) -> Result<Router, ProductCatalogRouterError> {
    router_with_database_config_api_key_trusted_subject_app_session_and_optional_provider_secret_map_config(
        config,
        api_key_security_config,
        trusted_subject_config,
        app_session_config,
        payment_webhook_config,
        None,
        deployment_mode,
    )
    .await
}

pub async fn router_with_database_config_api_key_trusted_subject_app_session_and_provider_secret_map_config(
    config: DatabaseConfig,
    api_key_security_config: ApiKeySecurityConfig,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
    payment_webhook_config: PaymentWebhookConfig,
    provider_secret_map_config: ProviderSecretMapConfig,
) -> Result<Router, ProductCatalogRouterError> {
    router_with_database_config_api_key_trusted_subject_app_session_and_optional_provider_secret_map_config(
        config,
        api_key_security_config,
        trusted_subject_config,
        app_session_config,
        payment_webhook_config,
        Some(provider_secret_map_config),
        DeploymentMode::from_env(),
    )
    .await
}

pub async fn router_with_database_config_api_key_trusted_subject_app_session_provider_secret_map_and_deployment_mode_config(
    config: DatabaseConfig,
    api_key_security_config: ApiKeySecurityConfig,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
    payment_webhook_config: PaymentWebhookConfig,
    provider_secret_map_config: ProviderSecretMapConfig,
    deployment_mode: DeploymentMode,
) -> Result<Router, ProductCatalogRouterError> {
    router_with_database_config_api_key_trusted_subject_app_session_and_optional_provider_secret_map_config(
        config,
        api_key_security_config,
        trusted_subject_config,
        app_session_config,
        payment_webhook_config,
        Some(provider_secret_map_config),
        deployment_mode,
    )
    .await
}

async fn router_with_database_config_api_key_trusted_subject_app_session_and_optional_provider_secret_map_config(
    config: DatabaseConfig,
    api_key_security_config: ApiKeySecurityConfig,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
    payment_webhook_config: PaymentWebhookConfig,
    provider_secret_map_config: Option<ProviderSecretMapConfig>,
    deployment_mode: DeploymentMode,
) -> Result<Router, ProductCatalogRouterError> {
    router_with_database_config_api_key_trusted_subject_app_session_and_optional_provider_secret_map_config_and_startup_install_mode(
        config,
        api_key_security_config,
        trusted_subject_config,
        app_session_config,
        payment_webhook_config,
        provider_secret_map_config,
        deployment_mode,
        StartupInstallMode::Ensure,
        None,
    )
    .await
}

async fn router_with_database_config_api_key_trusted_subject_app_session_and_optional_provider_secret_map_config_and_startup_install_mode(
    config: DatabaseConfig,
    api_key_security_config: ApiKeySecurityConfig,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
    payment_webhook_config: PaymentWebhookConfig,
    provider_secret_map_config: Option<ProviderSecretMapConfig>,
    deployment_mode: DeploymentMode,
    startup_install_mode: StartupInstallMode,
    runtime_toml: Option<&RuntimeTomlConfig>,
) -> Result<Router, ProductCatalogRouterError> {
    let request_limits_config = RequestLimitsConfig::from_env_or_runtime_toml(runtime_toml)
        .map_err(ProductCatalogRouterError::Config)?;
    let api_key_hasher = api_key_hasher_from_config(&api_key_security_config)?;
    let api_key_secret_codec = api_key_secret_codec_from_config(&api_key_security_config)?;
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
            if startup_install_mode.should_ensure() {
                let install_report = DatabaseInstaller::for_sqlite(pool.clone())
                    .with_env_options()?
                    .ensure_installed()
                    .await?;
                log_bootstrap_admin_report(SERVICE_NAME, &install_report);
            }
            let read_store = SqlitePricingCatalogLoader::with_api_key_secret_codec(
                pool.clone(),
                api_key_secret_codec.clone(),
            );
            let model_catalog_snapshot = read_store.load_snapshot().await?;
            let model_rankings_store =
                model_rankings_service(Arc::new(SqliteModelRankingsReadStore::new(pool.clone())));
            maybe_spawn_sqlite_model_ranking_refresh_worker(
                &pool,
                model_ranking_refresh_worker_config_from_env_or_toml(runtime_toml)
                    .map_err(ProductCatalogRouterError::Config)?,
                Some(Arc::clone(&model_rankings_store)),
            )
            .await?;
            let model_catalog_router = sdkwork_claw_product::api::app_model_catalog_router(
                Arc::new(model_catalog_snapshot),
            )
            .merge(app_model_rankings_router_with_subject_boundary(
                model_rankings_store,
                &trusted_subject_config,
                &app_session_config,
            ));
            let account_summary_read_store =
                Arc::new(SqliteAccountSummaryReadStore::new(pool.clone()));
            let app_user_profile_read_store =
                Arc::new(SqliteAppUserProfileReadStore::new(pool.clone()));
            let billing_store = Arc::new(SqliteBillingStore::new(pool.clone()));
            let app_commerce_exchange_store =
                Arc::new(SqliteAppCommerceExchangeStore::new(pool.clone()));
            let checkout_store = Arc::new(SqliteCheckoutStore::new(pool.clone()));
            let recharge_store = Arc::new(SqliteRechargeStore::new(pool.clone()));
            let payment_callback_store = Arc::new(SqlitePaymentCallbackStore::new(pool.clone()));
            let dashboard_read_store =
                Arc::new(SqliteDashboardOverviewReadStore::new(pool.clone()));
            let settlements_dashboard_read_store =
                Arc::new(SqliteSettlementsDashboardReadStore::new(pool.clone()));
            let settings_store = Arc::new(SqliteSettingsStore::new(pool.clone()));
            let usage_logs_read_store = Arc::new(SqliteUsageLogsReadStore::new(pool.clone()));
            let app_gateway_traces_read_store =
                Arc::new(SqliteAppGatewayTracesReadStore::new(pool.clone()));
            let app_messages_read_store = Arc::new(SqliteAppMessagesReadStore::new(pool.clone()));
            let app_generation_history_read_store =
                Arc::new(SqliteAppGenerationHistoryReadStore::new(pool.clone()));
            let app_generation_agent_run_store =
                Arc::new(SqliteAppGenerationAgentRunStore::new(pool.clone()));
            let app_agent_registry_store = Arc::new(SqliteAppAgentRegistryStore::new(pool.clone()));
            let app_store_read_store = Arc::new(SqliteAppStoreReadStore::new(pool.clone()));
            let app_skills_store = Arc::new(SqliteAppSkillsReadStore::new(pool.clone()));
            let course_store = Arc::new(SqliteCourseStore::new(pool.clone()));
            let forum_store = Arc::new(SqliteForumStore::new(pool.clone()));
            let app_providers_read_store = Arc::new(SqliteAppProvidersReadStore::new(pool.clone()));
            let app_routing_read_store =
                Arc::new(SqliteAppRoutingReadStore::with_api_key_secret_codec(
                    pool.clone(),
                    api_key_secret_codec.clone(),
                ));
            let app_routing_strategy_store =
                Arc::new(SqliteAppRoutingStrategyStore::new(pool.clone()));
            let app_routing_channel_command_store = Arc::new(
                SqliteAppRoutingChannelCommandStore::with_provider_health_probe(
                    pool.clone(),
                    provider_health_probe.clone(),
                ),
            );
            let (verification_code_sender, expose_debug_verification_code) =
                sqlite_verification_code_sender(&pool, deployment_mode)
                    .await
                    .map_err(|error| {
                        ProductCatalogRouterError::Sqlite(SqlCatalogLoadError::Database(error))
                    })?;
            Ok(router_with_api_key_management_store_and_database_status(
                Arc::new(read_store),
                Arc::new(SqliteGatewayApiKeyCommandStore::new(
                    pool.clone(),
                    api_key_secret_codec.clone(),
                )),
                Arc::new(SqliteAppSessionEventStore::new(pool.clone())),
                Some(Arc::new(SqliteAppAuthStore::new(pool.clone()))),
                Some(Arc::new(SqliteAdminAuthSettingsStore::new(pool.clone()))),
                api_key_hasher,
                api_key_secret_codec,
                Arc::new(OsApiKeySecretGenerator),
                trusted_subject_config,
                app_session_config,
                Arc::new(Pbkdf2Sha256PasswordHasher),
                verification_code_sender,
                expose_debug_verification_code,
                Some(payment_webhook_config),
                Some(app_commerce_exchange_store),
                Some(account_summary_read_store),
                Some(app_user_profile_read_store),
                Some(billing_store),
                Some(checkout_store),
                Some(recharge_store),
                Some(payment_callback_store),
                Some(dashboard_read_store),
                Some(settlements_dashboard_read_store),
                Some(settings_store),
                Some(usage_logs_read_store),
                Some(app_gateway_traces_read_store),
                Some(app_messages_read_store),
                Some(app_generation_history_read_store),
                Some(app_generation_agent_run_store),
                Some(app_agent_registry_store),
                Some(app_store_read_store),
                Some(app_skills_store.clone()),
                Some(app_skills_store),
                Some(course_store.clone()),
                Some(course_store),
                Some(forum_store.clone()),
                Some(forum_store.clone()),
                Some(forum_store.clone()),
                Some(forum_store),
                Some(app_providers_read_store),
                Some(app_routing_read_store),
                Some(app_routing_strategy_store),
                Some(app_routing_channel_command_store),
                Some(model_catalog_router),
                Some(&config),
                request_limits_config,
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
            if startup_install_mode.should_ensure() {
                let install_report = DatabaseInstaller::for_postgres(pool.clone())
                    .with_env_options()?
                    .ensure_installed()
                    .await?;
                log_bootstrap_admin_report(SERVICE_NAME, &install_report);
            }
            let read_store = PostgresPricingCatalogLoader::with_api_key_secret_codec(
                pool.clone(),
                api_key_secret_codec.clone(),
            );
            let model_catalog_snapshot = read_store.load_snapshot().await?;
            let model_rankings_store =
                model_rankings_service(Arc::new(PostgresModelRankingsReadStore::new(pool.clone())));
            maybe_spawn_postgres_model_ranking_refresh_worker(
                &pool,
                model_ranking_refresh_worker_config_from_env_or_toml(runtime_toml)
                    .map_err(ProductCatalogRouterError::Config)?,
                Some(Arc::clone(&model_rankings_store)),
            )
            .await?;
            let model_catalog_router = sdkwork_claw_product::api::app_model_catalog_router(
                Arc::new(model_catalog_snapshot),
            )
            .merge(app_model_rankings_router_with_subject_boundary(
                model_rankings_store,
                &trusted_subject_config,
                &app_session_config,
            ));
            let account_summary_read_store =
                Arc::new(PostgresAccountSummaryReadStore::new(pool.clone()));
            let app_user_profile_read_store =
                Arc::new(PostgresAppUserProfileReadStore::new(pool.clone()));
            let billing_store = Arc::new(PostgresBillingStore::new(pool.clone()));
            let app_commerce_exchange_store =
                Arc::new(PostgresAppCommerceExchangeStore::new(pool.clone()));
            let checkout_store = Arc::new(PostgresCheckoutStore::new(pool.clone()));
            let recharge_store = Arc::new(PostgresRechargeStore::new(pool.clone()));
            let payment_callback_store = Arc::new(PostgresPaymentCallbackStore::new(pool.clone()));
            let dashboard_read_store =
                Arc::new(PostgresDashboardOverviewReadStore::new(pool.clone()));
            let settlements_dashboard_read_store =
                Arc::new(PostgresSettlementsDashboardReadStore::new(pool.clone()));
            let settings_store = Arc::new(PostgresSettingsStore::new(pool.clone()));
            let usage_logs_read_store = Arc::new(PostgresUsageLogsReadStore::new(pool.clone()));
            let app_gateway_traces_read_store =
                Arc::new(PostgresAppGatewayTracesReadStore::new(pool.clone()));
            let app_messages_read_store = Arc::new(PostgresAppMessagesReadStore::new(pool.clone()));
            let app_generation_history_read_store =
                Arc::new(PostgresAppGenerationHistoryReadStore::new(pool.clone()));
            let app_generation_agent_run_store =
                Arc::new(PostgresAppGenerationAgentRunStore::new(pool.clone()));
            let app_agent_registry_store =
                Arc::new(PostgresAppAgentRegistryStore::new(pool.clone()));
            let app_store_read_store = Arc::new(PostgresAppStoreReadStore::new(pool.clone()));
            let app_skills_store = Arc::new(PostgresAppSkillsReadStore::new(pool.clone()));
            let course_store = Arc::new(PostgresCourseStore::new(pool.clone()));
            let forum_store = Arc::new(PostgresForumStore::new(pool.clone()));
            let app_providers_read_store =
                Arc::new(PostgresAppProvidersReadStore::new(pool.clone()));
            let app_routing_read_store =
                Arc::new(PostgresAppRoutingReadStore::with_api_key_secret_codec(
                    pool.clone(),
                    api_key_secret_codec.clone(),
                ));
            let app_routing_strategy_store =
                Arc::new(PostgresAppRoutingStrategyStore::new(pool.clone()));
            let app_routing_channel_command_store = Arc::new(
                PostgresAppRoutingChannelCommandStore::with_provider_health_probe(
                    pool.clone(),
                    provider_health_probe,
                ),
            );
            let (verification_code_sender, expose_debug_verification_code) =
                postgres_verification_code_sender(&pool, deployment_mode)
                    .await
                    .map_err(|error| {
                        ProductCatalogRouterError::Postgres(PostgresCatalogLoadError::Database(
                            error,
                        ))
                    })?;
            Ok(router_with_api_key_management_store_and_database_status(
                Arc::new(read_store),
                Arc::new(PostgresGatewayApiKeyCommandStore::new(
                    pool.clone(),
                    api_key_secret_codec.clone(),
                )),
                Arc::new(PostgresAppSessionEventStore::new(pool.clone())),
                Some(Arc::new(PostgresAppAuthStore::new(pool.clone()))),
                Some(Arc::new(PostgresAdminAuthSettingsStore::new(pool.clone()))),
                api_key_hasher,
                api_key_secret_codec,
                Arc::new(OsApiKeySecretGenerator),
                trusted_subject_config,
                app_session_config,
                Arc::new(Pbkdf2Sha256PasswordHasher),
                verification_code_sender,
                expose_debug_verification_code,
                Some(payment_webhook_config),
                Some(app_commerce_exchange_store),
                Some(account_summary_read_store),
                Some(app_user_profile_read_store),
                Some(billing_store),
                Some(checkout_store),
                Some(recharge_store),
                Some(payment_callback_store),
                Some(dashboard_read_store),
                Some(settlements_dashboard_read_store),
                Some(settings_store),
                Some(usage_logs_read_store),
                Some(app_gateway_traces_read_store),
                Some(app_messages_read_store),
                Some(app_generation_history_read_store),
                Some(app_generation_agent_run_store),
                Some(app_agent_registry_store),
                Some(app_store_read_store),
                Some(app_skills_store.clone()),
                Some(app_skills_store),
                Some(course_store.clone()),
                Some(course_store),
                Some(forum_store.clone()),
                Some(forum_store.clone()),
                Some(forum_store.clone()),
                Some(forum_store),
                Some(app_providers_read_store),
                Some(app_routing_read_store),
                Some(app_routing_strategy_store),
                Some(app_routing_channel_command_store),
                Some(model_catalog_router),
                Some(&config),
                request_limits_config,
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
    let config = require_database_config(
        DatabaseConfig::from_env_or_runtime_toml_or_initialize(runtime_toml.as_ref())
            .map_err(ProductCatalogRouterError::Config)?,
        runtime_toml.as_ref(),
    )?;
    let startup_install_mode = StartupInstallMode::from_env_or_runtime_toml(runtime_toml.as_ref())
        .map_err(ProductCatalogRouterError::Config)?;
    let api_key_security_config =
        ApiKeySecurityConfig::from_env_or_runtime_toml(runtime_toml.as_ref())
            .map_err(ProductCatalogRouterError::Config)?;
    let trusted_subject_config =
        TrustedSubjectConfig::from_env_or_runtime_toml(runtime_toml.as_ref())
            .map_err(ProductCatalogRouterError::Config)?;
    let app_session_config = AppSessionConfig::from_env_or_runtime_toml(runtime_toml.as_ref())
        .map_err(ProductCatalogRouterError::Config)?;
    let payment_webhook_config =
        PaymentWebhookConfig::from_env_or_runtime_toml(runtime_toml.as_ref())
            .map_err(ProductCatalogRouterError::Config)?;
    let provider_secret_map_config =
        ProviderSecretMapConfig::from_env_or_runtime_toml(runtime_toml.as_ref())
            .map_err(ProductCatalogRouterError::Config)?;
    router_with_database_config_api_key_trusted_subject_app_session_and_optional_provider_secret_map_config_and_startup_install_mode(
        config,
        require_api_key_security_config(api_key_security_config)?,
        require_trusted_subject_config(trusted_subject_config)?,
        require_app_session_config(app_session_config)?,
        require_payment_webhook_config(payment_webhook_config)?,
        provider_secret_map_config,
        deployment_mode_from_env_or_toml(runtime_toml.as_ref())
            .map_err(ProductCatalogRouterError::Config)?,
        startup_install_mode,
        runtime_toml.as_ref(),
    )
    .await
}

fn api_key_hasher_from_config(
    config: &ApiKeySecurityConfig,
) -> Result<ApiKeyHasher, ProductCatalogRouterError> {
    Ok(Arc::new(
        HmacSha256ApiKeySecretHasher::new(config.pepper_secret())
            .map_err(|error| ProductCatalogRouterError::Config(error.to_string()))?,
    ))
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

fn app_model_rankings_router_with_subject_boundary(
    read_store: ModelRankingsRuntimeStore,
    trusted_subject_config: &TrustedSubjectConfig,
    app_session_config: &AppSessionConfig,
) -> Router {
    sdkwork_claw_product::api::app_model_rankings_router_with_read_store(read_store).layer(
        from_fn_with_state(
            AppSubjectBoundaryConfig::new(
                trusted_subject_config.clone(),
                app_session_config.clone(),
            ),
            sdkwork_claw_http::app_request_subject_boundary,
        ),
    )
}

async fn maybe_spawn_sqlite_model_ranking_refresh_worker(
    pool: &SqlitePool,
    config: ModelRankingRefreshWorkerConfig,
    cache_invalidator: Option<ModelRankingsRuntimeStore>,
) -> Result<(), ProductCatalogRouterError> {
    let config = config.normalized();
    if !config.enabled {
        return Ok(());
    }
    if !sqlite_model_ranking_schema_ready(pool)
        .await
        .map_err(|error| ProductCatalogRouterError::Sqlite(SqlCatalogLoadError::Database(error)))?
    {
        tracing::warn!(
            "model ranking refresh worker is enabled but SQLite ranking schema is incomplete"
        );
        return Ok(());
    }
    spawn_model_ranking_refresh_worker(
        Arc::new(SqliteModelRankingRefreshStore::new(pool.clone())),
        config,
        cache_invalidator,
    );
    Ok(())
}

async fn maybe_spawn_postgres_model_ranking_refresh_worker(
    pool: &PgPool,
    config: ModelRankingRefreshWorkerConfig,
    cache_invalidator: Option<ModelRankingsRuntimeStore>,
) -> Result<(), ProductCatalogRouterError> {
    let config = config.normalized();
    if !config.enabled {
        return Ok(());
    }
    if !postgres_model_ranking_schema_ready(pool)
        .await
        .map_err(|error| {
            ProductCatalogRouterError::Postgres(PostgresCatalogLoadError::Database(error))
        })?
    {
        tracing::warn!(
            "model ranking refresh worker is enabled but Postgres ranking schema is incomplete"
        );
        return Ok(());
    }
    spawn_model_ranking_refresh_worker(
        Arc::new(PostgresModelRankingRefreshStore::new(pool.clone())),
        config,
        cache_invalidator,
    );
    Ok(())
}

fn spawn_model_ranking_refresh_worker(
    store: ModelRankingRefreshRuntimeStore,
    config: ModelRankingRefreshWorkerConfig,
    cache_invalidator: Option<ModelRankingsRuntimeStore>,
) -> tokio::task::JoinHandle<()> {
    let worker = ModelRankingRefreshWorker::new(store, config);
    let interval = Duration::from_millis(worker.config().interval_millis);
    tokio::spawn(async move {
        if worker.config().run_on_startup {
            run_model_ranking_refresh_worker_iteration(&worker, cache_invalidator.as_ref()).await;
        }
        loop {
            tokio::time::sleep(interval).await;
            run_model_ranking_refresh_worker_iteration(&worker, cache_invalidator.as_ref()).await;
        }
    })
}

async fn run_model_ranking_refresh_worker_iteration(
    worker: &ModelRankingRefreshWorker,
    cache_invalidator: Option<&ModelRankingsRuntimeStore>,
) -> Option<ModelRankingRefreshOutcome> {
    match worker.run_once().await {
        Ok(outcome) if should_invalidate_model_ranking_cache(&outcome) => {
            if let Some(cache_invalidator) = cache_invalidator {
                cache_invalidator.invalidate_model_rankings_cache(ModelRankingsCacheInvalidation {
                    tenant_id: worker.config().tenant_id,
                    organization_id: worker.config().organization_id,
                    rank_scope: Some(outcome.rank_scope.clone()),
                });
            }
            Some(outcome)
        }
        Ok(outcome) => Some(outcome),
        Err(error) => {
            tracing::warn!(error = %error, "model ranking refresh worker run failed");
            None
        }
    }
}

fn should_invalidate_model_ranking_cache(outcome: &ModelRankingRefreshOutcome) -> bool {
    matches!(
        outcome.run_status,
        ModelRankingRefreshRunStatus::Succeeded | ModelRankingRefreshRunStatus::Empty
    )
}

async fn sqlite_model_ranking_schema_ready(pool: &SqlitePool) -> Result<bool, sqlx::Error> {
    let table_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM sqlite_master
        WHERE type = 'table'
          AND name IN ('ai_model', 'ai_usage_fact', 'ai_model_rank_snapshot', 'ops_job_execution')
        "#,
    )
    .fetch_one(pool)
    .await?;
    let model_column_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM pragma_table_info('ai_model')
        WHERE name IN ('catalog_key', 'vendor_code', 'region_code', 'capability', 'rank_score')
        "#,
    )
    .fetch_one(pool)
    .await?;
    let usage_column_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM pragma_table_info('ai_usage_fact')
        WHERE name IN ('catalog_key', 'request_count', 'total_tokens', 'cost_amount', 'occurred_at')
        "#,
    )
    .fetch_one(pool)
    .await?;
    let snapshot_column_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM pragma_table_info('ai_model_rank_snapshot')
        WHERE name IN ('metadata', 'snapshot_date', 'snapshot_period', 'rank_scope', 'catalog_key', 'rank_no')
        "#,
    )
    .fetch_one(pool)
    .await?;
    let job_column_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM pragma_table_info('ops_job_execution')
        WHERE name IN ('job_name', 'started_at', 'ended_at', 'duration_ms', 'execution_status', 'payload')
        "#,
    )
    .fetch_one(pool)
    .await?;
    Ok(table_count == 4
        && model_column_count == 5
        && usage_column_count == 5
        && snapshot_column_count == 6
        && job_column_count == 6)
}

async fn postgres_model_ranking_schema_ready(pool: &PgPool) -> Result<bool, sqlx::Error> {
    let table_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM information_schema.tables
        WHERE table_schema = current_schema()
          AND table_name IN ('ai_model', 'ai_usage_fact', 'ai_model_rank_snapshot', 'ops_job_execution')
        "#,
    )
    .fetch_one(pool)
    .await?;
    let model_column_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'ai_model'
          AND column_name IN ('catalog_key', 'vendor_code', 'region_code', 'capability', 'rank_score')
        "#,
    )
    .fetch_one(pool)
    .await?;
    let usage_column_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'ai_usage_fact'
          AND column_name IN ('catalog_key', 'request_count', 'total_tokens', 'cost_amount', 'occurred_at')
        "#,
    )
    .fetch_one(pool)
    .await?;
    let snapshot_column_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'ai_model_rank_snapshot'
          AND column_name IN ('metadata', 'snapshot_date', 'snapshot_period', 'rank_scope', 'catalog_key', 'rank_no')
        "#,
    )
    .fetch_one(pool)
    .await?;
    let job_column_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'ops_job_execution'
          AND column_name IN ('job_name', 'started_at', 'ended_at', 'duration_ms', 'execution_status', 'payload')
        "#,
    )
    .fetch_one(pool)
    .await?;
    Ok(table_count == 4
        && model_column_count == 5
        && usage_column_count == 5
        && snapshot_column_count == 6
        && job_column_count == 6)
}

#[cfg(test)]
fn model_ranking_refresh_worker_config_from_env() -> Result<ModelRankingRefreshWorkerConfig, String>
{
    model_ranking_refresh_worker_config_from_env_or_toml(None)
}

fn model_ranking_refresh_worker_config_from_env_or_toml(
    runtime_toml: Option<&RuntimeTomlConfig>,
) -> Result<ModelRankingRefreshWorkerConfig, String> {
    const ENABLED: &str = "SDKWORK_CLAW_MODEL_RANKING_REFRESH_WORKER_ENABLED";
    const TENANT_ID: &str = "SDKWORK_CLAW_MODEL_RANKING_TENANT_ID";
    const ORGANIZATION_ID: &str = "SDKWORK_CLAW_MODEL_RANKING_ORGANIZATION_ID";
    const RANK_SCOPE: &str = "SDKWORK_CLAW_MODEL_RANKING_RANK_SCOPE";
    const SNAPSHOT_PERIOD: &str = "SDKWORK_CLAW_MODEL_RANKING_SNAPSHOT_PERIOD";
    const LIMIT: &str = "SDKWORK_CLAW_MODEL_RANKING_LIMIT";
    const LOOKBACK_DAYS: &str = "SDKWORK_CLAW_MODEL_RANKING_LOOKBACK_DAYS";
    const INTERVAL_MILLIS: &str = "SDKWORK_CLAW_MODEL_RANKING_INTERVAL_MILLIS";
    const CACHE_MAX_AGE_SECONDS: &str = "SDKWORK_CLAW_MODEL_RANKING_CACHE_MAX_AGE_SECONDS";
    const RUN_TIMEOUT_MILLIS: &str = "SDKWORK_CLAW_MODEL_RANKING_RUN_TIMEOUT_MILLIS";
    const MAX_RETRY_ATTEMPTS: &str = "SDKWORK_CLAW_MODEL_RANKING_MAX_RETRY_ATTEMPTS";
    const RETRY_BACKOFF_MILLIS: &str = "SDKWORK_CLAW_MODEL_RANKING_RETRY_BACKOFF_MILLIS";
    const RUN_ON_STARTUP: &str = "SDKWORK_CLAW_MODEL_RANKING_RUN_ON_STARTUP";
    const ALERT_AFTER_CONSECUTIVE_FAILURES: &str =
        "SDKWORK_CLAW_MODEL_RANKING_ALERT_AFTER_CONSECUTIVE_FAILURES";

    let defaults = ModelRankingRefreshWorkerConfig::default();
    Ok(ModelRankingRefreshWorkerConfig {
        enabled: parse_optional_bool_config(
            ENABLED,
            runtime_toml.and_then(|config| config.model_ranking.enabled),
        )?
        .unwrap_or(defaults.enabled),
        tenant_id: parse_non_negative_i64_config(
            TENANT_ID,
            runtime_toml.and_then(|config| config.model_ranking.tenant_id),
            defaults.tenant_id,
        )?,
        organization_id: parse_non_negative_i64_config(
            ORGANIZATION_ID,
            runtime_toml.and_then(|config| config.model_ranking.organization_id),
            defaults.organization_id,
        )?,
        rank_scope: parse_non_empty_string_config(
            RANK_SCOPE,
            runtime_toml.and_then(|config| config.model_ranking.rank_scope.as_deref()),
            defaults.rank_scope,
        )?,
        snapshot_period: parse_non_empty_string_config(
            SNAPSHOT_PERIOD,
            runtime_toml.and_then(|config| config.model_ranking.snapshot_period.as_deref()),
            defaults.snapshot_period,
        )?,
        limit: parse_positive_i64_config(
            LIMIT,
            runtime_toml.and_then(|config| config.model_ranking.limit),
            defaults.limit,
        )?,
        lookback_days: parse_positive_i64_config(
            LOOKBACK_DAYS,
            runtime_toml.and_then(|config| config.model_ranking.lookback_days),
            defaults.lookback_days,
        )?,
        interval_millis: parse_positive_u64_config(
            INTERVAL_MILLIS,
            runtime_toml.and_then(|config| config.model_ranking.interval_millis),
            defaults.interval_millis,
        )?,
        cache_max_age_seconds: parse_positive_i64_config(
            CACHE_MAX_AGE_SECONDS,
            runtime_toml.and_then(|config| config.model_ranking.cache_max_age_seconds),
            defaults.cache_max_age_seconds,
        )?,
        run_timeout_millis: parse_positive_u64_config(
            RUN_TIMEOUT_MILLIS,
            runtime_toml.and_then(|config| config.model_ranking.run_timeout_millis),
            defaults.run_timeout_millis,
        )?,
        max_retry_attempts: parse_non_negative_u32_config(
            MAX_RETRY_ATTEMPTS,
            runtime_toml.and_then(|config| config.model_ranking.max_retry_attempts),
            defaults.max_retry_attempts,
        )?,
        retry_backoff_millis: parse_positive_u64_config(
            RETRY_BACKOFF_MILLIS,
            runtime_toml.and_then(|config| config.model_ranking.retry_backoff_millis),
            defaults.retry_backoff_millis,
        )?,
        run_on_startup: parse_optional_bool_config(
            RUN_ON_STARTUP,
            runtime_toml.and_then(|config| config.model_ranking.run_on_startup),
        )?
        .unwrap_or(defaults.run_on_startup),
        alert_after_consecutive_failures: parse_positive_i64_config(
            ALERT_AFTER_CONSECUTIVE_FAILURES,
            runtime_toml.and_then(|config| config.model_ranking.alert_after_consecutive_failures),
            defaults.alert_after_consecutive_failures,
        )?,
        trigger_type: defaults.trigger_type,
    })
}

fn parse_optional_bool_config(
    name: &str,
    config_value: Option<bool>,
) -> Result<Option<bool>, String> {
    sdkwork_claw_config::runtime::config_bool(name, config_value)
}

fn parse_non_negative_i64_config(
    name: &str,
    config_value: Option<i64>,
    default: i64,
) -> Result<i64, String> {
    let parsed = sdkwork_claw_config::runtime::config_i64(name, config_value)?.unwrap_or(default);
    if parsed < 0 {
        return Err(format!("{name} must be a non-negative integer"));
    }
    Ok(parsed)
}

fn parse_positive_i64_config(
    name: &str,
    config_value: Option<i64>,
    default: i64,
) -> Result<i64, String> {
    let parsed = sdkwork_claw_config::runtime::config_i64(name, config_value)?.unwrap_or(default);
    if parsed <= 0 {
        return Err(format!("{name} must be a positive integer"));
    }
    Ok(parsed)
}

fn parse_positive_u64_config(
    name: &str,
    config_value: Option<u64>,
    default: u64,
) -> Result<u64, String> {
    let parsed = sdkwork_claw_config::runtime::config_u64(name, config_value)?.unwrap_or(default);
    if parsed == 0 {
        return Err(format!("{name} must be a positive integer"));
    }
    Ok(parsed)
}

fn parse_non_negative_u32_config(
    name: &str,
    config_value: Option<u32>,
    default: u32,
) -> Result<u32, String> {
    Ok(sdkwork_claw_config::runtime::config_u32(name, config_value)?.unwrap_or(default))
}

fn parse_non_empty_string_config(
    name: &str,
    config_value: Option<&str>,
    default: String,
) -> Result<String, String> {
    let Some(value) = sdkwork_claw_config::runtime::config_value(name, config_value) else {
        return Ok(default);
    };
    let trimmed = value.trim();
    if trimmed.is_empty() {
        return Err(format!("{name} must not be empty"));
    }
    Ok(trimmed.to_owned())
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

fn require_payment_webhook_config(
    config: Option<PaymentWebhookConfig>,
) -> Result<PaymentWebhookConfig, ProductCatalogRouterError> {
    config.ok_or_else(|| {
        ProductCatalogRouterError::Config(format!(
            "{} is required when SDKWORK_CLAW_DATABASE_URL is configured",
            PaymentWebhookConfig::ENV_PAYMENT_WEBHOOK_SECRET
        ))
    })
}

fn require_database_config(
    config: Option<DatabaseConfig>,
    runtime_toml: Option<&RuntimeTomlConfig>,
) -> Result<DatabaseConfig, ProductCatalogRouterError> {
    config.ok_or_else(|| {
        let profile = RuntimeConfigProfile::from_env_or_runtime_toml(runtime_toml)
            .unwrap_or(RuntimeConfigProfile::Server);
        let help_text = DatabaseConfig::startup_help_text(profile);
        ProductCatalogRouterError::Config(
            format!(
                "SDKWORK_CLAW_DATABASE_URL is required for sdkwork-claw-app-api startup so install checks can run.\n{help_text}"
            ),
        )
    })
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

#[derive(Debug)]
pub enum ProductCatalogRouterError {
    Config(String),
    Installer(DatabaseInstallError),
    Sqlite(SqlCatalogLoadError),
    Postgres(PostgresCatalogLoadError),
}

impl std::fmt::Display for ProductCatalogRouterError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Config(error) => write!(formatter, "{error}"),
            Self::Installer(error) => write!(formatter, "{error}"),
            Self::Sqlite(error) => write!(formatter, "{error}"),
            Self::Postgres(error) => write!(formatter, "{error}"),
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
    use super::{
        model_ranking_refresh_worker_config_from_env, router_from_env,
        should_invalidate_model_ranking_cache, sqlite_model_ranking_schema_ready,
    };
    use sdkwork_claw_product::ports::{ModelRankingRefreshOutcome, ModelRankingRefreshRunStatus};
    use sqlx::sqlite::SqlitePoolOptions;
    use std::sync::{Mutex, OnceLock};
    use std::time::{SystemTime, UNIX_EPOCH};

    #[tokio::test]
    async fn sqlite_model_ranking_schema_ready_requires_ops_job_execution_for_audit_history() {
        let pool = SqlitePoolOptions::new()
            .max_connections(1)
            .connect("sqlite::memory:")
            .await
            .unwrap();
        create_minimal_ranking_tables_without_job_audit(&pool).await;

        assert!(
            !sqlite_model_ranking_schema_ready(&pool).await.unwrap(),
            "ranking refresh worker must not start when ops_job_execution audit history is unavailable"
        );
    }

    #[test]
    fn model_ranking_refresh_worker_config_from_env_parses_runtime_policy() {
        let _guard = env_guard().lock().unwrap();
        let names = [
            "SDKWORK_CLAW_MODEL_RANKING_REFRESH_WORKER_ENABLED",
            "SDKWORK_CLAW_MODEL_RANKING_TENANT_ID",
            "SDKWORK_CLAW_MODEL_RANKING_ORGANIZATION_ID",
            "SDKWORK_CLAW_MODEL_RANKING_RANK_SCOPE",
            "SDKWORK_CLAW_MODEL_RANKING_SNAPSHOT_PERIOD",
            "SDKWORK_CLAW_MODEL_RANKING_LIMIT",
            "SDKWORK_CLAW_MODEL_RANKING_LOOKBACK_DAYS",
            "SDKWORK_CLAW_MODEL_RANKING_INTERVAL_MILLIS",
            "SDKWORK_CLAW_MODEL_RANKING_CACHE_MAX_AGE_SECONDS",
            "SDKWORK_CLAW_MODEL_RANKING_RUN_TIMEOUT_MILLIS",
            "SDKWORK_CLAW_MODEL_RANKING_MAX_RETRY_ATTEMPTS",
            "SDKWORK_CLAW_MODEL_RANKING_RETRY_BACKOFF_MILLIS",
            "SDKWORK_CLAW_MODEL_RANKING_RUN_ON_STARTUP",
            "SDKWORK_CLAW_MODEL_RANKING_ALERT_AFTER_CONSECUTIVE_FAILURES",
        ];
        for name in names {
            std::env::remove_var(name);
        }
        std::env::set_var("SDKWORK_CLAW_MODEL_RANKING_RUN_TIMEOUT_MILLIS", "120000");
        std::env::set_var("SDKWORK_CLAW_MODEL_RANKING_MAX_RETRY_ATTEMPTS", "4");
        std::env::set_var("SDKWORK_CLAW_MODEL_RANKING_RETRY_BACKOFF_MILLIS", "250");
        std::env::set_var("SDKWORK_CLAW_MODEL_RANKING_RUN_ON_STARTUP", "false");
        std::env::set_var(
            "SDKWORK_CLAW_MODEL_RANKING_ALERT_AFTER_CONSECUTIVE_FAILURES",
            "7",
        );

        let config = model_ranking_refresh_worker_config_from_env()
            .unwrap()
            .normalized();

        assert_eq!(120_000, config.run_timeout_millis);
        assert_eq!(4, config.max_retry_attempts);
        assert_eq!(250, config.retry_backoff_millis);
        assert!(!config.run_on_startup);
        assert_eq!(7, config.alert_after_consecutive_failures);
        for name in names {
            std::env::remove_var(name);
        }
    }

    #[tokio::test(flavor = "current_thread")]
    async fn router_from_env_initializes_zero_config_server_sqlite() {
        let _guard = env_guard().lock().unwrap();
        let saved_database_url = std::env::var("SDKWORK_CLAW_DATABASE_URL").ok();
        let saved_deployment_mode = std::env::var("SDKWORK_CLAW_DEPLOYMENT_MODE").ok();
        let saved_config_file = std::env::var("SDKWORK_CLAW_CONFIG_FILE").ok();
        let saved_api_key_pepper = std::env::var("SDKWORK_CLAW_API_KEY_PEPPER").ok();
        let saved_trusted_subject_secret =
            std::env::var("SDKWORK_CLAW_TRUSTED_SUBJECT_SECRET").ok();
        let saved_app_session_secret = std::env::var("SDKWORK_CLAW_APP_SESSION_SECRET").ok();
        let saved_payment_webhook_secret =
            std::env::var("SDKWORK_CLAW_PAYMENT_WEBHOOK_SECRET").ok();
        let config_path = unique_runtime_config_path();
        std::env::remove_var("SDKWORK_CLAW_DATABASE_URL");
        std::env::set_var("SDKWORK_CLAW_DEPLOYMENT_MODE", "server");
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
        std::env::set_var(
            "SDKWORK_CLAW_PAYMENT_WEBHOOK_SECRET",
            "payment-webhook-secret-0123456789abcdef",
        );

        let router = router_from_env()
            .await
            .expect("app-api startup should initialize local SQLite by default");

        if let Some(value) = saved_database_url {
            std::env::set_var("SDKWORK_CLAW_DATABASE_URL", value);
        }
        if let Some(value) = saved_deployment_mode {
            std::env::set_var("SDKWORK_CLAW_DEPLOYMENT_MODE", value);
        } else {
            std::env::remove_var("SDKWORK_CLAW_DEPLOYMENT_MODE");
        }
        if let Some(value) = saved_config_file {
            std::env::set_var("SDKWORK_CLAW_CONFIG_FILE", value);
        } else {
            std::env::remove_var("SDKWORK_CLAW_CONFIG_FILE");
        }
        restore_env_var("SDKWORK_CLAW_API_KEY_PEPPER", saved_api_key_pepper);
        restore_env_var(
            "SDKWORK_CLAW_TRUSTED_SUBJECT_SECRET",
            saved_trusted_subject_secret,
        );
        restore_env_var("SDKWORK_CLAW_APP_SESSION_SECRET", saved_app_session_secret);
        restore_env_var(
            "SDKWORK_CLAW_PAYMENT_WEBHOOK_SECRET",
            saved_payment_webhook_secret,
        );
        drop(router);
        assert!(config_path.exists());
        let generated_config = std::fs::read_to_string(config_path).unwrap();
        assert!(generated_config.contains("engine = \"sqlite\""));
        assert!(generated_config.contains("deployment_mode = \"server\""));
        assert!(generated_config.contains("sdkwork-claw-router.sqlite"));
    }

    #[test]
    fn model_ranking_refresh_cache_invalidation_only_runs_after_materialized_refresh() {
        assert!(should_invalidate_model_ranking_cache(
            &ModelRankingRefreshOutcome {
                run_status: ModelRankingRefreshRunStatus::Succeeded,
                ..ModelRankingRefreshOutcome::default()
            }
        ));
        assert!(should_invalidate_model_ranking_cache(
            &ModelRankingRefreshOutcome {
                run_status: ModelRankingRefreshRunStatus::Empty,
                ..ModelRankingRefreshOutcome::default()
            }
        ));
        assert!(!should_invalidate_model_ranking_cache(
            &ModelRankingRefreshOutcome {
                run_status: ModelRankingRefreshRunStatus::Skipped,
                ..ModelRankingRefreshOutcome::default()
            }
        ));
        assert!(!should_invalidate_model_ranking_cache(
            &ModelRankingRefreshOutcome {
                run_status: ModelRankingRefreshRunStatus::Failed,
                ..ModelRankingRefreshOutcome::default()
            }
        ));
    }

    async fn create_minimal_ranking_tables_without_job_audit(pool: &sqlx::SqlitePool) {
        sqlx::query(
            r#"
            CREATE TABLE ai_model (
                catalog_key TEXT,
                vendor_code TEXT,
                region_code TEXT,
                capability INTEGER,
                rank_score REAL
            )
            "#,
        )
        .execute(pool)
        .await
        .unwrap();
        sqlx::query(
            r#"
            CREATE TABLE ai_usage_fact (
                catalog_key TEXT,
                request_count INTEGER,
                total_tokens INTEGER,
                cost_amount REAL,
                occurred_at TEXT
            )
            "#,
        )
        .execute(pool)
        .await
        .unwrap();
        sqlx::query(
            r#"
            CREATE TABLE ai_model_rank_snapshot (
                metadata TEXT,
                snapshot_date TEXT,
                snapshot_period INTEGER,
                rank_scope TEXT,
                catalog_key TEXT,
                rank_no INTEGER
            )
            "#,
        )
        .execute(pool)
        .await
        .unwrap();
    }

    fn env_guard() -> &'static Mutex<()> {
        static ENV_GUARD: OnceLock<Mutex<()>> = OnceLock::new();
        ENV_GUARD.get_or_init(|| Mutex::new(()))
    }

    fn unique_runtime_config_path() -> std::path::PathBuf {
        let millis = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis();
        let mut path = std::env::temp_dir();
        path.push(format!("sdkwork-claw-app-api-runtime-{millis}"));
        path.push("sdkwork-claw-router.toml");
        path
    }

    fn restore_env_var(name: &str, value: Option<String>) {
        if let Some(value) = value {
            std::env::set_var(name, value);
        } else {
            std::env::remove_var(name);
        }
    }
}
