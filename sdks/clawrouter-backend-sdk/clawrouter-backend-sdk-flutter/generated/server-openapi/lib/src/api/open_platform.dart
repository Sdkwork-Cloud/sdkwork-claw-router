import 'dart:convert';
import '../http/client.dart';
import '../models.dart';

import 'paths.dart';
import 'response_helpers.dart';


class OpenPlatformApi {
  final HttpClient _client;

  OpenPlatformApi(this._client);

  /// List open platform accounts
  Future<AccountsListResult?> accountsList([String? provider, String? type, String? status, int? page, int? pageSize]) async {
    final query = buildQueryString([
      QueryParameterSpec('provider', provider, 'form', true, false, null),
      QueryParameterSpec('type', type, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/open_platform/accounts'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountsListResult.fromJson(map);
    })();
  }

  /// Create open platform account
  Future<AccountsCreateResult?> accountsCreate(OpenPlatformAccountCreateRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/open_platform/accounts'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountsCreateResult.fromJson(map);
    })();
  }

  /// Delete open platform account
  Future<AccountsDeleteResult?> accountsDelete(String accountId) async {
    final response = await _client.delete(ApiPaths.backendPath('/open_platform/accounts/${serializePathParameter(accountId, const PathParameterSpec('accountId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountsDeleteResult.fromJson(map);
    })();
  }

  /// Retrieve open platform account
  Future<AccountsRetrieveResult?> accountsRetrieve(String accountId) async {
    final response = await _client.get(ApiPaths.backendPath('/open_platform/accounts/${serializePathParameter(accountId, const PathParameterSpec('accountId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountsRetrieveResult.fromJson(map);
    })();
  }

  /// Update open platform account
  Future<AccountsUpdateResult?> accountsUpdate(String accountId, OpenPlatformAccountUpdateRequest body) async {
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.backendPath('/open_platform/accounts/${serializePathParameter(accountId, const PathParameterSpec('accountId', 'simple', false))}'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountsUpdateResult.fromJson(map);
    })();
  }

  /// List open platform account entries
  Future<AccountsEntriesListResult?> accountsEntriesList(String accountId) async {
    final response = await _client.get(ApiPaths.backendPath('/open_platform/accounts/${serializePathParameter(accountId, const PathParameterSpec('accountId', 'simple', false))}/entries'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountsEntriesListResult.fromJson(map);
    })();
  }

  /// Create open platform account entry
  Future<AccountsEntriesCreateResult?> accountsEntriesCreate(String accountId, OpenPlatformEntryCreateRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/open_platform/accounts/${serializePathParameter(accountId, const PathParameterSpec('accountId', 'simple', false))}/entries'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountsEntriesCreateResult.fromJson(map);
    })();
  }

  /// Delete open platform account entry
  Future<AccountsEntriesDeleteResult?> accountsEntriesDelete(String accountId, String entryId) async {
    final response = await _client.delete(ApiPaths.backendPath('/open_platform/accounts/${serializePathParameter(accountId, const PathParameterSpec('accountId', 'simple', false))}/entries/${serializePathParameter(entryId, const PathParameterSpec('entryId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountsEntriesDeleteResult.fromJson(map);
    })();
  }

  /// Update open platform account entry
  Future<AccountsEntriesUpdateResult?> accountsEntriesUpdate(String accountId, String entryId, OpenPlatformEntryUpdateRequest body) async {
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.backendPath('/open_platform/accounts/${serializePathParameter(accountId, const PathParameterSpec('accountId', 'simple', false))}/entries/${serializePathParameter(entryId, const PathParameterSpec('entryId', 'simple', false))}'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountsEntriesUpdateResult.fromJson(map);
    })();
  }

  /// List open platform account pay bindings
  Future<AccountsPayBindingsListResult?> accountsPayBindingsList(String accountId) async {
    final response = await _client.get(ApiPaths.backendPath('/open_platform/accounts/${serializePathParameter(accountId, const PathParameterSpec('accountId', 'simple', false))}/pay_bindings'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountsPayBindingsListResult.fromJson(map);
    })();
  }

  /// Create open platform account pay binding
  Future<AccountsPayBindingsCreateResult?> accountsPayBindingsCreate(String accountId, OpenPlatformPayBindingCreateRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/open_platform/accounts/${serializePathParameter(accountId, const PathParameterSpec('accountId', 'simple', false))}/pay_bindings'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountsPayBindingsCreateResult.fromJson(map);
    })();
  }

  /// Delete open platform account pay binding
  Future<AccountsPayBindingsDeleteResult?> accountsPayBindingsDelete(String accountId, String bindingId) async {
    final response = await _client.delete(ApiPaths.backendPath('/open_platform/accounts/${serializePathParameter(accountId, const PathParameterSpec('accountId', 'simple', false))}/pay_bindings/${serializePathParameter(bindingId, const PathParameterSpec('bindingId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountsPayBindingsDeleteResult.fromJson(map);
    })();
  }

  /// List open platform manifests
  Future<ManifestsListResult?> manifestsList([String? provider, String? type]) async {
    final query = buildQueryString([
      QueryParameterSpec('provider', provider, 'form', true, false, null),
      QueryParameterSpec('type', type, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/open_platform/manifests'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : ManifestsListResult.fromJson(map);
    })();
  }

  /// List open platform providers
  Future<ProvidersListResult?> providersList([String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/open_platform/providers'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : ProvidersListResult.fromJson(map);
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
