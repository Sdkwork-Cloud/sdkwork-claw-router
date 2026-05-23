import type { JsonValue } from './json-value';

/** Memory space create request schema exposed by Claw Router. */
export interface MemorySpaceCreateRequest {
  /** Auto extract enabled field on memory space create request. */
  autoExtractEnabled?: boolean;
  /** Auto recall enabled field on memory space create request. */
  autoRecallEnabled?: boolean;
  /** Max injected tokens field on memory space create request. */
  maxInjectedTokens?: number;
  /** Memory enabled field on memory space create request. */
  memoryEnabled?: boolean;
  /** Metadata field on memory space create request. */
  metadata?: Record<string, JsonValue>;
  /** Owner id field on memory space create request. */
  ownerId?: string;
  /** Owner type field on memory space create request. */
  ownerType?: string;
  /** Retention policy field on memory space create request. */
  retentionPolicy?: Record<string, JsonValue>;
  /** Review required field on memory space create request. */
  reviewRequired?: boolean;
  /** Sensitivity policy field on memory space create request. */
  sensitivityPolicy?: Record<string, JsonValue>;
  /** Space type field on memory space create request. */
  spaceType?: string;
  /** Title field on memory space create request. */
  title: string;
}
