use sdkwork_user_center_native::{
    create_default_user_center_runtime_config, create_user_center_auth_profile,
    create_user_center_integration_profiles, create_user_center_local_api_routes,
    create_user_center_storage_plan, ensure_sqlite_user_center_bootstrap_user,
    ensure_sqlite_user_center_schema, is_user_center_upstream_integration_active,
    UserCenterProviderConfig, USER_CENTER_DEFAULT_LOCAL_API_BASE_PATH,
    USER_CENTER_DEFAULT_SQLITE_FILENAME, USER_CENTER_TABLE_PREFIX,
};

#[test]
fn creates_the_canonical_default_runtime_config() {
    let config = create_default_user_center_runtime_config("sdkwork-router-portal");

    assert_eq!(USER_CENTER_DEFAULT_SQLITE_FILENAME, "user-center.db");
    assert_eq!(USER_CENTER_TABLE_PREFIX, "iam_");
    assert_eq!(config.namespace, "sdkwork-router-portal");
    assert_eq!(config.mode, "local-native");
    assert_eq!(config.provider.kind, "local");
    assert_eq!(config.provider.provider_key, "sdkwork-router-portal-local");
    assert_eq!(config.integration.active_kind, "builtin-local");
    assert_eq!(
        config.integration.builtin_local.user_system_scope,
        "application"
    );
    assert!(!config.integration.external_app_api.enabled);
    assert_eq!(
        config.storage_topology.database_key,
        "sdkwork-router-portal-user-center"
    );
    assert_eq!(config.storage_topology.table_prefix, "iam_");
    assert_eq!(
        config.storage_topology.entity_bindings[0].standard_entity_name,
        "IamUser"
    );
    assert_eq!(
        config.storage_topology.entity_bindings[0].table_name,
        "iam_user"
    );
    assert_eq!(
        config.storage_plan.session_token_key,
        "sdkwork-router-portal.user-center.session-token"
    );
    assert_eq!(config.local_api.profile, "/app/v3/api/iam/users/current");
}

#[test]
fn creates_the_canonical_local_api_routes() {
    let routes = create_user_center_local_api_routes(Some("/app/v3/api"));

    assert_eq!(USER_CENTER_DEFAULT_LOCAL_API_BASE_PATH, "/app/v3/api");
    assert_eq!(routes.auth_config, "/app/v3/api/auth/config");
    assert_eq!(routes.auth_login, "/app/v3/api/auth/sessions");
    assert_eq!(routes.auth_email_login, "/app/v3/api/auth/sessions");
    assert_eq!(routes.auth_phone_login, "/app/v3/api/auth/sessions");
    assert_eq!(routes.auth_register, "/app/v3/api/auth/registrations");
    assert_eq!(routes.auth_refresh, "/app/v3/api/auth/sessions/refresh");
    assert_eq!(routes.auth_logout, "/app/v3/api/auth/sessions/current");
    assert_eq!(
        routes.auth_qr_confirm,
        "/app/v3/api/open_platform/qr_auth/sessions/:sessionKey/passwords"
    );
    assert_eq!(
        routes.auth_qr_generate,
        "/app/v3/api/open_platform/qr_auth/sessions"
    );
    assert_eq!(
        routes.auth_qr_status_pattern,
        "/app/v3/api/open_platform/qr_auth/sessions/:sessionKey"
    );
    assert_eq!(
        routes.auth_qr_entry_pattern,
        "/app/v3/api/open_platform/qr_auth/sessions/:sessionKey/scans"
    );
    assert_eq!(
        routes.auth_verify_send,
        "/app/v3/api/auth/verification_codes"
    );
    assert_eq!(
        routes.auth_verify_check,
        "/app/v3/api/auth/verification_codes/verify"
    );
    assert_eq!(
        routes.auth_qr_callback_pattern,
        routes.auth_qr_entry_pattern
    );
    assert_eq!(routes.membership, "/app/v3/api/memberships/current");
    assert_eq!(
        routes.account_summary,
        "/app/v3/api/accounts/current/summary"
    );
    assert_eq!(routes.auth_session_exchange, "/app/v3/api/auth/sessions");
    assert!(
        !routes
            .auth_qr_generate
            .contains("/auth/qr_login_codes"),
        "user center must expose the standard open-platform QR auth path, not the retired QR login code path",
    );
    assert!(
        !routes.membership.contains("/billing/vip"),
        "membership routes must not be nested under retired billing membership paths",
    );
    assert_eq!(routes.health, "/app/v3/api/health");
}

#[test]
fn creates_the_canonical_upstream_integration_shape_for_seed_disabled_modes() {
    let storage_plan = create_user_center_storage_plan("sdkwork-router-portal");
    let local_provider = UserCenterProviderConfig {
        base_url: None,
        headers: Vec::new(),
        kind: "local".to_string(),
        provider_key: "sdkwork-router-portal-local".to_string(),
    };
    let builtin_local_auth = create_user_center_auth_profile(
        "sdkwork-router-portal",
        &local_provider,
        "local-native",
        &storage_plan,
    );
    let upstream_provider = UserCenterProviderConfig {
        base_url: Some("https://cloud.sdkwork.test/app".to_string()),
        headers: Vec::new(),
        kind: "sdkwork-cloud-app-api".to_string(),
        provider_key: "sdkwork-router-portal-app-api".to_string(),
    };
    let upstream_auth = create_user_center_auth_profile(
        "sdkwork-router-portal",
        &upstream_provider,
        "app-api-hub",
        &storage_plan,
    );
    let integration = create_user_center_integration_profiles(
        "sdkwork-router-portal",
        &upstream_provider,
        USER_CENTER_DEFAULT_LOCAL_API_BASE_PATH,
        "app-api-hub",
        &builtin_local_auth,
        &upstream_auth,
    );

    assert_eq!(integration.active_kind, "sdkwork-cloud-app-api");
    assert_eq!(
        is_user_center_upstream_integration_active(&integration),
        true
    );
    assert_eq!(integration.external_app_api.enabled, true);
    assert_eq!(integration.external_app_api.handshake_enabled, true);
    assert_eq!(
        integration.external_app_api.upstream_base_url.as_deref(),
        Some("https://cloud.sdkwork.test/app")
    );
}

#[test]
fn creates_the_canonical_iam_sqlite_authority_tables() {
    let mut connection =
        rusqlite::Connection::open_in_memory().expect("open in-memory user center authority");

    ensure_sqlite_user_center_schema(&mut connection).expect("create canonical user-center schema");
    ensure_sqlite_user_center_bootstrap_user(&mut connection)
        .expect("seed canonical user-center bootstrap user");

    for table_name in [
        "iam_tenant",
        "iam_organization",
        "iam_organization_member",
        "iam_role",
        "iam_permission",
        "iam_role_permission",
        "iam_user_role",
        "iam_user",
        "iam_user_identity",
        "iam_credential",
        "iam_membership",
        "iam_account",
        "iam_api_key",
        "iam_session",
        "iam_verification_code",
        "iam_login_qr",
    ] {
        let exists: i64 = connection
            .query_row(
                "SELECT EXISTS(SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?1)",
                [table_name],
                |row| row.get(0),
            )
            .unwrap_or_else(|error| panic!("probe {table_name} failed: {error}"));
        assert_eq!(exists, 1, "{table_name} must be created as an iam_* table.");
    }

    let retired_plus_table_count: i64 = connection
        .query_row(
            "SELECT COUNT(*) FROM sqlite_master WHERE type = 'table' AND name LIKE 'plus_%'",
            [],
            |row| row.get(0),
        )
        .expect("count retired plus tables");
    assert_eq!(
        retired_plus_table_count, 0,
        "canonical IAM authority schema must not create retired plus_* business tables.",
    );
    let retired_vip_membership_table_exists: i64 = connection
        .query_row(
            "SELECT EXISTS(SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'iam_vip_membership')",
            [],
            |row| row.get(0),
        )
        .expect("probe retired iam_vip_membership table");
    assert_eq!(
        retired_vip_membership_table_exists, 0,
        "canonical IAM authority schema must not create retired iam_vip_membership.",
    );

    let user_count: i64 = connection
        .query_row(
            "SELECT COUNT(*) FROM iam_user WHERE is_deleted = 0",
            [],
            |row| row.get(0),
        )
        .expect("count canonical iam_user rows");
    let session_count: i64 = connection
        .query_row(
            "SELECT COUNT(*) FROM iam_session WHERE is_deleted = 0",
            [],
            |row| row.get(0),
        )
        .expect("count canonical iam_session rows");

    assert_eq!(
        user_count, 1,
        "bootstrap must seed the canonical iam_user table."
    );
    let user_password_column_exists: i64 = connection
        .query_row(
            "SELECT COUNT(*) FROM pragma_table_info('iam_user') WHERE name = 'password'",
            [],
            |row| row.get(0),
        )
        .expect("inspect canonical iam_user columns");
    assert_eq!(
        user_password_column_exists, 0,
        "password credentials must live in iam_credential, not iam_user.",
    );
    let credential_count: i64 = connection
        .query_row(
            "SELECT COUNT(*) FROM iam_credential WHERE credential_type = 'password' AND status = 'active'",
            [],
            |row| row.get(0),
        )
        .expect("count canonical iam_credential rows");
    assert_eq!(
        credential_count, 1,
        "bootstrap must seed password credentials into iam_credential.",
    );
    assert_eq!(
        session_count, 0,
        "bootstrap must not create an implicit active session.",
    );
    let membership_level_column_exists: i64 = connection
        .query_row(
            "SELECT COUNT(*) FROM pragma_table_info('iam_membership') WHERE name = 'membership_level_id'",
            [],
            |row| row.get(0),
        )
        .expect("inspect canonical iam_membership columns");
    let retired_vip_level_column_exists: i64 = connection
        .query_row(
            "SELECT COUNT(*) FROM pragma_table_info('iam_membership') WHERE name = 'vip_level_id'",
            [],
            |row| row.get(0),
        )
        .expect("inspect retired iam_membership columns");
    assert_eq!(
        membership_level_column_exists, 1,
        "iam_membership must expose membership_level_id as the canonical level relation.",
    );
    assert_eq!(
        retired_vip_level_column_exists, 0,
        "iam_membership must not expose retired vip_level_id columns.",
    );
}

#[test]
fn user_center_authority_uses_membership_vocabulary_without_vip_aliases() {
    let authority_source = include_str!("../src/user_center_authority.rs");

    for retired_symbol in [
        "VipUserRecord",
        "VipMembershipRecord",
        "UpdateUserCenterVipMembershipRequest",
        "UserCenterVipMembershipPayload",
        "load_vip_user_record",
        "load_vip_membership_record",
        "upsert_vip_user_shadow",
        "upsert_vip_membership_shadow",
        "read_vip_membership",
        "update_vip_membership",
        "request_vip_info_with_state",
        "iam_vip_membership",
        "vip_level_id",
        "/vip/info",
        "\"vip-user\"",
        "\"vip-membership\"",
    ] {
        assert!(
            !authority_source.contains(retired_symbol),
            "{retired_symbol} must be retired from the user-center authority. Membership storage is iam_membership with membership-first APIs.",
        );
    }

    for required_symbol in [
        "MembershipRecord",
        "UpdateUserCenterMembershipRequest",
        "UserCenterMembershipPayload",
        "load_membership_record",
        "upsert_membership_shadow",
        "read_membership",
        "update_membership",
        "request_membership_with_state",
        "iam_membership",
        "membership_level_id",
        "/memberships/current",
    ] {
        assert!(
            authority_source.contains(required_symbol),
            "{required_symbol} must be present in the canonical membership authority.",
        );
    }
}

#[test]
fn user_center_authority_has_no_retired_schema_migration_or_plus_table_debt() {
    let authority_source = include_str!("../src/user_center_authority.rs");

    for retired_fragment in [
        "CREATE TABLE IF NOT EXISTS plus_",
        "ON plus_",
        "idx_plus_",
        "legacy_plus_",
        "migrate_legacy_iam_user_password_credentials",
        "rebuild_iam_user_without_legacy_password_column",
        "ensure_sqlite_user_center_integer_identifier_upgrade",
        "upgrade_sqlite_user_center_integer_identifier_table",
        "USER_CENTER_INTEGER_IDENTIFIER_TABLE_RULES",
        "__legacy_integer_identifiers",
        "__legacy_password_column",
    ] {
        assert!(
            !authority_source.contains(retired_fragment),
            "{retired_fragment} must not exist in the new-app user-center authority baseline.",
        );
    }
}
