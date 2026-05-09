use std::sync::Arc;

use axum::extract::{Path, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;

use crate::api::response::PlusApiResult;
use crate::domain::DomainError;
use crate::ports::{CheckoutReadFuture, CheckoutStatusSnapshot, CheckoutStore, CheckoutSubject};

const MAX_CHECKOUT_ORDER_NO_LEN: usize = 128;

struct AppCheckoutState {
    store: Arc<dyn CheckoutStore + Send + Sync>,
    require_subject: bool,
}

impl Clone for AppCheckoutState {
    fn clone(&self) -> Self {
        Self {
            store: Arc::clone(&self.store),
            require_subject: self.require_subject,
        }
    }
}

struct EmptyCheckoutStore;

impl CheckoutStore for EmptyCheckoutStore {
    fn load_checkout_status<'a>(
        &'a self,
        _subject: Option<CheckoutSubject>,
        _order_no: String,
    ) -> CheckoutReadFuture<'a, Option<CheckoutStatusSnapshot>> {
        Box::pin(async { Ok(None) })
    }
}

pub fn app_checkout_router() -> Router {
    app_checkout_router_with_state(Arc::new(EmptyCheckoutStore), false)
}

pub fn app_checkout_router_with_store(store: Arc<dyn CheckoutStore + Send + Sync>) -> Router {
    app_checkout_router_with_state(store, true)
}

fn app_checkout_router_with_state(
    store: Arc<dyn CheckoutStore + Send + Sync>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route(
            "/app/v3/api/payments/checkout/{order_no}",
            get(fetch_checkout_status),
        )
        .with_state(AppCheckoutState {
            store,
            require_subject,
        })
}

async fn fetch_checkout_status(
    State(state): State<AppCheckoutState>,
    headers: HeaderMap,
    Path(order_no): Path<String>,
) -> Response {
    let subject = match resolve_checkout_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let order_no = match validate_checkout_order_no(order_no) {
        Ok(order_no) => order_no,
        Err(message) => {
            return (
                StatusCode::BAD_REQUEST,
                Json(PlusApiResult::error("4001", message)),
            )
                .into_response()
        }
    };

    match state.store.load_checkout_status(subject, order_no).await {
        Ok(Some(snapshot)) => Json(PlusApiResult::success(snapshot)).into_response(),
        Ok(None) => (
            StatusCode::CONFLICT,
            Json(PlusApiResult::error("4090", "checkout order was not found")),
        )
            .into_response(),
        Err(error) if error.is_conflict() => (
            StatusCode::CONFLICT,
            Json(PlusApiResult::error("4090", error.to_string())),
        )
            .into_response(),
        Err(error) => checkout_system_response("checkout status read model is unavailable", error),
    }
}

fn resolve_checkout_subject(
    state: &AppCheckoutState,
    headers: &HeaderMap,
) -> Result<Option<CheckoutSubject>, Response> {
    match TrustedRequestSubject::from_headers(headers) {
        Ok(subject) => Ok(Some(CheckoutSubject {
            tenant_id: subject.tenant_id,
            organization_id: subject.organization_id,
            user_id: subject.user_id,
        })),
        Err(error) if state.require_subject => Err((
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error("4010", error.to_string())),
        )
            .into_response()),
        Err(_) => Ok(None),
    }
}

fn validate_checkout_order_no(order_no: String) -> Result<String, String> {
    let order_no = order_no.trim().to_owned();
    if order_no.is_empty() {
        return Err("checkout order number must not be empty".to_owned());
    }
    if order_no.chars().count() > MAX_CHECKOUT_ORDER_NO_LEN {
        return Err(format!(
            "checkout order number length must not exceed {MAX_CHECKOUT_ORDER_NO_LEN} characters"
        ));
    }
    if !order_no.bytes().all(|byte| (0x21..=0x7e).contains(&byte)) {
        return Err("checkout order number must contain only visible ASCII characters".to_owned());
    }
    Ok(order_no)
}

fn checkout_system_response(context: &str, error: DomainError) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error("5000", format!("{context}: {error}"))),
    )
        .into_response()
}
