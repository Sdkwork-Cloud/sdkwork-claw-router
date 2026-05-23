import { HttpClient, createHttpClient } from './http/client';
import type { SdkworkBackendConfig } from './types/common';
import type { AuthTokenManager } from '@sdkwork/sdk-common';

import { AgentsApi, createAgentsApi } from './api/agents';
import { AiApi, createAiApi } from './api/ai';
import { CommerceApi, createCommerceApi } from './api/commerce';
import { ContentApi, createContentApi } from './api/content';
import { EcosystemApi, createEcosystemApi } from './api/ecosystem';
import { IamApi, createIamApi } from './api/iam';
import { IntegrationApi, createIntegrationApi } from './api/integration';
import { OpenPlatformApi, createOpenPlatformApi } from './api/open-platform';
import { PlatformApi, createPlatformApi } from './api/platform';
import { SystemApi, createSystemApi } from './api/system';

export class SdkworkBackendClient {
  private httpClient: HttpClient;

  public readonly agents: AgentsApi;
  public readonly ai: AiApi;
  public readonly commerce: CommerceApi;
  public readonly content: ContentApi;
  public readonly ecosystem: EcosystemApi;
  public readonly iam: IamApi;
  public readonly integration: IntegrationApi;
  public readonly openPlatform: OpenPlatformApi;
  public readonly platform: PlatformApi;
  public readonly system: SystemApi;

  constructor(config: SdkworkBackendConfig) {
    this.httpClient = createHttpClient(config);
    this.agents = createAgentsApi(this.httpClient);

    this.ai = createAiApi(this.httpClient);

    this.commerce = createCommerceApi(this.httpClient);

    this.content = createContentApi(this.httpClient);

    this.ecosystem = createEcosystemApi(this.httpClient);

    this.iam = createIamApi(this.httpClient);

    this.integration = createIntegrationApi(this.httpClient);

    this.openPlatform = createOpenPlatformApi(this.httpClient);

    this.platform = createPlatformApi(this.httpClient);

    this.system = createSystemApi(this.httpClient);
  }

  setApiKey(apiKey: string): this {
    this.httpClient.setApiKey(apiKey);
    return this;
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
