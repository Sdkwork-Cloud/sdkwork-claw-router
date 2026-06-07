import 'package:sdkwork_common_flutter/sdkwork_common_flutter.dart';
import 'src/http/client.dart';
import 'src/api/agents.dart';
import 'src/api/ai.dart';
import 'src/api/commerce.dart';
import 'src/api/content.dart';
import 'src/api/ecosystem.dart';
import 'src/api/iam.dart';
import 'src/api/integration.dart';
import 'src/api/mcp.dart';
import 'src/api/messaging.dart';
import 'src/api/open_platform.dart';
import 'src/api/platform.dart';
import 'src/api/system.dart';
import 'src/api/prompts.dart';
import 'src/api/service_providers.dart';
import 'src/api/sites.dart';
import 'src/api/storage.dart';

class SdkworkBackendClient {
  final HttpClient _httpClient;

  late final AgentsApi agents;
  late final AiApi ai;
  late final CommerceApi commerce;
  late final ContentApi content;
  late final EcosystemApi ecosystem;
  late final IamApi iam;
  late final IntegrationApi integration;
  late final McpApi mcp;
  late final MessagingApi messaging;
  late final OpenPlatformApi openPlatform;
  late final PlatformApi platform;
  late final SystemApi system;
  late final PromptsApi prompts;
  late final ServiceProvidersApi serviceProviders;
  late final SitesApi sites;
  late final StorageApi storage;

  SdkworkBackendClient({
    required SdkConfig config,
  }) : _httpClient = HttpClient(config: config) {
    agents = AgentsApi(_httpClient);
    ai = AiApi(_httpClient);
    commerce = CommerceApi(_httpClient);
    content = ContentApi(_httpClient);
    ecosystem = EcosystemApi(_httpClient);
    iam = IamApi(_httpClient);
    integration = IntegrationApi(_httpClient);
    mcp = McpApi(_httpClient);
    messaging = MessagingApi(_httpClient);
    openPlatform = OpenPlatformApi(_httpClient);
    platform = PlatformApi(_httpClient);
    system = SystemApi(_httpClient);
    prompts = PromptsApi(_httpClient);
    serviceProviders = ServiceProvidersApi(_httpClient);
    sites = SitesApi(_httpClient);
    storage = StorageApi(_httpClient);
  }

  factory SdkworkBackendClient.withBaseUrl({
    required String baseUrl,
    String? authToken,
    String? accessToken,
    Map<String, String>? headers,
    int timeout = 30000,
  }) {
    return SdkworkBackendClient(
      config: SdkConfig(
        baseUrl: baseUrl,
        timeout: timeout,
        headers: headers ?? const {},
        authToken: authToken,
        accessToken: accessToken,
      ),
    );
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
