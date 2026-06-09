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

  /// Create IAM registration
  Future<RegistrationsCreateResult?> registrationsCreate(IamRegistrationCreateRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/auth/registrations'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RegistrationsCreateResult.fromJson(map);
    })();
  }

  /// Create IAM session
  Future<SessionsCreateResult?> sessionsCreate(IamSessionCreateRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/auth/sessions'), body: payload, contentType: 'application/json');
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
