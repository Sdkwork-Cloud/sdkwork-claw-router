export interface AdminProviderSecretCreateRequest {
  authType?: string;
  name: string;
  providerCode: string;
  /** Vault/KMS secret reference. Plaintext provider secrets are forbidden. */
  secretRef: string;
  status?: 'active' | 'disabled';
}
