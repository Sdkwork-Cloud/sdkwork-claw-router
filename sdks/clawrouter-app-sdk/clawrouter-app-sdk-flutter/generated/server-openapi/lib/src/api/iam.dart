import 'dart:convert';
import '../http/client.dart';
import '../models.dart';

import 'paths.dart';
import 'response_helpers.dart';


class IamApi {
  final HttpClient _client;

  IamApi(this._client);

  /// List keys
  Future<ApiKeysListResult?> apiKeysList() async {
    final response = await _client.get(ApiPaths.appPath('/iam/api_keys'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : ApiKeysListResult.fromJson(map);
    })();
  }

  /// Create key
  Future<ApiKeysCreateResult?> apiKeysCreate(CreateApiKeyRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/iam/api_keys'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : ApiKeysCreateResult.fromJson(map);
    })();
  }

  /// Retrieve current IAM user
  Future<UsersCurrentRetrieveResult?> usersCurrentRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/iam/users/current'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : UsersCurrentRetrieveResult.fromJson(map);
    })();
  }

  /// List settings
  Future<UsersSettingsRetrieveResult?> usersSettingsRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/iam/users/settings'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : UsersSettingsRetrieveResult.fromJson(map);
    })();
  }

  /// Update settings
  Future<UsersSettingsUpdateResult?> usersSettingsUpdate(UpdateSettingsRequest body) async {
    final payload = body.toJson();
    final response = await _client.put(ApiPaths.appPath('/iam/users/settings'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : UsersSettingsUpdateResult.fromJson(map);
    })();
  }
}



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
