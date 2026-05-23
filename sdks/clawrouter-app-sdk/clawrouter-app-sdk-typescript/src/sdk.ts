import { HttpClient, createHttpClient } from './http/client';
import type { SdkworkAppConfig } from './types/common';
import type { AuthTokenManager } from '@sdkwork/sdk-common';

import { CommerceApi, createCommerceApi } from './api/commerce';
import { AgentsApi, createAgentsApi } from './api/agents';
import { AiApi, createAiApi } from './api/ai';
import { AuthApi, createAuthApi } from './api/auth';
import { ChatApi, createChatApi } from './api/chat';
import { ContentApi, createContentApi } from './api/content';
import { EcosystemApi, createEcosystemApi } from './api/ecosystem';
import { IamApi, createIamApi } from './api/iam';
import { MemoryApi, createMemoryApi } from './api/memory';
import { NotificationApi, createNotificationApi } from './api/notification';
import { OpenPlatformApi, createOpenPlatformApi } from './api/open-platform';
import { PlatformApi, createPlatformApi } from './api/platform';
import { RuntimeApi, createRuntimeApi } from './api/runtime';
import { SdkReferenceApi, createSdkReferenceApi } from './api/sdk-reference';
import { SystemApi, createSystemApi } from './api/system';

export class SdkworkAppClient {
  private httpClient: HttpClient;

  public readonly commerce: CommerceApi;
  public readonly agents: AgentsApi;
  public readonly ai: AiApi;
  public readonly auth: AuthApi;
  public readonly chat: ChatApi;
  public readonly content: ContentApi;
  public readonly ecosystem: EcosystemApi;
  public readonly iam: IamApi;
  public readonly memory: MemoryApi;
  public readonly notification: NotificationApi;
  public readonly openPlatform: OpenPlatformApi;
  public readonly platform: PlatformApi;
  public readonly runtime: RuntimeApi;
  public readonly sdkReference: SdkReferenceApi;
  public readonly system: SystemApi;

  constructor(config: SdkworkAppConfig) {
    this.httpClient = createHttpClient(config);
    this.commerce = createCommerceApi(this.httpClient);

    this.agents = createAgentsApi(this.httpClient);

    this.ai = createAiApi(this.httpClient);

    this.auth = createAuthApi(this.httpClient);

    this.chat = createChatApi(this.httpClient);

    this.content = createContentApi(this.httpClient);

    this.ecosystem = createEcosystemApi(this.httpClient);

    this.iam = createIamApi(this.httpClient);

    this.memory = createMemoryApi(this.httpClient);

    this.notification = createNotificationApi(this.httpClient);

    this.openPlatform = createOpenPlatformApi(this.httpClient);

    this.platform = createPlatformApi(this.httpClient);

    this.runtime = createRuntimeApi(this.httpClient);

    this.sdkReference = createSdkReferenceApi(this.httpClient);

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

export function createClient(config: SdkworkAppConfig): SdkworkAppClient {
  return new SdkworkAppClient(config);
}

export default SdkworkAppClient;
