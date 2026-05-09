use sqlx::{Row, Sqlite, SqlitePool, Transaction};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{
    AdminAnnouncementCommandFuture, AdminAnnouncementItem, AdminAnnouncementStore,
    CreateAdminAnnouncementCommand, DeleteAdminAnnouncementCommand, ListAdminAnnouncementsQuery,
    UpdateAdminAnnouncementCommand,
};

const ANNOUNCEMENT_TARGET_TYPE: i32 = 20;

#[derive(Debug, Clone)]
pub struct SqliteAdminAnnouncementStore {
    pool: SqlitePool,
}

impl SqliteAdminAnnouncementStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl AdminAnnouncementStore for SqliteAdminAnnouncementStore {
    fn list_announcements<'a>(
        &'a self,
        query: ListAdminAnnouncementsQuery,
    ) -> AdminAnnouncementCommandFuture<'a, Vec<AdminAnnouncementItem>> {
        Box::pin(async move { list_announcements(&self.pool, query).await })
    }

    fn create_announcement<'a>(
        &'a self,
        command: CreateAdminAnnouncementCommand,
    ) -> AdminAnnouncementCommandFuture<'a, AdminAnnouncementItem> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin announcement transaction", error)
                })?;
            let id = insert_announcement(&mut tx, &command).await?;
            insert_audit_log(
                &mut tx,
                &command.audit_log_uuid,
                &command.request_id,
                command.subject.tenant_id,
                command.subject.organization_id,
                command.subject.operator_id,
                command.subject.operator_type,
                "create_announcement",
                id,
                serde_json::json!({
                    "action": "create_announcement",
                    "announcementId": id,
                    "title": &command.title,
                    "target": &command.target,
                    "status": &command.status
                }),
            )
            .await?;
            let item = load_announcement_by_id(
                &mut tx,
                id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?
            .ok_or_else(|| DomainError::new("created announcement could not be reloaded"))?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit announcement transaction", error))?;
            Ok(item)
        })
    }

    fn update_announcement<'a>(
        &'a self,
        command: UpdateAdminAnnouncementCommand,
    ) -> AdminAnnouncementCommandFuture<'a, Option<AdminAnnouncementItem>> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin announcement transaction", error)
                })?;
            let updated = update_announcement(&mut tx, &command).await?;
            if !updated {
                tx.commit().await.map_err(|error| {
                    store_error("failed to commit announcement transaction", error)
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
                "update_announcement",
                command.announcement_id,
                serde_json::json!({
                    "action": "update_announcement",
                    "announcementId": command.announcement_id,
                    "titleChanged": command.title.is_some(),
                    "contentChanged": command.content.is_some(),
                    "target": command.target,
                    "status": command.status
                }),
            )
            .await?;
            let item = load_announcement_by_id(
                &mut tx,
                command.announcement_id,
                command.subject.tenant_id,
                command.subject.organization_id,
            )
            .await?;
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit announcement transaction", error))?;
            Ok(item)
        })
    }

    fn delete_announcement<'a>(
        &'a self,
        command: DeleteAdminAnnouncementCommand,
    ) -> AdminAnnouncementCommandFuture<'a, bool> {
        Box::pin(async move {
            let mut tx =
                self.pool.begin().await.map_err(|error| {
                    store_error("failed to begin announcement transaction", error)
                })?;
            let deleted = soft_delete_announcement(&mut tx, &command).await?;
            if deleted {
                insert_audit_log(
                    &mut tx,
                    &command.audit_log_uuid,
                    &command.request_id,
                    command.subject.tenant_id,
                    command.subject.organization_id,
                    command.subject.operator_id,
                    command.subject.operator_type,
                    "delete_announcement",
                    command.announcement_id,
                    serde_json::json!({
                        "action": "delete_announcement",
                        "announcementId": command.announcement_id
                    }),
                )
                .await?;
            }
            tx.commit()
                .await
                .map_err(|error| store_error("failed to commit announcement transaction", error))?;
            Ok(deleted)
        })
    }
}

async fn list_announcements(
    pool: &SqlitePool,
    query: ListAdminAnnouncementsQuery,
) -> DomainResult<Vec<AdminAnnouncementItem>> {
    let rows = sqlx::query(
        r#"
        SELECT
            id,
            uuid,
            tenant_id,
            organization_id,
            COALESCE(title, '') AS title,
            COALESCE(content, '') AS content,
            target_scope,
            status,
            CAST(COALESCE(published_at, updated_at, created_at) AS TEXT) AS display_date,
            CAST(deleted_at AS TEXT) AS deleted_at
        FROM content_announcement
        WHERE tenant_id = ?
          AND organization_id = ?
          AND deleted_at IS NULL
        ORDER BY COALESCE(published_at, updated_at, created_at) DESC, id DESC
        LIMIT 200
        "#,
    )
    .bind(query.subject.tenant_id)
    .bind(query.subject.organization_id)
    .fetch_all(pool)
    .await
    .map_err(|error| store_error("failed to list announcements", error))?;

    rows.into_iter().map(item_from_row).collect()
}

async fn insert_announcement(
    tx: &mut Transaction<'_, Sqlite>,
    command: &CreateAdminAnnouncementCommand,
) -> DomainResult<i64> {
    let target_scope = target_code(&command.target);
    let status = status_code(&command.status);
    let audience_filter = audience_filter_json(&command.target)?;
    let published_at = published_at_for_status(&command.status, &command.requested_at);
    sqlx::query(
        r#"
        INSERT INTO content_announcement
            (uuid, tenant_id, organization_id, data_scope, status, created_at, updated_at, version, title, content, target_scope, audience_filter, announcement_type, pinned, published_at)
        VALUES
            (?, ?, ?, 1, ?, ?, ?, 0, ?, ?, ?, ?, 1, 0, ?)
        "#,
    )
    .bind(&command.announcement_uuid)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .bind(status)
    .bind(&command.requested_at)
    .bind(&command.requested_at)
    .bind(&command.title)
    .bind(&command.content)
    .bind(target_scope)
    .bind(audience_filter)
    .bind(published_at)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to create announcement", error))?;

    sqlx::query_scalar("SELECT last_insert_rowid()")
        .fetch_one(&mut **tx)
        .await
        .map_err(|error| store_error("failed to read announcement id", error))
}

async fn update_announcement(
    tx: &mut Transaction<'_, Sqlite>,
    command: &UpdateAdminAnnouncementCommand,
) -> DomainResult<bool> {
    let target_scope = command.target.as_ref().map(|target| target_code(target));
    let audience_filter = command
        .target
        .as_ref()
        .map(|target| audience_filter_json(target))
        .transpose()?;
    let status = command.status.as_ref().map(|status| status_code(status));
    let result = sqlx::query(
        r#"
        UPDATE content_announcement
        SET title = COALESCE(?, title),
            content = COALESCE(?, content),
            target_scope = COALESCE(?, target_scope),
            audience_filter = COALESCE(?, audience_filter),
            status = COALESCE(?, status),
            published_at = CASE
                WHEN ? = 1 THEN COALESCE(published_at, ?)
                WHEN ? = 0 THEN NULL
                ELSE published_at
            END,
            updated_at = ?,
            version = COALESCE(version, 0) + 1
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND deleted_at IS NULL
        "#,
    )
    .bind(command.title.as_deref())
    .bind(command.content.as_deref())
    .bind(target_scope)
    .bind(audience_filter)
    .bind(status)
    .bind(status)
    .bind(&command.requested_at)
    .bind(status)
    .bind(&command.requested_at)
    .bind(command.announcement_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to update announcement", error))?;

    Ok(result.rows_affected() > 0)
}

async fn soft_delete_announcement(
    tx: &mut Transaction<'_, Sqlite>,
    command: &DeleteAdminAnnouncementCommand,
) -> DomainResult<bool> {
    let result = sqlx::query(
        r#"
        UPDATE content_announcement
        SET status = -1,
            deleted_at = ?,
            deleted_by = ?,
            updated_at = ?,
            version = COALESCE(version, 0) + 1
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND deleted_at IS NULL
        "#,
    )
    .bind(&command.requested_at)
    .bind(command.subject.operator_id)
    .bind(&command.requested_at)
    .bind(command.announcement_id)
    .bind(command.subject.tenant_id)
    .bind(command.subject.organization_id)
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to delete announcement", error))?;

    Ok(result.rows_affected() > 0)
}

async fn load_announcement_by_id(
    tx: &mut Transaction<'_, Sqlite>,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
) -> DomainResult<Option<AdminAnnouncementItem>> {
    let row = sqlx::query(
        r#"
        SELECT
            id,
            uuid,
            tenant_id,
            organization_id,
            COALESCE(title, '') AS title,
            COALESCE(content, '') AS content,
            target_scope,
            status,
            CAST(COALESCE(published_at, updated_at, created_at) AS TEXT) AS display_date,
            CAST(deleted_at AS TEXT) AS deleted_at
        FROM content_announcement
        WHERE id = ?
          AND tenant_id = ?
          AND organization_id = ?
          AND deleted_at IS NULL
        LIMIT 1
        "#,
    )
    .bind(id)
    .bind(tenant_id)
    .bind(organization_id)
    .fetch_optional(&mut **tx)
    .await
    .map_err(|error| store_error("failed to load announcement", error))?;

    row.map(item_from_row).transpose()
}

async fn insert_audit_log(
    tx: &mut Transaction<'_, Sqlite>,
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
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#,
    )
    .bind(audit_log_uuid)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(action)
    .bind(ANNOUNCEMENT_TARGET_TYPE)
    .bind(target_id)
    .bind(request_id)
    .bind(operator_id)
    .bind(operator_type)
    .bind(change_summary.to_string())
    .execute(&mut **tx)
    .await
    .map_err(|error| store_error("failed to write announcement audit log", error))?;
    Ok(())
}

fn item_from_row(row: sqlx::sqlite::SqliteRow) -> DomainResult<AdminAnnouncementItem> {
    Ok(AdminAnnouncementItem {
        id: row.try_get("id").map_err(row_error)?,
        uuid: row.try_get("uuid").map_err(row_error)?,
        tenant_id: row.try_get("tenant_id").map_err(row_error)?,
        organization_id: row.try_get("organization_id").map_err(row_error)?,
        title: row.try_get("title").map_err(row_error)?,
        content: row.try_get("content").map_err(row_error)?,
        target: target_label(required_integer_cell(&row, "target_scope", "target")?)?,
        status: status_label(required_integer_cell(&row, "status", "status")?)?,
        date: row.try_get("display_date").map_err(row_error)?,
        deleted_at: row.try_get("deleted_at").ok().flatten(),
    })
}

fn target_code(value: &str) -> i32 {
    match value {
        "vip" => 2,
        "free" => 3,
        "beta" => 4,
        _ => 1,
    }
}

fn target_label(value: i64) -> DomainResult<String> {
    match value {
        1 => Ok("all"),
        2 => Ok("vip"),
        3 => Ok("free"),
        4 => Ok("beta"),
        value => Err(DomainError::new(format!(
            "invalid admin announcement target from database row: {value}"
        ))),
    }
    .map(str::to_owned)
}

fn status_code(value: &str) -> i32 {
    if value == "draft" {
        0
    } else {
        1
    }
}

fn status_label(value: i64) -> DomainResult<String> {
    match value {
        0 => Ok("draft"),
        1 => Ok("published"),
        value => Err(DomainError::new(format!(
            "invalid admin announcement status from database row: {value}"
        ))),
    }
    .map(str::to_owned)
}

fn published_at_for_status<'a>(status: &str, requested_at: &'a str) -> Option<&'a str> {
    (status == "published").then_some(requested_at)
}

fn audience_filter_json(target: &str) -> DomainResult<String> {
    serde_json::to_string(&serde_json::json!({ "target": target }))
        .map_err(|error| DomainError::new(error.to_string()))
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
    field: &str,
) -> DomainResult<i64> {
    optional_integer_cell(row, column).ok_or_else(|| missing_integer_cell_error(field))
}

fn missing_integer_cell_error(field: &str) -> DomainError {
    match field {
        "target" => DomainError::new("missing admin announcement target from database row"),
        "status" => DomainError::new("missing admin announcement status from database row"),
        _ => DomainError::new(format!(
            "missing admin announcement {field} from database row"
        )),
    }
}

fn row_error(error: sqlx::Error) -> DomainError {
    DomainError::new(error.to_string())
}

fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    DomainError::new(format!("{context}: {error}"))
}
