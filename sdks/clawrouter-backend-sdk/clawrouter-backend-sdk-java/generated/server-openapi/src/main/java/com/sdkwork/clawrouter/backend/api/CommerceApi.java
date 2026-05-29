package com.sdkwork.clawrouter.backend.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.sdkwork.clawrouter.backend.http.HttpClient;
import com.sdkwork.clawrouter.backend.model.*;
import java.util.List;
import java.util.Map;

public class CommerceApi {
    private final HttpClient client;

    public CommerceApi(HttpClient client) {
        this.client = client;
    }

    /** Audit Commerce Events List */
    public AuditCommerceEventsListResult auditCommerceEventsList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/audit/commerce_events"), query));
        return client.convertValue(raw, new TypeReference<AuditCommerceEventsListResult>() {});
    }

    /** List product attributes */
    public CatalogAttributesListResult catalogAttributesList(String scope, String status, Integer page, Integer pageSize) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("scope", scope, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/catalog/attributes"), query));
        return client.convertValue(raw, new TypeReference<CatalogAttributesListResult>() {});
    }

    /** Create product attribute */
    public CatalogAttributesCreateResult catalogAttributesCreate(CommerceProductAttributeMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.backendPath("/catalog/attributes"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CatalogAttributesCreateResult>() {});
    }

    /** List product categories for admin management */
    public CatalogCategoriesListResult catalogCategoriesList(String parentId, String status, Integer page, Integer pageSize) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("parent_id", parentId, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/catalog/categories"), query));
        return client.convertValue(raw, new TypeReference<CatalogCategoriesListResult>() {});
    }

    /** Create product category */
    public CatalogCategoriesCreateResult catalogCategoriesCreate(CommerceProductCategoryMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.backendPath("/catalog/categories"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CatalogCategoriesCreateResult>() {});
    }

    /** Delete product category */
    public CatalogCategoriesDeleteResult catalogCategoriesDelete(String categoryId) throws Exception {
        Object raw = client.delete(ApiPaths.backendPath("/catalog/categories/" + serializePathParameter(categoryId, new PathParameterSpec("categoryId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<CatalogCategoriesDeleteResult>() {});
    }

    /** Update product category */
    public CatalogCategoriesUpdateResult catalogCategoriesUpdate(String categoryId, CommerceProductCategoryMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.patch(ApiPaths.backendPath("/catalog/categories/" + serializePathParameter(categoryId, new PathParameterSpec("categoryId", "simple", false)) + ""), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CatalogCategoriesUpdateResult>() {});
    }

    /** List product price lists */
    public CatalogPriceListsListResult catalogPriceLists(String currencyCode, String marketCode, String status, Integer page, Integer pageSize) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("currency_code", currencyCode, "form", true, false, null),
            new QueryParameterSpec("market_code", marketCode, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/catalog/price_lists"), query));
        return client.convertValue(raw, new TypeReference<CatalogPriceListsListResult>() {});
    }

    /** Create product price list */
    public CatalogPriceListsCreateResult catalogPriceListsCreate(CommercePriceListMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.backendPath("/catalog/price_lists"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CatalogPriceListsCreateResult>() {});
    }

    /** List products for admin management */
    public CatalogProductsListResult catalogProductsList(String q, String categoryId, String productType, String status, Integer page, Integer pageSize, String sort) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("q", q, "form", true, false, null),
            new QueryParameterSpec("category_id", categoryId, "form", true, false, null),
            new QueryParameterSpec("product_type", productType, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("sort", sort, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/catalog/products"), query));
        return client.convertValue(raw, new TypeReference<CatalogProductsListResult>() {});
    }

    /** Create product SPU */
    public CatalogProductsCreateResult catalogProductsCreate(CommerceProductSpuMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.backendPath("/catalog/products"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CatalogProductsCreateResult>() {});
    }

    /** Update product SPU */
    public CatalogProductsUpdateResult catalogProductsUpdate(String productId, CommerceProductSpuMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.patch(ApiPaths.backendPath("/catalog/products/" + serializePathParameter(productId, new PathParameterSpec("productId", "simple", false)) + ""), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CatalogProductsUpdateResult>() {});
    }

    /** List product SKUs for admin management */
    public CatalogSkusListResult catalogSkusList(String productId, String fulfillmentType, String status, Integer page, Integer pageSize) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("product_id", productId, "form", true, false, null),
            new QueryParameterSpec("fulfillment_type", fulfillmentType, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/catalog/skus"), query));
        return client.convertValue(raw, new TypeReference<CatalogSkusListResult>() {});
    }

    /** Create product SKU */
    public CatalogSkusCreateResult catalogSkusCreate(CommerceProductSkuMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.backendPath("/catalog/skus"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CatalogSkusCreateResult>() {});
    }

    /** Update product SKU */
    public CatalogSkusUpdateResult catalogSkusUpdate(String skuId, CommerceProductSkuMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.patch(ApiPaths.backendPath("/catalog/skus/" + serializePathParameter(skuId, new PathParameterSpec("skuId", "simple", false)) + ""), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CatalogSkusUpdateResult>() {});
    }

    /** Commerce Reports Order Revenue List */
    public CommerceReportsOrderRevenueListResult reportsOrderRevenueList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/commerce_reports/order_revenue"), query));
        return client.convertValue(raw, new TypeReference<CommerceReportsOrderRevenueListResult>() {});
    }

    /** Commerce Reports Payment Reconciliation Retrieve */
    public CommerceReportsPaymentReconciliationRetrieveResult reportsPaymentReconciliationRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.backendPath("/commerce_reports/payment_reconciliation"));
        return client.convertValue(raw, new TypeReference<CommerceReportsPaymentReconciliationRetrieveResult>() {});
    }

    /** Commerce Reports Refunds List */
    public CommerceReportsRefundsListResult reportsRefundsList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/commerce_reports/refunds"), query));
        return client.convertValue(raw, new TypeReference<CommerceReportsRefundsListResult>() {});
    }

    /** Fulfillments List */
    public FulfillmentsListResult fulfillmentsList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/fulfillments"), query));
        return client.convertValue(raw, new TypeReference<FulfillmentsListResult>() {});
    }

    /** List inventory ledger entries */
    public InventoryLedgerEntriesListResult inventoryLedgerEntriesList(String skuId, String warehouseId, String sourceType, String sourceId, Integer page, Integer pageSize) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("sku_id", skuId, "form", true, false, null),
            new QueryParameterSpec("warehouse_id", warehouseId, "form", true, false, null),
            new QueryParameterSpec("source_type", sourceType, "form", true, false, null),
            new QueryParameterSpec("source_id", sourceId, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/inventory/ledger_entries"), query));
        return client.convertValue(raw, new TypeReference<InventoryLedgerEntriesListResult>() {});
    }

    /** List inventory reservations */
    public InventoryReservationsListResult inventoryReservationsList(String skuId, String orderId, String checkoutSessionId, String status, Integer page, Integer pageSize) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("sku_id", skuId, "form", true, false, null),
            new QueryParameterSpec("order_id", orderId, "form", true, false, null),
            new QueryParameterSpec("checkout_session_id", checkoutSessionId, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/inventory/reservations"), query));
        return client.convertValue(raw, new TypeReference<InventoryReservationsListResult>() {});
    }

    /** List inventory stock records */
    public InventoryStocksListResult inventoryStocksList(String skuId, String warehouseId, String status, Integer page, Integer pageSize) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("sku_id", skuId, "form", true, false, null),
            new QueryParameterSpec("warehouse_id", warehouseId, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/inventory/stocks"), query));
        return client.convertValue(raw, new TypeReference<InventoryStocksListResult>() {});
    }

    /** Update inventory stock */
    public InventoryStocksUpdateResult inventoryStocksUpdate(String stockId, CommerceInventoryStockUpdateRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.patch(ApiPaths.backendPath("/inventory/stocks/" + serializePathParameter(stockId, new PathParameterSpec("stockId", "simple", false)) + ""), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<InventoryStocksUpdateResult>() {});
    }

    /** Invoices List */
    public InvoicesListResult invoicesList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/invoices"), query));
        return client.convertValue(raw, new TypeReference<InvoicesListResult>() {});
    }

    /** Invoices Titles List */
    public InvoicesTitlesListResult invoicesTitlesList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/invoices/titles"), query));
        return client.convertValue(raw, new TypeReference<InvoicesTitlesListResult>() {});
    }

    /** Invoices Retrieve */
    public InvoicesRetrieveResult invoicesRetrieve(String invoiceId) throws Exception {
        Object raw = client.get(ApiPaths.backendPath("/invoices/" + serializePathParameter(invoiceId, new PathParameterSpec("invoiceId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<InvoicesRetrieveResult>() {});
    }

    /** Memberships Entitlements List */
    public MembershipsEntitlementsListResult membershipsEntitlementsList(Integer page, Integer pageSize, String planId, String membershipId, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("plan_id", planId, "form", true, false, null),
            new QueryParameterSpec("membership_id", membershipId, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/memberships/entitlements"), query));
        return client.convertValue(raw, new TypeReference<MembershipsEntitlementsListResult>() {});
    }

    /** Memberships Members List */
    public MembershipsMembersListResult membershipsMembersList(Integer page, Integer pageSize, String cursor, String userId, String planId, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("cursor", cursor, "form", true, false, null),
            new QueryParameterSpec("user_id", userId, "form", true, false, null),
            new QueryParameterSpec("plan_id", planId, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/memberships/members"), query));
        return client.convertValue(raw, new TypeReference<MembershipsMembersListResult>() {});
    }

    /** Memberships Members Status Update */
    public MembershipsMembersStatusUpdateResult membershipsMembersStatusUpdate(String membershipId, CommerceMembershipMemberStatusRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.patch(ApiPaths.backendPath("/memberships/members/" + serializePathParameter(membershipId, new PathParameterSpec("membershipId", "simple", false)) + "/status"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<MembershipsMembersStatusUpdateResult>() {});
    }

    /** Memberships Package Groups List */
    public MembershipsPackageGroupsListResult membershipsPackageGroupsList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/memberships/package_groups"), query));
        return client.convertValue(raw, new TypeReference<MembershipsPackageGroupsListResult>() {});
    }

    /** Memberships Package Groups Create */
    public MembershipsPackageGroupsCreateResult membershipsPackageGroupsCreate(CommerceMembershipPackageGroupMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.backendPath("/memberships/package_groups"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<MembershipsPackageGroupsCreateResult>() {});
    }

    /** Memberships Package Groups Delete */
    public MembershipsPackageGroupsDeleteResult membershipsPackageGroupsDelete(String packageGroupId) throws Exception {
        Object raw = client.delete(ApiPaths.backendPath("/memberships/package_groups/" + serializePathParameter(packageGroupId, new PathParameterSpec("packageGroupId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<MembershipsPackageGroupsDeleteResult>() {});
    }

    /** Memberships Package Groups Update */
    public MembershipsPackageGroupsUpdateResult membershipsPackageGroupsUpdate(String packageGroupId, CommerceMembershipPackageGroupMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.put(ApiPaths.backendPath("/memberships/package_groups/" + serializePathParameter(packageGroupId, new PathParameterSpec("packageGroupId", "simple", false)) + ""), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<MembershipsPackageGroupsUpdateResult>() {});
    }

    /** Memberships Packages List */
    public MembershipsPackagesListResult membershipsPackagesList(Integer page, Integer pageSize, String packageGroupId, String planId, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("package_group_id", packageGroupId, "form", true, false, null),
            new QueryParameterSpec("plan_id", planId, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/memberships/packages"), query));
        return client.convertValue(raw, new TypeReference<MembershipsPackagesListResult>() {});
    }

    /** Memberships Packages Create */
    public MembershipsPackagesCreateResult membershipsPackagesCreate(CommerceMembershipPackageMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.backendPath("/memberships/packages"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<MembershipsPackagesCreateResult>() {});
    }

    /** Memberships Packages Delete */
    public MembershipsPackagesDeleteResult membershipsPackagesDelete(String packageId) throws Exception {
        Object raw = client.delete(ApiPaths.backendPath("/memberships/packages/" + serializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<MembershipsPackagesDeleteResult>() {});
    }

    /** Memberships Packages Update */
    public MembershipsPackagesUpdateResult membershipsPackagesUpdate(String packageId, CommerceMembershipPackageMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.put(ApiPaths.backendPath("/memberships/packages/" + serializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false)) + ""), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<MembershipsPackagesUpdateResult>() {});
    }

    /** Memberships Plans List */
    public MembershipsPlansListResult membershipsPlansList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/memberships/plans"), query));
        return client.convertValue(raw, new TypeReference<MembershipsPlansListResult>() {});
    }

    /** Memberships Plans Create */
    public MembershipsPlansCreateResult membershipsPlansCreate(CommerceMembershipPlanMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.backendPath("/memberships/plans"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<MembershipsPlansCreateResult>() {});
    }

    /** Memberships Plans Delete */
    public MembershipsPlansDeleteResult membershipsPlansDelete(String planId) throws Exception {
        Object raw = client.delete(ApiPaths.backendPath("/memberships/plans/" + serializePathParameter(planId, new PathParameterSpec("planId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<MembershipsPlansDeleteResult>() {});
    }

    /** Memberships Plans Update */
    public MembershipsPlansUpdateResult membershipsPlansUpdate(String planId, CommerceMembershipPlanMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.put(ApiPaths.backendPath("/memberships/plans/" + serializePathParameter(planId, new PathParameterSpec("planId", "simple", false)) + ""), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<MembershipsPlansUpdateResult>() {});
    }

    /** Orders List */
    public OrdersListResult ordersList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/orders"), query));
        return client.convertValue(raw, new TypeReference<OrdersListResult>() {});
    }

    /** Orders Retrieve */
    public OrdersRetrieveResult ordersRetrieve(String orderId) throws Exception {
        Object raw = client.get(ApiPaths.backendPath("/orders/" + serializePathParameter(orderId, new PathParameterSpec("orderId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<OrdersRetrieveResult>() {});
    }

    /** Orders Events List */
    public OrdersEventsListResult ordersEventsList(String orderId, Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/orders/" + serializePathParameter(orderId, new PathParameterSpec("orderId", "simple", false)) + "/events"), query));
        return client.convertValue(raw, new TypeReference<OrdersEventsListResult>() {});
    }

    /** Payments Attempts List */
    public PaymentsAttemptsListResult paymentsAttemptsList(String intentId, String providerCode, Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("intent_id", intentId, "form", true, false, null),
            new QueryParameterSpec("provider_code", providerCode, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/attempts"), query));
        return client.convertValue(raw, new TypeReference<PaymentsAttemptsListResult>() {});
    }

    /** Payments Channels List */
    public PaymentsChannelsListResult paymentsChannelsList(String providerAccountId, String methodCode, Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("provider_account_id", providerAccountId, "form", true, false, null),
            new QueryParameterSpec("method_code", methodCode, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/channels"), query));
        return client.convertValue(raw, new TypeReference<PaymentsChannelsListResult>() {});
    }

    /** Payments Intents List */
    public PaymentsIntentsListResult paymentsIntentsList(String orderId, String providerCode, Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("order_id", orderId, "form", true, false, null),
            new QueryParameterSpec("provider_code", providerCode, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/intents"), query));
        return client.convertValue(raw, new TypeReference<PaymentsIntentsListResult>() {});
    }

    /** Payments Methods List */
    public PaymentsMethodsListResult paymentsMethodsList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/methods"), query));
        return client.convertValue(raw, new TypeReference<PaymentsMethodsListResult>() {});
    }

    /** Payments Provider Accounts List */
    public PaymentsProviderAccountsListResult paymentsProviderAccountsList(String providerCode, Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("provider_code", providerCode, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/provider_accounts"), query));
        return client.convertValue(raw, new TypeReference<PaymentsProviderAccountsListResult>() {});
    }

    /** Payments Provider Accounts Create */
    public PaymentsProviderAccountsCreateResult paymentsProviderAccountsCreate(CommercePaymentProviderAccountMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.backendPath("/payments/provider_accounts"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<PaymentsProviderAccountsCreateResult>() {});
    }

    /** Payments Providers List */
    public PaymentsProvidersListResult paymentsProvidersList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/providers"), query));
        return client.convertValue(raw, new TypeReference<PaymentsProvidersListResult>() {});
    }

    /** Payments Reconciliation Runs List */
    public PaymentsReconciliationRunsListResult paymentsReconciliationRunsList(String providerCode, String businessDate, Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("provider_code", providerCode, "form", true, false, null),
            new QueryParameterSpec("business_date", businessDate, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/reconciliation_runs"), query));
        return client.convertValue(raw, new TypeReference<PaymentsReconciliationRunsListResult>() {});
    }

    /** Payments Route Rules List */
    public PaymentsRouteRulesListResult paymentsRouteRulesList(String methodCode, String countryCode, String currencyCode, Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("method_code", methodCode, "form", true, false, null),
            new QueryParameterSpec("country_code", countryCode, "form", true, false, null),
            new QueryParameterSpec("currency_code", currencyCode, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/route_rules"), query));
        return client.convertValue(raw, new TypeReference<PaymentsRouteRulesListResult>() {});
    }

    /** Payments Webhook Events List */
    public PaymentsWebhookEventsListResult paymentsWebhookEventsList(String providerCode, Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("provider_code", providerCode, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/webhook_events"), query));
        return client.convertValue(raw, new TypeReference<PaymentsWebhookEventsListResult>() {});
    }

    /** Recharges Orders List */
    public RechargesOrdersListResult rechargesOrdersList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/recharges/orders"), query));
        return client.convertValue(raw, new TypeReference<RechargesOrdersListResult>() {});
    }

    /** Recharges Packages List */
    public RechargesPackagesListResult rechargesPackagesList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/recharges/packages"), query));
        return client.convertValue(raw, new TypeReference<RechargesPackagesListResult>() {});
    }

    /** Recharges Packages Create */
    public RechargesPackagesCreateResult rechargesPackagesCreate(CommerceRechargePackageMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.backendPath("/recharges/packages"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<RechargesPackagesCreateResult>() {});
    }

    /** Recharges Packages Delete */
    public RechargesPackagesDeleteResult rechargesPackagesDelete(String packageId) throws Exception {
        Object raw = client.delete(ApiPaths.backendPath("/recharges/packages/" + serializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<RechargesPackagesDeleteResult>() {});
    }

    /** Recharges Packages Update */
    public RechargesPackagesUpdateResult rechargesPackagesUpdate(String packageId, CommerceRechargePackageMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.patch(ApiPaths.backendPath("/recharges/packages/" + serializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false)) + ""), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<RechargesPackagesUpdateResult>() {});
    }

    /** Refunds List */
    public RefundsListResult refundsList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/refunds"), query));
        return client.convertValue(raw, new TypeReference<RefundsListResult>() {});
    }

    /** Refunds Retrieve */
    public RefundsRetrieveResult refundsRetrieve(String refundId) throws Exception {
        Object raw = client.get(ApiPaths.backendPath("/refunds/" + serializePathParameter(refundId, new PathParameterSpec("refundId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<RefundsRetrieveResult>() {});
    }

    /** Shipments List */
    public ShipmentsListResult shipmentsList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/shipments"), query));
        return client.convertValue(raw, new TypeReference<ShipmentsListResult>() {});
    }

    /** Shipments Tracking Events List */
    public ShipmentsTrackingEventsListResult shipmentsTrackingEventsList(String shipmentId, Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/shipments/" + serializePathParameter(shipmentId, new PathParameterSpec("shipmentId", "simple", false)) + "/tracking_events"), query));
        return client.convertValue(raw, new TypeReference<ShipmentsTrackingEventsListResult>() {});
    }

    /** Wallet Accounts List */
    public WalletAccountsListResult walletAccountsList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/wallet/accounts"), query));
        return client.convertValue(raw, new TypeReference<WalletAccountsListResult>() {});
    }

    /** Wallet Adjustments Create */
    public WalletAdjustmentsCreateResult walletAdjustmentsCreate(CommerceStandardCommandRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.backendPath("/wallet/adjustments"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<WalletAdjustmentsCreateResult>() {});
    }

    /** Wallet Exchange Rules List */
    public WalletExchangeRulesListResult walletExchangeRulesList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/wallet/exchange_rules"), query));
        return client.convertValue(raw, new TypeReference<WalletExchangeRulesListResult>() {});
    }

    /** Wallet Ledger Entries List */
    public WalletLedgerEntriesListResult walletLedgerEntriesList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/wallet/ledger_entries"), query));
        return client.convertValue(raw, new TypeReference<WalletLedgerEntriesListResult>() {});
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
