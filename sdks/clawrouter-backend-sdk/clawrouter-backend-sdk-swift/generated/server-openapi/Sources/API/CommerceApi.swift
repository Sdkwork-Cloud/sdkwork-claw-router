import Foundation

public class CommerceApi {
    private let client: HttpClient

    public init(client: HttpClient) {
        self.client = client
    }

    /// Audit Commerce Events List
    public func auditCommerceEventsList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> AuditCommerceEventsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/audit/commerce_events"), query), responseType: AuditCommerceEventsListResult.self)
    }

    /// List product attributes
    public func catalogAttributesList(scope: String? = nil, status: String? = nil, page: Int? = nil, pageSize: Int? = nil) async throws -> CatalogAttributesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "scope", value: scope, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/catalog/attributes"), query), responseType: CatalogAttributesListResult.self)
    }

    /// Create product attribute
    public func catalogAttributesCreate(body: CommerceProductAttributeMutationRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> CatalogAttributesCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/catalog/attributes"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CatalogAttributesCreateResult.self)
    }

    /// List product categories for admin management
    public func catalogCategoriesList(parentId: String? = nil, status: String? = nil, page: Int? = nil, pageSize: Int? = nil) async throws -> CatalogCategoriesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "parent_id", value: parentId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/catalog/categories"), query), responseType: CatalogCategoriesListResult.self)
    }

    /// Create product category
    public func catalogCategoriesCreate(body: CommerceProductCategoryMutationRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> CatalogCategoriesCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/catalog/categories"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CatalogCategoriesCreateResult.self)
    }

    /// Delete product category
    public func catalogCategoriesDelete(categoryId: String, xRequestId: String? = nil) async throws -> CatalogCategoriesDeleteResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.delete(ApiPaths.backendPath("/catalog/categories/\(serializePathParameter(categoryId, PathParameterSpec(name: "categoryId", style: "simple", explode: false)))"), params: nil, headers: requestHeaders, responseType: CatalogCategoriesDeleteResult.self)
    }

    /// Update product category
    public func catalogCategoriesUpdate(categoryId: String, body: CommerceProductCategoryMutationRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> CatalogCategoriesUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.patch(ApiPaths.backendPath("/catalog/categories/\(serializePathParameter(categoryId, PathParameterSpec(name: "categoryId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CatalogCategoriesUpdateResult.self)
    }

    /// List product price lists
    public func catalogPriceLists(currencyCode: String? = nil, marketCode: String? = nil, status: String? = nil, page: Int? = nil, pageSize: Int? = nil) async throws -> CatalogPriceListsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "currency_code", value: currencyCode, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "market_code", value: marketCode, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/catalog/price_lists"), query), responseType: CatalogPriceListsListResult.self)
    }

    /// Create product price list
    public func catalogPriceListsCreate(body: CommercePriceListMutationRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> CatalogPriceListsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/catalog/price_lists"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CatalogPriceListsCreateResult.self)
    }

    /// List products for admin management
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
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/catalog/products"), query), responseType: CatalogProductsListResult.self)
    }

    /// Create product SPU
    public func catalogProductsCreate(body: CommerceProductSpuMutationRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> CatalogProductsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/catalog/products"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CatalogProductsCreateResult.self)
    }

    /// Update product SPU
    public func catalogProductsUpdate(productId: String, body: CommerceProductSpuMutationRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> CatalogProductsUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.patch(ApiPaths.backendPath("/catalog/products/\(serializePathParameter(productId, PathParameterSpec(name: "productId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CatalogProductsUpdateResult.self)
    }

    /// List product SKUs for admin management
    public func catalogSkusList(productId: String? = nil, fulfillmentType: String? = nil, status: String? = nil, page: Int? = nil, pageSize: Int? = nil) async throws -> CatalogSkusListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "product_id", value: productId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "fulfillment_type", value: fulfillmentType, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/catalog/skus"), query), responseType: CatalogSkusListResult.self)
    }

    /// Create product SKU
    public func catalogSkusCreate(body: CommerceProductSkuMutationRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> CatalogSkusCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/catalog/skus"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CatalogSkusCreateResult.self)
    }

    /// Update product SKU
    public func catalogSkusUpdate(skuId: String, body: CommerceProductSkuMutationRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> CatalogSkusUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.patch(ApiPaths.backendPath("/catalog/skus/\(serializePathParameter(skuId, PathParameterSpec(name: "skuId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CatalogSkusUpdateResult.self)
    }

    /// Commerce Reports Order Revenue List
    public func reportsOrderRevenueList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> CommerceReportsOrderRevenueListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/commerce_reports/order_revenue"), query), responseType: CommerceReportsOrderRevenueListResult.self)
    }

    /// Commerce Reports Payment Reconciliation Retrieve
    public func reportsPaymentReconciliationRetrieve() async throws -> CommerceReportsPaymentReconciliationRetrieveResult? {
        return try await client.get(ApiPaths.backendPath("/commerce_reports/payment_reconciliation"), responseType: CommerceReportsPaymentReconciliationRetrieveResult.self)
    }

    /// Commerce Reports Refunds List
    public func reportsRefundsList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> CommerceReportsRefundsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/commerce_reports/refunds"), query), responseType: CommerceReportsRefundsListResult.self)
    }

    /// Coupons Campaigns List
    public func couponsCampaignsList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> CouponsCampaignsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/coupons/campaigns"), query), responseType: CouponsCampaignsListResult.self)
    }

    /// Coupons Codes List
    public func couponsCodesList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> CouponsCodesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/coupons/codes"), query), responseType: CouponsCodesListResult.self)
    }

    /// Coupons Redemptions List
    public func couponsRedemptionsList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> CouponsRedemptionsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/coupons/redemptions"), query), responseType: CouponsRedemptionsListResult.self)
    }

    /// Coupons Templates List
    public func couponsTemplatesList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> CouponsTemplatesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/coupons/templates"), query), responseType: CouponsTemplatesListResult.self)
    }

    /// Fulfillments List
    public func fulfillmentsList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> FulfillmentsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/fulfillments"), query), responseType: FulfillmentsListResult.self)
    }

    /// List inventory ledger entries
    public func inventoryLedgerEntriesList(skuId: String? = nil, warehouseId: String? = nil, sourceType: String? = nil, sourceId: String? = nil, page: Int? = nil, pageSize: Int? = nil) async throws -> InventoryLedgerEntriesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "sku_id", value: skuId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "warehouse_id", value: warehouseId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "source_type", value: sourceType, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "source_id", value: sourceId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/inventory/ledger_entries"), query), responseType: InventoryLedgerEntriesListResult.self)
    }

    /// List inventory reservations
    public func inventoryReservationsList(skuId: String? = nil, orderId: String? = nil, checkoutSessionId: String? = nil, status: String? = nil, page: Int? = nil, pageSize: Int? = nil) async throws -> InventoryReservationsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "sku_id", value: skuId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "order_id", value: orderId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "checkout_session_id", value: checkoutSessionId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/inventory/reservations"), query), responseType: InventoryReservationsListResult.self)
    }

    /// List inventory stock records
    public func inventoryStocksList(skuId: String? = nil, warehouseId: String? = nil, status: String? = nil, page: Int? = nil, pageSize: Int? = nil) async throws -> InventoryStocksListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "sku_id", value: skuId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "warehouse_id", value: warehouseId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/inventory/stocks"), query), responseType: InventoryStocksListResult.self)
    }

    /// Update inventory stock
    public func inventoryStocksUpdate(stockId: String, body: CommerceInventoryStockUpdateRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> InventoryStocksUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.patch(ApiPaths.backendPath("/inventory/stocks/\(serializePathParameter(stockId, PathParameterSpec(name: "stockId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: InventoryStocksUpdateResult.self)
    }

    /// Invoices List
    public func invoicesList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> InvoicesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/invoices"), query), responseType: InvoicesListResult.self)
    }

    /// Invoices Titles List
    public func invoicesTitlesList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> InvoicesTitlesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/invoices/titles"), query), responseType: InvoicesTitlesListResult.self)
    }

    /// Invoices Retrieve
    public func invoicesRetrieve(invoiceId: String) async throws -> InvoicesRetrieveResult? {
        return try await client.get(ApiPaths.backendPath("/invoices/\(serializePathParameter(invoiceId, PathParameterSpec(name: "invoiceId", style: "simple", explode: false)))"), responseType: InvoicesRetrieveResult.self)
    }

    /// Memberships Entitlements List
    public func membershipsEntitlementsList(page: Int? = nil, pageSize: Int? = nil, planId: String? = nil, membershipId: String? = nil, status: String? = nil) async throws -> MembershipsEntitlementsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "plan_id", value: planId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "membership_id", value: membershipId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/memberships/entitlements"), query), responseType: MembershipsEntitlementsListResult.self)
    }

    /// Memberships Members List
    public func membershipsMembersList(page: Int? = nil, pageSize: Int? = nil, cursor: String? = nil, userId: String? = nil, planId: String? = nil, status: String? = nil) async throws -> MembershipsMembersListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "cursor", value: cursor, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "user_id", value: userId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "plan_id", value: planId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/memberships/members"), query), responseType: MembershipsMembersListResult.self)
    }

    /// Memberships Members Status Update
    public func membershipsMembersStatusUpdate(membershipId: String, body: CommerceMembershipMemberStatusRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> MembershipsMembersStatusUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.patch(ApiPaths.backendPath("/memberships/members/\(serializePathParameter(membershipId, PathParameterSpec(name: "membershipId", style: "simple", explode: false)))/status"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: MembershipsMembersStatusUpdateResult.self)
    }

    /// Memberships Package Groups List
    public func membershipsPackageGroupsList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> MembershipsPackageGroupsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/memberships/package_groups"), query), responseType: MembershipsPackageGroupsListResult.self)
    }

    /// Memberships Package Groups Create
    public func membershipsPackageGroupsCreate(body: CommerceMembershipPackageGroupMutationRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> MembershipsPackageGroupsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/memberships/package_groups"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: MembershipsPackageGroupsCreateResult.self)
    }

    /// Memberships Package Groups Delete
    public func membershipsPackageGroupsDelete(packageGroupId: String, xRequestId: String? = nil) async throws -> MembershipsPackageGroupsDeleteResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.delete(ApiPaths.backendPath("/memberships/package_groups/\(serializePathParameter(packageGroupId, PathParameterSpec(name: "packageGroupId", style: "simple", explode: false)))"), params: nil, headers: requestHeaders, responseType: MembershipsPackageGroupsDeleteResult.self)
    }

    /// Memberships Package Groups Update
    public func membershipsPackageGroupsUpdate(packageGroupId: String, body: CommerceMembershipPackageGroupMutationRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> MembershipsPackageGroupsUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.put(ApiPaths.backendPath("/memberships/package_groups/\(serializePathParameter(packageGroupId, PathParameterSpec(name: "packageGroupId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: MembershipsPackageGroupsUpdateResult.self)
    }

    /// Memberships Packages List
    public func membershipsPackagesList(page: Int? = nil, pageSize: Int? = nil, packageGroupId: String? = nil, planId: String? = nil, status: String? = nil) async throws -> MembershipsPackagesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "package_group_id", value: packageGroupId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "plan_id", value: planId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/memberships/packages"), query), responseType: MembershipsPackagesListResult.self)
    }

    /// Memberships Packages Create
    public func membershipsPackagesCreate(body: CommerceMembershipPackageMutationRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> MembershipsPackagesCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/memberships/packages"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: MembershipsPackagesCreateResult.self)
    }

    /// Memberships Packages Delete
    public func membershipsPackagesDelete(packageId: String, xRequestId: String? = nil) async throws -> MembershipsPackagesDeleteResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.delete(ApiPaths.backendPath("/memberships/packages/\(serializePathParameter(packageId, PathParameterSpec(name: "packageId", style: "simple", explode: false)))"), params: nil, headers: requestHeaders, responseType: MembershipsPackagesDeleteResult.self)
    }

    /// Memberships Packages Update
    public func membershipsPackagesUpdate(packageId: String, body: CommerceMembershipPackageMutationRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> MembershipsPackagesUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.put(ApiPaths.backendPath("/memberships/packages/\(serializePathParameter(packageId, PathParameterSpec(name: "packageId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: MembershipsPackagesUpdateResult.self)
    }

    /// Memberships Plans List
    public func membershipsPlansList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> MembershipsPlansListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/memberships/plans"), query), responseType: MembershipsPlansListResult.self)
    }

    /// Memberships Plans Create
    public func membershipsPlansCreate(body: CommerceMembershipPlanMutationRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> MembershipsPlansCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/memberships/plans"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: MembershipsPlansCreateResult.self)
    }

    /// Memberships Plans Delete
    public func membershipsPlansDelete(planId: String, xRequestId: String? = nil) async throws -> MembershipsPlansDeleteResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.delete(ApiPaths.backendPath("/memberships/plans/\(serializePathParameter(planId, PathParameterSpec(name: "planId", style: "simple", explode: false)))"), params: nil, headers: requestHeaders, responseType: MembershipsPlansDeleteResult.self)
    }

    /// Memberships Plans Update
    public func membershipsPlansUpdate(planId: String, body: CommerceMembershipPlanMutationRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> MembershipsPlansUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.put(ApiPaths.backendPath("/memberships/plans/\(serializePathParameter(planId, PathParameterSpec(name: "planId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: MembershipsPlansUpdateResult.self)
    }

    /// Orders List
    public func ordersList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> OrdersListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/orders"), query), responseType: OrdersListResult.self)
    }

    /// Orders Retrieve
    public func ordersRetrieve(orderId: String) async throws -> OrdersRetrieveResult? {
        return try await client.get(ApiPaths.backendPath("/orders/\(serializePathParameter(orderId, PathParameterSpec(name: "orderId", style: "simple", explode: false)))"), responseType: OrdersRetrieveResult.self)
    }

    /// Orders Events List
    public func ordersEventsList(orderId: String, page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> OrdersEventsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/orders/\(serializePathParameter(orderId, PathParameterSpec(name: "orderId", style: "simple", explode: false)))/events"), query), responseType: OrdersEventsListResult.self)
    }

    /// Payments Attempts List
    public func paymentsAttemptsList(intentId: String? = nil, providerCode: String? = nil, page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> PaymentsAttemptsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "intent_id", value: intentId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "provider_code", value: providerCode, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/attempts"), query), responseType: PaymentsAttemptsListResult.self)
    }

    /// Payments Channels List
    public func paymentsChannelsList(providerAccountId: String? = nil, methodCode: String? = nil, page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> PaymentsChannelsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "provider_account_id", value: providerAccountId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "method_code", value: methodCode, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/channels"), query), responseType: PaymentsChannelsListResult.self)
    }

    /// Payments Intents List
    public func paymentsIntentsList(orderId: String? = nil, providerCode: String? = nil, page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> PaymentsIntentsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "order_id", value: orderId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "provider_code", value: providerCode, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/intents"), query), responseType: PaymentsIntentsListResult.self)
    }

    /// Payments Methods List
    public func paymentsMethodsList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> PaymentsMethodsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/methods"), query), responseType: PaymentsMethodsListResult.self)
    }

    /// Payments Provider Accounts List
    public func paymentsProviderAccountsList(providerCode: String? = nil, page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> PaymentsProviderAccountsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "provider_code", value: providerCode, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/provider_accounts"), query), responseType: PaymentsProviderAccountsListResult.self)
    }

    /// Payments Provider Accounts Create
    public func paymentsProviderAccountsCreate(body: CommercePaymentProviderAccountMutationRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> PaymentsProviderAccountsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/payments/provider_accounts"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: PaymentsProviderAccountsCreateResult.self)
    }

    /// Payments Providers List
    public func paymentsProvidersList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> PaymentsProvidersListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/providers"), query), responseType: PaymentsProvidersListResult.self)
    }

    /// Payments Reconciliation Runs List
    public func paymentsReconciliationRunsList(providerCode: String? = nil, businessDate: String? = nil, page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> PaymentsReconciliationRunsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "provider_code", value: providerCode, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "business_date", value: businessDate, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/reconciliation_runs"), query), responseType: PaymentsReconciliationRunsListResult.self)
    }

    /// Payments Route Rules List
    public func paymentsRouteRulesList(methodCode: String? = nil, countryCode: String? = nil, currencyCode: String? = nil, page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> PaymentsRouteRulesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "method_code", value: methodCode, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "country_code", value: countryCode, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "currency_code", value: currencyCode, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/route_rules"), query), responseType: PaymentsRouteRulesListResult.self)
    }

    /// Payments Webhook Events List
    public func paymentsWebhookEventsList(providerCode: String? = nil, page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> PaymentsWebhookEventsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "provider_code", value: providerCode, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/webhook_events"), query), responseType: PaymentsWebhookEventsListResult.self)
    }

    /// Recharges Orders List
    public func rechargesOrdersList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> RechargesOrdersListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/recharges/orders"), query), responseType: RechargesOrdersListResult.self)
    }

    /// Recharges Packages List
    public func rechargesPackagesList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> RechargesPackagesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/recharges/packages"), query), responseType: RechargesPackagesListResult.self)
    }

    /// Recharges Packages Create
    public func rechargesPackagesCreate(body: CommerceRechargePackageMutationRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> RechargesPackagesCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/recharges/packages"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: RechargesPackagesCreateResult.self)
    }

    /// Recharges Packages Delete
    public func rechargesPackagesDelete(packageId: String, xRequestId: String? = nil) async throws -> RechargesPackagesDeleteResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.delete(ApiPaths.backendPath("/recharges/packages/\(serializePathParameter(packageId, PathParameterSpec(name: "packageId", style: "simple", explode: false)))"), params: nil, headers: requestHeaders, responseType: RechargesPackagesDeleteResult.self)
    }

    /// Recharges Packages Update
    public func rechargesPackagesUpdate(packageId: String, body: CommerceRechargePackageMutationRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> RechargesPackagesUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.patch(ApiPaths.backendPath("/recharges/packages/\(serializePathParameter(packageId, PathParameterSpec(name: "packageId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: RechargesPackagesUpdateResult.self)
    }

    /// Refunds List
    public func refundsList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> RefundsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/refunds"), query), responseType: RefundsListResult.self)
    }

    /// Refunds Retrieve
    public func refundsRetrieve(refundId: String) async throws -> RefundsRetrieveResult? {
        return try await client.get(ApiPaths.backendPath("/refunds/\(serializePathParameter(refundId, PathParameterSpec(name: "refundId", style: "simple", explode: false)))"), responseType: RefundsRetrieveResult.self)
    }

    /// Shipments List
    public func shipmentsList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> ShipmentsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/shipments"), query), responseType: ShipmentsListResult.self)
    }

    /// Shipments Tracking Events List
    public func shipmentsTrackingEventsList(shipmentId: String, page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> ShipmentsTrackingEventsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/shipments/\(serializePathParameter(shipmentId, PathParameterSpec(name: "shipmentId", style: "simple", explode: false)))/tracking_events"), query), responseType: ShipmentsTrackingEventsListResult.self)
    }

    /// Wallet Accounts List
    public func walletAccountsList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> WalletAccountsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/wallet/accounts"), query), responseType: WalletAccountsListResult.self)
    }

    /// Wallet Adjustments Create
    public func walletAdjustmentsCreate(body: CommerceStandardCommandRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> WalletAdjustmentsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/wallet/adjustments"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: WalletAdjustmentsCreateResult.self)
    }

    /// Wallet Exchange Rules List
    public func walletExchangeRulesList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> WalletExchangeRulesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/wallet/exchange_rules"), query), responseType: WalletExchangeRulesListResult.self)
    }

    /// Wallet Ledger Entries List
    public func walletLedgerEntriesList(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> WalletLedgerEntriesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/wallet/ledger_entries"), query), responseType: WalletLedgerEntriesListResult.self)
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
