using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Sdkwork.ClawRouter.App.Models;
using SdkHttpClient = Sdkwork.ClawRouter.App.Http.HttpClient;

namespace Sdkwork.ClawRouter.App.Api
{
    public class CommerceApi
    {
        private readonly SdkHttpClient _client;

        public CommerceApi(SdkHttpClient client)
        {
            _client = client;
        }

        /// <summary>
        /// Accounts Current Summary Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AccountsCurrentSummaryRetrieveResult?> AccountsCurrentSummaryRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.AccountsCurrentSummaryRetrieveResult>(ApiPaths.AppPath("/accounts/current/summary"));
        }

        /// <summary>
        /// Addresses List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AddressesListResult?> AddressesListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.AddressesListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/addresses"), queryString));
        }

        /// <summary>
        /// Addresses Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AddressesCreateResult?> AddressesCreateAsync(Sdkwork.ClawRouter.App.Models.CommerceStandardCommandRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.AddressesCreateResult>(ApiPaths.AppPath("/addresses"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Addresses Delete
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AddressesDeleteResult?> AddressesDeleteAsync(string addressId, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.DeleteAsync<Sdkwork.ClawRouter.App.Models.AddressesDeleteResult>(ApiPaths.AppPath($"/addresses/{SerializePathParameter(addressId, new PathParameterSpec("addressId", "simple", false))}"), null, requestHeaders);
        }

        /// <summary>
        /// Addresses Update
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AddressesUpdateResult?> AddressesUpdateAsync(string addressId, Sdkwork.ClawRouter.App.Models.CommerceStandardCommandRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PatchAsync<Sdkwork.ClawRouter.App.Models.AddressesUpdateResult>(ApiPaths.AppPath($"/addresses/{SerializePathParameter(addressId, new PathParameterSpec("addressId", "simple", false))}"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Addresses Default Selection Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AddressesDefaultSelectionCreateResult?> AddressesDefaultSelectionCreateAsync(string addressId, Sdkwork.ClawRouter.App.Models.CommerceStandardCommandRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.AddressesDefaultSelectionCreateResult>(ApiPaths.AppPath($"/addresses/{SerializePathParameter(addressId, new PathParameterSpec("addressId", "simple", false))}/default_selection"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Billing History List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.BillingHistoryListResult?> BillingHistoryListAsync(int? page = null, int? pageSize = null, string? type = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("type", type, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.BillingHistoryListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/billing/history"), queryString));
        }

        /// <summary>
        /// Cart Current Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CartCurrentRetrieveResult?> CartCurrentRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.CartCurrentRetrieveResult>(ApiPaths.AppPath("/cart/current"));
        }

        /// <summary>
        /// Cart Items Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CartItemsCreateResult?> CartItemsCreateAsync(Sdkwork.ClawRouter.App.Models.CommerceStandardCommandRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.CartItemsCreateResult>(ApiPaths.AppPath("/cart/items"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Cart Items Delete
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CartItemsDeleteResult?> CartItemsDeleteAsync(string cartItemId, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.DeleteAsync<Sdkwork.ClawRouter.App.Models.CartItemsDeleteResult>(ApiPaths.AppPath($"/cart/items/{SerializePathParameter(cartItemId, new PathParameterSpec("cartItemId", "simple", false))}"), null, requestHeaders);
        }

        /// <summary>
        /// Cart Items Update
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CartItemsUpdateResult?> CartItemsUpdateAsync(string cartItemId, Sdkwork.ClawRouter.App.Models.CommerceStandardCommandRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PatchAsync<Sdkwork.ClawRouter.App.Models.CartItemsUpdateResult>(ApiPaths.AppPath($"/cart/items/{SerializePathParameter(cartItemId, new PathParameterSpec("cartItemId", "simple", false))}"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// List visible product categories
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CatalogCategoriesListResult?> CatalogCategoriesListAsync(string? parentId = null, string? status = null, int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("parent_id", parentId, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.CatalogCategoriesListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/catalog/categories"), queryString));
        }

        /// <summary>
        /// List visible catalog products
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CatalogProductsListResult?> CatalogProductsListAsync(string? q = null, string? categoryId = null, string? productType = null, string? status = null, int? page = null, int? pageSize = null, string? sort = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("q", q, "form", true, false, null),
                new QueryParameterSpec("category_id", categoryId, "form", true, false, null),
                new QueryParameterSpec("product_type", productType, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("sort", sort, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.CatalogProductsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/catalog/products"), queryString));
        }

        /// <summary>
        /// Retrieve catalog product detail
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CatalogProductsRetrieveResult?> CatalogProductsRetrieveAsync(string productId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.CatalogProductsRetrieveResult>(ApiPaths.AppPath($"/catalog/products/{SerializePathParameter(productId, new PathParameterSpec("productId", "simple", false))}"));
        }

        /// <summary>
        /// Retrieve catalog SKU detail
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CatalogSkusRetrieveResult?> CatalogSkusRetrieveAsync(string skuId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.CatalogSkusRetrieveResult>(ApiPaths.AppPath($"/catalog/skus/{SerializePathParameter(skuId, new PathParameterSpec("skuId", "simple", false))}"));
        }

        /// <summary>
        /// Checkout Sessions Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CheckoutSessionsCreateResult?> CheckoutSessionsCreateAsync(Sdkwork.ClawRouter.App.Models.CommerceStandardCommandRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.CheckoutSessionsCreateResult>(ApiPaths.AppPath("/checkout/sessions"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Checkout Sessions Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CheckoutSessionsRetrieveResult?> CheckoutSessionsRetrieveAsync(string checkoutSessionId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.CheckoutSessionsRetrieveResult>(ApiPaths.AppPath($"/checkout/sessions/{SerializePathParameter(checkoutSessionId, new PathParameterSpec("checkoutSessionId", "simple", false))}"));
        }

        /// <summary>
        /// Checkout Sessions Orders Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CheckoutSessionsOrdersCreateResult?> CheckoutSessionsOrdersCreateAsync(string checkoutSessionId, Sdkwork.ClawRouter.App.Models.CommerceStandardCommandRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.CheckoutSessionsOrdersCreateResult>(ApiPaths.AppPath($"/checkout/sessions/{SerializePathParameter(checkoutSessionId, new PathParameterSpec("checkoutSessionId", "simple", false))}/orders"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Checkout Sessions Quotes Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CheckoutSessionsQuotesCreateResult?> CheckoutSessionsQuotesCreateAsync(string checkoutSessionId, Sdkwork.ClawRouter.App.Models.CommerceStandardCommandRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.CheckoutSessionsQuotesCreateResult>(ApiPaths.AppPath($"/checkout/sessions/{SerializePathParameter(checkoutSessionId, new PathParameterSpec("checkoutSessionId", "simple", false))}/quotes"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Fulfillments List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.FulfillmentsListResult?> FulfillmentsListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.FulfillmentsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/fulfillments"), queryString));
        }

        /// <summary>
        /// Fulfillments Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.FulfillmentsRetrieveResult?> FulfillmentsRetrieveAsync(string fulfillmentId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.FulfillmentsRetrieveResult>(ApiPaths.AppPath($"/fulfillments/{SerializePathParameter(fulfillmentId, new PathParameterSpec("fulfillmentId", "simple", false))}"));
        }

        /// <summary>
        /// Invoices List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.InvoicesListResult?> InvoicesListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.InvoicesListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/invoices"), queryString));
        }

        /// <summary>
        /// Invoices Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.InvoicesCreateResult?> InvoicesCreateAsync(Sdkwork.ClawRouter.App.Models.CommerceStandardCommandRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.InvoicesCreateResult>(ApiPaths.AppPath("/invoices"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Invoices Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.InvoicesRetrieveResult?> InvoicesRetrieveAsync(string invoiceId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.InvoicesRetrieveResult>(ApiPaths.AppPath($"/invoices/{SerializePathParameter(invoiceId, new PathParameterSpec("invoiceId", "simple", false))}"));
        }

        /// <summary>
        /// Memberships Benefits List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.MembershipsBenefitsListResult?> MembershipsBenefitsListAsync(int? planId = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("plan_id", planId, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.MembershipsBenefitsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/memberships/benefits"), queryString));
        }

        /// <summary>
        /// Memberships Current Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.MembershipsCurrentRetrieveResult?> MembershipsCurrentRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.MembershipsCurrentRetrieveResult>(ApiPaths.AppPath("/memberships/current"));
        }

        /// <summary>
        /// Memberships Current Status Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.MembershipsCurrentStatusRetrieveResult?> MembershipsCurrentStatusRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.MembershipsCurrentStatusRetrieveResult>(ApiPaths.AppPath("/memberships/current/status"));
        }

        /// <summary>
        /// Memberships Package Groups List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.MembershipsPackageGroupsListResult?> GetMembershipsPackageGroupsListAsync(int? planId = null, bool? recommendedOnly = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("plan_id", planId, "form", true, false, null),
                new QueryParameterSpec("recommended_only", recommendedOnly, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.MembershipsPackageGroupsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/memberships/package_groups"), queryString));
        }

        /// <summary>
        /// Memberships Package Groups Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.MembershipsPackageGroupsRetrieveResult?> MembershipsPackageGroupsRetrieveAsync(string packageGroupId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.MembershipsPackageGroupsRetrieveResult>(ApiPaths.AppPath($"/memberships/package_groups/{SerializePathParameter(packageGroupId, new PathParameterSpec("packageGroupId", "simple", false))}"));
        }

        /// <summary>
        /// Memberships Package Groups Packages List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.MembershipsPackageGroupsPackagesListResult?> GetMembershipsPackageGroupsListPackageGroupsAsync(string packageGroupId, int? planId = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("plan_id", planId, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.MembershipsPackageGroupsPackagesListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath($"/memberships/package_groups/{SerializePathParameter(packageGroupId, new PathParameterSpec("packageGroupId", "simple", false))}/packages"), queryString));
        }

        /// <summary>
        /// Memberships Packages List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.MembershipsPackagesListResult?> MembershipsPackagesListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.MembershipsPackagesListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/memberships/packages"), queryString));
        }

        /// <summary>
        /// Memberships Packages Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.MembershipsPackagesRetrieveResult?> MembershipsPackagesRetrieveAsync(string packageId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.MembershipsPackagesRetrieveResult>(ApiPaths.AppPath($"/memberships/packages/{SerializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false))}"));
        }

        /// <summary>
        /// Memberships Plans List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.MembershipsPlansListResult?> MembershipsPlansListAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.MembershipsPlansListResult>(ApiPaths.AppPath("/memberships/plans"));
        }

        /// <summary>
        /// Memberships Points Balance Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.MembershipsPointsBalanceRetrieveResult?> MembershipsPointsBalanceRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.MembershipsPointsBalanceRetrieveResult>(ApiPaths.AppPath("/memberships/points/balance"));
        }

        /// <summary>
        /// Memberships Points Daily Rewards Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.MembershipsPointsDailyRewardsCreateResult?> MembershipsPointsDailyRewardsCreateAsync(Sdkwork.ClawRouter.App.Models.MembershipsPointsDailyRewardsCreateRequest? body = null, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.MembershipsPointsDailyRewardsCreateResult>(ApiPaths.AppPath("/memberships/points/daily_rewards"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Memberships Points Daily Rewards Status Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.MembershipsPointsDailyRewardsStatusRetrieveResult?> MembershipsPointsDailyRewardsStatusRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.MembershipsPointsDailyRewardsStatusRetrieveResult>(ApiPaths.AppPath("/memberships/points/daily_rewards/status"));
        }

        /// <summary>
        /// Memberships Points History List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.MembershipsPointsHistoryListResult?> MembershipsPointsHistoryListAsync(int? page = null, int? pageSize = null, string? cursor = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("cursor", cursor, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.MembershipsPointsHistoryListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/memberships/points/history"), queryString));
        }

        /// <summary>
        /// Memberships Privileges Speed Ups Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.MembershipsPrivilegesSpeedUpsCreateResult?> MembershipsPrivilegesSpeedUpsCreateAsync(Sdkwork.ClawRouter.App.Models.MembershipsPrivilegesSpeedUpsCreateRequest? body = null, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.MembershipsPrivilegesSpeedUpsCreateResult>(ApiPaths.AppPath("/memberships/privileges/speed_ups"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Memberships Privileges Usage Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.MembershipsPrivilegesUsageRetrieveResult?> MembershipsPrivilegesUsageRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.MembershipsPrivilegesUsageRetrieveResult>(ApiPaths.AppPath("/memberships/privileges/usage"));
        }

        /// <summary>
        /// Memberships Purchases Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.MembershipsPurchasesCreateResult?> MembershipsPurchasesCreateAsync(Sdkwork.ClawRouter.App.Models.CommerceMembershipPurchaseRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.MembershipsPurchasesCreateResult>(ApiPaths.AppPath("/memberships/purchases"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Memberships Purchases Renew
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.MembershipsPurchasesRenewResult?> MembershipsPurchasesRenewAsync(Sdkwork.ClawRouter.App.Models.CommerceMembershipPurchaseRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.MembershipsPurchasesRenewResult>(ApiPaths.AppPath("/memberships/purchases/renew"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Memberships Purchases Upgrade
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.MembershipsPurchasesUpgradeResult?> MembershipsPurchasesUpgradeAsync(Sdkwork.ClawRouter.App.Models.CommerceMembershipPurchaseRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.MembershipsPurchasesUpgradeResult>(ApiPaths.AppPath("/memberships/purchases/upgrade"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Orders List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.OrdersListResult?> OrdersListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.OrdersListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/orders"), queryString));
        }

        /// <summary>
        /// Orders Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.OrdersRetrieveResult?> OrdersRetrieveAsync(string orderId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.OrdersRetrieveResult>(ApiPaths.AppPath($"/orders/{SerializePathParameter(orderId, new PathParameterSpec("orderId", "simple", false))}"));
        }

        /// <summary>
        /// Orders Cancellations Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.OrdersCancellationsCreateResult?> OrdersCancellationsCreateAsync(string orderId, Sdkwork.ClawRouter.App.Models.CommerceStandardCommandRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.OrdersCancellationsCreateResult>(ApiPaths.AppPath($"/orders/{SerializePathParameter(orderId, new PathParameterSpec("orderId", "simple", false))}/cancellations"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Orders Events List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.OrdersEventsListResult?> OrdersEventsListAsync(string orderId, int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.OrdersEventsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath($"/orders/{SerializePathParameter(orderId, new PathParameterSpec("orderId", "simple", false))}/events"), queryString));
        }

        /// <summary>
        /// Payments Attempts Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.PaymentsAttemptsRetrieveResult?> PaymentsAttemptsRetrieveAsync(string paymentAttemptId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.PaymentsAttemptsRetrieveResult>(ApiPaths.AppPath($"/payments/attempts/{SerializePathParameter(paymentAttemptId, new PathParameterSpec("paymentAttemptId", "simple", false))}"));
        }

        /// <summary>
        /// Payments Intents Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.PaymentsIntentsCreateResult?> PaymentsIntentsCreateAsync(Sdkwork.ClawRouter.App.Models.CommercePaymentIntentCreateRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.PaymentsIntentsCreateResult>(ApiPaths.AppPath("/payments/intents"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Payments Intents Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.PaymentsIntentsRetrieveResult?> PaymentsIntentsRetrieveAsync(string paymentIntentId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.PaymentsIntentsRetrieveResult>(ApiPaths.AppPath($"/payments/intents/{SerializePathParameter(paymentIntentId, new PathParameterSpec("paymentIntentId", "simple", false))}"));
        }

        /// <summary>
        /// Payments Intents Attempts Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.PaymentsIntentsAttemptsCreateResult?> PaymentsIntentsAttemptsCreateAsync(string paymentIntentId, Sdkwork.ClawRouter.App.Models.CommercePaymentAttemptCreateRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.PaymentsIntentsAttemptsCreateResult>(ApiPaths.AppPath($"/payments/intents/{SerializePathParameter(paymentIntentId, new PathParameterSpec("paymentIntentId", "simple", false))}/attempts"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Payments Methods List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.PaymentsMethodsListResult?> PaymentsMethodsListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.PaymentsMethodsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/payments/methods"), queryString));
        }

        /// <summary>
        /// Recharges Orders Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RechargesOrdersCreateResult?> RechargesOrdersCreateAsync(Sdkwork.ClawRouter.App.Models.CommerceStandardCommandRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.RechargesOrdersCreateResult>(ApiPaths.AppPath("/recharges/orders"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Recharges Orders Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RechargesOrdersRetrieveResult?> RechargesOrdersRetrieveAsync(string orderId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.RechargesOrdersRetrieveResult>(ApiPaths.AppPath($"/recharges/orders/{SerializePathParameter(orderId, new PathParameterSpec("orderId", "simple", false))}"));
        }

        /// <summary>
        /// Recharges Packages List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RechargesPackagesListResult?> RechargesPackagesListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.RechargesPackagesListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/recharges/packages"), queryString));
        }

        /// <summary>
        /// Refunds List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RefundsListResult?> RefundsListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.RefundsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/refunds"), queryString));
        }

        /// <summary>
        /// Refunds Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RefundsCreateResult?> RefundsCreateAsync(Sdkwork.ClawRouter.App.Models.CommerceStandardCommandRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.RefundsCreateResult>(ApiPaths.AppPath("/refunds"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Refunds Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RefundsRetrieveResult?> RefundsRetrieveAsync(string refundId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.RefundsRetrieveResult>(ApiPaths.AppPath($"/refunds/{SerializePathParameter(refundId, new PathParameterSpec("refundId", "simple", false))}"));
        }

        /// <summary>
        /// Shipments Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.ShipmentsRetrieveResult?> ShipmentsRetrieveAsync(string shipmentId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.ShipmentsRetrieveResult>(ApiPaths.AppPath($"/shipments/{SerializePathParameter(shipmentId, new PathParameterSpec("shipmentId", "simple", false))}"));
        }

        /// <summary>
        /// Wallet Accounts List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.WalletAccountsListResult?> WalletAccountsListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.WalletAccountsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/wallet/accounts"), queryString));
        }

        /// <summary>
        /// Wallet Exchange Rate Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.WalletExchangeRateRetrieveResult?> WalletExchangeRateRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.WalletExchangeRateRetrieveResult>(ApiPaths.AppPath("/wallet/exchange_rate"));
        }

        /// <summary>
        /// Wallet Ledger Entries List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.WalletLedgerEntriesListResult?> WalletLedgerEntriesListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.WalletLedgerEntriesListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/wallet/ledger_entries"), queryString));
        }

        /// <summary>
        /// Wallet Overview Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.WalletOverviewRetrieveResult?> WalletOverviewRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.WalletOverviewRetrieveResult>(ApiPaths.AppPath("/wallet/overview"));
        }

        /// <summary>
        /// Wallet Points Exchange Rules List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.WalletPointsExchangeRulesListResult?> WalletPointsExchangeRulesListAsync(string? sourceAssetType = null, string? targetAssetType = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("source_asset_type", sourceAssetType, "form", true, false, null),
                new QueryParameterSpec("target_asset_type", targetAssetType, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.WalletPointsExchangeRulesListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/wallet/points/exchanges/rules"), queryString));
        }

        /// <summary>
        /// Wallet Tokens Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.WalletTokensRetrieveResult?> WalletTokensRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.WalletTokensRetrieveResult>(ApiPaths.AppPath("/wallet/tokens"));
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
