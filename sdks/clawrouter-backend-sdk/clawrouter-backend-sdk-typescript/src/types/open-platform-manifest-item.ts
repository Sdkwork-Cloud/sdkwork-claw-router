/** Open platform manifest item schema exposed by Claw Router. */
export interface OpenPlatformManifestItem {
  /** Id field on open platform manifest item. */
  id: string;
  /** Key field on open platform manifest item. */
  key: string;
  /** Provider field on open platform manifest item. */
  provider: 'wechat' | 'alipay' | 'douyin' | 'baidu' | 'kuaishou' | 'feishu';
  /** Status field on open platform manifest item. */
  status: 'active' | 'inactive';
  /** Type field on open platform manifest item. */
  type: 'official_account' | 'mini_app' | 'life_account' | 'bot';
  /** Version field on open platform manifest item. */
  version: string;
}
