import type { MessagesResponse } from './messages-response';

export interface FetchMessagesResult {
  /** Business response code. */
  code: string;
  data?: MessagesResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
