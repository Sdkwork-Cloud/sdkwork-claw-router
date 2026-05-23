import {
  createHostCommandId,
  createHostDescriptor,
  createHostEventTopic,
  evaluateSdkworkHostReadiness,
  type CreateSdkworkHostDescriptorOptions,
  type SdkworkHostCapability,
  type SdkworkHostDescriptor,
} from "@sdkwork/host-pc-react";

export interface SdkworkTauriEvent<TPayload = unknown> {
  event: string;
  payload: TPayload;
}

export type SdkworkTauriUnlisten = () => void | Promise<void>;

export interface SdkworkTauriWindowTransport {
  close?: () => Promise<void>;
  hide?: () => Promise<void>;
  isMaximized?: () => Promise<boolean>;
  maximize?: () => Promise<void>;
  minimize?: () => Promise<void>;
  show?: () => Promise<void>;
  unmaximize?: () => Promise<void>;
}

export interface SdkworkTauriTransport {
  available?: boolean | (() => boolean);
  invoke: (command: string, payload?: unknown) => Promise<unknown>;
  listen: <TPayload>(
    event: string,
    listener: (event: SdkworkTauriEvent<TPayload>) => void,
  ) => Promise<SdkworkTauriUnlisten>;
  window?: SdkworkTauriWindowTransport;
}

export interface CreateSdkworkTauriHostBridgeOptions {
  descriptor?: Partial<Omit<CreateSdkworkHostDescriptorOptions, "id" | "kind" | "label">> & {
    id?: string;
    label?: string;
  };
  transport: SdkworkTauriTransport;
}

export interface SdkworkTauriWindowBridge {
  close: () => Promise<void>;
  hide: () => Promise<void>;
  isMaximized: () => Promise<boolean>;
  maximize: () => Promise<void>;
  minimize: () => Promise<void>;
  restore: () => Promise<void>;
  show: () => Promise<void>;
  toggleMaximize: () => Promise<void>;
}

export interface SdkworkTauriHostBridge {
  descriptor: SdkworkHostDescriptor;
  invokeCommand: <TResult>(namespace: string, command: string, payload?: unknown) => Promise<TResult>;
  isAvailable: () => boolean;
  listenEvent: <TPayload>(
    namespace: string,
    event: string,
    listener: (payload: TPayload) => void,
  ) => Promise<SdkworkTauriUnlisten>;
  transport: SdkworkTauriTransport;
  window: SdkworkTauriWindowBridge;
}

export type SdkworkTauriHostBridgeErrorCode =
  | "command-not-registered"
  | "event-not-registered"
  | "invoke-failed"
  | "listen-failed"
  | "tauri-unavailable"
  | "window-operation-unavailable";

export type SdkworkTauriWindowOperation =
  | "close"
  | "hide"
  | "isMaximized"
  | "maximize"
  | "minimize"
  | "restore"
  | "show"
  | "toggleMaximize";

export interface CreateSdkworkTauriHostBridgeErrorOptions {
  cause?: unknown;
  code: SdkworkTauriHostBridgeErrorCode;
  commandId?: string;
  eventTopic?: string;
  operation: string;
}

export class SdkworkTauriHostBridgeError extends Error {
  readonly causeMessage: string;
  readonly code: SdkworkTauriHostBridgeErrorCode;
  readonly commandId?: string;
  readonly eventTopic?: string;
  readonly operation: string;

  constructor(options: CreateSdkworkTauriHostBridgeErrorOptions) {
    super(buildBridgeMessage(options));
    this.name = "SdkworkTauriHostBridgeError";
    this.causeMessage = formatCause(options.cause);
    this.code = options.code;
    this.commandId = options.commandId;
    this.eventTopic = options.eventTopic;
    this.operation = options.operation;
  }
}

export interface EvaluateTauriHostBridgeReadinessOptions {
  requiredCapabilities?: readonly SdkworkHostCapability[];
  requiredCommands?: readonly string[];
  requiredEvents?: readonly string[];
  requiredWindowOperations?: readonly SdkworkTauriWindowOperation[];
}

export interface SdkworkTauriHostBridgeReadinessSummary {
  available: boolean;
  missingCapabilities: SdkworkHostCapability[];
  missingCommands: string[];
  missingEvents: string[];
  missingWindowOperations: SdkworkTauriWindowOperation[];
  ready: boolean;
  requiredCapabilities: SdkworkHostCapability[];
  requiredCommands: string[];
  requiredEvents: string[];
  requiredWindowOperations: SdkworkTauriWindowOperation[];
  supportsCustomChrome: boolean;
  supportsTrayRecovery: boolean;
}

const DEFAULT_TAURI_HOST_CAPABILITIES = ["native-notification"] as const satisfies readonly SdkworkHostCapability[];
const DEFAULT_TAURI_HOST_COMMANDS = [
  createHostCommandId("window", "show_main_window"),
  createHostCommandId("window", "toggle_maximize"),
] as const;
const DEFAULT_TAURI_HOST_EVENTS = [
  createHostEventTopic("tray", "navigate"),
  createHostEventTopic("tray", "restore"),
] as const;

function formatCause(cause: unknown): string {
  if (!cause) {
    return "Unknown bridge failure";
  }

  if (cause instanceof Error) {
    return cause.message;
  }

  if (typeof cause === "string") {
    return cause;
  }

  try {
    return JSON.stringify(cause);
  } catch {
    return String(cause);
  }
}

function buildBridgeMessage(options: CreateSdkworkTauriHostBridgeErrorOptions): string {
  const scope = options.commandId ?? options.eventTopic ?? options.operation;
  return `${options.code} for ${scope}: ${formatCause(options.cause)}`;
}

function dedupeValues<T>(values: readonly T[]): T[] {
  return Array.from(new Set(values));
}

function toUniqueStrings(values: readonly string[] | undefined): string[] {
  return Array.from(new Set((values ?? []).map((value) => value.trim()).filter(Boolean)));
}

function resolveAvailability(available: SdkworkTauriTransport["available"]): boolean {
  if (typeof available === "function") {
    return available();
  }

  if (typeof available === "boolean") {
    return available;
  }

  return true;
}

function createUnavailableError(operation: string, commandId?: string, eventTopic?: string) {
  return new SdkworkTauriHostBridgeError({
    cause: "Tauri runtime is unavailable.",
    code: "tauri-unavailable",
    commandId,
    eventTopic,
    operation,
  });
}

function ensureRegisteredCommand(descriptor: SdkworkHostDescriptor, commandId: string): void {
  if (!descriptor.commands.includes(commandId)) {
    throw new SdkworkTauriHostBridgeError({
      cause: "Command is not declared in the host descriptor.",
      code: "command-not-registered",
      commandId,
      operation: commandId,
    });
  }
}

function ensureRegisteredEvent(descriptor: SdkworkHostDescriptor, eventTopic: string): void {
  if (!descriptor.events.includes(eventTopic)) {
    throw new SdkworkTauriHostBridgeError({
      cause: "Event is not declared in the host descriptor.",
      code: "event-not-registered",
      eventTopic,
      operation: eventTopic,
    });
  }
}

async function ensureWindowOperation<TResult>(
  operation: SdkworkTauriWindowOperation,
  handler: (() => Promise<TResult>) | undefined,
): Promise<TResult> {
  if (!handler) {
    throw new SdkworkTauriHostBridgeError({
      cause: "Tauri window operation is not available.",
      code: "window-operation-unavailable",
      operation,
    });
  }

  return handler();
}

function hasWindowOperation(
  windowTransport: SdkworkTauriWindowTransport | undefined,
  operation: SdkworkTauriWindowOperation,
): boolean {
  switch (operation) {
    case "restore":
      return Boolean(windowTransport?.unmaximize);
    case "toggleMaximize":
      return Boolean(windowTransport?.isMaximized && windowTransport?.maximize && windowTransport?.unmaximize);
    default:
      return Boolean(windowTransport?.[operation]);
  }
}

function createWindowBridge(windowTransport: SdkworkTauriWindowTransport | undefined): SdkworkTauriWindowBridge {
  return {
    close: () => ensureWindowOperation("close", windowTransport?.close),
    hide: () => ensureWindowOperation("hide", windowTransport?.hide),
    isMaximized: () => ensureWindowOperation("isMaximized", windowTransport?.isMaximized),
    maximize: () => ensureWindowOperation("maximize", windowTransport?.maximize),
    minimize: () => ensureWindowOperation("minimize", windowTransport?.minimize),
    restore: () => ensureWindowOperation("restore", windowTransport?.unmaximize),
    show: () => ensureWindowOperation("show", windowTransport?.show),
    toggleMaximize: async () => {
      const isMaximized = await ensureWindowOperation("isMaximized", windowTransport?.isMaximized);
      if (isMaximized) {
        await ensureWindowOperation("restore", windowTransport?.unmaximize);
        return;
      }

      await ensureWindowOperation("maximize", windowTransport?.maximize);
    },
  };
}

export function createTauriHostBridge({
  descriptor,
  transport,
}: CreateSdkworkTauriHostBridgeOptions): SdkworkTauriHostBridge {
  const bridgeDescriptor = createHostDescriptor({
    capabilities: [
      ...DEFAULT_TAURI_HOST_CAPABILITIES,
      ...(descriptor?.capabilities ?? []),
    ],
    commands: [
      ...DEFAULT_TAURI_HOST_COMMANDS,
      ...(descriptor?.commands ?? []),
    ],
    events: [
      ...DEFAULT_TAURI_HOST_EVENTS,
      ...(descriptor?.events ?? []),
    ],
    id: descriptor?.id ?? "sdkwork-tauri-host",
    kind: "tauri",
    label: descriptor?.label ?? "SDKWORK Tauri Host",
    windowChrome: descriptor?.windowChrome,
  });

  const isAvailable = () => resolveAvailability(transport.available);

  return {
    descriptor: bridgeDescriptor,
    invokeCommand: async <TResult>(namespace: string, command: string, payload?: unknown) => {
      const commandId = createHostCommandId(namespace, command);
      if (!isAvailable()) {
        throw createUnavailableError(commandId, commandId);
      }

      ensureRegisteredCommand(bridgeDescriptor, commandId);

      try {
        return (await transport.invoke(commandId, payload)) as TResult;
      } catch (cause) {
        throw new SdkworkTauriHostBridgeError({
          cause,
          code: "invoke-failed",
          commandId,
          operation: commandId,
        });
      }
    },
    isAvailable,
    listenEvent: async <TPayload>(namespace: string, event: string, listener: (payload: TPayload) => void) => {
      const eventTopic = createHostEventTopic(namespace, event);
      if (!isAvailable()) {
        throw createUnavailableError(eventTopic, undefined, eventTopic);
      }

      ensureRegisteredEvent(bridgeDescriptor, eventTopic);

      try {
        return await transport.listen(eventTopic, (tauriEvent) => {
          listener(tauriEvent.payload as TPayload);
        });
      } catch (cause) {
        throw new SdkworkTauriHostBridgeError({
          cause,
          code: "listen-failed",
          eventTopic,
          operation: eventTopic,
        });
      }
    },
    transport,
    window: createWindowBridge(transport.window),
  };
}

export function evaluateTauriHostBridgeReadiness(
  bridge: SdkworkTauriHostBridge,
  options: EvaluateTauriHostBridgeReadinessOptions = {},
): SdkworkTauriHostBridgeReadinessSummary {
  const requiredCapabilities = dedupeValues(options.requiredCapabilities ?? []);
  const requiredCommands = toUniqueStrings(options.requiredCommands);
  const requiredEvents = toUniqueStrings(options.requiredEvents);
  const requiredWindowOperations = dedupeValues(options.requiredWindowOperations ?? []);
  const hostReadiness = evaluateSdkworkHostReadiness(bridge.descriptor, {
    requiredCapabilities,
  });
  const available = bridge.isAvailable();
  const commandSet = new Set(bridge.descriptor.commands);
  const eventSet = new Set(bridge.descriptor.events);

  return {
    available,
    missingCapabilities: hostReadiness.missingCapabilities,
    missingCommands: requiredCommands.filter((commandId) => !commandSet.has(commandId)),
    missingEvents: requiredEvents.filter((eventTopic) => !eventSet.has(eventTopic)),
    missingWindowOperations: requiredWindowOperations.filter(
      (operation) => !hasWindowOperation(bridge.transport.window, operation),
    ),
    ready:
      available &&
      hostReadiness.ready &&
      requiredCommands.every((commandId) => commandSet.has(commandId)) &&
      requiredEvents.every((eventTopic) => eventSet.has(eventTopic)) &&
      requiredWindowOperations.every((operation) => hasWindowOperation(bridge.transport.window, operation)),
    requiredCapabilities: hostReadiness.requiredCapabilities,
    requiredCommands,
    requiredEvents,
    requiredWindowOperations,
    supportsCustomChrome: hostReadiness.supportsCustomChrome,
    supportsTrayRecovery: hostReadiness.supportsTrayRecovery,
  };
}

export async function runTauriOnly<TResult>(
  bridge: SdkworkTauriHostBridge,
  tauriAction: (bridge: SdkworkTauriHostBridge) => Promise<TResult>,
): Promise<TResult> {
  if (!bridge.isAvailable()) {
    throw createUnavailableError("tauri-only");
  }

  return tauriAction(bridge);
}

export async function runTauriOrFallback<TResult>(
  bridge: SdkworkTauriHostBridge,
  tauriAction: (bridge: SdkworkTauriHostBridge) => Promise<TResult>,
  fallback: () => Promise<TResult>,
): Promise<TResult> {
  if (!bridge.isAvailable()) {
    return fallback();
  }

  return tauriAction(bridge);
}

export const hostTauriPackageMeta = {
  architecture: "pc-react",
  domain: "host",
  package: "@sdkwork/host-tauri-pc-react",
  status: "ready",
} as const;

export type HostTauriPackageMeta = typeof hostTauriPackageMeta;
