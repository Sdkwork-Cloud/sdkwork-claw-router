use std::time::Duration;

use axum::extract::DefaultBodyLimit;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::routing::post;
use axum::{Json, Router};
use base64::engine::general_purpose::STANDARD as BASE64_STANDARD;
use base64::Engine as _;
use sdkwork_claw_config::runtime::{config_secret_value, env_optional};
use sdkwork_sdk_generator::{
    GenerateFromFileRequest, GeneratedPackage, GeneratedPackageFormat, SdkGeneratorClient,
    SdkLanguage, SdkType,
};
use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};

use crate::api::response::PlusApiResult;

const ENV_SDK_GENERATOR_BASE_URL: &str = "SDKWORK_CLAW_SDK_GENERATOR_BASE_URL";
const ENV_SDK_GENERATOR_API_KEY: &str = "SDKWORK_CLAW_SDK_GENERATOR_API_KEY";
const ENV_SDK_GENERATOR_API_KEY_FILE: &str = "SDKWORK_CLAW_SDK_GENERATOR_API_KEY_FILE";
const LEGACY_ENV_SDK_GENERATOR_BASE_URL: &str = "PORTAL_TOOL_API_SDK_GENERATOR_BASE_URL";
const LEGACY_ENV_SDK_GENERATOR_API_KEY: &str = "PORTAL_TOOL_API_SDK_GENERATOR_API_KEY";
const LEGACY_ENV_SDK_GENERATOR_API_KEY_FILE: &str = "PORTAL_TOOL_API_SDK_GENERATOR_API_KEY_FILE";
const DEFAULT_SDK_NAME: &str = "SdkworkClient";
const DEFAULT_SDK_VERSION: &str = "0.1.0";
const DEFAULT_SDK_BASE_URL: &str = "https://api.sdkwork.com";
const DEFAULT_PACKAGE_NAME: &str = "@sdkwork/sdk";
const DEFAULT_DESCRIPTION: &str = "Generated SDK";
const DEFAULT_JSON_BODY_MAX_BYTES: usize =
    sdkwork_claw_config::RequestLimitsConfig::DEFAULT_SDK_REFERENCE_JSON_BODY_MAX_BYTES;
const MAX_SAFE_TEXT_LEN: usize = 2048;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SdkReferenceGenerationRequest {
    spec: Value,
    language: String,
    config: Option<SdkReferenceGenerationConfig>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SdkReferenceGenerationConfig {
    name: Option<String>,
    version: Option<String>,
    language: Option<String>,
    sdk_type: Option<String>,
    output_path: Option<String>,
    api_spec_path: Option<String>,
    base_url: Option<String>,
    api_prefix: Option<String>,
    package_name: Option<String>,
    author: Option<String>,
    license: Option<String>,
    description: Option<String>,
}

#[derive(Debug)]
struct NormalizedSdkReferenceRequest {
    spec: Value,
    spec_title: String,
    language: String,
    generator_language: SdkLanguage,
    name: String,
    version: String,
    sdk_type: Option<SdkType>,
    api_spec_path: Option<String>,
    base_url: String,
    api_prefix: Option<String>,
    package_name: Option<String>,
    author: Option<String>,
    license: Option<String>,
    description: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct SdkReferenceDocumentationResponse {
    readme: String,
    method_definition: Option<String>,
    usage_example: Option<String>,
    language: String,
    generated: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct SdkReferenceArchiveResponse {
    file_name: String,
    content_type: String,
    content_base64: String,
    language: String,
}

struct SdkGeneratorRuntime {
    client: SdkGeneratorClient,
}

pub fn app_sdk_reference_router() -> Router {
    app_sdk_reference_router_with_json_body_limit(DEFAULT_JSON_BODY_MAX_BYTES)
}

pub fn app_sdk_reference_router_with_json_body_limit(json_body_max_bytes: usize) -> Router {
    Router::new()
        .route(
            "/app/v3/api/sdk_reference/documentation",
            post(generate_documentation),
        )
        .route("/app/v3/api/sdk_reference/archives", post(generate_archive))
        .layer(DefaultBodyLimit::max(json_body_max_bytes.max(1)))
}

async fn generate_documentation(Json(payload): Json<SdkReferenceGenerationRequest>) -> Response {
    let request = match normalize_generation_request(payload) {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let runtime = match sdk_generator_runtime() {
        Ok(runtime) => runtime,
        Err(SdkReferenceConfigError::Unavailable) => return generator_unavailable(),
        Err(SdkReferenceConfigError::Invalid(message)) => {
            return bad_gateway(format!("SDK generator configuration is invalid: {message}"))
        }
    };

    let package = match generate_sdk_package(&runtime, &request).await {
        Ok(package) => package,
        Err(message) => return bad_gateway(message),
    };
    let readme = extract_readme_from_zip(package.bytes.as_ref())
        .unwrap_or_else(|| build_sdk_readme(&request));
    let response = SdkReferenceDocumentationResponse {
        method_definition: Some(extract_first_code_block(&readme).unwrap_or_default())
            .filter(|value| !value.trim().is_empty()),
        usage_example: extract_usage_examples(&readme),
        readme,
        language: request.language,
        generated: true,
    };
    Json(PlusApiResult::success(response)).into_response()
}

async fn generate_archive(Json(payload): Json<SdkReferenceGenerationRequest>) -> Response {
    let request = match normalize_generation_request(payload) {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let runtime = match sdk_generator_runtime() {
        Ok(runtime) => runtime,
        Err(SdkReferenceConfigError::Unavailable) => return generator_unavailable(),
        Err(SdkReferenceConfigError::Invalid(message)) => {
            return bad_gateway(format!("SDK generator configuration is invalid: {message}"))
        }
    };

    let package = match generate_sdk_package(&runtime, &request).await {
        Ok(package) => package,
        Err(message) => return bad_gateway(message),
    };
    let response = SdkReferenceArchiveResponse {
        file_name: package
            .file_name
            .unwrap_or_else(|| generated_archive_file_name(&request)),
        content_type: package
            .content_type
            .unwrap_or_else(|| "application/zip".to_owned()),
        content_base64: BASE64_STANDARD.encode(package.bytes.as_ref()),
        language: request.language,
    };
    Json(PlusApiResult::success(response)).into_response()
}

async fn generate_sdk_package(
    runtime: &SdkGeneratorRuntime,
    request: &NormalizedSdkReferenceRequest,
) -> Result<GeneratedPackage, String> {
    let spec_bytes = serde_json::to_vec(&request.spec)
        .map_err(|error| format!("spec must be serializable JSON: {error}"))?;
    let mut generate_request = GenerateFromFileRequest::new(
        api_spec_file_name(request),
        spec_bytes,
        request.generator_language,
        request.name.clone(),
    )
    .base_url(request.base_url.clone())
    .version(request.version.clone());

    if let Some(api_prefix) = &request.api_prefix {
        generate_request = generate_request.api_prefix(api_prefix.clone());
    }
    if let Some(sdk_type) = request.sdk_type {
        generate_request = generate_request.sdk_type(sdk_type);
    }
    if let Some(package_name) = &request.package_name {
        generate_request = generate_request.package_name(package_name.clone());
    }
    if let Some(description) = &request.description {
        generate_request = generate_request.description(description.clone());
    }
    if let Some(author) = &request.author {
        generate_request = generate_request.author(author.clone());
    }
    if let Some(license) = &request.license {
        generate_request = generate_request.license(license.clone());
    }

    runtime
        .client
        .generate_from_file_and_download(generate_request, GeneratedPackageFormat::Zip)
        .await
        .map_err(|error| format!("SDK generator request failed: {error}"))
}

fn sdk_generator_runtime() -> Result<SdkGeneratorRuntime, SdkReferenceConfigError> {
    let base_url = env_optional(ENV_SDK_GENERATOR_BASE_URL)
        .or_else(|| env_optional(LEGACY_ENV_SDK_GENERATOR_BASE_URL))
        .ok_or(SdkReferenceConfigError::Unavailable)?;
    let legacy_api_key = env_optional(LEGACY_ENV_SDK_GENERATOR_API_KEY);
    let legacy_api_key_file = env_optional(LEGACY_ENV_SDK_GENERATOR_API_KEY_FILE);
    let api_key = config_secret_value(
        ENV_SDK_GENERATOR_API_KEY,
        ENV_SDK_GENERATOR_API_KEY_FILE,
        legacy_api_key.as_deref(),
        legacy_api_key_file.as_deref(),
    )
    .map_err(SdkReferenceConfigError::Invalid)?;
    let mut builder = SdkGeneratorClient::builder(base_url)
        .poll_interval(Duration::from_millis(200))
        .max_poll_attempts(300);
    if let Some(api_key) = api_key {
        builder = builder.api_key(api_key);
    }
    let client = builder
        .build()
        .map_err(|error| SdkReferenceConfigError::Invalid(error.to_string()))?;
    Ok(SdkGeneratorRuntime { client })
}

fn normalize_generation_request(
    payload: SdkReferenceGenerationRequest,
) -> Result<NormalizedSdkReferenceRequest, String> {
    let spec = require_json_object(&payload.spec, "spec")?;
    let info = require_json_object(
        spec.get("info")
            .ok_or_else(|| "spec.info must be a JSON object".to_owned())?,
        "spec.info",
    )?;
    let spec_title =
        require_non_empty_string(info.get("title"), "spec.info.title", MAX_SAFE_TEXT_LEN)?;
    require_non_empty_string(info.get("version"), "spec.info.version", 128)?;
    require_json_object(
        spec.get("paths")
            .ok_or_else(|| "spec.paths must be a JSON object".to_owned())?,
        "spec.paths",
    )?;

    let language = normalize_token(&payload.language, "language")?;
    let generator_language = sdk_generator_language(&language)?;
    let config = payload.config;
    if let Some(config_language) = config
        .as_ref()
        .and_then(|value| value.language.as_deref())
        .map(|value| normalize_token(value, "config.language"))
        .transpose()?
    {
        if config_language != language {
            return Err("config.language must match language".to_owned());
        }
    }
    let name = optional_safe_text(
        config.as_ref().and_then(|value| value.name.as_deref()),
        "config.name",
        128,
    )?
    .unwrap_or_else(|| DEFAULT_SDK_NAME.to_owned());
    let version = optional_safe_text(
        config.as_ref().and_then(|value| value.version.as_deref()),
        "config.version",
        64,
    )?
    .unwrap_or_else(|| DEFAULT_SDK_VERSION.to_owned());
    let sdk_type = config
        .as_ref()
        .and_then(|value| value.sdk_type.as_deref())
        .map(|value| sdk_generator_type(&normalize_token(value, "config.sdkType")?))
        .transpose()?;
    let base_url = config
        .as_ref()
        .and_then(|value| value.base_url.as_deref())
        .map(|value| normalize_base_url(value, "config.baseUrl"))
        .transpose()?
        .unwrap_or_else(|| DEFAULT_SDK_BASE_URL.to_owned());
    let api_prefix = config
        .as_ref()
        .and_then(|value| value.api_prefix.as_deref())
        .map(|value| normalize_api_path(value, "config.apiPrefix"))
        .transpose()?;
    let api_spec_path = optional_safe_text(
        config
            .as_ref()
            .and_then(|value| value.api_spec_path.as_deref()),
        "config.apiSpecPath",
        512,
    )?;
    let package_name = optional_safe_text(
        config
            .as_ref()
            .and_then(|value| value.package_name.as_deref()),
        "config.packageName",
        256,
    )?
    .or_else(|| Some(DEFAULT_PACKAGE_NAME.to_owned()));
    let author = optional_safe_text(
        config.as_ref().and_then(|value| value.author.as_deref()),
        "config.author",
        128,
    )?;
    let license = optional_safe_text(
        config.as_ref().and_then(|value| value.license.as_deref()),
        "config.license",
        64,
    )?;
    let description = optional_safe_text(
        config
            .as_ref()
            .and_then(|value| value.description.as_deref()),
        "config.description",
        512,
    )?
    .or_else(|| Some(DEFAULT_DESCRIPTION.to_owned()));
    let _ = optional_safe_text(
        config
            .as_ref()
            .and_then(|value| value.output_path.as_deref()),
        "config.outputPath",
        512,
    )?;

    Ok(NormalizedSdkReferenceRequest {
        spec: payload.spec,
        spec_title,
        language,
        generator_language,
        name,
        version,
        sdk_type,
        api_spec_path,
        base_url,
        api_prefix,
        package_name,
        author,
        license,
        description,
    })
}

fn require_json_object<'a>(
    value: &'a Value,
    field: &str,
) -> Result<&'a Map<String, Value>, String> {
    value
        .as_object()
        .ok_or_else(|| format!("{field} must be a JSON object"))
}

fn require_non_empty_string(
    value: Option<&Value>,
    field: &str,
    max_len: usize,
) -> Result<String, String> {
    let value = value
        .and_then(Value::as_str)
        .ok_or_else(|| format!("{field} must be a non-empty string"))?
        .trim();
    if value.is_empty()
        || value.chars().count() > max_len
        || value.chars().any(|character| character.is_control())
    {
        return Err(format!(
            "{field} must be a non-empty string with at most {max_len} characters"
        ));
    }
    Ok(value.to_owned())
}

fn optional_safe_text(
    value: Option<&str>,
    field: &str,
    max_len: usize,
) -> Result<Option<String>, String> {
    let Some(value) = value else {
        return Ok(None);
    };
    let value = value.trim();
    if value.is_empty() {
        return Ok(None);
    }
    if value.chars().count() > max_len || value.chars().any(|character| character.is_control()) {
        return Err(format!(
            "{field} must not contain control characters and must be at most {max_len} characters"
        ));
    }
    Ok(Some(value.to_owned()))
}

fn normalize_token(value: &str, field: &str) -> Result<String, String> {
    let value = value.trim().to_ascii_lowercase();
    if value.is_empty()
        || value.len() > 64
        || !value.chars().all(|character| {
            character.is_ascii_alphanumeric() || matches!(character, '.' | '_' | '-' | '/')
        })
    {
        return Err(format!("{field} must be 1-64 ASCII token characters"));
    }
    Ok(value)
}

fn normalize_api_path(value: &str, field: &str) -> Result<String, String> {
    let value = value.trim();
    if !value.starts_with('/')
        || value.starts_with("//")
        || value.contains(['\r', '\n', '\\'])
        || value.contains('?')
        || value.contains('#')
    {
        return Err(format!(
            "{field} must start with / and must not contain query strings or control characters"
        ));
    }
    Ok(value.trim_end_matches('/').to_owned())
}

fn normalize_base_url(value: &str, field: &str) -> Result<String, String> {
    let value = value.trim();
    if value.starts_with('/') {
        return normalize_api_path(value, field);
    }
    let parsed = value
        .parse::<axum::http::Uri>()
        .map_err(|_| format!("{field} must be an HTTP or HTTPS URL or root-relative path"))?;
    if !matches!(parsed.scheme_str(), Some("http" | "https"))
        || parsed.authority().is_none()
        || parsed.query().is_some()
        || value.contains('#')
    {
        return Err(format!(
            "{field} must be an HTTP or HTTPS URL or root-relative path without query strings"
        ));
    }
    Ok(value.trim_end_matches('/').to_owned())
}

fn sdk_generator_language(language: &str) -> Result<SdkLanguage, String> {
    match language {
        "typescript" | "javascript" => Ok(SdkLanguage::TypeScript),
        "dart" => Ok(SdkLanguage::Dart),
        "python" => Ok(SdkLanguage::Python),
        "go" => Ok(SdkLanguage::Go),
        "java" => Ok(SdkLanguage::Java),
        "kotlin" => Ok(SdkLanguage::Kotlin),
        "swift" => Ok(SdkLanguage::Swift),
        "csharp" => Ok(SdkLanguage::CSharp),
        "flutter" => Ok(SdkLanguage::Flutter),
        "rust" => Ok(SdkLanguage::Rust),
        "php" => Ok(SdkLanguage::Php),
        "ruby" => Ok(SdkLanguage::Ruby),
        _ => Err(format!(
            "language {language} is not supported for SDK generation"
        )),
    }
}

fn sdk_generator_type(sdk_type: &str) -> Result<SdkType, String> {
    match sdk_type {
        "app" => Ok(SdkType::App),
        "backend" => Ok(SdkType::Backend),
        "ai" => Ok(SdkType::Ai),
        "custom" => Ok(SdkType::Custom),
        _ => Err(format!("config.sdkType {sdk_type} is not supported")),
    }
}

fn api_spec_file_name(request: &NormalizedSdkReferenceRequest) -> String {
    request
        .api_spec_path
        .as_deref()
        .and_then(|path| path.rsplit('/').next())
        .filter(|file_name| {
            !file_name.is_empty()
                && file_name.contains('.')
                && !file_name.contains(['\\', '\r', '\n'])
        })
        .unwrap_or("openapi.json")
        .to_owned()
}

fn generated_archive_file_name(request: &NormalizedSdkReferenceRequest) -> String {
    let identity = request
        .package_name
        .as_deref()
        .unwrap_or(&request.name)
        .trim_start_matches('@');
    let package = safe_archive_slug(identity).unwrap_or_else(|| "sdk".to_owned());
    let language = safe_archive_slug(&request.language).unwrap_or_else(|| "typescript".to_owned());
    let version = safe_archive_slug(&request.version).unwrap_or_else(|| "0.1.0".to_owned());
    format!("{package}-{language}-{version}.zip")
}

fn safe_archive_slug(value: &str) -> Option<String> {
    let slug = value
        .chars()
        .map(|character| {
            if character.is_ascii_alphanumeric() {
                character.to_ascii_lowercase()
            } else if matches!(character, '-' | '_' | '/' | '.') {
                '-'
            } else {
                '-'
            }
        })
        .collect::<String>()
        .split('-')
        .filter(|part| !part.is_empty())
        .collect::<Vec<_>>()
        .join("-");
    (!slug.is_empty()).then_some(slug)
}

fn build_sdk_readme(request: &NormalizedSdkReferenceRequest) -> String {
    let package_name = request
        .package_name
        .as_deref()
        .unwrap_or(DEFAULT_PACKAGE_NAME);
    let description = request
        .description
        .as_deref()
        .unwrap_or(DEFAULT_DESCRIPTION);
    format!(
        "# {name}\n\n{description}\n\n## Package\n\n`{package_name}`\n\n## Version\n\n`{version}`\n\n## API\n\n{spec_title}\n\n## Base URL\n\n`{base_url}`\n\n## Installation\n\n```shell\n{install_command}\n```\n\n## Quick Start\n\n```{fence_language}\n{quick_start}\n```\n\n## Usage Examples\n\n```{fence_language}\n{usage_example}\n```\n",
        name = request.name,
        description = description,
        package_name = package_name,
        version = request.version,
        spec_title = request.spec_title,
        base_url = request.base_url,
        install_command = install_command(&request.language, package_name),
        fence_language = code_fence_language(&request.language),
        quick_start = quick_start_snippet(request, package_name),
        usage_example = usage_example_snippet(request),
    )
}

fn install_command(language: &str, package_name: &str) -> String {
    match language {
        "typescript" | "javascript" => format!("npm install {package_name}"),
        "python" => format!("pip install {package_name}"),
        "go" => format!("go get {package_name}"),
        "java" => format!("// Add {package_name} to your Maven or Gradle dependencies"),
        "ruby" => format!("gem install {package_name}"),
        "php" => format!("composer require {package_name}"),
        "csharp" => format!("dotnet add package {package_name}"),
        "rust" => format!("cargo add {package_name}"),
        "dart" | "flutter" => format!("dart pub add {package_name}"),
        _ => format!("Install {package_name} with the package manager for {language}"),
    }
}

fn quick_start_snippet(request: &NormalizedSdkReferenceRequest, package_name: &str) -> String {
    match request.language.as_str() {
        "typescript" | "javascript" => format!(
            "import {{ {name} }} from \"{package_name}\";\n\nconst client = new {name}({{\n  baseUrl: \"{base_url}\",\n  apiKey: process.env.CLAWROUTER_API_KEY,\n}});",
            name = request.name,
            base_url = request.base_url,
        ),
        "python" => format!(
            "from {module_name} import {name}\n\nclient = {name}(\n    base_url=\"{base_url}\",\n    api_key=\"YOUR_API_KEY\",\n)",
            module_name = package_name.replace('-', "_"),
            name = request.name,
            base_url = request.base_url,
        ),
        _ => format!(
            "Initialize {name} with base URL {base_url} and your CLAWROUTER_API_KEY.",
            name = request.name,
            base_url = request.base_url,
        ),
    }
}

fn usage_example_snippet(request: &NormalizedSdkReferenceRequest) -> String {
    match request.language.as_str() {
        "typescript" | "javascript" => {
            "const models = await client.ai.models.list();\nconsole.log(models);".to_owned()
        }
        "python" => "models = client.ai.models.list()\nprint(models)".to_owned(),
        _ => "Call the generated client methods that match the OpenAPI operation names.".to_owned(),
    }
}

fn code_fence_language(language: &str) -> &str {
    match language {
        "typescript" => "typescript",
        "javascript" => "javascript",
        "python" => "python",
        "go" => "go",
        "java" => "java",
        "ruby" => "ruby",
        "php" => "php",
        "csharp" => "csharp",
        "rust" => "rust",
        "dart" | "flutter" => "dart",
        _ => "text",
    }
}

fn extract_usage_examples(readme: &str) -> Option<String> {
    let section = section_after_heading(readme, "## Usage Examples")?;
    let blocks = code_blocks(section);
    (!blocks.is_empty()).then(|| blocks.join("\n\n"))
}

fn extract_first_code_block(readme: &str) -> Option<String> {
    code_blocks(readme).into_iter().next()
}

fn section_after_heading<'a>(readme: &'a str, heading: &str) -> Option<&'a str> {
    let start = readme.find(heading)?;
    let section = &readme[start + heading.len()..];
    let end = section.find("\n## ").unwrap_or(section.len());
    Some(&section[..end])
}

fn code_blocks(text: &str) -> Vec<String> {
    let mut blocks = Vec::new();
    let mut rest = text;
    while let Some(start) = rest.find("```") {
        let after_fence = &rest[start + 3..];
        let content_start = after_fence.find('\n').map(|index| index + 1).unwrap_or(0);
        let after_language = &after_fence[content_start..];
        let Some(end) = after_language.find("```") else {
            break;
        };
        let block = after_language[..end].trim();
        if !block.is_empty() {
            blocks.push(block.to_owned());
        }
        rest = &after_language[end + 3..];
    }
    blocks
}

fn extract_readme_from_zip(bytes: &[u8]) -> Option<String> {
    let mut index = 0usize;
    while index + 30 <= bytes.len() {
        if bytes.get(index..index + 4) != Some(&[0x50, 0x4b, 0x03, 0x04]) {
            index += 1;
            continue;
        }
        let compression = read_u16_le(bytes, index + 8)?;
        let compressed_size = read_u32_le(bytes, index + 18)? as usize;
        let uncompressed_size = read_u32_le(bytes, index + 22)? as usize;
        let file_name_len = read_u16_le(bytes, index + 26)? as usize;
        let extra_len = read_u16_le(bytes, index + 28)? as usize;
        let name_start = index + 30;
        let data_start = name_start
            .checked_add(file_name_len)?
            .checked_add(extra_len)?;
        let data_end = data_start.checked_add(compressed_size)?;
        if data_end > bytes.len() {
            return None;
        }
        let file_name =
            std::str::from_utf8(bytes.get(name_start..name_start + file_name_len)?).ok()?;
        if file_name
            .rsplit('/')
            .next()
            .is_some_and(|name| name.eq_ignore_ascii_case("README.md"))
            && compression == 0
            && uncompressed_size == compressed_size
        {
            return String::from_utf8(bytes[data_start..data_end].to_vec()).ok();
        }
        index = data_end;
    }
    None
}

fn read_u16_le(bytes: &[u8], index: usize) -> Option<u16> {
    Some(u16::from_le_bytes(
        bytes.get(index..index + 2)?.try_into().ok()?,
    ))
}

fn read_u32_le(bytes: &[u8], index: usize) -> Option<u32> {
    Some(u32::from_le_bytes(
        bytes.get(index..index + 4)?.try_into().ok()?,
    ))
}

fn bad_request(message: impl Into<String>) -> Response {
    (
        StatusCode::BAD_REQUEST,
        Json(PlusApiResult::error("4001", message.into())),
    )
        .into_response()
}

fn generator_unavailable() -> Response {
    (
        StatusCode::SERVICE_UNAVAILABLE,
        Json(PlusApiResult::error(
            "5030",
            "SDK generator is not configured",
        )),
    )
        .into_response()
}

fn bad_gateway(message: impl Into<String>) -> Response {
    (
        StatusCode::BAD_GATEWAY,
        Json(PlusApiResult::error("5020", message.into())),
    )
        .into_response()
}

enum SdkReferenceConfigError {
    Unavailable,
    Invalid(String),
}
