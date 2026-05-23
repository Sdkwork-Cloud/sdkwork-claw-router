using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Sdkwork.ClawRouter.App.Models;
using SdkHttpClient = Sdkwork.ClawRouter.App.Http.HttpClient;

namespace Sdkwork.ClawRouter.App.Api
{
    public class BillingApi
    {
        private readonly SdkHttpClient _client;

        public BillingApi(SdkHttpClient client)
        {
            _client = client;
        }

        /// <summary>
        /// Retrieve account points
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AccountPointsRetrieveResult?> AccountPointsRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.AccountPointsRetrieveResult>(ApiPaths.AppPath("/billing/account/points"));
        }

        /// <summary>
        /// Retrieve account points exchange rate
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AccountPointsExchangeRateRetrieveResult?> AccountPointsExchangeRateRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.AccountPointsExchangeRateRetrieveResult>(ApiPaths.AppPath("/billing/account/points/exchange_rate"));
        }

        /// <summary>
        /// Create account points exchange
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AccountPointsExchangesCreateResult?> AccountPointsExchangesCreateAsync(Sdkwork.ClawRouter.App.Models.CommerceWalletCommandRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.AccountPointsExchangesCreateResult>(ApiPaths.AppPath("/billing/account/points/exchanges"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// List account points exchange rules
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AccountPointsExchangesRulesListResult?> AccountPointsExchangesRulesListAsync(string? sourceAssetType = null, string? targetAssetType = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("source_asset_type", sourceAssetType, "form", true, false, null),
                new QueryParameterSpec("target_asset_type", targetAssetType, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.AccountPointsExchangesRulesListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/billing/account/points/exchanges/rules"), queryString));
        }

        /// <summary>
        /// Retrieve account points exchange
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AccountPointsExchangesRetrieveResult?> AccountPointsExchangesRetrieveAsync(string exchangeNo)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.AccountPointsExchangesRetrieveResult>(ApiPaths.AppPath($"/billing/account/points/exchanges/{SerializePathParameter(exchangeNo, new PathParameterSpec("exchangeNo", "simple", false))}"));
        }

        /// <summary>
        /// List account points history
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AccountPointsHistoryListResult?> AccountPointsHistoryListAsync(int? page = null, int? pageSize = null, string? cursor = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("cursor", cursor, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.AccountPointsHistoryListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/billing/account/points/history"), queryString));
        }

        /// <summary>
        /// Create recharge
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AccountPointsRechargesCreateResult?> AccountPointsRechargesCreateAsync(Sdkwork.ClawRouter.App.Models.SubmitRechargeRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.AccountPointsRechargesCreateResult>(ApiPaths.AppPath("/billing/account/points/recharges"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Retrieve account points recharge order
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AccountPointsRechargesOrdersRetrieveResult?> AccountPointsRechargesOrdersRetrieveAsync(string orderNo)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.AccountPointsRechargesOrdersRetrieveResult>(ApiPaths.AppPath($"/billing/account/points/recharges/orders/{SerializePathParameter(orderNo, new PathParameterSpec("orderNo", "simple", false))}"));
        }

        /// <summary>
        /// Cancel account points recharge order
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AccountPointsRechargesOrdersCancelResult?> AccountPointsRechargesOrdersCancelAsync(string orderNo, Sdkwork.ClawRouter.App.Models.CommerceRechargeOrderCancelRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.AccountPointsRechargesOrdersCancelResult>(ApiPaths.AppPath($"/billing/account/points/recharges/orders/{SerializePathParameter(orderNo, new PathParameterSpec("orderNo", "simple", false))}/cancel"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// List packages
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AccountPointsRechargesPackagesListResult?> AccountPointsRechargesPackagesListAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.AccountPointsRechargesPackagesListResult>(ApiPaths.AppPath("/billing/account/points/recharges/packages"));
        }

        /// <summary>
        /// List account points recharge records
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AccountPointsRechargesRecordsListResult?> AccountPointsRechargesRecordsListAsync(int? page = null, int? pageSize = null, string? cursor = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("cursor", cursor, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.AccountPointsRechargesRecordsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/billing/account/points/recharges/records"), queryString));
        }

        /// <summary>
        /// Create account points transfer
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AccountPointsTransfersCreateResult?> AccountPointsTransfersCreateAsync(Sdkwork.ClawRouter.App.Models.CommerceWalletCommandRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.AccountPointsTransfersCreateResult>(ApiPaths.AppPath("/billing/account/points/transfers"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// List account details
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AccountSummaryRetrieveResult?> AccountSummaryRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.AccountSummaryRetrieveResult>(ApiPaths.AppPath("/billing/account/summary"));
        }

        /// <summary>
        /// Retrieve account tokens
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AccountTokensRetrieveResult?> AccountTokensRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.AccountTokensRetrieveResult>(ApiPaths.AppPath("/billing/account/tokens"));
        }

        /// <summary>
        /// Create account token deduction
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AccountTokensDeductionsCreateResult?> AccountTokensDeductionsCreateAsync(Sdkwork.ClawRouter.App.Models.CommerceWalletCommandRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.AccountTokensDeductionsCreateResult>(ApiPaths.AppPath("/billing/account/tokens/deductions"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// List coupon catalog
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CouponsCatalogListResult?> CouponsCatalogListAsync(string? status = null, int? page = null, int? pageSize = null, string? cursor = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("status", status, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("cursor", cursor, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.CouponsCatalogListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/billing/coupons/catalog"), queryString));
        }

        /// <summary>
        /// Retrieve coupon catalog item
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CouponsCatalogRetrieveResult?> CouponsCatalogRetrieveAsync(string couponId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.CouponsCatalogRetrieveResult>(ApiPaths.AppPath($"/billing/coupons/catalog/{SerializePathParameter(couponId, new PathParameterSpec("couponId", "simple", false))}"));
        }

        /// <summary>
        /// Create coupon claim
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CouponsClaimsCreateResult?> CouponsClaimsCreateAsync(Sdkwork.ClawRouter.App.Models.CommerceCouponClaimRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.CouponsClaimsCreateResult>(ApiPaths.AppPath("/billing/coupons/claims"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Redeem code
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CouponsRedeemCreateResult?> CouponsRedeemCreateAsync(Sdkwork.ClawRouter.App.Models.RedeemCodeRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.CouponsRedeemCreateResult>(ApiPaths.AppPath("/billing/coupons/redeem"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Create coupon usage
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CouponsUsageCreateResult?> CouponsUsageCreateAsync(Sdkwork.ClawRouter.App.Models.CommerceCouponUsageRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.CouponsUsageCreateResult>(ApiPaths.AppPath("/billing/coupons/usage"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Create coupon usage reversal
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CouponsUsageReversalsCreateResult?> CouponsUsageReversalsCreateAsync(Sdkwork.ClawRouter.App.Models.CommerceCouponUsageRollbackRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.CouponsUsageReversalsCreateResult>(ApiPaths.AppPath("/billing/coupons/usage_reversals"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// List checkout status
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.PaymentsCheckoutRetrieveResult?> PaymentsCheckoutRetrieveAsync(string orderNo)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.PaymentsCheckoutRetrieveResult>(ApiPaths.AppPath($"/billing/payments/checkout/{SerializePathParameter(orderNo, new PathParameterSpec("orderNo", "simple", false))}"));
        }

        /// <summary>
        /// List recharge history
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.PaymentsRecordsListResult?> PaymentsRecordsListAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.PaymentsRecordsListResult>(ApiPaths.AppPath("/billing/payments/records"));
        }

        /// <summary>
        /// Retrieve payment record
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.PaymentsRecordsRetrieveResult?> PaymentsRecordsRetrieveAsync(string paymentId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.PaymentsRecordsRetrieveResult>(ApiPaths.AppPath($"/billing/payments/records/{SerializePathParameter(paymentId, new PathParameterSpec("paymentId", "simple", false))}"));
        }

        /// <summary>
        /// Create preflight estimate
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.PreflightEstimatesCreateResult?> PreflightEstimatesCreateAsync(Sdkwork.ClawRouter.App.Models.CommercePreflightRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.PreflightEstimatesCreateResult>(ApiPaths.AppPath("/billing/preflight/estimates"), body, null, null, "application/json");
        }

        /// <summary>
        /// Create preflight precheck
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.PreflightPrechecksCreateResult?> PreflightPrechecksCreateAsync(Sdkwork.ClawRouter.App.Models.CommercePreflightRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.PreflightPrechecksCreateResult>(ApiPaths.AppPath("/billing/preflight/prechecks"), body, null, null, "application/json");
        }

        /// <summary>
        /// Create preflight prehold
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.PreflightPreholdsCreateResult?> PreflightPreholdsCreateAsync(Sdkwork.ClawRouter.App.Models.CommercePreflightRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.PreflightPreholdsCreateResult>(ApiPaths.AppPath("/billing/preflight/preholds"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Create preflight release
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.PreflightReleasesCreateResult?> PreflightReleasesCreateAsync(Sdkwork.ClawRouter.App.Models.CommercePreflightRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.PreflightReleasesCreateResult>(ApiPaths.AppPath("/billing/preflight/releases"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Create preflight settlement
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.PreflightSettlementsCreateResult?> PreflightSettlementsCreateAsync(Sdkwork.ClawRouter.App.Models.CommercePreflightRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.PreflightSettlementsCreateResult>(ApiPaths.AppPath("/billing/preflight/settlements"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// List dashboard data
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.SettlementsDashboardListResult?> SettlementsDashboardListAsync(int? year = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("year", year, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.SettlementsDashboardListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/billing/settlements/dashboard"), queryString));
        }

        /// <summary>
        /// List redeem history
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.UsersCurrentCouponsListResult?> UsersCurrentCouponsListAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.UsersCurrentCouponsListResult>(ApiPaths.AppPath("/billing/users/current/coupons"));
        }

        /// <summary>
        /// Retrieve current user coupon
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.UsersCurrentCouponsRetrieveResult?> UsersCurrentCouponsRetrieveAsync(string userCouponId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.UsersCurrentCouponsRetrieveResult>(ApiPaths.AppPath($"/billing/users/current/coupons/{SerializePathParameter(userCouponId, new PathParameterSpec("userCouponId", "simple", false))}"));
        }

        /// <summary>
        /// List wallet accounts
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.WalletAccountsListResult?> WalletAccountsListAsync(string? assetType = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("asset_type", assetType, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.WalletAccountsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/billing/wallet/accounts"), queryString));
        }

        /// <summary>
        /// Create wallet exchange
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.WalletExchangesCreateResult?> WalletExchangesCreateAsync(Sdkwork.ClawRouter.App.Models.CommerceWalletCommandRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.WalletExchangesCreateResult>(ApiPaths.AppPath("/billing/wallet/exchanges"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Retrieve wallet operation
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.WalletOperationsRetrieveResult?> WalletOperationsRetrieveAsync(string requestNo)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.WalletOperationsRetrieveResult>(ApiPaths.AppPath($"/billing/wallet/operations/{SerializePathParameter(requestNo, new PathParameterSpec("requestNo", "simple", false))}"));
        }

        /// <summary>
        /// Retrieve wallet overview
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.WalletOverviewRetrieveResult?> WalletOverviewRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.WalletOverviewRetrieveResult>(ApiPaths.AppPath("/billing/wallet/overview"));
        }

        /// <summary>
        /// Create wallet topup
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.WalletTopupsCreateResult?> WalletTopupsCreateAsync(Sdkwork.ClawRouter.App.Models.CommerceWalletCommandRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.WalletTopupsCreateResult>(ApiPaths.AppPath("/billing/wallet/topups"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// List wallet transactions
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.WalletTransactionsListResult?> WalletTransactionsListAsync(int? page = null, int? pageSize = null, string? cursor = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("cursor", cursor, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.WalletTransactionsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/billing/wallet/transactions"), queryString));
        }

        /// <summary>
        /// Retrieve wallet transaction
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.WalletTransactionsRetrieveResult?> WalletTransactionsRetrieveAsync(string transactionId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.WalletTransactionsRetrieveResult>(ApiPaths.AppPath($"/billing/wallet/transactions/{SerializePathParameter(transactionId, new PathParameterSpec("transactionId", "simple", false))}"));
        }

        /// <summary>
        /// Create wallet transfer
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.WalletTransfersCreateResult?> WalletTransfersCreateAsync(Sdkwork.ClawRouter.App.Models.CommerceWalletCommandRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.WalletTransfersCreateResult>(ApiPaths.AppPath("/billing/wallet/transfers"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Create wallet withdrawal
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.WalletWithdrawalsCreateResult?> WalletWithdrawalsCreateAsync(Sdkwork.ClawRouter.App.Models.CommerceWalletCommandRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.WalletWithdrawalsCreateResult>(ApiPaths.AppPath("/billing/wallet/withdrawals"), body, null, requestHeaders, "application/json");
        }

        private sealed record PathParameterSpec(string Name, string Style, bool Explode);

        private static string SerializePathParameter(object? value, PathParameterSpec spec)
        {
            if (value is null)
            {
                return string.Empty;
            }
            var style = string.IsNullOrWhiteSpace(spec.Style) ? "simple" : spec.Style;
            if (value is System.Collections.IDictionary dictionary)
            {
                return SerializePathObject(spec.Name, dictionary, style, spec.Explode);
            }
            if (value is System.Collections.IEnumerable enumerable && value is not string)
            {
                return SerializePathArray(spec.Name, enumerable, style, spec.Explode);
            }
            return PathPrimitivePrefix(spec.Name, style) + Uri.EscapeDataString(value.ToString() ?? string.Empty);
        }

        private static string SerializePathArray(string name, System.Collections.IEnumerable values, string style, bool explode)
        {
            var serialized = new List<string>();
            foreach (var item in values)
            {
                if (item is not null)
                {
                    serialized.Add(Uri.EscapeDataString(item.ToString() ?? string.Empty));
                }
            }
            if (serialized.Count == 0)
            {
                return PathPrefix(name, style);
            }
            if (style == "matrix")
            {
                if (explode)
                {
                    var parts = new List<string>();
                    foreach (var item in serialized)
                    {
                        parts.Add(";" + name + "=" + item);
                    }
                    return string.Join(string.Empty, parts);
                }
                return ";" + name + "=" + string.Join(",", serialized);
            }
            var separator = explode ? "." : ",";
            return PathPrefix(name, style) + string.Join(separator, serialized);
        }

        private static string SerializePathObject(string name, System.Collections.IDictionary values, string style, bool explode)
        {
            var entries = new List<string>();
            var exploded = new List<string>();
            foreach (System.Collections.DictionaryEntry item in values)
            {
                if (item.Value is null)
                {
                    continue;
                }
                var escapedKey = Uri.EscapeDataString(item.Key.ToString() ?? string.Empty);
                var escapedValue = Uri.EscapeDataString(item.Value.ToString() ?? string.Empty);
                if (explode)
                {
                    exploded.Add(style == "matrix" ? ";" + escapedKey + "=" + escapedValue : escapedKey + "=" + escapedValue);
                }
                else
                {
                    entries.Add(escapedKey);
                    entries.Add(escapedValue);
                }
            }
            if (style == "matrix")
            {
                return explode ? string.Join(string.Empty, exploded) : ";" + name + "=" + string.Join(",", entries);
            }
            if (explode)
            {
                var separator = style == "label" ? "." : ",";
                return PathPrefix(name, style) + string.Join(separator, exploded);
            }
            return PathPrefix(name, style) + string.Join(",", entries);
        }

        private static string PathPrefix(string name, string style)
        {
            return style switch
            {
                "label" => ".",
                "matrix" => ";" + name,
                _ => string.Empty,
            };
        }

        private static string PathPrimitivePrefix(string name, string style)
        {
            return style == "matrix" ? ";" + name + "=" : PathPrefix(name, style);
        }

        private sealed record QueryParameterSpec(
            string Name,
            object? Value,
            string Style,
            bool Explode,
            bool AllowReserved,
            string? ContentType);

        private static string BuildQueryString(IEnumerable<QueryParameterSpec> parameters)
        {
            var pairs = new List<string>();
            foreach (var parameter in parameters)
            {
                AppendSerializedParameter(pairs, parameter);
            }
            return string.Join("&", pairs);
        }

        private static void AppendSerializedParameter(List<string> pairs, QueryParameterSpec parameter)
        {
            if (parameter.Value is null)
            {
                return;
            }

            if (!string.IsNullOrWhiteSpace(parameter.ContentType))
            {
                var json = System.Text.Json.JsonSerializer.Serialize(parameter.Value);
                pairs.Add(Uri.EscapeDataString(parameter.Name) + "=" + EncodeQueryValue(json, parameter.AllowReserved));
                return;
            }

            var style = string.IsNullOrWhiteSpace(parameter.Style) ? "form" : parameter.Style;
            if (style == "deepObject" && parameter.Value is System.Collections.IDictionary deepObject)
            {
                AppendDeepObjectParameter(pairs, parameter.Name, deepObject, parameter.AllowReserved);
            }
            else if (parameter.Value is System.Collections.IEnumerable enumerable && parameter.Value is not string && parameter.Value is not System.Collections.IDictionary)
            {
                AppendArrayParameter(pairs, parameter.Name, enumerable, style, parameter.Explode, parameter.AllowReserved);
            }
            else if (parameter.Value is System.Collections.IDictionary dictionary)
            {
                AppendObjectParameter(pairs, parameter.Name, dictionary, style, parameter.Explode, parameter.AllowReserved);
            }
            else
            {
                pairs.Add(Uri.EscapeDataString(parameter.Name) + "=" + EncodeQueryValue(parameter.Value.ToString() ?? string.Empty, parameter.AllowReserved));
            }
        }

        private static void AppendArrayParameter(List<string> pairs, string name, System.Collections.IEnumerable values, string style, bool explode, bool allowReserved)
        {
            var serialized = new List<string>();
            foreach (var item in values)
            {
                if (item is not null)
                {
                    serialized.Add(item.ToString() ?? string.Empty);
                }
            }
            if (serialized.Count == 0)
            {
                return;
            }
            if (style == "form" && explode)
            {
                foreach (var item in serialized)
                {
                    pairs.Add(Uri.EscapeDataString(name) + "=" + EncodeQueryValue(item, allowReserved));
                }
                return;
            }
            pairs.Add(Uri.EscapeDataString(name) + "=" + EncodeQueryValue(string.Join(",", serialized), allowReserved));
        }

        private static void AppendObjectParameter(List<string> pairs, string name, System.Collections.IDictionary values, string style, bool explode, bool allowReserved)
        {
            var serialized = new List<string>();
            foreach (System.Collections.DictionaryEntry item in values)
            {
                if (item.Value is null)
                {
                    continue;
                }
                if (style == "form" && explode)
                {
                    pairs.Add(Uri.EscapeDataString(item.Key.ToString() ?? string.Empty) + "=" + EncodeQueryValue(item.Value.ToString() ?? string.Empty, allowReserved));
                }
                else
                {
                    serialized.Add(item.Key.ToString() ?? string.Empty);
                    serialized.Add(item.Value.ToString() ?? string.Empty);
                }
            }
            if (serialized.Count > 0)
            {
                pairs.Add(Uri.EscapeDataString(name) + "=" + EncodeQueryValue(string.Join(",", serialized), allowReserved));
            }
        }

        private static void AppendDeepObjectParameter(List<string> pairs, string name, System.Collections.IDictionary values, bool allowReserved)
        {
            foreach (System.Collections.DictionaryEntry item in values)
            {
                if (item.Value is not null)
                {
                    pairs.Add(Uri.EscapeDataString(name + "[" + item.Key + "]") + "=" + EncodeQueryValue(item.Value.ToString() ?? string.Empty, allowReserved));
                }
            }
        }

        private static string EncodeQueryValue(string value, bool allowReserved)
        {
            var encoded = Uri.EscapeDataString(value);
            if (!allowReserved)
            {
                return encoded;
            }
            return encoded
                .Replace("%3A", ":").Replace("%2F", "/").Replace("%3F", "?").Replace("%23", "#")
                .Replace("%5B", "[").Replace("%5D", "]").Replace("%40", "@").Replace("%21", "!")
                .Replace("%24", "$").Replace("%26", "&").Replace("%27", "'").Replace("%28", "(")
                .Replace("%29", ")").Replace("%2A", "*").Replace("%2B", "+").Replace("%2C", ",")
                .Replace("%3B", ";").Replace("%3D", "=");
        }

        private sealed record HeaderParameterSpec(object? Value, string Style, bool Explode, string? ContentType);

        private static Dictionary<string, string>? BuildRequestHeaders(
            Dictionary<string, HeaderParameterSpec> headers,
            Dictionary<string, HeaderParameterSpec> cookies)
        {
            var requestHeaders = new Dictionary<string, string>();
            foreach (var item in headers)
            {
                var serialized = SerializeParameterValue(item.Value);
                if (serialized is not null)
                {
                    requestHeaders[item.Key] = serialized;
                }
            }

            var cookieHeader = BuildCookieHeader(cookies);
            if (!string.IsNullOrEmpty(cookieHeader))
            {
                requestHeaders["Cookie"] = requestHeaders.TryGetValue("Cookie", out var existing) && !string.IsNullOrEmpty(existing)
                    ? existing + "; " + cookieHeader
                    : cookieHeader;
            }

            return requestHeaders.Count == 0 ? null : requestHeaders;
        }

        private static string BuildCookieHeader(Dictionary<string, HeaderParameterSpec> cookies)
        {
            var pairs = new List<string>();
            foreach (var item in cookies)
            {
                var serialized = SerializeParameterValue(item.Value);
                if (serialized is not null)
                {
                    pairs.Add(Uri.EscapeDataString(item.Key) + "=" + Uri.EscapeDataString(serialized));
                }
            }
            return string.Join("; ", pairs);
        }

        private static string? SerializeParameterValue(HeaderParameterSpec? parameter)
        {
            var value = parameter?.Value;
            if (value is null)
            {
                return null;
            }
            if (!string.IsNullOrWhiteSpace(parameter!.ContentType))
            {
                return System.Text.Json.JsonSerializer.Serialize(value);
            }
            if (value is System.Collections.IEnumerable enumerable && value is not string)
            {
                var values = new List<string>();
                foreach (var item in enumerable)
                {
                    if (item is not null)
                    {
                        values.Add(item.ToString() ?? string.Empty);
                    }
                }
                return string.Join(",", values);
            }
            if (value is System.Collections.IDictionary dictionary)
            {
                var values = new List<string>();
                foreach (System.Collections.DictionaryEntry item in dictionary)
                {
                    if (item.Value is null)
                    {
                        continue;
                    }
                    if (parameter.Explode)
                    {
                        values.Add((item.Key.ToString() ?? string.Empty) + "=" + (item.Value.ToString() ?? string.Empty));
                    }
                    else
                    {
                        values.Add(item.Key.ToString() ?? string.Empty);
                        values.Add(item.Value.ToString() ?? string.Empty);
                    }
                }
                return string.Join(",", values);
            }
            return value.ToString();
        }
    }
}
