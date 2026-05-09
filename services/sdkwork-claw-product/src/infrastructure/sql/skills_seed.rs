use serde::Deserialize;
use sha2::{Digest, Sha256};
use sqlx::{PgPool, Row, SqlitePool};

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
const SKILL_TARGET_TYPE: i32 = 35;

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
    let category_count = sqlite_seed_count(
        pool,
        "plus_category",
        "uuid",
        &seed
            .categories
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
    )
    .await?;
    let package_count = sqlite_seed_count(
        pool,
        "plus_agent_skill_package",
        "uuid",
        &seed
            .packages
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
    )
    .await?;
    let skill_count = sqlite_skill_seed_standard_count(pool, &seed.skills).await?;
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
        && asset_count == seed.assets.len() as i64
        && artifact_count == seed.artifacts.len() as i64)
}

pub(crate) async fn postgres_skills_seed_complete(pool: &PgPool) -> Result<bool, sqlx::Error> {
    let seed = SkillsSeedCatalog::load().map_err(json_decode_error)?;
    let category_count = postgres_seed_count(
        pool,
        "plus_category",
        "uuid",
        &seed
            .categories
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
    )
    .await?;
    let package_count = postgres_seed_count(
        pool,
        "plus_agent_skill_package",
        "uuid",
        &seed
            .packages
            .iter()
            .map(|item| item.uuid.as_str())
            .collect::<Vec<_>>(),
    )
    .await?;
    let skill_count = postgres_skill_seed_standard_count(pool, &seed.skills).await?;
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
            INSERT INTO plus_agent_skill_package
                (id, uuid, tenant_id, organization_id, data_scope, user_id, package_key, name, summary, description, icon, cover_image, category_id, enabled, featured, sort_weight, tags, latest_published_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(tenant_id, organization_id, package_key) DO UPDATE SET
                uuid = excluded.uuid,
                user_id = excluded.user_id,
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
    for item in &seed.skills {
        sqlx::query(
            r#"
            INSERT INTO plus_agent_skill
                (id, uuid, tenant_id, organization_id, data_scope, user_id, skill_key, name, summary, description, icon, cover_image, category_id, package_id, provider, version, version_name, runtime, entrypoint, manifest_url, repository_url, homepage_url, documentation_url, license_name, source_type, market_status, visibility, review_status, review_comment, reviewed_by, reviewed_at, builtin, is_builtin, enabled, featured, recommend_weight, price, currency, install_count, rating_avg, rating_count, tags, capabilities, config_schema, default_config, latest_published_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

async fn import_sqlite_assets(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &SkillsSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.assets {
        let result = sqlx::query(
            r#"
            UPDATE studio_catalog_asset
            SET
                target_type = ?,
                target_id = ?,
                artifact_id = ?,
                asset_type = ?,
                asset_url = ?,
                thumbnail_url = ?,
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
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

async fn import_sqlite_artifacts(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    seed: &SkillsSeedCatalog,
) -> Result<(), sqlx::Error> {
    for item in &seed.artifacts {
        sqlx::query(
            r#"
            INSERT INTO studio_catalog_artifact
                (uuid, tenant_id, organization_id, data_scope, status, metadata, target_type, target_id, artifact_type, version, platform_type, os_name, artifact_ref, artifact_url, artifact_size_bytes, runtime, frameworks, license_name, checksum_hash, release_notes, published_at, deprecated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            INSERT INTO plus_agent_skill_package
                (id, uuid, tenant_id, organization_id, data_scope, user_id, package_key, name, summary, description, icon, cover_image, category_id, enabled, featured, sort_weight, tags, latest_published_at)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17::jsonb, $18)
            ON CONFLICT(tenant_id, organization_id, package_key) DO UPDATE SET
                uuid = excluded.uuid,
                user_id = excluded.user_id,
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
    let placeholders = std::iter::repeat_n("?", values.len())
        .collect::<Vec<_>>()
        .join(", ");
    let sql = format!(
        "SELECT COUNT(1) AS count FROM {table_name} WHERE tenant_id = 0 AND organization_id = 0 AND {column_name} IN ({placeholders})"
    );
    let mut query = sqlx::query(sql.as_str());
    for value in values {
        query = query.bind(value);
    }
    let row = query.fetch_one(pool).await?;
    Ok(row.get::<i64, _>("count"))
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
    for item in artifacts {
        let row = sqlx::query(
            r#"
            SELECT COUNT(1) AS count
            FROM studio_catalog_artifact
            WHERE tenant_id = 0
              AND organization_id = 0
              AND uuid = ?
              AND target_type = ?
              AND target_id = ?
              AND artifact_type = ?
              AND version = ?
              AND platform_type = ?
              AND os_name = ?
              AND artifact_ref = ?
              AND artifact_url = ?
              AND artifact_size_bytes = ?
              AND runtime = ?
              AND checksum_hash = ?
              AND status = ?
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
    serde_json::json!({
        "source": seed.manifest.catalog_code,
        "catalogVersion": seed.manifest.catalog_version,
        "schemaVersion": seed.manifest.schema_version,
        "generatedAt": seed.manifest.generated_at,
        "itemType": item_type,
        "itemUuid": item_uuid,
        "sourceHash": seed_hash(seed),
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
