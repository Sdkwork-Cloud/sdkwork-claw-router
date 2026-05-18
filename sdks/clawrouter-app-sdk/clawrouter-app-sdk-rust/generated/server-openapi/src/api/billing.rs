use std::sync::Arc;

use crate::api::base::{RequestHeaders};
use crate::api::paths::app_path;
use crate::api::paths::append_query_string;
use crate::http::{SdkworkError, SdkworkHttpClient};
use crate::models::{AccountPointsExchangeRateRetrieveResult, AccountPointsExchangesCreateResult, AccountPointsExchangesRetrieveResult, AccountPointsExchangesRulesListResult, AccountPointsHistoryListResult, AccountPointsRechargesCreateResult, AccountPointsRechargesOrdersCancelResult, AccountPointsRechargesOrdersRetrieveResult, AccountPointsRechargesPackagesListResult, AccountPointsRechargesRecordsListResult, AccountPointsRetrieveResult, AccountPointsTransfersCreateResult, AccountSummaryRetrieveResult, AccountTokensDeductionsCreateResult, AccountTokensRetrieveResult, CommerceCouponClaimRequest, CommerceCouponUsageRequest, CommerceCouponUsageRollbackRequest, CommerceEmptyCommandRequest, CommercePreflightRequest, CommerceRechargeOrderCancelRequest, CommerceVipPrivilegeSpeedUpRequest, CommerceVipPurchaseRequest, CommerceWalletCommandRequest, CouponsCatalogListResult, CouponsCatalogRetrieveResult, CouponsClaimsCreateResult, CouponsRedeemCreateResult, CouponsUsageCreateResult, CouponsUsageReversalsCreateResult, PaymentsCheckoutRetrieveResult, PaymentsRecordsListResult, PaymentsRecordsRetrieveResult, PreflightEstimatesCreateResult, PreflightPrechecksCreateResult, PreflightPreholdsCreateResult, PreflightReleasesCreateResult, PreflightSettlementsCreateResult, RedeemCodeRequest, SettlementsDashboardListResult, SubmitRechargeRequest, UsersCurrentCouponsListResult, UsersCurrentCouponsRetrieveResult, VipBenefitsListResult, VipInfoRetrieveResult, VipLevelsListResult, VipPackGroupsListResult, VipPackGroupsPacksListResult, VipPackGroupsRetrieveResult, VipPacksListResult, VipPacksRetrieveResult, VipPointsBalanceRetrieveResult, VipPointsDailyRewardsCreateResult, VipPointsDailyRewardsStatusRetrieveResult, VipPointsHistoryListResult, VipPrivilegesSpeedUpsCreateResult, VipPrivilegesUsageRetrieveResult, VipPurchaseCreateResult, VipPurchaseRenewResult, VipPurchaseUpgradeResult, VipStatusRetrieveResult, WalletAccountsListResult, WalletExchangesCreateResult, WalletOperationsRetrieveResult, WalletOverviewRetrieveResult, WalletTopupsCreateResult, WalletTransactionsListResult, WalletTransactionsRetrieveResult, WalletTransfersCreateResult, WalletWithdrawalsCreateResult};

#[derive(Clone)]
pub struct BillingApi {
    client: Arc<SdkworkHttpClient>,
}

impl BillingApi {
    pub fn new(client: Arc<SdkworkHttpClient>) -> Self {
        Self { client }
    }

    /// Retrieve account points
    pub async fn account_points_retrieve(&self) -> Result<AccountPointsRetrieveResult, SdkworkError> {
        let path = app_path(&"/billing/account/points".to_string());
        self.client.get(&path, None, None).await
    }

    /// Retrieve account points exchange rate
    pub async fn account_points_exchange_rate_retrieve(&self) -> Result<AccountPointsExchangeRateRetrieveResult, SdkworkError> {
        let path = app_path(&"/billing/account/points/exchange_rate".to_string());
        self.client.get(&path, None, None).await
    }

    /// Create account points exchange
    pub async fn account_points_exchanges_create(&self, body: &CommerceWalletCommandRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<AccountPointsExchangesCreateResult, SdkworkError> {
        let path = app_path(&"/billing/account/points/exchanges".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// List account points exchange rules
    pub async fn account_points_exchanges_rules_list(&self, source_asset_type: Option<&str>, target_asset_type: Option<&str>) -> Result<AccountPointsExchangesRulesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("source_asset_type", source_asset_type, "form", true, false, None),
            QueryParameterSpec::new("target_asset_type", target_asset_type, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/billing/account/points/exchanges/rules".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Retrieve account points exchange
    pub async fn account_points_exchanges_retrieve(&self, exchange_no: &str) -> Result<AccountPointsExchangesRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/billing/account/points/exchanges/{}", serialize_path_parameter(exchange_no, PathParameterSpec::new("exchangeNo", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// List account points history
    pub async fn account_points_history_list(&self, page: Option<i64>, page_size: Option<i64>, cursor: Option<&str>) -> Result<AccountPointsHistoryListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("cursor", cursor, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/billing/account/points/history".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Create recharge
    pub async fn account_points_recharges_create(&self, body: &SubmitRechargeRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<AccountPointsRechargesCreateResult, SdkworkError> {
        let path = app_path(&"/billing/account/points/recharges".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Retrieve account points recharge order
    pub async fn account_points_recharges_orders_retrieve(&self, order_no: &str) -> Result<AccountPointsRechargesOrdersRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/billing/account/points/recharges/orders/{}", serialize_path_parameter(order_no, PathParameterSpec::new("orderNo", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Cancel account points recharge order
    pub async fn account_points_recharges_orders_cancel(&self, order_no: &str, body: &CommerceRechargeOrderCancelRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<AccountPointsRechargesOrdersCancelResult, SdkworkError> {
        let path = app_path(&format!("/billing/account/points/recharges/orders/{}/cancel", serialize_path_parameter(order_no, PathParameterSpec::new("orderNo", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// List packages
    pub async fn account_points_recharges_packages_list(&self) -> Result<AccountPointsRechargesPackagesListResult, SdkworkError> {
        let path = app_path(&"/billing/account/points/recharges/packages".to_string());
        self.client.get(&path, None, None).await
    }

    /// List account points recharge records
    pub async fn account_points_recharges_records_list(&self, page: Option<i64>, page_size: Option<i64>, cursor: Option<&str>) -> Result<AccountPointsRechargesRecordsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("cursor", cursor, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/billing/account/points/recharges/records".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Create account points transfer
    pub async fn account_points_transfers_create(&self, body: &CommerceWalletCommandRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<AccountPointsTransfersCreateResult, SdkworkError> {
        let path = app_path(&"/billing/account/points/transfers".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// List account details
    pub async fn account_summary_retrieve(&self) -> Result<AccountSummaryRetrieveResult, SdkworkError> {
        let path = app_path(&"/billing/account/summary".to_string());
        self.client.get(&path, None, None).await
    }

    /// Retrieve account tokens
    pub async fn account_tokens_retrieve(&self) -> Result<AccountTokensRetrieveResult, SdkworkError> {
        let path = app_path(&"/billing/account/tokens".to_string());
        self.client.get(&path, None, None).await
    }

    /// Create account token deduction
    pub async fn account_tokens_deductions_create(&self, body: &CommerceWalletCommandRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<AccountTokensDeductionsCreateResult, SdkworkError> {
        let path = app_path(&"/billing/account/tokens/deductions".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// List coupon catalog
    pub async fn coupons_catalog_list(&self, status: Option<&str>, page: Option<i64>, page_size: Option<i64>, cursor: Option<&str>) -> Result<CouponsCatalogListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("status", status, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("cursor", cursor, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/billing/coupons/catalog".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Retrieve coupon catalog item
    pub async fn coupons_catalog_retrieve(&self, coupon_id: &str) -> Result<CouponsCatalogRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/billing/coupons/catalog/{}", serialize_path_parameter(coupon_id, PathParameterSpec::new("couponId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Create coupon claim
    pub async fn coupons_claims_create(&self, body: &CommerceCouponClaimRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<CouponsClaimsCreateResult, SdkworkError> {
        let path = app_path(&"/billing/coupons/claims".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Redeem code
    pub async fn coupons_redeem_create(&self, body: &RedeemCodeRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<CouponsRedeemCreateResult, SdkworkError> {
        let path = app_path(&"/billing/coupons/redeem".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Create coupon usage
    pub async fn coupons_usage_create(&self, body: &CommerceCouponUsageRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<CouponsUsageCreateResult, SdkworkError> {
        let path = app_path(&"/billing/coupons/usage".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Create coupon usage reversal
    pub async fn coupons_usage_reversals_create(&self, body: &CommerceCouponUsageRollbackRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<CouponsUsageReversalsCreateResult, SdkworkError> {
        let path = app_path(&"/billing/coupons/usage_reversals".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// List checkout status
    pub async fn payments_checkout_retrieve(&self, order_no: &str) -> Result<PaymentsCheckoutRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/billing/payments/checkout/{}", serialize_path_parameter(order_no, PathParameterSpec::new("orderNo", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// List recharge history
    pub async fn payments_records_list(&self) -> Result<PaymentsRecordsListResult, SdkworkError> {
        let path = app_path(&"/billing/payments/records".to_string());
        self.client.get(&path, None, None).await
    }

    /// Retrieve payment record
    pub async fn payments_records_retrieve(&self, payment_id: &str) -> Result<PaymentsRecordsRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/billing/payments/records/{}", serialize_path_parameter(payment_id, PathParameterSpec::new("paymentId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Create preflight estimate
    pub async fn preflight_estimates_create(&self, body: &CommercePreflightRequest) -> Result<PreflightEstimatesCreateResult, SdkworkError> {
        let path = app_path(&"/billing/preflight/estimates".to_string());
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Create preflight precheck
    pub async fn preflight_prechecks_create(&self, body: &CommercePreflightRequest) -> Result<PreflightPrechecksCreateResult, SdkworkError> {
        let path = app_path(&"/billing/preflight/prechecks".to_string());
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Create preflight prehold
    pub async fn preflight_preholds_create(&self, body: &CommercePreflightRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<PreflightPreholdsCreateResult, SdkworkError> {
        let path = app_path(&"/billing/preflight/preholds".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Create preflight release
    pub async fn preflight_releases_create(&self, body: &CommercePreflightRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<PreflightReleasesCreateResult, SdkworkError> {
        let path = app_path(&"/billing/preflight/releases".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Create preflight settlement
    pub async fn preflight_settlements_create(&self, body: &CommercePreflightRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<PreflightSettlementsCreateResult, SdkworkError> {
        let path = app_path(&"/billing/preflight/settlements".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// List dashboard data
    pub async fn settlements_dashboard_list(&self, year: Option<i64>) -> Result<SettlementsDashboardListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("year", year, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/billing/settlements/dashboard".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// List redeem history
    pub async fn users_current_coupons_list(&self) -> Result<UsersCurrentCouponsListResult, SdkworkError> {
        let path = app_path(&"/billing/users/current/coupons".to_string());
        self.client.get(&path, None, None).await
    }

    /// Retrieve current user coupon
    pub async fn users_current_coupons_retrieve(&self, user_coupon_id: &str) -> Result<UsersCurrentCouponsRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/billing/users/current/coupons/{}", serialize_path_parameter(user_coupon_id, PathParameterSpec::new("userCouponId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// List VIP benefits
    pub async fn vip_benefits_list(&self) -> Result<VipBenefitsListResult, SdkworkError> {
        let path = app_path(&"/billing/vip/benefits".to_string());
        self.client.get(&path, None, None).await
    }

    /// Retrieve VIP info
    pub async fn vip_info_retrieve(&self) -> Result<VipInfoRetrieveResult, SdkworkError> {
        let path = app_path(&"/billing/vip/info".to_string());
        self.client.get(&path, None, None).await
    }

    /// List VIP levels
    pub async fn vip_levels_list(&self) -> Result<VipLevelsListResult, SdkworkError> {
        let path = app_path(&"/billing/vip/levels".to_string());
        self.client.get(&path, None, None).await
    }

    /// List VIP pack groups
    pub async fn get_vip_pack_groups_list(&self) -> Result<VipPackGroupsListResult, SdkworkError> {
        let path = app_path(&"/billing/vip/pack_groups".to_string());
        self.client.get(&path, None, None).await
    }

    /// Retrieve VIP pack group
    pub async fn vip_pack_groups_retrieve(&self, pack_group_id: &str) -> Result<VipPackGroupsRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/billing/vip/pack_groups/{}", serialize_path_parameter(pack_group_id, PathParameterSpec::new("packGroupId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// List VIP pack group packs
    pub async fn get_vip_pack_groups_list_pack_groups(&self, pack_group_id: &str) -> Result<VipPackGroupsPacksListResult, SdkworkError> {
        let path = app_path(&format!("/billing/vip/pack_groups/{}/packs", serialize_path_parameter(pack_group_id, PathParameterSpec::new("packGroupId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// List VIP packs
    pub async fn vip_packs_list(&self) -> Result<VipPacksListResult, SdkworkError> {
        let path = app_path(&"/billing/vip/packs".to_string());
        self.client.get(&path, None, None).await
    }

    /// Retrieve VIP pack
    pub async fn vip_packs_retrieve(&self, pack_id: &str) -> Result<VipPacksRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/billing/vip/packs/{}", serialize_path_parameter(pack_id, PathParameterSpec::new("packId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Retrieve VIP points balance
    pub async fn vip_points_balance_retrieve(&self) -> Result<VipPointsBalanceRetrieveResult, SdkworkError> {
        let path = app_path(&"/billing/vip/points/balance".to_string());
        self.client.get(&path, None, None).await
    }

    /// Create VIP daily reward
    pub async fn vip_points_daily_rewards_create(&self, body: &CommerceEmptyCommandRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<VipPointsDailyRewardsCreateResult, SdkworkError> {
        let path = app_path(&"/billing/vip/points/daily_rewards".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Retrieve VIP daily reward status
    pub async fn vip_points_daily_rewards_status_retrieve(&self) -> Result<VipPointsDailyRewardsStatusRetrieveResult, SdkworkError> {
        let path = app_path(&"/billing/vip/points/daily_rewards/status".to_string());
        self.client.get(&path, None, None).await
    }

    /// List VIP points history
    pub async fn vip_points_history_list(&self, page: Option<i64>, page_size: Option<i64>, cursor: Option<&str>) -> Result<VipPointsHistoryListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("cursor", cursor, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/billing/vip/points/history".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Create VIP privilege speed up
    pub async fn vip_privileges_speed_ups_create(&self, body: &CommerceVipPrivilegeSpeedUpRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<VipPrivilegesSpeedUpsCreateResult, SdkworkError> {
        let path = app_path(&"/billing/vip/privileges/speed_ups".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Retrieve VIP privilege usage
    pub async fn vip_privileges_usage_retrieve(&self) -> Result<VipPrivilegesUsageRetrieveResult, SdkworkError> {
        let path = app_path(&"/billing/vip/privileges/usage".to_string());
        self.client.get(&path, None, None).await
    }

    /// Create VIP purchase
    pub async fn vip_purchase_create(&self, body: &CommerceVipPurchaseRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<VipPurchaseCreateResult, SdkworkError> {
        let path = app_path(&"/billing/vip/purchase".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Renew VIP purchase
    pub async fn vip_purchase_renew(&self, body: &CommerceVipPurchaseRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<VipPurchaseRenewResult, SdkworkError> {
        let path = app_path(&"/billing/vip/purchase/renew".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Upgrade VIP purchase
    pub async fn vip_purchase_upgrade(&self, body: &CommerceVipPurchaseRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<VipPurchaseUpgradeResult, SdkworkError> {
        let path = app_path(&"/billing/vip/purchase/upgrade".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Retrieve VIP status
    pub async fn vip_status_retrieve(&self) -> Result<VipStatusRetrieveResult, SdkworkError> {
        let path = app_path(&"/billing/vip/status".to_string());
        self.client.get(&path, None, None).await
    }

    /// List wallet accounts
    pub async fn wallet_accounts_list(&self, asset_type: Option<&str>) -> Result<WalletAccountsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("asset_type", asset_type, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/billing/wallet/accounts".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Create wallet exchange
    pub async fn wallet_exchanges_create(&self, body: &CommerceWalletCommandRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<WalletExchangesCreateResult, SdkworkError> {
        let path = app_path(&"/billing/wallet/exchanges".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Retrieve wallet operation
    pub async fn wallet_operations_retrieve(&self, request_no: &str) -> Result<WalletOperationsRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/billing/wallet/operations/{}", serialize_path_parameter(request_no, PathParameterSpec::new("requestNo", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Retrieve wallet overview
    pub async fn wallet_overview_retrieve(&self) -> Result<WalletOverviewRetrieveResult, SdkworkError> {
        let path = app_path(&"/billing/wallet/overview".to_string());
        self.client.get(&path, None, None).await
    }

    /// Create wallet topup
    pub async fn wallet_topups_create(&self, body: &CommerceWalletCommandRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<WalletTopupsCreateResult, SdkworkError> {
        let path = app_path(&"/billing/wallet/topups".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// List wallet transactions
    pub async fn wallet_transactions_list(&self, page: Option<i64>, page_size: Option<i64>, cursor: Option<&str>) -> Result<WalletTransactionsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("cursor", cursor, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/billing/wallet/transactions".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Retrieve wallet transaction
    pub async fn wallet_transactions_retrieve(&self, transaction_id: &str) -> Result<WalletTransactionsRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/billing/wallet/transactions/{}", serialize_path_parameter(transaction_id, PathParameterSpec::new("transactionId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Create wallet transfer
    pub async fn wallet_transfers_create(&self, body: &CommerceWalletCommandRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<WalletTransfersCreateResult, SdkworkError> {
        let path = app_path(&"/billing/wallet/transfers".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Create wallet withdrawal
    pub async fn wallet_withdrawals_create(&self, body: &CommerceWalletCommandRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<WalletWithdrawalsCreateResult, SdkworkError> {
        let path = app_path(&"/billing/wallet/withdrawals".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

}

struct PathParameterSpec<'a> {
    name: &'a str,
    style: &'a str,
    explode: bool,
}

impl<'a> PathParameterSpec<'a> {
    fn new(name: &'a str, style: &'a str, explode: bool) -> Self {
        Self { name, style, explode }
    }
}

fn serialize_path_parameter<T: serde::Serialize>(value: T, spec: PathParameterSpec<'_>) -> String {
    let value = serde_json::to_value(value).unwrap_or(serde_json::Value::Null);
    if value.is_null() {
        return String::new();
    }
    let style = if spec.style.is_empty() { "simple" } else { spec.style };
    match value {
        serde_json::Value::Array(values) => serialize_path_array(spec.name, &values, style, spec.explode),
        serde_json::Value::Object(values) => serialize_path_object(spec.name, &values, style, spec.explode),
        value => format!("{}{}", path_primitive_prefix(spec.name, style), percent_encode(&primitive_to_string(&value))),
    }
}

fn serialize_path_array(name: &str, values: &[serde_json::Value], style: &str, explode: bool) -> String {
    let serialized = values
        .iter()
        .filter(|value| !value.is_null())
        .map(|value| percent_encode(&primitive_to_string(value)))
        .collect::<Vec<_>>();
    if serialized.is_empty() {
        return path_prefix(name, style);
    }
    if style == "matrix" {
        if explode {
            return serialized.iter().map(|item| format!(";{}={}", name, item)).collect::<Vec<_>>().join("");
        }
        return format!(";{}={}", name, serialized.join(","));
    }
    let separator = if explode { "." } else { "," };
    format!("{}{}", path_prefix(name, style), serialized.join(separator))
}

fn serialize_path_object(
    name: &str,
    values: &serde_json::Map<String, serde_json::Value>,
    style: &str,
    explode: bool,
) -> String {
    let mut entries = Vec::new();
    let mut exploded = Vec::new();
    for (key, value) in values {
        if value.is_null() {
            continue;
        }
        let escaped_key = percent_encode(key);
        let escaped_value = percent_encode(&primitive_to_string(value));
        if explode {
            if style == "matrix" {
                exploded.push(format!(";{}={}", escaped_key, escaped_value));
            } else {
                exploded.push(format!("{}={}", escaped_key, escaped_value));
            }
        } else {
            entries.push(escaped_key);
            entries.push(escaped_value);
        }
    }
    if style == "matrix" {
        if explode {
            return exploded.join("");
        }
        return format!(";{}={}", name, entries.join(","));
    }
    if explode {
        let separator = if style == "label" { "." } else { "," };
        return format!("{}{}", path_prefix(name, style), exploded.join(separator));
    }
    format!("{}{}", path_prefix(name, style), entries.join(","))
}

fn path_prefix(name: &str, style: &str) -> String {
    match style {
        "label" => ".".to_string(),
        "matrix" => format!(";{}", name),
        _ => String::new(),
    }
}

fn path_primitive_prefix(name: &str, style: &str) -> String {
    if style == "matrix" {
        format!(";{}=", name)
    } else {
        path_prefix(name, style)
    }
}

struct HeaderParameterSpec {
    value: serde_json::Value,
    explode: bool,
    content_type: Option<&'static str>,
}

impl HeaderParameterSpec {
    fn new<T: serde::Serialize>(
        value: T,
        _style: &'static str,
        explode: bool,
        content_type: Option<&'static str>,
    ) -> Self {
        Self {
            value: serde_json::to_value(value).unwrap_or(serde_json::Value::Null),
            explode,
            content_type,
        }
    }
}

fn build_request_headers(headers: &[(&str, HeaderParameterSpec)], cookies: &[(&str, HeaderParameterSpec)]) -> Option<RequestHeaders> {
    let mut request_headers = RequestHeaders::new();
    for (name, parameter) in headers {
        if let Some(value) = serialize_header_parameter(parameter) {
            request_headers.insert((*name).to_string(), value);
        }
    }

    let cookie_header = build_cookie_header(cookies);
    if !cookie_header.is_empty() {
        request_headers
            .entry("Cookie".to_string())
            .and_modify(|existing| {
                existing.push_str("; ");
                existing.push_str(&cookie_header);
            })
            .or_insert(cookie_header);
    }

    if request_headers.is_empty() {
        None
    } else {
        Some(request_headers)
    }
}

fn build_cookie_header(cookies: &[(&str, HeaderParameterSpec)]) -> String {
    cookies
        .iter()
        .filter_map(|(name, value)| {
            serialize_header_parameter(value)
                .map(|value| format!("{}={}", percent_encode(name), percent_encode(&value)))
        })
        .collect::<Vec<_>>()
        .join("; ")
}

fn serialize_header_parameter(parameter: &HeaderParameterSpec) -> Option<String> {
    if parameter.value.is_null() {
        return None;
    }
    if parameter.content_type.is_some() {
        return Some(parameter.value.to_string());
    }
    match &parameter.value {
        serde_json::Value::Null => None,
        serde_json::Value::String(value) => Some(value.clone()),
        serde_json::Value::Number(value) => Some(value.to_string()),
        serde_json::Value::Bool(value) => Some(value.to_string()),
        serde_json::Value::Array(values) => {
            let serialized = values
                .iter()
                .filter_map(serialize_json_value)
                .collect::<Vec<_>>();
            if serialized.is_empty() {
                None
            } else {
                Some(serialized.join(","))
            }
        }
        serde_json::Value::Object(values) => {
            let serialized = values
                .iter()
                .filter_map(|(key, value)| {
                    serialize_json_value(value).map(|serialized| {
                        if parameter.explode {
                            format!("{}={}", key, serialized)
                        } else {
                            format!("{},{}", key, serialized)
                        }
                    })
                })
                .collect::<Vec<_>>();
            if serialized.is_empty() {
                None
            } else {
                Some(serialized.join(","))
            }
        }
    }
}

fn serialize_json_value(value: &serde_json::Value) -> Option<String> {
    match value {
        serde_json::Value::Null => None,
        serde_json::Value::String(value) => Some(value.clone()),
        serde_json::Value::Number(value) => Some(value.to_string()),
        serde_json::Value::Bool(value) => Some(value.to_string()),
        other => Some(other.to_string()),
    }
}

struct QueryParameterSpec<'a> {
    name: &'a str,
    value: serde_json::Value,
    style: &'a str,
    explode: bool,
    allow_reserved: bool,
    content_type: Option<&'a str>,
}

impl<'a> QueryParameterSpec<'a> {
    fn new<T: serde::Serialize>(
        name: &'a str,
        value: T,
        style: &'a str,
        explode: bool,
        allow_reserved: bool,
        content_type: Option<&'a str>,
    ) -> Self {
        Self {
            name,
            value: serde_json::to_value(value).unwrap_or(serde_json::Value::Null),
            style,
            explode,
            allow_reserved,
            content_type,
        }
    }
}

fn build_query_string(parameters: &[QueryParameterSpec<'_>]) -> String {
    let mut pairs = Vec::new();
    for parameter in parameters {
        append_serialized_parameter(&mut pairs, parameter);
    }
    pairs.join("&")
}

fn append_serialized_parameter(pairs: &mut Vec<String>, parameter: &QueryParameterSpec<'_>) {
    if parameter.value.is_null() {
        return;
    }
    if parameter.content_type.is_some() {
        pairs.push(format!(
            "{}={}",
            percent_encode(parameter.name),
            encode_query_value(&parameter.value.to_string(), parameter.allow_reserved)
        ));
        return;
    }

    let style = if parameter.style.is_empty() { "form" } else { parameter.style };
    match &parameter.value {
        serde_json::Value::Array(values) => append_array_parameter(pairs, parameter.name, values, style, parameter.explode, parameter.allow_reserved),
        serde_json::Value::Object(values) if style == "deepObject" => append_deep_object_parameter(pairs, parameter.name, values, parameter.allow_reserved),
        serde_json::Value::Object(values) => append_object_parameter(pairs, parameter.name, values, style, parameter.explode, parameter.allow_reserved),
        value => pairs.push(format!("{}={}", percent_encode(parameter.name), encode_query_value(&primitive_to_string(value), parameter.allow_reserved))),
    }
}

fn append_array_parameter(
    pairs: &mut Vec<String>,
    name: &str,
    values: &[serde_json::Value],
    style: &str,
    explode: bool,
    allow_reserved: bool,
) {
    let serialized = values.iter().filter(|value| !value.is_null()).map(primitive_to_string).collect::<Vec<_>>();
    if serialized.is_empty() {
        return;
    }
    if style == "form" && explode {
        for item in serialized {
            pairs.push(format!("{}={}", percent_encode(name), encode_query_value(&item, allow_reserved)));
        }
        return;
    }
    pairs.push(format!("{}={}", percent_encode(name), encode_query_value(&serialized.join(","), allow_reserved)));
}

fn append_object_parameter(
    pairs: &mut Vec<String>,
    name: &str,
    values: &serde_json::Map<String, serde_json::Value>,
    style: &str,
    explode: bool,
    allow_reserved: bool,
) {
    let mut serialized = Vec::new();
    for (key, value) in values {
        if value.is_null() {
            continue;
        }
        if style == "form" && explode {
            pairs.push(format!("{}={}", percent_encode(key), encode_query_value(&primitive_to_string(value), allow_reserved)));
        } else {
            serialized.push(key.clone());
            serialized.push(primitive_to_string(value));
        }
    }
    if !serialized.is_empty() {
        pairs.push(format!("{}={}", percent_encode(name), encode_query_value(&serialized.join(","), allow_reserved)));
    }
}

fn append_deep_object_parameter(
    pairs: &mut Vec<String>,
    name: &str,
    values: &serde_json::Map<String, serde_json::Value>,
    allow_reserved: bool,
) {
    for (key, value) in values {
        if !value.is_null() {
            pairs.push(format!("{}={}", percent_encode(&format!("{}[{}]", name, key)), encode_query_value(&primitive_to_string(value), allow_reserved)));
        }
    }
}

fn encode_query_value(value: &str, allow_reserved: bool) -> String {
    let mut encoded = percent_encode(value);
    if !allow_reserved {
        return encoded;
    }
    for (escaped, reserved) in [
        ("%3A", ":"), ("%2F", "/"), ("%3F", "?"), ("%23", "#"),
        ("%5B", "["), ("%5D", "]"), ("%40", "@"), ("%21", "!"),
        ("%24", "$"), ("%26", "&"), ("%27", "'"), ("%28", "("),
        ("%29", ")"), ("%2A", "*"), ("%2B", "+"), ("%2C", ","),
        ("%3B", ";"), ("%3D", "="),
    ] {
        encoded = encoded.replace(escaped, reserved);
    }
    encoded
}

fn primitive_to_string(value: &serde_json::Value) -> String {
    match value {
        serde_json::Value::String(value) => value.clone(),
        serde_json::Value::Number(value) => value.to_string(),
        serde_json::Value::Bool(value) => value.to_string(),
        other => other.to_string(),
    }
}

fn percent_encode(value: &str) -> String {
    value
        .bytes()
        .flat_map(|byte| match byte {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                vec![byte as char]
            }
            _ => format!("%{:02X}", byte).chars().collect(),
        })
        .collect()
}
