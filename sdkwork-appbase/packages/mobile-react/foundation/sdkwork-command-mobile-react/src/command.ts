import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-mobile-react";
import { searchDocuments, type SdkworkSearchDocument } from "@sdkwork/search-mobile-react";

export type SdkworkCommandSurface = "quick-actions" | "slash" | "spotlight";

export interface SdkworkCommandDefinition {
  aliases?: readonly string[];
  capability?: string;
  description?: string;
  enabled?: boolean;
  group?: string;
  groupOrder?: number;
  id: string;
  keywords?: readonly string[];
  order?: number;
  scope?: string;
  shortcut?: string;
  source?: string;
  surfaces?: readonly SdkworkCommandSurface[];
  title: string;
}

export interface SdkworkCommandGroup {
  heading: string;
  id: string;
  items: SdkworkCommandDefinition[];
  order: number;
  scopeIds: string[];
  surfaceIds: SdkworkCommandSurface[];
}

export interface SdkworkCommandRegistry {
  commands: SdkworkCommandDefinition[];
  commandsById: Record<string, SdkworkCommandDefinition>;
  commandsByShortcut: Record<string, SdkworkCommandDefinition>;
  groups: SdkworkCommandGroup[];
  scopeIds: string[];
  surfaceIds: SdkworkCommandSurface[];
}

export interface FilterSdkworkCommandRegistryOptions {
  scopeIds?: readonly string[];
  surfaceIds?: readonly SdkworkCommandSurface[];
}

export interface SdkworkCommandExecuteMeta {
  query?: string;
  shortcut?: string;
  source?: "keyboard" | "programmatic" | SdkworkCommandSurface | string;
}

export interface SdkworkCommandHandlerContext extends SdkworkCommandExecuteMeta {
  command: SdkworkCommandDefinition;
  source: "keyboard" | "programmatic" | SdkworkCommandSurface | string;
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
  launcherShortcut?: string;
  launcherSurface: SdkworkCommandSurface;
  scopeIds: string[];
  surfaceIds: SdkworkCommandSurface[];
}

export interface CreateSdkworkCommandManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  defaultCommandId?: string;
  launcherShortcut?: string;
  launcherSurface?: SdkworkCommandSurface;
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
  const normalized: string[] = [];
  const unique = new Set<string>();

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

function toUniqueSurfaces(
  values: readonly SdkworkCommandSurface[] | undefined,
): SdkworkCommandSurface[] {
  const normalized: SdkworkCommandSurface[] = [];
  const unique = new Set<string>();

  for (const rawValue of values ?? []) {
    const value = rawValue.trim().toLowerCase() as SdkworkCommandSurface;
    if (!value || unique.has(value)) {
      continue;
    }

    unique.add(value);
    normalized.push(value);
  }

  return normalized;
}

function slugifyHeading(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "commands"
  );
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
  const capability = command.capability?.trim();
  const description = command.description?.trim();
  const group = command.group?.trim() || "Commands";
  const scope = command.scope?.trim() || "global";
  const shortcut = normalizeSdkworkCommandShortcut(command.shortcut);
  const source = command.source?.trim() || scope;
  const surfaces = toUniqueSurfaces(command.surfaces);
  const title = command.title.trim();
  const keywords = toUniqueStrings([
    ...(command.keywords ?? []),
    ...aliases,
    ...(capability ? [capability] : []),
    group.toLowerCase(),
    scope.toLowerCase(),
    source.toLowerCase(),
    ...surfaces.map((surface) => surface.toLowerCase()),
    shortcut?.toLowerCase() ?? "",
  ]);

  return {
    ...command,
    ...(aliases.length ? { aliases } : {}),
    ...(capability ? { capability } : {}),
    ...(description ? { description } : {}),
    group,
    ...(keywords.length ? { keywords } : {}),
    scope,
    ...(shortcut ? { shortcut } : {}),
    source,
    surfaces: surfaces.length > 0 ? surfaces : ["spotlight"],
    title,
  };
}

function toSearchDocument(command: SdkworkCommandDefinition): SdkworkSearchDocument {
  return {
    capability: command.capability,
    description: command.description,
    group: command.group,
    id: command.id,
    keywords: command.keywords,
    scope: command.scope,
    source: command.source,
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
    surfaceIds: [...group.surfaceIds],
  };
}

function matchesFilters(
  command: SdkworkCommandDefinition,
  scopeFilter: ReadonlySet<string>,
  surfaceFilter: ReadonlySet<string>,
): boolean {
  if (scopeFilter.size > 0 && !scopeFilter.has(command.scope ?? "global")) {
    return false;
  }

  if (surfaceFilter.size > 0) {
    return (command.surfaces ?? ["spotlight"]).some((surface) => surfaceFilter.has(surface));
  }

  return true;
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
  const groups = new Map<string, SdkworkCommandGroup>();
  const scopeIds: string[] = [];
  const surfaceIds: SdkworkCommandSurface[] = [];
  const normalizedCommands = commands
    .filter((command) => command.enabled !== false)
    .map(normalizeCommand)
    .sort(compareCommands);

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

    for (const surface of command.surfaces ?? ["spotlight"]) {
      if (!surfaceIds.includes(surface)) {
        surfaceIds.push(surface);
      }
    }

    const groupId = slugifyHeading(command.group ?? "Commands");
    const existingGroup = groups.get(groupId);

    if (existingGroup) {
      existingGroup.items.push(command);
      if (command.scope && !existingGroup.scopeIds.includes(command.scope)) {
        existingGroup.scopeIds.push(command.scope);
      }
      for (const surface of command.surfaces ?? ["spotlight"]) {
        if (!existingGroup.surfaceIds.includes(surface)) {
          existingGroup.surfaceIds.push(surface);
        }
      }
      continue;
    }

    groups.set(groupId, {
      heading: command.group ?? "Commands",
      id: groupId,
      items: [command],
      order: command.groupOrder ?? Number.MAX_SAFE_INTEGER,
      scopeIds: command.scope ? [command.scope] : [],
      surfaceIds: [...(command.surfaces ?? ["spotlight"])],
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
    surfaceIds,
  };
}

export function filterSdkworkCommandRegistry(
  input: SdkworkCommandRegistry | readonly SdkworkCommandDefinition[],
  options: FilterSdkworkCommandRegistryOptions = {},
): SdkworkCommandRegistry {
  const registry = toCommandRegistry(input);
  const scopeFilter = new Set(toUniqueStrings(options.scopeIds));
  const surfaceFilter = new Set(toUniqueSurfaces(options.surfaceIds));

  if (scopeFilter.size === 0 && surfaceFilter.size === 0) {
    return registry;
  }

  return createSdkworkCommandRegistry(
    registry.commands.filter((command) => matchesFilters(command, scopeFilter, surfaceFilter)),
  );
}

export function searchSdkworkCommandRegistry(
  input: SdkworkCommandRegistry | readonly SdkworkCommandDefinition[],
  query: string,
  options: FilterSdkworkCommandRegistryOptions = {},
): SdkworkCommandDefinition[] {
  const registry = filterSdkworkCommandRegistry(input, options);
  const resultMap = new Map(registry.commands.map((command) => [command.id, command]));

  return searchDocuments(registry.commands.map(toSearchDocument), query)
    .map((result) => resultMap.get(result.document.id))
    .filter((command): command is SdkworkCommandDefinition => Boolean(command));
}

export function createSdkworkCommandGroups(
  input: SdkworkCommandRegistry | readonly SdkworkCommandDefinition[],
  query = "",
  options: FilterSdkworkCommandRegistryOptions = {},
): SdkworkCommandGroup[] {
  const registry = filterSdkworkCommandRegistry(input, options);
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
      for (const surface of command.surfaces ?? ["spotlight"]) {
        if (!existing.surfaceIds.includes(surface)) {
          existing.surfaceIds.push(surface);
        }
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
      surfaceIds: [...(command.surfaces ?? ["spotlight"])],
    });
  }

  return Array.from(grouped.values()).sort(
    (left, right) => left.order - right.order || left.heading.localeCompare(right.heading),
  );
}

export function createSdkworkQuickActionGroups(
  input: SdkworkCommandRegistry | readonly SdkworkCommandDefinition[],
  query = "",
  options: FilterSdkworkCommandRegistryOptions = {},
): SdkworkCommandGroup[] {
  const { surfaceIds: _ignored, ...rest } = options;
  return createSdkworkCommandGroups(input, query, {
    ...rest,
    surfaceIds: ["quick-actions"],
  });
}

export function createSdkworkSlashCommandGroups(
  input: SdkworkCommandRegistry | readonly SdkworkCommandDefinition[],
  query = "",
  options: FilterSdkworkCommandRegistryOptions = {},
): SdkworkCommandGroup[] {
  const { surfaceIds: _ignored, ...rest } = options;
  return createSdkworkCommandGroups(input, query, {
    ...rest,
    surfaceIds: ["slash"],
  });
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

  async function executeShortcut(
    shortcut: string,
    meta: Omit<SdkworkCommandExecuteMeta, "shortcut"> = {},
  ) {
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
  description = "Command registry for mobile quick actions, spotlight discovery, and slash-command orchestration.",
  host,
  id = "sdkwork-command",
  launcherShortcut,
  launcherSurface = "spotlight",
  packageNames = [
    "@sdkwork/command-mobile-react",
    "@sdkwork/search-mobile-react",
  ],
  registry,
  theme,
  title = "Command",
}: CreateSdkworkCommandManifestOptions = {}): SdkworkCommandManifest {
  const normalizedLauncherShortcut = normalizeSdkworkCommandShortcut(launcherShortcut);

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
    ...(normalizedLauncherShortcut ? { launcherShortcut: normalizedLauncherShortcut } : {}),
    launcherSurface,
    scopeIds: registry?.scopeIds ?? [],
    surfaceIds: registry?.surfaceIds ?? [],
  };
}

export const commandPackageMeta = {
  architecture: "mobile-react",
  domain: "foundation",
  package: "@sdkwork/command-mobile-react",
  status: "ready",
} as const;

export type CommandPackageMeta = typeof commandPackageMeta;

export const createCommandRegistry = createSdkworkCommandRegistry;
export const filterCommandRegistry = filterSdkworkCommandRegistry;
export const searchCommandRegistry = searchSdkworkCommandRegistry;
export const createCommandGroups = createSdkworkCommandGroups;
export const createQuickActionGroups = createSdkworkQuickActionGroups;
export const createSlashCommandGroups = createSdkworkSlashCommandGroups;
export const createCommandExecutor = createSdkworkCommandExecutor;
export const createCommandManifest = createSdkworkCommandManifest;
export const normalizeCommandShortcut = normalizeSdkworkCommandShortcut;
