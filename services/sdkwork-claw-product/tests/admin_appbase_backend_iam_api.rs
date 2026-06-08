mod common;

use std::sync::Arc;

use axum::body::Body;
use axum::http::{Request, StatusCode};
use common::InternalTrustedSubjectHeaders;
use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAppIamDirectoryReadStore;
use serde_json::Value;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::Row;
use tower::ServiceExt;

#[tokio::test]
async fn admin_appbase_backend_iam_directory_reads_sql_tables_without_demo_data() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    install_iam_tables(&pool).await;
    seed_iam_rows(&pool).await;

    let router =
        sdkwork_claw_product::api::admin_appbase_backend_iam_directory_router_with_read_store(
            Arc::new(SqliteAppIamDirectoryReadStore::new(pool.clone())),
            sdkwork_claw_product::api::AdminAppbaseBackendIamSqlReadStore::sqlite(pool.clone()),
        );

    let organizations_response = router
        .clone()
        .oneshot(signed_request("GET", "/backend/v3/api/iam/organizations"))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, organizations_response.status());
    let organizations_payload = json_payload(organizations_response).await;
    assert_eq!("2000", organizations_payload["code"]);
    assert_eq!("org-real", organizations_payload["data"]["items"][0]["id"]);
    assert_eq!(
        "Real Organization",
        organizations_payload["data"]["items"][0]["name"]
    );
    assert!(
        !organizations_payload.to_string().contains("org_demo"),
        "backend IAM adapter must not return appbase demo organizations"
    );

    let roles_response = router
        .clone()
        .oneshot(signed_request("GET", "/backend/v3/api/iam/roles"))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, roles_response.status());
    let roles_payload = json_payload(roles_response).await;
    assert_eq!("role-real", roles_payload["data"]["items"][0]["id"]);
    assert_eq!("ops.admin", roles_payload["data"]["items"][0]["code"]);

    let role_permissions_response = router
        .oneshot(signed_request(
            "GET",
            "/backend/v3/api/iam/roles/role-real/permissions",
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, role_permissions_response.status());
    let role_permissions_payload = json_payload(role_permissions_response).await;
    assert_eq!(
        "permission-real",
        role_permissions_payload["data"]["items"][0]["id"]
    );
    assert_eq!(
        "iam.users.read",
        role_permissions_payload["data"]["items"][0]["code"]
    );
}

#[tokio::test]
async fn admin_appbase_backend_iam_department_commands_write_sql_tables() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    install_iam_tables(&pool).await;
    seed_iam_rows(&pool).await;

    let router =
        sdkwork_claw_product::api::admin_appbase_backend_iam_directory_router_with_read_store(
            Arc::new(SqliteAppIamDirectoryReadStore::new(pool.clone())),
            sdkwork_claw_product::api::AdminAppbaseBackendIamSqlReadStore::sqlite(pool.clone()),
        );

    let create_response = router
        .clone()
        .oneshot(signed_json_request(
            "POST",
            "/backend/v3/api/iam/departments",
            r#"{"organizationId":"org-real","code":"engineering","name":"Engineering","departmentKind":"department","status":"active"}"#,
        ))
        .await
        .unwrap();
    let create_status = create_response.status();
    let create_payload = json_payload(create_response).await;
    assert_eq!(StatusCode::OK, create_status, "{create_payload}");
    assert_eq!("2000", create_payload["code"]);
    assert_eq!("Engineering", create_payload["data"]["item"]["name"]);
    assert_eq!("org-real", create_payload["data"]["item"]["organizationId"]);
    let department_id = create_payload["data"]["item"]["id"]
        .as_str()
        .expect("created department id should be returned")
        .to_owned();

    let stored_row = sqlx::query(
        r#"
        SELECT organization_id, code, name, status
        FROM iam_department
        WHERE id = ?1
        "#,
    )
    .bind(department_id.as_str())
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("org-real", stored_row.get::<String, _>("organization_id"));
    assert_eq!("engineering", stored_row.get::<String, _>("code"));
    assert_eq!("Engineering", stored_row.get::<String, _>("name"));
    assert_eq!("active", stored_row.get::<String, _>("status"));

    let list_response = router
        .clone()
        .oneshot(signed_request(
            "GET",
            "/backend/v3/api/iam/departments?organizationId=org-real",
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload = json_payload(list_response).await;
    assert!(
        list_payload["data"]["items"]
            .as_array()
            .unwrap()
            .iter()
            .any(|item| item["id"] == department_id),
        "created department should be returned by SQL-backed list"
    );

    let retrieve_response = router
        .clone()
        .oneshot(signed_request(
            "GET",
            &format!("/backend/v3/api/iam/departments/{department_id}"),
        ))
        .await
        .unwrap();
    let retrieve_status = retrieve_response.status();
    let retrieve_payload = json_payload(retrieve_response).await;
    assert_eq!(StatusCode::OK, retrieve_status, "{retrieve_payload}");
    assert_eq!(department_id, retrieve_payload["data"]["item"]["id"]);

    let update_response = router
        .clone()
        .oneshot(signed_json_request(
            "PATCH",
            &format!("/backend/v3/api/iam/departments/{department_id}"),
            r#"{"name":"Engineering Platform","status":"active","code":"eng-platform"}"#,
        ))
        .await
        .unwrap();
    let update_status = update_response.status();
    let update_payload = json_payload(update_response).await;
    assert_eq!(StatusCode::OK, update_status, "{update_payload}");
    assert_eq!(
        "Engineering Platform",
        update_payload["data"]["item"]["name"]
    );
    assert_eq!("eng-platform", update_payload["data"]["item"]["code"]);

    let delete_response = router
        .clone()
        .oneshot(signed_request(
            "DELETE",
            &format!("/backend/v3/api/iam/departments/{department_id}"),
        ))
        .await
        .unwrap();
    let delete_status = delete_response.status();
    let delete_payload = json_payload(delete_response).await;
    assert_eq!(StatusCode::OK, delete_status, "{delete_payload}");
    assert_eq!(true, delete_payload["data"]["deleted"]);

    let deleted_status = sqlx::query_scalar::<_, String>(
        r#"
        SELECT status
        FROM iam_department
        WHERE id = ?1
        "#,
    )
    .bind(department_id.as_str())
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("archived", deleted_status);
}

#[tokio::test]
async fn admin_appbase_backend_iam_organization_management_commands_do_not_return_501() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    install_iam_tables(&pool).await;
    seed_iam_rows(&pool).await;

    let router =
        sdkwork_claw_product::api::admin_appbase_backend_iam_directory_router_with_read_store(
            Arc::new(SqliteAppIamDirectoryReadStore::new(pool.clone())),
            sdkwork_claw_product::api::AdminAppbaseBackendIamSqlReadStore::sqlite(pool.clone()),
        );

    let create_org = request_json(
        router.clone(),
        signed_json_request(
            "POST",
            "/backend/v3/api/iam/organizations",
            r#"{"name":"Platform Operations","status":"active"}"#,
        ),
    )
    .await;
    assert_success(&create_org);
    let organization_id = string_at(&create_org, &["data", "item", "id"]);
    assert_eq!(
        "platform-operations", create_org["data"]["item"]["code"],
        "organization code should be generated from the submitted name when omitted"
    );

    let create_duplicate_named_org = request_json(
        router.clone(),
        signed_json_request(
            "POST",
            "/backend/v3/api/iam/organizations",
            r#"{"name":"Platform Operations","status":"active"}"#,
        ),
    )
    .await;
    assert_success(&create_duplicate_named_org);
    assert_eq!(
        "platform-operations-1",
        create_duplicate_named_org["data"]["item"]["code"],
        "generated organization code should get a deterministic suffix when the tenant already has that code"
    );

    assert_success(
        &request_json(
            router.clone(),
            signed_json_request(
                "PATCH",
                &format!("/backend/v3/api/iam/organizations/{organization_id}"),
                r#"{"name":"Platform Ops"}"#,
            ),
        )
        .await,
    );

    let create_membership = request_json(
        router.clone(),
        signed_json_request(
            "POST",
            "/backend/v3/api/iam/organization_memberships",
            &format!(
                r#"{{"organizationId":"{organization_id}","userId":"30","memberKind":"member","status":"active"}}"#
            ),
        ),
    )
    .await;
    assert_success(&create_membership);
    let membership_id = string_at(&create_membership, &["data", "item", "id"]);

    assert_success(
        &request_json(
            router.clone(),
            signed_json_request(
                "PATCH",
                &format!("/backend/v3/api/iam/organization_memberships/{membership_id}"),
                r#"{"status":"active"}"#,
            ),
        )
        .await,
    );

    let create_department = request_json(
        router.clone(),
        signed_json_request(
            "POST",
            "/backend/v3/api/iam/departments",
            &format!(
                r#"{{"organizationId":"{organization_id}","name":"Research Lab","status":"active"}}"#
            ),
        ),
    )
    .await;
    assert_success(&create_department);
    let department_id = string_at(&create_department, &["data", "item", "id"]);
    assert_eq!(
        "research-lab", create_department["data"]["item"]["code"],
        "department code should be generated from the submitted name when omitted"
    );

    let create_duplicate_named_department = request_json(
        router.clone(),
        signed_json_request(
            "POST",
            "/backend/v3/api/iam/departments",
            &format!(
                r#"{{"organizationId":"{organization_id}","name":"Research Lab","status":"active"}}"#
            ),
        ),
    )
    .await;
    assert_success(&create_duplicate_named_department);
    assert_eq!(
        "research-lab-1",
        create_duplicate_named_department["data"]["item"]["code"],
        "generated department code should get a deterministic suffix when the organization already has that code"
    );

    let create_department_assignment = request_json(
        router.clone(),
        signed_json_request(
            "POST",
            "/backend/v3/api/iam/department_assignments",
            &format!(
                r#"{{"departmentId":"{department_id}","membershipId":"{membership_id}","role":"member","status":"active","isPrimary":true}}"#
            ),
        ),
    )
    .await;
    assert_success(&create_department_assignment);
    let department_assignment_id =
        string_at(&create_department_assignment, &["data", "item", "id"]);

    assert_success(
        &request_json(
            router.clone(),
            signed_json_request(
                "PATCH",
                &format!("/backend/v3/api/iam/department_assignments/{department_assignment_id}"),
                r#"{"status":"inactive"}"#,
            ),
        )
        .await,
    );

    let create_position = request_json(
        router.clone(),
        signed_json_request(
            "POST",
            "/backend/v3/api/iam/positions",
            &format!(
                r#"{{"organizationId":"{organization_id}","departmentId":"{department_id}","code":"lead","name":"Lead","rankLevel":3,"status":"active"}}"#
            ),
        ),
    )
    .await;
    assert_success(&create_position);
    let position_id = string_at(&create_position, &["data", "item", "id"]);

    assert_success(
        &request_json(
            router.clone(),
            signed_json_request(
                "PATCH",
                &format!("/backend/v3/api/iam/positions/{position_id}"),
                r#"{"name":"Team Lead"}"#,
            ),
        )
        .await,
    );

    let create_position_assignment = request_json(
        router.clone(),
        signed_json_request(
            "POST",
            "/backend/v3/api/iam/position_assignments",
            &format!(
                r#"{{"positionId":"{position_id}","membershipId":"{department_assignment_id}","status":"active"}}"#
            ),
        ),
    )
    .await;
    assert_success(&create_position_assignment);
    let position_assignment_id = string_at(&create_position_assignment, &["data", "item", "id"]);

    assert_success(
        &request_json(
            router.clone(),
            signed_json_request(
                "PATCH",
                &format!("/backend/v3/api/iam/position_assignments/{position_assignment_id}"),
                r#"{"status":"inactive"}"#,
            ),
        )
        .await,
    );

    let create_role = request_json(
        router.clone(),
        signed_json_request(
            "POST",
            "/backend/v3/api/iam/roles",
            r#"{"code":"platform.admin","name":"Platform Admin","status":"active"}"#,
        ),
    )
    .await;
    assert_success(&create_role);
    let role_id = string_at(&create_role, &["data", "item", "id"]);

    let create_permission = request_json(
        router.clone(),
        signed_json_request(
            "POST",
            "/backend/v3/api/iam/permissions",
            r#"{"code":"platform.manage","name":"Manage Platform","resource":"platform","action":"manage","status":"active"}"#,
        ),
    )
    .await;
    assert_success(&create_permission);
    let permission_id = string_at(&create_permission, &["data", "item", "id"]);

    assert_success(
        &request_json(
            router.clone(),
            signed_json_request(
                "POST",
                &format!("/backend/v3/api/iam/roles/{role_id}/permissions"),
                &format!(r#"{{"permissionId":"{permission_id}"}}"#),
            ),
        )
        .await,
    );

    let create_role_binding = request_json(
        router.clone(),
        signed_json_request(
            "POST",
            "/backend/v3/api/iam/role_bindings",
            &format!(
                r#"{{"roleId":"{role_id}","principalKind":"organization_member","principalId":"{membership_id}","scopeKind":"organization","scopeId":"{organization_id}","status":"active"}}"#
            ),
        ),
    )
    .await;
    assert_success(&create_role_binding);
    let role_binding_id = string_at(&create_role_binding, &["data", "item", "id"]);

    assert_deleted(
        &request_json(
            router.clone(),
            signed_request(
                "DELETE",
                &format!("/backend/v3/api/iam/role_bindings/{role_binding_id}"),
            ),
        )
        .await,
    );
    assert_deleted(
        &request_json(
            router.clone(),
            signed_request(
                "DELETE",
                &format!("/backend/v3/api/iam/roles/{role_id}/permissions/{permission_id}"),
            ),
        )
        .await,
    );
    assert_deleted(
        &request_json(
            router.clone(),
            signed_request(
                "DELETE",
                &format!("/backend/v3/api/iam/positions/{position_id}"),
            ),
        )
        .await,
    );
    assert_deleted(
        &request_json(
            router.clone(),
            signed_request("DELETE", &format!("/backend/v3/api/iam/roles/{role_id}")),
        )
        .await,
    );
    assert_deleted(
        &request_json(
            router.clone(),
            signed_request(
                "DELETE",
                &format!("/backend/v3/api/iam/permissions/{permission_id}"),
            ),
        )
        .await,
    );
    assert_deleted(
        &request_json(
            router,
            signed_request(
                "DELETE",
                &format!("/backend/v3/api/iam/organizations/{organization_id}"),
            ),
        )
        .await,
    );
}

fn signed_request(method: &str, path: &str) -> Request<Body> {
    Request::builder()
        .method(method)
        .uri(path)
        .internal_trusted_subject(10, 20, 30)
        .body(Body::empty())
        .unwrap()
}

fn signed_json_request(method: &str, path: &str, body: impl Into<String>) -> Request<Body> {
    Request::builder()
        .method(method)
        .uri(path)
        .header("content-type", "application/json")
        .internal_trusted_subject(10, 20, 30)
        .body(Body::from(body.into()))
        .unwrap()
}

async fn json_payload(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

async fn request_json(router: axum::Router, request: Request<Body>) -> Value {
    let response = router.oneshot(request).await.unwrap();
    let status = response.status();
    let payload = json_payload(response).await;
    assert_eq!(
        StatusCode::OK,
        status,
        "backend IAM command should not return non-OK response: {payload}"
    );
    payload
}

fn assert_success(payload: &Value) {
    assert_eq!("2000", payload["code"], "{payload}");
}

fn assert_deleted(payload: &Value) {
    assert_success(payload);
    assert_eq!(true, payload["data"]["deleted"], "{payload}");
}

fn string_at(payload: &Value, path: &[&str]) -> String {
    let mut value = payload;
    for key in path {
        value = &value[*key];
    }
    value
        .as_str()
        .unwrap_or_else(|| panic!("expected string at {path:?}: {payload}"))
        .to_owned()
}

async fn install_iam_tables(pool: &sqlx::SqlitePool) {
    for statement in [
        r#"CREATE TABLE iam_organization (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            parent_id TEXT,
            code TEXT,
            name TEXT,
            path TEXT,
            status TEXT,
            created_at TEXT,
            updated_at TEXT
        )"#,
        r#"CREATE TABLE iam_organization_membership (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            membership_kind TEXT NOT NULL,
            employee_no TEXT,
            display_name TEXT,
            is_primary INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL,
            joined_at TEXT NOT NULL,
            left_at TEXT,
            remark TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE (tenant_id, organization_id, user_id, membership_kind)
        )"#,
        r#"CREATE TABLE iam_department (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT NOT NULL,
            parent_department_id TEXT,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            department_kind TEXT NOT NULL,
            path TEXT NOT NULL,
            cost_center_code TEXT,
            manager_membership_id TEXT,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE (tenant_id, organization_id, code)
        )"#,
        r#"CREATE TABLE iam_department_assignment (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT NOT NULL,
            organization_membership_id TEXT NOT NULL,
            department_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            assignment_kind TEXT NOT NULL,
            is_primary INTEGER NOT NULL DEFAULT 0,
            effective_from TEXT NOT NULL,
            effective_to TEXT,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE (tenant_id, organization_id, organization_membership_id, department_id, assignment_kind)
        )"#,
        r#"CREATE TABLE iam_position (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT NOT NULL,
            department_id TEXT,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            position_kind TEXT NOT NULL,
            rank_level INTEGER,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE (tenant_id, organization_id, code)
        )"#,
        r#"CREATE TABLE iam_position_assignment (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT NOT NULL,
            department_assignment_id TEXT NOT NULL,
            position_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            is_primary INTEGER NOT NULL DEFAULT 0,
            effective_from TEXT NOT NULL,
            effective_to TEXT,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE (tenant_id, organization_id, department_assignment_id, position_id)
        )"#,
        r#"CREATE TABLE iam_role (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )"#,
        r#"CREATE TABLE iam_permission (
            id TEXT PRIMARY KEY,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            resource TEXT NOT NULL,
            action TEXT NOT NULL,
            created_at TEXT NOT NULL
        )"#,
        r#"CREATE TABLE iam_role_permission (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            role_id TEXT NOT NULL,
            permission_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            UNIQUE (tenant_id, role_id, permission_id)
        )"#,
        r#"CREATE TABLE iam_role_binding (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            role_id TEXT NOT NULL,
            principal_kind TEXT NOT NULL,
            principal_id TEXT NOT NULL,
            scope_kind TEXT NOT NULL,
            scope_id TEXT NOT NULL,
            effect TEXT NOT NULL,
            condition_json TEXT,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE (tenant_id, role_id, principal_kind, principal_id, scope_kind, scope_id)
        )"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_iam_rows(pool: &sqlx::SqlitePool) {
    for statement in [
        r#"INSERT INTO iam_organization
            (id, tenant_id, parent_id, code, name, path, status, created_at, updated_at)
            VALUES ('org-real', '10', NULL, 'real-org', 'Real Organization', '/org-real', 'active', '2026-06-01 00:00:00', '2026-06-02 00:00:00')"#,
        r#"INSERT INTO iam_organization_membership
            (id, tenant_id, organization_id, user_id, membership_kind, display_name, is_primary, status, joined_at, created_at, updated_at)
            VALUES ('member-real', '10', 'org-real', '30', 'admin', 'Admin User', 1, 'active', '2026-06-01 00:00:00', '2026-06-01 00:00:00', '2026-06-02 00:00:00')"#,
        r#"INSERT INTO iam_role
            (id, tenant_id, code, name, status, created_at, updated_at)
            VALUES ('role-real', '10', 'ops.admin', 'Ops Admin', 'active', '2026-06-01 00:00:00', '2026-06-02 00:00:00')"#,
        r#"INSERT INTO iam_permission
            (id, code, name, resource, action, created_at)
            VALUES ('permission-real', 'iam.users.read', 'Read IAM Users', 'iam.users', 'read', '2026-06-01 00:00:00')"#,
        r#"INSERT INTO iam_role_permission
            (id, tenant_id, role_id, permission_id, created_at)
            VALUES ('role-permission-real', '10', 'role-real', 'permission-real', '2026-06-01 00:00:00')"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}
