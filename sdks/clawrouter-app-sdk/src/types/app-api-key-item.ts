/** Created API key metadata with masked key material. */
export interface AppApiKeyItem {
  created: string;
  expires: string;
  group: string;
  id: string;
  ipLimit: string;
  maskedKey: string;
  modalities: ('text' | 'image' | 'video' | 'audio' | 'music')[];
  name: string;
  quota: string;
  rate?: string | null;
  status: 'enabled' | 'disabled';
  usedQuota: string;
}
