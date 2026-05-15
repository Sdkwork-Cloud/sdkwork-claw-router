import 'dart:convert';
import '../http/client.dart';
import '../models.dart';

import 'paths.dart';
import 'response_helpers.dart';


class EcosystemApi {
  final HttpClient _client;

  EcosystemApi(this._client);

  /// List skills
  Future<SkillsListResult?> skillsList([String? q, String? marketStatus, String? reviewStatus, String? visibility, bool? enabled, String? categoryId, int? page, int? pageSize]) async {
    final query = buildQueryString([
      QueryParameterSpec('q', q, 'form', true, false, null),
      QueryParameterSpec('market_status', marketStatus, 'form', true, false, null),
      QueryParameterSpec('review_status', reviewStatus, 'form', true, false, null),
      QueryParameterSpec('visibility', visibility, 'form', true, false, null),
      QueryParameterSpec('enabled', enabled, 'form', true, false, null),
      QueryParameterSpec('category_id', categoryId, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/ecosystem/skills'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsListResult.fromJson(map);
    })();
  }

  /// Create skill
  Future<SkillsCreateResult?> skillsCreate(AdminSkillCreateRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/ecosystem/skills'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsCreateResult.fromJson(map);
    })();
  }

  /// List skill categories
  Future<SkillsCategoriesListResult?> skillsCategoriesList() async {
    final response = await _client.get(ApiPaths.backendPath('/ecosystem/skills/categories'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsCategoriesListResult.fromJson(map);
    })();
  }

  /// Create skill category
  Future<SkillsCategoriesCreateResult?> skillsCategoriesCreate(AdminSkillCategoryCreateRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/ecosystem/skills/categories'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsCategoriesCreateResult.fromJson(map);
    })();
  }

  /// List skill packages
  Future<SkillsPackageListResult?> skillsPackageList([String? q, bool? enabled, String? categoryId, int? page, int? pageSize]) async {
    final query = buildQueryString([
      QueryParameterSpec('q', q, 'form', true, false, null),
      QueryParameterSpec('enabled', enabled, 'form', true, false, null),
      QueryParameterSpec('category_id', categoryId, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/ecosystem/skills/package'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsPackageListResult.fromJson(map);
    })();
  }

  /// Create skill package
  Future<SkillsPackageCreateResult?> skillsPackageCreate(AdminSkillPackageCreateRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/ecosystem/skills/package'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsPackageCreateResult.fromJson(map);
    })();
  }

  /// Delete skill package
  Future<SkillsPackageDeleteResult?> skillsPackageDelete(String packageId) async {
    final response = await _client.delete(ApiPaths.backendPath('/ecosystem/skills/package/${serializePathParameter(packageId, const PathParameterSpec('packageId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsPackageDeleteResult.fromJson(map);
    })();
  }

  /// Get skill package
  Future<SkillsPackageRetrieveResult?> skillsPackageRetrieve(String packageId) async {
    final response = await _client.get(ApiPaths.backendPath('/ecosystem/skills/package/${serializePathParameter(packageId, const PathParameterSpec('packageId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsPackageRetrieveResult.fromJson(map);
    })();
  }

  /// Update skill package
  Future<SkillsPackageUpdateResult?> skillsPackageUpdate(String packageId, AdminSkillPackageUpdateRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.put(ApiPaths.backendPath('/ecosystem/skills/package/${serializePathParameter(packageId, const PathParameterSpec('packageId', 'simple', false))}'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsPackageUpdateResult.fromJson(map);
    })();
  }

  /// Disable skill package
  Future<SkillsPackageDisableResult?> skillsPackageDisable(String packageId, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final response = await _client.post(ApiPaths.backendPath('/ecosystem/skills/package/${serializePathParameter(packageId, const PathParameterSpec('packageId', 'simple', false))}/disable'), headers: requestHeaders);
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsPackageDisableResult.fromJson(map);
    })();
  }

  /// Enable skill package
  Future<SkillsPackageEnableResult?> skillsPackageEnable(String packageId, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final response = await _client.post(ApiPaths.backendPath('/ecosystem/skills/package/${serializePathParameter(packageId, const PathParameterSpec('packageId', 'simple', false))}/enable'), headers: requestHeaders);
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsPackageEnableResult.fromJson(map);
    })();
  }

  /// Delete skill
  Future<SkillsDeleteResult?> skillsDelete(String skillId) async {
    final response = await _client.delete(ApiPaths.backendPath('/ecosystem/skills/${serializePathParameter(skillId, const PathParameterSpec('skillId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsDeleteResult.fromJson(map);
    })();
  }

  /// Get skill
  Future<SkillsRetrieveResult?> skillsRetrieve(String skillId) async {
    final response = await _client.get(ApiPaths.backendPath('/ecosystem/skills/${serializePathParameter(skillId, const PathParameterSpec('skillId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsRetrieveResult.fromJson(map);
    })();
  }

  /// Update skill
  Future<SkillsUpdateResult?> skillsUpdate(String skillId, AdminSkillUpdateRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.put(ApiPaths.backendPath('/ecosystem/skills/${serializePathParameter(skillId, const PathParameterSpec('skillId', 'simple', false))}'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsUpdateResult.fromJson(map);
    })();
  }

  /// List skill artifacts
  Future<SkillsArtifactsListResult?> skillsArtifactsList(String skillId) async {
    final response = await _client.get(ApiPaths.backendPath('/ecosystem/skills/${serializePathParameter(skillId, const PathParameterSpec('skillId', 'simple', false))}/artifacts'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsArtifactsListResult.fromJson(map);
    })();
  }

  /// Create skill artifact
  Future<SkillsArtifactsCreateResult?> skillsArtifactsCreate(String skillId, AdminSkillArtifactCreateRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/ecosystem/skills/${serializePathParameter(skillId, const PathParameterSpec('skillId', 'simple', false))}/artifacts'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsArtifactsCreateResult.fromJson(map);
    })();
  }

  /// Delete skill artifact
  Future<SkillsArtifactsDeleteResult?> skillsArtifactsDelete(String skillId, String artifactId, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final response = await _client.delete(ApiPaths.backendPath('/ecosystem/skills/${serializePathParameter(skillId, const PathParameterSpec('skillId', 'simple', false))}/artifacts/${serializePathParameter(artifactId, const PathParameterSpec('artifactId', 'simple', false))}'), headers: requestHeaders);
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsArtifactsDeleteResult.fromJson(map);
    })();
  }

  /// Get skill artifact
  Future<SkillsArtifactsRetrieveResult?> skillsArtifactsRetrieve(String skillId, String artifactId) async {
    final response = await _client.get(ApiPaths.backendPath('/ecosystem/skills/${serializePathParameter(skillId, const PathParameterSpec('skillId', 'simple', false))}/artifacts/${serializePathParameter(artifactId, const PathParameterSpec('artifactId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsArtifactsRetrieveResult.fromJson(map);
    })();
  }

  /// Update skill artifact
  Future<SkillsArtifactsUpdateResult?> skillsArtifactsUpdate(String skillId, String artifactId, AdminSkillArtifactUpdateRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.put(ApiPaths.backendPath('/ecosystem/skills/${serializePathParameter(skillId, const PathParameterSpec('skillId', 'simple', false))}/artifacts/${serializePathParameter(artifactId, const PathParameterSpec('artifactId', 'simple', false))}'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsArtifactsUpdateResult.fromJson(map);
    })();
  }

  /// List skill assets
  Future<SkillsAssetsListResult?> skillsAssetsList(String skillId) async {
    final response = await _client.get(ApiPaths.backendPath('/ecosystem/skills/${serializePathParameter(skillId, const PathParameterSpec('skillId', 'simple', false))}/assets'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsAssetsListResult.fromJson(map);
    })();
  }

  /// Create skill asset
  Future<SkillsAssetsCreateResult?> skillsAssetsCreate(String skillId, AdminSkillAssetCreateRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/ecosystem/skills/${serializePathParameter(skillId, const PathParameterSpec('skillId', 'simple', false))}/assets'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsAssetsCreateResult.fromJson(map);
    })();
  }

  /// Delete skill asset
  Future<SkillsAssetsDeleteResult?> skillsAssetsDelete(String skillId, String assetId, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final response = await _client.delete(ApiPaths.backendPath('/ecosystem/skills/${serializePathParameter(skillId, const PathParameterSpec('skillId', 'simple', false))}/assets/${serializePathParameter(assetId, const PathParameterSpec('assetId', 'simple', false))}'), headers: requestHeaders);
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsAssetsDeleteResult.fromJson(map);
    })();
  }

  /// Get skill asset
  Future<SkillsAssetsRetrieveResult?> skillsAssetsRetrieve(String skillId, String assetId) async {
    final response = await _client.get(ApiPaths.backendPath('/ecosystem/skills/${serializePathParameter(skillId, const PathParameterSpec('skillId', 'simple', false))}/assets/${serializePathParameter(assetId, const PathParameterSpec('assetId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsAssetsRetrieveResult.fromJson(map);
    })();
  }

  /// Update skill asset
  Future<SkillsAssetsUpdateResult?> skillsAssetsUpdate(String skillId, String assetId, AdminSkillAssetUpdateRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.put(ApiPaths.backendPath('/ecosystem/skills/${serializePathParameter(skillId, const PathParameterSpec('skillId', 'simple', false))}/assets/${serializePathParameter(assetId, const PathParameterSpec('assetId', 'simple', false))}'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsAssetsUpdateResult.fromJson(map);
    })();
  }

  /// Disable skill
  Future<SkillsDisableResult?> skillsDisable(String skillId, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final response = await _client.post(ApiPaths.backendPath('/ecosystem/skills/${serializePathParameter(skillId, const PathParameterSpec('skillId', 'simple', false))}/disable'), headers: requestHeaders);
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsDisableResult.fromJson(map);
    })();
  }

  /// Enable skill
  Future<SkillsEnableResult?> skillsEnable(String skillId, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final response = await _client.post(ApiPaths.backendPath('/ecosystem/skills/${serializePathParameter(skillId, const PathParameterSpec('skillId', 'simple', false))}/enable'), headers: requestHeaders);
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsEnableResult.fromJson(map);
    })();
  }

  /// Publish skill
  Future<SkillsPublishResult?> skillsPublish(String skillId, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final response = await _client.post(ApiPaths.backendPath('/ecosystem/skills/${serializePathParameter(skillId, const PathParameterSpec('skillId', 'simple', false))}/publish'), headers: requestHeaders);
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsPublishResult.fromJson(map);
    })();
  }

  /// Approve skill
  Future<SkillsReviewApproveResult?> skillsReviewApprove(String skillId, AdminSkillReviewRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/ecosystem/skills/${serializePathParameter(skillId, const PathParameterSpec('skillId', 'simple', false))}/review/approve'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsReviewApproveResult.fromJson(map);
    })();
  }

  /// Reject skill
  Future<SkillsReviewRejectResult?> skillsReviewReject(String skillId, AdminSkillReviewRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/ecosystem/skills/${serializePathParameter(skillId, const PathParameterSpec('skillId', 'simple', false))}/review/reject'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsReviewRejectResult.fromJson(map);
    })();
  }

  /// Offline skill
  Future<SkillsUnpublishResult?> skillsUnpublish(String skillId, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final response = await _client.post(ApiPaths.backendPath('/ecosystem/skills/${serializePathParameter(skillId, const PathParameterSpec('skillId', 'simple', false))}/unpublish'), headers: requestHeaders);
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SkillsUnpublishResult.fromJson(map);
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
