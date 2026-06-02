/** Admin site model create request schema exposed by Claw Router. */
export interface AdminSiteModelCreateRequest {
  /** Capabilities field on admin site model create request. */
  capabilities?: string[];
  /** Context tokens field on admin site model create request. */
  contextTokens?: number | null;
  /** Display name field on admin site model create request. */
  displayName?: string | null;
  /** Max input tokens field on admin site model create request. */
  maxInputTokens?: number | null;
  /** Max output tokens field on admin site model create request. */
  maxOutputTokens?: number | null;
  /** Modality field on admin site model create request. */
  modality?: string | null;
  /** Model code field on admin site model create request. */
  modelCode: string;
  /** Model name field on admin site model create request. */
  modelName: string;
  /** Provider model field on admin site model create request. */
  providerModel?: string | null;
  /** Provider native model field on admin site model create request. */
  providerNativeModel?: string | null;
  /** Status field on admin site model create request. */
  status?: 'active' | 'disabled';
  /** Supports json schema field on admin site model create request. */
  supportsJsonSchema?: boolean;
  /** Supports streaming field on admin site model create request. */
  supportsStreaming?: boolean;
  /** Supports tools field on admin site model create request. */
  supportsTools?: boolean;
  /** Vendor code field on admin site model create request. */
  vendorCode?: string | null;
}
