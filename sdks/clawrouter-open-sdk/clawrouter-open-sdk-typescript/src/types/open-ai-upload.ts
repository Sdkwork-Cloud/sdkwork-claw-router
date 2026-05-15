import type { OpenAiFile } from './open-ai-file';
import type { ProviderJsonValue } from './provider-json-value';

/** OpenAI-compatible upload object. */
export interface OpenAiUpload {
  /** Total number of bytes expected in the upload. */
  bytes: number;
  /** Unix timestamp in seconds when the upload was created. */
  created_at: number;
  /** Unix timestamp in seconds when the upload expires. */
  expires_at?: number;
  /** File field on the open ai upload, using the open ai file module. */
  file?: OpenAiFile;
  /** Upload filename. */
  filename: string;
  /** Upload identifier. */
  id: string;
  /** Object type, normally upload. */
  object: 'upload';
  /** OpenAI-compatible upload purpose. */
  purpose: string;
  /** Upload status. */
  status: string;
}
