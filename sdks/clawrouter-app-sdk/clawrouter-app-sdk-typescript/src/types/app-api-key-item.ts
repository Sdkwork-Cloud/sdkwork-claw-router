/** Created API key metadata with masked key material. */
export interface AppApiKeyItem {
  /** Created field on app api key item. */
  created: string;
  /** Expires field on app api key item. */
  expires: string;
  /** Group field on app api key item. */
  group: string;
  /** Id field on app api key item. */
  id: string;
  /** Ip limit field on app api key item. */
  ipLimit: string;
  /** Masked key field on app api key item. */
  maskedKey: string;
  /** Modalities field on app api key item. */
  modalities: ('text' | 'image' | 'video' | 'audio' | 'music')[];
  /** Name field on app api key item. */
  name: string;
  /** Quota field on app api key item. */
  quota: string;
  /** Rate field on app api key item. */
  rate?: string | null;
  /** Status field on app api key item. */
  status: 'enabled' | 'disabled';
  /** Used quota field on app api key item. */
  usedQuota: string;
}
