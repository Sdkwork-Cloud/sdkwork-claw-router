import { HttpClient, createHttpClient } from './http/client';
import type { SdkworkBackendConfig } from './types/common';
import type { AuthTokenManager } from '@sdkwork/sdk-common';

import { AiApi, createAiApi } from './api/ai';
import { IamApi, createIamApi } from './api/iam';
import { IntegrationApi, createIntegrationApi } from './api/integration';
import { McpApi, createMcpApi } from './api/mcp';
import { PromptsApi, createPromptsApi } from './api/prompts';
import { ServiceProvidersApi, createServiceProvidersApi } from './api/service-providers';
import { SitesApi, createSitesApi } from './api/sites';
import { SystemApi, createSystemApi } from './api/system';

export class SdkworkBackendClient {
  private httpClient: HttpClient;

  public readonly ai: AiApi;
  public readonly iam: IamApi;
  public readonly integration: IntegrationApi;
  public readonly mcp: McpApi;
  public readonly prompts: PromptsApi;
  public readonly serviceProviders: ServiceProvidersApi;
  public readonly sites: SitesApi;
  public readonly system: SystemApi;

  constructor(config: SdkworkBackendConfig) {
    this.httpClient = createHttpClient(config);
    this.ai = createAiApi(this.httpClient);

    this.iam = createIamApi(this.httpClient);

    this.integration = createIntegrationApi(this.httpClient);

    this.mcp = createMcpApi(this.httpClient);

    this.prompts = createPromptsApi(this.httpClient);

    this.serviceProviders = createServiceProvidersApi(this.httpClient);

    this.sites = createSitesApi(this.httpClient);

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
