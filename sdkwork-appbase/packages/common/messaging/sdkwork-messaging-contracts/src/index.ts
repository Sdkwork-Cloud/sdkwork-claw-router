export type MessagingChannel = "sms" | "email";
export type MessagingDeliveryPurpose = "verification" | "transactional" | "marketing" | "system";
export type MessagingTemplateStatus = "draft" | "reviewing" | "published" | "retired";
export const SDKWORK_MESSAGING_DELIVERY_STATUSES = [
  "accepted",
  "queued",
  "dry_run",
  "sent",
  "delivered",
  "failed",
  "suppressed",
  "rate_limited",
  "route_unmatched",
  "expired",
] as const;

export type MessagingDeliveryStatus = (typeof SDKWORK_MESSAGING_DELIVERY_STATUSES)[number];

export const SDKWORK_MESSAGING_TABLES = {
  providerCapability: "messaging_provider_capability",
  senderIdentity: "messaging_sender_identity",
  template: "messaging_template",
  templateVersion: "messaging_template_version",
  templateVariant: "messaging_template_variant",
  templateBinding: "messaging_template_binding",
  routeRule: "messaging_route_rule",
  routeRuleTarget: "messaging_route_rule_target",
  sendRequest: "messaging_send_request",
  sendAttempt: "messaging_send_attempt",
  deliveryEvent: "messaging_delivery_event",
  suppression: "messaging_suppression",
  rateLimitBucket: "messaging_rate_limit_bucket",
  verificationScenePolicy: "iam_verification_scene_policy",
  verificationChallenge: "iam_verification_challenge",
  verificationAttempt: "iam_verification_attempt",
} as const;

export type MessagingDomainModelName = keyof typeof SDKWORK_MESSAGING_TABLES;

export interface MessagingOperationContract {
  apiSurface: "app" | "backend" | "worker";
  method: "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
  operationId: string;
  path: string;
  sdkDomain: "messaging";
  security: "dualToken" | "system";
}

export interface MessagingTemplateContract {
  channel: MessagingChannel;
  sceneCode: string;
  templateCode: string;
  variableNames: readonly string[];
}

export interface MessagingDeliveryPortRequest {
  channel: MessagingChannel;
  deliveryPurpose: MessagingDeliveryPurpose;
  idempotencyKey: string;
  sceneCode: string;
  targetHash: string;
  targetMasked: string;
  templateCode: string;
  variables: Readonly<Record<string, unknown>>;
}

export interface MessagingDeliveryPortResult {
  deliveryStatus: MessagingDeliveryStatus;
  providerCode?: string;
  providerMessageId?: string;
  requestId: string;
}

export const SDKWORK_MESSAGING_STANDARD = {
  api: {
    appPrefix: "/app/v3/api",
    backendPrefix: "/backend/v3/api",
    openapi: "3.1.2",
  },
  databasePrefix: "messaging",
  domain: "messaging",
  sdkDomain: "messaging",
  supportedChannels: ["sms", "email"] as const,
} as const;
