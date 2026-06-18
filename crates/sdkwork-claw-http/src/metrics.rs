use std::sync::atomic::{AtomicU64, Ordering};

use axum::http::{header, HeaderValue};
use axum::response::{IntoResponse, Response};

static HTTP_REQUESTS_TOTAL: AtomicU64 = AtomicU64::new(0);

pub fn record_http_request() {
    HTTP_REQUESTS_TOTAL.fetch_add(1, Ordering::Relaxed);
}

pub async fn metrics() -> Response {
    let body = format!(
        "# HELP http_requests_total Total HTTP requests served by sdkwork-claw-http services.\n\
         # TYPE http_requests_total counter\n\
         http_requests_total {}\n",
        HTTP_REQUESTS_TOTAL.load(Ordering::Relaxed)
    );
    (
        [(
            header::CONTENT_TYPE,
            HeaderValue::from_static("text/plain; version=0.0.4"),
        )],
        body,
    )
        .into_response()
}
