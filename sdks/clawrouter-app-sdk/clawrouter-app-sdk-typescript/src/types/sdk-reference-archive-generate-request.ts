import type { JsonValue } from './json-value';

/** Sdk reference archive generate request schema exposed by Claw Router. */
export interface SdkReferenceArchiveGenerateRequest {
  /** Config field on sdk reference archive generate request. */
  config: Record<string, unknown>;
  /** Language field on sdk reference archive generate request. */
  language: string;
  /** Spec field on sdk reference archive generate request. */
  spec: Record<string, JsonValue>;
}
