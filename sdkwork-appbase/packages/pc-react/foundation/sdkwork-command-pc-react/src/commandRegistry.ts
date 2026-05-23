import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";
import { searchDocuments, type SdkworkSearchDocument } from "@sdkwork/search-pc-react";
import type { ReactNode } from "react";

export interface SdkworkCommandDefinition {
  aliases?: readonly string[];
  capability?: string;
  description?: string;
  enabled?: boolean;
  group?: string;
  groupOrder?: number;
  icon?: ReactNode;
  id: string;
  keywords?: readonly string[];
  order?: number;
  scope?: string;
  shortcut?: string;
  source?: string;
  title: string;
}

export interface SdkworkCommandGroup {
  heading: string;
  id: string;
  items: SdkworkCommandDefinition[];
  order: number;
  scopeIds: string[];
}

export interface SdkworkCommandRegistry {
  commands: SdkworkCommandDefinition[];
  commandsById: Record<string, SdkworkCommandDefinition>;
  commandsByShortcut: Record<string, SdkworkCommandDefinition>;
  groups: SdkworkCommandGroup[];
  scopeIds: string[];
}

export interface FilterSdkworkCommandRegistryOptions {
  scopeIds?: readonly string[];
}

export interface SdkworkCommandExecuteMeta {
  query?: string;
  shortcut?: string;
  source?: "keyboard" | "palette" | "programmatic" | string;
}

export interface SdkworkCommandHandlerContext extends SdkworkCommandExecuteMeta {
  command: SdkworkCommandDefinition;
  source: "keyboard" | "palette" | "programmatic" | string;
}

export type SdkworkCommandHandler = (
  context: SdkworkCommandHandlerContext,
) => Promise<unknown> | unknown;

export interface CreateSdkworkCommandExecutorOptions {
  handlers: Record<string, SdkworkCommandHandler | undefined>;
  onMissingHandler?: (
    context: SdkworkCommandHandlerContext,
  ) => Promise<unknown> | unknown;
  registry: SdkworkCommandRegistry | readonly SdkworkCommandDefinition[];
}

export interface SdkworkCommandManifest extends SdkworkAppCapabilityManifest {
  capability: "command";
  defaultCommandId?: string;
  groupIds: string[];
  paletteShortcut: string;
  scopeIds: string[];
}

export interface CreateSdkworkCommandManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  defaultCommandId?: string;
  paletteShortcut?: string;
  registry?: SdkworkCommandRegistry;
}

const MODIFIER_ORDER = ["Meta", "Ctrl", "Alt", "Shift"] as const;
const MODIFIER_SET = new Set<string>(MODIFIER_ORDER);

const SHORTCUT_TOKEN_ALIASES: Record<string, string> = {
  alt: "Alt",
  arrowdown: "Down",
  arrowleft: "Left",
  arrowright: "Right",
  arrowup: "Up",
  backspace: "Backspace",
  cmd: "Meta",
  command: "Meta",
  control: "Ctrl",
  ctrl: "Ctrl",
  del: "Delete",
  delete: "Delete",
  down: "Down",
  enter: "Enter",
  esc: "Esc",
  escape: "Esc",
  left: "Left",
  meta: "Meta",
  option: "Alt",
  pagedown: "PageDown",
  pageup: "PageUp",
  return: "Enter",
  right: "Right",
  shift: "Shift",
  space: "Space",
  spacebar: "Space",
  super: "Meta",
  tab: "Tab",
  up: "Up",
  win: "Meta",
  windows: "Meta",
};

function toUniqueStrings(values: readonly string[] | undefined): string[] {
  const unique = new Set<string>();
  const normalized: string[] = [];

  for (const rawValue of values ?? []) {
    const value = rawValue.trim();
    if (!value || unique.has(value)) {
      continue;
    }

    unique.add(value);
    normalized.push(value);
  }

  return normalized;
}

function slugifyHeading(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "commands";
}

function compareCommands(
  left: SdkworkCommandDefinition,
  right: SdkworkCommandDefinition,
): number {
  const leftGroupOrder = left.groupOrder ?? Number.MAX_SAFE_INTEGER;
  const rightGroupOrder = right.groupOrder ?? Number.MAX_SAFE_INTEGER;
  if (leftGroupOrder !== rightGroupOrder) {
    return leftGroupOrder - rightGroupOrder;
  }

  const leftGroup = left.group ?? "Commands";
  const rightGroup = right.group ?? "Commands";
  if (leftGroup !== rightGroup) {
    return leftGroup.localeCompare(rightGroup);
  }

  const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;
  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return left.title.localeCompare(right.title);
}

function normalizeShortcutToken(token: string): string {
  const normalized = token.trim().toLowerCase().replace(/\s+/g, "");
  if (!normalized) {
    return "";
  }

  const aliased = SHORTCUT_TOKEN_ALIASES[normalized];
  if (aliased) {
    return aliased;
  }

  if (normalized.length === 1) {
    return normalized.toUpperCase();
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function normalizeCommand(command: SdkworkCommandDefinition): SdkworkCommandDefinition {
  const aliases = toUniqueStrings(command.aliases);
  const group = command.group?.trim() || "Commands";
  const scope = command.scope?.trim() || "global";
  const source = command.source?.trim() || scope;
  const shortcut = normalizeSdkworkCommandShortcut(command.shortcut);
  const keywords = toUniqueStrings([
    ...(command.keywords ?? []),
    ...aliases,
    group.toLowerCase(),
    scope.toLowerCase(),
    source.toLowerCase(),
    shortcut?.toLowerCase() ?? "",
  ]);

  return {
    ...command,
    ...(aliases.length ? { aliases } : {}),
    group,
    ...(keywords.length ? { keywords } : {}),
    scope,
    ...(shortcut ? { shortcut } : {}),
    source,
  };
}

function toSearchDocument(command: SdkworkCommandDefinition): SdkworkSearchDocument {
  return {
    description: command.description,
    group: command.group,
    id: command.id,
    keywords: command.keywords,
    title: command.title,
  };
}

function isSdkworkCommandRegistry(
  input: SdkworkCommandRegistry | readonly SdkworkCommandDefinition[],
): input is SdkworkCommandRegistry {
  return !Array.isArray(input);
}

function toCommandRegistry(
  input: SdkworkCommandRegistry | readonly SdkworkCommandDefinition[],
): SdkworkCommandRegistry {
  return isSdkworkCommandRegistry(input) ? input : createSdkworkCommandRegistry(input);
}

function cloneGroup(group: SdkworkCommandGroup): SdkworkCommandGroup {
  return {
    heading: group.heading,
    id: group.id,
    items: [...group.items],
    order: group.order,
    scopeIds: [...group.scopeIds],
  };
}

export function normalizeSdkworkCommandShortcut(shortcut: string | undefined): string | undefined {
  if (!shortcut?.trim()) {
    return undefined;
  }

  const tokens = shortcut
    .split("+")
    .map(normalizeShortcutToken)
    .filter(Boolean);

  if (tokens.length === 0) {
    return undefined;
  }

  const modifiers = MODIFIER_ORDER.filter((modifier) => tokens.includes(modifier));
  const keys = tokens.filter((token, index) => !MODIFIER_SET.has(token) && tokens.indexOf(token) === index);

  return [...modifiers, ...keys].join("+");
}

export function createSdkworkCommandRegistry(
  commands: readonly SdkworkCommandDefinition[],
): SdkworkCommandRegistry {
  const commandsById: Record<string, SdkworkCommandDefinition> = {};
  const commandsByShortcut: Record<string, SdkworkCommandDefinition> = {};
  const normalizedCommands = commands
    .filter((command) => command.enabled !== false)
    .map(normalizeCommand)
    .sort(compareCommands);
  const groups = new Map<string, SdkworkCommandGroup>();
  const scopeIds: string[] = [];

  for (const command of normalizedCommands) {
    if (commandsById[command.id]) {
      throw new Error(`Duplicate command id: ${command.id}`);
    }

    commandsById[command.id] = command;

    if (command.shortcut) {
      if (commandsByShortcut[command.shortcut]) {
        throw new Error(`Duplicate command shortcut: ${command.shortcut}`);
      }

      commandsByShortcut[command.shortcut] = command;
    }

    if (command.scope && !scopeIds.includes(command.scope)) {
      scopeIds.push(command.scope);
    }

    const groupId = slugifyHeading(command.group ?? "Commands");
    const existingGroup = groups.get(groupId);

    if (existingGroup) {
      existingGroup.items.push(command);
      if (command.scope && !existingGroup.scopeIds.includes(command.scope)) {
        existingGroup.scopeIds.push(command.scope);
      }
      continue;
    }

    groups.set(groupId, {
      heading: command.group ?? "Commands",
      id: groupId,
      items: [command],
      order: command.groupOrder ?? Number.MAX_SAFE_INTEGER,
      scopeIds: command.scope ? [command.scope] : [],
    });
  }

  return {
    commands: normalizedCommands,
    commandsById,
    commandsByShortcut,
    groups: Array.from(groups.values()).sort(
      (left, right) => left.order - right.order || left.heading.localeCompare(right.heading),
    ),
    scopeIds,
  };
}

export function filterSdkworkCommandRegistryByScopes(
  input: SdkworkCommandRegistry | readonly SdkworkCommandDefinition[],
  scopeIds: readonly string[] = [],
): SdkworkCommandRegistry {
  const registry = toCommandRegistry(input);
  const normalizedScopeIds = toUniqueStrings(scopeIds);
  if (normalizedScopeIds.length === 0) {
    return registry;
  }

  const scopeSet = new Set(normalizedScopeIds);
  return createSdkworkCommandRegistry(
    registry.commands.filter((command) => scopeSet.has(command.scope ?? "global")),
  );
}

export function searchSdkworkCommandRegistry(
  input: SdkworkCommandRegistry | readonly SdkworkCommandDefinition[],
  query: string,
  options: FilterSdkworkCommandRegistryOptions = {},
): SdkworkCommandDefinition[] {
  const registry = filterSdkworkCommandRegistryByScopes(input, options.scopeIds);
  const resultMap = new Map(registry.commands.map((command) => [command.id, command]));

  return searchDocuments(registry.commands.map(toSearchDocument), query)
    .map((result) => resultMap.get(result.document.id))
    .filter((command): command is SdkworkCommandDefinition => Boolean(command));
}

export function createSdkworkCommandPaletteGroups(
  input: SdkworkCommandRegistry | readonly SdkworkCommandDefinition[],
  query = "",
  options: FilterSdkworkCommandRegistryOptions = {},
): SdkworkCommandGroup[] {
  const registry = filterSdkworkCommandRegistryByScopes(input, options.scopeIds);
  if (!query.trim()) {
    return registry.groups.map(cloneGroup);
  }

  const groupMeta = new Map(registry.groups.map((group) => [group.id, group]));
  const grouped = new Map<string, SdkworkCommandGroup>();

  for (const command of searchSdkworkCommandRegistry(registry, query)) {
    const groupId = slugifyHeading(command.group ?? "Commands");
    const existing = grouped.get(groupId);

    if (existing) {
      existing.items.push(command);
      if (command.scope && !existing.scopeIds.includes(command.scope)) {
        existing.scopeIds.push(command.scope);
      }
      continue;
    }

    const meta = groupMeta.get(groupId);
    grouped.set(groupId, {
      heading: command.group ?? "Commands",
      id: groupId,
      items: [command],
      order: meta?.order ?? command.groupOrder ?? Number.MAX_SAFE_INTEGER,
      scopeIds: command.scope ? [command.scope] : [],
    });
  }

  return Array.from(grouped.values()).sort(
    (left, right) => left.order - right.order || left.heading.localeCompare(right.heading),
  );
}

export function createSdkworkCommandExecutor({
  handlers,
  onMissingHandler,
  registry: input,
}: CreateSdkworkCommandExecutorOptions) {
  const registry = toCommandRegistry(input);

  async function execute(commandId: string, meta: SdkworkCommandExecuteMeta = {}) {
    const command = registry.commandsById[commandId];
    if (!command) {
      throw new Error(`Unknown command id: ${commandId}`);
    }

    const context: SdkworkCommandHandlerContext = {
      command,
      ...meta,
      source: meta.source ?? "programmatic",
    };
    const handler = handlers[commandId];

    if (!handler) {
      if (onMissingHandler) {
        return onMissingHandler(context);
      }

      throw new Error(`Missing command handler: ${commandId}`);
    }

    return handler(context);
  }

  async function executeShortcut(shortcut: string, meta: Omit<SdkworkCommandExecuteMeta, "shortcut"> = {}) {
    const normalizedShortcut = normalizeSdkworkCommandShortcut(shortcut);
    if (!normalizedShortcut) {
      throw new Error("Shortcut is required");
    }

    const command = registry.commandsByShortcut[normalizedShortcut];
    if (!command) {
      throw new Error(`Unknown command shortcut: ${normalizedShortcut}`);
    }

    return execute(command.id, {
      ...meta,
      shortcut: normalizedShortcut,
      source: meta.source ?? "keyboard",
    });
  }

  return {
    execute,
    executeShortcut,
    registry,
  };
}

export function createSdkworkCommandManifest({
  defaultCommandId,
  description = "Command registry for global actions, keyboard shortcuts, and palette orchestration.",
  host,
  id = "sdkwork-command",
  packageNames = [
    "@sdkwork/command-pc-react",
    "@sdkwork/search-pc-react",
  ],
  paletteShortcut = "Meta+K",
  registry,
  theme,
  title = "Command",
}: CreateSdkworkCommandManifestOptions = {}): SdkworkCommandManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniqueStrings(packageNames),
      theme,
      title,
    }),
    capability: "command",
    ...(defaultCommandId ? { defaultCommandId } : {}),
    groupIds: registry?.groups.map((group) => group.id) ?? [],
    paletteShortcut: normalizeSdkworkCommandShortcut(paletteShortcut) ?? "Meta+K",
    scopeIds: registry?.scopeIds ?? [],
  };
}

export const commandPackageMeta = {
  architecture: "pc-react",
  domain: "foundation",
  package: "@sdkwork/command-pc-react",
  status: "ready",
} as const;

export type CommandPackageMeta = typeof commandPackageMeta;

export const createCommandRegistry = createSdkworkCommandRegistry;
export const filterCommandRegistryByScopes = filterSdkworkCommandRegistryByScopes;
export const searchCommandRegistry = searchSdkworkCommandRegistry;
export const createCommandPaletteGroups = createSdkworkCommandPaletteGroups;
export const createCommandExecutor = createSdkworkCommandExecutor;
export const createCommandManifest = createSdkworkCommandManifest;
export const normalizeCommandShortcut = normalizeSdkworkCommandShortcut;
