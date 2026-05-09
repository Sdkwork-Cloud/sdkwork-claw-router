use std::sync::Arc;

use axum::body::Bytes;
use axum::extract::State;
use axum::http::{HeaderMap, StatusCode, Uri};
use axum::response::{IntoResponse, Response};
use axum::routing::post;
use axum::{Json, Router};
use sdkwork_claw_http::ApiKeyIdentity;
use serde::{Deserialize, Serialize};

use crate::api::response::PlusApiResult;
use crate::application::{
    ApiKeyAuthenticator, ApiKeySecretHasher, AuthenticateApiKeyQuery, ListModelCatalogQuery,
    ModelCatalogItem, ModelCatalogPage, ModelCatalogPriceView, ModelCatalogQueryService,
    PriceAvailability,
};
use crate::domain::BillingMeter;
use crate::ports::PricingCatalog;

struct AdminModelCatalogState<C> {
    catalog: Arc<C>,
    api_key_hasher: Option<Arc<dyn ApiKeySecretHasher + Send + Sync>>,
}

impl<C> Clone for AdminModelCatalogState<C> {
    fn clone(&self) -> Self {
        Self {
            catalog: Arc::clone(&self.catalog),
            api_key_hasher: self.api_key_hasher.clone(),
        }
    }
}

#[derive(Debug, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AdminModelListRequest {
    api_key_id: Option<i64>,
    billing_meter: Option<String>,
    vendor_code: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminModelListResponse {
    items: Vec<AdminModelItemResponse>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminModelItemResponse {
    model: String,
    display_name: String,
    vendor_code: String,
    vendor: String,
    capabilities: Vec<String>,
    provider_codes: Vec<String>,
    official_reference_unit_price: Option<String>,
    lowest_upstream_cost_unit_price: Option<String>,
    price_availability: AdminPriceAvailabilityResponse,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminPriceAvailabilityResponse {
    status: &'static str,
    group_code: Option<String>,
    pricing_plan_code: Option<String>,
    customer_unit_price: Option<String>,
    gross_margin_per_unit: Option<String>,
    reason: Option<String>,
}

pub fn admin_model_catalog_router<C>(catalog: Arc<C>) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    admin_model_catalog_router_with_optional_api_key_hasher(catalog, None)
}

pub fn admin_model_catalog_router_with_api_key_hasher<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    admin_model_catalog_router_with_optional_api_key_hasher(catalog, Some(api_key_hasher))
}

fn admin_model_catalog_router_with_optional_api_key_hasher<C>(
    catalog: Arc<C>,
    api_key_hasher: Option<Arc<dyn ApiKeySecretHasher + Send + Sync>>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    Router::new()
        .route("/backend/v3/api/model/list", post(fetch_models::<C>))
        .with_state(AdminModelCatalogState {
            catalog,
            api_key_hasher,
        })
}

async fn fetch_models<C>(
    State(state): State<AdminModelCatalogState<C>>,
    headers: HeaderMap,
    uri: Uri,
    body: Bytes,
) -> Response
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let request = match parse_request(&body) {
        Ok(request) => request,
        Err(message) => {
            return (
                StatusCode::BAD_REQUEST,
                Json(PlusApiResult::error("4001", message)),
            )
                .into_response();
        }
    };
    let identity = match ApiKeyIdentity::from_headers_and_uri(&headers, &uri) {
        Ok(identity) => identity,
        Err(error) => {
            return (
                StatusCode::BAD_REQUEST,
                Json(PlusApiResult::error("4001", error.to_string())),
            )
                .into_response();
        }
    };
    let api_key_id = match resolve_api_key_id(&state, &identity, request.api_key_id) {
        Ok(api_key_id) => api_key_id,
        Err((status, message)) => {
            return (
                status,
                Json(PlusApiResult::error("4001", message.to_string())),
            )
                .into_response();
        }
    };
    let billing_meter = request
        .billing_meter
        .as_deref()
        .map(BillingMeter::from_code)
        .unwrap_or(BillingMeter::LlmInputToken);

    let service = ModelCatalogQueryService::new(state.catalog.as_ref());
    match service.list_models(ListModelCatalogQuery {
        api_key_id,
        billing_meter,
        vendor_code: request.vendor_code,
        vendor_codes: Vec::new(),
        modalities: Vec::new(),
        capabilities: Vec::new(),
        categories: Vec::new(),
        groups: Vec::new(),
        search_query: None,
        limit: None,
    }) {
        Ok(page) => Json(PlusApiResult::success(to_response(page))).into_response(),
        Err(error) => (
            StatusCode::BAD_REQUEST,
            Json(PlusApiResult::error("4001", error.to_string())),
        )
            .into_response(),
    }
}

fn parse_request(body: &[u8]) -> Result<AdminModelListRequest, String> {
    if body.iter().all(u8::is_ascii_whitespace) {
        return Ok(AdminModelListRequest::default());
    }
    serde_json::from_slice(body).map_err(|error| format!("invalid request body: {error}"))
}

fn resolve_api_key_id<C>(
    state: &AdminModelCatalogState<C>,
    identity: &ApiKeyIdentity,
    request_api_key_id: Option<i64>,
) -> Result<Option<i64>, (StatusCode, &'static str)>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    if let Some(hasher) = state.api_key_hasher.as_ref() {
        let Some(credential_secret) = identity.credential_secret() else {
            return Err((StatusCode::UNAUTHORIZED, "api key credential is required"));
        };

        let authenticator = ApiKeyAuthenticator::new(state.catalog.as_ref(), hasher.as_ref());
        return authenticator
            .authenticate(AuthenticateApiKeyQuery { credential_secret })
            .map(|context| Some(context.api_key_id))
            .map_err(|_| (StatusCode::UNAUTHORIZED, "api key credential is invalid"));
    }

    if let Some(api_key_id) = identity.api_key_id() {
        return Ok(Some(api_key_id));
    }
    if identity.credential_secret().is_none() {
        return Ok(request_api_key_id);
    }
    Err((
        StatusCode::UNAUTHORIZED,
        "api key credential authentication is not configured",
    ))
}

fn to_response(page: ModelCatalogPage) -> AdminModelListResponse {
    AdminModelListResponse {
        items: page.items.into_iter().map(to_item_response).collect(),
    }
}

fn to_item_response(item: ModelCatalogItem) -> AdminModelItemResponse {
    AdminModelItemResponse {
        model: item.model,
        display_name: item.display_name,
        vendor_code: item.vendor_code,
        vendor: item.vendor.code().to_owned(),
        capabilities: item.capabilities,
        provider_codes: item.provider_codes,
        official_reference_unit_price: item.official_reference_unit_price,
        lowest_upstream_cost_unit_price: item.lowest_upstream_cost_unit_price,
        price_availability: to_price_availability_response(item.price_availability),
    }
}

fn to_price_availability_response(
    availability: PriceAvailability,
) -> AdminPriceAvailabilityResponse {
    match availability {
        PriceAvailability::Available(price) => available_price(price),
        PriceAvailability::Unavailable { reason } => AdminPriceAvailabilityResponse {
            status: "unavailable",
            group_code: None,
            pricing_plan_code: None,
            customer_unit_price: None,
            gross_margin_per_unit: None,
            reason: Some(reason),
        },
    }
}

fn available_price(price: ModelCatalogPriceView) -> AdminPriceAvailabilityResponse {
    AdminPriceAvailabilityResponse {
        status: "available",
        group_code: Some(price.group_code),
        pricing_plan_code: Some(price.pricing_plan_code),
        customer_unit_price: Some(price.customer_unit_price),
        gross_margin_per_unit: price.gross_margin_per_unit,
        reason: None,
    }
}
