use std::future::Future;
use std::pin::Pin;

use serde::Serialize;

use crate::domain::DomainResult;

pub type CheckoutReadFuture<'a, T> = Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct CheckoutSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct CheckoutStatusSnapshot {
    pub order_no: String,
    pub out_trade_no: String,
    pub amount: String,
    pub points: i64,
    pub payment_method: String,
    pub order_status: String,
    pub payment_status: String,
    pub recharge_status: String,
    pub status: String,
    pub created_at: String,
    pub expires_at: String,
    pub paid_at: String,
    pub next_action: String,
    pub qr_code_payload: String,
}

pub trait CheckoutStore {
    fn load_checkout_status<'a>(
        &'a self,
        subject: Option<CheckoutSubject>,
        order_no: String,
    ) -> CheckoutReadFuture<'a, Option<CheckoutStatusSnapshot>>;
}
