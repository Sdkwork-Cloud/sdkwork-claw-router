use sqlx::{PgPool, Row};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    AppGenerationHistoryItem, AppGenerationHistoryReadFuture, AppGenerationHistoryReadStore,
    AppGenerationHistorySubject, AppGenerationMediaItem,
};

const LOAD_GENERATION_HISTORY: &str = r#"
SELECT
    CAST(COALESCE(a.id, j.id) AS TEXT) AS id,
    to_char((COALESCE(a.created_at, j.created_at) AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS created_at,
    to_char((COALESCE(a.updated_at, j.completed_at, j.created_at) AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS updated_at,
    COALESCE(NULLIF(a.prompt_snapshot, ''), NULLIF(j.prompt, ''), '') AS prompt,
    a.asset_type AS item_kind,
    COALESCE(NULLIF(a.model_snapshot, ''), NULLIF(j.model, ''), '') AS model_info,
    COALESCE(NULLIF(a.asset_url, ''), '') AS asset_url,
    COALESCE(NULLIF(a.thumbnail_url, ''), '') AS thumbnail_url,
    a.status AS status_code,
    COALESCE(a.updated_at, j.completed_at, j.created_at) AS sort_updated_at
FROM ai_generation_asset a
LEFT JOIN ai_generation_job j
  ON j.id = a.job_id
 AND j.tenant_id = a.tenant_id
 AND j.organization_id = a.organization_id
 AND j.user_id = a.user_id
WHERE a.deleted_at IS NULL
  AND a.status IN (0, 1, 2, 3, 4)
  AND a.asset_type IN (2, 3, 4, 5, 6)
  AND a.tenant_id = $1
  AND a.organization_id = $2
  AND a.user_id = $3
UNION ALL
SELECT
    CAST(j.id AS TEXT) AS id,
    to_char((j.created_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS created_at,
    to_char((COALESCE(j.completed_at, j.created_at) AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS updated_at,
    COALESCE(NULLIF(j.prompt, ''), '') AS prompt,
    j.modality AS item_kind,
    COALESCE(NULLIF(j.model, ''), '') AS model_info,
    '' AS asset_url,
    '' AS thumbnail_url,
    j.status AS status_code,
    COALESCE(j.completed_at, j.created_at) AS sort_updated_at
FROM ai_generation_job j
WHERE j.status IN (0, 1, 2, 3, 4)
  AND j.modality IN (2, 3, 4, 5, 6)
  AND j.tenant_id = $1
  AND j.organization_id = $2
  AND j.user_id = $3
  AND NOT EXISTS (
      SELECT 1
      FROM ai_generation_asset a
      WHERE a.job_id = j.id
        AND a.tenant_id = j.tenant_id
        AND a.organization_id = j.organization_id
        AND a.user_id = j.user_id
        AND a.deleted_at IS NULL
        AND a.status IN (0, 1, 2, 3, 4)
        AND a.asset_type IN (2, 3, 4, 5, 6)
  )
ORDER BY sort_updated_at DESC NULLS LAST, id DESC
LIMIT 100
"#;

#[derive(Debug, Clone)]
pub struct PostgresAppGenerationHistoryReadStore {
    pool: PgPool,
}

impl PostgresAppGenerationHistoryReadStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl AppGenerationHistoryReadStore for PostgresAppGenerationHistoryReadStore {
    fn load_generation_history<'a>(
        &'a self,
        subject: Option<AppGenerationHistorySubject>,
    ) -> AppGenerationHistoryReadFuture<'a, Vec<AppGenerationHistoryItem>> {
        Box::pin(async move {
            let subject = require_subject(subject)?;
            let rows = sqlx::query(LOAD_GENERATION_HISTORY)
                .bind(subject.tenant_id)
                .bind(subject.organization_id)
                .bind(subject.user_id)
                .fetch_all(&self.pool)
                .await
                .map_err(sql_error)?;
            rows.into_iter().map(row_to_history_item).collect()
        })
    }
}

fn row_to_history_item(row: sqlx::postgres::PgRow) -> DomainResult<AppGenerationHistoryItem> {
    let item_type = item_type_label(required_integer_cell(&row, "item_kind", "item kind")?)?;
    let status = status_label(required_integer_cell(&row, "status_code", "status")?)?;
    let asset_url = string_cell(&row, "asset_url");
    let thumbnail_url = string_cell(&row, "thumbnail_url");
    let created_at = string_cell(&row, "created_at");
    let updated_at = string_cell(&row, "updated_at");
    let url = optional_string(asset_url.clone());
    let images = if (item_type == "image" || item_type == "images") && !asset_url.is_empty() {
        vec![asset_url.clone()]
    } else {
        Vec::new()
    };
    let videos = if item_type == "video" && !asset_url.is_empty() {
        vec![AppGenerationMediaItem {
            url: asset_url.clone(),
            thumb: optional_string(thumbnail_url),
        }]
    } else {
        Vec::new()
    };

    Ok(AppGenerationHistoryItem {
        id: string_cell(&row, "id"),
        date: history_date(&created_at),
        prompt: string_cell(&row, "prompt"),
        item_type: item_type.to_owned(),
        model_info: optional_string(string_cell(&row, "model_info")),
        url,
        images,
        videos,
        status: Some(status.to_owned()),
        created_at: optional_string(created_at),
        updated_at: optional_string(updated_at),
    })
}

fn require_subject(
    subject: Option<AppGenerationHistorySubject>,
) -> DomainResult<AppGenerationHistorySubject> {
    subject.ok_or_else(|| {
        DomainError::new("trusted request subject is required for app generation history")
    })
}

fn item_type_label(value: i64) -> DomainResult<&'static str> {
    match value {
        2 => Ok("image"),
        3 => Ok("video"),
        4 => Ok("audio"),
        5 => Ok("music"),
        6 => Ok("sfx"),
        value => Err(DomainError::new(format!(
            "invalid generation history item kind from database row: {value}"
        ))),
    }
}

fn status_label(value: i64) -> DomainResult<&'static str> {
    match value {
        0 => Ok("pending"),
        1 => Ok("completed"),
        2 => Ok("processing"),
        3 => Ok("failed"),
        4 => Ok("cancelled"),
        value => Err(DomainError::new(format!(
            "invalid generation history status from database row: {value}"
        ))),
    }
}

fn history_date(value: &str) -> String {
    value.get(0..10).unwrap_or(value).to_owned()
}

fn optional_string(value: String) -> Option<String> {
    let trimmed = value.trim();
    (!trimmed.is_empty()).then(|| trimmed.to_owned())
}

fn string_cell(row: &sqlx::postgres::PgRow, column: &str) -> String {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .unwrap_or_default()
}

fn required_integer_cell(
    row: &sqlx::postgres::PgRow,
    column: &str,
    source: &str,
) -> DomainResult<i64> {
    optional_integer_cell(row, column).ok_or_else(|| {
        DomainError::new(format!(
            "missing generation history {source} from database row"
        ))
    })
}

fn optional_integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<i64> {
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
}

fn sql_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}
