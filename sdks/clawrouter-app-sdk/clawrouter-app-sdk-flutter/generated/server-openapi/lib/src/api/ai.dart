import 'dart:convert';
import '../http/client.dart';
import '../models.dart';

import 'paths.dart';
import 'response_helpers.dart';


class AiApi {
  final HttpClient _client;

  AiApi(this._client);

  /// List dashboard overview
  Future<DashboardOverviewRetrieveResult?> dashboardOverviewRetrieve([String? timeRange, String? startTime, String? endTime]) async {
    final query = buildQueryString([
      QueryParameterSpec('time_range', timeRange, 'form', true, false, null),
      QueryParameterSpec('start_time', startTime, 'form', true, false, null),
      QueryParameterSpec('end_time', endTime, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/ai/dashboard/overview'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : DashboardOverviewRetrieveResult.fromJson(map);
    })();
  }

  /// List traces
  Future<GatewayTracesListResult?> gatewayTracesList() async {
    final response = await _client.get(ApiPaths.appPath('/ai/gateway/traces'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : GatewayTracesListResult.fromJson(map);
    })();
  }

  /// Create Playground generation agent run
  Future<GenerationAgentRunsCreateResult?> generationAgentRunsCreate(GenerationAgentRunCreateRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/ai/generation_agent/runs'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : GenerationAgentRunsCreateResult.fromJson(map);
    })();
  }

  /// List generation history
  Future<GenerationsListResult?> generationsList() async {
    final response = await _client.get(ApiPaths.appPath('/ai/generations'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : GenerationsListResult.fromJson(map);
    })();
  }

  /// List model rankings
  Future<ModelRankingsListResult?> modelRankingsList([String? rankScope, String? vendorCode, String? modality, String? q, int? limit]) async {
    final query = buildQueryString([
      QueryParameterSpec('rank_scope', rankScope, 'form', true, false, null),
      QueryParameterSpec('vendor_code', vendorCode, 'form', true, false, null),
      QueryParameterSpec('modality', modality, 'form', true, false, null),
      QueryParameterSpec('q', q, 'form', true, false, null),
      QueryParameterSpec('limit', limit, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/ai/model_rankings'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : ModelRankingsListResult.fromJson(map);
    })();
  }

  /// List ranking vendor filters
  Future<ModelVendorsListResult?> modelVendorsList() async {
    final response = await _client.get(ApiPaths.appPath('/ai/model_vendors'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : ModelVendorsListResult.fromJson(map);
    })();
  }

  /// List models
  Future<ModelsListResult?> modelsList([String? billingMeter, String? vendorCode, List<String>? vendorCodes, List<String>? modalities, List<String>? capabilities, List<String>? categories, List<String>? groups, String? q, int? limit]) async {
    final query = buildQueryString([
      QueryParameterSpec('billing_meter', billingMeter, 'form', true, false, null),
      QueryParameterSpec('vendor_code', vendorCode, 'form', true, false, null),
      QueryParameterSpec('vendor_codes', vendorCodes, 'form', false, false, null),
      QueryParameterSpec('modalities', modalities, 'form', false, false, null),
      QueryParameterSpec('capabilities', capabilities, 'form', false, false, null),
      QueryParameterSpec('categories', categories, 'form', false, false, null),
      QueryParameterSpec('groups', groups, 'form', false, false, null),
      QueryParameterSpec('q', q, 'form', true, false, null),
      QueryParameterSpec('limit', limit, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/ai/models'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : ModelsListResult.fromJson(map);
    })();
  }

  /// List providers
  Future<ProvidersListResult?> providersList() async {
    final response = await _client.get(ApiPaths.appPath('/ai/providers'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : ProvidersListResult.fromJson(map);
    })();
  }

  /// List API keys
  Future<RoutingApiKeysListResult?> routingApiKeysList() async {
    final response = await _client.get(ApiPaths.appPath('/ai/routing/api_keys'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RoutingApiKeysListResult.fromJson(map);
    })();
  }

  /// List channels
  Future<RoutingChannelsListResult?> routingChannelsList() async {
    final response = await _client.get(ApiPaths.appPath('/ai/routing/channels'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RoutingChannelsListResult.fromJson(map);
    })();
  }

  /// Create channel
  Future<RoutingChannelsCreateResult?> routingChannelsCreate(CreateRoutingChannelRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/ai/routing/channels'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RoutingChannelsCreateResult.fromJson(map);
    })();
  }

  /// Delete channel
  Future<RoutingChannelsDeleteResult?> routingChannelsDelete(String channelId) async {
    final response = await _client.delete(ApiPaths.appPath('/ai/routing/channels/${serializePathParameter(channelId, const PathParameterSpec('channelId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RoutingChannelsDeleteResult.fromJson(map);
    })();
  }

  /// Update channel
  Future<RoutingChannelsUpdateResult?> routingChannelsUpdate(String channelId, UpdateRoutingChannelRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.put(ApiPaths.appPath('/ai/routing/channels/${serializePathParameter(channelId, const PathParameterSpec('channelId', 'simple', false))}'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RoutingChannelsUpdateResult.fromJson(map);
    })();
  }

  /// Set channel status
  Future<RoutingChannelsStatusUpdateResult?> routingChannelsStatusUpdate(String channelId, SetRoutingChannelStatusRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.put(ApiPaths.appPath('/ai/routing/channels/${serializePathParameter(channelId, const PathParameterSpec('channelId', 'simple', false))}/status'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RoutingChannelsStatusUpdateResult.fromJson(map);
    })();
  }

  /// Test channel
  Future<RoutingChannelsVerifyResult?> routingChannelsVerify(String channelId, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final response = await _client.post(ApiPaths.appPath('/ai/routing/channels/${serializePathParameter(channelId, const PathParameterSpec('channelId', 'simple', false))}/verify'), headers: requestHeaders);
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RoutingChannelsVerifyResult.fromJson(map);
    })();
  }

  /// List request traces
  Future<RoutingRequestTracesListResult?> routingRequestTracesList() async {
    final response = await _client.get(ApiPaths.appPath('/ai/routing/request_traces'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RoutingRequestTracesListResult.fromJson(map);
    })();
  }

  /// List strategy
  Future<RoutingStrategyListResult?> routingStrategyList() async {
    final response = await _client.get(ApiPaths.appPath('/ai/routing/strategy'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RoutingStrategyListResult.fromJson(map);
    })();
  }

  /// Update strategy
  Future<RoutingStrategyUpdateResult?> routingStrategyUpdate(UpdateRoutingStrategyRequest body) async {
    final payload = body.toJson();
    final response = await _client.put(ApiPaths.appPath('/ai/routing/strategy'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RoutingStrategyUpdateResult.fromJson(map);
    })();
  }

  /// List usage data
  Future<RoutingUsageListResult?> routingUsageList() async {
    final response = await _client.get(ApiPaths.appPath('/ai/routing/usage'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RoutingUsageListResult.fromJson(map);
    })();
  }

  /// List logs
  Future<UsageLogsListResult?> usageLogsList([int? page, int? pageSize, String? q, String? status, String? startTime, String? endTime]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('q', q, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('start_time', startTime, 'form', true, false, null),
      QueryParameterSpec('end_time', endTime, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/ai/usage/logs'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : UsageLogsListResult.fromJson(map);
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
