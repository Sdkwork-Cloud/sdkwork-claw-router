const POSTGRES_BILLING_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/billing_store.rs");

fn compact_sql(value: &str) -> String {
    value.split_whitespace().collect::<Vec<_>>().join(" ")
}

fn assert_sql_contains(sql: &str, expected: &str) {
    let actual = compact_sql(sql);
    let compact_expected = compact_sql(expected);
    assert!(
        actual.contains(&compact_expected),
        "Postgres billing SQL must contain `{expected}`"
    );
}

fn assert_sql_not_contains(sql: &str, forbidden: &str) {
    let actual = compact_sql(sql);
    let compact_forbidden = compact_sql(forbidden);
    assert!(
        !actual.contains(&compact_forbidden),
        "Postgres billing SQL must not contain `{forbidden}`"
    );
}

#[test]
fn billing_history_queries_keep_source_aware_status_projection() {
    for projection in [
        "CAST(uc.id AS TEXT) AS id",
        "uc.status AS status",
        "CAST(COALESCE(p.id, o.id, vr.id) AS TEXT) AS id",
        "p.id AS payment_id",
        "vr.id AS recharge_id",
        "o.status AS order_status",
        "p.status AS payment_status",
        "vr.status AS recharge_status",
    ] {
        assert_sql_contains(POSTGRES_BILLING_STORE, projection);
    }

    assert_sql_not_contains(
        POSTGRES_BILLING_STORE,
        "CAST(COALESCE(p.status, o.status, vr.status, 0) AS TEXT) AS status",
    );
    assert_sql_not_contains(
        POSTGRES_BILLING_STORE,
        "COALESCE(p.status, o.status, vr.status, 0) AS status",
    );
    assert_sql_not_contains(
        POSTGRES_BILLING_STORE,
        "CAST(COALESCE(uc.status, 0) AS TEXT) AS status",
    );
}

#[test]
fn billing_redeem_coupon_query_casts_integer_projection_aliases_and_locks_coupon() {
    for expected in [
        "CAST(id AS TEXT) AS id",
        "CAST(COALESCE(amount, 0) AS TEXT) AS amount",
        "CAST(COALESCE(total, 0) AS TEXT) AS total",
        "CAST(COALESCE(received_count, 0) AS TEXT) AS received_count",
        "CAST(COALESCE(get_limit, 0) AS TEXT) AS get_limit",
        "LIMIT 1 FOR UPDATE",
    ] {
        assert_sql_contains(POSTGRES_BILLING_STORE, expected);
    }
}

#[test]
fn billing_points_account_read_locks_existing_account_and_uses_stable_integer_projection() {
    for expected in [
        "SELECT CAST(id AS TEXT) AS id, CAST(COALESCE(available_points, 0) AS TEXT) AS available_points",
        "AND account_type = 2 AND status = 1 ORDER BY id ASC LIMIT 1 FOR UPDATE",
    ] {
        assert_sql_contains(POSTGRES_BILLING_STORE, expected);
    }
}

#[test]
fn billing_points_account_creation_uses_account_unique_key_conflict_guard() {
    for expected in [
        "ON CONFLICT (tenant_id, organization_id, user_id, account_type) DO NOTHING",
        "RETURNING CAST(id AS TEXT) AS id",
        "points account was not available after concurrent creation",
    ] {
        assert_sql_contains(POSTGRES_BILLING_STORE, expected);
    }
}
