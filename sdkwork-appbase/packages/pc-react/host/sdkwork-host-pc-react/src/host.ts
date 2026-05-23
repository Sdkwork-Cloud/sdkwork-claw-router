import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
  type SdkworkPcReactHost,
} from "@sdkwork/appbase-pc-react";

export type SdkworkHostCapability =
  | "clipboard"
  | "fs"
  | "native-notification"
  | "process"
  | "theme-sync"
  | "tray"
  | "updater"
  | "window-controls";

export type SdkworkHostCapabilityCategory = "integration" | "runtime" | "system" | "window";
export type SdkworkHostPermissionLevel = "baseline" | "optional";

export interface SdkworkHostWindowChrome {
  decorations: boolean;
  dragRegion: boolean;
  startupReveal: "after-bootstrap" | "immediate";
  windowControls: "custom" | "native";
}

export interface SdkworkHostDescriptor {
  capabilities: SdkworkHostCapability[];
  commands: string[];
  events: string[];
  id: string;
  kind: SdkworkPcReactHost;
  label: string;
  windowChrome: SdkworkHostWindowChrome;
}

export interface CreateSdkworkHostDescriptorOptions {
  capabilities?: readonly SdkworkHostCapability[];
  commands?: readonly string[];
  events?: readonly string[];
  id: string;
  kind: SdkworkPcReactHost;
  label: string;
  windowChrome?: Partial<SdkworkHostWindowChrome>;
}

export interface SdkworkHostCapabilityCatalogEntry {
  capability: SdkworkHostCapability;
  category: SdkworkHostCapabilityCategory;
  hostKinds: SdkworkPcReactHost[];
  label: string;
  requiredByDefault: boolean;
}

export interface CreateSdkworkHostCapabilityCatalogOptions {
  capabilities?: readonly SdkworkHostCapability[];
}

export interface SdkworkHostCommandCatalogEntry {
  command: string;
  critical: boolean;
  id: string;
  label: string;
  namespace: string;
}

export interface CreateSdkworkHostCommandCatalogOptions {
  criticalCommands?: readonly string[];
}

export interface SdkworkHostEventCatalogEntry {
  critical: boolean;
  event: string;
  label: string;
  namespace: string;
  topic: string;
}

export interface CreateSdkworkHostEventCatalogOptions {
  criticalEvents?: readonly string[];
}

export interface SdkworkHostPermissionEntry {
  capability: SdkworkHostCapability;
  label: string;
  level: SdkworkHostPermissionLevel;
  reason: string;
}

export interface EvaluateSdkworkHostReadinessOptions {
  requiredCapabilities?: readonly SdkworkHostCapability[];
}

export interface SdkworkHostReadinessSummary {
  availableCapabilities: SdkworkHostCapability[];
  missingCapabilities: SdkworkHostCapability[];
  ready: boolean;
  requiredCapabilities: SdkworkHostCapability[];
  supportsCustomChrome: boolean;
  supportsTrayRecovery: boolean;
}

export interface SdkworkHostManifest extends SdkworkAppCapabilityManifest {
  capabilities: SdkworkHostCapability[];
  capability: "host";
  commandIds: string[];
  eventTopics: string[];
  hostKind: SdkworkPcReactHost;
  requiredCapabilities: SdkworkHostCapability[];
}

export interface CreateSdkworkHostManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  descriptor: SdkworkHostDescriptor;
  requiredCapabilities?: readonly SdkworkHostCapability[];
}

const DEFAULT_HOST_CAPABILITIES: Record<SdkworkPcReactHost, readonly SdkworkHostCapability[]> = {
  browser: [
    "theme-sync",
    "clipboard",
  ],
  server: [],
  tauri: [
    "theme-sync",
    "clipboard",
    "window-controls",
    "tray",
  ],
};

const DEFAULT_HOST_WINDOW_CHROME: Record<SdkworkPcReactHost, SdkworkHostWindowChrome> = {
  browser: {
    decorations: true,
    dragRegion: false,
    startupReveal: "immediate",
    windowControls: "native",
  },
  server: {
    decorations: false,
    dragRegion: false,
    startupReveal: "immediate",
    windowControls: "native",
  },
  tauri: {
    decorations: false,
    dragRegion: true,
    startupReveal: "after-bootstrap",
    windowControls: "custom",
  },
};

const HOST_CAPABILITY_METADATA: Record<SdkworkHostCapability, Omit<SdkworkHostCapabilityCatalogEntry, "requiredByDefault">> = {
  clipboard: {
    capability: "clipboard",
    category: "system",
    hostKinds: ["browser", "tauri"],
    label: "Clipboard",
  },
  fs: {
    capability: "fs",
    category: "system",
    hostKinds: ["tauri"],
    label: "File System",
  },
  "native-notification": {
    capability: "native-notification",
    category: "integration",
    hostKinds: ["tauri"],
    label: "Native Notification",
  },
  process: {
    capability: "process",
    category: "runtime",
    hostKinds: ["tauri"],
    label: "Process Runtime",
  },
  "theme-sync": {
    capability: "theme-sync",
    category: "runtime",
    hostKinds: ["browser", "tauri"],
    label: "Theme Sync",
  },
  tray: {
    capability: "tray",
    category: "window",
    hostKinds: ["tauri"],
    label: "System Tray",
  },
  updater: {
    capability: "updater",
    category: "integration",
    hostKinds: ["tauri"],
    label: "Updater",
  },
  "window-controls": {
    capability: "window-controls",
    category: "window",
    hostKinds: ["tauri"],
    label: "Window Controls",
  },
};

const HOST_PERMISSION_REASONS: Record<SdkworkHostCapability, string> = {
  clipboard: "Keeps cross-surface copy and paste flows consistent between host and web runtime layers.",
  fs: "Allows desktop workspaces to open, read, and persist files through the native host.",
  "native-notification": "Allows the host to present system notifications when the workspace is not focused.",
  process: "Allows managed local processes and background services to run through the desktop host.",
  "theme-sync": "Keeps host chrome and application theme selection aligned.",
  tray: "Allows the app to hide to tray, restore from tray, and expose background recovery entry points.",
  updater: "Allows the host to check for, download, and apply native application updates.",
  "window-controls": "Allows the app shell to manage minimize, maximize, restore, and custom title-bar interactions.",
};

const HOST_AMBIENT_CAPABILITIES: readonly SdkworkHostCapability[] = [
  "clipboard",
  "theme-sync",
];

function normalizeSegment(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${label} is required`);
  }

  return normalized;
}

function dedupeValues<T>(values: readonly T[]): T[] {
  return Array.from(new Set(values));
}

function toUniqueStrings(values: readonly string[] | undefined): string[] {
  return Array.from(new Set((values ?? []).map((value) => value.trim()).filter(Boolean)));
}

function toTitleCaseSegment(value: string): string {
  return value
    .split(/[_-]+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function toCommandLabel(command: string): string {
  return toTitleCaseSegment(command);
}

function toEventLabel(event: string): string {
  return toTitleCaseSegment(event);
}

export function createHostCommandId(namespace: string, command: string): string {
  return `${normalizeSegment(namespace, "Command namespace")}:${normalizeSegment(command, "Command id")}`;
}

export function createHostEventTopic(namespace: string, event: string): string {
  return `${normalizeSegment(namespace, "Event namespace")}://${normalizeSegment(event, "Event id")}`;
}

export function createHostDescriptor({
  capabilities = [],
  commands = [],
  events = [],
  id,
  kind,
  label,
  windowChrome,
}: CreateSdkworkHostDescriptorOptions): SdkworkHostDescriptor {
  return {
    capabilities: dedupeValues([
      ...DEFAULT_HOST_CAPABILITIES[kind],
      ...capabilities,
    ]),
    commands: toUniqueStrings(commands),
    events: toUniqueStrings(events),
    id: normalizeSegment(id, "Host id"),
    kind,
    label: normalizeSegment(label, "Host label"),
    windowChrome: {
      ...DEFAULT_HOST_WINDOW_CHROME[kind],
      ...windowChrome,
    },
  };
}

export function createSdkworkHostCapabilityCatalog(
  kind: SdkworkPcReactHost,
  options: CreateSdkworkHostCapabilityCatalogOptions = {},
): SdkworkHostCapabilityCatalogEntry[] {
  const capabilities = dedupeValues([
    ...DEFAULT_HOST_CAPABILITIES[kind],
    ...(options.capabilities ?? []),
  ]);

  return capabilities.map((capability) => ({
    ...HOST_CAPABILITY_METADATA[capability],
    requiredByDefault: DEFAULT_HOST_CAPABILITIES[kind].includes(capability),
  }));
}

export function createSdkworkHostCommandCatalog(
  namespace: string,
  commands: readonly string[],
  options: CreateSdkworkHostCommandCatalogOptions = {},
): SdkworkHostCommandCatalogEntry[] {
  const normalizedNamespace = normalizeSegment(namespace, "Command namespace");
  const criticalCommands = new Set(toUniqueStrings(options.criticalCommands));

  return toUniqueStrings(commands).map((command) => {
    const normalizedCommand = normalizeSegment(command, "Command id");
    return {
      command: normalizedCommand,
      critical: criticalCommands.has(normalizedCommand),
      id: createHostCommandId(normalizedNamespace, normalizedCommand),
      label: toCommandLabel(normalizedCommand),
      namespace: normalizedNamespace,
    };
  });
}

export function createSdkworkHostEventCatalog(
  namespace: string,
  events: readonly string[],
  options: CreateSdkworkHostEventCatalogOptions = {},
): SdkworkHostEventCatalogEntry[] {
  const normalizedNamespace = normalizeSegment(namespace, "Event namespace");
  const criticalEvents = new Set(toUniqueStrings(options.criticalEvents));

  return toUniqueStrings(events).map((event) => {
    const normalizedEvent = normalizeSegment(event, "Event id");
    return {
      critical: criticalEvents.has(normalizedEvent),
      event: normalizedEvent,
      label: toEventLabel(normalizedEvent),
      namespace: normalizedNamespace,
      topic: createHostEventTopic(normalizedNamespace, normalizedEvent),
    };
  });
}

export function createSdkworkHostPermissionBaseline(
  descriptor: SdkworkHostDescriptor,
): SdkworkHostPermissionEntry[] {
  const baselineCapabilities = new Set(DEFAULT_HOST_CAPABILITIES[descriptor.kind]);
  const ambientCapabilities = new Set(HOST_AMBIENT_CAPABILITIES);

  return descriptor.capabilities
    .filter((capability) => !ambientCapabilities.has(capability))
    .map((capability) => ({
      capability,
      label: HOST_CAPABILITY_METADATA[capability].label,
      level: baselineCapabilities.has(capability) ? "baseline" : "optional",
      reason: HOST_PERMISSION_REASONS[capability],
    }));
}

export function evaluateSdkworkHostReadiness(
  descriptor: SdkworkHostDescriptor,
  options: EvaluateSdkworkHostReadinessOptions = {},
): SdkworkHostReadinessSummary {
  const requiredCapabilities = dedupeValues(options.requiredCapabilities ?? []);
  const availableCapabilities = [...descriptor.capabilities];
  const availableSet = new Set(availableCapabilities);
  const missingCapabilities = requiredCapabilities.filter((capability) => !availableSet.has(capability));

  return {
    availableCapabilities,
    missingCapabilities,
    ready: missingCapabilities.length === 0,
    requiredCapabilities,
    supportsCustomChrome:
      descriptor.windowChrome.windowControls === "custom" && availableSet.has("window-controls"),
    supportsTrayRecovery: availableSet.has("tray"),
  };
}

export function createSdkworkHostManifest({
  descriptor,
  description,
  host,
  id,
  packageNames = ["@sdkwork/host-pc-react"],
  requiredCapabilities = [],
  theme,
  title,
}: CreateSdkworkHostManifestOptions): SdkworkHostManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description:
        description ??
        `Host contract for ${descriptor.label}, runtime capability metadata, command catalogs, and readiness evaluation.`,
      host: host ?? descriptor.kind,
      id: id ?? descriptor.id,
      packageNames: toUniqueStrings(packageNames),
      theme,
      title: title ?? `${descriptor.label} Host`,
    }),
    capabilities: [...descriptor.capabilities],
    capability: "host",
    commandIds: [...descriptor.commands],
    eventTopics: [...descriptor.events],
    hostKind: descriptor.kind,
    requiredCapabilities: dedupeValues(requiredCapabilities),
  };
}

export function hasHostCapability(
  descriptor: Pick<SdkworkHostDescriptor, "capabilities">,
  capability: SdkworkHostCapability,
): boolean {
  return descriptor.capabilities.includes(capability);
}

export const hostPackageMeta = {
  architecture: "pc-react",
  domain: "host",
  package: "@sdkwork/host-pc-react",
  status: "ready",
} as const;

export type HostPackageMeta = typeof hostPackageMeta;
