import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";
import type {
  SdkworkCommandDefinition,
  SdkworkCommandGroup,
} from "@sdkwork/command-pc-react";
import { createSdkworkCommandRegistry } from "@sdkwork/command-pc-react";

export type SdkworkShellSidebarMode = "expanded" | "hidden";
export type SdkworkShellNavigationTarget = "external" | "internal";

export interface SdkworkShellIdentity {
  brand: string;
  monogram: string;
  subtitle: string;
  title: string;
}

export interface SdkworkShellNavigationItem {
  description?: string;
  enabled?: boolean;
  href: string;
  id: string;
  keywords?: readonly string[];
  order?: number;
  target?: SdkworkShellNavigationTarget;
  title: string;
}

export interface SdkworkShellNavigationSection {
  enabled?: boolean;
  id: string;
  items: readonly SdkworkShellNavigationItem[];
  order?: number;
  title: string;
}

export interface SdkworkShellCommandAction {
  href: string;
  target: SdkworkShellNavigationTarget;
  type: "navigate";
}

export interface SdkworkShellCommandEntry extends SdkworkCommandDefinition {
  action?: SdkworkShellCommandAction;
  source: "navigation" | "utility";
}

export interface SdkworkShellUtilityCommand extends SdkworkCommandDefinition {
  action?: SdkworkShellCommandAction;
}

export interface CreateSdkworkShellIdentityOptions {
  brand?: string;
  monogram?: string;
  subtitle?: string;
  title: string;
}

export interface CreateSdkworkShellCommandGroupsOptions {
  commands?: readonly SdkworkShellUtilityCommand[];
  navigationSections?: readonly SdkworkShellNavigationSection[];
}

export interface CreateSdkworkShellBlueprintOptions extends CreateSdkworkShellIdentityOptions {
  commands?: readonly SdkworkShellUtilityCommand[];
  id?: string;
  navigationSections?: readonly SdkworkShellNavigationSection[];
}

export interface SdkworkShellBlueprint {
  commandEntries: SdkworkShellCommandEntry[];
  commandGroups: SdkworkCommandGroup[];
  id: string;
  identity: SdkworkShellIdentity;
  navigationSections: SdkworkShellNavigationSection[];
}

export interface SdkworkShellBlueprintSummary {
  commandGroupHeadings: string[];
  commandIds: string[];
  navigationItemIds: string[];
  navigationSectionIds: string[];
  totalCommands: number;
  totalNavigationItems: number;
}

export interface SdkworkShellManifest extends SdkworkAppCapabilityManifest {
  capability: "shell";
  commandPaletteShortcut: string;
  navigationSectionIds: string[];
  sidebarMode: SdkworkShellSidebarMode;
}

export interface CreateSdkworkShellManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  blueprint?: SdkworkShellBlueprint;
  commandPaletteShortcut?: string;
  sidebarMode?: SdkworkShellSidebarMode;
}

function compareOrderTitle(
  left: { order?: number; title: string },
  right: { order?: number; title: string },
): number {
  const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;
  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return left.title.localeCompare(right.title);
}

function toUniqueStrings(values: readonly string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function toTitleWords(value: string): string[] {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function createMonogram(value: string): string {
  const words = toTitleWords(value);
  if (words.length >= 2) {
    return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
  }

  const compact = words[0] ?? value.trim();
  return compact.slice(0, 2).toUpperCase() || "AI";
}

function normalizeNavigationSections(
  sections: readonly SdkworkShellNavigationSection[] | undefined,
): SdkworkShellNavigationSection[] {
  return (sections ?? [])
    .filter((section) => section.enabled !== false)
    .map((section) => ({
      ...section,
      items: [...section.items]
        .filter((item) => item.enabled !== false)
        .sort(compareOrderTitle),
    }))
    .filter((section) => section.items.length > 0)
    .sort(compareOrderTitle);
}

function createNavigationCommandEntry(
  section: SdkworkShellNavigationSection,
  item: SdkworkShellNavigationItem,
): SdkworkShellCommandEntry {
  return {
    action: {
      href: item.href,
      target: item.target ?? "internal",
      type: "navigate",
    },
    description: item.description,
    group: section.title,
    id: `navigate:${item.id}`,
    keywords: toUniqueStrings([
      ...(item.keywords ?? []),
      section.title.toLowerCase(),
      "navigate",
    ]),
    groupOrder: section.order,
    order: item.order,
    source: "navigation",
    title: item.title,
  };
}

function normalizeUtilityCommands(
  commands: readonly SdkworkShellUtilityCommand[] | undefined,
): SdkworkShellCommandEntry[] {
  return [...(commands ?? [])]
    .map((command) => ({
      ...command,
      source: "utility" as const,
    }))
    .sort((left, right) => {
      const leftGroup = left.group ?? "Commands";
      const rightGroup = right.group ?? "Commands";
      if (leftGroup !== rightGroup) {
        return leftGroup.localeCompare(rightGroup);
      }

      return compareOrderTitle(left, right);
    });
}

function toPaletteItem(command: SdkworkShellCommandEntry) {
  return {
    description: command.description,
    id: command.id,
    keywords: command.keywords ? [...command.keywords] : undefined,
    label: command.title,
    shortcut: command.shortcut,
  };
}

export function createSdkworkShellIdentity({
  brand = "SDKWORK",
  monogram,
  subtitle = "Composable AI workspace",
  title,
}: CreateSdkworkShellIdentityOptions): SdkworkShellIdentity {
  return {
    brand,
    monogram: (monogram?.trim() || createMonogram(brand || title)).slice(0, 2).toUpperCase(),
    subtitle,
    title,
  };
}

export function createSdkworkShellCommandGroups({
  commands,
  navigationSections,
}: CreateSdkworkShellCommandGroupsOptions = {}): {
  commandEntries: SdkworkShellCommandEntry[];
  commandGroups: SdkworkCommandGroup[];
} {
  const normalizedSections = normalizeNavigationSections(navigationSections);
  const navigationCommands = normalizedSections.flatMap((section) =>
    section.items.map((item) => createNavigationCommandEntry(section, item)),
  );
  const utilityCommands = normalizeUtilityCommands(commands);
  const commandRegistry = createSdkworkCommandRegistry([
    ...navigationCommands,
    ...utilityCommands,
  ]);
  const commandEntries = commandRegistry.commands as SdkworkShellCommandEntry[];

  return {
    commandEntries,
    commandGroups: commandRegistry.groups,
  };
}

export function createSdkworkShellBlueprint({
  commands,
  id = "sdkwork-shell-blueprint",
  navigationSections,
  ...identityOptions
}: CreateSdkworkShellBlueprintOptions): SdkworkShellBlueprint {
  const normalizedSections = normalizeNavigationSections(navigationSections);
  const { commandEntries, commandGroups } = createSdkworkShellCommandGroups({
    commands,
    navigationSections: normalizedSections,
  });

  return {
    commandEntries,
    commandGroups,
    id,
    identity: createSdkworkShellIdentity(identityOptions),
    navigationSections: normalizedSections,
  };
}

export function summarizeSdkworkShellBlueprint(
  blueprint: SdkworkShellBlueprint,
): SdkworkShellBlueprintSummary {
  return {
    commandGroupHeadings: blueprint.commandGroups.map((group) => group.heading),
    commandIds: blueprint.commandEntries.map((command) => command.id),
    navigationItemIds: blueprint.navigationSections.flatMap((section) =>
      section.items.map((item) => item.id),
    ),
    navigationSectionIds: blueprint.navigationSections.map((section) => section.id),
    totalCommands: blueprint.commandEntries.length,
    totalNavigationItems: blueprint.navigationSections.reduce(
      (count, section) => count + section.items.length,
      0,
    ),
  };
}

export function createSdkworkShellManifest({
  blueprint,
  commandPaletteShortcut = "Meta+K",
  description = `Shared application shell for ${blueprint?.identity.brand ?? "SDKWORK"}, desktop navigation, and command palette composition.`,
  host,
  id = "sdkwork-shell",
  packageNames = [
    "@sdkwork/shell-pc-react",
    "@sdkwork/command-pc-react",
  ],
  sidebarMode = "expanded",
  theme,
  title = blueprint?.identity.title ?? "SDKWORK Shell",
}: CreateSdkworkShellManifestOptions = {}): SdkworkShellManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniqueStrings(packageNames),
      theme,
      title,
    }),
    capability: "shell",
    commandPaletteShortcut,
    navigationSectionIds: blueprint?.navigationSections.map((section) => section.id) ?? [],
    sidebarMode,
  };
}

export const shellPackageMeta = {
  architecture: "pc-react",
  domain: "foundation",
  package: "@sdkwork/shell-pc-react",
  status: "ready",
} as const;

export type ShellPackageMeta = typeof shellPackageMeta;
