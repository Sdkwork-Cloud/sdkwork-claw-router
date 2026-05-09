const POSTGRES_FORUM_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/forum_store.rs");
const POSTGRES_SCHEMA: &str = include_str!("../../../generated/schema/postgres/schema.sql");

fn compact_sql(value: &str) -> String {
    value.split_whitespace().collect::<Vec<_>>().join(" ")
}

fn assert_sql_contains(sql: &str, expected: &str) {
    let actual = compact_sql(sql);
    let compact_expected = compact_sql(expected);
    assert!(
        actual.contains(&compact_expected),
        "Postgres forum SQL must contain `{expected}`"
    );
}

fn assert_sql_not_contains(sql: &str, forbidden: &str) {
    let actual = compact_sql(sql).to_ascii_lowercase();
    let compact_forbidden = compact_sql(forbidden).to_ascii_lowercase();
    assert!(
        !actual.contains(&compact_forbidden),
        "Postgres forum SQL must not contain `{forbidden}`"
    );
}

#[test]
fn postgres_forum_uses_java_compatible_plus_tables_only() {
    for expected in [
        "CREATE TABLE IF NOT EXISTS plus_feeds",
        "CREATE TABLE IF NOT EXISTS plus_comments",
        "CREATE TABLE IF NOT EXISTS plus_content_vote",
        "CREATE TABLE IF NOT EXISTS plus_favorite",
        "id BIGINT PRIMARY KEY",
        "content_type INTEGER NOT NULL",
        "status INTEGER NOT NULL DEFAULT 2",
        "status INTEGER NOT NULL DEFAULT 1",
    ] {
        assert_sql_contains(POSTGRES_SCHEMA, expected);
    }

    for expected in [
        "FROM plus_feeds f",
        "INSERT INTO plus_feeds",
        "UPDATE plus_feeds",
        "FROM plus_comments",
        "INSERT INTO plus_comments",
        "UPDATE plus_comments",
        "INSERT INTO plus_content_vote",
        "DELETE FROM plus_content_vote",
        "INSERT INTO plus_favorite",
        "DELETE FROM plus_favorite",
    ] {
        assert_sql_contains(POSTGRES_FORUM_STORE, expected);
    }

    assert_sql_not_contains(POSTGRES_FORUM_STORE, "content_forum_post");
    assert_sql_not_contains(POSTGRES_FORUM_STORE, "content_forum_comment");
}

#[test]
fn postgres_forum_persists_java_enum_codes_and_fact_backed_counts() {
    for expected in [
        "const CONTENT_TYPE_FEEDS: i64 = 5;",
        "const CONTENT_TYPE_COMMENTS: i64 = 22;",
        "const FEEDS_STATUS_PUBLISHED: i64 = 2;",
        "const COMMENT_STATUS_PUBLISHED: i64 = 1;",
        "const FAVORITE_STATUS_ACTIVE: i64 = 1;",
        "lower(COALESCE(v.rating, '')) = 'like'",
        "SELECT COUNT(1) FROM plus_content_vote",
        "SELECT COUNT(1) FROM plus_favorite",
        "favorite_count = ( SELECT COUNT(1) FROM plus_favorite",
        "like_count = ( SELECT COUNT(1) FROM plus_content_vote",
        "likes = ( SELECT COUNT(1) FROM plus_content_vote",
    ] {
        assert_sql_contains(POSTGRES_FORUM_STORE, expected);
    }
}

#[test]
fn postgres_forum_uses_postgres_placeholders_and_jsonb_casts() {
    for expected in [
        "v.user_id = $3",
        "COALESCE(f.content_type, 0) = $7",
        "LIMIT $11 OFFSET $12",
        "$11::jsonb",
        "$12::jsonb",
        "$13::jsonb",
        "$16::jsonb",
        "metadata, source, client_ip, device_info",
        "$8::jsonb",
    ] {
        assert_sql_contains(POSTGRES_FORUM_STORE, expected);
    }

    assert_sql_not_contains(POSTGRES_FORUM_STORE, "?1");
    assert_sql_not_contains(POSTGRES_FORUM_STORE, "?2");
    assert_sql_not_contains(POSTGRES_FORUM_STORE, "INSERT OR REPLACE");
}
