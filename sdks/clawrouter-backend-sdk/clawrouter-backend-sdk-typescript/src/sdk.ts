import { HttpClient, createHttpClient } from './http/client';
import type { SdkworkBackendConfig } from './types/common';
import type { AuthTokenManager } from '@sdkwork/sdk-common';

import { AgentsApi, createAgentsApi } from './api/agents';
import { AiApi, createAiApi } from './api/ai';
import { ContentApi, createContentApi } from './api/content';
import { EcosystemApi, createEcosystemApi } from './api/ecosystem';
import { IamApi, createIamApi } from './api/iam';
import { IntegrationApi, createIntegrationApi } from './api/integration';
import { CommerceApi, createCommerceApi } from './api/commerce';
import { McpApi, createMcpApi } from './api/mcp';
import { MessagingApi, createMessagingApi } from './api/messaging';
import { PlatformApi, createPlatformApi } from './api/platform';
import { PromptsApi, createPromptsApi } from './api/prompts';
import { ServiceProvidersApi, createServiceProvidersApi } from './api/service-providers';
import { SitesApi, createSitesApi } from './api/sites';
import { OssApi, createOssApi } from './api/oss';
import { SystemApi, createSystemApi } from './api/system';

export class SdkworkBackendClient {
  private httpClient: HttpClient;

  public readonly agents: AgentsApi;
  public readonly ai: AiApi;
  public readonly content: ContentApi;
  public readonly ecosystem: EcosystemApi;
  public readonly iam: IamApi;
  public readonly integration: IntegrationApi;
  public readonly commerce: CommerceApi;
  public readonly mcp: McpApi;
  public readonly messaging: MessagingApi;
  public readonly platform: PlatformApi;
  public readonly prompts: PromptsApi;
  public readonly serviceProviders: ServiceProvidersApi;
  public readonly sites: SitesApi;
  public readonly oss: OssApi;
  public readonly system: SystemApi;

  constructor(config: SdkworkBackendConfig) {
    this.httpClient = createHttpClient(config);
    this.agents = createAgentsApi(this.httpClient);

    this.ai = createAiApi(this.httpClient);

    this.content = createContentApi(this.httpClient);

    this.ecosystem = createEcosystemApi(this.httpClient);

    this.iam = createIamApi(this.httpClient);

    this.integration = createIntegrationApi(this.httpClient);

    this.commerce = createCommerceApi(this.httpClient);

    this.mcp = createMcpApi(this.httpClient);

    this.messaging = createMessagingApi(this.httpClient);

    this.platform = createPlatformApi(this.httpClient);

    this.prompts = createPromptsApi(this.httpClient);

    this.serviceProviders = createServiceProvidersApi(this.httpClient);

    this.sites = createSitesApi(this.httpClient);

    this.oss = createOssApi(this.httpClient);

    this.system = createSystemApi(this.httpClient);
  }
  setAuthToken(token: string): this {
    this.httpClient.setAuthToken(token);
    return this;
  }

  setAccessToken(token: string): this {
    this.httpClient.setAccessToken(token);
    return this;
  }

  setTokenManager(manager: AuthTokenManager): this {
    this.httpClient.setTokenManager(manager);
    return this;
  }

  get http(): HttpClient {
    return this.httpClient;
  }
}

export function createClient(config: SdkworkBackendConfig): SdkworkBackendClient {
  return new SdkworkBackendClient(config);
}

export default SdkworkBackendClient;
