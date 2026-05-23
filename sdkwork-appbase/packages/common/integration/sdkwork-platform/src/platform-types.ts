export type PlatformOperationMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
export type PlatformOperationSecurity = "adminToken" | "dualToken" | "public";
export type PlatformSdkNamespace = "openPlatform";
export type PlatformProvider = "alipay" | "baidu" | "douyin" | "feishu" | "kuaishou" | "wechat";
export type PlatformAccountType = "bot" | "life_account" | "mini_app" | "official_account";
export type PlatformCap = "account" | "entry" | "hook" | "login" | "menu" | "message" | "notice" | "pay" | "reply" | "window";
export type PlatformEntryType = "mini_app_url" | "qr" | "url";
export type PlatformHookMode = "receive" | "verify";
export type PlatformPayScene = "app" | "h5" | "mini_app" | "official_account";
export type PlatformPayMode = "cashier" | "direct" | "escrow";
export type PlatformQrAuthPurpose = "login" | "register";
export type PlatformQrAuthStatus = "cancelled" | "completed" | "expired" | "pending" | "scanned";
export type PlatformCapabilityName =
  | "account"
  | "delivery"
  | "entry"
  | "event"
  | "hook"
  | "log"
  | "menu"
  | "notice"
  | "outbox"
  | "pay"
  | "provider"
  | "qrAuth"
  | "window";
