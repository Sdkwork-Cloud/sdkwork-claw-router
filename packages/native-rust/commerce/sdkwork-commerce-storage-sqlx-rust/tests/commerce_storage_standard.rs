use sdkwork_commerce_storage_sqlx::{
    commerce_database_indexes, commerce_database_tables, commerce_initial_migration_sql,
};

#[test]
fn exposes_complete_commerce_table_catalog() {
    let tables = commerce_database_tables();

    assert!(tables.contains(&"commerce_account"));
    assert!(tables.contains(&"commerce_account_ledger_entry"));
    assert!(tables.contains(&"commerce_idempotency_key"));
    assert!(tables.contains(&"commerce_vip_membership"));
    assert!(tables.contains(&"commerce_vip_pack"));
    assert!(tables.contains(&"commerce_billing_prehold"));

    for table in tables {
        assert!(table.starts_with("commerce_"));
        assert!(!table.contains("__"));
        assert!(!table.starts_with("plus_"));
    }
}

#[test]
fn initial_migration_declares_standard_ledger_and_vip_columns() {
    let sql = commerce_initial_migration_sql();

    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_account"));
    assert!(sql.contains("tenant_id"));
    assert!(sql.contains("organization_id"));
    assert!(sql.contains("owner_user_id"));
    assert!(sql.contains("asset_type"));
    assert!(sql.contains("available_amount"));
    assert!(sql.contains("frozen_amount"));
    assert!(sql.contains("version"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_account_ledger_entry"));
    assert!(sql.contains("idempotency_key"));
    assert!(sql.contains("balance_after"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_vip_membership"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_billing_prehold"));
}

#[test]
fn initial_migration_declares_performance_and_idempotency_indexes() {
    let sql = commerce_initial_migration_sql();

    for index_name in commerce_database_indexes() {
        assert!(
            sql.contains(&format!("CREATE INDEX IF NOT EXISTS {index_name}"))
                || sql.contains(&format!("CREATE UNIQUE INDEX IF NOT EXISTS {index_name}")),
            "missing commerce migration index: {index_name}",
        );
    }
}
