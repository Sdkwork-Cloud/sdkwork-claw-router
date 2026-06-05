use std::collections::{BTreeMap, BTreeSet};
use std::fmt::{Display, Formatter};

use serde::Deserialize;
use serde_json::Value;
use sha2::{Digest, Sha256};
use sqlx::{PgPool, Row, SqlitePool};

use crate::infrastructure::sql::sql_admin_product_center::{
    media_resource_locator, media_resource_object_blob_id, media_resource_stable_id,
};

const APP_SEED_JSON: &str = include_str!("../../../../../data/app/sdkwork-apps.json");
const APP_CATEGORY_SEED_JSON: &str =
    include_str!("../../../../../data/app/sdkwork-app-categories.json");
const ACTIVE_STATUS: i32 = 1;
const INACTIVE_STATUS: i32 = 0;
const SYSTEM_DATA_SCOPE: i32 = 0;
const INSTALL_PROJECTION_ORGANIZATION_ID: i64 = 0;
const APP_STORE_TENANT_ID: i64 = 20_001;
const APP_TARGET_TYPE: i32 = 15;
const APP_CATEGORY_TYPE_OTHER: i32 = 999_999;
const APP_ASSET_TYPE_ICON: i32 = 1;
const APP_ASSET_TYPE_SCREENSHOT: i32 = 2;
const APP_ASSET_TYPE_PREVIEW: i32 = 3;
const APP_ARTIFACT_TYPE_PACKAGE: i32 = 1;

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppSeedBundle {
    schema_version: i32,
    kind: String,
    count: usize,
    source: Option<Value>,
    apps: Vec<AppSeedEntry>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppSeedEntry {
    app_key: String,
    tenant_id: i64,
    organization_id: i64,
    plus_app: PlusAppSeed,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct PlusAppSeed {
    name: String,
    description: Option<String>,
    version: Option<String>,
    #[serde(deserialize_with = "deserialize_required_media_resource")]
    icon: Value,
    access_url: Option<String>,
    config: Value,
    status: String,
    app_type: Option<String>,
    platforms: Value,
    install_platforms: Value,
    install_skill: Value,
    install_config: Value,
    release_notes: Value,
    package_name: Option<String>,
    bundle_id: Option<String>,
    store_url: Option<String>,
    #[serde(default, deserialize_with = "deserialize_optional_media_resource")]
    artifact: Option<Value>,
}

#[derive(Debug)]
pub(crate) enum AppSeedLoadError {
    Json(serde_json::Error),
    Validation(String),
}

impl Display for AppSeedLoadError {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Json(error) => write!(formatter, "{error}"),
            Self::Validation(message) => formatter.write_str(message),
        }
    }
}

impl std::error::Error for AppSeedLoadError {}

impl From<serde_json::Error> for AppSeedLoadError {
    fn from(error: serde_json::Error) -> Self {
        Self::Json(error)
    }
}

fn deserialize_required_media_resource<'de, D>(deserializer: D) -> Result<Value, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let raw = Value::deserialize(deserializer)?;
    validate_seed_media_resource(raw)
}

fn deserialize_optional_media_resource<'de, D>(deserializer: D) -> Result<Option<Value>, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let raw = Option::<Value>::deserialize(deserializer)?;
    raw.map(validate_seed_media_resource).transpose()
}

fn validate_seed_media_resource<E>(value: Value) -> Result<Value, E>
where
    E: serde::de::Error,
{
    let object = value
        .as_object()
        .ok_or_else(|| E::custom("app seed media resource must be an object"))?;
    let kind = object
        .get("kind")
        .and_then(Value::as_str)
        .map(str::trim)
        .filter(|value| !value.is_empty());
    let source = object
        .get("source")
        .and_then(Value::as_str)
        .map(str::trim)
        .filter(|value| !value.is_empty());
    let locator = media_resource_locator(&value);
    if kind.is_none() || source.is_none() || locator.is_none() {
        return Err(E::custom(
            "app seed media resource must include kind, source, and a stable locator",
        ));
    }
    Ok(value)
}

#[derive(Debug, Clone)]
struct AppSeedCatalog {
    bundle: AppSeedBundle,
    categories: Vec<AppCategorySeed>,
    assets: Vec<AppAssetSeed>,
    artifacts: Vec<AppArtifactSeed>,
}

#[derive(Debug, Clone, Copy)]
struct SqliteAppSeedIntegrity {
    app_count: i64,
    category_count: i64,
    asset_count: i64,
    artifact_count: i64,
    stale_app_count: i64,
    stale_category_count: i64,
    stale_asset_count: i64,
    stale_artifact_count: i64,
}

impl SqliteAppSeedIntegrity {
    fn complete(self, catalog: &AppSeedCatalog) -> bool {
        self.app_count == catalog.bundle.apps.len() as i64
            && self.category_count == catalog.categories.len() as i64
            && self.asset_count == catalog.assets.len() as i64
            && self.artifact_count == catalog.artifacts.len() as i64
            && self.stale_app_count == 0
            && self.stale_category_count == 0
            && self.stale_asset_count == 0
            && self.stale_artifact_count == 0
    }
}

#[derive(Debug, Clone, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
struct AppCategorySeedBundle {
    schema_version: i32,
    kind: String,
    count: usize,
    source: AppCategorySeedSource,
    categories: Vec<AppCategorySeed>,
}

#[derive(Debug, Clone, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
struct AppCategorySeedSource {
    app_seed_kind: String,
    app_count: usize,
    app_seed_source: Option<Value>,
}

#[derive(Debug, Clone, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
struct AppCategorySeed {
    id: i64,
    uuid: String,
    name: String,
    description: String,
    code: String,
    tags: Vec<String>,
    #[serde(deserialize_with = "deserialize_required_media_resource")]
    icon: Value,
    sort_weight: i32,
    path: String,
}

#[derive(Debug, Clone)]
struct AppAssetSeed {
    uuid: String,
    tenant_id: i64,
    organization_id: i64,
    target_id: i64,
    asset_type: i32,
    asset: Value,
    thumbnail: Option<Value>,
    title: Option<String>,
    alt_text: Option<String>,
    mime_type: Option<String>,
    width: Option<i32>,
    height: Option<i32>,
    duration_seconds: Option<String>,
    file_size: Option<i64>,
    sort_order: i32,
    published_at: Option<String>,
    app_key: String,
}

#[derive(Debug, Clone)]
struct AppArtifactSeed {
    uuid: String,
    tenant_id: i64,
    organization_id: i64,
    target_id: i64,
    status: i32,
    artifact_type: i32,
    version: String,
    platform_type: String,
    os_name: String,
    artifact_ref: Option<String>,
    artifact: Option<Value>,
    artifact_size_bytes: i64,
    runtime: Option<String>,
    frameworks: Vec<String>,
    license_name: Option<String>,
    checksum_hash: Option<String>,
    release_notes: Option<String>,
    published_at: Option<String>,
    deprecated_at: Option<String>,
    app_key: String,
}

impl AppSeedBundle {
    fn load() -> Result<Self, AppSeedLoadError> {
        Ok(serde_json::from_str(APP_SEED_JSON)?)
    }
}

impl AppCategorySeedBundle {
    fn load() -> Result<Self, AppSeedLoadError> {
        Ok(serde_json::from_str(APP_CATEGORY_SEED_JSON)?)
    }
}

impl AppSeedCatalog {
    fn load() -> Result<Self, AppSeedLoadError> {
        let bundle = AppSeedBundle::load()?;
        validate_app_seed_bundle(&bundle)?;
        let categories = AppCategorySeedBundle::load()?;
        validate_app_category_seed(&bundle, &categories)?;
        let categories = categories.categories;
        let assets = derive_assets(&bundle);
        let artifacts = derive_artifacts(&bundle);
        Ok(Self {
            bundle,
            categories,
            assets,
            artifacts,
        })
    }

    fn payload(&self) -> String {
        serde_json::json!({
            "kind": self.bundle.kind,
            "schemaVersion": self.bundle.schema_version,
            "declaredCount": self.bundle.count,
            "appCount": self.bundle.apps.len(),
            "categoryCount": self.categories.len(),
            "assetCount": self.assets.len(),
            "artifactCount": self.artifacts.len(),
            "source": self.bundle.source,
        })
        .to_string()
    }
}

pub(crate) fn bundled_app_seed_payload() -> Result<String, AppSeedLoadError> {
    Ok(AppSeedCatalog::load()?.payload())
}

pub(crate) async fn import_sqlite_app_seed(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    let catalog = AppSeedCatalog::load().map_err(json_decode_error)?;
    let mut tx = pool.begin().await?;
    import_sqlite_categories(&mut tx, &catalog).await?;
    import_sqlite_apps(&mut tx, &catalog).await?;
    import_sqlite_assets(&mut tx, &catalog).await?;
    import_sqlite_artifacts(&mut tx, &catalog).await?;
    tx.commit().await?;
    Ok(())
}

pub(crate) async fn repair_sqlite_app_seed(pool: &SqlitePool) -> Result<bool, sqlx::Error> {
    let catalog = AppSeedCatalog::load().map_err(json_decode_error)?;
    let integrity = sqlite_app_seed_integrity(pool, &catalog).await?;
    if integrity.complete(&catalog) {
        return Ok(false);
    }

    let mut tx = pool.begin().await?;
    if integrity.category_count != catalog.categories.len() as i64
        || integrity.stale_category_count != 0
    {
        repair_sqlite_categories(&mut tx, &catalog).await?;
    }
    if integrity.app_count != catalog.bundle.apps.len() as i64 || integrity.stale_app_count != 0 {
        repair_sqlite_apps(&mut tx, &catalog).await?;
    }
    if integrity.asset_count != catalog.assets.len() as i64 || integrity.stale_asset_count != 0 {
        repair_sqlite_assets(&mut tx, &catalog).await?;
    }
    if integrity.artifact_count != catalog.artifacts.len() as i64
        || integrity.stale_artifact_count != 0
    {
        repair_sqlite_artifacts(&mut tx, &catalog).await?;
    }
    tx.commit().await?;

    if !sqlite_app_seed_complete_with_catalog(pool, &catalog).await? {
        let mut tx = pool.begin().await?;
        import_sqlite_categories(&mut tx, &catalog).await?;
        import_sqlite_apps(&mut tx, &catalog).await?;
        import_sqlite_assets(&mut tx, &catalog).await?;
        import_sqlite_artifacts(&mut tx, &catalog).await?;
        tx.commit().await?;
    }
    Ok(true)
}

pub(crate) async fn import_postgres_app_seed(pool: &PgPool) -> Result<(), sqlx::Error> {
    let catalog = AppSeedCatalog::load().map_err(json_decode_error)?;
    let mut tx = pool.begin().await?;
    import_postgres_categories(&mut tx, &catalog).await?;
    import_postgres_apps(&mut tx, &catalog).await?;
    import_postgres_assets(&mut tx, &catalog).await?;
    import_postgres_artifacts(&mut tx, &catalog).await?;
    tx.commit().await?;
    Ok(())
}

pub(crate) async fn sqlite_app_seed_complete(pool: &SqlitePool) -> Result<bool, sqlx::Error> {
    let catalog = AppSeedCatalog::load().map_err(json_decode_error)?;
    sqlite_app_seed_complete_with_catalog(pool, &catalog).await
}

async fn sqlite_app_seed_complete_with_catalog(
    pool: &SqlitePool,
    catalog: &AppSeedCatalog,
) -> Result<bool, sqlx::Error> {
    Ok(sqlite_app_seed_integrity(pool, catalog)
        .await?
        .complete(catalog))
}

async fn sqlite_app_seed_integrity(
    pool: &SqlitePool,
    catalog: &AppSeedCatalog,
) -> Result<SqliteAppSeedIntegrity, sqlx::Error> {
    let app_count = sqlite_app_seed_standard_count(pool, &catalog).await?;
    let category_count = sqlite_category_seed_standard_count(pool, &catalog.categories).await?;
    let asset_count = sqlite_asset_seed_standard_count(pool, &catalog.assets).await?;
    let artifact_count = sqlite_artifact_seed_standard_count(pool, &catalog.artifacts).await?;
    let stale_app_count = sqlite_stale_app_seed_count(pool, &catalog).await?;
    let stale_category_count = sqlite_stale_app_category_count(pool, &catalog).await?;
    let stale_asset_count = sqlite_stale_app_asset_count(pool, &catalog).await?;
    let stale_artifact_count = sqlite_stale_app_artifact_count(pool, &catalog).await?;

    Ok(SqliteAppSeedIntegrity {
        app_count,
        category_count,
        asset_count,
        artifact_count,
        stale_app_count,
        stale_category_count,
        stale_asset_count,
        stale_artifact_count,
    })
}

pub(crate) async fn postgres_app_seed_complete(pool: &PgPool) -> Result<bool, sqlx::Error> {
    let catalog = AppSeedCatalog::load().map_err(json_decode_error)?;
    let app_count = postgres_app_seed_standard_count(pool, &catalog).await?;
    let category_count = postgres_category_seed_standard_count(pool, &catalog.categories).await?;
    let asset_count = postgres_asset_seed_standard_count(pool, &catalog.assets).await?;
    let artifact_count = postgres_artifact_seed_standard_count(pool, &catalog.artifacts).await?;
    let stale_app_count = postgres_stale_app_seed_count(pool, &catalog).await?;
    let stale_category_count = postgres_stale_app_category_count(pool, &catalog).await?;
    let stale_asset_count = postgres_stale_app_asset_count(pool, &catalog).await?;
    let stale_artifact_count = postgres_stale_app_artifact_count(pool, &catalog).await?;

    Ok(app_count == catalog.bundle.apps.len() as i64
        && category_count == catalog.categories.len() as i64
        && asset_count == catalog.assets.len() as i64
        && artifact_count == catalog.artifacts.len() as i64
        && stale_app_count == 0
        && stale_category_count == 0
        && stale_asset_count == 0
        && stale_artifact_count == 0)
}

async fn import_sqlite_categories(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    catalog: &AppSeedCatalog,
) -> Result<(), sqlx::Error> {
    repair_sqlite_categories(tx, catalog).await
}

async fn repair_sqlite_categories(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    catalog: &AppSeedCatalog,
) -> Result<(), sqlx::Error> {
    retire_sqlite_stale_categories(tx, catalog).await?;
    for item in &catalog.categories {
        let (icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot) =
            app_category_icon_columns(item);
        sqlx::query(
            r#"
            INSERT INTO plus_category
                (id, uuid, tenant_id, organization_id, data_scope, name, description, shop_id, type, group_name, code, tags, icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot, sort_weight, parent_id, path, visible, status)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                uuid = excluded.uuid,
                tenant_id = excluded.tenant_id,
                organization_id = excluded.organization_id,
                data_scope = excluded.data_scope,
                name = excluded.name,
                description = excluded.description,
                shop_id = excluded.shop_id,
                type = excluded.type,
                group_name = excluded.group_name,
                code = excluded.code,
                tags = excluded.tags,
                icon_media_resource_id = excluded.icon_media_resource_id,
                icon_object_blob_id = excluded.icon_object_blob_id,
                icon_resource_snapshot = excluded.icon_resource_snapshot,
                sort_weight = excluded.sort_weight,
                parent_id = excluded.parent_id,
                path = excluded.path,
                visible = excluded.visible,
                status = excluded.status,
                updated_at = CURRENT_TIMESTAMP
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(APP_STORE_TENANT_ID)
        .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(&item.name)
        .bind(&item.description)
        .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
        .bind(APP_CATEGORY_TYPE_OTHER)
        .bind("app-store")
        .bind(&item.code)
        .bind(json_string(&item.tags))
        .bind(icon_media_resource_id)
        .bind(icon_object_blob_id)
        .bind(icon_resource_snapshot)
        .bind(item.sort_weight)
        .bind(Option::<i64>::None)
        .bind(&item.path)
        .bind(true)
        .bind(ACTIVE_STATUS)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_sqlite_apps(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    catalog: &AppSeedCatalog,
) -> Result<(), sqlx::Error> {
    repair_sqlite_apps(tx, catalog).await
}

async fn repair_sqlite_apps(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    catalog: &AppSeedCatalog,
) -> Result<(), sqlx::Error> {
    retire_sqlite_stale_apps(tx, catalog).await?;
    for (index, entry) in catalog.bundle.apps.iter().enumerate() {
        let icon = app_icon(entry);
        let icon_media_resource_id = icon.as_ref().map(media_resource_stable_id);
        let icon_object_blob_id = icon.as_ref().and_then(media_resource_object_blob_id);
        let icon_resource_snapshot = icon.as_ref().map(Value::to_string);
        let (artifact_media_resource_id, artifact_object_blob_id, artifact_resource_snapshot) =
            app_artifact_columns(entry);
        let stable_id = stable_app_id(index);
        let app_uuid = app_uuid(&entry.app_key);
        sqlx::query(
            r#"
            UPDATE plus_app
            SET uuid = uuid || '-retired-' || id,
                status = ?,
                config = json_patch(
                    COALESCE(NULLIF(config, ''), '{}'),
                    '{"portal":{"marketStatus":"OFFLINE"}}'
                ),
                updated_at = CURRENT_TIMESTAMP
            WHERE uuid = ?
              AND id <> ?
            "#,
        )
        .bind(INACTIVE_STATUS)
        .bind(&app_uuid)
        .bind(stable_id)
        .execute(&mut **tx)
        .await?;

        let result = sqlx::query(
            r#"
            UPDATE plus_app
            SET
                uuid = ?,
                tenant_id = ?,
                organization_id = ?,
                data_scope = ?,
                user_id = ?,
                name = ?,
                icon = ?,
                resource_list = ?,
                project_id = ?,
                description = ?,
                version = ?,
                icon_media_resource_id = ?,
                icon_object_blob_id = ?,
                icon_resource_snapshot = ?,
                access_url = ?,
                config = ?,
                status = ?,
                app_type = ?,
                platforms = ?,
                install_platforms = ?,
                install_skill = ?,
                install_config = ?,
                release_notes = ?,
                package_name = ?,
                bundle_id = ?,
                store_url = ?,
                artifact_media_resource_id = ?,
                artifact_object_blob_id = ?,
                artifact_resource_snapshot = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            "#,
        )
        .bind(&app_uuid)
        .bind(entry.tenant_id)
        .bind(install_projection_organization_id(entry))
        .bind(SYSTEM_DATA_SCOPE)
        .bind(0_i64)
        .bind(&entry.plus_app.name)
        .bind(icon_json(entry))
        .bind(resource_list_json(entry))
        .bind(0_i64)
        .bind(&entry.plus_app.description)
        .bind(&entry.plus_app.version)
        .bind(&icon_media_resource_id)
        .bind(icon_object_blob_id)
        .bind(&icon_resource_snapshot)
        .bind(&entry.plus_app.access_url)
        .bind(entry.plus_app.config.to_string())
        .bind(app_status_code(&entry.plus_app.status)?)
        .bind(&entry.plus_app.app_type)
        .bind(entry.plus_app.platforms.to_string())
        .bind(entry.plus_app.install_platforms.to_string())
        .bind(entry.plus_app.install_skill.to_string())
        .bind(entry.plus_app.install_config.to_string())
        .bind(entry.plus_app.release_notes.to_string())
        .bind(&entry.plus_app.package_name)
        .bind(&entry.plus_app.bundle_id)
        .bind(&entry.plus_app.store_url)
        .bind(&artifact_media_resource_id)
        .bind(artifact_object_blob_id)
        .bind(&artifact_resource_snapshot)
        .bind(stable_id)
        .execute(&mut **tx)
        .await?;
        if result.rows_affected() > 0 {
            continue;
        }

        sqlx::query(
            r#"
            INSERT INTO plus_app
                (id, uuid, tenant_id, organization_id, data_scope, user_id, name, icon, resource_list, project_id, description, version, icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot, access_url, config, status, app_type, platforms, install_platforms, install_skill, install_config, release_notes, package_name, bundle_id, store_url, artifact_media_resource_id, artifact_object_blob_id, artifact_resource_snapshot)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                uuid = excluded.uuid,
                tenant_id = excluded.tenant_id,
                organization_id = excluded.organization_id,
                data_scope = excluded.data_scope,
                user_id = excluded.user_id,
                name = excluded.name,
                icon = excluded.icon,
                resource_list = excluded.resource_list,
                project_id = excluded.project_id,
                description = excluded.description,
                version = excluded.version,
                icon_media_resource_id = excluded.icon_media_resource_id,
                icon_object_blob_id = excluded.icon_object_blob_id,
                icon_resource_snapshot = excluded.icon_resource_snapshot,
                access_url = excluded.access_url,
                config = excluded.config,
                status = excluded.status,
                app_type = excluded.app_type,
                platforms = excluded.platforms,
                install_platforms = excluded.install_platforms,
                install_skill = excluded.install_skill,
                install_config = excluded.install_config,
                release_notes = excluded.release_notes,
                package_name = excluded.package_name,
                bundle_id = excluded.bundle_id,
                store_url = excluded.store_url,
                artifact_media_resource_id = excluded.artifact_media_resource_id,
                artifact_object_blob_id = excluded.artifact_object_blob_id,
                artifact_resource_snapshot = excluded.artifact_resource_snapshot,
                updated_at = CURRENT_TIMESTAMP
            "#,
        )
        .bind(stable_id)
        .bind(&app_uuid)
        .bind(entry.tenant_id)
        .bind(install_projection_organization_id(entry))
        .bind(SYSTEM_DATA_SCOPE)
        .bind(0_i64)
        .bind(&entry.plus_app.name)
        .bind(icon_json(entry))
        .bind(resource_list_json(entry))
        .bind(0_i64)
        .bind(&entry.plus_app.description)
        .bind(&entry.plus_app.version)
        .bind(&icon_media_resource_id)
        .bind(icon_object_blob_id)
        .bind(&icon_resource_snapshot)
        .bind(&entry.plus_app.access_url)
        .bind(entry.plus_app.config.to_string())
        .bind(app_status_code(&entry.plus_app.status)?)
        .bind(&entry.plus_app.app_type)
        .bind(entry.plus_app.platforms.to_string())
        .bind(entry.plus_app.install_platforms.to_string())
        .bind(entry.plus_app.install_skill.to_string())
        .bind(entry.plus_app.install_config.to_string())
        .bind(entry.plus_app.release_notes.to_string())
        .bind(&entry.plus_app.package_name)
        .bind(&entry.plus_app.bundle_id)
        .bind(&entry.plus_app.store_url)
        .bind(&artifact_media_resource_id)
        .bind(artifact_object_blob_id)
        .bind(&artifact_resource_snapshot)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_sqlite_assets(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    catalog: &AppSeedCatalog,
) -> Result<(), sqlx::Error> {
    repair_sqlite_assets(tx, catalog).await
}

async fn repair_sqlite_assets(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    catalog: &AppSeedCatalog,
) -> Result<(), sqlx::Error> {
    retire_sqlite_stale_assets(tx, catalog).await?;
    for item in &catalog.assets {
        let asset_media_resource_id = media_resource_stable_id(&item.asset);
        let asset_object_blob_id = media_resource_object_blob_id(&item.asset);
        let asset_resource_snapshot = item.asset.to_string();
        let thumbnail_media_resource_id = item.thumbnail.as_ref().map(media_resource_stable_id);
        let thumbnail_object_blob_id = item
            .thumbnail
            .as_ref()
            .and_then(media_resource_object_blob_id);
        let thumbnail_resource_snapshot = item.thumbnail.as_ref().map(Value::to_string);
        let result = sqlx::query(
            r#"
            UPDATE studio_catalog_asset
            SET
                target_type = ?,
                target_id = ?,
                artifact_id = ?,
                asset_type = ?,
                asset_media_resource_id = ?,
                asset_object_blob_id = ?,
                asset_resource_snapshot = ?,
                thumbnail_media_resource_id = ?,
                thumbnail_object_blob_id = ?,
                thumbnail_resource_snapshot = ?,
                title = ?,
                alt_text = ?,
                mime_type = ?,
                width = ?,
                height = ?,
                duration_seconds = ?,
                file_size = ?,
                sort_order = ?,
                published_at = ?,
                metadata = ?,
                status = ?,
                deleted_at = NULL,
                deleted_by = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE tenant_id = ?
              AND organization_id = ?
              AND uuid = ?
            "#,
        )
        .bind(APP_TARGET_TYPE)
        .bind(item.target_id)
        .bind(Option::<i64>::None)
        .bind(item.asset_type)
        .bind(&asset_media_resource_id)
        .bind(asset_object_blob_id)
        .bind(&asset_resource_snapshot)
        .bind(&thumbnail_media_resource_id)
        .bind(thumbnail_object_blob_id)
        .bind(&thumbnail_resource_snapshot)
        .bind(&item.title)
        .bind(&item.alt_text)
        .bind(&item.mime_type)
        .bind(item.width)
        .bind(item.height)
        .bind(item.duration_seconds.as_deref().unwrap_or("0"))
        .bind(item.file_size)
        .bind(item.sort_order)
        .bind(&item.published_at)
        .bind(seed_metadata(
            &catalog.bundle,
            "app_asset",
            &item.uuid,
            &item.app_key,
        ))
        .bind(ACTIVE_STATUS)
        .bind(item.tenant_id)
        .bind(item.organization_id)
        .bind(&item.uuid)
        .execute(&mut **tx)
        .await?;
        if result.rows_affected() > 0 {
            continue;
        }
        sqlx::query(
            r#"
            INSERT INTO studio_catalog_asset
                (uuid, tenant_id, organization_id, data_scope, status, metadata, target_type, target_id, artifact_id, asset_type, asset_media_resource_id, asset_object_blob_id, asset_resource_snapshot, thumbnail_media_resource_id, thumbnail_object_blob_id, thumbnail_resource_snapshot, title, alt_text, mime_type, width, height, duration_seconds, file_size, sort_order, published_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&item.uuid)
        .bind(item.tenant_id)
        .bind(item.organization_id)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(seed_metadata(&catalog.bundle, "app_asset", &item.uuid, &item.app_key))
        .bind(APP_TARGET_TYPE)
        .bind(item.target_id)
        .bind(Option::<i64>::None)
        .bind(item.asset_type)
        .bind(&asset_media_resource_id)
        .bind(asset_object_blob_id)
        .bind(&asset_resource_snapshot)
        .bind(&thumbnail_media_resource_id)
        .bind(thumbnail_object_blob_id)
        .bind(&thumbnail_resource_snapshot)
        .bind(&item.title)
        .bind(&item.alt_text)
        .bind(&item.mime_type)
        .bind(item.width)
        .bind(item.height)
        .bind(item.duration_seconds.as_deref().unwrap_or("0"))
        .bind(item.file_size)
        .bind(item.sort_order)
        .bind(&item.published_at)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_sqlite_artifacts(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    catalog: &AppSeedCatalog,
) -> Result<(), sqlx::Error> {
    repair_sqlite_artifacts(tx, catalog).await
}

async fn repair_sqlite_artifacts(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    catalog: &AppSeedCatalog,
) -> Result<(), sqlx::Error> {
    retire_sqlite_stale_artifacts(tx, catalog).await?;
    for item in &catalog.artifacts {
        let artifact_media_resource_id = item.artifact.as_ref().map(media_resource_stable_id);
        let artifact_object_blob_id = item
            .artifact
            .as_ref()
            .and_then(media_resource_object_blob_id);
        let artifact_resource_snapshot = item.artifact.as_ref().map(Value::to_string);
        release_sqlite_app_artifact_uuid_owner(tx, item).await?;
        sqlx::query(
            r#"
            INSERT INTO studio_catalog_artifact
                (uuid, tenant_id, organization_id, data_scope, status, metadata, target_type, target_id, artifact_type, version, platform_type, os_name, artifact_ref, artifact_media_resource_id, artifact_object_blob_id, artifact_resource_snapshot, artifact_size_bytes, runtime, frameworks, license_name, checksum_hash, release_notes, published_at, deprecated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(tenant_id, organization_id, target_type, target_id, artifact_type, version, platform_type, os_name) DO UPDATE SET
                uuid = excluded.uuid,
                artifact_ref = excluded.artifact_ref,
                artifact_media_resource_id = excluded.artifact_media_resource_id,
                artifact_object_blob_id = excluded.artifact_object_blob_id,
                artifact_resource_snapshot = excluded.artifact_resource_snapshot,
                artifact_size_bytes = excluded.artifact_size_bytes,
                runtime = excluded.runtime,
                frameworks = excluded.frameworks,
                license_name = excluded.license_name,
                checksum_hash = excluded.checksum_hash,
                release_notes = excluded.release_notes,
                published_at = excluded.published_at,
                deprecated_at = excluded.deprecated_at,
                metadata = excluded.metadata,
                status = excluded.status,
                deleted_at = NULL,
                deleted_by = NULL,
                updated_at = CURRENT_TIMESTAMP
            "#,
        )
        .bind(&item.uuid)
        .bind(item.tenant_id)
        .bind(item.organization_id)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(item.status)
        .bind(seed_metadata(
            &catalog.bundle,
            "app_artifact",
            &item.uuid,
            &item.app_key,
        ))
        .bind(APP_TARGET_TYPE)
        .bind(item.target_id)
        .bind(item.artifact_type)
        .bind(&item.version)
        .bind(&item.platform_type)
        .bind(&item.os_name)
        .bind(&item.artifact_ref)
        .bind(&artifact_media_resource_id)
        .bind(artifact_object_blob_id)
        .bind(&artifact_resource_snapshot)
        .bind(item.artifact_size_bytes)
        .bind(&item.runtime)
        .bind(json_string(&item.frameworks))
        .bind(&item.license_name)
        .bind(&item.checksum_hash)
        .bind(&item.release_notes)
        .bind(&item.published_at)
        .bind(&item.deprecated_at)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_postgres_categories(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    catalog: &AppSeedCatalog,
) -> Result<(), sqlx::Error> {
    retire_postgres_stale_categories(tx, catalog).await?;
    for item in &catalog.categories {
        let (icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot) =
            app_category_icon_columns(item);
        sqlx::query(
            r#"
            INSERT INTO plus_category
                (id, uuid, tenant_id, organization_id, data_scope, name, description, shop_id, type, group_name, code, tags, icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot, sort_weight, parent_id, path, visible, status)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13, $14, $15::jsonb, $16, $17, $18, $19, $20)
            ON CONFLICT(id) DO UPDATE SET
                uuid = excluded.uuid,
                tenant_id = excluded.tenant_id,
                organization_id = excluded.organization_id,
                data_scope = excluded.data_scope,
                name = excluded.name,
                description = excluded.description,
                shop_id = excluded.shop_id,
                type = excluded.type,
                group_name = excluded.group_name,
                code = excluded.code,
                tags = excluded.tags,
                icon_media_resource_id = excluded.icon_media_resource_id,
                icon_object_blob_id = excluded.icon_object_blob_id,
                icon_resource_snapshot = excluded.icon_resource_snapshot,
                sort_weight = excluded.sort_weight,
                parent_id = excluded.parent_id,
                path = excluded.path,
                visible = excluded.visible,
                status = excluded.status,
                updated_at = CURRENT_TIMESTAMP
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(APP_STORE_TENANT_ID)
        .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(&item.name)
        .bind(&item.description)
        .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
        .bind(APP_CATEGORY_TYPE_OTHER)
        .bind("app-store")
        .bind(&item.code)
        .bind(json_string(&item.tags))
        .bind(icon_media_resource_id)
        .bind(icon_object_blob_id)
        .bind(icon_resource_snapshot)
        .bind(item.sort_weight)
        .bind(Option::<i64>::None)
        .bind(&item.path)
        .bind(true)
        .bind(ACTIVE_STATUS)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_postgres_apps(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    catalog: &AppSeedCatalog,
) -> Result<(), sqlx::Error> {
    retire_postgres_stale_apps(tx, catalog).await?;
    for (index, entry) in catalog.bundle.apps.iter().enumerate() {
        let icon = app_icon(entry);
        let icon_media_resource_id = icon.as_ref().map(media_resource_stable_id);
        let icon_object_blob_id = icon.as_ref().and_then(media_resource_object_blob_id);
        let icon_resource_snapshot = icon.as_ref().map(Value::to_string);
        let (artifact_media_resource_id, artifact_object_blob_id, artifact_resource_snapshot) =
            app_artifact_columns(entry);
        let stable_id = stable_app_id(index);
        let app_uuid = app_uuid(&entry.app_key);
        sqlx::query(
            r#"
            UPDATE plus_app
            SET uuid = uuid || '-retired-' || id::text,
                status = $1,
                config = jsonb_set(COALESCE(config, '{}'::jsonb), '{portal,marketStatus}', '"OFFLINE"'::jsonb, true),
                updated_at = CURRENT_TIMESTAMP
            WHERE uuid = $2
              AND id <> $3
            "#,
        )
        .bind(INACTIVE_STATUS)
        .bind(&app_uuid)
        .bind(stable_id)
        .execute(&mut **tx)
        .await?;

        let result = sqlx::query(
            r#"
            UPDATE plus_app
            SET
                uuid = $1,
                tenant_id = $2,
                organization_id = $3,
                data_scope = $4,
                user_id = $5,
                name = $6,
                icon = $7::jsonb,
                resource_list = $8::jsonb,
                project_id = $9,
                description = $10,
                version = $11,
                icon_media_resource_id = $12,
                icon_object_blob_id = $13,
                icon_resource_snapshot = $14::jsonb,
                access_url = $15,
                config = $16::jsonb,
                status = $17,
                app_type = $18,
                platforms = $19::jsonb,
                install_platforms = $20::jsonb,
                install_skill = $21::jsonb,
                install_config = $22::jsonb,
                release_notes = $23::jsonb,
                package_name = $24,
                bundle_id = $25,
                store_url = $26,
                artifact_media_resource_id = $27,
                artifact_object_blob_id = $28,
                artifact_resource_snapshot = $29::jsonb,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $30
            "#,
        )
        .bind(&app_uuid)
        .bind(entry.tenant_id)
        .bind(install_projection_organization_id(entry))
        .bind(SYSTEM_DATA_SCOPE)
        .bind(0_i64)
        .bind(&entry.plus_app.name)
        .bind(icon_json(entry))
        .bind(resource_list_json(entry))
        .bind(0_i64)
        .bind(&entry.plus_app.description)
        .bind(&entry.plus_app.version)
        .bind(&icon_media_resource_id)
        .bind(icon_object_blob_id)
        .bind(&icon_resource_snapshot)
        .bind(&entry.plus_app.access_url)
        .bind(entry.plus_app.config.to_string())
        .bind(app_status_code(&entry.plus_app.status)?)
        .bind(&entry.plus_app.app_type)
        .bind(entry.plus_app.platforms.to_string())
        .bind(entry.plus_app.install_platforms.to_string())
        .bind(entry.plus_app.install_skill.to_string())
        .bind(entry.plus_app.install_config.to_string())
        .bind(entry.plus_app.release_notes.to_string())
        .bind(&entry.plus_app.package_name)
        .bind(&entry.plus_app.bundle_id)
        .bind(&entry.plus_app.store_url)
        .bind(&artifact_media_resource_id)
        .bind(artifact_object_blob_id)
        .bind(&artifact_resource_snapshot)
        .bind(stable_id)
        .execute(&mut **tx)
        .await?;
        if result.rows_affected() > 0 {
            continue;
        }

        sqlx::query(
            r#"
            INSERT INTO plus_app
                (id, uuid, tenant_id, organization_id, data_scope, user_id, name, icon, resource_list, project_id, description, version, icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot, access_url, config, status, app_type, platforms, install_platforms, install_skill, install_config, release_notes, package_name, bundle_id, store_url, artifact_media_resource_id, artifact_object_blob_id, artifact_resource_snapshot)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10, $11, $12, $13, $14, $15::jsonb, $16, $17::jsonb, $18, $19, $20::jsonb, $21::jsonb, $22::jsonb, $23::jsonb, $24::jsonb, $25, $26, $27, $28, $29, $30::jsonb)
            ON CONFLICT(id) DO UPDATE SET
                uuid = excluded.uuid,
                tenant_id = excluded.tenant_id,
                organization_id = excluded.organization_id,
                data_scope = excluded.data_scope,
                user_id = excluded.user_id,
                name = excluded.name,
                icon = excluded.icon,
                resource_list = excluded.resource_list,
                project_id = excluded.project_id,
                description = excluded.description,
                version = excluded.version,
                icon_media_resource_id = excluded.icon_media_resource_id,
                icon_object_blob_id = excluded.icon_object_blob_id,
                icon_resource_snapshot = excluded.icon_resource_snapshot,
                access_url = excluded.access_url,
                config = excluded.config,
                status = excluded.status,
                app_type = excluded.app_type,
                platforms = excluded.platforms,
                install_platforms = excluded.install_platforms,
                install_skill = excluded.install_skill,
                install_config = excluded.install_config,
                release_notes = excluded.release_notes,
                package_name = excluded.package_name,
                bundle_id = excluded.bundle_id,
                store_url = excluded.store_url,
                artifact_media_resource_id = excluded.artifact_media_resource_id,
                artifact_object_blob_id = excluded.artifact_object_blob_id,
                artifact_resource_snapshot = excluded.artifact_resource_snapshot,
                updated_at = CURRENT_TIMESTAMP
            "#,
        )
        .bind(stable_id)
        .bind(&app_uuid)
        .bind(entry.tenant_id)
        .bind(install_projection_organization_id(entry))
        .bind(SYSTEM_DATA_SCOPE)
        .bind(0_i64)
        .bind(&entry.plus_app.name)
        .bind(icon_json(entry))
        .bind(resource_list_json(entry))
        .bind(0_i64)
        .bind(&entry.plus_app.description)
        .bind(&entry.plus_app.version)
        .bind(&icon_media_resource_id)
        .bind(icon_object_blob_id)
        .bind(&icon_resource_snapshot)
        .bind(&entry.plus_app.access_url)
        .bind(entry.plus_app.config.to_string())
        .bind(app_status_code(&entry.plus_app.status)?)
        .bind(&entry.plus_app.app_type)
        .bind(entry.plus_app.platforms.to_string())
        .bind(entry.plus_app.install_platforms.to_string())
        .bind(entry.plus_app.install_skill.to_string())
        .bind(entry.plus_app.install_config.to_string())
        .bind(entry.plus_app.release_notes.to_string())
        .bind(&entry.plus_app.package_name)
        .bind(&entry.plus_app.bundle_id)
        .bind(&entry.plus_app.store_url)
        .bind(&artifact_media_resource_id)
        .bind(artifact_object_blob_id)
        .bind(&artifact_resource_snapshot)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_postgres_assets(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    catalog: &AppSeedCatalog,
) -> Result<(), sqlx::Error> {
    retire_postgres_stale_assets(tx, catalog).await?;
    for item in &catalog.assets {
        let asset_media_resource_id = media_resource_stable_id(&item.asset);
        let asset_object_blob_id = media_resource_object_blob_id(&item.asset);
        let asset_resource_snapshot = item.asset.to_string();
        let thumbnail_media_resource_id = item.thumbnail.as_ref().map(media_resource_stable_id);
        let thumbnail_object_blob_id = item
            .thumbnail
            .as_ref()
            .and_then(media_resource_object_blob_id);
        let thumbnail_resource_snapshot = item.thumbnail.as_ref().map(Value::to_string);
        let result = sqlx::query(
            r#"
            UPDATE studio_catalog_asset
            SET
                target_type = $1,
                target_id = $2,
                artifact_id = $3,
                asset_type = $4,
                asset_media_resource_id = $5,
                asset_object_blob_id = $6,
                asset_resource_snapshot = $7::jsonb,
                thumbnail_media_resource_id = $8,
                thumbnail_object_blob_id = $9,
                thumbnail_resource_snapshot = $10::jsonb,
                title = $11,
                alt_text = $12,
                mime_type = $13,
                width = $14,
                height = $15,
                duration_seconds = CAST($16 AS NUMERIC),
                file_size = $17,
                sort_order = $18,
                published_at = $19::timestamptz,
                metadata = $20::jsonb,
                status = $21,
                deleted_at = NULL,
                deleted_by = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE tenant_id = $22
              AND organization_id = $23
              AND uuid = $24
            "#,
        )
        .bind(APP_TARGET_TYPE)
        .bind(item.target_id)
        .bind(Option::<i64>::None)
        .bind(item.asset_type)
        .bind(&asset_media_resource_id)
        .bind(asset_object_blob_id)
        .bind(&asset_resource_snapshot)
        .bind(&thumbnail_media_resource_id)
        .bind(thumbnail_object_blob_id)
        .bind(&thumbnail_resource_snapshot)
        .bind(&item.title)
        .bind(&item.alt_text)
        .bind(&item.mime_type)
        .bind(item.width)
        .bind(item.height)
        .bind(item.duration_seconds.as_deref().unwrap_or("0"))
        .bind(item.file_size)
        .bind(item.sort_order)
        .bind(&item.published_at)
        .bind(seed_metadata(
            &catalog.bundle,
            "app_asset",
            &item.uuid,
            &item.app_key,
        ))
        .bind(ACTIVE_STATUS)
        .bind(item.tenant_id)
        .bind(item.organization_id)
        .bind(&item.uuid)
        .execute(&mut **tx)
        .await?;
        if result.rows_affected() > 0 {
            continue;
        }
        sqlx::query(
            r#"
            INSERT INTO studio_catalog_asset
                (uuid, tenant_id, organization_id, data_scope, status, metadata, target_type, target_id, artifact_id, asset_type, asset_media_resource_id, asset_object_blob_id, asset_resource_snapshot, thumbnail_media_resource_id, thumbnail_object_blob_id, thumbnail_resource_snapshot, title, alt_text, mime_type, width, height, duration_seconds, file_size, sort_order, published_at)
            VALUES
                ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13::jsonb, $14, $15, $16::jsonb, $17, $18, $19, $20, $21, CAST($22 AS NUMERIC), $23, $24, $25::timestamptz)
            "#,
        )
        .bind(&item.uuid)
        .bind(item.tenant_id)
        .bind(item.organization_id)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(seed_metadata(&catalog.bundle, "app_asset", &item.uuid, &item.app_key))
        .bind(APP_TARGET_TYPE)
        .bind(item.target_id)
        .bind(Option::<i64>::None)
        .bind(item.asset_type)
        .bind(&asset_media_resource_id)
        .bind(asset_object_blob_id)
        .bind(&asset_resource_snapshot)
        .bind(&thumbnail_media_resource_id)
        .bind(thumbnail_object_blob_id)
        .bind(&thumbnail_resource_snapshot)
        .bind(&item.title)
        .bind(&item.alt_text)
        .bind(&item.mime_type)
        .bind(item.width)
        .bind(item.height)
        .bind(item.duration_seconds.as_deref().unwrap_or("0"))
        .bind(item.file_size)
        .bind(item.sort_order)
        .bind(&item.published_at)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_postgres_artifacts(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    catalog: &AppSeedCatalog,
) -> Result<(), sqlx::Error> {
    retire_postgres_stale_artifacts(tx, catalog).await?;
    for item in &catalog.artifacts {
        let artifact_media_resource_id = item.artifact.as_ref().map(media_resource_stable_id);
        let artifact_object_blob_id = item
            .artifact
            .as_ref()
            .and_then(media_resource_object_blob_id);
        let artifact_resource_snapshot = item.artifact.as_ref().map(Value::to_string);
        release_postgres_app_artifact_uuid_owner(tx, item).await?;
        sqlx::query(
            r#"
            INSERT INTO studio_catalog_artifact
                (uuid, tenant_id, organization_id, data_scope, status, metadata, target_type, target_id, artifact_type, version, platform_type, os_name, artifact_ref, artifact_media_resource_id, artifact_object_blob_id, artifact_resource_snapshot, artifact_size_bytes, runtime, frameworks, license_name, checksum_hash, release_notes, published_at, deprecated_at)
            VALUES
                ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16::jsonb, $17, $18, $19::jsonb, $20, $21, $22, $23::timestamptz, $24::timestamptz)
            ON CONFLICT(tenant_id, organization_id, target_type, target_id, artifact_type, version, platform_type, os_name) DO UPDATE SET
                uuid = excluded.uuid,
                artifact_ref = excluded.artifact_ref,
                artifact_media_resource_id = excluded.artifact_media_resource_id,
                artifact_object_blob_id = excluded.artifact_object_blob_id,
                artifact_resource_snapshot = excluded.artifact_resource_snapshot,
                artifact_size_bytes = excluded.artifact_size_bytes,
                runtime = excluded.runtime,
                frameworks = excluded.frameworks,
                license_name = excluded.license_name,
                checksum_hash = excluded.checksum_hash,
                release_notes = excluded.release_notes,
                published_at = excluded.published_at,
                deprecated_at = excluded.deprecated_at,
                metadata = excluded.metadata,
                status = excluded.status,
                deleted_at = NULL,
                deleted_by = NULL,
                updated_at = CURRENT_TIMESTAMP
            "#,
        )
        .bind(&item.uuid)
        .bind(item.tenant_id)
        .bind(item.organization_id)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(item.status)
        .bind(seed_metadata(
            &catalog.bundle,
            "app_artifact",
            &item.uuid,
            &item.app_key,
        ))
        .bind(APP_TARGET_TYPE)
        .bind(item.target_id)
        .bind(item.artifact_type)
        .bind(&item.version)
        .bind(&item.platform_type)
        .bind(&item.os_name)
        .bind(&item.artifact_ref)
        .bind(&artifact_media_resource_id)
        .bind(artifact_object_blob_id)
        .bind(&artifact_resource_snapshot)
        .bind(item.artifact_size_bytes)
        .bind(&item.runtime)
        .bind(json_string(&item.frameworks))
        .bind(&item.license_name)
        .bind(&item.checksum_hash)
        .bind(&item.release_notes)
        .bind(&item.published_at)
        .bind(&item.deprecated_at)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn release_sqlite_app_artifact_uuid_owner(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    item: &AppArtifactSeed,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        UPDATE studio_catalog_artifact
        SET uuid = uuid || '-retired-' || id,
            status = ?,
            deleted_at = CURRENT_TIMESTAMP,
            deleted_by = 0,
            updated_at = CURRENT_TIMESTAMP
        WHERE tenant_id = ?
          AND organization_id = ?
          AND uuid = ?
          AND NOT (
                target_type = ?
            AND target_id = ?
            AND artifact_type = ?
            AND version = ?
            AND platform_type = ?
            AND os_name = ?
          )
        "#,
    )
    .bind(INACTIVE_STATUS)
    .bind(item.tenant_id)
    .bind(item.organization_id)
    .bind(&item.uuid)
    .bind(APP_TARGET_TYPE)
    .bind(item.target_id)
    .bind(item.artifact_type)
    .bind(&item.version)
    .bind(&item.platform_type)
    .bind(&item.os_name)
    .execute(&mut **tx)
    .await?;
    Ok(())
}

async fn release_postgres_app_artifact_uuid_owner(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    item: &AppArtifactSeed,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        UPDATE studio_catalog_artifact
        SET uuid = uuid || '-retired-' || id::text,
            status = $1,
            deleted_at = CURRENT_TIMESTAMP,
            deleted_by = 0,
            updated_at = CURRENT_TIMESTAMP
        WHERE tenant_id = $2
          AND organization_id = $3
          AND uuid = $4
          AND NOT (
                target_type = $5
            AND target_id = $6
            AND artifact_type = $7
            AND version = $8
            AND platform_type = $9
            AND os_name = $10
          )
        "#,
    )
    .bind(INACTIVE_STATUS)
    .bind(item.tenant_id)
    .bind(item.organization_id)
    .bind(&item.uuid)
    .bind(APP_TARGET_TYPE)
    .bind(item.target_id)
    .bind(item.artifact_type)
    .bind(&item.version)
    .bind(&item.platform_type)
    .bind(&item.os_name)
    .execute(&mut **tx)
    .await?;
    Ok(())
}

async fn retire_sqlite_stale_apps(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    catalog: &AppSeedCatalog,
) -> Result<(), sqlx::Error> {
    let current_uuids = app_seed_uuids(catalog);
    let rows = sqlx::query(
        r#"
        SELECT uuid
        FROM plus_app
        WHERE tenant_id = ?
          AND organization_id = ?
          AND uuid LIKE 'sdkwork-app-%'
          AND (
              status <> ?
              OR COALESCE(NULLIF(json_extract(config, '$.portal.marketStatus'), ''), NULLIF(json_extract(config, '$.marketStatus'), ''), 'DRAFT') <> 'OFFLINE'
          )
        "#,
    )
    .bind(APP_STORE_TENANT_ID)
    .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
    .bind(INACTIVE_STATUS)
    .fetch_all(&mut **tx)
    .await?;

    for row in rows {
        let uuid = row.get::<String, _>("uuid");
        if current_uuids.contains(uuid.as_str()) {
            continue;
        }
        sqlx::query(
            r#"
            UPDATE plus_app
            SET status = ?,
                config = json_patch(
                    COALESCE(NULLIF(config, ''), '{}'),
                    '{"portal":{"marketStatus":"OFFLINE"}}'
                ),
                updated_at = CURRENT_TIMESTAMP
            WHERE tenant_id = ?
              AND organization_id = ?
              AND uuid = ?
            "#,
        )
        .bind(INACTIVE_STATUS)
        .bind(APP_STORE_TENANT_ID)
        .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
        .bind(&uuid)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn retire_postgres_stale_apps(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    catalog: &AppSeedCatalog,
) -> Result<(), sqlx::Error> {
    let current_uuids = app_seed_uuids(catalog);
    let rows = sqlx::query(
        r#"
        SELECT uuid
        FROM plus_app
        WHERE tenant_id = $1
          AND organization_id = $2
          AND uuid LIKE 'sdkwork-app-%'
          AND (
              status <> $3
              OR COALESCE(NULLIF(config -> 'portal' ->> 'marketStatus', ''), NULLIF(config ->> 'marketStatus', ''), 'DRAFT') <> 'OFFLINE'
          )
        "#,
    )
    .bind(APP_STORE_TENANT_ID)
    .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
    .bind(INACTIVE_STATUS)
    .fetch_all(&mut **tx)
    .await?;

    for row in rows {
        let uuid = row.get::<String, _>("uuid");
        if current_uuids.contains(uuid.as_str()) {
            continue;
        }
        sqlx::query(
            r#"
            UPDATE plus_app
            SET status = $1,
                config = jsonb_set(COALESCE(config, '{}'::jsonb), '{portal,marketStatus}', '"OFFLINE"'::jsonb, true),
                updated_at = CURRENT_TIMESTAMP
            WHERE tenant_id = $2
              AND organization_id = $3
              AND uuid = $4
            "#,
        )
        .bind(INACTIVE_STATUS)
        .bind(APP_STORE_TENANT_ID)
        .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
        .bind(&uuid)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn retire_sqlite_stale_categories(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    catalog: &AppSeedCatalog,
) -> Result<(), sqlx::Error> {
    let current_uuids = category_seed_uuids(catalog);
    let rows = sqlx::query(
        r#"
        SELECT uuid
        FROM plus_category
        WHERE tenant_id = ?
          AND organization_id = ?
          AND type = ?
          AND group_name = ?
          AND uuid LIKE 'sdkwork-app-category-%'
          AND (
              status <> ?
              OR visible <> false
          )
        "#,
    )
    .bind(APP_STORE_TENANT_ID)
    .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
    .bind(APP_CATEGORY_TYPE_OTHER)
    .bind("app-store")
    .bind(INACTIVE_STATUS)
    .fetch_all(&mut **tx)
    .await?;

    for row in rows {
        let uuid = row.get::<String, _>("uuid");
        if current_uuids.contains(uuid.as_str()) {
            continue;
        }
        sqlx::query(
            r#"
            UPDATE plus_category
            SET visible = false,
                status = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE tenant_id = ?
              AND organization_id = ?
              AND uuid = ?
            "#,
        )
        .bind(INACTIVE_STATUS)
        .bind(APP_STORE_TENANT_ID)
        .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
        .bind(&uuid)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn retire_postgres_stale_categories(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    catalog: &AppSeedCatalog,
) -> Result<(), sqlx::Error> {
    let current_uuids = category_seed_uuids(catalog);
    let rows = sqlx::query(
        r#"
        SELECT uuid
        FROM plus_category
        WHERE tenant_id = $1
          AND organization_id = $2
          AND type = $3
          AND group_name = $4
          AND uuid LIKE 'sdkwork-app-category-%'
          AND (
              status <> $5
              OR visible <> false
          )
        "#,
    )
    .bind(APP_STORE_TENANT_ID)
    .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
    .bind(APP_CATEGORY_TYPE_OTHER)
    .bind("app-store")
    .bind(INACTIVE_STATUS)
    .fetch_all(&mut **tx)
    .await?;

    for row in rows {
        let uuid = row.get::<String, _>("uuid");
        if current_uuids.contains(uuid.as_str()) {
            continue;
        }
        sqlx::query(
            r#"
            UPDATE plus_category
            SET visible = false,
                status = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE tenant_id = $2
              AND organization_id = $3
              AND uuid = $4
            "#,
        )
        .bind(INACTIVE_STATUS)
        .bind(APP_STORE_TENANT_ID)
        .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
        .bind(&uuid)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn retire_sqlite_stale_assets(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    catalog: &AppSeedCatalog,
) -> Result<(), sqlx::Error> {
    let current_uuids = catalog
        .assets
        .iter()
        .map(|item| item.uuid.as_str())
        .collect::<BTreeSet<_>>();
    let rows = sqlx::query(
        r#"
        SELECT uuid
        FROM studio_catalog_asset
        WHERE tenant_id = ?
          AND organization_id = ?
          AND target_type = ?
          AND json_extract(metadata, '$.seedKind') = ?
          AND json_extract(metadata, '$.itemType') = 'app_asset'
          AND deleted_at IS NULL
        "#,
    )
    .bind(APP_STORE_TENANT_ID)
    .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
    .bind(APP_TARGET_TYPE)
    .bind(&catalog.bundle.kind)
    .fetch_all(&mut **tx)
    .await?;

    for row in rows {
        let uuid = row.get::<String, _>("uuid");
        if current_uuids.contains(uuid.as_str()) {
            continue;
        }
        sqlx::query(
            r#"
            UPDATE studio_catalog_asset
            SET status = ?,
                deleted_at = CURRENT_TIMESTAMP,
                deleted_by = 0,
                updated_at = CURRENT_TIMESTAMP
            WHERE tenant_id = ?
              AND organization_id = ?
              AND target_type = ?
              AND uuid = ?
            "#,
        )
        .bind(INACTIVE_STATUS)
        .bind(APP_STORE_TENANT_ID)
        .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
        .bind(APP_TARGET_TYPE)
        .bind(&uuid)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn retire_postgres_stale_assets(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    catalog: &AppSeedCatalog,
) -> Result<(), sqlx::Error> {
    let current_uuids = catalog
        .assets
        .iter()
        .map(|item| item.uuid.as_str())
        .collect::<BTreeSet<_>>();
    let rows = sqlx::query(
        r#"
        SELECT uuid
        FROM studio_catalog_asset
        WHERE tenant_id = $1
          AND organization_id = $2
          AND target_type = $3
          AND metadata ->> 'seedKind' = $4
          AND metadata ->> 'itemType' = 'app_asset'
          AND deleted_at IS NULL
        "#,
    )
    .bind(APP_STORE_TENANT_ID)
    .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
    .bind(APP_TARGET_TYPE)
    .bind(&catalog.bundle.kind)
    .fetch_all(&mut **tx)
    .await?;

    for row in rows {
        let uuid = row.get::<String, _>("uuid");
        if current_uuids.contains(uuid.as_str()) {
            continue;
        }
        sqlx::query(
            r#"
            UPDATE studio_catalog_asset
            SET status = $1,
                deleted_at = CURRENT_TIMESTAMP,
                deleted_by = 0,
                updated_at = CURRENT_TIMESTAMP
            WHERE tenant_id = $2
              AND organization_id = $3
              AND target_type = $4
              AND uuid = $5
            "#,
        )
        .bind(INACTIVE_STATUS)
        .bind(APP_STORE_TENANT_ID)
        .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
        .bind(APP_TARGET_TYPE)
        .bind(&uuid)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn retire_sqlite_stale_artifacts(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    catalog: &AppSeedCatalog,
) -> Result<(), sqlx::Error> {
    let current_uuids = catalog
        .artifacts
        .iter()
        .map(|item| item.uuid.as_str())
        .collect::<BTreeSet<_>>();
    let rows = sqlx::query(
        r#"
        SELECT uuid
        FROM studio_catalog_artifact
        WHERE tenant_id = ?
          AND organization_id = ?
          AND target_type = ?
          AND json_extract(metadata, '$.seedKind') = ?
          AND json_extract(metadata, '$.itemType') = 'app_artifact'
          AND deleted_at IS NULL
        "#,
    )
    .bind(APP_STORE_TENANT_ID)
    .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
    .bind(APP_TARGET_TYPE)
    .bind(&catalog.bundle.kind)
    .fetch_all(&mut **tx)
    .await?;

    for row in rows {
        let uuid = row.get::<String, _>("uuid");
        if current_uuids.contains(uuid.as_str()) {
            continue;
        }
        sqlx::query(
            r#"
            UPDATE studio_catalog_artifact
            SET status = ?,
                deleted_at = CURRENT_TIMESTAMP,
                deleted_by = 0,
                updated_at = CURRENT_TIMESTAMP
            WHERE tenant_id = ?
              AND organization_id = ?
              AND target_type = ?
              AND uuid = ?
            "#,
        )
        .bind(INACTIVE_STATUS)
        .bind(APP_STORE_TENANT_ID)
        .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
        .bind(APP_TARGET_TYPE)
        .bind(&uuid)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn retire_postgres_stale_artifacts(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    catalog: &AppSeedCatalog,
) -> Result<(), sqlx::Error> {
    let current_uuids = catalog
        .artifacts
        .iter()
        .map(|item| item.uuid.as_str())
        .collect::<BTreeSet<_>>();
    let rows = sqlx::query(
        r#"
        SELECT uuid
        FROM studio_catalog_artifact
        WHERE tenant_id = $1
          AND organization_id = $2
          AND target_type = $3
          AND metadata ->> 'seedKind' = $4
          AND metadata ->> 'itemType' = 'app_artifact'
          AND deleted_at IS NULL
        "#,
    )
    .bind(APP_STORE_TENANT_ID)
    .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
    .bind(APP_TARGET_TYPE)
    .bind(&catalog.bundle.kind)
    .fetch_all(&mut **tx)
    .await?;

    for row in rows {
        let uuid = row.get::<String, _>("uuid");
        if current_uuids.contains(uuid.as_str()) {
            continue;
        }
        sqlx::query(
            r#"
            UPDATE studio_catalog_artifact
            SET status = $1,
                deleted_at = CURRENT_TIMESTAMP,
                deleted_by = 0,
                updated_at = CURRENT_TIMESTAMP
            WHERE tenant_id = $2
              AND organization_id = $3
              AND target_type = $4
              AND uuid = $5
            "#,
        )
        .bind(INACTIVE_STATUS)
        .bind(APP_STORE_TENANT_ID)
        .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
        .bind(APP_TARGET_TYPE)
        .bind(&uuid)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

fn validate_app_seed_bundle(bundle: &AppSeedBundle) -> Result<(), AppSeedLoadError> {
    if bundle.schema_version != 1 {
        return Err(AppSeedLoadError::Validation(format!(
            "invalid bundled app seed schemaVersion `{}`: expected 1",
            bundle.schema_version
        )));
    }
    if bundle.kind != "sdkwork.plus_app.seed" {
        return Err(AppSeedLoadError::Validation(format!(
            "invalid bundled app seed kind `{}`: expected sdkwork.plus_app.seed",
            bundle.kind
        )));
    }
    if bundle.count != bundle.apps.len() {
        return Err(AppSeedLoadError::Validation(format!(
            "invalid bundled app seed count `{}`: expected {} apps",
            bundle.count,
            bundle.apps.len()
        )));
    }
    if bundle.apps.is_empty() {
        return Err(AppSeedLoadError::Validation(
            "invalid bundled app seed count `0`: expected at least one app".to_owned(),
        ));
    }

    let mut app_keys = BTreeSet::new();
    for entry in &bundle.apps {
        let app_key = normalize_text(&entry.app_key);
        if app_key.is_empty() || app_key != entry.app_key || app_key != normalize_code(&app_key) {
            return Err(AppSeedLoadError::Validation(format!(
                "invalid bundled app appKey `{}`: expected lowercase kebab-case identity",
                entry.app_key
            )));
        }
        if !app_keys.insert(app_key.clone()) {
            return Err(AppSeedLoadError::Validation(format!(
                "duplicate bundled app appKey `{app_key}`"
            )));
        }

        let config_app_key = json_path_text(&entry.plus_app.config, &["standard", "appKey"]);
        if config_app_key != app_key {
            return Err(AppSeedLoadError::Validation(format!(
                "bundled app appKey `{app_key}` does not match config.standard.appKey `{config_app_key}`"
            )));
        }

        match entry.plus_app.status.trim() {
            "ACTIVE" | "INACTIVE" => {}
            status => {
                return Err(AppSeedLoadError::Validation(format!(
                    "invalid bundled app runtime status `{status}` for appKey `{app_key}`: expected ACTIVE or INACTIVE"
                )));
            }
        }
    }

    Ok(())
}

fn derive_categories(bundle: &AppSeedBundle) -> Vec<AppCategorySeed> {
    let mut categories = BTreeMap::<String, String>::new();
    for entry in &bundle.apps {
        let name = app_category_name(entry);
        categories.insert(app_category_code(&name), name);
    }

    categories
        .into_iter()
        .enumerate()
        .map(|(index, (code, name))| AppCategorySeed {
            id: app_category_id(&code),
            uuid: format!(
                "sdkwork-app-category-{}",
                code.trim_start_matches("app-store-")
            ),
            description: format!("{name} SDKWork app category"),
            tags: vec![
                "sdkwork-app".to_owned(),
                code.trim_start_matches("app-store-").to_owned(),
            ],
            icon: external_url_media_resource(
                &format!(
                    "https://cdn.sdkwork.com/app-categories/{}.svg",
                    code.trim_start_matches("app-store-")
                ),
                "image",
            ),
            sort_weight: (100 + index) as i32,
            path: format!("/app-store/{}", code.trim_start_matches("app-store-")),
            code,
            name,
        })
        .collect()
}

fn validate_app_category_seed(
    bundle: &AppSeedBundle,
    category_bundle: &AppCategorySeedBundle,
) -> Result<(), AppSeedLoadError> {
    if category_bundle.schema_version != 1 {
        return Err(AppSeedLoadError::Validation(format!(
            "invalid bundled app category seed schemaVersion `{}`: expected 1",
            category_bundle.schema_version
        )));
    }
    if category_bundle.kind != "sdkwork.plus_category.app_seed" {
        return Err(AppSeedLoadError::Validation(format!(
            "invalid bundled app category seed kind `{}`",
            category_bundle.kind
        )));
    }
    if category_bundle.count != category_bundle.categories.len() {
        return Err(AppSeedLoadError::Validation(format!(
            "bundled app category seed declared count {} does not match {} categories",
            category_bundle.count,
            category_bundle.categories.len()
        )));
    }
    if category_bundle.source.app_seed_kind != bundle.kind {
        return Err(AppSeedLoadError::Validation(format!(
            "bundled app category seed source appSeedKind `{}` does not match app seed kind `{}`",
            category_bundle.source.app_seed_kind, bundle.kind
        )));
    }
    if category_bundle.source.app_count != bundle.apps.len()
        || category_bundle.source.app_count != bundle.count
    {
        return Err(AppSeedLoadError::Validation(format!(
            "bundled app category seed source appCount {} does not match app seed count {} / {}",
            category_bundle.source.app_count,
            bundle.count,
            bundle.apps.len()
        )));
    }
    if category_bundle.source.app_seed_source != bundle.source {
        return Err(AppSeedLoadError::Validation(
            "bundled app category seed source metadata does not match app seed source".to_owned(),
        ));
    }

    let expected = derive_categories(bundle);
    if category_bundle.categories != expected {
        return Err(AppSeedLoadError::Validation(
            "bundled app category seed categories drifted from sdkwork-apps.json portal categories"
                .to_owned(),
        ));
    }
    Ok(())
}

fn derive_assets(bundle: &AppSeedBundle) -> Vec<AppAssetSeed> {
    let mut assets = Vec::new();
    for (app_index, entry) in bundle.apps.iter().enumerate() {
        let target_id = stable_app_id(app_index);
        let tenant_id = entry.tenant_id;
        let organization_id = install_projection_organization_id(entry);
        if let Some(icon) = entry
            .plus_app
            .config
            .pointer("/media/icons/primary")
            .filter(|value| media_enabled(value))
        {
            if let Some(asset) = media_asset(
                entry,
                target_id,
                tenant_id,
                organization_id,
                icon,
                APP_ASSET_TYPE_ICON,
                "primary-icon",
                0,
            ) {
                assets.push(asset);
            }
        }
        if let Some(screenshots) = entry
            .plus_app
            .config
            .pointer("/media/screenshots")
            .and_then(Value::as_array)
        {
            for (index, screenshot) in screenshots.iter().enumerate() {
                if !media_enabled(screenshot) {
                    continue;
                }
                if let Some(asset) = media_asset(
                    entry,
                    target_id,
                    tenant_id,
                    organization_id,
                    screenshot,
                    APP_ASSET_TYPE_SCREENSHOT,
                    &format!("screenshot-{}", index + 1),
                    index as i32,
                ) {
                    assets.push(asset);
                }
            }
        }
        if let Some(previews) = entry
            .plus_app
            .config
            .pointer("/media/previews")
            .and_then(Value::as_array)
        {
            for (index, preview) in previews.iter().enumerate() {
                if !media_enabled(preview) {
                    continue;
                }
                if let Some(asset) = media_asset(
                    entry,
                    target_id,
                    tenant_id,
                    organization_id,
                    preview,
                    APP_ASSET_TYPE_PREVIEW,
                    &format!("preview-{}", index + 1),
                    index as i32,
                ) {
                    assets.push(asset);
                }
            }
        }
    }
    assets
}

fn derive_artifacts(bundle: &AppSeedBundle) -> Vec<AppArtifactSeed> {
    let mut artifacts = Vec::new();
    for (app_index, entry) in bundle.apps.iter().enumerate() {
        let target_id = stable_app_id(app_index);
        let tenant_id = entry.tenant_id;
        let organization_id = install_projection_organization_id(entry);
        let Some(packages) = entry
            .plus_app
            .install_config
            .get("packages")
            .and_then(Value::as_array)
        else {
            continue;
        };
        for (package_index, package) in packages.iter().enumerate() {
            let status = if json_bool_default(package, "enabled", true) {
                ACTIVE_STATUS
            } else {
                INACTIVE_STATUS
            };
            let package_id = first_non_empty(&[
                json_text(package, "id"),
                format!("package-{}", package_index + 1),
            ])
            .unwrap_or_else(|| format!("package-{}", package_index + 1));
            let artifact = package
                .get("artifact")
                .and_then(|value| media_resource_from_value(value, "document"));
            if artifact.is_none() {
                continue;
            }
            let release_note = release_note_for_package(entry, &package_id);
            let platform_type = non_empty(json_text(package, "platform"), "WEB");
            let os_name = package_os_name(package, &platform_type);
            let version = non_empty(
                first_non_empty(&[
                    json_text(package, "version"),
                    release_note
                        .map(|value| json_text(value, "version"))
                        .unwrap_or_default(),
                    entry.plus_app.version.clone().unwrap_or_default(),
                ])
                .unwrap_or_default(),
                "Latest",
            );
            let checksum_hash = package_checksum(package);
            artifacts.push(AppArtifactSeed {
                uuid: compact_seed_uuid(
                    "sdkapp-artifact",
                    &[
                        &entry.app_key,
                        &package_id,
                        &platform_type,
                        &os_name,
                        &version,
                    ],
                ),
                tenant_id,
                organization_id,
                target_id,
                status,
                artifact_type: APP_ARTIFACT_TYPE_PACKAGE,
                version,
                platform_type,
                os_name,
                artifact_ref: Some(package_id),
                artifact,
                artifact_size_bytes: json_i64(package, "sizeBytes").unwrap_or(0),
                runtime: first_non_empty(&[
                    json_text(package, "sourceType"),
                    json_text(package, "packageFormat"),
                ]),
                frameworks: package_frameworks(entry, package),
                license_name: Some("SDKWork Commercial".to_owned()),
                checksum_hash,
                release_notes: release_note_text(release_note),
                published_at: release_note.map(|value| json_text(value, "publishedAt")),
                deprecated_at: None,
                app_key: entry.app_key.clone(),
            });
        }
    }
    artifacts
}

fn media_asset(
    entry: &AppSeedEntry,
    target_id: i64,
    tenant_id: i64,
    organization_id: i64,
    media: &Value,
    asset_type: i32,
    fallback_id: &str,
    fallback_sort_order: i32,
) -> Option<AppAssetSeed> {
    let media_id = first_non_empty(&[json_text(media, "id"), fallback_id.to_owned()])
        .unwrap_or_else(|| fallback_id.to_owned());
    let title = first_non_empty(&[
        json_text(media, "caption"),
        json_text(media, "title"),
        format!("{} {}", entry.plus_app.name, fallback_id),
    ]);
    let alt_text = first_non_empty(&[
        json_path_text(media, &["metadata", "altText"]),
        json_text(media, "altText"),
        json_text(media, "alt_text"),
        title.clone().unwrap_or_default(),
    ]);
    let sort_order = json_i64(media, "sortOrder")
        .and_then(|value| i32::try_from(value).ok())
        .unwrap_or(fallback_sort_order);
    let mime_type = first_non_empty(&[
        json_text(media, "mimeType"),
        json_text(media, "mime_type"),
        mime_type_from_format(&json_text(media, "format")),
    ]);
    let asset_kind = media_kind_for_asset(asset_type, mime_type.as_deref());
    let asset = media
        .get("asset")
        .and_then(|value| media_resource_from_value(value, asset_kind))?;
    Some(AppAssetSeed {
        uuid: compact_seed_uuid(
            "sdkapp-asset",
            &[&entry.app_key, &media_id, asset_type.to_string().as_str()],
        ),
        tenant_id,
        organization_id,
        target_id,
        asset_type,
        asset,
        thumbnail: media
            .get("thumbnail")
            .and_then(|value| media_resource_from_value(value, "image")),
        title,
        alt_text,
        mime_type,
        width: json_i64(media, "width").and_then(|value| i32::try_from(value).ok()),
        height: json_i64(media, "height").and_then(|value| i32::try_from(value).ok()),
        duration_seconds: json_text_optional(media, "durationSeconds"),
        file_size: json_i64(media, "fileSizeBytes").or_else(|| json_i64(media, "file_size")),
        sort_order,
        published_at: json_text_optional(media, "publishedAt"),
        app_key: entry.app_key.clone(),
    })
}

async fn sqlite_app_seed_standard_count(
    pool: &SqlitePool,
    catalog: &AppSeedCatalog,
) -> Result<i64, sqlx::Error> {
    let expected = sqlite_expected_app_fingerprints(catalog)?;
    let rows = sqlx::query(
        r#"
        SELECT id, uuid, tenant_id, organization_id, data_scope, user_id, name, icon,
               resource_list, project_id, description, version,
               icon_media_resource_id, icon_object_blob_id,
               CAST(icon_resource_snapshot AS TEXT) AS icon_resource_snapshot,
               access_url,
               config, status, app_type, platforms, install_platforms, install_skill,
               install_config, release_notes, package_name, bundle_id, store_url,
               artifact_media_resource_id, artifact_object_blob_id,
               CAST(artifact_resource_snapshot AS TEXT) AS artifact_resource_snapshot
        FROM plus_app
        WHERE uuid LIKE 'sdkwork-app-%'
        "#,
    )
    .fetch_all(pool)
    .await?;
    let actual = rows
        .into_iter()
        .map(|row| {
            seed_fingerprint(serde_json::json!([
                row.get::<i64, _>("id"),
                row.get::<String, _>("uuid"),
                row.get::<i64, _>("tenant_id"),
                row.get::<i64, _>("organization_id"),
                row.get::<i64, _>("data_scope"),
                row.get::<i64, _>("user_id"),
                row.get::<String, _>("name"),
                row.get::<String, _>("icon"),
                row.get::<String, _>("resource_list"),
                row.get::<i64, _>("project_id"),
                row.get::<Option<String>, _>("description"),
                row.get::<Option<String>, _>("version"),
                row.get::<Option<String>, _>("icon_media_resource_id"),
                row.get::<Option<i64>, _>("icon_object_blob_id"),
                row.get::<Option<String>, _>("icon_resource_snapshot"),
                row.get::<Option<String>, _>("access_url"),
                row.get::<String, _>("config"),
                row.get::<i64, _>("status"),
                row.get::<Option<String>, _>("app_type"),
                row.get::<String, _>("platforms"),
                row.get::<String, _>("install_platforms"),
                row.get::<String, _>("install_skill"),
                row.get::<String, _>("install_config"),
                row.get::<String, _>("release_notes"),
                row.get::<Option<String>, _>("package_name"),
                row.get::<Option<String>, _>("bundle_id"),
                row.get::<Option<String>, _>("store_url"),
                row.get::<Option<String>, _>("artifact_media_resource_id"),
                row.get::<Option<i64>, _>("artifact_object_blob_id"),
                row.get::<Option<String>, _>("artifact_resource_snapshot"),
            ]))
        })
        .collect::<BTreeSet<_>>();
    Ok(matching_seed_fingerprint_count(&expected, &actual))
}

async fn sqlite_category_seed_standard_count(
    pool: &SqlitePool,
    categories: &[AppCategorySeed],
) -> Result<i64, sqlx::Error> {
    let expected = sqlite_expected_category_fingerprints(categories);
    let rows = sqlx::query(
        r#"
        SELECT id, uuid, tenant_id, organization_id, data_scope, name, description,
               shop_id, type, group_name, code, tags, icon_media_resource_id,
               icon_object_blob_id, icon_resource_snapshot, sort_weight, parent_id,
               path, visible, status
        FROM plus_category
        WHERE uuid LIKE 'sdkwork-app-category-%'
        "#,
    )
    .fetch_all(pool)
    .await?;
    let actual = rows
        .into_iter()
        .map(|row| {
            seed_fingerprint(serde_json::json!([
                row.get::<i64, _>("id"),
                row.get::<String, _>("uuid"),
                row.get::<i64, _>("tenant_id"),
                row.get::<i64, _>("organization_id"),
                row.get::<i64, _>("data_scope"),
                row.get::<String, _>("name"),
                row.get::<Option<String>, _>("description"),
                row.get::<Option<i64>, _>("shop_id"),
                row.get::<i64, _>("type"),
                row.get::<Option<String>, _>("group_name"),
                row.get::<Option<String>, _>("code"),
                row.get::<String, _>("tags"),
                row.get::<Option<String>, _>("icon_media_resource_id"),
                row.get::<Option<i64>, _>("icon_object_blob_id"),
                row.get::<Option<String>, _>("icon_resource_snapshot"),
                row.get::<i64, _>("sort_weight"),
                row.get::<Option<i64>, _>("parent_id"),
                row.get::<Option<String>, _>("path"),
                row.get::<i64, _>("visible"),
                row.get::<i64, _>("status"),
            ]))
        })
        .collect::<BTreeSet<_>>();
    Ok(matching_seed_fingerprint_count(&expected, &actual))
}

async fn sqlite_stale_app_seed_count(
    pool: &SqlitePool,
    catalog: &AppSeedCatalog,
) -> Result<i64, sqlx::Error> {
    let current_uuids = app_seed_uuids(catalog);
    let rows = sqlx::query(
        r#"
        SELECT uuid
        FROM plus_app
        WHERE tenant_id = ?
          AND organization_id = ?
          AND uuid LIKE 'sdkwork-app-%'
          AND (
              status <> ?
              OR COALESCE(NULLIF(json_extract(config, '$.portal.marketStatus'), ''), NULLIF(json_extract(config, '$.marketStatus'), ''), 'DRAFT') <> 'OFFLINE'
          )
        "#,
    )
    .bind(APP_STORE_TENANT_ID)
    .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
    .bind(INACTIVE_STATUS)
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .filter(|row| {
            let uuid = row.get::<String, _>("uuid");
            !current_uuids.contains(uuid.as_str())
        })
        .count() as i64)
}

async fn sqlite_stale_app_category_count(
    pool: &SqlitePool,
    catalog: &AppSeedCatalog,
) -> Result<i64, sqlx::Error> {
    let current_uuids = category_seed_uuids(catalog);
    let rows = sqlx::query(
        r#"
        SELECT uuid
        FROM plus_category
        WHERE tenant_id = ?
          AND organization_id = ?
          AND type = ?
          AND group_name = ?
          AND uuid LIKE 'sdkwork-app-category-%'
          AND (
              status <> ?
              OR visible <> false
          )
        "#,
    )
    .bind(APP_STORE_TENANT_ID)
    .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
    .bind(APP_CATEGORY_TYPE_OTHER)
    .bind("app-store")
    .bind(INACTIVE_STATUS)
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .filter(|row| {
            let uuid = row.get::<String, _>("uuid");
            !current_uuids.contains(uuid.as_str())
        })
        .count() as i64)
}

async fn sqlite_asset_seed_standard_count(
    pool: &SqlitePool,
    assets: &[AppAssetSeed],
) -> Result<i64, sqlx::Error> {
    let expected = sqlite_expected_asset_fingerprints(assets);
    let rows = sqlx::query(
        r#"
        SELECT uuid, tenant_id, organization_id, data_scope, status, target_type,
               target_id, artifact_id, asset_type,
               asset_media_resource_id, asset_object_blob_id,
               CAST(asset_resource_snapshot AS TEXT) AS asset_resource_snapshot,
               thumbnail_media_resource_id, thumbnail_object_blob_id,
               CAST(thumbnail_resource_snapshot AS TEXT) AS thumbnail_resource_snapshot,
               title,
               alt_text, mime_type, width, height, CAST(duration_seconds AS TEXT) AS duration_seconds,
               file_size, sort_order, published_at, deleted_at
        FROM studio_catalog_asset
        WHERE metadata ->> 'itemType' = 'app_asset'
        "#,
    )
    .fetch_all(pool)
    .await?;
    let actual = rows
        .into_iter()
        .map(|row| {
            seed_fingerprint(serde_json::json!([
                row.get::<String, _>("uuid"),
                row.get::<i64, _>("tenant_id"),
                row.get::<i64, _>("organization_id"),
                row.get::<i64, _>("data_scope"),
                row.get::<i64, _>("status"),
                row.get::<i64, _>("target_type"),
                row.get::<i64, _>("target_id"),
                row.get::<Option<i64>, _>("artifact_id"),
                row.get::<i64, _>("asset_type"),
                row.get::<String, _>("asset_media_resource_id"),
                row.get::<Option<i64>, _>("asset_object_blob_id"),
                row.get::<String, _>("asset_resource_snapshot"),
                row.get::<Option<String>, _>("thumbnail_media_resource_id"),
                row.get::<Option<i64>, _>("thumbnail_object_blob_id"),
                row.get::<Option<String>, _>("thumbnail_resource_snapshot"),
                row.get::<Option<String>, _>("title"),
                row.get::<Option<String>, _>("alt_text"),
                row.get::<Option<String>, _>("mime_type"),
                row.get::<Option<i64>, _>("width"),
                row.get::<Option<i64>, _>("height"),
                row.get::<String, _>("duration_seconds"),
                row.get::<Option<i64>, _>("file_size"),
                row.get::<i64, _>("sort_order"),
                row.get::<Option<String>, _>("published_at"),
                row.get::<Option<String>, _>("deleted_at"),
            ]))
        })
        .collect::<BTreeSet<_>>();
    Ok(matching_seed_fingerprint_count(&expected, &actual))
}

async fn sqlite_artifact_seed_standard_count(
    pool: &SqlitePool,
    artifacts: &[AppArtifactSeed],
) -> Result<i64, sqlx::Error> {
    let expected = sqlite_expected_artifact_fingerprints(artifacts);
    let rows = sqlx::query(
        r#"
        SELECT uuid, tenant_id, organization_id, data_scope, status, target_type,
               target_id, artifact_type, version, platform_type, os_name, artifact_ref,
               CAST(artifact_resource_snapshot AS TEXT) AS artifact_resource_snapshot,
               artifact_size_bytes, runtime, frameworks, license_name,
               checksum_hash, release_notes, published_at, deprecated_at, deleted_at
        FROM studio_catalog_artifact
        WHERE metadata ->> 'itemType' = 'app_artifact'
        "#,
    )
    .fetch_all(pool)
    .await?;
    let actual = rows
        .into_iter()
        .map(|row| {
            seed_fingerprint(serde_json::json!([
                row.get::<String, _>("uuid"),
                row.get::<i64, _>("tenant_id"),
                row.get::<i64, _>("organization_id"),
                row.get::<i64, _>("data_scope"),
                row.get::<i64, _>("status"),
                row.get::<i64, _>("target_type"),
                row.get::<i64, _>("target_id"),
                row.get::<i64, _>("artifact_type"),
                row.get::<String, _>("version"),
                row.get::<String, _>("platform_type"),
                row.get::<String, _>("os_name"),
                row.get::<Option<String>, _>("artifact_ref"),
                row.get::<Option<String>, _>("artifact_resource_snapshot"),
                row.get::<i64, _>("artifact_size_bytes"),
                row.get::<Option<String>, _>("runtime"),
                row.get::<String, _>("frameworks"),
                row.get::<Option<String>, _>("license_name"),
                row.get::<Option<String>, _>("checksum_hash"),
                row.get::<Option<String>, _>("release_notes"),
                row.get::<Option<String>, _>("published_at"),
                row.get::<Option<String>, _>("deprecated_at"),
                row.get::<Option<String>, _>("deleted_at"),
            ]))
        })
        .collect::<BTreeSet<_>>();
    Ok(matching_seed_fingerprint_count(&expected, &actual))
}

fn sqlite_expected_app_fingerprints(
    catalog: &AppSeedCatalog,
) -> Result<BTreeSet<String>, sqlx::Error> {
    catalog
        .bundle
        .apps
        .iter()
        .enumerate()
        .map(|(index, entry)| {
            let (artifact_media_resource_id, artifact_object_blob_id, artifact_resource_snapshot) =
                app_artifact_columns(entry);
            Ok(seed_fingerprint(serde_json::json!([
                stable_app_id(index),
                app_uuid(&entry.app_key),
                entry.tenant_id,
                install_projection_organization_id(entry),
                SYSTEM_DATA_SCOPE,
                0_i64,
                entry.plus_app.name,
                icon_json(entry),
                resource_list_json(entry),
                0_i64,
                entry.plus_app.description,
                entry.plus_app.version,
                app_icon(&entry).as_ref().map(media_resource_stable_id),
                app_icon(&entry)
                    .as_ref()
                    .and_then(media_resource_object_blob_id),
                app_icon(&entry).as_ref().map(Value::to_string),
                entry.plus_app.access_url,
                entry.plus_app.config.to_string(),
                i64::from(app_status_code(&entry.plus_app.status)?),
                entry.plus_app.app_type,
                entry.plus_app.platforms.to_string(),
                entry.plus_app.install_platforms.to_string(),
                entry.plus_app.install_skill.to_string(),
                entry.plus_app.install_config.to_string(),
                entry.plus_app.release_notes.to_string(),
                entry.plus_app.package_name,
                entry.plus_app.bundle_id,
                entry.plus_app.store_url,
                artifact_media_resource_id,
                artifact_object_blob_id,
                artifact_resource_snapshot,
            ])))
        })
        .collect()
}

fn sqlite_expected_category_fingerprints(categories: &[AppCategorySeed]) -> BTreeSet<String> {
    categories
        .iter()
        .map(|item| {
            let (icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot) =
                app_category_icon_columns(item);
            seed_fingerprint(serde_json::json!([
                item.id,
                item.uuid,
                APP_STORE_TENANT_ID,
                INSTALL_PROJECTION_ORGANIZATION_ID,
                SYSTEM_DATA_SCOPE,
                item.name,
                item.description,
                INSTALL_PROJECTION_ORGANIZATION_ID,
                APP_CATEGORY_TYPE_OTHER,
                "app-store",
                item.code,
                json_string(&item.tags),
                Some(icon_media_resource_id),
                icon_object_blob_id,
                Some(icon_resource_snapshot),
                item.sort_weight,
                Option::<i64>::None,
                item.path,
                1_i64,
                ACTIVE_STATUS,
            ]))
        })
        .collect()
}

fn sqlite_expected_asset_fingerprints(assets: &[AppAssetSeed]) -> BTreeSet<String> {
    assets
        .iter()
        .map(|item| {
            seed_fingerprint(serde_json::json!([
                item.uuid,
                item.tenant_id,
                item.organization_id,
                SYSTEM_DATA_SCOPE,
                ACTIVE_STATUS,
                APP_TARGET_TYPE,
                item.target_id,
                Option::<i64>::None,
                item.asset_type,
                media_resource_stable_id(&item.asset),
                media_resource_object_blob_id(&item.asset),
                item.asset.to_string(),
                item.thumbnail.as_ref().map(media_resource_stable_id),
                item.thumbnail
                    .as_ref()
                    .and_then(media_resource_object_blob_id),
                item.thumbnail.as_ref().map(Value::to_string),
                item.title,
                item.alt_text,
                item.mime_type,
                item.width.map(i64::from),
                item.height.map(i64::from),
                item.duration_seconds.as_deref().unwrap_or("0"),
                item.file_size,
                item.sort_order,
                item.published_at,
                Option::<String>::None,
            ]))
        })
        .collect()
}

fn sqlite_expected_artifact_fingerprints(artifacts: &[AppArtifactSeed]) -> BTreeSet<String> {
    artifacts
        .iter()
        .map(|item| {
            seed_fingerprint(serde_json::json!([
                item.uuid,
                item.tenant_id,
                item.organization_id,
                SYSTEM_DATA_SCOPE,
                item.status,
                APP_TARGET_TYPE,
                item.target_id,
                item.artifact_type,
                item.version,
                item.platform_type,
                item.os_name,
                item.artifact_ref,
                item.artifact.as_ref().map(Value::to_string),
                item.artifact_size_bytes,
                item.runtime,
                json_string(&item.frameworks),
                item.license_name,
                item.checksum_hash,
                item.release_notes,
                item.published_at,
                Option::<String>::None,
                Option::<String>::None,
            ]))
        })
        .collect()
}

fn seed_fingerprint(value: serde_json::Value) -> String {
    value.to_string()
}

fn matching_seed_fingerprint_count(expected: &BTreeSet<String>, actual: &BTreeSet<String>) -> i64 {
    expected
        .iter()
        .filter(|fingerprint| actual.contains(*fingerprint))
        .count() as i64
}

async fn sqlite_stale_app_asset_count(
    pool: &SqlitePool,
    catalog: &AppSeedCatalog,
) -> Result<i64, sqlx::Error> {
    let current_uuids = catalog
        .assets
        .iter()
        .map(|item| item.uuid.as_str())
        .collect::<BTreeSet<_>>();
    let rows = sqlx::query(
        r#"
        SELECT uuid
        FROM studio_catalog_asset
        WHERE tenant_id = ?
          AND organization_id = ?
          AND target_type = ?
          AND json_extract(metadata, '$.seedKind') = ?
          AND json_extract(metadata, '$.itemType') = 'app_asset'
          AND deleted_at IS NULL
        "#,
    )
    .bind(APP_STORE_TENANT_ID)
    .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
    .bind(APP_TARGET_TYPE)
    .bind(&catalog.bundle.kind)
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .filter(|row| {
            let uuid = row.get::<String, _>("uuid");
            !current_uuids.contains(uuid.as_str())
        })
        .count() as i64)
}

async fn sqlite_stale_app_artifact_count(
    pool: &SqlitePool,
    catalog: &AppSeedCatalog,
) -> Result<i64, sqlx::Error> {
    let current_uuids = catalog
        .artifacts
        .iter()
        .map(|item| item.uuid.as_str())
        .collect::<BTreeSet<_>>();
    let rows = sqlx::query(
        r#"
        SELECT uuid
        FROM studio_catalog_artifact
        WHERE tenant_id = ?
          AND organization_id = ?
          AND target_type = ?
          AND json_extract(metadata, '$.seedKind') = ?
          AND json_extract(metadata, '$.itemType') = 'app_artifact'
          AND deleted_at IS NULL
        "#,
    )
    .bind(APP_STORE_TENANT_ID)
    .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
    .bind(APP_TARGET_TYPE)
    .bind(&catalog.bundle.kind)
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .filter(|row| {
            let uuid = row.get::<String, _>("uuid");
            !current_uuids.contains(uuid.as_str())
        })
        .count() as i64)
}

async fn postgres_app_seed_standard_count(
    pool: &PgPool,
    catalog: &AppSeedCatalog,
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for (index, entry) in catalog.bundle.apps.iter().enumerate() {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM plus_app
            WHERE id = $1
              AND uuid = $2
              AND tenant_id = $3
              AND organization_id = $4
              AND data_scope = $5
              AND user_id = $6
              AND name = $7
              AND icon = $8::jsonb
              AND resource_list = $9::jsonb
              AND project_id = $10
              AND description IS NOT DISTINCT FROM $11
              AND version IS NOT DISTINCT FROM $12
              AND icon_media_resource_id IS NOT DISTINCT FROM $13
              AND icon_object_blob_id IS NOT DISTINCT FROM $14
              AND icon_resource_snapshot IS NOT DISTINCT FROM $15::jsonb
              AND access_url IS NOT DISTINCT FROM $16
              AND config = $17::jsonb
              AND status = $18
              AND app_type IS NOT DISTINCT FROM $19
              AND platforms = $20::jsonb
              AND install_platforms = $21::jsonb
              AND install_skill = $22::jsonb
              AND install_config = $23::jsonb
              AND release_notes = $24::jsonb
              AND package_name IS NOT DISTINCT FROM $25
              AND bundle_id IS NOT DISTINCT FROM $26
              AND store_url IS NOT DISTINCT FROM $27
              AND artifact_media_resource_id IS NOT DISTINCT FROM $28
              AND artifact_object_blob_id IS NOT DISTINCT FROM $29
              AND artifact_resource_snapshot IS NOT DISTINCT FROM $30::jsonb
            "#,
        )
        .bind(stable_app_id(index))
        .bind(app_uuid(&entry.app_key))
        .bind(entry.tenant_id)
        .bind(install_projection_organization_id(entry))
        .bind(SYSTEM_DATA_SCOPE)
        .bind(0_i64)
        .bind(&entry.plus_app.name)
        .bind(icon_json(entry))
        .bind(resource_list_json(entry))
        .bind(0_i64)
        .bind(&entry.plus_app.description)
        .bind(&entry.plus_app.version)
        .bind(app_icon(&entry).as_ref().map(media_resource_stable_id))
        .bind(
            app_icon(&entry)
                .as_ref()
                .and_then(media_resource_object_blob_id),
        )
        .bind(app_icon(&entry).as_ref().map(Value::to_string))
        .bind(&entry.plus_app.access_url)
        .bind(entry.plus_app.config.to_string())
        .bind(app_status_code(&entry.plus_app.status)?)
        .bind(&entry.plus_app.app_type)
        .bind(entry.plus_app.platforms.to_string())
        .bind(entry.plus_app.install_platforms.to_string())
        .bind(entry.plus_app.install_skill.to_string())
        .bind(entry.plus_app.install_config.to_string())
        .bind(entry.plus_app.release_notes.to_string())
        .bind(&entry.plus_app.package_name)
        .bind(&entry.plus_app.bundle_id)
        .bind(&entry.plus_app.store_url)
        .bind(app_artifact_columns(entry).0)
        .bind(app_artifact_columns(entry).1)
        .bind(app_artifact_columns(entry).2)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn postgres_category_seed_standard_count(
    pool: &PgPool,
    categories: &[AppCategorySeed],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in categories {
        let (icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot) =
            app_category_icon_columns(item);
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM plus_category
            WHERE id = $1
              AND uuid = $2
              AND tenant_id = $3
              AND organization_id = $4
              AND data_scope = $5
              AND name = $6
              AND description = $7
              AND shop_id = $8
              AND type = $9
              AND group_name = $10
              AND code = $11
              AND tags = $12::jsonb
              AND icon_media_resource_id = $13
              AND icon_object_blob_id IS NOT DISTINCT FROM $14
              AND icon_resource_snapshot = $15::jsonb
              AND sort_weight = $16
              AND parent_id IS NULL
              AND path = $17
              AND visible = $18
              AND status = $19
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(APP_STORE_TENANT_ID)
        .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(&item.name)
        .bind(&item.description)
        .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
        .bind(APP_CATEGORY_TYPE_OTHER)
        .bind("app-store")
        .bind(&item.code)
        .bind(json_string(&item.tags))
        .bind(icon_media_resource_id)
        .bind(icon_object_blob_id)
        .bind(icon_resource_snapshot)
        .bind(item.sort_weight)
        .bind(&item.path)
        .bind(true)
        .bind(ACTIVE_STATUS)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn postgres_stale_app_seed_count(
    pool: &PgPool,
    catalog: &AppSeedCatalog,
) -> Result<i64, sqlx::Error> {
    let current_uuids = app_seed_uuids(catalog);
    let rows = sqlx::query(
        r#"
        SELECT uuid
        FROM plus_app
        WHERE tenant_id = $1
          AND organization_id = $2
          AND uuid LIKE 'sdkwork-app-%'
          AND (
              status <> $3
              OR COALESCE(NULLIF(config -> 'portal' ->> 'marketStatus', ''), NULLIF(config ->> 'marketStatus', ''), 'DRAFT') <> 'OFFLINE'
          )
        "#,
    )
    .bind(APP_STORE_TENANT_ID)
    .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
    .bind(INACTIVE_STATUS)
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .filter(|row| {
            let uuid = row.get::<String, _>("uuid");
            !current_uuids.contains(uuid.as_str())
        })
        .count() as i64)
}

async fn postgres_stale_app_category_count(
    pool: &PgPool,
    catalog: &AppSeedCatalog,
) -> Result<i64, sqlx::Error> {
    let current_uuids = category_seed_uuids(catalog);
    let rows = sqlx::query(
        r#"
        SELECT uuid
        FROM plus_category
        WHERE tenant_id = $1
          AND organization_id = $2
          AND type = $3
          AND group_name = $4
          AND uuid LIKE 'sdkwork-app-category-%'
          AND (
              status <> $5
              OR visible <> false
          )
        "#,
    )
    .bind(APP_STORE_TENANT_ID)
    .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
    .bind(APP_CATEGORY_TYPE_OTHER)
    .bind("app-store")
    .bind(INACTIVE_STATUS)
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .filter(|row| {
            let uuid = row.get::<String, _>("uuid");
            !current_uuids.contains(uuid.as_str())
        })
        .count() as i64)
}

async fn postgres_asset_seed_standard_count(
    pool: &PgPool,
    assets: &[AppAssetSeed],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in assets {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM studio_catalog_asset
            WHERE uuid = $1
              AND tenant_id = $2
              AND organization_id = $3
              AND data_scope = $4
              AND status = $5
              AND target_type = $6
              AND target_id = $7
              AND artifact_id IS NULL
              AND asset_type = $8
              AND asset_media_resource_id = $9
              AND asset_object_blob_id IS NOT DISTINCT FROM $10
              AND asset_resource_snapshot = $11::jsonb
              AND thumbnail_media_resource_id IS NOT DISTINCT FROM $12
              AND thumbnail_object_blob_id IS NOT DISTINCT FROM $13
              AND thumbnail_resource_snapshot IS NOT DISTINCT FROM $14::jsonb
              AND title IS NOT DISTINCT FROM $15
              AND alt_text IS NOT DISTINCT FROM $16
              AND mime_type IS NOT DISTINCT FROM $17
              AND width IS NOT DISTINCT FROM $18
              AND height IS NOT DISTINCT FROM $19
              AND duration_seconds = CAST($20 AS NUMERIC)
              AND file_size IS NOT DISTINCT FROM $21
              AND sort_order = $22
              AND published_at IS NOT DISTINCT FROM $23::timestamptz
              AND deleted_at IS NULL
            "#,
        )
        .bind(&item.uuid)
        .bind(item.tenant_id)
        .bind(item.organization_id)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(APP_TARGET_TYPE)
        .bind(item.target_id)
        .bind(item.asset_type)
        .bind(media_resource_stable_id(&item.asset))
        .bind(media_resource_object_blob_id(&item.asset))
        .bind(item.asset.to_string())
        .bind(item.thumbnail.as_ref().map(media_resource_stable_id))
        .bind(
            item.thumbnail
                .as_ref()
                .and_then(media_resource_object_blob_id),
        )
        .bind(item.thumbnail.as_ref().map(Value::to_string))
        .bind(&item.title)
        .bind(&item.alt_text)
        .bind(&item.mime_type)
        .bind(item.width)
        .bind(item.height)
        .bind(item.duration_seconds.as_deref().unwrap_or("0"))
        .bind(item.file_size)
        .bind(item.sort_order)
        .bind(&item.published_at)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn postgres_artifact_seed_standard_count(
    pool: &PgPool,
    artifacts: &[AppArtifactSeed],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in artifacts {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM studio_catalog_artifact
            WHERE uuid = $1
              AND tenant_id = $2
              AND organization_id = $3
              AND data_scope = $4
              AND status = $5
              AND target_type = $6
              AND target_id = $7
              AND artifact_type = $8
              AND version = $9
              AND platform_type = $10
              AND os_name = $11
              AND artifact_ref IS NOT DISTINCT FROM $12
              AND artifact_resource_snapshot IS NOT DISTINCT FROM $13::jsonb
              AND artifact_size_bytes = $14
              AND runtime IS NOT DISTINCT FROM $15
              AND frameworks = $16::jsonb
              AND license_name IS NOT DISTINCT FROM $17
              AND checksum_hash IS NOT DISTINCT FROM $18
              AND release_notes IS NOT DISTINCT FROM $19
              AND published_at IS NOT DISTINCT FROM $20::timestamptz
              AND deprecated_at IS NULL
              AND deleted_at IS NULL
            "#,
        )
        .bind(&item.uuid)
        .bind(item.tenant_id)
        .bind(item.organization_id)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(item.status)
        .bind(APP_TARGET_TYPE)
        .bind(item.target_id)
        .bind(item.artifact_type)
        .bind(&item.version)
        .bind(&item.platform_type)
        .bind(&item.os_name)
        .bind(&item.artifact_ref)
        .bind(item.artifact.as_ref().map(Value::to_string))
        .bind(item.artifact_size_bytes)
        .bind(&item.runtime)
        .bind(json_string(&item.frameworks))
        .bind(&item.license_name)
        .bind(&item.checksum_hash)
        .bind(&item.release_notes)
        .bind(&item.published_at)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn postgres_stale_app_asset_count(
    pool: &PgPool,
    catalog: &AppSeedCatalog,
) -> Result<i64, sqlx::Error> {
    let current_uuids = catalog
        .assets
        .iter()
        .map(|item| item.uuid.as_str())
        .collect::<BTreeSet<_>>();
    let rows = sqlx::query(
        r#"
        SELECT uuid
        FROM studio_catalog_asset
        WHERE tenant_id = $1
          AND organization_id = $2
          AND target_type = $3
          AND metadata ->> 'seedKind' = $4
          AND metadata ->> 'itemType' = 'app_asset'
          AND deleted_at IS NULL
        "#,
    )
    .bind(APP_STORE_TENANT_ID)
    .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
    .bind(APP_TARGET_TYPE)
    .bind(&catalog.bundle.kind)
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .filter(|row| {
            let uuid = row.get::<String, _>("uuid");
            !current_uuids.contains(uuid.as_str())
        })
        .count() as i64)
}

async fn postgres_stale_app_artifact_count(
    pool: &PgPool,
    catalog: &AppSeedCatalog,
) -> Result<i64, sqlx::Error> {
    let current_uuids = catalog
        .artifacts
        .iter()
        .map(|item| item.uuid.as_str())
        .collect::<BTreeSet<_>>();
    let rows = sqlx::query(
        r#"
        SELECT uuid
        FROM studio_catalog_artifact
        WHERE tenant_id = $1
          AND organization_id = $2
          AND target_type = $3
          AND metadata ->> 'seedKind' = $4
          AND metadata ->> 'itemType' = 'app_artifact'
          AND deleted_at IS NULL
        "#,
    )
    .bind(APP_STORE_TENANT_ID)
    .bind(INSTALL_PROJECTION_ORGANIZATION_ID)
    .bind(APP_TARGET_TYPE)
    .bind(&catalog.bundle.kind)
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .filter(|row| {
            let uuid = row.get::<String, _>("uuid");
            !current_uuids.contains(uuid.as_str())
        })
        .count() as i64)
}

fn app_uuid(app_key: &str) -> String {
    format!("sdkwork-app-{app_key}")
}

fn app_seed_uuids(catalog: &AppSeedCatalog) -> BTreeSet<String> {
    catalog
        .bundle
        .apps
        .iter()
        .map(|entry| app_uuid(&entry.app_key))
        .collect()
}

fn category_seed_uuids(catalog: &AppSeedCatalog) -> BTreeSet<String> {
    catalog
        .categories
        .iter()
        .map(|category| category.uuid.clone())
        .collect()
}

fn stable_app_id(index: usize) -> i64 {
    20_001_000 + index as i64 + 1
}

fn install_projection_organization_id(entry: &AppSeedEntry) -> i64 {
    let _source_organization_id = entry.organization_id;
    INSTALL_PROJECTION_ORGANIZATION_ID
}

fn app_status_code(status: &str) -> Result<i32, sqlx::Error> {
    match status.trim() {
        "ACTIVE" => Ok(ACTIVE_STATUS),
        "INACTIVE" => Ok(INACTIVE_STATUS),
        _ => Err(sqlx::Error::Protocol(format!(
            "invalid bundled app runtime status `{status}`: expected ACTIVE or INACTIVE"
        ))),
    }
}

fn app_category_name(entry: &AppSeedEntry) -> String {
    if let Some(category) = first_non_empty(&[
        json_path_text(&entry.plus_app.config, &["portal", "category"]),
        json_path_text(&entry.plus_app.config, &["category"]),
        json_path_text(&entry.plus_app.install_config, &["portal", "category"]),
    ]) {
        return category;
    }

    let raw = normalize_text(entry.plus_app.app_type.as_deref().unwrap_or_default());
    let raw = raw.strip_prefix("APP_").unwrap_or(&raw).replace('_', " ");
    non_empty(raw, "General")
}

fn app_category_code(name: &str) -> String {
    format!("app-store-{}", normalize_code(name))
}

fn app_category_id(code: &str) -> i64 {
    match code {
        "app-store-html" => 20_002_001,
        "app-store-react" => 20_002_002,
        "app-store-flutter" => 20_002_003,
        _ => 20_002_000 + stable_hash_mod(code, 900_000),
    }
}

fn app_category_icon_columns(item: &AppCategorySeed) -> (String, Option<i64>, String) {
    let icon = item.icon.clone();
    (
        media_resource_stable_id(&icon),
        media_resource_object_blob_id(&icon),
        icon.to_string(),
    )
}

fn app_icon(entry: &AppSeedEntry) -> Option<Value> {
    Some(entry.plus_app.icon.clone())
}

fn app_artifact_columns(entry: &AppSeedEntry) -> (Option<String>, Option<i64>, Option<String>) {
    let artifact = entry.plus_app.artifact.as_ref();
    (
        artifact.map(media_resource_stable_id),
        artifact.and_then(media_resource_object_blob_id),
        artifact.map(Value::to_string),
    )
}

fn icon_json(entry: &AppSeedEntry) -> String {
    serde_json::json!({
        "resource": app_icon(entry),
        "appKey": entry.app_key,
    })
    .to_string()
}

fn resource_list_json(entry: &AppSeedEntry) -> String {
    let screenshots = entry
        .plus_app
        .config
        .pointer("/media/screenshots")
        .cloned()
        .unwrap_or_else(|| serde_json::json!([]));
    let previews = entry
        .plus_app
        .config
        .pointer("/media/previews")
        .cloned()
        .unwrap_or_else(|| serde_json::json!([]));
    serde_json::json!({
        "screenshots": screenshots,
        "previews": previews,
        "cover": app_icon(entry),
    })
    .to_string()
}

fn package_os_name(package: &Value, platform_type: &str) -> String {
    [
        normalize_code(platform_type),
        normalize_code(&json_text(package, "architecture")),
        normalize_code(&json_text(package, "packageFormat")),
    ]
    .into_iter()
    .filter(|value| !value.is_empty())
    .collect::<Vec<_>>()
    .join("-")
}

fn package_frameworks(entry: &AppSeedEntry, package: &Value) -> Vec<String> {
    let mut frameworks = BTreeSet::new();
    for value in [
        json_path_text(&entry.plus_app.config, &["standard", "framework"]),
        json_text(package, "sourceType"),
        json_text(package, "packageFormat"),
        json_text(package, "architecture"),
    ] {
        let value = normalize_text(&value);
        if !value.is_empty() {
            frameworks.insert(value);
        }
    }
    frameworks.into_iter().collect()
}

fn release_note_for_package<'a>(entry: &'a AppSeedEntry, package_id: &str) -> Option<&'a Value> {
    let notes = entry.plus_app.release_notes.as_array()?;
    notes
        .iter()
        .find(|note| {
            note.get("packageIds")
                .and_then(Value::as_array)
                .map(|package_ids| {
                    package_ids
                        .iter()
                        .filter_map(Value::as_str)
                        .any(|value| value == package_id)
                })
                .unwrap_or(false)
        })
        .or_else(|| {
            notes
                .iter()
                .find(|note| json_bool_default(note, "current", false))
        })
        .or_else(|| notes.first())
}

fn release_note_text(note: Option<&Value>) -> Option<String> {
    let note = note?;
    first_non_empty(&[
        json_text(note, "summary"),
        json_text(note, "content"),
        json_string_array(note, "highlights").join("; "),
        json_text(note, "title"),
    ])
}

fn package_checksum(package: &Value) -> Option<String> {
    let checksum = json_text(package, "checksum");
    if checksum.is_empty() {
        return None;
    }
    let algorithm = json_text(package, "checksumAlgorithm");
    if algorithm.is_empty() {
        Some(checksum)
    } else {
        Some(format!("{algorithm}:{checksum}"))
    }
}

fn media_enabled(media: &Value) -> bool {
    json_bool_default(media, "enabled", true)
}

fn media_resource_from_value(value: &Value, kind: &str) -> Option<Value> {
    let object = value.as_object()?;
    let resource_kind = object.get("kind").and_then(Value::as_str)?.trim();
    let source = object.get("source").and_then(Value::as_str)?.trim();
    if resource_kind != kind || source.is_empty() || media_resource_locator(value).is_none() {
        return None;
    }
    Some(Value::Object(object.clone()))
}

fn external_url_media_resource(url: &str, kind: &str) -> Value {
    let url = normalize_text(url);
    serde_json::json!({
        "kind": kind,
        "source": "external_url",
        "url": url,
        "publicUrl": url,
    })
}

fn media_kind_for_asset(asset_type: i32, mime_type: Option<&str>) -> &'static str {
    let mime_type = mime_type.unwrap_or_default().trim().to_ascii_lowercase();
    if mime_type.starts_with("video/") {
        return "video";
    }
    if mime_type.starts_with("image/") {
        return "image";
    }
    match asset_type {
        APP_ASSET_TYPE_ICON | APP_ASSET_TYPE_SCREENSHOT => "image",
        APP_ASSET_TYPE_PREVIEW => "video",
        _ => "other",
    }
}

fn seed_metadata(
    bundle: &AppSeedBundle,
    item_type: &str,
    item_uuid: &str,
    app_key: &str,
) -> String {
    serde_json::json!({
        "seedKind": bundle.kind,
        "schemaVersion": bundle.schema_version,
        "declaredCount": bundle.count,
        "seedSource": bundle.source,
        "itemType": item_type,
        "itemUuid": item_uuid,
        "appKey": app_key,
        "sourceHash": seed_hash(),
    })
    .to_string()
}

fn seed_hash() -> String {
    let mut hasher = Sha256::new();
    hasher.update(APP_SEED_JSON.as_bytes());
    hex::encode(hasher.finalize())
}

fn compact_seed_uuid(prefix: &str, parts: &[&str]) -> String {
    let mut hasher = Sha256::new();
    for part in parts {
        hasher.update(part.as_bytes());
        hasher.update([0]);
    }
    let digest = hasher.finalize();
    format!("{prefix}-{}", hex::encode(&digest[..12]))
}

fn stable_hash_mod(value: &str, modulo: i64) -> i64 {
    let mut hash = 14_695_981_039_346_656_037_u64;
    for byte in value.as_bytes() {
        hash ^= u64::from(*byte);
        hash = hash.wrapping_mul(1_099_511_628_211);
    }
    (hash % modulo as u64) as i64
}

fn json_string<T: serde::Serialize>(value: &T) -> String {
    serde_json::to_string(value).unwrap_or_else(|_| "[]".to_owned())
}

fn json_text(value: &Value, key: &str) -> String {
    value
        .get(key)
        .and_then(value_to_string)
        .map(|value| normalize_text(&value))
        .unwrap_or_default()
}

fn json_text_optional(value: &Value, key: &str) -> Option<String> {
    let text = json_text(value, key);
    (!text.is_empty()).then_some(text)
}

fn json_path_text(value: &Value, path: &[&str]) -> String {
    let mut current = Some(value);
    for segment in path {
        current = current.and_then(|value| value.get(*segment));
    }
    current
        .and_then(value_to_string)
        .map(|value| normalize_text(&value))
        .unwrap_or_default()
}

fn json_i64(value: &Value, key: &str) -> Option<i64> {
    value.get(key).and_then(|value| match value {
        Value::Number(number) => number.as_i64(),
        Value::String(value) => value.trim().parse::<i64>().ok(),
        _ => None,
    })
}

fn json_bool_default(value: &Value, key: &str, default: bool) -> bool {
    value
        .get(key)
        .and_then(|value| match value {
            Value::Bool(value) => Some(*value),
            Value::Number(value) => value.as_i64().map(|value| value != 0),
            Value::String(value) => match value.trim().to_ascii_lowercase().as_str() {
                "true" | "1" | "yes" | "enabled" => Some(true),
                "false" | "0" | "no" | "disabled" => Some(false),
                _ => None,
            },
            _ => None,
        })
        .unwrap_or(default)
}

fn json_string_array(value: &Value, key: &str) -> Vec<String> {
    value
        .get(key)
        .and_then(Value::as_array)
        .map(|items| {
            items
                .iter()
                .filter_map(value_to_string)
                .map(|value| normalize_text(&value))
                .filter(|value| !value.is_empty())
                .collect()
        })
        .unwrap_or_default()
}

fn value_to_string(value: &Value) -> Option<String> {
    match value {
        Value::String(value) => Some(value.clone()),
        Value::Number(value) => Some(value.to_string()),
        Value::Bool(value) => Some(value.to_string()),
        Value::Object(object) => object
            .get("publicUrl")
            .or_else(|| object.get("url"))
            .or_else(|| object.get("uri"))
            .or_else(|| object.get("name"))
            .or_else(|| object.get("label"))
            .and_then(value_to_string),
        _ => None,
    }
}

fn mime_type_from_format(format: &str) -> String {
    match format.trim().to_ascii_lowercase().as_str() {
        "png" => "image/png".to_owned(),
        "jpg" | "jpeg" => "image/jpeg".to_owned(),
        "webp" => "image/webp".to_owned(),
        "gif" => "image/gif".to_owned(),
        "mp4" => "video/mp4".to_owned(),
        _ => String::new(),
    }
}

fn first_non_empty(values: &[String]) -> Option<String> {
    values
        .iter()
        .map(|value| normalize_text(value))
        .find(|value| !value.is_empty())
}

fn non_empty(value: String, fallback: &str) -> String {
    let normalized = normalize_text(&value);
    if normalized.is_empty() {
        fallback.to_owned()
    } else {
        normalized
    }
}

fn normalize_text(value: &str) -> String {
    value.split_whitespace().collect::<Vec<_>>().join(" ")
}

fn normalize_code(value: &str) -> String {
    let mut normalized = String::new();
    let mut last_dash = false;
    for ch in value.trim().chars() {
        if ch.is_ascii_alphanumeric() {
            normalized.push(ch.to_ascii_lowercase());
            last_dash = false;
        } else if !last_dash {
            normalized.push('-');
            last_dash = true;
        }
    }
    normalized.trim_matches('-').to_owned()
}

fn json_decode_error(error: AppSeedLoadError) -> sqlx::Error {
    sqlx::Error::Protocol(format!("invalid bundled app seed data: {error}"))
}
