import type { JsonValue } from './json-value';

/** Memory entry create request schema exposed by Claw Router. */
export interface MemoryEntryCreateRequest {
  /** Confidence score field on memory entry create request. */
  confidenceScore?: string;
  /** Content field on memory entry create request. */
  content: string;
  /** Content json field on memory entry create request. */
  contentJson?: Record<string, JsonValue>;
  /** Importance score field on memory entry create request. */
  importanceScore?: string;
  /** Memory type field on memory entry create request. */
  memoryType?: string;
  /** Metadata field on memory entry create request. */
  metadata?: Record<string, JsonValue>;
  /** Sensitivity level field on memory entry create request. */
  sensitivityLevel?: string;
  /** Source conversation id field on memory entry create request. */
  sourceConversationId?: string;
  /** Source invocation id field on memory entry create request. */
  sourceInvocationId?: string;
  /** Source item id field on memory entry create request. */
  sourceItemId?: string;
  /** Source kind field on memory entry create request. */
  sourceKind?: string;
  /** Source turn id field on memory entry create request. */
  sourceTurnId?: string;
  /** Status field on memory entry create request. */
  status?: string;
  /** Subject key field on memory entry create request. */
  subjectKey?: string;
  /** Subject type field on memory entry create request. */
  subjectType?: string;
  /** Trust level field on memory entry create request. */
  trustLevel?: string;
}
