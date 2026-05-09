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
use crate::domain::{DecimalValue, DomainError};
use crate::infrastructure::OsApiKeySecretGenerator;
use crate::ports::{
    RechargeCommandFuture, RechargePackage, RechargeReadFuture, RechargeStore, RechargeSubject,
    SubmitRechargeCommand,
};

const MAX_PAYMENT_METHOD_LEN: usize = 50;
const MAX_RECHARGE_AMOUNT: &str = "10000.00";
const PAYMENT_EXPIRE_SECONDS: i64 = 1_800;

struct AppRechargeState {
    store: Arc<dyn RechargeStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    require_subject: bool,
}

impl Clone for AppRechargeState {
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
struct SubmitRechargeRequest {
    amount: Option<serde_json::Value>,
    method: Option<String>,
}

struct EmptyRechargeStore;

impl RechargeStore for EmptyRechargeStore {
    fn load_recharge_packages<'a>(
        &'a self,
        _subject: Option<RechargeSubject>,
    ) -> RechargeReadFuture<'a, Vec<RechargePackage>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn submit_recharge<'a>(&'a self, _command: SubmitRechargeCommand) -> RechargeCommandFuture<'a> {
        Box::pin(async {
            Err(DomainError::new(
                "recharge command store is unavailable without database configuration",
            ))
        })
    }
}

pub fn app_recharge_router() -> Router {
    app_recharge_router_with_state(
        Arc::new(EmptyRechargeStore),
        Arc::new(OsApiKeySecretGenerator),
        false,
    )
}

pub fn app_recharge_router_with_store(
    store: Arc<dyn RechargeStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    app_recharge_router_with_state(store, entity_uuid_generator, true)
}

fn app_recharge_router_with_state(
    store: Arc<dyn RechargeStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route("/app/v3/api/vip/pack-groups/packs", get(fetch_packages))
        .route("/app/v3/api/account/points/recharge", post(submit_recharge))
        .with_state(AppRechargeState {
            store,
            entity_uuid_generator,
            require_subject,
        })
}

async fn fetch_packages(State(state): State<AppRechargeState>, headers: HeaderMap) -> Response {
    let subject = match resolve_recharge_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state.store.load_recharge_packages(subject).await {
        Ok(packages) => Json(PlusApiResult::success(packages)).into_response(),
        Err(error) => recharge_system_response("recharge package read model is unavailable", error),
    }
}

async fn submit_recharge(
    State(state): State<AppRechargeState>,
    headers: HeaderMap,
    Json(request): Json<SubmitRechargeRequest>,
) -> Response {
    let subject = match resolve_required_recharge_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let (amount, method) = match validate_submit_recharge_request(request) {
        Ok(value) => value,
        Err(message) => {
            return (
                StatusCode::BAD_REQUEST,
                Json(PlusApiResult::error("4001", message)),
            )
                .into_response()
        }
    };
    let command = match build_submit_recharge_command(state.clone(), subject, amount, method) {
        Ok(command) => command,
        Err(error) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(PlusApiResult::error("5000", error.to_string())),
            )
                .into_response()
        }
    };

    match state.store.submit_recharge(command).await {
        Ok(outcome) => Json(PlusApiResult::success(outcome)).into_response(),
        Err(error) if error.is_conflict() => (
            StatusCode::CONFLICT,
            Json(PlusApiResult::error("4090", error.to_string())),
        )
            .into_response(),
        Err(error) => recharge_system_response("recharge command store is unavailable", error),
    }
}

fn resolve_recharge_subject(
    state: &AppRechargeState,
    headers: &HeaderMap,
) -> Result<Option<RechargeSubject>, Response> {
    match TrustedRequestSubject::from_headers(headers) {
        Ok(subject) => Ok(Some(RechargeSubject {
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

fn resolve_required_recharge_subject(
    state: &AppRechargeState,
    headers: &HeaderMap,
) -> Result<RechargeSubject, Response> {
    match resolve_recharge_subject(state, headers)? {
        Some(subject) => Ok(subject),
        None => Err((
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error(
                "4010",
                "trusted request subject is required for recharge command",
            )),
        )
            .into_response()),
    }
}

fn validate_submit_recharge_request(
    request: SubmitRechargeRequest,
) -> Result<(String, String), String> {
    let amount = parse_recharge_money_amount(
        request
            .amount
            .as_ref()
            .ok_or_else(|| "recharge amount must be greater than zero".to_owned())?,
    )?;
    let parsed_amount = DecimalValue::parse(&amount)
        .map_err(|_| "recharge amount must be a decimal amount".to_owned())?;
    if parsed_amount <= DecimalValue::ZERO {
        return Err("recharge amount must be greater than zero".to_owned());
    }
    let max_amount = DecimalValue::parse(MAX_RECHARGE_AMOUNT)
        .map_err(|_| "recharge amount limit is invalid".to_owned())?;
    if parsed_amount > max_amount {
        return Err(format!(
            "recharge amount must not exceed {MAX_RECHARGE_AMOUNT}"
        ));
    }
    let method = request
        .method
        .unwrap_or_default()
        .trim()
        .to_ascii_lowercase();
    if method.is_empty() {
        return Err("payment method must not be empty".to_owned());
    }
    if method.chars().count() > MAX_PAYMENT_METHOD_LEN {
        return Err(format!(
            "payment method length must not exceed {MAX_PAYMENT_METHOD_LEN} characters"
        ));
    }
    if !method.bytes().all(|byte| (0x21..=0x7e).contains(&byte)) {
        return Err("payment method must contain only visible ASCII characters".to_owned());
    }
    Ok((amount, method))
}

fn build_submit_recharge_command(
    state: AppRechargeState,
    subject: RechargeSubject,
    amount: String,
    method: String,
) -> Result<SubmitRechargeCommand, DomainError> {
    let order_uuid = state.entity_uuid_generator.generate_entity_uuid()?;
    let order_item_uuid = state.entity_uuid_generator.generate_entity_uuid()?;
    let payment_uuid = state.entity_uuid_generator.generate_entity_uuid()?;
    let recharge_uuid = state.entity_uuid_generator.generate_entity_uuid()?;
    let nonce_uuid = state.entity_uuid_generator.generate_entity_uuid()?;
    let now = current_unix_timestamp();
    let token = compact_token(&nonce_uuid);
    let order_sn = format!("RC{now}{}", take_prefix(&token, 16));
    let out_trade_no = format!("RECHARGE{now}{}", take_prefix(&token, 32));
    let requested_at = format_unix_timestamp(now);
    let expire_at = format_unix_timestamp(now + PAYMENT_EXPIRE_SECONDS);

    Ok(SubmitRechargeCommand {
        subject,
        amount,
        method,
        order_uuid,
        order_item_uuid,
        payment_uuid,
        recharge_uuid,
        order_sn,
        out_trade_no,
        requested_at,
        expire_at,
    })
}

fn recharge_system_response(context: &str, error: DomainError) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error("5000", format!("{context}: {error}"))),
    )
        .into_response()
}

fn parse_recharge_money_amount(value: &serde_json::Value) -> Result<String, String> {
    let raw = match value {
        serde_json::Value::Number(number) => number.to_string(),
        serde_json::Value::String(text) => text.trim().to_owned(),
        _ => return Err("recharge amount must be a decimal amount".to_owned()),
    };
    if raw.is_empty() {
        return Err("recharge amount must be greater than zero".to_owned());
    }
    if has_sub_cent_precision(&raw) {
        return Err("recharge amount must not contain sub-cent precision".to_owned());
    }
    DecimalValue::parse(&raw)
        .map(|amount| amount.to_fixed_string(2))
        .map_err(|_| "recharge amount must be a decimal amount".to_owned())
}

fn has_sub_cent_precision(value: &str) -> bool {
    let unsigned = value.trim_start_matches('-');
    let Some((_, fraction)) = unsigned.split_once('.') else {
        return false;
    };
    fraction
        .chars()
        .skip(2)
        .any(|ch| ch.is_ascii_digit() && ch != '0')
}

fn compact_token(value: &str) -> String {
    value
        .chars()
        .filter(|ch| ch.is_ascii_alphanumeric())
        .collect()
}

fn take_prefix(value: &str, max_len: usize) -> String {
    value.chars().take(max_len).collect()
}

fn current_unix_timestamp() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0)
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
