import 'dart:convert';
import '../http/client.dart';
import '../models.dart';

import 'paths.dart';
import 'response_helpers.dart';


class PlatformApi {
  final HttpClient _client;

  PlatformApi(this._client);

  /// List apps
  Future<AppsListResult?> appsList([String? q, String? status, String? marketStatus, String? appType, int? categoryId, int? page, int? pageSize]) async {
    final query = buildQueryString([
      QueryParameterSpec('q', q, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('market_status', marketStatus, 'form', true, false, null),
      QueryParameterSpec('app_type', appType, 'form', true, false, null),
      QueryParameterSpec('category_id', categoryId, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/platform/apps'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AppsListResult.fromJson(map);
    })();
  }

  /// Create app
  Future<AppsCreateResult?> appsCreate(AdminAppCreateRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/platform/apps'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AppsCreateResult.fromJson(map);
    })();
  }

  /// List app categories
  Future<AppsCategoriesListResult?> appsCategoriesList() async {
    final response = await _client.get(ApiPaths.backendPath('/platform/apps/categories'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AppsCategoriesListResult.fromJson(map);
    })();
  }

  /// Create app category
  Future<AppsCategoriesCreateResult?> appsCategoriesCreate(AdminAppCategoryCreateRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/platform/apps/categories'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AppsCategoriesCreateResult.fromJson(map);
    })();
  }

  /// Delete app category
  Future<AppsCategoriesDeleteResult?> appsCategoriesDelete(String categoryId) async {
    final response = await _client.delete(ApiPaths.backendPath('/platform/apps/categories/${serializePathParameter(categoryId, const PathParameterSpec('categoryId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AppsCategoriesDeleteResult.fromJson(map);
    })();
  }

  /// Update app category
  Future<AppsCategoriesUpdateResult?> appsCategoriesUpdate(String categoryId, AdminAppCategoryUpdateRequest body) async {
    final payload = body.toJson();
    final response = await _client.put(ApiPaths.backendPath('/platform/apps/categories/${serializePathParameter(categoryId, const PathParameterSpec('categoryId', 'simple', false))}'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AppsCategoriesUpdateResult.fromJson(map);
    })();
  }

  /// List app templates
  Future<AppsTemplatesListResult?> appsTemplatesList([String? q, String? publishStatus, String? templateType, String? runtime, int? categoryId, int? page, int? pageSize]) async {
    final query = buildQueryString([
      QueryParameterSpec('q', q, 'form', true, false, null),
      QueryParameterSpec('publish_status', publishStatus, 'form', true, false, null),
      QueryParameterSpec('template_type', templateType, 'form', true, false, null),
      QueryParameterSpec('runtime', runtime, 'form', true, false, null),
      QueryParameterSpec('category_id', categoryId, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/platform/apps/templates'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AppsTemplatesListResult.fromJson(map);
    })();
  }

  /// Create app template
  Future<AppsTemplatesCreateResult?> appsTemplatesCreate(AdminAppTemplateCreateRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/platform/apps/templates'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AppsTemplatesCreateResult.fromJson(map);
    })();
  }

  /// Delete app template
  Future<AppsTemplatesDeleteResult?> appsTemplatesDelete(String templateId) async {
    final response = await _client.delete(ApiPaths.backendPath('/platform/apps/templates/${serializePathParameter(templateId, const PathParameterSpec('templateId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AppsTemplatesDeleteResult.fromJson(map);
    })();
  }

  /// List app template
  Future<AppsTemplatesRetrieveResult?> appsTemplatesRetrieve(String templateId) async {
    final response = await _client.get(ApiPaths.backendPath('/platform/apps/templates/${serializePathParameter(templateId, const PathParameterSpec('templateId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AppsTemplatesRetrieveResult.fromJson(map);
    })();
  }

  /// Update app template
  Future<AppsTemplatesUpdateResult?> appsTemplatesUpdate(String templateId, AdminAppTemplateUpdateRequest body) async {
    final payload = body.toJson();
    final response = await _client.put(ApiPaths.backendPath('/platform/apps/templates/${serializePathParameter(templateId, const PathParameterSpec('templateId', 'simple', false))}'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AppsTemplatesUpdateResult.fromJson(map);
    })();
  }

  /// Publish app template
  Future<AppsTemplatesPublishResult?> appsTemplatesPublish(String templateId) async {
    final response = await _client.post(ApiPaths.backendPath('/platform/apps/templates/${serializePathParameter(templateId, const PathParameterSpec('templateId', 'simple', false))}/publish'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AppsTemplatesPublishResult.fromJson(map);
    })();
  }

  /// Offline app template
  Future<AppsTemplatesUnpublishResult?> appsTemplatesUnpublish(String templateId) async {
    final response = await _client.post(ApiPaths.backendPath('/platform/apps/templates/${serializePathParameter(templateId, const PathParameterSpec('templateId', 'simple', false))}/unpublish'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AppsTemplatesUnpublishResult.fromJson(map);
    })();
  }

  /// Delete app
  Future<AppsDeleteResult?> appsDelete(String appId) async {
    final response = await _client.delete(ApiPaths.backendPath('/platform/apps/${serializePathParameter(appId, const PathParameterSpec('appId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AppsDeleteResult.fromJson(map);
    })();
  }

  /// List app
  Future<AppsRetrieveResult?> appsRetrieve(String appId) async {
    final response = await _client.get(ApiPaths.backendPath('/platform/apps/${serializePathParameter(appId, const PathParameterSpec('appId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AppsRetrieveResult.fromJson(map);
    })();
  }

  /// Update app
  Future<AppsUpdateResult?> appsUpdate(String appId, AdminAppUpdateRequest body) async {
    final payload = body.toJson();
    final response = await _client.put(ApiPaths.backendPath('/platform/apps/${serializePathParameter(appId, const PathParameterSpec('appId', 'simple', false))}'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AppsUpdateResult.fromJson(map);
    })();
  }

  /// Disable app
  Future<AppsDisableResult?> appsDisable(String appId) async {
    final response = await _client.post(ApiPaths.backendPath('/platform/apps/${serializePathParameter(appId, const PathParameterSpec('appId', 'simple', false))}/disable'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AppsDisableResult.fromJson(map);
    })();
  }

  /// Enable app
  Future<AppsEnableResult?> appsEnable(String appId) async {
    final response = await _client.post(ApiPaths.backendPath('/platform/apps/${serializePathParameter(appId, const PathParameterSpec('appId', 'simple', false))}/enable'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AppsEnableResult.fromJson(map);
    })();
  }

  /// Publish app
  Future<AppsPublishResult?> appsPublish(String appId) async {
    final response = await _client.post(ApiPaths.backendPath('/platform/apps/${serializePathParameter(appId, const PathParameterSpec('appId', 'simple', false))}/publish'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AppsPublishResult.fromJson(map);
    })();
  }

  /// Offline app
  Future<AppsUnpublishResult?> appsUnpublish(String appId) async {
    final response = await _client.post(ApiPaths.backendPath('/platform/apps/${serializePathParameter(appId, const PathParameterSpec('appId', 'simple', false))}/unpublish'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AppsUnpublishResult.fromJson(map);
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
