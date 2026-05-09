import { HttpClient, createHttpClient } from './http/client';
import type { SdkworkBackendConfig } from './types/common';
import type { AuthTokenManager } from '@sdkwork/sdk-common';

import { ApikeyApi, createApikeyApi } from './api/apikey';
import { AppApi, createAppApi } from './api/app';
import { ChannelApi, createChannelApi } from './api/channel';
import { CouponApi, createCouponApi } from './api/coupon';
import { DashboardApi, createDashboardApi } from './api/dashboard';
import { FinanceApi, createFinanceApi } from './api/finance';
import { ModelApi, createModelApi } from './api/model';
import { ProviderSecretApi, createProviderSecretApi } from './api/provider-secret';
import { RecordApi, createRecordApi } from './api/record';
import { RouterApi, createRouterApi } from './api/router';
import { SkillApi, createSkillApi } from './api/skill';
import { SystemApi, createSystemApi } from './api/system';
import { UserApi, createUserApi } from './api/user';
import { VipApi, createVipApi } from './api/vip';

export class SdkworkBackendClient {
  private httpClient: HttpClient;

  public readonly apikey: ApikeyApi;
  public readonly app: AppApi;
  public readonly channel: ChannelApi;
  public readonly coupon: CouponApi;
  public readonly dashboard: DashboardApi;
  public readonly finance: FinanceApi;
  public readonly model: ModelApi;
  public readonly providerSecret: ProviderSecretApi;
  public readonly record: RecordApi;
  public readonly router: RouterApi;
  public readonly skill: SkillApi;
  public readonly system: SystemApi;
  public readonly user: UserApi;
  public readonly vip: VipApi;

  constructor(config: SdkworkBackendConfig) {
    this.httpClient = createHttpClient(config);
    this.apikey = createApikeyApi(this.httpClient);

    this.app = createAppApi(this.httpClient);

    this.channel = createChannelApi(this.httpClient);

    this.coupon = createCouponApi(this.httpClient);

    this.dashboard = createDashboardApi(this.httpClient);

    this.finance = createFinanceApi(this.httpClient);

    this.model = createModelApi(this.httpClient);

    this.providerSecret = createProviderSecretApi(this.httpClient);

    this.record = createRecordApi(this.httpClient);

    this.router = createRouterApi(this.httpClient);

    this.skill = createSkillApi(this.httpClient);

    this.system = createSystemApi(this.httpClient);

    this.user = createUserApi(this.httpClient);

    this.vip = createVipApi(this.httpClient);
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
