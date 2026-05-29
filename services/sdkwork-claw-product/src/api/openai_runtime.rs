use axum::http::StatusCode;
use axum::response::Response;
use sdkwork_claw_http::ApiKeyIdentity;

use crate::api::openai_error::openai_error;
use crate::application::{
    ApiKeyAuthenticator, ApiKeySecretHasher, AuthenticateApiKeyQuery, AuthenticatedApiKeyContext,
    ProviderRouteSelectionError, ProviderRouteSelectionErrorKind, ProviderRouteSelector,
    SelectProviderRouteQuery, SelectedProviderRoute,
};
use crate::domain::{
    AiModel, BillingMeter, ProviderAuthProfile, ProviderRetryPolicy, RoutingCapability,
};
use crate::ports::PricingCatalog;

pub(crate) type OpenAiRouteError = Box<Response>;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ResolvedOpenAiProviderRoute {
    pub catalog_key: String,
    pub policy_id: Option<i64>,
    pub rule_id: Option<i64>,
    pub provider_code: String,
    pub channel_id: i64,
    pub provider_model: String,
    pub provider_base_url: Option<String>,
    pub provider_secret_ref: Option<String>,
    pub provider_auth_profile: ProviderAuthProfile,
    pub provider_timeout_ms: Option<u64>,
    pub provider_retry_policy: Option<ProviderRetryPolicy>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ResolvedOpenAiProviderRoutePlan {
    pub catalog_key: String,
    pub routes: Vec<ResolvedOpenAiProviderRoute>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum OpenAiRuntimeFailureStrategy {
    Failover,
    FailClosed,
}

impl OpenAiRuntimeFailureStrategy {
    pub fn should_try_next_route(self, is_last_route: bool) -> bool {
        matches!(self, Self::Failover) && !is_last_route
    }
}

impl Default for OpenAiRuntimeFailureStrategy {
    fn default() -> Self {
        Self::Failover
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct OpenAiRuntimeRouteConfig {
    pub default_retry_policy: ProviderRetryPolicy,
    pub failure_strategy: OpenAiRuntimeFailureStrategy,
}

impl OpenAiRuntimeRouteConfig {
    pub fn new(
        default_retry_policy: ProviderRetryPolicy,
        failure_strategy: OpenAiRuntimeFailureStrategy,
    ) -> Self {
        Self {
            default_retry_policy,
            failure_strategy,
        }
    }
}

impl Default for OpenAiRuntimeRouteConfig {
    fn default() -> Self {
        Self {
            default_retry_policy: ProviderRetryPolicy::default(),
            failure_strategy: OpenAiRuntimeFailureStrategy::default(),
        }
    }
}

pub(super) fn authenticate_api_key<C>(
    catalog: &C,
    api_key_hasher: &(dyn ApiKeySecretHasher + Send + Sync),
    identity: &ApiKeyIdentity,
) -> Result<AuthenticatedApiKeyContext, OpenAiRouteError>
where
    C: PricingCatalog,
{
    let Some(credential_secret) = identity.credential_secret() else {
        return Err(Box::new(openai_error(
            StatusCode::UNAUTHORIZED,
            "invalid_api_key",
            "invalid_request_error",
            "missing api key credential",
        )));
    };
    let authenticator = ApiKeyAuthenticator::new(catalog, api_key_hasher);
    authenticator
        .authenticate(AuthenticateApiKeyQuery { credential_secret })
        .map_err(|_| {
            Box::new(openai_error(
                StatusCode::UNAUTHORIZED,
                "invalid_api_key",
                "invalid_request_error",
                "api key credential is invalid",
            ))
        })
}

pub(super) fn find_catalog_model<C>(catalog: &C, model: &str) -> Result<AiModel, OpenAiRouteError>
where
    C: PricingCatalog,
{
    let model = model.trim();
    if let Some(catalog_model) = catalog.find_model(model) {
        return Ok(catalog_model);
    }

    let matches = catalog
        .list_models(None)
        .into_iter()
        .filter(|candidate| candidate.model == model)
        .collect::<Vec<_>>();
    match matches.as_slice() {
        [] => Err(model_not_found(model)),
        [model] => Ok(model.clone()),
        _ => Err(Box::new(openai_error(
            StatusCode::BAD_REQUEST,
            "ambiguous_model",
            "invalid_request_error",
            format!(
                "model id is ambiguous: {model}. Use one of these catalog keys: {}",
                matches
                    .iter()
                    .map(|candidate| candidate.catalog_key.as_str())
                    .collect::<Vec<_>>()
                    .join(", ")
            ),
        ))),
    }
}

fn model_not_found(model: &str) -> OpenAiRouteError {
    Box::new(openai_error(
        StatusCode::NOT_FOUND,
        "model_not_found",
        "invalid_request_error",
        format!("model is not available: {model}"),
    ))
}

pub(super) fn ensure_model_capability(
    model: &AiModel,
    accepted_capabilities: &[&str],
    capability_label: &str,
) -> Result<(), OpenAiRouteError> {
    let supported = model.capabilities.iter().any(|capability| {
        let normalized = capability.trim().to_ascii_lowercase();
        accepted_capabilities
            .iter()
            .any(|accepted| normalized == *accepted)
    });
    if supported {
        return Ok(());
    }
    Err(Box::new(openai_error(
        StatusCode::BAD_REQUEST,
        "model_capability_not_supported",
        "invalid_request_error",
        format!("model does not support {capability_label}: {}", model.model),
    )))
}

#[allow(dead_code)]
pub(super) fn resolve_openai_provider_route<C>(
    catalog: &C,
    context: &AuthenticatedApiKeyContext,
    model: &str,
    accepted_capabilities: &[&str],
    capability_label: &str,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
) -> Result<ResolvedOpenAiProviderRoute, OpenAiRouteError>
where
    C: PricingCatalog,
{
    Ok(resolve_openai_provider_route_plan(
        catalog,
        context,
        model,
        accepted_capabilities,
        capability_label,
        capability,
        billing_meter,
    )?
    .first_route())
}

pub(crate) fn resolve_openai_provider_route_plan<C>(
    catalog: &C,
    context: &AuthenticatedApiKeyContext,
    model: &str,
    accepted_capabilities: &[&str],
    capability_label: &str,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
) -> Result<ResolvedOpenAiProviderRoutePlan, OpenAiRouteError>
where
    C: PricingCatalog,
{
    let catalog_model = find_catalog_model(catalog, model)?;
    ensure_model_capability(&catalog_model, accepted_capabilities, capability_label)?;
    let model_catalog_key = catalog_model.catalog_key;
    let routing_catalog_key = route_scope_catalog_key(model, &model_catalog_key);
    let model_plan = ProviderRouteSelector::new(catalog)
        .select_plan(SelectProviderRouteQuery {
            context: context.clone(),
            catalog_key: routing_catalog_key.clone(),
            requested_model: model.to_owned(),
            capability,
            billing_meter,
        })
        .map_err(provider_route_selection_error)?;
    let channel_routes = catalog.list_provider_channel_routes();
    let routes = model_plan
        .routes
        .into_iter()
        .map(|selection| {
            resolve_model_route(routing_catalog_key.as_str(), selection, &channel_routes)
        })
        .collect::<Result<Vec<_>, _>>()?;
    if routes.is_empty() {
        return Err(provider_route_selection_error(
            ProviderRouteSelectionError::provider_route_unavailable(format!(
                "provider route is not available for configured channel route: route plan is empty for model {}",
                routing_catalog_key
            )),
        ));
    }
    Ok(ResolvedOpenAiProviderRoutePlan {
        catalog_key: routing_catalog_key,
        routes,
    })
}

fn route_scope_catalog_key(requested_model: &str, model_catalog_key: &str) -> String {
    if requested_model.trim() == model_catalog_key.trim() {
        requested_model.trim().to_owned()
    } else {
        model_catalog_key.to_owned()
    }
}

fn resolve_model_route(
    catalog_key: &str,
    selection: SelectedProviderRoute,
    channel_routes: &[crate::domain::ProviderChannelRoute],
) -> Result<ResolvedOpenAiProviderRoute, OpenAiRouteError> {
    let model_route = selection.route;
    let channel_route = channel_routes
        .iter()
        .find(|route| route.channel_id == model_route.channel_id)
        .cloned()
        .ok_or_else(|| {
            provider_route_selection_error(ProviderRouteSelectionError::provider_route_unavailable(
                format!(
                    "provider route is not available for configured channel route: selected channel {} has no configured channel route for model {}",
                    model_route.channel_id, catalog_key
                ),
            ))
        })?;
    if channel_route.provider_code != model_route.provider_code {
        return Err(provider_route_selection_error(
            ProviderRouteSelectionError::provider_route_unavailable(format!(
                "provider route is not available for configured channel route: selected channel {} provider mismatch for model {}",
                model_route.channel_id, catalog_key
            )),
        ));
    }
    if !has_text(channel_route.base_url.as_deref())
        || !has_text(channel_route.secret_ref.as_deref())
    {
        return Err(provider_route_selection_error(
            ProviderRouteSelectionError::provider_route_unavailable(format!(
                "provider route is not available for configured channel route: selected channel {} is missing callable channel endpoint for model {}",
                model_route.channel_id, catalog_key
            )),
        ));
    }

    let provider_model = normalized_resolved_provider_model(
        &model_route.catalog_key,
        &model_route.model,
        &model_route.provider_model,
    );

    Ok(ResolvedOpenAiProviderRoute {
        catalog_key: model_route.catalog_key,
        policy_id: selection.policy_id,
        rule_id: selection.rule_id,
        provider_code: model_route.provider_code,
        channel_id: model_route.channel_id,
        provider_model,
        provider_base_url: channel_route.base_url,
        provider_secret_ref: channel_route.secret_ref,
        provider_auth_profile: channel_route.auth_profile,
        provider_timeout_ms: channel_route.timeout_ms,
        provider_retry_policy: channel_route.retry_policy,
    })
}

fn normalized_resolved_provider_model(
    catalog_key: &str,
    model: &str,
    provider_model: &str,
) -> String {
    let provider_model = provider_model.trim();
    if provider_model.is_empty() {
        let model = model.trim();
        return if model.is_empty() {
            crate::domain::provider_native_model_id(catalog_key)
        } else {
            model.to_owned()
        };
    }
    let native_model = crate::domain::provider_native_model_id(provider_model);
    if provider_model == catalog_key.trim()
        || (!native_model.is_empty()
            && native_model == model.trim()
            && native_model != provider_model)
    {
        native_model
    } else {
        provider_model.to_owned()
    }
}

impl ResolvedOpenAiProviderRoutePlan {
    pub fn first_route(&self) -> ResolvedOpenAiProviderRoute {
        self.routes
            .first()
            .cloned()
            .expect("resolved OpenAI route plan must contain at least one route")
    }
}

pub(super) fn route_http_status_is_retryable(
    route: &ResolvedOpenAiProviderRoute,
    default_retry_policy: &ProviderRetryPolicy,
    status_code: u16,
) -> bool {
    route
        .provider_retry_policy
        .as_ref()
        .unwrap_or(default_retry_policy)
        .is_retryable_status(status_code)
}

fn provider_route_selection_error(error: ProviderRouteSelectionError) -> OpenAiRouteError {
    let message = error.to_string();
    match error.kind() {
        ProviderRouteSelectionErrorKind::ProviderRouteUnavailable => Box::new(openai_error(
            StatusCode::SERVICE_UNAVAILABLE,
            if message.contains("provider route snapshot is empty") {
                "provider_route_snapshot_empty"
            } else {
                "provider_route_not_available"
            },
            "server_error",
            message,
        )),
        ProviderRouteSelectionErrorKind::PricingUnavailable => Box::new(openai_error(
            StatusCode::BAD_REQUEST,
            "pricing_unavailable",
            "invalid_request_error",
            message,
        )),
    }
}

fn has_text(value: Option<&str>) -> bool {
    value
        .map(str::trim)
        .map(|value| !value.is_empty())
        .unwrap_or(false)
}
