use sha2::Digest;
use sqlx::{Row, SqlitePool};

use crate::domain::{DomainError, DomainResult};
use crate::infrastructure::sql::sql_admin_product_center::{
    media_resource_from_snapshot, media_resource_object_blob_id, media_resource_stable_id,
    provider_asset_media_resource,
};
use crate::ports::{
    AppAuthFuture, AppAuthPasswordResetCodeCommand, AppAuthPasswordResetCommand,
    AppAuthRegistrationCommand, AppAuthStore, AppAuthUserCredential,
    AppAuthVerificationCodeCommand, AppAuthVerificationCodeLookup,
};

const VERIFICATION_CODE_TYPE: &str = "verification_code";
const PASSWORD_RESET_CODE_TYPE: &str = "password_reset_code";

#[derive(Debug, Clone)]
pub struct SqliteAppAuthStore {
    pool: SqlitePool,
}

impl SqliteAppAuthStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl AppAuthStore for SqliteAppAuthStore {
    fn find_user_for_password_login<'a>(
        &'a self,
        account: &'a str,
    ) -> AppAuthFuture<'a, Option<AppAuthUserCredential>> {
        Box::pin(async move { find_user_for_password_login(&self.pool, account).await })
    }

    fn find_user_for_code_login<'a>(
        &'a self,
        target: &'a str,
        verify_type: &'a str,
    ) -> AppAuthFuture<'a, Option<AppAuthUserCredential>> {
        Box::pin(async move { find_user_for_code_login(&self.pool, target, verify_type).await })
    }

    fn create_verification_code<'a>(
        &'a self,
        command: AppAuthVerificationCodeCommand,
    ) -> AppAuthFuture<'a, String> {
        Box::pin(async move { create_verification_code(&self.pool, command).await })
    }

    fn verify_code<'a>(&'a self, lookup: AppAuthVerificationCodeLookup) -> AppAuthFuture<'a, bool> {
        Box::pin(async move { find_active_code(&self.pool, VERIFICATION_CODE_TYPE, lookup).await })
    }

    fn consume_verification_code<'a>(
        &'a self,
        lookup: AppAuthVerificationCodeLookup,
    ) -> AppAuthFuture<'a, bool> {
        Box::pin(async move { consume_code(&self.pool, VERIFICATION_CODE_TYPE, lookup).await })
    }

    fn create_registration<'a>(
        &'a self,
        command: AppAuthRegistrationCommand,
    ) -> AppAuthFuture<'a, AppAuthUserCredential> {
        Box::pin(async move { create_registration(&self.pool, command).await })
    }

    fn create_password_reset_code<'a>(
        &'a self,
        command: AppAuthPasswordResetCodeCommand,
    ) -> AppAuthFuture<'a, String> {
        Box::pin(async move { create_password_reset_code(&self.pool, command).await })
    }

    fn reset_password<'a>(
        &'a self,
        command: AppAuthPasswordResetCommand,
    ) -> AppAuthFuture<'a, bool> {
        Box::pin(async move { reset_password(&self.pool, command).await })
    }
}

async fn find_user_for_password_login(
    pool: &SqlitePool,
    account: &str,
) -> DomainResult<Option<AppAuthUserCredential>> {
    find_user_by_account(pool, account, None).await
}

async fn find_user_for_code_login(
    pool: &SqlitePool,
    target: &str,
    verify_type: &str,
) -> DomainResult<Option<AppAuthUserCredential>> {
    let normalized_type = verify_type.trim().to_ascii_lowercase();
    let column = match normalized_type.as_str() {
        "email" => Some("email"),
        "phone" => Some("phone"),
        _ => None,
    };
    find_user_by_account(pool, target, column).await
}

async fn find_user_by_account(
    pool: &SqlitePool,
    account: &str,
    account_column: Option<&str>,
) -> DomainResult<Option<AppAuthUserCredential>> {
    let predicate = match account_column {
        Some("email") => "LOWER(COALESCE(u.email, '')) = LOWER(?)",
        Some("phone") => "COALESCE(u.phone, '') = ?",
        _ => {
            "LOWER(COALESCE(u.username, '')) = LOWER(?) OR LOWER(COALESCE(u.email, '')) = LOWER(?) OR COALESCE(u.phone, '') = ?"
        }
    };
    let sql = format!(
        r#"
        SELECT
            u.id,
            u.tenant_id,
            COALESCE(om.organization_id, '0') AS organization_id,
            COALESCE(u.username, '') AS username,
            COALESCE(u.email, '') AS email,
            COALESCE(NULLIF(u.display_name, ''), NULLIF(u.username, ''), NULLIF(u.email, ''), 'SDKWork User') AS display_name,
            COALESCE(CAST(u.avatar_resource_snapshot AS TEXT), '') AS avatar_resource_snapshot,
            COALESCE(u.phone, '') AS phone,
            'en-US' AS language,
            CAST(u.created_at AS TEXT) AS registered_at,
            COALESCE(CAST(MAX(c.updated_at) AS TEXT), '') AS password_last_changed,
            0 AS mfa_enabled,
            COUNT(DISTINCT ui.provider) AS identity_count,
            COALESCE(c.credential_hash, '') AS password_hash,
            COALESCE(u.status, '') AS status
        FROM iam_user u
        JOIN iam_credential c
          ON c.tenant_id = u.tenant_id
         AND c.user_id = u.id
         AND c.credential_type = 'password'
         AND c.status = 'active'
        LEFT JOIN iam_organization_membership om
          ON om.tenant_id = u.tenant_id
         AND om.user_id = u.id
         AND om.status = 'active'
        LEFT JOIN iam_user_identity ui
          ON ui.tenant_id = u.tenant_id
         AND ui.user_id = u.id
        WHERE {predicate}
        GROUP BY u.id, u.tenant_id, om.organization_id, u.username, u.email, u.display_name,
                 u.avatar_resource_snapshot, u.phone, u.created_at, c.credential_hash, u.status, om.joined_at, u.updated_at
        ORDER BY CASE u.status WHEN 'active' THEN 1 ELSE 0 END DESC, om.joined_at DESC, u.updated_at DESC, u.id DESC
        LIMIT 1
        "#
    );
    let mut query = sqlx::query(&sql);
    query = match account_column {
        Some(_) => query.bind(account),
        None => query.bind(account).bind(account).bind(account),
    };
    let row = query
        .fetch_optional(pool)
        .await
        .map_err(|error| store_error("failed to load app auth user", error))?;

    row.map(user_from_row).transpose()
}

async fn create_verification_code(
    pool: &SqlitePool,
    command: AppAuthVerificationCodeCommand,
) -> DomainResult<String> {
    let tenant_id = default_tenant_id(pool, None).await?;
    let credential_id = command.credential_id;
    let credential_hash = code_credential_hash(
        &command.target,
        &command.scene,
        &command.verify_type,
        &command.code_hash,
    );
    sqlx::query(
        r#"
        UPDATE iam_credential
        SET status = 'used',
            updated_at = ?
        WHERE tenant_id = ?
          AND credential_type = ?
          AND credential_hash LIKE ?
          AND status = 'active'
        "#,
    )
    .bind(command.now.to_string())
    .bind(&tenant_id)
    .bind(VERIFICATION_CODE_TYPE)
    .bind(code_lookup_prefix(
        &command.target,
        &command.scene,
        &command.verify_type,
    ))
    .execute(pool)
    .await
    .map_err(|error| store_error("failed to deactivate previous verification codes", error))?;

    sqlx::query(
        r#"
        INSERT INTO iam_credential
            (id, tenant_id, user_id, credential_type, credential_hash, status, expires_at, created_at, updated_at)
        VALUES
            (?, ?, ?, ?, ?, 'active', ?, ?, ?)
        "#,
    )
    .bind(&credential_id)
    .bind(&tenant_id)
    .bind("")
    .bind(VERIFICATION_CODE_TYPE)
    .bind(&credential_hash)
    .bind(command.expires_at.to_string())
    .bind(command.now.to_string())
    .bind(command.now.to_string())
    .execute(pool)
    .await
    .map_err(|error| store_error("failed to insert verification code", error))?;
    Ok(credential_id)
}

async fn create_registration(
    pool: &SqlitePool,
    command: AppAuthRegistrationCommand,
) -> DomainResult<AppAuthUserCredential> {
    let mut tx = pool
        .begin_with("BEGIN IMMEDIATE")
        .await
        .map_err(|error| store_error("failed to begin registration transaction", error))?;
    let tenant_id = select_tenant_id(&mut tx, command.tenant_code.as_deref()).await?;
    let organization_id =
        select_organization_id(&mut tx, &tenant_id, command.organization_code.as_deref()).await?;

    if account_exists(
        &mut tx,
        &tenant_id,
        &command.username,
        &command.email,
        &command.phone,
    )
    .await?
    {
        return Err(DomainError::conflict("IAM account already exists"));
    }

    let provider = registration_provider(&command.channel, &command.email, &command.phone)?;
    let subject = if provider == "phone" {
        command.phone.clone()
    } else {
        command.email.clone()
    };
    if let Some(verification_code_hash) = command.verification_code_hash.clone() {
        let consumed = consume_code_in_transaction(
            &mut tx,
            &tenant_id,
            VERIFICATION_CODE_TYPE,
            AppAuthVerificationCodeLookup {
                code_id: None,
                target: subject.clone(),
                scene: "REGISTER".to_owned(),
                verify_type: provider.to_ascii_uppercase(),
                code_hash: verification_code_hash,
                now: command.now,
            },
        )
        .await?;
        if !consumed {
            return Err(DomainError::new("verification code is invalid or expired"));
        }
    }

    let user_id = crate::infrastructure::sql::runtime_id::next_user_id("app user registration")?;
    let credential_id = format!("credential-{user_id}-password");
    let identity_id = format!("identity-{user_id}-{provider}");
    let now = command.now.to_string();
    let avatar = user_default_avatar_resource(&command.username);
    sqlx::query(
        r#"
        INSERT INTO iam_user
            (id, tenant_id, username, display_name, email, phone, avatar_media_resource_id, avatar_object_blob_id, avatar_resource_snapshot, status, created_at, updated_at)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
        "#,
    )
    .bind(&user_id)
    .bind(&tenant_id)
    .bind(&command.username)
    .bind(&command.display_name)
    .bind(&command.email)
    .bind(&command.phone)
    .bind(media_resource_stable_id(&avatar))
    .bind(media_resource_object_blob_id(&avatar))
    .bind(avatar.to_string())
    .bind(&now)
    .bind(&now)
    .execute(&mut *tx)
    .await
    .map_err(|error| store_error("failed to insert IAM user", error))?;

    if organization_id != "0" {
        let member_id = format!("member-{user_id}");
        sqlx::query(
            r#"
            INSERT INTO iam_organization_membership
                (id, tenant_id, organization_id, user_id, membership_kind, display_name, is_primary, status, joined_at, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, 'owner', ?, 1, 'active', ?, ?, ?)
            "#,
        )
        .bind(&member_id)
        .bind(&tenant_id)
        .bind(&organization_id)
        .bind(&user_id)
        .bind(&command.display_name)
        .bind(&now)
        .bind(&now)
        .bind(&now)
        .execute(&mut *tx)
        .await
        .map_err(|error| store_error("failed to insert IAM organization membership", error))?;
    }

    sqlx::query(
        r#"
        INSERT INTO iam_credential
            (id, tenant_id, user_id, credential_type, credential_hash, status, expires_at, created_at, updated_at)
        VALUES
            (?, ?, ?, 'password', ?, 'active', NULL, ?, ?)
        "#,
    )
    .bind(&credential_id)
    .bind(&tenant_id)
    .bind(&user_id)
    .bind(&command.password_hash)
    .bind(&now)
    .bind(&now)
    .execute(&mut *tx)
    .await
    .map_err(|error| store_error("failed to insert IAM password credential", error))?;

    sqlx::query(
        r#"
        INSERT INTO iam_user_identity
            (id, tenant_id, user_id, provider, subject, email, created_at)
        VALUES
            (?, ?, ?, ?, ?, ?, ?)
        "#,
    )
    .bind(&identity_id)
    .bind(&tenant_id)
    .bind(&user_id)
    .bind(provider)
    .bind(&subject)
    .bind(&command.email)
    .bind(&now)
    .execute(&mut *tx)
    .await
    .map_err(|error| store_error("failed to insert IAM user identity", error))?;

    tx.commit()
        .await
        .map_err(|error| store_error("failed to commit registration transaction", error))?;

    find_user_for_password_login(pool, &command.username)
        .await?
        .ok_or_else(|| DomainError::new("registered IAM user could not be loaded"))
}

async fn create_password_reset_code(
    pool: &SqlitePool,
    command: AppAuthPasswordResetCodeCommand,
) -> DomainResult<String> {
    let Some(user) = find_user_for_password_login(pool, &command.account).await? else {
        return Ok(format!(
            "password-reset-{}-{}",
            command.now,
            hash_fragment(&command.account)
        ));
    };
    let credential_id = command.credential_id;
    let credential_hash =
        reset_credential_hash(&command.account, &command.channel, &command.code_hash);

    sqlx::query(
        r#"
        UPDATE iam_credential
        SET status = 'used',
            updated_at = ?
        WHERE tenant_id = ?
          AND user_id = ?
          AND credential_type = ?
          AND credential_hash LIKE ?
          AND status = 'active'
        "#,
    )
    .bind(command.now.to_string())
    .bind(user.tenant_id.to_string())
    .bind(user.id.to_string())
    .bind(PASSWORD_RESET_CODE_TYPE)
    .bind(reset_lookup_prefix(&command.account, &command.channel))
    .execute(pool)
    .await
    .map_err(|error| store_error("failed to deactivate previous password reset codes", error))?;

    sqlx::query(
        r#"
        INSERT INTO iam_credential
            (id, tenant_id, user_id, credential_type, credential_hash, status, expires_at, created_at, updated_at)
        VALUES
            (?, ?, ?, ?, ?, 'active', ?, ?, ?)
        "#,
    )
    .bind(&credential_id)
    .bind(user.tenant_id.to_string())
    .bind(user.id.to_string())
    .bind(PASSWORD_RESET_CODE_TYPE)
    .bind(&credential_hash)
    .bind(command.expires_at.to_string())
    .bind(command.now.to_string())
    .bind(command.now.to_string())
    .execute(pool)
    .await
    .map_err(|error| store_error("failed to insert password reset code", error))?;
    Ok(credential_id)
}

async fn reset_password(
    pool: &SqlitePool,
    command: AppAuthPasswordResetCommand,
) -> DomainResult<bool> {
    let Some(user) = find_user_for_password_login(pool, &command.account).await? else {
        return Ok(false);
    };
    let mut tx = pool
        .begin_with("BEGIN IMMEDIATE")
        .await
        .map_err(|error| store_error("failed to begin password reset transaction", error))?;
    let reset_code = sqlx::query(
        r#"
        SELECT id
        FROM iam_credential
        WHERE tenant_id = ?
          AND user_id = ?
          AND credential_type = ?
          AND status = 'active'
          AND expires_at >= ?
          AND credential_hash IN (?, ?)
        ORDER BY created_at DESC, id DESC
        LIMIT 1
        "#,
    )
    .bind(user.tenant_id.to_string())
    .bind(user.id.to_string())
    .bind(PASSWORD_RESET_CODE_TYPE)
    .bind(command.now.to_string())
    .bind(reset_credential_hash(
        &command.account,
        "EMAIL",
        &command.code_hash,
    ))
    .bind(reset_credential_hash(
        &command.account,
        "SMS",
        &command.code_hash,
    ))
    .fetch_optional(&mut *tx)
    .await
    .map_err(|error| store_error("failed to load password reset code", error))?;
    let Some(reset_code) = reset_code else {
        return Ok(false);
    };
    let reset_code_id = string_cell(&reset_code, "id");
    let now = command.now.to_string();
    sqlx::query(
        r#"
        UPDATE iam_credential
        SET status = 'used',
            updated_at = ?
        WHERE id = ?
        "#,
    )
    .bind(&now)
    .bind(reset_code_id)
    .execute(&mut *tx)
    .await
    .map_err(|error| store_error("failed to consume password reset code", error))?;
    sqlx::query(
        r#"
        UPDATE iam_credential
        SET status = 'rotated',
            updated_at = ?
        WHERE tenant_id = ?
          AND user_id = ?
          AND credential_type = 'password'
          AND status = 'active'
        "#,
    )
    .bind(&now)
    .bind(user.tenant_id.to_string())
    .bind(user.id.to_string())
    .execute(&mut *tx)
    .await
    .map_err(|error| store_error("failed to rotate previous password credentials", error))?;
    sqlx::query(
        r#"
        INSERT INTO iam_credential
            (id, tenant_id, user_id, credential_type, credential_hash, status, expires_at, created_at, updated_at)
        VALUES
            (?, ?, ?, 'password', ?, 'active', NULL, ?, ?)
        "#,
    )
    .bind(format!("credential-{}-password-{}", user.id, command.now))
    .bind(user.tenant_id.to_string())
    .bind(user.id.to_string())
    .bind(&command.password_hash)
    .bind(&now)
    .bind(&now)
    .execute(&mut *tx)
    .await
    .map_err(|error| store_error("failed to insert reset password credential", error))?;

    tx.commit()
        .await
        .map_err(|error| store_error("failed to commit password reset transaction", error))?;
    Ok(true)
}

async fn find_active_code(
    pool: &SqlitePool,
    credential_type: &str,
    lookup: AppAuthVerificationCodeLookup,
) -> DomainResult<bool> {
    let tenant_id = default_tenant_id(pool, None).await?;
    let row = active_code_query(credential_type, &lookup, &tenant_id)
        .fetch_optional(pool)
        .await
        .map_err(|error| store_error("failed to load IAM code credential", error))?;
    Ok(row.is_some())
}

async fn consume_code(
    pool: &SqlitePool,
    credential_type: &str,
    lookup: AppAuthVerificationCodeLookup,
) -> DomainResult<bool> {
    let tenant_id = default_tenant_id(pool, None).await?;
    let mut tx = pool
        .begin_with("BEGIN IMMEDIATE")
        .await
        .map_err(|error| store_error("failed to begin code consume transaction", error))?;
    let consumed =
        consume_code_in_transaction(&mut tx, &tenant_id, credential_type, lookup).await?;
    tx.commit()
        .await
        .map_err(|error| store_error("failed to commit code consume transaction", error))?;
    Ok(consumed)
}

async fn consume_code_in_transaction(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    tenant_id: &str,
    credential_type: &str,
    lookup: AppAuthVerificationCodeLookup,
) -> DomainResult<bool> {
    let row = active_code_query(credential_type, &lookup, tenant_id)
        .fetch_optional(&mut **tx)
        .await
        .map_err(|error| store_error("failed to load IAM code credential", error))?;
    let Some(row) = row else {
        return Ok(false);
    };
    let id = string_cell(&row, "id");
    sqlx::query(
        r#"
        UPDATE iam_credential
        SET status = 'used',
            updated_at = ?
        WHERE id = ?
        "#,
    )
    .bind(lookup.now.to_string())
    .bind(id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to consume IAM code credential", error))?;
    Ok(true)
}

fn active_code_query<'a>(
    credential_type: &'a str,
    lookup: &'a AppAuthVerificationCodeLookup,
    tenant_id: &'a str,
) -> sqlx::query::Query<'a, sqlx::Sqlite, sqlx::sqlite::SqliteArguments<'a>> {
    let credential_hash = code_credential_hash(
        &lookup.target,
        &lookup.scene,
        &lookup.verify_type,
        &lookup.code_hash,
    );
    let sql = if lookup.code_id.as_deref().unwrap_or_default().is_empty() {
        r#"
        SELECT id
        FROM iam_credential
        WHERE tenant_id = ?
          AND credential_type = ?
          AND credential_hash = ?
          AND status = 'active'
          AND expires_at >= ?
        ORDER BY created_at DESC, id DESC
        LIMIT 1
        "#
    } else {
        r#"
        SELECT id
        FROM iam_credential
        WHERE id = ?
          AND tenant_id = ?
          AND credential_type = ?
          AND credential_hash = ?
          AND status = 'active'
          AND expires_at >= ?
        ORDER BY created_at DESC, id DESC
        LIMIT 1
        "#
    };
    let query = sqlx::query(sql);
    if let Some(code_id) = lookup
        .code_id
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty())
    {
        query
            .bind(code_id.to_owned())
            .bind(tenant_id.to_owned())
            .bind(credential_type.to_owned())
            .bind(credential_hash)
            .bind(lookup.now.to_string())
    } else {
        query
            .bind(tenant_id.to_owned())
            .bind(credential_type.to_owned())
            .bind(credential_hash)
            .bind(lookup.now.to_string())
    }
}

async fn select_tenant_id(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    tenant_code: Option<&str>,
) -> DomainResult<String> {
    let row = match tenant_code {
        Some(code) if !code.trim().is_empty() => sqlx::query(
            "SELECT id FROM iam_tenant WHERE code = ? AND status = 'active' ORDER BY id LIMIT 1",
        )
        .bind(code.trim())
        .fetch_optional(&mut **tx)
        .await,
        _ => {
            sqlx::query("SELECT id FROM iam_tenant WHERE status = 'active' ORDER BY id LIMIT 1")
                .fetch_optional(&mut **tx)
                .await
        }
    }
    .map_err(|error| store_error("failed to load IAM tenant", error))?;
    row.map(|row| string_cell(&row, "id"))
        .filter(|value| !value.is_empty())
        .ok_or_else(|| DomainError::not_found("active IAM tenant was not found"))
}

async fn select_organization_id(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    tenant_id: &str,
    organization_code: Option<&str>,
) -> DomainResult<String> {
    let Some(code) = organization_code
        .map(str::trim)
        .filter(|code| !code.is_empty())
    else {
        return Ok("0".to_owned());
    };
    let row = match organization_code {
        Some(_) => sqlx::query(
            "SELECT id FROM iam_organization WHERE tenant_id = ? AND code = ? AND status = 'active' ORDER BY id LIMIT 1",
        )
        .bind(tenant_id)
        .bind(code)
        .fetch_optional(&mut **tx)
        .await,
        None => unreachable!("empty organization code returned before query"),
    }
    .map_err(|error| store_error("failed to load IAM organization", error))?;
    row.map(|row| string_cell(&row, "id"))
        .filter(|value| !value.is_empty())
        .ok_or_else(|| DomainError::not_found("active IAM organization was not found"))
}

async fn default_tenant_id(pool: &SqlitePool, tenant_code: Option<&str>) -> DomainResult<String> {
    let row = match tenant_code {
        Some(code) if !code.trim().is_empty() => sqlx::query(
            "SELECT id FROM iam_tenant WHERE code = ? AND status = 'active' ORDER BY id LIMIT 1",
        )
        .bind(code.trim())
        .fetch_optional(pool)
        .await,
        _ => {
            sqlx::query("SELECT id FROM iam_tenant WHERE status = 'active' ORDER BY id LIMIT 1")
                .fetch_optional(pool)
                .await
        }
    }
    .map_err(|error| store_error("failed to load default IAM tenant", error))?;
    row.map(|row| string_cell(&row, "id"))
        .filter(|value| !value.is_empty())
        .ok_or_else(|| DomainError::not_found("active IAM tenant was not found"))
}

async fn account_exists(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    tenant_id: &str,
    username: &str,
    email: &str,
    phone: &str,
) -> DomainResult<bool> {
    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM iam_user
        WHERE tenant_id = ?
          AND (
            LOWER(username) = LOWER(?)
            OR (? <> '' AND LOWER(COALESCE(email, '')) = LOWER(?))
            OR (? <> '' AND COALESCE(phone, '') = ?)
          )
        "#,
    )
    .bind(tenant_id)
    .bind(username)
    .bind(email)
    .bind(email)
    .bind(phone)
    .bind(phone)
    .fetch_one(&mut **tx)
    .await
    .map_err(|error| store_error("failed to check IAM account uniqueness", error))?;
    Ok(count > 0)
}

fn user_from_row(row: sqlx::sqlite::SqliteRow) -> DomainResult<AppAuthUserCredential> {
    let id = required_i64_cell(&row, "id")?;
    let tenant_id = required_i64_cell(&row, "tenant_id")?;
    let organization_id = required_i64_cell(&row, "organization_id")?;
    Ok(AppAuthUserCredential {
        id,
        tenant_id,
        organization_id,
        username: string_cell(&row, "username"),
        email: string_cell(&row, "email"),
        display_name: string_cell(&row, "display_name"),
        avatar: media_resource_from_row(&row, "avatar_resource_snapshot", "image"),
        phone: string_cell(&row, "phone"),
        language: string_cell(&row, "language"),
        registered_at: string_cell(&row, "registered_at"),
        password_last_changed: string_cell(&row, "password_last_changed"),
        two_factor_enabled: bool_cell(&row, "mfa_enabled"),
        third_party_bound: integer_cell(&row, "identity_count").max(0).to_string(),
        password_hash: string_cell(&row, "password_hash"),
        status: string_cell(&row, "status"),
    })
}

fn registration_provider(channel: &str, email: &str, phone: &str) -> DomainResult<&'static str> {
    match channel.trim().to_ascii_lowercase().as_str() {
        "phone" | "sms" if !phone.is_empty() => Ok("phone"),
        "email" | "" if !email.is_empty() => Ok("email"),
        _ if !email.is_empty() => Ok("email"),
        _ if !phone.is_empty() => Ok("phone"),
        _ => Err(DomainError::new("registration identity target is required")),
    }
}

fn code_credential_hash(target: &str, scene: &str, verify_type: &str, code_hash: &str) -> String {
    format!(
        "target={}|scene={}|type={}|hash={}",
        normalize_code_part(target),
        normalize_code_part(scene),
        normalize_code_part(verify_type),
        code_hash
    )
}

fn code_lookup_prefix(target: &str, scene: &str, verify_type: &str) -> String {
    format!(
        "target={}|scene={}|type={}|%",
        normalize_code_part(target),
        normalize_code_part(scene),
        normalize_code_part(verify_type)
    )
}

fn reset_credential_hash(account: &str, channel: &str, code_hash: &str) -> String {
    format!(
        "account={}|channel={}|hash={}",
        normalize_code_part(account),
        normalize_code_part(channel),
        code_hash
    )
}

fn reset_lookup_prefix(account: &str, channel: &str) -> String {
    format!(
        "account={}|channel={}|%",
        normalize_code_part(account),
        normalize_code_part(channel)
    )
}

fn normalize_code_part(value: &str) -> String {
    value.trim().to_ascii_lowercase().replace('|', "")
}

fn hash_fragment(value: &str) -> String {
    let digest = sha2::Sha256::digest(value.as_bytes());
    hex::encode(&digest[..6])
}

fn user_default_avatar_resource(username: &str) -> serde_json::Value {
    provider_asset_media_resource(
        "image",
        &format!("iam-user-avatar:{}", normalize_code_part(username)),
    )
}

fn media_resource_from_row(
    row: &sqlx::sqlite::SqliteRow,
    column: &str,
    kind: &str,
) -> serde_json::Value {
    media_resource_from_snapshot(&string_cell(row, column), kind)
}

fn string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> String {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .unwrap_or_default()
}

fn required_i64_cell(row: &sqlx::sqlite::SqliteRow, column: &'static str) -> DomainResult<i64> {
    let value = string_cell(row, column);
    value
        .parse::<i64>()
        .or_else(|_| row.try_get::<i64, _>(column))
        .or_else(|_| row.try_get::<i32, _>(column).map(i64::from))
        .map_err(|_| DomainError::new(format!("invalid numeric IAM user {column}")))
}

fn integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> i64 {
    string_cell(row, column)
        .parse::<i64>()
        .or_else(|_| row.try_get::<i64, _>(column))
        .or_else(|_| row.try_get::<i32, _>(column).map(i64::from))
        .unwrap_or(0)
}

fn bool_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> bool {
    row.try_get::<bool, _>(column)
        .ok()
        .or_else(|| Some(integer_cell(row, column) != 0))
        .unwrap_or(false)
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}
