use serde::Deserialize;
use sha2::{Digest, Sha256};
use sqlx::{PgPool, QueryBuilder, Row, Sqlite, SqlitePool};

use crate::infrastructure::sql::sql_admin_product_center::{
    media_resource_object_blob_id, media_resource_stable_id,
};

const MANIFEST_JSON: &str = include_str!("../../../../../data/skills/install-manifest.json");
const CATEGORIES_JSON: &str = include_str!("../../../../../data/skills/categories.json");
const PACKAGES_JSON: &str = include_str!("../../../../../data/skills/packages.json");
const SKILLS_JSON: &str = include_str!("../../../../../data/skills/skills.json");
const ASSETS_JSON: &str = include_str!("../../../../../data/skills/assets.json");
const ARTIFACTS_JSON: &str = include_str!("../../../../../data/skills/artifacts.json");
const CORE_SKILLS_JSON: &str = include_str!("../../../../../data/skills/core-skills.json");
const CORE_ASSETS_JSON: &str = include_str!("../../../../../data/skills/core-assets.json");
const CORE_ARTIFACTS_JSON: &str = include_str!("../../../../../data/skills/core-artifacts.json");

const SYSTEM_TENANT_ID: i64 = 0;
const SYSTEM_ORGANIZATION_ID: i64 = 0;
const SYSTEM_DATA_SCOPE: i32 = 0;
const ACTIVE_STATUS: i32 = 1;
const SKILL_TARGET_TYPE: i32 = 35;
const SQLITE_MAX_BIND_PARAMETERS: usize = 999;
const SQLITE_COUNT_BATCH_SIZE: usize = 900;
const SQLITE_SKILL_INSERT_BIND_COUNT: usize = 50;
const SQLITE_ASSET_INSERT_BIND_COUNT: usize = 26;
const SQLITE_ARTIFACT_INSERT_BIND_COUNT: usize = 25;
const SQLITE_SKILL_INSERT_BATCH_SIZE: usize =
    SQLITE_MAX_BIND_PARAMETERS / SQLITE_SKILL_INSERT_BIND_COUNT;
const SQLITE_ASSET_INSERT_BATCH_SIZE: usize =
    SQLITE_MAX_BIND_PARAMETERS / SQLITE_ASSET_INSERT_BIND_COUNT;
const SQLITE_ARTIFACT_INSERT_BATCH_SIZE: usize =
    SQLITE_MAX_BIND_PARAMETERS / SQLITE_ARTIFACT_INSERT_BIND_COUNT;
const BUNDLED_SKILLS_SEED_SKILL_COUNT: usize = 65_539;
const BUNDLED_SKILLS_SEED_ASSET_COUNT: usize = 65_539;
const BUNDLED_SKILLS_SEED_ARTIFACT_COUNT: usize = 65_539;
const BUNDLED_SKILLS_SEED_SOURCE_HASH: &str =
    "892e1f301eb5550379ec4de19526773b273d442792a2f69bbb8b3891a13f04be";
const CORE_SKILL_IDS: [i64; 3] = [8101, 8102, 8103];

fn category_type_from_legacy_seed(group_name: Option<&str>, legacy_type: i32) -> &'static str {
    crate::application::c_category_type_scope(legacy_type, "", group_name)
        .unwrap_or("skill_market")
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SkillsSeedManifest {
    catalog_code: String,
    catalog_version: String,
    schema_version: String,
    generated_at: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SkillCategorySeed {
    id: i64,
    uuid: String,
    name: String,
    description: Option<String>,
    shop_id: Option<i64>,
    r#type: i32,
    group_name: Option<String>,
    code: Option<String>,
    tags: Vec<String>,
    #[serde(default)]
    #[serde(deserialize_with = "deserialize_optional_media_resource")]
    icon: Option<serde_json::Value>,
    sort_weight: i32,
    parent_id: Option<i64>,
    path: Option<String>,
    visible: bool,
    status: i32,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SkillPackageSeed {
    id: i64,
    uuid: String,
    user_id: Option<i64>,
    package_key: String,
    name: String,
    summary: Option<String>,
    description: Option<String>,
    #[serde(default)]
    #[serde(deserialize_with = "deserialize_optional_media_resource")]
    icon: Option<serde_json::Value>,
    #[serde(default)]
    #[serde(deserialize_with = "deserialize_optional_media_resource")]
    cover: Option<serde_json::Value>,
    category_id: Option<i64>,
    enabled: bool,
    featured: bool,
    sort_weight: i32,
    tags: Vec<String>,
    latest_published_at: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AgentSkillSeed {
    id: i64,
    uuid: String,
    user_id: Option<i64>,
    skill_key: String,
    name: String,
    summary: Option<String>,
    description: Option<String>,
    #[serde(default)]
    #[serde(deserialize_with = "deserialize_optional_media_resource")]
    icon: Option<serde_json::Value>,
    #[serde(default)]
    #[serde(deserialize_with = "deserialize_optional_media_resource")]
    cover: Option<serde_json::Value>,
    category_id: Option<i64>,
    package_id: Option<i64>,
    provider: Option<String>,
    version: Option<String>,
    version_name: Option<String>,
    runtime: Option<String>,
    entrypoint: Option<String>,
    manifest_url: Option<String>,
    repository_url: Option<String>,
    homepage_url: Option<String>,
    documentation_url: Option<String>,
    license_name: Option<String>,
    source_type: String,
    market_status: String,
    visibility: String,
    review_status: String,
    review_comment: Option<String>,
    reviewed_by: Option<i64>,
    reviewed_at: Option<String>,
    builtin: bool,
    is_builtin: bool,
    enabled: bool,
    featured: bool,
    recommend_weight: i32,
    price: Option<String>,
    currency: String,
    install_count: i64,
    rating_avg: String,
    rating_count: i64,
    tags: Vec<String>,
    capabilities: Vec<String>,
    config_schema: serde_json::Value,
    default_config: serde_json::Value,
    latest_published_at: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CatalogAssetSeed {
    uuid: String,
    target_type: i32,
    target_id: i64,
    artifact_id: Option<i64>,
    asset_type: i32,
    #[serde(deserialize_with = "deserialize_required_media_resource")]
    asset: serde_json::Value,
    #[serde(default)]
    #[serde(deserialize_with = "deserialize_optional_media_resource")]
    thumbnail: Option<serde_json::Value>,
    title: Option<String>,
    alt_text: Option<String>,
    mime_type: Option<String>,
    width: Option<i32>,
    height: Option<i32>,
    duration_seconds: Option<String>,
    file_size: Option<i64>,
    sort_order: i32,
    published_at: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CatalogArtifactSeed {
    uuid: String,
    target_type: i32,
    target_id: i64,
    artifact_type: i32,
    version: String,
    platform_type: String,
    os_name: String,
    artifact_ref: Option<String>,
    #[serde(rename = "artifact")]
    #[serde(default)]
    #[serde(deserialize_with = "deserialize_optional_media_resource")]
    artifact_resource_snapshot: Option<serde_json::Value>,
    artifact_size_bytes: i64,
    runtime: Option<String>,
    frameworks: Vec<String>,
    license_name: Option<String>,
    checksum_hash: Option<String>,
    release_notes: Option<String>,
    published_at: Option<String>,
    deprecated_at: Option<String>,
}

#[derive(Debug, Clone)]
struct SkillsSeedCatalog {
    manifest: SkillsSeedManifest,
    categories: Vec<SkillCategorySeed>,
    packages: Vec<SkillPackageSeed>,
    skills: Vec<AgentSkillSeed>,
    assets: Vec<CatalogAssetSeed>,
    artifacts: Vec<CatalogArtifactSeed>,
}

#[derive(Debug, Clone)]
struct SkillsSeedIntegrityCatalog {
    manifest: SkillsSeedManifest,
    categories: Vec<SkillCategorySeed>,
    packages: Vec<SkillPackageSeed>,
    skill_count: usize,
    asset_count: usize,
    artifact_count: usize,
    source_hash: String,
}

#[derive(Debug, Clone)]
struct SkillsSeedCoreCatalog {
    manifest: SkillsSeedManifest,
    categories: Vec<SkillCategorySeed>,
    packages: Vec<SkillPackageSeed>,
    skills: Vec<AgentSkillSeed>,
    assets: Vec<CatalogAssetSeed>,
    artifacts: Vec<CatalogArtifactSeed>,
    source_hash: String,
}

impl SkillsSeedCatalog {
    fn load() -> Result<Self, serde_json::Error> {
        Ok(Self {
            manifest: serde_json::from_str(MANIFEST_JSON)?,
            categories: serde_json::from_str(CATEGORIES_JSON)?,
            packages: serde_json::from_str(PACKAGES_JSON)?,
            skills: serde_json::from_str(SKILLS_JSON)?,
            assets: serde_json::from_str(ASSETS_JSON)?,
            artifacts: serde_json::from_str(ARTIFACTS_JSON)?,
        })
    }
}

fn deserialize_optional_media_resource<'de, D>(
    deserializer: D,
) -> Result<Option<serde_json::Value>, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let raw = Option::<serde_json::Value>::deserialize(deserializer)?;
    raw.map(validate_seed_media_resource).transpose()
}

fn deserialize_required_media_resource<'de, D>(
    deserializer: D,
) -> Result<serde_json::Value, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let raw = serde_json::Value::deserialize(deserializer)?;
    validate_seed_media_resource(raw)
}

fn validate_seed_media_resource<E>(value: serde_json::Value) -> Result<serde_json::Value, E>
where
    E: serde::de::Error,
{
    let object = value
        .as_object()
        .ok_or_else(|| E::custom("seed media resource must be an object"))?;
    let kind = object
        .get("kind")
        .and_then(serde_json::Value::as_str)
        .map(str::trim)
        .filter(|value| !value.is_empty());
    let source = object
        .get("source")
        .and_then(serde_json::Value::as_str)
        .map(str::trim)
        .filter(|value| !value.is_empty());
    let locator = ["publicUrl", "url", "uri", "objectKey", "objectBlobId", "id"]
        .iter()
        .find_map(|key| {
            object
                .get(*key)
                .and_then(|value| match value {
                    serde_json::Value::String(text) => Some(text.trim().to_owned()),
                    serde_json::Value::Number(number) => Some(number.to_string()),
                    _ => None,
                })
                .filter(|value| !value.is_empty())
        });
    if kind.is_none() || source.is_none() || locator.is_none() {
        return Err(E::custom(
            "seed media resource must include kind, source, and a stable locator",
        ));
    }
    Ok(value)
}

impl SkillsSeedIntegrityCatalog {
    fn load() -> Result<Self, serde_json::Error> {
        Ok(Self {
            manifest: serde_json::from_str(MANIFEST_JSON)?,
            categories: serde_json::from_str(CATEGORIES_JSON)?,
            packages: serde_json::from_str(PACKAGES_JSON)?,
            skill_count: BUNDLED_SKILLS_SEED_SKILL_COUNT,
            asset_count: BUNDLED_SKILLS_SEED_ASSET_COUNT,
            artifact_count: BUNDLED_SKILLS_SEED_ARTIFACT_COUNT,
            source_hash: BUNDLED_SKILLS_SEED_SOURCE_HASH.to_owned(),
        })
    }

    fn payload(&self) -> String {
        serde_json::json!({
            "catalogCode": self.manifest.catalog_code,
            "catalogVersion": self.manifest.catalog_version,
            "schemaVersion": self.manifest.schema_version,
            "generatedAt": self.manifest.generated_at,
            "categoryCount": self.categories.len(),
            "packageCount": self.packages.len(),
            "skillCount": self.skill_count,
            "assetCount": self.asset_count,
            "artifactCount": self.artifact_count,
        })
        .to_string()
    }
}

impl SkillsSeedCoreCatalog {
    fn load() -> Result<Self, serde_json::Error> {
        Ok(Self {
            manifest: serde_json::from_str(MANIFEST_JSON)?,
            categories: serde_json::from_str(CATEGORIES_JSON)?,
            packages: serde_json::from_str(PACKAGES_JSON)?,
            skills: core_skill_seed_rows()?,
            assets: core_asset_seed_rows()?,
            artifacts: core_artifact_seed_rows()?,
            source_hash: BUNDLED_SKILLS_SEED_SOURCE_HASH.to_owned(),
        })
    }
}

fn core_skill_seed_rows() -> Result<Vec<AgentSkillSeed>, serde_json::Error> {
    parse_core_seed_rows(CORE_SKILLS_JSON, |item: &AgentSkillSeed| item.id)
}

fn core_asset_seed_rows() -> Result<Vec<CatalogAssetSeed>, serde_json::Error> {
    parse_core_seed_rows(CORE_ASSETS_JSON, |item: &CatalogAssetSeed| item.target_id)
}

fn core_artifact_seed_rows() -> Result<Vec<CatalogArtifactSeed>, serde_json::Error> {
    parse_core_seed_rows(CORE_ARTIFACTS_JSON, |item: &CatalogArtifactSeed| {
        item.target_id
    })
}

fn parse_core_seed_rows<T, F>(json: &str, id: F) -> Result<Vec<T>, serde_json::Error>
where
    T: for<'de> Deserialize<'de>,
    F: Fn(&T) -> i64,
{
    let rows: Vec<T> = serde_json::from_str(json)?;
    if rows.len() != CORE_SKILL_IDS.len()
        || !CORE_SKILL_IDS
            .iter()
            .all(|expected| rows.iter().any(|row| id(row) == *expected))
    {
        return Err(serde::de::Error::custom(
            "core bundled skills seed data does not match the canonical repair set",
        ));
    }
    Ok(rows)
}

impl SkillsSeedCatalog {
    fn integrity_catalog(&self) -> SkillsSeedIntegrityCatalog {
        let mut catalog = SkillsSeedIntegrityCatalog {
            manifest: self.manifest.clone(),
            categories: self.categories.clone(),
            packages: self.packages.clone(),
            skill_count: self.skills.len(),
            asset_count: self.assets.len(),
            artifact_count: self.artifacts.len(),
            source_hash: String::new(),
        };
        catalog.source_hash = skills_seed_payload_hash(catalog.payload().as_str());
        catalog
    }
}

impl From<&SkillsSeedCatalog> for SkillsSeedIntegrityCatalog {
    fn from(seed: &SkillsSeedCatalog) -> Self {
        seed.integrity_catalog()
    }
}

impl SkillsSeedCatalog {
    fn payload(&self) -> String {
        SkillsSeedIntegrityCatalog::from(self).payload()
    }
}

pub(crate) fn bundled_skills_seed_payload() -> Result<String, serde_json::Error> {
    Ok(SkillsSeedIntegrityCatalog::load()?.payload())
}

pub(crate) async fn import_sqlite_skills_seed(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    let seed = SkillsSeedCatalog::load().map_err(json_decode_error)?;
    let mut tx = pool.begin().await?;
    import_sqlite_categories(&mut tx, &seed).await?;
    import_sqlite_packages(&mut tx, &seed).await?;
    import_sqlite_skills(&mut tx, &seed).await?;
    import_sqlite_assets(&mut tx, &seed).await?;
    import_sqlite_artifacts(&mut tx, &seed).await?;
    tx.commit().await?;
    Ok(())
}

pub(crate) async fn repair_incomplete_sqlite_skills_seed(
    pool: &SqlitePool,
) -> Result<(), sqlx::Error> {
    let seed = SkillsSeedCoreCatalog::load().map_err(json_decode_error)?;

    let mut tx = pool.begin().await?;
    import_sqlite_category_rows(&mut tx, &seed.categories).await?;
    import_sqlite_package_rows(&mut tx, &seed.packages).await?;
    import_sqlite_skill_rows(&mut tx, &seed.skills).await?;
    import_sqlite_asset_rows(
        &mut tx,
        &seed.manifest,
        &seed.assets,
        seed.source_hash.as_str(),
    )
    .await?;
    import_sqlite_artifact_rows(
        &mut tx,
        &seed.manifest,
        &seed.artifacts,
        seed.source_hash.as_str(),
    )
    .await?;
    tx.commit().await?;
    Ok(())
}

pub(crate) async fn import_postgres_skills_seed(pool: &PgPool) -> Result<(), sqlx::Error> {
    let seed = SkillsSeedCatalog::load().map_err(json_decode_error)?;
    let mut tx = pool.begin().await?;
    import_postgres_categories(&mut tx, &seed).await?;
    import_postgres_packages(&mut tx, &seed).await?;
    import_postgres_skills(&mut tx, &seed).await?;
    import_postgres_assets(&mut tx, &seed).await?;
    import_postgres_artifacts(&mut tx, &seed).await?;
    tx.commit().await?;
    Ok(())
}

pub(crate) async fn postgres_skills_seed_complete(pool: &PgPool) -> Result<bool, sqlx::Error> {
    let seed = SkillsSeedIntegrityCatalog::load().map_err(json_decode_error)?;
    let category_count = postgres_category_seed_standard_count(pool, &seed.categories).await?;
    let package_count = postgres_package_seed_standard_count(pool, &seed.packages).await?;
    let official_skill_count = postgres_official_skill_seed_standard_count(pool).await?;
    let skill_count = postgres_skill_seed_count(pool).await?;
    let asset_count = postgres_skill_projection_seed_count(
        pool,
        "ai_skill_asset",
        "skill_asset",
        &seed.source_hash,
    )
    .await?;
    let artifact_count = postgres_skill_projection_seed_count(
        pool,
        "ai_skill_artifact",
        "skill_artifact",
        &seed.source_hash,
    )
    .await?;
    Ok(category_count == seed.categories.len() as i64
        && package_count == seed.packages.len() as i64
        && official_skill_count >= 3
        && skill_count == seed.skill_count as i64
        && asset_count == seed.asset_count as i64
        && artifact_count == seed.artifact_count as i64)
}

pub(crate) async fn sqlite_skills_seed_current(pool: &SqlitePool) -> Result<bool, sqlx::Error> {
    let seed = SkillsSeedCoreCatalog::load().map_err(json_decode_error)?;
    let category_count = sqlite_category_seed_standard_count(pool, &seed.categories).await?;
    let package_count = sqlite_package_seed_standard_count(pool, &seed.packages).await?;
    let skill_count = sqlite_core_skill_seed_standard_count(pool, &seed.skills).await?;
    let asset_count = sqlite_core_asset_seed_standard_count(
        pool,
        &seed.manifest,
        &seed.assets,
        seed.source_hash.as_str(),
    )
    .await?;
    let artifact_count = sqlite_core_artifact_seed_standard_count(
        pool,
        &seed.manifest,
        &seed.artifacts,
        seed.source_hash.as_str(),
    )
    .await?;
    Ok(category_count == seed.categories.len() as i64
        && package_count == seed.packages.len() as i64
        && skill_count == seed.skills.len() as i64
        && asset_count == seed.assets.len() as i64
        && artifact_count == seed.artifacts.len() as i64)
}

pub(crate) async fn postgres_skills_seed_current(pool: &PgPool) -> Result<bool, sqlx::Error> {
    let seed = SkillsSeedCoreCatalog::load().map_err(json_decode_error)?;
    let category_count = postgres_category_seed_standard_count(pool, &seed.categories).await?;
    let package_count = postgres_package_seed_standard_count(pool, &seed.packages).await?;
    let skill_count = postgres_core_skill_seed_standard_count(pool, &seed.skills).await?;
    let asset_count = postgres_core_asset_seed_standard_count(
        pool,
        &seed.manifest,
        &seed.assets,
        seed.source_hash.as_str(),
    )
    .await?;
    let artifact_count = postgres_core_artifact_seed_standard_count(
        pool,
        &seed.manifest,
        &seed.artifacts,
        seed.source_hash.as_str(),
    )
    .await?;
    Ok(category_count == seed.categories.len() as i64
        && package_count == seed.packages.len() as i64
        && skill_count == seed.skills.len() as i64
        && asset_count == seed.assets.len() as i64
        && artifact_count == seed.artifacts.len() as i64)
}

async fn import_sqlite_categories(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &SkillsSeedCatalog,
) -> Result<(), sqlx::Error> {
    import_sqlite_category_rows(tx, &seed.categories).await
}

async fn import_sqlite_category_rows(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    categories: &[SkillCategorySeed],
) -> Result<(), sqlx::Error> {
    for item in categories {
        let icon = item.icon.clone();
        let icon_media_resource_id = icon.as_ref().map(media_resource_stable_id);
        let icon_object_blob_id = icon.as_ref().and_then(media_resource_object_blob_id);
        let icon_resource_snapshot = icon.as_ref().map(serde_json::Value::to_string);
        sqlx::query(
            r#"
            INSERT INTO c_category
                (id, uuid, tenant_id, organization_id, data_scope, category_type, name, description, code, tags, icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot, sort_weight, parent_id, path, visible, status)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                uuid = excluded.uuid,
                tenant_id = excluded.tenant_id,
                organization_id = excluded.organization_id,
                data_scope = excluded.data_scope,
                name = excluded.name,
                description = excluded.description,
                category_type = excluded.category_type,
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
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(category_type_from_legacy_seed(item.group_name.as_deref(), item.r#type))
        .bind(&item.name)
        .bind(&item.description)
        .bind(&item.code)
        .bind(json_string(&item.tags))
        .bind(icon_media_resource_id)
        .bind(icon_object_blob_id)
        .bind(icon_resource_snapshot)
        .bind(item.sort_weight)
        .bind(item.parent_id)
        .bind(&item.path)
        .bind(item.visible)
        .bind(item.status)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_sqlite_packages(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &SkillsSeedCatalog,
) -> Result<(), sqlx::Error> {
    import_sqlite_package_rows(tx, &seed.packages).await
}

async fn import_sqlite_package_rows(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    packages: &[SkillPackageSeed],
) -> Result<(), sqlx::Error> {
    for item in packages {
        let icon = item.icon.clone();
        let icon_media_resource_id = icon.as_ref().map(media_resource_stable_id);
        let icon_object_blob_id = icon.as_ref().and_then(media_resource_object_blob_id);
        let icon_resource_snapshot = icon.as_ref().map(serde_json::Value::to_string);
        let cover_media_resource_id = item.cover.as_ref().map(media_resource_stable_id);
        let cover_object_blob_id = item.cover.as_ref().and_then(media_resource_object_blob_id);
        let cover_resource_snapshot = item.cover.as_ref().map(serde_json::Value::to_string);
        sqlx::query(
            r#"
            DELETE FROM ai_agent_skill_package
            WHERE id <> ?
              AND (
                    uuid = ?
                 OR (
                        tenant_id = ?
                    AND organization_id = ?
                    AND package_key = ?
                    )
              )
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(&item.package_key)
        .execute(&mut **tx)
        .await?;

        sqlx::query(
            r#"
            INSERT INTO ai_agent_skill_package
                (id, uuid, tenant_id, organization_id, data_scope, user_id, package_key, name, summary, description, icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot, cover_media_resource_id, cover_object_blob_id, cover_resource_snapshot, category_id, enabled, featured, sort_weight, tags, latest_published_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                uuid = excluded.uuid,
                tenant_id = excluded.tenant_id,
                organization_id = excluded.organization_id,
                data_scope = excluded.data_scope,
                user_id = excluded.user_id,
                package_key = excluded.package_key,
                name = excluded.name,
                summary = excluded.summary,
                description = excluded.description,
                icon_media_resource_id = excluded.icon_media_resource_id,
                icon_object_blob_id = excluded.icon_object_blob_id,
                icon_resource_snapshot = excluded.icon_resource_snapshot,
                cover_media_resource_id = excluded.cover_media_resource_id,
                cover_object_blob_id = excluded.cover_object_blob_id,
                cover_resource_snapshot = excluded.cover_resource_snapshot,
                category_id = excluded.category_id,
                enabled = excluded.enabled,
                featured = excluded.featured,
                sort_weight = excluded.sort_weight,
                tags = excluded.tags,
                latest_published_at = excluded.latest_published_at,
                updated_at = CURRENT_TIMESTAMP
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(item.user_id)
        .bind(&item.package_key)
        .bind(&item.name)
        .bind(&item.summary)
        .bind(&item.description)
        .bind(icon_media_resource_id)
        .bind(icon_object_blob_id)
        .bind(icon_resource_snapshot)
        .bind(cover_media_resource_id)
        .bind(cover_object_blob_id)
        .bind(cover_resource_snapshot)
        .bind(item.category_id)
        .bind(item.enabled)
        .bind(item.featured)
        .bind(item.sort_weight)
        .bind(json_string(&item.tags))
        .bind(&item.latest_published_at)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_sqlite_skills(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &SkillsSeedCatalog,
) -> Result<(), sqlx::Error> {
    import_sqlite_skill_rows(tx, &seed.skills).await
}

async fn import_sqlite_skill_rows(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    skills: &[AgentSkillSeed],
) -> Result<(), sqlx::Error> {
    for chunk in skills.chunks(SQLITE_SKILL_INSERT_BATCH_SIZE) {
        let mut query_builder: QueryBuilder<'_, Sqlite> = QueryBuilder::new(
            r#"
            INSERT INTO ai_agent_skill
                (id, uuid, tenant_id, organization_id, data_scope, user_id, skill_key, name, summary, description, icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot, cover_media_resource_id, cover_object_blob_id, cover_resource_snapshot, category_id, package_id, provider, version, version_name, runtime, entrypoint, manifest_url, repository_url, homepage_url, documentation_url, license_name, source_type, market_status, visibility, review_status, review_comment, reviewed_by, reviewed_at, builtin, is_builtin, enabled, featured, recommend_weight, price, currency, install_count, rating_avg, rating_count, tags, capabilities, config_schema, default_config, latest_published_at)
            "#,
        );
        query_builder.push_values(chunk, |mut row, item| {
            let icon = item.icon.clone();
            let icon_media_resource_id = icon.as_ref().map(media_resource_stable_id);
            let icon_object_blob_id = icon.as_ref().and_then(media_resource_object_blob_id);
            let icon_resource_snapshot = icon.as_ref().map(serde_json::Value::to_string);
            let cover_media_resource_id = item.cover.as_ref().map(media_resource_stable_id);
            let cover_object_blob_id = item.cover.as_ref().and_then(media_resource_object_blob_id);
            let cover_resource_snapshot = item.cover.as_ref().map(serde_json::Value::to_string);
            row.push_bind(item.id)
                .push_bind(&item.uuid)
                .push_bind(SYSTEM_TENANT_ID)
                .push_bind(SYSTEM_ORGANIZATION_ID)
                .push_bind(SYSTEM_DATA_SCOPE)
                .push_bind(item.user_id)
                .push_bind(&item.skill_key)
                .push_bind(&item.name)
                .push_bind(&item.summary)
                .push_bind(&item.description)
                .push_bind(icon_media_resource_id)
                .push_bind(icon_object_blob_id)
                .push_bind(icon_resource_snapshot)
                .push_bind(cover_media_resource_id)
                .push_bind(cover_object_blob_id)
                .push_bind(cover_resource_snapshot)
                .push_bind(item.category_id)
                .push_bind(item.package_id)
                .push_bind(&item.provider)
                .push_bind(&item.version)
                .push_bind(&item.version_name)
                .push_bind(&item.runtime)
                .push_bind(&item.entrypoint)
                .push_bind(&item.manifest_url)
                .push_bind(&item.repository_url)
                .push_bind(&item.homepage_url)
                .push_bind(&item.documentation_url)
                .push_bind(&item.license_name)
                .push_bind(&item.source_type)
                .push_bind(&item.market_status)
                .push_bind(&item.visibility)
                .push_bind(&item.review_status)
                .push_bind(&item.review_comment)
                .push_bind(item.reviewed_by)
                .push_bind(&item.reviewed_at)
                .push_bind(item.builtin)
                .push_bind(item.is_builtin)
                .push_bind(item.enabled)
                .push_bind(item.featured)
                .push_bind(item.recommend_weight)
                .push_bind(item.price.as_deref().unwrap_or("0"))
                .push_bind(&item.currency)
                .push_bind(item.install_count)
                .push_bind(&item.rating_avg)
                .push_bind(item.rating_count)
                .push_bind(json_string(&item.tags))
                .push_bind(json_string(&item.capabilities))
                .push_bind(item.config_schema.to_string())
                .push_bind(item.default_config.to_string())
                .push_bind(&item.latest_published_at);
        });
        query_builder.push(
            r#"
            ON CONFLICT(tenant_id, organization_id, skill_key) DO UPDATE SET
                uuid = excluded.uuid,
                user_id = excluded.user_id,
                name = excluded.name,
                summary = excluded.summary,
                description = excluded.description,
                icon_media_resource_id = excluded.icon_media_resource_id,
                icon_object_blob_id = excluded.icon_object_blob_id,
                icon_resource_snapshot = excluded.icon_resource_snapshot,
                cover_media_resource_id = excluded.cover_media_resource_id,
                cover_object_blob_id = excluded.cover_object_blob_id,
                cover_resource_snapshot = excluded.cover_resource_snapshot,
                category_id = excluded.category_id,
                package_id = excluded.package_id,
                provider = excluded.provider,
                version = excluded.version,
                version_name = excluded.version_name,
                runtime = excluded.runtime,
                entrypoint = excluded.entrypoint,
                manifest_url = excluded.manifest_url,
                repository_url = excluded.repository_url,
                homepage_url = excluded.homepage_url,
                documentation_url = excluded.documentation_url,
                license_name = excluded.license_name,
                source_type = excluded.source_type,
                market_status = excluded.market_status,
                visibility = excluded.visibility,
                review_status = excluded.review_status,
                review_comment = excluded.review_comment,
                reviewed_by = excluded.reviewed_by,
                reviewed_at = excluded.reviewed_at,
                builtin = excluded.builtin,
                is_builtin = excluded.is_builtin,
                enabled = excluded.enabled,
                featured = excluded.featured,
                recommend_weight = excluded.recommend_weight,
                price = excluded.price,
                currency = excluded.currency,
                install_count = excluded.install_count,
                rating_avg = excluded.rating_avg,
                rating_count = excluded.rating_count,
                tags = excluded.tags,
                capabilities = excluded.capabilities,
                config_schema = excluded.config_schema,
                default_config = excluded.default_config,
                latest_published_at = excluded.latest_published_at,
                updated_at = CURRENT_TIMESTAMP
            "#,
        );
        query_builder.build().execute(&mut **tx).await?;
    }
    Ok(())
}

async fn import_sqlite_assets(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &SkillsSeedCatalog,
) -> Result<(), sqlx::Error> {
    let seed_hash = seed_hash(seed);
    import_sqlite_asset_rows(tx, &seed.manifest, &seed.assets, seed_hash.as_str()).await
}

async fn import_sqlite_asset_rows(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    manifest: &SkillsSeedManifest,
    assets: &[CatalogAssetSeed],
    source_hash: &str,
) -> Result<(), sqlx::Error> {
    let asset_uuids = assets
        .iter()
        .map(|item| item.uuid.as_str())
        .collect::<Vec<_>>();
    delete_sqlite_seed_rows_by_text_values(tx, "ai_skill_asset", "uuid", &asset_uuids)
        .await?;
    for chunk in assets.chunks(SQLITE_ASSET_INSERT_BATCH_SIZE) {
        let mut query_builder: QueryBuilder<'_, Sqlite> = QueryBuilder::new(
            r#"
            INSERT INTO ai_skill_asset
                (uuid, tenant_id, organization_id, data_scope, status, metadata, target_type, target_id, artifact_id, asset_type, asset_media_resource_id, asset_object_blob_id, asset_resource_snapshot, thumbnail_media_resource_id, thumbnail_object_blob_id, thumbnail_resource_snapshot, title, alt_text, mime_type, width, height, duration_seconds, file_size, sort_order, published_at, id)
            "#,
        );
        query_builder.push_values(chunk, |mut row, item| {
            let asset_media_resource_id = media_resource_stable_id(&item.asset);
            let asset_object_blob_id = media_resource_object_blob_id(&item.asset);
            let asset_resource_snapshot = item.asset.to_string();
            let thumbnail_media_resource_id = item.thumbnail.as_ref().map(media_resource_stable_id);
            let thumbnail_object_blob_id = item
                .thumbnail
                .as_ref()
                .and_then(media_resource_object_blob_id);
            let thumbnail_resource_snapshot =
                item.thumbnail.as_ref().map(serde_json::Value::to_string);
            row.push_bind(&item.uuid)
                .push_bind(SYSTEM_TENANT_ID)
                .push_bind(SYSTEM_ORGANIZATION_ID)
                .push_bind(SYSTEM_DATA_SCOPE)
                .push_bind(ACTIVE_STATUS)
                .push_bind(seed_metadata_with_hash(
                    manifest,
                    source_hash,
                    "skill_asset",
                    &item.uuid,
                ))
                .push_bind(item.target_type)
                .push_bind(item.target_id)
                .push_bind(item.artifact_id)
                .push_bind(item.asset_type)
                .push_bind(asset_media_resource_id)
                .push_bind(asset_object_blob_id)
                .push_bind(asset_resource_snapshot)
                .push_bind(thumbnail_media_resource_id)
                .push_bind(thumbnail_object_blob_id)
                .push_bind(thumbnail_resource_snapshot)
                .push_bind(&item.title)
                .push_bind(&item.alt_text)
                .push_bind(&item.mime_type)
                .push_bind(item.width)
                .push_bind(item.height)
                .push_bind(item.duration_seconds.as_deref().unwrap_or("0"))
                .push_bind(item.file_size)
                .push_bind(item.sort_order)
                .push_bind(&item.published_at)
                .push_bind(stable_skill_asset_id(&item.uuid));
        });
        query_builder.build().execute(&mut **tx).await?;
    }
    Ok(())
}

async fn import_sqlite_artifacts(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &SkillsSeedCatalog,
) -> Result<(), sqlx::Error> {
    let seed_hash = seed_hash(seed);
    import_sqlite_artifact_rows(tx, &seed.manifest, &seed.artifacts, seed_hash.as_str()).await
}

async fn import_sqlite_artifact_rows(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    manifest: &SkillsSeedManifest,
    artifacts: &[CatalogArtifactSeed],
    source_hash: &str,
) -> Result<(), sqlx::Error> {
    let artifact_uuids = artifacts
        .iter()
        .map(|item| item.uuid.as_str())
        .collect::<Vec<_>>();
    delete_sqlite_seed_rows_by_text_values(tx, "ai_skill_artifact", "uuid", &artifact_uuids)
        .await?;
    for chunk in artifacts.chunks(SQLITE_ARTIFACT_INSERT_BATCH_SIZE) {
        let mut query_builder: QueryBuilder<'_, Sqlite> = QueryBuilder::new(
            r#"
            INSERT INTO ai_skill_artifact
                (uuid, tenant_id, organization_id, data_scope, status, metadata, target_type, target_id, artifact_type, version, platform_type, os_name, artifact_ref, artifact_media_resource_id, artifact_object_blob_id, artifact_resource_snapshot, artifact_size_bytes, runtime, frameworks, license_name, checksum_hash, release_notes, published_at, deprecated_at, id)
            "#,
        );
        query_builder.push_values(chunk, |mut row, item| {
            let artifact_media_resource_id = item
                .artifact_resource_snapshot
                .as_ref()
                .map(media_resource_stable_id);
            let artifact_object_blob_id = item
                .artifact_resource_snapshot
                .as_ref()
                .and_then(media_resource_object_blob_id);
            let artifact_resource_snapshot = item
                .artifact_resource_snapshot
                .as_ref()
                .map(serde_json::Value::to_string);
            row.push_bind(&item.uuid)
                .push_bind(SYSTEM_TENANT_ID)
                .push_bind(SYSTEM_ORGANIZATION_ID)
                .push_bind(SYSTEM_DATA_SCOPE)
                .push_bind(ACTIVE_STATUS)
                .push_bind(seed_metadata_with_hash(
                    manifest,
                    source_hash,
                    "skill_artifact",
                    &item.uuid,
                ))
                .push_bind(item.target_type)
                .push_bind(item.target_id)
                .push_bind(item.artifact_type)
                .push_bind(&item.version)
                .push_bind(&item.platform_type)
                .push_bind(&item.os_name)
                .push_bind(&item.artifact_ref)
                .push_bind(artifact_media_resource_id)
                .push_bind(artifact_object_blob_id)
                .push_bind(artifact_resource_snapshot)
                .push_bind(item.artifact_size_bytes)
                .push_bind(&item.runtime)
                .push_bind(json_string(&item.frameworks))
                .push_bind(&item.license_name)
                .push_bind(&item.checksum_hash)
                .push_bind(&item.release_notes)
                .push_bind(&item.published_at)
                .push_bind(&item.deprecated_at)
                .push_bind(stable_skill_artifact_id(&item.uuid));
        });
        query_builder.push(
            r#"
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
        );
        query_builder.build().execute(&mut **tx).await?;
    }
    Ok(())
}

async fn delete_sqlite_seed_rows_by_text_values(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    table_name: &str,
    column_name: &str,
    values: &[&str],
) -> Result<(), sqlx::Error> {
    for chunk in values.chunks(SQLITE_COUNT_BATCH_SIZE) {
        let placeholders = std::iter::repeat_n("?", chunk.len())
            .collect::<Vec<_>>()
            .join(", ");
        let sql = format!(
            "DELETE FROM {table_name} WHERE tenant_id = 0 AND organization_id = 0 AND {column_name} IN ({placeholders})"
        );
        let mut query = sqlx::query(sql.as_str());
        for value in chunk {
            query = query.bind(value);
        }
        query.execute(&mut **tx).await?;
    }
    Ok(())
}

async fn import_postgres_categories(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &SkillsSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.categories {
        let icon = item.icon.clone();
        let icon_media_resource_id = icon.as_ref().map(media_resource_stable_id);
        let icon_object_blob_id = icon.as_ref().and_then(media_resource_object_blob_id);
        let icon_resource_snapshot = icon.as_ref().map(serde_json::Value::to_string);
        sqlx::query(
            r#"
            INSERT INTO c_category
                (id, uuid, tenant_id, organization_id, data_scope, category_type, name, description, code, tags, icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot, sort_weight, parent_id, path, visible, status)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13, $14, $15::jsonb, $16, $17, $18)
            ON CONFLICT(id) DO UPDATE SET
                uuid = excluded.uuid,
                tenant_id = excluded.tenant_id,
                organization_id = excluded.organization_id,
                data_scope = excluded.data_scope,
                name = excluded.name,
                description = excluded.description,
                category_type = excluded.category_type,
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
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(category_type_from_legacy_seed(item.group_name.as_deref(), item.r#type))
        .bind(&item.name)
        .bind(&item.description)
        .bind(&item.code)
        .bind(json_string(&item.tags))
        .bind(icon_media_resource_id)
        .bind(icon_object_blob_id)
        .bind(icon_resource_snapshot)
        .bind(item.sort_weight)
        .bind(item.parent_id)
        .bind(&item.path)
        .bind(item.visible)
        .bind(item.status)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_postgres_packages(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &SkillsSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.packages {
        let icon = item.icon.clone();
        let icon_media_resource_id = icon.as_ref().map(media_resource_stable_id);
        let icon_object_blob_id = icon.as_ref().and_then(media_resource_object_blob_id);
        let icon_resource_snapshot = icon.as_ref().map(serde_json::Value::to_string);
        let cover_media_resource_id = item.cover.as_ref().map(media_resource_stable_id);
        let cover_object_blob_id = item.cover.as_ref().and_then(media_resource_object_blob_id);
        let cover_resource_snapshot = item.cover.as_ref().map(serde_json::Value::to_string);
        sqlx::query(
            r#"
            DELETE FROM ai_agent_skill_package
            WHERE id <> $1
              AND (
                    uuid = $2
                 OR (
                        tenant_id = $3
                    AND organization_id = $4
                    AND package_key = $5
                    )
              )
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(&item.package_key)
        .execute(&mut **tx)
        .await?;

        sqlx::query(
            r#"
            INSERT INTO ai_agent_skill_package
                (id, uuid, tenant_id, organization_id, data_scope, user_id, package_key, name, summary, description, icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot, cover_media_resource_id, cover_object_blob_id, cover_resource_snapshot, category_id, enabled, featured, sort_weight, tags, latest_published_at)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb, $14, $15, $16::jsonb, $17, $18, $19, $20, $21::jsonb, $22::timestamptz)
            ON CONFLICT(id) DO UPDATE SET
                uuid = excluded.uuid,
                tenant_id = excluded.tenant_id,
                organization_id = excluded.organization_id,
                data_scope = excluded.data_scope,
                user_id = excluded.user_id,
                package_key = excluded.package_key,
                name = excluded.name,
                summary = excluded.summary,
                description = excluded.description,
                icon_media_resource_id = excluded.icon_media_resource_id,
                icon_object_blob_id = excluded.icon_object_blob_id,
                icon_resource_snapshot = excluded.icon_resource_snapshot,
                cover_media_resource_id = excluded.cover_media_resource_id,
                cover_object_blob_id = excluded.cover_object_blob_id,
                cover_resource_snapshot = excluded.cover_resource_snapshot,
                category_id = excluded.category_id,
                enabled = excluded.enabled,
                featured = excluded.featured,
                sort_weight = excluded.sort_weight,
                tags = excluded.tags,
                latest_published_at = excluded.latest_published_at,
                updated_at = CURRENT_TIMESTAMP
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(item.user_id)
        .bind(&item.package_key)
        .bind(&item.name)
        .bind(&item.summary)
        .bind(&item.description)
        .bind(icon_media_resource_id)
        .bind(icon_object_blob_id)
        .bind(icon_resource_snapshot)
        .bind(cover_media_resource_id)
        .bind(cover_object_blob_id)
        .bind(cover_resource_snapshot)
        .bind(item.category_id)
        .bind(item.enabled)
        .bind(item.featured)
        .bind(item.sort_weight)
        .bind(json_string(&item.tags))
        .bind(&item.latest_published_at)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_postgres_skills(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &SkillsSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.skills {
        let icon = item.icon.clone();
        let icon_media_resource_id = icon.as_ref().map(media_resource_stable_id);
        let icon_object_blob_id = icon.as_ref().and_then(media_resource_object_blob_id);
        let icon_resource_snapshot = icon.as_ref().map(serde_json::Value::to_string);
        let cover_media_resource_id = item.cover.as_ref().map(media_resource_stable_id);
        let cover_object_blob_id = item.cover.as_ref().and_then(media_resource_object_blob_id);
        let cover_resource_snapshot = item.cover.as_ref().map(serde_json::Value::to_string);
        sqlx::query(
            r#"
            INSERT INTO ai_agent_skill
                (id, uuid, tenant_id, organization_id, data_scope, user_id, skill_key, name, summary, description, icon_media_resource_id, icon_object_blob_id, icon_resource_snapshot, cover_media_resource_id, cover_object_blob_id, cover_resource_snapshot, category_id, package_id, provider, version, version_name, runtime, entrypoint, manifest_url, repository_url, homepage_url, documentation_url, license_name, source_type, market_status, visibility, review_status, review_comment, reviewed_by, reviewed_at, builtin, is_builtin, enabled, featured, recommend_weight, price, currency, install_count, rating_avg, rating_count, tags, capabilities, config_schema, default_config, latest_published_at)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb, $14, $15, $16::jsonb, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35::timestamptz, $36, $37, $38, $39, $40, CAST($41 AS NUMERIC), $42, $43, CAST($44 AS NUMERIC), $45, $46::jsonb, $47::jsonb, $48::jsonb, $49::jsonb, $50::timestamptz)
            ON CONFLICT(tenant_id, organization_id, skill_key) DO UPDATE SET
                uuid = excluded.uuid,
                user_id = excluded.user_id,
                name = excluded.name,
                summary = excluded.summary,
                description = excluded.description,
                icon_media_resource_id = excluded.icon_media_resource_id,
                icon_object_blob_id = excluded.icon_object_blob_id,
                icon_resource_snapshot = excluded.icon_resource_snapshot,
                cover_media_resource_id = excluded.cover_media_resource_id,
                cover_object_blob_id = excluded.cover_object_blob_id,
                cover_resource_snapshot = excluded.cover_resource_snapshot,
                category_id = excluded.category_id,
                package_id = excluded.package_id,
                provider = excluded.provider,
                version = excluded.version,
                version_name = excluded.version_name,
                runtime = excluded.runtime,
                entrypoint = excluded.entrypoint,
                manifest_url = excluded.manifest_url,
                repository_url = excluded.repository_url,
                homepage_url = excluded.homepage_url,
                documentation_url = excluded.documentation_url,
                license_name = excluded.license_name,
                source_type = excluded.source_type,
                market_status = excluded.market_status,
                visibility = excluded.visibility,
                review_status = excluded.review_status,
                review_comment = excluded.review_comment,
                reviewed_by = excluded.reviewed_by,
                reviewed_at = excluded.reviewed_at,
                builtin = excluded.builtin,
                is_builtin = excluded.is_builtin,
                enabled = excluded.enabled,
                featured = excluded.featured,
                recommend_weight = excluded.recommend_weight,
                price = excluded.price,
                currency = excluded.currency,
                install_count = excluded.install_count,
                rating_avg = excluded.rating_avg,
                rating_count = excluded.rating_count,
                tags = excluded.tags,
                capabilities = excluded.capabilities,
                config_schema = excluded.config_schema,
                default_config = excluded.default_config,
                latest_published_at = excluded.latest_published_at,
                updated_at = CURRENT_TIMESTAMP
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(item.user_id)
        .bind(&item.skill_key)
        .bind(&item.name)
        .bind(&item.summary)
        .bind(&item.description)
        .bind(icon_media_resource_id)
        .bind(icon_object_blob_id)
        .bind(icon_resource_snapshot)
        .bind(cover_media_resource_id)
        .bind(cover_object_blob_id)
        .bind(cover_resource_snapshot)
        .bind(item.category_id)
        .bind(item.package_id)
        .bind(&item.provider)
        .bind(&item.version)
        .bind(&item.version_name)
        .bind(&item.runtime)
        .bind(&item.entrypoint)
        .bind(&item.manifest_url)
        .bind(&item.repository_url)
        .bind(&item.homepage_url)
        .bind(&item.documentation_url)
        .bind(&item.license_name)
        .bind(&item.source_type)
        .bind(&item.market_status)
        .bind(&item.visibility)
        .bind(&item.review_status)
        .bind(&item.review_comment)
        .bind(item.reviewed_by)
        .bind(&item.reviewed_at)
        .bind(item.builtin)
        .bind(item.is_builtin)
        .bind(item.enabled)
        .bind(item.featured)
        .bind(item.recommend_weight)
        .bind(item.price.as_deref().unwrap_or("0"))
        .bind(&item.currency)
        .bind(item.install_count)
        .bind(&item.rating_avg)
        .bind(item.rating_count)
        .bind(json_string(&item.tags))
        .bind(json_string(&item.capabilities))
        .bind(item.config_schema.to_string())
        .bind(item.default_config.to_string())
        .bind(&item.latest_published_at)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_postgres_assets(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &SkillsSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.assets {
        let asset_media_resource_id = media_resource_stable_id(&item.asset);
        let asset_object_blob_id = media_resource_object_blob_id(&item.asset);
        let asset_resource_snapshot = item.asset.to_string();
        let thumbnail_media_resource_id = item.thumbnail.as_ref().map(media_resource_stable_id);
        let thumbnail_object_blob_id = item
            .thumbnail
            .as_ref()
            .and_then(media_resource_object_blob_id);
        let thumbnail_resource_snapshot = item.thumbnail.as_ref().map(serde_json::Value::to_string);
        let result = sqlx::query(
            r#"
            UPDATE ai_skill_asset
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
        .bind(item.target_type)
        .bind(item.target_id)
        .bind(item.artifact_id)
        .bind(item.asset_type)
        .bind(asset_media_resource_id.clone())
        .bind(asset_object_blob_id.clone())
        .bind(asset_resource_snapshot.clone())
        .bind(thumbnail_media_resource_id.clone())
        .bind(thumbnail_object_blob_id.clone())
        .bind(thumbnail_resource_snapshot.clone())
        .bind(&item.title)
        .bind(&item.alt_text)
        .bind(&item.mime_type)
        .bind(item.width)
        .bind(item.height)
        .bind(item.duration_seconds.as_deref().unwrap_or("0"))
        .bind(item.file_size)
        .bind(item.sort_order)
        .bind(&item.published_at)
        .bind(seed_metadata(seed, "skill_asset", &item.uuid))
        .bind(ACTIVE_STATUS)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(&item.uuid)
        .execute(&mut **tx)
        .await?;
        if result.rows_affected() > 0 {
            continue;
        }
        sqlx::query(
            r#"
            INSERT INTO ai_skill_asset
                (uuid, tenant_id, organization_id, data_scope, status, metadata, target_type, target_id, artifact_id, asset_type, asset_media_resource_id, asset_object_blob_id, asset_resource_snapshot, thumbnail_media_resource_id, thumbnail_object_blob_id, thumbnail_resource_snapshot, title, alt_text, mime_type, width, height, duration_seconds, file_size, sort_order, published_at, id)
            VALUES
                ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13::jsonb, $14, $15, $16::jsonb, $17, $18, $19, $20, $21, CAST($22 AS NUMERIC), $23, $24, $25::timestamptz, $26)
            "#,
        )
        .bind(&item.uuid)
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(seed_metadata(seed, "skill_asset", &item.uuid))
        .bind(item.target_type)
        .bind(item.target_id)
        .bind(item.artifact_id)
        .bind(item.asset_type)
        .bind(asset_media_resource_id)
        .bind(asset_object_blob_id)
        .bind(asset_resource_snapshot)
        .bind(thumbnail_media_resource_id)
        .bind(thumbnail_object_blob_id)
        .bind(thumbnail_resource_snapshot)
        .bind(&item.title)
        .bind(&item.alt_text)
        .bind(&item.mime_type)
        .bind(item.width)
        .bind(item.height)
        .bind(item.duration_seconds.as_deref().unwrap_or("0"))
        .bind(item.file_size)
        .bind(item.sort_order)
        .bind(&item.published_at)
        .bind(stable_skill_asset_id(&item.uuid))
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn import_postgres_artifacts(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    seed: &SkillsSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.artifacts {
        let artifact_media_resource_id = item
            .artifact_resource_snapshot
            .as_ref()
            .map(media_resource_stable_id);
        let artifact_object_blob_id = item
            .artifact_resource_snapshot
            .as_ref()
            .and_then(media_resource_object_blob_id);
        let artifact_resource_snapshot = item
            .artifact_resource_snapshot
            .as_ref()
            .map(serde_json::Value::to_string);
        release_postgres_skill_artifact_uuid_owner(tx, item).await?;
        sqlx::query(
            r#"
            INSERT INTO ai_skill_artifact
                (uuid, tenant_id, organization_id, data_scope, status, metadata, target_type, target_id, artifact_type, version, platform_type, os_name, artifact_ref, artifact_media_resource_id, artifact_object_blob_id, artifact_resource_snapshot, artifact_size_bytes, runtime, frameworks, license_name, checksum_hash, release_notes, published_at, deprecated_at, id)
            VALUES
                ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16::jsonb, $17, $18, $19::jsonb, $20, $21, $22, $23::timestamptz, $24::timestamptz, $25)
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
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(seed_metadata(seed, "skill_artifact", &item.uuid))
        .bind(item.target_type)
        .bind(item.target_id)
        .bind(item.artifact_type)
        .bind(&item.version)
        .bind(&item.platform_type)
        .bind(&item.os_name)
        .bind(&item.artifact_ref)
        .bind(artifact_media_resource_id)
        .bind(artifact_object_blob_id)
        .bind(artifact_resource_snapshot)
        .bind(item.artifact_size_bytes)
        .bind(&item.runtime)
        .bind(json_string(&item.frameworks))
        .bind(&item.license_name)
        .bind(&item.checksum_hash)
        .bind(&item.release_notes)
        .bind(&item.published_at)
        .bind(&item.deprecated_at)
        .bind(stable_skill_artifact_id(&item.uuid))
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn release_postgres_skill_artifact_uuid_owner(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    item: &CatalogArtifactSeed,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        UPDATE ai_skill_artifact
        SET uuid = uuid || '-retired-' || id::text,
            status = 0,
            deleted_at = CURRENT_TIMESTAMP,
            deleted_by = 0,
            updated_at = CURRENT_TIMESTAMP
        WHERE tenant_id = $1
          AND organization_id = $2
          AND uuid = $3
          AND NOT (
                target_type = $4
            AND target_id = $5
            AND artifact_type = $6
            AND version = $7
            AND platform_type = $8
            AND os_name = $9
          )
        "#,
    )
    .bind(SYSTEM_TENANT_ID)
    .bind(SYSTEM_ORGANIZATION_ID)
    .bind(&item.uuid)
    .bind(item.target_type)
    .bind(item.target_id)
    .bind(item.artifact_type)
    .bind(&item.version)
    .bind(&item.platform_type)
    .bind(&item.os_name)
    .execute(&mut **tx)
    .await?;
    Ok(())
}

async fn sqlite_core_skill_seed_standard_count(
    pool: &SqlitePool,
    skills: &[AgentSkillSeed],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in skills {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM ai_agent_skill
            WHERE tenant_id = 0
              AND organization_id = 0
              AND data_scope = 0
              AND id = ?
              AND uuid = ?
              AND skill_key = ?
              AND name = ?
              AND provider = ?
              AND source_type = 'OFFICIAL'
              AND market_status = 'PUBLISHED'
              AND visibility = 'PUBLIC'
              AND review_status = 'APPROVED'
              AND builtin = 1
              AND is_builtin = 1
              AND enabled = 1
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(&item.skill_key)
        .bind(&item.name)
        .bind(&item.provider)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn sqlite_core_asset_seed_standard_count(
    pool: &SqlitePool,
    manifest: &SkillsSeedManifest,
    assets: &[CatalogAssetSeed],
    source_hash: &str,
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in assets {
        let metadata = seed_metadata_with_hash(manifest, source_hash, "skill_asset", &item.uuid);
        let asset_media_resource_id = media_resource_stable_id(&item.asset);
        let asset_object_blob_id = media_resource_object_blob_id(&item.asset);
        let asset_resource_snapshot = item.asset.to_string();
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM ai_skill_asset
            WHERE tenant_id = 0
              AND organization_id = 0
              AND status = 1
              AND deleted_at IS NULL
              AND uuid = ?
              AND metadata = ?
              AND target_type = ?
              AND target_id = ?
              AND asset_type = ?
              AND asset_media_resource_id = ?
              AND asset_object_blob_id IS ?
              AND CAST(asset_resource_snapshot AS TEXT) = ?
              AND sort_order = ?
            "#,
        )
        .bind(&item.uuid)
        .bind(metadata)
        .bind(item.target_type)
        .bind(item.target_id)
        .bind(item.asset_type)
        .bind(asset_media_resource_id)
        .bind(asset_object_blob_id)
        .bind(asset_resource_snapshot)
        .bind(item.sort_order)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn sqlite_core_artifact_seed_standard_count(
    pool: &SqlitePool,
    manifest: &SkillsSeedManifest,
    artifacts: &[CatalogArtifactSeed],
    source_hash: &str,
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in artifacts {
        let metadata = seed_metadata_with_hash(manifest, source_hash, "skill_artifact", &item.uuid);
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM ai_skill_artifact
            WHERE tenant_id = 0
              AND organization_id = 0
              AND status = 1
              AND deleted_at IS NULL
              AND uuid = ?
              AND metadata = ?
              AND target_type = ?
              AND target_id = ?
              AND artifact_type = ?
              AND version = ?
              AND platform_type = ?
              AND os_name = ?
              AND artifact_ref = ?
              AND CAST(artifact_resource_snapshot AS TEXT) IS ?
              AND artifact_size_bytes = ?
              AND runtime = ?
              AND checksum_hash = ?
            "#,
        )
        .bind(&item.uuid)
        .bind(metadata)
        .bind(item.target_type)
        .bind(item.target_id)
        .bind(item.artifact_type)
        .bind(&item.version)
        .bind(&item.platform_type)
        .bind(&item.os_name)
        .bind(&item.artifact_ref)
        .bind(
            item.artifact_resource_snapshot
                .as_ref()
                .map(serde_json::Value::to_string),
        )
        .bind(item.artifact_size_bytes)
        .bind(&item.runtime)
        .bind(&item.checksum_hash)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn sqlite_category_seed_standard_count(
    pool: &SqlitePool,
    categories: &[SkillCategorySeed],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in categories {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM c_category
            WHERE tenant_id = 0
              AND organization_id = 0
              AND data_scope = 0
              AND uuid = ?
              AND name = ?
              AND category_type = ?
              AND code = ?
              AND sort_weight = ?
              AND visible = ?
              AND status = ?
            "#,
        )
        .bind(&item.uuid)
        .bind(&item.name)
        .bind(category_type_from_legacy_seed(
            item.group_name.as_deref(),
            item.r#type,
        ))
        .bind(&item.code)
        .bind(item.sort_weight)
        .bind(item.visible)
        .bind(item.status)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn sqlite_package_seed_standard_count(
    pool: &SqlitePool,
    packages: &[SkillPackageSeed],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in packages {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM ai_agent_skill_package
            WHERE id = ?
              AND tenant_id = 0
              AND organization_id = 0
              AND data_scope = 0
              AND uuid = ?
              AND package_key = ?
              AND name = ?
              AND sort_weight = ?
              AND enabled = ?
              AND featured = ?
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(&item.package_key)
        .bind(&item.name)
        .bind(item.sort_weight)
        .bind(item.enabled)
        .bind(item.featured)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn postgres_category_seed_standard_count(
    pool: &PgPool,
    categories: &[SkillCategorySeed],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in categories {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM c_category
            WHERE tenant_id = 0
              AND organization_id = 0
              AND data_scope = 0
              AND uuid = $1
              AND name = $2
              AND category_type = $3
              AND code = $4
              AND sort_weight = $5
              AND visible = $6
              AND status = $7
            "#,
        )
        .bind(&item.uuid)
        .bind(&item.name)
        .bind(category_type_from_legacy_seed(
            item.group_name.as_deref(),
            item.r#type,
        ))
        .bind(&item.code)
        .bind(item.sort_weight)
        .bind(item.visible)
        .bind(item.status)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn postgres_package_seed_standard_count(
    pool: &PgPool,
    packages: &[SkillPackageSeed],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in packages {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM ai_agent_skill_package
            WHERE id = $1
              AND tenant_id = 0
              AND organization_id = 0
              AND data_scope = 0
              AND uuid = $2
              AND package_key = $3
              AND name = $4
              AND sort_weight = $5
              AND enabled = $6
              AND featured = $7
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(&item.package_key)
        .bind(&item.name)
        .bind(item.sort_weight)
        .bind(item.enabled)
        .bind(item.featured)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn postgres_skill_projection_seed_count(
    pool: &PgPool,
    table_name: &str,
    item_type: &str,
    seed_hash: &str,
) -> Result<i64, sqlx::Error> {
    let sql = format!(
        r#"
        SELECT COUNT(1) AS count
        FROM {table_name}
        WHERE tenant_id = 0
          AND organization_id = 0
          AND status = 1
          AND deleted_at IS NULL
          AND metadata ->> 'itemType' = $1
          AND metadata ->> 'sourceHash' = $2
        "#
    );
    let row = sqlx::query(sql.as_str())
        .bind(item_type)
        .bind(seed_hash)
        .fetch_one(pool)
        .await?;
    Ok(row.get::<i64, _>("count"))
}

async fn postgres_skill_seed_count(pool: &PgPool) -> Result<i64, sqlx::Error> {
    let row = sqlx::query(
        r#"
        SELECT COUNT(1) AS count
        FROM ai_agent_skill
        WHERE tenant_id = 0
          AND organization_id = 0
          AND data_scope = 0
        "#,
    )
    .fetch_one(pool)
    .await?;
    Ok(row.get::<i64, _>("count"))
}

async fn postgres_official_skill_seed_standard_count(pool: &PgPool) -> Result<i64, sqlx::Error> {
    let row = sqlx::query(
        r#"
        SELECT COUNT(1) AS count
        FROM ai_agent_skill
        WHERE tenant_id = 0
          AND organization_id = 0
          AND data_scope = 0
          AND source_type = 'OFFICIAL'
          AND provider = 'SDKWork'
          AND market_status = 'PUBLISHED'
          AND visibility = 'PUBLIC'
          AND review_status = 'APPROVED'
          AND builtin = true
          AND is_builtin = true
          AND enabled = true
        "#,
    )
    .fetch_one(pool)
    .await?;
    Ok(row.get::<i64, _>("count"))
}

async fn postgres_core_skill_seed_standard_count(
    pool: &PgPool,
    skills: &[AgentSkillSeed],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in skills {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM ai_agent_skill
            WHERE tenant_id = 0
              AND organization_id = 0
              AND data_scope = 0
              AND id = $1
              AND uuid = $2
              AND skill_key = $3
              AND name = $4
              AND provider = $5
              AND source_type = 'OFFICIAL'
              AND market_status = 'PUBLISHED'
              AND visibility = 'PUBLIC'
              AND review_status = 'APPROVED'
              AND builtin = true
              AND is_builtin = true
              AND enabled = true
            "#,
        )
        .bind(item.id)
        .bind(&item.uuid)
        .bind(&item.skill_key)
        .bind(&item.name)
        .bind(&item.provider)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn postgres_core_asset_seed_standard_count(
    pool: &PgPool,
    manifest: &SkillsSeedManifest,
    assets: &[CatalogAssetSeed],
    source_hash: &str,
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in assets {
        let metadata = seed_metadata_with_hash(manifest, source_hash, "skill_asset", &item.uuid);
        let asset_media_resource_id = media_resource_stable_id(&item.asset);
        let asset_object_blob_id = media_resource_object_blob_id(&item.asset);
        let asset_resource_snapshot = item.asset.to_string();
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM ai_skill_asset
            WHERE tenant_id = 0
              AND organization_id = 0
              AND status = 1
              AND deleted_at IS NULL
              AND uuid = $1
              AND metadata = $2::jsonb
              AND target_type = $3
              AND target_id = $4
              AND asset_type = $5
              AND asset_media_resource_id = $6
              AND asset_object_blob_id IS NOT DISTINCT FROM $7
              AND asset_resource_snapshot = $8::jsonb
              AND sort_order = $9
            "#,
        )
        .bind(&item.uuid)
        .bind(metadata)
        .bind(item.target_type)
        .bind(item.target_id)
        .bind(item.asset_type)
        .bind(asset_media_resource_id)
        .bind(asset_object_blob_id)
        .bind(asset_resource_snapshot)
        .bind(item.sort_order)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn postgres_core_artifact_seed_standard_count(
    pool: &PgPool,
    manifest: &SkillsSeedManifest,
    artifacts: &[CatalogArtifactSeed],
    source_hash: &str,
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in artifacts {
        let metadata = seed_metadata_with_hash(manifest, source_hash, "skill_artifact", &item.uuid);
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM ai_skill_artifact
            WHERE tenant_id = 0
              AND organization_id = 0
              AND status = 1
              AND deleted_at IS NULL
              AND uuid = $1
              AND metadata = $2::jsonb
              AND target_type = $3
              AND target_id = $4
              AND artifact_type = $5
              AND version = $6
              AND platform_type = $7
              AND os_name = $8
              AND artifact_ref = $9
              AND artifact_resource_snapshot IS NOT DISTINCT FROM $10::jsonb
              AND artifact_size_bytes = $11
              AND runtime = $12
              AND checksum_hash = $13
            "#,
        )
        .bind(&item.uuid)
        .bind(metadata)
        .bind(item.target_type)
        .bind(item.target_id)
        .bind(item.artifact_type)
        .bind(&item.version)
        .bind(&item.platform_type)
        .bind(&item.os_name)
        .bind(&item.artifact_ref)
        .bind(
            item.artifact_resource_snapshot
                .as_ref()
                .map(serde_json::Value::to_string),
        )
        .bind(item.artifact_size_bytes)
        .bind(&item.runtime)
        .bind(&item.checksum_hash)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

fn json_string<T: serde::Serialize>(value: &T) -> String {
    serde_json::to_string(value).unwrap_or_else(|_| "[]".to_owned())
}

fn seed_metadata(seed: &SkillsSeedCatalog, item_type: &str, item_uuid: &str) -> String {
    seed_metadata_with_hash(
        &seed.manifest,
        seed_hash(seed).as_str(),
        item_type,
        item_uuid,
    )
}

fn seed_metadata_with_hash(
    manifest: &SkillsSeedManifest,
    source_hash: &str,
    item_type: &str,
    item_uuid: &str,
) -> String {
    serde_json::json!({
        "source": manifest.catalog_code,
        "catalogVersion": manifest.catalog_version,
        "schemaVersion": manifest.schema_version,
        "generatedAt": manifest.generated_at,
        "itemType": item_type,
        "itemUuid": item_uuid,
        "sourceHash": source_hash,
    })
    .to_string()
}

fn seed_hash(seed: &SkillsSeedCatalog) -> String {
    skills_seed_payload_hash(seed.payload().as_str())
}

fn skills_seed_payload_hash(payload: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(payload.as_bytes());
    hex::encode(hasher.finalize())
}

fn stable_skill_asset_id(uuid: &str) -> i64 {
    stable_seed_table_id("sdk-skill-asset-id", uuid)
}

fn stable_skill_artifact_id(uuid: &str) -> i64 {
    stable_seed_table_id("sdk-skill-artifact-id", uuid)
}

fn stable_seed_table_id(prefix: &str, uuid: &str) -> i64 {
    let mut hasher = Sha256::new();
    hasher.update(prefix.as_bytes());
    hasher.update([0]);
    hasher.update(uuid.as_bytes());
    let digest = hasher.finalize();
    let mut bytes = [0_u8; 8];
    bytes.copy_from_slice(&digest[..8]);
    let value = u64::from_be_bytes(bytes) & 0x3fff_ffff_ffff_ffff;
    (value as i64) + 1
}

fn json_decode_error(error: serde_json::Error) -> sqlx::Error {
    sqlx::Error::Protocol(format!("invalid bundled skills seed data: {error}"))
}

#[allow(dead_code)]
fn _assert_skill_target_type() {
    let _ = SKILL_TARGET_TYPE;
}
