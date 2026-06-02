import 'dart:convert';
import '../http/client.dart';
import '../models.dart';

import 'paths.dart';
import 'response_helpers.dart';


class CommerceApi {
  final HttpClient _client;

  CommerceApi(this._client);

  /// Audit Commerce Events List
  Future<AuditCommerceEventsListResult?> auditCommerceEventsList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/audit/commerce_events'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AuditCommerceEventsListResult.fromJson(map);
    })();
  }

  /// List product attributes
  Future<CatalogAttributesListResult?> catalogAttributesList([String? scope, String? status, int? page, int? pageSize]) async {
    final query = buildQueryString([
      QueryParameterSpec('scope', scope, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/catalog/attributes'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogAttributesListResult.fromJson(map);
    })();
  }

  /// Create product attribute
  Future<CatalogAttributesCreateResult?> catalogAttributesCreate(CommerceProductAttributeMutationRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/catalog/attributes'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogAttributesCreateResult.fromJson(map);
    })();
  }

  /// List product categories for admin management
  Future<CatalogCategoriesListResult?> catalogCategoriesList([String? parentId, String? status, int? page, int? pageSize]) async {
    final query = buildQueryString([
      QueryParameterSpec('parent_id', parentId, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/catalog/categories'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogCategoriesListResult.fromJson(map);
    })();
  }

  /// Create product category
  Future<CatalogCategoriesCreateResult?> catalogCategoriesCreate(CommerceProductCategoryMutationRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/catalog/categories'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogCategoriesCreateResult.fromJson(map);
    })();
  }

  /// Delete product category
  Future<CatalogCategoriesDeleteResult?> catalogCategoriesDelete(String categoryId) async {
    final response = await _client.delete(ApiPaths.backendPath('/catalog/categories/${serializePathParameter(categoryId, const PathParameterSpec('categoryId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogCategoriesDeleteResult.fromJson(map);
    })();
  }

  /// Update product category
  Future<CatalogCategoriesUpdateResult?> catalogCategoriesUpdate(String categoryId, CommerceProductCategoryMutationRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.backendPath('/catalog/categories/${serializePathParameter(categoryId, const PathParameterSpec('categoryId', 'simple', false))}'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogCategoriesUpdateResult.fromJson(map);
    })();
  }

  /// Initialize admin category seed datasets
  Future<CatalogCategorySeedsCreateResult?> catalogCategorySeedsCreate(CommerceCategorySeedInitializeRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/catalog/category_seeds/initialize'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogCategorySeedsCreateResult.fromJson(map);
    })();
  }

  /// List product price lists
  Future<CatalogPriceListsListResult?> catalogPriceLists([String? currencyCode, String? marketCode, String? status, int? page, int? pageSize]) async {
    final query = buildQueryString([
      QueryParameterSpec('currency_code', currencyCode, 'form', true, false, null),
      QueryParameterSpec('market_code', marketCode, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/catalog/price_lists'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogPriceListsListResult.fromJson(map);
    })();
  }

  /// Create product price list
  Future<CatalogPriceListsCreateResult?> catalogPriceListsCreate(CommercePriceListMutationRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/catalog/price_lists'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogPriceListsCreateResult.fromJson(map);
    })();
  }

  /// List products for admin management
  Future<CatalogProductsListResult?> catalogProductsList([String? q, String? categoryId, String? productType, String? status, int? page, int? pageSize, String? sort]) async {
    final query = buildQueryString([
      QueryParameterSpec('q', q, 'form', true, false, null),
      QueryParameterSpec('category_id', categoryId, 'form', true, false, null),
      QueryParameterSpec('product_type', productType, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('sort', sort, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/catalog/products'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogProductsListResult.fromJson(map);
    })();
  }

  /// Create product SPU
  Future<CatalogProductsCreateResult?> catalogProductsCreate(CommerceProductSpuMutationRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/catalog/products'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogProductsCreateResult.fromJson(map);
    })();
  }

  /// Delete product SPU
  Future<CatalogProductsDeleteResult?> catalogProductsDelete(String productId) async {
    final response = await _client.delete(ApiPaths.backendPath('/catalog/products/${serializePathParameter(productId, const PathParameterSpec('productId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogProductsDeleteResult.fromJson(map);
    })();
  }

  /// Update product SPU
  Future<CatalogProductsUpdateResult?> catalogProductsUpdate(String productId, CommerceProductSpuMutationRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.backendPath('/catalog/products/${serializePathParameter(productId, const PathParameterSpec('productId', 'simple', false))}'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogProductsUpdateResult.fromJson(map);
    })();
  }

  /// List product SKUs for admin management
  Future<CatalogSkusListResult?> catalogSkusList([String? productId, String? fulfillmentType, String? status, int? page, int? pageSize]) async {
    final query = buildQueryString([
      QueryParameterSpec('product_id', productId, 'form', true, false, null),
      QueryParameterSpec('fulfillment_type', fulfillmentType, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/catalog/skus'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogSkusListResult.fromJson(map);
    })();
  }

  /// Create product SKU
  Future<CatalogSkusCreateResult?> catalogSkusCreate(CommerceProductSkuMutationRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/catalog/skus'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogSkusCreateResult.fromJson(map);
    })();
  }

  /// Delete product SKU
  Future<CatalogSkusDeleteResult?> catalogSkusDelete(String skuId) async {
    final response = await _client.delete(ApiPaths.backendPath('/catalog/skus/${serializePathParameter(skuId, const PathParameterSpec('skuId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogSkusDeleteResult.fromJson(map);
    })();
  }

  /// Update product SKU
  Future<CatalogSkusUpdateResult?> catalogSkusUpdate(String skuId, CommerceProductSkuMutationRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.backendPath('/catalog/skus/${serializePathParameter(skuId, const PathParameterSpec('skuId', 'simple', false))}'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogSkusUpdateResult.fromJson(map);
    })();
  }

  /// Commerce Reports Order Revenue List
  Future<CommerceReportsOrderRevenueListResult?> reportsOrderRevenueList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/commerce_reports/order_revenue'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CommerceReportsOrderRevenueListResult.fromJson(map);
    })();
  }

  /// Commerce Reports Payment Reconciliation Retrieve
  Future<CommerceReportsPaymentReconciliationRetrieveResult?> reportsPaymentReconciliationRetrieve() async {
    final response = await _client.get(ApiPaths.backendPath('/commerce_reports/payment_reconciliation'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CommerceReportsPaymentReconciliationRetrieveResult.fromJson(map);
    })();
  }

  /// Commerce Reports Refunds List
  Future<CommerceReportsRefundsListResult?> reportsRefundsList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/commerce_reports/refunds'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CommerceReportsRefundsListResult.fromJson(map);
    })();
  }

  /// Fulfillments List
  Future<FulfillmentsListResult?> fulfillmentsList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/fulfillments'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FulfillmentsListResult.fromJson(map);
    })();
  }

  /// List inventory ledger entries
  Future<InventoryLedgerEntriesListResult?> inventoryLedgerEntriesList([String? skuId, String? warehouseId, String? sourceType, String? sourceId, int? page, int? pageSize]) async {
    final query = buildQueryString([
      QueryParameterSpec('sku_id', skuId, 'form', true, false, null),
      QueryParameterSpec('warehouse_id', warehouseId, 'form', true, false, null),
      QueryParameterSpec('source_type', sourceType, 'form', true, false, null),
      QueryParameterSpec('source_id', sourceId, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/inventory/ledger_entries'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : InventoryLedgerEntriesListResult.fromJson(map);
    })();
  }

  /// List inventory reservations
  Future<InventoryReservationsListResult?> inventoryReservationsList([String? skuId, String? orderId, String? checkoutSessionId, String? status, int? page, int? pageSize]) async {
    final query = buildQueryString([
      QueryParameterSpec('sku_id', skuId, 'form', true, false, null),
      QueryParameterSpec('order_id', orderId, 'form', true, false, null),
      QueryParameterSpec('checkout_session_id', checkoutSessionId, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/inventory/reservations'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : InventoryReservationsListResult.fromJson(map);
    })();
  }

  /// List inventory stock records
  Future<InventoryStocksListResult?> inventoryStocksList([String? skuId, String? warehouseId, String? status, int? page, int? pageSize]) async {
    final query = buildQueryString([
      QueryParameterSpec('sku_id', skuId, 'form', true, false, null),
      QueryParameterSpec('warehouse_id', warehouseId, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/inventory/stocks'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : InventoryStocksListResult.fromJson(map);
    })();
  }

  /// Update inventory stock
  Future<InventoryStocksUpdateResult?> inventoryStocksUpdate(String stockId, CommerceInventoryStockUpdateRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.backendPath('/inventory/stocks/${serializePathParameter(stockId, const PathParameterSpec('stockId', 'simple', false))}'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : InventoryStocksUpdateResult.fromJson(map);
    })();
  }

  /// Invoices List
  Future<InvoicesListResult?> invoicesList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/invoices'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : InvoicesListResult.fromJson(map);
    })();
  }

  /// Invoices Titles List
  Future<InvoicesTitlesListResult?> invoicesTitlesList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/invoices/titles'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : InvoicesTitlesListResult.fromJson(map);
    })();
  }

  /// Invoices Retrieve
  Future<InvoicesRetrieveResult?> invoicesRetrieve(String invoiceId) async {
    final response = await _client.get(ApiPaths.backendPath('/invoices/${serializePathParameter(invoiceId, const PathParameterSpec('invoiceId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : InvoicesRetrieveResult.fromJson(map);
    })();
  }

  /// Memberships Entitlements List
  Future<MembershipsEntitlementsListResult?> membershipsEntitlementsList([int? page, int? pageSize, String? planId, String? membershipId, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('plan_id', planId, 'form', true, false, null),
      QueryParameterSpec('membership_id', membershipId, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/memberships/entitlements'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsEntitlementsListResult.fromJson(map);
    })();
  }

  /// Memberships Members List
  Future<MembershipsMembersListResult?> membershipsMembersList([int? page, int? pageSize, String? cursor, String? userId, String? planId, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('cursor', cursor, 'form', true, false, null),
      QueryParameterSpec('user_id', userId, 'form', true, false, null),
      QueryParameterSpec('plan_id', planId, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/memberships/members'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsMembersListResult.fromJson(map);
    })();
  }

  /// Memberships Members Status Update
  Future<MembershipsMembersStatusUpdateResult?> membershipsMembersStatusUpdate(String membershipId, CommerceMembershipMemberStatusRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.backendPath('/memberships/members/${serializePathParameter(membershipId, const PathParameterSpec('membershipId', 'simple', false))}/status'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsMembersStatusUpdateResult.fromJson(map);
    })();
  }

  /// Memberships Package Groups List
  Future<MembershipsPackageGroupsListResult?> membershipsPackageGroupsList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/memberships/package_groups'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPackageGroupsListResult.fromJson(map);
    })();
  }

  /// Memberships Package Groups Create
  Future<MembershipsPackageGroupsCreateResult?> membershipsPackageGroupsCreate(CommerceMembershipPackageGroupMutationRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/memberships/package_groups'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPackageGroupsCreateResult.fromJson(map);
    })();
  }

  /// Memberships Package Groups Delete
  Future<MembershipsPackageGroupsDeleteResult?> membershipsPackageGroupsDelete(String packageGroupId) async {
    final response = await _client.delete(ApiPaths.backendPath('/memberships/package_groups/${serializePathParameter(packageGroupId, const PathParameterSpec('packageGroupId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPackageGroupsDeleteResult.fromJson(map);
    })();
  }

  /// Memberships Package Groups Update
  Future<MembershipsPackageGroupsUpdateResult?> membershipsPackageGroupsUpdate(String packageGroupId, CommerceMembershipPackageGroupMutationRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.put(ApiPaths.backendPath('/memberships/package_groups/${serializePathParameter(packageGroupId, const PathParameterSpec('packageGroupId', 'simple', false))}'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPackageGroupsUpdateResult.fromJson(map);
    })();
  }

  /// Memberships Packages List
  Future<MembershipsPackagesListResult?> membershipsPackagesList([int? page, int? pageSize, String? packageGroupId, String? planId, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('package_group_id', packageGroupId, 'form', true, false, null),
      QueryParameterSpec('plan_id', planId, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/memberships/packages'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPackagesListResult.fromJson(map);
    })();
  }

  /// Memberships Packages Create
  Future<MembershipsPackagesCreateResult?> membershipsPackagesCreate(CommerceMembershipPackageMutationRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/memberships/packages'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPackagesCreateResult.fromJson(map);
    })();
  }

  /// Memberships Packages Delete
  Future<MembershipsPackagesDeleteResult?> membershipsPackagesDelete(String packageId) async {
    final response = await _client.delete(ApiPaths.backendPath('/memberships/packages/${serializePathParameter(packageId, const PathParameterSpec('packageId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPackagesDeleteResult.fromJson(map);
    })();
  }

  /// Memberships Packages Update
  Future<MembershipsPackagesUpdateResult?> membershipsPackagesUpdate(String packageId, CommerceMembershipPackageMutationRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.put(ApiPaths.backendPath('/memberships/packages/${serializePathParameter(packageId, const PathParameterSpec('packageId', 'simple', false))}'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPackagesUpdateResult.fromJson(map);
    })();
  }

  /// Memberships Plans List
  Future<MembershipsPlansListResult?> membershipsPlansList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/memberships/plans'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPlansListResult.fromJson(map);
    })();
  }

  /// Memberships Plans Create
  Future<MembershipsPlansCreateResult?> membershipsPlansCreate(CommerceMembershipPlanMutationRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/memberships/plans'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPlansCreateResult.fromJson(map);
    })();
  }

  /// Memberships Plans Delete
  Future<MembershipsPlansDeleteResult?> membershipsPlansDelete(String planId) async {
    final response = await _client.delete(ApiPaths.backendPath('/memberships/plans/${serializePathParameter(planId, const PathParameterSpec('planId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPlansDeleteResult.fromJson(map);
    })();
  }

  /// Memberships Plans Update
  Future<MembershipsPlansUpdateResult?> membershipsPlansUpdate(String planId, CommerceMembershipPlanMutationRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.put(ApiPaths.backendPath('/memberships/plans/${serializePathParameter(planId, const PathParameterSpec('planId', 'simple', false))}'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPlansUpdateResult.fromJson(map);
    })();
  }

  /// Orders List
  Future<OrdersListResult?> ordersList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/orders'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : OrdersListResult.fromJson(map);
    })();
  }

  /// Orders Retrieve
  Future<OrdersRetrieveResult?> ordersRetrieve(String orderId) async {
    final response = await _client.get(ApiPaths.backendPath('/orders/${serializePathParameter(orderId, const PathParameterSpec('orderId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : OrdersRetrieveResult.fromJson(map);
    })();
  }

  /// Orders Events List
  Future<OrdersEventsListResult?> ordersEventsList(String orderId, [int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/orders/${serializePathParameter(orderId, const PathParameterSpec('orderId', 'simple', false))}/events'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : OrdersEventsListResult.fromJson(map);
    })();
  }

  /// Payments Attempts List
  Future<PaymentsAttemptsListResult?> paymentsAttemptsList([String? intentId, String? providerCode, int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('intent_id', intentId, 'form', true, false, null),
      QueryParameterSpec('provider_code', providerCode, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/payments/attempts'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsAttemptsListResult.fromJson(map);
    })();
  }

  /// Payments Channels List
  Future<PaymentsChannelsListResult?> paymentsChannelsList([String? providerAccountId, String? methodCode, int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('provider_account_id', providerAccountId, 'form', true, false, null),
      QueryParameterSpec('method_code', methodCode, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/payments/channels'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsChannelsListResult.fromJson(map);
    })();
  }

  /// Payments Intents List
  Future<PaymentsIntentsListResult?> paymentsIntentsList([String? orderId, String? providerCode, int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('order_id', orderId, 'form', true, false, null),
      QueryParameterSpec('provider_code', providerCode, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/payments/intents'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsIntentsListResult.fromJson(map);
    })();
  }

  /// Payments Methods List
  Future<PaymentsMethodsListResult?> paymentsMethodsList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/payments/methods'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsMethodsListResult.fromJson(map);
    })();
  }

  /// Payments Provider Accounts List
  Future<PaymentsProviderAccountsListResult?> paymentsProviderAccountsList([String? providerCode, int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('provider_code', providerCode, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/payments/provider_accounts'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsProviderAccountsListResult.fromJson(map);
    })();
  }

  /// Payments Provider Accounts Create
  Future<PaymentsProviderAccountsCreateResult?> paymentsProviderAccountsCreate(CommercePaymentProviderAccountMutationRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/payments/provider_accounts'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsProviderAccountsCreateResult.fromJson(map);
    })();
  }

  /// Payments Provider Accounts Delete
  Future<PaymentsProviderAccountsDeleteResult?> paymentsProviderAccountsDelete(String providerAccountId) async {
    final response = await _client.delete(ApiPaths.backendPath('/payments/provider_accounts/${serializePathParameter(providerAccountId, const PathParameterSpec('providerAccountId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsProviderAccountsDeleteResult.fromJson(map);
    })();
  }

  /// Payments Provider Accounts Update
  Future<PaymentsProviderAccountsUpdateResult?> paymentsProviderAccountsUpdate(String providerAccountId, CommercePaymentProviderAccountMutationRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.backendPath('/payments/provider_accounts/${serializePathParameter(providerAccountId, const PathParameterSpec('providerAccountId', 'simple', false))}'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsProviderAccountsUpdateResult.fromJson(map);
    })();
  }

  /// Payments Provider Accounts Status Update
  Future<PaymentsProviderAccountsStatusUpdateResult?> paymentsProviderAccountsStatusUpdate(String providerAccountId, CommercePaymentProviderAccountStatusUpdateRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.backendPath('/payments/provider_accounts/${serializePathParameter(providerAccountId, const PathParameterSpec('providerAccountId', 'simple', false))}/status'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsProviderAccountsStatusUpdateResult.fromJson(map);
    })();
  }

  /// Payments Providers List
  Future<PaymentsProvidersListResult?> paymentsProvidersList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/payments/providers'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsProvidersListResult.fromJson(map);
    })();
  }

  /// Payments Reconciliation Runs List
  Future<PaymentsReconciliationRunsListResult?> paymentsReconciliationRunsList([String? providerCode, String? businessDate, int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('provider_code', providerCode, 'form', true, false, null),
      QueryParameterSpec('business_date', businessDate, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/payments/reconciliation_runs'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsReconciliationRunsListResult.fromJson(map);
    })();
  }

  /// Payments Route Rules List
  Future<PaymentsRouteRulesListResult?> paymentsRouteRulesList([String? methodCode, String? countryCode, String? currencyCode, int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('method_code', methodCode, 'form', true, false, null),
      QueryParameterSpec('country_code', countryCode, 'form', true, false, null),
      QueryParameterSpec('currency_code', currencyCode, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/payments/route_rules'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsRouteRulesListResult.fromJson(map);
    })();
  }

  /// Payments Runtime Snapshot Retrieve
  Future<PaymentsRuntimeSnapshotRetrieveResult?> paymentsRuntimeSnapshotRetrieve([String? environment]) async {
    final query = buildQueryString([
      QueryParameterSpec('environment', environment, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/payments/runtime/snapshot'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsRuntimeSnapshotRetrieveResult.fromJson(map);
    })();
  }

  /// Payments Webhook Events List
  Future<PaymentsWebhookEventsListResult?> paymentsWebhookEventsList([String? providerCode, int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('provider_code', providerCode, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/payments/webhook_events'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsWebhookEventsListResult.fromJson(map);
    })();
  }

  /// Recharges Orders List
  Future<RechargesOrdersListResult?> rechargesOrdersList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/recharges/orders'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RechargesOrdersListResult.fromJson(map);
    })();
  }

  /// Recharges Packages List
  Future<RechargesPackagesListResult?> rechargesPackagesList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/recharges/packages'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RechargesPackagesListResult.fromJson(map);
    })();
  }

  /// Recharges Packages Create
  Future<RechargesPackagesCreateResult?> rechargesPackagesCreate(CommerceRechargePackageMutationRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/recharges/packages'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RechargesPackagesCreateResult.fromJson(map);
    })();
  }

  /// Recharges Packages Delete
  Future<RechargesPackagesDeleteResult?> rechargesPackagesDelete(String packageId) async {
    final response = await _client.delete(ApiPaths.backendPath('/recharges/packages/${serializePathParameter(packageId, const PathParameterSpec('packageId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RechargesPackagesDeleteResult.fromJson(map);
    })();
  }

  /// Recharges Packages Update
  Future<RechargesPackagesUpdateResult?> rechargesPackagesUpdate(String packageId, CommerceRechargePackageMutationRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.backendPath('/recharges/packages/${serializePathParameter(packageId, const PathParameterSpec('packageId', 'simple', false))}'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RechargesPackagesUpdateResult.fromJson(map);
    })();
  }

  /// Recharges Settings Retrieve
  Future<RechargesSettingsRetrieveResult?> rechargesSettingsRetrieve() async {
    final response = await _client.get(ApiPaths.backendPath('/recharges/settings'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RechargesSettingsRetrieveResult.fromJson(map);
    })();
  }

  /// Recharges Settings Update
  Future<RechargesSettingsUpdateResult?> rechargesSettingsUpdate(CommerceRechargeSettingsUpdateRequest body) async {
    final payload = body.toJson();
    final response = await _client.put(ApiPaths.backendPath('/recharges/settings'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RechargesSettingsUpdateResult.fromJson(map);
    })();
  }

  /// Refunds List
  Future<RefundsListResult?> refundsList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/refunds'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RefundsListResult.fromJson(map);
    })();
  }

  /// Refunds Retrieve
  Future<RefundsRetrieveResult?> refundsRetrieve(String refundId) async {
    final response = await _client.get(ApiPaths.backendPath('/refunds/${serializePathParameter(refundId, const PathParameterSpec('refundId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RefundsRetrieveResult.fromJson(map);
    })();
  }

  /// Shipments List
  Future<ShipmentsListResult?> shipmentsList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/shipments'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : ShipmentsListResult.fromJson(map);
    })();
  }

  /// Shipments Tracking Events List
  Future<ShipmentsTrackingEventsListResult?> shipmentsTrackingEventsList(String shipmentId, [int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/shipments/${serializePathParameter(shipmentId, const PathParameterSpec('shipmentId', 'simple', false))}/tracking_events'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : ShipmentsTrackingEventsListResult.fromJson(map);
    })();
  }

  /// Wallet Accounts List
  Future<WalletAccountsListResult?> walletAccountsList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/wallet/accounts'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : WalletAccountsListResult.fromJson(map);
    })();
  }

  /// Wallet Adjustments Create
  Future<WalletAdjustmentsCreateResult?> walletAdjustmentsCreate(CommerceStandardCommandRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/wallet/adjustments'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : WalletAdjustmentsCreateResult.fromJson(map);
    })();
  }

  /// Wallet Exchange Rules List
  Future<WalletExchangeRulesListResult?> walletExchangeRulesList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/wallet/exchange_rules'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : WalletExchangeRulesListResult.fromJson(map);
    })();
  }

  /// Wallet Ledger Entries List
  Future<WalletLedgerEntriesListResult?> walletLedgerEntriesList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/wallet/ledger_entries'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : WalletLedgerEntriesListResult.fromJson(map);
    })();
  }
}

class PathParameterSpec {
  final String name;
  final String style;
  final bool explode;

  const PathParameterSpec(this.name, this.style, this.explode);
}

String serializePathParameter(dynamic value, PathParameterSpec spec) {
  if (value == null) return '';
  final style = spec.style.trim().isEmpty ? 'simple' : spec.style;
  if (value is Iterable) {
    return serializePathArray(spec.name, value, style, spec.explode);
  }
  if (value is Map) {
    return serializePathObject(spec.name, value, style, spec.explode);
  }
  return pathPrimitivePrefix(spec.name, style) + Uri.encodeComponent(value.toString());
}

String serializePathArray(String name, Iterable values, String style, bool explode) {
  final serialized = values.where((item) => item != null).map((item) => Uri.encodeComponent(item.toString())).toList();
  if (serialized.isEmpty) return pathPrefix(name, style);
  if (style == 'matrix') {
    if (explode) {
      return serialized.map((item) => ';$name=$item').join();
    }
    return ';$name=${serialized.join(',')}';
  }
  final separator = explode ? '.' : ',';
  return pathPrefix(name, style) + serialized.join(separator);
}

String serializePathObject(String name, Map values, String style, bool explode) {
  final entries = <String>[];
  final exploded = <String>[];
  values.forEach((key, value) {
    if (value == null) return;
    final escapedKey = Uri.encodeComponent(key.toString());
    final escapedValue = Uri.encodeComponent(value.toString());
    if (explode) {
      if (style == 'matrix') {
        exploded.add(';$escapedKey=$escapedValue');
      } else {
        exploded.add('$escapedKey=$escapedValue');
      }
    } else {
      entries.add(escapedKey);
      entries.add(escapedValue);
    }
  });
  if (style == 'matrix') {
    if (explode) return exploded.join();
    return ';$name=${entries.join(',')}';
  }
  if (explode) {
    final separator = style == 'label' ? '.' : ',';
    return pathPrefix(name, style) + exploded.join(separator);
  }
  return pathPrefix(name, style) + entries.join(',');
}

String pathPrefix(String name, String style) {
  if (style == 'label') return '.';
  if (style == 'matrix') return ';$name';
  return '';
}

String pathPrimitivePrefix(String name, String style) {
  return style == 'matrix' ? ';$name=' : pathPrefix(name, style);
}
class QueryParameterSpec {
  final String name;
  final dynamic value;
  final String style;
  final bool explode;
  final bool allowReserved;
  final String? contentType;

  const QueryParameterSpec(
    this.name,
    this.value,
    this.style,
    this.explode,
    this.allowReserved,
    this.contentType,
  );
}

String buildQueryString(List<QueryParameterSpec> parameters) {
  final pairs = <String>[];
  for (final parameter in parameters) {
    appendSerializedParameter(pairs, parameter);
  }
  return pairs.join('&');
}

void appendSerializedParameter(List<String> pairs, QueryParameterSpec parameter) {
  final value = parameter.value;
  if (value == null) return;

  final contentType = parameter.contentType;
  if (contentType != null && contentType.trim().isNotEmpty) {
    pairs.add('${urlEncode(parameter.name)}=${encodeQueryValue(jsonEncode(value), parameter.allowReserved)}');
    return;
  }

  final style = parameter.style.trim().isEmpty ? 'form' : parameter.style;
  if (style == 'deepObject' && value is Map) {
    appendDeepObjectParameter(pairs, parameter.name, value, parameter.allowReserved);
    return;
  }
  if (value is Iterable) {
    appendArrayParameter(pairs, parameter.name, value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  if (value is Map) {
    appendObjectParameter(pairs, parameter.name, value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  pairs.add('${urlEncode(parameter.name)}=${encodeQueryValue(value.toString(), parameter.allowReserved)}');
}

void appendArrayParameter(
  List<String> pairs,
  String name,
  Iterable values,
  String style,
  bool explode,
  bool allowReserved,
) {
  final serialized = values.where((item) => item != null).map((item) => item.toString()).toList();
  if (serialized.isEmpty) return;
  if (style == 'form' && explode) {
    for (final item in serialized) {
      pairs.add('${urlEncode(name)}=${encodeQueryValue(item, allowReserved)}');
    }
    return;
  }
  pairs.add('${urlEncode(name)}=${encodeQueryValue(serialized.join(','), allowReserved)}');
}

void appendObjectParameter(
  List<String> pairs,
  String name,
  Map values,
  String style,
  bool explode,
  bool allowReserved,
) {
  final serialized = <String>[];
  values.forEach((key, value) {
    if (value == null) return;
    if (style == 'form' && explode) {
      pairs.add('${urlEncode(key.toString())}=${encodeQueryValue(value.toString(), allowReserved)}');
      return;
    }
    serialized.add(key.toString());
    serialized.add(value.toString());
  });
  if (serialized.isNotEmpty) {
    pairs.add('${urlEncode(name)}=${encodeQueryValue(serialized.join(','), allowReserved)}');
  }
}

void appendDeepObjectParameter(List<String> pairs, String name, Map values, bool allowReserved) {
  values.forEach((key, value) {
    if (value != null) {
      pairs.add('${urlEncode('$name[$key]')}=${encodeQueryValue(value.toString(), allowReserved)}');
    }
  });
}

String encodeQueryValue(String value, bool allowReserved) {
  var encoded = urlEncode(value);
  if (!allowReserved) return encoded;
  const replacements = <String, String>{
    '%3A': ':',
    '%2F': '/',
    '%3F': '?',
    '%23': '#',
    '%5B': '[',
    '%5D': ']',
    '%40': '@',
    '%21': '!',
    '%24': r'$',
    '%26': '&',
    '%27': "'",
    '%28': '(',
    '%29': ')',
    '%2A': '*',
    '%2B': '+',
    '%2C': ',',
    '%3B': ';',
    '%3D': '=',
  };
  replacements.forEach((escaped, reserved) {
    encoded = encoded.replaceAll(escaped, reserved);
  });
  return encoded;
}

String urlEncode(String value) => Uri.encodeQueryComponent(value);
class HeaderParameterSpec {
  final dynamic value;
  final String style;
  final bool explode;
  final String? contentType;

  HeaderParameterSpec(this.value, this.style, this.explode, this.contentType);
}

Map<String, String>? buildRequestHeaders(
  Map<String, HeaderParameterSpec> headers, [
  Map<String, HeaderParameterSpec> cookies = const {},
]) {
  final requestHeaders = <String, String>{};

  headers.forEach((name, parameter) {
    final serialized = serializeParameterValue(parameter);
    if (serialized != null) {
      requestHeaders[name] = serialized;
    }
  });

  final cookieHeader = buildCookieHeader(cookies);
  if (cookieHeader != null && cookieHeader.isNotEmpty) {
    requestHeaders['Cookie'] = requestHeaders.containsKey('Cookie')
        ? '${requestHeaders['Cookie']}; $cookieHeader'
        : cookieHeader;
  }

  return requestHeaders.isEmpty ? null : requestHeaders;
}

String? buildCookieHeader(Map<String, HeaderParameterSpec> cookies) {
  final pairs = <String>[];
  cookies.forEach((name, parameter) {
    final serialized = serializeParameterValue(parameter);
    if (serialized != null) {
      pairs.add('${Uri.encodeComponent(name)}=${Uri.encodeComponent(serialized)}');
    }
  });
  return pairs.isEmpty ? null : pairs.join('; ');
}

String? serializeParameterValue(HeaderParameterSpec? parameter) {
  final value = parameter?.value;
  if (value == null) return null;
  if (parameter!.contentType != null && parameter.contentType!.trim().isNotEmpty) {
    return jsonEncode(value);
  }
  if (value is DateTime) return value.toIso8601String();
  if (value is Iterable) {
    return value
        .where((item) => item != null)
        .map((item) => item.toString())
        .whereType<String>()
        .join(',');
  }
  if (value is Map) {
    final serialized = <String>[];
    value.forEach((key, item) {
      if (item == null) return;
      if (parameter.explode) {
        serialized.add('$key=$item');
      } else {
        serialized.add(key.toString());
        serialized.add(item.toString());
      }
    });
    return serialized.join(',');
  }
  return value.toString();
}
