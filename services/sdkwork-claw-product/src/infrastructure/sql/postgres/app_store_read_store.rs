use sqlx::{PgPool, Row};

use crate::domain::{DomainError, DomainResult};
use crate::infrastructure::sql::app_catalog_mapping::{
    build_app_item, query_matches_app_catalog_filters, sort_app_catalog_entries, RawAppStoreRecord,
    RawCatalogArtifact, RawCatalogAsset,
};
use crate::ports::{
    AppStoreItem, AppStoreItems, AppStoreQuery, AppStoreReadFuture, AppStoreReadStore,
    AppStoreSubject,
};

const LOAD_APPS_BASE: &str = r#"
SELECT
    COALESCE(NULLIF(a.plus_app_id, ''), a.id) AS id,
    CAST(a.tenant_id AS BIGINT) AS tenant_id,
    CAST(a.organization_id AS BIGINT) AS organization_id,
    COALESCE(NULLIF(a.config::jsonb -> 'standard' ->> 'appKey', ''), NULLIF(a.app_key, ''), a.plus_app_id, a.id) AS app_key,
    COALESCE(NULLIF(a.display_name, ''), '') AS name,
    COALESCE(NULLIF(a.description, ''), '') AS description,
    COALESCE(NULLIF(a.latest_released_version, ''), '') AS version,
    COALESCE(a.icon, '') AS icon,
    COALESCE(a.icon_resource_snapshot, '') AS icon_resource_snapshot,
    COALESCE(a.resource_list, '') AS resource_list,
    COALESCE(a.config, '') AS config,
    COALESCE(a.app_type, '') AS app_type,
    COALESCE(a.install_skill, '') AS install_skill,
    COALESCE(a.install_config, '') AS install_config,
    COALESCE(a.release_notes, '') AS release_notes,
    COALESCE(a.artifact_resource_snapshot, '') AS artifact_resource_snapshot,
    COALESCE(NULLIF(a.rating_avg, ''), '0')::float8 AS rating,
    COALESCE(a.download_count, 0) AS download_count
FROM appstore_app a
WHERE a.app_status = 'published'
  AND a.distribution_status = 'listed'
  AND (
      (
          CAST(a.tenant_id AS BIGINT) = $1
          AND (
              CAST(a.organization_id AS BIGINT) = $2
              OR ($2 > 0 AND CAST(a.organization_id AS BIGINT) = 0)
          )
      )
      OR (CAST(a.tenant_id AS BIGINT) = $9 AND CAST(a.organization_id AS BIGINT) = 0)
  )
  AND COALESCE(a.runtime_status, 1) = 1
  AND COALESCE(NULLIF(a.config::jsonb -> 'portal' ->> 'marketStatus', ''), NULLIF(a.config::jsonb ->> 'marketStatus', ''), 'DRAFT') = 'PUBLISHED'
  AND ($3::integer IS NULL OR COALESCE(a.runtime_status, 1) = $4)
  AND ($5::text IS NULL OR COALESCE(a.updated_at, a.created_at) >= $6::timestamp)
  AND ($7::text IS NULL OR COALESCE(a.updated_at, a.created_at) <= $8::timestamp)
"#;

const LOAD_APPS_PAGED_SUFFIX: &str = r#"
ORDER BY COALESCE(a.updated_at, a.created_at) DESC NULLS LAST, a.id DESC
LIMIT $10 OFFSET $11
"#;

const LOAD_APPS_UNPAGED_SUFFIX: &str = r#"
ORDER BY COALESCE(a.updated_at, a.created_at) DESC NULLS LAST, a.id DESC
"#;

const LOAD_APPS_POPULAR_SUFFIX: &str = r#"
ORDER BY download_count DESC, COALESCE(a.updated_at, a.created_at) DESC NULLS LAST, a.id DESC
LIMIT $10 OFFSET $11
"#;

const LOAD_APPS_RATING_SUFFIX: &str = r#"
ORDER BY rating DESC, COALESCE(a.updated_at, a.created_at) DESC NULLS LAST, a.id DESC
LIMIT $10 OFFSET $11
"#;

const COUNT_APPS: &str = r#"
SELECT COUNT(1)
FROM appstore_app a
WHERE a.app_status = 'published'
  AND a.distribution_status = 'listed'
  AND (
      (
          CAST(a.tenant_id AS BIGINT) = $1
          AND (
              CAST(a.organization_id AS BIGINT) = $2
              OR ($2 > 0 AND CAST(a.organization_id AS BIGINT) = 0)
          )
      )
      OR (CAST(a.tenant_id AS BIGINT) = $9 AND CAST(a.organization_id AS BIGINT) = 0)
  )
  AND COALESCE(a.runtime_status, 1) = 1
  AND COALESCE(NULLIF(a.config::jsonb -> 'portal' ->> 'marketStatus', ''), NULLIF(a.config::jsonb ->> 'marketStatus', ''), 'DRAFT') = 'PUBLISHED'
  AND ($3::integer IS NULL OR COALESCE(a.runtime_status, 1) = $4)
  AND ($5::text IS NULL OR COALESCE(a.updated_at, a.created_at) >= $6::timestamp)
  AND ($7::text IS NULL OR COALESCE(a.updated_at, a.created_at) <= $8::timestamp)
"#;

const LOAD_APP_BY_ID: &str = r#"
SELECT
    COALESCE(NULLIF(a.plus_app_id, ''), a.id) AS id,
    CAST(a.tenant_id AS BIGINT) AS tenant_id,
    CAST(a.organization_id AS BIGINT) AS organization_id,
    COALESCE(NULLIF(a.config::jsonb -> 'standard' ->> 'appKey', ''), NULLIF(a.app_key, ''), a.plus_app_id, a.id) AS app_key,
    COALESCE(NULLIF(a.display_name, ''), '') AS name,
    COALESCE(NULLIF(a.description, ''), '') AS description,
    COALESCE(NULLIF(a.latest_released_version, ''), '') AS version,
    COALESCE(a.icon, '') AS icon,
    COALESCE(a.icon_resource_snapshot, '') AS icon_resource_snapshot,
    COALESCE(a.resource_list, '') AS resource_list,
    COALESCE(a.config, '') AS config,
    COALESCE(a.app_type, '') AS app_type,
    COALESCE(a.install_skill, '') AS install_skill,
    COALESCE(a.install_config, '') AS install_config,
    COALESCE(a.release_notes, '') AS release_notes,
    COALESCE(a.artifact_resource_snapshot, '') AS artifact_resource_snapshot,
    COALESCE(NULLIF(a.rating_avg, ''), '0')::float8 AS rating,
    COALESCE(a.download_count, 0) AS download_count
FROM appstore_app a
WHERE a.app_status = 'published'
  AND a.distribution_status = 'listed'
  AND (
      (
          CAST(a.tenant_id AS BIGINT) = $1
          AND (
              CAST(a.organization_id AS BIGINT) = $2
              OR ($2 > 0 AND CAST(a.organization_id AS BIGINT) = 0)
          )
      )
      OR (CAST(a.tenant_id AS BIGINT) = $4 AND CAST(a.organization_id AS BIGINT) = 0)
  )
  AND (
      COALESCE(NULLIF(a.plus_app_id, ''), a.id) = $3
      OR a.config::jsonb -> 'standard' ->> 'appKey' = $3
      OR a.app_key = $3
  )
  AND COALESCE(a.runtime_status, 1) = 1
  AND COALESCE(NULLIF(a.config::jsonb -> 'portal' ->> 'marketStatus', ''), NULLIF(a.config::jsonb ->> 'marketStatus', ''), 'DRAFT') = 'PUBLISHED'
ORDER BY
    CASE
        WHEN CAST(a.tenant_id AS BIGINT) = $1 AND CAST(a.organization_id AS BIGINT) = $2 THEN 0
        WHEN CAST(a.tenant_id AS BIGINT) = $1 AND CAST(a.organization_id AS BIGINT) = 0 THEN 1
        WHEN CAST(a.tenant_id AS BIGINT) = $4 AND CAST(a.organization_id AS BIGINT) = 0 THEN 2
        ELSE 3
    END,
    a.id DESC
LIMIT 1
"#;

const LOAD_CATEGORIES: &str = r#"
SELECT
    COALESCE(NULLIF(loc.display_name, ''), '') AS name
FROM appstore_category cat
INNER JOIN appstore_category_localization loc
  ON loc.category_id = cat.id
 AND loc.tenant_id = cat.tenant_id
WHERE cat.category_status = 'active'
  AND (
        cat.tenant_id = CAST($1 AS TEXT)
        OR cat.tenant_id = CAST($3 AS TEXT)
      )
ORDER BY COALESCE(cat.sort_order, 0), cat.id
"#;

const PUBLIC_APP_STORE_TENANT_ID: i64 = 20_001;
const PUBLIC_APP_STORE_ORGANIZATION_ID: i64 = 0;
const PUBLIC_APP_STORE_USER_ID: i64 = 0;

#[derive(Debug, Clone)]
pub struct PostgresAppStoreReadStore {
    pool: PgPool,
}

impl PostgresAppStoreReadStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl AppStoreReadStore for PostgresAppStoreReadStore {
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
    pool: &PgPool,
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
    _pool: &PgPool,
    _raw: &RawAppStoreRecord,
    _target_id: i64,
) -> DomainResult<Vec<RawCatalogAsset>> {
    Ok(Vec::new())
}

async fn load_artifacts(
    _pool: &PgPool,
    _raw: &RawAppStoreRecord,
    _target_id: i64,
) -> DomainResult<Vec<RawCatalogArtifact>> {
    Ok(Vec::new())
}

fn row_to_raw_app(row: &sqlx::postgres::PgRow) -> RawAppStoreRecord {
    RawAppStoreRecord {
        id: string_cell(row, "id"),
        tenant_id: integer_cell(row, "tenant_id"),
        organization_id: integer_cell(row, "organization_id"),
        app_key: string_cell(row, "app_key"),
        name: string_cell(row, "name"),
        description: string_cell(row, "description"),
        version: string_cell(row, "version"),
        icon: string_cell(row, "icon"),
        icon_resource_snapshot: string_cell(row, "icon_resource_snapshot"),
        resource_list: string_cell(row, "resource_list"),
        config: string_cell(row, "config"),
        app_type: string_cell(row, "app_type"),
        install_skill: string_cell(row, "install_skill"),
        install_config: string_cell(row, "install_config"),
        release_notes: string_cell(row, "release_notes"),
        artifact_resource_snapshot: string_cell(row, "artifact_resource_snapshot"),
        rating: decimal_cell(row, "rating"),
        download_count: integer_cell(row, "download_count"),
    }
}

fn app_store_scope(subject: Option<AppStoreSubject>) -> AppStoreSubject {
    subject.unwrap_or(AppStoreSubject {
        tenant_id: PUBLIC_APP_STORE_TENANT_ID,
        organization_id: PUBLIC_APP_STORE_ORGANIZATION_ID,
        user_id: PUBLIC_APP_STORE_USER_ID,
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
