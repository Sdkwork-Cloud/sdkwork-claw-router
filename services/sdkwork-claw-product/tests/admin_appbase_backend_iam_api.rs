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

const ADMIN_APPBASE_BACKEND_IAM_SOURCE: &str =
    include_str!("../src/api/admin_appbase_backend_iam.rs");
const ADMIN_APPBASE_BACKEND_IAM_OAUTH_SOURCE: &str =
    include_str!("../src/api/admin_appbase_backend_iam_oauth.rs");
const SQLITE_APP_IAM_DIRECTORY_READ_STORE_SOURCE: &str =
    include_str!("../src/infrastructure/sql/sqlite/app_iam_directory_read_store.rs");
const POSTGRES_APP_IAM_DIRECTORY_READ_STORE_SOURCE: &str =
    include_str!("../src/infrastructure/sql/postgres/app_iam_directory_read_store.rs");
const APP_IAM_DIRECTORY_PORT_SOURCE: &str =
    include_str!("../src/ports/app_iam_directory_read_store.rs");

#[test]
fn app_iam_directory_port_query_keeps_one_canonical_field_per_semantic() {
    assert!(
        APP_IAM_DIRECTORY_PORT_SOURCE.contains("pub struct AppIamDirectoryQuery"),
        "IAM directory port query should remain the internal read-store contract"
    );
    assert!(
        !APP_IAM_DIRECTORY_PORT_SOURCE.contains("alias ="),
        "HTTP compatibility aliases must stay at API parsing boundaries, not in the read-store port DTO"
    );
}

#[test]
fn admin_appbase_backend_iam_postgres_department_commands_cast_audit_timestamps() {
    assert!(
        ADMIN_APPBASE_BACKEND_IAM_SOURCE.contains(
            "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::timestamptz, $13::timestamptz)"
        ),
        "Postgres department create must cast string audit values to TIMESTAMPTZ"
    );
    assert!(
        ADMIN_APPBASE_BACKEND_IAM_SOURCE.contains("updated_at = $9::timestamptz"),
        "Postgres department update must cast string audit values to TIMESTAMPTZ"
    );
    assert!(
        ADMIN_APPBASE_BACKEND_IAM_SOURCE.contains("updated_at = $1::timestamptz"),
        "Postgres department delete must cast string audit values to TIMESTAMPTZ"
    );
}

#[test]
fn admin_appbase_backend_iam_position_create_uses_unique_code_generation() {
    assert!(
        ADMIN_APPBASE_BACKEND_IAM_SOURCE.contains("unique_sqlite_position_code("),
        "SQLite position create must generate a unique code before insert"
    );
    assert!(
        ADMIN_APPBASE_BACKEND_IAM_SOURCE.contains("unique_postgres_position_code("),
        "Postgres position create must generate a unique code before insert"
    );
    assert!(
        ADMIN_APPBASE_BACKEND_IAM_SOURCE
            .contains("unique_sqlite_code(\n        pool,\n        \"iam_position\","),
        "SQLite position code uniqueness must target iam_position"
    );
    assert!(
        ADMIN_APPBASE_BACKEND_IAM_SOURCE
            .contains("unique_postgres_code(\n        pool,\n        \"iam_position\","),
        "Postgres position code uniqueness must target iam_position"
    );
}

#[test]
fn admin_appbase_backend_iam_position_assignments_filter_by_department() {
    for (store_name, source) in [
        ("SQLite", SQLITE_APP_IAM_DIRECTORY_READ_STORE_SOURCE),
        ("Postgres", POSTGRES_APP_IAM_DIRECTORY_READ_STORE_SOURCE),
    ] {
        assert!(
            source.contains("FROM iam_position_assignment a\nJOIN iam_position p"),
            "{store_name} position assignment list must join iam_position before filtering by department"
        );
        assert!(
            source.contains("CAST(p.department_id AS TEXT)"),
            "{store_name} position assignment list must filter departmentId through iam_position.department_id"
        );
    }
}

#[test]
fn admin_appbase_backend_iam_oauth_declares_real_sql_backed_resources() {
    for expected in [
        "iam_oauth_provider_catalog",
        "iam_oauth_flow_config",
        "iam_oauth_resource_account",
        "iam_oauth_webhook_config",
        "iam_oauth_diagnostic_run",
    ] {
        assert!(
            ADMIN_APPBASE_BACKEND_IAM_OAUTH_SOURCE.contains(expected),
            "OAuth backend adapter must map {expected} to a real appbase IAM OAuth SQL table"
        );
    }
    assert!(
        !ADMIN_APPBASE_BACKEND_IAM_OAUTH_SOURCE.contains("demo")
            && !ADMIN_APPBASE_BACKEND_IAM_OAUTH_SOURCE.contains("fixture"),
        "OAuth backend adapter must not use demo or fixture rows"
    );
}

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
async fn admin_appbase_backend_iam_oauth_reads_and_writes_sql_tables_without_demo_data() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    install_iam_oauth_tables(&pool).await;
    seed_iam_oauth_rows(&pool).await;

    let router = sdkwork_claw_product::api::admin_appbase_backend_iam_oauth_router_with_read_store(
        sdkwork_claw_product::api::AdminAppbaseBackendIamSqlReadStore::sqlite(pool.clone()),
    );

    let provider_catalog = request_json(
        router.clone(),
        signed_request("GET", "/backend/v3/api/iam/oauth/provider_catalog"),
    )
    .await;
    assert_success(&provider_catalog);
    assert_eq!(
        "wechat_mp",
        provider_catalog["data"]["items"][0]["providerCode"]
    );
    assert!(
        !provider_catalog.to_string().contains("demo"),
        "OAuth provider catalog must come from SQL rows, not hard-coded demo data"
    );

    let flow_configs = request_json(
        router.clone(),
        signed_request("GET", "/backend/v3/api/iam/oauth/flow_configs"),
    )
    .await;
    assert_success(&flow_configs);
    assert_eq!(
        "flow-real",
        flow_configs["data"]["items"][0]["flowConfigId"]
    );
    assert_eq!("mini_program", flow_configs["data"]["items"][0]["surface"]);

    let resource_accounts = request_json(
        router.clone(),
        signed_request(
            "GET",
            "/backend/v3/api/iam/oauth/resource_accounts?resource_account_kind=mini_program",
        ),
    )
    .await;
    assert_success(&resource_accounts);
    assert_eq!(
        "resource-account-real",
        resource_accounts["data"]["items"][0]["resourceAccountId"]
    );
    assert_eq!(
        "self_managed",
        resource_accounts["data"]["items"][0]["ownerMode"]
    );

    let create_integration = request_json(
        router.clone(),
        signed_json_request(
            "POST",
            "/backend/v3/api/iam/oauth/integrations",
            r#"{"providerCode":"wechat_mp","providerCatalogId":"provider-real","integrationCode":"wechat-prod","displayName":"WeChat Production","environment":"production","deploymentMode":"web","regionGroup":"china","protocolFamily":"oauth2","status":"active","enabled":true}"#,
        ),
    )
    .await;
    assert_success(&create_integration);
    let integration_id = string_at(&create_integration, &["data", "item", "id"]);

    let update_integration = request_json(
        router.clone(),
        signed_json_request(
            "PATCH",
            &format!("/backend/v3/api/iam/oauth/integrations/{integration_id}"),
            r#"{"displayName":"WeChat Production Updated","enabled":false}"#,
        ),
    )
    .await;
    assert_success(&update_integration);
    assert_eq!(
        "WeChat Production Updated",
        update_integration["data"]["item"]["displayName"]
    );
    assert_eq!(false, update_integration["data"]["item"]["enabled"]);

    let diagnostic = request_json(
        router.clone(),
        signed_json_request(
            "POST",
            "/backend/v3/api/iam/oauth/diagnostic_runs",
            r#"{"providerCode":"wechat_mp","targetType":"resource_account","targetId":"resource-account-real","runKind":"connectivity"}"#,
        ),
    )
    .await;
    assert_success(&diagnostic);
    assert_eq!("queued", diagnostic["data"]["item"]["status"]);
    assert_eq!(
        "resource_account",
        diagnostic["data"]["item"]["targetType"],
        "diagnostic create should record the requested real target without claiming provider success"
    );

    let delete_integration = request_json(
        router,
        signed_request(
            "DELETE",
            &format!("/backend/v3/api/iam/oauth/integrations/{integration_id}"),
        ),
    )
    .await;
    assert_deleted(&delete_integration);
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
            "/backend/v3/api/iam/departments?organization_id=org-real",
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

    let list_after_org_create = request_json(
        router.clone(),
        signed_request("GET", "/backend/v3/api/iam/organizations"),
    )
    .await;
    assert_success(&list_after_org_create);
    assert!(
        list_after_org_create["data"]["items"]
            .as_array()
            .unwrap()
            .iter()
            .any(|item| item["id"] == organization_id),
        "created organization should be visible to the creator through the SQL-backed list"
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

    let create_duplicate_coded_org = request_json(
        router.clone(),
        signed_json_request(
            "POST",
            "/backend/v3/api/iam/organizations",
            r#"{"name":"Platform Operations Copy","code":"platform-operations","status":"active"}"#,
        ),
    )
    .await;
    assert_success(&create_duplicate_coded_org);
    assert_eq!(
        "platform-operations-2", create_duplicate_coded_org["data"]["item"]["code"],
        "submitted organization code should also use the unique code generator on create"
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

    let list_after_department_create = request_json(
        router.clone(),
        signed_request(
            "GET",
            &format!("/backend/v3/api/iam/departments?organization_id={organization_id}"),
        ),
    )
    .await;
    assert_success(&list_after_department_create);
    assert!(
        list_after_department_create["data"]["items"]
            .as_array()
            .unwrap()
            .iter()
            .any(|item| item["id"] == department_id),
        "created department should be visible through the SQL-backed list"
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

    let create_duplicate_coded_department = request_json(
        router.clone(),
        signed_json_request(
            "POST",
            "/backend/v3/api/iam/departments",
            &format!(
                r#"{{"organizationId":"{organization_id}","name":"Research Lab Copy","code":"research-lab","status":"active"}}"#
            ),
        ),
    )
    .await;
    assert_success(&create_duplicate_coded_department);
    assert_eq!(
        "research-lab-2", create_duplicate_coded_department["data"]["item"]["code"],
        "submitted department code should also use the unique code generator on create"
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
    assert_eq!("lead", create_position["data"]["item"]["code"]);

    let create_duplicate_named_position = request_json(
        router.clone(),
        signed_json_request(
            "POST",
            "/backend/v3/api/iam/positions",
            &format!(
                r#"{{"organizationId":"{organization_id}","departmentId":"{department_id}","name":"Lead","rankLevel":2,"status":"active"}}"#
            ),
        ),
    )
    .await;
    assert_success(&create_duplicate_named_position);
    assert_eq!(
        "lead-1",
        create_duplicate_named_position["data"]["item"]["code"],
        "generated position code should get a deterministic suffix when the organization already has that code"
    );

    let create_duplicate_coded_position = request_json(
        router.clone(),
        signed_json_request(
            "POST",
            "/backend/v3/api/iam/positions",
            &format!(
                r#"{{"organizationId":"{organization_id}","departmentId":"{department_id}","code":"lead","name":"Lead Copy","rankLevel":1,"status":"active"}}"#
            ),
        ),
    )
    .await;
    assert_success(&create_duplicate_coded_position);
    assert_eq!(
        "lead-2", create_duplicate_coded_position["data"]["item"]["code"],
        "submitted position code should also use the unique code generator on create"
    );

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

    let list_position_assignments_after_create = request_json(
        router.clone(),
        signed_request(
            "GET",
            &format!(
                "/backend/v3/api/iam/position_assignments?organization_id={organization_id}&department_id={department_id}"
            ),
        ),
    )
    .await;
    assert_success(&list_position_assignments_after_create);
    assert!(
        list_position_assignments_after_create["data"]["items"]
            .as_array()
            .unwrap()
            .iter()
            .any(|item| item["id"] == position_assignment_id),
        "created position assignment should be visible when filtering by organization and department"
    );

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

async fn install_iam_oauth_tables(pool: &sqlx::SqlitePool) {
    for statement in [
        r#"CREATE TABLE iam_oauth_provider_catalog (
            id TEXT PRIMARY KEY,
            uuid TEXT NOT NULL,
            owner_tenant_id TEXT NOT NULL DEFAULT '0',
            provider_code TEXT NOT NULL,
            provider_family TEXT NOT NULL,
            provider_name TEXT NOT NULL,
            provider_display_name TEXT NOT NULL,
            region_group TEXT NOT NULL,
            protocol_family TEXT NOT NULL,
            issuer TEXT,
            authorization_endpoint TEXT,
            token_endpoint TEXT,
            userinfo_endpoint TEXT,
            jwks_uri TEXT,
            discovery_url TEXT,
            revocation_endpoint TEXT,
            introspection_endpoint TEXT,
            device_authorization_endpoint TEXT,
            default_scopes_json TEXT NOT NULL DEFAULT '[]',
            required_scopes_json TEXT NOT NULL DEFAULT '[]',
            supported_surface_kinds_json TEXT NOT NULL DEFAULT '[]',
            supported_flow_kinds_json TEXT NOT NULL DEFAULT '[]',
            supported_capabilities_json TEXT NOT NULL DEFAULT '[]',
            supported_resource_account_kinds_json TEXT NOT NULL DEFAULT '[]',
            supported_access_modes_json TEXT NOT NULL DEFAULT '[]',
            supports_pkce INTEGER NOT NULL DEFAULT 0,
            supports_nonce INTEGER NOT NULL DEFAULT 0,
            supports_state INTEGER NOT NULL DEFAULT 1,
            supports_refresh_token INTEGER NOT NULL DEFAULT 0,
            supports_id_token INTEGER NOT NULL DEFAULT 0,
            supports_userinfo INTEGER NOT NULL DEFAULT 0,
            supports_revocation INTEGER NOT NULL DEFAULT 0,
            supports_introspection INTEGER NOT NULL DEFAULT 0,
            supports_device_code INTEGER NOT NULL DEFAULT 0,
            supports_union_id INTEGER NOT NULL DEFAULT 0,
            client_auth_methods_json TEXT NOT NULL DEFAULT '[]',
            provider_client_field_schema_json TEXT NOT NULL DEFAULT '{}',
            provider_surface_field_schema_json TEXT NOT NULL DEFAULT '{}',
            provider_secret_field_schema_json TEXT NOT NULL DEFAULT '{}',
            provider_flow_field_schema_json TEXT NOT NULL DEFAULT '{}',
            provider_resource_account_field_schema_json TEXT NOT NULL DEFAULT '{}',
            provider_operator_platform_field_schema_json TEXT NOT NULL DEFAULT '{}',
            provider_webhook_field_schema_json TEXT NOT NULL DEFAULT '{}',
            provider_operational_resource_schema_json TEXT NOT NULL DEFAULT '{}',
            claim_schema_json TEXT NOT NULL DEFAULT '{}',
            diagnostic_schema_json TEXT NOT NULL DEFAULT '{}',
            documentation_url TEXT,
            status TEXT NOT NULL,
            sort_order INTEGER NOT NULL DEFAULT 0,
            catalog_version INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            version INTEGER NOT NULL DEFAULT 1
        )"#,
        r#"CREATE TABLE iam_oauth_integration (
            id TEXT PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id TEXT NOT NULL,
            organization_id TEXT NOT NULL DEFAULT '0',
            app_id TEXT NOT NULL DEFAULT '0',
            environment TEXT NOT NULL,
            deployment_mode TEXT NOT NULL,
            provider_code TEXT NOT NULL,
            provider_catalog_id TEXT NOT NULL,
            integration_code TEXT NOT NULL,
            display_name TEXT NOT NULL,
            purpose_json TEXT NOT NULL DEFAULT '[]',
            capability_json TEXT NOT NULL DEFAULT '[]',
            region_group TEXT NOT NULL,
            protocol_family TEXT NOT NULL,
            account_operation_enabled INTEGER NOT NULL DEFAULT 0,
            operator_authorization_enabled INTEGER NOT NULL DEFAULT 0,
            default_surface_id TEXT,
            default_policy_id TEXT,
            enabled INTEGER NOT NULL DEFAULT 0,
            health_status TEXT NOT NULL,
            last_diagnostic_run_id TEXT,
            last_validated_at TEXT,
            status TEXT NOT NULL,
            created_by TEXT,
            updated_by TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            version INTEGER NOT NULL DEFAULT 1
        )"#,
        r#"CREATE TABLE iam_oauth_flow_config (
            id TEXT PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id TEXT NOT NULL,
            organization_id TEXT NOT NULL DEFAULT '0',
            integration_id TEXT NOT NULL,
            oauth_client_id TEXT NOT NULL,
            surface_id TEXT,
            flow_kind TEXT NOT NULL,
            flow_purpose TEXT NOT NULL,
            scope_profile_id TEXT,
            requires_pkce INTEGER NOT NULL DEFAULT 0,
            requires_nonce INTEGER NOT NULL DEFAULT 0,
            requires_state INTEGER NOT NULL DEFAULT 1,
            requires_user_consent INTEGER NOT NULL DEFAULT 0,
            allowed_response_types_json TEXT NOT NULL DEFAULT '[]',
            allowed_grant_types_json TEXT NOT NULL DEFAULT '[]',
            token_endpoint_auth_method TEXT,
            provider_code_exchange_endpoint_override TEXT,
            mini_program_code_ttl_seconds INTEGER,
            mini_program_phone_authorization_enabled INTEGER NOT NULL DEFAULT 0,
            mini_program_profile_authorization_enabled INTEGER NOT NULL DEFAULT 0,
            provider_session_key_retention_policy TEXT NOT NULL DEFAULT 'none',
            flow_config_json TEXT NOT NULL DEFAULT '{}',
            enabled INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            version INTEGER NOT NULL DEFAULT 1
        )"#,
        r#"CREATE TABLE iam_oauth_resource_account (
            id TEXT PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id TEXT NOT NULL,
            organization_id TEXT NOT NULL DEFAULT '0',
            integration_id TEXT NOT NULL,
            oauth_client_id TEXT,
            operator_platform_id TEXT,
            provider_code TEXT NOT NULL,
            resource_account_code TEXT NOT NULL,
            resource_account_kind TEXT NOT NULL,
            access_mode TEXT NOT NULL,
            display_name TEXT NOT NULL,
            provider_account_id TEXT NOT NULL,
            provider_account_original_id TEXT,
            provider_union_scope_id TEXT,
            provider_account_type TEXT,
            provider_account_region TEXT,
            subject_name_snapshot TEXT,
            principal_name_snapshot TEXT,
            service_category TEXT,
            verification_status TEXT NOT NULL,
            authorization_status TEXT NOT NULL,
            capability_json TEXT NOT NULL DEFAULT '[]',
            self_managed_config_status TEXT NOT NULL,
            operator_authorization_status TEXT NOT NULL,
            webhook_verify_status TEXT NOT NULL,
            domain_verify_status TEXT NOT NULL,
            default_web_oauth_surface_id TEXT,
            default_mini_program_surface_id TEXT,
            default_login_entry_resource_id TEXT,
            qr_default_enabled INTEGER NOT NULL DEFAULT 0,
            last_authorized_at TEXT,
            last_authorization_refreshed_at TEXT,
            last_verified_at TEXT,
            provider_config_json TEXT NOT NULL DEFAULT '{}',
            enabled INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL,
            created_by TEXT,
            updated_by TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            version INTEGER NOT NULL DEFAULT 1
        )"#,
        r#"CREATE TABLE iam_oauth_webhook_config (
            id TEXT PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id TEXT NOT NULL,
            organization_id TEXT NOT NULL DEFAULT '0',
            integration_id TEXT NOT NULL,
            resource_account_id TEXT,
            operator_platform_id TEXT,
            provider_code TEXT NOT NULL,
            webhook_code TEXT NOT NULL,
            webhook_kind TEXT NOT NULL,
            callback_url TEXT NOT NULL,
            callback_url_hash TEXT NOT NULL,
            callback_public_id TEXT NOT NULL,
            callback_path_token_hash TEXT,
            verification_token_status TEXT NOT NULL,
            encoding_aes_key_status TEXT NOT NULL,
            encryption_mode TEXT NOT NULL,
            signature_algorithm TEXT,
            allowed_event_types_json TEXT NOT NULL DEFAULT '[]',
            message_handling_mode TEXT NOT NULL,
            forward_target_ref TEXT,
            last_verified_at TEXT,
            last_verify_error_code TEXT,
            last_event_at TEXT,
            last_event_id TEXT,
            provider_config_json TEXT NOT NULL DEFAULT '{}',
            enabled INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL,
            created_by TEXT,
            updated_by TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            version INTEGER NOT NULL DEFAULT 1
        )"#,
        r#"CREATE TABLE iam_oauth_diagnostic_run (
            id TEXT PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id TEXT NOT NULL,
            organization_id TEXT NOT NULL DEFAULT '0',
            integration_id TEXT,
            oauth_client_id TEXT,
            surface_id TEXT,
            provider_code TEXT NOT NULL,
            run_kind TEXT NOT NULL,
            status TEXT NOT NULL,
            started_at TEXT,
            finished_at TEXT,
            duration_ms INTEGER,
            operator_user_id TEXT,
            request_id TEXT,
            result_code TEXT,
            result_summary TEXT,
            redacted_result_json TEXT NOT NULL DEFAULT '{}',
            created_at TEXT NOT NULL
        )"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_iam_oauth_rows(pool: &sqlx::SqlitePool) {
    for statement in [
        r#"INSERT INTO iam_oauth_provider_catalog
            (id, uuid, owner_tenant_id, provider_code, provider_family, provider_name, provider_display_name, region_group, protocol_family, supported_surface_kinds_json, supported_resource_account_kinds_json, supported_access_modes_json, supports_pkce, supports_state, status, sort_order, created_at, updated_at)
            VALUES ('provider-real', 'provider-real', '0', 'wechat_mp', 'mini_program', 'WeChat Mini Program', 'WeChat Mini Program', 'china', 'oauth2', '["mini_program"]', '["mini_program"]', '["self_managed"]', 0, 1, 'active', 1, '2026-06-01 00:00:00', '2026-06-02 00:00:00')"#,
        r#"INSERT INTO iam_oauth_integration
            (id, uuid, tenant_id, organization_id, app_id, environment, deployment_mode, provider_code, provider_catalog_id, integration_code, display_name, region_group, protocol_family, health_status, status, created_at, updated_at)
            VALUES ('integration-real', 'integration-real', '10', '20', '0', 'production', 'web', 'wechat_mp', 'provider-real', 'wechat-real', 'WeChat Real', 'china', 'oauth2', 'healthy', 'active', '2026-06-01 00:00:00', '2026-06-02 00:00:00')"#,
        r#"INSERT INTO iam_oauth_flow_config
            (id, uuid, tenant_id, organization_id, integration_id, oauth_client_id, surface_id, flow_kind, flow_purpose, requires_state, allowed_response_types_json, allowed_grant_types_json, enabled, status, created_at, updated_at)
            VALUES ('flow-real', 'flow-real', '10', '20', 'integration-real', 'client-real', 'surface-real', 'mini_program', 'login', 1, '["code"]', '["authorization_code"]', 1, 'active', '2026-06-01 00:00:00', '2026-06-02 00:00:00')"#,
        r#"INSERT INTO iam_oauth_resource_account
            (id, uuid, tenant_id, organization_id, integration_id, oauth_client_id, provider_code, resource_account_code, resource_account_kind, access_mode, display_name, provider_account_id, verification_status, authorization_status, self_managed_config_status, operator_authorization_status, webhook_verify_status, domain_verify_status, enabled, status, created_at, updated_at)
            VALUES ('resource-account-real', 'resource-account-real', '10', '20', 'integration-real', 'client-real', 'wechat_mp', 'mini-real', 'mini_program', 'self_managed', 'Mini Program Real', 'wx-real', 'verified', 'authorized', 'configured', 'not_required', 'verified', 'verified', 1, 'active', '2026-06-01 00:00:00', '2026-06-02 00:00:00')"#,
        r#"INSERT INTO iam_oauth_webhook_config
            (id, uuid, tenant_id, organization_id, integration_id, resource_account_id, provider_code, webhook_code, webhook_kind, callback_url, callback_url_hash, callback_public_id, verification_token_status, encoding_aes_key_status, encryption_mode, allowed_event_types_json, message_handling_mode, enabled, status, created_at, updated_at)
            VALUES ('webhook-real', 'webhook-real', '10', '20', 'integration-real', 'resource-account-real', 'wechat_mp', 'events', 'message', 'https://example.test/oauth/callback', 'hash-real', 'public-real', 'configured', 'configured', 'none', '["message"]', 'store', 1, 'active', '2026-06-01 00:00:00', '2026-06-02 00:00:00')"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}
