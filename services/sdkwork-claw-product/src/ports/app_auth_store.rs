use std::future::Future;
use std::pin::Pin;

use crate::domain::DomainResult;

pub type AppAuthFuture<'a, T> = Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AppAuthUserCredential {
    pub id: i64,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub username: String,
    pub email: String,
    pub display_name: String,
    pub avatar_url: String,
    pub phone: String,
    pub language: String,
    pub registered_at: String,
    pub password_last_changed: String,
    pub two_factor_enabled: bool,
    pub third_party_bound: String,
    pub password_hash: String,
    pub status: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AppAuthRegistrationCommand {
    pub tenant_code: Option<String>,
    pub organization_code: Option<String>,
    pub username: String,
    pub display_name: String,
    pub email: String,
    pub phone: String,
    pub channel: String,
    pub password_hash: String,
    pub verification_code_hash: String,
    pub now: i64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AppAuthVerificationCodeCommand {
    pub credential_id: String,
    pub target: String,
    pub scene: String,
    pub verify_type: String,
    pub code_hash: String,
    pub expires_at: i64,
    pub now: i64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AppAuthVerificationCodeLookup {
    pub code_id: Option<String>,
    pub target: String,
    pub scene: String,
    pub verify_type: String,
    pub code_hash: String,
    pub now: i64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AppAuthPasswordResetCodeCommand {
    pub credential_id: String,
    pub account: String,
    pub channel: String,
    pub code_hash: String,
    pub expires_at: i64,
    pub now: i64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AppAuthPasswordResetCommand {
    pub account: String,
    pub code_hash: String,
    pub password_hash: String,
    pub now: i64,
}

pub trait AppAuthStore {
    fn find_user_for_password_login<'a>(
        &'a self,
        account: &'a str,
    ) -> AppAuthFuture<'a, Option<AppAuthUserCredential>>;

    fn find_user_for_code_login<'a>(
        &'a self,
        target: &'a str,
        verify_type: &'a str,
    ) -> AppAuthFuture<'a, Option<AppAuthUserCredential>>;

    fn create_verification_code<'a>(
        &'a self,
        command: AppAuthVerificationCodeCommand,
    ) -> AppAuthFuture<'a, String>;

    fn verify_code<'a>(&'a self, lookup: AppAuthVerificationCodeLookup) -> AppAuthFuture<'a, bool>;

    fn consume_verification_code<'a>(
        &'a self,
        lookup: AppAuthVerificationCodeLookup,
    ) -> AppAuthFuture<'a, bool>;

    fn create_registration<'a>(
        &'a self,
        command: AppAuthRegistrationCommand,
    ) -> AppAuthFuture<'a, AppAuthUserCredential>;

    fn create_password_reset_code<'a>(
        &'a self,
        command: AppAuthPasswordResetCodeCommand,
    ) -> AppAuthFuture<'a, String>;

    fn reset_password<'a>(
        &'a self,
        command: AppAuthPasswordResetCommand,
    ) -> AppAuthFuture<'a, bool>;
}
