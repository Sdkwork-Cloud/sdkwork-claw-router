use sqlx::{Row, SqlitePool};

use crate::domain::{DomainError, DomainResult};
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
    let rows = sqlx::query(
        r#"
        SELECT
            c.id AS channel_id,
            c.tenant_id,
            c.organization_id,
            c.provider_code,
            COALESCE(c.base_url_override, '') AS base_url,
            COALESCE(c.capabilities, '[]') AS capabilities_json,
            COALESCE(c.priority, 100) AS priority,
            COALESCE(c.weight, 0) AS weight,
            a.id AS account_id,
            COALESCE(a.account_code, '') AS account_code,
            COALESCE(a.secret_ref, '') AS secret_ref,
            COALESCE(a.auth_config, '{}') AS auth_config_json
        FROM integration_channel c
        JOIN integration_provider_account a
          ON a.id = c.account_id
         AND a.tenant_id = c.tenant_id
         AND a.organization_id = c.organization_id
         AND a.status = 1
         AND a.deleted_at IS NULL
        WHERE c.tenant_id = ?
          AND c.organization_id = ?
          AND c.status = 1
          AND c.deleted_at IS NULL
        ORDER BY COALESCE(c.priority, 100) ASC, COALESCE(c.weight, 0) DESC, c.id DESC
        "#,
    )
    .bind(query.tenant_id)
    .bind(query.organization_id)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to read verification delivery config", error))?;

    for row in rows {
        let capabilities_json = string_cell(&row, "capabilities_json");
        let capabilities = parse_string_list(&capabilities_json);
        if !matches_channel(&capabilities, &channel) || !matches_scene(&capabilities, &scene) {
            continue;
        }
        let secret_ref = string_cell(&row, "secret_ref");
        if secret_ref.trim().is_empty() {
            return Err(DomainError::new(format!(
                "verification code delivery provider is missing secret_ref for channel {channel} scene {scene}"
            )));
        }
        let auth_config_json = string_cell(&row, "auth_config_json");
        let auth_config = parse_json_object(&auth_config_json);
        return Ok(Some(VerificationDeliveryConfig {
            channel_id: integer_cell(&row, "channel_id"),
            account_id: integer_cell(&row, "account_id"),
            tenant_id: integer_cell(&row, "tenant_id"),
            organization_id: integer_cell(&row, "organization_id"),
            provider_code: string_cell(&row, "provider_code"),
            channel,
            scene,
            account_code: string_cell(&row, "account_code"),
            secret_ref,
            base_url: optional_non_empty(string_cell(&row, "base_url")),
            template_code: config_value(&auth_config, &["templateCode", "template_code"]),
            sender: config_value(&auth_config, &["sender", "from", "signName", "sign_name"]),
            priority: integer_cell(&row, "priority"),
            weight: integer_cell(&row, "weight"),
        }));
    }
    Ok(None)
}

fn matches_channel(capabilities: &[String], channel: &str) -> bool {
    let channel_capability = format!("verification:{channel}");
    capabilities
        .iter()
        .any(|capability| capability == channel || capability == &channel_capability)
}

fn matches_scene(capabilities: &[String], scene: &str) -> bool {
    let scene_capability = format!("verification:scene:{scene}");
    capabilities
        .iter()
        .any(|capability| capability == &scene_capability)
        || capabilities
            .iter()
            .all(|capability| !capability.starts_with("verification:scene:"))
}

fn parse_string_list(raw: &str) -> Vec<String> {
    serde_json::from_str::<Vec<String>>(raw)
        .unwrap_or_default()
        .into_iter()
        .map(|value| normalize_token(&value))
        .filter(|value| !value.is_empty())
        .collect()
}

fn parse_json_object(raw: &str) -> serde_json::Map<String, serde_json::Value> {
    serde_json::from_str::<serde_json::Value>(raw)
        .ok()
        .and_then(|value| value.as_object().cloned())
        .unwrap_or_default()
}

fn config_value(
    object: &serde_json::Map<String, serde_json::Value>,
    keys: &[&str],
) -> Option<String> {
    keys.iter().find_map(|key| {
        object
            .get(*key)
            .and_then(|value| value.as_str())
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .map(str::to_owned)
    })
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

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}
