export const SDKWORK_PC_REACT_DOMAIN_ORDER = [
  "foundation",
  "host",
  "system",
  "notification",
  "iam",
  "communication",
  "intelligence",
  "content",
  "commerce",
  "integration",
  "device",
  "ecosystem",
] as const;

export type SdkworkPcReactDomain = (typeof SDKWORK_PC_REACT_DOMAIN_ORDER)[number];

export const SDKWORK_PC_REACT_DOMAIN_LABELS: Record<SdkworkPcReactDomain, string> = {
  foundation: "Foundation",
  host: "Host",
  system: "System",
  notification: "Notification",
  iam: "IAM",
  communication: "Communication",
  intelligence: "Intelligence",
  content: "Content",
  commerce: "Commerce",
  integration: "Integration",
  device: "Device",
  ecosystem: "Ecosystem",
};
