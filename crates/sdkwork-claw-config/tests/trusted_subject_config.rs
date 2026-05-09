use sdkwork_claw_config::TrustedSubjectConfig;

#[test]
fn parses_trusted_subject_config_without_leaking_secret() {
    let config = TrustedSubjectConfig::from_optional_parts(
        Some("0123456789abcdef0123456789abcdef".to_owned()),
        Some("120".to_owned()),
    )
    .unwrap()
    .unwrap();

    assert_eq!(120, config.max_clock_skew_seconds());
    assert_eq!(32, config.signing_secret().len());
    assert!(!format!("{config:?}").contains("0123456789abcdef"));
}

#[test]
fn missing_trusted_subject_secret_keeps_config_unset() {
    assert_eq!(
        None,
        TrustedSubjectConfig::from_optional_parts(None, None).unwrap()
    );
}

#[test]
fn rejects_blank_short_or_invalid_trusted_subject_config() {
    let blank =
        TrustedSubjectConfig::from_optional_parts(Some("   ".to_owned()), None).unwrap_err();
    assert!(blank.contains("SDKWORK_CLAW_TRUSTED_SUBJECT_SECRET"));

    let short =
        TrustedSubjectConfig::from_optional_parts(Some("too-short".to_owned()), None).unwrap_err();
    assert!(short.contains("at least 32"));

    let invalid_skew = TrustedSubjectConfig::from_optional_parts(
        Some("0123456789abcdef0123456789abcdef".to_owned()),
        Some("0".to_owned()),
    )
    .unwrap_err();
    assert!(invalid_skew.contains("SDKWORK_CLAW_TRUSTED_SUBJECT_MAX_CLOCK_SKEW_SECONDS"));

    let oversized_skew = TrustedSubjectConfig::from_optional_parts(
        Some("0123456789abcdef0123456789abcdef".to_owned()),
        Some("3601".to_owned()),
    )
    .unwrap_err();
    assert!(oversized_skew.contains("at most 3600"));
}
