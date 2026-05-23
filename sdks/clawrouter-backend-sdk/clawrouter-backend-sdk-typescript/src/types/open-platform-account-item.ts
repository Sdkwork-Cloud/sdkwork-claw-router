/** Open platform account item schema exposed by Claw Router. */
export interface OpenPlatformAccountItem {
  /** Aes key ref field on open platform account item. */
  aesKeyRef?: string | null;
  /** App id field on open platform account item. */
  appId?: string | null;
  /** Created at field on open platform account item. */
  createdAt?: string;
  /** Default entry id field on open platform account item. */
  defaultEntryId?: string | null;
  /** Id field on open platform account item. */
  id: string;
  /** Key field on open platform account item. */
  key: string;
  /** Name field on open platform account item. */
  name: string;
  /** Provider field on open platform account item. */
  provider: 'wechat' | 'alipay' | 'douyin' | 'baidu' | 'kuaishou' | 'feishu';
  /** Qr default field on open platform account item. */
  qrDefault: boolean;
  /** Secret ref field on open platform account item. */
  secretRef?: string | null;
  /** Status field on open platform account item. */
  status: 'active' | 'inactive';
  /** Token ref field on open platform account item. */
  tokenRef?: string | null;
  /** Type field on open platform account item. */
  type: 'official_account' | 'mini_app' | 'life_account' | 'bot';
  /** Updated at field on open platform account item. */
  updatedAt?: string;
}
