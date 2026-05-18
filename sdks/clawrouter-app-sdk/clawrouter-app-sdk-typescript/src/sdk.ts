import { HttpClient, createHttpClient } from './http/client';
import type { SdkworkAppConfig } from './types/common';
import type { AuthTokenManager } from '@sdkwork/sdk-common';

import { AgentsApi, createAgentsApi } from './api/agents';
import { AiApi, createAiApi } from './api/ai';
import { AuthApi, createAuthApi } from './api/auth';
import { BillingApi, createBillingApi } from './api/billing';
import { CommunicationApi, createCommunicationApi } from './api/communication';
import { ContentApi, createContentApi } from './api/content';
import { EcosystemApi, createEcosystemApi } from './api/ecosystem';
import { IamApi, createIamApi } from './api/iam';
import { PlatformApi, createPlatformApi } from './api/platform';

export class SdkworkAppClient {
  private httpClient: HttpClient;

  public readonly agents: AgentsApi;
  public readonly ai: AiApi;
  public readonly auth: AuthApi;
  public readonly billing: BillingApi;
  public readonly communication: CommunicationApi;
  public readonly content: ContentApi;
  public readonly ecosystem: EcosystemApi;
  public readonly iam: IamApi;
  public readonly platform: PlatformApi;

  constructor(config: SdkworkAppConfig) {
    this.httpClient = createHttpClient(config);
    this.agents = createAgentsApi(this.httpClient);

    this.ai = createAiApi(this.httpClient);

    this.auth = createAuthApi(this.httpClient);

    this.billing = createBillingApi(this.httpClient);

    this.communication = createCommunicationApi(this.httpClient);

    this.content = createContentApi(this.httpClient);

    this.ecosystem = createEcosystemApi(this.httpClient);

    this.iam = createIamApi(this.httpClient);

    this.platform = createPlatformApi(this.httpClient);
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

export function createClient(config: SdkworkAppConfig): SdkworkAppClient {
  return new SdkworkAppClient(config);
}

export default SdkworkAppClient;
