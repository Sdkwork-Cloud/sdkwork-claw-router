use sdkwork_claw_config::ProviderSecretMapConfig;
use sdkwork_claw_product::infrastructure::provider::ProviderSecretMapResolver;
use sdkwork_claw_product::ports::ProviderSecretResolver;

#[test]
fn provider_secret_map_resolver_resolves_tokens_without_debug_leak() {
    let config = ProviderSecretMapConfig::from_json(
        r#"{
            "vault://providers/openrouter/account/main": "sk-openrouter-provider-token",
            "env://providers/local/account/dev": "sk-local-provider-token"
        }"#,
    )
    .unwrap();
    let resolver = ProviderSecretMapResolver::from_config(config);

    assert_eq!(
        "sk-openrouter-provider-token",
        resolver
            .resolve_bearer_token("vault://providers/openrouter/account/main")
            .unwrap()
    );
    assert_eq!(
        "sk-local-provider-token",
        resolver
            .resolve_bearer_token(" env://providers/local/account/dev ")
            .unwrap()
    );
    assert!(!format!("{resolver:?}").contains("sk-openrouter-provider-token"));
    assert!(!format!("{resolver:?}").contains("sk-local-provider-token"));
}

#[test]
fn provider_secret_map_resolver_rejects_missing_secret_ref_without_leaking_values() {
    let config = ProviderSecretMapConfig::from_json(
        r#"{"vault://providers/openrouter/account/main": "sk-openrouter-provider-token"}"#,
    )
    .unwrap();
    let resolver = ProviderSecretMapResolver::from_config(config);

    let blank = resolver.resolve_bearer_token("   ").unwrap_err();
    assert!(blank
        .to_string()
        .contains("provider secret_ref is required"));
    assert!(!blank.to_string().contains("sk-openrouter-provider-token"));

    let missing = resolver
        .resolve_bearer_token("vault://providers/openrouter/account/missing")
        .unwrap_err();
    assert!(missing
        .to_string()
        .contains("provider secret_ref is not configured"));
    assert!(!missing.to_string().contains("sk-openrouter-provider-token"));
}
