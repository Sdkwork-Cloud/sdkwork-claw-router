/** Admin channel endpoint update request schema exposed by Claw Router. */
export interface AdminChannelEndpointUpdateRequest {
  /** Api endpoint code field on admin channel endpoint update request. */
  apiEndpointCode?: string;
  /** Base url field on admin channel endpoint update request. */
  baseUrl?: string;
  /** Effective from field on admin channel endpoint update request. */
  effectiveFrom?: string | null;
  /** Effective to field on admin channel endpoint update request. */
  effectiveTo?: string | null;
  /** Priority field on admin channel endpoint update request. */
  priority?: number;
  /** Region code field on admin channel endpoint update request. */
  regionCode?: string;
  /** Status field on admin channel endpoint update request. */
  status?: 'active' | 'disabled' | 'inactive';
  /** Vendor code field on admin channel endpoint update request. */
  vendorCode?: string;
  /** Weight field on admin channel endpoint update request. */
  weight?: number;
}
