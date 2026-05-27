use std::collections::{BTreeMap, BTreeSet};
use std::error::Error;
use std::fmt::{Display, Formatter};

use sha2::{Digest, Sha256};

use sdkwork_models::{ModelCatalog, ModelInfo};

use crate::ports::{AdminAiModelItem, AdminModelSubject, AdminModelVendorItem};

pub(crate) const SYSTEM_TENANT_ID: i64 = 0;
pub(crate) const SYSTEM_ORGANIZATION_ID: i64 = 0;
pub(crate) const SYSTEM_DATA_SCOPE: i32 = 1;
pub(crate) const ACTIVE_STATUS: i32 = 1;
pub(crate) const DEFAULT_CATALOG_REFRESH_SOURCE: &str = "sdkwork_models";
pub(crate) const SYNC_MODE_DRY_RUN: &str = "dry_run";

pub(crate) fn catalog_key(vendor_code: &str, region_code: &str, model_id: &str) -> String {
    format!("{vendor_code}/{region_code}/{model_id}")
}

pub(crate) fn model_base_catalog_key(vendor_code: &str, model_id: &str) -> String {
    format!("{vendor_code}/{model_id}")
}

pub(crate) fn model_catalog_key(vendor_code: &str, region_code: &str, model_id: &str) -> String {
    catalog_key(vendor_code, region_code, model_id)
}

#[derive(Debug)]
pub(crate) enum CatalogImportError {
    Catalog(sdkwork_models::CatalogError),
    CatalogVersionMismatch { expected: String, actual: String },
    UnknownVendors(Vec<String>),
}

impl Display for CatalogImportError {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Catalog(error) => write!(formatter, "{error}"),
            Self::CatalogVersionMismatch { expected, actual } => write!(
                formatter,
                "sdkwork-models catalog version mismatch: expected {expected}, loaded {actual}"
            ),
            Self::UnknownVendors(vendors) => {
                write!(
                    formatter,
                    "sdkwork-models catalog does not define vendor(s): {}",
                    vendors.join(", ")
                )
            }
        }
    }
}

impl Error for CatalogImportError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        match self {
            Self::Catalog(error) => Some(error),
            Self::CatalogVersionMismatch { .. } | Self::UnknownVendors(_) => None,
        }
    }
}

impl From<sdkwork_models::CatalogError> for CatalogImportError {
    fn from(value: sdkwork_models::CatalogError) -> Self {
        Self::Catalog(value)
    }
}

pub(crate) fn load_catalog_root_with_pin(
    catalog_root: Option<&str>,
    catalog_version: Option<&str>,
) -> Result<ModelCatalog, CatalogImportError> {
    let catalog = match catalog_root
        .map(str::trim)
        .filter(|value| !value.is_empty())
    {
        Some(root) => sdkwork_models::load_catalog(root)?,
        None => sdkwork_models::load_bundled_catalog()?,
    };
    validate_catalog_version_pin(&catalog, catalog_version)?;
    Ok(catalog)
}

pub(crate) fn catalog_with_selected_vendors(
    catalog: &ModelCatalog,
    vendor_codes: &[String],
) -> Result<ModelCatalog, CatalogImportError> {
    let requested = normalized_vendor_set(vendor_codes);
    if requested.is_empty() {
        return Ok(catalog.clone());
    }

    let available = catalog
        .vendors
        .iter()
        .map(|vendor| vendor.vendor.vendor_code.clone())
        .collect::<BTreeSet<_>>();
    let missing = requested
        .iter()
        .filter(|vendor_code| !available.contains(*vendor_code))
        .cloned()
        .collect::<Vec<_>>();
    if !missing.is_empty() {
        return Err(CatalogImportError::UnknownVendors(missing));
    }

    Ok(ModelCatalog {
        manifest: catalog.manifest.clone(),
        meters: catalog.meters.clone(),
        protocols: catalog.protocols.clone(),
        vendors: catalog
            .vendors
            .iter()
            .filter(|vendor| requested.contains(&vendor.vendor.vendor_code))
            .cloned()
            .collect(),
    })
}

pub(crate) fn catalog_scope_vendor_codes(catalog: &ModelCatalog) -> Vec<String> {
    catalog
        .vendors
        .iter()
        .map(|vendor| vendor.vendor.vendor_code.clone())
        .collect::<BTreeSet<_>>()
        .into_iter()
        .collect()
}

pub(crate) fn catalog_scope_model_count(catalog: &ModelCatalog) -> usize {
    catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            vendor.models.iter().map(|model| {
                model_catalog_key(
                    &vendor.vendor.vendor_code,
                    &vendor.vendor.region_code,
                    &model.model_id,
                )
            })
        })
        .collect::<BTreeSet<_>>()
        .len()
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) struct CatalogScopeCounts {
    pub meter_count: usize,
    pub vendor_count: usize,
    pub family_count: usize,
    pub model_count: usize,
    pub capability_count: usize,
    pub price_count: usize,
    pub ranking_count: usize,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) struct CatalogAuthorityKeys {
    pub vendor_codes: Vec<String>,
    pub vendor_region_uuids: Vec<String>,
    pub catalog_keys: Vec<String>,
    pub family_uuids: Vec<String>,
    pub capability_uuids: Vec<String>,
    pub price_uuids: Vec<String>,
    pub ranking_uuids: Vec<String>,
}

impl CatalogScopeCounts {
    pub fn accepted_count(self) -> i64 {
        (self.meter_count
            + self.vendor_count
            + self.family_count
            + self.model_count
            + self.capability_count
            + self.price_count
            + self.ranking_count) as i64
    }
}

pub(crate) fn catalog_scope_counts(catalog: &ModelCatalog) -> CatalogScopeCounts {
    let model_catalog_keys = catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            vendor.models.iter().map(|model| {
                model_catalog_key(
                    &vendor.vendor.vendor_code,
                    &vendor.vendor.region_code,
                    &model.model_id,
                )
            })
        })
        .collect::<BTreeSet<_>>();
    let capability_count = catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            let region_code = vendor.vendor.region_code.clone();
            vendor.models.iter().flat_map(move |model| {
                let vendor_code = vendor.vendor.vendor_code.clone();
                let region_code = region_code.clone();
                let capabilities = if model.capabilities.is_empty() {
                    vec![model.primary_capability.clone()]
                } else {
                    model.capabilities.clone()
                };
                capabilities.into_iter().map(move |capability| {
                    model_catalog_key(&vendor_code, &region_code, &model.model_id)
                        + "/"
                        + &capability
                })
            })
        })
        .collect::<BTreeSet<_>>()
        .len();
    let price_count = catalog
        .vendors
        .iter()
        .flat_map(|vendor| vendor.pricing.iter())
        .map(|pricing| pricing.prices.len())
        .sum();
    let ranking_count = catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            let vendor_code = vendor.vendor.vendor_code.as_str();
            let region_code = vendor.vendor.region_code.as_str();
            vendor.rankings.iter().flat_map(move |snapshot| {
                snapshot.items.iter().map(move |item| {
                    (
                        model_catalog_key(vendor_code, region_code, &item.model_id),
                        catalog_key(vendor_code, region_code, &item.model_id),
                    )
                })
            })
        })
        .filter(|(model_catalog_key, _)| model_catalog_keys.contains(model_catalog_key))
        .count();
    CatalogScopeCounts {
        meter_count: catalog.meters.len(),
        vendor_count: catalog_scope_vendor_codes(catalog).len(),
        family_count: catalog
            .vendors
            .iter()
            .map(|vendor| vendor.families.len())
            .sum(),
        model_count: catalog_scope_model_count(catalog),
        capability_count,
        price_count,
        ranking_count,
    }
}

pub(crate) fn catalog_authority_keys(catalog: &ModelCatalog) -> CatalogAuthorityKeys {
    let vendor_codes = catalog
        .vendors
        .iter()
        .map(|vendor| vendor.vendor.vendor_code.clone())
        .collect::<BTreeSet<_>>()
        .into_iter()
        .collect::<Vec<_>>();
    let catalog_keys = catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            vendor.models.iter().map(|model| {
                model_catalog_key(
                    &vendor.vendor.vendor_code,
                    &vendor.vendor.region_code,
                    &model.model_id,
                )
            })
        })
        .collect::<BTreeSet<_>>()
        .into_iter()
        .collect::<Vec<_>>();
    let model_catalog_key_set = catalog_keys.iter().cloned().collect::<BTreeSet<_>>();
    let vendor_region_uuids = catalog
        .vendors
        .iter()
        .map(|vendor| {
            stable_uuid(
                "sdk-vendor-region",
                &[&vendor.vendor.vendor_code, &vendor.vendor.region_code],
            )
        })
        .collect::<BTreeSet<_>>()
        .into_iter()
        .collect::<Vec<_>>();
    let family_uuids = catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            vendor.families.iter().map(|family| {
                stable_uuid(
                    "sdk-family",
                    &[
                        &vendor.vendor.vendor_code,
                        &vendor.vendor.region_code,
                        &family.family_code,
                    ],
                )
            })
        })
        .collect::<BTreeSet<_>>()
        .into_iter()
        .collect::<Vec<_>>();
    let capability_uuids = catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            let vendor_code = vendor.vendor.vendor_code.clone();
            let region_code = vendor.vendor.region_code.clone();
            vendor.models.iter().flat_map(move |model| {
                let vendor_code = vendor_code.clone();
                let region_code = region_code.clone();
                let capabilities = if model.capabilities.is_empty() {
                    vec![model.primary_capability.clone()]
                } else {
                    model.capabilities.clone()
                };
                capabilities.into_iter().map(move |capability| {
                    stable_uuid(
                        "sdk-cap",
                        &[&vendor_code, &region_code, &model.model_id, &capability],
                    )
                })
            })
        })
        .collect::<BTreeSet<_>>()
        .into_iter()
        .collect::<Vec<_>>();
    let price_uuids = catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            vendor.pricing.iter().flat_map(|pricing| {
                pricing.prices.iter().map(|price| {
                    stable_uuid(
                        "sdk-price",
                        &[
                            &vendor.vendor.vendor_code,
                            &vendor.vendor.region_code,
                            &pricing.model_id,
                            &price.price_id,
                        ],
                    )
                })
            })
        })
        .collect::<BTreeSet<_>>()
        .into_iter()
        .collect::<Vec<_>>();
    let ranking_uuids = catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            let vendor_code = vendor.vendor.vendor_code.clone();
            let region_code = vendor.vendor.region_code.clone();
            let model_catalog_key_set = model_catalog_key_set.clone();
            vendor.rankings.iter().flat_map(move |snapshot| {
                let vendor_code = vendor_code.clone();
                let region_code = region_code.clone();
                let model_catalog_key_set = model_catalog_key_set.clone();
                snapshot.items.iter().filter_map(move |item| {
                    let model_catalog_key =
                        model_catalog_key(&vendor_code, &region_code, &item.model_id);
                    if model_catalog_key_set.contains(&model_catalog_key) {
                        Some(stable_uuid(
                            "sdk-rank",
                            &[
                                &snapshot.snapshot_date,
                                &snapshot.rank_scope,
                                &vendor_code,
                                &region_code,
                                &item.model_id,
                            ],
                        ))
                    } else {
                        None
                    }
                })
            })
        })
        .collect::<BTreeSet<_>>()
        .into_iter()
        .collect::<Vec<_>>();

    CatalogAuthorityKeys {
        vendor_codes,
        vendor_region_uuids,
        catalog_keys,
        family_uuids,
        capability_uuids,
        price_uuids,
        ranking_uuids,
    }
}

pub(crate) fn is_dry_run_mode(mode: &str) -> bool {
    mode == SYNC_MODE_DRY_RUN
}

pub(crate) fn catalog_preview_admin_items(
    catalog: &ModelCatalog,
    subject: AdminModelSubject,
) -> (Vec<AdminModelVendorItem>, Vec<AdminAiModelItem>) {
    let vendors = catalog
        .vendors
        .iter()
        .enumerate()
        .map(|(index, vendor)| AdminModelVendorItem {
            id: (index as i64) + 1,
            uuid: stable_uuid("sdk-vendor-preview", &[&vendor.vendor.vendor_code]),
            tenant_id: subject.tenant_id,
            organization_id: subject.organization_id,
            vendor_code: vendor.vendor.vendor_code.clone(),
            name: vendor.vendor.display_name.clone(),
            status: "active".to_owned(),
            color: "bg-slate-700".to_owned(),
            description: vendor.vendor.description.clone().unwrap_or_default(),
            deleted_at: None,
        })
        .collect::<Vec<_>>();
    let models = catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            vendor.models.iter().map(move |model| {
                let prices = vendor
                    .pricing
                    .iter()
                    .find(|pricing| pricing.model_id == model.model_id);
                let catalog_key = model_catalog_key(
                    &vendor.vendor.vendor_code,
                    &vendor.vendor.region_code,
                    &model.model_id,
                );
                let item = AdminAiModelItem {
                    id: 0,
                    uuid: stable_uuid(
                        "sdk-model-preview",
                        &[
                            &vendor.vendor.vendor_code,
                            &vendor.vendor.region_code,
                            &model.model_id,
                        ],
                    ),
                    tenant_id: subject.tenant_id,
                    organization_id: subject.organization_id,
                    vendor_id: vendor.vendor.vendor_code.clone(),
                    vendor_code: vendor.vendor.vendor_code.clone(),
                    region_code: vendor.vendor.region_code.clone(),
                    catalog_key,
                    model: model.model_id.clone(),
                    display_name: model.display_name.clone(),
                    name: if model.display_name.trim().is_empty() {
                        model.model_id.clone()
                    } else {
                        model.display_name.clone()
                    },
                    model_type: preview_model_type(model),
                    price_in: preview_price(prices, true),
                    price_out: preview_price(prices, false),
                    cache_read_price: preview_cache_price(prices, "llm_cache_read_token"),
                    cache_write_price: preview_cache_price(prices, "llm_cache_write_token"),
                    status: "active".to_owned(),
                    calls: "0".to_owned(),
                    description: model.description.clone(),
                    modalities: preview_modalities(model),
                    input_modalities: model.input_modalities.clone(),
                    output_modalities: model.output_modalities.clone(),
                    api_format: Some(model.api_format.clone()),
                    capability_intro: None,
                    limitations: Vec::new(),
                    supported_languages: Vec::new(),
                    use_cases: model.strengths.clone(),
                    training_data_cutoff: None,
                    context_tokens: model.context_tokens,
                    max_output_tokens: model.max_output_tokens,
                    supports_streaming: model.supports_streaming,
                    supports_tools: model.supports_tools,
                    supports_json_schema: model.supports_json_schema,
                    release_stage: Some(release_stage_code(&model.release_stage)),
                    shelf_state: Some(shelf_state_code(&model.shelf_state)),
                    routing_state: Some(routing_state_code(&model.routing_state)),
                    replacement_model: model.replacement_model.clone(),
                    deleted_at: None,
                };
                (item.catalog_key.clone(), item)
            })
        })
        .collect::<BTreeMap<_, _>>()
        .into_values()
        .enumerate()
        .map(|(index, mut item)| {
            item.id = (index as i64) + 1;
            item
        })
        .collect::<Vec<_>>();
    (vendors, models)
}

fn validate_catalog_version_pin(
    catalog: &ModelCatalog,
    catalog_version: Option<&str>,
) -> Result<(), CatalogImportError> {
    let Some(expected) = catalog_version
        .map(str::trim)
        .filter(|value| !value.is_empty())
    else {
        return Ok(());
    };
    if expected != catalog.manifest.catalog_version {
        return Err(CatalogImportError::CatalogVersionMismatch {
            expected: expected.to_owned(),
            actual: catalog.manifest.catalog_version.clone(),
        });
    }
    Ok(())
}

fn normalized_vendor_set(vendor_codes: &[String]) -> BTreeSet<String> {
    vendor_codes
        .iter()
        .map(|value| value.trim().to_ascii_lowercase())
        .filter(|value| !value.is_empty())
        .collect()
}

pub(crate) fn catalog_payload(catalog: &ModelCatalog) -> String {
    serde_json::json!({
        "catalogVersion": catalog.manifest.catalog_version,
        "schemaVersion": catalog.manifest.schema_version,
        "generatedAt": catalog.manifest.generated_at,
        "vendorCount": catalog_scope_vendor_codes(catalog).len(),
        "regionCount": catalog.vendors.len(),
        "modelCount": catalog.vendors.iter().map(|vendor| vendor.models.len()).sum::<usize>(),
        "meterCount": catalog.meters.len(),
    })
    .to_string()
}

pub(crate) fn catalog_scope_source_hash(source_code: &str, catalog: &ModelCatalog) -> String {
    let payload = serde_json::json!({
        "hashKind": "sdkwork-models.catalog-scope.v1",
        "sourceCode": source_code,
        "catalog": catalog,
    });
    let bytes =
        serde_json::to_vec(&payload).unwrap_or_else(|_| catalog_payload(catalog).into_bytes());
    let mut hasher = Sha256::new();
    hasher.update(&bytes);
    hex::encode(hasher.finalize())
}

fn preview_model_type(model: &ModelInfo) -> String {
    if model
        .input_modalities
        .iter()
        .chain(model.output_modalities.iter())
        .any(|modality| modality == "embedding")
    {
        return "Embedding".to_owned();
    }
    match model.primary_capability.as_str() {
        "image" => "Image",
        "audio" => "Audio",
        "music" => "Music",
        "sfx" | "sound_effect" => "SoundEffect",
        "video" => "Video",
        "embedding" => "Embedding",
        _ => "Chat",
    }
    .to_owned()
}

fn preview_modalities(model: &ModelInfo) -> Vec<String> {
    let mut values = model.input_modalities.clone();
    for modality in &model.output_modalities {
        if !values.contains(modality) {
            values.push(modality.clone());
        }
    }
    values
}

fn preview_price(pricing: Option<&sdkwork_models::ModelPricing>, input: bool) -> String {
    let Some(pricing) = pricing else {
        return String::new();
    };
    let meters: &[&str] = if input {
        &[
            "llm_input_token",
            "embedding_input_token",
            "image_input_token",
            "audio_input_token",
            "audio_input_second",
            "audio_input_minute",
            "tts_input_character",
            "api_request",
            "video_input_token",
        ]
    } else {
        &[
            "llm_output_token",
            "image_output_token",
            "image_result",
            "audio_output_token",
            "audio_output_second",
            "music_output_second",
            "sfx_result",
            "video_output_token",
            "video_output_second",
            "api_result",
        ]
    };
    pricing
        .prices
        .iter()
        .find(|price| meters.contains(&price.meter_code.as_str()))
        .map(|price| price.unit_price.clone())
        .unwrap_or_default()
}

fn preview_cache_price(pricing: Option<&sdkwork_models::ModelPricing>, meter_code: &str) -> String {
    pricing
        .and_then(|pricing| {
            pricing
                .prices
                .iter()
                .find(|price| price.meter_code == meter_code)
        })
        .map(|price| price.unit_price.clone())
        .unwrap_or_default()
}

pub(crate) fn stable_uuid(prefix: &str, parts: &[&str]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(prefix.as_bytes());
    for part in parts {
        hasher.update(b":");
        hasher.update(part.as_bytes());
    }
    let digest = format!("{:x}", hasher.finalize());
    format!("{prefix}-{}", &digest[..40])
}

pub(crate) fn metadata_json(
    catalog: &ModelCatalog,
    source: &str,
    extra: serde_json::Value,
) -> String {
    serde_json::json!({
        "source": source,
        "catalogVersion": catalog.manifest.catalog_version,
        "schemaVersion": catalog.manifest.schema_version,
        "generatedAt": catalog.manifest.generated_at,
        "extra": extra,
    })
    .to_string()
}

pub(crate) fn modality_code(value: &str) -> i32 {
    match value {
        "text" => 1,
        "image" => 2,
        "audio" => 3,
        "music" => 4,
        "video" => 5,
        "embedding" => 6,
        "rerank" => 7,
        "tool" => 8,
        "storage" => 9,
        "network" => 10,
        _ => 0,
    }
}

pub(crate) fn capability_code(value: &str) -> i32 {
    match value {
        "image" => 2,
        "audio" => 3,
        "music" => 4,
        "video" => 5,
        "embedding" => 6,
        "rerank" => 7,
        "tool" => 8,
        _ => 1,
    }
}

pub(crate) fn family_type_code(value: &str) -> i32 {
    match value {
        "embedding" => 2,
        "image" => 3,
        "audio" => 4,
        "music" => 5,
        "video" => 6,
        "rerank" => 7,
        "multimodal" => 8,
        _ => 1,
    }
}

pub(crate) fn vendor_type_code(value: &str) -> i32 {
    match value {
        "open_source" => 2,
        "research" => 3,
        "community" => 4,
        _ => 1,
    }
}

pub(crate) fn release_stage_code(value: &str) -> i32 {
    match value {
        "preview" => 2,
        "deprecated" => 3,
        "retired" => 4,
        _ => 1,
    }
}

pub(crate) fn shelf_state_code(value: &str) -> i32 {
    match value {
        "hidden" => 2,
        "archived" => 3,
        _ => 1,
    }
}

pub(crate) fn routing_state_code(value: &str) -> i32 {
    match value {
        "enabled" => 1,
        _ => 0,
    }
}

pub(crate) fn price_side_code(value: &str) -> i32 {
    match value {
        "upstream" => 2,
        "customer" => 3,
        _ => 1,
    }
}

pub(crate) fn price_provider_code(
    vendor_code: &str,
    region_code: &str,
    price_side: &str,
    pricing_scope: Option<&str>,
) -> Option<String> {
    if price_side == "upstream" || matches!(pricing_scope, Some("provider" | "channel")) {
        Some(format!("{vendor_code}_direct_{region_code}"))
    } else {
        None
    }
}

pub(crate) fn pricing_scope_code(value: Option<&str>) -> i32 {
    match value {
        Some("provider") => 2,
        Some("channel") => 3,
        Some("plan") => 4,
        _ => 1,
    }
}

pub(crate) fn primary_modality(model: &ModelInfo) -> i32 {
    model
        .output_modalities
        .first()
        .or_else(|| model.input_modalities.first())
        .map(|value| modality_code(value))
        .unwrap_or_else(|| capability_code(&model.primary_capability))
}

pub(crate) fn model_modalities_json(model: &ModelInfo) -> String {
    let mut values = model.input_modalities.clone();
    for output in &model.output_modalities {
        if !values.contains(output) {
            values.push(output.clone());
        }
    }
    serde_json::to_string(&values).unwrap_or_else(|_| "[]".to_owned())
}

pub(crate) fn model_capabilities_json(model: &ModelInfo) -> String {
    let capabilities;
    let values = if model.capabilities.is_empty() {
        capabilities = vec![model.primary_capability.clone()];
        capabilities.as_slice()
    } else {
        model.capabilities.as_slice()
    };
    json_array(values)
}

pub(crate) fn json_array(values: &[String]) -> String {
    serde_json::to_string(values).unwrap_or_else(|_| "[]".to_owned())
}

#[cfg(test)]
mod tests {
    use super::price_provider_code;

    #[test]
    fn price_provider_code_keeps_vendor_identity_separate_from_region() {
        assert_eq!(
            Some("minimax_direct_cn".to_owned()),
            price_provider_code("minimax", "cn", "upstream", None)
        );
        assert_eq!(
            Some("minimax_direct_global".to_owned()),
            price_provider_code("minimax", "global", "official", Some("provider"))
        );
        assert_eq!(
            Some("kuaishou_direct_global".to_owned()),
            price_provider_code("kuaishou", "global", "official", Some("channel"))
        );
        assert_eq!(
            None,
            price_provider_code("minimax", "cn", "official", Some("model"))
        );
    }
}
