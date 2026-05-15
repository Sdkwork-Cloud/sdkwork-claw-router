use serde::{Deserialize, Serialize};

use crate::domain::{DomainError, DomainResult};
use crate::ports::{AdminAuthSettings, AdminAuthVerificationPolicy};

pub(crate) const AUTH_SETTINGS_SOURCE_TABLE: &str = "iam_auth_runtime_settings";
pub(crate) const AUTH_SETTINGS_AUDIT_TARGET_TYPE: i32 = 65;
pub(crate) const CONFIG_SCOPE_AUTH: i32 = 30;
pub(crate) const CONFIG_TYPE_AUTH_SETTINGS: i32 = AUTH_SETTINGS_AUDIT_TARGET_TYPE;

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub(crate) struct StoredAuthSettings {
    pub left_rail_mode: String,
    pub login_methods: Vec<String>,
    pub oauth_login_enabled: bool,
    pub oauth_providers: Vec<String>,
    pub oauth_region: String,
    pub qr_login_enabled: bool,
    pub recovery_methods: Vec<String>,
    pub register_methods: Vec<String>,
    pub verification_policy: StoredAuthVerificationPolicy,
}

impl Default for StoredAuthSettings {
    fn default() -> Self {
        AdminAuthSettings::default().into()
    }
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub(crate) struct StoredAuthVerificationPolicy {
    pub email_code_login_enabled: bool,
    pub email_registration_verification_required: bool,
    pub phone_code_login_enabled: bool,
    pub phone_registration_verification_required: bool,
}

impl Default for StoredAuthVerificationPolicy {
    fn default() -> Self {
        AdminAuthVerificationPolicy::default().into()
    }
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct StoredAuthSettingsEnvelope {
    action: Option<String>,
    settings: StoredAuthSettings,
}

impl From<AdminAuthSettings> for StoredAuthSettings {
    fn from(value: AdminAuthSettings) -> Self {
        Self {
            left_rail_mode: value.left_rail_mode,
            login_methods: value.login_methods,
            oauth_login_enabled: value.oauth_login_enabled,
            oauth_providers: value.oauth_providers,
            oauth_region: value.oauth_region,
            qr_login_enabled: value.qr_login_enabled,
            recovery_methods: value.recovery_methods,
            register_methods: value.register_methods,
            verification_policy: value.verification_policy.into(),
        }
    }
}

impl From<StoredAuthSettings> for AdminAuthSettings {
    fn from(value: StoredAuthSettings) -> Self {
        Self {
            left_rail_mode: value.left_rail_mode,
            login_methods: value.login_methods,
            oauth_login_enabled: value.oauth_login_enabled,
            oauth_providers: value.oauth_providers,
            oauth_region: value.oauth_region,
            qr_login_enabled: value.qr_login_enabled,
            recovery_methods: value.recovery_methods,
            register_methods: value.register_methods,
            verification_policy: value.verification_policy.into(),
        }
    }
}

impl From<AdminAuthVerificationPolicy> for StoredAuthVerificationPolicy {
    fn from(value: AdminAuthVerificationPolicy) -> Self {
        Self {
            email_code_login_enabled: value.email_code_login_enabled,
            email_registration_verification_required: value
                .email_registration_verification_required,
            phone_code_login_enabled: value.phone_code_login_enabled,
            phone_registration_verification_required: value
                .phone_registration_verification_required,
        }
    }
}

impl From<StoredAuthVerificationPolicy> for AdminAuthVerificationPolicy {
    fn from(value: StoredAuthVerificationPolicy) -> Self {
        Self {
            email_code_login_enabled: value.email_code_login_enabled,
            email_registration_verification_required: value
                .email_registration_verification_required,
            phone_code_login_enabled: value.phone_code_login_enabled,
            phone_registration_verification_required: value
                .phone_registration_verification_required,
        }
    }
}

pub(crate) fn settings_payload(settings: &AdminAuthSettings) -> DomainResult<String> {
    serde_json::to_string(&StoredAuthSettings::from(settings.clone()))
        .map_err(|error| DomainError::new(error.to_string()))
}

pub(crate) fn settings_snapshot_payload(settings: &AdminAuthSettings) -> DomainResult<String> {
    serde_json::to_string(&StoredAuthSettingsEnvelope {
        action: Some("update_auth_settings".to_owned()),
        settings: StoredAuthSettings::from(settings.clone()),
    })
    .map_err(|error| DomainError::new(error.to_string()))
}

pub(crate) fn settings_from_payload(payload: &str) -> DomainResult<AdminAuthSettings> {
    if payload.trim().is_empty() {
        return Ok(AdminAuthSettings::default());
    }
    let value = serde_json::from_str::<serde_json::Value>(payload)
        .map_err(|error| DomainError::new(error.to_string()))?;
    let settings = value.get("settings").cloned().unwrap_or(value);
    serde_json::from_value::<StoredAuthSettings>(settings)
        .map(AdminAuthSettings::from)
        .map(AdminAuthSettings::normalized)
        .map_err(|error| DomainError::new(error.to_string()))
}

#[cfg(test)]
mod tests {
    use super::settings_from_payload;

    #[test]
    fn settings_from_payload_accepts_legacy_partial_snapshot() {
        let settings = settings_from_payload(
            r#"{"action":"update_auth_settings","settings":{"leftRailMode":"qr-only","qrLoginEnabled":false,"verificationPolicy":{"phoneCodeLoginEnabled":true}}}"#,
        )
        .unwrap();

        assert_eq!("highlights-only", settings.left_rail_mode);
        assert_eq!(
            vec!["password".to_owned(), "phoneCode".to_owned()],
            settings.login_methods
        );
        assert!(!settings.qr_login_enabled);
        assert!(!settings.verification_policy.email_code_login_enabled);
        assert!(settings.verification_policy.phone_code_login_enabled);
        assert_eq!(
            vec!["email".to_owned(), "phone".to_owned()],
            settings.register_methods
        );
        assert_eq!(
            vec!["email".to_owned(), "phone".to_owned()],
            settings.recovery_methods
        );
    }
}
