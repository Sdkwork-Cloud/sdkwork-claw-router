const POSTGRES_APP_SESSION_EVENT_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/app_session_event_store.rs");
const POSTGRES_APP_USER_PROFILE_READ_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/app_user_profile_read_store.rs");
const POSTGRES_SCHEMA: &str = include_str!("../../../generated/schema/postgres/schema.sql");

fn compact_sql(value: &str) -> String {
    value.split_whitespace().collect::<Vec<_>>().join(" ")
}

fn assert_sql_contains(source: &str, expected: &str) {
    let actual = compact_sql(source);
    let compact_expected = compact_sql(expected);
    assert!(
        actual.contains(&compact_expected),
        "Postgres identity SQL must contain `{expected}`"
    );
}

fn assert_sql_not_contains(source: &str, forbidden: &str) {
    let actual = compact_sql(source).to_ascii_lowercase();
    let compact_forbidden = compact_sql(forbidden).to_ascii_lowercase();
    assert!(
        !actual.contains(&compact_forbidden),
        "Postgres identity SQL must not contain `{forbidden}`"
    );
}

#[test]
fn postgres_identity_schema_mixes_string_iam_core_ids_with_numeric_extension_ids() {
    let iam_session_table = POSTGRES_SCHEMA
        .split("CREATE TABLE IF NOT EXISTS iam_session")
        .nth(1)
        .unwrap()
        .split("CREATE INDEX IF NOT EXISTS idx_iam_session_tenant_user")
        .next()
        .unwrap();
    let iam_user_preference_table = POSTGRES_SCHEMA
        .split("CREATE TABLE IF NOT EXISTS iam_user_preference")
        .nth(1)
        .unwrap()
        .split("CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_user_preference_user")
        .next()
        .unwrap();
    let iam_user_login_event_table = POSTGRES_SCHEMA
        .split("CREATE TABLE IF NOT EXISTS iam_user_login_event")
        .nth(1)
        .unwrap()
        .split("CREATE INDEX IF NOT EXISTS idx_iam_user_login_event_user_occurred")
        .next()
        .unwrap();

    assert_sql_contains(iam_session_table, "tenant_id VARCHAR(128) NOT NULL");
    assert_sql_contains(iam_session_table, "organization_id VARCHAR(128)");
    assert_sql_contains(iam_session_table, "user_id VARCHAR(128) NOT NULL");
    assert_sql_contains(
        iam_user_preference_table,
        "tenant_id BIGINT NOT NULL DEFAULT 0",
    );
    assert_sql_contains(
        iam_user_preference_table,
        "organization_id BIGINT NOT NULL DEFAULT 0",
    );
    assert_sql_contains(iam_user_preference_table, "user_id BIGINT");
    assert_sql_contains(
        iam_user_login_event_table,
        "tenant_id BIGINT NOT NULL DEFAULT 0",
    );
    assert_sql_contains(
        iam_user_login_event_table,
        "organization_id BIGINT NOT NULL DEFAULT 0",
    );
    assert_sql_contains(iam_user_login_event_table, "user_id BIGINT");
}

#[test]
fn postgres_active_app_session_casts_numeric_extension_ids_to_text_before_joining_core_iam() {
    for expected in [
        "CAST(u.tenant_id AS TEXT) = s.tenant_id",
        "CAST(u.id AS TEXT) = s.user_id",
        "CAST(om.tenant_id AS TEXT) = s.tenant_id",
        "CAST(om.organization_id AS TEXT) = s.organization_id",
        "CAST(om.user_id AS TEXT) = s.user_id",
        "CAST(pref.tenant_id AS TEXT) = s.tenant_id",
        "CAST(pref.organization_id AS TEXT) = s.organization_id",
        "CAST(pref.user_id AS TEXT) = s.user_id",
        "CAST(sec.tenant_id AS TEXT) = s.tenant_id",
        "CAST(sec.organization_id AS TEXT) = s.organization_id",
        "CAST(sec.user_id AS TEXT) = s.user_id",
        "WHERE CAST(tenant_id AS TEXT) = s.tenant_id",
        "AND CAST(organization_id AS TEXT) = s.organization_id",
        "AND CAST(user_id AS TEXT) = s.user_id",
    ] {
        assert_sql_contains(POSTGRES_APP_SESSION_EVENT_STORE, expected);
    }

    for forbidden in [
        "u.tenant_id = s.tenant_id",
        "u.id = s.user_id",
        "om.tenant_id = s.tenant_id",
        "om.organization_id = s.organization_id",
        "om.user_id = s.user_id",
        "pref.tenant_id = s.tenant_id",
        "pref.organization_id = s.organization_id",
        "pref.user_id = s.user_id",
        "sec.tenant_id = s.tenant_id",
        "sec.organization_id = s.organization_id",
        "sec.user_id = s.user_id",
        "WHERE tenant_id = s.tenant_id",
        "AND organization_id = s.organization_id",
        "AND user_id = s.user_id",
    ] {
        assert_sql_not_contains(POSTGRES_APP_SESSION_EVENT_STORE, forbidden);
    }
}

#[test]
fn postgres_user_profile_uses_dual_typed_subject_for_core_and_extension_iam_tables() {
    for expected in [
        "SELECT $1::text AS tenant_id_text",
        "$2::text AS organization_id_text",
        "$3::text AS user_id_text",
        "$4::bigint AS tenant_id",
        "$5::bigint AS organization_id",
        "$6::bigint AS user_id",
        "s.tenant_id = subject.tenant_id_text",
        "s.organization_id = subject.organization_id_text",
        "s.user_id = subject.user_id_text",
        "CAST(u.tenant_id AS TEXT) = subject.tenant_id_text",
        "CAST(u.id AS TEXT) = subject.user_id_text",
        "CAST(om.tenant_id AS TEXT) = u.tenant_id",
        "CAST(om.user_id AS TEXT) = u.id",
        "CAST(om.organization_id AS TEXT) = subject.organization_id_text",
        "e.tenant_id = subject.tenant_id",
        "e.organization_id = subject.organization_id",
        "e.user_id = subject.user_id",
        "pref.tenant_id = subject.tenant_id",
        "pref.organization_id = subject.organization_id",
        "pref.user_id = subject.user_id",
        "sec.tenant_id = subject.tenant_id",
        "sec.organization_id = subject.organization_id",
        "sec.user_id = subject.user_id",
    ] {
        assert_sql_contains(POSTGRES_APP_USER_PROFILE_READ_STORE, expected);
    }

    for forbidden in [
        "om.tenant_id = u.tenant_id",
        "om.user_id = u.id",
        "om.organization_id = subject.organization_id_text",
        "u.tenant_id = subject.tenant_id_text",
        "u.id = subject.user_id_text",
        "pref.tenant_id = u.tenant_id",
        "pref.organization_id = $2",
        "pref.user_id = u.id",
        "sec.tenant_id = u.tenant_id",
        "sec.organization_id = $2",
        "sec.user_id = u.id",
    ] {
        assert_sql_not_contains(POSTGRES_APP_USER_PROFILE_READ_STORE, forbidden);
    }
}
