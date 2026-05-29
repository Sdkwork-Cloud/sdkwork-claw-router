use sqlx::{PgPool, Row};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    AppGenerationHistoryItem, AppGenerationHistoryReadFuture, AppGenerationHistoryReadStore,
    AppGenerationHistorySubject, AppGenerationMediaItem,
};

const LOAD_GENERATION_HISTORY: &str = r#"
WITH runtime_generation_candidates AS (
    SELECT
        COALESCE(NULLIF(r.run_uuid, ''), r.uuid) AS id,
        to_char((r.created_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS created_at,
        to_char((COALESCE(r.completed_at, i.completed_at, r.created_at) AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS updated_at,
        COALESCE(NULLIF(r.input_message, ''), '') AS prompt,
        r.target_modality AS target_modality,
        lower(COALESCE(
            NULLIF(i.request_json ->> 'targetType', ''),
            NULLIF(i.response_json #>> '{media,0,modality}', ''),
            NULLIF(ar.content_json ->> 'modality', ''),
            NULLIF(ar.artifact_type, ''),
            NULLIF(ar.mime_type, ''),
            NULLIF(ar.storage_url, ''),
            NULLIF(i.response_json #>> '{media,0,url}', '')
        )) AS target_signal,
        COALESCE(NULLIF(r.model, ''), NULLIF(i.model, ''), '') AS model_info,
        COALESCE(NULLIF(r.model, ''), NULLIF(i.model, ''), '') AS model_catalog_key,
        COALESCE(
            NULLIF(ar.storage_url, ''),
            NULLIF(i.response_json #>> '{media,0,url}', ''),
            NULLIF(ar.content_json ->> 'url', ''),
            ''
        ) AS asset_url,
        COALESCE(
            NULLIF(i.response_json #>> '{media,0,thumb}', ''),
            NULLIF(i.response_json #>> '{media,0,thumbnailUrl}', ''),
            NULLIF(ar.content_json ->> 'thumb', ''),
            NULLIF(ar.content_json ->> 'thumbnailUrl', ''),
            ''
        ) AS thumbnail_url,
        i.request_json #>> '{generationConfig,aspectRatio}' AS aspect_ratio,
        COALESCE(
            NULLIF(i.request_json #>> '{generationConfig,durationSeconds}', ''),
            NULLIF(i.response_json #>> '{media,0,durationSeconds}', ''),
            NULLIF(ar.content_json ->> 'durationSeconds', '')
        ) AS duration_seconds,
        COALESCE(NULLIF(r.output_message, ''), NULLIF(i.response_json ->> 'outputText', ''), '') AS output_text,
        CASE lower(COALESCE(r.run_status, ''))
            WHEN 'pending' THEN 0
            WHEN 'queued' THEN 0
            WHEN 'planning' THEN 2
            WHEN 'running' THEN 2
            WHEN 'waiting_for_tool' THEN 2
            WHEN 'completed' THEN 1
            WHEN 'succeeded' THEN 1
            WHEN 'failed' THEN 3
            WHEN 'cancelled' THEN 4
        END AS status_code,
        COALESCE(r.completed_at, i.completed_at, r.created_at) AS sort_updated_at
    FROM ai_agent_run r
    LEFT JOIN LATERAL (
        SELECT i.*
        FROM ai_runtime_invocation i
        WHERE i.tenant_id = r.tenant_id
          AND i.organization_id = r.organization_id
          AND i.user_id = r.user_id
          AND (
              i.agent_run_id = r.run_uuid
              OR i.agent_run_id = r.uuid
          )
        ORDER BY
          CASE lower(COALESCE(i.status, ''))
              WHEN 'completed' THEN 0
              WHEN 'streaming' THEN 1
              WHEN 'running' THEN 2
              WHEN 'failed' THEN 3
              WHEN 'cancelled' THEN 4
              ELSE 5
          END,
          COALESCE(i.completed_at, i.created_at) DESC NULLS LAST,
          i.id DESC
        LIMIT 1
    ) i ON TRUE
    LEFT JOIN LATERAL (
        SELECT ar.*
        FROM ai_runtime_artifact ar
        WHERE ar.tenant_id = r.tenant_id
          AND ar.organization_id = r.organization_id
          AND ar.user_id = r.user_id
          AND (
              ar.agent_run_id = r.run_uuid
              OR ar.agent_run_id = r.uuid
              OR ar.runtime_invocation_id = i.uuid
          )
        ORDER BY
          CASE WHEN NULLIF(ar.storage_url, '') IS NULL THEN 1 ELSE 0 END,
          ar.created_at ASC NULLS LAST,
          ar.id ASC
        LIMIT 1
    ) ar ON TRUE
    WHERE r.status <> 'deleted'
      AND r.source_surface = 'playground'
      AND lower(COALESCE(r.run_status, '')) IN ('pending', 'queued', 'planning', 'running', 'waiting_for_tool', 'completed', 'succeeded', 'failed', 'cancelled')
      AND r.tenant_id = $1
      AND r.organization_id = $2
      AND r.user_id = $3
),
runtime_generation_rows AS (
    SELECT
        id,
        created_at,
        updated_at,
        prompt,
        CASE
            WHEN target_modality IN (1, 2, 3, 4, 5, 6) THEN target_modality
            WHEN target_signal IN ('text', 'llm', 'chat', 'agent') OR target_signal LIKE '%text%' THEN 1
            WHEN target_signal IN ('image', 'images') OR target_signal LIKE '%image%' OR target_signal LIKE '%.png%' OR target_signal LIKE '%.jpg%' OR target_signal LIKE '%.jpeg%' OR target_signal LIKE '%.webp%' THEN 2
            WHEN target_signal = 'video' OR target_signal LIKE '%video%' OR target_signal LIKE '%.mp4%' OR target_signal LIKE '%.webm%' OR target_signal LIKE '%.mov%' THEN 3
            WHEN target_signal = 'music' OR target_signal LIKE '%music%' THEN 5
            WHEN target_signal = 'sfx' OR target_signal LIKE '%sound_effect%' THEN 6
            WHEN target_signal = 'audio' OR target_signal LIKE '%audio%' OR target_signal LIKE '%speech%' OR target_signal LIKE '%voice%' OR target_signal LIKE '%.mp3%' OR target_signal LIKE '%.wav%' OR target_signal LIKE '%.m4a%' THEN 4
            WHEN NULLIF(output_text, '') IS NOT NULL THEN 1
        END AS item_kind,
        model_info,
        model_catalog_key,
        asset_url,
        thumbnail_url,
        aspect_ratio,
        duration_seconds,
        output_text,
        status_code,
        sort_updated_at
    FROM runtime_generation_candidates
)
SELECT
    CAST(COALESCE(a.id, j.id) AS TEXT) AS id,
    to_char((COALESCE(a.created_at, j.created_at) AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS created_at,
    to_char((COALESCE(a.updated_at, j.completed_at, j.created_at) AT TIME ZONE 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS updated_at,
    COALESCE(NULLIF(a.prompt_snapshot, ''), NULLIF(j.prompt, ''), '') AS prompt,
    a.asset_type AS item_kind,
    COALESCE(NULLIF(a.model_snapshot, ''), NULLIF(j.model, ''), '') AS model_info,
    COALESCE(NULLIF(a.model_snapshot, ''), NULLIF(j.model, ''), '') AS model_catalog_key,
    COALESCE(NULLIF(a.asset_url, ''), '') AS asset_url,
    COALESCE(NULLIF(a.thumbnail_url, ''), '') AS thumbnail_url,
    '' AS aspect_ratio,
    '' AS duration_seconds,
    '' AS output_text,
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
    COALESCE(NULLIF(j.model, ''), '') AS model_catalog_key,
    '' AS asset_url,
    '' AS thumbnail_url,
    '' AS aspect_ratio,
    '' AS duration_seconds,
    '' AS output_text,
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
UNION ALL
SELECT
    id,
    created_at,
    updated_at,
    prompt,
    item_kind,
    model_info,
    model_catalog_key,
    asset_url,
    thumbnail_url,
    aspect_ratio,
    duration_seconds,
    output_text,
    status_code,
    sort_updated_at
FROM runtime_generation_rows
WHERE item_kind IN (1, 2, 3, 4, 5, 6)
  AND status_code IN (0, 1, 2, 3, 4)
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
        model_catalog_key: optional_string(string_cell(&row, "model_catalog_key")),
        url,
        images,
        videos,
        aspect_ratio: optional_string(string_cell(&row, "aspect_ratio")),
        duration_seconds: optional_integer_cell(&row, "duration_seconds"),
        status: Some(status.to_owned()),
        output_text: optional_string(string_cell(&row, "output_text")),
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
        1 => Ok("text"),
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
