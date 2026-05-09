import { HttpClient, createHttpClient } from './http/client';
import type { SdkworkAppConfig } from './types/common';
import type { AuthTokenManager } from '@sdkwork/sdk-common';

import { AccountApi, createAccountApi } from './api/account';
import { AppApi, createAppApi } from './api/app';
import { AuthApi, createAuthApi } from './api/auth';
import { CommentApi, createCommentApi } from './api/comment';
import { CouponApi, createCouponApi } from './api/coupon';
import { FeedApi, createFeedApi } from './api/feed';
import { NotificationApi, createNotificationApi } from './api/notification';
import { PaymentApi, createPaymentApi } from './api/payment';
import { PlaygroundApi, createPlaygroundApi } from './api/playground';
import { RouterApi, createRouterApi } from './api/router';
import { SkillApi, createSkillApi } from './api/skill';
import { UserApi, createUserApi } from './api/user';
import { VipApi, createVipApi } from './api/vip';

export class SdkworkAppClient {
  private httpClient: HttpClient;

  public readonly account: AccountApi;
  public readonly app: AppApi;
  public readonly auth: AuthApi;
  public readonly comment: CommentApi;
  public readonly coupon: CouponApi;
  public readonly feed: FeedApi;
  public readonly notification: NotificationApi;
  public readonly payment: PaymentApi;
  public readonly playground: PlaygroundApi;
  public readonly router: RouterApi;
  public readonly skill: SkillApi;
  public readonly user: UserApi;
  public readonly vip: VipApi;

  constructor(config: SdkworkAppConfig) {
    this.httpClient = createHttpClient(config);
    this.account = createAccountApi(this.httpClient);

    this.app = createAppApi(this.httpClient);

    this.auth = createAuthApi(this.httpClient);

    this.comment = createCommentApi(this.httpClient);

    this.coupon = createCouponApi(this.httpClient);

    this.feed = createFeedApi(this.httpClient);

    this.notification = createNotificationApi(this.httpClient);

    this.payment = createPaymentApi(this.httpClient);

    this.playground = createPlaygroundApi(this.httpClient);

    this.router = createRouterApi(this.httpClient);

    this.skill = createSkillApi(this.httpClient);

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

export function createClient(config: SdkworkAppConfig): SdkworkAppClient {
  return new SdkworkAppClient(config);
}

export default SdkworkAppClient;
