use std::sync::Arc;

use axum::Router;
use sdkwork_claw_config::{
    ApiKeySecurityConfig, DatabaseConfig, DatabaseEngine, ProviderRelayConfig,
    ProviderSecretMapConfig, StartupInstallMode,
};
use sdkwork_claw_product::application::{
    ApiKeySecretHasher, UsageSettlementWorker, UsageSettlementWorkerConfig,
};
use sdkwork_claw_product::infrastructure::crypto::HmacSha256ApiKeySecretHasher;
use sdkwork_claw_product::infrastructure::provider::{
    OpenAiCompatibleChatCompletionRelay, OpenAiCompatibleChatCompletionStreamRelay,
    OpenAiCompatibleEmbeddingsRelay, OpenAiCompatibleResponsesRelay, ProviderSecretMapResolver,
    SecretRefOpenAiCompatibleChatCompletionRelay,
    SecretRefOpenAiCompatibleChatCompletionStreamRelay, SecretRefOpenAiCompatibleEmbeddingsRelay,
    SecretRefOpenAiCompatibleResponsesRelay, UpstreamProviderEndpoint,
};
use sdkwork_claw_product::infrastructure::sql::installer::{
    DatabaseInstallError, DatabaseInstaller,
};
use sdkwork_claw_product::infrastructure::sql::postgres::{
    PostgresCatalogLoadError, PostgresGatewayUsageRecorder, PostgresPricingCatalogLoader,
    PostgresUsageSettlementStore,
};
use sdkwork_claw_product::infrastructure::sql::sqlite::{
    SqlCatalogLoadError, SqliteGatewayUsageRecorder, SqlitePricingCatalogLoader,
    SqliteUsageSettlementStore,
};
use sdkwork_claw_product::ports::{
    ChatCompletionRelay, ChatCompletionStreamRelay, EmbeddingsRelay, GatewayUsageRecorder,
    PricingCatalog, ResponsesRelay, UsageSettlementStore,
};
use sqlx::sqlite::{SqliteConnectOptions, SqlitePool, SqlitePoolOptions};
use sqlx::PgPool;
use std::str::FromStr;
use tokio::time::{sleep, Duration};

use crate::router;
use crate::router_with_database_status_and_passthrough_placeholder;

type ApiKeyHasher = Arc<dyn ApiKeySecretHasher + Send + Sync>;
type ChatRelay = Arc<dyn ChatCompletionRelay + Send + Sync>;
type ChatStreamRelay = Arc<dyn ChatCompletionStreamRelay + Send + Sync>;
type EmbeddingRelay = Arc<dyn EmbeddingsRelay + Send + Sync>;
type ResponseRelay = Arc<dyn ResponsesRelay + Send + Sync>;
type UsageRecorder = Arc<dyn GatewayUsageRecorder + Send + Sync>;
type SettlementStore = Arc<dyn UsageSettlementStore + Send + Sync>;

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
        None,
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
        None,
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
        None,
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
        None,
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
        None,
        None,
    )
}

fn router_with_openai_runtime_routes<C>(
    base_router: Router,
    catalog: Arc<C>,
    api_key_hasher: ApiKeyHasher,
    relays: OpenAiRuntimeRelays,
    usage_recorder: Option<UsageRecorder>,
    provider_passthrough_config: Option<ProviderRelayConfig>,
    provider_secret_resolver: Option<Arc<ProviderSecretMapResolver>>,
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
                sdkwork_claw_product::api::openai_chat_completions_router_with_relays_and_usage_recorder(
                    Arc::clone(&catalog),
                    Arc::clone(&api_key_hasher),
                    relay,
                    stream_relay,
                    usage_recorder,
                )
            } else {
                sdkwork_claw_product::api::openai_chat_completions_router_with_relays(
                    Arc::clone(&catalog),
                    Arc::clone(&api_key_hasher),
                    relay,
                    stream_relay,
                )
            }
        }
        (Some(relay), None) => {
            if let Some(usage_recorder) = usage_recorder.clone() {
                sdkwork_claw_product::api::openai_chat_completions_router_with_relay_and_usage_recorder(
                    Arc::clone(&catalog),
                    Arc::clone(&api_key_hasher),
                    relay,
                    usage_recorder,
                )
            } else {
                sdkwork_claw_product::api::openai_chat_completions_router_with_relay(
                    Arc::clone(&catalog),
                    Arc::clone(&api_key_hasher),
                    relay,
                )
            }
        }
        (None, Some(stream_relay)) => {
            sdkwork_claw_product::api::openai_chat_completions_router_with_streaming_relay(
                Arc::clone(&catalog),
                Arc::clone(&api_key_hasher),
                stream_relay,
            )
        }
        (None, None) => sdkwork_claw_product::api::openai_chat_completions_router(
            Arc::clone(&catalog),
            Arc::clone(&api_key_hasher),
        ),
    };
    let responses_router = match relays.responses {
        Some(relay) => sdkwork_claw_product::api::openai_responses_router_with_relay(
            Arc::clone(&catalog),
            Arc::clone(&api_key_hasher),
            relay,
        ),
        None => sdkwork_claw_product::api::openai_responses_router(
            Arc::clone(&catalog),
            Arc::clone(&api_key_hasher),
        ),
    };
    let embeddings_router = match relays.embeddings {
        Some(relay) => sdkwork_claw_product::api::openai_embeddings_router_with_relay(
            Arc::clone(&catalog),
            Arc::clone(&api_key_hasher),
            relay,
        ),
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

    let router = if let Some(secret_resolver) = provider_secret_resolver.clone() {
        router.merge(crate::passthrough::route_scoped_openai_passthrough_router(
            Arc::clone(&catalog),
            Arc::clone(&api_key_hasher),
            secret_resolver,
        ))
    } else {
        router
    };

    if let Some(config) = provider_passthrough_config {
        if has_route_scoped_openai_passthrough {
            router.merge(
                crate::passthrough::authenticated_provider_native_passthrough_router(
                    config,
                    catalog,
                    api_key_hasher,
                ),
            )
        } else {
            router.merge(
                crate::passthrough::authenticated_gateway_passthrough_router(
                    config,
                    catalog,
                    api_key_hasher,
                ),
            )
        }
    } else {
        router
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

async fn router_with_database_api_key_provider_configs_usage_settlement_worker_config_and_startup_install_mode(
    config: DatabaseConfig,
    api_key_config: Option<ApiKeySecurityConfig>,
    provider_relay_config: Option<ProviderRelayConfig>,
    provider_secret_map_config: Option<ProviderSecretMapConfig>,
    usage_settlement_worker_config: UsageSettlementWorkerConfig,
    startup_install_mode: StartupInstallMode,
) -> Result<Router, GatewayRouterError> {
    let api_key_hasher = build_api_key_hasher(api_key_config)?;
    let provider_passthrough_config = provider_relay_config.clone();
    let provider_secret_resolver = provider_secret_map_config
        .map(|config| Arc::new(ProviderSecretMapResolver::from_config(config)));
    let relays =
        build_openai_runtime_relays(provider_relay_config, provider_secret_resolver.clone())?;
    match config.engine {
        DatabaseEngine::Sqlite => {
            let sqlite_options = SqliteConnectOptions::from_str(config.url.as_str())
                .map_err(|error| GatewayRouterError::Sqlite(SqlCatalogLoadError::Database(error)))?
                .create_if_missing(true);
            let pool = SqlitePoolOptions::new()
                .max_connections(config.max_connections)
                .connect_with(sqlite_options)
                .await
                .map_err(|error| {
                    GatewayRouterError::Sqlite(SqlCatalogLoadError::Database(error))
                })?;
            if startup_install_mode.should_ensure() {
                DatabaseInstaller::for_sqlite(pool.clone())
                    .with_env_options()?
                    .ensure_installed()
                    .await?;
            }
            let snapshot = SqlitePricingCatalogLoader::new(pool.clone())
                .load_snapshot()
                .await?;
            let usage_recorder: UsageRecorder =
                Arc::new(SqliteGatewayUsageRecorder::new(pool.clone()));
            maybe_spawn_sqlite_usage_settlement_worker(&pool, usage_settlement_worker_config)
                .await?;
            Ok(router_with_openai_runtime_routes(
                router_with_database_status_and_passthrough_placeholder(
                    Some(&config),
                    provider_passthrough_config.is_none() && provider_secret_resolver.is_none(),
                ),
                Arc::new(snapshot),
                api_key_hasher,
                relays,
                Some(usage_recorder),
                provider_passthrough_config,
                provider_secret_resolver.clone(),
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
                DatabaseInstaller::for_postgres(pool.clone())
                    .with_env_options()?
                    .ensure_installed()
                    .await?;
            }
            let snapshot = PostgresPricingCatalogLoader::new(pool.clone())
                .load_snapshot()
                .await?;
            let usage_recorder: UsageRecorder =
                Arc::new(PostgresGatewayUsageRecorder::new(pool.clone()));
            maybe_spawn_postgres_usage_settlement_worker(&pool, usage_settlement_worker_config)
                .await?;
            Ok(router_with_openai_runtime_routes(
                router_with_database_status_and_passthrough_placeholder(
                    Some(&config),
                    provider_passthrough_config.is_none() && provider_secret_resolver.is_none(),
                ),
                Arc::new(snapshot),
                api_key_hasher,
                relays,
                Some(usage_recorder),
                provider_passthrough_config,
                provider_secret_resolver.clone(),
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
    let config = DatabaseConfig::from_env().map_err(GatewayRouterError::Config)?;
    let api_key_config = ApiKeySecurityConfig::from_env().map_err(GatewayRouterError::Config)?;
    let provider_relay_config =
        ProviderRelayConfig::from_env().map_err(GatewayRouterError::Config)?;
    let provider_secret_map_config =
        ProviderSecretMapConfig::from_env().map_err(GatewayRouterError::Config)?;
    let usage_settlement_worker_config =
        usage_settlement_worker_config_from_env().map_err(GatewayRouterError::Config)?;
    let startup_install_mode =
        StartupInstallMode::from_env().map_err(GatewayRouterError::Config)?;
    match config {
        Some(config) => {
            router_with_database_api_key_provider_configs_usage_settlement_worker_config_and_startup_install_mode(
                config,
                api_key_config,
                provider_relay_config,
                provider_secret_map_config,
                usage_settlement_worker_config,
                startup_install_mode,
            )
            .await
        }
        None => Ok(router()),
    }
}

async fn maybe_spawn_sqlite_usage_settlement_worker(
    pool: &SqlitePool,
    config: UsageSettlementWorkerConfig,
) -> Result<(), GatewayRouterError> {
    let config = config.normalized();
    if !config.enabled {
        return Ok(());
    }
    if !sqlite_usage_settlement_schema_ready(pool)
        .await
        .map_err(|error| GatewayRouterError::Sqlite(SqlCatalogLoadError::Database(error)))?
    {
        tracing::warn!(
            "usage settlement worker is enabled but SQLite settlement schema is incomplete"
        );
        return Ok(());
    }
    let store: SettlementStore = Arc::new(SqliteUsageSettlementStore::new(pool.clone()));
    spawn_usage_settlement_worker(store, config);
    Ok(())
}

async fn maybe_spawn_postgres_usage_settlement_worker(
    pool: &PgPool,
    config: UsageSettlementWorkerConfig,
) -> Result<(), GatewayRouterError> {
    let config = config.normalized();
    if !config.enabled {
        return Ok(());
    }
    if !postgres_usage_settlement_schema_ready(pool)
        .await
        .map_err(|error| GatewayRouterError::Postgres(PostgresCatalogLoadError::Database(error)))?
    {
        tracing::warn!(
            "usage settlement worker is enabled but Postgres settlement schema is incomplete"
        );
        return Ok(());
    }
    let store: SettlementStore = Arc::new(PostgresUsageSettlementStore::new(pool.clone()));
    spawn_usage_settlement_worker(store, config);
    Ok(())
}

fn spawn_usage_settlement_worker(
    store: SettlementStore,
    config: UsageSettlementWorkerConfig,
) -> tokio::task::JoinHandle<()> {
    let worker = UsageSettlementWorker::new(store, config);
    let interval = Duration::from_millis(worker.config().interval_millis);
    tokio::spawn(async move {
        loop {
            if let Err(error) = worker.run_once().await {
                tracing::warn!(error = %error, "usage settlement worker run failed");
            }
            sleep(interval).await;
        }
    })
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
              'plus_account',
              'plus_account_history'
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
              'plus_account',
              'plus_account_history'
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

fn usage_settlement_worker_config_from_env() -> Result<UsageSettlementWorkerConfig, String> {
    const ENABLED: &str = "SDKWORK_CLAW_USAGE_SETTLEMENT_WORKER_ENABLED";
    const TENANT_ID: &str = "SDKWORK_CLAW_USAGE_SETTLEMENT_TENANT_ID";
    const ORGANIZATION_ID: &str = "SDKWORK_CLAW_USAGE_SETTLEMENT_ORGANIZATION_ID";
    const BATCH_SIZE: &str = "SDKWORK_CLAW_USAGE_SETTLEMENT_BATCH_SIZE";
    const INTERVAL_MILLIS: &str = "SDKWORK_CLAW_USAGE_SETTLEMENT_INTERVAL_MILLIS";

    let defaults = UsageSettlementWorkerConfig::default();
    Ok(UsageSettlementWorkerConfig {
        enabled: parse_optional_bool_env(ENABLED)?.unwrap_or(defaults.enabled),
        tenant_id: parse_non_negative_i64_env(TENANT_ID, defaults.tenant_id)?,
        organization_id: parse_non_negative_i64_env(ORGANIZATION_ID, defaults.organization_id)?,
        batch_size: parse_positive_i64_env(BATCH_SIZE, defaults.batch_size)?,
        interval_millis: parse_positive_u64_env(INTERVAL_MILLIS, defaults.interval_millis)?,
    })
}

fn parse_optional_bool_env(name: &str) -> Result<Option<bool>, String> {
    let Some(value) = std::env::var(name).ok() else {
        return Ok(None);
    };
    let normalized = value.trim().to_ascii_lowercase();
    match normalized.as_str() {
        "1" | "true" | "yes" | "on" => Ok(Some(true)),
        "0" | "false" | "no" | "off" => Ok(Some(false)),
        _ => Err(format!("{name} must be a boolean value")),
    }
}

fn parse_non_negative_i64_env(name: &str, default: i64) -> Result<i64, String> {
    let Some(value) = std::env::var(name).ok() else {
        return Ok(default);
    };
    let parsed = value
        .trim()
        .parse::<i64>()
        .map_err(|_| format!("{name} must be a non-negative integer"))?;
    if parsed < 0 {
        return Err(format!("{name} must be a non-negative integer"));
    }
    Ok(parsed)
}

fn parse_positive_i64_env(name: &str, default: i64) -> Result<i64, String> {
    let Some(value) = std::env::var(name).ok() else {
        return Ok(default);
    };
    let parsed = value
        .trim()
        .parse::<i64>()
        .map_err(|_| format!("{name} must be a positive integer"))?;
    if parsed <= 0 {
        return Err(format!("{name} must be a positive integer"));
    }
    Ok(parsed)
}

fn parse_positive_u64_env(name: &str, default: u64) -> Result<u64, String> {
    let Some(value) = std::env::var(name).ok() else {
        return Ok(default);
    };
    let parsed = value
        .trim()
        .parse::<u64>()
        .map_err(|_| format!("{name} must be a positive integer"))?;
    if parsed == 0 {
        return Err(format!("{name} must be a positive integer"));
    }
    Ok(parsed)
}

fn build_api_key_hasher(
    config: Option<ApiKeySecurityConfig>,
) -> Result<ApiKeyHasher, GatewayRouterError> {
    let Some(config) = config else {
        return Err(GatewayRouterError::Config(
            "SDKWORK_CLAW_API_KEY_PEPPER is required for OpenAI runtime routes".to_owned(),
        ));
    };
    let hasher = HmacSha256ApiKeySecretHasher::new(config.pepper_secret())
        .map_err(|error| GatewayRouterError::Config(error.to_string()))?;
    Ok(Arc::new(hasher))
}

fn build_openai_runtime_relays(
    config: Option<ProviderRelayConfig>,
    provider_secret_resolver: Option<Arc<ProviderSecretMapResolver>>,
) -> Result<OpenAiRuntimeRelays, GatewayRouterError> {
    if let Some(resolver) = provider_secret_resolver {
        return Ok(OpenAiRuntimeRelays {
            chat: Some(Arc::new(SecretRefOpenAiCompatibleChatCompletionRelay::new(
                resolver.clone(),
            ))),
            chat_stream: Some(Arc::new(
                SecretRefOpenAiCompatibleChatCompletionStreamRelay::new(resolver.clone()),
            )),
            embeddings: Some(Arc::new(SecretRefOpenAiCompatibleEmbeddingsRelay::new(
                resolver.clone(),
            ))),
            responses: Some(Arc::new(SecretRefOpenAiCompatibleResponsesRelay::new(
                resolver,
            ))),
        });
    }

    let Some(config) = config else {
        return Ok(OpenAiRuntimeRelays::default());
    };
    let Some(openai_relay) = config.openai_relay() else {
        return Ok(OpenAiRuntimeRelays::default());
    };
    let endpoint = UpstreamProviderEndpoint::new(
        openai_relay.base_url().to_owned(),
        openai_relay.bearer_token().to_owned(),
    )
    .map_err(|error| GatewayRouterError::Config(error.to_string()))?;
    Ok(OpenAiRuntimeRelays {
        chat: Some(Arc::new(OpenAiCompatibleChatCompletionRelay::new(
            endpoint.clone(),
        ))),
        chat_stream: Some(Arc::new(OpenAiCompatibleChatCompletionStreamRelay::new(
            endpoint.clone(),
        ))),
        embeddings: Some(Arc::new(OpenAiCompatibleEmbeddingsRelay::new(
            endpoint.clone(),
        ))),
        responses: Some(Arc::new(OpenAiCompatibleResponsesRelay::new(endpoint))),
    })
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
