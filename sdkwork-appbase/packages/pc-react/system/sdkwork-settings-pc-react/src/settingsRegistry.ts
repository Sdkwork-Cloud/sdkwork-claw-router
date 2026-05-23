import { searchDocuments, type SdkworkSearchDocument } from "@sdkwork/search-pc-react";

export type SdkworkSettingsGroup =
  | "account"
  | "ai"
  | "billing"
  | "notifications"
  | "security"
  | "system"
  | "workspace";

export type SdkworkSettingsSaveMode = "auto" | "apply" | "manual";

export interface SdkworkSettingsSection {
  description?: string;
  enabled?: boolean;
  group: SdkworkSettingsGroup;
  hasDangerZone?: boolean;
  id: string;
  keywords?: string[];
  order?: number;
  route: string;
  saveMode?: SdkworkSettingsSaveMode;
  title: string;
}

export interface SdkworkSettingsRegistry {
  groups: Record<SdkworkSettingsGroup, SdkworkSettingsSection[]>;
  navigation: Array<{
    group: SdkworkSettingsGroup;
    sections: SdkworkSettingsSection[];
  }>;
  sections: SdkworkSettingsSection[];
  sectionsById: Record<string, SdkworkSettingsSection>;
}

export type SdkworkSettingsSectionDigestStatus =
  | "attention"
  | "current"
  | "dirty"
  | "restart-required"
  | "restricted"
  | "saving"
  | "standard";

export interface CreateSettingsSectionDigestOptions {
  activeGroup?: SdkworkSettingsGroup;
  attentionSectionIds?: readonly string[];
  currentSectionId?: string;
  dirtySectionIds?: readonly string[];
  restartRequiredSectionIds?: readonly string[];
  savingSectionIds?: readonly string[];
}

export interface SdkworkSettingsSectionDigest {
  description?: string;
  digestStatus: SdkworkSettingsSectionDigestStatus;
  group: SdkworkSettingsGroup;
  hasChanges: boolean;
  hasDangerZone: boolean;
  id: string;
  isAvailable: boolean;
  isCurrent: boolean;
  isSaving: boolean;
  keywordCount: number;
  matchesGroup: boolean;
  needsAttention: boolean;
  requiresRestart: boolean;
  route: string;
  saveMode: SdkworkSettingsSaveMode;
  title: string;
}

export interface SdkworkSettingsSectionDigestSummary {
  applySections: number;
  attentionSections: number;
  autoSaveSections: number;
  availableSections: number;
  currentSections: number;
  dangerSections: number;
  dirtySections: number;
  manualSaveSections: number;
  restartRequiredSections: number;
  restrictedSections: number;
  savingSections: number;
  totalSections: number;
}

export type SdkworkSettingsChangeAction =
  | "apply"
  | "open-section"
  | "restart"
  | "save";

export type SdkworkSettingsChangeIssue =
  | "apply-not-supported"
  | "group-mismatch"
  | "missing-changes"
  | "restart-not-required"
  | "save-not-supported"
  | "saving-in-progress"
  | "section-disabled"
  | "validation-errors";

export interface EvaluateSettingsChangeReadinessOptions {
  action?: SdkworkSettingsChangeAction;
  activeGroup?: SdkworkSettingsGroup;
  hasChanges?: boolean;
  hasValidationErrors?: boolean;
  isSaving?: boolean;
  restartRequired?: boolean;
}

export interface SdkworkSettingsChangeChecklist {
  hasChanges: boolean;
  matchesGroup: boolean;
  passesValidation: boolean;
  restartRequired: boolean;
  supportsApply: boolean;
  supportsManualSave: boolean;
}

export interface SdkworkSettingsChangeCapabilities {
  canApply: boolean;
  canOpenSection: boolean;
  canRestart: boolean;
  canSave: boolean;
}

export interface SdkworkSettingsChangeReadiness {
  capabilities: SdkworkSettingsChangeCapabilities;
  checklist: SdkworkSettingsChangeChecklist;
  degraded: boolean;
  issues: SdkworkSettingsChangeIssue[];
  ready: boolean;
}

const SETTINGS_GROUP_ORDER: readonly SdkworkSettingsGroup[] = [
  "account",
  "workspace",
  "ai",
  "notifications",
  "security",
  "billing",
  "system",
];

function createEmptyGroupRecord(): Record<SdkworkSettingsGroup, SdkworkSettingsSection[]> {
  return SETTINGS_GROUP_ORDER.reduce<Record<SdkworkSettingsGroup, SdkworkSettingsSection[]>>(
    (accumulator, group) => {
      accumulator[group] = [];
      return accumulator;
    },
    {} as Record<SdkworkSettingsGroup, SdkworkSettingsSection[]>,
  );
}

function isEnabled(section: SdkworkSettingsSection): boolean {
  return section.enabled !== false;
}

function resolveSettingsSaveMode(section: SdkworkSettingsSection): SdkworkSettingsSaveMode {
  return section.saveMode ?? "manual";
}

function createIdSet(ids: readonly string[] | undefined): Set<string> {
  return new Set(ids ?? []);
}

function sortSections(sections: readonly SdkworkSettingsSection[]): SdkworkSettingsSection[] {
  return [...sections].sort((left, right) => {
    if (left.group !== right.group) {
      return SETTINGS_GROUP_ORDER.indexOf(left.group) - SETTINGS_GROUP_ORDER.indexOf(right.group);
    }

    const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.title.localeCompare(right.title);
  });
}

function toSearchDocument(section: SdkworkSettingsSection): SdkworkSearchDocument {
  return {
    description: section.description,
    group: section.group,
    id: section.id,
    keywords: section.keywords,
    title: section.title,
  };
}

export function createSettingsRegistry(
  sections: readonly SdkworkSettingsSection[],
): SdkworkSettingsRegistry {
  const sectionsById: Record<string, SdkworkSettingsSection> = {};

  for (const section of sections) {
    if (sectionsById[section.id]) {
      throw new Error(`Duplicate settings section id: ${section.id}`);
    }

    sectionsById[section.id] = section;
  }

  const sortedSections = sortSections(sections);
  const groups = createEmptyGroupRecord();

  for (const section of sortedSections) {
    groups[section.group].push(section);
  }

  return {
    groups,
    navigation: SETTINGS_GROUP_ORDER.map((group) => ({
      group,
      sections: groups[group],
    })).filter((group) => group.sections.length > 0),
    sections: sortedSections,
    sectionsById,
  };
}

export function resolveDefaultSettingsSection(
  registry: Pick<SdkworkSettingsRegistry, "sections">,
): SdkworkSettingsSection | undefined {
  return registry.sections[0];
}

export function searchSettingsRegistry(
  registry: SdkworkSettingsRegistry,
  query: string,
): SdkworkSettingsSection[] {
  return searchDocuments(registry.sections.map(toSearchDocument), query)
    .map((result) => registry.sectionsById[result.document.id])
    .filter((section): section is SdkworkSettingsSection => Boolean(section));
}

export function createSettingsSectionDigest(
  section: SdkworkSettingsSection,
  options: CreateSettingsSectionDigestOptions = {},
): SdkworkSettingsSectionDigest {
  const dirtySectionIds = createIdSet(options.dirtySectionIds);
  const savingSectionIds = createIdSet(options.savingSectionIds);
  const attentionSectionIds = createIdSet(options.attentionSectionIds);
  const restartRequiredSectionIds = createIdSet(options.restartRequiredSectionIds);

  const isAvailable = isEnabled(section);
  const isCurrent = options.currentSectionId === section.id;
  const hasChanges = dirtySectionIds.has(section.id);
  const isSaving = savingSectionIds.has(section.id);
  const needsAttention = attentionSectionIds.has(section.id);
  const requiresRestart = restartRequiredSectionIds.has(section.id);
  const matchesGroup = options.activeGroup ? options.activeGroup === section.group : true;
  const saveMode = resolveSettingsSaveMode(section);

  let digestStatus: SdkworkSettingsSectionDigestStatus = "standard";
  if (!isAvailable) {
    digestStatus = "restricted";
  } else if (isSaving) {
    digestStatus = "saving";
  } else if (isCurrent) {
    digestStatus = "current";
  } else if (needsAttention) {
    digestStatus = "attention";
  } else if (requiresRestart) {
    digestStatus = "restart-required";
  } else if (hasChanges) {
    digestStatus = "dirty";
  }

  return {
    description: section.description,
    digestStatus,
    group: section.group,
    hasChanges,
    hasDangerZone: section.hasDangerZone === true,
    id: section.id,
    isAvailable,
    isCurrent,
    isSaving,
    keywordCount: section.keywords?.length ?? 0,
    matchesGroup,
    needsAttention,
    requiresRestart,
    route: section.route,
    saveMode,
    title: section.title,
  };
}

export function summarizeSettingsSectionDigests(
  digests: readonly SdkworkSettingsSectionDigest[],
): SdkworkSettingsSectionDigestSummary {
  return digests.reduce<SdkworkSettingsSectionDigestSummary>(
    (summary, digest) => {
      summary.totalSections += 1;

      if (digest.isAvailable) {
        summary.availableSections += 1;
      } else {
        summary.restrictedSections += 1;
      }

      if (digest.isCurrent) {
        summary.currentSections += 1;
      }

      if (digest.hasChanges) {
        summary.dirtySections += 1;
      }

      if (digest.isSaving) {
        summary.savingSections += 1;
      }

      if (digest.needsAttention) {
        summary.attentionSections += 1;
      }

      if (digest.requiresRestart) {
        summary.restartRequiredSections += 1;
      }

      if (digest.hasDangerZone) {
        summary.dangerSections += 1;
      }

      if (digest.saveMode === "auto") {
        summary.autoSaveSections += 1;
      } else if (digest.saveMode === "apply") {
        summary.applySections += 1;
      } else {
        summary.manualSaveSections += 1;
      }

      return summary;
    },
    {
      applySections: 0,
      attentionSections: 0,
      autoSaveSections: 0,
      availableSections: 0,
      currentSections: 0,
      dangerSections: 0,
      dirtySections: 0,
      manualSaveSections: 0,
      restartRequiredSections: 0,
      restrictedSections: 0,
      savingSections: 0,
      totalSections: 0,
    },
  );
}

export function evaluateSettingsChangeReadiness(
  section: SdkworkSettingsSection,
  options: EvaluateSettingsChangeReadinessOptions = {},
): SdkworkSettingsChangeReadiness {
  const action = options.action ?? "open-section";
  const isAvailable = isEnabled(section);
  const saveMode = resolveSettingsSaveMode(section);
  const hasChanges = options.hasChanges === true;
  const matchesGroup = options.activeGroup ? options.activeGroup === section.group : true;
  const passesValidation = options.hasValidationErrors !== true;
  const isSaving = options.isSaving === true;
  const restartRequired = options.restartRequired === true;
  const supportsManualSave = saveMode === "manual";
  const supportsApply = saveMode === "apply";

  const capabilities: SdkworkSettingsChangeCapabilities = {
    canApply: isAvailable && supportsApply && hasChanges && passesValidation && !isSaving,
    canOpenSection: isAvailable,
    canRestart: isAvailable && restartRequired && !isSaving,
    canSave: isAvailable && supportsManualSave && hasChanges && passesValidation && !isSaving,
  };

  const checklist: SdkworkSettingsChangeChecklist = {
    hasChanges,
    matchesGroup,
    passesValidation,
    restartRequired,
    supportsApply,
    supportsManualSave,
  };

  const issues: SdkworkSettingsChangeIssue[] = [];
  if (!isAvailable) {
    issues.push("section-disabled");
  }

  if (!matchesGroup) {
    issues.push("group-mismatch");
  }

  if (action === "save" || action === "apply" || action === "restart") {
    if (isSaving) {
      issues.push("saving-in-progress");
    }
  }

  if (action === "save") {
    if (!supportsManualSave) {
      issues.push("save-not-supported");
    } else if (!hasChanges) {
      issues.push("missing-changes");
    }

    if (!passesValidation) {
      issues.push("validation-errors");
    }
  }

  if (action === "apply") {
    if (!supportsApply) {
      issues.push("apply-not-supported");
    } else if (!hasChanges) {
      issues.push("missing-changes");
    }

    if (!passesValidation) {
      issues.push("validation-errors");
    }
  }

  if (action === "restart" && !restartRequired) {
    issues.push("restart-not-required");
  }

  const ready =
    action === "save"
      ? capabilities.canSave
      : action === "apply"
        ? capabilities.canApply
        : action === "restart"
          ? capabilities.canRestart
          : capabilities.canOpenSection;

  return {
    capabilities,
    checklist,
    degraded: issues.includes("group-mismatch"),
    issues,
    ready,
  };
}

export const settingsPackageMeta = {
  architecture: "pc-react",
  domain: "system",
  package: "@sdkwork/settings-pc-react",
  status: "ready",
} as const;

export type SettingsPackageMeta = typeof settingsPackageMeta;
