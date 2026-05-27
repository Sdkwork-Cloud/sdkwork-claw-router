import 'package:sdkwork_common_flutter/sdkwork_common_flutter.dart';
import 'src/http/client.dart';
import 'src/api/commerce.dart';
import 'src/api/agents.dart';
import 'src/api/ai.dart';
import 'src/api/auth.dart';
import 'src/api/chat.dart';
import 'src/api/content.dart';
import 'src/api/ecosystem.dart';
import 'src/api/iam.dart';
import 'src/api/memory.dart';
import 'src/api/notification.dart';
import 'src/api/open_platform.dart';
import 'src/api/platform.dart';
import 'src/api/system.dart';
import 'src/api/runtime.dart';
import 'src/api/sdk_reference.dart';

class SdkworkAppClient {
  final HttpClient _httpClient;

  late final CommerceApi commerce;
  late final AgentsApi agents;
  late final AiApi ai;
  late final AuthApi auth;
  late final ChatApi chat;
  late final ContentApi content;
  late final EcosystemApi ecosystem;
  late final IamApi iam;
  late final MemoryApi memory;
  late final NotificationApi notification;
  late final OpenPlatformApi openPlatform;
  late final PlatformApi platform;
  late final SystemApi system;
  late final RuntimeApi runtime;
  late final SdkReferenceApi sdkReference;

  SdkworkAppClient({
    required SdkConfig config,
  }) : _httpClient = HttpClient(config: config) {
    commerce = CommerceApi(_httpClient);
    agents = AgentsApi(_httpClient);
    ai = AiApi(_httpClient);
    auth = AuthApi(_httpClient);
    chat = ChatApi(_httpClient);
    content = ContentApi(_httpClient);
    ecosystem = EcosystemApi(_httpClient);
    iam = IamApi(_httpClient);
    memory = MemoryApi(_httpClient);
    notification = NotificationApi(_httpClient);
    openPlatform = OpenPlatformApi(_httpClient);
    platform = PlatformApi(_httpClient);
    system = SystemApi(_httpClient);
    runtime = RuntimeApi(_httpClient);
    sdkReference = SdkReferenceApi(_httpClient);
  }

  factory SdkworkAppClient.withBaseUrl({
    required String baseUrl,
    String? apiKey,
    String? authToken,
    String? accessToken,
    String apiKeyHeader = 'Access-Token',
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
