use sqlx::{PgPool, Row};

use crate::domain::{DomainError, DomainResult};
use crate::infrastructure::sql::app_catalog_mapping::{
    build_skill_item, merge_skill_install_config, query_matches_skill, RawAppSkillRecord,
    RawCatalogArtifact, RawCatalogAsset, CATALOG_TARGET_TYPE_SKILL, CATEGORY_TYPE_SKILLS,
    CATEGORY_TYPE_SKILLS_COLLECTION,
};
use crate::ports::{
    AppInstalledSkillItem, AppSkillItem, AppSkillsCommandFuture, AppSkillsCommandStore,
    AppSkillsQuery, AppSkillsReadFuture, AppSkillsReadStore, AppSkillsSubject,
    EnableAppSkillCommand, SetAppSkillEnabledCommand, UpdateAppSkillConfigCommand,
};

const LOAD_SKILLS: &str = r#"
SELECT
    CAST(s.id AS TEXT) AS id,
    s.tenant_id AS tenant_id,
    s.organization_id AS organization_id,
    COALESCE(NULLIF(s.name, ''), '') AS name,
    COALESCE(NULLIF(s.provider, ''), '') AS provider,
    COALESCE(NULLIF(s.description, ''), NULLIF(s.summary, ''), '') AS description,
    COALESCE(NULLIF(c.name, ''), '') AS category_name,
    COALESCE(s.icon_resource_snapshot::text, '') AS icon_resource_snapshot,
    COALESCE(s.cover_resource_snapshot::text, '') AS cover_resource_snapshot,
    COALESCE(NULLIF(s.version, ''), '') AS version,
    COALESCE(NULLIF(s.license_name, ''), '') AS license_name,
    COALESCE(s.install_count, 0) AS install_count,
    COALESCE(s.rating_avg::float8, 0) AS rating_avg,
    COALESCE(s.tags::text, '') AS tags,
    COALESCE(s.capabilities::text, '') AS capabilities,
    COALESCE(s.default_config::text, '') AS default_config,
    COALESCE(NULLIF(s.manifest_url, ''), '') AS manifest_url,
    COALESCE(to_char((s.latest_published_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '') AS latest_published_at,
    COALESCE(to_char((s.updated_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '') AS updated_at
FROM plus_agent_skill s
LEFT JOIN plus_category c
  ON c.id = s.category_id
 AND c.tenant_id = s.tenant_id
 AND c.organization_id = s.organization_id
 AND c.type IN (19, 20)
 AND COALESCE(c.visible, true) = true
 AND COALESCE(c.status, 1) = 1
WHERE ((s.tenant_id = $1 AND s.organization_id = $2) OR (s.tenant_id = 0 AND s.organization_id = 0))
  AND COALESCE(s.enabled, false) = true
  AND upper(COALESCE(s.visibility, '')) = 'PUBLIC'
  AND upper(COALESCE(s.review_status, '')) = 'APPROVED'
  AND upper(COALESCE(s.market_status, '')) = 'PUBLISHED'
ORDER BY COALESCE(s.featured, false) DESC, COALESCE(s.recommend_weight, 0) DESC, COALESCE(s.latest_published_at, s.updated_at) DESC NULLS LAST, s.id DESC
LIMIT $3 OFFSET $4
"#;

const LOAD_SKILL_BY_ID: &str = r#"
SELECT
    CAST(s.id AS TEXT) AS id,
    s.tenant_id AS tenant_id,
    s.organization_id AS organization_id,
    COALESCE(NULLIF(s.name, ''), '') AS name,
    COALESCE(NULLIF(s.provider, ''), '') AS provider,
    COALESCE(NULLIF(s.description, ''), NULLIF(s.summary, ''), '') AS description,
    COALESCE(NULLIF(c.name, ''), '') AS category_name,
    COALESCE(s.icon_resource_snapshot::text, '') AS icon_resource_snapshot,
    COALESCE(s.cover_resource_snapshot::text, '') AS cover_resource_snapshot,
    COALESCE(NULLIF(s.version, ''), '') AS version,
    COALESCE(NULLIF(s.license_name, ''), '') AS license_name,
    COALESCE(s.install_count, 0) AS install_count,
    COALESCE(s.rating_avg::float8, 0) AS rating_avg,
    COALESCE(s.tags::text, '') AS tags,
    COALESCE(s.capabilities::text, '') AS capabilities,
    COALESCE(s.default_config::text, '') AS default_config,
    COALESCE(NULLIF(s.manifest_url, ''), '') AS manifest_url,
    COALESCE(to_char((s.latest_published_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '') AS latest_published_at,
    COALESCE(to_char((s.updated_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '') AS updated_at
FROM plus_agent_skill s
LEFT JOIN plus_category c
  ON c.id = s.category_id
 AND c.tenant_id = s.tenant_id
 AND c.organization_id = s.organization_id
 AND c.type IN (19, 20)
 AND COALESCE(c.visible, true) = true
 AND COALESCE(c.status, 1) = 1
WHERE ((s.tenant_id = $1 AND s.organization_id = $2) OR (s.tenant_id = 0 AND s.organization_id = 0))
  AND CAST(s.id AS TEXT) = $3
  AND COALESCE(s.enabled, false) = true
  AND upper(COALESCE(s.visibility, '')) = 'PUBLIC'
  AND upper(COALESCE(s.review_status, '')) = 'APPROVED'
  AND upper(COALESCE(s.market_status, '')) = 'PUBLISHED'
LIMIT 1
"#;

const LOAD_USER_SKILLS: &str = r#"
SELECT
    CAST(us.id AS TEXT) AS install_id,
    CAST(s.id AS TEXT) AS id,
    s.tenant_id AS tenant_id,
    s.organization_id AS organization_id,
    COALESCE(us.enabled, false) AS install_enabled,
    COALESCE(us.config::text, '{}') AS install_config,
    COALESCE(to_char((us.installed_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '') AS installed_at,
    COALESCE(to_char((us.last_enabled_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '') AS last_enabled_at,
    COALESCE(NULLIF(s.name, ''), '') AS name,
    COALESCE(NULLIF(s.provider, ''), '') AS provider,
    COALESCE(NULLIF(s.description, ''), NULLIF(s.summary, ''), '') AS description,
    COALESCE(NULLIF(c.name, ''), '') AS category_name,
    COALESCE(s.icon_resource_snapshot::text, '') AS icon_resource_snapshot,
    COALESCE(s.cover_resource_snapshot::text, '') AS cover_resource_snapshot,
    COALESCE(NULLIF(s.version, ''), '') AS version,
    COALESCE(NULLIF(s.license_name, ''), '') AS license_name,
    COALESCE(s.install_count, 0) AS install_count,
    COALESCE(s.rating_avg::float8, 0) AS rating_avg,
    COALESCE(s.tags::text, '') AS tags,
    COALESCE(s.capabilities::text, '') AS capabilities,
    COALESCE(s.default_config::text, '') AS default_config,
    COALESCE(NULLIF(s.manifest_url, ''), '') AS manifest_url,
    COALESCE(to_char((s.latest_published_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '') AS latest_published_at,
    COALESCE(to_char((s.updated_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '') AS updated_at
FROM plus_user_agent_skill us
JOIN plus_agent_skill s
  ON s.id = us.skill_id
LEFT JOIN plus_category c
  ON c.id = s.category_id
 AND c.tenant_id = s.tenant_id
 AND c.organization_id = s.organization_id
 AND c.type IN (19, 20)
 AND COALESCE(c.visible, true) = true
 AND COALESCE(c.status, 1) = 1
WHERE us.tenant_id = $1
  AND us.organization_id = $2
  AND us.user_id = $3
  AND ((s.tenant_id = $1 AND s.organization_id = $2) OR (s.tenant_id = 0 AND s.organization_id = 0))
  AND COALESCE(s.enabled, false) = true
  AND upper(COALESCE(s.visibility, '')) = 'PUBLIC'
  AND upper(COALESCE(s.review_status, '')) = 'APPROVED'
  AND upper(COALESCE(s.market_status, '')) = 'PUBLISHED'
ORDER BY COALESCE(us.enabled, false) DESC, us.updated_at DESC NULLS LAST, us.id DESC
LIMIT 200
"#;

const LOAD_USER_SKILL_BY_SKILL_ID: &str = r#"
SELECT
    CAST(us.id AS TEXT) AS install_id,
    CAST(s.id AS TEXT) AS id,
    s.tenant_id AS tenant_id,
    s.organization_id AS organization_id,
    COALESCE(us.enabled, false) AS install_enabled,
    COALESCE(us.config::text, '{}') AS install_config,
    COALESCE(to_char((us.installed_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '') AS installed_at,
    COALESCE(to_char((us.last_enabled_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '') AS last_enabled_at,
    COALESCE(NULLIF(s.name, ''), '') AS name,
    COALESCE(NULLIF(s.provider, ''), '') AS provider,
    COALESCE(NULLIF(s.description, ''), NULLIF(s.summary, ''), '') AS description,
    COALESCE(NULLIF(c.name, ''), '') AS category_name,
    COALESCE(s.icon_resource_snapshot::text, '') AS icon_resource_snapshot,
    COALESCE(s.cover_resource_snapshot::text, '') AS cover_resource_snapshot,
    COALESCE(NULLIF(s.version, ''), '') AS version,
    COALESCE(NULLIF(s.license_name, ''), '') AS license_name,
    COALESCE(s.install_count, 0) AS install_count,
    COALESCE(s.rating_avg::float8, 0) AS rating_avg,
    COALESCE(s.tags::text, '') AS tags,
    COALESCE(s.capabilities::text, '') AS capabilities,
    COALESCE(s.default_config::text, '') AS default_config,
    COALESCE(NULLIF(s.manifest_url, ''), '') AS manifest_url,
    COALESCE(to_char((s.latest_published_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '') AS latest_published_at,
    COALESCE(to_char((s.updated_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '') AS updated_at
FROM plus_user_agent_skill us
JOIN plus_agent_skill s
  ON s.id = us.skill_id
LEFT JOIN plus_category c
  ON c.id = s.category_id
 AND c.tenant_id = s.tenant_id
 AND c.organization_id = s.organization_id
 AND c.type IN (19, 20)
 AND COALESCE(c.visible, true) = true
 AND COALESCE(c.status, 1) = 1
WHERE us.tenant_id = $1
  AND us.organization_id = $2
  AND us.user_id = $3
  AND us.skill_id = $4
  AND ((s.tenant_id = $1 AND s.organization_id = $2) OR (s.tenant_id = 0 AND s.organization_id = 0))
  AND COALESCE(s.enabled, false) = true
  AND upper(COALESCE(s.visibility, '')) = 'PUBLIC'
  AND upper(COALESCE(s.review_status, '')) = 'APPROVED'
  AND upper(COALESCE(s.market_status, '')) = 'PUBLISHED'
ORDER BY us.id DESC
LIMIT 1
"#;

const LOAD_ASSETS: &str = r#"
SELECT
    COALESCE(CAST(asset_type AS TEXT), '') AS asset_type,
    COALESCE(asset_resource_snapshot::text, '') AS asset_resource_snapshot,
    COALESCE(thumbnail_resource_snapshot::text, '') AS thumbnail_resource_snapshot
FROM studio_catalog_asset
WHERE tenant_id = $1
  AND organization_id = $2
  AND target_type = $3
  AND target_id = $4
  AND deleted_at IS NULL
  AND COALESCE(status, 1) = 1
ORDER BY COALESCE(sort_order, 999999) ASC NULLS LAST, id ASC
LIMIT 20
"#;

const LOAD_ARTIFACTS: &str = r#"
SELECT
    CAST(id AS TEXT) AS id,
    COALESCE(NULLIF(platform_type, ''), '') AS platform_type,
    COALESCE(NULLIF(os_name, ''), '') AS os_name,
    COALESCE(NULLIF(version, ''), '') AS version,
    COALESCE(NULLIF(artifact_ref, ''), '') AS artifact_ref,
    COALESCE(artifact_resource_snapshot::text, '') AS artifact_resource_snapshot,
    COALESCE(artifact_size_bytes, 0) AS artifact_size_bytes,
    COALESCE(frameworks::text, '') AS frameworks,
    COALESCE(NULLIF(license_name, ''), '') AS license_name,
    COALESCE(NULLIF(release_notes, ''), '') AS release_notes,
    COALESCE(to_char((published_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '') AS published_at
FROM studio_catalog_artifact
WHERE tenant_id = $1
  AND organization_id = $2
  AND target_type = $3
  AND target_id = $4
  AND deleted_at IS NULL
  AND COALESCE(status, 1) = 1
ORDER BY published_at DESC NULLS LAST, id DESC
LIMIT 16
"#;

const PUBLIC_SKILLS_TENANT_ID: i64 = 0;
const PUBLIC_SKILLS_ORGANIZATION_ID: i64 = 0;
const PUBLIC_SKILLS_USER_ID: i64 = 0;

#[derive(Debug, Clone)]
pub struct PostgresAppSkillsReadStore {
    pool: PgPool,
}

impl PostgresAppSkillsReadStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl AppSkillsReadStore for PostgresAppSkillsReadStore {
    fn load_skills<'a>(
        &'a self,
        query: AppSkillsQuery,
        subject: Option<AppSkillsSubject>,
    ) -> AppSkillsReadFuture<'a, Vec<AppSkillItem>> {
        Box::pin(async move {
            let subject = app_skills_scope(subject);
            let page_size = query.page_size.unwrap_or(100).clamp(1, 100);
            let page_no = query.page_no.unwrap_or(1).max(1);
            let offset = (page_no - 1) * page_size;
            let rows = sqlx::query(LOAD_SKILLS)
                .bind(subject.tenant_id)
                .bind(subject.organization_id)
                .bind(page_size)
                .bind(offset)
                .fetch_all(&self.pool)
                .await
                .map_err(sql_error)?;

            let mut items = Vec::with_capacity(rows.len());
            for row in rows {
                let raw = row_to_raw_skill(&row);
                let target_id = raw.id.parse::<i64>().unwrap_or_default();
                let assets = load_assets(&self.pool, &raw, target_id).await?;
                let artifacts = load_artifacts(&self.pool, &raw, target_id).await?;
                let item = build_skill_item(raw, assets, artifacts);
                if query_matches_skill(&item, query.keyword.as_deref()) {
                    items.push(item);
                }
            }
            Ok(items)
        })
    }

    fn load_skill_by_id<'a>(
        &'a self,
        skill_id: String,
        subject: Option<AppSkillsSubject>,
    ) -> AppSkillsReadFuture<'a, Option<AppSkillItem>> {
        Box::pin(async move {
            let subject = app_skills_scope(subject);
            let row = sqlx::query(LOAD_SKILL_BY_ID)
                .bind(subject.tenant_id)
                .bind(subject.organization_id)
                .bind(skill_id)
                .fetch_optional(&self.pool)
                .await
                .map_err(sql_error)?;
            let Some(row) = row else {
                return Ok(None);
            };
            let raw = row_to_raw_skill(&row);
            let target_id = raw.id.parse::<i64>().unwrap_or_default();
            let assets = load_assets(&self.pool, &raw, target_id).await?;
            let artifacts = load_artifacts(&self.pool, &raw, target_id).await?;
            Ok(Some(build_skill_item(raw, assets, artifacts)))
        })
    }

    fn load_categories<'a>(
        &'a self,
        subject: Option<AppSkillsSubject>,
    ) -> AppSkillsReadFuture<'a, Vec<String>> {
        Box::pin(async move {
            let subject = app_skills_scope(subject);
            let rows = sqlx::query(
                r#"
                SELECT DISTINCT
                    COALESCE(NULLIF(name, ''), '') AS name,
                    COALESCE(sort_weight, 999999) AS sort_weight,
                    id
                FROM plus_category
                WHERE ((tenant_id = $1 AND organization_id = $2) OR (tenant_id = 0 AND organization_id = 0))
                  AND type IN ($3, $4)
                  AND COALESCE(visible, true) = true
                  AND COALESCE(status, 1) = 1
                ORDER BY sort_weight ASC, id ASC, name ASC
                LIMIT 100
                "#,
            )
            .bind(subject.tenant_id)
            .bind(subject.organization_id)
            .bind(CATEGORY_TYPE_SKILLS)
            .bind(CATEGORY_TYPE_SKILLS_COLLECTION)
            .fetch_all(&self.pool)
            .await
            .map_err(sql_error)?;
            Ok(rows
                .iter()
                .map(|row| string_cell(row, "name"))
                .filter(|name| !name.trim().is_empty())
                .collect())
        })
    }

    fn load_user_skills<'a>(
        &'a self,
        subject: Option<AppSkillsSubject>,
    ) -> AppSkillsReadFuture<'a, Vec<AppInstalledSkillItem>> {
        Box::pin(async move {
            let Some(subject) = subject else {
                return Ok(Vec::new());
            };
            let rows = sqlx::query(LOAD_USER_SKILLS)
                .bind(subject.tenant_id)
                .bind(subject.organization_id)
                .bind(subject.user_id)
                .fetch_all(&self.pool)
                .await
                .map_err(sql_error)?;

            let mut items = Vec::with_capacity(rows.len());
            for row in rows {
                let item = build_installed_skill_item(&self.pool, &row).await?;
                items.push(item);
            }
            Ok(items)
        })
    }
}

impl AppSkillsCommandStore for PostgresAppSkillsReadStore {
    fn enable_skill<'a>(
        &'a self,
        command: EnableAppSkillCommand,
    ) -> AppSkillsCommandFuture<'a, AppInstalledSkillItem> {
        Box::pin(async move {
            let skill = load_installable_skill(&self.pool, command.subject, &command.skill_id)
                .await?
                .ok_or_else(|| DomainError::not_found("skill was not found"))?;
            let config = merge_skill_install_config(&skill.default_config, command.config)?;
            sqlx::query(
                r#"
                INSERT INTO plus_user_agent_skill
                    (uuid, tenant_id, organization_id, data_scope, user_id, skill_id, enabled, config, installed_at, last_enabled_at)
                VALUES
                    ($1, $2, $3, 1, $4, $5, true, $6::jsonb, $7, $7)
                ON CONFLICT(tenant_id, organization_id, user_id, skill_id) DO UPDATE SET
                    enabled = true,
                    config = excluded.config,
                    last_enabled_at = excluded.last_enabled_at,
                    updated_at = CURRENT_TIMESTAMP
                "#,
            )
            .bind(&command.install_uuid)
            .bind(command.subject.tenant_id)
            .bind(command.subject.organization_id)
            .bind(command.subject.user_id)
            .bind(skill.skill_id)
            .bind(config.to_string())
            .bind(&command.requested_at)
            .execute(&self.pool)
            .await
            .map_err(sql_error)?;
            load_user_skill_by_skill_id(&self.pool, command.subject, skill.skill_id)
                .await?
                .ok_or_else(|| DomainError::not_found("skill installation was not found"))
        })
    }

    fn set_skill_enabled<'a>(
        &'a self,
        command: SetAppSkillEnabledCommand,
    ) -> AppSkillsCommandFuture<'a, AppInstalledSkillItem> {
        Box::pin(async move {
            let skill = load_installable_skill(&self.pool, command.subject, &command.skill_id)
                .await?
                .ok_or_else(|| DomainError::not_found("skill was not found"))?;
            let rows = sqlx::query(
                r#"
                UPDATE plus_user_agent_skill
                SET enabled = $1,
                    last_enabled_at = CASE WHEN $1 THEN $2 ELSE last_enabled_at END,
                    updated_at = CURRENT_TIMESTAMP
                WHERE tenant_id = $3
                  AND organization_id = $4
                  AND user_id = $5
                  AND skill_id = $6
                "#,
            )
            .bind(command.enabled)
            .bind(&command.requested_at)
            .bind(command.subject.tenant_id)
            .bind(command.subject.organization_id)
            .bind(command.subject.user_id)
            .bind(skill.skill_id)
            .execute(&self.pool)
            .await
            .map_err(sql_error)?
            .rows_affected();
            if rows == 0 {
                return Err(DomainError::not_found("skill installation was not found"));
            }
            load_user_skill_by_skill_id(&self.pool, command.subject, skill.skill_id)
                .await?
                .ok_or_else(|| DomainError::not_found("skill installation was not found"))
        })
    }

    fn update_skill_config<'a>(
        &'a self,
        command: UpdateAppSkillConfigCommand,
    ) -> AppSkillsCommandFuture<'a, AppInstalledSkillItem> {
        Box::pin(async move {
            let skill = load_installable_skill(&self.pool, command.subject, &command.skill_id)
                .await?
                .ok_or_else(|| DomainError::not_found("skill was not found"))?;
            let rows = sqlx::query(
                r#"
                UPDATE plus_user_agent_skill
                SET config = $1::jsonb,
                    updated_at = CURRENT_TIMESTAMP
                WHERE tenant_id = $2
                  AND organization_id = $3
                  AND user_id = $4
                  AND skill_id = $5
                "#,
            )
            .bind(command.config.to_string())
            .bind(command.subject.tenant_id)
            .bind(command.subject.organization_id)
            .bind(command.subject.user_id)
            .bind(skill.skill_id)
            .execute(&self.pool)
            .await
            .map_err(sql_error)?
            .rows_affected();
            if rows == 0 {
                return Err(DomainError::not_found("skill installation was not found"));
            }
            load_user_skill_by_skill_id(&self.pool, command.subject, skill.skill_id)
                .await?
                .ok_or_else(|| DomainError::not_found("skill installation was not found"))
        })
    }
}

async fn load_assets(
    pool: &PgPool,
    skill: &RawAppSkillRecord,
    target_id: i64,
) -> DomainResult<Vec<RawCatalogAsset>> {
    let rows = sqlx::query(LOAD_ASSETS)
        .bind(skill.tenant_id)
        .bind(skill.organization_id)
        .bind(CATALOG_TARGET_TYPE_SKILL)
        .bind(target_id)
        .fetch_all(pool)
        .await
        .map_err(sql_error)?;
    Ok(rows.iter().map(row_to_asset).collect())
}

async fn load_artifacts(
    pool: &PgPool,
    skill: &RawAppSkillRecord,
    target_id: i64,
) -> DomainResult<Vec<RawCatalogArtifact>> {
    let rows = sqlx::query(LOAD_ARTIFACTS)
        .bind(skill.tenant_id)
        .bind(skill.organization_id)
        .bind(CATALOG_TARGET_TYPE_SKILL)
        .bind(target_id)
        .fetch_all(pool)
        .await
        .map_err(sql_error)?;
    Ok(rows.iter().map(row_to_artifact).collect())
}

fn row_to_raw_skill(row: &sqlx::postgres::PgRow) -> RawAppSkillRecord {
    RawAppSkillRecord {
        id: string_cell(row, "id"),
        tenant_id: integer_cell(row, "tenant_id"),
        organization_id: integer_cell(row, "organization_id"),
        name: string_cell(row, "name"),
        provider: string_cell(row, "provider"),
        description: string_cell(row, "description"),
        category_name: string_cell(row, "category_name"),
        icon_resource_snapshot: string_cell(row, "icon_resource_snapshot"),
        cover_resource_snapshot: string_cell(row, "cover_resource_snapshot"),
        version: string_cell(row, "version"),
        license_name: string_cell(row, "license_name"),
        install_count: integer_cell(row, "install_count"),
        rating_avg: decimal_cell(row, "rating_avg"),
        tags: string_cell(row, "tags"),
        capabilities: string_cell(row, "capabilities"),
        default_config: string_cell(row, "default_config"),
        manifest_url: string_cell(row, "manifest_url"),
        latest_published_at: string_cell(row, "latest_published_at"),
        updated_at: string_cell(row, "updated_at"),
    }
}

fn row_to_asset(row: &sqlx::postgres::PgRow) -> RawCatalogAsset {
    RawCatalogAsset {
        asset_type: string_cell(row, "asset_type"),
        asset_resource_snapshot: string_cell(row, "asset_resource_snapshot"),
        thumbnail_resource_snapshot: string_cell(row, "thumbnail_resource_snapshot"),
    }
}

fn row_to_artifact(row: &sqlx::postgres::PgRow) -> RawCatalogArtifact {
    RawCatalogArtifact {
        id: string_cell(row, "id"),
        platform_type: string_cell(row, "platform_type"),
        os_name: string_cell(row, "os_name"),
        version: string_cell(row, "version"),
        artifact_ref: string_cell(row, "artifact_ref"),
        artifact_resource_snapshot: string_cell(row, "artifact_resource_snapshot"),
        artifact_size_bytes: integer_cell(row, "artifact_size_bytes"),
        frameworks: string_cell(row, "frameworks"),
        license_name: string_cell(row, "license_name"),
        release_notes: string_cell(row, "release_notes"),
        published_at: string_cell(row, "published_at"),
    }
}

fn app_skills_scope(subject: Option<AppSkillsSubject>) -> AppSkillsSubject {
    subject.unwrap_or(AppSkillsSubject {
        tenant_id: PUBLIC_SKILLS_TENANT_ID,
        organization_id: PUBLIC_SKILLS_ORGANIZATION_ID,
        user_id: PUBLIC_SKILLS_USER_ID,
    })
}

#[derive(Debug, Clone)]
struct InstallableSkill {
    skill_id: i64,
    default_config: String,
}

async fn load_installable_skill(
    pool: &PgPool,
    subject: AppSkillsSubject,
    skill_id: &str,
) -> DomainResult<Option<InstallableSkill>> {
    let row = sqlx::query(
        r#"
        SELECT
            s.id AS skill_id,
            COALESCE(s.default_config::text, '{}') AS default_config
        FROM plus_agent_skill s
        WHERE ((s.tenant_id = $1 AND s.organization_id = $2) OR (s.tenant_id = 0 AND s.organization_id = 0))
          AND (CAST(s.id AS TEXT) = $3 OR s.skill_key = $3 OR s.uuid = $3)
          AND COALESCE(s.enabled, false) = true
          AND upper(COALESCE(s.visibility, '')) = 'PUBLIC'
          AND upper(COALESCE(s.review_status, '')) = 'APPROVED'
          AND upper(COALESCE(s.market_status, '')) = 'PUBLISHED'
        ORDER BY CASE WHEN s.tenant_id = $1 AND s.organization_id = $2 THEN 0 ELSE 1 END, s.id DESC
        LIMIT 1
        "#,
    )
    .bind(subject.tenant_id)
    .bind(subject.organization_id)
    .bind(skill_id)
    .fetch_optional(pool)
    .await
    .map_err(sql_error)?;
    Ok(row.map(|row| InstallableSkill {
        skill_id: integer_cell(&row, "skill_id"),
        default_config: string_cell(&row, "default_config"),
    }))
}

async fn load_user_skill_by_skill_id(
    pool: &PgPool,
    subject: AppSkillsSubject,
    skill_id: i64,
) -> DomainResult<Option<AppInstalledSkillItem>> {
    let row = sqlx::query(LOAD_USER_SKILL_BY_SKILL_ID)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(subject.user_id)
        .bind(skill_id)
        .fetch_optional(pool)
        .await
        .map_err(sql_error)?;
    match row {
        Some(row) => build_installed_skill_item(pool, &row).await.map(Some),
        None => Ok(None),
    }
}

async fn build_installed_skill_item(
    pool: &PgPool,
    row: &sqlx::postgres::PgRow,
) -> DomainResult<AppInstalledSkillItem> {
    let raw = row_to_raw_skill(row);
    let target_id = raw.id.parse::<i64>().unwrap_or_default();
    let assets = load_assets(pool, &raw, target_id).await?;
    let artifacts = load_artifacts(pool, &raw, target_id).await?;
    let skill = build_skill_item(raw, assets, artifacts);
    Ok(AppInstalledSkillItem {
        id: string_cell(row, "install_id"),
        skill_id: skill.id.clone(),
        enabled: bool_cell(row, "install_enabled"),
        config: json_value_cell(row, "install_config"),
        installed_at: string_cell(row, "installed_at"),
        last_enabled_at: string_cell(row, "last_enabled_at"),
        skill,
    })
}

fn string_cell(row: &sqlx::postgres::PgRow, column: &str) -> String {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .unwrap_or_default()
}

fn integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> i64 {
    row.try_get::<Option<i64>, _>(column)
        .ok()
        .flatten()
        .or_else(|| {
            row.try_get::<Option<i32>, _>(column)
                .ok()
                .flatten()
                .map(i64::from)
        })
        .or_else(|| string_cell(row, column).parse::<i64>().ok())
        .unwrap_or_default()
}

fn decimal_cell(row: &sqlx::postgres::PgRow, column: &str) -> f64 {
    row.try_get::<Option<f64>, _>(column)
        .ok()
        .flatten()
        .or_else(|| string_cell(row, column).parse::<f64>().ok())
        .unwrap_or_default()
}

fn bool_cell(row: &sqlx::postgres::PgRow, column: &str) -> bool {
    row.try_get::<Option<bool>, _>(column)
        .ok()
        .flatten()
        .unwrap_or_else(|| integer_cell(row, column) != 0)
}

fn json_value_cell(row: &sqlx::postgres::PgRow, column: &str) -> serde_json::Value {
    serde_json::from_str(&string_cell(row, column)).unwrap_or_else(|_| serde_json::json!({}))
}

fn sql_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}
