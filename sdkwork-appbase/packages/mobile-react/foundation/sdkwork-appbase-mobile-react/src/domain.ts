export const SDKWORK_MOBILE_REACT_DOMAIN_ORDER = [
  "foundation",
  "host",
  "system",
  "iam",
  "communication",
  "intelligence",
  "content",
  "commerce",
  "device",
  "ecosystem",
] as const;

export type SdkworkMobileReactDomain = (typeof SDKWORK_MOBILE_REACT_DOMAIN_ORDER)[number];

export const SDKWORK_MOBILE_REACT_DOMAIN_LABELS: Record<SdkworkMobileReactDomain, string> = {
  foundation: "Foundation",
  host: "Host",
  system: "System",
  iam: "IAM",
  communication: "Communication",
  intelligence: "Intelligence",
  content: "Content",
  commerce: "Commerce",
  device: "Device",
  ecosystem: "Ecosystem",
};
