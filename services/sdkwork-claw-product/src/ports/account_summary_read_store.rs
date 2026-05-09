use std::future::Future;
use std::pin::Pin;

use serde::Serialize;

use crate::domain::DomainResult;

pub type AccountSummaryReadFuture<'a> =
    Pin<Box<dyn Future<Output = DomainResult<AccountSummarySnapshot>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AccountSummarySubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
}

#[derive(Debug, Clone, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AccountSummarySnapshot {
    pub id: String,
    pub name: String,
    pub email: String,
    pub is_verified: bool,
    pub tier: String,
    pub organization: String,
    pub available_credits: f64,
    pub est_days_remaining: i64,
    pub monthly_consumption: f64,
    pub consumption_by_service: Vec<AccountConsumptionItem>,
    pub invoice_settings: AccountInvoiceSettings,
    pub security: AccountSecuritySummary,
    pub login_logs: Vec<AccountLoginLog>,
}

impl Default for AccountSummarySnapshot {
    fn default() -> Self {
        Self {
            id: String::new(),
            name: String::new(),
            email: String::new(),
            is_verified: false,
            tier: "Standard".to_owned(),
            organization: String::new(),
            available_credits: 0.0,
            est_days_remaining: 0,
            monthly_consumption: 0.0,
            consumption_by_service: Vec::new(),
            invoice_settings: AccountInvoiceSettings::default(),
            security: AccountSecuritySummary::default(),
            login_logs: Vec::new(),
        }
    }
}

#[derive(Debug, Clone, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AccountConsumptionItem {
    pub name: String,
    pub value: f64,
    pub color: String,
    pub percentage: f64,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AccountInvoiceSettings {
    pub org_full: String,
    pub tax_id: String,
    pub payment_method: String,
    pub invoice_type: String,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AccountSecuritySummary {
    pub mfa_enabled: bool,
    pub qps_limit: i64,
    pub ip_whitelist_count: i64,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AccountLoginLog {
    pub ip: String,
    pub location: String,
    pub device: String,
    pub time: String,
    pub status: String,
}

pub trait AccountSummaryReadStore {
    fn load_account_summary<'a>(
        &'a self,
        subject: Option<AccountSummarySubject>,
    ) -> AccountSummaryReadFuture<'a>;
}
