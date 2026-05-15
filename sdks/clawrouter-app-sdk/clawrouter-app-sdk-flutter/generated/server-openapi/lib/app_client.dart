import 'package:sdkwork_common_flutter/sdkwork_common_flutter.dart';
import 'src/http/client.dart';
import 'src/api/ai.dart';
import 'src/api/auth.dart';
import 'src/api/billing.dart';
import 'src/api/communication.dart';
import 'src/api/content.dart';
import 'src/api/ecosystem.dart';
import 'src/api/iam.dart';
import 'src/api/platform.dart';

class SdkworkAppClient {
  final HttpClient _httpClient;

  late final AiApi ai;
  late final AuthApi auth;
  late final BillingApi billing;
  late final CommunicationApi communication;
  late final ContentApi content;
  late final EcosystemApi ecosystem;
  late final IamApi iam;
  late final PlatformApi platform;

  SdkworkAppClient({
    required SdkConfig config,
  }) : _httpClient = HttpClient(config: config) {
    ai = AiApi(_httpClient);
    auth = AuthApi(_httpClient);
    billing = BillingApi(_httpClient);
    communication = CommunicationApi(_httpClient);
    content = ContentApi(_httpClient);
    ecosystem = EcosystemApi(_httpClient);
    iam = IamApi(_httpClient);
    platform = PlatformApi(_httpClient);
  }

  factory SdkworkAppClient.withBaseUrl({
    required String baseUrl,
    String? apiKey,
    String? authToken,
    String? accessToken,
    String apiKeyHeader = 'Sdkwork-Access-Token',
    bool apiKeyAsBearer = false,
    Map<String, String>? headers,
    int timeout = 30000,
  }) {
    return SdkworkAppClient(
      config: SdkConfig(
        baseUrl: baseUrl,
        timeout: timeout,
        headers: headers ?? const {},
        apiKey: apiKey,
        apiKeyHeader: apiKeyHeader,
        apiKeyAsBearer: apiKeyAsBearer,
        authToken: authToken,
        accessToken: accessToken,
      ),
    );
  }

  void setApiKey(String apiKey) {
    _httpClient.setApiKey(apiKey);
  }

  void setAuthToken(String token) {
    _httpClient.setAuthToken(token);
  }

  void setAccessToken(String token) {
    _httpClient.setAccessToken(token);
  }

  void setHeader(String key, String value) {
    _httpClient.setHeader(key, value);
  }
}
