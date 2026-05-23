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
    assert!(tables.contains(&"iam_organization_member"));
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
    assert!(tables.contains(&"iam_user_role"));
    assert!(tables.contains(&"iam_api_key"));
    assert!(tables.contains(&"iam_security_event"));
    assert!(tables.contains(&"iam_audit_event"));

    for table in tables {
        assert!(table.starts_with("iam_"));
        assert!(!table.contains("__"));
        assert!(!table.starts_with("uc_"));
    }
}

#[test]
fn exposes_canonical_iam_table_constants() {
    assert_eq!("iam_tenant", IamTables::TENANT);
    assert_eq!("iam_organization", IamTables::ORGANIZATION);
    assert_eq!("iam_organization_member", IamTables::ORGANIZATION_MEMBER);
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
fn initial_migration_declares_standard_organization_member_lifecycle_columns() {
    let sql = iam_initial_migration_sql();
    let organization_member_table =
        table_definition(sql, "iam_organization_member").expect("iam_organization_member table");

    for column in [
        "organization_id",
        "user_id",
        "role_code",
        "status",
        "joined_at",
        "left_at",
        "remark",
    ] {
        assert!(
            organization_member_table.contains(column),
            "iam_organization_member must declare lifecycle column {column}",
        );
    }
}

#[test]
fn initial_migration_declares_standard_query_indexes() {
    let sql = iam_initial_migration_sql();

    let required_indexes = [
        "idx_iam_organization_tenant_parent",
        "idx_iam_organization_member_tenant_user",
        "idx_iam_user_tenant_status",
        "idx_iam_user_identity_tenant_user",
        "idx_iam_credential_tenant_user_type",
        "idx_iam_session_tenant_user",
        "idx_iam_session_auth_token_hash",
        "idx_iam_session_access_token_hash",
        "idx_iam_session_refresh_token_hash",
        "idx_iam_role_tenant_status",
        "idx_iam_role_permission_tenant_permission",
        "idx_iam_user_role_tenant_user",
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
}

fn table_definition<'a>(sql: &'a str, table_name: &str) -> Option<&'a str> {
    let marker = format!("CREATE TABLE IF NOT EXISTS {table_name}");
    let start = sql.find(&marker)?;
    let after_start = &sql[start..];
    let end = after_start.find("\n);")?;
    Some(&after_start[..end])
}
