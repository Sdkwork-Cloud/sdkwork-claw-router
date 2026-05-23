import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";

export type SdkworkSkillTriggerKind =
  | "command"
  | "event"
  | "manual"
  | "schedule"
  | "shortcut"
  | "webhook";
export type SdkworkSkillInstallState =
  | "available"
  | "installed"
  | "installing"
  | "update-available";
export type SdkworkSkillReadiness =
  | "disabled"
  | "installing"
  | "missing-requirements"
  | "not-installed"
  | "ready";
export type SdkworkSkillScope = "agent" | "bundled" | "managed" | "workspace";
export type SdkworkSkillReusePolicy =
  | "assistant-only"
  | "shared"
  | "workflow-only";
export type SdkworkSkillReuseTarget = "assistant" | "workflow";
export type SdkworkSkillCatalogSortMode = "latest" | "name" | "readiness";

export interface SdkworkSkillTriggerDescriptor {
  id: string;
  kind: SdkworkSkillTriggerKind;
  label: string;
}

export interface SdkworkSkillMissingRequirements {
  bins: readonly string[];
  config: readonly string[];
  env: readonly string[];
}

export interface SdkworkSkillDefinition {
  category: string;
  description: string;
  enabled: boolean;
  id: string;
  installState: SdkworkSkillInstallState;
  missing: SdkworkSkillMissingRequirements;
  name: string;
  reusePolicy: SdkworkSkillReusePolicy;
  scope: SdkworkSkillScope;
  tags: readonly string[];
  triggers: readonly SdkworkSkillTriggerDescriptor[];
  updatedAt: number;
}

export interface SdkworkSkillsCatalogSummary {
  assistantReadySkillIds: string[];
  installStateCounts: Record<SdkworkSkillInstallState, number>;
  readinessCounts: Record<SdkworkSkillReadiness, number>;
  skillCount: number;
  triggerCounts: Record<SdkworkSkillTriggerKind, number>;
  workflowReadySkillIds: string[];
}

export interface FilterSkillsOptions {
  installState?: readonly SdkworkSkillInstallState[];
  query?: string;
  readiness?: readonly SdkworkSkillReadiness[];
  sort?: SdkworkSkillCatalogSortMode;
  tags?: readonly string[];
  target?: SdkworkSkillReuseTarget;
  triggerKinds?: readonly SdkworkSkillTriggerKind[];
}

export interface BuildSkillCapabilityBlockOptions {
  maxSkills?: number;
  target?: SdkworkSkillReuseTarget;
}

export interface SdkworkSkillsWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "skills";
  detailRoutePattern: string;
  routePath: string;
}

export interface CreateSkillsWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkSkillsLibraryRouteIntent {
  focusWindow: boolean;
  readiness?: SdkworkSkillReadiness;
  route: string;
  source: "skills-workspace";
  target?: SdkworkSkillReuseTarget;
  trigger?: SdkworkSkillTriggerKind;
  type: "skills-library-route-intent";
}

export interface CreateSkillsLibraryRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  readiness?: SdkworkSkillReadiness;
  target?: SdkworkSkillReuseTarget;
  trigger?: SdkworkSkillTriggerKind;
}

export interface SdkworkSkillDetailRouteIntent {
  focusWindow: boolean;
  route: string;
  skillId: string;
  source: "skills-workspace";
  type: "skills-detail-route-intent";
}

export interface CreateSkillDetailRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

const SKILL_READINESS_ORDER: readonly SdkworkSkillReadiness[] = [
  "ready",
  "missing-requirements",
  "disabled",
  "installing",
  "not-installed",
];

function createInstallStateCounts(): Record<SdkworkSkillInstallState, number> {
  return {
    available: 0,
    installed: 0,
    installing: 0,
    "update-available": 0,
  };
}

function createReadinessCounts(): Record<SdkworkSkillReadiness, number> {
  return {
    disabled: 0,
    installing: 0,
    "missing-requirements": 0,
    "not-installed": 0,
    ready: 0,
  };
}

function createTriggerCounts(): Record<SdkworkSkillTriggerKind, number> {
  return {
    command: 0,
    event: 0,
    manual: 0,
    schedule: 0,
    shortcut: 0,
    webhook: 0,
  };
}

function normalizeQuery(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return Array.from(new Set(packageNames.map((packageName) => packageName.trim()).filter(Boolean)));
}

function hasMissingRequirements(missing: SdkworkSkillMissingRequirements): boolean {
  return missing.bins.length > 0 || missing.config.length > 0 || missing.env.length > 0;
}

function searchValues(skill: SdkworkSkillDefinition): string[] {
  return [
    skill.id,
    skill.name,
    skill.description,
    skill.category,
    skill.installState,
    skill.reusePolicy,
    skill.scope,
    ...skill.tags,
    ...skill.triggers.flatMap((trigger) => [trigger.kind, trigger.label]),
  ];
}

function compareReadiness(
  left: SdkworkSkillReadiness,
  right: SdkworkSkillReadiness,
): number {
  return SKILL_READINESS_ORDER.indexOf(left) - SKILL_READINESS_ORDER.indexOf(right);
}

function sortSkillsByMode(
  skills: readonly SdkworkSkillDefinition[],
  mode: SdkworkSkillCatalogSortMode = "latest",
): SdkworkSkillDefinition[] {
  return [...skills].sort((left, right) => {
    if (mode === "readiness") {
      const readinessDifference = compareReadiness(
        resolveSkillReadiness(left),
        resolveSkillReadiness(right),
      );
      if (readinessDifference !== 0) {
        return readinessDifference;
      }
    }

    if (mode === "latest") {
      const updatedDifference = right.updatedAt - left.updatedAt;
      if (updatedDifference !== 0) {
        return updatedDifference;
      }
    }

    return left.name.localeCompare(right.name);
  });
}

function triggerKindsForSkill(
  skill: Pick<SdkworkSkillDefinition, "triggers">,
): SdkworkSkillTriggerKind[] {
  return Array.from(
    new Set(
      skill.triggers
        .map((trigger) => trigger.kind)
        .filter((kind): kind is SdkworkSkillTriggerKind => Boolean(kind)),
    ),
  );
}

export function resolveSkillReadiness(
  skill: Pick<SdkworkSkillDefinition, "enabled" | "installState" | "missing">,
): SdkworkSkillReadiness {
  if (skill.installState === "available") {
    return "not-installed";
  }

  if (skill.installState === "installing") {
    return "installing";
  }

  if (!skill.enabled) {
    return "disabled";
  }

  if (hasMissingRequirements(skill.missing)) {
    return "missing-requirements";
  }

  return "ready";
}

export function supportsSkillReuseTarget(
  skill: Pick<SdkworkSkillDefinition, "reusePolicy">,
  target: SdkworkSkillReuseTarget,
): boolean {
  if (skill.reusePolicy === "shared") {
    return true;
  }

  if (target === "assistant") {
    return skill.reusePolicy === "assistant-only";
  }

  return skill.reusePolicy === "workflow-only";
}

export function summarizeSkillsCatalog(
  skills: readonly SdkworkSkillDefinition[],
): SdkworkSkillsCatalogSummary {
  const installStateCounts = createInstallStateCounts();
  const readinessCounts = createReadinessCounts();
  const triggerCounts = createTriggerCounts();
  const assistantReadySkillIds: string[] = [];
  const workflowReadySkillIds: string[] = [];

  for (const skill of skills) {
    installStateCounts[skill.installState] += 1;

    const readiness = resolveSkillReadiness(skill);
    readinessCounts[readiness] += 1;

    for (const kind of triggerKindsForSkill(skill)) {
      triggerCounts[kind] += 1;
    }

    if (readiness === "ready" && supportsSkillReuseTarget(skill, "assistant")) {
      assistantReadySkillIds.push(skill.id);
    }

    if (readiness === "ready" && supportsSkillReuseTarget(skill, "workflow")) {
      workflowReadySkillIds.push(skill.id);
    }
  }

  assistantReadySkillIds.sort((left, right) => left.localeCompare(right));
  workflowReadySkillIds.sort((left, right) => left.localeCompare(right));

  return {
    assistantReadySkillIds,
    installStateCounts,
    readinessCounts,
    skillCount: skills.length,
    triggerCounts,
    workflowReadySkillIds,
  };
}

export function filterSkills(
  skills: readonly SdkworkSkillDefinition[],
  options: FilterSkillsOptions = {},
): SdkworkSkillDefinition[] {
  const installState = options.installState ? new Set(options.installState) : null;
  const readiness = options.readiness ? new Set(options.readiness) : null;
  const tags = options.tags ?? [];
  const triggerKinds = options.triggerKinds ? new Set(options.triggerKinds) : null;
  const query = normalizeQuery(options.query);

  return sortSkillsByMode(skills, options.sort)
    .filter((skill) => (installState ? installState.has(skill.installState) : true))
    .filter((skill) => (readiness ? readiness.has(resolveSkillReadiness(skill)) : true))
    .filter((skill) => (options.target ? supportsSkillReuseTarget(skill, options.target) : true))
    .filter((skill) => (tags.length > 0 ? tags.every((tag) => skill.tags.includes(tag)) : true))
    .filter((skill) =>
      triggerKinds ? triggerKindsForSkill(skill).some((kind) => triggerKinds.has(kind)) : true,
    )
    .filter((skill) =>
      query ? searchValues(skill).some((value) => value.toLowerCase().includes(query)) : true,
    );
}

export function buildSkillCapabilityBlock(
  skills: readonly SdkworkSkillDefinition[],
  options: BuildSkillCapabilityBlockOptions = {},
): string {
  const compatibleSkills = filterSkills(skills, {
    readiness: ["ready"],
    target: options.target,
  }).slice(0, options.maxSkills ?? Number.POSITIVE_INFINITY);

  if (compatibleSkills.length === 0) {
    return "";
  }

  return [
    "Skill Capabilities:",
    ...compatibleSkills.flatMap((skill, index) => [
      `${index + 1}. ${skill.name} [${skill.reusePolicy}] triggers: ${triggerKindsForSkill(skill).join(", ")}`,
      skill.description,
    ]),
  ].join("\n");
}

export function createSkillsWorkspaceManifest({
  description = "Skills workspace for trigger catalogs, install readiness, and assistant-workflow reuse routing.",
  host,
  id = "sdkwork-skills",
  packageNames = ["@sdkwork/skills-pc-react"],
  routePath = "/skills",
  theme,
  title = "Skills",
}: CreateSkillsWorkspaceManifestOptions = {}): SdkworkSkillsWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "skills",
    detailRoutePattern: `${routePath}/:skillId`,
    routePath,
  };
}

export function createSkillsLibraryRouteIntent(
  options: CreateSkillsLibraryRouteIntentOptions = {},
): SdkworkSkillsLibraryRouteIntent {
  const queryParams = new URLSearchParams();

  if (options.target) {
    queryParams.set("target", options.target);
  }

  if (options.trigger) {
    queryParams.set("trigger", options.trigger);
  }

  if (options.readiness) {
    queryParams.set("readiness", options.readiness);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    focusWindow: options.focusWindow !== false,
    ...(options.readiness ? { readiness: options.readiness } : {}),
    route: `${options.basePath ?? "/skills"}${querySuffix}`,
    source: "skills-workspace",
    ...(options.target ? { target: options.target } : {}),
    ...(options.trigger ? { trigger: options.trigger } : {}),
    type: "skills-library-route-intent",
  };
}

export function createSkillDetailRouteIntent(
  skillId: string,
  options: CreateSkillDetailRouteIntentOptions = {},
): SdkworkSkillDetailRouteIntent {
  return {
    focusWindow: options.focusWindow !== false,
    route: `${options.basePath ?? "/skills"}/${skillId}`,
    skillId,
    source: "skills-workspace",
    type: "skills-detail-route-intent",
  };
}

export const skillsPackageMeta = {
  architecture: "pc-react",
  domain: "intelligence",
  package: "@sdkwork/skills-pc-react",
  status: "ready",
} as const;

export type SkillsPackageMeta = typeof skillsPackageMeta;
