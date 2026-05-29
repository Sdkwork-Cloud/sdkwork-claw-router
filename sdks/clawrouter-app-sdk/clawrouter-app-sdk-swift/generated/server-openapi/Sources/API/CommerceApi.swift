import Foundation

public class CommerceApi {
    private let client: HttpClient

    public init(client: HttpClient) {
        self.client = client
    }

    /// Accounts Current Summary Retrieve
    public func accountsCurrentSummaryRetrieve() async throws -> AccountsCurrentSummaryRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/accounts/current/summary"), responseType: AccountsCurrentSummaryRetrieveResult.self)
    }

    /// Addresses List
    public func addressesList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> AddressesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/addresses"), query), responseType: AddressesListResult.self)
    }

    /// Addresses Create
    public func addressesCreate(body: CommerceStandardCommandRequest, idempotencyKey: String) async throws -> AddressesCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/addresses"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: AddressesCreateResult.self)
    }

    /// Addresses Delete
    public func addressesDelete(addressId: String, idempotencyKey: String) async throws -> AddressesDeleteResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.delete(ApiPaths.appPath("/addresses/\(serializePathParameter(addressId, PathParameterSpec(name: "addressId", style: "simple", explode: false)))"), params: nil, headers: requestHeaders, responseType: AddressesDeleteResult.self)
    }

    /// Addresses Update
    public func addressesUpdate(addressId: String, body: CommerceStandardCommandRequest, idempotencyKey: String) async throws -> AddressesUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.patch(ApiPaths.appPath("/addresses/\(serializePathParameter(addressId, PathParameterSpec(name: "addressId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: AddressesUpdateResult.self)
    }

    /// Addresses Default Selection Create
    public func addressesDefaultSelectionCreate(addressId: String, body: CommerceStandardCommandRequest, idempotencyKey: String) async throws -> AddressesDefaultSelectionCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/addresses/\(serializePathParameter(addressId, PathParameterSpec(name: "addressId", style: "simple", explode: false)))/default_selection"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: AddressesDefaultSelectionCreateResult.self)
    }

    /// Billing History List
    public func billingHistoryList(page: Int? = nil, pageSize: Int? = nil, type: String? = nil, status: String? = nil) async throws -> BillingHistoryListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "type", value: type, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/history"), query), responseType: BillingHistoryListResult.self)
    }

    /// Cart Current Retrieve
    public func cartCurrentRetrieve() async throws -> CartCurrentRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/cart/current"), responseType: CartCurrentRetrieveResult.self)
    }

    /// Cart Items Create
    public func cartItemsCreate(body: CommerceStandardCommandRequest, idempotencyKey: String) async throws -> CartItemsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/cart/items"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CartItemsCreateResult.self)
    }

    /// Cart Items Delete
    public func cartItemsDelete(cartItemId: String, idempotencyKey: String) async throws -> CartItemsDeleteResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.delete(ApiPaths.appPath("/cart/items/\(serializePathParameter(cartItemId, PathParameterSpec(name: "cartItemId", style: "simple", explode: false)))"), params: nil, headers: requestHeaders, responseType: CartItemsDeleteResult.self)
    }

    /// Cart Items Update
    public func cartItemsUpdate(cartItemId: String, body: CommerceStandardCommandRequest, idempotencyKey: String) async throws -> CartItemsUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.patch(ApiPaths.appPath("/cart/items/\(serializePathParameter(cartItemId, PathParameterSpec(name: "cartItemId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CartItemsUpdateResult.self)
    }

    /// List visible product categories
    public func catalogCategoriesList(parentId: String? = nil, status: String? = nil, page: Int? = nil, pageSize: Int? = nil) async throws -> CatalogCategoriesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "parent_id", value: parentId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/catalog/categories"), query), responseType: CatalogCategoriesListResult.self)
    }

    /// List visible catalog products
    public func catalogProductsList(q: String? = nil, categoryId: String? = nil, productType: String? = nil, status: String? = nil, page: Int? = nil, pageSize: Int? = nil, sort: String? = nil) async throws -> CatalogProductsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "q", value: q, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "category_id", value: categoryId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "product_type", value: productType, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "sort", value: sort, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/catalog/products"), query), responseType: CatalogProductsListResult.self)
    }

    /// Retrieve catalog product detail
    public func catalogProductsRetrieve(productId: String) async throws -> CatalogProductsRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/catalog/products/\(serializePathParameter(productId, PathParameterSpec(name: "productId", style: "simple", explode: false)))"), responseType: CatalogProductsRetrieveResult.self)
    }

    /// Retrieve catalog SKU detail
    public func catalogSkusRetrieve(skuId: String) async throws -> CatalogSkusRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/catalog/skus/\(serializePathParameter(skuId, PathParameterSpec(name: "skuId", style: "simple", explode: false)))"), responseType: CatalogSkusRetrieveResult.self)
    }

    /// Checkout Sessions Create
    public func checkoutSessionsCreate(body: CommerceStandardCommandRequest, idempotencyKey: String) async throws -> CheckoutSessionsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/checkout/sessions"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CheckoutSessionsCreateResult.self)
    }

    /// Checkout Sessions Retrieve
    public func checkoutSessionsRetrieve(checkoutSessionId: String) async throws -> CheckoutSessionsRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/checkout/sessions/\(serializePathParameter(checkoutSessionId, PathParameterSpec(name: "checkoutSessionId", style: "simple", explode: false)))"), responseType: CheckoutSessionsRetrieveResult.self)
    }

    /// Checkout Sessions Orders Create
    public func checkoutSessionsOrdersCreate(checkoutSessionId: String, body: CommerceStandardCommandRequest, idempotencyKey: String) async throws -> CheckoutSessionsOrdersCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/checkout/sessions/\(serializePathParameter(checkoutSessionId, PathParameterSpec(name: "checkoutSessionId", style: "simple", explode: false)))/orders"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CheckoutSessionsOrdersCreateResult.self)
    }

    /// Checkout Sessions Quotes Create
    public func checkoutSessionsQuotesCreate(checkoutSessionId: String, body: CommerceStandardCommandRequest, idempotencyKey: String) async throws -> CheckoutSessionsQuotesCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/checkout/sessions/\(serializePathParameter(checkoutSessionId, PathParameterSpec(name: "checkoutSessionId", style: "simple", explode: false)))/quotes"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CheckoutSessionsQuotesCreateResult.self)
    }

    /// Fulfillments List
    public func fulfillmentsList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> FulfillmentsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/fulfillments"), query), responseType: FulfillmentsListResult.self)
    }

    /// Fulfillments Retrieve
    public func fulfillmentsRetrieve(fulfillmentId: String) async throws -> FulfillmentsRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/fulfillments/\(serializePathParameter(fulfillmentId, PathParameterSpec(name: "fulfillmentId", style: "simple", explode: false)))"), responseType: FulfillmentsRetrieveResult.self)
    }

    /// Invoices List
    public func invoicesList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> InvoicesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/invoices"), query), responseType: InvoicesListResult.self)
    }

    /// Invoices Create
    public func invoicesCreate(body: CommerceStandardCommandRequest, idempotencyKey: String) async throws -> InvoicesCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/invoices"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: InvoicesCreateResult.self)
    }

    /// Invoices Retrieve
    public func invoicesRetrieve(invoiceId: String) async throws -> InvoicesRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/invoices/\(serializePathParameter(invoiceId, PathParameterSpec(name: "invoiceId", style: "simple", explode: false)))"), responseType: InvoicesRetrieveResult.self)
    }

    /// Memberships Benefits List
    public func membershipsBenefitsList(planId: Int? = nil) async throws -> MembershipsBenefitsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "plan_id", value: planId, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/memberships/benefits"), query), responseType: MembershipsBenefitsListResult.self)
    }

    /// Memberships Current Retrieve
    public func membershipsCurrentRetrieve() async throws -> MembershipsCurrentRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/memberships/current"), responseType: MembershipsCurrentRetrieveResult.self)
    }

    /// Memberships Current Status Retrieve
    public func membershipsCurrentStatusRetrieve() async throws -> MembershipsCurrentStatusRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/memberships/current/status"), responseType: MembershipsCurrentStatusRetrieveResult.self)
    }

    /// Memberships Package Groups List
    public func getMembershipsPackageGroupsList(planId: Int? = nil, recommendedOnly: Bool? = nil) async throws -> MembershipsPackageGroupsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "plan_id", value: planId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "recommended_only", value: recommendedOnly, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/memberships/package_groups"), query), responseType: MembershipsPackageGroupsListResult.self)
    }

    /// Memberships Package Groups Retrieve
    public func membershipsPackageGroupsRetrieve(packageGroupId: String) async throws -> MembershipsPackageGroupsRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/memberships/package_groups/\(serializePathParameter(packageGroupId, PathParameterSpec(name: "packageGroupId", style: "simple", explode: false)))"), responseType: MembershipsPackageGroupsRetrieveResult.self)
    }

    /// Memberships Package Groups Packages List
    public func getMembershipsPackageGroupsListPackageGroups(packageGroupId: String, planId: Int? = nil) async throws -> MembershipsPackageGroupsPackagesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "plan_id", value: planId, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/memberships/package_groups/\(serializePathParameter(packageGroupId, PathParameterSpec(name: "packageGroupId", style: "simple", explode: false)))/packages"), query), responseType: MembershipsPackageGroupsPackagesListResult.self)
    }

    /// Memberships Packages List
    public func membershipsPackagesList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> MembershipsPackagesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/memberships/packages"), query), responseType: MembershipsPackagesListResult.self)
    }

    /// Memberships Packages Retrieve
    public func membershipsPackagesRetrieve(packageId: String) async throws -> MembershipsPackagesRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/memberships/packages/\(serializePathParameter(packageId, PathParameterSpec(name: "packageId", style: "simple", explode: false)))"), responseType: MembershipsPackagesRetrieveResult.self)
    }

    /// Memberships Plans List
    public func membershipsPlansList() async throws -> MembershipsPlansListResult? {
        return try await client.get(ApiPaths.appPath("/memberships/plans"), responseType: MembershipsPlansListResult.self)
    }

    /// Memberships Points Balance Retrieve
    public func membershipsPointsBalanceRetrieve() async throws -> MembershipsPointsBalanceRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/memberships/points/balance"), responseType: MembershipsPointsBalanceRetrieveResult.self)
    }

    /// Memberships Points Daily Rewards Create
    public func membershipsPointsDailyRewardsCreate(body: MembershipsPointsDailyRewardsCreateRequest? = nil) async throws -> MembershipsPointsDailyRewardsCreateResult? {
        return try await client.post(ApiPaths.appPath("/memberships/points/daily_rewards"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: MembershipsPointsDailyRewardsCreateResult.self)
    }

    /// Memberships Points Daily Rewards Status Retrieve
    public func membershipsPointsDailyRewardsStatusRetrieve() async throws -> MembershipsPointsDailyRewardsStatusRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/memberships/points/daily_rewards/status"), responseType: MembershipsPointsDailyRewardsStatusRetrieveResult.self)
    }

    /// Memberships Points History List
    public func membershipsPointsHistoryList(page: Int? = nil, pageSize: Int? = nil, cursor: String? = nil) async throws -> MembershipsPointsHistoryListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "cursor", value: cursor, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/memberships/points/history"), query), responseType: MembershipsPointsHistoryListResult.self)
    }

    /// Memberships Privileges Speed Ups Create
    public func membershipsPrivilegesSpeedUpsCreate(body: MembershipsPrivilegesSpeedUpsCreateRequest? = nil) async throws -> MembershipsPrivilegesSpeedUpsCreateResult? {
        return try await client.post(ApiPaths.appPath("/memberships/privileges/speed_ups"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: MembershipsPrivilegesSpeedUpsCreateResult.self)
    }

    /// Memberships Privileges Usage Retrieve
    public func membershipsPrivilegesUsageRetrieve() async throws -> MembershipsPrivilegesUsageRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/memberships/privileges/usage"), responseType: MembershipsPrivilegesUsageRetrieveResult.self)
    }

    /// Memberships Purchases Create
    public func membershipsPurchasesCreate(body: CommerceMembershipPurchaseRequest, idempotencyKey: String) async throws -> MembershipsPurchasesCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/memberships/purchases"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: MembershipsPurchasesCreateResult.self)
    }

    /// Memberships Purchases Renew
    public func membershipsPurchasesRenew(body: CommerceMembershipPurchaseRequest, idempotencyKey: String) async throws -> MembershipsPurchasesRenewResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/memberships/purchases/renew"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: MembershipsPurchasesRenewResult.self)
    }

    /// Memberships Purchases Upgrade
    public func membershipsPurchasesUpgrade(body: CommerceMembershipPurchaseRequest, idempotencyKey: String) async throws -> MembershipsPurchasesUpgradeResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/memberships/purchases/upgrade"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: MembershipsPurchasesUpgradeResult.self)
    }

    /// Orders List
    public func ordersList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> OrdersListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/orders"), query), responseType: OrdersListResult.self)
    }

    /// Orders Retrieve
    public func ordersRetrieve(orderId: String) async throws -> OrdersRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/orders/\(serializePathParameter(orderId, PathParameterSpec(name: "orderId", style: "simple", explode: false)))"), responseType: OrdersRetrieveResult.self)
    }

    /// Orders Cancellations Create
    public func ordersCancellationsCreate(orderId: String, body: CommerceStandardCommandRequest, idempotencyKey: String) async throws -> OrdersCancellationsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/orders/\(serializePathParameter(orderId, PathParameterSpec(name: "orderId", style: "simple", explode: false)))/cancellations"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: OrdersCancellationsCreateResult.self)
    }

    /// Orders Events List
    public func ordersEventsList(orderId: String, page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> OrdersEventsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/orders/\(serializePathParameter(orderId, PathParameterSpec(name: "orderId", style: "simple", explode: false)))/events"), query), responseType: OrdersEventsListResult.self)
    }

    /// Payments Attempts Retrieve
    public func paymentsAttemptsRetrieve(paymentAttemptId: String) async throws -> PaymentsAttemptsRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/payments/attempts/\(serializePathParameter(paymentAttemptId, PathParameterSpec(name: "paymentAttemptId", style: "simple", explode: false)))"), responseType: PaymentsAttemptsRetrieveResult.self)
    }

    /// Payments Intents Create
    public func paymentsIntentsCreate(body: CommercePaymentIntentCreateRequest, idempotencyKey: String) async throws -> PaymentsIntentsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/payments/intents"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: PaymentsIntentsCreateResult.self)
    }

    /// Payments Intents Retrieve
    public func paymentsIntentsRetrieve(paymentIntentId: String) async throws -> PaymentsIntentsRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/payments/intents/\(serializePathParameter(paymentIntentId, PathParameterSpec(name: "paymentIntentId", style: "simple", explode: false)))"), responseType: PaymentsIntentsRetrieveResult.self)
    }

    /// Payments Intents Attempts Create
    public func paymentsIntentsAttemptsCreate(paymentIntentId: String, body: CommercePaymentAttemptCreateRequest, idempotencyKey: String) async throws -> PaymentsIntentsAttemptsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/payments/intents/\(serializePathParameter(paymentIntentId, PathParameterSpec(name: "paymentIntentId", style: "simple", explode: false)))/attempts"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: PaymentsIntentsAttemptsCreateResult.self)
    }

    /// Payments Methods List
    public func paymentsMethodsList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> PaymentsMethodsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/payments/methods"), query), responseType: PaymentsMethodsListResult.self)
    }

    /// Recharges Orders Create
    public func rechargesOrdersCreate(body: CommerceStandardCommandRequest, idempotencyKey: String) async throws -> RechargesOrdersCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/recharges/orders"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: RechargesOrdersCreateResult.self)
    }

    /// Recharges Orders Retrieve
    public func rechargesOrdersRetrieve(orderId: String) async throws -> RechargesOrdersRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/recharges/orders/\(serializePathParameter(orderId, PathParameterSpec(name: "orderId", style: "simple", explode: false)))"), responseType: RechargesOrdersRetrieveResult.self)
    }

    /// Recharges Packages List
    public func rechargesPackagesList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> RechargesPackagesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/recharges/packages"), query), responseType: RechargesPackagesListResult.self)
    }

    /// Refunds List
    public func refundsList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> RefundsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/refunds"), query), responseType: RefundsListResult.self)
    }

    /// Refunds Create
    public func refundsCreate(body: CommerceStandardCommandRequest, idempotencyKey: String) async throws -> RefundsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/refunds"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: RefundsCreateResult.self)
    }

    /// Refunds Retrieve
    public func refundsRetrieve(refundId: String) async throws -> RefundsRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/refunds/\(serializePathParameter(refundId, PathParameterSpec(name: "refundId", style: "simple", explode: false)))"), responseType: RefundsRetrieveResult.self)
    }

    /// Shipments Retrieve
    public func shipmentsRetrieve(shipmentId: String) async throws -> ShipmentsRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/shipments/\(serializePathParameter(shipmentId, PathParameterSpec(name: "shipmentId", style: "simple", explode: false)))"), responseType: ShipmentsRetrieveResult.self)
    }

    /// Wallet Accounts List
    public func walletAccountsList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> WalletAccountsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/wallet/accounts"), query), responseType: WalletAccountsListResult.self)
    }

    /// Wallet Exchange Rate Retrieve
    public func walletExchangeRateRetrieve() async throws -> WalletExchangeRateRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/wallet/exchange_rate"), responseType: WalletExchangeRateRetrieveResult.self)
    }

    /// Wallet Ledger Entries List
    public func walletLedgerEntriesList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> WalletLedgerEntriesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/wallet/ledger_entries"), query), responseType: WalletLedgerEntriesListResult.self)
    }

    /// Wallet Overview Retrieve
    public func walletOverviewRetrieve() async throws -> WalletOverviewRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/wallet/overview"), responseType: WalletOverviewRetrieveResult.self)
    }

    /// Wallet Points Exchange Rules List
    public func walletPointsExchangeRulesList(sourceAssetType: String? = nil, targetAssetType: String? = nil) async throws -> WalletPointsExchangeRulesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "source_asset_type", value: sourceAssetType, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "target_asset_type", value: targetAssetType, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/wallet/points/exchanges/rules"), query), responseType: WalletPointsExchangeRulesListResult.self)
    }

    /// Wallet Tokens Retrieve
    public func walletTokensRetrieve() async throws -> WalletTokensRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/wallet/tokens"), responseType: WalletTokensRetrieveResult.self)
    }

    private struct PathParameterSpec {
        let name: String
        let style: String
        let explode: Bool
    }

    private func serializePathParameter(_ value: Any?, _ spec: PathParameterSpec) -> String {
        guard let value else { return "" }
        let style = spec.style.isEmpty ? "simple" : spec.style
        if let array = value as? [Any] {
            return serializePathArray(spec.name, array, style, spec.explode)
        }
        if let object = value as? [String: Any] {
            return serializePathObject(spec.name, object, style, spec.explode)
        }
        return pathPrimitivePrefix(spec.name, style) + pathEncode(String(describing: value))
    }

    private func serializePathArray(_ name: String, _ values: [Any], _ style: String, _ explode: Bool) -> String {
        let serialized = values.map { pathEncode(String(describing: $0)) }
        if serialized.isEmpty { return pathPrefix(name, style) }
        if style == "matrix" {
            if explode {
                return serialized.map { ";\(name)=\($0)" }.joined()
            }
            return ";\(name)=" + serialized.joined(separator: ",")
        }
        let separator = explode ? "." : ","
        return pathPrefix(name, style) + serialized.joined(separator: separator)
    }

    private func serializePathObject(_ name: String, _ values: [String: Any], _ style: String, _ explode: Bool) -> String {
        var entries: [String] = []
        var exploded: [String] = []
        for (key, value) in values {
            let escapedKey = pathEncode(key)
            let escapedValue = pathEncode(String(describing: value))
            if explode {
                if style == "matrix" {
                    exploded.append(";\(escapedKey)=\(escapedValue)")
                } else {
                    exploded.append("\(escapedKey)=\(escapedValue)")
                }
            } else {
                entries.append(escapedKey)
                entries.append(escapedValue)
            }
        }
        if style == "matrix" {
            if explode {
                return exploded.joined()
            }
            return ";\(name)=" + entries.joined(separator: ",")
        }
        if explode {
            let separator = style == "label" ? "." : ","
            return pathPrefix(name, style) + exploded.joined(separator: separator)
        }
        return pathPrefix(name, style) + entries.joined(separator: ",")
    }

    private func pathPrefix(_ name: String, _ style: String) -> String {
        if style == "label" { return "." }
        if style == "matrix" { return ";\(name)" }
        return ""
    }

    private func pathPrimitivePrefix(_ name: String, _ style: String) -> String {
        style == "matrix" ? ";\(name)=" : pathPrefix(name, style)
    }

    private func pathEncode(_ value: String) -> String {
        value.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? value
    }

    private struct QueryParameterSpec {
        let name: String
        let value: Any?
        let style: String
        let explode: Bool
        let allowReserved: Bool
        let contentType: String?
    }

    private func buildQueryString(_ parameters: [QueryParameterSpec]) -> String {
        var pairs: [String] = []
        for parameter in parameters {
            appendSerializedParameter(&pairs, parameter)
        }
        return pairs.joined(separator: "&")
    }

    private func appendSerializedParameter(_ pairs: inout [String], _ parameter: QueryParameterSpec) {
        guard let value = parameter.value else { return }
        if let contentType = parameter.contentType, !contentType.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            let data = (try? JSONSerialization.data(withJSONObject: value, options: [])) ?? Data(String(describing: value).utf8)
            let json = String(data: data, encoding: .utf8) ?? String(describing: value)
            pairs.append("\(urlEncode(parameter.name))=\(encodeQueryValue(json, allowReserved: parameter.allowReserved))")
            return
        }

        let style = parameter.style.isEmpty ? "form" : parameter.style
        if style == "deepObject", let object = value as? [String: Any] {
            appendDeepObjectParameter(&pairs, name: parameter.name, values: object, allowReserved: parameter.allowReserved)
        } else if let array = value as? [Any] {
            appendArrayParameter(&pairs, name: parameter.name, values: array, style: style, explode: parameter.explode, allowReserved: parameter.allowReserved)
        } else if let object = value as? [String: Any] {
            appendObjectParameter(&pairs, name: parameter.name, values: object, style: style, explode: parameter.explode, allowReserved: parameter.allowReserved)
        } else {
            pairs.append("\(urlEncode(parameter.name))=\(encodeQueryValue(String(describing: value), allowReserved: parameter.allowReserved))")
        }
    }

    private func appendArrayParameter(
        _ pairs: inout [String],
        name: String,
        values: [Any],
        style: String,
        explode: Bool,
        allowReserved: Bool
    ) {
        let serialized = values.map { String(describing: $0) }
        guard !serialized.isEmpty else { return }
        if style == "form" && explode {
            for item in serialized {
                pairs.append("\(urlEncode(name))=\(encodeQueryValue(item, allowReserved: allowReserved))")
            }
            return
        }
        pairs.append("\(urlEncode(name))=\(encodeQueryValue(serialized.joined(separator: ","), allowReserved: allowReserved))")
    }

    private func appendObjectParameter(
        _ pairs: inout [String],
        name: String,
        values: [String: Any],
        style: String,
        explode: Bool,
        allowReserved: Bool
    ) {
        var serialized: [String] = []
        for (key, value) in values {
            if style == "form" && explode {
                pairs.append("\(urlEncode(key))=\(encodeQueryValue(String(describing: value), allowReserved: allowReserved))")
            } else {
                serialized.append(key)
                serialized.append(String(describing: value))
            }
        }
        if !serialized.isEmpty {
            pairs.append("\(urlEncode(name))=\(encodeQueryValue(serialized.joined(separator: ","), allowReserved: allowReserved))")
        }
    }

    private func appendDeepObjectParameter(_ pairs: inout [String], name: String, values: [String: Any], allowReserved: Bool) {
        for (key, value) in values {
            pairs.append("\(urlEncode("\(name)[\(key)]"))=\(encodeQueryValue(String(describing: value), allowReserved: allowReserved))")
        }
    }

    private func encodeQueryValue(_ value: String, allowReserved: Bool) -> String {
        var encoded = urlEncode(value)
        if !allowReserved { return encoded }
        [
            "%3A": ":", "%2F": "/", "%3F": "?", "%23": "#",
            "%5B": "[", "%5D": "]", "%40": "@", "%21": "!",
            "%24": "$", "%26": "&", "%27": "'", "%28": "(",
            "%29": ")", "%2A": "*", "%2B": "+", "%2C": ",",
            "%3B": ";", "%3D": "=",
        ].forEach { encoded = encoded.replacingOccurrences(of: $0.key, with: $0.value) }
        return encoded
    }

    private func urlEncode(_ value: String) -> String {
        value.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? value
    }

    private struct HeaderParameterSpec {
        let value: Any?
        let style: String
        let explode: Bool
        let contentType: String?
    }

    private func buildRequestHeaders(_ headers: [String: HeaderParameterSpec], _ cookies: [String: HeaderParameterSpec]) -> [String: String]? {
        var requestHeaders: [String: String] = [:]
        for (name, parameter) in headers {
            if let serialized = serializeParameterValue(parameter) {
                requestHeaders[name] = serialized
            }
        }

        if let cookieHeader = buildCookieHeader(cookies), !cookieHeader.isEmpty {
            requestHeaders["Cookie"] = requestHeaders["Cookie"].map { "\($0); \(cookieHeader)" } ?? cookieHeader
        }

        return requestHeaders.isEmpty ? nil : requestHeaders
    }

    private func buildCookieHeader(_ cookies: [String: HeaderParameterSpec]) -> String? {
        let pairs = cookies.compactMap { name, parameter -> String? in
            guard let serialized = serializeParameterValue(parameter) else { return nil }
            return "\(urlEncode(name))=\(urlEncode(serialized))"
        }
        return pairs.isEmpty ? nil : pairs.joined(separator: "; ")
    }

    private func serializeParameterValue(_ parameter: HeaderParameterSpec?) -> String? {
        guard let parameter, let value = parameter.value else { return nil }
        if let contentType = parameter.contentType, !contentType.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            if JSONSerialization.isValidJSONObject(value),
               let data = try? JSONSerialization.data(withJSONObject: value, options: []),
               let json = String(data: data, encoding: .utf8) {
                return json
            }
            return String(describing: value)
        }
        if let array = value as? [Any?] {
            return array.compactMap { $0.map { String(describing: $0) } }.joined(separator: ",")
        }
        if let object = value as? [String: Any] {
            var values: [String] = []
            for (key, item) in object {
                if parameter.explode {
                    values.append("\(key)=\(item)")
                } else {
                    values.append(key)
                    values.append(String(describing: item))
                }
            }
            return values.joined(separator: ",")
        }
        if let date = value as? Date {
            return ISO8601DateFormatter().string(from: date)
        }
        return String(describing: value)
    }

    private func urlEncode(_ value: String) -> String {
        value.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? value
    }
}
