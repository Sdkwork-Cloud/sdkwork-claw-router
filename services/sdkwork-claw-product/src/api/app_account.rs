use std::sync::Arc;

use axum::extract::State;
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;

use crate::api::response::PlusApiResult;
use crate::ports::{
    AccountSummaryReadFuture, AccountSummaryReadStore, AccountSummarySnapshot,
    AccountSummarySubject,
};

#[derive(Clone)]
struct AppAccountSummaryState {
    read_store: Arc<dyn AccountSummaryReadStore + Send + Sync>,
    require_subject: bool,
}

struct EmptyAccountSummaryReadStore;

impl AccountSummaryReadStore for EmptyAccountSummaryReadStore {
    fn load_account_summary<'a>(
        &'a self,
        _subject: Option<AccountSummarySubject>,
    ) -> AccountSummaryReadFuture<'a> {
        Box::pin(async { Ok(AccountSummarySnapshot::default()) })
    }
}

pub fn app_account_summary_router() -> Router {
    app_account_summary_router_with_state(Arc::new(EmptyAccountSummaryReadStore), false)
}

pub fn app_account_summary_router_with_read_store(
    read_store: Arc<dyn AccountSummaryReadStore + Send + Sync>,
) -> Router {
    app_account_summary_router_with_state(read_store, true)
}

fn app_account_summary_router_with_state(
    read_store: Arc<dyn AccountSummaryReadStore + Send + Sync>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route(
            "/app/v3/api/billing/account/summary",
            get(fetch_account_summary),
        )
        .with_state(AppAccountSummaryState {
            read_store,
            require_subject,
        })
}

async fn fetch_account_summary(
    State(state): State<AppAccountSummaryState>,
    headers: HeaderMap,
) -> Response {
    let subject = match TrustedRequestSubject::from_headers(&headers) {
        Ok(subject) => Some(AccountSummarySubject {
            tenant_id: subject.tenant_id,
            organization_id: subject.organization_id,
            user_id: subject.user_id,
        }),
        Err(error) if state.require_subject => {
            return (
                StatusCode::UNAUTHORIZED,
                Json(PlusApiResult::error("4010", error.to_string())),
            )
                .into_response()
        }
        Err(_) => None,
    };

    match state.read_store.load_account_summary(subject).await {
        Ok(snapshot) => Json(PlusApiResult::success(snapshot)).into_response(),
        Err(error) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(PlusApiResult::error(
                "5000",
                format!("account summary read model is unavailable: {error}"),
            )),
        )
            .into_response(),
    }
}
