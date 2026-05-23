/** Open platform provider item schema exposed by Claw Router. */
export interface OpenPlatformProviderItem {
  /** Id field on open platform provider item. */
  id: string;
  /** Name field on open platform provider item. */
  name: string;
  /** Provider field on open platform provider item. */
  provider: 'wechat' | 'alipay' | 'douyin' | 'baidu' | 'kuaishou' | 'feishu';
  /** Status field on open platform provider item. */
  status: 'active' | 'inactive';
}
