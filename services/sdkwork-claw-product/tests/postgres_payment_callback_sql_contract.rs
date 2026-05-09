const POSTGRES_PAYMENT_CALLBACK_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/payment_callback_store.rs");

fn compact_sql(value: &str) -> String {
    value.split_whitespace().collect::<Vec<_>>().join(" ")
}

fn assert_sql_contains(sql: &str, expected: &str) {
    let actual = compact_sql(sql);
    let compact_expected = compact_sql(expected);
    assert!(
        actual.contains(&compact_expected),
        "Postgres payment callback SQL must contain `{expected}`"
    );
}

#[test]
fn payment_callback_payment_lookup_casts_integer_projection_aliases_for_stable_postgres_mapping() {
    for projection in [
        "CAST(p.id AS TEXT) AS id",
        "CAST(p.order_id AS TEXT) AS order_id",
        "CAST(p.tenant_id AS TEXT) AS tenant_id",
        "CAST(p.organization_id AS TEXT) AS organization_id",
        "CAST(COALESCE(o.user_id, 0) AS TEXT) AS user_id",
        "CAST(p.status AS TEXT) AS status",
        "CAST(COALESCE(p.provider, 0) AS TEXT) AS provider",
        "required_integer_cell(&row, \"status\", \"payment\")?",
    ] {
        assert_sql_contains(POSTGRES_PAYMENT_CALLBACK_STORE, projection);
    }
    assert!(
        !POSTGRES_PAYMENT_CALLBACK_STORE.contains("CAST(COALESCE(p.status, 0) AS TEXT) AS status"),
        "Postgres payment callback must not default missing payment statuses"
    );
}

#[test]
fn payment_callback_recharge_and_account_queries_cast_integer_projection_aliases() {
    for projection in [
        "SELECT CAST(id AS TEXT) AS id, CAST(status AS TEXT) AS status, CAST(COALESCE(point_amount, 0) AS TEXT) AS point_amount",
        "required_integer_cell(&row, \"status\", \"vip recharge\")?",
        "SELECT CAST(id AS TEXT) AS id, CAST(COALESCE(available_points, 0) AS TEXT) AS available_points",
    ] {
        assert_sql_contains(POSTGRES_PAYMENT_CALLBACK_STORE, projection);
    }
    assert!(
        !POSTGRES_PAYMENT_CALLBACK_STORE.contains("CAST(COALESCE(status, 0) AS TEXT) AS status"),
        "Postgres payment callback must not default missing recharge statuses"
    );
}

#[test]
fn payment_callback_points_account_creation_uses_account_unique_key_conflict_guard() {
    for expected in [
        "ON CONFLICT (tenant_id, organization_id, user_id, account_type) DO NOTHING",
        "RETURNING CAST(id AS TEXT) AS id",
        "payment callback points account was not available after concurrent creation",
    ] {
        assert_sql_contains(POSTGRES_PAYMENT_CALLBACK_STORE, expected);
    }
}

#[test]
fn payment_callback_webhook_event_queries_lock_and_scope_idempotency_by_provider_event_and_nonce() {
    for expected in [
        "SELECT event_id FROM plus_payment_webhook_event WHERE provider = $1 AND nonce = $2 LIMIT 1",
        "SELECT CAST(id AS TEXT) AS id, status FROM plus_payment_webhook_event WHERE provider = $1 AND event_id = $2 LIMIT 1 FOR UPDATE",
        "UPDATE plus_payment_webhook_event SET status = 'RECEIVED'",
        "RETURNING id",
    ] {
        assert_sql_contains(POSTGRES_PAYMENT_CALLBACK_STORE, expected);
    }
}

#[test]
fn payment_callback_success_updates_payment_order_recharge_and_accounting_tables() {
    for expected in [
        "UPDATE plus_payment SET status = 2, transaction_id = $1, success_time = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND status <> 2",
        "UPDATE plus_order SET status = 2, transaction_id = $1, paid_amount = total_amount, pay_success_time = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND status IN (1, 5)",
        "UPDATE plus_account SET available_points = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
        "INSERT INTO plus_account_history",
        "INSERT INTO plus_vip_point_change",
        "UPDATE plus_vip_recharge SET status = 1, recharge_time = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP, remark = $1 WHERE id = $2",
    ] {
        assert_sql_contains(POSTGRES_PAYMENT_CALLBACK_STORE, expected);
    }
}

#[test]
fn payment_callback_failed_or_closed_updates_payment_order_and_recharge_without_overwriting_success(
) {
    for expected in [
        "UPDATE plus_payment SET status = $1, transaction_id = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND status <> 2",
        "UPDATE plus_order SET status = 5, cancel_time = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND status = 1",
        "UPDATE plus_vip_recharge SET status = 2, updated_at = CURRENT_TIMESTAMP, remark = $1 WHERE tenant_id = $2 AND organization_id = $3 AND user_id = $4 AND transaction_no = $5 AND status <> 1",
    ] {
        assert_sql_contains(POSTGRES_PAYMENT_CALLBACK_STORE, expected);
    }
}
