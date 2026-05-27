/** Open platform account create request schema exposed by Claw Router. */
export interface OpenPlatformAccountCreateRequest {
  /** App id field on open platform account create request. */
  appId?: string | null;
  /** App secret field on open platform account create request. */
  appSecret?: string | null;
  /** Encoding aes key field on open platform account create request. */
  encodingAesKey?: string | null;
  /** Key field on open platform account create request. */
  key: string;
  /** Name field on open platform account create request. */
  name: string;
  /** Provider field on open platform account create request. */
  provider: 'wechat' | 'alipay' | 'douyin' | 'baidu' | 'kuaishou' | 'feishu';
  /** Token field on open platform account create request. */
  token?: string | null;
  /** Type field on open platform account create request. */
  type: 'official_account' | 'mini_app' | 'life_account' | 'bot';
}
