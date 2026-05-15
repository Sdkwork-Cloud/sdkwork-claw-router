use sdkwork_claw_config::{DatabaseConfig, DatabaseEngine, StartupInstallMode};

#[test]
fn parses_sqlite_database_urls_for_desktop_deployment() {
    let config = DatabaseConfig::from_url("sqlite::memory:").unwrap();

    assert_eq!(DatabaseEngine::Sqlite, config.engine);
    assert_eq!("sqlite::memory:", config.url);
    assert_eq!(
        DatabaseConfig::DEFAULT_MAX_CONNECTIONS,
        config.max_connections
    );
}

#[test]
fn parses_postgres_database_urls_for_server_docker_and_kubernetes() {
    let config = DatabaseConfig::from_url_with_max_connections(
        "postgres://sdkwork:sdkwork@localhost:5432/sdkwork_claw_router",
        32,
    )
    .unwrap();

    assert_eq!(DatabaseEngine::Postgres, config.engine);
    assert_eq!(32, config.max_connections);
}

#[test]
fn rejects_unsupported_or_empty_database_urls() {
    assert!(DatabaseConfig::from_url("").is_err());
    assert!(DatabaseConfig::from_url("mysql://localhost/sdkwork").is_err());
}

#[test]
fn rejects_zero_database_pool_size() {
    let error = DatabaseConfig::from_url_with_max_connections("sqlite::memory:", 0).unwrap_err();

    assert!(error.contains("max connections"));
}

#[test]
fn parses_optional_environment_database_config_parts() {
    assert_eq!(
        None,
        DatabaseConfig::from_optional_parts(None, None).unwrap()
    );

    let config = DatabaseConfig::from_optional_parts(
        Some("sqlite::memory:".to_owned()),
        Some("4".to_owned()),
    )
    .unwrap()
    .unwrap();

    assert_eq!(DatabaseEngine::Sqlite, config.engine);
    assert_eq!(4, config.max_connections);
}

#[test]
fn rejects_invalid_environment_database_pool_size() {
    let error = DatabaseConfig::from_optional_parts(
        Some("sqlite::memory:".to_owned()),
        Some("bad".to_owned()),
    )
    .unwrap_err();

    assert!(error.contains("SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS"));
}

#[test]
fn parses_startup_install_mode_from_optional_environment_part() {
    assert_eq!(
        StartupInstallMode::Ensure,
        StartupInstallMode::from_optional_part(None).unwrap()
    );
    assert_eq!(
        StartupInstallMode::Ensure,
        StartupInstallMode::from_optional_part(Some("ensure".to_owned())).unwrap()
    );
    assert_eq!(
        StartupInstallMode::Skip,
        StartupInstallMode::from_optional_part(Some("SKIP".to_owned())).unwrap()
    );
    assert!(
        StartupInstallMode::from_optional_part(Some("repair".to_owned()))
            .unwrap_err()
            .contains("SDKWORK_CLAW_STARTUP_INSTALL_MODE")
    );
}
