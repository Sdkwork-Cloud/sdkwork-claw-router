use std::future::Future;
use std::pin::Pin;

use serde::Serialize;

use crate::domain::DomainResult;

pub type BillingReadFuture<'a, T> = Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;
pub type BillingCommandFuture<'a> =
    Pin<Box<dyn Future<Output = DomainResult<RedeemCodeOutcome>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct BillingSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RedeemCodeCommand {
    pub subject: BillingSubject,
    pub code: String,
    pub user_coupon_uuid: String,
    pub account_uuid: String,
    pub account_history_uuid: String,
    pub point_change_uuid: String,
    pub coupon_code: String,
    pub transaction_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct BillingRedeemHistoryItem {
    pub id: i64,
    pub code: String,
    pub amount: String,
    pub date: String,
    pub status: String,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct BillingRechargeHistoryItem {
    pub id: i64,
    pub order_no: String,
    pub method: String,
    pub amount: String,
    pub date: String,
    pub status: String,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct RedeemCodeOutcome {
    pub message: String,
    pub amount: String,
    pub credited_points: i64,
    pub balance: i64,
}

pub trait BillingStore {
    fn load_redeem_history<'a>(
        &'a self,
        subject: Option<BillingSubject>,
    ) -> BillingReadFuture<'a, Vec<BillingRedeemHistoryItem>>;

    fn load_recharge_history<'a>(
        &'a self,
        subject: Option<BillingSubject>,
    ) -> BillingReadFuture<'a, Vec<BillingRechargeHistoryItem>>;

    fn redeem_code<'a>(&'a self, command: RedeemCodeCommand) -> BillingCommandFuture<'a>;
}
