/** Admin site model update request schema exposed by Claw Router. */
export interface AdminSiteModelUpdateRequest {
  /** Capabilities field on admin site model update request. */
  capabilities?: string[];
  /** Context tokens field on admin site model update request. */
  contextTokens?: number | null;
  /** Display name field on admin site model update request. */
  displayName?: string | null;
  /** Max input tokens field on admin site model update request. */
  maxInputTokens?: number | null;
  /** Max output tokens field on admin site model update request. */
  maxOutputTokens?: number | null;
  /** Modality field on admin site model update request. */
  modality?: string | null;
  /** Model code field on admin site model update request. */
  modelCode?: string;
  /** Model name field on admin site model update request. */
  modelName?: string;
  /** Provider model field on admin site model update request. */
  providerModel?: string | null;
  /** Provider native model field on admin site model update request. */
  providerNativeModel?: string | null;
  /** Status field on admin site model update request. */
  status?: 'active' | 'disabled';
  /** Supports json schema field on admin site model update request. */
  supportsJsonSchema?: boolean;
  /** Supports streaming field on admin site model update request. */
  supportsStreaming?: boolean;
  /** Supports tools field on admin site model update request. */
  supportsTools?: boolean;
  /** Vendor code field on admin site model update request. */
  vendorCode?: string | null;
}
