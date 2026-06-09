use crate::gateway_api_key_auth::authenticate_gateway_api_key;
use crate::openai_passthrough_payload;
use crate::openai_passthrough_routes::{
    apply_openai_passthrough_routes, apply_stored_chat_completion_passthrough_routes,
};
use crate::openai_route_taxonomy::classify_openai_route;
use crate::provider_account_auth::render_provider_account_auth;
use crate::provider_passthrough_transport::{
    build_provider_passthrough_client, forward_provider_passthrough_to_target, PassthroughClient,
    ProviderPassthroughTarget,
};
use crate::request_identity::generate_server_request_id;
use axum::body::{to_bytes, Body};
use axum::extract::{Request, State};
use axum::http::request::Parts as RequestParts;
use axum::http::{header::USER_AGENT, HeaderMap, Method, StatusCode, Uri};
use axum::response::{IntoResponse, Response};
use axum::routing::{delete, MethodRouter};
use axum::{Json, Router};
use bytes::Bytes;
use http_body_util::BodyExt;
#[cfg(test)]
use sdkwork_claw_config::ProviderPassthroughAuth;
use sdkwork_claw_product::api::{
    normalize_user_agent_header, OpenAiInvocationContext, OpenAiInvocationEndpoint,
    OpenAiInvocationRelayOutcome, OpenAiProviderRoute, OpenAiUsageRecorder,
};
use sdkwork_claw_product::application::{
    ApiKeySecretHasher, AuthenticatedApiKeyContext, PricingResolver, ProviderRouteSelectionError,
    ProviderRouteSelectionErrorKind, ProviderRouteSelector, ResolveModelPriceQuery,
    SelectProviderChannelRouteQuery, SelectProviderRouteQuery, SelectedProviderChannelRoute,
    SelectedProviderRoute,
};
use sdkwork_claw_product::domain::{
    provider_native_model_id, AiModel, AiRouteFailureStrategy, AiRouteModelRequirement,
    AiRouteStrategy, BillingMeter, DecimalValue, DomainError, DomainResult, ModelMappingRule,
    ModelProviderRoute, ProviderAuthProfile, ProviderChannelRoute, ProviderRetryPolicy,
    ResolveModelMappingContext, RoutingCapability,
};
use sdkwork_claw_product::ports::{
    GatewayUsageQuantity, GatewayUsageRecordCommand, GatewayUsageRecorder, PricingCatalog,
    ProviderSecretResolver, StickyObjectRouteBinding as ProductStickyObjectRouteBinding,
    StickyObjectRouteLookup as ProductStickyObjectRouteLookup,
    StickyObjectRouteUpsert as ProductStickyObjectRouteUpsert, StickyRouteStore,
    StickyRouteStoreFuture,
};
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use sqlx::Row;
use std::sync::Arc;
use std::time::Instant;

type UsageRecorder = Arc<dyn GatewayUsageRecorder + Send + Sync>;

const MAX_ROUTE_SCOPED_USAGE_RESPONSE_BODY_BYTES: usize = 16 * 1024 * 1024;
const ROUTE_SCOPED_USAGE_TYPE_BASE: i64 = 20_000;
const TOKEN_BILLING_UNIT_SIZE_DECIMAL: &str = "1000000";
const USAGE_AMOUNT_DECIMAL_DIGITS: u32 = 12;
const MODALITY_IMAGE: i64 = 2;

#[derive(Clone)]
struct RouteScopedOpenAiPassthroughRuntime {
    client: PassthroughClient,
    secret_resolver: Arc<dyn ProviderSecretResolver + Send + Sync>,
}

struct RouteScopedOpenAiPassthroughState<C> {
    runtime: RouteScopedOpenAiPassthroughRuntime,
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    usage_recorder: Option<UsageRecorder>,
    sticky_store: Option<StickyObjectRouteStore>,
}

impl<C> Clone for RouteScopedOpenAiPassthroughState<C> {
    fn clone(&self) -> Self {
        Self {
            runtime: self.runtime.clone(),
            catalog: Arc::clone(&self.catalog),
            api_key_hasher: Arc::clone(&self.api_key_hasher),
            usage_recorder: self.usage_recorder.clone(),
            sticky_store: self.sticky_store.clone(),
        }
    }
}

#[derive(Clone)]
pub(crate) enum StickyObjectRouteStore {
    Sqlite(sqlx::SqlitePool),
    Postgres(sqlx::PgPool),
}

impl StickyObjectRouteStore {
    pub(crate) fn sqlite(pool: sqlx::SqlitePool) -> Self {
        Self::Sqlite(pool)
    }

    pub(crate) fn postgres(pool: sqlx::PgPool) -> Self {
        Self::Postgres(pool)
    }
}

impl std::fmt::Debug for StickyObjectRouteStore {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Sqlite(_) => formatter.write_str("StickyObjectRouteStore::Sqlite"),
            Self::Postgres(_) => formatter.write_str("StickyObjectRouteStore::Postgres"),
        }
    }
}

impl StickyRouteStore for StickyObjectRouteStore {
    fn find_binding<'a>(
        &'a self,
        query: ProductStickyObjectRouteLookup,
    ) -> StickyRouteStoreFuture<'a, Option<ProductStickyObjectRouteBinding>> {
        Box::pin(async move {
            let object_key_hash = sticky_object_key_hash(
                query.tenant_id,
                query.organization_id,
                &query.object_type,
                &query.object_id,
            );
            let binding = match self {
                StickyObjectRouteStore::Sqlite(pool) => sqlx::query(
                    r#"
                    SELECT tenant_id, organization_id, object_type, object_id,
                           parent_object_type, parent_object_id, provider_code, channel_id,
                           channel_group_id, vendor_code, api_code, catalog_key,
                           provider_model, region_code, sticky_scope
                    FROM ai_provider_object_route
                    WHERE tenant_id = ?
                      AND organization_id = ?
                      AND object_type = ?
                      AND object_id = ?
                      AND object_key_hash = ?
                      AND status = 1
                    ORDER BY id DESC
                    LIMIT 1
                    "#,
                )
                .bind(query.tenant_id)
                .bind(query.organization_id)
                .bind(&query.object_type)
                .bind(&query.object_id)
                .bind(object_key_hash)
                .fetch_optional(pool)
                .await
                .map_err(product_sticky_store_error)?
                .map(product_sticky_binding_from_row),
                StickyObjectRouteStore::Postgres(pool) => sqlx::query(
                    r#"
                    SELECT tenant_id, organization_id, object_type, object_id,
                           parent_object_type, parent_object_id, provider_code, channel_id,
                           channel_group_id, vendor_code, api_code, catalog_key,
                           provider_model, region_code, sticky_scope
                    FROM ai_provider_object_route
                    WHERE tenant_id = $1
                      AND organization_id = $2
                      AND object_type = $3
                      AND object_id = $4
                      AND object_key_hash = $5
                      AND status = 1
                    ORDER BY id DESC
                    LIMIT 1
                    "#,
                )
                .bind(query.tenant_id)
                .bind(query.organization_id)
                .bind(&query.object_type)
                .bind(&query.object_id)
                .bind(object_key_hash)
                .fetch_optional(pool)
                .await
                .map_err(product_sticky_store_error)?
                .map(product_sticky_binding_from_pg_row),
            };
            Ok(binding)
        })
    }

    fn upsert_binding<'a>(
        &'a self,
        command: ProductStickyObjectRouteUpsert,
    ) -> StickyRouteStoreFuture<'a, ()> {
        Box::pin(async move {
            let object_key_hash = sticky_object_key_hash(
                command.tenant_id,
                command.organization_id,
                &command.object_type,
                &command.object_id,
            );
            match self {
                StickyObjectRouteStore::Sqlite(pool) => {
                    sqlx::query(
                        r#"
                        INSERT INTO ai_provider_object_route
                            (uuid, tenant_id, organization_id, status, api_key_id, channel_group_id,
                             object_type, object_id, object_key_hash, parent_object_type,
                             parent_object_id, provider_code, channel_id, vendor_code, api_code,
                             catalog_key, provider_model, region_code, sticky_scope, last_seen_at)
                        VALUES
                            (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                        ON CONFLICT(tenant_id, organization_id, object_type, object_id)
                        DO UPDATE SET
                            status = 1,
                            api_key_id = excluded.api_key_id,
                            channel_group_id = excluded.channel_group_id,
                            object_key_hash = excluded.object_key_hash,
                            parent_object_type = excluded.parent_object_type,
                            parent_object_id = excluded.parent_object_id,
                            provider_code = excluded.provider_code,
                            channel_id = excluded.channel_id,
                            vendor_code = excluded.vendor_code,
                            api_code = excluded.api_code,
                            catalog_key = excluded.catalog_key,
                            provider_model = excluded.provider_model,
                            region_code = excluded.region_code,
                            sticky_scope = excluded.sticky_scope,
                            last_seen_at = CURRENT_TIMESTAMP,
                            updated_at = CURRENT_TIMESTAMP,
                            version = ai_provider_object_route.version + 1
                        "#,
                    )
                    .bind(&command.request_id)
                    .bind(command.tenant_id)
                    .bind(command.organization_id)
                    .bind(command.api_key_id)
                    .bind(command.channel_group_id)
                    .bind(&command.object_type)
                    .bind(&command.object_id)
                    .bind(&object_key_hash)
                    .bind(&command.parent_object_type)
                    .bind(&command.parent_object_id)
                    .bind(&command.provider_code)
                    .bind(command.channel_id)
                    .bind(&command.vendor_code)
                    .bind(&command.api_code)
                    .bind(&command.catalog_key)
                    .bind(&command.provider_model)
                    .bind(&command.region_code)
                    .bind(&command.sticky_scope)
                    .execute(pool)
                    .await
                    .map_err(product_sticky_store_error)?;
                }
                StickyObjectRouteStore::Postgres(pool) => {
                    sqlx::query(
                        r#"
                        INSERT INTO ai_provider_object_route
                            (uuid, tenant_id, organization_id, status, api_key_id, channel_group_id,
                             object_type, object_id, object_key_hash, parent_object_type,
                             parent_object_id, provider_code, channel_id, vendor_code, api_code,
                             catalog_key, provider_model, region_code, sticky_scope, last_seen_at)
                        VALUES
                            ($1, $2, $3, 1, $4, $5, $6, $7, $8, $9, $10,
                             $11, $12, $13, $14, $15, $16, $17, $18, CURRENT_TIMESTAMP)
                        ON CONFLICT(tenant_id, organization_id, object_type, object_id)
                        DO UPDATE SET
                            status = 1,
                            api_key_id = EXCLUDED.api_key_id,
                            channel_group_id = EXCLUDED.channel_group_id,
                            object_key_hash = EXCLUDED.object_key_hash,
                            parent_object_type = EXCLUDED.parent_object_type,
                            parent_object_id = EXCLUDED.parent_object_id,
                            provider_code = EXCLUDED.provider_code,
                            channel_id = EXCLUDED.channel_id,
                            vendor_code = EXCLUDED.vendor_code,
                            api_code = EXCLUDED.api_code,
                            catalog_key = EXCLUDED.catalog_key,
                            provider_model = EXCLUDED.provider_model,
                            region_code = EXCLUDED.region_code,
                            sticky_scope = EXCLUDED.sticky_scope,
                            last_seen_at = CURRENT_TIMESTAMP,
                            updated_at = CURRENT_TIMESTAMP,
                            version = ai_provider_object_route.version + 1
                        "#,
                    )
                    .bind(&command.request_id)
                    .bind(command.tenant_id)
                    .bind(command.organization_id)
                    .bind(command.api_key_id)
                    .bind(command.channel_group_id)
                    .bind(&command.object_type)
                    .bind(&command.object_id)
                    .bind(&object_key_hash)
                    .bind(&command.parent_object_type)
                    .bind(&command.parent_object_id)
                    .bind(&command.provider_code)
                    .bind(command.channel_id)
                    .bind(&command.vendor_code)
                    .bind(&command.api_code)
                    .bind(&command.catalog_key)
                    .bind(&command.provider_model)
                    .bind(&command.region_code)
                    .bind(&command.sticky_scope)
                    .execute(pool)
                    .await
                    .map_err(product_sticky_store_error)?;
                }
            }
            Ok(())
        })
    }
}

pub(crate) fn router<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    secret_resolver: Arc<dyn ProviderSecretResolver + Send + Sync>,
    usage_recorder: Option<UsageRecorder>,
    sticky_store: Option<StickyObjectRouteStore>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let state = RouteScopedOpenAiPassthroughState {
        runtime: RouteScopedOpenAiPassthroughRuntime::new(secret_resolver),
        catalog,
        api_key_hasher,
        usage_recorder,
        sticky_store,
    };
    router_with_state(state)
}

fn router_with_state<C>(state: RouteScopedOpenAiPassthroughState<C>) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let router = apply_openai_passthrough_routes(
        Router::new(),
        MethodRouter::new().fallback(forward_openai_passthrough::<C>),
    )
    .route(
        "/v1/models/{model}",
        delete(forward_openai_passthrough::<C>),
    );
    apply_stored_chat_completion_passthrough_routes(
        router,
        MethodRouter::new().fallback(forward_openai_passthrough::<C>),
    )
    .with_state(state)
}

async fn forward_openai_passthrough<C>(
    State(state): State<RouteScopedOpenAiPassthroughState<C>>,
    headers: HeaderMap,
    uri: Uri,
    request: Request,
) -> Response
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let context = match authenticate_api_key(&state, &headers, &uri) {
        Ok(context) => context,
        Err(response) => return response,
    };
    match state
        .runtime
        .forward_openai(
            Arc::clone(&state.catalog),
            state.usage_recorder.clone(),
            state.sticky_store.clone(),
            context,
            request,
        )
        .await
    {
        Ok(response) => response,
        Err(error) => error.into_response(),
    }
}

fn authenticate_api_key<C>(
    state: &RouteScopedOpenAiPassthroughState<C>,
    headers: &HeaderMap,
    uri: &Uri,
) -> Result<AuthenticatedApiKeyContext, Response>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    authenticate_gateway_api_key(
        state.catalog.as_ref(),
        state.api_key_hasher.as_ref(),
        headers,
        uri,
    )
}

#[derive(Debug)]
struct RouteScopedOpenAiPassthroughIntent {
    requested_model: Option<String>,
    requested_model_source: Option<openai_passthrough_payload::OpenAiPassthroughModelSource>,
    request_path: String,
    route_key: String,
    api_code: String,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
    route_strategy: AiRouteStrategy,
    failure_strategy: AiRouteFailureStrategy,
    model_requirement: AiRouteModelRequirement,
    sticky_object_type: Option<&'static str>,
    sticky_scope: Option<&'static str>,
    routes_model_when_present: bool,
}

#[derive(Debug, Clone)]
struct RouteScopedMeteredUsageContext {
    api_key_context: AuthenticatedApiKeyContext,
    request_id: Option<String>,
    trace_id: Option<String>,
    requested_model: String,
    request_body: Value,
    request_path: String,
    http_method: String,
    user_agent: Option<String>,
    billing_meter: BillingMeter,
}

#[derive(Debug, Clone)]
struct RouteScopedApiRequestUsageContext {
    api_key_context: AuthenticatedApiKeyContext,
    request_id: String,
    trace_id: Option<String>,
    requested_model: String,
    request_path: String,
    http_method: String,
    user_agent: Option<String>,
    route_key: String,
    api_code: String,
}

#[derive(Debug, Clone)]
struct RouteScopedStickyRecordContext {
    api_key_context: AuthenticatedApiKeyContext,
    route_strategy: AiRouteStrategy,
    object_type: String,
    sticky_scope: String,
    request_object_id: Option<String>,
    api_code: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct StickyObjectRouteBinding {
    object_type: String,
    object_id: String,
    parent_object_type: Option<String>,
    parent_object_id: Option<String>,
    provider_code: String,
    channel_id: i64,
    channel_group_id: Option<i64>,
    vendor_code: Option<String>,
    api_code: Option<String>,
    catalog_key: Option<String>,
    provider_model: Option<String>,
    region_code: Option<String>,
    sticky_scope: Option<String>,
}

#[derive(Debug, Clone)]
struct StickyObjectRouteUpsert {
    uuid: String,
    tenant_id: i64,
    organization_id: i64,
    api_key_id: i64,
    channel_group_id: i64,
    object_type: String,
    object_id: String,
    object_key_hash: String,
    parent_object_type: Option<String>,
    parent_object_id: Option<String>,
    provider_code: String,
    channel_id: i64,
    vendor_code: Option<String>,
    api_code: String,
    catalog_key: String,
    provider_model: String,
    region_code: Option<String>,
    sticky_scope: String,
}

#[derive(Debug)]
struct RouteScopedOpenAiPassthroughError {
    status: StatusCode,
    code: &'static str,
    error_type: &'static str,
    message: String,
}

impl RouteScopedOpenAiPassthroughError {
    fn invalid_request(message: impl ToString) -> Self {
        Self {
            status: StatusCode::BAD_REQUEST,
            code: "invalid_request",
            error_type: "invalid_request_error",
            message: message.to_string(),
        }
    }

    fn model_not_found(model: &str) -> Self {
        Self {
            status: StatusCode::NOT_FOUND,
            code: "model_not_found",
            error_type: "invalid_request_error",
            message: format!("model is not available: {model}"),
        }
    }

    fn ambiguous_model(model: &str, matches: &[AiModel]) -> Self {
        Self {
            status: StatusCode::BAD_REQUEST,
            code: "ambiguous_model",
            error_type: "invalid_request_error",
            message: format!(
                "model id is ambiguous: {model}. Use one of these catalog keys: {}",
                matches
                    .iter()
                    .map(|candidate| candidate.catalog_key.as_str())
                    .collect::<Vec<_>>()
                    .join(", ")
            ),
        }
    }

    fn provider_route_unavailable(message: impl ToString) -> Self {
        Self {
            status: StatusCode::SERVICE_UNAVAILABLE,
            code: "provider_route_not_available",
            error_type: "server_error",
            message: message.to_string(),
        }
    }

    fn pricing_unavailable(message: impl ToString) -> Self {
        Self {
            status: StatusCode::BAD_REQUEST,
            code: "pricing_unavailable",
            error_type: "invalid_request_error",
            message: message.to_string(),
        }
    }

    fn relay_failed(message: impl ToString) -> Self {
        Self {
            status: StatusCode::BAD_GATEWAY,
            code: "openai_passthrough_relay_failed",
            error_type: "server_error",
            message: message.to_string(),
        }
    }

    fn usage_record_failed(message: impl ToString) -> Self {
        Self {
            status: StatusCode::BAD_GATEWAY,
            code: "provider_usage_record_failed",
            error_type: "server_error",
            message: message.to_string(),
        }
    }

    fn internal_config(code: &'static str, message: impl ToString) -> Self {
        Self {
            status: StatusCode::INTERNAL_SERVER_ERROR,
            code,
            error_type: "server_error",
            message: message.to_string(),
        }
    }

    fn into_response(self) -> Response {
        (
            self.status,
            Json(json!({
                "error": {
                    "message": self.message,
                    "type": self.error_type,
                    "param": null,
                    "code": self.code
                }
            })),
        )
            .into_response()
    }
}

impl From<ProviderRouteSelectionError> for RouteScopedOpenAiPassthroughError {
    fn from(value: ProviderRouteSelectionError) -> Self {
        let message = value.to_string();
        match value.kind() {
            ProviderRouteSelectionErrorKind::ProviderRouteUnavailable => {
                Self::provider_route_unavailable(message)
            }
            ProviderRouteSelectionErrorKind::PricingUnavailable => {
                Self::pricing_unavailable(message)
            }
        }
    }
}

impl RouteScopedOpenAiPassthroughRuntime {
    fn new(secret_resolver: Arc<dyn ProviderSecretResolver + Send + Sync>) -> Self {
        Self {
            client: build_provider_passthrough_client(),
            secret_resolver,
        }
    }

    async fn forward_openai<C>(
        &self,
        catalog: Arc<C>,
        usage_recorder: Option<UsageRecorder>,
        sticky_store: Option<StickyObjectRouteStore>,
        context: AuthenticatedApiKeyContext,
        request: Request,
    ) -> Result<Response, RouteScopedOpenAiPassthroughError>
    where
        C: PricingCatalog + Send + Sync + 'static,
    {
        let (parts, body) = request.into_parts();
        let body = body
            .collect()
            .await
            .map_err(|error| {
                RouteScopedOpenAiPassthroughError::relay_failed(format!(
                    "failed to read OpenAI-compatible passthrough body: {error}"
                ))
            })?
            .to_bytes();
        let intent = route_scoped_openai_passthrough_intent(&parts, &body)?;
        let target_plan = select_route_scoped_openai_passthrough_target_plan_with_sticky(
            catalog.as_ref(),
            context.clone(),
            &intent,
            sticky_store.as_ref(),
        )
        .await?;
        let token_usage_context =
            build_route_scoped_openai_usage_context(&parts, &body, &context, &intent)?;
        let metered_usage_context =
            build_route_scoped_metered_usage_context(&parts, &body, &context, &intent)?;
        let api_request_usage_context =
            build_route_scoped_api_request_usage_context(&parts, &context, &intent);
        let target_count = target_plan.targets.len();
        let failure_strategy = target_plan.failure_strategy;
        let mut last_error = None;
        for (index, route) in target_plan.targets.into_iter().enumerate() {
            let is_last_route = index + 1 == target_count;
            match self
                .forward_openai_to_target(&parts, body.clone(), &intent, route)
                .await
            {
                Ok((route, response, latency_ms)) => {
                    if route_scoped_should_try_next_response(
                        &route,
                        &response,
                        failure_strategy,
                        is_last_route,
                    ) {
                        continue;
                    }
                    return record_route_scoped_openai_usage_if_needed(
                        catalog,
                        usage_recorder,
                        token_usage_context,
                        metered_usage_context,
                        api_request_usage_context,
                        sticky_store.clone(),
                        route_scoped_sticky_record_context(&context, &intent, &parts),
                        route.usage_route.clone(),
                        route.channel_usage_route.clone(),
                        response,
                        latency_ms,
                    )
                    .await;
                }
                Err(error) if failure_strategy.should_try_next_route(is_last_route) => {
                    last_error = Some(error);
                }
                Err(error) => return Err(error),
            }
        }

        Err(last_error.unwrap_or_else(|| {
            RouteScopedOpenAiPassthroughError::relay_failed(
                "OpenAI-compatible passthrough failed for all configured route candidates",
            )
        }))
    }

    async fn forward_openai_to_target(
        &self,
        parts: &RequestParts,
        body: Bytes,
        intent: &RouteScopedOpenAiPassthroughIntent,
        route: RouteScopedOpenAiPassthroughTarget,
    ) -> Result<
        (RouteScopedOpenAiPassthroughTarget, Response, i64),
        RouteScopedOpenAiPassthroughError,
    > {
        let base_url = route.base_url.clone().ok_or_else(|| {
            RouteScopedOpenAiPassthroughError::provider_route_unavailable(format!(
                "provider route is not available for configured channel route: selected channel {} has no base URL",
                route.channel_id
            ))
        })?;
        let secret_ref = route.secret_ref.clone().ok_or_else(|| {
            RouteScopedOpenAiPassthroughError::provider_route_unavailable(format!(
                "provider route is not available for configured channel route: selected channel {} has no secret_ref",
                route.channel_id
            ))
        })?;
        let secret_value = self
            .secret_resolver
            .resolve_secret_value(&secret_ref)
            .map_err(|error| {
                RouteScopedOpenAiPassthroughError::provider_route_unavailable(format!(
                    "provider route is not available for configured channel route: {error}"
                ))
            })?;
        let rendered_auth = render_provider_account_auth(&route.auth_profile, secret_value)
            .map_err(RouteScopedOpenAiPassthroughError::relay_failed)?;
        let target = ProviderPassthroughTarget::new(
            route.provider_code.clone(),
            base_url.trim_end_matches('/').to_owned(),
            rendered_auth.auth,
            rendered_auth.default_headers,
        );
        let upstream_uri = build_route_scoped_openai_passthrough_uri(
            &target,
            &parts.uri,
            route.provider_model.as_deref(),
            intent.requested_model_source,
        )
        .map_err(RouteScopedOpenAiPassthroughError::relay_failed)?;
        let body = match route.provider_model.as_deref() {
            Some(provider_model) => openai_passthrough_payload::rewrite_body(
                &parts.method,
                &parts.uri,
                &parts.headers,
                body,
                provider_model,
            )
            .map_err(RouteScopedOpenAiPassthroughError::invalid_request)?,
            None => body,
        };
        let started_at = Instant::now();
        let response = self
            .forward_openai_to_target_with_retry(parts, body, &target, upstream_uri, &route)
            .await?;
        let latency_ms = i64::try_from(started_at.elapsed().as_millis()).unwrap_or(i64::MAX);
        Ok((route, response, latency_ms))
    }

    async fn forward_openai_to_target_with_retry(
        &self,
        parts: &RequestParts,
        body: Bytes,
        target: &ProviderPassthroughTarget,
        upstream_uri: Uri,
        route: &RouteScopedOpenAiPassthroughTarget,
    ) -> Result<Response, RouteScopedOpenAiPassthroughError> {
        let retry_policy = route_scoped_retry_policy(route);
        let mut last_error = None;
        for attempt in 1..=retry_policy.max_attempts {
            match forward_provider_passthrough_to_target(
                &self.client,
                clone_route_scoped_request_parts(parts),
                body.clone(),
                target,
                upstream_uri.clone(),
            )
            .await
            {
                Ok(response) => {
                    if attempt < retry_policy.max_attempts
                        && retry_policy.is_retryable_status(response.status().as_u16())
                    {
                        if retry_policy.backoff_ms > 0 {
                            tokio::time::sleep(std::time::Duration::from_millis(
                                retry_policy.backoff_ms,
                            ))
                            .await;
                        }
                        continue;
                    }
                    return Ok(response);
                }
                Err(error) => {
                    last_error = Some(error);
                    if attempt < retry_policy.max_attempts {
                        if retry_policy.backoff_ms > 0 {
                            tokio::time::sleep(std::time::Duration::from_millis(
                                retry_policy.backoff_ms,
                            ))
                            .await;
                        }
                        continue;
                    }
                }
            }
        }
        Err(RouteScopedOpenAiPassthroughError::relay_failed(
            last_error.unwrap_or_else(|| {
                "OpenAI-compatible passthrough failed after retry attempts".to_owned()
            }),
        ))
    }
}

fn clone_route_scoped_request_parts(parts: &RequestParts) -> RequestParts {
    let (mut cloned, _) = Request::new(Body::empty()).into_parts();
    cloned.method = parts.method.clone();
    cloned.uri = parts.uri.clone();
    cloned.version = parts.version;
    cloned.headers = parts.headers.clone();
    cloned
}

fn route_scoped_should_try_next_response(
    route: &RouteScopedOpenAiPassthroughTarget,
    response: &Response,
    failure_strategy: AiRouteFailureStrategy,
    is_last_route: bool,
) -> bool {
    failure_strategy.should_try_next_route(is_last_route)
        && route_scoped_failover_retry_policy(route).is_retryable_status(response.status().as_u16())
}

fn route_scoped_retry_policy(route: &RouteScopedOpenAiPassthroughTarget) -> ProviderRetryPolicy {
    route
        .retry_policy
        .clone()
        .unwrap_or_else(route_scoped_single_attempt_retry_policy)
}

fn route_scoped_failover_retry_policy(
    route: &RouteScopedOpenAiPassthroughTarget,
) -> ProviderRetryPolicy {
    route.retry_policy.clone().unwrap_or_default()
}

fn route_scoped_single_attempt_retry_policy() -> ProviderRetryPolicy {
    ProviderRetryPolicy {
        max_attempts: 1,
        retryable_status_codes: Vec::new(),
        backoff_ms: 0,
    }
}

fn build_route_scoped_openai_usage_context(
    parts: &RequestParts,
    body: &[u8],
    context: &AuthenticatedApiKeyContext,
    intent: &RouteScopedOpenAiPassthroughIntent,
) -> Result<Option<OpenAiInvocationContext>, RouteScopedOpenAiPassthroughError> {
    let Some(endpoint) = route_scoped_openai_usage_endpoint(&parts.method, parts.uri.path()) else {
        return Ok(None);
    };
    let request_body = serde_json::from_slice::<Value>(body).map_err(|error| {
        RouteScopedOpenAiPassthroughError::invalid_request(format!(
            "invalid request body for route-scoped OpenAI usage recording: {error}"
        ))
    })?;
    let stream = request_body
        .get("stream")
        .and_then(Value::as_bool)
        .unwrap_or(false);
    if stream {
        return Ok(None);
    }
    let requested_model = intent.requested_model.clone().ok_or_else(|| {
        RouteScopedOpenAiPassthroughError::invalid_request(
            "model is required for route-scoped OpenAI usage recording",
        )
    })?;
    Ok(Some(OpenAiInvocationContext::new(
        endpoint,
        context.clone(),
        requested_model,
        stream,
        request_body,
        &parts.headers,
        &parts.uri,
    )))
}

fn route_scoped_openai_usage_endpoint(
    method: &Method,
    path: &str,
) -> Option<OpenAiInvocationEndpoint> {
    if method == Method::POST && (path == "/v1/chat/completions" || path == "/v1/completions") {
        return Some(OpenAiInvocationEndpoint::ChatCompletions);
    }
    None
}

fn build_route_scoped_metered_usage_context(
    parts: &RequestParts,
    body: &[u8],
    api_key_context: &AuthenticatedApiKeyContext,
    intent: &RouteScopedOpenAiPassthroughIntent,
) -> Result<Option<RouteScopedMeteredUsageContext>, RouteScopedOpenAiPassthroughError> {
    let Some(billing_meter) = route_scoped_metered_usage_meter(&parts.method, parts.uri.path())
    else {
        return Ok(None);
    };
    let request_body = serde_json::from_slice::<Value>(body).map_err(|error| {
        RouteScopedOpenAiPassthroughError::invalid_request(format!(
            "invalid request body for route-scoped metered usage recording: {error}"
        ))
    })?;
    let requested_model = intent.requested_model.clone().ok_or_else(|| {
        RouteScopedOpenAiPassthroughError::invalid_request(
            "model is required for route-scoped metered usage recording",
        )
    })?;
    Ok(Some(RouteScopedMeteredUsageContext {
        api_key_context: api_key_context.clone(),
        request_id: Some(generate_server_request_id()),
        trace_id: header_value(&parts.headers, "x-trace-id"),
        requested_model,
        request_body,
        request_path: parts.uri.path().to_owned(),
        http_method: parts.method.to_string(),
        user_agent: header_value(&parts.headers, USER_AGENT.as_str())
            .and_then(|value| normalize_user_agent_header(value.as_str())),
        billing_meter,
    }))
}

fn route_scoped_metered_usage_meter(method: &Method, path: &str) -> Option<BillingMeter> {
    if method == Method::POST && path == "/v1/images/generations" {
        return Some(BillingMeter::ImageResult);
    }
    None
}

fn build_route_scoped_api_request_usage_context(
    parts: &RequestParts,
    api_key_context: &AuthenticatedApiKeyContext,
    intent: &RouteScopedOpenAiPassthroughIntent,
) -> Option<RouteScopedApiRequestUsageContext> {
    if intent.billing_meter != BillingMeter::ApiRequest {
        return None;
    }
    Some(RouteScopedApiRequestUsageContext {
        api_key_context: api_key_context.clone(),
        request_id: generate_server_request_id(),
        trace_id: header_value(&parts.headers, "x-trace-id"),
        requested_model: intent
            .requested_model
            .clone()
            .unwrap_or_else(|| default_route_scoped_api_request_model(parts.uri.path())),
        request_path: parts.uri.path().to_owned(),
        http_method: parts.method.to_string(),
        user_agent: header_value(&parts.headers, USER_AGENT.as_str())
            .and_then(|value| normalize_user_agent_header(value.as_str())),
        route_key: intent.route_key.clone(),
        api_code: intent.api_code.clone(),
    })
}

fn route_scoped_sticky_record_context(
    api_key_context: &AuthenticatedApiKeyContext,
    intent: &RouteScopedOpenAiPassthroughIntent,
    parts: &RequestParts,
) -> Option<RouteScopedStickyRecordContext> {
    let object_type = intent.sticky_object_type?.trim();
    let sticky_scope = intent.sticky_scope?.trim();
    if object_type.is_empty() || sticky_scope.is_empty() {
        return None;
    }
    if !matches!(
        intent.route_strategy,
        AiRouteStrategy::CreateThenSticky | AiRouteStrategy::ParentSticky
    ) {
        return None;
    }
    Some(RouteScopedStickyRecordContext {
        api_key_context: api_key_context.clone(),
        route_strategy: intent.route_strategy,
        object_type: object_type.to_owned(),
        sticky_scope: sticky_scope.to_owned(),
        request_object_id: sticky_object_id_from_path(parts.uri.path(), object_type),
        api_code: intent.api_code.clone(),
    })
}

fn default_route_scoped_api_request_model(_path: &str) -> String {
    provider_native_model_id(default_route_scoped_api_request_catalog_key())
}

async fn record_route_scoped_openai_usage_if_needed<C>(
    catalog: Arc<C>,
    usage_recorder: Option<UsageRecorder>,
    usage_context: Option<OpenAiInvocationContext>,
    metered_usage_context: Option<RouteScopedMeteredUsageContext>,
    api_request_usage_context: Option<RouteScopedApiRequestUsageContext>,
    sticky_store: Option<StickyObjectRouteStore>,
    sticky_context: Option<RouteScopedStickyRecordContext>,
    usage_route: Option<OpenAiProviderRoute>,
    channel_usage_route: OpenAiProviderRoute,
    response: Response,
    latency_ms: i64,
) -> Result<Response, RouteScopedOpenAiPassthroughError>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    if usage_recorder.is_none()
        && sticky_store.is_none()
        && sticky_context.is_none()
        && usage_context.is_none()
        && metered_usage_context.is_none()
        && api_request_usage_context.is_none()
    {
        return Ok(response);
    }
    if sticky_context.is_none()
        && usage_context.is_none()
        && metered_usage_context.is_none()
        && api_request_usage_context.is_none()
    {
        return Ok(response);
    }
    let status_code = response.status().as_u16();
    if !(200..=299).contains(&status_code) {
        return Ok(response);
    }
    let (parts, body) = response.into_parts();
    let body = to_bytes(body, MAX_ROUTE_SCOPED_USAGE_RESPONSE_BODY_BYTES)
        .await
        .map_err(|error| {
            RouteScopedOpenAiPassthroughError::usage_record_failed(format!(
                "failed to read route-scoped OpenAI response body for usage recording: {error}"
            ))
        })?;
    let response_body = serde_json::from_slice::<Value>(&body).map_err(|error| {
        RouteScopedOpenAiPassthroughError::usage_record_failed(format!(
            "route-scoped OpenAI response body is not valid JSON for usage recording: {error}"
        ))
    })?;
    if let (Some(sticky_store), Some(sticky_context)) = (sticky_store.as_ref(), sticky_context) {
        record_sticky_object_route_if_needed(
            sticky_store,
            &sticky_context,
            &channel_usage_route,
            &response_body,
        )
        .await?;
    }
    let Some(usage_recorder) = usage_recorder else {
        return Ok(Response::from_parts(parts, Body::from(body)));
    };
    if let Some(usage_context) = usage_context {
        let usage_route = usage_route.clone().ok_or_else(|| {
            RouteScopedOpenAiPassthroughError::usage_record_failed(
                "route-scoped OpenAI token usage recording requires a selected model provider route",
            )
        })?;
        let outcome = OpenAiInvocationRelayOutcome::json(status_code, response_body.clone())
            .with_latency_ms(latency_ms);
        OpenAiUsageRecorder::new(Arc::clone(&catalog), Arc::clone(&usage_recorder))
            .record_after_relay(&usage_context, &usage_route, &outcome)
            .await
            .map_err(|error| {
                RouteScopedOpenAiPassthroughError::usage_record_failed(error.message)
            })?;
    }
    if let Some(metered_usage_context) = metered_usage_context {
        let usage_route = usage_route.clone().ok_or_else(|| {
            RouteScopedOpenAiPassthroughError::usage_record_failed(
                "route-scoped OpenAI metered usage recording requires a selected model provider route",
            )
        })?;
        let command = route_scoped_metered_usage_command(
            catalog.as_ref(),
            &metered_usage_context,
            &usage_route,
            &response_body,
            status_code,
            latency_ms,
        )
        .map_err(|error| {
            RouteScopedOpenAiPassthroughError::usage_record_failed(error.to_string())
        })?;
        usage_recorder
            .record_gateway_usage(command)
            .await
            .map_err(|error| {
                RouteScopedOpenAiPassthroughError::usage_record_failed(error.to_string())
            })?;
    }
    if let Some(api_request_usage_context) = api_request_usage_context {
        let command = route_scoped_api_request_usage_command(
            catalog.as_ref(),
            &api_request_usage_context,
            &channel_usage_route,
            status_code,
            latency_ms,
        )
        .map_err(|error| {
            RouteScopedOpenAiPassthroughError::usage_record_failed(error.to_string())
        })?;
        usage_recorder
            .record_gateway_usage(command)
            .await
            .map_err(|error| {
                RouteScopedOpenAiPassthroughError::usage_record_failed(error.to_string())
            })?;
    }
    Ok(Response::from_parts(parts, Body::from(body)))
}

fn route_scoped_metered_usage_command<C>(
    catalog: &C,
    context: &RouteScopedMeteredUsageContext,
    route: &OpenAiProviderRoute,
    response_body: &Value,
    status_code: u16,
    latency_ms: i64,
) -> DomainResult<GatewayUsageRecordCommand>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let quantity = route_scoped_metered_usage_quantity(context, response_body)?;
    let price = PricingResolver::new(catalog).resolve(ResolveModelPriceQuery {
        api_key_id: context.api_key_context.api_key_id,
        channel_group_id: Some(route.group_id),
        model: route.catalog_key.clone(),
        billing_meter: context.billing_meter.clone(),
        provider_code: Some(route.provider_code.clone()),
        channel_id: Some(route.channel_id),
        region_code: Some(route.region_code.clone()),
    })?;
    let official_reference_amount = route_scoped_meter_amount(
        price.official_reference.unit_price.unit_price,
        quantity.billable_quantity.as_str(),
        &context.billing_meter,
    )?;
    let upstream_cost_amount = match price.upstream_cost.as_ref() {
        Some(upstream) => route_scoped_meter_amount(
            upstream.unit_price.unit_price,
            quantity.billable_quantity.as_str(),
            &context.billing_meter,
        )?,
        None => DecimalValue::ZERO,
    };
    let customer_charge_amount = route_scoped_meter_amount(
        price.customer_charge.unit_price,
        quantity.billable_quantity.as_str(),
        &context.billing_meter,
    )?;
    let provider_native_model = provider_native_model_id(&route.provider_model);
    let pricing_snapshot = route_scoped_metered_pricing_snapshot(
        context,
        route,
        &provider_native_model,
        &price,
        quantity.billable_quantity.as_str(),
    );

    Ok(GatewayUsageRecordCommand {
        request_id: context
            .request_id
            .clone()
            .unwrap_or_else(generate_server_request_id),
        trace_id: context.trace_id.clone(),
        tenant_id: context.api_key_context.tenant_id,
        organization_id: context.api_key_context.organization_id,
        user_id: context.api_key_context.user_id,
        api_key_id: context.api_key_context.api_key_id,
        api_key_name_snapshot: context.api_key_context.api_key_name_snapshot.clone(),
        channel_group_id: route.group_id,
        channel_group_snapshot: route.group_code.clone(),
        catalog_key: route.catalog_key.clone(),
        requested_model: context.requested_model.clone(),
        requested_model_catalog_key: route.catalog_key.clone(),
        provider_code: route.provider_code.clone(),
        channel_id: route.channel_id,
        provider_model: provider_native_model.clone(),
        provider_native_model,
        region_code: route.region_code.clone(),
        request_path: context.request_path.clone(),
        http_method: context.http_method.clone(),
        user_agent: context.user_agent.clone(),
        http_status: status_code,
        streaming: false,
        modality: route_scoped_modality_for_meter(&context.billing_meter),
        usage_type: route_scoped_usage_type_for_meter(&context.billing_meter),
        billing_meter_code: context.billing_meter.code().to_owned(),
        billable_quantity: quantity.billable_quantity,
        prompt_tokens: 0,
        completion_tokens: 0,
        cached_tokens: 0,
        total_tokens: 0,
        request_count: quantity.request_count,
        result_count: quantity.result_count,
        item_count: quantity.item_count,
        character_count: quantity.character_count,
        image_count: quantity.image_count,
        audio_seconds: quantity.audio_seconds,
        video_seconds: quantity.video_seconds,
        latency_ms: Some(latency_ms.max(0)),
        ttft_ms: None,
        provider_error_code: None,
        error_type: None,
        error_message_masked: None,
        base_input_unit_price: price.customer_charge_before_rate.to_fixed_string(6),
        base_output_unit_price: "0.000000".to_owned(),
        cache_read_unit_price: "0.000000".to_owned(),
        rate_multiplier: price.rate_multiplier.to_fixed_string(6),
        reference_multiplier: price.reference_multiplier.to_fixed_string(6),
        official_reference_amount: official_reference_amount
            .to_fixed_string(USAGE_AMOUNT_DECIMAL_DIGITS),
        customer_charge_amount: customer_charge_amount.to_fixed_string(USAGE_AMOUNT_DECIMAL_DIGITS),
        upstream_cost_amount: upstream_cost_amount.to_fixed_string(USAGE_AMOUNT_DECIMAL_DIGITS),
        currency: price.customer_charge.currency,
        pricing_plan_code: price.pricing_plan_code,
        pricing_snapshot,
    })
}

fn route_scoped_api_request_usage_command<C>(
    catalog: &C,
    context: &RouteScopedApiRequestUsageContext,
    route: &OpenAiProviderRoute,
    status_code: u16,
    latency_ms: i64,
) -> DomainResult<GatewayUsageRecordCommand>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let billing_meter = BillingMeter::ApiRequest;
    let quantity = GatewayUsageQuantity::single_request();
    let price = PricingResolver::new(catalog).resolve(ResolveModelPriceQuery {
        api_key_id: context.api_key_context.api_key_id,
        channel_group_id: Some(route.group_id),
        model: route.catalog_key.clone(),
        billing_meter: billing_meter.clone(),
        provider_code: Some(route.provider_code.clone()),
        channel_id: Some(route.channel_id),
        region_code: Some(route.region_code.clone()),
    })?;
    let official_reference_amount = route_scoped_meter_amount(
        price.official_reference.unit_price.unit_price,
        quantity.billable_quantity.as_str(),
        &billing_meter,
    )?;
    let upstream_cost_amount = match price.upstream_cost.as_ref() {
        Some(upstream) => route_scoped_meter_amount(
            upstream.unit_price.unit_price,
            quantity.billable_quantity.as_str(),
            &billing_meter,
        )?,
        None => DecimalValue::ZERO,
    };
    let customer_charge_amount = route_scoped_meter_amount(
        price.customer_charge.unit_price,
        quantity.billable_quantity.as_str(),
        &billing_meter,
    )?;
    let provider_native_model = provider_native_model_id(&route.provider_model);
    let pricing_snapshot = route_scoped_api_request_pricing_snapshot(
        context,
        route,
        &provider_native_model,
        &billing_meter,
        &price,
        quantity.billable_quantity.as_str(),
    );

    Ok(GatewayUsageRecordCommand {
        request_id: context.request_id.clone(),
        trace_id: context.trace_id.clone(),
        tenant_id: context.api_key_context.tenant_id,
        organization_id: context.api_key_context.organization_id,
        user_id: context.api_key_context.user_id,
        api_key_id: context.api_key_context.api_key_id,
        api_key_name_snapshot: context.api_key_context.api_key_name_snapshot.clone(),
        channel_group_id: route.group_id,
        channel_group_snapshot: route.group_code.clone(),
        catalog_key: route.catalog_key.clone(),
        requested_model: context.requested_model.clone(),
        requested_model_catalog_key: route.catalog_key.clone(),
        provider_code: route.provider_code.clone(),
        channel_id: route.channel_id,
        provider_model: provider_native_model.clone(),
        provider_native_model,
        region_code: route.region_code.clone(),
        request_path: context.request_path.clone(),
        http_method: context.http_method.clone(),
        user_agent: context.user_agent.clone(),
        http_status: status_code,
        streaming: false,
        modality: route_scoped_modality_for_meter(&billing_meter),
        usage_type: route_scoped_usage_type_for_meter(&billing_meter),
        billing_meter_code: billing_meter.code().to_owned(),
        billable_quantity: quantity.billable_quantity,
        prompt_tokens: 0,
        completion_tokens: 0,
        cached_tokens: 0,
        total_tokens: 0,
        request_count: quantity.request_count,
        result_count: quantity.result_count,
        item_count: quantity.item_count,
        character_count: quantity.character_count,
        image_count: quantity.image_count,
        audio_seconds: quantity.audio_seconds,
        video_seconds: quantity.video_seconds,
        latency_ms: Some(latency_ms.max(0)),
        ttft_ms: None,
        provider_error_code: None,
        error_type: None,
        error_message_masked: None,
        base_input_unit_price: price.customer_charge_before_rate.to_fixed_string(6),
        base_output_unit_price: "0.000000".to_owned(),
        cache_read_unit_price: "0.000000".to_owned(),
        rate_multiplier: price.rate_multiplier.to_fixed_string(6),
        reference_multiplier: price.reference_multiplier.to_fixed_string(6),
        official_reference_amount: official_reference_amount
            .to_fixed_string(USAGE_AMOUNT_DECIMAL_DIGITS),
        customer_charge_amount: customer_charge_amount.to_fixed_string(USAGE_AMOUNT_DECIMAL_DIGITS),
        upstream_cost_amount: upstream_cost_amount.to_fixed_string(USAGE_AMOUNT_DECIMAL_DIGITS),
        currency: price.customer_charge.currency,
        pricing_plan_code: price.pricing_plan_code,
        pricing_snapshot,
    })
}

async fn record_sticky_object_route_if_needed(
    sticky_store: &StickyObjectRouteStore,
    context: &RouteScopedStickyRecordContext,
    route: &OpenAiProviderRoute,
    response_body: &Value,
) -> Result<(), RouteScopedOpenAiPassthroughError> {
    let Some(object_id) = sticky_response_object_id(context, response_body) else {
        return Ok(());
    };
    let (parent_object_type, parent_object_id) =
        if matches!(context.route_strategy, AiRouteStrategy::ParentSticky) {
            (
                Some(context.object_type.clone()),
                context.request_object_id.clone(),
            )
        } else {
            (None, None)
        };
    let command = StickyObjectRouteUpsert {
        uuid: generate_server_request_id(),
        tenant_id: context.api_key_context.tenant_id,
        organization_id: context.api_key_context.organization_id,
        api_key_id: context.api_key_context.api_key_id,
        channel_group_id: route.group_id,
        object_type: context.object_type.clone(),
        object_id: object_id.clone(),
        object_key_hash: sticky_object_key_hash(
            context.api_key_context.tenant_id,
            context.api_key_context.organization_id,
            &context.object_type,
            &object_id,
        ),
        parent_object_type,
        parent_object_id,
        provider_code: route.provider_code.clone(),
        channel_id: route.channel_id,
        vendor_code: Some(route.provider_code.clone()),
        api_code: context.api_code.clone(),
        catalog_key: route.catalog_key.clone(),
        provider_model: route.provider_model.clone(),
        region_code: Some(route.region_code.clone()),
        sticky_scope: context.sticky_scope.clone(),
    };
    sticky_store.upsert(&command).await
}

fn sticky_response_object_id(
    context: &RouteScopedStickyRecordContext,
    response_body: &Value,
) -> Option<String> {
    let id = response_body
        .get("id")
        .and_then(Value::as_str)
        .map(str::trim)
        .filter(|value| !value.is_empty())?;
    if response_body
        .get("object")
        .and_then(Value::as_str)
        .is_some_and(|object| sticky_response_object_matches(&context.object_type, object))
    {
        return Some(id.to_owned());
    }
    if matches!(
        context.route_strategy,
        AiRouteStrategy::CreateThenSticky | AiRouteStrategy::ParentSticky
    ) {
        return Some(id.to_owned());
    }
    None
}

fn sticky_response_object_matches(expected_object_type: &str, actual_object: &str) -> bool {
    let actual = actual_object.trim();
    actual == expected_object_type
        || actual.strip_prefix("provider-") == Some(expected_object_type)
        || actual.strip_suffix(".created") == Some(expected_object_type)
}

impl StickyObjectRouteStore {
    async fn find(
        &self,
        context: &AuthenticatedApiKeyContext,
        object_type: &str,
        object_id: &str,
    ) -> Result<Option<StickyObjectRouteBinding>, RouteScopedOpenAiPassthroughError> {
        let object_key_hash = sticky_object_key_hash(
            context.tenant_id,
            context.organization_id,
            object_type,
            object_id,
        );
        match self {
            StickyObjectRouteStore::Sqlite(pool) => sqlx::query(
                r#"
                SELECT object_type, object_id, parent_object_type, parent_object_id,
                       provider_code, channel_id, channel_group_id, vendor_code, api_code, catalog_key,
                       provider_model, region_code, sticky_scope
                FROM ai_provider_object_route
                WHERE tenant_id = ?
                  AND organization_id = ?
                  AND object_type = ?
                  AND object_id = ?
                  AND object_key_hash = ?
                  AND status = 1
                ORDER BY id DESC
                LIMIT 1
                "#,
            )
            .bind(context.tenant_id)
            .bind(context.organization_id)
            .bind(object_type)
            .bind(object_id)
            .bind(object_key_hash)
            .fetch_optional(pool)
            .await
            .map_err(sticky_store_error)
            .map(|row| row.map(sticky_binding_from_row)),
            StickyObjectRouteStore::Postgres(pool) => sqlx::query(
                r#"
                SELECT object_type, object_id, parent_object_type, parent_object_id,
                       provider_code, channel_id, channel_group_id, vendor_code, api_code, catalog_key,
                       provider_model, region_code, sticky_scope
                FROM ai_provider_object_route
                WHERE tenant_id = $1
                  AND organization_id = $2
                  AND object_type = $3
                  AND object_id = $4
                  AND object_key_hash = $5
                  AND status = 1
                ORDER BY id DESC
                LIMIT 1
                "#,
            )
            .bind(context.tenant_id)
            .bind(context.organization_id)
            .bind(object_type)
            .bind(object_id)
            .bind(object_key_hash)
            .fetch_optional(pool)
            .await
            .map_err(sticky_store_error)
            .map(|row| row.map(sticky_binding_from_pg_row)),
        }
    }

    async fn upsert(
        &self,
        command: &StickyObjectRouteUpsert,
    ) -> Result<(), RouteScopedOpenAiPassthroughError> {
        match self {
            StickyObjectRouteStore::Sqlite(pool) => {
                sqlx::query(
                    r#"
                    INSERT INTO ai_provider_object_route
                        (uuid, tenant_id, organization_id, status, api_key_id, channel_group_id,
                         object_type, object_id, object_key_hash, parent_object_type,
                         parent_object_id, provider_code, channel_id, vendor_code, api_code,
                         catalog_key, provider_model, region_code, sticky_scope, last_seen_at)
                    VALUES
                        (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                    ON CONFLICT(tenant_id, organization_id, object_type, object_id)
                    DO UPDATE SET
                        status = 1,
                        api_key_id = excluded.api_key_id,
                        channel_group_id = excluded.channel_group_id,
                        object_key_hash = excluded.object_key_hash,
                        parent_object_type = excluded.parent_object_type,
                        parent_object_id = excluded.parent_object_id,
                        provider_code = excluded.provider_code,
                        channel_id = excluded.channel_id,
                        vendor_code = excluded.vendor_code,
                        api_code = excluded.api_code,
                        catalog_key = excluded.catalog_key,
                        provider_model = excluded.provider_model,
                        region_code = excluded.region_code,
                        sticky_scope = excluded.sticky_scope,
                        last_seen_at = CURRENT_TIMESTAMP,
                        updated_at = CURRENT_TIMESTAMP,
                        version = ai_provider_object_route.version + 1
                    "#,
                )
                .bind(&command.uuid)
                .bind(command.tenant_id)
                .bind(command.organization_id)
                .bind(command.api_key_id)
                .bind(command.channel_group_id)
                .bind(&command.object_type)
                .bind(&command.object_id)
                .bind(&command.object_key_hash)
                .bind(&command.parent_object_type)
                .bind(&command.parent_object_id)
                .bind(&command.provider_code)
                .bind(command.channel_id)
                .bind(&command.vendor_code)
                .bind(&command.api_code)
                .bind(&command.catalog_key)
                .bind(&command.provider_model)
                .bind(&command.region_code)
                .bind(&command.sticky_scope)
                .execute(pool)
                .await
                .map_err(sticky_store_error)?;
            }
            StickyObjectRouteStore::Postgres(pool) => {
                sqlx::query(
                    r#"
                    INSERT INTO ai_provider_object_route
                        (uuid, tenant_id, organization_id, status, api_key_id, channel_group_id,
                         object_type, object_id, object_key_hash, parent_object_type,
                         parent_object_id, provider_code, channel_id, vendor_code, api_code,
                         catalog_key, provider_model, region_code, sticky_scope, last_seen_at)
                    VALUES
                        ($1, $2, $3, 1, $4, $5, $6, $7, $8, $9, $10,
                         $11, $12, $13, $14, $15, $16, $17, $18, CURRENT_TIMESTAMP)
                    ON CONFLICT(tenant_id, organization_id, object_type, object_id)
                    DO UPDATE SET
                        status = 1,
                        api_key_id = EXCLUDED.api_key_id,
                        channel_group_id = EXCLUDED.channel_group_id,
                        object_key_hash = EXCLUDED.object_key_hash,
                        parent_object_type = EXCLUDED.parent_object_type,
                        parent_object_id = EXCLUDED.parent_object_id,
                        provider_code = EXCLUDED.provider_code,
                        channel_id = EXCLUDED.channel_id,
                        vendor_code = EXCLUDED.vendor_code,
                        api_code = EXCLUDED.api_code,
                        catalog_key = EXCLUDED.catalog_key,
                        provider_model = EXCLUDED.provider_model,
                        region_code = EXCLUDED.region_code,
                        sticky_scope = EXCLUDED.sticky_scope,
                        last_seen_at = CURRENT_TIMESTAMP,
                        updated_at = CURRENT_TIMESTAMP,
                        version = ai_provider_object_route.version + 1
                    "#,
                )
                .bind(&command.uuid)
                .bind(command.tenant_id)
                .bind(command.organization_id)
                .bind(command.api_key_id)
                .bind(command.channel_group_id)
                .bind(&command.object_type)
                .bind(&command.object_id)
                .bind(&command.object_key_hash)
                .bind(&command.parent_object_type)
                .bind(&command.parent_object_id)
                .bind(&command.provider_code)
                .bind(command.channel_id)
                .bind(&command.vendor_code)
                .bind(&command.api_code)
                .bind(&command.catalog_key)
                .bind(&command.provider_model)
                .bind(&command.region_code)
                .bind(&command.sticky_scope)
                .execute(pool)
                .await
                .map_err(sticky_store_error)?;
            }
        }
        Ok(())
    }
}

fn sticky_binding_from_row(row: sqlx::sqlite::SqliteRow) -> StickyObjectRouteBinding {
    StickyObjectRouteBinding {
        object_type: row.get("object_type"),
        object_id: row.get("object_id"),
        parent_object_type: row.get("parent_object_type"),
        parent_object_id: row.get("parent_object_id"),
        provider_code: row.get("provider_code"),
        channel_id: row.get("channel_id"),
        channel_group_id: row.get("channel_group_id"),
        vendor_code: row.get("vendor_code"),
        api_code: row.get("api_code"),
        catalog_key: row.get("catalog_key"),
        provider_model: row.get("provider_model"),
        region_code: row.get("region_code"),
        sticky_scope: row.get("sticky_scope"),
    }
}

fn sticky_binding_from_pg_row(row: sqlx::postgres::PgRow) -> StickyObjectRouteBinding {
    StickyObjectRouteBinding {
        object_type: row.get("object_type"),
        object_id: row.get("object_id"),
        parent_object_type: row.get("parent_object_type"),
        parent_object_id: row.get("parent_object_id"),
        provider_code: row.get("provider_code"),
        channel_id: row.get("channel_id"),
        channel_group_id: row.get("channel_group_id"),
        vendor_code: row.get("vendor_code"),
        api_code: row.get("api_code"),
        catalog_key: row.get("catalog_key"),
        provider_model: row.get("provider_model"),
        region_code: row.get("region_code"),
        sticky_scope: row.get("sticky_scope"),
    }
}

fn product_sticky_binding_from_row(
    row: sqlx::sqlite::SqliteRow,
) -> ProductStickyObjectRouteBinding {
    ProductStickyObjectRouteBinding {
        tenant_id: row.get("tenant_id"),
        organization_id: row.get("organization_id"),
        object_type: row.get("object_type"),
        object_id: row.get("object_id"),
        parent_object_type: row.get("parent_object_type"),
        parent_object_id: row.get("parent_object_id"),
        provider_code: row.get("provider_code"),
        channel_id: row.get("channel_id"),
        channel_group_id: row.get("channel_group_id"),
        vendor_code: row.get("vendor_code"),
        api_code: row.get("api_code"),
        catalog_key: row.get("catalog_key"),
        provider_model: row.get("provider_model"),
        region_code: row.get("region_code"),
        sticky_scope: row.get("sticky_scope"),
    }
}

fn product_sticky_binding_from_pg_row(
    row: sqlx::postgres::PgRow,
) -> ProductStickyObjectRouteBinding {
    ProductStickyObjectRouteBinding {
        tenant_id: row.get("tenant_id"),
        organization_id: row.get("organization_id"),
        object_type: row.get("object_type"),
        object_id: row.get("object_id"),
        parent_object_type: row.get("parent_object_type"),
        parent_object_id: row.get("parent_object_id"),
        provider_code: row.get("provider_code"),
        channel_id: row.get("channel_id"),
        channel_group_id: row.get("channel_group_id"),
        vendor_code: row.get("vendor_code"),
        api_code: row.get("api_code"),
        catalog_key: row.get("catalog_key"),
        provider_model: row.get("provider_model"),
        region_code: row.get("region_code"),
        sticky_scope: row.get("sticky_scope"),
    }
}

fn sticky_store_error(error: sqlx::Error) -> RouteScopedOpenAiPassthroughError {
    RouteScopedOpenAiPassthroughError::usage_record_failed(format!(
        "failed to persist route-scoped OpenAI sticky object route: {error}"
    ))
}

fn product_sticky_store_error(error: sqlx::Error) -> DomainError {
    DomainError::new(format!(
        "failed to persist invocation sticky object route: {error}"
    ))
}

fn sticky_object_key_hash(
    tenant_id: i64,
    organization_id: i64,
    object_type: &str,
    object_id: &str,
) -> String {
    let mut hasher = Sha256::new();
    hasher.update(tenant_id.to_string());
    hasher.update(b":");
    hasher.update(organization_id.to_string());
    hasher.update(b":");
    hasher.update(object_type.trim().as_bytes());
    hasher.update(b":");
    hasher.update(object_id.trim().as_bytes());
    hex::encode(hasher.finalize())
}

fn sticky_object_id_from_path(path: &str, object_type: &str) -> Option<String> {
    let segments = path
        .trim_matches('/')
        .split('/')
        .filter(|segment| !segment.is_empty())
        .collect::<Vec<_>>();
    for index in 0..segments.len().saturating_sub(1) {
        if sticky_path_segment_matches_object_type(segments[index], object_type) {
            return Some(
                percent_decode_path_segment(segments[index + 1])
                    .trim()
                    .to_owned(),
            )
            .filter(|value| !value.is_empty());
        }
    }
    None
}

fn sticky_path_segment_matches_object_type(segment: &str, object_type: &str) -> bool {
    segment == object_type
        || segment == format!("{object_type}s")
        || matches!(
            (object_type, segment),
            ("batch", "batches")
                | ("fine_tuning_job", "jobs")
                | ("realtime_call", "calls")
                | ("video_character", "characters")
        )
}

fn percent_decode_path_segment(segment: &str) -> String {
    let bytes = segment.as_bytes();
    let mut output = Vec::with_capacity(bytes.len());
    let mut index = 0;
    while index < bytes.len() {
        if bytes[index] == b'%' && index + 2 < bytes.len() {
            if let Ok(hex) = std::str::from_utf8(&bytes[index + 1..index + 3]) {
                if let Ok(value) = u8::from_str_radix(hex, 16) {
                    output.push(value);
                    index += 3;
                    continue;
                }
            }
        }
        output.push(bytes[index]);
        index += 1;
    }
    String::from_utf8(output).unwrap_or_else(|_| segment.to_owned())
}

fn route_scoped_metered_usage_quantity(
    context: &RouteScopedMeteredUsageContext,
    response_body: &Value,
) -> DomainResult<GatewayUsageQuantity> {
    match &context.billing_meter {
        BillingMeter::ImageResult => {
            let count = response_body
                .get("data")
                .and_then(Value::as_array)
                .map(|items| items.len() as i64)
                .or_else(|| {
                    context
                        .request_body
                        .get("n")
                        .and_then(Value::as_i64)
                        .filter(|value| *value > 0)
                })
                .unwrap_or(1);
            GatewayUsageQuantity::for_meter(BillingMeter::ImageResult, count.to_string())
        }
        _ => Err(DomainError::new(format!(
            "route-scoped OpenAI metered usage does not support meter {}",
            context.billing_meter.code()
        ))),
    }
}

fn route_scoped_meter_amount(
    unit_price: DecimalValue,
    billable_quantity: &str,
    billing_meter: &BillingMeter,
) -> DomainResult<DecimalValue> {
    let amount = unit_price.checked_multiply(DecimalValue::parse(billable_quantity)?)?;
    if route_scoped_meter_uses_million_token_unit(billing_meter) {
        amount.checked_divide(DecimalValue::parse(TOKEN_BILLING_UNIT_SIZE_DECIMAL)?)
    } else {
        Ok(amount)
    }
}

fn route_scoped_meter_uses_million_token_unit(billing_meter: &BillingMeter) -> bool {
    matches!(
        billing_meter,
        BillingMeter::LlmInputToken
            | BillingMeter::LlmOutputToken
            | BillingMeter::LlmReasoningToken
            | BillingMeter::LlmCacheWriteToken
            | BillingMeter::LlmCacheReadToken
            | BillingMeter::EmbeddingInputToken
            | BillingMeter::AudioInputToken
            | BillingMeter::AudioOutputToken
            | BillingMeter::ImageInputToken
            | BillingMeter::ImageOutputToken
            | BillingMeter::VideoInputToken
            | BillingMeter::VideoOutputToken
    )
}

fn route_scoped_modality_for_meter(billing_meter: &BillingMeter) -> i64 {
    match billing_meter {
        BillingMeter::ImageInputToken
        | BillingMeter::ImageOutputToken
        | BillingMeter::ImageResult
        | BillingMeter::ImagePixel
        | BillingMeter::ImageMegapixel => MODALITY_IMAGE,
        _ => 1,
    }
}

fn route_scoped_usage_type_for_meter(billing_meter: &BillingMeter) -> i64 {
    ROUTE_SCOPED_USAGE_TYPE_BASE
        + match billing_meter {
            BillingMeter::ApiRequest => 1,
            BillingMeter::ImageResult => 11,
            _ => 99,
        }
}

fn route_scoped_metered_pricing_snapshot(
    context: &RouteScopedMeteredUsageContext,
    route: &OpenAiProviderRoute,
    provider_native_model: &str,
    price: &sdkwork_claw_product::application::ResolvedModelPrice,
    billable_quantity: &str,
) -> String {
    json!({
        "source": "route_scoped_openai_passthrough",
        "meter": {
            "code": context.billing_meter.code(),
            "billableQuantity": billable_quantity
        },
        "model": {
            "catalogKey": route.catalog_key.as_str(),
            "requestedCatalogKey": route.catalog_key.as_str(),
            "model": context.requested_model.as_str(),
            "providerNativeModel": provider_native_model
        },
        "provider": {
            "code": route.provider_code.as_str(),
            "channelId": route.channel_id,
            "regionCode": route.region_code.as_str()
        },
        "pricingPlan": {
            "code": price.pricing_plan_code.as_str()
        },
        "group": {
            "code": price.group_code.as_str()
        },
        "multipliers": {
            "rate": price.rate_multiplier.to_fixed_string(6),
            "reference": price.reference_multiplier.to_fixed_string(6)
        }
    })
    .to_string()
}

fn route_scoped_api_request_pricing_snapshot(
    context: &RouteScopedApiRequestUsageContext,
    route: &OpenAiProviderRoute,
    provider_native_model: &str,
    billing_meter: &BillingMeter,
    price: &sdkwork_claw_product::application::ResolvedModelPrice,
    billable_quantity: &str,
) -> String {
    json!({
        "source": "route_scoped_openai_passthrough",
        "meter": {
            "code": billing_meter.code(),
            "billableQuantity": billable_quantity
        },
        "route": {
            "routeKey": context.route_key.as_str(),
            "apiCode": context.api_code.as_str()
        },
        "model": {
            "catalogKey": route.catalog_key.as_str(),
            "requestedCatalogKey": route.catalog_key.as_str(),
            "model": context.requested_model.as_str(),
            "providerNativeModel": provider_native_model
        },
        "provider": {
            "code": route.provider_code.as_str(),
            "channelId": route.channel_id,
            "regionCode": route.region_code.as_str()
        },
        "pricingPlan": {
            "code": price.pricing_plan_code.as_str()
        },
        "group": {
            "code": price.group_code.as_str()
        },
        "multipliers": {
            "rate": price.rate_multiplier.to_fixed_string(6),
            "reference": price.reference_multiplier.to_fixed_string(6)
        }
    })
    .to_string()
}

fn header_value(headers: &HeaderMap, name: &str) -> Option<String> {
    headers
        .get(name)
        .and_then(|value| value.to_str().ok())
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned)
}

fn build_route_scoped_openai_passthrough_uri(
    target: &ProviderPassthroughTarget,
    original_uri: &Uri,
    provider_model: Option<&str>,
    model_source: Option<openai_passthrough_payload::OpenAiPassthroughModelSource>,
) -> Result<Uri, String> {
    let path = if matches!(
        model_source,
        Some(openai_passthrough_payload::OpenAiPassthroughModelSource::Path)
    ) {
        let provider_model = provider_model.ok_or_else(|| {
            "provider model is required for OpenAI model path passthrough".to_owned()
        })?;
        format!(
            "/v1/models/{}",
            openai_passthrough_payload::percent_encode_path_segment(provider_model)
        )
    } else {
        original_uri.path().to_owned()
    };
    let path = target.normalize_openai_compatible_path(&path);
    let path_and_query = match original_uri.query() {
        Some(query)
            if matches!(
                model_source,
                Some(openai_passthrough_payload::OpenAiPassthroughModelSource::Query)
            ) =>
        {
            match provider_model {
                Some(provider_model) => format!(
                    "{path}?{}",
                    openai_passthrough_payload::rewrite_url_encoded_model(query, provider_model)
                ),
                None => format!("{path}?{query}"),
            }
        }
        Some(query) => format!("{path}?{query}"),
        None => path,
    };
    target
        .build_uri(path_and_query)
        .map_err(|error| format!("invalid OpenAI-compatible passthrough upstream URI: {error}"))
}

fn route_scoped_openai_passthrough_intent(
    parts: &RequestParts,
    body: &[u8],
) -> Result<RouteScopedOpenAiPassthroughIntent, RouteScopedOpenAiPassthroughError> {
    let path = parts.uri.path();
    let classification = classify_openai_route(&parts.method, path);
    let routes_model_when_present = classification.routes_model_when_present();
    let requested_model = if routes_model_when_present {
        openai_passthrough_payload::optional_requested_model_with_source(
            &parts.method,
            &parts.uri,
            &parts.headers,
            body,
        )
        .map_err(RouteScopedOpenAiPassthroughError::invalid_request)?
    } else {
        None
    };
    if requested_model.is_none() && !classification.permits_missing_model() {
        return Err(RouteScopedOpenAiPassthroughError::invalid_request(
            "model is required for OpenAI-compatible route-scoped passthrough",
        ));
    }
    let intent = RouteScopedOpenAiPassthroughIntent {
        requested_model: requested_model
            .as_ref()
            .map(|requested_model| requested_model.model().to_owned()),
        requested_model_source: requested_model
            .as_ref()
            .map(openai_passthrough_payload::OpenAiPassthroughRequestedModel::source),
        request_path: path.to_owned(),
        route_key: classification.route_key.to_owned(),
        api_code: classification.api_code.to_owned(),
        capability: classification.capability,
        billing_meter: classification.billing_meter,
        route_strategy: classification.route_strategy,
        failure_strategy: classification.failure_strategy,
        model_requirement: classification.model_requirement,
        sticky_object_type: classification.sticky_object_type,
        sticky_scope: classification.sticky_scope,
        routes_model_when_present,
    };
    validate_route_scoped_strategy_profile(&intent)?;
    Ok(intent)
}

fn validate_route_scoped_strategy_profile(
    intent: &RouteScopedOpenAiPassthroughIntent,
) -> Result<(), RouteScopedOpenAiPassthroughError> {
    if intent.route_strategy.failure_strategy() != intent.failure_strategy {
        return Err(RouteScopedOpenAiPassthroughError::internal_config(
            "route_strategy_invalid",
            format!(
                "OpenAI-compatible route {} declares {:?} with incompatible failure strategy {:?}",
                intent.route_key, intent.route_strategy, intent.failure_strategy
            ),
        ));
    }
    if intent.model_requirement.routes_model_when_present() != intent.routes_model_when_present {
        return Err(RouteScopedOpenAiPassthroughError::internal_config(
            "route_strategy_invalid",
            format!(
                "OpenAI-compatible route {} has inconsistent model routing requirement {:?}",
                intent.route_key, intent.model_requirement
            ),
        ));
    }

    let requires_sticky_metadata = matches!(
        intent.route_strategy,
        AiRouteStrategy::CreateThenSticky
            | AiRouteStrategy::ParentSticky
            | AiRouteStrategy::LookupSticky
    );
    let has_sticky_metadata = intent.sticky_object_type.is_some() || intent.sticky_scope.is_some();
    if requires_sticky_metadata {
        let has_object_type = intent
            .sticky_object_type
            .map(str::trim)
            .is_some_and(|value| !value.is_empty());
        let valid_scope = matches!(intent.sticky_scope, Some("object" | "parent"));
        if !has_object_type || !valid_scope {
            return Err(RouteScopedOpenAiPassthroughError::internal_config(
                "route_strategy_invalid",
                format!(
                    "OpenAI-compatible sticky route {} must declare sticky object type and scope",
                    intent.route_key
                ),
            ));
        }
    } else if has_sticky_metadata {
        return Err(RouteScopedOpenAiPassthroughError::internal_config(
            "route_strategy_invalid",
            format!(
                "OpenAI-compatible non-sticky route {} must not declare sticky metadata",
                intent.route_key
            ),
        ));
    }

    Ok(())
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct RouteScopedOpenAiPassthroughTarget {
    provider_code: String,
    channel_id: i64,
    provider_model: Option<String>,
    base_url: Option<String>,
    secret_ref: Option<String>,
    auth_profile: ProviderAuthProfile,
    retry_policy: Option<ProviderRetryPolicy>,
    usage_route: Option<OpenAiProviderRoute>,
    channel_usage_route: OpenAiProviderRoute,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct RouteScopedOpenAiPassthroughTargetPlan {
    targets: Vec<RouteScopedOpenAiPassthroughTarget>,
    failure_strategy: AiRouteFailureStrategy,
}

async fn select_route_scoped_openai_passthrough_target_plan_with_sticky<C>(
    catalog: &C,
    context: AuthenticatedApiKeyContext,
    intent: &RouteScopedOpenAiPassthroughIntent,
    sticky_store: Option<&StickyObjectRouteStore>,
) -> Result<RouteScopedOpenAiPassthroughTargetPlan, RouteScopedOpenAiPassthroughError>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    if let (Some(sticky_store), Some(lookup)) =
        (sticky_store, sticky_lookup_request(intent).as_ref())
    {
        if let Some(binding) = sticky_store
            .find(&context, &lookup.object_type, &lookup.object_id)
            .await?
        {
            let target = sticky_binding_to_passthrough_target(catalog, &context, intent, &binding)?;
            return Ok(RouteScopedOpenAiPassthroughTargetPlan {
                targets: vec![target],
                failure_strategy: intent.failure_strategy,
            });
        }
    }

    select_route_scoped_openai_passthrough_target_plan(catalog, context, intent)
}

fn select_route_scoped_openai_passthrough_target_plan<C>(
    catalog: &C,
    context: AuthenticatedApiKeyContext,
    intent: &RouteScopedOpenAiPassthroughIntent,
) -> Result<RouteScopedOpenAiPassthroughTargetPlan, RouteScopedOpenAiPassthroughError>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let failover_enabled = matches!(intent.failure_strategy, AiRouteFailureStrategy::Failover);
    let mut targets = match (
        intent.routes_model_when_present,
        intent.requested_model.as_deref(),
    ) {
        (true, Some(requested_model)) => {
            let resolved_request =
                resolve_route_scoped_request_model(catalog, &context, intent, requested_model)?;
            let plan =
                ProviderRouteSelector::new(catalog).select_plan(SelectProviderRouteQuery {
                    context: context.clone(),
                    catalog_key: resolved_request.routing_catalog_key.clone(),
                    requested_model: requested_model.to_owned(),
                    api_code: intent.api_code.clone(),
                    capability: intent.capability,
                    billing_meter: intent.billing_meter.clone(),
                })?;
            let mut resolved_targets = Vec::new();
            for selection in plan.routes {
                if let Some(target) = resolve_route_scoped_model_route_target(
                    catalog,
                    &context,
                    requested_model,
                    resolved_request.vendor_code.as_str(),
                    &resolved_request.mapping_scope,
                    selection,
                )? {
                    resolved_targets.push(target);
                }
            }
            resolved_targets
        }
        _ => {
            let selection = ProviderRouteSelector::new(catalog).select_channel_route(
                SelectProviderChannelRouteQuery {
                    context,
                    route_key: intent.route_key.clone(),
                    api_code: intent.api_code.clone(),
                    capability: intent.capability,
                },
            )?;
            vec![channel_route_to_passthrough_target(selection)]
        }
    };
    if targets.is_empty() {
        return Err(RouteScopedOpenAiPassthroughError::provider_route_unavailable(
            format!(
                "provider route is not available for configured channel route: selected route plan is empty for {}",
                intent.route_key
            ),
        ));
    }
    if !failover_enabled {
        targets.truncate(1);
    }
    Ok(RouteScopedOpenAiPassthroughTargetPlan {
        targets,
        failure_strategy: intent.failure_strategy,
    })
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct StickyLookupRequest {
    object_type: String,
    object_id: String,
}

fn sticky_lookup_request(
    intent: &RouteScopedOpenAiPassthroughIntent,
) -> Option<StickyLookupRequest> {
    if !matches!(
        intent.route_strategy,
        AiRouteStrategy::LookupSticky | AiRouteStrategy::ParentSticky
    ) {
        return None;
    }
    let object_type = intent.sticky_object_type?.trim();
    if object_type.is_empty() {
        return None;
    }
    let object_id = sticky_object_id_from_path(&intent.request_path, object_type)?;
    Some(StickyLookupRequest {
        object_type: object_type.to_owned(),
        object_id,
    })
}

fn sticky_binding_to_passthrough_target<C>(
    catalog: &C,
    context: &AuthenticatedApiKeyContext,
    intent: &RouteScopedOpenAiPassthroughIntent,
    binding: &StickyObjectRouteBinding,
) -> Result<RouteScopedOpenAiPassthroughTarget, RouteScopedOpenAiPassthroughError>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let channel_route = catalog
        .list_provider_channel_routes()
        .into_iter()
        .find(|route| {
            route.channel_id == binding.channel_id
                && binding_region_matches(&route.region_code, binding.region_code.as_deref())
        })
        .ok_or_else(|| {
            RouteScopedOpenAiPassthroughError::provider_route_unavailable(format!(
                "provider route is not available for sticky object {} {}: channel {} is not configured",
                binding.object_type, binding.object_id, binding.channel_id
            ))
        })?;

    if let (true, Some(requested_model)) = (
        intent.routes_model_when_present,
        intent.requested_model.as_deref(),
    ) {
        let channel_mapping = resolve_route_scoped_channel_mapping(
            catalog,
            context,
            requested_model,
            "",
            &channel_route,
        );
        let requested_catalog_key = channel_mapping
            .as_ref()
            .map(|rule| rule.effective_catalog_key())
            .unwrap_or(requested_model);
        let catalog_model = find_catalog_model_for_passthrough(catalog, requested_catalog_key)?;
        let route = catalog
            .list_provider_routes(&catalog_model.catalog_key)
            .into_iter()
            .find(|route| {
                route.channel_id == binding.channel_id
                    && binding_region_matches(&route.region_code, binding.region_code.as_deref())
            })
            .ok_or_else(|| {
                RouteScopedOpenAiPassthroughError::provider_route_unavailable(format!(
                    "provider route is not available for sticky object {} {}: channel {} does not serve model {}",
                    binding.object_type, binding.object_id, binding.channel_id, catalog_model.catalog_key
                ))
            })?;
        PricingResolver::new(catalog)
            .resolve(ResolveModelPriceQuery {
                api_key_id: context.api_key_id,
                channel_group_id: Some(sticky_binding_group_id(context, binding)),
                model: route.catalog_key.clone(),
                billing_meter: intent.billing_meter.clone(),
                provider_code: Some(route.provider_code.clone()),
                channel_id: Some(route.channel_id),
                region_code: Some(route.region_code.clone()),
            })
            .map_err(|error| {
                RouteScopedOpenAiPassthroughError::pricing_unavailable(error.to_string())
            })?;
        let (group_id, group_code, pricing_plan_code) =
            sticky_binding_group_context(catalog, context, binding);
        let provider_model = channel_mapping
            .as_ref()
            .and_then(|rule| rule.effective_provider_model().map(str::to_owned))
            .unwrap_or_else(|| route.provider_model.clone());
        return Ok(model_route_to_passthrough_target_with_provider_model(
            SelectedProviderRoute {
                route,
                group_id,
                group_code,
                pricing_plan_code,
                policy_id: None,
                rule_id: None,
            },
            provider_model,
        ));
    }

    Ok(channel_route_to_passthrough_target(
        selected_sticky_provider_channel_route(channel_route, catalog, context, binding),
    ))
}

fn selected_sticky_provider_channel_route<C>(
    route: ProviderChannelRoute,
    catalog: &C,
    context: &AuthenticatedApiKeyContext,
    binding: &StickyObjectRouteBinding,
) -> SelectedProviderChannelRoute
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let (group_id, group_code, pricing_plan_code) =
        sticky_binding_group_context(catalog, context, binding);
    SelectedProviderChannelRoute {
        route,
        group_id,
        group_code,
        pricing_plan_code,
        policy_id: None,
        rule_id: None,
    }
}

fn sticky_binding_group_context<C>(
    catalog: &C,
    context: &AuthenticatedApiKeyContext,
    binding: &StickyObjectRouteBinding,
) -> (i64, String, String)
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let group_id = sticky_binding_group_id(context, binding);
    if group_id == context.group_id {
        return (
            context.group_id,
            context.group_code.clone(),
            context.pricing_plan_code.clone(),
        );
    }

    catalog
        .find_channel_group(group_id)
        .map(|group| (group.id, group.code, group.pricing_plan_code))
        .unwrap_or_else(|| {
            (
                context.group_id,
                context.group_code.clone(),
                context.pricing_plan_code.clone(),
            )
        })
}

fn sticky_binding_group_id(
    context: &AuthenticatedApiKeyContext,
    binding: &StickyObjectRouteBinding,
) -> i64 {
    binding
        .channel_group_id
        .filter(|group_id| *group_id > 0)
        .unwrap_or(context.group_id)
}

fn binding_region_matches(route_region_code: &str, binding_region_code: Option<&str>) -> bool {
    binding_region_code
        .map(|binding_region_code| same_region_code(route_region_code, binding_region_code))
        .unwrap_or(true)
}

#[derive(Debug, Clone)]
struct RouteScopedResolvedModelRequest {
    routing_catalog_key: String,
    vendor_code: String,
    mapping_scope: RouteScopedModelMappingScope,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum RouteScopedModelMappingScope {
    Catalog,
    ScopedBinding,
}

fn resolve_route_scoped_request_model<C>(
    catalog: &C,
    context: &AuthenticatedApiKeyContext,
    intent: &RouteScopedOpenAiPassthroughIntent,
    requested_model: &str,
) -> Result<RouteScopedResolvedModelRequest, RouteScopedOpenAiPassthroughError>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    if let Some(resolved) = resolve_route_scoped_catalog_request_model(catalog, requested_model)? {
        return Ok(resolved);
    }
    if let Some(resolved) =
        resolve_route_scoped_binding_request_model(catalog, context, intent, requested_model)?
    {
        return Ok(resolved);
    }
    Err(RouteScopedOpenAiPassthroughError::model_not_found(
        requested_model,
    ))
}

fn resolve_route_scoped_catalog_request_model<C>(
    catalog: &C,
    requested_model: &str,
) -> Result<Option<RouteScopedResolvedModelRequest>, RouteScopedOpenAiPassthroughError>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let global_mapping =
        catalog.resolve_model_mapping(requested_model, &ResolveModelMappingContext::new());
    let global_effective_model = global_mapping
        .as_ref()
        .map(|rule| rule.effective_catalog_key())
        .unwrap_or(requested_model);
    let Some(global_catalog_model) =
        find_optional_catalog_model_for_passthrough(catalog, global_effective_model)?
    else {
        return Ok(None);
    };
    let vendor_mapping = catalog.resolve_model_mapping(
        requested_model,
        &ResolveModelMappingContext::new()
            .with_vendor_code(global_catalog_model.vendor_code.as_str()),
    );
    let effective_model = vendor_mapping
        .as_ref()
        .or(global_mapping.as_ref())
        .map(|rule| rule.effective_catalog_key())
        .unwrap_or(global_effective_model);
    let catalog_model = if effective_model == global_catalog_model.catalog_key
        || effective_model == global_catalog_model.model
    {
        global_catalog_model
    } else {
        find_catalog_model_for_passthrough(catalog, effective_model)?
    };
    Ok(Some(RouteScopedResolvedModelRequest {
        routing_catalog_key: route_scoped_route_scope_catalog_key(
            effective_model,
            &catalog_model.catalog_key,
        ),
        vendor_code: catalog_model.vendor_code,
        mapping_scope: RouteScopedModelMappingScope::Catalog,
    }))
}

fn resolve_route_scoped_binding_request_model<C>(
    catalog: &C,
    context: &AuthenticatedApiKeyContext,
    intent: &RouteScopedOpenAiPassthroughIntent,
    requested_model: &str,
) -> Result<Option<RouteScopedResolvedModelRequest>, RouteScopedOpenAiPassthroughError>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let mut channel_routes = route_scoped_candidate_channel_routes(catalog, context, intent);
    channel_routes.sort_by_key(|route| {
        (
            route.channel_id,
            route.credential_id.unwrap_or(i64::MAX),
            route.region_code.clone(),
        )
    });
    channel_routes.dedup_by(|left, right| {
        left.channel_id == right.channel_id
            && left.credential_id == right.credential_id
            && left.region_code == right.region_code
    });

    for channel_route in channel_routes {
        let Some(mapping) = resolve_route_scoped_channel_mapping(
            catalog,
            context,
            requested_model,
            "",
            &channel_route,
        ) else {
            continue;
        };
        let catalog_model =
            find_catalog_model_for_passthrough(catalog, mapping.effective_catalog_key())?;
        return Ok(Some(RouteScopedResolvedModelRequest {
            routing_catalog_key: route_scoped_route_scope_catalog_key(
                mapping.effective_catalog_key(),
                &catalog_model.catalog_key,
            ),
            vendor_code: catalog_model.vendor_code,
            mapping_scope: RouteScopedModelMappingScope::ScopedBinding,
        }));
    }
    Ok(None)
}

fn route_scoped_candidate_channel_routes<C>(
    catalog: &C,
    context: &AuthenticatedApiKeyContext,
    intent: &RouteScopedOpenAiPassthroughIntent,
) -> Vec<ProviderChannelRoute>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let routes = catalog.list_provider_channel_routes();
    let has_any_group_binding = routes.iter().any(|route| !route.group_bindings.is_empty());
    routes
        .into_iter()
        .filter(|route| {
            !has_any_group_binding
                || route.group_bindings.iter().any(|binding| {
                    binding.group_id == context.group_id
                        && route_scoped_binding_matches_api_scope(
                            binding.api_scope.as_slice(),
                            &intent.api_code,
                        )
                        && route_scoped_binding_matches_capability(
                            binding.capabilities.as_slice(),
                            intent.capability,
                        )
                })
        })
        .collect()
}

fn route_scoped_binding_matches_api_scope(api_scope: &[String], api_code: &str) -> bool {
    if api_scope.is_empty() {
        return true;
    }
    api_scope
        .iter()
        .any(|scope| route_scoped_scope_value_matches(scope, api_code))
}

fn route_scoped_binding_matches_capability(
    capabilities: &[String],
    capability: RoutingCapability,
) -> bool {
    if capabilities.is_empty() {
        return true;
    }
    let expected = route_scoped_capability_binding_codes(capability);
    capabilities.iter().any(|value| {
        expected
            .iter()
            .any(|expected| value.trim().eq_ignore_ascii_case(expected))
    })
}

fn route_scoped_capability_binding_codes(capability: RoutingCapability) -> &'static [&'static str] {
    match capability {
        RoutingCapability::Chat => &["llm", "chat", "text"],
        RoutingCapability::Image => &["image"],
        RoutingCapability::Audio => &["audio", "sfx", "speech"],
        RoutingCapability::Music => &["music"],
        RoutingCapability::Video => &["video"],
        RoutingCapability::Embedding => &["llm", "embedding", "embeddings"],
        RoutingCapability::Rerank => &["llm", "rerank", "ranking"],
        RoutingCapability::Network => &["network", "http"],
    }
}

fn route_scoped_scope_value_matches(scope: &str, key: &str) -> bool {
    let scope = route_scoped_normalize_scope_value(scope);
    let key = route_scoped_normalize_scope_value(key);
    !scope.is_empty() && !key.is_empty() && (scope == "*" || scope == "all" || scope == key)
}

fn route_scoped_normalize_scope_value(value: &str) -> String {
    let normalized = value
        .trim()
        .trim_matches('/')
        .to_ascii_lowercase()
        .replace(['/', ':', '-'], ".");
    normalized
        .strip_prefix("api.")
        .unwrap_or(&normalized)
        .trim_matches('.')
        .to_owned()
}

fn resolve_route_scoped_model_route_target<C>(
    catalog: &C,
    context: &AuthenticatedApiKeyContext,
    requested_model: &str,
    vendor_code: &str,
    mapping_scope: &RouteScopedModelMappingScope,
    selection: SelectedProviderRoute,
) -> Result<Option<RouteScopedOpenAiPassthroughTarget>, RouteScopedOpenAiPassthroughError>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let selected_group_id = selection.group_id;
    let selected_group_code = selection.group_code.clone();
    let selected_pricing_plan_code = selection.pricing_plan_code.clone();
    let selected_context = AuthenticatedApiKeyContext {
        group_id: selected_group_id,
        group_code: selected_group_code.clone(),
        pricing_plan_code: selected_pricing_plan_code.clone(),
        ..context.clone()
    };
    let mut model_route = selection.route;
    let channel_route = catalog
        .list_provider_channel_routes()
        .into_iter()
        .find(|route| {
            route.channel_id == model_route.channel_id
                && route.credential_id == model_route.credential_id
        })
        .ok_or_else(|| {
            RouteScopedOpenAiPassthroughError::provider_route_unavailable(format!(
                "provider route is not available for configured channel route: selected channel {} credential {:?} has no configured channel route for model {}",
                model_route.channel_id, model_route.credential_id, model_route.catalog_key
            ))
        })?;
    if !has_explicit_route_scoped_model_route(catalog, &model_route, &channel_route) {
        return Ok(None);
    }
    let channel_mapping = resolve_route_scoped_channel_mapping(
        catalog,
        &selected_context,
        requested_model,
        vendor_code,
        &channel_route,
    );
    if matches!(mapping_scope, RouteScopedModelMappingScope::ScopedBinding)
        && channel_mapping.is_none()
    {
        return Ok(None);
    }
    if let Some(rule) = channel_mapping.as_ref() {
        if rule.effective_catalog_key() != model_route.catalog_key {
            model_route = catalog
                .list_provider_routes(rule.effective_catalog_key())
                .into_iter()
                .find(|candidate| {
                    candidate.channel_id == model_route.channel_id
                        && candidate.credential_id == model_route.credential_id
                })
                .ok_or_else(|| {
                    RouteScopedOpenAiPassthroughError::provider_route_unavailable(format!(
                        "provider route is not available for configured channel route: channel {} has no mapped route for model {}",
                        model_route.channel_id,
                        rule.effective_catalog_key()
                    ))
                })?;
        }
    }
    if channel_route.provider_code != model_route.provider_code {
        return Err(RouteScopedOpenAiPassthroughError::provider_route_unavailable(
            format!(
                "provider route is not available for configured channel route: selected channel {} provider mismatch for model {}",
                model_route.channel_id, model_route.catalog_key
            ),
        ));
    }
    let provider_model = channel_mapping
        .as_ref()
        .and_then(|rule| rule.effective_provider_model().map(str::to_owned))
        .unwrap_or_else(|| model_route.provider_model.clone());
    Ok(Some(model_route_to_passthrough_target_with_provider_model(
        SelectedProviderRoute {
            route: model_route,
            group_id: selected_group_id,
            group_code: selected_group_code,
            pricing_plan_code: selected_pricing_plan_code,
            policy_id: selection.policy_id,
            rule_id: selection.rule_id,
        },
        provider_model,
    )))
}

fn has_explicit_route_scoped_model_route<C>(
    catalog: &C,
    model_route: &ModelProviderRoute,
    channel_route: &ProviderChannelRoute,
) -> bool
where
    C: PricingCatalog + Send + Sync + 'static,
{
    catalog
        .list_provider_routes(&model_route.catalog_key)
        .into_iter()
        .any(|route| {
            route.channel_id == model_route.channel_id
                && route.provider_code == model_route.provider_code
                && route.credential_id == model_route.credential_id
                && binding_region_matches(
                    &route.region_code,
                    Some(channel_route.region_code.as_str()),
                )
        })
}

fn resolve_route_scoped_channel_mapping<C>(
    catalog: &C,
    context: &AuthenticatedApiKeyContext,
    requested_model: &str,
    vendor_code: &str,
    channel_route: &ProviderChannelRoute,
) -> Option<ModelMappingRule>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    catalog.resolve_model_mapping(
        requested_model,
        &ResolveModelMappingContext::new()
            .with_channel_id(channel_route.channel_id)
            .with_channel_code(channel_route.channel_code.as_deref().unwrap_or_default())
            .with_channel_group_id(context.group_id)
            .with_channel_group_code(context.group_code.as_str())
            .with_vendor_code(vendor_code)
            .with_site(channel_route.site_id, channel_route.site_code.as_deref())
            .with_site_service(
                channel_route.site_service_id,
                channel_route.site_service_code.as_deref(),
            ),
    )
}

fn route_scoped_route_scope_catalog_key(requested_model: &str, model_catalog_key: &str) -> String {
    if requested_model.trim() == model_catalog_key.trim() {
        requested_model.trim().to_owned()
    } else {
        model_catalog_key.to_owned()
    }
}

fn same_region_code(left: &str, right: &str) -> bool {
    normalize_region_code(left).eq_ignore_ascii_case(&normalize_region_code(right))
}

fn normalize_region_code(value: &str) -> String {
    let value = value.trim();
    if value.is_empty() {
        "global".to_owned()
    } else {
        value.to_owned()
    }
}

fn model_route_to_passthrough_target_with_provider_model(
    selection: SelectedProviderRoute,
    provider_model: String,
) -> RouteScopedOpenAiPassthroughTarget {
    let route = selection.route;
    let usage_route = openai_provider_usage_route_from_model_route(
        route.catalog_key.clone(),
        selection.policy_id,
        selection.rule_id,
        selection.group_id,
        selection.group_code.clone(),
        selection.pricing_plan_code.clone(),
        route.provider_code.clone(),
        route.channel_id,
        provider_model.clone(),
        route.region_code.clone(),
        route.base_url.clone(),
        route.secret_ref.clone(),
        route.auth_profile.clone(),
        route.timeout_ms,
        route.retry_policy.clone(),
    );
    RouteScopedOpenAiPassthroughTarget {
        provider_code: route.provider_code,
        channel_id: route.channel_id,
        provider_model: Some(provider_model),
        base_url: route.base_url,
        secret_ref: route.secret_ref,
        auth_profile: route.auth_profile,
        retry_policy: route.retry_policy,
        usage_route: Some(usage_route.clone()),
        channel_usage_route: usage_route,
    }
}

fn openai_provider_usage_route_from_model_route(
    catalog_key: String,
    policy_id: Option<i64>,
    rule_id: Option<i64>,
    group_id: i64,
    group_code: String,
    pricing_plan_code: String,
    provider_code: String,
    channel_id: i64,
    provider_model: String,
    region_code: String,
    provider_base_url: Option<String>,
    provider_secret_ref: Option<String>,
    provider_auth_profile: ProviderAuthProfile,
    provider_timeout_ms: Option<u64>,
    provider_retry_policy: Option<ProviderRetryPolicy>,
) -> OpenAiProviderRoute {
    OpenAiProviderRoute {
        catalog_key,
        policy_id,
        rule_id,
        group_id,
        group_code,
        pricing_plan_code,
        provider_code,
        channel_id,
        provider_model,
        region_code,
        provider_base_url,
        provider_secret_ref,
        provider_auth_profile,
        provider_timeout_ms,
        provider_retry_policy,
    }
}

fn openai_provider_usage_route_from_channel_route(
    selection: &SelectedProviderChannelRoute,
) -> OpenAiProviderRoute {
    let route = &selection.route;
    OpenAiProviderRoute {
        catalog_key: default_route_scoped_api_request_catalog_key().to_owned(),
        policy_id: selection.policy_id,
        rule_id: selection.rule_id,
        group_id: selection.group_id,
        group_code: selection.group_code.clone(),
        pricing_plan_code: selection.pricing_plan_code.clone(),
        provider_code: route.provider_code.clone(),
        channel_id: route.channel_id,
        provider_model: provider_native_model_id(default_route_scoped_api_request_catalog_key()),
        region_code: route.region_code.clone(),
        provider_base_url: route.base_url.clone(),
        provider_secret_ref: route.secret_ref.clone(),
        provider_auth_profile: route.auth_profile.clone(),
        provider_timeout_ms: route.timeout_ms,
        provider_retry_policy: route.retry_policy.clone(),
    }
}

fn default_route_scoped_api_request_catalog_key() -> &'static str {
    "openai/gpt-4o-mini"
}

fn channel_route_to_passthrough_target(
    selection: SelectedProviderChannelRoute,
) -> RouteScopedOpenAiPassthroughTarget {
    let channel_usage_route = openai_provider_usage_route_from_channel_route(&selection);
    let route = selection.route;
    RouteScopedOpenAiPassthroughTarget {
        provider_code: route.provider_code,
        channel_id: route.channel_id,
        provider_model: None,
        base_url: route.base_url,
        secret_ref: route.secret_ref,
        auth_profile: route.auth_profile,
        retry_policy: route.retry_policy,
        usage_route: None,
        channel_usage_route,
    }
}

fn find_catalog_model_for_passthrough<C>(
    catalog: &C,
    model: &str,
) -> Result<AiModel, RouteScopedOpenAiPassthroughError>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    find_optional_catalog_model_for_passthrough(catalog, model)?
        .ok_or_else(|| RouteScopedOpenAiPassthroughError::model_not_found(model.trim()))
}

fn find_optional_catalog_model_for_passthrough<C>(
    catalog: &C,
    model: &str,
) -> Result<Option<AiModel>, RouteScopedOpenAiPassthroughError>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let model = model.trim();
    if let Some(catalog_model) = catalog.find_model(model) {
        return Ok(Some(catalog_model));
    }

    let matches = catalog
        .list_models(None)
        .into_iter()
        .filter(|candidate| candidate.model == model)
        .collect::<Vec<_>>();
    match matches.as_slice() {
        [] => Ok(None),
        [model] => Ok(Some(model.clone())),
        _ => Err(RouteScopedOpenAiPassthroughError::ambiguous_model(
            model, &matches,
        )),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use sdkwork_claw_product::domain::{
        ChannelGroup, DecimalValue, GatewayApiKey, ModelMappingRule, ModelPrice,
        ModelProviderRoute, ModelVendor, ModelVendorDefinition, Money, PriceSide, PricingPlan,
        RouteCandidate, RoutingPolicy, RoutingPolicyScope, RoutingRule,
    };
    use sdkwork_claw_product::infrastructure::InMemoryPricingCatalog;

    #[test]
    fn route_scoped_target_plan_honors_route_failure_strategy() {
        let mut catalog = route_scoped_test_catalog();
        add_route_scoped_test_route(&mut catalog, 3001, "openrouter-main", "gpt-4o-mini-main");
        add_route_scoped_test_route(
            &mut catalog,
            3002,
            "openrouter-fallback",
            "gpt-4o-mini-fallback",
        );
        add_route_scoped_test_policy(&mut catalog);

        let (parts, _body) = Request::builder()
            .method(Method::POST)
            .uri("/v1/chat/completions")
            .body(Body::empty())
            .unwrap()
            .into_parts();
        let stateless_intent = route_scoped_openai_passthrough_intent(
            &parts,
            br#"{"model":"gpt-4o-mini","messages":[]}"#,
        )
        .unwrap();
        let stateless_plan = select_route_scoped_openai_passthrough_target_plan(
            &catalog,
            route_scoped_test_context(),
            &stateless_intent,
        )
        .unwrap();
        assert_eq!(
            vec![3001, 3002],
            stateless_plan
                .targets
                .iter()
                .map(|target| target.channel_id)
                .collect::<Vec<_>>()
        );
        assert_eq!(
            AiRouteFailureStrategy::Failover,
            stateless_plan.failure_strategy
        );

        let (parts, _body) = Request::builder()
            .method(Method::POST)
            .uri("/v1/responses")
            .body(Body::empty())
            .unwrap()
            .into_parts();
        let sticky_create_intent = route_scoped_openai_passthrough_intent(
            &parts,
            br#"{"model":"gpt-4o-mini","input":"hello"}"#,
        )
        .unwrap();
        let sticky_plan = select_route_scoped_openai_passthrough_target_plan(
            &catalog,
            route_scoped_test_context(),
            &sticky_create_intent,
        )
        .unwrap();
        assert_eq!(
            vec![3001],
            sticky_plan
                .targets
                .iter()
                .map(|target| target.channel_id)
                .collect::<Vec<_>>()
        );
        assert_eq!(
            AiRouteFailureStrategy::FailClosed,
            sticky_plan.failure_strategy
        );
    }

    #[test]
    fn route_scoped_target_plan_resolves_channel_scoped_model_mapping_before_catalog_lookup() {
        let mut catalog = route_scoped_test_catalog();
        add_route_scoped_test_route(&mut catalog, 3001, "openrouter", "gpt-4o-mini");
        add_route_scoped_test_policy(&mut catalog);
        catalog.add_model_mapping(
            ModelMappingRule::new(
                91001,
                sdkwork_claw_product::domain::ModelMappingBindingType::Channel,
                "gpt-5.5",
                "gpt-4o-mini",
                1,
            )
            .with_binding_id(3001)
            .with_target_vendor_code("openai")
            .with_target_catalog_key("openai/gpt-4o-mini")
            .with_target_provider_model("gpt-4o-mini"),
        );

        let (parts, _body) = Request::builder()
            .method(Method::POST)
            .uri("/v1/chat/completions")
            .body(Body::empty())
            .unwrap()
            .into_parts();
        let intent =
            route_scoped_openai_passthrough_intent(&parts, br#"{"model":"gpt-5.5","messages":[]}"#)
                .unwrap();

        let plan = select_route_scoped_openai_passthrough_target_plan(
            &catalog,
            route_scoped_test_context(),
            &intent,
        )
        .unwrap();

        assert_eq!(1, plan.targets.len());
        assert_eq!(3001, plan.targets[0].channel_id);
        assert_eq!(
            Some("gpt-4o-mini"),
            plan.targets[0].provider_model.as_deref()
        );
        assert_eq!(
            "openai/gpt-4o-mini",
            plan.targets[0].channel_usage_route.catalog_key
        );
    }

    #[test]
    fn route_scoped_target_plan_limits_scoped_alias_to_channels_with_matching_mapping() {
        let mut catalog = route_scoped_test_catalog();
        add_route_scoped_test_route(&mut catalog, 3001, "openrouter-main", "gpt-4o-mini-main");
        add_route_scoped_test_route(
            &mut catalog,
            3002,
            "openrouter-fallback",
            "gpt-4o-mini-fallback",
        );
        add_route_scoped_test_policy(&mut catalog);
        catalog.add_model_mapping(
            ModelMappingRule::new(
                91001,
                sdkwork_claw_product::domain::ModelMappingBindingType::Channel,
                "gpt-5.5",
                "gpt-4o-mini",
                1,
            )
            .with_binding_id(3001)
            .with_target_vendor_code("openai")
            .with_target_catalog_key("openai/gpt-4o-mini")
            .with_target_provider_model("gpt-4o-mini-main"),
        );

        let (parts, _body) = Request::builder()
            .method(Method::POST)
            .uri("/v1/chat/completions")
            .body(Body::empty())
            .unwrap()
            .into_parts();
        let intent =
            route_scoped_openai_passthrough_intent(&parts, br#"{"model":"gpt-5.5","messages":[]}"#)
                .unwrap();

        let plan = select_route_scoped_openai_passthrough_target_plan(
            &catalog,
            route_scoped_test_context(),
            &intent,
        )
        .unwrap();

        assert_eq!(
            vec![3001],
            plan.targets
                .iter()
                .map(|target| target.channel_id)
                .collect::<Vec<_>>()
        );
        assert_eq!(
            Some("gpt-4o-mini-main"),
            plan.targets[0].provider_model.as_deref()
        );
    }

    #[test]
    fn route_scoped_target_plan_rejects_scoped_alias_without_explicit_target_model_route() {
        let mut catalog = route_scoped_test_catalog();
        catalog.add_provider_channel_route(
            ProviderChannelRoute::new("openrouter", 3001).with_provider_endpoint(
                Some("http://provider.example/openrouter".to_owned()),
                Some("vault://providers/openrouter/account/main".to_owned()),
            ),
        );
        add_route_scoped_test_policy(&mut catalog);
        catalog.add_model_mapping(
            ModelMappingRule::new(
                91001,
                sdkwork_claw_product::domain::ModelMappingBindingType::Channel,
                "gpt-5.5",
                "gpt-4o-mini",
                1,
            )
            .with_binding_id(3001)
            .with_target_vendor_code("openai")
            .with_target_catalog_key("openai/gpt-4o-mini")
            .with_target_provider_model("gpt-4o-mini-main"),
        );

        let (parts, _body) = Request::builder()
            .method(Method::POST)
            .uri("/v1/chat/completions")
            .body(Body::empty())
            .unwrap()
            .into_parts();
        let intent =
            route_scoped_openai_passthrough_intent(&parts, br#"{"model":"gpt-5.5","messages":[]}"#)
                .unwrap();

        let error = select_route_scoped_openai_passthrough_target_plan(
            &catalog,
            route_scoped_test_context(),
            &intent,
        )
        .unwrap_err();

        assert_eq!("provider_route_not_available", error.code);
        assert!(error.message.contains("selected route plan is empty"));
    }

    #[test]
    fn route_scoped_intent_carries_route_strategy_profile() {
        let (parts, _body) = Request::builder()
            .method(Method::POST)
            .uri("/v1/responses")
            .body(Body::empty())
            .unwrap()
            .into_parts();
        let intent = route_scoped_openai_passthrough_intent(
            &parts,
            br#"{"model":"gpt-4o-mini","input":"hello"}"#,
        )
        .unwrap();

        assert_eq!(AiRouteStrategy::CreateThenSticky, intent.route_strategy);
        assert_eq!(AiRouteFailureStrategy::FailClosed, intent.failure_strategy);
        assert_eq!(AiRouteModelRequirement::Required, intent.model_requirement);
        assert_eq!(Some("response"), intent.sticky_object_type);
        assert_eq!(Some("object"), intent.sticky_scope);
        assert_eq!(Some("gpt-4o-mini"), intent.requested_model.as_deref());

        let (parts, _body) = Request::builder()
            .method(Method::GET)
            .uri("/v1/files/file_123/content")
            .body(Body::empty())
            .unwrap()
            .into_parts();
        let intent = route_scoped_openai_passthrough_intent(&parts, &[]).unwrap();

        assert_eq!(AiRouteStrategy::LookupSticky, intent.route_strategy);
        assert_eq!(AiRouteFailureStrategy::FailClosed, intent.failure_strategy);
        assert_eq!(AiRouteModelRequirement::Ignored, intent.model_requirement);
        assert_eq!(Some("file"), intent.sticky_object_type);
        assert_eq!(Some("object"), intent.sticky_scope);
        assert_eq!(None, intent.requested_model);
    }

    #[test]
    fn route_scoped_strategy_profile_validation_rejects_inconsistent_sticky_metadata() {
        let mut intent = RouteScopedOpenAiPassthroughIntent {
            requested_model: None,
            requested_model_source: None,
            request_path: "/v1/files/file_123".to_owned(),
            route_key: "openai/management/files".to_owned(),
            api_code: "openai.files".to_owned(),
            capability: RoutingCapability::Network,
            billing_meter: BillingMeter::ApiRequest,
            route_strategy: AiRouteStrategy::LookupSticky,
            failure_strategy: AiRouteFailureStrategy::Failover,
            model_requirement: AiRouteModelRequirement::Ignored,
            sticky_object_type: None,
            sticky_scope: None,
            routes_model_when_present: false,
        };

        let error = validate_route_scoped_strategy_profile(&intent).unwrap_err();
        assert_eq!(StatusCode::INTERNAL_SERVER_ERROR, error.status);
        assert_eq!("route_strategy_invalid", error.code);

        intent.failure_strategy = AiRouteFailureStrategy::FailClosed;
        intent.sticky_object_type = Some("file");
        intent.sticky_scope = Some("object");
        validate_route_scoped_strategy_profile(&intent).unwrap();
    }

    #[test]
    fn sticky_object_id_extractor_handles_lifecycle_path_shapes() {
        for (path, object_type, expected_id) in [
            ("/v1/responses/resp_123", "response", "resp_123"),
            ("/v1/files/file_123/content", "file", "file_123"),
            ("/v1/vector_stores/vs_123/search", "vector_store", "vs_123"),
            ("/v1/batches/batch_123/cancel", "batch", "batch_123"),
            (
                "/v1/fine_tuning/jobs/ftjob_123/events",
                "fine_tuning_job",
                "ftjob_123",
            ),
            (
                "/v1/realtime/calls/call_123/hangup",
                "realtime_call",
                "call_123",
            ),
            (
                "/v1/organization/projects/proj_123/archive",
                "project",
                "proj_123",
            ),
        ] {
            assert_eq!(
                Some(expected_id.to_owned()),
                sticky_object_id_from_path(path, object_type),
                "{path} should extract {object_type}"
            );
        }
    }

    #[test]
    fn passthrough_catalog_lookup_accepts_native_slash_model_ids() {
        let mut catalog = InMemoryPricingCatalog::default();
        catalog.add_model(
            AiModel::new(
                "anthropic/claude-3-opus",
                "Claude 3 Opus via OpenRouter",
                "openrouter",
                vec!["chat"],
            )
            .with_catalog_key("openrouter/anthropic/claude-3-opus"),
        );

        let model = find_catalog_model_for_passthrough(&catalog, "anthropic/claude-3-opus")
            .expect("native slash model should resolve through AiModel.model");

        assert_eq!("openrouter/anthropic/claude-3-opus", model.catalog_key);
        assert_eq!("anthropic/claude-3-opus", model.model);
    }

    #[test]
    fn model_route_passthrough_target_preserves_selected_region_context() {
        let route = ModelProviderRoute::new_for_catalog_key(
            "openai/gpt-4o-mini",
            "gpt-4o-mini",
            "openrouter",
            3001,
            "openrouter/gpt-4o-mini",
        )
        .with_region_code("cn")
        .with_provider_endpoint(
            Some("https://cn.openrouter.example/v1".to_owned()),
            Some("vault://providers/openrouter/cn".to_owned()),
        );

        let target = model_route_to_passthrough_target_with_provider_model(
            SelectedProviderRoute {
                route,
                group_id: 10,
                group_code: "standard-group".to_owned(),
                pricing_plan_code: "standard".to_owned(),
                policy_id: Some(9001),
                rule_id: Some(9102),
            },
            "openrouter/gpt-4o-mini".to_owned(),
        );

        let usage_route = target.usage_route.as_ref().unwrap();
        assert_eq!("cn", usage_route.region_code);
        assert_eq!("cn", target.channel_usage_route.region_code);
    }

    #[test]
    fn sticky_binding_lookup_preserves_bound_region_for_same_channel_deployments() {
        let mut catalog = route_scoped_test_catalog();
        catalog.add_provider_channel_route(
            ProviderChannelRoute::new("openrouter", 3001)
                .with_region_code("global")
                .with_provider_endpoint(
                    Some("https://global.openrouter.example/v1".to_owned()),
                    Some("vault://providers/openrouter/global".to_owned()),
                ),
        );
        catalog.add_provider_channel_route(
            ProviderChannelRoute::new("openrouter", 3001)
                .with_region_code("cn")
                .with_provider_endpoint(
                    Some("https://cn.openrouter.example/v1".to_owned()),
                    Some("vault://providers/openrouter/cn".to_owned()),
                ),
        );
        let binding = StickyObjectRouteBinding {
            object_type: "file".to_owned(),
            object_id: "file_123".to_owned(),
            parent_object_type: None,
            parent_object_id: None,
            provider_code: "openrouter".to_owned(),
            channel_id: 3001,
            channel_group_id: None,
            vendor_code: None,
            api_code: Some("openai.files".to_owned()),
            catalog_key: None,
            provider_model: None,
            region_code: Some("cn".to_owned()),
            sticky_scope: Some("object".to_owned()),
        };
        let intent = RouteScopedOpenAiPassthroughIntent {
            requested_model: None,
            requested_model_source: None,
            request_path: "/v1/files/file_123/content".to_owned(),
            route_key: "openai/management/files".to_owned(),
            api_code: "openai.files".to_owned(),
            capability: RoutingCapability::Network,
            billing_meter: BillingMeter::ApiRequest,
            route_strategy: AiRouteStrategy::LookupSticky,
            failure_strategy: AiRouteFailureStrategy::FailClosed,
            model_requirement: AiRouteModelRequirement::Ignored,
            sticky_object_type: Some("file"),
            sticky_scope: Some("object"),
            routes_model_when_present: false,
        };

        let target = sticky_binding_to_passthrough_target(
            &catalog,
            &route_scoped_test_context(),
            &intent,
            &binding,
        )
        .unwrap();

        assert_eq!("cn", target.channel_usage_route.region_code);
        assert_eq!(
            Some("https://cn.openrouter.example/v1".to_owned()),
            target.base_url
        );
    }

    #[test]
    fn sticky_binding_lookup_resolves_channel_scoped_model_mapping_before_catalog_lookup() {
        let mut catalog = route_scoped_test_catalog();
        add_route_scoped_test_route(&mut catalog, 3001, "openrouter", "gpt-4o-mini-main");
        catalog.add_model_mapping(
            ModelMappingRule::new(
                91001,
                sdkwork_claw_product::domain::ModelMappingBindingType::Channel,
                "gpt-5.5",
                "gpt-4o-mini",
                1,
            )
            .with_binding_id(3001)
            .with_target_vendor_code("openai")
            .with_target_catalog_key("openai/gpt-4o-mini")
            .with_target_provider_model("gpt-4o-mini-main"),
        );
        let binding = StickyObjectRouteBinding {
            object_type: "response".to_owned(),
            object_id: "resp_123".to_owned(),
            parent_object_type: None,
            parent_object_id: None,
            provider_code: "openrouter".to_owned(),
            channel_id: 3001,
            channel_group_id: None,
            vendor_code: None,
            api_code: Some("openai.responses".to_owned()),
            catalog_key: Some("openai/gpt-4o-mini".to_owned()),
            provider_model: Some("gpt-4o-mini-main".to_owned()),
            region_code: Some("global".to_owned()),
            sticky_scope: Some("object".to_owned()),
        };
        let intent = RouteScopedOpenAiPassthroughIntent {
            requested_model: Some("gpt-5.5".to_owned()),
            requested_model_source: None,
            request_path: "/v1/responses/resp_123".to_owned(),
            route_key: "openai/responses".to_owned(),
            api_code: "openai.responses".to_owned(),
            capability: RoutingCapability::Chat,
            billing_meter: BillingMeter::LlmInputToken,
            route_strategy: AiRouteStrategy::LookupSticky,
            failure_strategy: AiRouteFailureStrategy::FailClosed,
            model_requirement: AiRouteModelRequirement::Required,
            sticky_object_type: Some("response"),
            sticky_scope: Some("object"),
            routes_model_when_present: true,
        };

        let target = sticky_binding_to_passthrough_target(
            &catalog,
            &route_scoped_test_context(),
            &intent,
            &binding,
        )
        .unwrap();

        assert_eq!(3001, target.channel_id);
        assert_eq!(Some("gpt-4o-mini-main"), target.provider_model.as_deref());
        assert_eq!("openai/gpt-4o-mini", target.channel_usage_route.catalog_key);
    }

    #[test]
    fn route_scoped_pricing_snapshots_include_selected_region_context() {
        let mut catalog = route_scoped_test_catalog();
        catalog.add_provider_route(
            ModelProviderRoute::new_for_catalog_key(
                "openai/gpt-4o-mini",
                "gpt-4o-mini",
                "openrouter",
                3001,
                "openrouter/gpt-4o-mini",
            )
            .with_region_code("cn")
            .with_provider_endpoint(
                Some("https://cn.openrouter.example/v1".to_owned()),
                Some("vault://providers/openrouter/cn".to_owned()),
            ),
        );
        catalog.add_price(
            ModelPrice::new_for_catalog_key(
                "openai/gpt-4o-mini",
                "gpt-4o-mini",
                PriceSide::OfficialReference,
                BillingMeter::ImageResult,
                Money::cny("0.020000").unwrap(),
            )
            .with_region_code("cn"),
        );
        catalog.add_price(
            ModelPrice::new_for_catalog_key(
                "openai/gpt-4o-mini",
                "gpt-4o-mini",
                PriceSide::UpstreamCost,
                BillingMeter::ImageResult,
                Money::cny("0.010000").unwrap(),
            )
            .for_provider("openrouter", 3001)
            .with_region_code("cn"),
        );
        let context = RouteScopedMeteredUsageContext {
            api_key_context: route_scoped_test_context(),
            request_id: Some("req-1".to_owned()),
            trace_id: Some("trace-1".to_owned()),
            requested_model: "gpt-4o-mini".to_owned(),
            request_body: json!({}),
            request_path: "/v1/images/generations".to_owned(),
            http_method: "POST".to_owned(),
            user_agent: None,
            billing_meter: BillingMeter::ImageResult,
        };
        let route = OpenAiProviderRoute {
            catalog_key: "openai/gpt-4o-mini".to_owned(),
            policy_id: Some(9001),
            rule_id: Some(9102),
            group_id: context.api_key_context.group_id,
            group_code: context.api_key_context.group_code.clone(),
            pricing_plan_code: context.api_key_context.pricing_plan_code.clone(),
            provider_code: "openrouter".to_owned(),
            channel_id: 3001,
            provider_model: "openrouter/gpt-4o-mini".to_owned(),
            region_code: "cn".to_owned(),
            provider_base_url: Some("https://cn.openrouter.example/v1".to_owned()),
            provider_secret_ref: Some("vault://providers/openrouter/cn".to_owned()),
            provider_auth_profile: ProviderAuthProfile::default(),
            provider_timeout_ms: None,
            provider_retry_policy: None,
        };
        let price = PricingResolver::new(&catalog)
            .resolve(ResolveModelPriceQuery {
                api_key_id: context.api_key_context.api_key_id,
                channel_group_id: Some(route.group_id),
                model: route.catalog_key.clone(),
                billing_meter: context.billing_meter.clone(),
                provider_code: Some(route.provider_code.clone()),
                channel_id: Some(route.channel_id),
                region_code: Some(route.region_code.clone()),
            })
            .unwrap();

        let snapshot = route_scoped_metered_pricing_snapshot(
            &context,
            &route,
            "openrouter/gpt-4o-mini",
            &price,
            "1",
        );

        assert!(snapshot.contains(r#""regionCode":"cn""#), "{snapshot}");
    }

    #[test]
    fn route_scoped_uri_preserves_query_model_when_selected_model_came_from_body() {
        let target = ProviderPassthroughTarget::new(
            "openrouter",
            "https://upstream.example/v1".to_owned(),
            ProviderPassthroughAuth::bearer("sk-upstream").unwrap(),
            Vec::new(),
        );

        let uri = build_route_scoped_openai_passthrough_uri(
            &target,
            &"/v1/responses?model=query-filter&include=usage"
                .parse()
                .unwrap(),
            Some("openrouter/gpt-4o-mini"),
            Some(openai_passthrough_payload::OpenAiPassthroughModelSource::Body),
        )
        .unwrap();

        assert_eq!(
            "https://upstream.example/v1/responses?model=query-filter&include=usage",
            uri.to_string()
        );
    }

    #[test]
    fn route_scoped_uri_rewrites_query_model_when_selected_model_came_from_query() {
        let target = ProviderPassthroughTarget::new(
            "openrouter",
            "https://upstream.example/v1".to_owned(),
            ProviderPassthroughAuth::bearer("sk-upstream").unwrap(),
            Vec::new(),
        );

        let uri = build_route_scoped_openai_passthrough_uri(
            &target,
            &"/v1/responses/input_tokens?model=gpt-4o-mini&include=usage"
                .parse()
                .unwrap(),
            Some("openrouter/gpt-4o-mini"),
            Some(openai_passthrough_payload::OpenAiPassthroughModelSource::Query),
        )
        .unwrap();

        assert_eq!(
            "https://upstream.example/v1/responses/input_tokens?model=openrouter%2Fgpt-4o-mini&include=usage",
            uri.to_string()
        );
    }

    #[test]
    fn route_scoped_uri_appends_provider_query_auth() {
        let target = ProviderPassthroughTarget::new(
            "google",
            "https://generativelanguage.googleapis.com/v1beta".to_owned(),
            ProviderPassthroughAuth::query("key", "sk-google+query/value").unwrap(),
            Vec::new(),
        );

        let uri = build_route_scoped_openai_passthrough_uri(
            &target,
            &"/v1/files?purpose=assistants".parse().unwrap(),
            None,
            None,
        )
        .unwrap();

        assert_eq!(
            "https://generativelanguage.googleapis.com/v1beta/v1/files?purpose=assistants&key=sk-google%2Bquery%2Fvalue",
            uri.to_string()
        );
    }

    fn route_scoped_test_catalog() -> InMemoryPricingCatalog {
        let mut catalog = InMemoryPricingCatalog::default();
        catalog.add_vendor(ModelVendorDefinition::new(
            "openai",
            ModelVendor::OpenAi,
            "OpenAI",
        ));
        catalog.add_model(
            AiModel::new(
                "gpt-4o-mini",
                "GPT-4o mini",
                "openai",
                vec!["chat", "responses"],
            )
            .with_catalog_key("openai/gpt-4o-mini"),
        );
        catalog.add_plan(PricingPlan::new(
            "standard",
            PriceSide::OfficialReference,
            DecimalValue::parse("1.200000").unwrap(),
            Money::usd("0.000000").unwrap(),
        ));
        catalog.add_channel_group(ChannelGroup::new(
            10,
            "standard-group",
            "standard",
            DecimalValue::parse("1.000000").unwrap(),
            DecimalValue::parse("1.100000").unwrap(),
        ));
        catalog.add_api_key(
            GatewayApiKey::new(100, 10, "sk-test", "hash:sk-test").with_owner(10, 20, 30),
        );
        catalog.add_price(ModelPrice::new_for_catalog_key(
            "openai/gpt-4o-mini",
            "gpt-4o-mini",
            PriceSide::OfficialReference,
            BillingMeter::LlmInputToken,
            Money::usd("0.150000").unwrap(),
        ));
        catalog
    }

    fn add_route_scoped_test_route(
        catalog: &mut InMemoryPricingCatalog,
        channel_id: i64,
        provider_code: &str,
        provider_model: &str,
    ) {
        catalog.add_provider_channel_route(
            ProviderChannelRoute::new(provider_code, channel_id).with_provider_endpoint(
                Some(format!("http://provider.example/{provider_code}")),
                Some(format!("vault://providers/{provider_code}/account/main")),
            ),
        );
        catalog.add_provider_route(
            ModelProviderRoute::new_for_catalog_key(
                "openai/gpt-4o-mini",
                "gpt-4o-mini",
                provider_code,
                channel_id,
                provider_model,
            )
            .with_provider_endpoint(
                Some(format!("http://provider.example/{provider_code}")),
                Some(format!("vault://providers/{provider_code}/account/main")),
            ),
        );
        catalog.add_price(
            ModelPrice::new_for_catalog_key(
                "openai/gpt-4o-mini",
                "gpt-4o-mini",
                PriceSide::UpstreamCost,
                BillingMeter::LlmInputToken,
                Money::usd("0.110000").unwrap(),
            )
            .for_provider(provider_code, channel_id),
        );
    }

    fn add_route_scoped_test_policy(catalog: &mut InMemoryPricingCatalog) {
        catalog.add_routing_policy(RoutingPolicy::new(
            9001,
            10,
            20,
            "standard-group-policy",
            RoutingPolicyScope::ChannelGroup,
            Some(10),
            Some(9101),
        ));
        catalog.add_routing_rule(
            RoutingRule::new(
                9102,
                10,
                20,
                9101,
                "standard-group-gpt-4o-mini",
                1,
                r#"{"catalogKey":"openai/gpt-4o-mini"}"#,
                "openai/gpt-4o-mini",
            )
            .with_candidate_channels(vec![RouteCandidate::new(3001, 100)])
            .with_fallback_chain(vec![RouteCandidate::new(3002, 50)]),
        );
    }

    fn route_scoped_test_context() -> AuthenticatedApiKeyContext {
        AuthenticatedApiKeyContext {
            api_key_id: 100,
            tenant_id: 10,
            organization_id: 20,
            user_id: 30,
            api_key_name_snapshot: "sk-test".to_owned(),
            group_id: 10,
            group_code: "standard-group".to_owned(),
            pricing_plan_code: "standard".to_owned(),
        }
    }
}
