const POSTGRES_USAGE_SETTLEMENT_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/usage_settlement_store.rs");

fn compact_sql(value: &str) -> String {
    value.split_whitespace().collect::<Vec<_>>().join(" ")
}

fn assert_sql_contains(sql: &str, expected: &str) {
    let actual = compact_sql(sql);
    let compact_expected = compact_sql(expected);
    assert!(
        actual.contains(&compact_expected),
        "Postgres usage settlement SQL must contain `{expected}`"
    );
}

#[test]
fn usage_settlement_locks_pending_usage_and_points_account_in_one_transaction() {
    for expected in [
        "FROM ai_usage_fact",
        "($1 <= 0 OR tenant_id = $1)",
        "($2 <= 0 OR organization_id = $2)",
        "settlement_status IN ($3, $4)",
        "ORDER BY COALESCE(occurred_at, CURRENT_TIMESTAMP), id",
        "FOR UPDATE SKIP LOCKED",
        "FROM plus_account",
        "FOR UPDATE",
    ] {
        assert_sql_contains(POSTGRES_USAGE_SETTLEMENT_STORE, expected);
    }
}

#[test]
fn usage_settlement_requires_explicit_pending_or_failed_status() {
    assert!(
        !compact_sql(POSTGRES_USAGE_SETTLEMENT_STORE).contains("COALESCE(settlement_status, 0) IN"),
        "Postgres usage settlement must not treat NULL settlement_status as pending"
    );
}

#[test]
fn usage_settlement_upserts_bridge_and_returns_ids_without_double_debit() {
    for expected in [
        "INSERT INTO commerce_usage_settlement",
        "ON CONFLICT (tenant_id, organization_id, usage_fact_id) DO UPDATE SET",
        "RETURNING id",
        "INSERT INTO plus_account_history",
        "RETURNING id",
        "WHERE account_id = $1",
        "AND transaction_id = $2",
    ] {
        assert_sql_contains(POSTGRES_USAGE_SETTLEMENT_STORE, expected);
    }
}

#[test]
fn usage_settlement_marks_success_and_failure_on_source_fact() {
    for expected in [
        "UPDATE ai_usage_fact",
        "SET settlement_status = $1,",
        "settlement_id = $2",
        "INSUFFICIENT_POINTS",
        "failure_code = $2",
        "failure_message = $3",
    ] {
        assert_sql_contains(POSTGRES_USAGE_SETTLEMENT_STORE, expected);
    }
}

#[test]
fn usage_settlement_does_not_persist_plaintext_provider_or_gateway_secrets() {
    for forbidden in [
        "authorization",
        "bearer",
        "api_key_secret",
        "provider_secret",
        "openai_bearer_token",
    ] {
        assert!(
            !POSTGRES_USAGE_SETTLEMENT_STORE
                .to_ascii_lowercase()
                .contains(forbidden),
            "Postgres usage settlement store must not persist plaintext secret field `{forbidden}`"
        );
    }
}
