use std::future::Future;
use std::pin::Pin;

use crate::domain::DomainResult;

pub type AdminOpenPlatformCommandFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AdminOpenPlatformSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub operator_id: i64,
    pub operator_type: i32,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AdminOpenPlatformProviderItem {
    pub id: String,
    pub provider: String,
    pub name: String,
    pub status: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AdminOpenPlatformManifestItem {
    pub id: String,
    pub key: String,
    pub provider: String,
    pub account_type: String,
    pub version: String,
    pub status: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AdminOpenPlatformAccountItem {
    pub id: i64,
    pub uuid: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub key: String,
    pub name: String,
    pub provider: String,
    pub account_type: String,
    pub app_id: Option<String>,
    pub secret_ref: Option<String>,
    pub token_ref: Option<String>,
    pub aes_key_ref: Option<String>,
    pub default_entry_id: Option<i64>,
    pub qr_default: bool,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
    pub deleted_at: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AdminOpenPlatformEntryItem {
    pub id: i64,
    pub uuid: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub account_id: i64,
    pub key: String,
    pub entry_type: String,
    pub url: String,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
    pub deleted_at: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AdminOpenPlatformPayBindingItem {
    pub id: i64,
    pub uuid: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub account_id: i64,
    pub payment_account_id: String,
    pub payment_channel_id: Option<String>,
    pub scene: String,
    pub mode: String,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
    pub deleted_at: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ListAdminOpenPlatformProvidersQuery {
    pub subject: AdminOpenPlatformSubject,
    pub status: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ListAdminOpenPlatformManifestsQuery {
    pub subject: AdminOpenPlatformSubject,
    pub provider: Option<String>,
    pub account_type: Option<String>,
    pub status: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ListAdminOpenPlatformAccountsQuery {
    pub subject: AdminOpenPlatformSubject,
    pub provider: Option<String>,
    pub account_type: Option<String>,
    pub status: Option<String>,
    pub page_no: i64,
    pub page_size: i64,
    pub offset: i64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct FindOpenPlatformQrDefaultEntryQuery {
    pub subject: AdminOpenPlatformSubject,
    pub provider: Option<String>,
    pub account_type: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct OpenPlatformQrDefaultEntryItem {
    pub account: AdminOpenPlatformAccountItem,
    pub entry: AdminOpenPlatformEntryItem,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct GetAdminOpenPlatformAccountQuery {
    pub subject: AdminOpenPlatformSubject,
    pub account_id: i64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CreateAdminOpenPlatformAccountCommand {
    pub subject: AdminOpenPlatformSubject,
    pub account_uuid: String,
    pub audit_log_uuid: String,
    pub key: String,
    pub name: String,
    pub provider: String,
    pub account_type: String,
    pub app_id: Option<String>,
    pub secret_ref: Option<String>,
    pub secret_material: Option<String>,
    pub token_ref: Option<String>,
    pub token_material: Option<String>,
    pub aes_key_ref: Option<String>,
    pub aes_key_material: Option<String>,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UpdateAdminOpenPlatformAccountCommand {
    pub subject: AdminOpenPlatformSubject,
    pub account_id: i64,
    pub audit_log_uuid: String,
    pub name: Option<String>,
    pub app_id: Option<Option<String>>,
    pub secret_ref: Option<Option<String>>,
    pub secret_material: Option<String>,
    pub token_ref: Option<Option<String>>,
    pub token_material: Option<String>,
    pub aes_key_ref: Option<Option<String>>,
    pub aes_key_material: Option<String>,
    pub default_entry_id: Option<Option<i64>>,
    pub qr_default: Option<bool>,
    pub status: Option<String>,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DeleteAdminOpenPlatformAccountCommand {
    pub subject: AdminOpenPlatformSubject,
    pub account_id: i64,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ListAdminOpenPlatformEntriesQuery {
    pub subject: AdminOpenPlatformSubject,
    pub account_id: i64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CreateAdminOpenPlatformEntryCommand {
    pub subject: AdminOpenPlatformSubject,
    pub entry_uuid: String,
    pub audit_log_uuid: String,
    pub account_id: i64,
    pub key: String,
    pub entry_type: String,
    pub url: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UpdateAdminOpenPlatformEntryCommand {
    pub subject: AdminOpenPlatformSubject,
    pub account_id: i64,
    pub entry_id: i64,
    pub audit_log_uuid: String,
    pub key: Option<String>,
    pub entry_type: Option<String>,
    pub url: Option<String>,
    pub status: Option<String>,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DeleteAdminOpenPlatformEntryCommand {
    pub subject: AdminOpenPlatformSubject,
    pub account_id: i64,
    pub entry_id: i64,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ListAdminOpenPlatformPayBindingsQuery {
    pub subject: AdminOpenPlatformSubject,
    pub account_id: i64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CreateAdminOpenPlatformPayBindingCommand {
    pub subject: AdminOpenPlatformSubject,
    pub pay_binding_uuid: String,
    pub audit_log_uuid: String,
    pub account_id: i64,
    pub payment_account_id: String,
    pub payment_channel_id: Option<String>,
    pub scene: String,
    pub mode: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DeleteAdminOpenPlatformPayBindingCommand {
    pub subject: AdminOpenPlatformSubject,
    pub account_id: i64,
    pub binding_id: i64,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

pub trait AdminOpenPlatformStore {
    fn list_providers<'a>(
        &'a self,
        query: ListAdminOpenPlatformProvidersQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Vec<AdminOpenPlatformProviderItem>>;

    fn list_manifests<'a>(
        &'a self,
        query: ListAdminOpenPlatformManifestsQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Vec<AdminOpenPlatformManifestItem>>;

    fn list_accounts<'a>(
        &'a self,
        query: ListAdminOpenPlatformAccountsQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Vec<AdminOpenPlatformAccountItem>>;

    fn find_qr_default_entry<'a>(
        &'a self,
        query: FindOpenPlatformQrDefaultEntryQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<OpenPlatformQrDefaultEntryItem>>;

    fn get_account<'a>(
        &'a self,
        query: GetAdminOpenPlatformAccountQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformAccountItem>>;

    fn create_account<'a>(
        &'a self,
        command: CreateAdminOpenPlatformAccountCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, AdminOpenPlatformAccountItem>;

    fn update_account<'a>(
        &'a self,
        command: UpdateAdminOpenPlatformAccountCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformAccountItem>>;

    fn delete_account<'a>(
        &'a self,
        command: DeleteAdminOpenPlatformAccountCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformAccountItem>>;

    fn list_entries<'a>(
        &'a self,
        query: ListAdminOpenPlatformEntriesQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Vec<AdminOpenPlatformEntryItem>>;

    fn create_entry<'a>(
        &'a self,
        command: CreateAdminOpenPlatformEntryCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformEntryItem>>;

    fn update_entry<'a>(
        &'a self,
        command: UpdateAdminOpenPlatformEntryCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformEntryItem>>;

    fn delete_entry<'a>(
        &'a self,
        command: DeleteAdminOpenPlatformEntryCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformEntryItem>>;

    fn list_pay_bindings<'a>(
        &'a self,
        query: ListAdminOpenPlatformPayBindingsQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Vec<AdminOpenPlatformPayBindingItem>>;

    fn create_pay_binding<'a>(
        &'a self,
        command: CreateAdminOpenPlatformPayBindingCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformPayBindingItem>>;

    fn delete_pay_binding<'a>(
        &'a self,
        command: DeleteAdminOpenPlatformPayBindingCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformPayBindingItem>>;
}
