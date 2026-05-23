import type { JsonValue } from './json-value';

/** Sdk reference documentation generate request schema exposed by Claw Router. */
export interface SdkReferenceDocumentationGenerateRequest {
  /** Config field on sdk reference documentation generate request. */
  config: Record<string, unknown>;
  /** Language field on sdk reference documentation generate request. */
  language: string;
  /** Spec field on sdk reference documentation generate request. */
  spec: Record<string, JsonValue>;
}
