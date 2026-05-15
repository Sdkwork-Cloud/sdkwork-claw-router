/** Set routing channel status request schema exposed by Claw Router. */
export interface SetRoutingChannelStatusRequest {
  /** Status field on set routing channel status request. */
  status: 'active' | 'disabled';
}
