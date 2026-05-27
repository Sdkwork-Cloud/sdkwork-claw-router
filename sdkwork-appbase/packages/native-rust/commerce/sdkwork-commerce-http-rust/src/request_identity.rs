use axum::extract::Request;
use axum::http::{HeaderMap, HeaderValue, StatusCode};
use axum::middleware::{self, Next};
use axum::response::{IntoResponse, Response};
use axum::Router;

const REQUEST_ID_HEADER: &str = "X-Request-Id";
const REQUEST_ID_ERROR: &str = "X-Request-Id must be a canonical UUID";

#[derive(Clone, Debug, Eq, PartialEq)]
pub(crate) struct ServerRequestId(pub String);

pub(crate) fn with_request_identity(router: Router) -> Router {
    router.layer(middleware::from_fn(request_identity_middleware))
}

async fn request_identity_middleware(mut request: Request, next: Next) -> Response {
    let request_id = match resolve_request_id(request.headers()) {
        Ok(request_id) => request_id,
        Err(message) => {
            let request_id = new_request_id();
            let mut response = (StatusCode::BAD_REQUEST, message).into_response();
            write_response_request_id(&mut response, &request_id);
            return response;
        }
    };

    request
        .extensions_mut()
        .insert(ServerRequestId(request_id.clone()));
    request.headers_mut().insert(
        REQUEST_ID_HEADER,
        HeaderValue::from_str(&request_id).expect("server request id must be a valid header value"),
    );
    let mut response = next.run(request).await;
    write_response_request_id(&mut response, &request_id);
    response
}

fn resolve_request_id(headers: &HeaderMap) -> Result<String, String> {
    match headers.get(REQUEST_ID_HEADER) {
        Some(value) => validate_request_id_header(value),
        None => Ok(new_request_id()),
    }
}

fn validate_request_id_header(value: &HeaderValue) -> Result<String, String> {
    let value = value
        .to_str()
        .map(str::trim)
        .map_err(|_| REQUEST_ID_ERROR.to_owned())?;
    validate_canonical_request_id(value)
}

fn validate_canonical_request_id(value: &str) -> Result<String, String> {
    is_canonical_uuid(value)
        .then(|| value.to_owned())
        .ok_or_else(|| REQUEST_ID_ERROR.to_owned())
}

fn new_request_id() -> String {
    let mut bytes = [0_u8; 16];
    getrandom::getrandom(&mut bytes).expect("secure random source is required for request ids");
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    format!(
        "{:02x}{:02x}{:02x}{:02x}-{:02x}{:02x}-{:02x}{:02x}-{:02x}{:02x}-{:02x}{:02x}{:02x}{:02x}{:02x}{:02x}",
        bytes[0],
        bytes[1],
        bytes[2],
        bytes[3],
        bytes[4],
        bytes[5],
        bytes[6],
        bytes[7],
        bytes[8],
        bytes[9],
        bytes[10],
        bytes[11],
        bytes[12],
        bytes[13],
        bytes[14],
        bytes[15],
    )
}

fn write_response_request_id(response: &mut Response, request_id: &str) {
    response.headers_mut().insert(
        REQUEST_ID_HEADER,
        HeaderValue::from_str(request_id).expect("server request id must be a valid header value"),
    );
}

fn is_canonical_uuid(value: &str) -> bool {
    let bytes = value.as_bytes();
    bytes.len() == 36
        && bytes.iter().enumerate().all(|(index, byte)| match index {
            8 | 13 | 18 | 23 => *byte == b'-',
            _ => matches!(*byte, b'0'..=b'9' | b'a'..=b'f'),
        })
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::extract::Extension;
    use axum::http::Request;
    use axum::routing::get;
    use tower::ServiceExt;

    #[tokio::test]
    async fn middleware_exposes_the_same_generated_request_id_to_handlers_and_responses() {
        async fn handler(
            Extension(ServerRequestId(extension_id)): Extension<ServerRequestId>,
            headers: HeaderMap,
        ) -> String {
            let header_id = headers
                .get(REQUEST_ID_HEADER)
                .and_then(|value| value.to_str().ok())
                .unwrap_or_default();
            format!("{extension_id}|{header_id}")
        }

        let response = with_request_identity(Router::new().route("/request-id", get(handler)))
            .oneshot(
                Request::builder()
                    .uri("/request-id")
                    .body(Body::empty())
                    .expect("request"),
            )
            .await
            .expect("response");

        let response_id = response
            .headers()
            .get(REQUEST_ID_HEADER)
            .expect("response request id")
            .to_str()
            .expect("response request id text")
            .to_owned();
        let body = axum::body::to_bytes(response.into_body(), usize::MAX)
            .await
            .expect("body");
        let body = String::from_utf8(body.to_vec()).expect("utf8 body");
        let expected = format!("{response_id}|{response_id}");

        assert_eq!(expected, body);
    }
}
