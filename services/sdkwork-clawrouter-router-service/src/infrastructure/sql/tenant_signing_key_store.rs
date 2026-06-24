use getrandom::fill;
use sdkwork_iam_web_adapter::{decode_signing_secret_ref, encode_signing_secret_ref};
use sqlx::{PgPool, Row, SqlitePool};
use std::sync::Arc;

use crate::application::EntityUuidGenerator;
use crate::domain::{DomainError, DomainResult};
use crate::ports::{TenantSigningKey, TenantSigningKeyFuture, TenantSigningKeyStore};

pub struct SqliteTenantSigningKeyStore {
    pool: SqlitePool,
    entity_uuid_generator: std::sync::Arc<dyn EntityUuidGenerator + Send + Sync>,
}

impl SqliteTenantSigningKeyStore {
    pub fn new(
        pool: SqlitePool,
        entity_uuid_generator: std::sync::Arc<dyn EntityUuidGenerator + Send + Sync>,
    ) -> Self {
        Self {
            pool,
            entity_uuid_generator,
        }
    }
}

pub struct PostgresTenantSigningKeyStore {
    pool: PgPool,
    entity_uuid_generator: std::sync::Arc<dyn EntityUuidGenerator + Send + Sync>,
}

impl PostgresTenantSigningKeyStore {
    pub fn new(
        pool: PgPool,
        entity_uuid_generator: std::sync::Arc<dyn EntityUuidGenerator + Send + Sync>,
    ) -> Self {
        Self {
            pool,
            entity_uuid_generator,
        }
    }
}

impl TenantSigningKeyStore for SqliteTenantSigningKeyStore {
    fn ensure_active_key<'a>(
        &'a self,
        tenant_id: i64,
    ) -> TenantSigningKeyFuture<'a, TenantSigningKey> {
        let pool = self.pool.clone();
        let entity_uuid_generator = Arc::clone(&self.entity_uuid_generator);
        Box::pin(
            async move { ensure_active_key_sqlite(&pool, entity_uuid_generator, tenant_id).await },
        )
    }

    fn resolve_by_kid<'a>(
        &'a self,
        kid: &'a str,
    ) -> TenantSigningKeyFuture<'a, Option<TenantSigningKey>> {
        let pool = self.pool.clone();
        let kid = kid.to_owned();
        Box::pin(async move { resolve_by_kid_sqlite(&pool, &kid).await })
    }
}

impl TenantSigningKeyStore for PostgresTenantSigningKeyStore {
    fn ensure_active_key<'a>(
        &'a self,
        tenant_id: i64,
    ) -> TenantSigningKeyFuture<'a, TenantSigningKey> {
        let pool = self.pool.clone();
        let entity_uuid_generator = Arc::clone(&self.entity_uuid_generator);
        Box::pin(async move {
            ensure_active_key_postgres(&pool, entity_uuid_generator, tenant_id).await
        })
    }

    fn resolve_by_kid<'a>(
        &'a self,
        kid: &'a str,
    ) -> TenantSigningKeyFuture<'a, Option<TenantSigningKey>> {
        let pool = self.pool.clone();
        let kid = kid.to_owned();
        Box::pin(async move { resolve_by_kid_postgres(&pool, &kid).await })
    }
}

async fn ensure_active_key_sqlite(
    pool: &SqlitePool,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    tenant_id: i64,
) -> DomainResult<TenantSigningKey> {
    let tenant_id_text = tenant_id.to_string();
    if let Some(key) = load_active_key_sqlite(pool, &tenant_id_text).await? {
        return Ok(key);
    }
    insert_active_key_sqlite(pool, entity_uuid_generator, tenant_id).await
}

async fn ensure_active_key_postgres(
    pool: &PgPool,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    tenant_id: i64,
) -> DomainResult<TenantSigningKey> {
    let tenant_id_text = tenant_id.to_string();
    if let Some(key) = load_active_key_postgres(pool, &tenant_id_text).await? {
        return Ok(key);
    }
    insert_active_key_postgres(pool, entity_uuid_generator, tenant_id).await
}

async fn load_active_key_sqlite(
    pool: &SqlitePool,
    tenant_id: &str,
) -> DomainResult<Option<TenantSigningKey>> {
    let row = sqlx::query(
        r#"
        SELECT tenant_id, kid, secret_ref
        FROM iam_tenant_signing_key
        WHERE tenant_id = ?
          AND status = 'active'
        ORDER BY active_from DESC
        LIMIT 1
        "#,
    )
    .bind(tenant_id)
    .fetch_optional(pool)
    .await
    .map_err(|error| store_error("failed to load tenant signing key", error))?;

    row.map(|row| row_to_tenant_signing_key(row.get(0), row.get(1), row.get(2)))
        .transpose()
}

async fn load_active_key_postgres(
    pool: &PgPool,
    tenant_id: &str,
) -> DomainResult<Option<TenantSigningKey>> {
    let row = sqlx::query(
        r#"
        SELECT tenant_id, kid, secret_ref
        FROM iam_tenant_signing_key
        WHERE tenant_id = $1
          AND status = 'active'
        ORDER BY active_from DESC
        LIMIT 1
        "#,
    )
    .bind(tenant_id)
    .fetch_optional(pool)
    .await
    .map_err(|error| store_error("failed to load tenant signing key", error))?;

    row.map(|row| row_to_tenant_signing_key(row.get(0), row.get(1), row.get(2)))
        .transpose()
}

async fn resolve_by_kid_sqlite(
    pool: &SqlitePool,
    kid: &str,
) -> DomainResult<Option<TenantSigningKey>> {
    let tenant_hint = kid.split(':').next().filter(|value| !value.is_empty());
    let row = sqlx::query(
        r#"
        SELECT tenant_id, kid, secret_ref
        FROM iam_tenant_signing_key
        WHERE kid = ?
          AND status IN ('active', 'rotating')
        ORDER BY active_from DESC
        LIMIT 1
        "#,
    )
    .bind(kid)
    .fetch_optional(pool)
    .await
    .map_err(|error| store_error("failed to resolve tenant signing key", error))?;

    let Some(row) = row else {
        return Ok(None);
    };
    let tenant_id: String = row.get(0);
    if tenant_hint.is_some_and(|hint| hint != tenant_id) {
        return Ok(None);
    }
    row_to_tenant_signing_key(row.get(0), row.get(1), row.get(2)).map(Some)
}

async fn resolve_by_kid_postgres(
    pool: &PgPool,
    kid: &str,
) -> DomainResult<Option<TenantSigningKey>> {
    let tenant_hint = kid.split(':').next().filter(|value| !value.is_empty());
    let row = sqlx::query(
        r#"
        SELECT tenant_id, kid, secret_ref
        FROM iam_tenant_signing_key
        WHERE kid = $1
          AND status IN ('active', 'rotating')
        ORDER BY active_from DESC
        LIMIT 1
        "#,
    )
    .bind(kid)
    .fetch_optional(pool)
    .await
    .map_err(|error| store_error("failed to resolve tenant signing key", error))?;

    let Some(row) = row else {
        return Ok(None);
    };
    let tenant_id: String = row.get(0);
    if tenant_hint.is_some_and(|hint| hint != tenant_id) {
        return Ok(None);
    }
    row_to_tenant_signing_key(row.get(0), row.get(1), row.get(2)).map(Some)
}

async fn insert_active_key_sqlite(
    pool: &SqlitePool,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    tenant_id: i64,
) -> DomainResult<TenantSigningKey> {
    let tenant_id_text = tenant_id.to_string();
    let key_id = entity_uuid_generator
        .generate_entity_uuid()
        .map_err(|error| DomainError::new(error.to_string()))?;
    let kid = format!("{tenant_id_text}:local-hs256:{key_id}");
    let mut secret = vec![0u8; 64];
    fill(&mut secret).map_err(|error| DomainError::new(error.to_string()))?;
    let secret_ref = encode_signing_secret_ref(&secret).map_err(|error| DomainError::new(error))?;
    let secret_hash = sha256_hex(&secret_ref);
    let now = current_timestamp_utc();

    sqlx::query(
        r#"
        INSERT INTO iam_tenant_signing_key
            (id, tenant_id, kid, alg, secret_ref, secret_hash, status, active_from, created_at, updated_at)
        VALUES
            (?, ?, ?, 'HS256', ?, ?, 'active', ?, ?, ?)
        ON CONFLICT (tenant_id, kid) DO NOTHING
        "#,
    )
    .bind(&key_id)
    .bind(&tenant_id_text)
    .bind(&kid)
    .bind(&secret_ref)
    .bind(&secret_hash)
    .bind(&now)
    .bind(&now)
    .bind(&now)
    .execute(pool)
    .await
    .map_err(|error| store_error("failed to insert tenant signing key", error))?;

    load_active_key_sqlite(pool, &tenant_id_text)
        .await?
        .ok_or_else(|| DomainError::new("tenant signing key not found after insert".to_owned()))
}

async fn insert_active_key_postgres(
    pool: &PgPool,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    tenant_id: i64,
) -> DomainResult<TenantSigningKey> {
    let tenant_id_text = tenant_id.to_string();
    let key_id = entity_uuid_generator
        .generate_entity_uuid()
        .map_err(|error| DomainError::new(error.to_string()))?;
    let kid = format!("{tenant_id_text}:local-hs256:{key_id}");
    let mut secret = vec![0u8; 64];
    fill(&mut secret).map_err(|error| DomainError::new(error.to_string()))?;
    let secret_ref = encode_signing_secret_ref(&secret).map_err(|error| DomainError::new(error))?;
    let secret_hash = sha256_hex(&secret_ref);
    let now = current_timestamp_utc();

    sqlx::query(
        r#"
        INSERT INTO iam_tenant_signing_key
            (id, tenant_id, kid, alg, secret_ref, secret_hash, status, active_from, created_at, updated_at)
        VALUES
            ($1, $2, $3, 'HS256', $4, $5, 'active', $6, $7, $8)
        ON CONFLICT (tenant_id, kid) DO NOTHING
        "#,
    )
    .bind(&key_id)
    .bind(&tenant_id_text)
    .bind(&kid)
    .bind(&secret_ref)
    .bind(&secret_hash)
    .bind(&now)
    .bind(&now)
    .bind(&now)
    .execute(pool)
    .await
    .map_err(|error| store_error("failed to insert tenant signing key", error))?;

    load_active_key_postgres(pool, &tenant_id_text)
        .await?
        .ok_or_else(|| DomainError::new("tenant signing key not found after insert".to_owned()))
}

fn row_to_tenant_signing_key(
    tenant_id_text: String,
    kid: String,
    secret_ref: String,
) -> DomainResult<TenantSigningKey> {
    let tenant_id = tenant_id_text
        .parse::<i64>()
        .map_err(|_| DomainError::new("tenant signing key tenant_id is invalid".to_owned()))?;
    let secret = decode_signing_secret_ref(&secret_ref).map_err(|error| DomainError::new(error))?;
    Ok(TenantSigningKey {
        tenant_id,
        kid,
        secret,
    })
}

fn sha256_hex(value: &str) -> String {
    use sha2::{Digest, Sha256};
    hex::encode(Sha256::digest(value.as_bytes()))
}

fn current_timestamp_utc() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let seconds = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs())
        .unwrap_or(0);
    format!("{seconds}")
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}

/// Development and test fallback when no SQL-backed tenant signing store is wired.
/// Production runtimes must use [`SqliteTenantSigningKeyStore`] or [`PostgresTenantSigningKeyStore`].
pub struct LegacyGlobalTenantSigningKeyStore {
    signing_secret: Vec<u8>,
}

impl LegacyGlobalTenantSigningKeyStore {
    pub fn from_app_session_config(config: &sdkwork_claw_config::AppSessionConfig) -> Self {
        Self {
            signing_secret: config.signing_secret().as_bytes().to_vec(),
        }
    }
}

impl TenantSigningKeyStore for LegacyGlobalTenantSigningKeyStore {
    fn ensure_active_key<'a>(
        &'a self,
        tenant_id: i64,
    ) -> TenantSigningKeyFuture<'a, TenantSigningKey> {
        Box::pin(async move {
            Ok(TenantSigningKey {
                tenant_id,
                kid: format!("legacy-global:{tenant_id}"),
                secret: self.signing_secret.clone(),
            })
        })
    }

    fn resolve_by_kid<'a>(
        &'a self,
        kid: &'a str,
    ) -> TenantSigningKeyFuture<'a, Option<TenantSigningKey>> {
        Box::pin(async move {
            let tenant_id = kid
                .strip_prefix("legacy-global:")
                .and_then(|value| value.parse::<i64>().ok());
            Ok(match tenant_id {
                Some(tenant_id) => Some(TenantSigningKey {
                    tenant_id,
                    kid: kid.to_owned(),
                    secret: self.signing_secret.clone(),
                }),
                None => None,
            })
        })
    }
}
