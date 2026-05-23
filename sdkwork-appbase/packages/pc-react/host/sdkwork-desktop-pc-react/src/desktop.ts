import {
  createHostCommandId,
  createHostDescriptor,
  createHostEventTopic,
  createSdkworkHostManifest,
  type SdkworkHostCapability,
  type SdkworkHostDescriptor,
  type SdkworkHostManifest,
} from "@sdkwork/host-pc-react";
import {
  evaluateTauriHostBridgeReadiness,
  type SdkworkTauriHostBridge,
  type SdkworkTauriHostBridgeReadinessSummary,
  type SdkworkTauriWindowOperation,
} from "@sdkwork/host-tauri-pc-react";

export type SdkworkDesktopCloseStrategy = "hide-to-tray" | "quit";

export interface SdkworkDesktopManifest {
  closeStrategy: SdkworkDesktopCloseStrategy;
  commands: {
    showMainWindow: string;
    toggleMaximize: string;
  };
  entryRoute: string;
  events: {
    trayNavigate: string;
    trayRestore: string;
  };
  featurePackages: string[];
  host: SdkworkHostDescriptor;
  hostManifest: SdkworkHostManifest;
  id: string;
  requiredWindowOperations: SdkworkTauriWindowOperation[];
  title: string;
}

export interface CreateSdkworkDesktopManifestOptions {
  closeStrategy?: SdkworkDesktopCloseStrategy;
  entryRoute: string;
  featurePackages?: readonly string[];
  hostCapabilities?: readonly SdkworkHostCapability[];
  id: string;
  packageNames?: readonly string[];
  title: string;
}

export interface SdkworkDesktopWindowControls {
  close: () => Promise<void>;
  minimize: () => Promise<void>;
  toggleMaximize: () => Promise<void>;
}

export interface SdkworkDesktopWindowController {
  close: () => Promise<void>;
  labels: {
    close: string;
    maximize: string;
    minimize: string;
  };
  maximize: () => Promise<void>;
  minimize: () => Promise<void>;
}

export interface CreateSdkworkDesktopWindowControllerOptions extends SdkworkDesktopWindowControls {
  labels?: Partial<SdkworkDesktopWindowController["labels"]>;
}

export interface CreateSdkworkDesktopWindowControllerFromBridgeOptions {
  closeStrategy?: SdkworkDesktopCloseStrategy;
  labels?: Partial<SdkworkDesktopWindowController["labels"]>;
}

export interface SdkworkTrayRouteIntent {
  focusWindow: boolean;
  route: string;
  source: "notification" | "tray";
  type: "tray-route-intent";
}

export interface CreateSdkworkTrayRouteIntentOptions {
  preserveFocus?: boolean;
  source?: "notification" | "tray";
}

export interface SdkworkDesktopShellReadinessSummary extends SdkworkTauriHostBridgeReadinessSummary {
  closeStrategy: SdkworkDesktopCloseStrategy;
  entryRoute: string;
}

const DEFAULT_DESKTOP_PACKAGE_NAMES = [
  "@sdkwork/host-pc-react",
  "@sdkwork/host-tauri-pc-react",
  "@sdkwork/desktop-pc-react",
] as const;

function dedupeValues<T>(values: readonly T[]): T[] {
  return Array.from(new Set(values));
}

function dedupeStrings(values: readonly string[] | undefined): string[] {
  return Array.from(new Set((values ?? []).map((value) => value.trim()).filter(Boolean)));
}

function normalizeRoute(route: string): string {
  const normalized = route.trim();
  if (!normalized) {
    throw new Error("Desktop route is required");
  }

  return normalized;
}

function createRequiredWindowOperations(
  closeStrategy: SdkworkDesktopCloseStrategy,
): SdkworkTauriWindowOperation[] {
  return [
    "show",
    "minimize",
    "toggleMaximize",
    closeStrategy === "hide-to-tray" ? "hide" : "close",
  ];
}

export function createDesktopManifest({
  closeStrategy = "hide-to-tray",
  entryRoute,
  featurePackages = [],
  hostCapabilities = [],
  id,
  packageNames = [],
  title,
}: CreateSdkworkDesktopManifestOptions): SdkworkDesktopManifest {
  const normalizedEntryRoute = normalizeRoute(entryRoute);
  const commands = {
    showMainWindow: createHostCommandId("window", "show_main_window"),
    toggleMaximize: createHostCommandId("window", "toggle_maximize"),
  };
  const events = {
    trayNavigate: createHostEventTopic("tray", "navigate"),
    trayRestore: createHostEventTopic("tray", "restore"),
  };
  const requiredCapabilities: SdkworkHostCapability[] = dedupeValues<SdkworkHostCapability>([
    "window-controls",
    "tray",
    ...hostCapabilities,
  ]);
  const host = createHostDescriptor({
    capabilities: requiredCapabilities,
    commands: [
      commands.showMainWindow,
      commands.toggleMaximize,
    ],
    events: [
      events.trayNavigate,
      events.trayRestore,
    ],
    id,
    kind: "tauri",
    label: title,
  });

  return {
    closeStrategy,
    commands,
    entryRoute: normalizedEntryRoute,
    events,
    featurePackages: dedupeStrings(featurePackages),
    host,
    hostManifest: createSdkworkHostManifest({
      description: `Desktop host contract for ${title}, including tray recovery and custom window controls.`,
      descriptor: host,
      packageNames: dedupeStrings([
        ...DEFAULT_DESKTOP_PACKAGE_NAMES,
        ...packageNames,
      ]),
      requiredCapabilities,
      title: `${title} Desktop Host`,
    }),
    id,
    requiredWindowOperations: createRequiredWindowOperations(closeStrategy),
    title,
  };
}

export function createDesktopWindowController({
  close,
  labels,
  minimize,
  toggleMaximize,
}: CreateSdkworkDesktopWindowControllerOptions): SdkworkDesktopWindowController {
  return {
    close,
    labels: {
      close: "Close window",
      maximize: "Maximize window",
      minimize: "Minimize window",
      ...labels,
    },
    maximize: toggleMaximize,
    minimize,
  };
}

export function createDesktopWindowControllerFromBridge(
  bridge: SdkworkTauriHostBridge,
  options: CreateSdkworkDesktopWindowControllerFromBridgeOptions = {},
): SdkworkDesktopWindowController {
  return createDesktopWindowController({
    close:
      options.closeStrategy === "quit"
        ? () => bridge.window.close()
        : () => bridge.window.hide(),
    labels: options.labels,
    minimize: () => bridge.window.minimize(),
    toggleMaximize: () => bridge.window.toggleMaximize(),
  });
}

export function createTrayRouteIntent(
  route: string,
  options: CreateSdkworkTrayRouteIntentOptions = {},
): SdkworkTrayRouteIntent {
  return {
    focusWindow: options.preserveFocus !== false,
    route: normalizeRoute(route),
    source: options.source ?? "tray",
    type: "tray-route-intent",
  };
}

export function isTrayRouteIntent(value: unknown): value is SdkworkTrayRouteIntent {
  return (
    value !== null &&
    typeof value === "object" &&
    "type" in value &&
    (value as { type?: string }).type === "tray-route-intent"
  );
}

export function evaluateDesktopShellReadiness(
  manifest: SdkworkDesktopManifest,
  bridge: SdkworkTauriHostBridge,
): SdkworkDesktopShellReadinessSummary {
  return {
    ...evaluateTauriHostBridgeReadiness(bridge, {
      requiredCapabilities: manifest.hostManifest.requiredCapabilities,
      requiredCommands: manifest.hostManifest.commandIds,
      requiredEvents: manifest.hostManifest.eventTopics,
      requiredWindowOperations: manifest.requiredWindowOperations,
    }),
    closeStrategy: manifest.closeStrategy,
    entryRoute: manifest.entryRoute,
  };
}

export const desktopPackageMeta = {
  architecture: "pc-react",
  domain: "host",
  package: "@sdkwork/desktop-pc-react",
  status: "ready",
} as const;

export type DesktopPackageMeta = typeof desktopPackageMeta;
