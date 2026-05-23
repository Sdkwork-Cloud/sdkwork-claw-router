export type SdkworkMediaLocale = "en-US" | "zh-CN";

export type SdkworkMediaMessagesOverrides = DeepPartial<SdkworkMediaMessages>;

export interface SdkworkMediaMessages {
  empty: {
    noItemsDescription: string;
    noItemsTitle: string;
  };
  kind: {
    audio: string;
    image: string;
    video: string;
  };
  page: {
    description: string;
    errorTitle: string;
    eyebrow: string;
    loading: string;
    searchLabel: string;
    searchPlaceholder: string;
    title: string;
  };
  publishPosture: {
    all: string;
    blocked: string;
    draft: string;
    ready: string;
  };
  queues: {
    all: string;
  };
  service: {
    loadWorkspaceFailed: string;
  };
  summary: {
    publishReady: string;
    queues: string;
    reviewAttention: string;
    totalItems: string;
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

const EN_US_MESSAGES: SdkworkMediaMessages = {
  empty: {
    noItemsDescription: "No media items match the current filters.",
    noItemsTitle: "No media items",
  },
  kind: {
    audio: "Audio",
    image: "Image",
    video: "Video",
  },
  page: {
    description: "Coordinate review queues, publish posture, and cross-media readiness from a reusable media operations surface.",
    errorTitle: "Media workspace error",
    eyebrow: "Media operations",
    loading: "Loading media control room...",
    searchLabel: "Search media",
    searchPlaceholder: "Search media",
    title: "Media Control Room",
  },
  publishPosture: {
    all: "All",
    blocked: "Blocked",
    draft: "Draft",
    ready: "Ready",
  },
  queues: {
    all: "All queues",
  },
  service: {
    loadWorkspaceFailed: "Failed to load media workspace.",
  },
  summary: {
    publishReady: "Publish ready",
    queues: "Queues",
    reviewAttention: "Review attention",
    totalItems: "Total items",
  },
};

const ZH_CN_MESSAGES: SdkworkMediaMessages = {
  empty: {
    noItemsDescription: "\u5f53\u524d\u7b5b\u9009\u6761\u4ef6\u4e0b\u6ca1\u6709\u5339\u914d\u7684\u5a92\u4f53\u6761\u76ee\u3002",
    noItemsTitle: "\u6682\u65e0\u5a92\u4f53\u6761\u76ee",
  },
  kind: {
    audio: "\u97f3\u9891",
    image: "\u56fe\u50cf",
    video: "\u89c6\u9891",
  },
  page: {
    description: "\u7edf\u4e00\u534f\u540c\u5ba1\u6838\u961f\u5217\u3001\u53d1\u5e03\u59ff\u6001\u548c\u8de8\u5a92\u4f53\u7684\u4ea4\u4ed8\u51c6\u5907\u5ea6\u3002",
    errorTitle: "\u5a92\u4f53\u5de5\u4f5c\u53f0\u5f02\u5e38",
    eyebrow: "\u5a92\u4f53\u8fd0\u8425",
    loading: "\u6b63\u5728\u52a0\u8f7d\u5a92\u4f53\u63a7\u5236\u53f0...",
    searchLabel: "\u641c\u7d22\u5a92\u4f53",
    searchPlaceholder: "\u641c\u7d22\u5a92\u4f53",
    title: "\u5a92\u4f53\u63a7\u5236\u53f0",
  },
  publishPosture: {
    all: "\u5168\u90e8",
    blocked: "\u5df2\u963b\u585e",
    draft: "\u8349\u7a3f",
    ready: "\u5df2\u5c31\u7eea",
  },
  queues: {
    all: "\u5168\u90e8\u961f\u5217",
  },
  service: {
    loadWorkspaceFailed: "\u52a0\u8f7d\u5a92\u4f53\u5de5\u4f5c\u53f0\u5931\u8d25\u3002",
  },
  summary: {
    publishReady: "\u53ef\u53d1\u5e03",
    queues: "\u961f\u5217",
    reviewAttention: "\u5f85\u5ba1\u5173\u6ce8",
    totalItems: "\u6761\u76ee\u603b\u6570",
  },
};

const SDKWORK_MEDIA_MESSAGES: Record<SdkworkMediaLocale, SdkworkMediaMessages> = {
  "en-US": EN_US_MESSAGES,
  "zh-CN": ZH_CN_MESSAGES,
};

export function normalizeSdkworkMediaLocale(locale?: string | null): SdkworkMediaLocale {
  const normalized = String(locale || "").trim().toLowerCase();
  if (normalized.startsWith("zh")) {
    return "zh-CN";
  }

  return "en-US";
}

export function createSdkworkMediaMessages(
  locale?: string | null,
  overrides?: SdkworkMediaMessagesOverrides,
): SdkworkMediaMessages {
  return mergeDeep(
    SDKWORK_MEDIA_MESSAGES[normalizeSdkworkMediaLocale(locale)],
    overrides,
  );
}
