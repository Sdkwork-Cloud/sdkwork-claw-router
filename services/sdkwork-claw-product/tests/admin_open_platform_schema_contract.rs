const TABLE_REGISTRY: &str =
    include_str!("../../../docs/schema-registry/sdkwork-claw-router.tables.yaml");
const POSTGRES_SCHEMA: &str = include_str!("../../../generated/schema/postgres/schema.sql");

fn compact(value: &str) -> String {
    value.split_whitespace().collect::<Vec<_>>().join(" ")
}

fn assert_contains(source: &str, expected: &str) {
    let actual = compact(source);
    let expected = compact(expected);
    assert!(actual.contains(&expected), "missing `{expected}`");
}

#[test]
fn open_platform_tables_are_declared_as_independent_standard_tables() {
    for table in [
        "open_platform_provider",
        "open_platform_manifest",
        "open_platform_account",
        "open_platform_entry",
        "open_platform_pay_binding",
    ] {
        assert_contains(TABLE_REGISTRY, &format!("- table: {table}"));
        assert_contains(
            POSTGRES_SCHEMA,
            &format!("CREATE TABLE IF NOT EXISTS {table}"),
        );
    }
}

#[test]
fn open_platform_account_tables_are_not_folded_into_ai_provider_credentials() {
    assert_contains(TABLE_REGISTRY, "open_platform_account");
    assert!(
        !compact(TABLE_REGISTRY)
            .contains("open_platform_account source_tables: - integration_provider_account"),
        "open platform accounts must not reuse integration_provider_account"
    );
}
