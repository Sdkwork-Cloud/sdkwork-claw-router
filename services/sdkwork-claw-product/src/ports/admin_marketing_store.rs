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

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct LoadAdminRechargeRecordQuery {
    pub subject: AdminMarketingSubject,
    pub order_no: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListAdminRechargePackagesQuery {
    pub subject: AdminMarketingSubject,
    pub status: Option<AdminRechargePackageStatus>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ListAdminExchangeRulesQuery {
    pub subject: AdminMarketingSubject,
    pub source_asset_type: Option<String>,
    pub target_asset_type: Option<String>,
    pub status: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UpdateAdminExchangeRuleCommand {
    pub subject: AdminMarketingSubject,
    pub audit_log_uuid: String,
    pub source_asset_type: String,
    pub target_asset_type: String,
    pub rate: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListAdminPaymentAttemptsQuery {
    pub subject: AdminMarketingSubject,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListAdminReferralStatsQuery {
    pub subject: AdminMarketingSubject,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum AdminRechargePackageStatus {
    Active,
    Inactive,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CreateAdminCouponCommand {
    pub subject: AdminMarketingSubject,
    pub coupon_uuid: String,
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
    pub coupon_id: String,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UpdateAdminCouponCommand {
    pub subject: AdminMarketingSubject,
    pub coupon_id: String,
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
pub struct GenerateAdminCouponBatchCommand {
    pub subject: AdminMarketingSubject,
    pub batch_uuid: String,
    pub audit_log_uuid: String,
    pub coupon_id: String,
    pub name: String,
    pub count: i64,
    pub prefix: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UpdateAdminPromoCodeStatusCommand {
    pub subject: AdminMarketingSubject,
    pub promo_code_id: String,
    pub status: String,
    pub audit_log_uuid: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CreateAdminRechargePackageCommand {
    pub subject: AdminMarketingSubject,
    pub package_uuid: String,
    pub product_uuid: String,
    pub sku_uuid: String,
    pub audit_log_uuid: String,
    pub rmb: String,
    pub bonus: i64,
    pub status: AdminRechargePackageStatus,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UpdateAdminRechargePackageCommand {
    pub subject: AdminMarketingSubject,
    pub package_id: String,
    pub product_uuid: String,
    pub sku_uuid: String,
    pub audit_log_uuid: String,
    pub rmb: String,
    pub bonus: i64,
    pub status: AdminRechargePackageStatus,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DeleteAdminRechargePackageCommand {
    pub subject: AdminMarketingSubject,
    pub package_id: String,
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
#[serde(rename_all = "camelCase")]
pub struct AdminRechargePackageItem {
    pub id: String,
    pub rmb: String,
    pub bonus: i64,
    pub points: i64,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AdminExchangeRuleItem {
    pub id: String,
    pub source_asset_type: String,
    pub target_asset_type: String,
    pub rate: String,
    pub status: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AdminPaymentAttemptItem {
    pub id: String,
    pub order_no: String,
    pub provider: String,
    pub amount: String,
    pub status: String,
    pub created_at: String,
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

    fn update_coupon<'a>(
        &'a self,
        command: UpdateAdminCouponCommand,
    ) -> AdminMarketingCommandFuture<'a, AdminCouponItem>;

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

    fn load_recharge_record<'a>(
        &'a self,
        query: LoadAdminRechargeRecordQuery,
    ) -> AdminMarketingCommandFuture<'a, Option<AdminRechargeRecordItem>>;

    fn list_recharge_packages<'a>(
        &'a self,
        query: ListAdminRechargePackagesQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminRechargePackageItem>>;

    fn list_exchange_rules<'a>(
        &'a self,
        query: ListAdminExchangeRulesQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminExchangeRuleItem>>;

    fn create_recharge_package<'a>(
        &'a self,
        command: CreateAdminRechargePackageCommand,
    ) -> AdminMarketingCommandFuture<'a, AdminRechargePackageItem>;

    fn update_recharge_package<'a>(
        &'a self,
        command: UpdateAdminRechargePackageCommand,
    ) -> AdminMarketingCommandFuture<'a, AdminRechargePackageItem>;

    fn delete_recharge_package<'a>(
        &'a self,
        command: DeleteAdminRechargePackageCommand,
    ) -> AdminMarketingCommandFuture<'a, bool>;

    fn update_exchange_rule<'a>(
        &'a self,
        command: UpdateAdminExchangeRuleCommand,
    ) -> AdminMarketingCommandFuture<'a, AdminExchangeRuleItem>;

    fn list_payment_attempts<'a>(
        &'a self,
        query: ListAdminPaymentAttemptsQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminPaymentAttemptItem>>;

    fn list_referral_stats<'a>(
        &'a self,
        query: ListAdminReferralStatsQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminReferralStatItem>>;
}
