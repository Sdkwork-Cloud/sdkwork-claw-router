package com.sdkwork.clawrouter.app.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.sdkwork.clawrouter.app.http.HttpClient;
import com.sdkwork.clawrouter.app.model.*;
import java.util.List;
import java.util.Map;

public class CommerceApi {
    private final HttpClient client;

    public CommerceApi(HttpClient client) {
        this.client = client;
    }

    /** Accounts Current Summary Retrieve */
    public AccountsCurrentSummaryRetrieveResult accountsCurrentSummaryRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/accounts/current/summary"));
        return client.convertValue(raw, new TypeReference<AccountsCurrentSummaryRetrieveResult>() {});
    }

    /** Addresses List */
    public AddressesListResult addressesList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/addresses"), query));
        return client.convertValue(raw, new TypeReference<AddressesListResult>() {});
    }

    /** Addresses Create */
    public AddressesCreateResult addressesCreate(CommerceStandardCommandRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/addresses"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<AddressesCreateResult>() {});
    }

    /** Addresses Delete */
    public AddressesDeleteResult addressesDelete(String addressId, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.delete(ApiPaths.appPath("/addresses/" + serializePathParameter(addressId, new PathParameterSpec("addressId", "simple", false)) + ""), null, requestHeaders);
        return client.convertValue(raw, new TypeReference<AddressesDeleteResult>() {});
    }

    /** Addresses Update */
    public AddressesUpdateResult addressesUpdate(String addressId, CommerceStandardCommandRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.patch(ApiPaths.appPath("/addresses/" + serializePathParameter(addressId, new PathParameterSpec("addressId", "simple", false)) + ""), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<AddressesUpdateResult>() {});
    }

    /** Addresses Default Selection Create */
    public AddressesDefaultSelectionCreateResult addressesDefaultSelectionCreate(String addressId, CommerceStandardCommandRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/addresses/" + serializePathParameter(addressId, new PathParameterSpec("addressId", "simple", false)) + "/default_selection"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<AddressesDefaultSelectionCreateResult>() {});
    }

    /** Billing History List */
    public BillingHistoryListResult billingHistoryList(Integer page, Integer pageSize, String type, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("type", type, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/history"), query));
        return client.convertValue(raw, new TypeReference<BillingHistoryListResult>() {});
    }

    /** Cart Current Retrieve */
    public CartCurrentRetrieveResult cartCurrentRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/cart/current"));
        return client.convertValue(raw, new TypeReference<CartCurrentRetrieveResult>() {});
    }

    /** Cart Items Create */
    public CartItemsCreateResult cartItemsCreate(CommerceStandardCommandRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/cart/items"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CartItemsCreateResult>() {});
    }

    /** Cart Items Delete */
    public CartItemsDeleteResult cartItemsDelete(String cartItemId, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.delete(ApiPaths.appPath("/cart/items/" + serializePathParameter(cartItemId, new PathParameterSpec("cartItemId", "simple", false)) + ""), null, requestHeaders);
        return client.convertValue(raw, new TypeReference<CartItemsDeleteResult>() {});
    }

    /** Cart Items Update */
    public CartItemsUpdateResult cartItemsUpdate(String cartItemId, CommerceStandardCommandRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.patch(ApiPaths.appPath("/cart/items/" + serializePathParameter(cartItemId, new PathParameterSpec("cartItemId", "simple", false)) + ""), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CartItemsUpdateResult>() {});
    }

    /** List visible product categories */
    public CatalogCategoriesListResult catalogCategoriesList(String parentId, String status, Integer page, Integer pageSize) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("parent_id", parentId, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/catalog/categories"), query));
        return client.convertValue(raw, new TypeReference<CatalogCategoriesListResult>() {});
    }

    /** List visible catalog products */
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
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/catalog/products"), query));
        return client.convertValue(raw, new TypeReference<CatalogProductsListResult>() {});
    }

    /** Retrieve catalog product detail */
    public CatalogProductsRetrieveResult catalogProductsRetrieve(String productId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/catalog/products/" + serializePathParameter(productId, new PathParameterSpec("productId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<CatalogProductsRetrieveResult>() {});
    }

    /** Retrieve catalog SKU detail */
    public CatalogSkusRetrieveResult catalogSkusRetrieve(String skuId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/catalog/skus/" + serializePathParameter(skuId, new PathParameterSpec("skuId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<CatalogSkusRetrieveResult>() {});
    }

    /** Checkout Sessions Create */
    public CheckoutSessionsCreateResult checkoutSessionsCreate(CommerceStandardCommandRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/checkout/sessions"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CheckoutSessionsCreateResult>() {});
    }

    /** Checkout Sessions Retrieve */
    public CheckoutSessionsRetrieveResult checkoutSessionsRetrieve(String checkoutSessionId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/checkout/sessions/" + serializePathParameter(checkoutSessionId, new PathParameterSpec("checkoutSessionId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<CheckoutSessionsRetrieveResult>() {});
    }

    /** Checkout Sessions Orders Create */
    public CheckoutSessionsOrdersCreateResult checkoutSessionsOrdersCreate(String checkoutSessionId, CommerceStandardCommandRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/checkout/sessions/" + serializePathParameter(checkoutSessionId, new PathParameterSpec("checkoutSessionId", "simple", false)) + "/orders"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CheckoutSessionsOrdersCreateResult>() {});
    }

    /** Checkout Sessions Quotes Create */
    public CheckoutSessionsQuotesCreateResult checkoutSessionsQuotesCreate(String checkoutSessionId, CommerceStandardCommandRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/checkout/sessions/" + serializePathParameter(checkoutSessionId, new PathParameterSpec("checkoutSessionId", "simple", false)) + "/quotes"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CheckoutSessionsQuotesCreateResult>() {});
    }

    /** Fulfillments List */
    public FulfillmentsListResult fulfillmentsList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/fulfillments"), query));
        return client.convertValue(raw, new TypeReference<FulfillmentsListResult>() {});
    }

    /** Fulfillments Retrieve */
    public FulfillmentsRetrieveResult fulfillmentsRetrieve(String fulfillmentId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/fulfillments/" + serializePathParameter(fulfillmentId, new PathParameterSpec("fulfillmentId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<FulfillmentsRetrieveResult>() {});
    }

    /** Invoices List */
    public InvoicesListResult invoicesList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/invoices"), query));
        return client.convertValue(raw, new TypeReference<InvoicesListResult>() {});
    }

    /** Invoices Create */
    public InvoicesCreateResult invoicesCreate(CommerceStandardCommandRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/invoices"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<InvoicesCreateResult>() {});
    }

    /** Invoices Retrieve */
    public InvoicesRetrieveResult invoicesRetrieve(String invoiceId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/invoices/" + serializePathParameter(invoiceId, new PathParameterSpec("invoiceId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<InvoicesRetrieveResult>() {});
    }

    /** Memberships Benefits List */
    public MembershipsBenefitsListResult membershipsBenefitsList(Integer planId) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("plan_id", planId, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/memberships/benefits"), query));
        return client.convertValue(raw, new TypeReference<MembershipsBenefitsListResult>() {});
    }

    /** Memberships Current Retrieve */
    public MembershipsCurrentRetrieveResult membershipsCurrentRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/memberships/current"));
        return client.convertValue(raw, new TypeReference<MembershipsCurrentRetrieveResult>() {});
    }

    /** Memberships Current Status Retrieve */
    public MembershipsCurrentStatusRetrieveResult membershipsCurrentStatusRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/memberships/current/status"));
        return client.convertValue(raw, new TypeReference<MembershipsCurrentStatusRetrieveResult>() {});
    }

    /** Memberships Package Groups List */
    public MembershipsPackageGroupsListResult getMembershipsPackageGroupsList(Integer planId, Boolean recommendedOnly) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("plan_id", planId, "form", true, false, null),
            new QueryParameterSpec("recommended_only", recommendedOnly, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/memberships/package_groups"), query));
        return client.convertValue(raw, new TypeReference<MembershipsPackageGroupsListResult>() {});
    }

    /** Memberships Package Groups Retrieve */
    public MembershipsPackageGroupsRetrieveResult membershipsPackageGroupsRetrieve(String packageGroupId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/memberships/package_groups/" + serializePathParameter(packageGroupId, new PathParameterSpec("packageGroupId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<MembershipsPackageGroupsRetrieveResult>() {});
    }

    /** Memberships Package Groups Packages List */
    public MembershipsPackageGroupsPackagesListResult getMembershipsPackageGroupsListPackageGroups(String packageGroupId, Integer planId) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("plan_id", planId, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/memberships/package_groups/" + serializePathParameter(packageGroupId, new PathParameterSpec("packageGroupId", "simple", false)) + "/packages"), query));
        return client.convertValue(raw, new TypeReference<MembershipsPackageGroupsPackagesListResult>() {});
    }

    /** Memberships Packages List */
    public MembershipsPackagesListResult membershipsPackagesList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/memberships/packages"), query));
        return client.convertValue(raw, new TypeReference<MembershipsPackagesListResult>() {});
    }

    /** Memberships Packages Retrieve */
    public MembershipsPackagesRetrieveResult membershipsPackagesRetrieve(String packageId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/memberships/packages/" + serializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<MembershipsPackagesRetrieveResult>() {});
    }

    /** Memberships Plans List */
    public MembershipsPlansListResult membershipsPlansList() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/memberships/plans"));
        return client.convertValue(raw, new TypeReference<MembershipsPlansListResult>() {});
    }

    /** Memberships Points Balance Retrieve */
    public MembershipsPointsBalanceRetrieveResult membershipsPointsBalanceRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/memberships/points/balance"));
        return client.convertValue(raw, new TypeReference<MembershipsPointsBalanceRetrieveResult>() {});
    }

    /** Memberships Points Daily Rewards Create */
    public MembershipsPointsDailyRewardsCreateResult membershipsPointsDailyRewardsCreate(MembershipsPointsDailyRewardsCreateRequest body, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/memberships/points/daily_rewards"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<MembershipsPointsDailyRewardsCreateResult>() {});
    }

    /** Memberships Points Daily Rewards Status Retrieve */
    public MembershipsPointsDailyRewardsStatusRetrieveResult membershipsPointsDailyRewardsStatusRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/memberships/points/daily_rewards/status"));
        return client.convertValue(raw, new TypeReference<MembershipsPointsDailyRewardsStatusRetrieveResult>() {});
    }

    /** Memberships Points History List */
    public MembershipsPointsHistoryListResult membershipsPointsHistoryList(Integer page, Integer pageSize, String cursor) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/memberships/points/history"), query));
        return client.convertValue(raw, new TypeReference<MembershipsPointsHistoryListResult>() {});
    }

    /** Memberships Privileges Speed Ups Create */
    public MembershipsPrivilegesSpeedUpsCreateResult membershipsPrivilegesSpeedUpsCreate(MembershipsPrivilegesSpeedUpsCreateRequest body, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/memberships/privileges/speed_ups"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<MembershipsPrivilegesSpeedUpsCreateResult>() {});
    }

    /** Memberships Privileges Usage Retrieve */
    public MembershipsPrivilegesUsageRetrieveResult membershipsPrivilegesUsageRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/memberships/privileges/usage"));
        return client.convertValue(raw, new TypeReference<MembershipsPrivilegesUsageRetrieveResult>() {});
    }

    /** Memberships Purchases Create */
    public MembershipsPurchasesCreateResult membershipsPurchasesCreate(CommerceMembershipPurchaseRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/memberships/purchases"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<MembershipsPurchasesCreateResult>() {});
    }

    /** Memberships Purchases Renew */
    public MembershipsPurchasesRenewResult membershipsPurchasesRenew(CommerceMembershipPurchaseRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/memberships/purchases/renew"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<MembershipsPurchasesRenewResult>() {});
    }

    /** Memberships Purchases Upgrade */
    public MembershipsPurchasesUpgradeResult membershipsPurchasesUpgrade(CommerceMembershipPurchaseRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/memberships/purchases/upgrade"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<MembershipsPurchasesUpgradeResult>() {});
    }

    /** Orders List */
    public OrdersListResult ordersList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/orders"), query));
        return client.convertValue(raw, new TypeReference<OrdersListResult>() {});
    }

    /** Orders Retrieve */
    public OrdersRetrieveResult ordersRetrieve(String orderId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/orders/" + serializePathParameter(orderId, new PathParameterSpec("orderId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<OrdersRetrieveResult>() {});
    }

    /** Orders Cancellations Create */
    public OrdersCancellationsCreateResult ordersCancellationsCreate(String orderId, CommerceStandardCommandRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/orders/" + serializePathParameter(orderId, new PathParameterSpec("orderId", "simple", false)) + "/cancellations"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<OrdersCancellationsCreateResult>() {});
    }

    /** Orders Events List */
    public OrdersEventsListResult ordersEventsList(String orderId, Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/orders/" + serializePathParameter(orderId, new PathParameterSpec("orderId", "simple", false)) + "/events"), query));
        return client.convertValue(raw, new TypeReference<OrdersEventsListResult>() {});
    }

    /** Payments Attempts Retrieve */
    public PaymentsAttemptsRetrieveResult paymentsAttemptsRetrieve(String paymentAttemptId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/payments/attempts/" + serializePathParameter(paymentAttemptId, new PathParameterSpec("paymentAttemptId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<PaymentsAttemptsRetrieveResult>() {});
    }

    /** Payments Intents Create */
    public PaymentsIntentsCreateResult paymentsIntentsCreate(CommercePaymentIntentCreateRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/payments/intents"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<PaymentsIntentsCreateResult>() {});
    }

    /** Payments Intents Retrieve */
    public PaymentsIntentsRetrieveResult paymentsIntentsRetrieve(String paymentIntentId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/payments/intents/" + serializePathParameter(paymentIntentId, new PathParameterSpec("paymentIntentId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<PaymentsIntentsRetrieveResult>() {});
    }

    /** Payments Intents Attempts Create */
    public PaymentsIntentsAttemptsCreateResult paymentsIntentsAttemptsCreate(String paymentIntentId, CommercePaymentAttemptCreateRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/payments/intents/" + serializePathParameter(paymentIntentId, new PathParameterSpec("paymentIntentId", "simple", false)) + "/attempts"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<PaymentsIntentsAttemptsCreateResult>() {});
    }

    /** Payments Methods List */
    public PaymentsMethodsListResult paymentsMethodsList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/payments/methods"), query));
        return client.convertValue(raw, new TypeReference<PaymentsMethodsListResult>() {});
    }

    /** Recharges Orders Create */
    public RechargesOrdersCreateResult rechargesOrdersCreate(CommerceStandardCommandRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/recharges/orders"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<RechargesOrdersCreateResult>() {});
    }

    /** Recharges Orders Retrieve */
    public RechargesOrdersRetrieveResult rechargesOrdersRetrieve(String orderId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/recharges/orders/" + serializePathParameter(orderId, new PathParameterSpec("orderId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<RechargesOrdersRetrieveResult>() {});
    }

    /** Recharges Packages List */
    public RechargesPackagesListResult rechargesPackagesList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/recharges/packages"), query));
        return client.convertValue(raw, new TypeReference<RechargesPackagesListResult>() {});
    }

    /** Refunds List */
    public RefundsListResult refundsList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/refunds"), query));
        return client.convertValue(raw, new TypeReference<RefundsListResult>() {});
    }

    /** Refunds Create */
    public RefundsCreateResult refundsCreate(CommerceStandardCommandRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/refunds"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<RefundsCreateResult>() {});
    }

    /** Refunds Retrieve */
    public RefundsRetrieveResult refundsRetrieve(String refundId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/refunds/" + serializePathParameter(refundId, new PathParameterSpec("refundId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<RefundsRetrieveResult>() {});
    }

    /** Shipments Retrieve */
    public ShipmentsRetrieveResult shipmentsRetrieve(String shipmentId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/shipments/" + serializePathParameter(shipmentId, new PathParameterSpec("shipmentId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<ShipmentsRetrieveResult>() {});
    }

    /** Wallet Accounts List */
    public WalletAccountsListResult walletAccountsList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/wallet/accounts"), query));
        return client.convertValue(raw, new TypeReference<WalletAccountsListResult>() {});
    }

    /** Wallet Exchange Rate Retrieve */
    public WalletExchangeRateRetrieveResult walletExchangeRateRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/wallet/exchange_rate"));
        return client.convertValue(raw, new TypeReference<WalletExchangeRateRetrieveResult>() {});
    }

    /** Wallet Ledger Entries List */
    public WalletLedgerEntriesListResult walletLedgerEntriesList(Integer page, Integer pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/wallet/ledger_entries"), query));
        return client.convertValue(raw, new TypeReference<WalletLedgerEntriesListResult>() {});
    }

    /** Wallet Overview Retrieve */
    public WalletOverviewRetrieveResult walletOverviewRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/wallet/overview"));
        return client.convertValue(raw, new TypeReference<WalletOverviewRetrieveResult>() {});
    }

    /** Wallet Points Exchange Rules List */
    public WalletPointsExchangeRulesListResult walletPointsExchangeRulesList(String sourceAssetType, String targetAssetType) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("source_asset_type", sourceAssetType, "form", true, false, null),
            new QueryParameterSpec("target_asset_type", targetAssetType, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/wallet/points/exchanges/rules"), query));
        return client.convertValue(raw, new TypeReference<WalletPointsExchangeRulesListResult>() {});
    }

    /** Wallet Tokens Retrieve */
    public WalletTokensRetrieveResult walletTokensRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/wallet/tokens"));
        return client.convertValue(raw, new TypeReference<WalletTokensRetrieveResult>() {});
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
