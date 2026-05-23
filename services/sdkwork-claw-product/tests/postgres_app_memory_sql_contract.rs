const POSTGRES_APP_MEMORY_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/app_memory_store.rs");

fn compact_sql(value: &str) -> String {
    value.split_whitespace().collect::<Vec<_>>().join(" ")
}

fn assert_sql_contains(sql: &str, expected: &str) {
    let actual = compact_sql(sql);
    let compact_expected = compact_sql(expected);
    assert!(
        actual.contains(&compact_expected),
        "Postgres app memory SQL must contain `{expected}`"
    );
}

#[test]
fn postgres_memory_store_scopes_all_space_and_entry_queries_by_trusted_user() {
    for expected in [
        "AND user_id = $3",
        "AND s.user_id = e.user_id",
        "organization_id, user_id, space_type",
        ".bind(command.subject.user_id)",
        "actor_id, conversation_id",
    ] {
        assert_sql_contains(POSTGRES_APP_MEMORY_STORE, expected);
    }
}

#[test]
fn postgres_memory_store_uses_string_lifecycle_statuses_for_chat_sources() {
    for expected in [
        "AND status <> 'deleted'",
        "INSERT INTO ai_memory_space",
        "'active'",
    ] {
        assert_sql_contains(POSTGRES_APP_MEMORY_STORE, expected);
    }
    assert!(
        !POSTGRES_APP_MEMORY_STORE.contains("status <> 9"),
        "Postgres app memory source validation must not compare string lifecycle status columns to numeric deleted states"
    );
}
