import '../http/client.dart';
import '../models.dart';

import 'paths.dart';
import 'response_helpers.dart';


class AuthApi {
  final HttpClient _client;

  AuthApi(this._client);

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
