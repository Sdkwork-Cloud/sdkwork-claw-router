use sqlx::{Row, SqlitePool};

use crate::domain::{DomainError, DomainResult};
use crate::infrastructure::sql::app_catalog_mapping::{
    build_app_item, query_matches_app_catalog_filters, sort_app_catalog_entries, RawAppStoreRecord,
    RawCatalogArtifact, RawCatalogAsset, CATALOG_TARGET_TYPE_APP,
};
use crate::ports::{
    AppStoreItem, AppStoreItems, AppStoreQuery, AppStoreReadFuture, AppStoreReadStore,
    AppStoreSubject,
};

const LOAD_APPS_BASE: &str = r#"
SELECT
    CAST(a.id AS TEXT) AS id,
    a.tenant_id AS tenant_id,
    a.organization_id AS organization_id,
    COALESCE(NULLIF(json_extract(a.config, '$.standard.appKey'), ''), CAST(a.id AS TEXT)) AS app_key,
    COALESCE(NULLIF(a.name, ''), '') AS name,
    COALESCE(NULLIF(a.description, ''), '') AS description,
    COALESCE(NULLIF(a.version, ''), '') AS version,
    COALESCE(CAST(a.icon AS TEXT), '') AS icon,
    COALESCE(NULLIF(a.icon_url, ''), '') AS icon_url,
    COALESCE(CAST(a.resource_list AS TEXT), '') AS resource_list,
    COALESCE(CAST(a.config AS TEXT), '') AS config,
    COALESCE(CAST(a.app_type AS TEXT), '') AS app_type,
    COALESCE(CAST(a.install_skill AS TEXT), '') AS install_skill,
    COALESCE(CAST(a.install_config AS TEXT), '') AS install_config,
    COALESCE(CAST(a.release_notes AS TEXT), '') AS release_notes,
    COALESCE(NULLIF(a.access_url, ''), '') AS access_url,
    COALESCE(NULLIF(a.store_url, ''), '') AS store_url,
    COALESCE(NULLIF(a.download_url, ''), '') AS download_url,
    COALESCE((
        SELECT AVG(sa.rating_score)
        FROM studio_catalog_action sa
        WHERE sa.tenant_id = a.tenant_id
          AND sa.organization_id = a.organization_id
          AND sa.target_type = 15
          AND sa.target_id = a.id
          AND sa.rating_score IS NOT NULL
    ), 0) AS rating,
    COALESCE((
        SELECT COUNT(*)
        FROM studio_catalog_action sa
        WHERE sa.tenant_id = a.tenant_id
          AND sa.organization_id = a.organization_id
          AND sa.target_type = 15
          AND sa.target_id = a.id
          AND (
              lower(CAST(sa.action_type AS TEXT)) IN ('download', 'downloads', 'install', '1', '2')
              OR sa.action_type IN (1, 2)
          )
    ), 0) AS download_count
FROM plus_app a
WHERE (
      (
          a.tenant_id = ?1
          AND (
              a.organization_id = ?2
              OR (?2 > 0 AND a.organization_id = 0)
          )
      )
      OR (a.tenant_id = ?9 AND a.organization_id = 0)
  )
  AND COALESCE(a.status, 1) = 1
  AND COALESCE(NULLIF(json_extract(a.config, '$.portal.marketStatus'), ''), NULLIF(json_extract(a.config, '$.marketStatus'), ''), 'DRAFT') = 'PUBLISHED'
  AND (?3 IS NULL OR COALESCE(a.status, 1) = ?4)
  AND (?5 IS NULL OR COALESCE(a.updated_at, a.created_at) >= ?6)
  AND (?7 IS NULL OR COALESCE(a.updated_at, a.created_at) <= ?8)
"#;

const LOAD_APPS_PAGED_SUFFIX: &str = r#"
ORDER BY COALESCE(a.updated_at, a.created_at) DESC, a.id DESC
LIMIT ?10 OFFSET ?11
"#;

const LOAD_APPS_UNPAGED_SUFFIX: &str = r#"
ORDER BY COALESCE(a.updated_at, a.created_at) DESC, a.id DESC
"#;

const LOAD_APPS_POPULAR_SUFFIX: &str = r#"
ORDER BY download_count DESC, COALESCE(a.updated_at, a.created_at) DESC, a.id DESC
LIMIT ?10 OFFSET ?11
"#;

const LOAD_APPS_RATING_SUFFIX: &str = r#"
ORDER BY rating DESC, COALESCE(a.updated_at, a.created_at) DESC, a.id DESC
LIMIT ?10 OFFSET ?11
"#;

const COUNT_APPS: &str = r#"
SELECT COUNT(1)
FROM plus_app a
WHERE (
      (
          a.tenant_id = ?1
          AND (
              a.organization_id = ?2
              OR (?2 > 0 AND a.organization_id = 0)
          )
      )
      OR (a.tenant_id = ?9 AND a.organization_id = 0)
  )
  AND COALESCE(a.status, 1) = 1
  AND COALESCE(NULLIF(json_extract(a.config, '$.portal.marketStatus'), ''), NULLIF(json_extract(a.config, '$.marketStatus'), ''), 'DRAFT') = 'PUBLISHED'
  AND (?3 IS NULL OR COALESCE(a.status, 1) = ?4)
  AND (?5 IS NULL OR COALESCE(a.updated_at, a.created_at) >= ?6)
  AND (?7 IS NULL OR COALESCE(a.updated_at, a.created_at) <= ?8)
"#;

const LOAD_APP_BY_ID: &str = r#"
SELECT
    CAST(a.id AS TEXT) AS id,
    a.tenant_id AS tenant_id,
    a.organization_id AS organization_id,
    COALESCE(NULLIF(json_extract(a.config, '$.standard.appKey'), ''), CAST(a.id AS TEXT)) AS app_key,
    COALESCE(NULLIF(a.name, ''), '') AS name,
    COALESCE(NULLIF(a.description, ''), '') AS description,
    COALESCE(NULLIF(a.version, ''), '') AS version,
    COALESCE(CAST(a.icon AS TEXT), '') AS icon,
    COALESCE(NULLIF(a.icon_url, ''), '') AS icon_url,
    COALESCE(CAST(a.resource_list AS TEXT), '') AS resource_list,
    COALESCE(CAST(a.config AS TEXT), '') AS config,
    COALESCE(CAST(a.app_type AS TEXT), '') AS app_type,
    COALESCE(CAST(a.install_skill AS TEXT), '') AS install_skill,
    COALESCE(CAST(a.install_config AS TEXT), '') AS install_config,
    COALESCE(CAST(a.release_notes AS TEXT), '') AS release_notes,
    COALESCE(NULLIF(a.access_url, ''), '') AS access_url,
    COALESCE(NULLIF(a.store_url, ''), '') AS store_url,
    COALESCE(NULLIF(a.download_url, ''), '') AS download_url,
    COALESCE((
        SELECT AVG(sa.rating_score)
        FROM studio_catalog_action sa
        WHERE sa.tenant_id = a.tenant_id
          AND sa.organization_id = a.organization_id
          AND sa.target_type = 15
          AND sa.target_id = a.id
          AND sa.rating_score IS NOT NULL
    ), 0) AS rating,
    COALESCE((
        SELECT COUNT(*)
        FROM studio_catalog_action sa
        WHERE sa.tenant_id = a.tenant_id
          AND sa.organization_id = a.organization_id
          AND sa.target_type = 15
          AND sa.target_id = a.id
          AND (
              lower(CAST(sa.action_type AS TEXT)) IN ('download', 'downloads', 'install', '1', '2')
              OR sa.action_type IN (1, 2)
          )
    ), 0) AS download_count
FROM plus_app a
WHERE (
      (
          a.tenant_id = ?1
          AND (
              a.organization_id = ?2
              OR (?2 > 0 AND a.organization_id = 0)
          )
      )
      OR (a.tenant_id = ?4 AND a.organization_id = 0)
  )
  AND (
      CAST(a.id AS TEXT) = ?3
      OR json_extract(a.config, '$.standard.appKey') = ?3
  )
  AND COALESCE(a.status, 1) = 1
  AND COALESCE(NULLIF(json_extract(a.config, '$.portal.marketStatus'), ''), NULLIF(json_extract(a.config, '$.marketStatus'), ''), 'DRAFT') = 'PUBLISHED'
ORDER BY
    CASE
        WHEN a.tenant_id = ?1 AND a.organization_id = ?2 THEN 0
        WHEN a.tenant_id = ?1 AND a.organization_id = 0 THEN 1
        WHEN a.tenant_id = ?4 AND a.organization_id = 0 THEN 2
        ELSE 3
    END,
    a.id DESC
LIMIT 1
"#;

const LOAD_CATEGORIES: &str = r#"
SELECT
    COALESCE(NULLIF(c.name, ''), '') AS name
FROM plus_category c
WHERE (
      (
          c.tenant_id = ?1
          AND (
              c.organization_id = ?2
              OR (?2 > 0 AND c.organization_id = 0)
          )
      )
      OR (c.tenant_id = ?3 AND c.organization_id = 0)
  )
  AND c.type = 999999
  AND c.group_name = 'app-store'
  AND COALESCE(c.visible, 1) = 1
  AND COALESCE(c.status, 1) = 1
ORDER BY COALESCE(c.sort_weight, 0), c.id
"#;

const LOAD_ASSETS: &str = r#"
SELECT
    COALESCE(CAST(asset_type AS TEXT), '') AS asset_type,
    COALESCE(NULLIF(asset_url, ''), '') AS asset_url,
    COALESCE(NULLIF(thumbnail_url, ''), '') AS thumbnail_url
FROM studio_catalog_asset
WHERE tenant_id = ?1
  AND organization_id = ?2
  AND target_type = ?3
  AND target_id = ?4
  AND deleted_at IS NULL
  AND COALESCE(status, 1) = 1
ORDER BY COALESCE(sort_order, 999999), id
LIMIT 20
"#;

const LOAD_ARTIFACTS: &str = r#"
SELECT
    CAST(id AS TEXT) AS id,
    COALESCE(NULLIF(platform_type, ''), '') AS platform_type,
    COALESCE(NULLIF(os_name, ''), '') AS os_name,
    COALESCE(NULLIF(version, ''), '') AS version,
    COALESCE(NULLIF(artifact_ref, ''), '') AS artifact_ref,
    COALESCE(NULLIF(artifact_url, ''), '') AS artifact_url,
    COALESCE(artifact_size_bytes, 0) AS artifact_size_bytes,
    COALESCE(CAST(frameworks AS TEXT), '') AS frameworks,
    COALESCE(NULLIF(license_name, ''), '') AS license_name,
    COALESCE(NULLIF(release_notes, ''), '') AS release_notes,
    COALESCE(CAST(published_at AS TEXT), '') AS published_at
FROM studio_catalog_artifact
WHERE tenant_id = ?1
  AND organization_id = ?2
  AND target_type = ?3
  AND target_id = ?4
  AND deleted_at IS NULL
  AND COALESCE(status, 1) = 1
ORDER BY published_at DESC, id DESC
LIMIT 64
"#;

const PUBLIC_APP_STORE_TENANT_ID: i64 = 20_001;
const PUBLIC_APP_STORE_ORGANIZATION_ID: i64 = 0;
const PUBLIC_APP_STORE_USER_ID: i64 = 0;

#[derive(Debug, Clone)]
pub struct SqliteAppStoreReadStore {
    pool: SqlitePool,
}

impl SqliteAppStoreReadStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl AppStoreReadStore for SqliteAppStoreReadStore {
    fn load_apps<'a>(
        &'a self,
        query: AppStoreQuery,
        subject: Option<AppStoreSubject>,
    ) -> AppStoreReadFuture<'a, AppStoreItems<AppStoreItem>> {
        Box::pin(async move {
            let subject = app_store_scope(subject);
            let page_size = query.page_size.unwrap_or(100).clamp(1, 100);
            let page_no = query.page_no.unwrap_or(1).max(1);
            let offset = (page_no - 1) * page_size;
            let status_filter = query.status.as_deref().map(app_status_code).transpose()?;
            let filter_in_memory = has_text_filter(query.keyword.as_deref())
                || has_text_filter(query.category.as_deref())
                || !query.platform_types.is_empty();
            let sql = if filter_in_memory {
                format!("{LOAD_APPS_BASE}{LOAD_APPS_UNPAGED_SUFFIX}")
            } else {
                format!(
                    "{}{}",
                    LOAD_APPS_BASE,
                    paged_sort_suffix(query.sort.as_deref())
                )
            };
            let mut statement = sqlx::query(&sql)
                .bind(subject.tenant_id)
                .bind(subject.organization_id)
                .bind(status_filter)
                .bind(status_filter)
                .bind(query.start_time.as_deref())
                .bind(query.start_time.as_deref())
                .bind(query.end_time.as_deref())
                .bind(query.end_time.as_deref())
                .bind(PUBLIC_APP_STORE_TENANT_ID);
            if !filter_in_memory {
                statement = statement.bind(page_size).bind(offset);
            }
            let rows = statement.fetch_all(&self.pool).await.map_err(sql_error)?;

            let mut entries = Vec::with_capacity(rows.len());
            for row in rows {
                let raw = row_to_raw_app(&row);
                let target_id = raw.id.parse::<i64>().unwrap_or_default();
                let assets = load_assets(&self.pool, &raw, target_id).await?;
                let artifacts = load_artifacts(&self.pool, &raw, target_id).await?;
                let item = build_app_item(&raw, assets, artifacts);
                if query_matches_app_catalog_filters(
                    &item,
                    &raw,
                    query.keyword.as_deref(),
                    query.category.as_deref(),
                    &query.platform_types,
                ) {
                    entries.push((item, raw));
                }
            }

            if filter_in_memory {
                sort_app_catalog_entries(&mut entries, query.sort.as_deref());
                let total = entries.len() as i64;
                let items = entries
                    .into_iter()
                    .map(|(item, _)| item)
                    .skip(offset as usize)
                    .take(page_size as usize)
                    .collect();
                return Ok(AppStoreItems::page(items, total, page_no, page_size));
            }

            let total = count_apps(&self.pool, &subject, &query, status_filter).await?;
            Ok(AppStoreItems::page(
                entries.into_iter().map(|(item, _)| item).collect(),
                total,
                page_no,
                page_size,
            ))
        })
    }

    fn load_app_by_id<'a>(
        &'a self,
        app_id: String,
        subject: Option<AppStoreSubject>,
    ) -> AppStoreReadFuture<'a, Option<AppStoreItem>> {
        Box::pin(async move {
            let subject = app_store_scope(subject);
            let row = sqlx::query(LOAD_APP_BY_ID)
                .bind(subject.tenant_id)
                .bind(subject.organization_id)
                .bind(app_id)
                .bind(PUBLIC_APP_STORE_TENANT_ID)
                .fetch_optional(&self.pool)
                .await
                .map_err(sql_error)?;
            let Some(row) = row else {
                return Ok(None);
            };
            let raw = row_to_raw_app(&row);
            let target_id = raw.id.parse::<i64>().unwrap_or_default();
            let assets = load_assets(&self.pool, &raw, target_id).await?;
            let artifacts = load_artifacts(&self.pool, &raw, target_id).await?;
            Ok(Some(build_app_item(&raw, assets, artifacts)))
        })
    }

    fn load_categories<'a>(
        &'a self,
        subject: Option<AppStoreSubject>,
    ) -> AppStoreReadFuture<'a, Vec<String>> {
        Box::pin(async move {
            let subject = app_store_scope(subject);
            let rows = sqlx::query(LOAD_CATEGORIES)
                .bind(subject.tenant_id)
                .bind(subject.organization_id)
                .bind(PUBLIC_APP_STORE_TENANT_ID)
                .fetch_all(&self.pool)
                .await
                .map_err(sql_error)?;
            let mut categories: Vec<String> = rows
                .iter()
                .map(|row| string_cell(row, "name"))
                .filter(|category| !category.trim().is_empty())
                .collect::<Vec<_>>();
            categories.dedup_by(|left, right| left.eq_ignore_ascii_case(right));
            Ok(categories)
        })
    }
}

async fn count_apps(
    pool: &SqlitePool,
    subject: &AppStoreSubject,
    query: &AppStoreQuery,
    status_filter: Option<i32>,
) -> DomainResult<i64> {
    sqlx::query_scalar(COUNT_APPS)
        .bind(subject.tenant_id)
        .bind(subject.organization_id)
        .bind(status_filter)
        .bind(status_filter)
        .bind(query.start_time.as_deref())
        .bind(query.start_time.as_deref())
        .bind(query.end_time.as_deref())
        .bind(query.end_time.as_deref())
        .bind(PUBLIC_APP_STORE_TENANT_ID)
        .fetch_one(pool)
        .await
        .map_err(sql_error)
}

fn has_text_filter(value: Option<&str>) -> bool {
    value.map(|value| !value.trim().is_empty()).unwrap_or(false)
}

fn paged_sort_suffix(sort: Option<&str>) -> &'static str {
    match sort {
        Some("popular_desc") => LOAD_APPS_POPULAR_SUFFIX,
        Some("rating_desc") => LOAD_APPS_RATING_SUFFIX,
        _ => LOAD_APPS_PAGED_SUFFIX,
    }
}

async fn load_assets(
    pool: &SqlitePool,
    raw: &RawAppStoreRecord,
    target_id: i64,
) -> DomainResult<Vec<RawCatalogAsset>> {
    let rows = sqlx::query(LOAD_ASSETS)
        .bind(raw.tenant_id)
        .bind(raw.organization_id)
        .bind(CATALOG_TARGET_TYPE_APP)
        .bind(target_id)
        .fetch_all(pool)
        .await
        .map_err(sql_error)?;
    Ok(rows.iter().map(row_to_asset).collect())
}

async fn load_artifacts(
    pool: &SqlitePool,
    raw: &RawAppStoreRecord,
    target_id: i64,
) -> DomainResult<Vec<RawCatalogArtifact>> {
    let rows = sqlx::query(LOAD_ARTIFACTS)
        .bind(raw.tenant_id)
        .bind(raw.organization_id)
        .bind(CATALOG_TARGET_TYPE_APP)
        .bind(target_id)
        .fetch_all(pool)
        .await
        .map_err(sql_error)?;
    Ok(rows.iter().map(row_to_artifact).collect())
}

fn row_to_raw_app(row: &sqlx::sqlite::SqliteRow) -> RawAppStoreRecord {
    RawAppStoreRecord {
        id: string_cell(row, "id"),
        tenant_id: integer_cell(row, "tenant_id"),
        organization_id: integer_cell(row, "organization_id"),
        app_key: string_cell(row, "app_key"),
        name: string_cell(row, "name"),
        description: string_cell(row, "description"),
        version: string_cell(row, "version"),
        icon: string_cell(row, "icon"),
        icon_url: string_cell(row, "icon_url"),
        resource_list: string_cell(row, "resource_list"),
        config: string_cell(row, "config"),
        app_type: string_cell(row, "app_type"),
        install_skill: string_cell(row, "install_skill"),
        install_config: string_cell(row, "install_config"),
        release_notes: string_cell(row, "release_notes"),
        access_url: string_cell(row, "access_url"),
        store_url: string_cell(row, "store_url"),
        download_url: string_cell(row, "download_url"),
        rating: decimal_cell(row, "rating"),
        download_count: integer_cell(row, "download_count"),
    }
}

fn row_to_asset(row: &sqlx::sqlite::SqliteRow) -> RawCatalogAsset {
    RawCatalogAsset {
        asset_type: string_cell(row, "asset_type"),
        asset_url: string_cell(row, "asset_url"),
        thumbnail_url: string_cell(row, "thumbnail_url"),
    }
}

fn row_to_artifact(row: &sqlx::sqlite::SqliteRow) -> RawCatalogArtifact {
    RawCatalogArtifact {
        id: string_cell(row, "id"),
        platform_type: string_cell(row, "platform_type"),
        os_name: string_cell(row, "os_name"),
        version: string_cell(row, "version"),
        artifact_ref: string_cell(row, "artifact_ref"),
        artifact_url: string_cell(row, "artifact_url"),
        artifact_size_bytes: integer_cell(row, "artifact_size_bytes"),
        frameworks: string_cell(row, "frameworks"),
        license_name: string_cell(row, "license_name"),
        release_notes: string_cell(row, "release_notes"),
        published_at: string_cell(row, "published_at"),
    }
}

fn app_store_scope(subject: Option<AppStoreSubject>) -> AppStoreSubject {
    subject.unwrap_or(AppStoreSubject {
        tenant_id: PUBLIC_APP_STORE_TENANT_ID,
        organization_id: PUBLIC_APP_STORE_ORGANIZATION_ID,
        user_id: PUBLIC_APP_STORE_USER_ID,
    })
}

fn string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> String {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .unwrap_or_default()
}

fn integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> i64 {
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

fn decimal_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> f64 {
    row.try_get::<Option<f64>, _>(column)
        .ok()
        .flatten()
        .or_else(|| string_cell(row, column).parse::<f64>().ok())
        .unwrap_or_default()
}

fn app_status_code(value: &str) -> DomainResult<i32> {
    match value.trim() {
        "ACTIVE" => Ok(1),
        "INACTIVE" => Ok(0),
        _ => Err(DomainError::new("status must be ACTIVE or INACTIVE")),
    }
}

fn sql_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}
