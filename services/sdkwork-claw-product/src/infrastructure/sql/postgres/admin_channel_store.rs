use std::collections::HashMap;
use std::sync::Arc;

use sha2::{Digest, Sha256};
use sqlx::{PgPool, Postgres, Row, Transaction};

use crate::application::ApiKeySecretCodec;
use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    AdminChannelCommandFuture, AdminChannelItem, AdminChannelStore, AdminChannelTestOutcome,
    CreateAdminChannelCommand, DeleteAdminChannelCommand, ListAdminChannelsQuery,
    ProviderHealthProbe, ProviderHealthProbeOutcome, ProviderHealthProbeRequest,
    TestAdminChannelCommand, UnconfiguredProviderHealthProbe, UpdateAdminChannelCommand,
};

const CHANNEL_TARGET_TYPE: i32 = 10;
const CONFIG_SCOPE_ROUTER: i32 = 10;
const CONFIG_TYPE_CHANNEL: i32 = 20;

#[derive(Clone)]
pub struct PostgresAdminChannelStore {
    pool: PgPool,
    provider_health_probe: Arc<dyn ProviderHealthProbe + Send + Sync>,
    api_key_secret_codec: Option<Arc<dyn ApiKeySecretCodec + Send + Sync>>,
}

impl std::fmt::Debug for PostgresAdminChannelStore {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        formatter
            .debug_struct("PostgresAdminChannelStore")
            .field("pool", &self.pool)
            .field("provider_health_probe", &"[configured]")
            .field("api_key_secret_codec", &self.api_key_secret_codec.is_some())
            .finish()
    }
}

impl PostgresAdminChannelStore {
    pub fn new(pool: PgPool) -> Self {
        Self::with_provider_health_probe(pool, Arc::new(UnconfiguredProviderHealthProbe))
    }

    pub fn with_provider_health_probe(
        pool: PgPool,
        provider_health_probe: Arc<dyn ProviderHealthProbe + Send + Sync>,
    ) -> Self {
        Self {
            pool,
            provider_health_probe,
            api_key_secret_codec: None,
        }
    }

    pub fn with_api_key_secret_codec(
        pool: PgPool,
        api_key_secret_codec: Arc<dyn ApiKeySecretCodec + Send + Sync>,
    ) -> Self {
        Self::with_provider_health_probe_and_api_key_secret_codec(
            pool,
            Arc::new(UnconfiguredProviderHealthProbe),
            api_key_secret_codec,
        )
    }

    pub fn with_provider_health_probe_and_api_key_secret_codec(
        pool: PgPool,
        provider_health_probe: Arc<dyn ProviderHealthProbe + Send + Sync>,
        api_key_secret_codec: Arc<dyn ApiKeySecretCodec + Send + Sync>,
    ) -> Self {
        Self {
            pool,
            provider_health_probe,
            api_key_secret_codec: Some(api_key_secret_codec),
        }
    }
}

impl AdminChannelStore for PostgresAdminChannelStore {
    fn list_channels<'a>(
        &'a self,
        query: ListAdminChannelsQuery,
    ) -> AdminChannelCommandFuture<'a, Vec<AdminChannelItem>> {
        Box::pin(async move {
            list_channels(&self.pool, query, self.api_key_secret_codec.as_deref()).await
        })
    }

    fn create_channel<'a>(
        &'a self,
        command: CreateAdminChannelCommand,
    ) -> AdminChannelCommandFuture<'a, AdminChannelItem> {
        Box::pin(async move {
            let mut tx = self
                .pool
                .begin()
                .await
                .map_err(|error| store_error("failed to begin channel transaction", error))?;
            let account_id =
                insert_provider_account(&mut tx, &command, self.api_key_secret_codec.as_deref())
                    .await?;
            let channel_id = insert_channel(&mut tx, &command, account_id).await?;
            replace_channel_models(
                &mut tx,
                channel_id,
                &command.model_uuids,
                command.subject.tenant_id,
                command.subject.organization_id,
                &command.provider_code,
                &command.models,
                &command.capabilities,
                &command.requested_at,
            )
            .await?;
            insert_config_snapshot(
                &mut tx,
                &command.config_snapshot_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                "create_channel",
                channel_id,
                &channel_snapshot_payload(channel_id, &command.name, &command.provider_code),
                &command.requested_at,
            )
            .await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_channel",
                channel_id,
                serde_json::json!({
                    "action": "create_channel",
                    "channelId": channel_id,
                    "name": &command.name,
                    "providerCode": &command.provider_code,
                    "models": &command.models,
                    "capabilities": &command.capabilities,
                    "secretStoredAsRef": true
                }),
            )
            .await?;
            let item = load_channel_by_id(
                &mut tx,
                channel_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                self.api_key_secret_codec.as_deref(),
            )
            .await?
            .ok_or_else(|| DomainError::new("created channel could not be reloaded"))?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit channel transaction", error))?;
            Ok(item)
        })
    }

    fn update_channel<'a>(
        &'a self,
        command: UpdateAdminChannelCommand,
    ) -> AdminChannelCommandFuture<'a, Option<AdminChannelItem>> {
        Box::pin(async move {
            let mut tx = self
                .pool
                .begin()
                .await
                .map_err(|error| store_error("failed to begin channel transaction", error))?;
            let updated = update_channel(&mut tx, &command).await?;
            if !updated {
                tx.commit()
                    .await
                    .map_err(|error| store_error("failed to commit channel transaction", error))?;
                return Ok(None);
            }
            update_provider_account(&mut tx, &command, self.api_key_secret_codec.as_deref())
                .await?;
            if let Some(models) = command.models.as_ref() {
                let scope = DeleteAdminChannelModelScope::from(&command);
                soft_delete_channel_models(&mut tx, &scope).await?;
                let provider_code = match command.provider_code.as_deref() {
                    Some(provider_code) => provider_code.to_owned(),
                    None => load_channel_provider_code(
                        &mut tx,
                        command.channel_id,
                        command.subject.tenant_id,
                        command.subject.organization_id,
                    )
                    .await?
                    .unwrap_or_else(|| "custom".to_owned()),
                };
                let fallback_capabilities;
                let capabilities = if let Some(capabilities) = command.capabilities.as_deref() {
                    capabilities
                } else {
                    fallback_capabilities = vec!["llm".to_owned()];
                    fallback_capabilities.as_slice()
                };
                replace_channel_models(
                    &mut tx,
                    command.channel_id,
                    &command.model_uuids,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    &provider_code,
                    models,
                    capabilities,
                    &command.requested_at,
                )
                .await?;
            }
            insert_config_snapshot(
                &mut tx,
                &command.config_snapshot_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                "update_channel",
                command.channel_id,
                &serde_json::json!({
                    "channelId": command.channel_id,
                    "nameChanged": command.name.is_some(),
                    "providerChanged": command.provider_code.is_some(),
                    "modelsChanged": command.models.is_some(),
                    "capabilitiesChanged": command.capabilities.is_some(),
                    "timeoutChanged": command.timeout_ms.is_some(),
                    "retryPolicyChanged": command.retry_policy_json.is_some(),
                    "circuitBreakerPolicyChanged": command.circuit_breaker_policy_json.is_some(),
                    "status": command.status,
                    "weight": command.weight
                }),
                &command.requested_at,
            )
            .await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "update_channel",
                command.channel_id,
                serde_json::json!({
                    "action": "update_channel",
                    "channelId": command.channel_id,
                    "nameChanged": command.name.is_some(),
                    "providerChanged": command.provider_code.is_some(),
                    "protocol": command.protocol,
                    "accessType": command.access_type,
                    "modelsChanged": command.models.is_some(),
                    "capabilitiesChanged": command.capabilities.is_some(),
                    "timeoutChanged": command.timeout_ms.is_some(),
                    "retryPolicyChanged": command.retry_policy_json.is_some(),
                    "circuitBreakerPolicyChanged": command.circuit_breaker_policy_json.is_some(),
                    "secretRefChanged": command.secret_ref.is_some(),
                    "status": command.status,
                    "weight": command.weight
                }),
            )
            .await?;
            let item = load_channel_by_id(
                &mut tx,
                command.channel_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                self.api_key_secret_codec.as_deref(),
            )
            .await?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit channel transaction", error))?;
            Ok(item)
        })
    }

    fn delete_channel<'a>(
        &'a self,
        command: DeleteAdminChannelCommand,
    ) -> AdminChannelCommandFuture<'a, bool> {
        Box::pin(async move {
            let mut tx = self
                .pool
                .begin()
                .await
                .map_err(|error| store_error("failed to begin channel transaction", error))?;
            let deleted = soft_delete_channel(&mut tx, &command).await?;
            if deleted {
                let scope = DeleteAdminChannelModelScope::from(command.clone());
                soft_delete_channel_models(&mut tx, &scope).await?;
                insert_config_snapshot(
                    &mut tx,
                    &command.config_snapshot_uuid,
                    &command.request_id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    command.subject.operator_id,
                    "delete_channel",
                    command.channel_id,
                    &serde_json::json!({ "channelId": command.channel_id, "deleted": true }),
                    &command.requested_at,
                )
                .await?;
                insert_audit_log(
                    &mut tx,
                    &command.audit_log_uuid,
                    &command.request_id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    command.subject.operator_id,
                    command.subject.operator_type,
                    "delete_channel",
                    command.channel_id,
                    serde_json::json!({
                        "action": "delete_channel",
                        "channelId": command.channel_id
                    }),
                )
                .await?;
            }
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit channel transaction", error))?;
            Ok(deleted)
        })
    }

    fn test_channel<'a>(
        &'a self,
        command: TestAdminChannelCommand,
    ) -> AdminChannelCommandFuture<'a, Option<AdminChannelTestOutcome>> {
        Box::pin(async move {
            let probe_target = {
                let mut tx =
                    self.pool.begin().await.map_err(|error| {
                        store_error("failed to begin channel transaction", error)
                    })?;
                let probe_target = load_channel_probe_target(
                    &mut tx,
                    &command,
                    self.api_key_secret_codec.as_deref(),
                )
                .await?;
                tx.commit().await.map_err(|error| {
                    store_error("failed to commit channel probe target transaction", error)
                })?;
                match probe_target {
                    Some(probe_target) => probe_target,
                    None => return Ok(None),
                }
            };
            let probe_outcome = self
                .provider_health_probe
                .probe_provider_health(ProviderHealthProbeRequest {
                    provider_base_url: probe_target.provider_base_url.clone(),
                    provider_secret_ref: probe_target.provider_secret_ref.clone(),
                    provider_secret_value: probe_target.provider_secret_value.clone(),
                    provider_model: probe_target.provider_model.clone(),
                    provider_timeout_ms: probe_target.provider_timeout_ms,
                })
                .await?;
            let mut tx = self
                .pool
                .begin()
                .await
                .map_err(|error| store_error("failed to begin channel transaction", error))?;
            let updated =
                record_channel_health_test(&mut tx, &command, &probe_target, &probe_outcome)
                    .await?;
            if !updated {
                tx.commit()
                    .await
                    .map_err(|error| store_error("failed to commit channel transaction", error))?;
                return Ok(None);
            }
            insert_config_snapshot(
                &mut tx,
                &command.config_snapshot_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                "test_channel",
                command.channel_id,
                &serde_json::json!({
                    "channelId": command.channel_id,
                    "success": probe_outcome.success,
                    "healthStatus": if probe_outcome.success { "healthy" } else { "error" },
                    "httpStatus": probe_outcome.http_status
                }),
                &command.requested_at,
            )
            .await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "test_channel",
                command.channel_id,
                serde_json::json!({
                    "action": "test_channel",
                    "channelId": command.channel_id,
                    "success": probe_outcome.success,
                    "healthStatus": if probe_outcome.success { "healthy" } else { "error" },
                    "httpStatus": probe_outcome.http_status
                }),
            )
            .await?;
            let item = load_channel_by_id(
                &mut tx,
                command.channel_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                self.api_key_secret_codec.as_deref(),
            )
            .await?
            .ok_or_else(|| DomainError::new("tested channel could not be reloaded"))?;
            let outcome = AdminChannelTestOutcome {
                channel_id: item.id.to_string(),
                success: probe_outcome.success,
                status: item.status.clone(),
                latency: duration_label(probe_outcome.latency_ms),
                item,
            };
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit channel transaction", error))?;
            Ok(Some(outcome))
        })
    }
}

async fn list_channels(
    pool: &PgPool,
    query: ListAdminChannelsQuery,
    api_key_secret_codec: Option<&(dyn ApiKeySecretCodec + Send + Sync)>,
) -> DomainResult<Vec<AdminChannelItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            c.id,
            c.uuid,
            c.tenant_id,
            c.organization_id,
            c.created_at::text AS created_at,
            c.metadata->>'expiresAt' AS expires_at,
            COALESCE(NULLIF(c.name, ''), p.display_name, c.provider_code, '') AS name,
            COALESCE(NULLIF(p.display_name, ''), c.provider_code, '') AS vendor,
            COALESCE(c.provider_code, '') AS provider_code,
            c.protocol,
            c.access_type,
            COALESCE(NULLIF(c.base_url, ''), p.base_url) AS base_url,
            c.timeout_ms,
            c.retry_policy::text AS retry_policy_json,
            c.circuit_breaker_policy::text AS circuit_breaker_policy_json,
            COALESCE(c.capabilities::text, '["llm"]') AS capabilities_json,
            COALESCE(c.weight, 0) AS weight,
            c.status,
            c.health_status,
            COALESCE(c.consecutive_error_count, 0) AS channel_errors,
            a.secret_ref,
            a.auth_config::text AS provider_auth_config,
            a.upstream_balance_amount::text AS balance_amount,
            a.upstream_balance_currency,
            COALESCE(a.consecutive_error_count, 0) AS account_errors,
            h.health_status AS snapshot_health_status,
            c.deleted_at::text AS deleted_at
        FROM integration_channel c
        LEFT JOIN integration_provider p
            ON p.provider_code = c.provider_code
           AND p.deleted_at IS NULL
        LEFT JOIN integration_provider_account a
            ON a.id = c.account_id
           AND a.deleted_at IS NULL
        LEFT JOIN LATERAL (
            SELECT hs.health_status
            FROM integration_provider_health_snapshot hs
            WHERE hs.channel_id = c.id
              AND hs.tenant_id = c.tenant_id
              AND hs.organization_id = c.organization_id
              AND hs.status = 1
            ORDER BY hs.checked_at DESC NULLS LAST, hs.id DESC
            LIMIT 1
        ) h ON true
        WHERE c.tenant_id = $1
          AND c.organization_id = $2
          AND c.deleted_at IS NULL
        ORDER BY c.priority ASC NULLS LAST, c.weight DESC NULLS LAST, c.id DESC
        LIMIT 500
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list channels", error))?;

    let models =
        load_models_for_channels(pool, query.subject.tenant_id, query.subject.organization_id)
            .await?;
    rows.into_iter()
        .map(|row| item_from_postgres_row(row, &models, api_key_secret_codec))
        .collect()
}

async fn insert_provider_account(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAdminChannelCommand,
    api_key_secret_codec: Option<&(dyn ApiKeySecretCodec + Send + Sync)>,
) -> DomainResult<i64> {
    let account_code = entity_code("acct", &command.account_uuid);
    let auth_config = provider_account_auth_config(
        command,
        command.credential_material.as_deref(),
        api_key_secret_codec,
    )?
    .to_string();
    sqlx::query_scalar(
        r#"
        INSERT INTO integration_provider_account
            (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, provider_code, account_code, account_name, auth_type, credential_profile, auth_config, secret_ref, secret_hash, masked_label, consecutive_error_count, risk_level)
        VALUES
            ($1, $2, $3, 1, 1, $4::timestamptz, $5::timestamptz, 0, $6, $7, $8, $9, 1, $10::jsonb, $11, $12, $13, 0, 1)
        RETURNING id
        "#,
    )
    .bind(&command.account_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(&command.provider_code)
    .bind(account_code)
    .bind(&command.name)
    .bind(access_type_code(&command.access_type))
    .bind(auth_config)
    .bind(&command.secret_ref)
    .bind(&command.secret_hash)
    .bind(&command.masked_label)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create provider account", error))
}

async fn insert_channel(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAdminChannelCommand,
    account_id: i64,
) -> DomainResult<i64> {
    let capabilities_json = string_array_json(&command.capabilities)?;
    let metadata_json = channel_metadata_json(command.expires_at.as_deref())?;
    sqlx::query_scalar(
        r#"
        INSERT INTO integration_channel
            (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata, provider_code, channel_code, name, protocol, access_type, base_url, timeout_ms, retry_policy, circuit_breaker_policy, model_mode, environment, capabilities, priority, weight, account_id, health_status, consecutive_error_count)
        VALUES
            ($1, $2, $3, 1, $4, $5::timestamptz, $6::timestamptz, 0, $7::jsonb, $8, $9, $10, $11, $12, $13, $14, $15::jsonb, $16::jsonb, 1, 1, $17::jsonb, 100, $18, $19, $20, 0)
        RETURNING id
        "#,
    )
    .bind(&command.channel_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(status_code(&command.status))
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(metadata_json)
    .bind(&command.provider_code)
    .bind(entity_code("chn", &command.channel_uuid))
    .bind(&command.name)
    .bind(protocol_code(&command.protocol))
    .bind(access_type_code(&command.access_type))
    .bind(command.base_url.as_deref())
    .bind(command.timeout_ms)
    .bind(command.retry_policy_json.as_deref())
    .bind(command.circuit_breaker_policy_json.as_deref())
    .bind(capabilities_json)
    .bind(command.weight)
    .bind(account_id)
    .bind(health_status_code(&command.status))
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create channel", error))
}

async fn update_channel(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateAdminChannelCommand,
) -> DomainResult<bool> {
    let base_url_touched = command.base_url.is_some();
    let base_url = command.base_url.as_ref().and_then(|value| value.as_deref());
    let timeout_touched = command.timeout_ms.is_some();
    let timeout_ms = command.timeout_ms.flatten();
    let retry_policy_touched = command.retry_policy_json.is_some();
    let retry_policy_json = command
        .retry_policy_json
        .as_ref()
        .and_then(|value| value.as_deref());
    let circuit_breaker_policy_touched = command.circuit_breaker_policy_json.is_some();
    let circuit_breaker_policy_json = command
        .circuit_breaker_policy_json
        .as_ref()
        .and_then(|value| value.as_deref());
    let expires_at_touched = command.expires_at.is_some();
    let expires_at = command
        .expires_at
        .as_ref()
        .and_then(|value| value.as_deref());
    let capabilities_json = command
        .capabilities
        .as_ref()
        .map(|capabilities| string_array_json(capabilities))
        .transpose()?;
    let result = sqlx::query(
        r#"
        UPDATE integration_channel
        SET name = COALESCE($1, name),
            provider_code = COALESCE($2, provider_code),
            protocol = COALESCE($3, protocol),
            access_type = COALESCE($4, access_type),
            base_url = CASE WHEN $5 THEN $6 ELSE base_url END,
            timeout_ms = CASE WHEN $7 THEN $8 ELSE timeout_ms END,
            retry_policy = CASE WHEN $9 THEN $10::jsonb ELSE retry_policy END,
            circuit_breaker_policy = CASE WHEN $11 THEN $12::jsonb ELSE circuit_breaker_policy END,
            metadata = CASE
                WHEN $13 AND $14::text IS NULL THEN COALESCE(metadata, '{}'::jsonb) - 'expiresAt'
                WHEN $13 THEN jsonb_set(COALESCE(metadata, '{}'::jsonb), '{expiresAt}', to_jsonb($14::text), true)
                ELSE metadata
            END,
            capabilities = COALESCE($15::jsonb, capabilities),
            weight = COALESCE($16, weight),
            status = COALESCE($17, status),
            health_status = COALESCE($18, health_status),
            updated_at = $19::timestamptz,
            version = COALESCE(version, 0) + 1
        WHERE id = $20
          AND tenant_id = $21
          AND organization_id = $22
          AND deleted_at IS NULL
        "#,
    )
    .bind(command.name.as_deref())
    .bind(command.provider_code.as_deref())
    .bind(command.protocol.as_ref().map(|value| protocol_code(value)))
    .bind(
        command
            .access_type
            .as_ref()
            .map(|value| access_type_code(value)),
    )
    .bind(base_url_touched)
    .bind(base_url)
    .bind(timeout_touched)
    .bind(timeout_ms)
    .bind(retry_policy_touched)
    .bind(retry_policy_json)
    .bind(circuit_breaker_policy_touched)
    .bind(circuit_breaker_policy_json)
    .bind(expires_at_touched)
    .bind(expires_at)
    .bind(capabilities_json)
    .bind(command.weight)
    .bind(command.status.as_ref().map(|value| status_code(value)))
    .bind(
        command
            .status
            .as_ref()
            .map(|value| health_status_code(value)),
    )
    .bind(&command.requested_at)
    .bind(command.channel_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update channel", error))?;
    Ok(result.rows_affected() > 0)
}

async fn update_provider_account(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateAdminChannelCommand,
    api_key_secret_codec: Option<&(dyn ApiKeySecretCodec + Send + Sync)>,
) -> DomainResult<()> {
    if command.secret_ref.is_none() && command.provider_code.is_none() && command.name.is_none() {
        return Ok(());
    }
    let auth_config = command
        .secret_ref
        .as_ref()
        .map(|_| {
            provider_account_update_auth_config(
                command.credential_material.as_deref(),
                api_key_secret_codec,
            )
            .map(|value| value.to_string())
        })
        .transpose()?;
    sqlx::query(
        r#"
        UPDATE integration_provider_account
        SET provider_code = COALESCE($1, provider_code),
            account_name = COALESCE($2, account_name),
            auth_config = COALESCE($3::jsonb, auth_config),
            secret_ref = COALESCE($4, secret_ref),
            secret_hash = COALESCE($5, secret_hash),
            masked_label = COALESCE($6, masked_label),
            updated_at = $7::timestamptz,
            version = COALESCE(version, 0) + 1
        WHERE id = (
            SELECT account_id
            FROM integration_channel
            WHERE id = $8
              AND tenant_id = $9
              AND organization_id = $10
              AND deleted_at IS NULL
        )
          AND tenant_id = $11
          AND organization_id = $12
          AND deleted_at IS NULL
        "#,
    )
    .bind(command.provider_code.as_deref())
    .bind(command.name.as_deref())
    .bind(auth_config)
    .bind(command.secret_ref.as_deref())
    .bind(command.secret_hash.as_deref())
    .bind(command.masked_label.as_deref())
    .bind(&command.requested_at)
    .bind(command.channel_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update provider account", error))?;
    Ok(())
}

fn provider_account_auth_config(
    command: &CreateAdminChannelCommand,
    credential_material: Option<&str>,
    api_key_secret_codec: Option<&(dyn ApiKeySecretCodec + Send + Sync)>,
) -> DomainResult<serde_json::Value> {
    let mut auth_config =
        provider_account_update_auth_config(credential_material, api_key_secret_codec)?;
    if let Some(object) = auth_config.as_object_mut() {
        object.insert(
            "accessType".to_owned(),
            serde_json::Value::String(command.access_type.clone()),
        );
        object.insert(
            "protocol".to_owned(),
            serde_json::Value::String(command.protocol.clone()),
        );
    }
    Ok(auth_config)
}

fn provider_account_update_auth_config(
    credential_material: Option<&str>,
    api_key_secret_codec: Option<&(dyn ApiKeySecretCodec + Send + Sync)>,
) -> DomainResult<serde_json::Value> {
    let mut auth_config = serde_json::json!({
        "credentialSource": if credential_material.is_some() { "providerAccountInput" } else { "externalSecretRef" },
        "secretMaterialPresent": credential_material.is_some()
    });
    if let Some(credential_material) = credential_material {
        let Some(api_key_secret_codec) = api_key_secret_codec else {
            return Err(DomainError::new(
                "provider account api key material requires an encrypted secret codec",
            ));
        };
        let ciphertext = api_key_secret_codec.encode_secret(credential_material)?;
        if let Some(object) = auth_config.as_object_mut() {
            object.insert(
                "secretMaterialStorage".to_owned(),
                serde_json::Value::String("encrypted-provider-account-auth-config".to_owned()),
            );
            object.insert(
                "secretMaterialCiphertext".to_owned(),
                serde_json::Value::String(ciphertext),
            );
        }
    }
    Ok(auth_config)
}

fn decode_provider_secret_value(
    auth_config_json: Option<&str>,
    api_key_secret_codec: Option<&(dyn ApiKeySecretCodec + Send + Sync)>,
) -> DomainResult<Option<String>> {
    let Some(ciphertext) = provider_secret_ciphertext(auth_config_json)? else {
        return Ok(None);
    };
    let Some(api_key_secret_codec) = api_key_secret_codec else {
        return Err(DomainError::new(
            "managed provider account secret requires an encrypted secret codec",
        ));
    };
    api_key_secret_codec.decode_secret(&ciphertext).map(Some)
}

fn provider_secret_ciphertext(auth_config_json: Option<&str>) -> DomainResult<Option<String>> {
    let Some(auth_config_json) = auth_config_json
        .map(str::trim)
        .filter(|value| !value.is_empty())
    else {
        return Ok(None);
    };
    let value: serde_json::Value = serde_json::from_str(auth_config_json).map_err(|error| {
        DomainError::new(format!(
            "integration_provider_account.auth_config must be valid JSON: {error}"
        ))
    })?;
    Ok(value
        .get("secretMaterialCiphertext")
        .or_else(|| value.get("providerSecretCiphertext"))
        .and_then(serde_json::Value::as_str)
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned))
}

async fn replace_channel_models(
    tx: &mut Transaction<'_, Postgres>,
    channel_id: i64,
    model_uuids: &[String],
    tenant_id: i64,
    organization_id: i64,
    _provider_code: &str,
    models: &[String],
    capabilities: &[String],
    requested_at: &str,
) -> DomainResult<()> {
    let capability = capabilities
        .first()
        .map(|value| capability_code(value))
        .unwrap_or(1);
    for (index, model) in models.iter().enumerate() {
        let (catalog_key, vendor_code, official_model) = split_catalog_model_key(model)?;
        let uuid = model_uuids
            .get(index)
            .cloned()
            .unwrap_or_else(|| digest_hex(&format!("{channel_id}:{model}:{index}")));
        sqlx::query(
            r#"
            INSERT INTO integration_channel_model
                (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, channel_id, catalog_key, model, vendor_code, provider_model, capability, supports_streaming, supports_tools)
            VALUES
                ($1, $2, $3, 1, 1, $4::timestamptz, $5::timestamptz, 0, $6, $7, $8, $9, $10, $11, true, true)
            "#,
        )
        .bind(uuid)
        .bind(tenant_id)
        .bind(organization_id)
        .bind(requested_at)
        .bind(requested_at)
        .bind(channel_id)
        .bind(catalog_key)
        .bind(official_model)
        .bind(vendor_code)
        .bind(catalog_key)
        .bind(capability)
        .execute(&mut **tx)
        .await
        .map_err(|error| store_error("failed to replace channel models", error))?;
    }
    Ok(())
}

async fn soft_delete_channel_models(
    tx: &mut Transaction<'_, Postgres>,
    command: &DeleteAdminChannelModelScope,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE integration_channel_model
        SET status = -1,
            deleted_at = $1::timestamptz,
            deleted_by = $2,
            updated_at = $3::timestamptz,
            version = COALESCE(version, 0) + 1
        WHERE channel_id = $4
          AND tenant_id = $5
          AND organization_id = $6
          AND deleted_at IS NULL
        "#,
    )
    .bind(&command.requested_at)
    .bind(command.operator_id)
    .bind(&command.requested_at)
    .bind(command.channel_id)
    .bind(command.tenant_id)
    .bind(command.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete channel models", error))?;
    Ok(())
}

async fn soft_delete_channel(
    tx: &mut Transaction<'_, Postgres>,
    command: &DeleteAdminChannelCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE integration_channel
        SET status = -1,
            deleted_at = $1::timestamptz,
            deleted_by = $2,
            updated_at = $3::timestamptz,
            version = COALESCE(version, 0) + 1
        WHERE id = $4
          AND tenant_id = $5
          AND organization_id = $6
          AND deleted_at IS NULL
        "#,
    )
    .bind(&command.requested_at)
    .bind(command.subject.operator_id)
    .bind(&command.requested_at)
    .bind(command.channel_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete channel", error))?;
    Ok(result.rows_affected() > 0)
}

#[derive(Debug, Clone)]
struct ChannelHealthProbeTarget {
    provider_id: Option<i64>,
    channel_id: i64,
    provider_account_id: i64,
    provider_base_url: String,
    provider_secret_ref: String,
    provider_secret_value: Option<String>,
    provider_model: String,
    provider_timeout_ms: Option<u64>,
}

async fn load_channel_probe_target(
    tx: &mut Transaction<'_, Postgres>,
    command: &TestAdminChannelCommand,
    api_key_secret_codec: Option<&(dyn ApiKeySecretCodec + Send + Sync)>,
) -> DomainResult<Option<ChannelHealthProbeTarget>> {
    let row = sqlx::query(
        r#"
        SELECT
            c.id AS channel_id,
            p.id AS provider_id,
            c.account_id AS provider_account_id,
            COALESCE(NULLIF(c.base_url, ''), NULLIF(p.base_url, ''), '') AS provider_base_url,
            COALESCE(NULLIF(a.secret_ref, ''), '') AS provider_secret_ref,
            a.auth_config::text AS provider_auth_config,
            COALESCE(NULLIF(cm.provider_model, ''), '') AS provider_model,
            c.timeout_ms
        FROM integration_channel c
        LEFT JOIN integration_provider p
          ON p.provider_code = c.provider_code
         AND p.deleted_at IS NULL
         AND (
             (p.tenant_id = c.tenant_id AND p.organization_id = c.organization_id)
             OR (p.tenant_id = 0 AND p.organization_id = 0)
             OR (p.tenant_id IS NULL AND p.organization_id IS NULL)
         )
        JOIN integration_provider_account a
          ON a.id = c.account_id
         AND a.tenant_id = c.tenant_id
         AND a.organization_id = c.organization_id
         AND a.deleted_at IS NULL
        LEFT JOIN integration_channel_model cm
          ON cm.channel_id = c.id
         AND cm.tenant_id = c.tenant_id
         AND cm.organization_id = c.organization_id
         AND cm.status = 1
         AND cm.deleted_at IS NULL
        WHERE c.id = $1
          AND c.tenant_id = $2
          AND c.organization_id = $3
          AND c.deleted_at IS NULL
        ORDER BY cm.id ASC
        LIMIT 1
        "#,
    )
    .bind(command.channel_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load channel health probe target", error))?;

    let Some(row) = row else {
        return Ok(None);
    };
    let provider_base_url = string_cell(&row, "provider_base_url");
    let provider_secret_ref = string_cell(&row, "provider_secret_ref");
    let provider_auth_config = optional_string_cell(&row, "provider_auth_config");
    let provider_model = string_cell(&row, "provider_model");
    if provider_base_url.trim().is_empty()
        || provider_secret_ref.trim().is_empty()
        || provider_model.trim().is_empty()
    {
        return Err(DomainError::new(
            "channel health probe requires base URL, secret_ref, and model",
        ));
    }
    Ok(Some(ChannelHealthProbeTarget {
        provider_id: optional_integer_cell(&row, "provider_id"),
        channel_id: integer_cell(&row, "channel_id"),
        provider_account_id: integer_cell(&row, "provider_account_id"),
        provider_base_url,
        provider_secret_ref,
        provider_secret_value: decode_provider_secret_value(
            provider_auth_config.as_deref(),
            api_key_secret_codec,
        )?,
        provider_model,
        provider_timeout_ms: optional_u64_cell(&row, "timeout_ms"),
    }))
}

async fn record_channel_health_test(
    tx: &mut Transaction<'_, Postgres>,
    command: &TestAdminChannelCommand,
    target: &ChannelHealthProbeTarget,
    outcome: &ProviderHealthProbeOutcome,
) -> DomainResult<bool> {
    let health_status = if outcome.success { 1 } else { 2 };
    let result = sqlx::query(
        r#"
        UPDATE integration_channel
        SET updated_at = $1::timestamptz,
            health_status = $2,
            last_latency_ms = $3,
            consecutive_error_count = CASE
                WHEN $4 = 1 THEN 0
                ELSE COALESCE(consecutive_error_count, 0) + 1
            END,
            version = COALESCE(version, 0) + 1
        WHERE id = $5
          AND tenant_id = $6
          AND organization_id = $7
          AND deleted_at IS NULL
        "#,
    )
    .bind(&command.requested_at)
    .bind(health_status)
    .bind(outcome.latency_ms)
    .bind(health_status)
    .bind(command.channel_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to test channel", error))?;
    if result.rows_affected() == 0 {
        return Ok(false);
    }
    sqlx::query(
        r#"
        UPDATE integration_provider_account
        SET updated_at = $1::timestamptz,
            consecutive_error_count = CASE
                WHEN $2 = 1 THEN 0
                ELSE COALESCE(consecutive_error_count, 0) + 1
            END,
            version = COALESCE(version, 0) + 1
        WHERE id = $3
          AND tenant_id = $4
          AND organization_id = $5
          AND deleted_at IS NULL
        "#,
    )
    .bind(&command.requested_at)
    .bind(health_status)
    .bind(target.provider_account_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update channel account health", error))?;
    insert_provider_health_snapshot(tx, command, target, outcome, health_status).await?;
    Ok(true)
}

async fn insert_provider_health_snapshot(
    tx: &mut Transaction<'_, Postgres>,
    command: &TestAdminChannelCommand,
    target: &ChannelHealthProbeTarget,
    outcome: &ProviderHealthProbeOutcome,
    health_status: i32,
) -> DomainResult<()> {
    let metadata = serde_json::json!({
        "source": "admin_channel_test",
        "providerModel": target.provider_model
    })
    .to_string();
    sqlx::query(
        r#"
        INSERT INTO integration_provider_health_snapshot
            (uuid, tenant_id, organization_id, user_id, request_id, status, created_at, metadata, provider_id, channel_id, provider_account_id, check_type, health_status, latency_ms, http_status, error_code, error_message_masked, checked_at)
        VALUES
            ($1, $2, $3, $4, $5, 1, $6::timestamptz, $7::jsonb, $8, $9, $10, 1, $11, $12, $13, $14, $15, $16::timestamptz)
        "#,
    )
    .bind(format!("health-{}", command.config_snapshot_uuid))
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.subject.operator_id)
    .bind(&command.request_id)
    .bind(&command.requested_at)
    .bind(metadata)
    .bind(target.provider_id)
    .bind(target.channel_id)
    .bind(target.provider_account_id)
    .bind(health_status)
    .bind(outcome.latency_ms)
    .bind(outcome.http_status)
    .bind(outcome.error_code.as_deref())
    .bind(outcome.error_message_masked.as_deref())
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to write channel health snapshot", error))?;
    Ok(())
}

async fn load_channel_by_id(
    tx: &mut Transaction<'_, Postgres>,
    channel_id: i64,
    tenant_id: i64,
    organization_id: i64,
    api_key_secret_codec: Option<&(dyn ApiKeySecretCodec + Send + Sync)>,
) -> DomainResult<Option<AdminChannelItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            c.id,
            c.uuid,
            c.tenant_id,
            c.organization_id,
            c.created_at::text AS created_at,
            c.metadata->>'expiresAt' AS expires_at,
            COALESCE(NULLIF(c.name, ''), p.display_name, c.provider_code, '') AS name,
            COALESCE(NULLIF(p.display_name, ''), c.provider_code, '') AS vendor,
            COALESCE(c.provider_code, '') AS provider_code,
            c.protocol,
            c.access_type,
            COALESCE(NULLIF(c.base_url, ''), p.base_url) AS base_url,
            c.timeout_ms,
            c.retry_policy::text AS retry_policy_json,
            c.circuit_breaker_policy::text AS circuit_breaker_policy_json,
            COALESCE(c.capabilities::text, '["llm"]') AS capabilities_json,
            COALESCE(c.weight, 0) AS weight,
            c.status,
            c.health_status,
            COALESCE(c.consecutive_error_count, 0) AS channel_errors,
            a.secret_ref,
            a.auth_config::text AS provider_auth_config,
            a.upstream_balance_amount::text AS balance_amount,
            a.upstream_balance_currency,
            COALESCE(a.consecutive_error_count, 0) AS account_errors,
            h.health_status AS snapshot_health_status,
            c.deleted_at::text AS deleted_at
        FROM integration_channel c
        LEFT JOIN integration_provider p
            ON p.provider_code = c.provider_code
           AND p.deleted_at IS NULL
        LEFT JOIN integration_provider_account a
            ON a.id = c.account_id
           AND a.deleted_at IS NULL
        LEFT JOIN LATERAL (
            SELECT hs.health_status
            FROM integration_provider_health_snapshot hs
            WHERE hs.channel_id = c.id
              AND hs.tenant_id = c.tenant_id
              AND hs.organization_id = c.organization_id
              AND hs.status = 1
            ORDER BY hs.checked_at DESC NULLS LAST, hs.id DESC
            LIMIT 1
        ) h ON true
        WHERE c.id = $1
          AND c.tenant_id = $2
          AND c.organization_id = $3
          AND c.deleted_at IS NULL
        LIMIT 1
        "#,
    )
    .bind(channel_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load channel", error))?;

    let Some(row) = row else {
        return Ok(None);
    };
    let models = load_models_for_channels_tx(tx, tenant_id, organization_id).await?;
    item_from_postgres_row(row, &models, api_key_secret_codec).map(Some)
}

async fn load_channel_provider_code(
    tx: &mut Transaction<'_, Postgres>,
    channel_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<String>> {
    sqlx::query_scalar(
        r#"
        SELECT provider_code
        FROM integration_channel
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
          AND deleted_at IS NULL
        LIMIT 1
        "#,
    )
    .bind(channel_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load channel provider code", error))
}

async fn load_models_for_channels(
    pool: &PgPool,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<HashMap<i64, Vec<String>>> {
    let rows = sqlx::query(
        r#"
        SELECT channel_id, COALESCE(catalog_key, '') AS model
        FROM integration_channel_model
        WHERE tenant_id = $1
          AND organization_id = $2
          AND deleted_at IS NULL
          AND status = 1
          AND (effective_from IS NULL OR effective_from <= CURRENT_TIMESTAMP)
          AND (effective_to IS NULL OR effective_to > CURRENT_TIMESTAMP)
        ORDER BY id ASC
        "#,
    )
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to load channel models", error))?;
    models_from_rows(rows)
}

async fn load_models_for_channels_tx(
    tx: &mut Transaction<'_, Postgres>,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<HashMap<i64, Vec<String>>> {
    let rows = sqlx::query(
        r#"
        SELECT channel_id, COALESCE(catalog_key, '') AS model
        FROM integration_channel_model
        WHERE tenant_id = $1
          AND organization_id = $2
          AND deleted_at IS NULL
          AND status = 1
          AND (effective_from IS NULL OR effective_from <= CURRENT_TIMESTAMP)
          AND (effective_to IS NULL OR effective_to > CURRENT_TIMESTAMP)
        ORDER BY id ASC
        "#,
    )
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_all(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load channel models", error))?;
    models_from_rows(rows)
}

fn models_from_rows(rows: Vec<sqlx::postgres::PgRow>) -> DomainResult<HashMap<i64, Vec<String>>> {
    let mut models: HashMap<i64, Vec<String>> = HashMap::new();
    for row in rows {
        let channel_id: i64 = row.try_get("channel_id").map_err(row_error)?;
        let model: String = row.try_get("model").map_err(row_error)?;
        if !model.trim().is_empty() {
            models.entry(channel_id).or_default().push(model);
        }
    }
    Ok(models)
}

fn split_catalog_model_key(catalog_key: &str) -> DomainResult<(&str, &str, &str)> {
    let value = catalog_key.trim();
    let mut parts = value.split('/');
    let (Some(vendor_code), Some(region_code), Some(model_id), None) =
        (parts.next(), parts.next(), parts.next(), parts.next())
    else {
        return Err(DomainError::new(format!(
            "channel model must be a catalog key in vendorCode/regionCode/modelId format: {value}"
        )));
    };
    if vendor_code.trim().is_empty() || region_code.trim().is_empty() || model_id.trim().is_empty()
    {
        return Err(DomainError::new(format!(
            "channel model must be a catalog key in vendorCode/regionCode/modelId format: {value}"
        )));
    }
    Ok((value, vendor_code, model_id))
}

async fn insert_config_snapshot(
    tx: &mut Transaction<'_, Postgres>,
    snapshot_uuid: &str,
    request_id: &str,
    tenant_id: i64,
    organization_id: i64,
    operator_id: i64,
    action: &'static str,
    target_id: i64,
    payload: &serde_json::Value,
    requested_at: &str,
) -> DomainResult<()> {
    let payload = payload.to_string();
    let snapshot_no = format!("channel-{target_id}-{action}-{snapshot_uuid}");
    sqlx::query(
        r#"
        INSERT INTO ops_config_snapshot
            (uuid, tenant_id, organization_id, user_id, request_id, status, snapshot_no, config_scope, config_type, source_table, source_ids, config_payload, config_hash, published_at, published_by)
        VALUES
            ($1, $2, $3, $4, $5, 1, $6, $7, $8, 'integration_channel', $9::jsonb, $10::jsonb, $11, $12::timestamptz, $13)
        "#,
    )
    .bind(snapshot_uuid)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(operator_id)
    .bind(request_id)
    .bind(snapshot_no)
    .bind(CONFIG_SCOPE_ROUTER)
    .bind(CONFIG_TYPE_CHANNEL)
    .bind(serde_json::json!([target_id]).to_string())
    .bind(&payload)
    .bind(digest_hex(&payload))
    .bind(requested_at)
    .bind(operator_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to write channel config snapshot", error))?;
    Ok(())
}

async fn insert_audit_log(
    tx: &mut Transaction<'_, Postgres>,
    audit_log_uuid: &str,
    request_id: &str,
    tenant_id: i64,
    organization_id: i64,
    operator_id: i64,
    operator_type: i32,
    action: &'static str,
    target_id: i64,
    change_summary: serde_json::Value,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        INSERT INTO ops_audit_log
            (uuid, tenant_id, organization_id, action, target_type, target_id, request_id, operator_id, operator_type, change_summary)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb)
        "#,
    )
    .bind(audit_log_uuid)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(action)
    .bind(CHANNEL_TARGET_TYPE)
    .bind(target_id)
    .bind(request_id)
    .bind(operator_id)
    .bind(operator_type)
    .bind(change_summary.to_string())
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to write channel audit log", error))?;
    Ok(())
}

fn item_from_postgres_row(
    row: sqlx::postgres::PgRow,
    models: &HashMap<i64, Vec<String>>,
    api_key_secret_codec: Option<&(dyn ApiKeySecretCodec + Send + Sync)>,
) -> DomainResult<AdminChannelItem> {
    let id: i64 = row.try_get("id").map_err(row_error)?;
    let capabilities = parse_string_array(
        row.try_get::<String, _>("capabilities_json")
            .map_err(row_error)?
            .as_str(),
    )?;
    let errors = optional_integer_cell(&row, "channel_errors").unwrap_or(0)
        + optional_integer_cell(&row, "account_errors").unwrap_or(0);
    let status = required_integer_cell(&row, "status", "status")?;
    let health_status = required_integer_cell(&row, "health_status", "health_status")?;
    let snapshot_health_status = optional_valid_health_status_cell(&row, "snapshot_health_status")?;
    let balance = balance_label(
        row.try_get::<Option<String>, _>("balance_amount")
            .ok()
            .flatten(),
        row.try_get::<Option<String>, _>("upstream_balance_currency")
            .ok()
            .flatten(),
    );
    let provider_auth_config = row
        .try_get::<Option<String>, _>("provider_auth_config")
        .ok()
        .flatten();
    let api_key =
        decode_provider_secret_value(provider_auth_config.as_deref(), api_key_secret_codec)?;
    Ok(AdminChannelItem {
        id,
        uuid: row.try_get("uuid").map_err(row_error)?,
        tenant_id: row.try_get("tenant_id").map_err(row_error)?,
        organization_id: row.try_get("organization_id").map_err(row_error)?,
        created_at: row.try_get("created_at").map_err(row_error)?,
        expires_at: optional_trimmed_string_cell(&row, "expires_at"),
        name: row.try_get("name").map_err(row_error)?,
        vendor: display_vendor(
            row.try_get::<String, _>("vendor")
                .map_err(row_error)?
                .as_str(),
        ),
        provider_code: row.try_get("provider_code").map_err(row_error)?,
        protocol: protocol_label(required_integer_cell(&row, "protocol", "protocol")?)?,
        access_type: access_type_label(required_integer_cell(&row, "access_type", "access_type")?)?,
        base_url: row.try_get("base_url").ok().flatten(),
        secret_ref: row.try_get("secret_ref").ok().flatten(),
        api_key,
        models: models.get(&id).cloned().unwrap_or_default(),
        is_multimodal: capabilities.iter().any(|capability| capability != "llm"),
        capabilities,
        timeout_ms: row.try_get("timeout_ms").ok().flatten(),
        retry_policy_json: row.try_get("retry_policy_json").ok().flatten(),
        circuit_breaker_policy_json: row.try_get("circuit_breaker_policy_json").ok().flatten(),
        weight: row.try_get("weight").map_err(row_error)?,
        status: status_label(status, health_status, snapshot_health_status, errors)?,
        balance,
        errors,
        deleted_at: row.try_get("deleted_at").ok().flatten(),
    })
}

#[derive(Debug, Clone)]
struct DeleteAdminChannelModelScope {
    channel_id: i64,
    tenant_id: i64,
    organization_id: i64,
    operator_id: i64,
    requested_at: String,
}

impl From<DeleteAdminChannelCommand> for DeleteAdminChannelModelScope {
    fn from(value: DeleteAdminChannelCommand) -> Self {
        Self {
            channel_id: value.channel_id,
            tenant_id: value.subject.tenant_id,
            organization_id: value.subject.organization_id,
            operator_id: value.subject.operator_id,
            requested_at: value.requested_at,
        }
    }
}

impl From<&UpdateAdminChannelCommand> for DeleteAdminChannelModelScope {
    fn from(value: &UpdateAdminChannelCommand) -> Self {
        Self {
            channel_id: value.channel_id,
            tenant_id: value.subject.tenant_id,
            organization_id: value.subject.organization_id,
            operator_id: value.subject.operator_id,
            requested_at: value.requested_at.clone(),
        }
    }
}

fn channel_snapshot_payload(channel_id: i64, name: &str, provider_code: &str) -> serde_json::Value {
    serde_json::json!({
        "channelId": channel_id,
        "name": name,
        "providerCode": provider_code
    })
}

fn entity_code(prefix: &str, uuid: &str) -> String {
    let short = uuid.chars().take(24).collect::<String>();
    format!("{prefix}-{short}")
}

fn string_array_json(values: &[String]) -> DomainResult<String> {
    serde_json::to_string(values).map_err(|error| DomainError::new(error.to_string()))
}

fn channel_metadata_json(expires_at: Option<&str>) -> DomainResult<String> {
    let mut metadata = serde_json::Map::new();
    if let Some(expires_at) = expires_at.map(str::trim).filter(|value| !value.is_empty()) {
        metadata.insert(
            "expiresAt".to_owned(),
            serde_json::Value::String(expires_at.to_owned()),
        );
    }
    serde_json::to_string(&serde_json::Value::Object(metadata))
        .map_err(|error| DomainError::new(error.to_string()))
}

fn parse_string_array(value: &str) -> DomainResult<Vec<String>> {
    let mut parsed: Vec<String> = serde_json::from_str(value).map_err(|error| {
        DomainError::new(format!(
            "invalid channel capabilities json from database row: {error}"
        ))
    })?;
    parsed.retain(|value| !value.trim().is_empty());
    if parsed.is_empty() {
        parsed.push("llm".to_owned());
    }
    Ok(parsed)
}

fn digest_hex(value: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(value.as_bytes());
    hex::encode(hasher.finalize())
}

fn protocol_code(value: &str) -> i32 {
    match value {
        "Anthropic" => 2,
        "Gemini" => 3,
        "Ollama" => 4,
        "Custom" => 9,
        _ => 1,
    }
}

fn protocol_label(value: i64) -> DomainResult<String> {
    match value {
        1 => Ok("OpenAI"),
        2 => Ok("Anthropic"),
        3 => Ok("Gemini"),
        4 => Ok("Ollama"),
        9 => Ok("Custom"),
        value => Err(DomainError::new(format!(
            "invalid admin channel protocol from database row: {value}"
        ))),
    }
    .map(str::to_owned)
}

fn access_type_code(value: &str) -> i32 {
    match value {
        "GCP Vertex OAuth" => 2,
        "AWS Bedrock" => 3,
        "Azure OpenAI" => 4,
        "Claude Code" => 5,
        _ => 1,
    }
}

fn access_type_label(value: i64) -> DomainResult<String> {
    match value {
        1 => Ok("Standard API Key"),
        2 => Ok("GCP Vertex OAuth"),
        3 => Ok("AWS Bedrock"),
        4 => Ok("Azure OpenAI"),
        5 => Ok("Claude Code"),
        value => Err(DomainError::new(format!(
            "invalid admin channel access_type from database row: {value}"
        ))),
    }
    .map(str::to_owned)
}

fn capability_code(value: &str) -> i32 {
    match value {
        "image" => 2,
        "audio" => 3,
        "music" => 4,
        "sfx" => 5,
        "video" => 6,
        _ => 1,
    }
}

fn status_code(value: &str) -> i32 {
    match value {
        "disabled" => 0,
        "error" => 2,
        _ => 1,
    }
}

fn health_status_code(value: &str) -> i32 {
    if value == "error" {
        2
    } else {
        1
    }
}

fn status_label(
    status: i64,
    health_status: i64,
    snapshot_health_status: Option<i64>,
    errors: i64,
) -> DomainResult<String> {
    match status {
        -1 | 0 | 1 | 2 => {}
        value => {
            return Err(DomainError::new(format!(
                "invalid admin channel status from database row: {value}"
            )));
        }
    }
    validate_health_status(health_status)?;

    let label = if status == 0 || status == -1 {
        "disabled"
    } else if status == 2 || health_status == 2 || snapshot_health_status == Some(2) || errors > 0 {
        "error"
    } else {
        "active"
    };
    Ok(label.to_owned())
}

fn validate_health_status(value: i64) -> DomainResult<()> {
    match value {
        1 | 2 => Ok(()),
        value => Err(DomainError::new(format!(
            "invalid admin channel health_status from database row: {value}"
        ))),
    }
}

fn display_vendor(value: &str) -> String {
    match value {
        "openai" => "OpenAI",
        "anthropic" => "Anthropic",
        "google" => "Gemini",
        "openrouter" => "OpenRouter",
        "deepseek" => "DeepSeek",
        "zhipu" => "Zhipu",
        "mistral" => "Mistral",
        "meta" => "Meta",
        "ollama" => "Ollama",
        "azure_openai" => "Azure OpenAI",
        "custom" => "Custom",
        _ => value,
    }
    .to_owned()
}

fn balance_label(amount: Option<String>, currency: Option<String>) -> String {
    match (amount, currency) {
        (Some(amount), Some(currency)) if !amount.trim().is_empty() => {
            format!("{} {}", currency.trim(), amount.trim())
        }
        (Some(amount), None) if !amount.trim().is_empty() => amount,
        _ => "N/A".to_owned(),
    }
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
}

fn required_integer_cell(
    row: &sqlx::postgres::PgRow,
    column: &str,
    field: &str,
) -> DomainResult<i64> {
    optional_integer_cell(row, column).ok_or_else(|| missing_integer_cell_error(field))
}

fn optional_valid_health_status_cell(
    row: &sqlx::postgres::PgRow,
    column: &str,
) -> DomainResult<Option<i64>> {
    let Some(value) = optional_integer_cell(row, column) else {
        return Ok(None);
    };
    validate_health_status(value)?;
    Ok(Some(value))
}

fn missing_integer_cell_error(field: &str) -> DomainError {
    match field {
        "status" => DomainError::new("missing admin channel status from database row"),
        "health_status" => {
            DomainError::new("missing admin channel health_status from database row")
        }
        "protocol" => DomainError::new("missing admin channel protocol from database row"),
        "access_type" => DomainError::new("missing admin channel access_type from database row"),
        _ => DomainError::new(format!("missing admin channel {field} from database row")),
    }
}

fn integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> i64 {
    optional_integer_cell(row, column)
        .or_else(|| {
            row.try_get::<String, _>(column)
                .ok()
                .and_then(|value| value.parse::<i64>().ok())
        })
        .unwrap_or(0)
}

fn string_cell(row: &sqlx::postgres::PgRow, column: &str) -> String {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .or_else(|| row.try_get::<String, _>(column).ok())
        .unwrap_or_default()
}

fn optional_string_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .or_else(|| row.try_get::<String, _>(column).ok())
}

fn optional_trimmed_string_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<String> {
    optional_string_cell(row, column).and_then(|value| {
        let value = value.trim().to_owned();
        if value.is_empty() {
            None
        } else {
            Some(value)
        }
    })
}

fn optional_u64_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<u64> {
    let value = optional_integer_cell(row, column)
        .or_else(|| string_cell(row, column).parse::<i64>().ok())?;
    u64::try_from(value).ok().filter(|value| *value > 0)
}

fn duration_label(value: i64) -> String {
    format!("{}ms", value.max(0))
}

fn row_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}
