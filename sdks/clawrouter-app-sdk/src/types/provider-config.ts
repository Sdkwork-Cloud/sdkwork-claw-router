export interface ProviderConfig {
  description: string;
  id: string;
  integrationType: 'model_vendor_direct' | 'cloud_platform' | 'relay_aggregator' | 'self_hosted_gateway' | 'local_runtime' | 'custom' | 'unknown';
  name: string;
  providerFamily: 'claude' | 'codex' | 'gemini' | 'opencode';
  status: 'active' | 'inactive';
  /** Provider public endpoint URL or safe proxy endpoint. */
  url: string;
}
