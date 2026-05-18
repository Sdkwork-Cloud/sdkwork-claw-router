import 'dart:convert';
import '../http/client.dart';
import '../models.dart';

import 'paths.dart';
import 'response_helpers.dart';


class BillingApi {
  final HttpClient _client;

  BillingApi(this._client);

  /// List batches
  Future<CouponBatchesListResult?> couponBatchesList([String? couponId, String? status, int? page, int? pageSize, String? cursor]) async {
    final query = buildQueryString([
      QueryParameterSpec('coupon_id', couponId, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('cursor', cursor, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/billing/coupon_batches'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CouponBatchesListResult.fromJson(map);
    })();
  }

  /// Generate batch
  Future<CouponBatchesCreateResult?> couponBatchesCreate(AdminCouponBatchGenerateRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/billing/coupon_batches'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CouponBatchesCreateResult.fromJson(map);
    })();
  }

  /// List promo codes
  Future<CouponCodesListResult?> couponCodesList([String? couponId, String? batchId, String? status, int? page, int? pageSize, String? cursor]) async {
    final query = buildQueryString([
      QueryParameterSpec('coupon_id', couponId, 'form', true, false, null),
      QueryParameterSpec('batch_id', batchId, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('cursor', cursor, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/billing/coupon_codes'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CouponCodesListResult.fromJson(map);
    })();
  }

  /// Update promo code status
  Future<CouponCodesStatusUpdateResult?> couponCodesStatusUpdate(String codeId, AdminPromoCodeStatusUpdateRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.backendPath('/billing/coupon_codes/${serializePathParameter(codeId, const PathParameterSpec('codeId', 'simple', false))}/status'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CouponCodesStatusUpdateResult.fromJson(map);
    })();
  }

  /// List coupons
  Future<CouponsListResult?> couponsList([String? status, int? page, int? pageSize, String? cursor]) async {
    final query = buildQueryString([
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('cursor', cursor, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/billing/coupons'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CouponsListResult.fromJson(map);
    })();
  }

  /// Create coupon
  Future<CouponsCreateResult?> couponsCreate(AdminCouponCreateRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/billing/coupons'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CouponsCreateResult.fromJson(map);
    })();
  }

  /// Delete coupon
  Future<CouponsDeleteResult?> couponsDelete(String couponId) async {
    final response = await _client.delete(ApiPaths.backendPath('/billing/coupons/${serializePathParameter(couponId, const PathParameterSpec('couponId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CouponsDeleteResult.fromJson(map);
    })();
  }

  /// Update coupon
  Future<CouponsUpdateResult?> couponsUpdate(String couponId, AdminCouponCreateRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.put(ApiPaths.backendPath('/billing/coupons/${serializePathParameter(couponId, const PathParameterSpec('couponId', 'simple', false))}'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CouponsUpdateResult.fromJson(map);
    })();
  }

  /// List exchange rules
  Future<ExchangeRulesListResult?> exchangeRulesList([String? sourceAssetType, String? targetAssetType, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('source_asset_type', sourceAssetType, 'form', true, false, null),
      QueryParameterSpec('target_asset_type', targetAssetType, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/billing/exchange_rules'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : ExchangeRulesListResult.fromJson(map);
    })();
  }

  /// Upsert exchange rule
  Future<ExchangeRulesUpdateResult?> exchangeRulesUpdate(CommerceExchangeRuleUpsertRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.put(ApiPaths.backendPath('/billing/exchange_rules'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : ExchangeRulesUpdateResult.fromJson(map);
    })();
  }

  /// List transactions
  Future<FinanceLedgerListResult?> financeLedgerList([int? page, int? pageSize, String? q, String? status, String? startTime, String? endTime]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('q', q, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('start_time', startTime, 'form', true, false, null),
      QueryParameterSpec('end_time', endTime, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/billing/finance/ledger'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FinanceLedgerListResult.fromJson(map);
    })();
  }

  /// List billing
  Future<FinanceUsageStatementsListResult?> financeUsageStatementsList([int? page, int? pageSize, String? q, String? status, String? startTime, String? endTime]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('q', q, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('start_time', startTime, 'form', true, false, null),
      QueryParameterSpec('end_time', endTime, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/billing/finance/usage_statements'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FinanceUsageStatementsListResult.fromJson(map);
    })();
  }

  /// List payment attempts
  Future<PaymentsAttemptsListResult?> paymentsAttemptsList([String? provider, String? status, int? page, int? pageSize, String? cursor]) async {
    final query = buildQueryString([
      QueryParameterSpec('provider', provider, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('cursor', cursor, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/billing/payments/attempts'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsAttemptsListResult.fromJson(map);
    })();
  }

  /// List recharge packages
  Future<RechargesPackagesListResult?> rechargesPackagesList([String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/billing/recharges/packages'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RechargesPackagesListResult.fromJson(map);
    })();
  }

  /// Create recharge package
  Future<RechargesPackagesCreateResult?> rechargesPackagesCreate(CommerceRechargePackageMutationRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/billing/recharges/packages'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RechargesPackagesCreateResult.fromJson(map);
    })();
  }

  /// Delete recharge package
  Future<RechargesPackagesDeleteResult?> rechargesPackagesDelete(String packageId) async {
    final response = await _client.delete(ApiPaths.backendPath('/billing/recharges/packages/${serializePathParameter(packageId, const PathParameterSpec('packageId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RechargesPackagesDeleteResult.fromJson(map);
    })();
  }

  /// Update recharge package
  Future<RechargesPackagesUpdateResult?> rechargesPackagesUpdate(String packageId, CommerceRechargePackageMutationRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.put(ApiPaths.backendPath('/billing/recharges/packages/${serializePathParameter(packageId, const PathParameterSpec('packageId', 'simple', false))}'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RechargesPackagesUpdateResult.fromJson(map);
    })();
  }

  /// List recharge records
  Future<RechargesRecordsListResult?> rechargesRecordsList([String? userId, String? status, int? page, int? pageSize, String? cursor]) async {
    final query = buildQueryString([
      QueryParameterSpec('user_id', userId, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('cursor', cursor, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/billing/recharges/records'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RechargesRecordsListResult.fromJson(map);
    })();
  }

  /// Retrieve recharge record
  Future<RechargesRecordsRetrieveResult?> rechargesRecordsRetrieve(String orderNo) async {
    final response = await _client.get(ApiPaths.backendPath('/billing/recharges/records/${serializePathParameter(orderNo, const PathParameterSpec('orderNo', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RechargesRecordsRetrieveResult.fromJson(map);
    })();
  }

  /// List referral stats
  Future<ReferralsStatsListResult?> referralsStatsList() async {
    final response = await _client.get(ApiPaths.backendPath('/billing/referrals/stats'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : ReferralsStatsListResult.fromJson(map);
    })();
  }

  /// List redemption records
  Future<UsersCouponsListResult?> usersCouponsList([String? userId, String? status, int? page, int? pageSize, String? cursor]) async {
    final query = buildQueryString([
      QueryParameterSpec('user_id', userId, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('cursor', cursor, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/billing/users/coupons'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : UsersCouponsListResult.fromJson(map);
    })();
  }

  /// Update balance
  Future<UsersBalanceAdjustmentsCreateResult?> usersBalanceAdjustmentsCreate(String userId, AdminUserBalanceAdjustmentRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/billing/users/${serializePathParameter(userId, const PathParameterSpec('userId', 'simple', false))}/balance_adjustments'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : UsersBalanceAdjustmentsCreateResult.fromJson(map);
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
