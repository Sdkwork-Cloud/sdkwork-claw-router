/** Open platform account create request schema exposed by Claw Router. */
export interface OpenPlatformAccountCreateRequest {
  /** Aes key ref field on open platform account create request. */
  aesKeyRef?: string | null;
  /** App id field on open platform account create request. */
  appId?: string | null;
  /** Key field on open platform account create request. */
  key: string;
  /** Name field on open platform account create request. */
  name: string;
  /** Provider field on open platform account create request. */
  provider: 'wechat' | 'alipay' | 'douyin' | 'baidu' | 'kuaishou' | 'feishu';
  /** Secret ref field on open platform account create request. */
  secretRef?: string | null;
  /** Token ref field on open platform account create request. */
  tokenRef?: string | null;
  /** Type field on open platform account create request. */
  type: 'official_account' | 'mini_app' | 'life_account' | 'bot';
}
