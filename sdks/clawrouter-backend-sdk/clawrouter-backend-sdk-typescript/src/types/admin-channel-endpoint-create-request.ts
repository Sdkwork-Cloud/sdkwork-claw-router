/** Admin channel endpoint create request schema exposed by Claw Router. */
export interface AdminChannelEndpointCreateRequest {
  /** Api endpoint code field on admin channel endpoint create request. */
  apiEndpointCode: string;
  /** Base url field on admin channel endpoint create request. */
  baseUrl: string;
  /** Scoped ai_channel id. Provider and channel identity are derived by the backend and are never trusted from request input. */
  channelId: string;
  /** Effective from field on admin channel endpoint create request. */
  effectiveFrom?: string | null;
  /** Effective to field on admin channel endpoint create request. */
  effectiveTo?: string | null;
  /** Priority field on admin channel endpoint create request. */
  priority?: number;
  /** Region code field on admin channel endpoint create request. */
  regionCode: string;
  /** Status field on admin channel endpoint create request. */
  status?: 'active' | 'disabled' | 'inactive';
  /** Vendor code field on admin channel endpoint create request. */
  vendorCode: string;
  /** Weight field on admin channel endpoint create request. */
  weight?: number;
}
