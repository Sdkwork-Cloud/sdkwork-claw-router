use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::extract::State;
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::Deserialize;

use crate::api::response::PlusApiResult;
use crate::application::EntityUuidGenerator;
use crate::domain::DomainError;
use crate::infrastructure::OsApiKeySecretGenerator;
use crate::ports::{
    BillingCommandFuture, BillingPointsBalance, BillingPointsHistoryItem, BillingReadFuture,
    BillingRechargeHistoryItem, BillingRedeemHistoryItem, BillingStore, BillingSubject,
    RedeemCodeCommand,
};

const MAX_REDEEM_CODE_LEN: usize = 128;

struct AppBillingState {
    store: Arc<dyn BillingStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    require_subject: bool,
}

impl Clone for AppBillingState {
    fn clone(&self) -> Self {
        Self {
            store: Arc::clone(&self.store),
            entity_uuid_generator: Arc::clone(&self.entity_uuid_generator),
            require_subject: self.require_subject,
        }
    }
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct RedeemCodeRequest {
    code: Option<String>,
}

struct EmptyBillingStore;

impl BillingStore for EmptyBillingStore {
    fn load_redeem_history<'a>(
        &'a self,
        _subject: Option<BillingSubject>,
    ) -> BillingReadFuture<'a, Vec<BillingRedeemHistoryItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn load_recharge_history<'a>(
        &'a self,
        _subject: Option<BillingSubject>,
    ) -> BillingReadFuture<'a, Vec<BillingRechargeHistoryItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn load_points_balance<'a>(
        &'a self,
        _subject: Option<BillingSubject>,
    ) -> BillingReadFuture<'a, BillingPointsBalance> {
        Box::pin(async { Ok(BillingPointsBalance::default()) })
    }

    fn load_points_history<'a>(
        &'a self,
        _subject: Option<BillingSubject>,
    ) -> BillingReadFuture<'a, Vec<BillingPointsHistoryItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn redeem_code<'a>(&'a self, _command: RedeemCodeCommand) -> BillingCommandFuture<'a> {
        Box::pin(async {
            Err(DomainError::new(
                "billing command store is unavailable without database configuration",
            ))
        })
    }
}

pub fn app_billing_router() -> Router {
    app_billing_router_with_state(
        Arc::new(EmptyBillingStore),
        Arc::new(OsApiKeySecretGenerator),
        false,
    )
}

pub fn app_billing_router_with_store(
    store: Arc<dyn BillingStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    app_billing_router_with_state(store, entity_uuid_generator, true)
}

fn app_billing_router_with_state(
    store: Arc<dyn BillingStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route(
            "/app/v3/api/billing/users/current/coupons",
            get(fetch_redeem_history),
        )
        .route(
            "/app/v3/api/billing/payments/records",
            get(fetch_recharge_history),
        )
        .route(
            "/app/v3/api/billing/account/points",
            get(fetch_points_balance),
        )
        .route(
            "/app/v3/api/billing/account/points/history",
            get(fetch_points_history),
        )
        .route("/app/v3/api/billing/coupons/redeem", post(redeem_code))
        .with_state(AppBillingState {
            store,
            entity_uuid_generator,
            require_subject,
        })
}

async fn fetch_redeem_history(
    State(state): State<AppBillingState>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_billing_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state.store.load_redeem_history(subject).await {
        Ok(items) => Json(PlusApiResult::success(items)).into_response(),
        Err(error) => {
            billing_system_response("billing redeem history read model is unavailable", error)
        }
    }
}

async fn fetch_recharge_history(
    State(state): State<AppBillingState>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_billing_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state.store.load_recharge_history(subject).await {
        Ok(items) => Json(PlusApiResult::success(items)).into_response(),
        Err(error) => {
            billing_system_response("billing recharge history read model is unavailable", error)
        }
    }
}

async fn fetch_points_balance(
    State(state): State<AppBillingState>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_billing_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state.store.load_points_balance(subject).await {
        Ok(balance) => Json(PlusApiResult::success(balance)).into_response(),
        Err(error) => {
            billing_system_response("billing points balance read model is unavailable", error)
        }
    }
}

async fn fetch_points_history(
    State(state): State<AppBillingState>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_billing_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state.store.load_points_history(subject).await {
        Ok(items) => Json(PlusApiResult::success(items)).into_response(),
        Err(error) => {
            billing_system_response("billing points history read model is unavailable", error)
        }
    }
}

async fn redeem_code(
    State(state): State<AppBillingState>,
    headers: HeaderMap,
    Json(request): Json<RedeemCodeRequest>,
) -> Response {
    let subject = match resolve_required_billing_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let code = match validate_redeem_code_request(request) {
        Ok(code) => code,
        Err(message) => {
            return (
                StatusCode::BAD_REQUEST,
                Json(PlusApiResult::error("4001", message)),
            )
                .into_response()
        }
    };

    let command = match build_redeem_code_command(state.clone(), subject, code) {
        Ok(command) => command,
        Err(error) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(PlusApiResult::error("5000", error.to_string())),
            )
                .into_response()
        }
    };

    match state.store.redeem_code(command).await {
        Ok(outcome) => Json(PlusApiResult::success(outcome)).into_response(),
        Err(error) if error.is_conflict() => (
            StatusCode::CONFLICT,
            Json(PlusApiResult::error("4090", error.to_string())),
        )
            .into_response(),
        Err(error) => billing_system_response("billing redeem command store is unavailable", error),
    }
}

fn resolve_billing_subject(
    state: &AppBillingState,
    headers: &HeaderMap,
) -> Result<Option<BillingSubject>, Response> {
    match TrustedRequestSubject::from_headers(headers) {
        Ok(subject) => Ok(Some(BillingSubject {
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

fn resolve_required_billing_subject(
    state: &AppBillingState,
    headers: &HeaderMap,
) -> Result<BillingSubject, Response> {
    match resolve_billing_subject(state, headers)? {
        Some(subject) => Ok(subject),
        None => Err((
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error(
                "4010",
                "trusted request subject is required for billing command",
            )),
        )
            .into_response()),
    }
}

fn validate_redeem_code_request(request: RedeemCodeRequest) -> Result<String, String> {
    let code = request.code.unwrap_or_default().trim().to_owned();
    if code.is_empty() {
        return Err("redeem code must not be empty".to_owned());
    }
    if code.chars().count() > MAX_REDEEM_CODE_LEN {
        return Err(format!(
            "redeem code length must not exceed {MAX_REDEEM_CODE_LEN} characters"
        ));
    }
    if !code.bytes().all(|byte| (0x21..=0x7e).contains(&byte)) {
        return Err("redeem code must contain only visible ASCII characters".to_owned());
    }
    Ok(code)
}

fn build_redeem_code_command(
    state: AppBillingState,
    subject: BillingSubject,
    code: String,
) -> Result<RedeemCodeCommand, DomainError> {
    let user_coupon_uuid = state.entity_uuid_generator.generate_entity_uuid()?;
    let account_uuid = state.entity_uuid_generator.generate_entity_uuid()?;
    let account_history_uuid = state.entity_uuid_generator.generate_entity_uuid()?;
    let point_change_uuid = state.entity_uuid_generator.generate_entity_uuid()?;
    let transaction_uuid = state.entity_uuid_generator.generate_entity_uuid()?;
    let requested_at = current_timestamp_string();
    let coupon_code = format!(
        "CP{}",
        transaction_uuid.chars().take(24).collect::<String>()
    );
    let transaction_id = format!("coupon-redeem-{transaction_uuid}");

    Ok(RedeemCodeCommand {
        subject,
        code,
        user_coupon_uuid,
        account_uuid,
        account_history_uuid,
        point_change_uuid,
        coupon_code,
        transaction_id,
        requested_at,
    })
}

fn billing_system_response(context: &str, error: DomainError) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error("5000", format!("{context}: {error}"))),
    )
        .into_response()
}

fn current_timestamp_string() -> String {
    let seconds = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0);
    format_unix_timestamp(seconds)
}

fn format_unix_timestamp(seconds: i64) -> String {
    let days = seconds.div_euclid(86_400);
    let seconds_of_day = seconds.rem_euclid(86_400);
    let (year, month, day) = civil_from_days(days);
    let hour = seconds_of_day / 3_600;
    let minute = (seconds_of_day % 3_600) / 60;
    let second = seconds_of_day % 60;
    format!("{year:04}-{month:02}-{day:02} {hour:02}:{minute:02}:{second:02}")
}

fn civil_from_days(days: i64) -> (i64, i64, i64) {
    let days = days + 719_468;
    let era = if days >= 0 { days } else { days - 146_096 } / 146_097;
    let day_of_era = days - era * 146_097;
    let year_of_era =
        (day_of_era - day_of_era / 1_460 + day_of_era / 36_524 - day_of_era / 146_096) / 365;
    let year = year_of_era + era * 400;
    let day_of_year = day_of_era - (365 * year_of_era + year_of_era / 4 - year_of_era / 100);
    let month_prime = (5 * day_of_year + 2) / 153;
    let day = day_of_year - (153 * month_prime + 2) / 5 + 1;
    let month = month_prime + if month_prime < 10 { 3 } else { -9 };
    let year = year + if month <= 2 { 1 } else { 0 };
    (year, month, day)
}
