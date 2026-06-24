use sqlx::{Row, SqlitePool};

use crate::domain::{DomainError, DomainResult};
use crate::infrastructure::sql::store_error::redacted_store_error;
use crate::ports::{
    VerificationDeliveryConfig, VerificationDeliveryConfigFuture, VerificationDeliveryConfigQuery,
    VerificationDeliveryConfigStore,
};

#[derive(Debug, Clone)]
pub struct SqliteVerificationDeliveryConfigStore {
    pool: SqlitePool,
}

impl SqliteVerificationDeliveryConfigStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl VerificationDeliveryConfigStore for SqliteVerificationDeliveryConfigStore {
    fn active_config_for<'a>(
        &'a self,
        query: VerificationDeliveryConfigQuery,
    ) -> VerificationDeliveryConfigFuture<'a, Option<VerificationDeliveryConfig>> {
        Box::pin(async move { active_config_for(&self.pool, query).await })
    }
}

async fn active_config_for(
    pool: &SqlitePool,
    query: VerificationDeliveryConfigQuery,
) -> DomainResult<Option<VerificationDeliveryConfig>> {
    let channel = normalize_token(&query.channel);
    let scene = normalize_token(&query.scene);
    sqlx::query(
        r#"
        SELECT
            r.id AS route_rule_id,
            r.tenant_id,
            r.organization_id,
            t.provider_code,
            COALESCE(a.base_url, '') AS base_url,
            COALESCE(r.priority, 100) AS priority,
            COALESCE(t.weight, r.weight, 0) AS weight,
            a.id AS account_id,
            COALESCE(a.account_code, '') AS account_code,
            COALESCE(a.secret_ref, '') AS secret_ref,
            t.sender_identity_id AS sender_identity_id,
            COALESCE(si.from_email, si.sign_name, si.sender_id, si.display_name, '') AS sender,
            p.template_code AS template_code
        FROM messaging_route_rule r
        JOIN iam_verification_scene_policy p
          ON p.tenant_id = r.tenant_id
         AND p.organization_id = r.organization_id
         AND p.scene_code = r.scene_code
         AND p.template_code <> ''
         AND p.status = 1
         AND p.deleted_at IS NULL
        JOIN messaging_route_rule_target t
          ON t.tenant_id = r.tenant_id
         AND t.organization_id = r.organization_id
         AND t.route_rule_id = r.id
         AND t.status = 1
         AND t.deleted_at IS NULL
         AND t.target_order = (
             SELECT MIN(t2.target_order)
             FROM messaging_route_rule_target t2
             JOIN messaging_provider_capability pc2
               ON pc2.tenant_id = t2.tenant_id
              AND pc2.organization_id = t2.organization_id
              AND pc2.provider_account_id = t2.provider_account_id
              AND pc2.provider_code = t2.provider_code
              AND pc2.channel = r.channel
              AND pc2.delivery_purpose = 'verification'
              AND pc2.status = 1
              AND pc2.deleted_at IS NULL
             WHERE t2.tenant_id = r.tenant_id
               AND t2.organization_id = r.organization_id
               AND t2.route_rule_id = r.id
               AND t2.status = 1
               AND t2.deleted_at IS NULL
         )
        JOIN messaging_provider_capability pc
          ON pc.tenant_id = t.tenant_id
         AND pc.organization_id = t.organization_id
         AND pc.provider_account_id = t.provider_account_id
         AND pc.provider_code = t.provider_code
         AND pc.channel = r.channel
         AND pc.delivery_purpose = 'verification'
         AND pc.status = 1
         AND pc.deleted_at IS NULL
        JOIN integration_provider_account a
          ON a.id = t.provider_account_id
         AND a.tenant_id = t.tenant_id
         AND a.organization_id = t.organization_id
         AND a.status = 1
         AND a.deleted_at IS NULL
        LEFT JOIN messaging_sender_identity si
          ON si.id = t.sender_identity_id
         AND si.tenant_id = t.tenant_id
         AND si.organization_id = t.organization_id
         AND si.status = 1
         AND si.deleted_at IS NULL
        LEFT JOIN messaging_template mt
          ON mt.tenant_id = r.tenant_id
         AND mt.organization_id = r.organization_id
         AND mt.scene_code = r.scene_code
         AND mt.channel = r.channel
         AND mt.delivery_purpose = r.delivery_purpose
         AND mt.template_code = p.template_code
         AND mt.publish_status = 'published'
         AND mt.status = 1
         AND mt.deleted_at IS NULL
        WHERE r.tenant_id = ?
          AND r.organization_id = ?
          AND r.scene_code = ?
          AND r.channel = ?
          AND r.delivery_purpose = 'verification'
          AND mt.id IS NOT NULL
          AND r.status = 1
          AND r.deleted_at IS NULL
        ORDER BY COALESCE(r.priority, 100) ASC, COALESCE(t.weight, r.weight, 0) DESC, r.id DESC
        LIMIT 1
        "#,
    )
    .bind(query.tenant_id)
    .bind(query.organization_id)
    .bind(&scene)
    .bind(&channel)
    .fetch_optional(pool)
    .await
    .map_err(|error| store_error("failed to read verification delivery config", error))?
    .map(|row| {
        let secret_ref = string_cell(&row, "secret_ref");
        if secret_ref.trim().is_empty() {
            return Err(DomainError::new(format!(
                "verification code delivery provider is missing secret_ref for channel {channel} scene {scene}"
            )));
        }
        Ok(VerificationDeliveryConfig {
            route_rule_id: integer_cell(&row, "route_rule_id"),
            account_id: integer_cell(&row, "account_id"),
            tenant_id: integer_cell(&row, "tenant_id"),
            organization_id: integer_cell(&row, "organization_id"),
            provider_code: string_cell(&row, "provider_code"),
            channel,
            scene,
            account_code: string_cell(&row, "account_code"),
            secret_ref,
            base_url: optional_non_empty(string_cell(&row, "base_url")),
            template_code: optional_non_empty(string_cell(&row, "template_code")),
            sender_identity_id: optional_integer_cell(&row, "sender_identity_id"),
            sender: optional_non_empty(string_cell(&row, "sender")),
            priority: integer_cell(&row, "priority"),
            weight: integer_cell(&row, "weight"),
        })
    })
    .transpose()
}

fn normalize_token(value: &str) -> String {
    value.trim().to_ascii_lowercase().replace('-', "_")
}

fn optional_non_empty(value: String) -> Option<String> {
    let trimmed = value.trim();
    if trimmed.is_empty() {
        None
    } else {
        Some(trimmed.to_owned())
    }
}

fn string_cell(row: &sqlx::sqlite::SqliteRow, name: &str) -> String {
    row.try_get::<String, _>(name).unwrap_or_default()
}

fn integer_cell(row: &sqlx::sqlite::SqliteRow, name: &str) -> i64 {
    row.try_get::<i64, _>(name).unwrap_or_default()
}

fn optional_integer_cell(row: &sqlx::sqlite::SqliteRow, name: &str) -> Option<i64> {
    row.try_get::<Option<i64>, _>(name).ok().flatten()
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    redacted_store_error(context, error)
}
