const ADMIN_API_LIB: &str = include_str!("../src/lib.rs");

#[test]
fn admin_api_database_runtime_mounts_messaging_center() {
    assert!(
        ADMIN_API_LIB.contains("AdminMessagingRuntimeStore"),
        "admin api runtime must own a messaging store"
    );
    assert!(
        ADMIN_API_LIB.contains("SqliteAdminMessagingStore::new(pool.clone())"),
        "sqlite runtime must create messaging store"
    );
    assert!(
        ADMIN_API_LIB.contains("PostgresAdminMessagingStore::new(pool.clone())"),
        "postgres runtime must create messaging store"
    );
    assert!(
        ADMIN_API_LIB.contains("admin_messaging_router_with_store"),
        "admin api must mount messaging router"
    );
    assert!(
        ADMIN_API_LIB.contains("messaging_store: Some(messaging_store)"),
        "database runtime must pass messaging store into router assembly"
    );
}
