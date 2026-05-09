export interface AiRateLimitBucketRecord {
  bucket_key?: string;
  created_at?: string;
  current_count?: string;
  current_tokens?: string;
  id?: string;
  last_request_at?: string;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  quota_policy_id?: string;
  rebuild_version?: string;
  remaining_count?: string;
  remaining_tokens?: string;
  source_id?: string;
  source_type?: string;
  source_version?: string;
  status?: string;
  subject_id?: string;
  subject_type?: string;
  tenant_id?: string;
  updated_at?: string;
  uuid?: string;
  window_end?: string;
  window_start?: string;
}
