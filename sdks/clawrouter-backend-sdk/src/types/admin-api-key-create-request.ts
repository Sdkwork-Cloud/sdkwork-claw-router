export interface AdminApiKeyCreateRequest {
  /** Human-readable API key name. */
  name: string;
  /** User identifier that owns the API key. */
  userId: number;
}
