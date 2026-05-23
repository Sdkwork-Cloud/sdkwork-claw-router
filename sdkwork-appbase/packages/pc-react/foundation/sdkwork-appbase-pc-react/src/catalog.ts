import {
  SDKWORK_PC_REACT_DOMAIN_LABELS,
  SDKWORK_PC_REACT_DOMAIN_ORDER,
  type SdkworkPcReactDomain,
} from "./domain";

export type SdkworkShellThemeColor = "zinc" | "lobster" | "green-tech" | "tech-blue" | "violet" | "rose";
export type SdkworkShellThemeSelection = "light" | "dark" | "system";
export type SdkworkPcReactHost = "browser" | "server" | "tauri";

export interface SdkworkCapabilityPackageMeta {
  capability: string;
  description: string;
  domain: SdkworkPcReactDomain;
  packageName: `@sdkwork/${string}`;
  title: string;
}

export interface SdkworkCapabilityRegistry {
  domains: Array<{
    domain: SdkworkPcReactDomain;
    label: string;
    packages: SdkworkCapabilityPackageMeta[];
  }>;
  packages: SdkworkCapabilityPackageMeta[];
  packagesByDomain: Record<SdkworkPcReactDomain, SdkworkCapabilityPackageMeta[]>;
  packagesByName: Record<string, SdkworkCapabilityPackageMeta>;
}

export interface SdkworkAppCapabilityThemePreset {
  color: SdkworkShellThemeColor;
  preset: "sdkwork";
  selection: SdkworkShellThemeSelection;
}

export interface SdkworkAppCapabilityManifest {
  architecture: "pc-react";
  description?: string;
  host: SdkworkPcReactHost;
  id: string;
  packageNames: string[];
  theme: SdkworkAppCapabilityThemePreset;
  title: string;
}

export interface CreateSdkworkAppCapabilityManifestOptions {
  description?: string;
  host?: SdkworkPcReactHost;
  id: string;
  packageNames?: string[];
  theme?: Partial<SdkworkAppCapabilityThemePreset>;
  title: string;
}

export interface SdkworkCapabilityPackageSelection {
  capabilities?: readonly string[];
  domains?: readonly SdkworkPcReactDomain[];
  excludePackageNames?: readonly string[];
  includePackageNames?: readonly string[];
}

export type SdkworkPcReactAppPresetId =
  | "assistant-desktop"
  | "browser-portal"
  | "collaboration-desktop"
  | "core-desktop";

export interface SdkworkPcReactAppPreset {
  description: string;
  host: SdkworkPcReactHost;
  id: SdkworkPcReactAppPresetId;
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
  color: "lobster",
  preset: "sdkwork",
  selection: "system",
};

export const SDKWORK_PC_REACT_APP_PRESETS: SdkworkPcReactAppPreset[] = [
  {
    description: "Desktop-first core preset for shell, host, system surfaces, and IAM flows.",
    host: "tauri",
    id: "core-desktop",
    selection: {
      domains: ["foundation", "host", "system", "notification", "iam"],
    },
    title: "Core Desktop",
  },
  {
    description: "Desktop assistant preset for AI workbenches, model routing, and operational system surfaces.",
    host: "tauri",
    id: "assistant-desktop",
    selection: {
      domains: ["foundation", "host", "system", "notification", "iam", "intelligence"],
    },
    title: "Assistant Desktop",
  },
  {
    description: "Desktop collaboration preset for messaging, realtime sessions, and people-centric workflows.",
    host: "tauri",
    id: "collaboration-desktop",
    selection: {
      domains: ["foundation", "host", "system", "notification", "iam", "communication"],
    },
    title: "Collaboration Desktop",
  },
  {
    description: "Browser-first portal preset for docs, apps, support, and newsroom surfaces.",
    host: "browser",
    id: "browser-portal",
    selection: {
      domains: ["foundation", "system", "notification", "iam"],
      excludePackageNames: ["@sdkwork/permission-pc-react"],
    },
    title: "Browser Portal",
  },
];

export const SDKWORK_PC_REACT_STARTER_PACKAGES: SdkworkCapabilityPackageMeta[] = [
  {
    capability: "appbase",
    description: "Application preset and capability registry.",
    domain: "foundation",
    packageName: "@sdkwork/appbase-pc-react",
    title: "Appbase",
  },
  {
    capability: "i18n",
    description: "Internationalization runtime and message catalog facade.",
    domain: "foundation",
    packageName: "@sdkwork/i18n-pc-react",
    title: "I18n",
  },
  {
    capability: "shell",
    description: "App shell, providers, and shell lifecycle.",
    domain: "foundation",
    packageName: "@sdkwork/shell-pc-react",
    title: "Shell",
  },
  {
    capability: "router",
    description: "Route registration and navigation manifests.",
    domain: "foundation",
    packageName: "@sdkwork/router-pc-react",
    title: "Router",
  },
  {
    capability: "workspace",
    description: "Workbench panels and workspace composition.",
    domain: "foundation",
    packageName: "@sdkwork/workspace-pc-react",
    title: "Workspace",
  },
  {
    capability: "command",
    description: "Command palette and keyboard action registry.",
    domain: "foundation",
    packageName: "@sdkwork/command-pc-react",
    title: "Command",
  },
  {
    capability: "search",
    description: "Cross-capability search and indexing.",
    domain: "foundation",
    packageName: "@sdkwork/search-pc-react",
    title: "Search",
  },
  {
    capability: "host",
    description: "Host abstraction for PC application environments.",
    domain: "host",
    packageName: "@sdkwork/host-pc-react",
    title: "Host",
  },
  {
    capability: "host-tauri",
    description: "Tauri host adapter and native bridge.",
    domain: "host",
    packageName: "@sdkwork/host-tauri-pc-react",
    title: "Host Tauri",
  },
  {
    capability: "desktop",
    description: "Desktop windowing, updater, and OS integration.",
    domain: "host",
    packageName: "@sdkwork/desktop-pc-react",
    title: "Desktop",
  },
  {
    capability: "settings",
    description: "Settings center and environment preferences.",
    domain: "system",
    packageName: "@sdkwork/settings-pc-react",
    title: "Settings",
  },
  {
    capability: "notification",
    description: "Toast, inbox, and system notifications.",
    domain: "notification",
    packageName: "@sdkwork/notification-pc-react",
    title: "Notification",
  },
  {
    capability: "permission",
    description: "Capability permissions, access gating, and consent routing.",
    domain: "system",
    packageName: "@sdkwork/permission-pc-react",
    title: "Permission",
  },
  {
    capability: "dashboard",
    description: "Cross-capability overview cards, health signals, and operational routing.",
    domain: "system",
    packageName: "@sdkwork/dashboard-pc-react",
    title: "Dashboard",
  },
  {
    capability: "apps",
    description: "App center catalogs, install readiness, and launcher routing.",
    domain: "system",
    packageName: "@sdkwork/apps-pc-react",
    title: "Apps",
  },
  {
    capability: "home",
    description: "Personalized home entry, quick-start composition, and startup routing.",
    domain: "system",
    packageName: "@sdkwork/home-pc-react",
    title: "Home",
  },
  {
    capability: "docs",
    description: "Embedded documentation libraries, quickstart progression, and article routing.",
    domain: "system",
    packageName: "@sdkwork/docs-pc-react",
    title: "Docs",
  },
  {
    capability: "support",
    description: "Support-center catalogs, escalation recommendation, and operational help routing.",
    domain: "system",
    packageName: "@sdkwork/support-pc-react",
    title: "Support",
  },
  {
    capability: "news",
    description: "Editorial feeds, featured-story selection, related reading, and newsroom routing.",
    domain: "system",
    packageName: "@sdkwork/news-pc-react",
    title: "News",
  },
  {
    capability: "about",
    description: "App identity, runtime summaries, legal entry points, and about routing.",
    domain: "system",
    packageName: "@sdkwork/about-pc-react",
    title: "About",
  },
  {
    capability: "auth",
    description: "Authentication, session, and access guard flows.",
    domain: "iam",
    packageName: "@sdkwork/auth-pc-react",
    title: "Auth",
  },
  {
    capability: "user",
    description: "User center and account profile surfaces.",
    domain: "iam",
    packageName: "@sdkwork/user-pc-react",
    title: "User",
  },
  {
    capability: "wallet",
    description: "Wallet balances, recharge actions, and payment method surfaces.",
    domain: "commerce",
    packageName: "@sdkwork/wallet-pc-react",
    title: "Wallet",
  },
  {
    capability: "points",
    description: "Points, credits, quota balances, and consumption history.",
    domain: "commerce",
    packageName: "@sdkwork/points-pc-react",
    title: "Points",
  },
  {
    capability: "vip",
    description: "Membership tiers, entitlements, and upgrade flows.",
    domain: "commerce",
    packageName: "@sdkwork/vip-pc-react",
    title: "VIP",
  },
  {
    capability: "vip-purchase",
    description: "VIP purchase header entry, package chooser, and reusable membership purchase menu.",
    domain: "commerce",
    packageName: "@sdkwork/vip-purchase-pc-react",
    title: "VIP Purchase",
  },
  {
    capability: "vip-admin",
    description: "Admin VIP management for levels, packages, memberships, and entitlements.",
    domain: "commerce",
    packageName: "@sdkwork/vip-admin-pc-react",
    title: "VIP Admin",
  },
  {
    capability: "entitlement",
    description: "Commercial access policy, paywall evaluation, and reusable entitlement center surfaces.",
    domain: "commerce",
    packageName: "@sdkwork/entitlement-pc-react",
    title: "Entitlement",
  },
  {
    capability: "coupon",
    description: "Coupon discovery, redemption, points exchange, and checkout-ready discount inventory.",
    domain: "commerce",
    packageName: "@sdkwork/coupon-pc-react",
    title: "Coupon",
  },
  {
    capability: "offer",
    description: "Shared commercial offer cards, featured pricing opportunities, and reusable routing into coupon, points, and subscription workspaces.",
    domain: "commerce",
    packageName: "@sdkwork/offer-pc-react",
    title: "Offer",
  },
  {
    capability: "pricing",
    description: "Price books, plan comparison, bundle strategy, and reusable pricing-center surfaces.",
    domain: "commerce",
    packageName: "@sdkwork/pricing-pc-react",
    title: "Pricing",
  },
  {
    capability: "checkout",
    description: "Checkout orchestration, payment-method selection, invoice posture, and reusable transaction-session surfaces.",
    domain: "commerce",
    packageName: "@sdkwork/checkout-pc-react",
    title: "Checkout",
  },
  {
    capability: "subscription",
    description: "Subscription checkout, coupon application, and premium membership selection.",
    domain: "commerce",
    packageName: "@sdkwork/subscription-pc-react",
    title: "Subscription",
  },
  {
    capability: "order",
    description: "Orders, billing details, and transaction histories.",
    domain: "commerce",
    packageName: "@sdkwork/order-pc-react",
    title: "Orders",
  },
  {
    capability: "payment",
    description: "Payment orchestration, payment methods, status tracking, and QR-aware payment center surfaces.",
    domain: "commerce",
    packageName: "@sdkwork/payment-pc-react",
    title: "Payment",
  },
  {
    capability: "invoice",
    description: "Invoice applications, billing documents, and tax-ready history surfaces.",
    domain: "commerce",
    packageName: "@sdkwork/invoice-pc-react",
    title: "Invoices",
  },
  {
    capability: "billing",
    description: "Billing posture, metered usage, budget alerts, and reusable billing-center surfaces.",
    domain: "commerce",
    packageName: "@sdkwork/billing-pc-react",
    title: "Billing",
  },
  {
    capability: "commerce",
    description: "Commerce workflows, offers, and pricing-aware capability composition.",
    domain: "commerce",
    packageName: "@sdkwork/commerce-pc-react",
    title: "Commerce",
  },
  {
    capability: "open-platform-admin",
    description: "Admin management for provider-neutral official accounts, mini apps, QR entries, and pay bindings.",
    domain: "integration",
    packageName: "@sdkwork/open-platform-admin-pc-react",
    title: "Open Platform Admin",
  },
  {
    capability: "drive",
    description: "Drive workspaces, sync status, storage posture, and shared space routing.",
    domain: "content",
    packageName: "@sdkwork/drive-pc-react",
    title: "Drive",
  },
  {
    capability: "notes",
    description: "Notes, knowledge pages, and document workspace summaries.",
    domain: "content",
    packageName: "@sdkwork/notes-pc-react",
    title: "Notes",
  },
  {
    capability: "editor",
    description: "Reusable editor contracts for code, markdown, and rich-text authoring.",
    domain: "content",
    packageName: "@sdkwork/editor-pc-react",
    title: "Editor",
  },
  {
    capability: "terminal",
    description: "Terminal sessions, profile switching, and shell-connected action routing.",
    domain: "content",
    packageName: "@sdkwork/terminal-pc-react",
    title: "Terminal",
  },
  {
    capability: "browser",
    description: "Embedded browser sessions, safe-preview posture, and web workspace routing.",
    domain: "content",
    packageName: "@sdkwork/browser-pc-react",
    title: "Browser",
  },
  {
    capability: "media",
    description: "Cross-media operations, review posture, and preview workflow coordination.",
    domain: "content",
    packageName: "@sdkwork/media-pc-react",
    title: "Media",
  },
  {
    capability: "assets",
    description: "Asset catalogs, license readiness, and reusable project resource organization.",
    domain: "content",
    packageName: "@sdkwork/assets-pc-react",
    title: "Assets",
  },
  {
    capability: "image",
    description: "Image generation jobs, style packs, and gallery-ready output tracking.",
    domain: "content",
    packageName: "@sdkwork/image-pc-react",
    title: "Image",
  },
  {
    capability: "audio",
    description: "Voice sessions, dubbing and transcription jobs, and audio quality posture.",
    domain: "content",
    packageName: "@sdkwork/audio-pc-react",
    title: "Audio",
  },
  {
    capability: "video",
    description: "Video scene pipelines, render readiness, and publish artifact summaries.",
    domain: "content",
    packageName: "@sdkwork/video-pc-react",
    title: "Video",
  },
  {
    capability: "canvas",
    description: "Visual canvas workspaces, node compositions, and flow-oriented authoring.",
    domain: "content",
    packageName: "@sdkwork/canvas-pc-react",
    title: "Canvas",
  },
  {
    capability: "generation",
    description: "Unified generation queues, result provenance, and task history routing.",
    domain: "content",
    packageName: "@sdkwork/generation-pc-react",
    title: "Generation",
  },
  {
    capability: "device",
    description: "Managed hardware catalogs, capability posture, and peripheral visibility.",
    domain: "device",
    packageName: "@sdkwork/device-pc-react",
    title: "Device",
  },
  {
    capability: "iot",
    description: "Remote fleet, gateways, alerts, and IoT endpoint monitoring surfaces.",
    domain: "device",
    packageName: "@sdkwork/iot-pc-react",
    title: "IoT",
  },
  {
    capability: "install",
    description: "Install-center workflows, runtime readiness, and guided environment preparation.",
    domain: "device",
    packageName: "@sdkwork/install-pc-react",
    title: "Install",
  },
  {
    capability: "distribution",
    description: "Release channels, artifact rollout, and distribution-center summaries.",
    domain: "device",
    packageName: "@sdkwork/distribution-pc-react",
    title: "Distribution",
  },
  {
    capability: "im",
    description: "Instant messaging sessions, unread state, and notification routing.",
    domain: "communication",
    packageName: "@sdkwork/im-pc-react",
    title: "IM",
  },
  {
    capability: "rtc",
    description: "Realtime audio and video sessions with call-window routing.",
    domain: "communication",
    packageName: "@sdkwork/rtc-pc-react",
    title: "RTC",
  },
  {
    capability: "contacts",
    description: "People directory, relationship state, and picker flows.",
    domain: "communication",
    packageName: "@sdkwork/contacts-pc-react",
    title: "Contacts",
  },
  {
    capability: "channel",
    description: "External channel catalogs, connector health, and routing-ready entry points.",
    domain: "communication",
    packageName: "@sdkwork/channel-pc-react",
    title: "Channel",
  },
  {
    capability: "community",
    description: "Public discussions, recommendation rails, and moderation-aware post routing.",
    domain: "communication",
    packageName: "@sdkwork/community-pc-react",
    title: "Community",
  },
  {
    capability: "social",
    description: "Personalized timelines, profile discovery, and social graph routing.",
    domain: "communication",
    packageName: "@sdkwork/social-pc-react",
    title: "Social",
  },
  {
    capability: "models",
    description: "Provider model catalogs, access policy, recommendation fit, and route intents.",
    domain: "intelligence",
    packageName: "@sdkwork/models-pc-react",
    title: "Models",
  },
  {
    capability: "llm",
    description: "Inference execution planning, stream lifecycle, provider routing, and telemetry summaries.",
    domain: "intelligence",
    packageName: "@sdkwork/llm-pc-react",
    title: "LLM",
  },
  {
    capability: "chat",
    description: "AI chat sessions, composer readiness, attachment summaries, and streaming assistant state.",
    domain: "intelligence",
    packageName: "@sdkwork/chat-pc-react",
    title: "Chat",
  },
  {
    capability: "prompt",
    description: "Versioned prompt assets, variable rendering, release labels, and reusable prompt bundles.",
    domain: "intelligence",
    packageName: "@sdkwork/prompt-pc-react",
    title: "Prompt",
  },
  {
    capability: "tools",
    description: "Tool catalogs, risk-aware selection, execution summaries, and LLM tool compilation.",
    domain: "intelligence",
    packageName: "@sdkwork/tools-pc-react",
    title: "Tools",
  },
  {
    capability: "mcp",
    description: "MCP server catalogs, transport readiness, and capability-aware routing.",
    domain: "intelligence",
    packageName: "@sdkwork/mcp-pc-react",
    title: "MCP",
  },
  {
    capability: "knowledge",
    description: "Knowledge spaces, indexing readiness, retrieval summaries, and citation-aware routing.",
    domain: "intelligence",
    packageName: "@sdkwork/knowledge-pc-react",
    title: "Knowledge",
  },
  {
    capability: "memory",
    description: "Memory records, retention summaries, recall scopes, and assistant-aware routing.",
    domain: "intelligence",
    packageName: "@sdkwork/memory-pc-react",
    title: "Memory",
  },
  {
    capability: "skills",
    description: "Skill definitions, install readiness, and assistant-workflow reuse routing.",
    domain: "intelligence",
    packageName: "@sdkwork/skills-pc-react",
    title: "Skills",
  },
  {
    capability: "agent",
    description: "Agent manifests, readiness evaluation, and runtime policy routing.",
    domain: "intelligence",
    packageName: "@sdkwork/agent-pc-react",
    title: "Agent",
  },
  {
    capability: "workflow",
    description: "Workflow manifests, graph readiness, execution summaries, and orchestration route intents.",
    domain: "intelligence",
    packageName: "@sdkwork/workflow-pc-react",
    title: "Workflow",
  },
  {
    capability: "plugin",
    description: "Plugin registry, lifecycle health, permissions posture, and extension routing.",
    domain: "ecosystem",
    packageName: "@sdkwork/plugin-pc-react",
    title: "Plugin",
  },
  {
    capability: "market",
    description: "Marketplace discovery for apps, skills, plugins, models, and install-ready items.",
    domain: "ecosystem",
    packageName: "@sdkwork/market-pc-react",
    title: "Market",
  },
];

export function createCapabilityRegistry(
  packages: readonly SdkworkCapabilityPackageMeta[] = SDKWORK_PC_REACT_STARTER_PACKAGES,
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

  const packagesByDomain = SDKWORK_PC_REACT_DOMAIN_ORDER.reduce<
    Record<SdkworkPcReactDomain, SdkworkCapabilityPackageMeta[]>
  >((accumulator, domain) => {
    accumulator[domain] = packages.filter((item) => item.domain === domain);
    return accumulator;
  }, {} as Record<SdkworkPcReactDomain, SdkworkCapabilityPackageMeta[]>);

  return {
    domains: SDKWORK_PC_REACT_DOMAIN_ORDER.map((domain) => ({
      domain,
      label: SDKWORK_PC_REACT_DOMAIN_LABELS[domain],
      packages: packagesByDomain[domain],
    })),
    packages: [...packages].sort((left, right) => left.title.localeCompare(right.title)),
    packagesByDomain,
    packagesByName,
  };
}

export function selectCapabilityPackagesByDomain(
  registry: SdkworkCapabilityRegistry,
  domains: readonly SdkworkPcReactDomain[],
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

  for (const domain of SDKWORK_PC_REACT_DOMAIN_ORDER) {
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
  presetId: SdkworkPcReactAppPresetId,
  options: CreateSdkworkAppCapabilityPresetManifestOptions = {},
): SdkworkAppCapabilityManifest {
  const preset = SDKWORK_PC_REACT_APP_PRESETS.find((item) => item.id === presetId);
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
  host = "tauri",
  id,
  packageNames = SDKWORK_PC_REACT_STARTER_PACKAGES.map((item) => item.packageName),
  theme,
  title,
}: CreateSdkworkAppCapabilityManifestOptions): SdkworkAppCapabilityManifest {
  return {
    architecture: "pc-react",
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
  architecture: "pc-react",
  domain: "foundation",
  package: "@sdkwork/appbase-pc-react",
  status: "ready",
} as const;

export type AppbasePackageMeta = typeof appbasePackageMeta;
