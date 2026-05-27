import 'dart:convert';
import '../http/client.dart';
import '../models.dart';

import 'paths.dart';
import 'response_helpers.dart';


class CommerceApi {
  final HttpClient _client;

  CommerceApi(this._client);

  /// Accounts Current Summary Retrieve
  Future<AccountsCurrentSummaryRetrieveResult?> accountsCurrentSummaryRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/accounts/current/summary'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountsCurrentSummaryRetrieveResult.fromJson(map);
    })();
  }

  /// Addresses List
  Future<AddressesListResult?> addressesList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/addresses'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AddressesListResult.fromJson(map);
    })();
  }

  /// Addresses Create
  Future<AddressesCreateResult?> addressesCreate(CommerceStandardCommandRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/addresses'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AddressesCreateResult.fromJson(map);
    })();
  }

  /// Addresses Delete
  Future<AddressesDeleteResult?> addressesDelete(String addressId, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final response = await _client.delete(ApiPaths.appPath('/addresses/${serializePathParameter(addressId, const PathParameterSpec('addressId', 'simple', false))}'), headers: requestHeaders);
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AddressesDeleteResult.fromJson(map);
    })();
  }

  /// Addresses Update
  Future<AddressesUpdateResult?> addressesUpdate(String addressId, CommerceStandardCommandRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.appPath('/addresses/${serializePathParameter(addressId, const PathParameterSpec('addressId', 'simple', false))}'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AddressesUpdateResult.fromJson(map);
    })();
  }

  /// Addresses Default Selection Create
  Future<AddressesDefaultSelectionCreateResult?> addressesDefaultSelectionCreate(String addressId, CommerceStandardCommandRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/addresses/${serializePathParameter(addressId, const PathParameterSpec('addressId', 'simple', false))}/default_selection'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AddressesDefaultSelectionCreateResult.fromJson(map);
    })();
  }

  /// Billing History List
  Future<BillingHistoryListResult?> billingHistoryList([int? page, int? pageSize, String? type, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('type', type, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/billing/history'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : BillingHistoryListResult.fromJson(map);
    })();
  }

  /// Cart Current Retrieve
  Future<CartCurrentRetrieveResult?> cartCurrentRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/cart/current'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CartCurrentRetrieveResult.fromJson(map);
    })();
  }

  /// Cart Items Create
  Future<CartItemsCreateResult?> cartItemsCreate(CommerceStandardCommandRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/cart/items'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CartItemsCreateResult.fromJson(map);
    })();
  }

  /// Cart Items Delete
  Future<CartItemsDeleteResult?> cartItemsDelete(String cartItemId, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final response = await _client.delete(ApiPaths.appPath('/cart/items/${serializePathParameter(cartItemId, const PathParameterSpec('cartItemId', 'simple', false))}'), headers: requestHeaders);
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CartItemsDeleteResult.fromJson(map);
    })();
  }

  /// Cart Items Update
  Future<CartItemsUpdateResult?> cartItemsUpdate(String cartItemId, CommerceStandardCommandRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.appPath('/cart/items/${serializePathParameter(cartItemId, const PathParameterSpec('cartItemId', 'simple', false))}'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CartItemsUpdateResult.fromJson(map);
    })();
  }

  /// List visible product categories
  Future<CatalogCategoriesListResult?> catalogCategoriesList([String? parentId, String? status, int? page, int? pageSize]) async {
    final query = buildQueryString([
      QueryParameterSpec('parent_id', parentId, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/catalog/categories'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogCategoriesListResult.fromJson(map);
    })();
  }

  /// List visible catalog products
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
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/catalog/products'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogProductsListResult.fromJson(map);
    })();
  }

  /// Retrieve catalog product detail
  Future<CatalogProductsRetrieveResult?> catalogProductsRetrieve(String productId) async {
    final response = await _client.get(ApiPaths.appPath('/catalog/products/${serializePathParameter(productId, const PathParameterSpec('productId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogProductsRetrieveResult.fromJson(map);
    })();
  }

  /// Retrieve catalog SKU detail
  Future<CatalogSkusRetrieveResult?> catalogSkusRetrieve(String skuId) async {
    final response = await _client.get(ApiPaths.appPath('/catalog/skus/${serializePathParameter(skuId, const PathParameterSpec('skuId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogSkusRetrieveResult.fromJson(map);
    })();
  }

  /// Checkout Sessions Create
  Future<CheckoutSessionsCreateResult?> checkoutSessionsCreate(CommerceStandardCommandRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/checkout/sessions'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CheckoutSessionsCreateResult.fromJson(map);
    })();
  }

  /// Checkout Sessions Retrieve
  Future<CheckoutSessionsRetrieveResult?> checkoutSessionsRetrieve(String checkoutSessionId) async {
    final response = await _client.get(ApiPaths.appPath('/checkout/sessions/${serializePathParameter(checkoutSessionId, const PathParameterSpec('checkoutSessionId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CheckoutSessionsRetrieveResult.fromJson(map);
    })();
  }

  /// Checkout Sessions Orders Create
  Future<CheckoutSessionsOrdersCreateResult?> checkoutSessionsOrdersCreate(String checkoutSessionId, CommerceStandardCommandRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/checkout/sessions/${serializePathParameter(checkoutSessionId, const PathParameterSpec('checkoutSessionId', 'simple', false))}/orders'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CheckoutSessionsOrdersCreateResult.fromJson(map);
    })();
  }

  /// Checkout Sessions Quotes Create
  Future<CheckoutSessionsQuotesCreateResult?> checkoutSessionsQuotesCreate(String checkoutSessionId, CommerceStandardCommandRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/checkout/sessions/${serializePathParameter(checkoutSessionId, const PathParameterSpec('checkoutSessionId', 'simple', false))}/quotes'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CheckoutSessionsQuotesCreateResult.fromJson(map);
    })();
  }

  /// Fulfillments List
  Future<FulfillmentsListResult?> fulfillmentsList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/fulfillments'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FulfillmentsListResult.fromJson(map);
    })();
  }

  /// Fulfillments Retrieve
  Future<FulfillmentsRetrieveResult?> fulfillmentsRetrieve(String fulfillmentId) async {
    final response = await _client.get(ApiPaths.appPath('/fulfillments/${serializePathParameter(fulfillmentId, const PathParameterSpec('fulfillmentId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FulfillmentsRetrieveResult.fromJson(map);
    })();
  }

  /// Invoices List
  Future<InvoicesListResult?> invoicesList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/invoices'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : InvoicesListResult.fromJson(map);
    })();
  }

  /// Invoices Create
  Future<InvoicesCreateResult?> invoicesCreate(CommerceStandardCommandRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/invoices'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : InvoicesCreateResult.fromJson(map);
    })();
  }

  /// Invoices Retrieve
  Future<InvoicesRetrieveResult?> invoicesRetrieve(String invoiceId) async {
    final response = await _client.get(ApiPaths.appPath('/invoices/${serializePathParameter(invoiceId, const PathParameterSpec('invoiceId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : InvoicesRetrieveResult.fromJson(map);
    })();
  }

  /// Memberships Benefits List
  Future<MembershipsBenefitsListResult?> membershipsBenefitsList([int? planId]) async {
    final query = buildQueryString([
      QueryParameterSpec('plan_id', planId, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/memberships/benefits'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsBenefitsListResult.fromJson(map);
    })();
  }

  /// Memberships Current Retrieve
  Future<MembershipsCurrentRetrieveResult?> membershipsCurrentRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/memberships/current'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsCurrentRetrieveResult.fromJson(map);
    })();
  }

  /// Memberships Current Status Retrieve
  Future<MembershipsCurrentStatusRetrieveResult?> membershipsCurrentStatusRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/memberships/current/status'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsCurrentStatusRetrieveResult.fromJson(map);
    })();
  }

  /// Memberships Package Groups List
  Future<MembershipsPackageGroupsListResult?> getMembershipsPackageGroupsList([int? planId, bool? recommendedOnly]) async {
    final query = buildQueryString([
      QueryParameterSpec('plan_id', planId, 'form', true, false, null),
      QueryParameterSpec('recommended_only', recommendedOnly, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/memberships/package_groups'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPackageGroupsListResult.fromJson(map);
    })();
  }

  /// Memberships Package Groups Retrieve
  Future<MembershipsPackageGroupsRetrieveResult?> membershipsPackageGroupsRetrieve(String packageGroupId) async {
    final response = await _client.get(ApiPaths.appPath('/memberships/package_groups/${serializePathParameter(packageGroupId, const PathParameterSpec('packageGroupId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPackageGroupsRetrieveResult.fromJson(map);
    })();
  }

  /// Memberships Package Groups Packages List
  Future<MembershipsPackageGroupsPackagesListResult?> getMembershipsPackageGroupsListPackageGroups(String packageGroupId, [int? planId]) async {
    final query = buildQueryString([
      QueryParameterSpec('plan_id', planId, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/memberships/package_groups/${serializePathParameter(packageGroupId, const PathParameterSpec('packageGroupId', 'simple', false))}/packages'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPackageGroupsPackagesListResult.fromJson(map);
    })();
  }

  /// Memberships Packages List
  Future<MembershipsPackagesListResult?> membershipsPackagesList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/memberships/packages'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPackagesListResult.fromJson(map);
    })();
  }

  /// Memberships Packages Retrieve
  Future<MembershipsPackagesRetrieveResult?> membershipsPackagesRetrieve(String packageId) async {
    final response = await _client.get(ApiPaths.appPath('/memberships/packages/${serializePathParameter(packageId, const PathParameterSpec('packageId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPackagesRetrieveResult.fromJson(map);
    })();
  }

  /// Memberships Plans List
  Future<MembershipsPlansListResult?> membershipsPlansList() async {
    final response = await _client.get(ApiPaths.appPath('/memberships/plans'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPlansListResult.fromJson(map);
    })();
  }

  /// Memberships Points Balance Retrieve
  Future<MembershipsPointsBalanceRetrieveResult?> membershipsPointsBalanceRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/memberships/points/balance'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPointsBalanceRetrieveResult.fromJson(map);
    })();
  }

  /// Memberships Points Daily Rewards Create
  Future<MembershipsPointsDailyRewardsCreateResult?> membershipsPointsDailyRewardsCreate([MembershipsPointsDailyRewardsCreateRequest? body, String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body?.toJson();
    final response = await _client.post(ApiPaths.appPath('/memberships/points/daily_rewards'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPointsDailyRewardsCreateResult.fromJson(map);
    })();
  }

  /// Memberships Points Daily Rewards Status Retrieve
  Future<MembershipsPointsDailyRewardsStatusRetrieveResult?> membershipsPointsDailyRewardsStatusRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/memberships/points/daily_rewards/status'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPointsDailyRewardsStatusRetrieveResult.fromJson(map);
    })();
  }

  /// Memberships Points History List
  Future<MembershipsPointsHistoryListResult?> membershipsPointsHistoryList([int? page, int? pageSize, String? cursor]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('cursor', cursor, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/memberships/points/history'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPointsHistoryListResult.fromJson(map);
    })();
  }

  /// Memberships Privileges Speed Ups Create
  Future<MembershipsPrivilegesSpeedUpsCreateResult?> membershipsPrivilegesSpeedUpsCreate([MembershipsPrivilegesSpeedUpsCreateRequest? body, String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body?.toJson();
    final response = await _client.post(ApiPaths.appPath('/memberships/privileges/speed_ups'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPrivilegesSpeedUpsCreateResult.fromJson(map);
    })();
  }

  /// Memberships Privileges Usage Retrieve
  Future<MembershipsPrivilegesUsageRetrieveResult?> membershipsPrivilegesUsageRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/memberships/privileges/usage'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPrivilegesUsageRetrieveResult.fromJson(map);
    })();
  }

  /// Memberships Purchases Create
  Future<MembershipsPurchasesCreateResult?> membershipsPurchasesCreate(CommerceMembershipPurchaseRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/memberships/purchases'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPurchasesCreateResult.fromJson(map);
    })();
  }

  /// Memberships Purchases Renew
  Future<MembershipsPurchasesRenewResult?> membershipsPurchasesRenew(CommerceMembershipPurchaseRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/memberships/purchases/renew'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPurchasesRenewResult.fromJson(map);
    })();
  }

  /// Memberships Purchases Upgrade
  Future<MembershipsPurchasesUpgradeResult?> membershipsPurchasesUpgrade(CommerceMembershipPurchaseRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/memberships/purchases/upgrade'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MembershipsPurchasesUpgradeResult.fromJson(map);
    })();
  }

  /// Orders List
  Future<OrdersListResult?> ordersList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/orders'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : OrdersListResult.fromJson(map);
    })();
  }

  /// Orders Retrieve
  Future<OrdersRetrieveResult?> ordersRetrieve(String orderId) async {
    final response = await _client.get(ApiPaths.appPath('/orders/${serializePathParameter(orderId, const PathParameterSpec('orderId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : OrdersRetrieveResult.fromJson(map);
    })();
  }

  /// Orders Cancellations Create
  Future<OrdersCancellationsCreateResult?> ordersCancellationsCreate(String orderId, CommerceStandardCommandRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/orders/${serializePathParameter(orderId, const PathParameterSpec('orderId', 'simple', false))}/cancellations'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : OrdersCancellationsCreateResult.fromJson(map);
    })();
  }

  /// Orders Events List
  Future<OrdersEventsListResult?> ordersEventsList(String orderId, [int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/orders/${serializePathParameter(orderId, const PathParameterSpec('orderId', 'simple', false))}/events'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : OrdersEventsListResult.fromJson(map);
    })();
  }

  /// Payments Attempts Retrieve
  Future<PaymentsAttemptsRetrieveResult?> paymentsAttemptsRetrieve(String paymentAttemptId) async {
    final response = await _client.get(ApiPaths.appPath('/payments/attempts/${serializePathParameter(paymentAttemptId, const PathParameterSpec('paymentAttemptId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsAttemptsRetrieveResult.fromJson(map);
    })();
  }

  /// Payments Intents Create
  Future<PaymentsIntentsCreateResult?> paymentsIntentsCreate(CommercePaymentIntentCreateRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/payments/intents'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsIntentsCreateResult.fromJson(map);
    })();
  }

  /// Payments Intents Retrieve
  Future<PaymentsIntentsRetrieveResult?> paymentsIntentsRetrieve(String paymentIntentId) async {
    final response = await _client.get(ApiPaths.appPath('/payments/intents/${serializePathParameter(paymentIntentId, const PathParameterSpec('paymentIntentId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsIntentsRetrieveResult.fromJson(map);
    })();
  }

  /// Payments Intents Attempts Create
  Future<PaymentsIntentsAttemptsCreateResult?> paymentsIntentsAttemptsCreate(String paymentIntentId, CommercePaymentAttemptCreateRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/payments/intents/${serializePathParameter(paymentIntentId, const PathParameterSpec('paymentIntentId', 'simple', false))}/attempts'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsIntentsAttemptsCreateResult.fromJson(map);
    })();
  }

  /// Payments Methods List
  Future<PaymentsMethodsListResult?> paymentsMethodsList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/payments/methods'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsMethodsListResult.fromJson(map);
    })();
  }

  /// Recharges Orders Create
  Future<RechargesOrdersCreateResult?> rechargesOrdersCreate(CommerceStandardCommandRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/recharges/orders'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RechargesOrdersCreateResult.fromJson(map);
    })();
  }

  /// Recharges Orders Retrieve
  Future<RechargesOrdersRetrieveResult?> rechargesOrdersRetrieve(String orderId) async {
    final response = await _client.get(ApiPaths.appPath('/recharges/orders/${serializePathParameter(orderId, const PathParameterSpec('orderId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RechargesOrdersRetrieveResult.fromJson(map);
    })();
  }

  /// Recharges Packages List
  Future<RechargesPackagesListResult?> rechargesPackagesList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/recharges/packages'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RechargesPackagesListResult.fromJson(map);
    })();
  }

  /// Refunds List
  Future<RefundsListResult?> refundsList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/refunds'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RefundsListResult.fromJson(map);
    })();
  }

  /// Refunds Create
  Future<RefundsCreateResult?> refundsCreate(CommerceStandardCommandRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/refunds'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RefundsCreateResult.fromJson(map);
    })();
  }

  /// Refunds Retrieve
  Future<RefundsRetrieveResult?> refundsRetrieve(String refundId) async {
    final response = await _client.get(ApiPaths.appPath('/refunds/${serializePathParameter(refundId, const PathParameterSpec('refundId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RefundsRetrieveResult.fromJson(map);
    })();
  }

  /// Shipments Retrieve
  Future<ShipmentsRetrieveResult?> shipmentsRetrieve(String shipmentId) async {
    final response = await _client.get(ApiPaths.appPath('/shipments/${serializePathParameter(shipmentId, const PathParameterSpec('shipmentId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : ShipmentsRetrieveResult.fromJson(map);
    })();
  }

  /// Wallet Accounts List
  Future<WalletAccountsListResult?> walletAccountsList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/wallet/accounts'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : WalletAccountsListResult.fromJson(map);
    })();
  }

  /// Wallet Exchange Rate Retrieve
  Future<WalletExchangeRateRetrieveResult?> walletExchangeRateRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/wallet/exchange_rate'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : WalletExchangeRateRetrieveResult.fromJson(map);
    })();
  }

  /// Wallet Ledger Entries List
  Future<WalletLedgerEntriesListResult?> walletLedgerEntriesList([int? page, int? pageSize, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/wallet/ledger_entries'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : WalletLedgerEntriesListResult.fromJson(map);
    })();
  }

  /// Wallet Overview Retrieve
  Future<WalletOverviewRetrieveResult?> walletOverviewRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/wallet/overview'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : WalletOverviewRetrieveResult.fromJson(map);
    })();
  }

  /// Wallet Points Exchange Rules List
  Future<WalletPointsExchangeRulesListResult?> walletPointsExchangeRulesList([String? sourceAssetType, String? targetAssetType]) async {
    final query = buildQueryString([
      QueryParameterSpec('source_asset_type', sourceAssetType, 'form', true, false, null),
      QueryParameterSpec('target_asset_type', targetAssetType, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/wallet/points/exchanges/rules'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : WalletPointsExchangeRulesListResult.fromJson(map);
    })();
  }

  /// Wallet Tokens Retrieve
  Future<WalletTokensRetrieveResult?> walletTokensRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/wallet/tokens'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : WalletTokensRetrieveResult.fromJson(map);
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
