use sdkwork_claw_config::{
    ProviderPassthroughAuth, ProviderPassthroughAuthType, ProviderPassthroughHeader,
    ProviderRelayConfig, ProviderSecretMapConfig,
};

#[test]
fn parses_optional_openai_relay_config_without_leaking_secret() {
    let config = ProviderRelayConfig::from_optional_parts(
        Some(" http://127.0.0.1:8080/ ".to_owned()),
        Some(" sk-upstream-provider-secret ".to_owned()),
    )
    .unwrap()
    .unwrap();

    let openai_relay = config.openai_relay().unwrap();
    assert_eq!("http://127.0.0.1:8080", openai_relay.base_url());
    assert_eq!("sk-upstream-provider-secret", openai_relay.bearer_token());
    assert!(!format!("{config:?}").contains("sk-upstream-provider-secret"));
}

#[test]
fn parses_provider_native_passthrough_relay_config_without_leaking_secret() {
    let config = ProviderRelayConfig::from_parts(
        " http://127.0.0.1:8080/ ",
        " sk-upstream-provider-secret ",
    )
    .unwrap()
    .with_provider_passthrough(
        " google ",
        " https://generativelanguage.googleapis.com/ ",
        " sk-google-provider ",
    )
    .unwrap()
    .with_provider_passthrough(
        "anthropic",
        "https://api.anthropic.com",
        "sk-anthropic-provider",
    )
    .unwrap();

    let google = config.provider_passthrough("google").unwrap();
    assert_eq!(
        "https://generativelanguage.googleapis.com",
        google.base_url()
    );
    assert_eq!("sk-google-provider", google.bearer_token());
    assert!(config.provider_passthrough("missing").is_none());
    assert!(format!("{config:?}").contains("google"));
    assert!(!format!("{config:?}").contains("sk-google-provider"));
    assert!(!format!("{config:?}").contains("sk-anthropic-provider"));
}

#[test]
fn parses_provider_native_passthrough_json_config() {
    let config = ProviderRelayConfig::from_optional_parts(
        Some("http://127.0.0.1:8080".to_owned()),
        Some("sk-openai".to_owned()),
    )
    .unwrap()
    .unwrap()
    .with_provider_passthrough_json(
        r#"{
            "google": {
                "baseUrl": "https://generativelanguage.googleapis.com/",
                "bearerToken": "sk-google-provider"
            },
            "anthropic": {
                "baseUrl": "https://api.anthropic.com",
                "bearerToken": "sk-anthropic-provider"
            }
        }"#,
    )
    .unwrap();

    assert_eq!(
        "https://generativelanguage.googleapis.com",
        config.provider_passthrough("google").unwrap().base_url()
    );
    assert_eq!(
        "sk-anthropic-provider",
        config
            .provider_passthrough("anthropic")
            .unwrap()
            .bearer_token()
    );
}

#[test]
fn parses_provider_native_passthrough_auth_modes_from_json_config() {
    let config = ProviderRelayConfig::from_provider_passthrough_json(
        r#"{
            "google": {
                "baseUrl": "https://generativelanguage.googleapis.com/",
                "auth": {
                    "type": "header",
                    "name": "x-goog-api-key",
                    "value": "sk-google-provider"
                }
            },
            "anthropic": {
                "baseUrl": "https://api.anthropic.com/",
                "auth": {
                    "type": "header",
                    "name": "x-api-key",
                    "value": "sk-anthropic-provider"
                }
            },
            "legacy": {
                "baseUrl": "https://legacy.example/",
                "bearerToken": "sk-legacy-provider"
            },
            "query-provider": {
                "baseUrl": "https://query.example/",
                "auth": {
                    "type": "query",
                    "name": "key",
                    "value": "sk-query-provider"
                }
            }
        }"#,
    )
    .unwrap();

    let google = config.provider_passthrough("google").unwrap();
    assert_eq!(
        &ProviderPassthroughAuth::header("x-goog-api-key", "sk-google-provider").unwrap(),
        google.auth()
    );
    assert_eq!(
        ProviderPassthroughAuthType::Header,
        google.auth().auth_type()
    );
    assert_eq!(Some("x-goog-api-key"), google.auth().name());
    assert_eq!("sk-google-provider", google.auth().value());

    let anthropic = config.provider_passthrough("anthropic").unwrap();
    assert_eq!(
        &ProviderPassthroughAuth::header("x-api-key", "sk-anthropic-provider").unwrap(),
        anthropic.auth()
    );

    let legacy = config.provider_passthrough("legacy").unwrap();
    assert_eq!(
        &ProviderPassthroughAuth::bearer("sk-legacy-provider").unwrap(),
        legacy.auth()
    );
    assert_eq!("sk-legacy-provider", legacy.bearer_token());

    let query = config.provider_passthrough("query-provider").unwrap();
    assert_eq!(
        &ProviderPassthroughAuth::query("key", "sk-query-provider").unwrap(),
        query.auth()
    );
    assert_eq!(ProviderPassthroughAuthType::Query, query.auth().auth_type());

    let debug = format!("{config:?}");
    assert!(debug.contains("google"));
    assert!(!debug.contains("sk-google-provider"));
    assert!(!debug.contains("sk-query-provider"));
}

#[test]
fn parses_provider_native_passthrough_default_headers_from_json_config() {
    let config = ProviderRelayConfig::from_provider_passthrough_json(
        r#"{
            "anthropic": {
                "baseUrl": "https://api.anthropic.com/",
                "auth": {
                    "type": "header",
                    "name": "x-api-key",
                    "value": "sk-anthropic-provider"
                },
                "defaultHeaders": {
                    "anthropic-version": "2023-06-01",
                    "anthropic-beta": "files-api-2025-04-14"
                }
            }
        }"#,
    )
    .unwrap();

    let anthropic = config.provider_passthrough("anthropic").unwrap();
    assert_eq!(
        &[
            ProviderPassthroughHeader::new("anthropic-beta", "files-api-2025-04-14").unwrap(),
            ProviderPassthroughHeader::new("anthropic-version", "2023-06-01").unwrap(),
        ],
        anthropic.default_headers()
    );

    let debug = format!("{config:?}");
    assert!(debug.contains("anthropic-version"));
    assert!(!debug.contains("2023-06-01"));
}

#[test]
fn parses_provider_native_passthrough_json_config_without_openai_relay() {
    let config = ProviderRelayConfig::from_provider_passthrough_json(
        r#"{
            "google": {
                "baseUrl": "https://generativelanguage.googleapis.com/",
                "bearerToken": "sk-google-provider"
            },
            "anthropic": {
                "baseUrl": "https://api.anthropic.com/",
                "bearerToken": "sk-anthropic-provider"
            }
        }"#,
    )
    .unwrap();

    assert!(config.openai_relay().is_none());
    assert_eq!(
        "https://generativelanguage.googleapis.com",
        config.provider_passthrough("google").unwrap().base_url()
    );
    assert_eq!(
        "sk-anthropic-provider",
        config
            .provider_passthrough("anthropic")
            .unwrap()
            .bearer_token()
    );
}

#[test]
fn rejects_invalid_provider_native_passthrough_json_config() {
    let config = ProviderRelayConfig::from_parts("http://127.0.0.1:8080", "sk-openai").unwrap();

    let malformed = config
        .clone()
        .with_provider_passthrough_json("{not-json")
        .unwrap_err();
    assert!(malformed.contains("SDKWORK_CLAW_PROVIDER_PASSTHROUGH_JSON"));

    let missing_base_url = config
        .with_provider_passthrough_json(r#"{"google":{"bearerToken":"sk-google-provider"}}"#)
        .unwrap_err();
    assert!(missing_base_url.contains("baseUrl"));

    let missing_auth_value = ProviderRelayConfig::from_provider_passthrough_json(
        r#"{"google":{"baseUrl":"https://provider.example","auth":{"type":"header","name":"x-api-key"}}}"#,
    )
    .unwrap_err();
    assert!(missing_auth_value.contains("auth.value"));

    let invalid_auth_type = ProviderRelayConfig::from_provider_passthrough_json(
        r#"{"google":{"baseUrl":"https://provider.example","auth":{"type":"cookie","name":"session","value":"secret"}}}"#,
    )
    .unwrap_err();
    assert!(invalid_auth_type.contains("auth.type"));

    let default_headers_not_object = ProviderRelayConfig::from_provider_passthrough_json(
        r#"{"google":{"baseUrl":"https://provider.example","bearerToken":"sk-provider","defaultHeaders":[]}}"#,
    )
    .unwrap_err();
    assert!(default_headers_not_object.contains("defaultHeaders"));

    let reserved_default_header = ProviderRelayConfig::from_provider_passthrough_json(
        r#"{"google":{"baseUrl":"https://provider.example","bearerToken":"sk-provider","defaultHeaders":{"authorization":"Bearer leaked"}}}"#,
    )
    .unwrap_err();
    assert!(reserved_default_header.contains("defaultHeaders.authorization"));
}

#[test]
fn rejects_blank_provider_native_passthrough_config() {
    let config = ProviderRelayConfig::from_parts("http://127.0.0.1:8080", "sk-openai").unwrap();

    let blank_provider = config
        .clone()
        .with_provider_passthrough("  ", "https://provider.example", "sk-provider")
        .unwrap_err();
    assert!(blank_provider.contains("provider passthrough code"));

    let blank_url = config
        .clone()
        .with_provider_passthrough("google", "  ", "sk-provider")
        .unwrap_err();
    assert!(blank_url.contains("provider passthrough base URL"));

    let blank_token = config
        .with_provider_passthrough("google", "https://provider.example", "  ")
        .unwrap_err();
    assert!(blank_token.contains("provider passthrough bearer token"));
}

#[test]
fn missing_openai_relay_config_keeps_relay_unset() {
    assert_eq!(
        None,
        ProviderRelayConfig::from_optional_parts(None, None).unwrap()
    );
}

#[test]
fn from_env_accepts_provider_native_passthrough_without_openai_relay_env() {
    std::env::remove_var(ProviderRelayConfig::ENV_OPENAI_RELAY_BASE_URL);
    std::env::remove_var(ProviderRelayConfig::ENV_OPENAI_RELAY_BEARER_TOKEN);
    std::env::set_var(
        ProviderRelayConfig::ENV_PROVIDER_PASSTHROUGH_JSON,
        r#"{
            "google": {
                "baseUrl": "https://generativelanguage.googleapis.com/",
                "bearerToken": "sk-google-provider"
            }
        }"#,
    );

    let config = ProviderRelayConfig::from_env().unwrap().unwrap();
    std::env::remove_var(ProviderRelayConfig::ENV_PROVIDER_PASSTHROUGH_JSON);

    assert!(config.openai_relay().is_none());
    assert_eq!(
        "https://generativelanguage.googleapis.com",
        config.provider_passthrough("google").unwrap().base_url()
    );
}

#[test]
fn rejects_partial_or_blank_openai_relay_config() {
    let missing_token =
        ProviderRelayConfig::from_optional_parts(Some("http://127.0.0.1:8080".to_owned()), None)
            .unwrap_err();
    assert!(missing_token.contains("SDKWORK_CLAW_OPENAI_RELAY_BEARER_TOKEN"));

    let missing_url =
        ProviderRelayConfig::from_optional_parts(None, Some("sk-provider".to_owned())).unwrap_err();
    assert!(missing_url.contains("SDKWORK_CLAW_OPENAI_RELAY_BASE_URL"));

    let blank = ProviderRelayConfig::from_optional_parts(
        Some("   ".to_owned()),
        Some("sk-provider".to_owned()),
    )
    .unwrap_err();
    assert!(blank.contains("SDKWORK_CLAW_OPENAI_RELAY_BASE_URL"));
}

#[test]
fn parses_provider_secret_map_without_leaking_secret_values() {
    let config = ProviderSecretMapConfig::from_json(
        r#"{
            " vault://providers/openrouter/account/main ": " sk-provider-token ",
            "env://providers/local/account/dev": "sk-local-token"
        }"#,
    )
    .unwrap();

    assert_eq!(2, config.secret_count());
    assert_eq!(
        Some("sk-provider-token"),
        config.secret_value("vault://providers/openrouter/account/main")
    );
    assert_eq!(
        Some("sk-local-token"),
        config.secret_value("env://providers/local/account/dev")
    );
    assert!(!format!("{config:?}").contains("sk-provider-token"));
    assert!(!format!("{config:?}").contains("sk-local-token"));
    assert!(!format!("{config:?}").contains("bearer_tokens"));
}

#[test]
fn missing_provider_secret_map_keeps_resolver_unset() {
    assert_eq!(
        None,
        ProviderSecretMapConfig::from_optional_json(None).unwrap()
    );
}

#[test]
fn rejects_invalid_provider_secret_map_config() {
    let malformed = ProviderSecretMapConfig::from_json("{not-json").unwrap_err();
    assert!(malformed.contains("SDKWORK_CLAW_PROVIDER_SECRET_MAP_JSON"));

    let not_object = ProviderSecretMapConfig::from_json(r#"["sk-provider"]"#).unwrap_err();
    assert!(not_object.contains("JSON object"));

    let blank_secret_ref =
        ProviderSecretMapConfig::from_json(r#"{"  ":"sk-provider"}"#).unwrap_err();
    assert!(blank_secret_ref.contains("secret_ref must not be blank"));

    let blank_secret_value =
        ProviderSecretMapConfig::from_json(r#"{"vault://providers/openrouter/account/main":"  "}"#)
            .unwrap_err();
    assert!(blank_secret_value.contains("secret value must not be blank"));
}
