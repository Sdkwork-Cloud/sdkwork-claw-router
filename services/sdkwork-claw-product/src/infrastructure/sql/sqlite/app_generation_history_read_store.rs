use serde_json::{json, Value};
use sqlx::{Row, SqlitePool};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    AppGenerationHistoryItem, AppGenerationHistoryReadFuture, AppGenerationHistoryReadStore,
    AppGenerationHistorySubject,
};

const LOAD_GENERATION_HISTORY: &str = r#"
WITH runtime_generation_candidates AS (
    SELECT
        COALESCE(NULLIF(r.run_uuid, ''), r.uuid) AS id,
        strftime('%Y-%m-%dT%H:%M:%SZ', r.created_at) AS created_at,
        strftime('%Y-%m-%dT%H:%M:%SZ', COALESCE(r.completed_at, i.completed_at, r.created_at)) AS updated_at,
        COALESCE(NULLIF(r.input_message, ''), '') AS prompt,
        r.target_modality AS target_modality,
        lower(COALESCE(
            NULLIF(CASE WHEN json_valid(i.request_json) THEN json_extract(i.request_json, '$.targetType') END, ''),
            NULLIF(CASE WHEN json_valid(i.response_json) THEN json_extract(i.response_json, '$.media[0].modality') END, ''),
            NULLIF(CASE WHEN json_valid(i.response_json) THEN json_extract(i.response_json, '$.media[0].asset.kind') END, ''),
            NULLIF(CASE WHEN json_valid(i.response_json) THEN json_extract(i.response_json, '$.media[0].asset.mimeType') END, ''),
            NULLIF(CASE WHEN json_valid(ar.resource_snapshot) THEN json_extract(ar.resource_snapshot, '$.kind') END, ''),
            NULLIF(CASE WHEN json_valid(ar.content_json) THEN json_extract(ar.content_json, '$.modality') END, ''),
            NULLIF(ar.artifact_type, ''),
            NULLIF(CASE WHEN json_valid(ar.resource_snapshot) THEN json_extract(ar.resource_snapshot, '$.mimeType') END, ''),
            NULLIF(ar.mime_type, ''),
            NULLIF(CASE WHEN json_valid(ar.resource_snapshot) THEN json_extract(ar.resource_snapshot, '$.publicUrl') END, ''),
            NULLIF(CASE WHEN json_valid(ar.resource_snapshot) THEN json_extract(ar.resource_snapshot, '$.url') END, ''),
            NULLIF(CASE WHEN json_valid(ar.resource_snapshot) THEN json_extract(ar.resource_snapshot, '$.uri') END, ''),
            NULLIF(CASE WHEN json_valid(ar.resource_snapshot) THEN json_extract(ar.resource_snapshot, '$.objectKey') END, ''),
            NULLIF(CASE WHEN json_valid(i.response_json) THEN json_extract(i.response_json, '$.media[0].asset.publicUrl') END, ''),
            NULLIF(CASE WHEN json_valid(i.response_json) THEN json_extract(i.response_json, '$.media[0].asset.url') END, ''),
            NULLIF(CASE WHEN json_valid(i.response_json) THEN json_extract(i.response_json, '$.media[0].asset.uri') END, ''),
            NULLIF(CASE WHEN json_valid(i.response_json) THEN json_extract(i.response_json, '$.media[0].asset.objectKey') END, '')
        )) AS target_signal,
        COALESCE(NULLIF(r.model, ''), NULLIF(i.model, ''), '') AS model_info,
        COALESCE(NULLIF(r.model, ''), NULLIF(i.model, ''), '') AS model_catalog_key,
        COALESCE(
            NULLIF(CASE WHEN json_valid(ar.resource_snapshot) THEN ar.resource_snapshot END, ''),
            NULLIF(CASE WHEN json_valid(i.response_json) THEN json_extract(i.response_json, '$.media[0].asset') END, ''),
            ''
        ) AS asset_resource_snapshot,
        COALESCE(
            NULLIF(CASE WHEN json_valid(ar.resource_snapshot) THEN json_extract(ar.resource_snapshot, '$.poster') END, ''),
            NULLIF(CASE WHEN json_valid(ar.resource_snapshot) THEN json_extract(ar.resource_snapshot, '$.thumbnails[0]') END, ''),
            NULLIF(CASE WHEN json_valid(i.response_json) THEN json_extract(i.response_json, '$.media[0].asset.poster') END, ''),
            NULLIF(CASE WHEN json_valid(i.response_json) THEN json_extract(i.response_json, '$.media[0].asset.thumbnails[0]') END, ''),
            ''
        ) AS thumbnail_resource_snapshot,
        CASE WHEN json_valid(i.request_json) THEN json_extract(i.request_json, '$.generationConfig.aspectRatio') END AS aspect_ratio,
        COALESCE(
            CASE WHEN json_valid(ar.resource_snapshot) THEN json_extract(ar.resource_snapshot, '$.durationSeconds') END,
            CASE WHEN json_valid(i.request_json) THEN json_extract(i.request_json, '$.generationConfig.durationSeconds') END,
            CASE WHEN json_valid(i.response_json) THEN json_extract(i.response_json, '$.media[0].asset.durationSeconds') END
        ) AS duration_seconds,
        COALESCE(
            NULLIF(r.output_message, ''),
            NULLIF(CASE WHEN json_valid(i.response_json) THEN json_extract(i.response_json, '$.outputText') END, ''),
            ''
        ) AS output_text,
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
    LEFT JOIN ai_runtime_invocation i
      ON i.id = (
          SELECT ii.id
          FROM ai_runtime_invocation ii
          WHERE ii.tenant_id = r.tenant_id
            AND ii.organization_id = r.organization_id
            AND ii.user_id = r.user_id
            AND (
                ii.agent_run_id = r.run_uuid
                OR ii.agent_run_id = r.uuid
            )
          ORDER BY
            CASE lower(COALESCE(ii.status, ''))
                WHEN 'completed' THEN 0
                WHEN 'streaming' THEN 1
                WHEN 'running' THEN 2
                WHEN 'failed' THEN 3
                WHEN 'cancelled' THEN 4
                ELSE 5
            END,
            COALESCE(ii.completed_at, ii.created_at) DESC,
            ii.id DESC
          LIMIT 1
      )
    LEFT JOIN ai_runtime_artifact ar
      ON ar.id = (
          SELECT aa.id
          FROM ai_runtime_artifact aa
          WHERE aa.tenant_id = r.tenant_id
            AND aa.organization_id = r.organization_id
            AND aa.user_id = r.user_id
            AND (
                aa.agent_run_id = r.run_uuid
                OR aa.agent_run_id = r.uuid
                OR aa.runtime_invocation_id = i.uuid
            )
          ORDER BY
            CASE
                WHEN COALESCE(
                    NULLIF(CASE WHEN json_valid(aa.resource_snapshot) THEN json_extract(aa.resource_snapshot, '$.publicUrl') END, ''),
                    NULLIF(CASE WHEN json_valid(aa.resource_snapshot) THEN json_extract(aa.resource_snapshot, '$.url') END, ''),
                    NULLIF(CASE WHEN json_valid(aa.resource_snapshot) THEN json_extract(aa.resource_snapshot, '$.uri') END, ''),
                    NULLIF(CASE WHEN json_valid(aa.resource_snapshot) THEN json_extract(aa.resource_snapshot, '$.objectKey') END, ''),
                    NULLIF(CASE WHEN json_valid(aa.resource_snapshot) THEN json_extract(aa.resource_snapshot, '$.objectBlobId') END, ''),
                    NULLIF(CASE WHEN json_valid(aa.resource_snapshot) THEN json_extract(aa.resource_snapshot, '$.id') END, '')
                ) IS NULL THEN 1 ELSE 0
            END,
            aa.created_at ASC,
            aa.id ASC
          LIMIT 1
      )
    WHERE r.status <> 'deleted'
      AND lower(COALESCE(r.source_surface, '')) = 'playground'
      AND lower(COALESCE(r.run_status, '')) IN ('pending', 'queued', 'planning', 'running', 'waiting_for_tool', 'completed', 'succeeded', 'failed', 'cancelled')
      AND r.tenant_id = ?1
      AND r.organization_id = ?2
      AND r.user_id = ?3
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
        asset_resource_snapshot,
        thumbnail_resource_snapshot,
        aspect_ratio,
        duration_seconds,
        output_text,
        status_code,
        sort_updated_at
    FROM runtime_generation_candidates
)
SELECT
    CAST(COALESCE(a.id, j.id) AS TEXT) AS id,
    strftime('%Y-%m-%dT%H:%M:%SZ', COALESCE(a.created_at, j.created_at)) AS created_at,
    strftime('%Y-%m-%dT%H:%M:%SZ', COALESCE(a.updated_at, j.completed_at, j.created_at)) AS updated_at,
    COALESCE(NULLIF(a.prompt_snapshot, ''), NULLIF(j.prompt, ''), '') AS prompt,
    a.asset_type AS item_kind,
    COALESCE(NULLIF(a.model_snapshot, ''), NULLIF(j.model, ''), '') AS model_info,
    COALESCE(NULLIF(a.model_snapshot, ''), NULLIF(j.model, ''), '') AS model_catalog_key,
    COALESCE(CAST(a.asset_resource_snapshot AS TEXT), '') AS asset_resource_snapshot,
    COALESCE(CAST(a.thumbnail_resource_snapshot AS TEXT), '') AS thumbnail_resource_snapshot,
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
  AND a.tenant_id = ?1
  AND a.organization_id = ?2
  AND a.user_id = ?3
UNION ALL
SELECT
    CAST(j.id AS TEXT) AS id,
    strftime('%Y-%m-%dT%H:%M:%SZ', j.created_at) AS created_at,
    strftime('%Y-%m-%dT%H:%M:%SZ', COALESCE(j.completed_at, j.created_at)) AS updated_at,
    COALESCE(NULLIF(j.prompt, ''), '') AS prompt,
    j.modality AS item_kind,
    COALESCE(NULLIF(j.model, ''), '') AS model_info,
    COALESCE(NULLIF(j.model, ''), '') AS model_catalog_key,
    '' AS asset_resource_snapshot,
    '' AS thumbnail_resource_snapshot,
    '' AS aspect_ratio,
    '' AS duration_seconds,
    '' AS output_text,
    j.status AS status_code,
    COALESCE(j.completed_at, j.created_at) AS sort_updated_at
FROM ai_generation_job j
WHERE j.status IN (0, 1, 2, 3, 4)
  AND j.modality IN (2, 3, 4, 5, 6)
  AND j.tenant_id = ?1
  AND j.organization_id = ?2
  AND j.user_id = ?3
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
    asset_resource_snapshot,
    thumbnail_resource_snapshot,
    aspect_ratio,
    duration_seconds,
    output_text,
    status_code,
    sort_updated_at
FROM runtime_generation_rows
WHERE item_kind IN (1, 2, 3, 4, 5, 6)
  AND status_code IN (0, 1, 2, 3, 4)
ORDER BY sort_updated_at DESC, id DESC
LIMIT 100
"#;

#[derive(Debug, Clone)]
pub struct SqliteAppGenerationHistoryReadStore {
    pool: SqlitePool,
}

impl SqliteAppGenerationHistoryReadStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl AppGenerationHistoryReadStore for SqliteAppGenerationHistoryReadStore {
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

fn row_to_history_item(row: sqlx::sqlite::SqliteRow) -> DomainResult<AppGenerationHistoryItem> {
    let item_type = item_type_label(required_integer_cell(&row, "item_kind", "item kind")?)?;
    let status = status_label(required_integer_cell(&row, "status_code", "status")?)?;
    let asset_resource_snapshot = string_cell(&row, "asset_resource_snapshot");
    let thumbnail_resource_snapshot = string_cell(&row, "thumbnail_resource_snapshot");
    let created_at = string_cell(&row, "created_at");
    let updated_at = string_cell(&row, "updated_at");
    let duration_seconds = optional_integer_cell(&row, "duration_seconds");
    let asset = media_resource_from_snapshot(
        item_type,
        &asset_resource_snapshot,
        &thumbnail_resource_snapshot,
        duration_seconds,
    );

    Ok(AppGenerationHistoryItem {
        id: string_cell(&row, "id"),
        date: history_date(&created_at),
        prompt: string_cell(&row, "prompt"),
        item_type: item_type.to_owned(),
        model_info: optional_string(string_cell(&row, "model_info")),
        model_catalog_key: optional_string(string_cell(&row, "model_catalog_key")),
        asset: asset.clone(),
        images: media_resource_array_for_type(&item_type, &asset, "image"),
        videos: media_resource_array_for_type(&item_type, &asset, "video"),
        aspect_ratio: optional_string(string_cell(&row, "aspect_ratio")),
        duration_seconds,
        status: Some(status.to_owned()),
        output_text: optional_string(string_cell(&row, "output_text")),
        created_at: optional_string(created_at),
        updated_at: optional_string(updated_at),
    })
}

fn media_resource_from_snapshot(
    item_type: &str,
    asset_resource_snapshot: &str,
    thumbnail_resource_snapshot: &str,
    duration_seconds: Option<i64>,
) -> Option<Value> {
    let mut resource = media_resource_value_from_snapshot(asset_resource_snapshot)?;
    if let Some(duration_seconds) = duration_seconds {
        if resource.get("durationSeconds").is_none() {
            resource["durationSeconds"] = json!(duration_seconds);
        }
    }
    if item_type == "video" {
        if let Some(thumbnail) = media_resource_value_from_snapshot(thumbnail_resource_snapshot) {
            if resource.get("poster").is_none() {
                resource["poster"] = thumbnail.clone();
            }
            let has_thumbnails = resource
                .get("thumbnails")
                .and_then(Value::as_array)
                .is_some_and(|items| !items.is_empty());
            if !has_thumbnails {
                resource["thumbnails"] = json!([thumbnail]);
            }
        }
    }
    Some(resource)
}

fn media_resource_value_from_snapshot(snapshot: &str) -> Option<Value> {
    let snapshot = snapshot.trim();
    if snapshot.is_empty() {
        return None;
    }
    let value: Value = serde_json::from_str(snapshot).ok()?;
    if value.get("kind").and_then(Value::as_str).is_none()
        || value.get("source").and_then(Value::as_str).is_none()
    {
        return None;
    }
    Some(value)
}

fn media_resource_array_for_type(
    item_type: &str,
    asset: &Option<Value>,
    expected: &str,
) -> Vec<Value> {
    if media_kind_for_item_type(item_type) == expected {
        asset.iter().cloned().collect()
    } else {
        Vec::new()
    }
}

fn media_kind_for_item_type(item_type: &str) -> &'static str {
    match item_type {
        "image" | "images" => "image",
        "video" => "video",
        "audio" | "music" | "sfx" => "audio",
        _ => "other",
    }
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

fn string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> String {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .unwrap_or_default()
}

fn required_integer_cell(
    row: &sqlx::sqlite::SqliteRow,
    column: &str,
    source: &str,
) -> DomainResult<i64> {
    optional_integer_cell(row, column).ok_or_else(|| {
        DomainError::new(format!(
            "missing generation history {source} from database row"
        ))
    })
}

fn optional_integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<i64> {
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
