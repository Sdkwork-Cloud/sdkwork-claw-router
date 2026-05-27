use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use sdkwork_claw_http::{TrustedRequestSubject, TrustedRequestSubjectError};

use crate::api::response::PlusApiResult;

pub fn unauthorized_subject_response() -> Response {
    (
        StatusCode::UNAUTHORIZED,
        Json(PlusApiResult::<()>::error(
            "4010",
            TrustedRequestSubjectError::MissingExtension.to_string(),
        )),
    )
        .into_response()
}

pub fn required_subject(
    subject: Option<TrustedRequestSubject>,
) -> Result<TrustedRequestSubject, Response> {
    subject.ok_or_else(unauthorized_subject_response)
}
