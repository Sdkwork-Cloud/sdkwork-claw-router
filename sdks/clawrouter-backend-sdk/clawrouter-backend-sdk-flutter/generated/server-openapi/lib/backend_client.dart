import 'package:sdkwork_common_flutter/sdkwork_common_flutter.dart';
import 'src/http/client.dart';
import 'src/api/ai.dart';
import 'src/api/billing.dart';
import 'src/api/content.dart';
import 'src/api/ecosystem.dart';
import 'src/api/iam.dart';
import 'src/api/integration.dart';
import 'src/api/platform.dart';
import 'src/api/system.dart';

class SdkworkBackendClient {
  final HttpClient _httpClient;

  late final AiApi ai;
  late final BillingApi billing;
  late final ContentApi content;
  late final EcosystemApi ecosystem;
  late final IamApi iam;
  late final IntegrationApi integration;
  late final PlatformApi platform;
  late final SystemApi system;

  SdkworkBackendClient({
    required SdkConfig config,
  }) : _httpClient = HttpClient(config: config) {
    ai = AiApi(_httpClient);
    billing = BillingApi(_httpClient);
    content = ContentApi(_httpClient);
    ecosystem = EcosystemApi(_httpClient);
    iam = IamApi(_httpClient);
    integration = IntegrationApi(_httpClient);
    platform = PlatformApi(_httpClient);
    system = SystemApi(_httpClient);
  }

  factory SdkworkBackendClient.withBaseUrl({
    required String baseUrl,
    String? apiKey,
    String? authToken,
    String? accessToken,
    String apiKeyHeader = 'Sdkwork-Access-Token',
    bool apiKeyAsBearer = false,
    Map<String, String>? headers,
    int timeout = 30000,
  }) {
    return SdkworkBackendClient(
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
