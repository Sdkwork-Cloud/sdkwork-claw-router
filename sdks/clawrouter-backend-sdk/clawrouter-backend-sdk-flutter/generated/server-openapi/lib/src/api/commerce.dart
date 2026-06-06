import 'dart:convert';
import '../http/client.dart';
import '../models.dart';

import 'paths.dart';
import 'response_helpers.dart';


class CommerceApi {
  final HttpClient _client;

  CommerceApi(this._client);

  /// List category attribute bindings
  Future<CatalogCategoryAttributesListResult?> catalogCategoryAttributesList([String? categoryId, String? attributeId, String? status, String? page, String? pageSize]) async {
    final query = buildQueryString([
      QueryParameterSpec('category_id', categoryId, 'form', true, false, null),
      QueryParameterSpec('attribute_id', attributeId, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/catalog/category_attributes'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogCategoryAttributesListResult.fromJson(map);
    })();
  }

  /// Create category attribute binding
  Future<CatalogCategoryAttributesCreateResult?> catalogCategoryAttributesCreate(CommerceProductCategoryAttributeMutationRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/catalog/category_attributes'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogCategoryAttributesCreateResult.fromJson(map);
    })();
  }

  /// Delete category attribute binding
  Future<CatalogCategoryAttributesDeleteResult?> catalogCategoryAttributesDelete(String bindingId) async {
    final response = await _client.delete(ApiPaths.backendPath('/catalog/category_attributes/${serializePathParameter(bindingId, const PathParameterSpec('bindingId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogCategoryAttributesDeleteResult.fromJson(map);
    })();
  }

  /// Update category attribute binding
  Future<CatalogCategoryAttributesUpdateResult?> catalogCategoryAttributesUpdate(String bindingId, CommerceProductCategoryAttributeMutationRequest body, String idempotencyKey) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.backendPath('/catalog/category_attributes/${serializePathParameter(bindingId, const PathParameterSpec('bindingId', 'simple', false))}'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogCategoryAttributesUpdateResult.fromJson(map);
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

  /// Delete product SPU
  Future<CatalogProductsDeleteResult?> catalogProductsDelete(String productId) async {
    final response = await _client.delete(ApiPaths.backendPath('/catalog/products/${serializePathParameter(productId, const PathParameterSpec('productId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CatalogProductsDeleteResult.fromJson(map);
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

  /// Orders Retrieve
  Future<OrdersRetrieveResult?> ordersRetrieve(String orderId) async {
    final response = await _client.get(ApiPaths.backendPath('/orders/${serializePathParameter(orderId, const PathParameterSpec('orderId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : OrdersRetrieveResult.fromJson(map);
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
  Future<PaymentsProvidersListResult?> paymentsProvidersList([String? page, String? pageSize, String? status]) async {
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

  /// Recharges Packages Delete
  Future<RechargesPackagesDeleteResult?> rechargesPackagesDelete(String packageId) async {
    final response = await _client.delete(ApiPaths.backendPath('/recharges/packages/${serializePathParameter(packageId, const PathParameterSpec('packageId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RechargesPackagesDeleteResult.fromJson(map);
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

  /// Shipments Tracking Events List
  Future<ShipmentsTrackingEventsListResult?> shipmentsTrackingEventsList(String shipmentId, [String? page, String? pageSize, String? status]) async {
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
