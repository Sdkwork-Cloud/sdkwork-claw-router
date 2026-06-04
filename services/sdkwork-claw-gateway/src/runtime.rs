use std::sync::Arc;

use axum::Router;
use sdkwork_claw_config::{
    ApiKeySecurityConfig, AppSessionConfig, DatabaseConfig, DatabaseEngine, DeploymentMode,
    PaymentWebhookConfig, ProviderAdapterConfig, ProviderAdapterManifestDiscoveryConfig,
    ProviderRelayConfig, ProviderSecretMapConfig, RequestLimitsConfig, RuntimeConfigProfile,
    RuntimeTomlConfig, StartupInstallMode, TrustedSubjectConfig,
};
use sdkwork_claw_product::api::{
    OpenAiInvocationPluginRef, OpenAiRuntimeFailureStrategy, OpenAiRuntimeRouteConfig,
};
use sdkwork_claw_product::application::{
    ApiKeySecretCodec, ApiKeySecretHasher, RuntimeCacheManager, RuntimeStreamBus,
    UsageSettlementWorker, UsageSettlementWorkerConfig,
};
use sdkwork_claw_product::domain::{
    ProviderRetryPolicy, DEFAULT_PROVIDER_CIRCUIT_BREAKER_RECOVERY_WINDOW_SECONDS,
    DEFAULT_PROVIDER_RETRY_ATTEMPTS, DEFAULT_RETRYABLE_PROVIDER_STATUS_CODES,
};
use sdkwork_claw_product::infrastructure::crypto::{
    HmacSha256ApiKeySecretHasher, RingAeadApiKeySecretCodec,
};
use sdkwork_claw_product::infrastructure::provider::{
    AdapterAwareChatCompletionRelay, AdapterAwareChatCompletionStreamRelay,
    AdapterAwareEmbeddingsRelay, AdapterAwareResponsesRelay, OpenAiCompatibleChatCompletionRelay,
    OpenAiCompatibleChatCompletionStreamRelay, OpenAiCompatibleEmbeddingsRelay,
    OpenAiCompatibleResponsesRelay, RefreshableProviderSecretMapResolver,
    SecretRefOpenAiCompatibleChatCompletionRelay,
    SecretRefOpenAiCompatibleChatCompletionStreamRelay, SecretRefOpenAiCompatibleEmbeddingsRelay,
    SecretRefOpenAiCompatibleResponsesRelay, UpstreamProviderEndpoint,
    DEFAULT_PROVIDER_RESPONSE_TIMEOUT_MILLIS,
};
use sdkwork_claw_product::infrastructure::sql::catalog::{
    RefreshableSqlPricingCatalog, SqlPricingCatalogSnapshotSummary,
};
use sdkwork_claw_product::infrastructure::sql::installer::{
    log_bootstrap_admin_report, DatabaseInstallError, DatabaseInstaller,
};
use sdkwork_claw_product::infrastructure::sql::postgres::{
    PostgresCatalogLoadError, PostgresGatewayUsageRecorder,
    PostgresOpenAiInvocationTelemetryPlugin, PostgresPricingCatalogLoader,
    PostgresUsageSettlementStore,
};
use sdkwork_claw_product::infrastructure::sql::sqlite::{
    SqlCatalogLoadError, SqliteGatewayUsageRecorder, SqliteOpenAiInvocationTelemetryPlugin,
    SqlitePricingCatalogLoader, SqliteUsageSettlementStore,
};
use sdkwork_claw_product::ports::{
    ChatCompletionRelay, ChatCompletionStreamRelay, EmbeddingsRelay, GatewayRequestTraceCommand,
    GatewayUsageRecordCommand, GatewayUsageRecordFuture, GatewayUsageRecorder, PricingCatalog,
    ProviderHealthProbe, ProviderSecretResolver, ResponsesRelay, UsageSettlementStore,
};
use sdkwork_claw_provider_adapter_contract::AdapterRouteStatus;
use sdkwork_claw_provider_adapter_http::ProviderAdapterHttpClient;
use sdkwork_claw_provider_adapter_registry::{ProviderAdapterRegistry, ProviderAdapterRouteConfig};
use sqlx::sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePool, SqlitePoolOptions};
use sqlx::PgPool;
use std::str::FromStr;
use tokio::sync::Notify;
use tokio::time::{sleep, Duration};

use crate::edge_server::EdgeInProcessUpstreams;
use crate::route_scoped_openai_passthrough::StickyObjectRouteStore;
use crate::router;
use crate::router_with_database_status_and_passthrough_placeholder;

type ApiKeyHasher = Arc<dyn ApiKeySecretHasher + Send + Sync>;
type ApiKeyCodec = Arc<dyn ApiKeySecretCodec + Send + Sync>;
type ChatRelay = Arc<dyn ChatCompletionRelay + Send + Sync>;
type ChatStreamRelay = Arc<dyn ChatCompletionStreamRelay + Send + Sync>;
type EmbeddingRelay = Arc<dyn EmbeddingsRelay + Send + Sync>;
type ResponseRelay = Arc<dyn ResponsesRelay + Send + Sync>;
type UsageRecorder = Arc<dyn GatewayUsageRecorder + Send + Sync>;
type SettlementStore = Arc<dyn UsageSettlementStore + Send + Sync>;

#[derive(Clone)]
struct NotifyingGatewayUsageRecorder {
    inner: UsageRecorder,
    usage_settlement_wakeup: Arc<Notify>,
}

impl NotifyingGatewayUsageRecorder {
    fn new(inner: UsageRecorder, usage_settlement_wakeup: Arc<Notify>) -> Self {
        Self {
            inner,
            usage_settlement_wakeup,
        }
    }
}

impl GatewayUsageRecorder for NotifyingGatewayUsageRecorder {
    fn record_gateway_trace<'a>(
        &'a self,
        command: GatewayRequestTraceCommand,
    ) -> GatewayUsageRecordFuture<'a> {
        self.inner.record_gateway_trace(command)
    }

    fn record_gateway_usage<'a>(
        &'a self,
        command: GatewayUsageRecordCommand,
    ) -> GatewayUsageRecordFuture<'a> {
        Box::pin(async move {
            self.inner.record_gateway_usage(command).await?;
            self.usage_settlement_wakeup.notify_one();
            Ok(())
        })
    }
}

const DEFAULT_OPENAI_RUNTIME_CATALOG_REFRESH_INTERVAL_MILLIS: u64 = 5_000;
const CATALOG_REFRESH_FALLBACK_TICKS: u64 = 12;
const SQLITE_RUNTIME_MIN_POOL_CONNECTIONS: u32 =
    DatabaseConfig::DESKTOP_SQLITE_DEFAULT_MAX_CONNECTIONS;
const SQLITE_POOL_ACQUIRE_TIMEOUT_SECONDS: u64 = 10;
const SQLITE_BUSY_TIMEOUT_SECONDS: u64 = 30;

fn effective_sqlite_runtime_pool_max_connections(database_url: &str, configured: u32) -> u32 {
    if is_sqlite_in_memory_database_url(database_url) {
        return configured;
    }
    configured.max(SQLITE_RUNTIME_MIN_POOL_CONNECTIONS)
}

fn is_sqlite_in_memory_database_url(database_url: &str) -> bool {
    let lower = database_url.to_ascii_lowercase();
    lower == "sqlite::memory:" || lower.contains(":memory:") || lower.contains("mode=memory")
}

fn build_sqlite_runtime_pool_options(
    database_url: &str,
    configured_max_connections: u32,
) -> SqlitePoolOptions {
    SqlitePoolOptions::new()
        .max_connections(effective_sqlite_runtime_pool_max_connections(
            database_url,
            configured_max_connections,
        ))
        .acquire_timeout(Duration::from_secs(SQLITE_POOL_ACQUIRE_TIMEOUT_SECONDS))
}

fn build_sqlite_runtime_connect_options(
    database_url: &str,
) -> Result<SqliteConnectOptions, GatewayRouterError> {
    SqliteConnectOptions::from_str(database_url)
        .map_err(|error| GatewayRouterError::Sqlite(SqlCatalogLoadError::Database(error)))
        .map(|options| {
            options
                .create_if_missing(true)
                .foreign_keys(true)
                .journal_mode(SqliteJournalMode::Wal)
                .busy_timeout(Duration::from_secs(SQLITE_BUSY_TIMEOUT_SECONDS))
        })
}

async fn connect_sqlite_runtime_pool(
    config: &DatabaseConfig,
) -> Result<SqlitePool, GatewayRouterError> {
    build_sqlite_runtime_pool_options(&config.url, config.max_connections)
        .connect_with(build_sqlite_runtime_connect_options(&config.url)?)
        .await
        .map_err(|error| GatewayRouterError::Sqlite(SqlCatalogLoadError::Database(error)))
}

#[derive(Clone)]
enum SharedDatabasePool {
    Sqlite(SqlitePool),
    Postgres(PgPool),
}

struct AllInOneRuntimeContext {
    database_config: DatabaseConfig,
    database_pool: SharedDatabasePool,
    database_installer: Arc<DatabaseInstaller>,
    catalog: Arc<RefreshableSqlPricingCatalog>,
    api_key_security_config: ApiKeySecurityConfig,
    provider_relay_config: Option<ProviderRelayConfig>,
    provider_adapter_config: Option<ProviderAdapterConfig>,
    provider_runtime: ProviderRelayRuntimeConfig,
    provider_secret_resolver: Option<Arc<RefreshableProviderSecretMapResolver>>,
    prefer_secret_ref_openai_runtime: bool,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
    payment_webhook_config: PaymentWebhookConfig,
    provider_health_probe: Arc<dyn ProviderHealthProbe + Send + Sync>,
    cache_manager: RuntimeCacheManager,
    request_limits_config: RequestLimitsConfig,
    models_catalog_root: Option<String>,
    deployment_mode: DeploymentMode,
    app_runtime_gateway_client:
        Arc<dyn sdkwork_claw_product::ports::AppRuntimeGatewayClient + Send + Sync>,
    app_runtime_stream_bus: Arc<dyn RuntimeStreamBus + Send + Sync>,
    model_ranking_refresh_worker_config:
        sdkwork_claw_product::application::ModelRankingRefreshWorkerConfig,
    usage_settlement_wakeup: Option<Arc<Notify>>,
}

#[derive(Default)]
struct OpenAiRuntimeRelays {
    chat: Option<ChatRelay>,
    chat_stream: Option<ChatStreamRelay>,
    embeddings: Option<EmbeddingRelay>,
    responses: Option<ResponseRelay>,
}

pub fn router_with_product_catalog_and_api_key_hasher<C>(
    catalog: Arc<C>,
    api_key_hasher: ApiKeyHasher,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    router_with_openai_runtime_routes(
        router(),
        catalog,
        api_key_hasher,
        OpenAiRuntimeRelays::default(),
        None,
        Vec::new(),
        OpenAiRuntimeFailureStrategy::default(),
        ProviderRetryPolicy::default(),
        None,
        None,
        None,
        false,
        None,
    )
}

pub fn router_with_product_catalog_api_key_hasher_and_chat_completion_relay<C>(
    catalog: Arc<C>,
    api_key_hasher: ApiKeyHasher,
    chat_relay: ChatRelay,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    router_with_openai_runtime_routes(
        router(),
        catalog,
        api_key_hasher,
        OpenAiRuntimeRelays {
            chat: Some(chat_relay),
            chat_stream: None,
            embeddings: None,
            responses: None,
        },
        None,
        Vec::new(),
        OpenAiRuntimeFailureStrategy::default(),
        ProviderRetryPolicy::default(),
        None,
        None,
        None,
        false,
        None,
    )
}

pub fn router_with_product_catalog_api_key_hasher_and_chat_completion_streaming_relay<C>(
    catalog: Arc<C>,
    api_key_hasher: ApiKeyHasher,
    chat_stream_relay: ChatStreamRelay,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    router_with_openai_runtime_routes(
        router(),
        catalog,
        api_key_hasher,
        OpenAiRuntimeRelays {
            chat: None,
            chat_stream: Some(chat_stream_relay),
            embeddings: None,
            responses: None,
        },
        None,
        Vec::new(),
        OpenAiRuntimeFailureStrategy::default(),
        ProviderRetryPolicy::default(),
        None,
        None,
        None,
        false,
        None,
    )
}

pub fn router_with_product_catalog_api_key_hasher_and_embeddings_relay<C>(
    catalog: Arc<C>,
    api_key_hasher: ApiKeyHasher,
    embeddings_relay: EmbeddingRelay,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    router_with_openai_runtime_routes(
        router(),
        catalog,
        api_key_hasher,
        OpenAiRuntimeRelays {
            chat: None,
            chat_stream: None,
            embeddings: Some(embeddings_relay),
            responses: None,
        },
        None,
        Vec::new(),
        OpenAiRuntimeFailureStrategy::default(),
        ProviderRetryPolicy::default(),
        None,
        None,
        None,
        false,
        None,
    )
}

pub fn router_with_product_catalog_api_key_hasher_and_responses_relay<C>(
    catalog: Arc<C>,
    api_key_hasher: ApiKeyHasher,
    responses_relay: ResponseRelay,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    router_with_openai_runtime_routes(
        router(),
        catalog,
        api_key_hasher,
        OpenAiRuntimeRelays {
            chat: None,
            chat_stream: None,
            embeddings: None,
            responses: Some(responses_relay),
        },
        None,
        Vec::new(),
        OpenAiRuntimeFailureStrategy::default(),
        ProviderRetryPolicy::default(),
        None,
        None,
        None,
        false,
        None,
    )
}

fn router_with_openai_runtime_routes<C>(
    base_router: Router,
    catalog: Arc<C>,
    api_key_hasher: ApiKeyHasher,
    relays: OpenAiRuntimeRelays,
    usage_recorder: Option<UsageRecorder>,
    invocation_plugins: Vec<OpenAiInvocationPluginRef>,
    failure_strategy: OpenAiRuntimeFailureStrategy,
    default_retry_policy: ProviderRetryPolicy,
    provider_passthrough_config: Option<ProviderRelayConfig>,
    provider_adapter_config: Option<ProviderAdapterConfig>,
    provider_secret_resolver: Option<Arc<RefreshableProviderSecretMapResolver>>,
    _prefer_secret_ref_openai_runtime: bool,
    sticky_store: Option<StickyObjectRouteStore>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let has_route_scoped_openai_passthrough = provider_secret_resolver.is_some();
    let base_router = if !has_route_scoped_openai_passthrough {
        match provider_passthrough_config.clone() {
            Some(config) => base_router.merge(
                crate::passthrough::authenticated_stored_chat_completion_passthrough_router(
                    config,
                    Arc::clone(&catalog),
                    Arc::clone(&api_key_hasher),
                ),
            ),
            None => base_router,
        }
    } else {
        base_router
    };
    let chat_router = match (relays.chat, relays.chat_stream) {
        (Some(relay), Some(stream_relay)) => {
            if let Some(usage_recorder) = usage_recorder.clone() {
                sdkwork_claw_product::api::openai_chat_completions_router_with_relays_usage_recorder_plugins_and_runtime_config(
                    Arc::clone(&catalog),
                    Arc::clone(&api_key_hasher),
                    relay,
                    stream_relay,
                    usage_recorder,
                    invocation_plugins.clone(),
                    OpenAiRuntimeRouteConfig::new(default_retry_policy.clone(), failure_strategy),
                )
            } else {
                sdkwork_claw_product::api::openai_chat_completions_router_with_relays_and_failure_strategy(
                    Arc::clone(&catalog),
                    Arc::clone(&api_key_hasher),
                    relay,
                    stream_relay,
                    failure_strategy,
                )
            }
        }
        (Some(relay), None) => {
            if let Some(usage_recorder) = usage_recorder.clone() {
                sdkwork_claw_product::api::openai_chat_completions_router_with_relay_usage_recorder_plugins_and_runtime_config(
                    Arc::clone(&catalog),
                    Arc::clone(&api_key_hasher),
                    relay,
                    usage_recorder,
                    invocation_plugins.clone(),
                    OpenAiRuntimeRouteConfig::new(default_retry_policy.clone(), failure_strategy),
                )
            } else {
                sdkwork_claw_product::api::openai_chat_completions_router_with_relay_plugins_and_failure_strategy(
                    Arc::clone(&catalog),
                    Arc::clone(&api_key_hasher),
                    relay,
                    invocation_plugins.clone(),
                    failure_strategy,
                )
            }
        }
        (None, Some(stream_relay)) => {
            sdkwork_claw_product::api::openai_chat_completions_router_with_streaming_relay_and_failure_strategy(
                Arc::clone(&catalog),
                Arc::clone(&api_key_hasher),
                stream_relay,
                failure_strategy,
            )
        }
        (None, None) => sdkwork_claw_product::api::openai_chat_completions_router(
            Arc::clone(&catalog),
            Arc::clone(&api_key_hasher),
        ),
    };
    let responses_failure_strategy = OpenAiRuntimeFailureStrategy::FailClosed;
    let responses_router = match relays.responses {
        Some(relay) => {
            if let Some(usage_recorder) = usage_recorder.clone() {
                sdkwork_claw_product::api::openai_responses_router_with_relay_usage_recorder_plugins_and_runtime_config(
                    Arc::clone(&catalog),
                    Arc::clone(&api_key_hasher),
                    relay,
                    usage_recorder,
                    invocation_plugins.clone(),
                    OpenAiRuntimeRouteConfig::new(
                        default_retry_policy.clone(),
                        responses_failure_strategy,
                    ),
                )
            } else {
                sdkwork_claw_product::api::openai_responses_router_with_relay_plugins_and_failure_strategy(
                    Arc::clone(&catalog),
                    Arc::clone(&api_key_hasher),
                    relay,
                    invocation_plugins.clone(),
                    responses_failure_strategy,
                )
            }
        }
        None => sdkwork_claw_product::api::openai_responses_router(
            Arc::clone(&catalog),
            Arc::clone(&api_key_hasher),
        ),
    };
    let embeddings_router = match relays.embeddings {
        Some(relay) => {
            if let Some(usage_recorder) = usage_recorder.clone() {
                sdkwork_claw_product::api::openai_embeddings_router_with_relay_usage_recorder_plugins_and_runtime_config(
                    Arc::clone(&catalog),
                    Arc::clone(&api_key_hasher),
                    relay,
                    usage_recorder,
                    invocation_plugins.clone(),
                    OpenAiRuntimeRouteConfig::new(default_retry_policy.clone(), failure_strategy),
                )
            } else {
                sdkwork_claw_product::api::openai_embeddings_router_with_relay_plugins_and_failure_strategy(
                    Arc::clone(&catalog),
                    Arc::clone(&api_key_hasher),
                    relay,
                    invocation_plugins.clone(),
                    failure_strategy,
                )
            }
        }
        None => sdkwork_claw_product::api::openai_embeddings_router(
            Arc::clone(&catalog),
            Arc::clone(&api_key_hasher),
        ),
    };

    let router = base_router
        .merge(sdkwork_claw_product::api::openai_models_router(
            Arc::clone(&catalog),
            Arc::clone(&api_key_hasher),
        ))
        .merge(embeddings_router)
        .merge(responses_router)
        .merge(chat_router);

    let router = if has_route_scoped_openai_passthrough {
        let secret_resolver = provider_secret_resolver
            .clone()
            .expect("route scoped OpenAI passthrough requires a secret resolver");
        router.merge(crate::passthrough::route_scoped_openai_passthrough_router(
            Arc::clone(&catalog),
            Arc::clone(&api_key_hasher),
            secret_resolver,
            usage_recorder.clone(),
            sticky_store,
        ))
    } else {
        router
    };

    match (provider_passthrough_config, has_route_scoped_openai_passthrough) {
        (Some(config), true) => router.merge(
            crate::passthrough::authenticated_provider_native_passthrough_router_with_adapter_config(
                Some(config),
                catalog,
                api_key_hasher,
                provider_adapter_config,
                provider_secret_resolver
                    .map(|resolver| resolver as Arc<dyn ProviderSecretResolver + Send + Sync>),
                usage_recorder.clone(),
            ),
        ),
        (Some(config), false) => router.merge(
            crate::passthrough::authenticated_gateway_passthrough_router_with_adapter_config(
                config,
                catalog,
                api_key_hasher,
                provider_adapter_config,
                usage_recorder.clone(),
            ),
        ),
        (None, true) => router.merge(
            crate::passthrough::authenticated_provider_native_passthrough_router_with_adapter_config(
                None,
                catalog,
                api_key_hasher,
                provider_adapter_config,
                provider_secret_resolver
                    .map(|resolver| resolver as Arc<dyn ProviderSecretResolver + Send + Sync>),
                usage_recorder.clone(),
            ),
        ),
        _ => router,
    }
}

pub async fn router_with_database_and_api_key_config(
    config: DatabaseConfig,
    api_key_config: Option<ApiKeySecurityConfig>,
) -> Result<Router, GatewayRouterError> {
    router_with_database_api_key_and_provider_relay_config(config, api_key_config, None).await
}

pub async fn router_with_database_api_key_and_provider_relay_config(
    config: DatabaseConfig,
    api_key_config: Option<ApiKeySecurityConfig>,
    provider_relay_config: Option<ProviderRelayConfig>,
) -> Result<Router, GatewayRouterError> {
    router_with_database_api_key_and_provider_configs(
        config,
        api_key_config,
        provider_relay_config,
        None,
    )
    .await
}

pub async fn router_with_database_api_key_and_provider_configs(
    config: DatabaseConfig,
    api_key_config: Option<ApiKeySecurityConfig>,
    provider_relay_config: Option<ProviderRelayConfig>,
    provider_secret_map_config: Option<ProviderSecretMapConfig>,
) -> Result<Router, GatewayRouterError> {
    router_with_database_api_key_provider_configs_and_usage_settlement_worker_config(
        config,
        api_key_config,
        provider_relay_config,
        provider_secret_map_config,
        UsageSettlementWorkerConfig::disabled(),
    )
    .await
}

pub async fn router_with_database_api_key_provider_configs_and_adapter_config(
    config: DatabaseConfig,
    api_key_config: Option<ApiKeySecurityConfig>,
    provider_relay_config: Option<ProviderRelayConfig>,
    provider_secret_map_config: Option<ProviderSecretMapConfig>,
    provider_adapter_config: Option<ProviderAdapterConfig>,
) -> Result<Router, GatewayRouterError> {
    router_with_database_api_key_provider_configs_usage_settlement_worker_config_startup_install_mode_and_runtime_toml(
        config,
        api_key_config,
        provider_relay_config,
        provider_secret_map_config,
        UsageSettlementWorkerConfig::disabled(),
        StartupInstallMode::Ensure,
        None,
        provider_adapter_config,
    )
    .await
}

pub async fn router_with_database_api_key_provider_configs_adapter_config_and_startup_install_mode(
    config: DatabaseConfig,
    api_key_config: Option<ApiKeySecurityConfig>,
    provider_relay_config: Option<ProviderRelayConfig>,
    provider_secret_map_config: Option<ProviderSecretMapConfig>,
    provider_adapter_config: Option<ProviderAdapterConfig>,
    startup_install_mode: StartupInstallMode,
) -> Result<Router, GatewayRouterError> {
    router_with_database_api_key_provider_configs_usage_settlement_worker_config_startup_install_mode_and_runtime_toml(
        config,
        api_key_config,
        provider_relay_config,
        provider_secret_map_config,
        UsageSettlementWorkerConfig::disabled(),
        startup_install_mode,
        None,
        provider_adapter_config,
    )
    .await
}

pub async fn router_with_database_api_key_provider_configs_and_usage_settlement_worker_config(
    config: DatabaseConfig,
    api_key_config: Option<ApiKeySecurityConfig>,
    provider_relay_config: Option<ProviderRelayConfig>,
    provider_secret_map_config: Option<ProviderSecretMapConfig>,
    usage_settlement_worker_config: UsageSettlementWorkerConfig,
) -> Result<Router, GatewayRouterError> {
    router_with_database_api_key_provider_configs_usage_settlement_worker_config_and_startup_install_mode(
        config,
        api_key_config,
        provider_relay_config,
        provider_secret_map_config,
        usage_settlement_worker_config,
        StartupInstallMode::Ensure,
    )
    .await
}

pub async fn router_with_database_api_key_provider_configs_usage_settlement_worker_config_and_startup_install_mode(
    config: DatabaseConfig,
    api_key_config: Option<ApiKeySecurityConfig>,
    provider_relay_config: Option<ProviderRelayConfig>,
    provider_secret_map_config: Option<ProviderSecretMapConfig>,
    usage_settlement_worker_config: UsageSettlementWorkerConfig,
    startup_install_mode: StartupInstallMode,
) -> Result<Router, GatewayRouterError> {
    router_with_database_api_key_provider_configs_usage_settlement_worker_config_startup_install_mode_and_runtime_toml(
        config,
        api_key_config,
        provider_relay_config,
        provider_secret_map_config,
        usage_settlement_worker_config,
        startup_install_mode,
        None,
        None,
    )
    .await
}

async fn router_with_database_api_key_provider_configs_usage_settlement_worker_config_startup_install_mode_and_runtime_toml(
    config: DatabaseConfig,
    api_key_config: Option<ApiKeySecurityConfig>,
    provider_relay_config: Option<ProviderRelayConfig>,
    provider_secret_map_config: Option<ProviderSecretMapConfig>,
    usage_settlement_worker_config: UsageSettlementWorkerConfig,
    startup_install_mode: StartupInstallMode,
    runtime_toml: Option<&RuntimeTomlConfig>,
    provider_adapter_config_override: Option<ProviderAdapterConfig>,
) -> Result<Router, GatewayRouterError> {
    let api_key_security_config = require_api_key_security_config(api_key_config)?;
    let api_key_hasher = build_api_key_hasher(&api_key_security_config)?;
    let api_key_secret_codec = api_key_secret_codec_from_config(&api_key_security_config)?;
    let provider_passthrough_config = provider_relay_config.clone();
    let provider_runtime = provider_relay_runtime_config_from_env_or_toml(runtime_toml)
        .map_err(GatewayRouterError::Config)?;
    let provider_adapter_config = match provider_adapter_config_override {
        Some(config) if !config.routes().is_empty() => Some(config),
        Some(_) => None,
        None => provider_adapter_config_from_env_or_runtime_toml(runtime_toml)
            .await
            .map_err(GatewayRouterError::Config)?,
    };
    match config.engine {
        DatabaseEngine::Sqlite => {
            let pool = connect_sqlite_runtime_pool(&config).await?;
            if startup_install_mode.should_ensure() {
                let install_report = DatabaseInstaller::for_sqlite(pool.clone())
                    .with_env_options()?
                    .ensure_installed()
                    .await?;
                log_bootstrap_admin_report("sdkwork-claw-gateway", &install_report);
            }
            let snapshot = SqlitePricingCatalogLoader::with_api_key_secret_codec(
                pool.clone(),
                api_key_secret_codec.clone(),
            )
            .with_circuit_breaker_recovery_window_seconds(
                provider_runtime.circuit_breaker_recovery_window_seconds,
            )
            .load_snapshot()
            .await?;
            log_gateway_runtime_catalog_snapshot_summary("sqlite", "startup", snapshot.summary());
            let provider_secret_resolver = openai_runtime_relay_secret_resolver(
                provider_secret_map_config.clone(),
                snapshot.managed_provider_secrets(),
            );
            let prefer_secret_ref_openai_runtime = provider_secret_resolver.is_some();
            let relays = apply_provider_adapter_config(
                build_openai_runtime_relays(
                    provider_relay_config.clone(),
                    provider_secret_resolver.clone(),
                    provider_runtime.clone(),
                    prefer_secret_ref_openai_runtime,
                )?,
                provider_adapter_config.clone(),
                provider_secret_resolver.clone().map(|resolver| {
                    let resolver: Arc<dyn ProviderSecretResolver + Send + Sync> = resolver;
                    resolver
                }),
            )?;
            let catalog = Arc::new(RefreshableSqlPricingCatalog::new(snapshot));
            let usage_settlement_wakeup =
                maybe_spawn_sqlite_usage_settlement_worker(&pool, usage_settlement_worker_config)
                    .await?;
            let usage_recorder = wrap_usage_recorder_with_settlement_wakeup(
                Arc::new(SqliteGatewayUsageRecorder::new(pool.clone())),
                usage_settlement_wakeup,
            );
            let invocation_plugins =
                vec![
                    Arc::new(SqliteOpenAiInvocationTelemetryPlugin::new(pool.clone()))
                        as OpenAiInvocationPluginRef,
                ];
            spawn_sqlite_catalog_refresh_worker(
                &pool,
                Arc::clone(&catalog),
                provider_secret_resolver.clone(),
                api_key_secret_codec.clone(),
                provider_runtime.catalog_refresh_interval,
                provider_runtime.circuit_breaker_recovery_window_seconds,
            );
            Ok(router_with_openai_runtime_routes(
                router_with_database_status_and_passthrough_placeholder(
                    Some(&config),
                    provider_passthrough_config.is_none() && provider_secret_resolver.is_none(),
                ),
                catalog,
                api_key_hasher,
                relays,
                Some(usage_recorder),
                invocation_plugins,
                provider_runtime.failure_strategy,
                provider_runtime.default_retry_policy.clone(),
                provider_passthrough_config,
                provider_adapter_config.clone(),
                provider_secret_resolver.clone(),
                prefer_secret_ref_openai_runtime,
                Some(StickyObjectRouteStore::sqlite(pool.clone())),
            ))
        }
        DatabaseEngine::Postgres => {
            let pool = sqlx::postgres::PgPoolOptions::new()
                .max_connections(config.max_connections)
                .connect(&config.url)
                .await
                .map_err(|error| {
                    GatewayRouterError::Postgres(PostgresCatalogLoadError::Database(error))
                })?;
            if startup_install_mode.should_ensure() {
                let install_report = DatabaseInstaller::for_postgres(pool.clone())
                    .with_env_options()?
                    .ensure_installed()
                    .await?;
                log_bootstrap_admin_report("sdkwork-claw-gateway", &install_report);
            }
            let snapshot = PostgresPricingCatalogLoader::with_api_key_secret_codec(
                pool.clone(),
                api_key_secret_codec.clone(),
            )
            .with_circuit_breaker_recovery_window_seconds(
                provider_runtime.circuit_breaker_recovery_window_seconds,
            )
            .load_snapshot()
            .await?;
            log_gateway_runtime_catalog_snapshot_summary("postgres", "startup", snapshot.summary());
            let provider_secret_resolver = openai_runtime_relay_secret_resolver(
                provider_secret_map_config.clone(),
                snapshot.managed_provider_secrets(),
            );
            let prefer_secret_ref_openai_runtime = provider_secret_resolver.is_some();
            let relays = apply_provider_adapter_config(
                build_openai_runtime_relays(
                    provider_relay_config.clone(),
                    provider_secret_resolver.clone(),
                    provider_runtime.clone(),
                    prefer_secret_ref_openai_runtime,
                )?,
                provider_adapter_config.clone(),
                provider_secret_resolver.clone().map(|resolver| {
                    let resolver: Arc<dyn ProviderSecretResolver + Send + Sync> = resolver;
                    resolver
                }),
            )?;
            let catalog = Arc::new(RefreshableSqlPricingCatalog::new(snapshot));
            let usage_settlement_wakeup =
                maybe_spawn_postgres_usage_settlement_worker(&pool, usage_settlement_worker_config)
                    .await?;
            let usage_recorder = wrap_usage_recorder_with_settlement_wakeup(
                Arc::new(PostgresGatewayUsageRecorder::new(pool.clone())),
                usage_settlement_wakeup,
            );
            let invocation_plugins =
                vec![
                    Arc::new(PostgresOpenAiInvocationTelemetryPlugin::new(pool.clone()))
                        as OpenAiInvocationPluginRef,
                ];
            spawn_postgres_catalog_refresh_worker(
                &pool,
                Arc::clone(&catalog),
                provider_secret_resolver.clone(),
                api_key_secret_codec.clone(),
                provider_runtime.catalog_refresh_interval,
                provider_runtime.circuit_breaker_recovery_window_seconds,
            );
            Ok(router_with_openai_runtime_routes(
                router_with_database_status_and_passthrough_placeholder(
                    Some(&config),
                    provider_passthrough_config.is_none() && provider_secret_resolver.is_none(),
                ),
                catalog,
                api_key_hasher,
                relays,
                Some(usage_recorder),
                invocation_plugins,
                provider_runtime.failure_strategy,
                provider_runtime.default_retry_policy.clone(),
                provider_passthrough_config,
                provider_adapter_config.clone(),
                provider_secret_resolver.clone(),
                prefer_secret_ref_openai_runtime,
                Some(StickyObjectRouteStore::postgres(pool.clone())),
            ))
        }
    }
}

pub async fn router_with_optional_database_config(
    config: Option<DatabaseConfig>,
    api_key_config: Option<ApiKeySecurityConfig>,
) -> Result<Router, GatewayRouterError> {
    router_with_optional_database_api_key_and_provider_relay_config(config, api_key_config, None)
        .await
}

pub async fn router_with_optional_database_api_key_and_provider_relay_config(
    config: Option<DatabaseConfig>,
    api_key_config: Option<ApiKeySecurityConfig>,
    provider_relay_config: Option<ProviderRelayConfig>,
) -> Result<Router, GatewayRouterError> {
    router_with_optional_database_api_key_and_provider_configs(
        config,
        api_key_config,
        provider_relay_config,
        None,
    )
    .await
}

pub async fn router_with_optional_database_api_key_and_provider_configs(
    config: Option<DatabaseConfig>,
    api_key_config: Option<ApiKeySecurityConfig>,
    provider_relay_config: Option<ProviderRelayConfig>,
    provider_secret_map_config: Option<ProviderSecretMapConfig>,
) -> Result<Router, GatewayRouterError> {
    match config {
        Some(config) => {
            router_with_database_api_key_and_provider_configs(
                config,
                api_key_config,
                provider_relay_config,
                provider_secret_map_config,
            )
            .await
        }
        None => Ok(router()),
    }
}

pub async fn router_from_env() -> Result<Router, GatewayRouterError> {
    let runtime_toml =
        RuntimeTomlConfig::from_env_config_file().map_err(GatewayRouterError::Config)?;
    let config = database_config_from_env_for_startup(runtime_toml.as_ref())?;
    let api_key_config = ApiKeySecurityConfig::from_env_or_runtime_toml(runtime_toml.as_ref())
        .map_err(GatewayRouterError::Config)?;
    let provider_relay_config =
        ProviderRelayConfig::from_env_or_runtime_toml(runtime_toml.as_ref())
            .map_err(GatewayRouterError::Config)?;
    let provider_secret_map_config =
        ProviderSecretMapConfig::from_env_or_runtime_toml(runtime_toml.as_ref())
            .map_err(GatewayRouterError::Config)?;
    let usage_settlement_worker_config =
        usage_settlement_worker_config_from_env_or_toml(runtime_toml.as_ref())
            .map_err(GatewayRouterError::Config)?;
    let startup_install_mode = StartupInstallMode::from_env_or_runtime_toml(runtime_toml.as_ref())
        .map_err(GatewayRouterError::Config)?;
    match config {
        Some(config) => {
            router_with_database_api_key_provider_configs_usage_settlement_worker_config_startup_install_mode_and_runtime_toml(
                config,
                api_key_config,
                provider_relay_config,
                provider_secret_map_config,
                usage_settlement_worker_config,
                startup_install_mode,
                runtime_toml.as_ref(),
                None,
            )
            .await
        }
        None => Ok(router()),
    }
}

pub async fn all_in_one_in_process_upstreams_from_env() -> anyhow::Result<EdgeInProcessUpstreams> {
    let context = all_in_one_runtime_context_from_env().await?;
    let gateway_router = build_gateway_router_from_all_in_one_context(&context)?;
    let (backend_router, app_router) = match &context.database_pool {
        SharedDatabasePool::Sqlite(pool) => (
            sdkwork_claw_admin_api::router_with_sqlite_shared_runtime(
                context.database_config.clone(),
                pool.clone(),
                Arc::clone(&context.catalog),
                context.api_key_security_config.clone(),
                context.trusted_subject_config.clone(),
                context.app_session_config.clone(),
                Arc::clone(&context.provider_health_probe),
                context.cache_manager.clone(),
                Arc::clone(&context.database_installer),
                context.request_limits_config.clone(),
                context.models_catalog_root.clone(),
            )
            .map_err(anyhow::Error::new)?,
            sdkwork_claw_app_api::router_with_sqlite_shared_runtime(
                context.database_config.clone(),
                pool.clone(),
                Arc::clone(&context.catalog),
                context.api_key_security_config.clone(),
                context.trusted_subject_config.clone(),
                context.app_session_config.clone(),
                context.payment_webhook_config.clone(),
                Arc::clone(&context.provider_health_probe),
                context.deployment_mode,
                context.request_limits_config.clone(),
                Arc::clone(&context.app_runtime_gateway_client),
                Arc::clone(&context.app_runtime_stream_bus),
                context.model_ranking_refresh_worker_config.clone(),
            )
            .await
            .map_err(anyhow::Error::new)?,
        ),
        SharedDatabasePool::Postgres(pool) => (
            sdkwork_claw_admin_api::router_with_postgres_shared_runtime(
                context.database_config.clone(),
                pool.clone(),
                Arc::clone(&context.catalog),
                context.api_key_security_config.clone(),
                context.trusted_subject_config.clone(),
                context.app_session_config.clone(),
                Arc::clone(&context.provider_health_probe),
                context.cache_manager.clone(),
                Arc::clone(&context.database_installer),
                context.request_limits_config.clone(),
                context.models_catalog_root.clone(),
            )
            .map_err(anyhow::Error::new)?,
            sdkwork_claw_app_api::router_with_postgres_shared_runtime(
                context.database_config.clone(),
                pool.clone(),
                Arc::clone(&context.catalog),
                context.api_key_security_config.clone(),
                context.trusted_subject_config.clone(),
                context.app_session_config.clone(),
                context.payment_webhook_config.clone(),
                Arc::clone(&context.provider_health_probe),
                context.deployment_mode,
                context.request_limits_config.clone(),
                Arc::clone(&context.app_runtime_gateway_client),
                Arc::clone(&context.app_runtime_stream_bus),
                context.model_ranking_refresh_worker_config.clone(),
            )
            .await
            .map_err(anyhow::Error::new)?,
        ),
    };
    Ok(EdgeInProcessUpstreams::new(
        gateway_router,
        backend_router,
        app_router,
    ))
}

async fn all_in_one_runtime_context_from_env() -> anyhow::Result<AllInOneRuntimeContext> {
    let runtime_toml = RuntimeTomlConfig::from_env_config_file().map_err(anyhow::Error::msg)?;
    let runtime_toml_ref = runtime_toml.as_ref();
    let profile = RuntimeConfigProfile::from_env_or_runtime_toml(runtime_toml_ref)
        .unwrap_or(RuntimeConfigProfile::Server);
    let database_config = DatabaseConfig::from_env_or_runtime_toml_or_initialize(runtime_toml_ref)
        .map_err(anyhow::Error::msg)?
        .ok_or_else(|| {
            anyhow::Error::msg(format!(
                "SDKWORK_CLAW_DATABASE_URL is required for all-in-one startup.\n{}",
                DatabaseConfig::startup_help_text(profile)
            ))
        })?;
    let api_key_security_config = require_api_key_security_config(
        ApiKeySecurityConfig::from_env_or_runtime_toml(runtime_toml_ref)
            .map_err(GatewayRouterError::Config)?,
    )
    .map_err(anyhow::Error::new)?;
    let trusted_subject_config = TrustedSubjectConfig::from_env_or_runtime_toml(runtime_toml_ref)
        .map_err(anyhow::Error::msg)?
        .ok_or_else(|| {
            anyhow::Error::msg(format!(
                "{} is required when all-in-one runtime is enabled",
                TrustedSubjectConfig::ENV_TRUSTED_SUBJECT_SECRET
            ))
        })?;
    let app_session_config = AppSessionConfig::from_env_or_runtime_toml(runtime_toml_ref)
        .map_err(anyhow::Error::msg)?
        .ok_or_else(|| {
            anyhow::Error::msg(format!(
                "{} is required when all-in-one runtime is enabled",
                AppSessionConfig::ENV_APP_SESSION_SECRET
            ))
        })?;
    let payment_webhook_config = PaymentWebhookConfig::from_env_or_runtime_toml(runtime_toml_ref)
        .map_err(anyhow::Error::msg)?
        .ok_or_else(|| {
            anyhow::Error::msg(format!(
                "{} is required when all-in-one runtime is enabled",
                PaymentWebhookConfig::ENV_PAYMENT_WEBHOOK_SECRET
            ))
        })?;
    let provider_relay_config = ProviderRelayConfig::from_env_or_runtime_toml(runtime_toml_ref)
        .map_err(anyhow::Error::msg)?;
    let provider_secret_map_config =
        ProviderSecretMapConfig::from_env_or_runtime_toml(runtime_toml_ref)
            .map_err(anyhow::Error::msg)?;
    let startup_install_mode = StartupInstallMode::from_env_or_runtime_toml(runtime_toml_ref)
        .map_err(anyhow::Error::msg)?;
    let usage_settlement_worker_config =
        usage_settlement_worker_config_from_env_or_toml(runtime_toml_ref)
            .map_err(anyhow::Error::msg)?;
    let provider_runtime = provider_relay_runtime_config_from_env_or_toml(runtime_toml_ref)
        .map_err(anyhow::Error::msg)?;
    let provider_adapter_config =
        provider_adapter_config_from_env_or_runtime_toml(runtime_toml_ref)
            .await
            .map_err(anyhow::Error::msg)?;
    let deployment_mode = DeploymentMode::from_optional_part(
        std::env::var(DeploymentMode::ENV_DEPLOYMENT_MODE)
            .ok()
            .or_else(|| runtime_toml_ref.and_then(|config| config.runtime.deployment_mode.clone())),
    )
    .map_err(anyhow::Error::msg)?;
    let provider_health_probe =
        sdkwork_claw_admin_api::shared_provider_health_probe_from_runtime_toml(
            provider_secret_map_config.clone(),
            runtime_toml_ref,
        )
        .map_err(anyhow::Error::new)?;
    let cache_manager =
        sdkwork_claw_admin_api::shared_cache_manager_from_runtime_toml(runtime_toml_ref)
            .map_err(anyhow::Error::new)?;
    let request_limits_config = RequestLimitsConfig::from_env_or_runtime_toml(runtime_toml_ref)
        .map_err(anyhow::Error::msg)?;
    let models_catalog_root =
        sdkwork_claw_admin_api::shared_models_catalog_root_from_runtime_toml(runtime_toml_ref);
    let app_runtime_gateway_client =
        sdkwork_claw_app_api::shared_runtime_gateway_client_from_runtime_toml(runtime_toml_ref)
            .map_err(anyhow::Error::msg)?;
    let app_runtime_stream_bus = sdkwork_claw_app_api::shared_runtime_stream_bus_from_runtime_toml(
        runtime_toml_ref,
        deployment_mode,
    )
    .await
    .map_err(anyhow::Error::new)?;
    let model_ranking_refresh_worker_config =
        sdkwork_claw_app_api::shared_model_ranking_refresh_worker_config_from_toml(
            runtime_toml_ref,
        )
        .map_err(anyhow::Error::msg)?;
    let app_catalog_refresh_interval =
        sdkwork_claw_app_api::shared_runtime_catalog_refresh_interval_from_toml(runtime_toml_ref)
            .map_err(anyhow::Error::msg)?;
    let shared_catalog_refresh_interval = provider_runtime
        .catalog_refresh_interval
        .min(app_catalog_refresh_interval);
    let api_key_secret_codec =
        api_key_secret_codec_from_config(&api_key_security_config).map_err(anyhow::Error::new)?;

    match database_config.engine {
        DatabaseEngine::Sqlite => {
            let sqlite_options = SqliteConnectOptions::from_str(database_config.url.as_str())
                .map_err(|error| {
                    anyhow::Error::new(GatewayRouterError::Sqlite(SqlCatalogLoadError::Database(
                        error,
                    )))
                })?
                .create_if_missing(true)
                .foreign_keys(true)
                .journal_mode(SqliteJournalMode::Wal)
                .busy_timeout(Duration::from_secs(SQLITE_BUSY_TIMEOUT_SECONDS));
            let sqlite_pool_max_connections = effective_sqlite_runtime_pool_max_connections(
                &database_config.url,
                database_config.max_connections,
            );
            if sqlite_pool_max_connections > database_config.max_connections {
                tracing::warn!(
                    configured_max_connections = database_config.max_connections,
                    effective_max_connections = sqlite_pool_max_connections,
                    "SQLite runtime database pool max_connections was raised to protect all-in-one background tasks"
                );
            }
            let pool = SqlitePoolOptions::new()
                .max_connections(sqlite_pool_max_connections)
                .acquire_timeout(Duration::from_secs(SQLITE_POOL_ACQUIRE_TIMEOUT_SECONDS))
                .connect_with(sqlite_options)
                .await
                .map_err(|error| {
                    anyhow::Error::new(GatewayRouterError::Sqlite(SqlCatalogLoadError::Database(
                        error,
                    )))
                })?;
            let database_installer = Arc::new(
                DatabaseInstaller::for_sqlite(pool.clone())
                    .with_env_options()
                    .map_err(anyhow::Error::new)?,
            );
            if startup_install_mode.should_ensure() {
                let install_report = database_installer
                    .ensure_installed()
                    .await
                    .map_err(anyhow::Error::new)?;
                log_bootstrap_admin_report("sdkwork-claw-all-in-one", &install_report);
            }
            let snapshot = SqlitePricingCatalogLoader::with_api_key_secret_codec(
                pool.clone(),
                api_key_secret_codec.clone(),
            )
            .with_circuit_breaker_recovery_window_seconds(
                provider_runtime.circuit_breaker_recovery_window_seconds,
            )
            .load_snapshot()
            .await
            .map_err(anyhow::Error::new)?;
            log_gateway_runtime_catalog_snapshot_summary("sqlite", "startup", snapshot.summary());
            let provider_secret_resolver = openai_runtime_relay_secret_resolver(
                provider_secret_map_config.clone(),
                snapshot.managed_provider_secrets(),
            );
            let prefer_secret_ref_openai_runtime = provider_secret_resolver.is_some();
            let catalog = Arc::new(RefreshableSqlPricingCatalog::new(snapshot));
            let usage_settlement_wakeup =
                maybe_spawn_sqlite_usage_settlement_worker(&pool, usage_settlement_worker_config)
                    .await
                    .map_err(anyhow::Error::new)?;
            spawn_sqlite_catalog_refresh_worker(
                &pool,
                Arc::clone(&catalog),
                provider_secret_resolver.clone(),
                api_key_secret_codec,
                shared_catalog_refresh_interval,
                provider_runtime.circuit_breaker_recovery_window_seconds,
            );
            Ok(AllInOneRuntimeContext {
                database_config,
                database_pool: SharedDatabasePool::Sqlite(pool),
                database_installer,
                catalog,
                api_key_security_config,
                provider_relay_config,
                provider_adapter_config,
                provider_runtime,
                provider_secret_resolver,
                prefer_secret_ref_openai_runtime,
                trusted_subject_config,
                app_session_config,
                payment_webhook_config,
                provider_health_probe,
                cache_manager,
                request_limits_config,
                models_catalog_root,
                deployment_mode,
                app_runtime_gateway_client,
                app_runtime_stream_bus,
                model_ranking_refresh_worker_config,
                usage_settlement_wakeup,
            })
        }
        DatabaseEngine::Postgres => {
            let pool = sqlx::postgres::PgPoolOptions::new()
                .max_connections(database_config.max_connections)
                .connect(&database_config.url)
                .await
                .map_err(|error| {
                    anyhow::Error::new(GatewayRouterError::Postgres(
                        PostgresCatalogLoadError::Database(error),
                    ))
                })?;
            let database_installer = Arc::new(
                DatabaseInstaller::for_postgres(pool.clone())
                    .with_env_options()
                    .map_err(anyhow::Error::new)?,
            );
            if startup_install_mode.should_ensure() {
                let install_report = database_installer
                    .ensure_installed()
                    .await
                    .map_err(anyhow::Error::new)?;
                log_bootstrap_admin_report("sdkwork-claw-all-in-one", &install_report);
            }
            let snapshot = PostgresPricingCatalogLoader::with_api_key_secret_codec(
                pool.clone(),
                api_key_secret_codec.clone(),
            )
            .with_circuit_breaker_recovery_window_seconds(
                provider_runtime.circuit_breaker_recovery_window_seconds,
            )
            .load_snapshot()
            .await
            .map_err(anyhow::Error::new)?;
            log_gateway_runtime_catalog_snapshot_summary("postgres", "startup", snapshot.summary());
            let provider_secret_resolver = openai_runtime_relay_secret_resolver(
                provider_secret_map_config.clone(),
                snapshot.managed_provider_secrets(),
            );
            let prefer_secret_ref_openai_runtime = provider_secret_resolver.is_some();
            let catalog = Arc::new(RefreshableSqlPricingCatalog::new(snapshot));
            let usage_settlement_wakeup =
                maybe_spawn_postgres_usage_settlement_worker(&pool, usage_settlement_worker_config)
                    .await
                    .map_err(anyhow::Error::new)?;
            spawn_postgres_catalog_refresh_worker(
                &pool,
                Arc::clone(&catalog),
                provider_secret_resolver.clone(),
                api_key_secret_codec,
                shared_catalog_refresh_interval,
                provider_runtime.circuit_breaker_recovery_window_seconds,
            );
            Ok(AllInOneRuntimeContext {
                database_config,
                database_pool: SharedDatabasePool::Postgres(pool),
                database_installer,
                catalog,
                api_key_security_config,
                provider_relay_config,
                provider_adapter_config,
                provider_runtime,
                provider_secret_resolver,
                prefer_secret_ref_openai_runtime,
                trusted_subject_config,
                app_session_config,
                payment_webhook_config,
                provider_health_probe,
                cache_manager,
                request_limits_config,
                models_catalog_root,
                deployment_mode,
                app_runtime_gateway_client,
                app_runtime_stream_bus,
                model_ranking_refresh_worker_config,
                usage_settlement_wakeup,
            })
        }
    }
}

fn build_gateway_router_from_all_in_one_context(
    context: &AllInOneRuntimeContext,
) -> anyhow::Result<Router> {
    let api_key_hasher =
        build_api_key_hasher(&context.api_key_security_config).map_err(anyhow::Error::new)?;
    let relays = apply_provider_adapter_config(
        build_openai_runtime_relays(
            context.provider_relay_config.clone(),
            context.provider_secret_resolver.clone(),
            context.provider_runtime.clone(),
            context.prefer_secret_ref_openai_runtime,
        )
        .map_err(anyhow::Error::new)?,
        context.provider_adapter_config.clone(),
        context.provider_secret_resolver.clone().map(|resolver| {
            let resolver: Arc<dyn ProviderSecretResolver + Send + Sync> = resolver;
            resolver
        }),
    )
    .map_err(anyhow::Error::new)?;

    let (usage_recorder, invocation_plugins): (UsageRecorder, Vec<OpenAiInvocationPluginRef>) =
        match &context.database_pool {
            SharedDatabasePool::Sqlite(pool) => (
                Arc::new(SqliteGatewayUsageRecorder::new(pool.clone())),
                vec![
                    Arc::new(SqliteOpenAiInvocationTelemetryPlugin::new(pool.clone()))
                        as OpenAiInvocationPluginRef,
                ],
            ),
            SharedDatabasePool::Postgres(pool) => (
                Arc::new(PostgresGatewayUsageRecorder::new(pool.clone())),
                vec![
                    Arc::new(PostgresOpenAiInvocationTelemetryPlugin::new(pool.clone()))
                        as OpenAiInvocationPluginRef,
                ],
            ),
        };
    let usage_recorder = wrap_usage_recorder_with_settlement_wakeup(
        usage_recorder,
        context.usage_settlement_wakeup.clone(),
    );

    Ok(router_with_openai_runtime_routes(
        router_with_database_status_and_passthrough_placeholder(
            Some(&context.database_config),
            context.provider_relay_config.is_none() && context.provider_secret_resolver.is_none(),
        ),
        Arc::clone(&context.catalog),
        api_key_hasher,
        relays,
        Some(usage_recorder),
        invocation_plugins,
        context.provider_runtime.failure_strategy,
        context.provider_runtime.default_retry_policy.clone(),
        context.provider_relay_config.clone(),
        context.provider_adapter_config.clone(),
        context.provider_secret_resolver.clone(),
        context.prefer_secret_ref_openai_runtime,
        Some(match &context.database_pool {
            SharedDatabasePool::Sqlite(pool) => StickyObjectRouteStore::sqlite(pool.clone()),
            SharedDatabasePool::Postgres(pool) => StickyObjectRouteStore::postgres(pool.clone()),
        }),
    ))
}

fn database_config_from_env_for_startup(
    runtime_toml: Option<&RuntimeTomlConfig>,
) -> Result<Option<DatabaseConfig>, GatewayRouterError> {
    let profile = RuntimeConfigProfile::from_env_or_runtime_toml(runtime_toml)
        .map_err(GatewayRouterError::Config)?;
    if profile == RuntimeConfigProfile::Server {
        return DatabaseConfig::from_env_or_runtime_toml_or_initialize(runtime_toml)
            .map_err(GatewayRouterError::Config);
    }

    let config = DatabaseConfig::from_env().map_err(GatewayRouterError::Config)?;
    let location = DatabaseConfig::runtime_config_location_from_env(profile);
    if let Some(config) = &config {
        config
            .validate_for_runtime_profile_at(profile, &location)
            .map_err(GatewayRouterError::Config)?;
        return Ok(Some(config.clone()));
    }
    Ok(None)
}

async fn maybe_spawn_sqlite_usage_settlement_worker(
    pool: &SqlitePool,
    config: UsageSettlementWorkerConfig,
) -> Result<Option<Arc<Notify>>, GatewayRouterError> {
    let config = config.normalized();
    if !config.enabled {
        return Ok(None);
    }
    if !sqlite_usage_settlement_schema_ready(pool)
        .await
        .map_err(|error| GatewayRouterError::Sqlite(SqlCatalogLoadError::Database(error)))?
    {
        tracing::warn!(
            "usage settlement worker is enabled but SQLite settlement schema is incomplete"
        );
        return Ok(None);
    }
    let store: SettlementStore = Arc::new(SqliteUsageSettlementStore::new(pool.clone()));
    let usage_settlement_wakeup = Arc::new(Notify::new());
    spawn_usage_settlement_worker(store, config, Some(Arc::clone(&usage_settlement_wakeup)));
    Ok(Some(usage_settlement_wakeup))
}

async fn maybe_spawn_postgres_usage_settlement_worker(
    pool: &PgPool,
    config: UsageSettlementWorkerConfig,
) -> Result<Option<Arc<Notify>>, GatewayRouterError> {
    let config = config.normalized();
    if !config.enabled {
        return Ok(None);
    }
    if !postgres_usage_settlement_schema_ready(pool)
        .await
        .map_err(|error| GatewayRouterError::Postgres(PostgresCatalogLoadError::Database(error)))?
    {
        tracing::warn!(
            "usage settlement worker is enabled but Postgres settlement schema is incomplete"
        );
        return Ok(None);
    }
    let store: SettlementStore = Arc::new(PostgresUsageSettlementStore::new(pool.clone()));
    let usage_settlement_wakeup = Arc::new(Notify::new());
    spawn_usage_settlement_worker(store, config, Some(Arc::clone(&usage_settlement_wakeup)));
    Ok(Some(usage_settlement_wakeup))
}

fn wrap_usage_recorder_with_settlement_wakeup(
    usage_recorder: UsageRecorder,
    usage_settlement_wakeup: Option<Arc<Notify>>,
) -> UsageRecorder {
    match usage_settlement_wakeup {
        Some(usage_settlement_wakeup) => Arc::new(NotifyingGatewayUsageRecorder::new(
            usage_recorder,
            usage_settlement_wakeup,
        )),
        None => usage_recorder,
    }
}

fn spawn_usage_settlement_worker(
    store: SettlementStore,
    config: UsageSettlementWorkerConfig,
    usage_settlement_wakeup: Option<Arc<Notify>>,
) -> tokio::task::JoinHandle<()> {
    let worker = UsageSettlementWorker::new(store, config);
    let interval = Duration::from_millis(worker.config().interval_millis);
    tokio::spawn(async move {
        loop {
            if let Err(error) = worker.run_once().await {
                tracing::warn!(error = %error, "usage settlement worker run failed");
            }
            if let Some(usage_settlement_wakeup) = usage_settlement_wakeup.as_ref() {
                tokio::select! {
                    _ = usage_settlement_wakeup.notified() => {}
                    _ = sleep(interval) => {}
                }
            } else {
                sleep(interval).await;
            }
        }
    })
}

fn spawn_sqlite_catalog_refresh_worker(
    pool: &SqlitePool,
    catalog: Arc<RefreshableSqlPricingCatalog>,
    provider_secret_resolver: Option<Arc<RefreshableProviderSecretMapResolver>>,
    api_key_secret_codec: Arc<dyn ApiKeySecretCodec + Send + Sync>,
    interval: Duration,
    circuit_breaker_recovery_window_seconds: u64,
) -> tokio::task::JoinHandle<()> {
    let pool = pool.clone();
    tokio::spawn(async move {
        let mut refresh_state = CatalogRefreshDecisionState::default();
        loop {
            sleep(interval).await;
            let loader = SqlitePricingCatalogLoader::with_api_key_secret_codec(
                pool.clone(),
                api_key_secret_codec.clone(),
            )
            .with_circuit_breaker_recovery_window_seconds(circuit_breaker_recovery_window_seconds);
            let observed_version = match loader.load_routing_config_version().await {
                Ok(version) => Some(version),
                Err(error) => {
                    tracing::warn!(
                        error = %error,
                        "SQLite OpenAI runtime catalog version probe failed; attempting full refresh"
                    );
                    None
                }
            };
            if !catalog_refresh_snapshot_due(refresh_state, observed_version) {
                refresh_state = refresh_state.after_catalog_refresh_skip(observed_version);
                continue;
            }
            match loader.load_snapshot().await {
                Ok(snapshot) => {
                    let summary = snapshot.summary();
                    if let Some(resolver) = provider_secret_resolver.as_ref() {
                        resolver.replace_managed_secrets(snapshot.managed_provider_secrets());
                    }
                    catalog.replace_snapshot(snapshot);
                    log_gateway_runtime_catalog_snapshot_summary("sqlite", "refresh", summary);
                    refresh_state = refresh_state.after_catalog_refresh_success(observed_version);
                }
                Err(error) => {
                    tracing::warn!(
                        error = %error,
                        "SQLite OpenAI runtime catalog refresh failed; keeping previous snapshot"
                    );
                }
            }
        }
    })
}

fn spawn_postgres_catalog_refresh_worker(
    pool: &PgPool,
    catalog: Arc<RefreshableSqlPricingCatalog>,
    provider_secret_resolver: Option<Arc<RefreshableProviderSecretMapResolver>>,
    api_key_secret_codec: Arc<dyn ApiKeySecretCodec + Send + Sync>,
    interval: Duration,
    circuit_breaker_recovery_window_seconds: u64,
) -> tokio::task::JoinHandle<()> {
    let pool = pool.clone();
    tokio::spawn(async move {
        let mut refresh_state = CatalogRefreshDecisionState::default();
        loop {
            sleep(interval).await;
            let loader = PostgresPricingCatalogLoader::with_api_key_secret_codec(
                pool.clone(),
                api_key_secret_codec.clone(),
            )
            .with_circuit_breaker_recovery_window_seconds(circuit_breaker_recovery_window_seconds);
            let observed_version = match loader.load_routing_config_version().await {
                Ok(version) => Some(version),
                Err(error) => {
                    tracing::warn!(
                        error = %error,
                        "Postgres OpenAI runtime catalog version probe failed; attempting full refresh"
                    );
                    None
                }
            };
            if !catalog_refresh_snapshot_due(refresh_state, observed_version) {
                refresh_state = refresh_state.after_catalog_refresh_skip(observed_version);
                continue;
            }
            match loader.load_snapshot().await {
                Ok(snapshot) => {
                    let summary = snapshot.summary();
                    if let Some(resolver) = provider_secret_resolver.as_ref() {
                        resolver.replace_managed_secrets(snapshot.managed_provider_secrets());
                    }
                    catalog.replace_snapshot(snapshot);
                    log_gateway_runtime_catalog_snapshot_summary("postgres", "refresh", summary);
                    refresh_state = refresh_state.after_catalog_refresh_success(observed_version);
                }
                Err(error) => {
                    tracing::warn!(
                        error = %error,
                        "Postgres OpenAI runtime catalog refresh failed; keeping previous snapshot"
                    );
                }
            }
        }
    })
}

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
struct CatalogRefreshDecisionState {
    last_seen_version: Option<i64>,
    ticks_since_full_refresh: u64,
}

impl CatalogRefreshDecisionState {
    fn after_catalog_refresh_success(self, observed_version: Option<i64>) -> Self {
        Self {
            last_seen_version: observed_version.or(self.last_seen_version),
            ticks_since_full_refresh: 0,
        }
    }

    fn after_catalog_refresh_skip(self, observed_version: Option<i64>) -> Self {
        Self {
            last_seen_version: observed_version.or(self.last_seen_version),
            ticks_since_full_refresh: self.ticks_since_full_refresh.saturating_add(1),
        }
    }
}

fn catalog_refresh_snapshot_due(
    state: CatalogRefreshDecisionState,
    observed_version: Option<i64>,
) -> bool {
    match observed_version {
        None => true,
        Some(version) if state.last_seen_version != Some(version) => true,
        Some(_) => {
            state.ticks_since_full_refresh.saturating_add(1) >= CATALOG_REFRESH_FALLBACK_TICKS
        }
    }
}

fn log_gateway_runtime_catalog_snapshot_summary(
    engine: &'static str,
    phase: &'static str,
    summary: SqlPricingCatalogSnapshotSummary,
) {
    if phase == "refresh" {
        tracing::debug!(
            service = "sdkwork-claw-gateway",
            catalog_engine = engine,
            catalog_phase = phase,
            vendors = summary.vendors,
            models = summary.models,
            provider_routes = summary.provider_routes,
            callable_provider_routes = summary.callable_provider_routes,
            provider_channel_routes = summary.provider_channel_routes,
            callable_provider_channel_routes = summary.callable_provider_channel_routes,
            provider_channel_group_bindings = summary.provider_channel_group_bindings,
            routing_policies = summary.routing_policies,
            routing_rules = summary.routing_rules,
            pricing_plans = summary.pricing_plans,
            channel_groups = summary.channel_groups,
            api_keys = summary.api_keys,
            prices = summary.prices,
            managed_provider_secrets = summary.managed_provider_secrets,
            "gateway runtime catalog snapshot loaded"
        );
    } else {
        tracing::info!(
            service = "sdkwork-claw-gateway",
            catalog_engine = engine,
            catalog_phase = phase,
            vendors = summary.vendors,
            models = summary.models,
            provider_routes = summary.provider_routes,
            callable_provider_routes = summary.callable_provider_routes,
            provider_channel_routes = summary.provider_channel_routes,
            callable_provider_channel_routes = summary.callable_provider_channel_routes,
            provider_channel_group_bindings = summary.provider_channel_group_bindings,
            routing_policies = summary.routing_policies,
            routing_rules = summary.routing_rules,
            pricing_plans = summary.pricing_plans,
            channel_groups = summary.channel_groups,
            api_keys = summary.api_keys,
            prices = summary.prices,
            managed_provider_secrets = summary.managed_provider_secrets,
            "gateway runtime catalog snapshot loaded"
        );
    }
}

async fn sqlite_usage_settlement_schema_ready(pool: &SqlitePool) -> Result<bool, sqlx::Error> {
    let table_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM sqlite_master
        WHERE type = 'table'
          AND name IN (
              'ai_usage_fact',
              'commerce_usage_settlement',
              'commerce_account',
              'commerce_account_ledger_entry'
          )
        "#,
    )
    .fetch_one(pool)
    .await?;
    let usage_column_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM pragma_table_info('ai_usage_fact')
        WHERE name IN ('settlement_status', 'settlement_id', 'pricing_snapshot')
        "#,
    )
    .fetch_one(pool)
    .await?;
    Ok(table_count == 4 && usage_column_count == 3)
}

async fn postgres_usage_settlement_schema_ready(pool: &PgPool) -> Result<bool, sqlx::Error> {
    let table_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM information_schema.tables
        WHERE table_schema = current_schema()
          AND table_name IN (
              'ai_usage_fact',
              'commerce_usage_settlement',
              'commerce_account',
              'commerce_account_ledger_entry'
          )
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
          AND column_name IN ('settlement_status', 'settlement_id', 'pricing_snapshot')
        "#,
    )
    .fetch_one(pool)
    .await?;
    Ok(table_count == 4 && usage_column_count == 3)
}

fn usage_settlement_worker_config_from_env_or_toml(
    runtime_toml: Option<&RuntimeTomlConfig>,
) -> Result<UsageSettlementWorkerConfig, String> {
    const ENABLED: &str = "SDKWORK_CLAW_USAGE_SETTLEMENT_WORKER_ENABLED";
    const TENANT_ID: &str = "SDKWORK_CLAW_USAGE_SETTLEMENT_TENANT_ID";
    const ORGANIZATION_ID: &str = "SDKWORK_CLAW_USAGE_SETTLEMENT_ORGANIZATION_ID";
    const BATCH_SIZE: &str = "SDKWORK_CLAW_USAGE_SETTLEMENT_BATCH_SIZE";
    const INTERVAL_MILLIS: &str = "SDKWORK_CLAW_USAGE_SETTLEMENT_INTERVAL_MILLIS";

    let defaults = UsageSettlementWorkerConfig::default();
    Ok(UsageSettlementWorkerConfig {
        enabled: parse_optional_bool_config(
            ENABLED,
            runtime_toml.and_then(|config| config.usage_settlement.enabled),
        )?
        .unwrap_or(defaults.enabled),
        tenant_id: parse_non_negative_i64_config(
            TENANT_ID,
            runtime_toml.and_then(|config| config.usage_settlement.tenant_id),
            defaults.tenant_id,
        )?,
        organization_id: parse_non_negative_i64_config(
            ORGANIZATION_ID,
            runtime_toml.and_then(|config| config.usage_settlement.organization_id),
            defaults.organization_id,
        )?,
        batch_size: parse_positive_i64_config(
            BATCH_SIZE,
            runtime_toml.and_then(|config| config.usage_settlement.batch_size),
            defaults.batch_size,
        )?,
        interval_millis: parse_positive_u64_config(
            INTERVAL_MILLIS,
            runtime_toml.and_then(|config| config.usage_settlement.interval_millis),
            defaults.interval_millis,
        )?,
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

fn parse_non_negative_u64_config(
    name: &str,
    config_value: Option<u64>,
    default: u64,
) -> Result<u64, String> {
    Ok(sdkwork_claw_config::runtime::config_u64(name, config_value)?.unwrap_or(default))
}

fn parse_positive_usize_config(
    name: &str,
    config_value: Option<usize>,
    default: usize,
) -> Result<usize, String> {
    let parsed = match sdkwork_claw_config::runtime::env_optional(name) {
        Some(value) => value
            .parse::<usize>()
            .map_err(|_| format!("{name} must be a positive integer"))?,
        None => config_value.unwrap_or(default),
    };
    if parsed == 0 {
        return Err(format!("{name} must be a positive integer"));
    }
    Ok(parsed)
}

fn parse_retryable_status_codes_config(
    name: &str,
    config_value: Option<&[u16]>,
    default: &[u16],
) -> Result<Vec<u16>, String> {
    let Some(value) = sdkwork_claw_config::runtime::env_optional(name) else {
        return Ok(config_value
            .filter(|values| !values.is_empty())
            .unwrap_or(default)
            .to_vec());
    };
    let status_codes = value
        .split(',')
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(|value| {
            value
                .parse::<u16>()
                .map_err(|_| format!("{name} must contain comma-separated HTTP status codes"))
        })
        .collect::<Result<Vec<_>, _>>()?;
    if status_codes.is_empty() {
        return Err(format!("{name} must contain at least one HTTP status code"));
    }
    Ok(status_codes)
}

fn build_api_key_hasher(config: &ApiKeySecurityConfig) -> Result<ApiKeyHasher, GatewayRouterError> {
    let hasher = HmacSha256ApiKeySecretHasher::new(config.pepper_secret())
        .map_err(|error| GatewayRouterError::Config(error.to_string()))?;
    Ok(Arc::new(hasher))
}

fn api_key_secret_codec_from_config(
    config: &ApiKeySecurityConfig,
) -> Result<ApiKeyCodec, GatewayRouterError> {
    Ok(Arc::new(
        RingAeadApiKeySecretCodec::new(config.pepper_secret())
            .map_err(|error| GatewayRouterError::Config(error.to_string()))?,
    ))
}

fn require_api_key_security_config(
    config: Option<ApiKeySecurityConfig>,
) -> Result<ApiKeySecurityConfig, GatewayRouterError> {
    config.ok_or_else(|| {
        GatewayRouterError::Config(
            "SDKWORK_CLAW_API_KEY_PEPPER is required for OpenAI runtime routes".to_owned(),
        )
    })
}

fn openai_runtime_relay_secret_resolver(
    provider_secret_map_config: Option<ProviderSecretMapConfig>,
    managed_provider_secrets: std::collections::BTreeMap<String, String>,
) -> Option<Arc<RefreshableProviderSecretMapResolver>> {
    let external_secrets = provider_secret_map_config
        .map(ProviderSecretMapConfig::into_secret_map)
        .unwrap_or_default();
    if external_secrets.is_empty() && managed_provider_secrets.is_empty() {
        return None;
    }
    Some(Arc::new(RefreshableProviderSecretMapResolver::from_maps(
        external_secrets,
        managed_provider_secrets,
    )))
}

fn build_openai_runtime_relays(
    config: Option<ProviderRelayConfig>,
    provider_secret_resolver: Option<Arc<RefreshableProviderSecretMapResolver>>,
    provider_runtime: ProviderRelayRuntimeConfig,
    prefer_secret_ref_relays: bool,
) -> Result<OpenAiRuntimeRelays, GatewayRouterError> {
    if prefer_secret_ref_relays {
        if let Some(resolver) = provider_secret_resolver {
            return Ok(secret_ref_openai_runtime_relays(resolver, provider_runtime));
        }
    }

    if let Some(openai_relay) = config.as_ref().and_then(ProviderRelayConfig::openai_relay) {
        let endpoint = UpstreamProviderEndpoint::new(
            openai_relay.base_url().to_owned(),
            openai_relay.bearer_token().to_owned(),
        )
        .map_err(|error| GatewayRouterError::Config(error.to_string()))?;
        return Ok(OpenAiRuntimeRelays {
            chat: Some(Arc::new(OpenAiCompatibleChatCompletionRelay::with_runtime(
                endpoint.clone(),
                provider_runtime.response_timeout,
                provider_runtime.default_retry_policy.clone(),
            ))),
            chat_stream: Some(Arc::new(
                OpenAiCompatibleChatCompletionStreamRelay::with_runtime(
                    endpoint.clone(),
                    provider_runtime.response_timeout,
                    provider_runtime.default_retry_policy.clone(),
                ),
            )),
            embeddings: Some(Arc::new(OpenAiCompatibleEmbeddingsRelay::with_runtime(
                endpoint.clone(),
                provider_runtime.response_timeout,
                provider_runtime.default_retry_policy.clone(),
            ))),
            responses: Some(Arc::new(OpenAiCompatibleResponsesRelay::with_runtime(
                endpoint,
                provider_runtime.response_timeout,
                provider_runtime.default_retry_policy,
            ))),
        });
    }

    if let Some(resolver) = provider_secret_resolver {
        return Ok(secret_ref_openai_runtime_relays(resolver, provider_runtime));
    }

    Ok(OpenAiRuntimeRelays::default())
}

fn secret_ref_openai_runtime_relays(
    resolver: Arc<RefreshableProviderSecretMapResolver>,
    provider_runtime: ProviderRelayRuntimeConfig,
) -> OpenAiRuntimeRelays {
    OpenAiRuntimeRelays {
        chat: Some(Arc::new(
            SecretRefOpenAiCompatibleChatCompletionRelay::with_runtime(
                resolver.clone(),
                provider_runtime.response_timeout,
                provider_runtime.default_retry_policy.clone(),
            ),
        )),
        chat_stream: Some(Arc::new(
            SecretRefOpenAiCompatibleChatCompletionStreamRelay::with_runtime(
                resolver.clone(),
                provider_runtime.response_timeout,
                provider_runtime.default_retry_policy.clone(),
            ),
        )),
        embeddings: Some(Arc::new(
            SecretRefOpenAiCompatibleEmbeddingsRelay::with_runtime(
                resolver.clone(),
                provider_runtime.response_timeout,
                provider_runtime.default_retry_policy.clone(),
            ),
        )),
        responses: Some(Arc::new(
            SecretRefOpenAiCompatibleResponsesRelay::with_runtime(
                resolver,
                provider_runtime.response_timeout,
                provider_runtime.default_retry_policy,
            ),
        )),
    }
}

fn apply_provider_adapter_config(
    mut relays: OpenAiRuntimeRelays,
    provider_adapter_config: Option<ProviderAdapterConfig>,
    provider_secret_resolver: Option<Arc<dyn ProviderSecretResolver + Send + Sync>>,
) -> Result<OpenAiRuntimeRelays, GatewayRouterError> {
    let Some(provider_adapter_config) = provider_adapter_config else {
        return Ok(relays);
    };
    if provider_adapter_config.routes().is_empty() {
        return Ok(relays);
    }
    let registry = Arc::new(ProviderAdapterRegistry::new(
        provider_adapter_config.routes().to_vec(),
    ));
    let adapter_client =
        ProviderAdapterHttpClient::new(provider_adapter_config.gateway_token().to_owned());
    let routes = provider_adapter_config.routes();

    if has_chat_adapter_route(routes) {
        let Some(chat_relay) = relays.chat.take() else {
            return Err(GatewayRouterError::Config(
                "provider adapter routes for openai.chat_completions require a configured chat completion relay for direct HTTP fallback"
                    .to_owned(),
            ));
        };
        let adapter_relay = AdapterAwareChatCompletionRelay::new(
            chat_relay,
            Arc::clone(&registry),
            adapter_client.clone(),
        );
        let adapter_relay = if let Some(resolver) = provider_secret_resolver.clone() {
            adapter_relay.with_secret_resolver(resolver)
        } else {
            adapter_relay
        };
        relays.chat = Some(Arc::new(adapter_relay));
        if let Some(chat_stream_relay) = relays.chat_stream.take() {
            let adapter_stream_relay = AdapterAwareChatCompletionStreamRelay::new(
                chat_stream_relay,
                Arc::clone(&registry),
                adapter_client.clone(),
            );
            let adapter_stream_relay = if let Some(resolver) = provider_secret_resolver.clone() {
                adapter_stream_relay.with_secret_resolver(resolver)
            } else {
                adapter_stream_relay
            };
            relays.chat_stream = Some(Arc::new(adapter_stream_relay));
        }
    }
    if has_responses_adapter_route(routes) {
        let Some(responses_relay) = relays.responses.take() else {
            return Err(GatewayRouterError::Config(
                "provider adapter routes for openai.responses require a configured responses relay for direct HTTP fallback"
                    .to_owned(),
            ));
        };
        let adapter_relay = AdapterAwareResponsesRelay::new(
            responses_relay,
            Arc::clone(&registry),
            adapter_client.clone(),
        );
        let adapter_relay = if let Some(resolver) = provider_secret_resolver.clone() {
            adapter_relay.with_secret_resolver(resolver)
        } else {
            adapter_relay
        };
        relays.responses = Some(Arc::new(adapter_relay));
    }
    if has_embeddings_adapter_route(routes) {
        let Some(embeddings_relay) = relays.embeddings.take() else {
            return Err(GatewayRouterError::Config(
                "provider adapter routes for openai.embeddings require a configured embeddings relay for direct HTTP fallback"
                    .to_owned(),
            ));
        };
        let adapter_relay =
            AdapterAwareEmbeddingsRelay::new(embeddings_relay, registry, adapter_client);
        let adapter_relay = if let Some(resolver) = provider_secret_resolver {
            adapter_relay.with_secret_resolver(resolver)
        } else {
            adapter_relay
        };
        relays.embeddings = Some(Arc::new(adapter_relay));
    }
    Ok(relays)
}

async fn provider_adapter_config_from_env_or_runtime_toml(
    runtime_toml: Option<&RuntimeTomlConfig>,
) -> Result<Option<ProviderAdapterConfig>, String> {
    let local_config = ProviderAdapterConfig::from_env_or_runtime_toml(runtime_toml)?;
    if local_config.is_some() {
        return Ok(local_config);
    }

    let Some(discovery_config) =
        ProviderAdapterManifestDiscoveryConfig::from_env_or_runtime_toml(runtime_toml)?
    else {
        return Ok(None);
    };
    let client = ProviderAdapterHttpClient::new(discovery_config.gateway_token().to_owned());
    let manifest = client
        .fetch_manifest(discovery_config.adapter_base_url())
        .await
        .map_err(|error| {
            format!(
                "provider adapter manifest discovery failed: {}",
                error.message
            )
        })?;
    let adapter_config = ProviderAdapterConfig::from_manifest(
        discovery_config.adapter_base_url(),
        &manifest,
        Some(discovery_config.gateway_token().to_owned()),
    )?;
    if adapter_config.routes().is_empty() {
        Ok(None)
    } else {
        Ok(Some(adapter_config))
    }
}

fn has_chat_adapter_route(routes: &[ProviderAdapterRouteConfig]) -> bool {
    routes.iter().any(|route| {
        adapter_route_matches_endpoint(
            route,
            "openai.chat_completions",
            "chat",
            "/v1/chat/completions",
        )
    })
}

fn has_responses_adapter_route(routes: &[ProviderAdapterRouteConfig]) -> bool {
    routes.iter().any(|route| {
        adapter_route_matches_endpoint(route, "openai.responses", "responses", "/v1/responses")
    })
}

fn has_embeddings_adapter_route(routes: &[ProviderAdapterRouteConfig]) -> bool {
    routes.iter().any(|route| {
        adapter_route_matches_endpoint(route, "openai.embeddings", "embeddings", "/v1/embeddings")
    })
}

fn adapter_route_matches_endpoint(
    route: &ProviderAdapterRouteConfig,
    endpoint_key: &str,
    capability: &str,
    standard_path: &str,
) -> bool {
    route.status == AdapterRouteStatus::Enabled
        && (route
            .endpoint_key
            .as_deref()
            .is_some_and(|value| value.trim().eq_ignore_ascii_case(endpoint_key))
            || route
                .capability
                .as_deref()
                .is_some_and(|value| value.trim().eq_ignore_ascii_case(capability))
            || adapter_path_pattern_matches(route.standard_path_pattern.as_str(), standard_path))
}

fn adapter_path_pattern_matches(pattern: &str, path: &str) -> bool {
    let pattern = normalize_adapter_path(pattern);
    let path = normalize_adapter_path(path);
    if pattern.eq_ignore_ascii_case(&path) || pattern == "/*" {
        return true;
    }
    let pattern_lower = pattern.to_ascii_lowercase();
    let path_lower = path.to_ascii_lowercase();
    pattern_lower
        .strip_suffix("/*")
        .is_some_and(|prefix| path_lower == prefix || path_lower.starts_with(&format!("{prefix}/")))
}

fn normalize_adapter_path(value: &str) -> String {
    let value = value.trim();
    if value.starts_with('/') {
        value.to_owned()
    } else {
        format!("/{value}")
    }
}

#[derive(Clone)]
struct ProviderRelayRuntimeConfig {
    response_timeout: Duration,
    default_retry_policy: ProviderRetryPolicy,
    catalog_refresh_interval: Duration,
    circuit_breaker_recovery_window_seconds: u64,
    failure_strategy: OpenAiRuntimeFailureStrategy,
}

fn provider_relay_runtime_config_from_env_or_toml(
    runtime_toml: Option<&RuntimeTomlConfig>,
) -> Result<ProviderRelayRuntimeConfig, String> {
    const RESPONSE_TIMEOUT: &str = "SDKWORK_CLAW_PROVIDER_RESPONSE_TIMEOUT_MILLIS";
    const RETRY_MAX_ATTEMPTS: &str = "SDKWORK_CLAW_PROVIDER_RETRY_MAX_ATTEMPTS";
    const RETRY_STATUS_CODES: &str = "SDKWORK_CLAW_PROVIDER_RETRYABLE_STATUS_CODES";
    const RETRY_BACKOFF: &str = "SDKWORK_CLAW_PROVIDER_RETRY_BACKOFF_MILLIS";
    const CATALOG_REFRESH_INTERVAL: &str = "SDKWORK_CLAW_PROVIDER_CATALOG_REFRESH_INTERVAL_MILLIS";
    const CIRCUIT_BREAKER_RECOVERY_WINDOW: &str =
        "SDKWORK_CLAW_PROVIDER_CIRCUIT_BREAKER_RECOVERY_WINDOW_MILLIS";
    const FAILURE_STRATEGY: &str = "SDKWORK_CLAW_PROVIDER_FAILURE_STRATEGY";

    let response_timeout_millis = parse_positive_u64_config(
        RESPONSE_TIMEOUT,
        runtime_toml.and_then(|config| config.provider_relay.runtime.response_timeout_millis),
        DEFAULT_PROVIDER_RESPONSE_TIMEOUT_MILLIS,
    )?;
    let retry_max_attempts = parse_positive_usize_config(
        RETRY_MAX_ATTEMPTS,
        runtime_toml.and_then(|config| config.provider_relay.retry.max_attempts),
        DEFAULT_PROVIDER_RETRY_ATTEMPTS,
    )?;
    let retryable_status_codes = parse_retryable_status_codes_config(
        RETRY_STATUS_CODES,
        runtime_toml.map(|config| {
            config
                .provider_relay
                .retry
                .retryable_status_codes
                .as_slice()
        }),
        DEFAULT_RETRYABLE_PROVIDER_STATUS_CODES.as_slice(),
    )?;
    let retry_backoff_millis = parse_non_negative_u64_config(
        RETRY_BACKOFF,
        runtime_toml.and_then(|config| config.provider_relay.retry.backoff_millis),
        0,
    )?;
    let default_retry_policy = ProviderRetryPolicy::new(
        retry_max_attempts,
        retryable_status_codes,
        retry_backoff_millis,
    )
    .map_err(|error| error.to_string())?;
    let catalog_refresh_interval_millis = parse_positive_u64_config(
        CATALOG_REFRESH_INTERVAL,
        runtime_toml.and_then(|config| {
            config
                .provider_relay
                .runtime
                .catalog_refresh_interval_millis
        }),
        DEFAULT_OPENAI_RUNTIME_CATALOG_REFRESH_INTERVAL_MILLIS,
    )?;
    let circuit_breaker_recovery_window_millis = parse_positive_u64_config(
        CIRCUIT_BREAKER_RECOVERY_WINDOW,
        runtime_toml.and_then(|config| {
            config
                .provider_relay
                .runtime
                .circuit_breaker_recovery_window_millis
        }),
        DEFAULT_PROVIDER_CIRCUIT_BREAKER_RECOVERY_WINDOW_SECONDS * 1_000,
    )?;
    let failure_strategy = parse_openai_runtime_failure_strategy(
        sdkwork_claw_config::runtime::env_optional(FAILURE_STRATEGY)
            .or_else(|| {
                runtime_toml
                    .and_then(|config| config.provider_relay.runtime.failure_strategy.as_deref())
                    .map(str::to_owned)
            })
            .as_deref(),
    )?;

    Ok(ProviderRelayRuntimeConfig {
        response_timeout: Duration::from_millis(response_timeout_millis),
        default_retry_policy,
        catalog_refresh_interval: Duration::from_millis(catalog_refresh_interval_millis),
        circuit_breaker_recovery_window_seconds: seconds_ceil_from_millis(
            circuit_breaker_recovery_window_millis,
        ),
        failure_strategy,
    })
}

fn parse_openai_runtime_failure_strategy(
    value: Option<&str>,
) -> Result<OpenAiRuntimeFailureStrategy, String> {
    match value
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .unwrap_or("failover")
        .to_ascii_lowercase()
        .as_str()
    {
        "failover" | "fail_over" | "fail-over" => Ok(OpenAiRuntimeFailureStrategy::Failover),
        "fail_closed" | "fail-closed" | "failclosed" => {
            Ok(OpenAiRuntimeFailureStrategy::FailClosed)
        }
        _ => Err(
            "SDKWORK_CLAW_PROVIDER_FAILURE_STRATEGY must be one of failover or fail_closed"
                .to_owned(),
        ),
    }
}

fn seconds_ceil_from_millis(millis: u64) -> u64 {
    millis.saturating_add(999) / 1_000
}

#[derive(Debug)]
pub enum GatewayRouterError {
    Config(String),
    Installer(DatabaseInstallError),
    Sqlite(SqlCatalogLoadError),
    Postgres(PostgresCatalogLoadError),
}

impl std::fmt::Display for GatewayRouterError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Config(error) => write!(f, "{error}"),
            Self::Installer(error) => write!(f, "{error}"),
            Self::Sqlite(error) => write!(f, "{error}"),
            Self::Postgres(error) => write!(f, "{error}"),
        }
    }
}

impl std::error::Error for GatewayRouterError {}

impl From<SqlCatalogLoadError> for GatewayRouterError {
    fn from(value: SqlCatalogLoadError) -> Self {
        Self::Sqlite(value)
    }
}

impl From<DatabaseInstallError> for GatewayRouterError {
    fn from(value: DatabaseInstallError) -> Self {
        Self::Installer(value)
    }
}

impl From<PostgresCatalogLoadError> for GatewayRouterError {
    fn from(value: PostgresCatalogLoadError) -> Self {
        Self::Postgres(value)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn provider_runtime_failure_strategy_accepts_supported_values() {
        assert_eq!(
            OpenAiRuntimeFailureStrategy::Failover,
            parse_openai_runtime_failure_strategy(None).unwrap()
        );
        assert_eq!(
            OpenAiRuntimeFailureStrategy::Failover,
            parse_openai_runtime_failure_strategy(Some("failover")).unwrap()
        );
        assert_eq!(
            OpenAiRuntimeFailureStrategy::FailClosed,
            parse_openai_runtime_failure_strategy(Some("fail_closed")).unwrap()
        );
        assert_eq!(
            OpenAiRuntimeFailureStrategy::FailClosed,
            parse_openai_runtime_failure_strategy(Some("fail-closed")).unwrap()
        );
    }

    #[test]
    fn provider_runtime_failure_strategy_rejects_unknown_values() {
        let error = parse_openai_runtime_failure_strategy(Some("retry_forever")).unwrap_err();

        assert!(error.contains("SDKWORK_CLAW_PROVIDER_FAILURE_STRATEGY"));
        assert!(error.contains("failover"));
        assert!(error.contains("fail_closed"));
    }

    #[test]
    fn runtime_catalog_refresh_decision_refreshes_first_observed_version() {
        assert!(catalog_refresh_snapshot_due(
            CatalogRefreshDecisionState::default(),
            Some(7)
        ));
    }

    #[test]
    fn runtime_catalog_refresh_decision_skips_unchanged_version_before_fallback() {
        let state = CatalogRefreshDecisionState {
            last_seen_version: Some(7),
            ticks_since_full_refresh: 0,
        };

        assert!(!catalog_refresh_snapshot_due(state, Some(7)));
        assert_eq!(
            CatalogRefreshDecisionState {
                last_seen_version: Some(7),
                ticks_since_full_refresh: 1,
            },
            state.after_catalog_refresh_skip(Some(7))
        );
    }

    #[test]
    fn runtime_catalog_refresh_decision_refreshes_changed_version() {
        let state = CatalogRefreshDecisionState {
            last_seen_version: Some(7),
            ticks_since_full_refresh: 3,
        };

        assert!(catalog_refresh_snapshot_due(state, Some(8)));
        assert_eq!(
            CatalogRefreshDecisionState {
                last_seen_version: Some(8),
                ticks_since_full_refresh: 0,
            },
            state.after_catalog_refresh_success(Some(8))
        );
    }

    #[test]
    fn runtime_catalog_refresh_decision_refreshes_unchanged_version_on_fallback_tick() {
        let state = CatalogRefreshDecisionState {
            last_seen_version: Some(7),
            ticks_since_full_refresh: CATALOG_REFRESH_FALLBACK_TICKS - 1,
        };

        assert!(catalog_refresh_snapshot_due(state, Some(7)));
    }

    #[test]
    fn runtime_catalog_refresh_decision_refreshes_when_version_probe_fails() {
        let state = CatalogRefreshDecisionState {
            last_seen_version: Some(7),
            ticks_since_full_refresh: 0,
        };

        assert!(catalog_refresh_snapshot_due(state, None));
        assert_eq!(
            CatalogRefreshDecisionState {
                last_seen_version: Some(7),
                ticks_since_full_refresh: 0,
            },
            state.after_catalog_refresh_success(None)
        );
    }

    #[test]
    fn gateway_runtime_sqlite_pool_options_raise_file_database_max_connections_and_set_acquire_timeout(
    ) {
        let options =
            build_sqlite_runtime_pool_options("sqlite://D:/tmp/sdkwork-claw-router.db", 1);

        assert_eq!(
            SQLITE_RUNTIME_MIN_POOL_CONNECTIONS,
            options.get_max_connections()
        );
        assert_eq!(
            Duration::from_secs(SQLITE_POOL_ACQUIRE_TIMEOUT_SECONDS),
            options.get_acquire_timeout()
        );
    }

    #[test]
    fn gateway_runtime_sqlite_pool_options_preserve_in_memory_configured_max_connections() {
        let options = build_sqlite_runtime_pool_options("sqlite::memory:", 1);

        assert_eq!(1, options.get_max_connections());
    }

    #[test]
    fn database_runtime_mounts_secret_ref_chat_relays_without_static_provider_relay_config() {
        let mut managed_provider_secrets = std::collections::BTreeMap::new();
        managed_provider_secrets.insert(
            "vault://providers/openrouter/account/main".to_owned(),
            "sk-managed-provider-secret".to_owned(),
        );
        let relays = build_openai_runtime_relays(
            None,
            openai_runtime_relay_secret_resolver(None, managed_provider_secrets),
            provider_relay_runtime_for_test(),
            true,
        )
        .unwrap();

        assert!(
            relays.chat.is_some(),
            "database-backed gateway chat completions must use route-scoped provider settings"
        );
        assert!(
            relays.chat_stream.is_some(),
            "database-backed gateway streaming chat completions must not fall through to 501"
        );
    }

    #[test]
    fn database_runtime_does_not_enable_empty_secret_ref_resolver() {
        let resolver =
            openai_runtime_relay_secret_resolver(None, std::collections::BTreeMap::new());

        assert!(
            resolver.is_none(),
            "an empty resolver must not override an explicit provider relay config"
        );
    }

    fn provider_relay_runtime_for_test() -> ProviderRelayRuntimeConfig {
        ProviderRelayRuntimeConfig {
            response_timeout: Duration::from_secs(1),
            default_retry_policy: ProviderRetryPolicy::default(),
            catalog_refresh_interval: Duration::from_secs(1),
            circuit_breaker_recovery_window_seconds: 1,
            failure_strategy: OpenAiRuntimeFailureStrategy::default(),
        }
    }

    #[tokio::test]
    async fn provider_adapter_config_wraps_chat_relay_and_preserves_direct_miss() {
        #[derive(Clone)]
        struct DirectRelay;

        impl ChatCompletionRelay for DirectRelay {
            fn create_chat_completion<'a>(
                &'a self,
                _request: sdkwork_claw_product::ports::ChatCompletionRelayRequest,
            ) -> sdkwork_claw_product::ports::ChatCompletionRelayFuture<'a> {
                Box::pin(async {
                    Ok(
                        sdkwork_claw_product::ports::ChatCompletionRelayResponse::json(
                            200,
                            serde_json::json!({"id": "direct"}),
                        ),
                    )
                })
            }
        }

        let adapter_config = sdkwork_claw_config::ProviderAdapterConfig::from_json(
            r#"{
                "routes": [
                    {
                        "providerCode": "tencent-cloud",
                        "adapterKind": "internal_http",
                        "adapterBaseUrl": "http://127.0.0.1:39110",
                        "method": "POST",
                        "standardPathPattern": "/v1/chat/completions",
                        "adapterPathTemplate": "/providers/{provider_code}{standard_path}",
                        "status": "enabled",
                        "priority": 10
                    }
                ]
            }"#,
            Some("adapter-token".to_owned()),
        )
        .unwrap();
        let relays = apply_provider_adapter_config(
            OpenAiRuntimeRelays {
                chat: Some(Arc::new(DirectRelay)),
                chat_stream: None,
                embeddings: None,
                responses: None,
            },
            Some(adapter_config),
            None,
        )
        .unwrap();

        let response = relays
            .chat
            .unwrap()
            .create_chat_completion(sdkwork_claw_product::ports::ChatCompletionRelayRequest {
                api_key_id: 101,
                tenant_id: 10,
                organization_id: 20,
                user_id: 30,
                group_id: 10,
                group_code: "standard-group".to_owned(),
                pricing_plan_code: "standard".to_owned(),
                model: "gpt-4o-mini".to_owned(),
                provider_code: "openrouter".to_owned(),
                provider_channel_id: 3001,
                provider_region_code: "global".to_owned(),
                provider_model: "gpt-4o-mini".to_owned(),
                provider_base_url: Some("http://provider.example".to_owned()),
                provider_secret_ref: Some("vault://providers/openrouter/account/main".to_owned()),
                provider_auth_profile: sdkwork_claw_product::domain::ProviderAuthProfile::bearer(),
                provider_timeout_ms: None,
                provider_retry_policy: None,
                request_body: serde_json::json!({"model": "gpt-4o-mini"}),
            })
            .await
            .unwrap();

        assert_eq!("direct", response.body["id"]);
    }

    #[tokio::test]
    async fn provider_adapter_config_wraps_chat_stream_relay_for_adapter_hits() {
        use axum::body::Body;
        use axum::extract::State;
        use axum::routing::post;
        use axum::Json;
        use sdkwork_claw_provider_adapter_contract::{
            AdapterInvocationRequest, AdapterInvocationResponse,
        };
        use std::sync::Mutex;

        #[derive(Clone)]
        struct DirectRelay;

        impl ChatCompletionRelay for DirectRelay {
            fn create_chat_completion<'a>(
                &'a self,
                _request: sdkwork_claw_product::ports::ChatCompletionRelayRequest,
            ) -> sdkwork_claw_product::ports::ChatCompletionRelayFuture<'a> {
                Box::pin(async {
                    Ok(
                        sdkwork_claw_product::ports::ChatCompletionRelayResponse::json(
                            200,
                            serde_json::json!({"id": "direct"}),
                        ),
                    )
                })
            }
        }

        #[derive(Clone)]
        struct DirectStreamRelay {
            calls: Arc<Mutex<Vec<sdkwork_claw_product::ports::ChatCompletionRelayRequest>>>,
        }

        impl ChatCompletionStreamRelay for DirectStreamRelay {
            fn create_chat_completion_stream<'a>(
                &'a self,
                request: sdkwork_claw_product::ports::ChatCompletionRelayRequest,
            ) -> sdkwork_claw_product::ports::ChatCompletionStreamRelayFuture<'a> {
                self.calls.lock().unwrap().push(request);
                Box::pin(async {
                    Ok(
                        sdkwork_claw_product::ports::ChatCompletionStreamRelayResponse::new(
                            200,
                            Some("text/event-stream".to_owned()),
                            Body::from("data: {\"id\":\"direct-stream\"}\n\ndata: [DONE]\n\n"),
                        ),
                    )
                })
            }
        }

        let adapter_calls = Arc::new(Mutex::new(Vec::<AdapterInvocationRequest>::new()));
        let app = Router::new()
            .route(
                "/providers/openrouter/v1/chat/completions",
                post(
                    |State(adapter_calls): State<
                        Arc<Mutex<Vec<AdapterInvocationRequest>>>,
                    >,
                     Json(body): Json<AdapterInvocationRequest>| async move {
                        adapter_calls.lock().unwrap().push(body);
                        Json(AdapterInvocationResponse::json(
                            200,
                            serde_json::json!({
                                "id": "chatcmpl-adapter-stream",
                                "choices": [{"index": 0, "message": {"role": "assistant", "content": "adapter"}, "finish_reason": "stop"}],
                                "usage": {"prompt_tokens": 1, "completion_tokens": 1, "total_tokens": 2}
                            }),
                        ))
                    },
                ),
            )
            .with_state(Arc::clone(&adapter_calls));
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let base_url = format!("http://{}", listener.local_addr().unwrap());
        let server = tokio::spawn(async move {
            axum::serve(listener, app).await.unwrap();
        });

        let adapter_config = sdkwork_claw_config::ProviderAdapterConfig::from_json(
            &format!(
                r#"{{
                "routes": [
                    {{
                        "providerCode": "openrouter",
                        "adapterKind": "internal_http",
                        "adapterBaseUrl": "{base_url}",
                        "endpointKey": "openai.chat_completions",
                        "method": "POST",
                        "invocationShape": "sse_stream",
                        "standardPathPattern": "/v1/chat/completions",
                        "adapterPathTemplate": "/providers/{{provider_code}}{{standard_path}}",
                        "status": "enabled",
                        "priority": 10
                    }}
                ]
            }}"#
            ),
            Some("adapter-token".to_owned()),
        )
        .unwrap();
        let direct_stream_calls = Arc::new(Mutex::new(Vec::new()));
        let relays = apply_provider_adapter_config(
            OpenAiRuntimeRelays {
                chat: Some(Arc::new(DirectRelay)),
                chat_stream: Some(Arc::new(DirectStreamRelay {
                    calls: Arc::clone(&direct_stream_calls),
                })),
                embeddings: None,
                responses: None,
            },
            Some(adapter_config),
            None,
        )
        .unwrap();

        let response = relays
            .chat_stream
            .unwrap()
            .create_chat_completion_stream(
                sdkwork_claw_product::ports::ChatCompletionRelayRequest {
                    api_key_id: 101,
                    tenant_id: 10,
                    organization_id: 20,
                    user_id: 30,
                    group_id: 10,
                    group_code: "standard-group".to_owned(),
                    pricing_plan_code: "standard".to_owned(),
                    model: "gpt-4o-mini".to_owned(),
                    provider_code: "openrouter".to_owned(),
                    provider_channel_id: 3001,
                    provider_region_code: "global".to_owned(),
                    provider_model: "gpt-4o-mini".to_owned(),
                    provider_base_url: Some("http://provider.example".to_owned()),
                    provider_secret_ref: None,
                    provider_auth_profile:
                        sdkwork_claw_product::domain::ProviderAuthProfile::bearer(),
                    provider_timeout_ms: None,
                    provider_retry_policy: None,
                    request_body: serde_json::json!({
                        "model": "gpt-4o-mini",
                        "messages": [{"role": "user", "content": "ping"}],
                        "stream": true
                    }),
                },
            )
            .await
            .unwrap();

        assert!(direct_stream_calls.lock().unwrap().is_empty());
        assert_eq!(1, adapter_calls.lock().unwrap().len());
        let body = axum::body::to_bytes(response.body, usize::MAX)
            .await
            .unwrap();
        let body = String::from_utf8(body.to_vec()).unwrap();
        assert!(body.contains("chatcmpl-adapter-stream"));
        assert!(body.contains("data: [DONE]"));

        server.abort();
    }

    #[tokio::test]
    async fn provider_adapter_config_discovers_manifest_from_adapter_service() {
        use axum::extract::State;
        use axum::http::HeaderMap;
        use axum::routing::get;
        use sdkwork_claw_provider_adapter_contract::{
            AdapterEndpointRuntimeState, AdapterInvocationShape, ProviderAdapterEndpointManifest,
            ProviderAdapterManifest, ProviderAdapterProviderManifest,
        };
        use std::sync::Mutex;

        let captured_authorization = Arc::new(Mutex::new(None::<String>));
        let app = Router::new()
            .route(
                "/internal/adapter-manifest",
                get(
                    |State(captured_authorization): State<Arc<Mutex<Option<String>>>>,
                     headers: HeaderMap| async move {
                        *captured_authorization.lock().unwrap() = headers
                            .get(axum::http::header::AUTHORIZATION)
                            .and_then(|value| value.to_str().ok())
                            .map(str::to_owned);
                        axum::Json(ProviderAdapterManifest {
                            providers: vec![ProviderAdapterProviderManifest {
                                package: "tencent-cloud".to_owned(),
                                provider_family: "tencent-cloud".to_owned(),
                                provider_codes: vec!["tencent-cloud".to_owned()],
                                endpoints: vec![ProviderAdapterEndpointManifest {
                                    endpoint_key: "video.start_end2video".to_owned(),
                                    capability: Some("video_generation".to_owned()),
                                    service_group: None,
                                    openapi_operation_id: None,
                                    s3_operation: None,
                                    iaas_operation: None,
                                    request_schema: None,
                                    response_schema: None,
                                    endpoint_styles: Vec::new(),
                                    runtime_state: AdapterEndpointRuntimeState::RuntimeAvailable,
                                    method: "POST".to_owned(),
                                    standard_path_pattern: "/vidu/ent/v2/start-end2video"
                                        .to_owned(),
                                    invocation_shape: AdapterInvocationShape::AsyncTaskStart,
                                }],
                            }],
                        })
                    },
                ),
            )
            .with_state(Arc::clone(&captured_authorization));
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let base_url = format!("http://{}", listener.local_addr().unwrap());
        let server = tokio::spawn(async move {
            axum::serve(listener, app).await.unwrap();
        });
        let runtime_toml = RuntimeTomlConfig::from_toml_str(&format!(
            r#"
[provider_adapter]
adapter_base_url = "{base_url}/"
gateway_token = "adapter-token"
"#
        ))
        .unwrap();

        let adapter_config = provider_adapter_config_from_env_or_runtime_toml(Some(&runtime_toml))
            .await
            .unwrap()
            .unwrap();

        assert_eq!("adapter-token", adapter_config.gateway_token());
        assert_eq!(1, adapter_config.routes().len());
        let route = &adapter_config.routes()[0];
        assert_eq!("tencent-cloud", route.provider_code);
        assert_eq!(base_url, route.adapter_base_url);
        assert_eq!(Some("video.start_end2video"), route.endpoint_key.as_deref());
        assert_eq!(
            Some("Bearer adapter-token".to_owned()),
            captured_authorization.lock().unwrap().clone()
        );

        server.abort();
    }

    #[tokio::test]
    async fn provider_adapter_config_fails_when_explicit_manifest_discovery_fails() {
        use axum::http::StatusCode;
        use axum::routing::get;

        let app = Router::new().route(
            "/internal/adapter-manifest",
            get(|| async { StatusCode::UNAUTHORIZED }),
        );
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let base_url = format!("http://{}", listener.local_addr().unwrap());
        let server = tokio::spawn(async move {
            axum::serve(listener, app).await.unwrap();
        });
        let runtime_toml = RuntimeTomlConfig::from_toml_str(&format!(
            r#"
[provider_adapter]
adapter_base_url = "{base_url}"
gateway_token = "adapter-token"
"#
        ))
        .unwrap();

        let error = provider_adapter_config_from_env_or_runtime_toml(Some(&runtime_toml))
            .await
            .unwrap_err();

        assert!(error.contains("provider adapter manifest discovery failed"));

        server.abort();
    }

    #[tokio::test]
    async fn provider_adapter_config_does_not_discover_without_explicit_base_url() {
        let runtime_toml = RuntimeTomlConfig::from_toml_str(
            r#"
[provider_adapter]
gateway_token = "adapter-token"
"#,
        )
        .unwrap();

        let adapter_config = provider_adapter_config_from_env_or_runtime_toml(Some(&runtime_toml))
            .await
            .unwrap();

        assert!(adapter_config.is_none());
    }

    #[tokio::test]
    async fn provider_adapter_config_discovery_empty_manifest_keeps_adapter_disabled() {
        use axum::routing::get;
        use sdkwork_claw_provider_adapter_contract::ProviderAdapterManifest;

        let app = Router::new().route(
            "/internal/adapter-manifest",
            get(|| async { axum::Json(ProviderAdapterManifest { providers: vec![] }) }),
        );
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let base_url = format!("http://{}", listener.local_addr().unwrap());
        let server = tokio::spawn(async move {
            axum::serve(listener, app).await.unwrap();
        });
        let runtime_toml = RuntimeTomlConfig::from_toml_str(&format!(
            r#"
[provider_adapter]
adapter_base_url = "{base_url}"
gateway_token = "adapter-token"
"#
        ))
        .unwrap();

        let adapter_config = provider_adapter_config_from_env_or_runtime_toml(Some(&runtime_toml))
            .await
            .unwrap();

        assert!(adapter_config.is_none());

        server.abort();
    }

    #[tokio::test]
    async fn provider_adapter_config_wraps_responses_and_embeddings_relays_independently() {
        #[derive(Clone)]
        struct DirectResponsesRelay;

        impl ResponsesRelay for DirectResponsesRelay {
            fn create_response<'a>(
                &'a self,
                _request: sdkwork_claw_product::ports::ResponsesRelayRequest,
            ) -> sdkwork_claw_product::ports::ResponsesRelayFuture<'a> {
                Box::pin(async {
                    Ok(sdkwork_claw_product::ports::ResponsesRelayResponse::json(
                        200,
                        serde_json::json!({"id": "response-direct"}),
                    ))
                })
            }
        }

        #[derive(Clone)]
        struct DirectEmbeddingsRelay;

        impl EmbeddingsRelay for DirectEmbeddingsRelay {
            fn create_embedding<'a>(
                &'a self,
                _request: sdkwork_claw_product::ports::EmbeddingsRelayRequest,
            ) -> sdkwork_claw_product::ports::EmbeddingsRelayFuture<'a> {
                Box::pin(async {
                    Ok(sdkwork_claw_product::ports::EmbeddingsRelayResponse::json(
                        200,
                        serde_json::json!({"object": "list"}),
                    ))
                })
            }
        }

        let adapter_config = sdkwork_claw_config::ProviderAdapterConfig::from_json(
            r#"{
                "routes": [
                    {
                        "providerCode": "tencent-cloud",
                        "adapterKind": "internal_http",
                        "adapterBaseUrl": "http://127.0.0.1:39110",
                        "endpointKey": "openai.responses",
                        "method": "POST",
                        "standardPathPattern": "/v1/responses",
                        "adapterPathTemplate": "/providers/{provider_code}{standard_path}",
                        "status": "enabled",
                        "priority": 10
                    },
                    {
                        "providerCode": "tencent-cloud",
                        "adapterKind": "internal_http",
                        "adapterBaseUrl": "http://127.0.0.1:39110",
                        "endpointKey": "openai.embeddings",
                        "method": "POST",
                        "standardPathPattern": "/v1/embeddings",
                        "adapterPathTemplate": "/providers/{provider_code}{standard_path}",
                        "status": "enabled",
                        "priority": 10
                    }
                ]
            }"#,
            Some("adapter-token".to_owned()),
        )
        .unwrap();
        let relays = apply_provider_adapter_config(
            OpenAiRuntimeRelays {
                chat: None,
                chat_stream: None,
                embeddings: Some(Arc::new(DirectEmbeddingsRelay)),
                responses: Some(Arc::new(DirectResponsesRelay)),
            },
            Some(adapter_config),
            None,
        )
        .unwrap();

        let response = relays
            .responses
            .unwrap()
            .create_response(sdkwork_claw_product::ports::ResponsesRelayRequest {
                api_key_id: 101,
                tenant_id: 10,
                organization_id: 20,
                user_id: 30,
                group_id: 10,
                group_code: "standard-group".to_owned(),
                pricing_plan_code: "standard".to_owned(),
                model: "gpt-4o-mini".to_owned(),
                provider_code: "openrouter".to_owned(),
                provider_channel_id: 3001,
                provider_region_code: "global".to_owned(),
                provider_model: "gpt-4o-mini".to_owned(),
                provider_base_url: Some("http://provider.example".to_owned()),
                provider_secret_ref: Some("vault://providers/openrouter/account/main".to_owned()),
                provider_auth_profile: sdkwork_claw_product::domain::ProviderAuthProfile::bearer(),
                provider_timeout_ms: None,
                provider_retry_policy: None,
                request_body: serde_json::json!({"model": "gpt-4o-mini"}),
            })
            .await
            .unwrap();
        let embedding = relays
            .embeddings
            .unwrap()
            .create_embedding(sdkwork_claw_product::ports::EmbeddingsRelayRequest {
                api_key_id: 101,
                tenant_id: 10,
                organization_id: 20,
                user_id: 30,
                group_id: 10,
                group_code: "standard-group".to_owned(),
                pricing_plan_code: "standard".to_owned(),
                model: "text-embedding-3-small".to_owned(),
                provider_code: "openrouter".to_owned(),
                provider_channel_id: 3001,
                provider_region_code: "global".to_owned(),
                provider_model: "text-embedding-3-small".to_owned(),
                provider_base_url: Some("http://provider.example".to_owned()),
                provider_secret_ref: Some("vault://providers/openrouter/account/main".to_owned()),
                provider_auth_profile: sdkwork_claw_product::domain::ProviderAuthProfile::bearer(),
                provider_timeout_ms: None,
                provider_retry_policy: None,
                request_body: serde_json::json!({"model": "text-embedding-3-small"}),
            })
            .await
            .unwrap();

        assert_eq!("response-direct", response.body["id"]);
        assert_eq!("list", embedding.body["object"]);
    }
}
