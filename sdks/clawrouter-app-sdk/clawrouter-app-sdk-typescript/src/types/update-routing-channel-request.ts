/** Update routing channel request schema exposed by Claw Router. */
export interface UpdateRoutingChannelRequest {
  /** Access type field on update routing channel request. */
  accessType?: string;
  /** Base url field on update routing channel request. */
  baseUrl?: string | null;
  /** Capabilities field on update routing channel request. */
  capabilities?: ('llm' | 'image' | 'audio' | 'music' | 'sfx' | 'video')[];
  /** Models field on update routing channel request. */
  models?: string[];
  /** Name field on update routing channel request. */
  name?: string;
  /** Protocol field on update routing channel request. */
  protocol?: string;
  /** Vault/KMS secret reference. Plaintext credential fields are forbidden. */
  secretRef?: string;
  /** Status field on update routing channel request. */
  status?: 'active' | 'disabled' | 'error';
  /** Vendor field on update routing channel request. */
  vendor?: string;
  /** Weight field on update routing channel request. */
  weight?: number;
}
