use serde_json::Value;

use crate::domain::{DomainError, DomainResult};
use crate::ports::{AppSkillItem, AppSkillPackageItem, AppStoreItem, AppStoreReleaseItem};

pub(crate) const CATALOG_TARGET_TYPE_APP: i64 = 15;
pub(crate) const CATALOG_TARGET_TYPE_SKILL: i64 = 35;
pub(crate) const CATEGORY_TYPE_SKILLS: i64 = 19;
pub(crate) const CATEGORY_TYPE_SKILLS_COLLECTION: i64 = 20;

const DEFAULT_APP_CATEGORY: &str = "General";
const DEFAULT_DEVELOPER: &str = "SDKWork";
const DEFAULT_APP_IMAGE: &str = "https://picsum.photos/seed/claw-app/800/600";
const DEFAULT_SKILL_IMAGE: &str = "https://picsum.photos/seed/skill/800/600";

#[derive(Debug, Clone, Default)]
pub(crate) struct RawAppStoreRecord {
    pub id: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub app_key: String,
    pub name: String,
    pub description: String,
    pub version: String,
    pub icon: String,
    pub icon_url: String,
    pub resource_list: String,
    pub config: String,
    pub app_type: String,
    pub install_skill: String,
    pub install_config: String,
    pub release_notes: String,
    pub access_url: String,
    pub store_url: String,
    pub download_url: String,
    pub rating: f64,
    pub download_count: i64,
}

#[derive(Debug, Clone, Default)]
pub(crate) struct RawCatalogAsset {
    pub asset_type: String,
    pub asset_url: String,
    pub thumbnail_url: String,
}

#[derive(Debug, Clone, Default)]
pub(crate) struct RawCatalogArtifact {
    pub id: String,
    pub platform_type: String,
    pub os_name: String,
    pub version: String,
    pub artifact_ref: String,
    pub artifact_url: String,
    pub artifact_size_bytes: i64,
    pub frameworks: String,
    pub license_name: String,
    pub release_notes: String,
    pub published_at: String,
}

#[derive(Debug, Clone, Default)]
pub(crate) struct RawAppSkillRecord {
    pub id: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub name: String,
    pub provider: String,
    pub description: String,
    pub category_name: String,
    pub icon: String,
    pub cover_image: String,
    pub version: String,
    pub license_name: String,
    pub install_count: i64,
    pub rating_avg: f64,
    pub tags: String,
    pub capabilities: String,
    pub default_config: String,
    pub manifest_url: String,
    pub latest_published_at: String,
    pub updated_at: String,
}

pub(crate) fn build_app_item(
    raw: &RawAppStoreRecord,
    assets: Vec<RawCatalogAsset>,
    artifacts: Vec<RawCatalogArtifact>,
) -> AppStoreItem {
    let config = parse_json(&raw.config);
    let install_config = parse_json(&raw.install_config);
    let install_skill = parse_json(&raw.install_skill);
    let resource_list = parse_json(&raw.resource_list);
    let icon = parse_json(&raw.icon);

    let screenshots = collect_asset_urls(&assets, &["screenshot", "2"])
        .into_iter()
        .chain(json_string_array(resource_list.as_ref(), &["screenshots"]))
        .take(20)
        .collect::<Vec<_>>();

    let releases = build_app_releases(&raw, &artifacts, install_config.as_ref());

    AppStoreItem {
        id: non_empty(
            first_non_empty(&[
                raw.app_key.clone(),
                json_string(config.as_ref(), &["standard", "appKey"]),
            ])
            .unwrap_or_default(),
            &raw.id,
        ),
        name: non_empty(raw.name.clone(), "Untitled App"),
        developer: first_non_empty(&[
            json_string(config.as_ref(), &["portal", "developer"]),
            json_string(config.as_ref(), &["developer"]),
            json_string(install_skill.as_ref(), &["name"]),
        ])
        .unwrap_or_else(|| DEFAULT_DEVELOPER.to_owned()),
        category: app_category(&raw.app_type, config.as_ref(), install_config.as_ref()),
        image: first_non_empty(&[
            raw.icon_url.clone(),
            json_string(icon.as_ref(), &["url"]),
            json_string(icon.as_ref(), &["image"]),
            json_string(icon.as_ref(), &["src"]),
            first_asset_url(&assets, &["cover", "icon", "1"]),
            json_string(resource_list.as_ref(), &["cover"]),
            json_string(resource_list.as_ref(), &["coverUrl"]),
        ])
        .unwrap_or_else(|| DEFAULT_APP_IMAGE.to_owned()),
        rating: round_rating(raw.rating),
        description: normalize_text(&raw.description),
        downloads: format_count(raw.download_count),
        screenshots,
        features: first_non_empty_array(&[
            json_string_array(config.as_ref(), &["portal", "features"]),
            json_string_array(config.as_ref(), &["features"]),
            json_string_array(install_config.as_ref(), &["metadata", "features"]),
            json_string_array(install_config.as_ref(), &["portal", "features"]),
            release_note_highlights(&raw.release_notes),
        ])
        .into_iter()
        .take(64)
        .collect(),
        releases,
    }
}

pub(crate) fn build_skill_item(
    raw: RawAppSkillRecord,
    assets: Vec<RawCatalogAsset>,
    artifacts: Vec<RawCatalogArtifact>,
) -> AppSkillItem {
    let default_config = parse_json(&raw.default_config);
    let first_artifact = artifacts.first();
    let frameworks = first_non_empty_array(&[
        json_string_array(default_config.as_ref(), &["portal", "frameworks"]),
        first_artifact
            .map(|artifact| parse_string_array(&artifact.frameworks))
            .unwrap_or_default(),
        parse_string_array(&raw.tags),
    ]);
    let screenshots = first_non_empty_array(&[
        json_string_array(default_config.as_ref(), &["portal", "screenshots"]),
        collect_asset_urls(&assets, &["screenshot", "2"]),
        vec![raw.cover_image.clone()],
    ])
    .into_iter()
    .filter(|value| !value.is_empty())
    .take(20)
    .collect::<Vec<_>>();
    let artifact_size = first_artifact
        .map(|artifact| artifact.artifact_size_bytes)
        .unwrap_or_default();
    let packages = artifacts
        .iter()
        .take(16)
        .map(|artifact| AppSkillPackageItem {
            id: non_empty(artifact.id.clone(), "0"),
            version: normalize_text(&artifact.version),
            artifact_ref: first_non_empty(&[
                artifact.artifact_ref.clone(),
                artifact.artifact_url.clone(),
            ])
            .unwrap_or_default(),
            artifact_size_bytes: artifact.artifact_size_bytes.max(0),
            frameworks: parse_string_array(&artifact.frameworks),
            license_name: normalize_text(&artifact.license_name),
            published_at: date_only(&artifact.published_at),
        })
        .collect::<Vec<_>>();

    AppSkillItem {
        id: non_empty(raw.id, "0"),
        name: non_empty(raw.name, "Untitled Skill"),
        developer: non_empty(raw.provider, DEFAULT_DEVELOPER),
        description: normalize_text(&raw.description),
        category: non_empty(raw.category_name, "Uncategorized"),
        image: non_empty(
            first_non_empty(&[raw.cover_image, raw.icon]).unwrap_or_default(),
            DEFAULT_SKILL_IMAGE,
        ),
        rating: round_rating(raw.rating_avg),
        downloads: format_count(raw.install_count),
        features: first_non_empty_array(&[
            parse_string_array(&raw.capabilities),
            json_string_array(default_config.as_ref(), &["portal", "features"]),
        ])
        .into_iter()
        .take(64)
        .collect(),
        last_updated: date_only(
            &first_non_empty(&[raw.latest_published_at, raw.updated_at]).unwrap_or_default(),
        ),
        clawhub_image: first_non_empty(&[
            json_string(default_config.as_ref(), &["portal", "clawhubImage"]),
            first_artifact
                .map(|artifact| artifact.artifact_ref.clone())
                .unwrap_or_default(),
            raw.manifest_url,
        ])
        .unwrap_or_default(),
        version: normalize_text(&raw.version),
        size: first_non_empty(&[
            json_string(default_config.as_ref(), &["portal", "sizeText"]),
            format_size(artifact_size),
        ])
        .unwrap_or_default(),
        license: non_empty(raw.license_name, "Proprietary"),
        frameworks: frameworks.into_iter().take(32).collect(),
        screenshots,
        packages,
    }
}

pub(crate) fn query_matches_app(
    item: &AppStoreItem,
    raw: &RawAppStoreRecord,
    keyword: Option<&str>,
) -> bool {
    let Some(keyword) = normalized_keyword(keyword) else {
        return true;
    };
    let haystack = format!(
        "{} {} {} {} {} {} {}",
        raw.app_key,
        raw.id,
        item.name,
        item.description,
        item.developer,
        item.category,
        item.features.join(" ")
    )
    .to_lowercase();
    haystack.contains(&keyword)
}

pub(crate) fn query_matches_app_catalog_filters(
    item: &AppStoreItem,
    raw: &RawAppStoreRecord,
    keyword: Option<&str>,
    category: Option<&str>,
    platform_types: &[String],
) -> bool {
    query_matches_app(item, raw, keyword)
        && app_category_matches(item, category)
        && app_platform_type_matches(item, platform_types)
}

pub(crate) fn sort_app_catalog_entries(
    entries: &mut [(AppStoreItem, RawAppStoreRecord)],
    sort: Option<&str>,
) {
    match sort.unwrap_or("newest_desc") {
        "popular_desc" => entries.sort_by(|(left_item, left_raw), (right_item, right_raw)| {
            right_raw
                .download_count
                .cmp(&left_raw.download_count)
                .then_with(|| compare_newest_release(right_item, left_item))
                .then_with(|| left_item.name.cmp(&right_item.name))
                .then_with(|| left_raw.id.cmp(&right_raw.id))
        }),
        "rating_desc" => entries.sort_by(|(left_item, left_raw), (right_item, right_raw)| {
            right_item
                .rating
                .partial_cmp(&left_item.rating)
                .unwrap_or(std::cmp::Ordering::Equal)
                .then_with(|| compare_newest_release(right_item, left_item))
                .then_with(|| left_item.name.cmp(&right_item.name))
                .then_with(|| left_raw.id.cmp(&right_raw.id))
        }),
        _ => entries.sort_by(|(left_item, left_raw), (right_item, right_raw)| {
            compare_newest_release(right_item, left_item)
                .then_with(|| right_raw.id.cmp(&left_raw.id))
                .then_with(|| left_item.name.cmp(&right_item.name))
        }),
    }
}

pub(crate) fn query_matches_skill(item: &AppSkillItem, keyword: Option<&str>) -> bool {
    let Some(keyword) = normalized_keyword(keyword) else {
        return true;
    };
    let haystack = format!(
        "{} {} {} {} {} {}",
        item.name,
        item.description,
        item.developer,
        item.category,
        item.features.join(" "),
        item.frameworks.join(" ")
    )
    .to_lowercase();
    haystack.contains(&keyword)
}

pub(crate) fn merge_skill_install_config(
    default_config: &str,
    override_config: Option<Value>,
) -> DomainResult<Value> {
    let mut config = runtime_default_config(default_config)?;
    if let Some(override_config) = override_config {
        let Value::Object(override_object) = override_config else {
            return Err(DomainError::new(
                "skill install config must be a JSON object",
            ));
        };
        let mut override_object = override_object;
        override_object.remove("portal");
        merge_json_object(&mut config, override_object);
    }
    Ok(Value::Object(config))
}

fn runtime_default_config(default_config: &str) -> DomainResult<serde_json::Map<String, Value>> {
    let normalized = default_config.trim();
    if normalized.is_empty() {
        return Ok(serde_json::Map::new());
    }
    let value = serde_json::from_str::<Value>(normalized).map_err(|error| {
        DomainError::new(format!("skill default_config is invalid JSON: {error}"))
    })?;
    let Value::Object(mut object) = value else {
        return Err(DomainError::new(
            "skill default_config must be a JSON object",
        ));
    };
    object.remove("portal");
    Ok(object)
}

fn merge_json_object(
    base: &mut serde_json::Map<String, Value>,
    override_object: serde_json::Map<String, Value>,
) {
    for (key, override_value) in override_object {
        match (base.get_mut(&key), override_value) {
            (Some(Value::Object(base_child)), Value::Object(override_child)) => {
                merge_json_object(base_child, override_child);
            }
            (_, value) => {
                base.insert(key, value);
            }
        }
    }
}

fn app_category_matches(item: &AppStoreItem, category: Option<&str>) -> bool {
    let Some(category) = normalized_keyword(category) else {
        return true;
    };
    normalize_text(&item.category).to_lowercase() == category
}

fn app_platform_type_matches(item: &AppStoreItem, platform_types: &[String]) -> bool {
    let platform_types = platform_types
        .iter()
        .filter_map(|value| normalized_keyword(Some(value)))
        .collect::<Vec<_>>();
    if platform_types.is_empty() {
        return true;
    }
    item.releases.iter().any(|release| {
        platform_types.contains(&normalize_text(&release.platform_type).to_lowercase())
    })
}

fn compare_newest_release(left: &AppStoreItem, right: &AppStoreItem) -> std::cmp::Ordering {
    newest_release_date(left).cmp(&newest_release_date(right))
}

fn newest_release_date(item: &AppStoreItem) -> String {
    item.releases
        .iter()
        .map(|release| release.release_date.as_str())
        .max()
        .unwrap_or_default()
        .to_owned()
}

fn build_app_releases(
    raw: &RawAppStoreRecord,
    artifacts: &[RawCatalogArtifact],
    install_config: Option<&Value>,
) -> Vec<AppStoreReleaseItem> {
    let mut releases = artifacts
        .iter()
        .take(64)
        .map(|artifact| AppStoreReleaseItem {
            id: non_empty(artifact.id.clone(), "0"),
            platform_type: platform_type_label(
                &artifact.platform_type,
                &artifact.os_name,
                &artifact.artifact_url,
            ),
            os: os_label(
                &artifact.os_name,
                &artifact.platform_type,
                &artifact.artifact_url,
            ),
            version: non_empty(artifact.version.clone(), &raw.version),
            size: format_size(artifact.artifact_size_bytes),
            release_date: date_only(&artifact.published_at),
            download_url: first_non_empty(&[
                artifact.artifact_url.clone(),
                artifact.artifact_ref.clone(),
            ])
            .unwrap_or_default(),
            whats_new: optional_text(&artifact.release_notes),
        })
        .collect::<Vec<_>>();

    if releases.is_empty() {
        releases.extend(releases_from_json(raw, install_config));
    }
    if releases.is_empty() {
        let download_url = first_non_empty(&[
            raw.download_url.clone(),
            raw.store_url.clone(),
            raw.access_url.clone(),
        ])
        .unwrap_or_default();
        if !download_url.is_empty() {
            releases.push(AppStoreReleaseItem {
                id: format!("{}-latest", raw.id),
                platform_type: platform_type_label("", "", &download_url),
                os: os_label("", "", &download_url),
                version: non_empty(raw.version.clone(), "Latest"),
                size: String::new(),
                release_date: String::new(),
                download_url,
                whats_new: optional_text(&raw.release_notes),
            });
        }
    }
    releases
}

fn releases_from_json(
    raw: &RawAppStoreRecord,
    install_config: Option<&Value>,
) -> Vec<AppStoreReleaseItem> {
    json_array(install_config, &["packages"])
        .into_iter()
        .enumerate()
        .filter_map(|(index, value)| {
            let object = value.as_object()?;
            if object_bool_default(object, "enabled", true) == Some(false) {
                return None;
            }
            let url = first_non_empty(&[
                object_string(object, "downloadUrl"),
                object_string(object, "download_url"),
                object_string(object, "artifactUrl"),
                object_string(object, "artifact_url"),
                object_string(object, "url"),
            ])
            .unwrap_or_default();
            if url.is_empty() {
                return None;
            }
            let platform = object_string(object, "platformType");
            let os = object_string(object, "os");
            Some(AppStoreReleaseItem {
                id: non_empty(
                    first_non_empty(&[
                        object_string(object, "id"),
                        object_string(object, "artifactId"),
                    ])
                    .unwrap_or_default(),
                    &format!("{}-{}", raw.id, index + 1),
                ),
                platform_type: platform_type_label(&platform, &os, &url),
                os: os_label(&os, &platform, &url),
                version: non_empty(object_string(object, "version"), &raw.version),
                size: non_empty(
                    object_string(object, "size"),
                    &format_size(object_i64(object, "artifactSizeBytes")),
                ),
                release_date: date_only(
                    &first_non_empty(&[
                        object_string(object, "releaseDate"),
                        object_string(object, "publishedAt"),
                    ])
                    .unwrap_or_default(),
                ),
                download_url: url,
                whats_new: optional_text(
                    &first_non_empty(&[
                        object_string(object, "whatsNew"),
                        object_string(object, "releaseNotes"),
                    ])
                    .unwrap_or_default(),
                ),
            })
        })
        .collect()
}

fn app_category(app_type: &str, config: Option<&Value>, install_config: Option<&Value>) -> String {
    if let Some(category) = first_non_empty(&[
        json_string(config, &["portal", "category"]),
        json_string(config, &["category"]),
        json_string(install_config, &["portal", "category"]),
    ]) {
        return category;
    }

    let raw = normalize_text(app_type);
    if raw.is_empty() {
        return DEFAULT_APP_CATEGORY.to_owned();
    }
    let label = raw.strip_prefix("APP_").unwrap_or(&raw).replace('_', " ");
    non_empty(label, DEFAULT_APP_CATEGORY)
}

fn platform_type_label(platform: &str, os: &str, url: &str) -> String {
    let normalized = format!("{} {} {}", platform, os, url).to_lowercase();
    if normalized.contains("mini")
        || normalized.contains("wechat")
        || normalized.contains("alipay")
        || normalized.contains("bytedance")
        || normalized.contains("baidu")
        || normalized.contains("quickapp")
    {
        return "Mini Program".to_owned();
    }
    if normalized.contains("android")
        || normalized.contains("ios")
        || normalized.contains("harmony")
        || normalized.ends_with(".apk")
        || normalized.ends_with(".ipa")
    {
        return "Mobile".to_owned();
    }
    if normalized.contains("web")
        || (url.trim_start().to_lowercase().starts_with("http") && !looks_like_download(url))
    {
        return "Web".to_owned();
    }
    "Desktop".to_owned()
}

fn os_label(os: &str, platform: &str, url: &str) -> String {
    let normalized = format!("{} {} {}", os, platform, url).to_lowercase();
    if normalized.contains("mac") || normalized.ends_with(".dmg") {
        return "macOS".to_owned();
    }
    if normalized.contains("linux") || normalized.ends_with(".deb") || normalized.ends_with(".rpm")
    {
        return "Linux".to_owned();
    }
    if normalized.contains("ios") || normalized.ends_with(".ipa") {
        return "iOS".to_owned();
    }
    if normalized.contains("android") || normalized.ends_with(".apk") {
        return "Android".to_owned();
    }
    if normalized.contains("harmony") {
        return "HarmonyOS".to_owned();
    }
    if normalized.contains("wechat") {
        return "WeChat".to_owned();
    }
    if normalized.contains("alipay") {
        return "Alipay".to_owned();
    }
    if normalized.contains("bytedance") {
        return "ByteDance".to_owned();
    }
    if normalized.contains("baidu") {
        return "Baidu".to_owned();
    }
    if normalized.contains("quickapp") {
        return "QuickApp".to_owned();
    }
    if normalized.contains("mobile web") {
        return "Mobile Web".to_owned();
    }
    if platform.trim().to_lowercase().contains("web")
        || normalized.contains("web") && !looks_like_download(url)
    {
        return "PC Web".to_owned();
    }
    "Windows".to_owned()
}

fn looks_like_download(url: &str) -> bool {
    let normalized = url.to_lowercase();
    [
        ".exe", ".msi", ".dmg", ".deb", ".rpm", ".zip", ".apk", ".ipa",
    ]
    .iter()
    .any(|suffix| normalized.ends_with(suffix))
}

fn collect_asset_urls(assets: &[RawCatalogAsset], accepted_types: &[&str]) -> Vec<String> {
    assets
        .iter()
        .filter(|asset| {
            let asset_type = asset.asset_type.trim().to_lowercase();
            accepted_types
                .iter()
                .any(|accepted| asset_type == *accepted || asset_type.contains(*accepted))
        })
        .filter_map(|asset| {
            first_non_empty(&[asset.asset_url.clone(), asset.thumbnail_url.clone()])
        })
        .collect()
}

fn first_asset_url(assets: &[RawCatalogAsset], accepted_types: &[&str]) -> String {
    collect_asset_urls(assets, accepted_types)
        .into_iter()
        .next()
        .unwrap_or_default()
}

fn parse_json(raw: &str) -> Option<Value> {
    let trimmed = raw.trim();
    if trimmed.is_empty() {
        return None;
    }
    serde_json::from_str(trimmed).ok()
}

fn json_string(value: Option<&Value>, path: &[&str]) -> String {
    let mut current = value;
    for segment in path {
        current = current.and_then(|value| value.get(*segment));
    }
    match current {
        Some(Value::String(value)) => normalize_text(value),
        Some(Value::Number(value)) => value.to_string(),
        Some(Value::Bool(value)) => value.to_string(),
        _ => String::new(),
    }
}

fn json_string_array(value: Option<&Value>, path: &[&str]) -> Vec<String> {
    json_array(value, path)
        .into_iter()
        .filter_map(|value| value_to_string(&value))
        .map(|value| normalize_text(&value))
        .filter(|value| !value.is_empty())
        .collect()
}

fn json_array(value: Option<&Value>, path: &[&str]) -> Vec<Value> {
    let mut current = value;
    for segment in path {
        current = current.and_then(|value| value.get(*segment));
    }
    match current {
        Some(Value::Array(values)) => values.clone(),
        _ => Vec::new(),
    }
}

fn parse_string_array(raw: &str) -> Vec<String> {
    let trimmed = raw.trim();
    if trimmed.is_empty() {
        return Vec::new();
    }
    if let Ok(Value::Array(values)) = serde_json::from_str::<Value>(trimmed) {
        return values
            .into_iter()
            .filter_map(|value| match value {
                Value::String(value) => Some(value),
                Value::Object(object) => object
                    .get("name")
                    .or_else(|| object.get("label"))
                    .and_then(value_to_string),
                Value::Number(value) => Some(value.to_string()),
                _ => None,
            })
            .map(|value| normalize_text(&value))
            .filter(|value| !value.is_empty())
            .collect();
    }
    trimmed
        .split(',')
        .map(normalize_text)
        .filter(|value| !value.is_empty())
        .collect()
}

fn value_to_string(value: &Value) -> Option<String> {
    match value {
        Value::String(value) => Some(value.clone()),
        Value::Number(value) => Some(value.to_string()),
        Value::Object(object) => object
            .get("url")
            .or_else(|| object.get("assetUrl"))
            .or_else(|| object.get("asset_url"))
            .or_else(|| object.get("name"))
            .and_then(value_to_string),
        _ => None,
    }
}

fn object_string(object: &serde_json::Map<String, Value>, key: &str) -> String {
    object
        .get(key)
        .and_then(value_to_string)
        .unwrap_or_default()
}

fn object_i64(object: &serde_json::Map<String, Value>, key: &str) -> i64 {
    object
        .get(key)
        .and_then(|value| match value {
            Value::Number(number) => number.as_i64(),
            Value::String(value) => value.parse::<i64>().ok(),
            _ => None,
        })
        .unwrap_or_default()
}

fn object_bool_default(
    object: &serde_json::Map<String, Value>,
    key: &str,
    default: bool,
) -> Option<bool> {
    object.get(key).map(|value| match value {
        Value::Bool(value) => *value,
        Value::Number(number) => number.as_i64().map(|value| value != 0).unwrap_or(default),
        Value::String(value) => match value.trim().to_ascii_lowercase().as_str() {
            "true" | "1" | "yes" | "enabled" => true,
            "false" | "0" | "no" | "disabled" => false,
            _ => default,
        },
        _ => default,
    })
}

fn first_non_empty(values: &[String]) -> Option<String> {
    values
        .iter()
        .map(|value| normalize_text(value))
        .find(|value| !value.is_empty())
}

fn first_non_empty_array(values: &[Vec<String>]) -> Vec<String> {
    values
        .iter()
        .find(|value| !value.is_empty())
        .cloned()
        .unwrap_or_default()
}

fn release_note_highlights(raw: &str) -> Vec<String> {
    let Some(Value::Array(notes)) = parse_json(raw) else {
        return Vec::new();
    };
    notes
        .iter()
        .flat_map(|note| json_string_array(Some(note), &["highlights"]))
        .take(64)
        .collect()
}

fn non_empty(value: String, fallback: &str) -> String {
    let normalized = normalize_text(&value);
    if normalized.is_empty() {
        fallback.to_owned()
    } else {
        normalized
    }
}

fn optional_text(value: &str) -> Option<String> {
    let normalized = normalize_text(value);
    (!normalized.is_empty()).then_some(normalized)
}

fn normalize_text(value: &str) -> String {
    value.split_whitespace().collect::<Vec<_>>().join(" ")
}

fn date_only(value: &str) -> String {
    let trimmed = value.trim();
    if trimmed.len() >= 10 {
        trimmed[0..10].to_owned()
    } else {
        trimmed.to_owned()
    }
}

fn format_count(value: i64) -> String {
    let value = value.max(0) as f64;
    if value >= 1_000_000_000.0 {
        return format!("{}B", trim_fixed(value / 1_000_000_000.0));
    }
    if value >= 1_000_000.0 {
        return format!("{}M", trim_fixed(value / 1_000_000.0));
    }
    if value >= 1_000.0 {
        return format!("{}K", trim_fixed(value / 1_000.0));
    }
    format!("{}", value.round() as i64)
}

fn format_size(bytes: i64) -> String {
    if bytes <= 0 {
        return String::new();
    }
    let bytes = bytes as f64;
    if bytes >= 1024.0 * 1024.0 * 1024.0 {
        return format!("{} GB", trim_fixed(bytes / (1024.0 * 1024.0 * 1024.0)));
    }
    if bytes >= 1024.0 * 1024.0 {
        return format!("{} MB", trim_fixed(bytes / (1024.0 * 1024.0)));
    }
    format!("{} KB", (bytes / 1024.0).round() as i64)
}

fn trim_fixed(value: f64) -> String {
    let formatted = format!("{value:.1}");
    formatted.trim_end_matches(".0").to_owned()
}

fn round_rating(value: f64) -> f64 {
    ((value.clamp(0.0, 5.0) * 10.0).round() / 10.0).clamp(0.0, 5.0)
}

fn normalized_keyword(keyword: Option<&str>) -> Option<String> {
    keyword
        .map(normalize_text)
        .map(|value| value.to_lowercase())
        .filter(|value| !value.is_empty())
}
