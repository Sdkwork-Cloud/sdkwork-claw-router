use std::future::Future;
use std::pin::Pin;

use serde::Serialize;

use crate::domain::DomainResult;

pub type RechargeReadFuture<'a, T> = Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;
pub type RechargeCommandFuture<'a> =
    Pin<Box<dyn Future<Output = DomainResult<SubmitRechargeOutcome>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RechargeSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
}

#[derive(Debug, Clone, PartialEq)]
pub struct SubmitRechargeCommand {
    pub subject: RechargeSubject,
    pub amount: String,
    pub method: String,
    pub order_uuid: String,
    pub order_item_uuid: String,
    pub payment_uuid: String,
    pub recharge_uuid: String,
    pub order_sn: String,
    pub out_trade_no: String,
    pub requested_at: String,
    pub expire_at: String,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct RechargePackage {
    pub id: String,
    pub rmb: String,
    pub bonus: i64,
    pub points: i64,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct SubmitRechargeOutcome {
    pub success: bool,
    pub order_no: String,
    pub amount: String,
    pub points: i64,
    pub payment_method: String,
    pub status: String,
}

pub trait RechargeStore {
    fn load_recharge_packages<'a>(
        &'a self,
        subject: Option<RechargeSubject>,
    ) -> RechargeReadFuture<'a, Vec<RechargePackage>>;

    fn submit_recharge<'a>(&'a self, command: SubmitRechargeCommand) -> RechargeCommandFuture<'a>;
}
