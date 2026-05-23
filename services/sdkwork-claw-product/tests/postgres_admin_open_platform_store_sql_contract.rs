const POSTGRES_ADMIN_OPEN_PLATFORM_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/admin_open_platform_store.rs");

fn compact_sql(value: &str) -> String {
    value.split_whitespace().collect::<Vec<_>>().join(" ")
}

fn assert_sql_contains(sql: &str, expected: &str) {
    let actual = compact_sql(sql);
    let compact_expected = compact_sql(expected);
    assert!(
        actual.contains(&compact_expected),
        "Postgres open platform SQL must contain `{expected}`"
    );
}

#[test]
fn postgres_open_platform_store_uses_standard_tables_and_subject_scope() {
    for expected in [
        "FROM open_platform_provider",
        "FROM open_platform_manifest",
        "FROM open_platform_account",
        "FROM open_platform_entry",
        "FROM open_platform_pay_binding",
        "WHERE tenant_id = $1",
        "AND organization_id = $2",
        "AND deleted_at IS NULL",
        "WHERE id = $10 AND tenant_id = $11 AND organization_id = $12 AND deleted_at IS NULL",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_OPEN_PLATFORM_STORE, expected);
    }
}

#[test]
fn postgres_open_platform_store_writes_audit_and_returns_inserted_ids() {
    for expected in [
        "INSERT INTO open_platform_account",
        "INSERT INTO open_platform_entry",
        "INSERT INTO open_platform_pay_binding",
        "RETURNING id",
        "INSERT INTO ops_audit_log",
        "target_type",
        "change_summary",
        "create_open_platform_account",
        "update_open_platform_entry",
        "delete_open_platform_pay_binding",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_OPEN_PLATFORM_STORE, expected);
    }
}

#[test]
fn postgres_open_platform_dictionary_ordering_does_not_cast_bigint_ids_to_integer() {
    let actual = compact_sql(POSTGRES_ADMIN_OPEN_PLATFORM_STORE);
    assert!(
        actual.contains("COALESCE(sort_order::bigint, id)"),
        "Postgres provider and manifest ordering should keep bigint id ordering safe"
    );
    assert!(
        !actual.contains("id::integer"),
        "Postgres open platform SQL must not cast bigint ids to integer"
    );
}

#[test]
fn postgres_open_platform_default_entry_and_qr_default_are_account_scoped() {
    for expected in [
        "default open platform entry must belong to the account",
        "UPDATE open_platform_account SET qr_default = false",
        "AND provider = $4",
        "AND account_type = $5",
        "AND id <> $6",
        "SET default_entry_id = NULL, qr_default = false",
        "AND default_entry_id = $5",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_OPEN_PLATFORM_STORE, expected);
    }
}
