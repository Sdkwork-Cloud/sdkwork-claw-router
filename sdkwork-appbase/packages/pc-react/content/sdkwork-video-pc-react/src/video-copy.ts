export type SdkworkVideoLocale = "en-US" | "zh-CN";

export type SdkworkVideoMessagesOverrides = DeepPartial<SdkworkVideoMessages>;

export interface SdkworkVideoMessages {
  empty: {
    noVideosDescription: string;
    noVideosTitle: string;
  };
  gallery: {
    scenePlural: string;
    sceneSingular: string;
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
  presets: {
    all: string;
  };
  service: {
    loadWorkspaceFailed: string;
  };
  status: {
    all: string;
    queued: string;
    ready: string;
    rendering: string;
  };
  summary: {
    activeRenders: string;
    presets: string;
    readyVideos: string;
    totalVideos: string;
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

const EN_US_MESSAGES: SdkworkVideoMessages = {
  empty: {
    noVideosDescription: "No videos match the current filters.",
    noVideosTitle: "No videos",
  },
  gallery: {
    scenePlural: "scenes",
    sceneSingular: "scene",
  },
  page: {
    description: "Track video presets, render jobs, and reusable outputs from a composable video surface.",
    errorTitle: "Video workspace error",
    eyebrow: "Video generation",
    loading: "Loading video workspace...",
    searchLabel: "Search videos",
    searchPlaceholder: "Search videos",
    title: "Video Workspace",
  },
  presets: {
    all: "All presets",
  },
  service: {
    loadWorkspaceFailed: "Failed to load video workspace.",
  },
  status: {
    all: "All",
    queued: "Queued",
    ready: "Ready",
    rendering: "Rendering",
  },
  summary: {
    activeRenders: "Active renders",
    presets: "Presets",
    readyVideos: "Ready videos",
    totalVideos: "Total videos",
  },
};

const ZH_CN_MESSAGES: SdkworkVideoMessages = {
  empty: {
    noVideosDescription: "\u5f53\u524d\u7b5b\u9009\u6761\u4ef6\u4e0b\u6ca1\u6709\u5339\u914d\u7684\u89c6\u9891\u3002",
    noVideosTitle: "\u6682\u65e0\u89c6\u9891",
  },
  gallery: {
    scenePlural: "\u4e2a\u955c\u5934",
    sceneSingular: "\u4e2a\u955c\u5934",
  },
  page: {
    description: "\u7edf\u4e00\u67e5\u770b\u89c6\u9891\u9884\u8bbe\u3001\u6e32\u67d3\u4efb\u52a1\u4e0e\u53ef\u590d\u7528\u7684\u8f93\u51fa\u6210\u679c\u3002",
    errorTitle: "\u89c6\u9891\u5de5\u4f5c\u53f0\u5f02\u5e38",
    eyebrow: "\u89c6\u9891\u751f\u6210",
    loading: "\u6b63\u5728\u52a0\u8f7d\u89c6\u9891\u5de5\u4f5c\u53f0...",
    searchLabel: "\u641c\u7d22\u89c6\u9891",
    searchPlaceholder: "\u641c\u7d22\u89c6\u9891",
    title: "\u89c6\u9891\u5de5\u4f5c\u53f0",
  },
  presets: {
    all: "\u5168\u90e8\u9884\u8bbe",
  },
  service: {
    loadWorkspaceFailed: "\u52a0\u8f7d\u89c6\u9891\u5de5\u4f5c\u53f0\u5931\u8d25\u3002",
  },
  status: {
    all: "\u5168\u90e8",
    queued: "\u6392\u961f\u4e2d",
    ready: "\u5df2\u5c31\u7eea",
    rendering: "\u751f\u6210\u4e2d",
  },
  summary: {
    activeRenders: "\u6d3b\u8dc3\u6e32\u67d3",
    presets: "\u9884\u8bbe",
    readyVideos: "\u5df2\u5c31\u7eea\u89c6\u9891",
    totalVideos: "\u89c6\u9891\u603b\u6570",
  },
};

const SDKWORK_VIDEO_MESSAGES: Record<SdkworkVideoLocale, SdkworkVideoMessages> = {
  "en-US": EN_US_MESSAGES,
  "zh-CN": ZH_CN_MESSAGES,
};

export function normalizeSdkworkVideoLocale(locale?: string | null): SdkworkVideoLocale {
  const normalized = String(locale || "").trim().toLowerCase();
  if (normalized.startsWith("zh")) {
    return "zh-CN";
  }

  return "en-US";
}

export function createSdkworkVideoMessages(
  locale?: string | null,
  overrides?: SdkworkVideoMessagesOverrides,
): SdkworkVideoMessages {
  return mergeDeep(
    SDKWORK_VIDEO_MESSAGES[normalizeSdkworkVideoLocale(locale)],
    overrides,
  );
}
