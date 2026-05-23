import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";

export type SdkworkWorkspaceItemStatus = "attention" | "ready" | "stable";

export interface SdkworkWorkspaceNavigationItem {
  badge?: string;
  description?: string;
  enabled?: boolean;
  id: string;
  label: string;
  order?: number;
  status?: SdkworkWorkspaceItemStatus;
}

export interface SdkworkWorkspaceNavigationSection {
  enabled?: boolean;
  id: string;
  items: readonly SdkworkWorkspaceNavigationItem[];
  order?: number;
  title: string;
}

export interface SdkworkWorkspaceTab {
  badge?: string;
  enabled?: boolean;
  id: string;
  label: string;
  modified?: boolean;
  order?: number;
}

export interface CreateSdkworkWorkspaceBlueprintOptions {
  defaultActiveNavigationItemId?: string;
  defaultActiveTabId?: string;
  description?: string;
  id?: string;
  isBottomPanelOpenByDefault?: boolean;
  isInspectorOpenByDefault?: boolean;
  navigationSections?: readonly SdkworkWorkspaceNavigationSection[];
  tabs?: readonly SdkworkWorkspaceTab[];
  title: string;
}

export interface SdkworkWorkspaceBlueprint {
  defaultActiveNavigationItemId?: string;
  defaultActiveTabId?: string;
  description?: string;
  id: string;
  isBottomPanelOpenByDefault: boolean;
  isInspectorOpenByDefault: boolean;
  navigationSections: SdkworkWorkspaceNavigationSection[];
  tabs: SdkworkWorkspaceTab[];
  title: string;
}

export interface SdkworkWorkspaceBlueprintSummary {
  attentionItemIds: string[];
  defaultActiveNavigationItemId?: string;
  defaultActiveTabId?: string;
  navigationItemIds: string[];
  navigationSectionIds: string[];
  tabIds: string[];
  totalAttentionItems: number;
  totalNavigationItems: number;
  totalTabs: number;
}

export interface SdkworkWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "workspace";
  defaultActiveNavigationItemId?: string;
  defaultActiveTabId?: string;
  isBottomPanelOpenByDefault: boolean;
  isInspectorOpenByDefault: boolean;
  navigationSectionIds: string[];
  tabIds: string[];
}

export interface CreateSdkworkWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  blueprint?: SdkworkWorkspaceBlueprint;
}

function compareOrderLabel(
  left: { label: string; order?: number },
  right: { label: string; order?: number },
): number {
  const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;
  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return left.label.localeCompare(right.label);
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

function normalizeNavigationSections(
  sections: readonly SdkworkWorkspaceNavigationSection[] | undefined,
): SdkworkWorkspaceNavigationSection[] {
  return (sections ?? [])
    .filter((section) => section.enabled !== false)
    .map((section) => ({
      ...section,
      items: [...section.items]
        .filter((item) => item.enabled !== false)
        .sort(compareOrderLabel),
    }))
    .filter((section) => section.items.length > 0)
    .sort(compareOrderTitle);
}

function normalizeTabs(
  tabs: readonly SdkworkWorkspaceTab[] | undefined,
): SdkworkWorkspaceTab[] {
  return [...(tabs ?? [])]
    .filter((tab) => tab.enabled !== false)
    .sort(compareOrderLabel);
}

export function createSdkworkWorkspaceNavigationSections(
  sections: readonly SdkworkWorkspaceNavigationSection[] = [],
): SdkworkWorkspaceNavigationSection[] {
  return normalizeNavigationSections(sections);
}

export function createSdkworkWorkspaceTabs(
  tabs: readonly SdkworkWorkspaceTab[] = [],
): SdkworkWorkspaceTab[] {
  return normalizeTabs(tabs);
}

export function createSdkworkWorkspaceBlueprint({
  defaultActiveNavigationItemId,
  defaultActiveTabId,
  description,
  id = "sdkwork-workspace-blueprint",
  isBottomPanelOpenByDefault = false,
  isInspectorOpenByDefault = true,
  navigationSections,
  tabs,
  title,
}: CreateSdkworkWorkspaceBlueprintOptions): SdkworkWorkspaceBlueprint {
  const normalizedSections = createSdkworkWorkspaceNavigationSections(navigationSections);
  const normalizedTabs = createSdkworkWorkspaceTabs(tabs);

  return {
    ...(defaultActiveNavigationItemId || normalizedSections[0]?.items[0]?.id
      ? {
          defaultActiveNavigationItemId:
            defaultActiveNavigationItemId ?? normalizedSections[0]?.items[0]?.id,
        }
      : {}),
    ...(defaultActiveTabId || normalizedTabs[0]?.id
      ? {
          defaultActiveTabId: defaultActiveTabId ?? normalizedTabs[0]?.id,
        }
      : {}),
    description,
    id,
    isBottomPanelOpenByDefault,
    isInspectorOpenByDefault,
    navigationSections: normalizedSections,
    tabs: normalizedTabs,
    title,
  };
}

export function summarizeSdkworkWorkspaceBlueprint(
  blueprint: SdkworkWorkspaceBlueprint,
): SdkworkWorkspaceBlueprintSummary {
  const attentionItemIds = blueprint.navigationSections.flatMap((section) =>
    section.items
      .filter((item) => item.status === "attention")
      .map((item) => item.id),
  );

  return {
    attentionItemIds,
    ...(blueprint.defaultActiveNavigationItemId
      ? { defaultActiveNavigationItemId: blueprint.defaultActiveNavigationItemId }
      : {}),
    ...(blueprint.defaultActiveTabId ? { defaultActiveTabId: blueprint.defaultActiveTabId } : {}),
    navigationItemIds: blueprint.navigationSections.flatMap((section) =>
      section.items.map((item) => item.id),
    ),
    navigationSectionIds: blueprint.navigationSections.map((section) => section.id),
    tabIds: blueprint.tabs.map((tab) => tab.id),
    totalAttentionItems: attentionItemIds.length,
    totalNavigationItems: blueprint.navigationSections.reduce(
      (count, section) => count + section.items.length,
      0,
    ),
    totalTabs: blueprint.tabs.length,
  };
}

export function createSdkworkWorkspaceManifest({
  blueprint,
  description = blueprint?.description ?? "Composable workspace scaffold for docked panels, tabbed tools, and inspector-driven AI workbenches.",
  host,
  id = "sdkwork-workspace",
  packageNames = ["@sdkwork/workspace-pc-react"],
  theme,
  title = blueprint?.title ?? "Workspace",
}: CreateSdkworkWorkspaceManifestOptions = {}): SdkworkWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniqueStrings(packageNames),
      theme,
      title,
    }),
    capability: "workspace",
    ...(blueprint?.defaultActiveNavigationItemId
      ? { defaultActiveNavigationItemId: blueprint.defaultActiveNavigationItemId }
      : {}),
    ...(blueprint?.defaultActiveTabId ? { defaultActiveTabId: blueprint.defaultActiveTabId } : {}),
    isBottomPanelOpenByDefault: blueprint?.isBottomPanelOpenByDefault ?? false,
    isInspectorOpenByDefault: blueprint?.isInspectorOpenByDefault ?? true,
    navigationSectionIds: blueprint?.navigationSections.map((section) => section.id) ?? [],
    tabIds: blueprint?.tabs.map((tab) => tab.id) ?? [],
  };
}

export const workspacePackageMeta = {
  architecture: "pc-react",
  domain: "foundation",
  package: "@sdkwork/workspace-pc-react",
  status: "ready",
} as const;

export type WorkspacePackageMeta = typeof workspacePackageMeta;
