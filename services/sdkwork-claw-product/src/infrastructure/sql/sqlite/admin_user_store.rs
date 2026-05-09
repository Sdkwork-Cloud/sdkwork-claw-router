use sqlx::{Row, Sqlite, SqlitePool, Transaction};

use crate::domain::{DecimalValue, DomainError, DomainResult};
use crate::ports::{
    AdjustAdminUserBalanceCommand, AdminUserApiKeyItem, AdminUserCommandFuture, AdminUserItem,
    AdminUserStore, CreateAdminUserApiKeyCommand, CreateAdminUserCommand,
    DeleteAdminUserApiKeyCommand, ListAdminUserApiKeysQuery, ListAdminUsersQuery,
    UpdateAdminUserCommand,
};

const CASH_ACCOUNT_TYPE: i32 = 1;
const BALANCE_ASSET_TYPE: i32 = 1;
const USER_STATUS_ACTIVE: i32 = 1;
const USER_STATUS_BANNED: i32 = 0;
const API_KEY_STATUS_ACTIVE: i32 = 1;
const API_KEY_STATUS_REVOKED: i32 = 4;
const TRANSACTION_RECHARGE: i32 = 10;
const TRANSACTION_REFUND: i32 = 3;
const TRANSACTION_STATUS_SUCCESS: i32 = 2;
const TARGET_TYPE_USER: i32 = 61;
const TARGET_TYPE_API_KEY: i32 = 62;
const TARGET_TYPE_ACCOUNT: i32 = 63;

#[derive(Debug, Clone)]
pub struct SqliteAdminUserStore {
    pool: SqlitePool,
}

impl SqliteAdminUserStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl AdminUserStore for SqliteAdminUserStore {
    fn list_users<'a>(
        &'a self,
        query: ListAdminUsersQuery,
    ) -> AdminUserCommandFuture<'a, Vec<AdminUserItem>> {
        Box::pin(async move { list_users(&self.pool, query).await })
    }

    fn list_api_keys<'a>(
        &'a self,
        query: ListAdminUserApiKeysQuery,
    ) -> AdminUserCommandFuture<'a, Vec<AdminUserApiKeyItem>> {
        Box::pin(async move { list_api_keys(&self.pool, query).await })
    }

    fn create_user<'a>(
        &'a self,
        command: CreateAdminUserCommand,
    ) -> AdminUserCommandFuture<'a, AdminUserItem> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin admin user transaction", error)
                })?;
            ensure_user_identity_available(&mut tx, &command.email, &command.username).await?;
            let user_id = insert_user(&mut tx, &command).await?;
            insert_cash_account(&mut tx, &command, user_id).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_user",
                TARGET_TYPE_USER,
                user_id,
                serde_json::json!({
                    "action": "create_user",
                    "userId": user_id,
                    "email": &command.email,
                    "username": &command.username,
                    "initialBalance": command.initial_balance.to_fixed_string(4)
                }),
            )
            .await?;
            let item = load_user_by_id(
                &mut tx,
                user_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("created user could not be reloaded"))?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit admin user transaction", error))?;
            Ok(item)
        })
    }

    fn update_user<'a>(
        &'a self,
        command: UpdateAdminUserCommand,
    ) -> AdminUserCommandFuture<'a, Option<AdminUserItem>> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin admin user transaction", error)
                })?;
            let updated = update_user_row(&mut tx, &command).await?;
            if !updated {
                tx.commit().await.map_err(|error| {
                    store_error("failed to commit admin user transaction", error)
                })?;
                return Ok(None);
            }
            if let Some(group) = command.group.as_deref() {
                let role_id = ensure_role(&mut tx, group, &command.requested_at).await?;
                replace_user_role(&mut tx, &command, role_id).await?;
            }
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "update_user",
                TARGET_TYPE_USER,
                command.user_id,
                serde_json::json!({
                    "action": "update_user",
                    "userId": command.user_id,
                    "usernameChanged": command.username.is_some(),
                    "group": &command.group,
                    "status": &command.status
                }),
            )
            .await?;
            let item = load_user_by_id(
                &mut tx,
                command.user_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit admin user transaction", error))?;
            Ok(item)
        })
    }

    fn adjust_balance<'a>(
        &'a self,
        command: AdjustAdminUserBalanceCommand,
    ) -> AdminUserCommandFuture<'a, Option<AdminUserItem>> {
        Box::pin(async move {
            let mut tx = self.pool.begin().await.map_err(|error| {
                store_error("failed to begin balance adjustment transaction", error)
            })?;
            if !user_exists(
                &mut tx,
                command.user_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            {
                tx.commit().await.map_err(|error| {
                    store_error("failed to commit balance adjustment transaction", error)
                })?;
                return Ok(None);
            }
            let account = ensure_cash_account(&mut tx, &command).await?;
            let balance_before = DecimalValue::parse(&account.available_balance)?;
            let balance_after = if command.adjustment_type == "refund" {
                let next = balance_before.subtract(command.amount);
                if next < DecimalValue::ZERO {
                    return Err(DomainError::conflict("refund amount exceeds user balance"));
                }
                next
            } else {
                balance_before + command.amount
            };
            update_account_balance(&mut tx, account.id, balance_after, &command.requested_at)
                .await?;
            insert_account_history(&mut tx, &command, account.id, balance_before, balance_after)
                .await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "adjust_user_balance",
                TARGET_TYPE_ACCOUNT,
                account.id,
                serde_json::json!({
                    "action": "adjust_user_balance",
                    "userId": command.user_id,
                    "accountId": account.id,
                    "type": &command.adjustment_type,
                    "amount": command.amount.to_fixed_string(4),
                    "balanceBefore": balance_before.to_fixed_string(4),
                    "balanceAfter": balance_after.to_fixed_string(4)
                }),
            )
            .await?;
            let item = load_user_by_id(
                &mut tx,
                command.user_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit balance adjustment transaction", error)
            })?;
            Ok(item)
        })
    }

    fn create_api_key<'a>(
        &'a self,
        command: CreateAdminUserApiKeyCommand,
    ) -> AdminUserCommandFuture<'a, AdminUserApiKeyItem> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin admin api key transaction", error)
                })?;
            if !user_exists(
                &mut tx,
                command.user_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            {
                return Err(DomainError::not_found("user was not found"));
            }
            ensure_api_key_idempotency_available(&mut tx, &command).await?;
            let group_id = find_default_api_key_group(
                &mut tx,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?;
            let api_key_id = insert_api_key(&mut tx, &command, group_id).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_user_api_key",
                TARGET_TYPE_API_KEY,
                api_key_id,
                serde_json::json!({
                    "action": "create_user_api_key",
                    "userId": command.user_id,
                    "apiKeyId": api_key_id,
                    "name": &command.name,
                    "keyPrefix": &command.key_prefix,
                    "storesSecretPlaintext": false
                }),
            )
            .await?;
            let item = load_api_key_by_id(
                &mut tx,
                api_key_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("created api key could not be reloaded"))?;
            tx.commit().await.map_err(|error| {
                store_error("failed to commit admin api key transaction", error)
            })?;
            Ok(item)
        })
    }

    fn delete_api_key<'a>(
        &'a self,
        command: DeleteAdminUserApiKeyCommand,
    ) -> AdminUserCommandFuture<'a, bool> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin admin api key transaction", error)
                })?;
            let deleted = revoke_api_key(&mut tx, &command).await?;
            if deleted {
                insert_audit_log(
                    &mut tx,
                    &command.audit_log_uuid,
                    &command.request_id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    command.subject.operator_id,
                    command.subject.operator_type,
                    "delete_user_api_key",
                    TARGET_TYPE_API_KEY,
                    command.api_key_id,
                    serde_json::json!({
                        "action": "delete_user_api_key",
                        "apiKeyId": command.api_key_id
                    }),
                )
                .await?;
            }
            tx.commit().await.map_err(|error| {
                store_error("failed to commit admin api key transaction", error)
            })?;
            Ok(deleted)
        })
    }
}

async fn list_users(
    pool: &SqlitePool,
    query: ListAdminUsersQuery,
) -> DomainResult<Vec<AdminUserItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            u.id,
            COALESCE(u.email, '') AS email,
            COALESCE(NULLIF(u.username, ''), u.email, 'user-' || u.id) AS username,
            COALESCE(r.code, 'user') AS role_code,
            COALESCE(r.code, 'standard') AS group_code,
            CAST(COALESCE(a.available_balance, 0) AS TEXT) AS balance,
            u.status AS user_status,
            CAST(COALESCE(le.last_active, u.updated_at, u.created_at, '') AS TEXT) AS last_active,
            CAST(COALESCE(k.last_used_at, '') AS TEXT) AS last_used,
            CAST(COALESCE(u.created_at, '') AS TEXT) AS created_at
        FROM plus_user u
        LEFT JOIN plus_account a
          ON a.id = (
              SELECT account.id
              FROM plus_account account
              WHERE account.user_id = u.id
                AND account.tenant_id = u.tenant_id
                AND account.organization_id = u.organization_id
                AND account.account_type = 1
                AND account.status = 1
              ORDER BY account.updated_at DESC, account.id DESC
              LIMIT 1
          )
        LEFT JOIN plus_role r
          ON r.id = (
              SELECT ur.role_id
              FROM plus_user_role ur
              JOIN plus_role rr ON rr.id = ur.role_id
              WHERE ur.user_id = u.id
              ORDER BY CASE WHEN LOWER(rr.code) = 'admin' THEN 0 ELSE 1 END, rr.code ASC, rr.id ASC
              LIMIT 1
          )
        LEFT JOIN (
            SELECT user_id, MAX(COALESCE(occurred_at, created_at)) AS last_active
            FROM iam_user_login_event
            GROUP BY user_id
        ) le ON le.user_id = u.id
        LEFT JOIN (
            SELECT user_id, MAX(last_used_at) AS last_used_at
            FROM iam_gateway_api_key
            WHERE tenant_id = ?
              AND organization_id = ?
              AND deleted_at IS NULL
            GROUP BY user_id
        ) k ON k.user_id = u.id
        WHERE u.tenant_id = ?
          AND u.organization_id = ?
          AND u.status IN (0, 1)
        ORDER BY u.created_at DESC, u.id DESC
        LIMIT 500
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list admin users", error))?;

    rows.into_iter().map(user_from_row).collect()
}

async fn list_api_keys(
    pool: &SqlitePool,
    query: ListAdminUserApiKeysQuery,
) -> DomainResult<Vec<AdminUserApiKeyItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            id,
            user_id,
            COALESCE(name, '') AS name,
            COALESCE(NULLIF(key_display_masked, ''), COALESCE(key_prefix, '') || '********') AS key_display_masked,
            status AS status
        FROM iam_gateway_api_key
        WHERE tenant_id = ?
          AND organization_id = ?
          AND deleted_at IS NULL
          AND revoked_at IS NULL
          AND status = 1
        ORDER BY updated_at DESC, id DESC
        LIMIT 1000
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list admin api keys", error))?;

    rows.into_iter().map(api_key_from_row).collect()
}

async fn ensure_user_identity_available(
    tx: &mut Transaction<'_, Sqlite>,
    email: &str,
    username: &str,
) -> DomainResult<()> {
    let existing_id: Option<i64> = sqlx::query_scalar(
        r#"
        SELECT id
        FROM plus_user
        WHERE status IN (0, 1)
          AND (LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?))
        LIMIT 1
        "#,
    )
    .bind(email)
    .bind(username)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to check user uniqueness", error))?;
    if existing_id.is_some() {
        Err(DomainError::conflict("email or username already exists"))
    } else {
        Ok(())
    }
}

async fn insert_user(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminUserCommand,
) -> DomainResult<i64> {
    sqlx::query(
        r#"
        INSERT INTO plus_user
            (uuid, tenant_id, organization_id, created_at, updated_at, v, username, nickname, password, platform, type, email, status)
        VALUES
            (?, ?, ?, ?, ?, 0, ?, ?, '', 0, 1, ?, 1)
        "#,
    )
    .bind(&command.user_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(&command.username)
    .bind(&command.username)
    .bind(&command.email)
    .execute(&mut **tx)
    .await
    .map_err(store_create_error)?;
    sqlx::query_scalar("SELECT last_insert_rowid()")
        .fetch_one(&mut **tx)
        .await
        .map_err(|error| store_error("failed to read created user id", error))
}

async fn insert_cash_account(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminUserCommand,
    user_id: i64,
) -> DomainResult<i64> {
    sqlx::query(
        r#"
        INSERT INTO plus_account
            (uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, user_id, account_type, owner, owner_id, available_balance, frozen_balance, available_points, frozen_points, token_balance, frozen_token, status)
        VALUES
            (?, ?, ?, 1, ?, ?, 0, ?, 1, 1, ?, ?, 0, 0, 0, 0, 0, 1)
        "#,
    )
    .bind(&command.account_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(user_id)
    .bind(user_id)
    .bind(command.initial_balance.to_fixed_string(4))
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create user cash account", error))?;
    sqlx::query_scalar("SELECT last_insert_rowid()")
        .fetch_one(&mut **tx)
        .await
        .map_err(|error| store_error("failed to read created account id", error))
}

async fn update_user_row(
    tx: &mut Transaction<'_, Sqlite>,
    command: &UpdateAdminUserCommand,
) -> DomainResult<bool> {
    let status_code = command.status.as_deref().map(user_status_code);
    let result = sqlx::query(
        r#"
        UPDATE plus_user
        SET username = COALESCE(?, username),
            status = COALESCE(?, status),
            updated_at = ?,
            v = COALESCE(v, 0) + 1
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND status IN (0, 1)
        "#,
    )
    .bind(command.username.as_deref())
    .bind(status_code)
    .bind(&command.requested_at)
    .bind(command.user_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(store_create_error)?;
    Ok(result.rows_affected() > 0)
}

async fn ensure_role(
    tx: &mut Transaction<'_, Sqlite>,
    code: &str,
    requested_at: &str,
) -> DomainResult<i64> {
    if let Some(id) =
        sqlx::query_scalar::<_, i64>("SELECT id FROM plus_role WHERE code = ? LIMIT 1")
            .bind(code)
            .fetch_optional(&mut **tx)
            .await
            .map_err(|error| store_error("failed to load user role", error))?
    {
        return Ok(id);
    }
    sqlx::query(
        r#"
        INSERT INTO plus_role
            (uuid, created_at, updated_at, v, code, name, status)
        VALUES
            (?, ?, ?, 0, ?, ?, 1)
        "#,
    )
    .bind(format!("role-{code}"))
    .bind(requested_at)
    .bind(requested_at)
    .bind(code)
    .bind(code)
    .execute(&mut **tx)
    .await
    .map_err(store_create_error)?;
    sqlx::query_scalar("SELECT last_insert_rowid()")
        .fetch_one(&mut **tx)
        .await
        .map_err(|error| store_error("failed to read created role id", error))
}

async fn replace_user_role(
    tx: &mut Transaction<'_, Sqlite>,
    command: &UpdateAdminUserCommand,
    role_id: i64,
) -> DomainResult<()> {
    sqlx::query("DELETE FROM plus_user_role WHERE user_id = ?")
        .bind(command.user_id)
        .execute(&mut **tx)
        .await
        .map_err(|error| store_error("failed to clear user roles", error))?;
    sqlx::query(
        r#"
        INSERT INTO plus_user_role
            (user_id, role_id, created_at, updated_at, operator_id)
        VALUES
            (?, ?, ?, ?, ?)
        "#,
    )
    .bind(command.user_id)
    .bind(role_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(command.subject.operator_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to assign user role", error))?;
    Ok(())
}

async fn ensure_cash_account(
    tx: &mut Transaction<'_, Sqlite>,
    command: &AdjustAdminUserBalanceCommand,
) -> DomainResult<CashAccountRow> {
    if let Some(account) = load_cash_account(tx, command).await? {
        return Ok(account);
    }
    sqlx::query(
        r#"
        INSERT INTO plus_account
            (uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, user_id, account_type, owner, owner_id, available_balance, frozen_balance, available_points, frozen_points, token_balance, frozen_token, status)
        VALUES
            (?, ?, ?, 1, ?, ?, 0, ?, 1, 1, ?, 0, 0, 0, 0, 0, 0, 1)
        "#,
    )
    .bind(&command.account_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(command.user_id)
    .bind(command.user_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create user cash account", error))?;
    load_cash_account(tx, command)
        .await?
        .ok_or_else(|| DomainError::new("created cash account could not be reloaded"))
}

async fn load_cash_account(
    tx: &mut Transaction<'_, Sqlite>,
    command: &AdjustAdminUserBalanceCommand,
) -> DomainResult<Option<CashAccountRow>> {
    let row = sqlx::query(
        r#"
        SELECT id, CAST(COALESCE(available_balance, 0) AS TEXT) AS available_balance
        FROM plus_account
        WHERE tenant_id = ?
          AND organization_id = ?
          AND user_id = ?
          AND account_type = 1
          AND status = 1
        ORDER BY updated_at DESC, id DESC
        LIMIT 1
        "#,
    )
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.user_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load user cash account", error))?;
    row.map(|row| {
        Ok(CashAccountRow {
            id: integer_cell(&row, "id"),
            available_balance: row.try_get("available_balance").map_err(row_error)?,
        })
    })
    .transpose()
}

async fn update_account_balance(
    tx: &mut Transaction<'_, Sqlite>,
    account_id: i64,
    balance_after: DecimalValue,
    requested_at: &str,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        UPDATE plus_account
        SET available_balance = ?,
            updated_at = ?,
            v = COALESCE(v, 0) + 1
        WHERE id = ?
        "#,
    )
    .bind(balance_after.to_fixed_string(4))
    .bind(requested_at)
    .bind(account_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update user balance", error))?;
    Ok(())
}

async fn insert_account_history(
    tx: &mut Transaction<'_, Sqlite>,
    command: &AdjustAdminUserBalanceCommand,
    account_id: i64,
    balance_before: DecimalValue,
    balance_after: DecimalValue,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        INSERT INTO plus_account_history
            (uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, account_type, asset_type, account_id, transaction_id, transaction_type, amount, balance_before, balance_after, status, usage_result, remarks)
        VALUES
            (?, ?, ?, 1, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#,
    )
    .bind(&command.account_history_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(CASH_ACCOUNT_TYPE)
    .bind(BALANCE_ASSET_TYPE)
    .bind(account_id)
    .bind(&command.request_id)
    .bind(if command.adjustment_type == "refund" {
        TRANSACTION_REFUND
    } else {
        TRANSACTION_RECHARGE
    })
    .bind(command.amount.to_fixed_string(4))
    .bind(balance_before.to_fixed_string(4))
    .bind(balance_after.to_fixed_string(4))
    .bind(TRANSACTION_STATUS_SUCCESS)
    .bind("{}")
    .bind(format!("admin_{}", command.adjustment_type))
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to insert account history", error))?;
    Ok(())
}

async fn ensure_api_key_idempotency_available(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminUserApiKeyCommand,
) -> DomainResult<()> {
    let existing_id: Option<i64> = sqlx::query_scalar(
        r#"
        SELECT id
        FROM iam_gateway_api_key
        WHERE tenant_id = ?
          AND idempotency_key = ?
          AND deleted_at IS NULL
        LIMIT 1
        "#,
    )
    .bind(command.subject.tenant_id)
    .bind(&command.idempotency_key)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to check api key idempotency", error))?;
    if existing_id.is_some() {
        Err(DomainError::conflict(
            "api key creation idempotency key has already been used",
        ))
    } else {
        Ok(())
    }
}

async fn find_default_api_key_group(
    tx: &mut Transaction<'_, Sqlite>,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<i64> {
    sqlx::query_scalar(
        r#"
        SELECT id
        FROM iam_gateway_api_key_group
        WHERE (tenant_id IS NULL OR tenant_id = ?)
          AND (organization_id IS NULL OR organization_id = ?)
          AND status = 1
          AND deleted_at IS NULL
        ORDER BY CASE WHEN code IN ('standard', 'standard-group', 'default') THEN 0 ELSE 1 END,
                 updated_at DESC,
                 id ASC
        LIMIT 1
        "#,
    )
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load default api key group", error))?
    .ok_or_else(|| DomainError::new("api key group is required before creating user api keys"))
}

async fn insert_api_key(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminUserApiKeyCommand,
    group_id: i64,
) -> DomainResult<i64> {
    sqlx::query(
        r#"
        INSERT INTO iam_gateway_api_key
            (uuid, tenant_id, organization_id, user_id, group_id, name, key_prefix, key_display_masked, key_hash, hash_alg, secret_version, idempotency_key, status, created_at, updated_at, last_revealed_at)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, CURRENT_TIMESTAMP)
        "#,
    )
    .bind(&command.api_key_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(command.user_id)
    .bind(group_id)
    .bind(&command.name)
    .bind(&command.key_prefix)
    .bind(&command.key_display_masked)
    .bind(&command.key_hash)
    .bind(&command.hash_alg)
    .bind(command.secret_version)
    .bind(&command.idempotency_key)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .execute(&mut **tx)
    .await
    .map_err(store_create_error)?;
    sqlx::query_scalar("SELECT last_insert_rowid()")
        .fetch_one(&mut **tx)
        .await
        .map_err(|error| store_error("failed to read created api key id", error))
}

async fn revoke_api_key(
    tx: &mut Transaction<'_, Sqlite>,
    command: &DeleteAdminUserApiKeyCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE iam_gateway_api_key
        SET status = ?,
            revoked_at = ?,
            revoked_by = ?,
            updated_at = ?
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND deleted_at IS NULL
          AND revoked_at IS NULL
        "#,
    )
    .bind(API_KEY_STATUS_REVOKED)
    .bind(&command.requested_at)
    .bind(command.subject.operator_id)
    .bind(&command.requested_at)
    .bind(command.api_key_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to revoke api key", error))?;
    Ok(result.rows_affected() > 0)
}

async fn user_exists(
    tx: &mut Transaction<'_, Sqlite>,
    user_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<bool> {
    let existing_id: Option<i64> = sqlx::query_scalar(
        r#"
        SELECT id
        FROM plus_user
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND status IN (0, 1)
        LIMIT 1
        "#,
    )
    .bind(user_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to check user existence", error))?;
    Ok(existing_id.is_some())
}

async fn load_user_by_id(
    tx: &mut Transaction<'_, Sqlite>,
    user_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminUserItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            u.id,
            COALESCE(u.email, '') AS email,
            COALESCE(NULLIF(u.username, ''), u.email, 'user-' || u.id) AS username,
            COALESCE(r.code, 'user') AS role_code,
            COALESCE(r.code, 'standard') AS group_code,
            CAST(COALESCE(a.available_balance, 0) AS TEXT) AS balance,
            u.status AS user_status,
            CAST(COALESCE(le.last_active, u.updated_at, u.created_at, '') AS TEXT) AS last_active,
            CAST(COALESCE(k.last_used_at, '') AS TEXT) AS last_used,
            CAST(COALESCE(u.created_at, '') AS TEXT) AS created_at
        FROM plus_user u
        LEFT JOIN plus_account a
          ON a.id = (
              SELECT account.id
              FROM plus_account account
              WHERE account.user_id = u.id
                AND account.tenant_id = u.tenant_id
                AND account.organization_id = u.organization_id
                AND account.account_type = 1
                AND account.status = 1
              ORDER BY account.updated_at DESC, account.id DESC
              LIMIT 1
          )
        LEFT JOIN plus_role r
          ON r.id = (
              SELECT ur.role_id
              FROM plus_user_role ur
              JOIN plus_role rr ON rr.id = ur.role_id
              WHERE ur.user_id = u.id
              ORDER BY CASE WHEN LOWER(rr.code) = 'admin' THEN 0 ELSE 1 END, rr.code ASC, rr.id ASC
              LIMIT 1
          )
        LEFT JOIN (
            SELECT user_id, MAX(COALESCE(occurred_at, created_at)) AS last_active
            FROM iam_user_login_event
            GROUP BY user_id
        ) le ON le.user_id = u.id
        LEFT JOIN (
            SELECT user_id, MAX(last_used_at) AS last_used_at
            FROM iam_gateway_api_key
            WHERE tenant_id = ?
              AND organization_id = ?
              AND deleted_at IS NULL
            GROUP BY user_id
        ) k ON k.user_id = u.id
        WHERE u.id = ?
          AND u.tenant_id = ?
          AND u.organization_id = ?
        LIMIT 1
        "#,
    )
    .bind(tenant_id)
    .bind(organization_id)
    .bind(user_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load admin user", error))?;
    row.map(user_from_row).transpose()
}

async fn load_api_key_by_id(
    tx: &mut Transaction<'_, Sqlite>,
    api_key_id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminUserApiKeyItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            id,
            user_id,
            COALESCE(name, '') AS name,
            COALESCE(NULLIF(key_display_masked, ''), COALESCE(key_prefix, '') || '********') AS key_display_masked,
            status AS status
        FROM iam_gateway_api_key
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
        LIMIT 1
        "#,
    )
    .bind(api_key_id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load admin api key", error))?;
    row.map(api_key_from_row).transpose()
}

async fn insert_audit_log(
    tx: &mut Transaction<'_, Sqlite>,
    uuid: &str,
    request_id: &str,
    tenant_id: i64,
    organization_id: i64,
    operator_id: i64,
    operator_type: i32,
    action: &str,
    target_type: i32,
    target_id: i64,
    change_summary: serde_json::Value,
) -> DomainResult<()> {
    sqlx::query(
        r#"
        INSERT INTO ops_audit_log
            (uuid, tenant_id, organization_id, action, target_type, target_id, request_id, operator_id, operator_type, change_summary)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#,
    )
    .bind(uuid)
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
    .map_err(|error| store_error("failed to write admin user audit log", error))?;
    Ok(())
}

fn user_from_row(row: sqlx::sqlite::SqliteRow) -> DomainResult<AdminUserItem> {
    let role_code: String = row.try_get("role_code").map_err(row_error)?;
    let group: String = row.try_get("group_code").map_err(row_error)?;
    let balance: String = row.try_get("balance").map_err(row_error)?;
    Ok(AdminUserItem {
        id: integer_cell(&row, "id"),
        email: row.try_get("email").map_err(row_error)?,
        username: row.try_get("username").map_err(row_error)?,
        role: role_label(&role_code),
        group,
        balance: balance_label(&balance)?,
        status: user_status_label(required_integer_cell(&row, "user_status", "user")?)?,
        last_active: timestamp_label(row.try_get("last_active").ok()),
        last_used: timestamp_label(row.try_get("last_used").ok()),
        created_at: timestamp_label(row.try_get("created_at").ok()),
    })
}

fn api_key_from_row(row: sqlx::sqlite::SqliteRow) -> DomainResult<AdminUserApiKeyItem> {
    Ok(AdminUserApiKeyItem {
        id: integer_cell(&row, "id"),
        user_id: integer_cell(&row, "user_id"),
        name: row.try_get("name").map_err(row_error)?,
        key: row.try_get("key_display_masked").map_err(row_error)?,
        used: "0.000000".to_owned(),
        status: api_key_status_label(required_integer_cell(&row, "status", "api key")?)?,
    })
}

#[derive(Debug, Clone)]
struct CashAccountRow {
    id: i64,
    available_balance: String,
}

fn user_status_code(status: &str) -> i32 {
    match status {
        "banned" => USER_STATUS_BANNED,
        _ => USER_STATUS_ACTIVE,
    }
}

fn user_status_label(status: i64) -> DomainResult<String> {
    match status {
        value if value == i64::from(USER_STATUS_ACTIVE) => Ok("active".to_owned()),
        value if value == i64::from(USER_STATUS_BANNED) => Ok("banned".to_owned()),
        value => Err(DomainError::new(format!(
            "invalid admin user status from database row: {value}"
        ))),
    }
}

fn api_key_status_label(status: i64) -> DomainResult<String> {
    match status {
        value if value == i64::from(API_KEY_STATUS_ACTIVE) => Ok("active".to_owned()),
        value if value == i64::from(API_KEY_STATUS_REVOKED) => Ok("disabled".to_owned()),
        value => Err(DomainError::new(format!(
            "invalid admin api key status from database row: {value}"
        ))),
    }
}

fn role_label(role_code: &str) -> String {
    if role_code.eq_ignore_ascii_case("admin") || role_code.to_ascii_lowercase().contains("admin") {
        "admin"
    } else {
        "user"
    }
    .to_owned()
}

fn balance_label(value: &str) -> DomainResult<String> {
    DecimalValue::parse(value)
        .map(|amount| format!("${}", amount.to_fixed_string(2)))
        .map_err(|_| DomainError::new(format!("invalid admin user balance: {value}")))
}

fn timestamp_label(value: Option<String>) -> String {
    value
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
        .unwrap_or_else(|| "-".to_owned())
}

fn integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> i64 {
    optional_integer_cell(row, column).unwrap_or(0)
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
}

fn required_integer_cell(
    row: &sqlx::sqlite::SqliteRow,
    column: &str,
    source: &str,
) -> DomainResult<i64> {
    optional_integer_cell(row, column).ok_or_else(|| missing_status_error(source))
}

fn missing_status_error(source: &str) -> DomainError {
    match source {
        "user" => DomainError::new("missing admin user user status from database row"),
        "api key" => DomainError::new("missing admin user api key status from database row"),
        value => DomainError::new(format!(
            "missing admin user {value} status from database row"
        )),
    }
}

fn row_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}

fn store_create_error(error: sqlx::Error) -> DomainError {
    if is_unique_violation(&error) {
        DomainError::conflict("admin user uniqueness constraint was violated")
    } else {
        store_error("failed to write admin user data", error)
    }
}

fn is_unique_violation(error: &sqlx::Error) -> bool {
    error
        .as_database_error()
        .and_then(|database_error| database_error.code())
        .map(|code| matches!(code.as_ref(), "1555" | "2067"))
        .unwrap_or(false)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn balance_label_rejects_invalid_database_balance() {
        assert_eq!(
            "$12.30",
            balance_label("12.3").expect("valid balance must format")
        );

        let invalid = balance_label("not-money").expect_err("invalid admin user balance must fail");
        assert!(invalid
            .to_string()
            .contains("invalid admin user balance: not-money"));
    }
}
