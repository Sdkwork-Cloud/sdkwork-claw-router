export interface AdminProviderSecretListRequest {
  providerCode?: string;
  status?: 'active' | 'disabled';
}
