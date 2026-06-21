use std::collections::BTreeSet;

use sqlx::{PgPool, Row};


use crate::error::{RepositoryError, RepositoryResult, sql_error};
use crate::types::{
    AppIamDepartmentAssignmentItem, AppIamDepartmentItem, AppIamDepartmentTreeItem,
    AppIamDirectoryQuery, AppIamDirectoryReadFuture, AppIamDirectoryReadStore,
    AppIamDirectorySubject, AppIamOrganizationItem, AppIamOrganizationMembershipItem,
    AppIamOrganizationTreeItem, AppIamPositionAssignmentItem, AppIamPositionItem,
    AppIamRoleBindingItem,
};

const LIST_ORGANIZATIONS: &str = r#"
SELECT
    CAST(o.id AS TEXT) AS id,
    CAST(o.tenant_id AS TEXT) AS tenant_id,
    CAST(o.parent_id AS TEXT) AS parent_id,
    COALESCE(o.code, '') AS code,
    COALESCE(o.name, '') AS name,
    COALESCE(o.path, '') AS path,
    COALESCE(CAST(o.status AS TEXT), '') AS status,
    COALESCE(CAST(o.created_at AS TEXT), '') AS created_at,
    COALESCE(CAST(o.updated_at AS TEXT), '') AS updated_at
FROM iam_organization o
WHERE CAST(o.tenant_id AS TEXT) = $1
  AND ($2 = 'all' OR LOWER(CAST(o.status AS TEXT)) = LOWER($2) OR ($2 = 'active' AND CAST(o.status AS TEXT) = '1'))
  AND EXISTS (
      SELECT 1
      FROM iam_organization_membership om
      WHERE CAST(om.tenant_id AS TEXT) = CAST(o.tenant_id AS TEXT)
        AND CAST(om.organization_id AS TEXT) = CAST(o.id AS TEXT)
        AND CAST(om.user_id AS TEXT) = $3
        AND (LOWER(CAST(om.status AS TEXT)) = 'active' OR CAST(om.status AS TEXT) = '1')
  )
ORDER BY o.path ASC, o.id ASC
LIMIT 500
"#;

const LIST_ORGANIZATION_MEMBERSHIPS: &str = r#"
SELECT
    CAST(om.id AS TEXT) AS id,
    CAST(om.tenant_id AS TEXT) AS tenant_id,
    CAST(om.organization_id AS TEXT) AS organization_id,
    CAST(om.user_id AS TEXT) AS user_id,
    COALESCE(om.membership_kind, '') AS role_code,
    COALESCE(CAST(om.status AS TEXT), '') AS status,
    COALESCE(CAST(om.joined_at AS TEXT), '') AS joined_at,
    '' AS left_at,
    '' AS remark
FROM iam_organization_membership om
WHERE CAST(om.tenant_id AS TEXT) = $1
  AND CAST(om.user_id AS TEXT) = $2
  AND ($3 = '' OR CAST(om.organization_id AS TEXT) = $3)
  AND ($4 = 'all' OR LOWER(CAST(om.status AS TEXT)) = LOWER($4) OR ($4 = 'active' AND CAST(om.status AS TEXT) = '1'))
ORDER BY om.joined_at DESC, om.id ASC
LIMIT 500
"#;

const LIST_DEPARTMENTS: &str = r#"
SELECT
    CAST(d.id AS TEXT) AS id,
    CAST(d.tenant_id AS TEXT) AS tenant_id,
    CAST(d.organization_id AS TEXT) AS organization_id,
    CAST(d.parent_department_id AS TEXT) AS parent_department_id,
    COALESCE(d.code, '') AS code,
    COALESCE(d.name, '') AS name,
    COALESCE(d.path, '') AS path,
    COALESCE(CAST(d.status AS TEXT), '') AS status,
    COALESCE(CAST(d.created_at AS TEXT), '') AS created_at,
    COALESCE(CAST(d.updated_at AS TEXT), '') AS updated_at
FROM iam_department d
WHERE CAST(d.tenant_id AS TEXT) = $1
  AND ($2 = '' OR CAST(d.organization_id AS TEXT) = $2)
  AND ($3 = 'all' OR LOWER(CAST(d.status AS TEXT)) = LOWER($3) OR ($3 = 'active' AND CAST(d.status AS TEXT) = '1'))
  AND EXISTS (
      SELECT 1
      FROM iam_organization_membership om
      WHERE CAST(om.tenant_id AS TEXT) = CAST(d.tenant_id AS TEXT)
        AND CAST(om.organization_id AS TEXT) = CAST(d.organization_id AS TEXT)
        AND CAST(om.user_id AS TEXT) = $4
        AND (LOWER(CAST(om.status AS TEXT)) = 'active' OR CAST(om.status AS TEXT) = '1')
  )
ORDER BY d.path ASC, d.id ASC
LIMIT 500
"#;

const LIST_DEPARTMENT_ASSIGNMENTS: &str = r#"
SELECT
    CAST(a.id AS TEXT) AS id,
    CAST(a.tenant_id AS TEXT) AS tenant_id,
    CAST(a.organization_id AS TEXT) AS organization_id,
    CAST(a.organization_membership_id AS TEXT) AS organization_membership_id,
    CAST(a.department_id AS TEXT) AS department_id,
    CAST(a.user_id AS TEXT) AS user_id,
    COALESCE(a.assignment_kind, '') AS assignment_kind,
    COALESCE(a.is_primary, 0) AS is_primary,
    COALESCE(CAST(a.effective_from AS TEXT), '') AS effective_from,
    COALESCE(CAST(a.effective_to AS TEXT), '') AS effective_to,
    COALESCE(CAST(a.status AS TEXT), '') AS status,
    COALESCE(CAST(a.created_at AS TEXT), '') AS created_at,
    COALESCE(CAST(a.updated_at AS TEXT), '') AS updated_at
FROM iam_department_assignment a
WHERE CAST(a.tenant_id AS TEXT) = $1
  AND CAST(a.user_id AS TEXT) = $2
  AND ($3 = '' OR CAST(a.organization_id AS TEXT) = $3)
  AND ($4 = '' OR CAST(a.department_id AS TEXT) = $4)
  AND ($5 = 'all' OR LOWER(CAST(a.status AS TEXT)) = LOWER($5) OR ($5 = 'active' AND CAST(a.status AS TEXT) = '1'))
ORDER BY a.created_at DESC NULLS LAST, a.id ASC
LIMIT 500
"#;

const LIST_POSITIONS: &str = r#"
SELECT
    CAST(p.id AS TEXT) AS id,
    CAST(p.tenant_id AS TEXT) AS tenant_id,
    CAST(p.organization_id AS TEXT) AS organization_id,
    CAST(p.department_id AS TEXT) AS department_id,
    COALESCE(p.code, '') AS code,
    COALESCE(p.name, '') AS name,
    COALESCE(p.position_kind, '') AS position_kind,
    COALESCE(CAST(p.rank_level AS TEXT), '') AS rank_level,
    COALESCE(CAST(p.status AS TEXT), '') AS status,
    COALESCE(CAST(p.created_at AS TEXT), '') AS created_at,
    COALESCE(CAST(p.updated_at AS TEXT), '') AS updated_at
FROM iam_position p
WHERE CAST(p.tenant_id AS TEXT) = $1
  AND ($2 = '' OR CAST(p.organization_id AS TEXT) = $2)
  AND ($3 = '' OR CAST(p.department_id AS TEXT) = $3)
  AND ($4 = 'all' OR LOWER(CAST(p.status AS TEXT)) = LOWER($4) OR ($4 = 'active' AND CAST(p.status AS TEXT) = '1'))
  AND EXISTS (
      SELECT 1
      FROM iam_organization_membership om
      WHERE CAST(om.tenant_id AS TEXT) = CAST(p.tenant_id AS TEXT)
        AND CAST(om.organization_id AS TEXT) = CAST(p.organization_id AS TEXT)
        AND CAST(om.user_id AS TEXT) = $5
        AND (LOWER(CAST(om.status AS TEXT)) = 'active' OR CAST(om.status AS TEXT) = '1')
  )
ORDER BY p.rank_level ASC NULLS LAST, p.id ASC
LIMIT 500
"#;

const LIST_POSITION_ASSIGNMENTS: &str = r#"
SELECT
    CAST(a.id AS TEXT) AS id,
    CAST(a.tenant_id AS TEXT) AS tenant_id,
    CAST(a.organization_id AS TEXT) AS organization_id,
    CAST(a.department_assignment_id AS TEXT) AS department_assignment_id,
    CAST(a.position_id AS TEXT) AS position_id,
    CAST(a.user_id AS TEXT) AS user_id,
    COALESCE(a.is_primary, 0) AS is_primary,
    COALESCE(CAST(a.effective_from AS TEXT), '') AS effective_from,
    COALESCE(CAST(a.effective_to AS TEXT), '') AS effective_to,
    COALESCE(CAST(a.status AS TEXT), '') AS status,
    COALESCE(CAST(a.created_at AS TEXT), '') AS created_at,
    COALESCE(CAST(a.updated_at AS TEXT), '') AS updated_at
FROM iam_position_assignment a
JOIN iam_position p
  ON CAST(p.tenant_id AS TEXT) = CAST(a.tenant_id AS TEXT)
 AND CAST(p.organization_id AS TEXT) = CAST(a.organization_id AS TEXT)
 AND CAST(p.id AS TEXT) = CAST(a.position_id AS TEXT)
WHERE CAST(a.tenant_id AS TEXT) = $1
  AND CAST(a.user_id AS TEXT) = $2
  AND ($3 = '' OR CAST(a.organization_id AS TEXT) = $3)
  AND ($4 = '' OR CAST(p.department_id AS TEXT) = $4)
  AND ($5 = 'all' OR LOWER(CAST(a.status AS TEXT)) = LOWER($5) OR ($5 = 'active' AND CAST(a.status AS TEXT) = '1'))
ORDER BY a.created_at DESC NULLS LAST, a.id ASC
LIMIT 500
"#;

const LIST_ROLE_BINDINGS: &str = r#"
SELECT
    CAST(rb.id AS TEXT) AS id,
    CAST(rb.tenant_id AS TEXT) AS tenant_id,
    CAST(rb.role_id AS TEXT) AS role_id,
    COALESCE(rb.principal_kind, '') AS principal_kind,
    CAST(rb.principal_id AS TEXT) AS principal_id,
    COALESCE(rb.scope_kind, '') AS scope_kind,
    CAST(rb.scope_id AS TEXT) AS scope_id,
    COALESCE(rb.effect, '') AS effect,
    COALESCE(CAST(rb.condition_json AS TEXT), '') AS condition_json,
    COALESCE(CAST(rb.status AS TEXT), '') AS status,
    COALESCE(CAST(rb.created_at AS TEXT), '') AS created_at,
    COALESCE(CAST(rb.updated_at AS TEXT), '') AS updated_at
FROM iam_role_binding rb
WHERE CAST(rb.tenant_id AS TEXT) = $1
  AND ($2 = '' OR CAST(rb.scope_id AS TEXT) = $2)
  AND ($3 = 'all' OR LOWER(CAST(rb.status AS TEXT)) = LOWER($3) OR ($3 = 'active' AND CAST(rb.status AS TEXT) = '1'))
ORDER BY rb.created_at DESC NULLS LAST, rb.id ASC
LIMIT 500
"#;

#[derive(Debug, Clone)]
pub struct PostgresAppIamDirectoryReadStore {
    pool: PgPool,
}

impl PostgresAppIamDirectoryReadStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl AppIamDirectoryReadStore for PostgresAppIamDirectoryReadStore {
    fn list_organizations<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamOrganizationItem>> {
        Box::pin(async move {
            let subject = require_subject(subject)?;
            let rows = sqlx::query(LIST_ORGANIZATIONS)
                .bind(subject.tenant_id.to_string())
                .bind(status_filter(&query))
                .bind(subject.user_id.to_string())
                .fetch_all(&self.pool)
                .await
                .map_err(sql_error)?;
            let items = rows
                .iter()
                .map(row_to_organization)
                .collect::<RepositoryResult<Vec<_>>>()?;
            Ok(filter_organizations(items, &query))
        })
    }

    fn retrieve_organization_tree<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamOrganizationTreeItem>> {
        Box::pin(async move {
            let items = self
                .list_organizations(Some(require_subject(subject)?), query)
                .await?;
            Ok(build_organization_tree(items))
        })
    }

    fn list_organization_memberships<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamOrganizationMembershipItem>> {
        Box::pin(async move {
            let subject = require_subject(subject)?;
            let organization_id = query
                .organization_id
                .as_deref()
                .unwrap_or("")
                .trim()
                .to_owned();
            let rows = sqlx::query(LIST_ORGANIZATION_MEMBERSHIPS)
                .bind(subject.tenant_id.to_string())
                .bind(subject.user_id.to_string())
                .bind(organization_id)
                .bind(status_filter(&query))
                .fetch_all(&self.pool)
                .await
                .map_err(sql_error)?;
            let items = rows
                .iter()
                .map(row_to_organization_membership)
                .collect::<RepositoryResult<Vec<_>>>()?;
            Ok(filter_memberships(items, &query))
        })
    }

    fn list_departments<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamDepartmentItem>> {
        Box::pin(async move {
            let subject = require_subject(subject)?;
            if !table_exists(&self.pool, "iam_department").await? {
                return Ok(Vec::new());
            }
            let rows = sqlx::query(LIST_DEPARTMENTS)
                .bind(subject.tenant_id.to_string())
                .bind(query.organization_id.as_deref().unwrap_or(""))
                .bind(status_filter(&query))
                .bind(subject.user_id.to_string())
                .fetch_all(&self.pool)
                .await
                .map_err(sql_error)?;
            let items = rows
                .iter()
                .map(row_to_department)
                .collect::<RepositoryResult<Vec<_>>>()?;
            Ok(filter_departments(items, &query))
        })
    }

    fn retrieve_department_tree<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamDepartmentTreeItem>> {
        Box::pin(async move {
            let items = self
                .list_departments(Some(require_subject(subject)?), query)
                .await?;
            Ok(build_department_tree(items))
        })
    }

    fn list_department_assignments<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamDepartmentAssignmentItem>> {
        Box::pin(async move {
            let subject = require_subject(subject)?;
            if !table_exists(&self.pool, "iam_department_assignment").await? {
                return Ok(Vec::new());
            }
            let rows = sqlx::query(LIST_DEPARTMENT_ASSIGNMENTS)
                .bind(subject.tenant_id.to_string())
                .bind(subject.user_id.to_string())
                .bind(query.organization_id.as_deref().unwrap_or(""))
                .bind(query.department_id.as_deref().unwrap_or(""))
                .bind(status_filter(&query))
                .fetch_all(&self.pool)
                .await
                .map_err(sql_error)?;
            Ok(rows
                .iter()
                .map(row_to_department_assignment)
                .collect::<RepositoryResult<Vec<_>>>()?)
        })
    }

    fn list_positions<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamPositionItem>> {
        Box::pin(async move {
            let subject = require_subject(subject)?;
            if !table_exists(&self.pool, "iam_position").await? {
                return Ok(Vec::new());
            }
            let rows = sqlx::query(LIST_POSITIONS)
                .bind(subject.tenant_id.to_string())
                .bind(query.organization_id.as_deref().unwrap_or(""))
                .bind(query.department_id.as_deref().unwrap_or(""))
                .bind(status_filter(&query))
                .bind(subject.user_id.to_string())
                .fetch_all(&self.pool)
                .await
                .map_err(sql_error)?;
            Ok(rows
                .iter()
                .map(row_to_position)
                .collect::<RepositoryResult<Vec<_>>>()?)
        })
    }

    fn list_position_assignments<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamPositionAssignmentItem>> {
        Box::pin(async move {
            let subject = require_subject(subject)?;
            if !table_exists(&self.pool, "iam_position_assignment").await? {
                return Ok(Vec::new());
            }
            let rows = sqlx::query(LIST_POSITION_ASSIGNMENTS)
                .bind(subject.tenant_id.to_string())
                .bind(subject.user_id.to_string())
                .bind(query.organization_id.as_deref().unwrap_or(""))
                .bind(query.department_id.as_deref().unwrap_or(""))
                .bind(status_filter(&query))
                .fetch_all(&self.pool)
                .await
                .map_err(sql_error)?;
            Ok(rows
                .iter()
                .map(row_to_position_assignment)
                .collect::<RepositoryResult<Vec<_>>>()?)
        })
    }

    fn list_role_bindings<'a>(
        &'a self,
        subject: Option<AppIamDirectorySubject>,
        query: AppIamDirectoryQuery,
    ) -> AppIamDirectoryReadFuture<'a, Vec<AppIamRoleBindingItem>> {
        Box::pin(async move {
            let subject = require_subject(subject)?;
            if !table_exists(&self.pool, "iam_role_binding").await? {
                return Ok(Vec::new());
            }
            let rows = sqlx::query(LIST_ROLE_BINDINGS)
                .bind(subject.tenant_id.to_string())
                .bind(query.scope_id.as_deref().unwrap_or(""))
                .bind(status_filter(&query))
                .fetch_all(&self.pool)
                .await
                .map_err(sql_error)?;
            Ok(rows
                .iter()
                .map(row_to_role_binding)
                .collect::<RepositoryResult<Vec<_>>>()?)
        })
    }
}

fn row_to_organization(row: &sqlx::postgres::PgRow) -> RepositoryResult<AppIamOrganizationItem> {
    Ok(AppIamOrganizationItem {
        id: string_cell(row, "id"),
        tenant_id: string_cell(row, "tenant_id"),
        parent_id: option_string_cell(row, "parent_id"),
        code: string_cell(row, "code"),
        name: string_cell(row, "name"),
        path: string_cell(row, "path"),
        status: string_cell(row, "status"),
        created_at: string_cell(row, "created_at"),
        updated_at: string_cell(row, "updated_at"),
    })
}

fn row_to_organization_membership(
    row: &sqlx::postgres::PgRow,
) -> RepositoryResult<AppIamOrganizationMembershipItem> {
    Ok(AppIamOrganizationMembershipItem {
        id: string_cell(row, "id"),
        tenant_id: string_cell(row, "tenant_id"),
        organization_id: string_cell(row, "organization_id"),
        user_id: string_cell(row, "user_id"),
        role_code: string_cell(row, "role_code"),
        status: string_cell(row, "status"),
        joined_at: string_cell(row, "joined_at"),
        left_at: string_cell(row, "left_at"),
        remark: string_cell(row, "remark"),
    })
}

fn row_to_department(row: &sqlx::postgres::PgRow) -> RepositoryResult<AppIamDepartmentItem> {
    Ok(AppIamDepartmentItem {
        id: string_cell(row, "id"),
        tenant_id: string_cell(row, "tenant_id"),
        organization_id: string_cell(row, "organization_id"),
        parent_department_id: option_string_cell(row, "parent_department_id"),
        code: string_cell(row, "code"),
        name: string_cell(row, "name"),
        path: string_cell(row, "path"),
        status: string_cell(row, "status"),
        created_at: string_cell(row, "created_at"),
        updated_at: string_cell(row, "updated_at"),
    })
}

fn row_to_department_assignment(
    row: &sqlx::postgres::PgRow,
) -> RepositoryResult<AppIamDepartmentAssignmentItem> {
    Ok(AppIamDepartmentAssignmentItem {
        id: string_cell(row, "id"),
        tenant_id: string_cell(row, "tenant_id"),
        organization_id: string_cell(row, "organization_id"),
        organization_membership_id: string_cell(row, "organization_membership_id"),
        department_id: string_cell(row, "department_id"),
        user_id: string_cell(row, "user_id"),
        assignment_kind: string_cell(row, "assignment_kind"),
        is_primary: bool_cell(row, "is_primary"),
        effective_from: string_cell(row, "effective_from"),
        effective_to: string_cell(row, "effective_to"),
        status: string_cell(row, "status"),
        created_at: string_cell(row, "created_at"),
        updated_at: string_cell(row, "updated_at"),
    })
}

fn row_to_position(row: &sqlx::postgres::PgRow) -> RepositoryResult<AppIamPositionItem> {
    Ok(AppIamPositionItem {
        id: string_cell(row, "id"),
        tenant_id: string_cell(row, "tenant_id"),
        organization_id: string_cell(row, "organization_id"),
        department_id: string_cell(row, "department_id"),
        code: string_cell(row, "code"),
        name: string_cell(row, "name"),
        position_kind: string_cell(row, "position_kind"),
        rank_level: string_cell(row, "rank_level"),
        status: string_cell(row, "status"),
        created_at: string_cell(row, "created_at"),
        updated_at: string_cell(row, "updated_at"),
    })
}

fn row_to_position_assignment(
    row: &sqlx::postgres::PgRow,
) -> RepositoryResult<AppIamPositionAssignmentItem> {
    Ok(AppIamPositionAssignmentItem {
        id: string_cell(row, "id"),
        tenant_id: string_cell(row, "tenant_id"),
        organization_id: string_cell(row, "organization_id"),
        department_assignment_id: string_cell(row, "department_assignment_id"),
        position_id: string_cell(row, "position_id"),
        user_id: string_cell(row, "user_id"),
        is_primary: bool_cell(row, "is_primary"),
        effective_from: string_cell(row, "effective_from"),
        effective_to: string_cell(row, "effective_to"),
        status: string_cell(row, "status"),
        created_at: string_cell(row, "created_at"),
        updated_at: string_cell(row, "updated_at"),
    })
}

fn row_to_role_binding(row: &sqlx::postgres::PgRow) -> RepositoryResult<AppIamRoleBindingItem> {
    Ok(AppIamRoleBindingItem {
        id: string_cell(row, "id"),
        tenant_id: string_cell(row, "tenant_id"),
        role_id: string_cell(row, "role_id"),
        principal_kind: string_cell(row, "principal_kind"),
        principal_id: string_cell(row, "principal_id"),
        scope_kind: string_cell(row, "scope_kind"),
        scope_id: string_cell(row, "scope_id"),
        effect: string_cell(row, "effect"),
        condition_json: string_cell(row, "condition_json"),
        status: string_cell(row, "status"),
        created_at: string_cell(row, "created_at"),
        updated_at: string_cell(row, "updated_at"),
    })
}

async fn table_exists(pool: &PgPool, table_name: &str) -> RepositoryResult<bool> {
    let exists = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(1) FROM information_schema.tables WHERE table_schema = current_schema() AND table_name = $1",
    )
    .bind(table_name)
    .fetch_one(pool)
    .await
    .map_err(sql_error)?;
    Ok(exists > 0)
}

fn filter_organizations(
    items: Vec<AppIamOrganizationItem>,
    query: &AppIamDirectoryQuery,
) -> Vec<AppIamOrganizationItem> {
    let items = if let Some(organization_id) = non_empty(query.organization_id.as_deref()) {
        items
            .into_iter()
            .filter(|item| item.id == organization_id)
            .collect()
    } else {
        items
    };
    filter_by_text(items, query)
}

fn filter_memberships(
    items: Vec<AppIamOrganizationMembershipItem>,
    query: &AppIamDirectoryQuery,
) -> Vec<AppIamOrganizationMembershipItem> {
    if let Some(user_id) = non_empty(query.user_id.as_deref()) {
        return items
            .into_iter()
            .filter(|item| item.user_id == user_id)
            .collect();
    }
    items
}

fn filter_departments(
    items: Vec<AppIamDepartmentItem>,
    query: &AppIamDirectoryQuery,
) -> Vec<AppIamDepartmentItem> {
    filter_by_text(items, query)
}

fn filter_by_text<T>(items: Vec<T>, query: &AppIamDirectoryQuery) -> Vec<T>
where
    T: DirectorySearchText,
{
    let Some(q) = non_empty(query.q.as_deref()).map(|value| value.to_ascii_lowercase()) else {
        return items;
    };
    items
        .into_iter()
        .filter(|item| item.search_text().to_ascii_lowercase().contains(&q))
        .collect()
}

trait DirectorySearchText {
    fn search_text(&self) -> String;
}

impl DirectorySearchText for AppIamOrganizationItem {
    fn search_text(&self) -> String {
        format!("{} {} {}", self.id, self.code, self.name)
    }
}

impl DirectorySearchText for AppIamDepartmentItem {
    fn search_text(&self) -> String {
        format!("{} {} {}", self.id, self.code, self.name)
    }
}

fn build_organization_tree(items: Vec<AppIamOrganizationItem>) -> Vec<AppIamOrganizationTreeItem> {
    let ids = items
        .iter()
        .map(|item| item.id.clone())
        .collect::<BTreeSet<_>>();
    let roots = items
        .iter()
        .filter(|item| match item.parent_id.as_deref() {
            Some(parent_id) if !parent_id.is_empty() => !ids.contains(parent_id),
            _ => true,
        })
        .cloned()
        .collect::<Vec<_>>();
    roots
        .into_iter()
        .map(|item| organization_tree_node(item, &items))
        .collect()
}

fn organization_tree_node(
    item: AppIamOrganizationItem,
    items: &[AppIamOrganizationItem],
) -> AppIamOrganizationTreeItem {
    let children = items
        .iter()
        .filter(|candidate| candidate.parent_id.as_deref() == Some(item.id.as_str()))
        .cloned()
        .map(|child| organization_tree_node(child, items))
        .collect();
    AppIamOrganizationTreeItem {
        organization: item,
        children,
    }
}

fn build_department_tree(items: Vec<AppIamDepartmentItem>) -> Vec<AppIamDepartmentTreeItem> {
    let ids = items
        .iter()
        .map(|item| item.id.clone())
        .collect::<BTreeSet<_>>();
    let roots = items
        .iter()
        .filter(|item| match item.parent_department_id.as_deref() {
            Some(parent_id) if !parent_id.is_empty() => !ids.contains(parent_id),
            _ => true,
        })
        .cloned()
        .collect::<Vec<_>>();
    roots
        .into_iter()
        .map(|item| department_tree_node(item, &items))
        .collect()
}

fn department_tree_node(
    item: AppIamDepartmentItem,
    items: &[AppIamDepartmentItem],
) -> AppIamDepartmentTreeItem {
    let children = items
        .iter()
        .filter(|candidate| candidate.parent_department_id.as_deref() == Some(item.id.as_str()))
        .cloned()
        .map(|child| department_tree_node(child, items))
        .collect();
    AppIamDepartmentTreeItem {
        department: item,
        children,
    }
}

fn status_filter(query: &AppIamDirectoryQuery) -> String {
    non_empty(query.status.as_deref())
        .unwrap_or("active")
        .to_owned()
}

fn non_empty(value: Option<&str>) -> Option<&str> {
    value.map(str::trim).filter(|value| !value.is_empty())
}

fn require_subject(
    subject: Option<AppIamDirectorySubject>,
) -> RepositoryResult<AppIamDirectorySubject> {
    subject.ok_or_else(|| {
        RepositoryError::new("trusted request subject is required for app IAM directory")
    })
}

fn string_cell(row: &sqlx::postgres::PgRow, column: &str) -> String {
    row.try_get::<Option<String>, _>(column)
        .ok()
        .flatten()
        .unwrap_or_default()
}

fn option_string_cell(row: &sqlx::postgres::PgRow, column: &str) -> Option<String> {
    let value = string_cell(row, column);
    if value.is_empty() {
        None
    } else {
        Some(value)
    }
}

fn bool_cell(row: &sqlx::postgres::PgRow, column: &str) -> bool {
    row.try_get::<bool, _>(column)
        .ok()
        .or_else(|| row.try_get::<i32, _>(column).ok().map(|value| value != 0))
        .or_else(|| row.try_get::<i64, _>(column).ok().map(|value| value != 0))
        .unwrap_or(false)
}
