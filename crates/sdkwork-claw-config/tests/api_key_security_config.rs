use sdkwork_claw_config::ApiKeySecurityConfig;

#[test]
fn parses_api_key_pepper_config_without_leaking_secret() {
    let config = ApiKeySecurityConfig::from_optional_parts(Some(
        "0123456789abcdef0123456789abcdef".to_owned(),
    ))
    .unwrap()
    .unwrap();

    assert_eq!(32, config.pepper_secret().len());
    assert!(!format!("{config:?}").contains("0123456789abcdef"));
}

#[test]
fn missing_api_key_pepper_keeps_config_unset() {
    assert_eq!(
        None,
        ApiKeySecurityConfig::from_optional_parts(None).unwrap()
    );
}

#[test]
fn rejects_blank_or_short_api_key_pepper() {
    let blank = ApiKeySecurityConfig::from_optional_parts(Some("   ".to_owned())).unwrap_err();
    assert!(blank.contains("SDKWORK_CLAW_API_KEY_PEPPER"));

    let short =
        ApiKeySecurityConfig::from_optional_parts(Some("too-short".to_owned())).unwrap_err();
    assert!(short.contains("at least 32"));
}
