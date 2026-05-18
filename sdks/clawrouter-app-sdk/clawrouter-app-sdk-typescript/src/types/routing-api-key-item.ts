/** Routing api key item schema exposed by Claw Router. */
export interface RoutingApiKeyItem {
  /** Full plaintext owner API key returned only for authenticated console owner management reads. */
  copyableKey?: string;
  /** Created at field on routing api key item. */
  createdAt: string;
  /** Masked API key display value. UI must never copy this field as secret material. */
  displayKey: string;
  /** Id field on routing api key item. */
  id: string;
  /** Name field on routing api key item. */
  name: string;
  /** Status field on routing api key item. */
  status: 'enabled' | 'disabled';
  /** Total usage field on routing api key item. */
  totalUsage: string;
}
