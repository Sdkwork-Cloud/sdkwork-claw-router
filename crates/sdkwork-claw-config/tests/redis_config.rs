use sdkwork_claw_config::{RedisConfig, RuntimeTomlConfig};

#[test]
fn disabled_redis_config_is_absent_by_default() {
    assert_eq!(
        None,
        RedisConfig::from_env_or_runtime_toml(None)
            .unwrap()
            .map(|config| config.enabled())
    );

    let config = RuntimeTomlConfig::from_toml_str(
        r#"
[redis]
enabled = false
host = "redis.example.com"
port = 6379
database = 0
"#,
    )
    .unwrap();

    assert_eq!(
        None,
        RedisConfig::from_env_or_runtime_toml(Some(&config)).unwrap()
    );
}

#[test]
fn parses_structured_redis_config_without_leaking_password() {
    let secret_path = unique_secret_path("redis-password");
    std::fs::write(&secret_path, "redis-secret\n").unwrap();
    let config = RuntimeTomlConfig::from_toml_str(&format!(
        r#"
[redis]
enabled = true
host = " redis.internal "
port = 6380
database = 3
username = "clawrouter"
password_file = "{}"
key_prefix = "clawrouter-prod"
tls = true
max_connections = 32
connect_timeout_millis = 2500
command_timeout_millis = 1500
pool_idle_timeout_seconds = 120
"#,
        secret_path.display().to_string().replace('\\', "/")
    ))
    .unwrap();

    let redis = RedisConfig::from_env_or_runtime_toml(Some(&config))
        .unwrap()
        .unwrap();

    assert!(redis.enabled());
    assert_eq!(
        "rediss://clawrouter:redis-secret@redis.internal:6380/3",
        redis.url()
    );
    assert_eq!(Some("redis.internal"), redis.host());
    assert_eq!(Some(6380), redis.port());
    assert_eq!(Some(3), redis.database());
    assert_eq!(Some("clawrouter"), redis.username());
    assert_eq!(Some("clawrouter-prod"), redis.key_prefix());
    assert!(redis.tls());
    assert_eq!(32, redis.max_connections());
    assert_eq!(2500, redis.connect_timeout_millis());
    assert_eq!(1500, redis.command_timeout_millis());
    assert_eq!(120, redis.pool_idle_timeout_seconds());
    assert!(!format!("{redis:?}").contains("redis-secret"));

    let _ = std::fs::remove_file(secret_path);
}

#[test]
fn parses_redis_url_as_advanced_override() {
    let config = RuntimeTomlConfig::from_toml_str(
        r#"
[redis]
enabled = true
url = "rediss://cache.example.com:6380/5"
key_prefix = "clawrouter"
max_connections = 16
"#,
    )
    .unwrap();

    let redis = RedisConfig::from_env_or_runtime_toml(Some(&config))
        .unwrap()
        .unwrap();

    assert_eq!("rediss://cache.example.com:6380/5", redis.url());
    assert_eq!(None, redis.host());
    assert_eq!(None, redis.port());
    assert_eq!(None, redis.database());
    assert!(redis.tls());
}

#[test]
fn rejects_incomplete_or_ambiguous_redis_config() {
    let missing_host = RuntimeTomlConfig::from_toml_str(
        r#"
[redis]
enabled = true
port = 6379
database = 0
"#,
    )
    .unwrap();
    assert!(RedisConfig::from_env_or_runtime_toml(Some(&missing_host))
        .unwrap_err()
        .contains("host"));

    let ambiguous = RuntimeTomlConfig::from_toml_str(
        r#"
[redis]
enabled = true
url = "redis://cache.example.com:6379/0"
host = "cache.example.com"
port = 6379
database = 0
"#,
    )
    .unwrap();
    assert!(RedisConfig::from_env_or_runtime_toml(Some(&ambiguous))
        .unwrap_err()
        .contains("either url or structured"));

    let bad_timeout = RuntimeTomlConfig::from_toml_str(
        r#"
[redis]
enabled = true
host = "cache.example.com"
port = 6379
database = 0
connect_timeout_millis = 0
"#,
    )
    .unwrap();
    assert!(RedisConfig::from_env_or_runtime_toml(Some(&bad_timeout))
        .unwrap_err()
        .contains("connect timeout"));
}

fn unique_secret_path(name: &str) -> std::path::PathBuf {
    std::env::temp_dir().join(format!(
        "clawrouter-{name}-{}-{}.secret",
        std::process::id(),
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_nanos()
    ))
}
