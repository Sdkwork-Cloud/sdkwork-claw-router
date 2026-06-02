using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Sdkwork.ClawRouter.Backend.Models;
using SdkHttpClient = Sdkwork.ClawRouter.Backend.Http.HttpClient;

namespace Sdkwork.ClawRouter.Backend.Api
{
    public class CommerceApi
    {
        private readonly SdkHttpClient _client;

        public CommerceApi(SdkHttpClient client)
        {
            _client = client;
        }

        /// <summary>
        /// Audit Commerce Events List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AuditCommerceEventsListResult?> AuditCommerceEventsListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.AuditCommerceEventsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/audit/commerce_events"), queryString));
        }

        /// <summary>
        /// List product attributes
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogAttributesListResult?> CatalogAttributesListAsync(string? scope = null, string? status = null, int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("scope", scope, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.CatalogAttributesListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/catalog/attributes"), queryString));
        }

        /// <summary>
        /// Create product attribute
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogAttributesCreateResult?> CatalogAttributesCreateAsync(Sdkwork.ClawRouter.Backend.Models.CommerceProductAttributeMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.CatalogAttributesCreateResult>(ApiPaths.BackendPath("/catalog/attributes"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// List product categories for admin management
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogCategoriesListResult?> CatalogCategoriesListAsync(string? parentId = null, string? status = null, int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("parent_id", parentId, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.CatalogCategoriesListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/catalog/categories"), queryString));
        }

        /// <summary>
        /// Create product category
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogCategoriesCreateResult?> CatalogCategoriesCreateAsync(Sdkwork.ClawRouter.Backend.Models.CommerceProductCategoryMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.CatalogCategoriesCreateResult>(ApiPaths.BackendPath("/catalog/categories"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Delete product category
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogCategoriesDeleteResult?> CatalogCategoriesDeleteAsync(string categoryId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.CatalogCategoriesDeleteResult>(ApiPaths.BackendPath($"/catalog/categories/{SerializePathParameter(categoryId, new PathParameterSpec("categoryId", "simple", false))}"));
        }

        /// <summary>
        /// Update product category
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogCategoriesUpdateResult?> CatalogCategoriesUpdateAsync(string categoryId, Sdkwork.ClawRouter.Backend.Models.CommerceProductCategoryMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PatchAsync<Sdkwork.ClawRouter.Backend.Models.CatalogCategoriesUpdateResult>(ApiPaths.BackendPath($"/catalog/categories/{SerializePathParameter(categoryId, new PathParameterSpec("categoryId", "simple", false))}"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Initialize admin category seed datasets
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogCategorySeedsCreateResult?> CatalogCategorySeedsCreateAsync(Sdkwork.ClawRouter.Backend.Models.CommerceCategorySeedInitializeRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.CatalogCategorySeedsCreateResult>(ApiPaths.BackendPath("/catalog/category_seeds/initialize"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// List product price lists
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogPriceListsListResult?> CatalogPriceListsAsync(string? currencyCode = null, string? marketCode = null, string? status = null, int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("currency_code", currencyCode, "form", true, false, null),
                new QueryParameterSpec("market_code", marketCode, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.CatalogPriceListsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/catalog/price_lists"), queryString));
        }

        /// <summary>
        /// Create product price list
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogPriceListsCreateResult?> CatalogPriceListsCreateAsync(Sdkwork.ClawRouter.Backend.Models.CommercePriceListMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.CatalogPriceListsCreateResult>(ApiPaths.BackendPath("/catalog/price_lists"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// List products for admin management
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogProductsListResult?> CatalogProductsListAsync(string? q = null, string? categoryId = null, string? productType = null, string? status = null, int? page = null, int? pageSize = null, string? sort = null)
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
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.CatalogProductsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/catalog/products"), queryString));
        }

        /// <summary>
        /// Create product SPU
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogProductsCreateResult?> CatalogProductsCreateAsync(Sdkwork.ClawRouter.Backend.Models.CommerceProductSpuMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.CatalogProductsCreateResult>(ApiPaths.BackendPath("/catalog/products"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Delete product SPU
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogProductsDeleteResult?> CatalogProductsDeleteAsync(string productId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.CatalogProductsDeleteResult>(ApiPaths.BackendPath($"/catalog/products/{SerializePathParameter(productId, new PathParameterSpec("productId", "simple", false))}"));
        }

        /// <summary>
        /// Update product SPU
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogProductsUpdateResult?> CatalogProductsUpdateAsync(string productId, Sdkwork.ClawRouter.Backend.Models.CommerceProductSpuMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PatchAsync<Sdkwork.ClawRouter.Backend.Models.CatalogProductsUpdateResult>(ApiPaths.BackendPath($"/catalog/products/{SerializePathParameter(productId, new PathParameterSpec("productId", "simple", false))}"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// List product SKUs for admin management
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogSkusListResult?> CatalogSkusListAsync(string? productId = null, string? fulfillmentType = null, string? status = null, int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("product_id", productId, "form", true, false, null),
                new QueryParameterSpec("fulfillment_type", fulfillmentType, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.CatalogSkusListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/catalog/skus"), queryString));
        }

        /// <summary>
        /// Create product SKU
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogSkusCreateResult?> CatalogSkusCreateAsync(Sdkwork.ClawRouter.Backend.Models.CommerceProductSkuMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.CatalogSkusCreateResult>(ApiPaths.BackendPath("/catalog/skus"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Delete product SKU
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogSkusDeleteResult?> CatalogSkusDeleteAsync(string skuId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.CatalogSkusDeleteResult>(ApiPaths.BackendPath($"/catalog/skus/{SerializePathParameter(skuId, new PathParameterSpec("skuId", "simple", false))}"));
        }

        /// <summary>
        /// Update product SKU
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogSkusUpdateResult?> CatalogSkusUpdateAsync(string skuId, Sdkwork.ClawRouter.Backend.Models.CommerceProductSkuMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PatchAsync<Sdkwork.ClawRouter.Backend.Models.CatalogSkusUpdateResult>(ApiPaths.BackendPath($"/catalog/skus/{SerializePathParameter(skuId, new PathParameterSpec("skuId", "simple", false))}"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Commerce Reports Order Revenue List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CommerceReportsOrderRevenueListResult?> ReportsOrderRevenueListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.CommerceReportsOrderRevenueListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/commerce_reports/order_revenue"), queryString));
        }

        /// <summary>
        /// Commerce Reports Payment Reconciliation Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CommerceReportsPaymentReconciliationRetrieveResult?> ReportsPaymentReconciliationRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.CommerceReportsPaymentReconciliationRetrieveResult>(ApiPaths.BackendPath("/commerce_reports/payment_reconciliation"));
        }

        /// <summary>
        /// Commerce Reports Refunds List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CommerceReportsRefundsListResult?> ReportsRefundsListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.CommerceReportsRefundsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/commerce_reports/refunds"), queryString));
        }

        /// <summary>
        /// Fulfillments List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.FulfillmentsListResult?> FulfillmentsListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.FulfillmentsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/fulfillments"), queryString));
        }

        /// <summary>
        /// List inventory ledger entries
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.InventoryLedgerEntriesListResult?> InventoryLedgerEntriesListAsync(string? skuId = null, string? warehouseId = null, string? sourceType = null, string? sourceId = null, int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("sku_id", skuId, "form", true, false, null),
                new QueryParameterSpec("warehouse_id", warehouseId, "form", true, false, null),
                new QueryParameterSpec("source_type", sourceType, "form", true, false, null),
                new QueryParameterSpec("source_id", sourceId, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.InventoryLedgerEntriesListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/inventory/ledger_entries"), queryString));
        }

        /// <summary>
        /// List inventory reservations
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.InventoryReservationsListResult?> InventoryReservationsListAsync(string? skuId = null, string? orderId = null, string? checkoutSessionId = null, string? status = null, int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("sku_id", skuId, "form", true, false, null),
                new QueryParameterSpec("order_id", orderId, "form", true, false, null),
                new QueryParameterSpec("checkout_session_id", checkoutSessionId, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.InventoryReservationsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/inventory/reservations"), queryString));
        }

        /// <summary>
        /// List inventory stock records
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.InventoryStocksListResult?> InventoryStocksListAsync(string? skuId = null, string? warehouseId = null, string? status = null, int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("sku_id", skuId, "form", true, false, null),
                new QueryParameterSpec("warehouse_id", warehouseId, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.InventoryStocksListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/inventory/stocks"), queryString));
        }

        /// <summary>
        /// Update inventory stock
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.InventoryStocksUpdateResult?> InventoryStocksUpdateAsync(string stockId, Sdkwork.ClawRouter.Backend.Models.CommerceInventoryStockUpdateRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PatchAsync<Sdkwork.ClawRouter.Backend.Models.InventoryStocksUpdateResult>(ApiPaths.BackendPath($"/inventory/stocks/{SerializePathParameter(stockId, new PathParameterSpec("stockId", "simple", false))}"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Invoices List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.InvoicesListResult?> InvoicesListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.InvoicesListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/invoices"), queryString));
        }

        /// <summary>
        /// Invoices Titles List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.InvoicesTitlesListResult?> InvoicesTitlesListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.InvoicesTitlesListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/invoices/titles"), queryString));
        }

        /// <summary>
        /// Invoices Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.InvoicesRetrieveResult?> InvoicesRetrieveAsync(string invoiceId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.InvoicesRetrieveResult>(ApiPaths.BackendPath($"/invoices/{SerializePathParameter(invoiceId, new PathParameterSpec("invoiceId", "simple", false))}"));
        }

        /// <summary>
        /// Memberships Entitlements List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.MembershipsEntitlementsListResult?> MembershipsEntitlementsListAsync(int? page = null, int? pageSize = null, string? planId = null, string? membershipId = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("plan_id", planId, "form", true, false, null),
                new QueryParameterSpec("membership_id", membershipId, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.MembershipsEntitlementsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/memberships/entitlements"), queryString));
        }

        /// <summary>
        /// Memberships Members List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.MembershipsMembersListResult?> MembershipsMembersListAsync(int? page = null, int? pageSize = null, string? cursor = null, string? userId = null, string? planId = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("cursor", cursor, "form", true, false, null),
                new QueryParameterSpec("user_id", userId, "form", true, false, null),
                new QueryParameterSpec("plan_id", planId, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.MembershipsMembersListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/memberships/members"), queryString));
        }

        /// <summary>
        /// Memberships Members Status Update
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.MembershipsMembersStatusUpdateResult?> MembershipsMembersStatusUpdateAsync(string membershipId, Sdkwork.ClawRouter.Backend.Models.CommerceMembershipMemberStatusRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PatchAsync<Sdkwork.ClawRouter.Backend.Models.MembershipsMembersStatusUpdateResult>(ApiPaths.BackendPath($"/memberships/members/{SerializePathParameter(membershipId, new PathParameterSpec("membershipId", "simple", false))}/status"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Memberships Package Groups List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.MembershipsPackageGroupsListResult?> MembershipsPackageGroupsListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.MembershipsPackageGroupsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/memberships/package_groups"), queryString));
        }

        /// <summary>
        /// Memberships Package Groups Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.MembershipsPackageGroupsCreateResult?> MembershipsPackageGroupsCreateAsync(Sdkwork.ClawRouter.Backend.Models.CommerceMembershipPackageGroupMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.MembershipsPackageGroupsCreateResult>(ApiPaths.BackendPath("/memberships/package_groups"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Memberships Package Groups Delete
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.MembershipsPackageGroupsDeleteResult?> MembershipsPackageGroupsDeleteAsync(string packageGroupId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.MembershipsPackageGroupsDeleteResult>(ApiPaths.BackendPath($"/memberships/package_groups/{SerializePathParameter(packageGroupId, new PathParameterSpec("packageGroupId", "simple", false))}"));
        }

        /// <summary>
        /// Memberships Package Groups Update
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.MembershipsPackageGroupsUpdateResult?> MembershipsPackageGroupsUpdateAsync(string packageGroupId, Sdkwork.ClawRouter.Backend.Models.CommerceMembershipPackageGroupMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PutAsync<Sdkwork.ClawRouter.Backend.Models.MembershipsPackageGroupsUpdateResult>(ApiPaths.BackendPath($"/memberships/package_groups/{SerializePathParameter(packageGroupId, new PathParameterSpec("packageGroupId", "simple", false))}"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Memberships Packages List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.MembershipsPackagesListResult?> MembershipsPackagesListAsync(int? page = null, int? pageSize = null, string? packageGroupId = null, string? planId = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("package_group_id", packageGroupId, "form", true, false, null),
                new QueryParameterSpec("plan_id", planId, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.MembershipsPackagesListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/memberships/packages"), queryString));
        }

        /// <summary>
        /// Memberships Packages Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.MembershipsPackagesCreateResult?> MembershipsPackagesCreateAsync(Sdkwork.ClawRouter.Backend.Models.CommerceMembershipPackageMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.MembershipsPackagesCreateResult>(ApiPaths.BackendPath("/memberships/packages"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Memberships Packages Delete
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.MembershipsPackagesDeleteResult?> MembershipsPackagesDeleteAsync(string packageId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.MembershipsPackagesDeleteResult>(ApiPaths.BackendPath($"/memberships/packages/{SerializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false))}"));
        }

        /// <summary>
        /// Memberships Packages Update
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.MembershipsPackagesUpdateResult?> MembershipsPackagesUpdateAsync(string packageId, Sdkwork.ClawRouter.Backend.Models.CommerceMembershipPackageMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PutAsync<Sdkwork.ClawRouter.Backend.Models.MembershipsPackagesUpdateResult>(ApiPaths.BackendPath($"/memberships/packages/{SerializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false))}"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Memberships Plans List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.MembershipsPlansListResult?> MembershipsPlansListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.MembershipsPlansListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/memberships/plans"), queryString));
        }

        /// <summary>
        /// Memberships Plans Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.MembershipsPlansCreateResult?> MembershipsPlansCreateAsync(Sdkwork.ClawRouter.Backend.Models.CommerceMembershipPlanMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.MembershipsPlansCreateResult>(ApiPaths.BackendPath("/memberships/plans"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Memberships Plans Delete
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.MembershipsPlansDeleteResult?> MembershipsPlansDeleteAsync(string planId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.MembershipsPlansDeleteResult>(ApiPaths.BackendPath($"/memberships/plans/{SerializePathParameter(planId, new PathParameterSpec("planId", "simple", false))}"));
        }

        /// <summary>
        /// Memberships Plans Update
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.MembershipsPlansUpdateResult?> MembershipsPlansUpdateAsync(string planId, Sdkwork.ClawRouter.Backend.Models.CommerceMembershipPlanMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PutAsync<Sdkwork.ClawRouter.Backend.Models.MembershipsPlansUpdateResult>(ApiPaths.BackendPath($"/memberships/plans/{SerializePathParameter(planId, new PathParameterSpec("planId", "simple", false))}"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Orders List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.OrdersListResult?> OrdersListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.OrdersListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/orders"), queryString));
        }

        /// <summary>
        /// Orders Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.OrdersRetrieveResult?> OrdersRetrieveAsync(string orderId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.OrdersRetrieveResult>(ApiPaths.BackendPath($"/orders/{SerializePathParameter(orderId, new PathParameterSpec("orderId", "simple", false))}"));
        }

        /// <summary>
        /// Orders Events List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.OrdersEventsListResult?> OrdersEventsListAsync(string orderId, int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.OrdersEventsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath($"/orders/{SerializePathParameter(orderId, new PathParameterSpec("orderId", "simple", false))}/events"), queryString));
        }

        /// <summary>
        /// Payments Attempts List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.PaymentsAttemptsListResult?> PaymentsAttemptsListAsync(string? intentId = null, string? providerCode = null, int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("intent_id", intentId, "form", true, false, null),
                new QueryParameterSpec("provider_code", providerCode, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.PaymentsAttemptsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/payments/attempts"), queryString));
        }

        /// <summary>
        /// Payments Channels List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.PaymentsChannelsListResult?> PaymentsChannelsListAsync(string? providerAccountId = null, string? methodCode = null, int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("provider_account_id", providerAccountId, "form", true, false, null),
                new QueryParameterSpec("method_code", methodCode, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.PaymentsChannelsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/payments/channels"), queryString));
        }

        /// <summary>
        /// Payments Intents List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.PaymentsIntentsListResult?> PaymentsIntentsListAsync(string? orderId = null, string? providerCode = null, int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("order_id", orderId, "form", true, false, null),
                new QueryParameterSpec("provider_code", providerCode, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.PaymentsIntentsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/payments/intents"), queryString));
        }

        /// <summary>
        /// Payments Methods List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.PaymentsMethodsListResult?> PaymentsMethodsListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.PaymentsMethodsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/payments/methods"), queryString));
        }

        /// <summary>
        /// Payments Provider Accounts List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.PaymentsProviderAccountsListResult?> PaymentsProviderAccountsListAsync(string? providerCode = null, int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("provider_code", providerCode, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.PaymentsProviderAccountsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/payments/provider_accounts"), queryString));
        }

        /// <summary>
        /// Payments Provider Accounts Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.PaymentsProviderAccountsCreateResult?> PaymentsProviderAccountsCreateAsync(Sdkwork.ClawRouter.Backend.Models.CommercePaymentProviderAccountMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.PaymentsProviderAccountsCreateResult>(ApiPaths.BackendPath("/payments/provider_accounts"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Payments Provider Accounts Delete
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.PaymentsProviderAccountsDeleteResult?> PaymentsProviderAccountsDeleteAsync(string providerAccountId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.PaymentsProviderAccountsDeleteResult>(ApiPaths.BackendPath($"/payments/provider_accounts/{SerializePathParameter(providerAccountId, new PathParameterSpec("providerAccountId", "simple", false))}"));
        }

        /// <summary>
        /// Payments Provider Accounts Update
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.PaymentsProviderAccountsUpdateResult?> PaymentsProviderAccountsUpdateAsync(string providerAccountId, Sdkwork.ClawRouter.Backend.Models.CommercePaymentProviderAccountMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PatchAsync<Sdkwork.ClawRouter.Backend.Models.PaymentsProviderAccountsUpdateResult>(ApiPaths.BackendPath($"/payments/provider_accounts/{SerializePathParameter(providerAccountId, new PathParameterSpec("providerAccountId", "simple", false))}"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Payments Provider Accounts Status Update
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.PaymentsProviderAccountsStatusUpdateResult?> PaymentsProviderAccountsStatusUpdateAsync(string providerAccountId, Sdkwork.ClawRouter.Backend.Models.CommercePaymentProviderAccountStatusUpdateRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PatchAsync<Sdkwork.ClawRouter.Backend.Models.PaymentsProviderAccountsStatusUpdateResult>(ApiPaths.BackendPath($"/payments/provider_accounts/{SerializePathParameter(providerAccountId, new PathParameterSpec("providerAccountId", "simple", false))}/status"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Payments Providers List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.PaymentsProvidersListResult?> PaymentsProvidersListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.PaymentsProvidersListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/payments/providers"), queryString));
        }

        /// <summary>
        /// Payments Reconciliation Runs List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.PaymentsReconciliationRunsListResult?> PaymentsReconciliationRunsListAsync(string? providerCode = null, string? businessDate = null, int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("provider_code", providerCode, "form", true, false, null),
                new QueryParameterSpec("business_date", businessDate, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.PaymentsReconciliationRunsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/payments/reconciliation_runs"), queryString));
        }

        /// <summary>
        /// Payments Route Rules List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.PaymentsRouteRulesListResult?> PaymentsRouteRulesListAsync(string? methodCode = null, string? countryCode = null, string? currencyCode = null, int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("method_code", methodCode, "form", true, false, null),
                new QueryParameterSpec("country_code", countryCode, "form", true, false, null),
                new QueryParameterSpec("currency_code", currencyCode, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.PaymentsRouteRulesListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/payments/route_rules"), queryString));
        }

        /// <summary>
        /// Payments Runtime Snapshot Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.PaymentsRuntimeSnapshotRetrieveResult?> PaymentsRuntimeSnapshotRetrieveAsync(string? environment = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("environment", environment, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.PaymentsRuntimeSnapshotRetrieveResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/payments/runtime/snapshot"), queryString));
        }

        /// <summary>
        /// Payments Webhook Events List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.PaymentsWebhookEventsListResult?> PaymentsWebhookEventsListAsync(string? providerCode = null, int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("provider_code", providerCode, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.PaymentsWebhookEventsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/payments/webhook_events"), queryString));
        }

        /// <summary>
        /// Recharges Orders List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.RechargesOrdersListResult?> RechargesOrdersListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.RechargesOrdersListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/recharges/orders"), queryString));
        }

        /// <summary>
        /// Recharges Packages List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.RechargesPackagesListResult?> RechargesPackagesListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.RechargesPackagesListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/recharges/packages"), queryString));
        }

        /// <summary>
        /// Recharges Packages Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.RechargesPackagesCreateResult?> RechargesPackagesCreateAsync(Sdkwork.ClawRouter.Backend.Models.CommerceRechargePackageMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.RechargesPackagesCreateResult>(ApiPaths.BackendPath("/recharges/packages"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Recharges Packages Delete
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.RechargesPackagesDeleteResult?> RechargesPackagesDeleteAsync(string packageId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.RechargesPackagesDeleteResult>(ApiPaths.BackendPath($"/recharges/packages/{SerializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false))}"));
        }

        /// <summary>
        /// Recharges Packages Update
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.RechargesPackagesUpdateResult?> RechargesPackagesUpdateAsync(string packageId, Sdkwork.ClawRouter.Backend.Models.CommerceRechargePackageMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PatchAsync<Sdkwork.ClawRouter.Backend.Models.RechargesPackagesUpdateResult>(ApiPaths.BackendPath($"/recharges/packages/{SerializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false))}"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Recharges Settings Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.RechargesSettingsRetrieveResult?> RechargesSettingsRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.RechargesSettingsRetrieveResult>(ApiPaths.BackendPath("/recharges/settings"));
        }

        /// <summary>
        /// Recharges Settings Update
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.RechargesSettingsUpdateResult?> RechargesSettingsUpdateAsync(Sdkwork.ClawRouter.Backend.Models.CommerceRechargeSettingsUpdateRequest body)
        {
            return await _client.PutAsync<Sdkwork.ClawRouter.Backend.Models.RechargesSettingsUpdateResult>(ApiPaths.BackendPath("/recharges/settings"), body, null, null, "application/json");
        }

        /// <summary>
        /// Refunds List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.RefundsListResult?> RefundsListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.RefundsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/refunds"), queryString));
        }

        /// <summary>
        /// Refunds Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.RefundsRetrieveResult?> RefundsRetrieveAsync(string refundId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.RefundsRetrieveResult>(ApiPaths.BackendPath($"/refunds/{SerializePathParameter(refundId, new PathParameterSpec("refundId", "simple", false))}"));
        }

        /// <summary>
        /// Shipments List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.ShipmentsListResult?> ShipmentsListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.ShipmentsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/shipments"), queryString));
        }

        /// <summary>
        /// Shipments Tracking Events List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.ShipmentsTrackingEventsListResult?> ShipmentsTrackingEventsListAsync(string shipmentId, int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.ShipmentsTrackingEventsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath($"/shipments/{SerializePathParameter(shipmentId, new PathParameterSpec("shipmentId", "simple", false))}/tracking_events"), queryString));
        }

        /// <summary>
        /// Wallet Accounts List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.WalletAccountsListResult?> WalletAccountsListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.WalletAccountsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/wallet/accounts"), queryString));
        }

        /// <summary>
        /// Wallet Adjustments Create
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.WalletAdjustmentsCreateResult?> WalletAdjustmentsCreateAsync(Sdkwork.ClawRouter.Backend.Models.CommerceStandardCommandRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.WalletAdjustmentsCreateResult>(ApiPaths.BackendPath("/wallet/adjustments"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Wallet Exchange Rules List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.WalletExchangeRulesListResult?> WalletExchangeRulesListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.WalletExchangeRulesListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/wallet/exchange_rules"), queryString));
        }

        /// <summary>
        /// Wallet Ledger Entries List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.WalletLedgerEntriesListResult?> WalletLedgerEntriesListAsync(int? page = null, int? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.WalletLedgerEntriesListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/wallet/ledger_entries"), queryString));
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
