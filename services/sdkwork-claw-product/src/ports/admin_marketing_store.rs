use std::future::Future;
use std::pin::Pin;

use serde::Serialize;

use crate::domain::DomainResult;

pub type AdminMarketingCommandFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AdminMarketingSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub operator_id: i64,
    pub operator_type: i32,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListAdminCouponsQuery {
    pub subject: AdminMarketingSubject,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListAdminCouponBatchesQuery {
    pub subject: AdminMarketingSubject,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListAdminPromoCodesQuery {
    pub subject: AdminMarketingSubject,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListAdminRedemptionRecordsQuery {
    pub subject: AdminMarketingSubject,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListAdminRechargeRecordsQuery {
    pub subject: AdminMarketingSubject,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListAdminReferralStatsQuery {
    pub subject: AdminMarketingSubject,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CreateAdminCouponCommand {
    pub subject: AdminMarketingSubject,
    pub coupon_uuid: String,
    pub template_uuid: String,
    pub audit_log_uuid: String,
    pub name: String,
    pub coupon_type: String,
    pub value: String,
    pub amount_cents: i64,
    pub discount_value: Option<String>,
    pub status: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DeleteAdminCouponCommand {
    pub subject: AdminMarketingSubject,
    pub coupon_id: i64,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct GenerateAdminCouponBatchCommand {
    pub subject: AdminMarketingSubject,
    pub batch_uuid: String,
    pub audit_log_uuid: String,
    pub coupon_id: i64,
    pub name: String,
    pub count: i64,
    pub prefix: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UpdateAdminPromoCodeStatusCommand {
    pub subject: AdminMarketingSubject,
    pub promo_code_id: i64,
    pub status: String,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AdminCouponItem {
    pub id: String,
    pub name: String,
    #[serde(rename = "type")]
    pub coupon_type: String,
    pub value: String,
    pub status: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AdminCouponBatchItem {
    pub id: String,
    pub coupon_id: String,
    pub name: String,
    pub count: i64,
    pub prefix: String,
    pub created_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AdminPromoCodeItem {
    pub id: String,
    pub batch_id: String,
    pub code: String,
    pub status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub used_by: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub used_at: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AdminRedemptionRecordItem {
    pub id: String,
    pub user_id: String,
    pub user: String,
    pub code: String,
    pub amount: String,
    pub time: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AdminRechargeRecordItem {
    pub id: String,
    pub trade_no: String,
    pub user_id: String,
    pub user: String,
    pub amount: String,
    #[serde(rename = "usd_credited")]
    pub usd_credited: String,
    pub method: String,
    pub status: String,
    pub time: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct AdminReferralStatItem {
    pub id: String,
    pub inviter: String,
    pub total_invited: i64,
    pub total_revenue: String,
    pub bonus_awarded: String,
    pub link: String,
}

pub trait AdminMarketingStore {
    fn list_coupons<'a>(
        &'a self,
        query: ListAdminCouponsQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminCouponItem>>;

    fn create_coupon<'a>(
        &'a self,
        command: CreateAdminCouponCommand,
    ) -> AdminMarketingCommandFuture<'a, AdminCouponItem>;

    fn delete_coupon<'a>(
        &'a self,
        command: DeleteAdminCouponCommand,
    ) -> AdminMarketingCommandFuture<'a, bool>;

    fn list_batches<'a>(
        &'a self,
        query: ListAdminCouponBatchesQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminCouponBatchItem>>;

    fn generate_batch<'a>(
        &'a self,
        command: GenerateAdminCouponBatchCommand,
    ) -> AdminMarketingCommandFuture<'a, (AdminCouponBatchItem, Vec<AdminPromoCodeItem>)>;

    fn list_promo_codes<'a>(
        &'a self,
        query: ListAdminPromoCodesQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminPromoCodeItem>>;

    fn update_promo_code_status<'a>(
        &'a self,
        command: UpdateAdminPromoCodeStatusCommand,
    ) -> AdminMarketingCommandFuture<'a, bool>;

    fn list_redemption_records<'a>(
        &'a self,
        query: ListAdminRedemptionRecordsQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminRedemptionRecordItem>>;

    fn list_recharge_records<'a>(
        &'a self,
        query: ListAdminRechargeRecordsQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminRechargeRecordItem>>;

    fn list_referral_stats<'a>(
        &'a self,
        query: ListAdminReferralStatsQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminReferralStatItem>>;
}
