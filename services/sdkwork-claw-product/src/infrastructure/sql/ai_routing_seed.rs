use std::collections::{BTreeMap, BTreeSet};
use std::fmt::{Display, Formatter};

use sdkwork_iam_storage_sqlx::{DEFAULT_IAM_ORGANIZATION_ID, DEFAULT_IAM_TENANT_ID};
use serde::Deserialize;
use serde_json::Value;
use sha2::{Digest, Sha256};
use sqlx::{PgPool, Row, SqlitePool};

const MANIFEST_JSON: &str = include_str!("../../../../../data/ai-routing/install-manifest.json");
const CORE_RESOURCES_JSON: &str =
    include_str!("../../../../../data/ai-routing/resources/core-resources.json");
const OPENAI_RESOURCES_JSON: &str =
    include_str!("../../../../../data/ai-routing/resources/openai-resources.json");
const VENDOR_NATIVE_RESOURCES_JSON: &str =
    include_str!("../../../../../data/ai-routing/resources/vendor-native-resources.json");
const OFFICIAL_PROVIDER_GROUPS_JSON: &str =
    include_str!("../../../../../data/ai-routing/resource-groups/official-provider-groups.json");
const RELAY_PROVIDER_GROUPS_JSON: &str =
    include_str!("../../../../../data/ai-routing/resource-groups/relay-provider-groups.json");
const OPENAI_COMPATIBLE_TEMPLATES_JSON: &str = include_str!(
    "../../../../../data/ai-routing/channel-endpoint-templates/openai-compatible-templates.json"
);
const VENDOR_NATIVE_TEMPLATES_JSON: &str = include_str!(
    "../../../../../data/ai-routing/channel-endpoint-templates/vendor-native-templates.json"
);

const ACTIVE_STATUS: i32 = 1;
const DISABLED_STATUS: i32 = 0;
const HEALTHY_STATUS: i32 = 1;
const SYSTEM_TENANT_ID: i64 = 0;
const SYSTEM_ORGANIZATION_ID: i64 = 0;
const SYSTEM_DATA_SCOPE: i32 = 1;
const DEFAULT_ADMIN_DATA_SCOPE: i32 = 1;
const DEFAULT_ADMIN_REGION_CODE: &str = "global";
const DEFAULT_OPENAI_BASE_URL: &str = "https://api.openai.com/v1";
const DEFAULT_ADMIN_CHANNEL_SEED_SOURCE: &str =
    "default-admin-channel-seed.v1|openai-default|openai|official|openai_compatible|https://api.openai.com/v1";

#[derive(Debug)]
pub(crate) enum AiRoutingSeedLoadError {
    Json(serde_json::Error),
    Validation(String),
}

impl Display for AiRoutingSeedLoadError {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Json(error) => write!(formatter, "{error}"),
            Self::Validation(message) => formatter.write_str(message),
        }
    }
}

impl std::error::Error for AiRoutingSeedLoadError {}

impl From<serde_json::Error> for AiRoutingSeedLoadError {
    fn from(value: serde_json::Error) -> Self {
        Self::Json(value)
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AiRoutingManifest {
    catalog_code: String,
    schema_version: String,
    source: String,
    sections: AiRoutingManifestSections,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AiRoutingManifestSections {
    resources: Vec<String>,
    resource_groups: Vec<String>,
    channel_endpoint_templates: Vec<String>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ResourceBundle {
    kind: String,
    items: Vec<ResourceSeed>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ResourceSeed {
    resource_code: String,
    resource_type: String,
    display_name: String,
    vendor_code: Option<String>,
    modality_code: Option<String>,
    api_code: Option<String>,
    catalog_key: Option<String>,
    model: Option<String>,
    provider_native_model: Option<String>,
    capability: String,
    capabilities: Vec<String>,
    sort_order: i32,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ResourceGroupBundle {
    kind: String,
    items: Vec<ResourceGroupSeed>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ResourceGroupSeed {
    group_code: String,
    group_name: String,
    group_type: String,
    selection_mode: String,
    description: Option<String>,
    sort_order: i32,
    items: Vec<ResourceGroupItemSeed>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ResourceGroupItemSeed {
    item_type: String,
    resource_code: Option<String>,
    group_code: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ChannelEndpointTemplateBundle {
    kind: String,
    items: Vec<ChannelEndpointTemplateSeed>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ChannelEndpointTemplateSeed {
    template_code: String,
    vendor_code: String,
    api_code: String,
    capability: String,
    capabilities: Vec<String>,
    method: String,
    path_template: String,
    protocol_code: String,
    timeout_ms: i32,
    sort_order: i32,
}

#[derive(Debug, Clone)]
struct AiRoutingSeedCatalog {
    manifest: AiRoutingManifest,
    resources: Vec<ResourceSeed>,
    resource_groups: Vec<ResourceGroupSeed>,
    channel_endpoint_templates: Vec<ChannelEndpointTemplateSeed>,
}

#[derive(Debug, Clone)]
struct EndpointSeedDefinition<'a> {
    resource: &'a ResourceSeed,
    template: Option<&'a ChannelEndpointTemplateSeed>,
}

#[derive(Debug, Clone, Copy)]
struct DefaultAdminChannelSeed {
    channel_code: &'static str,
    channel_name: &'static str,
    provider_code: &'static str,
    channel_type: &'static str,
    protocol_code: &'static str,
    base_url: &'static str,
    priority: i32,
    weight: i32,
}

static DEFAULT_ADMIN_CHANNELS: [DefaultAdminChannelSeed; 1] = [DefaultAdminChannelSeed {
    channel_code: "openai-default",
    channel_name: "OpenAI Default",
    provider_code: "openai",
    channel_type: "official",
    protocol_code: "openai_compatible",
    base_url: DEFAULT_OPENAI_BASE_URL,
    priority: 100,
    weight: 100,
}];

impl EndpointSeedDefinition<'_> {
    fn api_code(&self) -> &str {
        self.resource.api_code.as_deref().unwrap_or_default()
    }

    fn protocol_code(&self) -> &str {
        self.template
            .map(|template| template.protocol_code.as_str())
            .unwrap_or_else(|| default_protocol_code(self.resource))
    }

    fn display_name(&self) -> &str {
        self.resource.display_name.as_str()
    }

    fn method(&self) -> &str {
        self.template
            .map(|template| template.method.as_str())
            .unwrap_or("POST")
    }

    fn path_template(&self) -> String {
        self.template
            .map(|template| template.path_template.clone())
            .unwrap_or_else(|| default_path_template(self.api_code()))
    }

    fn streaming_supported(&self) -> bool {
        let api_code = self.api_code();
        api_code == "openai.responses"
            || api_code == "openai.chat_completions"
            || api_code == "openai.completions"
            || api_code == "openai.realtime"
            || api_code == "openai.audio.speech"
            || api_code == "gemini.stream_generate_content"
            || api_code == "gemini.live"
            || self
                .resource
                .capabilities
                .iter()
                .any(|capability| capability.trim().eq_ignore_ascii_case("streaming"))
    }

    fn sort_order(&self) -> i32 {
        self.template
            .map(|template| template.sort_order)
            .unwrap_or(self.resource.sort_order)
    }
}

impl DefaultAdminChannelSeed {
    fn endpoint_base_url(&self) -> &'static str {
        self.base_url
    }
}

impl AiRoutingSeedCatalog {
    fn load() -> Result<Self, AiRoutingSeedLoadError> {
        let manifest = serde_json::from_str::<AiRoutingManifest>(MANIFEST_JSON)?;
        let resources = resource_bundles()?
            .into_iter()
            .flat_map(|bundle| bundle.items)
            .collect::<Vec<_>>();
        let resource_groups = resource_group_bundles()?
            .into_iter()
            .flat_map(|bundle| bundle.items)
            .collect::<Vec<_>>();
        let channel_endpoint_templates = channel_endpoint_template_bundles()?
            .into_iter()
            .flat_map(|bundle| bundle.items)
            .collect::<Vec<_>>();
        let catalog = Self {
            manifest,
            resources,
            resource_groups,
            channel_endpoint_templates,
        };
        validate_catalog(&catalog)?;
        Ok(catalog)
    }

    fn payload(&self) -> String {
        serde_json::json!({
            "catalogCode": self.manifest.catalog_code,
            "schemaVersion": self.manifest.schema_version,
            "source": self.manifest.source,
            "resourceCount": self.resources.len(),
            "resourceGroupCount": self.resource_groups.len(),
            "channelEndpointTemplateCount": self.channel_endpoint_templates.len(),
            "defaultAdminChannelCount": default_admin_channels().len(),
            "defaultAdminChannelEndpointCount": default_admin_channel_endpoint_definitions(self).len(),
            "sourceHash": source_hash(),
        })
        .to_string()
    }
}

pub(crate) fn bundled_ai_routing_seed_payload() -> Result<String, AiRoutingSeedLoadError> {
    Ok(AiRoutingSeedCatalog::load()?.payload())
}

pub(crate) async fn import_sqlite_ai_routing_seed(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    let catalog = AiRoutingSeedCatalog::load().map_err(json_decode_error)?;
    let mut tx = pool.begin().await?;
    import_sqlite_api_endpoints(&mut tx, &catalog).await?;
    import_sqlite_resources(&mut tx, &catalog).await?;
    import_sqlite_resource_groups(&mut tx, &catalog).await?;
    import_sqlite_resource_group_items(&mut tx, &catalog).await?;
    import_sqlite_default_admin_channels(&mut tx, &catalog).await?;
    import_sqlite_default_admin_channel_endpoints(&mut tx, &catalog).await?;
    tx.commit().await?;
    Ok(())
}

pub(crate) async fn import_postgres_ai_routing_seed(pool: &PgPool) -> Result<(), sqlx::Error> {
    let catalog = AiRoutingSeedCatalog::load().map_err(json_decode_error)?;
    let mut tx = pool.begin().await?;
    import_postgres_api_endpoints(&mut tx, &catalog).await?;
    import_postgres_resources(&mut tx, &catalog).await?;
    import_postgres_resource_groups(&mut tx, &catalog).await?;
    import_postgres_resource_group_items(&mut tx, &catalog).await?;
    import_postgres_default_admin_channels(&mut tx, &catalog).await?;
    import_postgres_default_admin_channel_endpoints(&mut tx, &catalog).await?;
    tx.commit().await?;
    Ok(())
}

pub(crate) async fn sqlite_ai_routing_seed_complete(
    pool: &SqlitePool,
) -> Result<bool, sqlx::Error> {
    let catalog = AiRoutingSeedCatalog::load().map_err(json_decode_error)?;
    let resource_codes = sqlite_string_set(
        pool,
        "SELECT resource_code FROM ai_resource WHERE tenant_id = 0 AND organization_id = 0 AND status = 1 AND deleted_at IS NULL",
    )
    .await?;
    let group_codes = sqlite_string_set(
        pool,
        "SELECT group_code FROM ai_resource_group WHERE tenant_id = 0 AND organization_id = 0 AND status = 1 AND deleted_at IS NULL",
    )
    .await?;
    let endpoint_codes = sqlite_string_set(
        pool,
        "SELECT endpoint_code FROM ai_api_endpoint WHERE tenant_id = 0 AND organization_id = 0 AND status = 1 AND deleted_at IS NULL",
    )
    .await?;
    let default_channel_codes = sqlite_default_admin_channel_codes(pool).await?;
    let default_channel_endpoint_codes = sqlite_default_admin_channel_endpoint_codes(pool).await?;

    Ok(expected_resource_codes(&catalog).is_subset(&resource_codes)
        && expected_group_codes(&catalog).is_subset(&group_codes)
        && expected_endpoint_codes(&catalog).is_subset(&endpoint_codes)
        && expected_default_admin_channel_codes().is_subset(&default_channel_codes)
        && expected_default_admin_channel_endpoint_codes(&catalog)
            .is_subset(&default_channel_endpoint_codes)
        && sqlite_resource_group_item_count(pool, &catalog).await?
            >= expected_resource_group_item_count(&catalog))
}

pub(crate) async fn postgres_ai_routing_seed_complete(pool: &PgPool) -> Result<bool, sqlx::Error> {
    let catalog = AiRoutingSeedCatalog::load().map_err(json_decode_error)?;
    let resource_codes = postgres_string_set(
        pool,
        "SELECT resource_code FROM ai_resource WHERE tenant_id = 0 AND organization_id = 0 AND status = 1 AND deleted_at IS NULL",
    )
    .await?;
    let group_codes = postgres_string_set(
        pool,
        "SELECT group_code FROM ai_resource_group WHERE tenant_id = 0 AND organization_id = 0 AND status = 1 AND deleted_at IS NULL",
    )
    .await?;
    let endpoint_codes = postgres_string_set(
        pool,
        "SELECT endpoint_code FROM ai_api_endpoint WHERE tenant_id = 0 AND organization_id = 0 AND status = 1 AND deleted_at IS NULL",
    )
    .await?;
    let default_channel_codes = postgres_default_admin_channel_codes(pool).await?;
    let default_channel_endpoint_codes =
        postgres_default_admin_channel_endpoint_codes(pool).await?;

    Ok(expected_resource_codes(&catalog).is_subset(&resource_codes)
        && expected_group_codes(&catalog).is_subset(&group_codes)
        && expected_endpoint_codes(&catalog).is_subset(&endpoint_codes)
        && expected_default_admin_channel_codes().is_subset(&default_channel_codes)
        && expected_default_admin_channel_endpoint_codes(&catalog)
            .is_subset(&default_channel_endpoint_codes)
        && postgres_resource_group_item_count(pool, &catalog).await?
            >= expected_resource_group_item_count(&catalog))
}

async fn import_sqlite_api_endpoints(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    catalog: &AiRoutingSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in endpoint_definitions(catalog) {
        let path_template = item.path_template();
        sqlx::query(
            r#"
            INSERT INTO ai_api_endpoint
                (uuid, tenant_id, organization_id, data_scope, status, metadata, endpoint_code, protocol_code, display_name, method, path_template, request_schema, response_schema, streaming_supported, sort_order)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '{}', '{}', ?, ?)
            ON CONFLICT(tenant_id, organization_id, endpoint_code) DO UPDATE SET
                protocol_code = excluded.protocol_code,
                display_name = excluded.display_name,
                method = excluded.method,
                path_template = excluded.path_template,
                request_schema = excluded.request_schema,
                response_schema = excluded.response_schema,
                streaming_supported = excluded.streaming_supported,
                sort_order = excluded.sort_order,
                metadata = excluded.metadata,
                deleted_at = NULL,
                deleted_by = NULL,
                status = excluded.status
            "#,
        )
        .bind(stable_seed_uuid("sdk-ai-api-endpoint", &[item.api_code()]))
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(endpoint_metadata(catalog, &item))
        .bind(item.api_code())
        .bind(item.protocol_code())
        .bind(item.display_name())
        .bind(item.method())
        .bind(path_template)
        .bind(item.streaming_supported())
        .bind(item.sort_order())
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_postgres_api_endpoints(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    catalog: &AiRoutingSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in endpoint_definitions(catalog) {
        let path_template = item.path_template();
        sqlx::query(
            r#"
            INSERT INTO ai_api_endpoint
                (uuid, tenant_id, organization_id, data_scope, status, metadata, endpoint_code, protocol_code, display_name, method, path_template, request_schema, response_schema, streaming_supported, sort_order)
            VALUES
                ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, '{}'::jsonb, '{}'::jsonb, $12, $13)
            ON CONFLICT(tenant_id, organization_id, endpoint_code) DO UPDATE SET
                protocol_code = excluded.protocol_code,
                display_name = excluded.display_name,
                method = excluded.method,
                path_template = excluded.path_template,
                request_schema = excluded.request_schema,
                response_schema = excluded.response_schema,
                streaming_supported = excluded.streaming_supported,
                sort_order = excluded.sort_order,
                metadata = excluded.metadata,
                deleted_at = NULL,
                deleted_by = NULL,
                status = excluded.status
            "#,
        )
        .bind(stable_seed_uuid("sdk-ai-api-endpoint", &[item.api_code()]))
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(endpoint_metadata(catalog, &item))
        .bind(item.api_code())
        .bind(item.protocol_code())
        .bind(item.display_name())
        .bind(item.method())
        .bind(path_template)
        .bind(item.streaming_supported())
        .bind(item.sort_order())
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_sqlite_resources(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    catalog: &AiRoutingSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &catalog.resources {
        sqlx::query(resource_upsert_sqlite())
            .bind(stable_seed_uuid("sdk-ai-resource", &[&item.resource_code]))
            .bind(SYSTEM_TENANT_ID)
            .bind(SYSTEM_ORGANIZATION_ID)
            .bind(SYSTEM_DATA_SCOPE)
            .bind(ACTIVE_STATUS)
            .bind(seed_metadata(
                catalog,
                "resource",
                &item.resource_code,
                resource_metadata(item),
            ))
            .bind(&item.resource_code)
            .bind(&item.resource_type)
            .bind(&item.display_name)
            .bind(&item.vendor_code)
            .bind(&item.modality_code)
            .bind(&item.api_code)
            .bind(&item.catalog_key)
            .bind(&item.model)
            .bind(&item.provider_native_model)
            .bind(resource_schema(item))
            .bind(metadata_schema(item))
            .bind(resource_description(item))
            .bind(item.sort_order)
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

async fn import_postgres_resources(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    catalog: &AiRoutingSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &catalog.resources {
        sqlx::query(resource_upsert_postgres())
            .bind(stable_seed_uuid("sdk-ai-resource", &[&item.resource_code]))
            .bind(SYSTEM_TENANT_ID)
            .bind(SYSTEM_ORGANIZATION_ID)
            .bind(SYSTEM_DATA_SCOPE)
            .bind(ACTIVE_STATUS)
            .bind(seed_metadata(
                catalog,
                "resource",
                &item.resource_code,
                resource_metadata(item),
            ))
            .bind(&item.resource_code)
            .bind(&item.resource_type)
            .bind(&item.display_name)
            .bind(&item.vendor_code)
            .bind(&item.modality_code)
            .bind(&item.api_code)
            .bind(&item.catalog_key)
            .bind(&item.model)
            .bind(&item.provider_native_model)
            .bind(resource_schema(item))
            .bind(metadata_schema(item))
            .bind(resource_description(item))
            .bind(item.sort_order)
            .execute(&mut **tx)
            .await?;
    }
    Ok(())
}

async fn import_sqlite_resource_groups(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    catalog: &AiRoutingSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &catalog.resource_groups {
        sqlx::query(
            r#"
            INSERT INTO ai_resource_group
                (uuid, tenant_id, organization_id, data_scope, status, metadata, group_code, group_name, group_type, selection_mode, description, sort_order)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(tenant_id, organization_id, group_code) DO UPDATE SET
                group_name = excluded.group_name,
                group_type = excluded.group_type,
                selection_mode = excluded.selection_mode,
                description = excluded.description,
                sort_order = excluded.sort_order,
                metadata = excluded.metadata,
                deleted_at = NULL,
                deleted_by = NULL,
                status = excluded.status
            "#,
        )
        .bind(stable_seed_uuid("sdk-ai-resource-group", &[&item.group_code]))
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(seed_metadata(
            catalog,
            "resource_group",
            &item.group_code,
            serde_json::json!({
                "groupType": item.group_type,
                "selectionMode": item.selection_mode,
            }),
        ))
        .bind(&item.group_code)
        .bind(&item.group_name)
        .bind(&item.group_type)
        .bind(&item.selection_mode)
        .bind(&item.description)
        .bind(item.sort_order)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_postgres_resource_groups(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    catalog: &AiRoutingSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &catalog.resource_groups {
        sqlx::query(
            r#"
            INSERT INTO ai_resource_group
                (uuid, tenant_id, organization_id, data_scope, status, metadata, group_code, group_name, group_type, selection_mode, description, sort_order)
            VALUES
                ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12)
            ON CONFLICT(tenant_id, organization_id, group_code) DO UPDATE SET
                group_name = excluded.group_name,
                group_type = excluded.group_type,
                selection_mode = excluded.selection_mode,
                description = excluded.description,
                sort_order = excluded.sort_order,
                metadata = excluded.metadata,
                deleted_at = NULL,
                deleted_by = NULL,
                status = excluded.status
            "#,
        )
        .bind(stable_seed_uuid("sdk-ai-resource-group", &[&item.group_code]))
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(seed_metadata(
            catalog,
            "resource_group",
            &item.group_code,
            serde_json::json!({
                "groupType": item.group_type,
                "selectionMode": item.selection_mode,
            }),
        ))
        .bind(&item.group_code)
        .bind(&item.group_name)
        .bind(&item.group_type)
        .bind(&item.selection_mode)
        .bind(&item.description)
        .bind(item.sort_order)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_sqlite_resource_group_items(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    catalog: &AiRoutingSeedCatalog,
) -> Result<(), sqlx::Error> {
    let group_ids = sqlite_group_ids(tx).await?;
    for group in &catalog.resource_groups {
        let Some(group_id) = group_ids.get(group.group_code.as_str()).copied() else {
            continue;
        };
        for (index, item) in group.items.iter().enumerate() {
            let resource_code = resource_item_code(item);
            let child_group_code = child_group_item_code(item);
            sqlx::query(group_item_upsert_sqlite())
                .bind(stable_group_item_uuid(group, item))
                .bind(SYSTEM_TENANT_ID)
                .bind(SYSTEM_ORGANIZATION_ID)
                .bind(SYSTEM_DATA_SCOPE)
                .bind(ACTIVE_STATUS)
                .bind(seed_metadata(
                    catalog,
                    "resource_group_item",
                    &group.group_code,
                    serde_json::json!({
                        "resourceCode": resource_code,
                        "childResourceGroupCode": child_group_code,
                    }),
                ))
                .bind(group_id)
                .bind(&group.group_code)
                .bind(&item.item_type)
                .bind(resource_code)
                .bind(child_group_code)
                .bind("included")
                .bind((index as i32) + 1)
                .execute(&mut **tx)
                .await?;
        }
    }
    Ok(())
}

async fn import_postgres_resource_group_items(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    catalog: &AiRoutingSeedCatalog,
) -> Result<(), sqlx::Error> {
    let group_ids = postgres_group_ids(tx).await?;
    for group in &catalog.resource_groups {
        let Some(group_id) = group_ids.get(group.group_code.as_str()).copied() else {
            continue;
        };
        for (index, item) in group.items.iter().enumerate() {
            let resource_code = resource_item_code(item);
            let child_group_code = child_group_item_code(item);
            sqlx::query(group_item_upsert_postgres())
                .bind(stable_group_item_uuid(group, item))
                .bind(SYSTEM_TENANT_ID)
                .bind(SYSTEM_ORGANIZATION_ID)
                .bind(SYSTEM_DATA_SCOPE)
                .bind(ACTIVE_STATUS)
                .bind(seed_metadata(
                    catalog,
                    "resource_group_item",
                    &group.group_code,
                    serde_json::json!({
                        "resourceCode": resource_code,
                        "childResourceGroupCode": child_group_code,
                    }),
                ))
                .bind(group_id)
                .bind(&group.group_code)
                .bind(&item.item_type)
                .bind(resource_code)
                .bind(child_group_code)
                .bind("included")
                .bind((index as i32) + 1)
                .execute(&mut **tx)
                .await?;
        }
    }
    Ok(())
}

async fn import_sqlite_default_admin_channels(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    catalog: &AiRoutingSeedCatalog,
) -> Result<(), sqlx::Error> {
    for channel in default_admin_channels() {
        sqlx::query(
            r#"
            INSERT INTO ai_channel
                (uuid, tenant_id, organization_id, data_scope, status, metadata,
                 provider_code, channel_code, channel_name, channel_type, protocol_code,
                 auth_type, base_url, environment, priority, weight, health_status,
                 consecutive_error_count)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, 1, ?, ?, ?, 0)
            ON CONFLICT(tenant_id, organization_id, channel_code) DO UPDATE SET
                provider_code = excluded.provider_code,
                channel_type = excluded.channel_type,
                protocol_code = excluded.protocol_code,
                metadata = excluded.metadata,
                deleted_at = NULL,
                deleted_by = NULL
            "#,
        )
        .bind(stable_seed_uuid(
            "sdk-ai-channel",
            &[
                &DEFAULT_IAM_TENANT_ID.to_string(),
                &DEFAULT_IAM_ORGANIZATION_ID.to_string(),
                channel.channel_code,
            ],
        ))
        .bind(DEFAULT_IAM_TENANT_ID)
        .bind(DEFAULT_IAM_ORGANIZATION_ID)
        .bind(DEFAULT_ADMIN_DATA_SCOPE)
        .bind(DISABLED_STATUS)
        .bind(default_admin_channel_metadata(catalog, *channel))
        .bind(channel.provider_code)
        .bind(channel.channel_code)
        .bind(channel.channel_name)
        .bind(channel.channel_type)
        .bind(channel.protocol_code)
        .bind(channel.base_url)
        .bind(channel.priority)
        .bind(channel.weight)
        .bind(HEALTHY_STATUS)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_postgres_default_admin_channels(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    catalog: &AiRoutingSeedCatalog,
) -> Result<(), sqlx::Error> {
    for channel in default_admin_channels() {
        sqlx::query(
            r#"
            INSERT INTO ai_channel
                (uuid, tenant_id, organization_id, data_scope, status, metadata,
                 provider_code, channel_code, channel_name, channel_type, protocol_code,
                 auth_type, base_url, environment, priority, weight, health_status,
                 consecutive_error_count)
            VALUES
                ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, 1, $12, 1, $13, $14, $15, 0)
            ON CONFLICT(tenant_id, organization_id, channel_code) DO UPDATE SET
                provider_code = excluded.provider_code,
                channel_type = excluded.channel_type,
                protocol_code = excluded.protocol_code,
                metadata = excluded.metadata,
                deleted_at = NULL,
                deleted_by = NULL
            "#,
        )
        .bind(stable_seed_uuid(
            "sdk-ai-channel",
            &[
                &DEFAULT_IAM_TENANT_ID.to_string(),
                &DEFAULT_IAM_ORGANIZATION_ID.to_string(),
                channel.channel_code,
            ],
        ))
        .bind(DEFAULT_IAM_TENANT_ID)
        .bind(DEFAULT_IAM_ORGANIZATION_ID)
        .bind(DEFAULT_ADMIN_DATA_SCOPE)
        .bind(DISABLED_STATUS)
        .bind(default_admin_channel_metadata(catalog, *channel))
        .bind(channel.provider_code)
        .bind(channel.channel_code)
        .bind(channel.channel_name)
        .bind(channel.channel_type)
        .bind(channel.protocol_code)
        .bind(channel.base_url)
        .bind(channel.priority)
        .bind(channel.weight)
        .bind(HEALTHY_STATUS)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_sqlite_default_admin_channel_endpoints(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    catalog: &AiRoutingSeedCatalog,
) -> Result<(), sqlx::Error> {
    let channel = default_openai_admin_channel();
    for endpoint in default_admin_channel_endpoint_definitions(catalog) {
        let result = sqlx::query(
            r#"
            INSERT INTO ai_channel_endpoint
                (uuid, tenant_id, organization_id, data_scope, status, metadata,
                 channel_id, provider_code, channel_code, channel_type, vendor_id, vendor_code,
                 region_code, api_endpoint_id, api_code, base_url, priority, weight, timeout_ms,
                 health_status)
            SELECT
                ?, c.tenant_id, c.organization_id, ?, ?, ?,
                c.id, c.provider_code, c.channel_code, c.channel_type,
                (
                    SELECT v.id
                    FROM ai_model_vendor v
                    WHERE (v.tenant_id = ? OR v.tenant_id = 0)
                      AND (v.organization_id = ? OR v.organization_id = 0)
                      AND v.vendor_code = ?
                      AND v.deleted_at IS NULL
                    ORDER BY CASE WHEN v.tenant_id = ? AND v.organization_id = ? THEN 0 ELSE 1 END,
                             v.id ASC
                    LIMIT 1
                ),
                ?,
                ?,
                (
                    SELECT e.id
                    FROM ai_api_endpoint e
                    WHERE (e.tenant_id = ? OR e.tenant_id = 0)
                      AND (e.organization_id = ? OR e.organization_id = 0)
                      AND e.endpoint_code = ?
                      AND e.deleted_at IS NULL
                    ORDER BY CASE WHEN e.tenant_id = ? AND e.organization_id = ? THEN 0 ELSE 1 END,
                             e.id ASC
                    LIMIT 1
                ),
                ?, ?, ?, ?, ?, ?
            FROM ai_channel c
            WHERE c.tenant_id = ?
              AND c.organization_id = ?
              AND c.channel_code = ?
              AND c.deleted_at IS NULL
              AND EXISTS (
                  SELECT 1
                  FROM ai_model_vendor v
                  WHERE (v.tenant_id = ? OR v.tenant_id = 0)
                    AND (v.organization_id = ? OR v.organization_id = 0)
                    AND v.vendor_code = ?
                    AND v.deleted_at IS NULL
              )
              AND EXISTS (
                  SELECT 1
                  FROM ai_api_endpoint e
                  WHERE (e.tenant_id = ? OR e.tenant_id = 0)
                    AND (e.organization_id = ? OR e.organization_id = 0)
                    AND e.endpoint_code = ?
                    AND e.deleted_at IS NULL
              )
            ON CONFLICT(tenant_id, organization_id, channel_id, vendor_code, region_code, api_code)
            DO UPDATE SET
                provider_code = excluded.provider_code,
                channel_code = excluded.channel_code,
                channel_type = excluded.channel_type,
                vendor_id = excluded.vendor_id,
                api_endpoint_id = excluded.api_endpoint_id,
                timeout_ms = excluded.timeout_ms,
                metadata = excluded.metadata,
                deleted_at = NULL,
                deleted_by = NULL
            "#,
        )
        .bind(stable_seed_uuid(
            "sdk-ai-channel-endpoint",
            &[
                &DEFAULT_IAM_TENANT_ID.to_string(),
                &DEFAULT_IAM_ORGANIZATION_ID.to_string(),
                channel.channel_code,
                endpoint.api_code(),
            ],
        ))
        .bind(DEFAULT_ADMIN_DATA_SCOPE)
        .bind(DISABLED_STATUS)
        .bind(default_admin_channel_endpoint_metadata(
            catalog, channel, &endpoint,
        ))
        .bind(DEFAULT_IAM_TENANT_ID)
        .bind(DEFAULT_IAM_ORGANIZATION_ID)
        .bind(channel.provider_code)
        .bind(DEFAULT_IAM_TENANT_ID)
        .bind(DEFAULT_IAM_ORGANIZATION_ID)
        .bind(channel.provider_code)
        .bind(DEFAULT_ADMIN_REGION_CODE)
        .bind(DEFAULT_IAM_TENANT_ID)
        .bind(DEFAULT_IAM_ORGANIZATION_ID)
        .bind(endpoint.api_code())
        .bind(DEFAULT_IAM_TENANT_ID)
        .bind(DEFAULT_IAM_ORGANIZATION_ID)
        .bind(endpoint.api_code())
        .bind(channel.endpoint_base_url())
        .bind(endpoint.sort_order())
        .bind(channel.weight)
        .bind(endpoint.template.map(|template| template.timeout_ms))
        .bind(HEALTHY_STATUS)
        .bind(DEFAULT_IAM_TENANT_ID)
        .bind(DEFAULT_IAM_ORGANIZATION_ID)
        .bind(channel.channel_code)
        .bind(DEFAULT_IAM_TENANT_ID)
        .bind(DEFAULT_IAM_ORGANIZATION_ID)
        .bind(channel.provider_code)
        .bind(DEFAULT_IAM_TENANT_ID)
        .bind(DEFAULT_IAM_ORGANIZATION_ID)
        .bind(endpoint.api_code())
        .execute(&mut **tx)
        .await?;
        if result.rows_affected() == 0 {
            return Err(sqlx::Error::RowNotFound);
        }
    }
    Ok(())
}

async fn import_postgres_default_admin_channel_endpoints(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    catalog: &AiRoutingSeedCatalog,
) -> Result<(), sqlx::Error> {
    let channel = default_openai_admin_channel();
    for endpoint in default_admin_channel_endpoint_definitions(catalog) {
        let result = sqlx::query(
            r#"
            INSERT INTO ai_channel_endpoint
                (uuid, tenant_id, organization_id, data_scope, status, metadata,
                 channel_id, provider_code, channel_code, channel_type, vendor_id, vendor_code,
                 region_code, api_endpoint_id, api_code, base_url, priority, weight, timeout_ms,
                 health_status)
            SELECT
                $1, c.tenant_id, c.organization_id, $2, $3, $4::jsonb,
                c.id, c.provider_code, c.channel_code, c.channel_type,
                (
                    SELECT v.id
                    FROM ai_model_vendor v
                    WHERE (v.tenant_id = $5 OR v.tenant_id = 0)
                      AND (v.organization_id = $6 OR v.organization_id = 0)
                      AND v.vendor_code = $7
                      AND v.deleted_at IS NULL
                    ORDER BY CASE WHEN v.tenant_id = $8 AND v.organization_id = $9 THEN 0 ELSE 1 END,
                             v.id ASC
                    LIMIT 1
                ),
                $10,
                $11,
                (
                    SELECT e.id
                    FROM ai_api_endpoint e
                    WHERE (e.tenant_id = $12 OR e.tenant_id = 0)
                      AND (e.organization_id = $13 OR e.organization_id = 0)
                      AND e.endpoint_code = $14
                      AND e.deleted_at IS NULL
                    ORDER BY CASE WHEN e.tenant_id = $15 AND e.organization_id = $16 THEN 0 ELSE 1 END,
                             e.id ASC
                    LIMIT 1
                ),
                $17, $18, $19, $20, $21, $22
            FROM ai_channel c
            WHERE c.tenant_id = $23
              AND c.organization_id = $24
              AND c.channel_code = $25
              AND c.deleted_at IS NULL
              AND EXISTS (
                  SELECT 1
                  FROM ai_model_vendor v
                  WHERE (v.tenant_id = $26 OR v.tenant_id = 0)
                    AND (v.organization_id = $27 OR v.organization_id = 0)
                    AND v.vendor_code = $28
                    AND v.deleted_at IS NULL
              )
              AND EXISTS (
                  SELECT 1
                  FROM ai_api_endpoint e
                  WHERE (e.tenant_id = $29 OR e.tenant_id = 0)
                    AND (e.organization_id = $30 OR e.organization_id = 0)
                    AND e.endpoint_code = $31
                    AND e.deleted_at IS NULL
              )
            ON CONFLICT(tenant_id, organization_id, channel_id, vendor_code, region_code, api_code)
            DO UPDATE SET
                provider_code = excluded.provider_code,
                channel_code = excluded.channel_code,
                channel_type = excluded.channel_type,
                vendor_id = excluded.vendor_id,
                api_endpoint_id = excluded.api_endpoint_id,
                timeout_ms = excluded.timeout_ms,
                metadata = excluded.metadata,
                deleted_at = NULL,
                deleted_by = NULL
            "#,
        )
        .bind(stable_seed_uuid(
            "sdk-ai-channel-endpoint",
            &[
                &DEFAULT_IAM_TENANT_ID.to_string(),
                &DEFAULT_IAM_ORGANIZATION_ID.to_string(),
                channel.channel_code,
                endpoint.api_code(),
            ],
        ))
        .bind(DEFAULT_ADMIN_DATA_SCOPE)
        .bind(DISABLED_STATUS)
        .bind(default_admin_channel_endpoint_metadata(
            catalog,
            channel,
            &endpoint,
        ))
        .bind(DEFAULT_IAM_TENANT_ID)
        .bind(DEFAULT_IAM_ORGANIZATION_ID)
        .bind(channel.provider_code)
        .bind(DEFAULT_IAM_TENANT_ID)
        .bind(DEFAULT_IAM_ORGANIZATION_ID)
        .bind(channel.provider_code)
        .bind(DEFAULT_ADMIN_REGION_CODE)
        .bind(DEFAULT_IAM_TENANT_ID)
        .bind(DEFAULT_IAM_ORGANIZATION_ID)
        .bind(endpoint.api_code())
        .bind(DEFAULT_IAM_TENANT_ID)
        .bind(DEFAULT_IAM_ORGANIZATION_ID)
        .bind(endpoint.api_code())
        .bind(channel.endpoint_base_url())
        .bind(endpoint.sort_order())
        .bind(channel.weight)
        .bind(endpoint.template.map(|template| template.timeout_ms))
        .bind(HEALTHY_STATUS)
        .bind(DEFAULT_IAM_TENANT_ID)
        .bind(DEFAULT_IAM_ORGANIZATION_ID)
        .bind(channel.channel_code)
        .bind(DEFAULT_IAM_TENANT_ID)
        .bind(DEFAULT_IAM_ORGANIZATION_ID)
        .bind(channel.provider_code)
        .bind(DEFAULT_IAM_TENANT_ID)
        .bind(DEFAULT_IAM_ORGANIZATION_ID)
        .bind(endpoint.api_code())
        .execute(&mut **tx)
        .await?;
        if result.rows_affected() == 0 {
            return Err(sqlx::Error::RowNotFound);
        }
    }
    Ok(())
}

fn resource_bundles() -> Result<Vec<ResourceBundle>, AiRoutingSeedLoadError> {
    [
        CORE_RESOURCES_JSON,
        OPENAI_RESOURCES_JSON,
        VENDOR_NATIVE_RESOURCES_JSON,
    ]
    .into_iter()
    .map(|payload| {
        let bundle = serde_json::from_str::<ResourceBundle>(payload)?;
        validate_bundle_kind(&bundle.kind, "ai-routing.resources")?;
        Ok(bundle)
    })
    .collect()
}

fn resource_group_bundles() -> Result<Vec<ResourceGroupBundle>, AiRoutingSeedLoadError> {
    [OFFICIAL_PROVIDER_GROUPS_JSON, RELAY_PROVIDER_GROUPS_JSON]
        .into_iter()
        .map(|payload| {
            let bundle = serde_json::from_str::<ResourceGroupBundle>(payload)?;
            validate_bundle_kind(&bundle.kind, "ai-routing.resource-groups")?;
            Ok(bundle)
        })
        .collect()
}

fn channel_endpoint_template_bundles(
) -> Result<Vec<ChannelEndpointTemplateBundle>, AiRoutingSeedLoadError> {
    [
        OPENAI_COMPATIBLE_TEMPLATES_JSON,
        VENDOR_NATIVE_TEMPLATES_JSON,
    ]
    .into_iter()
    .map(|payload| {
        let bundle = serde_json::from_str::<ChannelEndpointTemplateBundle>(payload)?;
        validate_bundle_kind(&bundle.kind, "ai-routing.channel-endpoint-templates")?;
        Ok(bundle)
    })
    .collect()
}

fn validate_catalog(catalog: &AiRoutingSeedCatalog) -> Result<(), AiRoutingSeedLoadError> {
    if catalog.manifest.catalog_code != "sdkwork-ai-routing"
        || catalog.manifest.schema_version != "ai-routing-seed.v1"
        || catalog.manifest.source != "bundled"
    {
        return Err(AiRoutingSeedLoadError::Validation(
            "invalid AI routing seed manifest identity".to_owned(),
        ));
    }
    validate_manifest_files(catalog)?;
    let resource_codes = validate_unique(
        catalog
            .resources
            .iter()
            .map(|item| item.resource_code.as_str()),
        "AI routing resource code",
    )?;
    let group_codes = validate_unique(
        catalog
            .resource_groups
            .iter()
            .map(|item| item.group_code.as_str()),
        "AI routing resource group code",
    )?;
    validate_unique(
        catalog
            .channel_endpoint_templates
            .iter()
            .map(|item| item.template_code.as_str()),
        "AI routing channel endpoint template code",
    )?;
    let template_api_codes = validate_unique(
        catalog
            .channel_endpoint_templates
            .iter()
            .map(|item| item.api_code.as_str()),
        "AI routing channel endpoint template API code",
    )?;
    for resource in &catalog.resources {
        if resource.resource_code.trim().is_empty()
            || resource.resource_type.trim().is_empty()
            || resource.display_name.trim().is_empty()
            || resource.capability.trim().is_empty()
            || resource.capabilities.is_empty()
        {
            return Err(AiRoutingSeedLoadError::Validation(format!(
                "invalid AI routing resource `{}`",
                resource.resource_code
            )));
        }
        if resource.resource_type == "api_endpoint" {
            let api_code = resource.api_code.as_deref().unwrap_or_default();
            if api_code.trim().is_empty() {
                return Err(AiRoutingSeedLoadError::Validation(format!(
                    "AI routing API endpoint resource `{}` must define apiCode",
                    resource.resource_code
                )));
            }
            if !template_api_codes.contains(api_code) {
                return Err(AiRoutingSeedLoadError::Validation(format!(
                    "AI routing API endpoint resource `{}` has no endpoint template for apiCode `{api_code}`",
                    resource.resource_code
                )));
            }
        }
    }
    for group in &catalog.resource_groups {
        if group.items.is_empty() {
            return Err(AiRoutingSeedLoadError::Validation(format!(
                "AI routing resource group `{}` must not be empty",
                group.group_code
            )));
        }
        for item in &group.items {
            match item.item_type.as_str() {
                "resource" => {
                    let code = item.resource_code.as_deref().unwrap_or_default();
                    if !resource_codes.contains(code) {
                        return Err(AiRoutingSeedLoadError::Validation(format!(
                            "AI routing resource group `{}` references unknown resource `{code}`",
                            group.group_code
                        )));
                    }
                }
                "group" => {
                    let code = item.group_code.as_deref().unwrap_or_default();
                    if !group_codes.contains(code) {
                        return Err(AiRoutingSeedLoadError::Validation(format!(
                            "AI routing resource group `{}` references unknown group `{code}`",
                            group.group_code
                        )));
                    }
                }
                _ => {
                    return Err(AiRoutingSeedLoadError::Validation(format!(
                        "AI routing resource group `{}` contains unsupported item type `{}`",
                        group.group_code, item.item_type
                    )));
                }
            }
        }
    }
    Ok(())
}

fn validate_manifest_files(catalog: &AiRoutingSeedCatalog) -> Result<(), AiRoutingSeedLoadError> {
    if catalog.manifest.sections.resources
        != [
            "core-resources.json",
            "openai-resources.json",
            "vendor-native-resources.json",
        ]
    {
        return Err(AiRoutingSeedLoadError::Validation(
            "AI routing resources manifest section is out of sync".to_owned(),
        ));
    }
    if catalog.manifest.sections.resource_groups
        != [
            "official-provider-groups.json",
            "relay-provider-groups.json",
        ]
    {
        return Err(AiRoutingSeedLoadError::Validation(
            "AI routing resource groups manifest section is out of sync".to_owned(),
        ));
    }
    if catalog.manifest.sections.channel_endpoint_templates
        != [
            "openai-compatible-templates.json",
            "vendor-native-templates.json",
        ]
    {
        return Err(AiRoutingSeedLoadError::Validation(
            "AI routing channel endpoint templates manifest section is out of sync".to_owned(),
        ));
    }
    Ok(())
}

fn validate_unique<'a, I>(
    values: I,
    label: &str,
) -> Result<BTreeSet<&'a str>, AiRoutingSeedLoadError>
where
    I: IntoIterator<Item = &'a str>,
{
    let mut set = BTreeSet::new();
    for value in values {
        if value.trim().is_empty() || !set.insert(value) {
            return Err(AiRoutingSeedLoadError::Validation(format!(
                "{label} must be unique and non-empty"
            )));
        }
    }
    Ok(set)
}

fn validate_bundle_kind(kind: &str, expected: &str) -> Result<(), AiRoutingSeedLoadError> {
    if kind == expected {
        return Ok(());
    }
    Err(AiRoutingSeedLoadError::Validation(format!(
        "AI routing seed bundle kind `{kind}` must be `{expected}`"
    )))
}

fn api_endpoint_resources(catalog: &AiRoutingSeedCatalog) -> Vec<&ResourceSeed> {
    catalog
        .resources
        .iter()
        .filter(|resource| resource.resource_type == "api_endpoint")
        .collect()
}

fn endpoint_definitions(catalog: &AiRoutingSeedCatalog) -> Vec<EndpointSeedDefinition<'_>> {
    let templates_by_api_code = catalog
        .channel_endpoint_templates
        .iter()
        .map(|template| (template.api_code.as_str(), template))
        .collect::<BTreeMap<_, _>>();

    api_endpoint_resources(catalog)
        .into_iter()
        .map(|resource| EndpointSeedDefinition {
            resource,
            template: resource
                .api_code
                .as_deref()
                .and_then(|api_code| templates_by_api_code.get(api_code).copied()),
        })
        .collect()
}

fn default_admin_channel_endpoint_definitions(
    catalog: &AiRoutingSeedCatalog,
) -> Vec<EndpointSeedDefinition<'_>> {
    endpoint_definitions(catalog)
        .into_iter()
        .filter(|definition| {
            !definition.api_code().is_empty()
                && definition
                    .resource
                    .vendor_code
                    .as_deref()
                    .is_some_and(|vendor_code| {
                        vendor_code == default_openai_admin_channel().provider_code
                    })
        })
        .collect()
}

fn default_admin_channels() -> &'static [DefaultAdminChannelSeed] {
    &DEFAULT_ADMIN_CHANNELS
}

fn default_openai_admin_channel() -> DefaultAdminChannelSeed {
    DEFAULT_ADMIN_CHANNELS[0]
}

fn resource_upsert_sqlite() -> &'static str {
    r#"
    INSERT INTO ai_resource
        (uuid, tenant_id, organization_id, data_scope, status, metadata, resource_code, resource_type, display_name, vendor_code, modality_code, api_code, catalog_key, model, provider_native_model, resource_schema, metadata_schema, description, sort_order)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(tenant_id, organization_id, resource_code) DO UPDATE SET
        resource_type = excluded.resource_type,
        display_name = excluded.display_name,
        vendor_code = excluded.vendor_code,
        modality_code = excluded.modality_code,
        api_code = excluded.api_code,
        catalog_key = excluded.catalog_key,
        model = excluded.model,
        provider_native_model = excluded.provider_native_model,
        resource_schema = excluded.resource_schema,
        metadata_schema = excluded.metadata_schema,
        description = excluded.description,
        sort_order = excluded.sort_order,
        metadata = excluded.metadata,
        deleted_at = NULL,
        deleted_by = NULL,
        status = excluded.status
    "#
}

fn resource_upsert_postgres() -> &'static str {
    r#"
    INSERT INTO ai_resource
        (uuid, tenant_id, organization_id, data_scope, status, metadata, resource_code, resource_type, display_name, vendor_code, modality_code, api_code, catalog_key, model, provider_native_model, resource_schema, metadata_schema, description, sort_order)
    VALUES
        ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16::jsonb, $17::jsonb, $18, $19)
    ON CONFLICT(tenant_id, organization_id, resource_code) DO UPDATE SET
        resource_type = excluded.resource_type,
        display_name = excluded.display_name,
        vendor_code = excluded.vendor_code,
        modality_code = excluded.modality_code,
        api_code = excluded.api_code,
        catalog_key = excluded.catalog_key,
        model = excluded.model,
        provider_native_model = excluded.provider_native_model,
        resource_schema = excluded.resource_schema,
        metadata_schema = excluded.metadata_schema,
        description = excluded.description,
        sort_order = excluded.sort_order,
        metadata = excluded.metadata,
        deleted_at = NULL,
        deleted_by = NULL,
        status = excluded.status
    "#
}

fn group_item_upsert_sqlite() -> &'static str {
    r#"
    INSERT INTO ai_resource_group_item
        (uuid, tenant_id, organization_id, data_scope, status, metadata, resource_group_id, resource_group_code, item_type, resource_code, child_resource_group_code, item_role, sort_order)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(tenant_id, organization_id, resource_group_id, item_type, resource_code, child_resource_group_code) DO UPDATE SET
        resource_group_code = excluded.resource_group_code,
        item_role = excluded.item_role,
        sort_order = excluded.sort_order,
        metadata = excluded.metadata,
        deleted_at = NULL,
        deleted_by = NULL,
        status = excluded.status
    "#
}

fn group_item_upsert_postgres() -> &'static str {
    r#"
    INSERT INTO ai_resource_group_item
        (uuid, tenant_id, organization_id, data_scope, status, metadata, resource_group_id, resource_group_code, item_type, resource_code, child_resource_group_code, item_role, sort_order)
    VALUES
        ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13)
    ON CONFLICT(tenant_id, organization_id, resource_group_id, item_type, resource_code, child_resource_group_code) DO UPDATE SET
        resource_group_code = excluded.resource_group_code,
        item_role = excluded.item_role,
        sort_order = excluded.sort_order,
        metadata = excluded.metadata,
        deleted_at = NULL,
        deleted_by = NULL,
        status = excluded.status
    "#
}

async fn sqlite_group_ids(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
) -> Result<BTreeMap<String, i64>, sqlx::Error> {
    let rows = sqlx::query(
        "SELECT id, group_code FROM ai_resource_group WHERE tenant_id = 0 AND organization_id = 0",
    )
    .fetch_all(&mut **tx)
    .await?;
    Ok(rows
        .into_iter()
        .map(|row| (row.get::<String, _>("group_code"), row.get::<i64, _>("id")))
        .collect())
}

async fn postgres_group_ids(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
) -> Result<BTreeMap<String, i64>, sqlx::Error> {
    let rows = sqlx::query(
        "SELECT id, group_code FROM ai_resource_group WHERE tenant_id = 0 AND organization_id = 0",
    )
    .fetch_all(&mut **tx)
    .await?;
    Ok(rows
        .into_iter()
        .map(|row| (row.get::<String, _>("group_code"), row.get::<i64, _>("id")))
        .collect())
}

fn expected_resource_codes(catalog: &AiRoutingSeedCatalog) -> BTreeSet<String> {
    catalog
        .resources
        .iter()
        .map(|item| item.resource_code.clone())
        .collect()
}

fn expected_group_codes(catalog: &AiRoutingSeedCatalog) -> BTreeSet<String> {
    catalog
        .resource_groups
        .iter()
        .map(|item| item.group_code.clone())
        .collect()
}

fn expected_endpoint_codes(catalog: &AiRoutingSeedCatalog) -> BTreeSet<String> {
    api_endpoint_resources(catalog)
        .into_iter()
        .filter_map(|item| item.api_code.clone())
        .collect()
}

fn expected_default_admin_channel_codes() -> BTreeSet<String> {
    default_admin_channels()
        .iter()
        .map(|channel| channel.channel_code.to_owned())
        .collect()
}

fn expected_default_admin_channel_endpoint_codes(
    catalog: &AiRoutingSeedCatalog,
) -> BTreeSet<String> {
    default_admin_channel_endpoint_definitions(catalog)
        .into_iter()
        .map(|item| item.api_code().to_owned())
        .collect()
}

fn expected_resource_group_item_count(catalog: &AiRoutingSeedCatalog) -> i64 {
    catalog
        .resource_groups
        .iter()
        .map(|group| group.items.len() as i64)
        .sum()
}

async fn sqlite_resource_group_item_count(
    pool: &SqlitePool,
    catalog: &AiRoutingSeedCatalog,
) -> Result<i64, sqlx::Error> {
    let rows = sqlx::query(
        "SELECT metadata FROM ai_resource_group_item WHERE tenant_id = 0 AND organization_id = 0 AND status = 1 AND deleted_at IS NULL",
    )
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .filter(|row| {
            row.try_get::<String, _>("metadata")
                .ok()
                .and_then(|value| serde_json::from_str::<Value>(&value).ok())
                .and_then(|value| {
                    value
                        .get("catalogCode")
                        .and_then(Value::as_str)
                        .map(str::to_owned)
                })
                .is_some_and(|catalog_code| catalog_code == catalog.manifest.catalog_code)
        })
        .count() as i64)
}

async fn postgres_resource_group_item_count(
    pool: &PgPool,
    catalog: &AiRoutingSeedCatalog,
) -> Result<i64, sqlx::Error> {
    let row = sqlx::query(
        r#"
        SELECT COUNT(1) AS count
        FROM ai_resource_group_item
        WHERE tenant_id = 0
          AND organization_id = 0
          AND status = 1
          AND deleted_at IS NULL
          AND metadata ->> 'catalogCode' = $1
        "#,
    )
    .bind(&catalog.manifest.catalog_code)
    .fetch_one(pool)
    .await?;
    Ok(row.get::<i64, _>("count"))
}

async fn sqlite_string_set(
    pool: &SqlitePool,
    query: &str,
) -> Result<BTreeSet<String>, sqlx::Error> {
    let rows = sqlx::query(query).fetch_all(pool).await?;
    Ok(rows
        .into_iter()
        .filter_map(|row| row.try_get::<String, _>(0).ok())
        .collect())
}

async fn postgres_string_set(pool: &PgPool, query: &str) -> Result<BTreeSet<String>, sqlx::Error> {
    let rows = sqlx::query(query).fetch_all(pool).await?;
    Ok(rows
        .into_iter()
        .filter_map(|row| row.try_get::<String, _>(0).ok())
        .collect())
}

async fn sqlite_default_admin_channel_codes(
    pool: &SqlitePool,
) -> Result<BTreeSet<String>, sqlx::Error> {
    let rows = sqlx::query(
        r#"
        SELECT channel_code
        FROM ai_channel
        WHERE tenant_id = ?
          AND organization_id = ?
          AND deleted_at IS NULL
        "#,
    )
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(DEFAULT_IAM_ORGANIZATION_ID)
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .filter_map(|row| row.try_get::<String, _>(0).ok())
        .collect())
}

async fn sqlite_default_admin_channel_endpoint_codes(
    pool: &SqlitePool,
) -> Result<BTreeSet<String>, sqlx::Error> {
    let channel = default_openai_admin_channel();
    let rows = sqlx::query(
        r#"
        SELECT e.api_code
        FROM ai_channel_endpoint e
        INNER JOIN ai_channel c
          ON c.id = e.channel_id
         AND c.tenant_id = e.tenant_id
         AND c.organization_id = e.organization_id
        WHERE e.tenant_id = ?
          AND e.organization_id = ?
          AND e.vendor_code = ?
          AND e.region_code = ?
          AND e.deleted_at IS NULL
          AND c.channel_code = ?
          AND c.deleted_at IS NULL
        "#,
    )
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(DEFAULT_IAM_ORGANIZATION_ID)
    .bind(channel.provider_code)
    .bind(DEFAULT_ADMIN_REGION_CODE)
    .bind(channel.channel_code)
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .filter_map(|row| row.try_get::<String, _>(0).ok())
        .collect())
}

async fn postgres_default_admin_channel_codes(
    pool: &PgPool,
) -> Result<BTreeSet<String>, sqlx::Error> {
    let rows = sqlx::query(
        r#"
        SELECT channel_code
        FROM ai_channel
        WHERE tenant_id = $1
          AND organization_id = $2
          AND deleted_at IS NULL
        "#,
    )
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(DEFAULT_IAM_ORGANIZATION_ID)
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .filter_map(|row| row.try_get::<String, _>(0).ok())
        .collect())
}

async fn postgres_default_admin_channel_endpoint_codes(
    pool: &PgPool,
) -> Result<BTreeSet<String>, sqlx::Error> {
    let channel = default_openai_admin_channel();
    let rows = sqlx::query(
        r#"
        SELECT e.api_code
        FROM ai_channel_endpoint e
        INNER JOIN ai_channel c
          ON c.id = e.channel_id
         AND c.tenant_id = e.tenant_id
         AND c.organization_id = e.organization_id
        WHERE e.tenant_id = $1
          AND e.organization_id = $2
          AND e.vendor_code = $3
          AND e.region_code = $4
          AND e.deleted_at IS NULL
          AND c.channel_code = $5
          AND c.deleted_at IS NULL
        "#,
    )
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(DEFAULT_IAM_ORGANIZATION_ID)
    .bind(channel.provider_code)
    .bind(DEFAULT_ADMIN_REGION_CODE)
    .bind(channel.channel_code)
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .filter_map(|row| row.try_get::<String, _>(0).ok())
        .collect())
}

fn resource_item_code(item: &ResourceGroupItemSeed) -> &str {
    if item.item_type == "resource" {
        item.resource_code.as_deref().unwrap_or("")
    } else {
        ""
    }
}

fn child_group_item_code(item: &ResourceGroupItemSeed) -> &str {
    if item.item_type == "group" {
        item.group_code.as_deref().unwrap_or("")
    } else {
        ""
    }
}

fn resource_metadata(item: &ResourceSeed) -> Value {
    serde_json::json!({
        "capability": item.capability,
        "capabilities": item.capabilities,
    })
}

fn resource_schema(item: &ResourceSeed) -> String {
    serde_json::json!({
        "compositionMode": match item.resource_type.as_str() {
            "bundle" => "all",
            _ => "single",
        },
        "capabilities": item.capabilities,
    })
    .to_string()
}

fn metadata_schema(item: &ResourceSeed) -> String {
    serde_json::json!({
        "capability": item.capability,
        "capabilities": item.capabilities,
    })
    .to_string()
}

fn resource_description(item: &ResourceSeed) -> String {
    format!("Bundled AI routing {} resource", item.display_name)
}

fn endpoint_metadata(catalog: &AiRoutingSeedCatalog, item: &EndpointSeedDefinition<'_>) -> String {
    let template_metadata = item.template.map(|template| {
        serde_json::json!({
            "templateCode": &template.template_code,
            "vendorCode": &template.vendor_code,
            "capability": &template.capability,
            "capabilities": &template.capabilities,
            "timeoutMs": template.timeout_ms,
        })
    });
    seed_metadata(
        catalog,
        "api_endpoint",
        item.api_code(),
        serde_json::json!({
            "resourceCode": &item.resource.resource_code,
            "vendorCode": &item.resource.vendor_code,
            "modalityCode": &item.resource.modality_code,
            "capability": &item.resource.capability,
            "capabilities": &item.resource.capabilities,
            "template": template_metadata,
        }),
    )
}

fn default_admin_channel_metadata(
    catalog: &AiRoutingSeedCatalog,
    channel: DefaultAdminChannelSeed,
) -> String {
    seed_metadata(
        catalog,
        "default_admin_channel",
        channel.channel_code,
        serde_json::json!({
            "tenantId": DEFAULT_IAM_TENANT_ID,
            "organizationId": DEFAULT_IAM_ORGANIZATION_ID,
            "providerCode": channel.provider_code,
            "channelType": channel.channel_type,
            "protocolCode": channel.protocol_code,
            "baseUrl": channel.base_url,
            "initialStatus": "disabled",
        }),
    )
}

fn default_admin_channel_endpoint_metadata(
    catalog: &AiRoutingSeedCatalog,
    channel: DefaultAdminChannelSeed,
    item: &EndpointSeedDefinition<'_>,
) -> String {
    let template_metadata = item.template.map(|template| {
        serde_json::json!({
            "templateCode": &template.template_code,
            "pathTemplate": &template.path_template,
            "timeoutMs": template.timeout_ms,
        })
    });
    seed_metadata(
        catalog,
        "default_admin_channel_endpoint",
        item.api_code(),
        serde_json::json!({
            "tenantId": DEFAULT_IAM_TENANT_ID,
            "organizationId": DEFAULT_IAM_ORGANIZATION_ID,
            "channelCode": channel.channel_code,
            "providerCode": channel.provider_code,
            "channelType": channel.channel_type,
            "vendorCode": channel.provider_code,
            "regionCode": DEFAULT_ADMIN_REGION_CODE,
            "apiCode": item.api_code(),
            "baseUrl": channel.endpoint_base_url(),
            "initialStatus": "disabled",
            "resourceCode": &item.resource.resource_code,
            "template": template_metadata,
        }),
    )
}

fn default_protocol_code(item: &ResourceSeed) -> &'static str {
    match item.vendor_code.as_deref().unwrap_or_default() {
        "openai" | "openai_compatible" => "openai_compatible",
        _ => "vendor_native",
    }
}

fn default_path_template(api_code: &str) -> String {
    format!("/v1/{}", api_code.trim().replace('.', "/"))
}

fn seed_metadata(
    catalog: &AiRoutingSeedCatalog,
    item_type: &str,
    item_code: &str,
    extra: Value,
) -> String {
    serde_json::json!({
        "catalogCode": catalog.manifest.catalog_code,
        "schemaVersion": catalog.manifest.schema_version,
        "source": catalog.manifest.source,
        "itemType": item_type,
        "itemCode": item_code,
        "sourceHash": source_hash(),
        "extra": extra,
    })
    .to_string()
}

fn stable_group_item_uuid(group: &ResourceGroupSeed, item: &ResourceGroupItemSeed) -> String {
    stable_seed_uuid(
        "sdk-ai-resource-group-item",
        &[
            &group.group_code,
            &item.item_type,
            item.resource_code.as_deref().unwrap_or_default(),
            item.group_code.as_deref().unwrap_or_default(),
        ],
    )
}

fn stable_seed_uuid(prefix: &str, parts: &[&str]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(prefix.as_bytes());
    for part in parts {
        hasher.update([0]);
        hasher.update(part.as_bytes());
    }
    let digest = hasher.finalize();
    format!("{prefix}-{}", hex::encode(&digest[..20]))
}

fn source_hash() -> String {
    let mut hasher = Sha256::new();
    for payload in [
        MANIFEST_JSON,
        CORE_RESOURCES_JSON,
        OPENAI_RESOURCES_JSON,
        VENDOR_NATIVE_RESOURCES_JSON,
        OFFICIAL_PROVIDER_GROUPS_JSON,
        RELAY_PROVIDER_GROUPS_JSON,
        OPENAI_COMPATIBLE_TEMPLATES_JSON,
        VENDOR_NATIVE_TEMPLATES_JSON,
        DEFAULT_ADMIN_CHANNEL_SEED_SOURCE,
    ] {
        hasher.update(payload.as_bytes());
        hasher.update([0]);
    }
    hex::encode(hasher.finalize())
}

fn json_decode_error(error: AiRoutingSeedLoadError) -> sqlx::Error {
    sqlx::Error::Protocol(format!("invalid bundled AI routing seed data: {error}"))
}
