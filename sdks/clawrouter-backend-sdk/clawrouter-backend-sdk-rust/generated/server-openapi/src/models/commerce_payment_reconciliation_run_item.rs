use serde::{Deserialize, Serialize};

/// Commerce payment reconciliation run item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentReconciliationRunItem {
    /// Business date field on commerce payment reconciliation run item.
    #[serde(rename = "businessDate")]
    pub business_date: String,

    /// Created at field on commerce payment reconciliation run item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Finished at field on commerce payment reconciliation run item.
    #[serde(rename = "finishedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub finished_at: Option<String>,

    /// Id field on commerce payment reconciliation run item.
    pub id: String,

    /// Provider code field on commerce payment reconciliation run item.
    #[serde(rename = "providerCode")]
    pub provider_code: String,

    /// Run no field on commerce payment reconciliation run item.
    #[serde(rename = "runNo")]
    pub run_no: String,

    /// Status field on commerce payment reconciliation run item.
    pub status: String,
}
