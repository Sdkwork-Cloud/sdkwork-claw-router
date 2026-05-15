import type { ProviderJsonValue } from './provider-json-value';

/** OpenAI-compatible request to create an upload. */
export interface OpenAiUploadCreateRequest {
  /** Total number of bytes in the upload. */
  bytes: number;
  /** Upload filename. */
  filename: string;
  /** Upload MIME type. */
  mime_type: string;
  /** OpenAI-compatible upload purpose. */
  purpose: string;
}
