export interface UpdateRoutingChannelRequest {
  accessType?: string;
  baseUrl?: string | null;
  capabilities?: ('llm' | 'image' | 'audio' | 'music' | 'sfx' | 'video')[];
  models?: string[];
  name?: string;
  protocol?: string;
  /** Vault/KMS secret reference. Plaintext credential fields are forbidden. */
  secretRef?: string;
  status?: 'active' | 'disabled' | 'error';
  vendor?: string;
  weight?: number;
}
