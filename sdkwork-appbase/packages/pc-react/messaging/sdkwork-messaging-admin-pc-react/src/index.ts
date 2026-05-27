export const SDKWORK_MESSAGING_ADMIN_ROUTE = "/admin/messaging" as const;

export const SDKWORK_MESSAGING_ADMIN_SECTIONS = [
  "providers",
  "sender-identities",
  "templates",
  "route-rules",
  "send-requests",
  "diagnostics",
  "suppressions",
  "rate-limits",
  "verification-policies",
] as const;

export type MessagingAdminSection = (typeof SDKWORK_MESSAGING_ADMIN_SECTIONS)[number];
