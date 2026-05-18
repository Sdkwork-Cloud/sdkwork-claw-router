package com.sdkwork.clawrouter.app.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.sdkwork.clawrouter.app.http.HttpClient;
import com.sdkwork.clawrouter.app.model.*;
import java.util.List;
import java.util.Map;

public class BillingApi {
    private final HttpClient client;
    
    public BillingApi(HttpClient client) {
        this.client = client;
    }

    /** Retrieve account points */
    public AccountPointsRetrieveResult accountPointsRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/account/points"));
        return client.convertValue(raw, new TypeReference<AccountPointsRetrieveResult>() {});
    }

    /** Retrieve account points exchange rate */
    public AccountPointsExchangeRateRetrieveResult accountPointsExchangeRateRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/account/points/exchange_rate"));
        return client.convertValue(raw, new TypeReference<AccountPointsExchangeRateRetrieveResult>() {});
    }

    /** Create account points exchange */
    public AccountPointsExchangesCreateResult accountPointsExchangesCreate(CommerceWalletCommandRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/account/points/exchanges"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<AccountPointsExchangesCreateResult>() {});
    }

    /** List account points exchange rules */
    public AccountPointsExchangesRulesListResult accountPointsExchangesRulesList(String sourceAssetType, String targetAssetType) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("source_asset_type", sourceAssetType, "form", true, false, null),
            new QueryParameterSpec("target_asset_type", targetAssetType, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/account/points/exchanges/rules"), query));
        return client.convertValue(raw, new TypeReference<AccountPointsExchangesRulesListResult>() {});
    }

    /** Retrieve account points exchange */
    public AccountPointsExchangesRetrieveResult accountPointsExchangesRetrieve(String exchangeNo) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/account/points/exchanges/" + serializePathParameter(exchangeNo, new PathParameterSpec("exchangeNo", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<AccountPointsExchangesRetrieveResult>() {});
    }

    /** List account points history */
    public AccountPointsHistoryListResult accountPointsHistoryList(Integer page, Integer pageSize, String cursor) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/account/points/history"), query));
        return client.convertValue(raw, new TypeReference<AccountPointsHistoryListResult>() {});
    }

    /** Create recharge */
    public AccountPointsRechargesCreateResult accountPointsRechargesCreate(SubmitRechargeRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/account/points/recharges"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<AccountPointsRechargesCreateResult>() {});
    }

    /** Retrieve account points recharge order */
    public AccountPointsRechargesOrdersRetrieveResult accountPointsRechargesOrdersRetrieve(String orderNo) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/account/points/recharges/orders/" + serializePathParameter(orderNo, new PathParameterSpec("orderNo", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<AccountPointsRechargesOrdersRetrieveResult>() {});
    }

    /** Cancel account points recharge order */
    public AccountPointsRechargesOrdersCancelResult accountPointsRechargesOrdersCancel(String orderNo, CommerceRechargeOrderCancelRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/account/points/recharges/orders/" + serializePathParameter(orderNo, new PathParameterSpec("orderNo", "simple", false)) + "/cancel"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<AccountPointsRechargesOrdersCancelResult>() {});
    }

    /** List packages */
    public AccountPointsRechargesPackagesListResult accountPointsRechargesPackagesList() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/account/points/recharges/packages"));
        return client.convertValue(raw, new TypeReference<AccountPointsRechargesPackagesListResult>() {});
    }

    /** List account points recharge records */
    public AccountPointsRechargesRecordsListResult accountPointsRechargesRecordsList(Integer page, Integer pageSize, String cursor) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/account/points/recharges/records"), query));
        return client.convertValue(raw, new TypeReference<AccountPointsRechargesRecordsListResult>() {});
    }

    /** Create account points transfer */
    public AccountPointsTransfersCreateResult accountPointsTransfersCreate(CommerceWalletCommandRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/account/points/transfers"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<AccountPointsTransfersCreateResult>() {});
    }

    /** List account details */
    public AccountSummaryRetrieveResult accountSummaryRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/account/summary"));
        return client.convertValue(raw, new TypeReference<AccountSummaryRetrieveResult>() {});
    }

    /** Retrieve account tokens */
    public AccountTokensRetrieveResult accountTokensRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/account/tokens"));
        return client.convertValue(raw, new TypeReference<AccountTokensRetrieveResult>() {});
    }

    /** Create account token deduction */
    public AccountTokensDeductionsCreateResult accountTokensDeductionsCreate(CommerceWalletCommandRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/account/tokens/deductions"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<AccountTokensDeductionsCreateResult>() {});
    }

    /** List coupon catalog */
    public CouponsCatalogListResult couponsCatalogList(String status, Integer page, Integer pageSize, String cursor) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("status", status, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/coupons/catalog"), query));
        return client.convertValue(raw, new TypeReference<CouponsCatalogListResult>() {});
    }

    /** Retrieve coupon catalog item */
    public CouponsCatalogRetrieveResult couponsCatalogRetrieve(String couponId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/coupons/catalog/" + serializePathParameter(couponId, new PathParameterSpec("couponId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<CouponsCatalogRetrieveResult>() {});
    }

    /** Create coupon claim */
    public CouponsClaimsCreateResult couponsClaimsCreate(CommerceCouponClaimRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/coupons/claims"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CouponsClaimsCreateResult>() {});
    }

    /** Redeem code */
    public CouponsRedeemCreateResult couponsRedeemCreate(RedeemCodeRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/coupons/redeem"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CouponsRedeemCreateResult>() {});
    }

    /** Create coupon usage */
    public CouponsUsageCreateResult couponsUsageCreate(CommerceCouponUsageRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/coupons/usage"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CouponsUsageCreateResult>() {});
    }

    /** Create coupon usage reversal */
    public CouponsUsageReversalsCreateResult couponsUsageReversalsCreate(CommerceCouponUsageRollbackRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/coupons/usage_reversals"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CouponsUsageReversalsCreateResult>() {});
    }

    /** List checkout status */
    public PaymentsCheckoutRetrieveResult paymentsCheckoutRetrieve(String orderNo) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/payments/checkout/" + serializePathParameter(orderNo, new PathParameterSpec("orderNo", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<PaymentsCheckoutRetrieveResult>() {});
    }

    /** List recharge history */
    public PaymentsRecordsListResult paymentsRecordsList() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/payments/records"));
        return client.convertValue(raw, new TypeReference<PaymentsRecordsListResult>() {});
    }

    /** Retrieve payment record */
    public PaymentsRecordsRetrieveResult paymentsRecordsRetrieve(String paymentId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/payments/records/" + serializePathParameter(paymentId, new PathParameterSpec("paymentId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<PaymentsRecordsRetrieveResult>() {});
    }

    /** Create preflight estimate */
    public PreflightEstimatesCreateResult preflightEstimatesCreate(CommercePreflightRequest body) throws Exception {
        Object raw = client.post(ApiPaths.appPath("/billing/preflight/estimates"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<PreflightEstimatesCreateResult>() {});
    }

    /** Create preflight precheck */
    public PreflightPrechecksCreateResult preflightPrechecksCreate(CommercePreflightRequest body) throws Exception {
        Object raw = client.post(ApiPaths.appPath("/billing/preflight/prechecks"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<PreflightPrechecksCreateResult>() {});
    }

    /** Create preflight prehold */
    public PreflightPreholdsCreateResult preflightPreholdsCreate(CommercePreflightRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/preflight/preholds"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<PreflightPreholdsCreateResult>() {});
    }

    /** Create preflight release */
    public PreflightReleasesCreateResult preflightReleasesCreate(CommercePreflightRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/preflight/releases"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<PreflightReleasesCreateResult>() {});
    }

    /** Create preflight settlement */
    public PreflightSettlementsCreateResult preflightSettlementsCreate(CommercePreflightRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/preflight/settlements"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<PreflightSettlementsCreateResult>() {});
    }

    /** List dashboard data */
    public SettlementsDashboardListResult settlementsDashboardList(Integer year) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("year", year, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/settlements/dashboard"), query));
        return client.convertValue(raw, new TypeReference<SettlementsDashboardListResult>() {});
    }

    /** List redeem history */
    public UsersCurrentCouponsListResult usersCurrentCouponsList() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/users/current/coupons"));
        return client.convertValue(raw, new TypeReference<UsersCurrentCouponsListResult>() {});
    }

    /** Retrieve current user coupon */
    public UsersCurrentCouponsRetrieveResult usersCurrentCouponsRetrieve(String userCouponId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/users/current/coupons/" + serializePathParameter(userCouponId, new PathParameterSpec("userCouponId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<UsersCurrentCouponsRetrieveResult>() {});
    }

    /** List VIP benefits */
    public VipBenefitsListResult vipBenefitsList() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/vip/benefits"));
        return client.convertValue(raw, new TypeReference<VipBenefitsListResult>() {});
    }

    /** Retrieve VIP info */
    public VipInfoRetrieveResult vipInfoRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/vip/info"));
        return client.convertValue(raw, new TypeReference<VipInfoRetrieveResult>() {});
    }

    /** List VIP levels */
    public VipLevelsListResult vipLevelsList() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/vip/levels"));
        return client.convertValue(raw, new TypeReference<VipLevelsListResult>() {});
    }

    /** List VIP pack groups */
    public VipPackGroupsListResult getVipPackGroupsList() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/vip/pack_groups"));
        return client.convertValue(raw, new TypeReference<VipPackGroupsListResult>() {});
    }

    /** Retrieve VIP pack group */
    public VipPackGroupsRetrieveResult vipPackGroupsRetrieve(String packGroupId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/vip/pack_groups/" + serializePathParameter(packGroupId, new PathParameterSpec("packGroupId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<VipPackGroupsRetrieveResult>() {});
    }

    /** List VIP pack group packs */
    public VipPackGroupsPacksListResult getVipPackGroupsListPackGroups(String packGroupId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/vip/pack_groups/" + serializePathParameter(packGroupId, new PathParameterSpec("packGroupId", "simple", false)) + "/packs"));
        return client.convertValue(raw, new TypeReference<VipPackGroupsPacksListResult>() {});
    }

    /** List VIP packs */
    public VipPacksListResult vipPacksList() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/vip/packs"));
        return client.convertValue(raw, new TypeReference<VipPacksListResult>() {});
    }

    /** Retrieve VIP pack */
    public VipPacksRetrieveResult vipPacksRetrieve(String packId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/vip/packs/" + serializePathParameter(packId, new PathParameterSpec("packId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<VipPacksRetrieveResult>() {});
    }

    /** Retrieve VIP points balance */
    public VipPointsBalanceRetrieveResult vipPointsBalanceRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/vip/points/balance"));
        return client.convertValue(raw, new TypeReference<VipPointsBalanceRetrieveResult>() {});
    }

    /** Create VIP daily reward */
    public VipPointsDailyRewardsCreateResult vipPointsDailyRewardsCreate(CommerceEmptyCommandRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/vip/points/daily_rewards"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<VipPointsDailyRewardsCreateResult>() {});
    }

    /** Retrieve VIP daily reward status */
    public VipPointsDailyRewardsStatusRetrieveResult vipPointsDailyRewardsStatusRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/vip/points/daily_rewards/status"));
        return client.convertValue(raw, new TypeReference<VipPointsDailyRewardsStatusRetrieveResult>() {});
    }

    /** List VIP points history */
    public VipPointsHistoryListResult vipPointsHistoryList(Integer page, Integer pageSize, String cursor) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/vip/points/history"), query));
        return client.convertValue(raw, new TypeReference<VipPointsHistoryListResult>() {});
    }

    /** Create VIP privilege speed up */
    public VipPrivilegesSpeedUpsCreateResult vipPrivilegesSpeedUpsCreate(CommerceVipPrivilegeSpeedUpRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/vip/privileges/speed_ups"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<VipPrivilegesSpeedUpsCreateResult>() {});
    }

    /** Retrieve VIP privilege usage */
    public VipPrivilegesUsageRetrieveResult vipPrivilegesUsageRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/vip/privileges/usage"));
        return client.convertValue(raw, new TypeReference<VipPrivilegesUsageRetrieveResult>() {});
    }

    /** Create VIP purchase */
    public VipPurchaseCreateResult vipPurchaseCreate(CommerceVipPurchaseRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/vip/purchase"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<VipPurchaseCreateResult>() {});
    }

    /** Renew VIP purchase */
    public VipPurchaseRenewResult vipPurchaseRenew(CommerceVipPurchaseRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/vip/purchase/renew"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<VipPurchaseRenewResult>() {});
    }

    /** Upgrade VIP purchase */
    public VipPurchaseUpgradeResult vipPurchaseUpgrade(CommerceVipPurchaseRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/vip/purchase/upgrade"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<VipPurchaseUpgradeResult>() {});
    }

    /** Retrieve VIP status */
    public VipStatusRetrieveResult vipStatusRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/vip/status"));
        return client.convertValue(raw, new TypeReference<VipStatusRetrieveResult>() {});
    }

    /** List wallet accounts */
    public WalletAccountsListResult walletAccountsList(String assetType) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("asset_type", assetType, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/wallet/accounts"), query));
        return client.convertValue(raw, new TypeReference<WalletAccountsListResult>() {});
    }

    /** Create wallet exchange */
    public WalletExchangesCreateResult walletExchangesCreate(CommerceWalletCommandRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/wallet/exchanges"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<WalletExchangesCreateResult>() {});
    }

    /** Retrieve wallet operation */
    public WalletOperationsRetrieveResult walletOperationsRetrieve(String requestNo) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/wallet/operations/" + serializePathParameter(requestNo, new PathParameterSpec("requestNo", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<WalletOperationsRetrieveResult>() {});
    }

    /** Retrieve wallet overview */
    public WalletOverviewRetrieveResult walletOverviewRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/wallet/overview"));
        return client.convertValue(raw, new TypeReference<WalletOverviewRetrieveResult>() {});
    }

    /** Create wallet topup */
    public WalletTopupsCreateResult walletTopupsCreate(CommerceWalletCommandRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/wallet/topups"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<WalletTopupsCreateResult>() {});
    }

    /** List wallet transactions */
    public WalletTransactionsListResult walletTransactionsList(Integer page, Integer pageSize, String cursor) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/wallet/transactions"), query));
        return client.convertValue(raw, new TypeReference<WalletTransactionsListResult>() {});
    }

    /** Retrieve wallet transaction */
    public WalletTransactionsRetrieveResult walletTransactionsRetrieve(String transactionId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/billing/wallet/transactions/" + serializePathParameter(transactionId, new PathParameterSpec("transactionId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<WalletTransactionsRetrieveResult>() {});
    }

    /** Create wallet transfer */
    public WalletTransfersCreateResult walletTransfersCreate(CommerceWalletCommandRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/wallet/transfers"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<WalletTransfersCreateResult>() {});
    }

    /** Create wallet withdrawal */
    public WalletWithdrawalsCreateResult walletWithdrawalsCreate(CommerceWalletCommandRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/billing/wallet/withdrawals"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<WalletWithdrawalsCreateResult>() {});
    }

    private record PathParameterSpec(String name, String style, boolean explode) {}

    private static String serializePathParameter(Object value, PathParameterSpec spec) {
        if (value == null) {
            return "";
        }
        String style = spec.style() == null || spec.style().isBlank() ? "simple" : spec.style();
        if (value instanceof Iterable<?> iterable) {
            return serializePathArray(spec.name(), iterable, style, spec.explode());
        }
        if (value instanceof Map<?, ?> map) {
            return serializePathObject(spec.name(), map, style, spec.explode());
        }
        return pathPrimitivePrefix(spec.name(), style) + pathEncode(String.valueOf(value));
    }

    private static String serializePathArray(String name, Iterable<?> values, String style, boolean explode) {
        List<String> serialized = new java.util.ArrayList<>();
        for (Object item : values) {
            if (item != null) {
                serialized.add(pathEncode(String.valueOf(item)));
            }
        }
        if (serialized.isEmpty()) {
            return pathPrefix(name, style);
        }
        if ("matrix".equals(style)) {
            if (explode) {
                List<String> parts = new java.util.ArrayList<>();
                for (String item : serialized) {
                    parts.add(";" + name + "=" + item);
                }
                return String.join("", parts);
            }
            return ";" + name + "=" + String.join(",", serialized);
        }
        String separator = explode ? "." : ",";
        return pathPrefix(name, style) + String.join(separator, serialized);
    }

    private static String serializePathObject(String name, Map<?, ?> values, String style, boolean explode) {
        List<String> entries = new java.util.ArrayList<>();
        List<String> exploded = new java.util.ArrayList<>();
        values.forEach((key, value) -> {
            if (value == null) {
                return;
            }
            String escapedKey = pathEncode(String.valueOf(key));
            String escapedValue = pathEncode(String.valueOf(value));
            if (explode) {
                if ("matrix".equals(style)) {
                    exploded.add(";" + escapedKey + "=" + escapedValue);
                } else {
                    exploded.add(escapedKey + "=" + escapedValue);
                }
            } else {
                entries.add(escapedKey);
                entries.add(escapedValue);
            }
        });
        if ("matrix".equals(style)) {
            if (explode) {
                return String.join("", exploded);
            }
            return ";" + name + "=" + String.join(",", entries);
        }
        if (explode) {
            String separator = "label".equals(style) ? "." : ",";
            return pathPrefix(name, style) + String.join(separator, exploded);
        }
        return pathPrefix(name, style) + String.join(",", entries);
    }

    private static String pathPrefix(String name, String style) {
        if ("label".equals(style)) {
            return ".";
        }
        if ("matrix".equals(style)) {
            return ";" + name;
        }
        return "";
    }

    private static String pathPrimitivePrefix(String name, String style) {
        if ("matrix".equals(style)) {
            return ";" + name + "=";
        }
        return pathPrefix(name, style);
    }

    private static String pathEncode(String value) {
        return java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8).replace("+", "%20");
    }

    private record QueryParameterSpec(String name, Object value, String style, boolean explode, boolean allowReserved, String contentType) {}

    private static String buildQueryString(List<QueryParameterSpec> parameters) throws Exception {
        List<String> pairs = new java.util.ArrayList<>();
        for (QueryParameterSpec parameter : parameters) {
            appendSerializedParameter(pairs, parameter);
        }
        return String.join("&", pairs);
    }

    private static void appendSerializedParameter(List<String> pairs, QueryParameterSpec parameter) throws Exception {
        if (parameter.value() == null) {
            return;
        }
        if (parameter.contentType() != null && !parameter.contentType().isBlank()) {
            String json = clientObjectMapper().writeValueAsString(parameter.value());
            pairs.add(urlEncode(parameter.name()) + "=" + encodeQueryValue(json, parameter.allowReserved()));
            return;
        }

        String style = parameter.style() == null || parameter.style().isBlank() ? "form" : parameter.style();
        Object value = parameter.value();
        if ("deepObject".equals(style) && value instanceof Map<?, ?> map) {
            appendDeepObjectParameter(pairs, parameter.name(), map, parameter.allowReserved());
        } else if (value instanceof Iterable<?> iterable) {
            appendArrayParameter(pairs, parameter.name(), iterable, style, parameter.explode(), parameter.allowReserved());
        } else if (value instanceof Map<?, ?> map) {
            appendObjectParameter(pairs, parameter.name(), map, style, parameter.explode(), parameter.allowReserved());
        } else {
            pairs.add(urlEncode(parameter.name()) + "=" + encodeQueryValue(String.valueOf(value), parameter.allowReserved()));
        }
    }

    private static void appendArrayParameter(List<String> pairs, String name, Iterable<?> values, String style, boolean explode, boolean allowReserved) {
        List<String> serialized = new java.util.ArrayList<>();
        for (Object item : values) {
            if (item != null) {
                serialized.add(String.valueOf(item));
            }
        }
        if (serialized.isEmpty()) {
            return;
        }
        if ("form".equals(style) && explode) {
            for (String item : serialized) {
                pairs.add(urlEncode(name) + "=" + encodeQueryValue(item, allowReserved));
            }
            return;
        }
        pairs.add(urlEncode(name) + "=" + encodeQueryValue(String.join(",", serialized), allowReserved));
    }

    private static void appendObjectParameter(List<String> pairs, String name, Map<?, ?> values, String style, boolean explode, boolean allowReserved) {
        List<String> serialized = new java.util.ArrayList<>();
        values.forEach((key, value) -> {
            if (value == null) {
                return;
            }
            if ("form".equals(style) && explode) {
                pairs.add(urlEncode(String.valueOf(key)) + "=" + encodeQueryValue(String.valueOf(value), allowReserved));
            } else {
                serialized.add(String.valueOf(key));
                serialized.add(String.valueOf(value));
            }
        });
        if (!serialized.isEmpty()) {
            pairs.add(urlEncode(name) + "=" + encodeQueryValue(String.join(",", serialized), allowReserved));
        }
    }

    private static void appendDeepObjectParameter(List<String> pairs, String name, Map<?, ?> values, boolean allowReserved) {
        values.forEach((key, value) -> {
            if (value != null) {
                pairs.add(urlEncode(name + "[" + key + "]") + "=" + encodeQueryValue(String.valueOf(value), allowReserved));
            }
        });
    }

    private static String encodeQueryValue(String value, boolean allowReserved) {
        String encoded = urlEncode(value);
        if (!allowReserved) {
            return encoded;
        }
        return encoded
            .replace("%3A", ":").replace("%2F", "/").replace("%3F", "?").replace("%23", "#")
            .replace("%5B", "[").replace("%5D", "]").replace("%40", "@").replace("%21", "!")
            .replace("%24", "$").replace("%26", "&").replace("%27", "'").replace("%28", "(")
            .replace("%29", ")").replace("%2A", "*").replace("%2B", "+").replace("%2C", ",")
            .replace("%3B", ";").replace("%3D", "=");
    }

    private static com.fasterxml.jackson.databind.ObjectMapper clientObjectMapper() {
        return new com.fasterxml.jackson.databind.ObjectMapper();
    }

    private record HeaderParameterSpec(Object value, String style, boolean explode, String contentType) {}

    private static Map<String, String> buildRequestHeaders(Map<String, HeaderParameterSpec> headers, Map<String, HeaderParameterSpec> cookies) throws Exception {
        Map<String, String> requestHeaders = new java.util.LinkedHashMap<>();
        for (Map.Entry<String, HeaderParameterSpec> entry : headers.entrySet()) {
            String serialized = serializeParameterValue(entry.getValue());
            if (serialized != null) {
                requestHeaders.put(entry.getKey(), serialized);
            }
        }

        String cookieHeader = buildCookieHeader(cookies);
        if (cookieHeader != null && !cookieHeader.isEmpty()) {
            requestHeaders.merge("Cookie", cookieHeader, (left, right) -> left + "; " + right);
        }

        return requestHeaders.isEmpty() ? null : requestHeaders;
    }

    private static String buildCookieHeader(Map<String, HeaderParameterSpec> cookies) throws Exception {
        java.util.List<String> pairs = new java.util.ArrayList<>();
        for (Map.Entry<String, HeaderParameterSpec> entry : cookies.entrySet()) {
            String serialized = serializeParameterValue(entry.getValue());
            if (serialized != null) {
                pairs.add(urlEncode(entry.getKey()) + "=" + urlEncode(serialized));
            }
        }
        return String.join("; ", pairs);
    }

    private static String serializeParameterValue(HeaderParameterSpec parameter) throws Exception {
        if (parameter == null || parameter.value() == null) {
            return null;
        }
        Object value = parameter.value();
        if (parameter.contentType() != null && !parameter.contentType().isBlank()) {
            return headerObjectMapper().writeValueAsString(value);
        }
        if (value instanceof Iterable<?> iterable) {
            java.util.List<String> values = new java.util.ArrayList<>();
            for (Object item : iterable) {
                if (item != null) {
                    values.add(String.valueOf(item));
                }
            }
            return String.join(",", values);
        }
        if (value instanceof Map<?, ?> map) {
            java.util.List<String> values = new java.util.ArrayList<>();
            map.forEach((key, item) -> {
                if (item == null) {
                    return;
                }
                if (parameter.explode()) {
                    values.add(String.valueOf(key) + "=" + String.valueOf(item));
                } else {
                    values.add(String.valueOf(key));
                    values.add(String.valueOf(item));
                }
            });
            return String.join(",", values);
        }
        return String.valueOf(value);
    }

    private static com.fasterxml.jackson.databind.ObjectMapper headerObjectMapper() {
        return new com.fasterxml.jackson.databind.ObjectMapper();
    }

    private static String urlEncode(String value) {
        return java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8);
    }
}
