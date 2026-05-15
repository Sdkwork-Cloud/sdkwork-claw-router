use serde::{Deserialize, Serialize};

use crate::models::{AccountConsumptionItem, AccountInvoiceSettings, AccountLoginLog, AccountSecuritySummary};

/// Account summary response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AccountSummaryResponse {
    /// Available credits field on account summary response.
    #[serde(rename = "availableCredits")]
    pub available_credits: f64,

    /// Consumption by service field on account summary response.
    #[serde(rename = "consumptionByService")]
    pub consumption_by_service: Vec<AccountConsumptionItem>,

    /// Authenticated user's account email address.
    pub email: String,

    /// Est days remaining field on account summary response.
    #[serde(rename = "estDaysRemaining")]
    pub est_days_remaining: i64,

    /// Id field on account summary response.
    pub id: String,

    /// Invoice settings field on account summary response.
    #[serde(rename = "invoiceSettings")]
    pub invoice_settings: AccountInvoiceSettings,

    /// Is verified field on account summary response.
    #[serde(rename = "isVerified")]
    pub is_verified: bool,

    /// Login logs field on account summary response.
    #[serde(rename = "loginLogs")]
    pub login_logs: Vec<AccountLoginLog>,

    /// Monthly consumption field on account summary response.
    #[serde(rename = "monthlyConsumption")]
    pub monthly_consumption: f64,

    /// Name field on account summary response.
    pub name: String,

    /// Organization field on account summary response.
    pub organization: String,

    /// Security field on account summary response.
    pub security: AccountSecuritySummary,

    /// Tier field on account summary response.
    pub tier: String,
}
