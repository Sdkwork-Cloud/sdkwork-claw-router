export interface CreateRoutingChannelRequest {
  accessType?: string;
  baseUrl?: string;
  capabilities?: ('llm' | 'image' | 'audio' | 'music' | 'sfx' | 'video')[];
  models: string[];
  name: string;
  protocol?: string;
  /** Vault/KMS secret reference. Plaintext credential fields are forbidden. */
  secretRef: string;
  status?: 'active' | 'disabled' | 'error';
  vendor: string;
  weight?: number;
}
