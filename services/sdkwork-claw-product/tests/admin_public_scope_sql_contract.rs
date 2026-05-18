const SQLITE_ADMIN_ACCESS_GROUP_STORE: &str =
    include_str!("../src/infrastructure/sql/sqlite/admin_access_group_store.rs");
const POSTGRES_ADMIN_ACCESS_GROUP_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/admin_access_group_store.rs");
const SQLITE_ADMIN_MODEL_RATE_LIMIT_STORE: &str =
    include_str!("../src/infrastructure/sql/sqlite/admin_model_rate_limit_store.rs");
const POSTGRES_ADMIN_MODEL_RATE_LIMIT_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/admin_model_rate_limit_store.rs");
const SQLITE_ADMIN_MONITOR_READ_STORE: &str =
    include_str!("../src/infrastructure/sql/sqlite/admin_monitor_read_store.rs");
const POSTGRES_ADMIN_MONITOR_READ_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/admin_monitor_read_store.rs");
const SQLITE_DASHBOARD_OVERVIEW_READ_STORE: &str =
    include_str!("../src/infrastructure/sql/sqlite/dashboard_overview_read_store.rs");
const POSTGRES_DASHBOARD_OVERVIEW_READ_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/dashboard_overview_read_store.rs");
const SQLITE_ADMIN_CHANNEL_STORE: &str =
    include_str!("../src/infrastructure/sql/sqlite/admin_channel_store.rs");
const POSTGRES_ADMIN_CHANNEL_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/admin_channel_store.rs");
const SQLITE_APP_ROUTING_CHANNEL_COMMAND_STORE: &str =
    include_str!("../src/infrastructure/sql/sqlite/app_routing_channel_command_store.rs");
const POSTGRES_APP_ROUTING_CHANNEL_COMMAND_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/app_routing_channel_command_store.rs");

fn compact_sql(value: &str) -> String {
    value.split_whitespace().collect::<Vec<_>>().join(" ")
}

fn assert_sql_contains(source: &str, expected: &str) {
    let actual = compact_sql(source);
    let expected = compact_sql(expected);
    assert!(
        actual.contains(&expected),
        "SQL source must contain `{expected}`"
    );
}

fn assert_sql_not_contains(source: &str, forbidden: &str) {
    let actual = compact_sql(source).to_ascii_lowercase();
    let forbidden = compact_sql(forbidden).to_ascii_lowercase();
    assert!(
        !actual.contains(&forbidden),
        "SQL source must not contain `{forbidden}`"
    );
}

#[test]
fn admin_access_group_default_pricing_plan_uses_public_zero_scope() {
    assert_sql_contains(
        SQLITE_ADMIN_ACCESS_GROUP_STORE,
        "AND (tenant_id = ? OR tenant_id = 0 OR tenant_id IS NULL)",
    );
    assert_sql_contains(
        SQLITE_ADMIN_ACCESS_GROUP_STORE,
        "AND (organization_id = ? OR organization_id = 0 OR organization_id IS NULL)",
    );
    assert_sql_contains(
        SQLITE_ADMIN_ACCESS_GROUP_STORE,
        "WHEN tenant_id = ? AND organization_id = ? THEN 0",
    );

    assert_sql_contains(
        POSTGRES_ADMIN_ACCESS_GROUP_STORE,
        "AND (tenant_id = $1 OR tenant_id = 0 OR tenant_id IS NULL)",
    );
    assert_sql_contains(
        POSTGRES_ADMIN_ACCESS_GROUP_STORE,
        "AND (organization_id = $2 OR organization_id = 0 OR organization_id IS NULL)",
    );
    assert_sql_contains(
        POSTGRES_ADMIN_ACCESS_GROUP_STORE,
        "WHEN tenant_id = $1 AND organization_id = $2 THEN 0",
    );

    for source in [
        SQLITE_ADMIN_ACCESS_GROUP_STORE,
        POSTGRES_ADMIN_ACCESS_GROUP_STORE,
    ] {
        assert_sql_not_contains(source, "tenant_id IS NULL OR tenant_id = ?");
        assert_sql_not_contains(source, "tenant_id IS NULL OR tenant_id = $1");
    }
}

#[test]
fn admin_model_rate_limit_group_lookup_uses_public_zero_scope() {
    assert_sql_contains(
        SQLITE_ADMIN_MODEL_RATE_LIMIT_STORE,
        "WHERE (tenant_id = ? OR tenant_id = 0 OR tenant_id IS NULL)",
    );
    assert_sql_contains(
        SQLITE_ADMIN_MODEL_RATE_LIMIT_STORE,
        "AND (organization_id = ? OR organization_id = 0 OR organization_id IS NULL)",
    );
    assert_sql_contains(
        SQLITE_ADMIN_MODEL_RATE_LIMIT_STORE,
        "WHEN tenant_id = ? AND organization_id = ? THEN 0",
    );

    assert_sql_contains(
        POSTGRES_ADMIN_MODEL_RATE_LIMIT_STORE,
        "WHERE (tenant_id = $1 OR tenant_id = 0 OR tenant_id IS NULL)",
    );
    assert_sql_contains(
        POSTGRES_ADMIN_MODEL_RATE_LIMIT_STORE,
        "AND (organization_id = $2 OR organization_id = 0 OR organization_id IS NULL)",
    );
    assert_sql_contains(
        POSTGRES_ADMIN_MODEL_RATE_LIMIT_STORE,
        "WHEN tenant_id = $5 AND organization_id = $6 THEN 0",
    );

    for source in [
        SQLITE_ADMIN_MODEL_RATE_LIMIT_STORE,
        POSTGRES_ADMIN_MODEL_RATE_LIMIT_STORE,
    ] {
        assert_sql_not_contains(source, "tenant_id IS NULL OR tenant_id = ?");
        assert_sql_not_contains(source, "tenant_id IS NULL OR tenant_id = $1");
    }
}

#[test]
fn monitor_read_models_use_public_zero_scope_for_system_events() {
    for expected in [
        "(i.tenant_id = ? OR i.tenant_id = 0 OR i.tenant_id IS NULL)",
        "(i.organization_id = ? OR i.organization_id = 0 OR i.organization_id IS NULL)",
        "(tenant_id = ? OR tenant_id = 0 OR tenant_id IS NULL)",
        "(organization_id = ? OR organization_id = 0 OR organization_id IS NULL)",
    ] {
        assert_sql_contains(SQLITE_ADMIN_MONITOR_READ_STORE, expected);
    }

    for expected in [
        "(i.tenant_id = $1 OR i.tenant_id = 0 OR i.tenant_id IS NULL)",
        "(i.organization_id = $2 OR i.organization_id = 0 OR i.organization_id IS NULL)",
        "(tenant_id = $1 OR tenant_id = 0 OR tenant_id IS NULL)",
        "(organization_id = $2 OR organization_id = 0 OR organization_id IS NULL)",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_MONITOR_READ_STORE, expected);
    }
}

#[test]
fn dashboard_overview_shared_read_models_use_public_zero_scope() {
    for expected in [
        "(tenant_id = ?1 OR tenant_id = 0 OR tenant_id IS NULL)",
        "(organization_id = ?2 OR organization_id = 0 OR organization_id IS NULL)",
    ] {
        assert_sql_contains(SQLITE_DASHBOARD_OVERVIEW_READ_STORE, expected);
    }

    for expected in [
        "(tenant_id = $1 OR tenant_id = 0 OR tenant_id IS NULL)",
        "(organization_id = $2 OR organization_id = 0 OR organization_id IS NULL)",
    ] {
        assert_sql_contains(POSTGRES_DASHBOARD_OVERVIEW_READ_STORE, expected);
    }
}

#[test]
fn routing_channel_provider_lookup_uses_public_zero_scope() {
    for source in [
        SQLITE_ADMIN_CHANNEL_STORE,
        POSTGRES_ADMIN_CHANNEL_STORE,
        SQLITE_APP_ROUTING_CHANNEL_COMMAND_STORE,
        POSTGRES_APP_ROUTING_CHANNEL_COMMAND_STORE,
    ] {
        assert_sql_contains(
            source,
            "(p.tenant_id = c.tenant_id AND p.organization_id = c.organization_id)",
        );
        assert_sql_contains(source, "(p.tenant_id = 0 AND p.organization_id = 0)");
    }

    assert_sql_contains(
        SQLITE_APP_ROUTING_CHANNEL_COMMAND_STORE,
        "OR (tenant_id = 0 AND organization_id = 0)",
    );
    assert_sql_contains(
        POSTGRES_APP_ROUTING_CHANNEL_COMMAND_STORE,
        "OR (tenant_id = 0 AND organization_id = 0)",
    );
}
