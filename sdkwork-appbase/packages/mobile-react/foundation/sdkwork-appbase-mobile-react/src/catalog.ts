import {
  SDKWORK_MOBILE_REACT_DOMAIN_LABELS,
  SDKWORK_MOBILE_REACT_DOMAIN_ORDER,
  type SdkworkMobileReactDomain,
} from "./domain";

export type SdkworkShellThemeColor = "zinc" | "lobster" | "green-tech" | "violet" | "rose";
export type SdkworkShellThemeSelection = "light" | "dark" | "system";
export type SdkworkMobileReactHost = "browser" | "capacitor" | "react-native";

export interface SdkworkCapabilityPackageMeta {
  capability: string;
  description: string;
  domain: SdkworkMobileReactDomain;
  packageName: `@sdkwork/${string}`;
  title: string;
}

export interface SdkworkCapabilityRegistry {
  domains: Array<{
    domain: SdkworkMobileReactDomain;
    label: string;
    packages: SdkworkCapabilityPackageMeta[];
  }>;
  packages: SdkworkCapabilityPackageMeta[];
  packagesByDomain: Record<SdkworkMobileReactDomain, SdkworkCapabilityPackageMeta[]>;
  packagesByName: Record<string, SdkworkCapabilityPackageMeta>;
}

export interface SdkworkAppCapabilityThemePreset {
  color: SdkworkShellThemeColor;
  preset: "sdkwork";
  selection: SdkworkShellThemeSelection;
}

export interface SdkworkAppCapabilityManifest {
  architecture: "mobile-react";
  description?: string;
  host: SdkworkMobileReactHost;
  id: string;
  packageNames: string[];
  theme: SdkworkAppCapabilityThemePreset;
  title: string;
}

export interface CreateSdkworkAppCapabilityManifestOptions {
  description?: string;
  host?: SdkworkMobileReactHost;
  id: string;
  packageNames?: string[];
  theme?: Partial<SdkworkAppCapabilityThemePreset>;
  title: string;
}

export interface SdkworkCapabilityPackageSelection {
  capabilities?: readonly string[];
  domains?: readonly SdkworkMobileReactDomain[];
  excludePackageNames?: readonly string[];
  includePackageNames?: readonly string[];
}

export type SdkworkMobileReactAppPresetId =
  | "assistant-mobile"
  | "core-mobile"
  | "creator-mobile"
  | "social-mobile"
  | "super-app-mobile";

export interface SdkworkMobileReactAppPreset {
  description: string;
  host: SdkworkMobileReactHost;
  id: SdkworkMobileReactAppPresetId;
  selection: SdkworkCapabilityPackageSelection;
  theme?: Partial<SdkworkAppCapabilityThemePreset>;
  title: string;
}

export interface CreateSdkworkAppCapabilityPresetManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "theme" | "title">
  > {
  excludePackageNames?: readonly string[];
  extraPackageNames?: readonly string[];
  registry?: SdkworkCapabilityRegistry;
}

export const SDKWORK_APPBASE_STANDARD_THEME_PRESET: SdkworkAppCapabilityThemePreset = {
  color: "zinc",
  preset: "sdkwork",
  selection: "system",
};

export const SDKWORK_MOBILE_REACT_APP_PRESETS: SdkworkMobileReactAppPreset[] = [
  {
    description: "Capacitor-first core preset for mobile shell, runtime, system surfaces, and IAM flows.",
    host: "capacitor",
    id: "core-mobile",
    selection: {
      domains: ["foundation", "host", "system", "iam"],
    },
    title: "Core Mobile",
  },
  {
    description: "AI-first mobile preset for assistant workbenches, model routing, and mobile knowledge flows.",
    host: "capacitor",
    id: "assistant-mobile",
    selection: {
      domains: ["foundation", "host", "system", "iam", "intelligence"],
    },
    title: "Assistant Mobile",
  },
  {
    description: "Communication-first mobile preset for chat, contacts, channels, and social graph composition.",
    host: "capacitor",
    id: "social-mobile",
    selection: {
      domains: ["foundation", "host", "system", "iam", "communication"],
    },
    title: "Social Mobile",
  },
  {
    description: "Creator-first mobile preset for content production, AI generation, and publishing flows.",
    host: "capacitor",
    id: "creator-mobile",
    selection: {
      domains: ["foundation", "host", "system", "iam", "content", "intelligence"],
    },
    title: "Creator Mobile",
  },
  {
    description: "Composable super-app mobile preset spanning communication, intelligence, commerce, device, and ecosystem capabilities.",
    host: "capacitor",
    id: "super-app-mobile",
    selection: {
      domains: [
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
      ],
    },
    title: "Super App Mobile",
  },
];

export const SDKWORK_MOBILE_REACT_STARTER_PACKAGES: SdkworkCapabilityPackageMeta[] = [
  {
    capability: "appbase",
    description: "Application preset and capability registry.",
    domain: "foundation",
    packageName: "@sdkwork/appbase-mobile-react",
    title: "Appbase",
  },
  {
    capability: "shell",
    description: "Mobile app shell, providers, and scene lifecycle.",
    domain: "foundation",
    packageName: "@sdkwork/shell-mobile-react",
    title: "Shell",
  },
  {
    capability: "router",
    description: "Deep-link contracts, route registration, and navigation manifests.",
    domain: "foundation",
    packageName: "@sdkwork/router-mobile-react",
    title: "Router",
  },
  {
    capability: "workspace",
    description: "Scene-stack, tab-shell, and sheet-based workspace composition.",
    domain: "foundation",
    packageName: "@sdkwork/workspace-mobile-react",
    title: "Workspace",
  },
  {
    capability: "command",
    description: "Quick actions, slash commands, and spotlight sheet registry.",
    domain: "foundation",
    packageName: "@sdkwork/command-mobile-react",
    title: "Command",
  },
  {
    capability: "search",
    description: "Cross-capability mobile search and indexing.",
    domain: "foundation",
    packageName: "@sdkwork/search-mobile-react",
    title: "Search",
  },
  {
    capability: "host",
    description: "Host abstraction for mobile React environments.",
    domain: "host",
    packageName: "@sdkwork/host-mobile-react",
    title: "Host",
  },
  {
    capability: "host-native",
    description: "Native host adapter for Capacitor and React Native bridges.",
    domain: "host",
    packageName: "@sdkwork/host-native-mobile-react",
    title: "Host Native",
  },
  {
    capability: "runtime",
    description: "Lifecycle, background task, and push-entry orchestration.",
    domain: "host",
    packageName: "@sdkwork/runtime-mobile-react",
    title: "Runtime",
  },
  {
    capability: "settings",
    description: "Settings center and environment preferences.",
    domain: "system",
    packageName: "@sdkwork/settings-mobile-react",
    title: "Settings",
  },
  {
    capability: "permission",
    description: "Capability permissions, access gating, and consent routing.",
    domain: "system",
    packageName: "@sdkwork/permission-mobile-react",
    title: "Permission",
  },
  {
    capability: "notification",
    description: "Push inbox, banners, and system notifications.",
    domain: "system",
    packageName: "@sdkwork/notification-mobile-react",
    title: "Notification",
  },
  {
    capability: "home",
    description: "Personalized home entry and startup routing.",
    domain: "system",
    packageName: "@sdkwork/home-mobile-react",
    title: "Home",
  },
  {
    capability: "dashboard",
    description: "Cross-capability overview cards and operational routing.",
    domain: "system",
    packageName: "@sdkwork/dashboard-mobile-react",
    title: "Dashboard",
  },
  {
    capability: "apps",
    description: "App center catalogs, install readiness, and launcher routing.",
    domain: "system",
    packageName: "@sdkwork/apps-mobile-react",
    title: "Apps",
  },
  {
    capability: "support",
    description: "Support-center catalogs, escalation recommendation, and help routing.",
    domain: "system",
    packageName: "@sdkwork/support-mobile-react",
    title: "Support",
  },
  {
    capability: "docs",
    description: "Embedded documentation libraries and article routing.",
    domain: "system",
    packageName: "@sdkwork/docs-mobile-react",
    title: "Docs",
  },
  {
    capability: "news",
    description: "Editorial feeds, featured stories, and newsroom routing.",
    domain: "system",
    packageName: "@sdkwork/news-mobile-react",
    title: "News",
  },
  {
    capability: "about",
    description: "App identity, runtime summaries, and legal entry points.",
    domain: "system",
    packageName: "@sdkwork/about-mobile-react",
    title: "About",
  },
  {
    capability: "auth",
    description: "Authentication, session, and access guard flows.",
    domain: "iam",
    packageName: "@sdkwork/auth-mobile-react",
    title: "Auth",
  },
  {
    capability: "user",
    description: "User center and account profile surfaces.",
    domain: "iam",
    packageName: "@sdkwork/user-mobile-react",
    title: "User",
  },
  {
    capability: "im",
    description: "Instant messaging sessions, unread state, and inbox routing.",
    domain: "communication",
    packageName: "@sdkwork/im-mobile-react",
    title: "IM",
  },
  {
    capability: "rtc",
    description: "Realtime audio and video sessions with call routing.",
    domain: "communication",
    packageName: "@sdkwork/rtc-mobile-react",
    title: "RTC",
  },
  {
    capability: "contacts",
    description: "People directory, relationship state, and picker flows.",
    domain: "communication",
    packageName: "@sdkwork/contacts-mobile-react",
    title: "Contacts",
  },
  {
    capability: "social",
    description: "Personalized timelines, profile discovery, and social graph routing.",
    domain: "communication",
    packageName: "@sdkwork/social-mobile-react",
    title: "Social",
  },
  {
    capability: "community",
    description: "Public discussions, recommendation rails, and moderation-aware routing.",
    domain: "communication",
    packageName: "@sdkwork/community-mobile-react",
    title: "Community",
  },
  {
    capability: "channel",
    description: "External channel catalogs, connector health, and entry points.",
    domain: "communication",
    packageName: "@sdkwork/channel-mobile-react",
    title: "Channel",
  },
  {
    capability: "chat",
    description: "AI chat sessions, composer readiness, and streaming assistant state.",
    domain: "intelligence",
    packageName: "@sdkwork/chat-mobile-react",
    title: "Chat",
  },
  {
    capability: "llm",
    description: "Inference execution planning, provider routing, and telemetry summaries.",
    domain: "intelligence",
    packageName: "@sdkwork/llm-mobile-react",
    title: "LLM",
  },
  {
    capability: "models",
    description: "Provider model catalogs, access policy, and recommendation fit.",
    domain: "intelligence",
    packageName: "@sdkwork/models-mobile-react",
    title: "Models",
  },
  {
    capability: "agent",
    description: "Agent manifests, readiness evaluation, and runtime policy routing.",
    domain: "intelligence",
    packageName: "@sdkwork/agent-mobile-react",
    title: "Agent",
  },
  {
    capability: "prompt",
    description: "Versioned prompt assets, variable rendering, and reusable prompt bundles.",
    domain: "intelligence",
    packageName: "@sdkwork/prompt-mobile-react",
    title: "Prompt",
  },
  {
    capability: "memory",
    description: "Memory records, retention summaries, and assistant-aware routing.",
    domain: "intelligence",
    packageName: "@sdkwork/memory-mobile-react",
    title: "Memory",
  },
  {
    capability: "knowledge",
    description: "Knowledge spaces, indexing readiness, and retrieval summaries.",
    domain: "intelligence",
    packageName: "@sdkwork/knowledge-mobile-react",
    title: "Knowledge",
  },
  {
    capability: "mcp",
    description: "MCP server catalogs, transport readiness, and capability-aware routing.",
    domain: "intelligence",
    packageName: "@sdkwork/mcp-mobile-react",
    title: "MCP",
  },
  {
    capability: "tools",
    description: "Tool catalogs, risk-aware selection, and execution summaries.",
    domain: "intelligence",
    packageName: "@sdkwork/tools-mobile-react",
    title: "Tools",
  },
  {
    capability: "skills",
    description: "Skill definitions, install readiness, and workflow reuse routing.",
    domain: "intelligence",
    packageName: "@sdkwork/skills-mobile-react",
    title: "Skills",
  },
  {
    capability: "workflow",
    description: "Workflow manifests, graph readiness, and orchestration route intents.",
    domain: "intelligence",
    packageName: "@sdkwork/workflow-mobile-react",
    title: "Workflow",
  },
  {
    capability: "drive",
    description: "Drive spaces, file workflows, and mobile storage routing.",
    domain: "content",
    packageName: "@sdkwork/drive-mobile-react",
    title: "Drive",
  },
  {
    capability: "notes",
    description: "Notes, drafts, and lightweight content capture flows.",
    domain: "content",
    packageName: "@sdkwork/notes-mobile-react",
    title: "Notes",
  },
  {
    capability: "editor",
    description: "Rich-text and structured content editing workspaces.",
    domain: "content",
    packageName: "@sdkwork/editor-mobile-react",
    title: "Editor",
  },
  {
    capability: "media",
    description: "Media browsing, playback, and asset preparation surfaces.",
    domain: "content",
    packageName: "@sdkwork/media-mobile-react",
    title: "Media",
  },
  {
    capability: "assets",
    description: "Generated and uploaded asset libraries with reuse routing.",
    domain: "content",
    packageName: "@sdkwork/assets-mobile-react",
    title: "Assets",
  },
  {
    capability: "image",
    description: "Image generation, editing, and preview workflows.",
    domain: "content",
    packageName: "@sdkwork/image-mobile-react",
    title: "Image",
  },
  {
    capability: "audio",
    description: "Audio capture, playback, and generation workflows.",
    domain: "content",
    packageName: "@sdkwork/audio-mobile-react",
    title: "Audio",
  },
  {
    capability: "video",
    description: "Video capture, editing, and generation workflows.",
    domain: "content",
    packageName: "@sdkwork/video-mobile-react",
    title: "Video",
  },
  {
    capability: "generation",
    description: "AI generation workspaces across text, image, audio, and video.",
    domain: "content",
    packageName: "@sdkwork/generation-mobile-react",
    title: "Generation",
  },
  {
    capability: "commerce",
    description: "Product catalogs, subscriptions, and purchase orchestration.",
    domain: "commerce",
    packageName: "@sdkwork/commerce-mobile-react",
    title: "Commerce",
  },
  {
    capability: "wallet",
    description: "Wallet balance, payment instruments, and transaction routing.",
    domain: "commerce",
    packageName: "@sdkwork/wallet-mobile-react",
    title: "Wallet",
  },
  {
    capability: "points",
    description: "Points balances, earning rules, and redemption flows.",
    domain: "commerce",
    packageName: "@sdkwork/points-mobile-react",
    title: "Points",
  },
  {
    capability: "order",
    description: "Order histories, fulfillment state, and transaction details.",
    domain: "commerce",
    packageName: "@sdkwork/order-mobile-react",
    title: "Order",
  },
  {
    capability: "device",
    description: "Local device capabilities, diagnostics, and hardware-aware workflows.",
    domain: "device",
    packageName: "@sdkwork/device-mobile-react",
    title: "Device",
  },
  {
    capability: "iot",
    description: "Connected device orchestration and ambient control surfaces.",
    domain: "device",
    packageName: "@sdkwork/iot-mobile-react",
    title: "IoT",
  },
  {
    capability: "distribution",
    description: "Install, packaging, and distribution-aware release workflows.",
    domain: "device",
    packageName: "@sdkwork/distribution-mobile-react",
    title: "Distribution",
  },
  {
    capability: "plugin",
    description: "Plugin catalogs, capability extensions, and install readiness.",
    domain: "ecosystem",
    packageName: "@sdkwork/plugin-mobile-react",
    title: "Plugin",
  },
  {
    capability: "market",
    description: "Marketplace discovery, monetization, and ecosystem distribution.",
    domain: "ecosystem",
    packageName: "@sdkwork/market-mobile-react",
    title: "Market",
  },
];

export function createCapabilityRegistry(
  packages: readonly SdkworkCapabilityPackageMeta[] = SDKWORK_MOBILE_REACT_STARTER_PACKAGES,
): SdkworkCapabilityRegistry {
  const packagesByName = packages.reduce<Record<string, SdkworkCapabilityPackageMeta>>(
    (accumulator, item) => {
      if (accumulator[item.packageName]) {
        throw new Error(`Duplicate capability package: ${item.packageName}`);
      }

      accumulator[item.packageName] = item;
      return accumulator;
    },
    {},
  );

  const packagesByDomain = SDKWORK_MOBILE_REACT_DOMAIN_ORDER.reduce<
    Record<SdkworkMobileReactDomain, SdkworkCapabilityPackageMeta[]>
  >((accumulator, domain) => {
    accumulator[domain] = packages.filter((item) => item.domain === domain);
    return accumulator;
  }, {} as Record<SdkworkMobileReactDomain, SdkworkCapabilityPackageMeta[]>);

  return {
    domains: SDKWORK_MOBILE_REACT_DOMAIN_ORDER.map((domain) => ({
      domain,
      label: SDKWORK_MOBILE_REACT_DOMAIN_LABELS[domain],
      packages: packagesByDomain[domain],
    })),
    packages: [...packages].sort((left, right) => left.title.localeCompare(right.title)),
    packagesByDomain,
    packagesByName,
  };
}

export function selectCapabilityPackagesByDomain(
  registry: SdkworkCapabilityRegistry,
  domains: readonly SdkworkMobileReactDomain[],
): SdkworkCapabilityPackageMeta[] {
  return domains.flatMap((domain) => registry.packagesByDomain[domain] ?? []);
}

function toUniqueStrings(values: readonly string[] | undefined): string[] {
  return Array.from(new Set((values ?? []).map((value) => value.trim()).filter(Boolean)));
}

function createRegistryOrderIndex(
  registry: SdkworkCapabilityRegistry,
): Record<string, number> {
  let index = 0;
  const orderIndex: Record<string, number> = {};

  for (const domain of SDKWORK_MOBILE_REACT_DOMAIN_ORDER) {
    for (const item of registry.packagesByDomain[domain] ?? []) {
      orderIndex[item.packageName] = index;
      index += 1;
    }
  }

  return orderIndex;
}

function resolveCapabilityMeta(
  registry: SdkworkCapabilityRegistry,
  capability: string,
): SdkworkCapabilityPackageMeta {
  const resolved = registry.packages.find((item) => item.capability === capability);
  if (!resolved) {
    throw new Error(`Unknown capability: ${capability}`);
  }

  return resolved;
}

export function resolveCapabilityPackages(
  registry: SdkworkCapabilityRegistry,
  selection: SdkworkCapabilityPackageSelection = {},
): SdkworkCapabilityPackageMeta[] {
  const orderIndex = createRegistryOrderIndex(registry);
  const selectedPackages = new Map<string, SdkworkCapabilityPackageMeta>();

  for (const domain of selection.domains ?? []) {
    for (const item of registry.packagesByDomain[domain] ?? []) {
      selectedPackages.set(item.packageName, item);
    }
  }

  for (const capability of selection.capabilities ?? []) {
    const resolved = resolveCapabilityMeta(registry, capability);
    selectedPackages.set(resolved.packageName, resolved);
  }

  for (const packageName of selection.includePackageNames ?? []) {
    const resolved = registry.packagesByName[packageName];
    if (resolved) {
      selectedPackages.set(resolved.packageName, resolved);
    }
  }

  const excludedPackages = new Set(toUniqueStrings(selection.excludePackageNames));

  return Array.from(selectedPackages.values())
    .filter((item) => !excludedPackages.has(item.packageName))
    .sort(
      (left, right) =>
        (orderIndex[left.packageName] ?? Number.MAX_SAFE_INTEGER) -
          (orderIndex[right.packageName] ?? Number.MAX_SAFE_INTEGER) ||
        left.title.localeCompare(right.title),
    );
}

export function resolveCapabilityPackageNames(
  registry: SdkworkCapabilityRegistry,
  selection: SdkworkCapabilityPackageSelection = {},
): string[] {
  const excludedPackages = new Set(toUniqueStrings(selection.excludePackageNames));
  const knownPackageNames = resolveCapabilityPackages(registry, selection).map(
    (item) => item.packageName,
  );
  const unknownIncludedPackageNames = toUniqueStrings(selection.includePackageNames).filter(
    (packageName) =>
      !registry.packagesByName[packageName] && !excludedPackages.has(packageName),
  );

  return [...knownPackageNames, ...unknownIncludedPackageNames];
}

export function createSdkworkAppCapabilityPresetManifest(
  presetId: SdkworkMobileReactAppPresetId,
  options: CreateSdkworkAppCapabilityPresetManifestOptions = {},
): SdkworkAppCapabilityManifest {
  const preset = SDKWORK_MOBILE_REACT_APP_PRESETS.find((item) => item.id === presetId);
  if (!preset) {
    throw new Error(`Unknown app preset: ${presetId}`);
  }

  const registry = options.registry ?? createCapabilityRegistry();
  const packageNames = resolveCapabilityPackageNames(registry, {
    ...preset.selection,
    excludePackageNames: [
      ...(preset.selection.excludePackageNames ?? []),
      ...(options.excludePackageNames ?? []),
    ],
    includePackageNames: [
      ...(preset.selection.includePackageNames ?? []),
      ...(options.extraPackageNames ?? []),
    ],
  });

  return createSdkworkAppCapabilityManifest({
    description: options.description ?? preset.description,
    host: options.host ?? preset.host,
    id: options.id ?? preset.id,
    packageNames,
    theme: {
      ...preset.theme,
      ...options.theme,
    },
    title: options.title ?? preset.title,
  });
}

export function createSdkworkAppCapabilityManifest({
  description,
  host = "capacitor",
  id,
  packageNames = SDKWORK_MOBILE_REACT_STARTER_PACKAGES.map((item) => item.packageName),
  theme,
  title,
}: CreateSdkworkAppCapabilityManifestOptions): SdkworkAppCapabilityManifest {
  return {
    architecture: "mobile-react",
    description,
    host,
    id,
    packageNames: Array.from(new Set(packageNames)),
    theme: {
      ...SDKWORK_APPBASE_STANDARD_THEME_PRESET,
      ...theme,
      preset: "sdkwork",
    },
    title,
  };
}

export const appbasePackageMeta = {
  architecture: "mobile-react",
  domain: "foundation",
  package: "@sdkwork/appbase-mobile-react",
  status: "ready",
} as const;

export type AppbasePackageMeta = typeof appbasePackageMeta;
