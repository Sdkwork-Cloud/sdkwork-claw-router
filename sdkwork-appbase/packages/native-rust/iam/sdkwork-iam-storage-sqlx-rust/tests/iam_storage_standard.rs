use sdkwork_iam_storage_sqlx::{
    iam_database_tables, iam_initial_migration_sql, IamBootstrapSubject, IamTables,
    DEFAULT_BOOTSTRAP_ADMIN_DISPLAY_NAME, DEFAULT_BOOTSTRAP_ADMIN_EMAIL,
    DEFAULT_BOOTSTRAP_ADMIN_USERNAME, DEFAULT_IAM_ORGANIZATION_CODE, DEFAULT_IAM_ORGANIZATION_ID,
    DEFAULT_IAM_ORGANIZATION_NAME, DEFAULT_IAM_ORGANIZATION_PATH, DEFAULT_IAM_TENANT_CODE,
    DEFAULT_IAM_TENANT_ID, DEFAULT_IAM_TENANT_NAME,
};

#[test]
fn exposes_complete_iam_table_catalog() {
    let tables = iam_database_tables();

    assert!(tables.contains(&"iam_tenant"));
    assert!(tables.contains(&"iam_organization"));
    assert!(tables.contains(&"iam_organization_closure"));
    assert!(tables.contains(&"iam_organization_membership"));
    assert!(tables.contains(&"iam_department"));
    assert!(tables.contains(&"iam_department_closure"));
    assert!(tables.contains(&"iam_department_assignment"));
    assert!(tables.contains(&"iam_position"));
    assert!(tables.contains(&"iam_position_assignment"));
    assert!(tables.contains(&"iam_role_binding"));
    assert!(tables.contains(&"iam_user"));
    assert!(tables.contains(&"iam_user_identity"));
    assert!(tables.contains(&"iam_credential"));
    assert!(tables.contains(&"iam_session"));
    assert!(tables.contains(&"iam_mfa_factor"));
    assert!(tables.contains(&"iam_device"));
    assert!(tables.contains(&"iam_role"));
    assert!(tables.contains(&"iam_permission"));
    assert!(tables.contains(&"iam_policy"));
    assert!(tables.contains(&"iam_role_permission"));
    assert!(tables.contains(&"iam_api_key"));
    assert!(tables.contains(&"iam_security_event"));
    assert!(tables.contains(&"iam_audit_event"));
    assert!(!tables.contains(&"iam_user_role"));

    for table in tables {
        assert!(table.starts_with("iam_"));
        assert!(!table.contains("__"));
        assert!(!table.starts_with("uc_"));
        assert_ne!(table, "iam_accounts");
        assert_ne!(table, "iam_department_member");
        assert_ne!(table, "iam_department_members");
        assert_ne!(table, "iam_organization_member");
        assert_ne!(table, "iam_user_role");
    }
}

#[test]
fn exposes_canonical_iam_table_constants() {
    assert_eq!("iam_tenant", IamTables::TENANT);
    assert_eq!("iam_organization", IamTables::ORGANIZATION);
    assert_eq!("iam_organization_closure", IamTables::ORGANIZATION_CLOSURE);
    assert_eq!(
        "iam_organization_membership",
        IamTables::ORGANIZATION_MEMBERSHIP
    );
    assert_eq!("iam_department", IamTables::DEPARTMENT);
    assert_eq!("iam_department_closure", IamTables::DEPARTMENT_CLOSURE);
    assert_eq!(
        "iam_department_assignment",
        IamTables::DEPARTMENT_ASSIGNMENT
    );
    assert_eq!("iam_position", IamTables::POSITION);
    assert_eq!("iam_position_assignment", IamTables::POSITION_ASSIGNMENT);
    assert_eq!("iam_role_binding", IamTables::ROLE_BINDING);
    assert_eq!("iam_user", IamTables::USER);
    assert_eq!("iam_user_identity", IamTables::USER_IDENTITY);
    assert_eq!("iam_credential", IamTables::CREDENTIAL);
}

#[test]
fn exposes_default_bootstrap_subject_contract() {
    assert_eq!("10", DEFAULT_IAM_TENANT_ID);
    assert_eq!("default", DEFAULT_IAM_TENANT_CODE);
    assert_eq!("Default Tenant", DEFAULT_IAM_TENANT_NAME);
    assert_eq!("20", DEFAULT_IAM_ORGANIZATION_ID);
    assert_eq!("root", DEFAULT_IAM_ORGANIZATION_CODE);
    assert_eq!("Root Organization", DEFAULT_IAM_ORGANIZATION_NAME);
    assert_eq!("/20", DEFAULT_IAM_ORGANIZATION_PATH);
    assert_eq!("admin", DEFAULT_BOOTSTRAP_ADMIN_USERNAME);
    assert_eq!("Administrator", DEFAULT_BOOTSTRAP_ADMIN_DISPLAY_NAME);
    assert_eq!("admin@sdkwork.com", DEFAULT_BOOTSTRAP_ADMIN_EMAIL);

    let subject = IamBootstrapSubject::default();
    assert_eq!(DEFAULT_IAM_TENANT_ID, subject.tenant_id);
    assert_eq!(DEFAULT_IAM_ORGANIZATION_ID, subject.organization_id);
    assert_eq!(DEFAULT_BOOTSTRAP_ADMIN_USERNAME, subject.admin_username);
}

#[test]
fn initial_migration_declares_context_and_audit_columns() {
    let sql = iam_initial_migration_sql();

    assert!(sql.contains("CREATE TABLE IF NOT EXISTS iam_session"));
    assert!(sql.contains("auth_token_hash"));
    assert!(sql.contains("access_token_hash"));
    assert!(sql.contains("tenant_id"));
    assert!(sql.contains("organization_id"));
    assert!(sql.contains("sharding_key"));
    assert!(sql.contains("permission_scope_json"));
    assert!(sql.contains("data_scope_json"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS iam_audit_event"));
}

#[test]
fn initial_migration_declares_mature_organization_hierarchy_and_membership_tables() {
    let sql = iam_initial_migration_sql();
    let organization_table =
        table_definition(sql, "iam_organization").expect("iam_organization table");
    let organization_closure_table =
        table_definition(sql, "iam_organization_closure").expect("iam_organization_closure table");
    let organization_membership_table = table_definition(sql, "iam_organization_membership")
        .expect("iam_organization_membership table");

    for column in [
        "parent_organization_id",
        "organization_kind",
        "tenant_boundary_kind",
        "data_boundary_kind",
        "app_boundary_enabled",
        "verification_status",
        "path",
        "status",
    ] {
        assert!(
            organization_table.contains(column),
            "iam_organization must declare mature organization column {column}",
        );
    }

    for column in [
        "ancestor_organization_id",
        "descendant_organization_id",
        "depth",
    ] {
        assert!(
            organization_closure_table.contains(column),
            "iam_organization_closure must declare hierarchy column {column}",
        );
    }

    for column in [
        "organization_id",
        "user_id",
        "membership_kind",
        "employee_no",
        "display_name",
        "status",
        "is_primary",
        "joined_at",
        "left_at",
        "remark",
    ] {
        assert!(
            organization_membership_table.contains(column),
            "iam_organization_membership must declare membership column {column}",
        );
    }

    assert!(
        table_definition(sql, "iam_organization_member").is_none(),
        "iam_organization_member must not remain as the canonical organization personnel table",
    );
}

#[test]
fn initial_migration_declares_department_position_and_role_binding_tables() {
    let sql = iam_initial_migration_sql();
    let department_table = table_definition(sql, "iam_department").expect("iam_department table");
    let department_closure_table =
        table_definition(sql, "iam_department_closure").expect("iam_department_closure table");
    let department_assignment_table = table_definition(sql, "iam_department_assignment")
        .expect("iam_department_assignment table");
    let position_table = table_definition(sql, "iam_position").expect("iam_position table");
    let position_assignment_table =
        table_definition(sql, "iam_position_assignment").expect("iam_position_assignment table");
    let role_binding_table =
        table_definition(sql, "iam_role_binding").expect("iam_role_binding table");

    for column in [
        "organization_id",
        "parent_department_id",
        "department_kind",
        "manager_membership_id",
        "path",
        "status",
    ] {
        assert!(
            department_table.contains(column),
            "iam_department must declare department column {column}",
        );
    }

    for column in [
        "organization_id",
        "ancestor_department_id",
        "descendant_department_id",
        "depth",
    ] {
        assert!(
            department_closure_table.contains(column),
            "iam_department_closure must declare hierarchy column {column}",
        );
    }

    for column in [
        "organization_id",
        "organization_membership_id",
        "department_id",
        "user_id",
        "assignment_kind",
        "is_primary",
        "effective_from",
        "effective_to",
        "status",
    ] {
        assert!(
            department_assignment_table.contains(column),
            "iam_department_assignment must declare assignment column {column}",
        );
    }

    for column in [
        "organization_id",
        "department_id",
        "position_kind",
        "rank_level",
        "status",
    ] {
        assert!(
            position_table.contains(column),
            "iam_position must declare position column {column}",
        );
    }

    for column in [
        "organization_id",
        "department_assignment_id",
        "position_id",
        "user_id",
        "is_primary",
        "effective_from",
        "effective_to",
        "status",
    ] {
        assert!(
            position_assignment_table.contains(column),
            "iam_position_assignment must declare assignment column {column}",
        );
    }

    for column in [
        "role_id",
        "principal_kind",
        "principal_id",
        "scope_kind",
        "scope_id",
        "effect",
        "condition_json",
        "status",
    ] {
        assert!(
            role_binding_table.contains(column),
            "iam_role_binding must declare scoped RBAC column {column}",
        );
    }
}

#[test]
fn initial_migration_declares_standard_query_indexes() {
    let sql = iam_initial_migration_sql();

    let required_indexes = [
        "idx_iam_organization_tenant_parent",
        "idx_iam_organization_closure_descendant",
        "idx_iam_organization_membership_tenant_user",
        "idx_iam_department_tenant_organization_parent",
        "idx_iam_department_closure_descendant",
        "idx_iam_department_assignment_tenant_user",
        "idx_iam_position_tenant_organization_department",
        "idx_iam_position_assignment_tenant_user",
        "idx_iam_role_binding_scope",
        "idx_iam_role_binding_principal",
        "idx_iam_user_tenant_status",
        "idx_iam_user_identity_tenant_user",
        "idx_iam_credential_tenant_user_type",
        "idx_iam_session_tenant_user",
        "idx_iam_session_auth_token_hash",
        "idx_iam_session_access_token_hash",
        "idx_iam_session_refresh_token_hash",
        "idx_iam_role_tenant_status",
        "idx_iam_role_permission_tenant_permission",
        "idx_iam_api_key_tenant_user_status",
        "idx_iam_security_event_tenant_created_at",
        "idx_iam_audit_event_tenant_created_at",
        "idx_iam_audit_event_request_id",
    ];

    for index_name in required_indexes {
        assert!(
            sql.contains(&format!("CREATE INDEX IF NOT EXISTS {index_name}")),
            "missing standard IAM migration index: {index_name}",
        );
    }

    assert!(
        table_definition(sql, "iam_user_role").is_none(),
        "iam_user_role must not remain because scoped iam_role_binding owns role assignment",
    );
    assert!(
        !sql.contains("idx_iam_user_role_tenant_user"),
        "iam_user_role indexes must not remain in the canonical IAM migration",
    );
}

fn table_definition<'a>(sql: &'a str, table_name: &str) -> Option<&'a str> {
    let marker = format!("CREATE TABLE IF NOT EXISTS {table_name} (");
    let start = sql.find(&marker)?;
    let after_start = &sql[start..];
    let end = after_start.find("\n);")?;
    Some(&after_start[..end])
}
