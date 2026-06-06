use std::sync::Arc;

use crate::api::paths::backend_path;
use crate::api::paths::append_query_string;
use crate::http::{SdkworkError, SdkworkHttpClient};
use crate::models::{AdminAppCategoryCreateRequest, AdminAppCategoryUpdateRequest, AdminAppCreateRequest, AdminAppTemplateCreateRequest, AdminAppTemplateUpdateRequest, AdminAppUpdateRequest, AppsCategoriesCreateResult, AppsCategoriesDeleteResult, AppsCategoriesListResult, AppsCategoriesUpdateResult, AppsCreateResult, AppsDeleteResult, AppsDisableResult, AppsEnableResult, AppsListResult, AppsPublishResult, AppsRetrieveResult, AppsTemplatesCreateResult, AppsTemplatesDeleteResult, AppsTemplatesListResult, AppsTemplatesPublishResult, AppsTemplatesRetrieveResult, AppsTemplatesUnpublishResult, AppsTemplatesUpdateResult, AppsUnpublishResult, AppsUpdateResult};

#[derive(Clone)]
pub struct PlatformApi {
    client: Arc<SdkworkHttpClient>,
}

impl PlatformApi {
    pub fn new(client: Arc<SdkworkHttpClient>) -> Self {
        Self { client }
    }

    /// List apps
    pub async fn apps_list(&self, q: Option<&str>, status: Option<&str>, market_status: Option<&str>, app_type: Option<&str>, category_id: Option<&str>, page: Option<&str>, page_size: Option<&str>) -> Result<AppsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("q", q, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
            QueryParameterSpec::new("market_status", market_status, "form", true, false, None),
            QueryParameterSpec::new("app_type", app_type, "form", true, false, None),
            QueryParameterSpec::new("category_id", category_id, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/platform/apps".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Create app
    pub async fn apps_create(&self, body: &AdminAppCreateRequest) -> Result<AppsCreateResult, SdkworkError> {
        let path = backend_path(&"/platform/apps".to_string());
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// List app categories
    pub async fn apps_categories_list(&self) -> Result<AppsCategoriesListResult, SdkworkError> {
        let path = backend_path(&"/platform/apps/categories".to_string());
        self.client.get(&path, None, None).await
    }

    /// Create app category
    pub async fn apps_categories_create(&self, body: &AdminAppCategoryCreateRequest) -> Result<AppsCategoriesCreateResult, SdkworkError> {
        let path = backend_path(&"/platform/apps/categories".to_string());
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Delete app category
    pub async fn apps_categories_delete(&self, category_id: &str) -> Result<AppsCategoriesDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/platform/apps/categories/{}", serialize_path_parameter(category_id, PathParameterSpec::new("categoryId", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// Update app category
    pub async fn apps_categories_update(&self, category_id: &str, body: &AdminAppCategoryUpdateRequest) -> Result<AppsCategoriesUpdateResult, SdkworkError> {
        let path = backend_path(&format!("/platform/apps/categories/{}", serialize_path_parameter(category_id, PathParameterSpec::new("categoryId", "simple", false))));
        self.client.put(&path, Some(body), None, None, Some("application/json")).await
    }

    /// List app templates
    pub async fn apps_templates_list(&self, q: Option<&str>, publish_status: Option<&str>, template_type: Option<&str>, runtime: Option<&str>, category_id: Option<&str>, page: Option<&str>, page_size: Option<&str>) -> Result<AppsTemplatesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("q", q, "form", true, false, None),
            QueryParameterSpec::new("publish_status", publish_status, "form", true, false, None),
            QueryParameterSpec::new("template_type", template_type, "form", true, false, None),
            QueryParameterSpec::new("runtime", runtime, "form", true, false, None),
            QueryParameterSpec::new("category_id", category_id, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/platform/apps/templates".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Create app template
    pub async fn apps_templates_create(&self, body: &AdminAppTemplateCreateRequest) -> Result<AppsTemplatesCreateResult, SdkworkError> {
        let path = backend_path(&"/platform/apps/templates".to_string());
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Delete app template
    pub async fn apps_templates_delete(&self, template_id: &str) -> Result<AppsTemplatesDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/platform/apps/templates/{}", serialize_path_parameter(template_id, PathParameterSpec::new("templateId", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// List app template
    pub async fn apps_templates_retrieve(&self, template_id: &str) -> Result<AppsTemplatesRetrieveResult, SdkworkError> {
        let path = backend_path(&format!("/platform/apps/templates/{}", serialize_path_parameter(template_id, PathParameterSpec::new("templateId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Update app template
    pub async fn apps_templates_update(&self, template_id: &str, body: &AdminAppTemplateUpdateRequest) -> Result<AppsTemplatesUpdateResult, SdkworkError> {
        let path = backend_path(&format!("/platform/apps/templates/{}", serialize_path_parameter(template_id, PathParameterSpec::new("templateId", "simple", false))));
        self.client.put(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Publish app template
    pub async fn apps_templates_publish(&self, template_id: &str) -> Result<AppsTemplatesPublishResult, SdkworkError> {
        let path = backend_path(&format!("/platform/apps/templates/{}/publish", serialize_path_parameter(template_id, PathParameterSpec::new("templateId", "simple", false))));
        self.client.post(&path, Option::<&serde_json::Value>::None, None, None, None).await
    }

    /// Offline app template
    pub async fn apps_templates_unpublish(&self, template_id: &str) -> Result<AppsTemplatesUnpublishResult, SdkworkError> {
        let path = backend_path(&format!("/platform/apps/templates/{}/unpublish", serialize_path_parameter(template_id, PathParameterSpec::new("templateId", "simple", false))));
        self.client.post(&path, Option::<&serde_json::Value>::None, None, None, None).await
    }

    /// Delete app
    pub async fn apps_delete(&self, app_id: &str) -> Result<AppsDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/platform/apps/{}", serialize_path_parameter(app_id, PathParameterSpec::new("appId", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// List app
    pub async fn apps_retrieve(&self, app_id: &str) -> Result<AppsRetrieveResult, SdkworkError> {
        let path = backend_path(&format!("/platform/apps/{}", serialize_path_parameter(app_id, PathParameterSpec::new("appId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Update app
    pub async fn apps_update(&self, app_id: &str, body: &AdminAppUpdateRequest) -> Result<AppsUpdateResult, SdkworkError> {
        let path = backend_path(&format!("/platform/apps/{}", serialize_path_parameter(app_id, PathParameterSpec::new("appId", "simple", false))));
        self.client.put(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Disable app
    pub async fn apps_disable(&self, app_id: &str) -> Result<AppsDisableResult, SdkworkError> {
        let path = backend_path(&format!("/platform/apps/{}/disable", serialize_path_parameter(app_id, PathParameterSpec::new("appId", "simple", false))));
        self.client.post(&path, Option::<&serde_json::Value>::None, None, None, None).await
    }

    /// Enable app
    pub async fn apps_enable(&self, app_id: &str) -> Result<AppsEnableResult, SdkworkError> {
        let path = backend_path(&format!("/platform/apps/{}/enable", serialize_path_parameter(app_id, PathParameterSpec::new("appId", "simple", false))));
        self.client.post(&path, Option::<&serde_json::Value>::None, None, None, None).await
    }

    /// Publish app
    pub async fn apps_publish(&self, app_id: &str) -> Result<AppsPublishResult, SdkworkError> {
        let path = backend_path(&format!("/platform/apps/{}/publish", serialize_path_parameter(app_id, PathParameterSpec::new("appId", "simple", false))));
        self.client.post(&path, Option::<&serde_json::Value>::None, None, None, None).await
    }

    /// Offline app
    pub async fn apps_unpublish(&self, app_id: &str) -> Result<AppsUnpublishResult, SdkworkError> {
        let path = backend_path(&format!("/platform/apps/{}/unpublish", serialize_path_parameter(app_id, PathParameterSpec::new("appId", "simple", false))));
        self.client.post(&path, Option::<&serde_json::Value>::None, None, None, None).await
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
