use sqlx::{PgPool, Postgres, Transaction};

use crate::domain::{DomainError, DomainResult, GatewayAccessPolicy, GatewayApiKey, QuotaPolicy};
use crate::ports::{
    ApiKeyCommandStoreFuture, CreateGatewayApiKeyCommand, CreatedGatewayApiKey,
    GatewayApiKeyCommandStore,
};

#[derive(Debug, Clone)]
pub struct PostgresGatewayApiKeyCommandStore {
    pool: PgPool,
}

impl PostgresGatewayApiKeyCommandStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl GatewayApiKeyCommandStore for PostgresGatewayApiKeyCommandStore {
    fn create_gateway_api_key<'a>(
        &'a self,
        command: CreateGatewayApiKeyCommand,
    ) -> ApiKeyCommandStoreFuture<'a, CreatedGatewayApiKey> {
        Box::pin(async move {
            let mut tx = self
                .pool
                .begin()
                .await
                .map_err(|error| store_error("failed to begin api key transaction", error))?;
            ensure_idempotency_key_available(&mut tx, &command).await?;
            let access_policy = insert_access_policy(&mut tx, &command).await?;
            let quota_policy = insert_quota_policy(&mut tx, &command).await?;
            let api_key = insert_api_key(
                &mut tx,
                &command,
                access_policy.as_ref().map(|policy| policy.id),
                quota_policy.as_ref().map(|policy| policy.id),
            )
            .await?;
            insert_audit_log(&mut tx, &command, api_key.id).await?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit api key transaction", error))?;

            Ok(CreatedGatewayApiKey {
                api_key,
                access_policy,
                quota_policy,
            })
        })
    }
}

async fn ensure_idempotency_key_available(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateGatewayApiKeyCommand,
) -> DomainResult<()> {
    let existing_id: Option<i64> = sqlx::query_scalar(
        r#"
        SELECT id
        FROM iam_gateway_api_key
        WHERE tenant_id = $1
          AND idempotency_key = $2
          AND deleted_at IS NULL
        LIMIT 1
        FOR UPDATE
        "#,
    )
    .bind(command.tenant_id)
    .bind(&command.idempotency_key)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to check api key idempotency", error))?;

    if existing_id.is_some() {
        return Err(DomainError::conflict(
            "api key creation idempotency key has already been used",
        ));
    }

    Ok(())
}

async fn insert_access_policy(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateGatewayApiKeyCommand,
) -> DomainResult<Option<GatewayAccessPolicy>> {
    if !command.requires_access_policy() {
        return Ok(None);
    }
    let allowed_capabilities_json = to_json(&command.allowed_capabilities)?;
    let ip_allowlist_json = to_json(&command.ip_allowlist)?;
    let id: i64 = sqlx::query_scalar(
        r#"
        INSERT INTO iam_gateway_access_policy
            (uuid, name, allowed_capabilities, ip_allowlist, network_policy_mode, ip_rule_count, status, effective_from)
        VALUES
            ($1, $2, $3::jsonb, $4::jsonb, $5, $6, 1, CURRENT_TIMESTAMP)
        RETURNING id
        "#,
    )
    .bind(&command.access_policy_uuid)
    .bind(format!("{} access policy", command.name))
    .bind(allowed_capabilities_json)
    .bind(ip_allowlist_json)
    .bind(if command.ip_allowlist.is_empty() { 0_i32 } else { 1_i32 })
    .bind(command.ip_allowlist.len() as i32)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create api key access policy", error))?;

    Ok(Some(GatewayAccessPolicy::new(
        id,
        command.allowed_capabilities.clone(),
        command.ip_allowlist.clone(),
    )))
}

async fn insert_quota_policy(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateGatewayApiKeyCommand,
) -> DomainResult<Option<QuotaPolicy>> {
    let Some(quota_limit) = command.quota_limit else {
        return Ok(None);
    };
    let id: i64 = sqlx::query_scalar(
        r#"
        INSERT INTO ai_quota_policy
            (uuid, name, quota_period, quota_unit, quota_limit, status, effective_from)
        VALUES
            ($1, $2, $3, $4, $5::numeric, 1, CURRENT_TIMESTAMP)
        RETURNING id
        "#,
    )
    .bind(&command.quota_policy_uuid)
    .bind(format!("{} quota policy", command.name))
    .bind(0_i32)
    .bind(0_i32)
    .bind(quota_limit.to_fixed_string(6))
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create api key quota policy", error))?;

    Ok(Some(QuotaPolicy::new(id, Some(quota_limit))))
}

async fn insert_api_key(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateGatewayApiKeyCommand,
    policy_id: Option<i64>,
    quota_policy_id: Option<i64>,
) -> DomainResult<GatewayApiKey> {
    let id: i64 = sqlx::query_scalar(
        r#"
        INSERT INTO iam_gateway_api_key
            (uuid, tenant_id, organization_id, user_id, group_id, name, key_prefix, key_display_masked, key_hash, hash_alg, secret_version, idempotency_key, policy_id, quota_policy_id, status, created_at, updated_at, expire_at, last_revealed_at)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 1, $15::timestamptz, $16::timestamptz, $17::timestamptz, CURRENT_TIMESTAMP)
        RETURNING id
        "#,
    )
    .bind(&command.api_key_uuid)
    .bind(command.tenant_id)
    .bind(command.organization_id)
    .bind(command.user_id)
    .bind(command.group_id)
    .bind(&command.name)
    .bind(&command.key_prefix)
    .bind(&command.key_display_masked)
    .bind(&command.key_hash)
    .bind(&command.hash_alg)
    .bind(command.secret_version)
    .bind(&command.idempotency_key)
    .bind(policy_id)
    .bind(quota_policy_id)
    .bind(&command.created_at)
    .bind(&command.created_at)
    .bind(command.expire_at.as_deref())
    .fetch_one(&mut **tx)
    .await
    .map_err(store_create_api_key_error)?;

    Ok(GatewayApiKey {
        id,
        tenant_id: command.tenant_id,
        organization_id: command.organization_id,
        user_id: command.user_id,
        group_id: command.group_id,
        name: command.name.clone(),
        key_prefix: command.key_prefix.clone(),
        key_display_masked: command.key_display_masked.clone(),
        key_hash: command.key_hash.clone(),
        policy_id,
        quota_policy_id,
        created_at: command.created_at.clone(),
        expire_at: command.expire_at.clone(),
        status_code: 1,
    })
}

async fn insert_audit_log(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateGatewayApiKeyCommand,
    api_key_id: i64,
) -> DomainResult<()> {
    let change_summary = serde_json::json!({
        "action": "create_api_key",
        "tenantId": command.tenant_id,
        "organizationId": command.organization_id,
        "userId": command.user_id,
        "operatorId": command.operator_id,
        "operatorType": command.operator_type,
        "apiKeyId": api_key_id,
        "groupId": command.group_id,
        "name": &command.name,
        "keyPrefix": &command.key_prefix,
        "idempotencyKey": &command.idempotency_key,
        "storesSecretPlaintext": false
    });
    sqlx::query(
        r#"
        INSERT INTO ops_audit_log
            (uuid, tenant_id, organization_id, action, target_type, target_id, request_id, operator_id, operator_type, change_summary)
        VALUES
            ($1, $2, $3, 'create_api_key', 1, $4, $5, $6, $7, $8::jsonb)
        "#,
    )
    .bind(&command.audit_log_uuid)
    .bind(command.tenant_id)
    .bind(command.organization_id)
    .bind(api_key_id)
    .bind(&command.request_id)
    .bind(command.operator_id)
    .bind(command.operator_type)
    .bind(change_summary.to_string())
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to write api key audit log", error))?;
    Ok(())
}

fn to_json(value: &[String]) -> DomainResult<String> {
    serde_json::to_string(value).map_err(|error| DomainError::new(error.to_string()))
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}

fn store_create_api_key_error(error: sqlx::Error) -> DomainError {
    if is_unique_violation(&error) {
        DomainError::conflict("api key creation idempotency key has already been used")
    } else {
        store_error("failed to create api key", error)
    }
}

fn is_unique_violation(error: &sqlx::Error) -> bool {
    error
        .as_database_error()
        .and_then(|database_error| database_error.code())
        .map(|code| code.as_ref() == "23505")
        .unwrap_or(false)
}
