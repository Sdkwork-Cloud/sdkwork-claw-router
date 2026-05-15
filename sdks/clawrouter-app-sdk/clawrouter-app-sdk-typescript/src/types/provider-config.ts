/** Provider config schema exposed by Claw Router. */
export interface ProviderConfig {
  /** Description field on provider config. */
  description: string;
  /** Id field on provider config. */
  id: string;
  /** Integration type field on provider config. */
  integrationType: 'model_vendor_direct' | 'cloud_platform' | 'relay_aggregator' | 'self_hosted_gateway' | 'local_runtime' | 'custom' | 'unknown';
  /** Name field on provider config. */
  name: string;
  /** Provider family field on provider config. */
  providerFamily: 'claude' | 'codex' | 'gemini' | 'opencode';
  /** Status field on provider config. */
  status: 'active' | 'inactive';
  /** Provider public endpoint URL or safe proxy endpoint. */
  url: string;
}
