/** Persisted provider secret account snapshot returned by the backend. */
export interface AdminProviderSecretItem {
  accountCode: string;
  authType: string;
  createdAt: string;
  id: string;
  maskedLabel: string;
  name: string;
  providerCode: string;
  secretRef: string;
  status: 'active' | 'disabled';
  updatedAt: string;
}
