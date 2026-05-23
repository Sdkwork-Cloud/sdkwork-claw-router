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
    assert_eq!(routes.auth_qr_callback_pattern, routes.auth_qr_entry_pattern);
    assert_eq!(routes.membership, "/app/v3/api/memberships/current");
    assert_eq!(
        routes.account_summary,
        "/app/v3/api/accounts/current/summary"
    );
    assert_eq!(
        routes.auth_session_exchange,
        "/app/v3/api/auth/sessions"
    );
    assert!(
        !routes
            .auth_qr_generate
            .contains("/auth/qr_login_codes"),
        "user center must expose the standard open-platform QR auth path, not the retired QR login code path",
    );
    assert!(
        !routes.membership.contains("/billing/vip"),
        "membership routes must not be nested under retired billing VIP paths",
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
        "iam_vip_membership",
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

    for table_name in [
        "plus_tenant",
        "plus_organization",
        "plus_role",
        "plus_permission",
        "plus_user",
        "plus_oauth_account",
        "plus_vip_user",
        "plus_account",
        "plus_account_history",
        "plus_account_exchange_config",
        "plus_currency",
        "plus_exchange_rate",
        "plus_ledger_bridge",
        "plus_coupon",
        "plus_coupon_template",
        "plus_user_coupon",
        "plus_product",
        "plus_sku",
        "plus_order",
        "plus_order_item",
        "plus_payment",
        "plus_refund",
        "plus_shopping_cart",
        "plus_shopping_cart_item",
        "plus_payment_webhook_event",
        "plus_order_dispatch_rule",
        "plus_order_worker_dispatch_profile",
        "plus_vip_level",
        "plus_vip_benefit",
        "plus_vip_level_benefit",
        "plus_vip_pack_group",
        "plus_vip_pack",
        "plus_vip_recharge_method",
        "plus_vip_recharge_pack",
        "plus_vip_recharge",
        "plus_vip_point_change",
        "plus_vip_benefit_usage",
        "plus_api_key",
        "plus_user_auth_session",
        "plus_user_verify_code",
        "plus_user_login_qr",
    ] {
        let exists: i64 = connection
            .query_row(
                "SELECT EXISTS(SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?1)",
                [table_name],
                |row| row.get(0),
            )
            .unwrap_or_else(|error| panic!("probe retired table {table_name} failed: {error}"));
        assert_eq!(
            exists, 0,
            "{table_name} must not be created by the canonical IAM authority schema.",
        );
    }

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
}

#[test]
fn user_center_authority_uses_vip_membership_vocabulary() {
    let authority_source = include_str!("../src/user_center_authority.rs");

    for retired_symbol in [
        "VipUserRecord",
        "load_vip_user_record",
        "upsert_vip_user_shadow",
        "\"vip-user\"",
    ] {
        assert!(
            !authority_source.contains(retired_symbol),
            "{retired_symbol} must be retired from the user-center authority. VIP storage is an iam_vip_membership shadow, not a legacy vip-user model.",
        );
    }
}

#[test]
fn upgrades_legacy_iam_user_passwords_into_iam_credentials() {
    let mut connection = rusqlite::Connection::open_in_memory()
        .expect("open in-memory legacy user center authority");

    connection
        .execute_batch(
            r#"
            CREATE TABLE iam_user (
                id INTEGER PRIMARY KEY,
                uuid TEXT NOT NULL UNIQUE,
                tenant_id INTEGER NOT NULL DEFAULT 0,
                organization_id INTEGER NOT NULL DEFAULT 0,
                data_scope INTEGER NOT NULL DEFAULT 1,
                username TEXT NOT NULL UNIQUE,
                nickname TEXT NOT NULL,
                password TEXT NOT NULL,
                salt TEXT NULL,
                platform TEXT NOT NULL,
                type TEXT NOT NULL,
                gender TEXT NULL,
                face_image TEXT NULL,
                face_video TEXT NULL,
                scene TEXT NULL,
                email TEXT NULL UNIQUE,
                phone TEXT NULL,
                country_code TEXT NULL,
                province_code TEXT NULL,
                city_code TEXT NULL,
                district_code TEXT NULL,
                address TEXT NULL,
                bio TEXT NULL,
                birth_date TEXT NULL,
                oauth_user_info TEXT NULL,
                metadata TEXT NULL,
                social_info_list TEXT NULL,
                avatar_url TEXT NULL,
                provider_key TEXT NOT NULL,
                external_subject TEXT NULL,
                metadata_json TEXT NULL,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                version INTEGER NOT NULL DEFAULT 0,
                is_deleted INTEGER NOT NULL DEFAULT 0
            );

            INSERT INTO iam_user (
                id, uuid, tenant_id, organization_id, data_scope, username, nickname,
                password, salt, platform, type, scene, email, avatar_url, provider_key,
                status, created_at, updated_at, version, is_deleted
            )
            VALUES (
                1002,
                '8c9860c5-45f6-5b11-8fc4-a40708f7cc3d',
                10,
                20,
                1,
                'legacy-user',
                'Legacy User',
                '$argon2id$v=19$m=19456,t=2,p=1$legacy$hash',
                NULL,
                'default',
                'default',
                'birdcoder',
                'legacy@sdkwork.test',
                'https://avatar.test/legacy.png',
                'local',
                'active',
                '2026-04-24T00:00:00Z',
                '2026-04-24T00:00:00Z',
                0,
                0
            );
            "#,
        )
        .expect("create legacy iam_user password fixture");

    ensure_sqlite_user_center_schema(&mut connection)
        .expect("upgrade legacy iam_user password fixture");

    let user_password_column_exists: i64 = connection
        .query_row(
            "SELECT COUNT(*) FROM pragma_table_info('iam_user') WHERE name = 'password'",
            [],
            |row| row.get(0),
        )
        .expect("inspect upgraded iam_user columns");
    assert_eq!(
        user_password_column_exists, 0,
        "legacy iam_user.password must be retired after schema upgrade.",
    );

    let credential: (String, String) = connection
        .query_row(
            "SELECT credential_hash, status FROM iam_credential WHERE user_id = 1002 AND credential_type = 'password'",
            [],
            |row| Ok((row.get(0)?, row.get(1)?)),
        )
        .expect("read migrated iam_credential");
    assert_eq!(
        credential,
        (
            "$argon2id$v=19$m=19456,t=2,p=1$legacy$hash".to_owned(),
            "active".to_owned(),
        ),
    );
}
