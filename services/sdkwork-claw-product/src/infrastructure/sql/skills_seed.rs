use std::collections::HashSet;

use serde::Deserialize;
use sha2::{Digest, Sha256};
use sqlx::{PgPool, QueryBuilder, Row, Sqlite, SqlitePool};

const MANIFEST_JSON: &str = include_str!("../../../../../data/skills/install-manifest.json");
const CATEGORIES_JSON: &str = include_str!("../../../../../data/skills/categories.json");
const PACKAGES_JSON: &str = include_str!("../../../../../data/skills/packages.json");
const SKILLS_JSON: &str = include_str!("../../../../../data/skills/skills.json");
const ASSETS_JSON: &str = include_str!("../../../../../data/skills/assets.json");
const ARTIFACTS_JSON: &str = include_str!("../../../../../data/skills/artifacts.json");

const SYSTEM_TENANT_ID: i64 = 0;
const SYSTEM_ORGANIZATION_ID: i64 = 0;
const SYSTEM_DATA_SCOPE: i32 = 0;
const ACTIVE_STATUS: i32 = 1;
const SKILL_CATEGORY_TYPE: i32 = 19;
const SKILL_COLLECTION_CATEGORY_TYPE: i32 = 20;
const SKILL_TARGET_TYPE: i32 = 35;
const OFFICIAL_SOURCE_TYPE: &str = "OFFICIAL";
const SDKWORK_PROVIDER: &str = "SDKWork";
const SDKWORK_OFFICIAL_CATEGORY_CODE: &str = "sdkwork-official";
const SQLITE_MAX_BIND_PARAMETERS: usize = 999;
const SQLITE_COUNT_BATCH_SIZE: usize = 900;
const SQLITE_SKILL_INSERT_BIND_COUNT: usize = 46;
const SQLITE_ASSET_INSERT_BIND_COUNT: usize = 21;
const SQLITE_ARTIFACT_INSERT_BIND_COUNT: usize = 22;
const SQLITE_SKILL_INSERT_BATCH_SIZE: usize =
    SQLITE_MAX_BIND_PARAMETERS / SQLITE_SKILL_INSERT_BIND_COUNT;
const SQLITE_ASSET_INSERT_BATCH_SIZE: usize =
    SQLITE_MAX_BIND_PARAMETERS / SQLITE_ASSET_INSERT_BIND_COUNT;
const SQLITE_ARTIFACT_INSERT_BATCH_SIZE: usize =
    SQLITE_MAX_BIND_PARAMETERS / SQLITE_ARTIFACT_INSERT_BIND_COUNT;

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
    icon: Option<String>,
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
    icon: Option<String>,
    cover_image: Option<String>,
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
    icon: Option<String>,
    cover_image: Option<String>,
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
    asset_url: String,
    thumbnail_url: Option<String>,
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
    artifact_url: Option<String>,
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

    fn payload(&self) -> String {
        serde_json::json!({
            "catalogCode": self.manifest.catalog_code,
            "catalogVersion": self.manifest.catalog_version,
            "schemaVersion": self.manifest.schema_version,
            "generatedAt": self.manifest.generated_at,
            "categoryCount": self.categories.len(),
            "packageCount": self.packages.len(),
            "skillCount": self.skills.len(),
            "assetCount": self.assets.len(),
            "artifactCount": self.artifacts.len(),
        })
        .to_string()
    }

    fn visible_skill_category_count(&self) -> usize {
        self.categories
            .iter()
            .filter(|item| is_visible_skill_category(item))
            .count()
    }

    fn store_visible_skill_count(&self) -> usize {
        let visible_category_ids = self.visible_category_ids();
        let enabled_package_ids = self.enabled_package_ids();
        self.skills
            .iter()
            .filter(|item| {
                is_store_visible_skill_seed(item, &visible_category_ids, &enabled_package_ids)
            })
            .count()
    }

    fn official_store_visible_skill_count(&self) -> usize {
        let Some(official_category_id) = self.sdkwork_official_category_id() else {
            return 0;
        };
        let visible_category_ids = self.visible_category_ids();
        let enabled_package_ids = self.enabled_package_ids();
        self.skills
            .iter()
            .filter(|item| {
                is_store_visible_skill_seed(item, &visible_category_ids, &enabled_package_ids)
                    && item.category_id == Some(official_category_id)
                    && item.source_type == OFFICIAL_SOURCE_TYPE
                    && item.provider.as_deref() == Some(SDKWORK_PROVIDER)
            })
            .count()
    }

    fn sdkwork_official_category_id(&self) -> Option<i64> {
        self.categories
            .iter()
            .find(|item| item.code.as_deref() == Some(SDKWORK_OFFICIAL_CATEGORY_CODE))
            .map(|item| item.id)
    }

    fn visible_category_ids(&self) -> HashSet<i64> {
        self.categories
            .iter()
            .filter(|item| is_visible_skill_category(item))
            .map(|item| item.id)
            .collect()
    }

    fn enabled_package_ids(&self) -> HashSet<i64> {
        self.packages
            .iter()
            .filter(|item| item.enabled)
            .map(|item| item.id)
            .collect()
    }
}

fn is_visible_skill_category(item: &SkillCategorySeed) -> bool {
    item.visible
        && item.status == ACTIVE_STATUS
        && (item.r#type == SKILL_CATEGORY_TYPE || item.r#type == SKILL_COLLECTION_CATEGORY_TYPE)
}

fn is_store_visible_skill_seed(
    item: &AgentSkillSeed,
    visible_category_ids: &HashSet<i64>,
    enabled_package_ids: &HashSet<i64>,
) -> bool {
    item.enabled
        && item.market_status == "PUBLISHED"
        && item.visibility == "PUBLIC"
        && item.review_status == "APPROVED"
        && item
            .category_id
            .is_some_and(|category_id| visible_category_ids.contains(&category_id))
        && item
            .package_id
            .is_some_and(|package_id| enabled_package_ids.contains(&package_id))
}

pub(crate) fn bundled_skills_seed_payload() -> Result<String, serde_json::Error> {
    Ok(SkillsSeedCatalog::load()?.payload())
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

pub(crate) async fn sqlite_skills_seed_complete(pool: &SqlitePool) -> Result<bool, sqlx::Error> {
    let seed = SkillsSeedCatalog::load().map_err(json_decode_error)?;
    let visible_seed_category_count = seed.visible_skill_category_count();
    let store_visible_seed_skill_count = seed.store_visible_skill_count();
    if visible_seed_category_count == 0
        || store_visible_seed_skill_count == 0
        || seed.official_store_visible_skill_count() < 3
    {
        return Ok(false);
    }
    let category_count = sqlite_category_seed_standard_count(pool, &seed.categories).await?;
    let package_count = sqlite_package_seed_standard_count(pool, &seed.packages).await?;
    let skill_count = sqlite_skill_seed_standard_count(pool, &seed.skills).await?;
    let visible_category_count =
        sqlite_visible_skill_category_seed_standard_count(pool, &seed.categories).await?;
    let store_visible_skill_count =
        sqlite_store_visible_skill_seed_standard_count(pool, &seed).await?;
    let asset_count = sqlite_seed_count(
        pool,
        "studio_catalog_asset",
        "uuid",
        &seed
            .assets
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
    )
    .await?;
    let artifact_count = sqlite_artifact_seed_standard_count(pool, &seed.artifacts).await?;
    Ok(category_count == seed.categories.len() as i64
        && package_count == seed.packages.len() as i64
        && skill_count == seed.skills.len() as i64
        && visible_category_count == visible_seed_category_count as i64
        && store_visible_skill_count == store_visible_seed_skill_count as i64
        && asset_count == seed.assets.len() as i64
        && artifact_count == seed.artifacts.len() as i64)
}

pub(crate) async fn postgres_skills_seed_complete(pool: &PgPool) -> Result<bool, sqlx::Error> {
    let seed = SkillsSeedCatalog::load().map_err(json_decode_error)?;
    let visible_seed_category_count = seed.visible_skill_category_count();
    let store_visible_seed_skill_count = seed.store_visible_skill_count();
    if visible_seed_category_count == 0
        || store_visible_seed_skill_count == 0
        || seed.official_store_visible_skill_count() < 3
    {
        return Ok(false);
    }
    let category_count = postgres_category_seed_standard_count(pool, &seed.categories).await?;
    let package_count = postgres_package_seed_standard_count(pool, &seed.packages).await?;
    let skill_count = postgres_skill_seed_standard_count(pool, &seed.skills).await?;
    let visible_category_count =
        postgres_visible_skill_category_seed_standard_count(pool, &seed.categories).await?;
    let store_visible_skill_count =
        postgres_store_visible_skill_seed_standard_count(pool, &seed).await?;
    let asset_count = postgres_seed_count(
        pool,
        "studio_catalog_asset",
        "uuid",
        &seed
            .assets
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
    )
    .await?;
    let artifact_count = postgres_artifact_seed_standard_count(pool, &seed.artifacts).await?;
    Ok(category_count == seed.categories.len() as i64
        && package_count == seed.packages.len() as i64
        && skill_count == seed.skills.len() as i64
        && visible_category_count == visible_seed_category_count as i64
        && store_visible_skill_count == store_visible_seed_skill_count as i64
        && asset_count == seed.assets.len() as i64
        && artifact_count == seed.artifacts.len() as i64)
}

async fn import_sqlite_categories(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &SkillsSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.categories {
        sqlx::query(
            r#"
            INSERT INTO plus_category
                (id, uuid, tenant_id, organization_id, data_scope, name, description, shop_id, type, group_name, code, tags, icon, sort_weight, parent_id, path, visible, status)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                icon = excluded.icon,
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
        .bind(&item.name)
        .bind(&item.description)
        .bind(item.shop_id)
        .bind(item.r#type)
        .bind(&item.group_name)
        .bind(&item.code)
        .bind(json_string(&item.tags))
        .bind(&item.icon)
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
    for item in &seed.packages {
        sqlx::query(
            r#"
            DELETE FROM plus_agent_skill_package
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
            INSERT INTO plus_agent_skill_package
                (id, uuid, tenant_id, organization_id, data_scope, user_id, package_key, name, summary, description, icon, cover_image, category_id, enabled, featured, sort_weight, tags, latest_published_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                icon = excluded.icon,
                cover_image = excluded.cover_image,
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
        .bind(&item.icon)
        .bind(&item.cover_image)
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
    for chunk in seed.skills.chunks(SQLITE_SKILL_INSERT_BATCH_SIZE) {
        let mut query_builder: QueryBuilder<'_, Sqlite> = QueryBuilder::new(
            r#"
            INSERT INTO plus_agent_skill
                (id, uuid, tenant_id, organization_id, data_scope, user_id, skill_key, name, summary, description, icon, cover_image, category_id, package_id, provider, version, version_name, runtime, entrypoint, manifest_url, repository_url, homepage_url, documentation_url, license_name, source_type, market_status, visibility, review_status, review_comment, reviewed_by, reviewed_at, builtin, is_builtin, enabled, featured, recommend_weight, price, currency, install_count, rating_avg, rating_count, tags, capabilities, config_schema, default_config, latest_published_at)
            "#,
        );
        query_builder.push_values(chunk, |mut row, item| {
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
                .push_bind(&item.icon)
                .push_bind(&item.cover_image)
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
                icon = excluded.icon,
                cover_image = excluded.cover_image,
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
    let asset_uuids = seed
        .assets
        .iter()
        .map(|item| item.uuid.as_str())
        .collect::<Vec<_>>();
    delete_sqlite_seed_rows_by_text_values(tx, "studio_catalog_asset", "uuid", &asset_uuids)
        .await?;
    let seed_hash = seed_hash(seed);
    for chunk in seed.assets.chunks(SQLITE_ASSET_INSERT_BATCH_SIZE) {
        let mut query_builder: QueryBuilder<'_, Sqlite> = QueryBuilder::new(
            r#"
            INSERT INTO studio_catalog_asset
                (uuid, tenant_id, organization_id, data_scope, status, metadata, target_type, target_id, artifact_id, asset_type, asset_url, thumbnail_url, title, alt_text, mime_type, width, height, duration_seconds, file_size, sort_order, published_at)
            "#,
        );
        query_builder.push_values(chunk, |mut row, item| {
            row.push_bind(&item.uuid)
                .push_bind(SYSTEM_TENANT_ID)
                .push_bind(SYSTEM_ORGANIZATION_ID)
                .push_bind(SYSTEM_DATA_SCOPE)
                .push_bind(ACTIVE_STATUS)
                .push_bind(seed_metadata_with_hash(
                    seed,
                    seed_hash.as_str(),
                    "skill_asset",
                    &item.uuid,
                ))
                .push_bind(item.target_type)
                .push_bind(item.target_id)
                .push_bind(item.artifact_id)
                .push_bind(item.asset_type)
                .push_bind(&item.asset_url)
                .push_bind(&item.thumbnail_url)
                .push_bind(&item.title)
                .push_bind(&item.alt_text)
                .push_bind(&item.mime_type)
                .push_bind(item.width)
                .push_bind(item.height)
                .push_bind(item.duration_seconds.as_deref().unwrap_or("0"))
                .push_bind(item.file_size)
                .push_bind(item.sort_order)
                .push_bind(&item.published_at);
        });
        query_builder.build().execute(&mut **tx).await?;
    }
    Ok(())
}

async fn import_sqlite_artifacts(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &SkillsSeedCatalog,
) -> Result<(), sqlx::Error> {
    let artifact_uuids = seed
        .artifacts
        .iter()
        .map(|item| item.uuid.as_str())
        .collect::<Vec<_>>();
    delete_sqlite_seed_rows_by_text_values(tx, "studio_catalog_artifact", "uuid", &artifact_uuids)
        .await?;
    let seed_hash = seed_hash(seed);
    for chunk in seed.artifacts.chunks(SQLITE_ARTIFACT_INSERT_BATCH_SIZE) {
        let mut query_builder: QueryBuilder<'_, Sqlite> = QueryBuilder::new(
            r#"
            INSERT INTO studio_catalog_artifact
                (uuid, tenant_id, organization_id, data_scope, status, metadata, target_type, target_id, artifact_type, version, platform_type, os_name, artifact_ref, artifact_url, artifact_size_bytes, runtime, frameworks, license_name, checksum_hash, release_notes, published_at, deprecated_at)
            "#,
        );
        query_builder.push_values(chunk, |mut row, item| {
            row.push_bind(&item.uuid)
                .push_bind(SYSTEM_TENANT_ID)
                .push_bind(SYSTEM_ORGANIZATION_ID)
                .push_bind(SYSTEM_DATA_SCOPE)
                .push_bind(ACTIVE_STATUS)
                .push_bind(seed_metadata_with_hash(
                    seed,
                    seed_hash.as_str(),
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
                .push_bind(&item.artifact_url)
                .push_bind(item.artifact_size_bytes)
                .push_bind(&item.runtime)
                .push_bind(json_string(&item.frameworks))
                .push_bind(&item.license_name)
                .push_bind(&item.checksum_hash)
                .push_bind(&item.release_notes)
                .push_bind(&item.published_at)
                .push_bind(&item.deprecated_at);
        });
        query_builder.push(
            r#"
            ON CONFLICT(tenant_id, organization_id, target_type, target_id, artifact_type, version, platform_type, os_name) DO UPDATE SET
                uuid = excluded.uuid,
                artifact_ref = excluded.artifact_ref,
                artifact_url = excluded.artifact_url,
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
        sqlx::query(
            r#"
            INSERT INTO plus_category
                (id, uuid, tenant_id, organization_id, data_scope, name, description, shop_id, type, group_name, code, tags, icon, sort_weight, parent_id, path, visible, status)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13, $14, $15, $16, $17, $18)
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
                icon = excluded.icon,
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
        .bind(&item.name)
        .bind(&item.description)
        .bind(item.shop_id)
        .bind(item.r#type)
        .bind(&item.group_name)
        .bind(&item.code)
        .bind(json_string(&item.tags))
        .bind(&item.icon)
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
        sqlx::query(
            r#"
            DELETE FROM plus_agent_skill_package
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
            INSERT INTO plus_agent_skill_package
                (id, uuid, tenant_id, organization_id, data_scope, user_id, package_key, name, summary, description, icon, cover_image, category_id, enabled, featured, sort_weight, tags, latest_published_at)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17::jsonb, $18)
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
                icon = excluded.icon,
                cover_image = excluded.cover_image,
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
        .bind(&item.icon)
        .bind(&item.cover_image)
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
        sqlx::query(
            r#"
            INSERT INTO plus_agent_skill
                (id, uuid, tenant_id, organization_id, data_scope, user_id, skill_key, name, summary, description, icon, cover_image, category_id, package_id, provider, version, version_name, runtime, entrypoint, manifest_url, repository_url, homepage_url, documentation_url, license_name, source_type, market_status, visibility, review_status, review_comment, reviewed_by, reviewed_at, builtin, is_builtin, enabled, featured, recommend_weight, price, currency, install_count, rating_avg, rating_count, tags, capabilities, config_schema, default_config, latest_published_at)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42::jsonb, $43::jsonb, $44::jsonb, $45::jsonb, $46)
            ON CONFLICT(tenant_id, organization_id, skill_key) DO UPDATE SET
                uuid = excluded.uuid,
                user_id = excluded.user_id,
                name = excluded.name,
                summary = excluded.summary,
                description = excluded.description,
                icon = excluded.icon,
                cover_image = excluded.cover_image,
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
        .bind(&item.icon)
        .bind(&item.cover_image)
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
        let result = sqlx::query(
            r#"
            UPDATE studio_catalog_asset
            SET
                target_type = $1,
                target_id = $2,
                artifact_id = $3,
                asset_type = $4,
                asset_url = $5,
                thumbnail_url = $6,
                title = $7,
                alt_text = $8,
                mime_type = $9,
                width = $10,
                height = $11,
                duration_seconds = $12,
                file_size = $13,
                sort_order = $14,
                published_at = $15,
                metadata = $16::jsonb,
                status = $17,
                deleted_at = NULL,
                deleted_by = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE tenant_id = $18
              AND organization_id = $19
              AND uuid = $20
            "#,
        )
        .bind(item.target_type)
        .bind(item.target_id)
        .bind(item.artifact_id)
        .bind(item.asset_type)
        .bind(&item.asset_url)
        .bind(&item.thumbnail_url)
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
            INSERT INTO studio_catalog_asset
                (uuid, tenant_id, organization_id, data_scope, status, metadata, target_type, target_id, artifact_id, asset_type, asset_url, thumbnail_url, title, alt_text, mime_type, width, height, duration_seconds, file_size, sort_order, published_at)
            VALUES
                ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
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
        .bind(&item.asset_url)
        .bind(&item.thumbnail_url)
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
    seed: &SkillsSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.artifacts {
        sqlx::query(
            r#"
            INSERT INTO studio_catalog_artifact
                (uuid, tenant_id, organization_id, data_scope, status, metadata, target_type, target_id, artifact_type, version, platform_type, os_name, artifact_ref, artifact_url, artifact_size_bytes, runtime, frameworks, license_name, checksum_hash, release_notes, published_at, deprecated_at)
            VALUES
                ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17::jsonb, $18, $19, $20, $21, $22)
            ON CONFLICT(tenant_id, organization_id, target_type, target_id, artifact_type, version, platform_type, os_name) DO UPDATE SET
                uuid = excluded.uuid,
                artifact_ref = excluded.artifact_ref,
                artifact_url = excluded.artifact_url,
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
        .bind(&item.artifact_url)
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

async fn sqlite_seed_count(
    pool: &SqlitePool,
    table_name: &str,
    column_name: &str,
    values: &[&str],
) -> Result<i64, sqlx::Error> {
    if values.is_empty() {
        return Ok(0);
    }
    let mut count = 0;
    for chunk in values.chunks(SQLITE_COUNT_BATCH_SIZE) {
        let placeholders = std::iter::repeat_n("?", chunk.len())
            .collect::<Vec<_>>()
            .join(", ");
        let sql = format!(
            "SELECT COUNT(1) AS count FROM {table_name} WHERE tenant_id = 0 AND organization_id = 0 AND {column_name} IN ({placeholders})"
        );
        let mut query = sqlx::query(sql.as_str());
        for value in chunk {
            query = query.bind(value);
        }
        let row = query.fetch_one(pool).await?;
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
            FROM plus_category
            WHERE tenant_id = 0
              AND organization_id = 0
              AND data_scope = 0
              AND uuid = ?
              AND name = ?
              AND type = ?
              AND code = ?
              AND sort_weight = ?
              AND visible = ?
              AND status = ?
            "#,
        )
        .bind(&item.uuid)
        .bind(&item.name)
        .bind(item.r#type)
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
            FROM plus_agent_skill_package
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

async fn sqlite_visible_skill_category_seed_standard_count(
    pool: &SqlitePool,
    categories: &[SkillCategorySeed],
) -> Result<i64, sqlx::Error> {
    let visible_category_ids = categories
        .iter()
        .filter(|item| is_visible_skill_category(item))
        .map(|item| item.id)
        .collect::<Vec<_>>();
    if visible_category_ids.is_empty() {
        return Ok(0);
    }
    let placeholders = std::iter::repeat_n("?", visible_category_ids.len())
        .collect::<Vec<_>>()
        .join(", ");
    let sql = format!(
        r#"
        SELECT COUNT(1) AS count
        FROM plus_category
        WHERE tenant_id = 0
          AND organization_id = 0
          AND id IN ({placeholders})
          AND type IN (?, ?)
          AND COALESCE(visible, 1) = 1
          AND COALESCE(status, 1) = 1
        "#
    );
    let mut query = sqlx::query(sql.as_str());
    for category_id in visible_category_ids {
        query = query.bind(category_id);
    }
    let row = query
        .bind(SKILL_CATEGORY_TYPE)
        .bind(SKILL_COLLECTION_CATEGORY_TYPE)
        .fetch_one(pool)
        .await?;
    Ok(row.get::<i64, _>("count"))
}

async fn sqlite_store_visible_skill_seed_standard_count(
    pool: &SqlitePool,
    seed: &SkillsSeedCatalog,
) -> Result<i64, sqlx::Error> {
    let visible_category_ids = seed.visible_category_ids();
    let enabled_package_ids = seed.enabled_package_ids();
    let visible_skills = seed
        .skills
        .iter()
        .filter(|item| {
            is_store_visible_skill_seed(item, &visible_category_ids, &enabled_package_ids)
        })
        .collect::<Vec<_>>();
    let mut count = 0;
    for item in visible_skills {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM plus_agent_skill s
            JOIN plus_category c
              ON c.id = s.category_id
             AND c.tenant_id = s.tenant_id
             AND c.organization_id = s.organization_id
             AND c.type IN (?, ?)
             AND COALESCE(c.visible, 1) = 1
             AND COALESCE(c.status, 1) = 1
            JOIN plus_agent_skill_package p
              ON p.id = s.package_id
             AND p.tenant_id = s.tenant_id
             AND p.organization_id = s.organization_id
             AND COALESCE(p.enabled, 0) = 1
            WHERE s.tenant_id = 0
              AND s.organization_id = 0
              AND s.skill_key = ?
              AND COALESCE(s.enabled, 0) = 1
              AND upper(COALESCE(s.visibility, '')) = 'PUBLIC'
              AND upper(COALESCE(s.review_status, '')) = 'APPROVED'
              AND upper(COALESCE(s.market_status, '')) = 'PUBLISHED'
            "#,
        )
        .bind(SKILL_CATEGORY_TYPE)
        .bind(SKILL_COLLECTION_CATEGORY_TYPE)
        .bind(&item.skill_key)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn sqlite_skill_seed_standard_count(
    pool: &SqlitePool,
    skills: &[AgentSkillSeed],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in skills {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM plus_agent_skill
            WHERE tenant_id = 0
              AND organization_id = 0
              AND uuid = ?
              AND skill_key = ?
              AND name = ?
              AND source_type = ?
              AND market_status = ?
              AND visibility = ?
              AND review_status = ?
              AND builtin = ?
              AND is_builtin = ?
              AND enabled = ?
              AND featured = ?
              AND recommend_weight = ?
              AND currency = ?
              AND install_count = ?
              AND rating_count = ?
            "#,
        )
        .bind(&item.uuid)
        .bind(&item.skill_key)
        .bind(&item.name)
        .bind(&item.source_type)
        .bind(&item.market_status)
        .bind(&item.visibility)
        .bind(&item.review_status)
        .bind(item.builtin)
        .bind(item.is_builtin)
        .bind(item.enabled)
        .bind(item.featured)
        .bind(item.recommend_weight)
        .bind(&item.currency)
        .bind(item.install_count)
        .bind(item.rating_count)
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
            FROM plus_category
            WHERE tenant_id = 0
              AND organization_id = 0
              AND data_scope = 0
              AND uuid = $1
              AND name = $2
              AND type = $3
              AND code = $4
              AND sort_weight = $5
              AND visible = $6
              AND status = $7
            "#,
        )
        .bind(&item.uuid)
        .bind(&item.name)
        .bind(item.r#type)
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
            FROM plus_agent_skill_package
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

async fn postgres_visible_skill_category_seed_standard_count(
    pool: &PgPool,
    categories: &[SkillCategorySeed],
) -> Result<i64, sqlx::Error> {
    let visible_category_ids = categories
        .iter()
        .filter(|item| is_visible_skill_category(item))
        .map(|item| item.id)
        .collect::<Vec<_>>();
    if visible_category_ids.is_empty() {
        return Ok(0);
    }
    let row = sqlx::query(
        r#"
        SELECT COUNT(1) AS count
        FROM plus_category
        WHERE tenant_id = 0
          AND organization_id = 0
          AND id = ANY($1)
          AND type IN ($2, $3)
          AND COALESCE(visible, true) = true
          AND COALESCE(status, 1) = 1
        "#,
    )
    .bind(&visible_category_ids)
    .bind(SKILL_CATEGORY_TYPE)
    .bind(SKILL_COLLECTION_CATEGORY_TYPE)
    .fetch_one(pool)
    .await?;
    Ok(row.get::<i64, _>("count"))
}

async fn postgres_store_visible_skill_seed_standard_count(
    pool: &PgPool,
    seed: &SkillsSeedCatalog,
) -> Result<i64, sqlx::Error> {
    let visible_category_ids = seed.visible_category_ids();
    let enabled_package_ids = seed.enabled_package_ids();
    let visible_skills = seed
        .skills
        .iter()
        .filter(|item| {
            is_store_visible_skill_seed(item, &visible_category_ids, &enabled_package_ids)
        })
        .collect::<Vec<_>>();
    let mut count = 0;
    for item in visible_skills {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM plus_agent_skill s
            JOIN plus_category c
              ON c.id = s.category_id
             AND c.tenant_id = s.tenant_id
             AND c.organization_id = s.organization_id
             AND c.type IN ($1, $2)
             AND COALESCE(c.visible, true) = true
             AND COALESCE(c.status, 1) = 1
            JOIN plus_agent_skill_package p
              ON p.id = s.package_id
             AND p.tenant_id = s.tenant_id
             AND p.organization_id = s.organization_id
             AND COALESCE(p.enabled, false) = true
            WHERE s.tenant_id = 0
              AND s.organization_id = 0
              AND s.skill_key = $3
              AND COALESCE(s.enabled, false) = true
              AND upper(COALESCE(s.visibility, '')) = 'PUBLIC'
              AND upper(COALESCE(s.review_status, '')) = 'APPROVED'
              AND upper(COALESCE(s.market_status, '')) = 'PUBLISHED'
            "#,
        )
        .bind(SKILL_CATEGORY_TYPE)
        .bind(SKILL_COLLECTION_CATEGORY_TYPE)
        .bind(&item.skill_key)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn postgres_seed_count(
    pool: &PgPool,
    table_name: &str,
    column_name: &str,
    values: &[&str],
) -> Result<i64, sqlx::Error> {
    if values.is_empty() {
        return Ok(0);
    }
    let sql = format!(
        "SELECT COUNT(1) AS count FROM {table_name} WHERE tenant_id = 0 AND organization_id = 0 AND {column_name} = ANY($1)"
    );
    let row = sqlx::query(sql.as_str())
        .bind(values)
        .fetch_one(pool)
        .await?;
    Ok(row.get::<i64, _>("count"))
}

async fn postgres_skill_seed_standard_count(
    pool: &PgPool,
    skills: &[AgentSkillSeed],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in skills {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM plus_agent_skill
            WHERE tenant_id = 0
              AND organization_id = 0
              AND uuid = $1
              AND skill_key = $2
              AND name = $3
              AND source_type = $4
              AND market_status = $5
              AND visibility = $6
              AND review_status = $7
              AND builtin = $8
              AND is_builtin = $9
              AND enabled = $10
              AND featured = $11
              AND recommend_weight = $12
              AND currency = $13
              AND install_count = $14
              AND rating_count = $15
            "#,
        )
        .bind(&item.uuid)
        .bind(&item.skill_key)
        .bind(&item.name)
        .bind(&item.source_type)
        .bind(&item.market_status)
        .bind(&item.visibility)
        .bind(&item.review_status)
        .bind(item.builtin)
        .bind(item.is_builtin)
        .bind(item.enabled)
        .bind(item.featured)
        .bind(item.recommend_weight)
        .bind(&item.currency)
        .bind(item.install_count)
        .bind(item.rating_count)
        .fetch_one(pool)
        .await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn sqlite_artifact_seed_standard_count(
    pool: &SqlitePool,
    artifacts: &[CatalogArtifactSeed],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for chunk in artifacts.chunks(SQLITE_COUNT_BATCH_SIZE / 12) {
        let predicates = std::iter::repeat_n(
            r#"
            SELECT ? AS uuid,
                   ? AS target_type,
                   ? AS target_id,
                   ? AS artifact_type,
                   ? AS version,
                   ? AS platform_type,
                   ? AS os_name,
                   ? AS artifact_ref,
                   ? AS artifact_url,
                   ? AS artifact_size_bytes,
                   ? AS runtime,
                   ? AS checksum_hash
            "#,
            chunk.len(),
        )
        .collect::<Vec<_>>()
        .join(" UNION ALL ");
        let sql = format!(
            r#"
            SELECT COUNT(1) AS count
            FROM studio_catalog_artifact artifact
            JOIN ({predicates}) seed
              ON seed.uuid = artifact.uuid
             AND seed.target_type = artifact.target_type
             AND seed.target_id = artifact.target_id
             AND seed.artifact_type = artifact.artifact_type
             AND seed.version = artifact.version
             AND seed.platform_type = artifact.platform_type
             AND seed.os_name = artifact.os_name
             AND seed.artifact_ref = artifact.artifact_ref
             AND seed.artifact_url = artifact.artifact_url
             AND seed.artifact_size_bytes = artifact.artifact_size_bytes
             AND seed.runtime = artifact.runtime
             AND seed.checksum_hash = artifact.checksum_hash
            WHERE artifact.tenant_id = 0
              AND artifact.organization_id = 0
              AND artifact.status = ?
              AND artifact.deleted_at IS NULL
            "#
        );
        let mut query = sqlx::query(sql.as_str());
        for item in chunk {
            query = query
                .bind(&item.uuid)
                .bind(item.target_type)
                .bind(item.target_id)
                .bind(item.artifact_type)
                .bind(&item.version)
                .bind(&item.platform_type)
                .bind(&item.os_name)
                .bind(&item.artifact_ref)
                .bind(&item.artifact_url)
                .bind(item.artifact_size_bytes)
                .bind(&item.runtime)
                .bind(&item.checksum_hash);
        }
        let row = query.bind(ACTIVE_STATUS).fetch_one(pool).await?;
        count += row.get::<i64, _>("count");
    }
    Ok(count)
}

async fn postgres_artifact_seed_standard_count(
    pool: &PgPool,
    artifacts: &[CatalogArtifactSeed],
) -> Result<i64, sqlx::Error> {
    let mut count = 0;
    for item in artifacts {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM studio_catalog_artifact
            WHERE tenant_id = 0
              AND organization_id = 0
              AND uuid = $1
              AND target_type = $2
              AND target_id = $3
              AND artifact_type = $4
              AND version = $5
              AND platform_type = $6
              AND os_name = $7
              AND artifact_ref = $8
              AND artifact_url = $9
              AND artifact_size_bytes = $10
              AND runtime = $11
              AND checksum_hash = $12
              AND status = $13
              AND deleted_at IS NULL
            "#,
        )
        .bind(&item.uuid)
        .bind(item.target_type)
        .bind(item.target_id)
        .bind(item.artifact_type)
        .bind(&item.version)
        .bind(&item.platform_type)
        .bind(&item.os_name)
        .bind(&item.artifact_ref)
        .bind(&item.artifact_url)
        .bind(item.artifact_size_bytes)
        .bind(&item.runtime)
        .bind(&item.checksum_hash)
        .bind(ACTIVE_STATUS)
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
    seed_metadata_with_hash(seed, seed_hash(seed).as_str(), item_type, item_uuid)
}

fn seed_metadata_with_hash(
    seed: &SkillsSeedCatalog,
    source_hash: &str,
    item_type: &str,
    item_uuid: &str,
) -> String {
    serde_json::json!({
        "source": seed.manifest.catalog_code,
        "catalogVersion": seed.manifest.catalog_version,
        "schemaVersion": seed.manifest.schema_version,
        "generatedAt": seed.manifest.generated_at,
        "itemType": item_type,
        "itemUuid": item_uuid,
        "sourceHash": source_hash,
    })
    .to_string()
}

fn seed_hash(seed: &SkillsSeedCatalog) -> String {
    let mut hasher = Sha256::new();
    hasher.update(seed.payload().as_bytes());
    hex::encode(hasher.finalize())
}

fn json_decode_error(error: serde_json::Error) -> sqlx::Error {
    sqlx::Error::Protocol(format!("invalid bundled skills seed data: {error}"))
}

#[allow(dead_code)]
fn _assert_skill_target_type() {
    let _ = SKILL_TARGET_TYPE;
}
