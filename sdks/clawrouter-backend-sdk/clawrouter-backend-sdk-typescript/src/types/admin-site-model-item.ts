/** Admin site model item schema exposed by Claw Router. */
export interface AdminSiteModelItem {
  /** Capabilities field on admin site model item. */
  capabilities?: string[];
  /** Consecutive error count field on admin site model item. */
  consecutiveErrorCount?: number;
  /** Context tokens field on admin site model item. */
  contextTokens?: number | null;
  /** Display name field on admin site model item. */
  displayName?: string | null;
  /** Health status field on admin site model item. */
  healthStatus: 'unknown' | 'healthy' | 'degraded' | 'unhealthy';
  /** Id field on admin site model item. */
  id: string;
  /** Last latency ms field on admin site model item. */
  lastLatencyMs?: number | null;
  /** Last sync at field on admin site model item. */
  lastSyncAt?: string | null;
  /** Max input tokens field on admin site model item. */
  maxInputTokens?: number | null;
  /** Max output tokens field on admin site model item. */
  maxOutputTokens?: number | null;
  /** Modality field on admin site model item. */
  modality?: string | null;
  /** Model code field on admin site model item. */
  modelCode: string;
  /** Model name field on admin site model item. */
  modelName: string;
  /** Provider model field on admin site model item. */
  providerModel?: string | null;
  /** Provider native model field on admin site model item. */
  providerNativeModel?: string | null;
  /** Service type field on admin site model item. */
  serviceType: 'ai_model_relay';
  /** Site code field on admin site model item. */
  siteCode: string;
  /** Site id field on admin site model item. */
  siteId: string;
  /** Site service code field on admin site model item. */
  siteServiceCode?: string | null;
  /** Site service id field on admin site model item. */
  siteServiceId: string;
  /** Status field on admin site model item. */
  status: 'active' | 'disabled';
  /** Supports json schema field on admin site model item. */
  supportsJsonSchema?: boolean;
  /** Supports streaming field on admin site model item. */
  supportsStreaming?: boolean;
  /** Supports tools field on admin site model item. */
  supportsTools?: boolean;
  /** Vendor code field on admin site model item. */
  vendorCode?: string | null;
}
