use std::future::Future;
use std::pin::Pin;

use crate::domain::DomainResult;

pub type AdminAuthSettingsFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AdminAuthSettingsSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub operator_id: i64,
    pub operator_type: i32,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AdminAuthVerificationPolicy {
    pub email_code_login_enabled: bool,
    pub email_registration_verification_required: bool,
    pub phone_code_login_enabled: bool,
    pub phone_registration_verification_required: bool,
}

impl Default for AdminAuthVerificationPolicy {
    fn default() -> Self {
        Self {
            email_code_login_enabled: false,
            email_registration_verification_required: false,
            phone_code_login_enabled: false,
            phone_registration_verification_required: false,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AdminAuthSettings {
    pub left_rail_mode: String,
    pub login_methods: Vec<String>,
    pub oauth_login_enabled: bool,
    pub oauth_providers: Vec<String>,
    pub oauth_region: String,
    pub qr_login_enabled: bool,
    pub recovery_methods: Vec<String>,
    pub register_methods: Vec<String>,
    pub verification_policy: AdminAuthVerificationPolicy,
}

impl Default for AdminAuthSettings {
    fn default() -> Self {
        Self {
            left_rail_mode: "highlights-only".to_owned(),
            login_methods: vec!["password".to_owned()],
            oauth_login_enabled: false,
            oauth_providers: Vec::new(),
            oauth_region: "mainland".to_owned(),
            qr_login_enabled: false,
            recovery_methods: vec!["email".to_owned(), "phone".to_owned()],
            register_methods: vec!["email".to_owned(), "phone".to_owned()],
            verification_policy: AdminAuthVerificationPolicy::default(),
        }
    }
}

impl AdminAuthSettings {
    pub fn normalized(mut self) -> Self {
        if !matches!(
            self.left_rail_mode.as_str(),
            "auto" | "highlights-only" | "qr-only"
        ) {
            self.left_rail_mode = "highlights-only".to_owned();
        }
        if !matches!(self.oauth_region.as_str(), "mainland" | "overseas") {
            self.oauth_region = "mainland".to_owned();
        }

        sync_login_method(
            &mut self.login_methods,
            "emailCode",
            self.verification_policy.email_code_login_enabled,
        );
        sync_login_method(
            &mut self.login_methods,
            "phoneCode",
            self.verification_policy.phone_code_login_enabled,
        );
        self.login_methods = ordered_values(
            &self.login_methods,
            &["password", "emailCode", "phoneCode", "sessionBridge"],
        );
        if self.login_methods.is_empty() {
            self.login_methods.push("password".to_owned());
        }

        self.recovery_methods = ordered_values(&self.recovery_methods, &["email", "phone"]);
        if self.recovery_methods.is_empty() {
            self.recovery_methods = vec!["email".to_owned(), "phone".to_owned()];
        }
        self.register_methods = ordered_values(&self.register_methods, &["email", "phone"]);
        if self.register_methods.is_empty() {
            self.register_methods = vec!["email".to_owned(), "phone".to_owned()];
        }

        if !self.qr_login_enabled && self.left_rail_mode == "qr-only" {
            self.left_rail_mode = "highlights-only".to_owned();
        }

        self
    }
}

fn sync_login_method(methods: &mut Vec<String>, method: &str, enabled: bool) {
    if enabled {
        if !methods.iter().any(|item| item == method) {
            methods.push(method.to_owned());
        }
    } else {
        methods.retain(|item| item != method);
    }
}

fn ordered_values(values: &[String], allowed: &[&str]) -> Vec<String> {
    allowed
        .iter()
        .filter(|allowed_value| values.iter().any(|value| value == *allowed_value))
        .map(|value| (*value).to_owned())
        .collect()
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct GetAdminAuthSettingsQuery {
    pub subject: AdminAuthSettingsSubject,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct GetAdminAuthSettingsScopeQuery {
    pub tenant_code: Option<String>,
    pub organization_code: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UpdateAdminAuthSettingsCommand {
    pub subject: AdminAuthSettingsSubject,
    pub audit_log_uuid: String,
    pub config_snapshot_uuid: String,
    pub settings: AdminAuthSettings,
    pub request_id: String,
    pub requested_at: String,
}

pub trait AdminAuthSettingsStore {
    fn get_auth_settings<'a>(
        &'a self,
        query: GetAdminAuthSettingsQuery,
    ) -> AdminAuthSettingsFuture<'a, AdminAuthSettings>;

    fn get_auth_settings_for_scope<'a>(
        &'a self,
        query: GetAdminAuthSettingsScopeQuery,
    ) -> AdminAuthSettingsFuture<'a, AdminAuthSettings>;

    fn update_auth_settings<'a>(
        &'a self,
        command: UpdateAdminAuthSettingsCommand,
    ) -> AdminAuthSettingsFuture<'a, AdminAuthSettings>;
}
