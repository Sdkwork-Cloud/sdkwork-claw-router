use axum::http::StatusCode;
use axum::response::Response;
use sdkwork_claw_http::ApiKeyIdentity;

use crate::api::openai_error::openai_error;
use crate::application::{
    ApiKeyAuthenticator, ApiKeySecretHasher, AuthenticateApiKeyQuery, AuthenticatedApiKeyContext,
    ProviderRouteSelectionError, ProviderRouteSelectionErrorKind, ProviderRouteSelector,
    SelectProviderRouteQuery,
};
use crate::domain::{AiModel, BillingMeter, ModelProviderRoute, RoutingCapability};
use crate::ports::PricingCatalog;

pub(super) type OpenAiRouteError = Box<Response>;

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
    if model.contains('/') {
        return catalog
            .find_model(model)
            .ok_or_else(|| model_not_found(model));
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

pub(super) fn first_priced_provider_route<C>(
    catalog: &C,
    context: &AuthenticatedApiKeyContext,
    model: &str,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
) -> Result<ModelProviderRoute, OpenAiRouteError>
where
    C: PricingCatalog,
{
    let catalog_model = find_catalog_model(catalog, model)?;
    let catalog_key = catalog_model.catalog_key;
    ProviderRouteSelector::new(catalog)
        .select(SelectProviderRouteQuery {
            context: context.clone(),
            catalog_key,
            requested_model: model.to_owned(),
            capability,
            billing_meter,
        })
        .map(|selection| selection.route)
        .map_err(provider_route_selection_error)
}

fn provider_route_selection_error(error: ProviderRouteSelectionError) -> OpenAiRouteError {
    let message = error.to_string();
    match error.kind() {
        ProviderRouteSelectionErrorKind::ProviderRouteUnavailable => Box::new(openai_error(
            StatusCode::SERVICE_UNAVAILABLE,
            "provider_route_not_available",
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
