export type SdkworkVipPurchaseLocale = "en-US" | "zh-CN";

export type SdkworkVipPurchaseMessagesOverrides = DeepPartial<SdkworkVipPurchaseMessages>;

export interface SdkworkVipPurchaseMessages {
  actions: {
    cancel: string;
    confirm: string;
    openCenter: string;
    openMenu: string;
    renew: string;
    selectPlan: string;
    selected: string;
    upgrade: string;
  };
  header: {
    ariaLabel: string;
    fallbackLevel: string;
    title: string;
  };
  menu: {
    emptyDescription: string;
    emptyTitle: string;
    includedPoints: string;
    paymentMethod: string;
    price: string;
    purchaseFailedTitle: string;
    selectedPlan: string;
    signInRequiredDescription: string;
    signInRequiredTitle: string;
    title: string;
  };
  payment: {
    alipay: string;
    wechat: string;
  };
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (...args: never[]) => unknown
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeDeep<T>(base: T, overrides?: DeepPartial<T>): T {
  if (!overrides) {
    return base;
  }

  const output: Record<string, unknown> = {
    ...(base as Record<string, unknown>),
  };

  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      continue;
    }

    const baseValue = output[key];
    output[key] = isRecord(baseValue) && isRecord(value)
      ? mergeDeep(baseValue, value)
      : value;
  }

  return output as T;
}

const EN_US_MESSAGES: SdkworkVipPurchaseMessages = {
  actions: {
    cancel: "Cancel",
    confirm: "Confirm payment",
    openCenter: "Open VIP center",
    openMenu: "Buy VIP",
    renew: "Renew membership",
    selectPlan: "Select plan",
    selected: "Selected",
    upgrade: "Upgrade membership",
  },
  header: {
    ariaLabel: "Buy VIP membership",
    fallbackLevel: "VIP",
    title: "Buy VIP",
  },
  menu: {
    emptyDescription: "Membership packages will appear here after the VIP catalog is available.",
    emptyTitle: "No VIP packages",
    includedPoints: "Included points",
    paymentMethod: "Payment method",
    price: "Price",
    purchaseFailedTitle: "Purchase failed",
    selectedPlan: "Selected plan",
    signInRequiredDescription: "Sign in before purchasing, renewing, or upgrading a VIP package.",
    signInRequiredTitle: "Sign in required",
    title: "VIP packages",
  },
  payment: {
    alipay: "Alipay",
    wechat: "WeChat Pay",
  },
};

const ZH_CN_MESSAGES: SdkworkVipPurchaseMessages = {
  actions: {
    cancel: "\u53d6\u6d88",
    confirm: "\u786e\u8ba4\u652f\u4ed8",
    openCenter: "\u6253\u5f00\u4f1a\u5458\u4e2d\u5fc3",
    openMenu: "\u8d2d\u4e70\u4f1a\u5458",
    renew: "\u7eed\u8d39\u4f1a\u5458",
    selectPlan: "\u9009\u62e9\u5957\u9910",
    selected: "\u5df2\u9009\u62e9",
    upgrade: "\u5347\u7ea7\u4f1a\u5458",
  },
  header: {
    ariaLabel: "\u8d2d\u4e70 VIP \u4f1a\u5458",
    fallbackLevel: "VIP",
    title: "\u8d2d\u4e70\u4f1a\u5458",
  },
  menu: {
    emptyDescription: "\u5f53 VIP \u5957\u9910\u76ee\u5f55\u53ef\u7528\u540e\uff0c\u8fd9\u91cc\u4f1a\u5c55\u793a\u53ef\u8d2d\u4e70\u65b9\u6848\u3002",
    emptyTitle: "\u6682\u65e0 VIP \u5957\u9910",
    includedPoints: "\u5305\u542b\u79ef\u5206",
    paymentMethod: "\u652f\u4ed8\u65b9\u5f0f",
    price: "\u4ef7\u683c",
    purchaseFailedTitle: "\u8d2d\u4e70\u5931\u8d25",
    selectedPlan: "\u5df2\u9009\u5957\u9910",
    signInRequiredDescription: "\u8d2d\u4e70\u3001\u7eed\u8d39\u6216\u5347\u7ea7 VIP \u5957\u9910\u524d\u8bf7\u5148\u767b\u5f55\u3002",
    signInRequiredTitle: "\u9700\u8981\u767b\u5f55",
    title: "VIP \u5957\u9910",
  },
  payment: {
    alipay: "\u652f\u4ed8\u5b9d",
    wechat: "\u5fae\u4fe1\u652f\u4ed8",
  },
};

const SDKWORK_VIP_PURCHASE_MESSAGES: Record<SdkworkVipPurchaseLocale, SdkworkVipPurchaseMessages> = {
  "en-US": EN_US_MESSAGES,
  "zh-CN": ZH_CN_MESSAGES,
};

export function normalizeSdkworkVipPurchaseLocale(locale?: string | null): SdkworkVipPurchaseLocale {
  const normalized = String(locale || "").trim().toLowerCase();
  if (normalized.startsWith("zh")) {
    return "zh-CN";
  }

  return "en-US";
}

export function createSdkworkVipPurchaseMessages(
  locale?: string | null,
  overrides?: SdkworkVipPurchaseMessagesOverrides,
): SdkworkVipPurchaseMessages {
  return mergeDeep(
    SDKWORK_VIP_PURCHASE_MESSAGES[normalizeSdkworkVipPurchaseLocale(locale)],
    overrides,
  );
}

export function formatSdkworkVipPurchasePaymentMethod(
  method: "ALIPAY" | "WECHAT",
  locale?: string | null,
  overrides?: SdkworkVipPurchaseMessagesOverrides,
): string {
  const copy = createSdkworkVipPurchaseMessages(locale, overrides);
  return method === "ALIPAY" ? copy.payment.alipay : copy.payment.wechat;
}
