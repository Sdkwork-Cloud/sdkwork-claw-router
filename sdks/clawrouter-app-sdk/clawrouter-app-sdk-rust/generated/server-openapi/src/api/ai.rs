use std::sync::Arc;

use crate::api::base::{RequestHeaders};
use crate::api::paths::app_path;
use crate::api::paths::append_query_string;
use crate::http::{SdkworkError, SdkworkHttpClient};
use crate::models::{CreateRoutingChannelRequest, DashboardOverviewRetrieveResult, GatewayTracesListResult, GenerationsListResult, ModelRankingsListResult, ModelVendorsListResult, ModelsListResult, ProvidersListResult, RoutingApiKeysListResult, RoutingChannelsCreateResult, RoutingChannelsDeleteResult, RoutingChannelsListResult, RoutingChannelsStatusUpdateResult, RoutingChannelsUpdateResult, RoutingChannelsVerifyResult, RoutingRequestTracesListResult, RoutingStrategyListResult, RoutingStrategyUpdateResult, RoutingUsageListResult, SetRoutingChannelStatusRequest, UpdateRoutingChannelRequest, UpdateRoutingStrategyRequest, UsageLogsListResult};

#[derive(Clone)]
pub struct AiApi {
    client: Arc<SdkworkHttpClient>,
}

impl AiApi {
    pub fn new(client: Arc<SdkworkHttpClient>) -> Self {
        Self { client }
    }

    /// List dashboard overview
    pub async fn dashboard_overview_retrieve(&self, time_range: Option<&str>, start_time: Option<&str>, end_time: Option<&str>) -> Result<DashboardOverviewRetrieveResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("time_range", time_range, "form", true, false, None),
            QueryParameterSpec::new("start_time", start_time, "form", true, false, None),
            QueryParameterSpec::new("end_time", end_time, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/ai/dashboard/overview".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// List traces
    pub async fn gateway_traces_list(&self) -> Result<GatewayTracesListResult, SdkworkError> {
        let path = app_path(&"/ai/gateway/traces".to_string());
        self.client.get(&path, None, None).await
    }

    /// List generation history
    pub async fn generations_list(&self) -> Result<GenerationsListResult, SdkworkError> {
        let path = app_path(&"/ai/generations".to_string());
        self.client.get(&path, None, None).await
    }

    /// List model rankings
    pub async fn model_rankings_list(&self, rank_scope: Option<&str>, vendor_code: Option<&str>, modality: Option<&str>, q: Option<&str>, limit: Option<i64>) -> Result<ModelRankingsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("rank_scope", rank_scope, "form", true, false, None),
            QueryParameterSpec::new("vendor_code", vendor_code, "form", true, false, None),
            QueryParameterSpec::new("modality", modality, "form", true, false, None),
            QueryParameterSpec::new("q", q, "form", true, false, None),
            QueryParameterSpec::new("limit", limit, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/ai/model_rankings".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// List ranking vendor filters
    pub async fn model_vendors_list(&self) -> Result<ModelVendorsListResult, SdkworkError> {
        let path = app_path(&"/ai/model_vendors".to_string());
        self.client.get(&path, None, None).await
    }

    /// List models
    pub async fn models_list(&self, billing_meter: Option<&str>, vendor_code: Option<&str>, vendor_codes: Option<&[String]>, modalities: Option<&[String]>, capabilities: Option<&[String]>, categories: Option<&[String]>, groups: Option<&[String]>, q: Option<&str>, limit: Option<i64>) -> Result<ModelsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("billing_meter", billing_meter, "form", true, false, None),
            QueryParameterSpec::new("vendor_code", vendor_code, "form", true, false, None),
            QueryParameterSpec::new("vendor_codes", vendor_codes, "form", false, false, None),
            QueryParameterSpec::new("modalities", modalities, "form", false, false, None),
            QueryParameterSpec::new("capabilities", capabilities, "form", false, false, None),
            QueryParameterSpec::new("categories", categories, "form", false, false, None),
            QueryParameterSpec::new("groups", groups, "form", false, false, None),
            QueryParameterSpec::new("q", q, "form", true, false, None),
            QueryParameterSpec::new("limit", limit, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/ai/models".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// List providers
    pub async fn providers_list(&self) -> Result<ProvidersListResult, SdkworkError> {
        let path = app_path(&"/ai/providers".to_string());
        self.client.get(&path, None, None).await
    }

    /// List API keys
    pub async fn routing_api_keys_list(&self) -> Result<RoutingApiKeysListResult, SdkworkError> {
        let path = app_path(&"/ai/routing/api_keys".to_string());
        self.client.get(&path, None, None).await
    }

    /// List channels
    pub async fn routing_channels_list(&self) -> Result<RoutingChannelsListResult, SdkworkError> {
        let path = app_path(&"/ai/routing/channels".to_string());
        self.client.get(&path, None, None).await
    }

    /// Create channel
    pub async fn routing_channels_create(&self, body: &CreateRoutingChannelRequest, x_request_id: Option<&str>) -> Result<RoutingChannelsCreateResult, SdkworkError> {
        let path = app_path(&"/ai/routing/channels".to_string());
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Delete channel
    pub async fn routing_channels_delete(&self, channel_id: &str) -> Result<RoutingChannelsDeleteResult, SdkworkError> {
        let path = app_path(&format!("/ai/routing/channels/{}", serialize_path_parameter(channel_id, PathParameterSpec::new("channelId", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// Update channel
    pub async fn routing_channels_update(&self, channel_id: &str, body: &UpdateRoutingChannelRequest, x_request_id: Option<&str>) -> Result<RoutingChannelsUpdateResult, SdkworkError> {
        let path = app_path(&format!("/ai/routing/channels/{}", serialize_path_parameter(channel_id, PathParameterSpec::new("channelId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.put(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Set channel status
    pub async fn routing_channels_status_update(&self, channel_id: &str, body: &SetRoutingChannelStatusRequest, x_request_id: Option<&str>) -> Result<RoutingChannelsStatusUpdateResult, SdkworkError> {
        let path = app_path(&format!("/ai/routing/channels/{}/status", serialize_path_parameter(channel_id, PathParameterSpec::new("channelId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.put(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Test channel
    pub async fn routing_channels_verify(&self, channel_id: &str, x_request_id: Option<&str>) -> Result<RoutingChannelsVerifyResult, SdkworkError> {
        let path = app_path(&format!("/ai/routing/channels/{}/verify", serialize_path_parameter(channel_id, PathParameterSpec::new("channelId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Option::<&serde_json::Value>::None, None, headers.as_ref(), None).await
    }

    /// List request traces
    pub async fn routing_request_traces_list(&self) -> Result<RoutingRequestTracesListResult, SdkworkError> {
        let path = app_path(&"/ai/routing/request_traces".to_string());
        self.client.get(&path, None, None).await
    }

    /// List strategy
    pub async fn routing_strategy_list(&self) -> Result<RoutingStrategyListResult, SdkworkError> {
        let path = app_path(&"/ai/routing/strategy".to_string());
        self.client.get(&path, None, None).await
    }

    /// Update strategy
    pub async fn routing_strategy_update(&self, body: &UpdateRoutingStrategyRequest) -> Result<RoutingStrategyUpdateResult, SdkworkError> {
        let path = app_path(&"/ai/routing/strategy".to_string());
        self.client.put(&path, Some(body), None, None, Some("application/json")).await
    }

    /// List usage data
    pub async fn routing_usage_list(&self) -> Result<RoutingUsageListResult, SdkworkError> {
        let path = app_path(&"/ai/routing/usage".to_string());
        self.client.get(&path, None, None).await
    }

    /// List logs
    pub async fn usage_logs_list(&self, page: Option<i64>, page_size: Option<i64>, q: Option<&str>, status: Option<&str>, start_time: Option<&str>, end_time: Option<&str>) -> Result<UsageLogsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("q", q, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
            QueryParameterSpec::new("start_time", start_time, "form", true, false, None),
            QueryParameterSpec::new("end_time", end_time, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/ai/usage/logs".to_string()), &query);
        self.client.get(&path, None, None).await
    }

}

struct PathParameterSpec<'a> {
    name: &'a str,
    style: &'a str,
    explode: bool,
}

impl<'a> PathParameterSpec<'a> {
    fn new(name: &'a str, style: &'a str, explode: bool) -> Self {
        Self { name, style, explode }
    }
}

fn serialize_path_parameter<T: serde::Serialize>(value: T, spec: PathParameterSpec<'_>) -> String {
    let value = serde_json::to_value(value).unwrap_or(serde_json::Value::Null);
    if value.is_null() {
        return String::new();
    }
    let style = if spec.style.is_empty() { "simple" } else { spec.style };
    match value {
        serde_json::Value::Array(values) => serialize_path_array(spec.name, &values, style, spec.explode),
        serde_json::Value::Object(values) => serialize_path_object(spec.name, &values, style, spec.explode),
        value => format!("{}{}", path_primitive_prefix(spec.name, style), percent_encode(&primitive_to_string(&value))),
    }
}

fn serialize_path_array(name: &str, values: &[serde_json::Value], style: &str, explode: bool) -> String {
    let serialized = values
        .iter()
        .filter(|value| !value.is_null())
        .map(|value| percent_encode(&primitive_to_string(value)))
        .collect::<Vec<_>>();
    if serialized.is_empty() {
        return path_prefix(name, style);
    }
    if style == "matrix" {
        if explode {
            return serialized.iter().map(|item| format!(";{}={}", name, item)).collect::<Vec<_>>().join("");
        }
        return format!(";{}={}", name, serialized.join(","));
    }
    let separator = if explode { "." } else { "," };
    format!("{}{}", path_prefix(name, style), serialized.join(separator))
}

fn serialize_path_object(
    name: &str,
    values: &serde_json::Map<String, serde_json::Value>,
    style: &str,
    explode: bool,
) -> String {
    let mut entries = Vec::new();
    let mut exploded = Vec::new();
    for (key, value) in values {
        if value.is_null() {
            continue;
        }
        let escaped_key = percent_encode(key);
        let escaped_value = percent_encode(&primitive_to_string(value));
        if explode {
            if style == "matrix" {
                exploded.push(format!(";{}={}", escaped_key, escaped_value));
            } else {
                exploded.push(format!("{}={}", escaped_key, escaped_value));
            }
        } else {
            entries.push(escaped_key);
            entries.push(escaped_value);
        }
    }
    if style == "matrix" {
        if explode {
            return exploded.join("");
        }
        return format!(";{}={}", name, entries.join(","));
    }
    if explode {
        let separator = if style == "label" { "." } else { "," };
        return format!("{}{}", path_prefix(name, style), exploded.join(separator));
    }
    format!("{}{}", path_prefix(name, style), entries.join(","))
}

fn path_prefix(name: &str, style: &str) -> String {
    match style {
        "label" => ".".to_string(),
        "matrix" => format!(";{}", name),
        _ => String::new(),
    }
}

fn path_primitive_prefix(name: &str, style: &str) -> String {
    if style == "matrix" {
        format!(";{}=", name)
    } else {
        path_prefix(name, style)
    }
}

struct HeaderParameterSpec {
    value: serde_json::Value,
    explode: bool,
    content_type: Option<&'static str>,
}

impl HeaderParameterSpec {
    fn new<T: serde::Serialize>(
        value: T,
        _style: &'static str,
        explode: bool,
        content_type: Option<&'static str>,
    ) -> Self {
        Self {
            value: serde_json::to_value(value).unwrap_or(serde_json::Value::Null),
            explode,
            content_type,
        }
    }
}

fn build_request_headers(headers: &[(&str, HeaderParameterSpec)], cookies: &[(&str, HeaderParameterSpec)]) -> Option<RequestHeaders> {
    let mut request_headers = RequestHeaders::new();
    for (name, parameter) in headers {
        if let Some(value) = serialize_header_parameter(parameter) {
            request_headers.insert((*name).to_string(), value);
        }
    }

    let cookie_header = build_cookie_header(cookies);
    if !cookie_header.is_empty() {
        request_headers
            .entry("Cookie".to_string())
            .and_modify(|existing| {
                existing.push_str("; ");
                existing.push_str(&cookie_header);
            })
            .or_insert(cookie_header);
    }

    if request_headers.is_empty() {
        None
    } else {
        Some(request_headers)
    }
}

fn build_cookie_header(cookies: &[(&str, HeaderParameterSpec)]) -> String {
    cookies
        .iter()
        .filter_map(|(name, value)| {
            serialize_header_parameter(value)
                .map(|value| format!("{}={}", percent_encode(name), percent_encode(&value)))
        })
        .collect::<Vec<_>>()
        .join("; ")
}

fn serialize_header_parameter(parameter: &HeaderParameterSpec) -> Option<String> {
    if parameter.value.is_null() {
        return None;
    }
    if parameter.content_type.is_some() {
        return Some(parameter.value.to_string());
    }
    match &parameter.value {
        serde_json::Value::Null => None,
        serde_json::Value::String(value) => Some(value.clone()),
        serde_json::Value::Number(value) => Some(value.to_string()),
        serde_json::Value::Bool(value) => Some(value.to_string()),
        serde_json::Value::Array(values) => {
            let serialized = values
                .iter()
                .filter_map(serialize_json_value)
                .collect::<Vec<_>>();
            if serialized.is_empty() {
                None
            } else {
                Some(serialized.join(","))
            }
        }
        serde_json::Value::Object(values) => {
            let serialized = values
                .iter()
                .filter_map(|(key, value)| {
                    serialize_json_value(value).map(|serialized| {
                        if parameter.explode {
                            format!("{}={}", key, serialized)
                        } else {
                            format!("{},{}", key, serialized)
                        }
                    })
                })
                .collect::<Vec<_>>();
            if serialized.is_empty() {
                None
            } else {
                Some(serialized.join(","))
            }
        }
    }
}

fn serialize_json_value(value: &serde_json::Value) -> Option<String> {
    match value {
        serde_json::Value::Null => None,
        serde_json::Value::String(value) => Some(value.clone()),
        serde_json::Value::Number(value) => Some(value.to_string()),
        serde_json::Value::Bool(value) => Some(value.to_string()),
        other => Some(other.to_string()),
    }
}

struct QueryParameterSpec<'a> {
    name: &'a str,
    value: serde_json::Value,
    style: &'a str,
    explode: bool,
    allow_reserved: bool,
    content_type: Option<&'a str>,
}

impl<'a> QueryParameterSpec<'a> {
    fn new<T: serde::Serialize>(
        name: &'a str,
        value: T,
        style: &'a str,
        explode: bool,
        allow_reserved: bool,
        content_type: Option<&'a str>,
    ) -> Self {
        Self {
            name,
            value: serde_json::to_value(value).unwrap_or(serde_json::Value::Null),
            style,
            explode,
            allow_reserved,
            content_type,
        }
    }
}

fn build_query_string(parameters: &[QueryParameterSpec<'_>]) -> String {
    let mut pairs = Vec::new();
    for parameter in parameters {
        append_serialized_parameter(&mut pairs, parameter);
    }
    pairs.join("&")
}

fn append_serialized_parameter(pairs: &mut Vec<String>, parameter: &QueryParameterSpec<'_>) {
    if parameter.value.is_null() {
        return;
    }
    if parameter.content_type.is_some() {
        pairs.push(format!(
            "{}={}",
            percent_encode(parameter.name),
            encode_query_value(&parameter.value.to_string(), parameter.allow_reserved)
        ));
        return;
    }

    let style = if parameter.style.is_empty() { "form" } else { parameter.style };
    match &parameter.value {
        serde_json::Value::Array(values) => append_array_parameter(pairs, parameter.name, values, style, parameter.explode, parameter.allow_reserved),
        serde_json::Value::Object(values) if style == "deepObject" => append_deep_object_parameter(pairs, parameter.name, values, parameter.allow_reserved),
        serde_json::Value::Object(values) => append_object_parameter(pairs, parameter.name, values, style, parameter.explode, parameter.allow_reserved),
        value => pairs.push(format!("{}={}", percent_encode(parameter.name), encode_query_value(&primitive_to_string(value), parameter.allow_reserved))),
    }
}

fn append_array_parameter(
    pairs: &mut Vec<String>,
    name: &str,
    values: &[serde_json::Value],
    style: &str,
    explode: bool,
    allow_reserved: bool,
) {
    let serialized = values.iter().filter(|value| !value.is_null()).map(primitive_to_string).collect::<Vec<_>>();
    if serialized.is_empty() {
        return;
    }
    if style == "form" && explode {
        for item in serialized {
            pairs.push(format!("{}={}", percent_encode(name), encode_query_value(&item, allow_reserved)));
        }
        return;
    }
    pairs.push(format!("{}={}", percent_encode(name), encode_query_value(&serialized.join(","), allow_reserved)));
}

fn append_object_parameter(
    pairs: &mut Vec<String>,
    name: &str,
    values: &serde_json::Map<String, serde_json::Value>,
    style: &str,
    explode: bool,
    allow_reserved: bool,
) {
    let mut serialized = Vec::new();
    for (key, value) in values {
        if value.is_null() {
            continue;
        }
        if style == "form" && explode {
            pairs.push(format!("{}={}", percent_encode(key), encode_query_value(&primitive_to_string(value), allow_reserved)));
        } else {
            serialized.push(key.clone());
            serialized.push(primitive_to_string(value));
        }
    }
    if !serialized.is_empty() {
        pairs.push(format!("{}={}", percent_encode(name), encode_query_value(&serialized.join(","), allow_reserved)));
    }
}

fn append_deep_object_parameter(
    pairs: &mut Vec<String>,
    name: &str,
    values: &serde_json::Map<String, serde_json::Value>,
    allow_reserved: bool,
) {
    for (key, value) in values {
        if !value.is_null() {
            pairs.push(format!("{}={}", percent_encode(&format!("{}[{}]", name, key)), encode_query_value(&primitive_to_string(value), allow_reserved)));
        }
    }
}

fn encode_query_value(value: &str, allow_reserved: bool) -> String {
    let mut encoded = percent_encode(value);
    if !allow_reserved {
        return encoded;
    }
    for (escaped, reserved) in [
        ("%3A", ":"), ("%2F", "/"), ("%3F", "?"), ("%23", "#"),
        ("%5B", "["), ("%5D", "]"), ("%40", "@"), ("%21", "!"),
        ("%24", "$"), ("%26", "&"), ("%27", "'"), ("%28", "("),
        ("%29", ")"), ("%2A", "*"), ("%2B", "+"), ("%2C", ","),
        ("%3B", ";"), ("%3D", "="),
    ] {
        encoded = encoded.replace(escaped, reserved);
    }
    encoded
}

fn primitive_to_string(value: &serde_json::Value) -> String {
    match value {
        serde_json::Value::String(value) => value.clone(),
        serde_json::Value::Number(value) => value.to_string(),
        serde_json::Value::Bool(value) => value.to_string(),
        other => other.to_string(),
    }
}

fn percent_encode(value: &str) -> String {
    value
        .bytes()
        .flat_map(|byte| match byte {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                vec![byte as char]
            }
            _ => format!("%{:02X}", byte).chars().collect(),
        })
        .collect()
}
