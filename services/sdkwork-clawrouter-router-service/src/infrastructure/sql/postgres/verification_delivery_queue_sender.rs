use sqlx::{PgPool, Row};

use crate::domain::{DomainError, DomainResult};
use crate::infrastructure::sql::model_catalog_import::stable_uuid;
use crate::infrastructure::sql::verification_delivery_queue::{
    apply_delivery_status, build_verification_queue_payload, json_text, normalize_template_code,
    normalize_token, provider_event_id, queued_receipt, rate_limited_error, store_error,
    write_error, VerificationDeliveryStatus, VerificationQueuePayload,
    VerificationTemplateSelection,
};
use crate::ports::{
    ProviderVerificationDeliveryFuture, ProviderVerificationDeliveryReceipt,
    ProviderVerificationDeliveryRequest, ProviderVerificationDeliverySender,
};

#[derive(Debug, Clone)]
pub struct PostgresVerificationDeliveryQueueSender {
    pool: PgPool,
}

impl PostgresVerificationDeliveryQueueSender {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl ProviderVerificationDeliverySender for PostgresVerificationDeliveryQueueSender {
    fn send_with_config<'a>(
        &'a self,
        request: ProviderVerificationDeliveryRequest,
    ) -> ProviderVerificationDeliveryFuture<'a, ProviderVerificationDeliveryReceipt> {
        Box::pin(async move { queue_verification_delivery(&self.pool, request).await })
    }
}

async fn queue_verification_delivery(
    pool: &PgPool,
    request: ProviderVerificationDeliveryRequest,
) -> DomainResult<ProviderVerificationDeliveryReceipt> {
    if let Some(delivery_status) = existing_delivery_status(pool, &request).await? {
        if delivery_status == VerificationDeliveryStatus::RateLimited.as_str() {
            return Err(rate_limited_error(
                &normalize_token(&request.delivery.channel),
                &normalize_token(&request.delivery.scene),
            ));
        }
        return Ok(queued_receipt(&request));
    }
    let template = load_template_selection(pool, &request).await?;
    let mut payload = build_verification_queue_payload(&request, template)?;
    let delivery_status = if verification_send_limit_reached(pool, &payload).await? {
        VerificationDeliveryStatus::RateLimited
    } else {
        VerificationDeliveryStatus::Queued
    };
    apply_delivery_status(&mut payload, delivery_status);
    insert_delivery(pool, &payload, delivery_status).await?;
    increment_rate_limit_bucket(pool, &payload, delivery_status).await?;
    if delivery_status == VerificationDeliveryStatus::RateLimited {
        return Err(rate_limited_error(&payload.channel, &payload.scene_code));
    }
    Ok(queued_receipt(&request))
}

async fn existing_delivery_status(
    pool: &PgPool,
    request: &ProviderVerificationDeliveryRequest,
) -> DomainResult<Option<String>> {
    sqlx::query_scalar::<_, String>(
        r#"
        SELECT delivery_status
        FROM messaging_send_request
        WHERE tenant_id = $1
          AND organization_id = $2
          AND idempotency_key = $3
        ORDER BY id DESC
        LIMIT 1
        "#,
    )
    .bind(request.config.tenant_id)
    .bind(request.config.organization_id)
    .bind(format!("verification-code:{}", request.delivery.code_id))
    .fetch_optional(pool)
    .await
    .map_err(|error| store_error("failed to replay verification messaging request", error))
}

async fn load_template_selection(
    pool: &PgPool,
    request: &ProviderVerificationDeliveryRequest,
) -> DomainResult<VerificationTemplateSelection> {
    let config = &request.config;
    let scene_code = normalize_token(&config.scene);
    let channel = normalize_token(&config.channel);
    let template_code = config
        .template_code
        .as_ref()
        .map(|value| normalize_template_code(value))
        .filter(|value| !value.is_empty())
        .ok_or_else(|| {
            DomainError::new(format!(
                "verification code delivery template is not configured for channel {channel} scene {scene_code}"
            ))
        })?;
    sqlx::query(
        r#"
        SELECT
            v.id AS version_id,
            x.id AS variant_id,
            v.subject_template AS subject_template,
            x.body_template AS body_template,
            v.variable_schema::text AS variable_schema
        FROM messaging_template t
        JOIN messaging_template_version v
          ON v.tenant_id = t.tenant_id
         AND v.organization_id = t.organization_id
         AND v.template_id = t.id
         AND v.id = t.current_version_id
         AND v.review_status = 'published'
         AND v.status = 1
         AND v.deleted_at IS NULL
        JOIN messaging_template_variant x
          ON x.tenant_id = t.tenant_id
         AND x.organization_id = t.organization_id
         AND x.template_version_id = v.id
         AND x.channel = t.channel
         AND x.status = 1
         AND x.deleted_at IS NULL
         AND x.locale IN ('default')
        WHERE t.tenant_id = $1
          AND t.organization_id = $2
          AND t.scene_code = $3
          AND t.channel = $4
          AND t.delivery_purpose = 'verification'
          AND t.template_code = $5
          AND t.publish_status = 'published'
          AND t.status = 1
          AND t.deleted_at IS NULL
        ORDER BY x.id ASC
        LIMIT 1
        "#,
    )
    .bind(config.tenant_id)
    .bind(config.organization_id)
    .bind(&scene_code)
    .bind(&channel)
    .bind(&template_code)
    .fetch_optional(pool)
    .await
    .map_err(|error| store_error("failed to read verification messaging template", error))?
    .map(|row| {
        Ok(VerificationTemplateSelection {
            version_id: integer_cell(&row, "version_id")?,
            variant_id: integer_cell(&row, "variant_id")?,
            subject_template: optional_string_cell(&row, "subject_template")?,
            body_template: string_cell(&row, "body_template")?,
            variable_schema: json_cell(&row, "variable_schema")?,
        })
    })
    .transpose()?
    .ok_or_else(|| {
        DomainError::not_found(format!(
            "verification messaging template {template_code} is not published for verification/{channel}/{scene_code}"
        ))
    })
}

async fn insert_delivery(
    pool: &PgPool,
    payload: &VerificationQueuePayload,
    delivery_status: VerificationDeliveryStatus,
) -> DomainResult<()> {
    let send_request_id: i64 = sqlx::query_scalar(
        r#"
        INSERT INTO messaging_send_request
            (uuid, tenant_id, organization_id, request_id, payload_hash, request_no,
             idempotency_key, scene_code, channel, delivery_purpose, target_type,
             target_hash, target_masked, template_version_id, template_variant_id,
             resolved_route_rule_id, resolved_provider_account_id, resolved_sender_identity_id,
             render_hash, request_payload_redacted, dry_run, delivery_status)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'verification', $10,
             $11, $12, $13, $14, $15, $16, $17, $18, $19::jsonb, false, $20)
        RETURNING id
        "#,
    )
    .bind(stable_uuid("message-request-row", &[&payload.request_no]))
    .bind(payload.tenant_id)
    .bind(payload.organization_id)
    .bind(&payload.request_id)
    .bind(&payload.payload_hash)
    .bind(&payload.request_no)
    .bind(&payload.idempotency_key)
    .bind(&payload.scene_code)
    .bind(&payload.channel)
    .bind(payload.target_type)
    .bind(&payload.target_hash)
    .bind(&payload.target_masked)
    .bind(payload.template_version_id)
    .bind(payload.template_variant_id)
    .bind(payload.route_rule_id)
    .bind(payload.provider_account_id)
    .bind(payload.sender_identity_id)
    .bind(&payload.render_hash)
    .bind(json_text(&payload.request_payload_redacted))
    .bind(delivery_status.as_str())
    .fetch_one(pool)
    .await
    .map_err(|error| write_error("failed to create verification messaging request", error))?;
    let send_attempt_id: Option<i64> = if delivery_status == VerificationDeliveryStatus::Queued {
        Some(
            sqlx::query_scalar(
                r#"
                INSERT INTO messaging_send_attempt
                    (uuid, tenant_id, organization_id, request_id, payload_hash, send_request_id,
                     attempt_no, provider_code, provider_account_id, provider_status, attempted_at)
                VALUES
                    ($1, $2, $3, $4, $5, $6, 1, $7, $8, 'queued', CURRENT_TIMESTAMP)
                RETURNING id
                "#,
            )
            .bind(stable_uuid(
                "message-attempt",
                &[&send_request_id.to_string(), "1"],
            ))
            .bind(payload.tenant_id)
            .bind(payload.organization_id)
            .bind(&payload.request_id)
            .bind(&payload.payload_hash)
            .bind(send_request_id)
            .bind(&payload.provider_code)
            .bind(payload.provider_account_id)
            .fetch_one(pool)
            .await
            .map_err(|error| {
                write_error("failed to create verification messaging attempt", error)
            })?,
        )
    } else {
        None
    };
    sqlx::query(
        r#"
        INSERT INTO messaging_delivery_event
            (uuid, tenant_id, organization_id, request_id, payload_hash, send_request_id,
             send_attempt_id, provider_code, provider_event_id, provider_message_id,
             event_type, event_at, payload_redacted)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, NULL, $10, CURRENT_TIMESTAMP, $11::jsonb)
        "#,
    )
    .bind(stable_uuid(
        "messaging-delivery-event-row",
        &[&send_request_id.to_string(), delivery_status.as_str()],
    ))
    .bind(payload.tenant_id)
    .bind(payload.organization_id)
    .bind(&payload.request_id)
    .bind(&payload.payload_hash)
    .bind(send_request_id)
    .bind(send_attempt_id)
    .bind(&payload.provider_code)
    .bind(provider_event_id(send_request_id, delivery_status.as_str()))
    .bind(delivery_status.as_str())
    .bind(json_text(&payload.event_payload_redacted))
    .execute(pool)
    .await
    .map_err(|error| write_error("failed to create verification messaging event", error))?;
    Ok(())
}

async fn verification_send_limit_reached(
    pool: &PgPool,
    payload: &VerificationQueuePayload,
) -> DomainResult<bool> {
    let max_send_per_hour = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT max_send_per_hour
        FROM iam_verification_scene_policy
        WHERE tenant_id = $1
          AND organization_id = $2
          AND scene_code = $3
          AND status = 1
          AND deleted_at IS NULL
        LIMIT 1
        "#,
    )
    .bind(payload.tenant_id)
    .bind(payload.organization_id)
    .bind(&payload.scene_code)
    .fetch_optional(pool)
    .await
    .map_err(|error| store_error("failed to read verification send rate limit", error))?;
    let Some(max_send_per_hour) = max_send_per_hour else {
        return Ok(false);
    };
    let send_count = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT COALESCE(MAX(send_count), 0)
        FROM messaging_rate_limit_bucket
        WHERE tenant_id = $1
          AND organization_id = $2
          AND scene_code = $3
          AND channel = $4
          AND target_hash = $5
          AND ip_hash = '*'
          AND device_hash = '*'
          AND window_start = date_trunc('hour', CURRENT_TIMESTAMP)
          AND window_seconds = 3600
          AND status = 1
          AND deleted_at IS NULL
        "#,
    )
    .bind(payload.tenant_id)
    .bind(payload.organization_id)
    .bind(&payload.scene_code)
    .bind(&payload.channel)
    .bind(&payload.target_hash)
    .fetch_one(pool)
    .await
    .map_err(|error| store_error("failed to read verification send rate bucket", error))?;
    Ok(send_count >= max_send_per_hour)
}

async fn increment_rate_limit_bucket(
    pool: &PgPool,
    payload: &VerificationQueuePayload,
    delivery_status: VerificationDeliveryStatus,
) -> DomainResult<()> {
    let send_delta = if delivery_status == VerificationDeliveryStatus::Queued {
        1
    } else {
        0
    };
    let reject_delta = if delivery_status == VerificationDeliveryStatus::RateLimited {
        1
    } else {
        0
    };
    sqlx::query(
        r#"
        INSERT INTO messaging_rate_limit_bucket
            (uuid, tenant_id, organization_id, status, scene_code, channel, target_hash,
             ip_hash, device_hash, window_start, window_seconds, send_count, verify_count,
             reject_count, last_event_at)
        VALUES
            ($1, $2, $3, 1, $4, $5, $6, '*', '*',
             date_trunc('hour', CURRENT_TIMESTAMP), 3600, $7, 0, $8, CURRENT_TIMESTAMP)
        ON CONFLICT (tenant_id, organization_id, scene_code, channel, target_hash,
                     ip_hash, device_hash, window_start, window_seconds)
        DO UPDATE SET
            send_count = messaging_rate_limit_bucket.send_count + EXCLUDED.send_count,
            reject_count = messaging_rate_limit_bucket.reject_count + EXCLUDED.reject_count,
            last_event_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        "#,
    )
    .bind(stable_uuid(
        "messaging-rate-limit-bucket",
        &[
            &payload.tenant_id.to_string(),
            &payload.organization_id.to_string(),
            &payload.scene_code,
            &payload.channel,
            &payload.target_hash,
        ],
    ))
    .bind(payload.tenant_id)
    .bind(payload.organization_id)
    .bind(&payload.scene_code)
    .bind(&payload.channel)
    .bind(&payload.target_hash)
    .bind(send_delta)
    .bind(reject_delta)
    .execute(pool)
    .await
    .map_err(|error| write_error("failed to upsert verification rate-limit bucket", error))?;
    Ok(())
}

fn string_cell(row: &sqlx::postgres::PgRow, column: &str) -> DomainResult<String> {
    if let Ok(value) = row.try_get::<Option<String>, _>(column) {
        return Ok(value.unwrap_or_default());
    }
    if let Ok(value) = row.try_get::<String, _>(column) {
        return Ok(value);
    }
    Err(DomainError::new(format!(
        "verification messaging row column {column} is not readable as text"
    )))
}

fn optional_string_cell(row: &sqlx::postgres::PgRow, column: &str) -> DomainResult<Option<String>> {
    let value = string_cell(row, column)?;
    if value.trim().is_empty() {
        return Ok(None);
    }
    Ok(Some(value))
}

fn json_cell(row: &sqlx::postgres::PgRow, column: &str) -> DomainResult<serde_json::Value> {
    let raw = string_cell(row, column)?;
    if raw.trim().is_empty() {
        return Ok(serde_json::json!({}));
    }
    serde_json::from_str(&raw).map_err(|error| {
        DomainError::new(format!(
            "invalid verification messaging json {column}: {error}"
        ))
    })
}

fn integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> DomainResult<i64> {
    if let Ok(value) = row.try_get::<i64, _>(column) {
        return Ok(value);
    }
    if let Ok(value) = row.try_get::<i32, _>(column) {
        return Ok(i64::from(value));
    }
    Err(DomainError::new(format!(
        "verification messaging row column {column} is not readable as integer"
    )))
}
