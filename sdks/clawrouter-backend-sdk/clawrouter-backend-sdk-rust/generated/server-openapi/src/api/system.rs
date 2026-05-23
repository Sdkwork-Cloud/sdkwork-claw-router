use std::sync::Arc;

use crate::api::base::{RequestHeaders};
use crate::api::paths::backend_path;
use crate::api::paths::append_query_string;
use crate::http::{SdkworkError, SdkworkHttpClient};
use crate::models::{AdminAuthSettingsUpdateRequest, AdminFirewallRuleCreateRequest, AdminIpLimitCreateRequest, AdminModelLimitCreateRequest, AdminSiteSettingsUpdateRequest, AdminTokenLimitCreateRequest, AnalyticsAdminOverviewRetrieveResult, AuthSettingsRetrieveResult, AuthSettingsUpdateResult, CacheInstancesDeleteResult, CacheInstancesRefreshCreateResult, CacheNamespacesDeleteResult, CacheNamespacesKeysDeleteResult, CacheNamespacesKeysListResult, CacheNamespacesRefreshCreateResult, CacheOverviewRetrieveResult, CacheRefreshCreateResult, DashboardAdminOverviewRetrieveResult, FirewallsRulesCreateResult, FirewallsRulesDeleteResult, FirewallsRulesListResult, InstallationStatusRetrieveResult, MarketingReferralStatsListResult, MonitorAlertsListResult, MonitorNodesListResult, MonitorPerformanceListResult, RateLimitsApiKeysCreateResult, RateLimitsApiKeysListResult, RateLimitsIpCreateResult, RateLimitsIpListResult, RateLimitsModelsCreateResult, RateLimitsModelsListResult, RecordsListResult, SiteSettingsRetrieveResult, SiteSettingsUpdateResult};

#[derive(Clone)]
pub struct SystemApi {
    client: Arc<SdkworkHttpClient>,
}

impl SystemApi {
    pub fn new(client: Arc<SdkworkHttpClient>) -> Self {
        Self { client }
    }

    /// List overview
    pub async fn analytics_admin_overview_retrieve(&self, time_range: Option<&str>, start_time: Option<&str>, end_time: Option<&str>, limit: Option<i64>) -> Result<AnalyticsAdminOverviewRetrieveResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("time_range", time_range, "form", true, false, None),
            QueryParameterSpec::new("start_time", start_time, "form", true, false, None),
            QueryParameterSpec::new("end_time", end_time, "form", true, false, None),
            QueryParameterSpec::new("limit", limit, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/system/analytics/admin/overview".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Retrieve IAM auth runtime settings
    pub async fn auth_settings_retrieve(&self) -> Result<AuthSettingsRetrieveResult, SdkworkError> {
        let path = backend_path(&"/system/auth/settings".to_string());
        self.client.get(&path, None, None).await
    }

    /// Update IAM auth runtime settings
    pub async fn auth_settings_update(&self, body: &AdminAuthSettingsUpdateRequest, x_request_id: Option<&str>) -> Result<AuthSettingsUpdateResult, SdkworkError> {
        let path = backend_path(&"/system/auth/settings".to_string());
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.patch(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Delete one runtime cache instance
    pub async fn cache_instances_delete(&self, instance_name: &str) -> Result<CacheInstancesDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/system/cache/instances/{}", serialize_path_parameter(instance_name, PathParameterSpec::new("instanceName", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// Refresh one runtime cache instance
    pub async fn cache_instances_refresh_create(&self, instance_name: &str) -> Result<CacheInstancesRefreshCreateResult, SdkworkError> {
        let path = backend_path(&format!("/system/cache/instances/{}/refresh", serialize_path_parameter(instance_name, PathParameterSpec::new("instanceName", "simple", false))));
        self.client.post(&path, Option::<&serde_json::Value>::None, None, None, None).await
    }

    /// Delete a runtime cache namespace
    pub async fn cache_namespaces_delete(&self, namespace: &str) -> Result<CacheNamespacesDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/system/cache/namespaces/{}", serialize_path_parameter(namespace, PathParameterSpec::new("namespace", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// List runtime cache keys in a namespace
    pub async fn cache_namespaces_keys_list(&self, namespace: &str, limit: Option<i64>, cursor: Option<&str>) -> Result<CacheNamespacesKeysListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("limit", limit, "form", true, false, None),
            QueryParameterSpec::new("cursor", cursor, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&format!("/system/cache/namespaces/{}/keys", serialize_path_parameter(namespace, PathParameterSpec::new("namespace", "simple", false)))), &query);
        self.client.get(&path, None, None).await
    }

    /// Delete a runtime cache key
    pub async fn cache_namespaces_keys_delete(&self, namespace: &str, key: &str) -> Result<CacheNamespacesKeysDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/system/cache/namespaces/{}/keys/{}", serialize_path_parameter(namespace, PathParameterSpec::new("namespace", "simple", false)), serialize_path_parameter(key, PathParameterSpec::new("key", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// Refresh one runtime cache namespace
    pub async fn cache_namespaces_refresh_create(&self, namespace: &str) -> Result<CacheNamespacesRefreshCreateResult, SdkworkError> {
        let path = backend_path(&format!("/system/cache/namespaces/{}/refresh", serialize_path_parameter(namespace, PathParameterSpec::new("namespace", "simple", false))));
        self.client.post(&path, Option::<&serde_json::Value>::None, None, None, None).await
    }

    /// Retrieve runtime cache overview
    pub async fn cache_overview_retrieve(&self) -> Result<CacheOverviewRetrieveResult, SdkworkError> {
        let path = backend_path(&"/system/cache/overview".to_string());
        self.client.get(&path, None, None).await
    }

    /// Refresh all runtime cache instances
    pub async fn cache_refresh_create(&self) -> Result<CacheRefreshCreateResult, SdkworkError> {
        let path = backend_path(&"/system/cache/refresh".to_string());
        self.client.post(&path, Option::<&serde_json::Value>::None, None, None, None).await
    }

    /// List dashboard data
    pub async fn dashboard_admin_overview_retrieve(&self) -> Result<DashboardAdminOverviewRetrieveResult, SdkworkError> {
        let path = backend_path(&"/system/dashboard/admin/overview".to_string());
        self.client.get(&path, None, None).await
    }

    /// List firewalls
    pub async fn firewalls_rules_list(&self) -> Result<FirewallsRulesListResult, SdkworkError> {
        let path = backend_path(&"/system/firewalls/rules".to_string());
        self.client.get(&path, None, None).await
    }

    /// Create firewall
    pub async fn firewalls_rules_create(&self, body: &AdminFirewallRuleCreateRequest, x_request_id: Option<&str>) -> Result<FirewallsRulesCreateResult, SdkworkError> {
        let path = backend_path(&"/system/firewalls/rules".to_string());
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Delete firewall
    pub async fn firewalls_rules_delete(&self, rule_id: &str) -> Result<FirewallsRulesDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/system/firewalls/rules/{}", serialize_path_parameter(rule_id, PathParameterSpec::new("ruleId", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// List installation status
    pub async fn installation_status_retrieve(&self) -> Result<InstallationStatusRetrieveResult, SdkworkError> {
        let path = backend_path(&"/system/installation/status".to_string());
        self.client.get(&path, None, None).await
    }

    /// List referral stats
    pub async fn marketing_referral_stats_list(&self) -> Result<MarketingReferralStatsListResult, SdkworkError> {
        let path = backend_path(&"/system/marketing/referral_stats".to_string());
        self.client.get(&path, None, None).await
    }

    /// List alerts
    pub async fn monitor_alerts_list(&self) -> Result<MonitorAlertsListResult, SdkworkError> {
        let path = backend_path(&"/system/monitor/alerts".to_string());
        self.client.get(&path, None, None).await
    }

    /// List nodes
    pub async fn monitor_nodes_list(&self) -> Result<MonitorNodesListResult, SdkworkError> {
        let path = backend_path(&"/system/monitor/nodes".to_string());
        self.client.get(&path, None, None).await
    }

    /// List performance data
    pub async fn monitor_performance_list(&self) -> Result<MonitorPerformanceListResult, SdkworkError> {
        let path = backend_path(&"/system/monitor/performance".to_string());
        self.client.get(&path, None, None).await
    }

    /// List token limits
    pub async fn rate_limits_api_keys_list(&self) -> Result<RateLimitsApiKeysListResult, SdkworkError> {
        let path = backend_path(&"/system/rate_limits/api_keys".to_string());
        self.client.get(&path, None, None).await
    }

    /// Create token limit
    pub async fn rate_limits_api_keys_create(&self, body: &AdminTokenLimitCreateRequest, x_request_id: Option<&str>) -> Result<RateLimitsApiKeysCreateResult, SdkworkError> {
        let path = backend_path(&"/system/rate_limits/api_keys".to_string());
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// List IP limits
    pub async fn rate_limits_ip_list(&self) -> Result<RateLimitsIpListResult, SdkworkError> {
        let path = backend_path(&"/system/rate_limits/ip".to_string());
        self.client.get(&path, None, None).await
    }

    /// Create IP limit
    pub async fn rate_limits_ip_create(&self, body: &AdminIpLimitCreateRequest, x_request_id: Option<&str>) -> Result<RateLimitsIpCreateResult, SdkworkError> {
        let path = backend_path(&"/system/rate_limits/ip".to_string());
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// List model limits
    pub async fn rate_limits_models_list(&self) -> Result<RateLimitsModelsListResult, SdkworkError> {
        let path = backend_path(&"/system/rate_limits/models".to_string());
        self.client.get(&path, None, None).await
    }

    /// Create model limit
    pub async fn rate_limits_models_create(&self, body: &AdminModelLimitCreateRequest, x_request_id: Option<&str>) -> Result<RateLimitsModelsCreateResult, SdkworkError> {
        let path = backend_path(&"/system/rate_limits/models".to_string());
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// List logs
    pub async fn records_list(&self, page: Option<i64>, page_size: Option<i64>, user: Option<&str>, token: Option<&str>, model: Option<&str>) -> Result<RecordsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("user", user, "form", true, false, None),
            QueryParameterSpec::new("token", token, "form", true, false, None),
            QueryParameterSpec::new("model", model, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/system/records".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Retrieve site branding and deployment personalization settings
    pub async fn site_settings_retrieve(&self) -> Result<SiteSettingsRetrieveResult, SdkworkError> {
        let path = backend_path(&"/system/site/settings".to_string());
        self.client.get(&path, None, None).await
    }

    /// Update site branding and deployment personalization settings
    pub async fn site_settings_update(&self, body: &AdminSiteSettingsUpdateRequest, x_request_id: Option<&str>) -> Result<SiteSettingsUpdateResult, SdkworkError> {
        let path = backend_path(&"/system/site/settings".to_string());
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.patch(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
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
