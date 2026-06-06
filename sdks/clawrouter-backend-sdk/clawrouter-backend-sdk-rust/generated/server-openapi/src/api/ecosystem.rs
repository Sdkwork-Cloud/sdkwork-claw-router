use std::sync::Arc;

use crate::api::paths::backend_path;
use crate::api::paths::append_query_string;
use crate::http::{SdkworkError, SdkworkHttpClient};
use crate::models::{AdminSkillArtifactCreateRequest, AdminSkillArtifactUpdateRequest, AdminSkillAssetCreateRequest, AdminSkillAssetUpdateRequest, AdminSkillCategoryCreateRequest, AdminSkillCategoryUpdateRequest, AdminSkillCreateRequest, AdminSkillPackageCreateRequest, AdminSkillPackageUpdateRequest, AdminSkillReviewRequest, AdminSkillUpdateRequest, SkillsArtifactsCreateResult, SkillsArtifactsDeleteResult, SkillsArtifactsListResult, SkillsArtifactsRetrieveResult, SkillsArtifactsUpdateResult, SkillsAssetsCreateResult, SkillsAssetsDeleteResult, SkillsAssetsListResult, SkillsAssetsRetrieveResult, SkillsAssetsUpdateResult, SkillsCategoriesCreateResult, SkillsCategoriesDeleteResult, SkillsCategoriesListResult, SkillsCategoriesUpdateResult, SkillsCreateResult, SkillsDeleteResult, SkillsDisableResult, SkillsEnableResult, SkillsListResult, SkillsPackageCreateResult, SkillsPackageDeleteResult, SkillsPackageDisableResult, SkillsPackageEnableResult, SkillsPackageListResult, SkillsPackageRetrieveResult, SkillsPackageUpdateResult, SkillsPublishResult, SkillsRetrieveResult, SkillsReviewApproveResult, SkillsReviewRejectResult, SkillsUnpublishResult, SkillsUpdateResult};

#[derive(Clone)]
pub struct EcosystemApi {
    client: Arc<SdkworkHttpClient>,
}

impl EcosystemApi {
    pub fn new(client: Arc<SdkworkHttpClient>) -> Self {
        Self { client }
    }

    /// List skills
    pub async fn skills_list(&self, q: Option<&str>, market_status: Option<&str>, review_status: Option<&str>, visibility: Option<&str>, enabled: Option<bool>, category_id: Option<&str>, page: Option<&str>, page_size: Option<&str>) -> Result<SkillsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("q", q, "form", true, false, None),
            QueryParameterSpec::new("market_status", market_status, "form", true, false, None),
            QueryParameterSpec::new("review_status", review_status, "form", true, false, None),
            QueryParameterSpec::new("visibility", visibility, "form", true, false, None),
            QueryParameterSpec::new("enabled", enabled, "form", true, false, None),
            QueryParameterSpec::new("category_id", category_id, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/ecosystem/skills".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Create skill
    pub async fn skills_create(&self, body: &AdminSkillCreateRequest) -> Result<SkillsCreateResult, SdkworkError> {
        let path = backend_path(&"/ecosystem/skills".to_string());
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// List skill categories
    pub async fn skills_categories_list(&self) -> Result<SkillsCategoriesListResult, SdkworkError> {
        let path = backend_path(&"/ecosystem/skills/categories".to_string());
        self.client.get(&path, None, None).await
    }

    /// Create skill category
    pub async fn skills_categories_create(&self, body: &AdminSkillCategoryCreateRequest) -> Result<SkillsCategoriesCreateResult, SdkworkError> {
        let path = backend_path(&"/ecosystem/skills/categories".to_string());
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Delete skill category
    pub async fn skills_categories_delete(&self, category_id: &str) -> Result<SkillsCategoriesDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/categories/{}", serialize_path_parameter(category_id, PathParameterSpec::new("categoryId", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// Update skill category
    pub async fn skills_categories_update(&self, category_id: &str, body: &AdminSkillCategoryUpdateRequest) -> Result<SkillsCategoriesUpdateResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/categories/{}", serialize_path_parameter(category_id, PathParameterSpec::new("categoryId", "simple", false))));
        self.client.put(&path, Some(body), None, None, Some("application/json")).await
    }

    /// List skill packages
    pub async fn skills_package_list(&self, q: Option<&str>, enabled: Option<bool>, category_id: Option<&str>, page: Option<&str>, page_size: Option<&str>) -> Result<SkillsPackageListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("q", q, "form", true, false, None),
            QueryParameterSpec::new("enabled", enabled, "form", true, false, None),
            QueryParameterSpec::new("category_id", category_id, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/ecosystem/skills/package".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Create skill package
    pub async fn skills_package_create(&self, body: &AdminSkillPackageCreateRequest) -> Result<SkillsPackageCreateResult, SdkworkError> {
        let path = backend_path(&"/ecosystem/skills/package".to_string());
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Delete skill package
    pub async fn skills_package_delete(&self, package_id: &str) -> Result<SkillsPackageDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/package/{}", serialize_path_parameter(package_id, PathParameterSpec::new("packageId", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// Get skill package
    pub async fn skills_package_retrieve(&self, package_id: &str) -> Result<SkillsPackageRetrieveResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/package/{}", serialize_path_parameter(package_id, PathParameterSpec::new("packageId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Update skill package
    pub async fn skills_package_update(&self, package_id: &str, body: &AdminSkillPackageUpdateRequest) -> Result<SkillsPackageUpdateResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/package/{}", serialize_path_parameter(package_id, PathParameterSpec::new("packageId", "simple", false))));
        self.client.put(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Disable skill package
    pub async fn skills_package_disable(&self, package_id: &str) -> Result<SkillsPackageDisableResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/package/{}/disable", serialize_path_parameter(package_id, PathParameterSpec::new("packageId", "simple", false))));
        self.client.post(&path, Option::<&serde_json::Value>::None, None, None, None).await
    }

    /// Enable skill package
    pub async fn skills_package_enable(&self, package_id: &str) -> Result<SkillsPackageEnableResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/package/{}/enable", serialize_path_parameter(package_id, PathParameterSpec::new("packageId", "simple", false))));
        self.client.post(&path, Option::<&serde_json::Value>::None, None, None, None).await
    }

    /// Delete skill
    pub async fn skills_delete(&self, skill_id: &str) -> Result<SkillsDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/{}", serialize_path_parameter(skill_id, PathParameterSpec::new("skillId", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// Get skill
    pub async fn skills_retrieve(&self, skill_id: &str) -> Result<SkillsRetrieveResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/{}", serialize_path_parameter(skill_id, PathParameterSpec::new("skillId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Update skill
    pub async fn skills_update(&self, skill_id: &str, body: &AdminSkillUpdateRequest) -> Result<SkillsUpdateResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/{}", serialize_path_parameter(skill_id, PathParameterSpec::new("skillId", "simple", false))));
        self.client.put(&path, Some(body), None, None, Some("application/json")).await
    }

    /// List skill artifacts
    pub async fn skills_artifacts_list(&self, skill_id: &str) -> Result<SkillsArtifactsListResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/{}/artifacts", serialize_path_parameter(skill_id, PathParameterSpec::new("skillId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Create skill artifact
    pub async fn skills_artifacts_create(&self, skill_id: &str, body: &AdminSkillArtifactCreateRequest) -> Result<SkillsArtifactsCreateResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/{}/artifacts", serialize_path_parameter(skill_id, PathParameterSpec::new("skillId", "simple", false))));
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Delete skill artifact
    pub async fn skills_artifacts_delete(&self, skill_id: &str, artifact_id: &str) -> Result<SkillsArtifactsDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/{}/artifacts/{}", serialize_path_parameter(skill_id, PathParameterSpec::new("skillId", "simple", false)), serialize_path_parameter(artifact_id, PathParameterSpec::new("artifactId", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// Get skill artifact
    pub async fn skills_artifacts_retrieve(&self, skill_id: &str, artifact_id: &str) -> Result<SkillsArtifactsRetrieveResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/{}/artifacts/{}", serialize_path_parameter(skill_id, PathParameterSpec::new("skillId", "simple", false)), serialize_path_parameter(artifact_id, PathParameterSpec::new("artifactId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Update skill artifact
    pub async fn skills_artifacts_update(&self, skill_id: &str, artifact_id: &str, body: &AdminSkillArtifactUpdateRequest) -> Result<SkillsArtifactsUpdateResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/{}/artifacts/{}", serialize_path_parameter(skill_id, PathParameterSpec::new("skillId", "simple", false)), serialize_path_parameter(artifact_id, PathParameterSpec::new("artifactId", "simple", false))));
        self.client.put(&path, Some(body), None, None, Some("application/json")).await
    }

    /// List skill assets
    pub async fn skills_assets_list(&self, skill_id: &str) -> Result<SkillsAssetsListResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/{}/assets", serialize_path_parameter(skill_id, PathParameterSpec::new("skillId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Create skill asset
    pub async fn skills_assets_create(&self, skill_id: &str, body: &AdminSkillAssetCreateRequest) -> Result<SkillsAssetsCreateResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/{}/assets", serialize_path_parameter(skill_id, PathParameterSpec::new("skillId", "simple", false))));
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Delete skill asset
    pub async fn skills_assets_delete(&self, skill_id: &str, asset_id: &str) -> Result<SkillsAssetsDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/{}/assets/{}", serialize_path_parameter(skill_id, PathParameterSpec::new("skillId", "simple", false)), serialize_path_parameter(asset_id, PathParameterSpec::new("assetId", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// Get skill asset
    pub async fn skills_assets_retrieve(&self, skill_id: &str, asset_id: &str) -> Result<SkillsAssetsRetrieveResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/{}/assets/{}", serialize_path_parameter(skill_id, PathParameterSpec::new("skillId", "simple", false)), serialize_path_parameter(asset_id, PathParameterSpec::new("assetId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Update skill asset
    pub async fn skills_assets_update(&self, skill_id: &str, asset_id: &str, body: &AdminSkillAssetUpdateRequest) -> Result<SkillsAssetsUpdateResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/{}/assets/{}", serialize_path_parameter(skill_id, PathParameterSpec::new("skillId", "simple", false)), serialize_path_parameter(asset_id, PathParameterSpec::new("assetId", "simple", false))));
        self.client.put(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Disable skill
    pub async fn skills_disable(&self, skill_id: &str) -> Result<SkillsDisableResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/{}/disable", serialize_path_parameter(skill_id, PathParameterSpec::new("skillId", "simple", false))));
        self.client.post(&path, Option::<&serde_json::Value>::None, None, None, None).await
    }

    /// Enable skill
    pub async fn skills_enable(&self, skill_id: &str) -> Result<SkillsEnableResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/{}/enable", serialize_path_parameter(skill_id, PathParameterSpec::new("skillId", "simple", false))));
        self.client.post(&path, Option::<&serde_json::Value>::None, None, None, None).await
    }

    /// Publish skill
    pub async fn skills_publish(&self, skill_id: &str) -> Result<SkillsPublishResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/{}/publish", serialize_path_parameter(skill_id, PathParameterSpec::new("skillId", "simple", false))));
        self.client.post(&path, Option::<&serde_json::Value>::None, None, None, None).await
    }

    /// Approve skill
    pub async fn skills_review_approve(&self, skill_id: &str, body: &AdminSkillReviewRequest) -> Result<SkillsReviewApproveResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/{}/review/approve", serialize_path_parameter(skill_id, PathParameterSpec::new("skillId", "simple", false))));
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Reject skill
    pub async fn skills_review_reject(&self, skill_id: &str, body: &AdminSkillReviewRequest) -> Result<SkillsReviewRejectResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/{}/review/reject", serialize_path_parameter(skill_id, PathParameterSpec::new("skillId", "simple", false))));
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Offline skill
    pub async fn skills_unpublish(&self, skill_id: &str) -> Result<SkillsUnpublishResult, SdkworkError> {
        let path = backend_path(&format!("/ecosystem/skills/{}/unpublish", serialize_path_parameter(skill_id, PathParameterSpec::new("skillId", "simple", false))));
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
