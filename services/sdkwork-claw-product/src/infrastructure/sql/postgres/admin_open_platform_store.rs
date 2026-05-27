use std::sync::Arc;

use sqlx::{PgPool, Postgres, Row, Transaction};

use crate::application::ApiKeySecretCodec;
use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    AdminOpenPlatformAccountItem, AdminOpenPlatformCommandFuture, AdminOpenPlatformEntryItem,
    AdminOpenPlatformManifestItem, AdminOpenPlatformPayBindingItem, AdminOpenPlatformProviderItem,
    AdminOpenPlatformStore, CreateAdminOpenPlatformAccountCommand,
    CreateAdminOpenPlatformEntryCommand, CreateAdminOpenPlatformPayBindingCommand,
    DeleteAdminOpenPlatformAccountCommand, DeleteAdminOpenPlatformEntryCommand,
    DeleteAdminOpenPlatformPayBindingCommand, FindOpenPlatformQrDefaultEntryQuery,
    GetAdminOpenPlatformAccountQuery, ListAdminOpenPlatformAccountsQuery,
    ListAdminOpenPlatformEntriesQuery, ListAdminOpenPlatformManifestsQuery,
    ListAdminOpenPlatformPayBindingsQuery, ListAdminOpenPlatformProvidersQuery,
    OpenPlatformQrDefaultEntryItem, UpdateAdminOpenPlatformAccountCommand,
    UpdateAdminOpenPlatformEntryCommand,
};

const OPEN_PLATFORM_ACCOUNT_TARGET_TYPE: i32 = 81;
const OPEN_PLATFORM_ENTRY_TARGET_TYPE: i32 = 82;
const OPEN_PLATFORM_PAY_BINDING_TARGET_TYPE: i32 = 83;

#[derive(Clone)]
pub struct PostgresAdminOpenPlatformStore {
    pool: PgPool,
    api_key_secret_codec: Option<Arc<dyn ApiKeySecretCodec + Send + Sync>>,
}

impl std::fmt::Debug for PostgresAdminOpenPlatformStore {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        formatter
            .debug_struct("PostgresAdminOpenPlatformStore")
            .field("pool", &self.pool)
            .field("api_key_secret_codec", &self.api_key_secret_codec.is_some())
            .finish()
    }
}

impl PostgresAdminOpenPlatformStore {
    pub fn new(pool: PgPool) -> Self {
        Self {
            pool,
            api_key_secret_codec: None,
        }
    }

    pub fn with_api_key_secret_codec(
        pool: PgPool,
        api_key_secret_codec: Arc<dyn ApiKeySecretCodec + Send + Sync>,
    ) -> Self {
        Self {
            pool,
            api_key_secret_codec: Some(api_key_secret_codec),
        }
    }
}

impl AdminOpenPlatformStore for PostgresAdminOpenPlatformStore {
    fn list_providers<'a>(
        &'a self,
        query: ListAdminOpenPlatformProvidersQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Vec<AdminOpenPlatformProviderItem>> {
        Box::pin(async move { list_providers(&self.pool, query).await })
    }

    fn list_manifests<'a>(
        &'a self,
        query: ListAdminOpenPlatformManifestsQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Vec<AdminOpenPlatformManifestItem>> {
        Box::pin(async move { list_manifests(&self.pool, query).await })
    }

    fn list_accounts<'a>(
        &'a self,
        query: ListAdminOpenPlatformAccountsQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Vec<AdminOpenPlatformAccountItem>> {
        Box::pin(async move { list_accounts(&self.pool, query).await })
    }

    fn find_qr_default_entry<'a>(
        &'a self,
        query: FindOpenPlatformQrDefaultEntryQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<OpenPlatformQrDefaultEntryItem>> {
        Box::pin(async move { find_qr_default_entry(&self.pool, query).await })
    }

    fn get_account<'a>(
        &'a self,
        query: GetAdminOpenPlatformAccountQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformAccountItem>> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin open platform account transaction", error)
            })?;
            let item = load_account_by_id(
                &mut tx,
                query.account_id,
                query.subject.tenant_id,
                query.subject.organization_id,
                false,
            )
            .await?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit open platform account transaction", error)
            })?;
            Ok(item)
        })
    }

    fn create_account<'a>(
        &'a self,
        command: CreateAdminOpenPlatformAccountCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, AdminOpenPlatformAccountItem> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin open platform account transaction", error)
            })?;
            let id =
                insert_account(&mut tx, &command, self.api_key_secret_codec.as_deref()).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_open_platform_account",
                OPEN_PLATFORM_ACCOUNT_TARGET_TYPE,
                id,
                serde_json::json!({
                    "action": "create_open_platform_account",
                    "accountId": id,
                    "key": &command.key,
                    "provider": &command.provider,
                    "type": &command.account_type,
                    "secretStoredAsRef": command.secret_ref.is_some()
                        || command.token_ref.is_some()
                        || command.aes_key_ref.is_some()
                }),
            )
            .await?;
            let item = load_account_by_id(
                &mut tx,
                id,
                command.subject.tenant_id,
                command.subject.organization_id,
                false,
            )
            .await?
            .ok_or_else(|| {
                DomainError::new("created open platform account could not be reloaded")
            })?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit open platform account transaction", error)
            })?;
            Ok(item)
        })
    }

    fn update_account<'a>(
        &'a self,
        command: UpdateAdminOpenPlatformAccountCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformAccountItem>> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin open platform account transaction", error)
            })?;
            let updated =
                update_account(&mut tx, &command, self.api_key_secret_codec.as_deref()).await?;
            if !updated {
                tx.commit().await.map_err(|error| {
                    store_error("failed to commit open platform account transaction", error)
                })?;
                return Ok(None);
            }
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "update_open_platform_account",
                OPEN_PLATFORM_ACCOUNT_TARGET_TYPE,
                command.account_id,
                serde_json::json!({
                    "action": "update_open_platform_account",
                    "accountId": command.account_id,
                    "nameChanged": command.name.is_some(),
                    "appIdChanged": command.app_id.is_some(),
                    "secretRefChanged": command.secret_ref.is_some(),
                    "tokenRefChanged": command.token_ref.is_some(),
                    "aesKeyRefChanged": command.aes_key_ref.is_some(),
                    "defaultEntryChanged": command.default_entry_id.is_some(),
                    "qrDefault": command.qr_default,
                    "status": command.status
                }),
            )
            .await?;
            let item = load_account_by_id(
                &mut tx,
                command.account_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                false,
            )
            .await?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit open platform account transaction", error)
            })?;
            Ok(item)
        })
    }

    fn delete_account<'a>(
        &'a self,
        command: DeleteAdminOpenPlatformAccountCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformAccountItem>> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin open platform account transaction", error)
            })?;
            let deleted = soft_delete_account(&mut tx, &command).await?;
            if !deleted {
                tx.commit().await.map_err(|error| {
                    store_error("failed to commit open platform account transaction", error)
                })?;
                return Ok(None);
            }
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "delete_open_platform_account",
                OPEN_PLATFORM_ACCOUNT_TARGET_TYPE,
                command.account_id,
                serde_json::json!({
                    "action": "delete_open_platform_account",
                    "accountId": command.account_id
                }),
            )
            .await?;
            let item = load_account_by_id(
                &mut tx,
                command.account_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                true,
            )
            .await?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit open platform account transaction", error)
            })?;
            Ok(item)
        })
    }

    fn list_entries<'a>(
        &'a self,
        query: ListAdminOpenPlatformEntriesQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Vec<AdminOpenPlatformEntryItem>> {
        Box::pin(async move { list_entries(&self.pool, query).await })
    }

    fn create_entry<'a>(
        &'a self,
        command: CreateAdminOpenPlatformEntryCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformEntryItem>> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin open platform entry transaction", error)
            })?;
            if !account_exists(
                &mut tx,
                command.account_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            {
                tx.commit().await.map_err(|error| {
                    store_error("failed to commit open platform entry transaction", error)
                })?;
                return Ok(None);
            }
            let id = insert_entry(&mut tx, &command).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_open_platform_entry",
                OPEN_PLATFORM_ENTRY_TARGET_TYPE,
                id,
                serde_json::json!({
                    "action": "create_open_platform_entry",
                    "entryId": id,
                    "accountId": command.account_id,
                    "key": &command.key,
                    "type": &command.entry_type
                }),
            )
            .await?;
            let item = load_entry_by_id(
                &mut tx,
                command.account_id,
                id,
                command.subject.tenant_id,
                command.subject.organization_id,
                false,
            )
            .await?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit open platform entry transaction", error)
            })?;
            Ok(item)
        })
    }

    fn update_entry<'a>(
        &'a self,
        command: UpdateAdminOpenPlatformEntryCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformEntryItem>> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin open platform entry transaction", error)
            })?;
            let updated = update_entry(&mut tx, &command).await?;
            if !updated {
                tx.commit().await.map_err(|error| {
                    store_error("failed to commit open platform entry transaction", error)
                })?;
                return Ok(None);
            }
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "update_open_platform_entry",
                OPEN_PLATFORM_ENTRY_TARGET_TYPE,
                command.entry_id,
                serde_json::json!({
                    "action": "update_open_platform_entry",
                    "entryId": command.entry_id,
                    "accountId": command.account_id,
                    "keyChanged": command.key.is_some(),
                    "typeChanged": command.entry_type.is_some(),
                    "urlChanged": command.url.is_some(),
                    "status": command.status
                }),
            )
            .await?;
            let item = load_entry_by_id(
                &mut tx,
                command.account_id,
                command.entry_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                false,
            )
            .await?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit open platform entry transaction", error)
            })?;
            Ok(item)
        })
    }

    fn delete_entry<'a>(
        &'a self,
        command: DeleteAdminOpenPlatformEntryCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformEntryItem>> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin open platform entry transaction", error)
            })?;
            let deleted = soft_delete_entry(&mut tx, &command).await?;
            if !deleted {
                tx.commit().await.map_err(|error| {
                    store_error("failed to commit open platform entry transaction", error)
                })?;
                return Ok(None);
            }
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "delete_open_platform_entry",
                OPEN_PLATFORM_ENTRY_TARGET_TYPE,
                command.entry_id,
                serde_json::json!({
                    "action": "delete_open_platform_entry",
                    "entryId": command.entry_id,
                    "accountId": command.account_id
                }),
            )
            .await?;
            let item = load_entry_by_id(
                &mut tx,
                command.account_id,
                command.entry_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                true,
            )
            .await?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit open platform entry transaction", error)
            })?;
            Ok(item)
        })
    }

    fn list_pay_bindings<'a>(
        &'a self,
        query: ListAdminOpenPlatformPayBindingsQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Vec<AdminOpenPlatformPayBindingItem>> {
        Box::pin(async move { list_pay_bindings(&self.pool, query).await })
    }

    fn create_pay_binding<'a>(
        &'a self,
        command: CreateAdminOpenPlatformPayBindingCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformPayBindingItem>> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error(
                    "failed to begin open platform pay binding transaction",
                    error,
                )
            })?;
            if !account_exists(
                &mut tx,
                command.account_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            {
                tx.commit().await.map_err(|error| {
                    store_error(
                        "failed to commit open platform pay binding transaction",
                        error,
                    )
                })?;
                return Ok(None);
            }
            let id = insert_pay_binding(&mut tx, &command).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_open_platform_pay_binding",
                OPEN_PLATFORM_PAY_BINDING_TARGET_TYPE,
                id,
                serde_json::json!({
                    "action": "create_open_platform_pay_binding",
                    "bindingId": id,
                    "accountId": command.account_id,
                    "paymentAccountId": &command.payment_account_id,
                    "paymentChannelId": &command.payment_channel_id,
                    "scene": &command.scene,
                    "mode": &command.mode
                }),
            )
            .await?;
            let item = load_pay_binding_by_id(
                &mut tx,
                command.account_id,
                id,
                command.subject.tenant_id,
                command.subject.organization_id,
                false,
            )
            .await?;
            tx.commit().await.map_err(|error| {
                store_error(
                    "failed to commit open platform pay binding transaction",
                    error,
                )
            })?;
            Ok(item)
        })
    }

    fn delete_pay_binding<'a>(
        &'a self,
        command: DeleteAdminOpenPlatformPayBindingCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformPayBindingItem>> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error(
                    "failed to begin open platform pay binding transaction",
                    error,
                )
            })?;
            let deleted = soft_delete_pay_binding(&mut tx, &command).await?;
            if !deleted {
                tx.commit().await.map_err(|error| {
                    store_error(
                        "failed to commit open platform pay binding transaction",
                        error,
                    )
                })?;
                return Ok(None);
            }
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "delete_open_platform_pay_binding",
                OPEN_PLATFORM_PAY_BINDING_TARGET_TYPE,
                command.binding_id,
                serde_json::json!({
                    "action": "delete_open_platform_pay_binding",
                    "bindingId": command.binding_id,
                    "accountId": command.account_id
                }),
            )
            .await?;
            let item = load_pay_binding_by_id(
                &mut tx,
                command.account_id,
                command.binding_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                true,
            )
            .await?;
            tx.commit().await.map_err(|error| {
                store_error(
                    "failed to commit open platform pay binding transaction",
                    error,
                )
            })?;
            Ok(item)
        })
    }
}

async fn list_providers(
    pool: &PgPool,
    query: ListAdminOpenPlatformProvidersQuery,
) -> DomainResult<Vec<AdminOpenPlatformProviderItem>> {
    let status = query.status.as_deref().map(status_code);
    let rows = sqlx::query(
        r#"
        SELECT
            id::text AS id,
            provider,
            name,
            status
        FROM open_platform_provider
        WHERE ((tenant_id = $1 AND organization_id = $2) OR (tenant_id = 0 AND organization_id = 0))
          AND deleted_at IS NULL
          AND ($3 IS NULL OR status = $4)
        ORDER BY
            CASE WHEN tenant_id = $1 AND organization_id = $2 THEN 0 ELSE 1 END,
            COALESCE(sort_order::bigint, id),
            id
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(status)
    .bind(status)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list open platform providers", error))?;

    rows.iter().map(provider_from_row).collect()
}

async fn list_manifests(
    pool: &PgPool,
    query: ListAdminOpenPlatformManifestsQuery,
) -> DomainResult<Vec<AdminOpenPlatformManifestItem>> {
    let status = query.status.as_deref().map(status_code);
    let rows = sqlx::query(
        r#"
        SELECT
            id::text AS id,
            manifest_key,
            provider,
            account_type,
            version,
            status
        FROM open_platform_manifest
        WHERE ((tenant_id = $1 AND organization_id = $2) OR (tenant_id = 0 AND organization_id = 0))
          AND deleted_at IS NULL
          AND ($3 IS NULL OR provider = $4)
          AND ($5 IS NULL OR account_type = $6)
          AND ($7 IS NULL OR status = $8)
        ORDER BY
            CASE WHEN tenant_id = $1 AND organization_id = $2 THEN 0 ELSE 1 END,
            COALESCE(sort_order::bigint, id),
            id
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(query.provider.as_deref())
    .bind(query.provider.as_deref())
    .bind(query.account_type.as_deref())
    .bind(query.account_type.as_deref())
    .bind(status)
    .bind(status)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list open platform manifests", error))?;

    rows.iter().map(manifest_from_row).collect()
}

async fn list_accounts(
    pool: &PgPool,
    query: ListAdminOpenPlatformAccountsQuery,
) -> DomainResult<Vec<AdminOpenPlatformAccountItem>> {
    let status = query.status.as_deref().map(status_code);
    let rows = sqlx::query(
        r#"
        SELECT
            id,
            uuid,
            tenant_id,
            organization_id,
            account_key,
            name,
            provider,
            account_type,
            app_id,
            secret_ref,
            token_ref,
            aes_key_ref,
            default_entry_id,
            COALESCE(qr_default, false) AS qr_default,
            status,
            CAST(created_at AS TEXT) AS created_at,
            CAST(updated_at AS TEXT) AS updated_at,
            CAST(deleted_at AS TEXT) AS deleted_at
        FROM open_platform_account
        WHERE tenant_id = $1
          AND organization_id = $2
          AND deleted_at IS NULL
          AND ($3 IS NULL OR provider = $4)
          AND ($5 IS NULL OR account_type = $6)
          AND ($7 IS NULL OR status = $8)
        ORDER BY updated_at DESC NULLS LAST, id DESC
        LIMIT $9 OFFSET $10
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(query.provider.as_deref())
    .bind(query.provider.as_deref())
    .bind(query.account_type.as_deref())
    .bind(query.account_type.as_deref())
    .bind(status)
    .bind(status)
    .bind(query.page_size.clamp(1, 200))
    .bind(query.offset.max(0))
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list open platform accounts", error))?;

    rows.iter().map(account_from_row).collect()
}

async fn find_qr_default_entry(
    pool: &PgPool,
    query: FindOpenPlatformQrDefaultEntryQuery,
) -> DomainResult<Option<OpenPlatformQrDefaultEntryItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            a.id AS account_id,
            a.uuid AS account_uuid,
            a.tenant_id AS account_tenant_id,
            a.organization_id AS account_organization_id,
            a.account_key AS account_key,
            a.name AS account_name,
            a.provider AS account_provider,
            a.account_type AS account_type,
            a.app_id AS account_app_id,
            a.secret_ref AS account_secret_ref,
            a.token_ref AS account_token_ref,
            a.aes_key_ref AS account_aes_key_ref,
            a.default_entry_id AS account_default_entry_id,
            COALESCE(a.qr_default, false) AS account_qr_default,
            a.status AS account_status,
            CAST(a.created_at AS TEXT) AS account_created_at,
            CAST(a.updated_at AS TEXT) AS account_updated_at,
            CAST(a.deleted_at AS TEXT) AS account_deleted_at,
            e.id AS entry_id,
            e.uuid AS entry_uuid,
            e.tenant_id AS entry_tenant_id,
            e.organization_id AS entry_organization_id,
            e.account_id AS entry_account_id,
            e.entry_key AS entry_key,
            e.entry_type AS entry_type,
            e.entry_url AS entry_url,
            e.status AS entry_status,
            CAST(e.created_at AS TEXT) AS entry_created_at,
            CAST(e.updated_at AS TEXT) AS entry_updated_at,
            CAST(e.deleted_at AS TEXT) AS entry_deleted_at
        FROM open_platform_account a
        INNER JOIN open_platform_entry e
            ON e.id = a.default_entry_id
           AND e.account_id = a.id
           AND e.tenant_id = a.tenant_id
           AND e.organization_id = a.organization_id
           AND e.deleted_at IS NULL
           AND e.status = 1
        WHERE a.tenant_id = $1
          AND a.organization_id = $2
          AND a.deleted_at IS NULL
          AND a.status = 1
          AND COALESCE(a.qr_default, false) = true
          AND a.account_type IN ('official_account', 'mini_app')
          AND ($3 IS NULL OR a.provider = $4)
          AND ($5 IS NULL OR a.account_type = $6)
        ORDER BY a.updated_at DESC NULLS LAST, a.id DESC
        LIMIT 1
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(query.provider.as_deref())
    .bind(query.provider.as_deref())
    .bind(query.account_type.as_deref())
    .bind(query.account_type.as_deref())
    .fetch_optional(pool)
    .await
    .map_err(|error| store_error("failed to find open platform QR default entry", error))?;

    row.as_ref().map(qr_default_entry_from_row).transpose()
}

async fn insert_account(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAdminOpenPlatformAccountCommand,
    api_key_secret_codec: Option<&(dyn ApiKeySecretCodec + Send + Sync)>,
) -> DomainResult<i64> {
    let metadata_json =
        open_platform_account_metadata_json_for_create(command, api_key_secret_codec)?;
    sqlx::query_scalar(
        r#"
        INSERT INTO open_platform_account
            (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata, account_key, name, provider, account_type, app_id, secret_ref, token_ref, aes_key_ref, qr_default)
        VALUES
            ($1, $2, $3, 1, 1, $4::timestamptz, $5::timestamptz, 0, $6::jsonb, $7, $8, $9, $10, $11, $12, $13, $14, false)
        RETURNING id
        "#,
    )
    .bind(&command.account_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(metadata_json)
    .bind(&command.key)
    .bind(&command.name)
    .bind(&command.provider)
    .bind(&command.account_type)
    .bind(command.app_id.as_deref())
    .bind(command.secret_ref.as_deref())
    .bind(command.token_ref.as_deref())
    .bind(command.aes_key_ref.as_deref())
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create open platform account", error))
}

async fn update_account(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateAdminOpenPlatformAccountCommand,
    api_key_secret_codec: Option<&(dyn ApiKeySecretCodec + Send + Sync)>,
) -> DomainResult<bool> {
    let Some(current) = load_account_by_id(
        tx,
        command.account_id,
        command.subject.tenant_id,
        command.subject.organization_id,
        false,
    )
    .await?
    else {
        return Ok(false);
    };

    let next_default_entry_id = match command.default_entry_id {
        Some(Some(entry_id)) => {
            if !entry_exists(
                tx,
                command.account_id,
                entry_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            {
                return Err(DomainError::conflict(
                    "default open platform entry must belong to the account",
                ));
            }
            Some(entry_id)
        }
        Some(None) => None,
        None => current.default_entry_id,
    };
    let next_qr_default = command.qr_default.unwrap_or(current.qr_default);
    if next_qr_default {
        clear_other_qr_defaults(
            tx,
            command.account_id,
            command.subject.tenant_id,
            command.subject.organization_id,
            &current.provider,
            &current.account_type,
            &command.requested_at,
        )
        .await?;
    }

    let next_app_id = command
        .app_id
        .clone()
        .unwrap_or_else(|| current.app_id.clone());
    let next_secret_ref = command
        .secret_ref
        .clone()
        .unwrap_or_else(|| current.secret_ref.clone());
    let next_token_ref = command
        .token_ref
        .clone()
        .unwrap_or_else(|| current.token_ref.clone());
    let next_aes_key_ref = command
        .aes_key_ref
        .clone()
        .unwrap_or_else(|| current.aes_key_ref.clone());
    let next_metadata_json =
        open_platform_account_metadata_json_for_update(tx, command, api_key_secret_codec).await?;

    let result = sqlx::query(
        r#"
        UPDATE open_platform_account
        SET name = $1,
            app_id = $2,
            secret_ref = $3,
            token_ref = $4,
            aes_key_ref = $5,
            default_entry_id = $6,
            qr_default = $7,
            status = $8,
            metadata = COALESCE($9::jsonb, metadata),
            updated_at = $10::timestamptz,
            version = COALESCE(version, 0) + 1
        WHERE id = $11
          AND tenant_id = $12
          AND organization_id = $13
          AND deleted_at IS NULL
        "#,
    )
    .bind(command.name.as_deref().unwrap_or(&current.name))
    .bind(next_app_id.as_deref())
    .bind(next_secret_ref.as_deref())
    .bind(next_token_ref.as_deref())
    .bind(next_aes_key_ref.as_deref())
    .bind(next_default_entry_id)
    .bind(next_qr_default)
    .bind(
        command
            .status
            .as_deref()
            .map(status_code)
            .unwrap_or_else(|| status_code(&current.status)),
    )
    .bind(next_metadata_json.as_deref())
    .bind(&command.requested_at)
    .bind(command.account_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update open platform account", error))?;

    Ok(result.rows_affected() > 0)
}

fn open_platform_account_metadata_json_for_create(
    command: &CreateAdminOpenPlatformAccountCommand,
    api_key_secret_codec: Option<&(dyn ApiKeySecretCodec + Send + Sync)>,
) -> DomainResult<String> {
    open_platform_account_metadata_json(
        None,
        [
            (
                "appSecret",
                command.secret_ref.as_deref(),
                command.secret_material.as_deref(),
            ),
            (
                "token",
                command.token_ref.as_deref(),
                command.token_material.as_deref(),
            ),
            (
                "encodingAesKey",
                command.aes_key_ref.as_deref(),
                command.aes_key_material.as_deref(),
            ),
        ],
        api_key_secret_codec,
    )
}

async fn open_platform_account_metadata_json_for_update(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateAdminOpenPlatformAccountCommand,
    api_key_secret_codec: Option<&(dyn ApiKeySecretCodec + Send + Sync)>,
) -> DomainResult<Option<String>> {
    if command.secret_material.is_none()
        && command.token_material.is_none()
        && command.aes_key_material.is_none()
    {
        return Ok(None);
    }
    let current_metadata = load_account_metadata_by_id(
        tx,
        command.account_id,
        command.subject.tenant_id,
        command.subject.organization_id,
    )
    .await?;
    open_platform_account_metadata_json(
        Some(&current_metadata),
        [
            (
                "appSecret",
                command
                    .secret_ref
                    .as_ref()
                    .and_then(|value| value.as_deref()),
                command.secret_material.as_deref(),
            ),
            (
                "token",
                command
                    .token_ref
                    .as_ref()
                    .and_then(|value| value.as_deref()),
                command.token_material.as_deref(),
            ),
            (
                "encodingAesKey",
                command
                    .aes_key_ref
                    .as_ref()
                    .and_then(|value| value.as_deref()),
                command.aes_key_material.as_deref(),
            ),
        ],
        api_key_secret_codec,
    )
    .map(Some)
}

fn open_platform_account_metadata_json(
    current_metadata_json: Option<&str>,
    materials: [(&str, Option<&str>, Option<&str>); 3],
    api_key_secret_codec: Option<&(dyn ApiKeySecretCodec + Send + Sync)>,
) -> DomainResult<String> {
    let has_material = materials.iter().any(|(_, _, material)| material.is_some());
    if !has_material {
        return Ok(current_metadata_json
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .unwrap_or("{}")
            .to_owned());
    }
    let Some(api_key_secret_codec) = api_key_secret_codec else {
        return Err(DomainError::new(
            "open platform credential material requires an encrypted secret codec",
        ));
    };
    let mut metadata = parse_account_metadata_json(current_metadata_json)?;
    let Some(metadata_object) = metadata.as_object_mut() else {
        return Err(DomainError::new(
            "open platform account metadata must be a JSON object",
        ));
    };
    let mut credential_material = metadata_object
        .remove("credentialMaterial")
        .filter(serde_json::Value::is_object)
        .unwrap_or_else(|| serde_json::json!({}));
    let credential_object = credential_material.as_object_mut().ok_or_else(|| {
        DomainError::new("open platform credential metadata must be a JSON object")
    })?;
    credential_object.insert(
        "storage".to_owned(),
        serde_json::Value::String("encrypted-open-platform-account-metadata".to_owned()),
    );
    for (material_key, secret_ref, material) in materials {
        let Some(material) = material else {
            continue;
        };
        let ciphertext = api_key_secret_codec.encode_secret(material)?;
        credential_object.insert(
            material_key.to_owned(),
            serde_json::json!({
                "ref": secret_ref,
                "ciphertext": ciphertext
            }),
        );
    }
    metadata_object.insert("credentialMaterial".to_owned(), credential_material);
    serde_json::to_string(&metadata).map_err(|error| {
        DomainError::new(format!(
            "failed to serialize open platform metadata: {error}"
        ))
    })
}

fn parse_account_metadata_json(
    current_metadata_json: Option<&str>,
) -> DomainResult<serde_json::Value> {
    let Some(current_metadata_json) = current_metadata_json
        .map(str::trim)
        .filter(|value| !value.is_empty())
    else {
        return Ok(serde_json::json!({}));
    };
    serde_json::from_str(current_metadata_json).map_err(|error| {
        DomainError::new(format!(
            "open platform account metadata must be valid JSON: {error}"
        ))
    })
}

async fn load_account_metadata_by_id(
    tx: &mut Transaction<'_, Postgres>,
    account_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<String> {
    let metadata: Option<serde_json::Value> = sqlx::query_scalar(
        r#"
        SELECT COALESCE(metadata, '{}'::jsonb)
        FROM open_platform_account
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
          AND deleted_at IS NULL
        LIMIT 1
        "#,
    )
    .bind(account_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load open platform account metadata", error))?;

    serde_json::to_string(&metadata.unwrap_or_else(|| serde_json::json!({}))).map_err(|error| {
        DomainError::new(format!(
            "failed to serialize open platform metadata: {error}"
        ))
    })
}

async fn soft_delete_account(
    tx: &mut Transaction<'_, Postgres>,
    command: &DeleteAdminOpenPlatformAccountCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE open_platform_account
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
    .bind(command.account_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete open platform account", error))?;

    if result.rows_affected() == 0 {
        return Ok(false);
    }

    for statement in [
        r#"
        UPDATE open_platform_entry
        SET status = -1,
            deleted_at = $1::timestamptz,
            deleted_by = $2,
            updated_at = $3::timestamptz,
            version = COALESCE(version, 0) + 1
        WHERE account_id = $4
          AND tenant_id = $5
          AND organization_id = $6
          AND deleted_at IS NULL
        "#,
        r#"
        UPDATE open_platform_pay_binding
        SET status = -1,
            deleted_at = $1::timestamptz,
            deleted_by = $2,
            updated_at = $3::timestamptz,
            version = COALESCE(version, 0) + 1
        WHERE account_id = $4
          AND tenant_id = $5
          AND organization_id = $6
          AND deleted_at IS NULL
        "#,
    ] {
        sqlx::query(statement)
            .bind(&command.requested_at)
            .bind(command.subject.operator_id)
            .bind(&command.requested_at)
            .bind(command.account_id)
            .bind(command.subject.tenant_id)
            .bind(command.subject.organization_id)
            .execute(&mut **tx)
            .await
            .map_err(|error| store_error("failed to delete open platform child records", error))?;
    }

    Ok(true)
}

async fn list_entries(
    pool: &PgPool,
    query: ListAdminOpenPlatformEntriesQuery,
) -> DomainResult<Vec<AdminOpenPlatformEntryItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            id,
            uuid,
            tenant_id,
            organization_id,
            account_id,
            entry_key,
            entry_type,
            entry_url,
            status,
            CAST(created_at AS TEXT) AS created_at,
            CAST(updated_at AS TEXT) AS updated_at,
            CAST(deleted_at AS TEXT) AS deleted_at
        FROM open_platform_entry
        WHERE tenant_id = $1
          AND organization_id = $2
          AND account_id = $3
          AND deleted_at IS NULL
        ORDER BY id
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(query.account_id)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list open platform entries", error))?;

    rows.iter().map(entry_from_row).collect()
}

async fn insert_entry(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAdminOpenPlatformEntryCommand,
) -> DomainResult<i64> {
    sqlx::query_scalar(
        r#"
        INSERT INTO open_platform_entry
            (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata, account_id, entry_key, entry_type, entry_url)
        VALUES
            ($1, $2, $3, 1, 1, $4::timestamptz, $5::timestamptz, 0, '{}'::jsonb, $6, $7, $8, $9)
        RETURNING id
        "#,
    )
    .bind(&command.entry_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(command.account_id)
    .bind(&command.key)
    .bind(&command.entry_type)
    .bind(&command.url)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create open platform entry", error))
}

async fn update_entry(
    tx: &mut Transaction<'_, Postgres>,
    command: &UpdateAdminOpenPlatformEntryCommand,
) -> DomainResult<bool> {
    let Some(current) = load_entry_by_id(
        tx,
        command.account_id,
        command.entry_id,
        command.subject.tenant_id,
        command.subject.organization_id,
        false,
    )
    .await?
    else {
        return Ok(false);
    };
    let next_status = command
        .status
        .as_deref()
        .map(status_code)
        .unwrap_or_else(|| status_code(&current.status));
    let result = sqlx::query(
        r#"
        UPDATE open_platform_entry
        SET entry_key = $1,
            entry_type = $2,
            entry_url = $3,
            status = $4,
            updated_at = $5::timestamptz,
            version = COALESCE(version, 0) + 1
        WHERE id = $6
          AND account_id = $7
          AND tenant_id = $8
          AND organization_id = $9
          AND deleted_at IS NULL
        "#,
    )
    .bind(command.key.as_deref().unwrap_or(&current.key))
    .bind(command.entry_type.as_deref().unwrap_or(&current.entry_type))
    .bind(command.url.as_deref().unwrap_or(&current.url))
    .bind(next_status)
    .bind(&command.requested_at)
    .bind(command.entry_id)
    .bind(command.account_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update open platform entry", error))?;

    if result.rows_affected() > 0 && next_status == 0 {
        clear_account_default_entry(
            tx,
            command.account_id,
            command.entry_id,
            command.subject.tenant_id,
            command.subject.organization_id,
            &command.requested_at,
        )
        .await?;
    }

    Ok(result.rows_affected() > 0)
}

async fn soft_delete_entry(
    tx: &mut Transaction<'_, Postgres>,
    command: &DeleteAdminOpenPlatformEntryCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE open_platform_entry
        SET status = -1,
            deleted_at = $1::timestamptz,
            deleted_by = $2,
            updated_at = $3::timestamptz,
            version = COALESCE(version, 0) + 1
        WHERE id = $4
          AND account_id = $5
          AND tenant_id = $6
          AND organization_id = $7
          AND deleted_at IS NULL
        "#,
    )
    .bind(&command.requested_at)
    .bind(command.subject.operator_id)
    .bind(&command.requested_at)
    .bind(command.entry_id)
    .bind(command.account_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete open platform entry", error))?;

    if result.rows_affected() > 0 {
        clear_account_default_entry(
            tx,
            command.account_id,
            command.entry_id,
            command.subject.tenant_id,
            command.subject.organization_id,
            &command.requested_at,
        )
        .await?;
    }

    Ok(result.rows_affected() > 0)
}

async fn list_pay_bindings(
    pool: &PgPool,
    query: ListAdminOpenPlatformPayBindingsQuery,
) -> DomainResult<Vec<AdminOpenPlatformPayBindingItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            id,
            uuid,
            tenant_id,
            organization_id,
            account_id,
            payment_account_id,
            payment_channel_id,
            scene,
            mode,
            status,
            CAST(created_at AS TEXT) AS created_at,
            CAST(updated_at AS TEXT) AS updated_at,
            CAST(deleted_at AS TEXT) AS deleted_at
        FROM open_platform_pay_binding
        WHERE tenant_id = $1
          AND organization_id = $2
          AND account_id = $3
          AND deleted_at IS NULL
        ORDER BY id
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(query.account_id)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list open platform pay bindings", error))?;

    rows.iter().map(pay_binding_from_row).collect()
}

async fn insert_pay_binding(
    tx: &mut Transaction<'_, Postgres>,
    command: &CreateAdminOpenPlatformPayBindingCommand,
) -> DomainResult<i64> {
    sqlx::query_scalar(
        r#"
        INSERT INTO open_platform_pay_binding
            (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, metadata, account_id, payment_account_id, payment_channel_id, scene, mode)
        VALUES
            ($1, $2, $3, 1, 1, $4::timestamptz, $5::timestamptz, 0, '{}'::jsonb, $6, $7, $8, $9, $10)
        RETURNING id
        "#,
    )
    .bind(&command.pay_binding_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(command.account_id)
    .bind(&command.payment_account_id)
    .bind(command.payment_channel_id.as_deref())
    .bind(&command.scene)
    .bind(&command.mode)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create open platform pay binding", error))
}

async fn soft_delete_pay_binding(
    tx: &mut Transaction<'_, Postgres>,
    command: &DeleteAdminOpenPlatformPayBindingCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE open_platform_pay_binding
        SET status = -1,
            deleted_at = $1::timestamptz,
            deleted_by = $2,
            updated_at = $3::timestamptz,
            version = COALESCE(version, 0) + 1
        WHERE id = $4
          AND account_id = $5
          AND tenant_id = $6
          AND organization_id = $7
          AND deleted_at IS NULL
        "#,
    )
    .bind(&command.requested_at)
    .bind(command.subject.operator_id)
    .bind(&command.requested_at)
    .bind(command.binding_id)
    .bind(command.account_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete open platform pay binding", error))?;

    Ok(result.rows_affected() > 0)
}

async fn account_exists(
    tx: &mut Transaction<'_, Postgres>,
    account_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<bool> {
    Ok(
        load_account_by_id(tx, account_id, tenant_id, organization_id, false)
            .await?
            .is_some(),
    )
}

async fn entry_exists(
    tx: &mut Transaction<'_, Postgres>,
    account_id: i64,
    entry_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<bool> {
    Ok(
        load_entry_by_id(tx, account_id, entry_id, tenant_id, organization_id, false)
            .await?
            .is_some(),
    )
}

async fn clear_other_qr_defaults(
    tx: &mut Transaction<'_, Postgres>,
    account_id: i64,
    tenant_id: i64,
    organization_id: i64,
    provider: &str,
    account_type: &str,
    requested_at: &str,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE open_platform_account
        SET qr_default = false,
            updated_at = $1::timestamptz,
            version = COALESCE(version, 0) + 1
        WHERE tenant_id = $2
          AND organization_id = $3
          AND provider = $4
          AND account_type = $5
          AND id <> $6
          AND qr_default = true
          AND deleted_at IS NULL
        "#,
    )
    .bind(requested_at)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(provider)
    .bind(account_type)
    .bind(account_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to clear open platform qr defaults", error))?;
    Ok(())
}

async fn clear_account_default_entry(
    tx: &mut Transaction<'_, Postgres>,
    account_id: i64,
    entry_id: i64,
    tenant_id: i64,
    organization_id: i64,
    requested_at: &str,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE open_platform_account
        SET default_entry_id = NULL,
            qr_default = false,
            updated_at = $1::timestamptz,
            version = COALESCE(version, 0) + 1
        WHERE id = $2
          AND tenant_id = $3
          AND organization_id = $4
          AND default_entry_id = $5
          AND deleted_at IS NULL
        "#,
    )
    .bind(requested_at)
    .bind(account_id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(entry_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to clear open platform account default entry", error))?;
    Ok(())
}

async fn load_account_by_id(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
    include_deleted: bool,
) -> DomainResult<Option<AdminOpenPlatformAccountItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            id,
            uuid,
            tenant_id,
            organization_id,
            account_key,
            name,
            provider,
            account_type,
            app_id,
            secret_ref,
            token_ref,
            aes_key_ref,
            default_entry_id,
            COALESCE(qr_default, false) AS qr_default,
            status,
            CAST(created_at AS TEXT) AS created_at,
            CAST(updated_at AS TEXT) AS updated_at,
            CAST(deleted_at AS TEXT) AS deleted_at
        FROM open_platform_account
        WHERE id = $1
          AND tenant_id = $2
          AND organization_id = $3
          AND ($4 = true OR deleted_at IS NULL)
        LIMIT 1
        "#,
    )
    .bind(id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(include_deleted)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load open platform account", error))?;

    row.as_ref().map(account_from_row).transpose()
}

async fn load_entry_by_id(
    tx: &mut Transaction<'_, Postgres>,
    account_id: i64,
    entry_id: i64,
    tenant_id: i64,
    organization_id: i64,
    include_deleted: bool,
) -> DomainResult<Option<AdminOpenPlatformEntryItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            id,
            uuid,
            tenant_id,
            organization_id,
            account_id,
            entry_key,
            entry_type,
            entry_url,
            status,
            CAST(created_at AS TEXT) AS created_at,
            CAST(updated_at AS TEXT) AS updated_at,
            CAST(deleted_at AS TEXT) AS deleted_at
        FROM open_platform_entry
        WHERE id = $1
          AND account_id = $2
          AND tenant_id = $3
          AND organization_id = $4
          AND ($5 = true OR deleted_at IS NULL)
        LIMIT 1
        "#,
    )
    .bind(entry_id)
    .bind(account_id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(include_deleted)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load open platform entry", error))?;

    row.as_ref().map(entry_from_row).transpose()
}

async fn load_pay_binding_by_id(
    tx: &mut Transaction<'_, Postgres>,
    account_id: i64,
    binding_id: i64,
    tenant_id: i64,
    organization_id: i64,
    include_deleted: bool,
) -> DomainResult<Option<AdminOpenPlatformPayBindingItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            id,
            uuid,
            tenant_id,
            organization_id,
            account_id,
            payment_account_id,
            payment_channel_id,
            scene,
            mode,
            status,
            CAST(created_at AS TEXT) AS created_at,
            CAST(updated_at AS TEXT) AS updated_at,
            CAST(deleted_at AS TEXT) AS deleted_at
        FROM open_platform_pay_binding
        WHERE id = $1
          AND account_id = $2
          AND tenant_id = $3
          AND organization_id = $4
          AND ($5 = true OR deleted_at IS NULL)
        LIMIT 1
        "#,
    )
    .bind(binding_id)
    .bind(account_id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(include_deleted)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load open platform pay binding", error))?;

    row.as_ref().map(pay_binding_from_row).transpose()
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
    target_type: i32,
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
    .bind(target_type)
    .bind(target_id)
    .bind(request_id)
    .bind(operator_id)
    .bind(operator_type)
    .bind(change_summary.to_string())
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to write open platform audit log", error))?;
    Ok(())
}

fn provider_from_row(row: &sqlx::postgres::PgRow) -> DomainResult<AdminOpenPlatformProviderItem> {
    Ok(AdminOpenPlatformProviderItem {
        id: string_cell(row, "id"),
        provider: string_cell(row, "provider"),
        name: string_cell(row, "name"),
        status: status_label(required_integer_cell(row, "status")?)?,
    })
}

fn manifest_from_row(row: &sqlx::postgres::PgRow) -> DomainResult<AdminOpenPlatformManifestItem> {
    Ok(AdminOpenPlatformManifestItem {
        id: string_cell(row, "id"),
        key: string_cell(row, "manifest_key"),
        provider: string_cell(row, "provider"),
        account_type: string_cell(row, "account_type"),
        version: string_cell(row, "version"),
        status: status_label(required_integer_cell(row, "status")?)?,
    })
}

fn account_from_row(row: &sqlx::postgres::PgRow) -> DomainResult<AdminOpenPlatformAccountItem> {
    Ok(AdminOpenPlatformAccountItem {
        id: required_integer_cell(row, "id")?,
        uuid: string_cell(row, "uuid"),
        tenant_id: required_integer_cell(row, "tenant_id")?,
        organization_id: required_integer_cell(row, "organization_id")?,
        key: string_cell(row, "account_key"),
        name: string_cell(row, "name"),
        provider: string_cell(row, "provider"),
        account_type: string_cell(row, "account_type"),
        app_id: optional_string_cell(row, "app_id"),
        secret_ref: optional_string_cell(row, "secret_ref"),
        token_ref: optional_string_cell(row, "token_ref"),
        aes_key_ref: optional_string_cell(row, "aes_key_ref"),
        default_entry_id: optional_integer_cell(row, "default_entry_id"),
        qr_default: bool_cell(row, "qr_default"),
        status: status_label(required_integer_cell(row, "status")?)?,
        created_at: string_cell(row, "created_at"),
        updated_at: string_cell(row, "updated_at"),
        deleted_at: optional_string_cell(row, "deleted_at"),
    })
}

fn entry_from_row(row: &sqlx::postgres::PgRow) -> DomainResult<AdminOpenPlatformEntryItem> {
    Ok(AdminOpenPlatformEntryItem {
        id: required_integer_cell(row, "id")?,
        uuid: string_cell(row, "uuid"),
        tenant_id: required_integer_cell(row, "tenant_id")?,
        organization_id: required_integer_cell(row, "organization_id")?,
        account_id: required_integer_cell(row, "account_id")?,
        key: string_cell(row, "entry_key"),
        entry_type: string_cell(row, "entry_type"),
        url: string_cell(row, "entry_url"),
        status: status_label(required_integer_cell(row, "status")?)?,
        created_at: string_cell(row, "created_at"),
        updated_at: string_cell(row, "updated_at"),
        deleted_at: optional_string_cell(row, "deleted_at"),
    })
}

fn qr_default_entry_from_row(
    row: &sqlx::postgres::PgRow,
) -> DomainResult<OpenPlatformQrDefaultEntryItem> {
    Ok(OpenPlatformQrDefaultEntryItem {
        account: AdminOpenPlatformAccountItem {
            id: required_integer_cell(row, "account_id")?,
            uuid: string_cell(row, "account_uuid"),
            tenant_id: required_integer_cell(row, "account_tenant_id")?,
            organization_id: required_integer_cell(row, "account_organization_id")?,
            key: string_cell(row, "account_key"),
            name: string_cell(row, "account_name"),
            provider: string_cell(row, "account_provider"),
            account_type: string_cell(row, "account_type"),
            app_id: optional_string_cell(row, "account_app_id"),
            secret_ref: optional_string_cell(row, "account_secret_ref"),
            token_ref: optional_string_cell(row, "account_token_ref"),
            aes_key_ref: optional_string_cell(row, "account_aes_key_ref"),
            default_entry_id: optional_integer_cell(row, "account_default_entry_id"),
            qr_default: bool_cell(row, "account_qr_default"),
            status: status_label(required_integer_cell(row, "account_status")?)?,
            created_at: string_cell(row, "account_created_at"),
            updated_at: string_cell(row, "account_updated_at"),
            deleted_at: optional_string_cell(row, "account_deleted_at"),
        },
        entry: AdminOpenPlatformEntryItem {
            id: required_integer_cell(row, "entry_id")?,
            uuid: string_cell(row, "entry_uuid"),
            tenant_id: required_integer_cell(row, "entry_tenant_id")?,
            organization_id: required_integer_cell(row, "entry_organization_id")?,
            account_id: required_integer_cell(row, "entry_account_id")?,
            key: string_cell(row, "entry_key"),
            entry_type: string_cell(row, "entry_type"),
            url: string_cell(row, "entry_url"),
            status: status_label(required_integer_cell(row, "entry_status")?)?,
            created_at: string_cell(row, "entry_created_at"),
            updated_at: string_cell(row, "entry_updated_at"),
            deleted_at: optional_string_cell(row, "entry_deleted_at"),
        },
    })
}

fn pay_binding_from_row(
    row: &sqlx::postgres::PgRow,
) -> DomainResult<AdminOpenPlatformPayBindingItem> {
    Ok(AdminOpenPlatformPayBindingItem {
        id: required_integer_cell(row, "id")?,
        uuid: string_cell(row, "uuid"),
        tenant_id: required_integer_cell(row, "tenant_id")?,
        organization_id: required_integer_cell(row, "organization_id")?,
        account_id: required_integer_cell(row, "account_id")?,
        payment_account_id: string_cell(row, "payment_account_id"),
        payment_channel_id: optional_string_cell(row, "payment_channel_id"),
        scene: string_cell(row, "scene"),
        mode: string_cell(row, "mode"),
        status: status_label(required_integer_cell(row, "status")?)?,
        created_at: string_cell(row, "created_at"),
        updated_at: string_cell(row, "updated_at"),
        deleted_at: optional_string_cell(row, "deleted_at"),
    })
}

fn status_code(value: &str) -> i32 {
    if value == "inactive" {
        0
    } else {
        1
    }
}

fn status_label(value: i64) -> DomainResult<String> {
    match value {
        1 => Ok("active"),
        0 | -1 => Ok("inactive"),
        value => Err(DomainError::new(format!(
            "invalid open platform status from database row: {value}"
        ))),
    }
    .map(str::to_owned)
}

fn required_integer_cell(row: &sqlx::postgres::PgRow, column: &str) -> DomainResult<i64> {
    optional_integer_cell(row, column).ok_or_else(|| {
        DomainError::new(format!("missing open platform {column} from database row"))
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

fn bool_cell(row: &sqlx::postgres::PgRow, column: &str) -> bool {
    row.try_get::<Option<bool>, _>(column)
        .ok()
        .flatten()
        .or_else(|| {
            row.try_get::<Option<i64>, _>(column)
                .ok()
                .flatten()
                .map(|value| value != 0)
        })
        .or_else(|| {
            row.try_get::<Option<i32>, _>(column)
                .ok()
                .flatten()
                .map(|value| value != 0)
        })
        .unwrap_or(false)
}

fn string_cell(row: &sqlx::postgres::PgRow, column: &str) -> String {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .unwrap_or_default()
}

fn optional_string_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<String> {
    let value = string_cell(row, column);
    (!value.trim().is_empty()).then_some(value)
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    if let sqlx::Error::Database(database_error) = &error {
        if database_error
            .code()
            .map(|code| code == "23505")
            .unwrap_or(false)
        {
            return DomainError::conflict(format!(
                "{context}: open platform record already exists"
            ));
        }
    }
    DomainError::new(format!("{context}: {error}"))
}
