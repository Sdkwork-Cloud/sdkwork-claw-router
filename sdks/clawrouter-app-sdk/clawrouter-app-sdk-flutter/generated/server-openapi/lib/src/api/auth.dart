import 'dart:convert';
import '../http/client.dart';
import '../models.dart';

import 'paths.dart';
import 'response_helpers.dart';


class AuthApi {
  final HttpClient _client;

  AuthApi(this._client);

  /// Retrieve OAuth authorization URL
  Future<OauthAuthorizationUrlsRetrieveResult?> oauthAuthorizationUrlsRetrieve(String provider, String redirectUri, [String? state, String? scope]) async {
    final query = buildQueryString([
      QueryParameterSpec('provider', provider, 'form', true, false, null),
      QueryParameterSpec('redirect_uri', redirectUri, 'form', true, false, null),
      QueryParameterSpec('state', state, 'form', true, false, null),
      QueryParameterSpec('scope', scope, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/auth/oauth_authorization_urls'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : OauthAuthorizationUrlsRetrieveResult.fromJson(map);
    })();
  }

  /// Create OAuth IAM session
  Future<OauthSessionsCreateResult?> oauthSessionsCreate(IamOauthSessionCreateRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/auth/oauth_sessions'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : OauthSessionsCreateResult.fromJson(map);
    })();
  }

  /// Create password reset request
  Future<PasswordResetRequestsCreateResult?> passwordResetRequestsCreate(IamPasswordResetRequestCreateRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/auth/password_reset_requests'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PasswordResetRequestsCreateResult.fromJson(map);
    })();
  }

  /// Create password reset
  Future<PasswordResetsCreateResult?> passwordResetsCreate(IamPasswordResetCreateRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/auth/password_resets'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PasswordResetsCreateResult.fromJson(map);
    })();
  }

  /// Create QR login code
  Future<LoginQrCodesCreateResult?> loginQrCodesCreate() async {
    final response = await _client.post(ApiPaths.appPath('/auth/qr_login_codes'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : LoginQrCodesCreateResult.fromJson(map);
    })();
  }

  /// Confirm QR login code
  Future<LoginQrCodesConfirmResult?> loginQrCodesConfirm(IamLoginQrCodeConfirmRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/auth/qr_login_codes/confirm'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : LoginQrCodesConfirmResult.fromJson(map);
    })();
  }

  /// Retrieve QR login status
  Future<LoginQrCodesRetrieveResult?> loginQrCodesRetrieve(String qrKey) async {
    final response = await _client.get(ApiPaths.appPath('/auth/qr_login_codes/${serializePathParameter(qrKey, const PathParameterSpec('qrKey', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : LoginQrCodesRetrieveResult.fromJson(map);
    })();
  }

  /// Create IAM registration
  Future<RegistrationsCreateResult?> registrationsCreate(IamRegistrationCreateRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/auth/registrations'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RegistrationsCreateResult.fromJson(map);
    })();
  }

  /// Retrieve public IAM auth runtime settings
  Future<RuntimeSettingsRetrieveResult?> runtimeSettingsRetrieve([String? tenantCode, String? organizationCode]) async {
    final query = buildQueryString([
      QueryParameterSpec('tenant_code', tenantCode, 'form', true, false, null),
      QueryParameterSpec('organization_code', organizationCode, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/auth/runtime_settings'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RuntimeSettingsRetrieveResult.fromJson(map);
    })();
  }

  /// Create IAM session
  Future<SessionsCreateResult?> sessionsCreate(IamSessionCreateRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/auth/sessions'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SessionsCreateResult.fromJson(map);
    })();
  }

  /// Delete current IAM session
  Future<SessionsCurrentDeleteResult?> sessionsCurrentDelete() async {
    final response = await _client.delete(ApiPaths.appPath('/auth/sessions/current'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SessionsCurrentDeleteResult.fromJson(map);
    })();
  }

  /// Retrieve current IAM session
  Future<SessionsCurrentRetrieveResult?> sessionsCurrentRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/auth/sessions/current'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SessionsCurrentRetrieveResult.fromJson(map);
    })();
  }

  /// Update current IAM session
  Future<SessionsCurrentUpdateResult?> sessionsCurrentUpdate(IamCurrentSessionUpdateRequest body) async {
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.appPath('/auth/sessions/current'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SessionsCurrentUpdateResult.fromJson(map);
    })();
  }

  /// Refresh IAM session
  Future<SessionsRefreshResult?> sessionsRefresh(IamSessionRefreshRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/auth/sessions/refresh'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SessionsRefreshResult.fromJson(map);
    })();
  }

  /// Create verification code
  Future<VerificationCodesCreateResult?> verificationCodesCreate(IamVerificationCodeCreateRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/auth/verification_codes'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VerificationCodesCreateResult.fromJson(map);
    })();
  }

  /// Verify verification code
  Future<VerificationCodesVerifyResult?> verificationCodesVerify(IamVerificationCodeVerifyRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/auth/verification_codes/verify'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VerificationCodesVerifyResult.fromJson(map);
    })();
  }

  /// Retrieve public IAM verification policy
  Future<VerificationPolicyRetrieveResult?> verificationPolicyRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/auth/verification_policy'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VerificationPolicyRetrieveResult.fromJson(map);
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
