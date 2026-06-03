use axum::http::header;
use axum::http::{HeaderMap, Method, Uri};
use bytes::Bytes;
use serde_json::Value;

#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) struct OpenAiPassthroughPayloadError {
    message: String,
}

impl OpenAiPassthroughPayloadError {
    fn invalid_request(message: impl ToString) -> Self {
        Self {
            message: message.to_string(),
        }
    }
}

impl std::fmt::Display for OpenAiPassthroughPayloadError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(&self.message)
    }
}

impl std::error::Error for OpenAiPassthroughPayloadError {}

#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) struct OpenAiPassthroughRequestedModel {
    model: String,
    source: OpenAiPassthroughModelSource,
}

impl OpenAiPassthroughRequestedModel {
    fn path(model: String) -> Self {
        Self {
            model,
            source: OpenAiPassthroughModelSource::Path,
        }
    }

    fn query(model: String) -> Self {
        Self {
            model,
            source: OpenAiPassthroughModelSource::Query,
        }
    }

    fn body(model: String) -> Self {
        Self {
            model,
            source: OpenAiPassthroughModelSource::Body,
        }
    }

    pub(crate) fn model(&self) -> &str {
        &self.model
    }

    pub(crate) fn source(&self) -> OpenAiPassthroughModelSource {
        self.source
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum OpenAiPassthroughModelSource {
    Path,
    Query,
    Body,
}

#[cfg(test)]
fn requested_model(
    method: &Method,
    uri: &Uri,
    headers: &HeaderMap,
    body: &[u8],
) -> Result<String, OpenAiPassthroughPayloadError> {
    optional_requested_model_with_source(method, uri, headers, body)?
        .map(|model| model.model)
        .ok_or_else(|| {
            OpenAiPassthroughPayloadError::invalid_request(
                "model is required for route-scoped OpenAI-compatible passthrough",
            )
        })
}

pub(crate) fn optional_requested_model_with_source(
    method: &Method,
    uri: &Uri,
    headers: &HeaderMap,
    body: &[u8],
) -> Result<Option<OpenAiPassthroughRequestedModel>, OpenAiPassthroughPayloadError> {
    if method == Method::DELETE {
        if let Some(model) = uri.path().strip_prefix("/v1/models/") {
            return require_passthrough_model(model)
                .map(OpenAiPassthroughRequestedModel::path)
                .map(Some);
        }
    }
    if body.is_empty() || !method_allows_request_body(method) {
        if let Some(model) = model_from_query(uri)? {
            return Ok(Some(OpenAiPassthroughRequestedModel::query(model)));
        }
        return Ok(None);
    }
    Ok(model_from_supported_body(uri, headers, body)?.map(OpenAiPassthroughRequestedModel::body))
}

fn model_from_query(uri: &Uri) -> Result<Option<String>, OpenAiPassthroughPayloadError> {
    match uri.query() {
        Some(query) => model_from_url_encoded(query.as_bytes()),
        None => Ok(None),
    }
}

fn model_from_supported_body(
    uri: &Uri,
    headers: &HeaderMap,
    body: &[u8],
) -> Result<Option<String>, OpenAiPassthroughPayloadError> {
    if request_content_type_is_json(headers) {
        return model_from_json_body(uri.path(), body);
    }
    if request_content_type_is_form_urlencoded(headers) {
        return model_from_url_encoded(body);
    }
    if request_content_type_is_multipart_form(headers) {
        return model_from_multipart_form(headers, body);
    }
    match serde_json::from_slice::<Value>(body) {
        Ok(value) => model_from_json_value(uri.path(), &value),
        Err(_) => Ok(None),
    }
}

pub(crate) fn rewrite_body(
    method: &Method,
    uri: &Uri,
    headers: &HeaderMap,
    body: Bytes,
    provider_model: &str,
) -> Result<Bytes, OpenAiPassthroughPayloadError> {
    if body.is_empty() || !method_allows_request_body(method) {
        return Ok(body);
    }
    if request_content_type_is_json(headers) {
        return rewrite_json_model(uri.path(), body, provider_model);
    }
    if request_content_type_is_form_urlencoded(headers) {
        return rewrite_form_model(body, provider_model);
    }
    if request_content_type_is_multipart_form(headers) {
        return rewrite_multipart_model(headers, body, provider_model);
    }
    if serde_json::from_slice::<Value>(&body).is_ok() {
        return rewrite_json_model(uri.path(), body, provider_model);
    }
    Ok(body)
}

pub(crate) fn rewrite_url_encoded_model(value: &str, provider_model: &str) -> String {
    let mut pairs = parse_url_encoded_pairs(value.as_bytes());
    if let Some((_, value)) = pairs.iter_mut().find(|(name, _)| name == "model") {
        *value = provider_model.to_owned();
        serialize_url_encoded_pairs(&pairs)
    } else {
        value.to_owned()
    }
}

pub(crate) fn percent_encode_path_segment(value: &str) -> String {
    let mut encoded = String::new();
    for byte in value.bytes() {
        let character = byte as char;
        if character.is_ascii_alphanumeric() || matches!(character, '-' | '_' | '.' | '~' | ':') {
            encoded.push(character);
        } else {
            encoded.push_str(&format!("%{byte:02X}"));
        }
    }
    encoded
}

fn model_from_json_body(
    path: &str,
    body: &[u8],
) -> Result<Option<String>, OpenAiPassthroughPayloadError> {
    let value = serde_json::from_slice::<Value>(body).map_err(|error| {
        OpenAiPassthroughPayloadError::invalid_request(format!("invalid request body: {error}"))
    })?;
    model_from_json_value(path, &value)
}

fn model_from_url_encoded(body: &[u8]) -> Result<Option<String>, OpenAiPassthroughPayloadError> {
    match parse_url_encoded_pairs(body)
        .into_iter()
        .find(|(name, _)| name == "model")
    {
        Some((_, value)) => require_passthrough_model(&value).map(Some),
        None => Ok(None),
    }
}

fn rewrite_json_model(
    path: &str,
    body: Bytes,
    provider_model: &str,
) -> Result<Bytes, OpenAiPassthroughPayloadError> {
    let mut value = serde_json::from_slice::<Value>(&body).map_err(|error| {
        OpenAiPassthroughPayloadError::invalid_request(format!("invalid request body: {error}"))
    })?;
    if !rewrite_json_model_value(path, &mut value, provider_model) {
        return Err(OpenAiPassthroughPayloadError::invalid_request(
            "model is required",
        ));
    }
    Ok(Bytes::from(value.to_string()))
}

fn model_from_json_value(
    path: &str,
    value: &Value,
) -> Result<Option<String>, OpenAiPassthroughPayloadError> {
    if let Some(model) = model_field_from_json_value(value)? {
        return Ok(Some(model));
    }
    for field in nested_model_search_fields(path) {
        let Some(nested) = value.get(field) else {
            continue;
        };
        if let Some(model) = find_nested_model(nested)? {
            return Ok(Some(model));
        }
    }
    Ok(None)
}

fn model_field_from_json_value(
    value: &Value,
) -> Result<Option<String>, OpenAiPassthroughPayloadError> {
    match value {
        Value::Object(object) => model_field_from_json_object(object),
        _ => Ok(None),
    }
}

fn model_field_from_json_object(
    object: &serde_json::Map<String, Value>,
) -> Result<Option<String>, OpenAiPassthroughPayloadError> {
    match object.get("model") {
        Some(Value::String(model)) => require_passthrough_model(model).map(Some),
        Some(_) => Err(OpenAiPassthroughPayloadError::invalid_request(
            "model must be a string",
        )),
        None => Ok(None),
    }
}

fn rewrite_json_model_value(path: &str, value: &mut Value, provider_model: &str) -> bool {
    if let Value::Object(object) = value {
        if object
            .get("model")
            .and_then(Value::as_str)
            .and_then(valid_passthrough_model)
            .is_some()
        {
            object.insert("model".to_owned(), Value::String(provider_model.to_owned()));
            return true;
        }
    }
    for field in nested_model_search_fields(path) {
        let Some(nested) = value.get_mut(field) else {
            continue;
        };
        if rewrite_first_nested_model(nested, provider_model) {
            return true;
        }
    }
    false
}

fn nested_model_search_fields(path: &str) -> &'static [&'static str] {
    if path == "/v1/fine_tuning/alpha/graders/run"
        || path == "/v1/fine_tuning/alpha/graders/validate"
    {
        return &["grader"];
    }
    if path == "/v1/evals" || path.starts_with("/v1/evals/") {
        return &["data_source", "data_source_config", "testing_criteria"];
    }
    &[]
}

fn find_nested_model(value: &Value) -> Result<Option<String>, OpenAiPassthroughPayloadError> {
    match value {
        Value::Object(object) => {
            if let Some(model) = model_field_from_json_object(object)? {
                return Ok(Some(model));
            }
            for (_, value) in object.iter().filter(|(key, _)| key.as_str() != "metadata") {
                if let Some(model) = find_nested_model(value)? {
                    return Ok(Some(model));
                }
            }
            Ok(None)
        }
        Value::Array(values) => {
            for value in values {
                if let Some(model) = find_nested_model(value)? {
                    return Ok(Some(model));
                }
            }
            Ok(None)
        }
        _ => Ok(None),
    }
}

fn rewrite_first_nested_model(value: &mut Value, provider_model: &str) -> bool {
    match value {
        Value::Object(object) => {
            if object
                .get("model")
                .and_then(Value::as_str)
                .and_then(valid_passthrough_model)
                .is_some()
            {
                object.insert("model".to_owned(), Value::String(provider_model.to_owned()));
                return true;
            }
            for (key, value) in object {
                if key == "metadata" {
                    continue;
                }
                if rewrite_first_nested_model(value, provider_model) {
                    return true;
                }
            }
            false
        }
        Value::Array(values) => values
            .iter_mut()
            .any(|value| rewrite_first_nested_model(value, provider_model)),
        _ => false,
    }
}

fn rewrite_form_model(
    body: Bytes,
    provider_model: &str,
) -> Result<Bytes, OpenAiPassthroughPayloadError> {
    let mut pairs = parse_url_encoded_pairs(&body);
    if let Some((_, value)) = pairs.iter_mut().find(|(name, _)| name == "model") {
        *value = provider_model.to_owned();
    }
    Ok(Bytes::from(serialize_url_encoded_pairs(&pairs)))
}

fn model_from_multipart_form(
    headers: &HeaderMap,
    body: &[u8],
) -> Result<Option<String>, OpenAiPassthroughPayloadError> {
    let boundary = multipart_boundary(headers).ok_or_else(|| {
        OpenAiPassthroughPayloadError::invalid_request("multipart/form-data boundary is required")
    })?;
    let Some(range) = multipart_field_value_range(body, boundary.as_bytes(), "model") else {
        return Ok(None);
    };
    let value = String::from_utf8_lossy(&body[range.start..range.end]);
    require_passthrough_model(&value).map(Some)
}

fn rewrite_multipart_model(
    headers: &HeaderMap,
    body: Bytes,
    provider_model: &str,
) -> Result<Bytes, OpenAiPassthroughPayloadError> {
    let boundary = multipart_boundary(headers).ok_or_else(|| {
        OpenAiPassthroughPayloadError::invalid_request("multipart/form-data boundary is required")
    })?;
    let range = multipart_field_value_range(&body, boundary.as_bytes(), "model")
        .ok_or_else(|| OpenAiPassthroughPayloadError::invalid_request("model is required"))?;
    let mut rewritten = Vec::with_capacity(
        body.len()
            .saturating_sub(range.end.saturating_sub(range.start))
            + provider_model.len(),
    );
    rewritten.extend_from_slice(&body[..range.start]);
    rewritten.extend_from_slice(provider_model.as_bytes());
    rewritten.extend_from_slice(&body[range.end..]);
    Ok(Bytes::from(rewritten))
}

fn valid_passthrough_model(value: &str) -> Option<String> {
    let value = value.trim();
    (!value.is_empty()).then(|| value.to_owned())
}

fn require_passthrough_model(value: &str) -> Result<String, OpenAiPassthroughPayloadError> {
    valid_passthrough_model(value)
        .ok_or_else(|| OpenAiPassthroughPayloadError::invalid_request("model must not be blank"))
}

fn parse_url_encoded_pairs(body: &[u8]) -> Vec<(String, String)> {
    String::from_utf8_lossy(body)
        .split('&')
        .filter(|pair| !pair.is_empty())
        .map(|pair| {
            let (name, value) = pair.split_once('=').unwrap_or((pair, ""));
            (
                percent_decode_form_component(name),
                percent_decode_form_component(value),
            )
        })
        .collect()
}

fn serialize_url_encoded_pairs(pairs: &[(String, String)]) -> String {
    pairs
        .iter()
        .map(|(name, value)| {
            format!(
                "{}={}",
                percent_encode_form_component(name),
                percent_encode_form_component(value)
            )
        })
        .collect::<Vec<_>>()
        .join("&")
}

fn percent_decode_form_component(value: &str) -> String {
    let bytes = value.as_bytes();
    let mut decoded = Vec::with_capacity(bytes.len());
    let mut index = 0usize;
    while index < bytes.len() {
        match bytes[index] {
            b'+' => {
                decoded.push(b' ');
                index += 1;
            }
            b'%' if index + 2 < bytes.len() => {
                if let (Some(high), Some(low)) =
                    (hex_digit(bytes[index + 1]), hex_digit(bytes[index + 2]))
                {
                    decoded.push((high << 4) | low);
                    index += 3;
                } else {
                    decoded.push(bytes[index]);
                    index += 1;
                }
            }
            byte => {
                decoded.push(byte);
                index += 1;
            }
        }
    }
    String::from_utf8_lossy(&decoded).into_owned()
}

fn percent_encode_form_component(value: &str) -> String {
    let mut encoded = String::new();
    for byte in value.bytes() {
        let character = byte as char;
        if character.is_ascii_alphanumeric() || matches!(character, '-' | '_' | '.' | '*') {
            encoded.push(character);
        } else if byte == b' ' {
            encoded.push('+');
        } else {
            encoded.push_str(&format!("%{byte:02X}"));
        }
    }
    encoded
}

fn hex_digit(byte: u8) -> Option<u8> {
    match byte {
        b'0'..=b'9' => Some(byte - b'0'),
        b'a'..=b'f' => Some(byte - b'a' + 10),
        b'A'..=b'F' => Some(byte - b'A' + 10),
        _ => None,
    }
}

fn method_allows_request_body(method: &Method) -> bool {
    !matches!(method, &Method::GET | &Method::HEAD | &Method::DELETE)
}

fn request_content_type_is_json(headers: &HeaderMap) -> bool {
    request_content_type(headers)
        .map(|value| value.contains("json"))
        .unwrap_or(false)
}

fn request_content_type_is_form_urlencoded(headers: &HeaderMap) -> bool {
    request_content_type(headers)
        .map(|value| value.starts_with("application/x-www-form-urlencoded"))
        .unwrap_or(false)
}

fn request_content_type_is_multipart_form(headers: &HeaderMap) -> bool {
    request_content_type(headers)
        .and_then(|value| {
            value
                .split(';')
                .next()
                .map(|media_type| media_type.trim() == "multipart/form-data")
        })
        .unwrap_or(false)
}

fn multipart_boundary(headers: &HeaderMap) -> Option<String> {
    let content_type = headers.get(header::CONTENT_TYPE)?.to_str().ok()?;
    for parameter in content_type.split(';').skip(1) {
        let Some((name, value)) = parameter.trim().split_once('=') else {
            continue;
        };
        if name.trim().eq_ignore_ascii_case("boundary") {
            let value = unquote_header_parameter_value(value.trim()).trim();
            if !value.is_empty() {
                return Some(value.to_owned());
            }
        }
    }
    None
}

fn unquote_header_parameter_value(value: &str) -> &str {
    value
        .strip_prefix('"')
        .and_then(|value| value.strip_suffix('"'))
        .unwrap_or(value)
}

fn multipart_field_value_range(
    body: &[u8],
    boundary: &[u8],
    field_name: &str,
) -> Option<std::ops::Range<usize>> {
    if body.is_empty() || boundary.is_empty() || field_name.is_empty() {
        return None;
    }
    let marker = multipart_boundary_marker(boundary);
    let mut search_start = 0usize;
    while let Some(relative_start) = find_bytes(&body[search_start..], &marker) {
        let boundary_start = search_start + relative_start;
        let mut cursor = boundary_start + marker.len();
        if body.get(cursor..cursor + 2) == Some(b"--") {
            return None;
        }
        if body.get(cursor..cursor + 2) != Some(b"\r\n") {
            search_start = cursor;
            continue;
        }
        cursor += 2;
        let headers_end = cursor + find_bytes(&body[cursor..], b"\r\n\r\n")?;
        let headers = String::from_utf8_lossy(&body[cursor..headers_end]);
        let value_start = headers_end + 4;
        let boundary_prefix = multipart_next_boundary_prefix(boundary);
        let relative_value_end = find_bytes(&body[value_start..], &boundary_prefix)?;
        let value_end = value_start + relative_value_end;
        if multipart_headers_contain_field_name(&headers, field_name) {
            return Some(value_start..value_end);
        }
        search_start = value_end + 2;
    }
    None
}

fn multipart_boundary_marker(boundary: &[u8]) -> Vec<u8> {
    let mut marker = Vec::with_capacity(boundary.len() + 2);
    marker.extend_from_slice(b"--");
    marker.extend_from_slice(boundary);
    marker
}

fn multipart_next_boundary_prefix(boundary: &[u8]) -> Vec<u8> {
    let mut marker = Vec::with_capacity(boundary.len() + 4);
    marker.extend_from_slice(b"\r\n--");
    marker.extend_from_slice(boundary);
    marker
}

fn multipart_headers_contain_field_name(headers: &str, field_name: &str) -> bool {
    headers
        .lines()
        .filter_map(|line| line.split_once(':'))
        .any(|(name, value)| {
            name.trim().eq_ignore_ascii_case("content-disposition")
                && multipart_content_disposition_name(value)
                    .map(|name| name == field_name)
                    .unwrap_or(false)
        })
}

fn multipart_content_disposition_name(value: &str) -> Option<String> {
    let mut parameters = value.split(';');
    if !parameters
        .next()
        .map(|disposition| disposition.trim().eq_ignore_ascii_case("form-data"))
        .unwrap_or(false)
    {
        return None;
    }
    for parameter in parameters {
        let Some((name, value)) = parameter.trim().split_once('=') else {
            continue;
        };
        if name.trim().eq_ignore_ascii_case("name") {
            return Some(unquote_header_parameter_value(value.trim()).to_owned());
        }
    }
    None
}

fn find_bytes(haystack: &[u8], needle: &[u8]) -> Option<usize> {
    if needle.is_empty() {
        return Some(0);
    }
    haystack
        .windows(needle.len())
        .position(|window| window == needle)
}

fn request_content_type(headers: &HeaderMap) -> Option<String> {
    headers
        .get(header::CONTENT_TYPE)
        .and_then(|value| value.to_str().ok())
        .map(|value| value.trim().to_ascii_lowercase())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn requested_model_extracts_json_body_model() {
        let mut headers = HeaderMap::new();
        headers.insert(header::CONTENT_TYPE, "application/json".parse().unwrap());
        let model = requested_model(
            &Method::POST,
            &"/v1/images/generations".parse().unwrap(),
            &headers,
            br#"{"model":"gpt-image-1","prompt":"logo"}"#,
        )
        .unwrap();

        assert_eq!("gpt-image-1", model);
    }

    #[test]
    fn requested_model_prefers_json_body_model_over_query_model_for_body_request() {
        let mut headers = HeaderMap::new();
        headers.insert(header::CONTENT_TYPE, "application/json".parse().unwrap());
        let model = requested_model(
            &Method::POST,
            &"/v1/responses?model=query-filter".parse().unwrap(),
            &headers,
            br#"{"model":"gpt-4o-mini","input":"hello"}"#,
        )
        .unwrap();

        assert_eq!("gpt-4o-mini", model);
    }

    #[test]
    fn requested_model_rejects_blank_json_model() {
        let mut headers = HeaderMap::new();
        headers.insert(header::CONTENT_TYPE, "application/json".parse().unwrap());

        let error = optional_requested_model_with_source(
            &Method::POST,
            &"/v1/threads/thread_123/runs".parse().unwrap(),
            &headers,
            br#"{"assistant_id":"asst_123","model":"  "}"#,
        )
        .unwrap_err();

        assert_eq!("model must not be blank", error.to_string());
    }

    #[test]
    fn requested_model_rejects_non_string_json_model() {
        let mut headers = HeaderMap::new();
        headers.insert(header::CONTENT_TYPE, "application/json".parse().unwrap());

        for body in [
            br#"{"assistant_id":"asst_123","model":null}"#.as_slice(),
            br#"{"assistant_id":"asst_123","model":42}"#.as_slice(),
        ] {
            let error = optional_requested_model_with_source(
                &Method::POST,
                &"/v1/threads/thread_123/runs".parse().unwrap(),
                &headers,
                body,
            )
            .unwrap_err();

            assert_eq!("model must be a string", error.to_string());
        }
    }

    #[test]
    fn requested_model_prefers_query_model_for_bodyless_request() {
        let model = requested_model(
            &Method::GET,
            &"/v1/chat/completions?model=gpt-5.4&limit=20"
                .parse()
                .unwrap(),
            &HeaderMap::new(),
            b"",
        )
        .unwrap();

        assert_eq!("gpt-5.4", model);
    }

    #[test]
    fn requested_model_rejects_blank_query_model() {
        let error = optional_requested_model_with_source(
            &Method::GET,
            &"/v1/responses/input_tokens?model=+&include=usage"
                .parse()
                .unwrap(),
            &HeaderMap::new(),
            b"",
        )
        .unwrap_err();

        assert_eq!("model must not be blank", error.to_string());
    }

    #[test]
    fn requested_model_extracts_delete_model_path_segment() {
        let model = requested_model(
            &Method::DELETE,
            &"/v1/models/ft:gpt-4o-mini:org:custom".parse().unwrap(),
            &HeaderMap::new(),
            b"",
        )
        .unwrap();

        assert_eq!("ft:gpt-4o-mini:org:custom", model);
    }

    #[test]
    fn rewrite_url_encoded_model_replaces_query_model_only() {
        let rewritten = rewrite_url_encoded_model(
            "limit=20&model=gpt-4o-mini&after=cursor%2F1",
            "openrouter/gpt-4o-mini",
        );

        assert_eq!(
            "limit=20&model=openrouter%2Fgpt-4o-mini&after=cursor%2F1",
            rewritten
        );
    }

    #[test]
    fn rewrite_body_replaces_urlencoded_model() {
        let mut headers = HeaderMap::new();
        headers.insert(
            header::CONTENT_TYPE,
            "application/x-www-form-urlencoded".parse().unwrap(),
        );

        let body = rewrite_body(
            &Method::POST,
            &"/v1/images/generations".parse().unwrap(),
            &headers,
            Bytes::from_static(b"model=gpt-image-1&prompt=hello+world"),
            "openrouter/gpt-image-1",
        )
        .unwrap();

        assert_eq!("model=openrouter%2Fgpt-image-1&prompt=hello+world", body);
    }

    #[test]
    fn requested_model_rejects_blank_urlencoded_model() {
        let mut headers = HeaderMap::new();
        headers.insert(
            header::CONTENT_TYPE,
            "application/x-www-form-urlencoded".parse().unwrap(),
        );

        let error = optional_requested_model_with_source(
            &Method::POST,
            &"/v1/images/generations".parse().unwrap(),
            &headers,
            b"model=+&prompt=hello",
        )
        .unwrap_err();

        assert_eq!("model must not be blank", error.to_string());
    }

    #[test]
    fn requested_model_and_rewrite_body_support_multipart_form_data() {
        let boundary = "claw-router-boundary";
        let mut headers = HeaderMap::new();
        headers.insert(
            header::CONTENT_TYPE,
            format!("multipart/form-data; ignored; boundary=\"{boundary}\"")
                .parse()
                .unwrap(),
        );
        let body = format!(
            "--{boundary}\r\n\
Content-Disposition: form-data; unknown; name=\"prompt\"\r\n\
\r\n\
edit\r\n\
--{boundary}\r\n\
Content-Disposition: form-data; unknown; name=\"model\"\r\n\
\r\n\
gpt-image-1\r\n\
--{boundary}\r\n\
Content-Disposition: form-data; name=\"image\"; filename=\"image.png\"\r\n\
Content-Type: image/png\r\n\
\r\n\
fake-png\r\n\
--{boundary}--\r\n"
        );

        let model = requested_model(
            &Method::POST,
            &"/v1/images/edits".parse().unwrap(),
            &headers,
            body.as_bytes(),
        )
        .unwrap();
        let rewritten = rewrite_body(
            &Method::POST,
            &"/v1/images/edits".parse().unwrap(),
            &headers,
            Bytes::from(body),
            "openrouter/gpt-image-1",
        )
        .unwrap();
        let rewritten = String::from_utf8(rewritten.to_vec()).unwrap();

        assert_eq!("gpt-image-1", model);
        assert!(rewritten.contains("name=\"model\"\r\n\r\nopenrouter/gpt-image-1\r\n"));
        assert!(rewritten.contains("fake-png"));
    }

    #[test]
    fn requested_model_rejects_multipart_form_data_without_boundary() {
        let mut headers = HeaderMap::new();
        headers.insert(header::CONTENT_TYPE, "multipart/form-data".parse().unwrap());

        let error = optional_requested_model_with_source(
            &Method::POST,
            &"/v1/images/edits".parse().unwrap(),
            &headers,
            b"model=gpt-image-1",
        )
        .unwrap_err();

        assert_eq!(
            "multipart/form-data boundary is required",
            error.to_string()
        );
    }

    #[test]
    fn requested_model_and_rewrite_body_support_nested_grader_model() {
        let mut headers = HeaderMap::new();
        headers.insert(header::CONTENT_TYPE, "application/json".parse().unwrap());
        let body = br#"{
            "grader": {
                "type": "score_model",
                "model": "gpt-4o-mini",
                "input": [{"role": "user", "content": "grade this"}]
            },
            "input": {"question": "hello"}
        }"#;

        let model = requested_model(
            &Method::POST,
            &"/v1/fine_tuning/alpha/graders/run".parse().unwrap(),
            &headers,
            body,
        )
        .unwrap();
        let rewritten = rewrite_body(
            &Method::POST,
            &"/v1/fine_tuning/alpha/graders/run".parse().unwrap(),
            &headers,
            Bytes::copy_from_slice(body),
            "gpt-4o-mini",
        )
        .unwrap();
        let rewritten: Value = serde_json::from_slice(&rewritten).unwrap();

        assert_eq!("gpt-4o-mini", model);
        assert_eq!("gpt-4o-mini", rewritten["grader"]["model"]);
        assert!(rewritten.get("model").is_none());
    }

    #[test]
    fn requested_model_and_rewrite_body_support_nested_eval_model() {
        let mut headers = HeaderMap::new();
        headers.insert(header::CONTENT_TYPE, "application/json".parse().unwrap());
        let body = br#"{
            "data_source": {
                "type": "responses",
                "model": "gpt-4o-mini",
                "input": [{"role": "user", "content": "run eval"}]
            },
            "name": "quality run"
        }"#;

        let model = requested_model(
            &Method::POST,
            &"/v1/evals/eval_123/runs".parse().unwrap(),
            &headers,
            body,
        )
        .unwrap();
        let rewritten = rewrite_body(
            &Method::POST,
            &"/v1/evals/eval_123/runs".parse().unwrap(),
            &headers,
            Bytes::copy_from_slice(body),
            "gpt-4o-mini",
        )
        .unwrap();
        let rewritten: Value = serde_json::from_slice(&rewritten).unwrap();

        assert_eq!("gpt-4o-mini", model);
        assert_eq!("gpt-4o-mini", rewritten["data_source"]["model"]);
        assert!(rewritten.get("model").is_none());
    }

    #[test]
    fn requested_model_and_rewrite_body_prefer_top_level_model_for_thread_run_override() {
        let mut headers = HeaderMap::new();
        headers.insert(header::CONTENT_TYPE, "application/json".parse().unwrap());
        let body = br#"{
            "assistant_id": "asst_123",
            "model": "gpt-4o-mini",
            "thread": {
                "messages": [
                    {"role": "user", "content": "hello"}
                ]
            }
        }"#;

        let model = requested_model(
            &Method::POST,
            &"/v1/threads/runs".parse().unwrap(),
            &headers,
            body,
        )
        .unwrap();
        let rewritten = rewrite_body(
            &Method::POST,
            &"/v1/threads/runs".parse().unwrap(),
            &headers,
            Bytes::copy_from_slice(body),
            "gpt-4o-mini",
        )
        .unwrap();
        let rewritten: Value = serde_json::from_slice(&rewritten).unwrap();

        assert_eq!("gpt-4o-mini", model);
        assert_eq!("gpt-4o-mini", rewritten["model"]);
    }
}
