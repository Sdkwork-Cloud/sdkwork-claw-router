/** Persisted channel regional endpoint snapshot returned by the backend. */
export interface AdminChannelEndpointItem {
  /** Api endpoint code field on admin channel endpoint item. */
  apiEndpointCode: string;
  /** Base url field on admin channel endpoint item. */
  baseUrl: string;
  /** Channel code field on admin channel endpoint item. */
  channelCode: string;
  /** Channel id field on admin channel endpoint item. */
  channelId: string;
  /** Channel type field on admin channel endpoint item. */
  channelType: 'official' | 'relay';
  /** Effective from field on admin channel endpoint item. */
  effectiveFrom?: string | null;
  /** Effective to field on admin channel endpoint item. */
  effectiveTo?: string | null;
  /** Health status field on admin channel endpoint item. */
  healthStatus: 'healthy' | 'unhealthy' | 'unknown';
  /** Id field on admin channel endpoint item. */
  id: string;
  /** Priority field on admin channel endpoint item. */
  priority: number;
  /** Provider code field on admin channel endpoint item. */
  providerCode: string;
  /** Region code field on admin channel endpoint item. */
  regionCode: string;
  /** Status field on admin channel endpoint item. */
  status: 'active' | 'disabled' | 'inactive';
  /** Vendor code field on admin channel endpoint item. */
  vendorCode: string;
  /** Weight field on admin channel endpoint item. */
  weight: number;
}
